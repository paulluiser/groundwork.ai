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
  lede: "More and more product managers are asked to ship features that are themselves built on AI. These features behave differently from the rest of the product: they're sometimes wrong, they cost money per use, and they change when the model changes. That changes how you specify, launch and measure them.",
  outcomes: [
    "Decide whether a problem actually needs AI, or a simpler rule would do.",
    "Define quality with an eval set built from real examples, before launch.",
    "Specify how the product behaves when the AI is wrong, slow or unavailable.",
    "Plan for cost per use, and measure trust and correctness after launch, not only adoption."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Demo-driven specs.</strong> A great demo on five hand-picked inputs says little about the long tail of real ones.</li>
<li><strong>“AI-powered” as the value.</strong> Customers buy outcomes. Describe what the feature does for them.</li>
<li><strong>No owner for quality.</strong> Someone must own the eval set, the review sample and the decision to change models.</li>
<li><strong>Silent model updates.</strong> If you use a provider's latest alias, behaviour can change without a release. Pin versions where you can.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick an AI feature on your roadmap. Write ten real example inputs and, for each, what a good output must include and must never include. You've started the eval set, and you'll probably find the requirement was vaguer than you thought.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Which is the best acceptance criterion for an AI summary feature?</p><ul>
<li data-fb="Not testable: who decides what “high quality” is?">Summaries are high quality and accurate.</li>
<li data-fb="Right. It's measurable, tied to real examples, and names the errors that matter.">At least 95% of summaries on the agreed 100-meeting set list every agreed action and invent none.</li>
<li data-fb="A preference score doesn't tell you whether summaries are correct.">Users rate summaries at least 4 out of 5.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">When should you re-run the eval set?</p><ul>
<li data-fb="Too rare: prompts and models change between releases.">Only before the first launch.</li>
<li data-fb="Complaints come late and only from some users.">When users complain.</li>
<li data-fb="Right. Any of these can change behaviour.">Before launch, and after any change to the prompt, the model or the retrieved data.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">A feature is used by 70% of users in its first week. What's missing before you call it a success?</p><ul>
<li data-fb="Right. Trying isn't the same as trusting or benefiting.">Repeat use, how often outputs are discarded, and a reviewed sample for errors.</li>
<li data-fb="Adoption among the rest doesn't tell you if it helps.">Adoption among the remaining 30%.</li>
<li data-fb="Speed matters, but it doesn't tell you if the output is right.">Average response time.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Google for Developers, <a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Rules of Machine Learning</a>. Rule 1: don't be afraid to launch a product without machine learning.</li>
<li>Hamel Husain (2024), <a href="https://hamel.dev/blog/posts/evals/" target="_blank" rel="noopener">Your AI Product Needs Evals</a>. A practical account of building evaluation sets for AI features.</li>
<li>Google PAIR, <a href="https://pair.withgoogle.com/guidebook/" target="_blank" rel="noopener">People + AI Guidebook</a>. Patterns for deciding when AI fits and how to design around it.</li>
</ol></section>
`
});
