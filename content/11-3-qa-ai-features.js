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
  lede: "Lesson 18 introduced evals and LLM-as-judge. This lesson goes deeper: how to build an eval set people trust, how to attack the feature on purpose, what to rerun when the model or prompt changes, and how to keep watching once real users arrive.",
  outcomes: [
    "Build an eval set from real cases, with written criteria and a pass rate agreed in advance.",
    "Plan red-teaming for misuse, data leaks and instructions hidden in content.",
    "Set up regression checks that run whenever the model, prompt or retrieval changes.",
    "Choose monitoring signals for production, and feed what they find back into the eval set."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Testing only the happy path.</strong> The questions people actually ask are messier, ruder and more ambiguous than the ones a team writes.</li>
<li><strong>A judge nobody has checked.</strong> An automated grader with unknown agreement turns opinions into numbers.</li>
<li><strong>Changing the eval set to pass.</strong> Removing hard cases before a launch is the AI version of weakening a test.</li>
<li><strong>Thumbs-up rate as the only signal.</strong> Few people click, and those who do aren't typical.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 45-minute exercise.</strong> Pull 30 real inputs for an AI feature your team runs or plans. Label what a good answer must contain for each. You now have the start of an eval set, and probably a list of cases nobody had thought about.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Your provider announces a new version of the model your feature uses. What should happen before you switch?</p><ul>
<li data-fb="Newer isn't always better for your use case.">Switch straight away; newer models are better.</li>
<li data-fb="Right. A model change is the main trigger for a regression check.">Rerun the eval set and compare with the current version's scores.</li>
<li data-fb="Users shouldn't be the ones who find the regression.">Switch and watch the support queue.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">You plan to use a model to grade answers. What do you need first?</p><ul>
<li data-fb="Right. Without measured agreement, you don't know what the grader's scores mean.">A sample graded by people, to measure how well the grader agrees.</li>
<li data-fb="Bigger graders still have biases; measure them.">The biggest model available, so its grades are right.</li>
<li data-fb="Self-grading tends to favour its own answers.">The same model as the feature, for consistency.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">A red-team tester gets the assistant to reveal its system prompt. What should happen to that case?</p><ul>
<li data-fb="Fixing it once isn't enough if nothing stops it coming back.">Fix the prompt, and move on.</li>
<li data-fb="If it matters enough to report, it matters enough to test.">Note it as a curiosity; system prompts aren't secret.</li>
<li data-fb="Right. Every successful attack becomes a permanent case with an expected outcome.">Add it to the eval set with the expected safe behaviour.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Hamel Husain (2024), <a href="https://hamel.dev/blog/posts/evals/" target="_blank" rel="noopener">Your AI Product Needs Evals</a>. Levels of evaluation, and why reading your data comes first.</li>
<li>Zheng et al. (2023), <a href="https://arxiv.org/abs/2306.05685" target="_blank" rel="noopener">Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena</a>. Agreement with human preferences, and position, verbosity and self-preference biases.</li>
<li>Ganguli et al. (2022), <a href="https://arxiv.org/abs/2209.07858" target="_blank" rel="noopener">Red Teaming Language Models to Reduce Harms</a>. Methods, scaling behaviour and a released set of attacks.</li>
</ol></section>
`
});
