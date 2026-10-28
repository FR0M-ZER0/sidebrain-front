# Prompt para implementar substituições por componentes existentes

Use o texto abaixo como instrução para o agente responsável por implementar as recomendações de `docs/prompts/check-component-replacements.md`:

```text
Implemente as substituições compatíveis identificadas por `docs/prompts/check-component-replacements.md`. Substitua os elementos de interface relatados por componentes que já existam no projeto, usando suas APIs atuais e preservando a aparência, o comportamento e a acessibilidade esperados.

## Defina o escopo

1. Leia `AGENTS.md`, `docs/architecture.md` e `docs/code_conventions.md` antes de fazer alterações.
2. Use o relatório de análise fornecido pelo usuário ou o relatório mais recente de `check-component-replacements.md` na conversa. Se o usuário selecionar recomendações específicas, implemente somente essas; caso contrário, implemente todas as recomendações classificadas como substituições diretas ou substituições com adaptação no ponto de uso, seguindo a ordem de prioridade do relatório.
3. Se não houver um relatório disponível ou não for possível identificar qual relatório deve ser usado, peça ao usuário que o forneça ou execute primeiro o prompt de análise. Não deduza uma lista de substituições apenas pelos nomes dos componentes.
4. Considere fora do escopo de implementação os candidatos classificados como bloqueados ou inadequados. Se o usuário selecionar um deles, explique a limitação registrada e, quando relevante, solicite o contexto ausente, em vez de alterar silenciosamente o contrato do componente substituto.
5. Inspecione `git status` e os diffs relevantes. Preserve o trabalho preexistente do usuário; não o descarte, sobrescreva, prepare para commit nem commite. Não crie commits nem faça push, a menos que isso seja solicitado explicitamente.

## Revalide a compatibilidade

1. Leia cada elemento-alvo em seu contexto atual e inspecione a implementação, as propriedades exportadas, os estilos, os usos existentes e os testes relevantes do componente proposto. Confirme se o relatório ainda corresponde ao código atual.
2. Verifique se a API existente aceita o conteúdo, o layout, as interações, os estados de carregamento e desabilitado, o feedback de validação, a acessibilidade, as refs e o comportamento específico de plataforma necessários, quando aplicável.
3. Confirme que o componente pode ser importado no local-alvo sem violar os limites da arquitetura nem introduzir dependências circulares. Não mova nem promova componentes locais de tela como parte de uma tarefa limitada à substituição.
4. Se uma recomendação já estiver implementada, registre-a como atendida. Se agora ela exigir propriedades não aceitas, alterações no componente compartilhado ou decisões comportamentais ainda não resolvidas, registre o impedimento e prossiga com as substituições compatíveis independentes.

## Aplique as substituições

1. Substitua a marcação identificada ou o uso de componente local pelo componente existente proposto, importando-o conforme o padrão de exports adotado pelo repositório.
2. Mapeie conteúdo, dados, callbacks, filhos, estilos e variantes disponíveis para a API real do componente. Nas substituições que exigirem adaptação, mantenha as alterações pequenas e locais ao chamador, preservando os argumentos dos eventos, a responsabilidade pelo estado e o comportamento existente.
3. Preserve a semântica de acessibilidade, o comportamento de foco e refs, as áreas de toque, o comportamento de carregamento e desabilitado e o tratamento específico de plataforma, quando aplicável. Use as opções de composição e estilização aceitas sem contornar o contrato do componente.
4. Use os componentes existentes como estão implementados. Não introduza novos componentes reutilizáveis, não adicione propriedades ou variantes ao componente substituto, não altere seu comportamento padrão e não use coerções de tipo inseguras para forçar compatibilidade. Se algo disso se tornar necessário, marque a substituição como bloqueada e explique o motivo.
5. Remova imports, wrappers locais, estilos e helpers que se tornarem inutilizados pela substituição somente depois de verificar todos os usos restantes. Exclua um componente local substituído apenas quando os usos selecionados tiverem sido migrados e não houver outros usos.
6. Conclua todas as substituições compatíveis no escopo selecionado sem fazer refatorações não relacionadas nem adicionar adaptadores que, na prática, recriem o elemento original.

## Verifique e apresente os resultados

1. Revise o diff para confirmar que os elementos selecionados agora usam os componentes existentes previstos, que o código obsoleto foi removido com segurança e que as implementações e APIs públicas dos componentes compartilhados foram preservadas.
2. Execute `npm run lint`, os testes existentes relevantes e a verificação TypeScript disponível no projeto. Inspecione a configuração do repositório para escolher os comandos corretos. Corrija problemas introduzidos pelas substituições e diferencie falhas preexistentes de falhas novas.
3. Adicione ou atualize testes pontuais somente quando a adaptação no ponto de uso introduzir um risco significativo de regressão, como o mapeamento de callbacks ou o comportamento desabilitado. Mantenha os testes no diretório raiz `__tests__` e evite testes que apenas confirmem a presença do componente escolhido.
4. Faça as verificações visuais, de interação e acessibilidade pertinentes quando o ambiente de execução estiver disponível. Informe explicitamente as verificações indisponíveis, em vez de afirmar que a equivalência foi confirmada.
5. Responda no idioma do usuário. Liste cada elemento substituído, o componente usado, os caminhos dos arquivos afetados e quaisquer adaptações feitas no ponto de uso. Classifique cada recomendação selecionada como concluída, já atendida ou bloqueada, com o respectivo motivo, e informe as verificações executadas, os resultados e as limitações restantes.
```
