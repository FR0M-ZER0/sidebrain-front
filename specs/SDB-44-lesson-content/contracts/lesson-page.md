# Contrato de UI: Página de Leitura da Lição

## Rota e entrada

- Caminho lógico: `/lessons/:id`, registrado no React Router 7.
- `id` identifica a lição; ausência/invalidade ou lição inexistente resulta em estado de erro amigável, sem conteúdo inventado.
- A rota deve ser privada e ficar sob o guard de autenticação do produto. O repositório atual não contém `PrivateRoute` nem provider de autenticação; a integração do guard é pré-requisito para registrar a rota em ambiente protegido.
- Contexto de navegação pode informar o destino de retorno ao módulo/trilha. Sem destino válido, não criar navegação fictícia; manter retorno seguro ao contexto de origem/painel disponível.

## Dados apresentados

A fonte de dados entrega o shape da entidade `Lesson` descrito em [data-model.md](../data-model.md). Os blocos são exibidos pela ordem da lista. `image` usa URL, legenda e texto alternativo opcionais; o texto alternativo vem da descrição fornecida e não é inferido da legenda. `paragraph` usa texto didático. O mock inicial representa o Teorema de Pitágoras, posição 3 de 8, 35% concluído e sequência 12.

## Interações

- Breadcrumb: níveis não atuais com destino válido são links; níveis sem destino são texto simples; a lição atual é indicada como atual.
- Progresso: apresentar “Lição X de Y”, percentual textual e barra correspondente; mudanças não bloqueiam leitura.
- Sair: botão do cabeçalho e tecla `Escape` abrem o mesmo diálogo de confirmação. Cancelar mantém lição e posição; confirmar retorna uma vez ao destino válido.
- `Escape` é ignorado enquanto um controle de texto estiver recebendo entrada ou quando o diálogo já estiver aberto; segundo acionamento não duplica navegação.
- Erro de carregamento: botão “Tentar novamente” repete a solicitação ao adaptador e mantém a estrutura utilizável.
- Motion: efeitos de hover/tap e transições de entrada/progresso são não essenciais; conteúdo e controles continuam disponíveis com movimento reduzido.

## Estados e acessibilidade

- `loading`: skeleton sem valores fictícios.
- `success`: título, figura/legenda e parágrafos.
- `error`: mensagem, repetição e saída disponível.
- saída: diálogo com rótulo acessível, foco inicial adequado, contenção do foco, cancelamento e retorno do foco ao acionador ao fechar.
- barra: expor papel/valor acessível e percentual textual; estados não comunicados somente por cor.
- imagens: texto alternativo derivado de descrição fornecida quando disponível; não usar legenda como texto alternativo automaticamente sem indicação de equivalência.

## Limite de integração

Nenhum endpoint de lições está documentado no repositório. A primeira implementação usa adaptador mockado; integração futura usa a instância Axios em `src/api/api.ts`. O contrato não define URL, método HTTP, cache, autenticação de API ou schema de servidor.
