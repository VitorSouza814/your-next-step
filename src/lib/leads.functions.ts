import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LeadResult = { id: string; nome: string; endereco: string; telefone: string | null; site: string | null; email: string | null; nota: number | null; avaliacoes: number | null; mapsUrl: string | null; fotos: number; horario: boolean };
export type BuscaResposta = { total: number; semSite: number; leads: LeadResult[]; searchId?: string; imported?: { created: number; updated: number; review: number } | undefined };
type Place = { id?: string; displayName?: { text?: string }; formattedAddress?: string; nationalPhoneNumber?: string; websiteUri?: string; rating?: number; userRatingCount?: number; googleMapsUri?: string; photos?: unknown[]; regularOpeningHours?: unknown };
const FIELDS = "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.photos,places.regularOpeningHours,nextPageToken";

export const buscarLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { nicho: string; cidade: string; autoCrm?: boolean }) => {
    const nicho = (input?.nicho ?? "").trim().slice(0, 80);
    const cidade = (input?.cidade ?? "").trim().slice(0, 80);
    if (nicho.length < 2 || cidade.length < 2) throw new Error("Informe o setor e a cidade.");
    return { nicho, cidade, autoCrm: input.autoCrm !== false };
  })
  .handler(async ({ data, context }): Promise<BuscaResposta> => {
    const { data: searchId, error: debitError } = await context.supabase.rpc("consume_search", { p_sector: data.nicho, p_city: data.cidade });
    if (debitError || !searchId) throw new Error(debitError?.message.includes("Créditos insuficientes") ? "Créditos insuficientes para buscar." : "Não foi possível iniciar a busca.");
    let success = false;
    let imported: BuscaResposta["imported"];
    let leads: LeadResult[] = [];
    try {
      const lovableKey = process.env["LOVABLE_API_KEY"];
      const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
      if (!lovableKey || !mapsKey) throw new Error("A busca no Google não está configurada.");
      const places: Place[] = [];
      let token: string | undefined;
      for (let page = 0; page < 3; page++) {
        const response = await fetch("https://connector-gateway.lovable.dev/google_maps/places/v1/places:searchText", {
          method: "POST", headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": mapsKey, "Content-Type": "application/json", "X-Goog-FieldMask": FIELDS },
          body: JSON.stringify({ textQuery: `${data.nicho} em ${data.cidade}`, pageSize: 20, languageCode: "pt-BR", regionCode: "BR", ...(token ? { pageToken: token } : {}) }),
        });
        if (!response.ok) { const body = await response.text(); console.error(`Places [${response.status}]: ${body}`); throw new Error(`A busca no Google falhou [${response.status}].`); }
        const json = await response.json() as { places?: Place[]; nextPageToken?: string };
        places.push(...(json.places ?? []));
        if (!json.nextPageToken) break;
        token = json.nextPageToken;
      }
      leads = places.filter((p) => p.id).map((p) => ({ id: p.id ?? "", nome: p.displayName?.text ?? "Sem nome", endereco: p.formattedAddress ?? "", telefone: p.nationalPhoneNumber ?? null, site: p.websiteUri ?? null, email: null, nota: p.rating ?? null, avaliacoes: p.userRatingCount ?? null, mapsUrl: p.googleMapsUri ?? null, fotos: p.photos?.length ?? 0, horario: Boolean(p.regularOpeningHours) }));
      success = true;
    } finally {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.rpc("finish_search", { p_id: searchId, p_results: leads as unknown as import("@/integrations/supabase/types").Json, p_success: success });
      if (error) console.error("Falha ao registrar busca:", error);
    }
    if (success && data.autoCrm) {
      const { data: summary, error } = await context.supabase.rpc("import_search_to_crm", { p_search_id: searchId });
      if (error) console.error("Falha ao enviar leads ao CRM:", error);
      else imported = summary as BuscaResposta["imported"];
    }
    return { total: leads.length, semSite: leads.filter((l) => !l.site).length, leads, searchId, imported };
  });
