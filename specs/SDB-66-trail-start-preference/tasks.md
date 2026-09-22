---

description: "Task list for trail start preference"
---

# Tasks: Configuração inicial da trilha

**Input**: Design documents from `/specs/SDB-66-trail-start-preference/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/trail-onboarding.md](./contracts/trail-onboarding.md)

**Tests**: Não foram criadas tarefas de testes automatizados: a especificação não solicita TDD e o projeto não possui framework de testes configurado. A validação manual e os gates existentes estão em [quickstart.md](./quickstart.md).

**Organization**: As tarefas estão agrupadas por história de usuário para permitir entrega incremental e validação independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode executar em paralelo por atuar em arquivos diferentes e não depender de tarefa incompleta.
- **[Story]**: identifica a história de usuário relacionada.
- Cada tarefa informa o caminho exato do arquivo alterado.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar os tipos, cliente de API e estado compartilhado do fluxo.

- [X] T001 [P] Criar os tipos `TrailStartMode`, `TrailOnboardingState`, `AssessmentQuestion` e `AssessmentAnswer`, incluindo os enums `ai_recommended`, `step_by_step`, `preference`, `assessment`, `guided_start`, `completed`, `not_started`, `in_progress` e `completed`, em `src/types/trailOnboarding.ts`
- [X] T002 [P] Implementar os métodos `getOnboarding`, `savePreference`, `startAssessment` e `completeAssessment` conforme os endpoints e códigos de erro de `specs/SDB-66-trail-start-preference/contracts/trail-onboarding.md`, usando a instância `api` de `src/api/api.ts`, em `src/api/trailOnboardingApi.ts`
- [X] T003 Criar o hook `useTrailOnboarding` em `src/hooks/useTrailOnboarding.ts`, encapsulando carregamento, seleção temporária, persistência, loading/erro, rascunho local e retomada do `TrailOnboardingState` conforme `src/types/trailOnboarding.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Disponibilizar navegação e primitives visuais que bloqueiam todas as histórias.

**Critical**: As histórias começam somente após esta fase.

- [X] T004 Configurar o shell de rotas públicas/protegidas necessário para `/trails/new/start` e `/trails/new/assessment` em `src/App.tsx`, preservando a dashboard existente como rota inicial
- [X] T005 [P] Criar o componente de progresso “Etapa 2 de 3: Calibração de Conhecimento”, com estados concluído/atual/futuro e largura responsiva, em `src/components/customer/OnboardingProgress.tsx`
- [X] T006 [P] Adicionar tokens e estilos base para o shell do onboarding, estados de foco, cards, CTAs, breakpoints e `prefers-reduced-motion` em `src/App.css` e `src/index.css`

**Checkpoint**: tipos, fronteira de API, hook, rotas e primitives visuais disponíveis para implementação das histórias.

---

## Phase 3: User Story 1 - Escolha do início da trilha (Priority: P1) 🎯 MVP

**Goal**: Permitir comparar e confirmar os caminhos “Recomendado pela IA” e “Passo a passo”, registrando a preferência e avançando para a etapa correta.

**Independent Test**: Em `/trails/new/start`, o usuário visualiza as duas opções, não consegue confirmar sem seleção, escolhe IA e navega ao diagnóstico ou escolhe passo a passo e navega ao início guiado.

### Implementation for User Story 1

- [X] T007 [P] [US1] Criar `TrailStartOptionCard` com título, badge, descrição comparável, metadados, CTA e estado selecionado acessível em `src/components/customer/TrailStartOptionCard.tsx`
- [X] T008 [US1] Implementar a página de escolha com o título “Como você prefere iniciar sua trilha?”, duas opções, progresso e mensagem de retomada em `src/pages/customer/TrailStartPreferencePage.tsx`
- [X] T009 [US1] Conectar `TrailStartPreferencePage` ao `useTrailOnboarding`, desabilitar confirmação sem seleção/durante request, tratar erro de persistência e encaminhar `ai_recommended` para `/trails/new/assessment` e `step_by_step` para `/trails/new/guided` em `src/pages/customer/TrailStartPreferencePage.tsx`
- [X] T010 [US1] Integrar o CTA “Criar Nova Trilha com IA” da dashboard à rota `/trails/new/start` sem remover o conteúdo atual de trilhas em `src/components/customer/TracksSection.tsx`

**Checkpoint**: US1 funciona de forma independente e atende FR-001 a FR-005 e FR-007.

---

## Phase 4: User Story 2 - Diagnóstico rápido do nível do usuário (Priority: P2)

**Goal**: Apresentar quatro perguntas adaptativas, aceitar respostas válidas e concluir o diagnóstico para receber a trilha recomendada.

**Independent Test**: Depois de escolher IA, `/trails/new/assessment` carrega perguntas do contrato, impede envio incompleto, envia respostas e mostra o próximo estágio com nível/trilha retornados.

### Implementation for User Story 2

- [X] T011 [P] [US2] Criar `TrailLevelAssessmentPage` com carregamento das perguntas, indicador de etapa, seleção de uma opção por pergunta e resumo do tempo aproximado em `src/pages/customer/TrailLevelAssessmentPage.tsx`
- [X] T012 [US2] Integrar o início e a conclusão do diagnóstico ao `useTrailOnboarding`, exigindo resposta para cada pergunta `required` antes de chamar `completeAssessment` e preservando respostas parciais no rascunho local em `src/hooks/useTrailOnboarding.ts`
- [X] T013 [US2] Exibir estados de carregamento, erro recuperável, respostas incompletas e resultado com `level`/`recommendedTrackId` retornados pelo backend em `src/pages/customer/TrailLevelAssessmentPage.tsx`
- [X] T014 [US2] Implementar a transição para a síntese curricular ou trilha recomendada após conclusão bem-sucedida, sem recalcular pontuação no cliente, em `src/pages/customer/TrailLevelAssessmentPage.tsx`

**Checkpoint**: US1 e US2 funcionam independentemente; o diagnóstico atende FR-006 e SC-002.

---

## Phase 5: User Story 3 - Ajuste de preferências após o início (Priority: P3)

**Goal**: Permitir reabrir a configuração, visualizar a preferência atual e alterá-la sem apagar diagnóstico ou progresso.

**Independent Test**: Ao reabrir `/trails/new/start` com estado persistido, a escolha atual aparece selecionada; após trocar e confirmar, `assessmentId`, respostas concluídas e progresso permanecem.

### Implementation for User Story 3

- [X] T015 [P] [US3] Criar `TrailPreferenceSummary` com preferência atual, etapa, ação de revisar e aviso quando a trilha já foi iniciada em `src/components/customer/TrailPreferenceSummary.tsx`
- [X] T016 [US3] Carregar a configuração atual no mount, distinguir estado vazio `404` de falha real e preencher a seleção inicial sem sobrescrever o rascunho local em `src/hooks/useTrailOnboarding.ts`
- [X] T017 [US3] Implementar a confirmação de alteração que atualiza somente `preference`, mantém `assessmentId`/progresso e pede confirmação antes de reaplicar uma escolha em trilha já iniciada em `src/pages/customer/TrailStartPreferencePage.tsx`
- [X] T018 [US3] Integrar o resumo e o caminho de retorno às configurações da trilha, permitindo acessar novamente a escolha sem reiniciar o onboarding, em `src/components/customer/TrailPreferenceSummary.tsx` e `src/pages/customer/TrailStartPreferencePage.tsx`

**Checkpoint**: US3 atende FR-008, FR-009 e SC-005 sem regressão das histórias anteriores.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalizar fidelidade visual, acessibilidade, responsividade e validação da feature completa.

- [X] T019 [P] Ajustar layout desktop/mobile, contraste, foco visível, semântica de seleção e microinterações de hover/tap conforme a referência em `src/App.css` e componentes de onboarding
- [X] T020 [P] Revisar textos acessíveis, labels, estados de erro e navegação por teclado em `src/components/customer/TrailStartOptionCard.tsx`, `src/pages/customer/TrailStartPreferencePage.tsx` e `src/pages/customer/TrailLevelAssessmentPage.tsx`
- [X] T021 Executar os cenários de `specs/SDB-66-trail-start-preference/quickstart.md`, `npm run lint` e `npm run build`, corrigindo inconsistências da implementação nos arquivos `src/` envolvidos

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: T001 e T002 podem começar em paralelo; T003 depende de T001 e T002.
- **Phase 2 (Foundational)**: T004 depende de T003; T005 e T006 podem começar em paralelo com T004, mas todas devem terminar antes das histórias.
- **Phase 3 (US1)**: depende de T003-T006; T007 pode começar em paralelo com T008, T009 depende de T007/T008 e T010 depende de T004.
- **Phase 4 (US2)**: depende de US1; T011 pode começar em paralelo com T012, T013 depende de T011/T012 e T014 depende de T013.
- **Phase 5 (US3)**: depende de T003 e da navegação de US1; T015 pode começar em paralelo com T016, T017 depende de T016 e T018 depende de T015/T017.
- **Phase 6 (Polish)**: T019 e T020 podem começar em paralelo após as telas; T021 depende de todas as tarefas funcionais desejadas.

### User Story Dependencies

- **US1 (P1)**: depende somente das fases 1 e 2; é o MVP.
- **US2 (P2)**: depende do caminho de confirmação de US1 para receber a preferência IA, mas pode ser validada isoladamente com estado inicial de diagnóstico.
- **US3 (P3)**: depende do modelo/hook compartilhado e das rotas de US1; preserva US2 quando houver diagnóstico concluído.

### Parallel Opportunities

- T001 e T002 podem ser executadas simultaneamente.
- T005 e T006 podem ser executadas simultaneamente.
- Em US1, T007 e T008 podem ser executadas simultaneamente por atuarem em arquivos diferentes.
- Em US2, T011 e T012 podem ser executadas simultaneamente.
- Em US3, T015 e T016 podem ser executadas simultaneamente.
- T019 e T020 podem ser executadas simultaneamente na fase de polish.

## Parallel Example: User Story 1

```text
Task: T007 [US1] Criar src/components/customer/TrailStartOptionCard.tsx
Task: T008 [US1] Implementar src/pages/customer/TrailStartPreferencePage.tsx
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir T001-T006 para preparar tipos, API, hook, rotas e estilos.
2. Concluir T007-T010 para entregar a escolha e confirmação dos dois caminhos.
3. Validar o cenário independente de US1 antes de iniciar o diagnóstico.

### Incremental Delivery

1. Entregar US1 como MVP demonstrável.
2. Adicionar US2 com perguntas, respostas e recomendação automatizada.
3. Adicionar US3 com retomada e alteração sem perda de progresso.
4. Finalizar acessibilidade, responsividade e gates no Phase 6.

## Notes

- Todas as tarefas usam o formato de checklist com identificador sequencial, com `[P]` somente quando há paralelismo seguro e `[USx]` em todas as tarefas de histórias.
- Não há tarefas automatizadas de teste porque elas não foram solicitadas e o repositório não possui framework configurado.
- O backend deve seguir o contrato em `specs/SDB-66-trail-start-preference/contracts/trail-onboarding.md`; a regra de recomendação permanece fora do cliente.