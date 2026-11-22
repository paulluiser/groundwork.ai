import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Page, PageHeader } from "@/components/shell";
import { byId, GW, plural, routeFor } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* Glossary, laid out like a reference index: search and topic filter on top, an A–Z rail that greys out
   empty letters, and one readable column of term / definition rows grouped by letter. */
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
type Entry = [string, string, string?];
const letterOf = (t: string) => { const c = t[0].toUpperCase(); return /[A-Z]/.test(c) ? c : "#"; };

export default function Glossary({ term }: { term: string }) {
  const { roles } = useStore();
  const G: Record<string, Entry> = GW.glossary;
  const keys = useMemo(() => Object.keys(G).sort((a, b) => G[a][0].localeCompare(G[b][0])), [G]);
  const path = routeFor(roles);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [flash, setFlash] = useState("");
  const [active, setActive] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const ql = q.toLowerCase().trim();

  const topics: [string, string][] = [["all", "All"], ...(path.length ? [["path", "Your path"] as [string, string]] : []), ...GW.parts.map((p: { id: string; title: string }) => [p.id, p.title] as [string, string])];
  const inTopic = (k: string) => { const l = G[k][2] && byId[G[k][2]!]; return topic === "all" || (topic === "path" ? !!l && path.includes(l.id) : !!l && l.part === topic); };
  const shown = keys.filter((k) => inTopic(k) && (!ql || (G[k][0] + " " + G[k][1]).toLowerCase().includes(ql)));
  const groups: Record<string, string[]> = {};
  shown.forEach((k) => (groups[letterOf(G[k][0])] = groups[letterOf(G[k][0])] || []).push(k));
  const letters = Object.keys(groups);

  // deep link: #glossary/term scrolls to it and highlights it briefly
  useEffect(() => {
    if (!term) return;
    setQ(""); setTopic("all");
    requestAnimationFrame(() => {
      const el = document.getElementById("term-" + term);
      if (el) { el.scrollIntoView({ block: "center" }); setFlash(term); }
    });
    const t = setTimeout(() => setFlash(""), 2000);
    return () => clearTimeout(t);
  }, [term]);

  // the letter in view is highlighted in the rail
  useEffect(() => {
    const els = [...(listRef.current?.querySelectorAll<HTMLElement>("[data-letter]") || [])];
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive((v.target as HTMLElement).dataset.letter || ""); }, { rootMargin: "-80px 0px -70% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [shown.length, topic, ql]);

  const jump = (L: string) => document.getElementById("gl-" + L)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const clear = () => { setQ(""); setTopic("all"); };

  return (
    <Page>
      <PageHeader title="Glossary" description="Every term the starter kit relies on, in plain words, with the lesson that explains it." />

      <div className="sticky top-14 z-20 -mx-4 mb-8 grid gap-2 border-b sm:gap-3 bg-background/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="relative w-full sm:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" autoFocus={!term} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a term" aria-label="Find a term" className="pl-9" /></div>
          <ToggleGroup type="single" spacing={1} value={topic} onValueChange={(v) => v && setTopic(v)} aria-label="Filter by topic" className="-mx-1 flex w-full justify-start overflow-x-auto px-1 sm:w-auto sm:flex-wrap sm:overflow-visible">
            {topics.map(([id, t]) => <ToggleGroupItem key={id} value={id} size="sm" className="shrink-0 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{t}</ToggleGroupItem>)}
          </ToggleGroup>
          <p className="hidden text-xs text-muted-foreground tabular-nums sm:ml-auto sm:block" aria-live="polite">{shown.length === keys.length ? plural(keys.length, "term") : shown.length + " of " + keys.length + " terms"}</p>
        </div>
        {/* A–Z: a single row on phones and tablets */}
        <nav aria-label="Jump to a letter" className="-mx-1 flex overflow-x-auto lg:hidden">
          {ABC.map((L) => <button key={L} type="button" disabled={!groups[L]} onClick={() => jump(L)} className={cn("grid size-8 shrink-0 place-items-center rounded-md text-xs", groups[L] ? "hover:bg-accent" : "text-muted-foreground/40", active === L && "bg-accent font-medium")}>{L}</button>)}
        </nav>
      </div>

      {!shown.length ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No terms match “{q || topics.find((t) => t[0] === topic)?.[1]}”</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a shorter word, or search all topics.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={clear}>Clear search and filter</Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[40px_minmax(0,1fr)]">
          {/* A–Z rail on wide screens */}
          <nav aria-label="Jump to a letter" className="hidden lg:block">
            <div className="sticky top-40 grid">
              {ABC.map((L) => <button key={L} type="button" disabled={!groups[L]} onClick={() => jump(L)} className={cn("grid h-6 w-8 place-items-center rounded text-xs", groups[L] ? "text-muted-foreground hover:bg-accent hover:text-foreground" : "text-muted-foreground/30", active === L && "bg-accent font-medium text-foreground")}>{L}</button>)}
            </div>
          </nav>

          <div ref={listRef} className="grid max-w-4xl gap-10">
            {letters.map((L) => (
              <section key={L} id={"gl-" + L} data-letter={L} aria-labelledby={"glh-" + L} className="scroll-mt-44">
                <h2 id={"glh-" + L} className="mb-1 flex items-baseline justify-between border-b pb-2 text-lg font-semibold">{L}<span className="text-xs font-normal text-muted-foreground tabular-nums">{plural(groups[L].length, "term")}</span></h2>
                <dl className="divide-y">
                  {groups[L].map((k) => {
                    const [t, d, lid] = G[k], l = lid && byId[lid];
                    return (
                      <div key={k} className={cn("grid gap-1 py-4 transition-colors sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:gap-8", flash === k && "-mx-3 rounded-lg bg-brand-tint px-3")}>
                        <dt id={"term-" + k} className="scroll-mt-44 text-sm font-semibold">{t}</dt>
                        <dd className="text-caption text-ink-2">
                          {d}
                          {l && <a href={"#" + l.id} className="ml-2 inline-flex min-h-6 items-center whitespace-nowrap text-xs text-muted-foreground underline-offset-4 hover:text-brand hover:underline">Lesson {l.num}</a>}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
