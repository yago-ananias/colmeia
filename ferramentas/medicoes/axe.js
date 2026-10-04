const fs=require("fs"),path=require("path"),os=require("os");
let chromium;try{({chromium}=require("playwright"))}catch(e){({chromium}=require("/opt/node22/lib/node_modules/playwright"))}
const axeSrc=fs.readFileSync((process.env.AXE_DIR||"axe")+"/node_modules/axe-core/axe.min.js","utf8");
const arq=process.argv[2];const page=fs.readFileSync(arq,"utf8");
const file=path.join(os.tmpdir(),"axe-"+path.basename(arq));
fs.writeFileSync(file,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+page+"</body></html>");
(async()=>{const b=await chromium.launch();
 for(const [w,h,scheme] of [[375,740,"light"],[375,740,"dark"],[1200,900,"light"],[1200,900,"dark"]]){
  const c=await b.newContext({viewport:{width:w,height:h},colorScheme:scheme});
  await c.addInitScript(()=>{localStorage.setItem("colmeia:seenHelp","true");localStorage.setItem("colmeia:stats",JSON.stringify({streak:1,lastDay:1,best:10,pangs:1,badges:["pang"]}))});
  const p=await c.newPage();await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.goto("file://"+file);await p.waitForTimeout(300);
  // estado cheio: duas dicas, uma palavra, mapa aberto, depois ver respostas
  await p.click("#b-hint");await p.click("#b-hint");await p.click("#b-grid");
  const w1=await p.evaluate(()=>{const c=document.querySelector("#hive .hex.center").dataset.l,L=new Set([...document.querySelectorAll("#hive .hex")].map(h=>h.dataset.l));return WORDS.find(w=>w.includes(c)&&[...w].every(x=>L.has(x)))});
  await p.keyboard.type(w1);await p.keyboard.press("Enter");await p.waitForTimeout(500);
  await p.click("#b-giveup");await p.click('#sheet [data-act="reveal"]');await p.waitForTimeout(300);
  await p.evaluate(s=>{const e=document.createElement("script");e.textContent=s;document.head.appendChild(e)},axeSrc);
  const r=await p.evaluate(()=>axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","best-practice"]}}));
  console.log(`${w}x${h} ${scheme}: ${r.violations.length} violações`);
  r.violations.forEach(v=>console.log("   -",v.id,"("+v.impact+")",v.nodes.length,"nós:",v.nodes.slice(0,2).map(n=>n.target.join(" ")+" "+(n.any[0]&&n.any[0].message||"").slice(0,90)).join(" | ")));
  await c.close()}
 await b.close()})();
