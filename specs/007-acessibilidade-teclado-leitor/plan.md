# Plan: Acessibilidade (teclado e leitor de tela)
Tudo em `template.html`. Atalho global ignora Enter/Espaço quando o alvo é um botão com `:focus-visible` (clique de mouse seguido de Enter continua enviando). *(Trocado na spec 013 pela marca `porTab`: só o foco que chegou por Tab, sem letra digitada depois, deixa o botão agir.)* Janela: `.app.inert` + `lastFocus`. Foco nas letras sem depender de `outline` (cortado pelo `clip-path`). `#entry` vira `aria-hidden` e `#entrysr` (classe `.sr`) anuncia. `toast(msg,big,word)` monta o texto 30 ms depois de limpar e põe a palavra num `b.sr`; animação termina em opacidade .7; `clearToast()` ao começar nova palavra.

## Constitution Check

> Verificação feita depois, na spec 016 (auditoria do Spec Kit de 04/10/2026), contra a constituição v1.2.1.

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: nenhuma mudança de validade ou pontuação | ✅ |
| II. Português: `lang="pt-BR"` e avisos em português | ✅ |
| III. Um arquivo: tudo em `template.html` | ✅ |
| IV. Dinâmico e acessível: é o foco da spec (teclado, leitor de tela, foco visível) | ✅ |
| V. Testado: 12 testes novos em `test.js` | ✅ |
