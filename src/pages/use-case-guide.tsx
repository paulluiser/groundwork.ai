import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Clock, Lightbulb, ShieldCheck, SquareTerminal, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Page, PageHeader, SectionHead } from "@/components/shell";
import { byId, copyText, GW, plural, slug, trackName } from "@/lib/kern";
import { FitBadge } from "@/pages/use-cases";
import { cn } from "@/lib/utils";

/* A use case guide, laid out like a short lesson: the situation, whether AI fits, the steps, a prompt,
   a worked example, do and don't, good to know, the check before relying on it, a hands-on task and a quick check.
   Guide data: GW.ucGuides (steps, do, don't, tip, limits, prompt). Lesson-style detail: GW.ucDetails. */
type UC = { r: string; t: string; fit: "good" | "care" | "human"; d: string; c: string; l: string };
type Guide = { s: string[]; y: string[]; n: string[]; t?: string; k?: string[]; p?: string };
type Detail = { w?: string; f?: string; x?: { i: string; o: string; c: string }; q?: { q: string; a: number; o: [string, string][] }; tk?: { q: string; m: string; r: string[] } };

const FIT_WHY = { good: "AI does this well; a light, specific check is enough.", care: "AI helps, but its output needs a close check before anyone relies on it.", human: "A person should make this decision. AI can prepare material, not decide." };

function QuickCheck({ q }: { q: NonNullable<Detail["q"]> }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <Card className="gap-3"><CardContent className="grid gap-3">
      <p className="font-medium">{q.q}</p>
      <div className="grid gap-2" role="radiogroup" aria-label="Quick check">
        {q.o.map(([t, fb], j) => {
          const chosen = pick === j, right = j === q.a;
          return (
            <button key={j} type="button" role="radio" aria-checked={chosen} onClick={() => setPick(j)}
              className={cn("flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent", chosen && (right ? "border-brand bg-brand-tint" : "border-destructive/50 bg-danger-soft"))}>
              <span className="grid size-5 shrink-0 place-items-center rounded-full border text-2xs">{"ABCD"[j]}</span>
              <span className="grid gap-1"><span>{t}</span>{chosen && <span className="flex items-start gap-1.5 text-xs text-muted-foreground">{right ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-brand" /> : <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />}{right ? "Correct. " : "Not quite. "}{fb}</span>}</span>
            </button>
          );
        })}
      </div>
    </CardContent></Card>
  );
}

/* The same open-task widget the lessons use: write, then compare with a model answer and a rubric. */
function Task({ id, tk }: { id: string; tk: NonNullable<Detail["tk"]> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !GW.widgets?.task) return;
    el.innerHTML = '<div data-w="task" data-key="uc-' + id + '"><div class="task-model"></div><ul class="task-rubric"></ul></div>';
    const w = el.firstElementChild as HTMLElement;
    (w.querySelector(".task-model") as HTMLElement).textContent = tk.m;
    const ul = w.querySelector(".task-rubric")!; tk.r.forEach((r) => { const li = document.createElement("li"); li.textContent = r; ul.appendChild(li); });
    GW.widgets.task(w);
  }, [id, tk]);
  return (
    <div className="kern-lesson-body">
      <div className="overflow-hidden rounded-xl border border-ex-line bg-ex-bg">
        <div className="bg-ex-band px-5 py-3 text-ex-on"><span className="rounded bg-ex-hue px-2 py-0.5 text-2xs font-semibold text-ex-band">Your turn</span><p className="mt-2 font-medium">{tk.q}</p></div>
        <div ref={ref} className="p-5" />
      </div>
    </div>
  );
}

export function UseCaseGuide({ slug: key }: { slug: string }) {
  const list: UC[] = GW.useCases || [];
  const u = list.find((x) => slug(x.t) === key);
  const [copied, setCopied] = useState("");
  if (!u) return <Page><p className="text-sm">That use case doesn't exist. <a className="underline" href="#usecases">See all use cases</a></p></Page>;
  const g: Guide = GW.ucGuides?.[u.t] || { s: [], y: [], n: [] }, d: Detail = GW.ucDetails?.[u.t] || {}, l = byId[u.l];
  const same = list.filter((x) => x.r === u.r), i = same.indexOf(u), prev = same[i - 1], next = same[i + 1];
  const minutes = Math.max(5, Math.round(g.s.length * 1.5 + (d.tk ? 8 : 0) + (d.x ? 2 : 0)));
  const toc = [["situation", "The situation", !!d.w], ["steps", "Step by step", true], ["prompt", "A prompt to start from", !!g.p], ["example", "Worked example", !!d.x], ["do-dont", "Do and don't", true], ["good-to-know", "Good to know", !!(g.t || g.k?.length)], ["rely", "Before you rely on it", true], ["your-turn", "Your turn", !!d.tk], ["quick-check", "Quick check", !!d.q]].filter((x) => x[2]) as [string, string, boolean][];
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Page>
      <PageHeader back={["#usecases", "All use cases"]} eyebrow={trackName(u.r) + " · use case " + (i + 1) + " of " + same.length} title={u.t} description={u.d}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><FitBadge fit={u.fit} /><span className="flex items-center gap-1"><Clock className="size-3.5" />About {minutes} min</span><span>{plural(g.s.length, "step")}</span>{l && <a href={"#" + l.id} className="inline-flex min-h-6 items-center gap-1 underline-offset-4 hover:text-foreground hover:underline"><BookOpen className="size-3.5" />Lesson {l.num}: {l.title}</a>}</p>
      </PageHeader>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid min-w-0 gap-10">
          {d.w && <section id="situation" className="scroll-mt-20"><div className="border-l-[3px] border-foreground bg-card px-5 py-4"><p className="mb-1 text-xs font-semibold text-muted-foreground">The situation</p><p className="text-ink-2">{d.w}</p></div></section>}

          {/* on phones and tablets the fit card sits here; on wide screens it's in the side column */}
          <div className="grid gap-2 rounded-xl border bg-card p-4 lg:hidden"><p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">Is AI a good fit? <FitBadge fit={u.fit} /></p><p className="text-sm text-ink-2">{d.f || FIT_WHY[u.fit]}</p></div>

          <section id="steps" className="scroll-mt-20"><SectionHead title="Step by step" meta={plural(g.s.length, "step")} />
            <ol className="grid">{g.s.map((s, k) => (<li key={k} className="relative grid grid-cols-[30px_1fr] gap-4 pb-5 last:pb-0"><span className="z-10 grid size-[30px] place-items-center rounded-full bg-primary text-caption font-medium text-primary-foreground">{k + 1}</span>{k < g.s.length - 1 && <span className="absolute bottom-1 left-[15px] top-8 w-px bg-border" />}<p className="pt-1">{s}</p></li>))}</ol>
          </section>

          {g.p && (
            <section id="prompt" className="scroll-mt-20">
              <div className="overflow-hidden rounded-xl border border-spot-line bg-spot text-spot-fg">
                <div className="flex items-center justify-between border-b border-spot-fg/15 px-4 py-2 text-xs"><span className="flex items-center gap-2 text-spot-fg/80"><SquareTerminal className="size-4" />A prompt to start from</span>
                  <Button size="sm" variant="ghost" className="h-7 text-spot-fg hover:bg-spot-fg/10 hover:text-spot-fg" onClick={() => copyText(g.p!).then((ok) => { setCopied(ok ? "Copied" : "Couldn't copy"); setTimeout(() => setCopied(""), 1600); })}>{copied || "Copy"}</Button></div>
                <p className="whitespace-pre-wrap p-4 font-mono text-caption leading-relaxed">{g.p}</p>
              </div>
            </section>
          )}

          {d.x && (
            <section id="example" className="scroll-mt-20"><SectionHead title="Worked example" />
              <div className="grid overflow-hidden rounded-xl border bg-card">
                <div className="grid gap-1 border-b p-4"><p className="text-xs font-semibold text-muted-foreground">What you ask</p><p className="text-sm">{d.x.i}</p></div>
                <div className="grid gap-1 border-b bg-muted/50 p-4"><p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><span className="size-2 rounded-full bg-warning" />What the AI gives back</p><p className="text-sm text-ink-2">{d.x.o}</p></div>
                <div className="grid gap-1 p-4"><p className="flex items-center gap-1.5 text-xs font-semibold text-brand"><ClipboardCheck className="size-3.5" />What your check finds</p><p className="text-sm">{d.x.c}</p></div>
              </div>
            </section>
          )}

          <section id="do-dont" className="scroll-mt-20"><SectionHead title="Do and don't" />
            <div className="grid overflow-hidden rounded-xl border bg-card sm:grid-cols-2 sm:divide-x max-sm:divide-y">
              <div className="grid content-start gap-3 p-5"><p className="flex items-center gap-2 text-sm font-semibold text-brand"><CheckCircle2 className="size-4" />Do</p><ul className="grid gap-2.5">{g.y.map((x) => <li key={x} className="grid grid-cols-[16px_1fr] gap-2 text-sm text-ink-2"><span className="mt-2 size-1.5 rounded-full bg-brand" />{x}</li>)}</ul></div>
              <div className="grid content-start gap-3 p-5"><p className="flex items-center gap-2 text-sm font-semibold text-destructive"><XCircle className="size-4" />Don't</p><ul className="grid gap-2.5">{g.n.map((x) => <li key={x} className="grid grid-cols-[16px_1fr] gap-2 text-sm text-ink-2"><span className="mt-2 size-1.5 rounded-full bg-destructive" />{x}</li>)}</ul></div>
            </div>
          </section>

          {(g.t || (g.k && g.k.length > 0)) && (
            <section id="good-to-know" className="scroll-mt-20"><SectionHead title="Good to know" />
              <div className="grid gap-4 sm:grid-cols-2">
                {g.t && <div className="rounded-xl bg-muted p-5"><p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Lightbulb className="size-4 text-brand" />Tip</p><p className="text-sm text-ink-2">{g.t}</p></div>}
                {g.k && g.k.length > 0 && <div className="rounded-xl border p-5"><p className="mb-2 flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="size-4 text-warning" />Limits</p><ul className="grid gap-2">{g.k.map((x) => <li key={x} className="text-sm text-ink-2">{x}</li>)}</ul></div>}
              </div>
            </section>
          )}

          <section id="rely" className="scroll-mt-20"><SectionHead title="Before you rely on it" />
            <p className="flex gap-3 rounded-xl border border-brand-line bg-brand-tint p-5 text-ink-2"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" />{u.c}</p>
          </section>

          {d.tk && <section id="your-turn" className="scroll-mt-20"><SectionHead title="Your turn" meta="Saved in this browser" /><Task id={slug(u.t)} tk={d.tk} /></section>}
          {d.q && <section id="quick-check" className="scroll-mt-20"><SectionHead title="Quick check" /><QuickCheck q={d.q} /></section>}
        </div>

        <aside className="hidden gap-4 lg:sticky lg:top-20 lg:grid">
          <Card className="gap-3"><CardContent className="grid gap-3">
            <p className="text-xs text-muted-foreground">Is AI a good fit?</p>
            <FitBadge fit={u.fit} />
            <p className="text-sm text-ink-2">{d.f || FIT_WHY[u.fit]}</p>
          </CardContent></Card>
          <nav aria-label="On this page" className="hidden gap-0.5 text-caption lg:grid">
            <p className="mb-1 text-xs font-medium">On this page</p>
            {toc.map(([id, t]) => <button key={id} type="button" onClick={() => jump(id)} className="rounded-md px-2 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground">{t}</button>)}
          </nav>
        </aside>
      </div>

      {/* where you are among this role's use cases */}
      <nav aria-label="More use cases" className="mt-12 grid items-stretch gap-3 border-t pt-6 sm:grid-cols-[1fr_auto_1fr]">
        {prev ? <a href={"#usecase/" + slug(prev.t)} className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 hover:bg-accent"><ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" /><span className="min-w-0"><span className="block text-xs text-muted-foreground">Previous</span><b className="block truncate text-sm font-medium">{prev.t}</b></span></a> : <span className="hidden sm:block" />}
        <div className="flex items-center justify-center gap-1.5 px-2 py-2" aria-label={"Use case " + (i + 1) + " of " + same.length}>
          {same.map((x, k) => <a key={x.t} href={"#usecase/" + slug(x.t)} title={x.t} aria-label={x.t} className={cn("size-2 rounded-full", k === i ? "bg-foreground" : "bg-border hover:bg-muted-foreground")} />)}
        </div>
        <a href={next ? "#usecase/" + slug(next.t) : "#usecases"} className="group flex items-center justify-end gap-3 rounded-xl border bg-card px-4 py-3 text-right hover:bg-accent"><span className="min-w-0"><span className="block text-xs text-muted-foreground">{next ? "Next" : "Finished " + trackName(u.r)}</span><b className="block truncate text-sm font-medium">{next ? next.t : "All use cases"}</b></span><ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></a>
      </nav>
    </Page>
  );
}
