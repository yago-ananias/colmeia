# Plan: Compartilhar com link, Livre sem repetir e sugestão de palavra
- `ferramentas/data.py`: gera `DAYS` (programação, 3 por dia) e `LIVRE` no lugar de `PUZ`. Na primeira vez, os dias já publicados seguem a ordem antiga; depois, os dias até hoje+2 são lidos de `diarios.txt` e os seguintes são refeitos (sorteio fixo, sem repetir conjunto de letras no mesmo dia nem em 90 dias).
- `template.html`: `dailyCode` lê `DAYS`; `pickLivre`/`markSeen` guardam os conjuntos vistos (`colmeia:vistos`); `pickRich` usa `LIVRE`; diário salvo usa `saved.code`.
- `shareText()` + `share()` (Web Share no toque, depois área de transferência, depois janela); `fromLink()` lê `?c=`, `&m=relampago`, `&p=`.
- `toast(msg,big,word,sug)` mostra "Sugerir"/"Já sugerida"; `suggest()` abre janela com link para a issue; `colmeia:sugeridas` guarda o que foi sugerido.
