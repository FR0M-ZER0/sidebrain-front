# Quickstart: Ranking Semanal

## Pré-requisitos

- Node.js e npm instalados.
- Checkout local do frontend.
- Para validar o fluxo de usuário, `/ranking` deve estar dentro do `PrivateRoute` existente em `src/components/general/PrivateRoute.tsx`.
- A imagem base está em `docs/img/Sidebrain_-_Ranking_Desktop.png`. A validação pixel a pixel no Figma foi dispensada pelo usuário para esta entrega.

## Preparação e execução

```bash
npm install
npm run dev
```

Entrar pelo fluxo autenticado existente e abrir a rota `/ranking`. O entry local `ranking-preview.html` servido pelo Vite também permite revisar a tela em desenvolvimento, mas não substitui o guard da rota.

## Cenários de validação manual

### 1. Liga semanal e ciclo

- Confirmar seleção inicial de Liga Semanal (Divisão Atual), Divisão I, ciclo semanal, tempo restante de 2 dias, 14 horas e 28 minutos e encerramento no domingo às 23:59.
- Confirmar Mariana Souza em 1º (nível 67, 18 dias, 6.420 XP, Líder), Lucas Rocha em 2º (nível 10, 19 dias, 5.890 XP) e Camila Mendes em 3º (nível 100, 18 dias, 5.340 XP).
- Confirmar que o pódio e a classificação não sugerem que posições/dados ausentes sejam reais.

### 2. Resumo e cabeçalho

- Confirmar Alexandre M. (Você) em 4º, com 4.850 XP, +240 XP informado até o pódio, 14 módulos concluídos e ofensiva de 14 dias.
- Confirmar cabeçalho com 320/500 XP, sequência de 12 dias e indicação de notificação pendente.
- Confirmar que 12 dias do cabeçalho não substituem nem se confundem com os 14 dias do resumo.

### 3. Classificação e evolução

- Conferir posições 4 a 10 e trilhas, sequências, consistências e XP semanal segundo `spec.md`.
- Confirmar campos de posição, estudante, trilha, consistência e XP, além de nível e sequência conforme definidos no contrato.
- Confirmar destaque “Você”, linha de corte visual como na imagem entre 5º e 6º, valores de evolução com sinal e estado neutro quando não houver variação.

### 4. Troca de modo e expansão

- Alternar para Ranking Global e confirmar que contexto semanal/divisão, pódio, resumo, posição/pontuação e tabela são substituídos pelo conjunto global.
- Confirmar que busca, navegação e indicadores gerais do cabeçalho permanecem iguais.
- Retornar à Liga Semanal e confirmar restauração dos dados da Divisão I.
- Acionar “Ver ranking completo”; confirmar novas posições do modo atual, contagem atualizada e mensagem de fim quando não houver posições restantes.

### 5. Acessibilidade e responsividade

- Operar alternância e expansão por teclado, verificar foco visível e rótulos acessíveis.
- Confirmar que pódio, corte, evolução e consistência não são comunicados apenas por cor.
- Verificar desktop e larguras menores; nenhum campo obrigatório ou controle essencial pode ficar cortado/inacessível.
- Comparar cores, tipografia, paddings, ícones, bordas e sombras com `docs/img/Sidebrain_-_Ranking_Desktop.png`. Não executar comparação pixel a pixel no Figma nesta entrega.

### 6. Gates do repositório

```bash
npm run lint
npm run build
```

Resultado esperado: lint sem erros e build de produção concluído. A rota deve permanecer sob `PrivateRoute`; a validação visual usa a imagem local, sem gate de Figma.
