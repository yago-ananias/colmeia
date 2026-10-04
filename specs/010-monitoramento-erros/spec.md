# Feature Specification: Monitoramento de erros

**Feature Branch**: `010-monitoramento-erros`
**Created**: 2026-10-03
**Status**: Implemented
**Input**: YAGO: "Tem algum monitoramento de erros? Erros no geral no jogo"

Antes desta spec só os testes antes de publicar pegavam erros. Um erro no aparelho de um jogador, ou o site fora do ar, passava sem ninguém saber.

## User Story 1 - Saber quando o jogo quebra no aparelho de alguém (P1)
Quando o jogo dá erro no navegador de um jogador (no site), o erro vira um evento `erro` no Umami e aparece no painel: quantos, qual erro, em que parte do código, se aconteceu ao abrir o jogo ou jogando, e em que modo.

## User Story 2 - Saber se o site está no ar e funcionando (P1)
Uma vez por dia um navegador automático abre o site como um jogador (ajuda, colmeia, desafios do dia, palavra aceita e recusada, tema, Relâmpago, ícones, tempo de carga, erros de script). Se algo falha, abre uma issue no GitHub (YAGO recebe aviso do GitHub). O painel mostra o resultado da última verificação. A coleta diária também confere se o site responde.

## User Story 3 - Ver tudo no painel (P1)
O "Painel da Colmeia" ganha um cartão "Saúde do jogo": site no ar, última verificação diária, erros de jogadores no período e os erros mais frequentes.

## Requirements
- **FR-001**: A captura é um `<script>` separado, antes do código do jogo, só ativo quando a página tem a tag do Umami (site). O Artifact e o `colmeia.html` não enviam nada.
- **FR-002**: Captura `error` (só do próprio arquivo do jogo; extensões, scripts de fora e "Script error." são ignorados) e `unhandledrejection` (só com pilha no arquivo do jogo). Falhas ao ler ou gravar o progresso (armazenamento cheio ou bloqueado) também são avisadas, só com o nome do erro.
- **FR-003**: Evento `erro` {tipo: erro|promessa|armazenamento, erro: "Nome: mensagem @ função@linha:coluna" (até 200 caracteres), fase: inicio|jogo, modo: Diário|Livre|Relâmpago|-}.
- **FR-004**: Privacidade: nunca vai endereço da página, pilha completa, texto entre aspas, URL, e-mail, números longos nem palavra digitada. A mensagem é cortada na primeira linha e em 120 caracteres.
- **FR-005**: Limites: o mesmo erro só uma vez por carregamento, no máximo 3 erros por carregamento e 10 por aparelho por dia. A captura nunca chama o código do jogo e nunca entra em laço se o Umami falhar.
- **FR-006**: Ruídos conhecidos corrigidos no jogo para não gastar o limite: `:focus-visible` em navegador antigo, evento de tecla sem `key`, som em navegador antigo.
- **FR-007**: `ferramentas/verificar-site.mjs` + `.github/workflows/verificar-site.yml` (só no repositório), todo dia às 07:41 de Brasília. Troca o script do Umami por um de mentira e bloqueia endereços de fora: a verificação não conta visita nem gasta evento. Duas tentativas. Grava `verificacao.json` na branch `verificacao`. Se falhar, abre (ou comenta) a issue "Site com problema (verificação diária)"; quando volta, fecha.
- **FR-008**: O coletor diário (`metricas.mjs`) inclui no `metricas.json`: `site` (resposta e tempo do site agora) e `verificacao` (resumo da última verificação diária).

## Success Criteria
- **SC-001**: `test.js` confere captura de erro ao abrir, erro jogando, promessa, armazenamento; ignora erros de fora; limites; sem laço com Umami quebrado; nada sem a tag; nada de dado pessoal.
- **SC-002**: A verificação passa contra o site local e falha num site quebrado de propósito. Provado à mão em 03/10/2026; não é automático porque a verificação confere ícones e manifesto que só existem no repositório (ver `ferramentas/medicoes/LEIAME.md`).
