# Quickstart de validação

## Pré-requisitos

- Node.js compatível com o projeto e dependências instaladas (`npm install`).
- Para a SDB-41, o mock de submissão é suficiente; nenhuma API real é necessária.
- A rota deve estar integrada ao limite autenticado do produto antes de validar em ambiente autenticado. A base examinada não apresenta esse limite.

## Executar

```bash
npm install
npm run dev
```

Abra `/trails/new` ou o alias `/trilhas/nova` no navegador. Após envio mockado aceito, a navegação esperada é `/trails/new/start`.

## Cenários manuais

1. **Conteúdo inicial**: confirmar o indicador “Passo 1 de 3”, título, descrição, campo com placeholder, cinco sugestões, nota informativa e botão Avançar.
2. **Meta livre**: inserir texto e confirmar que permanece editável.
3. **Sugestões**: ativar cada uma das cinco opções e verificar autopreenchimento com o rótulo exato; editar após selecionar e verificar que a edição segue adiante.
4. **Validação**: tentar avançar vazio e com espaços apenas; não deve submeter e deve apresentar instrução acessível.
5. **Envio aceito**: com texto válido, confirmar estado de processamento, prevenção de duplo envio e avanço ao passo 2 após aceite mockado, levando o objetivo.
6. **Falha recuperável**: forçar temporariamente a função mock a rejeitar; a tela deve permanecer na etapa 1, manter o texto, anunciar o erro e permitir nova tentativa.
7. **Retorno**: ativar breadcrumb “Trilhas” e confirmar o retorno ao dashboard/listagem em `/`.
8. **Interações e acessibilidade**: verificar foco do textarea, seleção das sugestões por teclado, hover/tap, seta do botão, navegação por teclado e leitura das mensagens de estado.
9. **Responsividade**: validar desktop, tablet e celular; nenhum conteúdo ou ação deve ficar cortado nem exigir rolagem horizontal.
10. **Movimento reduzido**: habilitar `prefers-reduced-motion` no sistema e confirmar que animações não essenciais são desativadas/reduzidas.

## Gates automatizados

```bash
npm run lint
npm run build
```

Resultado esperado: ambos terminam sem erros. O modelo e as transições estão descritos em [data-model.md](./data-model.md), e o contrato de UI/mock em [contracts/track-creation.md](./contracts/track-creation.md).
