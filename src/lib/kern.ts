/* Kern course logic, ported unchanged from the original app.js.
   Storage keys (gw-*), the path rules, the progress-code format (v1/v2/v3, CODE_ROLES and CODE_LESSONS order)
   and hash links all match the pre-React site, so saved progress, codes and shared links keep working. */
import "@/legacy/load";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const GW: any = (window as any).GW;

export type Lesson = { id: string; num: number; part: string; minutes: number; title: string; summary: string; role?: string; rid?: string; step?: number };
export type Role = { id: string; name: string; why: string; track?: string; family?: string; also?: string };

// Lessons whose content file isn't loaded are left out. Numbers stay fixed, so text references stay right.
GW.lessons = GW.lessons.filter((l: Lesson) => GW.content[l.id]);
export const lessons: Lesson[] = GW.lessons;
// Lesson time is worked out from the content itself (reading at about 220 words a minute, plus each activity and question),
// so it stays right as lessons grow.
lessons.forEach((l) => {
  const html: string = GW.content[l.id].html, body = html.split('<section class="sources">')[0];
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const acts = body.split('<div class="activity">').length - 1, tasks = (body.match(/data-w="task"/g) || []).length, checks = (body.match(/class="check[ "]/g) || []).length;
  l.minutes = Math.max(10, Math.round((words / 220 + (acts - tasks) * 4 + tasks * 8 + checks * 0.75) / 5) * 5);
});
export const byId: Record<string, Lesson> = {};
lessons.forEach((l) => (byId[l.id] = l));
export const hasUseCases = !!(GW.useCases && GW.useCases.length);

/* ---------- roles and paths ---------- */
export const GENERAL: Role = { id: "general", name: "General", why: "A neutral path for anyone: the core lessons and the capstone, with examples that apply to any role." };
export function roleInfo(r: string): Role | null { if (r === "general") return GENERAL; return GW.roles.find((x: Role) => x.id === r) || null; }
export const coreIds = lessons.filter((l) => l.part === "a" || l.part === "b").map((l) => l.id);
export const coreLast = coreIds.length;
export const MAXR = 3;
const lessonPos: Record<string, number> = {};
lessons.forEach((l, i) => (lessonPos[l.id] = i));
export function cleanRoles(list: unknown): string[] {
  if (typeof list === "string") list = [list];
  if (!Array.isArray(list)) return [];
  const out: string[] = [];
  list.forEach((r) => { if (roleInfo(r) && out.indexOf(r) < 0) out.push(r); });
  return out.indexOf("general") > -1 ? ["general"] : out.slice(0, MAXR);
}
export function trackIdOf(r: string) { const x = roleInfo(r); return x && x.track ? x.track : r; }
export function trackName(t: string): string { const x = GW.tracks.find((k: { id: string }) => k.id === t); return x ? x.name : ""; }
export function uniq<T>(a: T[]) { return a.filter((x, i) => a.indexOf(x) === i); }
export function trackOf(r: string) { const t = trackIdOf(r); return lessons.filter((l) => l.rid === t).map((l) => l.id); }
export function routeFor(input: string[]) {
  const list = cleanRoles(input);
  if (!list.length || list[0] === "general") return coreIds.concat(["team-adoption"]);
  let extra = trackOf(list[0]).concat(list.length === 1 ? [roleInfo(list[0])!.also as string] : list.slice(1).map(trackIdOf));
  extra = extra.filter((id, i) => id && extra.indexOf(id) === i).sort((a, b) => lessonPos[a] - lessonPos[b]);
  return coreIds.concat(extra).concat(["team-adoption"]);
}
export function trackSpan(r: string) { const t = trackOf(r), a = byId[t[0]].num, b = byId[t[t.length - 1]].num; return a === b ? "Lesson " + a : "Lessons " + a + "–" + b; }
export function pathName(list: string[]) {
  const n = list.map((r) => roleInfo(r)!.name);
  if (!n.length) return "";
  return n.length === 1 ? n[0] : n.length === 2 ? n[0] + " & " + n[1] : n[0] + " +" + (n.length - 1);
}
export function pathLong(list: string[]) {
  const n = list.map((r) => roleInfo(r)!.name);
  return n.length < 3 ? n.join(" and ") : n.slice(0, -1).join(", ") + " and " + n[n.length - 1];
}
export function tagFor(id: string, list: string[]) {
  if (!list.length || list[0] === "general") return "";
  const r = byId[id] && byId[id].rid; if (!r) return "";
  if (r === trackIdOf(list[0])) return list.length > 1 ? "Main role" : "Your role";
  if (list.slice(1).map(trackIdOf).indexOf(r) > -1) return "Your role";
  if (list.length === 1 && r === roleInfo(list[0])!.also) return "Neighbouring role";
  return "";
}
const NUM = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
export function hours(ids: string[]) { const m = ids.reduce((a, id) => a + byId[id].minutes, 0); const h = NUM.format(Math.round((m / 60) * 2) / 2); return h + (h === "1" ? " hour" : " hours"); }
export function plural(n: number, one: string, many?: string) { return n + " " + (n === 1 ? one : many || one + "s"); }
export const totalMin = lessons.reduce((a, l) => a + l.minutes, 0);
export function slug(t: string) { return t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48); }
export function stripTags(s: string) { return String(s || "").replace(/<[^>]+>/g, ""); }

/* ---------- storage: same keys as before ---------- */
export function load<T>(key: string, fallback: T): T { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
export function save(key: string, val: unknown) { try { if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ } }
GW.store = { load, save };

/* ---------- progress codes: v2 (15 chars) and v3 (24 chars); v1 (9 chars) still decodes. Both lists are append-only. ---------- */
const CODE_V = 2, CODE_SLOTS = 51, V3_SLOTS = 90, V2_ROLES = 13;
export const CODE_LESSONS = ["how-models-work", "context", "failure-modes", "choosing-models", "asking-well", "checking-work", "tools-agents", "data-security", "product", "design", "engineering", "qa", "security", "data-analytics", "technical-writing", "delivery", "project-management", "engineering-management", "operations", "customer-support", "team-adoption",
  "product-discovery", "product-ai-features", "design-research", "design-ai-ux", "engineering-agents", "engineering-review", "qa-automation", "qa-ai-features", "security-threat-models", "security-detection", "data-analysis", "data-quality", "docs-for-ai", "docs-maintenance", "delivery-flow", "delivery-rituals", "pm-planning", "pm-vendors", "em-measuring", "em-people", "ops-iac", "ops-llm", "support-knowledge", "support-assistant"];
const CODE_ROLES = ["general", "product", "design", "engineering", "qa", "security", "data-analytics", "technical-writing", "delivery", "project-management", "engineering-management", "operations", "customer-support",
  "web-frontend", "mobile", "test-automation", "systems-engineering", "systems-analysis", "sysadmin", "network-architecture", "database-admin", "cloud", "sre", "data-center",
  "cybersecurity-engineering", "soc", "data-science", "data-engineering", "ai-engineering", "ml-engineering", "ai-research", "ai-strategy", "data-annotation", "solutions-architecture"];
const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function bitsOf(n: number, w: number) { let s = n.toString(2); while (s.length < w) s = "0" + s; return s; }
function crc8(bits: string) { let c = 0; for (let i = 0; i < bits.length; i++) { const fb = ((c >> 7) & 1) ^ (bits[i] === "1" ? 1 : 0); c = (c << 1) & 255; if (fb) c ^= 7; } return c; }
export type Progress = Record<string, boolean>;
export function encodeProgress(roles: string[], progress: Progress) {
  const v3 = roles.some((r) => CODE_ROLES.indexOf(r) >= V2_ROLES) || CODE_LESSONS.slice(CODE_SLOTS).some((id) => progress[id]);
  const rb = v3 ? 6 : 4, slots = v3 ? V3_SLOTS : CODE_SLOTS;
  let b = bitsOf(v3 ? 3 : CODE_V, 4);
  for (let i = 0; i < 3; i++) b += bitsOf(roles[i] ? CODE_ROLES.indexOf(roles[i]) + 1 : 0, rb);
  for (let n = 0; n < slots; n++) b += CODE_LESSONS[n] && progress[CODE_LESSONS[n]] ? "1" : "0";
  b += bitsOf(crc8(b), 8);
  let out = "";
  for (let j = 0; j < b.length; j += 5) out += B32[parseInt(b.slice(j, j + 5), 2)];
  return out;
}
export function prettyCode(c: string) {
  if (c.length === 9) return "KN-" + c.slice(0, 3) + "-" + c.slice(3, 6) + "-" + c.slice(6);
  if (c.length === 24) return "KN-" + c.match(/.{6}/g)!.join("-");
  return "KN-" + c.slice(0, 5) + "-" + c.slice(5, 10) + "-" + c.slice(10);
}
export type Decoded = { error: string } | { error?: undefined; roles: string[]; progress: Progress };
export function decodeProgress(raw: string): Decoded {
  let s = String(raw || "").toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1").replace(/[^0-9A-Z]/g, "");
  if ((s.length === 11 || s.length === 17 || s.length === 26) && /^(KN|1N|GW)/.test(s)) s = s.slice(2);
  if (s.length !== 9 && s.length !== 15 && s.length !== 24) return { error: "A progress code has 15 or 24 letters and numbers after KN, like KN-7K2Q9-M4TAB-8C1DE. Older nine-character codes work too." };
  let b = "";
  for (let i = 0; i < s.length; i++) { const v = B32.indexOf(s[i]); if (v < 0) return { error: "That code has a character that isn't used in progress codes. Check it and try again." }; b += bitsOf(v, 5); }
  const ver = s.length === 9 ? 1 : s.length === 15 ? 2 : 3, rb = ver === 3 ? 6 : 4, slots = ver === 1 ? 21 : ver === 2 ? CODE_SLOTS : V3_SLOTS;
  const body = 4 + 3 * rb + slots;
  if (parseInt(b.slice(body, body + 8), 2) !== crc8(b.slice(0, body))) return { error: "That code doesn't check out. A character may have been mistyped." };
  if (parseInt(b.slice(0, 4), 2) !== ver) return { error: "That code comes from a different version of the course." };
  const rs: string[] = [];
  for (let k = 0; k < 3; k++) { const r = parseInt(b.slice(4 + k * rb, 4 + (k + 1) * rb), 2); if (r > 0 && CODE_ROLES[r - 1]) rs.push(CODE_ROLES[r - 1]); }
  const done: Progress = {}, lb = 4 + 3 * rb;
  CODE_LESSONS.slice(0, slots).forEach((id, n) => { if (b[lb + n] === "1") done[id] = true; });
  return { roles: cleanRoles(rs), progress: done };
}
export function resumeLink(code: string) { return location.origin + location.pathname + "#resume=" + code; }
function fallbackCopy(t: string) {
  const ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand("copy"); } catch { ok = false; } ta.remove(); return ok;
}
export function copyText(t: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(() => true, () => fallbackCopy(t));
  return Promise.resolve(fallbackCopy(t));
}

/* ---------- exercises: every .activity block in the lessons ---------- */
export const EX_KIND: Record<string, string> = { claims: "Flag the claims", sort: "Sort the cases", tokens: "Tokenizer", sampler: "Sampler", context: "Context window", rerank: "Retrieval", matrix: "Risk matrix", injection: "Prompt injection", evalsim: "Eval simulator", coverage: "Test coverage", contrast: "Contrast check", codetest: "Run the code", checklist: "Checklist", builder: "Prompt builder", agreement: "Agreement check", agent: "Agent loop", scenario: "Scenario", decide: "Make the call", sim: "Simulation", task: "Open task" };
export const EX_FAM: Record<string, string> = {};
[["Spot the problem", "claims contrast coverage injection"], ["Sort and decide", "sort decide matrix scenario agreement"], ["Simulations", "tokens sampler context rerank agent sim evalsim codetest"], ["Write and apply", "builder checklist task"]].forEach((f) => f[1].split(" ").forEach((w) => (EX_FAM[w] = f[0])));
export type Exercise = { lesson: Lesson; n: number; tag: string; title: string; w: string; kind: string; fam: string };
let exIndex: Exercise[] | null = null;
export function exercises(): Exercise[] {
  if (exIndex) return exIndex;
  exIndex = [];
  lessons.forEach((l) => {
    const c = GW.content[l.id]; if (!c) return;
    c.html.split('<div class="activity">').slice(1).forEach((chunk: string, i: number) => {
      const m = (re: RegExp, d: string) => { const r = chunk.match(re); return r ? r[1] : d; };
      const w = m(/data-w="([a-z-]+)"/, "");
      exIndex!.push({ lesson: l, n: i + 1, tag: m(/class="tag">([^<]*)</, "Practice"), title: stripTags(m(/class="ttl">([^<]*)</, "Exercise")), w, kind: EX_KIND[w] || "", fam: EX_FAM[w] || "Write and apply" });
    });
  });
  return exIndex;
}

/* ---------- search index ---------- */
export type Hit = { g: string; kind: string; title: string; text: string; go: string; sec?: string; scroll?: string; term?: string };
let index: Hit[] | null = null;
export function searchIndex(): Hit[] {
  if (index) return index;
  index = [];
  lessons.forEach((l) => {
    const c = GW.content[l.id] || {};
    index!.push({ g: "Lessons", kind: "Lesson " + l.num, title: l.title, text: stripTags(l.summary + " " + (c.lede || "")), go: l.id });
    const re = /<h2[^>]*>([\s\S]*?)<\/h2>/g; let m;
    while ((m = re.exec(c.html || ""))) { const tt = stripTags(m[1]).trim(); index!.push({ g: "Sections", kind: "In: " + l.title, title: tt, text: "", go: l.id, sec: slug(tt) }); }
  });
  Object.keys(GW.glossary).forEach((k) => index!.push({ g: "Terms", kind: "Glossary", title: GW.glossary[k][0], text: GW.glossary[k][1], go: "glossary", term: k }));
  (GW.useCases || []).forEach((u: any) => index!.push({ g: "Use cases", kind: "Use case: " + trackName(u.r), title: u.t, text: u.d + " " + u.c, go: "usecase/" + slug(u.t) }));
  exercises().forEach((x) => index!.push({ g: "Exercises", kind: "Exercise in lesson " + x.lesson.num, title: x.title, text: x.kind + " " + x.tag, go: x.lesson.id, scroll: "ex-" + x.n }));
  (GW.practice || []).forEach((p: any, i: number) => index!.push({ g: "Practice", kind: "You decide: " + trackName(p.r), title: p.t, text: stripTags(p.ctx), go: "practice/" + (i + 1) }));
  return index;
}

export const HERO_ROLES = ["software engineers", "designers", "data scientists", "DevOps engineers", "product managers", "AI engineers", "QA testers", "security analysts",
  "frontend developers", "cloud engineers", "data analysts", "solutions architects", "mobile developers", "SREs", "ML engineers", "support specialists",
  "systems engineers", "data engineers", "security engineers", "technical writers", "automation engineers", "network architects", "AI researchers", "project managers",
  "sysadmins", "database admins", "SOC analysts", "AI strategists", "systems analysts", "delivery leads", "data annotators", "data center techs", "engineering managers"];
export const version: string = GW.version || "";
