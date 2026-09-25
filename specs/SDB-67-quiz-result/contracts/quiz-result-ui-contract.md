# Quiz Result UI Contract

## Purpose
This contract defines the shape of the result data expected by the quiz-result screen so the UI can render the outcome consistently without depending on a backend implementation at this stage.

## Data shape

```ts
interface QuizResultViewModel {
  moduleName: string
  attemptLabel: string
  scorePercent: number
  correctAnswers: number
  totalQuestions: number
  xpEarned: number
  precision: number
  elapsedTime: string
  retentionEstimate: string
  currentSequence: string
  status: 'success' | 'partial' | 'error'
  metrics: Array<{
    id: string
    label: string
    value: string
    detail?: string
    tone?: 'neutral' | 'success' | 'warning' | 'info'
  }>
  questions: Array<{
    id: string
    number: number
    title: string
    category?: string
    duration?: string
    status: 'correct' | 'incorrect' | 'unanswered'
    userAnswer?: string
    explanation?: string
    isExpanded?: boolean
  }>
  actions: Array<{
    id: 'back-to-track' | 'retry' | 'feedback'
    label: string
    destination: string
  }>
}
```

## Rules

- `status` determines whether the success state is shown or whether the error fallback view should render.
- `correctAnswers` must be less than or equal to `totalQuestions`.
- `questions` may be empty, but the screen must still show the summary and a clear empty-state message.
- Missing values should be converted to readable placeholder text rather than breaking layout.
- The UI should preserve keyboard and assistive-technology accessibility, including clear labels and non-color status cues.
