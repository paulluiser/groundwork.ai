GW.lesson({
  id: "data-analytics",
  lede: "AI makes it easy for anyone on the team to ask a question of the data and get a number back. The risk is that the number is wrong in ways nobody notices, because a wrong query still returns a confident result.",
  outcomes: [
    "Use AI to draft queries, explain schemas and summarise results, and know which of those need checking.",
    "Check an AI-written query for the three most common errors: wrong grain, wrong date boundary and wrong metric definition.",
    "Sanity-check a number against something you already know before anyone acts on it.",
    "Explain why an AI's account of why a metric moved is a hypothesis, not a finding."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Personal data in prompts.</strong> Query results often contain customer data. Use only tools approved for it, and prefer aggregated results (lesson 8).</li>
<li><strong>Silent joins.</strong> A join that duplicates rows inflates every sum after it. Check row counts before and after each join.</li>
<li><strong>Charts that imply more than the data.</strong> Generated charts can pick axes and smoothing that exaggerate a trend. Check the axis starts and the underlying numbers.</li>
<li><strong>Answering a different question.</strong> “Active” can mean logged in, did something, or paid. Make the model state which one it used.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick a metric your team already reports. Ask an assistant to write the query from scratch using your schema. Compare its number with the reported one. If they differ, find out why. You'll learn as much about your metric definitions as about the tool.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An AI-written query returns a number three times higher than the dashboard. What do you check first?</p><ul>
<li data-fb="Possible, but the dashboard has a history of being right. The new query is the untested part.">Whether the dashboard is broken.</li>
<li data-fb="Right. Grain, joins and date boundaries cause most of these errors.">The new query: what one row means, the joins and the date range.</li>
<li data-fb="Its answer would be another unverified claim.">Ask the assistant which number is right.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which date filter correctly selects all of October on a timestamp column?</p><ul>
<li data-fb="On a timestamp, this stops at midnight at the start of 31 October.">BETWEEN '2026-10-01' AND '2026-10-31'</li>
<li data-fb="This misses the last second of the month, and depends on precision.">BETWEEN '2026-10-01' AND '2026-10-31 23:59:59'</li>
<li data-fb="Right. A half-open range includes the whole of the last day at any precision.">&gt;= '2026-10-01' AND &lt; '2026-11-01'</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An assistant says sign-ups rose because of last week's newsletter. What is that?</p><ul>
<li data-fb="Right. Test it: did sign-ups rise among people who got the newsletter, and when?">A hypothesis to test against the data.</li>
<li data-fb="The model has no access to what actually caused the change.">A finding, since it read the data.</li>
<li data-fb="It may be right. It just isn't shown yet.">Certainly wrong.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Li et al. (2023), <a href="https://arxiv.org/abs/2305.03111" target="_blank" rel="noopener">Can LLM Already Serve as a Database Interface? (BIRD benchmark)</a>. Text-to-SQL is much harder on large, messy, real-world databases than on clean examples.</li>
<li>PostgreSQL documentation, <a href="https://www.postgresql.org/docs/current/functions-comparison.html" target="_blank" rel="noopener">Comparison functions and operators</a>. BETWEEN is inclusive of both ends.</li>
<li>Kohavi, Tang and Xu (2020), <a href="https://experimentguide.com/" target="_blank" rel="noopener">Trustworthy Online Controlled Experiments</a>. Pre-registered metrics and common analysis errors.</li>
</ol></section>
`
});
