# Implementation Plan: Tela de Missões e Badges (SDB-84)

**Branch**: `feat/sdb-84-missoes-e-badges` | **Date**: 2026-10-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/SDB-84-missions-and-badges/spec.md`

## Summary

Implementação da tela dedicada de **Missões & Conquistas** do Sidebrain com acompanhamento de metas semanais em XP, resumo do nível de aprendizagem, progresso de desafios e vitrine completa de badges/insígnias (desbloqueados, em andamento e bloqueados) categorizados por temática e filtráveis por estado e raridade. A interface será construída em React 19 + TypeScript + Tailwind CSS no domínio `customer`, utilizando dados mockados de alta fidelidade visual pixel a pixel com a imagem oficial de referência (`docs/img/Sidebrain - Missões & Badges (Desktop).png`).

---

## Technical Context

**Language/Version**: TypeScript ~6.0.2 / React 19.2.8
**Primary Dependencies**: React Router 7.18.4, lucide-react 1.47.0, Tailwind CSS 4.3.3, motion 13.4.4
**Storage**: N/A (dados locais estáticos mockados em `src/mocks/missionsData.ts`)
**Testing**: Verificação guiada de cenários via [quickstart.md](./quickstart.md), checagem estática de tipos (`tsc -b`), linting (`npm run lint`) e build de produção (`npm run build`)
**Target Platform**: Navegadores Desktop modernos (Chrome, Firefox, Safari, Edge)
**Project Type**: Frontend Web Application (React SPA com Vite 8)
**Performance Goals**: Tempo de renderização inicial < 1s; resposta de alternância de filtros de badges < 100ms
**Constraints**: 
- Estrito cumprimento das regras normativas da constituição do projeto (arrow functions obrigatórias, sem ponto e vírgula ao final).
- Fidelidade visual rigorosa pixel a pixel com a imagem de referência desktop.
- Integração harmônica com a barra lateral (`Sidebar`) e cabeçalho (`HeaderBar`) compartilhados.
**Scale/Scope**: 1 página (`MissionsAndBadgesPage`), 6 componentes específicos modulares, 1 hook customizado, 1 arquivo de tipos e 1 arquivo de mock (28 badges, 4 missões, 3 categorias temáticas).

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio Constitucional | Status | Justificativa / Validação |
| :--- | :--- | :--- |
| **I. Organização por Domínio** | **PASS** | A página é alocada em `src/pages/customer/MissionsAndBadgesPage.tsx`, componentes em `src/components/customer/missions/`, hook em `src/hooks/useMissionsAndBadges.ts` e tipos em `src/types/missions.ts`. |
| **II. Rotas Protegidas por Padrão** | **PASS** | Rota `/missions` registrada no `src/App.tsx` mantendo conformidade com as rotas autenticadas da aplicação. |
| **III. API Centralizada via Axios** | **PASS** | Dados estáticos organizados para posterior migração transparente via instância de `src/api/api.ts` quando houver endpoints no backend. |
| **IV. Layout Base, Arrow Functions e Sem Ponto e Vírgula** | **PASS** | Todos os componentes, handlers e hooks utilizam arrow functions sem ponto e vírgula final, integrando a estrutura do layout compartilhado (`app-shell`, `Sidebar`, `HeaderBar`). |
| **V. Fidelidade Visual e Qualidade de Entrega** | **PASS** | Mapeamento detalhado de espaçamentos, tipografia, ícones e cores a partir da imagem de referência; verificação obrigatória com `npm run lint` e `npm run build`. |

---

## Project Structure

### Documentation (this feature)

```text
specs/SDB-84-missions-and-badges/
├── spec.md              # Especificação de requisitos da feature
├── plan.md              # Este plano técnico de implementação
├── research.md          # Decisões arquiteturais e justificativas técnicas
├── data-model.md        # Modelagem de dados, entidades e regras de validação
├── contracts/           # Contratos de interfaces e assinaturas TypeScript
│   └── missions-ui-contract.md
├── quickstart.md        # Roteiro passo a passo de validação da tela
└── checklists/          # Checklists de qualidade da especificação
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── types/
│   └── missions.ts                               # Tipos e interfaces de badges, missões e filtros
├── mocks/
│   └── missionsData.ts                           # Dados mockados completos (28 badges, 4 missões)
├── hooks/
│   └── useMissionsAndBadges.ts                   # Hook central de estado, filtros e toasts
├── components/
│   └── customer/
│       ├── Sidebar.tsx                           # Atualização de rota/ativo se necessário
│       └── missions/                             # Componentes modulares da tela
│           ├── MissionsAndBadgesSummary.tsx      # Cards de topo: Badges, Nível Atual, Total XP
│           ├── MissionsGrid.tsx                  # Grade 2x2 com cards de missões
│           ├── MissionCardItem.tsx               # Card individual de missão
│           ├── BadgesShowcase.tsx                # Seção vitrine com tabs de filtro
│           ├── BadgeItemCard.tsx                 # Card individual de insígnia
│           └── ToastNotification.tsx             # Feedback de ação demonstrativa
├── pages/
│   └── customer/
│       └── MissionsAndBadgesPage.tsx             # Página principal integrada à Sidebar e Header
└── App.tsx                                       # Registro da rota /missions (e /missoes)
```

**Structure Decision**: Adoção estrita da estrutura mono-projeto em `src/`, respeitando a separação por domínio `customer` normatizada pelo projeto Sidebrain.

---

## Complexity Tracking

> Nenhuma violação constitucional detectada. Todos os padrões seguem diretamente as convenções normativas do repositório.
