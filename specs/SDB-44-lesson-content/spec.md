# Feature Specification: Página de Leitura da Lição

**Feature Branch**: `SDB-44-lesson-content`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "SDB-44 — Tela da lição: leitura de conteúdo educacional em modo de foco, com breadcrumbs, progresso, conteúdo textual e visual, saída/pausa, loading, erro e responsividade."

**Visual Reference**: `docs/img/Sidebrain - Tela da lição (Desktop).png` (também indicada como “Sidebrain - Tela da lição (Desktop)” no Figma)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ler o conteúdo da lição (Priority: P1)

Como aluno, quero abrir uma lição e consumir seu conteúdo textual e visual em uma tela de foco, para compreender o tópico sem distrações.

**Why this priority**: A leitura do conteúdo é o propósito principal da página e deve continuar utilizável independentemente dos fluxos secundários.

**Independent Test**: Abrir uma lição com título, imagem com legenda e vários parágrafos e verificar se todos os blocos são exibidos na ordem recebida, com leitura fluida em desktop, tablet e celular.

**Acceptance Scenarios**:

1. **Given** que uma lição válida foi selecionada, **When** seu conteúdo fica disponível, **Then** a página apresenta o título e todos os blocos de conteúdo na ordem definida para a lição.
2. **Given** que a lição contém imagem e legenda, **When** o aluno chega ao bloco visual, **Then** a imagem é apresentada de forma centralizada e a legenda permanece associada e legível.
3. **Given** que a lição contém texto didático, **When** o aluno percorre a página, **Then** cada parágrafo é exibido integralmente, sem sobreposição ou corte em desktop, tablet ou celular.

---

### User Story 2 - Acompanhar o contexto e o progresso (Priority: P1)

Como aluno, quero identificar a trilha, o curso, o módulo e a lição atual, além do meu progresso, para entender onde estou e quanto avancei.

**Why this priority**: Contexto e progresso reduzem a desorientação e ajudam o aluno a relacionar a leitura à jornada de aprendizagem.

**Independent Test**: Carregar uma lição com hierarquia e valores de progresso conhecidos e verificar breadcrumbs, lição atual, total de lições e percentual da trilha.

**Acceptance Scenarios**:

1. **Given** que os dados da lição incluem trilha, curso, módulo e lição, **When** a página é exibida, **Then** o breadcrumb mostra os níveis nessa ordem e identifica a lição atual.
2. **Given** que o progresso informa a lição atual, o total e o percentual concluído, **When** o indicador aparece, **Then** os rótulos mostram esses valores e o preenchimento visual representa o percentual informado.
3. **Given** que o progresso está sendo apresentado pela primeira vez ou atualizado ao trocar de lição, **When** o novo valor é exibido, **Then** a mudança do preenchimento é suave e não impede a leitura nem a interação.
4. **Given** que o aluno seleciona um nível anterior do breadcrumb, **When** esse nível é acionado, **Then** a navegação segue para o destino correspondente à trilha, ao curso ou ao módulo selecionado.

---

### User Story 3 - Sair ou pausar a leitura com segurança (Priority: P2)

Como aluno, quero sair da lição ou usar o atalho indicado na tela, para retornar ao módulo/trilha sem ficar preso na experiência de foco.

**Why this priority**: A saída acessível e previsível evita que o modo de foco se torne uma navegação sem retorno claro.

**Independent Test**: Acionar o botão de saída e a tecla `ESC` e verificar que ambos oferecem a mesma saída segura para o módulo/trilha.

**Acceptance Scenarios**:

1. **Given** que a lição está aberta, **When** o aluno seleciona “Sair da aula”, **Then** é apresentada uma confirmação de saída e, após confirmar, o aluno retorna ao módulo ou à trilha de origem.
2. **Given** que a lição está aberta, **When** o aluno pressiona `ESC`, **Then** o mesmo fluxo de confirmação de saída é apresentado.
3. **Given** que a confirmação de saída está aberta, **When** o aluno cancela, **Then** a confirmação fecha e o aluno permanece na mesma posição e lição.
4. **Given** que a página está sendo encerrada, **When** `ESC` é pressionado novamente, **Then** nenhuma navegação duplicada é iniciada.

---

### User Story 4 - Reconhecer carregamento e recuperar falhas (Priority: P2)

Como aluno, quero receber uma indicação enquanto a lição carrega e uma opção clara caso ocorra uma falha, para saber o que está acontecendo e continuar a jornada.

**Why this priority**: Estados intermediários e de erro evitam uma página vazia e permitem recuperar o acesso ao conteúdo.

**Independent Test**: Simular carregamento, falha e nova tentativa e verificar que cada estado é compreensível e que o conteúdo substitui os elementos de carregamento quando fica disponível.

**Acceptance Scenarios**:

1. **Given** que os dados da lição ainda não estão disponíveis, **When** o aluno abre a página, **Then** placeholders de carregamento representam breadcrumb, título, imagem e texto sem sugerir que o conteúdo já carregou.
2. **Given** que a recuperação dos dados falha, **When** a falha é apresentada, **Then** o aluno vê uma mensagem amigável e uma ação “Tentar novamente”.
3. **Given** que a nova tentativa é acionada, **When** a recuperação é bem-sucedida, **Then** o estado de erro é substituído pelo conteúdo correto da lição.
4. **Given** que uma imagem não pode ser exibida, **When** o restante do conteúdo foi carregado, **Then** o título, a legenda quando disponível e os parágrafos continuam acessíveis, com indicação para a mídia indisponível.

### Edge Cases

- Se o conteúdo não incluir blocos ou algum bloco estiver vazio, a página deve continuar utilizável e não exibir espaços quebrados ou texto inventado.
- Se o percentual informado estiver ausente ou fora do intervalo de 0% a 100%, a página deve apresentar um valor visual seguro e não esconder o indicador textual de lição atual.
- Se os breadcrumbs estiverem incompletos, os níveis conhecidos devem permanecer acessíveis sem links sem destino.
- Se a lição atual exceder o total informado, os dados não devem resultar em erro visual ou em uma barra maior que o total.
- O atalho `ESC` deve funcionar por teclado sem interferir na digitação em um controle que possa aparecer na tela.
- Textos extensos e legendas longas devem permanecer legíveis em telas estreitas, sem rolagem horizontal.
- Se o aluno cancelar a confirmação de saída, o progresso da leitura e a posição atual devem ser mantidos.
- O valor de sequência de dias deve ser apresentado quando disponível sem substituir o conteúdo principal nem o progresso da lição.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A página MUST apresentar o conteúdo da lição selecionada em uma experiência de leitura focada, incluindo seu título e os blocos de conteúdo disponíveis.
- **FR-002**: A página MUST renderizar blocos de imagem e parágrafo dinamicamente, respeitando a ordem recebida e apresentando legenda junto à imagem correspondente.
- **FR-003**: A página MUST mostrar o caminho hierárquico da lição — trilha, curso, módulo e lição — e permitir navegação pelos níveis anteriores que possuam destino válido.
- **FR-004**: A página MUST apresentar a posição da lição atual e o total de lições, além do percentual de conclusão da trilha fornecido para a jornada.
- **FR-005**: A representação visual do progresso MUST acompanhar o percentual válido informado e comunicar suas mudanças de forma suave, mantendo também o valor em texto.
- **FR-006**: A página MUST apresentar a sequência de dias de estudo quando esse dado estiver disponível.
- **FR-007**: O controle “Sair da aula” MUST conduzir o aluno a uma confirmação antes de retornar ao módulo ou à trilha de origem.
- **FR-008**: A tecla `ESC` MUST iniciar o mesmo fluxo de saída do controle “Sair da aula”, sem provocar navegações duplicadas.
- **FR-009**: O aluno MUST poder cancelar a confirmação de saída e continuar na mesma lição e posição de leitura.
- **FR-010**: Enquanto os dados da lição estiverem sendo carregados, a página MUST apresentar estados de carregamento para a estrutura principal, incluindo breadcrumbs, título, mídia e texto.
- **FR-011**: Quando os dados não puderem ser carregados, a página MUST apresentar uma mensagem amigável e uma ação para tentar novamente.
- **FR-012**: A ausência ou falha de uma imagem MUST preservar a disponibilidade dos demais blocos da lição e comunicar a indisponibilidade da mídia.
- **FR-013**: A página MUST adaptar conteúdo, controles, progresso e navegação para desktop, tablet e dispositivos móveis sem sobreposição, corte de texto ou perda das ações essenciais.
- **FR-014**: Mudanças de carregamento, progresso, confirmação e erro MUST ser perceptíveis sem depender exclusivamente de cor e MUST permanecer utilizáveis por teclado.
- **FR-015**: A página MUST exibir uma indicação no rodapé sobre a função da tecla `ESC` para pausar ou retornar, coerente com o fluxo de saída apresentado ao aluno.

### Key Entities *(include if feature involves data)*

- **Lição**: unidade de aprendizagem identificada por um título e associada a uma trilha, curso, módulo e posição na sequência.
- **Bloco de conteúdo**: parte ordenada de uma lição, podendo conter texto didático ou imagem com legenda.
- **Progresso da trilha**: estado de avanço do aluno, com posição atual, quantidade total de lições e percentual de conclusão.
- **Contexto de navegação**: hierarquia de trilha, curso, módulo e lição, incluindo os destinos válidos para retorno ou navegação.
- **Sequência de estudo**: quantidade de dias consecutivos de atividade, apresentada quando disponível.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos testes com conteúdo válido, título, blocos textuais e blocos visuais são exibidos na ordem informada, sem perda de conteúdo.
- **SC-002**: Em 100% dos testes com progresso válido, a lição atual, o total e o percentual exibidos correspondem aos valores fornecidos.
- **SC-003**: Pelo menos 95% dos alunos de teste conseguem identificar em até 10 segundos a trilha, o módulo e a lição em que estão.
- **SC-004**: Em 100% dos testes de teclado, `ESC` e “Sair da aula” apresentam o mesmo fluxo de saída, e o cancelamento mantém a leitura intacta.
- **SC-005**: Em 100% dos testes de carregamento e falha, o aluno recebe um estado compreensível e, em caso de falha, uma opção de nova tentativa.
- **SC-006**: A página permanece legível e operável nas larguras de desktop, tablet e celular avaliadas, sem rolagem horizontal ou perda dos controles essenciais.
- **SC-007**: Pelo menos 90% dos alunos de teste conseguem retomar a leitura após cancelar a saída sem perder o ponto em que estavam.

## Assumptions

- A descrição da task SDB-44 no Jira não pôde ser consultada porque não há MCP do Jira disponível nesta sessão; esta especificação deriva do conteúdo enviado pelo usuário e da referência `docs/img/Sidebrain - Tela da lição (Desktop).png`.
- O Figma foi indicado como “Sidebrain - Tela da lição (Desktop)”, mas seu MCP não está disponível nesta sessão; a imagem correspondente do repositório foi consultada como referência visual.
- O aluno está autenticado e chega à lição a partir de um módulo ou trilha existentes.
- A aplicação recebe os dados da lição de uma fonte existente ou provisória; origem, persistência e sincronização do progresso não fazem parte do escopo desta especificação.
- O botão de saída e a tecla `ESC` abrem confirmação para evitar saída acidental; confirmar retorna ao módulo ou à trilha de origem.
- Embora o texto do rodapé mencione “pausar ou retornar”, não foi descrito um estado funcional de pausa separado. Nesta versão, `ESC` inicia a confirmação de saída; pausa independente fica fora do escopo até que tenha comportamento definido.
- Se dados opcionais como sequência, legenda ou níveis hierárquicos estiverem ausentes, a página omite somente as informações ausentes sem inventar valores.
- A animação serve para comunicar a entrada do conteúdo e mudanças de progresso; ela não deve atrasar o acesso ao texto e pode ser reduzida quando o aluno solicitar redução de movimento.
