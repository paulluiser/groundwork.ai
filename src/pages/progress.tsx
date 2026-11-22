import { useEffect, useState, type FormEvent } from "react";
import { Award, ChevronDown, ChevronRight, Copy, Mail, QrCode, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Meter } from "@/components/brand";
import { Disclosure, onDark, Page, PageHeader, SectionHead, Spotlight } from "@/components/shell";
import { byId, coreIds, copyText, decodeProgress, lessons, load, pathLong, prettyCode, resumeLink, routeFor, trackIdOf, trackName, trackOf, uniq } from "@/lib/kern";
import { go, useStore } from "@/lib/store";

export function tracksFor(roles: string[]) {
  const out = [{ k: "core", name: "Core lessons", ids: coreIds }];
  uniq(roles.filter((r) => r !== "general").map(trackIdOf)).forEach((t) => out.push({ k: t, name: trackName(t) + " track", ids: trackOf(t) }));
  out.push({ k: "path", name: "Your whole path", ids: routeFor(roles) });
  return out;
}

let qrLoad: Promise<void> | null = null;
function QR({ link }: { link: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    const w = window as unknown as { qrcode?: (t: number, l: string) => { addData: (s: string) => void; make: () => void; getModuleCount: () => number; isDark: (y: number, x: number) => boolean } };
    qrLoad = qrLoad || new Promise<void>((ok, no) => { if (w.qrcode) return ok(); const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"; s.onload = () => ok(); s.onerror = () => no(); document.head.appendChild(s); });
    qrLoad.then(() => {
      const q = w.qrcode!(0, "M"); q.addData(link); q.make();
      const n = q.getModuleCount(), m = 4; let p = "";
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) p += "M" + (x + m) + " " + (y + m) + "h1v1h-1z";
      setSvg('<svg viewBox="0 0 ' + (n + 2 * m) + " " + (n + 2 * m) + '" shape-rendering="crispEdges" aria-hidden="true"><rect width="100%" height="100%" fill="#fff"/><path d="' + p + '" fill="#111110"/></svg>');
    }, () => { qrLoad = null; setErr(true); });
  }, [link]);
  if (err) return <p className="text-sm text-muted-foreground">The QR code needs a connection to load. Use the resume link instead.</p>;
  if (!svg) return <div className="grid aspect-square w-48 animate-pulse place-items-center rounded-lg bg-muted" role="status"><span className="sr-only">Loading the QR code</span></div>;
  return <div className="w-48 overflow-hidden rounded-lg border" role="img" aria-label="QR code for your resume link" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function ProgressPage({ prefill }: { prefill: string }) {
  const { roles, progress, code, restore, clearAll, setNotice } = useStore();
  const has = roles.length > 0;
  const [val, setVal] = useState(prefill || "");
  const [err, setErr] = useState(() => { if (!prefill) return ""; const d = decodeProgress(prefill); return d.error || ""; });
  const [msg, setMsg] = useState("");
  const path = routeFor(roles), n = path.filter((id) => progress[id]).length, next = path.find((id) => !progress[id]);
  const link = resumeLink(code), pretty = prettyCode(code);
  const copy = (t: string, ok: string) => copyText(t).then((r) => setMsg(r ? ok : "Couldn't copy automatically. Select the code and copy it yourself."));
  const team = load<{ n: string } | null>("gw-team", null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er = restore(val);
    if (er) { setErr(er); return; }
    const r = load<string[]>("gw-roles", []), p = load<Record<string, boolean>>("gw-progress", {}), pa = routeFor(r);
    setNotice("Progress restored: " + pathLong(r) + ", " + pa.filter((id) => p[id]).length + " of " + pa.length + " lessons done.");
    go("home");
  };

  const restoreForm = (
    <form onSubmit={submit} noValidate className="grid gap-2">
      <Label htmlFor="pc-in">Progress code</Label>
      <p className="text-xs text-muted-foreground" id="pc-help">15 or 24 letters and numbers, with or without the dashes.{has && " Restoring switches to the roles in the code and keeps every lesson you have completed here."}</p>
      <div className="flex flex-wrap gap-2">
        <Input id="pc-in" value={val} onChange={(e) => setVal(e.target.value)} autoComplete="off" autoCapitalize="characters" spellCheck={false} autoFocus={!has} placeholder="KN-7K2Q9-M4TAB-8C1DE" aria-describedby="pc-help pc-err" aria-invalid={!!err} className="min-w-0 flex-1 uppercase" />
        <Button type="submit">Restore progress</Button>
      </div>
      <p id="pc-err" role="alert" className="text-sm text-destructive">{err}</p>
    </form>
  );

  if (!has) return (
    <Page>
      <PageHeader back={["#welcome", "Back"]} title="Continue with a code" description="Enter the progress code from your other device. Your roles and completed lessons come back in this browser." />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card><CardContent>{restoreForm}</CardContent></Card>
        <Card><CardHeader><CardTitle>No code?</CardTitle><CardDescription>Choose your roles and start. Progress saves in this browser as you go.</CardDescription></CardHeader><CardFooter><Button asChild variant="secondary"><a href="#role">Choose your roles</a></Button></CardFooter></Card>
      </div>
    </Page>
  );

  return (
    <Page>
      <PageHeader eyebrow={"Your path: " + pathLong(roles)} title="Progress" description="Everything saves in this browser. Use your code or resume link to carry it to another device." />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid gap-6">
          <Spotlight eyebrow={next ? "Up next · Lesson " + byId[next].num + " · " + byId[next].minutes + " min" : "Path complete"} title={next ? byId[next].title : "Every lesson on your path is done"}
            action={<Button asChild className={onDark}><a href={"#" + (next || "home")}>{next ? "Continue learning" : "Back to lessons"}<ChevronRight /></a></Button>}
            aside={<div className="flex items-center gap-4 md:flex-col md:items-end"><Meter value={n / path.length} size={44} /><p className="text-sm text-primary-foreground/75"><b className="text-h1 font-medium text-primary-foreground tabular-nums">{n}</b> / {path.length} done</p></div>}>
            {lessons.filter((l) => progress[l.id]).length} of {lessons.length} lessons completed across the whole library.
          </Spotlight>
          <section>
            <SectionHead title={<span className="flex items-center gap-2"><Award className="size-5 text-brand" />Tracks and certificates</span>} meta="Finish a track to make a certificate" />
            <Card className="gap-0 overflow-hidden py-0"><ul className="divide-y">
              {tracksFor(roles).map((t) => {
                const d = t.ids.filter((id) => progress[id]).length, full = d === t.ids.length;
                const inner = <><span className="flex items-center gap-3"><Meter value={d / t.ids.length} size={18} /><b className="text-sm font-medium">{t.name}</b></span><span className="flex items-center gap-1 text-xs text-muted-foreground">{full ? <b className="font-medium text-brand">Get your certificate</b> : d + " of " + t.ids.length + " done"}{full && <ChevronRight className="size-4" />}</span></>;
                return <li key={t.k}>{full ? <a href={"#certificate/" + t.k} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent">{inner}</a> : <div className="flex items-center justify-between gap-3 px-4 py-3">{inner}</div>}</li>;
              })}
            </ul></Card>
          </section>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Continue on another device</CardTitle><CardDescription>Open your resume link on the other device to pick up where you left off.</CardDescription></CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => copy(link, "Resume link copied. Open it on your other device.")}><Copy />Copy resume link</Button>
                <Button asChild variant="ghost"><a href={"mailto:?subject=" + encodeURIComponent("My Kern progress") + "&body=" + encodeURIComponent("Continue the course where I left off: " + link + "\n\nProgress code: " + pretty)}><Mail />Email it</a></Button>
              </div>
              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Or type this code</p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2"><p className="text-lg font-semibold tracking-wide" id="pc-code">{pretty}</p><Button variant="outline" size="sm" onClick={() => copy(pretty, "Code copied")}>Copy</Button></div>
                <p className="mt-1 text-xs text-muted-foreground">It changes as you complete lessons.</p>
              </div>
              <p className="text-sm text-brand empty:hidden" role="status" aria-live="polite">{msg}</p>
              <Collapsible>
                <CollapsibleTrigger asChild><Button variant="outline" size="sm" className="group"><QrCode />QR code<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" /></Button></CollapsibleTrigger>
                <CollapsibleContent className="mt-4 grid gap-2"><QR link={link} /><p className="text-xs text-muted-foreground">Point your phone’s camera at it to open the course where you left off.</p></CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
          <a href="#team" className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/60">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><Users className="size-4" /></span>
            <span className="min-w-0 flex-1"><span className="block text-xs text-muted-foreground">Learning with a team</span><b className="block truncate text-sm font-medium">{team ? team.n : "Make a team plan"}</b><span className="block truncate text-xs text-muted-foreground">{team ? "Open the team board" : "Share one link, compare with codes"}</span></span>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </a>
          <Disclosure title="Manage this browser" sub="Restore a different code, or clear your progress" defaultOpen={!!prefill}>
            <Card><CardContent className="grid gap-6">
              {restoreForm}
              <div className="grid gap-2 border-t pt-5">
                <p className="text-sm font-medium">Clear this browser</p>
                <p className="text-xs text-muted-foreground">Removes your roles and progress from this browser. Copy your code first if you want them back later.</p>
                <Button variant="outline" className="justify-self-start text-destructive" onClick={() => { if (window.confirm("Clear your roles and progress from this browser? This can't be undone unless you have your progress code.")) { clearAll(); go("welcome"); } }}>Clear progress in this browser</Button>
              </div>
            </CardContent></Card>
          </Disclosure>
        </div>
      </div>
    </Page>
  );
}
