# Implementation Plan: Criação inicial de trilha guiada

**Branch**: `feat/sdb-41-guided-track-creation` | **Date**: 2026-09-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/SDB-41-guided-track-creation/spec.md`

## Summary

Criar a primeira etapa de uma Jornada Guiada em `/trails/new`, com alias `/trilhas/nova`, reutilizando o shell de navegação da área customer. A pessoa descreve seu objetivo ou escolhe uma das cinco sugestões; a tela valida o texto, apresenta os estados de envio/erro e, após aceite do mock definido pela task, segue para a etapa 2 existente (`/trails/new/start`) levando o objetivo. O envio fica isolado na camada de API para futura substituição pelo endpoint real, ainda não disponível.

## Technical Context

**Language/Version**: TypeScript 6.x, React 19, Vite 8.

**Primary Dependencies**: React Router 7, Axios pela instância `src/api/api.ts`, lucide-react; Tailwind CSS 4 com plugin Vite e Motion for React (`motion/react`), solicitados na descrição visual e ainda ausentes do `package.json`.

**Storage**: Sem persistência remota nesta etapa enquanto o backend de criação não estiver disponível. Manter o objetivo em estado de navegação para o passo 2; não gravar texto livre em armazenamento persistente por padrão.

**Testing**: Não há framework de testes instalado. Validar cenários manualmente pelo `quickstart.md`, além de `npm run lint` e `npm run build`.

**Target Platform**: Navegadores modernos; fidelidade de referência em desktop e experiência funcional em tablet e celular.

**Project Type**: Aplicação web frontend React/Vite organizada por domínio.

**Performance Goals**: Interações locais (editar, escolher sugestão e validação) sem espera perceptível; estados de envio devem aparecer assim que a operação iniciar. O orçamento de latência do endpoint real depende do backend e não é definido por esta feature.

**Constraints**: Toda chamada HTTP futura deve usar `src/api/api.ts`; não inventar contrato de backend. Preservar funcionamento do CSS global existente ao introduzir Tailwind. Respeitar movimento reduzido. Não adicionar uma rota pública: a rota deve ficar no limite autenticado da aplicação, conforme a constituição.

**Scale/Scope**: Uma tela, um campo de meta, cinco sugestões fixas, um envio mockado e transição para a etapa 2; não inclui etapas seguintes, geração de currículo ou implementação de backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Organização por Domínio**: página em `src/pages/customer`, componentes exclusivos em `src/components/customer`, hook em `src/hooks`, tipos em `src/types` e comunicação/fachada de envio em `src/api` — **PASS**.
- **II. Rotas Protegidas por Padrão**: a rota nova deverá ser registrada somente dentro do limite autenticado. A branch atual não possui `PrivateRoute` nem integração visível de autenticação; a implementação depende de localizar ou disponibilizar esse limite e não pode publicar a tela como rota aberta. **PASS condicionado a essa dependência; bloqueio se não houver integração de autenticação disponível.**
- **III. API Centralizada via Axios**: o mock ficará na camada de API; a futura integração deverá usar a instância em `src/api/api.ts`, sem Axios instanciado no componente — **PASS**.
- **IV. Layout, arrow functions e hooks**: reutilizar `Sidebar`/`HeaderBar`, criar página e hook de responsabilidade única, handlers/components com arrow functions, sem ponto e vírgula e sem acesso Redux direto — **PASS**.
- **V. Fidelidade Visual e Qualidade**: imagem local `docs/img/Sidebrain - Criar trilha (Desktop).png` conferida e corresponde à referência enviada. O MCP do Figma não está disponível nesta sessão; implementação deve usar a referência local e registrar qualquer diferença que impeça inspeção Figma. Executar `npm run lint`, `npm run build` e os cenários de `quickstart.md` — **PASS com limitação de inspeção MCP documentada**.

**Gate inicial**: PASS condicionado à dependência de autenticação listada no princípio II; sem essa integração, não liberar a rota. Nenhuma violação constitucional foi aprovada.

**Gate pós-design (Phase 1)**: PASS condicionado à mesma dependência de autenticação. O desenho mantém a comunicação centralizada na API, organiza os arquivos por domínio, reutiliza o shell e limita Tailwind/Motion à tela; nenhuma decisão de dados ou interface introduz violação adicional. Confirmar o limite de autenticação antes de liberar a rota.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-41-guided-track-creation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── track-creation.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
vite.config.ts                               # Plugin oficial do Tailwind CSS para Vite
package.json                                 # Dependências Tailwind CSS 4 e Motion for React
src/
├── App.tsx                                  # Registrar /trails/new e alias /trilhas/nova sob rota autenticada
├── App.css                                  # Apenas ajustes globais estritamente necessários ao shell responsivo
├── index.css                                # Integração Tailwind sem reset global (Preflight) nesta entrega
├── api/
│   └── trackCreationApi.ts                  # Adaptador de submissão; mock agora, API centralizada no futuro
├── components/customer/
│   ├── HeaderBar.tsx                        # Shell reutilizado
│   ├── Sidebar.tsx                          # Shell reutilizado; estado ativo/navegação coerentes
│   └── PopularGoalSuggestions.tsx           # Cinco sugestões selecionáveis
├── hooks/
│   └── useTrackCreation.ts                  # Objetivo, validação, submissão e estados de erro/loading
├── pages/customer/
│   ├── CreateTrackPage.tsx                  # Breadcrumb, formulário, card e barra de ação
│   └── TrailStartPreferencePage.tsx          # Receber objetivo em location state para manter contexto no passo 2
└── types/
    └── trackCreation.ts                     # Sugestões, rascunho e resultado do passo 1
```

**Structure Decision**: seguir o domínio customer já usado pelos fluxos de onboarding e geração (SDB-66/SDB-42). O item “Minhas Trilhas” da sidebar e o CTA da área de trilhas abrem a etapa inicial (`/trails/new`); o breadcrumb “Trilhas” retorna à área de trilhas existente no dashboard (`/`). A etapa seguinte usa a rota existente `/trails/new/start`. O objetivo será encaminhado como estado de navegação, sem inventar persistência. A página usa utilitários Tailwind e Motion conforme solicitado; Tailwind será integrado ao Vite sem Preflight para não reformatar globalmente as telas antigas.

## Complexity Tracking

| Violation / dependency | Why needed | Simpler alternative rejected because |
|------------------------|------------|------------------------------------|
| Integração de Tailwind e Motion | São bibliotecas explicitamente requeridas pela descrição de estilo e microinterações, mas ainda não estão instaladas | CSS artesanal apenas ignoraria a stack descrita; limitar Tailwind à página e Motion às interações evita uma migração visual ampla |
| Rota autenticada ainda não visível no app | A constituição exige proteção para rotas privadas | Publicar a tela sem guarda viola a constituição; não será criado um mock de autenticação para contornar a ausência |
