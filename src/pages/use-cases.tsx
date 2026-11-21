import { useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Footprints, Lightbulb, Search, ShieldCheck, SquareTerminal, User, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page } from "@/components/shell";
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
export function FitBadge({ fit }: { fit: UC["fit"] }) { const f = FIT[fit]; return <Badge variant="outline" className={cn("font-normal", f.cls)}><f.icon />{f.label}</Badge>; }

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
  const groups = order.map((r) => ({ r, items: list.filter((u) => u.r === r && hit(u)) })).filter((g) => g.items.length);
  const count = groups.reduce((a, g) => a + g.items.length, 0);

  return (
    <Page wide className="max-w-6xl">
      <header className="mb-6">
        <h1 className="text-h1 font-semibold">Use cases</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Concrete ways people in each role use AI at work, how well each fits, and a step-by-step guide for each one.</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {!gen && <Tabs value={scope} onValueChange={(v) => { setScope(v); save("gw-ucscope", v); }}><TabsList><TabsTrigger value="mine">Your roles</TabsTrigger><TabsTrigger value="all">All roles</TabsTrigger></TabsList></Tabs>}
          <Tabs value={fit} onValueChange={(v) => { setFit(v); save("gw-ucfit", v); }}><TabsList><TabsTrigger value="all">Any fit</TabsTrigger><TabsTrigger value="good">Good fit</TabsTrigger><TabsTrigger value="care">Use with care</TabsTrigger><TabsTrigger value="human">Keep human</TabsTrigger></TabsList></Tabs>
          <div className="relative w-full sm:ml-auto sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a task, e.g. tests, incidents" aria-label="Find a use case" className="pl-9" /></div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">{plural(count, "use case")}{count ? " across " + plural(groups.length, "role") : ""}</p>
      </header>
      {!count && <p className="text-sm text-muted-foreground">No use cases match. Try a shorter word or another fit level. <Button variant="link" className="h-auto p-0" onClick={() => { setQ(""); setFit("all"); setScope("all"); }}>Clear the filters</Button></p>}
      <div className="grid gap-10">
        {groups.map((g) => (
          <section key={g.r}>
            <p className="text-xs text-muted-foreground">{trackSpan(g.r)}</p>
            <h2 className="mb-3 text-xl font-semibold">{trackName(g.r)}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((u) => {
                const gd: Guide | undefined = GW.ucGuides?.[u.t], l = byId[u.l];
                return (
                  <Card key={u.t} className="gap-3">
                    <CardHeader className="gap-2"><FitBadge fit={u.fit} /><CardTitle className="leading-snug">{u.t}</CardTitle></CardHeader>
                    <CardContent className="grid gap-2 text-caption">
                      <p className="text-ink-2">{u.d}</p>
                      <p className="text-muted-foreground"><b className="font-semibold text-foreground">Check:</b> {u.c}</p>
                    </CardContent>
                    <CardFooter className="mt-auto grid gap-2">
                      {gd && <Button asChild variant="outline" className="h-auto justify-between py-2"><a href={"#usecase/" + slug(u.t)}><span className="grid text-left"><span className="flex items-center gap-2"><Footprints className="size-4 text-brand" />Open the guide</span><span className="text-xs font-normal text-muted-foreground">{gd.s.length} steps · do's and don'ts{gd.p ? " · starter prompt" : ""}</span></span><ArrowRight className="size-4 text-muted-foreground" /></a></Button>}
                      {l && <a href={"#" + l.id} className="flex items-start gap-1.5 text-xs text-muted-foreground hover:text-foreground"><BookOpen className="mt-px size-3.5 shrink-0" /><span><b className="font-medium text-brand">Lesson {l.num}</b> {l.title}</span></a>}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
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
    <Page wide className="max-w-6xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 text-muted-foreground"><a href="#usecases"><ArrowLeft />All use cases</a></Button>
      <p className="text-caption text-muted-foreground">{trackName(u.r)} · use case {i + 1} of {same.length}</p>
      <h1 className="mt-1 text-h1 font-semibold">{u.t}</h1>
      <p className="mt-2 max-w-2xl text-ink-2">{u.d}</p>
      <div className="mt-5 flex flex-wrap gap-2"><FitBadge fit={u.fit} /><Badge variant="outline" className="font-normal"><Footprints />{plural(g.s.length, "step")}</Badge>{l && <Badge asChild variant="outline" className="font-normal"><a href={"#" + l.id}><BookOpen />Lesson {l.num}: {l.title}</a></Badge>}</div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-8">
          <section><h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Footprints className="size-5 text-brand" />Step by step</h2>
            <ol className="grid gap-0">{g.s.map((s, k) => (<li key={k} className="relative grid grid-cols-[30px_1fr] gap-4 pb-5 last:pb-0"><span className="z-10 grid size-[30px] place-items-center rounded-full bg-primary text-caption font-medium text-primary-foreground">{k + 1}</span>{k < g.s.length - 1 && <span className="absolute left-[15px] top-8 bottom-1 w-px bg-border" />}<p className="pt-1">{s}</p></li>))}</ol>
          </section>
          {g.p && (
            <Card className="gap-0 overflow-hidden bg-primary py-0 text-primary-foreground">
              <div className="flex items-center justify-between border-b border-primary-foreground/15 px-4 py-2 text-xs"><span className="flex items-center gap-2 opacity-80"><SquareTerminal className="size-4" />A prompt to start from</span>
                <Button size="sm" variant="ghost" className="h-7 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => copyText(g.p!).then((ok) => { setCopied(ok ? "Copied" : "Couldn't copy"); setTimeout(() => setCopied(""), 1600); })}>{copied || "Copy"}</Button></div>
              <p className="whitespace-pre-wrap p-4 text-caption leading-relaxed">{g.p}</p>
            </Card>
          )}
          <section><h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><ShieldCheck className="size-5 text-brand" />Before you rely on it</h2><p className="rounded-lg border border-brand-line bg-brand-tint p-4">{u.c}</p></section>
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
