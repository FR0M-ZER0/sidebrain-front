# Quickstart: Resultado da Lição

## Pré-requisitos

- Node.js e npm compatíveis com o projeto instalados.
- Dependências do repositório instaladas (`npm install`).

## Execução local

Na raiz do repositório:

```bash
npm run dev
```

Abra a aplicação e acesse `/quiz-result`.

## Validação automatizada

```bash
npm run lint
npm run build
```

**Esperado**: ambos os comandos finalizam sem erros.

## Cenários de validação manual

1. **Resumo**: confirme o status “Módulo Concluído com Sucesso”, a mensagem de desempenho impecável, 100%, 5 de 5, +80 XP, precisão 100%, duração 2m 15s e sequência de 12 dias.
2. **Questões**: confirme os cinco títulos, categorias, tempos e status conforme [data-model.md](data-model.md). Expanda/recolha itens diferentes e verifique enunciado, resposta selecionada, resposta correta e explicação.
3. **Ação global**: expanda tudo; confirme todos os itens abertos e o rótulo “Recolher todas”. Recolha tudo e confirme o rótulo “Expandir todas”. Repita com estado misto.
4. **Feedback**: acione “Ver Feedback Detalhado da IA”; confirme que o painel aparece dentro da mesma tela e apresenta destaque, ponto positivo e recomendação mockados.
5. **Refazer**: acione “Refazer Quiz”; confirme que aparece uma confirmação na tela e que nenhum quiz real ou navegação externa é iniciado.
6. **Retorno**: use o botão de fechar e Escape separadamente; confirme que cada interação retorna à tela anterior sem duplicar navegação.
7. **Layout de foco**: confirme que a rota não apresenta sidebar, que o cabeçalho/rodapé correspondem à referência e que o conteúdo continua utilizável em viewport menor.
8. **Não regressão**: confirme que componentes compartilhados em outras telas mantêm aparência e comportamento inalterados.

## Contratos

Não aplicável: a tela não publica nem consome contratos externos.
