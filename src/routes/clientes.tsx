import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes | Gerenciador Avançado" }, { name: "description", content: "Clientes para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:title", content: "Clientes | Gerenciador Avançado" }, { property: "og:description", content: "Clientes para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="clientes" />,
});
