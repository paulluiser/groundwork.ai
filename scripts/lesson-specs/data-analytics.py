SPEC = dict(
file="11c-data-analytics.js",
reviewed="2026-11",
outcomes=["Run a five-step check on an AI-written query before its number is used."],
situation="""<p>A product manager asks an assistant connected to the warehouse: “How many customers churned last quarter?” It answers 1,284 in four seconds, with a neat query. Finance's number for the same quarter is 912. Both are “right”: the assistant counted any account with no login for 30 days; finance counts cancelled subscriptions.</p>
<p>Most wrong numbers from AI-written queries aren't syntax errors. They're definitions, joins and date ranges that quietly differ from the ones your organisation uses. This lesson is about catching those before the number reaches a slide.</p>""",
warmup=dict(q="An AI query returns a churn number that differs from finance's. What's the most likely cause?", a=2, opts=[
  ("The database returned stale results from a cache.", "Possible, but definitions are the usual culprit."),
  ("The assistant made an arithmetic mistake in the sum.", "Databases do the arithmetic, and get it right."),
  ("The query uses a different definition of churn.", "Right. Definitions differ far more often than arithmetic."),
  ("Finance's number is out of date and should be replaced.", "Assume your official number is right until shown otherwise."),
 ]),
sections="""<h2>Definitions live in one place</h2>
<p>A semantic layer, sometimes called a metrics layer, defines each business metric once (what counts as active, churned or revenue, and from which tables) so every tool, dashboard and assistant computes it the same way.[S1] When an assistant writes SQL against raw tables, it invents its own definition from column names. When it queries through the metrics layer, it uses yours. If your organisation has one, point AI tools at it. If not, a short written definitions page given to the assistant does much of the same job.</p>
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
</div></div></div>""",
myths=[
 ("If the SQL runs without errors, the number is right.", "Wrong definitions, joins and dates all run without errors."),
 ("AI is good at text-to-SQL now, so checks are optional.", "Benchmarks on real enterprise warehouses still show low success rates.[1]"),
 ("A bigger number from a new query means we found missing data.", "It more often means a join fan-out. Check row counts before celebrating."),
 ("Everyone knows what “active user” means.", "Teams routinely define it differently. Write it down once and point every tool at it."),
],
recap=[
 "Most wrong numbers come from definitions, joins and dates, not syntax.",
 "Point AI tools at a metrics layer or a written definitions page.",
 "Reproduce a known official number before trusting a new query.",
 "Check joins for fan-out and dates for inclusive ends and time zones.",
 "Spot-check rows: would a person agree each one belongs?",
],
checks=[
 dict(q="Why does joining a contacts table inflate an invoice total?", a=1, opts=[
  ("Contacts tables store amounts in a different currency.", "Currency isn't involved."),
  ("Each invoice is repeated once per contact, then summed.", "Right. That's join fan-out."),
  ("The join removes invoices without contacts from the sum.", "That would reduce the total, not inflate it."),
  ("Contacts are counted as separate customers.", "The sum is of invoice amounts, not customers."),
 ]),
 dict(q="What's the problem with BETWEEN '2026-03-01' AND '2026-03-31' on a timestamp column?", a=3, opts=[
  ("BETWEEN isn't supported by most SQL databases.", "It's widely supported."),
  ("It includes the whole of 1 April by mistake.", "It doesn't reach April at all."),
  ("It excludes the whole of 1 March.", "1 March from midnight is included."),
  ("It excludes almost all of 31 March.", "Right. It stops at midnight at the start of the 31st."),
 ]),
 dict(q="What does a semantic or metrics layer give AI tools?", a=0, opts=[
  ("The organisation's agreed definition of each metric.", "Right. Everyone computes metrics the same way."),
  ("Faster queries through automatic caching.", "Some do cache, but that isn't the main point."),
  ("Permission to write directly to production tables.", "It's about definitions, not write access."),
  ("A way to skip checking AI-written SQL.", "It reduces risk; checking still matters."),
 ]),
 dict(q="Which check would have caught the 1,284 vs 912 churn mismatch fastest?", a=2, opts=[
  ("Re-running the query to see if it returns the same number.", "It will, consistently wrong."),
  ("Asking the assistant to explain its query in plain English.", "Helps, but you still need the official definition."),
  ("Comparing its logic with the official definition of churn.", "Right. Logins versus cancellations is visible at once."),
  ("Checking the query for SQL syntax errors.", "There were none."),
 ]),
 dict(q="Why spot-check ten rows the query counted?", a=1, opts=[
  ("Databases sometimes return random rows.", "They don't."),
  ("To see whether a person would agree each one belongs.", "Right. It tests the definition against reality."),
  ("To measure how fast the query runs.", "Speed isn't what this checks."),
  ("Because regulators require row-level sampling.", "Not the reason here."),
 ]),
],
sources=[
 'dbt Labs, <a href="https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl" target="_blank" rel="noopener">The dbt Semantic Layer</a>. Defining metrics once so every tool computes them the same way.',
],
)
