# Technical Research: Telas de Autenticação e Perfil do Usuário

**Feature**: `SDB-82-signin-profile`
**Date**: 2026-10-07
**Status**: Completed

## Objetivo

Consolidar as escolhas técnicas, padrões arquiteturais e práticas de engenharia para implementar as páginas de Login, Cadastro, Recuperação de Senha e Perfil do Usuário no Sidebrain Frontend em conformidade com a [Constitution](../../.specify/memory/constitution.md) do projeto e as convenções de código estabelecidas em [code_conventions.md](../../docs/code_conventions.md) e [architecture.md](../../docs/architecture.md).

---

## Tópico 1: Organização de Pastas e Domínios de Páginas e Componentes

### Contexto
A aplicação possui domínios como `customer` e `lessons`. As novas páginas envolvem autenticação pública (Login, Cadastro, Recuperação de Senha) e uma página interna autenticada (Meu Perfil).

### Decisão
1. **Domínio `auth`**:
   - Páginas em `src/pages/auth/`:
     - `LoginPage.tsx` (rota `/login`)
     - `RegisterPage.tsx` (rota `/cadastro`)
     - `PasswordRecoveryPage.tsx` (rota `/recuperar-senha`)
   - Componentes em `src/components/auth/`:
     - `LoginForm.tsx`: formulário com validação, visibilidade de senha, "Lembrar de mim", login social demonstrativo.
     - `RegisterForm.tsx`: formulário com indicador dinâmico de força e requisitos de senha, checkbox de termos e botões sociais.
     - `PasswordStrengthIndicator.tsx`: barra visual em 3 segmentos e critérios individuais (8+ caracteres, número, símbolo).
     - `PasswordRecoveryForm.tsx`: formulário de e-mail e transição para estado dedicado de confirmação de envio.
     - `AuthHeroPanel.tsx`: painel lateral reutilizável ou especializado para microlearning (Login) e apresentação cognitiva (Cadastro).
2. **Domínio `customer`** (para a página de Perfil):
   - Página em `src/pages/customer/`:
     - `UserProfilePage.tsx` (rota `/perfil`)
   - Componentes em `src/components/customer/`:
     - `ProfileHeroBanner.tsx`: banner com foto, selo dourado, nível 8, badge Membro Pro, barra 850/1000 XP e botões de ação.
     - `ActiveTracksSection.tsx`: listagem das 2 trilhas ativas com botões de retomada para `/lessons/:id` ou `/trails/:slug`.
     - `ProfileBadgesSection.tsx`: vitrine dos 4 badges em destaque com contagem 4/18 e raridades.
     - `AccountSecurityCard.tsx`: card lateral com indicadores de segurança (senha, 2FA, dispositivos) e botão de Encerrar Sessão.
     - `EditProfileModal.tsx`: modal interativo demonstrativo para edição de nome e avatar na sessão.
   - Reutilização do layout existente: `StudentPageLayout.tsx` (que já integra `Sidebar` e `HeaderBar`).

### Rationale
- Cumpre rigorosamente o Princípio I da Constituição (`src/pages/<dominio>` e `src/components/<dominio>`).
- Mantém o perfil dentro do ecossistema do estudante (`customer`), integrando-o ao `StudentPageLayout` sem alterar a aparência dos componentes compartilhados.

### Alternativas Consideradas
- *Colocar tudo em `pages/customer/`*: Rejeitado porque telas de autenticação pública não são exclusivas de clientes autenticados e misturam responsabilidades conceituais.
- *Criar um componente monolítico por página*: Rejeitado para garantir testabilidade, reutilização e legibilidade.

---

## Tópico 2: Gerenciamento do Estado de Autenticação e Rotas Protegidas

### Contexto
Princípio II da Constituição exige que rotas internas sejam protegidas por padrão via `PrivateRoute`. A task SDB-82 não possui backend de autenticação real nesta fase, operando com dados mockados.

### Decisão
1. **Hook `useAuth` (`src/hooks/useAuth.ts`)**:
   - Gerencia a sessão do usuário com estado mockado pré-inicializado por padrão como "logado" (estudante "João Silva", e-mail "joao@exemplo.com", id "u-01").
   - Persistência em `localStorage` (chave `sidebrain_auth_session`):
     - Ao carregar a aplicação, lê a sessão salva; se não existir, inicializa autenticado para permitir inspeção e recarregamento (F5) em `/perfil` e rotas de aluno.
     - `login(credentials)`: simula autenticação com delay suave (~300ms), salva a sessão e redireciona para `/`.
     - `register(data)`: simula criação de conta, salva a sessão com o nome informado e redireciona para `/`.
     - `logout()`: remove a sessão de `localStorage`, atualiza o estado para desautenticado e redireciona para `/login`.
2. **Componente `PrivateRoute` (`src/components/general/PrivateRoute.tsx`)**:
   - Verifica `isAuthenticated` do `useAuth`.
   - Se autenticado, renderiza `<Outlet />` (ou `children`).
   - Se desautenticado, redireciona via `<Navigate to="/login" replace />`.
3. **Atualização em `src/App.tsx`**:
   - Envolver rotas privadas no `PrivateRoute` conforme convenção de `code_conventions.md`.
   - Registrar as rotas públicas `/login`, `/cadastro`, `/recuperar-senha`.
   - Registrar a rota protegida `/perfil` apontando para `UserProfilePage`.
   - Habilitar o link de `/perfil` no `Sidebar.tsx` e associar o botão `Sair` ao logout.

### Rationale
- Atende 100% ao Princípio II da Constituição e à convenção explícita de `code_conventions.md`.
- Garante ergonomia perfeita de desenvolvimento: o desenvolvedor pode atualizar o código de `/perfil` sem perder a sessão a cada hot reload ou refresh, ao mesmo tempo em que a experiência de logout/login funciona de ponta a ponta.

### Alternativas Consideradas
- *Estado puramente volátil em memória (useState sem localStorage)*: Rejeitado porque qualquer refresh (F5) em `/perfil` expulsaria o desenvolvedor para `/login`.
- *Tornar todas as rotas públicas sem PrivateRoute*: Rejeitado porque violaria o Princípio II da Constituição.

---

## Tópico 3: Modelagem e Gerenciamento do Perfil do Usuário

### Contexto
A página de Perfil exibe dados detalhados (XP, Nível 8, 850/1.000 XP, 2 trilhas ativas com percentuais de 40% e 65%, 4 badges com raridades e status de segurança) e precisa suportar a edição demonstrativa em memória solicitada na clarificação.

### Decisão
1. **Hook `useUserProfile` (`src/hooks/useUserProfile.ts`)**:
   - Encapsula os dados do perfil do estudante.
   - Fornece estado reativo para os campos do perfil:
     - `name`: "João Silva"
     - `avatar`: foto mockada em `src/assets/` ou URL demonstrativa de alta qualidade
     - `memberSince`: "Jan 2025"
     - `level`: 8
     - `currentXp`: 850
     - `nextLevelXp`: 1000
     - `badges`: 4 badges em destaque
     - `activeTracks`: 2 trilhas
     - `security`: dados de segurança
   - Fornece função `updateProfile({ name, avatar })` que atualiza o estado em memória/storage durante a sessão, refletindo instantaneamente no banner e no `Sidebar`.
2. **Modal `EditProfileModal`**:
   - Componente acessível, estilizado com backdrop blur, campos para nome e seleção/URL de foto de perfil, botão de salvar e cancelar.

### Rationale
- Atende ao Princípio IV da Constituição (Estado isolado via hooks customizados de responsabilidade única).
- Cumpre a clarificação acordada de permitir edição demonstrativa interativa sem backend.

### Alternativas Consideradas
- *Deixar os dados estáticos hardcoded dentro do JSX da página*: Rejeitado por prejudicar a manutenibilidade e impedir a edição demonstrativa solicitada.

---

## Tópico 4: Fidelidade Visual e Integração com Tailwind CSS v4

### Contexto
O projeto utiliza Tailwind CSS v4 (`@tailwindcss/vite` e `tailwindcss` ^4.3.3) com arquivo global `src/index.css` e estilos complementares em `src/App.css`. Princípio V da Constituição exige correspondência visual pixel a pixel com os designs de referência.

### Decisão
1. **Paleta de Cores e Tokens Identificados**:
   - Azul primário Sidebrain: `#0066FF` / `#0055D4` (botões primários, badges de destaque, barras de progresso).
   - Fundo neutro das telas de auth: `#F8FAFC` a `#F3F4F9` com sombras suaves (`shadow-xl` / `shadow-2xl`).
   - Gradiente de destaque no card de Login: linha sutil no topo do card (`from-blue-600 to-amber-500`).
   - Hero banner do Perfil: gradiente suave `from-sky-50 via-white to-amber-50/40` com bordas sutis `border-slate-100`.
   - Badges de raridade:
     - RARO: borda e fundo âmbar suave (`text-amber-700 bg-amber-50 border-amber-200`)
     - ÉPICO: fundo e borda roxo/azul (`text-indigo-700 bg-indigo-50 border-indigo-200`)
     - COMUM: fundo cinza neutro (`text-slate-600 bg-slate-100 border-slate-200`)
     - INCOMUM: fundo verde suave (`text-emerald-700 bg-emerald-50 border-emerald-200`)
2. **Ícones**:
   - Utilização da biblioteca `lucide-react` já instalada no projeto (`Mail`, `Lock`, `Eye`, `EyeOff`, `User`, `Sparkles`, `CheckCircle2`, `ShieldCheck`, `Camera`, `Pencil`, `LogOut`, `Flame`, `Zap`, `Award`, `ArrowRight`, `ChevronRight`).

### Rationale
- Garantia de conformidade com o Princípio V da Constituição sem adicionar dependências desnecessárias.
- Reutilização da infraestrutura já instalada e padronizada.

---

## Conclusão do Research

Todas as dúvidas técnicas e decisões de arquitetura foram completamente resolvidas:
- Nenhuma pendência do tipo `[NEEDS CLARIFICATION]` permanece.
- Estrutura pronta para prosseguir para a Phase 1: `data-model.md`, `contracts/` e `quickstart.md`.
