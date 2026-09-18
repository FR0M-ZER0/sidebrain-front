# Data Model: Interactive assessment flow

## Overview

This feature centers on a single assessment challenge that presents a concept question, answer choices, and explanatory feedback. The data model is intentionally lightweight and stays aligned with a front-end-only implementation.

## Entities

### Challenge

| Field | Type | Description | Validation / Rules |
|---|---|---|---|
| id | string | Unique identifier for the challenge instance | Required; unique within a lesson sequence |
| prompt | string | The conceptual question shown to the learner | Required; must be readable and complete |
| visualAid | string \| null | Optional diagram, formula, or image reference | Optional; render as supporting material only |
| options | AnswerOption[] | The answer choices available for this challenge | Minimum 2; exactly one is correct |
| correctOptionId | string | The selected answer that resolves the question | Must match one of the option ids |
| feedback | Feedback | The explanation shown after submission | Required after evaluation |
| status | `idle` \| `selected` \| `submitted` \| `completed` | Current learner interaction state | Derived from the flow |

### AnswerOption

| Field | Type | Description | Validation / Rules |
|---|---|---|---|
| id | string | Unique option identifier | Required; unique within challenge |
| label | string | The visible option text | Required; concise and unambiguous |
| value | string | The semantic answer value | Required; should match the educational meaning |
| isCorrect | boolean | Whether this option resolves the challenge | Exactly one option must be true |

### EvaluationResult

| Field | Type | Description | Validation / Rules |
|---|---|---|---|
| selectedOptionId | string | The learner's chosen answer | Required when submitted |
| isCorrect | boolean | Whether the selected option matches the correct answer | Derived from comparison |
| message | string | Short summary shown to learner | Required |
| timestamp | string | Submission timestamp | Required for traceability |

### Feedback

| Field | Type | Description | Validation / Rules |
|---|---|---|---|
| title | string | Short heading for the explanation | Required |
| body | string | Explanatory reasoning tied to the concept | Required |
| isCorrect | boolean | Whether the result confirms the learner's answer | Derived from evaluation |

### LearningProgress

| Field | Type | Description | Validation / Rules |
|---|---|---|---|
| currentIndex | number | Current challenge position in the sequence | Must be >= 0 |
| totalItems | number | Number of steps in the lesson flow | Required |
| isComplete | boolean | Whether the learner reached the end | Derived from currentIndex and totalItems |
| nextActionLabel | string | Label for the next step or completion action | Required when progression is available |

## Relationships

- One `Challenge` contains many `AnswerOption` records.
- One `Challenge` has one `Feedback` explanation after evaluation.
- One `EvaluationResult` is created from a learner's selected option and maps to the relevant challenge.
- One `LearningProgress` tracks progression across the challenge sequence.

## State transitions

1. `idle` → `selected` when the learner picks one option.
2. `selected` → `submitted` when the answer is confirmed.
3. `submitted` → `completed` after result and feedback are rendered.
4. The learner may move forward from `completed` to the next challenge or to the completion state.

## Validation rules

- A learner cannot submit without a selected answer.
- Only one answer may be selected at a time.
- Exactly one answer option is the correct answer.
- Explanation feedback must appear after the submission result is shown.
- The UI must keep the selected answer visually distinct from the final result state.
