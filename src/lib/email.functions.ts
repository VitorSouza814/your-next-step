import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const findLeadEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { leadId: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(input?.leadId ?? "")) throw new Error("Lead inválido.");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: lead, error } = await context.supabase.from("saved_leads").select("website").eq("id", data.leadId).eq("user_id", context.userId).single();
    if (error || !lead?.website) throw new Error("Este lead não tem website.");
    let url: URL;
    try { url = new URL(lead.website); } catch { throw new Error("Website inválido."); }
    const host = url.hostname.toLowerCase();
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.port || !host.includes(".") || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || /^(?:\d+\.){3}\d+$/.test(host) || host.includes(":") || host.endsWith(".localhost")) throw new Error("Website não permitido.");
    let response: Response;
    try { response = await fetch(url.toString(), { redirect: "manual", signal: AbortSignal.timeout(6000), headers: { Accept: "text/html" } }); } catch { throw new Error("Não foi possível acessar o website."); }
    if (!response.ok || !(response.headers.get("content-type") ?? "").includes("text/html")) throw new Error("O website não disponibilizou uma página HTML pública.");
    const html = (await response.text()).slice(0, 300_000);
    const emails = [...html.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map(m => m[0]).filter(e => !/\.(?:png|jpg|jpeg|gif|svg|webp|js|css)$/i.test(e));
    const email = emails.find(e => !/example\.|sentry\.|wixpress\./i.test(e)) ?? null;
    if (email) {
      const { error: saveError } = await context.supabase.from("saved_leads").update({ email }).eq("id", data.leadId).eq("user_id", context.userId);
      if (saveError) throw new Error("E-mail encontrado, mas não foi possível salvar.");
    }
    return { email };
  });
