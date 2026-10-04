# Feature Specification: Colmeia, nova versão do Soletra

**Feature Branch**: `001-colmeia-nova-versao`

**Created**: 2026-10-02

**Status**: Implemented

**Input**: User description: "Fazer um jogo melhor e mais dinâmico que o Soletra do g1 (https://g1.globo.com/jogos/soletra/), com dark mode e com mais de 1 desafio por dia."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar os desafios do dia (Priority: P1)

O jogador abre o jogo e encontra três desafios do dia (Manhã, Tarde e Noite), iguais para todo
mundo. Em cada um ele forma palavras com as 7 letras da colmeia, sempre usando a letra central, e
vê sua pontuação, seu nível e as palavras encontradas.

**Why this priority**: É o coração do jogo e o que o Soletra original já oferece, agora com três
desafios por dia em vez de um.

**Independent Test**: Abrir o jogo, achar palavras válidas no desafio Manhã, trocar para Tarde e
voltar; o progresso de cada um deve estar preservado.

**Acceptance Scenarios**:

1. **Given** um desafio aberto, **When** o jogador envia uma palavra válida, **Then** ela entra na lista, os pontos sobem e aparece uma mensagem de acerto.
2. **Given** um desafio aberto, **When** o jogador envia uma palavra curta, sem a letra central, repetida ou fora da lista, **Then** aparece a mensagem do motivo e nada é contado.
3. **Given** o jogador digita "acao" e "ação" é válida, **When** envia, **Then** a palavra é aceita e exibida com acento.
4. **Given** progresso em Manhã, **When** o jogador troca para Tarde e volta, **Then** o progresso de Manhã continua igual.
5. **Given** o jogador fecha e reabre o jogo no mesmo dia, **When** a página carrega, **Then** o progresso dos três desafios é recuperado.

---

### User Story 2 - Modo escuro (Priority: P1)

O jogador joga no tema claro ou escuro. Por padrão o jogo segue o tema do aparelho, e um botão
troca o tema na hora; a escolha fica salva.

**Why this priority**: Pedido explícito do dono do projeto.

**Independent Test**: Abrir com o aparelho em modo escuro (jogo escuro), tocar no botão de tema
(jogo claro), recarregar (continua claro).

**Acceptance Scenarios**:

1. **Given** o aparelho em modo escuro e nenhuma escolha salva, **When** o jogo abre, **Then** ele aparece escuro.
2. **Given** qualquer tema, **When** o jogador toca no botão de tema, **Then** o jogo troca de tema sem perder o progresso.
3. **Given** uma escolha salva, **When** o jogo é reaberto, **Then** a escolha é respeitada.

---

### User Story 3 - Jogo mais dinâmico: combos e modo Relâmpago (Priority: P2)

O jogador ganha bônus ao acertar palavras em sequência (combo de até x5) e pode jogar o modo
Relâmpago: 75 segundos, cada acerto dá mais tempo, e o recorde fica salvo.

**Why this priority**: É o que torna o jogo "mais dinâmico" que o original.

**Independent Test**: Acertar duas palavras em menos de 12 segundos e ver o bônus; jogar uma
partida de Relâmpago até o tempo acabar e ver o resultado e o recorde.

**Acceptance Scenarios**:

1. **Given** um acerto recente (menos de 12 s), **When** o jogador acerta outra palavra, **Then** ela vale o dobro, depois o triplo, até x5.
2. **Given** o modo Relâmpago, **When** o tempo chega a zero, **Then** a partida termina e mostra pontos, palavras e recorde.
3. **Given** o modo Relâmpago e a aba fica oculta, **When** o jogador volta, **Then** o tempo não correu enquanto a aba estava oculta.

---

### User Story 4 - Ajuda quando trava (Priority: P2)

O jogador pode ver um mapa de quantas palavras faltam por letra inicial e tamanho, revelar o início
de até 3 palavras por desafio, ou ver todas as respostas.

**Why this priority**: Evita que o jogador desista frustrado.

**Independent Test**: Revelar uma dica, conferir que ela mostra as duas primeiras letras e o
tamanho, e que o contador de dicas diminui.

**Acceptance Scenarios**:

1. **Given** dicas disponíveis, **When** o jogador pede uma dica, **Then** aparecem as duas primeiras letras e o tamanho de uma palavra ainda não encontrada.
2. **Given** 3 dicas usadas, **When** o jogador pede outra, **Then** o botão fica desativado.
3. **Given** o jogador pede para ver as respostas, **When** confirma, **Then** as palavras que faltam aparecem marcadas.

---

### User Story 5 - Progresso e motivação (Priority: P3)

O jogador vê níveis de abelha (Ovo até Rainha), sequência de dias jogados, conquistas, pode jogar
desafios ilimitados no modo Livre e copiar o resultado para compartilhar.

**Why this priority**: Faz o jogador voltar todo dia, mas o jogo funciona sem isso.

**Independent Test**: Encontrar 5 palavras no diário e ver a sequência de dias subir para 1;
copiar o resultado e colar o texto.

**Acceptance Scenarios**:

1. **Given** pontos suficientes, **When** o jogador passa de nível, **Then** aparece um aviso com o novo nível.
2. **Given** o modo Livre, **When** o jogador pede um novo desafio, **Then** um desafio diferente é sorteado.

### Edge Cases

- A meia-noite passa com o jogo aberto: ao voltar para a aba, os desafios do novo dia são carregados.
- Armazenamento local bloqueado (aba anônima): o jogo funciona, só não guarda o progresso.
- O jogador digita uma letra que não está na colmeia: a palavra treme e a letra não entra.
- O jogador encontra todas as palavras: aparece a celebração de colmeia completa.
- Tela estreita (360 px): nada transborda para os lados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O jogo MUST validar palavras pela regra do Soletra (7 letras, letra central obrigatória, mínimo de 4 letras, letras repetíveis, acentos ignorados).
- **FR-002**: O jogo MUST oferecer três desafios diários diferentes, iguais para todos os jogadores no mesmo dia.
- **FR-003**: O jogo MUST salvar o progresso de cada desafio diário separadamente.
- **FR-004**: O jogo MUST ter tema claro e escuro, seguir o tema do aparelho por padrão e permitir trocar manualmente, salvando a escolha.
- **FR-005**: O jogo MUST pontuar 1 ponto para palavras de 4 letras, 1 ponto por letra nas maiores e 7 pontos extras por pangrama.
- **FR-006**: O jogo MUST dar bônus de combo para acertos com menos de 12 segundos de intervalo, até x5.
- **FR-007**: O jogo MUST ter o modo Relâmpago (75 s iniciais, tempo extra por acerto, recorde salvo, relógio pausado com a aba oculta).
- **FR-008**: O jogo MUST ter o modo Livre com desafios sorteados sem limite.
- **FR-009**: O jogo MUST oferecer mapa de dicas, até 3 revelações por desafio (no Relâmpago custam 5 s) e a opção de ver as respostas.
- **FR-010**: O jogo MUST mostrar nível, pontos, palavras encontradas, sequência de dias e conquistas.
- **FR-011**: O jogo MUST aceitar toque, mouse e teclado (letras, Enter, Backspace, espaço para embaralhar).
- **FR-012**: O jogo MUST carregar os desafios do novo dia quando a data muda com o jogo aberto.
- **FR-013**: O jogo MUST permitir copiar um resumo do resultado em texto.

### Key Entities

- **Desafio**: 7 letras, uma delas central; lista de palavras válidas, pangramas e pontuação máxima.
- **Progresso**: palavras encontradas, bônus de combo, dicas usadas, se o jogador viu as respostas; um por desafio diário e um para o modo Livre.
- **Estatísticas do jogador**: sequência de dias, recorde do Relâmpago, total de pangramas, conquistas, tema e som.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um jogador novo envia a primeira palavra válida em menos de 1 minuto sem ler instruções.
- **SC-002**: 100% dos desafios disponíveis têm entre 22 e 65 palavras e pelo menos um pangrama. *(Desde a spec 008/016: vale para o Livre e para os dias futuros; dias já publicados ficam fixos e só precisam de pangrama e 15 palavras ou mais.)*
- **SC-003**: O jogo abre e fica jogável em menos de 2 segundos numa conexão comum.
- **SC-004**: Nenhuma rolagem lateral em telas de 360 px a 1440 px, nos dois temas.
- **SC-005**: Progresso dos três desafios diários é recuperado em 100% das reaberturas no mesmo dia, no mesmo navegador.

## Assumptions

- "Mais de 1 desafio por dia" foi interpretado como três desafios diários fixos (Manhã, Tarde e Noite), todos liberados desde a meia-noite, mais o modo Livre ilimitado.
- O dia muda à meia-noite no horário do aparelho do jogador.
- O jogo roda no navegador (computador e celular); app nativo está fora do escopo desta versão.
- Não há contas nem placar online; tudo fica no navegador do jogador.
- O nome "Colmeia" substitui "Soletra" para não usar a marca do g1.

## Regras base documentadas depois (spec 016)

Regras que o jogo já seguia desde a 001 e que só estavam no código e em `REGRAS.md`. Nada muda para o jogador; este é o registro de especificação. Os números foram conferidos em `template.html`.

- **FR-014 (níveis)**: o nível é a fração dos pontos das palavras sobre a pontuação máxima do desafio (só as palavras do desafio): Ovo 0%, Larva 3%, Pupa 8%, Operária 15%, Exploradora 25%, Guardiã 40%, Rainha 60%; "Colmeia completa" com todas as palavras do desafio.
- **FR-015 (combo e nível)**: no Diário e no Livre o bônus de combo aparece separado ("+N combo") e não conta para o nível. No Relâmpago ele soma na pontuação final. O bônus é `pontos da palavra × (combo − 1)`, com combo x2 a x5.
- **FR-016 (Relâmpago, tempo)**: começa com 75 s. Cada acerto soma 2 s por letra (no máximo 14 s) e o pangrama soma 12 s. Cada dica custa 5 s e só pode ser pedida com mais de 6 s no relógio. O relógio para com a aba oculta e com qualquer janela aberta.
- **FR-017 (Relâmpago, desafio)**: o desafio sorteado vem do `LIVRE` e tem pelo menos 35 palavras (`pickRich`).
- **FR-018 (conquistas)**: sete conquistas: Primeiro pangrama, Combo x5, Virou Rainha, 100 pts no Relâmpago, 3 dias seguidos, Guardiã sem dicas (chegar a Guardiã sem dicas e sem ver respostas) e Colmeia completa.
- **FR-019 (sequência de dias)**: o dia conta quando o jogador acha 5 palavras do desafio em um desafio diário; palavras extras (spec 011) não contam; pular um dia zera a sequência.
