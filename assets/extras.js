/* Loona extras: lesson helpers (copy buttons, section links, pick up where you left off, glossary on hover),
   keyboard shortcuts, the "You decide" practice, term review, team plans, certificates and the QR code.
   Loads after app.js and uses GW.app. Everything stays in this browser. */
(function () {
  "use strict";
  var A = function () { return GW.app; };
  var load = GW.store.load, save = GW.store.save;
  var esc = function (s) { return A().esc(s); };
  var reduced = function () { return matchMedia("(prefers-reduced-motion: reduce)").matches; };
  var ICON_LINK = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';
  var CHEVRON = '<svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="M2 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function flashText(el, text, ms) {
    var old = el.getAttribute("data-label") || el.textContent; el.setAttribute("data-label", old);
    el.textContent = text; clearTimeout(el._t); el._t = setTimeout(function () { el.textContent = old; }, ms || 1600);
  }
  function today() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); }
  var LONGDATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

  /* ================= lessons ================= */
  var readId = null;
  function reading(id, k, secId) {
    if (readId !== id) return;   // ignore the first paint, before the lesson is mounted
    var r = load("gw-read", {}), cur = r[id];
    if (!cur || k > cur.k) { r[id] = { k: k, sec: secId }; save("gw-read", r); }
  }
  function lessonMount(view, id, heads, fromLink) {
    var a = A(), $ = a.$, $$ = a.$$;
    // copy buttons on code and on prompts
    $$("pre.code, .draft.prompt", view).forEach(function (box) {
      var b = document.createElement("button"); b.type = "button"; b.className = "copy-btn"; b.textContent = "Copy";
      b.setAttribute("aria-label", "Copy " + (box.matches("pre") ? "code" : "prompt"));
      b.addEventListener("click", function () {
        var src = box.matches("pre") ? box : $(".draft-b", box);
        a.copyText(src.innerText.trim(), function (ok) { flashText(b, ok ? "Copied" : "Couldn't copy"); });
      });
      if (box.matches("pre")) { var wrap = document.createElement("div"); wrap.className = "code-wrap"; box.parentNode.insertBefore(wrap, box); wrap.appendChild(box); wrap.appendChild(b); }
      else ($(".draft-h", box) || box).appendChild(b);
    });
    // a link to each section
    heads.forEach(function (hd) {
      var b = document.createElement("button"); b.type = "button"; b.className = "h-link";
      b.setAttribute("aria-label", "Copy a link to “" + hd.textContent + "”"); b.title = "Copy a link to this section"; b.innerHTML = ICON_LINK;
      b.addEventListener("click", function () {
        var url = location.origin + location.pathname + "#" + id + "/" + hd.id;
        try { history.replaceState(null, "", "#" + id + "/" + hd.id); } catch (e) { /* sandboxed */ }
        a.copyText(url, function (ok) { b.classList.add("copied"); b.setAttribute("data-tip", ok ? "Link copied" : "Couldn't copy"); setTimeout(function () { b.classList.remove("copied"); }, 1600); });
      });
      hd.appendChild(b);
    });
    // pick up where you left off
    var r = load("gw-read", {}), saved = r[id];
    if (a.progress()[id]) { if (saved) { delete r[id]; save("gw-read", r); } }
    else if (saved && saved.k > 0 && !fromLink) {
      var target = document.getElementById(saved.sec) || heads[saved.k];
      if (target) {
        var p = document.createElement("p"); p.className = "resume-at";
        p.innerHTML = '<button type="button" class="btn small ghost">Continue from “' + esc(target.textContent) + '”</button><span>Where you stopped last time</span>';
        $("button", p).addEventListener("click", function () { target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }); p.remove(); });
        var meta = $(".lesson-head .meta", view); meta.parentNode.insertBefore(p, meta.nextSibling);
      }
    }
    readId = id;
  }

  /* glossary terms open on hover, for mouse users; click and keyboard still work as before */
  var hoverT = null, leaveT = null, fine = matchMedia("(hover: hover) and (pointer: fine)");
  document.addEventListener("mouseover", function (e) {
    if (!fine.matches) return;
    var t = e.target.closest && e.target.closest(".term");
    if (t) { clearTimeout(leaveT); clearTimeout(hoverT); hoverT = setTimeout(function () { A().openPop(t); }, 350); return; }
    if (e.target.closest && e.target.closest(".popover")) clearTimeout(leaveT);
  });
  document.addEventListener("mouseout", function (e) {
    if (!fine.matches) return;
    if (e.target.closest && (e.target.closest(".term") || e.target.closest(".popover"))) {
      clearTimeout(hoverT);
      var to = e.relatedTarget;
      if (to && to.closest && (to.closest(".popover") || to.closest(".term"))) return;
      leaveT = setTimeout(function () { A().closePop(); }, 300);
    }
  });

  /* ================= keyboard shortcuts ================= */
  var KEYS = [["/", "Search the course"], ["j", "Next lesson"], ["k", "Previous lesson"], ["?", "Show these shortcuts"], ["Esc", "Close a dialog"]];
  function closeHelp() { var h = document.getElementById("kb-help"); if (h) { h.remove(); return true; } return false; }
  function openHelp() {
    if (closeHelp()) return;
    var o = document.createElement("div"); o.className = "search"; o.id = "kb-help";
    o.innerHTML = '<div class="search-box kb-box" role="dialog" aria-modal="true" aria-labelledby="kb-h"><h2 id="kb-h">Keyboard shortcuts</h2><dl>' +
      KEYS.map(function (k) { return "<div><dt><kbd>" + esc(k[0]) + "</kbd></dt><dd>" + esc(k[1]) + "</dd></div>"; }).join("") +
      '</dl><p class="fine">The lesson shortcuts follow your path, the same as the Next and Previous links.</p><button type="button" class="btn small ghost" data-kb-close>Close</button></div>';
    document.body.appendChild(o);
    o.addEventListener("click", function (e) { if (e.target === o || e.target.closest("[data-kb-close]")) closeHelp(); });
    o.querySelector("[data-kb-close]").focus();
  }
  document.addEventListener("click", function (e) { if (e.target.closest("[data-kb-help]")) openHelp(); });
  function key(e) {
    if (e.key === "Escape") { closeHelp(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = document.activeElement;
    if (t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable)) return;
    if (document.getElementById("search")) return;
    if (e.key === "?") { e.preventDefault(); openHelp(); return; }
    if (reviewKey(e)) return;
    if (e.key === "j" || e.key === "k") {
      var link = document.querySelector(e.key === "j" ? ".lesson-foot .pn .next" : ".lesson-foot .pn .prev");
      if (link) { e.preventDefault(); location.hash = link.getAttribute("href").slice(1); }
    }
  }

  /* ================= exercises tab: more practice ================= */
  function practiceDone() { var s = load("gw-practice", {}); return (GW.practice || []).filter(function (p, i) { return s[i + 1]; }).length; }
  function exercisesHtml() {
    var n = (GW.practice || []).length, done = practiceDone(), rv = reviewQueue();
    return '<section class="more-practice" aria-label="More practice">' +
      '<a class="mp-card" href="#practice"><span class="mp-k">You decide</span><b>Review ' + n + ' AI drafts</b><span class="mp-s">Make the call on a draft, say what you would check, then compare with a reviewer.</span><span class="mp-m">' + A().moon(done / n, 16) + (done ? done + " of " + n + " reviewed" : "Not started") + CHEVRON + "</span></a>" +
      '<a class="mp-card" href="#review"><span class="mp-k">Review</span><b>Key terms, a few a day</b><span class="mp-s">Short card reviews of the terms from lessons you have finished, spaced out so they stick.</span><span class="mp-m">' + (rv.pool.length ? (rv.queue.length ? A().plural(rv.queue.length, "card") + " ready" : "Nothing due today") : "Finish a lesson to start") + CHEVRON + "</span></a></section>";
  }

  /* ================= "You decide" practice ================= */
  var CALLS = { ship: ["Ship it", "ok", 0], edit: ["Ship after edits", "warn", 1], reject: ["Don't ship", "bad", 2] };
  function orderedPractice() {
    var mine = A().roles(), list = (GW.practice || []).map(function (p, i) { return { p: p, n: i + 1 }; });
    return list.filter(function (x) { return mine.indexOf(x.p.r) > -1; }).concat(list.filter(function (x) { return mine.indexOf(x.p.r) < 0; }));
  }
  function renderPracticeList() {
    var a = A(), s = load("gw-practice", {}), list = orderedPractice(), mine = a.roles();
    var done = list.filter(function (x) { return s[x.n]; }), same = done.filter(function (x) { return s[x.n].v === x.p.v; }).length;
    var next = list.filter(function (x) { return !s[x.n]; })[0];
    var h = '<div class="tabpage practice"><p class="pick-top"><a class="back" href="#exercises">Exercises</a></p><header class="tp-head"><h1>You decide</h1><p class="lede">Each draft below came from an assistant. Decide whether it can ship, write down what you would check, then compare your call with a reviewer’s.</p>';
    h += '<div class="pr-sum">' + a.moon(done.length / list.length, 22) + "<p><b>" + done.length + " of " + list.length + " reviewed</b>" + (done.length ? "<span>Same call as the reviewer on " + same + "</span>" : "<span>About 3 minutes each</span>") + "</p>" + (next ? '<a class="btn pill dark" href="#practice/' + next.n + '">' + (done.length ? "Next draft" : "Start with the first draft") + "</a>" : "") + "</div></header>";
    var groups = [["Your roles", list.filter(function (x) { return mine.indexOf(x.p.r) > -1; })], [mine.length && mine[0] !== "general" ? "Other roles" : "All roles", list.filter(function (x) { return mine.indexOf(x.p.r) < 0; })]];
    groups.forEach(function (g) {
      if (!g[1].length) return;
      h += '<section class="ex-group"><h2 class="ex-l">' + g[0] + '</h2><ul class="ex-list">';
      g[1].forEach(function (x) {
        var r = s[x.n], st = !r ? "Not tried" : r.v === x.p.v ? "Same call" : "Different call";
        h += '<li><a class="ex-row" href="#practice/' + x.n + '"><b>' + esc(x.p.t) + '</b><span class="ex-end"><span class="ex-kind">' + esc(a.roleInfo(x.p.r).name) + " · " + st + "</span>" + CHEVRON + "</span></a></li>";
      });
      h += "</ul></section>";
    });
    h += "</div>";
    a.$("#view").innerHTML = h;
  }
  function renderPracticeCase(n) {
    var a = A(), p = GW.practice[n - 1];
    if (!p) { location.replace("#practice"); return false; }
    var s = load("gw-practice", {}), mine = s[n], list = orderedPractice(), pos = list.map(function (x) { return x.n; }).indexOf(n);
    var nextX = list[pos + 1], l = a.byId[p.l];
    var h = '<article class="tabpage practice pr-case"><p class="pick-top"><a class="back" href="#practice">All drafts</a></p>';
    h += '<p class="kicker">Draft ' + (pos + 1) + " of " + list.length + " · " + esc(a.roleInfo(p.r).name) + "</p><h1>" + esc(p.t) + '</h1><p class="lede">' + esc(p.ctx) + "</p>";
    h += '<div class="draft pr-draft"><div class="draft-h"><span><b>AI draft</b></span></div><div class="draft-b">' + p.draft + "</div></div>";
    h += '<section class="pr-call w" aria-labelledby="pr-h"><h2 id="pr-h">Your call</h2><div class="pr-opts" role="radiogroup" aria-labelledby="pr-h">' +
      Object.keys(CALLS).map(function (k) { return '<button type="button" role="radio" aria-checked="false" data-call="' + k + '">' + CALLS[k][0] + "</button>"; }).join("") + "</div>";
    h += '<label for="pr-note">What would you check or change?</label><textarea id="pr-note" aria-describedby="pr-hint" placeholder="For example: which claims you would verify, and how"></textarea>';
    h += '<p class="fine" id="pr-hint">Choose a call and write a sentence or two. The reviewer’s answer opens after that, so you commit to your own first.</p>';
    h += '<button type="button" class="btn pill dark" id="pr-go" disabled>Compare with the reviewer</button></section>';
    h += '<section class="pr-result" id="pr-result" hidden aria-live="polite"></section>';
    h += '<footer class="pr-foot">' + (l ? '<a class="uc-link" href="#' + l.id + '"><b>Lesson ' + l.num + "</b> " + esc(l.title) + "</a>" : "") + (nextX ? '<a class="btn pill soft" href="#practice/' + nextX.n + '">Next draft</a>' : '<a class="btn pill soft" href="#practice">All drafts</a>') + "</footer></article>";
    a.$("#view").innerHTML = h;
    var call = null, note = a.$("#pr-note"), go = a.$("#pr-go");
    function ready() { go.disabled = !(call && note.value.trim().length >= 12); }
    a.$$("[data-call]").forEach(function (b) {
      b.addEventListener("click", function () {
        call = b.getAttribute("data-call");
        a.$$("[data-call]").forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
        ready();
      });
    });
    note.addEventListener("input", ready);
    go.addEventListener("click", function () {
      var st = load("gw-practice", {}); st[n] = { v: call, note: note.value.trim() }; save("gw-practice", st);
      showResult(p, st[n], true);
    });
    if (mine) showResult(p, mine, false);
  }
  function showResult(p, mine, fresh) {
    var a = A(), box = a.$("#pr-result"), call = a.$(".pr-call");
    var rv = CALLS[p.v], me = CALLS[mine.v], d = me[2] - rv[2];
    var verdict = d === 0 ? "Same call as the reviewer." : d < 0 ? "You would have let it through more easily than the reviewer." : "You were stricter than the reviewer. That’s the safer side to be on, though it costs time.";
    var h = '<h2>The reviewer’s call</h2><div class="pr-verdict"><span class="stamp ' + rv[1] + '">' + rv[0] + "</span><p><b>" + verdict + "</b> Your call: " + me[0] + ".</p></div>";
    h += '<div class="pr-note"><span class="hx-k">What you wrote</span><p>' + esc(mine.note) + "</p></div>";
    h += '<div class="review pr-flags">' + p.flags.map(function (f) { return '<div class="r"><span class="stamp ' + (f[0] === "human" ? "bad" : f[0]) + '">' + esc(f[1]) + "</span><span>" + f[2] + "</span></div>"; }).join("") + "</div>";
    h += '<p class="pr-why">' + esc(p.why) + '</p><button type="button" class="linkish pr-again">Try this one again</button>';
    box.innerHTML = h; box.hidden = false; call.hidden = true;
    a.$(".pr-again", box).addEventListener("click", function () {
      var st = load("gw-practice", {}); delete st[GW.practice.indexOf(p) + 1]; save("gw-practice", st);
      a.route();
    });
    if (fresh) { box.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }); a.$("h2", box).setAttribute("tabindex", "-1"); a.$("h2", box).focus({ preventScroll: true }); }
  }

  /* ================= term review: Leitner boxes, a few cards a day ================= */
  var GAP = [0, 1, 2, 4, 8, 16];   // days until the next review, by box
  var revSession = null;
  function reviewPool(scope) {
    var done = A().progress();
    return Object.keys(GW.glossary).filter(function (k) { var l = GW.glossary[k][2]; return scope === "all" || (l && done[l]); });
  }
  function reviewQueue(scope) {
    scope = scope || load("gw-revscope", "done");
    var st = load("gw-review", {}), t = today(), pool = reviewPool(scope);
    var due = pool.filter(function (k) { return st[k] && st[k].d <= t; });
    var fresh = pool.filter(function (k) { return !st[k]; }).slice(0, 5);
    return { pool: pool, queue: due.slice(0, 15).concat(fresh).slice(0, 15), st: st };
  }
  function renderReview() {
    var a = A(), scope = load("gw-revscope", "done");
    if (!revSession) { var q = reviewQueue(scope); revSession = { queue: q.queue, i: 0, shown: false, knew: 0, total: q.queue.length, pool: q.pool.length }; }
    var s = revSession, h = '<div class="tabpage review-page"><p class="pick-top"><a class="back" href="#exercises">Exercises</a></p><header class="tp-head"><h1>Review terms</h1><p class="lede">A few cards a day. Say the meaning to yourself, then check it. Terms you know come back less often.</p>';
    h += '<div class="seg" role="group" aria-label="Which terms to review"><button type="button" data-revscope="done" aria-pressed="' + (scope === "done") + '">From lessons you’ve finished</button><button type="button" data-revscope="all" aria-pressed="' + (scope === "all") + '">All terms</button></div></header>';
    if (!s.pool) h += '<p class="gloss-empty">No terms yet. Terms join the review when you finish the lesson that explains them. Or <button type="button" class="linkish" data-revscope="all">review all terms</button>.</p>';
    else if (s.i >= s.queue.length) {
      var st = load("gw-review", {}), t = today(), nextDue = Object.keys(st).map(function (k) { return st[k].d; }).filter(function (d) { return d > t; }).sort(function (x, y) { return x - y; })[0];
      h += '<div class="rv-card rv-done">' + a.moon(1, 40) + "<h2>" + (s.total ? "Done for today" : "Nothing due today") + "</h2><p>" + (s.total ? "You knew " + s.knew + " of " + a.plural(s.total, "card") + ". " : "") + (nextDue ? "More cards are due " + (nextDue - t === 1 ? "tomorrow" : "in " + (nextDue - t) + " days") + "." : "") + '</p><a class="btn pill soft" href="#exercises">Back to exercises</a></div>';
    } else {
      var k = s.queue[s.i], g = GW.glossary[k], l = g[2] && a.byId[g[2]];
      h += '<div class="rv-card" aria-live="polite"><p class="rv-n">Card ' + (s.i + 1) + " of " + s.queue.length + "</p><h2>" + esc(g[0]) + "</h2>";
      if (!s.shown) h += '<button type="button" class="btn pill dark" data-rv="show">Show the meaning</button><p class="fine">Press Space to show it.</p>';
      else h += '<p class="rv-def">' + esc(g[1]) + "</p>" + (l ? '<a class="uc-link" href="#' + l.id + '"><b>Lesson ' + l.num + "</b> " + esc(l.title) + "</a>" : "") + '<div class="rv-acts"><button type="button" class="btn pill soft" data-rv="0">I didn’t know it</button><button type="button" class="btn pill dark" data-rv="1">I knew it</button></div><p class="fine">Or press 1 or 2.</p>';
      h += "</div>";
    }
    h += "</div>";
    a.$("#view").innerHTML = h;
    var focus = a.$(".rv-card [data-rv]"); if (focus) focus.focus({ preventScroll: true });
  }
  function answer(knew) {
    var s = revSession, k = s.queue[s.i], st = load("gw-review", {}), cur = st[k] || { b: 0 };
    var b = knew ? Math.min(5, cur.b + 1) : 1;
    st[k] = { b: b, d: today() + GAP[b] }; save("gw-review", st);
    if (knew) s.knew += 1;
    s.i += 1; s.shown = false; renderReview();
  }
  function reviewKey(e) {
    if (location.hash !== "#review" || !revSession || revSession.i >= revSession.queue.length) return false;
    if (!revSession.shown && (e.key === " " || e.key === "Enter")) { e.preventDefault(); revSession.shown = true; renderReview(); return true; }
    if (revSession.shown && (e.key === "1" || e.key === "2")) { e.preventDefault(); answer(e.key === "2"); return true; }
    return false;
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-rv]");
    if (b) { var v = b.getAttribute("data-rv"); if (v === "show") { revSession.shown = true; renderReview(); } else answer(v === "1"); return; }
    var sc = e.target.closest("[data-revscope]");
    if (sc) { save("gw-revscope", sc.getAttribute("data-revscope")); revSession = null; renderReview(); }
  });

  /* ================= team plans: a shared lesson list and a board built from progress codes ================= */
  function b64(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function unb64(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return decodeURIComponent(escape(atob(s))); }
  function teamLink(t) {
    var cl = A().codeLessons;
    return location.origin + location.pathname + "#team=" + b64(JSON.stringify({ n: t.n, l: t.l.map(function (id) { return cl.indexOf(id); }).filter(function (i) { return i > -1; }) }));
  }
  function readTeam(arg) {
    try {
      var d = JSON.parse(unb64(arg)), cl = A().codeLessons, byId = A().byId;
      var ids = (d.l || []).map(function (i) { return cl[i]; }).filter(function (id) { return id && byId[id]; });
      if (!ids.length || typeof d.n !== "string") return null;
      return { n: d.n.slice(0, 60), l: ids };
    } catch (e) { return null; }
  }
  function planGroups() {
    var a = A();
    return [{ k: "core", name: "Core lessons", ids: a.coreIds }].concat(GW.roles.map(function (r) { return { k: r.id, name: r.name + " track", ids: a.trackOf(r.id) }; })).concat([{ k: "capstone", name: "Capstone", ids: ["team-adoption"] }]);
  }
  function renderTeam(arg) {
    var a = A();
    if (arg) {
      var t = readTeam(arg);
      if (!t) { a.$("#view").innerHTML = '<div class="saver"><h1>Team plan</h1><p class="gloss-empty">That team link doesn’t work. It may have been cut short when it was copied. Ask for the link again.</p><a class="btn pill dark" href="#team">Make your own plan</a></div>'; return; }
      var cur = load("gw-team", null);
      save("gw-team", { n: t.n, l: t.l, m: cur && cur.n === t.n ? cur.m : [], me: cur ? cur.me : "" });
      location.replace("#team"); return false;
    }
    var team = load("gw-team", null);
    if (!team) renderTeamMaker(); else renderTeamBoard(team);
  }
  function renderTeamMaker() {
    var a = A(), groups = planGroups(), has = a.roles().length;
    var h = '<div class="saver team">' + (has ? '<p class="pick-top"><a class="back" href="#progress">Progress</a></p>' : "") + '<h1>Team plan</h1><p class="lede">Choose the lessons your team will take, then share the link. Everyone’s progress stays in their own browser. Teammates paste their progress codes into the board to compare.</p>';
    h += '<form class="w tm-form" id="tm-form" novalidate><label for="tm-name">Team name</label><input type="text" id="tm-name" maxlength="60" placeholder="e.g. Payments squad" required>';
    h += '<fieldset class="tm-groups"><legend>Lessons in the plan</legend>' + groups.map(function (g) {
      return '<label class="tm-g"><input type="checkbox" value="' + g.k + '"' + (g.k === "core" || g.k === "capstone" ? " checked" : "") + "><span><b>" + esc(g.name) + "</b><small>" + a.plural(g.ids.length, "lesson") + ", about " + a.hours(g.ids) + " h</small></span></label>";
    }).join("") + "</fieldset>";
    h += '<p class="tm-sum" id="tm-sum" aria-live="polite"></p><p class="pc-err" id="tm-err" role="alert"></p><div class="w-row"><button class="btn pill dark" type="submit">Create the plan</button></div></form></div>';
    a.$("#view").innerHTML = h;
    var form = a.$("#tm-form");
    function chosen() { var ks = a.$$("input[type=checkbox]:checked", form).map(function (c) { return c.value; }), ids = []; groups.forEach(function (g) { if (ks.indexOf(g.k) > -1) ids = ids.concat(g.ids); }); return ids; }
    function sum() { var ids = chosen(); a.$("#tm-sum").textContent = ids.length ? a.plural(ids.length, "lesson") + ", about " + a.hours(ids) + " hours each" : "Choose at least one group of lessons"; }
    form.addEventListener("change", sum); sum();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = a.$("#tm-name").value.trim(), ids = chosen(), err = a.$("#tm-err");
      if (!name) { err.textContent = "Give the team a name, so teammates know which plan they’re joining."; a.$("#tm-name").focus(); return; }
      if (!ids.length) { err.textContent = "Choose at least one group of lessons."; return; }
      var order = GW.lessons.map(function (l) { return l.id; });
      ids.sort(function (x, y) { return order.indexOf(x) - order.indexOf(y); });
      save("gw-team", { n: name, l: ids, m: [], me: "" });
      a.route();
    });
  }
  function memberRow(name, done, plan, you) {
    var a = A(), n = plan.filter(function (id) { return done[id]; }).length;
    return "<tr" + (you ? ' class="you"' : "") + '><th scope="row">' + esc(name) + (you && name !== "You" ? " <small>you</small>" : "") + '</th><td class="tb-n">' + a.moon(n / plan.length, 18) + n + " of " + plan.length + "</td>" +
      plan.map(function (id) { return '<td class="tb-dot' + (done[id] ? " on" : "") + '"><span class="sr-only">' + (done[id] ? "Done" : "Not done") + "</span></td>"; }).join("") + "</tr>";
  }
  function renderTeamBoard(team) {
    var a = A(), plan = team.l, has = a.roles().length, mine = a.progress(), myN = plan.filter(function (id) { return mine[id]; }).length;
    var nextId = plan.filter(function (id) { return !mine[id]; })[0];
    var h = '<div class="saver team">' + (has ? '<p class="pick-top"><a class="back" href="#progress">Progress</a></p>' : "") + '<p class="kicker">Team plan</p><h1>' + esc(team.n) + "</h1>";
    h += '<p class="lede">' + a.plural(plan.length, "lesson") + ", about " + a.hours(plan) + " hours each. Progress stays in each person’s browser. The board below is built from the codes you paste in, and only you can see it.</p>";
    if (!has) h += '<div class="notice">To start, choose your roles. The team’s lessons are open to everyone, whatever roles you pick.<div class="w-row"><a class="btn pill dark" href="#role">Choose your roles</a></div></div>';
    else h += '<div class="prog-top"><div class="prog-sum">' + a.moon(myN / plan.length, 28) + "<p><b>You: " + myN + " of " + plan.length + " done</b>" + (nextId ? '<span>Up next: <a href="#' + nextId + '">' + esc(a.byId[nextId].title) + "</a></span>" : "<span>You’ve finished the plan</span>") + "</p></div>" + (nextId ? '<a class="btn pill dark" href="#' + nextId + '">Continue</a>' : "") + "</div>";
    h += '<section class="tm-board"><h2>Board</h2>';
    h += '<div class="tb-scroll" tabindex="0" role="region" aria-label="Team board"><table class="tboard"><thead><tr><th scope="col">Name</th><th scope="col">Done</th>' + plan.map(function (id) { return '<th scope="col" class="tb-l" title="' + esc(a.byId[id].title) + '"><abbr title="' + esc(a.byId[id].title) + '">' + a.byId[id].num + "</abbr></th>"; }).join("") + "</tr></thead><tbody>";
    if (has) h += memberRow(team.me || "You", mine, plan, true);
    team.m.forEach(function (m) { var d = a.decode(m.code); if (!d.error) h += memberRow(m.name, d.progress, plan, false); });
    h += "</tbody></table></div>";
    if (team.m.length) h += '<ul class="tm-members">' + team.m.map(function (m, i) { return "<li><span>" + esc(m.name) + ' <code class="code-inline">' + esc(m.code) + '</code></span><button type="button" class="linkish" data-tm-remove="' + i + '">Remove</button></li>'; }).join("") + "</ul>";
    else h += '<p class="fine">No teammates yet. Paste their lines below.</p>';
    h += '<form class="w tm-add" id="tm-add" novalidate><label for="tm-lines">Add teammates</label><p class="fine" id="tm-help">One per line, a name and a progress code, like <code>Priya: LN-7K2Q9-M4TAB-8C1DE</code>. Pasting the same name again updates that person.</p><textarea id="tm-lines" aria-describedby="tm-help tm-add-err" rows="3"></textarea><p class="pc-err" id="tm-add-err" role="alert"></p><button class="btn pill dark" type="submit">Add to the board</button></form></section>';
    if (has) h += '<section class="tm-share"><h2>Share your line</h2><p class="fine">Send this to whoever keeps the board. Copy it again after you finish lessons.</p><div class="w"><label for="tm-me">Your name</label><input type="text" id="tm-me" maxlength="40" value="' + esc(team.me || "") + '" placeholder="Your name"></div><div class="code-card"><p class="code-big tm-line" id="tm-line"></p><button type="button" class="btn small ghost" id="tm-copy-line">Copy your line</button></div></section>';
    h += '<section class="tm-share"><h2>Invite teammates</h2><p class="fine">The link carries the team name and the lesson list, nothing else.</p><div class="w-row"><button type="button" class="btn pill dark" id="tm-copy-link">Copy invite link</button><button type="button" class="btn ghost" id="tm-leave">Leave this plan</button></div><p class="copy-msg" id="tm-msg" role="status" aria-live="polite"></p></section></div>';
    a.$("#view").innerHTML = h;

    var me = a.$("#tm-me");
    function line() { return (me && me.value.trim() ? me.value.trim() : "Your name") + ": " + a.code(); }
    if (me) {
      a.$("#tm-line").textContent = line();
      me.addEventListener("input", function () { a.$("#tm-line").textContent = line(); });
      me.addEventListener("change", function () { var t = load("gw-team", team); t.me = me.value.trim(); save("gw-team", t); });
      a.$("#tm-copy-line").addEventListener("click", function () { var b = this; a.copyText(line(), function (ok) { flashText(b, ok ? "Copied" : "Couldn't copy"); }); });
    }
    a.$("#tm-copy-link").addEventListener("click", function () { a.copyText(teamLink(team), function (ok) { a.$("#tm-msg").textContent = ok ? "Invite link copied" : "Couldn't copy automatically. Try again from a regular browser tab."; }); });
    a.$("#tm-leave").addEventListener("click", function () {
      if (!window.confirm("Leave “" + team.n + "”? The board and its codes are removed from this browser. Your own progress stays.")) return;
      save("gw-team", null); a.route();
    });
    a.$("#tm-add").addEventListener("submit", function (e) {
      e.preventDefault();
      var t = load("gw-team", team), bad = [], added = 0;
      a.$("#tm-lines").value.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) {
        var m = s.match(/^(.+?)[\s:,–—-]+((?:LN|GW)[\s-]*[0-9A-Za-z][0-9A-Za-z\s-]{7,22})$/i);
        if (!m) { bad.push(s); return; }
        var d = a.decode(m[2]); if (d.error) { bad.push(s + " (the code doesn't check out)"); return; }
        var name = m[1].trim().slice(0, 40), code = m[2].toUpperCase().replace(/\s/g, ""), i = t.m.map(function (x) { return x.name.toLowerCase(); }).indexOf(name.toLowerCase());
        if (i > -1) t.m[i].code = code; else t.m.push({ name: name, code: code });
        added += 1;
      });
      save("gw-team", t);
      var msg = "Couldn't add: " + bad.join("; ") + ". Each line needs a name, then a progress code.";
      if (bad.length && !added) { a.$("#tm-add-err").textContent = msg; return; }
      a.route();
      if (bad.length) { a.$("#tm-lines").value = bad.map(function (s) { return s.replace(/ \(the code.*$/, ""); }).join("\n"); a.$("#tm-add-err").textContent = "Added " + added + ". " + msg; }
    });
    a.$$("[data-tm-remove]").forEach(function (b) { b.addEventListener("click", function () { var t = load("gw-team", team); t.m.splice(+b.getAttribute("data-tm-remove"), 1); save("gw-team", t); a.route(); }); });
  }

  /* ================= progress page: tracks with certificates, team and QR ================= */
  function tracks() {
    var a = A(), roles = a.roles(), path = a.routeFor(roles), out = [{ k: "core", name: "Core lessons", ids: a.coreIds }];
    roles.forEach(function (r) { if (r !== "general") out.push({ k: r, name: a.roleInfo(r).name + " track", ids: a.trackOf(r) }); });
    out.push({ k: "path", name: "Your whole path", ids: path });
    return out;
  }
  function progressHtml() {
    var a = A(), done = a.progress(), team = load("gw-team", null);
    var h = '<section class="transfer qr-sec"><details class="qr-box"><summary>Show a QR code for your resume link</summary><div class="qr" id="qr" aria-label="QR code for your resume link" role="img"></div><p class="fine">Point your phone’s camera at it to open the course where you left off.</p></details></section>';
    h += '<section class="transfer"><h2>Tracks and certificates</h2><p class="fine">Finish a track to make a certificate you can download and share.</p><ul class="ex-list tracks">';
    tracks().forEach(function (t) {
      var n = t.ids.filter(function (id) { return done[id]; }).length, full = n === t.ids.length;
      h += "<li>" + (full ? '<a class="ex-row" href="#certificate/' + t.k + '">' : '<div class="ex-row">') + '<span class="tr-name">' + a.moon(n / t.ids.length, 20) + "<b>" + esc(t.name) + '</b></span><span class="ex-end"><span class="ex-kind">' + (full ? "Get your certificate" : n + " of " + t.ids.length + " done") + "</span>" + (full ? CHEVRON + "</span></a>" : "</span></div>") + "</li>";
    });
    h += "</ul></section>";
    h += '<section class="transfer"><h2>Learning with a team</h2><p class="fine">' + (team ? "You’re in “" + esc(team.n) + "”." : "Pick lessons for your team, share one link, and compare progress using codes. No accounts.") + '</p><div class="w-row"><a class="btn pill soft" href="#team">' + (team ? "Open the team board" : "Make a team plan") + "</a></div></section>";
    return h;
  }
  var qrLoad = null;
  function progressMount(view) {
    var box = view.querySelector(".qr-box"); if (!box) return;
    box.addEventListener("toggle", function () {
      if (!box.open || box.dataset.done) return;
      var el = box.querySelector("#qr"); el.innerHTML = '<p class="fine">Loading…</p>';
      qrLoad = qrLoad || new Promise(function (ok, no) {
        if (window.qrcode) return ok();
        var s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s);
      });
      qrLoad.then(function () {
        var q = window.qrcode(0, "M"); q.addData(A().resumeLink()); q.make();
        var n = q.getModuleCount(), m = 4, p = "";
        for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) p += "M" + (x + m) + " " + (y + m) + "h1v1h-1z";
        el.innerHTML = '<svg viewBox="0 0 ' + (n + 2 * m) + " " + (n + 2 * m) + '" shape-rendering="crispEdges" aria-hidden="true"><rect width="100%" height="100%" fill="#fff"/><path d="' + p + '" fill="#111110"/></svg>';
        box.dataset.done = "1";
      }, function () { qrLoad = null; el.innerHTML = '<p class="fine">The QR code needs a connection to load. Use the resume link instead.</p>'; });
    });
  }

  /* ================= certificates: drawn in the browser, downloaded as an image ================= */
  function renderCertificate(k) {
    var a = A(), t = tracks().filter(function (x) { return x.k === k; })[0], done = a.progress();
    var full = t && t.ids.every(function (id) { return done[id]; });
    var h = '<div class="saver cert"><p class="pick-top"><a class="back" href="#progress">Progress</a></p><h1>Certificate</h1>';
    if (!full) { h += '<p class="gloss-empty">' + (t ? "Finish every lesson in this track first: " + t.ids.filter(function (id) { return done[id]; }).length + " of " + t.ids.length + " done." : "That track isn’t on your path.") + '</p><a class="btn pill dark" href="#progress">Back to progress</a></div>'; a.$("#view").innerHTML = h; return; }
    h += '<p class="lede">' + esc(t.name) + ", " + a.plural(t.ids.length, "lesson") + '. Add your name as you want it to appear, then download the image.</p>';
    h += '<div class="w"><label for="ct-name">Your name</label><input type="text" id="ct-name" maxlength="48" autocomplete="name" value="' + esc(load("gw-name", "") || "") + '"></div>';
    h += '<canvas class="cert-canvas" id="ct-canvas" width="1600" height="1000" role="img" aria-label="Certificate preview"></canvas>';
    h += '<div class="w-row"><button type="button" class="btn pill dark" id="ct-dl">Download the image</button><span class="fine" id="ct-msg" aria-live="polite"></span></div>';
    h += '<p class="fine">Self-reported: progress is saved in your browser, and the certificate isn’t verified by anyone.</p></div>';
    a.$("#view").innerHTML = h;
    var cv = a.$("#ct-canvas"), name = a.$("#ct-name"), date = LONGDATE.format(new Date());
    function draw() { drawCert(cv, name.value.trim(), t, date); }
    (document.fonts && document.fonts.load ? Promise.all([document.fonts.load("600 80px Geist"), document.fonts.load("400 24px Geist"), document.fonts.load("400 20px 'Geist Mono'")]) : Promise.resolve()).then(draw, draw);
    name.addEventListener("input", function () { save("gw-name", name.value.trim()); draw(); });
    a.$("#ct-dl").addEventListener("click", function () {
      if (!name.value.trim()) { a.$("#ct-msg").textContent = "Add your name first."; name.focus(); return; }
      draw();
      cv.toBlob(function (b) {
        var url = URL.createObjectURL(b), link = document.createElement("a");
        link.href = url; link.download = "loona-certificate-" + k + ".png"; document.body.appendChild(link); link.click(); link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        a.$("#ct-msg").textContent = "Downloaded";
      }, "image/png");
    });
  }
  function drawCert(cv, who, t, date) {
    var a = A(), c = cv.getContext("2d"), W = cv.width, H = cv.height;
    var INK = "#F4F3F0", INK2 = "#CFCCC6", MUTED = "#9A968F", ACC = "#4CC38A", F = "Geist, ui-sans-serif, system-ui, sans-serif", M = "'Geist Mono', ui-monospace, monospace";
    c.fillStyle = "#0B0B0A"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(244,243,240,.14)"; c.lineWidth = 2; c.strokeRect(48, 48, W - 96, H - 96);
    // mark and name
    c.save(); c.translate(112, 104); c.scale(2.2, 2.2); c.translate(1, -1);
    c.fillStyle = INK; c.strokeStyle = INK; c.lineWidth = 2.4; c.lineCap = "round";
    c.beginPath(); c.arc(11, 13, 5.6, 0, Math.PI * 2); c.fill();
    c.stroke(new Path2D("M20.4 9.6A10 10 0 1 1 14.4 3.6"));
    c.beginPath(); c.arc(19.2, 4.8, 2, 0, Math.PI * 2); c.fill(); c.restore();
    c.fillStyle = INK; c.font = "600 40px " + F; c.textBaseline = "middle"; c.fillText("Loona", 182, 132);
    // a full moon in the accent: the track is complete
    c.beginPath(); c.arc(W - 160, 132, 44, 0, Math.PI * 2); c.fillStyle = ACC; c.fill();
    c.textBaseline = "alphabetic";
    c.fillStyle = MUTED; c.font = "400 30px " + F; c.fillText("Certificate of completion", 112, 330);
    c.fillStyle = who ? INK : "rgba(244,243,240,.3)"; c.font = "600 " + fit(c, who || "Your name", 96, W - 224, F) + "px " + F; c.fillText(who || "Your name", 112, 448);
    c.fillStyle = INK2; c.font = "400 32px " + F;
    c.fillText("completed " + (t.k === "path" ? "their path" : t.k === "core" ? "the core lessons" : "the " + t.name) + " of Loona, a course on using AI well at work", 112, 520, W - 224);
    c.font = "400 22px " + M; c.fillStyle = MUTED;
    var cols = t.ids.length > 6 ? 2 : 1, rows = Math.ceil(t.ids.length / cols), colW = (W - 224) / cols, lh = Math.min(36, 260 / rows);
    t.ids.forEach(function (id, i) {
      var l = a.byId[id], x = 112 + Math.floor(i / rows) * colW, y = 600 + (i % rows) * lh;
      c.fillText(String(l.num).padStart(2, "0") + "  " + clip(c, l.title, colW - 80), x, y);
    });
    c.fillStyle = INK2; c.font = "400 26px " + F; c.fillText(date, 112, H - 112);
    c.fillStyle = MUTED; c.font = "400 20px " + F; c.textAlign = "right"; c.fillText("Self-reported. Progress is saved in the learner’s browser.", W - 112, H - 112); c.textAlign = "left";
  }
  function fit(c, text, size, max, F) { c.font = "600 " + size + "px " + F; while (size > 40 && c.measureText(text).width > max) { size -= 4; c.font = "600 " + size + "px " + F; } return size; }
  function clip(c, s, max) { if (c.measureText(s).width <= max) return s; while (s.length > 4 && c.measureText(s + "…").width > max) s = s.slice(0, -1); return s + "…"; }

  /* ================= wiring ================= */
  GW.ext = { lessonMount: lessonMount, reading: reading, key: key, exercisesHtml: exercisesHtml, progressHtml: progressHtml, progressMount: progressMount };
  GW.pages = {
    practice: { tab: "exercises", render: function (arg) { if (arg) return renderPracticeCase(parseInt(arg, 10)); renderPracticeList(); }, title: function (arg) { var p = arg && GW.practice[parseInt(arg, 10) - 1]; return p ? p.t : "You decide"; } },
    review: { tab: "exercises", render: function () { revSession = null; renderReview(); }, title: function () { return "Review terms"; } },
    team: { tab: "progress", open: true, render: renderTeam, title: function () { var t = load("gw-team", null); return t ? t.n : "Team plan"; } },
    certificate: { tab: "progress", render: renderCertificate, title: function () { return "Certificate"; } }
  };
})();
