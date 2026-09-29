# Quickstart de validação

## Pré-requisitos

- Node.js compatível com o projeto e dependências instaladas.
- `VITE_API_URL` configurado caso os endpoints reais estejam disponíveis.

## Executar

```bash
npm install
npm run dev
```

Abra a rota `/trails/new/generating` no navegador (após iniciar uma geração pelo fluxo de criação).

## Cenários manuais

1. **Progresso**: inicie a geração; a tela exibe selo, título, barra com percentual e estimativa ("Pronto em cerca de X...") atualizados até 100%.
2. **Etapas**: cada uma das 4 etapas é marcada ao concluir, com resumo (ex: "Módulos 1 a 4 mapeados", "24 cartões e quizzes prontos").
3. **Dicas em rotação**: o cartão "Dica do Sidebrain" alterna entre mais de uma dica sem bloquear o progresso.
4. **Conclusão**: ao atingir 100% com trilha válida, o redirecionamento para a trilha é automático, sem clique.
5. **Falha + retry**: simule erro de API; mensagem compreensível, retry inicia nova geração preservando as escolhas.
6. **Travamento**: simule 2 min sem avanço; o sistema declara travamento e oferece alternativa (SC-006).
7. **Retomada**: feche e reabra no meio da geração; com `generationId` válido o polling retoma; concluída, redireciona; falha/ausente, oferece novo início.
8. **Conclusão inválida**: simule `completed` sem trilha válida; usuário informado, sem tela vazia.
9. **Acessibilidade e responsividade**: percorra com teclado, confirme `progressbar` com valores ARIA, anúncios só em marcos e layout íntegro em viewport estreito.

## Gates automatizados

```bash
npm run lint
npm run build
```

Resultado esperado: ambos terminam sem erros. O contrato de dados e os estados esperados estão em [data-model.md](./data-model.md) e [contracts/trail-generation.md](./contracts/trail-generation.md).
