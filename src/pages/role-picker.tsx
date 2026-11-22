import { useMemo, useState } from "react";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Page, PageHeader } from "@/components/shell";
import { byId, coreLast, GENERAL, GW, hours, load, MAXR, pathName, plural, roleInfo, routeFor, save, trackIdOf, trackName, type Role } from "@/lib/kern";
import { go, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function RolePicker() {
  const { roles, setRoles } = useStore();
  const first = !roles.length;
  const [picked, setPicked] = useState<string[]>(() => {
    const pick = load<string | null>("gw-pick", null); save("gw-pick", null);
    let p = roles.slice();
    if (pick && roleInfo(pick) && !p.includes(pick)) { if (pick === "general") p = ["general"]; else { p = p.filter((x) => x !== "general"); if (p.length < MAXR) p.push(pick); } }
    return p;
  });
  const [note, setNote] = useState("");
  const [q, setQ] = useState("");
  const gen = picked[0] === "general";

  const toggle = (id: string) => {
    setNote("");
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (id === "general") return ["general"];
      const rest = p.filter((x) => x !== "general");
      if (rest.length >= MAXR) { setNote("Up to three roles. Remove one to add another."); return p; }
      return [...rest, id];
    });
  };
  const makeMain = (id: string) => setPicked((p) => [id, ...p.filter((x) => x !== id)]);
  const save_ = () => { if (!picked.length) return; setRoles(picked); go("home"); };

  const ql = q.toLowerCase().trim();
  const match = (r: Role) => !ql || (r.name + " " + trackName(trackIdOf(r.id))).toLowerCase().includes(ql);
  const fams = useMemo(() => GW.families.map((f: { id: string; name: string }) => ({ ...f, roles: (GW.roles as Role[]).filter((r) => r.family === f.id) })), []);
  const shown = fams.map((f: { id: string; name: string; roles: Role[] }) => ({ ...f, roles: f.roles.filter(match) })).filter((f: { roles: Role[] }) => f.roles.length);

  const ids = picked.length ? routeFor(picked) : [];
  const extra = ids.slice(coreLast, -1);
  const track = gen ? [] : extra.filter((id) => byId[id].rid === trackIdOf(picked[0]));
  const also = extra.filter((id) => !track.includes(id));

  const chip = (r: Role) => {
    const i = picked.indexOf(r.id), on = i > -1;
    return (
      <button key={r.id} type="button" role="checkbox" aria-checked={on} onClick={() => toggle(r.id)} title={r.id === "general" ? undefined : trackName(trackIdOf(r.id)) + " track"}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-caption transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          on ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-ink-2/40")}>
        {on && <span className="grid size-4 place-items-center rounded-full bg-brand text-2xs text-brand-foreground">{gen ? <Check className="size-3" /> : i + 1}</span>}{r.name}
      </button>
    );
  };

  const summary = (
    <Card className="gap-4">
      <CardHeader><CardTitle id="ps-h">Your path</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {!picked.length ? <p className="text-sm text-muted-foreground">Pick the roles closest to your work. Not sure? Choose General: you can add roles later.</p> : (
          <ol className="grid gap-1">
            {picked.map((id, i) => (
              <li key={id} className="flex items-center gap-2 text-sm">
                <span className="grid size-5 place-items-center rounded-full bg-brand text-2xs text-brand-foreground">{gen ? <Check className="size-3" /> : i + 1}</span>
                <b className="flex-1 font-medium">{roleInfo(id)!.name}</b>
                {i > 0 && !gen && <Button variant="link" size="sm" className="h-7 px-1 text-xs text-muted-foreground" onClick={() => makeMain(id)}>Make this my main role</Button>}
                <Button variant="ghost" size="icon" className="size-7" aria-label={"Remove " + roleInfo(id)!.name} onClick={() => toggle(id)}><X className="size-4" /></Button>
              </li>
            ))}
          </ol>
        )}
        {picked.length > 0 && (<>
          <Separator />
          <ul className="grid gap-1.5 text-caption text-ink-2">
            <li className="flex justify-between"><span>Core lessons</span><b className="font-medium tabular-nums">{coreLast}</b></li>
            {track.length > 0 && <li className="flex justify-between"><span>{trackName(trackIdOf(picked[0]))} track</span><b className="font-medium tabular-nums">{track.length}</b></li>}
            {also.map((id) => <li key={id} className="flex justify-between"><span>{trackName(byId[id].rid!)}, first lesson</span><b className="font-medium">1</b></li>)}
            <li className="flex justify-between"><span>Capstone</span><b className="font-medium">1</b></li>
          </ul>
          <p className="text-caption text-muted-foreground"><b className="font-semibold text-foreground">{plural(ids.length, "lesson")}</b>, about {hours(ids)}</p>
        </>)}
        {note && <p className="text-caption text-warning" role="status">{note}</p>}
      </CardContent>
      <CardFooter className="hidden lg:flex"><Button className="w-full" disabled={!picked.length} onClick={save_}>{first ? "Start learning" : "Save roles"}</Button></CardFooter>
    </Card>
  );

  return (
    <Page>
      <PageHeader back={[first ? "#welcome" : "#home", "Back"]} title="Choose your roles" description="Pick up to three roles that match your work. Everyone gets the 8 core lessons; your first pick (your main role) adds three lessons written for that job, and any other picks add one each. Together these make your path. You can change it any time."
        actions={<div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a role" aria-label="Find a role" className="pl-9" />
        </div>} />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div role="group" aria-label="Roles, choose up to three" className="grid">
          {!ql && (<div className="grid gap-2 border-b py-3 sm:grid-cols-[168px_1fr]"><h2 className="pt-1.5 text-caption text-muted-foreground">Not sure yet</h2><div className="flex flex-wrap gap-1.5">{chip(GENERAL)}</div></div>)}
          {shown.map((f: { id: string; name: string; roles: Role[] }) => (
            <div key={f.id} className="grid gap-2 border-b py-3 last:border-0 sm:grid-cols-[168px_1fr]">
              <h2 className="pt-1.5 text-caption text-muted-foreground">{f.name}</h2>
              <div className="flex flex-wrap gap-1.5">{f.roles.map(chip)}</div>
            </div>
          ))}
          {!shown.length && <p className="py-6 text-sm text-muted-foreground">No roles match. Try a shorter word.</p>}
        </div>
        <aside className="lg:sticky lg:top-20">{summary}</aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <p className="min-w-0 flex-1 text-caption" aria-live="polite">{picked.length ? <><b className="block truncate font-semibold">{pathName(picked)}</b><span className="text-muted-foreground">{plural(ids.length, "lesson")}, about {hours(ids)}</span></> : "Choose at least one role"}</p>
        <Button disabled={!picked.length} onClick={save_}>{first ? "Start learning" : "Save roles"}</Button>
      </div>
    </Page>
  );
}
