GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["ai-test-layers"] = {
  buckets: ["Eval set", "Regression check", "Production monitoring"],
  items: [
    { t: "120 real support questions, each with the facts a good answer must contain, agreed by two support leads.", a: 0, why: "Representative inputs with written criteria: the core of an eval set. Build it from real cases, not ones you imagined." },
    { t: "Rerun the full question set and compare scores, because the provider is retiring the model version you use.", a: 1, why: "A model change is the classic trigger for a regression check. Compare against the last known-good scores before switching." },
    { t: "A weekly random sample of 50 live conversations, read by a person and labelled good or bad.", a: 2, why: "Real traffic finds problems your eval set didn't imagine. Feed the failures back into the eval set." },
    { t: "A red-team list of 40 attempts to make the assistant reveal other customers' data or ignore its instructions.", a: 0, why: "Adversarial cases belong in the eval set too, with an expected outcome for each: refuse, or hand off." },
    { t: "Run the question set in CI whenever someone edits the system prompt.", a: 1, why: "Prompt edits change behaviour as much as code does. Catch the drop before it ships." },
    { t: "An alert when the share of answers with no source citation rises above its usual level.", a: 2, why: "A cheap signal that something changed in live traffic, such as retrieval breaking or a new kind of question." },
    { t: "A set of tricky edge cases that once broke the feature, each kept with the correct answer.", a: 1, why: "Every bug you fix becomes a permanent regression case, so it can't quietly come back." },
    { t: "Tracking how often users rephrase the same question straight after an answer.", a: 2, why: "Behaviour after launch can show answers that look fine but don't help. Read some examples before acting on the number." }
  ],
  after: "Three layers, each catching what the others miss: an eval set defines good before launch, regression checks protect it when anything changes, and monitoring finds what the eval set never imagined."
};
GW.lesson({
  id: "qa-ai-features",
  reviewed: "2026-11",
  lede: "Lesson 18 introduced evals and LLM-as-judge. This lesson goes deeper: how to build an eval set people trust, how to attack the feature on purpose, what to rerun when the model or prompt changes, and how to keep watching once real users arrive.",
  outcomes: [
    "Build an eval set from real cases, with written criteria and a pass rate agreed in advance.",
    "Plan red-teaming for misuse, data leaks and instructions hidden in content.",
    "Set up regression checks that run whenever the model, prompt or retrieval changes.",
    "Choose monitoring signals for production, and feed what they find back into the eval set.",
    "Write a release check for an AI feature: which evals run, what threshold blocks a release, and who decides."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>The team wants to switch the support assistant to a newer model on Friday. The vendor's announcement says it's better on every benchmark. Your eval set of 150 real questions says it's better on 140, slightly worse on 6, and on 4 it now confidently gives a refund policy you discontinued last year.</p>
<p>Whether Friday's release goes ahead depends on rules you set before the results came in. This lesson is about setting them.</p></div>
<div class="check warmup" data-a="1"><p class="q">A new model scores higher on the vendor's benchmarks. What does that mean for your feature?</p><ul>
<li data-fb="Benchmarks don't contain your data, policies or users.">It will be better on your feature, since benchmarks are broad.</li>
<li data-fb="Right. Your evals measure your feature.">Not much until it passes your own eval set.</li>
<li data-fb="Vendors can't test your use case for you.">It's safe to switch without testing, if the vendor recommends it.</li>
<li data-fb="Benchmarks say nothing about price.">It will be cheaper to run than the previous model.</li>
</ul></div>
<h2>Why AI features need different testing</h2>
<p>Ordinary tests expect the same output for the same input. AI features don't work that way: the same question can get different wording, and a change you didn't make (a new model version from the provider) can change behaviour overnight. So instead of exact expected outputs, you test against criteria, on a set of examples, and look at the pass rate.</p>
<div class="tbl"><table>
<thead><tr><th>Approach</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Code assertions (format, length, required fields, banned phrases)</td><td><span class="fit good">Good fit</span></td><td>Cheap, fast and exact. Run them on every change.</td></tr>
<tr><td>People grading against a <a class="term" data-t="rubric">rubric</a></td><td><span class="fit good">Good fit</span></td><td>The ground truth for quality. Slow, so use it to build and calibrate everything else.</td></tr>
<tr><td><a class="term" data-t="llm-as-judge">LLM-as-judge</a></td><td><span class="fit care">Use with care</span></td><td>Scales well, but has known biases. Check its agreement with human grades before trusting it.<sup>[2]</sup></td></tr>
<tr><td>Self-grading by the feature's own model</td><td><span class="fit care">Use with care</span></td><td>Tends to favour its own answers. Never the only check.</td></tr>
<tr><td>Deciding the acceptable pass rate</td><td><span class="fit human">Keep human</span></td><td>A product and risk decision. 100% is rarely realistic; the number has to be argued for.</td></tr>
</tbody></table></div>

<h2>Building an eval set people trust</h2>
<p>Start by reading real examples. Hamel Husain's widely shared advice on evals is to remove all friction from looking at data: read traces, label them good or bad, and keep going until you stop learning anything new.<sup>[1]</sup> The failures you find become the categories you test for.</p>
<ul>
<li><strong>Use real inputs.</strong> Questions from logs, tickets or user research, anonymised. Invented examples miss the messy cases that matter.</li>
<li><strong>Write the criteria down.</strong> For each case, what must a good answer contain, and what must it never do? Get two people to agree.</li>
<li><strong>Cover the hard parts on purpose:</strong> ambiguous questions, things the feature should refuse, questions the sources don't answer.</li>
<li><strong>Agree the pass rate before you run it,</strong> so the result can't be argued away afterwards.</li>
</ul>
<p>If you use a model as a grader, measure it. A well-known study found strong models agreed with human preferences over 80% of the time, about as often as people agree with each other, but also showed position, length and self-preference biases.<sup>[2]</sup> Grade a sample by hand, compare, and recheck when you change the grader.</p>

<h2>Red-teaming</h2>
<p>Red-teaming means trying to make the feature fail on purpose. Anthropic's red-teaming study released nearly 39,000 attack attempts and described how varied the harmful outputs were, from obvious to subtle.<sup>[3]</sup> For a product feature, focus on what would hurt your users or your company:</p>
<ul>
<li>Getting it to reveal data it shouldn't, such as another customer's details or its own instructions.</li>
<li><a class="term" data-t="prompt-injection">Prompt injection</a> through content it reads: a document, ticket or web page with instructions inside (lesson 8).</li>
<li>Advice outside its scope, such as legal, medical or financial answers.</li>
<li>Confident answers when the sources say nothing.</li>
</ul>
<p>Every attack that works becomes a permanent case in the eval set, with the expected safe behaviour.</p>

<h2>Practice: which layer catches it?</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Sort the testing activities</span></div><div class="activity-b">
<p>Put each activity in the layer it belongs to.</p>
<div data-w="sort" data-cfg="ai-test-layers"></div>
</div></div>

<ol class="steps">
<li><strong>The eval set defines good</strong>Real cases, written criteria, adversarial cases, and a pass rate agreed before launch.</li>
<li><strong>Regression checks protect it</strong>Rerun the set whenever the model, prompt, retrieval or tools change, and compare with the last good result.</li>
<li><strong>Monitoring finds the unknown</strong>Live samples and cheap signals show problems the set never imagined. Those become new cases.</li>
</ol>
<div class="key"><p>An eval set is never finished. Every production failure you find should end up in it, so the same failure can't come back unnoticed.</p></div>

<h2>Release gates for AI features</h2>
<p>A release gate is a rule agreed in advance: which evals run, what score passes, and which failures block a release outright. Without one, every model change becomes an argument about whether 140 out of 150 is good enough. Tools now exist to run eval sets and adversarial tests automatically in CI, so the gate can run on every prompt or model change.[4]</p>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Testing only the happy path.</strong> The questions people actually ask are messier, ruder and more ambiguous than the ones a team writes.</li>
<li><strong>A judge nobody has checked.</strong> An automated grader with unknown agreement turns opinions into numbers.</li>
<li><strong>Changing the eval set to pass.</strong> Removing hard cases before a launch is the AI version of weakening a test.</li>
<li><strong>Thumbs-up rate as the only signal.</strong> Few people click, and those who do aren't typical.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 45-minute exercise.</strong> Pull 30 real inputs for an AI feature your team runs or plans. Label what a good answer must contain for each. You now have the start of an eval set, and probably a list of cases nobody had thought about.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A single overall score is enough to decide a release.</dt><dd>Averages hide serious failures. Some categories, like policy or privacy, need their own blocking gate.</dd>
<dt>Red-teaming is only for security teams.</dt><dd>Testers who know the product find the most realistic misuse. Everyone can contribute attacks.</dd>
<dt>Once the eval set passes, the feature is done.</dt><dd>Real use drifts from the eval set. Add failures from production to it regularly.</dd>
<dt>A newer model is a safe upgrade.</dt><dd>New models change behaviour in specific ways. Re-run the full gate on every change.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Agree release gates before you see results, with different thresholds per set.</li>
<li>Make policy, privacy and safety failures blocking on their own.</li>
<li>Red-team with realistic misuse and include it in the gate.</li>
<li>Read the failures: they usually point to a cause you can fix.</li>
<li>Feed production failures back into the eval sets.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">A new model scores 93.3% on quality but fails 4 of 40 policy questions. Your gate requires 100% on policy. What happens?</p><ul>
<li data-fb="The gate exists so averages can't override policy.">It ships, because overall quality improved.</li>
<li data-fb="A warning doesn't fix wrong policy answers.">It ships with a warning to support agents.</li>
<li data-fb="Right. The gate was agreed in advance.">It doesn't ship until the policy failures are fixed and re-run.</li>
<li data-fb="Moving the goalposts defeats the gate.">The policy threshold is lowered to 90% just for this one release.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why agree release thresholds before running the evals?</p><ul>
<li data-fb="Right. Fixed rules prevent moving goalposts.">So results can't be argued into whatever the team hoped for.</li>
<li data-fb="Some do, but that isn't the reason.">Because eval tools require thresholds as part of their configuration.</li>
<li data-fb="Thresholds don't affect speed.">So the evals run faster in continuous integration.</li>
<li data-fb="Vendors don't know your feature.">Because vendors publish recommended thresholds.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Four failures all cite a discontinued refund policy. What does that suggest?</p><ul>
<li data-fb="The eval reflects current policy; it's right.">The eval set is wrong and should be updated.</li>
<li data-fb="It did better elsewhere; the cause is specific.">The new model is generally worse overall and should be abandoned.</li>
<li data-fb="Consistent failures on one topic aren't flakiness.">The test is flaky and should be re-run until it passes.</li>
<li data-fb="Right. Fix retrieval or the prompt, then re-run.">It's answering from training instead of the retrieved policy.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Which set should contain prompt injection and abuse attempts?</p><ul>
<li data-fb="Mixing hides the result in an average.">The core quality set, mixed in with normal questions.</li>
<li data-fb="Right. Safety failures need their own gate.">A separate red-team set with its own threshold.</li>
<li data-fb="Testers should include realistic misuse.">None: injection is the security team's concern only.</li>
<li data-fb="By then, users are exposed.">Only the production logs, after release.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Where should new eval cases come from after launch?</p><ul>
<li data-fb="Right. They keep the eval set close to reality.">Real failures and edge cases seen in production.</li>
<li data-fb="Generated cases drift from real use.">A fresh set generated by the model each month.</li>
<li data-fb="Not your users or your policies.">The vendor's public benchmark questions.</li>
<li data-fb="A fixed set slowly stops representing real use.">Nowhere: the eval set should stay fixed so results stay comparable.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Hamel Husain (2024), <a href="https://hamel.dev/blog/posts/evals/" target="_blank" rel="noopener">Your AI Product Needs Evals</a>. Levels of evaluation, and why reading your data comes first.</li>
<li>Zheng et al. (2023), <a href="https://arxiv.org/abs/2306.05685" target="_blank" rel="noopener">Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena</a>. Agreement with human preferences, and position, verbosity and self-preference biases.</li>
<li>Ganguli et al. (2022), <a href="https://arxiv.org/abs/2209.07858" target="_blank" rel="noopener">Red Teaming Language Models to Reduce Harms</a>. Methods, scaling behaviour and a released set of attacks.</li>

<li><a href="https://www.promptfoo.dev/docs/red-team/" target="_blank" rel="noopener">Promptfoo: LLM red teaming</a>. An open-source tool for running eval sets and adversarial tests in CI.</li>
</ol></section>
`
});
