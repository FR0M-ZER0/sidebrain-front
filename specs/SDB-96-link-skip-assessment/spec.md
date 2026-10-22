# Feature Specification: Linkar o endpoint para começar do zero ao front

**Feature Branch**: `feat/sdb-96-linka-endpoint-comecar-do-zero`  
**Task ID**: `SDB-96` (Epic: `SDB-48`)  
**Status**: Completed  

## Contexto e Objetivo

Na criação de trilhas de aprendizagem guiada pelo Sidebrain, o estudante possui dois caminhos de calibração na etapa 2:
1. **Recomendado pela IA**: O estudante realiza o diagnóstico rápido com perguntas geradas pela IA (`POST /api/v1/assessments` com `skip: false`) para calibrar seu nível de conhecimento antes de gerar a trilha.
2. **Passo a Passo / Começar do Zero**: O estudante opta por começar pelos conceitos fundamentais. Nesse fluxo, o endpoint de avaliação inicial deve ser acionado com `skip: true` (`POST /api/v1/assessments`), registrando a avaliação como ignorada (`status: skipped`, `level: beginner`) e gerando um `assessment_id` válido para ser associado à geração da trilha (`POST /api/v1/tracks`).

## Requisitos Funcionais

- **FR-001**: A aplicação MUST disponibilizar a função `skipTrackAssessment` no módulo `trackAssessmentApi.ts`, que envia requisição `POST /api/v1/assessments` com `skip: true`, `subject` e `objective`.
- **FR-002**: A função `skipTrackAssessment` MUST monitorar o status do diagnóstico até sua transição para `skipped`, retornando o `assessmentId` e o nível inicial (`beginner`).
- **FR-003**: A página `TrailGuidedStartPage` (fluxo Começar do Zero) MUST invocar a confirmação de início do zero e repassar o `assessmentId` obtido e `startMode: 'step_by_step'` para a etapa seguinte.
- **FR-004**: A interface em `TrailGuidedStartPage` MUST exibir indicador visual de carregamento durante a requisição e mensagem acessível em caso de falha.
- **FR-005**: O resumo em `TrailOnboardingSummaryPage` e o acionamento da geração de trilha MUST propagar o `assessmentId` ao iniciar a geração da trilha via `POST /api/v1/tracks`.
