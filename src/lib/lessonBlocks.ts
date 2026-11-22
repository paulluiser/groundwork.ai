import { GW, load, save } from "@/lib/kern";

/* Open task: the learner writes an answer, then compares it with a model answer and checks it against a rubric.
   Markup in lesson content:
   <div data-w="task" data-key="unique-key">
     <div class="task-model">…model answer…</div>
     <ul class="task-rubric"><li>…</li></ul>
   </div>
   The prompt sits in the surrounding .activity body. Answers are kept in this browser (gw-tasks). */
type Saved = Record<string, { t: string; c?: number[] }>;

function task(el: HTMLElement) {
  const key = el.getAttribute("data-key") || "task";
  const model = el.querySelector<HTMLElement>(".task-model");
  const rubric = el.querySelector<HTMLElement>(".task-rubric");
  const all = load<Saved>("gw-tasks", {}), mine = all[key] || { t: "" };
  const minLen = parseInt(el.getAttribute("data-min") || "40", 10);

  const wrap = document.createElement("div");
  wrap.className = "task-ui";
  const id = "task-" + key;
  wrap.innerHTML =
    '<label class="task-l" for="' + id + '">Your answer</label>' +
    '<textarea class="task-in" id="' + id + '" rows="6" placeholder="Write your answer here. It stays in this browser."></textarea>' +
    '<div class="task-row"><button type="button" class="task-btn" disabled>Compare with a model answer</button><span class="task-hint" aria-live="polite"></span></div>';
  el.insertBefore(wrap, el.firstChild);
  const ta = wrap.querySelector("textarea")!, btn = wrap.querySelector<HTMLButtonElement>(".task-btn")!, hint = wrap.querySelector<HTMLElement>(".task-hint")!;
  ta.value = mine.t || "";

  const reveal = document.createElement("div");
  reveal.className = "task-reveal"; reveal.hidden = true;
  if (model) { model.insertAdjacentHTML("afterbegin", '<p class="task-sub">A model answer</p>'); reveal.appendChild(model); }
  if (rubric) {
    const box = document.createElement("div"); box.className = "task-check";
    box.innerHTML = '<p class="task-sub">Check your answer</p>';
    Array.from(rubric.querySelectorAll("li")).forEach((li, i) => {
      const lab = document.createElement("label");
      lab.innerHTML = '<input type="checkbox"> <span>' + li.innerHTML + "</span>";
      const cb = lab.querySelector("input")!;
      cb.checked = !!(mine.c && mine.c.includes(i));
      cb.addEventListener("change", () => { const s = load<Saved>("gw-tasks", {}), cur = s[key] || { t: ta.value }; const set = new Set(cur.c || []); if (cb.checked) set.add(i); else set.delete(i); cur.c = [...set]; s[key] = cur; save("gw-tasks", s); score(); });
      box.appendChild(lab);
    });
    const out = document.createElement("p"); out.className = "task-score"; box.appendChild(out);
    const score = () => { const n = box.querySelectorAll("input:checked").length, t = box.querySelectorAll("input").length; out.textContent = n + " of " + t + " met." + (n === t ? " Well done." : n >= t - 1 ? " Close. Revise the one you missed." : " Revise your answer with the ones you missed in mind."); };
    score();
    rubric.remove();
    reveal.appendChild(box);
  }
  el.appendChild(reveal);

  const sync = () => {
    const n = ta.value.trim().length;
    btn.disabled = n < minLen && reveal.hidden;
    hint.textContent = reveal.hidden ? (n < minLen ? "Write at least a couple of sentences first." : "") : "";
  };
  ta.addEventListener("input", () => { const s = load<Saved>("gw-tasks", {}); s[key] = { ...(s[key] || {}), t: ta.value }; save("gw-tasks", s); sync(); });
  btn.addEventListener("click", () => { reveal.hidden = !reveal.hidden; btn.textContent = reveal.hidden ? "Compare with a model answer" : "Hide the model answer"; sync(); if (!reveal.hidden) reveal.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
  if (mine.t && mine.t.trim().length >= minLen && mine.c) { reveal.hidden = false; btn.textContent = "Hide the model answer"; }
  sync();
}

export function registerLessonBlocks() {
  GW.widgets = GW.widgets || {};
  GW.widgets.task = task;
}

