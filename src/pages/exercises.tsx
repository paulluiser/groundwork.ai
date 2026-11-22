import { useState } from "react";
import { Check, ChevronRight, Cpu, FlaskConical, GitFork, List, Pencil, Play, Repeat, Scale, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Meter } from "@/components/brand";
import { Page, PageHeader, SectionHead, ShowMore, Spotlight, Tile } from "@/components/shell";
import { exercises, GW, load, plural, routeFor, save, uniq, trackIdOf } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const FAM_ICON: Record<string, typeof Search> = { "Spot the problem": Search, "Sort and decide": GitFork, Simulations: Cpu, "Write and apply": Pencil };

export default function Exercises() {
  const { roles, progress } = useStore();
  const [scope, setScope] = useState<string>(() => load("gw-exscope", "path"));
  const [status, setStatus] = useState("all");
  const [fam, setFam] = useState("all");
  const [all_, setAll] = useState(false);
  const CAP = 12;
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
      <PageHeader title="Exercises" description="Hands-on practice from every lesson. Each one gives feedback as you work."
        actions={<Tabs value={scope} onValueChange={(v) => { setScope(v); save("gw-exscope", v); }}><TabsList><TabsTrigger value="path">Your path</TabsTrigger><TabsTrigger value="all">All lessons</TabsTrigger></TabsList></Tabs>} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Spotlight tone="ex" eyebrow={next ? "Up next · " + (next.kind || next.fam) : "All done"} title={next ? next.title : "Every exercise here is in a lesson you’ve completed"}
          action={next && <Button asChild className="bg-ex-hue text-ex-band hover:bg-ex-hue/90"><a href={"#" + next.lesson.id + "/ex-" + next.n}><FlaskConical />Start the exercise</a></Button>}>
          {next && <>Lesson {next.lesson.num} · {next.lesson.title}</>}
        </Spotlight>
        <Card className="gap-0 py-0">
          <CardContent className="grid content-between gap-5 p-6">
            <p className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="size-4" />Progress</p>
            <p className="flex items-baseline gap-2"><b className="text-h1 font-medium leading-none tabular-nums">{done}</b><span className="text-sm text-muted-foreground">of {scoped.length} in completed lessons</span></p>
            <Progress value={scoped.length ? (100 * done) / scoped.length : 0} className="h-1.5 [&>div]:bg-ex-hue" />
            <p className="text-xs text-muted-foreground">An exercise counts once you mark its lesson complete. Exercises aren’t tracked on their own.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Tile href="#practice" icon={Scale} label="You decide" value={"Review " + nP + " AI drafts"} note={pDone ? pDone + " of " + nP + " reviewed" : "Make the call, then compare with a reviewer"} />
        <Tile href="#review" icon={Repeat} label="Review" value="Key terms, a few a day" note="Spaced out so they stick" />
      </div>

      <SectionHead className="mt-10" title="All exercises" meta={<span aria-live="polite">{plural(list.length, "exercise")}</span>} />
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Tabs value={status} onValueChange={setStatus}><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="todo">Lesson to do</TabsTrigger><TabsTrigger value="done">Lesson done</TabsTrigger></TabsList></Tabs>
        <ToggleGroup type="single" spacing={1.5} value={f} onValueChange={(v) => v && setFam(v)} className="flex flex-wrap justify-start" aria-label="Filter by kind">
          <ToggleGroupItem value="all" variant="outline" size="sm" className="rounded-full px-3 text-xs data-[state=on]:bg-ex-band data-[state=on]:text-ex-on"><List className="size-3.5" />All kinds</ToggleGroupItem>
          {famList.map((k) => { const I = FAM_ICON[k]; return <ToggleGroupItem key={k} value={k} variant="outline" size="sm" className="rounded-full px-3 text-xs data-[state=on]:bg-ex-band data-[state=on]:text-ex-on"><I className="size-3.5" />{k} <span className="opacity-60">{fams[k]}</span></ToggleGroupItem>; })}
        </ToggleGroup>
      </div>
      <Card className="gap-0 overflow-hidden py-0">
        <ol className="divide-y lg:grid lg:grid-cols-2 lg:divide-y-0 lg:[&>li]:border-b lg:[&>li:nth-child(odd)]:border-r">
          {(all_ ? list : list.slice(0, CAP)).map((e) => {
            const d = !!progress[e.lesson.id], I = FAM_ICON[e.fam];
            return (
              <li key={e.lesson.id + e.n}>
                <a href={"#" + e.lesson.id + "/ex-" + e.n} className="grid grid-cols-[22px_minmax(0,1fr)_auto_16px] items-center gap-3 px-4 py-3 transition-colors hover:bg-accent">
                  <span className={cn("grid size-5 place-items-center rounded-full border", d ? "border-brand bg-brand text-brand-foreground" : "border-input")}>{d && <Check className="size-3" />}</span>
                  <span className="min-w-0"><b className="block truncate text-sm font-medium leading-snug">{e.title}</b><span className="block truncate text-xs text-muted-foreground">Lesson {e.lesson.num} · {e.lesson.title}</span></span>
                  <Badge variant="secondary" className="hidden font-normal sm:inline-flex"><I />{e.kind || e.fam}</Badge>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </a>
              </li>
            );
          })}
        </ol>
        {!list.length && <p className="p-6 text-sm text-muted-foreground">No exercises match these filters.</p>}
      </Card>
      <ShowMore hidden={list.length - CAP} open={all_} onToggle={() => setAll(!all_)} noun="exercises" />
    </Page>
  );
}
