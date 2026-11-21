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
  lede: "AI can write pipeline code, data models and documentation quickly. That makes it easier to build a lot of data infrastructure that nobody fully checked. This lesson covers testing generated models, keeping shared definitions in one place, and keeping personal data where it belongs.",
  outcomes: [
    "Ask for tests with every AI-generated model, and know what the basic tests catch.",
    "Keep metric definitions in one shared place so people and AI tools use the same ones.",
    "Know why text-to-SQL accuracy drops on real enterprise data, and what to do about it.",
    "Apply basic data-protection rules when AI tools touch personal data."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Documentation that restates the code.</strong> “customer_status: the status of the customer” helps nobody. Add what each value means and who owns it.</li>
<li><strong>Two definitions of the same metric.</strong> An assistant will happily write a third. Point it at the canonical one.</li>
<li><strong>Tests disabled to get a pipeline green.</strong> Same as a weakened unit test: the problem is still there.</li>
<li><strong>“It's anonymised.”</strong> Removing names isn't anonymisation if the rows can be linked back.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick one important model in your warehouse. Ask an assistant to propose tests for it, then compare with the tests it already has. Add the two most useful missing ones and see whether either fails.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">An AI-generated model joins orders to payments, and total revenue jumps 30%. Which test should you add first?</p><ul>
<li data-fb="Right. A jump like that usually means the join fanned out, duplicating orders.">unique on order_id in the output.</li>
<li data-fb="Missing values would make totals smaller, not bigger.">not_null on amount.</li>
<li data-fb="New categories wouldn't usually inflate totals.">accepted_values on payment method.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Why do AI assistants answer more accurately from a semantic layer than from raw tables?</p><ul>
<li data-fb="It's not about speed.">Semantic layers run queries faster.</li>
<li data-fb="Fewer tables helps a little, but it's not the main reason.">There are fewer tables to choose from.</li>
<li data-fb="Right. Shared definitions remove the guesswork about what terms mean.">Metric meanings are written down instead of guessed from column names.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">You replaced customer emails with random IDs, but kept a lookup table. Is the data still personal data under the GDPR?</p><ul>
<li data-fb="Replacing identifiers alone doesn't take data out of scope.">No, it's anonymised.</li>
<li data-fb="Right. Pseudonymised data that can be linked back is still personal data.">Yes, because it can be linked back to people.</li>
<li data-fb="The law doesn't depend on who holds the lookup.">Only if the lookup table is shared.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>dbt documentation, <a href="https://docs.getdbt.com/docs/build/data-tests" target="_blank" rel="noopener">Add data tests to your DAG</a>. The four built-in generic tests and how custom tests work.</li>
<li>European Union, <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener">General Data Protection Regulation (EU) 2016/679</a>. Article 4 defines personal data and pseudonymisation.</li>
<li>Lei et al. (2024), <a href="https://arxiv.org/abs/2411.07763" target="_blank" rel="noopener">Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows</a>.</li>
</ol></section>
`
});
