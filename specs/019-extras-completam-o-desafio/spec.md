# Feature Specification: Palavras extras completam o desafio

**Feature Branch**: `019-extras-completam-o-desafio`
**Created**: 2026-10-12
**Status**: Implementado no projeto e no Artifact; vai ao site quando YAGO disser "pode enviar"
**Input**: YAGO (12/10/2026, depois da spec 018): "passar não, mas assim q atingir o número exato o desafio termina. ex: 64 de 64. As extras somam para finalizar o desafio".

## User Story 1 - Terminar o desafio com as extras (P1)
O jogador soma palavras do desafio e extras. Quando o total chega ao tamanho do desafio (64 de 64), aparece "Colmeia completa!" e o desafio termina.

**Acceptance**: com 63 de 64 (palavras do desafio + extras), uma palavra a mais (do desafio ou extra) mostra a folha "Colmeia completa!" e o título "64 de 64 palavras (K extras)". Depois disso o jogo recusa novas palavras com o aviso "Desafio completo! Escolha outro" e o contador fica em 64.

## Requirements
- **FR-001**: O desafio está completo quando `palavras do desafio + extras >= total do desafio` (M).
- **FR-002**: Ao completar, valem a folha "Colmeia completa!", a conquista, a chuva de confete e o nome de nível "Colmeia completa" (também na aba do desafio e no texto de Compartilhar, com o 🍯 na grade).
- **FR-003**: Completo, o jogo não aceita novas palavras (o contador nunca passa de M). Vale em Diário, Livre e Relâmpago.
- **FR-004**: A folha diz "Você achou todas as M palavras." quando não há extras e "Você chegou às M palavras (K extras)." quando há.
- **FR-005**: Continuam só com as palavras do desafio: "Ver respostas", as dicas, os 5 acertos da sequência de dias, os pangramas de ⭐ e os eventos de medição (`completa` leva só as palavras do desafio em `palavras`). O texto de "Como jogar" diz que as extras contam para completar.

## Success Criteria
- **SC-001**: `test.js` parte de um progresso salvo com M-1 (palavras + extras), acerta uma extra e confere o título "M de M palavras (2 extras)" e a folha "Colmeia completa"; depois confere que uma palavra a mais é recusada e o contador não passa de M.

## Assumptions
- Quem completa com extras deixa palavras do desafio por achar; "Ver respostas" continua mostrando-as. É o efeito da regra pedida.
- Os eventos de medição não mudam; só o texto e o fluxo do jogo mudam.
- Substitui a decisão de 04/10 (spec 016/auditoria) de que as extras ficavam fora da conclusão do desafio; foi decisão de YAGO desta vez também.
