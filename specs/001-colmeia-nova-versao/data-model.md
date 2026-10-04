# Data Model: Colmeia

> Atualizado na spec 016 (04/10/2026) para refletir o código das specs 008, 009, 010, 011 e 012. O modelo original da 001 tinha só `WORDS`, `DISP` e `PUZ`.

## Embutidos na página (gerados por `ferramentas/data.py`, marcador `/*__DATA__*/` do `template.html`)
- `WORDS: string[]` palavras da lista principal, normalizadas (sem acento, minúsculas), ordenadas. Cerca de 11.550.
- `DISP: {[normalizada]: exibida}` forma com acento, só quando difere (vale também para as extras).
- `EXTRA: string[]` palavras extras (spec 011): termos técnicos e palavras menos comuns que cabem em algum desafio. Cerca de 14.900. Nunca repetem `WORDS` nem as recusadas.
- `DAYS: string[]` programação dos diários, 3 desafios por dia, a partir de 01/10/2026 (spec 008). Cada desafio tem 7 letras e a primeira é a central. O desafio k do dia d é `DAYS[((d−1)·3 + k) mod tamanho]`, e dias já publicados não mudam (`ferramentas/diarios.txt`).
- `LIVRE: string[]` desafios do Livre e do Relâmpago. Não tem conjunto de letras em comum com `DAYS`.
- `REJ` palavras recusadas, agrupadas pelo motivo (plural, verbo conjugado, pronome), para o jogo mostrar o aviso certo.
- No lugar de `PUZ` (spec 001), `DAYS` e `LIVRE` desde a spec 008.

## Desafio (em memória)
`{ code, center, outer[6], letters:Set, valid:Set, list[], pangrams:Set, max }`. `valid` e `max` só contam a lista principal; as extras ficam à parte e não entram em `max`.

## Progresso (localStorage, chaves com prefixo `colmeia:`)
| Chave | Conteúdo |
|-------|----------|
| `colmeia:d<dia>-<k>` | `{code, found[], extra[], bonus, clues[], hintsUsed, gaveUp}` de cada desafio diário (`extra` desde a spec 011) |
| `colmeia:livre` | mesmo formato, para o desafio Livre atual |
| `colmeia:vistos` | conjuntos de letras (ordenadas) dos desafios já jogados no Livre, para não repetir (no máximo 1.000; spec 008) |
| `colmeia:sugeridas` | palavras que o jogador já sugeriu (spec 008) |
| `colmeia:stats` | `{streak, lastDay, best, pangs, badges[]}` |
| `colmeia:theme` | `"light"` ou `"dark"` (ausente = segue o aparelho) |
| `colmeia:sound` | `true`/`false` |
| `colmeia:seenHelp` | `true` depois da primeira visita (a ajuda abre sozinha só uma vez) |
| `colmeia:erros` | `{d, n}` contador de erros enviados hoje, no máximo 10 por dia (spec 010; só no site) |

Toda leitura do progresso passa por `store.get` com um validador de formato (spec 012): dado com defeito é descartado (só a parte ruim), o jogo abre e mostra um aviso. O contador `colmeia:erros` é lido fora do `store`, dentro de `try/catch`.

## Regras de estado
- Sequência de dias sobe quando o jogador acha 5 palavras do desafio (extras não contam) em qualquer desafio diário de um dia seguinte ao último dia contado.
- `gaveUp = true` revela respostas e desativa dicas daquele desafio.
- O nível vem só dos pontos das palavras (as extras contam), nunca do bônus de combo, no Diário e no Livre.
