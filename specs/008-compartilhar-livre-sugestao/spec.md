# Feature Specification: Compartilhar com link, Livre sem repetir e sugestão de palavra

**Feature Branch**: `008-compartilhar-livre-sugestao`
**Created**: 2026-10-02
**Status**: Implemented
**Input**: Oportunidades 5, 6 e 9 de `/mnt/project-files/revisoes/revisao-colmeia-2026-10-02.md` (padrão recomendado para "próximo?" de YAGO; ele ainda pode escolher acessibilidade 7 a 14).

## User Story 1 - Compartilhar o resultado com link (P1)
O jogador toca em "Compartilhar" e recebe um texto com o nível, uma grade de 7 casas (uma por nível), ⭐ por pangrama e um link. Quem abre o link joga as mesmas letras: no Diário, se for um desafio de hoje; no Livre, se for outro. No Relâmpago, o link desafia o amigo a bater a pontuação.

**Acceptance**: o texto copiado tem `?c=<letras>`; abrir esse link mostra a mesma colmeia (mesma letra central); link do Relâmpago mostra os pontos a bater e só começa o relógio quando a janela fecha; link inválido abre o jogo normal.

## User Story 2 - Livre sem repetir (P1)
O Livre nunca mostra as letras de um desafio diário (de hoje, de outro dia ou do futuro) e não repete um conjunto de letras que o jogador já jogou no Livre, até acabarem todos.

## User Story 3 - Sugerir palavra que falta (P2)
Quando o jogo recusa uma palavra de 4 letras ou mais com a letra central (fora da lista, plural, verbo ou pronome), aparece "Sugerir". O botão abre uma sugestão pronta no GitHub do jogo; depois disso a palavra aparece como "Já sugerida" no aparelho.

## Requirements
- **FR-001**: A programação dos diários fica em `ferramentas/diarios.txt`; dias que já foram ao ar (até depois de amanhã, em UTC) nunca mudam, mesmo que a lista de palavras mude.
- **FR-002**: Conjuntos de letras são divididos de forma estável (hash) entre diários (60%) e Livre/Relâmpago (40%); os dois grupos não têm conjunto em comum.
- **FR-003**: Diário em andamento continua com as letras salvas, se a programação mudar por qualquer motivo.
- **FR-004**: Compartilhar usa o menu do celular quando existe; senão copia; se nada funcionar, mostra o texto para copiar.
- **FR-005**: O link aponta para o site (https://yago-ananias.github.io/colmeia/).
- **FR-006**: A sugestão abre `github.com/yago-ananias/colmeia/issues/new` com título "Sugestão de palavra: <palavra>" e o motivo da recusa.
- **FR-007** (registrado na spec 016): a regra "22 a 65 palavras e pelo menos um pangrama" da constituição vale para o Livre e para os dias futuros. Os dias já publicados ficam fixos (FR-001) e só precisam ter pangrama e 15 palavras ou mais, sem máximo: uma mudança na lista de palavras não pode alterar um dia que os jogadores já viram. `test.js` confere as duas regras em separado e informa quantos dias publicados saíram da faixa 22 a 65 (hoje, nenhum).

## Success Criteria
- **SC-001**: `test.js` cobre as três histórias e passa.
- **SC-002**: Diários de 02/10/2026 continuam `obeilrs, dceiort, caeintv`.

## Assumptions
- Sugestões vão para issues do GitHub (repositório público, issues ligadas). Quem sugere precisa de conta no GitHub. Alternativa sem conta (formulário) fica para depois, se YAGO quiser.
