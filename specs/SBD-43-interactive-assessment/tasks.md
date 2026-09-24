# Tasks: Interactive assessment flow

**Input**: Design documents from `/specs/SBD-43-interactive-assessment/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the assessment feature structure and shared types before implementing the learning flow.

- [X] T001 Create the feature scaffold under src/pages/customer/, src/components/customer/, and src/hooks/ for the assessment UI
- [X] T002 [P] Update the app entry in src/App.tsx to mount the interactive assessment page while preserving the existing dashboard entry point
- [X] T003 [P] Add the shared assessment data contract in src/types/assessment.ts covering Challenge, AnswerOption, Feedback, EvaluationResult, and LearningProgress from the data model

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the reusable flow state and page shell that all story work depends on.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

- [X] T004 Create the page shell in src/pages/customer/AssessmentPage.tsx to host the single-question lesson flow and current progress state
- [X] T005 [P] Build the reusable assessment card in src/components/customer/AssessmentCard.tsx to render the prompt, visual aid, and answer list
- [X] T006 [P] Implement the local interaction logic in src/hooks/useAssessmentFlow.ts for selection, validation, submission, feedback, and progression state

---

## Phase 3: User Story 1 - Answer a concept question with confidence (Priority: P1) 🎯 MVP

**Goal**: Deliver the core challenge interaction where a learner can select a single answer and submit it without ambiguity.

**Independent Test**: A learner can open the activity, choose one option, and see a decisive correct or incorrect result without relying on other application features.

### Implementation for User Story 1

- [X] T007 [US1] Render the question prompt and static visual reference in src/components/customer/AssessmentCard.tsx using the lesson content from the assessment contract
- [X] T008 [US1] Add a single-choice selection model so only one answer option can be active at a time in src/components/customer/AssessmentCard.tsx
- [X] T009 [US1] Disable submission until a valid answer is selected and show the required callout when no answer exists in src/components/customer/AssessmentCard.tsx
- [X] T010 [US1] Connect option selection and submit actions to the flow state in src/pages/customer/AssessmentPage.tsx and src/hooks/useAssessmentFlow.ts
- [X] T011 [US1] Highlight the selected answer and show a clear result banner with success or failure styling in src/components/customer/AssessmentCard.tsx
- [X] T012 [US1] Ensure the flow matches the internal contract fields in src/types/assessment.ts, including prompt, options, selectedOptionId, and feedback values

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Understand immediate feedback and learning guidance (Priority: P2)

**Goal**: Provide explanatory guidance that makes the result understandable and educational, not only pass/fail.

**Independent Test**: A learner can complete one question and understand why the correct answer is valid without needing outside instructions.

### Implementation for User Story 2

- [X] T013 [US2] Add the post-submission explanation panel in src/components/customer/AssessmentCard.tsx with title and body content tied to the selected result
- [X] T014 [US2] Map evaluation results to the correct explanation fields in src/hooks/useAssessmentFlow.ts so the UI can render correct and incorrect reasoning consistently
- [X] T015 [US2] Keep the selected answer visually distinct from the final state while preserving explanation clarity in src/components/customer/AssessmentCard.tsx
- [X] T016 [US2] Ensure the feedback copy explains the concept and confirms the correct reasoning for both correct and incorrect submissions in src/components/customer/AssessmentCard.tsx
- [X] T017 [US2] Validate the immediate feedback flow against the acceptance scenarios in specs/SBD-43-interactive-assessment/quickstart.md and the contract in specs/SBD-43-interactive-assessment/contracts/assessment-flow-contract.md

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Advance through a guided learning sequence (Priority: P3)

**Goal**: Let the learner continue after each challenge and reach a completion state without losing progress context.

**Independent Test**: A learner can finish one challenge, continue to the next stage, and see a clear completion state at the end of the sequence.

### Implementation for User Story 3

- [X] T018 [US3] Add progress tracking in src/hooks/useAssessmentFlow.ts for current index, total items, completion state, and next action label
- [X] T019 [US3] Render the continue or completion action in src/components/customer/AssessmentCard.tsx after the evaluation result is shown
- [X] T020 [US3] Advance from the current challenge to the next step while preserving the learner's context in src/pages/customer/AssessmentPage.tsx
- [X] T021 [US3] Implement the final completion state and recommended next action in src/pages/customer/AssessmentPage.tsx when the lesson sequence ends
- [X] T022 [US3] Verify the end-of-sequence flow against the scenario checks in specs/SBD-43-interactive-assessment/quickstart.md and the sequence requirements in spec.md

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements across the assessment flow and repository quality validation.

- [X] T023 [P] Refine spacing, typography, and visual hierarchy in src/components/customer/AssessmentCard.tsx and src/index.css so the challenge matches the provided design cues
- [X] T024 [P] Review the assessment flow against the functional requirements FR-001 through FR-009 and fix edge cases around empty selection, answer emphasis, and progression in src/components/customer/AssessmentCard.tsx and src/pages/customer/AssessmentPage.tsx
- [X] T025 Run the project quality gate with npm run lint and npm run build to confirm the assessment flow integrates cleanly with the repository

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories
- **User Stories (Phase 3+)**: Depend on the Foundational phase and can proceed in priority order
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational; should remain independently testable
- **User Story 3 (P3)**: Can start after Foundational; should remain independently testable

### Within Each User Story

- Core interaction before explanation
- Explanation before progression state
- Completion state after all story behavior is stable

---

## Parallel Opportunities

- Setup tasks T002 and T003 can run in parallel because they affect different files
- Foundational tasks T005 and T006 can run in parallel after the page shell is defined
- User Story 1 tasks T007 through T012 can be developed in parallel when split across view, interaction, and state responsibilities
- User Story 2 tasks T013 through T017 can be parallelized across feedback rendering and state mapping
- User Story 3 tasks T018 through T022 can be parallelized across progress logic and completion flow
- Polish tasks T023 and T024 can run in parallel before the final lint/build validation

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the one-question flow independently
5. Expand to User Story 2 and User Story 3 only after the MVP works cleanly

### Incremental Delivery

1. Setup + Foundational -> stable assessment shell and state engine
2. User Story 1 -> single-question interaction with validation
3. User Story 2 -> learning explanation and feedback clarity
4. User Story 3 -> guided progression and completion state
5. Polish -> visual refinement and final repository validation

---

## Notes

- [P] tasks are different files or independent concerns without dependency conflicts
- [Story] labels map tasks to the exact user story for traceability
- Each story is independently completable and testable
- The initial implementation remains client-side and does not introduce a backend dependency
