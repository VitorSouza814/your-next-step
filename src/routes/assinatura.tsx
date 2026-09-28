import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/lib/workspace";
export const Route = createFileRoute("/assinatura")({
  head: () => ({ meta: [{ title: "Assinatura | Gerenciador Avançado" }, { name: "description", content: "Assinatura para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:title", content: "Assinatura | Gerenciador Avançado" }, { property: "og:description", content: "Assinatura para prospecção de empresas e gestão de leads no Gerenciador Avançado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Workspace section="assinatura" />,
});
