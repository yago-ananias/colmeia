# Plan: Enter envia a palavra depois de clicar

- `template.html`: sai `focoTeclado()` (que usava `:focus-visible`); entra a variável `porTab`. `keydown` com Tab marca `porTab`; `pointerdown` (fase de captura) e digitar letra ou Backspace desmarcam. O atalho global só deixa o navegador acionar o botão com Enter ou Espaço quando `porTab` está marcado.
- `test.js`: seção "Enter depois de clicar (spec 013)", cada caso num contexto novo.

## Constitution Check
- IV. Acessível: o fluxo só com teclado da spec 007 continua; mouse e teclado juntos voltam a funcionar.
- V. Testado: 5 testes novos.
