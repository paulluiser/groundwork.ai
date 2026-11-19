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
        root.innerHTML = '<div class="scn-progress">' + steps.map(function () { return '<i class="on"></i>'; }).join("") + "</div><h4>" + score + " of " + steps.length + " decisions matched the recommended approach</h4><p>" + (cfg.after || "") + '</p><button class="btn small ghost" data-act="again">Start again</button>';
        root.querySelector("[data-act]").addEventListener("click", function () { i = 0; score = 0; render(); });
        return;
      }
      var s = steps[i];
      root.innerHTML = '<div class="scn-progress">' + steps.map(function (x, k) { return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '</div><div class="scn-role">Situation ' + (i + 1) + " of " + steps.length + "</div><h4>" + esc(s.title) + "</h4><p>" + esc(s.sit) + '</p><div class="opts">' + s.opts.map(function (o, k) { return '<button class="opt" data-k="' + k + '"><span class="ltr">' + "ABCD"[k] + "</span><span>" + esc(o[0]) + "</span></button>"; }).join("") + '</div><div class="fb" hidden aria-live="polite"></div><div class="scn-next" hidden></div>';
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
