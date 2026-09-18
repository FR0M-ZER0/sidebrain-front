# Feature Specification: Resultado do Quiz

**Feature Branch**: `SDB-67-quiz-result`

**Created**: 2026-09-18

**Status**: Draft

**Input**: User description: "SDB-67"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar desempenho após o quiz (Priority: P1)

Ao concluir uma sessão de microaprendizado, o usuário quer visualizar imediatamente seu resultado consolidado para entender seu desempenho e reconhecer seu progresso.

**Why this priority**: O resumo de desempenho é o valor central da tela e fecha o ciclo de aprendizagem com feedback imediato.

**Independent Test**: Disponibilizar um resultado de quiz concluído e verificar que a tela apresenta a pontuação, a quantidade de respostas corretas, XP ganho, precisão, tempo gasto, retenção estimada e a sequência atual do usuário.

**Acceptance Scenarios**:

1. **Given** que o usuário concluiu uma sessão de quiz, **When** o resultado é carregado, **Then** a tela exibe o percentual de acertos, a quantidade de respostas corretas e o total de questões.
2. **Given** que existem métricas calculadas para a sessão, **When** o usuário visualiza o resumo, **Then** XP ganho, precisão, tempo gasto e retenção estimada aparecem com seus valores e informações complementares.
3. **Given** que o resultado está sendo calculado ou carregado, **When** o usuário acessa a tela, **Then** elementos de carregamento preservam a estrutura da tela até que os dados estejam disponíveis.
4. **Given** que o usuário obteve menos de 100% de acertos, **When** o resultado é exibido, **Then** a mensagem de conclusão, a pontuação e as métricas refletem o desempenho real sem apresentar o estado de sucesso máximo indevidamente.

### User Story 2 - Revisar o detalhamento das questões (Priority: P1)

O usuário quer revisar cada questão, seu status e o raciocínio associado para compreender os acertos e identificar oportunidades de melhoria.

**Why this priority**: A revisão transforma a pontuação em aprendizado acionável e é essencial para o objetivo de reforço do conhecimento.

**Independent Test**: Abrir um resultado com múltiplas questões, expandir uma questão, expandir todas e recolher todas, verificando o conteúdo e o estado visual de cada item.

**Acceptance Scenarios**:

1. **Given** que a lista de questões está recolhida, **When** o usuário seleciona uma questão, **Then** somente o detalhamento daquela questão é expandido e seu indicador de expansão é atualizado.
2. **Given** que existem questões recolhidas e expandidas, **When** o usuário seleciona "Expandir todas", **Then** todas as questões exibem seu detalhamento; ao selecionar novamente, todas retornam ao estado recolhido.
3. **Given** que uma questão possui resposta, explicação, categoria, duração e status, **When** seu detalhamento é expandido, **Then** essas informações são apresentadas de forma associada à questão correta.
4. **Given** que uma questão não possui resposta ou explicação detalhada, **When** o usuário a expande, **Then** a tela permanece utilizável e comunica a ausência de detalhe sem quebrar o restante da lista.

### User Story 3 - Escolher o próximo passo (Priority: P1)

O usuário quer sair do resultado pela trilha, refazer a tentativa ou abrir um feedback aprofundado para continuar seu aprendizado.

**Why this priority**: Ações de saída claras evitam que o usuário fique preso no resultado e conectam a tela aos próximos momentos da jornada.

**Independent Test**: Acionar cada ação de saída em um resultado carregado e verificar que cada uma conduz ao destino correspondente, sem misturar os fluxos.

**Acceptance Scenarios**:

1. **Given** que o resultado está visível, **When** o usuário seleciona "Voltar para a Trilha", **Then** retorna à visão geral da trilha associada.
2. **Given** que o resultado está visível, **When** o usuário seleciona "Refazer Quiz", **Then** uma nova tentativa do quiz é iniciada para o módulo correspondente.
3. **Given** que o resultado está visível, **When** o usuário seleciona "Ver Feedback Detalhado da IA", **Then** o feedback aprofundado do resultado é aberto para o módulo correspondente.
4. **Given** que o usuário está em qualquer estado da tela, **When** seleciona o controle de fechar ou pressiona `ESC`, **Then** a mesma ação de retorno à trilha é executada.

### Edge Cases

- Se o resultado não puder ser carregado, a tela deve comunicar o problema e oferecer uma saída para a trilha sem exibir métricas inventadas.
- Se a lista de questões estiver vazia, a tela deve manter o resumo disponível e informar que não há questões para detalhar.
- Se uma métrica estiver indisponível, a tela deve indicar a ausência do valor sem deslocar ou ocultar as demais métricas.
- Em telas menores, textos, métricas, lista e ações devem permanecer legíveis e acessíveis sem sobreposição ou perda de controles.
- O atalho `ESC` não deve disparar uma navegação duplicada quando o usuário já estiver deixando a tela.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela MUST apresentar o resumo do resultado de uma sessão de quiz concluída, associado ao módulo e à tentativa exibidos.
- **FR-002**: A tela MUST exibir percentual de acertos, respostas corretas, total de questões, XP ganho, precisão, tempo gasto, retenção estimada e sequência atual quando esses dados estiverem disponíveis.
- **FR-003**: A tela MUST ajustar a mensagem e os indicadores de conclusão ao desempenho real da sessão, incluindo resultados abaixo de 100% de acertos.
- **FR-004**: A tela MUST indicar visualmente o progresso e os estados de conclusão de modo compreensível, sem depender apenas de cor.
- **FR-005**: A tela MUST apresentar cada questão com número, título, categoria, duração e status de resposta, quando disponíveis.
- **FR-006**: O usuário MUST poder expandir e recolher cada questão individualmente.
- **FR-007**: O usuário MUST poder expandir ou recolher todas as questões por meio de uma única ação global, com o rótulo refletindo o estado atual.
- **FR-008**: Ao expandir uma questão, a tela MUST apresentar a resposta do usuário e a explicação ou raciocínio correspondente quando disponíveis.
- **FR-009**: A tela MUST oferecer ações distintas para voltar à trilha, refazer o quiz e abrir o feedback detalhado da IA.
- **FR-010**: O controle de fechar e a tecla `ESC` MUST executar o mesmo retorno à trilha oferecido pela ação de voltar.
- **FR-011**: A tela MUST apresentar um estado de carregamento enquanto o resultado está sendo processado ou recuperado.
- **FR-012**: A tela MUST apresentar uma mensagem de erro e uma opção de retorno quando não conseguir recuperar o resultado.
- **FR-013**: A apresentação MUST adaptar conteúdo, controles e ações para desktop, tablet e dispositivos móveis sem sobreposição ou perda de informação essencial.
- **FR-014**: As ações, expansões e estados de carregamento MUST fornecer indicação perceptível de mudança de estado, incluindo para usuários que não distinguem cores.

### Key Entities

- **Resultado do Quiz**: registro consolidado de uma tentativa concluída, incluindo módulo, pontuação, métricas, sequência e suas questões.
- **Métrica de Desempenho**: indicador calculado da tentativa, como XP, precisão, tempo gasto ou retenção estimada, com valor e contexto.
- **Questão Respondida**: item avaliado na tentativa, com enunciado resumido, categoria, duração, status, resposta do usuário e explicação disponível.
- **Ação de Continuação**: destino escolhido pelo usuário a partir do resultado: trilha, nova tentativa ou feedback detalhado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de aceitação, 100% dos resultados concluídos exibem pontuação, contagem de questões e as quatro categorias de métricas quando os dados estão disponíveis.
- **SC-002**: Pelo menos 95% dos usuários de teste conseguem identificar seu desempenho e escolher um próximo passo em até 30 segundos após o carregamento do resultado.
- **SC-003**: Em 100% dos testes de teclado, `ESC` e o controle de fechar conduzem ao mesmo destino da ação "Voltar para a Trilha".
- **SC-004**: Em 100% dos testes com listas de questões, a expansão individual afeta apenas a questão selecionada e a ação global sincroniza todas as questões.
- **SC-005**: A tela permanece utilizável em larguras desktop, tablet e móvel testadas, sem sobreposição de textos ou perda das ações principais.
- **SC-006**: Em testes com dados incompletos, indisponíveis ou com erro, o usuário recebe um estado compreensível e uma saída válida sem métricas incorretas.

## Assumptions

- O usuário já está autenticado e chega à tela após a conclusão de um quiz válido.
- Os dados do resultado são fornecidos pelo fluxo existente de quiz e serão substituídos por uma fonte persistente quando essa integração estiver disponível.
- A trilha, a nova tentativa e o feedback detalhado possuem destinos definidos pela jornada existente do produto.
- A primeira versão cobre os resultados de uma única tentativa por vez; comparação entre tentativas não faz parte do escopo.
- Textos, valores e estado visual devem seguir a referência de design indicada para o resultado do quiz, com adaptação para telas menores.
