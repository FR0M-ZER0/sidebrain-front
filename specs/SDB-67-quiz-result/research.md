# Research: Resultado do Quiz

## Decision Summary

- Use a single client-side screen for the completed quiz result, rendered from state already available in the app flow.
- Model the screen as a summary panel + expandable question review list + continuation actions.
- Keep the UX accessible by relying on semantic buttons, expanded state, and non-color indicators, not only color.
- Treat loading/error states as first-class states so the screen remains usable even when metrics are unavailable.

## Findings

### 1. Screen structure
The existing frontend already follows a domain-based structure with `pages/customer`, `components/customer`, `hooks`, and `types`. The result screen fits naturally under that pattern and does not require a new architectural layer.

### 2. Data ownership
The feature is a UI-only result screen for a completed attempt. In the current repo, local state and domain types are already used for assessment flow and dashboard content, so a typed model in `src/types` and a custom hook for state orchestration are the lowest-risk pattern.

### 3. UX requirements
The spec requires a summary area, metric cards, an expansion control, and a global expand/collapse action. The existing project already uses `lucide-react` and accessible button patterns, so this approach aligns with current conventions and reduces rework.

### 4. Failure handling
The most important edge cases are: unavailable data, empty question list, partial metrics, and keyboard dismissal via `ESC`. These should be handled by rendering fallback text and preserving the layout rather than hiding or replacing core content.

## Decisions

### Decision: Client-side state manager for the result view
Use a dedicated hook (for example, `useAssessmentFlow`-style pattern) to hold the selected result, loading/error state, current expanded question, and action handlers.

**Rationale**: This matches the repo’s pattern of encapsulating UI state in `src/hooks` and keeps the page component lean.

**Alternatives considered**:
- Direct state inside the page component: rejected because it mixes page concerns and is harder to reuse.
- Redux-level state: rejected because the feature is screen-local and the repository does not yet use a global store for this domain.

### Decision: Expandable question cards with single-item + global controls
Each question will be a collapsible card with a dedicated expansion action, and the screen will expose a global expand/collapse action that updates all cards in sync.

**Rationale**: This satisfies the acceptance criteria and remains simple to implement with local state arrays.

**Alternatives considered**:
- Expand only one item at a time: rejected because the spec explicitly requires a global action.
- Use accordions with uncontrolled DOM state: rejected because it would be less predictable and harder to test.

### Decision: Non-color confirmation feedback
Status indicators should pair iconography and text with color, not rely on color alone.

**Rationale**: The requirement explicitly calls out accessibility and color-independent understanding.

**Alternatives considered**:
- Color-only success/failure styling: rejected because it fails accessibility requirements.

## Open Unknowns Resolved

- Result screen scope is clearly limited to one completed attempt; no multi-attempt comparison is required.
- The app remains frontend-only in this phase; no backend contract or persistence contract is required before implementation.
- Validation will be done through running the app locally and using the Vite dev server plus lint/build checks.
