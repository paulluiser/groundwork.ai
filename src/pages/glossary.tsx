import { useEffect, useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Page, PageHeader, SectionHead } from "@/components/shell";
import { byId, GW, plural } from "@/lib/kern";
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
  const letters: Record<string, string[]> = {};
  shown.forEach((k) => { const c = GW.glossary[k][0][0].toUpperCase(), L = /[A-Z]/.test(c) ? c : "#"; (letters[L] = letters[L] || []).push(k); });
  const all = Array.from(new Set(keys.map((k) => { const c = GW.glossary[k][0][0].toUpperCase(); return /[A-Z]/.test(c) ? c : "#"; })));
  return (
    <Page>
      <PageHeader title="Glossary" description="Every term the course relies on, in plain words. Each entry links to the lesson that explains it properly.">
        <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[minmax(0,420px)_1fr] md:items-center">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" autoFocus={!term} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a term, e.g. token, injection, eval" aria-label="Filter terms" className="h-11 pl-9" /></div>
          <nav aria-label="Jump to a letter" className="flex flex-wrap gap-0.5">
            {all.map((L) => <a key={L} href={"#glossary"} onClick={(e) => { e.preventDefault(); document.getElementById("gl-" + L)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} aria-disabled={!letters[L]} className={cn("grid size-7 place-items-center rounded-md text-xs hover:bg-accent", !letters[L] && "pointer-events-none opacity-30")}>{L}</a>)}
          </nav>
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">{ql ? shown.length + " of " + keys.length + " terms" : keys.length + " terms"}</p>
      </PageHeader>
      {!shown.length && <p className="text-sm text-muted-foreground">No terms match. Try a shorter word, or <Button variant="link" className="h-auto p-0" onClick={() => setQ("")}>clear the filter</Button>.</p>}
      <div className="gap-x-8 md:columns-2 xl:columns-3">
        {Object.keys(letters).map((L) => (
          <section key={L} aria-labelledby={"gl-" + L} className="mb-8 break-inside-avoid-column">
            <SectionHead id={"gl-" + L} title={L} meta={plural(letters[L].length, "term")} className="scroll-mt-20" />
            <dl className="grid gap-1">
              {letters[L].map((k) => {
                const g = GW.glossary[k], l = g[2] && byId[g[2]];
                return (
                  <div key={k} className={cn("break-inside-avoid rounded-lg px-3 py-2.5 transition-colors", flash === k && "bg-brand-tint")}>
                    <dt id={"term-" + k} className="scroll-mt-24 text-sm font-semibold">{g[0]}</dt>
                    <dd className="mt-0.5 text-caption text-ink-2">{g[1]}{l && <a href={"#" + l.id} className="-mb-1.5 mt-0.5 flex min-h-7 items-center gap-1 text-xs text-brand underline-offset-4 hover:underline"><BookOpen className="size-3" />Lesson {l.num}: {l.title}</a>}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </Page>
  );
}
