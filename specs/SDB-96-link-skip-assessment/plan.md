# Plano de Implementação: Linkar endpoint de começar do zero

## Alterações de Código

1. **`src/api/trackAssessmentApi.ts`**:
   - Implementar `skipTrackAssessment(subject: string)` com chamada `POST /api/v1/assessments` enviando `{ subject, objective: subject, skip: true }`.
   - Adicionar polling até o status `skipped` e retorno de `{ assessmentId, level }`.

2. **`src/pages/customer/TrailGuidedStartPage.tsx`**:
   - Conectar `skipTrackAssessment` ao ciclo de vida e botão de confirmação.
   - Adicionar layout consistente com `StudentPageLayout` e breadcrumb `Trilhas / Criar trilha / Escolher nivelamento / Começar do zero`.
   - Exibir estado de carregamento e tratamento de erro.

3. **`src/pages/customer/TrailOnboardingSummaryPage.tsx`**:
   - Adaptar mensagem de contextualização diferenciando o fluxo `step_by_step` do fluxo com diagnóstico respondido.
   - Propagar `assessmentId` no payload de geração de trilha.
