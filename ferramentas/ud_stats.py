# Conta, para cada palavra (minúscula), como ela aparece nos treebanks UD do português.
# Saída: ud.json {forma: {ok, p, v, n, f, cap}}
#   ok = substantivo/adjetivo no singular, verbo no infinitivo, particípio singular, advérbio, numeral
#   p = plural · v = verbo conjugado/gerúndio · n = nome próprio · f = pronome ou determinante · cap = vezes com inicial maiúscula fora do início da frase
#   (preposições e conjunções contam como ok desde a spec 011)
import glob, json, collections
st=collections.defaultdict(lambda: collections.Counter())
for fn in glob.glob('ud/*.conllu'):
    first=True
    for line in open(fn,encoding='utf8'):
        if not line.strip(): first=True; continue
        if line.startswith('#'): continue
        c=line.split('\t')
        if '-' in c[0] or '.' in c[0]: continue
        form,lemma,upos,feats=c[1],c[2].lower(),c[3],c[5]
        w=form.lower()
        if not w.isalpha(): first=False; continue
        F=dict(x.split('=',1) for x in feats.split('|') if '=' in x)
        s=st[w]
        if form[0].isupper() and not first: s['cap']+=1
        first=False
        if upos=='PROPN': s['n']+=1
        elif upos in ('PRON','DET'): s['f']+=1          # pronomes e determinantes: não valem
        elif upos in ('ADP','CCONJ','SCONJ'): s['ok']+=1  # preposições e conjunções: valem desde a spec 011
        elif upos in ('VERB','AUX'):
            vf=F.get('VerbForm') or ('Inf' if w==lemma else 'Fin')   # sem anotação (GSD): compara com o lema
            if vf=='Inf': s['ok']+=1
            elif vf=='Part': s['p' if F.get('Number')=='Plur' else 'ok']+=1
            else: s['v']+=1
        elif upos in ('NOUN','ADJ','NUM'):
            num=F.get('Number') or ('Plur' if w!=lemma and w.endswith('s') and not lemma.endswith('s') else 'Sing')
            s['p' if num=='Plur' else 'ok']+=1
        elif upos=='ADV': s['ok']+=1
        else: s['x']+=1
json.dump(st,open('ud.json','w',encoding='utf8'),ensure_ascii=False)
print(len(st))
