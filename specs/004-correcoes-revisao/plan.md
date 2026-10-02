# Implementation Plan: Correções da revisão de 02/10

**Branch**: `004-correcoes-revisao` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

## Summary
- **Dados**: novo `ferramentas/ud_stats.py` conta como cada palavra aparece em 5 treebanks UD do português
  (Bosque, GSD, PetroGold, Porttinari, CINTIL). `build.py` decide por essa contagem (≥35% de usos como
  substantivo/adjetivo singular, infinitivo, particípio singular ou advérbio = vale; maioria nome próprio = fora),
  e cai no simplemma só para palavras raras. Hunspell pt_BR completa o dicionário e marca nomes próprios.
  Plural detectado também pelo singular existente (vagens→vagem, cascavéis→cascavel). Forma válida vence colisão de acento.
- **Jogo** (`template.html`): `help()` na primeira visita; layout de celular com a colmeia em 2º lugar e seletor
  de desafios compacto; `tick()` para com `#overlay` aberto; confirmação "Abandonar a partida?"; ajustes menores.

## Constitution Check
I ✅ · II ✅ (lista mais correta) · III ✅ (~290 KB) · IV ✅ (celular) · V ✅ (novos testes)
