# Feature Specification: Acessibilidade (teclado e leitor de tela)

**Feature Branch**: `007-acessibilidade-teclado-leitor`
**Created**: 2026-10-02
**Status**: Implemented
**Input**: Itens 1 a 6 de `/mnt/project-files/revisoes/acessibilidade-colmeia-2026-10-02.md` (padrão recomendado; YAGO ainda pode escolher outro conjunto).

## User Story 1 - Jogar só com teclado (P1)
Quem usa só o teclado navega com Tab, aciona qualquer botão com Enter ou Espaço, vê onde está o foco (inclusive nas letras) e usa as janelas sem o foco escapar para o jogo por trás.

## User Story 2 - Jogar com leitor de tela (P1)
O leitor usa voz em português, anuncia a palavra sendo digitada ("Palavra: O B R E") e diz qual palavra foi aceita ou recusada.

## Requirements
- **FR-001**: Enter e Espaço com foco de teclado num botão acionam o botão; fora disso continuam enviando e embaralhando (item 1). *(O mecanismo mudou na spec 013: em vez de `:focus-visible`, vale o foco que chegou por Tab sem nada digitado depois; o requisito é o mesmo.)*
- **FR-002**: Janelas deixam o jogo por trás inerte, têm nome (`aria-labelledby` no título) e devolvem o foco ao fechar (item 2).
- **FR-003**: Letra da colmeia com foco de teclado fica roxa; a central ganha sublinhado (item 3).
- **FR-004**: `lang="pt-BR"` (item 4).
- **FR-005**: Região oculta anuncia a palavra digitada; avisos incluem a palavra para o leitor (item 5).
- **FR-006**: O aviso fica visível (esmaecido) até a próxima palavra começar; avisos iguais são anunciados de novo (item 6).

## Success Criteria
- **SC-001**: `test.js` cobre os seis itens e passa nos dois temas.
