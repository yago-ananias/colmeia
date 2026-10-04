# Regras da Colmeia

Tudo abaixo vem do código do jogo (`template.html`).

## Como formar palavras
- A colmeia tem 7 letras diferentes. A do meio é a **letra central**.
- Toda palavra precisa ter **4 letras ou mais** e **usar a letra central**.
- Só valem as letras da colmeia, e cada uma pode se repetir quantas vezes quiser.
- Acentos e cedilha não importam: digite `acao` para "ação". A palavra aparece com acento na lista.
- A palavra precisa estar na lista do jogo (cerca de 11.600 palavras comuns do português) ou ser uma **palavra extra** (veja abaixo).
- **Plurais não valem**: *laranja* vale, *laranjas* não. Palavras que já terminam em "s" no singular (*lápis*, *ônibus*) valem.
- **Verbos só no infinitivo**: *correr* vale, *correu* e *corri* não.
- **Masculino e feminino valem**: *aluno* e *aluna*, *leão* e *leoa*.
- **Preposições e conjunções valem** (*para*, *porque*, *quando*, *após*, *porém*), inclusive contrações com artigo ou advérbio (*pelo*, *numa*, *daqui*). Os plurais delas não valem (*pelos*).
- **Ficam de fora**: pronomes e contrações com pronome (*eles*, *você*, *isso*, *dele*, *neste*), nomes próprios, estrangeirismos e palavrões.
- Palavra repetida não conta de novo.
- Mensagens de erro: "Muito curta", "Falta a letra central", "Já encontrada", "Plural não vale", "Só verbos no infinitivo", "Pronomes não valem", "Não está na lista". Letra fora da colmeia nem entra (a palavra treme).
- **Pangrama** é a palavra que usa as 7 letras. Todo desafio tem pelo menos um.
- Cada desafio tem entre 22 e 65 palavras.

## Palavras extras (spec 011)
- Termos técnicos e científicos e palavras menos comuns que o dicionário conhece (*sinapse*, *entalpia*, *usucapião*, *bissetriz*) valem como **palavra extra**. O aviso é "Palavra extra! +N".
- Somam pontos como qualquer palavra (com bônus e combo) e contam para o nível. No Relâmpago também dão tempo.
- Não contam para a contagem de palavras do desafio ("N de M palavras"), para "Colmeia completa" nem para os 5 acertos da sequência de dias, e não aparecem nas dicas nem em "Ver respostas".
- Aparecem na lista com a etiqueta "extra", e o título mostra "+N extras". O resultado compartilhado também mostra as extras.
- Seguem as mesmas regras: sem plural, verbo conjugado, nome próprio, estrangeirismo, nome científico em latim ou palavrão.

## Pontos por palavra
| Palavra | Pontos |
|---------|--------|
| 4 letras | 1 |
| 5 letras ou mais | 1 por letra (5 letras = 5, 8 letras = 8) |
| Pangrama | 1 por letra + 7 de bônus (um pangrama de 7 letras vale 14) |
| 8 letras ou mais | 1 por letra + 3 de bônus de palavra longa (8 letras = 11) |

Os bônus somam: um pangrama de 9 letras vale 9 + 7 + 3 = 19. O combo multiplica o total da palavra, já com os bônus.

## Combo
- Se você acerta uma palavra até **12 segundos** depois do acerto anterior, o combo sobe.
- A 2ª palavra seguida vale **x2**, a 3ª **x3**, a 4ª **x4** e da 5ª em diante **x5**.
- O bônus é a parte extra: uma palavra de 6 pontos em x3 dá 6 pontos + 12 de combo.
- Passou dos 12 segundos sem acertar, o combo volta para x1. Erros não quebram o combo.
- Nos modos Diário e Livre o bônus de combo aparece separado ("+N combo") e **não conta para o nível**. No Relâmpago ele soma na pontuação final.

## Níveis (Diário e Livre)
O nível é calculado só com os pontos das palavras (as extras contam), como fração da pontuação máxima do desafio (que só soma as palavras do desafio):

| Nível | A partir de |
|-------|-------------|
| Ovo | 0% |
| Larva | 3% |
| Pupa | 8% |
| Operária | 15% |
| Exploradora | 25% |
| Guardiã | 40% |
| Rainha | 60% |
| Colmeia completa | todas as palavras |

## Modos
- **Diário:** três desafios por dia (Manhã, Tarde e Noite), iguais para todo mundo e liberados à meia-noite pelo horário do aparelho. Cada um guarda seu progresso.
- **Relâmpago:** desafio sorteado (entre os do Livre) com pelo menos 35 palavras. Começa com **75 segundos**. Cada acerto dá **2 segundos por letra** (no máximo 14) e o pangrama dá **12 segundos**. Pontuação = pontos das palavras + bônus de combo. O recorde fica salvo. O relógio para se você trocar de aba ou abrir qualquer janela (como a ajuda). Trocar de modo no meio da partida pede confirmação.
- **Livre:** desafios sorteados sem limite. Nunca usa as letras de um desafio diário (de hoje, de outro dia ou dos próximos) e não repete letras que você já jogou no Livre, até acabarem todas. O botão "Novo desafio" troca de desafio.

## Dicas
- **Mapa de dicas** (grátis): tabela com quantas palavras faltam por letra inicial e tamanho.
- **Revelar início de palavra:** mostra as 2 primeiras letras e o tamanho de uma palavra que falta. No Diário e no Livre são **3 por desafio**. No Relâmpago não há limite, mas cada uma custa **5 segundos** e só pode ser pedida com mais de 6 segundos no relógio.
- **Ver respostas** (Diário e Livre): mostra todas as palavras que faltam. Depois disso o desafio não aceita mais palavras e as dicas ficam desativadas.

## Compartilhar e sugerir
- **Compartilhar** abre o menu de compartilhar do celular ou copia um resumo: nível, uma grade de 7 casas (uma por nível a partir de Larva; 🍯 na colmeia completa), ⭐ por pangrama e um link para o mesmo desafio.
- Quem abre o link joga as mesmas letras: no Diário, se for um desafio de hoje; no Livre, se for de outro dia. No Relâmpago, o link mostra quantos pontos bater, e o relógio só começa quando a pessoa fecha o aviso.
- **Sugerir:** quando o jogo recusa uma palavra de 4 letras ou mais com a letra central (fora da lista, plural, verbo ou pronome), aparece o botão "Sugerir". Ele abre uma sugestão pronta no GitHub do jogo (é preciso ter conta lá). Depois, a palavra aparece como "Já sugerida".

## Sequência e conquistas
- **Dias seguidos:** o dia conta quando você acha 5 palavras do desafio (extras não contam) em um desafio diário. Pular um dia zera a sequência.
- **Conquistas:** Primeiro pangrama, Combo x5, Virou Rainha, 100 pts no Relâmpago, 3 dias seguidos, Guardiã sem dicas (chegar a Guardiã sem dicas e sem ver respostas) e Colmeia completa.

## Controles
Toque ou clique nas letras, ou use o teclado: letras digitam, **Enter** envia, **Backspace** apaga, **espaço** embaralha. Com **Tab** dá para chegar a qualquer botão (inclusive as letras), e Enter ou espaço acionam o botão que está com o foco. Depois de clicar ou tocar num botão, ou de digitar letras, Enter volta a enviar a palavra e espaço volta a embaralhar (spec 013). No celular, toques rápidos nas letras (inclusive repetindo a mesma) não viram zoom (spec 014).

## Acessibilidade (specs 007 e 015)
- Teclado: Tab chega a qualquer botão, inclusive as letras e a lista de palavras (que rola na vertical, com as setas e Page Down, e mostra a palavra nova sozinha); Enter e espaço acionam o botão que chegou por Tab. As janelas prendem o foco e devolvem ao fechar.
- Leitor de tela: página em português do Brasil, com região principal. A palavra digitada, o motivo da recusa e a palavra aceita são anunciados. Dicas são lidas como "Começa com RO, 4 letras"; o mapa é uma tabela com legenda e títulos ("Total", "nenhuma"); o nível é uma barra de progresso ("Ovo, 0 pontos. Faltam 5 pts para Larva"); o som é um botão ligado/desligado; no Relâmpago o jogo avisa "Faltam 30 segundos" e "Faltam 10 segundos".
- Nada depende só de cor: conquistas obtidas (✓), pangramas (★), dicas encontradas (✓, riscadas), palavras que faltaram (itálico e "não encontrada") e o desafio selecionado têm texto ou símbolo. Textos com contraste mínimo de 4,5:1 e bordas e barras de 3:1, nos temas claro e escuro.
- Celular (telas até 760 px): abas de modo, desafios do dia, ícones e links dos cartões com pelo menos 44 × 44 px. "Reduzir movimento" desliga animações e confete.

## Progresso salvo (spec 012)
- O progresso fica só no navegador: palavras e pontos de cada desafio do dia e do Livre, estatísticas e conquistas, tema, som, letras já vistas no Livre e palavras sugeridas.
- Se algo salvo estiver com defeito, o jogo abre normalmente, descarta só a parte com defeito (o que estava certo continua) e mostra "Progresso com defeito descartado". Progresso com letras que não formam nenhuma palavra é descartado: o Diário abre com as letras do dia e o Livre sorteia outro desafio.
- Palavra salva que saiu da lista de palavras some do progresso sem aviso.

## Medição de uso (spec 009)
- Só no site (https://yago-ananias.github.io/colmeia/), com o Umami: sem cookies, sem guardar IP e respeitando "Não rastrear" do navegador. O Artifact não mede nada.
- Conta visitas, de onde vêm e o aparelho, mais estes eventos do jogo: `partida` (modo, desafio, se veio de link, se retomou), `nivel`, `pangrama`, `completa`, `relampago-fim` (pontos), `dica`, `desistiu`, `compartilhar`, `sugestao` e `carregamento` (tempo de carregamento e tema).
- Nenhuma palavra digitada é enviada. Se o script for bloqueado, o jogo funciona igual.

## Monitoramento de erros (spec 010)
- Só no site. Se o jogo dá erro no navegador de alguém, vai um evento `erro` no Umami: tipo (erro, promessa ou armazenamento), a mensagem limpa com a função e a linha, se foi ao abrir ou jogando, e o modo.
- Progresso salvo com defeito (spec 012) vai como `armazenamento` com `DadoInvalido: <dado>` (por exemplo `stats` ou `diario`), nunca com o que estava salvo.
- Nunca vai endereço da página, texto entre aspas, link, e-mail, número longo nem palavra digitada. Cada erro vai uma vez por carregamento; no máximo 3 por carregamento e 10 por aparelho por dia.
- Erros de extensões do navegador e de scripts de fora são ignorados.
- Todo dia (07:41 de Brasília) um robô joga no site: ajuda, colmeia, desafios do dia, palavra aceita e recusada, tema, Relâmpago, ícones, tempo de carga e erros. Não conta visita no Umami. Se falhar, abre uma issue "Site com problema (verificação diária)" no repositório; quando volta, ela é fechada. A mesma verificação roda no site montado antes de cada publicação.
- O painel mostra a saúde no cartão "Saúde do jogo": site no ar (checado uma vez por dia), última verificação diária e erros dos jogadores.
