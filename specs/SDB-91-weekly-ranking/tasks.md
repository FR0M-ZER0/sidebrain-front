---

description: "Plano de tarefas de implementação para a tela Ranking Semanal"
---

# Tasks: Ranking Semanal

**Input**: Documentos de design em `/specs/SDB-91-weekly-ranking/`

**Pré-requisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ranking-ui.md` e `quickstart.md`

**Testes**: Não foram solicitados testes automatizados e o repositório não possui framework de testes configurado. Cada fase inclui critérios de validação manual independentes; lint e build ficam no polimento.

**Organização**: Tarefas agrupadas pelas histórias de usuário da especificação para permitir implementação incremental e validação por história.

## Formato

`- [ ] T### [P?] [US#?] Descrição objetiva com caminho(s) exato(s)`

- `[P]` indica que a tarefa pode ocorrer em paralelo, em arquivos diferentes e após suas dependências.
- `[US1]`, `[US2]` e `[US3]` identificam as histórias de usuário da especificação.
- Todas as tarefas abaixo incluem o caminho do artefato que será criado ou alterado.

## Bloqueios externos

- A rota `/ranking` deve usar `PrivateRoute` e `useAuth` existentes; não criar proteção simulada nem expor a tela como rota pública.
- A imagem `docs/img/Sidebrain_-_Ranking_Desktop.png` está disponível e foi usada como base visual.
- A validação pixel a pixel no Figma foi explicitamente dispensada pelo usuário para esta entrega; demais cenários, lint e build continuam necessários.

## Phase 1: Setup

**Propósito**: Preparar a aplicação existente para uma nova página sem introduzir dependências.

O setup de React/Vite, scripts e bibliotecas já existe em `package.json`; não há inicialização adicional nem dependência nova necessária.

---

## Phase 2: Foundational

**Propósito**: Criar o modelo compartilhado que as histórias usarão.

- [X] T001 Definir os tipos `RankingDataset`, `RankingCycle`, `RankingParticipant`, `RankingUserSummary`, `HeaderIndicators` e `RankingViewState` em `src/types/ranking.ts`, refletindo os campos de `data-model.md`; preservar as regras: “`consistencyPercent`, quando disponível, deve estar entre 0 e 100”, “`notifications` deve ser um inteiro não negativo”, “posições devem ser únicas e ordenadas sem duplicidade”, “Cada conjunto deve identificar no máximo um participante como usuário atual”, “`podium` contém as posições 1, 2 e 3 do mesmo conjunto de participantes”, “A liga semanal requer ciclo e divisão; o conjunto global não apresenta ciclo/divisão semanais” e “A sequência de cabeçalho (12 dias) e a ofensiva no resumo semanal (14 dias) são fontes/campos distintos e não podem ser mescladas”.

**Checkpoint**: Os tipos descrevem dados semanais, globais e estado local sem introduzir HTTP ou armazenamento.

---

## Phase 3: User Story 1 - Entender a liga e o próprio desempenho (Priority: P1) 🎯 MVP

**Goal**: Apresentar o contexto semanal, pódio, cabeçalho e resumo de Alexandre M. com dados demonstrativos corretos.

**Independent Test**: Abrir o preview local no modo semanal e identificar Divisão I, tempo e encerramento, os três primeiros, XP e atividade do usuário e os indicadores do cabeçalho; confirmar que os 12 dias do cabeçalho não substituem os 14 dias da ofensiva.

### Implementation for User Story 1

- [X] T002 [US1] Criar o conjunto semanal inicial em `src/data/rankingMockData.ts` com Mariana Souza (1º, nível 67, 18 dias, 6.420 XP, Líder), Lucas Rocha (2º, nível 10, 19 dias, 5.890 XP), Camila Mendes (3º, nível 100, 18 dias, 5.340 XP), Alexandre M. (4º, nível 10, Língua Japonesa (FSRS), 14 dias, 94%, 4.850 XP) e posições 5º–10º exatamente como `spec.md`; incluir ciclo semanal, Divisão I, tempo restante e encerramento informados, resumo do usuário com +240 XP, 14 módulos e ofensiva de 14 dias, e cabeçalho 320/500 XP, 12 dias e notificação pendente. Manter posições únicas/ordenadas e não recalcular o valor +240.
- [X] T003 [P] [US1] Criar o banner/introdução de ciclo e divisão em `src/components/customer/ranking/RankingIntro.tsx`, recebendo contexto do conjunto semanal e sem fixar informações semanais quando o modo for global.
- [X] T004 [P] [US1] Criar os cards de pódio em `src/components/customer/ranking/RankingPodium.tsx`, mostrando posição, avatar/fallback, nome, nível, sequência, pontuação e badge de Líder, com rótulos que não dependam apenas de cor.
- [X] T005 [P] [US1] Criar o resumo do estudante em `src/components/customer/ranking/RankingUserSummary.tsx`, mostrando posição, XP, XP fornecido até o pódio, módulos concluídos e ofensiva sem recalcular +240.
- [X] T006 [US1] Compor a página em `src/pages/customer/RankingPage.tsx` com `Sidebar`, `HeaderBar`, introdução, pódio e resumo; reutilizar `Sidebar` e `HeaderBar` sem mudar seus arquivos ou estilos compartilhados, e adicionar na composição da página o indicador específico de sequência de 12 dias que o HeaderBar não oferece.
- [X] T007 [US1] Criar o preview de desenvolvimento em `src/dev/rankingPreview.tsx` e `ranking-preview.html` para renderizar a página com `MemoryRouter`, seguindo o padrão de preview local existente; manter o entry isolado de rotas de usuário e do build/roteamento de produção.

**Checkpoint**: A apresentação semanal e o resumo são demonstráveis em preview local, sem chamadas de rede e sem publicar uma rota de usuário desprotegida.

---

## Phase 4: User Story 2 - Comparar participantes e evolução (Priority: P1)

**Goal**: Permitir comparação tabular das posições, trilhas, consistência, XP e evolução, com destaque do usuário e do corte do pódio.

**Independent Test**: No modo semanal, consultar as posições 4–10 e verificar todos os valores informados na especificação; localizar “Você”, o corte entre 5º/6º, evolução textual e estado neutro sem variação.

### Implementation for User Story 2

- [X] T008 [US2] Criar tabela semântica de classificação em `src/components/customer/ranking/RankingTable.tsx`, com cabeçalhos para posição, estudante, trilha ativa, consistência e XP semanal, além de nível, sequência e variação; exibir inicialmente as posições 4–10 fornecidas em `spec.md` e preparar estado neutro quando `positionChange` for nulo.
- [X] T009 [US2] Integrar `RankingTable` à composição semanal em `src/pages/customer/RankingPage.tsx`, mantendo pódio em destaque, linha de Alexandre M. marcada como “Você” e separador/legenda de corte mostrado na imagem entre 5º e 6º.
- [X] T010 [US2] Implementar apresentação acessível da evolução e consistência em `src/components/customer/ranking/RankingTable.tsx`: exibir variações como “+2”, “+1”, “-1” ou “-2” com texto/ícone e manter nome/percentual além da cor.
- [X] T011 [US2] Criar estilos específicos e responsivos da tabela em `src/components/customer/ranking/ranking.css`, usando como base a imagem disponível e preservando os campos por rolagem horizontal em telas estreitas. A calibração final do CSS continua na T018, condicionada à inspeção Figma.

**Checkpoint**: A classificação semanal é comparável e acessível, com os dados das posições 4–10, destaque do usuário e corte visível.

---

## Phase 5: User Story 3 - Alternar o ranking e consultar a lista completa (Priority: P2)

**Goal**: Alternar integralmente entre os conjuntos semanal/global e consultar posições mockadas adicionais.

**Independent Test**: Alternar os modos e verificar que pódio, resumo, pontuação e tabela são substituídos pelo conjunto selecionado; expandir a lista, conferir contagem e estado final, e voltar à Liga Semanal sem mistura de dados.

### Implementation for User Story 3

- [X] T012 [US3] Acrescentar em `src/data/rankingMockData.ts` um conjunto global distinto com contexto global, participantes, pódio, resumo do usuário e pontuação global; identificar Alexandre como único usuário atual, manter posições únicas/ordenadas e não reutilizar ciclo/divisão/XP semanal como se fossem globais.
- [X] T013 [P] [US3] Criar o controle de modos em `src/components/customer/ranking/RankingModeSwitch.tsx` para Liga Semanal (Divisão Atual) e Ranking Global, com seleção e foco acessíveis.
- [X] T014 [P] [US3] Implementar `useRanking` em `src/hooks/useRanking.ts` para modo inicial `weekly`, seleção do dataset e estado efêmero de expansão (`isExpanded`), sem Redux, persistência ou chamadas HTTP.
- [X] T015 [US3] Integrar o seletor e `useRanking` à página em `src/pages/customer/RankingPage.tsx`; ao trocar de modo, atualizar contexto, pódio, resumo, posição/pontuação e tabela, preservando busca, navegação e indicadores gerais do cabeçalho.
- [X] T016 [US3] Completar a expansão e o rodapé em `src/components/customer/ranking/RankingTable.tsx`, usando `aria-expanded`, ação “Ver ranking completo”, contagem atualizada e mensagem de fim quando não houver outras posições.
- [X] T017 [US3] Acrescentar posições fictícias posteriores (por exemplo, 11º–20º) aos conjuntos semanal e global em `src/data/rankingMockData.ts`, com IDs/posições únicos, ordem consistente, pontuações descendentes por conjunto e campos que mantenham o mesmo contrato da tabela.

**Checkpoint**: Cada modo é demonstrável com dados próprios; a lista completa cresce sem misturar dados e informa quando termina.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Propósito**: Resolver gates de publicação, validar referência visual e executar as verificações finais.

- [X] T018 Implementar e ajustar os estilos do Ranking em `src/components/customer/ranking/ranking.css` usando a imagem `docs/img/Sidebrain_-_Ranking_Desktop.png`; verificar cores, tipografia, espaçamentos, ícones, bordas, sombras e responsividade. A calibração/validação pixel a pixel no Figma foi dispensada pelo usuário e permanece fora do escopo desta entrega.
- [X] T019 Registrar `/ranking` em `src/App.tsx` dentro do `PrivateRoute` existente e validá-la dentro do shell existente, mantendo as rotas públicas de autenticação fora desse grupo.
- [X] T020 Executar os cenários disponíveis de `specs/SDB-91-weekly-ranking/quickstart.md`, `npm run lint` e `npm run build`; registrar como dispensada somente a comparação pixel a pixel que depende do Figma. O erro de referência indefinida preexistente em `src/components/customer/Sidebar.tsx` foi corrigido removendo condições mortas para itens inexistentes do menu, sem alterar aparência ou navegação.

---

## Dependencies & Execution Order

### Fases

- **Setup (Phase 1)**: Sem tarefas de bootstrap; Vite/React, dependências e scripts já existem.
- **Foundational (Phase 2)**: T001 define tipos usados por todos os conjuntos e componentes.
- **User Story 1 (Phase 3)**: T002–T007 dependem de T001; estabelece o MVP semanal e o preview local.
- **User Story 2 (Phase 4)**: Depende do modelo e da fixture semanal de US1; T008–T011 acrescentam tabela, estados e responsividade sem substituir o pódio/resumo.
- **User Story 3 (Phase 5)**: Depende da composição e tabela das histórias anteriores; T012–T017 acrescentam global, alternância e expansão.
- **Polish (Phase 6)**: T018 usa a imagem local; validação pixel a pixel no Figma dispensada pelo usuário. T019 usa o guard existente; T020 depende das histórias concluídas e das verificações disponíveis.

### Dependências entre histórias

- **US1 (P1)**: primeiro incremento demonstrável e MVP; depende apenas do modelo comum.
- **US2 (P1)**: aproveita a fixture e página semanal da US1 para completar a comparação; nesta decomposição é sequencial à US1 para evitar conflito na composição da página.
- **US3 (P2)**: requer tabela e página existentes para trocar o dataset inteiro e expandir ambos os modos.
- **Limite da entrega**: a imagem local foi usada como referência. A comparação pixel a pixel com o Figma foi dispensada pelo usuário; a rota protegida, dados e interações podem ser concluídos sem esse gate.

### Oportunidades de paralelização

- Após T001 e T002, T003, T004 e T005 podem ocorrer em paralelo, pois editam componentes diferentes.
- Em US3, T013 e T014 podem ocorrer em paralelo; T012 é dependência para a integração global T015.
- T018 foi concluída com a imagem local, sem inspeção Figma conforme orientação do usuário; T019 usa o guard existente; T020 executa lint, build e roteiro manual.

## Exemplo de execução paralela: US1

```text
Depois de T001 e T002:
T003 — criar RankingIntro.tsx
T004 — criar RankingPodium.tsx
T005 — criar RankingUserSummary.tsx
```

## Estratégia de implementação

### MVP primeiro

1. Completar T001 e a fixture semanal T002.
2. Construir os componentes e a página da US1 (T003–T007).
3. Validar ciclo, pódio, resumo e cabeçalho pelo preview local.
4. Avançar para tabela (US2), alternância e lista completa (US3).
5. Registrar a rota sob o guard existente; a calibração pixel a pixel no Figma está dispensada nesta entrega.

### Formato e validação

- Total: 20 tarefas identificadas de T001 a T020.
- Todas as tarefas executáveis seguem checkbox, ID sequencial, marcador `[P]` somente nas paralelizáveis, rótulo de história nas fases de história e caminhos concretos.
- Não há tarefas automatizadas de teste porque não foram pedidas; critérios de teste independente e roteiro manual estão em cada história e em `quickstart.md`.
