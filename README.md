# Dashboard · Ciro Gomes 2026 — Mídia Digital

Painel de performance da campanha de **mídia digital (Meta Ads / Instagram)** de
Ciro Gomes, pré-candidato ao Governo do Ceará em 2026.

Construído com **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** e
**Recharts**. Tema roxo com alternância **claro/escuro** (padrão escuro),
responsivo (mobile-first) e com tela de carregamento.

Recursos: KPIs com custos/taxas embutidos no mesmo card, **seletores de métrica**
(pílulas) em vários gráficos, **mapa de calor** com métrica selecionável, e
**tabela de criativos ordenável** por qualquer coluna.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento  -> http://localhost:3000
# ou
npm run build && npm run start   # produção
```

Não há variáveis de ambiente obrigatórias — os dados vêm da função Supabase
`CiroGomes2026`, consumida através do proxy interno `/api/data` (evita CORS e
mantém a chamada no servidor).

## Páginas

| Rota | Bloco | Conteúdo |
|------|-------|----------|
| `/` | Visão geral | KPIs, combo alcance×engajamento, funil de vídeo, top criativos, investimento diário, composição do engajamento |
| `/criativos` | Criativos | Cards com thumbnail, métricas e link para o post no Instagram; ordenação por engajamento / alcance / views / investimento / CPE |
| `/publico` | Público | Barras por faixa etária, rosca por gênero, **heatmap idade × gênero**, alcance e CPE por faixa |
| `/campanhas` | Campanhas | Comparativo das campanhas, engajamento diário por campanha, composição, tabela lado a lado |

Tipos de gráfico usados: barras verticais e horizontais, rosca/pizza, linhas,
área, **combo (barras + linha em eixo único)**, **funil** e **heatmap**.

## Arquitetura

```
app/
  layout.tsx          Root: fontes, DataProvider, Shell (sidebar)
  page.tsx            Visão geral
  criativos|publico|campanhas/page.tsx
  api/data/route.ts   Proxy server-side para a função Supabase
  not-found.tsx       404 com rota de volta
components/
  DataProvider.tsx    Busca os dados 1x, tela de carregamento + erro
  Shell.tsx           Sidebar desktop + drawer mobile
  charts/             ComboChart, TimeSeriesArea, HBar, VBar, Donut, Funnel, Heatmap, StackedBar
  ui/                 KpiCard, ChartCard, PageHeader, Insight
lib/
  data.ts             Normalização + agregações (totais, por dia/campanha/criativo/idade/gênero)
  format.ts           Formatação pt-BR (R$, %, mil/Mi, datas)
  theme.ts            Paleta de gráficos (validada para daltonismo no fundo escuro)
```

### Notas técnicas

- **Roteamento sem 404 ao recarregar:** rotas reais do App Router — cada página é
  servida pelo servidor; recarregar `/criativos` etc. responde 200.
- **Tema claro/escuro:** `ThemeProvider` grava a escolha em `localStorage` e um
  script inline aplica o tema antes da 1ª pintura (sem flash). Os gráficos leem a
  paleta do tema pelo contexto.
- **Paleta acessível:** as cores de série (nos dois temas) passam nos testes de
  contraste e separação para daltonismo (protanopia/deuteranopia) — validadas com
  o script da skill de dataviz sobre a superfície de cada tema.
- **Thumbnails:** renderizadas direto do CDN da Meta com `referrerPolicy` e
  fallback caso a URL expire.
