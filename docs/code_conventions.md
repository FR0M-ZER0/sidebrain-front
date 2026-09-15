# Convenções de Código — Sidebrain Frontend

## Organização por domínio

Conforme descrito em `architecture.md`, páginas e componentes devem ser criados dentro de diretórios organizados por domínio.

- Páginas ficam em `src/pages/<dominio>`.
- Componentes específicos de um domínio ficam em `src/components/<dominio>`.
- Componentes de uso geral ficam em `src/components/general`.

```
pages/customer/CustomerListPage.tsx
components/customer/CustomerCard.tsx
components/general/Button.tsx
```

## Rotas

Todas as rotas devem ser protegidas por padrão, exigindo autenticação.

Exceções são as rotas de acesso público, como login, cadastro e recuperação de senha, que devem ser explicitamente marcadas como rotas sem autenticação.

```tsx
<Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>

<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
```

## Comunicação com APIs

Toda chamada à API deve ser feita utilizando a instância do axios configurada em `/src/api/api.ts`. Não é permitido instanciar o axios diretamente em componentes, páginas ou hooks.

```ts
// src/api/api.ts
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
```

```tsx
import { api } from "@/api/api"

const fetchCustomers = () => api.get("/customers")
```

## Layouts

As páginas devem ser criadas a partir de um Layout base (`Layout.tsx`). Layouts específicos podem ser criados a partir dele quando necessário, como `LayoutWithSearchBar.tsx` ou `CustomerLayout.tsx`.

```tsx
// Layout.tsx
export const Layout = ({ children }: { children: ReactNode }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
)
```

```tsx
// CustomerLayout.tsx
export const CustomerLayout = ({ children }: { children: ReactNode }) => (
  <Layout>
    <CustomerSidebar />
    {children}
  </Layout>
)
```

## Funções

Utilizar arrow functions sempre que possível, tanto para componentes quanto para funções utilitárias, hooks e handlers.

**Não utilizar ponto e vírgula (;) ao final das declarações.**

```tsx
export const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`
```

## Hooks customizados

Hooks customizados devem ficar em `src/hooks` e ser nomeados com o prefixo `use`.

Um hook deve encapsular uma única responsabilidade (busca de dados, controle de formulário, acesso ao redux, etc.), evitando misturar lógicas não relacionadas.

```ts
// src/hooks/useCustomer.ts
export const useCustomer = (id: string) => {
  return useQuery(["customer", id], () => api.get(`/customers/${id}`))
}
```

## Redux

O acesso ao estado global (Redux) por componentes e páginas deve ser feito preferencialmente através de hooks customizados, evitando o uso direto de `useSelector` e `useDispatch` espalhado pelo código.

```ts
// src/hooks/useAuth.ts
export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()

  const logout = () => dispatch(logoutAction())

  return { user, logout }
}
```

```tsx
// uso no componente
const { user, logout } = useAuth()
```

Slices devem ser organizados por domínio dentro de `src/store/slices`, seguindo o mesmo padrão de separação usado em `pages` e `components`.

```
store/
├── slices/
│   ├── authSlice.ts
│   └── customerSlice.ts
```