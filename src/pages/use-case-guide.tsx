import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ClipboardCheck, Clock, ExternalLink, Lightbulb, LifeBuoy, Minus, ShieldCheck, SquareTerminal, Wrench, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Page, PageHeader, SectionHead } from "@/components/shell";
import { byId, copyText, GW, plural, slug, trackName } from "@/lib/kern";
import { FitBadge } from "@/pages/use-cases";
import { cn } from "@/lib/utils";

/* A use case guide: a practical reference, not a lesson. What it is, when to use it, the tools and how to set them up,
   what it can and can't do, the workflow and a prompt, a worked example, do and don't, troubleshooting,
   the check before relying on it, and external references.
   Data: GW.ucPlaybook (instruction), GW.ucGuides (steps, do, don't, tip, limits, prompt), GW.ucDetails (situation, fit, example). */
type UC = { r: string; t: string; fit: "good" | "care" | "human"; d: string; c: string; l: string };
type Guide = { s: string[]; y: string[]; n: string[]; t?: string; k?: string[]; p?: string };
type Detail = { w?: string; f?: string; x?: { i: string; o: string; c: string } };
type Playbook = { ov?: string; tl?: [string, string][]; su?: string[]; cn?: string[]; ct?: string[]; gu?: string[]; nu?: string[]; tr?: [string, string][]; rf?: [string, string][] };

const FIT_WHY = { good: "AI does this well; a light, specific check is enough.", care: "AI helps, but its output needs a close check before anyone relies on it.", human: "A person should make this decision. AI can prepare material, not decide." };
const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
const words = (v: unknown): number => (typeof v === "string" ? v.split(/\s+/).length : Array.isArray(v) ? v.reduce((a: number, x) => a + words(x), 0) : v && typeof v === "object" ? Object.values(v).reduce((a: number, x) => a + words(x), 0) : 0);

/* Two lists side by side in one card: a positive column and a negative one. */
function Pair({ a, b }: { a: [string, string[]]; b: [string, string[]] }) {
  const col = ([title, items]: [string, string[]], good: boolean) => (
    <div className="grid content-start gap-3 p-5">
      <p className={cn("flex items-center gap-2 text-sm font-semibold", good ? "text-brand" : "text-destructive")}>{good ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}{title}</p>
      <ul className="grid gap-2.5">{items.map((x) => <li key={x} className="grid grid-cols-[16px_1fr] gap-2 text-sm text-ink-2">{good ? <Check className="mt-0.5 size-3.5 text-brand" /> : <Minus className="mt-0.5 size-3.5 text-destructive" />}{x}</li>)}</ul>
    </div>
  );
  return <div className="grid overflow-hidden rounded-xl border bg-card sm:grid-cols-2 sm:divide-x max-sm:divide-y">{col(a, true)}{col(b, false)}</div>;
}

/* Shows commands, URLs and slash commands in setup text as inline code. */
const CODE = /(claude mcp add [^\s]+(?: [^\s]+)*? (?:https?:\/\/[^\s]+?|npx @playwright\/mcp@latest)(?=\.?(?:\s|$))|npx promptfoo@latest init|promptfoo eval|terraform show -json|terraform validate|kubectl describe|kubectl edit|--repeat-each|https?:\/\/[^\s,;)]+?(?=[.,;)]?(?:\s|$))|\/(?:mcp|init)\b)/g;
function Rich({ text }: { text: string }) {
  return <>{text.split(CODE).map((part, k) => (k % 2 ? <code key={k} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] [overflow-wrap:anywhere]">{part}</code> : part))}</>;
}

function Steps({ items }: { items: string[] }) {
  return <ol className="grid">{items.map((s, k) => (<li key={k} className="relative grid grid-cols-[28px_1fr] gap-4 pb-5 last:pb-0"><span className="z-10 grid size-7 place-items-center rounded-full bg-primary text-caption font-medium text-primary-foreground">{k + 1}</span>{k < items.length - 1 && <span className="absolute bottom-1 left-[14px] top-8 w-px bg-border" />}<p className="pt-0.5"><Rich text={s} /></p></li>))}</ol>;
}

export function UseCaseGuide({ slug: key }: { slug: string }) {
  const list: UC[] = GW.useCases || [];
  const u = list.find((x) => slug(x.t) === key);
  const [copied, setCopied] = useState("");
  if (!u) return <Page><p className="text-sm">That use case doesn't exist. <a className="underline" href="#usecases">See all use cases</a></p></Page>;
  const g: Guide = GW.ucGuides?.[u.t] || { s: [], y: [], n: [] }, d: Detail = GW.ucDetails?.[u.t] || {}, pb: Playbook = GW.ucPlaybook?.[u.t] || {}, l = byId[u.l];
  const same = list.filter((x) => x.r === u.r), i = same.indexOf(u), prev = same[i - 1], next = same[i + 1];
  const cant = [...(pb.ct || []), ...(g.k || []).filter((k) => !(pb.ct || []).includes(k))];
  const minutes = Math.max(4, Math.round(words([pb, g, d]) / 200));
  const toc = ([["overview", "Overview", !!(pb.ov || d.w)], ["when", "When to use it", !!(pb.gu?.length || pb.nu?.length)], ["setup", "Tools and setup", !!(pb.tl?.length || pb.su?.length)], ["scope", "What it can and can't do", !!(pb.cn?.length || cant.length)], ["steps", "Step by step", g.s.length > 0], ["prompt", "A prompt to start from", !!g.p], ["example", "Worked example", !!d.x], ["do-dont", "Do and don't", g.y.length > 0 || g.n.length > 0], ["trouble", "Troubleshooting", !!pb.tr?.length], ["rely", "Before you rely on it", true], ["refs", "References", !!pb.rf?.length]] as [string, string, boolean][]).filter((x) => x[2]);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Page>
      <PageHeader back={["#usecases", "All use cases"]} eyebrow={trackName(u.r) + " · use case " + (i + 1) + " of " + same.length} title={u.t} description={u.d}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><FitBadge fit={u.fit} /><span className="flex items-center gap-1"><Clock className="size-3.5" />About {minutes} min read</span>{pb.tl?.length ? <span>{plural(pb.tl.length, "tool")}</span> : null}{pb.rf?.length ? <span>{plural(pb.rf.length, "reference")}</span> : null}{l && <a href={"#" + l.id} className="inline-flex min-h-6 items-center gap-1 underline-offset-4 hover:text-foreground hover:underline"><BookOpen className="size-3.5" />Lesson {l.num}: {l.title}</a>}</p>
      </PageHeader>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid min-w-0 gap-10">
          {(pb.ov || d.w) && (
            <section id="overview" className="grid scroll-mt-20 gap-4">
              {pb.ov && <p className="text-[1.0625rem] leading-relaxed text-ink-2">{pb.ov}</p>}
              {d.w && <div className="border-l-[3px] border-foreground bg-card px-5 py-4"><p className="mb-1 text-xs font-semibold text-muted-foreground">A typical moment</p><p className="text-ink-2">{d.w}</p></div>}
            </section>
          )}

          {/* on phones and tablets the fit card sits here; on wide screens it's in the side column */}
          <div className="grid gap-2 rounded-xl border bg-card p-4 lg:hidden"><p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">Is AI a good fit? <FitBadge fit={u.fit} /></p><p className="text-sm text-ink-2">{d.f || FIT_WHY[u.fit]}</p></div>

          {(pb.gu?.length || pb.nu?.length) ? (
            <section id="when" className="scroll-mt-20"><SectionHead title="When to use it" />
              <Pair a={["Good to use when", pb.gu || []]} b={["Not a good idea when", pb.nu || []]} />
            </section>
          ) : null}

          {(pb.tl?.length || pb.su?.length) ? (
            <section id="setup" className="grid scroll-mt-20 gap-6"><SectionHead title="Tools and setup" meta={pb.tl?.length ? plural(pb.tl.length, "option") : undefined} />
              {pb.tl && pb.tl.length > 0 && (
                <div className="-mt-2 grid gap-3 sm:grid-cols-2">
                  {pb.tl.map(([n, w]) => <div key={n} className="grid content-start gap-1.5 rounded-xl border bg-card p-4"><p className="flex items-start gap-2 text-sm font-semibold"><Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />{n}</p><p className="text-sm text-ink-2">{w}</p></div>)}
                </div>
              )}
              {pb.su && pb.su.length > 0 && (
                <div className="grid gap-4 rounded-xl bg-muted/60 p-5">
                  <p className="text-sm font-semibold">How to set it up</p>
                  <Steps items={pb.su} />
                </div>
              )}
            </section>
          ) : null}

          {(pb.cn?.length || cant.length) ? (
            <section id="scope" className="scroll-mt-20"><SectionHead title="What it can and can't do" />
              <Pair a={["What it can do", pb.cn || []]} b={["Constraints and limits", cant]} />
            </section>
          ) : null}

          {g.s.length > 0 && <section id="steps" className="scroll-mt-20"><SectionHead title="Step by step" meta={plural(g.s.length, "step")} /><Steps items={g.s} /></section>}

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

          {(g.y.length > 0 || g.n.length > 0) && (
            <section id="do-dont" className="grid scroll-mt-20 gap-4"><SectionHead title="Do and don't" />
              <Pair a={["Do", g.y]} b={["Don't", g.n]} />
              {g.t && <p className="flex gap-3 rounded-xl bg-muted p-4 text-sm text-ink-2"><Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" /><span><b className="font-semibold text-foreground">Tip: </b>{g.t}</span></p>}
            </section>
          )}

          {pb.tr && pb.tr.length > 0 && (
            <section id="trouble" className="scroll-mt-20"><SectionHead title="Troubleshooting" meta={plural(pb.tr.length, "common problem")} />
              <dl className="grid divide-y overflow-hidden rounded-xl border bg-card">
                {pb.tr.map(([p, f]) => <div key={p} className="grid gap-1.5 p-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6"><dt className="flex items-start gap-2 text-sm font-medium"><LifeBuoy className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />{p}</dt><dd className="text-sm text-ink-2"><Rich text={f} /></dd></div>)}
              </dl>
            </section>
          )}

          <section id="rely" className="scroll-mt-20"><SectionHead title="Before you rely on it" />
            <p className="flex gap-3 rounded-xl border border-brand-line bg-brand-tint p-5 text-ink-2"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" />{u.c}</p>
          </section>

          {pb.rf && pb.rf.length > 0 && (
            <section id="refs" className="scroll-mt-20"><SectionHead title="References" meta="External sites" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {pb.rf.map(([t, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="group flex h-full items-start gap-3 rounded-xl border bg-card p-3.5 hover:bg-accent"><ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" /><span className="min-w-0"><span className="block text-sm font-medium group-hover:underline">{t}</span><span className="block truncate text-xs text-muted-foreground">{host(href)}</span></span></a></li>)}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Tools and plans change quickly. Check the vendor's current documentation before you set anything up.</p>
            </section>
          )}
        </div>

        <aside className="hidden gap-4 lg:sticky lg:top-20 lg:grid">
          <Card className="gap-3"><CardContent className="grid gap-3">
            <p className="text-xs text-muted-foreground">Is AI a good fit?</p>
            <FitBadge fit={u.fit} />
            <p className="text-sm text-ink-2">{d.f || FIT_WHY[u.fit]}</p>
          </CardContent></Card>
          <nav aria-label="On this page" className="grid gap-0.5 text-caption">
            <p className="mb-1 text-xs font-medium">On this page</p>
            {toc.map(([id, t]) => <button key={id} type="button" onClick={() => jump(id)} className="rounded-md px-2 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground">{t}</button>)}
          </nav>
        </aside>
      </div>

      {/* where you are among this role's use cases */}
      <nav aria-label="More use cases" className="mt-12 grid items-stretch gap-3 border-t pt-6 sm:grid-cols-[1fr_auto_1fr]">
        {prev ? <a href={"#usecase/" + slug(prev.t)} className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 hover:bg-accent"><ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" /><span className="min-w-0"><span className="block text-xs text-muted-foreground">Previous</span><b className="block truncate text-sm font-medium">{prev.t}</b></span></a> : <span className="hidden sm:block" />}
        <div className="flex flex-wrap items-center justify-center gap-1.5 px-2 py-2" aria-label={"Use case " + (i + 1) + " of " + same.length}>
          {same.map((x, k) => <a key={x.t} href={"#usecase/" + slug(x.t)} title={x.t} aria-label={x.t} className={cn("size-2 rounded-full", k === i ? "bg-foreground" : "bg-border hover:bg-muted-foreground")} />)}
        </div>
        <a href={next ? "#usecase/" + slug(next.t) : "#usecases"} className="group flex items-center justify-end gap-3 rounded-xl border bg-card px-4 py-3 text-right hover:bg-accent"><span className="min-w-0"><span className="block text-xs text-muted-foreground">{next ? "Next" : "Finished " + trackName(u.r)}</span><b className="block truncate text-sm font-medium">{next ? next.t : "All use cases"}</b></span><ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></a>
      </nav>
    </Page>
  );
}
