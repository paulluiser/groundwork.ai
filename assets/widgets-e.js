/* Widgets for the role tracks: a config-driven "make the call" exercise, plus the exercise configs
   that each role-track lesson file registers in GW.trackCfg (content loads before the widgets). */
(function () {
  var W = GW.widgets, C = GW.cfg;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  Object.keys(GW.trackCfg || {}).forEach(function (k) { C[k] = GW.trackCfg[k]; });

  /* ---------- Make the call: a short run of situations, one decision each ----------
     cfg: { steps: [{ title, sit, opts: [[choice, feedback], ...], a }], after } */
  W.decide = function (el) {
    var cfg = C[el.getAttribute("data-cfg")], steps = cfg.steps, i = 0, score = 0;
    var root = document.createElement("div"); root.className = "scn"; el.appendChild(root);
    function render() {
      if (i >= steps.length) {
        root.innerHTML = '<div class="scn-progress">' + steps.map(function () { return '<i class="on"></i>'; }).join("") + "</div><h3>" + score + " of " + steps.length + " decisions matched the recommended approach</h3><p>" + (cfg.after || "") + '</p><button class="btn small ghost" data-act="again">Start again</button>';
        root.querySelector("[data-act]").addEventListener("click", function () { i = 0; score = 0; render(); });
        return;
      }
      var s = steps[i];
      root.innerHTML = '<div class="scn-progress">' + steps.map(function (x, k) { return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '</div><div class="scn-role">Situation ' + (i + 1) + " of " + steps.length + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.sit) + '</p><div class="opts">' + s.opts.map(function (o, k) { return '<button class="opt" data-k="' + k + '"><span class="ltr">' + "ABCD"[k] + "</span><span>" + esc(o[0]) + "</span></button>"; }).join("") + '</div><div class="fb" hidden aria-live="polite"></div><div class="scn-next" hidden></div>';
      var answered = false;
      root.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          var k = +b.dataset.k, ok = k === s.a;
          if (!answered && ok) score += 1;
          answered = true;
          root.querySelectorAll(".opt").forEach(function (x) { x.classList.remove("right", "wrong"); });
          b.classList.add(ok ? "right" : "wrong");
          var fb = root.querySelector(".fb"); fb.hidden = false; fb.className = "fb " + (ok ? "right" : "wrong");
          fb.innerHTML = "<b>" + (ok ? "Good call. " : "Think again. ") + "</b>" + esc(ok ? s.opts[k][1].replace(/^Right\.\s*/, "") : s.opts[k][1]) + (ok ? "" : " Try another option.");
          var row = root.querySelector(".scn-next"); row.hidden = !ok;
          row.innerHTML = ok ? '<button class="btn small" data-act="next">' + (i + 1 < steps.length ? "Next situation" : "See the result") + "</button>" : "";
          var nx = row.querySelector('[data-act="next"]');
          if (nx) { row.scrollIntoView({ block: "nearest", behavior: "smooth" }); nx.addEventListener("click", function () { i += 1; render(); root.scrollIntoView({ block: "nearest" }); }); nx.focus({ preventScroll: true }); }
        });
      });
    }
    render();
  };
})();

/* ---------- Simulation stage: a step-by-step diagram with live numbers ----------
   cfg: { nodes: { key: { x, y, tone, label } }, path: [keys for the dashed wire], metrics: [labels],
          steps: [{ badge, tone, label, title, text, changed: [..], bad: [indexes into changed],
                    show: [node keys], dot: [from, to, isReply], pill: [node, text, isBad], tones: { node: tone },
                    m: [values], hot: index, badm: index, goodm: index }] } */
(function () {
  var W = GW.widgets, C = GW.cfg;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var CHK = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2.6"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  W.sim = function (el) {
    var cfg = C[el.getAttribute("data-cfg")], S = cfg.steps, N = cfg.nodes, i = 0, raf = 0;
    var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var root = document.createElement("div"); root.className = "sim"; root.tabIndex = 0;
    root.setAttribute("role", "group"); root.setAttribute("aria-label", "Simulation. Use the left and right arrow keys to move between steps.");
    root.innerHTML = '<div class="sim-top"><div class="sim-metrics"></div><button type="button" class="btn small ghost" data-act="replay">Replay</button></div>' +
      '<div class="sim-body"><div class="sim-floor"><svg viewBox="56 0 448 252" role="img" aria-label="Diagram for this step"></svg><div class="sim-legend"><span><i></i>request</span><span><i class="back"></i>reply</span></div></div>' +
      '<div class="sim-narr" aria-live="polite"></div></div><ol class="sim-steps"></ol>';
    el.appendChild(root);
    var sv = root.querySelector("svg");
    function mid(k) { return [N[k].x, N[k].y + 14]; }
    function block(n, k, tone) {
      var x = n.x, y = n.y, w = 48, d = 26, h = 24;
      var top = [x, y - d, x + w, y - d + h, x, y - d + 2 * h, x - w, y - d + h].join(" ");
      var L = [x - w, y - d + h, x, y - d + 2 * h, x, y - d + 2 * h + d, x - w, y - d + h + d].join(" ");
      var R = [x, y - d + 2 * h, x + w, y - d + h, x + w, y - d + h + d, x, y - d + 2 * h + d].join(" ");
      return '<g class="sim-in" style="animation-delay:' + k * 50 + 'ms"><polygon class="face" points="' + L + '"/><polygon class="shade deep" points="' + L + '"/><polygon class="face" points="' + R + '"/><polygon class="shade" points="' + R + '"/><polygon class="face f-' + tone + '" points="' + top + '"/><text class="lbl" x="' + x + '" y="' + (y - d + h + 4) + '">' + esc(n.label) + "</text></g>";
    }
    function pill(k, t, bad) {
      var n = N[k], w = t.length * 7 + 20, x = Math.max(6, Math.min(554 - w, n.x - w / 2)), y = n.y - 80;
      return '<g class="pill sim-in' + (bad ? " bad" : "") + '" style="animation-delay:100ms"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="24" rx="6"/><text x="' + (x + 10) + '" y="' + (y + 12) + '">' + esc(t) + "</text></g>";
    }
    function move(a, b) {
      var d = sv.querySelector(".dot"); cancelAnimationFrame(raf);
      if (RM) { d.setAttribute("cx", b[0]); d.setAttribute("cy", b[1]); return; }
      var t0 = performance.now() + 200, D = 650;
      (function f(t) { var p = Math.max(0, Math.min(1, (t - t0) / D)), e = 1 - Math.pow(1 - p, 3); d.setAttribute("cx", a[0] + (b[0] - a[0]) * e); d.setAttribute("cy", a[1] + (b[1] - a[1]) * e); if (p < 1) raf = requestAnimationFrame(f); })(performance.now());
    }
    function draw() {
      var s = S[i], out = '<path class="wire" d="M' + cfg.path.map(mid).join(" L") + '"/>';
      s.show.forEach(function (k, j) { out += block(N[k], j, (s.tones && s.tones[k]) || N[k].tone); });
      if (s.pill) out += pill(s.pill[0], s.pill[1], s.pill[2]);
      out += '<circle class="dot' + (s.dot && s.dot[2] ? " back" : "") + '" r="6" cx="-20" cy="-20"/>';
      sv.innerHTML = out;
      if (s.dot) move(mid(s.dot[0]), mid(s.dot[1]));
      root.querySelector(".sim-metrics").innerHTML = cfg.metrics.map(function (lab, j) {
        var c = j === s.hot ? " is-changed" : ""; if (j === s.badm) c = " is-bad"; if (j === s.goodm) c = " is-good";
        return '<div class="sim-metric' + c + '"><span class="k">' + esc(lab) + '</span><span class="v">' + esc(s.m[j]) + "</span></div>";
      }).join("");
      root.querySelector(".sim-narr").innerHTML = '<div class="st"><span>Step ' + (i + 1) + " of " + S.length + '</span><span class="sim-badge t-' + s.tone + '">' + esc(s.badge) + "</span></div>" +
        '<h3 class="sim-in">' + esc(s.title) + '</h3><p class="sim-in" style="animation-delay:50ms">' + esc(s.text) + '</p><p class="wc">What changed</p><ul>' +
        s.changed.map(function (c, j) { return '<li class="' + (s.bad && s.bad.indexOf(j) > -1 ? "bad" : "") + '">' + esc(c) + "</li>"; }).join("") +
        '</ul><div class="sim-nav"><button type="button" class="btn small ghost" data-act="back"' + (i ? "" : " disabled") + '>Back</button><button type="button" class="btn small pill dark" data-act="next">' + (i < S.length - 1 ? "Next: " + esc(S[i + 1].label) : "Start again") + '</button></div><p class="sim-hint"><kbd>←</kbd> <kbd>→</kbd> to step</p>';
      root.querySelector(".sim-steps").innerHTML = S.map(function (x, j) {
        return '<li class="' + (j < i ? "done" : j === i ? "cur" : "") + '"><button type="button" data-j="' + j + '" aria-label="Step ' + (j + 1) + ": " + esc(x.label) + '">' + (j < i ? CHK : j + 1) + "</button><span>" + esc(x.label) + "</span></li>";
      }).join("");
    }
    function go(j) { i = Math.max(0, Math.min(S.length - 1, j)); draw(); }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.j) go(+b.dataset.j);
      else if (b.dataset.act === "next") go(i < S.length - 1 ? i + 1 : 0);
      else if (b.dataset.act === "back") go(i - 1);
      else if (b.dataset.act === "replay") draw();
    });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    });
    draw();
  };
})();
