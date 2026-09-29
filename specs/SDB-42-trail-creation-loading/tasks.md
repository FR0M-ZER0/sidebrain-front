---

description: "Task list for trail generation loading"
---

# Tasks: Loading da Criação da Trilha

**Input**: Design documents from `/specs/SDB-42-trail-creation-loading/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/trail-generation.md](./contracts/trail-generation.md)

**Tests**: Não foram criadas tarefas de testes automatizados: a especificação não solicita TDD e o projeto não possui framework de testes configurado. A validação manual e os gates existentes estão em [quickstart.md](./quickstart.md).

**Organization**: As tarefas estão agrupadas por história de usuário para permitir entrega incremental e validação independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode executar em paralelo por atuar em arquivos diferentes e não depender de tarefa incompleta.
- **[Story]**: identifica a história de usuário relacionada.
- Cada tarefa informa o caminho exato do arquivo alterado.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar os tipos, cliente de API e hook compartilhado do fluxo.

- [X] T001 [P] Criar os tipos `TrailGenerationJob`, `GenerationStep` e `StudyTip`, incluindo os enums `queued`, `running`, `completed`, `failed`, `pending`, `knowledge_analysis`, `curriculum_mapping`, `explanations_synthesis` e `quiz_bank`, com `progressPercent` 0–100 monotônico e `resultTrailId` obrigatório em `completed`, em `src/types/trailGeneration.ts`
- [X] T002 [P] Implementar os métodos `startGeneration` e `getGenerationStatus` conforme os endpoints e códigos de erro de `specs/SDB-42-trail-creation-loading/contracts/trail-generation.md`, usando a instância `api` de `src/api/api.ts` e persistindo `generationId` em `localStorage`, em `src/api/trailGenerationApi.ts`
- [X] T003 Criar o hook `useTrailGeneration` em `src/hooks/useTrailGeneration.ts`, encapsulando polling, loading/erro, watchdog de 2 min sem avanço, retry como nova geração e retomada via `generationId` persistido conforme `src/types/trailGeneration.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Disponibilizar rota, barra acessível e estilos base que bloqueiam todas as histórias.

**Critical**: As histórias começam somente após esta fase.

- [X] T004 Configurar a rota protegida `/trails/new/generating` em `src/App.tsx`, preservando as rotas existentes do onboarding
- [X] T005 [P] Estender `ProgressBar` com `role="progressbar"` e atributos `aria-valuenow`/`aria-valuemin`/`aria-valuemax` em `src/components/general/ProgressBar.tsx`
- [X] T006 [P] Adicionar tokens e estilos base do loading (selo de síntese, lista de etapas, cartão de dica, região live, `prefers-reduced-motion`) em `src/App.css` e `src/index.css`

**Checkpoint**: tipos, fronteira de API, hook, rota, barra acessível e estilos disponíveis para implementação das histórias.

---

## Phase 3: User Story 1 - Acompanhar a geração da trilha (Priority: P1) 🎯 MVP

**Goal**: Exibir título, selo, progresso percentual com estimativa e redirecionar automaticamente ao concluir, com retry, watchdog e retomada.

**Independent Test**: Em `/trails/new/generating`, o usuário vê "Construindo sua trilha...", percentual e estimativa avançando até 100% e é levado automaticamente à trilha; falha exibe mensagem com nova tentativa.

### Implementation for User Story 1

- [X] T007 [P] [US1] Criar `TrailGenerationLoadingPage` com título, selo "SÍNTESE COGNITIVA ATIVA", descrição, barra de progresso e estimativa de tempo em `src/pages/customer/TrailGenerationLoadingPage.tsx`
- [X] T008 [US1] Conectar `TrailGenerationLoadingPage` ao `useTrailGeneration`, refletindo `progressPercent` monotônico e `estimatedSecondsRemaining`, redirecionando para `resultTrailId` ao concluir e tratando `completed` sem trilha válida como falha, em `src/pages/customer/TrailGenerationLoadingPage.tsx`
- [X] T009 [US1] Implementar mensagem de falha com retry que inicia nova geração completa preservando escolhas e watchdog que declara travamento após 2 min sem avanço, em `src/hooks/useTrailGeneration.ts` e `src/pages/customer/TrailGenerationLoadingPage.tsx`
- [X] T010 [P] [US1] Implementar retomada no mount via `generationId` persistido (`running` retoma polling, `completed` redireciona, `failed`/ausente oferece novo início) em `src/hooks/useTrailGeneration.ts`
- [X] T011 [US1] Anunciar marcos (início, conclusão, falha) em região `aria-live="polite"` sem anunciar cada percentual em `src/pages/customer/TrailGenerationLoadingPage.tsx`

**Checkpoint**: US1 funciona de forma independente e atende FR-001 a FR-003 e FR-006 a FR-010.

---

## Phase 4: User Story 2 - Entender o que está sendo gerado (Priority: P2)

**Goal**: Listar as 4 etapas de síntese com estado e resumo do que foi produzido em cada conclusão.

**Independent Test**: Durante a geração, cada etapa aparece marcada ao concluir com seu resumo (ex: "Módulos 1 a 4 mapeados", "24 cartões e quizzes prontos").

### Implementation for User Story 2

- [X] T012 [P] [US2] Criar `GenerationStepList` com estados `pending`/`running`/`completed` e resumo por etapa na ordem fixa do contrato em `src/components/customer/GenerationStepList.tsx`
- [X] T013 [US2] Integrar a lista de etapas à `TrailGenerationLoadingPage`, refletindo os `steps` do `useTrailGeneration`, em `src/pages/customer/TrailGenerationLoadingPage.tsx`

**Checkpoint**: US1 e US2 funcionam independentemente; as etapas atendem FR-004 e SC-002.

---

## Phase 5: User Story 3 - Receber uma dica durante a espera (Priority: P3)

**Goal**: Exibir o cartão "Dica do Sidebrain" com dicas em rotação automática sem bloquear o progresso.

**Independent Test**: Durante a geração, o cartão alterna entre mais de uma dica e a transição final nunca é atrasada por ele.

### Implementation for User Story 3

- [X] T014 [P] [US3] Criar `StudyTipCard` com conjunto fixo de dicas, rotação automática por timer e limpeza no unmount em `src/components/customer/StudyTipCard.tsx`
- [X] T015 [US3] Integrar o cartão de dicas à `TrailGenerationLoadingPage` sem bloquear progresso ou redirecionamento em `src/pages/customer/TrailGenerationLoadingPage.tsx`

**Checkpoint**: US3 atende FR-005 sem regressão das histórias anteriores.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalizar fidelidade visual, acessibilidade, responsividade e validação da feature completa.

- [X] T016 [P] Ajustar layout desktop/mobile, contraste, foco visível e microinterações conforme a referência em `src/App.css` e componentes de geração
- [X] T017 [P] Revisar textos acessíveis, labels, região live e navegação por teclado em `src/components/customer/GenerationStepList.tsx`, `src/components/customer/StudyTipCard.tsx` e `src/pages/customer/TrailGenerationLoadingPage.tsx`
- [X] T018 Executar os cenários de `specs/SDB-42-trail-creation-loading/quickstart.md`, `npm run lint` e `npm run build`, corrigindo inconsistências da implementação nos arquivos `src/` envolvidos

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: T001 e T002 podem começar em paralelo; T003 depende de T001 e T002.
- **Phase 2 (Foundational)**: T004 depende de T003; T005 e T006 podem começar em paralelo com T004, mas todas devem terminar antes das histórias.
- **Phase 3 (US1)**: depende de T003-T006; T007 pode começar em paralelo com T010, T008 depende de T007, T009 depende de T008 e T011 depende de T008.
- **Phase 4 (US2)**: depende de US1; T012 pode começar em paralelo com T013 em arquivos diferentes, mas a integração (T013) depende do componente (T012).
- **Phase 5 (US3)**: depende de US1; T014 pode começar em paralelo com T013, T015 depende de T014.
- **Phase 6 (Polish)**: T016 e T017 podem começar em paralelo após as telas; T018 depende de todas as tarefas funcionais desejadas.

### User Story Dependencies

- **US1 (P1)**: depende somente das fases 1 e 2; é o MVP.
- **US2 (P2)**: depende da página e do hook de US1 para refletir `steps`, mas o componente pode ser validado isoladamente.
- **US3 (P3)**: depende da página de US1; o cartão pode ser validado isoladamente.

### Parallel Opportunities

- T001 e T002 podem ser executadas simultaneamente.
- T005 e T006 podem ser executadas simultaneamente.
- Em US1, T007 e T010 podem ser executadas simultaneamente por atuarem em arquivos diferentes.
- Em US2/US3, T012 e T014 podem ser executadas simultaneamente por atuarem em arquivos diferentes.
- T016 e T017 podem ser executadas simultaneamente na fase de polish.

## Parallel Example: User Story 1

```text
Task: T007 [US1] Criar src/pages/customer/TrailGenerationLoadingPage.tsx
Task: T010 [US1] Implementar retomada em src/hooks/useTrailGeneration.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir T001-T006 para preparar tipos, API, hook, rota, barra acessível e estilos.
2. Concluir T007-T011 para entregar progresso, redirecionamento, retry, retomada e anúncios.
3. Validar o cenário independente de US1 antes de adicionar etapas e dicas.

### Incremental Delivery

1. Entregar US1 como MVP demonstrável.
2. Adicionar US2 com etapas, estados e resumos.
3. Adicionar US3 com dicas em rotação.
4. Finalizar acessibilidade, responsividade e gates no Phase 6.

## Notes

- Todas as tarefas usam o formato de checklist com identificador sequencial, com `[P]` somente quando há paralelismo seguro e `[USx]` em todas as tarefas de histórias.
- Não há tarefas automatizadas de teste porque elas não foram solicitadas e o repositório não possui framework configurado.
- O backend deve seguir o contrato em `specs/SDB-42-trail-creation-loading/contracts/trail-generation.md`; polling, watchdog de 2 min e retry como nova geração são regras de cliente.
