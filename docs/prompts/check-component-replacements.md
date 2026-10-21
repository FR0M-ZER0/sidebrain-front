# Prompt para verificar substituições por componentes existentes

Use o texto abaixo como instrução para o agente responsável por verificar se elementos da interface podem ser substituídos por componentes já existentes no projeto:

```text
Inspecione a interface do projeto em busca de elementos que possam ser substituídos por componentes existentes. Identifique oportunidades concretas de usar a biblioteca de componentes atual, preservando a aparência, o comportamento e a acessibilidade esperados. Esta é uma tarefa de análise somente leitura: apresente as descobertas na conversa sem modificar arquivos nem implementar substituições.

## Defina o escopo

1. Leia `AGENTS.md`, `docs/architecture.md` e `docs/code_conventions.md`. Siga as convenções do projeto para localização de componentes, limites entre dependências, nomenclatura e estilização.
2. Se o usuário fornecer um arquivo, tela, componente ou trecho de código, concentre-se nesses elementos e inspecione o contexto ao redor e os possíveis componentes substitutos. Se nenhum alvo for informado, inspecione `src/screens/` e `src/components/` em busca de oportunidades de substituição.
3. Se não for possível localizar o alvo fornecido ou se ele for ambíguo, explique a limitação e solicite o contexto ausente. Não substitua silenciosamente o alvo por outro nem afirme compatibilidade com base em um trecho isolado quando faltar contexto essencial.

## Inspecione os componentes existentes

1. Identifique os componentes compartilhados existentes e os componentes locais de tela que podem ser usados no escopo inspecionado. Leia suas implementações, propriedades exportadas, estilos, usos e testes relevantes; não se baseie apenas nos nomes.
2. Identifique elementos que reproduzam responsabilidades já cobertas por esses componentes, como botões, campos de texto, cartões, cabeçalhos, itens de lista, layouts de modal, indicadores de carregamento e estados vazios ou de erro.
3. Verifique se cada componente candidato pode ser importado no local-alvo sem violar os limites entre camadas nem introduzir dependências circulares. Não recomende importar componentes locais de uma tela em componentes compartilhados ou em telas sem relação.

## Avalie cada substituição

1. Compare o elemento atual com a API e a implementação reais do componente existente. Verifique conteúdo, layout, tokens de tema, variantes disponíveis, handlers de interação, estados de carregamento e desabilitado, acessibilidade, refs e comportamento específico de plataforma, quando relevante.
2. Explique como os dados, callbacks, filhos e estilos do elemento atual correspondem às propriedades ou aos pontos de composição aceitos pelo componente. Identifique adaptações necessárias no ponto de uso e confirme que elas preservam o comportamento.
3. Classifique cada candidato como:
   - **Substituição direta:** o componente existente já aceita a aparência e o comportamento necessários.
   - **Substituição com adaptação no ponto de uso:** a API existente é suficiente, mas o chamador precisa de um mapeamento pequeno ou de uma alteração de composição que preserve o comportamento.
   - **Bloqueado:** faltam recursos necessários no componente, não é possível confirmar a compatibilidade ou seu uso violaria os limites da arquitetura.
4. Recomende somente substituições compatíveis com a API existente do componente. Não invente propriedades, proponha novos componentes nem apresente uma alteração no próprio componente como se já fosse uma substituição disponível. Se for necessária uma extensão, identifique o recurso ausente entre os candidatos bloqueados.
5. Não recomende uma substituição apenas porque os elementos são visualmente semelhantes. Preserve diferenças relevantes de semântica, requisitos de negócio, acessibilidade e interação. Evite adaptadores ou substituições de estilo que, na prática, recriem o elemento original ou contornem o contrato previsto para o componente.
6. Priorize as substituições compatíveis com base nos ganhos de consistência, benefício de manutenção, esforço de implementação e risco de regressão. Uma única ocorrência é suficiente quando um componente existente já atende à responsabilidade correspondente.

## Apresente as descobertas

1. Responda no idioma do usuário e resuma o escopo inspecionado e se foram encontradas substituições compatíveis.
2. Apresente uma tabela priorizada com o elemento atual, sua referência de arquivo e linha, o componente substituto existente, a classificação de compatibilidade e uma justificativa breve.
3. Para cada substituição recomendada, inclua:
   - A localização do elemento atual e as localizações da implementação e dos exports do componente existente.
   - Evidências de que o componente aceita o comportamento necessário, citando propriedades relevantes, detalhes da implementação ou usos existentes.
   - Um mapeamento conciso do conteúdo, dos dados, dos callbacks e dos estilos atuais para a API existente.
   - As adaptações necessárias no ponto de uso, os benefícios esperados e os riscos específicos de regressão.
   - Testes existentes relevantes ou verificações visuais, de interação e acessibilidade pontuais para uma substituição futura.
4. Liste separadamente os candidatos bloqueados ou inadequados relevantes, explicando o recurso ausente ou a incompatibilidade. Diferencie incompatibilidades confirmadas de casos sem contexto suficiente.
5. Termine com a ordem recomendada para as substituições e quaisquer limitações da inspeção. Se nenhuma substituição compatível for encontrada, declare isso claramente, em vez de propor novas abstrações para preencher o relatório. Não afirme que verificações foram executadas se isso não ocorreu.
```
