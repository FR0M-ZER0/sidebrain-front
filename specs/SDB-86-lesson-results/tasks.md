---
description: "Task list for implementation of Resultado da Lição"
---

# Tasks: Resultado da Lição

**Input**: Design documents from `specs/SDB-86-lesson-results/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

**Tests**: Não foram solicitados testes automatizados; a validação será feita pelos comandos de lint/build e pelos cenários manuais do quickstart.

**Organization**: Tasks grouped by user story to enable independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executada em paralelo com outra tarefa sem dependência de arquivo/resultado.
- **[Story]**: História correspondente à especificação (`US1`, `US2`, `US3`).
- Todas as tarefas citam os caminhos exatos dos arquivos envolvidos.

## Phase 1: Setup

**Purpose**: Preparar infraestrutura e estrutura de projeto.

O aplicativo, a rota `/quiz-result` e os componentes de resultado já existem; não é necessária inicialização ou instalação de dependências nesta feature.

---

## Phase 2: Foundational

**Purpose**: Preparar o modelo e a rota que sustentam todas as histórias. Completar antes das histórias de usuário.

- [X] T001 [P] Atualizar os tipos do resultado, sequência de estudos, campos de revisão da questão e feedback local em `src/types/quizResult.ts`.
- [X] T002 Completar o resultado estático com os cinco títulos/categorias/tempos corretos e conteúdo coerente de enunciado, resposta selecionada, resposta correta e explicação em `src/hooks/useQuizResult.ts` (depende de T001).
- [X] T003 [P] Retirar apenas a rota `/quiz-result` do shell com sidebar, mantendo as demais rotas inalteradas, em `src/App.tsx`.

**Checkpoint**: Tipos, dados de demonstração e renderização em rota de foco estão disponíveis para cada história.

---

## Phase 3: User Story 1 - Consultar o resultado da sessão (Priority: P1) 🎯 MVP

**Goal**: Mostrar conclusão, aproveitamento, acertos, XP, precisão, tempo e sequência na composição de foco.

**Independent Test**: Acessar `/quiz-result` e verificar status, mensagem, 100%, 5 de 5, +80 XP, 100% de precisão, 2m 15s e 12 dias, sem sidebar.

### Implementation

- [X] T004 [P] [US1] Apresentar a mensagem e o resumo de conclusão com os dados do resultado em `src/components/customer/QuizResultSummary.tsx`.
- [X] T005 [P] [US1] Exibir sequência de 12 dias no cabeçalho e garantir identificação de foco no cabeçalho/rodapé da tela em `src/pages/customer/QuizResultPage.tsx`.
- [X] T006 [P] [US1] Ajustar somente as classes específicas `quiz-result-*` para a composição de destaque, três métricas, fundo lilás e adaptação desktop em `src/App.css`, preservando estilos compartilhados de outras telas.

**Checkpoint**: Resultado e indicadores principais podem ser demonstrados independentemente da revisão detalhada e do feedback.

---

## Phase 4: User Story 2 - Revisar as questões respondidas (Priority: P1)

**Goal**: Revisar dados e explicações das cinco questões, individualmente ou em conjunto.

**Independent Test**: Expandir cada questão e verificar enunciado, resposta selecionada, resposta correta e explicação; testar expandir/recolher todas e estados mistos.

### Implementation

- [X] T007 [P] [US2] Exibir enunciado, resposta escolhida, resposta correta e explicação no painel expansível de cada questão em `src/components/customer/QuizResultQuestionItem.tsx`.
- [X] T008 [P] [US2] Estilizar os detalhes expandidos e estados visuais das questões usando apenas seletores `quiz-result-question*` em `src/App.css`.
- [X] T009 [US2] Garantir expansão/recolhimento independente, ação global que expande em estado misto e rótulo alternado somente quando todas estiverem abertas em `src/hooks/useQuizResult.ts`.

**Checkpoint**: As cinco questões e seus detalhes permanecem corretos em qualquer ordem de interação.

---

## Phase 5: User Story 3 - Escolher o próximo passo ou retornar (Priority: P2)

**Goal**: Apresentar feedback e confirmação mockados na própria tela e permitir retorno pelo botão ou Escape.

**Independent Test**: Acionar feedback, refazer, fechar e Escape; confirmar conteúdo demonstrativo e retorno sem navegação duplicada.

### Implementation

- [X] T010 [P] [US3] Adicionar ao estado local os dados/ações de feedback e confirmação de nova tentativa sem navegação externa em `src/hooks/useQuizResult.ts`.
- [X] T011 [US3] Renderizar área de feedback e confirmação na própria tela e ligar os controles de fechar/Escape à navegação de retorno com fallback seguro em `src/pages/customer/QuizResultPage.tsx` (depende de T010).
- [X] T012 [P] [US3] Aplicar estados visuais específicos para feedback demonstrativo e confirmação de nova tentativa em `src/App.css`.

**Checkpoint**: Cada ação tem resultado observável local; nenhuma ação depende de serviço de aprendizagem ou IA.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validar integração, qualidade e ausência de regressões.

- [ ] T013 Executar `npm run lint`, `npm run build` e todos os cenários de `specs/SDB-86-lesson-results/quickstart.md`; corrigir problemas em `.gitignore`, `eslint.config.js`, `src/App.tsx`, `src/App.css`, `src/components/customer/QuizResultActionBar.tsx`, `src/components/customer/QuizResultMetricGrid.tsx`, `src/components/customer/QuizResultSummary.tsx`, `src/components/customer/QuizResultQuestionItem.tsx`, `src/hooks/useQuizResult.ts`, `src/pages/customer/QuizResultPage.tsx` e `src/types/quizResult.ts` antes de concluir.

**Validação registrada**: `npm run build` e ESLint direcionado aos arquivos da feature passaram. `npm run lint` global permanece bloqueado por erro preexistente em `src/hooks/useTrailGeneration.ts:55` (`react-hooks/set-state-in-effect`), arquivo fora do escopo e não alterado nesta implementação.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: nenhuma tarefa; o projeto e a tela-alvo já estão configurados.
- **Foundational (Phase 2)**: T001 e T003 podem começar em paralelo; T002 depende de T001. Todas as tarefas das histórias aguardam T001–T003.
- **US1 (Phase 3)**: depende da fundação; suas tarefas atuam em arquivos diferentes e podem ser paralelizadas.
- **US2 (Phase 4)**: depende da fundação; T007/T008 podem rodar em paralelo; T009 finaliza o estado de interação do hook após a base de dados T002.
- **US3 (Phase 5)**: depende da fundação; T010 e T012 podem rodar em paralelo; T011 depende de T010.
- **Polish (Phase 6)**: T013 depende das histórias pretendidas estarem concluídas.

### User Story Dependencies

- **US1 (P1)**: após a fundação; primeira entrega demonstrável (MVP).
- **US2 (P1)**: após a fundação; pode ser implementada em paralelo à US1 quando os arquivos de apresentação não estiverem sendo editados simultaneamente. Não depende funcionalmente da US1 além do modelo comum.
- **US3 (P2)**: após a fundação; pode ser implementada em paralelo às demais histórias se as alterações de `App.css` e `QuizResultPage.tsx` forem coordenadas.

### Parallel Opportunities

- **Fundação**: T001 (`src/types/quizResult.ts`) e T003 (`src/App.tsx`) são arquivos independentes.
- **US1**: T004 (`QuizResultSummary.tsx`), T005 (`QuizResultPage.tsx`) e T006 (`App.css`) são arquivos distintos.
- **US2**: T007 (`QuizResultQuestionItem.tsx`) e T008 (`App.css`) são arquivos distintos; T009 altera somente o hook.
- **US3**: T010 (`useQuizResult.ts`) e T012 (`App.css`) podem ser paralelas; T011 espera T010.
- Mudanças concorrentes em `src/App.css` entre histórias devem ser serializadas ou divididas em blocos por seletor para evitar conflito.

### Parallel Example: User Story 1

```text
T004 — atualizar o resumo em src/components/customer/QuizResultSummary.tsx
T005 — ajustar cabeçalho/rodapé em src/pages/customer/QuizResultPage.tsx
T006 — ajustar estilos de foco em src/App.css
```

## Implementation Strategy

### MVP First (US1)

1. Concluir T001–T003.
2. Implementar T004–T006.
3. Validar independentemente os dados e a composição sem sidebar conforme o teste da US1.
4. Prosseguir para revisão das questões e ações locais.

### Incremental Delivery

1. Fundação → modelo correto e rota de foco.
2. US1 → resultado e métricas principais (MVP demonstrável).
3. US2 → revisão individual e global das cinco respostas.
4. US3 → feedback/refazer demonstrativos e retorno por Escape/fechar.
5. Polish → lint, build e roteiro manual completo.
