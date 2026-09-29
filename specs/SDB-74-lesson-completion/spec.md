# Feature Specification: Conclusão da Lição

**Feature Branch**: `SDB-74-lesson-completion`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "SDB-74 — exibir a tela de conclusão da Lição 3 com desempenho, recompensas, sequência de estudos, meta diária, próxima lição, navegação por teclado e estados de carregamento e erro de sincronização."

## Clarifications

### Session 2026-09-25

- Q: O que a tela deve oferecer quando não houver uma próxima lição disponível? → A: Exibir a ação de iniciar próxima lição desabilitada e informar que não há outra lição disponível, mantendo o retorno às trilhas acessível.
- Q: Quando a sincronização de XP ou recompensas falhar, o aluno deve poder tentar sincronizar novamente pela própria tela? → A: Sim. Exibir a ação “Tentar novamente” e manter as demais ações disponíveis.
- Q: A tela de conclusão deve aparecer após qualquer resultado, adaptando a mensagem e os indicadores quando o usuário acerta menos de 100%? → A: Esta tela é exibida somente quando o resultado é 100%; resultados abaixo de 100% seguem outro fluxo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender o resultado e as recompensas (Priority: P1)

Ao concluir uma lição com 100% de acerto, o usuário quer ver o resultado e as recompensas recebidas para reconhecer seu progresso e compreender o impacto da sessão em sua jornada de estudos.

**Why this priority**: O feedback de conclusão é o propósito central desta tela e confirma que o esforço do usuário foi reconhecido.

**Independent Test**: Fornecer dados de uma lição concluída com 100% de acerto e verificar que o usuário consegue identificar a lição, o desempenho, XP, sequência, conquista e progresso da meta diária; fornecer um resultado inferior e confirmar que esta tela não é apresentada.

**Acceptance Scenarios**:

1. **Given** que o usuário concluiu uma lição com 100% de acerto e seus dados estão disponíveis, **When** a tela de conclusão é apresentada, **Then** ela exibe o número da lição, o percentual de acerto, a mensagem de feedback, a sequência de estudos, o multiplicador de XP, o XP total e seu detalhamento, a comparação semanal, a conquista e a meta diária.
2. **Given** que a conclusão apresenta menos de 100% de acerto, **When** o fluxo de resultado é definido, **Then** esta tela de conclusão não é apresentada e o usuário segue o fluxo distinto destinado a resultados abaixo de 100%.
3. **Given** que os dados incluem uma conquista recém-desbloqueada, **When** o usuário consulta o card da conquista, **Then** consegue identificar seu nome, motivo e tipo e pode escolher “Ver perfil”.
4. **Given** que uma informação de recompensa não está disponível, **When** a tela é apresentada, **Then** a informação ausente é indicada sem inventar valores nem ocultar as demais informações disponíveis.

---

### User Story 2 - Continuar a jornada de estudos (Priority: P1)

Após revisar o resultado, o usuário quer iniciar a próxima lição ou retornar às suas trilhas, usando os controles visíveis ou os atalhos informados na tela.

**Why this priority**: A conclusão deve oferecer uma continuação clara, sem deixar o usuário sem saída ou interromper sua sequência de aprendizagem.

**Independent Test**: Com a tela apresentada, acionar cada opção de navegação por clique e teclado e verificar que cada uma leva ao destino definido.

**Acceptance Scenarios**:

1. **Given** que a próxima lição está disponível, **When** o usuário seleciona “Iniciar Próxima Lição” ou pressiona `Enter`, **Then** segue para a próxima lição indicada, incluindo seu título e trilha.
2. **Given** que o usuário deseja encerrar a sessão, **When** seleciona “Voltar para Minhas Trilhas”, o controle de fechar ou pressiona `Esc`, **Then** retorna ao painel de trilhas.
3. **Given** que o usuário seleciona “Ver perfil” no card da conquista, **When** a navegação é concluída, **Then** abre a área de perfil e conquistas.
4. **Given** que uma ação de navegação já está em andamento, **When** uma tecla de atalho repetida é recebida, **Then** a mesma navegação não é executada em duplicidade.
5. **Given** que não há próxima lição disponível, **When** a tela de conclusão é apresentada, **Then** a ação de iniciar próxima lição aparece desabilitada com uma indicação clara de indisponibilidade, e o retorno às trilhas continua acessível.

---

### User Story 3 - Acompanhar a preparação e problemas de sincronização (Priority: P2)

Enquanto o resultado é preparado ou as recompensas são sincronizadas, o usuário quer saber que a operação está em andamento e ser avisado se houver falha.

**Why this priority**: Estados explícitos evitam confusão, especialmente quando os dados ainda não estão prontos ou uma recompensa não pôde ser salva.

**Independent Test**: Simular carregamento, sincronização bem-sucedida e falha de sincronização; confirmar a indicação visual adequada e que os controles de saída continuam acessíveis.

**Acceptance Scenarios**:

1. **Given** que os dados do resultado ainda estão sendo carregados, **When** o usuário acessa a tela, **Then** vê placeholders de carregamento no cabeçalho e nos três cards de métricas, sem valores fictícios.
2. **Given** que a sincronização de XP ou recompensas falhou, **When** o erro é identificado, **Then** recebe um aviso visual compreensível e o restante da tela permanece utilizável.
3. **Given** que os dados foram carregados e sincronizados, **When** a tela termina de se apresentar, **Then** os conteúdos entram de modo suave e os cards de métricas aparecem em sequência.
4. **Given** que a tela está visível, **When** o usuário passa o ponteiro, foca ou pressiona os controles de navegação, **Then** cada controle oferece feedback visual suave de foco, passagem ou acionamento; ao passar o ponteiro sobre “Ver perfil”, a seta se desloca levemente.
5. **Given** que a sincronização de XP ou recompensas falhou, **When** o usuário seleciona “Tentar novamente”, **Then** uma nova tentativa é iniciada, as demais ações continuam disponíveis e o resultado da tentativa é comunicado sem indicar sucesso indevido.

### Edge Cases

- Se o resultado não puder ser carregado, não exibir pontuação ou recompensa inventada; informar que os dados estão indisponíveis e preservar a opção de retorno às trilhas.
- Se a sincronização falhar depois que os dados da conclusão estiverem disponíveis, informar que XP ou recompensas podem não ter sido salvos, sem bloquear as ações de navegação.
- Se uma nova tentativa de sincronização também falhar, manter o aviso de falha e a possibilidade de tentar novamente, sem duplicar recompensas nem bloquear as ações de navegação.
- Se o usuário não tiver uma próxima lição disponível, exibir a ação de iniciar próxima lição desabilitada e informar que não há outra lição disponível; manter acessível o retorno às trilhas.
- Se uma conquista não tiver sido desbloqueada, não apresentar uma conquista nova como se tivesse sido concedida.
- Se a meta diária estiver parcialmente concluída ou excedida, exibir o progresso correspondente sem valores ou indicadores inconsistentes.
- Em telas estreitas, os cards e ações podem se reorganizar, mas nenhum dado essencial ou controle de navegação pode ficar sobreposto, cortado ou inacessível.
- A tecla `Enter` não deve causar avanços duplicados, e `Esc` não deve disparar retornos duplicados durante uma navegação em andamento.
- As animações não devem impedir o acesso ao conteúdo ou aos controles da tela.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela MUST ser apresentada somente para conclusões com 100% de acerto e MUST identificar a lição concluída, o percentual e a mensagem de feedback correspondentes aos dados recebidos; conclusões abaixo de 100% MUST seguir um fluxo distinto, sem apresentar esta tela.
- **FR-002**: A tela MUST apresentar a sequência atual de estudos, seu estado, descrição e multiplicador de XP quando disponíveis.
- **FR-003**: A tela MUST apresentar o XP total, a composição do XP e a comparação semanal quando esses dados estiverem disponíveis.
- **FR-004**: A tela MUST apresentar a conquista concedida com título, indicação de novidade, descrição e tipo; quando não houver conquista nova, MUST NOT indicar que uma foi concedida.
- **FR-005**: A tela MUST apresentar o progresso da meta diária, seus valores atual e alvo, percentual e mensagens de status e bônus quando disponíveis.
- **FR-006**: A tela MUST apresentar o resumo da próxima lição, incluindo título, duração estimada, trilha e descrição quando houver uma próxima etapa disponível.
- **FR-007**: A tela MUST oferecer uma ação para iniciar a próxima lição quando ela estiver disponível e uma ação para retornar ao painel de trilhas. Quando não houver próxima lição, MUST exibir a ação de iniciar próxima lição desabilitada, explicar sua indisponibilidade e manter o retorno às trilhas acessível.
- **FR-008**: O controle de fechar MUST retornar ao painel de trilhas, assim como a tecla `Esc`.
- **FR-009**: A tecla `Enter` MUST executar a mesma ação da ação primária de iniciar a próxima lição.
- **FR-010**: A tela MUST oferecer uma ação para abrir o perfil ou a área de conquistas a partir da conquista exibida.
- **FR-011**: A tela MUST indicar visualmente quando os dados de conclusão estiverem carregando e preservar a estrutura do cabeçalho e dos três cards de métricas durante esse estado.
- **FR-012**: A tela MUST comunicar falha ao salvar ou sincronizar pontos e recompensas por meio de um aviso compreensível e oferecer “Tentar novamente”; durante novas tentativas, MUST manter as ações de navegação disponíveis e não apresentar a operação como bem-sucedida antes da confirmação.
- **FR-013**: Na ausência ou indisponibilidade de dados, a tela MUST diferenciar informação ausente de valor zero e MUST manter disponíveis os caminhos de saída válidos.
- **FR-014**: A apresentação MUST adaptar cabeçalho, resumo, cards, próxima etapa e ações para desktop, tablet e dispositivos móveis sem perda de conteúdo ou controles essenciais.
- **FR-015**: A tela MUST apresentar feedback visual perceptível nas entradas, interações e mudanças de estado, sem depender exclusivamente de cor para comunicar sucesso, carregamento ou erro.
- **FR-016**: A tela MUST impedir que atalhos repetidos acionem mais de uma navegação enquanto uma ação de destino estiver em andamento.
- **FR-017**: Ao ser apresentada, a tela MUST revelar suavemente o conteúdo principal; o ícone de conclusão MUST surgir com destaque, e os três cards de métricas MUST aparecer em sequência.
- **FR-018**: Os controles de navegação MUST apresentar resposta visual suave ao foco, à passagem do ponteiro e ao acionamento; o link de perfil MUST indicar sua interatividade com movimento sutil de sua seta.

### Key Entities *(include if feature involves data)*

- **Conclusão da Lição**: resultado de uma lição finalizada, associado ao identificador e número da lição, percentual de acerto e mensagens de feedback.
- **Sequência de Estudos**: continuidade do hábito do usuário, incluindo quantidade de dias, estado, descrição e multiplicador de XP.
- **Recompensa da Conclusão**: XP da sessão e detalhamento, comparação semanal, conquista concedida e progresso da meta diária.
- **Próxima Lição**: etapa seguinte da trilha, incluindo identificação, título, duração estimada, descrição e trilha associada.
- **Ação de Navegação**: escolha do usuário para iniciar a próxima lição, retornar às trilhas ou consultar o perfil/conquistas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em todos os testes com dados completos, usuários conseguem encontrar o percentual de acerto, XP, sequência, conquista e meta diária; quando houver uma próxima etapa, também conseguem identificar seus dados na tela de conclusão.
- **SC-002**: Pelo menos 95% dos usuários de teste conseguem escolher e executar um próximo passo válido em até 30 segundos após a apresentação dos dados.
- **SC-003**: Em 100% dos testes de teclado, `Enter` executa a ação de próxima lição e `Esc` executa o retorno às trilhas, sem navegação duplicada.
- **SC-004**: Em 100% dos testes com carregamento ou falha de sincronização, o estado é reconhecível, “Tentar novamente” inicia nova tentativa e as opções de saída permanecem utilizáveis.
- **SC-005**: Em todas as larguras testadas para desktop, tablet e dispositivos móveis, não há sobreposição ou perda de informações e ações essenciais.
- **SC-006**: Em 100% dos testes com dados ausentes, a tela não apresenta valores de desempenho ou recompensas inventados como se fossem reais.

## Assumptions

- O usuário está autenticado e chega à tela depois de concluir uma lição.
- Os dados de demonstração fornecidos para a Lição 3 representam o estado de exemplo para a tela; ela é elegível somente quando a conclusão real tem 100% de acerto.
- Conclusões abaixo de 100% são tratadas por um fluxo distinto, fora do escopo desta tela.
- O destino de “Iniciar Próxima Lição” corresponde à etapa seguinte informada nos dados; no exemplo, é a Lição 4: Triângulos Especiais e Aplicações Práticas, da trilha Geometria Espacial.
- “Voltar para Minhas Trilhas” e o controle de fechar conduzem ao painel de trilhas do usuário; “Ver perfil” conduz à área de perfil/conquistas.
- Os destinos de navegação fazem parte da jornada existente do produto; esta especificação define o comportamento esperado, não cria novas regras de acesso ou conteúdo.
- A tela deve seguir a referência visual “Sidebrain - Lição Concluída (Desktop)” e adaptar sua composição a telas menores sem alterar o significado das informações.
- Após uma falha de sincronização, o usuário pode iniciar nova tentativa pela ação “Tentar novamente”; a tentativa não deve bloquear a continuação ou o retorno.
