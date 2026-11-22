import { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, BarChart3, Globe, Lightbulb, ShieldCheck, Users, Workflow, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mark } from "@/components/brand";
import { exercises, GW, HERO_ROLES, lessons } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { PASS, SIZE } from "@/pages/assessment";


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

/* Scramble: random characters that resolve left to right into the real text once the row scrolls into view.
   Monospace keeps every width steady. Screen readers get the final text; reduced motion skips the effect. */
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
function useInView<T extends Element>() {
  const ref = useRef<T>(null); const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [seen]);
  return [ref, seen] as const;
}
function Scramble({ text, run, delay = 0, dur = 700, className }: { text: string; run: boolean; delay?: number; dur?: number; className?: string }) {
  const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [out, setOut] = useState(() => (reduced ? text : text.replace(/\S/g, " ")));
  useEffect(() => {
    if (!run || reduced) { if (reduced) setOut(text); return; }
    let raf = 0; const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / dur)), done = Math.floor(p * text.length);
      setOut(now < t0 ? text.replace(/\S/g, " ") : text.split("").map((c, i) => (i < done || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [run, text, delay, dur, reduced]);
  return <span className={className}><span className="sr-only">{text}</span><span aria-hidden="true" className="whitespace-pre-wrap">{out}</span></span>;
}

export default function Landing() {
  const { roles } = useStore();
  const ready = roles.length > 0, go = ready ? "#home" : "#role", goTxt = ready ? "Continue where you left off" : "Get the starter kit";
  const nEx = exercises().length, nRoles = GW.roles.length, first = lessons[0];
  const [statsRef, statsSeen] = useInView<HTMLDivElement>();
  const nUc = (GW.useCases || []).length;
  const feats = [
    [Workflow, "How models work", "What a model does when it writes, what it can see, and why it can be fluent and wrong at once."],
    [Users, "Built around your role", `${nRoles} roles. Your main role adds a three-lesson track and sets the examples in every core lesson.`],
    [Zap, "Exercises that answer back", `${nEx} hands-on exercises, from sampling a model to flagging claims, with feedback as you go.`],
    [BarChart3, "Check in proportion", "A repeatable way to check AI work, scaled to what a mistake would cost."],
    [Lightbulb, `${nUc} use cases, rated`, "Each marked good fit, use with care or keep human, with tools, setup and limits."],
    [ShieldCheck, "Data and agents, safely", "What a model must never see, and limits for tools and agents that act for you."],
    [Award, "Assessments and certificates", `A ${SIZE}-question check per track. Score ${PASS * 100}% to earn the certificate.`],
    [Globe, "No account needed", "Nothing to sign up for. Your progress stays in your browser, and a short code moves it to another device."],
  ] as const;
  const mins = lessons.map((l) => l.minutes), lo = Math.min(...mins), hi = Math.max(...mins);
  const stats = [[lessons.length, `Lessons, ${lo} to ${hi} minutes each`], [nRoles, "Roles, from software engineer to support"], [nEx, "Exercises that check your answer"]];

  return (
    <main id="view" tabIndex={-1} className="outline-none">
      <section className="mx-auto flex min-h-[min(calc(100dvh-56px),760px)] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="min-h-[3.3em] max-w-[22ch] text-display font-semibold">
          <span className="sr-only">Learn the basics of AI and its use cases for every role on a software team</span>
          <span aria-hidden="true">Learn the basics of AI and its use cases for<br /><RotatingRole /><span className="kern-cursor" /></span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">A free AI starter kit for software teams. Core lessons for everyone, a three-lesson track for your role, and no account to create.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><a href={go}>{goTxt}<ArrowRight /></a></Button>
          <Button asChild size="lg" variant="outline"><a href="#progress">I've started before</a></Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{lessons.length} lessons · {nRoles} roles · no account</p>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-16 pt-8 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] lg:gap-16">
        <div className="max-w-md">
          <p className="text-sm text-brand">What you get</p>
          <h2 className="mt-2 text-h1 font-semibold">One starter kit for working with AI on a software team</h2>
          <p className="mt-3 text-muted-foreground">Made for beginners. It starts from what a model is, so you need no AI or machine learning background. Eight core lessons for everyone, a track for your role, and a capstone on bringing AI into a team.</p>
        </div>
        <dl className="grid gap-x-12 gap-y-7 sm:grid-cols-2">
          {feats.map(([Icon, t, d]) => (
            <div key={t} className="grid content-start grid-cols-[18px_minmax(0,1fr)] gap-x-3 gap-y-1">
              <Icon aria-hidden="true" className="mt-[3px] size-[18px] text-brand" strokeWidth={1.75} />
              <dt className="font-semibold">{t}</dt>
              <dd className="col-start-2 text-sm text-muted-foreground">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
        <div ref={statsRef} className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
          {stats.map(([v, l], i) => (<div key={l}><Scramble text={String(v)} run={statsSeen} delay={i * 140} dur={520} className="block text-h1 font-medium tabular-nums" /><Scramble text={l} run={statsSeen} delay={i * 140 + 160} dur={760} className="mt-1 block text-sm text-muted-foreground" /></div>))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-10 md:px-8">
        <Card className="items-center border-spot-line bg-spot py-12 text-center text-spot-fg">
          <CardHeader className="w-full items-center"><Badge variant="secondary" className="mx-auto">Ready when you are</Badge><CardTitle className="mt-3 text-h1">Start with lesson 1</CardTitle>
            <CardDescription className="mx-auto max-w-lg text-spot-fg/75">It takes {first.minutes} minutes and assumes no AI background. Choose your roles first, or start with General and add roles later.</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-spot-fg text-spot hover:bg-spot-fg/90"><a href={go}>{goTxt}<ArrowRight /></a></Button>
            <Button asChild size="lg" variant="outline" className="border-spot-fg/30 bg-transparent text-spot-fg hover:bg-spot-fg/10 hover:text-spot-fg"><a href="#progress">Continue with a code</a></Button>
          </CardContent>
        </Card>
        <footer className="mt-12 grid gap-8 border-t pt-8 text-sm md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><p className="flex items-center gap-2 text-lg font-semibold"><Mark />Kern</p><p className="mt-2 max-w-xs text-muted-foreground">A free starter kit for software teams on understanding AI and using it well at work.</p></div>
          <div className="grid content-start gap-1.5"><p className="font-medium">Starter kit</p><a className="py-1 text-muted-foreground hover:text-foreground" href="#home">Lessons</a><a className="py-1 text-muted-foreground hover:text-foreground" href="#exercises">Exercises</a><a className="py-1 text-muted-foreground hover:text-foreground" href="#glossary">Glossary</a></div>
          <div className="grid content-start gap-1.5"><p className="font-medium">Start</p><a className="py-1 text-muted-foreground hover:text-foreground" href="#role">Choose roles</a><a className="py-1 text-muted-foreground hover:text-foreground" href="#progress">Progress code</a></div>
          <div className="grid content-start gap-1.5"><p className="font-medium">Privacy</p><span className="text-muted-foreground">No accounts</span><span className="text-muted-foreground">Progress stays in your browser</span><span className="text-muted-foreground">We use Google analytics to see which lessons help</span></div>
        </footer>
        <p className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} Kern.</p>
      </section>
    </main>
  );
}
