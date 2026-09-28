# Modelo de Dados: Detalhes da Trilha

Os dados são locais e demonstrativos nesta entrega. A identidade da trilha vem do `slug` da rota, e os identificadores de módulos, missões e lições são únicos dentro da respectiva coleção.

## Entidades

### TrackDetails

| Campo | Tipo | Regras |
|---|---|---|
| `id` | string | Identificador estável da trilha; corresponde ao slug de demonstração. |
| `title` | string | Obrigatório e não vazio. |
| `level` | string | Rótulo de nível, por exemplo “Iniciante”. |
| `totalLessons` | number | Inteiro não negativo. |
| `completedLessons` | number | Inteiro não negativo; não deve exceder total para apresentação do progresso. |
| `progressPercentage` | number | Percentual recebido; valor visual limitado ao intervalo de 0 a 100. |
| `missions` | Mission[] | Missões desta trilha. |
| `modules` | Module[] | Módulos em ordem de aprendizagem. |

### Mission

| Campo | Tipo | Regras |
|---|---|---|
| `id` | string | Único dentro da trilha. |
| `title` | string | Título da missão. |
| `xpReward` | number (opcional) | Recompensa não negativa quando fornecida. |
| `currentProgress` | number | Progresso atual conforme fornecido. |
| `totalProgress` | number | Alvo total conforme fornecido. |
| `progressPercentage` | number | Percentual fornecido. Se divergir das contagens, apresentar sinalização de inconsistência. |

### Module

| Campo | Tipo | Regras |
|---|---|---|
| `id` | string | Único dentro da trilha. |
| `title` | string | Título apresentado no cabeçalho. |
| `status` | `completed \| in_progress \| locked` | Determina badge, ícone e permissão de expansão. |
| `totalLessons` | number | Total de lições do módulo, inteiro não negativo. |
| `completedLessons` | number | Contagem recebida, limitada ao total para representação visual. |
| `lessons` | Lesson[] | Itens do módulo em ordem. Pode estar vazio em módulos bloqueados. |

### Lesson

| Campo | Tipo | Regras |
|---|---|---|
| `id` | string | Identificador estável usado para abrir o destino correto. |
| `title` | string | Título da lição. |
| `durationText` | string (opcional) | Rótulo de duração quando fornecido. |
| `xpReward` | number (opcional) | Recompensa não negativa quando fornecida. |
| `status` | `completed \| available \| locked` | Define a apresentação e a ação habilitada. |
| `description` | string (opcional) | Texto de apoio para a lição disponível. |

## Relações e ciclo de vida

- Uma trilha contém uma lista ordenada de missões e módulos.
- Um módulo contém zero ou mais lições ordenadas.
- `completed` oferece revisão; `available` oferece início; `locked` não permite navegação.
- Um módulo `locked` não pode ser expandido. Módulos `completed` e `in_progress` podem expandir/recolher.
- Esta página não altera estados, registra conclusão ou persiste progresso; as transições dependem da jornada de lição existente.

## Validação e dados inconsistentes

- Percentuais usados como largura de barra devem ficar em `[0, 100]` e nunca refletir valor ausente como se fosse real.
- Para a missão com `currentProgress: 0`, `totalProgress: 5` e `progressPercentage: 67`, manter os dados recebidos e comunicar que o percentual e as contagens divergem; não recalcular nem ocultar silenciosamente nenhum deles.
- Contagens de progresso e contagens/listas de lições são campos de origem independentes nesta versão. Não inferir o estado de uma lição apenas pela contagem do módulo.
- Texto opcional ausente não deve ser substituído por valor inventado.
