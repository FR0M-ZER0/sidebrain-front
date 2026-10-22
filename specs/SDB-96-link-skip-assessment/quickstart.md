# Quickstart: Validação da Integração Começar do Zero

## Como testar

1. Inicie a aplicação com `npm run dev`.
2. Acesse a criação de trilha em `/trails/new/create`.
3. Digite um objetivo (ex: "Aprender TypeScript") e avance para a etapa 2.
4. Escolha a opção "Passo a Passo" / "Começar do zero" e confirme.
5. Na tela `/trails/new/guided` ("Comece pelo básico"), clique em "Continuar".
6. Observe a chamada `POST /api/v1/assessments` com `skip: true` na aba Network do navegador.
7. Confirme o avanço para a etapa de resumo com o `assessmentId` registrado.
8. Ao clicar em "Gerar trilha", certifique-se de que a requisição `POST /api/v1/tracks` contém `assessment_id`.
