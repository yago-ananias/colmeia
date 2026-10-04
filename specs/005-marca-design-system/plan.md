# Plan: Marca e design system no jogo

> Plano escrito na spec 016 (04/10/2026), depois da entrega: a 005 foi feita sem plano. Descreve o que foi feito.

## O que foi feito
- `template.html`: as assinaturas `colmeia-logo.svg` (claro) e `colmeia-logo-escuro.svg` (escuro) de `/mnt/project-files/colmeia-design/logo` entram em base64, uma `img.lg-l` e uma `img.lg-d`; os tokens `--logo-l` e `--logo-d` (`display:block` ou `none`) escolhem qual aparece conforme o tema. "Como jogar" mostra o símbolo.
- Tokens do design system (`honey-text`, `space-*`, `radius-*`, sombra) declarados em `:root` e redefinidos no tema escuro; a letra central usa `honey-text`.
- Nenhuma mudança de comportamento.

## Testes
- `test.js` passa sem mudança de comportamento (SC-001).
- A troca da assinatura com o tema passou a ter teste na spec 016 (bloco "Tema").

## Constitution Check

> Verificação feita na spec 016, contra a constituição v1.2.1.

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: só visual | ✅ |
| II. Português: sem texto novo | n/a |
| III. Um arquivo: logos embutidos em base64; página abaixo de 1 MB | ✅ |
| IV. Dinâmico e acessível: logo com texto alternativo, nos dois temas | ✅ |
| V. Testado: suíte inteira + teste da troca de logo (spec 016) | ✅ |
