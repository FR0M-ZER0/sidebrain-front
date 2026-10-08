# Quickstart: Validação da Tela de Missões e Badges (SDB-84)

**Feature**: `SDB-84-missions-and-badges`
**Date**: 2026-10-07
**Status**: Ready for Verification

Este guia descreve os passos operacionais para executar, validar visualmente e testar as interações da tela de Missões e Badges implementada na task **SDB-84**.

---

## 1. Pré-Requisitos e Execução Local

```bash
# 1. Instalar dependências (caso necessário)
npm install

# 2. Subir o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 2. Cenários de Validação Visual e Interativa

### Cenário 1: Navegação e Cabeçalho Principal
1. No navegador, acesse `http://localhost:5173/missions` (ou clique no item **Missões & Badges** na barra lateral).
2. **Verificação**:
   - O item "Missões & Badges" na barra lateral esquerda (`Sidebar`) deve aparecer ativo/destacado.
   - O cabeçalho exibe o título **Missões & Conquistas** e o texto de apoio.
   - À direita do título, 3 cards verticais de métricas exibem:
     - **Badges**: `14 / 28` com ícone de insígnia azul.
     - **Nível Atual**: `Nv. 8` com ícone de engrenagem âmbar.
     - **Total XP**: `4.850 XP` com ícone de raio verde.

---

### Cenário 2: Grade de Missões e Feedback Visual
1. Na seção **Missões**, observe os 4 cards organizados em grade 2x2.
2. **Verificação**:
   - Os cards de "Consistência de Ferro" mostram progresso `5 / 5 dias (100%)`, badge verde com `✔ Concluído` e botão `Continuar Trilha →`.
   - Os cards de "Mestre da Retenção" mostram progresso `32 / 40 cards (80%)` e botão `Revisar 8 Cards`.
3. Clique no botão **Continuar Trilha →**:
   - **Resultado Esperado**: Um toast visual deve surgir no canto inferior direito confirmando a ação simulada (ex.: *"Ação demonstrativa: continuando sua trilha..."*), sem redirecionar a página.
4. Clique no botão **Revisar 8 Cards**:
   - **Resultado Esperado**: O toast deve ser exibido com feedback da sessão de revisão simulada.

---

### Cenário 3: Vitrine de Badges e Filtragem Dinâmica
1. Localize a seção **Vitrine de Badges** e suas abas de filtro.
2. **Filtro Padrão ("Todos (28)")**:
   - Exibe as 3 categorias:
     - ⚡ *Sequência & Disciplina* (4 desbloqueados / 1 em progresso)
     - 📖 *Maestria & Conhecimento* (3 desbloqueados / 1 em progresso)
     - 🌐 *Mentor & Inteligência Artificial* (3 desbloqueados / 1 bloqueado)
3. Clique na aba **Desbloqueados (14)**:
   - Apenas os badges com selo verde de concluído permanecem visíveis.
4. Clique na aba **Em Progresso (6)**:
   - Apenas os badges com barra de progresso parcial aparecem.
5. Clique na aba **Raros & Épicos (8)**:
   - Apenas insígnias com raridade Raro, Épico ou Lendário são exibidas.
6. **Ocultação de Categorias Vazias**:
   - Verifique que caso uma categoria não possua itens correspondentes ao filtro ativo, ela não é renderizada.

---

### Cenário 4: Conformidade de Código e Qualidade
Execute os comandos de verificação estática:

```bash
# Validação do linter
npm run lint

# Validação do build de produção e tipos TypeScript
npm run build
```

Ambos os comandos devem finalizar com código de saída 0 (sem erros).
