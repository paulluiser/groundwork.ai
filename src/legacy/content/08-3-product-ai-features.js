GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["ai-feature-calls"] = {
  steps: [
    { title: "Should this be AI at all?", sit: "Sales wants an AI feature that sorts incoming invoices into the right cost centre. Finance says 90% of invoices come from 30 suppliers, each always billed to the same cost centre.", opts: [
      ["Build a model-based classifier for all invoices.", "A lookup table handles 90% of cases perfectly and cheaply. A model adds cost and errors where none are needed."],
      ["Start with a supplier-to-cost-centre rule, and consider AI only for the remaining 10% if it's worth it.", "Right. Use the simplest thing that works, and save AI for the part that's genuinely variable."],
      ["Skip it; AI isn't reliable enough for finance.", "Too broad. A rule solves most of the problem, and AI might help with the rest under review."]], a: 1 },
    { title: "Defining “good enough”", sit: "Engineering asks what accuracy the meeting-summary feature needs before launch. Nobody has written it down.", opts: [
      ["Collect 100 real meetings, have people write what a good summary must contain, agree a pass rate, and test against it.", "Right. An eval set built from real examples turns “good” into something you can measure and re-run (lesson 18)."],
      ["Ship it, and watch the thumbs-up rate.", "Feedback after launch is useful, but you'd be launching blind, and few people click thumbs."],
      ["Ask the model to rate its own summaries.", "Self-grading without a human-checked baseline tells you little (lesson 18)."]], a: 0 },
    { title: "When it gets it wrong", sit: "In testing, the summary feature sometimes lists an action item nobody agreed to. It happens in about 1 in 25 meetings.", opts: [
      ["Hide the problem: present summaries as final, so they feel polished.", "People will act on invented actions. The design should make checking easy, not hide the need."],
      ["Show summaries as drafts, link each action item to the moment in the transcript, and make editing one click.", "Right. Design for the error you know exists: show sources and make correction cheap."],
      ["Delay launch until the error rate is zero.", "Zero isn't achievable for generated text. Decide an acceptable rate and design around the rest."]], a: 1 },
    { title: "Cost at scale", sit: "Each summary costs about 4p in model fees. Your plan is 2 million meetings a month on a plan priced at £8 per user.", opts: [
      ["Model the cost per user per month at expected usage, compare it with the price, and test a smaller model on the eval set.", "Right. Cost per call times real usage can quietly erase a margin. A cheaper model might pass your bar (lesson 4)."],
      ["Ignore it; model prices keep falling.", "They often do, but you'd be betting the margin on it."],
      ["Remove the feature from the cheapest plan without checking.", "Maybe, but decide with the numbers first."]], a: 0 },
    { title: "Measuring the launch", sit: "Two weeks after launch, 60% of users have generated a summary. The team wants to call it a success.", opts: [
      ["Agree: 60% adoption is excellent.", "Trying a feature isn't the same as it helping. Many will have tried it once."],
      ["Also check repeat use, how often summaries are edited heavily or deleted, and a weekly sample reviewed for errors.", "Right. Measure whether it's used again, trusted and correct, not only tried."],
      ["Ask users in a survey whether they like AI.", "Too general to guide decisions about this feature."]], a: 1 }
  ],
  after: "The pattern: use AI only where the problem needs it, define good with real examples, design for the errors you know about, and measure outcomes, not just usage."
};
GW.lesson({
  id: "product-ai-features",
  reviewed: "2026-11",
  lede: "More and more product managers are asked to ship features that are themselves built on AI. These features behave differently from the rest of the product: they're sometimes wrong, they cost money per use, and they change when the model changes. That changes how you specify, launch and measure them.",
  outcomes: [
    "Decide whether a problem actually needs AI, or a simpler rule would do.",
    "Define quality with an eval set built from real examples, before launch.",
    "Specify how the product behaves when the AI is wrong, slow or unavailable.",
    "Plan for cost per use, and measure trust and correctness after launch, not only adoption.",
    "Estimate monthly cost per user for an AI feature and decide whether it pays for itself."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Leadership wants an “AI summary” button on every customer ticket by next quarter. The demo looked great: five hand-picked tickets, five crisp summaries. You own the spec. Nobody has said what a good summary is, what happens when one is wrong, or what each click costs.</p>
<p>Those three gaps sink more AI features than the model does. This lesson turns them into a spec your team can build, test and afford.</p></div>
<div class="check warmup" data-a="1"><p class="q">A demo of an AI feature works well on five examples. What does that tell you?</p><ul>
<li data-fb="Five chosen examples say little about the long tail of real inputs.">The feature is ready for a limited launch to real customers.</li>
<li data-fb="Right. You need a larger, realistic set to know the failure rate.">That it can work, but not how often it works on real inputs.</li>
<li data-fb="Five successes don't establish an error rate.">The model is accurate enough to skip a human review step.</li>
<li data-fb="Trust depends on how it behaves when it's wrong, which the demo didn't show.">That users will trust the feature once it ships.</li>
</ul></div>
<h2>Start with the problem, not the model</h2>
<p>Ask the old question first: what's the simplest thing that would work? Google's rules for machine learning start with “don't be afraid to launch a product without machine learning”.<sup>[1]</sup> AI earns its place where inputs vary a lot (free text, images, messy documents), where a good-enough answer helps, and where a person can check or correct the result.</p>
<div class="tbl"><table>
<thead><tr><th>Signal</th><th>Points toward AI</th><th>Points away</th></tr></thead>
<tbody>
<tr><td>Inputs</td><td>Free text, varied documents, images</td><td>Structured fields with known values</td></tr>
<tr><td>Cost of an error</td><td>Low, or caught by a person before it matters</td><td>High, and invisible until too late</td></tr>
<tr><td>Rules</td><td>Hard to write down</td><td>Easy to write and stable</td></tr>
<tr><td>Volume and price</td><td>Value per use clearly above cost per use</td><td>Thin margins at high volume</td></tr>
</tbody></table></div>

<h2>Specify quality with examples</h2>
<p>“The summary should be accurate” isn't a requirement anyone can test. Instead, collect real inputs (with permission), write down what a good output must and mustn't contain for each, and agree a pass rate. That becomes the <a class="term" data-t="eval">eval</a> set your team runs before launch and after every change to the prompt or the model (lessons 18 and 20 go deeper).<sup>[2]</sup> Write acceptance criteria against it: “At least 95% of summaries list every agreed action and invent none, on the 100-meeting set.”</p>

<h2>Practice: make the call</h2>
<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Five decisions on an AI feature</span></div><div class="activity-b">
<p>You're the PM for an AI feature from idea to launch. Choose what you'd do at each step.</p>
<div data-w="decide" data-cfg="ai-feature-calls"></div>
</div></div>

<h2>Design for failure</h2>
<p>Your spec should answer four questions that ordinary features rarely raise:</p>
<ul>
<li><strong>What does the user see when the AI is wrong?</strong> Show sources, label drafts as drafts, and make correcting quick (lesson 14 covers the design patterns).</li>
<li><strong>What happens when it's slow or down?</strong> A timeout, a fallback without AI, or a clear message. Providers have outages (lesson 41).</li>
<li><strong>What must it never do?</strong> Topics to refuse, data it can't see, actions it can't take without a person. Enforce these in the system, not only in the prompt (lesson 7).</li>
<li><strong>What happens when the model changes?</strong> Re-run the eval set before switching versions, and keep the ability to switch back.</li>
</ul>
<div class="key"><p>An AI feature is specified by its examples, its failure behaviour and its cost per use, not just by what it does when it works.</p></div>

<h2>Cost and measurement</h2>
<p>Model fees are charged per token, so cost grows with usage in a way most software costs don't. Estimate cost per active user per month at realistic usage, and compare it with what that user pays. Then test whether a smaller, cheaper model passes your eval set (lesson 4).</p>
<p>After launch, adoption alone misleads. Track whether people come back, how often outputs are heavily edited or thrown away, and the error rate in a sample you review every week.</p>

<h2>Worked example: an eval set for ticket summaries</h2>
<p>An eval set is a fixed collection of real inputs, each with the rules a good output must meet. It's the AI feature's acceptance test, and you run it before launch and after every change.[2] Here are three rows from a 60-ticket set.</p>
<div class="tbl"><table><thead><tr><th>Ticket (input)</th><th>A good summary must</th><th>A good summary must never</th></tr></thead><tbody>
<tr><td>Customer charged twice for the March invoice, wants a refund, mentions a card ending 4421</td><td>State the double charge, the month, and the refund request</td><td>Include card digits; say a refund was issued</td></tr>
<tr><td>Long thread: bug in export, workaround offered, customer now asking about pricing</td><td>Lead with the current question (pricing); mention the export bug as resolved by a workaround</td><td>Describe the export bug as still open</td></tr>
<tr><td>Angry message, no clear request, mentions cancelling</td><td>Flag cancellation risk; say no specific request was made</td><td>Invent a request; soften the tone into “customer has a question”</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Rows come from real tickets</strong>, chosen to cover the hard cases: long threads, mixed topics, emotion, personal data.</li>
<li><strong>“Must never” matters as much as “must”.</strong> Most damaging errors are inventions and leaks, not omissions.</li>
<li><strong>Each rule can be checked</strong> by a person in seconds, or by a grader model you've validated against people.</li>
<li><strong>The pass rate is the requirement:</strong> “At least 95% of the 60 tickets meet every rule, and none breaks a must-never rule involving personal data.”[5]</li>
</ul>
<h2>Designing for when it's wrong</h2>
<p>Guidelines for human-AI interaction recommend making clear what the system can do and how well, supporting efficient correction, and making it easy to dismiss or ignore suggestions.[4] For the summary button, that means: label the summary as AI-generated, link each statement to the message it came from, let agents edit before saving, and never let the summary replace the ticket history. Google's People + AI Guidebook adds a useful habit: decide in advance what users should do when the output is wrong, and design that path as carefully as the happy one.[3]</p>
<h2>Cost per use: a worked estimate</h2>
<p>AI features cost money every time they run. A quick estimate before you commit avoids an unpleasant surprise at scale. Use your provider's current price sheet; the numbers below are illustrative.</p>
<div class="tbl"><table><thead><tr><th>Input</th><th>Assumption</th><th>Source</th></tr></thead><tbody>
<tr><td>Tokens per summary</td><td>3,000 in (the ticket), 200 out</td><td>Measured on 20 real tickets</td></tr>
<tr><td>Price</td><td>$3 per million input tokens, $15 per million output</td><td>Provider price sheet, dated</td></tr>
<tr><td>Cost per summary</td><td>3,000 × $3/M + 200 × $15/M = $0.009 + $0.003 = <strong>$0.012</strong></td><td>Calculated</td></tr>
<tr><td>Use</td><td>40 summaries per agent per day, 22 days</td><td>Ticket volume per agent</td></tr>
<tr><td>Monthly cost per agent</td><td>880 × $0.012 = <strong>about $10.60</strong></td><td>Calculated</td></tr>
</tbody></table></div>
<p>Compare that with what the agent's seat earns and the time the summary saves. Then run the eval set on a smaller, cheaper model: if it passes, you may cut the cost several times over (lesson 4). Re-check after launch, because real usage is rarely what you assumed.</p>
<h2>Measuring after launch</h2>
<p>Adoption tells you people clicked. To know the feature works, track three things: how often summaries are edited heavily or deleted, the error rate in a sample you review every week, and whether the time to resolve tickets actually moved against a baseline. A feature that's widely used and frequently rewritten is costing time, not saving it.</p>
<h2>Your turn: write the failure spec</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">What happens when the summary is wrong, slow or unavailable?</span></div><div class="activity-b">
<p>For the ticket summary button, write the part of the spec that covers failure. Cover: what the agent sees when the summary may be wrong, what happens if the model is slow or down, and two things the feature must never do.</p>
<div data-w="task" data-key="product-ai-failure">
<div class="task-model"><p><strong>Possibly wrong:</strong> every summary is labelled “AI draft” and each sentence links to the message it came from. Agents can edit before saving; the original thread is always one click away. A “Report a problem” control logs the ticket ID into the weekly review sample.</p>
<p><strong>Slow or down:</strong> if no summary arrives within 4 seconds, show “Summary unavailable, read the thread” and don't retry automatically. Ticket handling never waits on the model.</p>
<p><strong>Never:</strong> include card numbers or passwords from the thread; state that an action (refund, cancellation) happened unless a system record confirms it.</p></div>
<ul class="task-rubric">
<li>Says how the agent can tell the summary is AI-generated and check it</li>
<li>Lets the agent correct or ignore the summary easily</li>
<li>Defines a timeout and a fallback that doesn't block the agent's work</li>
<li>Lists at least two must-never rules, including one about personal data</li>
<li>Connects reported problems back to the eval or review process</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Demo-driven specs.</strong> A great demo on five hand-picked inputs says little about the long tail of real ones.</li>
<li><strong>“AI-powered” as the value.</strong> Customers buy outcomes. Describe what the feature does for them.</li>
<li><strong>No owner for quality.</strong> Someone must own the eval set, the review sample and the decision to change models.</li>
<li><strong>Silent model updates.</strong> If you use a provider's latest alias, behaviour can change without a release. Pin versions where you can.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick an AI feature on your roadmap. Write ten real example inputs and, for each, what a good output must include and must never include. You've started the eval set, and you'll probably find the requirement was vaguer than you thought.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A better model will fix quality problems later.</dt><dd>Without an eval set you can't tell whether a new model is better. Define quality first; then models become a choice you can test.</dd>
<dt>High adoption means the feature is a success.</dt><dd>People may click and then rewrite everything. Measure edits, errors and outcomes, not only clicks.</dd>
<dt>AI features are cheap because the provider handles the infrastructure.</dt><dd>You pay per token on every use. Estimate cost per user per month before committing.</dd>
<dt>If the prompt says “never reveal card numbers”, the feature is safe.</dt><dd>Prompts can be ignored or bypassed. Enforce must-never rules in the system, and test them in the eval set.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Ask whether the problem needs AI at all before specifying an AI feature.</li>
<li>Quality is defined by an eval set of real inputs with must and must-never rules.</li>
<li>Design the wrong, slow and unavailable paths as carefully as the happy path.</li>
<li>Estimate cost per use and per user per month, and test a cheaper model against the eval set.</li>
<li>After launch, track edits, a reviewed error sample and the outcome metric, not just adoption.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">Which is the best acceptance criterion for an AI ticket summary?</p><ul>
<li data-fb="Not testable: who decides what “accurate” means, and on which tickets?">Summaries are clear, accurate and helpful for agents.</li>
<li data-fb="A preference score doesn't show whether summaries are correct.">Agents rate the summaries at least 4 out of 5 in a monthly satisfaction survey.</li>
<li data-fb="Right. Measurable, tied to real inputs, and names the worst error.">95% of a 60-ticket eval set meet every rule, with no data leaks.</li>
<li data-fb="Easy to meet and says nothing about correctness.">Summaries are shorter than the tickets they summarise.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">A summary costs $0.012 and agents use it 880 times a month. What's the monthly cost per agent?</p><ul>
<li data-fb="That assumes caching nobody measured; use the numbers given.">About $1.06, since most of the tokens are cached.</li>
<li data-fb="Right: 880 × $0.012 ≈ $10.56.">About $10.60, before any change to model or usage.</li>
<li data-fb="The output price is already included in the $0.012.">About $106, because output tokens cost five times more.</li>
<li data-fb="A rough estimate before launch is exactly what you need.">It can't be estimated until after launch.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">When should the eval set be re-run?</p><ul>
<li data-fb="Prompts, models and data change between releases.">Only once, just before the first launch.</li>
<li data-fb="By then the problem has already reached users.">Whenever several users complain in the same week.</li>
<li data-fb="Far too rare for something that changes every release.">Once a year, as part of the annual product and roadmap review cycle.</li>
<li data-fb="Right. Any of those can change behaviour.">Before launch and after any prompt, model or data change.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">The model doesn't respond within 4 seconds. What should the feature do?</p><ul>
<li data-fb="Right. The agent's work must never wait on the model.">Show that the summary is unavailable and let the agent carry on.</li>
<li data-fb="Retries can pile up cost and still leave the agent waiting.">Keep retrying quietly in the background until the summary eventually arrives.</li>
<li data-fb="That makes an optional aid a single point of failure.">Block the ticket until the summary is generated.</li>
<li data-fb="A summary of the wrong ticket is worse than none.">Show the summary from the customer's previous ticket instead.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">70% of agents used the summary in week one. What's missing before calling it a success?</p><ul>
<li data-fb="More adoption still doesn't tell you it works.">Getting the remaining 30% of agents to try it as well, so adoption is complete.</li>
<li data-fb="Speed matters, but it isn't evidence of value.">A faster response time, so agents don't have to wait.</li>
<li data-fb="Right. These show whether it helps, not just whether it's clicked.">Edit and discard rates, a reviewed error sample, and resolution time.</li>
<li data-fb="Liking it and it working are different questions.">A survey asking agents whether they like the feature.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Google for Developers, <a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Rules of Machine Learning</a>. Rule 1: don't be afraid to launch a product without machine learning.</li>
<li>Hamel Husain (2024), <a href="https://hamel.dev/blog/posts/evals/" target="_blank" rel="noopener">Your AI Product Needs Evals</a>. A practical account of building evaluation sets for AI features.</li>
<li>Google PAIR, <a href="https://pair.withgoogle.com/guidebook/" target="_blank" rel="noopener">People + AI Guidebook</a>. Patterns for deciding when AI fits and how to design around it.</li>

<li>Amershi et al. (2019), <a href="https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/" target="_blank" rel="noopener">Guidelines for Human-AI Interaction</a>. Tested guidelines for setting expectations, supporting correction and handling errors.</li>
<li>Anthropic, <a href="https://docs.anthropic.com/en/docs/test-and-evaluate/define-success" target="_blank" rel="noopener">Define your success criteria</a>. Writing specific, measurable criteria for model-based features.</li>
</ol></section>
`
});
