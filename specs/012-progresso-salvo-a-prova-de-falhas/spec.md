# Feature Specification: Progresso salvo à prova de falhas

**Feature Branch**: `012-progresso-salvo-a-prova-de-falhas`
**Created**: 2026-10-03
**Status**: Implemented
**Input**: YAGO (03/10/2026): "C1 aprovado". Item C1 do roadmap de evolução: "Progresso corrompido trava o jogo ao abrir (risco conhecido desde a spec 010)". Pronto quando: "Dado inválido é descartado com aviso, o jogo abre e um teste cobre o caso".

Antes desta spec, um dado salvo com formato errado no navegador (estatísticas, progresso de um desafio, letras já vistas no Livre, palavras sugeridas) fazia o jogo parar ao abrir ou no meio da partida: colmeia vazia, desafios do dia sem aparecer, Livre sem abrir, aviso de palavra recusada quebrado. O jogador só saía disso limpando os dados do site.

## User Story 1 - O jogo sempre abre (P1)
Se alguma coisa salva no navegador estiver com defeito (por uma versão antiga, uma extensão, o navegador ou edição manual), o jogo abre normalmente com as 7 letras e dá para jogar. A parte com defeito é descartada e o jogador vê o aviso "Progresso com defeito descartado".

**Acceptance**: com cada dado salvo corrompido, o jogo abre com 7 letras, aceita uma palavra válida, não tem erro de script e mostra o aviso.

## User Story 2 - Só a parte com defeito se perde (P1)
O que estava certo continua: num progresso com uma palavra estragada, as palavras certas ficam; nas estatísticas com as conquistas estragadas, o recorde do Relâmpago fica. O dado limpo é salvo de volta.

**Acceptance**: progresso com palavras certas e itens inválidos mantém só as palavras certas; estatísticas com conquistas inválidas mantêm o recorde.

## User Story 3 - Saber no painel quando isso acontece (P2)
No site, cada descarte vira um aviso `armazenamento` no monitoramento de erros (spec 010), só com o nome do dado (`DadoInvalido: stats`, `DadoInvalido: diario`...), nunca com o conteúdo.

## Requirements
- **FR-001**: Toda leitura do armazenamento passa por um formato por dado: som e ajuda vista (sim ou não), tema (claro ou escuro), estatísticas (números e conquistas conhecidas), progresso do Diário e do Livre (7 letras diferentes, palavras de 4 a 19 letras sem repetir, números, revelado sim ou não), letras vistas no Livre e palavras sugeridas (listas).
- **FR-002**: JSON quebrado, tipo errado ou letras do desafio inválidas descartam o dado inteiro (volta ao padrão e o dado é apagado). Itens errados dentro de uma lista ou número inválido descartam só aquele item ou campo, e o dado limpo é salvo de volta.
- **FR-003**: Progresso com 7 letras que não formam nenhuma palavra é descartado; o Diário abre com as letras do dia e o Livre sorteia outro desafio.
- **FR-004**: O aviso aparece uma vez por carregamento, 1,2 s depois do descarte, na área de avisos (lida pelo leitor de tela).
- **FR-005**: Palavras salvas que estão no formato certo, mas não valem mais no desafio (a lista mudou), saem em silêncio, sem aviso: não é defeito.
- **FR-006**: No site, o descarte avisa o monitoramento (`tipo: armazenamento`, `erro: "DadoInvalido: <dado>"`), com os mesmos limites da spec 010. O progresso dos diários vai como `diario`, sem o número do dia.

## Success Criteria
- **SC-001**: `test.js` cobre 16 casos (estatísticas, diário com lista quebrada, letras inválidas e letras sem palavra, som, tema, letras vistas, Livre, sugestões, progresso em parte com defeito, palavra que saiu da lista, progresso certo, tudo o que o jogo salva de verdade ao recarregar, Artifact, aviso ao painel) e passa.
- **SC-002**: Os testes da spec 010 que usavam progresso corrompido para provocar erro passam a quebrar uma função do navegador (`matchMedia`, `normalize`) e continuam passando.
- **SC-003**: A página cresce 3,4 KB (624 KB → 627 KB, abaixo de 1 MB).

## Assumptions
- O aviso é curto e não pede ação: o jogador não precisa fazer nada.
- Dados que o jogo não conhece (chaves de versões futuras) são ignorados, não descartados.
