# Contrato da criação inicial de trilha

## Escopo e transporte

Este documento descreve a interação de UI e o adaptador mock da SDB-41. Não define um endpoint de backend disponível. Uma integração HTTP futura deve usar a instância Axios exportada por `src/api/api.ts` e precisa ser acordada com o backend.

## Submissão do objetivo (mock desta versão)

Operação conceitual: `submitTrackGoal(goalDescription: string)`.

- Entrada: texto final editado pelo usuário, não vazio após remoção de espaços periféricos.
- Durante a operação: apresentar processamento e impedir solicitações repetidas.
- Aceite do mock: `{ "success": true, "nextStep": 2 }`.
- Após aceite: navegar para `/trails/new/start`, levando a meta em estado de navegação.
- Falha: manter a pessoa na etapa inicial, preservar texto e permitir nova tentativa.
- Não emitir sucesso de backend: o mock é somente uma simulação local enquanto a API não estiver definida.

O trecho `POST /tracks/draft` com `{ "goal": "..." }` citado na descrição original é uma sugestão comentada/TODO, não um endpoint confirmado. Confirmar rota, nome do campo, resposta (incluindo identificador de rascunho/trilha), códigos de erro e idempotência antes de ativar comunicação real.

## Rotas de UI

| Caminho | Comportamento |
|---|---|
| `/trails/new` | Abre a etapa 1; caminho canônico alinhado às rotas existentes |
| `/trilhas/nova` | Alias equivalente solicitado na descrição |
| `/trails/new/start` | Etapa 2 existente; recebe a meta aceita em estado de navegação |
| `/` | Retorno do breadcrumb à área atual que contém a seção/listagem de trilhas |

O item “Minhas Trilhas” na sidebar e o CTA “Criar Nova Trilha com IA” abrem `/trails/new`; o breadcrumb “Trilhas” retorna a `/`.

As rotas de criação são privadas e só podem ser registradas sob o limite autenticado do produto. O projeto inspecionado não apresenta `PrivateRoute`/integração de autenticação; não considerar uma rota pública como alternativa aceitável.

## Contrato de interação

- Os chips são controles selecionáveis por teclado e ponteiro/toque; ativar um insere o respectivo `label` na descrição e permite edição.
- A submissão vazia ou somente com espaços é impedida e explicada junto ao campo.
- O botão de avanço mostra processamento durante envio e volta a permitir tentativa após falha.
- O breadcrumb “Trilhas” sempre oferece caminho de saída para `/`.
- Mensagens de validação, falha e processamento precisam ser comunicadas semanticamente a tecnologias assistivas.
