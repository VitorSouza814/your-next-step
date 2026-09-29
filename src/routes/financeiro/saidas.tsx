import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/financeiro/saidas")({
  head: () => ({ meta: [{ title: "Saídas | Gerenciador Avançado" }, { name: "description", content: "Saídas para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:title", content: "Saídas | Gerenciador Avançado" }, { property: "og:description", content: "Saídas para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="saidas" />,
});
