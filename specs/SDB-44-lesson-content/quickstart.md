# Quickstart: Página de Leitura da Lição

## Pré-requisitos

- Node.js/npm suportados pelo projeto.
- Dependências instaladas (`npm install`).
- Para validar a experiência local, use a prévia disponível somente em desenvolvimento. Para produção, ainda é necessário integrar o guard e a sessão de autenticação do produto.

## Executar localmente

1. Instale dependências: `npm install`.
2. Inicie o Vite: `npm run dev`.
3. Acesse `http://localhost:5173/lessons/lesson-3`. Essa prévia existe apenas com `npm run dev`; não é incluída no build de produção.

## Cenários manuais de validação

1. **Conteúdo carregado**: confirme título “Teorema de Pitágoras”, imagem/legenda e os três parágrafos na ordem do mock.
2. **Contexto e progresso**: confirme o breadcrumb, “Lição 3 de 8”, “35% concluído da trilha”, streak 12 e barra proporcional.
3. **Saída por controle**: pressione “Sair da aula”, cancele e confirme que permanece na mesma posição; repita e confirme retorno ao destino válido.
4. **Saída por teclado**: pressione `Escape`; confirme o mesmo diálogo, sem navegações duplicadas.
5. **Breadcrumbs**: navegue apenas por níveis que tenham destinos configurados; confirme que itens sem destino não parecem links ativos.
6. **Loading/erro**: introduza atraso/falha no adaptador, confirme skeleton, mensagem de erro e sucesso após “Tentar novamente”.
7. **Mídia ausente**: teste URL inválida e confirme que parágrafos e navegação continuam operáveis.
8. **Responsividade**: valide larguras desktop, tablet e mobile sem rolagem horizontal, cortes ou sobreposição.
9. **Acessibilidade/movimento**: percorra controles por teclado e ative redução de movimento do sistema; confirme foco visível, diálogo utilizável e conteúdo sem animação bloqueante.

## Verificações automatizadas existentes

- `npm run lint`
- `npm run build`

Não há framework de testes automatizados configurado no projeto no momento. Consultar o [contrato da página](contracts/lesson-page.md) e o [modelo de dados](data-model.md) para detalhes do estado esperado.
