# Data Model: Resultado da Lição

Os dados são locais e imutáveis para a demonstração. O hook de resultado mantém apenas estado de apresentação; não há persistência ou comunicação externa.

## Resultado da sessão

| Campo | Tipo/conteúdo | Regra |
|---|---|---|
| `status` | Estado de sucesso | Na demonstração, corresponde a “Módulo Concluído com Sucesso”. |
| `message` | Texto | “Desempenho Impecável!”. |
| `scorePercent` | Número percentual | 100. |
| `correctAnswers` | Inteiro | 5. |
| `totalQuestions` | Inteiro | 5; deve ser igual ao tamanho da lista. |
| `xpEarned` | Inteiro | 80, apresentado como “+80 XP”. |
| `precision` | Número percentual | 100. |
| `elapsedTime` | Texto de duração | “2m 15s” na interface, equivalente a 2 minutos e 15 segundos. |
| `studyStreakDays` | Inteiro | 12 dias consecutivos. |
| `questions` | Lista de `QuestionReview` | Exatamente cinco registros, ordenados pelo número 1–5. |

## QuestionReview

| Campo | Tipo/conteúdo | Regra |
|---|---|---|
| `id` | Identificador textual | Único por questão no resultado. |
| `number` | Inteiro | Único na lista, 1–5. |
| `title` | Texto | Título definido na especificação. |
| `category` | Texto | Categoria definida na especificação. |
| `duration` | Texto de duração | Tempo correspondente à questão. |
| `status` | `correct` | Todas as questões da sessão demonstrativa foram acertadas. |
| `prompt` | Texto | Enunciado fictício coerente com o tema. |
| `userAnswer` | Texto | Resposta selecionada demonstrativa, com conteúdo identificável e legível. |
| `correctAnswer` | Texto | Resposta correta, coerente com enunciado e explicação. |
| `explanation` | Texto | Explicação breve que justifica a resposta correta. |

### Registros da demonstração

1. Cálculo de Margem Operacional — Finanças Corporativas — 18 segundos.
2. Interpretação do EBITDA / LAJIDA — Demonstrações Contábeis — 31 segundos.
3. Ciclo Financeiro e Capital de Giro — Gestão de Tesouraria — 25 segundos.
4. Análise DuPont: Decomposição do ROE — Estrutura de Capital — 39 segundos.
5. WACC e Custo Médio Ponderado — Valuation & Risco — 22 segundos.

## Feedback demonstrativo

| Campo | Conteúdo |
|---|---|
| `highlight` | “100% de acertos na sessão.” |
| `positivePoint` | “Boa compreensão dos conceitos avaliados.” |
| `recommendation` | “Avançar para o próximo módulo ou revisar os conceitos em alguns dias.” |

## Estado de interação local

- `expandedMap`: mapa `question.id → boolean`; controla cada item de forma independente.
- `allExpanded`: derivado; verdadeiro somente se todas as questões estiverem abertas. O comando global alterna entre expandir tudo e recolher tudo.
- `feedbackVisible`: booleano; ao ativar a ação de feedback, exibe o conteúdo de `Feedback demonstrativo` dentro da própria tela.
- `retryConfirmationVisible`: booleano; ao ativar “Refazer Quiz”, exibe confirmação demonstrativa na própria tela sem iniciar novo quiz.

## Relações e consistência

- Um `Resultado da sessão` contém exatamente cinco `QuestionReview` na demonstração.
- `correctAnswers` deve corresponder ao número de questões com status `correct` e `scorePercent` é 100% neste conjunto fixo.
- A identificação da questão é estável durante reordenação/renderização e mantém seus detalhes associados ao registro correto.
- Estados de feedback/retentativa não alteram os dados de pontuação nem os estados de expansão.
