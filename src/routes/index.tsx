import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import avatar from "@/assets/avatar.jpg";
import { buscarLeads, type LeadResult } from "@/lib/leads.functions";

const TITULO = "Gerenciador Avançado — Prospecção de empresas sem site";
const DESCRICAO =
  "Busque empresas no Google por nicho e cidade, isole as que ainda não têm site e monte sua lista de prospecção com status.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
    ],
  }),
  component: Painel,
});

type Status = "novo" | "contatado" | "ganho";

type LeadSalvo = LeadResult & { status: Status };

const STORAGE_KEY = "ga-leads-salvos";
const STATUS_SEQ: Status[] = ["novo", "contatado", "ganho"];

function iniciais(nome: string) {
  return nome
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function somenteDigitos(tel: string) {
  const d = tel.replace(/\D/g, "");
  return d.startsWith("55") ? d : `55${d}`;
}

function Painel() {
  const buscar = useServerFn(buscarLeads);
  const [nicho, setNicho] = useState("Clínica odontológica");
  const [cidade, setCidade] = useState("Curitiba, PR");
  const [apenasSemSite, setApenasSemSite] = useState(true);
  const [salvos, setSalvos] = useState<LeadSalvo[]>([]);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      if (bruto) setSalvos(JSON.parse(bruto) as LeadSalvo[]);
    } catch {
      /* lista vazia */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(salvos));
  }, [salvos]);

  const busca = useMutation({
    mutationFn: (dados: { nicho: string; cidade: string }) => buscar({ data: dados }),
  });

  const resultados = busca.data?.leads ?? [];
  const visiveis = useMemo(
    () => (apenasSemSite ? resultados.filter((l) => !l.site) : resultados),
    [resultados, apenasSemSite],
  );

  const contadores = {
    encontradas: busca.data?.total ?? 0,
    semSite: busca.data?.semSite ?? 0,
    novos: salvos.filter((l) => l.status === "novo").length,
    ganhos: salvos.filter((l) => l.status === "ganho").length,
  };

  function enviar(e: FormEvent) {
    e.preventDefault();
    busca.mutate({ nicho, cidade });
  }

  function salvar(lead: LeadResult) {
    setSalvos((atual) =>
      atual.some((l) => l.id === lead.id) ? atual : [{ ...lead, status: "novo" }, ...atual],
    );
  }

  function girarStatus(id: string) {
    setSalvos((atual) =>
      atual.map((l) =>
        l.id === id
          ? { ...l, status: STATUS_SEQ[(STATUS_SEQ.indexOf(l.status) + 1) % STATUS_SEQ.length]! }
          : l,
      ),
    );
  }

  function remover(id: string) {
    setSalvos((atual) => atual.filter((l) => l.id !== id));
  }

  return (
    <div className="grain min-h-screen bg-ink font-body text-cream antialiased">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-cream/10 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-sm bg-crimson">
              <span className="font-display text-sm font-bold text-cream">G</span>
            </div>
            <div>
              <p className="font-display font-semibold leading-none tracking-wide text-cream">
                GERENCIADOR AVANÇADO
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Prospecção B2B
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display text-xs uppercase tracking-[0.15em] text-gold">
              {salvos.length} na carteira
            </span>
            <img
              src={avatar}
              alt=""
              loading="lazy"
              width={816}
              height={816}
              className="size-9 rounded-full object-cover outline-1 -outline-offset-1 outline-cream/10"
            />
          </div>
        </header>

        <div className="px-8 pb-6 pt-8">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            — O Cartaz da Prospecção —
          </p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[0.86] tracking-tight">
            <span className="text-cream">Encontre</span> <span className="text-crimson">Quem Não</span>{" "}
            <span className="text-cream">Tem</span> <span className="text-gold">Site</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-cream/70">
            Busque empresas no Google por nicho e cidade, isole as que ainda não têm presença digital e
            monte listas de prospecção com status.
          </p>
        </div>

        <div className="px-8">
          <form
            onSubmit={enviar}
            className="flex flex-col items-stretch gap-5 rounded-lg border border-cream/10 bg-cream/[0.04] p-6 md:flex-row"
          >
            <div className="flex-1">
              <label
                htmlFor="nicho"
                className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-gold/80"
              >
                Nicho
              </label>
              <input
                id="nicho"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                placeholder="Clínica odontológica"
                className="h-12 w-full rounded border border-cream/15 bg-ink px-4 text-cream/90 outline-none placeholder:text-cream/30 focus:border-gold"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="cidade"
                className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-gold/80"
              >
                Cidade
              </label>
              <input
                id="cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Curitiba, PR"
                className="h-12 w-full rounded border border-cream/15 bg-ink px-4 text-cream/90 outline-none placeholder:text-cream/30 focus:border-gold"
              />
            </div>
            <div className="flex-1">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Filtro
              </span>
              <button
                type="button"
                aria-pressed={apenasSemSite}
                onClick={() => setApenasSemSite((v) => !v)}
                className={
                  apenasSemSite
                    ? "flex h-12 w-full items-center gap-2 rounded border border-crimson/40 bg-crimson/15 px-4 font-medium text-crimson"
                    : "flex h-12 w-full items-center gap-2 rounded border border-cream/15 bg-ink px-4 text-cream/60"
                }
              >
                <span
                  className={
                    apenasSemSite ? "size-2 rounded-full bg-crimson" : "size-2 rounded-full bg-cream/30"
                  }
                />
                Sem site
              </button>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={busca.isPending}
                className="h-12 rounded bg-crimson px-7 font-display font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-crimson/90 disabled:opacity-60"
              >
                {busca.isPending ? "Buscando…" : "Buscar"}
              </button>
            </div>
          </form>
        </div>

        {busca.isError && (
          <p className="mx-8 mt-4 rounded border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-crimson">
            {(busca.error as Error).message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 px-8 py-7 md:grid-cols-4">
          <div className="rounded-lg border border-cream/10 p-5">
            <p className="font-display text-4xl font-bold text-crimson">{contadores.encontradas}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-cream/60">Empresas encontradas</p>
          </div>
          <div className="rounded-lg border border-cream/10 p-5">
            <p className="font-display text-4xl font-bold text-gold">{contadores.semSite}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-cream/60">Sem site — alvo</p>
          </div>
          <div className="rounded-lg border border-cream/10 p-5">
            <p className="font-display text-4xl font-bold text-cream">{contadores.novos}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-cream/60">Novos contatos</p>
          </div>
          <div className="rounded-lg border border-cream/10 p-5">
            <p className="font-display text-4xl font-bold text-cream">{contadores.ganhos}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-cream/60">Ganhos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 px-8 pb-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display font-semibold uppercase tracking-[0.2em] text-cream/90">
                {apenasSemSite ? "Resultados sem site" : "Todos os resultados"}
              </p>
              <span className="text-xs text-cream/50">
                Exibindo {visiveis.length} de {contadores.encontradas}
              </span>
            </div>

            {!busca.data && !busca.isPending && (
              <p className="rounded-lg border border-cream/10 p-8 text-center text-sm text-cream/50">
                Informe o nicho e a cidade e clique em Buscar para trazer empresas do Google.
              </p>
            )}

            {busca.isPending && (
              <p className="rounded-lg border border-cream/10 p-8 text-center text-sm text-cream/50">
                Garimpando empresas no Google…
              </p>
            )}

            {busca.data && visiveis.length === 0 && (
              <p className="rounded-lg border border-cream/10 p-8 text-center text-sm text-cream/50">
                Nenhuma empresa encontrada com esse filtro. Tente outro nicho, cidade ou desligue o filtro
                “sem site”.
              </p>
            )}

            {visiveis.map((lead) => {
              const jaSalvo = salvos.some((l) => l.id === lead.id);
              return (
                <div
                  key={lead.id}
                  className="mb-4 flex flex-col justify-between gap-5 rounded-lg border border-cream/10 p-5 md:flex-row"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded bg-cream/10 font-display font-bold text-gold">
                      {iniciais(lead.nome)}
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-cream">{lead.nome}</p>
                      <p className="mt-0.5 text-sm text-cream/60">{lead.endereco}</p>
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <span className="text-gold">
                          ★ {lead.nota ? lead.nota.toFixed(1).replace(".", ",") : "—"}
                        </span>
                        <span className="text-cream/50">· {lead.avaliacoes ?? 0} avaliações</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <span
                      className={
                        lead.site
                          ? "text-[11px] font-semibold uppercase tracking-widest text-cream/40"
                          : "text-[11px] font-semibold uppercase tracking-widest text-crimson"
                      }
                    >
                      {lead.site ? "Tem site" : "Sem site"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-cream/70">{lead.telefone ?? "sem telefone"}</span>
                      <button
                        onClick={() => salvar(lead)}
                        disabled={jaSalvo}
                        className="h-8 rounded bg-crimson px-3 text-xs font-semibold uppercase text-cream disabled:bg-cream/10 disabled:text-cream/40"
                      >
                        {jaSalvo ? "Salvo" : "Salvar"}
                      </button>
                    </div>
                    {lead.telefone && (
                      <a
                        href={`https://wa.me/${somenteDigitos(lead.telefone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] uppercase tracking-widest text-gold hover:underline"
                      >
                        Abrir no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-lg border border-cream/10 p-5">
            <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Minha carteira
            </p>
            {salvos.length === 0 && (
              <p className="text-xs text-cream/50">
                Nenhum contato salvo ainda. Salve empresas dos resultados para acompanhar o status.
              </p>
            )}
            <div className="space-y-3">
              {salvos.map((lead) => (
                <div key={lead.id} className="rounded border border-cream/10 p-3">
                  <p className="font-medium text-cream">{lead.nome}</p>
                  <p className="mt-1 text-xs text-cream/50">{lead.telefone ?? "sem telefone"}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => girarStatus(lead.id)}
                      className={
                        lead.status === "ganho"
                          ? "rounded border border-gold bg-gold px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-ink"
                          : lead.status === "contatado"
                            ? "rounded border border-gold/30 bg-gold/15 px-2 py-0.5 text-[11px] uppercase tracking-widest text-gold"
                            : "rounded border border-cream/20 bg-cream/10 px-2 py-0.5 text-[11px] uppercase tracking-widest text-cream/70"
                      }
                    >
                      {lead.status}
                    </button>
                    <button
                      onClick={() => remover(lead.id)}
                      className="text-[11px] uppercase tracking-widest text-cream/40 hover:text-crimson"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <footer className="border-t border-cream/10 px-8 py-6 text-center">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-cream/80">
            Gerenciador Avançado — Prospecção B2B
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-cream/40">
            Busca · Filtro sem site · Contatos · Status · Carteira
          </p>
        </footer>
      </div>
    </div>
  );
}
