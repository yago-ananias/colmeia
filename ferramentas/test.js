// Testes da Colmeia. Uso: node ferramentas/test.js (de dentro de /mnt/project-files/soletra)
// Abre colmeia.html num Chromium sem tela e confere dados, regras, diários, tema e layout.
const fs = require("fs"), path = require("path"), os = require("os");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright")); }

const root = path.join(__dirname, "..");
const page = fs.readFileSync(path.join(root, "colmeia.html"), "utf8");
const file = path.join(os.tmpdir(), "colmeia-test.html");
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + page + "</body></html>");
const url = "file://" + file;

let fails = 0;
const ok = (cond, msg) => { console.log((cond ? "  ok   " : "  FALHOU ") + msg); if (!cond) fails++; };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, colorScheme: "light" });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", e => errors.push(e.message));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto(url);
  await p.waitForTimeout(300);
  console.log("Primeira visita (spec 004)");
  ok(await p.$eval("#overlay", e => !e.hidden && e.textContent.includes("Como jogar")), "ajuda abre sozinha na primeira visita");
  await p.keyboard.press("Escape");

  console.log("Lista de palavras (spec 006)");
  {
    const { spawnSync } = require("child_process");
    const r = spawnSync("python3", [path.join(__dirname, "listas", "diagnostico.py"), path.join(__dirname, ".cache")], { encoding: "utf8" });
    const res = (r.stdout || "").split("\n").filter(l => /de \d+ ok|ainda valem|faltam/.test(l));
    ok(r.status === 0, "deve_valer.txt e nao_deve_valer.txt batem com a lista (" + res.map(l => l.trim()).join("; ") + ")");
  }
  const lista = await p.evaluate(() => ["abelha", "rainha", "leao", "leoa", "sopa", "suco", "tesouro", "bale"].map(w => w + ":" + (typeof WORDS !== "undefined" && WORDS.includes(w))));
  ok(lista.slice(0, 7).every(x => x.endsWith("true")), "abelha, rainha, leão, leoa, sopa, suco e tesouro valem no jogo (" + lista.join(" ") + ")");

  console.log("Dados (SC-002)");
  const data = await p.evaluate(() => {
    const bit = c => 1 << (c.charCodeAt(0) - 97);
    const masks = WORDS.map(w => [...w].reduce((m, c) => m | bit(c), 0));
    const today = Math.round((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - new Date(2026, 9, 1)) / 864e5) + 1;
    let bad = 0, min = 1e9, max = 0;
    // dias que já foram ao ar ficam fixos mesmo que a lista mude: só precisam ter pangrama e pelo menos 15 palavras
    const check = (code, strict) => {
      const M = [...code].reduce((m, c) => m | bit(c), 0), cb = bit(code[0]);
      let n = 0, pg = 0;
      masks.forEach(m => { if ((m & ~M) === 0 && (m & cb)) { n++; if (m === M) pg++; } });
      if (new Set(code).size !== 7 || pg < 1 || (strict ? n < 22 || n > 65 : n < 15)) bad++;
      if (strict) { min = Math.min(min, n); max = Math.max(max, n); }
    };
    LIVRE.forEach(c => check(c, true)); DAYS.forEach((c, i) => check(c, i >= (today + 2) * 3));
    const key = c => [...c].sort().join(""), ds = new Set(DAYS.map(key));
    return { words: WORDS.length, puz: DAYS.length + LIVRE.length, days: DAYS.length / 3, livre: LIVRE.length, bad, min, max,
      overlap: LIVRE.filter(c => ds.has(key(c))).length, pinned: DAYS.slice(3, 6).join(","), size: document.documentElement.outerHTML.length };
  });
  ok(data.bad === 0, `${data.puz} desafios, todos com 7 letras, 22–65 palavras e pangrama (min ${data.min}, max ${data.max})`);
  ok(data.overlap === 0, `${data.days} dias de diários e ${data.livre} desafios no Livre, sem conjunto de letras em comum (spec 008)`);
  ok(data.pinned === "obeilrs,dceiort,caeintv", "diários de 02/10/2026 continuam os mesmos (programação fixa em diarios.txt)");
  ok(data.words > 5000, `${data.words} palavras na lista`);
  ok(data.size < 1e6, `página com ${Math.round(data.size / 1024)} KB (< 1 MB)`);
  const blocked = await p.evaluate(() => ["baal", "maria", "john", "porno", "blog"].filter(w => WORDS.includes(w)));
  const rev = await p.evaluate(() => ({
    in: ["sonho", "erro", "faca", "garota", "filha", "amanha", "politica", "garfo", "domingo", "segredo"].filter(w => !WORDS.includes(w)),
    out: ["franca", "adele", "caddie", "freelancer", "rins", "arranca", "olha", "deve", "putaria", "crioulo", "artefatos", "migalhas"].filter(w => WORDS.includes(w)) }));
  ok(rev.in.length === 0, "palavras comuns da revisão valem (sonho, erro, faca, garota…)" + (rev.in.length ? ": faltam " + rev.in : ""));
  ok(rev.out.length === 0, "nomes, estrangeirismos, plurais, verbos e ofensas da revisão ficam de fora" + (rev.out.length ? ": " + rev.out : ""));
  ok(blocked.length === 0, "palavras bloqueadas fora da lista" + (blocked.length ? ": " + blocked : ""));

  console.log("Diários (FR-002, FR-003)");
  const day = await p.evaluate(() => {
    const d = Math.round((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - new Date(2026, 9, 1)) / 864e5) + 1;
    const codes = [0, 1, 2].map(k => DAYS[((d - 1) * 3 + k) % DAYS.length]);
    const words = codes.map(code => { const L = new Set(code); return WORDS.filter(w => w.includes(code[0]) && [...w].every(c => L.has(c))); });
    return { codes, words };
  });
  ok(new Set(day.codes).size === 3, "três desafios diferentes hoje: " + day.codes.join(", "));
  const hive = await p.$$eval(".hex", h => h.map(x => x.dataset.l).sort().join(""));
  ok(hive === [...day.codes[0]].sort().join(""), "colmeia mostra as letras do desafio Manhã");

  console.log("Regra e pontuação (FR-001, FR-005)");
  const found = () => p.$$eval("#words li", l => l.length).catch(() => 0);
  const pts = () => p.$eval("#pts", e => +e.textContent);
  const typeWord = async w => { await p.keyboard.type(w); await p.keyboard.press("Enter"); await p.waitForTimeout(450); };
  const w4 = day.words[0].find(w => w.length === 4), w6 = day.words[0].find(w => w.length >= 6 && w.length < 8 && new Set(w).size < 7);
  await typeWord(w4);
  ok((await found()) === 1 && (await pts()) === 1, `"${w4}" aceita e vale 1 ponto`);
  await typeWord(w4);
  ok((await found()) === 1, "palavra repetida não conta de novo");
  const outer = day.codes[0].slice(1, 5);
  await typeWord(outer.slice(0, 3));
  ok((await found()) === 1, "palavra com menos de 4 letras é recusada");
  const noCenter = day.words[0].length && [...day.codes[0].slice(1)].join("").slice(0, 4);
  await typeWord(noCenter);
  ok((await found()) === 1, "palavra sem a letra central é recusada");
  console.log("Validade estilo g1 (spec 002)");
  const rules = await p.evaluate(code => {
    const L = new Set(code), fits = w => w.length >= 4 && w.includes(code[0]) && [...w].every(c => L.has(c));
    const pick = t => Object.keys(REJ).find(w => REJ[w] === t && fits(w));
    return { overlap: WORDS.filter(w => REJ[w]).length, p: pick("p"), v: pick("v"), f: pick("f"),
      has: ["aluno", "aluna", "correr", "jogar", "laranja"].filter(w => WORDS.includes(w)).length,
      not: ["laranjas", "correu", "jogou", "casas", "porque", "eles"].filter(w => WORDS.includes(w)) };
  }, day.codes[0]);
  ok(rules.overlap === 0, "nenhuma palavra válida está marcada como recusada");
  ok(rules.has === 5, "aluno, aluna, correr, jogar e laranja valem");
  ok(rules.not.length === 0, "laranjas, correu, jogou, casas, porque e eles não valem" + (rules.not.length ? ": " + rules.not : ""));
  for (const [t, msg] of [["p", "Plural não vale"], ["v", "Só verbos no infinitivo"], ["f", "Pronomes, preposições e conjunções não valem"]]) {
    if (!rules[t]) continue;
    const n0 = await found();
    await p.keyboard.type(rules[t]); await p.keyboard.press("Enter");
    await p.waitForTimeout(80);
    const shown = await p.$eval("#toast span", e => e.textContent);
    await p.waitForTimeout(400);
    ok((await found()) === n0 && shown === msg, `"${rules[t]}" recusada com "${msg}"`);
  }
  const w8 = day.words[0].find(w => w.length >= 8 && new Set(w).size < 7);
  if (w8) {
    const before = await pts();
    await typeWord(w8);
    ok((await pts()) - before === w8.length + 3, `"${w8}" (${w8.length} letras) vale ${w8.length} + 3 de bônus de palavra longa`);
  }
  const pg8 = await p.evaluate(() => { const w = WORDS.find(w => w.length >= 8 && new Set(w).size === 7); return w; });
  ok(!!pg8, `pangrama longo existe na lista ("${pg8}" valeria ${pg8 && pg8.length} + 7 + 3)`);
  if (w6) {
    const before = await pts();
    await typeWord(w6);
    ok((await pts()) - before === w6.length, `"${w6}" vale ${w6.length} pontos`);
  }
  const accented = await p.evaluate(ws => ws.find(w => DISP[w] && w.length >= 4), day.words[0]);
  if (accented) {
    await typeWord(accented);
    const shown = await p.$$eval("#words li span", s => s.map(x => x.textContent));
    const disp = await p.evaluate(w => DISP[w], accented);
    ok(shown.includes(disp), `digitar "${accented}" aceita e mostra "${disp}"`);
  }
  const nManha = await found();
  await p.click("#dailies button:nth-child(2)");
  await p.waitForTimeout(200);
  ok((await found()) === 0, "desafio Tarde começa vazio");
  await p.click("#dailies button:nth-child(1)");
  await p.waitForTimeout(200);
  ok((await found()) === nManha, "voltar para Manhã mantém o progresso");
  await p.reload(); await p.waitForTimeout(300);
  ok((await found()) === nManha, "progresso recuperado ao recarregar (SC-005)");

  console.log("Acessibilidade (spec 007)");
  ok(await p.evaluate(() => document.documentElement.lang) === "pt-BR", "página declara idioma pt-BR");
  await p.keyboard.press("Tab"); await p.focus("#m-livre"); await p.keyboard.press("Enter"); await p.waitForTimeout(250);
  ok(await p.$eval("#m-livre", e => e.getAttribute("aria-pressed")) === "true", "Enter com foco de teclado em Livre troca de modo");
  await p.focus("#m-diario"); await p.keyboard.press(" "); await p.waitForTimeout(250);
  ok(await p.$eval("#m-diario", e => e.getAttribute("aria-pressed")) === "true", "Espaço com foco de teclado em Diário troca de modo");
  await p.focus("#b-help"); await p.keyboard.press("Enter"); await p.waitForTimeout(150);
  const dlg = await p.evaluate(() => ({ open: !document.getElementById("overlay").hidden, inert: document.querySelector(".app").inert,
    name: (document.getElementById(document.getElementById("sheet").getAttribute("aria-labelledby")) || {}).textContent,
    inside: document.getElementById("sheet").contains(document.activeElement) }));
  ok(dlg.open && dlg.inert && dlg.inside, "ajuda abre pelo teclado, foco fica dentro e o jogo por trás fica inerte");
  ok(dlg.name === "Como jogar", `janela tem nome ("${dlg.name}")`);
  for (let i = 0; i < 6; i++) await p.keyboard.press("Tab");
  ok(await p.evaluate(() => document.getElementById("sheet").contains(document.activeElement) || document.activeElement === document.body), "Tab não sai da janela para o jogo");
  await p.keyboard.press("Escape"); await p.waitForTimeout(100);
  ok(await p.evaluate(() => document.activeElement.id === "b-help" && !document.querySelector(".app").inert), "fechar devolve o foco para o botão de ajuda");
  await p.focus(".hex.center"); await p.waitForTimeout(250);
  const ring = await p.$eval(".hex.center", e => getComputedStyle(e).backgroundColor);
  const plum = await p.evaluate(() => { const d = document.createElement("div"); d.style.color = "var(--plum)"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; });
  ok(ring === plum, "letra com foco de teclado muda de cor (foco visível)");
  await p.keyboard.press("Enter"); await p.waitForTimeout(80);
  const center = await p.$eval(".hex.center", e => e.dataset.l);
  ok(await p.$eval("#entrysr", e => e.textContent) === "Palavra: " + center.toUpperCase(), "Enter na letra com foco digita a letra e a palavra é anunciada");
  await p.keyboard.press("Backspace"); await p.click("#b-del", { force: true });
  await p.evaluate(() => document.activeElement.blur());
  await p.keyboard.type(center.repeat(2)); await p.keyboard.press("Enter"); await p.waitForTimeout(80);
  ok(await p.$eval("#toast", e => e.textContent) === (center + center).toUpperCase() + ": Muito curta", "aviso diz qual palavra foi recusada");
  await p.waitForTimeout(2000);
  ok(await p.$eval("#toast span", e => +getComputedStyle(e).opacity >= 0.6), "aviso continua visível depois de 2 segundos");
  await p.keyboard.type(center);
  ok(await p.$eval("#toast", e => e.textContent === ""), "aviso some quando a próxima palavra começa");
  await p.keyboard.press("Backspace");

  console.log("Compartilhar, Livre e sugestão (spec 008)");
  const hiveSet = () => p.$$eval(".hex", h => h.map(x => x.dataset.l).sort().join(""));
  const hiveCode = () => p.evaluate(() => { const c = document.querySelector(".hex.center").dataset.l;
    return c + [...document.querySelectorAll(".hex:not(.center)")].map(x => x.dataset.l).sort().join(""); });
  await p.evaluate(() => { window.__copied = null;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: t => { window.__copied = t; return Promise.resolve(); } } }); });
  const code0 = await hiveCode();
  await p.click("#b-share"); await p.waitForTimeout(150);
  const shared = await p.evaluate(() => window.__copied || "");
  ok(shared.includes("yago-ananias.github.io/colmeia/?c=" + code0) && shared.includes("Manhã"), "Compartilhar copia o resultado com link para o mesmo desafio");
  ok([...(shared.split("\n")[1] || "")].filter(ch => ["🟨", "⬜", "🍯"].includes(ch)).length === 7, "resultado tem a grade de 7 casas do nível: " + (shared.split("\n")[1] || ""));
  const daySets = await p.evaluate(() => DAYS.map(c => [...c].sort().join("")));
  const isDaily = new Set(daySets);
  await p.click("#m-livre"); await p.waitForTimeout(200);
  const seenSets = [await hiveSet()];
  for (let i = 0; i < 25; i++) { await p.click("#b-new"); await p.waitForTimeout(40); seenSets.push(await hiveSet()); }
  ok(seenSets.every(s => !isDaily.has(s)), "Livre nunca sorteia as letras de um diário (26 desafios seguidos)");
  ok(new Set(seenSets).size === seenSets.length, "Livre não repete conjunto de letras já jogado");
  await p.goto(url + "?c=" + day.codes[1]); await p.waitForTimeout(300);
  ok(await p.$eval("#m-diario", e => e.getAttribute("aria-pressed")) === "true" && await p.$eval("#dailies button:nth-child(2)", e => e.getAttribute("aria-pressed")) === "true",
    "link de um desafio de hoje abre o Diário no desafio certo (Tarde)");
  const lc = await p.evaluate(() => LIVRE[7]);
  await p.goto(url + "?c=" + lc); await p.waitForTimeout(300);
  ok(await p.$eval("#m-livre", e => e.getAttribute("aria-pressed")) === "true" && (await hiveCode()) === lc, "link de outro desafio abre no Livre com as mesmas letras e a mesma central");
  await p.goto(url + "?c=" + lc + "&m=relampago&p=95"); await p.waitForTimeout(300);
  const rl = await p.evaluate(() => ({ mode: document.getElementById("m-relampago").getAttribute("aria-pressed"),
    sheet: !document.getElementById("overlay").hidden && document.getElementById("sheet").textContent }));
  ok(rl.mode === "true" && !!rl.sheet && rl.sheet.includes("95 pontos") && (await hiveCode()) === lc, "link do Relâmpago abre a partida com as letras e os pontos a bater");
  const clock0 = await p.$eval("#clock", e => e.textContent); await p.waitForTimeout(1300);
  ok(await p.$eval("#clock", e => e.textContent) === clock0, "relógio só começa quando a janela do desafio fecha");
  await p.goto(url + "?c=zzzzzzz"); await p.waitForTimeout(300);
  ok(await p.$eval("#m-diario", e => e.getAttribute("aria-pressed")) === "true", "link inválido abre o jogo normalmente");
  const cen = await p.$eval(".hex.center", e => e.dataset.l), bogus = cen.repeat(5);
  await p.keyboard.type(bogus); await p.keyboard.press("Enter"); await p.waitForTimeout(100);
  ok(await p.$eval("#toast .sug", e => e.textContent).catch(() => null) === "Sugerir", "palavra fora da lista mostra o botão Sugerir");
  await p.click("#toast .sug"); await p.waitForTimeout(100);
  const href = await p.$eval("#sheet a[data-act=suggest]", a => a.href).catch(() => "");
  ok(href.startsWith("https://github.com/yago-ananias/colmeia/issues/new?title=") && decodeURIComponent(href).includes("Sugestão de palavra: " + bogus),
    "Sugerir abre uma sugestão pronta no GitHub com a palavra");
  await p.$eval("#sheet a[data-act=suggest]", a => a.addEventListener("click", e => e.preventDefault()));
  await p.click("#sheet a[data-act=suggest]"); await p.waitForTimeout(100);
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.keyboard.type(bogus); await p.keyboard.press("Enter"); await p.waitForTimeout(100);
  ok(await p.$eval("#toast .sug", e => e.textContent).catch(() => null) === "Já sugerida", "a mesma palavra aparece como já sugerida");
  await p.keyboard.type(cen + cen); await p.keyboard.press("Enter"); await p.waitForTimeout(100);
  ok(!(await p.$("#toast .sug")), "palavra curta não mostra Sugerir");

  console.log("Tema (FR-004)");
  const bg = () => p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const lightBg = await bg();
  await p.emulateMedia({ colorScheme: "dark" });
  const darkBg = await bg();
  ok(lightBg !== darkBg, `segue o tema do aparelho (${lightBg} → ${darkBg})`);
  await p.click("#b-theme");
  ok((await p.evaluate(() => document.documentElement.dataset.theme)) === "light", "botão troca para claro mesmo com aparelho escuro");
  await p.reload(); await p.waitForTimeout(300);
  ok((await bg()) === lightBg, "escolha de tema salva após recarregar");
  await p.click("#b-theme");

  console.log("Relâmpago (FR-007)");
  await p.click("#m-relampago");
  await p.waitForTimeout(600);
  await p.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); document.dispatchEvent(new Event("visibilitychange")); });
  const c1 = await p.$eval("#clock", e => e.textContent);
  await p.waitForTimeout(2200);
  const c2 = await p.$eval("#clock", e => e.textContent);
  ok(c1 === c2, `relógio parado com a aba oculta (${c1} → ${c2})`);
  await p.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => false }); document.dispatchEvent(new Event("visibilitychange")); });
  await p.waitForTimeout(1300);
  const c3 = await p.$eval("#clock", e => e.textContent);
  ok(c3 !== c2, `relógio volta a correr (${c2} → ${c3})`);

  console.log("Relâmpago: pausa na ajuda e confirmação (spec 004)");
  await p.click("#m-relampago"); await p.waitForTimeout(400);
  await p.click("#b-help");
  const h1 = await p.$eval("#clock", e => e.textContent);
  await p.waitForTimeout(2200);
  const h2 = await p.$eval("#clock", e => e.textContent);
  ok(h1 === h2, `relógio parado com a ajuda aberta (${h1} → ${h2})`);
  await p.keyboard.press("Escape"); await p.waitForTimeout(3500);
  await p.click("#m-diario"); await p.waitForTimeout(200);
  ok(await p.$eval("#overlay", e => !e.hidden && e.textContent.includes("Abandonar")), "trocar de modo no meio da partida pede confirmação");
  await p.click('#sheet button[data-act="close"]'); await p.waitForTimeout(200);
  ok(await p.$eval("#m-relampago", e => e.getAttribute("aria-pressed") === "true"), "\"Continuar jogando\" mantém a partida");
  await p.click("#m-diario"); await p.click('#sheet button[data-act="leave"]'); await p.waitForTimeout(200);
  ok(await p.$eval("#m-diario", e => e.getAttribute("aria-pressed") === "true"), "\"Abandonar\" vai para o modo escolhido");

  console.log("Celular 375×740 (spec 004)");
  for (const scheme of ["light", "dark"]) {
    const m = await browser.newPage({ viewport: { width: 375, height: 740 }, colorScheme: scheme });
    await m.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await m.goto(url); await m.waitForTimeout(200); await m.keyboard.press("Escape"); await m.waitForTimeout(100);
    const box = await m.evaluate(() => ({ enter: document.getElementById("b-enter").getBoundingClientRect().bottom, hive: document.getElementById("hive").getBoundingClientRect().bottom }));
    ok(box.enter <= 740 && box.hive <= 740, `colmeia e botões visíveis sem rolar (${scheme === "dark" ? "escuro" : "claro"}; Enviar termina em ${Math.round(box.enter)}px)`);
    await m.close();
  }

  console.log("Layout (SC-004)");
  for (const [w, scheme] of [[360, "light"], [360, "dark"], [1440, "light"], [1440, "dark"]]) {
    const q = await browser.newPage({ viewport: { width: w, height: 800 }, colorScheme: scheme });
    await q.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await q.goto(url); await q.waitForTimeout(200);
    const sw = await q.evaluate(() => document.documentElement.scrollWidth);
    ok(sw <= w, `${w}px ${scheme === "dark" ? "escuro" : "claro"}: sem rolagem lateral (${sw}px)`);
    await q.close();
  }

  console.log("Métricas de uso (spec 009)");
  {
    // versão do site: com a tag do Umami (aqui um script vazio) e um umami.track de mentira que só anota
    const siteFile = path.join(os.tmpdir(), "colmeia-test-site.html");
    fs.writeFileSync(siteFile, '<!doctype html><html><head><meta charset="utf-8"><script defer src="data:text/javascript," data-website-id="teste"></script></head><body>' + page + "</body></html>");
    const mctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, colorScheme: "dark" });
    await mctx.addInitScript(() => { window.__ev = []; window.umami = { track: (n, d) => window.__ev.push([n, d]) }; });
    const m = await mctx.newPage();
    const merr = []; m.on("pageerror", e => merr.push(e.message));
    await m.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await m.goto("file://" + siteFile); await m.waitForTimeout(400); await m.keyboard.press("Escape");
    await m.evaluate(() => document.activeElement && document.activeElement.blur());   // o foco volta para um botão ao fechar a ajuda; Enter nele não envia a palavra
    const ev = () => m.evaluate(() => window.__ev.map(([n, d]) => n + JSON.stringify(d)));
    let e = await ev();
    ok(e.some(x => x.startsWith('partida{"modo":"Diário","desafio":"Manhã","origem":"normal"')), "partida no Diário é registrada com modo e desafio");
    ok(e.some(x => /^carregamento\{"ms":\d+,"tema":"escuro"\}$/.test(x)), "tempo de carregamento e tema são registrados");
    const pg = day.words[0].find(w => new Set(w).size === 7);
    await m.keyboard.type(pg); await m.keyboard.press("Enter"); await m.waitForTimeout(1200);
    await m.click("#b-hint"); await m.waitForTimeout(100);
    await m.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.resolve() } }));
    await m.click("#b-share"); await m.waitForTimeout(150);
    await m.click("#m-relampago"); await m.waitForTimeout(150);
    e = await ev();
    ok(e.includes('pangrama{"modo":"Diário"}'), "pangrama é registrado");
    ok(e.some(x => /^nivel\{"modo":"Diário","nivel":"[^"]+","palavras":1\}$/.test(x)), "subida de nível é registrada com o nível e as palavras");
    ok(e.includes('dica{"modo":"Diário"}') && e.includes('compartilhar{"modo":"Diário","via":"copia"}'), "dica e compartilhamento são registrados");
    ok(e.some(x => x.startsWith('partida{"modo":"Relâmpago"')), "partida no Relâmpago é registrada");
    ok(e.every(x => !x.includes(pg)), "nenhuma palavra do jogador vai junto");
    ok(!e.some(x => x.startsWith("erro")), "jogo normal não registra erro");
    ok(merr.length === 0, "versão do site sem erro de script" + (merr.length ? ": " + merr.join(" | ") : ""));
    // versão sem a tag (Artifact e colmeia.html): nada é enviado, mesmo que exista um umami na página
    const n = await mctx.newPage();
    await n.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await n.goto(url); await n.waitForTimeout(400); await n.keyboard.press("Escape");
    await n.keyboard.type(pg); await n.keyboard.press("Enter"); await n.waitForTimeout(300);
    ok(await n.evaluate(() => window.__ev.length) === 0, "sem a tag do Umami nenhum evento é enviado (Artifact)");
    await mctx.close();
  }

  console.log("Erros (spec 010)");
  {
    // cada cenário num contexto novo: o erro é provocado por caminhos reais do jogo (progresso corrompido, data quebrada, gravação bloqueada)
    const siteFile = path.join(os.tmpdir(), "colmeia-test-erros.html");
    fs.writeFileSync(siteFile, '<!doctype html><html><head><meta charset="utf-8"><script defer src="data:text/javascript," data-website-id="teste"></script></head><body>' + page + "</body></html>");
    const abre = async (init, opts = {}) => {
      const c = await browser.newContext({ viewport: { width: 1200, height: 900 } });
      await c.addInitScript(([cfg, umamiTarde]) => {
        window.__ev = []; window.__calls = 0;
        for (const [k, v] of Object.entries(cfg.store || {})) localStorage.setItem(k, v);
        localStorage.setItem("colmeia:seenHelp", "true");
        const u = { track: (n, d) => { window.__calls++; if (cfg.quebrado) throw new Error("umami quebrado"); window.__ev.push([n, d]); } };
        if (umamiTarde) setTimeout(() => { window.umami = u; }, umamiTarde); else window.umami = u;
        if (cfg.semGravar) Storage.prototype.setItem = function () { throw new DOMException("Setting the value of 'colmeia:livre' exceeded the quota.", "QuotaExceededError"); };
      }, [init, opts.tarde || 0]);
      const pg = await c.newPage();
      await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
      await pg.goto(opts.url || "file://" + siteFile + (opts.query || "")); await pg.waitForTimeout(opts.espera || 500);
      return { c, pg, erros: () => pg.evaluate(() => window.__ev.filter(([n]) => n === "erro").map(([, d]) => d)) };
    };
    const recusa = async (pg, vezes = 1) => { const c = await pg.$eval("#hive .hex.center", h => h.dataset.l);
      for (let i = 0; i < vezes; i++) { await pg.keyboard.type(c.repeat(4)); await pg.keyboard.press("Enter"); await pg.waitForTimeout(120); } };
    const hoje = new Date().toDateString();

    // erro ao abrir, com o Umami chegando 1,5 s depois
    let t = await abre({ store: { "colmeia:stats": '{"badges":null}' } }, { tarde: 1500, espera: 3000 });
    let r = await t.erros();
    ok(r.length === 1 && r[0].fase === "inicio" && r[0].tipo === "erro" && /^TypeError: .* @ renderStats@\d+:\d+$/.test(r[0].erro), "erro ao abrir o jogo é registrado, mesmo com o Umami chegando depois" + (r.length ? ": " + JSON.stringify(r) : ""));
    await t.c.close();

    // erro jogando (timer do aviso), repetido 4 vezes: vai uma vez só
    t = await abre({ store: { "colmeia:sugeridas": '{"x":1}' } });
    await recusa(t.pg, 4); await t.pg.waitForTimeout(300);
    r = await t.erros();
    ok(r.length === 1 && r[0].fase === "jogo" && r[0].modo === "Diário" && /^TypeError: .* @ \S+@\d+:\d+$/.test(r[0].erro), "erro jogando vai com fase e modo, uma vez só" + (r.length ? ": " + JSON.stringify(r) : ""));
    // erros de fora do jogo (extensões, scripts injetados) não contam
    await t.pg.evaluate(() => { const s = document.createElement("script"); s.src = 'data:text/javascript,throw new Error("de fora")'; document.head.appendChild(s); setTimeout(() => { throw new Error("injetado"); }); });
    await t.pg.waitForTimeout(300);
    ok((await t.erros()).length === 1, "erros de fora do jogo são ignorados");
    await t.c.close();

    // promessa rejeitada ao compartilhar, com link e palavra na mensagem e lixo no endereço: nada disso vai junto
    t = await abre({}, { query: "?c=zzzzzzz&fbclid=ABC123456" });
    const centro = await t.pg.$eval("#hive .hex.center", h => h.dataset.l);
    await t.pg.keyboard.type(centro.repeat(2));
    await t.pg.evaluate(() => { Date.prototype.toLocaleDateString = function () { throw new RangeError('locale "maria" https://x.y/?q=1 maria@ex.com 1234567'); }; });
    await t.pg.click("#b-share"); await t.pg.waitForTimeout(300);
    r = await t.erros();
    const tudo = JSON.stringify(r);
    ok(r.length === 1 && r[0].tipo === "promessa" && /shareText@\d+:\d+/.test(r[0].erro), "promessa rejeitada é registrada" + (r.length ? ": " + tudo : ""));
    ok(!/maria|x\.y|\?q=|fbclid|ABC123456|1234567|file:|colmeia-test/.test(tudo) && !tudo.includes(centro.repeat(2)), "nenhum dado pessoal, endereço ou texto digitado vai junto");
    await t.c.close();

    // gravação bloqueada: avisa uma vez, só com o nome do erro
    t = await abre({ semGravar: true });
    for (let i = 0; i < 3; i++) await t.pg.click("#b-theme");
    await t.pg.waitForTimeout(200);
    r = await t.erros();
    ok(r.length === 1 && r[0].tipo === "armazenamento" && r[0].erro === "QuotaExceededError: salvar", "falha ao gravar o progresso é avisada uma vez, sem a mensagem" + (r.length !== 1 || r[0].tipo !== "armazenamento" ? ": " + JSON.stringify(r) : ""));
    await t.c.close();

    // limite por carregamento (4 erros diferentes, vão 3) e por aparelho por dia (já com 10 hoje, vai 0)
    const quatro = { "colmeia:sugeridas": '{"x":1}', "colmeia:sound": "{quebrado" };
    t = await abre({ store: quatro, semGravar: true });
    await recusa(t.pg, 1);
    await t.pg.evaluate(() => { Date.prototype.toLocaleDateString = function () { throw new RangeError("x"); }; });
    await t.pg.click("#b-share"); await t.pg.waitForTimeout(300);
    ok((await t.erros()).length === 3, "no máximo 3 erros por carregamento");
    await t.c.close();
    t = await abre({ store: { "colmeia:stats": '{"badges":null}', "colmeia:erros": JSON.stringify({ d: hoje, n: 10 }) } });
    ok((await t.erros()).length === 0, "no máximo 10 erros por aparelho por dia");
    await t.c.close();

    // Umami quebrado: sem laço, e o jogo continua
    t = await abre({ store: quatro, quebrado: true, semGravar: true });
    await recusa(t.pg, 5); await t.pg.waitForTimeout(1500);
    const chamadas = await t.pg.evaluate(() => window.__calls);
    await t.pg.keyboard.type(centro.repeat(2));
    const jogo = await t.pg.evaluate(() => ({ hex: document.querySelectorAll("#hive .hex").length, entrada: document.getElementById("entry").textContent.trim().length }));
    ok(chamadas <= 8 && jogo.hex === 7 && jogo.entrada > 0, `com o Umami quebrado não entra em laço e o jogo segue (${chamadas} chamadas)`);
    await t.c.close();

    // sem a tag (Artifact e colmeia.html): nada é enviado
    t = await abre({ store: { "colmeia:sugeridas": '{"x":1}' } }, { url });
    await recusa(t.pg, 1); await t.pg.waitForTimeout(300);
    ok(await t.pg.evaluate(() => window.__ev.length) === 0, "sem a tag do Umami nenhum erro é enviado (Artifact)");
    await t.c.close();
  }

  ok(errors.length === 0, "nenhum erro de script" + (errors.length ? ": " + errors.join(" | ") : ""));
  await browser.close();
  console.log(fails ? `\n${fails} teste(s) falharam` : "\nTodos os testes passaram");
  process.exit(fails ? 1 : 0);
})();
