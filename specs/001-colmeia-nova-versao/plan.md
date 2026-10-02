# Implementation Plan: Colmeia, nova versão do Soletra

**Branch**: `001-colmeia-nova-versao` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-colmeia-nova-versao/spec.md`

## Summary

Jogo de palavras no navegador com a regra do Soletra, três desafios diários, modo escuro, combos,
modo Relâmpago, modo Livre, dicas e conquistas. Tudo numa página HTML única: a lista de palavras e
os desafios são gerados por scripts Python e embutidos na página; a lógica roda em JavaScript puro e
o progresso fica no `localStorage`.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020 (navegador); Python 3 para gerar dados; Node 22 para testes

**Primary Dependencies**: nenhuma em produção; Playwright (já instalado no ambiente) só para testes

**Storage**: `localStorage` do navegador, chaves com prefixo `colmeia:`

**Testing**: `node ferramentas/test.js` (lógica pura + jogo aberto em Chromium sem tela)

**Target Platform**: navegadores modernos de computador e celular; publicado como Artifact do claude.ai

**Project Type**: jogo web de página única

**Performance Goals**: jogável em menos de 2 s; resposta a cada toque em menos de 50 ms

**Constraints**: página única abaixo de 1 MB; sem servidor; funciona sem `localStorage`

**Scale/Scope**: ~10 mil palavras, 6.399 desafios (cerca de 5 anos de diários com 3 por dia)

## Constitution Check

| Princípio | Como o plano cumpre | Status |
|-----------|---------------------|--------|
| I. Regra do jogo | `buildPuzzle` e `submit` validam só pela regra base; combos e dicas não alteram a validade | ✅ |
| II. Português | Lista = dicionário ∩ 40 mil palavras mais frequentes, com filtro de palavrões e `blocklist.txt` | ✅ |
| III. Um arquivo | `colmeia.html` gerado com os dados embutidos (~210 KB); todo acesso ao storage em try/catch | ✅ |
| IV. Dinâmico e acessível | Layout responsivo, tokens de cor para claro/escuro, `prefers-reduced-motion`, teclado | ✅ |
| V. Testado | `ferramentas/test.js` cobre dados, regra, pontuação, diários e telas | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/001-colmeia-nova-versao/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
soletra/
├── template.html          # código-fonte editável do jogo (marcador /*__DATA__*/)
├── colmeia.html           # página publicada (gerada)
└── ferramentas/
    ├── build.py           # monta words.json (dicionário ∩ frequência − palavrões − blocklist)
    ├── data.py            # sorteia desafios válidos e gera data.js
    ├── blocklist.txt      # palavras removidas manualmente
    ├── montar.sh          # baixa fontes de dados, roda build/data e gera colmeia.html
    └── test.js            # testes automatizados
```

**Structure Decision**: projeto único e plano, sem framework, para cumprir o princípio III.

## Complexity Tracking

Nenhuma violação da constituição.
