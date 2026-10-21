# Prompt para verificar componentes reutilizáveis

Use o texto abaixo como instrução para o agente responsável por identificar elementos de interface repetidos que possam se tornar componentes reutilizáveis:

```text
Inspecione este projeto em busca de elementos de interface repetidos que possam ser consolidados em componentes reutilizáveis. Recomende extrações práticas que reduzam a duplicação sem comprometer a consistência visual nem o comportamento esperado. Esta é uma tarefa de análise somente leitura: apresente as descobertas na conversa sem modificar arquivos nem implementar refatorações.

## Inspecione o projeto

1. Leia `AGENTS.md`, `docs/architecture.md` e `docs/code_conventions.md` antes de analisar o código. Siga os limites entre camadas e as convenções do projeto para localização, nomenclatura e estilização de componentes.
2. Inspecione `src/screens/`, `src/components/` e os estilos compartilhados relevantes. Procure estruturas JSX, estilos, padrões de interação e estados de interface repetidos, mesmo quando seus nomes forem diferentes. Exemplos incluem botões, campos, cartões, cabeçalhos, itens de lista, modais, indicadores de carregamento e estados vazios ou de erro.
3. Inspecione os componentes reutilizáveis existentes e seus usos antes de propor novos componentes. Identifique casos em que um componente existente possa substituir marcação duplicada ou receber uma extensão pequena e coerente.
4. Leia cada ocorrência candidata em seu contexto, incluindo propriedades, handlers, dependências de dados e testes relevantes. Baseie as descobertas no código real, não apenas nos nomes ou em classes correspondentes.

## Avalie oportunidades de reutilização

1. Exija pelo menos duas ocorrências concretas para cada descoberta de duplicação. Diferencie estrutura e comportamento compartilhados de semelhanças visuais superficiais ou requisitos de negócio intencionalmente distintos.
2. Identifique a responsabilidade de interface em comum e as diferenças que precisam ser preservadas, incluindo acessibilidade, estados de carregamento e desabilitado, feedback de validação e comportamento específico de plataforma, quando aplicável.
3. Prefira reutilizar um componente existente quando for adequado. Caso contrário, proponha um componente específico com uma API de propriedades tipada e pequena ou pontos de composição. Evite abstrações especulativas e componentes com muitas flags condicionais para casos de uso sem relação entre si.
4. Coloque a interface reutilizável em toda a aplicação em `src/components/` e os componentes exclusivos de uma tela na pasta `components/` dessa tela. Mantenha a lógica de negócio e o acesso a dados fora dos componentes compartilhados, recebendo dados e callbacks por propriedades. Não introduza dependências de componentes compartilhados em telas.
5. Diferencie extração de componente de reutilização de estilos. Se apenas tokens visuais ou estilos simples de layout estiverem duplicados, explique se os tokens de tema existentes ou primitivos de estilo compartilhados são suficientes, em vez de propor um novo componente.
6. Atribua prioridade alta, média ou baixa considerando o número de ocorrências, o benefício de manutenção, inconsistências existentes, esforço de implementação e risco de regressão. Explique o equilíbrio entre esses fatores, sem priorizar apenas pela quantidade de repetições.

## Apresente as descobertas

1. Responda no idioma do usuário. Comece com um breve resumo do escopo inspecionado e das principais oportunidades de reutilização.
2. Apresente uma tabela ordenada por prioridade com o elemento repetido, os arquivos afetados, a ação recomendada (reutilizar, estender ou extrair) e uma justificativa breve.
3. Para cada recomendação, inclua:
   - Pelo menos duas referências concretas às ocorrências, com caminhos dos arquivos e números das linhas.
   - A estrutura e o comportamento compartilhados, além das diferenças que precisam continuar sendo aceitas.
   - O componente existente a reutilizar ou o nome e a localização propostos para o componente.
   - Uma proposta concisa de API de propriedades ou composição, seguindo as convenções TypeScript do projeto.
   - O benefício esperado, o esforço estimado e riscos específicos de regressão.
   - Testes existentes relevantes ou verificações pontuais necessárias para validar uma refatoração futura.
4. Mencione casos semelhantes importantes que devem permanecer separados e explique o motivo. Não invente descobertas para preencher o relatório; declare claramente quando não houver extrações que valham a pena.
5. Termine com a ordem de refatoração recomendada e quaisquer limitações da inspeção. Diferencie duplicações confirmadas de casos que exigem investigação adicional e não afirme que a cobertura foi completa, a menos que todo o escopo relevante tenha sido inspecionado.
```
