# UI Contract: Tela e Componentes de Perfil do Usuário

**Feature**: `SDB-82-signin-profile`
**Domínio**: `customer`
**Rota**: `/perfil`
**Status**: Ready

---

## 1. Página de Perfil (`UserProfilePage.tsx`)

### 1.1. Rota e Acesso
- **Rota**: `/perfil`
- **Acesso**: Autenticado (envolvido em `PrivateRoute`).
- **Layout**: Composto a partir de `StudentPageLayout.tsx` (que integra `Sidebar` e `HeaderBar` existentes).

### 1.2. Componentes da Página
- `ProfileHeroBanner.tsx`: Topo da página com dados pessoais, nível, progresso de XP e CTAs de edição.
- `ActiveTracksSection.tsx`: Seção "Trilhas Ativas & Maestria" com cards de Japonês e Geometria.
- `ProfileBadgesSection.tsx`: Seção "Badges em Destaque (4 / 18)" com os 4 cards de conquistas.
- `AccountSecurityCard.tsx`: Card lateral direito "Conta & Segurança" com indicadores e botão de logout.
- `EditProfileModal.tsx`: Modal interativo simples de edição de perfil.

---

## 2. Contratos de Componentes

### 2.1. `ProfileHeroBanner`
```typescript
interface ProfileHeroBannerProps {
  user: UserProfile
  onEditProfile: () => void
  onChangePhoto: () => void
}
```
- **Elementos Visuais**:
  - Foto/Avatar com selo dourado de estrela.
  - Nome "João Silva", badge "MEMBRO PRO".
  - Nível 8 com ícone de troféu.
  - "Estudando desde Jan 2025" com ícone de calendário.
  - Barra de progresso para o Nível 9: "850 / 1.000 XP" preenchida em 85%.
  - Botão secundário "Alterar Foto" (ícone de câmera).
  - Botão primário "Editar Perfil" (ícone de lápis).

### 2.2. `ActiveTracksSection`
```typescript
interface ActiveTracksSectionProps {
  tracks: ActiveTrack[]
  onResumeTrack: (targetRoute: string) => void
}
```
- **Comportamento**:
  - Renderiza 2 cards lado a lado no desktop.
  - Cada card exibe: pill de categoria, percentual concluído, barra de progresso colorida, descrição do módulo e container de "Próxima Lição".
  - Botão "Retomar": ao clicar, invoca `onResumeTrack` que navega via `useNavigate` para a rota real correspondente (ex: `/lessons/1` ou `/lessons/2`).

### 2.3. `ProfileBadgesSection`
```typescript
interface ProfileBadgesSectionProps {
  badges: ProfileBadge[]
  totalBadgesCount?: number
  onViewAllBadges?: () => void
}
```
- **Comportamento**:
  - Exibe cabeçalho "Badges em Destaque 4 / 18" com link "Ver vitrine completa".
  - Renderiza 4 cards em grid: Fogo Imparável (Raro), Mestre de XP (Épico), Poliglota Curioso (Comum), Geômetra Iniciante (Incomum).
  - Cada card possui ícone estilizado, título, descrição e badge com a cor da raridade.

### 2.4. `AccountSecurityCard`
```typescript
interface AccountSecurityCardProps {
  security: AccountSecurityInfo
  onLogout: () => void
  onChangePassword?: () => void
  onManage2FA?: () => void
  onViewDevices?: () => void
}
```
- **Elementos e Ações**:
  - Cabeçalho: ícone de escudo, "Conta & Segurança", subtítulo "Proteção e credenciais".
  - Item "Alterar Senha" (Atualizada há 3 meses).
  - Item "Autenticação em 2 Etapas" (Ativada em verde com App Authenticator).
  - Item "Dispositivos Conectados" (2 ativos agora).
  - Botão de perigo "Encerrar Sessão" (ícone de logout, fundo vermelho/coral suave). Ao clicar, limpa a sessão mockada no `useAuth` e redireciona para `/login`.

### 2.5. `EditProfileModal`
```typescript
interface EditProfileModalProps {
  isOpen: boolean
  user: UserProfile
  onClose: () => void
  onSave: (updatedData: { name: string; avatarUrl: string }) => void
}
```
- **Comportamento**:
  - Renderiza quando `isOpen` for `true` com overlay escurecido (`backdrop-blur-sm`).
  - Permite alterar o campo Nome e selecionar avatar ou inserir URL.
  - Ao clicar em "Salvar Alterações", chama `onSave` atualizando o estado do perfil no hook `useUserProfile`, salvando na sessão em memória/storage e fechando o modal.
