# Pesquisa: Loading da Criação da Trilha

## Contexto confirmado

- Jira `SDB-42` corresponde à tela "Sidebrain - Loading ao criar trilha (Desktop)": selo "SÍNTESE COGNITIVA ATIVA", título "Construindo sua trilha...", barra "Progresso da geração" (78%, "Pronto em cerca de 4 segundos..."), 4 etapas concluídas com resumos e cartão "Dica do Sidebrain".
- A referência local [docs/img/Sidebrain - Loading ao criar trilha (Desktop).png](../../docs/img/Sidebrain%20-%20Loading%20ao%20criar%20trilha%20%28Desktop%29.png) é idêntica à imagem enviada.
- A base já tem o fluxo SDB-66 (`useTrailOnboarding`, `trailOnboardingApi.ts` com fallback `localStorage`, rotas `/trails/new/*` em `App.tsx`, `ProgressBar` e `StatusBadge` em `components/general`).
- Clarify definiu: timeout de travamento 2 min (FR-007/SC-006), redirecionamento automático (FR-006), retry como nova geração completa (FR-007), dicas em rotação (FR-005).

## Decisões

### Aquisição do progresso

**Decision:** polling `GET` do status da geração em intervalo curto, com watchdog no cliente: 2 minutos sem avanço de `progressPercent` ou de etapa = travamento (FR-007).

**Rationale:** não há infraestrutura de WebSocket/SSE no projeto; polling usa o padrão Axios existente, é testável e casa com gerações curtas (referência sugere ~20s totais). O watchdog implementa diretamente a decisão de clarify.

**Alternatives considered:** SSE/WebSocket (exigiria suporte do backend ainda desconhecido); progresso simulado no cliente (viola a premissa da spec de refletir a geração real).

### Gerenciamento de estado

**Decision:** hook dedicado `useTrailGeneration` (polling, loading/erro, watchdog, retry, retomada via `generationId` guardado), espelhando a API de `useTrailOnboarding`.

**Rationale:** convenção do projeto (hooks com responsabilidade única em `src/hooks`); evita misturar geração com onboarding.

**Alternatives considered:** estender `useTrailOnboarding` (mistura responsabilidades); Redux global (não há store no projeto e o escopo é local ao fluxo).

### Retomada após saída

**Decision:** persistir `generationId` (+ `trailId`) em `localStorage`; ao montar, buscar o status: `running` retoma o polling, `completed` redireciona para a trilha, `failed`/ausente oferece nova geração.

**Rationale:** implementa FR-008 com o mesmo mecanismo de rascunho da SDB-66; cobre fechar aba no meio do processo.

**Alternatives considered:** sem retomada (viola FR-008); guardar snapshot completo do progresso (desnecessário — o backend é a fonte da verdade).

### Retry

**Decision:** retry = `POST` nova geração com as mesmas escolhas (sem reenviar onboarding), descartando o `generationId` falho.

**Rationale:** implementa literalmente a decisão de clarify (opção A) e evita lógica de retomada parcial no backend.

**Alternatives considered:** retomar da etapa que falhou (exigiria checkpoint parcial no backend, fora do escopo decidido).

### Dicas em rotação

**Decision:** conjunto fixo local de dicas alternadas por timer com limpeza no unmount; o cartão nunca bloqueia o progresso (FR-005, US3 cenário 2).

**Rationale:** decisão de clarify (opção B) com escopo mínimo — sem endpoint de dicas nesta versão.

**Alternatives considered:** dica fixa única (rejeitada no clarify); buscar dicas do backend (sem contrato conhecido; futura evolução sem quebrar layout).

### Acessibilidade do progresso

**Decision:** barra com `role="progressbar"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax`; marcos (início, etapa concluída, conclusão/falha) anunciados em região `aria-live="polite"`; atualizações de percentual não anunciadas individualmente.

**Rationale:** atende FR-010 e SC-005 sem spam de leitores de tela; `ProgressBar` atual não expõe atributos a11y e precisará de extensão embrulhada.

**Alternatives considered:** anunciar cada percentual (polui leitor de tela); nenhum anúncio (viola FR-010).

### Visual e interação

**Decision:** reutilizar shell (Sidebar/HeaderBar), `ProgressBar`, `StatusBadge` e tokens de `App.css`/`index.css`; novos `GenerationStepList` e `StudyTipCard` no domínio `customer`; ícones lucide-react; respeitar `prefers-reduced-motion`.

**Rationale:** mesma linguagem da SDB-66 e fidelidade à referência; sem novas dependências.

**Alternatives considered:** biblioteca de animação (desnecessária para transições simples, como já decidido na SDB-66).

### Fallback sem backend

**Decision:** validar todo payload com type guard (`isTrailGenerationJob`); sem backend, simular localmente (+25% por poll, etapas com resumos fixos da referência, conclusão com `resultTrailId`).

**Rationale:** sem `VITE_API_URL`, o dev server responde HTML aos `GET`s e o `POST` dá 404; sem validação, lixo entra no estado e quebra a renderização. A simulação segue o precedente da SDB-66 (`defaultQuestions`) e permite demonstrar o fluxo completo.

**Alternatives considered:** só erro sem backend (impede demo da tela); aceitar qualquer payload (quebra a página).

### Constituição e validação

**Decision:** gate constitucional aprovado (constituição v1.0.0 ratificada; plano segue os 5 princípios). Validar com `npm run lint`, `npm run build` e os cenários do quickstart.

**Rationale:** sem framework de testes no repositório; gates executáveis existentes + cenários manuais.

**Alternatives considered:** inventar exigência de testes automatizados (não verificável neste repositório).
