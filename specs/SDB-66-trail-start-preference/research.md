# Pesquisa: Configuração inicial da trilha

## Contexto confirmado

- Jira `SDB-66` descreve a página “Sidebrain - Teste de Nivelamento (Desktop)”, com as opções “Diagnóstico Rápido com IA” e “Começar do zero”.
- A referência local [docs/img/Sidebrain - Teste de Nivelamento (Desktop).png](../../docs/img/Sidebrain%20-%20Teste%20de%20Nivelamento%20%28Desktop%29.png) mostra a etapa 2 de 3, barra de progresso, cards azul/dourado, CTAs e mensagem de ajuste posterior.
- A base atual renderiza apenas a dashboard em `App.tsx`; React Router, Redux e Axios estão instalados, mas ainda não há rotas, store ou endpoints consumidores.

## Decisões

### Estado e navegação

**Decision:** criar um hook `useTrailOnboarding` com estado local controlado e rotas explícitas `/trails/new/start` e `/trails/new/assessment`.

**Rationale:** mantém a responsabilidade do fluxo em um único hook, atende retomada/revisão e prepara a integração com React Router sem espalhar handlers pela UI.

**Alternatives considered:** colocar a seleção diretamente na página (dificulta retomada e teste); Redux global (não há store no projeto e o escopo é local ao onboarding).

### Persistência

**Decision:** persistir confirmação via endpoint de onboarding usando `src/api/api.ts`; guardar um rascunho local apenas para recuperar uma seleção não confirmada e limpar o rascunho após sucesso.

**Rationale:** a preferência precisa sobreviver entre telas e ser aplicada à trilha, enquanto o fallback permite a tela ser validada antes da disponibilidade do backend.

**Alternatives considered:** depender apenas de `localStorage` (não registra a preferência no servidor); bloquear a confirmação sem API (impede validação end-to-end do frontend).

### Diagnóstico

**Decision:** o frontend consome perguntas do backend e renderiza quatro perguntas adaptativas; respostas e conclusão seguem o contrato documentado. A regra de pontuação e a montagem da trilha permanecem no backend.

**Rationale:** evita duplicar lógica de recomendação no cliente e corresponde à descrição do Jira de quatro perguntas e personalização automática.

**Alternatives considered:** hardcode de perguntas e pontuação no frontend (frágil e não adaptativo); implementar algoritmo de recomendação local (fora do escopo da tela).

### Visual e interação

**Decision:** reutilizar shell/sidebar da dashboard, lucide-react para ícones e transições CSS para elevação, borda, hover e compressão de CTAs; respeitar foco visível e `prefers-reduced-motion`.

**Rationale:** preserva a linguagem existente e cobre as microinterações descritas no Jira sem adicionar uma biblioteca de animação que não está nas dependências.

**Alternatives considered:** adicionar Motion (não é dependência atual e não é necessário para as transições simples); desenhar SVGs próprios (redundante com lucide-react).

### Constituição e validação

**Decision:** considerar o gate constitucional aprovado, registrando que o arquivo de constituição ainda contém placeholders. Validar com `npm run lint`, `npm run build` e os cenários do quickstart.

**Rationale:** não há princípio ratificado que imponha outro processo; os comandos existentes são os gates executáveis do projeto.

**Alternatives considered:** inventar exigências de TDD ou testes de contrato sem framework instalado (não verificável neste repositório).