# Implementation Plan: Telas de Autenticação e Perfil do Usuário (SDB-82)

**Branch**: `SDB-82-signin-profile` | **Date**: 2026-10-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/SDB-82-signin-profile/spec.md`

---

## Summary

Implementação completa das interfaces visuais e fluxos interativos de **Login**, **Cadastro**, **Recuperação de Senha** e **Perfil do Usuário** no frontend do Sidebrain. O projeto segue estritamente as imagens de referência desktop em `docs/img/` (`Sidebrain_-_Login_Desktop.png`, `Sidebrain_-_Cadastro_Desktop.png`, `Sidebrain_-_Recuperacao_de_Senha_Desktop.png` e `Sidebrain_-_Perfil_do_Usuario_Desktop.png`).

A solução adota arquitetura modular orientada a domínios:
- Domínio público `auth`: telas de Login, Cadastro e Recuperação de Senha com validações em tempo real e cálculo dinâmico de força de senha.
- Domínio autenticado `customer`: página de Perfil reutilizando o layout `StudentPageLayout` com banner de maestria (João Silva, Nível 8, 850/1000 XP), listagem de trilhas ativas com navegação para lições reais, 4 badges em destaque, card de segurança com logout e modal de edição interativa em memória.
- Proteção de rotas: componente `PrivateRoute` integrado em `src/App.tsx`, com sessão mockada persistida em `localStorage` ativa por padrão para desenvolvimento e testes fluidos.

---

## Technical Context

**Language/Version**: TypeScript ~6.0.2, React 19.2.8
**Primary Dependencies**: React Router 7.18.4, Tailwind CSS 4.3.3 (`@tailwindcss/vite`), Lucide React 1.47.0, Motion 13.4.4, Axios 1.20.0
**Storage**: `localStorage` (chave `sidebrain_auth_session` para sessão mockada)
**Testing**: Validação ponta a ponta manual via [quickstart.md](./quickstart.md), TypeScript check (`tsc -b`), ESLint (`npm run lint`) e build de produção (`npm run build`)
**Target Platform**: Navegadores Web Modernos (Desktop resolution 1440x900+)
**Project Type**: Single Page Application (SPA) React com Vite
**Performance Goals**: Tempo de transição entre rotas de auth < 300ms; cálculo dinâmico de força de senha em tempo real com 0ms de lag perceptível
**Constraints**: 
- Fidelidade visual pixel-a-pixel com as imagens de referência em `docs/img/`
- Arrow functions em todos os componentes, utilitários, hooks e handlers
- Sem ponto e vírgula (;) ao final de declarações conforme `code_conventions.md`
- Preservação estrita dos estilos dos componentes compartilhados existentes (`Sidebar.tsx`, `HeaderBar.tsx`, etc.)
**Scale/Scope**: 4 páginas principais (`/login`, `/cadastro`, `/recuperar-senha`, `/perfil`), 1 modal interativo, 2 hooks customizados, 9 componentes dedicados

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Justificativa / Validação |
|---|---|---|
| **I. Organização por Domínio** | **PASS** | Páginas públicas em `src/pages/auth/`, página de perfil em `src/pages/customer/`, componentes em `src/components/auth/` e `src/components/customer/`, componentes compartilhados em `src/components/general/`, hooks em `src/hooks/`. |
| **II. Rotas Protegidas por Padrão** | **PASS** | `src/components/general/PrivateRoute.tsx` envolve todas as rotas internas incluindo `/perfil`; rotas públicas (`/login`, `/cadastro`, `/recuperar-senha`) explicitamente fora de `PrivateRoute`. |
| **III. API Centralizada via Axios** | **PASS** | Acesso mockado isolado em hooks; quando integrado a endpoints HTTP, usará exclusivamente a instância central `src/api/api.ts`. |
| **IV. Layout Base, Arrow Functions e Hooks** | **PASS** | `UserProfilePage` composta com `StudentPageLayout.tsx`. Todas as funções e componentes declarados como arrow functions sem ponto e vírgula final. Estado encapsulado em hooks customizados (`useAuth`, `useUserProfile`). |
| **V. Fidelidade Visual e Qualidade** | **PASS** | Todas as 4 telas inspecionadas detalhadamente e comparadas pixel a pixel com `docs/img/`. Validação obrigatória com `npm run lint` e `npm run build` limpos. |

---

## Project Structure

### Documentation (this feature)

```text
specs/SDB-82-signin-profile/
├── spec.md              # Especificação refinada com 5 clarificações integradas
├── plan.md              # Este plano de implementação
├── research.md          # Pesquisa técnica e decisões de arquitetura
├── data-model.md        # Modelagem de dados, tipos e estados da feature
├── quickstart.md        # Roteiro prático de testes e validação ponta a ponta
├── contracts/           # Contratos de interfaces visuais
│   ├── auth-ui-contract.md
│   └── profile-ui-contract.md
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação (16/16 passing)
```

### Source Code Layout

```text
src/
├── api/
│   └── api.ts                             # Instância central do Axios existente
├── assets/
│   ├── sidebrain-logo.svg                 # Logo existente
│   └── default-avatar.png                 # Avatar demonstrativo do estudante
├── components/
│   ├── auth/                              # Componentes específicos do domínio auth
│   │   ├── AuthHeroPanel.tsx              # Painel lateral institucional (microlearning / IA)
│   │   ├── LoginForm.tsx                  # Formulário do card de login
│   │   ├── RegisterForm.tsx               # Formulário do card de cadastro
│   │   ├── PasswordRecoveryForm.tsx       # Formulário e confirmação de recuperação
│   │   └── PasswordStrengthIndicator.tsx  # Barra de força e checklist de critérios de senha
│   ├── customer/                          # Componentes do domínio customer
│   │   ├── AccountSecurityCard.tsx        # Card lateral "Conta & Segurança" e botão logout
│   │   ├── ActiveTracksSection.tsx        # Seção de trilhas com botões de retomada
│   │   ├── EditProfileModal.tsx           # Modal interativo de edição de nome e avatar
│   │   ├── HeaderBar.tsx                  # Header compartilhado existente (preservado)
│   │   ├── ProfileBadgesSection.tsx       # Vitrine de 4 badges em destaque
│   │   ├── ProfileHeroBanner.tsx          # Banner com dados, nível 8, progresso XP e CTAs
│   │   ├── Sidebar.tsx                    # Menu lateral existente (habilitando link do perfil)
│   │   └── layouts/
│   │       └── StudentPageLayout.tsx      # Layout base do estudante existente (preservado)
│   └── general/                           # Componentes compartilhados entre domínios
│       └── PrivateRoute.tsx               # Guarda de rotas autenticadas
├── hooks/
│   ├── useAuth.ts                         # Hook de autenticação, login, logout e sessão local
│   └── useUserProfile.ts                  # Hook de estado do perfil, trilhas, badges e edição
├── pages/
│   ├── auth/                              # Páginas do domínio de autenticação
│   │   ├── LoginPage.tsx                  # Tela de Login (/login)
│   │   ├── RegisterPage.tsx               # Tela de Cadastro (/cadastro)
│   │   └── PasswordRecoveryPage.tsx       # Tela de Recuperação de Senha (/recuperar-senha)
│   └── customer/                          # Páginas do domínio customer
│       ├── HomeDashboardPage.tsx          # Dashboard existente
│       └── UserProfilePage.tsx            # Tela "Meu Perfil" (/perfil)
├── types/
│   ├── auth.ts                            # Tipos de formulários, validações e sessão
│   └── userProfile.ts                     # Tipos de perfil, trilhas, badges e segurança
└── App.tsx                                # Configuração central de rotas (públicas e privadas)
```

**Structure Decision**: A organização por domínios (`auth`, `customer`, `general`) respeita integralmente a arquitetura estabelecida em `architecture.md` e a convenção de rotas com `PrivateRoute` de `code_conventions.md`.

---

## Complexity Tracking

*Nenhuma violação ou desvio da Constituição detectado. Todas as regras de arquitetura, convenções de código e princípios de qualidade foram 100% observados.*
