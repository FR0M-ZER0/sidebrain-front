# Data Model: Conclusão da Lição

Este modelo descreve o contrato de apresentação da tela e estados da UI. Não afirma a existência de armazenamento ou endpoints persistentes.

## Entidades

### LessonCompletion

| Campo | Tipo conceitual | Regra |
|---|---|---|
| lessonId | string | Identificador não vazio da lição concluída. |
| lessonNumber | inteiro positivo | Número apresentado no cabeçalho. |
| scorePercentage | número | Faixa válida de 0 a 100; esta tela só é elegível quando o valor é exatamente 100. |
| feedbackTitle | string | Título de feedback não vazio quando fornecido. |
| feedbackDescription | string | Texto complementar; pode estar ausente sem ocultar os demais dados. |
| streak | StudyStreak | Sequência do usuário na conclusão. |
| stats | CompletionStats | XP, comparação, conquista e meta diária. |
| nextLesson | NextLesson ou ausência | Ausência indica que a ação primária fica desabilitada e explica o motivo. |

### StudyStreak

| Campo | Tipo conceitual | Regra |
|---|---|---|
| days | inteiro não negativo | Quantidade de dias consecutivos. |
| statusTag | string opcional | Estado textual além da cor. |
| description | string opcional | Contexto da sequência. |
| xpMultiplier | string/número apresentado | Multiplicador informado pelos dados; não calculado pela interface. |

### CompletionStats

| Campo | Tipo conceitual | Regra |
|---|---|---|
| totalXp | inteiro não negativo ou indisponível | Não substituir indisponibilidade por zero. |
| xpBreakdown | string opcional | Detalhamento legível do total. |
| weeklyComparison | string opcional | Comparação textual; sinal e percentual devem refletir a origem. |
| badge | AchievementBadge opcional | Só apresentar como nova/concedida quando existir confirmação nos dados. |
| dailyGoal | DailyGoal | Progresso da meta, com valores informados pela fonte. |

### AchievementBadge

| Campo | Tipo conceitual | Regra |
|---|---|---|
| id | string não vazio | Identifica a conquista no domínio. |
| title | string não vazio | Nome apresentado no card. |
| tag | string opcional | Ex.: “NOVO”, somente se aplicável. |
| description | string opcional | Motivo/critério informado. |
| type | string opcional | Ex.: badge permanente. |

### DailyGoal

| Campo | Tipo conceitual | Regra |
|---|---|---|
| currentXp | número não negativo | XP diário atual. |
| targetXp | número não negativo | Alvo diário; tratar alvo zero sem divisão inválida. |
| percentage | número de 0 a 100+ | Pode exceder 100 quando meta superada; progresso visual limita o preenchimento a 100%, preservando valor textual real. |
| statusMessage | string opcional | Mensagem do estado da meta. |
| bonusUnlockedMessage | string opcional | Só mostrar quando o bônus estiver confirmado. |

### NextLesson

| Campo | Tipo conceitual | Regra |
|---|---|---|
| id | string não vazio | Identifica a próxima etapa. |
| title | string não vazio | Título visível da etapa. |
| estimatedMinutes | inteiro positivo opcional | Duração estimada. |
| trailName | string opcional | Trilha associada. |
| description | string opcional | Contexto da próxima etapa. |

## Estado de apresentação e transições

`loading → ready → syncing → synced` ou `syncing → sync-error → retrying → synced/sync-error`.

- A tela de conclusão só é montada/apresentada para `scorePercentage === 100`; resultados menores seguem fluxo diferente.
- `loading` não contém valores de desempenho fictícios e preserva placeholders estruturais do cabeçalho e três cards.
- `ready` contém resultado válido e permite ações de saída.
- `sync-error` informa falha e habilita “Tentar novamente”; a navegação permanece disponível.
- Uma nova tentativa não pode duplicar XP/conquista. A garantia real de idempotência depende do contrato futuro de backend; a fixture local não deve fingir que substitui essa garantia.
- A ausência de `nextLesson` desabilita a ação primária e conserva a ação de retorno.
- Falha de consulta deve comunicar indisponibilidade e conservar caminho válido de saída sem mostrar recompensas como reais.

## Relações

- `LessonCompletion` agrega uma `StudyStreak` e um `CompletionStats`.
- `CompletionStats` pode referenciar zero ou uma `AchievementBadge` nova e contém uma `DailyGoal`.
- `LessonCompletion` pode referenciar zero ou uma `NextLesson`.
- `LessonCompletion` associa-se a ações de navegação (próxima etapa, trilhas, perfil), cujos destinos são fornecidos pelo contêiner da aplicação.
