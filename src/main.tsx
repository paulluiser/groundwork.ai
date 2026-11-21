import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// No StrictMode: the lesson's original interactive pieces enhance the DOM once, and a double mount would run them twice.
createRoot(document.getElementById("root")!).render(<App />);

/* First-load reveal: hold the mark until it has drawn (about a second) and fonts are in, then fade it out. */
const boot = document.getElementById("boot");
if (boot) {
  const on = document.documentElement.classList.contains("boot-on");
  if (!on) boot.remove();
  else {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches, min = reduced ? 250 : 1150;
    const waitT = setTimeout(() => boot.classList.add("wait"), 1300);
    Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(() => {
      setTimeout(() => {
        clearTimeout(waitT); boot.classList.add("out");
        setTimeout(() => { boot.remove(); document.documentElement.classList.remove("boot-on"); }, 450);
      }, Math.max(0, min - performance.now()));
    });
  }
}

/* Offline support: the same service worker path as before (sw.js), with a new cache name. */
if ("serviceWorker" in navigator && import.meta.env.PROD) addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
