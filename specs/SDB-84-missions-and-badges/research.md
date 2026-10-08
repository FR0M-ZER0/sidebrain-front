# Research: Tela de Missões e Badges (SDB-84)

**Feature**: `SDB-84-missions-and-badges`
**Date**: 2026-10-07
**Status**: Completed

## 1. Organização Arquitetural e Domínio do Código

- **Decision**: Alocar a nova tela no domínio `customer` (`src/pages/customer/MissionsAndBadgesPage.tsx`) e os novos componentes específicos em `src/components/customer/missions/` (ou prefixados em `src/components/customer/`). Criar hook dedicado `src/hooks/useMissionsAndBadges.ts` e tipos em `src/types/missions.ts`.
- **Rationale**: A Constituição do projeto (Princípio I) e `docs/architecture.md` exigem divisão estrita por domínio. O contexto da aplicação é a jornada do estudante (aluno/customer), onde já residem as páginas de trilhas e dashboard (`HomeDashboardPage`, `CreateTrackPage`).
- **Alternatives considered**:
  - *Criar um novo domínio `gamification/`:* Rejeitado porque a arquitetura atual centraliza a visão do estudante em `customer` e a constituição orienta estender o domínio existente antes de fragmentar o escopo.
  - *Embutir tudo em `HomeDashboardPage.tsx`:* Rejeitado porque a especificação (FR-001) exige uma página dedicada com rota própria.

## 2. Roteamento e Navegação

- **Decision**: Registrar a rota `/missions` em `src/App.tsx`, com suporte a redirecionamento opcional de `/missoes` para `/missions`. Integrar o item "Missões & Badges" da `Sidebar` para ativar quando estiver nesta rota.
- **Rationale**: A convenção de rotas em `src/App.tsx` utiliza termos em inglês ou kebab-case (`/quiz`, `/quiz-result`, `/trails/new/...`). `/missions` mantém a consistência da árvore de rotas da aplicação, respeitando a constituição (Princípio II).
- **Alternatives considered**:
  - *Usar apenas `/missoes`:* Funcional, porém diverge do padrão das rotas já cadastradas (`/quiz`, `/trails`). Permitir `/missions` como principal atende com clareza.

## 3. Gestão de Estado, Mock e Interatividade

- **Decision**: Estruturar o estado local no hook customizado `useMissionsAndBadges`, que fornece:
  - Resumo métrico do usuário (Badges 14/28, Nível Nv. 8, Total XP 4.850).
  - Lista de missões (4 missões do mock com categorias, progresso, recompensa e ações).
  - Vitrine de badges (28 badges divididos nas 3 categorias temáticas oficiais: "Sequência & Disciplina", "Maestria & Conhecimento", "Mentor & Inteligência Artificial").
  - Estado de filtro ativo (`'todos' | 'desbloqueados' | 'em_progresso' | 'raros_epicos'`).
  - Estado reativo do Toast com auto-dismiss (3 segundos) para as ações interativas de simulação ("Continuar Trilha" e "Revisar 8 Cards").
- **Rationale**: Centralizar a lógica em um hook único respeita o Princípio IV da Constituição ("Acesso ao estado via hooks customizados, arrow functions sem ponto e vírgula"). Torna os componentes puramente apresentacionais e fáceis de testar.
- **Alternatives considered**:
  - *Estado em Redux global:* Rejeitado por gerar complexidade desnecessária para dados puramente mockados de uma página demonstrativa local.
  - *Alerts nativos do navegador (`window.alert`):* Rejeitado por quebrar a fidelidade visual e a experiência fluida do usuário estipulada na especificação (FR-008).

## 4. Fidelidade Visual e Design System

- **Decision**: Utilizar Tailwind CSS v4 e classes utilitárias harmonizadas com as variáveis existentes no projeto (`src/index.css`), garantindo 100% de paridade com `docs/img/Sidebrain - Missões & Badges (Desktop).png`.
- **Paleta de Cores e Tokens Identificados**:
  - **Fundo**: Canvas leve e suave (`#faf8ff` / `#f8fafc`).
  - **Cards**: Superfícies brancas (`#ffffff`) com bordas suaves (`#e2e8f0` / `#ede9fe`), raios de curvatura de 16px a 24px (`rounded-2xl` / `rounded-3xl`), sombra sutil.
  - **Cores de Raridade**:
    - *Comum*: fundo cinza azulado (`bg-slate-100 text-slate-700`).
    - *Incomum*: fundo verde menta (`bg-emerald-50 text-emerald-700`).
    - *Raro*: fundo azul celeste / âmbar suave (`bg-sky-50 text-sky-700` ou `bg-amber-50 text-amber-700`).
    - *Épico*: fundo roxo / índigo suave (`bg-indigo-50 text-indigo-700`).
    - *Lendário*: fundo dourado com borda âmbar (`bg-amber-100 text-amber-800 border border-amber-300`).
  - **Ícones**: Mapeamento direto com `lucide-react` (Flame, Shield, Sunrise, Timer, Zap, Landmark, Ruler, Grid, Network, Diamond, MessageSquare, Layers, Sparkles, CheckCircle2, ChevronRight).
- **Rationale**: A Constituição (Princípio V) torna mandatória a verificação pixel a pixel antes e após a geração do CSS. O Tailwind v4 já está configurado no Vite com PostCSS e classes utilitárias no projeto.

## 5. Regras de Filtragem e Edge Cases

- **Decision**:
  - Implementar o filtro da vitrine com regra declarativa: quando um filtro ativo retornar 0 badges para uma categoria, essa categoria inteira é omitida da renderização.
  - O contador das tabs permanece estático com o balanço global ("Todos (28)", "Desbloqueados (14)", "Em Progresso (6)", "Raros & Épicos (8)") para guiar o usuário com precisão.
  - Missões exibem barra de progresso com porcentagem dinâmica calculada a partir de `(atual / total) * 100`.
- **Rationale**: Alinhado com as clarificações aprovadas na sessão de especificação e evita telas com seções vazias desnecessárias.
