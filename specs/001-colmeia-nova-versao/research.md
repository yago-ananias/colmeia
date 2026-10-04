# Research: Colmeia

> Decisões da spec 001 (02/10/2026). Onde mudaram depois, o texto abaixo está atualizado e aponta a spec que mudou (spec 016, 04/10/2026).

## Regras do Soletra (g1)
- **Decisão**: 7 letras em colmeia, letra central obrigatória, mínimo de 4 letras, letras repetíveis, acentos ignorados, pangrama usa as 7 letras, um desafio por dia.
- **Fonte**: página do jogo (https://g1.globo.com/jogos/soletra/) e vídeos de partidas; o conteúdo da página é carregado por script e não pôde ser lido diretamente.

## Lista de palavras
- **Decisão**: interseção do dicionário `pythonprobr/palavras` (~320 mil formas) com as 40 mil palavras mais frequentes de `hermitdave/FrequencyWords` (pt_br, 2018), menos palavrões e `blocklist.txt`. Resultado em 02/10: ~10 mil palavras. Hoje (specs 002, 004, 006 e 011): cerca de 11.550 palavras comuns na lista principal, decididas sobretudo por estatísticas de corpus UD e pelo Hunspell pt_BR (spec 004 e 006), mais cerca de 14.900 palavras extras (spec 011). A interseção com a frequência virou só um dos critérios.
- **Alternativas rejeitadas**: só o dicionário (muitas palavras raras e conjugações obscuras); só a frequência (nomes próprios e erros de digitação).

## Pontuação
- **Decisão**: 4 letras = 1 ponto, maiores = 1 por letra, pangrama +7 e, desde a spec 003, +3 para palavras de 8 letras ou mais. Níveis por fração da pontuação máxima: Ovo 0%, Larva 3%, Pupa 8%, Operária 15%, Exploradora 25%, Guardiã 40%, Rainha 60%, e "Colmeia completa" com todas as palavras (limites conferidos no código, `RANKS`).

## Desafios diários
- **Decisão original**: lista de desafios embaralhada com semente fixa; desafio k (0, 1, 2) do dia d é `PUZ[((d−1)·3 + k) mod N]`, com d contado a partir de 01/10/2026. Assim todos os jogadores veem os mesmos desafios sem servidor.
- **Hoje (spec 008)**: a programação fica pronta em `DAYS` (3 por dia, a partir de 01/10/2026), com a ordem dos dias já publicados fixada em `ferramentas/diarios.txt`; o jogo lê `DAYS[((d−1)·3 + k) mod tamanho]` (`dailyCode`). O Livre usa `LIVRE`, sem conjuntos em comum com `DAYS`.

## Tema
- **Decisão**: tokens de cor em `:root`, redefinidos em `prefers-color-scheme: dark` e em `[data-theme]`; botão grava `data-theme` e salva a escolha.
