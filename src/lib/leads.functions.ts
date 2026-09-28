import { createServerFn } from "@tanstack/react-start";

export type LeadResult = {
  id: string;
  nome: string;
  endereco: string;
  telefone: string | null;
  site: string | null;
  nota: number | null;
  avaliacoes: number | null;
  mapsUrl: string | null;
};

export type BuscaResposta = {
  total: number;
  semSite: number;
  leads: LeadResult[];
};

type PlacesPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "nextPageToken",
].join(",");

export const buscarLeads = createServerFn({ method: "POST" })
  .inputValidator((input: { nicho: string; cidade: string }) => {
    const nicho = (input?.nicho ?? "").trim().slice(0, 80);
    const cidade = (input?.cidade ?? "").trim().slice(0, 80);
    if (nicho.length < 2) throw new Error("Informe o nicho que deseja buscar.");
    if (cidade.length < 2) throw new Error("Informe a cidade da busca.");
    return { nicho, cidade };
  })
  .handler(async ({ data }): Promise<BuscaResposta> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
    if (!lovableKey || !mapsKey) {
      throw new Error("A busca no Google não está configurada neste projeto.");
    }

    const headers = {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": mapsKey,
      "Content-Type": "application/json",
      "X-Goog-FieldMask": FIELD_MASK,
    };

    const places: PlacesPlace[] = [];
    let pageToken: string | undefined;

    // Limite rígido: no máximo 3 páginas (60 resultados) por busca.
    for (let page = 0; page < 3; page++) {
      const response = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          textQuery: `${data.nicho} em ${data.cidade}`,
          pageSize: 20,
          languageCode: "pt-BR",
          regionCode: "BR",
          ...(pageToken ? { pageToken } : {}),
        }),
      });

      if (response.status === 403) {
        const body = await response.text();
        console.error(`Places 403: ${body}`);
        throw new Error("O Google recusou a busca (permissão da chave). Verifique a conexão do Google Maps.");
      }
      if (!response.ok) {
        const body = await response.text();
        console.error(`Places falhou [${response.status}]: ${body}`);
        throw new Error(`A busca no Google falhou [${response.status}].`);
      }

      const json = (await response.json()) as { places?: PlacesPlace[]; nextPageToken?: string };
      places.push(...(json.places ?? []));
      if (!json.nextPageToken) break;
      pageToken = json.nextPageToken;
    }

    const leads: LeadResult[] = places
      .filter((p) => p.id)
      .map((p) => ({
        id: p.id as string,
        nome: p.displayName?.text ?? "Sem nome",
        endereco: p.formattedAddress ?? "",
        telefone: p.nationalPhoneNumber ?? null,
        site: p.websiteUri ?? null,
        nota: p.rating ?? null,
        avaliacoes: p.userRatingCount ?? null,
        mapsUrl: p.googleMapsUri ?? null,
      }));

    return {
      total: leads.length,
      semSite: leads.filter((l) => !l.site).length,
      leads,
    };
  });
