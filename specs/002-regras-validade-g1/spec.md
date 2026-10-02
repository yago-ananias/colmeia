# Feature Specification: Regras de validade do Soletra do g1

**Feature Branch**: `002-regras-validade-g1`

**Created**: 2026-10-02

**Status**: Implemented

**Input**: User description: "No Soletra original do g1: letras podem ser usadas mais de uma vez; algumas palavras não estão listadas (termos científicos, jargões, palavras ofensivas, determinados pronomes, preposições e conjunções); somente verbos no infinitivo são válidos; ambos os gêneros são válidos; plurais não são válidos. Implementar as que faltam e propor novas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Só valem formas básicas das palavras (Priority: P1)

O jogador só pontua com a forma de dicionário: verbos no infinitivo, palavras no singular,
masculino ou feminino.

**Independent Test**: Num desafio com as letras certas, "correr" vale e "correu" não; "laranja" vale e "laranjas" não; "aluno" e "aluna" valem.

**Acceptance Scenarios**:

1. **Given** um verbo conjugado com as letras do desafio, **When** o jogador envia, **Then** aparece "Só verbos no infinitivo" e nada conta.
2. **Given** um plural, **When** o jogador envia, **Then** aparece "Plural não vale".
3. **Given** a forma feminina de uma palavra válida (aluna, bonita, leoa), **When** o jogador envia, **Then** ela vale.
4. **Given** um pronome, preposição ou conjunção, **When** o jogador envia, **Then** aparece "Pronomes, preposições e conjunções não valem".

### User Story 2 - Regras visíveis (Priority: P2)

O jogador encontra essas regras em "Como jogar".

**Independent Test**: Abrir "Como jogar" e ver as regras de plural, infinitivo e gênero.

### Edge Cases

- Palavra que é substantivo e também forma verbal (fala, rolha, muda): vale como substantivo.
- Palavra terminada em "s" no singular (lápis, ônibus, vírus, atrás): vale.
- Plurais que o lematizador não reduz (luvas, trevas): não valem, porque o singular existe.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O jogo MUST recusar verbos conjugados e aceitar verbos no infinitivo.
- **FR-002**: O jogo MUST recusar plurais.
- **FR-003**: O jogo MUST aceitar masculino e feminino da mesma palavra.
- **FR-004**: O jogo MUST recusar pronomes, preposições, conjunções e suas contrações.
- **FR-005**: O jogo MUST dizer o motivo da recusa (plural, verbo conjugado, classe gramatical) quando souber.
- **FR-006**: Todos os desafios MUST continuar com 22 a 65 palavras e pelo menos um pangrama.

## Success Criteria *(mandatory)*

- **SC-001**: Nenhuma palavra válida do jogo é plural ou verbo conjugado nos testes automáticos.
- **SC-002**: aluno, aluna, correr, jogar e laranja valem; laranjas, correu, jogou, casas, porque e eles não valem.
- **SC-003**: O jogador entende por que a palavra foi recusada em 100% dos casos de plural, verbo e palavra funcional conhecidos.

## Assumptions

- A classificação é automática (lematizador simplemma) mais listas manuais; alguns casos ambíguos podem escapar e serão corrigidos pela `blocklist.txt` quando aparecerem.
- Repetir letras e ignorar acentos já existiam e continuam iguais.
- Termos científicos e jargões continuam filtrados pela lista de frequência (só entram as palavras mais usadas da língua).
