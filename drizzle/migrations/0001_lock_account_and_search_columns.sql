REVOKE UPDATE ON public.accounts FROM authenticated;
GRANT UPDATE (display_name, notify_email) ON public.accounts TO authenticated;
REVOKE INSERT ON public.accounts FROM authenticated;
CREATE FUNCTION public.ensure_account() RETURNS public.accounts LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE v_account public.accounts; BEGIN IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Login necessário'; END IF; INSERT INTO public.accounts(user_id) VALUES(auth.uid()) ON CONFLICT (user_id) DO NOTHING; SELECT * INTO v_account FROM public.accounts WHERE user_id = auth.uid(); RETURN v_account; END $$;
REVOKE ALL ON FUNCTION public.ensure_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_account() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.finish_search(uuid,jsonb,boolean) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.consume_search(text,text) FROM anon;