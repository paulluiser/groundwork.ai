import { useEffect, useRef, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header, MobileTabs, SearchDialog, ShortcutsDialog } from "@/components/shell";
import { byId, GW, hasUseCases, load, pathLong, routeFor, type Hit } from "@/lib/kern";
import { go, StoreProvider, useHash, useStore } from "@/lib/store";
import Landing from "@/pages/landing";
import RolePicker from "@/pages/role-picker";
import Home from "@/pages/home";
import LessonPage from "@/pages/lesson";
import Exercises from "@/pages/exercises";
import { UseCases, UseCaseGuide } from "@/pages/use-cases";
import Glossary from "@/pages/glossary";
import ProgressPage from "@/pages/progress";
import { PracticeCase, PracticeList } from "@/pages/practice";
import Review from "@/pages/review";
import Team from "@/pages/team";
import Certificate from "@/pages/certificate";

const OPEN = ["welcome", "role", "progress", "team"];   // pages that work before any roles are chosen

function Router() {
  const hash = useHash();
  const { roles, restore, setNotice } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const resumeTo = useRef<string | null>(null);

  // parse: #name, #name/arg, #name=arg
  const head = hash.split(/[/=]/)[0];
  const arg = decodeURIComponent(hash.slice(head.length + 1));
  const isLesson = !!(byId[head] && GW.content[head]);

  // redirects, as on the original site
  let redirect: string | null = null;
  if (hash.startsWith("resume=")) redirect = "resume";
  else if (!roles.length && !OPEN.includes(head)) redirect = isLesson || ["exercises", "usecases", "glossary", "usecase", "practice", "review", "certificate"].includes(head) ? "role" : "welcome";
  else if (hash === "") redirect = "welcome";

  useEffect(() => {
    if (redirect === "resume") {
      const err = restore(arg);
      if (err) { go("progress=" + encodeURIComponent(arg), true); return; }
      const r = load<string[]>("gw-roles", []);
      const p = load<Record<string, boolean>>("gw-progress", {});
      const path = routeFor(r);
      setNotice("Progress restored from your link: " + pathLong(r) + ", " + path.filter((id) => p[id]).length + " of " + path.length + " lessons done.");
      go("home", true);
    } else if (redirect === "role") { if (hash !== "home") resumeTo.current = hash; go("role", true); }
    else if (redirect) go(redirect, true);
  }, [redirect, hash]); // eslint-disable-line react-hooks/exhaustive-deps

  // after choosing roles or restoring a code, continue where the learner was headed
  useEffect(() => { if (roles.length && resumeTo.current && head === "home") { const t = resumeTo.current; resumeTo.current = null; go(t, true); } }, [roles.length, head]);

  // keyboard: / search, ? shortcuts, j and k next and previous lesson on the path
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) { if (e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen((o) => !o); } return; }
      if (e.altKey) return;
      const t = document.activeElement as HTMLElement | null;
      if (t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable)) return;
      if (document.querySelector("[role=dialog]")) return;
      if (e.key === "/") { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === "?") { e.preventDefault(); setKeysOpen(true); }
      else if ((e.key === "j" || e.key === "k") && isLesson) {
        const path = routeFor(roles), seq = path.includes(head) ? path : Object.keys(byId), i = seq.indexOf(head), to = seq[i + (e.key === "j" ? 1 : -1)];
        if (to) { e.preventDefault(); go(to); }
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [head, isLesson, roles]);

  // page title
  useEffect(() => {
    const T: Record<string, string> = { welcome: "Kern · AI for software teams", role: "Choose your roles", home: "Lessons", exercises: "Exercises", usecases: "Use cases", glossary: "Glossary", progress: roles.length ? "Progress" : "Continue with a code", practice: "You decide", review: "Review terms", team: "Team plan", certificate: "Certificate" };
    const uc = head === "usecase" && (GW.useCases || []).find((u: { t: string }) => u.t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) === arg);
    const pr = head === "practice" && arg && GW.practice?.[parseInt(arg, 10) - 1];
    const t = isLesson ? byId[head].title : uc ? uc.t : pr ? pr.t : T[head] || "Lessons";
    document.title = head === "welcome" ? t : t + " · Kern";
  }, [head, arg, isLesson, roles.length]);

  // scroll position
  useEffect(() => {
    if (!hash.includes("/")) window.scrollTo(0, 0);
    // Move focus to the new page, so the link that was clicked doesn't keep its focus ring and screen readers start at the content.
    const a = document.activeElement as HTMLElement | null;
    if (a && a !== document.body && a.closest("header, nav")) requestAnimationFrame(() => (document.getElementById("view") as HTMLElement | null)?.focus({ preventScroll: true }));
  }, [head, arg]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (h: Hit) => {
    setSearchOpen(false);
    if (h.term) go("glossary/" + h.term);
    else if (h.sec) go(h.go + "/" + h.sec);
    else if (h.scroll) go(h.go + "/" + h.scroll);
    else go(h.go);
  };

  if (redirect) return null;
  const bare = (head === "welcome" && !roles.length) || head === "role" || (!roles.length && (head === "progress" || head === "team"));
  const tab = isLesson ? "home" : ({ usecase: "usecases", practice: "exercises", review: "exercises", team: "progress", certificate: "progress" } as Record<string, string>)[head] || head;

  let page;
  if (head === "welcome") page = <Landing />;
  else if (head === "role") page = <RolePicker />;
  else if (isLesson) page = <LessonPage id={head} target={arg} />;
  else if (head === "exercises") page = <Exercises />;
  else if (head === "usecases" && hasUseCases) page = <UseCases />;
  else if (head === "usecase") page = <UseCaseGuide slug={arg} />;
  else if (head === "glossary") page = <Glossary term={arg} />;
  else if (head === "progress") page = <ProgressPage prefill={arg} />;
  else if (head === "practice") page = arg ? <PracticeCase n={parseInt(arg, 10)} /> : <PracticeList />;
  else if (head === "review") page = <Review />;
  else if (head === "team") page = <Team link={hash.startsWith("team=") ? arg : ""} />;
  else if (head === "certificate") page = <Certificate k={arg} />;
  else page = <Home onSearch={() => setSearchOpen(true)} />;

  return (
    <>
      <a href="#view" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2">Skip to content</a>
      <Header tab={tab} bare={bare} lessonId={isLesson ? head : undefined} onSearch={() => setSearchOpen(true)} />
      {page}
      {!bare && roles.length > 0 && <MobileTabs tab={tab} />}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onPick={pick} />
      <ShortcutsDialog open={keysOpen} onOpenChange={setKeysOpen} />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <TooltipProvider delayDuration={300}><Router /></TooltipProvider>
    </StoreProvider>
  );
}
