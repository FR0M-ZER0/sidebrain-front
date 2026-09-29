# Pesquisa: Criação inicial de trilha guiada

## Contexto confirmado

- A descrição da task SDB-41 inclui o comportamento e os dados mockados; o MCP do Jira não está disponível nesta sessão para confirmar detalhes adicionais.
- A imagem local [Sidebrain - Criar trilha (Desktop).png](../../docs/img/Sidebrain%20-%20Criar%20trilha%20%28Desktop%29.png) foi conferida e corresponde à imagem enviada. O MCP do Figma não está disponível; não foi possível inspecionar o arquivo original.
- A tela deve exibir “Passo 1 de 3”, a meta, cinco sugestões, aviso informativo e ação Avançar. A especificação cobre validação, erro recuperável, responsividade e acessibilidade.
- A aplicação já usa React 19, Vite 8, React Router 7, Axios e lucide-react. Não há Tailwind, Motion, configuração Tailwind nem framework de testes no `package.json`.
- O app registra páginas em `src/App.tsx`; o dashboard e os componentes `Sidebar`/`HeaderBar` formam o shell atual. `/` contém a seção de trilhas. A preferência da etapa 2 já existe em `/trails/new/start`, marcada como “Etapa 2 de 3”.
- Não há endpoint de criação por objetivo no código ou contratos existentes. SDB-42 começa geração a partir de um `trailId` já conhecido e não deve ser reaproveitada como endpoint de envio da meta.
- A branch ativa é SDB-74, mas o argumento desta execução é explicitamente SDB-41; este plano permanece no diretório da SDB-41 e não muda a branch.

## Decisões

### Submissão da meta e futuro backend

**Decision:** Implementar o comportamento mockado descrito na task por um adaptador em `src/api/trackCreationApi.ts`, com semântica `submitTrackGoal(goalDescription)` e resultado aceito com `nextStep: 2`. Não afirmar que há persistência de backend. Manter o limite API para substituir o mock quando o contrato real existir.

**Rationale:** A descrição da SDB-41 fornece `mockSubmitStep1` e declara explicitamente que a chamada real ainda não está disponível. A aceitação do mock permite demonstrar o fluxo, mantendo validação e falha recuperável desacopladas da tela.

**Alternatives considered:** Chamar `POST /tracks/draft` imediatamente (o trecho aparece apenas como comentário TODO, sem serviço ou contrato confirmado); reutilizar `POST /trails/{trailId}/generation` (incorreto porque a geração é posterior e recebe um `trailId`); simular falha de rede como sucesso silencioso (contraria a confirmação explícita requerida pelo fluxo).

### Passagem do objetivo à etapa 2

**Decision:** Depois da resposta aceita do mock, navegar para `/trails/new/start` e levar o objetivo no `location state` da navegação. Se o envio falhar, permanecer na tela 1 mantendo o texto. Não persistir texto livre em `localStorage` nesta entrega.

**Rationale:** `/trails/new/start` já é a etapa marcada como 2 de 3 no app, enquanto a task define somente a resposta `nextStep: 2` e não exige retomada após recarregar. Estado de navegação compartilha o objetivo no fluxo sem criar um armazenamento permanente para conteúdo potencialmente pessoal.

**Alternatives considered:** Criar uma segunda rota de etapa 2 (duplicaria tela já existente); gravar a meta em armazenamento persistente (não requerido e aumenta retenção de texto pessoal); enviar à rota de geração (pula etapas existentes e contradiz a ordem do fluxo).

### Navegação de retorno e entrada

**Decision:** Usar `/trails/new` como caminho canônico em alinhamento com as rotas atuais em inglês e oferecer `/trilhas/nova` como alias. O item “Minhas Trilhas” na sidebar e o CTA de criação na seção de trilhas abrem a etapa inicial. Breadcrumb “Trilhas” volta a `/`, que contém a seção/listagem atual de trilhas.

**Rationale:** A task indica a sidebar como entrada do fluxo, e a referência visual destaca “Minhas Trilhas” durante essa tela. O aplicativo não tem rota independente de listagem; o dashboard (`HomeDashboardPage`/`TracksSection`) é o destino de retorno. `TrailStartPreferencePage` confirma que `/trails/new/start` é a etapa seguinte já existente.

**Alternatives considered:** Inventar `/trails` como listagem sem página existente; alterar a rota da etapa 2; enviar o breadcrumb a uma rota não implementada; manter a sidebar sem ação (não atende ao ponto de entrada descrito).

### Proteção de rota

**Decision:** A rota do novo fluxo só poderá ser integrada sob o limite autenticado definido pelo produto. O app examinado não contém `PrivateRoute` ou provider de autenticação; validar a integração existente antes de registrar a rota. Não implementar guarda fictícia nem deixar a nova rota pública.

**Rationale:** A constituição declara todas as rotas privadas por padrão, mas não há mecanismo local visível que permita afirmar como detectar a sessão autenticada.

**Alternatives considered:** Registrar como rota irrestrita (viola a constituição); acrescentar uma guarda que sempre permite acesso sem autenticação real (falsa proteção); implementar autenticação completa dentro da SDB-41 (escopo não especificado).

### Estilo e animação

**Decision:** Atender ao pedido explícito usando Tailwind CSS 4 integrado ao Vite e Motion for React para entrada do card, hover/tap dos chips e botão e movimento da seta. Importar as camadas de theme/utilities do Tailwind sem a camada base Preflight para proteger telas existentes; respeitar `prefers-reduced-motion` e não depender de animação para comunicar estado.

**Rationale:** As dependências ainda não existem; a configuração de Vite do Tailwind é a integração oficial atual e a documentação oficial permite importar theme/utilities separadamente para evitar Preflight. Motion for React fornece as propriedades de gesto citadas no pedido. A instalação foi pesquisada na documentação oficial porque o servidor MCP Context7 não está configurado nesta sessão.

**Alternatives considered:** Estender somente `App.css` e CSS transitions (preserva a stack atual, mas ignora bibliotecas explicitamente solicitadas); aplicar Tailwind Preflight em toda a aplicação (pode alterar visual de telas não relacionadas); adicionar outra biblioteca de animação (desnecessário).

### Acessibilidade e validação

**Decision:** Campo com label, validação após tentativa de avanço, anúncio de erro/status por região acessível, chips acionáveis por teclado e foco visível. Movimento reduzido desativa ou reduz animações não essenciais. Usar cenários manuais e gates existentes `npm run lint`/`npm run build`.

**Rationale:** Atende FR-005, FR-010 e FR-013. O repositório não possui runner de testes automatizados instalado.

**Alternatives considered:** Exibir erro somente por cor; chips sem semântica de botão; instalar framework de testes apenas para esta tela (ainda não requerido por convenção do repo).

## Limitações de pesquisa

- Recursos MCP Context7, Figma e Jira não estão disponíveis. A referência visual local foi consultada; para detalhes das bibliotecas foram consultadas as documentações oficiais: [Tailwind CSS com Vite](https://tailwindcss.com/docs/installation/using-vite), [desativação do Preflight no Tailwind v4](https://tailwindcss.com/docs/preflight) e [Motion for React](https://motion.dev/docs/react).
- O contrato do backend, a autenticação da aplicação e a rota independente de listagem não aparecem no código atual; foram mantidos explicitamente como dependências/limites, em vez de inventar endpoints ou mecanismos.
