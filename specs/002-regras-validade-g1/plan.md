# Implementation Plan: Regras de validade do Soletra do g1

**Branch**: `002-regras-validade-g1` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

## Summary

A validade é decidida na geração de dados, não no navegador. `ferramentas/build.py` passa cada palavra
pelo lematizador simplemma: se o lema é a própria palavra, ela vale; se o lema é um verbo, é forma
conjugada; se a palavra termina em "s" e o lema não, é plural; femininos (aluna → aluno) valem.
Palavras funcionais vêm de `ferramentas/funcionais.txt`. As formas recusadas vão para `REJ` na página,
só para explicar o motivo da recusa.

## Technical Context

**Language/Version**: Python 3 (simplemma 1.x) para dados; JavaScript no jogo

**Storage**: nenhum novo; `REJ` embutido na página (~100 KB)

**Testing**: `node ferramentas/test.js` com a seção "Validade estilo g1"

**Constraints**: página abaixo de 1 MB (ficou em ~300 KB)

## Constitution Check

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: agora igual à do g1 também na validade das palavras | ✅ |
| II. Português de verdade: lista mais limpa (sem plurais e conjugações) | ✅ |
| III. Um arquivo | ✅ |
| IV. Acessível: mensagens de recusa claras | ✅ |
| V. Testado | ✅ |

## Project Structure

```text
ferramentas/build.py        # classificação morfológica (classify)
ferramentas/funcionais.txt  # pronomes, preposições, conjunções
ferramentas/data.py         # embute REJ
template.html               # mensagens de recusa e "Como jogar"
ferramentas/test.js         # testes da regra
```
