# Research: Colmeia

## Regras do Soletra (g1)
- **Decisão**: 7 letras em colmeia, letra central obrigatória, mínimo de 4 letras, letras repetíveis, acentos ignorados, pangrama usa as 7 letras, um desafio por dia.
- **Fonte**: página do jogo (https://g1.globo.com/jogos/soletra/) e vídeos de partidas; o conteúdo da página é carregado por script e não pôde ser lido diretamente.

## Lista de palavras
- **Decisão**: interseção do dicionário `pythonprobr/palavras` (~320 mil formas) com as 40 mil palavras mais frequentes de `hermitdave/FrequencyWords` (pt_br, 2018), menos palavrões e `blocklist.txt`. Resultado: ~10 mil palavras.
- **Alternativas rejeitadas**: só o dicionário (muitas palavras raras e conjugações obscuras); só a frequência (nomes próprios e erros de digitação).

## Pontuação
- **Decisão**: 4 letras = 1 ponto, maiores = 1 por letra, pangrama +7. Níveis por fração da pontuação máxima: Ovo 0%, Larva 3%, Pupa 8%, Operária 15%, Exploradora 25%, Guardiã 40%, Rainha 60%.

## Desafios diários
- **Decisão**: lista de desafios embaralhada com semente fixa; desafio k (0, 1, 2) do dia d é `PUZ[((d−1)·3 + k) mod N]`, com d contado a partir de 01/10/2026. Assim todos os jogadores veem os mesmos desafios sem servidor.

## Tema
- **Decisão**: tokens de cor em `:root`, redefinidos em `prefers-color-scheme: dark` e em `[data-theme]`; botão grava `data-theme` e salva a escolha.
