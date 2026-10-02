O tabuleiro: sete células hexagonais com a letra central em mel. É a peça mais reconhecível do jogo e a origem do símbolo da marca.

- Célula: hexágono de ponta para cima (`clip-path`), fundo `cell`, letra `cell-ink` no estilo `letra-favo`, maiúscula.
- Central: fundo `honey`, letra `honey-ink`. Só a central usa mel.
- Sombra de base de 2px na cor `line` (um degrau, não uma sombra difusa).
- Largura `min(320px, 82vw)` no computador, `min(300px, 76vw)` no celular; proporção 314/300,8.
- Posições: centro e seis vizinhos com 7% de folga entre células (veja `renderHive` no jogo).
- Ao tocar, a célula encolhe para 90%. Ao embaralhar, gira 60° e volta.
- Cada célula é um `button` com `aria-label` "Letra A" e "(central)" na do meio.
