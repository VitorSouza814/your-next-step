import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/buscar")({
  head: () => ({ meta: [{ title: "Buscar leads | Gerenciador Avançado" }, { name: "description", content: "Buscar leads para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Buscar leads | Gerenciador Avançado" }, { property: "og:description", content: "Buscar leads para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="buscar" />,
});
