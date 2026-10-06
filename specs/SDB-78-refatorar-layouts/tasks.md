# Tasks: Padronização de Layouts

**Input**: Design documents from `/specs/SDB-78-refatorar-layouts/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/layouts-ui.md`, `quickstart.md`

**Tests**: Nenhum teste automatizado foi solicitado na especificação; validar com lint, build e cenários manuais do quickstart.

**Organization**: Tarefas agrupadas pelas três histórias da especificação para implementação incremental e verificável.

## Format: `[ID] [P?] [Story] Descrição`

- **[P]** indica que a tarefa pode ser executada em paralelo por tratar arquivos independentes e não depender de tarefas incompletas.
- **[Story]** mapeia a tarefa a uma história de usuário (US1, US2 ou US3); setup, fundação e polish não recebem etiqueta de história.
- Toda tarefa indica os caminhos dos arquivos envolvidos.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar estado inicial e referências; o projeto, ferramentas e estrutura já existem.

- [X] T001 [P] Executar `npm run lint` e `npm run build` como baseline e registrar os resultados iniciais em `specs/SDB-78-refatorar-layouts/quickstart.md`.
- [X] T002 [P] Conferir as referências de lição e quiz em `docs/img/Sidebrain - Tela da lição (Desktop).png` e `docs/img/Sidebrain - Quiz (Desktop).png`; registrar detalhes visuais ou eventual acesso autorizado ao Figma em `specs/SDB-78-refatorar-layouts/research.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Usar a infraestrutura atual sem criar uma camada de dados, rota ou ferramenta de teste nova.

Não há tarefas de fundação adicionais: `src/App.tsx`, `src/components/customer/Sidebar.tsx`, `src/components/customer/HeaderBar.tsx`, os hooks existentes e os comandos de lint/build já fornecem a base necessária. As histórias podem começar após a confirmação do baseline/referências na Phase 1.

**Checkpoint**: Projeto e referências confirmados; iniciar as histórias independentes.

---

## Phase 3: User Story 1 - Navegar pelas páginas principais com estrutura consistente (Priority: P1) 🎯 MVP

**Goal**: Padronizar o shell das seis páginas gerais com Sidebar, HeaderBar, conteúdo na mesma largura externa do Dashboard e breadcrumb opcional, sem alterar lógica ou navegação.

**Independent Test**: Abrir `/`, `/trails/<slug-existente>`, `/trails/new/create`, `/trails/new/start`, `/trails/new/assessment` e `/trails/new/generating`; comparar shell/largura/alinhamento e confirmar que os fluxos atuais continuam funcionando.

### Implementation for User Story 1

- [X] T003 [P] [US1] Criar o shell reutilizável com Sidebar, HeaderBar, `children` e breadcrumb opcional em `src/components/customer/layouts/StudentPageLayout.tsx`.
- [X] T004 [P] [US1] Definir estilos do shell, largura externa alinhada ao Dashboard, alinhamento do breadcrumb e adaptação responsiva em `src/App.css`.
- [X] T005 [US1] Compor HomeDashboardPage, TrackDetailsPage, CreateTrackPage, TrailStartPreferencePage e TrailLevelAssessmentPage com `StudentPageLayout`, removendo shells/topbars duplicados sem alterar estados, handlers ou props de negócio em `src/pages/customer/HomeDashboardPage.tsx`, `src/pages/customer/TrackDetailsPage.tsx`, `src/pages/customer/CreateTrackPage.tsx`, `src/pages/customer/TrailStartPreferencePage.tsx` e `src/pages/customer/TrailLevelAssessmentPage.tsx`.
- [X] T006 [US1] Aplicar `StudentPageLayout` a TrailGenerationLoadingPage e remover os wrappers de navegação duplicados das rotas de preferência/avaliação/geração, mantendo URLs, progresso, retry e redirecionamento em `src/pages/customer/TrailGenerationLoadingPage.tsx` e `src/App.tsx`.

**Checkpoint**: As seis páginas gerais mostram os mesmos elementos globais e largura exterior e mantêm suas ações existentes.

---

## Phase 4: User Story 2 - Usar lições e quizzes em layouts próprios (Priority: P1)

**Goal**: Padronizar visualmente as atividades de lição e quiz conforme as referências locais, mantendo o modo de foco e preservando dados, progresso e integrações existentes.

**Independent Test**: Abrir uma atividade de lição e uma de quiz, comparar cada composição desktop com sua imagem de referência e percorrer conteúdo, carregamento, erro, resposta, feedback e navegação sem regressão funcional.

### Implementation for User Story 2

- [X] T007 [US2] Ajustar o shell de foco e os estilos responsivos da atividade ao cabeçalho/rodapé da referência de lição, mantendo sua API de apresentação em `src/components/customer/lesson/LessonFocusLayout.tsx` e `src/App.css`.
- [X] T008 [P] [US2] Alinhar a hierarquia visual de breadcrumbs, progresso, conteúdo e ações da lição à referência local sem alterar o hook ou a navegação em `src/pages/customer/LessonPage.tsx` e `src/components/customer/lesson/LessonContent.tsx`.
- [X] T009 [P] [US2] Alinhar a tela de quiz vinculada à lição ao shell e aos estados visuais de atividade, mantendo carregamento, resposta discursiva, envio e feedback atuais em `src/pages/customer/LessonQuizPage.tsx` e `src/App.css`.
- [X] T010 [US2] Aplicar a composição visual da referência de quiz à atividade de múltipla escolha, preservar `useAssessmentFlow`/estados/handlers e retirar o wrapper com Sidebar das rotas de estudo sem alterar os layouts próprios de resultado/conclusão em `src/pages/customer/AssessmentPage.tsx`, `src/components/customer/AssessmentCard.tsx`, `src/pages/customer/QuizResultPage.tsx`, `src/pages/lessons/LessonCompletionPage.tsx`, `src/App.tsx` e `src/App.css`.

**Checkpoint**: Atividades de lição e quiz seguem as respectivas referências sem mudar suas regras nem os dados que exibem.

---

## Phase 5: User Story 3 - Consultar e usar atalhos de teclado em lições e quizzes (Priority: P2)

**Goal**: Disponibilizar a ajuda Ctrl+K e navegação nativa pelo teclado, sem atalhos diretos para responder ou avançar e sem interferir na digitação.

**Independent Test**: Em lição e quiz, confirmar Tab/Shift+Tab, Enter/Espaço, abertura da ajuda por Ctrl+K e botão visível, fechamento por Esc, preservação do foco/estado e não captura em campos editáveis.

### Implementation for User Story 3

- [X] T011 [P] [US3] Criar o painel acessível que explica Tab/Shift+Tab, Enter/Espaço e Esc, oferece fechamento visível e mantém foco contido/restaurado em `src/components/customer/lesson/KeyboardShortcutsHelp.tsx`.
- [X] T012 [P] [US3] Criar o hook local de ajuda de teclado para abrir/fechar o painel por Ctrl+K/Esc, ignorar eventos de campos editáveis e não persistir estado em `src/hooks/useKeyboardHelp.ts`.
- [X] T013 [US3] Integrar o hook e o painel ao shell e às telas de quiz, disponibilizar acionador visível e garantir que Esc feche primeiro a ajuda antes de manter o comportamento atual de saída em `src/components/customer/lesson/LessonFocusLayout.tsx`, `src/pages/customer/LessonPage.tsx`, `src/pages/customer/LessonQuizPage.tsx`, `src/pages/customer/AssessmentPage.tsx` e `src/App.css`.

**Checkpoint**: Ajuda e navegação por teclado funcionam em lição e quiz sem capturar digitação, enviar resposta ou alterar progresso por atalho.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Confirmar fidelidade visual, responsividade, integridade funcional e qualidade de entrega das três histórias.

- [X] T014 Comparar desktop/tablet/mobile com as referências e revisar os ajustes responsivos finais do shell geral e das atividades em `src/App.css` e registrar desvios conhecidos/resolvidos em `specs/SDB-78-refatorar-layouts/quickstart.md`.
- [X] T015 Executar os cenários de `specs/SDB-78-refatorar-layouts/quickstart.md` disponíveis neste ambiente, rodar `npm run lint` e `npm run build`, e registrar os resultados, inclusive limites de integração, no próprio `specs/SDB-78-refatorar-layouts/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências; confirmar baseline e referências.
- **Foundational (Phase 2)**: Não exige mudanças adicionais; depende apenas do baseline da Phase 1.
- **User Stories (Phases 3–5)**: Começam após Setup/Foundational.
- **Polish (Phase 6)**: Depende da conclusão das histórias escolhidas e valida o conjunto integrado.

### User Story Dependencies

- **US1 (P1)**: Independente após Setup; MVP recomendado para entrega incremental.
- **US2 (P1)**: Independente funcionalmente de US1 após Setup; alguns ajustes usam `src/App.css`, compartilhado com US1, então alterações nesse arquivo devem ser serializadas ou coordenadas.
- **US3 (P2)**: Depende das composições de atividade da US2 estarem disponíveis para integrar a ajuda no shell de lição e nas páginas de quiz.

### Within Each User Story

- US1: T003 e T004 são independentes; T005 e T006 dependem do shell e estilos definidos em T003/T004.
- US2: T007 define o shell e estilos compartilhados. Depois, T008 (lição) e T009 (quiz discursivo) podem ser trabalhadas em paralelo; T010 (quiz de múltipla escolha) vem depois de T009 porque ambos ajustam `src/App.css`.
- US3: T011 e T012 podem ocorrer em paralelo; T013 integra ambos depois da conclusão da US2.
- Não foram criadas tarefas de testes automatizados porque a especificação não solicita TDD nem há framework existente; validar as histórias com os critérios independentes e o quickstart.

### Parallel Opportunities

- Setup: T001 e T002.
- US1: T003 e T004.
- US2: Depois de T007, T008 e T009 podem ser trabalhadas em paralelo; T010 segue T009 para evitar edição simultânea de `src/App.css`.
- US3: T011 e T012; integração T013 somente depois.
- US1 e US2 são incrementos funcionalmente independentes, mas as alterações em `src/App.css` devem ser serializadas para evitar conflito. US3 começa depois da US2.

---

## Parallel Example: User Story 1

```text
T003: Criar o shell em src/components/customer/layouts/StudentPageLayout.tsx
T004: Definir o shell e os estilos responsivos em src/App.css
```

## Parallel Example: User Story 2

```text
Após definir o shell de atividade em T007:
T008: Ajustar a atividade de lição em src/pages/customer/LessonPage.tsx
T009: Ajustar o quiz discursivo em src/pages/customer/LessonQuizPage.tsx
# T010 ajusta o quiz de múltipla escolha em src/pages/customer/AssessmentPage.tsx após T009
```

## Parallel Example: User Story 3

```text
T011: Criar src/components/customer/lesson/KeyboardShortcutsHelp.tsx
T012: Criar src/hooks/useKeyboardHelp.ts
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Confirmar baseline e referências (Phase 1).
2. Implementar o shell e a largura padrão (US1).
3. Validar independentemente as seis rotas gerais com o quickstart antes de avançar.

### Incremental Delivery

1. US1 entrega a navegação geral padronizada e funciona como MVP independente.
2. US2 acrescenta os layouts focados de lição e quiz e preserva os fluxos existentes.
3. US3 acrescenta a ajuda acessível e valida teclado nas atividades.
4. Phase 6 executa validação visual, responsiva, funcional, lint e build no conjunto integrado.

## Notes

- Toda tarefa segue `- [ ] Tnnn [P?] [Story?] descrição com caminho(s) exato(s)`.
- `[P]` foi usado apenas onde arquivos distintos permitem execução independente.
- Caminhos de página e layout acompanham a estrutura existente em `src/pages` e `src/components`.
- Valores de XP/notificações e ações existentes devem ser preservados; layout não cria nem busca dados.
