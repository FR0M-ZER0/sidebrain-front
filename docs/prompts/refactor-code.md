# Prompt para refatorar código sem alterar o comportamento

Use o texto abaixo como instrução para o agente responsável por refatorar a parte do código indicada pelo usuário:

```text
Refatore somente a parte do código indicada pelo usuário, seguindo rigorosamente as instruções abaixo. A tarefa deve melhorar a estrutura interna do código sem alterar o comportamento observável, a aparência, a acessibilidade, as interfaces públicas ou os resultados da aplicação. Não implemente funcionalidades, correções ou mudanças de design como parte da refatoração.

## Identifique o escopo

1. Use como escopo exclusivamente o objetivo ou alvo de refatoração descrito pelo usuário. Ele pode indicar, por exemplo, uma estrutura de diretórios, o uso de uma biblioteca, uma função, um componente ou outra parte específica do código.
2. Se o usuário não fornecer nenhum objetivo ou alvo de refatoração, não escolha uma área por conta própria nem suponha o que deve ser refatorado. Informe que falta essa definição e peça ao usuário que indique o que deseja refatorar; não altere arquivos até receber essa informação.
3. Se a solicitação for ambígua, ampla demais ou não identificar os limites da área a alterar, peça somente os esclarecimentos necessários antes de fazer mudanças que possam ultrapassar o escopo pretendido.
4. Leia `AGENTS.md`, `docs/architecture.md` e `docs/code_conventions.md` antes de alterar o código. Siga a arquitetura, as convenções e os padrões existentes no repositório.
5. Inspecione `git status` e os diffs relevantes antes de editar. Preserve o trabalho preexistente do usuário; não o descarte, sobrescreva, prepare para commit nem commite. Não crie commits nem faça push, a menos que isso seja solicitado explicitamente.

## Estabeleça o comportamento atual

1. Leia a implementação completa do alvo e os pontos que dependem dele, incluindo chamadas, imports, exports, estilos, configuração, testes e documentação relevantes.
2. Identifique os contratos observáveis que devem permanecer idênticos: entradas e saídas, tipos e formatos de dados, efeitos colaterais, ordem e argumentos de callbacks, erros, estados, navegação, persistência, acessibilidade, aparência visual e comportamento responsivo.
3. Para refatorações que envolvam mover arquivos ou alterar a estrutura de diretórios, localize e verifique todos os imports, referências, rotas, configurações e scripts afetados. Preserve caminhos e exports públicos sempre que fizerem parte de um contrato existente; atualize todas as referências internas necessárias sem deixar compatibilidade quebrada.
4. Para refatorações que envolvam trocar ou introduzir o uso de uma biblioteca, confirme que a biblioteca e sua versão são compatíveis com o projeto e que suas diferenças de comportamento não alteram os contratos existentes. Se não for possível preservar o comportamento com segurança, não faça a troca e explique o impedimento.
5. Use testes existentes e o comportamento atual como referência. Não trate como oportunidade para corrigir bugs, alterar inconsistências observáveis ou reinterpretar requisitos: mantenha também o comportamento existente que pareça inesperado, a menos que o usuário autorize uma mudança separada.

## Faça a refatoração

1. Aplique a menor mudança coesa que atenda ao objetivo informado pelo usuário. Limite as alterações ao escopo acordado e evite limpezas ou refatorações não relacionadas.
2. Preserve comportamento externo e visual: não altere textos, estilos, layout, fluxos de interação, estados, APIs públicas, regras de negócio, validações ou efeitos colaterais. Mudanças internas de organização, nomes privados ou estrutura só são aceitáveis quando não quebram consumidores nem tornam observável um comportamento diferente.
3. Mantenha compatibilidade com os consumidores existentes. Não remova, renomeie ou altere interfaces públicas sem autorização explícita. Se o objetivo solicitado exigir uma mudança incompatível, interrompa essa parte e explique o conflito antes de prosseguir.
4. Atualize imports, referências, configuração e testes afetados pela refatoração. Não altere testes apenas para fazê-los passar se isso enfraquecer ou modificar as garantias existentes.
5. Não adicione dependências, abstrações ou camadas que não sejam necessárias para o objetivo indicado. Se uma decisão de implementação puder mudar comportamento ou aparência, não a presuma: mantenha a implementação atual e peça esclarecimento quando necessário.

## Verifique e apresente os resultados

1. Revise o diff para confirmar que as alterações ficaram dentro do escopo e não introduziram mudanças funcionais, visuais ou de contrato. Verifique também que todos os imports, exports, referências e caminhos afetados continuam válidos.
2. Execute `npm run lint`, os testes relevantes e a verificação TypeScript disponível no projeto. Inspecione a configuração do repositório para escolher os comandos corretos. Corrija problemas introduzidos pela refatoração e diferencie falhas preexistentes de falhas novas.
3. Execute ou descreva verificações pertinentes para os contratos identificados, incluindo testes visuais ou de interação quando aplicáveis e disponíveis. Não afirme equivalência, cobertura ou aprovação em verificações sem evidências; informe claramente qualquer verificação que não pôde ser feita.
4. Se não for possível demonstrar que o comportamento e a aparência foram preservados, não declare a refatoração concluída como neutra. Explique a incerteza ou o impedimento e solicite orientação quando a decisão depender do usuário.
5. Responda no idioma do usuário. Resuma o objetivo solicitado, as alterações internas realizadas, os arquivos afetados e as verificações executadas com seus resultados. Declare explicitamente se houve algum impedimento ou risco de mudança observável.
```
