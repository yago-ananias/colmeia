# Feature Specification: Palavras extras somam no contador

**Feature Branch**: `018-extras-somam-no-contador`
**Created**: 2026-10-12
**Status**: No ar no Artifact e no site desde 12/10/2026 (commit 83dfc23)
**Input**: YAGO (12/10/2026): "Pq as palavras extra não contam ponto e nem somam na quantidade de palavras?" Conferido: as extras já somavam pontos (por exemplo, "alarmantemente" deu +24) e só não entravam no contador "N de M palavras". YAGO decidiu: "Quero que as extra somem no contador". (A spec 017 é a de segurança.)

## User Story 1 - Ver as extras no número de palavras (P1)
O jogador acerta uma palavra extra e o número de palavras do título sobe: "2 de 64 palavras (1 extra)". O 64 continua sendo o tamanho do desafio.

**Acceptance**: o título soma as extras ao N e mostra "(K extras)"; a aba do desafio do dia e o resultado compartilhado usam o mesmo número; o N pode passar do M quando há muitas extras.

## Requirements
- **FR-001**: O contador do título ("N de M palavras") soma as palavras do desafio e as extras. O M não muda (tamanho do desafio).
- **FR-002**: O aviso das extras no título vira "(K extras)", logo depois de "palavras" (antes era "+K extras" no fim).
- **FR-003**: A aba do desafio do dia (Manhã, Tarde, Noite) mostra o mesmo número, também para os desafios que não estão abertos. Um desafio com só extras deixa de aparecer como "Novo".
- **FR-004**: O resultado do Relâmpago e o texto de "Compartilhar" usam o mesmo total: "7 palavras (2 extras)" e "7/64 palavras (2 extras)".
- **FR-005**: Não mudam: pontos e nível, "Ver respostas", os 5 acertos da sequência de dias, os eventos de medição e as dicas. "Como jogar" passa a dizer que as extras entram no contador.

## Success Criteria
- **SC-001**: `test.js` confere que a extra soma 1 no contador sem mudar o M, que a aba e o texto compartilhado usam o mesmo número e que a colmeia não é dada como completa.
- **SC-002**: O título não ganha altura em 360 px (medido: 70 px antes e depois).

## Assumptions
- O N podia passar do M. YAGO respondeu no mesmo dia que não pode: ao chegar a N = M o desafio termina (spec 019). A conclusão só com as palavras do desafio deixou de valer.
- Os eventos de medição (`nivel`, `completa`, `relampago-fim`) continuam contando só as palavras do desafio, para os números do painel não mudarem de significado.
