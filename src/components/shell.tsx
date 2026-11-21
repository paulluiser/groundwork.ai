import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, ChevronDown, Dumbbell, Keyboard, Lightbulb, Menu, Moon, PieChart, Search, Sun, CaseSensitive, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mark, Meter } from "@/components/brand";
import { GW, byId, hasUseCases, lessons, pathLong, pathName, roleInfo, routeFor, searchIndex, version, type Hit } from "@/lib/kern";
import { useStore, useTheme } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "home", label: "Lessons", icon: BookOpen },
  { id: "exercises", label: "Exercises", icon: Dumbbell },
  { id: "usecases", label: "Use cases", icon: Lightbulb },
  { id: "glossary", label: "Glossary", icon: CaseSensitive },
  { id: "progress", label: "Progress", icon: PieChart },
];

export function Header({ tab, bare, lessonId, onSearch }: { tab: string; bare: boolean; lessonId?: string; onSearch: () => void }) {
  const { roles } = useStore();
  const [theme, toggle] = useTheme();
  const tabs = TABS.filter((t) => t.id !== "usecases" || hasUseCases);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-4 md:px-6">
        {lessonId && <LessonDrawer active={lessonId} />}
        <a href={roles.length && !bare ? "#home" : "#welcome"} className="mr-2 flex items-center gap-2 rounded-md font-semibold" aria-label="Kern, home">
          <Mark /><span className="hidden text-lg sm:inline">Kern</span>
        </a>
        {!bare && roles.length > 0 && (
          <nav aria-label="Course sections" className="hidden items-center gap-1 md:flex">
            {tabs.map((t) => (
              <Button key={t.id} asChild variant="ghost" size="sm" className={cn("text-muted-foreground", tab === t.id && "bg-accent text-foreground")}>
                <a href={"#" + t.id} aria-current={tab === t.id ? "page" : undefined}><t.icon className="size-4" />{t.label}</a>
              </Button>
            ))}
          </nav>
        )}
        <div className="ml-auto flex min-w-0 items-center gap-1.5">
          {!bare && roles.length > 0 && (
            <Button asChild variant="outline" size="sm" className="min-w-0 max-w-[8.5rem] sm:max-w-[16rem]">
              <a href="#role" aria-label={"Your path: " + pathLong(roles) + ". Change roles"}>
                <span className="hidden text-muted-foreground lg:inline">Path</span>
                <span className="truncate">{pathName(roles)}</span><ChevronDown className="size-3.5" />
              </a>
            </Button>
          )}
          {bare && <Button asChild variant="outline" size="sm"><a href={roles.length ? "#home" : "#progress"}>{roles.length ? "Open course" : "Have a code?"}</a></Button>}
          {!bare && (
            <Button variant="outline" size="sm" onClick={onSearch} aria-label="Search the course" className="text-muted-foreground">
              <Search className="size-4" /><span className="hidden lg:inline">Search</span>
              <kbd className="ml-2 hidden rounded border bg-muted px-1.5 text-2xs lg:inline">/</kbd>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

/* Phone tab bar: the five course sections at the bottom of the screen. */
export function MobileTabs({ tab }: { tab: string }) {
  const tabs = TABS.filter((t) => t.id !== "usecases" || hasUseCases);
  return (
    <nav aria-label="Course sections" className="fixed inset-x-0 bottom-0 z-40 grid border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((t) => (
        <a key={t.id} href={"#" + t.id} aria-current={tab === t.id ? "page" : undefined} className={cn("flex flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground", tab === t.id && "text-brand")}>
          <t.icon className="size-5" />{t.label}
        </a>
      ))}
    </nav>
  );
}

/* The lesson list: on large screens a sticky side column, on smaller ones a drawer. */
export function LessonRail({ active, onPick }: { active?: string; onPick?: () => void }) {
  const { roles, progress } = useStore();
  const path = routeFor(roles), n = path.filter((id) => progress[id]).length;
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="rounded-xl border bg-card p-3">
        <p className="text-xs text-muted-foreground">Your path</p>
        <p className="font-semibold leading-snug">{pathLong(roles) || "Not chosen"}</p>
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Meter value={n / path.length} size={14} />{n} of {path.length} lessons done</p>
        <a href="#role" onClick={onPick} className="mt-2 inline-block text-xs underline underline-offset-4">Change roles</a>
      </div>
      {GW.parts.map((p: { id: string; title: string }) => {
        const ls = lessons.filter((l) => l.part === p.id);
        const shown = p.id === "c" ? ls.filter((l) => path.includes(l.id) || l.id === active) : ls;
        return (
          <div key={p.id}>
            <p className="mb-1 px-2 text-xs text-muted-foreground">{p.title}</p>
            <ul className="grid gap-0.5">
              {shown.map((l) => (
                <li key={l.id}>
                  <a href={"#" + l.id} onClick={onPick} aria-current={l.id === active ? "page" : undefined}
                    className={cn("grid grid-cols-[22px_1fr_16px] items-start gap-2 rounded-md px-2 py-1.5 text-caption leading-snug hover:bg-accent", l.id === active && "bg-accent font-medium")}>
                    <span className="text-muted-foreground tabular-nums">{l.num}</span>
                    <span>{l.title}</span>
                    {progress[l.id] ? <Check className="mt-0.5 size-4 text-brand" aria-label="Completed" /> : <span />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <Separator />
      <div className="grid gap-1 px-2 text-xs text-muted-foreground">
        <a href="#progress" className="hover:text-foreground">Your progress code</a>
        <a href="#glossary" className="hover:text-foreground">Glossary of terms</a>
        <a href="#welcome" className="hover:text-foreground">About the course</a>
        <p className="mt-2">Progress saves in this browser.{version && <> Version {version}.</>}</p>
      </div>
    </div>
  );
}

function LessonDrawer({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open lesson list"><Menu className="size-5" /></Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader className="px-4 pt-4"><SheetTitle>Lessons</SheetTitle></SheetHeader>
        <ScrollArea className="h-[calc(100dvh-64px)] px-4 pb-6"><LessonRail active={active} onPick={() => setOpen(false)} /></ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/* Search everything: lessons, sections, terms, use cases, exercises and practice drafts. */
export function SearchDialog({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (h: Hit) => void }) {
  const [q, setQ] = useState("");
  const all = useMemo(() => searchIndex(), []);
  const hits = useMemo(() => {
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return all.filter((h) => h.g === "Lessons").slice(0, 8);
    return all.filter((h) => { const hay = (h.title + " " + h.text + " " + h.kind).toLowerCase(); return words.every((w) => hay.includes(w)); }).slice(0, 40);
  }, [q, all]);
  const groups = useMemo(() => { const g: Record<string, Hit[]> = {}; hits.forEach((h) => (g[h.g] = g[h.g] || []).push(h)); return g; }, [hits]);
  useEffect(() => { if (!open) setQ(""); }, [open]);
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search the course" description="Lessons, sections, terms, use cases and exercises" shouldFilter={false}>
      <CommandInput placeholder="Search lessons, terms, use cases…" value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>Nothing matches. Try a shorter word.</CommandEmpty>
        {Object.keys(groups).map((g) => (
          <CommandGroup key={g} heading={g}>
            {groups[g].map((h, i) => (
              <CommandItem key={g + i + h.title} value={g + i + h.title} onSelect={() => onPick(h)} className="flex-col items-start gap-0.5">
                <span className="font-medium">{h.title}</span>
                <span className="text-xs text-muted-foreground">{h.kind}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

const KEYS = [["/", "Search the course"], ["j", "Next lesson on your path"], ["k", "Previous lesson on your path"], ["?", "Show these shortcuts"], ["Esc", "Close a dialog"]];
export function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Keyboard className="size-4" />Keyboard shortcuts</DialogTitle><DialogDescription>The lesson shortcuts follow your path.</DialogDescription></DialogHeader>
        <dl className="grid gap-2 text-sm">
          {KEYS.map((k) => (<div key={k[0]} className="flex items-center justify-between gap-4"><dt><kbd className="rounded border bg-muted px-2 py-0.5 text-xs">{k[0]}</kbd></dt><dd className="text-muted-foreground">{k[1]}</dd></div>))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

export function Page({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <main id="view" tabIndex={-1} className={cn("mx-auto w-full px-4 pb-28 pt-8 outline-none md:px-6 md:pb-16", wide ? "max-w-[1440px]" : "max-w-5xl", className)}>{children}</main>;
}
export function lessonTitle(id: string) { return byId[id]?.title || ""; }
export function roleNameOf(id: string) { return roleInfo(id)?.name || ""; }
