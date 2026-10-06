# Implementation Plan: Padronização de Layouts

**Branch**: `SDB-78-refatorar-layouts` | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/SDB-78-refatorar-layouts/spec.md`

## Summary

Padronizar a estrutura das seis páginas gerais com uma composição reutilizável de navegação lateral, barra superior e conteúdo de largura alinhada ao Dashboard, com breadcrumb opcional. Unificar a experiência visual das telas de atividade de lição e quiz pelas referências fornecidas, acrescentando uma ajuda de teclado acionada por Ctrl+K e conservando as ações nativas por Tab/Shift+Tab, Enter/Espaço e Esc. A implementação deve envolver as interfaces de apresentação sem alterar hooks, regras de negócio, dados ou chamadas existentes ao backend.

## Technical Context

**Language/Version**: TypeScript 6.x e React 19

**Primary Dependencies**: Vite 8, React Router 7, Tailwind CSS 4, lucide-react, Motion 13 e a instância Axios existente

**Storage**: N/A — não há persistência nova; o estado das atividades e os dados remotos permanecem pertencendo às páginas/hooks existentes

**Testing**: `npm run lint`, `npm run build` e validação manual de rotas, estados, teclado e apresentação responsiva; não foi encontrado script ou diretório de testes automatizados

**Target Platform**: Aplicação web responsiva em navegadores desktop, tablet e dispositivos móveis

**Project Type**: Frontend web React (Vite + TypeScript)

**Performance Goals**: Sem meta numérica nova; layouts não devem atrasar nem bloquear as interações e estados de carregamento existentes

**Constraints**: Mudanças visuais e de teclado somente; não alterar contratos de backend, lógica dos hooks, progressos, respostas, navegação existente ou conteúdo de atividade. Seguir organização de domínio, composição por Layout, arrow functions, ausência de ponto e vírgula final e consulta por hooks para estado global. Inspecionar as referências visuais antes de ajustes finais de estilo.

**Scale/Scope**: Seis páginas gerais (dashboard, detalhes/criação de trilha e três etapas de onboarding), páginas de conteúdo/atividade de lição e quiz, seus estados responsivos e a ajuda por teclado dentro das atividades.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Antes da pesquisa

- **I. Organização por domínio**: PASS — reutilizáveis gerais devem ficar em `src/components/general`; especializações de experiência do cliente e atividade em `src/components/customer`; páginas permanecem em seus domínios atuais.
- **II. Rotas protegidas por padrão**: PASS — não são propostas rotas novas nem mudanças à proteção atual.
- **III. API centralizada via Axios**: PASS — layouts não farão chamadas HTTP; páginas e hooks atuais mantêm a comunicação via `src/api`.
- **IV. Layout base, arrow functions e estado via hooks**: PASS — a solução é baseada em layouts compartilhados e preserva convenções de funções e hooks existentes.
- **V. Fidelidade visual e qualidade de entrega**: PASS COM AÇÃO — imagens da lição e do quiz foram inspecionadas; o acesso automatizado à referência Figma fornecida respondeu HTTP 403. O Figma deve ser inspecionado no ambiente de implementação se houver acesso autorizado. Lint, build e validação manual são gates de entrega.

**Gate inicial**: PASS. A indisponibilidade de acesso automatizado ao Figma não bloqueia o plano: as duas imagens nomeadas do repositório estão disponíveis para análise; não se presume nenhum requisito visual além do conteúdo das referências.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-78-refatorar-layouts/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── layouts-ui.md
└── tasks.md             # fase posterior (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── App.tsx                               # associa as páginas à composição apropriada sem mudar caminhos
├── App.css                               # estilos compartilhados e dimensões responsivas
├── components/
│   ├── general/
│   │   └── ...                           # layout geral compartilhável quando não específico do domínio
│   └── customer/
│       ├── layouts/                      # shell padrão de navegação do produto
│       ├── lesson/                       # layout de atividade e ajuda Ctrl+K
│       ├── HeaderBar.tsx                 # barra superior reutilizada
│       └── Sidebar.tsx                   # navegação lateral reutilizada
├── hooks/                                # lógica e integrações atuais preservadas
└── pages/
    ├── customer/                         # dashboard, trilhas, lições e quizzes existentes
    └── lessons/                          # conclusão de lição existente
```

**Structure Decision**: Manter os domínios e páginas atuais. Colocar o shell que contém elementos de navegação do produto em `components/customer/layouts`, por depender dos componentes Sidebar/HeaderBar específicos da experiência do usuário; manter componentes de atividade e atalhos em `components/customer/lesson`, que atende às páginas de lição e quiz. Só extrair elementos visuais genéricos para `components/general` quando forem realmente independentes do domínio. Nenhuma alteração de endpoint ou camada de dados faz parte desta estrutura.

## Phase 0: Research

As decisões, o levantamento da estrutura atual, a inspeção das imagens e as alternativas estão registrados em [research.md](research.md). Não restam decisões de arquitetura bloqueadoras. O Figma automatizado não pôde ser acessado (HTTP 403); a consulta visual deve ser tentada por um ambiente com acesso durante a implementação.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md) registra que não há novas entidades persistidas e define os dados visuais como projeções do estado já existente.
- [contracts/layouts-ui.md](contracts/layouts-ui.md) define os contratos de composição visual para o shell comum, breadcrumb opcional e atividade com ajuda de teclado.
- [quickstart.md](quickstart.md) especifica validações automatizadas e manuais de rota, estado, atalhos, comportamento existente e responsividade.

## Constitution Check (post-design)

- **I. Organização por domínio**: PASS — os layouts de navegação ficam no domínio customer, os layouts e controles de atividade ficam no domínio lesson/customer, e a estrutura de pastas existente é preservada.
- **II. Rotas protegidas por padrão**: PASS — nenhuma rota é adicionada ou exposta por este plano.
- **III. API centralizada via Axios**: PASS — nenhuma chamada de rede é movida para layouts ou componentes de apresentação.
- **IV. Layout base, arrow functions e estado via hooks**: PASS — páginas passam a compor layouts e controles; estado funcional continua nos hooks e páginas responsáveis.
- **V. Fidelidade visual e qualidade de entrega**: PASS COM AÇÃO — as imagens foram avaliadas e estão referenciadas nos contratos; tentar obter acesso Figma autorizado, executar lint/build e cumprir a validação manual do quickstart.

**Gate pós-design**: PASS. Sem violações constitucionais; a ação pendente de consulta Figma é uma dependência de validação visual da fase de implementação, não altera APIs ou escopo.

## Complexity Tracking

Não há violações constitucionais a justificar.
