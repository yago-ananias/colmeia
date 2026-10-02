# Tasks: Regras de validade do Soletra do g1

Caminhos relativos a `/mnt/project-files/soletra/`. `[X]` = feito.

## Phase 1: Setup
- [X] T001 Instalar simplemma e criar `ferramentas/funcionais.txt`

## Phase 2: User Story 1 - Só formas básicas (P1)
- [X] T002 [US1] `classify()` em `ferramentas/build.py`: infinitivo, plural, feminino, substantivo que também é verbo
- [X] T003 [US1] Gerar `rejected.json` com motivo (p, v, f), inclusive para formas fora do dicionário
- [X] T004 [US1] Embutir `REJ` em `ferramentas/data.py`
- [X] T005 [US1] Mensagens "Plural não vale", "Só verbos no infinitivo" e "Pronomes, preposições e conjunções não valem" em `template.html`
- [X] T006 [US1] Bloquear nomes próprios que apareceram nos desafios de hoje (`blocklist.txt`)

## Phase 3: User Story 2 - Regras visíveis (P2)
- [X] T007 [US2] Atualizar "Como jogar" e `REGRAS.md`

## Phase 4: Polish
- [X] T008 Testes em `ferramentas/test.js` (SC-001, SC-002, mensagens)
- [X] T009 Gerar, testar e republicar no mesmo link
