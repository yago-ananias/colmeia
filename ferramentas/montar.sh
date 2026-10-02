#!/bin/sh
# Gera colmeia.html a partir de template.html + lista de palavras e desafios.
# Uso: sh ferramentas/montar.sh   (de dentro de /mnt/project-files/soletra)
set -e
cd "$(dirname "$0")"
mkdir -p .cache && cd .cache
[ -s palavras.txt ] || curl -sSL -o palavras.txt https://raw.githubusercontent.com/pythonprobr/palavras/master/palavras.txt
[ -s freq.txt ] || curl -sSL -o freq.txt https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/pt_br/pt_br_50k.txt
[ -s nomes.csv ] || curl -sSL -o nomes.csv https://raw.githubusercontent.com/datasets-br/prenomes/master/data/nomes-censos-ibge.csv
[ -s pt_BR.aff ] || curl -sSL -o pt_BR.aff https://raw.githubusercontent.com/LibreOffice/dictionaries/master/pt_BR/pt_BR.aff
[ -s pt_BR.dic ] || curl -sSL -o pt_BR.dic https://raw.githubusercontent.com/LibreOffice/dictionaries/master/pt_BR/pt_BR.dic
if [ ! -d ud ]; then mkdir -p ud
  for tb in Bosque:bosque GSD:gsd PetroGold:petrogold Porttinari:porttinari CINTIL:cintil; do n=${tb%%:*}; s=${tb##*:}
    for sp in train dev test; do curl -sfSL -o ud/pt_$s-$sp.conllu https://raw.githubusercontent.com/UniversalDependencies/UD_Portuguese-$n/master/pt_$s-ud-$sp.conllu || rm -f ud/pt_$s-$sp.conllu; done; done
fi
[ -s ud.json ] || python3 ../ud_stats.py
python3 -c 'import spylls, simplemma' 2>/dev/null || python3 -m pip install -q spylls simplemma
python3 ../build.py
python3 ../listas/diagnostico.py . >/dev/null || { echo 'Lista de palavras reprovada: rode python3 ferramentas/listas/diagnostico.py'; exit 1; }
python3 ../data.py
python3 - <<'PY'
t=open('../../template.html',encoding='utf8').read()
d=open('data.js',encoding='utf8').read()
open('../../colmeia.html','w',encoding='utf8').write(t.replace('/*__DATA__*/',d))
print('colmeia.html gerado')
PY
