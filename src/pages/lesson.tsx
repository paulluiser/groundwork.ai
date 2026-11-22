import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, FlaskConical, HelpCircle, Lightbulb, ListChecks, ListOrdered, Play, Target, CalendarCheck, BarChart3, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { LessonRail } from "@/components/shell";
import { byId, copyText, EX_KIND, GENERAL, GW, lessons, load, plural, roleInfo, routeFor, save, slug, stripTags, trackIdOf, trackName } from "@/lib/kern";
import { go, useStore } from "@/lib/store";
import { registerLessonBlocks } from "@/lib/lessonBlocks";
registerLessonBlocks();
import { cn } from "@/lib/utils";

const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const KIND_ICON = { Reading: BookOpen, Example: Lightbulb, Exercise: FlaskConical, Quiz: HelpCircle, Task: CalendarCheck } as const;
type Kind = keyof typeof KIND_ICON;

/* The worked example for the learner's roles, inserted before the knowledge checks (same markup as before). */
function roleExample(id: string, roles: string[]) {
  const set = GW.roleEx && GW.roleEx[id]; if (!set) return "";
  const seen: string[] = [];
  const list = roles.filter((r) => { const t = trackIdOf(r); if (r === "general" || !set[t] || seen.includes(t)) return false; seen.push(t); return true; });
  if (list.length < 2) {
    const info = list.length ? roleInfo(list[0])! : GENERAL, gen = info === GENERAL;
    return '<aside class="role-ex" aria-label="Example for your role"><div class="role-ex-h"><span class="tag">' + (gen ? "Example" : "In your role") + "</span><b>" + (gen ? "For any role" : esc(info.name)) + '</b><a href="#role">Change roles</a></div><p>' + (gen ? set.general : set[trackIdOf(info.id)]) + "</p></aside>";
  }
  return '<aside class="role-ex" aria-label="Examples for your roles"><div class="role-ex-h"><span class="tag">In your roles</span><span class="rx-tabs" role="group" aria-label="Show the example for">' +
    list.map((r, i) => '<button type="button" class="rx-btn" data-rx="' + r + '" aria-pressed="' + (i === 0) + '">' + esc(roleInfo(r)!.name) + "</button>").join("") +
    '</span><a href="#role">Change roles</a></div>' + list.map((r, i) => '<p data-rx-p="' + r + '"' + (i ? " hidden" : "") + ">" + set[trackIdOf(r)] + "</p>").join("") + "</aside>";
}

/* Split the lesson into the body (with the role example), its sources, and a plan of its sections. */
function prepare(id: string, roles: string[], minutes: number) {
  const c = GW.content[id];
  let body: string = c.html;
  const ex = roleExample(id, roles);
  if (ex) body = body.includes('<section class="checks">') ? body.replace('<section class="checks">', ex + '<section class="checks">') : body + ex;
  let sources = "";
  const si = body.indexOf('<section class="sources">');
  if (si > -1) { const se = body.indexOf("</section>", si) + 10; sources = body.slice(si, se); body = body.slice(0, si) + body.slice(se); }
  if (sources && c.reviewed) { const d = new Date(c.reviewed + "-01T00:00:00"); sources = sources.replace("</h2>", '</h2><p class="reviewed">Last reviewed ' + d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) + ". Figures and studies are as of that date.</p>"); }
  const parts = body.split(/(?=<h2[\s>])|(?=<section class="checks">)/);
  const sections: { title: string; id: string; kind: Kind; w: number }[] = [];
  parts.forEach((p) => {
    const m = p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/); if (!m) return;
    const title = stripTags(m[1]).trim(), acts = p.split('<div class="activity">').length - 1, words = stripTags(p).split(/\s+/).length;
    const kind: Kind = acts || /^Practice/.test(title) ? "Exercise" : /^Check your/.test(title) ? "Quiz" : /^Try it/.test(title) ? "Task" : /^Worked example|^Capstone/.test(title) ? "Example" : "Reading";
    sections.push({ title, id: slug(title), kind, w: words / 200 + acts * 4 + (kind === "Quiz" ? 2 : 0) });
  });
  const tot = sections.reduce((a, s) => a + s.w, 0) || 1;
  const plan = sections.map((s) => ({ ...s, min: Math.max(1, Math.round((s.w / tot) * minutes)) }));
  return { body, sources, plan, nEx: c.html.split('<div class="activity">').length - 1, nChk: (c.html.match(/class="check"/g) || []).length, c };
}

/* The original lesson markup, enhanced exactly as before: exercises, checks, terms, widgets, figures, citations, copy buttons. */
const Body = memo(function Body({ id, html, sources, onTerm, onReady }: { id: string; html: string; sources: string; onTerm: (el: HTMLElement, hover: boolean) => void; onReady: (root: HTMLElement) => void }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const root = ref.current!; const $$ = (s: string, r: ParentNode = root) => Array.from(r.querySelectorAll<HTMLElement>(s));
    // exercises: numbered, labelled with their kind, and closed with a footer so they never read as lesson text
    const acts = $$(".activity");
    acts.forEach((a, i) => {
      a.id = "ex-" + (i + 1);
      const hd = a.querySelector(".activity-h"), w = a.querySelector("[data-w]"), kind = w && EX_KIND[w.getAttribute("data-w")!];
      if (hd) hd.insertAdjacentHTML("afterbegin", '<span class="ex-no">' + (GW.icon ? GW.icon("flask") : "") + "Exercise " + (i + 1) + " of " + acts.length + "</span>" + (kind ? '<span class="ex-kd">' + esc(kind) + "</span>" : ""));
      a.insertAdjacentHTML("beforeend", '<p class="activity-f">End of exercise ' + (i + 1) + ". The lesson continues below.</p>");
    });
    // the explanation printed right after an exercise stays closed until the learner opens it
    acts.forEach((a) => {
      if (!a.querySelector("[data-w]") || a.querySelector('[data-w="task"]')) return;
      const after: HTMLElement[] = [];
      let n = a.nextElementSibling as HTMLElement | null;
      while (n && (n.matches("ol.steps") || n.matches("div.key"))) { after.push(n); n = n.nextElementSibling as HTMLElement | null; }
      if (!after.length) return;
      const d = document.createElement("details"); d.className = "explain";
      d.innerHTML = "<summary>Show the explanation</summary>";
      a.parentNode!.insertBefore(d, after[0]); after.forEach((x) => d.appendChild(x));
    });
    // headings get ids for section links
    const heads = $$(":scope > h2, :scope > section > h2");
    heads.forEach((h) => { if (!h.id) h.id = slug(h.textContent || ""); });
    // the interactive figure follows the first paragraph of its section
    const fspec = GW.figures && GW.figures[id], fig = GW.figure ? GW.figure(id) : null;
    if (fig && fspec) {
      const nz = (x: string) => x.replace(/[’']/g, "'");
      const fh = heads.find((h) => nz(h.textContent || "") === nz(fspec.at)) || heads[0];
      const after = fh.nextElementSibling && fh.nextElementSibling.tagName === "P" ? fh.nextElementSibling : fh;
      after.parentNode!.insertBefore(fig, after.nextSibling);
    }
    // citations: [n] jumps to the matching source
    const srcs = root.parentElement!.querySelectorAll(".sources li");
    $$("sup").forEach((sup) => { sup.innerHTML = sup.innerHTML.replace(/\[(\d+)\]/g, (m, n) => (srcs[n - 1] ? '<a class="cite" href="#' + id + '" data-cite="' + n + '" aria-label="Source ' + n + '">[' + n + "]</a>" : m)); });
    // knowledge checks: lettered options with feedback
    $$(".check").forEach((box) => {
      const ans = parseInt(box.getAttribute("data-a") || "0", 10), lis = $$("li", box), opts = document.createElement("div");
      opts.className = "opts"; opts.setAttribute("role", "group");
      const fb = document.createElement("div"); fb.className = "fb"; fb.hidden = true; fb.setAttribute("aria-live", "polite");
      lis.forEach((li, i) => {
        const b = document.createElement("button"); b.className = "opt"; b.type = "button";
        b.innerHTML = '<span class="ltr">' + "ABCDEF"[i] + "</span><span>" + li.innerHTML + "</span>";
        b.addEventListener("click", () => {
          opts.querySelectorAll(".opt").forEach((o) => o.classList.remove("right", "wrong"));
          const ok = i === ans; b.classList.add(ok ? "right" : "wrong");
          fb.hidden = false; fb.className = "fb " + (ok ? "right" : "wrong");
          fb.innerHTML = "<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + (li.getAttribute("data-fb") || "") + (ok ? "" : " Try another answer.");
        });
        opts.appendChild(b);
      });
      box.querySelector("ul")?.replaceWith(opts); box.appendChild(fb);
    });
    // glossary terms
    $$(".term").forEach((t) => { t.setAttribute("tabindex", "0"); t.setAttribute("role", "button"); t.setAttribute("aria-label", t.textContent + ": show definition"); });
    // the interactive exercises themselves
    $$("[data-w]").forEach((el) => {
      const fn = GW.widgets && GW.widgets[el.getAttribute("data-w")!];
      if (fn) { try { fn(el); } catch (e) { el.textContent = "This activity could not load"; console.error(e); } }
    });
    // copy buttons on code and prompts
    $$("pre.code, .draft.prompt").forEach((box) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "copy-btn"; b.textContent = "Copy";
      b.setAttribute("aria-label", "Copy " + (box.matches("pre") ? "code" : "prompt"));
      b.addEventListener("click", () => { const src = box.matches("pre") ? box : box.querySelector(".draft-b")!; copyText((src as HTMLElement).innerText.trim()).then((ok) => { b.textContent = ok ? "Copied" : "Couldn't copy"; setTimeout(() => (b.textContent = "Copy"), 1600); }); });
      if (box.matches("pre")) { const wrap = document.createElement("div"); wrap.className = "code-wrap"; box.parentNode!.insertBefore(wrap, box); wrap.appendChild(box); wrap.appendChild(b); }
      else (box.querySelector(".draft-h") || box).appendChild(b);
    });
    // clicks inside the lesson: role example tabs, citations, terms
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const rx = t.closest<HTMLElement>(".rx-btn");
      if (rx) { const box = rx.closest(".role-ex")!; box.querySelectorAll(".rx-btn").forEach((x) => x.setAttribute("aria-pressed", String(x === rx))); box.querySelectorAll<HTMLElement>("[data-rx-p]").forEach((p) => (p.hidden = p.getAttribute("data-rx-p") !== rx.getAttribute("data-rx"))); return; }
      const ci = t.closest<HTMLElement>(".cite");
      if (ci) { e.preventDefault(); const li = srcs[+ci.dataset.cite! - 1] as HTMLElement; li.scrollIntoView({ behavior: "smooth", block: "center" }); li.classList.add("flash"); setTimeout(() => li.classList.remove("flash"), 1800); return; }
      const term = t.closest<HTMLElement>(".term");
      if (term) { e.preventDefault(); onTerm(term, false); }
    };
    const onKey = (e: KeyboardEvent) => { const term = (e.target as HTMLElement).closest?.<HTMLElement>(".term"); if (term && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onTerm(term, false); } };
    let hoverT = 0;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const onOver = (e: MouseEvent) => { if (!fine.matches) return; const term = (e.target as HTMLElement).closest?.<HTMLElement>(".term"); if (term) { clearTimeout(hoverT); hoverT = window.setTimeout(() => onTerm(term, true), 350); } };
    const onOut = () => clearTimeout(hoverT);
    root.addEventListener("click", onClick); root.addEventListener("keydown", onKey); root.addEventListener("mouseover", onOver); root.addEventListener("mouseout", onOut);
    onReady(root);
    return () => { root.removeEventListener("click", onClick); root.removeEventListener("keydown", onKey); root.removeEventListener("mouseover", onOver); root.removeEventListener("mouseout", onOut); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <article ref={ref} className="lesson kern-lesson-body" dangerouslySetInnerHTML={{ __html: html }} />
      {sources && <div className="lesson kern-lesson-body" dangerouslySetInnerHTML={{ __html: sources }} />}
    </>
  );
});

export default function LessonPage({ id, target }: { id: string; target: string }) {
  const { roles, progress, toggleDone } = useStore();
  const l = byId[id];
  const path = routeFor(roles), onPath = path.includes(id), seq = onPath ? path.map((x) => byId[x]) : lessons, idx = seq.indexOf(l), prev = seq[idx - 1], next = seq[idx + 1];
  const part = GW.parts.find((p: { id: string }) => p.id === l.part);
  // the body is prepared once per lesson visit; role changes take effect on the next visit
  const prep = useMemo(() => prepare(id, roles, l.minutes), [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [cur, setCur] = useState(0);
  const [readAt, setReadAt] = useState(0);
  const [term, setTerm] = useState<{ k: string; rect: DOMRect; hover: boolean } | null>(null);
  const [resume, setResume] = useState<{ k: number; sec: string; title: string } | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const done = !!progress[id];

  // where the reader is: current section, the plan and outcome ticks, and "continue from" for next time
  useEffect(() => {
    setCur(0); setReadAt(0); setTerm(null);
    const saved = load<Record<string, { k: number; sec: string }>>("gw-read", {})[id];
    if (progress[id] || target) setResume(null);
    else if (saved && saved.k > 0) setResume({ ...saved, title: prep.plan[saved.k]?.title || "" });
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        ticking = false; const root = rootRef.current; if (!root) return;
        let k = 0; prep.plan.forEach((s, j) => { const h = document.getElementById(s.id); if (h && h.getBoundingClientRect().top < 140) k = j; });
        setCur(k); setReadAt((r) => {
          const n = Math.max(r, k);
          if (n > r && !load<Record<string, boolean>>("gw-progress", {})[id]) { const rd = load<Record<string, { k: number; sec: string }>>("gw-read", {}); if (!rd[id] || n > rd[id].k) { rd[id] = { k: n, sec: prep.plan[n].id }; save("gw-read", rd); } }
          return n;
        });
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (done) { const rd = load<Record<string, unknown>>("gw-read", {}); if (rd[id]) { delete rd[id]; save("gw-read", rd); } } }, [done, id]);

  const jump = (secId: string) => document.getElementById(secId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const onReady = (root: HTMLElement) => { rootRef.current = root; if (target) setTimeout(() => document.getElementById(target)?.scrollIntoView({ block: "start" }), 30); };
  const onTerm = (el: HTMLElement, hover: boolean) => { const k = el.getAttribute("data-t")!; if (GW.glossary[k]) setTerm({ k, rect: el.getBoundingClientRect(), hover }); };
  useEffect(() => { if (!term) return; const close = () => setTerm(null); addEventListener("scroll", close, { passive: true, once: true }); return () => removeEventListener("scroll", close); }, [term]);
  const g = term && GW.glossary[term.k];
  const nOut = prep.c.outcomes.length, H = prep.plan.length;

  return (
    <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 pb-28 pt-6 md:px-8 md:pt-8 md:pb-16 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden xl:block"><div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2"><LessonRail active={id} /></div></aside>
      <main id="view" tabIndex={-1} className="min-w-0 outline-none">
        {/* overview */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
          <header className="grid content-start gap-4">
            <p className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground"><Badge>Lesson {l.num}</Badge>{part.title}{l.role && <> · {trackName(l.rid!)} track, {l.step} of 3</>}{done && <Badge className="border-brand-line bg-brand-tint font-normal text-brand"><CheckCircle2 />Completed</Badge>}</p>
            <h1 className="text-h1 font-semibold">{l.title}</h1>
            <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-caption text-muted-foreground">
              {[l.minutes + " min", plural(H, "section"), prep.nEx > 0 && plural(prep.nEx, "exercise"), prep.nChk > 0 && plural(prep.nChk, "quiz question"), roles.length > 0 && (onPath ? "Step " + (idx + 1) + " of " + seq.length + " on your path" : "Not on your path")].filter(Boolean).map((x, i) => <span key={i} className="flex items-center gap-1.5">{i > 0 && <span aria-hidden="true">·</span>}{x}</span>)}
            </p>
            <p className="max-w-[40em] text-base text-ink-2 md:text-lg" dangerouslySetInnerHTML={{ __html: prep.c.lede }} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => prep.plan[0] && jump(prep.plan[0].id)}><Play />{done ? "Review the lesson" : "Start the lesson"}</Button>
              {prep.nEx > 0 && <Button variant="outline" onClick={() => jump("ex-1")}><FlaskConical />Go to the exercises</Button>}
            </div>
            {resume && resume.title && (
              <div className="flex flex-wrap items-center gap-3 text-caption text-muted-foreground">
                <Button variant="secondary" size="sm" onClick={() => { jump(resume.sec); setResume(null); }}>Continue from “{resume.title}”</Button>Where you stopped last time
              </div>
            )}
            <Card className="gap-3 py-4">
              <CardHeader className="px-5"><CardTitle className="flex items-center gap-2 text-sm"><Target className="size-4 text-brand" />You'll learn</CardTitle></CardHeader>
              <CardContent className="px-5">
                <ul className="grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
                  {prep.c.outcomes.map((o: string, i: number) => {
                    const on = done || readAt + 1 >= Math.ceil(((i + 1) * H) / nOut);
                    return (<li key={i} className="grid grid-cols-[16px_1fr] gap-2.5 text-caption text-ink-2"><span className={cn("mt-0.5 grid size-4 place-items-center rounded border", on ? "border-brand bg-brand text-brand-foreground" : "border-input")}>{on && <CheckCircle2 className="size-3" />}</span><span dangerouslySetInnerHTML={{ __html: o }} /></li>);
                  })}
                </ul>
              </CardContent>
            </Card>
          </header>
            <div className="mt-6 lg:hidden">
            <Card className="gap-2 py-4">
              <CardHeader className="px-5"><CardTitle className="flex items-center gap-2 text-sm"><ListChecks className="size-4 text-brand" />Lesson plan</CardTitle><CardAction className="text-xs text-muted-foreground">{l.minutes} min</CardAction></CardHeader>
              <CardContent className="px-3">
                <ol className="divide-y">
                  {prep.plan.map((s, j) => {
                    const Icon = KIND_ICON[s.kind];
                    return (
                        <li key={s.id}>
                          <button type="button" onClick={() => jump(s.id)} className="grid w-full grid-cols-[22px_minmax(0,1fr)] items-start gap-2.5 rounded-md px-2 py-2 text-left text-caption hover:bg-accent">
                            <span className={cn("mt-px grid size-5 place-items-center rounded-full border text-2xs tabular-nums text-muted-foreground", j < readAt && "border-brand bg-brand text-brand-foreground", j === cur && "border-2 border-brand text-foreground")}>{j + 1}</span>
                            <span className="min-w-0"><span className="flex items-center gap-1.5">{s.title}{GW.figures?.[id] && slug(GW.figures[id].at.replace(/’/g, "'")) === slug(s.title.replace(/’/g, "'")) && <BarChart3 className="size-3.5 shrink-0 text-brand" aria-label="Has an interactive figure" />}</span><span className={cn("mt-0.5 flex items-center gap-1 text-xs text-muted-foreground", s.kind === "Exercise" && "font-medium text-foreground", s.kind === "Quiz" && "text-brand")}><Icon className="size-3.5" />{s.kind}<span className="font-normal text-muted-foreground">· {s.min} min</span></span></span>
                          </button>
                        </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
            </div>
          <div className="mt-10 min-w-0">
            <Body key={id} id={id} html={prep.body} sources="" onTerm={onTerm} onReady={onReady} />
            <footer className="mt-12 grid gap-6 border-t pt-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-md text-caption text-muted-foreground">{done ? <>Marked as complete and saved in this browser. To continue on another device, use your <a className="underline underline-offset-4" href="#progress">progress code</a>.</> : "Worked through the activities and the checks? Mark the lesson complete to track your progress."}</p>
                <Button variant={done ? "outline" : "default"} onClick={() => toggleDone(id)} className={cn(done && "border-brand-line text-brand")}>{done ? <><CheckCircle2 />Completed</> : "Mark lesson complete"}</Button>
              </div>
              <nav className="grid gap-3 sm:grid-cols-2" aria-label="Previous and next lessons">
                {prev ? <a href={"#" + prev.id} className="rounded-xl border bg-card p-4 hover:bg-accent"><span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="size-3.5" />Previous{onPath && " on your path"}</span><b className="mt-1 block font-medium">{prev.title}</b></a> : <span />}
                {next ? <a href={"#" + next.id} className="rounded-xl border bg-card p-4 text-right hover:bg-accent"><span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next{onPath && " on your path"}<ArrowRight className="size-3.5" /></span><b className="mt-1 block font-medium">{next.title}</b></a>
                  : <a href="#home" className="rounded-xl border bg-card p-4 text-right hover:bg-accent"><span className="text-xs text-muted-foreground">{onPath ? "End of your path" : "Finished"}</span><b className="mt-1 block font-medium">Back to course home</b></a>}
              </nav>
            </footer>
            {prep.sources && <div className="lesson kern-lesson-body mt-10" dangerouslySetInnerHTML={{ __html: prep.sources }} />}
          </div>
          </div>
          <aside aria-label="Lesson plan" className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">
            <Card className="gap-2 py-4">
              <CardHeader className="px-5"><CardTitle className="flex items-center gap-2 text-sm"><ListChecks className="size-4 text-brand" />Lesson plan</CardTitle><CardAction className="text-xs text-muted-foreground">{l.minutes} min</CardAction></CardHeader>
              <CardContent className="px-3">
                <ol className="divide-y">
                  {prep.plan.map((s, j) => {
                    const Icon = KIND_ICON[s.kind];
                    return (
                        <li key={s.id}>
                          <button type="button" onClick={() => jump(s.id)} className="grid w-full grid-cols-[22px_minmax(0,1fr)] items-start gap-2.5 rounded-md px-2 py-2 text-left text-caption hover:bg-accent">
                            <span className={cn("mt-px grid size-5 place-items-center rounded-full border text-2xs tabular-nums text-muted-foreground", j < readAt && "border-brand bg-brand text-brand-foreground", j === cur && "border-2 border-brand text-foreground")}>{j + 1}</span>
                            <span className="min-w-0"><span className="flex items-center gap-1.5">{s.title}{GW.figures?.[id] && slug(GW.figures[id].at.replace(/’/g, "'")) === slug(s.title.replace(/’/g, "'")) && <BarChart3 className="size-3.5 shrink-0 text-brand" aria-label="Has an interactive figure" />}</span><span className={cn("mt-0.5 flex items-center gap-1 text-xs text-muted-foreground", s.kind === "Exercise" && "font-medium text-foreground", s.kind === "Quiz" && "text-brand")}><Icon className="size-3.5" />{s.kind}<span className="font-normal text-muted-foreground">· {s.min} min</span></span></span>
                          </button>
                        </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
            </div>
          </aside>
        </div>
      </main>

      <Popover open={!!term} onOpenChange={(o) => !o && setTerm(null)}>
        <PopoverAnchor asChild><span style={{ position: "fixed", left: term?.rect.left ?? 0, top: term?.rect.top ?? 0, width: term?.rect.width ?? 0, height: term?.rect.height ?? 0, pointerEvents: "none" }} /></PopoverAnchor>
        <PopoverContent className="w-80 text-sm" onOpenAutoFocus={(e) => term?.hover && e.preventDefault()}>
          {g && <><p className="font-semibold">{g[0]}</p><p className="mt-1 text-muted-foreground">{g[1]}</p><Button variant="link" className="h-auto p-0 pt-2 text-xs" onClick={() => { setTerm(null); go("glossary/" + term!.k); }}>See the glossary</Button></>}
        </PopoverContent>
      </Popover>
    </div>
  );
}
