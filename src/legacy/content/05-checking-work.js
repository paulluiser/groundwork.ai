GW.lesson({
  id: "checking-work",
  lede: "Checking everything thoroughly would cancel out any time AI saves. Checking nothing is how mistakes reach customers. This lesson gives you a way to decide how much checking each result deserves, and what to do once you've checked.",
  outcomes: [
    "Place a task on two axes, the cost of an error and the ease of spotting one, and choose a level of checking.",
    "Use a set of verification techniques that compare output against something outside the model.",
    "Verify a piece of AI-assisted work step by step, including edge cases.",
    "Decide whether to accept, edit, reject or escalate a result, and own that decision."
  ],
  html: String.raw`
<h2>The question to ask first</h2>
<p>Before you ask an AI for anything, ask yourself two questions:</p>
<ol>
<li><strong>If this is wrong, how bad is it?</strong> A clumsy sentence in an internal note costs nothing. A wrong refund rule in a customer email costs money and trust. A bad database migration can cost a weekend.</li>
<li><strong>If this is wrong, how easily would I notice?</strong> Code with good tests fails loudly. A subtle error in a legal summary, a plausible statistic or a slightly-off estimate can sit unnoticed for months.</li>
</ol>
<p>Put the two answers together and you get a map with four regions. Each region calls for a different way of working.</p>
<figure>
<svg class="fig" viewBox="0 0 640 380" role="img" aria-label="Two-by-two grid. Horizontal axis: cost if wrong, low to high. Vertical axis: how hard errors are to spot. Low cost and easy to spot: use freely. High cost and easy to spot: use it and check every time. Low cost and hard to spot: use as raw material, not fact. High cost and hard to spot: keep the judgment human.">
  <defs><marker id="ah5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="ah"/></marker></defs>
  <g class="okb"><rect class="box" x="70" y="200" width="270" height="140" rx="10"/><text class="ttl" x="88" y="230">Use freely</text><text class="sm" x="88" y="254">Glance over it. Fix what you notice.</text><text class="sm" x="88" y="276">e.g. tidying notes, renaming</text><text class="sm" x="88" y="294">variables under test</text></g>
  <g class="acc"><rect class="box" x="352" y="200" width="270" height="140" rx="10"/><text class="ttl" x="370" y="230">Use it, check every time</text><text class="sm" x="370" y="254">Run it, test it, compare to source.</text><text class="sm" x="370" y="276">e.g. a migration you can run on</text><text class="sm" x="370" y="294">a staging copy; a policy answer</text></g>
  <g class="warnb"><rect class="box" x="70" y="48" width="270" height="140" rx="10"/><text class="ttl" x="88" y="78">Raw material, not fact</text><text class="sm" x="88" y="102">Use for ideas and options.</text><text class="sm" x="88" y="124">Never pass it on as verified.</text><text class="sm" x="88" y="146">e.g. brainstorming, a first look</text><text class="sm" x="88" y="164">at an unfamiliar market</text></g>
  <g class="badb"><rect class="box" x="352" y="48" width="270" height="140" rx="10"/><text class="ttl" x="370" y="78">Keep the judgment human</text><text class="sm" x="370" y="102">AI can gather and draft. A person</text><text class="sm" x="370" y="124">with expertise decides and signs.</text><text class="sm" x="370" y="146">e.g. legal or security assessments,</text><text class="sm" x="370" y="164">decisions about people</text></g>
  <path class="e" d="M70 356 L622 356" marker-end="url(#ah5)"/><text class="lbl" x="346" y="376" text-anchor="middle">Cost if wrong →</text>
  <path class="e" d="M52 340 L52 50" marker-end="url(#ah5)"/><text class="lbl" x="40" y="195" text-anchor="middle" transform="rotate(-90 40 195)">Harder to spot errors →</text>
</svg>
<figcaption>Checking effort should grow with the cost of an error, and the decision should stay with a person where errors are both costly and hard to see.</figcaption>
</figure>
<div class="key"><p>Match the checking to the stakes. Where errors are cheap and visible, move fast. Where they are costly or invisible, slow down, and in the top-right corner keep the judgment with a qualified person.</p></div>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Place the tasks</span></div><div class="activity-b">
<p>For each task, choose the region you think it belongs in. There is room for argument at the edges; the feedback explains the reasoning.</p>
<div data-w="matrix"></div>
</div></div>

<h2>Your verification toolkit</h2>
<p><a class="term" data-t="verification">Verification</a> means comparing the output against something that doesn't come from the model. In rough order of strength:</p>
<div class="tbl"><table>
<thead><tr><th>Technique</th><th>How</th><th>Good for</th></tr></thead>
<tbody>
<tr><td><b>Run it</b></td><td>Execute the code, query or formula and look at what actually happens.</td><td>Code, SQL, spreadsheet formulas, commands (in a safe environment).</td></tr>
<tr><td><b>Test against known answers</b></td><td>Feed in a small case where you already know the right result.</td><td>Calculations, data transformations, parsing, metrics.</td></tr>
<tr><td><b>Trace to the source</b></td><td>Open the document, standard or record and find the sentence that supports the claim.</td><td>Facts, quotes, policy answers, citations, research summaries.</td></tr>
<tr><td><b>Compare with an independent figure</b></td><td>Check against a number you trust from elsewhere: last month's report, the existing dashboard.</td><td>Metrics, estimates, totals.</td></tr>
<tr><td><b>Probe the edges</b></td><td>Try empty, huge, negative, duplicate, missing, late and unusual inputs.</td><td>Logic, rules, anything with boundaries.</td></tr>
<tr><td><b>Ask someone who knows</b></td><td>A domain expert, the owner of the system, the person who was in the meeting.</td><td>Anything specific to your organisation, or outside your expertise.</td></tr>
<tr><td><b>Model self-critique or regeneration</b></td><td>Ask it to find problems, or ask again and compare.</td><td>Generating a list of things to check. Weak on its own (lesson 3).</td></tr>
</tbody></table></div>

<h2>Worked example: checking a metric query</h2>
<p>An analyst on a product team needs monthly active users (MAU) for a board slide. They ask an assistant for SQL against the <code>events</code> table and get this:</p>
<pre class="code">SELECT DATE_TRUNC('month', created_at) AS month,
       COUNT(user_id) AS mau
FROM events
GROUP BY 1
ORDER BY 1;</pre>
<p>It runs without error and returns numbers that look reasonable. Board slide, so high cost if wrong. Errors in a metric are hard to spot by eye, but the query itself can be tested. That puts it in “use it, check every time”. Here is the check, step by step.</p>
<ol class="steps">
<li><strong>Pin down the definition first</strong>What counts as “active”? Ask the metric's owner. Suppose the answer is: <em>a distinct, non-internal user who performed at least one action (not just received an email) in the calendar month, UK time.</em> Without this you can't judge the query; with it, three gaps are already visible.</li>
<li><strong>Read the query and restate it in words</strong>“For each month, count rows in events.” That counts <em>events</em>, not <em>users</em>. A user who clicked 50 times counts 50 times. This alone would inflate the number many times over.</li>
<li><strong>Test on a tiny known dataset</strong>Make five rows where you know the answer:
<div class="tbl" style="margin:10px 0"><table><thead><tr><th>user_id</th><th>event</th><th>created_at (UTC)</th></tr></thead><tbody>
<tr><td>u1</td><td>page_view</td><td>2025-03-03 10:00</td></tr>
<tr><td>u1</td><td>add_to_cart</td><td>2025-03-03 10:02</td></tr>
<tr><td>u2</td><td>page_view</td><td>2025-03-14 09:00</td></tr>
<tr><td>u3</td><td>email_received</td><td>2025-03-20 08:00</td></tr>
<tr><td>staff1</td><td>page_view</td><td>2025-03-21 12:00</td></tr>
</tbody></table></div>
By the definition, March MAU is 2 (u1 and u2). The AI's query returns 5.</li>
<li><strong>Fix and retest</strong>Count distinct users, filter out passive events and internal accounts, then run the five rows again: the result is 2.
<pre class="code">SELECT DATE_TRUNC('month', created_at AT TIME ZONE 'Europe/London') AS month,
       COUNT(DISTINCT e.user_id) AS mau
FROM events e
JOIN users u ON u.id = e.user_id
WHERE u.is_internal = false
  AND e.event_type NOT IN ('email_received')
GROUP BY 1
ORDER BY 1;</pre></li>
<li><strong>Compare with an independent number</strong>The existing dashboard shows roughly 41,000 MAU for last month. The fixed query says 40,700: close, with a gap you can explain (the dashboard counts in UTC). The original query said 1.9 million. That comparison alone would have caught the bug.</li>
<li><strong>Probe the edges</strong>Users active only at 00:30 UK time on the 1st (timezone boundary). Deleted users (does the join drop them?). Users with a null <code>user_id</code>. Each one is a question for the metric owner, not just the query.</li>
<li><strong>Decide</strong>Edit and use, with the definition written under the chart. Because it's going to the board, a second person reviews the final query. Total time: about 25 minutes, most of it on the definition, which you needed anyway.</li>
</ol>
<p>Notice what made this work. The check didn't depend on knowing SQL better than the model. It depended on <strong>a clear definition, a tiny dataset with a known answer and an independent number</strong>. Those three work for spreadsheets, scripts and estimates too.</p>
<p class="aside"><strong>A note on the fixed query.</strong> The <code>AT TIME ZONE</code> syntax is PostgreSQL. Other databases convert time zones differently, so check the syntax for yours.</p>

<h2>Why checking is harder than it sounds</h2>
<p>People tend to over-trust automated suggestions, a pattern called <a class="term" data-t="automation-bias">automation bias</a>. Studies of pilots, clinicians and operators found that people with an automated aid often miss errors the aid makes, and look less hard for problems it didn't flag.<sup>[1]</sup> AI assistants add two twists: the output is fluent, and there is a lot of it.</p>
<p>Habits that counter it:</p>
<ul>
<li><strong>Decide what you'll check before you read the output.</strong> Otherwise a confident draft sets the agenda.</li>
<li><strong>Look for the specific claims</strong> (numbers, names, rules) rather than reading for overall impression.</li>
<li><strong>Keep reviews small.</strong> Reviewing 30 lines carefully beats skimming 600. Ask for smaller pieces.</li>
<li><strong>Notice when you're tired or rushed.</strong> That is when “looks fine” replaces checking.</li>
</ul>
<p>Feeling faster isn't the same as being faster, either. In a 2025 randomised study, experienced open-source developers using AI tools on their own projects took 19% longer to finish tasks, while believing afterwards they had been about 20% faster.<sup>[3]</sup> One study doesn't settle the question, but it's a good reason to measure rather than assume. Lesson 45 returns to this.</p>

<h2>Decide what to do with the result</h2>
<p>After checking, you have four options. Choosing one deliberately is part of the work.</p>
<div class="tbl"><table>
<thead><tr><th>Decision</th><th>When</th><th>Example</th></tr></thead>
<tbody>
<tr><td><span class="fit good">Accept</span></td><td>Your checks passed and the stakes match the checking you did.</td><td>A test helper that passes its tests and that you've read.</td></tr>
<tr><td><span class="fit care">Edit</span></td><td>The structure is useful; specific parts are wrong or off-tone.</td><td>The MAU query above. A status report with one overstated line.</td></tr>
<tr><td><span class="fit human">Reject</span></td><td>Fixing it would take longer than doing it yourself, or it's wrong in its foundations.</td><td>A design rationale built on a misunderstanding of your users.</td></tr>
<tr><td><span class="fit human">Escalate</span></td><td>You can't judge it, and it matters.</td><td>An AI summary of a contract clause; a security finding you can't assess.</td></tr>
</tbody></table></div>
<p>Whatever you choose, <strong>you own the result</strong>. “The AI wrote it” isn't a defence a customer, colleague or regulator will accept, any more than “the intern wrote it” would be. That is also why many teams agree on disclosure: saying when work was AI-assisted, so reviewers know where to look harder. Follow your organisation's policy. Lesson 45 covers setting team norms.</p>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">A generated spreadsheet formula calculates sales commission for 40 people. It returns sensible-looking numbers. What is the best next step?</p><ul>
<li data-fb="Plausible-looking is exactly what generated output always is. That's not evidence.">Use it; the numbers look sensible.</li>
<li data-fb="It may produce useful points to check, but it can't certify the formula.">Ask the assistant to double-check its formula.</li>
<li data-fb="Right. Pay is high-cost if wrong and testable. Known cases, including thresholds and edge cases, catch errors that eyeballing won't.">Work out three people's commission by hand, including someone exactly at a threshold, and compare.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An AI tool produces an assessment of whether a vendor meets your security requirements. Where does this sit, and what follows?</p><ul>
<li data-fb="Right. A wrong call is costly and the errors are hard to see. Use the AI to gather documents and draft questions; a qualified person makes and signs the assessment.">High cost, hard to check: a security specialist makes the judgment; the AI can help gather and draft.</li>
<li data-fb="A wrong security judgment can be very costly.">Low cost, easy to check: accept it if it reads well.</li>
<li data-fb="The cost of error is high, so this isn't just raw material.">Low cost, hard to check: use it as raw material.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">In the MAU example, which check would have caught the bug fastest, without reading SQL?</p><ul>
<li data-fb="Regeneration could repeat the same mistake consistently.">Asking the assistant to regenerate the query.</li>
<li data-fb="Right. 1.9 million against roughly 41,000 on the existing dashboard is an immediate red flag.">Comparing the result with the existing dashboard figure.</li>
<li data-fb="Formatting has nothing to do with correctness.">Checking the query is neatly formatted.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Parasuraman and Manzey (2010), <a href="https://doi.org/10.1177/0018720810376055" target="_blank" rel="noopener">Complacency and Bias in Human Use of Automation: An Attentional Integration</a>, Human Factors 52(3). A review of automation bias research.</li>
<li>NIST (2024), <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" target="_blank" rel="noopener">AI 600-1: Generative AI Profile</a>. Lists confabulation and over-reliance among the core risks of generative AI, with suggested actions.</li>
<li>Becker et al., METR (2025), <a href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener">Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity</a>. A randomised trial where perceived and measured speed-ups diverged.</li>
</ol></section>
`
});
