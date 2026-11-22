GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["data-tests"] = {
  buckets: ["unique", "not_null", "accepted_values", "relationships"],
  items: [
    { t: "An AI-generated join produced two rows for some orders, so revenue was double-counted.", a: 0, why: "A unique test on order_id in the output model fails as soon as a join fans out." },
    { t: "A new status, “partially_refunded”, started appearing, and the revenue model silently ignored it.", a: 2, why: "accepted_values lists the statuses you've handled. A new one fails the test instead of disappearing from the numbers." },
    { t: "Some orders point to a customer_id that isn't in the customers table, so they vanish from customer reports.", a: 3, why: "A relationships test checks that every customer_id exists in customers. Orphans fail it." },
    { t: "After a source change, signup_date arrived empty for a third of users, and the monthly cohort chart dipped.", a: 1, why: "not_null on signup_date catches the gap before anyone reads the chart." },
    { t: "The model the assistant wrote for active users has one row per user per day instead of one per user.", a: 0, why: "A unique test on user_id tells you the grain isn't what the model's name promises." },
    { t: "Country codes include “UK” and “GB” for the same country, splitting the numbers.", a: 2, why: "accepted_values with the ISO list (GB, not UK) catches non-standard codes." },
    { t: "An event's account_id refers to accounts deleted last month.", a: 3, why: "relationships to the accounts table flags references to rows that no longer exist. Decide whether those events should be kept." },
    { t: "Revenue rows are missing a currency, so conversions fail quietly.", a: 1, why: "not_null on currency. Every amount needs one." }
  ],
  after: "Four simple tests catch a large share of real data problems, including the ones AI-written models introduce: fan-out joins, new categories, orphaned keys and missing values. Ask for them with every generated model."
};
GW.lesson({
  id: "data-quality",
  reviewed: "2026-11",
  lede: "AI can write pipeline code, data models and documentation quickly. That makes it easier to build a lot of data infrastructure that nobody fully checked. This lesson covers testing generated models, keeping shared definitions in one place, and keeping personal data where it belongs.",
  outcomes: [
    "Ask for tests with every AI-generated model, and know what the basic tests catch.",
    "Keep metric definitions in one shared place so people and AI tools use the same ones.",
    "Know why text-to-SQL accuracy drops on real enterprise data, and what to do about it.",
    "Apply basic data-protection rules when AI tools touch personal data.",
    "Write documentation for a data model that an AI tool can use to answer questions correctly."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>An assistant generates a new dbt model for “active subscriptions” in ten minutes, complete with documentation. The docs say <em>“status: the status of the subscription”</em> and <em>“amount: the amount”</em>. Three weeks later, an AI analyst tool answers a revenue question from this model, treats paused subscriptions as active, and sums amounts that are in four currencies.</p>
<p>Documentation used to be for people who'd ask a colleague when confused. Now AI tools read it literally and never ask. This lesson is about tests and documentation that hold up when machines are the main readers.</p></div>
<div class="check warmup" data-a="2"><p class="q">Which column description helps an AI tool answer correctly?</p><ul>
<li data-fb="Restates the name; says nothing useful.">“status: the status of the subscription.”</li>
<li data-fb="No information an AI tool can use.">“status: important field, see the product team.”</li>
<li data-fb="Right. Values and their meaning, including the trap.">“status: active, paused or cancelled; paused isn't billed.”</li>
<li data-fb="The type is useful but the meaning is missing.">“status: string, not null.”</li>
</ul></div>
<h2>Where AI helps with pipelines and governance</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting transformation models and SQL</td><td><span class="fit good">Good fit</span></td><td>Fast first versions. Ask for tests alongside, and review joins for fan-out.</td></tr>
<tr><td>Writing column and model documentation</td><td><span class="fit good">Good fit</span></td><td>Good at describing what the code does. Check that it describes what the business means.</td></tr>
<tr><td>Suggesting data tests</td><td><span class="fit good">Good fit</span></td><td>Proposes sensible checks quickly. Add the ones only you know matter.</td></tr>
<tr><td>Answering questions across a large warehouse</td><td><span class="fit care">Use with care</span></td><td>Accuracy drops sharply on real schemas. Point it at a <a class="term" data-t="semantic-layer">semantic layer</a>, not raw tables.</td></tr>
<tr><td>Classifying columns as personal data</td><td><span class="fit care">Use with care</span></td><td>A useful first pass. Free-text fields and combinations are easy to miss.</td></tr>
<tr><td>Deciding who may access what</td><td><span class="fit human">Keep human</span></td><td>A legal and policy decision with named owners.</td></tr>
</tbody></table></div>

<h2>Tests with every generated model</h2>
<p>In tools like dbt, a data test is a query that returns failing rows, so it passes when it returns none. dbt ships four basic tests: unique, not_null, accepted_values and relationships.<sup>[1]</sup> They're cheap to write, and an assistant can draft them with the model. Make that part of the request: “Write the model and its tests. Tell me the grain.”</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Which test would have caught it?</span></div><div class="activity-b">
<p>Match each problem to the basic test that would catch it first.</p>
<div data-w="sort" data-cfg="data-tests"></div>
</div></div>

<ol class="steps">
<li><strong>unique protects the grain</strong>Fan-out joins are the most common error in generated SQL, and they inflate every sum built on top.</li>
<li><strong>accepted_values catches new categories</strong>Without it, new values fall out of filters and CASE statements without anyone noticing.</li>
<li><strong>relationships and not_null catch silent gaps</strong>Missing keys and values don't throw errors; they just make numbers smaller.</li>
</ol>
<div class="key"><p>Generated pipeline code isn't finished until it has tests. A model nobody tested is a dashboard that's wrong in a way nobody has found yet.</p></div>

<h2>One definition, everywhere</h2>
<p>Text-to-SQL looks impressive on tidy benchmarks and struggles on real warehouses. On Spider 2.0, a benchmark built from real enterprise workflows with large schemas and several SQL dialects, the best system tested solved 21.3% of tasks, compared with over 90% on the earlier, simpler Spider 1.0.<sup>[3]</sup> Much of the difficulty is meaning, not syntax: which table is the real one, what “active” means, which revenue column finance uses.</p>
<p>The fix is the same for people and AI tools: write definitions down once, in a semantic layer or metrics catalogue, and point everything at it. When an assistant answers from shared definitions instead of guessing from column names, its answers match the dashboards.</p>

<h2>Personal data and AI tools</h2>
<p>Under the GDPR, personal data is any information relating to an identified or identifiable person, which is broader than names and emails. Pseudonymised data, where identifiers are replaced but could be linked back with extra information, is still personal data.<sup>[2]</sup> In practice:</p>
<ul>
<li><strong>Use aggregated or synthetic data</strong> when asking for help with logic. The assistant rarely needs real rows.</li>
<li><strong>Watch free-text columns.</strong> Notes, comments and ticket bodies contain names, health details and addresses nobody classified.</li>
<li><strong>Check where the tool sends data,</strong> and whether your company has approved it for this kind of data (lesson 8).</li>
<li><strong>Keep access rules in the warehouse,</strong> not in the prompt. An AI tool connected to data should see only what the person using it may see.</li>
</ul>

<h2>Docs that machines can use</h2>
<p>AI tools that answer questions from your warehouse rely on table and column descriptions to choose what to query. Good descriptions say what a row represents (the grain), what each value means, the units and currency, and the traps: values that look similar but mean different things, columns that shouldn't be summed, filters every query needs. Write them for a newcomer who will never ask a follow-up question, because that's what an AI tool is.</p>
<h2>Worked example: documenting a model</h2>
<div class="worked">
<div class="wx"><b>Generated docs</b><div><pre>subscriptions:
  description: Subscription data.
  columns:
    status: The status of the subscription.
    amount: The amount.
    started_at: When it started.</pre></div></div>
<div class="wx strong"><b>Docs an AI tool can rely on</b><div><pre>subscriptions:
  description: One row per subscription
    (not per customer). Excludes test
    accounts. Refreshed daily at 03:00 UTC.
  columns:
    status: active | paused | cancelled.
      Only 'active' is billed. Use
      'active' for MRR.
    amount: Monthly price in minor units
      (cents) in <code>currency</code>. Don't sum
      across currencies; use amount_usd.
    started_at: UTC timestamp of first
      payment, not sign-up.</pre></div></div>
</div>
<ul class="wx-notes">
<li><strong>Grain first:</strong> “one row per subscription” prevents counting customers by counting rows.</li>
<li><strong>Values and meanings</strong> stop paused subscriptions being treated as revenue.</li>
<li><strong>Units, currency and “don't sum”</strong> head off the most expensive mistakes.</li>
<li><strong>Tests back the docs up:</strong> an accepted-values test on status and a not-null test on currency make the description enforceable.[1]</li>
</ul>
<h2>Your turn: document a model</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Write docs and tests for an orders model</span></div><div class="activity-b">
<p>Write the description and column docs for an <code>orders</code> model with columns <code>order_id, customer_id, status, total, currency, created_at, is_test</code>, plus the tests you'd add. Invent sensible business rules where needed.</p>
<div data-w="task" data-key="data-docs">
<div class="task-model"><pre>orders: One row per order. Includes test
  orders: filter is_test = false in every
  business query. Refreshed hourly.
  order_id: Unique order ID. (tests: unique,
    not_null)
  customer_id: The ordering customer.
    (tests: not_null, relationships to
    customers.id)
  status: pending | paid | refunded |
    cancelled. Revenue = paid only.
    (test: accepted_values)
  total: Order total incl. tax, in minor
    units of <code>currency</code>. Don't sum across
    currencies. (test: not_null, >= 0)
  currency: ISO 4217 code. (test: not_null)
  created_at: UTC time the order was
    placed, not paid.
  is_test: true for internal test orders.</pre></div>
<ul class="task-rubric">
<li>States the grain (one row per order)</li>
<li>Explains status values and which count as revenue</li>
<li>States units and currency, and warns against summing across currencies</li>
<li>Flags the test-order filter every query needs</li>
<li>Adds tests that enforce the documented rules</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Documentation that restates the code.</strong> “customer_status: the status of the customer” helps nobody. Add what each value means and who owns it.</li>
<li><strong>Two definitions of the same metric.</strong> An assistant will happily write a third. Point it at the canonical one.</li>
<li><strong>Tests disabled to get a pipeline green.</strong> Same as a weakened unit test: the problem is still there.</li>
<li><strong>“It's anonymised.”</strong> Removing names isn't anonymisation if the rows can be linked back.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick one important model in your warehouse. Ask an assistant to propose tests for it, then compare with the tests it already has. Add the two most useful missing ones and see whether either fails.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Generated documentation is good enough to start with.</dt><dd>It usually restates column names. Add grain, meanings, units and traps before anyone relies on it.</dd>
<dt>Documentation is for people; AI tools read the data.</dt><dd>AI tools choose tables and filters from the docs. Vague docs produce confident wrong answers.</dd>
<dt>Tests slow down data teams.</dt><dd>A handful of generic tests catches most silent errors and makes docs enforceable.</dd>
<dt>Anonymised data is safe to use anywhere.</dt><dd>Pseudonymised data is still personal data under the GDPR.[2]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Write docs for a reader who never asks questions: grain, meanings, units, traps.</li>
<li>Back documented rules with tests so they're enforced.</li>
<li>Define metrics once and point AI tools at the definitions.</li>
<li>Keep personal data out of AI tools unless approved, including free-text columns.</li>
<li>Review generated models and docs as carefully as generated code.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">What should a model's description state first?</p><ul>
<li data-fb="Right. Grain prevents counting the wrong thing.">Its grain: what one row represents.</li>
<li data-fb="Ownership helps, but grain comes first.">The name of the engineer who built it.</li>
<li data-fb="Operational detail, not meaning.">How long the model takes to build.</li>
<li data-fb="The code is available; the meaning isn't.">The SQL used to create it.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">An AI tool summed amounts across four currencies. Which doc line would have prevented it?</p><ul>
<li data-fb="Restates the name.">“amount: the amount of the subscription.”</li>
<li data-fb="Type, not meaning.">“amount: numeric, not null.”</li>
<li data-fb="AI tools can't ask the finance team.">“amount: see the finance team for details.”</li>
<li data-fb="Right. Units and the trap, stated plainly.">“amount: minor units of <code>currency</code>; don't sum across currencies.”</li>
</ul></div>
<div class="check" data-a="1"><p class="q">How do you make a documented rule like “status is active, paused or cancelled” enforceable?</p><ul>
<li data-fb="Repetition doesn't enforce it.">Repeat it in every dashboard's description.</li>
<li data-fb="Right. A new value fails the test.">Add an accepted-values test on the column.</li>
<li data-fb="Tools don't enforce data rules.">Ask the AI tool to remember the rule.</li>
<li data-fb="People read it; data doesn't obey it.">Put it in the team's onboarding guide.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Why mention “filter is_test = false” in the model description?</p><ul>
<li data-fb="Completeness isn't the goal.">To make the documentation look complete.</li>
<li data-fb="They're in this table; that's the issue.">Because test orders are normally stored in a separate staging table.</li>
<li data-fb="Right. A filter everyone needs belongs in the docs.">So people and AI tools exclude test orders from business queries.</li>
<li data-fb="It doesn't; the business does.">Because the database requires it.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Is pseudonymised customer data safe to paste into any AI tool?</p><ul>
<li data-fb="Right. Pseudonymised isn't anonymous.">No: it's still personal data if it can be linked back.</li>
<li data-fb="Other fields can re-identify people.">Yes, once names and emails are removed.</li>
<li data-fb="Training is only one concern.">Yes, as long as the tool's terms promise not to train on it.</li>
<li data-fb="Age doesn't change its status.">Only if the data is less than a year old.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>dbt documentation, <a href="https://docs.getdbt.com/docs/build/data-tests" target="_blank" rel="noopener">Add data tests to your DAG</a>. The four built-in generic tests and how custom tests work.</li>
<li>European Union, <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener">General Data Protection Regulation (EU) 2016/679</a>. Article 4 defines personal data and pseudonymisation.</li>
<li>Lei et al. (2024), <a href="https://arxiv.org/abs/2411.07763" target="_blank" rel="noopener">Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows</a>.</li>
</ol></section>
`
});
