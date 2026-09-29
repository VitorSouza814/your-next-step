import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/financeiro/recorrencias")({
  head: () => ({ meta: [{ title: "Recorrências | Gerenciador Avançado" }, { name: "description", content: "Recorrências para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:title", content: "Recorrências | Gerenciador Avançado" }, { property: "og:description", content: "Recorrências para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="recorrencias" />,
});
