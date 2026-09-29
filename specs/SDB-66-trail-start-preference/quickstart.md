# Quickstart de validação

## Pré-requisitos

- Node.js compatível com o projeto e dependências instaladas.
- `VITE_API_URL` configurado caso os endpoints reais estejam disponíveis.

## Executar

```bash
npm install
npm run dev
```

Abra a rota `/trails/new/start` no navegador. A dashboard pode ser usada como ponto de entrada quando a integração do CTA for concluída.

## Cenários manuais

1. **Comparar opções**: a tela exibe “Recomendado pela IA” e “Passo a passo”, com diferenças de velocidade, personalização e profundidade; o progresso indica a etapa 2 de 3.
2. **Escolher IA**: selecione a opção, confirme e verifique a navegação para `/trails/new/assessment`; perguntas e opções devem carregar e o estado indicar diagnóstico em andamento.
3. **Escolher passo a passo**: selecione a alternativa, confirme e verifique a navegação para a primeira etapa guiada sem exigir perguntas.
4. **Validação de seleção**: tente confirmar sem escolher uma opção; o botão deve permanecer desabilitado e nenhum request deve ser enviado.
5. **Retomar**: abandone e reabra o fluxo; a preferência confirmada deve aparecer selecionada e o progresso da trilha deve permanecer intacto.
6. **Alterar preferência**: volte à configuração, escolha o outro modo e confirme; o estado deve ser atualizado sem apagar `assessmentId` ou progresso já concluído.
7. **Falha de rede**: simule erro de API; exiba mensagem compreensível, mantenha a seleção local e permita tentar novamente.
8. **Acessibilidade e responsividade**: percorra com teclado, confirme foco visível e verifique que os cards/CTAs não se sobrepõem em viewport estreito.

## Gates automatizados

```bash
npm run lint
npm run build
```

Resultado esperado: ambos terminam sem erros. O contrato de dados e os estados esperados estão em [data-model.md](./data-model.md) e [contracts/trail-onboarding.md](./contracts/trail-onboarding.md).