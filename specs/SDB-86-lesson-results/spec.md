# Feature Specification: Resultado da Lição

**Feature Branch**: `SDB-86-lesson-results`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "SDB-[86] — Criar a tela de Lição Concluída do Sidebrain, apresentada ao final de uma sessão de microaprendizagem. A tela comunica o resultado da sessão, resume o desempenho e permite revisar as questões respondidas. Dados e ações podem ser simulados, sem integrações reais de aprendizagem ou geração de feedback por IA."

## Clarifications

### Session 2026-10-07

- Q: Ao selecionar “Ver Feedback Detalhado da IA”, como o feedback deve ser apresentado? → A: Área de feedback na própria tela.
- Q: Ao selecionar “Refazer Quiz”, o que deve acontecer? → A: Confirmação demonstrativa na própria tela.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar o resultado da sessão (Priority: P1)

Ao concluir uma sessão de microaprendizagem, a pessoa usuária consulta o status da conclusão, o desempenho, os ganhos e a sequência de estudos em uma tela de foco.

**Why this priority**: Comunicar o resultado é o objetivo principal da experiência de conclusão.

**Independent Test**: Abrir a tela com a sessão demonstrativa e conferir status, mensagem e todos os valores de desempenho.

**Acceptance Scenarios**:

1. **Given** uma sessão demonstrativa concluída, **When** a tela é apresentada, **Then** exibe o status “Módulo Concluído com Sucesso”, a mensagem “Desempenho Impecável!”, 100% de aproveitamento e 5 de 5 questões corretas.
2. **Given** o resultado da sessão, **When** a pessoa consulta os indicadores, **Then** vê +80 XP, 100% de precisão, tempo total de 2 minutos e 15 segundos e sequência de estudos de 12 dias.

---

### User Story 2 - Revisar as questões respondidas (Priority: P1)

A pessoa usuária consulta as questões respondidas e expande cada uma para revisar o enunciado, a resposta selecionada, a resposta correta e uma explicação.

**Why this priority**: A revisão transforma o resultado em uma oportunidade de reforço do aprendizado.

**Independent Test**: Conferir as cinco questões e seus metadados; expandir e recolher cada questão individualmente e em conjunto.

**Acceptance Scenarios**:

1. **Given** a lista de questões, **When** a pessoa a consulta, **Then** encontra as cinco questões com título, categoria, tempo e resultado “Acertou”.
2. **Given** uma questão recolhida, **When** a pessoa a expande, **Then** vê detalhes fictícios coerentes com o tema, incluindo enunciado, resposta selecionada, resposta correta e explicação breve.
3. **Given** questões em qualquer combinação de estados, **When** a pessoa aciona “Expandir todas”, **Then** todos os detalhes ficam abertos; ao acionar “Recolher todas”, **Then** todos ficam fechados.

---

### User Story 3 - Escolher o próximo passo ou retornar (Priority: P2)

A pessoa usuária pode simular uma nova tentativa, consultar feedback demonstrativo ou sair da tela pelo botão de fechar ou pela tecla Escape.

**Why this priority**: Ações claras permitem continuar o estudo ou sair sem deixar dúvidas sobre o efeito dos controles.

**Independent Test**: Ativar cada ação e verificar o estado demonstrativo correspondente ou o retorno à tela anterior.

**Acceptance Scenarios**:

1. **Given** a tela de resultado, **When** a pessoa seleciona “Refazer Quiz”, **Then** a interface exibe uma confirmação demonstrativa de que uma nova tentativa está pronta, sem iniciar um quiz real.
2. **Given** a tela de resultado, **When** a pessoa seleciona “Ver Feedback Detalhado da IA”, **Then** vê um destaque de 100% de acertos, um ponto positivo sobre compreensão e a recomendação de avançar ou revisar em alguns dias.
3. **Given** a tela de resultado, **When** a pessoa seleciona fechar ou pressiona Escape, **Then** retorna à tela anterior.

### Edge Cases

- Em estado misto de expansão, a ação global deve permitir expandir todos; quando todos estiverem abertos, deve permitir recolher todos.
- Uma única pressão de Escape deve produzir apenas um retorno.
- O conteúdo demonstrativo não deve sugerir persistência de resultado nem geração real de feedback por IA.
- A expansão de uma questão não deve associar os detalhes a outra questão nem alterar o estado individual dos demais cards.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela MUST exibir o status “Módulo Concluído com Sucesso” e a mensagem “Desempenho Impecável!”.
- **FR-002**: A tela MUST apresentar aproveitamento de 100%, 5 de 5 questões corretas, +80 XP, precisão de 100%, tempo total de 2 minutos e 15 segundos e sequência de estudos de 12 dias.
- **FR-003**: A tela MUST listar as questões respondidas corretamente com seus títulos, categorias, tempos e resultado “Acertou”: Cálculo de Margem Operacional — Finanças Corporativas — 18 segundos; Interpretação do EBITDA / LAJIDA — Demonstrações Contábeis — 31 segundos; Ciclo Financeiro e Capital de Giro — Gestão de Tesouraria — 25 segundos; Análise DuPont: Decomposição do ROE — Estrutura de Capital — 39 segundos; WACC e Custo Médio Ponderado — Valuation & Risco — 22 segundos.
- **FR-004**: A pessoa MUST poder expandir e recolher cada questão independentemente e consultar enunciado, resposta selecionada, resposta correta e explicação breve coerentes com o título.
- **FR-005**: A pessoa MUST poder expandir todos os detalhes e recolhê-los em conjunto; o rótulo da ação MUST corresponder ao estado completo da lista.
- **FR-006**: A ação “Refazer Quiz” MUST exibir uma confirmação demonstrativa na própria tela de resultado, sem iniciar um quiz real nem depender de serviço de aprendizagem.
- **FR-007**: A ação “Ver Feedback Detalhado da IA” MUST exibir, em uma área da própria tela de resultado, feedback demonstrativo contendo destaque de 100% de acertos, ponto positivo sobre boa compreensão dos conceitos e recomendação de avançar para o próximo módulo ou revisar em alguns dias.
- **FR-008**: O botão de fechar e a tecla Escape MUST retornar à tela anterior.
- **FR-009**: A tela MUST usar layout de foco sem navegação lateral, com controle de fechar à esquerda, marca Sidebrain centralizada, sequência à direita, e rodapé com identificação do Sidebrain e instrução de retorno por Escape.
- **FR-010**: A tela MUST seguir a referência visual anexada: fundo claro lilás, cards brancos arredondados e sombras sutis; azul como cor principal, verde para acertos e tons dourados para XP e conquistas. Componentes compartilhados existentes MUST ser reutilizados sem alteração de aparência ou comportamento.
- **FR-011**: Os dados, detalhes de questões, feedback e respostas às ações MUST poder ser simulados localmente, sem integração com serviços reais de aprendizagem ou geração de feedback por IA.

### Key Entities *(include if feature involves data)*

- **Resultado da sessão**: status, mensagem, aproveitamento, acertos, total de questões, XP ganho, precisão, tempo total e sequência de estudos.
- **Questão respondida**: número, título, categoria, tempo utilizado, resultado, enunciado, resposta selecionada, resposta correta e explicação.
- **Feedback de desempenho**: destaque, ponto positivo e recomendação apresentados como conteúdo demonstrativo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Todos os indicadores e valores especificados (aproveitamento, acertos, XP, precisão, tempo e sequência) estão visíveis na tela de resultado.
- **SC-002**: As cinco questões aparecem com metadados corretos e cada uma pode ser expandida e recolhida independentemente.
- **SC-003**: Uma única ativação da ação global coloca todos os cinco detalhes no estado aberto ou fechado solicitado.
- **SC-004**: As quatro ações (refazer, consultar feedback, fechar e Escape) produzem o comportamento demonstrativo ou retorno previsto sem integração externa.
- **SC-005**: Em avaliação visual da tela desktop, status, desempenho, revisão das questões e ações finais são identificáveis conforme a composição da referência fornecida.

## Assumptions

- `SDB-[86]` corresponde à task Jira `SDB-86`; como não há MCP Jira disponível nesta sessão, o texto fornecido pelo usuário é a fonte de requisitos.
- A sessão exibida é fixa, local e demonstrativa; todas as cinco questões estão corretas.
- “Refazer Quiz” exibe uma confirmação demonstrativa na tela de resultado; não inicia um novo fluxo de perguntas.
- O feedback é conteúdo estático e não é gerado por IA, apesar do nome da ação.
- O retorno pressupõe uma tela anterior no histórico/contexto de navegação.
- O layout desktop é a referência principal; em telas menores, a hierarquia pode ser preservada com adaptação de disposição.
- A imagem fornecida na solicitação é a referência visual para a etapa de planejamento e implementação.
