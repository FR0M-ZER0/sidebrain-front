# Feature Specification: Tela de Missões e Badges (SDB-84)

**Feature Branch**: `feat/sdb-84-missoes-e-badges`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "SDB-84 — Criar tela de missões e badges do Sidebrain para acompanhamento de desafios de aprendizagem, progresso do usuário e consulta de badges desbloqueados, em andamento ou bloqueados, com dados mockados e fidelidade visual à referência docs/img/Sidebrain - Missões & Badges (Desktop).png."

## Clarifications

### Session 2026-10-07

- Q: Como as ações demonstrativas das missões ("Continuar Trilha" e "Revisar 8 Cards") devem se comportar ao serem clicadas pelo usuário? → A: Exibir um toast/notificação visual na própria tela confirmando a ação simulada, mantendo o usuário na tela de Missões & Badges.
- Q: Quando um filtro de badges (ex: "Em Progresso" ou "Raros & Épicos") for aplicado e uma categoria temática não possuir badges correspondentes, como essa seção deve se comportar? → A: Ocultar a categoria que não possuir badges correspondentes ao filtro ativo, mantendo a tela limpa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompanhar Desafios e Progresso de Missões (Priority: P1)

Como aluno da plataforma Sidebrain, quero acessar a área de Missões & Conquistas para visualizar meu nível atual, total de XP acumulado, balanço de badges e o andamento das minhas missões ativas e concluídas, para que eu me mantenha motivado e saiba quais atividades realizar em seguida.

**Why this priority**: É o valor central da tela. O usuário precisa de um painel claro para verificar sua evolução e saber o que precisa fazer para ganhar mais XP e manter seu hábito de estudo.

**Independent Test**: Acessar a rota da tela de Missões & Badges e verificar que os cards de resumo (Badges, Nível, Total XP) e a grade de missões exibem os dados corretos de progresso, categorias e recompensas, com diferenciação visual entre missões concluídas e em andamento.

**Acceptance Scenarios**:

1. **Given** que o usuário navega para a página de Missões & Badges, **When** a tela é carregada, **Then** são exibidos no topo os cards de resumo com `14 / 28` badges desbloqueados, nível `Nv. 8` e total de `4.850 XP`.
2. **Given** a seção de missões, **When** o usuário consulta a lista, **Then** cada missão exibe ícone temático, categoria (ex.: "HÁBITO CONTÍNUO", "ALGORITMO FSRS"), título, descrição do objetivo, recompensa em XP (ex.: `+150 XP`), barra de progresso visual, valores numéricos e percentuais de conclusão.
3. **Given** uma missão com 100% de conclusão (ex.: "Consistência de Ferro"), **When** o card é renderizado, **Then** o estado é apresentado como "Concluído" com indicador verde e o botão de ação exibe "Continuar Trilha →".
4. **Given** uma missão em andamento (ex.: "Mestre da Retenção"), **When** o card é renderizado, **Then** o estado reflete o progresso parcial (ex.: `32 / 40 cards (80%)`) e o botão de ação exibe o próximo passo prático (ex.: "Revisar 8 Cards").

---

### User Story 2 - Explorar e Filtrar a Vitrine de Badges (Priority: P1)

Como aluno da plataforma, quero navegar pela vitrine de medalhas e insígnias divididas por categorias e aplicar filtros por estado e raridade, para que eu possa celebrar minhas conquistas anteriores e entender os requisitos para desbloquear insígnias raras e lendárias.

**Why this priority**: A gamificação através de badges é o pilar de retenção do produto. A categorização e a filtragem facilitam a descoberta e o engajamento a longo prazo.

**Independent Test**: Interagir com cada botão de filtro ("Todos", "Desbloqueados", "Em Progresso", "Raros & Épicos") e verificar que os badges exibidos são atualizados imediatamente respeitando as categorias correspondentes e mantendo os contadores dos filtros intactos.

**Acceptance Scenarios**:

1. **Given** que a vitrine de badges está visível, **When** o filtro padrão "Todos (28)" está selecionado, **Then** todos os badges de todas as categorias são exibidos divididos em suas seções temáticas ("Sequência & Disciplina", "Maestria & Conhecimento", "Mentor & Inteligência Artificial").
2. **Given** que o usuário clica no filtro "Desbloqueados (14)", **When** o filtro é aplicado, **Then** apenas os badges conquistados permanecem visíveis, exibindo o selo de verificação verde, a data da conquista (ex.: "12 de Jan, 2025") e a indicação de raridade.
3. **Given** que o usuário clica no filtro "Em Progresso (6)", **When** o filtro é aplicado, **Then** apenas badges em andamento são exibidos, mostrando sua barra de progresso, percentual e valor atual versus alvo.
4. **Given** que o usuário clica no filtro "Raros & Épicos (8)", **When** o filtro é aplicado, **Then** apenas badges com raridade Raro, Épico ou Lendário são exibidos, independente do seu estado de desbloqueio.
5. **Given** um badge bloqueado (ex.: "A Mente Inquebrável"), **When** ele é visualizado na vitrine, **Then** exibe aparência bloqueada, identificação de raridade (ex.: "LENDÁRIO"), requisitos necessários e dados parciais quando aplicável (ex.: "Retenção atual: 92,4% | 18 / 30 dias").
6. **Given** que um filtro aplicado resulta em zero badges para uma determinada categoria, **When** a vitrine é atualizada, **Then** essa categoria é temporariamente ocultada para manter o layout limpo e sem blocos vazios.

---

### User Story 3 - Interagir com Ações Demonstrativas e Navegação (Priority: P2)

Como usuário, quero poder clicar nas ações das missões e nos elementos da barra lateral e superior, para que eu tenha uma experiência fluida de navegação demonstrativa com feedback imediato sem sair da página de exploração.

**Why this priority**: Garante que a experiência do usuário seja interativa e atenda aos requisitos de protótipo funcional demonstrativo com clareza visual.

**Independent Test**: Clicar nos botões "Continuar Trilha" e "Revisar 8 Cards" e verificar se há feedback visual demonstrativo via toast/notificação na tela, permanecendo na página sem quebras de navegação.

**Acceptance Scenarios**:

1. **Given** que o usuário clica no botão "Continuar Trilha →" de uma missão concluída, **When** o clique é registrado, **Then** a interface exibe um toast/notificação visual confirmando a ação simulada (ex.: "Ação demonstrativa: continuando trilha...") e mantém o usuário na tela de Missões & Badges.
2. **Given** que o usuário clica em "Revisar 8 Cards" de uma missão em andamento, **When** a ação é disparada, **Then** a interface exibe um toast/notificação visual confirmando o início simulado da sessão de revisão e mantém o usuário na tela de Missões & Badges.
3. **Given** os itens da barra de navegação lateral (Sidebar), **When** o usuário está nesta página, **Then** o item "Missões & Badges" aparece destacado com o estado ativo.
4. **Given** a barra superior compartilhada (Header), **When** visualizada, **Then** apresenta os dados de XP da sessão (`320 / 500 XP`), contador de streak (`12 dias`), campo de busca e notificações.

---

### Edge Cases

- **Ausência de badges em um filtro**: Se um filtro ativo não retornar nenhum badge para uma categoria específica, essa seção/categoria inteira é temporariamente ocultada, sem deixar cabeçalhos soltos ou cards vazios disfuncionais.
- **Títulos ou descrições extensas**: Badges e missões com descrições mais longas devem quebrar o texto adequadamente sem estourar as margens dos cards.
- **Visualização em diferentes resoluções**: Em telas desktop com larguras menores (ex.: 1024px a 1280px), a grade de missões e badges deve se acomodar suavemente em colunas fluidas mantendo legibilidade e proporções originais.
- **Truncamento de texto**: Nenhum valor essencial (como XP, contadores ou datas) pode ser cortado por elipses indevidas.
- **Raridades não previstas**: Qualquer badge deve obrigatoriamente possuir uma das quatro raridades definidas (Comum, Incomum, Raro, Épico, Lendário) com suas respectivas cores de tag.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar uma página dedicada para "Missões & Badges" acessível pela navegação lateral (`/missoes` ou `/missions-badges`).
- **FR-002**: A tela MUST apresentar um bloco de cabeçalho principal contendo o título "Missões & Conquistas" e texto de apoio descritivo.
- **FR-003**: A tela MUST exibir três cards de resumo métrico no topo da área de conteúdo:
  - Total de Badges: valor `14 / 28` com ícone de insígnia.
  - Nível Atual: valor `Nv. 8` com ícone de nível.
  - Total de XP: valor `4.850 XP` com ícone de raio/energia.
- **FR-004**: A tela MUST apresentar uma seção "Missões" organizada em grade de cards responsiva (2 colunas no padrão desktop).
- **FR-005**: Cada card de missão MUST exibir: ícone temático, tag da categoria, valor de recompensa em XP, título, descrição explicativa, barra de progresso com porcentagem e estado de conclusão.
- **FR-006**: Missões concluídas MUST exibir o selo de status "Concluído" com ícone de confirmação verde e o botão de ação primário "Continuar Trilha →".
- **FR-007**: Missões em andamento MUST exibir o botão de ação secundário relativo à atividade (ex.: "Revisar 8 Cards").
- **FR-008**: O acionamento dos botões de ação das missões MUST exibir um feedback visual amigável (toast/notificação na tela) confirmando a ação simulada correspondente, mantendo o usuário na página de Missões & Badges sem forçar redirecionamento externo.
- **FR-009**: A tela MUST apresentar a seção "Vitrine de Badges" com texto de apoio e barra de filtros.
- **FR-010**: A barra de filtros de badges MUST conter exatamente 4 opções com seus respectivos contadores: "Todos (28)", "Desbloqueados (14)", "Em Progresso (6)" e "Raros & Épicos (8)".
- **FR-011**: A seleção de qualquer filtro de badges MUST atualizar imediatamente a lista de badges exibidos, mantendo a divisão por categorias; categorias que não possuírem nenhum badge correspondente ao filtro ativo MUST ser temporariamente ocultadas da vitrine para manter a visualização limpa e focada.
- **FR-012**: Os badges MUST ser organizados nas três categorias temáticas:
  - "Sequência & Disciplina"
  - "Maestria & Conhecimento"
  - "Mentor & Inteligência Artificial"
- **FR-013**: Cada card de badge MUST exibir: ícone visual, selo de verificação quando desbloqueado, tag indicadora de raridade (Comum, Incomum, Raro, Épico, Lendário), nome do badge, descrição do critério e seu estado específico (data de conquista para desbloqueados, barra de progresso para em andamento, requisitos para bloqueados).
- **FR-014**: A interface MUST seguir pixel a pixel a composição, cores, sombras, arredondamentos, tipografia e espaçamentos da imagem de referência `docs/img/Sidebrain - Missões & Badges (Desktop).png`.
- **FR-015**: A página MUST ser integrada ao layout base do sistema (`Layout`), reaproveitando os componentes compartilhados existentes de barra lateral (Sidebar) e barra superior (Header) sem alterar suas aparências ou comportamentos globais.

### Key Entities

- **ResumoUsuario**: Estrutura contendo nível atual (`8`), total de badges conquistados e disponíveis (`14/28`), XP total acumulado (`4850`), XP da sessão (`320/500`) e sequência de estudos (`12`).
- **Missao**: Desafio de estudo contendo identificador, categoria ("Hábito Contínuo", "Algoritmo FSRS"), título, descrição, recompensa em XP, progresso atual, meta total, percentual calculado, estado ("completed" | "in_progress") e texto da ação demonstrativa.
- **Badge**: Conquista colecionável contendo identificador, nome, categoriaId, descrição, raridade ("comum" | "incomum" | "raro" | "epico" | "lendario"), estado ("unlocked" | "in_progress" | "locked"), data de conquista (opcional) e progresso/requisito (opcional).
- **CategoriaBadge**: Agrupamento temático de badges contendo identificador, título, ícone e contadores de conquistas na categoria.
- **FiltroBadge**: Enumeração dos estados de filtragem disponíveis ("todos", "desbloqueados", "em_progresso", "raros_epicos").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue visualizar seu resumo completo de nível, badges e XP imediatamente ao abrir a tela sem atrasos perceptíveis (renderização inicial em menos de 1 segundo).
- **SC-002**: A alternância entre os filtros de badges atualiza a exibição de forma instantânea (tempo de resposta do filtro inferior a 100 milissegundos).
- **SC-003**: 100% dos dados mockados estipulados na task SDB-84 (28 badges distribuídos em 3 categorias e 4 missões) estão representados e acessíveis na interface.
- **SC-004**: Fidelidade visual avaliada com conformidade total em relação à imagem de referência oficial (`docs/img/Sidebrain - Missões & Badges (Desktop).png`) em resolução de desktop padrão (1440x900 e 1920x1080).
- **SC-005**: 100% das interações de botões de missão disparam feedback visual em toast e as abas de filtros produzem resposta visual e estados de foco/hover adequados.

## Assumptions

- A tela operará integralmente com dados estáticos locais (mock) nesta primeira entrega, dispensando chamadas a serviços de backend de missões ou persistência em banco de dados.
- O componente compartilhado `Layout` (ou equivalente na arquitetura do projeto) já provê a barra lateral com navegação e a barra superior com os indicadores de busca, streak e notificações.
- Os ícones necessários para as missões e badges serão providos pela biblioteca de ícones já instalada no projeto (`lucide-react`) ou SVGs locais equivalentes com máxima correspondência aos da imagem de referência.
- A rota criada para a tela será protegida por autenticação seguindo o padrão normativo `PrivateRoute` do projeto.
