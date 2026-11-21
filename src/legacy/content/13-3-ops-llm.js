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
  lede: "An AI feature in production depends on a model you don't control, costs money per request, and can get worse without throwing a single error. Most of what keeps it healthy is familiar reliability practice. This lesson covers the parts that are new: monitoring quality and cost, designing fallbacks, and handling model changes.",
  outcomes: [
    "Monitor quality, cost and latency for AI features, not just errors.",
    "Design fallbacks and retry behaviour that survive a provider outage.",
    "Treat model and prompt changes like dependency upgrades: tested, gradual and reversible.",
    "Contain runaway usage with limits and spend alerts."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Unlimited input size.</strong> One user pasting a whole book into every request can triple your bill.</li>
<li><strong>Logging everything forever.</strong> Prompts and responses contain customer data. Set retention and access rules.</li>
<li><strong>Silent fallback to a different model.</strong> Users and support should know when answers come from a different system.</li>
<li><strong>Only watching the provider's status page.</strong> Your own error rates and latency tell you sooner.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> For one AI feature you run, write down what happens if the provider is down for an hour, and what happens if spend triples overnight. If either answer is “we'd find out”, that's the first thing to fix.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">During a provider outage, why is raising the retry count risky?</p><ul>
<li data-fb="Right. Extra retries add load to a struggling service and slow every request.">It multiplies load on the struggling provider and can turn a partial outage into a full one.</li>
<li data-fb="Cost matters, but it isn't the main risk.">It costs more per request.</li>
<li data-fb="Retries don't change model quality.">It makes the model's answers worse.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Error rates, latency and cost are all normal, but answer quality has dropped. Where should you look first?</p><ul>
<li data-fb="The infrastructure looks healthy; the cause is elsewhere.">The provider's status page.</li>
<li data-fb="A fix before knowing the cause is a guess.">Rewrite the system prompt.</li>
<li data-fb="Right. Quality drops usually trace back to one of these changes.">What changed in content, retrieval, the prompt or the model version.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What's the best protection against a sudden cost spike?</p><ul>
<li data-fb="Too late; the money is already spent.">Reviewing the monthly invoice carefully.</li>
<li data-fb="Right. Limits contain the damage; alerts tell you quickly.">Per-account limits on input size and request rate, and hourly spend alerts.</li>
<li data-fb="Changes quality for everyone without addressing the cause.">Always using the smallest model.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Google, <a href="https://sre.google/sre-book/addressing-cascading-failures/" target="_blank" rel="noopener">Site Reliability Engineering, chapter 22: Addressing Cascading Failures</a>. Retries, deadlines, load shedding and graceful degradation.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>, including the Generative AI Profile (NIST AI 600-1, 2024).</li>
</ol></section>
`
});
