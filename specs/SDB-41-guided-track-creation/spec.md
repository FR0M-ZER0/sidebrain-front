# Feature Specification: Criação inicial de trilha guiada

**Feature Branch**: `SDB-41-guided-track-creation`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "SDB-41 — primeiro passo para criar uma Jornada Guiada personalizada: informar uma meta de estudo ou selecionar uma sugestão popular; revisar a tela apresentada no Figma ‘Sidebrain - Criar trilha (Desktop)’, validar o avanço, encaminhar ao passo seguinte e permitir retorno à listagem de trilhas, com estados responsivos e microinterações."

**Referência visual**: Imagem enviada na descrição da SDB-41; tela Figma “Sidebrain - Criar trilha (Desktop)”.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Informar o objetivo de aprendizagem (Priority: P1)

Como pessoa que deseja organizar seus estudos, quero descrever o que quero aprender para iniciar uma trilha personalizada alinhada à minha meta.

**Why this priority**: A meta é a informação essencial para personalizar a jornada e iniciar o fluxo de criação.

**Independent Test**: Abrir a criação de trilha, preencher uma meta própria e avançar; o objetivo deve ser aceito e levado ao próximo passo.

**Acceptance Scenarios**:

1. **Given** que a pessoa está no primeiro passo da criação de trilha, **When** ela digita uma meta no campo de descrição, **Then** o texto permanece visível e editável.
2. **Given** que o campo contém uma meta não vazia, **When** a pessoa seleciona “Avançar”, **Then** o sistema inicia o envio do objetivo e, quando confirmado, segue para o segundo passo da criação.
3. **Given** que o envio do objetivo falha, **When** a falha é apresentada, **Then** a pessoa recebe uma mensagem compreensível, permanece no primeiro passo e pode tentar novamente sem perder o texto.

---

### User Story 2 - Começar por uma sugestão popular (Priority: P2)

Como pessoa que ainda não sabe como formular sua meta, quero escolher uma sugestão popular para preencher rapidamente a descrição e poder personalizá-la antes de continuar.

**Why this priority**: Sugestões reduzem o esforço inicial e ajudam a pessoa a iniciar sem precisar criar uma descrição do zero.

**Independent Test**: Selecionar cada sugestão disponível e verificar se o texto correspondente é inserido no campo e pode ser editado antes de avançar.

**Acceptance Scenarios**:

1. **Given** que as sugestões populares estão visíveis, **When** a pessoa seleciona uma sugestão, **Then** o campo principal é preenchido com o texto dessa sugestão.
2. **Given** que uma sugestão foi selecionada, **When** a pessoa edita o texto preenchido, **Then** o texto editado é o objetivo considerado ao avançar.
3. **Given** que a pessoa interage com uma sugestão por mouse, teclado ou toque, **When** o foco ou a seleção ocorre, **Then** a sugestão comunica visualmente seu estado interativo sem impedir a leitura do rótulo.

---

### User Story 3 - Entender o passo e navegar pelo fluxo (Priority: P3)

Como pessoa iniciando uma trilha, quero entender em que etapa estou, voltar à listagem quando desejar e usar a tela em diferentes tamanhos de dispositivo.

**Why this priority**: Orientação e navegação previsíveis dão contexto ao fluxo e evitam que a criação pareça obrigatória ou inacessível em telas menores.

**Independent Test**: Confirmar que a tela informa “Passo 1 de 3”, que o retorno abre a listagem de trilhas e que os controles permanecem utilizáveis em celular, tablet e desktop.

**Acceptance Scenarios**:

1. **Given** que a pessoa abriu a criação de uma nova trilha, **When** a tela é exibida, **Then** ela identifica o primeiro de três passos, a configuração inicial e o propósito de descrever uma meta.
2. **Given** que a pessoa está no primeiro passo, **When** seleciona o breadcrumb “Trilhas”, **Then** retorna à listagem de trilhas.
3. **Given** que a pessoa acessa a tela em celular, tablet ou desktop, **When** visualiza e utiliza o formulário, **Then** o conteúdo se adapta ao espaço disponível sem ocultar ações ou exigir rolagem horizontal.

### Edge Cases

- Ao avançar com o campo vazio ou contendo apenas espaços, o sistema deve impedir o envio e indicar que uma meta é necessária.
- Durante o envio, ações repetidas de avanço não devem criar envios duplicados; um indicador deve comunicar que o sistema está processando.
- Se o envio falhar ou demorar além do esperado, o usuário deve receber retorno e poder tentar novamente mantendo a descrição.
- Uma meta longa deve continuar editável e não pode ocultar o botão de avanço ou comprometer a leitura em telas menores.
- Se a pessoa sair pela navegação de retorno antes de avançar, deve retornar à listagem sem iniciar o próximo passo.
- O foco do teclado deve permanecer identificável e a seleção das sugestões deve estar disponível sem depender exclusivamente de hover.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST oferecer um ponto de entrada para criação de uma nova trilha no primeiro passo do fluxo, identificado como passo 1 de 3 e configuração inicial.
- **FR-002**: O sistema MUST apresentar título, explicação do benefício da personalização, rótulo e campo editável para a descrição do objetivo de aprendizagem.
- **FR-003**: O sistema MUST apresentar cinco sugestões populares: “Japonês para Iniciantes”, “Matemática & Geometria”, “Python para Ciência de Dados”, “UI/UX Design Moderno” e “Inglês para Entrevistas”.
- **FR-004**: O sistema MUST preencher o campo de objetivo com o texto da sugestão selecionada, permitindo edição posterior.
- **FR-005**: O sistema MUST impedir o avanço quando a descrição estiver vazia ou contiver apenas espaços e informar de forma acessível como corrigir a situação.
- **FR-006**: O sistema MUST enviar a descrição válida para o fluxo de criação e avançar ao passo 2 somente após a confirmação de que o envio foi aceito.
- **FR-007**: Enquanto o envio estiver em andamento, o sistema MUST comunicar o estado de processamento e impedir envios repetidos até que haja resposta.
- **FR-008**: Se o envio falhar, o sistema MUST explicar que não foi possível continuar, manter a descrição preenchida e oferecer uma forma de tentar novamente.
- **FR-009**: O sistema MUST permitir que a pessoa retorne à listagem de trilhas pelo breadcrumb “Trilhas”.
- **FR-010**: O sistema MUST fornecer estados visuais perceptíveis para foco do campo, interação com sugestões e interação com a ação de avanço, sem depender apenas de cor ou movimento.
- **FR-011**: O sistema MUST apresentar uma entrada visual suave do conteúdo principal quando a tela é aberta, sem atrasar o uso dos controles.
- **FR-012**: O sistema MUST adaptar a tela a celulares, tablets e desktops, mantendo o conteúdo legível, os controles acessíveis e as ações disponíveis sem rolagem horizontal.
- **FR-013**: O sistema MUST permitir navegação por teclado e disponibilizar nomes e estados compreensíveis para tecnologias assistivas nos campos, sugestões, mensagens de validação, processamento e ações.

### Key Entities *(include if feature involves data)*

- **Objetivo de aprendizagem**: Descrição livre do assunto ou resultado que a pessoa pretende alcançar; pode ser digitada ou originada de uma sugestão, e é encaminhada ao fluxo de criação.
- **Sugestão popular**: Opção pré-definida identificada por um rótulo, selecionável para iniciar ou substituir o texto do objetivo.
- **Etapa de criação da trilha**: Posição atual da pessoa no fluxo de três etapas, incluindo estado de envio e destino seguinte.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% das pessoas em um teste de usabilidade conseguem descrever uma meta ou selecionar uma sugestão e identificar como avançar sem ajuda externa.
- **SC-002**: Pelo menos 95% das tentativas com uma meta válida e envio disponível chegam ao segundo passo sem necessidade de repetir a descrição.
- **SC-003**: 100% dos envios vazios ou compostos apenas por espaços são bloqueados com orientação visível e compreensível.
- **SC-004**: Pelo menos 90% das pessoas em teste conseguem localizar o retorno à listagem de trilhas e usá-lo sem abandonar acidentalmente o fluxo.
- **SC-005**: Todas as ações principais podem ser concluídas em testes nos tamanhos de tela celular, tablet e desktop sem rolagem horizontal ou controles encobertos.
- **SC-006**: Em testes de teclado e leitor de tela, as pessoas conseguem identificar o campo, selecionar uma sugestão, compreender erros e estados de envio e acionar a navegação.

## Assumptions

- A tela atende pessoas autenticadas que iniciam uma nova Jornada Guiada, seja pela navegação principal de trilhas, seja pela rota de criação.
- O escopo termina no encaminhamento aceito para o passo 2 de 3; telas e regras dos passos seguintes e a geração demorada da trilha não fazem parte desta especificação.
- A confirmação de envio depende do serviço de criação disponível; se ele estiver indisponível ou retornar falha, o fluxo permanece nesta etapa e preserva o objetivo.
- As cinco sugestões descritas são o conjunto inicial de sugestões populares e podem preencher o campo, mas não limitam a pessoa a esses assuntos.
- A listagem de trilhas é o destino do breadcrumb; não se presume aqui um caminho específico para sua rota.
- O visual da tela segue a referência fornecida e o padrão de navegação da plataforma, com comportamento responsivo e acessível.
