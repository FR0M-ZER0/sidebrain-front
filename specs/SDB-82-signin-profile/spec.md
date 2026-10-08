# Feature Specification: Telas de Autenticação e Perfil do Usuário

**Feature Branch**: `SDB-82-signin-profile`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "SDB-82: Criar as telas de login, cadastro, recuperação de senha e perfil do usuário do Sidebrain, seguindo as referências visuais fornecidas (docs/img/Sidebrain_-_Login_Desktop.png, docs/img/Sidebrain_-_Cadastro_Desktop.png, docs/img/Sidebrain_-_Recuperacao_de_Senha_Desktop.png e docs/img/Sidebrain_-_Perfil_do_Usuario_Desktop.png). As telas devem permitir navegar entre os fluxos de autenticação e apresentar informações de perfil, progresso de aprendizagem e segurança da conta utilizando dados mockados demonstrativos sem persistência no backend nesta etapa."

## Clarifications

### Session 2026-10-07
- Q: Para qual rota o usuário deve ser redirecionado após a conclusão bem-sucedida do Login ou Cadastro? → A: Redirecionar tanto o Login quanto o Cadastro para o Dashboard principal (`/`).
- Q: Como o estado simulado de autenticação deve ser gerenciado para garantir conformidade com as rotas protegidas e testabilidade do perfil? → A: Sessão mockada ativa por padrão persistida localmente (logout limpa a sessão e login ou cadastro a restaura).
- Q: Como a tela de Recuperação de Senha deve apresentar a confirmação simulada após o envio do link? → A: Transicionar o card para um estado dedicado de confirmação visual com botão de retorno para a tela de login.
- Q: Como os botões 'Editar Perfil' e 'Alterar Foto' na página de Perfil devem reagir ao clique do usuário? → A: Abrir um modal simples de edição que atualiza os dados em memória na sessão (permitindo alterar nome e foto/avatar durante a visualização).
- Q: Como os botões de retomada das trilhas ativas na página de Perfil devem se comportar ao serem clicados? → A: Navegar para rotas de lições ou trilhas já existentes na plataforma (`/lessons/:id` ou `/trails/:slug`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acesso à Conta via Tela de Login (Priority: P1)

Como estudante cadastrado ou visitante, quero acessar a tela de login para inserir minhas credenciais (ou optar por autenticação social demonstrativa), visualizar o estado de validação dos campos e acessar rapidamente os caminhos de recuperação de senha e criação de conta.

**Why this priority**: A tela de login é a porta de entrada para a plataforma e a âncora para a transição entre visitantes e usuários autenticados.

**Independent Test**: Acessar a rota de login, verificar a composição em duas colunas (conteúdo motivacional/microlearning à direita e formulário à esquerda), preencher e-mail e senha, alternar a visibilidade da senha, marcar "Lembrar de mim", acionar o envio e confirmar que a navegação para recuperação de senha e cadastro funciona.

**Acceptance Scenarios**:

1. **Given** que o visitante acessa a tela de login, **When** a página é renderizada em desktop, **Then** visualiza o cabeçalho superior centralizado com a marca Sidebrain, o card branco de login com destaque superior e o painel lateral com métricas de microlearning, progresso diário e depoimento, correspondente à imagem `Sidebrain_-_Login_Desktop.png`.
2. **Given** que o usuário preenche um e-mail válido e uma senha, **When** clica em "Entrar no Sidebrain", **Then** o sistema exibe feedback simulado de autenticação bem-sucedida e redireciona o usuário para o Dashboard principal (`/`).
3. **Given** que o usuário submete campos vazios ou formato de e-mail inválido, **When** a validação é executada, **Then** mensagens de erro visuais claras são exibidas abaixo dos respectivos campos sem enviar o formulário.
4. **Given** que o usuário clica no controle de visibilidade da senha (ícone de olho), **When** o estado é alternado, **Then** o texto da senha é exibido ou mascarado instantaneamente.
5. **Given** que o usuário clica em "Esqueceu a senha?" ou "Cadastre-se gratuitamente", **When** o link é selecionado, **Then** é redirecionado respectivamente para a tela de recuperação de senha ou para a tela de cadastro.
6. **Given** que o usuário clica nos botões de autenticação social (Google ou GitHub), **When** a ação é disparada, **Then** uma resposta visual demonstrativa é apresentada.

---

### User Story 2 - Cadastro de Nova Conta de Estudante (Priority: P2)

Como novo estudante, quero acessar a tela de cadastro para criar uma conta informando meu nome completo, e-mail e uma senha segura com feedback imediato de requisitos, além de concordar com os termos de uso.

**Why this priority**: Permite a captação de novos estudantes no ecossistema Sidebrain, estabelecendo requisitos de segurança para credenciais e conformidade com termos legais.

**Independent Test**: Acessar a tela de cadastro, preencher nome e e-mail, digitar senhas de complexidades diferentes observando os indicadores visuais de requisitos (8+ caracteres, 1 número, 1 símbolo) e a barra de força, alternar o aceite dos termos e confirmar o envio demonstrativo.

**Acceptance Scenarios**:

1. **Given** que o visitante acessa a tela de cadastro, **When** a tela é exibida em desktop, **Then** apresenta à esquerda o painel institucional com benefícios cognitivos do Sidebrain, destaque de IA e prova social (+12k estudantes), e à direita o card de formulário de cadastro, correspondente à imagem `Sidebrain_-_Cadastro_Desktop.png`.
2. **Given** que o usuário digita a senha no formulário, **When** os caracteres são inseridos, **Then** os indicadores de requisitos (mínimo de 8 caracteres, ao menos 1 número e ao menos 1 símbolo) e a barra de força atualizam dinamicamente seus estados visuais (Fraca, Média, Forte).
3. **Given** que o checkbox de concordância com os Termos de Serviço e Política de Privacidade não está marcado, **When** o usuário tenta submeter o formulário, **Then** o sistema bloqueia o envio ou exige a marcação obrigatória antes de concluir.
4. **Given** que todos os campos estão válidos e os termos aceitos, **When** o usuário clica em "Criar Conta Gratuita", **Then** uma confirmação simulada de cadastro é apresentada e o fluxo redireciona o usuário para o Dashboard principal (`/`).
5. **Given** que o usuário já possui conta e clica em "Faça login", **When** o link é acionado, **Then** navega diretamente para a tela de login.

---

### User Story 3 - Solicitação de Recuperação de Senha (Priority: P3)

Como usuário que esqueceu a senha, quero informar meu e-mail cadastrado na tela de recuperação para receber um link seguro de redefinição e receber instruções claras sobre o prazo de validade desse link.

**Why this priority**: Garante que estudantes possam restabelecer o acesso às suas contas e trilhas com segurança e autonomia.

**Independent Test**: Acessar a tela de recuperação de senha a partir do login, preencher o e-mail, acionar o envio do link, verificar a mensagem de expiração de 30 minutos e usar o link para voltar à tela de login.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa a recuperação de senha, **When** a tela é renderizada em desktop, **Then** exibe o card centralizado com ícone de segurança, título "Recuperar sua senha", texto explicativo, campo de e-mail e aviso de proteção contínua com validade de 30 minutos, correspondente à imagem `Sidebrain_-_Recuperacao_de_Senha_Desktop.png`.
2. **Given** que o usuário insere um e-mail válido, **When** clica em "Enviar Link de Recuperação", **Then** o sistema valida o formato e transiciona o card para um estado dedicado de confirmação visual (exibindo o e-mail informado, mensagem de verificação da caixa de entrada e botão de retorno ao login).
3. **Given** que o usuário clica em "Voltar para o Login", **When** o link é acionado, **Then** retorna à tela de login preservando a facilidade de navegação.
4. **Given** que o usuário clica em "Fale com o suporte", **When** o link é acionado, **Then** direciona para o canal de suporte ou abre o canal de ajuda da plataforma.

---

### User Story 4 - Visualização e Gerenciamento do Perfil do Usuário (Priority: P4)

Como estudante logado, quero visualizar meu perfil completo com dados cadastrais, nível, progresso de XP, trilhas de aprendizagem em andamento, badges de conquista e configurações de segurança da conta, com opções de edição demonstrativas e encerramento de sessão.

**Why this priority**: O perfil centraliza a identidade do estudante, o engajamento gamificado da plataforma e o controle sobre credenciais e dispositivos.

**Independent Test**: Acessar a rota de perfil dentro do layout do estudante (com Sidebar e HeaderBar existentes), conferir a exibição das métricas mockadas (João Silva, Membro Pro, Nível 8, 850/1.000 XP), as duas trilhas ativas (Japonês e Matemática), os quatro badges em destaque e o painel de Conta & Segurança, acionando o botão de encerrar sessão para voltar ao login.

**Acceptance Scenarios**:

1. **Given** que o estudante navega até o item "Perfil" no menu lateral, **When** a página "Meu Perfil" é carregada, **Then** o cabeçalho exibe "Meu Perfil" com o subtítulo descritivo, e o banner superior apresenta foto de perfil, selo dourado, nome "João Silva", badge "MEMBRO PRO", nível 8, data de adesão (Jan 2025) e barra de progresso para o Nível 9 (850 / 1.000 XP), correspondente à imagem `Sidebrain_-_Perfil_do_Usuario_Desktop.png`.
2. **Given** que a seção "Trilhas Ativas & Maestria" é exibida, **When** o usuário consulta suas trilhas e clica nos botões de retomada, **Then** são listados os cards de "Língua Japonesa (N5 Básico)" (40% concluído) e "Matemática do Zero (Geometria Plana)" (65% concluído), e a ação navega diretamente para as rotas correspondentes já existentes (`/lessons/:id` ou `/trails/:slug`).
3. **Given** que a seção "Badges em Destaque (4 / 18)" é exibida, **When** o usuário visualiza as conquistas, **Then** são exibidos os cards com ilustrações/ícones, títulos, descrições e raridades: "Fogo Imparável" (Raro), "Mestre de XP" (Épico), "Poliglota Curioso" (Comum) e "Geômetra Iniciante" (Incomum), além do link "Ver vitrine completa".
4. **Given** que o painel lateral "Conta & Segurança" é exibido, **When** o usuário visualiza os itens, **Then** são apresentados os status: "Alterar Senha (Atualizada há 3 meses)", "Autenticação em 2 Etapas (Ativada - App Authenticator)" e "Dispositivos Conectados (2 ativos agora)".
5. **Given** que o usuário clica em "Editar Perfil" ou "Alterar Foto", **When** o botão é selecionado, **Then** um modal simples de edição é exibido permitindo alterar o nome e a foto/avatar com atualização imediata dos dados em memória na sessão.
6. **Given** que o usuário clica em "Encerrar Sessão", **When** a confirmação é acionada, **Then** o sistema simula o logout e redireciona o usuário para a tela de login.

---

### Edge Cases

- **Navegação com campos preenchidos**: O que acontece se o usuário começar a preencher o cadastro e clicar em "Faça login"? O sistema navega para a tela de login de forma fluida sem travar o estado.
- **Espaços vazios e caracteres especiais em nomes**: Como o formulário de cadastro reage a nomes com apenas espaços ou caracteres inválidos? A validação visual acusa campo obrigatório antes de prosseguir.
- **Submissão repetida de formulário**: O que acontece se o usuário clicar múltiplas vezes rapidamente em "Entrar no Sidebrain" ou "Criar Conta Gratuita"? Os botões devem apresentar estado de carregamento simulado (ou desabilitar brevemente) para evitar múltiplos disparos.
- **Telas em resoluções intermediárias (laptops ou janelas reduzidas)**: Como as composições de duas colunas de login e cadastro se comportam em telas menores? O layout deve manter legibilidade, empilhando as colunas ou ajustando paddings sem cortar o formulário principal.
- **Preservação de componentes compartilhados**: O layout do Perfil deve reutilizar estritamente os componentes já existentes (`Sidebar`, `HeaderBar`, cards genéricos de status e botões) sem modificar a aparência que eles possuem nas páginas já entregues do dashboard e trilhas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar uma página pública de Login com layout em duas colunas, cabeçalho de marca e formulário com validação visual de e-mail e senha.
- **FR-002**: O sistema MUST fornecer na tela de Login controles para exibir/ocultar senha e opção de "Lembrar de mim".
- **FR-003**: O sistema MUST fornecer na tela de Login botões demonstrativos de login social com Google e GitHub.
- **FR-004**: O sistema MUST disponibilizar links de navegação cruzada entre Login, Cadastro e Recuperação de Senha.
- **FR-005**: O sistema MUST disponibilizar uma página pública de Cadastro com painel explicativo institucional à esquerda e card de formulário à direita.
- **FR-006**: O formulário de Cadastro MUST validar nome completo, e-mail e requisitos de senha (mínimo de 8 caracteres, 1 número e 1 símbolo), exibindo indicador dinâmico de força e status de cada critério.
- **FR-007**: O formulário de Cadastro MUST conter checkbox obrigatório de concordância com os Termos de Serviço e a Política de Privacidade antes da conclusão do envio.
- **FR-008**: O sistema MUST disponibilizar uma página pública de Recuperação de Senha em card centralizado, com campo de e-mail, aviso de expiração do link em 30 minutos, transição para estado dedicado de confirmação visual após envio válido e link de retorno ao Login.
- **FR-009**: O sistema MUST simular com sucesso as ações de submissão de Login e Cadastro redirecionando para o Dashboard principal (`/`), e Recuperação de Senha exibindo feedback visual de confirmação de envio.
- **FR-010**: O sistema MUST disponibilizar a página "Meu Perfil" integrada à navegação autenticada da plataforma (`/perfil`), acessível pelo menu lateral.
- **FR-011**: A página de Perfil MUST apresentar os dados de identificação do estudante: foto/avatar, nome "João Silva", plano "Membro Pro", nível 8, data de início ("Estudando desde Jan 2025") e barra de progresso para o Nível 9 (850 / 1.000 XP).
- **FR-012**: A página de Perfil MUST listar as trilhas ativas do usuário com título, categoria, percentual concluído, próxima lição e botão de retomada que navega para as rotas existentes da plataforma (`/lessons/:id` ou `/trails/:slug`).
- **FR-013**: A página de Perfil MUST exibir a seção de Badges em Destaque contendo a contagem (4 / 18) e os quatro cards de conquistas com títulos, descrições e badges de raridade.
- **FR-014**: A página de Perfil MUST exibir o card lateral "Conta & Segurança" com indicadores de última alteração de senha, status de autenticação em 2 etapas e contagem de dispositivos conectados.
- **FR-015**: A página de Perfil MUST conter botões interativos para "Editar Perfil" e "Alterar Foto" que abrem um modal simples de edição atualizando dados em memória na sessão, e botão "Encerrar Sessão" que limpa a sessão mockada local e redireciona para a tela de login.
- **FR-016**: A implementação da página de Perfil MUST reutilizar a estrutura existente de navegação (`Sidebar`, `HeaderBar` ou layout de estudante correspondente), sem alterar os estilos e comportamentos globais desses componentes compartilhados.

### Key Entities *(include if feature involves data)*

- **Credenciais de Autenticação**: Conjunto de dados informado para acesso (e-mail institucional/pessoal e senha), associado à opção de persistência de sessão ("Lembrar de mim").
- **Dados de Cadastro**: Informações de registro do novo estudante, compreendendo nome completo, e-mail, senha com requisitos de complexidade e consentimento legal dos termos.
- **Solicitação de Redefinição**: Registro temporário de solicitação de recuperação de senha associado a um e-mail cadastrado com expiração definida em 30 minutos.
- **Perfil do Estudante**: Entidade do usuário logado contendo identificação, status do plano (Membro Pro), nível atual (8), pontuação de experiência (XP), histórico e preferências de segurança da conta.
- **Trilha Ativa de Aprendizagem**: Representação do progresso do estudante em um assunto específico (ex: Japonês, Geometria), contendo categoria, porcentagem concluída e apontador para a próxima lição a retomar.
- **Badge / Conquista**: Selo de reconhecimento gamificado obtido pelo estudante através de marcos de estudo (dias de streak, XP acumulado, tópicos finalizados) categorizado por grau de raridade (Comum, Incomum, Raro, Épico).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O estudante consegue navegar sem falhas entre Login, Cadastro e Recuperação de Senha com tempo de transição imediato (inferior a 300ms entre telas).
- **SC-002**: 100% dos formulários de Login, Cadastro e Recuperação de Senha fornecem feedback visual imediato ao usuário em caso de campos não preenchidos ou preenchidos incorretamente.
- **SC-003**: Na tela de Cadastro, os 3 critérios de senha (8+ caracteres, número, símbolo) e a barra de força refletem visualmente a validação em tempo real enquanto o usuário digita.
- **SC-004**: A página de Perfil renderiza com fidelidade visual a totalidade dos dados mockados especificados (dados pessoais, 2 trilhas ativas, 4 badges em destaque e painel de segurança), em conformidade pixel-a-pixel com as imagens de referência desktop.
- **SC-005**: Ao acionar "Encerrar Sessão" no Perfil, o usuário é direcionado para a tela de Login em 1 clique, confirmando o encerramento da experiência autenticada simulada.

## Assumptions

- O escopo atual desta entrega abrange a interface gráfica e comportamento frontend com dados mockados em storage local / memória (sessão mockada ativa por padrão para permitir inspeção direta e testes do perfil e rotas internas sem bloqueios acidentais, suportando o ciclo de logout e login), sem integração com endpoints de autenticação JWT, envio de e-mails via SMTP ou banco de dados relacional nesta etapa.
- Os botões sociais (Google e GitHub) atuam de maneira ilustrativa/demonstrativa, exibindo resposta simulada ao clique.
- As ações de "Editar Perfil" e "Alterar Foto" funcionam de forma demonstrativa (exibindo formulário/seletor ou aviso), sem necessidade de salvar alterações permanentes nesta versão.
- As imagens de referência em `docs/img/` (`Sidebrain_-_Login_Desktop.png`, `Sidebrain_-_Cadastro_Desktop.png`, `Sidebrain_-_Recuperacao_de_Senha_Desktop.png` e `Sidebrain_-_Perfil_do_Usuario_Desktop.png`) são a autoridade visual para cores, tipografia, espaçamentos e hierarquia das novas telas.
- As rotas públicas (`/login`, `/cadastro`, `/recuperar-senha`) não exigem autenticação prévia, enquanto a rota de Perfil (`/perfil`) compõe o ecossistema interno de páginas de estudante.
