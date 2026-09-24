# AGENTS.md

Instruções para agentes de IA que forem ler, gerar ou modificar código neste repositório.

## Contexto do projeto

Frontend em **React** (Vite + TypeScript). Antes de qualquer alteração, consultar:

- [`architecture.md`](./docs/architecture.md) — estrutura de diretórios, organização por domínio de páginas e componentes, e responsabilidade de cada pasta (`api`, `hooks`, `assets`, `util` etc).
- [`code_conventions.md`](./docs/code_conventions.md) — rotas protegidas, comunicação com APIs via instância do axios, padrão de Layouts, uso de arrow functions, convenção de hooks e Redux.

Essas convenções são normativas: qualquer código gerado deve segui-las sem exceção.

## Setup e execução

```bash
# instalar dependências
npm install

# subir a aplicação
npm run dev

# lint
npm run lint

# build de produção
npm run build
```

## Servidores MCP

Se o usuário enviar o ID da task do Jira (SDB-x, onde x é o número da task, exemplo: SDB-1), utilize o MCP do Jira e procure os dados da task no espaço do Sidebrain.

Além disso, utilize o MCP do Context7 para buscar a documentação atualizada de frameworks e bibliotecas.

Por fim, utilize o MCP do Figma para inspecionar os estilos, paddings, cores e tipografia da tela antes de gerar o CSS/Tailwind, usando como referência o link [https://www.figma.com/design/lbAZF1erny5hn6BZIc9EPc/Sidebrain?node-id=0-1&p=f&t=UFcKdOa107xe30qK-0](https://www.figma.com/design/lbAZF1erny5hn6BZIc9EPc/Sidebrain?node-id=0-1&p=f&t=UFcKdOa107xe30qK-0) (ou o link com o node-id específico do frame, caso fornecido diretamente no chat). Além disso, consulte a imagem de referência correspondente em /docs/img/ para bater o visual pixel a pixel; o nome da página/imagem virá indicado na descrição da task do Jira.

**Sempre responda em português brasileiro.**