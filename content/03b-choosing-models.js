GW.lesson({
  id: "choosing-models",
  lede: "“The AI” is not one thing. Behind every tool sits a particular model, and models differ in what they can do, how fast they answer, what they cost and where your data goes. This lesson gives you the vocabulary and a method for choosing.",
  outcomes: [
    "Explain what frontier, reasoning, multimodal and open-weights models are, in plain words.",
    "Compare models on four practical questions: capability, speed, cost and where data goes.",
    "Choose a sensible kind of model for a task, and say what you gave up to get it.",
    "Test a model on your own tasks instead of relying on rankings."
  ],
  html: String.raw`
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

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">A teammate wants to switch a simple “rewrite this sentence more politely” feature to a reasoning model, “because it's smarter”. What's the best response?</p><ul>
<li data-fb="Reasoning models aren't harmful here, but the trade-off is poor.">Agree: reasoning models are better at everything.</li>
<li data-fb="Right. The task has no multi-step problem to reason through, so you'd pay in waiting time and tokens for little gain. Test both on real examples if in doubt.">Question it: a short rewrite gains little from extended reasoning, and it would be slower and cost more.</li>
<li data-fb="Reasoning models are available from mainstream vendors, often as a mode of the same model.">Refuse: reasoning models can't be used in products.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which statement about open-weights models is accurate?</p><ul>
<li data-fb="Most open-weights releases don't include the training data or full training code.">They are always fully open source, including training data.</li>
<li data-fb="Running it yourself means you also run the security, updates and monitoring.">They remove all operational work, because no vendor is involved.</li>
<li data-fb="Right. Running it in your own environment keeps data in-house and the version fixed, at the cost of operating it yourself.">You can run them in your own environment, so data stays with you and the version doesn't change unless you change it.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">A designer asks a multimodal model whether the grey text in a screenshot meets contrast requirements. It says “yes, about 5:1”. What should they do?</p><ul>
<li data-fb="Right. Reading exact colour values from an image is unreliable. Use the real colour codes and a contrast tool.">Check the actual colour values with a contrast checker.</li>
<li data-fb="Precise measurement from images is a known weakness, so the number needs checking.">Accept it, because the model can see the image.</li>
<li data-fb="Another sample gives another estimate, not a measurement.">Ask the model again to make sure.</li>
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
</ol></section>
`
});
