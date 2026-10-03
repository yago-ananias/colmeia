# Feature Specification: Enter envia a palavra depois de clicar

**Feature Branch**: `013-enter-depois-de-clicar`
**Created**: 2026-10-03
**Status**: Implemented
**Input**: Defeito encontrado nos testes da spec 012 (03/10/2026). A spec 007 (FR-001) promete que Enter e Espaço só acionam um botão quando ele tem foco de teclado e que "clique de mouse seguido de Enter continua enviando". No Chrome e no Edge isso não valia: depois de qualquer clique num botão, a primeira tecla apertada já fazia o navegador tratar o botão como foco de teclado (`:focus-visible`).

O que o jogador via no computador, usando mouse e teclado juntos:
- clicava nas letras e apertava Enter: a última letra entrava de novo em vez de enviar a palavra;
- clicava em Livre (ou em Diário vindo de outro modo), digitava e apertava Enter: nada acontecia;
- clicava em Relâmpago, digitava e apertava Enter: aparecia "Abandonar a partida?".

## User Story 1 - Mouse e teclado juntos (P1)
Depois de clicar ou tocar em qualquer botão, Enter envia a palavra e Espaço embaralha, como antes da spec 007.

**Acceptance**: letras clicadas + Enter enviam a palavra; letra clicada + Espaço embaralha; clicar em Livre ou em Relâmpago, digitar e apertar Enter envia a palavra, sem janela.

## User Story 2 - Quem usa só o teclado continua igual (P1)
Com Tab até um botão, Enter e Espaço acionam o botão (spec 007). Depois de digitar letras, Enter volta a enviar a palavra, mesmo com o foco parado no botão.

**Acceptance**: Tab até Livre e Enter troca o modo; digitar uma palavra e Enter envia.

## Requirements
- **FR-001**: Enter e Espaço acionam o botão com foco só quando o foco chegou nele pelo Tab e nenhuma letra ou Backspace foi digitado depois. Clique ou toque (`pointerdown`) e digitação voltam ao comportamento de jogo.
- **FR-002**: As janelas (ajuda, confirmação, fim de partida) continuam com Enter e Espaço acionando o botão com foco, como hoje.

## Success Criteria
- **SC-001**: `test.js` cobre os 4 casos com mouse e o caso só com teclado; os testes da spec 007 continuam passando.
