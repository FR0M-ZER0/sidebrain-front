# Research: Página de Leitura da Lição

**Date**: 2026-09-25
**Feature**: [spec.md](spec.md)

## Decisões

### Navegação e organização

- **Decision**: Integrar a tela no React Router existente com `/lessons/:id`, em `src/pages/customer`, usando componentes isolados em `src/components/customer/lesson`.
- **Rationale**: O repositório é uma SPA Vite + React Router; não há Next.js nem convenção `app/...`. A organização segue `docs/architecture.md` e `docs/code_conventions.md`.
- **Alternatives considered**: Criar `app/lessons/[id]/page.tsx` (não compatível com o runtime presente); adicionar o domínio raiz `lessons` (menos consistente com as páginas existentes de aluno em `customer`).

### Tailwind CSS e tokens

- **Decision**: Adotar Tailwind CSS 3.4, com configuração `tailwind.config.js`, tokens de cores do design e classes utilitárias. Adicionar Tailwind, PostCSS e Autoprefixer como dependências de desenvolvimento e ligar as diretivas à folha global.
- **Rationale**: O projeto não possui Tailwind instalado. A especificação da task pede explicitamente `tailwind.config.js` e tokens configurados nesse arquivo; Tailwind 3.4 documenta esse fluxo de configuração e a integração com Vite.
- **Alternatives considered**: Tailwind 4.x via plugin oficial do Vite e variáveis `@theme`; é a instalação recomendada na documentação atual, mas não corresponde ao requisito explícito de centralizar a configuração em `tailwind.config.js`. CSS isolado manteria o estado atual, mas contrariaria a solicitação da task.
- **Referências**: [Tailwind CSS v3 — Vite](https://v3.tailwindcss.com/docs/guides/vite), [Tailwind CSS v3 — Configuration](https://v3.tailwindcss.com/docs/configuration). A documentação atual também descreve a integração v4: [Tailwind CSS — Vite](https://tailwindcss.com/docs/installation/using-vite).

### Animações

- **Decision**: Adotar `motion` e importar a API React de `motion/react`; limitar animações à entrada/transição do conteúdo, barra de progresso, feedback dos controles e diálogo de saída. Respeitar a preferência de movimento reduzido.
- **Rationale**: A task pede a biblioteca Motion (anteriormente Framer Motion), e a documentação oficial confirma compatibilidade com React 18.2+, Vite e classes Tailwind.
- **Alternatives considered**: Transições CSS para todos os casos (não atendem a presença/transição de conteúdo de forma uniforme); Framer Motion com pacote/import antigo (não é o nome/import atual indicado pela documentação).
- **Referências**: [Motion for React — Installation](https://motion.dev/docs/react-installation), [Motion for React — Motion component](https://motion.dev/docs/react-motion-component).

### Fonte de dados da lição

- **Decision**: Definir `lessonsApi.ts` como adaptador mockado por `lessonId`; manter a forma dos dados compatível com a especificação e trocar a implementação por chamada à API somente quando o endpoint existir. HTTP futuro usa `src/api/api.ts`.
- **Rationale**: A task fornece mock e instrução para substituir a fonte ao existir API, mas não define endpoint. A inspeção de `src/api` não encontrou integração de lições.
- **Alternatives considered**: Fazer fetch direto no componente (viola a arquitetura/API centralizada); inventar endpoint agora (sem contrato backend para validar); manter o mock diretamente dentro da página (dificulta tratamento consistente de loading/erro e substituição da fonte).

### Proteção da rota e destinos

- **Decision**: Exigir que `/lessons/:id` seja registrada sob `PrivateRoute`; tratar a disponibilidade de um guard e de uma fonte real de autenticação como pré-requisito. Breadcrumbs só serão links quando receberem destino válido; não inventar rotas de curso/módulo que a aplicação ainda não oferece.
- **Rationale**: A constituição exige rotas privadas, mas a inspeção atual não encontrou `PrivateRoute`, store de autenticação ou páginas de curso/módulo. A UI deve manter texto conhecido sem produzir links quebrados.
- **Alternatives considered**: Deixar rota pública até a auth existir (viola a constituição); inferir autenticação por token arbitrário no browser (sem contrato e inseguro); criar destinos vazios para todos os breadcrumbs (navegação inválida).
- **Impacto**: A feature pode ser construída e validada visualmente com mock, mas o registro acessível da rota em ambiente integrado depende do guard e da configuração de destinos fornecidos pelo produto.

### Contratos de interface

- **Decision**: Documentar um contrato de UI e dados de página em `contracts/lesson-page.md`; não criar contrato HTTP de servidor ainda.
- **Rationale**: A entrega é frontend interno, com forma de dados mockada e nenhum endpoint público de lição conhecido.
- **Alternatives considered**: OpenAPI inventado sem serviço correspondente (não verificável); omitir contrato de UI (torna ambígua a adaptação mock/API).

## Ferramentas e documentação

- Os MCPs Context7, Jira e Figma não estão disponíveis nesta sessão. Para escolhas técnicas, foram consultadas as páginas oficiais do Tailwind e Motion listadas acima. A referência visual foi fornecida na task e sua imagem local está identificada em `docs/img/Sidebrain - Tela da lição (Desktop).png`.
- Não foram encontrados framework de testes automatizados, Tailwind, Motion, `Layout.tsx`, `PrivateRoute` ou implementação de autenticação no código inspecionado.
