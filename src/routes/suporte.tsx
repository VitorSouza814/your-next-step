import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/suporte")({
  head: () => ({ meta: [{ title: "Suporte | Gerenciador Avançado" }, { name: "description", content: "Suporte para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Suporte | Gerenciador Avançado" }, { property: "og:description", content: "Suporte para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="suporte" />,
});
