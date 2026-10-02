# Feature Specification: Bônus de palavra longa

**Feature Branch**: `003-bonus-palavra-longa`

**Created**: 2026-10-02

**Status**: Implemented

**Input**: User description: "Implementar apenas a 3. Bônus de palavra longa: palavras com 8 letras ou mais ganham +3."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Palavras longas valem mais (Priority: P1)

O jogador que acha uma palavra com 8 letras ou mais ganha 3 pontos extras e vê o aviso "Palavra longa!".

**Independent Test**: Num desafio, enviar uma palavra de 8 letras e conferir que vale 11 pontos.

**Acceptance Scenarios**:

1. **Given** uma palavra válida de 8 letras, **When** o jogador envia, **Then** ganha 8 + 3 = 11 pontos e aparece "Palavra longa! +11".
2. **Given** uma palavra válida de 7 letras, **When** o jogador envia, **Then** ganha 7 pontos, sem bônus.
3. **Given** um pangrama de 9 letras, **When** o jogador envia, **Then** ganha 9 + 7 (pangrama) + 3 (palavra longa) = 19.
4. **Given** combo ativo, **When** o jogador envia uma palavra longa, **Then** o multiplicador vale sobre o total com bônus.

### Edge Cases

- A pontuação máxima do desafio inclui o bônus, então os níveis continuam proporcionais.

## Requirements *(mandatory)*

- **FR-001**: Palavras com 8 letras ou mais MUST ganhar +3 pontos.
- **FR-002**: O bônus MUST somar com o bônus de pangrama e entrar no cálculo do combo e da pontuação máxima.
- **FR-003**: "Como jogar" e REGRAS.md MUST explicar o bônus.

## Success Criteria *(mandatory)*

- **SC-001**: Nos testes automáticos, uma palavra de 8+ letras vale o tamanho + 3 e uma de 6–7 letras vale só o tamanho.

## Assumptions

- As outras quatro regras propostas (letra dourada, palavra da sorte, erro custa tempo, modo difícil) ficam fora, por escolha do dono do projeto.
