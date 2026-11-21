/* Interactive figures: one per lesson, part of the reading (exercises are separate and look separate).
   Nine kinds, each chosen to match what the section explains:
   flow (a pipeline you step through), cycle (a loop), timeline (events in order), spectrum (a scale with stops),
   matrix (a 2x2 you explore), zones (trust boundaries and the flows across them), stack (parts that must fit a limit),
   compare (two versions side by side) and hotspots (an annotated artifact).
   Specs live in GW.figures, keyed by lesson id. `at` names the section heading the figure follows. */
(function () {
  "use strict";
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var KIND = { flow: "Step through", cycle: "Loop", timeline: "Timeline", spectrum: "Scale", matrix: "Map", zones: "Trust map", stack: "Fit the limit", compare: "Compare", hotspots: "Annotated" };
  var KIC = { flow: "flow", cycle: "cycle", timeline: "timeline", spectrum: "sliders", matrix: "grid", zones: "shield", stack: "layers", compare: "columns", hotspots: "pin" };
  var R = {};

  // shared: a detail panel with previous / next, for the kinds you step through
  function stepper(box, items, onPick, label) {
    var d = document.createElement("div"); d.className = "fg-detail"; d.setAttribute("aria-live", "polite");
    var nav = document.createElement("div"); nav.className = "fg-nav";
    nav.innerHTML = '<button type="button" class="btn small ghost" data-p>Previous</button><span class="fg-pos"></span><button type="button" class="btn small" data-n>Next</button>';
    box.appendChild(d); box.appendChild(nav);
    var cur = 0;
    function go(i) {
      cur = Math.max(0, Math.min(items.length - 1, i));
      var it = items[cur];
      d.innerHTML = "<b>" + esc(it.t) + "</b><p>" + it.d + "</p>";
      nav.querySelector(".fg-pos").textContent = (label || "Step") + " " + (cur + 1) + " of " + items.length;
      nav.querySelector("[data-p]").disabled = cur === 0;
      nav.querySelector("[data-n]").disabled = cur === items.length - 1;
      onPick(cur);
    }
    nav.querySelector("[data-p]").addEventListener("click", function () { go(cur - 1); });
    nav.querySelector("[data-n]").addEventListener("click", function () { go(cur + 1); });
    return go;
  }
  function pressOnly(list, i) { list.forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === i)); b.classList.toggle("past", j < i); }); }

  R.flow = function (box, f) {
    var ol = document.createElement("ol"); ol.className = "fg-flow" + (f.loop ? " loop" : "");
    ol.innerHTML = f.steps.map(function (s, i) { return '<li><button type="button" data-i="' + i + '"><span class="n">' + (i + 1) + "</span>" + esc(s.t) + "</button></li>"; }).join("");
    box.appendChild(ol);
    if (f.loop) { var lp = document.createElement("p"); lp.className = "fg-loopnote"; lp.textContent = "↺ " + f.loop; box.appendChild(lp); }
    var bs = [].slice.call(ol.querySelectorAll("button"));
    var go = stepper(box, f.steps, function (i) { pressOnly(bs, i); });
    bs.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    go(0);
  };

  R.cycle = function (box, f) {
    var n = f.steps.length, wrap = document.createElement("div"); wrap.className = "fg-cycle";
    var svg = '<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="74" class="ring"/>';
    for (var k = 0; k < n; k++) { var a = (k + .5) / n * Math.PI * 2 - Math.PI / 2, x = 100 + 74 * Math.cos(a), y = 100 + 74 * Math.sin(a), rot = a * 180 / Math.PI + 90; svg += '<path class="arr" d="M -4 -3 L 2 0 L -4 3" transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + (rot - 90 + 90).toFixed(1) + ')"/>'; }
    svg += "</svg>";
    wrap.innerHTML = svg + '<p class="fg-hub">' + esc(f.hub || "") + "</p>" + f.steps.map(function (s, i) {
      var a = i / n * Math.PI * 2 - Math.PI / 2;
      return '<button type="button" style="left:' + (50 + 37 * Math.cos(a)).toFixed(1) + "%;top:" + (50 + 37 * Math.sin(a)).toFixed(1) + '%" data-i="' + i + '"><span class="n">' + (i + 1) + "</span>" + esc(s.t) + "</button>";
    }).join("");
    box.appendChild(wrap);
    var bs = [].slice.call(wrap.querySelectorAll("button"));
    var go = stepper(box, f.steps, function (i) { pressOnly(bs, i); });
    bs.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    go(0);
  };

  R.timeline = function (box, f) {
    var ol = document.createElement("ol"); ol.className = "fg-time";
    ol.innerHTML = f.events.map(function (e, i) { return '<li><button type="button" data-i="' + i + '"><time>' + esc(e.at) + "</time><span>" + esc(e.t) + "</span></button></li>"; }).join("");
    box.appendChild(ol);
    var bs = [].slice.call(ol.querySelectorAll("button"));
    var go = stepper(box, f.events, function (i) { pressOnly(bs, i); bs.forEach(function (b, j) { b.parentNode.classList.toggle("hide", j > i && f.reveal); }); }, "Event");
    bs.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    go(0);
  };

  R.spectrum = function (box, f) {
    var n = f.stops.length, w = document.createElement("div"); w.className = "fg-spec";
    w.innerHTML = '<div class="fg-ends"><span>' + esc(f.from) + "</span><span>" + esc(f.to) + '</span></div><div class="fg-track"><div class="fg-fill"></div>' +
      f.stops.map(function (s, i) { return '<button type="button" style="left:' + (i / (n - 1) * 100) + '%" data-i="' + i + '" aria-label="' + esc(s.t) + '"></button>'; }).join("") +
      '</div><label class="sr-only" for="' + f.id + '">' + esc(f.title) + '</label><input type="range" id="' + f.id + '" min="0" max="' + (n - 1) + '" step="1" value="0">';
    box.appendChild(w);
    var bs = [].slice.call(w.querySelectorAll(".fg-track button")), range = w.querySelector("input"), fill = w.querySelector(".fg-fill");
    var go = stepper(box, f.stops, function (i) {
      pressOnly(bs, i); range.value = i; fill.style.width = (i / (n - 1) * 100) + "%";
      range.setAttribute("aria-valuetext", f.stops[i].t);
    }, "Level");
    bs.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    range.addEventListener("input", function () { go(+range.value); });
    go(f.start || 0);
  };

  R.matrix = function (box, f) {
    var m = document.createElement("div"); m.className = "fg-matrix";
    m.innerHTML = '<div class="fg-plot">' + f.q.map(function (q, i) { return '<span class="q q' + i + '">' + esc(q) + "</span>"; }).join("") +
      f.points.map(function (p, i) { return '<button type="button" style="left:' + p.x + "%;bottom:" + p.y + '%" data-i="' + i + '"><i>' + (i + 1) + '</i><span>' + esc(p.t) + "</span></button>"; }).join("") +
      '</div><p class="ax ax-x">' + esc(f.x) + ' →</p><p class="ax ax-y">' + esc(f.y) + " →</p>";
    box.appendChild(m);
    var bs = [].slice.call(m.querySelectorAll(".fg-plot button"));
    var go = stepper(box, f.points, function (i) { pressOnly(bs, i); bs.forEach(function (b) { b.classList.remove("past"); }); }, "Item");
    bs.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    go(0);
  };

  R.zones = function (box, f) {
    var z = document.createElement("div"); z.className = "fg-zones";
    z.innerHTML = f.zones.map(function (zn) {
      return '<div class="zone ' + (zn.trust || "") + '"><p class="zn">' + esc(zn.name) + "</p>" + zn.items.map(function (it) { return '<span class="zi" data-n="' + esc(it) + '">' + esc(it) + "</span>"; }).join("") + "</div>";
    }).join("");
    var fl = document.createElement("div"); fl.className = "fg-flows"; fl.setAttribute("role", "group"); fl.setAttribute("aria-label", "Flows");
    fl.innerHTML = f.flows.map(function (x, i) { return '<button type="button" data-i="' + i + '">' + esc(x.from) + " → " + esc(x.to) + "</button>"; }).join("");
    box.appendChild(z); box.appendChild(fl);
    var bs = [].slice.call(fl.querySelectorAll("button"));
    var items = f.flows.map(function (x) { return { t: x.from + " → " + x.to, d: x.d }; });
    var go = stepper(box, items, function (i) {
      pressOnly(bs, i); bs.forEach(function (b) { b.classList.remove("past"); });
      [].forEach.call(z.querySelectorAll(".zi"), function (s) { var n = s.getAttribute("data-n"); s.classList.toggle("from", n === f.flows[i].from); s.classList.toggle("to", n === f.flows[i].to); });
    }, "Flow");
    bs.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    go(0);
  };

  R.stack = function (box, f) {
    var s = document.createElement("div"); s.className = "fg-stack";
    s.innerHTML = '<div class="fg-bar" aria-hidden="true"><div class="segs"></div><span class="cap"></span></div><p class="fg-status" aria-live="polite"></p><ul class="fg-parts">' +
      f.parts.map(function (p, i) { return '<li><label><input type="checkbox" data-i="' + i + '"' + (p.on ? " checked" : "") + (p.fixed ? " disabled" : "") + "><span>" + esc(p.t) + '</span><b>' + esc(p.label || p.n + " " + (f.unit || "")) + "</b></label>" + (p.d ? "<small>" + esc(p.d) + "</small>" : "") + "</li>"; }).join("") + "</ul>";
    box.appendChild(s);
    var max = f.cap * (f.room || 1.6);
    s.querySelector(".cap").style.left = (f.cap / max * 100) + "%";
    s.querySelector(".cap").setAttribute("data-l", f.capLabel || "Limit");
    function draw() {
      var tot = 0, segs = "";
      [].forEach.call(s.querySelectorAll("input"), function (c) {
        if (!c.checked) return; var p = f.parts[+c.getAttribute("data-i")]; tot += p.n;
        segs += '<span class="seg c' + (+c.getAttribute("data-i") % 5) + '" style="width:' + (Math.min(p.n, max) / max * 100) + '%" title="' + esc(p.t) + '"></span>';
      });
      s.querySelector(".segs").innerHTML = segs;
      var over = tot > f.cap, st = s.querySelector(".fg-status");
      st.className = "fg-status " + (over ? "over" : "ok");
      st.innerHTML = "<b>" + tot.toLocaleString("en-GB") + " of " + f.cap.toLocaleString("en-GB") + " " + esc(f.unit || "") + "</b> " + esc(over ? f.overText : f.okText);
    }
    s.addEventListener("change", draw); draw();
  };

  R.compare = function (box, f) {
    var c = document.createElement("div"); c.className = "fg-compare";
    c.innerHTML = '<div class="seg" role="group" aria-label="Which version">' + f.sides.map(function (sd, i) { return '<button type="button" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(sd.label) + "</button>"; }).join("") + "</div>" +
      f.sides.map(function (sd, i) { return '<div class="fg-side ' + (sd.tone || "") + '" data-s="' + i + '"' + (i ? " hidden" : "") + '><div class="fg-art">' + sd.html + '</div><ul class="fg-notes">' + sd.notes.map(function (n) { return "<li>" + n + "</li>"; }).join("") + "</ul></div>"; }).join("");
    box.appendChild(c);
    c.addEventListener("click", function (e) {
      var b = e.target.closest("[data-i]"); if (!b) return; var i = b.getAttribute("data-i");
      [].forEach.call(c.querySelectorAll("[data-i]"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      [].forEach.call(c.querySelectorAll(".fg-side"), function (x) { x.hidden = x.getAttribute("data-s") !== i; });
    });
  };

  R.hotspots = function (box, f) {
    var notes = [], a = document.createElement("div"); a.className = "fg-hot " + (f.mono ? "mono" : "doc");
    a.innerHTML = (f.head ? '<p class="fg-hh">' + esc(f.head) + "</p>" : "") + '<ol class="fg-lines">' + f.lines.map(function (l) {
      var s = typeof l === "string" ? { s: l } : l, mk = "";
      if (s.n) { notes.push({ t: s.k || "Note " + (notes.length + 1), d: s.n }); mk = '<button type="button" class="mk" data-i="' + (notes.length - 1) + '" aria-label="Note ' + notes.length + '">' + notes.length + "</button>"; }
      return '<li class="' + (s.n ? "has" : "") + '"><span class="tx">' + (esc(s.s) || "&nbsp;") + "</span>" + mk + "</li>";
    }).join("") + "</ol>";
    box.appendChild(a);
    var bs = [].slice.call(a.querySelectorAll(".mk"));
    var go = stepper(box, notes, function (i) { pressOnly(bs, i); bs.forEach(function (b) { b.classList.remove("past"); b.parentNode.classList.toggle("on", b === bs[i]); }); }, "Note");
    bs.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    go(0);
  };

  GW.figure = function (id) {
    var f = GW.figures && GW.figures[id]; if (!f || !R[f.kind]) return null;
    f.id = f.id || "fg-" + id;
    var fig = document.createElement("figure"); fig.className = "fig fig-" + f.kind; fig.setAttribute("aria-labelledby", f.id + "-t");
    fig.innerHTML = '<figcaption class="fig-h"><span class="fig-tag">' + (GW.icon ? GW.icon(KIC[f.kind]) : "") + "Interactive figure · " + KIND[f.kind] + '</span><b id="' + f.id + '-t">' + esc(f.title) + "</b>" + (f.sub ? "<span class=\"fig-sub\">" + esc(f.sub) + "</span>" : "") + '</figcaption><div class="fig-b"></div>' + (f.note ? '<p class="fig-note">' + f.note + "</p>" : "");
    try { R[f.kind](fig.querySelector(".fig-b"), f); } catch (e) { console.error(e); return null; }
    return fig;
  };
})();
