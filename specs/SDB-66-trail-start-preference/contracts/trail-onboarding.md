# Contrato de onboarding da trilha

Os exemplos abaixo são relativos ao `VITE_API_URL` e devem ser chamados pela instância exportada em `src/api/api.ts`.

## Obter configuração atual

`GET /trails/{trailId}/onboarding`

Resposta `200`:

```json
{
  "trailId": "trail-123",
  "preference": "ai_recommended",
  "currentStep": "assessment",
  "assessmentStatus": "in_progress",
  "assessmentId": "assessment-456",
  "updatedAt": "2026-09-22T12:00:00Z"
}
```

Ausência de configuração deve retornar `404` ou uma configuração vazia equivalente; o cliente deve tratar ambos como estado inicial sem preferência.

## Salvar preferência

`PUT /trails/{trailId}/onboarding/preference`

Request:

```json
{ "preference": "ai_recommended" }
```

Resposta `200`: `TrailOnboardingState` atualizado. Valores diferentes de `ai_recommended` e `step_by_step` devem resultar em `400`.

## Iniciar diagnóstico

`POST /trails/{trailId}/onboarding/assessment`

Resposta `201`:

```json
{
  "assessmentId": "assessment-456",
  "questions": [
    {
      "id": "q1",
      "prompt": "...",
      "options": [{ "id": "a1", "label": "..." }],
      "order": 1,
      "required": true
    }
  ]
}
```

## Concluir diagnóstico

`POST /trails/{trailId}/onboarding/assessment/{assessmentId}/complete`

Request:

```json
{
  "answers": [
    { "questionId": "q1", "optionId": "a1" }
  ]
}
```

Resposta `200`:

```json
{
  "trailId": "trail-123",
  "level": "beginner",
  "currentStep": "completed",
  "recommendedTrackId": "track-789"
}
```

Erros `400` representam respostas incompletas; `409` representa alteração concorrente; `5xx` deve manter o progresso local e oferecer nova tentativa sem duplicar a conclusão.

## Contrato de UI

- A opção selecionada deve ser perceptível por cor, borda e estado acessível, não apenas por hover.
- O botão de confirmação fica desabilitado sem seleção ou durante request.
- O foco deve seguir para a próxima etapa após navegação.
- Fechar a tela não descarta a seleção confirmada; reabrir carrega a configuração atual.