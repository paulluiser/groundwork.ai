/* Activities for choosing models, retrieval and workflows. */
(function () {
  "use strict";
  var W = GW.widgets, C = GW.cfg;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function h(html) { var d = document.createElement("div"); d.className = "w"; d.innerHTML = html; return d; }

  /* ---------- lesson 4: match the task to a model ---------- */
  C["model-pick"] = {
    buckets: ["Small, fast model", "Frontier model", "Reasoning model", "Self-hosted open weights"],
    items: [
      { t: "Sort 40,000 support tickets each night into eight categories.", a: 0, why: "Narrow, repetitive and high volume, so cost and speed dominate. Measure it against tickets people have already tagged before trusting it." },
      { t: "Find out why a payment job pays some refunds twice, given logs from two services and the relevant code.", a: 2, why: "Many dependent steps and timing across services: the kind of problem where thinking first pays off. Low volume, so the wait and cost don't matter." },
      { t: "Suggest the next few words as a developer types in the editor.", a: 0, why: "Latency decides everything here. A suggestion that arrives after two seconds is useless, however good it is." },
      { t: "Draft a careful reply to an unhappy enterprise customer, using the account history. A manager edits and sends it.", a: 1, why: "Nuanced writing and judgment, low volume, and a person reviews it. A strong general model is the natural default." },
      { t: "Summarise patient letters for a clinic whose policy forbids sending health data to outside processors.", a: 3, why: "Data control is the deciding factor. Running an open-weights model in your own environment keeps the data in-house; check the licence and accept weaker summaries." },
      { t: "Plan the order to migrate 30 services to a new database, with dependencies and a rollback step for each.", a: 2, why: "A planning problem with many constraints that interact. A reasoning model is worth the wait; a person still reviews the plan." },
      { t: "Review a screenshot of a sign-up form and list layout and labelling problems.", a: 1, why: "Needs image input and broad judgment. Frontier models are usually multimodal. Check any colour or contrast claims with a proper tool." }
    ],
    after: "The method matters more than the label: name what matters most (quality, speed, cost or data control), pick a kind of model, then test it on your own examples."
  };

  /* ---------- lesson 7: workflow or agent ---------- */
  C["wf-agent"] = {
    buckets: ["Single request", "Workflow", "Agent"],
    items: [
      { t: "Summarise one meeting transcript into decisions and owners.", a: 0, why: "One step, everything needed is in the transcript, and you read the result. Nothing to orchestrate." },
      { t: "For every new support ticket: classify it, pull out the order ID, look up the order, and draft a reply for an agent to approve.", a: 1, why: "The steps are known in advance and always the same. A workflow makes each step testable and the cost predictable." },
      { t: "A CI build is failing for an unknown reason. Read the logs, search the code, try a fix, rerun the tests, and repeat until it passes.", a: 2, why: "The path depends on what each step finds, and there's a clear success signal: the build passes. That's what agents are for." },
      { t: "Rewrite one paragraph of a help article in plainer language.", a: 0, why: "A single, self-contained edit that you'll read straight away." },
      { t: "Each Friday, collect merged pull requests, group them by feature, and draft release notes for the product manager.", a: 1, why: "Fixed steps on a schedule: fetch, group, draft. An agent would add unpredictability without adding anything the task needs." },
      { t: "Upgrade a library across a large codebase, fixing whatever breaks along the way, with tests to confirm.", a: 2, why: "What breaks isn't known in advance, and tests give feedback at every step. Give it limited permissions and review the diff." }
    ],
    after: "Start with the simplest design that works. Move to an agent only when you can't write the steps down in advance, and there's a signal that tells it whether it's succeeding."
  };

  /* ---------- lesson 33: project management ---------- */
  C["pm-schedule"] = {
    label: "schedule summary for the steering group",
    source: '<b>Plan: move customer support to a new ticketing system</b> · starts Monday 1 March 2027 · team based in England. Good Friday (26 March) and Easter Monday (29 March) are public holidays.' +
      '<table><thead><tr><th>Task</th><th>Days</th><th>Starts after</th></tr></thead><tbody>' +
      '<tr><td>A. Requirements and vendor setup</td><td>5</td><td>none</td></tr>' +
      '<tr><td>B. Data migration scripts</td><td>10</td><td>A</td></tr>' +
      '<tr><td>C. Training materials</td><td>4</td><td>A</td></tr>' +
      '<tr><td>D. Billing integration</td><td>8</td><td>A</td></tr>' +
      '<tr><td>E. User acceptance testing</td><td>5</td><td>B and D</td></tr>' +
      '<tr><td>F. Train support agents</td><td>3</td><td>C</td></tr>' +
      '<tr><td>G. Go-live</td><td>1</td><td>E and F</td></tr></tbody></table>',
    claims: [
      { t: "The critical path is A → B → E → G: 21 working days in total.", v: "ok", why: "Correct. 5 + 10 + 5 + 1 = 21. B (10 days) finishes after D (8 days), so B drives the start of testing." },
      { t: "Go-live is on Monday 29 March 2027.", v: "bad", why: "That's 21 working days counted straight through, ignoring both Easter holidays in the plan. With Good Friday and Easter Monday off, day 21 is Wednesday 31 March. A two-day error that would reach the client's calendar." },
      { t: "Billing integration (D) has 2 days of slack: it can slip 2 days without moving go-live.", v: "ok", why: "Correct. D finishes on day 13; testing can't start until B finishes on day 15." },
      { t: "Training materials (C) are on the critical path, so any delay there delays go-live.", v: "bad", why: "Wrong. C and F finish on day 12 but go-live doesn't need them until day 20, so that chain has 8 days of slack. Misplaced critical-path claims send attention to the wrong place." },
      { t: "The biggest schedule risk is data migration (B), because it's the longest task on the critical path.", v: "judg", why: "Reasonable, but not something the plan proves. Whether B is the biggest risk depends on data quality, the vendor, and the team's experience. Use it as a prompt for your own risk review, not a finding." },
      { t: "The vendor has confirmed that setup will be finished by 5 March.", v: "none", why: "Nothing in the plan says the vendor confirmed anything. It's a detail that makes the summary feel complete. Find the email, or remove it." }
    ],
    after: "The structure was right; the arithmetic, the calendar and one dependency were not. That's the usual pattern: recalculate dates in your scheduling tool, and source every claim about another party."
  };
  C["pm-tasks"] = {
    buckets: ["Let AI draft", "AI drafts, I verify", "Keep it mine"],
    items: [
      { t: "Turn kickoff meeting notes into a first draft of the project brief.", a: 0, why: "A structured first draft from your own notes, which you'll edit anyway. Check that open questions didn't become decisions." },
      { t: "Work out the go-live date from the task list.", a: 1, why: "AI can explain the plan, but dates must be calculated by a scheduling tool with the real calendar. Treat any date it gives as a claim to recompute." },
      { t: "Summarise the supplier's obligations in the statement of work.", a: 1, why: "A summary helps you navigate, but obligations and deadlines must be checked clause by clause against the text." },
      { t: "Decide whether to use contingency budget for a change request.", a: 2, why: "A commitment of money and time that you and the sponsor are accountable for. AI can lay out options; it shouldn't make the call." },
      { t: "Rewrite this week's steering update for the team's all-hands.", a: 0, why: "Same facts, new audience: a strength of language models. Compare before and after to make sure no fact or risk changed." },
      { t: "Tell the client the launch date is moving.", a: 2, why: "A sensitive conversation that affects trust and possibly the contract. AI can help you prepare, but the message and the relationship are yours." },
      { t: "Pull risks, assumptions, issues and decisions out of a week of project emails into the RAID log.", a: 1, why: "Good at spotting them in prose, but owners, dates and severity must be confirmed. Watch for possibilities turned into decisions." }
    ],
    after: "The pattern: let AI draft words, verify anything that is a fact, a number or a date, and keep commitments to yourself and your sponsor."
  };

  /* ---------- lesson 21: security review ---------- */
  C["sec-review"] = {
    label: "AI security review of the endpoint",
    source: '<b>New endpoint</b> · <code>requireLogin</code> is the app\'s own middleware: it rejects requests without a valid session.' +
      '<pre>app.get("/invoices/:id", requireLogin, async (req, res) =&gt; {\n  const inv = await db.query(\n    "SELECT * FROM invoices WHERE id = $1", [req.params.id]);\n  if (!inv.rows.length) return res.status(404).send("Not found");\n  res.json(inv.rows[0]);\n});</pre>',
    claims: [
      { t: "High: SQL injection. The invoice ID from the URL is inserted into the query.", v: "bad", why: "A false positive. The $1 placeholder sends the ID as a parameter, separately from the SQL, so it can't change the query." },
      { t: "Access control is handled: requireLogin ensures only authorised users reach the route.", v: "bad", why: "The real issue, dismissed. requireLogin checks that someone is logged in, not that this invoice is theirs. Any customer can read any invoice by changing the ID: broken object-level authorization." },
      { t: "Low: SELECT * may return internal columns to the client. List the columns you need.", v: "ok", why: "A fair point. Returning whole rows can leak fields added later." },
      { t: "requireLogin also rate-limits requests, so enumeration of IDs is not a concern.", v: "bad", why: "Invented. Nothing says the middleware rate-limits; the model guessed from the name. And rate limits wouldn't fix the missing ownership check anyway." },
      { t: "Missing invoices return a 404 without exposing internal details.", v: "ok", why: "Correct, as far as the code shows." },
      { t: "Overall: low risk, no changes required before release.", v: "bad", why: "The verdict rests on the missed issue. This endpoint exposes every customer's invoices." }
    ],
    after: "One false positive, one real issue missed, one invented capability. Reproduce findings before fixing them, and ask specifically how each handler checks the caller may access the record."
  };

  /* ---------- lesson 24: monthly active users ---------- */
  C["data-mau"] = {
    label: "assistant's answer about October MAU",
    source: '<b>Table</b> <code>events(user_id, event_type, occurred_at timestamp)</code>, one row per user action.' +
      '<pre>SELECT COUNT(user_id) AS mau\nFROM events\nWHERE occurred_at BETWEEN \'2026-10-01\' AND \'2026-10-31\';</pre>' +
      '<b>Result</b> 1,284,550 · <b>Team dashboard, October MAU</b> 412,000',
    claims: [
      { t: "We had 1,284,550 monthly active users in October.", v: "bad", why: "COUNT(user_id) counts rows, and each row is an action. This is the number of events, not users." },
      { t: "The query covers the whole of October.", v: "bad", why: "On a timestamp, BETWEEN ... AND '2026-10-31' stops at midnight at the start of 31 October. Almost all of the last day is missing." },
      { t: "The dashboard appears to undercount active users and should be investigated.", v: "bad", why: "Backwards. The new, untested query is the first suspect when it disagrees with a trusted number." },
      { t: "The events table records one row per user action.", v: "ok", why: "That's what the schema says. It's also the clue to the grain error." },
      { t: "That's 18% up on September.", v: "none", why: "The query only covers October. The comparison has no source." },
      { t: "To count people rather than actions, use COUNT(DISTINCT user_id).", v: "ok", why: "Correct, and pair it with a half-open date range." }
    ],
    after: "Check the grain, check the date boundaries, and compare with a number you trust before anyone acts on the result."
  };

  /* ---------- lesson 27: documenting a command ---------- */
  C["docs-rotate"] = {
    label: "AI draft: how to rotate an API key",
    source: '<b>From the pull request</b> Adds <code>keys rotate</code>. Creates a new key. The old key keeps working for 24 hours, then is revoked. <code>--revoke-now</code> revokes it immediately. Requires the Admin role.' +
      '<pre>$ acme keys rotate --help\nUsage: acme keys rotate &lt;key-id&gt; [--revoke-now] [--label &lt;text&gt;]</pre>',
    claims: [
      { t: "Run <code>acme keys rotate &lt;key-id&gt;</code> to create a new key.", v: "ok", why: "Matches the PR and the help output." },
      { t: "The old key stops working as soon as the new one is created.", v: "bad", why: "The PR says it keeps working for 24 hours. Immediate revocation needs --revoke-now." },
      { t: "To keep the old key longer, add <code>--expire-old 48h</code>.", v: "bad", why: "No such flag in the help output. A plausible option, invented." },
      { t: "Use <code>--label ci-2027</code> to name the new key.", v: "ok", why: "The --label option is in the help output." },
      { t: "Any member of the workspace can rotate keys.", v: "bad", why: "The PR says it requires the Admin role." },
      { t: "Rotating keys every 90 days is required for SOC 2 compliance.", v: "none", why: "Nothing in the sources mentions SOC 2. A compliance claim like this becomes a commitment once it's published." }
    ],
    after: "Check every command, flag, default and permission against the product, then run the steps exactly as written."
  };

  /* ---------- lesson 36: quarterly review draft ---------- */
  C["em-review"] = {
    label: "AI draft of Sam's quarterly feedback",
    source: '<b>Manager\'s Q3 notes on Sam</b><ul>' +
      '<li>Shipped the invoice export API on time; two minor bugs found after release.</li>' +
      '<li>Contributed to the database migration; owned the rollback runbook.</li>' +
      '<li>Mentored new joiner Ade weekly.</li>' +
      '<li>Missed two sprint commitments in August (on-call heavy month).</li>' +
      '<li>Peer feedback: “clear PR reviews”; “sometimes late to reply on Slack”.</li></ul>',
    claims: [
      { t: "Sam delivered the invoice export API on schedule.", v: "ok", why: "Matches the notes. A fair review would also mention the two minor bugs." },
      { t: "Sam led the database migration end to end.", v: "bad", why: "The notes say contributed, and owned the rollback runbook. Inflated credit is unfair to whoever did lead it." },
      { t: "Sam mentored Ade weekly, helping them become productive quickly.", v: "partial", why: "The mentoring is in the notes. That Ade became productive quickly is not; check before saying it." },
      { t: "Sam struggles with commitment and reliability.", v: "bad", why: "Two misses in an on-call-heavy month became a general pattern, with the context dropped. Describe what happened instead." },
      { t: "Sam could be more responsive on Slack.", v: "ok", why: "Supported by peer feedback. Phrase it as specific, actionable feedback." },
      { t: "Sam is performing in the top 20% of the team.", v: "none", why: "The notes contain no comparison with anyone. Rankings like this end up in promotion cases." }
    ],
    after: "Feedback is a record about a person. Keep each sentence to evidence you would show them, and make the judgments yourself."
  };

  /* ---------- lesson 42: a drafted support reply ---------- */
  C["support-reply"] = {
    label: "drafted reply to a billing ticket",
    source: '<b>Ticket</b> “I was charged twice for Pro this month. I want the extra charge back, and I want to cancel.”<br><b>Account</b> Pro, monthly. Two successful charges of £24 on 3 November.<br><b>Policy</b> Duplicate charges are refunded in full within 5 business days of support confirming them. Cancelling takes effect at the end of the current billing period; there are no partial refunds.',
    claims: [
      { t: "I can see two charges of £24 on 3 November.", v: "ok", why: "Matches the account record." },
      { t: "I've refunded the duplicate charge, and you'll see it within 24 hours.", v: "bad", why: "Nobody has issued the refund, and the policy says up to 5 business days. Take the action, then describe it accurately." },
      { t: "Your plan is cancelled now, and we'll refund the rest of this month.", v: "bad", why: "Cancelling takes effect at the end of the billing period, and there are no partial refunds. The draft told the customer what they wanted to hear." },
      { t: "You'll keep Pro features until the end of your billing period.", v: "ok", why: "Matches the policy." },
      { t: "As a thank-you for your patience, we've added a free month to your account.", v: "none", why: "Nothing in the policy or the record supports a credit. It's a commitment nobody approved, and the customer will expect it." },
      { t: "This was caused by a known issue with our payment provider.", v: "none", why: "Nothing in the record gives a cause. A made-up explanation can mislead the customer and the team." }
    ],
    after: "Send the true parts, take the actions the policy allows, and remove every promise nobody made."
  };

  /* ---------- lesson 2: grounding check ---------- */
  C["grounding-check"] = {
    label: "help bot answer about expense claims",
    source: '<b>Retrieved chunks</b><br><b>[B]</b> Expenses policy 2025, section 3: Submit claims within 30 days of the purchase date. Claims submitted after 30 days need approval from a director.<br><b>[E]</b> Expenses policy 2025, section 1: This policy replaces the 2022 expenses policy from 1 March 2025.<br><b>[D]</b> Expenses FAQ: Submit a claim in the Expenses app and attach a photo of each receipt.',
    claims: [
      { t: "You have 30 days from the purchase date to submit a claim. [B]", v: "ok", why: "Supported, almost word for word, by chunk B." },
      { t: "After 30 days, a director has to approve the claim. [B]", v: "ok", why: "Supported by chunk B." },
      { t: "Late claims are normally approved if you explain the reason for the delay.", v: "none", why: "Not in any chunk. It's a plausible, typical policy detail filled in from training, and it could mislead someone into missing the deadline." },
      { t: "Submit claims in the Expenses app with a photo of each receipt. [D]", v: "ok", why: "Supported by chunk D." },
      { t: "Receipts are only needed for expenses over £25.", v: "none", why: "No chunk mentions a threshold. Chunk D says each receipt. An ungrounded detail that contradicts the spirit of the source." },
      { t: "These rules have applied since March 2024. [E]", v: "bad", why: "Chunk E says 1 March 2025. The citation is real, but the sentence misstates what the source says. Citations make checking possible; they don't make the claim correct." }
    ],
    after: "Grounded answers say only what the sources say. Look hardest at sentences without a citation, and open the source for the ones with one."
  };

  /* ---------- lesson 2: search, rerank, filter ---------- */
  var RK = {
    q: "How many days do I have to submit an expense claim?",
    chunks: {
      A: { t: "Expenses policy 2022, section 3: Submit claims within 60 days of purchase.", old: true },
      B: { t: "Expenses policy 2025, section 3: Submit claims within 30 days of the purchase date. Claims after 30 days need director approval." },
      C: { t: "Travel guide: Book flights at least 14 days before travel to get the best fares." },
      D: { t: "Expenses FAQ: Submit a claim in the Expenses app and attach a photo of each receipt." },
      E: { t: "Expenses policy 2025, section 1: This policy replaces the 2022 expenses policy from 1 March 2025." }
    },
    stages: [
      { name: "1. Vector search", btn: "Run the vector search",
        note: "Closest in meaning to the question. Similarity scores are illustrative.", order: [["A", .91], ["B", .89], ["D", .86], ["C", .84], ["E", .71]], k: 3,
        answer: "You have 60 days from the date of purchase to submit a claim, using the Expenses app. [A]", stamp: ["bad", "Wrong"],
        review: "The outdated 2022 chunk scored highest because its wording is closest to the question. The model answered from the top chunk." },
      { name: "2. Rerank", btn: "Apply the reranker",
        note: "A reranker reads the question and each chunk together and scores how well the chunk answers it.", order: [["B", .95], ["A", .93], ["E", .41], ["D", .33], ["C", .04]], k: 3,
        answer: "The policy gives 30 days [B], although another section says 60 days [A]. To be safe, submit within 30 days.", stamp: ["warn", "Partly true"],
        review: "Better: the travel chunk dropped out and the right chunk is first. But both policies still reach the context, and the answer blends them. The reranker judges relevance, not which document is current." },
      { name: "3. Filter to current documents", btn: "Filter out superseded documents",
        note: "Documents marked as superseded are removed before ranking. This uses details stored with each chunk, not its meaning.", order: [["B", .95], ["E", .41], ["D", .33], ["C", .04]], dropped: "A", k: 2,
        answer: "You have 30 days from the purchase date. After that, a director needs to approve the claim [B]. This replaced the 2022 rule on 1 March 2025 [E].", stamp: ["ok", "Checks out"],
        review: "Grounded in the current policy, with citations you can open and check." }
    ]
  };
  W.rerank = function (el) {
    var stage = -1;
    var box = h('<div class="src-box"><b>Question</b><br>' + esc(RK.q) + '</div>' +
      '<div class="rk-stage" aria-live="polite"></div>' +
      '<ol class="rk-list"></ol>' +
      '<div class="rk-answer" hidden></div>' +
      '<div class="w-row" style="margin-top:12px"><button class="btn small" data-act="next"></button><button class="btn small ghost" data-act="again" hidden>Start again</button></div>');
    el.appendChild(box);
    var list = box.querySelector(".rk-list"), stageEl = box.querySelector(".rk-stage"), ans = box.querySelector(".rk-answer"), next = box.querySelector('[data-act="next"]'), again = box.querySelector('[data-act="again"]');
    function paint() {
      if (stage < 0) {
        stageEl.innerHTML = '<p class="muted" style="margin:12px 0 0">Five chunks in the company knowledge base mention expenses, travel or deadlines. Start the pipeline to see which ones the search returns.</p>';
        list.innerHTML = ""; ans.hidden = true; next.textContent = RK.stages[0].btn; return;
      }
      var s = RK.stages[stage];
      stageEl.innerHTML = '<p style="margin:14px 0 4px"><b>' + esc(s.name) + '</b> · <span class="muted">' + esc(s.note) + "</span></p>";
      var rows = s.order.map(function (o, i) {
        var c = RK.chunks[o[0]], inCtx = i < s.k;
        return '<li class="rk-row' + (inCtx ? " in" : "") + '"><span class="rk-n">' + (i + 1) + '</span><span class="rk-t"><b>[' + o[0] + "]</b> " + esc(c.t) + (inCtx ? ' <span class="stamp ok">In context</span>' : "") + '</span><span class="rk-s">' + o[1].toFixed(2) + "</span></li>";
      });
      if (s.dropped) rows.push('<li class="rk-row out"><span class="rk-n">–</span><span class="rk-t"><b>[' + s.dropped + "]</b> " + esc(RK.chunks[s.dropped].t) + ' <span class="stamp warn">Superseded, filtered out</span></span><span class="rk-s"></span></li>');
      list.innerHTML = rows.join("");
      ans.hidden = false;
      ans.innerHTML = '<div class="draft" style="margin:14px 0 0"><div class="draft-h"><span><b>AI draft</b> · answer from the top ' + s.k + ' chunks</span></div><div class="draft-b"><p>' + esc(s.answer) + '</p></div><div class="review"><div class="r"><span class="stamp ' + s.stamp[0] + '">' + s.stamp[1] + "</span><span>" + esc(s.review) + "</span></div></div></div>";
      if (stage < RK.stages.length - 1) next.textContent = RK.stages[stage + 1].btn;
      else { next.hidden = true; again.hidden = false; }
    }
    next.addEventListener("click", function () { stage += 1; paint(); });
    again.addEventListener("click", function () { el.innerHTML = ""; W.rerank(el); });
    paint();
  };
})();
