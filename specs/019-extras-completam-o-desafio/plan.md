# Plan: Palavras extras completam o desafio

**Branch**: `019-extras-completam-o-desafio` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

## O que mexe
- `template.html`: `completa()` (`nPal()>=P.list.length`) no lugar das três comparações com `S.found.length`: `submit()` (sheet de conclusão e bloqueio de novas palavras), `rankName()`, `shareText()` e a aba do desafio. Texto de "Como jogar" e da folha.
- `ferramentas/test.js`: teste novo com progresso salvo (M-1) que chega a M com extras e recusa a palavra seguinte.
- `REGRAS.md`, specs 018, constituição 1.2.3 (princípio II).
- `colmeia.html` regerado (dados não mudam); Artifact republicado.

## Constitution Check

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: nada muda no que vale como resposta; a conclusão passa a somar extras por decisão de YAGO | ✅ (constituição 1.2.3) |
| II. Português de verdade: listas inalteradas | ✅ |
| III. Um arquivo: nada novo na página | ✅ |
| IV. Dinâmico e acessível: aviso de "Desafio completo" no mesmo toast; folha igual à de hoje | ✅ |
| V. Testado: suíte inteira | ✅ |
