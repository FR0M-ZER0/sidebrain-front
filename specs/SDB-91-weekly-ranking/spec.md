# Feature Specification: Ranking Semanal

**Feature Branch**: `SDB-91-weekly-ranking`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "SDB-[91] — Criar a tela de Ranking do Sidebrain para acompanhar a posição na competição semanal, comparar desempenho com outros estudantes e visualizar XP, consistência e evolução no ranking, usando dados mockados."

## Clarifications

### Session 2026-10-14

- Q: Ao selecionar Ranking Global, quais informações devem mudar além da tabela? → A: Atualizar todo o conteúdo específico do ranking para o contexto global; manter busca, navegação e cabeçalho.
- Q: Qual valor deve ser exibido como XP necessário para alcançar o pódio: os `+240 XP` informados ou a diferença de `+490 XP` para o terceiro colocado atual? → A: Manter `+240 XP` como valor demonstrativo fornecido.
- Q: Na imagem, a linha verde aparece depois do 5º lugar, mas a especificação atual define o corte do pódio entre o 3º e o 4º; qual posição devo usar? → A: Depois do 5º — seguir a imagem e posicionar a linha entre o 5º e o 6º lugares.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender a liga e o próprio desempenho (Priority: P1)

Como estudante, quero consultar a liga semanal, o pódio e meu resumo de desempenho para entender minha posição e o que falta para avançar.

**Why this priority**: Entender a competição atual e o próprio progresso é o valor central da tela.

**Independent Test**: Abrir a tela no modo Liga Semanal e verificar ciclo, divisão, encerramento, três participantes do pódio e todas as métricas do usuário.

**Acceptance Scenarios**:

1. **Given** que o estudante acessa o Ranking no modo inicial, **When** a tela é apresentada, **Then** identifica a Divisão I, o ciclo semanal, o tempo restante de 2 dias, 14 horas e 28 minutos e o encerramento no domingo às 23:59.
2. **Given** que os dados semanais estão disponíveis, **When** o estudante consulta o pódio, **Then** vê Mariana Souza em 1º (nível 67, 18 dias seguidos, 6.420 XP e identificação de Líder), Lucas Rocha em 2º (nível 10, 19 dias seguidos, 5.890 XP) e Camila Mendes em 3º (nível 100, 18 dias seguidos, 5.340 XP).
3. **Given** que o estudante visualiza seu resumo, **When** consulta a posição e o progresso, **Then** identifica Alexandre M. (Você) em 4º lugar, 4.850 XP semanal, 14 módulos concluídos, ofensiva de 14 dias e a indicação de +240 XP para alcançar o pódio.
4. **Given** que o cabeçalho da aplicação está visível, **When** o estudante consulta seus indicadores, **Then** vê 320/500 XP, sequência de 12 dias e um indicador visual de notificação pendente, sem confundir a sequência do cabeçalho com a ofensiva de 14 dias do ranking.

---

### User Story 2 - Comparar participantes e evolução (Priority: P1)

Como estudante, quero comparar minha classificação com a dos demais participantes para acompanhar trilhas, consistência, XP e mudanças de posição.

**Why this priority**: A comparação dá contexto à posição individual e torna visível a evolução relativa no ciclo.

**Independent Test**: Conferir a tabela para garantir que as colunas e os dados de Alexandre M. e dos participantes seguintes estejam corretos e que a posição do usuário e o corte do pódio sejam visualmente distinguíveis.

**Acceptance Scenarios**:

1. **Given** que a liga semanal está selecionada, **When** a classificação é apresentada, **Then** a tabela permite identificar posição, estudante, nível, trilha ativa, sequência, consistência e XP semanal para os participantes disponíveis.
2. **Given** que a posição do usuário aparece na classificação, **When** ele compara as linhas, **Then** sua linha é destacada e identificada como “Você”, e a linha de corte mostrada na referência é claramente indicada entre 5º e 6º lugares.
3. **Given** que há variação de posição para um participante, **When** ele consulta a classificação, **Then** vê a evolução expressa por valores como “+2”, “+1”, “-1” ou “-2”, acompanhados de indicação visual que não depende apenas de cor.
4. **Given** que a lista inicial é exibida, **When** o estudante examina as posições seguintes, **Then** encontra Alexandre M. em 4º (nível 10, Língua Japonesa (FSRS), 14 dias, 94%, 4.850 XP), Beatriz Leal em 5º (Engenharia de Prompt, 12 dias, 91%, 4.620 XP), Gabriel Santos em 6º (Matemática Discreta, 15 dias, 89%, 4.490 XP), Larissa Costa em 7º (Estatística & Probabilidade, 9 dias, 92%, 4.210 XP), Rodrigo Paiva em 8º (Língua Japonesa (FSRS), 11 dias, 88%, 3.980 XP), Juliana Nogueira em 9º (Sistemas Distribuídos, 7 dias, 86%, 3.750 XP) e Thiago Fernandes em 10º (Arquitetura de Software, 13 dias, 90%, 3.610 XP); todos com nível 10.

---

### User Story 3 - Alternar o ranking e consultar a lista completa (Priority: P2)

Como estudante, quero alternar entre a liga semanal e o ranking global e consultar posições adicionais para explorar diferentes perspectivas da classificação.

**Why this priority**: Os modos e a lista ampliada complementam a comparação, mas a compreensão da liga e da posição atual precisa funcionar primeiro.

**Independent Test**: Alternar entre os dois modos e acionar “Ver ranking completo”; confirmar que cada ação atualiza ou expande a classificação com dados demonstrativos correspondentes, sem depender de serviços externos.

**Acceptance Scenarios**:

1. **Given** que a Liga Semanal (Divisão Atual) está selecionada, **When** o estudante escolhe Ranking Global, **Then** pódio, resumo do usuário, posição, pontuação e classificação passam a usar o conjunto global mockado, o contexto semanal de ciclo e divisão é substituído por um contexto global e o modo selecionado fica identificado; busca, navegação e indicadores do cabeçalho permanecem iguais.
2. **Given** que o Ranking Global está selecionado, **When** o estudante retorna à Liga Semanal, **Then** volta a ver os dados e o contexto da Divisão I.
3. **Given** que a classificação inicial está visível, **When** o estudante seleciona “Ver ranking completo”, **Then** posições fictícias adicionais são reveladas ou consultáveis e a ação indica claramente que a lista foi expandida ou aberta.
4. **Given** que há posições adicionais, **When** a lista é expandida, **Then** a quantidade de estudantes exibidos é atualizada e as novas linhas preservam as mesmas informações e distinções visuais da classificação.

### Edge Cases

- Se um conjunto de dados mockados não estiver disponível, a tela informa que a classificação daquele modo está indisponível, sem exibir valores fictícios incompletos como se fossem válidos.
- Se a lista completa não tiver posições adicionais além das exibidas, a ação de expansão não deve sugerir que há mais estudantes; deve comunicar que a lista terminou.
- Se a posição de evolução não tiver alteração anterior disponível, mostrar estado neutro/sem variação, em vez de inventar um sinal de progresso.
- A troca de modo deve manter o modo selecionado claramente identificável e não misturar dados da liga semanal com os do ranking global.
- Em larguras menores, a navegação, as métricas essenciais e os dados de classificação permanecem acessíveis sem sobreposição ou corte; a referência fornecida é desktop.
- O indicador de sequência de 12 dias no cabeçalho e a ofensiva de 14 dias no resumo do ranking representam métricas fornecidas separadamente e não devem ser unificadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela MUST apresentar o contexto do ciclo semanal, a Divisão I, o tempo restante de 2 dias, 14 horas e 28 minutos e o encerramento no domingo às 23:59.
- **FR-002**: A tela MUST destacar os três primeiros colocados, exibindo posição, avatar, nome, nível, dias seguidos e XP acumulado; o primeiro colocado MUST ser identificado como Líder.
- **FR-003**: A tela MUST apresentar o resumo do usuário Alexandre M. (Você), incluindo posição 4º, XP semanal de 4.850, progresso de +240 XP até o pódio, 14 módulos concluídos e ofensiva de 14 dias.
- **FR-004**: A tela MUST exibir no cabeçalho os indicadores fornecidos de XP (320/500), sequência (12 dias) e notificação pendente, mantendo o padrão visual e de navegação existente na aplicação.
- **FR-005**: A classificação MUST apresentar posição, estudante, trilha ativa, consistência e XP semanal, incluindo também nível, sequência e evolução de posição nos dados dos participantes.
- **FR-006**: A classificação MUST conter dados da liga semanal para Alexandre M. e os participantes das posições 5º a 10º com os níveis, trilhas, sequências, consistências e XP especificados nesta descrição.
- **FR-007**: A tela MUST diferenciar visualmente o pódio e a linha do usuário atual e MUST indicar a linha de corte visual da referência entre 5º e 6º lugares, sem depender exclusivamente de cor para comunicar essas distinções.
- **FR-008**: A tela MUST permitir alternar entre Liga Semanal (Divisão Atual) e Ranking Global, apresentando conjuntos mockados distintos para pódio, resumo do usuário, posição, pontuação e classificação. Ao selecionar Ranking Global, MUST substituir o contexto de ciclo e divisão semanal por um contexto global; busca, navegação e indicadores do cabeçalho MUST permanecer iguais.
- **FR-009**: A ação “Ver ranking completo” MUST permitir consultar posições mockadas adicionais, atualizar a quantidade de estudantes exibidos e permitir ao usuário compreender quando não houver mais posições.
- **FR-010**: A apresentação MUST incluir navegação lateral, busca, indicadores do cabeçalho e elementos de interface compartilhados de acordo com os padrões já existentes, sem alterar aparência ou comportamento desses elementos compartilhados.
- **FR-011**: A composição visual específica do Ranking MUST seguir a referência fornecida: fundo claro em tons de lilás, cards brancos arredondados com sombras sutis, azul como cor principal e destaques para pódio, evolução e consistência. A disposição inclui introdução do ciclo, controles de modo, pódio, resumo pessoal, classificação e rodapé com contagem e ação de expansão.
- **FR-012**: Os dados desta etapa MUST ser locais, estáticos e demonstrativos, sem exigir integração com serviços reais para exibir, alternar ou expandir as classificações.
- **FR-013**: As principais informações e ações MUST permanecer acessíveis em diferentes larguras de tela, sem sobreposição ou perda dos dados essenciais.

### Key Entities *(include if feature involves data)*

- **Ciclo de Ranking**: período semanal, divisão, tempo restante e horário de encerramento.
- **Participante**: estudante classificado, com posição, nome, avatar, nível, trilha ativa, sequência de estudos, consistência, XP e variação de posição quando disponível.
- **Resumo do Usuário**: posição atual, XP semanal, distância informada até o pódio, módulos concluídos e ofensiva de estudos.
- **Modo de Classificação**: perspectiva semanal da divisão atual ou perspectiva global, cada uma associada ao respectivo conjunto demonstrativo.
- **Lista de Ranking**: conjunto ordenado de participantes, com estado inicial e posições adicionais consultáveis.
- **Indicadores do Cabeçalho**: XP em progresso, sequência atual e estado de notificação pendente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em todos os testes com dados padrão, usuários identificam corretamente divisão, ciclo, tempo restante, horário de encerramento e os três integrantes do pódio em até 30 segundos.
- **SC-002**: Pelo menos 95% dos usuários de teste conseguem identificar a própria posição, o XP semanal, os módulos concluídos, a ofensiva e o progresso informado até o pódio em até 30 segundos.
- **SC-003**: Em 100% dos testes funcionais, alternar entre Liga Semanal e Ranking Global apresenta o conjunto correspondente, sem mistura de dados entre modos.
- **SC-004**: Em 100% dos testes funcionais, a ação de ranking completo revela ou abre posições adicionais e atualiza corretamente a quantidade exibida.
- **SC-005**: Em 100% das verificações da classificação, posição, estudante, trilha, consistência e XP semanal estão identificáveis, e o usuário atual e o limite do pódio são distinguíveis.
- **SC-006**: Em todas as larguras de tela verificadas, nenhum dado ou controle essencial fica sobreposto, cortado ou inacessível.
- **SC-007**: A experiência completa com os dois modos e a expansão da lista pode ser demonstrada sem conexão a serviços de dados reais.

## Assumptions

- O estudante está autenticado e acessa o Ranking pela navegação existente do produto.
- A Liga Semanal (Divisão Atual) é o modo inicial e usa os dados semanais indicados nesta descrição.
- Os valores do cabeçalho (sequência de 12 dias) e do resumo do usuário (ofensiva de 14 dias) são informações distintas fornecidas para regiões diferentes da tela.
- Conforme clarificado, o valor fornecido de +240 XP até o pódio é exibido como dado demonstrativo autoritativo, sem ser recalculado a partir da diferença de +490 XP entre o XP do usuário e a pontuação atual do terceiro colocado.
- A descrição fornece os dados completos das posições 4 a 10 e do pódio da liga semanal; os dados do Ranking Global e das posições adicionais são fictícios, coerentes e suficientes para demonstrar alternância e expansão. O modo global não exibe o ciclo ou a divisão da liga semanal.
- Avatar e ícone da divisão podem ser representações visuais demonstrativas quando não houver imagem específica indicada nos dados locais.
- A navegação lateral, busca e cabeçalho existentes devem ser reutilizados sem mudanças; a nova tela não redefine o comportamento desses elementos.
- A imagem “Ranking Desktop” está disponível em `docs/img/Sidebrain_-_Ranking_Desktop.png` e foi usada como base visual. O usuário dispensou a validação pixel a pixel do frame Figma nesta entrega.
