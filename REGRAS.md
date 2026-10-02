# Regras da Colmeia

Tudo abaixo vem do código do jogo (`template.html`).

## Como formar palavras
- A colmeia tem 7 letras diferentes. A do meio é a **letra central**.
- Toda palavra precisa ter **4 letras ou mais** e **usar a letra central**.
- Só valem as letras da colmeia, e cada uma pode se repetir quantas vezes quiser.
- Acentos e cedilha não importam: digite `acao` para "ação". A palavra aparece com acento na lista.
- A palavra precisa estar na lista do jogo (cerca de 11.500 palavras comuns do português).
- **Plurais não valem**: *laranja* vale, *laranjas* não. Palavras que já terminam em "s" no singular (*lápis*, *ônibus*) valem.
- **Verbos só no infinitivo**: *correr* vale, *correu* e *corri* não.
- **Masculino e feminino valem**: *aluno* e *aluna*, *leão* e *leoa*.
- **Ficam de fora**: pronomes, preposições, conjunções (e contrações como *pelo*, *neste*), nomes próprios, estrangeirismos, palavrões e termos técnicos ou científicos.
- Palavra repetida não conta de novo.
- Mensagens de erro: "Muito curta", "Falta a letra central", "Já encontrada", "Plural não vale", "Só verbos no infinitivo", "Pronomes, preposições e conjunções não valem", "Não está na lista". Letra fora da colmeia nem entra (a palavra treme).
- **Pangrama** é a palavra que usa as 7 letras. Todo desafio tem pelo menos um.
- Cada desafio tem entre 22 e 65 palavras.

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
O nível é calculado só com os pontos das palavras, como fração da pontuação máxima do desafio:

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
- **Relâmpago:** desafio sorteado com pelo menos 35 palavras. Começa com **75 segundos**. Cada acerto dá **2 segundos por letra** (no máximo 14) e o pangrama dá **12 segundos**. Pontuação = pontos das palavras + bônus de combo. O recorde fica salvo. O relógio para se você trocar de aba ou abrir qualquer janela (como a ajuda). Trocar de modo no meio da partida pede confirmação.
- **Livre:** desafios sorteados sem limite. O botão "Novo desafio" troca de desafio.

## Dicas
- **Mapa de dicas** (grátis): tabela com quantas palavras faltam por letra inicial e tamanho.
- **Revelar início de palavra:** mostra as 2 primeiras letras e o tamanho de uma palavra que falta. No Diário e no Livre são **3 por desafio**. No Relâmpago não há limite, mas cada uma custa **5 segundos** e só pode ser pedida com mais de 6 segundos no relógio.
- **Ver respostas** (Diário e Livre): mostra todas as palavras que faltam. Depois disso o desafio não aceita mais palavras e as dicas ficam desativadas.

## Sequência e conquistas
- **Dias seguidos:** o dia conta quando você acha 5 palavras em um desafio diário. Pular um dia zera a sequência.
- **Conquistas:** Primeiro pangrama, Combo x5, Virou Rainha, 100 pts no Relâmpago, 3 dias seguidos, Guardiã sem dicas (chegar a Guardiã sem dicas e sem ver respostas) e Colmeia completa.

## Controles
Toque ou clique nas letras, ou use o teclado: letras digitam, **Enter** envia, **Backspace** apaga, **espaço** embaralha. Com **Tab** dá para chegar a qualquer botão (inclusive as letras), e Enter ou espaço acionam o botão que está com o foco.
