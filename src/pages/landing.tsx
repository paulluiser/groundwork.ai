import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, Globe, ShieldCheck, Users, Workflow, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Mark } from "@/components/brand";
import { exercises, GW, HERO_ROLES, lessons, trackName } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// One complete example: an AI draft and the human check, switchable by role.
const HERO = [
  { r: "security", draft: "Reviewed the invoice endpoint. No issues found. Low risk.", s: "bad", st: "Missed a check", note: "It checks that you're signed in, not that the invoice is yours. Change the ID in the URL and you can read anyone's invoice." },
  { r: "product", draft: "Most users asked for dark mode.", s: "warn", st: "No source", note: "3 of 40 interview notes mention it. Ask for the count and the notes behind a theme before you repeat it." },
  { r: "engineering", draft: "Return res.data.items from the fetch.", s: "ok", st: "Tests pass", note: "Ran it against a real response, including an empty list. The claim held up, so it ships." },
  { r: "data-analytics", draft: "October monthly active users: 1,284,550.", s: "bad", st: "Wrong grain", note: "The query counted events, not people. One row per user changes the answer completely." },
];
const STAMP: Record<string, string> = { bad: "border-destructive/40 bg-danger-soft text-destructive", warn: "border-warning/40 bg-warning-soft text-warning", ok: "border-brand-line bg-brand-tint text-brand" };

function RotatingRole() {
  const [text, setText] = useState(HERO_ROLES[0]);
  const k = useRef(0);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let busy = false; const timers: number[] = [];
    const id = window.setInterval(() => {
      if (busy) return;
      const cur = HERO_ROLES[k.current % HERO_ROLES.length], next = HERO_ROLES[++k.current % HERO_ROLES.length];
      if (reduced) { setText(next); return; }
      busy = true; let i = cur.length, j = 0;
      const del = () => { if (i >= 0) { setText(cur.slice(0, i--)); timers.push(window.setTimeout(del, 22)); return; } type(); };
      const type = () => { if (j <= next.length) { setText(next.slice(0, j++)); timers.push(window.setTimeout(type, 38)); return; } busy = false; };
      del();
    }, 2400);
    return () => { clearInterval(id); timers.forEach(clearTimeout); };
  }, []);
  return <span className="text-brand">{text}</span>;
}

export default function Landing() {
  const { roles } = useStore();
  const [ex, setEx] = useState("0");
  const ready = roles.length > 0, go = ready ? "#home" : "#role", goTxt = ready ? "Continue the course" : "Start the course";
  const nEx = exercises().length, nRoles = GW.roles.length, first = lessons[0];
  const c = HERO[+ex];
  const feats = [
    [Workflow, "How models work", "What a model is doing when it writes, what it can see, and why it can be fluent and wrong at the same time."],
    [BarChart3, "Check in proportion", "A repeatable way to check AI work, scaled to how costly a mistake would be and how easily you would notice it."],
    [Users, "Your role, your examples", "Pick up to three roles. Your main role adds a three-lesson track and sets the examples in every core lesson."],
    [Zap, "Exercises that answer back", nEx + " hands-on exercises, from flagging claims to running code, each with feedback as you go."],
    [ShieldCheck, "Data and agents, safely", "What a model must never see, and sensible limits for tools and agents that take actions on your behalf."],
    [Globe, "No account needed", "Progress saves in your browser. A short code or a resume link carries it to any other device."],
  ] as const;
  const mins = lessons.map((l) => l.minutes), lo = Math.min(...mins), hi = Math.max(...mins);
  const stats = [[lessons.length, `Lessons, ${lo} to ${hi} minutes each`], [nRoles, "Roles, from software engineer to support"], [nEx, "Exercises that check your answer"], ["0", "Accounts to create"]];

  return (
    <main id="view" tabIndex={-1} className="outline-none">
      <section className="mx-auto flex min-h-[min(calc(100dvh-56px),760px)] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="min-h-[3.3em] max-w-[22ch] text-display font-semibold">
          <span className="sr-only">Learn the basics of AI and its use cases for every role on a software team</span>
          <span aria-hidden="true">Learn the basics of AI and its use cases for<br /><RotatingRole /><span className="kern-cursor" /></span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">A free course for software teams. Core lessons for everyone, a three-lesson track for your role, and no account to create.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><a href={go}>{goTxt}<ArrowRight /></a></Button>
          <Button asChild size="lg" variant="outline"><a href="#progress">I've started before</a></Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{lessons.length} lessons · {nRoles} roles · no account</p>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 md:px-8">
        <div className="mb-10 max-w-2xl">
          <Badge variant="secondary">What you learn</Badge>
          <h2 className="mt-3 text-h1 font-semibold">One course for working with AI on a software team</h2>
          <p className="mt-3 text-muted-foreground">Eight core lessons for everyone, a track for your role, and a capstone on bringing AI into a team. Short lessons, real cases, and nothing to install.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feats.map(([Icon, t, d]) => (
            <Card key={t} className="gap-3">
              <CardHeader><div className="mb-2 grid size-9 place-items-center rounded-lg bg-brand-tint text-brand"><Icon className="size-5" /></div><CardTitle>{t}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{d}</p></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-16 md:px-8 lg:grid-cols-2 [&>*]:min-w-0">
        <div>
          <Badge variant="secondary">See it in practice</Badge>
          <h2 className="mt-3 text-h1 font-semibold">What checking AI work looks like</h2>
          <p className="mt-3 text-muted-foreground">Every lesson works from cases like this one: an AI draft that reads well, and the human check that decides whether it ships. Switch roles to see the same habit in different work.</p>
          <Button asChild className="mt-6"><a href={go}>{ready ? "Continue the course" : "Choose your roles"}<ArrowRight /></a></Button>
        </div>
        <Card aria-label="An AI draft and the human check that follows it">
          <CardHeader><CardTitle>Worked example</CardTitle><CardAction><Badge variant="outline"><span className="size-1.5 rounded-full bg-brand" />Human check</Badge></CardAction></CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-lg border bg-muted/50 p-4"><p className="text-xs text-muted-foreground">AI draft ({trackName(c.r)})</p><p className="mt-1">{c.draft}</p></div>
            <div className="rounded-lg border p-4"><div className="flex items-center justify-between gap-2"><p className="text-xs text-muted-foreground">Human check</p><span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", STAMP[c.s])}>{c.st}</span></div><p className="mt-2 text-sm">{c.note}</p></div>
            <div className="flex flex-wrap items-center gap-2 pt-1"><span className="text-xs text-muted-foreground">See it for</span>
              <ToggleGroup type="single" variant="outline" size="sm" spacing={1} value={ex} onValueChange={(v) => v && setEx(v)} aria-label="Show the example for">
                {HERO.map((h, i) => <ToggleGroupItem key={h.r} value={String(i)} className="px-2.5 text-xs">{trackName(h.r)}</ToggleGroupItem>)}
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-4">
          {stats.map(([v, l]) => (<div key={l} className="rounded-xl border bg-card p-5"><div className="text-h1 font-medium tabular-nums">{v}</div><div className="mt-1 text-sm text-muted-foreground">{l}</div></div>))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-10 md:px-8">
        <Card className="items-center border-spot-line bg-spot py-12 text-center text-spot-fg">
          <CardHeader className="w-full items-center"><Badge variant="secondary" className="mx-auto">Ready when you are</Badge><CardTitle className="mt-3 text-h1">Start with lesson 1</CardTitle>
            <CardDescription className="mx-auto max-w-lg text-spot-fg/75">It takes {first.minutes} minutes and needs no background. Choose your roles first, or start with General and add roles later.</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-spot-fg text-spot hover:bg-spot-fg/90"><a href={go}>{goTxt}<ArrowRight /></a></Button>
            <Button asChild size="lg" variant="outline" className="border-spot-fg/30 bg-transparent text-spot-fg hover:bg-spot-fg/10 hover:text-spot-fg"><a href="#progress">Continue with a code</a></Button>
          </CardContent>
        </Card>
        <footer className="mt-12 grid gap-8 border-t pt-8 text-sm md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><p className="flex items-center gap-2 text-lg font-semibold"><Mark />Kern</p><p className="mt-2 max-w-xs text-muted-foreground">A free course for software teams on understanding AI and using it well at work.</p></div>
          <div className="grid content-start gap-1.5"><p className="font-medium">Course</p><a className="py-1 text-muted-foreground hover:text-foreground" href="#home">Lessons</a><a className="py-1 text-muted-foreground hover:text-foreground" href="#exercises">Exercises</a><a className="py-1 text-muted-foreground hover:text-foreground" href="#glossary">Glossary</a></div>
          <div className="grid content-start gap-1.5"><p className="font-medium">Start</p><a className="py-1 text-muted-foreground hover:text-foreground" href="#role">Choose roles</a><a className="py-1 text-muted-foreground hover:text-foreground" href="#progress">Progress code</a></div>
          <div className="grid content-start gap-1.5"><p className="font-medium">Privacy</p><span className="text-muted-foreground">No accounts</span><span className="text-muted-foreground">Progress stays in your browser</span></div>
        </footer>
        <p className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} Kern.</p>
      </section>
    </main>
  );
}
