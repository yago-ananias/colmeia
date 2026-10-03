// Verificação diária do site da Colmeia. Roda no GitHub Actions uma vez por dia (.github/workflows/verificar-site.yml).
// Abre o site publicado num Chromium sem tela, como um jogador, e confere se o jogo funciona.
// Não conta visita nem gasta evento no Umami: só o próprio site e as fontes do Google passam; o script do Umami
// é trocado por um de mentira que só anota os eventos na página, e qualquer outro endereço de fora é bloqueado.
// Uso: node ferramentas/verificar-site.mjs [url] [saida.json]   (no GitHub Actions: ... https://yago-ananias.github.io/colmeia/ verificacao.json)
// Sai com código 1 se algo falhar e grava um resumo { ok, quando, url, ms, duracao, tentativas, checks: [{ nome, ok, detalhe }] }.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

let chromium;
try { ({ chromium } = await import("playwright")); }
catch (e) { ({ chromium } = createRequire(import.meta.url)("/opt/node22/lib/node_modules/playwright")); }

const SITE = process.argv[2] || process.env.SITE_URL || "https://yago-ananias.github.io/colmeia/";
const SAIDA = process.argv[3] || join(tmpdir(), "colmeia-verificacao.json");   // fora do repositório, para não ir num commit
const FUSO = "America/Sao_Paulo";   // o dia do jogo vira à meia-noite do aparelho; os jogadores estão no Brasil
const EPOCH = [2026, 9, 1];         // mesmo EPOCH de template.html (dia 1 = 01/10/2026)
const LIMITE_CARGA = 10000;         // ms até o evento load; acima disso falha
const PAUSA = +process.env.PAUSA_MS || 60000;   // espera antes da segunda tentativa
const ARQUIVOS = ["manifest.webmanifest", "favicon.ico", "favicon.svg", "icone-192.png", "apple-touch-icon.png"];
const HOST = new URL(SITE).hostname;
const fontes = h => /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(h);
const umamiHost = h => /umami/i.test(h);
const STUB = "window.__eventos=[];window.umami={track:function(n,d){window.__eventos.push([String(n),d||{}])}};";
const dorme = ms => new Promise(r => setTimeout(r, ms));
const hostDe = u => { try { return new URL(u).hostname; } catch (e) { return ""; } };
const caminho = u => { try { return new URL(u).pathname; } catch (e) { return u; } };

async function verificar(browser) {
  const checks = [];
  const marca = (nome, ok, detalhe = "") => {
    checks.push({ nome, ok: !!ok, detalhe: String(detalhe).slice(0, 300) });
    console.log(`  ${ok ? "ok    " : "FALHOU"} ${nome}${detalhe ? " (" + detalhe + ")" : ""}`);
  };
  const passo = async (nome, f) => {
    try { const [ok, detalhe] = await f(); marca(nome, ok, detalhe); return ok; }
    catch (e) { marca(nome, false, "erro na verificação: " + String(e.message || e).split("\n")[0]); return false; }
  };

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, colorScheme: "light", locale: "pt-BR",
    timezoneId: FUSO, serviceWorkers: "block" });
  // segunda trava: o script verdadeiro do Umami (se algum dia passar) também não envia nada com isto
  await ctx.addInitScript(() => { try { localStorage.setItem("umami.disabled", "1"); } catch (e) {} });
  const umami = { script: 0, outros: 0 }, bloqueados = new Set();
  await ctx.route("**/*", route => {
    const u = route.request().url(), h = hostDe(u);
    if (umamiHost(h)) {
      if (/\.js$/.test(caminho(u))) { umami.script++; return route.fulfill({ status: 200, contentType: "text/javascript", body: STUB }); }
      umami.outros++; return route.abort("blockedbyclient");
    }
    if (h === HOST || fontes(h)) return route.continue();
    bloqueados.add(h); return route.abort("blockedbyclient");
  });

  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const errosJs = [], errosConsole = [], falhas = [], deFora = [];
  page.on("pageerror", e => errosJs.push(String(e.message || e).split("\n")[0]));
  page.on("console", m => {
    if (m.type() !== "error") return;
    const u = (m.location() || {}).url || "";
    if (!u || hostDe(u) === HOST) errosConsole.push(m.text().slice(0, 150)); else deFora.push(m.text().slice(0, 100));
  });
  page.on("response", r => { if (hostDe(r.url()) === HOST && r.status() >= 400) falhas.push(r.status() + " " + caminho(r.url())); });
  page.on("requestfailed", r => {
    const h = hostDe(r.url()), erro = (r.failure() || {}).errorText || "";
    if (h === HOST) falhas.push(caminho(r.url()) + " " + erro);
    else if (fontes(h)) deFora.push("fonte do Google não carregou (" + erro + ")");
  });

  // 1. o site responde
  const t0 = Date.now();
  let resp = null;
  const respondeu = await passo("Site responde", async () => {
    resp = await page.goto(SITE, { waitUntil: "load", timeout: 45000 });
    const st = resp ? resp.status() : 0, tipo = resp ? resp.headers()["content-type"] || "" : "";
    return [st === 200 && tipo.includes("text/html"), `HTTP ${st} em ${Date.now() - t0} ms`];
  });
  if (!respondeu) { await ctx.close(); return { checks, ms: null }; }
  await page.waitForTimeout(600);
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType("navigation")[0];
    return n ? { carga: Math.round(n.loadEventEnd), dom: Math.round(n.domContentLoadedEventEnd), kb: Math.round((n.encodedBodySize || n.transferSize || 0) / 1024) } : null;
  });

  // 2. a página tem o jogo
  const temJogo = await passo("Página tem o jogo", async () => {
    const j = await page.evaluate(() => ({ titulo: document.title, hive: !!document.getElementById("hive"),
      palavras: typeof WORDS !== "undefined" ? WORDS.length : 0, dias: typeof DAYS !== "undefined" ? DAYS.length : 0,
      livre: typeof LIVRE !== "undefined" ? LIVRE.length : 0 }));
    return [j.hive && j.palavras > 5000 && j.dias >= 3 && j.livre > 0,
      `"${j.titulo}", ${j.palavras} palavras, ${j.dias / 3} dias de diários, ${j.livre} desafios no Livre`];
  });
  if (!temJogo) { await ctx.close(); return { checks, ms: nav && nav.carga }; }

  // 3. a ajuda abre sozinha na primeira visita e fecha pelo botão Jogar
  await passo("Ajuda abre e fecha", async () => {
    const aberta = await page.$eval("#overlay", e => !e.hidden && e.textContent.includes("Como jogar"));
    await page.click('#sheet button[data-act="close"]');
    await page.waitForTimeout(250);
    const fechada = await page.evaluate(() => document.getElementById("overlay").hidden && !document.querySelector(".app").inert);
    return [aberta && fechada, `abriu na primeira visita: ${aberta ? "sim" : "não"}; fechou: ${fechada ? "sim" : "não"}`];
  });

  // 4. a colmeia mostra 7 letras diferentes, uma no centro
  const colmeia = await page.evaluate(() => ({
    letras: [...document.querySelectorAll("#hive .hex")].map(h => h.dataset.l),
    centro: (document.querySelector("#hive .hex.center") || {}).dataset?.l || "",
    centros: document.querySelectorAll("#hive .hex.center").length }));
  await passo("Colmeia com 7 letras", async () => {
    const ok = colmeia.letras.length === 7 && new Set(colmeia.letras).size === 7 && colmeia.letras.every(l => /^[a-z]$/.test(l)) && colmeia.centros === 1;
    return [ok, `${colmeia.letras.join("").toUpperCase()} (central ${colmeia.centro.toUpperCase()})`];
  });

  // 5. os três desafios de hoje estão lá e a colmeia é o desafio Manhã de hoje (mesma conta de dayNumber/dailyCode)
  await passo("Três desafios do dia", async () => {
    const d = await page.evaluate(ep => {
      const agora = new Date(), hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
      const dia = Math.round((hoje - new Date(ep[0], ep[1], ep[2])) / 864e5) + 1;
      return { dia, codigos: [0, 1, 2].map(k => DAYS[((dia - 1) * 3 + k) % DAYS.length]), restantes: DAYS.length / 3 - dia,
        botoes: [...document.querySelectorAll("#dailies button b")].map(b => b.textContent),
        manha: (document.querySelector("#dailies button") || {}).getAttribute?.("aria-pressed"),
        sub: (document.getElementById("ranksub") || {}).textContent || "" };
    }, EPOCH);
    const naColmeia = colmeia.centro + colmeia.letras.filter(l => l !== colmeia.centro).sort().join("");
    const esperado = d.codigos[0] ? d.codigos[0][0] + [...d.codigos[0].slice(1)].sort().join("") : "";
    const ok = d.botoes.join(",") === "Manhã,Tarde,Noite" && d.manha === "true" && new Set(d.codigos).size === 3
      && naColmeia === esperado && d.sub.startsWith(`Dia ${d.dia} · Manhã`) && d.restantes >= 0;
    return [ok, `dia ${d.dia}: ${d.codigos.join(", ")}; colmeia ${naColmeia}; botões ${d.botoes.join("/") || "nenhum"}; `
      + (d.restantes >= 0 ? `diários programados por mais ${d.restantes} dias` : "a programação de diários acabou (desafios repetindo)")];
  });

  // 6. uma palavra válida de hoje é aceita e pontua (tocando nas letras e em Enviar, como no celular)
  await passo("Palavra válida aceita e pontua", async () => {
    const { palavra, total } = await page.evaluate(() => {
      const c = document.querySelector("#hive .hex.center").dataset.l, L = new Set([...document.querySelectorAll("#hive .hex")].map(h => h.dataset.l));
      const v = WORDS.filter(w => w.length >= 4 && w.includes(c) && [...w].every(x => L.has(x))).sort((a, b) => a.length - b.length || a.localeCompare(b));
      return { palavra: v[0] || "", total: v.length };
    });
    if (!palavra) return [false, "nenhuma palavra da lista cabe nesta colmeia"];
    for (const ch of palavra) await page.click(`#hive .hex[data-l="${ch}"]`);
    await page.click("#b-enter");
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => ({ achadas: document.querySelectorAll("#words li").length, pts: +document.getElementById("pts").textContent,
      titulo: document.getElementById("foundtitle").textContent }));
    return [r.achadas === 1 && r.pts > 0 && r.titulo.startsWith("1 de "), `"${palavra}" → ${r.pts} pt; ${r.titulo} (${total} possíveis)`];
  });

  // 7. uma palavra fora da lista é recusada
  await passo("Palavra inválida recusada", async () => {
    const lixo = colmeia.centro.repeat(4);
    for (const ch of lixo) await page.click(`#hive .hex[data-l="${ch}"]`);
    await page.click("#b-enter");
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => ({ achadas: document.querySelectorAll("#words li").length, aviso: (document.querySelector("#toast span") || {}).textContent || "" }));
    return [r.achadas === 1 && /Não está na lista/.test(r.aviso), `"${lixo}": ${r.aviso || "sem aviso"}`];
  });

  // 8. o tema escuro liga e desliga
  await passo("Tema escuro", async () => {
    const fundo = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const claro = await fundo();
    await page.click("#b-theme"); await page.waitForTimeout(150);
    const tema = await page.evaluate(() => document.documentElement.dataset.theme), escuro = await fundo();
    await page.click("#b-theme"); await page.waitForTimeout(150);
    const volta = await fundo();
    return [tema === "dark" && escuro !== claro && volta === claro, `${claro} → ${escuro} → ${volta}`];
  });

  // 9. o Relâmpago começa e o relógio anda
  await passo("Relâmpago começa", async () => {
    await page.click("#m-relampago"); await page.waitForTimeout(300);
    const ativo = await page.$eval("#m-relampago", e => e.getAttribute("aria-pressed") === "true");
    const c1 = await page.$eval("#clock", e => e.hidden ? "" : e.textContent);
    await page.waitForTimeout(1600);
    const c2 = await page.$eval("#clock", e => e.hidden ? "" : e.textContent);
    const letras = await page.$$eval("#hive .hex", h => h.length);
    return [ativo && !!c1 && c1 !== c2 && letras === 7, `relógio ${c1 || "escondido"} → ${c2 || "escondido"}`];
  });

  // 10. ícones e manifesto do site
  await passo("Ícones e manifesto", async () => {
    const ruins = [];
    for (const f of ARQUIVOS) { const r = await ctx.request.get(new URL(f, SITE).href, { timeout: 15000 }); if (r.status() !== 200) ruins.push(`${f} ${r.status()}`); }
    return [ruins.length === 0, ruins.length ? ruins.join(", ") : `${ARQUIVOS.length} arquivos com HTTP 200`];
  });

  // 11. tempo de carregamento
  await passo("Tempo de carregamento", async () =>
    [!!nav && nav.carga > 0 && nav.carga <= LIMITE_CARGA, nav ? `${nav.carga} ms até carregar (pronto para jogar em ${nav.dom} ms; página ${nav.kb} KB)` : "sem medição"]);

  // 12. as métricas continuam ligadas no site, mas nada saiu daqui para o Umami
  const eventos = await page.evaluate(() => (window.__eventos || []).map(e => e[0]));
  await passo("Métricas ligadas, sem envio", async () => {
    const tag = await page.evaluate(() => (document.querySelector("script[data-website-id]") || {}).src || "");
    const ok = !!tag && umamiHost(hostDe(tag)) && umami.script >= 1 && umami.outros === 0 && eventos.includes("partida") && eventos.includes("carregamento");
    return [ok, tag ? `${umami.script} script trocado, ${umami.outros} envio bloqueado; eventos anotados: ${[...new Set(eventos)].join(", ") || "nenhum"}`
      : "a página não tem a tag do Umami (o site não está medindo)"];
  });

  // 13. nenhum erro de script durante tudo isso (erros de endereços de fora, como as fontes do Google, só aparecem no detalhe)
  await page.waitForTimeout(300);
  await passo("Sem erros no jogo", async () => {
    const doJogo = eventos.filter(e => /^erro/.test(e)).length;
    const todos = [...errosJs.map(e => "script: " + e), ...errosConsole.map(e => "console: " + e), ...falhas.map(e => "arquivo: " + e)];
    if (doJogo) todos.push(`${doJogo} erro(s) registrados pelo jogo`);
    const extra = deFora.length ? ` · de fora (não conta): ${[...new Set(deFora)].slice(0, 2).join("; ")}` : "";
    return [todos.length === 0, (todos.length ? todos.slice(0, 4).join(" | ") : "nenhum erro") + extra];
  });

  if (bloqueados.size) console.log("  endereços de fora bloqueados: " + [...bloqueados].join(", "));
  await ctx.close();
  return { checks, ms: nav ? nav.carga : null };
}

function minutosEmBrasilia() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: FUSO, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  return +p.hour * 60 + +p.minute;
}

const inicio = Date.now();
// perto da meia-noite de Brasília o jogo troca os desafios no meio da verificação: espera a virada passar
const m = minutosEmBrasilia();
if (m >= 23 * 60 + 57 || m < 3) { console.log("Perto da meia-noite em Brasília: esperando 6 minutos para o jogo virar o dia"); await dorme(6 * 60000); }

console.log(`Verificando ${SITE}`);
const browser = await chromium.launch();
let r = null, primeira = null;
for (let tentativa = 1; tentativa <= 2; tentativa++) {
  console.log(`Tentativa ${tentativa}`);
  try { r = await verificar(browser); }
  catch (e) { console.log("  FALHOU a verificação parou: " + e.message); r = { checks: [{ nome: "Verificação chegou ao fim", ok: false, detalhe: String(e.message).slice(0, 300) }], ms: null }; }
  r.tentativas = tentativa;
  if (r.checks.every(c => c.ok)) break;
  if (tentativa === 1) {
    primeira = r.checks.filter(c => !c.ok).map(c => c.nome);
    console.log(`Algo falhou (${primeira.join(", ")}); tentando de novo em ${PAUSA / 1000} s, pode ser instabilidade da rede`);
    await dorme(PAUSA);
  }
}
await browser.close();

const ok = r.checks.length > 0 && r.checks.every(c => c.ok);
const resumo = { ok, quando: new Date().toISOString(), url: SITE, ms: r.ms, duracao: Math.round((Date.now() - inicio) / 1000),
  tentativas: r.tentativas, ...(ok && primeira ? { instavel: primeira } : {}), checks: r.checks };
writeFileSync(SAIDA, JSON.stringify(resumo, null, 1));
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Verificação do site: ${ok ? "tudo certo" : "algo quebrou"}\n\n${SITE}\n\n| | Verificação | Detalhe |\n|---|---|---|\n`
    + r.checks.map(c => `| ${c.ok ? "ok" : "**FALHOU**"} | ${c.nome} | ${c.detalhe.replace(/\|/g, "/")} |`).join("\n") + "\n");
}
const falhas = r.checks.filter(c => !c.ok).length;
console.log(ok ? `\nSite funcionando: ${r.checks.length} verificações passaram${primeira ? " (na segunda tentativa)" : ""}. Resumo em ${SAIDA}`
  : `\n${falhas} verificação(ões) falharam. Resumo em ${SAIDA}`);
process.exit(ok ? 0 : 1);
