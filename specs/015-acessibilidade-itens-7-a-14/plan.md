# Plan: Acessibilidade, itens 7 a 14

Tudo em `template.html` (sem mexer em dados, regras ou lista de palavras).

- **CSS**: `.combo` sem opacidade; `.clues` vira lista com `li.done` (cor normal, riscada, ✓ por `::before` com texto alternativo vazio); `.badge.got::before` ✓; `.words li.pg>span:first-child::before` ★; `.dailies button[aria-pressed="true"]`, `.fill`, `.dot.on` em `--honey-text` (o ponto atual ganha anel); `.iconbtn.off` com risco; `.hintgrid th[scope="row"]`; `.wordsbox` (quem rola) com `:focus-visible`, `.words` só em colunas; no `@media (max-width:760px)`: 44 px nos alvos.
- **HTML**: `<main>`; `#timesr` (`role="status"`); `#b-sound` com `aria-pressed`; `#track` como `progressbar`; `#clues` como `ul`; `#wordsbox` (`role="group"`, `tabindex="0"`, `aria-labelledby`) envolve `#words`.
- **JS**: `renderRank` (valores e `aria-valuetext`), `renderWords` (texto "pangrama"/"não encontrada" fora do `<span>` da palavra, para não mudar o texto dela; a palavra nova é trazida para a área visível da caixa), `renderHints` (dicas), `renderGrid` (tabela), `renderSound`, `renderStats` (obtida/não obtida), `avisaTempo()` chamada por `tick()`.
- **Testes**: seção "Acessibilidade, itens 7 a 14 (spec 015)" em `test.js`: cada item num contexto com progresso semeado; contraste calculado das cores resolvidas; relógio de mentira (`page.clock`) para o Relâmpago.
- **Verificação manual**: axe-core rodado numa pasta de rascunho (não entra no repositório), antes e depois.

## Constitution Check
- I. Regra do jogo: nada muda no que vale como palavra nem na pontuação.
- III. Um arquivo, zero servidor: só HTML, CSS e JS da própria página.
- IV. Acessível em qualquer tela: é a spec que fecha os 14 itens da revisão.
- V. Testado antes de publicar: um teste por item, nos dois temas onde o contraste importa.
