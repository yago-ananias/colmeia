# Data Model: Colmeia

## Embutidos na página
- `WORDS: string[]` palavras normalizadas (sem acento, minúsculas), ordenadas.
- `DISP: {[normalizada]: exibida}` forma com acento, só quando difere.
- `PUZ: string[]` desafios; cada um tem 7 letras, a primeira é a central.

## Desafio (em memória)
`{ code, center, outer[6], letters:Set, valid:Set, list[], pangrams:Set, max }`

## Progresso (localStorage)
| Chave | Conteúdo |
|-------|----------|
| `colmeia:d<dia>-<k>` | `{code, found[], bonus, clues[], hintsUsed, gaveUp}` de cada desafio diário |
| `colmeia:livre` | mesmo formato, para o desafio Livre atual |
| `colmeia:stats` | `{streak, lastDay, best, pangs, badges[]}` |
| `colmeia:theme` | `"light"` ou `"dark"` (ausente = segue o aparelho) |
| `colmeia:sound` | `true`/`false` |

## Regras de estado
- Sequência de dias sobe quando o jogador acha 5 palavras em qualquer desafio diário de um dia seguinte ao último dia contado.
- `gaveUp = true` revela respostas e desativa dicas daquele desafio.
