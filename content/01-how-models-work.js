GW.lesson({
  id: "how-models-work",
  lede: "Before you can judge AI output, you need a working picture of how it is made. This lesson builds that picture from one simple idea: predicting the next piece of text.",
  outcomes: [
    "Explain what a token is and why limits and prices are counted in tokens.",
    "Describe how a model turns probabilities into a sentence, one token at a time.",
    "Explain why the same request can give different answers.",
    "Say what training gives a model, what it does not, and what follows for your work."
  ],
  html: String.raw`
<h2>Start with autocomplete</h2>
<p>Your phone keyboard suggests the next word as you type. Type “See you” and it offers “tomorrow”, “soon” or “later”, because those words usually follow “See you” in the text it has learned from. It doesn't understand your plans. It knows what tends to come next.</p>
<p>A <a class="term" data-t="llm">large language model</a> (LLM) does the same job: given some text, predict what comes next. The difference is scale. It has learned from a vast amount of writing and code, and it takes into account everything earlier in the conversation, not just the last two words. At that scale, “predict what comes next” turns out to be enough to draft an email, explain a stack trace, summarise a meeting or write a test.</p>
<p>Chat assistants, coding assistants and the “summarise this” buttons appearing in your tools are almost all built on an LLM. The product adds instructions, a user interface and sometimes tools, but the core is a <a class="term" data-t="model">model</a>: a very large file of numbers, called <a class="term" data-t="parameter">parameters</a>, that turns input text into predictions.</p>
<div class="key"><p>A language model produces a <em>plausible continuation</em> of the text it is given. Plausible is often correct. It is not the same thing as correct, and the rest of this course is about working with that gap.</p></div>

<h2>Text becomes tokens</h2>
<p>Models don't read letters or whole words. They read <a class="term" data-t="token">tokens</a>: chunks of text that might be a whole common word (“the”, “deploy”), part of a longer word (“deploy” + “ment”), a number fragment or a punctuation mark. A tokenizer splits text into these chunks before the model sees it, and joins them back together afterwards.</p>
<p>The chunks are learned from data. Strings that appear often become single tokens; rare strings get split into pieces. One widely used method, byte-pair encoding, starts from single characters and repeatedly merges the most frequent neighbouring pairs until it has a vocabulary of tens of thousands of tokens.<sup>[2]</sup> In ordinary English, a token averages roughly four characters, or about three quarters of a word. Code, numbers and many other languages usually take more tokens for the same amount of text.</p>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">See text as a model sees it</span></div><div class="activity-b">
<p>Type or paste a sentence from your own work: a commit message, a ticket title, an error. Notice how common words stay whole while long words, numbers and symbols break apart.</p>
<div data-w="tokens"></div>
</div></div>

<h3>Why tokens matter to you</h3>
<ul>
<li><strong>Limits are counted in tokens.</strong> Every model can only consider a fixed number of tokens at once, and long documents or long chats run into that limit. Lesson 2 covers what happens then.</li>
<li><strong>Cost and speed are counted in tokens.</strong> Paid AI services usually charge per token in and per token out, and longer answers take longer to generate.</li>
<li><strong>Letter-level tasks are unreliable.</strong> Because the model sees chunks rather than letters, it can stumble on tasks like counting the letters in a word, reversing a string or checking exact character limits. If your copy must fit 40 characters, count the characters yourself or with a tool.</li>
</ul>

<h2>Predicting the next token</h2>
<p>Here is the core step. Given all the tokens so far, the model calculates a score for every token in its vocabulary, then turns those scores into a <a class="term" data-t="probability-distribution">probability distribution</a>: a list of possible next tokens with how likely each is, adding up to 100%.</p>
<p>Take the unfinished sentence “The deploy failed because the”. A model that has read millions of incident reports and engineering discussions has learned what tends to follow. A simplified version of its distribution might look like this:</p>
<div class="tbl"><table>
<thead><tr><th>Next token</th><th>Probability</th><th>Why it is likely</th></tr></thead>
<tbody>
<tr><td><code>database</code></td><td>30%</td><td>Databases appear in many deployment failure write-ups.</td></tr>
<tr><td><code>build</code></td><td>17%</td><td>Build problems are a common cause, so the phrase is common.</td></tr>
<tr><td><code>tests</code></td><td>14%</td><td>Failing tests block many pipelines.</td></tr>
<tr><td><code>config</code></td><td>12%</td><td>Configuration errors are frequently blamed.</td></tr>
<tr><td>… dozens more</td><td>…</td><td>Each with a small share.</td></tr>
<tr><td><code>cat</code></td><td>1%</td><td>Grammatically possible, rarely written.</td></tr>
</tbody></table></div>
<p>Notice what the model is not doing. It hasn't looked at your deploy. It has no idea why <em>your</em> deploy failed. It knows which words usually follow that phrase. If you want an answer about your system, you have to give it your logs, which is the subject of the next lesson.</p>

<h3>Picking one token: sampling and temperature</h3>
<p>The model produces probabilities; something has to choose one token. Most products use <a class="term" data-t="sampling">sampling</a>: picking at random, weighted by the probabilities. “database” gets picked about 30% of the time, “cat” about 1% of the time.</p>
<p>A setting called <a class="term" data-t="temperature">temperature</a> reshapes the distribution before the pick. Lower temperature sharpens it, so the likeliest token wins more often. At zero, the top token is always chosen. Higher temperature flattens it, so unlikely tokens get a real chance. Very high temperatures produce text that drifts into nonsense, which is why research on text generation has looked for ways to cut off the long tail of unlikely tokens.<sup>[5]</sup></p>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">Sample from a model</span></div><div class="activity-b">
<p>This uses the distribution above. Move the temperature, watch the bars change, then generate a sentence. Run it several times at 0.2, at 1.0 and at 1.8. Use “Sample 20 times” to see how often each first word wins.</p>
<div data-w="sampler"></div>
<p class="muted" style="font-size:14px;margin-bottom:0">The probabilities are illustrative. A real model scores tens of thousands of tokens at every step, not nine.</p>
</div></div>

<p>What you should have noticed:</p>
<ol>
<li><strong>At low temperature</strong> the result is almost always “database…”. Repeatable, but repeatability is not accuracy. The most common explanation in general may be the wrong one for your deploy.</li>
<li><strong>At 1.0</strong> you get a realistic mix of plausible causes. Each sentence is fluent, and each sounds equally confident, even though at most one could be true of a given incident.</li>
<li><strong>At high temperature</strong> “cat” starts to appear. The output is still grammatical, still confident, and now silly. The model has no separate sense of which version is true.</li>
</ol>
<p>This is the main reason the same question can produce different answers on different days. The output is <a class="term" data-t="non-deterministic">non-deterministic</a>. Products may also change the underlying model or its instructions without telling you, which changes answers too.</p>

<h2>One token at a time: the generation loop</h2>
<p>A single prediction gives one token. A paragraph comes from repeating the step:</p>
<figure>
<svg class="loopfig" viewBox="0 0 640 230" role="img" aria-label="The generation loop: read the text so far, compute probabilities, pick a token, append it, and repeat.">
  <defs><marker id="ah1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="ah"/></marker></defs>
  <g class="n n1"><rect x="10" y="80" width="130" height="70" rx="10"/><text x="75" y="110" text-anchor="middle">1. Read all</text><text x="75" y="128" text-anchor="middle">text so far</text></g>
  <g class="n n2"><rect x="180" y="10" width="130" height="70" rx="10"/><text x="245" y="40" text-anchor="middle">2. Score every</text><text x="245" y="58" text-anchor="middle">possible token</text></g>
  <g class="n n3"><rect x="350" y="80" width="130" height="70" rx="10"/><text x="415" y="110" text-anchor="middle">3. Pick one</text><text x="415" y="128" text-anchor="middle">(sampling)</text></g>
  <g class="n n4"><rect x="180" y="150" width="130" height="70" rx="10"/><text x="245" y="180" text-anchor="middle">4. Append it</text><text x="245" y="198" text-anchor="middle">to the text</text></g>
  <path class="e" d="M100 80 Q120 45 178 45" marker-end="url(#ah1)"/>
  <path class="e" d="M312 45 Q390 45 405 78" marker-end="url(#ah1)"/>
  <path class="e" d="M405 152 Q390 185 312 185" marker-end="url(#ah1)"/>
  <path class="e" d="M178 185 Q120 185 100 152" marker-end="url(#ah1)"/>
  <g class="stopnote"><rect x="510" y="85" width="122" height="60" rx="8"/><text x="571" y="110" text-anchor="middle">Stop when a</text><text x="571" y="128" text-anchor="middle">stop token or limit</text></g>
  <path class="e dash" d="M482 115 L508 115" marker-end="url(#ah1)"/>
</svg>
<figcaption>Each new token becomes part of the input for the next one. A 300-word answer is roughly 400 trips around this loop.</figcaption>
</figure>
<p>Three consequences matter at work:</p>
<ul>
<li><strong>Early tokens shape everything after.</strong> Whatever planning happens inside the model, the visible answer is committed one token at a time. If an early sentence picks a wrong assumption (“because the database…”), later sentences tend to build on it consistently rather than turn back. A confident wrong answer often stays internally coherent, which makes it more convincing, not less.</li>
<li><strong>Length isn't effort.</strong> A long, structured answer is just more trips around the loop. Headings and bullet points are cheap to produce and say nothing about how well the answer is supported.</li>
<li><strong>The model can only “see” what is in the text.</strong> The loop reads the conversation so far and nothing else. No database, no browser, no memory of last week, unless the product adds them.</li>
</ul>

<h2>Where the probabilities come from: training</h2>
<p>The numbers inside a model are set by <a class="term" data-t="training">training</a>, in two broad stages.</p>
<ol class="steps">
<li><strong>Pretraining: learn what text looks like</strong>The model is shown an enormous amount of text and code and asked, over and over, to predict the next token. Each time it is wrong, its parameters are nudged so that the correct token would have been a little more likely. Modern models use an architecture called the <a class="term" data-t="transformer">transformer</a>, whose <a class="term" data-t="attention">attention</a> mechanism lets each prediction draw on every earlier token in the input.<sup>[1]</sup> After enough examples, the model has absorbed grammar, style, a great many facts, common reasoning patterns and programming idioms. Research on large models showed that this alone lets them do new tasks from a description and a few examples.<sup>[3]</sup></li>
<li><strong>Fine-tuning: learn to be an assistant</strong>A pretrained model continues text; it doesn't naturally answer questions or follow instructions. Further training on example conversations, plus <a class="term" data-t="rlhf">reinforcement learning from human feedback</a>, where people compare answers and the model is adjusted toward the preferred ones, turns it into something that responds helpfully to requests.<sup>[4]</sup></li>
</ol>
<p>Each stage leaves a trace you will meet in practice:</p>
<div class="tbl"><table>
<thead><tr><th>What training gives</th><th>What it means for you</th></tr></thead>
<tbody>
<tr><td>Patterns from public text up to a <a class="term" data-t="training-cutoff">cutoff date</a></td><td>Strong on widely discussed topics; weak on rare, recent or niche ones. It cannot know about a library version released after the cutoff unless you supply the docs.</td></tr>
<tr><td>No access to your organisation's data</td><td>It doesn't know your customers, codebase, architecture or acronyms. It will fill gaps with what is typical, which may not be true for you.</td></tr>
<tr><td>Statistical patterns, not stored documents</td><td>It does not look things up. A quote, citation or API name can come out plausible and invented.</td></tr>
<tr><td>A preference for answers people rated highly</td><td>It tends to sound confident, helpful and agreeable. That is pleasant, and it is why it may agree with a wrong premise. Lesson 3 covers this.</td></tr>
</tbody></table></div>

<h2>A working mental model</h2>
<p>You don't need the mathematics to use these tools well. You need a picture accurate enough to predict when they will help and when they will mislead. This one works for most of the course:</p>
<div class="key"><p>Think of a very widely read colleague who replies instantly in any format, never tires, has never seen your systems, has no access to anything you don't show them, and almost never says “I don't know” unless you invite it.</p></div>
<p>You would happily ask that colleague for a first draft, a list of options, an explanation of an unfamiliar concept or a second pair of eyes. You wouldn't let them ship to production, sign a contract or tell a customer something without checking. The same instincts apply here.</p>

<h2>What this means in your role</h2>
<div class="tbl"><table>
<thead><tr><th>Role</th><th>Where next-token prediction shows up</th></tr></thead>
<tbody>
<tr><td>Product</td><td>A summary of customer feedback reads as authoritative whether the evidence is strong or thin. Fluency carries no information about support.</td></tr>
<tr><td>Design</td><td>Ten copy variants or layout ideas cost seconds. The model leans toward the typical; distinctive choices still come from you.</td></tr>
<tr><td>Engineering</td><td>Generated code follows familiar idioms, so it looks right. A function or flag can be invented because it is the kind of name that usually exists.</td></tr>
<tr><td>QA</td><td>The same input can produce different outputs, so features built on AI need statistical testing, not single exact-match assertions.</td></tr>
<tr><td>Delivery</td><td>A drafted status report fills gaps with the most typical story, which is usually “on track”.</td></tr>
<tr><td>Operations</td><td>A suggested command looks like the commands that usually fix this kind of problem. Plausible is not the same as safe on your cluster.</td></tr>
</tbody></table></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">A colleague says: “The assistant found the answer in its training data.” Which description is more accurate?</p><ul>
<li data-fb="A model doesn't keep a searchable copy of what it was trained on.">It retrieved the matching document it was trained on and quoted it.</li>
<li data-fb="Training set the parameters; the answer was generated token by token from patterns those parameters encode. That is why it can be fluent and wrong.">It generated text that its learned patterns made likely, without looking anything up.</li>
<li data-fb="Only if the product gave it a search tool. A bare model has no live access to anything.">It searched the internet for the most reliable answer.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">You ask an assistant the same question twice and get two different answers. What is the most likely reason?</p><ul>
<li data-fb="Models don't learn from a single conversation. Unless a product adds a memory feature, nothing persists.">It learned from your first question and improved.</li>
<li data-fb="There's no evidence for that, and the answers can differ even seconds apart.">The model is broken and should be reported.</li>
<li data-fb="Each token is sampled from a probability distribution, so different paths through the loop give different, equally fluent answers.">Tokens are picked by weighted chance, so each run can take a different path.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">A team sets temperature to 0 so that “the answers are always correct”. What is wrong with that reasoning?</p><ul>
<li data-fb="Temperature 0 picks the most likely token each time. That makes output more repeatable; it doesn't make the most likely continuation true for your situation.">It makes answers repeatable, not correct.</li>
<li data-fb="Low temperature is a reasonable choice for consistency; the error is in what the team expects from it.">Temperature 0 makes the model slower and less capable.</li>
<li data-fb="Temperature changes how the next token is picked. It has nothing to do with checking facts.">Nothing. Temperature 0 switches on fact-checking.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Your UI label must be at most 24 characters. Why shouldn't you rely on the model's claim that its suggestion is 22 characters?</p><ul>
<li data-fb="Models can count; the issue is what they see.">Models aren't allowed to count.</li>
<li data-fb="Right. Text arrives as multi-character chunks, so exact character counts are a weak spot. Count with a tool.">It sees tokens, not individual characters, so character-level claims are unreliable.</li>
<li data-fb="Fonts don't change character counts.">Character counts depend on the font.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Vaswani et al. (2017), <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener">Attention Is All You Need</a>. The paper that introduced the transformer architecture.</li>
<li>Sennrich, Haddow and Birch (2016), <a href="https://arxiv.org/abs/1508.07909" target="_blank" rel="noopener">Neural Machine Translation of Rare Words with Subword Units</a>. Introduces byte-pair encoding for splitting words into subword tokens.</li>
<li>Brown et al. (2020), <a href="https://arxiv.org/abs/2005.14165" target="_blank" rel="noopener">Language Models are Few-Shot Learners</a>. Shows large pretrained models doing new tasks from instructions and a few examples.</li>
<li>Ouyang et al. (2022), <a href="https://arxiv.org/abs/2203.02155" target="_blank" rel="noopener">Training language models to follow instructions with human feedback</a>. How fine-tuning and RLHF turn a text predictor into an assistant.</li>
<li>Holtzman et al. (2020), <a href="https://arxiv.org/abs/1904.09751" target="_blank" rel="noopener">The Curious Case of Neural Text Degeneration</a>. Why always picking the top token, or sampling from the full tail, both produce poor text.</li>
<li>OpenAI, <a href="https://platform.openai.com/tokenizer" target="_blank" rel="noopener">Tokenizer</a>. Paste text to see how a production tokenizer splits it.</li>
</ol></section>
`
});
