import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/exportacoes")({
  head: () => ({ meta: [{ title: "Exportações | Gerenciador Avançado" }, { name: "description", content: "Exportações para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Exportações | Gerenciador Avançado" }, { property: "og:description", content: "Exportações para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="exportacoes" />,
});
