import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cleanRoles, decodeProgress, encodeProgress, load, save, type Progress } from "@/lib/kern";

/* App state: roles and completed lessons, saved under the same localStorage keys as the original site. */
type Store = {
  roles: string[];
  progress: Progress;
  setRoles: (r: string[]) => void;
  toggleDone: (id: string) => void;
  restore: (code: string) => string | null;
  clearAll: () => void;
  code: string;
  notice: string;
  setNotice: (s: string) => void;
};
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [roles, setRolesState] = useState<string[]>(() => cleanRoles(load("gw-roles", null) || load("gw-role", null)));
  const [progress, setProgress] = useState<Progress>(() => load("gw-progress", {}));
  const [notice, setNotice] = useState("");
  useEffect(() => { save("gw-session", null); }, []);   // retired: the course no longer has accounts
  const persist = (r: string[], p: Progress) => { save("gw-roles", r); save("gw-role", null); save("gw-progress", p); };

  const setRoles = useCallback((r: string[]) => { const c = cleanRoles(r); setRolesState(c); persist(c, load("gw-progress", {})); }, []);
  const toggleDone = useCallback((id: string) => {
    setProgress((p) => { const n = { ...p }; if (n[id]) delete n[id]; else n[id] = true; persist(load("gw-roles", []), n); return n; });
  }, []);
  // Restoring switches to the code's roles and keeps every lesson completed in either place.
  const restore = useCallback((code: string) => {
    const d = decodeProgress(code);
    if (d.error !== undefined) return d.error;
    const r = d.roles.length ? d.roles : cleanRoles(load("gw-roles", []));
    const p = { ...load<Progress>("gw-progress", {}), ...d.progress };
    setRolesState(r); setProgress(p); persist(r, p);
    return null;
  }, []);
  const clearAll = useCallback(() => { setRolesState([]); setProgress({}); save("gw-roles", null); save("gw-progress", null); }, []);
  const code = useMemo(() => encodeProgress(roles, progress), [roles, progress]);

  return <Ctx.Provider value={{ roles, progress, setRoles, toggleDone, restore, clearAll, code, notice, setNotice }}>{children}</Ctx.Provider>;
}
export function useStore() { const s = useContext(Ctx); if (!s) throw new Error("StoreProvider missing"); return s; }

/* Hash routing, the same links as before: #home, #lesson-id, #lesson-id/section, #resume=CODE, #team=…, #usecase/slug … */
export function useHash() {
  const [hash, setHash] = useState(() => location.hash.replace(/^#/, ""));
  useEffect(() => {
    const on = () => setHash(location.hash.replace(/^#/, ""));
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return hash;
}
export function go(h: string, replace = false) { if (replace) location.replace("#" + h); else location.hash = h; }

/* Theme: light by default; dark only after someone picks it (gw-theme). */
export function useTheme() {
  // gw-theme is stored as a plain string (not JSON), as before
  const [theme, setTheme] = useState<"light" | "dark">(() => { try { return localStorage.getItem("gw-theme") === "dark" ? "dark" : "light"; } catch { return "light"; } });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("gw-theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))] as const;
}
