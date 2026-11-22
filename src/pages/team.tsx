import { useEffect, useState, type FormEvent } from "react";
import { Copy, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Meter } from "@/components/brand";
import { Disclosure, onDark, Page, PageHeader, Spotlight } from "@/components/shell";
import { byId, CODE_LESSONS, copyText, coreIds, decodeProgress, GW, hours, lessons, load, plural, prettyCode, save, trackOf } from "@/lib/kern";
import { go, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* Team plans: a shared lesson list (link carries only the name and lesson slots) and a board built from progress codes. */
type Team = { n: string; l: string[]; m: { name: string; code: string }[]; me: string };
const b64 = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function unb64(s: string) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return decodeURIComponent(escape(atob(s))); }
const teamLink = (t: Team) => location.origin + location.pathname + "#team=" + b64(JSON.stringify({ n: t.n, l: t.l.map((id) => CODE_LESSONS.indexOf(id)).filter((i) => i > -1) }));
function readTeam(arg: string): { n: string; l: string[] } | null {
  try { const d = JSON.parse(unb64(arg)); const ids = (d.l || []).map((i: number) => CODE_LESSONS[i]).filter((id: string) => id && byId[id]); if (!ids.length || typeof d.n !== "string") return null; return { n: d.n.slice(0, 60), l: ids }; } catch { return null; }
}
const planGroups = () => [{ k: "core", name: "Core lessons", ids: coreIds }].concat(GW.tracks.map((t: { id: string; name: string }) => ({ k: t.id, name: t.name + " track", ids: trackOf(t.id) }))).concat([{ k: "capstone", name: "Capstone", ids: ["team-adoption"] }]);

export default function Team({ link }: { link: string }) {
  const [team, setTeam] = useState<Team | null>(() => load("gw-team", null));
  const [bad, setBad] = useState(false);
  useEffect(() => {
    if (!link) return;
    const t = readTeam(link);
    if (!t) { setBad(true); return; }
    const cur = load<Team | null>("gw-team", null), nt = { n: t.n, l: t.l, m: cur && cur.n === t.n ? cur.m : [], me: cur ? cur.me : "" };
    save("gw-team", nt); setTeam(nt); go("team", true);
  }, [link]);
  const update = (t: Team | null) => { save("gw-team", t); setTeam(t); };
  if (bad) return <Page><PageHeader title="Team plan" description="That team link doesn’t work. It may have been cut short when it was copied. Ask for the link again." /><Button onClick={() => { setBad(false); go("team"); }}>Make your own plan</Button></Page>;
  return team ? <Board team={team} update={update} /> : <Maker onCreate={update} />;
}

function Maker({ onCreate }: { onCreate: (t: Team) => void }) {
  const { roles } = useStore();
  const groups = planGroups();
  const [ks, setKs] = useState<string[]>(["core", "capstone"]);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  let ids: string[] = []; groups.forEach((g: { k: string; ids: string[] }) => { if (ks.includes(g.k)) ids = ids.concat(g.ids); });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr("Give the team a name, so teammates know which plan they’re joining."); return; }
    if (!ids.length) { setErr("Choose at least one group of lessons."); return; }
    const order = lessons.map((l) => l.id); ids.sort((x, y) => order.indexOf(x) - order.indexOf(y));
    onCreate({ n: name.trim(), l: ids, m: [], me: "" });
  };
  return (
    <Page>
      <PageHeader back={roles.length > 0 ? ["#progress", "Progress"] : undefined} title="Team plan" description="Choose the lessons your team will take, then share the link. Everyone’s progress stays in their own browser." />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Card><CardContent>
        <form onSubmit={submit} noValidate className="grid gap-5">
          <div className="grid gap-2"><Label htmlFor="tm-name">Team name</Label><Input id="tm-name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Payments squad" /></div>
          <fieldset className="grid gap-2"><legend className="mb-2 text-sm font-medium">Lessons in the plan</legend>
            <div className="grid gap-2 sm:grid-cols-2">{groups.map((g: { k: string; name: string; ids: string[] }) => (
              <label key={g.k} className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-3", ks.includes(g.k) && "border-brand-line bg-brand-tint/50")}>
                <Checkbox checked={ks.includes(g.k)} onCheckedChange={(c) => setKs((s) => (c ? [...s, g.k] : s.filter((x) => x !== g.k)))} className="mt-0.5" />
                <span><b className="block text-sm font-medium">{g.name}</b><small className="text-xs text-muted-foreground">{plural(g.ids.length, "lesson")}, about {hours(g.ids)}</small></span>
              </label>
            ))}</div>
          </fieldset>
          <p className="text-sm text-muted-foreground" aria-live="polite">{ids.length ? plural(ids.length, "lesson") + ", about " + hours(ids) + " per person" : "Choose at least one group of lessons"}</p>
          <p className="text-sm text-destructive" role="alert">{err}</p>
          <Button type="submit" className="justify-self-start">Create the plan</Button>
        </form>
      </CardContent></Card>
      <Card className="gap-3 bg-muted/50"><CardHeader><CardTitle className="text-sm">How it works</CardTitle></CardHeader><CardContent><ol className="grid list-decimal gap-2 pl-4 text-caption text-ink-2"><li>Name the team and pick the lessons.</li><li>Copy the invite link and send it round.</li><li>Teammates send you their progress code.</li><li>Paste the codes into the board to compare.</li></ol><p className="mt-3 text-xs text-muted-foreground">No accounts. The link carries only the name and lesson list.</p></CardContent></Card>
      </div>
    </Page>
  );
}

function Board({ team, update }: { team: Team; update: (t: Team | null) => void }) {
  const { roles, progress, code } = useStore();
  const has = roles.length > 0, plan = team.l, myN = plan.filter((id) => progress[id]).length, nextId = plan.find((id) => !progress[id]);
  const [lines, setLines] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [me, setMe] = useState(team.me || "");
  const line = (me.trim() || "Your name") + ": " + prettyCode(code);
  const row = (name: string, done: Record<string, boolean>, you: boolean) => {
    const n = plan.filter((id) => done[id]).length;
    return (
      <tr key={name + you} className={cn("border-t", you && "bg-brand-tint/40")}>
        <th scope="row" className="whitespace-nowrap px-3 py-2 text-left font-medium">{name}{you && name !== "You" && <small className="ml-1 text-xs text-muted-foreground">you</small>}</th>
        <td className="whitespace-nowrap px-3 py-2"><span className="flex items-center gap-2 text-xs"><Meter value={n / plan.length} size={16} />{n} of {plan.length}</span></td>
        {plan.map((id) => <td key={id} className="px-1 py-2 text-center"><span className={cn("inline-block size-3 rounded-full", done[id] ? "bg-brand" : "bg-tint-2")} /><span className="sr-only">{done[id] ? "Done" : "Not done"}</span></td>)}
      </tr>
    );
  };
  const add = (e: FormEvent) => {
    e.preventDefault();
    const t: Team = { ...team, m: team.m.slice() }, badL: string[] = []; let added = 0;
    lines.split(/\n+/).map((s) => s.trim()).filter(Boolean).forEach((s) => {
      const m = s.match(/^(.+?)[\s:,–—-]+((?:KN|LN|GW)[\s-]*[0-9A-Za-z][0-9A-Za-z\s-]{7,30})$/i);
      if (!m) { badL.push(s); return; }
      const d = decodeProgress(m[2]); if (d.error) { badL.push(s + " (the code doesn't check out)"); return; }
      const name = m[1].trim().slice(0, 40), c = m[2].toUpperCase().replace(/\s/g, ""), i = t.m.findIndex((x) => x.name.toLowerCase() === name.toLowerCase());
      if (i > -1) t.m[i].code = c; else t.m.push({ name, code: c });
      added += 1;
    });
    const why = "Couldn't add: " + badL.join("; ") + ". Each line needs a name, then a progress code.";
    if (badL.length && !added) { setErr(why); return; }
    update(t); setLines(badL.map((s) => s.replace(/ \(the code.*$/, "")).join("\n")); setErr(badL.length ? "Added " + added + ". " + why : "");
  };
  return (
    <Page>
      <PageHeader back={has ? ["#progress", "Progress"] : undefined} eyebrow="Team plan" title={team.n} description={plural(plan.length, "lesson") + ", about " + hours(plan) + " per person. The board is built from the codes you paste in, and only you can see it."} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="grid min-w-0 gap-6">
        {!has ? <Alert><AlertDescription className="flex flex-wrap items-center justify-between gap-3">To start, choose your roles. The team’s lessons are open to everyone, whatever roles you pick.<Button asChild size="sm"><a href="#role">Choose your roles</a></Button></AlertDescription></Alert>
          : <Spotlight eyebrow={"Up next for you · " + myN + " of " + plan.length + " done"} title={nextId ? byId[nextId].title : "You’ve finished the plan"}
            action={nextId && <Button asChild className={onDark}><a href={"#" + nextId}>Continue</a></Button>}>{nextId ? "Lesson " + byId[nextId].num + " · " + byId[nextId].minutes + " min" : "Every lesson in the team plan is done."}</Spotlight>}
        <Card className="min-w-0">
          <CardHeader><CardTitle>Board</CardTitle></CardHeader>
          <CardContent className="grid min-w-0 gap-4 [&>*]:min-w-0">
            <div className="relative overflow-x-auto rounded-lg border" tabIndex={0} role="region" aria-label="Team board">
              <table className="w-full text-sm"><thead className="bg-muted text-xs text-muted-foreground"><tr><th scope="col" className="px-3 py-2 text-left font-medium">Name</th><th scope="col" className="px-3 py-2 text-left font-medium">Done</th>{plan.map((id) => <th key={id} scope="col" className="px-1 py-2 font-medium" title={byId[id].title}><abbr title={byId[id].title} className="no-underline">{byId[id].num}</abbr></th>)}</tr></thead>
                <tbody>{has && row(team.me || "You", progress, true)}{team.m.map((m) => { const d = decodeProgress(m.code); return d.error === undefined ? row(m.name, d.progress, false) : null; })}</tbody></table>
            </div>
            {team.m.length ? <ul className="grid gap-1 text-sm">{team.m.map((m, i) => <li key={m.name} className="flex items-center justify-between gap-3"><span>{m.name} <code className="ml-1 rounded bg-muted px-1.5 text-xs">{m.code}</code></span><Button variant="link" size="sm" onClick={() => update({ ...team, m: team.m.filter((_, j) => j !== i) })}>Remove</Button></li>)}</ul> : <p className="text-sm text-muted-foreground">No teammates yet. Add them below.</p>}
          </CardContent>
        </Card>
        <Disclosure title="Add teammates" sub="Paste a name and a progress code per line" defaultOpen={!team.m.length}>
          <Card><CardContent>
            <form onSubmit={add} noValidate className="grid gap-2">
              <Label htmlFor="tm-lines" className="sr-only">Teammates to add</Label>
              <p className="text-xs text-muted-foreground" id="tm-help">One per line, a name and a progress code, like <code>Priya: KN-7K2Q9-M4TAB-8C1DE</code>. Pasting the same name again updates that person.</p>
              <Textarea id="tm-lines" rows={3} value={lines} onChange={(e) => setLines(e.target.value)} aria-describedby="tm-help tm-add-err" />
              <p className="text-sm text-destructive" id="tm-add-err" role="alert">{err}</p>
              <Button type="submit" className="justify-self-start">Add to the board</Button>
            </form>
          </CardContent></Card>
        </Disclosure>
      </div>
      <div className="grid min-w-0 gap-6 lg:sticky lg:top-20">
        {has && (
          <Card>
            <CardHeader><CardTitle>Share your line</CardTitle><CardDescription>Send this to whoever keeps the board. Copy it again after you finish lessons.</CardDescription></CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid max-w-sm gap-2"><Label htmlFor="tm-me">Your name</Label><Input id="tm-me" maxLength={40} value={me} onChange={(e) => setMe(e.target.value)} onBlur={() => update({ ...team, me: me.trim() })} placeholder="Your name" /></div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/50 p-3"><p className="font-semibold">{line}</p><Button variant="outline" size="sm" onClick={() => copyText(line).then((ok) => setMsg(ok ? "Line copied" : "Couldn't copy"))}><Copy />Copy your line</Button></div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle>Invite teammates</CardTitle><CardDescription>The link carries the team name and the lesson list, nothing else.</CardDescription></CardHeader>
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={() => copyText(teamLink(team)).then((ok) => setMsg(ok ? "Invite link copied" : "Couldn't copy automatically. Try again from a regular browser tab."))}><Copy />Copy invite link</Button>
            <Button variant="outline" onClick={() => { if (window.confirm("Leave “" + team.n + "”? The board and its codes are removed from this browser. Your own progress stays.")) update(null); }}><LogOut />Leave this plan</Button>
            <p className="w-full text-sm text-brand" role="status" aria-live="polite">{msg}</p>
          </CardFooter>
        </Card>
      </div>
      </div>
    </Page>
  );
}
