# Gera data.js: lista de palavras (WORDS, DISP), palavras extras (EXTRA, spec 011), recusas com motivo (REJ) e os desafios.
# Desafios: DAYS é a programação dos diários (3 por dia, a partir de 01/10/2026) e LIVRE os do Livre e do Relâmpago.
# Os dois grupos nunca têm o mesmo conjunto de letras, então o Livre não mostra um diário (nem de outro dia).
# A programação fica em diarios.txt: os dias que já foram ao ar (até depois de amanhã, por causa dos fusos)
# nunca mudam, mesmo que a lista de palavras mude. Os dias seguintes são refeitos a cada montagem.
import json, random, os, datetime, hashlib
here=os.path.dirname(os.path.abspath(__file__))
SCHED=os.path.join(here,'diarios.txt')
EPOCH=datetime.date(2026,10,1); DAILY=3; WINDOW=90   # mesmo conjunto de letras só volta depois de 90 dias

out=json.load(open('words.json',encoding='utf8'))
words=sorted(out)
def mask(w):
    m=0
    for ch in set(w): m|=1<<(ord(ch)-97)
    return m
masks={w:mask(w) for w in words}
seen=set(); puz=[]
for w in words:
    if len(set(w))!=7: continue
    M=masks[w]
    if M in seen: continue
    seen.add(M)
    letters=sorted(set(w))
    for c in letters:
        cb=1<<(ord(c)-97)
        v=[x for x in words if masks[x]&~M==0 and masks[x]&cb]
        if 22<=len(v)<=65:
            puz.append(c+''.join(l for l in letters if l!=c))
random.seed(20261002); random.shuffle(puz)
key=lambda code: ''.join(sorted(code))
# 60% dos conjuntos de letras vão para os diários e 40% para o Livre; o hash não muda quando a lista muda
diario_set=lambda k: int(hashlib.md5(k.encode()).hexdigest(),16)%10<6

today=(datetime.datetime.now(datetime.timezone.utc).date()-EPOCH).days+1
fixed_days=today+2
if os.path.exists(SCHED):
    days=[l.split()[1:] for l in open(SCHED,encoding='utf8') if l.strip() and not l.startswith('#')]
else:
    # primeira vez: os dias já publicados seguem a ordem antiga (PUZ em sequência)
    days=[puz[d*DAILY:(d+1)*DAILY] for d in range(fixed_days)]
days=days[:fixed_days]
for d,codes in enumerate(days):
    if len(codes)!=DAILY: raise SystemExit(f'diarios.txt: dia {d+1} com {len(codes)} desafios')
used=[c for codes in days for c in codes]
fixed_sets={key(c) for c in used}
pool=[c for c in puz if (diario_set(key(c)) or key(c) in fixed_sets) and c not in used]
livre=[c for c in puz if not diario_set(key(c)) and key(c) not in fixed_sets]
# próximos dias: ordem sorteada, sem repetir conjunto de letras no mesmo dia nem dentro da janela;
# no fim da lista, quando não sobra opção, vale o conjunto que está há mais tempo sem aparecer
last={key(c):i for i,c in enumerate(used)}
rest=pool[:]; future=[]
while rest:
    slot=len(used)+len(future); today_sets={key(x) for x in future[len(future)-len(future)%DAILY:]}
    best=None; best_gap=-1
    for j,c in enumerate(rest):
        k=key(c)
        if k in today_sets: continue
        gap=slot-last.get(k,-10**9)
        if gap>=WINDOW*DAILY: best=j; break
        if gap>best_gap: best,best_gap=j,gap
    if best is None: best=0
    c=rest.pop(best); future.append(c); last[key(c)]=slot
future=future[:len(future)-len(future)%DAILY]
days+= [future[i:i+DAILY] for i in range(0,len(future),DAILY)]
with open(SCHED,'w',encoding='utf8') as f:
    f.write('# Programação dos desafios diários (Manhã, Tarde, Noite). Gerado por data.py; os dias até depois de amanhã nunca mudam.\n')
    for d,codes in enumerate(days): f.write(f"{EPOCH+datetime.timedelta(days=d)} {' '.join(codes)}\n")
flat=[c for codes in days for c in codes]
assert not {key(c) for c in flat}&{key(c) for c in livre}, 'diário e Livre com o mesmo conjunto de letras'

disp={n:d for n,d in out.items() if n!=d}
rej=json.load(open('rejected.json',encoding='utf8'))
# palavras extras (spec 011): termos técnicos e palavras raras que valem e pontuam, mas não são respostas dos desafios.
# Só entram as que cabem em algum desafio (todas as letras no desafio, com a letra central).
extras=json.load(open('extras.json',encoding='utf8')) if os.path.exists('extras.json') else {}
cabe=set()
for code in set(flat)|set(livre):
    M=mask(code); cb=1<<(ord(code[0])-97); s=M
    while s:                                   # todos os subconjuntos das 7 letras
        if s&cb: cabe.add(s)
        s=(s-1)&M
extra=sorted(n for n in extras if n not in out and n not in rej and mask(n) in cabe)
disp.update({n:extras[n] for n in extra if extras[n]!=n})
print(len(words),'palavras;',len(extra),'extras;',len(days),'dias de diários;',len(livre),'desafios no Livre;',len(disp),'com acento')
js="const WORDS="+json.dumps(','.join(words))+".split(',');\nconst DISP="+json.dumps(disp,ensure_ascii=False,separators=(',',':'))+";\n"
js+="const EXTRA="+json.dumps(','.join(extra))+".split(',');\n"
js+="const DAYS="+json.dumps(','.join(flat))+".split(',');\nconst LIVRE="+json.dumps(','.join(livre))+".split(',');\n"
js+="const REJ={};"+"".join(f"{json.dumps(','.join(sorted(k for k,v in rej.items() if v==t)))}.split(',').forEach(w=>REJ[w]='{t}');" for t in 'pvf')+"\n"
open('data.js','w',encoding='utf8').write(js)
print(len(js.encode()))
