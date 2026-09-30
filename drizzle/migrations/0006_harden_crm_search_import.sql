CREATE OR REPLACE FUNCTION public.import_search_to_crm(p_search_id uuid, p_place_ids text[] DEFAULT NULL::text[])
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_search public.searches;
  v_item jsonb;
  v_lead_id uuid;
  v_created int := 0;
  v_updated int := 0;
  v_review int := 0;
  v_needs_review boolean;
  v_inserted_id uuid;
  v_place_id text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Login necessário'; END IF;
  SELECT * INTO v_search FROM public.searches WHERE id = p_search_id AND user_id = auth.uid() AND status = 'done';
  IF NOT FOUND THEN RAISE EXCEPTION 'Pesquisa não encontrada'; END IF;
  FOR v_item IN SELECT value FROM jsonb_array_elements(v_search.results) LOOP
    v_place_id := v_item->>'id';
    IF v_place_id IS NULL OR length(v_place_id) < 2 OR (p_place_ids IS NOT NULL AND NOT (v_place_id = ANY(p_place_ids))) THEN CONTINUE; END IF;
    -- Serialize a company's imports within this account, including simultaneous searches.
    PERFORM pg_advisory_xact_lock(hashtextextended(auth.uid()::text || ':' || v_place_id, 0));
    v_needs_review := coalesce(nullif(trim(v_item->>'nome'), ''), 'Sem nome') = 'Sem nome'
      OR coalesce(v_item->>'businessStatus', '') = 'CLOSED_PERMANENTLY';
    v_lead_id := NULL;
    INSERT INTO public.saved_leads(user_id,place_id,name,address,phone,website,rating,reviews,maps_url,sector,review_needed)
    VALUES(auth.uid(),v_place_id,coalesce(nullif(trim(v_item->>'nome'),''),'Sem nome'),coalesce(v_item->>'endereco',''),v_item->>'telefone',v_item->>'site',nullif(v_item->>'nota','')::numeric,nullif(v_item->>'avaliacoes','')::integer,v_item->>'mapsUrl',v_search.sector,v_needs_review)
    ON CONFLICT (user_id,place_id) DO NOTHING RETURNING id INTO v_lead_id;
    IF v_lead_id IS NULL THEN
      SELECT id INTO v_lead_id FROM public.saved_leads WHERE user_id=auth.uid() AND place_id=v_place_id;
    END IF;
    IF v_lead_id IS NULL THEN RAISE EXCEPTION 'Não foi possível vincular a empresa'; END IF;
    IF v_needs_review THEN
      UPDATE public.saved_leads SET review_needed=true WHERE id=v_lead_id AND user_id=auth.uid() AND review_needed=false;
      v_review := v_review + 1;
    END IF;
    INSERT INTO public.search_leads(user_id,search_id,lead_id) VALUES(auth.uid(),p_search_id,v_lead_id) ON CONFLICT DO NOTHING;
    v_inserted_id := NULL;
    IF NOT v_needs_review AND NOT EXISTS (SELECT 1 FROM public.saved_leads WHERE id=v_lead_id AND do_not_contact)
       AND NOT EXISTS (SELECT 1 FROM public.opportunities WHERE user_id=auth.uid() AND lead_id=v_lead_id) THEN
      INSERT INTO public.opportunities(user_id,lead_id,title,stage_id,diagnosis,analysis_status)
      VALUES(auth.uid(),v_lead_id,coalesce(nullif(trim(v_item->>'nome'),''),'Sem nome') || ' — qualificação inicial','new',CASE WHEN v_item->>'site' IS NULL THEN 'Sem site' ELSE 'Site informado' END,'pending')
      ON CONFLICT DO NOTHING RETURNING id INTO v_inserted_id;
    END IF;
    IF v_inserted_id IS NOT NULL THEN v_created := v_created + 1;
    ELSE v_updated := v_updated + 1; END IF;
  END LOOP;
  RETURN jsonb_build_object('created',v_created,'updated',v_updated,'review',v_review);
END
$$;
REVOKE ALL ON FUNCTION public.import_search_to_crm(uuid,text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.import_search_to_crm(uuid,text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.import_search_to_crm(uuid,text[]) TO service_role;