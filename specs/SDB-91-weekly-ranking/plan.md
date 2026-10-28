# Implementation Plan: Ranking Semanal

**Branch**: `feat/sdb-91-weekly-ranking` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/SDB-91-weekly-ranking/spec.md`

## Summary

Criar a experiência de Ranking semanal/global como uma página responsiva do domínio `customer`, alimentada exclusivamente por fixtures tipadas locais. O estado de modo e expansão fica isolado em hook da tela; a apresentação é composta por componentes específicos do Ranking e reutiliza `Sidebar` e `HeaderBar` sem alterar aparência ou comportamento. O repositório contém `PrivateRoute` e `useAuth`, permitindo registrar `/ranking` sob o guard existente. A imagem de referência `docs/img/Sidebrain_-_Ranking_Desktop.png` foi usada; a inspeção final de Figma foi dispensada pelo usuário.

## Technical Context

**Language/Version**: TypeScript 6.0.2, React 19.2.8, Vite 8.3.0

**Primary Dependencies**: React, React Router 7.18.4, lucide-react 1.47.0 e Tailwind CSS 4.3.3, já declarados no projeto; nenhuma dependência nova prevista

**Storage**: Fixtures tipadas locais e estado em memória; sem persistência ou serviço externo nesta etapa

**Testing**: `npm run lint` e `npm run build`; validação manual guiada por `quickstart.md`. Não há framework de testes configurado no repositório

**Target Platform**: Aplicação web em navegador moderno; referência desktop, com conteúdo responsivo para telas menores

**Project Type**: Frontend web React/Vite

**Performance Goals**: Mostrar os conjuntos mockados sem espera perceptível e atualizar modo/expansão como interação local imediata; não há metas de throughput para esta tela demonstrativa

**Constraints**: Manter Sidebar e HeaderBar compartilhados sem mudança visual/comportamental; não usar chamadas reais de rede; manter diferenciação que não dependa só de cor; seguir convenções do repositório. Registrar `/ranking` sob `PrivateRoute`. Usar a imagem local disponível como base. A inspeção pixel a pixel do Figma foi dispensada pelo usuário nesta entrega.

**Scale/Scope**: Uma página com dois conjuntos finitos de classificação mockada, apresentação de pódio e resumo, expansão de posições, indicador do usuário e estado de modo local

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Avaliação |
|---|---|---|
| I. Organização por domínio | PASS | Página em `src/pages/customer`; componentes exclusivos em `src/components/customer/ranking`; hook em `src/hooks`; tipos e fixtures em `src/types` e `src/data`. |
| II. Rotas protegidas por padrão | PASS | `src/components/general/PrivateRoute.tsx` e `src/hooks/useAuth.ts` existem; registrar `/ranking` dentro do guard como já feito para `/perfil`. Não adicionar rota pública nem proteção simulada. |
| III. API centralizada via Axios | PASS | A tela não faz HTTP; fixtures locais satisfazem o escopo. Integração futura, se solicitada, usará `src/api/api.ts`. |
| IV. Layout, arrow functions e hooks | PASS COM ADAPTAÇÃO | Não existe `Layout.tsx` geral; páginas atuais compõem o shell com `Sidebar`, `HeaderBar` e `page-shell`. Reutilizar os compartilhados inalterados e concentrar interação local no hook dedicado. |
| V. Fidelidade visual e qualidade | PASS COM RESSALVA | A imagem local `docs/img/Sidebrain_-_Ranking_Desktop.png` foi usada como referência. O usuário dispensou a inspeção pixel a pixel no Figma; lint, build e quickstart foram executados sem esse gate visual. |

**Gate inicial**: PASS para acesso protegido com o `PrivateRoute` existente. A validação pixel a pixel no Figma não faz parte desta entrega por orientação explícita do usuário.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-91-weekly-ranking/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ranking-ui.md
├── spec.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── App.tsx                                      # registro da rota /ranking, condicionado ao guard
├── components/customer/
│   ├── HeaderBar.tsx                            # existente; reutilizar sem alteração
│   ├── Sidebar.tsx                              # existente; limpeza de condições mortas sem efeito visual
│   └── ranking/
│       ├── RankingIntro.tsx                     # contexto de ciclo/divisão ou contexto global
│       ├── RankingModeSwitch.tsx                # alternância semanal/global
│       ├── RankingPodium.tsx                    # cards dos três primeiros
│       ├── RankingUserSummary.tsx               # métricas do usuário
│       ├── RankingTable.tsx                     # lista, corte do pódio e expansão
│       └── ranking.css                           # estilos específicos baseados na imagem local
├── data/
│   └── rankingMockData.ts                       # conjuntos semanais, globais e posições adicionais
├── dev/
│   └── rankingPreview.tsx                       # preview local isolado, seguindo previews existentes
├── hooks/
│   └── useRanking.ts                            # modo atual e expansão da classificação
├── pages/customer/
│   └── RankingPage.tsx                          # composição do shell e da experiência
└── types/
    └── ranking.ts                               # entidades e view models do Ranking
ranking-preview.html                             # entry de desenvolvimento para o preview local
```

**Structure Decision**: Seguir o domínio `customer` já adotado pela aplicação. A página compõe `Sidebar`, `HeaderBar` e `page-shell` tal como as páginas existentes; o layout visual do Ranking fica isolado em componentes novos e estilos próprios da feature. A Sidebar recebeu somente a remoção de duas condições mortas para corrigir uma referência indefinida, sem alterar navegação ou aparência. Registrar `/ranking` dentro de `PrivateRoute`. Como a Sidebar existente não contém item Ranking e a especificação não pede sua alteração, não será adicionado um link à Sidebar neste escopo. Manter também um entry de preview de desenvolvimento seguindo os previews HTML/TSX existentes.

## Phase 0: Research

Consolidar as decisões e limitações em [research.md](research.md). Não há tecnologia nova a pesquisar: as dependências existentes cobrem a tela e os dados são locais. A imagem local foi consultada; o Figma, Jira e Context7 não puderam ser consultados nesta sessão. A validação pixel a pixel no Figma foi dispensada pelo usuário.

## Phase 1: Design & Contracts

- Formalizar entidades, campos, regras e estados em [data-model.md](data-model.md).
- Definir o contrato de interação/modelo de apresentação em [contracts/ranking-ui.md](contracts/ranking-ui.md); não há API HTTP externa a especificar.
- Descrever validação visual, estados da tela, alternância, expansão e checks de build/lint em [quickstart.md](quickstart.md).

## Constitution Check (post-design)

| Princípio | Status pós-design | Verificação |
|---|---|---|
| I. Organização por domínio | PASS | Todos os caminhos propostos respeitam o domínio customer e separam página, componentes, hook, tipos e fixtures. |
| II. Rotas protegidas por padrão | PASS | `/ranking` será registrada sob `PrivateRoute`, usando a implementação e o estado de autenticação existentes. |
| III. API centralizada via Axios | PASS | Sem HTTP no escopo; futura integração deve usar `src/api/api.ts`. |
| IV. Layout, arrow functions e hooks | PASS COM ADAPTAÇÃO | Shell compartilhado permanece intacto; estado de modo/expansão é local ao domínio e encapsulado. |
| V. Fidelidade visual e qualidade | PASS COM RESSALVA | Imagem local usada como referência; comparação pixel a pixel no Figma dispensada pelo usuário. Lint/build/quickstart executados como gates da entrega. |

**Gate pós-design**: PASS para rota protegida, implementação, lint e build. A aprovação pixel a pixel no Figma foi dispensada nesta entrega; a fidelidade foi avaliada com a imagem local.

## Complexity Tracking

| Bloqueio | Motivo | Alternativa rejeitada |
|---|---|---|
| Validação pixel a pixel dispensada | O link Figma solicita login; o usuário dispensou essa validação nesta entrega e a imagem local está disponível. | Não alegar inspeção Figma; manter a ressalva registrada e usar a imagem local como base. |
