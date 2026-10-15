# Research: Resultado da Lição

## Decisão: Estender a tela de resultado de quiz existente

- **Decision**: Evoluir a página `src/pages/customer/QuizResultPage.tsx` e seu conjunto de componentes/hook/tipos em vez de criar uma tela paralela.
- **Rationale**: A tela existente já implementa o cabeçalho centralizado, resumo com indicador circular, cards de métricas, lista expansível, ação global e ações finais com estilos próximos à referência visual. Isso reduz duplicação e mantém a organização por domínio prescrita pelo projeto.
- **Alternatives considered**: Criar novo domínio e página de conclusão; rejeitado por duplicar uma implementação que já coincide com a necessidade. Reaproveitar `LessonCompletionPage`; rejeitado porque esta página trata recompensa/sincronização da conclusão perfeita e tem fluxo de navegação diferente do resultado de quiz pedido.

## Decisão: Manter conteúdo como mock local

- **Decision**: Fornecer dados de resultado, respostas, explicações e feedback em estruturas locais sem serviço HTTP.
- **Rationale**: A especificação explicitamente autoriza dados e ações simulados e exclui integração de aprendizagem e geração real de feedback por IA.
- **Alternatives considered**: Integrar serviço de lições ou feedback; fora de escopo e sem necessidade para validar a experiência descrita.

## Decisão: Isolar a rota do layout com sidebar

- **Decision**: Renderizar a rota de resultado em modo de foco, sem o `NavigationPage` que adiciona sidebar.
- **Rationale**: FR-009 pede explicitamente uma tela sem navegação lateral e o código atual registra `/quiz-result` dentro do shell que renderiza `Sidebar`.
- **Alternatives considered**: Ocultar a sidebar apenas via CSS; rejeitado por manter navegação semântica desnecessária na tela de foco e criar dependência de apresentação implícita.

## Decisão: Reaproveitar a apresentação visual existente, sem retocar componentes compartilhados

- **Decision**: Reusar componentes específicos de resultado e aplicar eventuais diferenças visuais em componentes/estilos próprios da tela, sem alterar estilos ou comportamento de componentes gerais compartilhados.
- **Rationale**: A tela existente já contém classes específicas `quiz-result-*`; a exigência de reutilização proíbe regressões visuais em componentes compartilhados.
- **Alternatives considered**: Refatorar botões/cards globais; rejeitado por escopo e risco de alterar outras telas.

## Decisão: Não publicar contratos externos

- **Decision**: Não criar arquivos em `contracts/`.
- **Rationale**: O escopo é uma página interna sem API, payload remoto ou integração externa.
- **Alternatives considered**: Criar contrato de API para dados mockados; rejeitado porque sugeriria integração que a especificação não exige.

## Verificação de rota e estado atual do repositório

- **Finding**: `QuizResultPage` já entrega o resumo, a grade de métricas, a revisão expansível e a barra de ações; `useQuizResult` monta dados locais. A rota `/quiz-result`, porém, está envolvida por `NavigationPage`, que inclui sidebar. Já existe `LessonFocusLayout` em `src/components/customer/lesson/LessonFocusLayout.tsx`, que atende ao layout dedicado de foco com marca, botão de saída, sequência e rodapé.
- **Decision**: Reutilizar `LessonFocusLayout` sem alterá-lo, retirar o shell com sidebar somente da rota de resultado e atualizar a fatia específica de resultado (página/hook/tipos/componentes/CSS) com os dados e estados mockados da especificação. O retorno deve usar a navegação do React Router para voltar ao contexto anterior, com destino de fallback para acesso direto.
- **Finding de acesso**: Não existe `PrivateRoute` nem guard de autenticação em `src`. A rota é preexistente e será ajustada, não criada. Não introduzir um guard isolado/fictício nesta página; registrar a proteção global como lacuna de escopo transversal.
- **Validation**: A checagem de código local foi feita diretamente no repositório. Não há MCP Context7/Jira/Figma disponível nesta sessão; a imagem anexada fornece a referência visual disponível.

## Contexto de ferramentas

O MCP Context7, Jira e Figma não está configurado nesta sessão. O planejamento usa o código e a documentação versionada do repositório e a imagem anexada pelo usuário; nenhuma decisão depende de documentação atualizada de uma biblioteca.
