SPEC = dict(
file="05-checking-work.js",
reviewed="2026-11",
outcomes=["Write a proportionate check plan for an AI-assisted deliverable before you start."],
situation="""<p>It's 5 p.m. You have an AI-drafted quarterly report for leadership, a generated SQL query behind its headline number, and a one-line Slack reply to a customer. You have 30 minutes. You can't check everything equally, and you don't need to.</p>
<p>The skill this lesson teaches is deciding how much checking each piece deserves, doing the checks that actually catch errors, and noticing when you've stopped checking at all.</p>""",
warmup=dict(q="Which AI output deserves the most careful check?", a=3, opts=[
  ("A first draft of an internal brainstorming list for the team.", "Low stakes: mistakes are cheap and caught in discussion."),
  ("A rewrite of your own paragraph to make it shorter and clearer.", "You know the content, so errors are easy to spot."),
  ("Suggested names for an internal tool nobody outside will see.", "Little harm if the suggestions are poor."),
  ("A number that leadership will use to decide next year's budget.", "Right. High cost of error, and hard to notice once accepted."),
 ]),
sections="""<h2>The jagged frontier</h2>
<p>A field experiment with 758 consultants at Boston Consulting Group found that, on tasks within the model's capabilities, people using AI finished more tasks, faster and to higher quality. On a task chosen to sit just outside those capabilities, people using AI were noticeably less likely to get the right answer than those without it; they trusted fluent output that was wrong.[S1] The researchers called the boundary a “jagged frontier”: it isn't obvious from the outside which tasks fall on which side. That's the case for checking in proportion to the stakes, not to how confident the output sounds.</p>
<p>A 2025 survey of knowledge workers adds a second warning: the more people trusted AI, the less critical thinking they reported applying, while people more confident in their own expertise reported more.[S2] Checking is a habit that erodes quietly unless you build it into the work.</p>
<h2>Worked example: a check plan</h2>
<p>For the 5 p.m. pile, a check plan takes two minutes to write and decides where the 30 minutes go.</p>
<div class="tbl"><table><thead><tr><th>Item</th><th>Cost if wrong</th><th>Would we notice?</th><th>Check</th><th>Time</th></tr></thead><tbody>
<tr><td>Headline number from the generated query</td><td>High: budget decision</td><td>Unlikely</td><td>Reproduce last quarter's known figure with the same query; read the joins and filters; spot-check 10 rows</td><td>15 min</td></tr>
<tr><td>Report narrative</td><td>Medium</td><td>Partly</td><td>Check every number and named fact against the source; read the conclusions as claims needing evidence</td><td>10 min</td></tr>
<tr><td>Customer Slack reply</td><td>Medium</td><td>Customer will</td><td>Check any promise, date or policy statement; read it once as the customer</td><td>3 min</td></tr>
<tr><td>Speaker notes for the meeting</td><td>Low</td><td>Yes, live</td><td>Skim</td><td>2 min</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Half the time goes to one number</strong>, because it's high-stakes and nobody would catch an error later.</li>
<li><strong>Checks are specific actions</strong>, not “review carefully”: reproduce a known figure, check named facts, read as the recipient.</li>
<li><strong>Low-stakes items get a skim on purpose.</strong> Proportion is a skill, not a shortcut.</li>
</ul>
<h2>Your turn: write a check plan</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Plan the checks for an AI-assisted deliverable</span></div><div class="activity-b">
<p>Think of something you'll produce with AI help this week. List its parts, and for each: the cost if it's wrong, whether anyone would notice, the specific check you'll do, and roughly how long it takes.</p>
<div data-w="task" data-key="checking-plan">
<div class="task-model"><p><strong>Deliverable:</strong> a migration runbook drafted with an assistant.</p>
<ul>
<li><strong>Commands:</strong> high cost (production), unlikely to notice until run. Run every command in staging; check flags against the tool's docs. 30 min.</li>
<li><strong>Rollback steps:</strong> very high cost, only noticed in a crisis. Do a real rollback in staging. 20 min.</li>
<li><strong>Timings and estimates:</strong> medium. Compare with the last migration's actual timings. 5 min.</li>
<li><strong>Background explanation:</strong> low. Skim for anything wrong about our setup. 3 min.</li>
</ul></div>
<ul class="task-rubric">
<li>Breaks the deliverable into parts rather than checking it as a whole</li>
<li>Rates the cost of an error and the chance of noticing for each part</li>
<li>Names a specific check for each part, not just “review”</li>
<li>Spends the most time on high-cost, hard-to-notice parts</li>
<li>Gives low-stakes parts a deliberately light check</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 15-minute exercise.</strong> Before your next AI-assisted task, write a check plan in the format above. Afterwards, note which check actually found something. Over a few weeks, you'll learn where your checks pay off.</div>""",
myths=[
 ("If the output looks right, it probably is.", "Fluent output looks right whether or not it is. Appearance is the thing AI is best at."),
 ("Checking everything thoroughly is the safe approach.", "It isn't sustainable, so people end up checking nothing. Proportion keeps checking alive."),
 ("Asking a second AI to review is a check.", "It can catch some issues, but both can share the same blind spots. Check high-stakes facts against a source."),
 ("Experienced people don't need to check.", "Expertise makes checks faster and better, not unnecessary. Trust in AI tends to reduce checking for everyone."),
],
recap=[
 "Check in proportion to the cost of an error and how likely you are to notice it.",
 "Use specific checks: known answers, sources, tests, reading as the recipient.",
 "AI helps most inside its frontier and misleads most just outside it, and the edge isn't visible.",
 "Spend most of your checking time on high-cost, hard-to-notice parts.",
 "Write a two-minute check plan before you start, and note which checks pay off.",
],
checks=[
 dict(q="You have 30 minutes to check an AI-assisted report. Where should most of the time go?", a=2, opts=[
  ("Evenly across every section, so nothing is missed.", "Even spreading leaves the riskiest part under-checked."),
  ("On the prose, since that's what readers notice first.", "Readers notice prose; decisions rest on numbers."),
  ("On the number a decision rests on, which nobody else will re-check.", "Right. High cost and low chance of noticing."),
  ("On formatting, so the report looks credible.", "Looking credible isn't being correct."),
 ]),
 dict(q="What did the study of consultants find about tasks just outside the model's capabilities?", a=0, opts=[
  ("People using AI were less likely to get the right answer.", "Right. They trusted fluent output that was wrong."),
  ("People using AI were faster and more accurate on every task.", "That held inside the frontier, not outside it."),
  ("AI refused to answer when tasks were too hard for it.", "It answered fluently, which is the problem."),
  ("The difference between groups was too small to matter.", "The drop in accuracy was substantial."),
 ]),
 dict(q="Which is a specific check rather than a vague one?", a=3, opts=[
  ("Review the query carefully before sending the report.", "“Carefully” isn't an action."),
  ("Make sure the numbers in the table look reasonable.", "Reasonable-looking is what wrong numbers also do."),
  ("Ask the assistant whether it is confident in the result.", "Its confidence isn't evidence."),
  ("Re-run the query for last quarter and match the dashboard.", "Right. A known answer tests the method."),
 ]),
 dict(q="A 2025 survey found that greater trust in AI was associated with what?", a=1, opts=[
  ("More time spent verifying outputs against sources.", "The opposite was reported."),
  ("Less critical thinking applied to the work.", "Right. Trust tended to reduce reported critical thinking."),
  ("Higher measured accuracy on every task.", "The survey measured reported effort, not accuracy."),
  ("Fewer people choosing to use AI tools at work.", "It didn't find that."),
 ]),
 dict(q="Which item can reasonably get only a quick skim?", a=0, opts=[
  ("Speaker notes you'll correct live if something's off.", "Right. Low cost, and you'll notice errors as you speak."),
  ("Rollback steps in a production migration runbook.", "Very high cost, and only noticed in a crisis."),
  ("A refund amount promised in a customer email.", "Money and promises to customers need checking."),
  ("A figure in the board pack that drives a budget decision.", "High cost, and unlikely to be re-checked by anyone."),
 ]),
],
sources=[
 'Dell\'Acqua et al. (2023), <a href="https://www.hbs.edu/faculty/Pages/item.aspx?num=64700" target="_blank" rel="noopener">Navigating the Jagged Technological Frontier</a>. Harvard Business School field experiment with 758 BCG consultants.',
 'Lee et al., Microsoft Research and Carnegie Mellon (2025), <a href="https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/" target="_blank" rel="noopener">The Impact of Generative AI on Critical Thinking</a>. Survey of 319 knowledge workers (CHI 2025).',
],
)
