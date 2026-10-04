# Plan: Compartilhar com link, Livre sem repetir e sugestão de palavra
- `ferramentas/data.py`: gera `DAYS` (programação, 3 por dia) e `LIVRE` no lugar de `PUZ`. Na primeira vez, os dias já publicados seguem a ordem antiga; depois, os dias até hoje+2 são lidos de `diarios.txt` e os seguintes são refeitos (sorteio fixo, sem repetir conjunto de letras no mesmo dia nem em 90 dias).
- `template.html`: `dailyCode` lê `DAYS`; `pickLivre`/`markSeen` guardam os conjuntos vistos (`colmeia:vistos`); `pickRich` usa `LIVRE`; diário salvo usa `saved.code`.
- `shareText()` + `share()` (Web Share no toque, depois área de transferência, depois janela); `fromLink()` lê `?c=`, `&m=relampago`, `&p=`.
- `toast(msg,big,word,sug)` mostra "Sugerir"/"Já sugerida"; `suggest()` abre janela com link para a issue; `colmeia:sugeridas` guarda o que foi sugerido.

## Constitution Check

> Verificação feita depois, na spec 016 (auditoria do Spec Kit de 04/10/2026), contra a constituição v1.2.1.

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: Livre e links não mudam o que vale como palavra | ✅ |
| II. Português: texto do resultado e avisos em português | ✅ |
| III. Um arquivo: o link e a sugestão só abrem endereços de fora quando o jogador toca; o jogo roda offline do mesmo jeito. Dias publicados ficam fixos (`diarios.txt`) | ✅ |
| IV. Dinâmico e acessível: compartilhar usa o menu do celular quando existe | ✅ |
| V. Testado: 13 testes novos; a regra de 22 a 65 palavras e os dias já publicados estão no FR-007 e no teste (spec 016) | ✅ |
