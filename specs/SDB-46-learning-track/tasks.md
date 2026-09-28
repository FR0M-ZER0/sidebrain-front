# Tasks: Página de Detalhes da Trilha de Aprendizado

**Input**: Design documents from `/specs/SDB-46-learning-track/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/track-details-ui.md`, `quickstart.md`

**Tests**: Não foi solicitado TDD e o projeto não tem runner de testes. Use `quickstart.md`, `npm run lint` e `npm run build` para validação.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label from `spec.md` (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar a visualização de desenvolvimento sem expor uma rota de produção desprotegida.

- [X] T001 Attempt to inspect the “Sidebrain - Página da trilha (Desktop)” frame in Figma and compare it with `docs/img/Sidebrain - Página da trilha (Desktop).png`; record measurements in `specs/SDB-46-learning-track/research.md` if accessible, or record the login blocker and stop before CSS/Tailwind tasks. Create the development-only entry in `track-preview.html` and mount point in `src/dev/trackPreview.tsx`, keeping the production route out of `src/App.tsx` until an authenticated guard exists

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criar dados tipados, serviço local e estado de consulta usados pelas histórias.

**⚠️ CRITICAL**: As histórias de UI dependem destes tipos e da fixture; concluir esta fase antes das fases de história.

- [X] T002 Define `TrackDetails`, `Mission`, `Module` and `Lesson` in `src/types/trackDetails.ts`; require nonempty `TrackDetails.title`, nonnegative lesson totals/rewards, module statuses `completed | in_progress | locked`, lesson statuses `completed | available | locked`, optional mission/lesson `xpReward`, optional lesson `durationText`/`description`, and visual progress bounded to 0–100 as specified in `data-model.md`
- [X] T003 Add the `lingua-japonesa` mock and typed lookup function in `src/api/trackService.ts`; preserve both mission values `currentProgress: 0`, `totalProgress: 5` and `progressPercentage: 67`
- [X] T004 Implement loading and success state for the local lookup in `src/hooks/useTrackDetails.ts`, keyed by the requested slug; do not add a retry action for a fixture that cannot fail

**Checkpoint**: Fixture, entities and lookup state are available to the page and isolated preview.

---

## Phase 3: User Story 1 - Acompanhar o progresso da trilha (Priority: P1) 🎯 MVP

**Goal**: O aluno entende o avanço da trilha e das missões e consegue retornar às áreas relacionadas.

**Independent Test**: Carregar a fixture e conferir título, nível, 4/10 lições, 40%, as duas missões e suas barras; a missão 0/5 e 67% deve mostrar os dois valores e identificar a divergência. Acionar as âncoras e conferir as seções de destino no dashboard.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Render the breadcrumb linking to `/#tracks`, trail title, level and lesson-total summary in `src/components/customer/tracks/TrackDetailsHeader.tsx`; provide visible hover, keyboard-focus and pressed feedback for the breadcrumb
- [ ] T006 [P] [US1] Render completed/total lesson counts and a bounded, labeled progress bar in `src/components/customer/tracks/TrackProgressCard.tsx`
- [ ] T007 [P] [US1] Render each mission's reward when provided, counts and supplied percentage in `src/components/customer/tracks/TrackMissionsCard.tsx`; omit missing rewards, preserve inconsistent source values, flag their mismatch accessibly, bound only the visual bar to 0–100, and link “Ver todas as missões” to `/#missions` with hover/focus/pressed feedback
- [X] T008 [P] [US1] Add stable `tracks` and `missions` section IDs in `src/components/customer/TracksSection.tsx` and `src/components/customer/MissionsSection.tsx` so `/#tracks` and `/#missions` resolve to the existing dashboard sections
- [ ] T009 [US1] Compose the header, progress card and missions card in the desktop two-column content area in `src/pages/customer/TrackDetailsPage.tsx` and render the page from `src/dev/trackPreview.tsx`
- [ ] T010 [US1] Register `/trails/:slug` in `src/App.tsx` only under a real authenticated route guard; this task is BLOCKED until the application provides that guard, so do not add an unprotected production route

**Checkpoint**: User Story 1 can be demonstrated in `track-preview.html`; production navigation remains gated by T010.

---

## Phase 4: User Story 2 - Navegar pelo roteiro e acessar lições (Priority: P1)

**Goal**: O aluno percorre módulos e identifica/aciona lições conforme o estado concluído, disponível ou bloqueado.

**Independent Test**: Expandir e recolher módulos concluído/em andamento por cabeçalho e seta; confirmar conteúdo e navegação das lições 1–4; tentar acionar lições 5–6 e módulos 3–4 e verificar que continuam bloqueados.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Add semantic completed/in-progress/locked color tokens to `src/index.css` and implement module status, lesson counts and accessible expansion controls with `aria-expanded`/`aria-controls` in `src/components/customer/tracks/ModuleAccordion.tsx`; provide hover/focus/pressed feedback and keep locked modules non-expandable
- [ ] T012 [P] [US2] Render completed, available and locked lesson variants with correct metadata, labels, icons, enabled/disabled actions and hover/focus/tap feedback in `src/components/customer/tracks/LessonItem.tsx`; omit optional duration, rewards or description when absent
- [ ] T013 [US2] Add the ordered module list and `ModuleAccordion` content to `src/pages/customer/TrackDetailsPage.tsx`, preserving module status/counts from the fixture
- [ ] T014 [US2] Wire enabled “Iniciar” and “Revisar” actions to the matching `/lessons/:id` route and preserve the track URL as return state in `src/pages/customer/TrackDetailsPage.tsx`

**Checkpoint**: User Story 2 works in the isolated preview and blocked items never navigate.

---

## Phase 5: User Story 3 - Reconhecer carregamento e usar a página em qualquer tela (Priority: P2)

**Goal**: O aluno reconhece o carregamento e usa todas as informações e ações em desktop, tablet e mobile.

**Independent Test**: Simular carregamento, conferir skeletons para resumo/missões/módulos e substituição dos placeholders; testar teclado, redução de movimento e larguras desktop/tablet/mobile sem sobreposição ou rolagem horizontal.

### Implementation for User Story 3

- [ ] T015 [US3] Create responsive skeleton regions for summary, missions and module list with `aria-busy`, accessible loading status and `motion-reduce:animate-none` in `src/components/customer/tracks/TrackDetailsSkeleton.tsx`
- [ ] T016 [US3] Render `TrackDetailsSkeleton` while `useTrackDetails` is loading and the page content after success in `src/pages/customer/TrackDetailsPage.tsx`
- [ ] T017 [US3] Make the two-column summary/roadmap layout collapse to one column and keep long titles/actions usable without horizontal overflow in `src/pages/customer/TrackDetailsPage.tsx` and `src/components/customer/tracks/TrackProgressCard.tsx`, `src/components/customer/tracks/TrackMissionsCard.tsx`, `src/components/customer/tracks/ModuleAccordion.tsx` and `src/components/customer/tracks/LessonItem.tsx`
- [ ] T018 [US3] Add staggered entry and smooth module expand/collapse with Motion in `src/pages/customer/TrackDetailsPage.tsx` and `src/components/customer/tracks/ModuleAccordion.tsx`; use stable keys and respect `useReducedMotion()`

**Checkpoint**: User Story 3 is usable across target widths and the loading state does not expose mock values as loaded content.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Conferir acessibilidade, ligações de navegação e validação global da entrega.

- [ ] T019 Verify keyboard focus, progress announcements, mismatch warning and blocked controls against `specs/SDB-46-learning-track/contracts/track-details-ui.md`; conduct the 20-student timed check in `specs/SDB-46-learning-track/quickstart.md` and record whether at least 19 identify the available lesson within 10 seconds
- [ ] T020 Run `npm run lint` and `npm run build` from `package.json`, then execute all manual scenarios in `specs/SDB-46-learning-track/quickstart.md` and record any unresolved auth-guard integration block in `specs/SDB-46-learning-track/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; creates the isolated preview entry.
- **Foundational (Phase 2)**: Depends on setup; blocks all user-story UI work until types, fixture and lookup state exist.
- **User Stories (Phase 3+)**: Depend on Phase 2 and proceed in listed priority order. US2 composes the `TrackDetailsPage` created in US1; US3 adds loading and responsive behavior across the completed view.
- **Polish (Phase 6)**: Depends on all selected stories. Production route release additionally depends on a real auth guard becoming available for T010.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; independently demonstrates trail and mission progress in the preview. T010 is blocked until a real route guard exists.
- **US2 (P1)**: Starts after Phase 2; integrates the roadmap into the page scaffold created by US1.
- **US3 (P2)**: Starts after Phase 2 and validates loading/responsive behavior across the page produced by US1 and US2.

### Parallel Opportunities

- **Setup/Foundation**: Complete T001 before Phase 2; T003 depends on T002, and T004 depends on T003.
- **US1**: T005, T006, T007 and T008 edit separate files and can run in parallel; T009 depends on T005–T007; T010 remains externally blocked.
- **US2**: T011 and T012 edit separate files and can run in parallel; T013 depends on both; T014 depends on the page integration in T013.
- **US3**: T015 can run independently after Phase 2; T016 depends on T015; T017 and T018 touch overlapping page/component files and should run sequentially.
- **Polish**: Complete T019 before T020 because both record results in `quickstart.md`; if T019 finds corrections, rerun T020 after fixes.

## Parallel Example: User Story 1

```text
Task: T005 Build the trail header in src/components/customer/tracks/TrackDetailsHeader.tsx
Task: T006 Build the progress card in src/components/customer/tracks/TrackProgressCard.tsx
Task: T007 Build the missions card in src/components/customer/tracks/TrackMissionsCard.tsx
Task: T008 Add dashboard anchors in src/components/customer/TracksSection.tsx and src/components/customer/MissionsSection.tsx
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Complete US1 cards and dashboard anchors.
3. Validate progress values and mission mismatch in the isolated preview.
4. Stop and validate independently before implementing modules.
5. Do not publish `/trails/:slug` until T010 can use a real authentication guard.

### Incremental Delivery

1. Setup + foundation → typed mock and preview.
2. US1 → trail/mission progress and navigation anchors.
3. US2 → roadmap and per-lesson actions.
4. US3 → skeleton, responsive behavior and motion/accessibility.
5. Polish → lint/build and full quickstart; integrate route only when guard dependency is resolved.

## Notes

- [P] tasks edit different files and have no dependency on an incomplete task.
- Story labels map directly to the three user stories in `spec.md`.
- There are no automated test tasks because no test runner is configured and TDD was not requested; manual verification is required by the quickstart.
- T010 is an explicit external blocker under Constitution Principle II; never replace the missing authentication guard with a local token check or an unprotected route.
