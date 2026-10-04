# Feature Specification: Acessibilidade, itens 7 a 14

**Feature Branch**: `015-acessibilidade-itens-7-a-14`
**Created**: 2026-10-04
**Status**: Implemented
**Input**: Roadmap de evolução, item C2 (próximo depois do C1). YAGO perguntou "Qual o próximo passo do roadmap?" (04/10/2026) e o C2 foi iniciado como padrão recomendado; o cartão de decisão no chat do projeto deixa trocar pelo C3. Os itens 7 a 14 vêm de `/mnt/project-files/revisoes/acessibilidade-colmeia-2026-10-02.md` (os itens 1 a 6 foram a spec 007). Pronto quando: "Os 14 itens da revisão resolvidos, com teste para cada um". A spec também fecha dois achados extras da varredura automática (itens 15 e 16, abaixo).

## User Story 1 - Ler e enxergar tudo, em qualquer tema (P1)
Textos e marcas têm contraste suficiente nos temas claro e escuro, e nada é dito só pela aparência (cor, opacidade, borda tracejada): conquistas, palavras que faltaram, pangramas, dicas encontradas e desafio selecionado têm texto, símbolo ou os dois.

## User Story 2 - Ouvir o jogo com leitor de tela (P1)
Dicas, mapa, nível, som e tempo do Relâmpago fazem sentido falados: "Começa com RO, 4 letras", tabela com legenda e títulos, barra de nível como progresso, som como botão ligado/desligado e aviso aos 30 e 10 segundos.

## User Story 3 - Tocar sem errar no celular (P2)
Abas de modo, desafios do dia, ícones e links do cabeçalho dos cartões têm pelo menos 44 × 44 px em telas estreitas.

## Requirements
- **FR-001 (item 7)**: "Combo: acerte em sequência" parado deixa de usar opacidade (texto em `--ink`, ativo em `--plum`). Dica encontrada mantém a cor, fica riscada e ganha ✓. Contraste de texto mínimo 4,5:1 nos dois temas.
- **FR-002 (item 8)**: Conquistas dizem "obtida" ou "não obtida" ao leitor e as obtidas ganham ✓. Pangramas na lista ganham ★ e "pangrama". Palavras que faltaram (depois de "Ver respostas") dizem "não encontrada". O desafio selecionado usa `--honey-text` na borda (contraste mínimo 3:1 nos dois temas).
- **FR-003 (item 9)**: Cada dica é lida como "Começa com XX, N letras" (e ", já encontrada"); a lista de dicas é uma `ul`. O mapa ganha `caption`, `th scope` nas linhas e nas colunas, "Total" no lugar de Σ e "nenhuma" no lugar de –.
- **FR-004 (item 10)**: `<main>` envolve a colmeia e as laterais (o confete já estava fora do leitor desde a spec 007).
- **FR-005 (item 11)**: `#track` é `role="progressbar"` com nome "Nível", `aria-valuenow`/`max` e `aria-valuetext` ("Ovo, 0 pontos. Dia 4 · Manhã · Faltam 9 pts para Larva"). Preenchimento e pontos em `--honey-text` (contraste mínimo 3:1).
- **FR-006 (item 12)**: Botão de som com `aria-pressed` (nome fixo "Som") e, desligado, ícone riscado e cor suave.
- **FR-007 (item 13)**: Região `status` oculta anuncia "Faltam 30 segundos" e "Faltam 10 segundos" no Relâmpago; volta a avisar se palavras devolverem tempo.
- **FR-008 (item 14)**: Em telas de até 760 px, `.modes button`, `.dailies button`, `.iconbtn` e `.linkbtn` com mínimo de 44 px.
- **FR-009 (item 15, achado pelo axe-core durante a spec)**: a lista de palavras, que rola, fica numa caixa (`#wordsbox`) com `tabindex="0"`, nome (o título "N de M palavras") e contorno de foco; antes quem usa só teclado não alcançava as palavras que rolavam para fora.
- **FR-010 (item 16, achado ao investigar o item 15)**: a lista rola na vertical. Antes, as colunas com altura máxima criavam colunas extras para a direita (no celular, da 13ª palavra em diante, no computador da 19ª), escondidas sem aviso e sem barra de rolagem visível. A caixa rola e a palavra nova aparece sozinha na área visível.

## Success Criteria
- **SC-001**: `test.js` cobre os itens 7 a 16 (contraste calculado nos dois temas, texto para leitor, símbolos, estrutura do mapa, `main`, barra de nível, som, aviso de tempo com relógio de mentira, alvos de 44 px, lista com foco e sem colunas escondidas) e passa.
- **SC-002**: axe-core (WCAG 2.0 a 2.2 AA e boas práticas) em 375 px e 1200 px, nos dois temas, com dicas, mapa, conquista e "Ver respostas" na tela: 3 violações antes, 0 depois.
- **SC-003**: a colmeia e o botão Enviar continuam visíveis sem rolar em 375 × 740 (teste da spec 004). Custo dos alvos de 44 px: Enviar termina em 704 px em vez de 672 px.
- **SC-004**: a página continua abaixo de 1 MB.

## Assumptions
- Não houve teste com NVDA ou VoiceOver de verdade; o que está em "leitor de tela" vem da estrutura (ARIA, texto oculto) e da varredura do axe-core, como na revisão.
- Alvos de 44 px só em telas estreitas; no computador os botões continuam como estavam (já passam dos 24 px da WCAG 2.2).
