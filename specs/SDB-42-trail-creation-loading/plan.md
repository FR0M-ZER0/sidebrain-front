# Implementation Plan: Loading da Criação da Trilha

**Branch**: `feat/sdb-66-trail-test` (spec `SDB-42-trail-creation-loading`) | **Date**: 2026-09-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/SDB-42-trail-creation-loading/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Implementar a tela de espera ativa da geração da trilha ("Construindo sua trilha...", referência `docs/img/Sidebrain - Loading ao criar trilha (Desktop).png`): progresso percentual com estimativa, lista das 4 etapas de síntese com resumos, cartão de dicas em rotação e transição automática para a trilha pronta. A solução adiciona uma página no domínio `customer`, um hook dedicado `useTrailGeneration` (polling + watchdog de 2 min sem progresso + retry como nova geração), tipos e cliente de API em `trailGenerationApi.ts`, seguindo os padrões estabelecidos na SDB-66.

## Technical Context

**Language/Version**: TypeScript 6.x, React 19.2, Vite 8

**Primary Dependencies**: React, React Router 7, Axios via `src/api/api.ts`, lucide-react; reutiliza `ProgressBar` e `StatusBadge` de `src/components/general`

**Storage**: Status da geração via API; `localStorage` (`sidebrain:trail-generation`) apenas para guardar `generationId` e permitir retomada — mesmo padrão de rascunho de `trailOnboardingApi.ts`

**Testing**: validação manual/quickstart e `npm run build`/`npm run lint`; não há framework de testes instalado

**Target Platform**: navegador moderno, desktop como referência e layout responsivo para telas menores

**Project Type**: aplicação web frontend React

**Performance Goals**: refletir cada evento de progresso do backend em até ~1s; redirecionamento automático ao concluir sem atraso perceptível; anúncios a tecnologias assistivas somente em marcos (início, etapa concluída, conclusão/falha)

**Constraints**: travamento = 2 min sem avanço de progresso (decisão de clarify); retry sempre inicia nova geração completa preservando escolhas; dicas em rotação a partir de conjunto fixo; fidelidade pixel a pixel ao Figma; rota protegida; somente a instância Axios configurada

**Scale/Scope**: uma tela de loading, 4 etapas fixas de síntese, conjunto fixo de dicas, rota `/trails/new/generating`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Organização por Domínio**: página em `pages/customer`, componentes em `components/customer`, hook em `src/hooks/useTrailGeneration.ts`, tipos em `src/types/trailGeneration.ts` — PASS.
- **II. Rotas Protegidas**: nova rota `/trails/new/generating` sob o mesmo shell de rotas da SDB-66 — PASS.
- **III. API Centralizada**: todo HTTP via `src/api/api.ts` em `src/api/trailGenerationApi.ts` — PASS.
- **IV. Layout/Arrow/Estado via Hooks**: página composta no Layout padrão, arrow functions, sem ponto e vírgula, estado em hook dedicado (sem Redux: escopo local ao fluxo) — PASS.
- **V. Fidelidade + Gates**: referência Figma + `docs/img`, validação via `npm run lint`, `npm run build` e `quickstart.md` — PASS.

Gate: PASS, sem violação. Reavaliado após Phase 1: nenhuma decisão de design introduziu violação — PASS mantido.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-42-trail-creation-loading/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── App.tsx                                     # + rota /trails/new/generating
├── api/
│   ├── api.ts                                  # cliente Axios existente
│   └── trailGenerationApi.ts                   # startGeneration, getGenerationStatus
├── components/customer/
│   ├── Sidebar.tsx / HeaderBar.tsx             # shell existente reutilizado
│   ├── GenerationStepList.tsx                  # lista das 4 etapas com resumos
│   └── StudyTipCard.tsx                        # cartão "Dica do Sidebrain" em rotação
├── components/general/
│   ├── ProgressBar.tsx                         # barra existente (estender a11y)
│   └── StatusBadge.tsx                         # selo "SÍNTESE COGNITIVA ATIVA"
├── hooks/
│   └── useTrailGeneration.ts                   # polling, watchdog 2 min, retry, resume
├── pages/customer/
│   └── TrailGenerationLoadingPage.tsx          # "Construindo sua trilha..."
└── types/
    └── trailGeneration.ts                      # TrailGenerationJob, GenerationStep, StudyTip

specs/SDB-42-trail-creation-loading/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
  └── trail-generation.md
```

**Structure Decision**: manter a feature no domínio `customer`, espelhando a organização da SDB-66. Hook novo e dedicado (responsabilidade única) em vez de estender `useTrailOnboarding`. A rota de entrada será `/trails/new/generating`; ao concluir, redireciona para a página da trilha criada.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Nenhuma | N/A | O design cabe nos padrões existentes (hook + api + página do domínio `customer`) |
