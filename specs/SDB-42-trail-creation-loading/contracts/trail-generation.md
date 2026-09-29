# Contrato de geração da trilha

Os exemplos abaixo são relativos ao `VITE_API_URL` e devem ser chamados pela instância exportada em `src/api/api.ts`.

## Iniciar geração

`POST /trails/{trailId}/generation`

Resposta `201`:

```json
{
  "generationId": "gen-789",
  "trailId": "trail-123",
  "status": "queued",
  "progressPercent": 0,
  "estimatedSecondsRemaining": null,
  "steps": [
    { "key": "knowledge_analysis", "label": "...", "status": "pending", "summary": null },
    { "key": "curriculum_mapping", "label": "...", "status": "pending", "summary": null },
    { "key": "explanations_synthesis", "label": "...", "status": "pending", "summary": null },
    { "key": "quiz_bank", "label": "...", "status": "pending", "summary": null }
  ],
  "resultTrailId": null,
  "error": null,
  "updatedAt": "2026-09-23T12:00:00Z"
}
```

## Consultar status

`GET /trails/{trailId}/generation/{generationId}`

Resposta `200`: `TrailGenerationJob` atualizado. `completed` exige `resultTrailId` válido (destino do redirecionamento automático). `failed` traz `error` legível.

Erros: `404` = geração inexistente (tratar como sem geração e oferecer novo início); `409` = geração concorrente em andamento (retomar o polling da existente); `5xx` = manter último estado válido e oferecer nova tentativa.

## Regras de cliente

- O percentual exibido reflete o backend e nunca regride fora de retry.
- 2 minutos sem avanço de `progressPercent` ou de etapa = travamento: exibir mensagem com alternativa (FR-007/SC-006).
- Retry sempre cria nova geração (`POST`) com as mesmas escolhas; o `generationId` falho é descartado.
- `completed` sem `resultTrailId` válido = falha com mensagem (sem tela vazia).

## Contrato de UI

- Título "Construindo sua trilha...", selo "SÍNTESE COGNITIVA ATIVA" e barra "Progresso da geração" com percentual e estimativa.
- Lista das 4 etapas com estado e resumo de conclusão; cartão "Dica do Sidebrain" em rotação sem bloquear o progresso.
- Barra com `role="progressbar"` e valores ARIA; marcos anunciados em região `aria-live="polite"`.
- Foco gerenciado ao entrar na tela e após redirecionamento; layout shell (sidebar/busca/XP) preservado.
