/* Kern app: landing, role picker, progress codes, routing, course rail, home, lessons, glossary, search, progress, checks. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  // Lessons whose content file isn't loaded (not written yet) are left out. Numbers stay fixed, so text references stay right.
  GW.lessons = GW.lessons.filter(function (l) { return GW.content[l.id]; });
  var byId = {}; GW.lessons.forEach(function (l) { byId[l.id] = l; });
  var hasUseCases = !!(GW.useCases && GW.useCases.length);

  /* ---------- roles ---------- */
  var GENERAL = { id: "general", name: "General", why: "A neutral path for anyone: the core lessons and the capstone, with examples that apply to any role." };
  function roleInfo(r) { if (r === "general") return GENERAL; return GW.roles.filter(function (x) { return x.id === r; })[0] || null; }
  var roleList = [GENERAL].concat(GW.roles);
  var coreIds = GW.lessons.filter(function (l) { return l.part === "a" || l.part === "b"; }).map(function (l) { return l.id; });
  var coreLast = coreIds.length;
  var MAXR = 3, lessonPos = {}; GW.lessons.forEach(function (l, i) { lessonPos[l.id] = i; });
  function cleanRoles(list) {
    if (typeof list === "string") list = [list];
    if (!Array.isArray(list)) return [];
    var out = []; list.forEach(function (r) { if (roleInfo(r) && out.indexOf(r) < 0) out.push(r); });
    return out.indexOf("general") > -1 ? ["general"] : out.slice(0, MAXR);
  }
  // General or nothing: core + capstone. Otherwise: core + the main role's full track (three lessons)
  // + the first lesson of each other role (or, for a single role, of its neighbour) + capstone.
  // A role takes one of twelve shared tracks; a track id is also the id of its first lesson.
  function trackIdOf(r) { var x = roleInfo(r); return x && x.track ? x.track : r; }
  function trackName(t) { var x = GW.tracks.filter(function (k) { return k.id === t; })[0]; return x ? x.name : ""; }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function trackOf(r) { var t = trackIdOf(r); return GW.lessons.filter(function (l) { return l.rid === t; }).map(function (l) { return l.id; }); }
  function routeFor(list) {
    list = cleanRoles(list);
    if (!list.length || list[0] === "general") return coreIds.concat(["team-adoption"]);
    var extra = trackOf(list[0]).concat(list.length === 1 ? [roleInfo(list[0]).also] : list.slice(1).map(trackIdOf));
    extra = extra.filter(function (id, i) { return extra.indexOf(id) === i; }).sort(function (a, b) { return lessonPos[a] - lessonPos[b]; });
    return coreIds.concat(extra).concat(["team-adoption"]);
  }
  function trackSpan(r) { var t = trackOf(r), a = byId[t[0]].num, b = byId[t[t.length - 1]].num; return a === b ? "Lesson " + a : "Lessons " + a + "–" + b; }
  function pathName(list) {
    var n = list.map(function (r) { return roleInfo(r).name; });
    if (!n.length) return "";
    return n.length === 1 ? n[0] : n.length === 2 ? n[0] + " & " + n[1] : n[0] + " +" + (n.length - 1);
  }
  function pathLong(list) {
    var n = list.map(function (r) { return roleInfo(r).name; });
    return n.length < 3 ? n.join(" and ") : n.slice(0, -1).join(", ") + " and " + n[n.length - 1];
  }
  function tagFor(id, list) {
    if (!list.length || list[0] === "general") return "";
    var r = byId[id] && byId[id].rid; if (!r) return "";
    if (r === trackIdOf(list[0])) return list.length > 1 ? "Main role" : "Your role";
    if (list.slice(1).map(trackIdOf).indexOf(r) > -1) return "Your role";
    if (list.length === 1 && r === roleInfo(list[0]).also) return "Neighbouring role";
    return "";
  }
  var NUM = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
  function hours(ids) { var m = ids.reduce(function (a, id) { return a + byId[id].minutes; }, 0); var h = NUM.format(Math.round(m / 60 * 2) / 2); return h + (h === "1" ? " hour" : " hours"); }
  // Kern's signature: progress drawn as five backslashes that turn green as lessons are done. Used only for progress.
  function meter(f, size, label) {
    f = Math.max(0, Math.min(1, f || 0)); size = size || 16;
    var on = Math.round(f * 5); if (f > 0 && on === 0) on = 1; if (f < 1 && on === 5) on = 4;
    var lines = "";
    for (var i = 0; i < 5; i++) { var x = 3 + i * 5; lines += '<line class="' + (i < on ? "on" : "") + '" x1="' + (x - 1.6) + '" y1="3" x2="' + (x + 1.6) + '" y2="13"/>'; }
    return '<svg class="meter' + (on === 5 ? " full" : "") + '" width="' + Math.round(size * 1.65) + '" height="' + size + '" viewBox="0 0 26.5 16"' + (label ? ' role="img" aria-label="' + esc(label) + '"' : ' aria-hidden="true"') + ">" + lines + "</svg>";
  }

  /* ---------- local storage (per-browser copy) ---------- */
  function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(key, val) { try { if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } }
  var progress = load("gw-progress", {});
  var roles = cleanRoles(load("gw-roles", null) || load("gw-role", null));
  save("gw-session", null);   // retired: the course no longer has accounts
  GW.store = { load: load, save: save };

  var totalMin = GW.lessons.reduce(function (a, l) { return a + l.minutes; }, 0);
  var courseSize = GW.lessons.length + " lessons, about " + Math.round(totalMin / 60 * 2) / 2 + " hours in all";
  function doneOf(ids) { return ids.filter(function (id) { return progress[id]; }).length; }

  // Everything lives in this browser; the progress code carries it to another one.
  function persist() { save("gw-roles", roles); save("gw-role", null); save("gw-progress", progress); }

  /* ---------- top bar: role indicator, course or code link ---------- */
  // mode: "bare" for arrival pages, "tabs" for the four course tabs, "lesson" for a lesson (adds the sidebar)
  function paintTopbar(mode, tab) {
    var bare = mode === "bare";
    document.body.classList.toggle("bare", bare);
    document.body.classList.toggle("norail", mode !== "lesson");
    var rb = $("#role-btn");
    rb.hidden = !roles.length || bare;
    if (roles.length) { rb.innerHTML = '<span class="k">Path</span><b class="pn-full">' + esc(pathName(roles)) + '</b><b class="pn-short">' + esc(roleInfo(roles[0]).name + (roles.length > 1 ? " +" + (roles.length - 1) : "")) + '</b><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'; rb.setAttribute("aria-label", "Your path: " + pathLong(roles) + ". Change roles"); }
    var sb = $("#signin-btn");
    sb.hidden = !bare || location.hash === "#progress" || location.hash === "#role";
    sb.textContent = roles.length ? "Open course" : "Have a code?";
    sb.setAttribute("href", roles.length ? "#home" : "#progress");
    $("#search-btn").hidden = bare;
    var tabs = $("#tabs"); tabs.hidden = bare || !roles.length;
    $('[data-tab="usecases"]', tabs).hidden = !hasUseCases;
    $$("a", tabs).forEach(function (a) { if (a.getAttribute("data-tab") === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  }

  /* ---------- rail ---------- */
  function railLink(l, active) {
    var cls = "lnk" + (l.id === active ? " active" : "") + (progress[l.id] ? " done" : "");
    return '<a class="' + cls + '" href="#' + l.id + '"' + (l.id === active ? ' aria-current="page"' : "") + '><span class="num">' + l.num + "</span><span>" + esc(l.title) + '</span><span class="done-dot" aria-label="' + (progress[l.id] ? "Completed" : "Not completed") + '"></span></a>';
  }
  function renderRail(active) {
    var path = routeFor(roles), n = doneOf(path);
    var h = '<div class="rail-path"><span class="k">Your path</span><b>' + esc(pathLong(roles) || "Not chosen") + '</b><span class="m">' + meter(n / path.length, 14) + n + " of " + path.length + ' lessons done</span><a href="#role">Change roles</a></div>';
    h += '<a class="rail-home" href="#home">All lessons</a>';
    GW.parts.forEach(function (p, pi) {
      var ls = GW.lessons.filter(function (l) { return l.part === p.id; });
      h += '<div class="rail-part p' + pi + '"><h2>' + esc(p.title) + "</h2>";
      if (p.id === "c") {
        var on = ls.filter(function (l) { return path.indexOf(l.id) > -1; }), off = ls.filter(function (l) { return path.indexOf(l.id) < 0; });
        on.forEach(function (l) { h += railLink(l, active); });
        if (off.length) {
          var openIt = off.some(function (l) { return l.id === active; });
          h += '<details class="rail-more"' + (openIt ? " open" : "") + "><summary>" + (on.length ? "Other roles" : "Role lessons") + " (" + off.length + ")</summary>" + off.map(function (l) { return railLink(l, active); }).join("") + "</details>";
        }
      } else ls.forEach(function (l) { h += railLink(l, active); });
      h += "</div>";
    });
    h += '<div class="rail-foot"><a href="#progress"' + (active === "progress" ? ' aria-current="page"' : "") + '>Your progress code</a><a href="#glossary"' + (active === "glossary" ? ' aria-current="page"' : "") + '>Glossary of terms</a><a href="#welcome">About the course</a><button type="button" class="linkish kb-link" data-kb-help>Keyboard shortcuts</button><p class="who-line">Progress saves in this browser.</p>' + (GW.version ? '<p class="build-v">Version ' + esc(GW.version) + "</p>" : "") + "</div>";
    $("#rail").innerHTML = h;
  }

  /* ---------- shared pieces ---------- */
  function roleBlurb(r) { return r === GENERAL ? "Core lessons and the capstone, with examples that suit any role." : byId[r.id].summary; }
  function lessonRow(l, path, grouped) {
    var on = path && path.indexOf(l.id) > -1 && l.part === "c";
    return '<li><a class="' + (progress[l.id] ? "done" : "") + '" href="#' + l.id + '"><span class="n">' + l.num + '</span><span><span class="t">' + esc(l.title) + (l.role && !grouped ? "<small>" + esc(l.role) + "</small>" : "") + (on ? '<small class="on-path">On your path</small>' : "") + '</span><span class="s">' + esc(l.summary) + '</span></span><span class="st">' + (progress[l.id] ? "Completed" : l.minutes + "\u00a0min") + "</span></a></li>";
  }

  /* ---------- landing ---------- */
  // One complete example: an AI draft and the human check, switchable by role.
  var HERO = [
    { r: "security", draft: "Reviewed the invoice endpoint. No issues found. Low risk.", s: "bad", st: "Missed a check", note: "It checks that you're signed in, not that the invoice is yours. Change the ID in the URL and you can read anyone's invoice." },
    { r: "product", draft: "Most users asked for dark mode.", s: "warn", st: "No source", note: "3 of 40 interview notes mention it. Ask for the count and the notes behind a theme before you repeat it." },
    { r: "engineering", draft: "Return <code>res.data.items</code> from the fetch.", s: "ok", st: "Tests pass", note: "Ran it against a real response, including an empty list. The claim held up, so it ships." },
    { r: "data-analytics", draft: "October monthly active users: 1,284,550.", s: "bad", st: "Wrong grain", note: "The query counted events, not people. One row per user changes the answer completely." }
  ];
  // Short, parallel lines for what each track practises (roles show their track's line).
  var ROLE_SHORT = {
    product: "Discovery, specs and shipping AI features",
    design: "Research, prototypes and AI feature design",
    engineering: "Generated code, coding agents and review",
    qa: "Test automation and testing AI features",
    security: "Threat models, code review and detection",
    "data-analytics": "Queries, analysis and data quality",
    "technical-writing": "Docs from real sources, for people and AI",
    delivery: "Status reports, backlogs and team rituals",
    "project-management": "Plans, change requests and suppliers",
    "engineering-management": "Measuring AI, hiring and growing people",
    operations: "Incidents, infrastructure code, AI in production",
    "customer-support": "Replies, help-centre knowledge and support bots",
    general: "The core lessons and the capstone, for any role"
  };
  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }
  function heroCard(k) {
    var c = HERO[k], info = { name: trackName(c.r) };
    return '<div class="hx-draft"><span class="hx-k">AI draft (' + esc(info.name) + ')</span><p>' + c.draft + '</p></div><div class="hx-check"><span class="hx-k">Human check</span><span class="stamp ' + c.s + '">' + esc(c.st) + "</span><p>" + esc(c.note) + "</p></div>";
  }
  function renderWelcome() {
    var ready = roles.length > 0;
    var go = ready ? "#home" : "#role", goTxt = ready ? "Continue the course" : "Start the course";
    var first = GW.lessons[0], nEx = exercises().length, nRoles = GW.roles.length;
    var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke-width="2"/><path d="m12 5 7 7-7 7" stroke-width="2"/></svg>';
    var ICON = {
      workflow: '<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v3a3 3 0 0 0 3 3h3"/>',
      analytics: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-4"/><path d="M13 16V8"/><path d="M18 16v-7"/>',
      leads: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
      bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
      globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/>'
    };
    var icon = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + "</svg>"; };
    var rv = function (ms) { return ' data-reveal style="--rd:' + ms + 'ms"'; };
    var h = '<div class="lx">';

    // 1 · hero: one headline; the role at its end is deleted and retyped every 2.4 seconds
    h += '<header class="lx-hero"><div class="lx-hero-inner">';
    h += '<h1 class="lx-title"' + rv(60) + '><span class="sr-only">Learn the basics of AI and its use cases for every role on a software team</span><span aria-hidden="true">Learn the basics of AI and its use cases for<br><span class="lx-role-line"><span class="lx-role" id="lx-role">' + HERO_ROLES[0] + '</span><span class="lx-cursor"></span></span></span></h1>';
    h += '<p class="lx-sub"' + rv(180) + '>A free course for software teams. Core lessons for everyone, a three-lesson track for your role, and no account to create.</p>';
    h += '<div class="lx-actions"' + rv(300) + '><a class="lx-btn lx-primary" href="' + go + '">' + goTxt + ARROW + '</a><a class="lx-btn lx-outline" href="#progress">I have a progress code</a></div>';
    h += '<p class="lx-meta"' + rv(380) + '>' + GW.lessons.length + " lessons · " + nRoles + " roles · no account</p>";
    h += "</div></header>";

    // 2 · features: what the course covers
    var feats = [
      ["workflow", "How models work", "What a model is doing when it writes, what it can see, and why it can be fluent and wrong at the same time."],
      ["analytics", "Check in proportion", "A repeatable way to check AI work, scaled to how costly a mistake would be and how easily you would notice it."],
      ["leads", "Your role, your examples", "Pick up to three roles. Your main role adds a three-lesson track and sets the examples in every core lesson."],
      ["bolt", "Exercises that answer back", nEx + " hands-on exercises, from flagging claims to running code, each with feedback as you go."],
      ["shield", "Data and agents, safely", "What a model must never see, and sensible limits for tools and agents that take actions on your behalf."],
      ["globe", "No account needed", "Progress saves in your browser. A short code or a resume link carries it to any other device."]
    ];
    h += '<section class="lx-section lx-features" id="lx-features"><div class="lx-head"><span class="lx-eyebrow"' + rv(0) + '>What you learn</span><h2' + rv(80) + '>One course for working with AI on a software team</h2><p' + rv(160) + '>Eight core lessons for everyone, a track for your role, and a capstone on bringing AI into a team. Short lessons, real cases, and nothing to install.</p></div><div class="lx-grid">';
    feats.forEach(function (f, i) { h += '<article class="lx-card"' + rv(i * 90) + '><div class="lx-card-icon">' + icon(f[0]) + "</div><h3>" + f[1] + "</h3><p>" + esc(f[2]) + "</p></article>"; });
    h += "</div></section>";

    // 3 · showcase: the worked example, then real figures
    h += '<section class="lx-section lx-showcase" id="lx-example"><div class="lx-show-grid"><div class="lx-show-copy">';
    h += '<span class="lx-eyebrow"' + rv(0) + '>See it in practice</span><h2' + rv(90) + '>What checking AI work looks like</h2>';
    h += '<p' + rv(180) + '>Every lesson works from cases like this one: an AI draft that reads well, and the human check that decides whether it ships. Switch roles to see the same habit in different work.</p>';
    h += '<a class="lx-btn lx-primary"' + rv(270) + ' href="' + go + '">' + (ready ? "Continue the course" : "Choose your roles") + ARROW + "</a></div>";
    h += '<figure class="lx-dash hero-ex"' + rv(160) + ' aria-label="An AI draft and the human check that follows it"><div class="lx-dash-top"><b>Worked example</b><span class="lx-live"><i aria-hidden="true"></i>Human check</span></div><div class="hx-card">' + heroCard(0) + "</div>";
    h += '<figcaption><span>See it for</span><span class="hx-roles" role="group" aria-label="Show the example for">' + HERO.map(function (c, k) { return '<button type="button" class="rx-btn" data-hx="' + k + '" aria-pressed="' + (k === 0) + '">' + esc(trackName(c.r)) + "</button>"; }).join("") + "</span></figcaption></figure></div>";
    var stats = [[GW.lessons.length, "Short lessons, 20 to 35 minutes"], [nRoles, "Roles, from software engineer to support"], [nEx, "Exercises that check your answer"], ["0", "Accounts to create"]];
    h += '<div class="lx-stats">' + stats.map(function (s, i) { return '<div class="lx-stat"' + rv(i * 80) + '><div class="lx-stat-v">' + s[0] + '</div><div class="lx-stat-l">' + s[1] + "</div></div>"; }).join("") + "</div></section>";

    // 4 · call to action and footer
    h += '<section class="lx-section lx-cta" id="lx-cta"><div class="lx-cta-card">';
    h += '<span class="lx-eyebrow"' + rv(60) + '>Ready when you are</span><h2' + rv(140) + '>Start with lesson 1</h2>';
    h += '<p' + rv(220) + '>It takes ' + first.minutes + ' minutes and needs no background. Choose your roles first, or start with General and add roles later.</p>';
    h += '<div class="lx-actions"' + rv(300) + '><a class="lx-btn lx-primary" href="' + go + '">' + goTxt + ARROW + '</a><a class="lx-btn lx-outline" href="#progress">Continue with a code</a></div></div>';
    h += '<footer class="lx-footer"><div class="lx-foot-brand"><span class="lx-brand"><svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><line class="s1" x1="8" y1="5" x2="15" y2="27"/><line class="s2" x1="17" y1="5" x2="24" y2="27"/></svg><span>Kern</span></span><p>A free course for software teams on understanding AI and using it well at work.</p></div>';
    h += '<div class="lx-foot-cols"><div><h4>Course</h4><a href="#home">Lessons</a><a href="#exercises">Exercises</a><a href="#glossary">Glossary</a></div><div><h4>Start</h4><a href="#role">Choose roles</a><a href="#progress">Progress code</a></div><div><h4>Privacy</h4><span>No accounts</span><span>Progress stays in your browser</span></div></div></footer>';
    h += '<p class="lx-copy">© ' + new Date().getFullYear() + ' Kern.</p></section>';
    h += "</div>";
    $("#view").innerHTML = h;
    document.body.classList.add("on-landing");
    landingReveal();
    startRoles();
  }
  // staggered fade-up: the hero starts at once, the rest as it scrolls into view (delays come from --rd)
  // the roles the hero cycles through, as people rather than role names, so the sentence reads naturally
  var HERO_ROLES = ["software engineers", "designers", "data scientists", "DevOps engineers", "product managers", "AI engineers", "QA testers", "security analysts",
    "frontend developers", "cloud engineers", "data analysts", "solutions architects", "mobile developers", "SREs", "ML engineers", "support specialists",
    "systems engineers", "data engineers", "security engineers", "technical writers", "automation engineers", "network architects", "AI researchers", "project managers",
    "sysadmins", "database admins", "SOC analysts", "AI strategists", "systems analysts", "delivery leads", "data annotators", "data center techs", "engineering managers"];
  var roleTimer = null;
  function startRoles() {
    clearInterval(roleTimer);
    var el = $("#lx-role"), k = 0, busy = false; if (!el) return;
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleTimer = setInterval(function () {
      if (busy || !document.body.contains(el)) return;
      var cur = el.textContent, next = HERO_ROLES[++k % HERO_ROLES.length];
      if (reduced) { el.textContent = next; return; }
      busy = true;
      var i = cur.length, j = 0;
      (function del() {
        if (i >= 0) { el.textContent = cur.slice(0, i--); return setTimeout(del, 22); }
        (function type() { if (j <= next.length) { el.textContent = next.slice(0, j++); return setTimeout(type, 38); } busy = false; })();
      })();
    }, 2400);
  }
  var revealIO = null;
  function landingReveal() {
    if (revealIO) { revealIO.disconnect(); revealIO = null; }
    document.documentElement.classList.add("js-anim");
    var els = $$(".lx [data-reveal]");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    void document.body.offsetWidth; // flush the hidden state so the fade-up transition runs
    $$(".lx-hero [data-reveal]").forEach(function (e) { e.classList.add("in"); });
    revealIO = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { if (!e.closest(".lx-hero")) revealIO.observe(e); });
  }
  // The hero example is still; the role buttons swap it with one short fade.
  function showHero(fig, k) {
    $$("[data-hx]", fig).forEach(function (x) { x.setAttribute("aria-pressed", String(+x.getAttribute("data-hx") === k)); });
    var card = $(".hx-card", fig); card.innerHTML = heroCard(k);
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
  }
  document.addEventListener("click", function (e) {
    var more = e.target.closest("[data-nh-more]");
    if (more) { var ex = $(".l-example, #lx-example"); if (ex) ex.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); return; }
    var b = e.target.closest("[data-hx]"); if (!b) return;
    showHero(b.closest(".hero-ex"), +b.getAttribute("data-hx"));
  });

  /* ---------- progress code: roles and completed lessons, no server ----------
     v2 layout (75 bits, 15 characters): version (4) · three role slots (4 each, 0 = empty) · 51 lesson slots (1 bit each) · CRC-8 (8).
     v1 codes (9 characters, the first 21 lessons) still decode.
     Both lists are append-only: never reorder or remove an entry, or old codes decode wrongly. Lesson slots 46–51 are spare. */
  var CODE_V = 2, CODE_SLOTS = 51, V3_SLOTS = 90;
  var CODE_LESSONS = ["how-models-work", "context", "failure-modes", "choosing-models", "asking-well", "checking-work", "tools-agents", "data-security", "product", "design", "engineering", "qa", "security", "data-analytics", "technical-writing", "delivery", "project-management", "engineering-management", "operations", "customer-support", "team-adoption",
    "product-discovery", "product-ai-features", "design-research", "design-ai-ux", "engineering-agents", "engineering-review", "qa-automation", "qa-ai-features", "security-threat-models", "security-detection", "data-analysis", "data-quality", "docs-for-ai", "docs-maintenance", "delivery-flow", "delivery-rituals", "pm-planning", "pm-vendors", "em-measuring", "em-people", "ops-iac", "ops-llm", "support-knowledge", "support-assistant"];
  var CODE_ROLES = ["general", "product", "design", "engineering", "qa", "security", "data-analytics", "technical-writing", "delivery", "project-management", "engineering-management", "operations", "customer-support",
    "web-frontend", "mobile", "test-automation", "systems-engineering", "systems-analysis", "sysadmin", "network-architecture", "database-admin", "cloud", "sre", "data-center",
    "cybersecurity-engineering", "soc", "data-science", "data-engineering", "ai-engineering", "ml-engineering", "ai-research", "ai-strategy", "data-annotation", "solutions-architecture"];
  var V2_ROLES = 13;   // version 2 codes hold only the first 13 entries (4 bits per role)
  var B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";   // Crockford: no I, L, O or U
  function bitsOf(n, w) { var s = n.toString(2); while (s.length < w) s = "0" + s; return s; }
  function crc8(bits) {
    var c = 0;
    for (var i = 0; i < bits.length; i++) { var fb = ((c >> 7) & 1) ^ (bits[i] === "1" ? 1 : 0); c = (c << 1) & 255; if (fb) c ^= 7; }
    return c;
  }
  // Version 2 (15 characters) while every role fits it; version 3 (24 characters: 6 bits per role, 90 lesson slots) otherwise.
  function encodeProgress() {
    var v3 = roles.some(function (r) { return CODE_ROLES.indexOf(r) >= V2_ROLES; }) || CODE_LESSONS.slice(CODE_SLOTS).some(function (id) { return progress[id]; });
    var rb = v3 ? 6 : 4, slots = v3 ? V3_SLOTS : CODE_SLOTS;
    var b = bitsOf(v3 ? 3 : CODE_V, 4);
    for (var i = 0; i < 3; i++) b += bitsOf(roles[i] ? CODE_ROLES.indexOf(roles[i]) + 1 : 0, rb);
    for (var n = 0; n < slots; n++) b += CODE_LESSONS[n] && progress[CODE_LESSONS[n]] ? "1" : "0";
    b += bitsOf(crc8(b), 8);
    var out = "";
    for (var j = 0; j < b.length; j += 5) out += B32[parseInt(b.slice(j, j + 5), 2)];
    return out;
  }
  function prettyCode(c) {
    if (c.length === 9) return "KN-" + c.slice(0, 3) + "-" + c.slice(3, 6) + "-" + c.slice(6);
    if (c.length === 24) return "KN-" + c.match(/.{6}/g).join("-");
    return "KN-" + c.slice(0, 5) + "-" + c.slice(5, 10) + "-" + c.slice(10);
  }
  function decodeProgress(raw) {
    var s = String(raw || "").toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1").replace(/[^0-9A-Z]/g, "");
    if ((s.length === 11 || s.length === 17 || s.length === 26) && /^(KN|1N|GW)/.test(s)) s = s.slice(2);   // KN- now; LN- (read as 1N) and GW- from earlier names
    if (s.length !== 9 && s.length !== 15 && s.length !== 24) return { error: "A progress code has 15 or 24 letters and numbers after KN, like KN-7K2Q9-M4TAB-8C1DE. Older nine-character codes work too." };
    var b = "";
    for (var i = 0; i < s.length; i++) { var v = B32.indexOf(s[i]); if (v < 0) return { error: "That code has a character that isn't used in progress codes. Check it and try again." }; b += bitsOf(v, 5); }
    var ver = s.length === 9 ? 1 : s.length === 15 ? 2 : 3, rb = ver === 3 ? 6 : 4, slots = ver === 1 ? 21 : ver === 2 ? CODE_SLOTS : V3_SLOTS;
    var body = 4 + 3 * rb + slots;
    if (parseInt(b.slice(body, body + 8), 2) !== crc8(b.slice(0, body))) return { error: "That code doesn't check out. A character may have been mistyped." };
    if (parseInt(b.slice(0, 4), 2) !== ver) return { error: "That code comes from a different version of the course." };
    var rs = [];
    for (var k = 0; k < 3; k++) { var r = parseInt(b.slice(4 + k * rb, 4 + (k + 1) * rb), 2); if (r > 0 && CODE_ROLES[r - 1]) rs.push(CODE_ROLES[r - 1]); }
    var done = {}, lb = 4 + 3 * rb;
    CODE_LESSONS.slice(0, slots).forEach(function (id, n) { if (b[lb + n] === "1") done[id] = true; });
    return { roles: cleanRoles(rs), progress: done };
  }
  // Restoring switches to the code's roles and keeps every lesson completed in either place.
  function applyProgress(d) {
    if (d.roles.length) roles = d.roles;
    Object.keys(d.progress).forEach(function (k) { progress[k] = true; });
    persist();
  }
  function resumeLink() { return location.origin + location.pathname + "#resume=" + encodeProgress(); }
  function fallbackCopy(t) {
    var ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; } ta.remove(); return ok;
  }
  function copyText(t, done) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(fallbackCopy(t)); });
    else done(fallbackCopy(t));
  }
  var notice = "";

  /* ---------- progress page: copy your code, or restore one ---------- */
  function renderProgress(prefill, err) {
    var path = routeFor(roles), n = doneOf(path), has = roles.length > 0;
    var h = '<div class="saver">';
    if (!has) h += '<p class="pick-top"><a class="back" href="#welcome">Back</a></p>';
    h += "<h1>" + (has ? "Progress" : "Continue with a code") + "</h1>";
    if (has) {
      var next = path.filter(function (id) { return !progress[id]; })[0], all = GW.lessons.filter(function (l) { return progress[l.id]; }).length;
      h += '<div class="prog-top"><div class="prog-sum"><div class="pbar" aria-label="Progress on your path"><span class="pbar-track"><i style="width:' + Math.round(100 * n / path.length) + '%"></i></span><span class="pbar-t">' + n + " of " + path.length + ' done</span></div><p class="fine">' + esc(pathLong(roles)) + " path. " + all + " of " + GW.lessons.length + " lessons completed across the whole library.</p></div>" + (next ? '<a class="btn pill dark" href="#' + next + '">Continue learning</a>' : '<a class="btn pill dark" href="#home">Path complete. Back to lessons</a>') + "</div>";
      if (next) h += '<p class="prog-next">Up next: <a href="#' + next + '">' + esc(byId[next].title) + "</a>, " + byId[next].minutes + " min</p>";
      var link = resumeLink(), mail = "mailto:?subject=" + encodeURIComponent("My Kern progress") + "&body=" + encodeURIComponent("Continue the course where I left off: " + link + "\n\nProgress code: " + prettyCode(encodeProgress()));
      h += '<section class="transfer"><h2>Continue on another device</h2>';
      h += '<p class="fine">Progress saves in this browser as you go. Open your resume link on the other device and you pick up where you left off.</p>';
      h += '<div class="w-row"><button type="button" class="btn pill dark" data-copy="link">Copy resume link</button><a class="tx-mail" href="' + esc(mail) + '">Email it to yourself</a></div>';
      h += '<div class="code-card"><span class="hx-k">Or type this code on the other device</span><div class="code-row"><p class="code-big" id="pc-code">' + prettyCode(encodeProgress()) + '</p><button type="button" class="btn small ghost" data-copy="code">Copy code</button></div>';
      h += '<p class="code-sum">The code changes as you complete lessons, so copy it again before you switch.</p></div>';
      h += '<p class="copy-msg" data-copy-msg role="status" aria-live="polite"></p></section>';
      if (GW.ext) h += GW.ext.progressHtml();
    } else h += '<p class="lede">Enter the progress code from your other device. Your roles and completed lessons come back in this browser.</p>';
    h += '<section class="restore">' + (has ? "<h2>Restore a different code</h2>" : "");
    h += '<form class="w" id="pc-form" novalidate><label for="pc-in">Progress code</label><p class="fine pc-help" id="pc-help">15 letters and numbers, with or without the dashes.' + (has ? " Restoring switches to the roles in the code and keeps every lesson you have completed here." : "") + '</p><div class="pc-row"><input type="text" id="pc-in" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="KN-7K2Q9-M4TAB-8C1DE" aria-describedby="pc-help pc-err" value="' + esc(prefill || "") + '"><button class="btn pill dark" type="submit">Restore progress</button></div>';
    h += '<p class="pc-err" id="pc-err" role="alert">' + esc(err || "") + "</p></form>";
    h += "</section>";
    if (has) h += '<section class="restore"><h2>Clear this browser</h2><p class="fine">Removes your roles and progress from this browser. Copy your code first if you want them back later.</p><button type="button" class="btn ghost" id="pc-clear">Clear progress in this browser</button></section>';
    else h += '<p class="auth-back"><a href="#role">No code? Choose your roles and start</a></p>';
    h += "</div>";
    $("#view").innerHTML = h;
    if (GW.ext && has) GW.ext.progressMount($("#view"));
    $("#pc-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var d = decodeProgress($("#pc-in").value), errBox = $("#pc-err");
      if (d.error) { errBox.textContent = d.error; $("#pc-in").setAttribute("aria-invalid", "true"); $("#pc-in").focus(); return; }
      applyProgress(d);
      notice = "Progress restored: " + pathLong(roles) + ", " + doneOf(routeFor(roles)) + " of " + routeFor(roles).length + " lessons done.";
      var go = resumeTo || "home"; resumeTo = null; location.hash = go;
    });
    var clr = $("#pc-clear");
    if (clr) clr.addEventListener("click", function () {
      if (!window.confirm("Clear your roles and progress from this browser? This can't be undone unless you have your progress code.")) return;
      roles = []; progress = {}; save("gw-roles", null); save("gw-progress", null);
      location.hash = "welcome";
    });
  }
  function saveStrip() {
    return '<section class="save-strip" aria-label="Your progress code"><p><b>Saved in this browser.</b> To continue on another device, use your progress code.</p><div class="w-row"><code class="code-inline">' + prettyCode(encodeProgress()) + '</code><button type="button" class="btn small ghost" data-copy="code">Copy code</button><a class="btn small ghost" href="#progress">More options</a></div><p class="copy-msg" data-copy-msg role="status" aria-live="polite"></p></section>';
  }

  var resumeTo = null;

  /* ---------- role picker: the first step, up to three roles ---------- */
  function renderRolePicker() {
    var pick = load("gw-pick", null), first = !roles.length, note = "";
    save("gw-pick", null);
    var picked = roles.slice();
    if (pick && roleInfo(pick) && picked.indexOf(pick) < 0) {
      if (pick === "general") picked = ["general"];
      else { picked = picked.filter(function (x) { return x !== "general"; }); if (picked.length < MAXR) picked.push(pick); }
    }
    // Compact picker: one row of role chips per family, a short sticky summary beside it.
    function chip(r) {
      var t = r === GENERAL ? "" : trackName(trackIdOf(r.id));
      return '<button type="button" class="rchip' + (r === GENERAL ? " gen" : "") + '" role="checkbox" aria-checked="false" data-r="' + r.id + '"' + (t ? ' title="' + esc(t) + ' track"' : "") +
        ' data-find="' + esc((r.name + " " + t).toLowerCase()) + '"><span class="rchip-n" aria-hidden="true"></span>' + esc(r.name) + "</button>";
    }
    var h = '<div class="pk">';
    h += '<p class="pick-top"><a class="back" href="' + (first ? "#welcome" : "#home") + '">Back</a></p>';
    h += '<header class="pk-head"><div><h1>Choose your roles</h1><p>Up to three. Your first pick is your main role.</p></div>';
    h += '<div class="w pk-find"><label class="sr-only" for="pick-q">Find a role</label><input type="search" id="pick-q" placeholder="Find a role" autocomplete="off"></div></header>';
    h += '<div class="pk-layout"><div class="pk-main" role="group" aria-label="Roles, choose up to three">';
    h += '<div class="pk-fam pk-gen"><h2>Not sure yet</h2><div class="pk-chips">' + chip(GENERAL) + "</div></div>";
    GW.families.forEach(function (f) {
      h += '<div class="pk-fam" data-fam="' + f.id + '"><h2>' + esc(f.name) + '</h2><div class="pk-chips">' + GW.roles.filter(function (r) { return r.family === f.id; }).map(chip).join("") + "</div></div>";
    });
    h += '<p class="gloss-empty pick-none" hidden>No roles match. Try a shorter word.</p></div>';
    h += '<aside class="pk-side" aria-labelledby="ps-h"><h2 id="ps-h" tabindex="-1">Your path</h2><div id="pick-chosen"></div><div id="pick-path"></div><p class="pk-note" id="pk-note" aria-live="polite"></p><button class="btn pill dark pk-go" id="pk-go2"></button></aside></div>';
    h += '<div class="pick-bar pk-bar"><p id="pick-sum" aria-live="polite"></p><a class="btn small ghost pick-review" href="#ps-h">Review</a><button class="btn small pill dark" id="pick-go"></button></div></div>';
    var view = $("#view"); view.innerHTML = h;

    function paint() {
      var gen = picked[0] === "general";
      $$(".rchip", view).forEach(function (b) {
        var i = picked.indexOf(b.getAttribute("data-r"));
        b.setAttribute("aria-checked", String(i > -1));
        $(".rchip-n", b).textContent = i < 0 ? "" : gen ? "✓" : String(i + 1);
      });
      var chosen = $("#pick-chosen", view), pathBox = $("#pick-path", view), sum = $("#pick-sum", view);
      if (!picked.length) chosen.innerHTML = '<p class="ps-empty">Pick the roles closest to your work.</p>';
      else chosen.innerHTML = '<ol class="pk-list">' + picked.map(function (id, i) {
        var nm = esc(roleInfo(id).name);
        return '<li><span class="pk-i">' + (gen ? "✓" : i + 1) + "</span><b>" + nm + "</b>" + (i === 0 || gen ? "" : '<button type="button" class="linkish" data-main="' + id + '" aria-label="Make ' + nm + ' your main role">Make main</button>') + '<button type="button" class="pk-x" data-remove="' + id + '" aria-label="Remove ' + nm + '">×</button></li>';
      }).join("") + "</ol>";
      if (picked.length) {
        var ids = routeFor(picked), extra = ids.slice(coreLast, -1);
        var track = gen ? [] : extra.filter(function (id) { return byId[id].rid === trackIdOf(picked[0]); }), also = extra.filter(function (id) { return track.indexOf(id) < 0; });
        var row = function (k, n) { return "<li><span>" + k + "</span><b>" + n + "</b></li>"; };
        var p = '<ul class="pk-route">' + row("Core lessons", coreLast);
        if (track.length) p += row(esc(trackName(trackIdOf(picked[0]))) + " track", track.length);
        also.forEach(function (id) { p += row(esc(trackName(byId[id].rid)) + ", first lesson", 1); });
        p += row("Capstone", 1) + '</ul><p class="pk-total"><b>' + plural(ids.length, "lesson") + "</b>, about " + hours(ids) + "</p>";
        pathBox.innerHTML = p;
        sum.innerHTML = note ? esc(note) : "<b>" + esc(pathName(picked)) + "</b><span>" + plural(ids.length, "lesson") + ", about " + hours(ids) + "</span>";
      } else { pathBox.innerHTML = ""; sum.textContent = note || "Choose at least one role"; }
      $("#pk-note", view).textContent = note;
      [$("#pick-go", view), $("#pk-go2", view)].forEach(function (go) { go.disabled = !picked.length; go.textContent = first ? "Start the course" : "Save roles"; });
      $(".pick-review", view).hidden = !picked.length;
    }
    paint();

    $("#pick-q", view).addEventListener("input", function (e) {
      var q = e.target.value.toLowerCase().trim(), any = false;
      $$(".pk-fam[data-fam]", view).forEach(function (f) {
        var shown = 0;
        $$(".rchip", f).forEach(function (c) { var hit = !q || c.getAttribute("data-find").indexOf(q) > -1; c.hidden = !hit; if (hit) shown++; });
        f.hidden = !shown; if (shown) any = true;
      });
      $(".pk-gen", view).hidden = !!q;
      $(".pick-none", view).hidden = any;
    });
    $(".pk-main", view).addEventListener("click", function (e) {
      var b = e.target.closest(".rchip"); if (!b) return;
      var id = b.getAttribute("data-r"), i = picked.indexOf(id); note = "";
      if (i > -1) picked.splice(i, 1);
      else if (id === "general") picked = ["general"];
      else {
        picked = picked.filter(function (x) { return x !== "general"; });
        if (picked.length >= MAXR) note = "Up to three roles. Remove one to add another.";
        else picked.push(id);
      }
      paint();
    });
    $(".pick-review", view).addEventListener("click", function (e) { e.preventDefault(); var hd = $("#ps-h", view); hd.scrollIntoView({ block: "start" }); hd.focus({ preventScroll: true }); });
    $(".pk-side", view).addEventListener("click", function (e) {
      var m = e.target.closest("[data-main]"), r = e.target.closest("[data-remove]"); note = "";
      if (m) { var id = m.getAttribute("data-main"); picked.splice(picked.indexOf(id), 1); picked.unshift(id); paint(); var nb = $('[data-remove="' + id + '"]', view); if (nb) nb.focus(); }
      else if (r) { picked.splice(picked.indexOf(r.getAttribute("data-remove")), 1); paint(); $("#ps-h", view).focus(); }
    });
    function goOn() {
      if (!picked.length) return;
      roles = picked.slice(); persist();
      var go = resumeTo || "home"; resumeTo = null; location.hash = go;
    }
    $("#pick-go", view).addEventListener("click", goOn);
    $("#pk-go2", view).addEventListener("click", goOn);
  }

  /* ---------- course home (signed in) ---------- */
  // Two views: the learner's path, grouped by stage and numbered by position, or the full library by part.
  var homeScope = load("gw-homescope", "path");
  function pathRow(id, pos, next) {
    var l = byId[id], done = progress[id], isNext = id === next;
    return '<li><a class="' + (done ? "done" : "") + (isNext ? " next" : "") + '" href="#' + id + '"><span class="n">' + l.num + '</span><span><span class="t">' + esc(l.title) + '</span><span class="s">' + esc(l.summary) + '</span></span><span class="st">' + (done ? "Completed" : isNext ? "Up next, " + l.minutes + "\u00a0min" : l.minutes + "\u00a0min") + "</span></a></li>";
  }
  function renderHome() {
    var path = routeFor(roles), n = doneOf(path), gen = roles[0] === "general", main = roleInfo(roles[0]) || GENERAL;
    var next = path.filter(function (id) { return !progress[id]; })[0], pos = next ? path.indexOf(next) + 1 : path.length;
    var left = path.filter(function (id) { return !progress[id]; });
    var h = '<div class="home">';
    if (notice) { h += '<p class="notice" role="status">' + esc(notice) + "</p>"; notice = ""; }
    h += '<section class="dash2"><p class="kicker">Your path: ' + esc(pathLong(roles)) + "</p>";
    h += "<h1>" + (!next ? "Path complete" : n ? "You're on step " + pos + " of " + path.length : "Start your path") + "</h1>";
    h += '<div class="pbar" aria-label="Progress on your path"><span class="pbar-track"><i style="width:' + Math.round(100 * n / path.length) + '%"></i></span><span class="pbar-t">' + n + " of " + path.length + " done" + (left.length ? ", about " + hours(left) + " left" : "") + "</span></div>";
    if (next) {
      var nl = byId[next];
      h += '<a class="upnext" href="#' + next + '"><span class="un-k">Up next: lesson ' + nl.num + ", " + nl.minutes + '\u00a0min</span><b>' + esc(nl.title) + '</b><span class="un-s">' + esc(nl.summary) + '</span><span class="btn pill dark">' + (n ? "Continue lesson" : "Start lesson") + "</span></a>";
    } else h += '<a class="upnext" href="#team-adoption"><span class="un-k">All ' + path.length + ' lessons done</span><b>Revisit the capstone, or explore the full library</b><span class="btn pill dark">Open the capstone</span></a>';
    h += '</section>';

    h += '<div class="home-views"><div class="seg" role="group" aria-label="Which lessons to show"><button type="button" data-homescope="path" aria-pressed="' + (homeScope === "path") + '">Your path (' + path.length + ')</button><button type="button" data-homescope="all" aria-pressed="' + (homeScope === "all") + '">Full library (' + GW.lessons.length + ")</button></div>" + '<p class="dash-links"><a class="linkish" href="#role">Change roles</a><button type="button" class="linkish" data-open-search>Search lessons and terms</button></p></div>';

    if (homeScope === "path") {
      var track = gen ? [] : path.filter(function (id) { return byId[id].rid === trackIdOf(roles[0]); });
      var also = path.slice(coreLast, -1).filter(function (id) { return track.indexOf(id) < 0; });
      var stages = [
        { h: "Core lessons", p: "For everyone: how models work, and how to work with them.", ids: path.slice(0, coreLast) },
        { h: esc(trackName(trackIdOf(main.id))) + " track", p: main.track && main.track !== main.id ? "The track your main role uses, in order." : "Your main role's lessons, in order.", ids: track },
        { h: "Also recommended", p: roles.length === 1 ? esc(main.why) : "The first lesson for each of your other roles.", ids: also },
        { h: "Capstone", p: "Bring AI into a team deliberately.", ids: ["team-adoption"] }
      ];
      stages.forEach(function (s) {
        if (!s.ids.length) return;
        var d = doneOf(s.ids);
        h += '<section class="stage"><div class="stage-h"><h2>' + s.h + '</h2><p>' + s.p + '</p><span class="stage-n">' + meter(d / s.ids.length, 14) + (d === s.ids.length ? "Done" : d + " of " + plural(s.ids.length, "lesson")) + '</span></div><ol class="contents path">' + s.ids.map(function (id) { return pathRow(id, path.indexOf(id) + 1, next); }).join("") + "</ol></section>";
      });
    } else {
      h += '<section><p class="lib-note">' + courseSize + ". Every lesson stays open to you; lessons on your path are marked.</p><div class=\"parts\">";
      GW.parts.forEach(function (p) {
        var ls = GW.lessons.filter(function (l) { return l.part === p.id; });
        var groups = [];
        ls.forEach(function (l) { var g = groups[groups.length - 1]; if (l.role && g && g.role === l.role) g.ls.push(l); else groups.push({ role: l.role, ls: [l] }); });
        var body = ls.some(function (l) { return l.role; }) ? groups.map(function (g) { return '<h3 class="role-sub">' + esc(g.role) + '</h3><ol class="contents">' + g.ls.map(function (l) { return lessonRow(l, path, true); }).join("") + "</ol>"; }).join("") : '<ol class="contents">' + ls.map(function (l) { return lessonRow(l, path); }).join("") + "</ol>";
        h += '<div class="part"><div class="part-h"><h2>' + esc(p.title) + "</h2><p>" + esc(p.blurb) + '</p><span class="pn-count">' + plural(ls.length, "lesson") + '</span></div><div class="part-b">' + body + "</div></div>";
      });
      h += "</div></section>";
    }
    h += "</div>";
    $("#view").innerHTML = h;
  }

  /* ---------- exercises tab: every hands-on activity, grouped by lesson ---------- */
  var EX_KIND = { claims: "Flag the claims", sort: "Sort the cases", tokens: "Tokenizer", sampler: "Sampler", context: "Context window", rerank: "Retrieval", matrix: "Risk matrix", injection: "Prompt injection", evalsim: "Eval simulator", coverage: "Test coverage", contrast: "Contrast check", codetest: "Run the code", checklist: "Checklist", builder: "Prompt builder", agreement: "Agreement check", agent: "Agent loop", scenario: "Scenario", decide: "Make the call", sim: "Simulation" };
  // four families keep the Exercises filters short
  var EX_FAM = {}; [["Spot the problem", "claims contrast coverage injection"], ["Sort and decide", "sort decide matrix scenario agreement"], ["Simulations", "tokens sampler context rerank agent sim evalsim codetest"], ["Write and apply", "builder checklist"]].forEach(function (f) { f[1].split(" ").forEach(function (w) { EX_FAM[w] = f[0]; }); });
  var FAM_IC = { "Spot the problem": "search", "Sort and decide": "split", "Simulations": "sim", "Write and apply": "pencil" };
  var exIndex = null, exScope = load("gw-exscope", "path");
  function exercises() {
    if (exIndex) return exIndex;
    exIndex = [];
    GW.lessons.forEach(function (l) {
      var c = GW.content[l.id]; if (!c) return;
      c.html.split('<div class="activity">').slice(1).forEach(function (chunk, i) {
        var m = function (re, d) { var r = chunk.match(re); return r ? r[1] : d; };
        exIndex.push({ lesson: l, n: i + 1, tag: m(/class="tag">([^<]*)</, "Practice"), title: m(/class="ttl">([^<]*)</, "Exercise"), w: m(/data-w="([a-z-]+)"/, ""), kind: EX_KIND[m(/data-w="([a-z-]+)"/, "")] || "" });
      });
    });
    return exIndex;
  }
  // Exercises tab: a dashboard (progress, up next, kinds) over a filterable problem list, in the exercise theme.
  var exStatus = "all", exKind = "all";
  function renderExercises() {
    var path = routeFor(roles), all = exercises();
    all.forEach(function (e) { e.k = EX_FAM[e.w] || "Write and apply"; });
    var scoped = exScope === "path" ? all.filter(function (e) { return path.indexOf(e.lesson.id) > -1; }) : all;
    var done = scoped.filter(function (e) { return progress[e.lesson.id]; }).length;
    var next = scoped.filter(function (e) { return !progress[e.lesson.id]; })[0];
    var kinds = {}; scoped.forEach(function (e) { kinds[e.k] = (kinds[e.k] || 0) + 1; });
    var kindList = Object.keys(kinds).sort(function (a, b) { return kinds[b] - kinds[a] || a.localeCompare(b); });
    if (exKind !== "all" && !kinds[exKind]) exKind = "all";
    var list = scoped.filter(function (e) { return (exKind === "all" || e.k === exKind) && (exStatus === "all" || (exStatus === "done") === !!progress[e.lesson.id]); });
    var chev = '<svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="M2 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var h = '<div class="tabpage exd"><header class="exd-head"><div><h1>Exercises</h1><p class="lede">Hands-on practice from every lesson. Each one gives feedback as you work.</p></div>';
    h += '<div class="seg" role="group" aria-label="Which exercises to show"><button type="button" data-exscope="path" aria-pressed="' + (exScope === "path") + '">Your path</button><button type="button" data-exscope="all" aria-pressed="' + (exScope === "all") + '">All lessons</button></div></header>';
    h += '<div class="exd-dash">';
    h += '<section class="exd-card exd-prog" aria-label="Progress"><p class="exd-k">' + GW.icon("trend") + 'Progress</p><p class="exd-big"><b>' + done + '</b><span>of ' + scoped.length + ' done</span></p><div class="exd-bar"><span style="width:' + (scoped.length ? done / scoped.length * 100 : 0) + '%"></span></div><p class="exd-s">Counted when you complete the lesson an exercise belongs to.</p></section>';
    h += '<section class="exd-card exd-next" aria-label="Up next"><p class="exd-k">' + GW.icon("play") + 'Up next</p>' + (next ? "<b>" + next.title + '</b><p class="exd-s">Lesson ' + next.lesson.num + " · " + esc(next.lesson.title) + " · " + esc(next.k) + '</p><a class="btn pill exd-go" href="#' + next.lesson.id + '" data-scroll="ex-' + next.n + '">' + GW.icon("flask") + 'Start the exercise</a>' : '<b>All done</b><p class="exd-s">Every exercise in this view belongs to a completed lesson.</p>') + "</section>";
    h += '<section class="exd-card exd-kinds" aria-label="Kinds of exercise"><p class="exd-k">' + GW.icon("grid") + plural(kindList.length, "kind") + ' of exercise</p><div class="exd-chips" role="group" aria-label="Filter by kind"><button type="button" data-exkind="all" aria-pressed="' + (exKind === "all") + '">' + GW.icon("list") + 'All <i>' + scoped.length + "</i></button>" + kindList.map(function (k) { return '<button type="button" data-exkind="' + esc(k) + '" aria-pressed="' + (exKind === k) + '">' + GW.icon(FAM_IC[k]) + esc(k) + " <i>" + kinds[k] + "</i></button>"; }).join("") + "</div></section>";
    h += "</div>";
    if (GW.ext) h += GW.ext.exercisesHtml();
    h += '<div class="exd-bar2"><div class="seg" role="group" aria-label="Filter by status">' + [["all", "All"], ["todo", "To do"], ["done", "Done"]].map(function (x) { return '<button type="button" data-exstatus="' + x[0] + '" aria-pressed="' + (exStatus === x[0]) + '">' + x[1] + "</button>"; }).join("") + '</div><p class="ex-count" aria-live="polite">' + plural(list.length, "exercise") + "</p></div>";
    h += '<ol class="exd-list">';
    list.forEach(function (e) {
      var d = !!progress[e.lesson.id];
      h += '<li><a class="exd-row' + (d ? " done" : "") + '" href="#' + e.lesson.id + '" data-scroll="ex-' + e.n + '"><span class="exd-st" aria-label="' + (d ? "Done" : "To do") + '">' + (d ? GW.icon("check") : "") + '</span><span class="exd-t"><b>' + e.title + '</b><span>Lesson ' + e.lesson.num + " · " + esc(e.lesson.title) + '</span></span><span class="exd-kd">' + GW.icon(FAM_IC[e.k]) + esc(e.kind || e.k) + "</span>" + chev + "</a></li>";
    });
    h += "</ol>" + (list.length ? "" : '<p class="gloss-empty">No exercises match these filters.</p>') + "</div>";
    $("#view").innerHTML = h;
    $$("[data-exkind]").forEach(function (b) { b.addEventListener("click", function () { exKind = b.getAttribute("data-exkind"); renderExercises(); var f = $('[data-exkind="' + exKind + '"]'); if (f) f.focus(); }); });
    $$("[data-exstatus]").forEach(function (b) { b.addEventListener("click", function () { exStatus = b.getAttribute("data-exstatus"); renderExercises(); var f = $('[data-exstatus="' + exStatus + '"]'); if (f) f.focus(); }); });
  }

  /* ---------- use cases tab: concrete ways each role uses AI, rated for fit ---------- */
  var FIT = { good: ["good", "Good fit"], care: ["care", "Use with care"], human: ["human", "Keep human"] };
  // A finder: role scope, fit level and a text filter. Only the results repaint, so typing keeps focus.
  var ucScope = load("gw-ucscope", "mine"), ucFit = load("gw-ucfit", "all"), ucQ = "";
  function renderUseCases() {
    var gen = !roles.length || roles[0] === "general";
    var h = '<div class="tabpage"><header class="tp-head"><h1>Use cases</h1><p class="lede">Concrete ways people in each role use AI at work, how well each fits, and what to check before you rely on the result.</p>';
    h += '<div class="uc-filters">';
    if (!gen) h += '<div class="seg" role="group" aria-label="Which roles to show"><button type="button" data-ucscope="mine" aria-pressed="' + (ucScope === "mine") + '">Your roles</button><button type="button" data-ucscope="all" aria-pressed="' + (ucScope === "all") + '">All roles</button></div>';
    h += '<div class="seg" role="group" aria-label="Filter by fit">' + [["all", "Any fit"], ["good", "Good fit"], ["care", "Use with care"], ["human", "Keep human"]].map(function (x) { return '<button type="button" data-ucfit="' + x[0] + '" aria-pressed="' + (ucFit === x[0]) + '">' + x[1] + "</button>"; }).join("") + "</div>";
    h += '<div class="w uc-find"><label class="sr-only" for="uc-q">Find a use case</label><input type="search" id="uc-q" placeholder="Find a task, e.g. tests, interviews, incidents" value="' + esc(ucQ) + '" aria-describedby="uc-count"></div></div>';
    h += '<p class="ex-count" id="uc-count" aria-live="polite"></p></header><div id="uc-body"></div></div>';
    $("#view").innerHTML = h;
    paintUseCases();
    $("#uc-q").addEventListener("input", function (e) { ucQ = e.target.value; paintUseCases(); });
  }
  function paintUseCases() {
    var gen = !roles.length || roles[0] === "general", mine = gen ? [] : uniq(roles.map(trackIdOf));
    var scope = gen ? "all" : ucScope;
    var order = scope === "mine" ? mine : mine.concat(GW.tracks.map(function (t) { return t.id; }).filter(function (r) { return mine.indexOf(r) < 0; }));
    var list = GW.useCases || [], words = ucQ.toLowerCase().trim().split(/\s+/).filter(Boolean), count = 0, nRoles = 0, body = "";
    var hit = function (u) {
      if (ucFit !== "all" && u.fit !== ucFit) return false;
      var hay = (u.t + " " + u.d + " " + u.c + " " + trackName(u.r)).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    };
    order.forEach(function (r) {
      var items = list.filter(function (u) { return u.r === r && hit(u); }); if (!items.length) return;
      count += items.length; nRoles += 1;
      body += '<section class="uc-group" aria-labelledby="ucg-' + r + '"><h2 class="ex-l" id="ucg-' + r + '"><span>' + trackSpan(r) + "</span>" + esc(trackName(r)) + '</h2><div class="uc-grid">';
      items.forEach(function (u) {
        var f = FIT[u.fit], l = byId[u.l];
        var g = GW.ucGuides && GW.ucGuides[u.t];
        body += '<article class="uc-card" id="uc-' + list.indexOf(u) + '"><span class="fit ' + f[0] + '">' + GW.icon(f[0]) + f[1] + "</span><h3>" + esc(u.t) + "</h3><p>" + esc(u.d) + '</p><p class="uc-check"><b>Check:</b> ' + esc(u.c) + "</p>" + (g ? '<a class="uc-open" href="#usecase/' + slug(u.t) + '">' + GW.icon("steps") + "Open the guide" + GW.icon("arrow", "go") + '<span>' + g.s.length + " steps · do’s and don’ts" + (g.p ? " · starter prompt" : "") + "</span></a>" : "") + (l ? '<a class="uc-link" href="#' + l.id + '">' + GW.icon("book") + '<span><b>Lesson ' + l.num + "</b> " + esc(l.title) + "</span></a>" : "") + "</article>";
      });
      body += "</div></section>";
    });
    if (!count) body = '<p class="gloss-empty">No use cases match. Try a shorter word, another fit level' + (scope === "mine" ? ", or all roles" : "") + '. <button type="button" class="linkish" data-ucreset>Clear the filters</button></p>';
    $("#uc-count").textContent = plural(count, "use case") + (count ? " across " + plural(nRoles, "role") : "");
    $("#uc-body").innerHTML = body;
  }

  // One use case as a full guide: steps, a prompt to start from, do's and don'ts, a tip and the limits.
  function renderUseCase(key) {
    var list = GW.useCases || [], u = list.filter(function (x) { return slug(x.t) === key; })[0];
    if (!u) { location.replace("#usecases"); return false; }
    var g = (GW.ucGuides || {})[u.t] || { s: [], y: [], n: [], k: [] }, f = FIT[u.fit], l = byId[u.l];
    var same = list.filter(function (x) { return x.r === u.r; }), i = same.indexOf(u), prev = same[i - 1], next = same[i + 1];
    var li = function (a) { return (a || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
    var h = '<article class="ucg"><p class="pick-top"><a class="back" href="#usecases">All use cases</a></p>';
    h += '<header class="ucg-head"><p class="lo-eye">' + esc(trackName(u.r)) + " · use case " + (i + 1) + " of " + same.length + '</p><h1>' + esc(u.t) + '</h1><p class="lede">' + esc(u.d) + "</p>";
    h += '<div class="ucg-facts"><div><span>Fit</span><b class="fit ' + f[0] + '">' + GW.icon(f[0]) + f[1] + "</b></div><div><span>Steps</span><b>" + GW.icon("steps") + g.s.length + "</b></div>" + (l ? '<div><span>Covered in</span><a href="#' + l.id + '">' + GW.icon("book") + 'Lesson ' + l.num + ": " + esc(l.title) + "</a></div>" : "") + "</div></header>";
    h += '<div class="ucg-grid"><div class="ucg-main"><section aria-labelledby="ucg-s"><h2 id="ucg-s">' + GW.icon("steps") + 'Step by step</h2><ol class="ucg-steps">' + li(g.s) + "</ol></section>";
    if (g.p) h += '<section class="draft prompt ucg-prompt" aria-labelledby="ucg-p"><div class="draft-h"><span id="ucg-p">' + GW.icon("terminal") + 'A prompt to start from</span><button type="button" class="copy-btn" id="ucg-copy">Copy</button></div><div class="draft-b">' + esc(g.p) + "</div></section>";
    h += '<section aria-labelledby="ucg-c"><h2 id="ucg-c">' + GW.icon("shield") + 'Before you rely on it</h2><p class="ucg-check">' + esc(u.c) + "</p></section></div>";
    h += '<aside class="ucg-side"><section class="ucg-box do"><h2>' + GW.icon("good") + 'Do</h2><ul>' + li(g.y) + '</ul></section><section class="ucg-box dont"><h2>' + GW.icon("x") + 'Don’t</h2><ul>' + li(g.n) + "</ul></section>";
    if (g.t) h += '<section class="ucg-box tip"><h2>' + GW.icon("bulb") + 'Tip</h2><p>' + esc(g.t) + "</p></section>";
    if (g.k && g.k.length) h += '<section class="ucg-box lim"><h2>' + GW.icon("care") + 'Limits</h2><ul>' + li(g.k) + "</ul></section>";
    h += "</aside></div>";
    h += '<nav class="pn ucg-pn" aria-label="More use cases">' + (prev ? '<a class="prev" href="#usecase/' + slug(prev.t) + '"><span>Previous</span><b>' + esc(prev.t) + "</b></a>" : "") + (next ? '<a class="next" href="#usecase/' + slug(next.t) + '"><span>Next in ' + esc(trackName(u.r)) + "</span><b>" + esc(next.t) + "</b></a>" : '<a class="next" href="#usecases"><span>End of ' + esc(trackName(u.r)) + "</span><b>All use cases</b></a>") + "</nav></article>";
    $("#view").innerHTML = h;
    var cb = $("#ucg-copy"); if (cb) cb.addEventListener("click", function () { copyText(g.p, function (ok) { cb.textContent = ok ? "Copied" : "Couldn't copy"; setTimeout(function () { cb.textContent = "Copy"; }, 1600); }); });
  }
  function useCaseTitle(key) { var u = (GW.useCases || []).filter(function (x) { return slug(x.t) === key; })[0]; return u ? u.t : "Use case"; }

  /* ---------- glossary page ---------- */
  function renderGlossary() {
    var keys = Object.keys(GW.glossary).sort(function (a, b) { return GW.glossary[a][0].localeCompare(GW.glossary[b][0]); });
    var h = '<div class="gloss tabpage"><h1>Glossary</h1><p class="lede">Every term the course relies on, in plain words. Each entry links to the lesson that explains it properly.</p>';
    h += '<div class="w filter"><label for="gloss-filter">Filter terms</label><div class="gf-row"><input type="search" id="gloss-filter" placeholder="e.g. token, injection, eval" aria-describedby="gloss-count"><button type="button" class="btn small ghost" id="gloss-clear" hidden>Clear</button></div><p class="gloss-count" id="gloss-count" aria-live="polite">' + keys.length + ' terms</p></div><p class="gloss-empty" hidden>No terms match. Try a shorter word, or <button type="button" class="linkish" data-gclear>clear the filter</button>.</p><dl>';
    keys.forEach(function (k) {
      var g = GW.glossary[k];
      h += '<dt id="term-' + k + '" data-k="' + k + '">' + esc(g[0]) + '</dt><dd data-k="' + k + '">' + esc(g[1]) + (g[2] ? '<a class="see" href="#' + g[2] + '">Explained in: ' + esc(byId[g[2]].title) + "</a>" : "") + "</dd>";
    });
    h += "</dl></div>";
    $("#view").innerHTML = h;
    var gf = $("#gloss-filter");
    function filterGloss() {
      var q = gf.value.toLowerCase().trim(), shown = 0;
      keys.forEach(function (k) {
        var g = GW.glossary[k], hit = !q || (g[0] + " " + g[1]).toLowerCase().indexOf(q) > -1;
        if (hit) shown += 1;
        $$('[data-k="' + k + '"]').forEach(function (el) { el.hidden = !hit; });
      });
      $("#gloss-count").textContent = q ? shown + " of " + keys.length + " terms" : keys.length + " terms";
      $(".gloss-empty").hidden = shown > 0;
      $("#gloss-clear").hidden = !q;
    }
    function clearGloss() { gf.value = ""; filterGloss(); gf.focus(); }
    gf.addEventListener("input", filterGloss);
    $("#gloss-clear").addEventListener("click", clearGloss);
    $("[data-gclear]").addEventListener("click", clearGloss);
    if (pendingTerm) {
      var dt = document.getElementById("term-" + pendingTerm); pendingTerm = null;
      if (dt) { dt.scrollIntoView({ block: "center" }); dt.classList.add("flash"); setTimeout(function () { dt.classList.remove("flash"); }, 1800); }
    }
  }

  /* ---------- lesson ---------- */
  function slug(t) { return t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48); }
  function roleExample(id) {
    var set = GW.roleEx && GW.roleEx[id]; if (!set) return "";
    var seen = [], list = roles.filter(function (r) { var t = trackIdOf(r); if (r === "general" || !set[t] || seen.indexOf(t) > -1) return false; seen.push(t); return true; });
    if (list.length < 2) {
      var info = list.length ? roleInfo(list[0]) : GENERAL, gen = info === GENERAL;
      return '<aside class="role-ex" aria-label="Example for your role"><div class="role-ex-h"><span class="tag">' + (gen ? "Example" : "In your role") + "</span><b>" + (gen ? "For any role" : esc(info.name)) + '</b><a href="#role">Change roles</a></div><p>' + (gen ? set.general : set[trackIdOf(info.id)]) + "</p></aside>";
    }
    return '<aside class="role-ex" aria-label="Examples for your roles"><div class="role-ex-h"><span class="tag">In your roles</span><span class="rx-tabs" role="group" aria-label="Show the example for">' + list.map(function (r, i) {
      return '<button type="button" class="rx-btn" data-rx="' + r + '" aria-pressed="' + (i === 0) + '">' + esc(roleInfo(r).name) + "</button>";
    }).join("") + '</span><a href="#role">Change roles</a></div>' + list.map(function (r, i) { return '<p data-rx-p="' + r + '"' + (i ? " hidden" : "") + ">" + set[trackIdOf(r)] + "</p>"; }).join("") + "</aside>";
  }
  function renderLesson(id) {
    var l = byId[id], c = GW.content[id], path = routeFor(roles), onPath = path.indexOf(id) > -1;
    var seq = onPath ? path.map(function (x) { return byId[x]; }) : GW.lessons;
    var idx = seq.indexOf(l), prev = seq[idx - 1], next = seq[idx + 1];
    // Lesson overview first (what you'll learn, the plan, how long), so the reading never starts as a wall of text.
    var part = GW.parts.filter(function (p) { return p.id === l.part; })[0];
    var nEx = c.html.split('<div class="activity">').length - 1, nChk = (c.html.match(/class="check"/g) || []).length;
    var I = GW.icon, fact = function (ic, v) { return "<span>" + I(ic) + v + "</span>"; };
    var h = '<article class="lesson">';
    h += '<header class="lesson-head lo"><div class="lo-intro">';
    h += '<p class="lo-eye"><span class="lo-num">Lesson ' + l.num + "</span>" + esc(part.title) + (l.role ? " · " + esc(trackName(l.rid)) + " track, " + l.step + " of 3" : "") + "</p>";
    h += "<h1>" + esc(l.title) + "</h1>";
    h += '<p class="meta lo-facts">' + fact("clock", l.minutes + " min") + fact("list", '<b id="lo-nsec">–</b> sections') + (nEx ? fact("flask", plural(nEx, "exercise")) : "") + (nChk ? fact("help", plural(nChk, "quiz question")) : "") +
      (roles.length ? (onPath ? fact("steps", "Step " + (idx + 1) + " of " + seq.length) : '<span class="path-off">Not on your path</span>') : "") + (progress[id] ? '<span class="lo-done">' + I("good") + "Completed</span>" : "") + "</p>";
    h += '<p class="lede">' + c.lede + "</p>";
    h += '<div class="lo-actions"><button type="button" class="btn pill dark" id="lo-start">' + I("play") + (progress[id] ? "Review the lesson" : "Start the lesson") + "</button>" + (nEx ? '<button type="button" class="btn pill ghost" id="lo-ex">' + I("flask") + "Go to the exercises</button>" : "") + "</div></div>";
    h += '<section class="learn lo-learn" aria-labelledby="lo-learn"><h2 id="lo-learn">' + I("target") + 'You\'ll learn</h2><ul>' + c.outcomes.map(function (o) { return '<li><span class="box"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>' + o + "</span></li>"; }).join("") + "</ul></section>";
    h += '<section class="lo-plan" aria-labelledby="lo-planh"><h2 id="lo-planh">' + I("list") + 'Lesson plan<span class="lo-tot">' + l.minutes + ' min</span></h2><ol></ol></section>';
    h += '<details class="toc-m"><summary>On this page</summary><nav aria-label="On this page, compact"></nav></details></header>';
    h += '<div class="lsn-side"><nav class="toc" aria-label="On this page"><h2 class="toc-h">On this page</h2></nav></div>';
    var ex = roleExample(id), body = c.html;
    if (ex) body = body.indexOf('<section class="checks">') > -1 ? body.replace('<section class="checks">', ex + '<section class="checks">') : body + ex;
    var srcHtml = "", si = body.indexOf('<section class="sources">');
    if (si > -1) { var se = body.indexOf("</section>", si) + 10; srcHtml = body.slice(si, se); body = body.slice(0, si) + body.slice(se); }
    h += body;
    h += '<footer class="lesson-foot"><div class="complete-row"><p id="complete-msg"></p><button class="btn" id="complete-btn"></button></div><div class="pn">';
    if (prev) h += '<a class="prev" href="#' + prev.id + '"><span>Previous' + (onPath ? " on your path" : "") + "</span><b>" + esc(prev.title) + "</b></a>";
    if (next) h += '<a class="next" href="#' + next.id + '"><span>Next' + (onPath ? " on your path" : "") + "</span><b>" + esc(next.title) + "</b></a>";
    else h += '<a class="next" href="#home"><span>' + (onPath ? "End of your path" : "Finished") + "</span><b>Back to course home</b></a>";
    h += "</div></footer>" + srcHtml + "</article>";
    var view = $("#view"); view.innerHTML = h;
    var acts = $$(".activity", view);
    acts.forEach(function (a, i) {
      a.id = "ex-" + (i + 1);
      var hd = $(".activity-h", a), w = $("[data-w]", a), kind = w && EX_KIND[w.getAttribute("data-w")];
      if (hd) hd.insertAdjacentHTML("afterbegin", '<span class="ex-no">' + GW.icon("flask") + "Exercise " + (i + 1) + " of " + acts.length + "</span>" + (kind ? '<span class="ex-kd">' + esc(kind) + "</span>" : ""));
      a.insertAdjacentHTML("beforeend", '<p class="activity-f">End of exercise ' + (i + 1) + ". The lesson continues below.</p>");
    });

    // table of contents
    var toc = $(".toc", view), heads = $$(".lesson > h2, .lesson > section > h2", view);
    // the interactive figure follows the first paragraph of its section
    var fspec = GW.figures && GW.figures[id], figEl = GW.figure ? GW.figure(id) : null, figHead = null;
    if (figEl) {
      figHead = heads.filter(function (hd) { var nz = function (x) { return x.replace(/[’']/g, "'"); }; return nz(hd.textContent) === nz(fspec.at); })[0] || heads[0];
      var after = figHead.nextElementSibling && figHead.nextElementSibling.tagName === "P" ? figHead.nextElementSibling : figHead;
      after.parentNode.insertBefore(figEl, after.nextSibling);
    }
    planLesson(view, l, heads, figHead);
    heads.forEach(function (hd, k) {
      if (!hd.id) hd.id = slug(hd.textContent);
      var a = document.createElement("a"); a.href = "#" + id; a.textContent = hd.textContent; a.dataset.target = hd.id;
      a.addEventListener("click", function (e) { e.preventDefault(); hd.scrollIntoView({ behavior: "smooth", block: "start" }); });
      toc.appendChild(a);
      var b = document.createElement("a"); b.href = "#" + id; b.textContent = hd.textContent;
      b.addEventListener("click", function (e) { e.preventDefault(); $(".toc-m", view).open = false; hd.scrollIntoView({ behavior: "smooth", block: "start" }); });
      $(".toc-m nav", view).appendChild(b);
    });
    // citations: [n] jumps to the matching source
    var srcs = $$(".sources li", view);
    $$("sup", view).forEach(function (sup) {
      sup.innerHTML = sup.innerHTML.replace(/\[(\d+)\]/g, function (m, n) {
        return srcs[n - 1] ? '<a class="cite" href="#' + id + '" data-cite="' + n + '" aria-label="Source ' + n + '">[' + n + "]</a>" : m;
      });
    });
    $$(".cite", view).forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault(); var li = srcs[a.dataset.cite - 1];
        li.scrollIntoView({ behavior: "smooth", block: "center" }); li.classList.add("flash"); setTimeout(function () { li.classList.remove("flash"); }, 1800);
      });
    });
    var article = $(".lesson", view), lastK = -1, ticking = false;
    function onScroll() {
      if (!document.body.contains(article)) { window.removeEventListener("scroll", onScrollRaf); return; }
      var k = 0; heads.forEach(function (hd, j) { if (hd.getBoundingClientRect().top < 140) k = j; });
      if (k === lastK) return; lastK = k;
      $$(".toc a", view).forEach(function (a) { a.classList.toggle("on", a.dataset.target === heads[k].id); });
      paintReading(k);
    }
    function onScrollRaf() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); }
    window.addEventListener("scroll", onScrollRaf, { passive: true });

    // where the reader is: the strip, its label, and the outcomes reached so far
    var readAt = 0;
    function paintReading(k) {
      if (k < 0) return; readAt = Math.max(readAt, k);
      $$(".lo-plan li", view).forEach(function (li, j) { li.classList.toggle("done", j < readAt); li.classList.toggle("cur", j === k); });
      var outs = $$(".learn li", view), n = outs.length, H = heads.length;
      outs.forEach(function (li, i) { li.classList.toggle("on", !!progress[id] || readAt + 1 >= Math.ceil((i + 1) * H / n)); });
      if (GW.ext && heads[k]) GW.ext.reading(id, k, heads[k].id);
    }
    paintReading(0);

    // completion
    function paintComplete() {
      var b = $("#complete-btn"), m = $("#complete-msg");
      if (progress[id]) { b.textContent = "Completed ✓"; b.classList.add("done"); m.innerHTML = 'Marked as complete and saved in this browser. To continue on another device, use your <a href="#progress">progress code</a>.'; }
      else { b.textContent = "Mark lesson complete"; b.classList.remove("done"); m.textContent = "Worked through the activities and the checks? Mark the lesson complete to track your progress."; }
    }
    paintComplete();
    $("#complete-btn").addEventListener("click", function () {
      if (progress[id]) delete progress[id]; else progress[id] = true;
      persist(); paintComplete(); renderRail(id); paintReading(readAt);
    });

    $("#lo-start", view).addEventListener("click", function () { if (heads[0]) heads[0].scrollIntoView({ behavior: "smooth", block: "start" }); });
    if ($("#lo-ex", view)) $("#lo-ex", view).addEventListener("click", function () { acts[0].scrollIntoView({ behavior: "smooth", block: "start" }); });
    enhance(view);
    var fromLink = !!pendingSection;
    if (pendingSection) {
      var t = document.getElementById(pendingSection); pendingSection = null;
      if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 30);
    }
    if (GW.ext) GW.ext.lessonMount(view, id, heads, fromLink || !!pendingScroll);
  }

  // The lesson plan: every section with what kind of step it is and roughly how long it takes.
  var PLAN_IC = { Reading: "book", Example: "bulb", Exercise: "flask", Quiz: "help", Task: "task" };
  function planLesson(view, l, heads, figHead) {
    var rows = heads.map(function (hd) {
      var nodes = [], n = hd.parentNode.tagName === "SECTION" ? null : hd.nextElementSibling;
      if (hd.parentNode.tagName === "SECTION") nodes = [hd.parentNode];
      while (n && n.tagName !== "H2" && !(n.tagName === "SECTION" && n.querySelector(":scope > h2"))) { nodes.push(n); n = n.nextElementSibling; }
      var words = 0, acts = 0;
      nodes.forEach(function (x) { words += (x.textContent || "").split(/\s+/).length; acts += x.matches(".activity") ? 1 : x.querySelectorAll(".activity").length; });
      var t = hd.textContent, kind = acts || /^Practice/.test(t) ? "Exercise" : /^Check your/.test(t) ? "Quiz" : /^Try it/.test(t) ? "Task" : /^Worked example|^Capstone/.test(t) ? "Example" : "Reading";
      return { hd: hd, kind: kind, w: words / 200 + acts * 4 + (kind === "Quiz" ? 2 : 0) };
    });
    var tot = rows.reduce(function (a, r) { return a + r.w; }, 0) || 1;
    $("#lo-nsec", view).textContent = rows.length;
    $(".lo-plan ol", view).innerHTML = rows.map(function (r, i) {
      return '<li class="k-' + r.kind.toLowerCase() + '"><button type="button" data-k="' + i + '"><span class="n">' + (i + 1) + '</span><span class="t">' + esc(r.hd.textContent) + (r.hd === figHead ? '<i class="fig-dot" title="Interactive figure">' + GW.icon("chart") + "</i>" : "") + '</span><span class="kd">' + GW.icon(PLAN_IC[r.kind]) + r.kind + '</span><span class="mn">' + Math.max(1, Math.round(r.w / tot * l.minutes)) + " min</span></button></li>";
    }).join("");
    $$(".lo-plan button", view).forEach(function (b) { b.addEventListener("click", function () { rows[+b.getAttribute("data-k")].hd.scrollIntoView({ behavior: "smooth", block: "start" }); }); });
  }

  /* ---------- enhancements: checks, terms, widgets ---------- */
  function enhance(root) {
    $$(".check", root).forEach(function (box) {
      var ans = parseInt(box.getAttribute("data-a"), 10), lis = $$("li", box), opts = document.createElement("div");
      opts.className = "opts"; opts.setAttribute("role", "group");
      var fb = document.createElement("div"); fb.className = "fb"; fb.hidden = true; fb.setAttribute("aria-live", "polite");
      lis.forEach(function (li, i) {
        var b = document.createElement("button"); b.className = "opt"; b.type = "button";
        b.innerHTML = '<span class="ltr">' + "ABCDEF"[i] + "</span><span>" + li.innerHTML + "</span>";
        b.addEventListener("click", function () {
          $$(".opt", opts).forEach(function (o) { o.classList.remove("right", "wrong"); });
          var ok = i === ans; b.classList.add(ok ? "right" : "wrong");
          fb.hidden = false; fb.className = "fb " + (ok ? "right" : "wrong");
          fb.innerHTML = "<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + (li.getAttribute("data-fb") || "") + (ok ? "" : " Try another answer.");
        });
        opts.appendChild(b);
      });
      $("ul", box).replaceWith(opts); box.appendChild(fb);
    });
    $$(".term", root).forEach(function (t) {
      t.setAttribute("tabindex", "0"); t.setAttribute("role", "button");
      t.setAttribute("aria-label", t.textContent + ": show definition");
    });
    $$("[data-w]", root).forEach(function (el) {
      var fn = GW.widgets && GW.widgets[el.getAttribute("data-w")];
      if (fn) { try { fn(el); } catch (e) { el.textContent = "This activity could not load"; console.error(e); } }
    });
  }

  /* popover for glossary terms */
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function openPop(t) {
    closePop();
    var k = t.getAttribute("data-t"), g = GW.glossary[k]; if (!g) return;
    pop = document.createElement("div"); pop.className = "popover"; pop.setAttribute("role", "dialog");
    pop.innerHTML = "<b>" + esc(g[0]) + "</b>" + esc(g[1]) + '<br><a href="#glossary" data-term="' + k + '">See the glossary</a>';
    document.body.appendChild(pop);
    var r = t.getBoundingClientRect(), pw = pop.offsetWidth, x = Math.min(Math.max(12, r.left + window.scrollX), window.scrollX + document.documentElement.clientWidth - pw - 12);
    pop.style.left = x + "px"; pop.style.top = (r.bottom + window.scrollY + 8) + "px";
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".term");
    if (t) { e.preventDefault(); openPop(t); return; }
    var gl = e.target.closest("[data-term]");
    if (gl) { pendingTerm = gl.getAttribute("data-term"); closePop(); if (location.hash === "#glossary") renderGlossary(); return; }
    if (pop && !e.target.closest(".popover")) closePop();
    var sc = e.target.closest("[data-scroll]");
    if (sc) { pendingScroll = sc.getAttribute("data-scroll"); var here = location.hash.replace(/^#/, "") || "welcome"; if (sc.getAttribute("href") === "#" + here) { e.preventDefault(); doPendingScroll(true); } }
    if (e.target.closest("[data-open-search]")) openSearch();
    var uc = e.target.closest("[data-ucscope]");
    if (uc) { ucScope = uc.getAttribute("data-ucscope"); save("gw-ucscope", ucScope); $$("[data-ucscope]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === uc)); }); paintUseCases(); }
    var uf = e.target.closest("[data-ucfit]");
    if (uf) { ucFit = uf.getAttribute("data-ucfit"); save("gw-ucfit", ucFit); $$("[data-ucfit]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === uf)); }); paintUseCases(); }
    if (e.target.closest("[data-ucreset]")) { ucFit = "all"; ucQ = ""; save("gw-ucfit", "all"); if (ucScope === "mine") { ucScope = "all"; save("gw-ucscope", "all"); } renderUseCases(); }
    var hs = e.target.closest("[data-homescope]");
    if (hs) { homeScope = hs.getAttribute("data-homescope"); save("gw-homescope", homeScope); renderHome(); var hf = $('[data-homescope="' + homeScope + '"]'); if (hf) hf.focus(); }
    var sc2 = e.target.closest("[data-exscope]");
    if (sc2) { exScope = sc2.getAttribute("data-exscope"); save("gw-exscope", exScope); renderExercises(); var f = $('[data-exscope="' + exScope + '"]'); if (f) f.focus(); }
    var cp = e.target.closest("[data-copy]");
    if (cp) {
      var link = cp.getAttribute("data-copy") === "link", box = cp.closest(".transfer, .save-strip"), msg = box && $("[data-copy-msg]", box);
      copyText(link ? resumeLink() : prettyCode(encodeProgress()), function (ok) {
        if (msg) msg.textContent = ok ? (link ? "Resume link copied. Open it on your other device." : "Code copied") : "Couldn't copy automatically. Select the code and copy it yourself.";
      });
    }
    if (e.target.closest(".rail a") && innerWidth <= 960) $("#rail").classList.remove("open");
  });
  document.addEventListener("keydown", function (e) {
    var t = e.target.closest && e.target.closest(".term");
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPop(t); }
    if (e.key === "Escape") { closePop(); closeSearch(); $("#rail").classList.remove("open"); }
    if (document.body.classList.contains("bare")) return;
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName))) { e.preventDefault(); openSearch(); return; }
    if (GW.ext) GW.ext.key(e);
  });

  /* ---------- search ---------- */
  var index = null;
  function buildIndex() {
    index = [];
    GW.lessons.forEach(function (l) {
      var c = GW.content[l.id] || {};
      index.push({ g: "Lessons", kind: "Lesson " + l.num, title: l.title, text: (l.summary + " " + (c.lede || "")).replace(/<[^>]+>/g, ""), go: l.id });
      var re = /<h2[^>]*>([\s\S]*?)<\/h2>/g, m;
      while ((m = re.exec(c.html || ""))) {
        var tt = m[1].replace(/<[^>]+>/g, "").trim();
        index.push({ g: "Sections", kind: "In: " + l.title, title: tt, text: "", go: l.id, sec: slug(tt) });
      }
    });
    Object.keys(GW.glossary).forEach(function (k) { index.push({ g: "Terms", kind: "Glossary", title: GW.glossary[k][0], text: GW.glossary[k][1], go: "glossary", term: k }); });
    (GW.useCases || []).forEach(function (u, i) { index.push({ g: "Use cases", kind: "Use case: " + trackName(u.r), title: u.t, text: u.d + " " + u.c, go: "usecases", uc: i }); });
    exercises().forEach(function (x) { index.push({ g: "Exercises", kind: "Exercise in lesson " + x.lesson.num, title: x.title.replace(/<[^>]+>/g, ""), text: x.kind + " " + x.tag, go: x.lesson.id, scroll: "ex-" + x.n }); });
    (GW.practice || []).forEach(function (p, i) { index.push({ g: "Practice", kind: "You decide: " + trackName(p.r), title: p.t, text: p.ctx.replace(/<[^>]+>/g, ""), go: "practice/" + (i + 1) }); });
  }
  var selIdx = 0, results = [], resHead = [];
  function openSearch() {
    if (!index) buildIndex();
    closeSearch();
    var o = document.createElement("div"); o.className = "search"; o.id = "search";
    o.innerHTML = '<div class="search-box" role="dialog" aria-label="Search the course"><input id="search-q" type="search" placeholder="Search lessons, sections and terms" autocomplete="off"><div class="search-res" id="search-res"></div></div>';
    document.body.appendChild(o);
    o.addEventListener("click", function (e) { if (e.target === o) closeSearch(); });
    var q = $("#search-q"); q.focus();
    q.addEventListener("input", function () { runSearch(q.value); });
    q.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { selIdx = Math.min(selIdx + 1, results.length - 1); paintRes(); e.preventDefault(); }
      if (e.key === "ArrowUp") { selIdx = Math.max(selIdx - 1, 0); paintRes(); e.preventDefault(); }
      if (e.key === "Enter" && results[selIdx]) { goResult(results[selIdx]); }
    });
    runSearch("");
  }
  function closeSearch() { var s = $("#search"); if (s) s.remove(); }
  function runSearch(q) {
    q = q.toLowerCase().trim(); selIdx = 0; resHead = [];
    if (!q) {
      results = routeFor(roles).map(function (id) { return index.filter(function (x) { return x.go === id && !x.sec; })[0]; });
      resHead[0] = "Your path";
    } else {
      var words = q.split(/\s+/), single = q.replace(/s$/, "");
      var hits = index.map(function (x) {
        var t = x.title.toLowerCase(), hay = (t + " " + x.text).toLowerCase(), score = 0;
        for (var i = 0; i < words.length; i++) { if (hay.indexOf(words[i]) < 0) return null; score += t.indexOf(words[i]) > -1 ? 3 : 1; }
        var exact = t === q || t.replace(/s$/, "") === single;
        if (exact) score += 100; else if (t.indexOf(q) === 0) score += 6;
        return { x: x, s: score, exact: exact };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s; });
      // exact title matches first, then the rest grouped by kind
      var best = hits.filter(function (r) { return r.exact; }).slice(0, 3), rest = hits.filter(function (r) { return best.indexOf(r) < 0; });
      results = [];
      if (best.length) { resHead[0] = "Best match"; best.forEach(function (r) { results.push(r.x); }); }
      ["Lessons", "Sections", "Terms", "Use cases", "Exercises", "Practice"].forEach(function (g) {
        var grp = rest.filter(function (r) { return r.x.g === g; }).slice(0, g === "Lessons" || g === "Sections" ? 5 : 4);
        if (grp.length) { resHead[results.length] = g; grp.forEach(function (r) { results.push(r.x); }); }
      });
    }
    paintRes();
  }
  function paintRes() {
    var box = $("#search-res"); if (!box) return;
    if (!results.length) { box.innerHTML = '<div class="empty">No matches. Try a broader word, such as "test", "context" or "risk".</div>'; return; }
    box.innerHTML = results.map(function (r, i) { return (resHead[i] ? '<p class="sr-h">' + esc(resHead[i]) + "</p>" : "") + '<a href="#' + r.go + '" data-i="' + i + '" class="' + (i === selIdx ? "sel" : "") + '"><small>' + esc(r.kind) + "</small>" + esc(r.title) + "</a>"; }).join("");
    $$("a", box).forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); goResult(results[+a.dataset.i]); }); });
    var sel = $("a.sel", box); if (sel) sel.scrollIntoView({ block: "nearest" });
  }
  function goResult(r) {
    closeSearch();
    if (r.term) pendingTerm = r.term;
    if (r.sec) pendingSection = r.sec;
    if (r.scroll) pendingScroll = r.scroll;
    if (r.uc !== undefined) {
      // show the card even if it's outside the current filters
      var u = GW.useCases[r.uc]; ucQ = ""; ucFit = "all";
      if (roles.indexOf(u.r) < 0) ucScope = "all";
      pendingScroll = "uc-" + r.uc; pendingFlash = true;
    }
    if (location.hash === "#" + r.go) route(); else location.hash = r.go;
  }

  /* ---------- router ---------- */
  var pendingSection = null, pendingTerm = null, pendingScroll = null, pendingCode = null, pendingFlash = false;
  function doPendingScroll(smooth) {
    if (!pendingScroll) return;
    var el = document.getElementById(pendingScroll), fl = pendingFlash; pendingScroll = null; pendingFlash = false;
    if (el) el.scrollIntoView({ behavior: smooth === true && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto", block: fl ? "center" : "start" });
    if (el && fl) { el.classList.add("flash"); setTimeout(function () { el.classList.remove("flash"); }, 1800); }
  }
  // pages added by extras.js: GW.pages[name] = { render(arg), title(arg), tab, open (no roles needed) }
  var page = function (h) { var p = GW.pages && GW.pages[h.split(/[\/=]/)[0]]; return p || null; };
  var inner = function (h) { return byId[h] || h === "glossary" || h === "home" || h === "exercises" || h === "usecases" || !!page(h); };
  function route() {
    closePop(); closeSearch();
    clearInterval(roleTimer);
    document.body.classList.remove("on-landing");
    var h = (location.hash || "").replace(/^#/, "");
    // the workflow: landing → choose roles → course; a resume link restores a code first
    if (h.indexOf("resume=") === 0) {
      var d = decodeProgress(decodeURIComponent(h.slice(7)));
      if (d.error) { pendingCode = { code: decodeURIComponent(h.slice(7)), err: d.error }; location.replace("#progress"); return; }
      applyProgress(d);
      notice = "Progress restored from your link: " + pathLong(roles) + ", " + doneOf(routeFor(roles)) + " of " + routeFor(roles).length + " lessons done.";
      location.replace("#home"); return;
    }
    // a section link: #lesson-id/section-slug
    var sl = h.indexOf("/");
    if (sl > 0 && byId[h.slice(0, sl)]) { pendingSection = h.slice(sl + 1); h = h.slice(0, sl); }
    var pg = page(h), pgArg = pg ? decodeURIComponent(h.slice(h.split(/[\/=]/)[0].length + 1)) : "";
    var open = h === "welcome" || h === "role" || h === "progress" || (pg && pg.open);
    if (!roles.length && !open) { if (inner(h) && h !== "home") { resumeTo = h; location.replace("#role"); } else location.replace("#welcome"); return; }
    if (h === "") { location.replace("#home"); return; }
    var title = "Kern", bare = h === "welcome" || h === "role" || (h === "progress" && !roles.length) || (pg && pg.open && !roles.length);
    paintTopbar(bare ? "bare" : byId[h] ? "lesson" : "tabs", byId[h] ? "home" : pg ? pg.tab : h);
    if (pg) {
      $("#rail").classList.remove("open");
      var pt = pg.render(pgArg);
      if (pt === false) return;   // the page redirected
      window.scrollTo(0, 0); setTimeout(doPendingScroll, 30);
      document.title = (pg.title ? pg.title(pgArg) : "Kern") + " · Kern";
      $("#view").focus({ preventScroll: true });
      return;
    }
    $("#rail").classList.remove("open");
    if (h === "welcome") { renderWelcome(); title = "Kern · AI for software teams"; }
    else if (h === "progress") { var pc = pendingCode || {}; pendingCode = null; renderProgress(pc.code, pc.err); title = (roles.length ? "Progress" : "Continue with a code") + " · Kern"; }
    else if (h === "role") { renderRolePicker(); title = "Choose your roles · Kern"; }
    else if (byId[h] && GW.content[h]) { renderLesson(h); renderRail(h); title = byId[h].title + " · Kern"; }
    else if (h === "glossary") { renderGlossary(); title = "Glossary · Kern"; }
    else if (h === "exercises") { renderExercises(); title = "Exercises · Kern"; }
    else if (h === "usecases" && hasUseCases) { renderUseCases(); title = "Use cases · Kern"; }
    else { renderHome(); title = "Lessons · Kern"; }
    if (!(h === "glossary" && pendingTerm) && !pendingSection) window.scrollTo(0, 0);
    setTimeout(doPendingScroll, 30);
    document.title = title;
    $("#view").focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-pick]"); if (a) save("gw-pick", a.getAttribute("data-pick"));
    var rx = e.target.closest("[data-rx]");
    if (rx) {
      var box = rx.closest(".role-ex"), id = rx.getAttribute("data-rx");
      $$("[data-rx]", box).forEach(function (b) { b.setAttribute("aria-pressed", String(b === rx)); });
      $$("[data-rx-p]", box).forEach(function (p) { p.hidden = p.getAttribute("data-rx-p") !== id; });
    }
  });
  // Curly quotes and a real ellipsis in everything the page shows, code and fields excepted.
  var NOTYPE = "code, pre, kbd, script, style, textarea, input, .code-big, .codebox, .log, .no-type";
  function typeset(root) {
    if (!root || !root.ownerDocument) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { var el = n.parentElement; return el && el.closest(NOTYPE) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } }), n;
    while ((n = tw.nextNode())) {
      var t = n.nodeValue; if (!/['"]|\.\.\./.test(t)) continue;
      t = t.replace(/\.\.\./g, "\u2026").replace(/(\w)'(\w)/g, "$1\u2019$2").replace(/(^|[\s(\[{\u201c\u2018-])'/g, "$1\u2018").replace(/'/g, "\u2019")
        .replace(/(^|[\s(\[{\u2018-])"/g, "$1\u201c").replace(/"/g, "\u201d");
      if (t !== n.nodeValue) n.nodeValue = t;
    }
  }
  if ("MutationObserver" in window) new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (x) { if (x.nodeType === 1) typeset(x); else if (x.nodeType === 3 && x.parentElement) typeset(x.parentElement); }); }); })
    .observe(document.body, { childList: true, subtree: true });
  typeset(document.body);
  var skip = $(".skip");
  if (skip) skip.addEventListener("click", function (e) { e.preventDefault(); var v = $("#view"); v.focus(); v.scrollIntoView(); });
  window.addEventListener("hashchange", route);
  $("#menu-btn").addEventListener("click", function () { $("#rail").classList.toggle("open"); });
  $("#search-btn").addEventListener("click", openSearch);
  /* ---------- light/dark switch: starts from the system setting, remembers an explicit choice ---------- */
  var darkMQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function isDark() { var t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : !!(darkMQ && darkMQ.matches); }
  function paintTheme() {
    var d = isDark(), b = $("#theme-btn");
    b.classList.toggle("is-dark", d);
    b.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode");
    b.title = d ? "Light mode" : "Dark mode";
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute("content", d ? "#0B0B0A" : "#F5F3EE"); m.removeAttribute("media"); });
  }
  $("#theme-btn").addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("gw-theme", next); } catch (e) {}
    paintTheme();
  });
  if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener("change", paintTheme);
  paintTheme();

  // what extras.js needs from the app
  GW.app = {
    $: $, $$: $$, esc: esc, plural: plural, meter: meter, trackIdOf: trackIdOf, trackName: trackName, uniq: uniq, slug: slug, byId: byId, roleInfo: roleInfo, trackOf: trackOf, routeFor: routeFor,
    coreIds: coreIds, pathLong: pathLong, hours: hours, exercises: exercises, copyText: copyText, openPop: openPop, closePop: closePop,
    roles: function () { return roles; }, progress: function () { return progress; }, doneOf: doneOf,
    code: function () { return prettyCode(encodeProgress()); }, decode: decodeProgress, resumeLink: resumeLink,
    codeLessons: CODE_LESSONS, route: route, renderUseCase: renderUseCase, useCaseTitle: useCaseTitle
  };
  // start once every script (extras.js included) has run
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", route); else route();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () { /* offline support is optional */ }); });
  }

})();
