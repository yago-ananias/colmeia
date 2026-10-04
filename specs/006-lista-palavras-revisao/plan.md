# Plan: Lista de palavras revisada
Portar para `ferramentas/build.py` os ajustes de `revisoes/lista/build_sugerido.py` mantendo o que a versão atual já tinha (`permitidas.txt`, nomes do IBGE só barram sem uso comum nos treebanks). Corrigir a blocklist (`bale` barrava *balé*, `bufe` barrava *bufê*), somar `blocklist_acrescimos.txt` e mais nomes, lugares, estrangeirismos e verbos conjugados vistos nas ~1.460 palavras novas. Copiar listas e `diagnostico.py` para `ferramentas/listas/`, chamar no `montar.sh` e no `test.js`.

## Constitution Check

> Verificação feita depois, na spec 016 (auditoria do Spec Kit de 04/10/2026), contra a constituição v1.2.1.

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: só a lista muda; as regras de validade da 002 seguem iguais | ✅ |
| II. Português de verdade: é o objetivo da spec (menos palavras estranhas) | ✅ |
| III. Um arquivo: lista continua embutida; página abaixo de 1 MB | ✅ |
| IV. Dinâmico e acessível: sem mudança de tela | n/a |
| V. Testado: `listas/diagnostico.py` roda em toda montagem e no `test.js` (todas as palavras de `deve_valer.txt` valem e nenhuma de `nao_deve_valer.txt` vale; eram 285 e 252 na spec 006) | ✅ |
