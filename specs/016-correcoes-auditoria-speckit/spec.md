# Feature Specification: Correções da auditoria do Spec Kit

**Feature Branch**: `016-correcoes-auditoria-speckit`
**Created**: 2026-10-04
**Status**: Implemented (só no projeto; vai ao repositório quando YAGO disser "pode enviar")
**Input**: Auditoria `/mnt/project-files/revisoes/auditoria-speckit-colmeia-2026-10-04.md`. YAGO decidiu "emendar" a constituição (A1 e A2, feitos na v1.2.0, commit 79fc672) e depois "corrigir" (04/10/2026) os demais achados altos e os médios. Os 4 achados baixos (B1 a B4) ficam de fora.

O jogo não muda para quem joga: esta spec só mexe em specs, em testes e em documentação. `template.html` não foi alterado.

## User Story 1 - As specs dizem o que o jogo faz (P1)
Quem abrir qualquer spec, plano ou a constituição encontra o que o jogo faz hoje, e o que foi substituído por uma spec mais nova está marcado como tal.

## User Story 2 - O teste diz a verdade sobre os desafios (P1)
O teste separa as duas regras de tamanho de desafio (22 a 65 palavras no Livre e nos dias futuros; pangrama e 15 palavras ou mais nos dias já publicados) e a mensagem diz o que de fato foi conferido.

## Requirements
- **FR-001 (A3)**: `ferramentas/test.js` confere em testes separados (a) Livre e dias futuros: 7 letras, 22 a 65 palavras e pangrama; (b) dias já publicados: 7 letras, pangrama e 15 palavras ou mais, informando o mínimo, o máximo e quantos saíram da faixa 22 a 65. A exceção está na spec 008 (FR-007), na constituição (v1.2.1, princípio V) e em `REGRAS.md`; as specs 001 (SC-002), 002 (FR-006) e 006 (SC-002) apontam para ela.
- **FR-002 (A4)**: a spec 002 marca o que a 011 substituiu (preposições e conjunções valem, "porque" vale, termos técnicos viram extras) e a exceção da FR-006.
- **FR-003 (M1)**: a spec 007 (FR-001) e o plano apontam para a 013 (marca `porTab` no lugar de `:focus-visible`).
- **FR-004 (M2)**: a spec 001 fica de acordo com o código: `data-model.md` (DAYS, LIVRE, EXTRA, chaves do `localStorage`), `research.md` (lista, pontos e fórmula dos diários) e `plan.md` (escala e tamanho).
- **FR-005 (M3)**: a spec 011 (FR-005) registra a decisão de YAGO de 04/10/2026: as extras contam para o nível de propósito, mesmo com a pontuação máxima sem elas; corrige "bônus de palavra longa e de 7 letras" para "pangrama".
- **FR-006 (M4)**: as regras que só estavam no código e em `REGRAS.md` entram na spec 001 (FR-014 a FR-019): níveis, combo e nível, tempo e desafio do Relâmpago, as 7 conquistas e a sequência de dias sem extras.
- **FR-007 (M5)**: todo plano ganha a seção "Constitution Check" (006, 007, 008, 009, 010, 011, 014; a 005, que não tinha plano, ganhou um). O checklist de qualidade das specs 009 a 015 está em `checklists/requirements.md` desta spec. A partir daqui, todo plano novo traz o Constitution Check.
- **FR-008 (M6)**: a spec 009 deixa de dizer que o painel do Umami basta, e ganha critérios de sucesso para as histórias 2 e 4 (SC-003 e SC-004).
- **FR-009 (M7)**: o logo trocando com o tema (spec 005) ganha teste em `test.js`. As medições que não rodam no teste (axe-core da 015, tempo de toque da 014) ficam em `ferramentas/medicoes/` com um `LEIAME.md`. A verificação diária do site (010, SC-002) continua provada à mão, e a spec diz por quê.

## Success Criteria
- **SC-001**: `test.js` passa, com 3 testes novos (dias publicados separados dos futuros; logo no tema escuro; logo no tema claro).
- **SC-002**: nenhum achado alto ou médio da auditoria fica aberto, exceto o que a própria spec declara (verificação diária do site manual).
- **SC-003**: o jogo e o Artifact ficam como estão: `colmeia.html` não muda.

## Assumptions
- Os achados baixos (B1 a B4) ficam para depois: linhas "Input" antigas, o texto "toda leitura" da 012, arquivos que só existem no repositório e tarefas de YAGO misturadas.
- A verificação diária do site depende de arquivos que só existem no repositório; por isso a prova de que ela falha num site quebrado continua manual.
