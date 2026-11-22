import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Page, PageHeader, Spotlight, onDark } from "@/components/shell";
import { byId, GW, load, plural, save } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { tracksFor } from "@/pages/progress";
import { cn } from "@/lib/utils";

/* Track assessment: ten questions drawn from the knowledge checks of the track's lessons, in a shuffled
   order with shuffled options. 80% passes and unlocks the certificate. Results are kept in gw-assess. */
export type AssessResult = { best: number; total: number; passed: boolean; date: string };
type Q = { lesson: string; q: string; opts: { html: string; fb: string; right: boolean }[] };
export const PASS = 0.8, SIZE = 10;

export function assessResult(k: string): AssessResult | undefined { return load<Record<string, AssessResult>>("gw-assess", {})[k]; }

function questionsFor(ids: string[]): Q[] {
  const out: Q[] = [];
  ids.forEach((id) => {
    const html: string = GW.content[id]?.html || "";
    for (const m of html.matchAll(/<div class="check" data-a="(\d)"><p class="q">([\s\S]*?)<\/p><ul>([\s\S]*?)<\/ul>/g)) {
      const a = +m[1], lis = [...m[3].matchAll(/<li data-fb="([^"]*)">([\s\S]*?)<\/li>/g)];
      out.push({ lesson: id, q: m[2], opts: lis.map((li, i) => ({ html: li[2], fb: li[1], right: i === a })) });
    }
  });
  return out;
}
function shuffle<T>(a: T[]) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

/* Pick questions spread across the lessons, so every lesson in the track is represented. */
function draw(ids: string[]) {
  const pool = questionsFor(ids), byLesson: Record<string, Q[]> = {};
  pool.forEach((q) => (byLesson[q.lesson] = byLesson[q.lesson] || []).push(q));
  const lists = Object.values(byLesson).map(shuffle), picked: Q[] = [];
  const n = Math.min(SIZE, pool.length);
  for (let round = 0; picked.length < n; round++) lists.forEach((l) => { if (picked.length < n && l[round]) picked.push(l[round]); });
  return shuffle(picked).map((q) => ({ ...q, opts: shuffle(q.opts) }));
}

export default function Assessment({ k }: { k: string }) {
  const { roles, progress } = useStore();
  const t = tracksFor(roles).find((x) => x.k === k);
  const full = !!t && t.ids.every((id) => progress[id]);
  const [round, setRound] = useState(0);
  const qs = useMemo(() => (t ? draw(t.ids) : []), [k, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const prior = assessResult(k);

  if (!t) return <Page><PageHeader back={["#progress", "Progress"]} title="Assessment" description="That track isn't on your path." /></Page>;
  if (!full) return (
    <Page>
      <PageHeader back={["#progress", "Progress"]} eyebrow={t.name} title="Track assessment" description="Complete every lesson in this track first. The assessment draws its questions from all of them." />
      <p className="text-sm text-muted-foreground">{t.ids.filter((id) => progress[id]).length} of {t.ids.length} lessons completed. <a className="underline underline-offset-4" href={"#certificate/" + k}>See what's left</a></p>
    </Page>
  );

  const score = qs.filter((q, i) => picks[i] !== undefined && q.opts[picks[i]].right).length, need = Math.ceil(qs.length * PASS);
  const submit = () => {
    setSubmitted(true);
    const passed = score >= need, all = load<Record<string, AssessResult>>("gw-assess", {}), old = all[k];
    all[k] = { best: Math.max(score, old?.best || 0), total: qs.length, passed: passed || !!old?.passed, date: new Date().toISOString().slice(0, 10) };
    save("gw-assess", all);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const again = () => { setRound((r) => r + 1); setPicks({}); setSubmitted(false); window.scrollTo({ top: 0 }); };
  const passedNow = submitted && score >= need;

  return (
    <Page>
      <PageHeader back={["#progress", "Progress"]} eyebrow={t.name + " · " + plural(t.ids.length, "lesson")} title="Track assessment"
        description={`${qs.length} questions from across the track, in a new order each time. Get ${need} right to pass and unlock your certificate. You can retake it as often as you like.`} />
      {submitted ? (
        <Spotlight className="mb-8" eyebrow={passedNow ? "Passed" : "Not passed yet"} title={`${score} of ${qs.length} correct`}
          action={passedNow ? <Button asChild className={onDark}><a href={"#certificate/" + k}>Get your certificate</a></Button> : <Button className={onDark} onClick={again}><RotateCcw />Retake with new questions</Button>}>
          {passedNow ? "You've shown you can apply this track. The feedback below explains every answer." : `You need ${need}. Read the feedback on the questions you missed, revisit those lessons, then retake it.`}
        </Spotlight>
      ) : prior && (
        <p className="mb-6 text-sm text-muted-foreground">Your best so far: {prior.best} of {prior.total}{prior.passed ? " (passed)" : ""}, on {prior.date}.</p>
      )}
      <ol className="grid max-w-3xl gap-4">
        {qs.map((q, i) => (
          <li key={round + ":" + i}>
            <Card className="gap-3">
              <CardContent className="grid gap-3">
                <p className="text-xs text-muted-foreground">Question {i + 1} · from Lesson {byId[q.lesson].num}: {byId[q.lesson].title}</p>
                <p className="font-medium" dangerouslySetInnerHTML={{ __html: q.q }} />
                <div className="grid gap-2" role="radiogroup" aria-label={"Question " + (i + 1)}>
                  {q.opts.map((o, j) => {
                    const chosen = picks[i] === j, show = submitted && (chosen || o.right);
                    return (
                      <button key={j} type="button" role="radio" aria-checked={chosen} disabled={submitted} onClick={() => setPicks((p) => ({ ...p, [i]: j }))}
                        className={cn("flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors", !submitted && "hover:bg-accent", chosen && !submitted && "border-foreground bg-accent",
                          show && o.right && "border-brand bg-brand-tint", show && !o.right && "border-destructive/50 bg-danger-soft")}>
                        <span className="grid size-5 shrink-0 place-items-center rounded-full border text-2xs">{"ABCD"[j]}</span>
                        <span className="grid gap-1"><span dangerouslySetInnerHTML={{ __html: o.html }} />{show && <span className="flex items-start gap-1.5 text-xs text-muted-foreground">{o.right ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-brand" /> : <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />}{o.fb}</span>}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
      {!submitted && (
        <div className="sticky bottom-20 mt-6 flex max-w-3xl flex-wrap items-center gap-4 rounded-xl border bg-card p-4 md:bottom-4">
          <Progress value={(100 * Object.keys(picks).length) / qs.length} className="h-1.5 max-w-48 [&>div]:bg-brand" aria-label="Questions answered" />
          <span className="text-xs text-muted-foreground">{Object.keys(picks).length} of {qs.length} answered</span>
          <Button className="ml-auto" disabled={Object.keys(picks).length < qs.length} onClick={submit}>Submit answers</Button>
        </div>
      )}
    </Page>
  );
}
