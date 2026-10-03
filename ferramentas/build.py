# Monta words.json (palavras válidas) e rejected.json (formas recusadas com motivo).
# Regras de validade iguais às do Soletra do g1:
#   - só verbos no infinitivo (formas conjugadas saem)
#   - sem plurais
#   - masculino e feminino valem (aluno e aluna)
#   - sem pronomes, palavrões, nomes próprios e estrangeirismos (preposições e conjunções valem desde a spec 011)
# Também monta extras.json (spec 011): termos técnicos, científicos e palavras raras que o dicionário conhece.
# Elas valem e pontuam no jogo, mas não entram nas respostas dos desafios.
# Classificação: 1º pelos treebanks UD do português (como a palavra aparece em textos anotados, ver ud_stats.py);
# 2º, para palavras que não aparecem lá, pelo lematizador simplemma + dicionários.
import unicodedata, json, re, csv, os, collections
import simplemma, functools
from spylls.hunspell import Dictionary
HUN=Dictionary.from_files('pt_BR')
@functools.lru_cache(maxsize=None)
def known(w):
    """O Hunspell aceita a palavra em minúscula (inclui formas derivadas: sonho, garota, sistema)."""
    return w in dic or HUN.lookup(w)
VERBO=re.compile(r'(ar|er|ir|or|ôr|pôr)$')
FORMA_VERBAL=re.compile(r'(ando|endo|indo|ondo|aram|eram|iram|avam|ávamos|íamos|ou|amos|emos|imos|asse|esse|isse|arei|erei|irei|ará|erá|irá|ava|iam|em|am)$')
@functools.lru_cache(maxsize=None)
def hun_ok(w):
    """Aceita palavra que não está em palavras.txt se o Hunspell a conhece e ela não é só uma forma
    conjugada de um verbo usado (sistema ← sistemar e garota ← garotar passam; sossega ← sossegar não)."""
    if w in dic or VERBO.search(w): return w in dic or HUN.lookup(w)
    if not HUN.lookup(w): return False
    stems=[f.stem for f in HUN.lookuper.good_forms(w)]
    if any(st==w or not VERBO.search(st) for st in stems): return True
    # só aparece como forma de verbo: vale se ninguém usa o verbo e a terminação não é típica de verbo
    if FORMA_VERBAL.search(w): return False
    return not any(st in freqset for st in stems)
@functools.lru_cache(maxsize=None)
def is_proper(w):
    """Só existe com inicial maiúscula (Henry, Dresden)."""
    return not known(w) and HUN.lookup(w.capitalize())
here=os.path.dirname(os.path.abspath(__file__))
dic=set(l.strip() for l in open('palavras.txt',encoding='utf8'))
ud=json.load(open('ud.json',encoding='utf8'))
# Hunspell pt_BR: radicais em minúscula (palavras comuns) e em maiúscula (nomes próprios)
hun_low=set(); hun_cap=set()
for l in open('pt_BR.dic',encoding='utf-8-sig'):
    st=l.split('/')[0].strip()
    if not st.isalpha(): continue
    (hun_cap if st[0].isupper() else hun_low).add(st.lower() if st[0].isupper() else st)
proper=hun_cap-hun_low
dic|=hun_low
def norm(w):
    return ''.join(c for c in unicodedata.normalize('NFD',w) if unicodedata.category(c)!='Mn')
def wordsfile(name):
    return set(w for l in open(os.path.join(here,name),encoding='utf8') if not l.startswith('#') for w in l.split())
block=set("""porra caralho merda puta puto putas putos foda foder fodase fodido fodidos cuzao bosta buceta boceta piroca pinto viado viadinho bicha vadia vagabunda vagabundo xoxota rola cacete punheta transar transa trepar safado safada otario otaria babaca cretino corno cornos pentelho bunda bundas peitos tesao gozar gozou""".split())
block|=wordsfile('blocklist.txt')
# os 4000 prenomes mais comuns do Brasil (IBGE), menos os que também são palavras comuns
rows=list(csv.reader(open('nomes.csv',encoding='utf8')))[1:]
rows.sort(key=lambda r:-sum(int(x or 0) for x in r[1:]))
names={norm(r[0]).lower() for r in rows[:4000]}-wordsfile('nomes_comuns_ok.txt')   # só barra quando os textos não mostram uso comum
def blocos(name):
    """Lê um arquivo com blocos "# [x] título" e devolve {x: palavras}."""
    b=collections.defaultdict(set); cur=None
    for l in open(os.path.join(here,name),encoding='utf8'):
        m=re.match(r'#\s*\[(\w+)\]',l)
        if m: cur=m.group(1); continue
        if not l.startswith('#') and cur: b[cur].update(l.split())
    return b
fb=blocos('funcionais.txt')
func={norm(w) for w in fb['f']}                  # pronomes: "Pronomes não valem"
func_plural={norm(w) for w in fb['p']}           # pelos, pelas, numas...: "Plural não vale"
allow=wordsfile('nomes_comuns_ok.txt')
force=wordsfile('permitidas.txt')|fb['ok']   # sempre valem: correções manuais, preposições e conjunções
force_n={norm(w):w for w in force}             # comparado sem acento; a palavra aparece como está escrita no arquivo

def singular_known(w):
    """w termina em s e alguma forma de singular existe no dicionário (casas→casa, vagens→vagem, cascavéis→cascavel)."""
    if not w.endswith('s'): return False
    c=[w[:-1]]
    if w.endswith('es'): c.append(w[:-2])
    if w.endswith('ns'): c.append(w[:-2]+'m')
    if w.endswith(('ões','ães')): c.append(w[:-3]+'ão')
    for a,b in (('éis','el'),('eis','el'),('ais','al'),('óis','ol'),('uis','ul'),('is','il')):
        if w.endswith(a): c.append(w[:-len(a)]+b)
    return any(len(x)>=3 and known(x) for x in c)

def feminine_of(w,lem):
    return (w==lem+'a' or (lem.endswith('o') and w==lem[:-1]+'a') or (lem.endswith('ês') and w==lem[:-2]+'esa')
            or (lem.endswith('ão') and w in (lem[:-2]+'ã',lem[:-2]+'oa',lem[:-2]+'ona')) or (lem.endswith('eu') and w==lem[:-2]+'eia'))
L=lambda w:simplemma.lemmatize(w,lang='pt')
def is_lemma(w): return w in dic and norm(L(w))==norm(w)
def classify(w):
    """'ok', 'p' (plural), 'v' (verbo conjugado) ou 'x' (outra flexão)."""
    lem=L(w)
    if norm(lem)==norm(w):
        # plurais que o lematizador não reduz (luvas, trevas): o singular existe e é lema
        if w.endswith('s') and (is_lemma(w[:-1]) or (w.endswith('es') and is_lemma(w[:-2]))): return 'p'
        return 'ok'
    if feminine_of(w,lem): return 'ok'
    # professora: o masculino "professor" existe como palavra própria
    if w.endswith('a') and is_lemma(w[:-1]) and not re.search(r'(ar|er|ir)$',w[:-1]+'r'): return 'ok'
    if w.endswith('s') and not lem.endswith('s'): return 'p'
    if re.search(r'(ar|er|ir|or|ôr)$',lem) and lem in freqset:
        # substantivo que também é forma verbal (rolha, fala): o plural dele volta para ele mesmo
        if not w.endswith('s') and L(w+'s')==w: return 'ok'
        return 'v'
    if re.search(r'(ar|er|ir|or|ôr)$',lem): return 'ok'   # "garota" → "garotar" não existe: é substantivo
    return 'x'

def classify_ud(w):
    """Usa os treebanks quando a palavra aparece pelo menos 2 vezes. None = sem dados."""
    s=ud.get(w)
    if not s: return None
    # nome próprio: muitas vezes como nome e quase nunca como palavra comum (Polônia, Almeida);
    # 'cap' não entra na conta, porque repete as mesmas ocorrências de 'n'
    if s.get('n',0)>=5 and s.get('ok',0)<=0.1*s['n'] and w not in allow: return 'n'
    tot=sum(v for k,v in s.items() if k not in ('cap','n'))   # só os usos como palavra comum
    if tot<2: return None
    if s.get('f',0)>0.5*tot: return 'f'
    if s.get('ok',0)>=0.35*tot: return 'ok'
    return 'p' if s.get('p',0)>=s.get('v',0) else 'v'

freqset=set(l.split()[0] for l in open('freq.txt',encoding='utf8'))
def ud_singular(w):
    """Os treebanks mostram a palavra quase sempre como singular (país, cais, simples)."""
    s=ud.get(w) or {}
    return s.get('ok',0)>=5 and s.get('ok',0)>=4*s.get('p',0)
# grafia que não existe em palavra portuguesa: k, w, y, sh, th, ck ou final em consoante como t, d, p, g
ESTRANGEIRA=re.compile(r'[kwy]|sh|th|ck|[bcdfghjpqtv]$')
out={}; rej={}
for i,l in enumerate(open('freq.txt',encoding='utf8')):
    w,c=l.split()
    if len(w)<4 or not re.fullmatch(r'[a-zà-ü]+',w): continue
    n=norm(w)
    if not re.fullmatch(r'[a-z]+',n) or len(set(n))>7: continue
    if n in out: continue                      # já existe uma forma válida (ex.: faca antes de faça)
    if n in block or w in block: continue
    if n in force_n: out[n]=force_n[n]; rej.pop(n,None); continue
    if ESTRANGEIRA.search(w): continue
    if n in func: rej.setdefault(n,'f'); continue
    if n in func_plural: rej.setdefault(n,'p'); continue
    k=classify_ud(w)
    if k!='ok' and (n in names or ((w in proper or is_proper(w)) and w not in allow)): continue
    if k is None:
        k=classify(w)
        if k=='ok' and not hun_ok(w): k='x'      # fora dos dicionários e dos treebanks: provável estrangeirismo
    if k=='ok' and re.search(r'(armos|ermos|irmos|arem|erem|irem)$',w): k='v'   # infinitivo pessoal (começarmos)
    if k=='ok' and singular_known(w) and not ud_singular(w): k='p'
    if k=='ok': out[n]=w; rej.pop(n,None)
    elif k in 'pvf': rej.setdefault(n,k)
# palavras que sempre valem mas não estão na lista de frequência (conquanto, porquanto)
for n,w in force_n.items():
    if n not in out and n not in block and len(n)>=4 and len(set(n))<=7 and re.fullmatch(r'[a-z]+',n): out[n]=w; rej.pop(n,None)
print('válidas',len(out),'recusadas',len(rej),{k:sum(1 for v in rej.values() if v==k) for k in 'pvf'})
json.dump(out,open('words.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
json.dump(rej,open('rejected.json','w',encoding='utf8'),separators=(',',':'))

# ---------- palavras extras (spec 011) ----------
# Candidatas: palavras usadas na Wikipédia em português (20+ vezes) ou nas legendas (lista completa, 5+ vezes).
# Passam só as que o Hunspell conhece em minúscula e que seguem as mesmas regras: sem plural, sem verbo conjugado,
# sem nome próprio, estrangeirismo, pronome ou palavrão.
# palavrões e ofensas que o dicionário conhece (sem acento); as palavras com sentido comum (enviado, computação, abundante) passam
OFENSIVA=re.compile(r'caralh|bucet|bocet|piroc|xoxot|xerec|punhet|pentelh|boquet|cuzao|travec|sapatao|neguinh|boiol|baitol|fiof|tribufu|mocreia|debiloide|mongoloide'
    r'|^(puta|puto|putinh[ao]|putaria|puteir[ao]|porra|merd(a|inha|oso|osa)|fod(a|er|ido|ida|ao|ona)|bost(a|ao|ona)|viado|v[ie]adinh[ao]'
    r'|safad(o|a|inho|inha|eza)|otari[ao]|babac(a|ao|ona)|bund(a|ao|inha|ona|udo|uda)|tes(ao|udo|uda)|arrombad[ao]|escrot[ao]|cornud[ao]|chifrud[ao]'
    r'|criou?l[ao]|brox(a|ar|ura)|furico|queng[ao]|barang[ao]|retardad[ao]|trepad[ao]|bixa|bichon[ao]|bugr[ae]|mulat[ao])$')
# grafias de nomes científicos e de outras línguas (cerevisiae, bacillus, mellitus, chauffeur, inputs)
LATIM=re.compile(r'(ae|ii|ium|orum|arum|alis|ilis|oris|itis|ensis|icans)$|ll|tt|pp|ff|bb|dd|gg|mm|nn|zz|sch|ph|rh|[bdgt]s$|[^e]ps$')
# derivados de verbo que são substantivos ou adjetivos (oxidado, oxidante, oxidável, oxidação)
DERIVADO=re.compile(r'(ado|ada|ido|ida|dor|dora|ção|mento|vel|ante|ente|inte)$')
dic_n={norm(x) for x in dic}
def extra_ok(w,n):
    if n in out or n in rej or n in block or w in block or n in func or n in func_plural: return False
    if ESTRANGEIRA.search(w) or OFENSIVA.search(n) or n in names: return False
    if LATIM.search(w) or (w.endswith('us') and w==n and not w.endswith('deus')): return False   # bacillus sai, vírus e semideus ficam
    if w in proper or is_proper(w): return False
    k=classify_ud(w)
    if k is not None and k!='ok': return False
    if not HUN.lookup(w): return False
    if k is None:   # sem dados nos treebanks (sismo e penhora têm, e lá são substantivos): o dicionário decide
        stems=[f.stem for f in HUN.lookuper.good_forms(w)]
        if not any(st==w or not VERBO.search(st) for st in stems) and not DERIVADO.search(w):   # só forma de verbo
            if not FORMA_VERBAL.search(w) and not any(st in freqset for st in stems): so_verbo.append(w)
            return False
    # formas de verbo que o dicionário lista como palavra própria (erodindo, deságuam, éreis) e plurais em -eis (versáteis)
    if re.search(r'(armos|ermos|irmos|arem|erem|irem|ando|endo|indo|eis)$',w) or (w.endswith('am') and not re.search(r'(zolam|zepam)$',w)): return False
    if singular_known(w) and not ud_singular(w): return False
    if w.endswith('eses') and known(w[:-4]+'ês'): return False   # libaneses ← libanês
    if w.endswith('ens') and norm(w[:-1]) in dic_n: return False  # hifens ← hífen, germens ← gérmen
    return True
cand={}
for fn,minimo in (('ptwiki.txt',20),('freq_full.txt',5)):
    if not os.path.exists(fn): continue
    for l in open(fn,encoding='utf8'):
        p=l.split()
        if len(p)!=2 or not p[1].isdigit(): continue
        w=p[0]
        if int(p[1])<minimo: break               # as listas vêm em ordem de frequência
        if len(w)<4 or w in cand or not re.fullmatch(r'[a-zà-ü]+',w): continue
        n=norm(w)
        if re.fullmatch(r'[a-z]+',n) and len(set(n))<=7: cand[w]=n
extras={}; so_verbo=[]
for w,n in cand.items():
    if n not in extras and extra_ok(w,n): extras[n]=w
print('extras',len(extras),'de',len(cand),'candidatas')
open('extras_so_verbo.txt','w',encoding='utf8').write('\n'.join(so_verbo))   # revisão: o dicionário só conhece como forma de verbo pouco usado (linfa ← linfar)
json.dump(extras,open('extras.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
