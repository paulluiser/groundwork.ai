SPEC = dict(
file="12b-2-pm-planning.js",
reviewed="2026-11",
outcomes=["Use a reference class to sanity-check an AI-drafted plan's total duration."],
situation="""<p>An assistant drafts a migration plan in ten minutes: 34 tasks, dependencies, and a total of 11 weeks. It looks thorough. Your last three migrations of similar size took 16, 19 and 22 weeks.</p>
<p>The plan isn't wrong in its parts; it's optimistic in the way every bottom-up plan is, because it adds up what each task should take if nothing goes wrong. This lesson is about using AI to build plans fast and history to keep them honest.</p>""",
warmup=dict(q="An AI-drafted plan says 11 weeks. Your three similar past projects took 16, 19 and 22. What should you do?", a=3, opts=[
  ("Trust the plan, since it was built task by task.", "Bottom-up plans tend to be optimistic."),
  ("Average the plan with the past projects to get 17 weeks.", "Mixing methods doesn't fix the bias."),
  ("Add 10% contingency to the 11 weeks.", "Far smaller than the gap history shows."),
  ("Treat history as the baseline and explain any difference.", "Right. Past outcomes are the best guide to this one."),
 ]),
sections="""<h2>The outside view</h2>
<p>People estimating their own tasks consistently underestimate, even when they know past tasks ran late; this is the planning fallacy.[1] Reference class forecasting corrects it by starting from how long similar projects actually took (the outside view), then adjusting for genuine differences.[2] AI-drafted plans are a pure inside view: they add up the tasks they can imagine. Use them for the breakdown; use your history for the total.</p>
<h2>Worked example: reconciling a plan with history</h2>
<div class="tbl"><table><thead><tr><th>Source</th><th>Duration</th><th>Notes</th></tr></thead><tbody>
<tr><td>AI bottom-up plan</td><td>11 weeks</td><td>34 tasks, no allowance for rework, approvals or availability</td></tr>
<tr><td>Reference class: 3 similar migrations</td><td>16–22 weeks (median 19)</td><td>Overruns came from data cleansing and sign-off delays</td></tr>
<tr><td>Adjusted plan</td><td><strong>17–21 weeks</strong></td><td>Added data cleansing (3 weeks), client sign-off cycles (2 weeks), and holiday cover; one genuine difference: a tool we've used before saves about 1 week</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>The breakdown was useful.</strong> It found tasks; it just missed the ones that always run late.</li>
<li><strong>History told you where to look</strong>: data cleansing and sign-offs.</li>
<li><strong>A range is honest.</strong> 17–21 weeks is a commitment you can keep; 11 weeks is one you'd have to explain later.</li>
</ul>
<h2>Your turn: sanity-check a plan</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Check an AI plan against history</span></div><div class="activity-b">
<p>An assistant planned a website relaunch at 8 weeks. You find four past relaunches: 10, 12, 14 and 18 weeks; the longest involved a new content system, which this one also has. Write what you'd present to the steering group and why.</p>
<div data-w="task" data-key="pm-reference">
<div class="task-model"><p><strong>Estimate: 13–17 weeks</strong>, target 14.</p>
<p><strong>Why:</strong> four similar relaunches took 10–18 weeks (median 13). This one includes a new content system, like the 18-week project, so we expect the upper half of the range. The 8-week task plan is a useful breakdown but leaves out content migration, stakeholder reviews and launch fixes, which took 3–5 weeks in past projects.</p>
<p><strong>What would shorten it:</strong> content owners named and available from week 2; reviews limited to two rounds.</p></div>
<ul class="task-rubric">
<li>Starts from the historical range rather than the AI total</li>
<li>Adjusts for a genuine difference (the new content system)</li>
<li>Presents a range, not a single date</li>
<li>Names what the AI plan left out</li>
<li>Says what would make the shorter end possible</li>
</ul>
</div></div></div>""",
myths=[
 ("A detailed plan is an accurate plan.", "Detail adds tasks; it doesn't add the delays that always happen. Check the total against history."),
 ("AI estimates are calibrated because they've seen many projects.", "They describe typical tasks, not your organisation's pace, approvals and interruptions."),
 ("Padding every task is a good way to add contingency.", "Padding gets consumed. Hold contingency at the project level, based on history."),
 ("This project is different, so history doesn't apply.", "Every project feels different. Start from history, then adjust for specific differences."),
],
recap=[
 "AI plans are an inside view: useful for breakdowns, optimistic in total.",
 "Start from how long similar projects took, then adjust for real differences.",
 "Look at where past projects overran and add those tasks explicitly.",
 "Present ranges with the assumptions that move them.",
 "Let the team own the estimates for their own tasks.",
],
checks=[
 dict(q="What is the planning fallacy?", a=0, opts=[
  ("People underestimate their own tasks even knowing past ones ran late.", "Right. A well-documented bias."),
  ("AI tools always overestimate how long tasks take.", "Not the definition."),
  ("Plans are always wrong, so planning is pointless.", "Plans are useful; their totals need correcting."),
  ("Estimates get worse the more tasks a plan contains.", "Not the definition."),
 ]),
 dict(q="What does reference class forecasting start from?", a=2, opts=[
  ("A detailed breakdown of every task in the plan.", "That's the inside view."),
  ("The sponsor's preferred deadline.", "A target, not a forecast."),
  ("How long similar past projects actually took.", "Right. The outside view."),
  ("The average of several AI-generated plans.", "Still inside views."),
 ]),
 dict(q="Past projects overran on data cleansing and sign-offs. What should you do with the AI plan?", a=1, opts=[
  ("Leave it, since this project might be different.", "History says these overruns recur."),
  ("Add explicit tasks and time for cleansing and sign-off cycles.", "Right. Put the usual delays in the plan."),
  ("Pad every task by 20%.", "Spreads contingency where it gets consumed."),
  ("Remove those tasks to keep the plan short.", "Hides the risk."),
 ]),
 dict(q="How should a plan's duration be presented to a steering group?", a=3, opts=[
  ("As the AI's total, rounded to the nearest week.", "Optimistic and falsely precise."),
  ("As the longest past project, to be safe.", "Ignores genuine differences."),
  ("As whatever date the sponsor requested.", "A target isn't a forecast."),
  ("As a range with the assumptions that move it.", "Right. Honest and actionable."),
 ]),
 dict(q="Where is contingency best held?", a=0, opts=[
  ("At the project level, sized from history.", "Right. Visible and not consumed by every task."),
  ("Inside every task estimate, hidden from view.", "Tends to get used up."),
  ("Nowhere: a good plan needs none.", "Every plan meets surprises."),
  ("With the AI tool, which adjusts automatically.", "It doesn't."),
 ]),
],
)
