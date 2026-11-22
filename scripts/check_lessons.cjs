// Check every lesson: loads, citations resolve, quiz answers aren't given away by length or position, times.
// Run: node scripts/check_lessons.cjs
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "..", "src", "legacy", "content");
const L = [];
global.GW = { lesson: (o) => L.push(o) };
for (const f of fs.readdirSync(dir).sort()) { try { eval(fs.readFileSync(path.join(dir, f), "utf8")); L[L.length - 1].file = f; } catch (e) { console.log("LOAD ERROR", f, e.message); process.exitCode = 1; } }
const txt = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
let qs = 0, longest = 0, problems = 0, eq = 0, el = 0; const pos = [0, 0, 0, 0, 0];
console.log("lesson".padEnd(26), "words  min  ex task chk  src  expanded");
for (const o of L) {
  const h = o.html, body = h.split('<section class="sources">')[0], srcHtml = h.split('<section class="sources">')[1] || "";
  const nSrc = (srcHtml.match(/<li/g) || []).length;
  const words = txt(body).split(" ").length, acts = body.split('<div class="activity">').length - 1, tasks = (body.match(/data-w="task"/g) || []).length;
  const checks = [...body.matchAll(/<div class="check( warmup)?" data-a="(\d)"><p class="q">[\s\S]*?<\/p><ul>([\s\S]*?)<\/ul>/g)];
  const min = Math.max(10, Math.round((words / 220 + (acts - tasks) * 4 + tasks * 8 + checks.length * 0.75) / 5) * 5);
  for (const c of checks) {
    const a = +c[2], lis = [...c[3].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => txt(m[1]).length);
    qs++; pos[a]++; const isL = lis.indexOf(Math.max(...lis)) === a; if (isL) longest++; if (h.includes("<!-- expanded -->")) { eq++; if (isL) el++; }
    if (a >= lis.length) { console.log("  BAD ANSWER INDEX", o.id, txt(c[0]).slice(0, 60)); problems++; }
  }
  for (const m of body.matchAll(/\[(\d+)\]/g)) if (+m[1] > nSrc) { console.log("  CITATION OUT OF RANGE", o.id, m[0], "of", nSrc); problems++; }
  console.log(o.id.padEnd(26), String(words).padStart(5), String(min).padStart(4), String(acts).padStart(3), String(tasks).padStart(4), String(checks.length).padStart(3), String(nSrc).padStart(4), " ", h.includes("<!-- expanded -->") ? "yes" : "");
}
console.log(`\n${qs} questions; correct answer is the longest option in ${longest} (${Math.round((100 * longest) / qs)}%); answer positions A-D: ${pos.slice(0, 4).join(" / ")}; problems: ${problems}`);
console.log(`expanded lessons: ${eq} questions, longest-is-correct in ${el} (${eq ? Math.round((100 * el) / eq) : 0}%)`);
if (problems) process.exitCode = 1;
