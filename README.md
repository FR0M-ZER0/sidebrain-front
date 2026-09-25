# Sidebrain Frontend

Frontend em React para o ecossistema Sidebrain, responsável por entregar a interface web da aplicação, organizar as rotas da plataforma e consumir a API do backend.

## 🚀 Stack tecnológica

Este projeto utiliza as seguintes tecnologias e ferramentas:

- React 19 — biblioteca principal para construção da interface
- Vite 8 — ferramenta de build e servidor de desenvolvimento
- TypeScript 6 — tipagem estática para maior segurança e produtividade
- React Router 7 — roteamento das páginas e navegação da aplicação
- React Redux 9 — gerenciamento de estado global
- Axios 1 — cliente HTTP para comunicação com a API backend
- ESLint 10 — análise estática e padronização do código
- TypeScript ESLint — integração do ESLint com TypeScript
- Husky 9 — hooks do Git para automatizar validações locais
- Commitlint — padronização de mensagens de commit
- lint-staged — execução de verificações apenas nos arquivos alterados
- @vitejs/plugin-react — integração do React no Vite
- Node.js e npm — runtime e gerenciamento de dependências

## 🏗️ Arquitetura e convenções

A organização do projeto segue uma estrutura por domínio, com foco em separação entre páginas, componentes, hooks, utilitários e serviços de API.

- [docs/architecture.md](./docs/architecture.md) — descrição da estrutura de pastas e responsabilidades
- [docs/code_conventions.md](./docs/code_conventions.md) — padrões de rotas, axios, layouts, hooks e Redux

## 📁 Estrutura principal

```bash
src/
├── App.tsx
├── api/
│   └── api.ts
├── assets/
├── components/
├── hooks/
├── pages/
├── util/
├── index.css
└── main.tsx
```

A base da comunicação com o backend está em `src/api/api.ts`, utilizando o `axios` com a variável de ambiente `VITE_API_URL`.

## ⚙️ Requisitos

- Node.js 20+ (recomendado)
- npm ou outro gerenciador compatível

## ▶️ Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo de ambiente a partir das variáveis necessárias:

```bash
cp .env.example .env
```

Se o projeto não possuir arquivo `.env.example`, crie manualmente um arquivo `.env` com algo como:

```bash
VITE_API_URL=http://localhost:3000
```

3. Inicie a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

## 🧪 Scripts disponíveis

```bash
npm run dev      # inicia o ambiente de desenvolvimento
npm run build    # gera build de produção
npm run lint     # executa ESLint para validar qualidade do código
npm run preview  # visualiza a build localmente
```

## ✅ Boas práticas adotadas

- uso de TypeScript para reduzir erros em tempo de desenvolvimento
- organização por domínio para páginas e componentes
- rotas protegidas por padrão
- comunicação com backend centralizada em `src/api/api.ts`
- padronização de commits e validações automáticas com Husky e Commitlint

## 📚 Documentação complementar

Para mais detalhes sobre a arquitetura e os padrões do projeto, consulte:

- [docs/architecture.md](./docs/architecture.md)
- [docs/code_conventions.md](./docs/code_conventions.md)

Também é possível acompanhar o projeto principal do Sidebrain no repositório de origem do produto.
