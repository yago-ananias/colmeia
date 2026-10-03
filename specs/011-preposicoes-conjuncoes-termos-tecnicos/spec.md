# Feature Specification: Preposições, conjunções e termos técnicos valem

**Feature Branch**: `011-preposicoes-conjuncoes-termos-tecnicos`
**Created**: 2026-10-03
**Status**: Implemented
**Input**: YAGO (03/10/2026): "Alterações: hoje não são válidas preposições, conjunções e termos técnicos. Gerar uma correção para ser aceito essas 3. Tornar válidos preposições, conjunções e termos técnicos no jogo". No cartão de decisão, YAGO escolheu "Palavra extra" para os termos técnicos.

## User Story 1 - Preposições e conjunções valem (P1)
O jogador digita *para*, *porque*, *quando*, *embora*, *sobre*, *após* ou *porém* e a palavra vale como qualquer outra: entra nas respostas do desafio, conta para completar a colmeia e aparece em "Ver respostas". Contrações de preposição com artigo ou advérbio também valem (*pelo*, *pela*, *numa*, *daqui*); os plurais delas não (*pelos*: "Plural não vale").

**Acceptance**: preposições e conjunções estão na lista principal; pronomes e contrações com pronome (*eles*, *você*, *isso*, *dele*, *neste*) continuam recusados com "Pronomes não valem".

## User Story 2 - Termos técnicos valem como palavra extra (P1)
O jogador digita um termo técnico ou uma palavra menos comum que o dicionário conhece (*sinapse*, *entalpia*, *usucapião*, *bissetriz*) e o jogo aceita como **palavra extra**: "Palavra extra! +N". Ela soma pontos (com combo e, no Relâmpago, tempo), aparece na lista com a etiqueta "extra" e é guardada com o progresso. Não conta para a contagem de palavras do desafio, para "Colmeia completa" nem para "Ver respostas", e não aparece nas dicas.

**Acceptance**: a extra soma os pontos da palavra; a contagem "N de M palavras" não muda e o título mostra "+1 extra"; digitar de novo dá "Já encontrada"; recarregar a página mantém a extra.

## Requirements
- **FR-001**: Preposições (ADP) e conjunções (CCONJ, SCONJ) dos treebanks UD contam como palavra comum; pronomes e determinantes continuam de fora.
- **FR-002**: `funcionais.txt` tem blocos: `[f]` pronomes (recusa "Pronomes não valem"), `[ok]` preposições e conjunções que sempre valem, `[p]` plurais de contrações.
- **FR-003**: As extras vêm da Wikipédia em português (20+ ocorrências) e das legendas (lista completa, 5+), passam pelo Hunspell pt_BR em minúscula e seguem as regras do jogo: sem plural, verbo conjugado, nome próprio, estrangeirismo, nome científico em latim, pronome ou palavrão.
- **FR-004**: Nenhuma extra é resposta de desafio, nem está nas recusadas; o jogo só leva as que cabem em algum desafio (diário ou Livre).
- **FR-005**: Pontos da extra seguem a tabela normal (inclusive bônus de palavra longa e de 7 letras); elas contam para o nível.
- **FR-006**: Compartilhar mostra "+N extras" quando houver. Nenhuma palavra vai para a medição de uso.

## Success Criteria
- **SC-001**: `test.js` cobre as duas histórias e passa; `diagnostico.py` confere `termos_tecnicos.txt` (devem valer, na lista ou como extra) e que nada de `nao_deve_valer.txt` virou extra.
- **SC-002**: A página continua com menos de 1 MB.
- **SC-003**: Diários de 02/10/2026 continuam `obeilrs, dceiort, caeintv`.

## Assumptions
- Pronomes continuam de fora (padrão combinado; YAGO pediu preposições, conjunções e termos técnicos).
- A lista extra é automática e grande; alguma palavra rara ou estranha pode passar. Como ela só vale quando alguém digita, o risco é baixo. Ofensas conhecidas são barradas.
