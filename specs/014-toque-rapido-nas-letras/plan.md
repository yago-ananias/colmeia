# Plan: Toque rápido nas letras
- `template.html`: `touch-action: manipulation` na regra `button`.
- `test.js`: seção "Toque rápido nas letras (spec 014)".
- Medições (script guardado em `ferramentas/medicoes/toque.js`): toque → letra na tela em 6 versões, com CPU 4x e 6x; toques a cada 250, 120 e 60 ms.

## Constitution Check

> Verificação feita depois, na spec 016 (auditoria do Spec Kit de 04/10/2026), contra a constituição v1.2.1.

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: nenhuma mudança | ✅ |
| II. Português: sem texto novo | n/a |
| III. Um arquivo: uma linha de CSS em `template.html` | ✅ |
| IV. Dinâmico e acessível: toque responde na hora, sem zoom | ✅ |
| V. Testado: teste de `touch-action` em `test.js`; a medição de tempo é manual (`ferramentas/medicoes/toque.js`) | ✅ |
