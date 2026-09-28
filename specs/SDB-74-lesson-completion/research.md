# Research: Conclusão da Lição

## Decisão 1 — Animações de interface

**Decision**: Adotar o pacote `motion`, com os componentes e hooks React importados de `motion/react`. Respeitar a preferência do sistema por movimento reduzido e manter o conteúdo acessível mesmo se a animação não for executada.

**Rationale**: O requisito pede a biblioteca Motion (antigo Framer Motion). A documentação oficial atual trata Motion for React como sucessora e publica os imports React no caminho `motion/react`. Variantes permitem compor a entrada do card central, do ícone e o escalonamento dos cards de métricas. A configuração de movimento reduzido é necessária para acessibilidade e não deve remover estados informativos.

**Alternatives considered**:
- `framer-motion`: nome legado da biblioteca; não é a escolha para código novo quando a documentação atual recomenda `motion`.
- Animações CSS próprias: evitariam uma dependência, mas não atendem ao requisito explícito de utilizar Motion para animação e interação.

**References**:
- https://motion.dev/docs/react
- https://motion.dev/docs/stagger
- https://motion.dev/docs/react-accessibility
- https://motion.dev/docs/react-motion-config

**Limitation**: O MCP Context7 não está disponível na sessão. A pesquisa foi feita na documentação oficial pública; confirmar a versão publicada e peer dependencies do pacote no momento de instalar.

## Decisão 2 — Tailwind CSS e Vite

**Decision**: Adotar Tailwind CSS 4 com o plugin oficial `@tailwindcss/vite`, mantendo a configuração React existente. Inicializar tema e utilitários no CSS de entrada e omitir Preflight na adoção inicial para evitar um reset global inesperado; não migrar as telas existentes nesta feature.

**Rationale**: O pedido da task determina utilitários Tailwind e o projeto usa Vite 8. A integração atual recomendada pelo Tailwind para Vite é seu plugin dedicado. O app já concentra estilos antigos em `src/App.css` e `src/index.css`; aplicar Preflight ou reorganizar toda a cascata poderia alterar páginas não relacionadas. Tokens do novo design devem ser limitados aos valores reutilizados pela tela.

**Alternatives considered**:
- Tailwind v3 via PostCSS: não escolhida porque a documentação atual recomenda o plugin Vite para v4 e não há configuração PostCSS no projeto.
- Continuar somente com CSS próprio: rejeitada porque a solicitação exige Tailwind; CSS customizado fica reservado a casos em que utilitários não expressem o comportamento adequadamente.
- Migrar `App.css` por completo: rejeitada por ampliar o escopo e elevar o risco de regressões visuais.

**References**:
- https://tailwindcss.com/docs/installation/using-vite
- https://tailwindcss.com/docs/upgrade-guide
- https://tailwindcss.com/docs/preflight
- https://tailwindcss.com/docs/theme

**Limitation**: O MCP Context7 não está disponível nesta sessão. Foi usada a documentação oficial do Tailwind acessível pela web; verificar a versão e compatibilidade publicadas no momento da instalação. Tailwind v4 requer navegadores modernos; a cobertura exata suportada pelo produto ainda não está documentada.

## Decisão 3 — Fonte de dados e persistência de XP

**Decision**: Usar fixture mockada atrás de módulo de serviço tipado nesta entrega. Manter leitura do resultado e sincronização de recompensas substituíveis, mas não inventar um endpoint nem apresentar persistência mock como confirmação de backend.

**Rationale**: A descrição fornece um objeto mock e indica substituição por API quando ela estiver disponível. A inspeção encontrou `src/api/api.ts` e exemplos de módulos API, mas nenhum endpoint, tipo, fluxo de conclusão de lição ou sincronização de recompensas. Uma fronteira de serviço evita acoplar componentes ao mock; o estado de falha/retry pode ser validado sem alegar salvamento real.

**Alternatives considered**:
- Reutilizar `useQuizResult`/`quizResult.ts`: rejeitada porque representa resultado de quiz e campos diferentes, podendo misturar semânticas de tentativa e recompensa.
- Chamar uma URL presumida para XP: rejeitada porque nenhum contrato HTTP ou endpoint foi fornecido.

## Decisão 4 — Rota e destinos de navegação

**Decision**: Manter a tela como página/componente do domínio `lessons`, com handlers de navegação injetáveis; não codificar URLs de próxima lição ou perfil até que esses destinos existam. Não publicar uma rota sem autenticação real.

**Rationale**: `src/App.tsx` tem rotas para dashboard, onboarding, quiz e resultado de quiz, mas não tem fluxo ou rota de lição, próxima lição, perfil ou guard. O dashboard está em `/`; demais caminhos nomeados na especificação ainda não podem ser resolvidos a páginas existentes.

**Alternatives considered**:
- Reaproveitar `/quiz-result`: rejeitada porque essa tela é resultado de quiz, com outra finalidade, dados e ações.
- Criar guard baseado em presença presumida de token/localStorage: rejeitada por inventar um modelo de autenticação e fornecer falsa garantia de proteção.
- Mandar todos os destinos ausentes para `/`: rejeitada porque aparentaria sucesso, mas levaria ao dashboard em vez da lição/perfil solicitados.

**Dependency**: A plataforma deve fornecer o guard real e os destinos das ações antes da integração de rota navegável.

## Decisão 5 — Validação

**Decision**: Usar os comandos `npm run lint` e `npm run build`, mais cenários manuais documentados em `quickstart.md`.

**Rationale**: O `package.json` define lint e build, mas não contém runner ou framework de testes automatizados. O roteiro manual deve cobrir os critérios funcionais e responsivos explicitados na especificação.

**Alternatives considered**:
- Adicionar um framework de testes nesta feature: não necessário para definir o plano; aumentaria o escopo e a dependência de teste não está na stack instalada.

## Inspeção de design

**Decision**: Usar `docs/img/Sidebrain - Lição Concluída (Desktop).png` como referência disponível para desktop e compor adaptações responsivas sem alterar hierarquia ou semântica.

**Limitation**: O MCP Figma não está disponível nesta sessão; valores pixel-perfect não foram confirmados pelo arquivo Figma. A implementação deve registrar essa limitação e validar com o asset local.
