# Feature Specification: Marca e design system no jogo

**Feature Branch**: `005-marca-design-system`

**Created**: 2026-10-02

**Status**: Implemented

**Input**: "Gostei muito do nome Colmeia para o jogo, em sequência, evoluir a logo marca criada para ele e criar um design system" / "O design system e marca foram atualizadas no jogo?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O jogo usa a nova marca (Priority: P1)
**Given** o jogo aberto, **Then** o cabeçalho mostra a assinatura oficial "colmeia" (símbolo + palavra) em SVG, na versão clara ou escura conforme o tema, e "Como jogar" mostra o símbolo.

### User Story 2 - O jogo segue o design system (Priority: P1)
**Given** o jogo em qualquer tema, **Then** cores, fontes, espaços e raios vêm dos tokens do design system (`/mnt/project-files/colmeia-design/design-system/tokens.json`), incluindo o novo `honey-text` para mel como texto.

### Edge Cases
- Trocar o tema pelo botão ◐ troca também a versão do logo.
- Assinatura com 28px de altura (mínimo do sistema: 24px).

## Requirements *(mandatory)*
- **FR-001**: O cabeçalho MUST usar `colmeia-logo.svg` no tema claro e `colmeia-logo-escuro.svg` no escuro, sem redesenhar o logo.
- **FR-002**: A página MUST declarar todos os tokens do sistema (cores, `space-*`, `radius-*`, sombra) e usá-los nos componentes.
- **FR-003**: A letra central digitada MUST usar `honey-text` (contraste 5,5:1 no claro).
- **FR-004**: O comportamento do jogo MUST continuar igual.

## Success Criteria *(mandatory)*
- **SC-001**: Todos os testes de `ferramentas/test.js` passam sem mudança de comportamento.
- **SC-002**: Página continua abaixo de 1 MB.

## Assumptions
- O ícone de app (`colmeia-icone.svg`) não entra na página: o ícone da aba é definido pela plataforma de publicação.
- Os componentes do sistema foram extraídos deste jogo, então as classes atuais já seguem as mesmas medidas; não foi preciso trocar para as classes `cm-`.
