import { useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Footprints, Lightbulb, Search, ShieldCheck, SquareTerminal, User, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { onDark, Page, PageHeader, SectionHead, ShowMore, Spotlight } from "@/components/shell";
import { byId, copyText, GW, load, plural, save, slug, trackIdOf, trackName, trackSpan, uniq } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type UC = { r: string; t: string; fit: "good" | "care" | "human"; d: string; c: string; l: string };
type Guide = { s: string[]; y: string[]; n: string[]; t?: string; k?: string[]; p?: string };
export const FIT = {
  good: { label: "Good fit", icon: CheckCircle2, cls: "border-brand-line bg-brand-tint text-brand" },
  care: { label: "Use with care", icon: AlertTriangle, cls: "border-warning/40 bg-warning-soft text-warning" },
  human: { label: "Keep human", icon: User, cls: "border-border bg-muted text-ink-2" },
};
const DOT = { good: "bg-brand", care: "bg-warning", human: "bg-ink-2" };
export function FitBadge({ fit }: { fit: UC["fit"] }) { return <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className={cn("size-2 rounded-full", DOT[fit])} />{FIT[fit].label}</span>; }

/* One use case: one target (the guide), one line of what to check with "More" to expand. */
function UcCard({ u }: { u: UC }) {
  const [open, setOpen] = useState(false);
  const gd: Guide | undefined = GW.ucGuides?.[u.t], l = byId[u.l], href = gd ? "#usecase/" + slug(u.t) : l ? "#" + l.id : undefined;
  return (
    <li className="group relative flex flex-col gap-2 rounded-xl border bg-card p-5 transition-colors has-[a.uc-main:hover]:border-foreground/20 has-[a.uc-main:hover]:bg-accent/40">
      <h3 className="text-sm font-semibold leading-snug">
        {href ? <a href={href} className="uc-main rounded-sm outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50">{u.t}</a> : u.t}
      </h3>
      <p className="text-caption text-ink-2">{u.d}</p>
      <p className={cn("text-xs text-muted-foreground", !open && "line-clamp-1")}><span className="font-medium text-foreground">Check:</span> {u.c}</p>
      {u.c.length > 44 && <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="relative z-10 -my-1 self-start py-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">{open ? "Less" : "More"}</button>}
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <FitBadge fit={u.fit} />
        {gd && <span className="flex shrink-0 items-center gap-1 text-xs font-medium">Guide<span className="font-normal text-muted-foreground">· {plural(gd.s.length, "step")}</span><ArrowRight className="size-3.5 transition-transform group-has-[a.uc-main:hover]:translate-x-0.5" /></span>}
      </div>
    </li>
  );
}

export function UseCases() {
  const { roles } = useStore();
  const gen = !roles.length || roles[0] === "general", mine = gen ? [] : uniq(roles.map(trackIdOf));
  const [scope, setScope] = useState<string>(() => (gen ? "all" : load("gw-ucscope", "mine")));
  const [fit, setFit] = useState<string>(() => load("gw-ucfit", "all"));
  const [q, setQ] = useState("");
  const list: UC[] = GW.useCases || [];
  const order = scope === "mine" && !gen ? mine : mine.concat(GW.tracks.map((t: { id: string }) => t.id).filter((r: string) => !mine.includes(r)));
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const hit = (u: UC) => (fit === "all" || u.fit === fit) && words.every((w) => (u.t + " " + u.d + " " + u.c + " " + trackName(u.r)).toLowerCase().includes(w));
  const starPick = !words.length ? list.find((u) => u.fit === "good" && (!mine.length || u.r === mine[0]) && GW.ucGuides?.[u.t] && hit(u)) : undefined;
  const groups = order.map((r) => ({ r, items: list.filter((u) => u.r === r && hit(u) && u !== starPick) })).filter((g) => g.items.length);
  const count = groups.reduce((a, g) => a + g.items.length, 0) + (starPick ? 1 : 0);

  const star = starPick;
  const starG: Guide | undefined = star && GW.ucGuides?.[star.t];
  const [more, setMore] = useState<Record<string, boolean>>({});
  const CAP = 4;

  return (
    <Page>
      <PageHeader title="Use cases" description="Concrete ways people in each role use AI at work, how well each fits, and a step-by-step guide for each one." />
      {star && starG && (
        <Spotlight className="mb-12" eyebrow={"Start here · " + trackName(star.r) + " · " + FIT[star.fit].label} title={star.t}
          action={<><Button asChild className={onDark}><a href={"#usecase/" + slug(star.t)}><Footprints />Open the guide<ArrowRight /></a></Button><span className="text-xs text-spot-fg/70">{plural(starG.s.length, "step")} · do's and don'ts{starG.p ? " · starter prompt" : ""}</span></>}>
          {star.d}
        </Spotlight>
      )}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {!gen && <Tabs value={scope} onValueChange={(v) => { setScope(v); save("gw-ucscope", v); }}><TabsList><TabsTrigger value="mine">Your roles</TabsTrigger><TabsTrigger value="all">All roles</TabsTrigger></TabsList></Tabs>}
        <ToggleGroup type="single" spacing={1.5} value={fit} onValueChange={(v) => { if (!v) return; setFit(v); save("gw-ucfit", v); }} className="flex flex-wrap justify-start" aria-label="Filter by fit">
          {([["all", "Any fit"], ["good", "Good fit"], ["care", "Use with care"], ["human", "Keep human"]] as const).map(([v, t]) => <ToggleGroupItem key={v} value={v} size="sm" className="rounded-full px-3 text-xs text-muted-foreground hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{t}</ToggleGroupItem>)}
        </ToggleGroup>
        <p className="text-xs text-muted-foreground sm:ml-2" aria-live="polite">{plural(count, "use case")}{count ? " across " + plural(groups.length, "role") : ""}</p>
        <div className="relative w-full sm:ml-auto sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a use case" aria-label="Find a use case" className="pl-9" /></div>
      </div>
      <p className="-mt-5 mb-8 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span><FitBadge fit="good" />: AI does this well; a light check is enough</span>
        <span><FitBadge fit="care" />: helpful, but check the output closely</span>
        <span><FitBadge fit="human" />: a person should decide or do this</span>
      </p>
      {!count && <p className="text-sm text-muted-foreground">No use cases match. Try a shorter word or another fit level. <Button variant="link" className="h-auto p-0" onClick={() => { setQ(""); setFit("all"); setScope("all"); }}>Clear the filters</Button></p>}
      <div className="grid gap-12">
        {groups.map((g) => (
          <section key={g.r} aria-labelledby={"uc-" + g.r}>
            <SectionHead id={"uc-" + g.r} title={trackName(g.r)} meta={trackSpan(g.r) + " · " + plural(g.items.length + (starPick && starPick.r === g.r ? 1 : 0), "use case")} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(more[g.r] || words.length ? g.items : g.items.slice(0, CAP)).map((u) => <UcCard key={u.t} u={u} />)}
            </ul>
            {!words.length && <ShowMore hidden={g.items.length - CAP} open={!!more[g.r]} onToggle={() => setMore((m) => ({ ...m, [g.r]: !m[g.r] }))} noun="use cases" />}
          </section>
        ))}
      </div>
    </Page>
  );
}

export function UseCaseGuide({ slug: key }: { slug: string }) {
  const list: UC[] = GW.useCases || [];
  const u = list.find((x) => slug(x.t) === key);
  const [copied, setCopied] = useState("");
  if (!u) return <Page><p className="text-sm">That use case doesn't exist. <a className="underline" href="#usecases">See all use cases</a></p></Page>;
  const g: Guide = GW.ucGuides?.[u.t] || { s: [], y: [], n: [] }, l = byId[u.l];
  const same = list.filter((x) => x.r === u.r), i = same.indexOf(u), prev = same[i - 1], next = same[i + 1];
  const Box = ({ title, icon: I, tone, items, text }: { title: string; icon: typeof Lightbulb; tone: string; items?: string[]; text?: string }) => (
    <Card className={cn("gap-2 py-4", tone === "tip" && "bg-muted")}>
      <CardHeader className="px-5"><CardTitle className={cn("flex items-center gap-2 text-sm", tone === "do" && "text-brand", tone === "dont" && "text-destructive")}><I className={cn("size-4", tone === "lim" && "text-warning", tone === "tip" && "text-brand")} />{title}</CardTitle></CardHeader>
      <CardContent className="px-5 text-caption text-ink-2">{text ? <p>{text}</p> : <ul className="grid gap-2">{items!.map((x) => <li key={x} className="flex gap-2">{tone === "do" ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-brand" /> : tone === "dont" ? <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" /> : <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />}{x}</li>)}</ul>}</CardContent>
    </Card>
  );
  return (
    <Page>
      <PageHeader back={["#usecases", "All use cases"]} eyebrow={trackName(u.r) + " · use case " + (i + 1) + " of " + same.length} title={u.t} description={u.d}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><FitBadge fit={u.fit} /><span>{plural(g.s.length, "step")}</span>{l && <a href={"#" + l.id} className="inline-flex min-h-6 items-center gap-1 underline-offset-4 hover:text-foreground hover:underline"><BookOpen className="size-3.5" />Lesson {l.num}: {l.title}</a>}</p>
      </PageHeader>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-8">
          <section><SectionHead title="Step by step" meta={plural(g.s.length, "step")} />
            <ol className="grid gap-0">{g.s.map((s, k) => (<li key={k} className="relative grid grid-cols-[30px_1fr] gap-4 pb-5 last:pb-0"><span className="z-10 grid size-[30px] place-items-center rounded-full bg-primary text-caption font-medium text-primary-foreground">{k + 1}</span>{k < g.s.length - 1 && <span className="absolute left-[15px] top-8 bottom-1 w-px bg-border" />}<p className="pt-1">{s}</p></li>))}</ol>
          </section>
          {g.p && (
            <Card className="gap-0 overflow-hidden bg-primary py-0 text-primary-foreground">
              <div className="flex items-center justify-between border-b border-primary-foreground/15 px-4 py-2 text-xs"><span className="flex items-center gap-2 opacity-80"><SquareTerminal className="size-4" />A prompt to start from</span>
                <Button size="sm" variant="ghost" className="h-7 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => copyText(g.p!).then((ok) => { setCopied(ok ? "Copied" : "Couldn't copy"); setTimeout(() => setCopied(""), 1600); })}>{copied || "Copy"}</Button></div>
              <p className="whitespace-pre-wrap p-4 text-caption leading-relaxed">{g.p}</p>
            </Card>
          )}
          <section><SectionHead title="Before you rely on it" /><p className="rounded-lg border border-brand-line bg-brand-tint p-4">{u.c}</p></section>
        </div>
        <aside className="grid gap-3 lg:sticky lg:top-20">
          <Box title="Do" icon={CheckCircle2} tone="do" items={g.y} />
          <Box title="Don't" icon={XCircle} tone="dont" items={g.n} />
          {g.t && <Box title="Tip" icon={Lightbulb} tone="tip" text={g.t} />}
          {g.k && g.k.length > 0 && <Box title="Limits" icon={AlertTriangle} tone="lim" items={g.k} />}
        </aside>
      </div>
      <nav className="mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2" aria-label="More use cases">
        {prev ? <a href={"#usecase/" + slug(prev.t)} className="rounded-xl border bg-card p-4 hover:bg-accent"><span className="text-xs text-muted-foreground">Previous</span><b className="mt-1 block font-medium">{prev.t}</b></a> : <span />}
        <a href={next ? "#usecase/" + slug(next.t) : "#usecases"} className="rounded-xl border bg-card p-4 text-right hover:bg-accent"><span className="text-xs text-muted-foreground">{next ? "Next in " + trackName(u.r) : "End of " + trackName(u.r)}</span><b className="mt-1 block font-medium">{next ? next.t : "All use cases"}</b></a>
      </nav>
    </Page>
  );
}
