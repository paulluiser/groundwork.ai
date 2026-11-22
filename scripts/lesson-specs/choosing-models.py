SPEC = dict(
file="03b-choosing-models.js",
reviewed="2026-11",
outcomes=["Compare two models on your own examples, with cost, speed and quality side by side."],
situation="""<p>Your team uses the largest model available for everything: classifying tickets, drafting replies, reviewing code and summarising meetings. The monthly bill has tripled, the ticket classifier takes four seconds per ticket, and someone asks whether a smaller model would do. Nobody knows, because nobody has tried.</p>
<p>Choosing a model isn't about finding the best one. It's about finding the cheapest, fastest one that passes your tests for each task. This lesson shows how to make that comparison yourself.</p>""",
warmup=dict(q="A leaderboard ranks Model A above Model B. What does that tell you about your task?", a=1, opts=[
  ("Model A will be more accurate on your task as well.", "Leaderboards measure their own tasks, which may not resemble yours."),
  ("Not much until you test both on examples from your work.", "Right. Public rankings are a starting point, not an answer."),
  ("Model B is cheaper, so it must be the weaker of the two.", "Price and quality aren't reliably linked for a given task."),
  ("Model A will also be faster at answering your requests.", "Rankings usually measure quality, not speed."),
 ]),
sections="""<h2>Reading public comparisons</h2>
<p>Public leaderboards are useful for building a shortlist. Some compare models on quality, speed and price together across many providers;[S1] others rank models by human preference in blind side-by-side votes. Each measures something real, and none measures your task. A model that tops a general benchmark can be worse at classifying your support tickets than one half its price. Use rankings to choose two or three candidates, then test those on your own examples.</p>
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
<div class="aside"><strong>A 30-minute exercise.</strong> Take ten examples from one AI task you already run. Try them on a smaller, cheaper model with the same prompt. Count how many results you'd accept. If it's nine or ten, you may be paying for capacity you don't need.</div>""",
myths=[
 ("The most capable model is always the safest choice.", "It's often slower and far more expensive, and may be no better on simple tasks. Test the cheaper option first."),
 ("A reasoning model is better for everything.", "Reasoning helps on multi-step problems and costs time and tokens. For classification or rewriting, it's often wasted."),
 ("Once we pick a model, the decision is made.", "Providers update and retire models. Keep your test examples so you can re-check in minutes."),
 ("Benchmarks tell you which model is best.", "They tell you which is best at the benchmark. Your examples tell you which is good enough for you."),
],
recap=[
 "There's no single best model; there's the cheapest one that passes your tests for each task.",
 "Use public rankings to shortlist, then test on 30 to 100 of your own examples.",
 "Compare quality, speed and cost together, and decide what “good enough” means first.",
 "A better prompt or a few examples can close the gap more cheaply than a bigger model.",
 "Keep your test set; re-run it whenever a model, price or prompt changes.",
],
checks=[
 dict(q="Two models score 94% and 91% on your 100 test tickets. The second is 14 times cheaper. What's the sensible next step?", a=3, opts=[
  ("Choose the first model, since higher accuracy always wins.", "Not if the difference is small and fixable, and the cost is 14 times higher."),
  ("Choose the second model without any further changes.", "Possible, but first see whether the errors can be fixed cheaply."),
  ("Ask a third model to decide which of the two is better.", "That adds a guess, not evidence."),
  ("Look at where the cheaper model fails, and try fixing it with the prompt.", "Right. Targeted examples often close a small gap."),
 ]),
 dict(q="When is a reasoning model most worth its extra time and cost?", a=0, opts=[
  ("For multi-step problems like planning or tricky debugging.", "Right. That's where step-by-step reasoning pays off."),
  ("For sorting short messages into a handful of fixed categories.", "Usually wasted: a small model often does this well."),
  ("For rewriting a paragraph in a friendlier, more casual tone.", "A simple language task; reasoning adds little."),
  ("For any task where the output will be shown to customers.", "Visibility doesn't make a task need reasoning."),
 ]),
 dict(q="How many examples make a reasonable first comparison for one task?", a=2, opts=[
  ("Three, chosen to show each model at its best.", "Too few, and chosen to flatter rather than test."),
  ("Several thousand, so the result is statistically certain.", "Overkill for a first decision; you can expand later."),
  ("Thirty to a hundred real ones, including hard cases.", "Right. Enough to see patterns, quick to build."),
  ("However many the model provider suggests in its docs.", "The provider doesn't know your task."),
 ]),
 dict(q="Why keep your test examples after choosing a model?", a=1, opts=[
  ("Providers require them for billing and usage audits.", "No such requirement exists."),
  ("Models change, so you can re-check quickly when they do.", "Right. Re-testing takes minutes instead of days."),
  ("They can be used to train the model on your data later.", "Possible, but not the main reason to keep them."),
  ("They prove to leadership that the chosen model was the best.", "They prove it was good enough, which is what matters."),
 ]),
 dict(q="Which is the best use of a public model leaderboard?", a=3, opts=[
  ("Choosing the top-ranked model for every task the team has.", "The top model may be overkill and expensive for most tasks."),
  ("Proving to stakeholders which model is objectively the best.", "Rankings measure their own tasks, not yours."),
  ("Replacing your own testing when time is short.", "That's when rankings mislead most."),
  ("Building a shortlist of two or three candidates to test yourself.", "Right. Shortlist publicly, decide privately."),
 ]),
],
sources=[
 '<a href="https://artificialanalysis.ai/" target="_blank" rel="noopener">Artificial Analysis</a>. Independent comparisons of models on quality, output speed and price across providers.',
],
)
