// Coletor do painel de uso (spec 009). Roda no GitHub Actions a cada hora.
// Lê os números do Umami pelo link de compartilhamento e grava um resumo em metricas.json.
// Uso: UMAMI_SHARE=<link ou id de compartilhamento> node ferramentas/metricas.mjs [saida.json]
import { writeFileSync } from "node:fs";

const SHARE = (process.env.UMAMI_SHARE || "").trim();
// Umami Cloud serve o app (e a API usada pelo link de compartilhamento) em /analytics/<região>/
const regiao = (SHARE.match(/\/analytics\/([a-z]+)\/share\//) || [, "us"])[1];
const BASE = (process.env.UMAMI_API || `https://cloud.umami.is/analytics/${regiao}/api`).replace(/\/$/, "");
const TZ = "America/Sao_Paulo";
const OUT = process.argv[2] || "metricas.json";
const DIAS = 30;          // série diária
const DIAS_EVENTOS = 14;  // valores dos eventos dia a dia

if (!SHARE) { console.error("Falta UMAMI_SHARE"); process.exit(1); }
const shareId = SHARE.includes("/share/") ? SHARE.split("/share/")[1].split(/[/?#]/)[0] : SHARE;

const erros = [];
async function get(path, token) {
  const headers = { accept: "application/json" };
  if (token) Object.assign(headers, { "x-umami-share-token": token, "x-umami-share-context": "1" });
  const r = await fetch(BASE + path, { headers });
  if (!r.ok) throw new Error(`${r.status} em ${path.split("?")[0]}`);
  return r.json();
}
async function tenta(nome, f, padrao) {
  try { return await f(); } catch (e) { erros.push(`${nome}: ${e.message}`); return padrao; }
}

// meia-noite em São Paulo (UTC-3, sem horário de verão desde 2019)
const OFF = 3 * 3600e3;
const inicioDia = t => Math.floor((t - OFF) / 864e5) * 864e5 + OFF;
const diaISO = t => new Date(t - OFF).toISOString().slice(0, 10);

const agora = Date.now(), hoje = inicioDia(agora);
const share = await get(`/share/${encodeURIComponent(shareId)}`);
const site = share.websiteId, token = share.token;
if (!site || !token) { console.error("Link de compartilhamento sem websiteId/token"); process.exit(1); }
const W = `/websites/${site}`;
const q = (a, b, extra = "") => `startAt=${a}&endAt=${b}&timezone=${encodeURIComponent(TZ)}${extra}`;

const num = v => (v && typeof v === "object" && "value" in v ? +v.value : +v || 0);   // v2: {value, prev}; v3: número
const resumo = s => s ? { visitantes: num(s.visitors), visitas: num(s.visits), paginas: num(s.pageviews), saidas: num(s.bounces), tempo: num(s.totaltime) } : null;

const periodos = {};
for (const [k, a] of [["hoje", hoje], ["d7", hoje - 6 * 864e5], ["d30", hoje - (DIAS - 1) * 864e5], ["total", Date.UTC(2026, 9, 3)]])
  periodos[k] = await tenta("stats " + k, async () => resumo(await get(`${W}/stats?${q(a, agora)}`, token)), null);

const ini30 = hoje - (DIAS - 1) * 864e5;
const pv = await tenta("pageviews", () => get(`${W}/pageviews?${q(ini30, agora, "&unit=day")}`, token), {});
const serie = {};
for (let t = ini30; t <= hoje; t += 864e5) serie[diaISO(t)] = { dia: diaISO(t), paginas: 0, visitas: 0 };
const dataDe = x => String(x).slice(0, 10);
for (const p of pv.pageviews || []) if (serie[dataDe(p.x)]) serie[dataDe(p.x)].paginas = +p.y || 0;
for (const p of pv.sessions || []) if (serie[dataDe(p.x)]) serie[dataDe(p.x)].visitas = +p.y || 0;

const metrica = tipo => tenta("metrics " + tipo, async () =>
  (await get(`${W}/metrics?${q(ini30, agora, `&type=${tipo}&limit=12`)}`, token)).map(m => ({ nome: m.x ?? m.name ?? "", total: +(m.y ?? m.visitors ?? m.pageviews ?? 0) })), []);
const listas = {};
for (const [k, tipo] of [["eventos", "event"], ["origens", "referrer"], ["paises", "country"], ["aparelhos", "device"], ["navegadores", "browser"], ["sistemas", "os"]]) listas[k] = await metrica(tipo);

// Propriedades dos eventos. Sem filtro o Umami só diz quais propriedades cada evento tem;
// com &event=<nome> ele devolve os valores. Últimos 30 dias juntos e os últimos 14 dias um a um.
const valor = r => String(r.propertyValue ?? r.value ?? r.stringValue ?? r.numberValue ?? "");
async function propsDe(a, b, nome) {
  const base = await get(`${W}/event-data/events?${q(a, b)}`, token);
  const out = [];
  for (const ev of [...new Set((base || []).map(r => r.eventName))]) {
    const rows = await get(`${W}/event-data/events?${q(a, b, `&event=${encodeURIComponent(ev)}`)}`, token);
    for (const r of rows || []) {
      if (r.propertyValue === undefined && r.value === undefined) { erros.push(`${nome}: ${ev} sem valor (${Object.keys(r).join(",")})`); continue; }
      out.push({ evento: r.eventName || ev, prop: r.propertyName, valor: valor(r), total: +r.total || 0 });
    }
  }
  return out;
}
const propriedades = await tenta("event-data 30d", () => propsDe(ini30, agora, "30d"), []);
const porDia = [];
for (let i = DIAS_EVENTOS - 1; i >= 0; i--) {
  const a = hoje - i * 864e5, b = Math.min(a + 864e5 - 1, agora);
  porDia.push({ dia: diaISO(a), linhas: await tenta("event-data " + diaISO(a), () => propsDe(a, b, diaISO(a)), []) });
}

const saida = { atualizado: new Date(agora).toISOString(), fuso: TZ, periodos, serie: Object.values(serie), ...listas, propriedades, porDia, erros };
writeFileSync(OUT, JSON.stringify(saida));
console.log(`${OUT}: ${periodos.total ? periodos.total.visitantes : "?"} visitantes no total, ${propriedades.length} linhas de eventos, ${erros.length} erro(s)`);
if (erros.length) console.log(erros.join("\n"));
