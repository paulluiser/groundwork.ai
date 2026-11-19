GW.lesson({
  id: "project-management",
  lede: "Delivery leads keep a team's work flowing. Project managers own the plan around it: the schedule, the budget, the scope, the contracts and the commitments made to sponsors and clients. AI can draft every document that involves. It can't own a single date in them.",
  outcomes: [
    "Decide which project management tasks to hand to AI, which to check, and which to keep.",
    "Check an AI-drafted schedule summary against the plan and the calendar, and catch arithmetic and dependency errors.",
    "Use AI to assess a change request without letting it make the commitment.",
    "Read an AI summary of a contract or statement of work critically, clause by clause."
  ],
  html: String.raw`
<h2>Where AI meets project management work</h2>
<p>This lesson builds on lesson 30, which covers status reports, meeting actions and estimates. Here the focus is what a project manager answers for: dates, money, scope and agreements.</p>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting a project brief or charter from kickoff notes</td><td><span class="fit good">Good fit</span></td><td>Fast structure: goals, scope, stakeholders, assumptions. Check that nothing undecided appears as decided.</td></tr>
<tr><td>Breaking scope into work packages</td><td><span class="fit good">Good fit</span></td><td>Names work that's easy to forget: data migration, training, decommissioning. Check every package against the agreed scope, in both directions.</td></tr>
<tr><td>Keeping a <a class="term" data-t="raid-log">RAID log</a> current from notes and emails</td><td><span class="fit good">Good fit</span></td><td>Good at spotting risks, assumptions, issues and decisions in prose. Confirm owners and dates with the people named.</td></tr>
<tr><td>Tailoring one update for sponsor, steering group and team</td><td><span class="fit good">Good fit</span></td><td>Same facts, different framing. Check that bad news wasn't softened on the way.</td></tr>
<tr><td>Schedule summaries, <a class="term" data-t="critical-path">critical path</a> and dates</td><td><span class="fit care">Use with care</span></td><td>Date arithmetic and dependencies are where models slip (lesson 3). Recalculate in your scheduling tool, with the real calendar.</td></tr>
<tr><td>Budget forecasts and burn rates</td><td><span class="fit care">Use with care</span></td><td>Explaining variance is useful; the numbers must come from a spreadsheet or finance system, not from the model.</td></tr>
<tr><td>Summarising contracts and statements of work</td><td><span class="fit care">Use with care</span></td><td>A summary is a reading aid. Obligations, deadlines and penalties must be checked against the clause text, and legal advice comes from legal.</td></tr>
<tr><td>Approving change requests, invoking contingency, committing dates to a client</td><td><span class="fit human">Keep human</span></td><td>These are commitments with money and trust attached. AI can lay out options; you and the sponsor decide.</td></tr>
</tbody></table></div>

<h2>Worked example: checking a schedule summary</h2>
<p>A project manager is moving a support team to a new ticketing system. The plan is in a scheduling tool. They paste the task list into an assistant and ask: <em>“Summarise the schedule for the steering group: go-live date, critical path, and where we have slack.”</em></p>
<p>The answer is fluent and well organised. It is also the kind of output where one wrong date travels a long way: into the steering pack, the client's calendar, the vendor's contract.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the schedule summary</span></div><div class="activity-b">
<p>The plan is shown first. Durations are in working days. Flag every sentence in the summary you would not send to the steering group as written, then reveal the review. You can work the dates out by hand; that's the point.</p>
<div data-w="claims" data-cfg="pm-schedule"></div>
</div></div>

<p>How to check any AI-drafted schedule, step by step:</p>
<ol class="steps">
<li><strong>Recalculate, don't read</strong>Put the tasks into your scheduling tool or a spreadsheet and let it compute dates. A model predicts what a date should look like; it doesn't count working days.</li>
<li><strong>Apply the real calendar</strong>Public holidays, the team's leave, part-time people, change freezes. The model can't know them unless you supply them, and even then may not apply them.<sup>[1]</sup></li>
<li><strong>Walk the dependencies</strong>For each task, ask what must finish first. Claims about what is or isn't on the critical path are easy to check and often wrong.</li>
<li><strong>Find the third-party claims</strong>Anything about what a vendor, client or another team has agreed needs a source: an email, a contract, a minute.</li>
<li><strong>Express dates as ranges where they are uncertain</strong>Projects overrun far more often than they finish early,<sup>[2]</sup> and people consistently underestimate how long their own work will take.<sup>[4]</sup> Single dates invite false confidence. Report the date the plan gives, and the risk around it.</li>
</ol>
<div class="key"><p>Let AI write about the schedule. Let the scheduling tool calculate it. Never send a date that only the model has computed.</p></div>

<h2>Change requests: options, not decisions</h2>
<p>A <a class="term" data-t="change-request">change request</a> is where scope, time and money meet. AI is genuinely useful here for breadth: listing what a change touches, drafting the impact assessment template, writing up options for the sponsor. Its weakness is the same as with status reports in lesson 30: it leans toward the reassuring answer.</p>
<div class="draft prompt"><div class="draft-h"><span><b>Request</b></span><span>change impact</span></div><div class="draft-b">The client wants SMS notifications added to the new ticketing system. Assess the impact on our project.</div></div>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · impact assessment</span></div><div class="draft-b"><p>Adding SMS notifications is a small, well-understood change. Most ticketing platforms support SMS through a standard integration, so this should take 2 to 3 days and can be absorbed within the existing timeline and budget.</p></div>
<div class="review">
<div class="r"><span class="stamp warn">Typical, not ours</span><span>“Most platforms support it” is a statement about platforms in general. Ours may need a paid add-on or a separate SMS provider.</span></div>
<div class="r"><span class="stamp bad">Commitment</span><span>“Can be absorbed” is a decision about our contingency, made by a model that has never seen it.</span></div>
<div class="r"><span class="stamp warn">Missing</span><span>No mention of consent for texting customers, message costs, or testing. The non-coding work is what usually gets forgotten.</span></div>
</div></div>
<p>A better request gives the model your plan and constraints, and asks for options rather than a verdict:</p>
<div class="draft prompt"><div class="draft-h"><span><b>Request</b></span><span>options for the sponsor</span></div><div class="draft-b">Context: [plan summary with critical path], [remaining contingency: 4 days, £6,000], [vendor's product sheet], [our customer contact policy].

The client wants SMS notifications added. Don't estimate effort; the team will do that.
1. List everything this change could touch, including non-technical work (consent, costs, support scripts, testing).
2. List questions we must answer before estimating.
3. Draft three options for the sponsor: include now and move go-live; include now and add people; defer to release 2. For each, list what we'd need to know to choose.</div></div>
<p>Then you get the estimate from the team, re-run the schedule, and take the options to the sponsor. The model widened your thinking; the people accountable made the call.</p>

<h2>Contracts and statements of work</h2>
<p>A <a class="term" data-t="statement-of-work">statement of work</a> defines who does what, by when, and what counts as done. Summaries help you find your way around a long document. But a summary compresses, and compression is exactly where obligations go missing: “the supplier will migrate data” loses “provided the customer supplies it cleansed, in the agreed format, by week 2”.</p>
<p>Habits that keep summaries safe:</p>
<ul>
<li><strong>Ask for clause references.</strong> “For each obligation, quote the clause number and the exact sentence.” Then check the quotes against the document, as you would any citation (lesson 3).</li>
<li><strong>Ask specifically about your side.</strong> “List every obligation on the customer, with deadlines.” Your own obligations are the ones that cause disputes when missed.</li>
<li><strong>Read acceptance, payment and termination in full.</strong> These are short and consequential. Don't rely on any summary for them.</li>
<li><strong>Check the data rules first.</strong> Contracts are often confidential. Use only tools your organisation has approved for them (lesson 8), and route legal questions to legal.</li>
</ul>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Who does this task?</span></div><div class="activity-b">
<p>For each project task, decide how much of it to hand to AI. Then check your answers.</p>
<div data-w="sort" data-cfg="pm-tasks"></div>
</div></div>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Computed-looking dates.</strong> A date in a fluent paragraph looks calculated. Unless a tool calculated it, it wasn't.</li>
<li><strong>Softened bad news.</strong> Asking AI to make an update “suitable for executives” can turn “will miss” into “may see minor delays”. Models lean toward the agreeable version.<sup>[3]</sup> Compare the facts before and after.</li>
<li><strong>Invented agreements.</strong> “The vendor has confirmed…” and “the client has agreed…” are the most damaging sentences to get wrong. Each one needs a source.</li>
<li><strong>Confidential material in the wrong tool.</strong> Contracts, budgets and commercial terms belong only in approved tools.</li>
<li><strong>A plan nobody owns.</strong> An AI-generated plan that the team didn't build is a plan the team doesn't believe. Use AI to draft, then build the real plan with the people doing the work.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take your current project plan. Ask an assistant for a summary of the go-live date, the critical path and the tasks with the most slack. Then check each statement against your scheduling tool and calendar. Note which kinds of errors appeared: date arithmetic, dependencies, holidays, or invented facts. That list tells you where to look first next time.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An assistant summarising your plan says go-live is “Friday 14 May”. Where should that date come from before it goes into a steering pack?</p><ul>
<li data-fb="Asking again gets you another prediction, not a calculation.">From the assistant, after asking it to double-check.</li>
<li data-fb="Right. The scheduling tool counts working days and applies the calendar; the model only predicts what a date should look like.">From your scheduling tool, with holidays and leave applied.</li>
<li data-fb="The team's sense of the date is useful input, but the plan must be calculated.">From whatever date the team feels is realistic.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An AI impact assessment says a change request “can be absorbed within the existing timeline”. What is the main problem?</p><ul>
<li data-fb="Length isn't the issue; the claim is.">The assessment is too short.</li>
<li data-fb="The wording is fine; what it claims is not something the model can know.">It should have used more formal language.</li>
<li data-fb="Right. Whether contingency can absorb it depends on your plan, the team's estimate and the sponsor's choices. The model has none of those.">It makes a commitment about your schedule and contingency that the model has no basis for.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">You ask for a summary of a 40-page statement of work. Which follow-up request makes it most useful to check?</p><ul>
<li data-fb="Right. Clause references and exact quotes let you verify each obligation in the source, and your own obligations are the ones that cause disputes.">“List every obligation on us, the customer, with the clause number and the exact sentence.”</li>
<li data-fb="Shorter summaries lose more of the conditions that matter.">“Make the summary shorter.”</li>
<li data-fb="It may well say yes. Fairness is a judgment for you and legal, using the actual text.">“Is this contract fair to us?”</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>GOV.UK, <a href="https://www.gov.uk/bank-holidays" target="_blank" rel="noopener">UK bank holidays</a>. An example of the calendar data a schedule needs and a model may not apply.</li>
<li>Flyvbjerg (2014), <a href="https://arxiv.org/abs/1409.0003" target="_blank" rel="noopener">What You Should Know About Megaprojects and Why</a>. Evidence that cost and schedule overruns are the norm, not the exception.</li>
<li>Sharma et al. (2023), <a href="https://arxiv.org/abs/2310.13548" target="_blank" rel="noopener">Towards Understanding Sycophancy in Language Models</a>. Why assistants lean toward the answer the person seems to want.</li>
<li>Buehler, Griffin and Ross (1994), <a href="https://doi.org/10.1037/0022-3514.67.3.366" target="_blank" rel="noopener">Exploring the “planning fallacy”</a>. People predict their own tasks will finish sooner than they do.</li>
</ol></section>
`
});
