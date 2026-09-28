import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações | Gerenciador Avançado" }, { name: "description", content: "Configurações para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Configurações | Gerenciador Avançado" }, { property: "og:description", content: "Configurações para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="configuracoes" />,
});
