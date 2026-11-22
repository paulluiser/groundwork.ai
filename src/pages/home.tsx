import { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Clock, Dumbbell, Layers, Lightbulb, Repeat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Meter } from "@/components/brand";
import { Disclosure, Page, PageHeader } from "@/components/shell";
import { byId, coreLast, exercises, GENERAL, GW, hours, lessons, load, pathLong, plural, roleInfo, routeFor, save, totalMin, trackIdOf, trackName, uniq, type Lesson } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* One lesson row: number, title, time or status. Only the next lesson shows its summary. */
function Row({ l, done, next, onPath, showRole }: { l: Lesson; done: boolean; next?: boolean; onPath?: boolean; showRole?: boolean }) {
  return (
    <li>
      <a href={"#" + l.id} aria-current={next ? "step" : undefined} className={cn("grid grid-cols-[28px_minmax(0,1fr)_auto] items-start gap-3 px-4 py-2.5 transition-colors hover:bg-accent", next && "bg-brand-tint/60 hover:bg-brand-tint")}>
        <span className={cn("pt-px text-caption tabular-nums", next ? "font-medium text-brand" : "text-muted-foreground")}>{l.num}</span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">{l.title}
            {showRole && l.role && <Badge variant="outline" className="font-normal">{l.role}</Badge>}
            {onPath && <Badge variant="secondary" className="font-normal">On your path</Badge>}
          </span>
          {next && <span className="mt-0.5 block text-caption text-muted-foreground">{l.summary}</span>}
        </span>
        <span className={cn("whitespace-nowrap pt-px text-xs tabular-nums", done ? "text-brand" : next ? "font-medium text-foreground" : "text-muted-foreground")}>
          {done ? <span className="inline-flex items-center gap-1"><CheckCircle2 className="size-3.5" />Done</span> : next ? "Up next · " + l.minutes + " min" : l.minutes + " min"}
        </span>
      </a>
    </li>
  );
}

function Tile({ href, icon: I, label, value, note }: { href: string; icon: typeof Search; label: string; value: string; note: string }) {
  return (
    <a href={href} className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/60">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><I className="size-4" /></span>
      <span className="min-w-0 flex-1"><span className="block text-xs text-muted-foreground">{label}</span><b className="block truncate text-sm font-medium">{value}</b><span className="block truncate text-xs text-muted-foreground">{note}</span></span>
      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Home({ onSearch }: { onSearch: () => void }) {
  const { roles, progress, notice, setNotice } = useStore();
  const [scope, setScope] = useState<string>(() => load("gw-homescope", "path"));
  const path = routeFor(roles), n = path.filter((id) => progress[id]).length, gen = roles[0] === "general", main = roleInfo(roles[0]) || GENERAL;
  const left = path.filter((id) => !progress[id]), next = left[0], pos = next ? path.indexOf(next) + 1 : path.length;
  const nl = next ? byId[next] : null;
  const track = gen ? [] : path.filter((id) => byId[id].rid === trackIdOf(roles[0]));
  const also = path.slice(coreLast, -1).filter((id) => !track.includes(id));
  const stages = [
    { h: "Core lessons", p: "For everyone: how models work, and how to work with them.", ids: path.slice(0, coreLast) },
    { h: trackName(trackIdOf(main.id)) + " track", p: main.track && main.track !== main.id ? "The track your main role uses, in order." : "Your main role's lessons, in order.", ids: track },
    { h: "Also recommended", p: roles.length === 1 ? main.why : "The first lesson for each of your other roles.", ids: also },
    { h: "Capstone", p: "Bring AI into a team deliberately.", ids: ["team-adoption"] },
  ].filter((s) => s.ids.length);
  const libDone = lessons.filter((l) => progress[l.id]).length;

  // Practice tiles
  const ex = exercises().filter((e) => path.includes(e.lesson.id)), exDone = ex.filter((e) => progress[e.lesson.id]).length;
  const mine = gen ? [] : uniq(roles.map(trackIdOf)), uc = (GW.useCases || []).filter((u: { r: string }) => !mine.length || mine.includes(u.r)).length;
  const terms = Object.keys(GW.glossary).filter((k) => { const l = GW.glossary[k][2]; return l && progress[l]; }).length;
  const openPart = nl ? nl.part : "a";

  return (
    <Page>
      {notice && <Alert className="mb-6" role="status"><CheckCircle2 className="text-brand" /><AlertDescription className="flex items-center justify-between gap-3">{notice}<Button variant="ghost" size="sm" onClick={() => setNotice("")}>Dismiss</Button></AlertDescription></Alert>}
      <PageHeader eyebrow={"Your path: " + pathLong(roles)} title="Lessons"
        actions={<><Button asChild variant="ghost" size="sm"><a href="#role">Change roles</a></Button><Button variant="outline" size="sm" onClick={onSearch} className="text-muted-foreground"><Search />Search lessons</Button></>} />

      {/* Dashboard: the next lesson is where the eye lands; progress and practice sit beside and below it. */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <a href={"#" + (next || "team-adoption")} className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground transition-colors hover:bg-primary/95 md:p-8">
          <div>
            <p className="flex items-center gap-2 text-caption text-primary-foreground/70"><span className="size-1.5 rounded-full bg-brand" />{nl ? `Up next · Lesson ${nl.num} · step ${pos} of ${path.length}` : `All ${path.length} lessons done`}</p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight md:text-h1">{nl ? nl.title : "Revisit the capstone, or explore the full library"}</h2>
            {nl && <p className="mt-2 max-w-2xl text-sm text-primary-foreground/75">{nl.summary}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-foreground px-5 text-sm font-medium text-primary">{nl ? (n ? "Continue lesson" : "Start lesson") : "Open the capstone"}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
            {nl && <span className="flex items-center gap-1.5 text-xs text-primary-foreground/70"><Clock className="size-3.5" />{nl.minutes} min</span>}
          </div>
        </a>
        <Card className="gap-0 py-0">
          <CardContent className="grid content-between gap-5 p-6">
            <div className="flex items-center gap-4">
              <Meter value={n / path.length} size={44} />
              <div><p className="text-h1 font-medium leading-none tabular-nums">{n}<span className="text-lg text-muted-foreground"> / {path.length}</span></p><p className="mt-1 text-xs text-muted-foreground">lessons done on your path</p></div>
            </div>
            <Progress value={(100 * n) / path.length} className="h-1.5 [&>div]:bg-brand" aria-label="Progress on your path" />
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div><dt className="text-muted-foreground">Time left</dt><dd className="mt-0.5 text-sm font-medium">{left.length ? "About " + hours(left) : "None"}</dd></div>
              <div><dt className="text-muted-foreground">Whole library</dt><dd className="mt-0.5 text-sm font-medium tabular-nums">{libDone} of {lessons.length}</dd></div>
            </dl>
            <a href="#progress" className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground">Progress code and certificates<ChevronRight className="size-4" /></a>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Tile href="#exercises" icon={Dumbbell} label="Exercises" value={`${exDone} of ${ex.length} done`} note="Hands-on practice from your lessons" />
        {GW.useCases?.length > 0 && <Tile href="#usecases" icon={Lightbulb} label="Use cases" value={plural(uc, "use case")} note={mine.length ? "For your roles, with guides" : "With step-by-step guides"} />}
        <Tile href="#review" icon={Repeat} label="Review terms" value={terms ? plural(terms, "term") + " unlocked" : "Nothing yet"} note="A few cards a day" />
      </div>

      <div className="mb-4 mt-10 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={scope} onValueChange={(v) => { setScope(v); save("gw-homescope", v); }}>
          <TabsList><TabsTrigger value="path">Your path ({path.length})</TabsTrigger><TabsTrigger value="all">Full library ({lessons.length})</TabsTrigger></TabsList>
        </Tabs>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Layers className="size-3.5" />{scope === "path" ? plural(stages.length, "stage") + ", about " + hours(path) : lessons.length + " lessons, about " + Math.round((totalMin / 60) * 2) / 2 + " hours"}</p>
      </div>

      {scope === "path" ? (
        <div className="grid gap-4">
          {stages.map((s) => {
            const d = s.ids.filter((id) => progress[id]).length;
            return (
              <Disclosure key={s.h} title={s.h} sub={s.p} defaultOpen={next ? s.ids.includes(next) : s === stages[0]}
                meta={<><Meter value={d / s.ids.length} size={14} />{d === s.ids.length ? "Done" : d + " of " + s.ids.length}</>}>
                <Card className="gap-0 overflow-hidden py-0"><ol className="divide-y">{s.ids.map((id) => <Row key={id} l={byId[id]} done={!!progress[id]} next={id === next} />)}</ol></Card>
              </Disclosure>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4">
          {GW.parts.map((p: { id: string; title: string; blurb: string }) => {
            const ls = lessons.filter((l) => l.part === p.id), d = ls.filter((l) => progress[l.id]).length;
            return (
              <Disclosure key={p.id} title={p.title} sub={p.blurb} defaultOpen={p.id === openPart}
                meta={<><Meter value={d / ls.length} size={14} />{d} of {ls.length}</>}>
                <Card className="gap-0 overflow-hidden py-0"><ol className="divide-y">{ls.map((l) => <Row key={l.id} l={l} done={!!progress[l.id]} next={l.id === next} onPath={l.part === "c" && path.includes(l.id)} showRole />)}</ol></Card>
              </Disclosure>
            );
          })}
        </div>
      )}
    </Page>
  );
}
