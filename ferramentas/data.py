import json, random
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
disp={n:d for n,d in out.items() if n!=d}
print(len(words),len(puz),len(disp))
js="const WORDS="+json.dumps(','.join(words))+".split(',');\nconst DISP="+json.dumps(disp,ensure_ascii=False,separators=(',',':'))+";\nconst PUZ="+json.dumps(','.join(puz))+".split(',');\n"
rej=json.load(open('rejected.json',encoding='utf8'))
js+="const REJ={};"+"".join(f"{json.dumps(','.join(sorted(k for k,v in rej.items() if v==t)))}.split(',').forEach(w=>REJ[w]='{t}');" for t in 'pvf')+"\n"
open('data.js','w',encoding='utf8').write(js)
print(len(js.encode()))
