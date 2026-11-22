GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["ai-schedule"] = {
  label: "AI-drafted plan for a CRM migration",
  source: '<b>What you gave the assistant</b> The project brief, a list of 22 work packages from the kickoff workshop, team names and availability, and the supplier\'s statement of work.<br><b>What you asked</b> “Draft a schedule with milestones and a go-live date.”',
  claims: [
    { t: "The work breakdown has 22 packages across five phases, matching the kickoff list.", v: "ok", why: "Checkable against the workshop output. Look for packages it merged or quietly renamed." },
    { t: "Data migration will take 3 weeks.", v: "none", why: "Nobody estimated this. The model picked a typical-sounding number. Ask the people doing the migration, and get a range." },
    { t: "Go-live: Monday 29 March 2027.", v: "bad", why: "A single date with no range, and in the UK that's Easter Monday, a bank holiday. Calendar facts and uncertainty both need checking." },
    { t: "User training can run in parallel with system testing.", v: "partial", why: "Possible, but training needs a stable system and the same trainers are on the test team. A dependency the plan doesn't show." },
    { t: "The supplier delivers the integration layer by week 6, as per the statement of work.", v: "ok", why: "Matches the SOW you supplied. Confirm the supplier still agrees; contract dates and real plans drift." },
    { t: "With a 10% contingency, the plan is low risk.", v: "judg", why: "A flat 10% isn't based on anything about this project. Projects like this routinely overrun. Size contingency from the risks and from how similar projects went." }
  ],
  after: "AI can structure a plan quickly. Durations, dates and confidence must come from the people doing the work, the calendar, and how similar projects actually went."
};
GW.lesson({
  id: "pm-planning",
  reviewed: "2026-11",
  lede: "A plan is a set of commitments built on estimates. AI can draft a work breakdown, sequence tasks and spot gaps in minutes. What it can't do is know how long your team takes, which dependencies are real, or how optimistic everyone is being. This lesson covers planning with AI while keeping the plan owned by the people who'll deliver it.",
  outcomes: [
    "Use AI to draft work breakdowns and sequences from your own inputs.",
    "Spot durations and dates in an AI plan that nobody actually estimated.",
    "Give estimates and dates as ranges, using how similar projects actually went.",
    "Use AI to check a schedule for gaps, clashes and hidden dependencies.",
    "Use a reference class to sanity-check an AI-drafted plan's total duration."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>An assistant drafts a migration plan in ten minutes: 34 tasks, dependencies, and a total of 11 weeks. It looks thorough. Your last three migrations of similar size took 16, 19 and 22 weeks.</p>
<p>The plan isn't wrong in its parts; it's optimistic in the way every bottom-up plan is, because it adds up what each task should take if nothing goes wrong. This lesson is about using AI to build plans fast and history to keep them honest.</p></div>
<div class="check warmup" data-a="3"><p class="q">An AI-drafted plan says 11 weeks. Your three similar past projects took 16, 19 and 22. What should you do?</p><ul>
<li data-fb="Bottom-up plans tend to be optimistic.">Trust the plan, since it was built task by task.</li>
<li data-fb="Mixing methods doesn't fix the bias.">Average the plan with the past projects to get roughly 17 weeks.</li>
<li data-fb="Far smaller than the gap history shows.">Add 10% contingency to the 11 weeks.</li>
<li data-fb="Right. Past outcomes are the best guide to this one.">Treat history as the baseline and explain any difference.</li>
</ul></div>
<h2>Where AI helps with planning</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting a work breakdown from your notes</td><td><span class="fit good">Good fit</span></td><td>Turns workshop notes into structure fast. Check nothing was merged, dropped or invented.</td></tr>
<tr><td>Checking a plan for gaps and clashes</td><td><span class="fit good">Good fit</span></td><td>Finds people double-booked, missing handovers and tasks with no owner. Confirm each finding.</td></tr>
<tr><td>Listing risks and assumptions</td><td><span class="fit good">Good fit</span></td><td>A useful prompt list for a <a class="term" data-t="raid-log">RAID log</a>. Owners and ratings come from the team.</td></tr>
<tr><td>Sequencing and the <a class="term" data-t="critical-path">critical path</a></td><td><span class="fit care">Use with care</span></td><td>Logic is often right; dependencies are often incomplete. Use scheduling software for the maths.</td></tr>
<tr><td>Estimating durations</td><td><span class="fit care">Use with care</span></td><td>Produces plausible numbers with no basis. Estimates come from the people doing the work.</td></tr>
<tr><td>Committing to a date</td><td><span class="fit human">Keep human</span></td><td>A promise with consequences. Someone accountable makes it, with the range in view.</td></tr>
</tbody></table></div>

<h2>Why plans run late, with or without AI</h2>
<p>People are reliably optimistic about their own work. In the classic study of the planning fallacy, students finished their theses well after their own predictions, and later than their own worst-case estimates too.<sup>[1]</sup> At the other end of the scale, Bent Flyvbjerg's research on large projects finds that cost and schedule overruns are the norm, not the exception.<sup>[2]</sup></p>
<p>AI doesn't fix this, and can make it worse. Ask an assistant for a duration and you'll get a typical-sounding number with no connection to your team. Tell it the date you hope for and it will tend to find a way to fit (lesson 3). A plan that looks finished and professional is harder to question than a rough one, so made-up numbers survive longer.</p>

<h2>Worked example: a migration plan</h2>
<p>You gave an assistant the brief, the kickoff work packages, team availability and the supplier's statement of work, and asked for a schedule. It produced a neat plan with a go-live date.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the plan before it goes to the steering group</span></div><div class="activity-b">
<p>Flag every statement you wouldn't commit to as written.</p>
<div data-w="claims" data-cfg="ai-schedule"></div>
</div></div>

<ol class="steps">
<li><strong>Durations appeared that nobody estimated</strong>For each task, ask: who gave this number? If the answer is “the assistant”, it's a placeholder.</li>
<li><strong>A single date hid the uncertainty, and a holiday</strong>Give a range. Check calendars, leave and bank holidays with real data.</li>
<li><strong>A shared resource made a hidden dependency</strong>Tasks that can run in parallel on paper may need the same people.</li>
<li><strong>Contingency was a flat percentage</strong>Size it from the risks you've listed and from how similar projects went.</li>
</ol>
<div class="key"><p>Let AI build the structure. Every number in the plan should have a name next to it: the person who estimated it.</p></div>

<h2>Estimates the team owns</h2>
<ul>
<li><strong>Ask for ranges.</strong> Likely, optimistic and pessimistic for the uncertain tasks. An assistant can then combine them, but the inputs are the team's.</li>
<li><strong>Use history.</strong> How long did the last migration actually take, compared with its plan? That ratio is evidence; a model's guess isn't.</li>
<li><strong>Run a pre-mortem.</strong> Imagine the project ran six months late and ask why. An assistant can help generate reasons; the team decides which are real.</li>
<li><strong>Re-plan openly.</strong> When an estimate changes, update the plan and say why. Don't quietly absorb it into contingency.</li>
</ul>

<h2>The outside view</h2>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Fitting the plan to the hoped-for date.</strong> If you mention the deadline, the plan will meet it. Ask for the plan first.</li>
<li><strong>Polish as confidence.</strong> A Gantt chart drawn in seconds looks as solid as one built over weeks.</li>
<li><strong>Calendar blind spots.</strong> Holidays, leave, change freezes and month-end close are easy to miss.</li>
<li><strong>Supplier dates copied from contracts.</strong> The SOW says what was agreed; the supplier's current plan says what will happen.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Take your current plan and mark every duration with who estimated it. For anything without a name, ask the person doing the work for a range. Note how many numbers change.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A detailed plan is an accurate plan.</dt><dd>Detail adds tasks; it doesn't add the delays that always happen. Check the total against history.</dd>
<dt>AI estimates are calibrated because they've seen many projects.</dt><dd>They describe typical tasks, not your organisation's pace, approvals and interruptions.</dd>
<dt>Padding every task is a good way to add contingency.</dt><dd>Padding gets consumed. Hold contingency at the project level, based on history.</dd>
<dt>This project is different, so history doesn't apply.</dt><dd>Every project feels different. Start from history, then adjust for specific differences.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>AI plans are an inside view: useful for breakdowns, optimistic in total.</li>
<li>Start from how long similar projects took, then adjust for real differences.</li>
<li>Look at where past projects overran and add those tasks explicitly.</li>
<li>Present ranges with the assumptions that move them.</li>
<li>Let the team own the estimates for their own tasks.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">What is the planning fallacy?</p><ul>
<li data-fb="Right. A well-documented bias.">People underestimate their own tasks even knowing past ones ran late.</li>
<li data-fb="Not the definition.">AI tools always overestimate how long individual tasks take, which cancels out human optimism.</li>
<li data-fb="Plans are useful; their totals need correcting.">Plans are always wrong, so planning is pointless.</li>
<li data-fb="Not the definition.">Estimates get worse the more tasks a plan contains.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What does reference class forecasting start from?</p><ul>
<li data-fb="That's the inside view.">A detailed breakdown of every task in the plan.</li>
<li data-fb="A target, not a forecast.">The sponsor's preferred deadline.</li>
<li data-fb="Right. The outside view.">How long similar past projects actually took.</li>
<li data-fb="Still inside views.">The average of several AI-generated plans.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Past projects overran on data cleansing and sign-offs. What should you do with the AI plan?</p><ul>
<li data-fb="History says these overruns recur.">Leave it, since this project might be different.</li>
<li data-fb="Right. Put the usual delays in the plan.">Add explicit tasks and time for cleansing and sign-off cycles.</li>
<li data-fb="Spreads contingency where it gets consumed.">Pad every task in the plan by 20%, so each one has its own buffer built in.</li>
<li data-fb="Hides the risk.">Remove those tasks to keep the plan short.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">How should a plan's duration be presented to a steering group?</p><ul>
<li data-fb="Optimistic and falsely precise.">As the AI's total, rounded to the nearest week.</li>
<li data-fb="Ignores genuine differences.">As the longest past project, to be safe.</li>
<li data-fb="A target isn't a forecast.">As whatever date the sponsor requested.</li>
<li data-fb="Right. Honest and actionable.">As a range with the assumptions that move it.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Where is contingency best held?</p><ul>
<li data-fb="Right. Visible and not consumed by every task.">At the project level, sized from history.</li>
<li data-fb="Tends to get used up.">Inside every task estimate, hidden from view.</li>
<li data-fb="Every plan meets surprises.">Nowhere: a good plan needs none.</li>
<li data-fb="It doesn't.">With the AI tool, which adjusts automatically.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Buehler, Griffin and Ross (1994), <a href="https://doi.org/10.1037/0022-3514.67.3.366" target="_blank" rel="noopener">Exploring the “planning fallacy”</a>. People predict their own tasks will finish sooner than they do.</li>
<li>Flyvbjerg (2014), <a href="https://arxiv.org/abs/1409.0003" target="_blank" rel="noopener">What You Should Know About Megaprojects and Why</a>. Cost and schedule overruns are the norm, not the exception.</li>
</ol></section>
`
});
