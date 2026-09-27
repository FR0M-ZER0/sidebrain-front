---

description: "Task list for the SDB-74 lesson completion screen"
---

# Tasks: Conclusão da Lição

**Input**: Design documents from `/specs/SDB-74-lesson-completion/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/lesson-completion-ui.md`, `quickstart.md`

**Tests**: No automated test tasks are included because the specification did not request TDD and the repository has no test runner. Each story has an independent manual acceptance check; final validation uses lint, build, and `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation after shared setup/foundation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executada em paralelo, pois altera arquivos distintos e não depende de tarefa incompleta.
- **[Story]**: História correspondente da especificação (`US1`, `US2`, `US3`).
- Cada tarefa indica os caminhos exatos dos arquivos que deve alterar.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add requested UI dependencies and configure the styling/animation toolchain without migrating existing screens.

- [ ] T001 [P] Add `motion`, `tailwindcss` 4.x, and `@tailwindcss/vite` 4.x dependencies in `package.json` and update `package-lock.json`.
- [ ] T002 [P] Configure the Tailwind Vite plugin in `vite.config.ts` and initialize theme/utilities in `src/index.css` without enabling Preflight; keep the existing React plugin and CSS behavior intact.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared lesson-completion data and loading/sync state boundaries before implementing the stories.

- [ ] T003 Define `LessonCompletion`, `StudyStreak`, `CompletionStats`, `AchievementBadge`, `DailyGoal`, `NextLesson`, and view/sync states in `src/types/lessonCompletion.ts`; preserve required/optional fields and validations from `data-model.md`, including verbatim: “lessonId: string; Identificador não vazio da lição concluída”, “lessonNumber: inteiro positivo”, “scorePercentage: número; Faixa válida de 0 a 100; esta tela só é elegível quando o valor é exatamente 100”, “feedbackTitle: string; Título de feedback não vazio quando fornecido”, “days: inteiro não negativo”, “totalXp: inteiro não negativo ou indisponível; Não substituir indisponibilidade por zero”, “targetXp: número não negativo; Alvo diário; tratar alvo zero sem divisão inválida”, “percentage: número de 0 a 100+; Pode exceder 100 quando meta superada; progresso visual limita o preenchimento a 100%, preservando valor textual real”, and “estimatedMinutes: inteiro positivo opcional”.
- [ ] T004 Create a typed mock fixture and replaceable `getLessonCompletion`/`syncLessonRewards` service boundary in `src/api/lessonCompletionService.ts`; use the supplied Lição 3 data, distinguish missing data from zero, and do not call a guessed endpoint or claim mock persistence as a successful backend save.
- [ ] T005 Create `useLessonCompletion` in `src/hooks/useLessonCompletion.ts` to load the result, present this screen only at exactly 100%, expose loading/load-error/sync/retry states, preserve navigation during retry, and guard duplicate requests/actions.

**Checkpoint**: Shared types and mock/service state are available; no UI story should invent data or perform HTTP outside `src/api`.

---

## Phase 3: User Story 1 — Entender o resultado e as recompensas (Priority: P1) 🎯 MVP

**Goal**: Present the perfect lesson result, study streak, XP, achievement, daily goal, and next lesson from the provided data.

**Independent Test**: Load the supplied result with `scorePercentage: 100`; verify all available metrics and rewards render accurately, missing fields are not fabricated, and a result below 100% does not render this completion screen.

### Implementation for User Story 1

- [ ] T006 [US1] Build the responsive completion content in `src/components/lessons/LessonCompletionView.tsx`: hero/100% indicator, feedback, streak card, XP/badge/daily-goal metric cards, next-lesson summary, actions, and supplied display text; follow `contracts/lesson-completion-ui.md` and the local reference image.
- [ ] T007 [US1] Compose `LessonCompletionPage` in `src/pages/lessons/LessonCompletionPage.tsx` using `useLessonCompletion` and `LessonCompletionView`; render the completion view only for an exact 100% score and provide a clear non-completion/error fallback without showing invented rewards.

**Checkpoint**: The page can be independently previewed with the supplied mock fixture and passes the US1 acceptance scenarios without depending on the quiz-result page.

---

## Phase 4: User Story 2 — Continuar a jornada de estudos (Priority: P1)

**Goal**: Make primary/secondary/profile actions and keyboard shortcuts accessible, preventing duplicate navigation.

**Independent Test**: In the isolated page preview, verify callbacks for next lesson, trails, and profile; verify Enter/Esc invoke the expected action once, including no-next-lesson and in-flight-navigation cases.

### Implementation for User Story 2

- [ ] T008 [US2] Add typed `onStartNextLesson`, `onReturnToTrails`, and `onViewProfile` callbacks to `src/components/lessons/LessonCompletionView.tsx` and pass them from `src/pages/lessons/LessonCompletionPage.tsx`; disable the primary action and explain why when `nextLesson` is absent.
- [ ] T009 [US2] Implement Enter/Esc keyboard handling and one-action-at-a-time protection in `src/hooks/useLessonCompletion.ts`; Enter must do nothing when next lesson is absent or navigation is pending, and Esc must call the same return action as close/back.
- [ ] T010 [US2] Map the trails action to the existing dashboard destination and keep next-lesson/profile destinations injected by the host in `src/pages/lessons/LessonCompletionPage.tsx`; document unresolved route integration in `specs/SDB-74-lesson-completion/contracts/lesson-completion-ui.md` and do not register an unprotected route in `src/App.tsx`.

**Integration dependency**: The repository currently has no lesson, next-lesson, profile, or authentication routes/guard. Until product/platform supplies real destinations and a guard, callback behavior can be validated in isolation, but these destinations cannot be represented as completed production navigation.

**Checkpoint**: Every action has a valid callback, missing next lesson is non-actionable, and repeated key presses cannot trigger duplicate operations.

---

## Phase 5: User Story 3 — Acompanhar a preparação e problemas de sincronização (Priority: P2)

**Goal**: Communicate loading, load failure, reward-sync failure/retry, and non-blocking entrance/interactions.

**Independent Test**: Simulate loading, load error, retry success and retry failure; verify placeholders/no fabricated values, a perceivable error/retry state, available navigation, and entrance/interaction behavior with and without reduced motion.

### Implementation for User Story 3

- [ ] T011 [P] [US3] Create the header-and-three-metric placeholder component in `src/components/lessons/LessonCompletionSkeleton.tsx`; preserve the final content geometry and provide an accessible loading label.
- [ ] T012 [US3] Render loading and failed-load states from `src/pages/lessons/LessonCompletionPage.tsx` using `LessonCompletionSkeleton.tsx`; keep a valid return action available and show no fake score/XP.
- [ ] T013 [US3] Add synchronization failure feedback and “Tentar novamente” behavior to `src/components/lessons/LessonCompletionView.tsx` and `src/hooks/useLessonCompletion.ts`; retry must leave navigation available, report its outcome, and never claim backend persistence from the local mock.
- [ ] T014 [US3] Add mount, icon-scale, staggered metric-card, hover/focus/tap, and profile-arrow animations in `src/components/lessons/LessonCompletionView.tsx` using `motion/react`; honor reduced-motion preference and keep content available if animation is skipped.

**Checkpoint**: Loading, sync error/retry, transitions, and motion-reduction scenarios in `quickstart.md` can be checked independently using the mock service.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate accessible responsive behavior and project quality gates.

- [ ] T015 Run `npm run lint`, `npm run build`, and every manual scenario in `specs/SDB-74-lesson-completion/quickstart.md`; correct issues in the affected `src/` files and verify Tailwind setup has not changed existing screens globally.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001 and T002 may run in parallel because they touch separate files.
- **Foundational (Phase 2)**: Starts after setup. T004 depends on the types from T003; T005 depends on T003 and T004 and blocks the story pages.
- **User Stories (Phase 3+)**: Start after foundation. US1 is the MVP. US2 depends on the US1 view/page. US3 depends on the view/page and shared state from foundation.
- **Polish (Phase 6)**: Depends on the desired stories being implemented.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; independently renders the perfect result from mock data.
- **US2 (P1)**: Starts after US1 because it wires navigation/keyboard behavior into its view and page. Route destinations/guard remain an external integration dependency.
- **US3 (P2)**: Starts after US1 because loading/error/retry states share its view/page; skeleton file T011 can be prepared in parallel with unrelated US2 callback work once Phase 2 is complete.

### Within Each User Story

- Complete model/service prerequisites before view integration.
- Keep every HTTP call (if introduced after an API contract exists) behind `src/api/api.ts` and its domain API module.
- No automated test tasks are generated; execute each phase's independent manual test criteria and final `quickstart.md` validation.

### Parallel Opportunities

- **Setup**: T001 (dependencies/lockfile) and T002 (Vite/CSS configuration) touch separate files.
- **Foundation**: T003 (types) must precede T004 (typed mock service); T005 waits for both. No safe parallel split exists within this chain.
- **Stories**: T011 (skeleton component) can be authored separately from US2 callback/keyboard tasks after shared models exist, although page wiring waits for US1.

---

## Parallel Examples by User Story

```text
US1: No safe same-story parallelism: T007 consumes the view contract created by T006.
Execute T006, then T007.

US2: No safe same-story parallelism: T009 must use the callbacks exposed by T008;
T010 wires those actions in the page after the callback contract is settled.
Execute T008, then T009/T010 as applicable without editing the same page file concurrently.

US3 (after US1): These tasks use separate files and can start together:
Task T011: Create skeleton in src/components/lessons/LessonCompletionSkeleton.tsx
Task T014: Add Motion interactions in src/components/lessons/LessonCompletionView.tsx
```

Integrate T011 into `src/pages/lessons/LessonCompletionPage.tsx` only after the skeleton file exists; T012 and T013 follow their declared story order.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Implement US1: exact-100% eligibility and display all available lesson/reward data from the mock.
3. **Stop and validate** the standalone view with the US1 criterion in desktop/tablet/mobile sizes.
4. Do not expose it through an unprotected route; real route release requires the platform guard and destinations.

### Incremental Delivery

1. Add US1 to deliver a standalone, mock-backed perfect-completion view.
2. Add US2 callbacks and shortcuts; enable actual next-lesson/profile route navigation only when destinations and authentication guard are supplied.
3. Add US3 loading, errors/retry and animation/reduced-motion behavior.
4. Complete cross-cutting lint/build/manual validation.

### Parallel Team Strategy

1. Complete T001/T002 in parallel.
2. Complete types (T003), then the typed service fixture (T004), then implement the shared hook (T005).
3. After shared state exists, UI and skeleton work may be split across developers only if component props/files do not overlap; integrate before checkpoint validation.

## Notes

- `[P]` means different files and no dependency on incomplete work.
- Story labels map to user stories in `spec.md`.
- The project has no test runner; manual acceptance is not a substitute for verifying production navigation destinations.
- Do not introduce a fake authentication guard, guessed backend endpoint, fake score, or false sync-success message.
