# Data Model: Padronização de Layouts

## Escopo de dados

Esta feature não adiciona nem modifica entidades persistidas. Seu foco é composição visual e navegação por teclado; dados, estado funcional e integrações existentes continuam sob responsabilidade das páginas e hooks atuais.

## Dados utilizados como entrada de apresentação

| Fonte existente | Informação usada pela interface | Regra nesta feature |
|---|---|---|
| `useDashboard` | XP, moedas, notificações e coleções do dashboard | O layout recebe os dados já disponíveis; não busca, calcula ou persiste valores. |
| `useTrackDetails` | Detalhes, módulos, lições e progresso da trilha | A página mantém a lógica e apresenta o conteúdo dentro da área padronizada. |
| `useTrackCreation` / estado da rota | Rascunho, submissão e objetivo da trilha | O layout não controla o formulário nem modifica o estado de navegação. |
| `useTrailOnboarding` / estado da rota | Preferência e respostas de avaliação | Progresso, validação e envio permanecem nas páginas atuais. |
| `useTrailGeneration` | Estado, percentual, etapas e erro da geração | Estados de carregamento, erro, tentativa e redirecionamento não mudam. |
| `useLesson` | Breadcrumbs, conteúdo, streak e progresso | O layout da atividade somente apresenta as informações atuais. |
| `useAssessmentFlow` / APIs de quiz | Questão, seleção, avaliação, resposta e feedback | A ajuda de teclado não altera respostas, progresso ou chamadas existentes. |

## Contratos de visualização

### Composição da página geral

- **Sidebar**: componente de navegação já existente, sem novas regras de destino.
- **HeaderBar**: componente já existente que recebe `xp`, `coins` e `notifications` como valores de apresentação.
- **Breadcrumb**: conteúdo opcional da navegação estrutural, preservando os destinos e a indicação da página atual de cada fluxo.
- **Conteúdo**: árvore React já controlada pela página, hook e estado originais.

### Composição da atividade

- **Shell de atividade**: cabeçalho/rodapé focados e conteúdo centrado, sem sidebar do dashboard.
- **Ajuda de teclado**: estado local exclusivamente visual `fechada | aberta`; ao abrir/fechar, não altera a sessão de atividade.
- **Foco**: ordem sequencial dos controles interativos visíveis, com destaque de foco perceptível.
- **Ativação**: controles nativos preservam `Enter`/`Espaço` segundo sua semântica; nenhum atalho direto adicional para avançar ou responder.

## Transições de estado

As transições de negócio continuam existentes. A única máquina de estados nova é a visibilidade local da ajuda:

```text
fechada -- Ctrl+K ou botão de ajuda --> aberta
aberta -- Esc ou botão de fechar --> fechada
```

Ctrl+K não deve abrir a ajuda quando o evento parte de um campo editável; Esc consumido com a ajuda aberta não aciona Escape de saída da lição. Não existe persistência para esse estado.
