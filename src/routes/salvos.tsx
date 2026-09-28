import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/salvos")({
  head: () => ({ meta: [{ title: "Leads salvos | Gerenciador Avançado" }, { name: "description", content: "Leads salvos para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Leads salvos | Gerenciador Avançado" }, { property: "og:description", content: "Leads salvos para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="salvos" />,
});
