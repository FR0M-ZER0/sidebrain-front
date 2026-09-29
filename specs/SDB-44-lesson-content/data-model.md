# Data Model: Página de Leitura da Lição

## Lesson

Representa uma unidade de aprendizagem carregada pela rota `/lessons/:id`.

| Campo | Tipo | Obrigatório | Regras |
|---|---|---:|---|
| `id` | string | Sim | Identificador estável; deve corresponder ao `id` da rota. |
| `title` | string | Sim | Título da lição exibido no título principal. |
| `breadcrumbs` | BreadcrumbContext | Sim | Hierarquia trilha → curso → módulo → lição. Rótulos ausentes são omitidos; destino é opcional. |
| `progress` | LessonProgress | Sim | Posição atual, total e percentual fornecidos pela jornada. Percentual visual limitado a 0–100. |
| `streakCount` | number opcional | Não | Quantidade de dias consecutivos; quando indisponível, indicador é omitido. |
| `content` | LessonBody | Sim | Título de conteúdo e lista ordenada de blocos. |

## LessonContentBlock

União discriminada para manter texto e mídia associados à ordem editorial.

| Campo | Tipo | Aplicação | Regras |
|---|---|---|---|
| `id` | string | Todos | Único dentro de uma lição e estável entre atualizações. |
| `type` | `image` ou `paragraph` | Todos | Determina a forma de conteúdo. |
| `url` | string opcional | Imagem | URL relativa/absoluta segura; falha não invalida os outros blocos. |
| `caption` | string opcional | Imagem | Legenda exibida com a imagem; omitida se vazia. |
| `altText` | string opcional | Imagem | Descrição alternativa fornecida pela fonte de conteúdo; não deve ser inferida da legenda. |
| `text` | string opcional | Parágrafo | Conteúdo didático textual; blocos vazios são ignorados. |

Validação: bloco de imagem pode não ter legenda; bloco de parágrafo requer texto não vazio para renderização. Identificadores duplicados são inválidos para renderização determinística.

## BreadcrumbContext e BreadcrumbItem

Os quatro campos atuais do mock (`trail`, `course`, `module`, `lesson`) são normalizados para itens ordenados. Cada item tem `label` requerido e `destination` opcional. Apenas itens com destino conhecido e diferente do item atual são interativos. O primeiro item atual (TRILHAS) pode apontar ao painel existente quando essa rota estiver confirmada; destino de curso/módulo permanece externo enquanto tais telas não existirem.

## LessonProgress

| Campo | Tipo | Regras |
|---|---|---|
| `currentLesson` | inteiro positivo | Exibir como “Lição X de Y”; valor inválido é tratado como dado indisponível. |
| `totalLessons` | inteiro positivo | Se ausente ou menor que a posição, manter a informação disponível sem barra inconsistente. |
| `trailCompletionPercentage` | número | Normalizar visualmente ao intervalo 0–100; exibir valor textual coerente. |

## Estados de interface

- `loading`: skeleton para breadcrumbs, título, visual e blocos de texto.
- `success`: conteúdo ordenado e metadados da lição.
- `error`: mensagem amigável e ação de repetição.
- `exit-confirmation`: diálogo modal, com foco gerenciado, ações de cancelar/confirmar e saída para contexto anterior válido.
- `image-unavailable`: estado local ao bloco; título/legenda e demais blocos continuam visíveis conforme disponibilidade.

Transições esperadas: `loading → success | error`; `error → loading` ao repetir; `success → exit-confirmation → success` ao cancelar; `success → navegação de retorno` ao confirmar.
