GW.lesson({
  id: "checking-work",
  reviewed: "2026-11",
  lede: "Checking everything thoroughly would cancel out any time AI saves. Checking nothing is how mistakes reach customers. This lesson gives you a way to decide how much checking each result deserves, and what to do once you've checked.",
  outcomes: [
    "Place a task on two axes, the cost of an error and the ease of spotting one, and choose a level of checking.",
    "Use a set of verification techniques that compare output against something outside the model.",
    "Verify a piece of AI-assisted work step by step, including edge cases.",
    "Decide whether to accept, edit, reject or escalate a result, and own that decision.",
    "Write a proportionate check plan for an AI-assisted deliverable before you start."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>It's 5 p.m. You have an AI-drafted quarterly report for leadership, a generated SQL query behind its headline number, and a one-line Slack reply to a customer. You have 30 minutes. You can't check everything equally, and you don't need to.</p>
<p>The skill this lesson teaches is deciding how much checking each piece deserves, doing the checks that actually catch errors, and noticing when you've stopped checking at all.</p></div>
<div class="check warmup" data-a="3"><p class="q">Which AI output deserves the most careful check?</p><ul>
<li data-fb="Low stakes: mistakes are cheap and caught in discussion.">A first draft of an internal brainstorming list for the team.</li>
<li data-fb="You know the content, so errors are easy to spot.">A rewrite of your own paragraph to make it shorter and clearer.</li>
<li data-fb="Little harm if the suggestions are poor.">Suggested names for an internal tool nobody outside will see.</li>
<li data-fb="Right. High cost of error, and hard to notice once accepted.">A number that leadership will use to decide next year's budget.</li>
</ul></div>
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

<h2>The jagged frontier</h2>
<p>A field experiment with 758 consultants at Boston Consulting Group found that, on tasks within the model's capabilities, people using AI finished more tasks, faster and to higher quality. On a task chosen to sit just outside those capabilities, people using AI were noticeably less likely to get the right answer than those without it; they trusted fluent output that was wrong.[4] The researchers called the boundary a “jagged frontier”: it isn't obvious from the outside which tasks fall on which side. That's the case for checking in proportion to the stakes, not to how confident the output sounds.</p>
<p>A 2025 survey of knowledge workers adds a second warning: the more people trusted AI, the less critical thinking they reported applying, while people more confident in their own expertise reported more.[5] Checking is a habit that erodes quietly unless you build it into the work.</p>
<h2>Worked example: a check plan</h2>
<p>For the 5 p.m. pile, a check plan takes two minutes to write and decides where the 30 minutes go.</p>
<div class="tbl"><table><thead><tr><th>Item</th><th>Cost if wrong</th><th>Would we notice?</th><th>Check</th><th>Time</th></tr></thead><tbody>
<tr><td>Headline number from the generated query</td><td>High: budget decision</td><td>Unlikely</td><td>Reproduce last quarter's known figure with the same query; read the joins and filters; spot-check 10 rows</td><td>15 min</td></tr>
<tr><td>Report narrative</td><td>Medium</td><td>Partly</td><td>Check every number and named fact against the source; read the conclusions as claims needing evidence</td><td>10 min</td></tr>
<tr><td>Customer Slack reply</td><td>Medium</td><td>Customer will</td><td>Check any promise, date or policy statement; read it once as the customer</td><td>3 min</td></tr>
<tr><td>Speaker notes for the meeting</td><td>Low</td><td>Yes, live</td><td>Skim</td><td>2 min</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Half the time goes to one number</strong>, because it's high-stakes and nobody would catch an error later.</li>
<li><strong>Checks are specific actions</strong>, not “review carefully”: reproduce a known figure, check named facts, read as the recipient.</li>
<li><strong>Low-stakes items get a skim on purpose.</strong> Proportion is a skill, not a shortcut.</li>
</ul>
<h2>Your turn: write a check plan</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Plan the checks for an AI-assisted deliverable</span></div><div class="activity-b">
<p>Think of something you'll produce with AI help this week. List its parts, and for each: the cost if it's wrong, whether anyone would notice, the specific check you'll do, and roughly how long it takes.</p>
<div data-w="task" data-key="checking-plan">
<div class="task-model"><p><strong>Deliverable:</strong> a migration runbook drafted with an assistant.</p>
<ul>
<li><strong>Commands:</strong> high cost (production), unlikely to notice until run. Run every command in staging; check flags against the tool's docs. 30 min.</li>
<li><strong>Rollback steps:</strong> very high cost, only noticed in a crisis. Do a real rollback in staging. 20 min.</li>
<li><strong>Timings and estimates:</strong> medium. Compare with the last migration's actual timings. 5 min.</li>
<li><strong>Background explanation:</strong> low. Skim for anything wrong about our setup. 3 min.</li>
</ul></div>
<ul class="task-rubric">
<li>Breaks the deliverable into parts rather than checking it as a whole</li>
<li>Rates the cost of an error and the chance of noticing for each part</li>
<li>Names a specific check for each part, not just “review”</li>
<li>Spends the most time on high-cost, hard-to-notice parts</li>
<li>Gives low-stakes parts a deliberately light check</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 15-minute exercise.</strong> Before your next AI-assisted task, write a check plan in the format above. Afterwards, note which check actually found something. Over a few weeks, you'll learn where your checks pay off.</div>
<h2>Common misconceptions</h2>
<dl class="myths">
<dt>If the output looks right, it probably is.</dt><dd>Fluent output looks right whether or not it is. Appearance is the thing AI is best at.</dd>
<dt>Checking everything thoroughly is the safe approach.</dt><dd>It isn't sustainable, so people end up checking nothing. Proportion keeps checking alive.</dd>
<dt>Asking a second AI to review is a check.</dt><dd>It can catch some issues, but both can share the same blind spots. Check high-stakes facts against a source.</dd>
<dt>Experienced people don't need to check.</dt><dd>Expertise makes checks faster and better, not unnecessary. Trust in AI tends to reduce checking for everyone.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Check in proportion to the cost of an error and how likely you are to notice it.</li>
<li>Use specific checks: known answers, sources, tests, reading as the recipient.</li>
<li>AI helps most inside its frontier and misleads most just outside it, and the edge isn't visible.</li>
<li>Spend most of your checking time on high-cost, hard-to-notice parts.</li>
<li>Write a two-minute check plan before you start, and note which checks pay off.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">You have 30 minutes to check an AI-assisted report. Where should most of the time go?</p><ul>
<li data-fb="Even spreading leaves the riskiest part under-checked.">Evenly across every section, so nothing is missed.</li>
<li data-fb="Readers notice prose; decisions rest on numbers.">On the prose, since that's what readers notice first.</li>
<li data-fb="Right. High cost and low chance of noticing.">On the number a decision rests on, which nobody else will re-check.</li>
<li data-fb="Looking credible isn't being correct.">On formatting, so the report looks credible.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What did the study of consultants find about tasks just outside the model's capabilities?</p><ul>
<li data-fb="Right. They trusted fluent output that was wrong.">People using AI were less likely to get the right answer.</li>
<li data-fb="That held inside the frontier, not outside it.">People using AI were faster and more accurate on every task.</li>
<li data-fb="It answered fluently, which is the problem.">AI refused to answer when tasks were too hard for it.</li>
<li data-fb="The drop in accuracy was substantial.">The difference between groups was too small to matter.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Which is a specific check rather than a vague one?</p><ul>
<li data-fb="“Carefully” isn't an action.">Review the query carefully before sending the report.</li>
<li data-fb="Reasonable-looking is what wrong numbers also do.">Make sure the numbers in the table look reasonable.</li>
<li data-fb="Its confidence isn't evidence.">Ask the assistant whether it is confident in the result.</li>
<li data-fb="Right. A known answer tests the method.">Re-run the query for last quarter and match the dashboard.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">A 2025 survey found that greater trust in AI was associated with what?</p><ul>
<li data-fb="The opposite was reported.">More time spent verifying outputs against sources.</li>
<li data-fb="Right. Trust tended to reduce reported critical thinking.">Less critical thinking applied to the work.</li>
<li data-fb="The survey measured reported effort, not accuracy.">Higher measured accuracy on every task.</li>
<li data-fb="It didn't find that.">Fewer people choosing to use AI tools at work.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which item can reasonably get only a quick skim?</p><ul>
<li data-fb="Right. Low cost, and you'll notice errors as you speak.">Speaker notes you'll correct live if something's off.</li>
<li data-fb="Very high cost, and only noticed in a crisis.">Rollback steps in a production migration runbook.</li>
<li data-fb="Money and promises to customers need checking.">A refund amount promised in a customer email.</li>
<li data-fb="High cost, and unlikely to be re-checked by anyone.">A figure in the board pack that drives a budget decision.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Parasuraman and Manzey (2010), <a href="https://doi.org/10.1177/0018720810376055" target="_blank" rel="noopener">Complacency and Bias in Human Use of Automation: An Attentional Integration</a>, Human Factors 52(3). A review of automation bias research.</li>
<li>NIST (2024), <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" target="_blank" rel="noopener">AI 600-1: Generative AI Profile</a>. Lists confabulation and over-reliance among the core risks of generative AI, with suggested actions.</li>
<li>Becker et al., METR (2025), <a href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener">Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity</a>. A randomised trial where perceived and measured speed-ups diverged.</li>

<li>Dell'Acqua et al. (2023), <a href="https://www.hbs.edu/faculty/Pages/item.aspx?num=64700" target="_blank" rel="noopener">Navigating the Jagged Technological Frontier</a>. Harvard Business School field experiment with 758 BCG consultants.</li>
<li>Lee et al., Microsoft Research and Carnegie Mellon (2025), <a href="https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/" target="_blank" rel="noopener">The Impact of Generative AI on Critical Thinking</a>. Survey of 319 knowledge workers (CHI 2025).</li>
</ol></section>
`
});
