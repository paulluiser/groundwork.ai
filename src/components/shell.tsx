import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, Dumbbell, Keyboard, Lightbulb, Menu, Moon, PieChart, Search, Sun, CaseSensitive, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

/* Path menu: initials of your main role; opens your path, roles, progress code and theme. */
function PathMenu() {
  const { roles } = useStore();
  const [theme, toggle] = useTheme();
  const main = roleInfo(roles[0])?.name || "General";
  const ini = main.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !/^(and|of|the)$/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={"Your path: " + pathLong(roles) + ". Open menu"} className="flex items-center gap-1 rounded-full p-0.5 pr-1.5 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <span className="grid size-7 place-items-center rounded-full bg-brand-tint text-2xs font-semibold text-brand">{ini}</span><ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal"><span className="block text-xs text-muted-foreground">Your path</span><span className="block text-sm font-medium">{pathLong(roles)}</span></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><a href="#role">Change roles</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href="#progress">Your progress code</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href="#glossary">Glossary of terms</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href="#welcome">About the course</a></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggle(); }}>{theme === "dark" ? <Sun /> : <Moon />}{theme === "dark" ? "Light mode" : "Dark mode"}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <p className="px-2 py-1.5 text-xs text-muted-foreground">Progress saves in this browser.{version && <><br />Version {version}.</>}</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchField({ onSearch, className }: { onSearch: () => void; className?: string }) {
  return (
    <button type="button" onClick={onSearch} aria-label="Search the course" className={cn("flex h-8 items-center gap-2 rounded-md border bg-card px-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground", className)}>
      <Search className="size-4" /><span className="hidden lg:inline">Search</span><kbd className="ml-auto hidden rounded border bg-muted px-1.5 text-2xs lg:inline">/</kbd>
    </button>
  );
}

/* Course header: logo left, the five sections as one centred switch, search field and path menu right.
   The landing page and role picker use the bare header instead. */
export function Header(props: { tab: string; bare: boolean; landing?: boolean; lessonId?: string; onSearch: () => void }) {
  if (props.bare) return <BareHeader {...props} />;
  const { tab, lessonId, onSearch } = props;
  const tabs = TABS.filter((t) => t.id !== "usecases" || hasUseCases);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className={cn("flex h-14 items-center justify-between gap-3 md:grid md:grid-cols-[1fr_auto_1fr]", FRAME)}>
        <div className="flex items-center gap-2">
          {lessonId && <LessonDrawer active={lessonId} />}
          <a href="#welcome" className="mr-2 flex shrink-0 items-center gap-2 rounded-md font-semibold" aria-label="Kern, about the course">
            <Mark /><span className="hidden text-lg sm:inline">Kern</span>
          </a>
        </div>
        <nav aria-label="Course sections" className="hidden rounded-lg bg-muted p-0.5 md:flex">
          {tabs.map((t) => (
            <a key={t.id} href={"#" + t.id} aria-current={tab === t.id ? "page" : undefined}
              className={cn("rounded-md px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground", tab === t.id && "bg-card text-foreground shadow-xs ring-1 ring-border")}>{t.label}</a>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2"><SearchField onSearch={onSearch} className="lg:w-52" /><PathMenu /></div>
      </div>
    </header>
  );
}

function BareHeader({ tab, bare, landing, lessonId, onSearch }: { tab: string; bare: boolean; landing?: boolean; lessonId?: string; onSearch: () => void }) {
  const { roles } = useStore();
  const [theme, toggle] = useTheme();
  const tabs = TABS.filter((t) => t.id !== "usecases" || hasUseCases);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className={cn("flex h-14 items-center gap-2", FRAME)}>
        {lessonId && <LessonDrawer active={lessonId} />}
        <a href="#welcome" className="mr-2 flex items-center gap-2 rounded-md font-semibold" aria-label="Kern, about the course">
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
                <span className="text-muted-foreground sm:hidden lg:inline">Path</span>
                <span className="hidden truncate sm:inline">{pathName(roles)}</span><ChevronDown className="size-3.5" />
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
          {!landing && <Button variant="ghost" size="icon" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>}
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
        <a key={t.id} href={"#" + t.id} aria-current={tab === t.id ? "page" : undefined} className={cn("flex flex-col items-center gap-1 py-2 text-2xs text-muted-foreground", tab === t.id && "text-brand")}>
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

/* One frame for every screen: the same width, side margins and top/bottom spacing as the header. */
export const FRAME = "mx-auto w-full max-w-[1440px] px-4 md:px-8";

export function Page({ children, className }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <main id="view" tabIndex={-1} className={cn(FRAME, "pb-28 pt-6 outline-none md:pb-16 md:pt-8", className)}>{children}</main>;
}

/* Page title block: optional back link, eyebrow, title, one line of description, actions on the right. */
export function PageHeader({ back, eyebrow, title, description, actions, children }: { back?: [string, string]; eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8 grid gap-4">
      {back && <Button asChild variant="ghost" size="sm" className="-ml-2 -mb-2 justify-self-start text-muted-foreground"><a href={back[0]}><ArrowLeft />{back[1]}</a></Button>}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-3xl">
          {eyebrow && <p className="mb-1 text-caption text-muted-foreground">{eyebrow}</p>}
          <h1 className="text-h1 font-semibold">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}

/* Section heading with a hairline under it: title on the left, quiet meta on the right. */
export function SectionHead({ title, meta, id, className }: { title: ReactNode; meta?: ReactNode; id?: string; className?: string }) {
  return (
    <div className={cn("mb-3 flex items-baseline justify-between gap-3 border-b pb-2", className)}>
      <h2 id={id} className="text-lg font-semibold">{title}</h2>
      {meta && <div className="min-w-0 text-right text-xs text-muted-foreground tabular-nums">{meta}</div>}
    </div>
  );
}

/* A section that opens and closes from its heading. */
export function Disclosure({ title, meta, defaultOpen, children, sub }: { title: ReactNode; meta?: ReactNode; defaultOpen?: boolean; children: ReactNode; sub?: ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <section>
        <CollapsibleTrigger className="group mb-3 flex w-full items-center justify-between gap-3 rounded-md border-b pb-2 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <span className="min-w-0"><span className="block text-lg font-semibold">{title}</span>{sub && !open && <span className="block text-caption text-muted-foreground">{sub}</span>}</span>
          <span className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground tabular-nums">{meta}<ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" /></span>
        </CollapsibleTrigger>
        <CollapsibleContent className={cn(!open && "mb-1")}>{children}</CollapsibleContent>
      </section>
    </Collapsible>
  );
}

/* The one place each page wants the eye to land first: a dark panel with the next action. Counts go in the eyebrow. */
export function Spotlight({ eyebrow, title, children, action, className, href, tone = "spot" }: { eyebrow?: ReactNode; title: ReactNode; children?: ReactNode; action?: ReactNode; className?: string; href?: string; tone?: "spot" | "ex" }) {
  const Box = (href ? "a" : "section") as "a";
  return (
    <Box href={href} className={cn("group flex flex-col justify-between gap-5 rounded-xl border p-6", tone === "ex" ? "border-ex-band bg-ex-band text-ex-on" : "border-spot-line bg-spot text-spot-fg", href && "transition-[filter] hover:brightness-110", className)}>
      <div className="min-w-0">
        {eyebrow && <p className={cn("flex items-center gap-2 text-caption", tone === "ex" ? "text-ex-on-2" : "text-spot-fg/70")}><span className={cn("size-1.5 shrink-0 rounded-full", tone === "ex" ? "bg-ex-hue" : "bg-brand")} />{eyebrow}</p>}
        <h2 className="mt-3 max-w-3xl text-h2 font-semibold">{title}</h2>
        {children && <div className={cn("mt-2 max-w-2xl text-sm", tone === "ex" ? "text-ex-on-2" : "text-spot-fg/75")}>{children}</div>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-3">{action}</div>}
    </Box>
  );
}
/* Light button for the dark spotlight. */
export const onDark = "bg-spot-fg text-spot hover:bg-spot-fg/90";

/* Shortcut row: icon, value, one note, chevron. Tiles sit together in one TileRow, split by hairlines, not boxed one by one. */
export function Tile({ href, icon: I, value, note }: { href: string; icon: typeof Search; label?: string; value: ReactNode; note: ReactNode }) {
  return (
    <a href={href} className="group flex min-h-16 min-w-0 items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/60">
      <I className="size-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1"><b className="block truncate text-sm font-medium">{value}</b><span className="block truncate text-xs text-muted-foreground">{note}</span></span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
export function TileRow({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <nav aria-label="Related" className={cn("grid overflow-hidden rounded-xl border bg-card max-sm:divide-y sm:divide-x", cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>{children}</nav>;
}

/* "Show N more" for long lists. */
export function ShowMore({ hidden, open, onToggle, noun }: { hidden: number; open: boolean; onToggle: () => void; noun: string }) {
  if (hidden <= 0) return null;
  return (
    <Button variant="outline" size="sm" onClick={onToggle} aria-expanded={open} className="mt-3 w-full text-muted-foreground sm:w-auto">
      <ChevronDown className={cn("transition-transform", open && "rotate-180")} />{open ? "Show fewer" : `Show ${hidden} more ${noun}`}
    </Button>
  );
}

export function lessonTitle(id: string) { return byId[id]?.title || ""; }
export function roleNameOf(id: string) { return roleInfo(id)?.name || ""; }
