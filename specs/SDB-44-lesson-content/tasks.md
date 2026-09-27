---

description: "Task list for implementing the lesson reading page"
---

# Tasks: Página de Leitura da Lição

**Input**: Design documents from `/specs/SDB-44-lesson-content/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/lesson-page.md`, `quickstart.md`

**Tests**: Não foram solicitados testes automatizados e o projeto não possui framework de testes configurado; cada história tem critérios de validação independente e cenários manuais em `quickstart.md`.

**Organization**: Tasks agrupadas por história de usuário para permitir implementação e validação incremental.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executada em paralelo, pois altera arquivos diferentes e não depende de tarefa pendente.
- **[Story]**: História correspondente à especificação (`US1` a `US4`).
- Toda tarefa aponta os caminhos exatos do repositório.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar as dependências de estilo e animação solicitadas pela feature.

- [X] T001 Adicionar `tailwindcss@3.4`, `postcss`, `autoprefixer` e `motion` às dependências apropriadas em `package.json` e atualizar `package-lock.json` com `npm install`.
- [X] T002 [P] Configurar varredura de `src/**/*.{ts,tsx}` e tokens de fundo, azul de progresso e texto no `tailwind.config.js` conforme `docs/img/Sidebrain - Tela da lição (Desktop).png`.
- [X] T003 [P] Configurar Tailwind 3 no `postcss.config.cjs` e importar suas camadas em `src/index.css`, preservando os estilos globais existentes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Construir as estruturas compartilhadas necessárias antes das histórias; a integração protegida depende de um guard de autenticação do produto.

**⚠️ CRITICAL**: A rota não pode ser exposta publicamente. O repositório inspecionado não possui `PrivateRoute` nem fonte de estado de autenticação.

- [X] T004 [P] Definir os tipos de lição/blocos e o adaptador de dados mockados para `lesson-3` em `src/api/lessonsApi.ts`, respeitando `data-model.md`: “Identificador estável; deve corresponder ao `id` da rota”; título é obrigatório; ids de blocos “Único dentro de uma lição e estável entre atualizações”; breadcrumbs têm destinos opcionais; posição e total de lições são inteiros positivos; percentual visual é limitado a 0–100; “bloco de imagem pode não ter legenda; bloco de parágrafo requer texto não vazio para renderização”.
- [X] T005 Criar `useLesson` em `src/hooks/useLesson.ts` para obter a lição pelo identificador via `src/api/lessonsApi.ts` e expor estados loading, success e error com ação de repetição (depende de T004).
- [X] T006 [P] Criar o layout base de foco em `src/components/customer/lesson/LessonFocusLayout.tsx`, com estrutura de cabeçalho, área de leitura central e rodapé, responsiva e sem navegação lateral distrativa.
- [ ] T007 Integrar a rota privada `/lessons/:id` em `src/App.tsx` usando o `PrivateRoute` e a fonte de autenticação fornecidos pela aplicação. Enquanto isso, há uma rota de prévia apenas em desenvolvimento (`import.meta.env.DEV`); a rota não é incluída no build de produção.

**Checkpoint**: Dependências, modelo mockado, hook e layout compartilhado estão prontos; a rota só pode ser registrada quando houver guard de autenticação confiável.

---

## Phase 3: User Story 1 - Ler o conteúdo da lição (Priority: P1) 🎯 MVP

**Goal**: Exibir o título, figura/legenda e parágrafos da lição na ordem recebida em uma experiência focada e responsiva.

**Independent Test**: Abrir a lição mockada e verificar título, imagem com legenda e todos os parágrafos completos e ordenados em desktop, tablet e mobile.

### Implementation for User Story 1

- [X] T008 [P] [US1] Criar `LessonContent` em `src/components/customer/lesson/LessonContent.tsx` para renderizar título e blocos `image`/`paragraph` na ordem dos dados; a legenda é opcional, parágrafos sem texto não são renderizados e falha de imagem não invalida os outros blocos.
- [X] T009 [P] [US1] Disponibilizar o visual do Teorema de Pitágoras em `public/assets/images/pythagorean-theorem.png` e alinhar a URL do mock em `src/api/lessonsApi.ts` ao arquivo disponível; se o asset fonte não existir no repositório, registrar a dependência e manter o fallback de mídia indisponível.
- [X] T010 [US1] Compor `LessonPage` em `src/pages/customer/LessonPage.tsx` com `useLesson`, `LessonFocusLayout` e `LessonContent`, animando a entrada sem atrasar o conteúdo.

**Checkpoint**: A leitura da lição pode ser demonstrada independentemente com dados mockados.

---

## Phase 4: User Story 2 - Acompanhar o contexto e o progresso (Priority: P1)

**Goal**: Exibir a hierarquia de navegação, o indicador de lição, a porcentagem da trilha e a sequência de estudo quando disponível.

**Independent Test**: Com dados conhecidos, confirmar breadcrumb na ordem trilha/curso/módulo/lição, links apenas para destinos válidos, “Lição 3 de 8”, 35%, barra correspondente e sequência 12.

### Implementation for User Story 2

- [X] T011 [P] [US2] Criar `LessonHeader` em `src/components/customer/lesson/LessonHeader.tsx` com breadcrumbs ordenados, lição atual identificada e destinos opcionais; níveis sem destino válido não são interativos.
- [X] T012 [P] [US2] Criar `LessonProgress` em `src/components/customer/lesson/LessonProgress.tsx` com posição atual/total, percentual textual, barra acessível e animação suave; normalizar o percentual visual para 0–100 e, se `totalLessons` estiver ausente ou menor que a posição, manter a informação disponível sem barra inconsistente.
- [X] T013 [US2] Integrar `LessonHeader` e `LessonProgress` à composição em `src/pages/customer/LessonPage.tsx`, exibindo `streakCount` como sequência atual quando disponível e omitindo destinos de breadcrumb inexistentes (depende de T011 e T012).

**Checkpoint**: Contexto e progresso refletem os dados recebidos e continuam legíveis em todos os tamanhos de tela.

---

## Phase 5: User Story 3 - Sair ou pausar a leitura com segurança (Priority: P2)

**Goal**: Oferecer saída confirmada e consistente pelo botão do cabeçalho e pela tecla `ESC`, sem perder a leitura quando o aluno cancelar.

**Independent Test**: Acionar o botão e `ESC`, cancelar para confirmar que a lição/posição é mantida, depois confirmar e verificar retorno único ao destino válido.

### Implementation for User Story 3

- [X] T014 [P] [US3] Criar `LessonExitDialog` em `src/components/customer/lesson/LessonExitDialog.tsx` com ações de cancelar/confirmar, rótulos acessíveis, foco contido e retorno do foco ao acionador.
- [X] T015 [US3] Conectar o botão “Sair da aula” e a tecla `Escape` ao mesmo fluxo de confirmação em `src/pages/customer/LessonPage.tsx`; cancelar preserva a posição, confirmar navega uma vez e `Escape` não interfere em campos de texto.
- [X] T016 [US3] Completar o rodapé em `src/components/customer/lesson/LessonFocusLayout.tsx` com o atalho indicado e feedback de hover/tap do botão de saída, respeitando movimento reduzido.

**Checkpoint**: A saída é previsível por mouse e teclado e pode ser cancelada sem interromper a leitura.

---

## Phase 6: User Story 4 - Reconhecer carregamento e recuperar falhas (Priority: P2)

**Goal**: Tornar explícitos os estados de carregamento e erro e permitir nova tentativa sem perder a estrutura da página.

**Independent Test**: Simular espera, falha e nova tentativa bem-sucedida; confirmar skeleton, mensagem amigável, controle de repetição e conteúdo carregado após sucesso.

### Implementation for User Story 4

- [X] T017 [P] [US4] Criar `LessonLoading` em `src/components/customer/lesson/LessonLoading.tsx` com skeletons para breadcrumbs, título, visual e parágrafos, sem valores fictícios.
- [X] T018 [P] [US4] Criar `LessonError` em `src/components/customer/lesson/LessonError.tsx` com mensagem amigável, ação “Tentar novamente” e saída acessível.
- [X] T019 [US4] Ligar estados e repetição de `useLesson` à página em `src/pages/customer/LessonPage.tsx`, substituindo skeleton/erro pelo conteúdo quando a recuperação concluir.

**Checkpoint**: A tela nunca fica vazia durante carregamento/falha e a recuperação é possível sem recarregar a aplicação.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validar a entrega combinada contra requisitos visuais, acessibilidade, responsividade e convenções do repositório.

- [X] T020 Revisar tokens, espaçamentos, contraste, responsividade, foco de teclado e preferência por movimento reduzido em `src/components/customer/lesson/` e `src/index.css` contra `docs/img/Sidebrain - Tela da lição (Desktop).png`.
- [ ] T021 Executar lint e build com `npm run lint` e `npm run build`, corrigir os problemas e seguir os cenários do `specs/SDB-44-lesson-content/quickstart.md` (lint/build passaram; validação manual da rota aguarda T007).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências; T001 antecede a configuração Tailwind (T002/T003).
- **Foundational (Phase 2)**: depende do Setup. T005 depende de T004. T007 também depende de um guard de autenticação e fonte de sessão fornecidos pela aplicação; bloqueia o registro/entrega protegida da rota.
- **User Stories (Phase 3+)**: dependem das estruturas compartilhadas; seguir prioridade P1 antes de P2. US2 integra os componentes ao page da US1; US3/US4 integram interações/estados à mesma página.
- **Polish (Phase 7)**: após as histórias que forem incluídas na entrega.

### User Story Dependencies

- **US1 (P1)**: após Foundation; independente das outras histórias para validação visual do conteúdo mockado.
- **US2 (P1)**: componentes T011/T012 podem ser desenvolvidos depois da Foundation e em paralelo com US1; integração T013 depende de T010.
- **US3 (P2)**: após a estrutura de página da US1 e os controles de cabeçalho/progresso da US2 estarem disponíveis; T014 é independente e pode ser iniciado antes da integração T015.
- **US4 (P2)**: T017/T018 são independentes após a Foundation; T019 integra os estados no `LessonPage` existente.

### Parallel Opportunities

- Após T001, T002 e T003 podem ocorrer em paralelo (configuração Tailwind e CSS/PostCSS são arquivos distintos).
- Após Setup, T004 e T006 podem ocorrer em paralelo; T005 começa após T004.
- Dentro de US1, T008 e T009 podem ocorrer em paralelo.
- Dentro de US2, T011 e T012 podem ocorrer em paralelo.
- Dentro de US3, T014 pode ocorrer em paralelo com preparações de footer T016 quando os responsáveis evitarem conflito de edição no layout; por segurança, priorizar arquivos/componentes separados.
- Dentro de US4, T017 e T018 podem ocorrer em paralelo.
- T007 é bloqueante: não marcar a rota como concluída sem guard e integração de sessão verdadeiros.

## Parallel Example: User Story 1

```text
# Depois da Phase 2, implementar em paralelo (arquivos diferentes):
T008 — src/components/customer/lesson/LessonContent.tsx
T009 — public/assets/images/pythagorean-theorem.png e URL mock em src/api/lessonsApi.ts

# Depois dos dois e da Foundation:
T010 — compor src/pages/customer/LessonPage.tsx
```

## Parallel Examples: User Stories 2–4

```text
# US2: componentes distintos podem ser implementados em paralelo
T011 — src/components/customer/lesson/LessonHeader.tsx
T012 — src/components/customer/lesson/LessonProgress.tsx

# US3: diálogo e estrutura de layout são arquivos distintos
T014 — src/components/customer/lesson/LessonExitDialog.tsx
T016 — rodapé em src/components/customer/lesson/LessonFocusLayout.tsx

# US4: skeleton e erro são componentes independentes
T017 — src/components/customer/lesson/LessonLoading.tsx
T018 — src/components/customer/lesson/LessonError.tsx
```

## Implementation Strategy

### MVP First (User Story 1)

1. Concluir Setup (T001–T003) e Foundation (T004–T007), respeitando a dependência de autenticação antes de registrar a rota.
2. Entregar US1 (T008–T010): conteúdo textual/visual ordenado em foco.
3. Validar US1 pelos cenários manuais de `quickstart.md` em desktop, tablet e mobile.
4. Adicionar US2 (contexto/progresso), depois US3 (saída) e US4 (loading/erro), validando cada história independentemente.

### Incremental Delivery

- US1 entrega leitura com mock como primeiro incremento.
- US2 acrescenta breadcrumbs e progresso mantendo a leitura disponível.
- US3 acrescenta saída/cancelamento seguro por controle e teclado.
- US4 fecha os estados de carregamento, falha e recuperação.
- A entrega integrada só fica acessível após a integração do guard de autenticação.
