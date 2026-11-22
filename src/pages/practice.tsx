import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Meter } from "@/components/brand";
import { Disclosure, onDark, Page, PageHeader, SectionHead, Spotlight } from "@/components/shell";
import { byId, GW, load, plural, save, trackIdOf, trackName, uniq } from "@/lib/kern";
import { go, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* "You decide": the learner makes a call on an AI draft and writes what they'd check before the reviewer's answer opens.
   Results are stored by position in gw-practice, as before. */
type P = { r: string; t: string; ctx: string; draft: string; v: string; flags: [string, string, string][]; why: string; l: string };
type Mine = { v: string; note: string };
const CALLS: Record<string, [string, string, number]> = { ship: ["Ship it", "ok", 0], edit: ["Ship after edits", "warn", 1], reject: ["Don't ship", "bad", 2] };
const STAMP: Record<string, string> = { bad: "border-destructive/40 bg-danger-soft text-destructive", human: "border-destructive/40 bg-danger-soft text-destructive", warn: "border-warning/40 bg-warning-soft text-warning", ok: "border-brand-line bg-brand-tint text-brand" };
const practice = (): P[] => GW.practice || [];

function ordered(roles: string[]) {
  const mine = uniq(roles.map(trackIdOf)), list = practice().map((p, i) => ({ p, n: i + 1 }));
  return { mine, list: list.filter((x) => mine.includes(x.p.r)).concat(list.filter((x) => !mine.includes(x.p.r))) };
}

export function PracticeList() {
  const { roles } = useStore();
  const s = load<Record<number, Mine>>("gw-practice", {});
  const { mine, list } = ordered(roles);
  const done = list.filter((x) => s[x.n]), same = done.filter((x) => s[x.n].v === x.p.v).length, next = list.find((x) => !s[x.n]);
  const groups: [string, typeof list][] = [["Your roles", list.filter((x) => mine.includes(x.p.r))], [mine.length && mine[0] !== "general" ? "Other roles" : "All roles", list.filter((x) => !mine.includes(x.p.r))]];
  const rowsOf = (xs: typeof list) => (
    <Card className="gap-0 overflow-hidden py-0"><ul className="divide-y lg:grid lg:grid-cols-2 lg:divide-y-0 lg:[&>li]:border-b lg:[&>li:nth-child(odd)]:border-r">
      {xs.map((x) => { const r = s[x.n], st = !r ? "Not tried" : r.v === x.p.v ? "Same call" : "Different call"; return (
        <li key={x.n}><a href={"#practice/" + x.n} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent"><b className="min-w-0 text-sm font-medium">{x.p.t}</b><span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">{trackName(x.p.r)} · <span className={cn(r && r.v === x.p.v && "text-brand")}>{st}</span><ChevronRight className="size-4" /></span></a></li>
      ); })}
    </ul></Card>
  );
  return (
    <Page>
      <PageHeader back={["#exercises", "Exercises"]} title="You decide" description="Each draft came from an assistant. Decide whether it can ship, write down what you would check, then compare your call with a reviewer’s." />
      <Spotlight className="mb-8" eyebrow={next ? (done.length ? "Next draft · " : "Start here · ") + trackName(next.p.r) : "All drafts reviewed"} title={next ? next.p.t : "You’ve made a call on every draft"}
        action={next && <><Button asChild className={onDark}><a href={"#practice/" + next.n}>{done.length ? "Next draft" : "Start with this draft"}<ChevronRight /></a></Button><span className="text-xs text-primary-foreground/70">About 3 minutes</span></>}
        aside={<div className="flex items-center gap-4 md:flex-col md:items-end"><Meter value={done.length / (list.length || 1)} size={44} /><p className="text-sm text-primary-foreground/75"><b className="text-h1 font-medium text-primary-foreground tabular-nums">{done.length}</b> / {list.length} reviewed{done.length ? <span className="block text-xs">Same call on {same}</span> : null}</p></div>}>
        {next?.p.ctx}
      </Spotlight>
      <div className="grid gap-6">
        {groups.filter((g) => g[1].length).map(([h, xs], i) => i === 0 && groups[0][1].length
          ? <section key={h}><SectionHead title={h} meta={plural(xs.length, "draft")} />{rowsOf(xs)}</section>
          : <Disclosure key={h} title={h} meta={plural(xs.length, "draft")} defaultOpen={!groups[0][1].length}>{rowsOf(xs)}</Disclosure>)}
      </div>
    </Page>
  );
}

export function PracticeCase({ n }: { n: number }) {
  const { roles } = useStore();
  const p = practice()[n - 1];
  const [mine, setMine] = useState<Mine | null>(() => load<Record<number, Mine>>("gw-practice", {})[n] || null);
  const [call, setCall] = useState("");
  const [note, setNote] = useState("");
  const resRef = useRef<HTMLHeadingElement>(null);
  const [fresh, setFresh] = useState(false);
  useEffect(() => { setMine(load<Record<number, Mine>>("gw-practice", {})[n] || null); setCall(""); setNote(""); setFresh(false); }, [n]);
  useEffect(() => { if (fresh && resRef.current) { resRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); resRef.current.focus({ preventScroll: true }); } }, [fresh, mine]);
  if (!p) { go("practice", true); return null; }
  const { list } = ordered(roles), pos = list.findIndex((x) => x.n === n), nextX = list[pos + 1], l = byId[p.l];
  const submit = () => { const st = load<Record<number, Mine>>("gw-practice", {}); st[n] = { v: call, note: note.trim() }; save("gw-practice", st); setMine(st[n]); setFresh(true); };
  const again = () => { const st = load<Record<number, Mine>>("gw-practice", {}); delete st[n]; save("gw-practice", st); setMine(null); setCall(""); setNote(""); };
  const rv = CALLS[p.v], me = mine && CALLS[mine.v], d = me ? me[2] - rv[2] : 0;
  const verdict = d === 0 ? "Same call as the reviewer." : d < 0 ? "You would have let it through more easily than the reviewer." : "You were stricter than the reviewer. That’s the safer side to be on, though it costs time.";
  return (
    <Page>
      <PageHeader back={["#practice", "All drafts"]} eyebrow={"Draft " + (pos + 1) + " of " + list.length + " · " + trackName(p.r)} title={p.t} description={p.ctx} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <Card className="gap-0 overflow-hidden py-0"><div className="border-b bg-muted px-4 py-2 text-xs font-medium">AI draft</div><div className="lesson kern-lesson-body px-4 py-3 text-sm" dangerouslySetInnerHTML={{ __html: p.draft }} /></Card>
      <div className="lg:sticky lg:top-20">
      {!mine ? (
        <Card className="border-ex-line" style={{ background: "var(--ex-bg)" }}>
          <CardHeader><CardTitle id="pr-h">Your call</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <ToggleGroup type="single" variant="outline" spacing={2} value={call} onValueChange={(v) => v && setCall(v)} aria-labelledby="pr-h" className="flex-wrap justify-start bg-card">
              {Object.keys(CALLS).map((k) => <ToggleGroupItem key={k} value={k} className="px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{CALLS[k][0]}</ToggleGroupItem>)}
            </ToggleGroup>
            <div className="grid gap-2"><Label htmlFor="pr-note">What would you check or change?</Label><Textarea id="pr-note" value={note} onChange={(e) => setNote(e.target.value)} className="bg-card" aria-describedby="pr-hint" placeholder="For example: which claims you would verify, and how" /></div>
            <p className="text-xs text-muted-foreground" id="pr-hint">Choose a call and write a sentence or two. The reviewer’s answer opens after that, so you commit to your own first.</p>
            <Button className="justify-self-start" disabled={!(call && note.trim().length >= 12)} onClick={submit}>Compare with the reviewer</Button>
          </CardContent>
        </Card>
      ) : (
        <Card aria-live="polite">
          <CardHeader><CardTitle ref={resRef} tabIndex={-1} className="outline-none">The reviewer’s call</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap items-start gap-3"><span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", STAMP[rv[1]])}>{rv[0]}</span><p className="flex-1 text-sm"><b className="font-semibold">{verdict}</b> Your call: {me![0]}.</p></div>
            <div className="rounded-lg border bg-muted/50 p-3"><p className="text-xs text-muted-foreground">What you wrote</p><p className="mt-1 text-sm">{mine.note}</p></div>
            <div className="grid gap-2">{p.flags.map((f, i) => (<div key={i} className="flex items-start gap-3 text-sm"><span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium", STAMP[f[0]] || STAMP.warn)}>{f[1]}</span><span dangerouslySetInnerHTML={{ __html: f[2] }} /></div>))}</div>
            <p className="text-sm text-ink-2">{p.why}</p>
            <Button variant="link" className="h-auto justify-self-start p-0" onClick={again}>Try this one again</Button>
          </CardContent>
        </Card>
      )}
      </div>
      </div>
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        {l ? <a href={"#" + l.id} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><BookOpen className="size-4" /><b className="font-medium text-brand">Lesson {l.num}</b> {l.title}</a> : <span />}
        <Button asChild variant="secondary"><a href={nextX ? "#practice/" + nextX.n : "#practice"}>{nextX ? "Next draft" : "All drafts"}</a></Button>
      </footer>
    </Page>
  );
}
