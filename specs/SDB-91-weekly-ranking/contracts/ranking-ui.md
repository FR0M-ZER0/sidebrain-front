# Contrato de UI: Ranking

## Propósito

Definir o contrato entre os dados demonstrativos, os estados de interação e a página de Ranking. Este é um contrato interno de interface; não define endpoint ou serviço externo.

## View model

```ts
type RankingMode = 'weekly' | 'global'

interface RankingCycleViewModel {
  period: 'weekly'
  division: string
  remaining: string
  closesAt: string
}

interface RankingParticipantViewModel {
  id: string
  rank: number
  name: string
  avatar?: string | null
  level: number
  activeTrack?: string | null
  streakDays?: number | null
  consistencyPercent?: number | null
  score: number
  positionChange?: number | null
  isCurrentUser: boolean
  badge?: string | null
}

interface RankingUserSummaryViewModel {
  participantId: string
  rank: number
  score: number
  scoreToPodium?: number | null
  completedLessons?: number | null
  streakDays?: number | null
}

interface RankingDatasetViewModel {
  mode: RankingMode
  contextLabel: string
  scoreLabel: string
  cycle: RankingCycleViewModel | null
  podium: RankingParticipantViewModel[]
  participants: RankingParticipantViewModel[]
  userSummary: RankingUserSummaryViewModel
  initialVisibleCount: number
}

interface RankingHeaderViewModel {
  xpCurrent: number
  xpTarget: number
  streakDays: number
  notifications: number
}

interface RankingPageViewModel {
  weekly: RankingDatasetViewModel
  global: RankingDatasetViewModel
  header: RankingHeaderViewModel
}
```

## Interações

- A página abre em `weekly` com `isExpanded=false`.
- O controle de modo seleciona um dataset integralmente; não há combinação de podium/resumo/tabela de modos diferentes.
- Selecionar `global` substitui o contexto semanal por contexto global e os dados de pódio, usuário, posição, pontuação e tabela. Busca, Sidebar e indicadores gerais do cabeçalho permanecem.
- `Ver ranking completo` torna visíveis/consultáveis os participantes restantes e atualiza a contagem. Quando não houver mais posições, a interface comunica o fim da lista.
- Retornar para `weekly` restaura ciclo, divisão, pontuações e dados semanais.
- A variação de posição é exibida em texto com sinal e indicação visual; `null` usa estado neutro.

## Requisitos de apresentação

- No modo semanal, mostrar Divisão I, ciclo semanal, tempo restante `2 dias, 14 horas e 28 minutos`, encerramento `domingo às 23:59` e XP semanal.
- O pódio semanal representa Mariana Souza (6.420 XP, Líder), Lucas Rocha (5.890 XP) e Camila Mendes (5.340 XP), incluindo nível e sequência fornecidos.
- O resumo semanal representa Alexandre M. (Você), 4º lugar, 4.850 XP, `+240 XP` fornecidos até o pódio, 14 módulos concluídos e ofensiva de 14 dias.
- O cabeçalho usa o `HeaderBar` existente para busca, XP e notificações. Como não exibe sequência, adicionar na composição do Ranking uma indicação própria de 12 dias; não mudar o componente compartilhado.
- A linha de corte visual aparece entre 5º e 6º lugares, conforme a clarificação baseada na imagem; a linha atual usa rótulo “Você” e destaque não dependente apenas de cor.
- A tabela mantém posição, estudante, trilha ativa, consistência e XP semanal; nível, sequência e evolução são apresentados sem retirar campos obrigatórios em larguras menores.
- A aparência foi calibrada pela imagem local `docs/img/Sidebrain_-_Ranking_Desktop.png`. A inspeção pixel a pixel no frame Figma foi dispensada pelo usuário para esta entrega; não se declara validação no Figma.

## Acessibilidade e estados

- Alternância de modo e expansão são controles de botão com nomes acessíveis, foco visível e estado selecionado/expandido anunciado.
- Títulos de coluna e relações entre células da tabela permanecem identificáveis para tecnologia assistiva.
- Pódio, usuário, variação e consistência combinam texto/ícone e estilo; cor isolada não transmite estado.
- Estado indisponível não apresenta XP ou posições incompletas como valores válidos.
- A rota final de usuário fica protegida pelo `PrivateRoute` já existente; não expor como rota pública.
