# Feature Specification: Padronização de Layouts

**Feature Branch**: `SDB-78-refatorar-layouts`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "SDB-78: refatorar front para remover código repetido. Criar layouts visuais padronizados para HomeDashboardPage, TrackDetailsPage, CreateTrackPage, TrailStartPreferencePage, TrailLevelAssessmentPage e TrailGenerationLoadingPage, incluindo barra lateral, barra superior com pesquisa, XP e sino, breadcrumb opcional e largura de conteúdo consistente com o Dashboard. Criar layouts próprios para páginas de lição e quiz com base nas imagens de referência, preservando a lógica e a integração com backend. Nas páginas de lição e quiz, adicionar navegação por teclado e um menu Ctrl+K que explique as teclas disponíveis."

## Clarifications

### Session 2026-10-06

- Q: Além de abrir a ajuda com Ctrl+K, que comportamento de teclado você quer nas páginas de lição e quiz? → A: Usar Tab e Shift+Tab para percorrer os controles, Enter e Espaço para acioná-los, e Esc para fechar a ajuda. Não criar atalhos adicionais para avançar ou responder.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar pelas páginas principais com estrutura consistente (Priority: P1)

Como usuário, quero que o Dashboard, os detalhes e a criação de trilhas e as etapas de preferência, avaliação e geração de trilha compartilhem uma estrutura visual coerente, para navegar sem mudanças inesperadas de largura ou de elementos globais.

**Why this priority**: Essas páginas formam a jornada de acesso e criação de trilhas; a consistência visual entre elas reduz rupturas e torna os controles globais previsíveis.

**Independent Test**: Abrir cada uma das seis páginas em larguras equivalentes e verificar a presença e o alinhamento dos elementos globais, a largura comum da área de conteúdo e o funcionamento dos controles e fluxos existentes.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa qualquer uma das seis páginas principais, **When** a página é apresentada, **Then** vê a barra lateral e a barra superior com pesquisa, XP e sino, organizadas na mesma estrutura visual.
2. **Given** que o usuário alterna entre as seis páginas, **When** compara a área principal, **Then** todas seguem a mesma largura visual do Dashboard, inclusive as etapas de trilha que antes tinham largura diferente.
3. **Given** que uma página possui breadcrumb, **When** ela é apresentada, **Then** o breadcrumb aparece alinhado à estrutura comum; páginas sem breadcrumb continuam completas e alinhadas sem reservar um breadcrumb obrigatório.
4. **Given** que o usuário interage com controles existentes da página, **When** executa as ações disponíveis, **Then** os fluxos e resultados existentes continuam funcionando como antes da padronização visual.

---

### User Story 2 - Usar lições e quizzes em layouts próprios (Priority: P1)

Como usuário, quero que lições e quizzes tenham uma apresentação própria, adequada à atividade de aprendizagem e consistente com suas referências visuais, para manter o foco no conteúdo sem perder a identidade visual do produto.

**Why this priority**: Lição e quiz são experiências centrais de estudo e devem ser visualmente distintas das páginas de trilhas, mas coerentes entre si e com o produto.

**Independent Test**: Abrir uma lição e um quiz e comparar sua apresentação com as imagens de referência correspondentes, verificando conteúdo, controles, adaptação de tela e preservação do comportamento existente.

**Acceptance Scenarios**:

1. **Given** que o usuário abre uma lição, **When** a tela é apresentada em desktop, **Then** a organização visual segue a referência `docs/img/Sidebrain - Tela da lição (Desktop).png`.
2. **Given** que o usuário abre um quiz, **When** a tela é apresentada em desktop, **Then** a organização visual segue a referência `docs/img/Sidebrain - Quiz (Desktop).png`.
3. **Given** que o usuário responde, avança, retorna ou conclui uma lição ou quiz, **When** usa os controles e fluxos existentes, **Then** os dados, as regras de conteúdo e as interações com backend permanecem inalterados.
4. **Given** que o usuário acessa lição ou quiz em uma tela estreita, **When** o conteúdo se reorganiza, **Then** informações e controles essenciais permanecem visíveis e utilizáveis.

---

### User Story 3 - Consultar e usar atalhos de teclado em lições e quizzes (Priority: P2)

Como usuário, quero navegar pelas ações de lição e quiz usando teclado e consultar rapidamente os atalhos disponíveis, para realizar as ações sem depender exclusivamente do mouse.

**Why this priority**: A navegação por teclado melhora a acessibilidade e a eficiência durante as atividades, enquanto a ajuda integrada torna os atalhos descobríveis.

**Independent Test**: Em uma lição e em um quiz, abrir a ajuda por Ctrl+K, conferir que Tab/Shift+Tab percorrem os controles, Enter/Espaço os acionam e Esc fecha a ajuda, além de verificar que a digitação de respostas não é capturada.

**Acceptance Scenarios**:

1. **Given** que o usuário está em uma lição ou quiz, **When** pressiona Ctrl+K, **Then** abre um menu de ajuda que explica que Tab e Shift+Tab percorrem os controles, Enter e Espaço acionam o controle em foco e Esc fecha a ajuda.
2. **Given** que o usuário está usando uma lição ou quiz, **When** percorre os controles com Tab ou Shift+Tab e aciona um controle com Enter ou Espaço, **Then** a navegação e a ação correspondem ao foco visível e ao comportamento funcional daquele controle.
3. **Given** que o menu de ajuda está aberto, **When** o usuário pressiona Esc, **Then** retorna ao conteúdo mantendo o estado atual da atividade.
4. **Given** que o foco está em um campo de resposta ou controle de texto, **When** o usuário digita conteúdo, **Then** a digitação não é interrompida nem convertida em navegação acidental.
5. **Given** que o usuário pressiona teclas que não correspondem à interação padrão do controle em foco, **When** está em uma lição ou quiz, **Then** não é acionada navegação direta adicional para avançar ou responder.

### Edge Cases

- Uma página principal sem breadcrumb mantém o alinhamento e a mesma largura de conteúdo das páginas que o exibem.
- Conteúdo longo ou controles numerosos não podem ultrapassar ou reduzir a área comum de conteúdo de forma inconsistente entre as seis páginas principais.
- A abertura e o fechamento do menu de atalhos não devem apagar respostas, alterar progresso nem disparar uma ação da atividade.
- A navegação padrão do teclado não deve interromper a digitação em campos de resposta, pesquisa ou outros controles de texto; não devem ser criados atalhos diretos para avançar ou responder.
- Em telas pequenas, o menu de atalhos deve continuar legível e fechável sem ocultar permanentemente os controles essenciais da lição ou quiz.
- Estados de carregamento, erro e indisponibilidade já existentes devem continuar sendo apresentados sem alteração de seu significado ou comportamento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: As páginas HomeDashboardPage, TrackDetailsPage, CreateTrackPage, TrailStartPreferencePage, TrailLevelAssessmentPage e TrailGenerationLoadingPage MUST apresentar uma estrutura visual padronizada com barra lateral e barra superior contendo pesquisa, XP e sino.
- **FR-002**: As seis páginas MUST apresentar a área principal com a mesma largura visual usada pelo Dashboard, incluindo as páginas de etapas de trilha.
- **FR-003**: A estrutura padronizada MUST permitir que o breadcrumb seja apresentado somente nas páginas em que ele faz parte da navegação, sem exigir sua presença nas demais.
- **FR-004**: As páginas de lição MUST compartilhar uma apresentação própria para a atividade e seguir a referência visual `docs/img/Sidebrain - Tela da lição (Desktop).png`.
- **FR-005**: As páginas de quiz MUST compartilhar uma apresentação própria para a atividade e seguir a referência visual `docs/img/Sidebrain - Quiz (Desktop).png`.
- **FR-006**: As mudanças MUST limitar-se à apresentação visual e aos controles de navegação por teclado descritos nesta especificação; regras de negócio, dados, estados, persistência e integrações com backend existentes MUST manter seu comportamento.
- **FR-007**: Nas páginas de lição e quiz, Ctrl+K MUST abrir um menu acessível que explique que Tab e Shift+Tab percorrem controles, Enter e Espaço acionam o controle em foco e Esc fecha o menu.
- **FR-008**: A navegação por Tab/Shift+Tab e o acionamento por Enter/Espaço MUST respeitar o foco visível, o comportamento do controle e o estado atual da atividade, sem executar ações duplicadas.
- **FR-009**: A navegação por teclado MUST preservar a digitação e a interação com campos de texto e respostas, sem capturar teclas destinadas à edição do conteúdo.
- **FR-010**: O menu de ajuda MUST abrir por Ctrl+K e fechar por Esc sem modificar respostas, progresso ou estado atual da lição ou quiz; não MUST haver atalhos diretos adicionais para avançar ou responder.
- **FR-011**: Os layouts MUST adaptar-se a desktop, tablet e dispositivos móveis sem ocultar conteúdo ou controles essenciais, nem introduzir rolagem horizontal indevida.
- **FR-012**: Todos os estados e controles existentes das páginas cobertas MUST continuar acessíveis e comunicar os mesmos resultados após a padronização.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das seis páginas principais verificadas, a barra lateral, a barra superior com pesquisa, XP e sino e a largura comum da área principal estão presentes e visualmente alinhadas com o Dashboard.
- **SC-002**: Em 100% das páginas verificadas que usam breadcrumb, o breadcrumb está alinhado à estrutura padrão; páginas sem breadcrumb não apresentam lacuna que desalinhe o conteúdo.
- **SC-003**: Em 100% das verificações visuais das telas de lição e quiz em desktop, a composição corresponde à referência específica da respectiva atividade.
- **SC-004**: Em 100% dos cenários de teclado testados, Ctrl+K abre uma ajuda que documenta Tab/Shift+Tab, Enter/Espaço e Esc; esses comandos executam somente as ações descritas e nenhuma tecla de texto causa navegação acidental.
- **SC-005**: Em 100% dos fluxos existentes percorridos nas páginas cobertas, os dados e resultados funcionais permanecem consistentes com o comportamento anterior, incluindo operações que dependem do backend.
- **SC-006**: Nas larguras de desktop, tablet e dispositivos móveis avaliadas, nenhum conteúdo ou controle essencial fica cortado, sobreposto ou inacessível.

## Assumptions

- As páginas nomeadas representam o escopo completo das páginas gerais a serem padronizadas nesta entrega; outras páginas não são incluídas implicitamente.
- Todas as páginas de lição e quiz existentes devem receber seus respectivos layouts de atividade, não apenas uma página específica de cada tipo.
- A identidade visual e os detalhes de apresentação das páginas de lição e quiz devem ser determinados pelas imagens de referência informadas; outros estados seguem a identidade visual correspondente sem alterar seu conteúdo funcional.
- A navegação de lição e quiz usa foco por Tab/Shift+Tab e acionamento por Enter/Espaço; Ctrl+K abre a ajuda e Esc fecha-a. Não são adicionados atalhos diretos para avançar ou responder.
- Pesquisa, XP, notificações, navegação, conteúdo, estado de atividade e comunicação com backend já possuem comportamentos definidos e devem ser reutilizados sem mudanças funcionais.
- Ajustes de disposição para diferentes larguras de tela fazem parte da consistência visual e não alteram os dados nem a lógica das páginas.
