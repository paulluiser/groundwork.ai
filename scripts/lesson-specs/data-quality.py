SPEC = dict(
file="11c-3-data-quality.js",
reviewed="2026-11",
outcomes=["Write documentation for a data model that an AI tool can use to answer questions correctly."],
situation="""<p>An assistant generates a new dbt model for “active subscriptions” in ten minutes, complete with documentation. The docs say <em>“status: the status of the subscription”</em> and <em>“amount: the amount”</em>. Three weeks later, an AI analyst tool answers a revenue question from this model, treats paused subscriptions as active, and sums amounts that are in four currencies.</p>
<p>Documentation used to be for people who'd ask a colleague when confused. Now AI tools read it literally and never ask. This lesson is about tests and documentation that hold up when machines are the main readers.</p>""",
warmup=dict(q="Which column description helps an AI tool answer correctly?", a=2, opts=[
  ("“status: the status of the subscription.”", "Restates the name; says nothing useful."),
  ("“status: important field, see the product team.”", "No information an AI tool can use."),
  ("“status: active, paused or cancelled; paused isn't billed.”", "Right. Values and their meaning, including the trap."),
  ("“status: string, not null.”", "The type is useful but the meaning is missing."),
 ]),
sections="""<h2>Docs that machines can use</h2>
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
</div></div></div>""",
myths=[
 ("Generated documentation is good enough to start with.", "It usually restates column names. Add grain, meanings, units and traps before anyone relies on it."),
 ("Documentation is for people; AI tools read the data.", "AI tools choose tables and filters from the docs. Vague docs produce confident wrong answers."),
 ("Tests slow down data teams.", "A handful of generic tests catches most silent errors and makes docs enforceable."),
 ("Anonymised data is safe to use anywhere.", "Pseudonymised data is still personal data under the GDPR.[2]"),
],
recap=[
 "Write docs for a reader who never asks questions: grain, meanings, units, traps.",
 "Back documented rules with tests so they're enforced.",
 "Define metrics once and point AI tools at the definitions.",
 "Keep personal data out of AI tools unless approved, including free-text columns.",
 "Review generated models and docs as carefully as generated code.",
],
checks=[
 dict(q="What should a model's description state first?", a=0, opts=[
  ("Its grain: what one row represents.", "Right. Grain prevents counting the wrong thing."),
  ("The name of the engineer who built it.", "Ownership helps, but grain comes first."),
  ("How long the model takes to build.", "Operational detail, not meaning."),
  ("The SQL used to create it.", "The code is available; the meaning isn't."),
 ]),
 dict(q="An AI tool summed amounts across four currencies. Which doc line would have prevented it?", a=3, opts=[
  ("“amount: the amount of the subscription.”", "Restates the name."),
  ("“amount: numeric, not null.”", "Type, not meaning."),
  ("“amount: see the finance team for details.”", "AI tools can't ask the finance team."),
  ("“amount: minor units of <code>currency</code>; don't sum across currencies.”", "Right. Units and the trap, stated plainly."),
 ]),
 dict(q="How do you make a documented rule like “status is active, paused or cancelled” enforceable?", a=1, opts=[
  ("Repeat it in every dashboard's description.", "Repetition doesn't enforce it."),
  ("Add an accepted-values test on the column.", "Right. A new value fails the test."),
  ("Ask the AI tool to remember the rule.", "Tools don't enforce data rules."),
  ("Put it in the team's onboarding guide.", "People read it; data doesn't obey it."),
 ]),
 dict(q="Why mention “filter is_test = false” in the model description?", a=2, opts=[
  ("To make the documentation look complete.", "Completeness isn't the goal."),
  ("Because test orders are stored in a separate table.", "They're in this table; that's the issue."),
  ("So people and AI tools exclude test orders from business queries.", "Right. A filter everyone needs belongs in the docs."),
  ("Because the database requires it.", "It doesn't; the business does."),
 ]),
 dict(q="Is pseudonymised customer data safe to paste into any AI tool?", a=0, opts=[
  ("No: it's still personal data if it can be linked back.", "Right. Pseudonymised isn't anonymous."),
  ("Yes, once names and emails are removed.", "Other fields can re-identify people."),
  ("Yes, if the tool promises not to train on it.", "Training is only one concern."),
  ("Only if the data is less than a year old.", "Age doesn't change its status."),
 ]),
],
)
