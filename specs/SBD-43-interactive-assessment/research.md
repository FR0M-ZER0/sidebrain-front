# Research: Interactive assessment flow

## Decision 1: keep the feature as a client-side learning interaction

**Decision:** The feature will be implemented as a self-contained front-end assessment flow using React and component-local state, without introducing a backend API or persistence layer in the first version.

**Rationale:** The spec focuses on single-question learning interactions, immediate feedback, and guided progression. This is consistent with the current front-end structure in `src/pages`, `src/components`, and `src/hooks`, and it reduces implementation risk by avoiding network dependencies before the UI behavior is validated.

**Alternatives considered:**
- Full backend-driven assessment engine: rejected because the feature is scoped to a single lesson flow and the repo currently has no persistence or server architecture defined.
- Redux-centric state management for a simple multi-step form: rejected as unnecessary overhead for a small, local interaction.

## Decision 2: treat the visual aid as a supporting static asset

**Decision:** The diagram, formula, or image will render as a supportive reference, while the learner interaction remains a multiple-choice selection with a single final submission.

**Rationale:** The spec explicitly states that visual aids are supportive and non-interactive in v1. This fits a front-end-only design where a static diagram and textual explanation can be displayed without additional interaction logic.

**Alternatives considered:**
- Interactive diagram manipulation: rejected because it expands scope beyond the current acceptance criteria and introduces new UX and testing complexity.
- Inline formula editing: rejected because the feature requirement is an answer-selection exercise, not a computation tool.

## Decision 3: use clear answer state transitions and feedback primitives

**Decision:** The interaction model will separate these states: idle, selected, submitted, correct, incorrect, and completed. The UI will emphasize the selected answer and then reveal interpretation feedback.

**Rationale:** This matches the requirement set around selecting one answer, preventing premature submission, and communicating a decisive result. It also supports progressive lesson flow without requiring global state beyond the current challenge.

**Alternatives considered:**
- Immediate answer reveal on click: rejected because the spec requires explicit submission and validation control.
- Hidden explanation until the end of the lesson: rejected because the feature values immediate learning reinforcement after each answer.

## Decision 4: validate through browser-based manual scenarios

**Decision:** The feature will be validated with focused manual steps in the browser, using the existing Vite app and lint/build checks as the quality gate for integration.

**Rationale:** There is no automated test harness defined in the repository for this feature yet, and the current project is a React front-end without dedicated E2E infrastructure. Manual validation is the lowest-risk validation path for v1 while still proving the user flow works.

**Alternatives considered:**
- Adding a new testing framework before implementation: rejected because it would broaden the scope beyond the feature itself.
- Defining backend contract tests before the UI exists: rejected because the feature does not require external services in its initial implementation.
