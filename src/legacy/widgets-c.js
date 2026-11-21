/* Activities for the role lessons and the capstone. */
(function () {
  "use strict";
  var W = GW.widgets, C = GW.cfg;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function h(html) { var d = document.createElement("div"); d.className = "w"; d.innerHTML = html; return d; }

  /* ---------- claim-check configs ---------- */
  C["pm-synthesis"] = {
    label: "interview summary",
    source: "<b>Interview excerpts</b><br><b>P1:</b> “Exporting to Excel is the first thing I do every Monday. The built-in reports never have the columns my director wants.”<br><b>P2:</b> “Honestly I don't use the reports. I check the dashboard on my phone; that's enough.”<br><b>P3:</b> “I export, then I spend an hour fixing date formats. It drives me mad.”<br><b>P4:</b> “The reports are fine. I'd just like them to go out automatically each week.”",
    claims: [
      { t: "Most participants export data to spreadsheets to work around the reports (P1, P3).", v: "partial", why: "Two of four is half, not most. The theme is real; the word “most” overstates it." },
      { t: "Fixing date formats after export costs time (P3).", v: "ok", why: "Directly supported by P3's quote." },
      { t: "Participants consistently asked for a mobile app.", v: "bad", why: "Nobody asked for an app. P2 uses the dashboard on a phone and is happy with it. A plausible theme, invented." },
      { t: "One participant wants reports delivered on a schedule (P4).", v: "ok", why: "Supported, and correctly counted as one." },
      { t: "Users find the existing reports unusable.", v: "bad", why: "P4 says the reports are fine and P2 doesn't use them. An overgeneralisation from P1 and P3." },
      { t: "Recommendation: prioritise a custom report builder.", v: "judg", why: "Not a finding. The evidence equally supports scheduled delivery or better export formatting. Choosing is your call, and the brief said not to recommend." }
    ],
    after: "The two invented or overgeneralised claims are exactly the ones that would have shaped a roadmap."
  };
  C["status-report"] = {
    label: "weekly status, payments team",
    source: "<b>Board export, 5 December</b><table><tr><th>Ticket</th><th>Title</th><th>Status</th></tr><tr><td>PAY-101</td><td>Card form redesign</td><td>Done</td></tr><tr><td>PAY-102</td><td>3-D Secure flow</td><td>In review. Blocked: awaiting security review (requested 4 Dec, no date yet)</td></tr><tr><td>PAY-103</td><td>Saved cards</td><td>Done</td></tr><tr><td>PAY-104</td><td>Receipt emails</td><td>Done</td></tr><tr><td>PAY-105</td><td>Apple Pay</td><td>Not started</td></tr></table><p style=\"margin:8px 0 0\"><b>Stand-up notes:</b> Launch target 12 Dec. Security says their review queue is about two weeks. Apple Pay possibly moving to January; Sam to confirm with product.</p>",
    claims: [
      { t: "Three of the five tickets are done (PAY-101, PAY-103, PAY-104).", v: "ok", why: "Matches the board." },
      { t: "The checkout redesign remains on track for the 12 December launch.", v: "bad", why: "PAY-102 is blocked on a review with a two-week queue from 4 December, which lands after 12 December. Not on track." },
      { t: "The security review is scheduled for Monday.", v: "none", why: "Nothing in the sources says this. An invented detail that makes the update sound complete." },
      { t: "Apple Pay has been moved to January.", v: "partial", why: "The notes say “possibly”, pending Sam's confirmation. Uncertainty was turned into a decision." },
      { t: "PAY-102 (3-D Secure) is in review and waiting for the security team.", v: "ok", why: "Matches the board." },
      { t: "Overall status: Green.", v: "judg", why: "Status is your judgment. On this evidence the launch date is at risk: amber or red, with a request for a review date." }
    ],
    after: "Every error leaned the same way: more optimistic than the evidence. That's the pattern to watch for in AI-drafted reports."
  };

  /* ---------- Contrast measurement ---------- */
  function lum(hex) {
    var c = hex.replace("#", ""), rgb = [0, 2, 4].map(function (i) { var v = parseInt(c.substr(i, 2), 16) / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  GW.contrastRatio = ratio;
  W.contrast = function (el) {
    var claims = [
      { fg: "#767676", bg: "#FFFFFF", t: "Grey #767676 text on white has a contrast ratio of 4.54:1, which meets WCAG AA for normal text.", ok: true, why: "Correct. 4.54:1 clears the 4.5:1 minimum, just." },
      { fg: "#888888", bg: "#FFFFFF", t: "Grey #888888 on white is 4.6:1, so it passes AA for body text.", ok: false, why: "The real ratio is about 3.5:1, which fails AA for normal text. The number was simply wrong, and stated with full confidence." },
      { fg: "#FFFFFF", bg: "#0066CC", t: "White text on #0066CC blue is about 5.6:1 and passes AA.", ok: true, why: "Correct: about 5.57:1." },
      { fg: "#999999", bg: "#FFFFFF", t: "Grey #999999 on white is 2.85:1. That's fine for body text, because the minimum is 2:1.", ok: false, why: "The ratio is right but the rule is invented. WCAG AA needs 4.5:1 for normal text (3:1 for large text). A correct number attached to a wrong rule." },
      { fg: null, t: "Large text, meaning at least 18 point (about 24px) or 14 point bold (about 18.7px), only needs 3:1 for AA.", ok: true, why: "Correct. This is a rule, not a measurement, so the check is the standard itself: WCAG's definition of large-scale text." }
    ];
    var box = h('<div class="sort-list"></div><div class="result" hidden aria-live="polite"></div>');
    el.appendChild(box);
    var list = box.querySelector(".sort-list"), res = box.querySelector(".result"), done = 0, right = 0;
    claims.forEach(function (c) {
      var d = document.createElement("div"); d.className = "sort-item";
      var sw = c.fg ? '<span style="display:inline-block;padding:6px 12px;border-radius:6px;margin:0 0 8px;font-family:var(--font-body);font-size:var(--t-sm);background:' + c.bg + ";color:" + c.fg + ';border:1px solid var(--line)">Sample text Aa</span>' : "";
      d.innerHTML = sw + "<p>“" + esc(c.t) + '”</p><div class="w-row"><button class="chip" data-v="1">I\'d accept it</button><button class="chip" data-v="0">I\'d doubt it</button></div><div class="why" hidden></div>';
      d.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b || d.dataset.done) return;
        d.dataset.done = "1"; b.setAttribute("aria-pressed", "true");
        var said = b.dataset.v === "1", good = said === c.ok; if (good) right += 1; done += 1;
        d.classList.add(c.ok ? "ok" : "no");
        var m = c.fg ? "Measured: <b>" + ratio(c.fg, c.bg).toFixed(2) + ":1</b>. " : "Checked against WCAG 2.2. ";
        var w = d.querySelector(".why"); w.hidden = false;
        w.innerHTML = '<span class="stamp ' + (c.ok ? "ok" : "bad") + '">' + (c.ok ? "Claim holds" : "Claim fails") + "</span> " + m + esc(c.why) + (good ? "" : " <b>Your instinct differed; that's what measuring is for.</b>");
        if (done === claims.length) { res.hidden = false; res.className = "result " + (right >= 4 ? "ok" : "warn"); res.innerHTML = "Your instinct matched the measurement on <b>" + right + " of " + claims.length + "</b>. Even experts can't judge contrast by eye or by trusting a stated number. The measurement took no effort, which is the point: when a claim is cheap to check, check it."; }
      });
      list.appendChild(d);
    });
  };

  /* ---------- Code tester: parseDuration ---------- */
  function aiParse(input) {
    var pattern = /(\d+)(h|m|s)/g, unit = { h: 3600, m: 60, s: 1 }, total = 0, m;
    while ((m = pattern.exec(input)) !== null) total += parseInt(m[1], 10) * unit[m[2]];
    return total;
  }
  function fixedParse(input) {
    var t = input.trim(), m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
    if (!m || t === "") throw new Error("Invalid duration: \"" + input + "\"");
    return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0);
  }
  W.codetest = function (el) {
    var code = [
      "// Parse durations like \"2h\", \"45m\", \"1h30m\", \"90s\" into seconds.",
      "function parseDuration(input) {",
      "  const pattern = /(\\d+)(h|m|s)/g;",
      "  const unitSeconds = { h: 3600, m: 60, s: 1 };",
      "  let total = 0;",
      "  let match;",
      "  while ((match = pattern.exec(input)) !== null) {",
      "    total += parseInt(match[1], 10) * unitSeconds[match[2]];",
      "  }",
      "  return total;",
      "}"
    ];
    var presets = ["2h", "45m", "1h30m", "90s", "1.5h", "2 hours", "1h30", "", "-5m"];
    var box = h('<div><label for="dur-in">Input</label><input type="text" id="dur-in" value="1h30m" autocomplete="off" spellcheck="false"></div>' +
      '<div class="w-row" style="margin-top:8px" role="group" aria-label="Example inputs">' + presets.map(function (p) { return '<button class="chip" data-p="' + esc(p) + '">' + (p === "" ? "(empty)" : esc(p)) + "</button>"; }).join("") + '</div>' +
      '<div class="io"><div class="cell"><b>AI version returns</b><code class="o1"></code></div><div class="cell fixed" hidden><b>Validated version returns</b><code class="o2"></code></div></div>' +
      '<div class="result" aria-live="polite"></div>' +
      '<details class="code-d"><summary>The generated code (11 lines)</summary><div class="codebox" aria-label="Generated code">' + code.map(function (l, i) { return '<div class="ln" data-l="' + (i + 1) + '"><i>' + (i + 1) + "</i><span>" + esc(l) + "</span></div>"; }).join("") + '</div></details><div class="w-row" style="margin-top:10px"><button class="btn small ghost" data-act="fix" aria-pressed="false">Compare with a validated version</button></div><pre class="code fixed-code" hidden></pre>');
    el.appendChild(box);
    box.querySelector(".code-d").open = window.matchMedia("(min-width: 761px)").matches;
    box.querySelector(".fixed-code").textContent = "function parseDuration(input) {\n  const text = input.trim();\n  const m = /^(?:(\\d+)h)?(?:(\\d+)m)?(?:(\\d+)s)?$/.exec(text);\n  if (!m || text === \"\") throw new Error(`Invalid duration: \"${input}\"`);\n  const [, h = 0, min = 0, s = 0] = m;\n  return Number(h) * 3600 + Number(min) * 60 + Number(s);\n}";
    var inp = box.querySelector("input"), res = box.querySelector(".result"), found = {};
    function run() {
      var v = inp.value, a = aiParse(v), f, ferr = null;
      try { f = fixedParse(v); } catch (e) { ferr = e.message; }
      box.querySelector(".o1").textContent = a + " seconds";
      box.querySelector(".o2").textContent = ferr ? "Error: " + ferr.replace("Invalid duration: ", "invalid input ") : f + " seconds";
      box.querySelectorAll(".ln").forEach(function (l) { l.classList.remove("hl"); });
      if (ferr) {
        found[v] = 1; res.className = "result bad";
        res.innerHTML = "<b>Silent wrong answer.</b> “" + esc(v || "(empty)") + "” isn't a valid duration, but the function returned " + a + " seconds without complaint" + (a ? ", by reading only the parts that matched." : ". A zero timeout can mean “don't wait” or “wait forever”.") + " Lines 3 and 7 of the code never check the whole string.";
        [3, 7].forEach(function (n) { box.querySelector('[data-l="' + n + '"]').classList.add("hl"); });
      } else { res.className = "result ok"; res.innerHTML = "Correct: " + a + " seconds. This input is well formed. Try something a user might mistype."; }
      var n = Object.keys(found).length;
      if (n >= 2) res.innerHTML += " <span class=\"muted\">You've found " + n + " inputs that fail silently.</span>";
    }
    inp.addEventListener("input", run);
    box.querySelectorAll("[data-p]").forEach(function (b) { b.addEventListener("click", function () { inp.value = b.dataset.p; run(); }); });
    box.querySelector('[data-act="fix"]').addEventListener("click", function () {
      var on = this.getAttribute("aria-pressed") !== "true"; this.setAttribute("aria-pressed", String(on));
      box.querySelector(".cell.fixed").hidden = !on; box.querySelector(".fixed-code").hidden = !on;
      this.textContent = on ? "Hide the validated version" : "Compare with a validated version";
    });
    run();
  };

  /* ---------- Coverage gaps ---------- */
  W.coverage = function (el) {
    var items = [
      ["A reset link works only once; reusing it fails.", true, "Missing and important. Reusable tokens let anyone with an old email take over the account."],
      ["Requesting a new link invalidates earlier ones.", true, "Missing. Otherwise every link ever sent stays live until it expires."],
      ["Repeated reset requests are rate limited.", true, "Missing. Without it the form can be used to flood someone's inbox or probe for accounts."],
      ["Known and unknown emails get the same response.", true, "Missing, and case 2 actually asserts the opposite: “No account found” tells an attacker which emails are registered. That test encodes a vulnerability."],
      ["After a reset, the user is notified and existing sessions are handled as the requirements say.", true, "Missing. A reset after a takeover should end the attacker's session; confirm the intended behaviour with product and security."],
      ["Email matching ignores letter case.", true, "Missing, a classic equivalence-class case: “Ana@Example.com” and “ana@example.com” should behave the same."],
      ["The reset page uses the brand colour palette.", false, "Not a functional risk for this feature; a visual review covers it."],
      ["The submit button is labelled “Submit”.", false, "Trivial, and probably not even a requirement."]
    ];
    var box = h('<div class="claims">' + items.map(function (it, i) { return '<button class="claim" aria-pressed="false" data-i="' + i + '">' + esc(it[0]) + "</button>"; }).join("") + '</div><div class="w-row"><button class="btn small" data-act="check">Check my selection</button></div><div class="result" hidden aria-live="polite"></div>');
    el.appendChild(box);
    var list = box.querySelector(".claims"), res = box.querySelector(".result"), done = false;
    list.addEventListener("click", function (e) { var b = e.target.closest(".claim"); if (!b || done) return; b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); });
    box.querySelector('[data-act="check"]').addEventListener("click", function () {
      done = true; var hit = 0, need = 0, wrong = 0;
      items.forEach(function (it, i) {
        var b = list.children[i], sel = b.getAttribute("aria-pressed") === "true";
        if (it[1]) { need += 1; if (sel) hit += 1; } else if (sel) wrong += 1;
        b.classList.add("revealed");
        var s = document.createElement("span"); s.className = "verdict";
        s.innerHTML = '<span class="stamp ' + (it[1] ? "bad" : "ok") + '">' + (it[1] ? "Gap" : "Not needed") + "</span>" + esc(it[2]);
        b.appendChild(s);
      });
      res.hidden = false; res.className = "result " + (hit === need && !wrong ? "ok" : "warn");
      res.innerHTML = "You found <b>" + hit + " of " + need + "</b> real gaps" + (wrong ? " and selected " + wrong + " that aren't needed" : "") + ". The biggest finding is the one that's easy to miss: an existing test case that asserts insecure behaviour.";
      this.hidden = true;
    });
  };

  /* ---------- Eval simulation ---------- */
  W.evalsim = function (el) {
    var V = [{ n: "Version A", p: 0.70, r: [] }, { n: "Version B", p: 0.85, r: [] }];
    var box = h(V.map(function (v, i) { return '<div style="margin-top:8px"><b>' + v.n + '</b> <span class="muted" data-s="' + i + '"></span><div class="dots" data-d="' + i + '"></div></div>'; }).join("") +
      '<div class="w-row" style="margin-top:8px"><button class="btn small" data-n="1">Run each once</button><button class="btn small ghost" data-n="5">Run each 5 times</button><button class="btn small ghost" data-n="50">Run each 50 times</button><button class="btn small ghost" data-n="0">Reset</button></div><div class="result" aria-live="polite"></div>');
    el.appendChild(box);
    var res = box.querySelector(".result");
    function draw() {
      V.forEach(function (v, i) {
        var pass = v.r.filter(Boolean).length, shown = v.r.slice(-120);
        box.querySelector('[data-d="' + i + '"]').innerHTML = shown.map(function (x) { return '<i class="' + (x ? "p" : "f") + '" title="' + (x ? "pass" : "fail") + '"></i>'; }).join("");
        box.querySelector('[data-s="' + i + '"]').textContent = v.r.length ? pass + " of " + v.r.length + " passed (" + Math.round(100 * pass / v.r.length) + "%)" + (v.r.length > 120 ? ", showing the last 120" : "") : "no runs yet";
      });
      var n = V[0].r.length;
      if (!n) { res.className = "result"; res.textContent = "Green dots pass the rubric, red dots fail. Which version is better?"; return; }
      var a = V[0].r.filter(Boolean).length / n, b = V[1].r.filter(Boolean).length / n;
      if (n < 20) { res.className = "result warn"; res.innerHTML = "After " + n + " run" + (n > 1 ? "s" : "") + " each, A looks " + (a > b ? "<b>better</b> than" : a === b ? "<b>the same as</b>" : "worse than") + " B. With this few samples, that could easily be luck. Keep running."; }
      else { res.className = "result ok"; res.innerHTML = "After " + n + " runs each: A " + Math.round(a * 100) + "%, B " + Math.round(b * 100) + "%. The true rates are 70% and 85%. With enough runs the difference becomes clear, and you can also see that even B fails about one time in seven, which matters if failures reach customers."; }
    }
    box.querySelectorAll("[data-n]").forEach(function (b) {
      b.addEventListener("click", function () {
        var k = +b.dataset.n;
        if (!k) V.forEach(function (v) { v.r = []; });
        V.forEach(function (v) { for (var j = 0; j < k; j++) v.r.push(Math.random() < v.p); });
        draw();
      });
    });
    draw();
  };

  /* ---------- Ops commands ---------- */
  C["ops-commands"] = {
    buckets: ["Read-only", "Changes state: runbook and approval", "Don't run from a suggestion"],
    items: [
      { t: "<code>kubectl get pods -n checkout</code>", a: 0, why: "Lists pods. Changes nothing. Still check which cluster you're pointed at." },
      { t: "<code>kubectl logs deploy/checkout -n checkout --since=15m</code>", a: 0, why: "Reads logs. Safe, though output may contain sensitive data: don't paste it onward unredacted." },
      { t: "<code>curl -s http://pricing.pricing.svc:8080/healthz</code>", a: 0, why: "A health check request. Read-only, provided the endpoint really is just a health check." },
      { t: "<code>kubectl rollout undo deploy/pricing -n pricing</code>", a: 1, why: "Reversible and often the right mitigation, but it changes production. Follow the runbook, announce it in the incident channel and get the approval it requires." },
      { t: "<code>DELETE FROM sessions WHERE expires_at &lt; now();</code>", a: 1, why: "Probably safe cleanup, but it deletes data and can lock a busy table. Count first with a SELECT, run it through your change process." },
      { t: "<code>kubectl scale deploy/checkout --replicas=0 -n checkout</code>", a: 2, why: "Takes checkout fully offline. The errors stop because the service is gone. A human decision, never a pasted suggestion." },
      { t: "<code>kubectl delete pvc --all -n pricing</code>", a: 2, why: "Deletes every persistent volume claim in the namespace, and potentially the data behind them. Irreversible." },
      { t: "<code>terraform apply -auto-approve</code>", a: 2, why: "Applies infrastructure changes without showing you the plan. Always run <code>terraform plan</code> and review it first." }
    ],
    after: "The habit: before running anything an assistant suggests, say out loud what it changes, where, and whether you can undo it."
  };

  /* ---------- Team agreement builder ---------- */
  W.agreement = function (el) {
    var groups = [
      ["Tools", [["We use only the AI tools on the approved list, with work accounts.", true], ["New tools or integrations (including agents and connectors) go through security review first.", true]]],
      ["Data", [["Secrets (passwords, keys, tokens, connection strings) never go into any AI tool.", true], ["Customer personal data goes only into approved tools, minimised and redacted where possible.", true], ["Confidential business information follows the data classification policy.", true]]],
      ["Review", [["AI-assisted work gets the same review as any other work. The author owns it and can explain it.", true], ["Code, queries and scripts are run and tested, not just read.", true], ["Anything customer-facing, financial, legal or security-related gets a second reviewer.", false], ["Agents can't take irreversible or external actions without human approval.", true]]],
      ["Disclosure", [["We say when substantial parts of a deliverable were AI-assisted, so reviewers know where to look.", true], ["We never present unverified AI output as checked fact.", true]]],
      ["Where we don't use AI", [["Decisions about people (hiring, performance, discipline) stay with people; AI may help organise, not decide.", true], ["Messages to customers are never sent without a person reviewing them.", true]]],
      ["Learning", [["We share useful prompts and failures in a team channel.", false], ["We review this agreement and our pilot measures every quarter.", true]]]
    ];
    var html = groups.map(function (g, gi) {
      return '<p style="margin:14px 0 6px"><b>' + esc(g[0]) + '</b></p><div class="claims" style="margin:0">' + g[1].map(function (c, ci) { return '<button class="claim" data-g="' + gi + '" data-c="' + ci + '" aria-pressed="' + c[1] + '">' + esc(c[0]) + "</button>"; }).join("") + "</div>";
    }).join("");
    var box = h(html + '<div class="draft" style="margin-top:16px"><div class="draft-h"><span><b>Our team\'s AI agreement</b> · draft</span><button class="btn small ghost" data-act="copy" style="min-height:28px;padding:2px 10px">Copy</button></div><div class="draft-b"><pre class="out" style="margin:0;white-space:pre-wrap;font-family:var(--font-mono);font-size:13px"></pre></div></div><div class="result" hidden aria-live="polite"></div>');
    el.appendChild(box);
    var out = box.querySelector(".out"), res = box.querySelector(".result");
    function draw() {
      var txt = "OUR TEAM'S AGREEMENT ON USING AI\nOwner: [name]   Last reviewed: [date]\n";
      groups.forEach(function (g, gi) {
        var on = g[1].filter(function (c, ci) { return box.querySelector('[data-g="' + gi + '"][data-c="' + ci + '"]').getAttribute("aria-pressed") === "true"; });
        if (on.length) txt += "\n" + g[0].toUpperCase() + "\n" + on.map(function (c) { return "- " + c[0]; }).join("\n") + "\n";
      });
      txt += "\nQuestions: ask [security / privacy contact].";
      out.textContent = txt;
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest(".claim"); if (b) { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); draw(); return; }
      if (e.target.closest('[data-act="copy"]')) {
        var done = function (ok) { res.hidden = false; res.className = "result " + (ok ? "ok" : "warn"); res.textContent = ok ? "Copied. Paste it into your team's wiki and fill in the bracketed details." : "Your browser blocked copying. The text is selected; press Ctrl+C or Cmd+C."; };
        try {
          navigator.clipboard.writeText(out.textContent).then(function () { done(true); }, function () { selectOut(); done(false); });
        } catch (err) { selectOut(); done(false); }
      }
    });
    function selectOut() { var r = document.createRange(); r.selectNodeContents(out); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
    draw();
  };

  /* ---------- Capstone scenario ---------- */
  W.scenario = function (el) {
    var steps = [
      { role: "Product", lesson: "product", title: "The evidence for the feature", sit: "An assistant summarised 30 support tickets: “Customers overwhelmingly want carts saved across devices (23 of 30 tickets).” You spot-check the 23 cited tickets. Nine of them are actually about being logged out mid-checkout, not about devices.", opts: [
        ["Use the headline in the pitch; the feature is clearly wanted either way.", "The pitch would rest on a number you know is wrong. If anyone checks, the whole case loses credibility."],
        ["Recount: 14 of 30 are about devices. Present both themes, since the logout problem may be a separate, cheaper fix.", "Right. You checked the counts, corrected the overstatement and kept the outlier theme, which might be the bigger win."],
        ["Drop the research and go with your instinct.", "The research was useful once checked. Throwing it away loses real evidence."]], a: 1 },
      { role: "Design", lesson: "design", title: "The confirmation message", sit: "You asked for copy variants for the message “your cart is saved”. The assistant recommends “Saved forever! Pick up where you left off on any device.” It adds that the grey caption text passes WCAG AA at 4.6:1.", opts: [
        ["Reject “forever” (carts expire after 30 days), pick an accurate variant, measure the contrast yourself, and test the top two with users.", "Right. The copy made a promise the product doesn't keep, and the contrast claim is a number you can measure in seconds."],
        ["Use the recommended copy; it's friendly and the contrast was checked.", "“Forever” is false, and the contrast figure is the assistant's claim, not a measurement."],
        ["Ask the assistant to choose the best variant and confirm the contrast.", "That's asking the same source to check itself. Measure, and decide on the copy yourself."]], a: 0 },
      { role: "Engineering", lesson: "engineering", title: "The agent's pull request", sit: "A coding agent implemented cart persistence. Its PR says “All tests pass.” CI is green. In the diff, one test file changed: the expected cart expiry went from 30 days to 0.", opts: [
        ["Merge: CI is green and the agent says the tests pass.", "Green CI only means the tests pass. Here a test was weakened to pass, which hides a real bug."],
        ["Ask the agent whether the test change was correct.", "Its answer is another generated claim. The diff already tells you what you need."],
        ["Revert the test change, find why expiry was failing, fix the code, and review the whole diff for scope creep.", "Right. Changing a test's expectation to make it pass is a classic agent shortcut. The test was right; the code was wrong."]], a: 2 },
      { role: "QA", lesson: "qa", title: "Testing the cart merge", sit: "When a guest with items logs in to an account that already has a saved cart, the carts merge. An AI-generated test plan covers merging two carts with different items, and an empty guest cart.", opts: [
        ["Run the AI plan as written; it covers merging.", "It covers the typical cases. The risky cases are where both carts disagree."],
        ["Add conflict and boundary cases from the product rules: same item in both carts, an item now out of stock, a price that changed since saving, a cart at the item limit. Check expected results with product.", "Right. Coverage comes from the rules and from techniques you know, and each expected result is checked against requirements."],
        ["Skip QA for the merge; the engineer's tests cover it.", "Unit tests from the same change can share its blind spots, and nobody has decided the conflict rules yet."]], a: 1 },
      { role: "Project management", lesson: "project-management", title: "The change request", sit: "Three weeks before launch, the client asks for guests to be able to save carts too, via an emailed link. An assistant's impact assessment says: “Small change, about 3 days of work, no impact on the 3 March launch, covered by contingency.” Your plan shows the email service work is already on the critical path, and only 2 days of contingency are left.", opts: [
        ["Approve it; the assessment says there is no impact.", "The assessment contradicts your own plan: work added to the critical path moves the date, and 3 days is more than the 2 days of contingency left."],
        ["Get an estimate from the team, re-run the schedule with the change on the critical path, and take options to the sponsor: move the date, add people, or defer guest carts to a later release.", "Right. The model's assessment was a guess about your plan. The team's estimate and the scheduling tool give the facts; the sponsor makes the commitment."],
        ["Ask the assistant to re-check its assessment more carefully.", "You'd get another generated answer. The plan and the team's estimate are the evidence."]], a: 1 },
      { role: "Delivery", lesson: "delivery", title: "The status update", sit: "The AI-drafted update says: “Saved carts is on track for 3 March. QA is complete.” The board shows QA about 60% done and two open bugs, one of them severity 2.", opts: [
        ["Send it; the team is confident about 3 March.", "Two statements contradict the board. Stakeholders will plan on false information."],
        ["Ask the assistant to make the update more positive for the exec audience.", "It's already more positive than the evidence."],
        ["Correct both statements, set the status to amber yourself, and lead with the severity-2 bug and the decision needed.", "Right. Every statement is traced to the board, and the status colour is your judgment."]], a: 2 },
      { role: "Operations", lesson: "operations", title: "Storage is filling up", sit: "Two weeks after launch, an alert fires: the saved-carts table is growing fast. An assistant suggests running this on production now: DELETE FROM saved_carts WHERE updated_at < now() - interval '30 days';", opts: [
        ["Check why expired carts aren't being removed, count the affected rows with a SELECT on a replica, confirm the retention rule with product, then schedule the cleanup through your change process with a backup.", "Right. The query might be correct, but deleting customer data in production is a state change with a large blast radius. Find the cause too: the cleanup job may never have been deployed."],
        ["Run it; 30 days matches the feature's rules.", "A large delete on a live table can lock it and can't be undone. And it treats the symptom, not why expiry isn't working."],
        ["Ask the assistant whether the query is safe to run.", "It will likely say yes. Safety depends on your data, locks and backups, which it can't see."]], a: 0 }
    ];
    var i = 0, score = 0;
    var box = h('<div class="scn"></div>'); el.appendChild(box);
    var root = box.querySelector(".scn");
    function render() {
      if (i >= steps.length) {
        root.innerHTML = '<div class="scn-progress">' + steps.map(function () { return '<i class="on"></i>'; }).join("") + '</div><h3>Feature shipped: ' + score + " of " + steps.length + ' decisions matched the recommended approach</h3><p>Across seven roles, the same moves kept working: <b>check the specific claims</b> (counts, numbers, promises), <b>compare with something outside the model</b> (the tickets, a contrast checker, the diff, the rules, the board, the data), and <b>keep the judgment where it belongs</b> (the pitch, the copy, the merge, the status colour, the production change).</p><p class="muted">Each feedback message linked to the lesson that covers it if you want to revisit one.</p><button class="btn small ghost" data-act="again">Run the capstone again</button>';
        root.querySelector("[data-act]").addEventListener("click", function () { i = 0; score = 0; render(); });
        return;
      }
      var s = steps[i];
      root.innerHTML = '<div class="scn-progress">' + steps.map(function (x, k) { return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '</div><div class="scn-role">Step ' + (i + 1) + " of " + steps.length + " · " + s.role + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.sit) + '</p><div class="opts">' + s.opts.map(function (o, k) { return '<button class="opt" data-k="' + k + '"><span class="ltr">' + "ABC"[k] + "</span><span>" + esc(o[0]) + "</span></button>"; }).join("") + '</div><div class="fb" hidden aria-live="polite"></div><div class="scn-next" hidden></div>';
      var answered = false;
      root.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          var k = +b.dataset.k, ok = k === s.a;
          if (!answered && ok) score += 1;
          answered = true;
          root.querySelectorAll(".opt").forEach(function (x) { x.classList.remove("right", "wrong"); });
          b.classList.add(ok ? "right" : "wrong");
          var fb = root.querySelector(".fb"); fb.hidden = false; fb.className = "fb " + (ok ? "right" : "wrong");
          fb.innerHTML = "<b>" + (ok ? "Good decision. " : "Think again. ") + "</b>" + esc(s.opts[k][1]) + (ok ? ' <a href="#' + s.lesson + '">Revisit the ' + s.role.toLowerCase() + ' lesson</a>' : " Try another option.");
          var row = root.querySelector(".scn-next"); row.hidden = !ok;
          row.innerHTML = ok ? '<button class="btn small" data-act="next">' + (i + 1 < steps.length ? "Next role" : "See the outcome") + "</button>" : "";
          var nx = row.querySelector('[data-act="next"]');
          if (nx) { row.scrollIntoView({ block: "nearest", behavior: "smooth" }); nx.addEventListener("click", function () { i += 1; render(); root.scrollIntoView({ block: "nearest" }); }); nx.focus({ preventScroll: true }); }
        });
      });
    }
    render();
  };
})();
