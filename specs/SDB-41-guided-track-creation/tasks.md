# Tasks: Criação inicial de trilha guiada

**Input**: Design documents from `/specs/SDB-41-guided-track-creation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/track-creation.md`, `quickstart.md`

**Tests**: Não há tarefas de testes automatizados: a especificação não solicita TDD e o projeto não tem framework de testes. Os critérios independentes e cenários manuais estão registrados por story e em `quickstart.md`.

**Organization**: Tasks agrupadas por User Story para implementação incremental e validação independente.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar as dependências pedidas pela feature sem aplicar reset visual às páginas existentes.

- [X] T001 Adicionar Tailwind CSS 4, `@tailwindcss/vite` e Motion for React às dependências em `package.json` e atualizar `package-lock.json`.
- [X] T002 Configurar o plugin Tailwind no `vite.config.ts` e importar somente as camadas theme/utilities em `src/index.css`, sem Preflight global.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Resolver o limite obrigatório de autenticação antes de expor rotas customer.

**⚠️ CRITICAL — BLOQUEIO DE INTEGRAÇÃO**: A inspeção da branch não encontrou `PrivateRoute` nem integração de autenticação. A tela, o mock e um harness HTML isolado podem ser desenvolvidos/validados, mas não registrar `/trails/new` ou `/trilhas/nova` em `App.tsx` nem ligar entradas de produção enquanto não houver guard real. Não criar guarda fictícia.

- [BLOCKED] T003 Nenhum limite autenticado real existe nesta branch (`PrivateRoute`/provider ausentes). A rota não foi registrada em `src/App.tsx`; a integração aguarda a plataforma fornecer o guard.

**Checkpoint**: Dependências configuradas. A integração das rotas e entradas customer continua bloqueada até que a plataforma forneça um limite autenticado real; o restante da UI pode ser validado pelo harness isolado.

---

## Phase 3: User Story 1 - Informar o objetivo de aprendizagem (Priority: P1) 🎯 MVP

**Goal**: Permitir que a pessoa descreva livremente uma meta, envie-a pelo mock e siga para o passo 2 após aceite.

**Independent Test**: Abrir a tela, informar um objetivo não vazio, avançar e confirmar que o mock aceita o texto e que `/trails/new/start` recebe a meta. Campo vazio ou só com espaços não deve submeter; falha deve manter o texto e oferecer nova tentativa.

### Implementation for User Story 1

- [X] T004 [US1] Criar `TrackGoalDraft` e `Step1SubmissionResult` em `src/types/trackCreation.ts`, incluindo `goalDescription`, `sourceSuggestionId`, `submissionStatus` (`idle | submitting | failed | accepted`) e `errorMessage`; aplicar a regra verbatim “para submissão, deve conter ao menos um caractere não branco depois de `trim`” e “Não existe limite máximo de caracteres definido pela spec”; o mock aceito retorna `success: true` e `nextStep: 2`.
- [X] T005 [US1] Implementar `submitTrackGoal(goalDescription)` como mock sem chamada HTTP em `src/api/trackCreationApi.ts`, seguindo `contracts/track-creation.md` e rejeitando texto vazio após `trim`; não inventar endpoint de backend.
- [X] T006 [US1] Implementar o hook `useTrackCreation` em `src/hooks/useTrackCreation.ts` para controlar texto, validação, estados de envio/erro, prevenção de envio duplicado e retry preservando o objetivo.
- [X] T007 [US1] Criar a estrutura principal da tela em `src/pages/customer/CreateTrackPage.tsx`, com shell Sidebar/HeaderBar, indicação “PASSO 1 DE 3”, título, descrição, textarea e placeholder, nota informativa e botão “Avançar”; aplicar entrada do card com Motion e estados de foco/loading acessíveis.
- [BLOCKED] T008 [US1] A página implementa a navegação com o objetivo em `location state`, validada no harness; o registro de `/trails/new` e `/trilhas/nova` em `src/App.tsx` aguarda um guard real de autenticação (T003).
- [X] T009 [US1] Ler e preservar o objetivo recebido em `location state` no passo existente em `src/pages/customer/TrailStartPreferencePage.tsx`, sem persistir texto livre em armazenamento local e sem descartá-lo nas navegações seguintes desse passo.

**Checkpoint**: A pessoa consegue concluir o fluxo usando texto livre, com validação e falha recuperável, mesmo antes da integração real do backend.

---

## Phase 4: User Story 2 - Começar por uma sugestão popular (Priority: P2)

**Goal**: Permitir que a pessoa preencha a meta por uma sugestão e a personalize antes de enviar.

**Independent Test**: Verificar as cinco sugestões da spec, ativar cada uma e confirmar o preenchimento exato do campo. Editar uma sugestão e avançar; a versão editada deve ser a enviada.

### Implementation for User Story 2

- [X] T010 [P] [US2] Criar `PopularGoalSuggestions` em `src/components/customer/PopularGoalSuggestions.tsx` com opções acionáveis para “Japonês para Iniciantes”, “Matemática & Geometria”, “Python para Ciência de Dados”, “UI/UX Design Moderno” e “Inglês para Entrevistas”, rótulos acessíveis e estados Motion de hover/tap/foco.
- [X] T011 [US2] Integrar `PopularGoalSuggestions` ao formulário em `src/pages/customer/CreateTrackPage.tsx` e `src/hooks/useTrackCreation.ts`; selecionar uma opção preenche `goalDescription`, mantém o campo editável e submete o texto final, não o rótulo original caso tenha sido alterado.

**Checkpoint**: O fluxo da US1 permanece funcionando e agora também pode começar a partir de qualquer uma das cinco sugestões.

---

## Phase 5: User Story 3 - Entender o passo e navegar pelo fluxo (Priority: P3)

**Goal**: Orientar a pessoa no fluxo, permitir entrada e retorno claros e manter a experiência utilizável em desktop, tablet e celular.

**Independent Test**: Abrir a feature pela sidebar e pelo caminho direto; confirmar breadcrumb de retorno à área de trilhas, foco/teclado e ausência de corte ou rolagem horizontal em celular, tablet e desktop.

### Implementation for User Story 3

- [BLOCKED] T012 [US3] O estado ativo de “Minhas Trilhas” está suportado pela Sidebar, mas entradas clicáveis de produção (Sidebar/CTA) e link à tela não foram habilitados por dependerem do guard de autenticação (T003).
- [X] T013 [P] [US3] Implementar o breadcrumb “← Trilhas” em `src/pages/customer/CreateTrackPage.tsx` para retornar a `/` e comunicar interatividade por foco visível e hover/underline, sem iniciar submissão.
- [X] T014 [US3] Ajustar a composição da página para desktop, tablet e celular em `src/pages/customer/CreateTrackPage.tsx` e `src/App.css`, mantendo campo, sugestões, nota e ação visíveis/legíveis sem sobreposição ou rolagem horizontal.
- [X] T015 [US3] Garantir navegação por teclado, foco identificável, nome/estado acessíveis e anúncio de validação, processamento e falha em `src/pages/customer/CreateTrackPage.tsx` e `src/components/customer/PopularGoalSuggestions.tsx`, conforme FR-010 e FR-013.

**Checkpoint**: Entrada, avanço e retorno funcionam por rotas e controles visíveis, e a tela pode ser usada sem mouse em todos os tamanhos previstos.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Fechar animações acessíveis e validar a entrega completa.

- [X] T016 Respeitar `prefers-reduced-motion` para entrada do card, chips e botão em `src/pages/customer/CreateTrackPage.tsx` e `src/components/customer/PopularGoalSuggestions.tsx`, mantendo estados compreensíveis sem animação.
- [X] T017 Executar os cenários manuais possíveis pelo harness isolado de `specs/SDB-41-guided-track-creation/quickstart.md` e corrigir problemas; rodar `npm run lint` e `npm run build` definidos em `package.json`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências; T001 deve preceder T002.
- **Foundational (Phase 2)**: depende de Setup; T003 bloqueia o registro/liberação de qualquer rota da feature até existir autenticação real.
- **User Stories (Phase 3+)**: dependem da fundação. Executar em prioridade P1 → P2 → P3 para entrega incremental.
- **Polish (Phase 6)**: depende de US1, US2 e US3 concluídas.

### User Story Dependencies

- **US1 (P1)**: após Phase 2; fluxo independente por texto livre e mock de submissão.
- **US2 (P2)**: usa os tipos e formulário estabelecidos pela US1; T010 pode ser desenvolvido em paralelo ao restante da US1 depois de T004, e T011 integra o componente ao fluxo.
- **US3 (P3)**: requer a rota e a tela da US1; as entradas e navegação podem ser testadas sem selecionar sugestão (US2), embora a entrega integrada ocorra após US2.

### Within Each User Story

- Tipos e contrato local vêm antes do hook/adaptador que os consomem.
- O formulário principal deve existir antes da integração das sugestões e das ações de navegação.
- Não há tarefas de testes automatizados; validar os critérios independentes com os cenários manuais descritos.

### Parallel Opportunities

- Phase 1: somente tarefas sem dependência podem paralelizar; T002 depende de T001.
- US2: T010 pode ser implementada em arquivo separado após T004 enquanto a US1 continua; T011 espera o componente e o formulário.
- US3: T012 e T013 podem paralelizar após T008 por alterarem arquivos diferentes; T014/T015 devem seguir a integração para evitar conflitos na tela.
- US1: as tarefas são sequenciais por compartilharem tipos, API, hook, página e rota.

---

## Parallel Example: User Story 2

```text
Depois de T004, desenvolver em paralelo:
- T010: componente PopularGoalSuggestions em src/components/customer/PopularGoalSuggestions.tsx
- continuar T005/T006/T007 da US1 em seus arquivos de API, hook e página

Após a conclusão de T010 e T007:
- T011 integra o componente e o formulário em src/pages/customer/CreateTrackPage.tsx e src/hooks/useTrackCreation.ts
```

## Parallel Example: User Story 3

```text
Após T008, executar em paralelo:
- T012: navegação de entrada em src/components/customer/Sidebar.tsx e src/components/customer/TracksSection.tsx
- T013: breadcrumb de retorno em src/pages/customer/CreateTrackPage.tsx

Depois, concluir T014 e T015 sequencialmente para evitar alterações simultâneas na página e nos estilos compartilhados.
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Setup; manter a integração de rota bloqueada enquanto não houver guard real.
2. Implementar US1: descrição livre, validação, estados do mock e transição para etapa 2 com a meta.
3. **STOP e VALIDATE**: seguir o teste independente de US1 e os cenários relacionados do quickstart.
4. Demonstrar o MVP assim que a integração de rota privada estiver disponível.

### Incremental Delivery

1. Setup + Foundational → configuração pronta e rota mantida privada.
2. US1 → jornada funcional por meta livre (MVP).
3. US2 → sugestões populares como alternativa de preenchimento.
4. US3 → entradas/navegação, responsividade e acessibilidade cruzada.
5. Polish → movimento reduzido, quickstart, lint e build.

## Notes

- `[P]` indica tarefas em arquivos distintos sem dependência de tarefa incompleta.
- `[US1]`, `[US2]` e `[US3]` mapeiam as stories e prioridades da spec.
- O contrato real de backend e o limite de autenticação não aparecem no código; não inventar endpoint nem publicar rotas sem autenticação.
T003, T008 e T012 permanecem bloqueadas exclusivamente pela ausência do guard de autenticação. As implementações visuais e funcionais disponíveis no harness foram concluídas e validadas sem adicionar rotas de produção.
