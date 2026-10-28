# Quickstart & Guia de Validação: Telas de Autenticação e Perfil

**Feature**: `SDB-82-signin-profile`
**Data**: 2026-10-07
**Status**: Ready

## 1. Visão Geral

Este guia descreve os passos práticos para rodar o projeto localmente e validar ponta a ponta todas as funcionalidades das telas de Login, Cadastro, Recuperação de Senha e Perfil do Usuário entregues na task **SDB-82**.

---

## 2. Pré-requisitos e Execução Local

```bash
# Instalar dependências (caso ainda não tenha feito)
npm install

# Subir a aplicação em modo de desenvolvimento
npm run dev

# Validar linting e tipagem TypeScript
npm run lint
npm run build
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 3. Roteiro de Validação Ponta a Ponta

### Cenário 1: Tela de Login e Validações (`/login`)
1. Acesse `http://localhost:5173/login`.
2. Verifique o layout em 2 colunas: card branco à esquerda com cabeçalho superior e painel lateral à direita com métricas de microlearning e prova social.
3. Clique em "Entrar no Sidebrain" com campos vazios:
   - **Resultado esperado**: Mensagens visuais de validação indicando obrigatoriedade do e-mail e senha.
4. Digite uma senha e clique no ícone de olho:
   - **Resultado esperado**: A senha alterna entre texto visível e caracteres ocultos.
5. Marque o checkbox "Lembrar de mim".
6. Clique nos botões sociais "Google" ou "GitHub":
   - **Resultado esperado**: Notificação demonstrativa de login social.
7. Preencha e-mail válido (ex: `joao@exemplo.com`) e qualquer senha, e clique em "Entrar no Sidebrain":
   - **Resultado esperado**: Simulação de sucesso com redirecionamento para o Dashboard principal (`/`).

---

### Cenário 2: Tela de Cadastro e Força de Senha (`/cadastro`)
1. A partir de `/login`, clique no link "Cadastre-se gratuitamente" (ou acesse `http://localhost:5173/cadastro`).
2. Verifique o layout com o painel institucional à esquerda (destaque de IA e prova social) e o formulário à direita.
3. No campo "Criar Senha", digite progressivamente:
   - `abc`: indicador exibe "Fraca", 1 barra âmbar, nenhum critério completo.
   - `abc12345`: indicador exibe "Média", 2 barras, critérios "8+ caracteres" e "1 número" marcados com check.
   - `Abc12345!@#`: indicador exibe "Forte", 3 barras verdes, todos os 3 critérios marcados.
4. Tente clicar em "Criar Conta Gratuita" sem marcar o checkbox de termos:
   - **Resultado esperado**: O botão permanece desabilitado ou validação visual acusa a necessidade de aceitar os termos.
5. Marque o checkbox de termos e submeta o formulário:
   - **Resultado esperado**: Simulação de cadastro com login automático e redirecionamento para o Dashboard principal (`/`).

---

### Cenário 3: Tela de Recuperação de Senha e Confirmação (`/recuperar-senha`)
1. Acesse `http://localhost:5173/recuperar-senha` (ou clique em "Esqueceu a senha?" no login).
2. Verifique o card centralizado com ícone de cadeado, título "Recuperar sua senha" e box "Proteção Contínua".
3. Digite um e-mail válido (ex: `aluno@sidebrain.com`) e clique em "Enviar Link de Recuperação":
   - **Resultado esperado**: O card transiciona internamente para o estado dedicado de confirmação, informando que as instruções foram enviadas para `aluno@sidebrain.com` com prazo de 30 minutos.
4. Clique em "Voltar para o Login":
   - **Resultado esperado**: Retorna com sucesso para `/login`.

---

### Cenário 4: Página de Perfil, Trilhas, Badges e Edição (`/perfil`)
1. Com a sessão ativa, navegue até `http://localhost:5173/perfil` (ou clique no menu lateral "Perfil" na Sidebar).
2. **Hero Banner**:
   - Confira a foto de João Silva com selo dourado, badge "MEMBRO PRO", Nível 8, "Estudando desde Jan 2025" e barra "850 / 1.000 XP" (85% preenchida).
3. **Trilhas Ativas**:
   - Confira os 2 cards: "Língua Japonesa (N5 Básico)" (40%) e "Matemática do Zero (Geometria Plana)" (65%).
   - Clique em "Retomar" na trilha de japonês:
     - **Resultado esperado**: Navega para a rota de lição existente (`/lessons/1`).
4. **Badges em Destaque**:
   - Confira os 4 badges com seus títulos, ícones e raridades: Fogo Imparável (Raro), Mestre de XP (Épico), Poliglota Curioso (Comum), Geômetra Iniciante (Incomum).
5. **Modal de Edição de Perfil**:
   - Clique no botão "Editar Perfil" no topo do banner:
     - **Resultado esperado**: Abre o modal com campos para nome e foto.
   - Altere o nome para "João Silva Santos" e clique em "Salvar Alterações":
     - **Resultado esperado**: O banner e o menu lateral atualizam imediatamente o nome exibido em tela.
6. **Encerrar Sessão**:
   - No card "Conta & Segurança", clique no botão vermelho "Encerrar Sessão":
     - **Resultado esperado**: A sessão é limpa no storage local e a aplicação redireciona imediatamente para `/login`.
   - Tente acessar `/perfil` diretamente na barra de endereço:
     - **Resultado esperado**: O `PrivateRoute` intercepta o acesso e redireciona de volta para `/login`.
