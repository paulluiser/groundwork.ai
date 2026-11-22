GW.lesson({
  id: "choosing-models",
  reviewed: "2026-11",
  lede: "“The AI” is not one thing. Behind every tool sits a particular model, and models differ in what they can do, how fast they answer, what they cost and where your data goes. This lesson gives you the vocabulary and a method for choosing.",
  outcomes: [
    "Explain what frontier, reasoning, multimodal and open-weights models are, in plain words.",
    "Compare models on four practical questions: capability, speed, cost and where data goes.",
    "Choose a sensible kind of model for a task, and say what you gave up to get it.",
    "Test a model on your own tasks instead of relying on rankings.",
    "Compare two models on your own examples, with cost, speed and quality side by side."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your team uses the largest model available for everything: classifying tickets, drafting replies, reviewing code and summarising meetings. The monthly bill has tripled, the ticket classifier takes four seconds per ticket, and someone asks whether a smaller model would do. Nobody knows, because nobody has tried.</p>
<p>Choosing a model isn't about finding the best one. It's about finding the cheapest, fastest one that passes your tests for each task. This lesson shows how to make that comparison yourself.</p></div>
<div class="check warmup" data-a="1"><p class="q">A leaderboard ranks Model A above Model B. What does that tell you about your task?</p><ul>
<li data-fb="Leaderboards measure their own tasks, which may not resemble yours.">Model A will be more accurate on your task as well.</li>
<li data-fb="Right. Public rankings are a starting point, not an answer.">Not much until you test both on examples from your work.</li>
<li data-fb="Price and quality aren't reliably linked for a given task.">Model B is cheaper, so it must be the weaker of the two.</li>
<li data-fb="Rankings usually measure quality, not speed.">Model A will also be faster at answering your requests.</li>
</ul></div>
<h2>Many models, not one</h2>
<p>Lesson 1 described what every language model does: predict the next <a class="term" data-t="token">token</a>, again and again. Every model works that way, but they are not interchangeable. Vendors train families of models in several sizes, release new versions every few months, and retire old ones. The product you use (a chat assistant, a coding tool, a help bot) picks a model for you, and sometimes lets you switch.</p>
<p>Models differ in ways that matter for your work:</p>
<ul>
<li><strong>Capability.</strong> How well it handles hard writing, analysis, code and multi-step problems.</li>
<li><strong>Speed.</strong> How long before the first words appear, and how fast the rest follows. Usually called <a class="term" data-t="latency">latency</a>.</li>
<li><strong>Cost.</strong> Usually priced per million tokens, with output tokens costing more than input.<sup>[1]</sup></li>
<li><strong>Where data goes.</strong> Whose servers process your text, under what contract, in which country.</li>
</ul>
<p>Those four pull against each other. A more capable model is usually slower and more expensive. Choosing a model means deciding which of the four matters most for the task in front of you.</p>
<div class="key"><p>There is no best model, only a best fit for a task. Name what matters most (quality, speed, cost or data control) before you choose.</p></div>

<h2>Frontier models</h2>
<p>A <a class="term" data-t="frontier-model">frontier model</a> is one of the most capable general-purpose models available at a given time, usually the largest model from a leading lab. The frontier moves: today's frontier model is next year's mid-range one.</p>
<p>Frontier models are the default in most chat assistants because they handle the widest range of tasks well: nuanced writing, unfamiliar code, long documents. They are also the slowest and most expensive per token. For a one-off task that's rarely a problem. For a feature that runs a million times a day, it can decide whether the feature is affordable.</p>
<p>Many vendors also offer <strong>smaller, faster models</strong>. They are weaker on hard problems but often good enough for narrow, repetitive work: sorting tickets into categories, extracting fields from forms, short rewrites, autocomplete.</p>

<h2>Reasoning models</h2>
<p>A <a class="term" data-t="reasoning-model">reasoning model</a> is trained to work through a problem in intermediate steps before giving its final answer. The steps are still generated tokens, but the model has been trained, largely with reinforcement learning, to use them productively: breaking the problem down, trying an approach, noticing a mistake, trying another.<sup>[2]</sup> Many products expose this as a mode or setting, often called thinking or extended thinking.<sup>[3]</sup></p>
<p>Asking any model to show its working can improve multi-step answers (lesson 5 comes back to this). Reasoning models build that habit in, and they do much better on problems with many dependent steps: debugging, planning a migration, maths, tricky logic.</p>
<p>Three things to know before reaching for one:</p>
<ol class="steps">
<li><strong>It costs time and tokens</strong>The reasoning steps are generated, and usually billed, like any other output. A question that takes a few seconds normally can take a minute.</li>
<li><strong>It doesn't help every task</strong>Rewording an email or answering a simple lookup gains little from extended reasoning. Use it where a careful person would need to think for a while too.</li>
<li><strong>Visible reasoning is not a guarantee</strong>A reasoning trace looks like a careful argument, which makes it persuasive. It can still contain wrong steps, and research has found that the trace does not always reflect what actually drove the answer.<sup>[4]</sup> Check the conclusion the way you would any other output.</li>
</ol>

<h2>Multimodal models</h2>
<p>A <a class="term" data-t="multimodal">multimodal model</a> takes more than text as input: images, screenshots, PDFs, sometimes audio or video. Some can also produce images or speech. Inside, images are converted into tokens too, so everything from lesson 1 still applies.<sup>[5]</sup></p>
<p>That opens up practical work in every role:</p>
<div class="tbl"><table>
<thead><tr><th>Role</th><th>Example</th><th>Watch for</th></tr></thead>
<tbody>
<tr><td>Design</td><td>Review a screenshot of a form for unclear labels and layout problems.</td><td>It cannot measure exact colours or contrast from an image. Use a contrast checker.</td></tr>
<tr><td>QA</td><td>Turn a screenshot of a bug into a draft report with reproduction steps.</td><td>It describes what is visible, not what happened before the screenshot.</td></tr>
<tr><td>Product</td><td>Transcribe a photographed whiteboard from a workshop.</td><td>Misread handwriting and arrows that point the wrong way.</td></tr>
<tr><td>Operations</td><td>Describe the shape of a latency graph from a dashboard.</td><td>Exact values read from charts are often wrong. Get the numbers from the data.</td></tr>
</tbody></table></div>
<p>The rule of thumb: multimodal models are good at describing and summarising what an image shows, and unreliable at precise reading such as small text, exact numbers on a chart, counting many objects or measuring.</p>

<h2>Open-weights models</h2>
<p>Most frontier models are reached through a vendor's service: you send text, their servers run the model, you get a reply. An <a class="term" data-t="open-weights">open-weights model</a> is different. Its <a class="term" data-t="parameter">parameters</a> (the weights) are published, so anyone can download the model and run it on their own hardware or in a cloud account they control.<sup>[6]</sup></p>
<div class="tbl"><table>
<thead><tr><th>What you gain</th><th>What it costs you</th></tr></thead>
<tbody>
<tr><td>Data never leaves your environment, which can settle data-residency and confidentiality questions.</td><td>Your team runs it: servers, scaling, security patches, monitoring.</td></tr>
<tr><td>The version is fixed. It won't change behaviour unless you change it.</td><td>The most capable open models have generally trailed the best hosted ones.</td></tr>
<tr><td>You can fine-tune it on your own examples.</td><td>Licences vary. Some restrict commercial use or large deployments; read the licence.</td></tr>
</tbody></table></div>
<p>“Open weights” is not the same as “open source”. Usually the training data and training code are not released, so you can run the model but not rebuild it or fully inspect how it was made.<sup>[7]</sup></p>

<h2>Worked example: one team, three tasks</h2>
<p>A support team for an online retailer has three AI tasks on its list. Here is how they chose a model for each, step by step.</p>
<ol class="steps">
<li><strong>Tag 40,000 tickets every night</strong>Each ticket gets one of eight categories. The task is narrow and repetitive, and the volume is high: about 650 tokens per ticket is 26 million tokens a night. Cost and speed matter most, so they tried a <em>small, fast model</em> first and measured it on 300 tickets that people had already tagged. It agreed with the human tags 94% of the time, against 96% for a frontier model at many times the price. They took the small model and send low-confidence cases to a person.</li>
<li><strong>Find a rare double-charge bug</strong>A refund job occasionally pays a customer twice. The cause depends on timing across two services. This is a multi-step problem with few calls a day, so quality matters most. An engineer used a <em>reasoning model</em> with the logs and code in context, accepted the wait, and then confirmed its hypothesis with a test before changing anything.</li>
<li><strong>Summarise complaint letters containing health details</strong>Some customers explain medical reasons for returns. The company's policy forbids sending health data to outside processors. Data control matters most, so the team used an <em>open-weights model</em> run inside their own cloud account, after checking its licence and accepting weaker summaries than a frontier model would give.</li>
</ol>
<p>Notice the method: name what matters most, choose the kind of model, then <strong>test it on your own examples</strong> before relying on it. Lesson 18 shows how to build that kind of test properly.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Match the task to a model</span></div><div class="activity-b">
<p>For each task, choose the kind of model you would try first. Several answers can be defended; the feedback explains the reasoning behind the suggested one.</p>
<div data-w="sort" data-cfg="model-pick"></div>
</div></div>

<h2>Cost and speed in practice</h2>
<p>You don't need to memorise prices, which change often. You do need to estimate, because AI features are billed by use.</p>
<ol class="steps">
<li><strong>Count tokens per call</strong>Instructions plus input plus expected output. Lesson 2's context exercise shows how quickly instructions and documents add up.</li>
<li><strong>Multiply by volume</strong>Calls per day, per month. The nightly tagging job above is 26 million tokens a night, about 800 million a month.</li>
<li><strong>Price it on two or three models</strong>Use each vendor's published per-token prices. Differences of ten times or more between the smallest and largest models are common.</li>
<li><strong>Check the speed users will feel</strong>For anything interactive, such as autocomplete or a chat reply, time it. Users notice a wait of a second or two.</li>
</ol>

<h2>Your model will change</h2>
<p>Vendors update and retire models. A tool you use every day may switch to a newer model without telling you, and its answers will shift: usually better, occasionally worse for your particular task. Products built on a model should name an exact model version, and re-run their tests before moving to a new one (lesson 18).</p>
<p>Public leaderboards and benchmarks are useful for a first shortlist, but they measure general tasks under conditions that won't match yours. The only reliable comparison is on twenty or thirty real examples of your own work.</p>

<h2>Reading public comparisons</h2>
<p>Public leaderboards are useful for building a shortlist. Some compare models on quality, speed and price together across many providers;[8] others rank models by human preference in blind side-by-side votes. Each measures something real, and none measures your task. A model that tops a general benchmark can be worse at classifying your support tickets than one half its price. Use rankings to choose two or three candidates, then test those on your own examples.</p>
<h2>Worked example: testing two models on your task</h2>
<p>A support team wants to classify incoming tickets into eight categories. They take 100 recent tickets that a senior agent has already labelled, and run two candidate models on all of them with the same prompt.</p>
<div class="tbl"><table><thead><tr><th>Measure</th><th>Large model</th><th>Small model</th></tr></thead><tbody>
<tr><td>Matches the agent's label</td><td>94 of 100</td><td>91 of 100</td></tr>
<tr><td>Errors on “billing” vs “account”</td><td>3</td><td>6</td></tr>
<tr><td>Median response time</td><td>3.8 seconds</td><td>0.6 seconds</td></tr>
<tr><td>Cost per 1,000 tickets (from current price sheets)</td><td>$4.10</td><td>$0.30</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>The large model is slightly more accurate</strong>, and almost all the difference is in one confusable pair of categories.</li>
<li><strong>The small model is six times faster and about 14 times cheaper.</strong> At 30,000 tickets a month, that’s about $123 against $9.</li>
<li><strong>A better fix may not be a bigger model.</strong> Two clear examples of billing versus account tickets in the prompt might close the gap (lesson 5).</li>
<li><strong>The decision is now evidence-based:</strong> use the small model with an improved prompt, re-test, and keep the 100-ticket set to check any future change.</li>
</ul>
<h2>A simple way to decide</h2>
<ol class="steps">
<li><strong>Write down what “good enough” means</strong>For this task, what accuracy, speed and cost would be acceptable? Agree it before testing, so you don't move the goalposts.</li>
<li><strong>Collect 30 to 100 real examples</strong>With the right answer, or rules for a good answer, for each. Include the hard cases.</li>
<li><strong>Test the cheapest plausible model first</strong>If it passes, you're done. If not, move up one step and test again.</li>
<li><strong>Record the result and the date</strong>Models and prices change. Keep the examples, so re-testing takes minutes.</li>
</ol>
<h2>Your turn: plan a model comparison</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Plan a fair test for one of your tasks</span></div><div class="activity-b">
<p>Pick a task your team uses AI for (or wants to). Write the test plan: what “good enough” means, where the examples come from and how many, which two models you'd compare, and what you'd measure.</p>
<div data-w="task" data-key="choose-plan">
<div class="task-model"><p><strong>Task:</strong> summarising sprint retros into three actions.</p>
<p><strong>Good enough:</strong> every action in the summary appears in the notes; at most one real action missed per retro; under 10 seconds; under $0.05 per summary.</p>
<p><strong>Examples:</strong> 30 past retros with the actions the team actually agreed, written down by the facilitator.</p>
<p><strong>Models:</strong> the team's current large model and the same provider's smallest model.</p>
<p><strong>Measure:</strong> invented actions (must be zero), missed actions, time and cost. Re-test whenever either model changes.</p></div>
<ul class="task-rubric">
<li>Defines “good enough” with measurable thresholds before testing</li>
<li>Uses real examples with known right answers or clear rules</li>
<li>Includes at least one cheaper or smaller candidate</li>
<li>Measures quality, speed and cost, not quality alone</li>
<li>Plans to re-test when models or prices change</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take ten examples from one AI task you already run. Try them on a smaller, cheaper model with the same prompt. Count how many results you'd accept. If it's nine or ten, you may be paying for capacity you don't need.</div>
<h2>Common misconceptions</h2>
<dl class="myths">
<dt>The most capable model is always the safest choice.</dt><dd>It's often slower and far more expensive, and may be no better on simple tasks. Test the cheaper option first.</dd>
<dt>A reasoning model is better for everything.</dt><dd>Reasoning helps on multi-step problems and costs time and tokens. For classification or rewriting, it's often wasted.</dd>
<dt>Once we pick a model, the decision is made.</dt><dd>Providers update and retire models. Keep your test examples so you can re-check in minutes.</dd>
<dt>Benchmarks tell you which model is best.</dt><dd>They tell you which is best at the benchmark. Your examples tell you which is good enough for you.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>There's no single best model; there's the cheapest one that passes your tests for each task.</li>
<li>Use public rankings to shortlist, then test on 30 to 100 of your own examples.</li>
<li>Compare quality, speed and cost together, and decide what “good enough” means first.</li>
<li>A better prompt or a few examples can close the gap more cheaply than a bigger model.</li>
<li>Keep your test set; re-run it whenever a model, price or prompt changes.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="3"><p class="q">Two models score 94% and 91% on your 100 test tickets. The second is 14 times cheaper. What's the sensible next step?</p><ul>
<li data-fb="Not if the difference is small and fixable, and the cost is 14 times higher.">Choose the first model, since higher accuracy always wins.</li>
<li data-fb="Possible, but first see whether the errors can be fixed cheaply.">Choose the second model without any further changes.</li>
<li data-fb="That adds a guess, not evidence.">Ask a third model to decide which of the two is better.</li>
<li data-fb="Right. Targeted examples often close a small gap.">Look at where the cheaper model fails, and try fixing it with the prompt.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">When is a reasoning model most worth its extra time and cost?</p><ul>
<li data-fb="Right. That's where step-by-step reasoning pays off.">For multi-step problems like planning or tricky debugging.</li>
<li data-fb="Usually wasted: a small model often does this well.">For sorting short messages into a handful of fixed categories.</li>
<li data-fb="A simple language task; reasoning adds little.">For rewriting a paragraph in a friendlier, more casual tone.</li>
<li data-fb="Visibility doesn't make a task need reasoning.">For any task where the output will be shown to customers.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">How many examples make a reasonable first comparison for one task?</p><ul>
<li data-fb="Too few, and chosen to flatter rather than test.">Three, chosen to show each model at its best.</li>
<li data-fb="Overkill for a first decision; you can expand later.">Several thousand, so the result is statistically certain.</li>
<li data-fb="Right. Enough to see patterns, quick to build.">Thirty to a hundred real ones, including hard cases.</li>
<li data-fb="The provider doesn't know your task.">However many the model provider suggests in its docs.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why keep your test examples after choosing a model?</p><ul>
<li data-fb="No such requirement exists.">Providers require them for billing and usage audits.</li>
<li data-fb="Right. Re-testing takes minutes instead of days.">Models change, so you can re-check quickly when they do.</li>
<li data-fb="Possible, but not the main reason to keep them.">They can be used to train the model on your data later.</li>
<li data-fb="They prove it was good enough, which is what matters.">They prove to leadership that the chosen model was the best.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Which is the best use of a public model leaderboard?</p><ul>
<li data-fb="The top model may be overkill and expensive for most tasks.">Choosing the top-ranked model for every task the team has.</li>
<li data-fb="Rankings measure their own tasks, not yours.">Proving to stakeholders which model is objectively the best.</li>
<li data-fb="That's when rankings mislead most.">Replacing your own testing when time is short.</li>
<li data-fb="Right. Shortlist publicly, decide privately.">Building a shortlist of two or three candidates to test yourself.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/about-claude/models/overview" target="_blank" rel="noopener">Models overview</a>. An example of a vendor's model family, with speed, context window and per-token prices side by side.</li>
<li>OpenAI (2024), <a href="https://openai.com/index/learning-to-reason-with-llms/" target="_blank" rel="noopener">Learning to reason with LLMs</a>. How reinforcement learning trains models to reason before answering.</li>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/build-with-claude/extended-thinking" target="_blank" rel="noopener">Extended thinking</a>. How a reasoning mode is switched on, budgeted and billed.</li>
<li>Anthropic (2025), <a href="https://www.anthropic.com/research/reasoning-models-dont-say-think" target="_blank" rel="noopener">Reasoning models don't always say what they think</a>. Evidence that reasoning traces are not always faithful.</li>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/build-with-claude/vision" target="_blank" rel="noopener">Vision</a>. How images are supplied to a model, and its documented limitations.</li>
<li>NTIA (2024), <a href="https://www.ntia.gov/issues/artificial-intelligence/open-model-weights-report" target="_blank" rel="noopener">Dual-Use Foundation Models with Widely Available Model Weights</a>. A US government report on the benefits and risks of open-weights models.</li>
<li>Open Source Initiative, <a href="https://opensource.org/ai/open-source-ai-definition" target="_blank" rel="noopener">The Open Source AI Definition</a>. Why releasing weights alone differs from open source.</li>

<li><a href="https://artificialanalysis.ai/" target="_blank" rel="noopener">Artificial Analysis</a>. Independent comparisons of models on quality, output speed and price across providers.</li>
</ol></section>
`
});
