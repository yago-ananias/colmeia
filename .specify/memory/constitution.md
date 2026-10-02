<!--
Sync Impact Report
Version: 0.0.0 (template) → 1.0.0
Principles added: I–V (all new)
Sections added: Restrições Técnicas, Fluxo de Desenvolvimento, Governança
Templates: plan-template.md ✅ (Constitution Check uses the gates below) · spec-template.md ✅ · tasks-template.md ✅
Follow-up TODOs: none
-->
# Colmeia (Projeto Soletra) Constitution

## Core Principles

### I. Regra do jogo é sagrada
O núcleo do jogo segue o Soletra: 7 letras, uma letra central obrigatória, palavras com 4 letras
ou mais, letras podem se repetir, acentos e cedilha são ignorados na digitação. Toda novidade
(modos, combos, dicas) é camada por cima desse núcleo e nunca muda o que conta como palavra válida.
O jogo é original: não usa código, imagens, nome ou marca do g1.

### II. Português de verdade
Todo texto da interface é em português do Brasil, claro e curto. A lista de palavras contém apenas
palavras comuns do português, sem nomes próprios e sem palavrões. Uma palavra só entra se existir em
dicionário e estiver entre as mais usadas na língua. Palavras estranhas reportadas são removidas.

### III. Um arquivo, zero servidor
O jogo publicado é uma única página HTML autocontida (lista de palavras embutida), que roda offline
depois de aberta e não depende de servidor nem de conta. O progresso fica no navegador do jogador e o
jogo funciona normalmente quando o armazenamento local não está disponível.

### IV. Dinâmico e acessível em qualquer tela
Cada ação tem resposta imediata (animação, mensagem ou som opcional). O jogo funciona no celular
(a partir de 360 px de largura, sem rolagem lateral) e no computador, por toque, mouse e teclado,
nos temas claro e escuro. Animações respeitam "reduzir movimento" e o foco do teclado é visível.

### V. Testado antes de publicar
Toda mudança na lógica (validação de palavras, pontuação, sorteio dos desafios, persistência) passa
pelo teste automatizado em `ferramentas/test.js` antes de publicar. Todo desafio publicado tem entre
22 e 65 palavras e pelo menos um pangrama.

## Restrições Técnicas

- HTML, CSS e JavaScript puros, sem framework. Fontes do Google Fonts com fallback do sistema.
- Página final abaixo de 1 MB.
- O código-fonte editável é `template.html`; a página publicada `colmeia.html` é gerada por script.
- Dados de palavras e desafios são gerados por `ferramentas/build.py` e `ferramentas/data.py`.

## Fluxo de Desenvolvimento

Spec Kit: constituição → `specs/NNN-*/spec.md` → `plan.md` → `tasks.md` → implementação.
Cada funcionalidade nova ganha uma pasta em `specs/`. Antes de publicar: rodar o teste, abrir o jogo
em largura de celular e de computador nos dois temas, e republicar no mesmo link.

## Governança

Esta constituição vale acima de qualquer outra prática do projeto. Mudanças exigem atualizar este
arquivo, subir a versão (MAJOR para remover ou redefinir princípio, MINOR para adicionar, PATCH para
ajuste de texto) e conferir se specs e planos abertos continuam de acordo.

**Version**: 1.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-02
