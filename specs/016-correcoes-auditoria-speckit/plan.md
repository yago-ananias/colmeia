# Plan: Correções da auditoria do Spec Kit

**Branch**: `016-correcoes-auditoria-speckit` | **Date**: 2026-10-04 | **Spec**: [spec.md](./spec.md)

## Summary
Só documentação e testes. Nada em `template.html`; `colmeia.html` não é regerado.

## O que mexe
- `ferramentas/test.js`: bloco "Dados (SC-002)" separa dias publicados e futuros; bloco "Tema" ganha o teste do logo.
- `ferramentas/medicoes/` (novo): `axe.js`, `toque.js`, `LEIAME.md`.
- `.specify/memory/constitution.md`: v1.2.1 (princípio V, exceção dos dias publicados). A v1.2.0 (extras e erros) já estava no repositório.
- `REGRAS.md`: linha dos 22 a 65 palavras.
- Specs 001, 002, 005 (plano novo), 006, 007, 008, 009, 010, 011, 014 e 015: marcas de substituição, números atualizados, Constitution Check e critérios de sucesso.

## Fora do escopo
Achados baixos B1 a B4 da auditoria.

## Constitution Check

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: nada muda | ✅ |
| II. Português de verdade: nada muda na lista | ✅ |
| III. Um arquivo: `colmeia.html` não muda | ✅ |
| IV. Dinâmico e acessível: nada muda nas telas | ✅ |
| V. Testado: o teste de dados fica mais claro e ganha o teste do logo; suíte inteira roda | ✅ |
