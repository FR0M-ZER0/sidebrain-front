# Modelo de dados: Configuração inicial da trilha

## `TrailStartMode`

Enumeração persistida da preferência de início:

- `ai_recommended`: diagnóstico rápido com IA e trilha personalizada.
- `step_by_step`: fundamentos essenciais e evolução gradual.

## `TrailOnboardingState`

Estado do fluxo mantido pelo hook:

| Campo | Tipo | Regra |
|---|---|---|
| `trailId` | `string` | Identifica a trilha em configuração; obrigatório para API |
| `preference` | `TrailStartMode \| null` | Nulo até uma opção ser selecionada |
| `currentStep` | `preference \| assessment \| guided_start \| completed` | Define a tela retomável |
| `assessmentStatus` | `not_started \| in_progress \| completed` | Só avança para `completed` após envio das respostas |
| `assessmentId` | `string \| null` | Referência do diagnóstico iniciado pelo backend |
| `updatedAt` | `string` | ISO-8601 retornado ou atualizado na persistência |

## `AssessmentQuestion`

Pergunta entregue pelo backend:

- `id: string`
- `prompt: string`
- `options: { id: string; label: string }[]`
- `order: number`
- `required: boolean`

Na primeira entrega, o backend retorna quatro perguntas. O cliente não deve presumir a regra de adaptação além de renderizar a ordem e as opções recebidas.

## `AssessmentAnswer`

- `questionId: string`
- `optionId: string`

Todas as perguntas obrigatórias devem possuir uma resposta antes do envio. Respostas parciais podem ser mantidas como rascunho local, mas não concluem o diagnóstico.

## Transições

```text
preference + ai_recommended -> assessment (após persistência)
preference + step_by_step   -> guided_start (após persistência)
assessment + respostas válidas -> completed (após conclusão da API)
qualquer etapa + abandonar -> estado persistido/rascunho retomável
```

Alterar a preferência atualiza apenas o modo de início e não apaga `assessmentId`, respostas já concluídas ou progresso da trilha. Se a trilha já tiver iniciado, a UI deve pedir confirmação e o backend decide quais partes podem ser reaplicadas.