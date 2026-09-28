# Contrato de UI: Detalhes da Trilha

## Entrada

- `slug`: identificador da trilha selecionada pela rota.
- Dados demonstrativos obtidos pelo serviço da feature durante esta entrega.
- Callbacks de navegação para destinos já integrados: retorno ao dashboard/listagem e abertura de lição por identificador.

## Estados da página

| Estado | Conteúdo observável |
|---|---|
| Loading | Skeletons para cabeçalho/resumo, missões e módulos; sem valores fictícios. |
| Success | Dados do TrackDetails organizados em resumo e roteiro. |
| Error, se aplicável à fonte substituível | Mensagem compreensível e nova tentativa; dados não devem ser apresentados como válidos. |

## Ações e resultados

| Ação | Disponibilidade | Resultado |
|---|---|---|
| Breadcrumb “Trilhas Ativas” | Sempre que houver retorno válido | Retorna à âncora da lista no dashboard (`/#tracks`). |
| “Ver todas as missões” | Exibida no painel de missões | Navega à âncora de missões no dashboard (`/#missions`), junto à área de badges. |
| Expandir/recolher módulo | Módulos concluídos/em andamento | Alterna visibilidade de lições e atualiza `aria-expanded`. |
| Expandir módulo bloqueado | Indisponível | Não altera conteúdo nem estado. |
| “Iniciar” | Lição `available` com destino válido | Navega para `/lessons/:id`, preservando origem para retorno. |
| “Revisar” | Lição `completed` com destino válido | Navega para conteúdo `/lessons/:id` correspondente. |
| “Bloqueada” | Lição `locked` | Controle desabilitado, sem navegação. |

## Acessibilidade e apresentação

- Expanders devem ser botões operáveis por teclado, anunciar expansão e identificar o painel associado.
- Progresso geral e de missão deve ter nome acessível e valor textual; incompatibilidade de contagem/percentual deve ser anunciada sem depender apenas de cor.
- Cores não são o único indicador de estados: usar texto e ícones para concluído, disponível e bloqueado.
- Hover/tap anima os controles sem impedir foco de teclado; respeitar preferência de movimento reduzido.
- Em desktop, resumo/missões ficam ao lado do roteiro; em tablet/celular, conteúdo reflui sem rolagem horizontal.

## Dependências de integração

- A rota privada `/trails/:slug` só pode ser conectada a `App.tsx` quando a aplicação disponibilizar guard de autenticação real.
- As âncoras `#tracks` e `#missions` devem corresponder a elementos identificados nas respectivas seções existentes do dashboard.
