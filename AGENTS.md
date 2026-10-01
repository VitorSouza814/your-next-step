<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Regras do projeto

- A busca de empresas usa Places API (New) via gateway do conector `google_maps`, chamada apenas em `src/lib/leads.functions.ts` (server function) — a chave nunca vai para o navegador. Limite fixo de 3 páginas (60 resultados) por busca para conter custo.
- A carteira canônica é `saved_leads` no Lovable Cloud, associada a `search_leads` e `opportunities`; não use localStorage para dados comerciais, pois permissões e deduplicação pertencem ao servidor.
- O CRM mantém oportunidades, etapas e atividades separadas das empresas e das entradas/saídas financeiras; propostas não são recebimentos, e mover uma etapa não registra contato.
- A importação de pesquisas no CRM usa `import_search_to_crm` com unicidade no banco; buscas antigas exigem ação explícita para evitar duplicações e migração inesperada.
- A busca nunca importa leads automaticamente; cada resultado pode ser enviado individualmente ao CRM via `import_search_to_crm`, e a interface consulta `opportunities` para sinalizar cadastros existentes. A coluna legada `accounts.auto_crm` não controla mais a busca.
