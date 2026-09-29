# Quickstart: Resultado do Quiz

## Prerequisites

- Node.js 18+ installed
- npm or another compatible package manager
- Local repo checkout

## Setup

```bash
npm install
```

## Run the app

```bash
npm run dev
```

Then open the app in the browser and navigate to the completed quiz result route or trigger the result state from the existing quiz flow.

## Validations

### 1. Result summary render
- Complete a quiz or load the result screen.
- Confirm the page includes the summary heading, correct answer count, total questions, and score percentage.
- Verify the score matches the real result and is not forced to 100% when the user missed questions.

### 2. Metric rendering
- Confirm the metric cards render values for XP, precision, time, and retention estimate when available.
- Confirm partial or missing values are surfaced in a readable fallback state instead of disappearing.

### 3. Question review behavior
- Expand a single item and verify only that item changes state.
- Use the global expand/collapse action and verify all cards update together.
- Confirm each question displays its status, category, timing, and explanation when available.

### 4. Action flow
- Verify the actions for "Voltar para a Trilha", "Refazer Quiz", and "Ver Feedback Detalhado da IA" are present and lead to the correct destinations.
- Press `ESC` and confirm it triggers the same route action as the close button.

### 5. Validation gates

```bash
npm run lint
npm run build
```

Expected outcome: lint passes without new errors and the production build completes successfully.
