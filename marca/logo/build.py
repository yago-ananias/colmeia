import json,subprocess,math,os
OUT='/mnt/project-files/colmeia-design/logo'; os.makedirs(OUT,exist_ok=True)
g=json.loads(subprocess.check_output(['python3','logo/glyphs.py','fonts/Bricolage_Grotesque_opsz_wght_96_800.woff2','colmeıa','-0.02']))
INK,HONEY,LIGHT,CREAM,HINK='#22213A','#F0A531','#ECEAF4','#FFFFFF','#3B2400'
def hexpts(cx,cy,r):
    return [(cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a))) for a in (-90,-30,30,90,150,210)]
def fmt(p): return ' '.join(f'{x:.2f},{y:.2f}' for x,y in p)
# symbol in a 100x100 box: open hexagonal "C" (the hive cell) + solid core (the central letter)
def symbol(ring,core,tx=0,ty=0,s=1):
    o=hexpts(50,50,38); ring_pts=[o[1],o[0],o[5],o[4],o[3],o[2]]  # start upper-right, run counter-clockwise, stop lower-right: right edge left open
    c=hexpts(50,50,12.5)
    return (f'<g transform="translate({tx} {ty}) scale({s})">'
      f'<polyline points="{fmt(ring_pts)}" fill="none" stroke="{ring}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'
      f'<polygon points="{fmt(c)}" fill="{core}" stroke="{core}" stroke-width="4" stroke-linejoin="round"/></g>')
ib=[b for b in g['boxes'] if b['ch']=='ı'][0]['bounds']; tcx=(ib[0]+ib[2])/2
def wordmark(ink,dot,tx=0):
    t=hexpts(tcx,-662,92)
    return (f'<g transform="translate({tx} 0)"><path d="{g["d"]}" fill="{ink}"/>'
      f'<polygon points="{fmt(t)}" fill="{dot}" stroke="{dot}" stroke-width="22" stroke-linejoin="round"/></g>')
W=g['width']
def svg(vb,body,title): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'
files={
 'colmeia-simbolo.svg':svg('0 0 100 100',symbol(INK,HONEY),'Colmeia'),
 'colmeia-simbolo-escuro.svg':svg('0 0 100 100',symbol(LIGHT,HONEY),'Colmeia'),
 'colmeia-icone.svg':svg('0 0 100 100',f'<rect width="100" height="100" rx="22" fill="{HONEY}"/>'+symbol(INK,CREAM,14,14,.72),'Colmeia'),
 'colmeia-icone-escuro.svg':svg('0 0 100 100',f'<rect width="100" height="100" rx="22" fill="{INK}"/>'+symbol(LIGHT,HONEY,14,14,.72),'Colmeia'),
 'colmeia-palavra.svg':svg(f'-10 -770 {W+20} 800',wordmark(INK,HONEY),'Colmeia'),
 'colmeia-palavra-escuro.svg':svg(f'-10 -770 {W+20} 800',wordmark(LIGHT,HONEY),'Colmeia'),
}
S=900; gap=150; ty=-385-S/2
for name,ring,ink in (('colmeia-logo.svg',INK,INK),('colmeia-logo-escuro.svg',LIGHT,LIGHT)):
    files[name]=svg(f'-10 {ty-10:.0f} {S+gap+W+20} {S+20}',symbol(ring,HONEY,0,ty,S/100)+wordmark(ink,HONEY,S+gap),'Colmeia')
for k,v in files.items(): open(f'{OUT}/{k}','w').write(v)
print(list(files))
