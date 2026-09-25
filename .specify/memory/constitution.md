# SideBrain Frontend Constitution

## Core Principles

### I. Organização por Domínio (NON-NEGOTIABLE)

Páginas ficam em `src/pages/<dominio>` e componentes específicos em
`src/components/<dominio>`; componentes compartilhados ficam em
`src/components/general`. Novos domínios MUST seguir o mesmo padrão
(`pages/<dominio>` + `components/<dominio>`). Hooks customizados MUST
ficar em `src/hooks` com prefixo `use` e responsabilidade única.
Slices Redux MUST ficar em `src/store/slices` por domínio.

### II. Rotas Protegidas por Padrão

Todas as rotas MUST exigir autenticação via `PrivateRoute` por padrão.
Rotas públicas (login, cadastro, recuperação de senha) MUST ser
explicitamente marcadas como sem autenticação. Nenhuma rota privada
pode ser exposta sem `PrivateRoute`.

### III. API Centralizada via Axios (NON-NEGOTIABLE)

Toda chamada HTTP MUST usar a instância configurada em `src/api/api.ts`.
É proibido instanciar axios diretamente em componentes, páginas ou hooks.
Endpoints, interceptors e configuração de `baseURL` vivem em `src/api`.

### IV. Layout Base, Arrow Functions e Estado via Hooks

Páginas MUST ser compostas a partir de `Layout.tsx` (ou especializações
como `LayoutWithSearchBar`, `CustomerLayout`). Componentes, utilitários,
hooks e handlers MUST usar arrow functions. Declarações MUST omitir ponto
e vírgula final. Acesso ao Redux MUST passar por hooks customizados
(ex: `useAuth`), nunca `useSelector`/`useDispatch` espalhados.

### V. Fidelidade Visual e Qualidade de Entrega

Antes de gerar CSS/Tailwind, MUST inspecionar o Figma de referência e a
imagem correspondente em `docs/img/` para bater o visual pixel a pixel
(estilos, paddings, cores, tipografia). Toda entrega MUST passar em
`npm run lint` e `npm run build` sem erros. Validação manual segue o
`quickstart.md` da feature quando não houver framework de testes.

## Technology Stack & Constraints

**Stack**: React 19 + Vite 8 + TypeScript 6.x, React Router 7, Axios,
lucide-react, Redux (via hooks). **Setup**: `npm install`, `npm run dev`,
`npm run lint`, `npm run build`. **Docs normativas**: `docs/architecture.md`
e `docs/code_conventions.md` MUST ser consultadas antes de qualquer
alteração de código; `AGENTS.md` é normativo. Respostas ao usuário MUST
ser em português brasileiro.

## Development Workflow

Fluxo Spec-Driven: `specify → clarify → plan → tasks → implement`, com
artefatos em `specs/<feature>/` (spec.md, plan.md, tasks.md, research.md,
data-model.md, contracts/, checklists/). Task do Jira (`SDB-x`, espaço
Sidebrain) é a fonte da descrição; usar MCP do Jira, Context7 para docs
atualizadas e Figma para o visual. Commits seguem conventional commits
(via commitlint + husky + lint-staged).

## Governance

Esta constituição prevalece sobre práticas ad-hoc. Emendas requerem
atualização deste arquivo, bump de versão semântica e plano de migração
quando houver quebra. MAJOR: remoção/redefinição incompatível de
princípio. MINOR: novo princípio ou seção. PATCH: clarificações e
correções de texto. Todo PR/review MUST verificar conformidade com os
princípios I–V e com as convenções de domínio, rotas, API e layout.

**Version**: 1.0.0 | **Ratified**: 2026-09-23 | **Last Amended**: 2026-09-23
