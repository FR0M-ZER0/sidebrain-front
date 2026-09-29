# Modelo de dados: Criação inicial de trilha guiada

## `PopularSuggestion`

Opção estática que pode iniciar ou substituir o texto da meta.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` | Identificador estável e único entre as sugestões desta tela |
| `label` | `string` | Texto apresentado e usado para preencher a meta |
| `icon` | `string \| undefined` | Emoji/ícone opcional apresentado como elemento decorativo |

Sugestões desta versão: Japonês para Iniciantes; Matemática & Geometria; Python para Ciência de Dados; UI/UX Design Moderno; Inglês para Entrevistas.

## `TrackGoalDraft`

Objetivo editável durante a etapa 1. O estado vive no formulário e, após aceite do mock, segue como estado de navegação para a etapa 2.

| Campo | Tipo | Regra |
|---|---|---|
| `goalDescription` | `string` | Texto livre; para submissão, deve conter ao menos um caractere não branco depois de `trim` |
| `sourceSuggestionId` | `string \| null` | Sugestão que preencheu o campo, se aplicável; pode ser nulo ou deixar de corresponder após edição |
| `submissionStatus` | `idle \| submitting \| failed \| accepted` | `submitting` bloqueia envio duplicado; `failed` preserva o texto; `accepted` autoriza navegação |
| `errorMessage` | `string \| null` | Mensagem compreensível; preenchida apenas em falha |

Não existe limite máximo de caracteres definido pela spec. Não aplicar corte arbitrário sem alinhamento com o contrato futuro do backend.

## `Step1SubmissionResult`

Resultado mínimo fornecido pelo mock na versão sem endpoint real.

| Campo | Tipo | Regra |
|---|---|---|
| `success` | `true` | Apenas a aceitação permite avançar |
| `nextStep` | `2` | Identifica a próxima etapa de criação |

O contrato real poderá incluir identificador de rascunho/trilha quando o backend estiver disponível; esse identificador não é pressuposto nem inventado para o mock atual.

## Transições

```text
idle + meta vazia/espacos + avançar -> idle (não submete; mostra validação)
idle + meta válida + avançar -> submitting
submitting + mock aceito -> accepted -> navegar para /trails/new/start com goalDescription
submitting + falha -> failed (preserva goalDescription e oferece nova tentativa)
failed + editar -> idle (remove estado de erro/validação pertinente)
failed + tentar novamente -> submitting
selecionar sugestão -> atualiza goalDescription e sourceSuggestionId; usuário pode editar
breadcrumb Trilhas -> / (dashboard com seção de trilhas)
```

Não há persistência em servidor nem em armazenamento local nesta etapa enquanto a integração real estiver pendente.
