# Contracts: Contrato de Interface UI e Componentes (SDB-84)

**Feature**: `SDB-84-missions-and-badges`
**Date**: 2026-10-07
**Status**: Complete

Este documento especifica os contratos de interface TypeScript dos componentes e do hook customizado para a tela de Missões e Badges.

---

## 1. Contrato do Hook: `useMissionsAndBadges`

```typescript
export interface UseMissionsAndBadgesReturn {
  // Dados consolidados
  summary: UserGamificationSummary
  missions: Mission[]
  categories: BadgeCategory[]
  allBadges: Badge[]
  
  // Estado e controle de filtros
  activeFilter: BadgeFilterType
  setActiveFilter: (filter: BadgeFilterType) => void
  filterOptions: BadgeFilterOption[]
  filteredCategoriesWithBadges: Array<{
    category: BadgeCategory
    badges: Badge[]
  }>

  // Notificações e feedback
  toastMessage: string | null
  triggerDemonstrationAction: (actionType: 'continue_track' | 'review_cards', missionTitle: string) => void
  closeToast: () => void
}
```

---

## 2. Contratos de Componentes

### 2.1 `MissionsAndBadgesSummary`
Exibe os 3 cards superiores de métricas (Badges, Nível Atual, Total XP).

```typescript
export interface MissionsAndBadgesSummaryProps {
  summary: UserGamificationSummary
}
```

### 2.2 `MissionsGrid` & `MissionCardItem`
Renderiza a grade 2x2 de desafios semanais e os cards individuais.

```typescript
export interface MissionsGridProps {
  missions: Mission[]
  onActionClick: (actionType: 'continue_track' | 'review_cards', missionTitle: string) => void
}

export interface MissionCardItemProps {
  mission: Mission
  onActionClick: (actionType: 'continue_track' | 'review_cards', missionTitle: string) => void
}
```

### 2.3 `BadgesShowcase` & `BadgeItemCard`
Renderiza a barra de abas de filtro e a vitrine de insígnias agrupada por categorias ativas.

```typescript
export interface BadgesShowcaseProps {
  filterOptions: BadgeFilterOption[]
  activeFilter: BadgeFilterType
  onSelectFilter: (filter: BadgeFilterType) => void
  categoriesWithBadges: Array<{
    category: BadgeCategory
    badges: Badge[]
  }>
}

export interface BadgeItemCardProps {
  badge: Badge
}
```

### 2.4 `ToastNotification`
Componente demonstrativo para feedback das ações da página.

```typescript
export interface ToastNotificationProps {
  message: string | null
  onClose: () => void
}
```
