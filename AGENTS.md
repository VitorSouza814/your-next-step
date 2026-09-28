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
- A carteira de leads salvos fica em `localStorage` (chave `ga-leads-salvos`) — ainda não há backend nem login.
