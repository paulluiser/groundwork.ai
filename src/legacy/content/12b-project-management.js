GW.lesson({
  id: "project-management",
  reviewed: "2026-11",
  lede: "Delivery leads keep a team's work flowing. Project managers own the plan around it: the schedule, the budget, the scope, the contracts and the commitments made to sponsors and clients. AI can draft every document that involves. It can't own a single date in them.",
  outcomes: [
    "Decide which project management tasks to hand to AI, which to check, and which to keep.",
    "Check an AI-drafted schedule summary against the plan and the calendar, and catch arithmetic and dependency errors.",
    "Use AI to assess a change request without letting it make the commitment.",
    "Read an AI summary of a contract or statement of work critically, clause by clause.",
    "Prepare a change request with options and impacts, leaving the decision with the sponsor."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>The client asks for single sign-on to be added before go-live, six weeks away. By lunchtime an assistant has drafted a change request: scope, a two-week estimate, a cost and a recommendation to accept. It's well written, and it would commit your team to a date and a price nobody on the team has looked at.</p>
<p>Project managers own commitments. AI can prepare everything around a commitment quickly. This lesson is about keeping the commitment itself in the hands of the people who'll have to keep it.</p></div>
<div class="check warmup" data-a="0"><p class="q">An assistant drafts a change request with an estimate and a recommendation. What should happen before it goes to the sponsor?</p><ul>
<li data-fb="Right. Estimates belong to the people doing the work.">The team that will do the work reviews the estimate and impacts.</li>
<li data-fb="Sponsors often accept confident numbers.">Send it now, since the sponsor will push back if anything in it is wrong.</li>
<li data-fb="Padding a guess is still a guess.">Add a contingency of 20% to the AI's estimate and send it.</li>
<li data-fb="The estimate still needs the team's input.">Remove the recommendation and send the rest unchanged.</li>
</ul></div>
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

<h2>Change requests: options, impacts, decision</h2>
<p>A good change request makes the decision easy to take and hard to misunderstand. It sets out what's being asked, two or three options (including not doing it, or doing less), the impact of each on scope, schedule, cost and risk, and who decides by when. An assistant is excellent at drafting the structure and listing impacts you might miss. The numbers come from the team, and the decision comes from the sponsor.</p>
<h2>Worked example: the SSO request</h2>
<div class="tbl"><table><thead><tr><th>Option</th><th>Schedule</th><th>Cost</th><th>Risk</th></tr></thead><tbody>
<tr><td>A. Add SSO before go-live</td><td>Go-live moves 3 weeks (team estimate, including security review)</td><td>+€42k</td><td>Identity provider configuration depends on the client's IT team</td></tr>
<tr><td>B. Go live on time; add SSO in a release 6 weeks later</td><td>No change to go-live</td><td>+€38k</td><td>Users create passwords first, then migrate to SSO</td></tr>
<tr><td>C. Don't add SSO in this contract</td><td>No change</td><td>None</td><td>Client may not adopt widely without SSO</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>The AI draft had one option and a two-week estimate.</strong> The team's estimate, including the security review, was three.</li>
<li><strong>Option B is often the one sponsors choose</strong>, and it wasn't in the draft at all.</li>
<li><strong>Risks name dependencies outside the team</strong>, like the client's IT configuration, which an assistant couldn't know.</li>
</ul>
<h2>Your turn: write a change request</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Options for a late scope change</span></div><div class="activity-b">
<p>Two weeks before launch, a sponsor asks for the reporting dashboard to support exports to Excel. Write the change request: the request, at least three options with schedule, cost and risk impacts (invent reasonable numbers and say where they'd come from), and who decides by when.</p>
<div data-w="task" data-key="pm-change">
<div class="task-model"><p><strong>Request:</strong> Excel export from the reporting dashboard before launch on 30 May.</p>
<ul>
<li><strong>A. Full Excel export before launch:</strong> launch moves 1 week (dev estimate, to confirm with the team); +€9k; risk: untested formatting edge cases.</li>
<li><strong>B. CSV export before launch, Excel after:</strong> no launch change; +€3k now, +€7k later; risk: some users find CSV awkward.</li>
<li><strong>C. Launch as planned; add export in the next release:</strong> no change; +€8k later; risk: early users ask support for exports.</li>
</ul>
<p><strong>Decision:</strong> sponsor, by Friday, so the team can plan the final sprint. Estimates to be confirmed by the dev lead on Wednesday.</p></div>
<ul class="task-rubric">
<li>States the request and the deadline clearly</li>
<li>Offers at least three options, including a smaller or later version</li>
<li>Shows schedule, cost and risk for each option</li>
<li>Says where each estimate comes from and who confirms it</li>
<li>Names the decision-maker and a decision date</li>
</ul>
</div></div></div>
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

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI estimates are unbiased because they don't have stakes.</dt><dd>They reflect typical projects in training data, not your team, and people plan optimistically anyway.[4]</dd>
<dt>A recommendation helps the sponsor decide.</dt><dd>It can anchor them. Present options and impacts; recommend only after the team agrees.</dd>
<dt>Contract summaries from AI are reliable.</dt><dd>They miss obligations and invent clauses. Read the clauses that matter yourself, with legal for anything binding.</dd>
<dt>Schedules only need checking at the milestone level.</dt><dd>Calendars, holidays and dependencies are where AI schedules go wrong.[1]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>AI drafts structure and lists impacts; the team owns estimates and the sponsor decides.</li>
<li>Change requests set out options, including smaller and later ones.</li>
<li>Show schedule, cost and risk for each option, with sources for the numbers.</li>
<li>Read binding contract clauses yourself; don't rely on summaries.</li>
<li>Check calendars, holidays and dependencies in any AI-built schedule.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">Which change request is most useful to a sponsor?</p><ul>
<li data-fb="No real choice, and an unchecked number.">One option with an AI estimate and a strong recommendation.</li>
<li data-fb="Explains, but doesn't help decide.">A detailed explanation of why the change is technically difficult for the team.</li>
<li data-fb="Right. A real choice with checked numbers.">Three options with team estimates for schedule, cost and risk.</li>
<li data-fb="Gives the sponsor nothing to decide between.">A request for more budget without specific options.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Where should estimates in a change request come from?</p><ul>
<li data-fb="Typical projects aren't your team.">The assistant, since it has seen many similar projects.</li>
<li data-fb="Right. They own the estimate.">The team who will do the work, with their assumptions stated.</li>
<li data-fb="Budget isn't an estimate of effort.">The sponsor, since they know the budget and what the client will accept for this change.</li>
<li data-fb="The plan didn't include this change.">The original project plan, unchanged.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">An assistant summarises a 40-page contract. What should you do before relying on it?</p><ul>
<li data-fb="It can't verify its own coverage.">Ask the assistant to confirm the summary is complete.</li>
<li data-fb="Organisation doesn't mean accuracy.">Check the summary is well organised.</li>
<li data-fb="Never outsource reading your own contract.">Share it with the client and ask them to confirm the summary is accurate.</li>
<li data-fb="Right. Binding terms need direct reading.">Read the clauses on scope, payment and liability yourself.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why can a recommendation in a change request be a problem?</p><ul>
<li data-fb="Right. Present options first.">It can anchor the sponsor before they've weighed the options.</li>
<li data-fb="They are; timing matters.">Sponsors aren't allowed to receive recommendations under most governance rules.</li>
<li data-fb="Length isn't the issue.">Recommendations make documents too long.</li>
<li data-fb="They can, easily.">AI tools can't write recommendations.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which detail in an AI-generated schedule most often needs checking?</p><ul>
<li data-fb="Cosmetic.">The colour coding of the task bars, so phases are easy to tell apart.</li>
<li data-fb="Cosmetic.">The order of the column headings.</li>
<li data-fb="Right. These are where dates go wrong.">Holidays, availability and dependencies between tasks.</li>
<li data-fb="Cosmetic.">The font used for task names.</li>
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
