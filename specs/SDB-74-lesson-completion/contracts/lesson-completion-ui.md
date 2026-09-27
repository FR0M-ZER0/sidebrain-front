# Contrato de Interface: Conclusão da Lição

## Objetivo

Definir o contrato entre o contêiner da tela de conclusão e a interface visual. Este documento não define API HTTP: o projeto ainda não fornece endpoints de lições/recompensas.

## Entrada de dados

- Receber dados de `LessonCompletion` conforme `../data-model.md`.
- Renderizar esta tela apenas quando `scorePercentage` for exatamente `100`.
- Tratar estado `loading`, resultado `ready`, erro de carregamento e estado de sincronização de XP/recompensas de forma distinta.
- A fixture da primeira entrega deve refletir os dados de exemplo da especificação. Dados ausentes não podem ser inventados nem convertidos em zero.

## Ações fornecidas pelo contêiner

| Ação | Comportamento requerido |
|---|---|
| `onStartNextLesson(lessonId)` | Iniciar a próxima lição fornecida. Não disponível quando `nextLesson` está ausente. A URL final depende de destino de lição existente. |
| `onReturnToTrails()` | O contêiner da página conduz ao dashboard existente em `/`; a ação permanece disponível nos estados de erro e carregamento. |
| `onViewProfile()` | Abrir perfil/conquistas. Destino não existe no roteador atual e deve ser fornecido pela aplicação. |
| `onRetrySync()` | Solicitar nova tentativa; a UI informa progresso e resultado sem bloquear saída. A garantia de evitar duplicidade no backend precisa do futuro contrato de serviço. |

## Interações e acessibilidade

- `Enter` aciona a ação primária somente quando a próxima lição estiver disponível e nenhuma navegação estiver em andamento.
- `Esc` aciona `onReturnToTrails()` uma única vez por ação.
- Clique, foco e hover devem fornecer feedback visual perceptível; controles devem continuar operáveis por teclado.
- O link de perfil desloca sua seta de forma sutil no hover.
- Respeitar preferência de movimento reduzido; conteúdo e ações não dependem do término da animação para ficarem disponíveis.
- Mensagens de loading, sucesso e falha não dependem só de cor.

## Estrutura visual

1. Cabeçalho com fechar, marca e sequência.
2. Símbolo de conclusão, indicador de 100%, identificação da lição e mensagem.
3. Card de sequência de estudos.
4. Três cards de métricas: XP, conquista e meta diária.
5. Resumo da próxima etapa, quando houver.
6. Ações de iniciar próxima lição e retornar às trilhas, dica do atalho `Enter` e rodapé.

O layout adapta ordem e largura para desktop, tablet e mobile sem cortar métricas ou esconder ações.

## Rota e segurança

- O roteador atual não tem rota de lição nem `PrivateRoute`/sistema de autenticação.
- Caminho da rota de conclusão e integração do fluxo devem ser decididos quando o contêiner e destinos existirem; não usar URL presumida para perfil ou próxima lição.
- A página isolada usa o callback injetado pelo host para iniciar a próxima lição e para abrir o perfil; nenhum caminho de URL é presumido para esses destinos.
- Não publicar rota sem autenticação real. A presença do componente, isoladamente, não estabelece autorização.
- A tela pode ser validada em harness/visualização interna enquanto o guard real está indisponível, desde que isso não seja tratado como rota autenticada pronta para produção.
