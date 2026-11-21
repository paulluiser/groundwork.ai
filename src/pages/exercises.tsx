import { useState } from "react";
import { Check, ChevronRight, Cpu, FlaskConical, GitFork, LayoutGrid, List, Pencil, Play, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Meter } from "@/components/brand";
import { Page } from "@/components/shell";
import { exercises, GW, load, plural, routeFor, save, uniq, trackIdOf } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const FAM_ICON: Record<string, typeof Search> = { "Spot the problem": Search, "Sort and decide": GitFork, Simulations: Cpu, "Write and apply": Pencil };

export default function Exercises() {
  const { roles, progress } = useStore();
  const [scope, setScope] = useState<string>(() => load("gw-exscope", "path"));
  const [status, setStatus] = useState("all");
  const [fam, setFam] = useState("all");
  const path = routeFor(roles), all = exercises();
  const scoped = scope === "path" ? all.filter((e) => path.includes(e.lesson.id)) : all;
  const done = scoped.filter((e) => progress[e.lesson.id]).length;
  const next = scoped.find((e) => !progress[e.lesson.id]);
  const fams: Record<string, number> = {}; scoped.forEach((e) => (fams[e.fam] = (fams[e.fam] || 0) + 1));
  const famList = Object.keys(fams).sort((a, b) => fams[b] - fams[a] || a.localeCompare(b));
  const f = fam !== "all" && !fams[fam] ? "all" : fam;
  const list = scoped.filter((e) => (f === "all" || e.fam === f) && (status === "all" || (status === "done") === !!progress[e.lesson.id]));

  // "You decide" drafts and term review, as before
  const ps = load<Record<string, unknown>>("gw-practice", {}), nP = (GW.practice || []).length, pDone = (GW.practice || []).filter((_: unknown, i: number) => ps[i + 1]).length;
  const mine = uniq(roles.map(trackIdOf));
  void mine;

  return (
    <Page>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-h1 font-semibold">Exercises</h1><p className="mt-1 text-sm text-muted-foreground">Hands-on practice from every lesson. Each one gives feedback as you work.</p></div>
        <Tabs value={scope} onValueChange={(v) => { setScope(v); save("gw-exscope", v); }}><TabsList><TabsTrigger value="path">Your path</TabsTrigger><TabsTrigger value="all">All lessons</TabsTrigger></TabsList></Tabs>
      </header>

      <div className="grid gap-4 md:grid-cols-[1fr_1.3fr_1.4fr]">
        <Card className="gap-3">
          <CardHeader><CardTitle className="flex items-center gap-2 text-xs font-normal text-muted-foreground"><TrendingUp className="size-4" />Progress</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <p className="flex items-baseline gap-2"><b className="text-h1 font-medium tabular-nums">{done}</b><span className="text-sm text-muted-foreground">of {scoped.length} done</span></p>
            <Progress value={scoped.length ? (100 * done) / scoped.length : 0} className="h-1.5 [&>div]:bg-ex-hue" />
            <p className="text-xs text-muted-foreground">Counted when you complete the lesson an exercise belongs to.</p>
          </CardContent>
        </Card>
        <Card className="gap-3 border-ex-band bg-ex-band text-ex-on">
          <CardHeader><CardTitle className="flex items-center gap-2 text-xs font-normal text-ex-hue"><Play className="size-4" />Up next</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {next ? (<>
              <b className="text-lg font-medium leading-snug">{next.title}</b>
              <p className="text-xs text-ex-on-2">Lesson {next.lesson.num} · {next.lesson.title} · {next.kind || next.fam}</p>
              <Button asChild className="mt-2 justify-self-start bg-ex-hue text-ex-band hover:bg-ex-hue/90"><a href={"#" + next.lesson.id + "/ex-" + next.n}><FlaskConical />Start the exercise</a></Button>
            </>) : (<><b className="text-lg font-medium">All done</b><p className="text-xs text-ex-on-2">Every exercise in this view belongs to a completed lesson.</p></>)}
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader><CardTitle className="flex items-center gap-2 text-xs font-normal text-muted-foreground"><LayoutGrid className="size-4" />{plural(famList.length, "kind")} of exercise</CardTitle></CardHeader>
          <CardContent>
            <ToggleGroup type="single" spacing={1.5} value={f} onValueChange={(v) => v && setFam(v)} className="flex flex-wrap justify-start" aria-label="Filter by kind">
              <ToggleGroupItem value="all" variant="outline" size="sm" className="rounded-full px-3 text-xs data-[state=on]:bg-ex-band data-[state=on]:text-ex-on"><List className="size-3.5" />All <span className="text-muted-foreground">{scoped.length}</span></ToggleGroupItem>
              {famList.map((k) => { const I = FAM_ICON[k]; return <ToggleGroupItem key={k} value={k} variant="outline" size="sm" className="rounded-full px-3 text-xs data-[state=on]:bg-ex-band data-[state=on]:text-ex-on"><I className="size-3.5" />{k} <span className="text-muted-foreground">{fams[k]}</span></ToggleGroupItem>; })}
            </ToggleGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <a href="#practice" className="rounded-xl border bg-card p-5 transition-colors hover:bg-accent">
          <p className="text-xs text-muted-foreground">You decide</p><b className="mt-1 block text-lg font-semibold">Review {nP} AI drafts</b>
          <p className="mt-1 text-caption text-muted-foreground">Make the call on a draft, say what you would check, then compare with a reviewer.</p>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Meter value={pDone / (nP || 1)} size={14} />{pDone ? pDone + " of " + nP + " reviewed" : "Not started"}<ChevronRight className="ml-auto size-4" /></p>
        </a>
        <a href="#review" className="rounded-xl border bg-card p-5 transition-colors hover:bg-accent">
          <p className="text-xs text-muted-foreground">Review</p><b className="mt-1 block text-lg font-semibold">Key terms, a few a day</b>
          <p className="mt-1 text-caption text-muted-foreground">Short card reviews of the terms from lessons you have finished, spaced out so they stick.</p>
          <p className="mt-3 flex items-center text-xs text-muted-foreground">Open the review<ChevronRight className="ml-auto size-4" /></p>
        </a>
      </div>

      <div className="mb-3 mt-8 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={status} onValueChange={setStatus}><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="todo">To do</TabsTrigger><TabsTrigger value="done">Done</TabsTrigger></TabsList></Tabs>
        <p className="text-sm text-muted-foreground" aria-live="polite">{plural(list.length, "exercise")}</p>
      </div>
      <Card className="gap-0 overflow-hidden py-0">
        <ol className="divide-y">
          {list.map((e) => {
            const d = !!progress[e.lesson.id], I = FAM_ICON[e.fam];
            return (
              <li key={e.lesson.id + e.n}>
                <a href={"#" + e.lesson.id + "/ex-" + e.n} className="grid grid-cols-[22px_minmax(0,1fr)_auto_16px] items-center gap-3 px-4 py-3 transition-colors hover:bg-accent">
                  <span className={cn("grid size-5 place-items-center rounded-full border", d ? "border-brand bg-brand text-brand-foreground" : "border-input")}>{d && <Check className="size-3" />}</span>
                  <span className="min-w-0"><b className="block font-medium leading-snug">{e.title}</b><span className="block truncate text-xs text-muted-foreground">Lesson {e.lesson.num} · {e.lesson.title}</span></span>
                  <Badge variant="secondary" className="hidden font-normal sm:inline-flex"><I />{e.kind || e.fam}</Badge>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </a>
              </li>
            );
          })}
        </ol>
        {!list.length && <p className="p-6 text-sm text-muted-foreground">No exercises match these filters.</p>}
      </Card>
    </Page>
  );
}
