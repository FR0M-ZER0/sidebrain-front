# Feature Specification: Página de Detalhes da Trilha de Aprendizado

**Feature Branch**: `SDB-46-learning-track`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "SDB-46 — exibir o roteiro e o detalhamento de uma trilha de aprendizado, com progresso, missões, módulos expansíveis, lições concluídas, disponíveis e bloqueadas, carregamento e responsividade."

**Visual Reference**: `docs/img/Sidebrain - Página da trilha (Desktop).png` (Figma: “Sidebrain - Página da trilha (Desktop)”)

## Clarifications

### Session 2026-09-27

- Q: Quando a contagem de uma missão conflitar com o percentual informado — por exemplo, “0 de 5” e “67%” — o que a página deve exibir? → A: Exibir as contagens e o percentual informado, sinalizando a divergência.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompanhar o progresso da trilha (Priority: P1)

Como aluno, quero consultar o progresso geral da trilha e das minhas missões, para entender quanto já avancei e quais objetivos ainda posso concluir.

**Why this priority**: O progresso é a orientação principal da página e permite ao aluno compreender seu estado atual na jornada.

**Independent Test**: Exibir uma trilha com totais e percentuais conhecidos e verificar que o nível, lições concluídas, progresso geral e progresso de cada missão são apresentados de forma correspondente.

**Acceptance Scenarios**:

1. **Given** que os dados da trilha estão disponíveis, **When** o aluno abre seus detalhes, **Then** consegue identificar título, nível, quantidade total de lições, lições concluídas e percentual de conclusão.
2. **Given** que a trilha possui missões com progresso, **When** o painel de missões é exibido, **Then** cada missão apresenta título, recompensa, progresso e representação proporcional ao percentual informado.
3. **Given** que o aluno seleciona “Ver todas as missões”, **When** a ação é ativada, **Then** é encaminhado à área de Missões & Badges.
4. **Given** que o aluno seleciona o breadcrumb “Trilhas Ativas”, **When** a ação é ativada, **Then** retorna à listagem de trilhas.

---

### User Story 2 - Navegar pelo roteiro e acessar lições (Priority: P1)

Como aluno, quero percorrer os módulos em ordem e reconhecer quais lições concluí, posso iniciar ou ainda estão bloqueadas, para continuar meus estudos ou revisar conteúdos anteriores.

**Why this priority**: O acesso às lições é a ação central da jornada e torna o roteiro utilizável como plano de estudo.

**Independent Test**: Carregar módulos concluídos, em andamento e bloqueados; expandir os módulos acessíveis e verificar apresentação e destino das ações para cada estado de lição.

**Acceptance Scenarios**:

1. **Given** que há um módulo concluído ou em andamento, **When** o aluno aciona seu cabeçalho ou controle de expansão, **Then** as lições aparecem ou são recolhidas sem perder o contexto do módulo.
2. **Given** que uma lição está concluída, **When** ela é exibida, **Then** mostra estado concluído, indicador de conclusão, duração, recompensa de XP e ação “Revisar”; ao ativar a ação, abre o conteúdo de revisão correspondente.
3. **Given** que uma lição está disponível, **When** ela é exibida, **Then** destaca que está disponível agora, apresenta sua descrição quando houver e oferece “Iniciar”; ao ativar a ação, abre o conteúdo ou quiz correspondente.
4. **Given** que uma lição está bloqueada, **When** ela é exibida, **Then** apresenta indicação de bloqueio e ação desabilitada, sem permitir abertura.
5. **Given** que um módulo está bloqueado, **When** o aluno o encontra no roteiro, **Then** vê seu estado bloqueado e não consegue expandi-lo nem acessar lições antes de desbloqueá-lo.

---

### User Story 3 - Reconhecer carregamento e usar a página em qualquer tela (Priority: P2)

Como aluno, quero perceber quando as informações ainda estão carregando e continuar usando a página em desktop, tablet ou celular, para não perder acesso ao roteiro durante a espera ou em telas menores.

**Why this priority**: Estados intermediários claros e adaptação a diferentes telas mantêm a experiência compreensível e acessível.

**Independent Test**: Abrir a página em estado de carregamento e em larguras de desktop, tablet e celular; verificar placeholders, conteúdo e disponibilidade das ações essenciais.

**Acceptance Scenarios**:

1. **Given** que os detalhes ainda estão sendo obtidos, **When** a página é apresentada, **Then** exibe placeholders de carregamento para o resumo/progresso, missões e roteiro sem mostrar dados como se já estivessem confirmados.
2. **Given** que os dados ficam disponíveis, **When** o carregamento termina, **Then** os placeholders são substituídos pelo conteúdo da trilha e os itens aparecem de maneira suave e sequencial.
3. **Given** que a página é aberta em desktop, tablet ou celular, **When** o aluno consulta e interage com o conteúdo, **Then** o resumo e o roteiro permanecem legíveis, sem sobreposição ou rolagem horizontal, e as ações essenciais continuam acessíveis.
4. **Given** que o aluno passa o ponteiro ou aciona um controle interativo, **When** ocorre hover, foco ou clique, **Then** o controle comunica visualmente sua interatividade sem atrasar nem impedir a ação.

### Edge Cases

- Se o percentual de progresso estiver ausente, fora do intervalo de 0% a 100% ou inconsistente com os totais, a interface deve limitar a representação visual a um valor seguro, preservar os valores textuais válidos e não exibir uma barra enganosa.
- Se uma missão tiver contagens e percentual inconsistentes (por exemplo, 0 de 5 junto a 67%), exibir ambos os valores recebidos e sinalizar claramente a divergência, sem apresentá-los como coerentes.
- Se uma trilha ou missão não tiver conteúdo opcional, como descrição ou recompensa, as demais informações e ações válidas continuam disponíveis sem substituição por valores inventados.
- Se um módulo bloqueado receber tentativa de expansão por mouse ou teclado, seu estado e conteúdo não devem mudar.
- Se não houver destino disponível para iniciar ou revisar uma lição, a página não deve simular sucesso; a ação sem destino deve ficar indisponível e o aluno deve manter acesso ao roteiro.
- Se uma trilha contiver nomes ou títulos extensos, eles devem continuar legíveis em telas estreitas sem ocultar informações ou controles essenciais.
- Se a preferência do dispositivo reduzir movimento, animações não devem impedir nem atrasar a leitura ou interação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A página MUST apresentar o título e o nível da trilha, o total de lições, as lições concluídas e o percentual geral de progresso fornecidos para a trilha.
- **FR-002**: A página MUST representar visualmente o progresso geral de forma proporcional ao percentual válido informado e apresentar também o total concluído em texto.
- **FR-003**: A página MUST apresentar as missões da trilha com título, recompensa de XP, progresso atual e total, e percentual de conclusão quando disponíveis.
- **FR-004**: A página MUST apresentar as contagens e o percentual de progresso da missão conforme recebidos; se forem inconsistentes, MUST sinalizar claramente a divergência e MUST NOT apresentá-los como coerentes.
- **FR-005**: A ação “Ver todas as missões” MUST conduzir à área de Missões & Badges, e o breadcrumb “Trilhas Ativas” MUST conduzir à listagem de trilhas.
- **FR-006**: A página MUST apresentar módulos em sequência com título, estado e quantidade de lições concluídas e total.
- **FR-007**: Módulos concluídos e em andamento MUST permitir expandir e recolher suas lições por meio do cabeçalho e de um controle claramente identificável, com indicação atualizada do estado expandido.
- **FR-008**: Módulos bloqueados MUST apresentar indicação de bloqueio e impedir expansão e acesso às lições até que estejam disponíveis.
- **FR-009**: Lições concluídas MUST apresentar indicador visual de conclusão, duração e recompensa de XP quando informadas, e oferecer a ação “Revisar”.
- **FR-010**: Lições disponíveis MUST apresentar destaque de disponibilidade, duração, recompensa de XP e descrição quando informadas, e oferecer a ação “Iniciar”.
- **FR-011**: Lições bloqueadas MUST apresentar indicador de bloqueio e ação “Bloqueada” desabilitada, sem permitir navegação para seu conteúdo.
- **FR-012**: As ações “Iniciar” e “Revisar” MUST conduzir, respectivamente, ao conteúdo/quiz da lição disponível e ao conteúdo da lição concluída selecionada, sem trocar o destino entre lições.
- **FR-013**: Durante a obtenção dos dados iniciais, a página MUST apresentar placeholders para o resumo, o painel de missões e o roteiro, substituindo-os pelo conteúdo quando este estiver disponível.
- **FR-014**: A apresentação MUST adaptar resumo, missões, módulos, lições e controles para desktop, tablet e dispositivos móveis sem sobreposição, corte de conteúdo essencial ou rolagem horizontal.
- **FR-015**: Links, botões e controles de expansão MUST fornecer feedback visual em foco, hover e acionamento; expansões, recolhimentos e entrada do conteúdo devem ocorrer de forma suave e não bloquear interação.
- **FR-016**: Estados e ações não devem ser comunicados apenas por cor; bloqueio, conclusão e disponibilidade MUST incluir texto, ícone ou outro indicador perceptível.
- **FR-017**: Valores de progresso ausentes ou inválidos MUST NOT produzir barras fora dos limites, percentuais inventados ou ocultar informações válidas de contagem.

### Key Entities *(include if feature involves data)*

- **Trilha de aprendizado**: jornada identificada por título e nível, com total de lições, conclusão e percentual de avanço.
- **Missão**: objetivo associado à trilha, com recompensa, progresso atual, total e percentual concluído.
- **Módulo**: seção ordenada da trilha, com título, estado, totais de lições e relação com suas lições.
- **Lição**: unidade de estudo de um módulo, com título, duração, recompensa, estado e, quando disponível, descrição e destino de estudo ou revisão.
- **Estado de acesso**: condição concluída, disponível/em andamento ou bloqueada que determina apresentação e ações permitidas para um módulo ou lição.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos cenários com dados válidos, os valores de total, conclusão e progresso geral exibidos correspondem aos dados apresentados para a trilha.
- **SC-002**: Em 100% dos testes com progresso válido ou inconsistente de missões, a página apresenta os valores recebidos e, quando houver divergência entre contagens e percentual, sinaliza essa inconsistência de forma clara.
- **SC-003**: Em uma avaliação moderada com 20 estudantes representativos, pelo menos 19 conseguem identificar em até 10 segundos qual é a lição disponível e como iniciá-la.
- **SC-004**: Em 100% dos testes de navegação, lições concluídas abrem a revisão correta, lições disponíveis abrem o estudo correto e itens bloqueados não iniciam navegação.
- **SC-005**: Em 100% das larguras testadas para desktop, tablet e celular, nenhuma informação ou ação essencial fica sobreposta, cortada ou inacessível e não há rolagem horizontal.
- **SC-006**: Em 100% dos testes de carregamento inicial, a página comunica que os dados estão sendo obtidos e substitui os placeholders pelos dados correspondentes quando disponíveis.
- **SC-007**: Em 100% dos testes de teclado, o aluno consegue acionar breadcrumb, controles de expansão e ações habilitadas sem acionar controles bloqueados.

## Assumptions

- O aluno está autenticado e acessa os detalhes a partir da listagem de trilhas; a rota e os destinos específicos reutilizam os fluxos de trilha, conteúdo/quiz, revisão e Missões & Badges existentes.
- Os dados fornecidos na descrição, incluindo o exemplo da trilha “Língua Japonesa”, são dados demonstrativos iniciais; a especificação não define persistência nem integração definitiva com uma fonte de dados.
- O estado “disponível” permite iniciar a lição atual; lições futuras e módulos posteriores permanecem bloqueados conforme os estados recebidos.
- Quando contagens e percentual de uma missão forem inconsistentes, ambos os valores fornecidos permanecem visíveis, acompanhados de uma indicação clara de divergência.
- A referência visual principal é a imagem local `docs/img/Sidebrain - Página da trilha (Desktop).png`; Figma e descrição da task no Jira não estavam acessíveis nesta sessão.
- Animações são feedback visual progressivo e podem ser reduzidas ou omitidas conforme a preferência de movimento do usuário.
