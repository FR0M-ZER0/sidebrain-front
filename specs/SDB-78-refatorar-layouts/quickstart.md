# Quickstart: Validação de Padronização de Layouts

## Pré-requisitos

- Node.js e dependências do repositório instaladas.
- Backend/configuração existente disponível para percorrer os fluxos que dependem de dados remotos; usar dados de demonstração existentes quando o backend não estiver disponível.
- Acesso às referências locais:
  - `docs/img/Sidebrain - Tela da lição (Desktop).png`
  - `docs/img/Sidebrain - Quiz (Desktop).png`
- Para checagem visual final, tentar abrir o Figma em uma sessão autorizada.

## Validações automatizadas

Na raiz do repositório:

```bash
npm run lint
npm run build
```

**Resultado esperado**: os dois comandos terminam sem erros.

### Baseline antes da implementação (2026-10-06)

- `npm run lint`: falhou por erro preexistente `react-hooks/set-state-in-effect` em `src/hooks/useTrailGeneration.ts:55` (`setError(null)` chamado diretamente dentro de um efeito).
- `npm run build`: passou; Vite emitiu apenas aviso de chunk JavaScript acima de 500 kB.
- Reexecutar ao final e separar esses achados preexistentes de regressões causadas pela feature.

## Validações manuais de páginas gerais

Iniciar o app com `npm run dev` e visitar as rotas:

| Rota | Verificar |
|---|---|
| `/` | Sidebar, barra superior, conteúdo e referência de largura do Dashboard. |
| `/trails/<slug-existente>` | Mesmo shell; breadcrumb e conteúdo da trilha alinhados ao Dashboard. |
| `/trails/new/create` | Mesmo shell; formulário e submissão preservam seu comportamento. |
| `/trails/new/start` | Mesmo shell; seleção, navegação e breadcrumb permanecem funcionais. |
| `/trails/new/assessment` | Mesmo shell; carregamento, respostas, validação e envio do diagnóstico permanecem funcionais. |
| `/trails/new/generating` | Mesmo shell durante carregamento, progresso, erro, nova tentativa e redirecionamento. |

Comparar as seis telas em uma mesma largura de desktop: barra lateral/superior, largura externa do conteúdo e breadcrumbs devem se alinhar; página sem breadcrumb não deve reservar espaço vazio.

## Validações manuais de atividade e teclado

1. Abrir uma lição com conteúdo e comparar o cabeçalho, breadcrumbs, progresso, área de conteúdo e rodapé com a imagem de referência da lição.
2. Percorrer todos os controles da lição com `Tab` e `Shift+Tab`; conferir ordem lógica e foco visível; ativar controles com `Enter`/`Espaço` e confirmar que a progressão original segue funcionando.
3. Abrir a ajuda com `Ctrl+K` e pelo controle visível. Conferir que o painel descreve `Tab`/`Shift+Tab`, `Enter`/`Espaço` e `Esc`.
4. Com a ajuda aberta, pressionar `Esc`: ela fecha, o foco retorna adequadamente e nenhum conteúdo/progresso muda. Na lição, com a ajuda fechada, confirmar que o Escape ainda abre a confirmação de saída existente.
5. Focar uma resposta editável e digitar; confirmar que a tecla usada não é interceptada como atalho. Confirmar que Ctrl+K não captura eventos originados em campos editáveis.
6. Abrir o quiz correspondente e comparar progresso, questão, opções/resposta, feedback e ações com `docs/img/Sidebrain - Quiz (Desktop).png`. Verificar que ajuda/teclado não submetem respostas nem avançam questões sem ação explícita.
7. Percorrer loading, erro, estado sem conteúdo ou estados de resposta existentes: seu texto, retry, dados, navegação e chamadas de backend devem manter o comportamento anterior.

## Responsividade e saída esperada

Repetir as verificações em desktop, tablet e viewport móvel. Não deve haver conteúdo cortado, sobreposição, rolagem horizontal indevida ou controle essencial indisponível. A aparência deve manter o modo de foco das atividades e a estrutura comum das páginas gerais.

**Aceite**: lint e build passam; as seis páginas gerais compartilham shell/largura; as referências de lição e quiz são atendidas; controles existentes e integrações continuam funcionais; teclado e ajuda correspondem ao contrato UI sem alterar a atividade.

## Resultado da validação desta implementação (2026-10-06)

- `npm run build`: passou. O Vite mantém o aviso existente de chunk JavaScript acima de 500 kB.
- `npm run lint`: continua falhando somente em `src/hooks/useTrailGeneration.ts:55` por `react-hooks/set-state-in-effect`, reproduzindo o erro já registrado no baseline. Os arquivos alterados passaram em execução direcionada de ESLint.
- Capturas headless conferidas em desktop, tablet e móvel para Dashboard, páginas de criação/preferência, detalhes (estado de erro do serviço), avaliação e quiz; a página de lição exibiu o estado de erro do serviço, mantendo o shell de atividade.
- Rota de geração verificada com estado válido de navegação simulado; shell lateral, barra superior e conteúdo de geração apareceram sem duplicação.
- Quiz local percorreu seleção, confirmação, feedback e próxima pergunta sem alterar a lógica da atividade.
- Ajuda de teclado verificada no navegador: Ctrl+K abre, Esc fecha sem acionar a saída da lição, Esc com ajuda fechada mantém a confirmação de saída, acionador visível abre a ajuda, foco retorna ao acionador e Ctrl+K originado em campo editável não abre a ajuda.
- Serviços de lição e detalhes de trilha responderam HTTP 422 no ambiente de validação; por isso, os estados de sucesso integrados ao backend não puderam ser exercitados. Os estados de erro foram preservados.
- O Figma permaneceu inacessível (HTTP 403 na URL de design; HTTP 404 no oEmbed); a comparação foi feita com as imagens locais indicadas.
