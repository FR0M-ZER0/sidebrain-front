# Quickstart: Conclusão da Lição

## Pré-requisitos

- Node.js e npm compatíveis com o projeto instalados.
- Dependências instaladas (`npm install`).
- A implementação da feature disponível na branch `SDB-74-lesson-completion`.
- Para inspeção visual, usar `docs/img/Sidebrain - Lição Concluída (Desktop).png` como referência local. A integração deve aguardar guard de autenticação e destinos reais para ser navegável em produção.
- O Tailwind v4 requer navegadores modernos (Safari 16.4+, Chrome 111+, Firefox 128+); confirmar que a matriz de suporte do produto é compatível antes de integrar.

## Verificações estáticas

Na raiz do repositório:

```bash
npm run lint
npm run build
```

**Esperado**: ESLint e compilação/empacotamento concluem sem erros.

Após adicionar Tailwind, conferir no browser que a inicialização do tema/utilitários não alterou globalmente as telas existentes; a adoção inicial deve evitar Preflight.

## Validação manual

Inicie a aplicação:

```bash
npm run dev
```

Use o harness visual ou fluxo de desenvolvimento previsto na implementação. A rota real não deve ser publicada desprotegida; destinos de navegação podem ser substituídos por spies/callbacks durante o teste isolado.

### Cenário: conclusão perfeita e dados completos

1. Carregue a fixture correspondente ao exemplo da Lição 3 com `scorePercentage: 100`.
2. Confirme cabeçalho, feedback, sequência, três cards, próxima lição e ações contra a imagem local.
3. Confirme que o ícone entra com destaque e que os três cards aparecem em sequência.
4. Confirme que os dados XP e meta são coerentes e os textos/estados não dependem apenas de cor.

**Esperado**: todas as informações do resultado perfeito aparecem sem usar a tela de resultado de quiz.

### Cenário: pontuação menor que 100%

1. Forneça uma conclusão com `scorePercentage < 100`.

**Esperado**: a página de conclusão não é apresentada; o contêiner encaminha ao fluxo distinto. Nenhum indicador “100% Acerto” é exibido indevidamente.

### Cenário: carregamento e falha de consulta

1. Inicie a visualização no estado `loading`.
2. Confirme placeholders do cabeçalho e dos três cards, sem XP ou valores inventados.
3. Simule falha de carregamento.

**Esperado**: mensagem compreensível, sem recompensas fictícias e com opção de retorno.

### Cenário: erro e retry de sincronização

1. Carregue os dados completos e simule falha ao sincronizar recompensas.
2. Acione “Tentar novamente” e simule sucesso; repita com falha.
3. Durante o retry, acione uma opção de saída.

**Esperado**: aviso temporário, estado de retry compreensível, saída disponível e sem confirmação falsa de XP salvo. Uma integração real também deve validar idempotência com o contrato do backend.

### Cenário: ações de teclado e navegação

1. Com próxima lição disponível, pressione `Enter` e confirme uma chamada a `onStartNextLesson`.
2. Pressione `Esc` e confirme uma chamada única a `onReturnToTrails`.
3. Com navegação pendente, pressione as teclas novamente.
4. Sem próxima etapa, verifique ação primária desabilitada e retorno disponível.
5. Acione “Ver perfil” e confirme `onViewProfile` sem presumir uma rota não implementada.

**Esperado**: ações equivalentes às instruções visíveis, sem navegação duplicada.

### Cenário: responsividade e movimento reduzido

1. Validar larguras desktop, tablet e mobile.
2. Ativar preferência de redução de movimento no sistema/browser e recarregar.

**Esperado**: cards refluem sem cortes/sobreposição, todas as ações continuam acessíveis e a preferência reduz ou remove deslocamentos sem ocultar o conteúdo.
