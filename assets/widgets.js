/* Interactive activities. Each widget receives its host element; configs live in GW.cfg. */
(function () {
  "use strict";
  var W = GW.widgets = {};
  var C = GW.cfg = GW.cfg || {};
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var uid = 0; function id(p) { uid += 1; return p + "-" + uid; }
  function h(html) { var d = document.createElement("div"); d.className = "w"; d.innerHTML = html; return d; }

  /* ---------- 1. Tokenizer illustration ---------- */
  W.tokens = function (el) {
    var iid = id("tok");
    var box = h('<label for="' + iid + '">Text</label><input type="text" id="' + iid + '" value="Our checkout API returned 503 errors for 14 minutes after deployment."><div class="toks" aria-live="polite"></div><div class="stat-row"><div class="stat"><b data-k="c">0</b><span>characters</span></div><div class="stat"><b data-k="t">0</b><span>tokens (approx.)</span></div><div class="stat"><b data-k="r">0</b><span>characters per token</span></div></div><p class="muted" style="margin:10px 0 0">Illustration only. Real tokenizers learn their splits from data, so exact pieces and counts differ between models.</p>');
    el.appendChild(box);
    var common = /^(the|a|an|and|or|of|to|in|for|on|at|is|was|are|be|it|we|our|you|your|with|from|by|after|before|this|that|api|error|errors|user|users|page|data|test|tests|code|deploy|release|team|build|server|minutes|returned|checkout|failed|because)$/i;
    function split(text) {
      var parts = text.match(/\s*[A-Za-z]+|\s*\d{1,3}|\s*[^\sA-Za-z\d]|\s+/g) || [];
      var out = [];
      parts.forEach(function (p) {
        var lead = p.match(/^\s*/)[0], core = p.slice(lead.length);
        if (/^[A-Za-z]+$/.test(core) && core.length > 6 && !common.test(core)) {
          out.push(lead + core.slice(0, 5)); var rest = core.slice(5);
          while (rest.length) { out.push(rest.slice(0, 4)); rest = rest.slice(4); }
        } else out.push(p);
      });
      return out;
    }
    var inp = box.querySelector("input");
    function draw() {
      var t = split(inp.value);
      box.querySelector(".toks").innerHTML = t.map(function (x) { return "<span>" + esc(x.replace(/ /g, "·")) + "</span>"; }).join("");
      box.querySelector('[data-k="c"]').textContent = inp.value.length;
      box.querySelector('[data-k="t"]').textContent = t.length;
      box.querySelector('[data-k="r"]').textContent = t.length ? (inp.value.length / t.length).toFixed(1) : "0";
    }
    inp.addEventListener("input", draw); draw();
  };

  /* ---------- 2. Next-token sampler ---------- */
  W.sampler = function (el) {
    var cands = [
      ["database", 0.30, "connection pool ran out of free connections."],
      ["build", 0.17, "cache held a stale copy of a dependency."],
      ["tests", 0.14, "timed out waiting for the payment stub."],
      ["config", 0.12, "file still pointed at the staging database."],
      ["certificate", 0.09, "had expired at midnight."],
      ["migration", 0.07, "locked the orders table for six minutes."],
      ["network", 0.06, "policy blocked traffic to the new region."],
      ["server", 0.04, "ran out of disk space during the upload."],
      ["cat", 0.01, "walked across the deploy button."]
    ];
    var rid = id("temp");
    var box = h('<div class="sentence" aria-live="polite"><span class="base">The deploy failed because the</span><span class="gen"></span><span class="cursor"></span></div>' +
      '<div class="w-row" style="margin-top:14px"><label for="' + rid + '">Temperature <b class="tv">1.0</b></label><input type="range" id="' + rid + '" min="0" max="2" step="0.1" value="1"></div>' +
      '<div class="bars"></div>' +
      '<div class="w-row"><button class="btn small" data-act="gen">Generate a sentence</button><button class="btn small ghost" data-act="many">Sample 20 times</button><button class="btn small ghost" data-act="reset">Reset</button></div><div class="result" hidden></div>');
    el.appendChild(box);
    var slider = box.querySelector("input"), bars = box.querySelector(".bars"), gen = box.querySelector(".gen"), res = box.querySelector(".result");
    bars.innerHTML = cands.map(function (c) { return '<div class="bar-row" data-word="' + c[0] + '"><span class="lab">' + c[0] + '</span><span class="trk"><span class="fill"></span></span><span class="pct"></span></div>'; }).join("");
    function dist(T) {
      if (T < 0.05) return cands.map(function (c, i) { return i === 0 ? 1 : 0; });
      var w = cands.map(function (c) { return Math.pow(c[1], 1 / T); }), s = w.reduce(function (a, b) { return a + b; }, 0);
      return w.map(function (x) { return x / s; });
    }
    function paint() {
      var T = parseFloat(slider.value), d = dist(T);
      box.querySelector(".tv").textContent = T.toFixed(1);
      Array.prototype.forEach.call(bars.children, function (row, i) {
        row.querySelector(".fill").style.transform = "scaleX(" + d[i].toFixed(3) + ")";
        row.querySelector(".pct").textContent = (d[i] * 100 < 0.1 && d[i] > 0 ? "<0.1" : (d[i] * 100).toFixed(1)) + "%";
      });
      return d;
    }
    function pick(d) { var r = Math.random(), acc = 0; for (var i = 0; i < d.length; i++) { acc += d[i]; if (r <= acc) return i; } return d.length - 1; }
    var timer = null;
    function clearPicked() { Array.prototype.forEach.call(bars.children, function (r) { r.classList.remove("picked"); }); }
    function generate() {
      clearTimeout(timer); clearPicked(); res.hidden = true;
      var d = paint(), i = pick(d), c = cands[i];
      bars.children[i].classList.add("picked");
      var words = [c[0]].concat(c[2].split(" ")), k = 0; gen.innerHTML = "";
      (function step() {
        if (k >= words.length) {
          res.hidden = false;
          res.className = "result" + (c[0] === "cat" ? " bad" : "");
          res.innerHTML = c[0] === "cat" ? "The model picked a 1% token. Every later word followed fluently from it, which is how high temperature produces confident nonsense." :
            "Picked <b>" + c[0] + "</b> (" + (d[i] * 100).toFixed(1) + "% at this temperature). The rest of the sentence was built the same way, one token at a time, each following from the words before it.";
          return;
        }
        var s = document.createElement("span"); s.className = "new"; s.textContent = " " + words[k];
        Array.prototype.forEach.call(gen.querySelectorAll(".new"), function (n) { n.className = ""; });
        gen.appendChild(s); k += 1; timer = setTimeout(step, reduced ? 0 : 170);
      })();
    }
    box.querySelector('[data-act="gen"]').addEventListener("click", generate);
    box.querySelector('[data-act="many"]').addEventListener("click", function () {
      clearPicked(); var d = paint(), tally = cands.map(function () { return 0; });
      for (var n = 0; n < 20; n++) tally[pick(d)] += 1;
      var parts = cands.map(function (c, i) { return tally[i] ? "<b>" + c[0] + "</b> ×" + tally[i] : null; }).filter(Boolean);
      res.hidden = false; res.className = "result";
      res.innerHTML = "20 samples at temperature " + parseFloat(slider.value).toFixed(1) + ": " + parts.join(", ") + ". " + (parts.length === 1 ? "Every run gave the same first word." : parts.length + " different first words, each one the start of an equally fluent sentence.");
    });
    box.querySelector('[data-act="reset"]').addEventListener("click", function () { clearTimeout(timer); gen.innerHTML = ""; res.hidden = true; clearPicked(); slider.value = 1; paint(); });
    slider.addEventListener("input", function () { clearPicked(); paint(); });
    paint();
  };

  /* ---------- 3. Context window budget ---------- */
  W.context = function (el) {
    var items = [
      { k: "sys", name: "Product's system instructions", tk: 1500, on: true, lock: true, col: "#0B0B0B", fg: "#FFFFFF" },
      { k: "mem", name: "Project notes (memory)", tk: 2000, on: true, col: "#3A3A3A", fg: "#FFFFFF" },
      { k: "chat", name: "Conversation so far: 40 messages, including the agreed design constraints", tk: 14000, on: true, col: "#AEB9FF", trim: true },
      { k: "spec", name: "Full API specification PDF (60 pages)", tk: 38000, on: false, col: "#C6C6C6" },
      { k: "code", name: "Five relevant source files", tk: 11000, on: true, col: "#EDF0FF" },
      { k: "log", name: "Last month's incident log export", tk: 70000, on: false, col: "#DCDCDC" },
      { k: "q", name: "Your question", tk: 300, on: true, lock: true, col: "#2F4BFF", fg: "#FFFFFF" },
      { k: "reply", name: "Room reserved for the reply", tk: 4000, on: true, lock: true, col: "#F4F4F4" }
    ];
    var sizes = [32000, 128000, 200000], size = 32000;
    var box = h('<div class="w-row" role="group" aria-label="Context window size"><span class="muted">Window size:</span>' + sizes.map(function (s) { return '<button class="chip" data-size="' + s + '" aria-pressed="' + (s === size) + '">' + (s / 1000) + "k tokens</button>"; }).join("") + '</div>' +
      '<div class="ctx-bar" aria-hidden="true"></div><div class="ctx-scale"><span>0</span><span class="cap"></span></div><div class="result" aria-live="polite"></div><div class="ctx-legend"></div>');
    el.appendChild(box);
    var bar = box.querySelector(".ctx-bar"), leg = box.querySelector(".ctx-legend"), res = box.querySelector(".result");
    leg.innerHTML = items.map(function (it) {
      return '<button class="ctx-item" data-k="' + it.k + '" aria-pressed="' + it.on + '"' + (it.lock ? ' disabled' : "") + '><span class="sw" style="background:' + it.col + '"></span><span>' + esc(it.name) + (it.lock ? ' <span class="muted">(always sent)</span>' : "") + '</span><span class="tk"></span></button>';
    }).join("");
    function draw() {
      var used = {}, total = 0;
      items.forEach(function (it) { used[it.k] = it.on ? it.tk : 0; total += used[it.k]; });
      var over = Math.max(0, total - size), trimmed = 0, rejected = [];
      if (over > 0) { var chat = items[2]; if (chat.on) { trimmed = Math.min(over, chat.tk - 2000); used.chat -= trimmed; over -= trimmed; } }
      if (over > 0) {
        ["log", "spec", "code", "mem"].forEach(function (k) {
          if (over <= 0) return; var it = items.filter(function (x) { return x.k === k; })[0];
          if (it.on) { rejected.push(it); over -= used[k]; used[k] = 0; }
        });
      }
      var fit = 0; items.forEach(function (it) { fit += used[it.k]; });
      bar.innerHTML = items.map(function (it) {
        var w = used[it.k] / size * 100; if (w <= 0) return "";
        return '<span class="ctx-seg" style="width:' + w + "%;background:" + it.col + (it.fg ? ";color:" + it.fg : "") + '">' + (w > 9 ? esc(it.name.split(/[(:]/)[0]) : "") + "</span>";
      }).join("");
      box.querySelector(".cap").textContent = (size / 1000) + "k";
      Array.prototype.forEach.call(leg.children, function (b, i) {
        var it = items[i], cut = rejected.indexOf(it) > -1 || (it.k === "chat" && trimmed > 0);
        b.classList.toggle("cut", cut);
        b.querySelector(".tk").textContent = (it.on ? (it.k === "chat" && trimmed ? (used.chat / 1000).toFixed(1) + "k of " : "") + (it.tk / 1000).toFixed(1) + "k" : "off") + (rejected.indexOf(it) > -1 ? " · won't fit" : "");
      });
      var msg;
      if (!trimmed && !rejected.length) {
        msg = "Everything fits: " + (fit / 1000).toFixed(1) + "k of " + (size / 1000) + "k tokens.";
        if (items[5].on) { res.className = "result warn"; msg += " But a month of incident logs is irrelevant to designing an endpoint. It fits, and it will still dilute the material that matters."; }
        else if (items[3].on) { res.className = "result warn"; msg += " The full specification fits, but you need perhaps three pages of it. Pasting only the relevant section keeps the model focused."; }
        else { res.className = "result ok"; msg += " This is a focused context: the agreed constraints, the code that matters and your question."; }
      } else {
        res.className = "result bad";
        msg = "Over the limit. This simulated assistant trims the oldest conversation first";
        msg += trimmed ? ": " + (trimmed / 1000).toFixed(1) + "k tokens of early messages are gone, including the design constraints you agreed at the start." : ".";
        if (rejected.length) msg += " Then it refuses what still doesn't fit: " + rejected.map(function (r) { return r.name.split(/[(:]/)[0].trim().toLowerCase(); }).join(", ") + ".";
        msg += " Real products differ in how they handle this, and many don't tell you.";
      }
      res.innerHTML = msg;
    }
    leg.addEventListener("click", function (e) {
      var b = e.target.closest(".ctx-item"); if (!b || b.disabled) return;
      var it = items.filter(function (x) { return x.k === b.dataset.k; })[0]; it.on = !it.on; b.setAttribute("aria-pressed", it.on); draw();
    });
    box.querySelectorAll("[data-size]").forEach(function (b) {
      b.addEventListener("click", function () { size = +b.dataset.size; box.querySelectorAll("[data-size]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); draw(); });
    });
    draw();
  };

  /* ---------- 4. Flag claims, then reveal the review ---------- */
  var VERD = { ok: ["ok", "Checks out"], bad: ["bad", "Wrong"], partial: ["warn", "Partly true"], none: ["warn", "No source"], judg: ["warn", "Judgment call"] };
  W.claims = function (el) {
    var cfg = C[el.getAttribute("data-cfg")];
    var box = h((cfg.source ? '<div class="src-box">' + cfg.source + "</div>" : "") + '<div class="draft" style="margin:0"><div class="draft-h"><span><b>AI draft</b> · ' + esc(cfg.label) + '</span><span class="cnt">0 flagged</span></div><div class="draft-b"><div class="claims"></div></div></div><div class="w-row" style="margin-top:12px"><button class="btn small" data-act="rev">Reveal the review</button><button class="btn small ghost" data-act="again" hidden>Start again</button></div><div class="result" hidden aria-live="polite"></div>');
    el.appendChild(box);
    var list = box.querySelector(".claims"), res = box.querySelector(".result"), revealed = false;
    list.innerHTML = cfg.claims.map(function (c, i) { return '<button class="claim" data-i="' + i + '" aria-pressed="false">' + c.t + "</button>"; }).join("");
    list.addEventListener("click", function (e) {
      var b = e.target.closest(".claim"); if (!b || revealed) return;
      b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
      box.querySelector(".cnt").textContent = list.querySelectorAll('[aria-pressed="true"]').length + " flagged";
    });
    box.querySelector('[data-act="rev"]').addEventListener("click", function () {
      revealed = true; var risky = 0, caught = 0, extra = 0;
      cfg.claims.forEach(function (c, i) {
        var b = list.children[i], flagged = b.getAttribute("aria-pressed") === "true", v = VERD[c.v];
        if (c.v !== "ok") { risky += 1; if (flagged) caught += 1; } else if (flagged) extra += 1;
        b.classList.add("revealed");
        var s = document.createElement("span"); s.className = "verdict";
        s.innerHTML = '<span class="stamp ' + v[0] + '">' + v[1] + "</span>" + c.why + (c.v !== "ok" && !flagged ? " <b>You didn't flag this one.</b>" : "");
        b.appendChild(s);
      });
      res.hidden = false;
      res.className = "result " + (caught === risky ? "ok" : "warn");
      res.innerHTML = "You flagged <b>" + caught + " of " + risky + "</b> claims with a problem" + (extra ? ", plus " + extra + " that turned out fine. Checking those was still reasonable if they were specific and cheap to confirm." : ".") + " " + (cfg.after || "");
      this.hidden = true; box.querySelector('[data-act="again"]').hidden = false;
    });
    box.querySelector('[data-act="again"]').addEventListener("click", function () { el.innerHTML = ""; W.claims(el); });
  };

  /* ---------- 5. Sort items into buckets, feedback per item ---------- */
  W.sort = function (el) {
    var cfg = C[el.getAttribute("data-cfg")];
    var box = h('<div class="sort-list"></div><div class="result" hidden aria-live="polite"></div>');
    el.appendChild(box);
    var list = box.querySelector(".sort-list"), res = box.querySelector(".result"), answered = 0, right = 0;
    cfg.items.forEach(function (it, i) {
      var d = document.createElement("div"); d.className = "sort-item";
      d.innerHTML = "<p>" + it.t + '</p><div class="w-row" role="group">' + cfg.buckets.map(function (b, j) { return '<button class="chip" data-j="' + j + '" aria-pressed="false">' + esc(b) + "</button>"; }).join("") + '</div><div class="why" hidden></div>';
      d.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b || d.dataset.done) return;
        var j = +b.dataset.j, ok = j === it.a; d.dataset.done = "1"; answered += 1; if (ok) right += 1;
        b.setAttribute("aria-pressed", "true"); d.classList.add(ok ? "ok" : "no");
        var w = d.querySelector(".why"); w.hidden = false;
        w.innerHTML = '<span class="stamp ' + (ok ? "ok" : "bad") + '">' + (ok ? "Agreed" : "Suggested: " + esc(cfg.buckets[it.a])) + "</span> " + it.why;
        if (answered === cfg.items.length) {
          res.hidden = false; res.className = "result " + (right >= cfg.items.length - 1 ? "ok" : "warn");
          res.innerHTML = '<span class="sort-score">' + right + " of " + cfg.items.length + " match the suggested answers.</span> " + (cfg.after || "") + ' <button class="btn small ghost" data-act="again" style="margin-left:6px">Try again</button>';
          res.querySelector('[data-act="again"]').addEventListener("click", function () { el.innerHTML = ""; W.sort(el); });
        }
      });
      list.appendChild(d);
    });
  };

  /* ---------- configs for lessons 2 and 3 ---------- */
  C["context-pick"] = {
    buckets: ["Include", "Summarise first", "Leave out"],
    items: [
      { t: "The customer's message describing the double charge.", a: 0, why: "This is the thing being replied to. Without it the draft can only be generic." },
      { t: "Your published refund policy.", a: 0, why: "It lets the draft promise only what the policy allows, rather than what refund policies typically say." },
      { t: "The customer's full card number from the payment log.", a: 2, why: "The reply never needs it, and payment card data has strict handling rules. The last four digits, if anything, are enough." },
      { t: "The order ID and the timestamps of both charges.", a: 0, why: "Specific facts make the reply accurate and let the customer recognise their case. Use an approved tool for customer data." },
      { t: "A 200-message chat thread where engineers discussed last month's billing bug.", a: 1, why: "Only one fact matters: whether this customer was affected and what the fix was. Pasting the whole thread adds noise and internal detail that could leak into the reply." },
      { t: "Your team's tone guide for support replies.", a: 0, why: "Short, relevant and it shapes the output directly. Exactly the kind of context that pays off." },
      { t: "Internal account notes, including a comment that the customer is “difficult”.", a: 2, why: "Irrelevant to the draft and risky: whatever is in the context can surface in the reply." }
    ],
    after: "The principle: include what the task needs, summarise what is only partly relevant, and keep out what is sensitive or could leak into the output."
  };
  C["rate-limit"] = {
    label: "reply about API rate limiting",
    claims: [
      { t: "Return HTTP status 429 Too Many Requests, which is defined in RFC 6585.", v: "ok", why: "Correct. RFC 6585 section 4 defines 429." },
      { t: "Include a Retry-After header telling the client how long to wait. Its value can be a number of seconds or an HTTP date.", v: "ok", why: "Correct. RFC 9110 defines both forms." },
      { t: "RFC 6585 requires clients to wait at least 60 seconds before retrying.", v: "bad", why: "Fabricated. The RFC says the response may include Retry-After and sets no fixed wait. A real source cited for something it doesn't say." },
      { t: "Clients should retry with exponential backoff plus random jitter, so that many clients don't all retry at the same moment.", v: "ok", why: "Sound, widely recommended practice." },
      { t: "In Express you can turn this on with the built-in <code>app.rateLimit()</code> method.", v: "bad", why: "Fabricated. Express has no built-in rate limiter; middleware such as express-rate-limit provides it. Running the code would show this at once." },
      { t: "Most large public APIs, including GitHub's, return 429 when you exceed the rate limit.", v: "partial", why: "GitHub's docs say 403 or 429 for the primary rate limit. A client that only handles 429 would break." }
    ],
    after: "Notice which sentences were risky: the ones with exact names, numbers and rules."
  };
})();
