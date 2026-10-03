# Plan: Preposições, conjunções e termos técnicos valem
- `ferramentas/ud_stats.py`: ADP, CCONJ e SCONJ passam a contar como `ok`; PRON e DET continuam `f`. `montar.sh` refaz `ud.json` quando `ud_stats.py` muda.
- `ferramentas/funcionais.txt`: blocos `[f]`, `[ok]` e `[p]`; `build.py` lê com `blocos()`. `[ok]` entra junto com `permitidas.txt` (sempre valem, com acento: após, porém, senão).
- `ferramentas/build.py`: depois da lista principal, monta `extras.json` com as candidatas de `ptwiki.txt` e `freq_full.txt` (baixadas por `montar.sh`), filtradas por `extra_ok()` (Hunspell, treebanks, plurais, formas de verbo, `LATIM`, `OFENSIVA`, nomes).
- `ferramentas/data.py`: `EXTRA` (só as que cabem em algum desafio de `DAYS` ou `LIVRE`, pelos subconjuntos das 7 letras com a central) e as formas com acento delas em `DISP`.
- `template.html`: `EXTRAS`; `S.extra` salvo com o progresso; `submit()` aceita extra ("Palavra extra! +N"), "Já encontrada" vale para extras, a conclusão só conta palavras do desafio; `base()` soma as extras; lista com etiqueta "extra" e título "+N extras"; compartilhar e fim do Relâmpago mostram as extras; aviso de pronome e ajuda atualizados.
- Listas de regressão: `deve_valer.txt` (preposições e conjunções), `nao_deve_valer.txt` (só pronomes; ofensas, latim, plurais e verbos que não podem virar extra), `termos_tecnicos.txt` (novo).
