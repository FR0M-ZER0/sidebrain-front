# Internal UI Contract: Assessment Flow

## Purpose

This document describes the interactions and data contract for the interactive assessment flow in the front-end application. It is intentionally lightweight because the current feature is client-side and does not depend on an external service contract in v1.

## Resource: AssessmentCard

```json
{
  "id": "challenge-001",
  "prompt": "Em um triângulo retângulo com catetos medindo 6 cm e 8 cm, qual é o valor exato da hipotenusa?",
  "visualAid": {
    "type": "svg",
    "src": "assets/triangle-diagram.svg"
  },
  "options": [
    { "id": "A", "label": "10 cm", "value": "10", "isCorrect": true },
    { "id": "B", "label": "12 cm", "value": "12", "isCorrect": false },
    { "id": "C", "label": "14 cm", "value": "14", "isCorrect": false },
    { "id": "D", "label": "48 cm", "value": "48", "isCorrect": false }
  ],
  "feedback": {
    "title": "Explicação da resposta",
    "body": "Aplicando o Teorema de Pitágoras...",
    "isCorrect": true
  },
  "status": "completed"
}
```

## Client behaviors

- The UI must allow exactly one option selection at a time.
- Submission must be blocked until a valid answer exists.
- The selected option must remain distinguishable from the final result status.
- Feedback must be rendered immediately after evaluation.
- The learner must be able to continue to the next challenge or final completion view.

## Validation expectations

- Response state is derived from local UI state and should not require a network call.
- The contract is versioned by feature scope, not by external API versioning.
- Any future backend integration must preserve the same semantic fields: `prompt`, `options`, `correctOptionId`, and `feedback`.
