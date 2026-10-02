Colmeia é um jogo diário de palavras em português: sete letras num favo, a do meio obrigatória. A marca nasce do próprio tabuleiro. O hexágono é a célula, o mel é a letra central, e todo o resto fica em segundo plano para as letras aparecerem.

## Voz e texto

- Escreva em português do Brasil, falando com "você". Frases curtas, sem pedido de desculpas.
- Botões são verbos: "Enviar", "Apagar", "Embaralhar", "Compartilhar", "Revelar início (−5 s)".
- Erros dizem o motivo em poucas palavras: "Muito curta", "Falta a letra central", "Já encontrada", "Plural não vale", "Só verbos no infinitivo", "Não está na lista".
- Comemorações são curtas e com exclamação: "Incrível!", "Palavra longa!", "Novo recorde!", "PANGRAMA! +14".
- Os níveis seguem a vida da abelha e ficam no feminino: Ovo, Larva, Pupa, Operária, Exploradora, Guardiã, Rainha. O último marco é "Colmeia completa".
- Os modos são Diário, Relâmpago e Livre. Os desafios do dia são Manhã, Tarde e Noite.
- Sem emoji na interface. O tema é contado pelas palavras e pelo hexágono, não por desenhos de abelha.
- Escreva "colmeia" em minúsculas no logo e "Colmeia" com maiúscula no texto corrido.

## Logo

- A assinatura é o símbolo à esquerda e a palavra "colmeia" à direita. Use os SVGs do grupo Logos; não redesenhe nem escreva o nome numa fonte para imitar o logo.
- O símbolo é uma célula de favo aberta à direita, formando um C, com um núcleo hexagonal em mel. O pingo do i da palavra é o mesmo hexágono de mel.
- Use `colmeia-logo.svg` sobre `bg` e `panel` no tema claro e `colmeia-logo-escuro.svg` no escuro.
- Deixe em volta do logo uma margem livre igual à altura do núcleo do símbolo.
- Tamanho mínimo: assinatura com 24px de altura; símbolo sozinho com 16px.
- O mel do logo é sempre `honey`. Não troque a cor do núcleo, não gire o símbolo, não aplique sombra nem contorno.
- Ícone de app e favicon: `colmeia-icone.svg`.

## Cor

- Fundo da página em `bg`; cartões, abas, botões secundários e janelas em `panel` com borda `line`.
- Texto em `ink`; texto de apoio em `muted`. Os dois passam de 4,5:1 sobre `bg` e `panel` nos dois temas.
- `honey` é a cor da marca e marca o que é central ou conquistado: a letra central, o progresso, o desafio selecionado, os selos ganhos. Use como preenchimento com texto `honey-ink`. Quando o mel precisa ser texto sobre fundo claro, use `honey-text`.
- `plum` é a cor de ação e de ritmo: links, combo, cronômetro, pangramas na lista e o anel de foco. Fundos suaves de combo e dica em `plum-soft` com texto `plum`.
- `good` e `bad` só aparecem com uma palavra junto. Nunca indique acerto ou erro só pela cor.
- `line` é decorativa (1,3:1). Um controle não pode depender só dela para ser visto; botões e abas se destacam também pelo fundo `panel` e pelo texto.
- O tema escuro não é uma inversão: o fundo vai para um roxo quase preto (`bg` #16151E), o mel clareia um pouco e o roxo vira lilás para manter o contraste.

## Tipografia

- Títulos, letras do favo, números e a palavra digitada em Bricolage Grotesque (`font-display`), pesos 700 e 800.
- Texto corrido, botões e legendas em Atkinson Hyperlegible (`font-body`), pesos 400 e 700. Ela foi feita para leitura fácil, o que importa num jogo em que cada letra conta.
- As duas vêm do Google Fonts. Carregue `Bricolage Grotesque` (opsz 12–96, pesos 500, 700, 800) e `Atkinson Hyperlegible` (400, 700).
- Use os estilos da escala: `numero-grande`, `letra-favo`, `entrada`, `titulo-folha`, `marca`, `nivel`, `titulo-cartao`, `corpo`, `botao`, `aba`, `legenda`, `selo`, `micro`.
- Letras do favo, entrada e dicas em maiúsculas. Palavras da lista com inicial maiúscula.
- Números que mudam (pontos, relógio, contagens) com `font-variant-numeric: tabular-nums`.

## Espaço, forma e profundidade

- Margem lateral da página: `space-16`. Ritmo vertical entre blocos: `space-14`. Entre tabuleiro e coluna lateral: `space-22`.
- A página tem no máximo 1040px; a coluna lateral, 380px. Abaixo de 760px tudo vira uma coluna só.
- Hexágono só no tabuleiro e na marca. O resto da interface é redondo: botões e abas em `radius-pill`, cartões em `radius-xl`, janelas em `radius-2xl`, desafios do dia em `radius-lg`, avisos em `radius-md`, dicas em `radius-sm`.
- Separe blocos por borda `line`, não por sombra. A única sombra é `shadow-sheet`, nas janelas sobrepostas. O favo tem um degrau de 2px em `line` embaixo.

## Movimento

- Movimentos curtos e com função: a célula encolhe a 90% ao toque, o favo gira 60° ao embaralhar, a palavra recusada treme 0,4s, o nome do nível pulsa ao subir, a palavra nova pisca em mel.
- Avisos entram, ficam e saem em 1,3s.
- Com `prefers-reduced-motion`, desligue todas as animações e transições.

## Acessibilidade

- Foco visível em todo controle: anel sólido `plum` de 3px com 2px de afastamento (mais de 6:1 nos dois temas).
- Toda célula do favo, botão de ícone e grupo tem `aria-label` em português ("Letra A (central)", "Embaralhar letras", "Desafios de hoje").
- Avisos ficam numa região `aria-live="polite"`.
- O jogo funciona inteiro pelo teclado: letras digitam, Enter envia, Backspace apaga, espaço embaralha.

## Ícones

- Não há biblioteca de ícones. Os botões usam caracteres de texto: ◐ tema, ♪ som, ? ajuda, ⟳ embaralhar. Eles herdam a cor do texto e funcionam nos dois temas.
- Se um ícone desenhado for necessário, siga o símbolo: traço grosso com pontas arredondadas, construído sobre o hexágono.

## Componentes

Os componentes são CSS puro em `components/bundle.css`, com classes `cm-` e os tokens do sistema. Envolva a área em `.cm-root` para herdar fonte, cor e foco.
