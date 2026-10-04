# Feature Specification: Lista de palavras revisada

**Feature Branch**: `006-lista-palavras-revisao`
**Created**: 2026-10-02
**Status**: Implemented
**Input**: Material da revisão "Bugs e melhorias do jogo" em `/mnt/project-files/revisoes/lista/`: a lista estava sem *abelha, rainha, leão, leoa* e outras palavras comuns.

## User Story 1 - Palavras comuns valem (P1)
O jogador digita palavras comuns (*abelha, rainha, leão, sopa, suco, tesouro, anotar*) e elas são aceitas; nomes, países, estrangeirismos, plurais e verbos conjugados continuam recusados.

**Acceptance**: as 285 palavras de `ferramentas/listas/deve_valer.txt` valem e nenhuma das 252 de `nao_deve_valer.txt` vale.

## Requirements
- **FR-001**: A montagem MUST consultar o Hunspell completo (spylls), não só os radicais do `.dic`.
- **FR-002**: Palavra fora de `palavras.txt` só entra se não for apenas forma conjugada de verbo usado.
- **FR-003**: Nome próprio pelos treebanks exige ≥5 usos como nome e uso comum ≤10% disso.
- **FR-004**: Plural só quando o singular é conhecido pelo Hunspell e os treebanks não mostram a palavra no singular.
- **FR-005**: Grafias impossíveis em português (k, w, y, sh, th, ck, finais em consoante) ficam de fora, salvo `permitidas.txt`.
- **FR-006**: A montagem e o teste MUST falhar se o diagnóstico das duas listas falhar.

## Success Criteria
- **SC-001**: 285/285 e 252/252 no diagnóstico.
- **SC-002**: Desafios continuam com 22 a 65 palavras e ao menos um pangrama. *(Vale para o Livre e para os dias futuros; dias já publicados ficam fixos, spec 008 FR-007.)*
