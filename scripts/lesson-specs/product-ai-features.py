SPEC = dict(
file="08-3-product-ai-features.js",
reviewed="2026-11",
outcomes=["Estimate monthly cost per user for an AI feature and decide whether it pays for itself."],
situation="""<p>Leadership wants an “AI summary” button on every customer ticket by next quarter. The demo looked great: five hand-picked tickets, five crisp summaries. You own the spec. Nobody has said what a good summary is, what happens when one is wrong, or what each click costs.</p>
<p>Those three gaps sink more AI features than the model does. This lesson turns them into a spec your team can build, test and afford.</p>""",
warmup=dict(q="A demo of an AI feature works well on five examples. What does that tell you?", a=1, opts=[
  ("The feature is ready for a limited launch to real customers.", "Five chosen examples say little about the long tail of real inputs."),
  ("That it can work, but not how often it works on real inputs.", "Right. You need a larger, realistic set to know the failure rate."),
  ("The model is accurate enough to skip a human review step.", "Five successes don't establish an error rate."),
  ("That users will trust the feature once it ships.", "Trust depends on how it behaves when it's wrong, which the demo didn't show."),
 ]),
sections="""<h2>Worked example: an eval set for ticket summaries</h2>
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
<li><strong>The pass rate is the requirement:</strong> “At least 95% of the 60 tickets meet every rule, and none breaks a must-never rule involving personal data.”[S2]</li>
</ul>
<h2>Designing for when it's wrong</h2>
<p>Guidelines for human-AI interaction recommend making clear what the system can do and how well, supporting efficient correction, and making it easy to dismiss or ignore suggestions.[S1] For the summary button, that means: label the summary as AI-generated, link each statement to the message it came from, let agents edit before saving, and never let the summary replace the ticket history. Google's People + AI Guidebook adds a useful habit: decide in advance what users should do when the output is wrong, and design that path as carefully as the happy one.[3]</p>
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
</div></div></div>""",
myths=[
 ("A better model will fix quality problems later.", "Without an eval set you can't tell whether a new model is better. Define quality first; then models become a choice you can test."),
 ("High adoption means the feature is a success.", "People may click and then rewrite everything. Measure edits, errors and outcomes, not only clicks."),
 ("AI features are cheap because the provider handles the infrastructure.", "You pay per token on every use. Estimate cost per user per month before committing."),
 ("If the prompt says “never reveal card numbers”, the feature is safe.", "Prompts can be ignored or bypassed. Enforce must-never rules in the system, and test them in the eval set."),
],
recap=[
 "Ask whether the problem needs AI at all before specifying an AI feature.",
 "Quality is defined by an eval set of real inputs with must and must-never rules.",
 "Design the wrong, slow and unavailable paths as carefully as the happy path.",
 "Estimate cost per use and per user per month, and test a cheaper model against the eval set.",
 "After launch, track edits, a reviewed error sample and the outcome metric, not just adoption.",
],
checks=[
 dict(q="Which is the best acceptance criterion for an AI ticket summary?", a=2, opts=[
  ("Summaries are clear, accurate and helpful for agents.", "Not testable: who decides what “accurate” means, and on which tickets?"),
  ("Agents rate summaries at least 4 out of 5 in a survey.", "A preference score doesn't show whether summaries are correct."),
  ("95% of a 60-ticket eval set meet every rule, with no data leaks.", "Right. Measurable, tied to real inputs, and names the worst error."),
  ("Summaries are shorter than the tickets they summarise.", "Easy to meet and says nothing about correctness."),
 ]),
 dict(q="A summary costs $0.012 and agents use it 880 times a month. What's the monthly cost per agent?", a=1, opts=[
  ("About $1.06, since most of the tokens are cached.", "That assumes caching nobody measured; use the numbers given."),
  ("About $10.60, before any change to model or usage.", "Right: 880 × $0.012 ≈ $10.56."),
  ("About $106, because output tokens cost five times more.", "The output price is already included in the $0.012."),
  ("It can't be estimated until after launch.", "A rough estimate before launch is exactly what you need."),
 ]),
 dict(q="When should the eval set be re-run?", a=3, opts=[
  ("Only once, just before the first launch.", "Prompts, models and data change between releases."),
  ("Whenever several users complain in the same week.", "By then the problem has already reached users."),
  ("Once a year, as part of the annual product review.", "Far too rare for something that changes every release."),
  ("Before launch and after any prompt, model or data change.", "Right. Any of those can change behaviour."),
 ]),
 dict(q="The model doesn't respond within 4 seconds. What should the feature do?", a=0, opts=[
  ("Show that the summary is unavailable and let the agent carry on.", "Right. The agent's work must never wait on the model."),
  ("Keep retrying in the background until the summary arrives.", "Retries can pile up cost and still leave the agent waiting."),
  ("Block the ticket until the summary is generated.", "That makes an optional aid a single point of failure."),
  ("Show the summary from the customer's previous ticket instead.", "A summary of the wrong ticket is worse than none."),
 ]),
 dict(q="70% of agents used the summary in week one. What's missing before calling it a success?", a=2, opts=[
  ("Getting the remaining 30% of agents to try it as well.", "More adoption still doesn't tell you it works."),
  ("A faster response time, so agents don't have to wait.", "Speed matters, but it isn't evidence of value."),
  ("Edit and discard rates, a reviewed error sample, and resolution time.", "Right. These show whether it helps, not just whether it's clicked."),
  ("A survey asking agents whether they like the feature.", "Liking it and it working are different questions."),
 ]),
],
sources=[
 'Amershi et al. (2019), <a href="https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/" target="_blank" rel="noopener">Guidelines for Human-AI Interaction</a>. Tested guidelines for setting expectations, supporting correction and handling errors.',
 'Anthropic, <a href="https://docs.anthropic.com/en/docs/test-and-evaluate/define-success" target="_blank" rel="noopener">Define your success criteria</a>. Writing specific, measurable criteria for model-based features.',
],
)
