# Implementation Plan: Conclusão da Lição

**Branch**: `SDB-74-lesson-completion` | **Date**: 2026-09-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/SDB-74-lesson-completion/spec.md`

## Summary

Criar uma tela responsiva de conclusão de lição elegível somente para resultados com 100% de acerto. A página apresenta sequência, XP, conquista, meta diária e próxima etapa; oferece navegação por teclado e ações de saída; e representa carregamento, falha e nova tentativa de sincronização sem inventar dados. A primeira entrega usa os dados mockados especificados atrás de uma fronteira de serviço, permitindo integração futura com API sem acoplar a interface a endpoints ainda inexistentes. A composição visual seguirá a imagem local de referência e usará Motion para entradas e interações, respeitando a preferência por movimento reduzido.

## Technical Context

**Language/Version**: TypeScript 6.x, React 19.2.x

**Primary Dependencies**: Vite 8.3.x; React Router 7.18.x; lucide-react 1.47.x; adicionar `motion` (API React em `motion/react`), `tailwindcss` 4.x e `@tailwindcss/vite` 4.x.

**Storage**: N/A para a interface; XP/recompensas ainda não têm endpoint ou persistência do produto disponível. Não persistir a fonte mock como se fosse dado de produção.

**Testing**: Não há runner nem suíte automatizada configurada. Usar `npm run lint`, `npm run build` e validação manual documentada em `quickstart.md`.

**Target Platform**: Navegadores web suportados pelo projeto, em desktop, tablet e dispositivos móveis.

**Project Type**: Aplicação web frontend (React + Vite).

**Performance Goals**: Renderizar o conteúdo essencial sem depender da conclusão das animações; entrada breve e não bloqueante; manter navegação utilizável em todas as larguras alvo.

**Constraints**: Usar a instância central `src/api/api.ts` em qualquer chamada HTTP futura; não inventar endpoints ou resultados. O app atual não tem página/rota de lição, guard de autenticação, rota de perfil ou rota de próxima lição. A implementação deve expor navegação por callbacks e deixar os destinos integrados ao fluxo real quando disponíveis; não criar um guard de autenticação fictício. Instalar Tailwind sem migrar todo o CSS legado nem causar regressões globais; preferir omitir Preflight na adoção inicial. Respeitar movimento reduzido e não depender de cor como único indicador.

**Scale/Scope**: Uma tela de conclusão de lição e seus componentes, estados de exibição e ações de navegação; resultado perfeito (100%) apenas. Resultados inferiores permanecem no fluxo distinto e fora desta página.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Estado | Verificação / tratamento no plano |
|---|---|---|
| I. Organização por domínio | PASS | Criar o novo domínio em `src/pages/lessons` e `src/components/lessons`; manter hooks e tipos em `src/hooks` e `src/types`. |
| II. Rotas protegidas por padrão | DEPENDÊNCIA EXTERNA | `src/App.tsx` não tem `PrivateRoute` nem infraestrutura de autenticação. A tela não pode ser publicada como rota privada alegando proteção inexistente; integrar a rota somente pelo guard real da aplicação quando fornecido. Não inventar autenticação. |
| III. API centralizada via Axios | PASS COM LIMITE | Para chamadas reais futuras, utilizar `src/api/api.ts` por módulo de serviço. Nenhum endpoint de lição/recompensa existe; a primeira entrega usa serviço mock separado e tipado. |
| IV. Layout, arrow functions e estado | PASS COM ADEQUAÇÃO | Usar composição de layout da página e arrow functions sem ponto e vírgula, conforme convenções. O repositório não possui `Layout.tsx` nem hooks de autenticação; não introduzir estado global ou estrutura Redux desnecessária. |
| V. Fidelidade visual e qualidade | PASS COM DEPENDÊNCIA | Consultada a imagem local `docs/img/Sidebrain - Lição Concluída (Desktop).png`. MCP do Figma não está disponível nesta sessão. Prever `npm run lint`, `npm run build` e roteiro manual; respeitar movimento reduzido. |

**Gate result**: O desenho respeita os princípios aplicáveis. A integração de rota protegida é uma dependência explícita de infraestrutura: não pode ser considerada concluída sem o guard/autenticação real. O escopo visual e de interação pode ser implementado e validado isoladamente enquanto essa dependência é resolvida.

## Phase 0: Research

Decisões e evidências estão em [research.md](./research.md). Em resumo: adotar `motion` (API React em `motion/react`) e Tailwind CSS 4 com plugin oficial do Vite; manter resultado e sincronização atrás de um serviço tipado mockável; não reaproveitar dados de resultado de quiz como se fossem dados da lição; disponibilizar a visualização de forma isolada até que as rotas e autenticação do produto existam; validar por lint, build e roteiro manual por falta de runner automatizado.

## Phase 1: Design & Contracts

- [Modelo de dados](./data-model.md): conclusão elegível, streak, XP, badge, meta, próxima lição e ciclo de sincronização.
- [Contrato de interface](./contracts/lesson-completion-ui.md): entrada da tela, estados, ações, teclado, responsividade e dependências de navegação/autorização.
- [Guia de validação](./quickstart.md): comandos e cenários manuais para layout, resultado de 100%, ausência de próxima etapa, loading, falha/retry, teclado e telas menores.
- Não há contrato HTTP nesta fase: não existe API de lição/recompensas ou destino de backend confirmado. A interface do serviço mock deve poder ser substituída pela instância Axios do projeto quando o contrato real for definido.

### Reavaliação da Constitution Check

| Princípio | Estado pós-design | Resultado |
|---|---|---|
| I. Organização por domínio | PASS | Página e componentes ficam no domínio `lessons`; tipos, hook e serviço ficam em suas pastas convencionadas. |
| II. Rotas protegidas por padrão | PENDENTE DE PLATAFORMA | Não existe guard nem autenticação no app atual. A página pode ser desenvolvida sem expor uma nova rota pública; uma rota navegável só será integrada quando existir um guard real. |
| III. API centralizada via Axios | PASS | Mock permanece isolado; eventual HTTP só é implementado com endpoint confirmado usando `src/api/api.ts`. |
| IV. Layout, arrow functions e estado | PASS | Página isolada, handlers em arrow functions, estado local encapsulado em hook; não há Redux necessário. |
| V. Fidelidade visual e qualidade | PASS COM RESSALVA | Imagem local e critérios de responsividade dão referência disponível. Inspeção Figma via MCP é indisponível; validar visualmente contra o asset local. |

## Project Structure

### Documentation (this feature)

```text
specs/SDB-74-lesson-completion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── lesson-completion-ui.md
└── tasks.md                    # será produzido por /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── App.tsx                              # futura associação da página somente via guard real
├── index.css                            # tema/tokens e utilitários Tailwind, sem reset global inicial
├── api/
│   └── lessonCompletionService.ts       # contrato/fixture local; HTTP somente após endpoint confirmado
├── components/
│   └── lessons/
│       ├── LessonCompletionView.tsx     # conteúdo visual e ações acessíveis
│       └── LessonCompletionSkeleton.tsx # placeholders do cabeçalho e métricas
├── hooks/
│   └── useLessonCompletion.ts           # estados de consulta, retry e ações sem duplicidade
├── pages/
│   └── lessons/
│       └── LessonCompletionPage.tsx     # composição da tela no domínio lessons
└── types/
    └── lessonCompletion.ts              # entidades e estados da feature
```

**Structure Decision**: Nova feature de domínio `lessons`, separada de `quiz` conforme a semântica dos dados. `LessonCompletionView` fica no caminho solicitado (`src/components/lessons/LessonCompletionView.tsx`); uma página do mesmo domínio faz a composição. Não reutilizar `QuizResultPage` ou `quizResult.ts`. O Tailwind é configurado no Vite e no CSS global, mas sem migrar `App.css` ou ativar reset que possa afetar telas existentes. O acesso via rota em `App.tsx` depende de rota de lição e guard reais, ainda ausentes.

## Complexity Tracking

Nenhuma violação arquitetural intencional foi adicionada. A dependência de autenticação/guard é uma lacuna preexistente do app e está explicitada como impedimento para publicar a rota, em vez de ser contornada por um guard simulado.
