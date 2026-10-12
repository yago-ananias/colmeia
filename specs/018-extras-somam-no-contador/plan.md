# Plan: Palavras extras somam no contador

**Branch**: `018-extras-somam-no-contador` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

## O que mexe
- `template.html`: `nPal()` (palavras do desafio + extras) e `extraTxt()` ("(K extras)"); usados no título, nas abas dos desafios (`renderDailies`), no resultado do Relâmpago e em `shareText()`. Texto de "Como jogar".
- `ferramentas/test.js`: o teste da spec 011 que conferia "a contagem não muda" passa a conferir que soma 1; dois testes novos (aba e compartilhar; não completa a colmeia).
- `REGRAS.md`, spec 011 (marcas de substituição) e constituição 1.2.2 (princípio II: "conclusão do desafio" no lugar de "contagem do desafio").
- `colmeia.html` regerado (os dados não mudam); Artifact republicado.

## Constitution Check

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: o que conta como resposta não muda; extras seguem fora da conclusão e de "Ver respostas" | ✅ |
| II. Português de verdade: texto em português; lista principal e extras iguais | ✅ |
| III. Um arquivo: nada novo na página; cerca de 631 KB | ✅ |
| IV. Dinâmico e acessível: o título não ganha altura em 360 px; o leitor lê "(1 extra)" no próprio título | ✅ |
| V. Testado: suíte inteira | ✅ |
