# Research: Ranking Semanal

## Decision Summary

- Modelar a tela como experiência local, tipada e sem chamadas HTTP nesta etapa.
- Manter modo semanal/global e expansão em estado de tela encapsulado por hook; fixtures ficam separadas dos componentes.
- Reutilizar `Sidebar` e `HeaderBar` mantendo aparência e navegação; remover da Sidebar somente duas condições mortas que impediam o build.
- No modo global, substituir pódio, resumo, posição/pontuação, classificação e contexto semanal por dados/contexto globais; manter busca, navegação e indicadores gerais do cabeçalho.
- Registrar a rota sob o guard de autenticação existente; usar a imagem local como referência e não alegar fidelidade pixel a pixel no Figma, cuja validação foi dispensada pelo usuário.

## Findings

### 1. Organização e navegação existentes

O frontend segue Vite/React com `src/pages/customer`, `src/components/customer`, `src/hooks` e `src/types`. `src/App.tsx` centraliza rotas e usa `NavigationPage` com `Sidebar` nas páginas que compartilham a navegação. Não há `Layout.tsx` genérico. `Sidebar` e `HeaderBar` são os componentes atuais a reutilizar.

`Sidebar` não possui item Ranking. A especificação enumera os destinos existentes e não solicita adicionar um item novo; a rota candidata `/ranking` deve ser acessada pelo destino definido para a feature, sem alterar o componente lateral compartilhado.

O repositório já contém páginas de preview locais (`track-preview.html` + `src/dev/trackPreview.tsx`, entre outras). O novo preview segue esse padrão para validação isolada; a rota `/ranking` permanece protegida por `PrivateRoute`, e o preview não substitui autenticação.

### 2. Limites dos componentes compartilhados

`Sidebar` renderiza navegação geral existente; `HeaderBar` renderiza busca somente de leitura, XP e notificações, mas não recebe nem apresenta sequência de estudo. Para satisfazer os 12 dias sem mudar o compartilhado, o Ranking precisará compor um indicador de sequência específico da tela junto à área do cabeçalho. Não alterar `Sidebar`, `HeaderBar` ou seus estilos compartilhados.

`TracksSection` usa expansão local com `useState`, `slice` e `aria-expanded`; `useQuizResult` e `useAssessmentFlow` demonstram estado efêmero/mock tipado em hooks. Não foi encontrada tabela HTML de ranking existente. A classificação nova deve usar tabela semântica e manter todas as colunas consultáveis por rolagem horizontal em telas estreitas.

### 3. Persistência e fonte de dados

O escopo especifica dados demonstrativos sem integração real. Fixtures locais estáticas são suficientes para liga semanal, ranking global e posições posteriores. O hook mantém somente a seleção de modo e se a lista completa foi expandida. Não há benefício em Axios, Redux, armazenamento persistente ou serviços para este caso.

### 4. Alternância de contexto

A clarificação define que o modo global substitui todo o conteúdo do ranking (inclusive pódio, resumo e contexto de ciclo/divisão) e conserva busca, navegação e indicadores gerais do cabeçalho. A liga semanal continua sendo o modo inicial. Os dois modos devem possuir dados próprios, sem reaproveitar silenciosamente pontuações semanais.

### 5. Evolução e limite do pódio

Variação de posição deve ser representada como valor textual e sinal visual, com estado neutro quando não houver histórico. Após inspeção da imagem, a clarificação posicionou a linha de corte visual após o 5º lugar (entre 5º e 6º). O resumo usa +240 XP como valor explicitamente fornecido, embora a diferença aritmética para o terceiro lugar da fixture semanal seja +490 XP; a clarificação decidiu manter +240 sem recalcular.

### 6. Acesso e validação

O checkout atual contém `src/components/general/PrivateRoute.tsx`, `src/hooks/useAuth.ts` e rotas privadas em `src/App.tsx`. A rota `/ranking` pode seguir esse padrão protegido. Não há framework de testes automatizados: lint, build e roteiro manual são os gates existentes.

### 7. Referência visual e ferramentas indisponíveis

A imagem `docs/img/Sidebrain_-_Ranking_Desktop.png` está presente e foi inspecionada. A referência mostra cabeçalho compartilhado, banner de ciclo, seletor semanal/global, pódio central com segundo à esquerda e terceiro à direita, resumo do usuário, tabela semanal, corte visual após o 5º lugar e expansão de 10 para 30 estudantes. O link Figma abre uma tela de login/cadastro e não permitiu inspecionar o frame; o usuário dispensou essa validação para esta entrega. Não há MCP Figma, Jira ou Context7 disponível nesta sessão. A calibração foi feita contra a imagem local, sem alegação de fidelidade pixel a pixel no Figma.

## Decisions

### Decision: Fixtures tipadas locais e interação limitada à tela

Representar dados de participante, ranking, contexto e resumo por tipos no domínio da feature; armazenar dois conjuntos mockados e dados adicionais em arquivo local. Um hook da tela controla modo e expansão.

**Rationale**: atende ao objetivo demonstrativo sem introduzir rede ou persistência desnecessárias e facilita testar se a alternância não mistura contextos.

**Alternatives considered**:
- Chamar API real: rejeitado porque está explicitamente fora do escopo.
- Embutir dados e todos os handlers no JSX da página: rejeitado por dificultar validação e separar dados de apresentação.
- Redux/localStorage: rejeitados porque estado é efêmero e não precisa sobreviver à tela.

### Decision: Reutilização dos componentes de navegação sem modificações

Compor a página com `Sidebar` e `HeaderBar` existentes. Como o cabeçalho compartilhado não expõe streak, adicionar um indicador de 12 dias específico do Ranking na composição de cabeçalho da página, sem editar o componente ou CSS compartilhado.

**Rationale**: respeita o critério de reutilizar compartilhados e não mudar sua aparência/comportamento, ao mesmo tempo que fornece o indicador pedido.

**Alternatives considered**:
- Alterar `HeaderBar` para incluir streak em todas as telas: rejeitado por alterar um compartilhado fora do escopo.
- Omitir os 12 dias: rejeitado porque o dado está nos requisitos.

### Decision: Usar estado acessível para modo, expansão e tabela

Implementar controles como botões semânticos com modo ativo identificável, estado de expansão comunicável e destaque com texto/ícone além de cor. Em viewports estreitos, manter os dados tabulares consultáveis sem cortar campos essenciais.

**Rationale**: dá suporte a teclado e leitores de tela e preserva significado do pódio, variações e controles independentemente das cores.

**Alternatives considered**:
- Usar apenas cor e ícones decorativos para estado: rejeitado por não oferecer contexto suficiente.
- Remover colunas da tabela em tela estreita: rejeitado por ocultar dados essenciais; a implementação deverá permitir consulta completa.

## Open Dependencies (not assumed away)

- Não há dependência de implementação remanescente; a comparação pixel a pixel no Figma foi dispensada pelo usuário para esta entrega.
- Context7/Jira não foram consultados porque os MCPs não estão disponíveis na sessão; não há dependência técnica de API externa nesta feature mockada.
