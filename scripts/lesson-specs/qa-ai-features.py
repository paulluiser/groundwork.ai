SPEC = dict(
file="11-3-qa-ai-features.js",
reviewed="2026-11",
outcomes=["Write a release check for an AI feature: which evals run, what threshold blocks a release, and who decides."],
situation="""<p>The team wants to switch the support assistant to a newer model on Friday. The vendor's announcement says it's better on every benchmark. Your eval set of 150 real questions says it's better on 140, slightly worse on 6, and on 4 it now confidently gives a refund policy you discontinued last year.</p>
<p>Whether Friday's release goes ahead depends on rules you set before the results came in. This lesson is about setting them.</p>""",
warmup=dict(q="A new model scores higher on the vendor's benchmarks. What does that mean for your feature?", a=1, opts=[
  ("It will be better on your feature, since benchmarks are broad.", "Benchmarks don't contain your data, policies or users."),
  ("Not much until it passes your own eval set.", "Right. Your evals measure your feature."),
  ("It's safe to switch without testing, if the vendor recommends it.", "Vendors can't test your use case for you."),
  ("It will be cheaper to run than the previous model.", "Benchmarks say nothing about price."),
 ]),
sections="""<h2>Release gates for AI features</h2>
<p>A release gate is a rule agreed in advance: which evals run, what score passes, and which failures block a release outright. Without one, every model change becomes an argument about whether 140 out of 150 is good enough. Tools now exist to run eval sets and adversarial tests automatically in CI, so the gate can run on every prompt or model change.[S1]</p>
<div class="tbl"><table><thead><tr><th>Eval</th><th>What it checks</th><th>Gate</th></tr></thead><tbody>
<tr><td>Core quality set (150 real questions)</td><td>Answers meet the must-include rules</td><td>At least 93%, and no worse than the current version by more than 2 points</td></tr>
<tr><td>Policy set (40 questions on refunds, pricing, legal)</td><td>Answers match current policy exactly</td><td>100%: any failure blocks release</td></tr>
<tr><td>Red-team set (60 injection and abuse attempts)</td><td>Refuses or stays on task</td><td>No leaks of data or system prompt; at most 1 off-task reply</td></tr>
<tr><td>Cost and latency</td><td>Average tokens and response time</td><td>Within 20% of current</td></tr>
</tbody></table></div>
<h2>Worked example: reading a release report</h2>
<p>The new model's results: quality 140/150 (93.3%, current 92%), policy 36/40, red team 0 leaks, latency 15% faster. The gate's answer is clear: the policy set failed, so it doesn't ship on Friday. The four failures all cite the old refund policy, which suggests the new model is relying on its training rather than the retrieved policy page. The fix is in the prompt or retrieval, then a re-run, not a debate about whether 36/40 is acceptable.</p>
<ul class="wx-notes">
<li><strong>Different sets get different thresholds.</strong> 93% is fine for quality; 90% isn't fine for policy.</li>
<li><strong>The gate was agreed before the results.</strong> That's what stops the goalposts moving on Friday afternoon.</li>
<li><strong>Failures point to a cause.</strong> Reading the four failures takes ten minutes and tells you what to fix.</li>
</ul>
<h2>Your turn: write a release gate</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">A gate for an AI feature you know</span></div><div class="activity-b">
<p>Pick an AI feature (yours, or an AI meeting summariser). Write its release gate: the eval sets, what each checks, the threshold, which failures block release, and who makes the call when results are borderline.</p>
<div data-w="task" data-key="qa-gate">
<div class="task-model"><ul>
<li><strong>Accuracy set (50 real meetings):</strong> every summarised action appears in the transcript; ≥ 96%.</li>
<li><strong>Invention set (20 meetings with no actions):</strong> summary lists no actions; 100%, blocks release.</li>
<li><strong>Privacy set (15 meetings with HR or health topics):</strong> sensitive details omitted; 100%, blocks release.</li>
<li><strong>Cost and latency:</strong> within 25% of current.</li>
<li><strong>Borderline results:</strong> the QA lead and product owner decide together, and record the reason.</li>
</ul></div>
<ul class="task-rubric">
<li>Uses more than one eval set, each with a clear purpose</li>
<li>Sets numeric thresholds in advance</li>
<li>Marks some failures as blocking regardless of overall score</li>
<li>Includes cost or latency, not only quality</li>
<li>Names who decides borderline cases and how it's recorded</li>
</ul>
</div></div></div>""",
myths=[
 ("A single overall score is enough to decide a release.", "Averages hide serious failures. Some categories, like policy or privacy, need their own blocking gate."),
 ("Red-teaming is only for security teams.", "Testers who know the product find the most realistic misuse. Everyone can contribute attacks."),
 ("Once the eval set passes, the feature is done.", "Real use drifts from the eval set. Add failures from production to it regularly."),
 ("A newer model is a safe upgrade.", "New models change behaviour in specific ways. Re-run the full gate on every change."),
],
recap=[
 "Agree release gates before you see results, with different thresholds per set.",
 "Make policy, privacy and safety failures blocking on their own.",
 "Red-team with realistic misuse and include it in the gate.",
 "Read the failures: they usually point to a cause you can fix.",
 "Feed production failures back into the eval sets.",
],
checks=[
 dict(q="A new model scores 93.3% on quality but fails 4 of 40 policy questions. Your gate requires 100% on policy. What happens?", a=2, opts=[
  ("It ships, because overall quality improved.", "The gate exists so averages can't override policy."),
  ("It ships with a warning to support agents.", "A warning doesn't fix wrong policy answers."),
  ("It doesn't ship until the policy failures are fixed and re-run.", "Right. The gate was agreed in advance."),
  ("The threshold is lowered to 90% for this release.", "Moving the goalposts defeats the gate."),
 ]),
 dict(q="Why agree release thresholds before running the evals?", a=0, opts=[
  ("So results can't be argued into whatever the team hoped for.", "Right. Fixed rules prevent moving goalposts."),
  ("Because eval tools require thresholds as configuration.", "Some do, but that isn't the reason."),
  ("So the evals run faster in continuous integration.", "Thresholds don't affect speed."),
  ("Because vendors publish recommended thresholds.", "Vendors don't know your feature."),
 ]),
 dict(q="Four failures all cite a discontinued refund policy. What does that suggest?", a=3, opts=[
  ("The eval set is wrong and should be updated.", "The eval reflects current policy; it's right."),
  ("The new model is generally worse and should be abandoned.", "It did better elsewhere; the cause is specific."),
  ("The test is flaky and should be re-run until it passes.", "Consistent failures on one topic aren't flakiness."),
  ("It's answering from training instead of the retrieved policy.", "Right. Fix retrieval or the prompt, then re-run."),
 ]),
 dict(q="Which set should contain prompt injection and abuse attempts?", a=1, opts=[
  ("The core quality set, mixed in with normal questions.", "Mixing hides the result in an average."),
  ("A separate red-team set with its own threshold.", "Right. Safety failures need their own gate."),
  ("None: injection is the security team's concern only.", "Testers should include realistic misuse."),
  ("Only the production logs, after release.", "By then, users are exposed."),
 ]),
 dict(q="Where should new eval cases come from after launch?", a=0, opts=[
  ("Real failures and edge cases seen in production.", "Right. They keep the eval set close to reality."),
  ("A fresh set generated by the model each month.", "Generated cases drift from real use."),
  ("The vendor's public benchmark questions.", "Not your users or your policies."),
  ("Nowhere: the eval set should stay fixed forever.", "A fixed set slowly stops representing real use."),
 ]),
],
sources=[
 '<a href="https://www.promptfoo.dev/docs/red-team/" target="_blank" rel="noopener">Promptfoo: LLM red teaming</a>. An open-source tool for running eval sets and adversarial tests in CI.',
],
)
