# Pesquisa: Página de Detalhes da Trilha

## Decisão 1 — Estrutura e roteamento

**Decision**: Organizar a feature no domínio `customer`, usando a rota React Router `/trails/:slug` quando houver proteção confiável. Manter o caminho visual em português no breadcrumb; não criar `/trilhas/[slug]` como se o projeto fosse Next.js.

**Rationale**: `src/App.tsx` usa React Router 7 e as rotas de trilha existentes seguem `/trails/...`. A estrutura atual separa páginas em `src/pages/customer` e componentes correspondentes em `src/components/customer`. A rota de trilha individual e o guard real não existem.

**Alternatives considered**:
- Criar rota Next.js `/trilhas/[slug]`: rejeitada porque o projeto é SPA Vite com React Router.
- Publicar diretamente `/trails/:slug`: rejeitada até existir autenticação/guard real, conforme princípio II da constituição.

**Dependency**: Integração em `App.tsx` deve aguardar um guard privado fornecido pela aplicação.

## Decisão 2 — Animação, acessibilidade e preferência de movimento

**Decision**: Reutilizar Motion for React por `motion/react`, incluindo `AnimatePresence` para expansão/recolhimento e entrada gradual da lista. Respeitar redução de movimento e oferecer também feedback por estados semânticos e foco de teclado.

**Rationale**: `motion` já é dependência e `LessonPage` já utiliza `motion/react` e `useReducedMotion`. Evitar adicionar biblioteca ou duplicar estratégia de animação.

**Alternatives considered**:
- Adicionar `framer-motion`: rejeitada porque o pacote Motion atual já está instalado.
- Implementar todas as transições apenas em CSS: rejeitada porque o requisito pede Motion para interações e presença animada.

**Acessibilidade**: Usar `useReducedMotion()` como nas telas de lição; manter expansão por botão com `aria-expanded`, `aria-controls` e id estável do painel. Quando a lista é condicional, `AnimatePresence` deve permanecer montado e os filhos animados precisam de `key` estável. A mudança visual não pode ser o único anúncio de estado.

**Limitation**: O MCP Context7 não está disponível; não foi necessária consulta externa, pois a dependência instalada e seu padrão de uso são verificados no próprio repositório.

## Decisão 3 — Estilização e tokens

**Decision**: Usar classes utilitárias Tailwind CSS 4, já integrado via plugin Vite; reutilizar tokens globais existentes e adicionar tokens de estado apenas se não houver equivalente.

**Rationale**: `package.json`, `vite.config.ts`, `tailwind.config.js` e `src/index.css` já mostram Tailwind v4 e tokens de cor (`track-*`, `completion-*`). O requisito não justifica reinstalação ou migração global.

**Alternatives considered**:
- Adicionar Tailwind v3 ou outro plugin: rejeitada porque duplicaria configuração existente.
- Criar CSS global específico para a página: rejeitada em favor de utilitários e tokens de tema já adotados.

**Skeleton responsivo**: Espelhar as regiões de conteúdo reais e usar `aria-busy`, status acessível, elementos decorativos ocultos da árvore acessível e `motion-reduce:animate-none`, conforme `src/components/customer/lesson/LessonLoading.tsx`.

## Decisão 4 — Fixture, fonte de dados e divergência de missão

**Decision**: Manter os tipos e fixture mockados atrás de `trackService.ts`, expondo o estado inicial de carregamento pelo hook. Mostrar as contagens e o percentual fornecidos para uma missão; quando divergirem, indicar explicitamente a inconsistência. Percentuais visuais devem ser limitados a 0–100 sem apagar os valores de origem.

**Rationale**: A spec entrega os dados demonstrativos e esclarece como apresentar a divergência “0 de 5” e “67%”. Não há endpoint de detalhes de trilha estabelecido. A fronteira de serviço permite substituir a fixture no futuro sem acoplar os componentes à origem.

**Alternatives considered**:
- Corrigir ou recalcular percentuais mockados silenciosamente: rejeitada por contrariar a clarificação do usuário e esconder dados fornecidos.
- Chamar endpoint presumido: rejeitada porque contrato/endereço não foram fornecidos.

**Integration rule**: Quando houver API, usar exclusivamente a instância central `src/api/api.ts`.

## Decisão 5 — Navegação entre trilha, lições e missões

**Decision**: Usar as âncoras `/#tracks` e `/#missions` para levar, respectivamente, à listagem e às missões existentes no dashboard; iniciar e revisar lições usando `/lessons/:id` e passando o caminho de origem para retorno.

**Rationale**: `src/App.tsx` já registra `/lessons/:id`, e `LessonPage` preserva o caminho `from`. O app não registra páginas dedicadas para listagem de trilhas ou Missões & Badges, mas `HomeDashboardPage` exibe `TracksSection`, `MissionsSection` e `BadgesSection`. Âncoras nos componentes existentes evitam destinos fictícios e não exigem criar uma página nova.

**Alternatives considered**:
- Apontar Missões & Badges para uma rota presumida `/missions`: rejeitada porque o fallback atual manda rotas desconhecidas para `/`, aparentando navegação com destino incorreto.
- Criar nova página de missões dentro desta feature: rejeitada por ampliar escopo além da página da trilha.

**Dependency**: A proteção da rota de detalhes permanece sujeita ao guard real. As âncoras devem apontar para elementos existentes e permanecer utilizáveis em navegação direta.

## Decisão 6 — Validação

**Decision**: Executar `npm run lint` e `npm run build`; validar manualmente expansão, navegação, estados de acesso, progresso, skeleton, teclado, redução de movimento e tamanhos desktop/tablet/mobile.

**Rationale**: Os scripts lint/build estão configurados no `package.json`, mas não há runner de testes automatizados na configuração encontrada.

**Alternatives considered**:
- Introduzir framework de testes automatizados agora: não necessário para fechar desenho e acrescentaria dependências fora do escopo.

## Inspeção visual

**Decision**: Usar `docs/img/Sidebrain - Página da trilha (Desktop).png` como referência para hierarquia, cores, densidade e duas colunas; adaptar para coluna única em telas estreitas.

**Limitation/Gate**: Jira MCP, Figma MCP e Context7 não estão disponíveis. A tentativa de abrir o arquivo Figma no navegador apresentou uma solicitação de cadastro/login; portanto, o frame e suas medidas ainda não foram inspecionados. A imagem local orienta a análise inicial, mas não substitui o requisito constitucional de consultar o Figma: tarefas de CSS/Tailwind ficam bloqueadas até que o acesso seja fornecido. A referência local é `docs/img/Sidebrain - Página da trilha (Desktop).png`.
