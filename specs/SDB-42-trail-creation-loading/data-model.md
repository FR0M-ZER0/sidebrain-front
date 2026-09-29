# Modelo de dados: Loading da Criação da Trilha

## `TrailGenerationJob`

Estado da geração mantido pelo hook e refletido da API:

| Campo | Tipo | Regra |
|---|---|---|
| `generationId` | `string` | Identifica a geração; persistido localmente para retomada |
| `trailId` | `string` | Trilha em criação; obrigatório para API |
| `status` | `queued \| running \| completed \| failed` | `completed` exige `resultTrailId` válido |
| `progressPercent` | `number` | 0–100, monotônico (nunca regride fora de retry) |
| `estimatedSecondsRemaining` | `number \| null` | Nulo quando desconhecido; base do texto "Pronto em cerca de X..." |
| `steps` | `GenerationStep[]` | As 4 etapas fixas, na ordem da referência |
| `resultTrailId` | `string \| null` | Preenchido somente em `completed`; destino do redirecionamento |
| `error` | `string \| null` | Motivo legível da falha; nulo fora de `failed` |
| `updatedAt` | `string` | ISO-8601 da última atualização observada |

## `GenerationStep`

Etapa da síntese (chaves fixas nesta versão):

- `key: knowledge_analysis | curriculum_mapping | explanations_synthesis | quiz_bank`
- `label: string` (ex: "Análise do nível de conhecimento")
- `status: pending | running | completed`
- `summary: string | null` (ex: "Módulos 1 a 4 mapeados"; nulo até concluir)

A ordem de exibição é fixa; o cliente não presume paralelismo além do `status` recebido.

## `StudyTip`

- `id: string`
- `text: string`

Conjunto fixo local nesta versão; a rotação apenas alterna o item exibido, sem alterar o progresso.

## Transições

```text
queued/running + progresso -> running (percentual/etapas atualizados)
running + 2 min sem avanço -> failed (travamento, ver FR-007)
running + conclusão válida -> completed (redireciona para resultTrailId)
running/failed + erro -> failed (mensagem + retry)
failed + retry -> nova geração (novo generationId, escolhas preservadas)
qualquer etapa + abandonar -> generationId persistido, retomável
completed sem resultTrailId válido -> failed (conteúdo inválido, informar usuário)
```

Trocar de tela não cancela a geração; reabrir com `generationId` retoma o polling (`running`), redireciona (`completed`) ou oferece nova tentativa (`failed`/ausente).
