import { useState } from "react";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Meter } from "@/components/brand";
import { Page } from "@/components/shell";
import { byId, coreLast, GENERAL, GW, hours, lessons, load, pathLong, plural, roleInfo, routeFor, save, totalMin, trackIdOf, trackName, type Lesson } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function Row({ l, done, next, onPath, showRole }: { l: Lesson; done: boolean; next?: boolean; onPath?: boolean; showRole?: boolean }) {
  return (
    <li>
      <a href={"#" + l.id} className={cn("grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3 transition-colors hover:bg-accent", next && "bg-brand-tint/60")}>
        <span className="pt-0.5 text-caption text-muted-foreground tabular-nums">{l.num}</span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2 font-medium">{l.title}
            {showRole && l.role && <Badge variant="outline" className="font-normal">{l.role}</Badge>}
            {onPath && <Badge variant="secondary" className="font-normal">On your path</Badge>}
          </span>
          <span className="mt-0.5 block text-caption text-muted-foreground">{l.summary}</span>
        </span>
        <span className={cn("whitespace-nowrap pt-0.5 text-xs", done ? "text-brand" : next ? "font-medium" : "text-muted-foreground")}>
          {done ? <span className="inline-flex items-center gap-1"><CheckCircle2 className="size-3.5" />Completed</span> : next ? "Up next, " + l.minutes + " min" : l.minutes + " min"}
        </span>
      </a>
    </li>
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

  return (
    <Page>
      {notice && <Alert className="mb-6" role="status"><CheckCircle2 className="text-brand" /><AlertDescription className="flex items-center justify-between gap-3">{notice}<Button variant="ghost" size="sm" onClick={() => setNotice("")}>Dismiss</Button></AlertDescription></Alert>}
      <section className="mb-8">
        <p className="text-sm text-muted-foreground">Your path: {pathLong(roles)}</p>
        <h1 className="mt-1 text-h1 font-semibold">{!next ? "Path complete" : n ? `You're on step ${pos} of ${path.length}` : "Start your path"}</h1>
        <div className="mt-4 flex items-center gap-3"><Progress value={(100 * n) / path.length} className="h-1.5 max-w-xs [&>div]:bg-brand" aria-label="Progress on your path" /><span className="text-xs text-muted-foreground">{n} of {path.length} done{left.length ? ", about " + hours(left) + " left" : ""}</span></div>
        <Card className="mt-6">
          <CardHeader className="gap-1.5">
            <p className="text-xs text-brand">{nl ? `Up next: lesson ${nl.num}, ${nl.minutes} min` : `All ${path.length} lessons done`}</p>
            <CardTitle className="text-xl">{nl ? nl.title : "Revisit the capstone, or explore the full library"}</CardTitle>
            {nl && <CardDescription>{nl.summary}</CardDescription>}
          </CardHeader>
          <CardContent><Button asChild><a href={"#" + (next || "team-adoption")}>{nl ? (n ? "Continue lesson" : "Start lesson") : "Open the capstone"}<ArrowRight /></a></Button></CardContent>
        </Card>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={scope} onValueChange={(v) => { setScope(v); save("gw-homescope", v); }}>
          <TabsList><TabsTrigger value="path">Your path ({path.length})</TabsTrigger><TabsTrigger value="all">Full library ({lessons.length})</TabsTrigger></TabsList>
        </Tabs>
        <div className="flex gap-1"><Button asChild variant="ghost" size="sm"><a href="#role">Change roles</a></Button><Button variant="ghost" size="sm" onClick={onSearch}><Search />Search lessons and terms</Button></div>
      </div>

      {scope === "path" ? (
        <div className="grid gap-6">
          {stages.map((s) => {
            const d = s.ids.filter((id) => progress[id]).length;
            return (
              <section key={s.h}>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <div><h2 className="text-lg font-semibold">{s.h}</h2><p className="text-caption text-muted-foreground">{s.p}</p></div>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground"><Meter value={d / s.ids.length} size={14} />{d === s.ids.length ? "Done" : d + " of " + plural(s.ids.length, "lesson")}</span>
                </div>
                <Card className="gap-0 overflow-hidden py-0"><ol className="divide-y">{s.ids.map((id) => <Row key={id} l={byId[id]} done={!!progress[id]} next={id === next} />)}</ol></Card>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-8">
          <p className="text-sm text-muted-foreground">{lessons.length} lessons, about {Math.round((totalMin / 60) * 2) / 2} hours in all. Every lesson stays open to you; lessons on your path are marked.</p>
          {GW.parts.map((p: { id: string; title: string; blurb: string }) => {
            const ls = lessons.filter((l) => l.part === p.id);
            return (
              <section key={p.id}>
                <div className="mb-2"><h2 className="text-lg font-semibold">{p.title} <span className="text-xs font-normal text-muted-foreground">· {plural(ls.length, "lesson")}</span></h2><p className="text-caption text-muted-foreground">{p.blurb}</p></div>
                <Card className="gap-0 overflow-hidden py-0"><ol className="divide-y">{ls.map((l) => <Row key={l.id} l={l} done={!!progress[l.id]} onPath={l.part === "c" && path.includes(l.id)} showRole />)}</ol></Card>
              </section>
            );
          })}
        </div>
      )}
    </Page>
  );
}
