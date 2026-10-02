# Confere a lista de palavras do jogo contra deve_valer.txt e nao_deve_valer.txt.
# Uso: python3 diagnostico.py [pasta com words.json e rejected.json] [--hunspell]
#   pasta padrão: /mnt/project-files/soletra/ferramentas/.cache
#   --hunspell: também procura estrangeirismos e nomes próprios com o Hunspell pt_BR
#               (precisa de pt_BR.aff e pt_BR.dic na mesma pasta e de `pip install spylls`; leva alguns minutos)
# Sai com código 1 se alguma palavra de deve_valer.txt não vale ou alguma de nao_deve_valer.txt vale.
import json, os, sys, unicodedata

here = os.path.dirname(os.path.abspath(__file__))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
cache = args[0] if args else '/mnt/project-files/soletra/ferramentas/.cache'
words = json.load(open(os.path.join(cache, 'words.json'), encoding='utf8'))
rej = json.load(open(os.path.join(cache, 'rejected.json'), encoding='utf8'))
MOTIVO = {'p': 'plural', 'v': 'verbo conjugado', 'f': 'palavra funcional'}

def norm(w):
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn').lower()

def cabe(w):
    n = norm(w)
    return len(n) >= 4 and n.isalpha() and n.isascii() and len(set(n)) <= 7

def lista(nome):
    return [w for l in open(os.path.join(here, nome), encoding='utf8') if not l.startswith('#') for w in l.split() if cabe(w)]

falhas = 0
deve = lista('deve_valer.txt')
faltam = []
for w in deve:
    n = norm(w)
    if n not in words:
        faltam.append(f"{w} ({'recusada: ' + MOTIVO.get(rej[n], rej[n]) if n in rej else 'não está na lista'})")
    elif words[n] != w:
        faltam.append(f"{w} (vale, mas aparece como \"{words[n]}\")")
print(f"Devem valer: {len(deve) - len(faltam)} de {len(deve)} ok")
for x in faltam: print('   ', x)
falhas += len(faltam)

nao = lista('nao_deve_valer.txt')
sobram = [w for w in nao if norm(w) in words]
print(f"\nNão devem valer: {len(nao) - len(sobram)} de {len(nao)} ok")
if sobram: print('    ainda valem:', ' '.join(sobram))
falhas += len(sobram)

# plurais: palavra terminada em s cujo singular também está na lista (rins/rim, vagens/vagem)
def singulares(w):
    c = [w[:-1]]
    if w.endswith('es'): c.append(w[:-2])
    if w.endswith('ns'): c.append(w[:-2] + 'm')
    for a, b in (('oes', 'ao'), ('aes', 'ao'), ('eis', 'el'), ('ais', 'al'), ('ois', 'ol'), ('uis', 'ul'), ('is', 'il')):
        if w.endswith(a): c.append(w[:-len(a)] + b)
    return c
plur = sorted(words[n] for n in words if n.endswith('s') and any(s in words for s in singulares(n)))
print(f"\nPossíveis plurais (o singular também vale): {len(plur)}")
if plur: print('   ', ' '.join(plur))

print(f"\nTotal: {len(words)} palavras válidas, {len(rej)} recusadas com motivo")

if '--hunspell' in sys.argv:
    from spylls.hunspell import Dictionary
    d = Dictionary.from_files(os.path.join(cache, 'pt_BR'))
    desconhecidas, so_maiuscula = [], []
    for w in sorted(words.values()):
        if d.lookup(w): continue
        (so_maiuscula if d.lookup(w.capitalize()) else desconhecidas).append(w)
    print(f"\nHunspell: {len(desconhecidas)} desconhecidas (prováveis estrangeirismos):", ' '.join(desconhecidas))
    print(f"Hunspell: {len(so_maiuscula)} só com maiúscula (prováveis nomes próprios):", ' '.join(so_maiuscula))

sys.exit(1 if falhas else 0)
