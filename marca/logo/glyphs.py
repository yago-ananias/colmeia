import sys,json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
f=TTFont(sys.argv[1]); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm
text=sys.argv[2]; track=float(sys.argv[3]) if len(sys.argv)>3 else 0
x=0; out=[]; boxes=[]
for ch in text:
    g=cmap[ord(ch)]; pen=SVGPathPen(gs); tp=TransformPen(pen,(1,0,0,-1,x,0)); gs[g].draw(tp)
    bp=BoundsPen(gs); gs[g].draw(bp); b=bp.bounds
    boxes.append({'ch':ch,'x':x,'bounds':[b[0]+x,-b[3],b[2]+x,-b[1]] if b else None,'adv':gs[g].width})
    out.append(pen.getCommands()); x+=gs[g].width+track*upm
print(json.dumps({'upm':upm,'d':' '.join(out),'width':x-track*upm,'boxes':boxes,'asc':f['OS/2'].sCapHeight,'xh':f['OS/2'].sxHeight}))
