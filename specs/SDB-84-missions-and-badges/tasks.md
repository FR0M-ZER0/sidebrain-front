# Tasks: Tela de Missões e Badges (SDB-84)

**Feature**: `SDB-84-missions-and-badges`
**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [data-model.md](./data-model.md), [contracts/missions-ui-contract.md](./contracts/missions-ui-contract.md)
**Status**: Implementation Complete

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Definição de estruturas de tipos TypeScript e mock data de alta fidelidade visual.

- [x] T001 Criar modelos e interfaces de dados em `src/types/missions.ts` com base no `specs/SDB-84-missions-and-badges/data-model.md` (`UserGamificationSummary`, `Mission`, `Badge`, `BadgeCategory`, `BadgeRarity`, `BadgeStatus`, `BadgeFilterType`).
- [x] T002 [P] Criar dados mockados completos em `src/mocks/missionsData.ts` contendo o resumo métrico do aluno, 4 missões e os 28 badges com raridades e status fiéis a `docs/img/Sidebrain - Missões & Badges (Desktop).png`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura de estado, hook customizado e suporte a rotas que bloqueiam as User Stories.

- [x] T003 Implementar o hook de estado `src/hooks/useMissionsAndBadges.ts` com gerenciamento de filtros da vitrine, ocultação de categorias vazias e controle do ciclo de vida dos toasts com auto-dismiss.
- [x] T004 [P] Criar componente reutilizável de notificação `src/components/customer/missions/ToastNotification.tsx` para apresentar feedback visual amigável nas ações simuladas.
- [x] T005 Registrar a rota `/missions` e rota de compatibilidade `/missoes` em `src/App.tsx`, garantindo que a tela fique acessível no roteamento da aplicação.

**Checkpoint**: Base de dados, hook e roteador configurados — implementação das User Stories liberada.

---

## Phase 3: User Story 1 - Acompanhar Desafios e Progresso de Missões (Priority: P1) 🎯 MVP

**Goal**: Permitir que o aluno visualize seus 3 cards de resumo no topo (Badges 14/28, Nível Nv. 8, Total 4.850 XP) e a grade 2x2 com os desafios de missões ativas e concluídas.

**Independent Test**: Navegar para `/missions` e validar que os 3 cards métricos e as 4 missões exibem corretamente ícones, barras de progresso, percentuais e status sem erros de renderização.

### Implementation for User Story 1

- [x] T006 [P] [US1] Criar componente de métricas `src/components/customer/missions/MissionsAndBadgesSummary.tsx` renderizando os 3 cards verticais de topo (Badges, Nível Atual, Total XP) com ícones e tipografia da referência.
- [x] T007 [P] [US1] Criar componente de card de missão `src/components/customer/missions/MissionCardItem.tsx` com ícone arredondado, tag da categoria, pill de recompensa XP, título, descrição, barra de progresso e botão de ação.
- [x] T008 [US1] Criar componente de grade de missões `src/components/customer/missions/MissionsGrid.tsx` renderizando a grade 2x2 responsiva com título "Missões" integrando `MissionCardItem`.
- [x] T009 [US1] Criar página `src/pages/customer/MissionsAndBadgesPage.tsx` integrando `Sidebar`, `HeaderBar`, `MissionsAndBadgesSummary` e `MissionsGrid` no layout base `app-shell`.

**Checkpoint**: MVP funcional. O usuário pode abrir a tela e visualizar seu painel de missões e resumo de progresso.

---

## Phase 4: User Story 2 - Explorar e Filtrar a Vitrine de Badges (Priority: P1)

**Goal**: Permitir que o aluno visualize a vitrine com os 28 badges categorizados nas 3 seções temáticas e filtre por estado ("Todos", "Desbloqueados", "Em Progresso", "Raros & Épicos"), ocultando categorias vazias.

**Independent Test**: Alternar entre as 4 abas de filtro e verificar que a listagem de badges é atualizada instantaneamente e que seções sem badges correspondentes ao filtro ativo são temporariamente omitidas.

### Implementation for User Story 2

- [x] T010 [P] [US2] Criar componente de card de insígnia `src/components/customer/missions/BadgeItemCard.tsx` com ícone em container colorido, selo de verificação verde quando desbloqueado, tag de raridade (Comum, Incomum, Raro, Épico, Lendário), título, descrição e rodapé contextual (data, barra de progresso ou requisitos).
- [x] T011 [US2] Criar componente da vitrine `src/components/customer/missions/BadgesShowcase.tsx` com título "Vitrine de Badges", subtítulo, barra de abas de filtro com contadores numéricos e renderização das seções temáticas de categorias ativas.
- [x] T012 [US2] Integrar `BadgesShowcase` na página `src/pages/customer/MissionsAndBadgesPage.tsx`, conectando o componente ao estado e callbacks providos pelo hook `useMissionsAndBadges`.

**Checkpoint**: Vitrine de badges e filtros 100% funcionais e integrados à tela de Missões e Badges.

---

## Phase 5: User Story 3 - Interagir com Ações Demonstrativas e Navegação (Priority: P2)

**Goal**: Oferecer feedback visual via toast quando o aluno acionar "Continuar Trilha →" ou "Revisar 8 Cards", além de permitir navegação pela barra lateral `Sidebar`.

**Independent Test**: Clicar nos botões das missões e verificar o toast surgindo com mensagem contextual e sumindo após 3 segundos, mantendo o usuário na página. Clicar no menu lateral "Missões & Badges" e verificar a transição de rota.

### Implementation for User Story 3

- [x] T013 [US3] Conectar as ações dos botões das missões ("Continuar Trilha →" e "Revisar 8 Cards") aos manipuladores do hook para disparo de `ToastNotification` em `src/pages/customer/MissionsAndBadgesPage.tsx`.
- [x] T014 [US3] Atualizar a navegação da `Sidebar` em `src/components/customer/Sidebar.tsx` para adicionar suporte a navegação por rota ao clicar em "Missões & Badges" (destacando o item quando a rota ativa for `/missions`).

**Checkpoint**: Experiência demonstrativa e navegação completas sem quebras de fluxo.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Fidelidade visual rigorosa, validação estática de código e checagem de conformidade com a Constituição.

- [x] T015 [P] Ajustar espaçamentos, tipografia, cantos arredondados, sombras e tokens de cores para paridade pixel a pixel com a imagem oficial `docs/img/Sidebrain - Missões & Badges (Desktop).png`.
- [x] T016 Validar conformidade de código executando `npm run lint` e checagem de tipos e compilação com `npm run build`, assegurando 100% de conformidade com as regras de arrow functions e sem ponto e vírgula.
- [x] T017 Executar todos os cenários de validação manual descritos em `specs/SDB-84-missions-and-badges/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — execução imediata.
- **Foundational (Phase 2)**: Depende da Phase 1 — BLOQUEIA a execução das User Stories.
- **User Story 1 (Phase 3)**: Depende da Phase 2 — Entrega o MVP da página de missões.
- **User Story 2 (Phase 4)**: Depende da Phase 2 — Pode ser implementada após ou em paralelo com a US1.
- **User Story 3 (Phase 5)**: Depende da conclusão das fases 3 e 4 para amarrar os eventos interativos de ponta a ponta.
- **Polish (Phase 6)**: Depende da conclusão de todas as User Stories.

### Parallel Opportunities

- **T001** e **T002**: Podem ser executados em paralelo ou sequência direta.
- **T006** e **T007**: Podem ser desenvolvidos em paralelo (componentes isolados).
- **T010**: Pode ser desenvolvido em paralelo aos componentes da US1.
- **T015**: Pode ser refinado paralelamente aos ajustes de integração.

---

## Implementation Strategy

### MVP First (User Story 1)
1. Completar Setup (T001-T002) e Foundational (T003-T005).
2. Implementar User Story 1 (T006-T009).
3. **Validação do MVP**: Acessar `/missions` e verificar os cards de resumo e a grade de missões.

### Incremental Delivery
1. Adicionar User Story 2 (T010-T012): Vitrine de badges e filtros dinâmicos.
2. Adicionar User Story 3 (T013-T014): Feedback em toast e navegação via Sidebar.
3. Polimento e Qualidade (T015-T017): Pixel-perfect review, lint e build.
