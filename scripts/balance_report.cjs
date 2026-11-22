// List quiz questions in expanded lessons where the right answer is the longest option.
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "..", "src", "legacy", "content");
const L = []; global.GW = { lesson: (o) => L.push(o) };
for (const f of fs.readdirSync(dir).sort()) eval(fs.readFileSync(path.join(dir, f), "utf8"));
const txt = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
for (const o of L) {
  if (process.argv[2] && o.id !== process.argv[2]) continue;
  if (!o.html.includes("<!-- expanded -->")) continue;
  for (const c of o.html.matchAll(/<div class="check( warmup)?" data-a="(\d)"><p class="q">([\s\S]*?)<\/p><ul>([\s\S]*?)<\/ul>/g)) {
    const a = +c[2], lis = [...c[4].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => txt(m[1]));
    const lens = lis.map((x) => x.length);
    if (lens.indexOf(Math.max(...lens)) === a) console.log(o.id, "|", txt(c[3]).slice(0, 50), "| lens", lens.join(","), "answer", a);
  }
}
