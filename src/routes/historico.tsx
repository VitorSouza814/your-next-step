import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico de busca | Gerenciador Avançado" }, { name: "description", content: "Histórico de busca para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Histórico de busca | Gerenciador Avançado" }, { property: "og:description", content: "Histórico de busca para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="historico" />,
});
