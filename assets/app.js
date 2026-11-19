/* Groundwork app: landing, role picker, progress codes, routing, course rail, home, lessons, glossary, search, progress, checks. */
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
  function trackOf(r) { return GW.lessons.filter(function (l) { return l.rid === r; }).map(function (l) { return l.id; }); }
  function routeFor(list) {
    list = cleanRoles(list);
    if (!list.length || list[0] === "general") return coreIds.concat(["team-adoption"]);
    var extra = trackOf(list[0]).concat(list.length === 1 ? [roleInfo(list[0]).also] : list.slice(1));
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
    if (r === list[0]) return list.length > 1 ? "Main role" : "Your role";
    if (list.indexOf(r) > 0) return "Your role";
    if (list.length === 1 && r === roleInfo(list[0]).also) return "Neighbouring role";
    return "";
  }
  var NUM = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
  function hours(ids) { var m = ids.reduce(function (a, id) { return a + byId[id].minutes; }, 0); return NUM.format(Math.round(m / 60 * 2) / 2); }

  /* ---------- local storage (per-browser copy) ---------- */
  function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(key, val) { try { if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } }
  var progress = load("gw-progress", {});
  var roles = cleanRoles(load("gw-roles", null) || load("gw-role", null));
  save("gw-session", null);   // retired: the course no longer has accounts
  GW.store = { load: load, save: save };

  var totalMin = GW.lessons.reduce(function (a, l) { return a + l.minutes; }, 0);
  var courseSize = GW.lessons.length + " lessons · about " + Math.round(totalMin / 60 * 2) / 2 + " hours";
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
    var h = '<div class="rail-path"><span class="k">Your path</span><b>' + esc(pathLong(roles) || "Not chosen") + '</b><span class="m">' + n + " of " + path.length + ' lessons done</span><a href="#role">Change roles</a></div>';
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
    h += '<div class="rail-foot"><a href="#progress"' + (active === "progress" ? ' aria-current="page"' : "") + '>Your progress code</a><a href="#glossary"' + (active === "glossary" ? ' aria-current="page"' : "") + '>Glossary of terms</a><a href="#welcome">About the course</a><p class="who-line">Progress saves in this browser.</p>' + (GW.version ? '<p class="build-v">Version ' + esc(GW.version) + "</p>" : "") + "</div>";
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
  // Short, parallel lines for what each role practises.
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
    var c = HERO[k], info = roleInfo(c.r);
    return '<div class="hx-draft"><span class="hx-k">AI draft (' + esc(info.name) + ')</span><p>' + c.draft + '</p></div><div class="hx-check"><span class="hx-k">Human check</span><span class="stamp ' + c.s + '">' + esc(c.st) + "</span><p>" + esc(c.note) + "</p></div>";
  }
  function renderWelcome() {
    var ready = roles.length > 0;
    var go = ready ? "#home" : "#role", goTxt = ready ? "Continue the course" : "Start the course";
    var first = GW.lessons[0];
    var h = '<div class="landing">';
    h += '<section class="l-hero"><div class="l-copy">';
    h += "<h1>AI drafts.<br>You decide.</h1>";
    h += '<p class="l-lede">A free course for software teams on checking AI\'s work.</p>';
    h += '<div class="hero-cta"><a class="btn pill dark" href="' + go + '">' + goTxt + "</a>" + (ready ? "" : '<span class="cta-note">' + first.minutes + "-minute first lesson</span>") + "</div>";
    h += "</div>";
    h += '<figure class="hero-ex" aria-label="An AI draft and the human check that follows it"><div class="hx-card">' + heroCard(0) + "</div>";
    h += '<figcaption><span>See it for</span><span class="hx-roles" role="group" aria-label="Show the example for">' + HERO.map(function (c, k) { return '<button type="button" class="rx-btn" data-hx="' + k + '" aria-pressed="' + (k === 0) + '">' + esc(roleInfo(c.r).name) + "</button>"; }).join("") + '</span><button type="button" class="hx-play" aria-pressed="false" hidden><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z"/></svg><span>Pause</span></button></figcaption></figure>';
    h += "</section>";

    h += '<section class="l-roles" id="roles-l"><div class="section-h"><h2>Start with your role</h2><p>Pick up to three.</p></div>';
    h += '<ul class="lr-grid">' + roleList.map(function (r) {
      return '<li><a class="lr-card" href="#role" data-pick="' + r.id + '"><b>' + esc(r.name) + "</b></a></li>";
    }).join("") + "</ul></section>";

    var nEx = exercises().length, nTracks = GW.roles.length;
    h += '<section class="l-proof" aria-label="What the course includes"><dl>';
    h += '<div><dt>' + GW.lessons.length + '</dt><dd>short lessons, 20 to 35 minutes each</dd></div>';
    h += '<div><dt>' + nTracks + '</dt><dd>role tracks, from product to support</dd></div>';
    h += '<div><dt>' + nEx + '</dt><dd>hands-on exercises that check your answer</dd></div>';
    h += '<div><dt>0</dt><dd>accounts to create. A code carries your progress.</dd></div>';
    h += "</dl></section>";
    h += '<section class="l-start"><div><h2>Start with lesson 1.</h2><p>It takes ' + first.minutes + '\u00a0minutes and needs no background.</p></div><a class="btn pill dark" href="' + go + '">' + goTxt + "</a></section>";
    h += "</div>";
    $("#view").innerHTML = h;
    startHero();
  }
  // The hero card plays through the roles: the draft first, then the human check lands.
  // It pauses on hover or focus, stops for good once a role is picked, and stays still with reduced motion.
  var heroTimer = null, heroK = 0, heroStopped = false;
  function showHero(fig, k, staged) {
    heroK = k;
    $$("[data-hx]", fig).forEach(function (x) { x.setAttribute("aria-pressed", String(+x.getAttribute("data-hx") === k)); });
    var card = $(".hx-card", fig); card.innerHTML = heroCard(k);
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
    if (staged) { card.classList.add("pending"); setTimeout(function () { card.classList.remove("pending"); }, 1400); }
    else card.classList.remove("pending");
  }
  function startHero() {
    clearInterval(heroTimer); heroK = 0; heroStopped = false;
    var fig = $(".hero-ex"); if (!fig) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var play = $(".hx-play", fig), hover = false;
    play.hidden = false;
    function setPlaying(on) {
      heroStopped = !on; play.setAttribute("aria-pressed", String(!on));
      play.querySelector("span").textContent = on ? "Pause" : "Play";
      play.querySelector("path").setAttribute("d", on ? "M3 2h2v8H3zM7 2h2v8H7z" : "M3 2l7 4-7 4z");
    }
    play.addEventListener("click", function () { setPlaying(heroStopped); });
    fig.addEventListener("mouseenter", function () { hover = true; });
    fig.addEventListener("mouseleave", function () { hover = false; });
    fig.addEventListener("focusin", function () { hover = true; });
    fig.addEventListener("focusout", function () { hover = false; });
    showHero(fig, 0, true);
    heroTimer = setInterval(function () {
      if (!document.body.contains(fig)) { clearInterval(heroTimer); return; }
      if (heroStopped || hover || document.hidden) return;
      showHero(fig, (heroK + 1) % HERO.length, true);
    }, 6000);
    fig._setPlaying = setPlaying;
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-hx]"); if (!b) return;
    var fig = b.closest(".hero-ex");
    if (fig._setPlaying) fig._setPlaying(false);
    showHero(fig, +b.getAttribute("data-hx"), false);
  });

  /* ---------- progress code: roles and completed lessons, no server ----------
     v2 layout (75 bits, 15 characters): version (4) · three role slots (4 each, 0 = empty) · 51 lesson slots (1 bit each) · CRC-8 (8).
     v1 codes (9 characters, the first 21 lessons) still decode.
     Both lists are append-only: never reorder or remove an entry, or old codes decode wrongly. Lesson slots 46–51 are spare. */
  var CODE_V = 2, CODE_SLOTS = 51;
  var CODE_LESSONS = ["how-models-work", "context", "failure-modes", "choosing-models", "asking-well", "checking-work", "tools-agents", "data-security", "product", "design", "engineering", "qa", "security", "data-analytics", "technical-writing", "delivery", "project-management", "engineering-management", "operations", "customer-support", "team-adoption",
    "product-discovery", "product-ai-features", "design-research", "design-ai-ux", "engineering-agents", "engineering-review", "qa-automation", "qa-ai-features", "security-threat-models", "security-detection", "data-analysis", "data-quality", "docs-for-ai", "docs-maintenance", "delivery-flow", "delivery-rituals", "pm-planning", "pm-vendors", "em-measuring", "em-people", "ops-iac", "ops-llm", "support-knowledge", "support-assistant"];
  var CODE_ROLES = ["general", "product", "design", "engineering", "qa", "security", "data-analytics", "technical-writing", "delivery", "project-management", "engineering-management", "operations", "customer-support"];
  var B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";   // Crockford: no I, L, O or U
  function bitsOf(n, w) { var s = n.toString(2); while (s.length < w) s = "0" + s; return s; }
  function crc8(bits) {
    var c = 0;
    for (var i = 0; i < bits.length; i++) { var fb = ((c >> 7) & 1) ^ (bits[i] === "1" ? 1 : 0); c = (c << 1) & 255; if (fb) c ^= 7; }
    return c;
  }
  function encodeProgress() {
    var b = bitsOf(CODE_V, 4);
    for (var i = 0; i < 3; i++) b += bitsOf(roles[i] ? CODE_ROLES.indexOf(roles[i]) + 1 : 0, 4);
    for (var n = 0; n < CODE_SLOTS; n++) b += CODE_LESSONS[n] && progress[CODE_LESSONS[n]] ? "1" : "0";
    b += bitsOf(crc8(b), 8);
    var out = "";
    for (var j = 0; j < b.length; j += 5) out += B32[parseInt(b.slice(j, j + 5), 2)];
    return out;
  }
  function prettyCode(c) { return c.length === 9 ? "GW-" + c.slice(0, 3) + "-" + c.slice(3, 6) + "-" + c.slice(6) : "GW-" + c.slice(0, 5) + "-" + c.slice(5, 10) + "-" + c.slice(10); }
  function decodeProgress(raw) {
    var s = String(raw || "").toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1").replace(/[^0-9A-Z]/g, "");
    if ((s.length === 11 || s.length === 17) && s.slice(0, 2) === "GW") s = s.slice(2);
    if (s.length !== 9 && s.length !== 15) return { error: "A progress code has 15 letters and numbers after GW, like GW-7K2Q9-M4TAB-8C1DE. Older nine-character codes work too." };
    var b = "";
    for (var i = 0; i < s.length; i++) { var v = B32.indexOf(s[i]); if (v < 0) return { error: "That code has a character that isn't used in progress codes. Check it and try again." }; b += bitsOf(v, 5); }
    var v1 = s.length === 9, body = v1 ? 37 : 67;
    if (parseInt(b.slice(body, body + 8), 2) !== crc8(b.slice(0, body))) return { error: "That code doesn't check out. A character may have been mistyped." };
    if (parseInt(b.slice(0, 4), 2) !== (v1 ? 1 : 2)) return { error: "That code comes from a different version of the course." };
    var rs = [];
    for (var k = 0; k < 3; k++) { var r = parseInt(b.slice(4 + k * 4, 8 + k * 4), 2); if (r > 0 && CODE_ROLES[r - 1]) rs.push(CODE_ROLES[r - 1]); }
    var done = {};
    CODE_LESSONS.slice(0, v1 ? 21 : CODE_SLOTS).forEach(function (id, n) { if (b[16 + n] === "1") done[id] = true; });
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
      var link = resumeLink(), mail = "mailto:?subject=" + encodeURIComponent("My Groundwork progress") + "&body=" + encodeURIComponent("Continue the course where I left off: " + link + "\n\nProgress code: " + prettyCode(encodeProgress()));
      h += '<section class="transfer"><h2>Continue on another device</h2>';
      h += '<p class="fine">Progress saves in this browser as you go. Open your resume link on the other device and you pick up where you left off.</p>';
      h += '<div class="w-row"><button type="button" class="btn pill dark" data-copy="link">Copy resume link</button><a class="tx-mail" href="' + esc(mail) + '">Email it to yourself</a></div>';
      h += '<div class="code-card"><span class="hx-k">Or type this code on the other device</span><div class="code-row"><p class="code-big" id="pc-code">' + prettyCode(encodeProgress()) + '</p><button type="button" class="btn small ghost" data-copy="code">Copy code</button></div>';
      h += '<p class="code-sum">The code changes as you complete lessons, so copy it again before you switch.</p></div>';
      h += '<p class="copy-msg" data-copy-msg role="status" aria-live="polite"></p></section>';
    } else h += '<p class="lede">Enter the progress code from your other device. Your roles and completed lessons come back in this browser.</p>';
    h += '<section class="restore">' + (has ? "<h2>Restore a different code</h2>" : "");
    h += '<form class="w" id="pc-form" novalidate><label for="pc-in">Progress code</label><p class="fine pc-help" id="pc-help">15 letters and numbers, with or without the dashes.' + (has ? " Restoring switches to the roles in the code and keeps every lesson you have completed here." : "") + '</p><div class="pc-row"><input type="text" id="pc-in" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="GW-7K2Q9-M4TAB-8C1DE" aria-describedby="pc-help pc-err" value="' + esc(prefill || "") + '"><button class="btn pill dark" type="submit">Restore progress</button></div>';
    h += '<p class="pc-err" id="pc-err" role="alert">' + esc(err || "") + "</p></form>";
    h += "</section>";
    if (has) h += '<section class="restore"><h2>Clear this browser</h2><p class="fine">Removes your roles and progress from this browser. Copy your code first if you want them back later.</p><button type="button" class="btn ghost" id="pc-clear">Clear progress in this browser</button></section>';
    else h += '<p class="auth-back"><a href="#role">No code? Choose your roles and start</a></p>';
    h += "</div>";
    $("#view").innerHTML = h;
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
    function card(r) {
      return '<button type="button" class="role-card' + (r === GENERAL ? " gen" : "") + '" role="checkbox" aria-checked="false" data-r="' + r.id + '"><span class="rc-top"><b>' + esc(r.name) + '</b><span class="rc-badge"></span></span><span class="rc-s">' + esc(ROLE_SHORT[r.id]) + "</span><em></em></button>";
    }
    var h = '<div class="picker">';
    h += '<p class="pick-top"><a class="back" href="' + (first ? "#welcome" : "#home") + '">Back</a></p>';
    h += "<h1>Choose your roles</h1>";
    h += '<p class="lede">Pick up to three. Your first pick is your main role and adds its full track.</p>';
    h += '<div class="pick-layout"><div class="pick-main" role="group" aria-label="Roles, choose up to three">';
    h += '<div class="pick-gen">' + card(GENERAL) + '<p>Not sure yet? Start with General.</p></div>';
    h += '<h2 class="pick-h">Or pick your roles</h2><div class="role-grid pick">' + GW.roles.map(card).join("") + "</div></div>";
    h += '<aside class="pick-side" aria-labelledby="ps-h"><h2 id="ps-h" tabindex="-1">Your path</h2><div id="pick-chosen"></div><div id="pick-path"></div></aside></div>';
    h += '<div class="pick-bar"><p id="pick-sum" aria-live="polite"></p><a class="btn small ghost pick-review" href="#ps-h">Review<span class="rv-long"> your path</span></a><button class="btn small pill dark" id="pick-go"></button></div></div>';
    var view = $("#view"); view.innerHTML = h;

    function paint() {
      var gen = picked[0] === "general";
      $$(".role-card", view).forEach(function (b) {
        var id = b.getAttribute("data-r"), i = picked.indexOf(id), n = id === "general" ? 0 : trackOf(id).length;
        b.setAttribute("aria-checked", String(i > -1));
        $(".rc-badge", b).textContent = i < 0 ? "" : gen ? "Selected" : i === 0 ? "Main" : "Added";
        $("em", b).textContent = id === "general" ? "" : i === 0 ? "Adds " + plural(n, "lesson") + ": the full track" : i > 0 ? "Adds its first lesson" : "";
      });
      var chosen = $("#pick-chosen", view), pathBox = $("#pick-path", view), sum = $("#pick-sum", view), go = $("#pick-go", view);
      if (!picked.length) chosen.innerHTML = '<p class="ps-empty">Nothing chosen yet. Pick the roles closest to your work.</p>';
      else if (gen) chosen.innerHTML = '<ol class="ps-list"><li><b>General</b><span>Neutral path</span><button type="button" class="linkish" data-remove="general" aria-label="Remove General">Remove</button></li></ol>';
      else chosen.innerHTML = '<ol class="ps-list">' + picked.map(function (id, i) {
        var nm = esc(roleInfo(id).name);
        return "<li><b>" + nm + "</b>" + (i === 0 ? "<span>Main role</span>" : '<button type="button" class="linkish" data-main="' + id + '" aria-label="Make ' + nm + ' your main role">Make main</button>') + '<button type="button" class="linkish" data-remove="' + id + '" aria-label="Remove ' + nm + '">Remove</button></li>';
      }).join("") + "</ol>";
      if (picked.length) {
        var ids = routeFor(picked), extra = ids.slice(coreLast, -1), main = roleInfo(picked[0]);
        var track = gen ? [] : extra.filter(function (id) { return byId[id].rid === picked[0]; }), also = extra.filter(function (id) { return track.indexOf(id) < 0; });
        var p = '<ul class="ps-route"><li><b>' + plural(coreLast, "core lesson") + "</b><span>How models work and how to work with them, for everyone</span></li>";
        if (track.length) p += "<li><b>" + esc(main.name) + " track: " + plural(track.length, "lesson") + "</b><span>" + track.map(function (id) { return esc(byId[id].title); }).join(" · ") + "</span></li>";
        if (also.length) p += "<li><b>" + (picked.length === 1 ? "Neighbouring role: " : "Your other roles: ") + plural(also.length, "lesson") + "</b><span>" + also.map(function (id) { return esc(byId[id].role + ": " + byId[id].title); }).join(" · ") + "</span></li>";
        p += "<li><b>Capstone: 1 lesson</b><span>" + esc(byId["team-adoption"].title) + "</span></li></ul>";
        p += '<div class="role-ex"><div class="role-ex-h"><span class="tag">' + (gen ? "Example" : "Example from lesson 2") + "</span><b>" + esc(gen ? "For any role" : main.name) + "</b></div><p>" + GW.roleEx.context[main.id] + "</p></div>";
        pathBox.innerHTML = p;
        sum.innerHTML = note ? esc(note) : "<b>" + esc(pathName(picked)) + "</b><span>" + plural(ids.length, "lesson") + ", about " + hours(ids) + " hours</span>";
      } else { pathBox.innerHTML = ""; sum.textContent = note || "Choose at least one role."; }
      go.disabled = !picked.length;
      go.textContent = first ? "Start the course" : "Save roles";
      $(".pick-review", view).hidden = !picked.length;
    }
    paint();

    $(".pick-main", view).addEventListener("click", function (e) {
      var b = e.target.closest(".role-card"); if (!b) return;
      var id = b.getAttribute("data-r"), i = picked.indexOf(id); note = "";
      if (i > -1) picked.splice(i, 1);
      else if (id === "general") picked = ["general"];
      else {
        picked = picked.filter(function (x) { return x !== "general"; });
        if (picked.length >= MAXR) note = "You can choose up to three roles. Remove one to add another.";
        else picked.push(id);
      }
      paint();
    });
    $(".pick-review", view).addEventListener("click", function (e) { e.preventDefault(); var hd = $("#ps-h", view); hd.scrollIntoView({ block: "start" }); hd.focus({ preventScroll: true }); });
    $(".pick-side", view).addEventListener("click", function (e) {
      var m = e.target.closest("[data-main]"), r = e.target.closest("[data-remove]"); note = "";
      if (m) { var id = m.getAttribute("data-main"); picked.splice(picked.indexOf(id), 1); picked.unshift(id); paint(); var nb = $('[data-remove="' + id + '"]', view); if (nb) nb.focus(); }
      else if (r) { picked.splice(picked.indexOf(r.getAttribute("data-remove")), 1); paint(); $("#ps-h", view).focus(); }
    });
    $("#pick-go", view).addEventListener("click", function () {
      if (!picked.length) return;
      roles = picked.slice(); persist();
      var go = resumeTo || "home"; resumeTo = null; location.hash = go;
    });
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
    h += '<div class="pbar" aria-label="Progress on your path"><span class="pbar-track"><i style="width:' + Math.round(100 * n / path.length) + '%"></i></span><span class="pbar-t">' + n + " of " + path.length + " done" + (left.length ? ", about " + hours(left) + " hours left" : "") + "</span></div>";
    if (next) {
      var nl = byId[next];
      h += '<a class="upnext" href="#' + next + '"><span class="un-k">Up next: lesson ' + nl.num + ", " + nl.minutes + '\u00a0min</span><b>' + esc(nl.title) + '</b><span class="un-s">' + esc(nl.summary) + '</span><span class="btn pill dark">' + (n ? "Continue lesson" : "Start lesson") + "</span></a>";
    } else h += '<a class="upnext" href="#team-adoption"><span class="un-k">All ' + path.length + ' lessons done</span><b>Revisit the capstone, or explore the full library</b><span class="btn pill dark">Open the capstone</span></a>';
    h += '<p class="dash-links"><a class="linkish" href="#role">Change roles</a><button type="button" class="linkish" data-open-search>Search lessons and terms</button></p></section>';

    h += '<div class="home-views"><div class="seg" role="group" aria-label="Which lessons to show"><button type="button" data-homescope="path" aria-pressed="' + (homeScope === "path") + '">Your path (' + path.length + ')</button><button type="button" data-homescope="all" aria-pressed="' + (homeScope === "all") + '">Full library (' + GW.lessons.length + ")</button></div></div>";

    if (homeScope === "path") {
      var track = gen ? [] : path.filter(function (id) { return byId[id].rid === roles[0]; });
      var also = path.slice(coreLast, -1).filter(function (id) { return track.indexOf(id) < 0; });
      var stages = [
        { h: "Core lessons", p: "For everyone: how models work, and how to work with them.", ids: path.slice(0, coreLast) },
        { h: esc(main.name) + " track", p: "Your main role's lessons, in order.", ids: track },
        { h: "Also recommended", p: roles.length === 1 ? esc(main.why) : "The first lesson for each of your other roles.", ids: also },
        { h: "Capstone", p: "Bring AI into a team deliberately.", ids: ["team-adoption"] }
      ];
      stages.forEach(function (s) {
        if (!s.ids.length) return;
        var d = doneOf(s.ids);
        h += '<section class="stage"><div class="stage-h"><h2>' + s.h + '</h2><p>' + s.p + '</p><span class="stage-n">' + (d === s.ids.length ? "Done" : d + " of " + plural(s.ids.length, "lesson")) + '</span></div><ol class="contents path">' + s.ids.map(function (id) { return pathRow(id, path.indexOf(id) + 1, next); }).join("") + "</ol></section>";
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
  var exIndex = null, exScope = load("gw-exscope", "path");
  function exercises() {
    if (exIndex) return exIndex;
    exIndex = [];
    GW.lessons.forEach(function (l) {
      var c = GW.content[l.id]; if (!c) return;
      c.html.split('<div class="activity">').slice(1).forEach(function (chunk, i) {
        var m = function (re, d) { var r = chunk.match(re); return r ? r[1] : d; };
        exIndex.push({ lesson: l, n: i + 1, tag: m(/class="tag">([^<]*)</, "Practice"), title: m(/class="ttl">([^<]*)</, "Exercise"), kind: EX_KIND[m(/data-w="([a-z-]+)"/, "")] || "" });
      });
    });
    return exIndex;
  }
  function renderExercises() {
    var path = routeFor(roles), all = exercises();
    var list = exScope === "path" ? all.filter(function (e) { return path.indexOf(e.lesson.id) > -1; }) : all;
    var lessonsWith = [];
    list.forEach(function (e) { if (lessonsWith.indexOf(e.lesson) < 0) lessonsWith.push(e.lesson); });
    var h = '<div class="tabpage"><header class="tp-head"><h1>Exercises</h1><p class="lede">Every hands-on activity in the course. Each one gives you feedback as you go.</p>';
    h += '<div class="seg" role="group" aria-label="Which exercises to show"><button type="button" data-exscope="path" aria-pressed="' + (exScope === "path") + '">Your path</button><button type="button" data-exscope="all" aria-pressed="' + (exScope === "all") + '">All lessons</button></div>';
    h += '<p class="ex-count" aria-live="polite">' + plural(list.length, "exercise") + " in " + plural(lessonsWith.length, "lesson") + "</p></header>";
    lessonsWith.forEach(function (l) {
      var done = progress[l.id];
      h += '<section class="ex-group' + (done ? " done" : "") + '" aria-labelledby="exg-' + l.id + '"><h2 class="ex-l" id="exg-' + l.id + '"><span class="ex-ln">Lesson ' + l.num + (done ? ' <b class="ex-done">Completed</b>' : "") + "</span>" + esc(l.title) + '</h2><ul class="ex-list">';
      list.filter(function (e) { return e.lesson === l; }).forEach(function (e) {
        h += '<li><a class="ex-row" href="#' + l.id + '" data-scroll="ex-' + e.n + '"><b>' + e.title + '</b><span class="ex-end">' + (e.kind ? '<span class="ex-kind">' + esc(e.kind) + "</span>" : "") + '<svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="M2 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a></li>';
      });
      h += "</ul></section>";
    });
    h += "</div>";
    $("#view").innerHTML = h;
  }

  /* ---------- use cases tab: concrete ways each role uses AI, rated for fit ---------- */
  var FIT = { good: ["good", "Good fit"], care: ["care", "Use with care"], human: ["human", "Keep human"] };
  var ucScope = load("gw-ucscope", "mine");
  function renderUseCases() {
    var gen = !roles.length || roles[0] === "general", mine = gen ? [] : roles.slice();
    var scope = gen ? "all" : ucScope;
    var order = scope === "mine" ? mine : mine.concat(GW.roles.map(function (r) { return r.id; }).filter(function (r) { return mine.indexOf(r) < 0; }));
    var list = GW.useCases || [], count = 0;
    var h = '<div class="tabpage"><header class="tp-head"><h1>Use cases</h1><p class="lede">Concrete ways people in each role use AI at work, how well each fits, and what to check before you rely on the result.</p>';
    if (!gen) h += '<div class="seg" role="group" aria-label="Which roles to show"><button type="button" data-ucscope="mine" aria-pressed="' + (scope === "mine") + '">Your roles</button><button type="button" data-ucscope="all" aria-pressed="' + (scope === "all") + '">All roles</button></div>';
    var body = "";
    order.forEach(function (r) {
      var items = list.filter(function (u) { return u.r === r; }); if (!items.length) return;
      count += items.length;
      body += '<section class="uc-group" aria-labelledby="ucg-' + r + '"><h2 class="ex-l" id="ucg-' + r + '"><span>' + trackSpan(r) + "</span>" + esc(roleInfo(r).name) + '</h2><div class="uc-grid">';
      items.forEach(function (u) {
        var f = FIT[u.fit], l = byId[u.l];
        body += '<article class="uc-card"><span class="fit ' + f[0] + '">' + f[1] + "</span><h3>" + esc(u.t) + "</h3><p>" + esc(u.d) + '</p><p class="uc-check"><b>Check:</b> ' + esc(u.c) + "</p>" + (l ? '<a class="uc-link" href="#' + l.id + '"><b>Lesson ' + l.num + "</b> " + esc(l.title) + "</a>" : "") + "</article>";
      });
      body += "</div></section>";
    });
    h += '<p class="ex-count" aria-live="polite">' + count + " use cases across " + order.filter(function (r) { return list.some(function (u) { return u.r === r; }); }).length + " roles</p></header>" + body + "</div>";
    $("#view").innerHTML = h;
  }

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
    var list = roles.filter(function (r) { return r !== "general" && set[r]; });
    if (list.length < 2) {
      var info = list.length ? roleInfo(list[0]) : GENERAL, gen = info === GENERAL;
      return '<aside class="role-ex" aria-label="Example for your role"><div class="role-ex-h"><span class="tag">' + (gen ? "Example" : "In your role") + "</span><b>" + (gen ? "For any role" : esc(info.name)) + '</b><a href="#role">Change roles</a></div><p>' + (gen ? set.general : set[info.id]) + "</p></aside>";
    }
    return '<aside class="role-ex" aria-label="Examples for your roles"><div class="role-ex-h"><span class="tag">In your roles</span><span class="rx-tabs" role="group" aria-label="Show the example for">' + list.map(function (r, i) {
      return '<button type="button" class="rx-btn" data-rx="' + r + '" aria-pressed="' + (i === 0) + '">' + esc(roleInfo(r).name) + "</button>";
    }).join("") + '</span><a href="#role">Change roles</a></div>' + list.map(function (r, i) { return '<p data-rx-p="' + r + '"' + (i ? " hidden" : "") + ">" + set[r] + "</p>"; }).join("") + "</aside>";
  }
  function renderLesson(id) {
    var l = byId[id], c = GW.content[id], path = routeFor(roles), onPath = path.indexOf(id) > -1;
    var seq = onPath ? path.map(function (x) { return byId[x]; }) : GW.lessons;
    var idx = seq.indexOf(l), prev = seq[idx - 1], next = seq[idx + 1];
    var h = '<article class="lesson">';
    h += '<header class="lesson-head"><h1>' + esc(l.title) + "</h1>";
    h += '<p class="meta"><span><b>Lesson ' + l.num + "</b></span><span>" + l.minutes + " min</span>" + (roles.length ? (onPath ? "<span>Step " + (idx + 1) + " of " + seq.length + " on your path</span>" : '<span class="path-off">Not on your path</span>') : "") + "</p>";
    h += '<details class="toc-m"><summary>On this page</summary><nav aria-label="On this page, compact"></nav></details>';
    h += '<p class="lede">' + c.lede + "</p>";
    h += '<div class="lsn-steps" hidden><div class="h"><span>In this lesson</span><b id="ls-cur"></b></div><ol></ol></div>';
    h += '<div class="outcomes"><h2 class="oc-h">After this lesson you can</h2><ul>' + c.outcomes.map(function (o) { return "<li>" + o + "</li>"; }).join("") + "</ul></div></header>";
    h += '<div class="lsn-side"><div class="learn"><h2>You\'ll learn</h2><ul>' + c.outcomes.map(function (o) { return '<li><span class="box"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>' + o + "</span></li>"; }).join("") + '</ul></div><nav class="toc" aria-label="On this page"><h2 class="toc-h">On this page</h2></nav></div>';
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
    $$(".activity", view).forEach(function (a, i) { a.id = "ex-" + (i + 1); });

    // table of contents
    var toc = $(".toc", view), heads = $$(".lesson > h2, .lesson > section > h2", view);
    var strip = $(".lsn-steps", view), stripOl = $("ol", strip);
    strip.hidden = heads.length < 2;
    heads.forEach(function (hd, k) {
      var li = document.createElement("li"), sb = document.createElement("button");
      sb.type = "button"; sb.textContent = k + 1; sb.title = hd.textContent; sb.setAttribute("aria-label", "Section " + (k + 1) + ": " + hd.textContent);
      sb.addEventListener("click", function () { hd.scrollIntoView({ behavior: "smooth", block: "start" }); });
      li.appendChild(sb); stripOl.appendChild(li);
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
      $$("li", stripOl).forEach(function (li, j) { li.classList.toggle("done", j < k); li.classList.toggle("cur", j === k); });
      var cur = $("#ls-cur", view); if (cur) cur.textContent = heads[k] ? (k + 1) + " of " + heads.length + ": " + heads[k].textContent : "";
      var outs = $$(".learn li", view), n = outs.length, H = heads.length;
      outs.forEach(function (li, i) { li.classList.toggle("on", !!progress[id] || readAt + 1 >= Math.ceil((i + 1) * H / n)); });
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

    enhance(view);
    if (pendingSection) {
      var t = document.getElementById(pendingSection); pendingSection = null;
      if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 30);
    }
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
      if (fn) { try { fn(el); } catch (e) { el.textContent = "This activity could not load."; console.error(e); } }
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
    if (uc) { ucScope = uc.getAttribute("data-ucscope"); save("gw-ucscope", ucScope); renderUseCases(); var g = $('[data-ucscope="' + ucScope + '"]'); if (g) g.focus(); }
    var hs = e.target.closest("[data-homescope]");
    if (hs) { homeScope = hs.getAttribute("data-homescope"); save("gw-homescope", homeScope); renderHome(); var hf = $('[data-homescope="' + homeScope + '"]'); if (hf) hf.focus(); }
    var sc2 = e.target.closest("[data-exscope]");
    if (sc2) { exScope = sc2.getAttribute("data-exscope"); save("gw-exscope", exScope); renderExercises(); var f = $('[data-exscope="' + exScope + '"]'); if (f) f.focus(); }
    var cp = e.target.closest("[data-copy]");
    if (cp) {
      var link = cp.getAttribute("data-copy") === "link", box = cp.closest(".transfer, .save-strip"), msg = box && $("[data-copy-msg]", box);
      copyText(link ? resumeLink() : prettyCode(encodeProgress()), function (ok) {
        if (msg) msg.textContent = ok ? (link ? "Resume link copied. Open it on your other device." : "Code copied.") : "Couldn't copy automatically. Select the code and copy it yourself.";
      });
    }
    if (e.target.closest(".rail a") && innerWidth <= 960) $("#rail").classList.remove("open");
  });
  document.addEventListener("keydown", function (e) {
    var t = e.target.closest && e.target.closest(".term");
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPop(t); }
    if (e.key === "Escape") { closePop(); closeSearch(); $("#rail").classList.remove("open"); }
    if (document.body.classList.contains("bare")) return;
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName))) { e.preventDefault(); openSearch(); }
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
      ["Lessons", "Sections", "Terms"].forEach(function (g) {
        var grp = rest.filter(function (r) { return r.x.g === g; }).slice(0, 5);
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
    if (location.hash === "#" + r.go) route(); else location.hash = r.go;
  }

  /* ---------- router ---------- */
  var pendingSection = null, pendingTerm = null, pendingScroll = null, pendingCode = null;
  function doPendingScroll(smooth) {
    if (!pendingScroll) return;
    var el = document.getElementById(pendingScroll); pendingScroll = null;
    if (el) el.scrollIntoView({ behavior: smooth === true && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto", block: "start" });
  }
  var inner = function (h) { return byId[h] || h === "glossary" || h === "home" || h === "exercises" || h === "usecases"; };
  function route() {
    closePop(); closeSearch();
    var h = (location.hash || "").replace(/^#/, "");
    // the workflow: landing → choose roles → course; a resume link restores a code first
    if (h.indexOf("resume=") === 0) {
      var d = decodeProgress(decodeURIComponent(h.slice(7)));
      if (d.error) { pendingCode = { code: decodeURIComponent(h.slice(7)), err: d.error }; location.replace("#progress"); return; }
      applyProgress(d);
      notice = "Progress restored from your link: " + pathLong(roles) + ", " + doneOf(routeFor(roles)) + " of " + routeFor(roles).length + " lessons done.";
      location.replace("#home"); return;
    }
    var open = h === "welcome" || h === "role" || h === "progress";
    if (!roles.length && !open) { if (inner(h) && h !== "home") { resumeTo = h; location.replace("#role"); } else location.replace("#welcome"); return; }
    if (h === "") { location.replace("#home"); return; }
    var title = "Groundwork", bare = h === "welcome" || h === "role" || (h === "progress" && !roles.length);
    paintTopbar(bare ? "bare" : byId[h] ? "lesson" : "tabs", byId[h] ? "home" : h);
    $("#rail").classList.remove("open");
    if (h === "welcome") { renderWelcome(); title = "Groundwork · AI for software teams"; }
    else if (h === "progress") { var pc = pendingCode || {}; pendingCode = null; renderProgress(pc.code, pc.err); title = (roles.length ? "Progress" : "Continue with a code") + " · Groundwork"; }
    else if (h === "role") { renderRolePicker(); title = "Choose your roles · Groundwork"; }
    else if (byId[h] && GW.content[h]) { renderLesson(h); renderRail(h); title = byId[h].title + " · Groundwork"; }
    else if (h === "glossary") { renderGlossary(); title = "Glossary · Groundwork"; }
    else if (h === "exercises") { renderExercises(); title = "Exercises · Groundwork"; }
    else if (h === "usecases" && hasUseCases) { renderUseCases(); title = "Use cases · Groundwork"; }
    else { renderHome(); title = "Lessons · Groundwork"; }
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
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute("content", d ? "#0B0B0A" : "#FAFAF9"); m.removeAttribute("media"); });
  }
  $("#theme-btn").addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("gw-theme", next); } catch (e) {}
    paintTheme();
  });
  if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener("change", paintTheme);
  paintTheme();
  route();

})();
