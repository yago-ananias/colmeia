# Colmeia de Palavras

Jogo de palavras em português: forme palavras com 7 letras, sempre usando a letra do centro.
Três desafios por dia (Manhã, Tarde e Noite), modo Livre, modo Relâmpago, combos, dicas e modo escuro.

**Jogar:** https://yago-ananias.github.io/colmeia/

As regras e a pontuação estão em [REGRAS.md](REGRAS.md).

## Como o projeto está organizado

| Caminho | O que é |
| --- | --- |
| `template.html` | Código do jogo (HTML, CSS e JS numa página só). É aqui que se edita. |
| `colmeia.html` | Página pronta: `template.html` com a lista de palavras e os desafios embutidos. |
| `ferramentas/` | Scripts que montam a lista de palavras (`montar.sh`), os testes (`test.js`) e o site (`site.sh`). |
| `ferramentas/listas/` | Palavras que precisam valer e que não podem valer; conferidas a cada montagem. |
| `site/` | Ícones da aba, ícone para tela inicial e manifesto do site. |
| `specs/`, `.specify/` | Especificações de cada mudança (Spec Kit) e a constituição do projeto. |
| `marca/` | Logo e design system. |

## Montar, testar e publicar

```sh
sh ferramentas/montar.sh   # só se mudou palavras, regras da lista ou template.html
node ferramentas/test.js   # precisa do Playwright com Chromium
sh ferramentas/site.sh     # gera _site/ para conferir localmente
```

Cada push na branch `main` roda os testes no GitHub Actions e, se passarem, publica o site no GitHub Pages.
Pull requests rodam só os testes.
