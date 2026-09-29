# Feature Specification: Configuração inicial da trilha

**Feature Branch**: `SDB-66-trail-start-preference`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "SDB-66"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escolha do início da trilha (Priority: P1)

O usuário entra no fluxo de onboarding e precisa decidir como deseja começar sua trilha de aprendizado. O sistema apresenta duas formas de iniciar: uma recomendada pela IA, com diagnóstico rápido e adaptação dinâmica; e outra com foco em progresso passo a passo, com base em fundamentos essenciais.

**Why this priority**: Esta decisão define a experiência inicial da jornada de aprendizado e impacta diretamente a percepção de clareza, confiança e progresso do usuário no início da plataforma.

**Independent Test**: O usuário consegue visualizar as duas opções, entender a diferença entre elas e prosseguir com a escolha que melhor representa seu objetivo de aprendizado.

**Acceptance Scenarios**:

1. **Given** o usuário está no passo de configuração da trilha, **When** ele visualiza as opções de início, **Then** ele consegue comparar claramente o valor de cada caminho antes de decidir.
2. **Given** o usuário escolhe a opção recomendada pela IA, **When** confirma a seleção, **Then** o sistema registra a preferência e avança para o próximo estágio do onboarding.
3. **Given** o usuário escolhe a opção de passo a passo, **When** confirma a seleção, **Then** o sistema registra a preferência e oferece uma jornada mais guiada e gradual.

---

### User Story 2 - Diagnóstico rápido do nível do usuário (Priority: P2)

O usuário deseja iniciar com uma recomendação personalizada, sem precisar definir manualmente todos os detalhes da trilha. O sistema oferece um caminho de diagnóstico rápido para ajustar a experiência de aprendizagem à realidade do aluno.

**Why this priority**: Para muitos usuários, a rapidez e a personalização inicial são decisivas para manter engajamento e reduzir a fricção na primeira interação com a plataforma.

**Independent Test**: Usuários que preferem respostas imediatas conseguem iniciar a trilha com recomendações automatizadas e entender qual será o próximo passo.

**Acceptance Scenarios**:

1. **Given** o usuário escolhe a opção recomendada pela IA, **When** ele avança para o diagnóstico, **Then** o sistema apresenta o fluxo de perguntas adaptativas e informa que a recomendação será personalizada.
2. **Given** o usuário conclui o diagnóstico inicial, **When** o processo termina, **Then** a trilha sugerida é ajustada com base nas respostas e no nível de conhecimento informado.

---

### User Story 3 - Ajuste de preferências após o início (Priority: P3)

O usuário pode alterar ou ajustar a forma de iniciar a trilha depois de visualizar as opções iniciais, sem perder o progresso já realizado ou criar confusão na jornada.

**Why this priority**: A flexibilidade para ajustar a rota de aprendizagem aumenta a confiança do usuário e reduz a sensação de compromisso irrevogável na primeira etapa.

**Independent Test**: O usuário consegue rever a escolha, retornar ao ajuste inicial e alterar a configuração sem interromper o fluxo principal.

**Acceptance Scenarios**:

1. **Given** o usuário já definiu a forma de iniciar, **When** ele acessa a configuração novamente, **Then** o sistema exibe a escolha atual com possibilidade de alteração.
2. **Given** o usuário modifica a preferência inicial, **When** confirma a mudança, **Then** o sistema reaplica a configuração atualizada na experiência de aprendizagem.

---

### Edge Cases

- O que acontece quando o usuário fecha o fluxo de onboarding antes de concluir a seleção?
- Como o sistema lida com uma escolha em branco ou sem confirmação explícita?
- O que acontece quando o usuário tenta alterar a preferência depois de iniciar a trilha?
- Como a plataforma representa uma opção de caminho mais guiado para usuários iniciantes ou com menor autonomia?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST apresentar, no início da jornada, pelo menos duas formas de iniciar a trilha com descrições claras e comparáveis.
- **FR-002**: O sistema MUST permitir que o usuário escolha entre a opção recomendada pela IA e a opção de progresso passo a passo.
- **FR-003**: O sistema MUST informar, em linguagem acessível, a diferença entre os dois caminhos em termos de velocidade, personalização e profundidade da instrução.
- **FR-004**: O sistema MUST registrar a preferência escolhida e usá-la para orientar a próxima etapa do onboarding e da trilha recomendada.
- **FR-005**: O sistema MUST permitir que o usuário avance após confirmar a escolha, sem exigir uma etapa adicional desnecessária.
- **FR-006**: O sistema MUST oferecer um fluxo de diagnóstico rápido para usuários que optarem pela recomendação personalizada pela IA.
- **FR-007**: O sistema MUST disponibilizar uma alternativa acessível para usuários que preferem iniciar com base em fundamentos essenciais e evolução gradual.
- **FR-008**: O sistema MUST permitir revisão e ajuste da escolha inicial sem quebrar ou reiniciar a jornada principal.
- **FR-009**: O sistema MUST manter a experiência coerente e intuitiva em telas de escolha, confirmação e retomada de configuração.

### Key Entities *(include if feature involves data)*

- **Usuário**: Representa a pessoa que inicia a jornada de aprendizado e decide como a trilha deve começar.
- **Preferência de início**: Define se a jornada será guiada por recomendação automática ou por um caminho gradual e sequencial.
- **Diagnóstico inicial**: Conjunto de respostas ou sinais usados para personalizar a trilha recomendada pela IA.
- **Trilha recomendada**: Estrutura de aprendizado adaptada ao perfil, objetivo e nível inicial do usuário.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No mínimo 90% dos usuários conseguem identificar e confirmar a opção de início da trilha sem ajuda externa.
- **SC-002**: Usuários que escolhem a opção recomendada pela IA conseguem avançar para o próximo passo em menos de 2 minutos em média.
- **SC-003**: A preferência inicial é registrada corretamente em pelo menos 99% dos fluxos concluídos.
- **SC-004**: A maioria dos usuários reporta que o caminho de início da trilha ficou claro e fácil de entender após a primeira interação.
- **SC-005**: A mudança de preferência inicial, quando realizada, mantém o progresso e a continuidade da jornada sem interrupções relevantes.

## Assumptions

- O usuário está em um estágio inicial de uso da plataforma e ainda não definiu seu caminho de aprendizagem com grande profundidade.
- A experiência deve ser clara para usuários com diferentes níveis de familiaridade com educação digital e autocuidado profissional.
- A plataforma já possui a estrutura básica de trilhas, perfil e onboarding, e esta tela atua como etapa inicial de decisão.
- A opção recomendada pela IA deve ser apresentada como um caminho personalizado, mas sem exigir que o usuário compreenda a lógica técnica por trás do sistema.
- O fluxo de diagnóstico rápido é opcional para a jornada, mas deve permanecer acessível e bem explicado para quem optar por esse caminho.
