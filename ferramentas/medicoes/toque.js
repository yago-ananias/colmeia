const fs=require("fs"),path=require("path"),os=require("os");
let chromium;try{({chromium}=require("playwright"))}catch(e){({chromium}=require("/opt/node22/lib/node_modules/playwright"))}
const [,,arq,cpu="4",site="1"]=process.argv;
const page=fs.readFileSync(arq,"utf8");
const head='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+(site==="1"?'<script defer src="data:text/javascript,window.umami={track(){}}" data-website-id="x"></script>':'')+'</head><body>';
const file=path.join(os.tmpdir(),"toque-"+path.basename(arq));fs.writeFileSync(file,head+page+"</body></html>");
(async()=>{const b=await chromium.launch();
 const c=await b.newContext({viewport:{width:375,height:740},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 await c.addInitScript(()=>{localStorage.setItem("colmeia:seenHelp","true");
   window.__t=[];let t0=0;addEventListener("touchstart",()=>{t0=performance.now()},true);
   addEventListener("click",()=>{window.__clk=performance.now()-t0},true);
   new MutationObserver(()=>{}).observe(document,{childList:true});
   window.__mark=()=>t0;});
 const p=await c.newPage();await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto("file://"+file);await p.waitForTimeout(1500);
 const cdp=await c.newCDPSession(p);await cdp.send("Emulation.setCPUThrottlingRate",{rate:+cpu});
 await p.evaluate(()=>{const e=document.getElementById("entry");new MutationObserver(()=>{const d=performance.now()-window.__mark();requestAnimationFrame(()=>setTimeout(()=>window.__t.push([d,performance.now()-window.__mark(),window.__clk]),0))}).observe(e,{childList:true,subtree:true,characterData:true})});
 const hexes=await p.$$("#hive .hex");
 for(let i=0;i<12;i++){const h=hexes[i%7];const bb=await h.boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(500);
   if(i%5===4){await p.evaluate(()=>{});await p.click("#b-del").catch(()=>{});}}
 const t=await p.evaluate(()=>window.__t);
 const med=a=>{a=a.slice().sort((x,y)=>x-y);return Math.round(a[Math.floor(a.length/2)])};
 console.log(path.basename(arq),"cpu x"+cpu,"site",site,"| toque→click",med(t.map(x=>x[2])),"ms | toque→letra",med(t.map(x=>x[0])),"ms | toque→tela",med(t.map(x=>x[1])),"ms | n",t.length);
 await b.close()})();
