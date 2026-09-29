import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/servicos")({
  head: () => ({ meta: [{ title: "Serviços | Gerenciador Avançado" }, { name: "description", content: "Serviços para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:title", content: "Serviços | Gerenciador Avançado" }, { property: "og:description", content: "Serviços para prospecção e gestão comercial no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="servicos" />,
});
