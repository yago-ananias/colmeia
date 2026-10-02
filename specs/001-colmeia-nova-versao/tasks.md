# Tasks: Colmeia, nova versão do Soletra

**Input**: Design documents from `/specs/001-colmeia-nova-versao/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

## Format: `[ID] [P?] [Story] Description`

Caminhos relativos a `/mnt/project-files/soletra/`. `[X]` = feito.

## Phase 1: Setup

- [X] T001 Criar a pasta do projeto e `ferramentas/`
- [X] T002 [P] Baixar dicionário e lista de frequência e gerar `words.json` em `ferramentas/build.py`
- [X] T003 [P] Gerar desafios válidos (22–65 palavras, com pangrama) e `data.js` em `ferramentas/data.py`
- [X] T004 Criar `ferramentas/blocklist.txt` e fazer `build.py` ler a lista (remove "baal", "babu" e afins)
- [X] T005 Criar `ferramentas/montar.sh` que roda build, data e gera `colmeia.html` a partir de `template.html`

## Phase 2: Foundational

- [X] T006 Estrutura da página, tokens de cor claro/escuro e tipografia em `template.html`
- [X] T007 Validação de palavras, normalização de acentos e pontuação (`buildPuzzle`, `points`, `submit`)
- [X] T008 Colmeia hexagonal, teclado físico, embaralhar, apagar e enviar
- [X] T009 Persistência em `localStorage` protegida por try/catch (`store`)

## Phase 3: User Story 1 - Desafios do dia (P1) 🎯 MVP

- [X] T010 [US1] Três desafios diários (Manhã, Tarde, Noite) com `dailyCode(dia, k)`
- [X] T011 [US1] Seletor de desafios com nível e progresso de cada um
- [X] T012 [US1] Progresso salvo por desafio (`colmeia:d<dia>-<k>`)
- [X] T013 [US1] Carregar os desafios do novo dia quando a data muda com o jogo aberto (FR-012)

## Phase 4: User Story 2 - Modo escuro (P1)

- [X] T014 [US2] Seguir o tema do aparelho por padrão
- [X] T015 [US2] Botão ◐ que troca o tema e salva a escolha

## Phase 5: User Story 3 - Combos e Relâmpago (P2)

- [X] T016 [US3] Combo até x5 com anel de tempo restante
- [X] T017 [US3] Modo Relâmpago com tempo extra por acerto, fim de partida e recorde
- [X] T018 [US3] Pausar o relógio do Relâmpago quando a aba fica oculta (FR-007)

## Phase 6: User Story 4 - Dicas (P2)

- [X] T019 [US4] Mapa de dicas por letra inicial e tamanho
- [X] T020 [US4] Revelar início de palavra (3 por desafio; −5 s no Relâmpago)
- [X] T021 [US4] Ver respostas com confirmação na própria página

## Phase 7: User Story 5 - Progresso e motivação (P3)

- [X] T022 [US5] Níveis de abelha com aviso de subida e confete no pangrama
- [X] T023 [US5] Sequência de dias, recorde, pangramas e conquistas
- [X] T024 [US5] Modo Livre com novo desafio sob demanda
- [X] T025 [US5] Copiar resultado

## Phase 8: Polish & Cross-Cutting

- [X] T026 Escrever `ferramentas/test.js`: dados (SC-002), regra e pontuação (FR-001, FR-005), diários distintos (FR-002), tema (FR-004), sem rolagem lateral a 360 px (SC-004)
- [X] T027 Rodar os testes, gerar `colmeia.html` e republicar no mesmo link

## Dependencies & Execution Order

- T004 → T005 → T027; T013 e T018 → T026 → T027.
- T004, T013 e T018 podem ser feitos em paralelo.
