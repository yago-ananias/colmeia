# Feature Specification: Toque rápido nas letras

**Feature Branch**: `014-toque-rapido-nas-letras`
**Created**: 2026-10-04
**Status**: Implemented
**Input**: YAGO (04/10/2026): "Usuário relatando que está mais lento a resposta quando clica na letra para formar a palavra, verifique."

## Investigação
Medido num celular simulado (375 px, toque, CPU 4x e 6x mais lenta) em seis versões do jogo, de antes da spec 007 até a spec 013: do toque até a letra aparecer na tela leva cerca de 18 ms em todas, e toques a cada 60 ms entram todos, inclusive letra repetida. Nenhuma mudança recente deixou o toque mais lento no Chrome.

O que o teste não alcança é o Safari do iPhone: sem `touch-action: manipulation`, dois toques rápidos no mesmo lugar (letra repetida, como em "arara") podem ser tratados como gesto de zoom, e o segundo toque atrasa ou se perde. O jogo nunca teve essa propriedade.

## User Story 1 - Letra responde na hora em qualquer celular (P1)
Tocar rápido nas letras, inclusive repetindo a mesma, digita cada letra na hora, sem zoom.

## Requirements
- **FR-001**: Todos os botões (letras, Enviar, Apagar, Embaralhar e os demais) usam `touch-action: manipulation`.

## Success Criteria
- **SC-001**: `test.js` confere a propriedade nas letras e nos botões principais.
- **SC-002**: Do toque até a letra aparecer leva no máximo 50 ms com a CPU 4x mais lenta (medido: cerca de 18 ms, nas 6 versões; `ferramentas/medicoes/toque.js`, medição manual). O gesto de toque duplo do Safari no iPhone não dá para medir aqui: se o jogador ainda notar lentidão, perguntar o aparelho e o navegador dele.
