# Research: Padronização de Layouts

**Feature**: [spec.md](spec.md)  
**Data**: 2026-10-06

## Decisões

### 1. Shell comum para as seis páginas gerais

- **Decisão**: Usar uma composição reutilizável no domínio customer que reúna Sidebar, HeaderBar e a área principal; aceitar um breadcrumb opcional e envolver os elementos de cada página como conteúdo, sem transferir lógica para o layout.
- **Racional**: Atualmente HomeDashboardPage e CreateTrackPage compõem parte do shell em suas próprias páginas, TrackDetailsPage possui outra implementação da barra superior e `App.tsx` envolve somente algumas rotas de onboarding com `NavigationPage`. TrailGenerationLoadingPage ainda não usa a navegação lateral/superior. Um contrato único remove essas divergências sem mudar URLs, estado ou hooks.
- **Alternativas consideradas**: Manter os wrappers de rota atuais e apenas corrigir CSS (não corrige a duplicação do HeaderBar e o TrackDetailsPage); recriar shells independentes por página (mantém divergências futuras).

### 2. Largura de conteúdo alinhada ao Dashboard

- **Decisão**: Usar a área de página que ocupa o espaço disponível após a Sidebar, seguindo os gutters e o alinhamento horizontal do Dashboard. Breadcrumb e conteúdo devem se alinhar ao mesmo container; cartões e conteúdo interno podem manter suas restrições locais quando a referência exigir.
- **Racional**: O Dashboard usa `.page-shell` como área flexível e `.content-stack` sem largura máxima fixa. A tela de criação restringe `.track-create-content` a 1080px, enquanto a tela de detalhes cria composição e margens independentes. O layout compartilhado deve padronizar a largura exterior, sem forçar todos os cards a terem a mesma largura interna.
- **Alternativas consideradas**: Impor um max-width interno às seis páginas (não corresponde à área do Dashboard); retirar todas as larguras máximas dos componentes internos (poderia prejudicar legibilidade e fidelidade visual).

### 3. Layouts próprios para lição e quiz, com conteúdo e estado preservados

- **Decisão**: Reutilizar um shell de atividade sem Sidebar, de foco, com cabeçalho e rodapé adequados às telas de estudo; preservar componentes de conteúdo e seus hooks. Aplicar as composições de conteúdo de acordo com cada imagem: leitura/progresso/conteúdo na lição e progresso/pergunta/resposta/feedback/ação no quiz.
- **Racional**: `LessonFocusLayout` já serve LessonPage e LessonQuizPage e implementa o cabeçalho, sequência e rodapé de foco. `AssessmentPage` tem o conteúdo da referência de quiz, mas mantém outro shell próprio. A imagem de lição mostra breadcrumb, progresso de trilha e bloco de conteúdo; a de quiz mostra progresso, questão, ajuda, opções, retorno e feedback. Unificar o shell e adaptar o conteúdo permite compartilhar visual sem misturar regras de resposta ou persistência.
- **Alternativas consideradas**: Aplicar a barra lateral geral às atividades (contraria as referências de foco); mover o estado de quiz/lição para o layout (acopla apresentação a regras funcionais e aumenta risco para backend).

### 4. Ajuda de teclado sem atalhos de ação novos

- **Decisão**: Implementar Ctrl+K para abrir uma ajuda acessível que descreve a navegação nativa `Tab`/`Shift+Tab`, acionamento `Enter`/`Espaço` e fechamento com `Esc`. Oferecer também um controle visível para abrir a ajuda. Ignorar Ctrl+K quando o foco estiver em campo editável; enquanto a ajuda estiver aberta, Esc a fecha sem propagar para a ação de saída da lição. Não criar comandos de tecla para enviar respostas, mudar de questão ou avançar.
- **Racional**: A resposta à clarificação escolheu controles padrão e nenhum atalho direto de atividade. Browsers já oferecem foco sequencial e acionamento para controles semânticos. `LessonPage` já associa Escape à confirmação de saída, então a ajuda precisa consumir a tecla somente quando está aberta para evitar efeito colateral; campos editáveis não devem ter sua edição interceptada.
- **Alternativas consideradas**: Usar setas para selecionar ou avançar (não solicitado e pode conflitar com controles e edição); substituir o Escape de saída existente por fechamento de menu (alteraria comportamento); aceitar Ctrl+K em área de texto (pode roubar função de edição ou de navegação do navegador).

### 5. Sem alteração de dados ou contratos externos

- **Decisão**: Tratar as props dos layouts como composição visual e estados atuais como fonte de verdade; não criar entidades persistidas, endpoints, novos dados de recompensa ou regras de progresso.
- **Racional**: A especificação limita o trabalho à apresentação visual e aos controles de teclado. `useDashboard`, `useTrackDetails`, `useTrackCreation`, `useTrailOnboarding`, `useTrailGeneration`, `useLesson` e `useAssessmentFlow`, além das APIs atuais, são os responsáveis pelos dados e fluxo.
- **Alternativas consideradas**: Consolidar hooks junto ao novo shell (violaria a separação de responsabilidade e aumenta o risco de regressão de integração).

## Pesquisa do repositório e referências

- Projeto confirmado como React 19/TypeScript 6/Vite 8, com React Router 7, Tailwind CSS 4, Motion e Axios; os comandos disponíveis de qualidade são `npm run lint` e `npm run build`.
- As rotas atuais em `src/App.tsx` confirmam páginas gerais em `src/pages/customer`, a página de conclusão em `src/pages/lessons` e um wrapper de navegação existente apenas para algumas rotas.
- `src/components/customer/HeaderBar.tsx` já expõe XP, moedas e notificações como props; `Sidebar.tsx` provê navegação existente. Ambos devem ser reutilizados, sem alterar destinos ou lógica.
- `src/components/customer/lesson/LessonFocusLayout.tsx` já fornece o shell de foco para LessonPage e LessonQuizPage. `LessonPage` já intercepta Escape para pedir confirmação de saída. A composição de quiz em `AssessmentPage` corresponde à referência de quiz e atualmente não contém ajuda Ctrl+K.
- Imagens examinadas: `docs/img/Sidebrain - Tela da lição (Desktop).png` e `docs/img/Sidebrain - Quiz (Desktop).png`. A lição mostra cabeçalho de foco, breadcrumb, progresso, título, material com imagem/legenda e texto, mais rodapé com orientação de teclado. O quiz mantém cabeçalho de foco, progresso/questão/XP/tempo, enunciado e apoio visual, alternativas com feedback e barra inferior de ação. Ambas dispensam a Sidebar geral.
- Tentativas de leitura do Figma indicado pela constituição retornaram HTTP 403 na URL de design e HTTP 404 no endpoint oEmbed; não há integração MCP do Figma disponível nesta sessão. As imagens locais foram inspecionadas; confirmar o arquivo Figma com acesso autorizado continua pendente.
- Nenhum framework ou script de teste automatizado de UI foi encontrado. A validação inclui lint/build e roteiro manual.

## Pontos a confirmar na fase de implementação

- Consultar o Figma de referência usando uma sessão autorizada; não foi possível obter tokens ou detalhes adicionais via URL pública.
- Verificar no mapa de rotas e durante a implementação quais variações de tela de quiz usam `AssessmentPage` e quais usam `LessonQuizPage`; compor ambas sem alterar suas diferenças atuais de dados/interação.
