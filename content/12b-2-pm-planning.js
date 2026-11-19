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
  lede: "A plan is a set of commitments built on estimates. AI can draft a work breakdown, sequence tasks and spot gaps in minutes. What it can't do is know how long your team takes, which dependencies are real, or how optimistic everyone is being. This lesson covers planning with AI while keeping the plan owned by the people who'll deliver it.",
  outcomes: [
    "Use AI to draft work breakdowns and sequences from your own inputs.",
    "Spot durations and dates in an AI plan that nobody actually estimated.",
    "Give estimates and dates as ranges, using how similar projects actually went.",
    "Use AI to check a schedule for gaps, clashes and hidden dependencies."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Fitting the plan to the hoped-for date.</strong> If you mention the deadline, the plan will meet it. Ask for the plan first.</li>
<li><strong>Polish as confidence.</strong> A Gantt chart drawn in seconds looks as solid as one built over weeks.</li>
<li><strong>Calendar blind spots.</strong> Holidays, leave, change freezes and month-end close are easy to miss.</li>
<li><strong>Supplier dates copied from contracts.</strong> The SOW says what was agreed; the supplier's current plan says what will happen.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Take your current plan and mark every duration with who estimated it. For anything without a name, ask the person doing the work for a range. Note how many numbers change.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An AI-drafted plan says testing will take two weeks. What should you ask first?</p><ul>
<li data-fb="Formatting won't tell you where the number came from.">Whether the plan is formatted for the steering group.</li>
<li data-fb="Right. A duration nobody estimated is a placeholder.">Who estimated it, and whether the testers agree.</li>
<li data-fb="Another model's guess is still a guess.">Whether a different model gives the same number.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why can mentioning your target date make an AI plan less reliable?</p><ul>
<li data-fb="Right. Assistants tend to fit the answer to what you seem to want.">The assistant tends to bend the plan to meet it.</li>
<li data-fb="Models handle dates; the issue is agreement.">Models can't read dates.</li>
<li data-fb="It doesn't change the plan's length.">The plan becomes too long.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What's the best basis for contingency?</p><ul>
<li data-fb="A flat figure isn't based on this project.">A standard 10% on every plan.</li>
<li data-fb="That's a guess with a source attached.">Whatever the assistant recommends.</li>
<li data-fb="Right. Specific risks and real history are evidence.">The listed risks and how similar projects actually went.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Buehler, Griffin and Ross (1994), <a href="https://doi.org/10.1037/0022-3514.67.3.366" target="_blank" rel="noopener">Exploring the “planning fallacy”</a>. People predict their own tasks will finish sooner than they do.</li>
<li>Flyvbjerg (2014), <a href="https://arxiv.org/abs/1409.0003" target="_blank" rel="noopener">What You Should Know About Megaprojects and Why</a>. Cost and schedule overruns are the norm, not the exception.</li>
</ol></section>
`
});
