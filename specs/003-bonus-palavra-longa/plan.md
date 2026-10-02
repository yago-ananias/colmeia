# Implementation Plan: Bônus de palavra longa

**Branch**: `003-bonus-palavra-longa` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

## Summary

Mudança só em `points(w)` no `template.html`: soma `LONG_BONUS` (3) quando `w.length >= LONG_MIN` (8).
Como combo, pontuação máxima e níveis já usam `points`, todos passam a contar o bônus sem outra mudança.
Aviso "Palavra longa!" no acerto e texto novo em "Como jogar".

## Constitution Check

I. Regra do jogo: não muda o que é palavra válida, só a pontuação ✅ · III. Um arquivo ✅ · V. Testado ✅
