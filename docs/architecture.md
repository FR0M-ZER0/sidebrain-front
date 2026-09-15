# Arquitetura — SideBrain Frontend

Este documento descreve a organização das pastas e arquivos dentro de `/src`.

## Estrutura Geral

```
src/
├── App.tsx
├── index.css
├── api/
├── assets/
├── components/
│   ├── general/
│   ├── customer/
│   └── admin/
├── hooks/
├── pages/
│   ├── customer/
│   └── admin/
└── util/
```

## Descrição dos diretórios e arquivos

### `/src/App.tsx`
Responsável pelas rotas da aplicação (React Router). É o ponto central onde as rotas são definidas e associadas às páginas.

### `/src/index.css`
Contém os estilos globais da aplicação.

### `/src/util`
Funções utilitárias genéricas, reutilizáveis em diferentes partes do projeto (formatação, validações, helpers diversos etc).

### `/src/pages`
Guarda as páginas da aplicação, separadas por domínio. Cada domínio possui seu próprio subdiretório.

Exemplo:
```
pages/
├── customer/
│   ├── CustomerListPage.tsx
│   └── CustomerDetailsPage.tsx
└── admin/
    ├── AdminDashboardPage.tsx
    └── AdminSettingsPage.tsx
```

### `/src/components`
Guarda os componentes da aplicação, também separados por domínio.

- Componentes usados exclusivamente por páginas de um domínio específico ficam dentro do diretório correspondente (ex: `components/customer`, `components/admin`).
- Componentes de uso geral, compartilhados entre múltiplos domínios, ficam em `components/general`.

Exemplo:
```
components/
├── general/
│   ├── Button.tsx
│   └── Modal.tsx
├── customer/
│   └── CustomerCard.tsx
└── admin/
    └── AdminTable.tsx
```

### `/src/hooks`
Guarda hooks customizados utilizados na aplicação (ex: `useAuth`, `useDebounce` etc).

### `/src/assets`
Guarda os assets do projeto (imagens, ícones, fontes etc).

### `/src/api`
Guarda os códigos responsáveis pela comunicação com APIs externas, como configuração do axios, definição de endpoints, interceptors etc.

## Convenção de domínios

Sempre que um novo domínio for criado (ex: `orders`, `products`), deve-se seguir o mesmo padrão:

- Criar `pages/<dominio>` para as páginas do domínio.
- Criar `components/<dominio>` para os componentes específicos do domínio.
- Componentes reaproveitáveis entre domínios devem ser movidos/criados em `components/general`.