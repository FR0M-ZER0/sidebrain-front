# Implementation Plan: Configuração inicial da trilha

**Branch**: `SDB-66-trail-start-preference` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/SDB-66-trail-start-preference/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Implementar a etapa de calibração do onboarding que permite escolher entre diagnóstico rápido com IA e início passo a passo. A solução adicionará uma página de preferência no domínio `customer`, um hook para controlar seleção, persistência e retomada, uma página de diagnóstico inicial e contratos explícitos para a API de onboarding. A UI seguirá a referência “Sidebrain - Teste de Nivelamento (Desktop)” e os componentes existentes.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 6.x, React 19.2, Vite 8

**Primary Dependencies**: React, React Router 7, Axios, lucide-react; instância `src/api/api.ts`

**Storage**: API de onboarding; `localStorage` somente como rascunho/fallback enquanto a API não estiver disponível

**Testing**: validação manual/quickstart e `npm run build`/`npm run lint`; não há framework de testes instalado

**Target Platform**: navegador moderno, desktop como referência e layout responsivo para telas menores

**Project Type**: aplicação web frontend React

**Performance Goals**: confirmação e navegação sem etapa adicional perceptível; feedback de interação em até um frame e carregamento sem bloqueio da tela

**Constraints**: preservar a linguagem visual existente, usar a instância Axios configurada, não perder o progresso ao revisar a preferência, suportar teclado e estado sem seleção

**Scale/Scope**: um fluxo de onboarding de três etapas, duas opções de início, diagnóstico de quatro perguntas e retomada da configuração

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Não há princípios ratificados: `.specify/memory/constitution.md` permanece no template padrão. O plano aplica as normas locais de [architecture.md](../../docs/architecture.md) e [code_conventions.md](../../docs/code_conventions.md): organização por domínio, arrow functions, API centralizada e rotas protegidas quando o roteamento for introduzido. Gate: PASS, sem violação constitucional identificada.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-66-trail-start-preference/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── App.tsx                         # rotas/composição da aplicação
├── api/
│   ├── api.ts                       # cliente Axios existente
│   └── trailOnboardingApi.ts        # endpoints de preferência/diagnóstico
├── components/customer/
│   ├── OnboardingProgress.tsx
│   ├── TrailStartOptionCard.tsx
│   └── TrailPreferenceSummary.tsx
├── hooks/
│   └── useTrailOnboarding.ts
├── pages/customer/
│   ├── TrailStartPreferencePage.tsx
│   └── TrailLevelAssessmentPage.tsx
└── types/
  └── trailOnboarding.ts

specs/SDB-66-trail-start-preference/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
  └── trail-onboarding.md
```

**Structure Decision**: manter a feature no domínio `customer`, separando páginas, componentes reutilizáveis, hook de estado, tipos e cliente de API. A rota de entrada será `/trails/new/start`; o diagnóstico será `/trails/new/assessment`. A dashboard poderá encaminhar o CTA de criação de trilha para a primeira rota quando a navegação existente for integrada.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Nenhuma | N/A | A constituição não está ratificada e a estrutura permanece em um único frontend |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
