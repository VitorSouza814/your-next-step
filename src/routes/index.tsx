import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard | Gerenciador Avançado" }, { name: "description", content: "Dashboard para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Dashboard | Gerenciador Avançado" }, { property: "og:description", content: "Dashboard para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="dashboard" />,
});
