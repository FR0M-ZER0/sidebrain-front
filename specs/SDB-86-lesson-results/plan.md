# Implementation Plan: Resultado da Lição

**Branch**: `SDB-86-lesson-results` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/SDB-86-lesson-results/spec.md`

## Summary

Entregar a tela de resultado da sessão de microaprendizagem usando o fluxo de resultado de quiz já existente como base. A implementação deve reaproveitar os componentes específicos de resultado, corrigir os dados demonstrativos para os valores e questões definidos na especificação, manter a tela sem navegação lateral, completar os detalhes de revisão e apresentar feedback e confirmação de nova tentativa localmente na própria tela.

## Technical Context

**Language/Version**: TypeScript 6.x, React 19

**Primary Dependencies**: Vite 8, React Router 7, lucide-react e Tailwind CSS 4 já presentes no projeto

**Storage**: Não aplicável; dados estáticos/mockados locais, sem persistência

**Testing**: `npm run lint`, `npm run build` e validação manual guiada por `quickstart.md`; o projeto não declara script de testes automatizados

**Target Platform**: Aplicação web desktop como alvo visual primário, com adaptação responsiva existente/preservada

**Project Type**: Frontend web React/Vite

**Performance Goals**: Conteúdo demonstrativo deve estar disponível na renderização inicial, sem requisições de rede ou espera de serviço

**Constraints**: Seguir organização por domínio e convenções do repositório; reutilizar componentes de resultado existentes sem alterar aparência ou comportamento de componentes compartilhados; rota de foco não deve renderizar navegação lateral; sem APIs externas

**Scale/Scope**: Uma tela de resultado, cinco questões estáticas, dois estados demonstrativos de ação (feedback e refazer), uma rota existente de resultado

## Constitution Check

| Princípio | Avaliação | Evidência/ação no plano |
|---|---|---|
| I. Organização por domínio | PASS | Manter a página e componentes do resultado em `src/pages/customer` e `src/components/customer`; não criar domínio/hook genérico desnecessário. |
| II. Rotas protegidas por padrão | GAP PREEXISTENTE REGISTRADO | `App.tsx` não contém `PrivateRoute` nem implementação do guard no projeto. A rota `/quiz-result` já existe e será ajustada, não criada; este plano não introduz uma nova superfície de acesso nem cria autenticação global fora do escopo. A lacuna permanece explícita para decisão/ação futura do projeto. |
| III. API centralizada via Axios | PASS | Nenhuma chamada HTTP necessária; dados e feedback são locais. |
| IV. Layout base, arrow functions e estado via hooks | PASS | Seguir componentes React como arrow functions, sem ponto e vírgula terminal; estado local encapsulado no hook/estado da tela. Preservar navegação React Router. |
| V. Fidelidade visual e qualidade | PASS COM DEPENDÊNCIA | Imagem de referência foi fornecida no pedido. A referência do Figma/MCP não está disponível nesta sessão; comparar visual com a imagem fornecida. Executar lint e build. |

**Gate inicial**: PASS COM RESSALVA DOCUMENTADA. A única divergência é a ausência preexistente de proteção de rotas no aplicativo, não uma nova exposição introduzida pela feature; não existe guard reutilizável. Corrigir isso exigiria uma iniciativa de autenticação mais ampla e não é inventado neste escopo. A rota de foco será isolada do shell com sidebar.

## Project Structure

### Documentation (this feature)

```text
specs/SDB-86-lesson-results/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/requirements.md
```

Não será criado `contracts/`: esta entrega é uma tela interna sem contrato de API ou interface pública entre sistemas.

### Source Code (repository root)

```text
src/
├── App.tsx                                  # Montagem da rota de resultado em layout de foco
├── App.css                                  # Ajustes específicos da tela de resultado
├── components/customer/
│   ├── lesson/LessonFocusLayout.tsx          # Reutilizar layout de foco existente sem alterar aparência/comportamento
│   ├── QuizResultSummary.tsx                 # Reaproveitar resumo e indicador circular
│   ├── QuizResultMetricGrid.tsx              # Reaproveitar grade de métricas
│   ├── QuizResultQuestionItem.tsx             # Reaproveitar card e completar campos de revisão
│   └── QuizResultActionBar.tsx                # Reaproveitar ações existentes sem mudar estilo compartilhado
├── hooks/useQuizResult.ts                    # Dados locais, expansão e estados das ações
├── pages/customer/QuizResultPage.tsx         # Tela de foco, estados de feedback/confirmação e retorno
└── types/quizResult.ts                       # Modelo do resultado e detalhes mockados
```

**Structure Decision**: Aplicar a estrutura existente de página de resultado do quiz. A rota atual `/quiz-result` já possui componentes, hook, tipos e estilos específicos com composição muito próxima à referência; o plano prioriza extensão/reuso dessa fatia em vez de criar outra página de resultado concorrente. Remover o invólucro com sidebar apenas para a rota desta tela, preservando o layout compartilhado das outras rotas.

## Phase 0: Outline & Research

Ver decisões e alternativas em [research.md](research.md). Os pontos de integração foram investigados no código local; não há incógnitas técnicas que exijam serviço externo. A documentação Context7/Figma via MCP não está acessível nesta sessão; não é necessária documentação externa para a solução interna já estabelecida no repositório.

## Phase 1: Design & Contracts

- Modelo de dados e estados locais: [data-model.md](data-model.md).
- Guia executável de validação: [quickstart.md](quickstart.md).
- Contratos: não aplicável, pois não há API/integração externa nem interface pública nova.

### Re-evaluation: Constitution Check

| Princípio | Resultado após design |
|---|---|
| Organização por domínio | PASS — estrutura existente de `customer` é mantida. |
| Rotas protegidas | GAP PREEXISTENTE — não há `PrivateRoute` no código. A SDB-86 modifica a rota existente, sem adicionar nova rota ou aumentar sua disponibilidade; autenticação global fica fora deste escopo. |
| API centralizada | PASS — sem chamadas HTTP. |
| Layout/estilo de código | PASS — usar os padrões atuais de React Router e estado local/hooks. |
| Fidelidade visual/qualidade | PASS CONDICIONAL — imagem fornecida disponível; validar com `npm run lint` e `npm run build`. |

**Gate pós-design**: PASS COM A MESMA RESSALVA PREEXISTENTE documentada acima; verificação de implementação confirma que não há guard existente para reutilizar. Executar lint/build e validar a nova composição de rota.

## Complexity Tracking

| Lacuna | Por que permanece | Alternativa menor rejeitada |
|---|---|---|
| Rotas sem `PrivateRoute` no aplicativo atual | O projeto não possui guard/autenticação implementados e `/quiz-result` já é uma rota existente. Inserir autenticação fictícia nesta tela não protegeria o restante do produto nem seria funcional. | Criar um guard isolado para esta página foi rejeitado por gerar proteção inconsistente; planejar a proteção global como iniciativa transversal é o caminho coerente. |
