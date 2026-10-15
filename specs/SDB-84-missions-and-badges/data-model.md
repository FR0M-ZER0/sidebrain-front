# Data Model: Tela de Missões e Badges (SDB-84)

**Feature**: `SDB-84-missions-and-badges`
**Date**: 2026-10-07
**Status**: Complete

## 1. Entidades do Domínio

### 1.1 `UserGamificationSummary`
Representa os indicadores consolidados de engajamento e métricas de gamificação do aluno.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
| :--- | :--- | :--- | :--- | :--- |
| `badgesUnlocked` | `number` | Sim | Total de insígnias já conquistadas | `14` |
| `badgesTotal` | `number` | Sim | Total de insígnias disponíveis na plataforma | `28` |
| `currentLevel` | `number` | Sim | Nível atual do aluno | `8` |
| `totalXp` | `number` | Sim | Total de experiência acumulada | `4850` |
| `sessionXp` | `number` | Sim | XP conquistado na sessão corrente | `320` |
| `sessionXpTarget` | `number` | Sim | Meta de XP para o ciclo atual da sessão | `500` |
| `studyStreakDays` | `number` | Sim | Dias consecutivos de estudo mantidos (streak) | `12` |

---

### 1.2 `Mission`
Representa um objetivo de curto prazo / desafio semanal da plataforma.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Sim | Identificador único da missão | `'mission-iron-consistency'` |
| `icon` | `string` | Sim | Nome do ícone representativo (Lucide) | `'Flame'` / `'Home'` |
| `category` | `string` | Sim | Rótulo da categoria do desafio | `'HÁBITO CONTÍNUO'` |
| `categoryTone` | `'warning' \| 'info'` | Sim | Estilo semântico de cor da categoria | `'warning'` |
| `xpReward` | `number` | Sim | Quantidade de XP concedida ao cumprir | `100` |
| `title` | `string` | Sim | Título da missão | `'Consistência de Ferro'` |
| `description` | `string` | Sim | Detalhamento do critério de estudo | `'Estude pelo menos 15 minutos por dia...'` |
| `currentProgress` | `number` | Sim | Valor atual atingido | `5` |
| `targetProgress` | `number` | Sim | Meta total necessária | `5` |
| `progressUnit` | `string` | Sim | Unidade de medida | `'dias'` |
| `percent` | `number` | Sim | Percentual de conclusão calculado (0 a 100) | `100` |
| `status` | `'completed' \| 'in_progress'` | Sim | Estado de conclusão da missão | `'completed'` |
| `actionLabel` | `string` | Sim | Rótulo do botão de ação | `'Continuar Trilha →'` |
| `actionType` | `'continue_track' \| 'review_cards'` | Sim | Identificador semântico da ação simulada | `'continue_track'` |

---

### 1.3 `Badge`
Representa uma medalha/insígnia de conquista que atesta habilidades e disciplina.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Sim | Identificador único do badge | `'badge-unstoppable-fire'` |
| `name` | `string` | Sim | Nome da insígnia | `'Fogo Imparável'` |
| `description` | `string` | Sim | Texto descritivo dos critérios | `'Mantenha sua chama acesa por 10 dias...'` |
| `icon` | `string` | Sim | Identificador do ícone Lucide | `'TrendingUp'` |
| `rarity` | `BadgeRarity` | Sim | Raridade da insígnia | `'raro'` |
| `status` | `BadgeStatus` | Sim | Estado de conquista | `'unlocked'` |
| `categoryId` | `string` | Sim | Chave estrangeira da categoria associada | `'discipline'` |
| `unlockedAt` | `string` | Não | Data em que a insígnia foi conquistada | `'12 de Jan, 2025'` |
| `currentProgress` | `number` | Não | Progresso atual numérico | `14` |
| `targetProgress` | `number` | Não | Meta numérica para desbloqueio | `100` |
| `progressLabel` | `string` | Não | Texto formatado do progresso | `'14 / 100 dias'` |
| `progressPercent` | `number` | Não | Percentual de avanço | `14` |
| `criteriaText` | `string` | Não | Texto explicativo complementar de critérios | `'Retenção atual: 92,4% \| 18 / 30 dias'` |

---

### 1.4 `BadgeCategory`
Agrupamento temático de badges na vitrine.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Sim | Identificador da categoria temática | `'discipline'` |
| `title` | `string` | Sim | Nome da categoria | `'Sequência & Disciplina'` |
| `icon` | `string` | Sim | Ícone da categoria | `'Zap'` |
| `unlockedCount` | `number` | Sim | Total de badges desbloqueados no grupo | `4` |
| `inProgressCount` | `number` | Sim | Total de badges em progresso no grupo | `1` |
| `lockedCount` | `number` | Sim | Total de badges bloqueados no grupo | `0` |

---

### 1.5 Enums e Tipos de Apoio

```typescript
export type BadgeRarity = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

export type BadgeStatus = 'unlocked' | 'in_progress' | 'locked'

export type BadgeFilterType = 'todos' | 'desbloqueados' | 'em_progresso' | 'raros_epicos'

export interface BadgeFilterOption {
  key: BadgeFilterType
  label: string
  count: number
}
```

---

## 2. Regras de Validação e Transição de Estado

1. **Cálculo de Percentual**:
   - `percent = Math.min(100, Math.round((currentProgress / targetProgress) * 100))`
   - Se `percent === 100`, `status` é classificado como `'completed'`.
2. **Filtragem de Badges**:
   - `'todos'`: Todos os badges da categoria.
   - `'desbloqueados'`: `badge.status === 'unlocked'`.
   - `'em_progresso'`: `badge.status === 'in_progress'`.
   - `'raros_epicos'`: `['raro', 'epico', 'lendario'].includes(badge.rarity)`.
3. **Visibilidade da Categoria**:
   - Uma `BadgeCategory` é renderizada se e somente se a lista filtrada de badges contiver ao menos 1 item para essa categoria. Caso contrário, a seção inteira é omitida.
