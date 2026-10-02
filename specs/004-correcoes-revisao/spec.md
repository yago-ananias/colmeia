# Feature Specification: Correções da revisão de 02/10

**Feature Branch**: `004-correcoes-revisao`

**Created**: 2026-10-02

**Status**: Implemented

**Input**: Relatório `/mnt/project-files/revisoes/revisao-colmeia-2026-10-02.md`, opção recomendada: corrigir os 5 bugs.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lista de palavras correta (Priority: P1)

Palavras comuns e válidas são aceitas (sonho, erro, faca, garota, filha, amanhã) e as que não deveriam
valer ficam de fora (França, Adele, caddie, freelancer, rins, arranca, putaria).

**Acceptance Scenarios**:
1. **Given** "sonho" com as letras certas, **When** o jogador envia, **Then** a palavra vale.
2. **Given** "garota", **When** o jogador envia, **Then** vale (antes dava "Só verbos no infinitivo").
3. **Given** um nome de país, estrangeirismo, plural, verbo conjugado ou termo ofensivo, **Then** não está na lista.

### User Story 2 - Primeira visita (Priority: P1)
**Given** um jogador que nunca abriu o jogo, **When** a página carrega, **Then** "Como jogar" abre sozinho uma vez.

### User Story 3 - Celular (Priority: P1)
**Given** uma tela de 375×740, **When** o jogo abre, **Then** a colmeia e os botões Apagar/Enviar aparecem sem rolar.

### User Story 4 - Relâmpago justo (Priority: P2)
1. **Given** uma partida de Relâmpago, **When** qualquer janela (ajuda, confirmação) está aberta, **Then** o relógio para.
2. **Given** uma partida em andamento, **When** o jogador clica em outro modo (ou em Relâmpago de novo), **Then** o jogo pergunta "Abandonar a partida?" antes de descartar.

### Edge Cases
- Dica no Relâmpago com 6 segundos ou menos: recusada ("Tempo insuficiente para uma dica"), em vez de deixar o relógio em 1 s de graça.
- Botão de tema mostra o título certo ("Modo claro" quando o jogo está escuro).
- "Copiar resultado" depois de "Ver respostas" informa "respostas vistas".

## Requirements *(mandatory)*
- **FR-001**: A classificação das palavras MUST usar como a palavra aparece em textos anotados do português (treebanks UD), com o lematizador só como reserva.
- **FR-002**: Nomes próprios (treebank ou Hunspell), estrangeirismos (fora dos dicionários), plurais (inclusive vagens, cascavéis), verbos conjugados (inclusive infinitivo pessoal) e termos ofensivos MUST ficar de fora.
- **FR-003**: Quando duas palavras só diferem no acento, a forma válida MUST vencer (faca não é apagada por faça).
- **FR-004**: "Como jogar" MUST abrir na primeira visita.
- **FR-005**: Em 375×740 a colmeia e os botões MUST caber sem rolagem.
- **FR-006**: O relógio do Relâmpago MUST parar com janelas abertas, e trocar de modo MUST pedir confirmação.

## Success Criteria *(mandatory)*
- **SC-001**: Os 10 exemplos de palavras comuns da revisão valem e os 12 exemplos indevidos ficam de fora (teste automático).
- **SC-002**: Todos os testes de `ferramentas/test.js` passam, inclusive os novos de primeira visita, celular e Relâmpago.

## Assumptions
- Ficam para depois, por decisão do projeto: resultado com link, Livre sem repetir diários, botão de sugerir palavra.
- A lista passou a ter 9667 palavras e 7273 desafios; os desafios de hoje mudam de novo.
