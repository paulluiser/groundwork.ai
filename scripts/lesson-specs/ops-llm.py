SPEC = dict(
file="13-3-ops-llm.js",
reviewed="2026-11",
outcomes=["Define the signals that show an AI feature is degrading before users report it."],
situation="""<p>The AI search feature has had 99.9% uptime all month. Every request returned 200 OK. Meanwhile, support tickets about “weird answers” tripled, the average answer got 40% longer, and the cost per request doubled after the provider updated the model behind the alias you use.</p>
<p>Your dashboards were green because they measured whether the feature responded, not whether it worked. This lesson is about operating AI features with signals that notice when quality, cost or behaviour drift.</p>""",
warmup=dict(q="An AI feature returns 200 OK for every request. What does that tell you about its health?", a=3, opts=[
  ("It's healthy, since errors would show up as failed requests in the logs.", "Wrong answers return 200 too."),
  ("It's healthy as long as latency is also within the agreed targets.", "Fast wrong answers are still wrong."),
  ("It's unhealthy, since AI features always degrade over time.", "Not necessarily; you can't tell from this."),
  ("Only that it responded, not whether answers are any good.", "Right. Quality needs its own signals."),
 ]),
sections="""<h2>Signals for AI features</h2>
<div class="tbl"><table><thead><tr><th>Signal</th><th>What it catches</th><th>Example alert</th></tr></thead><tbody>
<tr><td>Eval score on a sample</td><td>Quality drift</td><td>Daily run of 50 eval cases drops below 90% pass</td></tr>
<tr><td>Tokens per request</td><td>Behaviour and cost changes</td><td>Median output tokens up 30% day over day</td></tr>
<tr><td>Cost per request and per day</td><td>Price changes, loops, abuse</td><td>Daily spend above 150% of the 7-day average</td></tr>
<tr><td>Fallback and refusal rate</td><td>Provider problems, prompt issues</td><td>More than 5% of requests use the fallback</td></tr>
<tr><td>User feedback and edits</td><td>Usefulness</td><td>Thumbs-down rate doubles week over week</td></tr>
<tr><td>Model version in use</td><td>Silent upgrades</td><td>Any change in the reported model version</td></tr>
</tbody></table></div>
<p>OpenTelemetry now defines standard attributes for generative AI calls (model, token counts, operation), which makes these signals easier to collect consistently across services.[S1]</p>
<h2>Worked example: catching a silent model update</h2>
<p>With the signals above, the search feature's month would have looked different. On day 9, output tokens jumped 38% and the reported model version changed; the daily eval run dropped from 94% to 86%. The alert fires the same morning. The fix is to pin the previous model version, open an investigation, and re-run the full eval set against the new version before switching deliberately (lesson 20).</p>
<ul class="wx-notes">
<li><strong>Three independent signals agreed:</strong> tokens, version and eval score.</li>
<li><strong>Pinning a version</strong> turns a provider's change into your decision.</li>
<li><strong>The daily eval sample is cheap:</strong> 50 cases a day costs little and catches most quality drift.</li>
</ul>
<h2>Your turn: define the signals</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">An operations plan for an AI feature</span></div><div class="activity-b">
<p>For an AI feature that drafts replies to customer emails, define: four signals you'd monitor, an alert threshold for each, and what the on-call engineer does when each fires.</p>
<div data-w="task" data-key="ops-llm-signals">
<div class="task-model"><ul>
<li><strong>Daily eval sample (40 emails):</strong> alert below 92% pass. Action: compare with yesterday's failures; check model version and prompt changes; pin or roll back.</li>
<li><strong>Agent edit rate:</strong> alert if heavy edits rise 50% week over week. Action: sample 20 edited drafts; report patterns to the feature owner.</li>
<li><strong>Cost per day:</strong> alert above 150% of the 7-day average. Action: check for retry loops or abuse; apply rate limits.</li>
<li><strong>Fallback rate:</strong> alert above 5%. Action: check provider status; confirm fallback (no draft, agent writes) is working.</li>
</ul></div>
<ul class="task-rubric">
<li>Includes a quality signal, not just availability</li>
<li>Includes a cost signal</li>
<li>Includes a signal from users (edits, feedback)</li>
<li>Gives each alert a concrete threshold</li>
<li>Says what on-call does when each alert fires</li>
</ul>
</div></div></div>""",
myths=[
 ("Uptime and latency are enough to monitor an AI feature.", "They show it responds, not that it works. Monitor quality, cost and behaviour."),
 ("Using the provider's latest model alias keeps you up to date safely.", "It means behaviour can change without a release. Pin versions and upgrade deliberately."),
 ("Retries make AI features more reliable.", "Unbounded retries multiply cost and load during outages. Use deadlines and backoff.[1]"),
 ("Quality monitoring needs a large evaluation team.", "A small daily eval sample and user edit rates catch most drift."),
],
recap=[
 "200 OK isn't health: monitor quality, cost, behaviour and user signals.",
 "Run a small eval sample daily and alert on drops.",
 "Watch tokens per request and model version for silent changes.",
 "Pin model versions and upgrade deliberately after re-running evals.",
 "Bound retries with deadlines and backoff, and keep a working fallback.",
],
checks=[
 dict(q="Which signal would catch a silent model update first?", a=1, opts=[
  ("HTTP error rate on the AI endpoint, measured every minute.", "Updates rarely cause errors."),
  ("A change in reported model version and tokens per request.", "Right. Both shift when the model changes."),
  ("Server CPU usage on the application tier running the feature.", "Unaffected by the provider's model."),
  ("The number of active users of the feature each day.", "Too slow and indirect."),
 ]),
 dict(q="Daily cost doubled overnight. What's a likely cause to check first?", a=0, opts=[
  ("A retry loop, abuse, or longer outputs after a model change.", "Right. All increase tokens or requests."),
  ("The finance team changing how costs are reported this month.", "Possible, but check usage first."),
  ("An increase in the number of engineers on the team.", "Unrelated to request costs."),
  ("A new dashboard being added to the monitoring system.", "Unrelated."),
 ]),
 dict(q="Why pin the model version an AI feature uses?", a=3, opts=[
  ("Pinned versions are always cheaper than the provider's latest alias.", "Not necessarily."),
  ("Providers require pinning for production use in their terms.", "Not generally required."),
  ("Pinned versions never have outages or capacity problems.", "They can."),
  ("So behaviour only changes when you decide, after testing.", "Right. Upgrades become deliberate."),
 ]),
 dict(q="What should happen when the daily eval sample drops below its threshold?", a=2, opts=[
  ("Ignore it unless users also start complaining about answers.", "By then, harm is done."),
  ("Immediately switch to a different provider's model.", "Untested switches add risk."),
  ("Check for model or prompt changes, and pin or roll back.", "Right. Find the change and restore known-good behaviour."),
  ("Lower the threshold so the alert stops firing.", "Hides the problem."),
 ]),
 dict(q="Why are unbounded retries risky for AI features?", a=0, opts=[
  ("They multiply cost and load, especially during provider outages.", "Right. Use deadlines and backoff."),
  ("Providers ban retries in their terms of service.", "Not the case."),
  ("Retries always return the same wrong answer.", "Not the main risk."),
  ("They make the feature's logs harder to read.", "A minor issue."),
 ]),
],
sources=[
 'OpenTelemetry, <a href="https://opentelemetry.io/docs/specs/semconv/gen-ai/" target="_blank" rel="noopener">Semantic conventions for generative AI systems</a>. Standard attributes for model, token usage and operations.',
],
)
