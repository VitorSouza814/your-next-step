import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/financeiro/entradas")({
  head: () => ({ meta: [{ title: "Entradas | Gerenciador Avançado" }, { name: "description", content: "Entradas para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:title", content: "Entradas | Gerenciador Avançado" }, { property: "og:description", content: "Entradas para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="entradas" />,
});
