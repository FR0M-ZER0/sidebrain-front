# Quickstart: Detalhes da Trilha

## Pré-requisitos

- Node.js e npm compatíveis com o projeto instalados.
- Dependências instaladas (`npm install`).
- Implementação da feature disponível na branch `SDB-46-learning-track`.
- Referência visual desktop: `docs/img/Sidebrain - Página da trilha (Desktop).png`.
- Antes de produzir CSS/Tailwind, inspecione no Figma o frame “Sidebrain - Página da trilha (Desktop)” e compare-o com a imagem local; se o arquivo continuar exigindo login, mantenha tarefas de estilo bloqueadas.
- A integração à rota de produção deve aguardar guard de autenticação real. Breadcrumb e ação de missões devem usar as âncoras correspondentes do dashboard.

## Verificações estáticas

Na raiz do repositório:

```bash
npm run lint
npm run build
```

**Esperado**: ESLint e compilação/empacotamento concluem sem erros.

## Validação manual

Inicie a aplicação:

```bash
npm run dev
```

Use `http://localhost:5173/track-preview.html` como visualização de desenvolvimento isolada enquanto o guard ainda não existe. Validar a fixture `lingua-japonesa` e os cenários abaixo. Não publicar uma rota privada sem autenticação funcional.

### Resumo e progresso

1. Abra a trilha mockada “Língua Japonesa”.
2. Confira nível, 4/10 lições, 40% e as barras de progresso.
3. Confira títulos, recompensas, contagens e percentuais das duas missões.
4. Na missão inconsistente (0 de 5 e 67%), confirme que os valores fornecidos aparecem e que a divergência é explicitamente indicada.

**Esperado**: dados de trilha e missão são exibidos sem recomputar ou esconder valores fornecidos.

### Módulos, estados de lição e expansão

1. Expanda/recolha Módulo 1 e Módulo 2 pelo cabeçalho e pelo controle de seta.
2. Confirme que lições concluídas oferecem “Revisar” e a disponível oferece “Iniciar”.
3. Tente ativar lições bloqueadas e os módulos 3 e 4.

**Esperado**: os accordions acessíveis animam sem prender foco; controles bloqueados não expandem nem navegam; estados possuem texto/ícone além de cor.

### Navegação

1. Ative o breadcrumb “Trilhas Ativas” e confirme retorno ao dashboard/listagem atualmente existente.
2. Ative “Iniciar” e “Revisar” e confira a lição correspondente e o caminho de retorno.
3. Ative “Ver todas as missões” e confirme chegada à seção de missões do dashboard via `/#missions`.

**Esperado**: ações de lição abrem os IDs corretos; as âncoras retornam às seções de trilhas e missões pretendidas, inclusive em navegação direta.

### Loading, responsividade, teclado e movimento reduzido

1. Simule o estado inicial de carregamento da consulta.
2. Teste expansão e ações com teclado, incluindo foco visível e controles bloqueados.
3. Valide desktop, tablet e mobile sem sobreposição, corte ou rolagem horizontal.
4. Ative redução de movimento do sistema/browser e recarregue.

**Esperado**: skeletons representam resumo, missões e módulos; a página reflui para uma coluna em telas estreitas; animações são reduzidas sem ocultar conteúdo ou estados.

### Avaliação de identificação do próximo passo

1. Em uma avaliação moderada, convide 20 estudantes representativos e apresente a página carregada com a fixture padrão.
2. Sem instrução sobre onde clicar, peça a cada participante que identifique a lição que pode iniciar e como iniciá-la; cronometre a partir da apresentação da página.
3. Registre em `quickstart.md` o número de participantes que concluíram em até 10 segundos.

**Esperado**: pelo menos 19 de 20 participantes identificam a lição disponível e a ação “Iniciar” em até 10 segundos.
