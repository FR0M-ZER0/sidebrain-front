# Implementation Plan: Página de Detalhes da Trilha de Aprendizado

**Branch**: `SDB-46-learning-track` | **Date**: 2026-09-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/SDB-46-learning-track/spec.md`

## Summary

Criar a página responsiva de detalhes da trilha com resumo/progresso e missões em uma coluna, e módulos expansíveis e lições na outra. A primeira versão apresentará a fixture mockada tipada, estados de carregamento, estados de acesso, barras de progresso e interações acessíveis. Serão reutilizados React Router, Motion, Tailwind e ícones já presentes no projeto. O acesso à rota de produção requer um guard de autenticação real. Como o dashboard já reúne trilhas, missões e badges, a navegação secundária pode usar âncoras para essas seções existentes.

## Technical Context

**Language/Version**: TypeScript 6.x com React 19.2.x

**Primary Dependencies**: Vite 8.3.x, React Router 7.18.x, Tailwind CSS 4.3.x com plugin Vite, Motion 13.4.x e lucide-react 1.47.x — todos já declarados no `package.json`.

**Storage**: Sem armazenamento novo. A página consumirá inicialmente dados demonstrativos de uma fixture atrás de uma função de serviço local; nenhuma persistência de progresso ou chamada HTTP será criada nesta entrega. Integração futura deverá usar a instância existente `src/api/api.ts`.

**Testing**: Não há framework de testes automatizados configurado. Validar com `npm run lint`, `npm run build` e cenários manuais em `quickstart.md`, incluindo teclado, dados inconsistentes e viewport móvel.

**Target Platform**: SPA web existente, navegadores desktop, tablet e mobile.

**Project Type**: Frontend web React/Vite.

**Performance Goals**: Dados disponíveis devem substituir skeletons sem atrasar interação; expansão de módulos e entrada sequencial devem ser suaves e respeitar redução de movimento. A spec não define alvo numérico de latência.

**Constraints**: Seguir organização por domínio `customer`; preservar layout e estilos globais existentes; utilizar mock até contrato de API disponível; links não devem simular navegação concluída para destinos inexistentes; rotas privadas não podem ser publicadas sem proteção real.

**Scale/Scope**: Uma página para uma trilha por slug, com 4 módulos e 10 lições no exemplo. Sem edição de trilha, conclusão de lição, persistência, API real ou criação de página de Missões & Badges.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Estado | Aplicação ao plano |
|---|---|---|
| I. Organização por domínio | PASS | Página em `src/pages/customer`, componentes em `src/components/customer/tracks`, hook em `src/hooks`, tipos em `src/types` e serviço/fixture em `src/api`. |
| II. Rotas protegidas por padrão | BLOCKED — dependência externa | `src/App.tsx` não possui `PrivateRoute`, provider ou estado de autenticação. A rota `/trails/:slug` não deve ser publicada até existir um guard confiável; não será criado guard simulado nesta feature. A tela pode ser validada por preview isolado de desenvolvimento. |
| III. API centralizada via Axios | PASS | A primeira versão não faz HTTP. Qualquer integração posterior deverá usar `src/api/api.ts`; a fixture fica isolada atrás do serviço. |
| IV. Layout base, arrow functions e hooks | PASS COM ADAPTAÇÃO | Não há `Layout.tsx` compartilhado no repositório; a rota de conteúdo usa `NavigationPage` com a navegação já existente. Handlers seguem arrow functions e hooks customizados em `src/hooks`. |
| V. Fidelidade visual e qualidade | BLOCKED PARA CSS | A imagem local `docs/img/Sidebrain - Página da trilha (Desktop).png` está disponível. O arquivo Figma exige autenticação na sessão do navegador e não há MCP Figma; as tarefas de CSS/Tailwind devem aguardar acesso e inspeção do frame correspondente. A entrega também deve passar lint/build e validação visual manual. |

**Gate antes da pesquisa**: pesquisa/modelagem podem prosseguir. Não iniciar tarefas de CSS/Tailwind até inspecionar o frame da trilha no Figma junto à imagem local. A integração navegável à rota privada permanece bloqueada até haver autenticação/guard real. Não existe uma página dedicada de Missões & Badges, mas o dashboard contém as seções correspondentes; âncoras acessíveis podem ligá-las sem criar uma nova página.

**Reavaliação após Phase 1**: o desenho mantém os princípios I, III e IV. Os princípios II e V permanecem como gates explícitos: guard real antes de publicar a rota e inspeção do Figma antes de produzir CSS/Tailwind. Breadcrumbs e ação de missões usam âncoras das seções existentes no dashboard; não exigem criar uma nova página.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-46-learning-track/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── track-details-ui.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
src/
├── App.tsx                                   # registrar rota quando houver guard real
├── api/
│   └── trackService.ts                       # fixture e acesso substituível por API
├── components/customer/tracks/
│   ├── TrackDetailsHeader.tsx                # breadcrumb e título/nível da trilha
│   ├── TrackProgressCard.tsx                 # progresso geral
│   ├── TrackMissionsCard.tsx                 # missões e progresso individual
│   ├── ModuleAccordion.tsx                   # cabeçalho/estado e expansão do módulo
│   ├── LessonItem.tsx                        # item visual segundo estado da lição
│   └── TrackDetailsSkeleton.tsx              # placeholders iniciais
├── hooks/
│   └── useTrackDetails.ts                    # consulta/estado de carregamento da fixture
├── dev/
│   └── trackPreview.tsx                       # visualização isolada para validação manual
├── components/customer/
│   ├── MissionsSection.tsx                   # expor âncora de destino
│   └── TracksSection.tsx                     # expor âncora de trilhas ativas
├── pages/customer/
│   └── TrackDetailsPage.tsx                  # composição da experiência
└── types/
    └── trackDetails.ts                       # modelo de trilha, módulo, missão e lição
track-preview.html                             # entrada de desenvolvimento isolada
```

**Structure Decision**: Manter o domínio `customer` usado pelas páginas e componentes atuais, com subpasta `tracks` para componentes específicos da página. Usar React Router e o padrão de layout existente, sem criar estrutura Next.js para a rota `/trilhas/[slug]`; o padrão de URL local será `/trails/:slug`, consistente com `/trails/new/...`. Adicionar identificadores estáveis às seções de trilhas ativas e missões do dashboard para os destinos `/#tracks` e `/#missions`; a inclusão definitiva da rota de detalhes em `App.tsx` requer resolver o gate de autenticação.

## Complexity Tracking

Não há violação arquitetural intencional. A rota de produção depende do guard real; as ações de trilhas e missões podem usar âncoras das seções existentes, sem criar escopo de página adicional.
