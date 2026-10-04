# Medições manuais

Ferramentas que não rodam em `test.js` nem no GitHub Actions: servem para conferir à mão, quando uma mudança
mexe em acessibilidade ou em resposta ao toque. Ficam no repositório, mas não rodam sozinhas.

## axe.js (spec 015, SC-002)
Varredura automática de acessibilidade (axe-core, WCAG 2.2 AA) em 4 configurações: 375×740 e 1200×900, claro e escuro,
com o jogo em estado cheio (dicas, mapa, palavra achada, "Ver respostas"). Resultado esperado: 0 violações
(antes da spec 015: 3).

```
mkdir -p /tmp/axe && cd /tmp/axe && npm i axe-core     # fora do projeto: o jogo não depende dele
AXE_DIR=/tmp/axe node ferramentas/medicoes/axe.js colmeia.html
```

## toque.js (spec 014)
Mede o tempo entre o toque numa letra e a letra aparecer em `#entry`, com a CPU reduzida (padrão 4×) e celular emulado.
Compara versões do jogo: `node ferramentas/medicoes/toque.js colmeia.html 4 1` (o último argumento liga ou desliga
o script de medição do site). Na spec 014 deu cerca de 18 ms nas 6 versões testadas, sem piora.
Não mede o gesto de toque duplo do Safari no iPhone.

## verificar-site.mjs (spec 010, SC-002)
Fica em `ferramentas/` e roda todo dia no GitHub Actions contra o site publicado. A prova de que ele falha num site
quebrado foi feita à mão em 03/10/2026 (site com erro de propósito); não é automática porque a verificação confere
arquivos do site (ícones e manifesto) que só existem no repositório.
