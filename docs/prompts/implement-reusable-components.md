# Prompt para implementar componentes reutilizáveis

Use o texto abaixo como instrução para o agente responsável por implementar as recomendações de `docs/prompts/check-reusable-components.md`:

```text
Implemente as recomendações de componentes reutilizáveis produzidas por `docs/prompts/check-reusable-components.md`. Reduza duplicações de interface confirmadas por meio da reutilização, extensão ou extração propostas, preservando a aparência, o comportamento e a acessibilidade esperados.

## Defina o escopo

1. Leia `AGENTS.md`, `docs/architecture.md` e `docs/code_conventions.md` antes de fazer alterações.
2. Use o relatório de análise fornecido pelo usuário ou o relatório mais recente de `check-reusable-components.md` na conversa. Se o usuário selecionar recomendações específicas, implemente somente essas; caso contrário, implemente todas as recomendações acionáveis do relatório, seguindo a prioridade e a ordem de dependência indicadas.
3. Se não houver um relatório disponível ou não for possível identificar qual relatório deve ser usado, peça ao usuário que o forneça ou execute primeiro o prompt de análise. Não invente descobertas nem amplie esta tarefa para uma refatoração não relacionada de todo o projeto.
4. Inspecione `git status` e os diffs relevantes. Preserve o trabalho preexistente do usuário; não o descarte, sobrescreva, prepare para commit nem commite. Não crie commits nem faça push, a menos que isso seja solicitado explicitamente.

## Revalide as recomendações

1. Leia as implementações atuais, os pontos de uso afetados, os componentes reutilizáveis existentes, os estilos e os testes relevantes. Trate os números de linha do relatório como pistas de navegação e verifique o código atual antes de editar.
2. Confirme que cada extração proposta ainda tem pelo menos duas ocorrências relevantes e uma responsabilidade de interface compartilhada coerente. Se um componente existente já atender ao requisito, reutilize-o em vez de introduzir uma duplicata.
3. Identifique as variações aceitas, os requisitos de acessibilidade, os handlers de interação, os estados de carregamento e desabilitado e o comportamento específico de plataforma. Resolva os detalhes de implementação com base no código e nas convenções; pergunte apenas quando uma decisão de produto ainda não resolvida puder alterar o comportamento esperado.
4. Ignore recomendações já implementadas, sem justificativa atual, incompatíveis com a arquitetura ou ainda sem contexto essencial. Registre o motivo e prossiga com os itens acionáveis independentes.

## Implemente a refatoração

1. Faça a menor alteração coesa para cada recomendação. Reutilize ou estenda um componente existente quando isso for indicado pelo relatório; caso contrário, extraia a interface comum para um componente específico, com uma API tipada pequena de propriedades ou composição.
2. Coloque a interface compartilhada em `src/components/<Name>/`, com exports nomeados e um arquivo agregador `index.ts`. Mantenha os componentes exclusivos de uma tela na pasta `components/` dessa tela. Siga as convenções NativeWind e de tema do repositório, usando estilos separados apenas quando apropriado.
3. Mantenha a lógica de negócio, as decisões de navegação e o acesso a dados nas camadas responsáveis atuais. Passe dados e callbacks por propriedades e evite dependências de componentes compartilhados em telas ou imports circulares.
4. Preserve os consumidores existentes ao estender um componente. Adicione somente os recursos necessários para as recomendações selecionadas; evite variantes especulativas, reformulações de API não relacionadas ou flags condicionais para responsabilidades distintas.
5. Migre todas as ocorrências aplicáveis identificadas nas recomendações selecionadas. Preserve conteúdo, layout, semântica dos eventos, refs, acessibilidade e diferenças significativas entre os chamadores. Não deixe um componente extraído sem uso nem migre apenas uma ocorrência sem explicar o impedimento para as demais.
6. Quando uma recomendação tratar apenas de tokens ou estilos compartilhados, aplique os primitivos de estilo existentes apropriados, em vez de forçar a extração de um componente.
7. Remova imports, marcação, estilos e helpers que se tornarem obsoletos pela refatoração somente depois de confirmar que não têm outros consumidores. Mantenha fora da alteração as limpezas não relacionadas.

## Verifique e apresente os resultados

1. Revise o diff quanto ao escopo, aos limites dos componentes, às ocorrências migradas e a mudanças visuais ou comportamentais não intencionais.
2. Execute `npm run lint`, os testes existentes relevantes e a verificação TypeScript disponível no projeto. Inspecione a configuração do repositório para escolher os comandos corretos. Corrija problemas introduzidos pela refatoração e diferencie falhas preexistentes de falhas novas.
3. Adicione ou atualize testes pontuais somente quando necessário para cobrir comportamentos relevantes ou riscos de regressão introduzidos pela extração ou extensão. Mantenha os testes no diretório raiz `__tests__/`, seguindo as convenções do repositório; evite testes que apenas reproduzam a marcação.
4. Faça as verificações visuais, de interação e acessibilidade pertinentes quando o ambiente de execução estiver disponível. Identifique claramente as verificações que não puderam ser feitas; não afirme paridade visual ou aprovação em verificações sem tê-las confirmado.
5. Responda no idioma do usuário. Resuma os componentes reutilizados, estendidos ou criados, seus caminhos e os pontos de uso migrados. Classifique cada recomendação selecionada como concluída, já atendida ou ignorada, com o respectivo motivo, e informe as verificações executadas, os resultados e os impedimentos restantes.
```
