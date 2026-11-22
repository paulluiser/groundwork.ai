GW.lesson({
  id: "data-analytics",
  reviewed: "2026-11",
  lede: "AI makes it easy for anyone on the team to ask a question of the data and get a number back. The risk is that the number is wrong in ways nobody notices, because a wrong query still returns a confident result.",
  outcomes: [
    "Use AI to draft queries, explain schemas and summarise results, and know which of those need checking.",
    "Check an AI-written query for the three most common errors: wrong grain, wrong date boundary and wrong metric definition.",
    "Sanity-check a number against something you already know before anyone acts on it.",
    "Explain why an AI's account of why a metric moved is a hypothesis, not a finding.",
    "Run a five-step check on an AI-written query before its number is used."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>A product manager asks an assistant connected to the warehouse: “How many customers churned last quarter?” It answers 1,284 in four seconds, with a neat query. Finance's number for the same quarter is 912. Both are “right”: the assistant counted any account with no login for 30 days; finance counts cancelled subscriptions.</p>
<p>Most wrong numbers from AI-written queries aren't syntax errors. They're definitions, joins and date ranges that quietly differ from the ones your organisation uses. This lesson is about catching those before the number reaches a slide.</p></div>
<div class="check warmup" data-a="2"><p class="q">An AI query returns a churn number that differs from finance's. What's the most likely cause?</p><ul>
<li data-fb="Possible, but definitions are the usual culprit.">The database returned stale results from a cache.</li>
<li data-fb="Databases do the arithmetic, and get it right.">The assistant made an arithmetic mistake in the sum.</li>
<li data-fb="Right. Definitions differ far more often than arithmetic.">The query uses a different definition of churn.</li>
<li data-fb="Assume your official number is right until shown otherwise.">Finance's number is out of date and should be replaced.</li>
</ul></div>
<h2>Where AI meets data work</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Explaining an unfamiliar schema or query</td><td><span class="fit good">Good fit</span></td><td>Fast orientation. Confirm table meanings with whoever owns the data.</td></tr>
<tr><td>Drafting SQL, dbt models and notebook code</td><td><span class="fit good">Good fit</span></td><td>Saves syntax work. Run it on a sample you can count by hand.</td></tr>
<tr><td>Natural-language questions of the data (<a class="term" data-t="text-to-sql">text-to-SQL</a>)</td><td><span class="fit care">Use with care</span></td><td>Works on clean, well-described schemas; weaker on messy real ones.<sup>[1]</sup> Check the query, not only the answer.</td></tr>
<tr><td>Summarising dashboards and results</td><td><span class="fit care">Use with care</span></td><td>Good prose, but it can invent comparisons or trends. Check each number it quotes.</td></tr>
<tr><td>Explaining why a metric moved</td><td><span class="fit care">Use with care</span></td><td>Produces plausible stories. Treat them as hypotheses to test.</td></tr>
<tr><td>Deciding what a metric means, and calling an experiment</td><td><span class="fit human">Keep human</span></td><td>Definitions and decisions need owners. Experiment calls need pre-agreed rules.<sup>[3]</sup></td></tr>
</tbody></table></div>

<h2>Worked example: monthly active users</h2>
<p>A product manager asks an assistant: “How many monthly active users did we have in October?” It writes a query, runs it and summarises the result. The team dashboard says 412,000. The assistant's answer is three times that.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the query, not just the answer</span></div><div class="activity-b">
<p>Read the schema, the query and the result. Flag every claim in the assistant's summary that is wrong or unsupported.</p>
<div data-w="claims" data-cfg="data-mau"></div>
</div></div>

<p>Two errors in one short query, both common:</p>
<ol class="steps">
<li><strong>The grain was wrong</strong>The <a class="term" data-t="grain">grain</a> of the events table is one row per action, not one per user. <code>COUNT(user_id)</code> counts actions. Active users needs <code>COUNT(DISTINCT user_id)</code>.</li>
<li><strong>The date boundary was wrong</strong><code>BETWEEN '2026-10-01' AND '2026-10-31'</code> on a timestamp means up to midnight at the <em>start</em> of 31 October, so almost the whole last day is missing.<sup>[2]</sup> Use a half-open range: <code>occurred_at &gt;= '2026-10-01' AND occurred_at &lt; '2026-11-01'</code>. Then decide which time zone “October” means.</li>
<li><strong>The explanation defended the number</strong>When the result disagreed with the dashboard, the summary blamed the dashboard. A number that disagrees with a trusted source is a reason to check the query first.</li>
<li><strong>A comparison was invented</strong>The query only covered October. The “18% up on September” came from nowhere.</li>
</ol>
<div class="key"><p>Before a number leaves your hands, compare it with one you already trust. If they disagree, the new query is the first suspect.</p></div>

<h2>A routine for AI-written queries</h2>
<ul>
<li><strong>State the grain.</strong> Tell the model what one row means in each table, and ask it to say what one row of its result means.</li>
<li><strong>Use half-open date ranges and name the time zone.</strong> Most monthly reporting errors live at the boundaries.</li>
<li><strong>Test on something you can count.</strong> Run the query for one user or one day, and count by hand.</li>
<li><strong>Use shared definitions.</strong> If your team has a <a class="term" data-t="semantic-layer">semantic layer</a> or metric definitions, point the model at them. “Active user” should mean one thing everywhere.</li>
<li><strong>Keep the query with the number.</strong> Share the SQL alongside any figure so others can check it.</li>
</ul>

<h2>Why did it go up?</h2>
<p>Ask a model why sign-ups rose last week and it will give reasons: a campaign, seasonality, a release. They sound like analysis, but the model has no access to what caused the change. At best it can suggest hypotheses for you to test against the data.</p>
<p>The same goes for experiments. An assistant can draft the analysis, but whether the result counts depends on decisions made before the test: the metric, the sample size, how long it runs. Deciding those after seeing the data is how false wins get shipped.<sup>[3]</sup></p>

<h2>Definitions live in one place</h2>
<p>A semantic layer, sometimes called a metrics layer, defines each business metric once (what counts as active, churned or revenue, and from which tables) so every tool, dashboard and assistant computes it the same way.[4] When an assistant writes SQL against raw tables, it invents its own definition from column names. When it queries through the metrics layer, it uses yours. If your organisation has one, point AI tools at it. If not, a short written definitions page given to the assistant does much of the same job.</p>
<h2>Worked example: the five-step query check</h2>
<ol class="steps">
<li><strong>Definition</strong>Does the query's logic match the official definition? Here: logins, not cancellations. Fails.</li>
<li><strong>Known number</strong>Run it for a period with an agreed figure (last quarter's board number). If it doesn't match, stop.</li>
<li><strong>Joins</strong>Check each join for fan-out: count rows before and after. A join to an events table can multiply customers.</li>
<li><strong>Filters and dates</strong>Inclusive or exclusive end dates, time zones, test accounts, internal users.</li>
<li><strong>Spot-check rows</strong>Pull ten customers the query counted and look them up. Would a person agree each one churned?</li>
</ol>
<ul class="wx-notes">
<li><strong>Step 1 would have caught the churn mismatch in a minute.</strong> Steps 2 and 5 catch most of the rest.</li>
<li><strong>The check takes ten minutes</strong> and protects a number that may be quoted for months.</li>
</ul>
<h2>Your turn: check a query</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">What would you check in this query?</span></div><div class="activity-b">
<p>An assistant wrote this to answer “revenue from enterprise customers in March”:</p>
<pre class="code">SELECT SUM(i.amount)
FROM invoices i
JOIN customers c ON c.id = i.customer_id
JOIN contacts k ON k.customer_id = c.id
WHERE c.plan = 'enterprise'
  AND i.created_at BETWEEN '2026-03-01' AND '2026-03-31';</pre>
<p>List the problems you'd look for and how you'd check each.</p>
<div data-w="task" data-key="data-query-check">
<div class="task-model"><ul>
<li><strong>Fan-out:</strong> joining contacts multiplies each invoice by the number of contacts. The contacts join isn't needed; remove it, or compare row counts.</li>
<li><strong>Dates:</strong> <code>BETWEEN … '2026-03-31'</code> on a timestamp excludes most of 31 March. Use <code>&lt; '2026-04-01'</code>.[2]</li>
<li><strong>Definition of revenue:</strong> invoices created, or paid? Net of refunds and credit notes? Which currency?</li>
<li><strong>Definition of enterprise:</strong> current plan, or plan at the time of the invoice?</li>
<li><strong>Known number:</strong> compare with finance's March figure.</li>
</ul></div>
<ul class="task-rubric">
<li>Spots the unnecessary join that inflates the sum</li>
<li>Spots the end-date problem with timestamps</li>
<li>Questions the definition of revenue (paid, refunds, currency)</li>
<li>Questions whether the plan is current or historical</li>
<li>Proposes comparing with a known official figure</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Personal data in prompts.</strong> Query results often contain customer data. Use only tools approved for it, and prefer aggregated results (lesson 8).</li>
<li><strong>Silent joins.</strong> A join that duplicates rows inflates every sum after it. Check row counts before and after each join.</li>
<li><strong>Charts that imply more than the data.</strong> Generated charts can pick axes and smoothing that exaggerate a trend. Check the axis starts and the underlying numbers.</li>
<li><strong>Answering a different question.</strong> “Active” can mean logged in, did something, or paid. Make the model state which one it used.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick a metric your team already reports. Ask an assistant to write the query from scratch using your schema. Compare its number with the reported one. If they differ, find out why. You'll learn as much about your metric definitions as about the tool.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>If the SQL runs without errors, the number is right.</dt><dd>Wrong definitions, joins and dates all run without errors.</dd>
<dt>AI is good at text-to-SQL now, so checks are optional.</dt><dd>Benchmarks on real enterprise warehouses still show low success rates.[1]</dd>
<dt>A bigger number from a new query means we found missing data.</dt><dd>It more often means a join fan-out. Check row counts before celebrating.</dd>
<dt>Everyone knows what “active user” means.</dt><dd>Teams routinely define it differently. Write it down once and point every tool at it.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Most wrong numbers come from definitions, joins and dates, not syntax.</li>
<li>Point AI tools at a metrics layer or a written definitions page.</li>
<li>Reproduce a known official number before trusting a new query.</li>
<li>Check joins for fan-out and dates for inclusive ends and time zones.</li>
<li>Spot-check rows: would a person agree each one belongs?</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Why does joining a contacts table inflate an invoice total?</p><ul>
<li data-fb="Currency isn't involved.">Contacts tables store amounts in a different currency.</li>
<li data-fb="Right. That's join fan-out.">Each invoice is repeated once per contact, then summed.</li>
<li data-fb="That would reduce the total, not inflate it.">The join removes invoices without contacts from the sum.</li>
<li data-fb="The sum is of invoice amounts, not customers.">Contacts are counted as separate customers.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">What's the problem with BETWEEN '2026-03-01' AND '2026-03-31' on a timestamp column?</p><ul>
<li data-fb="It's widely supported.">BETWEEN isn't supported by most SQL databases.</li>
<li data-fb="It doesn't reach April at all.">It includes the whole of 1 April by mistake.</li>
<li data-fb="1 March from midnight is included.">It excludes the whole of 1 March.</li>
<li data-fb="Right. It stops at midnight at the start of the 31st.">It excludes almost all of 31 March.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What does a semantic or metrics layer give AI tools?</p><ul>
<li data-fb="Right. Everyone computes metrics the same way.">The organisation's agreed definition of each metric.</li>
<li data-fb="Some do cache, but that isn't the main point.">Faster queries through automatic caching.</li>
<li data-fb="It's about definitions, not write access.">Permission to write directly to the production warehouse tables.</li>
<li data-fb="It reduces risk; checking still matters.">A way to skip checking AI-written SQL.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which check would have caught the 1,284 vs 912 churn mismatch fastest?</p><ul>
<li data-fb="It will, consistently wrong.">Re-running the query to see if it returns the same number.</li>
<li data-fb="Helps, but you still need the official definition.">Asking the assistant to explain its query in plain English.</li>
<li data-fb="Right. Logins versus cancellations is visible at once.">Comparing its logic with the official definition of churn.</li>
<li data-fb="There were none.">Checking the query for SQL syntax errors.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why spot-check ten rows the query counted?</p><ul>
<li data-fb="They don't.">Databases sometimes return random rows.</li>
<li data-fb="Right. It tests the definition against reality.">To see whether a person would agree each one belongs.</li>
<li data-fb="Speed isn't what this checks.">To measure how fast the query runs.</li>
<li data-fb="Not the reason here.">Because data regulators require row-level sampling for every query.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Li et al. (2023), <a href="https://arxiv.org/abs/2305.03111" target="_blank" rel="noopener">Can LLM Already Serve as a Database Interface? (BIRD benchmark)</a>. Text-to-SQL is much harder on large, messy, real-world databases than on clean examples.</li>
<li>PostgreSQL documentation, <a href="https://www.postgresql.org/docs/current/functions-comparison.html" target="_blank" rel="noopener">Comparison functions and operators</a>. BETWEEN is inclusive of both ends.</li>
<li>Kohavi, Tang and Xu (2020), <a href="https://experimentguide.com/" target="_blank" rel="noopener">Trustworthy Online Controlled Experiments</a>. Pre-registered metrics and common analysis errors.</li>

<li>dbt Labs, <a href="https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl" target="_blank" rel="noopener">The dbt Semantic Layer</a>. Defining metrics once so every tool computes them the same way.</li>
</ol></section>
`
});
