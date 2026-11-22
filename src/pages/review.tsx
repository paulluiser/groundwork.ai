import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Meter } from "@/components/brand";
import { Page, PageHeader } from "@/components/shell";
import { byId, GW, load, plural, save } from "@/lib/kern";
import { useStore } from "@/lib/store";

/* Term review: Leitner boxes over the glossary, a few cards a day (gw-review, gw-revscope), as before. */
const GAP = [0, 1, 2, 4, 8, 16];
function today() { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); }
type St = Record<string, { b: number; d: number }>;

export default function Review() {
  const { progress } = useStore();
  const [scope, setScope] = useState<string>(() => load("gw-revscope", "done"));
  const make = (sc: string) => {
    const pool = Object.keys(GW.glossary).filter((k) => { const l = GW.glossary[k][2]; return sc === "all" || (l && progress[l]); });
    const st = load<St>("gw-review", {}), t = today();
    const due = pool.filter((k) => st[k] && st[k].d <= t), fresh = pool.filter((k) => !st[k]).slice(0, 5);
    const queue = due.slice(0, 15).concat(fresh).slice(0, 15);
    return { queue, i: 0, shown: false, knew: 0, total: queue.length, pool: pool.length };
  };
  const [s, setS] = useState(() => make(scope));
  const changeScope = (v: string) => { save("gw-revscope", v); setScope(v); setS(make(v)); };
  const answer = (knew: boolean) => {
    const k = s.queue[s.i], st = load<St>("gw-review", {}), cur = st[k] || { b: 0 }, b = knew ? Math.min(5, cur.b + 1) : 1;
    st[k] = { b, d: today() + GAP[b] }; save("gw-review", st);
    setS({ ...s, i: s.i + 1, shown: false, knew: s.knew + (knew ? 1 : 0) });
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (s.i >= s.queue.length || (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName))) return;
      if (!s.shown && (e.key === " " || e.key === "Enter")) { e.preventDefault(); setS({ ...s, shown: true }); }
      else if (s.shown && (e.key === "1" || e.key === "2")) { e.preventDefault(); answer(e.key === "2"); }
    };
    addEventListener("keydown", onKey); return () => removeEventListener("keydown", onKey);
  });
  const k = s.queue[s.i], g = k && GW.glossary[k], l = g && g[2] && byId[g[2]];
  let body;
  if (!s.pool) body = <p className="text-sm text-muted-foreground">No terms yet. Terms join the review when you finish the lesson that explains them. Or <Button variant="link" className="h-auto p-0" onClick={() => changeScope("all")}>review all terms</Button>.</p>;
  else if (s.i >= s.queue.length) {
    const st = load<St>("gw-review", {}), t = today(), nextDue = Object.keys(st).map((x) => st[x].d).filter((d) => d > t).sort((a, b) => a - b)[0];
    body = (<Card className="items-center text-center"><CardContent className="grid justify-items-center gap-3"><Meter value={1} size={40} /><h2 className="text-2xl font-semibold">{s.total ? "Done for today" : "Nothing due today"}</h2>
      <p className="text-sm text-muted-foreground">{s.total ? `You knew ${s.knew} of ${plural(s.total, "card")}. ` : ""}{nextDue ? `More cards are due ${nextDue - t === 1 ? "tomorrow" : "in " + (nextDue - t) + " days"}.` : ""}</p>
      <Button asChild variant="secondary"><a href="#exercises">Back to exercises</a></Button></CardContent></Card>);
  } else body = (
    <Card aria-live="polite" className="border-ex-line"><CardContent className="grid min-h-80 content-center justify-items-center gap-4 text-center">
      <p className="text-xs text-muted-foreground">Card {s.i + 1} of {s.queue.length}</p>
      <h2 className="text-h1 font-semibold">{g[0]}</h2>
      {!s.shown ? (<><Button onClick={() => setS({ ...s, shown: true })}>Show the meaning</Button><p className="text-xs text-muted-foreground">Press Space to show it.</p></>) : (<>
        <p className="max-w-lg text-ink-2">{g[1]}</p>
        {l && <a href={"#" + l.id} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><BookOpen className="size-3.5" /><b className="font-medium text-brand">Lesson {l.num}</b> {l.title}</a>}
        <div className="flex flex-wrap justify-center gap-2"><Button variant="secondary" onClick={() => answer(false)}>I didn’t know it</Button><Button autoFocus onClick={() => answer(true)}>I knew it</Button></div>
        <p className="text-xs text-muted-foreground">Or press 1 or 2.</p></>)}
    </CardContent></Card>
  );
  const st = load<St>("gw-review", {}), t = today(), known = Object.keys(st).filter((x) => st[x].b >= 3).length;
  return (
    <Page>
      <PageHeader back={["#exercises", "Exercises"]} title="Review terms" description="A few cards a day. Say the meaning to yourself, then check it. Terms you know come back less often."
        actions={<Tabs value={scope} onValueChange={changeScope}><TabsList><TabsTrigger value="done">From finished lessons</TabsTrigger><TabsTrigger value="all">All terms</TabsTrigger></TabsList></Tabs>} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>{body}</div>
        <Card className="gap-0 py-0"><CardContent className="grid gap-4 p-6">
          <p className="text-xs text-muted-foreground">Today</p>
          <div className="flex items-center gap-4"><Meter value={s.total ? Math.min(s.i, s.total) / s.total : 1} size={36} /><p className="text-sm"><b className="text-h1 font-medium tabular-nums">{Math.min(s.i, s.total)}</b> <span className="text-muted-foreground">of {plural(s.total, "card")}</span></p></div>
          <dl className="grid grid-cols-2 gap-3 border-t pt-4 text-xs">
            <div><dt className="text-muted-foreground">Terms in review</dt><dd className="mt-0.5 text-sm font-medium tabular-nums">{s.pool}</dd></div>
            <div><dt className="text-muted-foreground">Well known</dt><dd className="mt-0.5 text-sm font-medium tabular-nums">{known}</dd></div>
          </dl>
          <p className="border-t pt-4 text-xs text-muted-foreground">Keys: Space shows the meaning, 1 if you didn’t know it, 2 if you did.</p>
        </CardContent></Card>
      </div>
    </Page>
  );
}
