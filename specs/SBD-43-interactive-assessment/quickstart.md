# Quickstart: Interactive assessment flow

## Prerequisites

- Node.js 18+ and npm installed
- Repository cloned locally

## Setup

```bash
npm install
```

## Run the app

```bash
npm run dev
```

Open the local Vite URL that is printed in the terminal and navigate to the challenge flow.

## Validation scenarios

### 1. Select and submit an answer

1. Open a question card with prompt, visual aid, and answer options.
2. Select one option.
3. Confirm that the selected choice is highlighted and the submit control is enabled.
4. Submit the answer.
5. Verify that the app shows a clear success or failure state and an explanation.

### 2. Prevent invalid submission

1. Load the challenge without selecting an answer.
2. Attempt to submit.
3. Verify the interface blocks submission and communicates the required action.

### 3. Continue the learning sequence

1. Complete the first challenge.
2. Use the continue action to move to the next learning step.
3. Confirm the app preserves the challenge context and the next stage is displayed.

## Expected outcomes

- The learner can identify a single correct answer.
- The result is accessible and easy to interpret.
- Feedback explains the reasoning in a concise, educational way.
- Progress advances without losing context.

## Quality gate

Use the project-level validation commands before completion:

```bash
npm run lint
npm run build
```

These checks confirm the front-end flow still integrates cleanly with the repository conventions and compiles successfully.
