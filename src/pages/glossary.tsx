import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/shell";
import { byId, GW } from "@/lib/kern";
import { cn } from "@/lib/utils";

export default function Glossary({ term }: { term: string }) {
  const keys = useMemo(() => Object.keys(GW.glossary).sort((a, b) => GW.glossary[a][0].localeCompare(GW.glossary[b][0])), []);
  const [q, setQ] = useState("");
  const [flash, setFlash] = useState("");
  const ql = q.toLowerCase().trim();
  const shown = keys.filter((k) => !ql || (GW.glossary[k][0] + " " + GW.glossary[k][1]).toLowerCase().includes(ql));
  useEffect(() => {
    if (!term) return;
    const el = document.getElementById("term-" + term);
    if (el) { el.scrollIntoView({ block: "center" }); setFlash(term); const t = setTimeout(() => setFlash(""), 1800); return () => clearTimeout(t); }
  }, [term]);
  return (
    <Page>
      <h1 className="text-h1 font-semibold">Glossary</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Every term the course relies on, in plain words. Each entry links to the lesson that explains it properly.</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. token, injection, eval" aria-label="Filter terms" className="pl-9" /></div>
        <p className="text-xs text-muted-foreground" aria-live="polite">{ql ? shown.length + " of " + keys.length + " terms" : keys.length + " terms"}</p>
      </div>
      {!shown.length && <p className="mt-6 text-sm text-muted-foreground">No terms match. Try a shorter word, or <Button variant="link" className="h-auto p-0" onClick={() => setQ("")}>clear the filter</Button>.</p>}
      <Card className="mt-6 gap-0 py-0">
        <dl className="divide-y">
          {shown.map((k) => {
            const g = GW.glossary[k], l = g[2] && byId[g[2]];
            return (
              <div key={k} className={cn("grid gap-1 px-5 py-4 transition-colors sm:grid-cols-[220px_1fr] sm:gap-6", flash === k && "bg-brand-tint")}>
                <dt id={"term-" + k} className="font-semibold">{g[0]}</dt>
                <dd className="text-caption text-ink-2">{g[1]}{l && <a href={"#" + l.id} className="mt-1 block text-xs text-brand underline-offset-4 hover:underline">Explained in: {l.title}</a>}</dd>
              </div>
            );
          })}
        </dl>
      </Card>
    </Page>
  );
}
