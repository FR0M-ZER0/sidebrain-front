# Tasks: Resultado do Quiz

**Input**: Design documents from `/specs/SDB-67-quiz-result/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature does not request a formal test framework; validation is done through the app flow and lint/build checks described in `quickstart.md`.

**Organization**: Tasks are grouped by user story so each one can be implemented and validated independently.

**Total task count**: 31

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the repo structure and create the feature-specific files needed for the quiz result screen.

- [x] T001 Create the feature folder structure and verify the existing `src/pages`, `src/components`, `src/hooks`, and `src/types` layout matches the result-screen architecture in `docs/architecture.md`
- [x] T002 Review the existing assessment/dashboard patterns in `src/types/assessment.ts`, `src/hooks/useAssessmentFlow.ts`, and `src/pages/customer/AssessmentPage.tsx` to align naming and UI conventions for the quiz result view
- [x] T003 [P] Prepare the feature-local type and component scaffolding in `src/types/quizResult.ts`, `src/pages/customer/QuizResultPage.tsx`, and `src/hooks/useQuizResult.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared pieces that support all quiz-result scenarios before any story-specific work begins.

- [x] T004 Define the `QuizResultViewModel`, `MetricCard`, `QuizQuestionReview`, and `ContinuationAction` contracts in `src/types/quizResult.ts` with validation constraints from `data-model.md`
- [x] T005 [P] Build the loading, error, and summary-state shell in `src/components/customer/QuizResultSummary.tsx` and `src/components/customer/QuizResultEmptyState.tsx` so the layout remains stable when data is missing or partial
- [x] T006 [P] Implement the reusable result-state orchestration hook in `src/hooks/useQuizResult.ts` to manage loading/error, expansion toggles, and action callbacks
- [x] T007 Create the page-level result composition in `src/pages/customer/QuizResultPage.tsx` to connect the hook, the summary shell, and the action flow for the screen

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Consultar desempenho após o quiz (Priority: P1) 🎯 MVP

**Goal**: Exibir o resumo consolidado do desempenho do usuário após o quiz, incluindo métricas principais e estados de carregamento/erro.

**Independent Test**: Carregar um resultado concluído e validar que a tela apresenta pontuação, respostas corretas, total de questões, XP, precisão, tempo gasto, retenção estimada e sequência atual sem forçar um estado de sucesso máximo quando o desempenho real for inferior a 100%.

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement the finished summary data mapping in `src/types/quizResult.ts` for `moduleName`, `attemptLabel`, `scorePercent`, `correctAnswers`, `totalQuestions`, `xpEarned`, `precision`, `elapsedTime`, `retentionEstimate`, `currentSequence`, and `status` with `0..100` and `correctAnswers <= totalQuestions` validation logic
- [x] T009 [P] [US1] Create the metric card grid component in `src/components/customer/QuizResultMetricGrid.tsx` to render each metric, fallback text, and tone styling without relying only on color
- [x] T010 [US1] Implement the score and completion messaging in `src/components/customer/QuizResultSummary.tsx` so it reflects the real result, including partial-success states and accessible non-color cues
- [x] T011 [US1] Add the loading state and empty-state handling in `src/components/customer/QuizResultLoadingState.tsx` and `src/components/customer/QuizResultErrorState.tsx` to keep the structure visible while data is being processed or unavailable
- [x] T012 [US1] Wire the page-level data fetch and state transitions in `src/pages/customer/QuizResultPage.tsx` to show loading, success, and error views based on the result payload `status`
- [x] T013 [US1] Integrate `useQuizResult.ts` with the page to expose the computed summary values, status, and fallback messaging for partial or unavailable metrics
- [x] T014 [US1] Add responsive layout rules in `src/index.css` or the relevant page/component styles to ensure desktop, tablet, and mobile layouts remain readable without overlapping actions or metrics
- [x] T015 [US1] Validate the user-story flow with the manual checks from `specs/SDB-67-quiz-result/quickstart.md`, confirming the summary view is correct for success, partial, loading, and error scenarios

**Checkpoint**: At this point, User Story 1 should be fully functional and independently testable.

---

## Phase 4: User Story 2 - Revisar o detalhamento das questões (Priority: P1)

**Goal**: Permitir que o usuário revise cada questão, veja o estado e expandir ou recolher o conteúdo detalhado conforme necessário.

**Independent Test**: Abrir um resultado com múltiplas questões, expandir uma questão, expandir todas e recolher todas, verificando que o estado visual e o conteúdo detalhado são mostrados na questão correta sem quebrar a lista.

### Implementation for User Story 2

- [x] T016 [P] [US2] Create the question review item component in `src/components/customer/QuizResultQuestionItem.tsx` to render the card title, status, category, duration, and toggler state for each question
- [x] T017 [P] [US2] Create the question list container in `src/components/customer/QuizResultQuestionList.tsx` to support the global "expandir todas/recolher todas" action and maintain per-item expansion state
- [x] T018 [US2] Add the detailed answer and explanation rendering in `src/components/customer/QuizResultQuestionItem.tsx` so `userAnswer`, `explanation`, and fallback text appear only when the card is expanded
- [x] T019 [US2] Integrate the `isExpanded` and `status` logic in `src/hooks/useQuizResult.ts` so individual questions and the global control update state consistently across the list
- [x] T020 [US2] Handle empty-question and missing-detail edge cases in `src/components/customer/QuizResultQuestionList.tsx` and `src/components/customer/QuizResultEmptyState.tsx` so the screen stays usable even with no review items or absent explanations
- [x] T021 [US2] Add the accessible expansion controls and keyboard semantics in `src/components/customer/QuizResultQuestionItem.tsx` and `src/components/customer/QuizResultQuestionList.tsx`, including clear labels for expanded/collapsed states
- [x] T022 [US2] Validate the review flow against the acceptance scenarios in `spec.md`, including single-item expansion, global collapse/expand, and empty/missing-detail states

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Escolher o próximo passo (Priority: P1)

**Goal**: Entregar ações de continuidade claras para voltar à trilha, refazer o quiz e abrir o feedback detalhado da IA.

**Independent Test**: Selecionar cada ação do resultado e verificar que cada botão conduz ao destino correto, e que `ESC` e o botão de fechar executam o mesmo retorno à trilha.

### Implementation for User Story 3

- [x] T023 [P] [US3] Create the continuation action bar in `src/components/customer/QuizResultActionBar.tsx` to render the distinct actions for `back-to-track`, `retry`, and `feedback`
- [x] T024 [US3] Map each `ContinuationAction` to a route destination and callback in `src/hooks/useQuizResult.ts` while preserving the action IDs required by the UI contract
- [x] T025 [US3] Implement the close/escape behavior in `src/pages/customer/QuizResultPage.tsx` so the user returns to the track view and does not trigger duplicate navigation when already leaving the page
- [x] T026 [US3] Add a final action-state confirmation and disabled/active affordance in `src/components/customer/QuizResultActionBar.tsx` so users can distinguish the selected or available actions without depending on color alone
- [x] T027 [US3] Connect the action bar to the page navigation flow in `src/pages/customer/QuizResultPage.tsx` so `Voltar para a Trilha`, `Refazer Quiz`, and `Ver Feedback Detalhado da IA` each invoke the proper route or callback
- [x] T028 [US3] Validate the exit actions with keyboard and pointer interaction, confirming `ESC`, the close button, and the explicit back-to-track action all produce the same result without duplicate navigation

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize accessibility, documentation, and cross-feature quality checks before completion.

- [x] T029 [P] Review the final screen against the requirements in `spec.md` and the UI contract in `contracts/quiz-result-ui-contract.md` to confirm summary metrics, review list, actions, and edge states are all covered
- [x] T030 [P] Update project documentation or inline comments in `src/pages/customer/QuizResultPage.tsx`, `src/components/customer/`, and `src/hooks/useQuizResult.ts` to explain the result-state model and fallback behavior for future maintainers
- [x] T031 Run the required validation steps in `quickstart.md` (`npm run lint` and `npm run build`) and confirm the feature passes without introducing regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all stories.
- **User Story 1 (Phase 3)**: Depends on Foundation completion; is the MVP and must be fully valid before expanding scope.
- **User Story 2 (Phase 4)**: Depends on Foundation completion; can proceed in parallel with US1 if the team has capacity.
- **User Story 3 (Phase 5)**: Depends on Foundation completion; can proceed in parallel with US1/US2 after the base contract is stable.
- **Polish (Phase 6)**: Depends on all desired stories being complete.

### User Story Dependencies

- **User Story 1 (US1)**: Can start after Phase 2; no dependency on other stories.
- **User Story 2 (US2)**: Can start after Phase 2; should be independently testable from US1.
- **User Story 3 (US3)**: Can start after Phase 2; should be independently testable from US1/US2.

### Parallel Opportunities

- `T003` can run in parallel with `T001` and `T002` in Phase 1.
- `T005` and `T006` can run in parallel in Phase 2.
- `T008` and `T009` can run in parallel within US1.
- `T016` and `T017` can run in parallel within US2.
- `T023` can proceed in parallel with the question-review work once the shared contract is stable.
- `T029` and `T030` can run in parallel in the final polish phase.

### Parallel Example: User Story 1

```bash
# In parallel, prepare the shared summary and metric UI pieces:
Task: "Implement the metric card grid component in src/components/customer/QuizResultMetricGrid.tsx"
Task: "Implement the score and completion messaging in src/components/customer/QuizResultSummary.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the summary screen independently.
5. If the result screen works correctly, continue with US2 and US3.

### Incremental Delivery

1. Setup + Foundational create the screen shell and shared state contracts.
2. Implement User Story 1 to deliver the result summary and loading/error handling.
3. Implement User Story 2 to add review details and card expansion.
4. Implement User Story 3 to add continuation actions and close behavior.
5. Run the polish pass and validation gate.

### Team Parallel Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Developer A works on User Story 1 summary and state model.
3. Developer B works on User Story 2 detail review and expand/collapse behavior.
4. Developer C works on User Story 3 actions and navigation.
5. Final polish is done together once all story checks pass.

---

## Notes

- [P] tasks represent different files or independent work items with no dependency conflicts.
- [USx] labels map each task to the story that owns it for traceability and independent validation.
- All story-level tasks should be independently testable without relying on the other story phases.
- Validation must check the real UI behavior and the repo’s lint/build gates rather than mocked-only assumptions.
- The MVP is the quiz-result summary screen; the detailed review and continuation actions build on top of that foundation.
