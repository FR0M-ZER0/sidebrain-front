# UI Contract: Telas de Autenticação (Login, Cadastro e Recuperação de Senha)

**Feature**: `SDB-82-signin-profile`
**Domínio**: `auth`
**Rotas**: `/login`, `/cadastro`, `/recuperar-senha`
**Status**: Ready

---

## 1. Página de Login (`LoginPage.tsx`)

### 1.1. Rota e Acesso
- **Rota**: `/login`
- **Acesso**: Público (sem `PrivateRoute`).

### 1.2. Componentes e Estrutura
- `LoginPage.tsx`: Container de página com cabeçalho superior e grid desktop em 2 colunas.
- `LoginForm.tsx`: Card branco com formulário de autenticação.
- `AuthHeroPanel.tsx` (variante `login`): Card lateral direito de microlearning e prova social.

### 1.3. Inputs e Eventos do Formulário de Login (`LoginForm`)
| Elemento | Tipo | Props / Estado | Comportamento / Validação |
|---|---|---|---|
| E-mail | `input[type="email"]` | `value`, `onChange`, `error` | Obrigatório; formato de e-mail válido. |
| Senha | `input[type="password"]` / `text` | `value`, `onChange`, `showPassword` | Obrigatória; ícone de olho alterna visibilidade instantaneamente. |
| Lembrar de mim | `input[type="checkbox"]` | `checked`, `onChange` | Alterna booleano de persistência. |
| Esqueceu a senha? | `Link` | `to="/recuperar-senha"` | Navega para tela de recuperação. |
| Botão "Entrar no Sidebrain" | `button[type="submit"]` | `disabled={isLoading}` | Valida campos, simula login no `useAuth`, redireciona para `/`. |
| Login Social Google | `button[type="button"]` | `onClick` | Ação demonstrativa (toast simulando login social). |
| Login Social GitHub | `button[type="button"]` | `onClick` | Ação demonstrativa (toast simulando login social). |
| Link Cadastro | `Link` | `to="/cadastro"` | Navega para tela de cadastro. |

---

## 2. Página de Cadastro (`RegisterPage.tsx`)

### 2.1. Rota e Acesso
- **Rota**: `/cadastro`
- **Acesso**: Público (sem `PrivateRoute`).

### 2.2. Componentes e Estrutura
- `RegisterPage.tsx`: Grid desktop em 2 colunas (Painel institucional à esquerda, Formulário à direita).
- `RegisterForm.tsx`: Card com login social no topo, campos de cadastro e barra de força.
- `PasswordStrengthIndicator.tsx`: Barra de 3 segmentos com critérios de senha.
- `AuthHeroPanel.tsx` (variante `register`): Painel com benefícios cognitivos, foto de tablet e checklist.

### 2.3. Inputs e Eventos do Formulário de Cadastro (`RegisterForm`)
| Elemento | Tipo | Props / Estado | Comportamento / Validação |
|---|---|---|---|
| Nome Completo | `input[type="text"]` | `value`, `onChange`, `error` | Obrigatório; mínimo de 2 caracteres. |
| E-mail | `input[type="email"]` | `value`, `onChange`, `error` | Obrigatório; formato de e-mail válido. |
| Senha | `input[type="password"]` / `text` | `value`, `onChange`, `showPassword` | Validação dinâmica em tempo real (8+ carac, 1 número, 1 símbolo). |
| Indicador de Força | `PasswordStrengthIndicator` | `password` | Exibe 'Fraca', 'Média' ou 'Forte' e 3 segmentos visuais. |
| Termos de Serviço | `input[type="checkbox"]` | `checked`, `onChange`, `error` | Obrigatório para envio; links de termos com clique informativo. |
| Botão "Criar Conta Gratuita" | `button[type="submit"]` | `disabled={!termsAccepted \|\| isLoading}` | Registra usuário simulado no `useAuth`, redireciona para `/`. |
| Link Faça login | `Link` | `to="/login"` | Navega para tela de login. |

---

## 3. Página de Recuperação de Senha (`PasswordRecoveryPage.tsx`)

### 3.1. Rota e Acesso
- **Rota**: `/recuperar-senha`
- **Acesso**: Público (sem `PrivateRoute`).

### 3.2. Componentes e Estrutura
- `PasswordRecoveryPage.tsx`: Layout centralizado com logo no topo e card de segurança.
- `PasswordRecoveryForm.tsx`: Card com estados de formulário e confirmação de envio.

### 3.3. Estados do Card de Recuperação
1. **Estado Inicial (Formulário)**:
   - Título: "Recuperar sua senha".
   - Subtítulo explicativo com prazo de 30 minutos.
   - Campo de e-mail com ícone de envelope.
   - Botão "Enviar Link de Recuperação ➤".
   - Box de alerta "Proteção Contínua".
   - Link "Voltar para o Login" (`to="/login"`).
   - Link "Fale com o suporte" (ação informativa).
2. **Estado de Sucesso (Confirmação Visual Integrada)**:
   - Ícone de e-mail enviado com animação de entrada.
   - Mensagem: "Link de recuperação enviado para **{email}**".
   - Instrução para checar caixa de entrada e spam nos próximos 30 minutos.
   - Botão primário: "Voltar para o Login" (`to="/login"`).
