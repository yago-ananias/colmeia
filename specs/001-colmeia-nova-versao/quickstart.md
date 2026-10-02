# Quickstart: Colmeia

```bash
cd /mnt/project-files/soletra
sh ferramentas/montar.sh      # gera colmeia.html a partir de template.html + dados
node ferramentas/test.js      # roda os testes (precisa passar antes de publicar)
```

Depois, publique `colmeia.html` no mesmo link do Artifact:
https://claude.ai/artifact/4s2oJ1ruW5LiHzdiabngvk

Para remover uma palavra estranha: adicione-a (sem acento) em `ferramentas/blocklist.txt` e rode `montar.sh` de novo.
