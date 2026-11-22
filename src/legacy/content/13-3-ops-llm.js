GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["llm-ops-calls"] = {
  steps: [
    { title: "The provider is down", sit: "Your model provider's API starts returning errors for 40% of requests. Your support assistant and your document-summary feature both depend on it. The team's first instinct is to raise the retry count from 3 to 10.", opts: [
      ["Raise retries to 10 so more requests eventually succeed.", "More retries multiply load on a struggling service and slow every request down. That's how a partial outage becomes a full one."],
      ["Keep retries low with backoff and jitter, switch the support assistant to its fallback (handoff to people with a clear message), and pause non-urgent summaries.", "Right. Limit retries, degrade gracefully, and protect the features that matter most."],
      ["Turn both features off until the provider recovers.", "Safe, but heavier than needed. A designed fallback keeps customers served."]], a: 1 },
    { title: "The cost spike", sit: "Model spend tripled overnight. Usage of the feature hasn't changed. Logs show a few accounts sending very long documents repeatedly.", opts: [
      ["Switch the whole feature to a smaller model to cut costs.", "That changes quality for everyone without knowing the cause."],
      ["Wait for the monthly invoice to see the full picture.", "By then the overspend is done. Cost needs alerts like any other production signal."],
      ["Add per-account limits on input size and request rate, alert on spend per hour, and look at those accounts for abuse or a bug.", "Right. Unbounded consumption is a known risk. Limits and spend alerts contain it; then find the cause."]], a: 2 },
    { title: "The model changes", sit: "The provider emails: the model version you use will be retired in 30 days and replaced with a newer one.", opts: [
      ["Run your eval set against the new version now, compare with current scores, test latency and cost, and switch behind a flag you can roll back.", "Right. Treat a model change like a dependency upgrade: test, compare, roll out gradually, keep a way back (lesson 20)."],
      ["Switch on the last day; newer models are better.", "Better on average isn't better for your prompts and use case. And you'll have no time to fix anything."],
      ["Stay on the old version and ignore the email.", "It'll stop working when it's retired."]], a: 0 },
    { title: "Quality quietly drops", sit: "No errors, latency normal, costs normal. But the weekly sample review finds the support assistant citing the wrong help article more often than last month.", opts: [
      ["Ignore it; all the dashboards are green.", "AI features can fail without errors. Quality needs its own monitoring."],
      ["Check what changed: help-centre content, the retrieval index, the prompt, the model version. Rerun the eval set to confirm and locate the drop.", "Right. Quality regressions have causes in content, retrieval, prompts or the model. Find which before changing anything."],
      ["Rewrite the system prompt to tell it to cite the right articles.", "A guess at a fix, before knowing the cause."]], a: 1 },
    { title: "The postmortem", sit: "After the outage, someone proposes adding a second model provider as automatic failover.", opts: [
      ["Do it straight away; two providers are safer than one.", "Maybe, but a different model behaves differently. Untested failover can swap an outage for wrong answers."],
      ["Reject it; it's too complex.", "It may be worth it. Decide based on the feature's importance and the cost of testing both."],
      ["Consider it, but test the second model on the eval set first, and exercise the failover path regularly so it works when needed.", "Right. Fallback paths that are never exercised tend to fail when you need them."]], a: 2 }
  ],
  after: "Running AI features is mostly ordinary reliability work (limits, fallbacks, careful retries, gradual rollouts), plus two new signals: quality, which can drop with no errors, and cost, which can spike with no change in usage."
};
GW.lesson({
  id: "ops-llm",
  reviewed: "2026-11",
  lede: "An AI feature in production depends on a model you don't control, costs money per request, and can get worse without throwing a single error. Most of what keeps it healthy is familiar reliability practice. This lesson covers the parts that are new: monitoring quality and cost, designing fallbacks, and handling model changes.",
  outcomes: [
    "Monitor quality, cost and latency for AI features, not just errors.",
    "Design fallbacks and retry behaviour that survive a provider outage.",
    "Treat model and prompt changes like dependency upgrades: tested, gradual and reversible.",
    "Contain runaway usage with limits and spend alerts.",
    "Define the signals that show an AI feature is degrading before users report it."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>The AI search feature has had 99.9% uptime all month. Every request returned 200 OK. Meanwhile, support tickets about “weird answers” tripled, the average answer got 40% longer, and the cost per request doubled after the provider updated the model behind the alias you use.</p>
<p>Your dashboards were green because they measured whether the feature responded, not whether it worked. This lesson is about operating AI features with signals that notice when quality, cost or behaviour drift.</p></div>
<div class="check warmup" data-a="3"><p class="q">An AI feature returns 200 OK for every request. What does that tell you about its health?</p><ul>
<li data-fb="Wrong answers return 200 too.">It's healthy, since errors would show up as failed requests in the logs.</li>
<li data-fb="Fast wrong answers are still wrong.">It's healthy as long as latency is also within the agreed targets.</li>
<li data-fb="Not necessarily; you can't tell from this.">It's unhealthy, since AI features always degrade over time.</li>
<li data-fb="Right. Quality needs its own signals.">Only that it responded, not whether answers are any good.</li>
</ul></div>
<h2>What's different about running AI features</h2>
<div class="tbl"><table>
<thead><tr><th>Signal</th><th>What to watch</th><th>Why it's different</th></tr></thead>
<tbody>
<tr><td>Availability and errors</td><td>Error rates from the provider, timeouts, rate-limit responses</td><td>You depend on a service outside your control, often shared with many customers.</td></tr>
<tr><td><a class="term" data-t="latency">Latency</a></td><td>Time to first token and to completion, by feature</td><td>Varies with input size, output length and the provider's load.</td></tr>
<tr><td>Cost</td><td>Spend per hour, per feature and per account; tokens per request</td><td>Every request costs money, and long inputs cost more. Usage can spike without traffic changing.</td></tr>
<tr><td>Quality</td><td>Sampled human review, eval reruns, signals like missing citations or repeated questions</td><td>Can drop with no errors, after a content, retrieval, prompt or model change.</td></tr>
</tbody></table></div>
<p>NIST's AI Risk Management Framework makes the same point more broadly: AI systems need ongoing monitoring after deployment, because their behaviour and their context change.<sup>[2]</sup></p>

<h2>Fallbacks and retries</h2>
<p>Google's SRE book chapter on cascading failures applies directly to model providers.<sup>[1]</sup> The key practices:</p>
<ul>
<li><strong>Limit retries,</strong> with exponential backoff and jitter, and only for errors that might succeed on retry. Retries at several layers multiply.</li>
<li><strong>Set deadlines.</strong> A user won't wait 90 seconds for a summary. Give up early and use the fallback.</li>
<li><strong>Degrade gracefully.</strong> Decide in advance what each feature does without the model: hand off to a person, show search results, queue the job for later, or hide the feature with a clear message.</li>
<li><strong>Exercise the fallback.</strong> Paths that never run tend to fail when they're needed. Test them on purpose.</li>
</ul>

<h2>Practice: make the call</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Running AI in production</span></div><div class="activity-b">
<p>Five situations from an operations team running AI features. Choose what you'd do.</p>
<div data-w="decide" data-cfg="llm-ops-calls"></div>
</div></div>

<ol class="steps">
<li><strong>Retry carefully, degrade gracefully</strong>More retries make an outage worse. Planned fallbacks keep customers served.</li>
<li><strong>Cost is a production signal</strong>Alert on spend by the hour, and limit input size and request rate per account.</li>
<li><strong>Model changes are upgrades</strong>Test against the eval set, roll out behind a flag, keep a way back.</li>
<li><strong>Quality needs its own monitoring</strong>Green dashboards don't mean good answers. Sample, review and rerun evals.</li>
</ol>
<div class="key"><p>An AI feature can be up, fast and cheap while giving wrong answers. Monitor quality as deliberately as you monitor errors.</p></div>

<h2>Model and prompt changes</h2>
<p>Treat every change to the model version, the system prompt, the retrieval setup or the tools as a deployment:</p>
<ul>
<li><strong>Pin the model version</strong> where the provider allows it, so changes happen when you choose.</li>
<li><strong>Keep prompts in version control,</strong> reviewed like code.</li>
<li><strong>Rerun the eval set</strong> before switching, and compare quality, latency and cost (lesson 20).</li>
<li><strong>Roll out gradually</strong> behind a flag, watching quality signals, with a quick way back.</li>
</ul>

<h2>Signals for AI features</h2>
<div class="tbl"><table><thead><tr><th>Signal</th><th>What it catches</th><th>Example alert</th></tr></thead><tbody>
<tr><td>Eval score on a sample</td><td>Quality drift</td><td>Daily run of 50 eval cases drops below 90% pass</td></tr>
<tr><td>Tokens per request</td><td>Behaviour and cost changes</td><td>Median output tokens up 30% day over day</td></tr>
<tr><td>Cost per request and per day</td><td>Price changes, loops, abuse</td><td>Daily spend above 150% of the 7-day average</td></tr>
<tr><td>Fallback and refusal rate</td><td>Provider problems, prompt issues</td><td>More than 5% of requests use the fallback</td></tr>
<tr><td>User feedback and edits</td><td>Usefulness</td><td>Thumbs-down rate doubles week over week</td></tr>
<tr><td>Model version in use</td><td>Silent upgrades</td><td>Any change in the reported model version</td></tr>
</tbody></table></div>
<p>OpenTelemetry now defines standard attributes for generative AI calls (model, token counts, operation), which makes these signals easier to collect consistently across services.[3]</p>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Unlimited input size.</strong> One user pasting a whole book into every request can triple your bill.</li>
<li><strong>Logging everything forever.</strong> Prompts and responses contain customer data. Set retention and access rules.</li>
<li><strong>Silent fallback to a different model.</strong> Users and support should know when answers come from a different system.</li>
<li><strong>Only watching the provider's status page.</strong> Your own error rates and latency tell you sooner.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> For one AI feature you run, write down what happens if the provider is down for an hour, and what happens if spend triples overnight. If either answer is “we'd find out”, that's the first thing to fix.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Uptime and latency are enough to monitor an AI feature.</dt><dd>They show it responds, not that it works. Monitor quality, cost and behaviour.</dd>
<dt>Using the provider's latest model alias keeps you up to date safely.</dt><dd>It means behaviour can change without a release. Pin versions and upgrade deliberately.</dd>
<dt>Retries make AI features more reliable.</dt><dd>Unbounded retries multiply cost and load during outages. Use deadlines and backoff.[1]</dd>
<dt>Quality monitoring needs a large evaluation team.</dt><dd>A small daily eval sample and user edit rates catch most drift.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>200 OK isn't health: monitor quality, cost, behaviour and user signals.</li>
<li>Run a small eval sample daily and alert on drops.</li>
<li>Watch tokens per request and model version for silent changes.</li>
<li>Pin model versions and upgrade deliberately after re-running evals.</li>
<li>Bound retries with deadlines and backoff, and keep a working fallback.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Which signal would catch a silent model update first?</p><ul>
<li data-fb="Updates rarely cause errors.">HTTP error rate on the AI endpoint, measured every minute.</li>
<li data-fb="Right. Both shift when the model changes.">A change in reported model version and tokens per request.</li>
<li data-fb="Unaffected by the provider's model.">Server CPU usage on the application tier running the feature.</li>
<li data-fb="Too slow and indirect.">The number of active users of the feature each day.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Daily cost doubled overnight. What's a likely cause to check first?</p><ul>
<li data-fb="Right. All increase tokens or requests.">A retry loop, abuse, or longer outputs after a model change.</li>
<li data-fb="Possible, but check usage first.">The finance team changing how costs are reported this month.</li>
<li data-fb="Unrelated to request costs.">An increase in the number of engineers on the team.</li>
<li data-fb="Unrelated.">A new dashboard being added to the monitoring system.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why pin the model version an AI feature uses?</p><ul>
<li data-fb="Not necessarily.">Pinned versions are always cheaper than the provider's latest alias.</li>
<li data-fb="Not generally required.">Providers require pinning for production use in their terms.</li>
<li data-fb="They can.">Pinned versions never have outages or capacity problems.</li>
<li data-fb="Right. Upgrades become deliberate.">So behaviour only changes when you decide, after testing.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What should happen when the daily eval sample drops below its threshold?</p><ul>
<li data-fb="By then, harm is done.">Ignore it unless users also start complaining about answers.</li>
<li data-fb="Untested switches add risk.">Immediately switch to a different provider's model.</li>
<li data-fb="Right. Find the change and restore known-good behaviour.">Check for model or prompt changes, and pin or roll back.</li>
<li data-fb="Hides the problem.">Lower the threshold so the alert stops firing.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why are unbounded retries risky for AI features?</p><ul>
<li data-fb="Right. Use deadlines and backoff.">They multiply cost and load, especially during provider outages.</li>
<li data-fb="Not the case.">Providers ban retries in their terms of service.</li>
<li data-fb="Not the main risk.">Retries always return the same wrong answer.</li>
<li data-fb="A minor issue.">They make the feature's logs harder to read.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Google, <a href="https://sre.google/sre-book/addressing-cascading-failures/" target="_blank" rel="noopener">Site Reliability Engineering, chapter 22: Addressing Cascading Failures</a>. Retries, deadlines, load shedding and graceful degradation.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>, including the Generative AI Profile (NIST AI 600-1, 2024).</li>

<li>OpenTelemetry, <a href="https://opentelemetry.io/docs/specs/semconv/gen-ai/" target="_blank" rel="noopener">Semantic conventions for generative AI systems</a>. Standard attributes for model, token usage and operations.</li>
</ol></section>
`
});
