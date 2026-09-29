# Feature Specification: Loading da Criação da Trilha

**Feature Branch**: `SDB-42-trail-creation-loading`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "SDB-42"

**Visual Reference**: `docs/img/Sidebrain - Loading ao criar trilha (Desktop).png`

## Clarifications

### Session 2026-09-23

- Q: Qual é o tempo máximo que o usuário deve esperar antes de o sistema considerar a geração travada e oferecer uma saída? → A: 2 minutos (opção B).
- Q: Quando a geração termina, o usuário deve ir direto para a trilha ou ver antes uma confirmação de conclusão? → A: Redirecionamento automático imediato, sem tela intermediária (opção A, confirma FR-006).
- Q: Quando a geração falha e o usuário tenta novamente, a geração recomeça do zero ou continua de onde parou? → A: Recomeça do zero mantendo as escolhas e dados já informados (opção A).
- Q: A dica exibida durante a espera é sempre a mesma ou alterna entre várias dicas? → A: Rotativa, alternando entre várias dicas (opção B).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompanhar a geração da trilha (Priority: P1)

O usuário confirmou a criação da trilha e cai em uma tela de espera ativa ("Construindo sua trilha..."). Ele precisa entender que o sistema está trabalhando, quanto já avançou (percentual) e quanto falta (estimativa de tempo), sem precisar recarregar ou adivinhar se algo travou.

**Why this priority**: É o primeiro contato do usuário com a geração por IA; uma espera opaca gera abandono. Dar visibilidade do progresso mantém confiança e reduz a percepção de espera.

**Independent Test**: Ao iniciar a geração, o usuário vê o indicador de progresso avançar de 0 a 100%, com percentual e estimativa de tempo visíveis, até a transição automática para a trilha pronta.

**Acceptance Scenarios**:

1. **Given** o usuário confirmou a criação da trilha, **When** a geração inicia, **Then** o sistema exibe o título "Construindo sua trilha...", o selo "SÍNTESE COGNITIVA ATIVA" e a barra de "Progresso da geração" com percentual.
2. **Given** a geração está em andamento, **When** o progresso avança, **Then** o percentual e a estimativa ("Pronto em cerca de X segundos...") são atualizados de forma contínua.
3. **Given** a geração foi concluída, **When** o progresso atinge 100%, **Then** o sistema leva o usuário automaticamente para a trilha criada, sem exigir clique adicional.

---

### User Story 2 - Entender o que está sendo gerado (Priority: P2)

Enquanto aguarda, o usuário quer saber quais etapas compõem a geração (análise do nível, estruturação da grade, explicações e quizzes) e o resultado resumido de cada etapa concluída, para criar expectativa correta sobre o que vai receber.

**Why this priority**: Transparência sobre as etapas aumenta a percepção de valor da trilha personalizada e prepara o usuário para o conteúdo que virá.

**Independent Test**: Durante a geração, o usuário vê a lista de etapas sendo marcadas como concluídas, cada uma com um resumo (ex: "Módulos 1 a 4 mapeados", "24 cartões e quizzes prontos").

**Acceptance Scenarios**:

1. **Given** a geração está em andamento, **When** uma etapa é concluída, **Then** ela aparece marcada com o resumo do que foi produzido.
2. **Given** o usuário observa a lista de etapas, **When** ele lê cada item, **Then** ele entende, em linguagem acessível, o que foi analisado, estruturado e criado para a sua trilha.

---

### User Story 3 - Receber uma dica durante a espera (Priority: P3)

Enquanto a trilha é gerada, o usuário vê um cartão "Dica do Sidebrain" com uma orientação curta de estudo, tornando a espera útil em vez de tempo perdido.

**Why this priority**: Microconteúdo educativo reduz a ansiedade da espera e reforça o posicionamento da plataforma como guia de aprendizado.

**Independent Test**: Durante a geração, um cartão de dica visível apresenta um conselho prático de estudo relacionado a retenção ou hábito de aprendizado.

**Acceptance Scenarios**:

1. **Given** a tela de loading está visível, **When** o usuário rola/lê o conteúdo, **Then** o cartão "Dica do Sidebrain" exibe um conselho curto e acionável.
2. **Given** a geração termina, **When** ocorre a transição para a trilha, **Then** a dica não bloqueia nem atrasa a navegação.

---

### Edge Cases

- O que acontece quando a geração falha (erro do serviço)? O usuário vê mensagem clara com opção de tentar novamente sem perder as escolhas anteriores?
- O que acontece quando o usuário fecha a aba ou sai da tela no meio da geração? Ao retornar, ele retoma o progresso, vê a trilha pronta ou reinicia?
- Se o progresso ficar parado por 2 minutos, o sistema considera a geração travada e exibe mensagem com alternativa (ver FR-007).
- O que acontece quando a geração conclui mas não há conteúdo válido para exibir? O usuário é informado em vez de cair em tela vazia?
- Como leitores de tela anunciam o avanço do progresso sem sobrecarregar o usuário com atualizações excessivas?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir a tela de loading imediatamente após a confirmação da criação da trilha, com título, selo de síntese ativa e descrição do que está acontecendo.
- **FR-002**: O sistema MUST apresentar o progresso da geração em percentual visível e atualizado durante o processamento.
- **FR-003**: O sistema MUST exibir uma estimativa de tempo restante em linguagem acessível enquanto a geração estiver em andamento.
- **FR-004**: O sistema MUST listar as etapas da geração (análise do nível de conhecimento, estruturação da grade curricular, síntese de explicações e exemplos, criação do banco de quizzes) com estado de conclusão e resumo do resultado de cada uma.
- **FR-005**: O sistema MUST exibir dicas educativas em rotação no cartão "Dica do Sidebrain" durante a espera, alternando automaticamente entre mais de uma dica, sem bloquear a visualização do progresso.
- **FR-006**: O sistema MUST redirecionar automaticamente o usuário para a trilha criada ao concluir a geração, sem exigir ação manual.
- **FR-007**: O sistema MUST tratar falha na geração com mensagem compreensível e opção de tentar novamente iniciando uma nova geração completa, preservando as escolhas e dados já informados. Se o progresso ficar parado por 2 minutos, o sistema MUST considerar a geração travada e exibir a mensagem com alternativa.
- **FR-008**: O sistema MUST permitir que o usuário que saiu no meio da geração retome de onde parou ou acesse a trilha pronta ao retornar, sem reiniciar o processo do zero quando houver resultado válido.
- **FR-009**: O sistema MUST manter a navegação principal (sidebar, busca, indicadores de XP) visível e consistente durante o loading, seguindo o layout padrão da plataforma.
- **FR-010**: O sistema MUST comunicar o progresso de forma acessível a tecnologias assistivas, anunciando marcos (início, etapas concluídas, conclusão) sem spam de atualizações.

### Key Entities *(include if feature involves data)*

- **Geração da trilha**: Processo de criação personalizada com progresso percentual, estimativa de tempo, estado (em andamento, concluída, falha) e referência à trilha resultante.
- **Etapa de síntese**: Unidade do processo (análise de nível, grade curricular, explicações, quizzes), cada uma com estado e resumo do que foi produzido.
- **Dica educativa**: Conteúdo curto de orientação de estudo exibido durante a espera.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 95% dos usuários que iniciam a geração chegam à trilha criada sem abandonar a tela de espera.
- **SC-002**: Usuários conseguem dizer, após a espera, quais etapas foram executadas (pontuação mínima de 80% de recordação em teste de usabilidade).
- **SC-003**: Em caso de falha, pelo menos 90% dos usuários conseguem concluir a geração após usar a opção de tentar novamente, sem refazer as escolhas iniciais.
- **SC-004**: A maioria dos usuários reporta que o tempo de espera pareceu curto ou aceitável após ver o progresso e a dica.
- **SC-005**: Usuários de leitor de tela conseguem acompanhar início, conclusão das etapas e redirecionamento final sem ajuda externa.
- **SC-006**: Nenhum usuário aguarda mais de 2 minutos sem ver atualização de progresso ou alternativa visível.

## Assumptions

- A descrição da task SDB-42 no Jira não pôde ser consultada (MCP do Jira indisponível nesta sessão); a especificação foi derivada da imagem enviada e da referência em `docs/img/Sidebrain - Loading ao criar trilha (Desktop).png`, que são idênticas.
- O backend informa o progresso da geração de forma incremental; o frontend apenas reflete esse progresso.
- O usuário está autenticado e chega a esta tela a partir da confirmação de criação (fluxo "Criar trilha com IA").
- Ao concluir, o destino é a página da trilha criada (referência "Sidebrain - Página da trilha (Desktop).png").
- As dicas do cartão "Dica do Sidebrain" são um conjunto fixo de conselhos curtos que se alternam durante a espera; personalização das dicas por perfil está fora do escopo.
- As quatro etapas listadas são fixas para esta versão; novas etapas futuras não quebram o layout da lista.
- O layout segue o padrão da plataforma (sidebar, header com busca/XP/streak, card do usuário) e o Figma de referência para fidelidade pixel a pixel.
