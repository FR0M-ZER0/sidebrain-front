# UI Contracts: Padronização de Layouts

## 1. Shell das páginas gerais

**Aplicação**: HomeDashboardPage, TrackDetailsPage, CreateTrackPage, TrailStartPreferencePage, TrailLevelAssessmentPage e TrailGenerationLoadingPage.

**Composição**:

1. Navegação lateral por meio da Sidebar existente.
2. Barra superior por meio da HeaderBar existente, apresentando pesquisa, XP e sino/notificações.
3. Breadcrumb opcional quando a página já o utiliza.
4. Área de conteúdo preenchendo a mesma área externa usada pelo Dashboard, abaixo da barra superior e alinhada ao breadcrumb.

**Entradas de apresentação**:

- `children`: conteúdo atual da página, incluindo seus estados de carregamento, erro e sucesso.
- valores da HeaderBar: XP, moedas e notificações que a página já fornece.
- breadcrumb opcional: nós ou elemento de navegação existentes, sem destino novo.

**Invariantes**:

- Não buscar dados, chamar APIs, validar formulários nem decidir navegação dentro do shell.
- Manter URLs, handlers, estados, props de negócio e ações das páginas.
- Elementos de navegação e conteúdo compartilham a largura disponível do Dashboard; responsividade não oculta ações essenciais.
- Sem breadcrumb, o conteúdo ocupa o alinhamento comum sem espaço reservado vazio.

## 2. Shell das atividades de lição e quiz

**Aplicação**: telas de atividade que apresentam conteúdo de lição e quiz. O shell deve manter o modo de foco das referências e não incluir a Sidebar geral.

**Composição**:

- Cabeçalho/rodapé de atividade existentes ou atualizados conforme as imagens locais.
- Conteúdo de lição correspondente a título, breadcrumb, progresso e material didático da tela.
- Conteúdo de quiz correspondente ao progresso, pergunta, resposta/opções, feedback e ações disponíveis naquela tela.
- Ajuda de teclado invocável tanto pelo atalho Ctrl+K quanto por um controle visível.

**Invariantes**:

- Preservar fonte de dados, progressão, validação, submissão, feedback e navegação das páginas originais.
- O shell não toma decisões de negócio nem envia respostas.
- Usar estrutura responsiva sem retirar da ordem de foco controles existentes.

## 3. Contrato de navegação por teclado e ajuda

| Entrada | Comportamento esperado |
|---|---|
| `Tab` / `Shift+Tab` | Move o foco entre os controles interativos na ordem visível e lógica. |
| `Enter` / `Espaço` | Aciona o controle em foco conforme seu comportamento nativo. |
| `Ctrl+K` | Abre a ajuda quando o evento não parte de um campo editável e não altera a sessão. |
| `Esc` com ajuda aberta | Fecha a ajuda e consome o evento, sem avanço, saída ou perda de estado. |
| `Esc` com ajuda fechada | Mantém o comportamento de saída existente da página; o shell não cria uma nova ação global. |

O painel de ajuda declara claramente essas teclas e suas funções, pode receber e devolver o foco sem perdê-lo para o fundo da página e oferece um botão de fechar acessível. O texto de ajuda não promete atalhos para enviar respostas, avançar questões ou navegar etapas.

## 4. Compatibilidade visual

- Páginas gerais: referência de largura externa e alinhamento = HomeDashboardPage.
- Atividade de lição: `docs/img/Sidebrain - Tela da lição (Desktop).png`.
- Atividade de quiz: `docs/img/Sidebrain - Quiz (Desktop).png`.
- A referência Figma deve ser consultada com credenciais autorizadas; a URL pública testada respondeu HTTP 403.
