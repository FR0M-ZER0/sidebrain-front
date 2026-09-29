# Implementation Plan: Página de Leitura da Lição

**Branch**: `SDB-74-lesson-completion` (checkout atual; feature planejada: `SDB-44-lesson-content`) | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/SDB-44-lesson-content/spec.md`

## Summary

Criar uma experiência responsiva de leitura de lição em modo de foco, com hierarquia de navegação, progresso, blocos de conteúdo ordenados, saída confirmada por botão/`ESC` e estados de carregamento e erro. A página será integrada ao roteador React já existente, usará um adaptador de dados mockado até existir endpoint de lições, Tailwind CSS 3.4 para as classes/tokens solicitados e Motion for React para transições e interações.

## Technical Context

**Language/Version**: TypeScript 6.x com React 19.2.x

**Primary Dependencies**: Vite 8.3.x, React Router 7.18.x, Axios centralizado em `src/api/api.ts`, Tailwind CSS 3.4.x (a adicionar) e Motion for React (`motion`, a adicionar). Ícones via `lucide-react` existente.

**Storage**: Sem armazenamento local novo. A primeira versão consome dados mockados através de uma camada de acesso substituível; o progresso não será persistido pela página.

**Testing**: Não há framework de testes automatizados configurado. Validação pelo ESLint, build TypeScript/Vite e cenários manuais em `quickstart.md`.

**Target Platform**: Aplicação web Vite; navegadores desktop, tablet e mobile.

**Project Type**: Frontend web React SPA.

**Performance Goals**: Renderizar conteúdo assim que os dados forem disponibilizados; transições não devem atrasar a leitura. Respeitar preferência por redução de movimento.

**Constraints**: Manter organização por domínio e convenções do repositório; não criar chamada HTTP específica até existir endpoint de lições; chamadas futuras devem usar `src/api/api.ts`. A rota da lição deve ser privada. A árvore atual não possui `PrivateRoute`, estado de autenticação, nem telas de trilha/módulo. A integração com autenticação e os destinos de breadcrumb dependem do contrato da aplicação, e não devem ser substituídos por uma verificação local improvisada nem por links para destinos inexistentes.

**Scale/Scope**: Uma rota de leitura identificada por `lessonId`, com blocos de texto/imagem e estados de interface; sem edição de conteúdo, quiz, persistência de progresso ou navegação para telas novas de trilha/módulo.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Estado | Aplicação ao plano |
|---|---|---|
| I. Organização por domínio | PASS | Página em `src/pages/customer`; componentes da lição em `src/components/customer/lesson`; hook em `src/hooks`; serviço/adaptador em `src/api`. |
| II. Rotas protegidas por padrão | BLOCKED — dependência externa | A rota será privada, mas o repositório não possui `PrivateRoute` nem provider/estado de autenticação. O guard e a fonte de autenticação precisam ser providos/integrados antes de expor a rota; não se deve deixar a página pública. |
| III. API centralizada via Axios | PASS | Primeira versão usa mock, sem HTTP. Integração futura deve passar pela instância existente `src/api/api.ts`. |
| IV. Layout, arrow functions e hooks | PASS COM ADAPTAÇÃO | Não há `Layout.tsx` compartilhado no código atual. A página será composta por `LessonFocusLayout`, especialização visual de foco; componentes e handlers seguirão arrow functions e sem ponto e vírgula final. Estado de domínio fica em hook dedicado. |
| V. Fidelidade visual e qualidade | PASS COM DEPENDÊNCIA | A imagem local correspondente foi identificada em `docs/img/Sidebrain - Tela da lição (Desktop).png`; a especificação registra que o MCP do Figma/Jira não estava acessível. Validar desktop, tablet e mobile e executar lint/build. |

**Gate antes da pesquisa**: O desenho funcional pode prosseguir. A integração de rota permanece bloqueada até a disponibilidade de um guard de autenticação confiável, requerida pelo princípio II. Não será introduzida uma autenticação simulada dentro da feature.

**Reavaliação após Phase 1**: As escolhas de estrutura, dados mockados e dependências visuais respeitam os princípios I, III, IV e V. O princípio II continua como pré-requisito externo: a rota não pode ser disponibilizada até a aplicação fornecer um guard e sua fonte de autenticação.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-44-lesson-content/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── lesson-page.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
src/
├── App.tsx                              # registrar /lessons/:id sob guarda privada
├── index.css                            # entrada das camadas Tailwind e tokens globais
├── api/
│   └── lessonsApi.ts                    # acesso mockado, substituível por API central
├── hooks/
│   └── useLesson.ts                     # estado de carregamento/conteúdo/erro
├── pages/customer/
│   └── LessonPage.tsx                   # composição da página da lição
└── components/customer/lesson/
    ├── LessonFocusLayout.tsx            # cabeçalho e rodapé do modo de foco
    ├── LessonHeader.tsx                 # breadcrumbs e saída
    ├── LessonProgress.tsx               # posição e percentual da trilha
    ├── LessonContent.tsx                # título e blocos ordenados
    ├── LessonExitDialog.tsx              # confirmação de saída
    ├── LessonLoading.tsx                 # skeleton da estrutura
    └── LessonError.tsx                   # erro e nova tentativa
```

**Structure Decision**: Seguir o domínio `customer` já existente no frontend Vite/React (não criar estrutura Next.js `app/lessons/[id]`). A página fica sob `/lessons/:id` no React Router; elementos específicos ficam em `components/customer/lesson`. O `LessonFocusLayout` será necessário porque o repositório não apresenta um layout base reutilizável e esta tela remove distrações como na referência.

## Complexity Tracking

Não há violação arquitetural aprovada. A ausência do guard de autenticação é uma dependência pendente, não uma justificativa para abrir uma rota privada sem proteção.
