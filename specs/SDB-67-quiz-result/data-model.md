# Data Model: Resultado do Quiz

## Entity: QuizResultSummary

Represents the consolidated outcome of a completed quiz attempt.

| Field | Type | Required | Notes |
|---|---|---:|---|
| moduleName | string | Yes | Name of the associated module or lesson |
| attemptLabel | string | Yes | Textual label for the current attempt |
| scorePercent | number | Yes | Final correctness percentage for the session |
| correctAnswers | number | Yes | Count of correct questions |
| totalQuestions | number | Yes | Total number of questions in the quiz |
| xpEarned | number | Yes | Experience points gained |
| precision | number | Yes | Precision metric as a percentage |
| elapsedTime | string | Yes | Human-readable duration, such as `2m 15s` |
| retentionEstimate | string | Yes | Text or metric expressing estimated retention |
| currentSequence | string | Yes | Current sequence/level label for the user |
| status | 'success' \| 'partial' \| 'error' | Yes | Indicates how to render the completion state |

## Entity: MetricCard

Represents a metric block displayed in the summary row.

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | string | Yes | Stable key for the card |
| label | string | Yes | Short title, e.g. `XP ganho` |
| value | string | Yes | Shown value |
| detail | string | No | Contextual subtext, such as `Meta do módulo: 60%` |
| tone | 'neutral' \| 'success' \| 'warning' \| 'info' | No | Styling tone for the card |

## Entity: QuizQuestionReview

Represents a single question with its review data.

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | string | Yes | Unique question identifier |
| number | number | Yes | Display order in the quiz |
| title | string | Yes | Question title or short label |
| category | string | No | Topic or category label |
| duration | string | No | Runtime or time spent |
| status | 'correct' \| 'incorrect' \| 'unanswered' | Yes | Result status for the item |
| userAnswer | string | No | The answer selected by the user |
| explanation | string | No | Rationale or feedback text |
| isExpanded | boolean | No | UI expansion state |

## Entity: ContinuationAction

Represents one of the primary follow-up actions from the result screen.

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | 'back-to-track' \| 'retry' \| 'feedback' | Yes | Action identifier |
| label | string | Yes | User-facing button text |
| destination | string | Yes | Route or target path |

## Validation Rules

- `scorePercent` must be between `0` and `100` when available.
- `correctAnswers` must not exceed `totalQuestions`.
- `totalQuestions` must be greater than `0` for a valid quiz result.
- `status` for a complete result may be `success` or `partial`; an error state should suppress metric rendering.
- Each `QuizQuestionReview` must have a unique `id` and a stable `number` for display order.
- Unavailable values should render as placeholders or descriptive fallback text rather than `null` values in the view.

## State transitions

- `loading` → `success` once the result data is available.
- `loading` → `error` if the result cannot be recovered.
- `success` → `expanded` per question when the user toggles a question.
- `success` → `allCollapsed` or `allExpanded` when the global expand/collapse action is used.

## Relationships

- One `QuizResultSummary` owns many `QuizQuestionReview` items.
- One `QuizResultSummary` may have many `MetricCard` values used in the summary row.
- One `QuizResultSummary` supports three `ContinuationAction` destinations.
