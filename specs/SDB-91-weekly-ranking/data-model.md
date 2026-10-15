# Data Model: Ranking Semanal

## Entity: RankingDataset

Representa um conjunto ordenado de classificação para um modo de ranking.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---:|---|
| mode | `'weekly' \| 'global'` | Sim | Identifica a Liga Semanal ou o Ranking Global. |
| contextLabel | `string` | Sim | Nome/contexto apresentado para o modo atual. |
| scoreLabel | `string` | Sim | Rótulo da pontuação no modo, como XP semanal ou XP global. |
| cycle | `RankingCycle \| null` | Sim | Preenchido no modo semanal; nulo no global. |
| division | `string \| null` | Sim | Divisão da liga semanal; nula no global. |
| podium | `RankingParticipant[]` | Sim | Os três primeiros do conjunto corrente. |
| participants | `RankingParticipant[]` | Sim | Classificação ordenada, inclusive posições adicionais. |
| userSummary | `RankingUserSummary` | Sim | Resumo do usuário para o conjunto corrente. |
| initialVisibleCount | `number` | Sim | Quantidade inicial de linhas consultáveis antes da expansão. |

## Entity: RankingCycle

Representa o período da Liga Semanal.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---:|---|
| period | `'weekly'` | Sim | Nesta etapa o ciclo da liga é semanal. |
| remaining | `string` | Sim | Exibição fornecida: 2 dias, 14 horas e 28 minutos. |
| closesAt | `string` | Sim | Exibição fornecida: domingo às 23:59. |

## Entity: RankingParticipant

Representa um estudante e sua posição em um conjunto específico.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---:|---|
| id | `string` | Sim | Identificador estável único dentro do conjunto. |
| rank | `number` | Sim | Posição ordinal positiva no modo. |
| name | `string` | Sim | Nome de exibição. |
| avatar | `string \| null` | Não | Referência visual ou fallback demonstrativo. |
| level | `number` | Sim | Nível do estudante. |
| activeTrack | `string \| null` | Não | Trilha ativa; dados do pódio inicial não especificam todas as trilhas. |
| streakDays | `number \| null` | Não | Dias seguidos de estudo, se fornecidos para a linha. |
| consistencyPercent | `number \| null` | Não | Percentual de consistência, quando disponível. |
| score | `number` | Sim | Pontuação do modo selecionado; XP semanal na liga. |
| positionChange | `number \| null` | Não | Delta de posição; nulo representa ausência de histórico/variação. |
| isCurrentUser | `boolean` | Sim | Marca a linha de Alexandre M. no conjunto semanal ou global. |
| badge | `string \| null` | Não | Identificação especial, como “Líder” para a primeira colocada semanal. |

## Entity: RankingUserSummary

Resumo do próprio usuário no modo selecionado.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---:|---|
| participantId | `string` | Sim | Referência ao participante atual no conjunto. |
| rank | `number` | Sim | Posição no modo atual. |
| score | `number` | Sim | XP/pontuação no modo atual. |
| scoreToPodium | `number \| null` | Não | No modo semanal usar o valor fornecido `240`; não recalcular da diferença corrente. |
| completedLessons | `number \| null` | Não | Resumo semanal fornecido: 14 módulos/lessons concluídos. |
| streakDays | `number \| null` | Não | Ofensiva do ranking fornecida: 14 dias. |

## Entity: HeaderIndicators

Indicadores apresentados no cabeçalho reutilizado e na extensão visual própria da tela.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---:|---|
| xpCurrent | `number` | Sim | 320. |
| xpTarget | `number` | Sim | 500. |
| streakDays | `number` | Sim | 12 dias; independente da ofensiva de 14 dias no resumo do Ranking. |
| notifications | `number` | Sim | Quantidade demonstrativa positiva para acionar o indicador existente de notificação pendente. |

## Entity: RankingViewState

Estado efêmero das interações locais da tela.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---:|---|
| selectedMode | `'weekly' \| 'global'` | Sim | Inicialmente `weekly`. |
| isExpanded | `boolean` | Sim | Inicialmente falso; controla consulta das posições adicionais. |

## Validation Rules

- `rank`, `level`, `score`, contagens de dias e módulos devem ser números inteiros não negativos; `rank` deve ser maior que zero.
- `consistencyPercent`, quando disponível, deve estar entre 0 e 100.
- `notifications` deve ser um inteiro não negativo; o estado padrão de demonstração é positivo para exibir o indicador pendente.
- `id` deve ser único em cada `RankingDataset`; posições devem ser únicas e ordenadas sem duplicidade.
- Cada conjunto deve identificar no máximo um participante como usuário atual.
- `podium` contém as posições 1, 2 e 3 do mesmo conjunto de participantes.
- A liga semanal requer ciclo e divisão; o conjunto global não apresenta ciclo/divisão semanais.
- O valor `scoreToPodium=240` da fixture semanal é fornecido explicitamente e não é calculado a partir das pontuações dos participantes.
- Se histórico não estiver disponível, `positionChange` é nulo e a interface apresenta estado neutro, não um valor inventado.
- A lista completa preserva os mesmos participantes do estado inicial e acrescenta somente as posições restantes do mesmo modo.
- A sequência de cabeçalho (12 dias) e a ofensiva no resumo semanal (14 dias) são fontes/campos distintos e não podem ser mescladas.

## State Transitions

- `weekly` → `global`: seleciona conjunto global, remove contexto de ciclo/divisão e atualiza pódio, resumo, posição/pontuação e tabela; cabeçalho geral e navegação permanecem estáveis.
- `global` → `weekly`: restaura o conjunto semanal, ciclo semanal e Divisão I.
- `isExpanded=false` → `true`: torna consultáveis posições adicionais do modo atual e atualiza a quantidade exibida.
- Lista completa sem posições adicionais: mantém conteúdo e informa fim da lista, sem sugerir expansão indisponível.
- Conjunto de modo indisponível: apresenta estado indisponível sem valores parciais inventados.

## Relationships

- Um `RankingDataset` contém um `RankingCycle` opcional, um pódio de três `RankingParticipant`, uma classificação de participantes e um `RankingUserSummary`.
- `RankingUserSummary.participantId` referencia o `RankingParticipant` sinalizado como usuário atual.
- `RankingViewState.selectedMode` seleciona exatamente um `RankingDataset` disponível.
- `HeaderIndicators` é transversal ao modo: permanece inalterado ao alternar entre semanal e global.
