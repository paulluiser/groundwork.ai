GW.lesson({
  id: "delivery",
  reviewed: "2026-11",
  lede: "Delivery leads keep work moving and keep people informed, and much of that is writing: status updates, meeting notes, risk logs, plans. AI can draft all of it. The risk is that a fluent draft smooths over exactly the uncertainty your stakeholders need to see.",
  outcomes: [
    "Draft status reports with AI where every statement traces back to a source.",
    "Check an AI status report against the board and catch overstated or invented claims.",
    "Capture meeting actions with AI without assigning work nobody agreed to.",
    "Use AI to break down and challenge estimates rather than to produce them.",
    "Write a status update in which every claim about progress traces to the board or a named person."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>It's Friday at 4 p.m. and the weekly status report is due. An assistant connected to the board drafts it in a minute: “Sprint on track. Payments integration progressing well. No major risks.” It reads like every status report you've ever approved.</p>
<p>The payments integration has been blocked for six days waiting on the vendor's sandbox. The board shows it; the draft doesn't, because “progressing well” is the most typical thing to write. This lesson is about status reports that tell the truth early.</p></div>
<div class="check warmup" data-a="2"><p class="q">What's the main risk of an AI-drafted status report?</p><ul>
<li data-fb="Length is easy to fix.">It will be too long for stakeholders to read.</li>
<li data-fb="Formatting is a minor issue.">It will use the wrong template or headings.</li>
<li data-fb="Right. Blockers and slips get smoothed over.">It fills gaps with the most typical story, usually “on track”.</li>
<li data-fb="Possible, but not the main risk here.">It will reveal confidential information to the wrong stakeholders by accident.</li>
</ul></div>
<h2>Where AI meets delivery work</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Rewriting an update for a different audience</td><td><span class="fit good">Good fit</span></td><td>Same facts, new framing: exec summary, team detail, customer note. Check nothing changed meaning.</td></tr>
<tr><td>Meeting summaries and action items</td><td><span class="fit good">Good fit</span></td><td>Big time saver. Confirm owners and dates with the people named. Get consent before recording.</td></tr>
<tr><td>Risk brainstorming and pre-mortems</td><td><span class="fit good">Good fit</span></td><td>Surfaces generic risks you might forget. You judge which apply.</td></tr>
<tr><td>Status reports from board exports and notes</td><td><span class="fit care">Use with care</span></td><td>Fast draft; tends to overstate progress. Trace every claim; set the status colour yourself.</td></tr>
<tr><td>Mapping dependencies from tickets</td><td><span class="fit care">Use with care</span></td><td>Finds links in text; misses unwritten ones. Confirm with the teams.</td></tr>
<tr><td>Retrospective theme synthesis</td><td><span class="fit care">Use with care</span></td><td>Protect anonymity; don't paste named comments into tools the team didn't agree to.</td></tr>
<tr><td>Producing estimates</td><td><span class="fit human">Keep human</span></td><td>It doesn't know your team, codebase or history. Use it to break work down; estimate with your data.</td></tr>
<tr><td>Feedback on individuals' performance</td><td><span class="fit human">Keep human</span></td><td>A decision about a person (lesson 8).</td></tr>
</tbody></table></div>

<h2>Worked example: the weekly status report</h2>
<p>It's Thursday 5 December. You export the payments team's board, paste in your notes from stand-up, and ask an assistant for a weekly status update for stakeholders. The draft reads well. Your job is to check it against the sources before it goes up the chain.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the status report against the board</span></div><div class="activity-b">
<p>The board export and your notes are shown first. Flag every sentence in the AI draft that the sources don't support. Then reveal the review.</p>
<div data-w="claims" data-cfg="status-report"></div>
</div></div>

<p>Why the draft drifted the way it did:</p>
<ul>
<li><strong>“On track” is the typical status update.</strong> Most status reports in the world say things are on track, so that's the plausible continuation, especially when the request doesn't ask about risk.</li>
<li><strong>Unresolved became resolved.</strong> “Sam to confirm” turned into “has been moved”. Models compress uncertainty into statements because statements are what reports usually contain.</li>
<li><strong>A gap got filled.</strong> “Scheduled for Monday” appears nowhere in the sources. It's the kind of detail that makes an update feel complete.</li>
</ul>
<p>A brief that prevents most of this:</p>
<div class="draft prompt"><div class="draft-h"><span><b>Request</b></span></div><div class="draft-b">Draft a weekly status update for the payments stakeholders from the board export and notes below.

Rules:
- Every statement must cite a ticket ID or "notes". If you can't cite it, don't say it.
- Don't state an overall status colour; I'll set it.
- Lead with risks and decisions needed, then progress.
- Keep anything unconfirmed explicitly unconfirmed.

End with a section "Unknowns" listing anything the sources leave open.

[board export]
[notes]</div></div>
<p>Then check each citation, set the status yourself (here: amber or red, because the launch date depends on a review with no date), and lead with the ask: <em>“We need a security review date by Monday to hold 12 December.”</em></p>
<div class="key"><p>A status report is a judgment about risk, signed by you. Let AI assemble the facts; never let it choose the colour.</p></div>

<h2>Meeting notes and actions</h2>
<p>Transcription and summary tools are one of the most immediately useful AI features for delivery work. Three habits keep them trustworthy:</p>
<ol class="steps">
<li><strong>Ask before recording</strong>Tell attendees and get agreement, following your organisation's policy. Some conversations shouldn't be recorded at all.</li>
<li><strong>Check owners and dates</strong>Summaries often turn “someone should look at this” into “Priya will look at this by Friday”. Assigning work to people who didn't agree to it damages trust quickly.</li>
<li><strong>Send for confirmation</strong>“Here are the decisions and actions I captured. Reply by end of day if anything is wrong.” This turns the AI draft into an agreed record.</li>
</ol>

<h2>Estimates: break down, don't predict</h2>
<p>Ask an assistant “how long will it take to add Apple Pay?” and you'll get a confident range. It's anchored on what such projects typically involve, not on your codebase, your team, your payment provider or your other commitments. Projects are already prone to optimistic estimates; research on forecasting recommends anchoring on how long similar past projects actually took, known as reference class forecasting.<sup>[2]</sup></p>
<p>Use AI for the parts of estimating where breadth helps:</p>
<ul>
<li><strong>Decompose.</strong> “List the work involved in adding Apple Pay to an existing web checkout, including non-coding work.” It will name things teams forget: merchant registration, domain verification, test devices, refund flows, analytics, support documentation, rollout plan.</li>
<li><strong>Challenge.</strong> “Here's our plan and estimate. What would make this take twice as long?”</li>
<li><strong>Run a pre-mortem.</strong> “Imagine it's three months from now and this project failed. Write the most likely reasons.” Pre-mortems help teams surface risks they hesitate to raise.<sup>[3]</sup></li>
</ul>
<p>Then estimate with your team, using your own history: how long did the last integration of this size take?</p>

<h2>Red, amber, green with reasons</h2>
<p>A status colour is a judgement, and judgements need reasons someone can check. Agree what each colour means before anyone writes a report: for example, green means the next milestone date holds with no unresolved blockers; amber means a blocker or slip exists with a recovery plan; red means the milestone will move without a decision from someone outside the team. Then every colour in a report needs a sentence tying it to the board.</p>
<h2>Worked example: the Friday report</h2>
<div class="worked">
<div class="wx"><b>AI draft</b><div><p><strong>Overall: Green.</strong> Sprint on track. Payments integration progressing well. Team velocity stable. No major risks.</p></div></div>
<div class="wx strong"><b>After checking the board</b><div><p><strong>Overall: Amber.</strong> 14 of 22 stories done; checkout redesign on track for 3 April.</p><p><strong>Payments integration: blocked 6 days</strong> (PAY-212) on the vendor's sandbox access. Escalated to their account manager Tuesday; no date yet. If not resolved by 26 March, the 3 April launch moves.</p><p><strong>Decision needed:</strong> launch without card wallets, or move the date. Owner: Priya, by Wednesday.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>“Progressing well” became “blocked 6 days”</strong>, with the ticket and the escalation.</li>
<li><strong>Amber, with the rule that would make it red</strong> (the 26 March date).</li>
<li><strong>A decision, an owner and a deadline.</strong> Reports that ask for nothing rarely get help.</li>
<li><strong>Every claim can be checked</strong> on the board in a minute. That's the test for any status line.</li>
</ul>
<h2>Your turn: rewrite a status update</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Make this status update honest</span></div><div class="activity-b">
<p>The board shows: 9 of 20 stories done with 3 days left in the sprint; the data migration story has failed testing twice; the designer is on leave next week; the release date is in 10 days. The AI draft says: <em>“Good progress this sprint. Migration nearly complete. Team in good shape for the release.”</em> Rewrite it.</p>
<div data-w="task" data-key="delivery-status">
<div class="task-model"><p><strong>Overall: Amber.</strong> 9 of 20 stories done with 3 days left; we expect to carry over about 6.</p>
<p><strong>Data migration:</strong> failed testing twice (duplicate customer records). Fix in progress; retest Thursday. It's on the critical path for the release in 10 days.</p>
<p><strong>Design:</strong> designer on leave next week; two release stories still need final designs. Asking Sam to cover reviews.</p>
<p><strong>Decision needed by Friday:</strong> confirm the release date, or release without the migration and run it the following week. Owner: product lead.</p></div>
<ul class="task-rubric">
<li>Gives an honest status colour with a reason</li>
<li>Uses numbers from the board instead of “good progress”</li>
<li>Names the migration failures and their effect on the date</li>
<li>Flags the designer's leave as a risk with a mitigation</li>
<li>Asks for a specific decision with an owner and a deadline</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Amplified optimism.</strong> AI drafts lean positive, and so do people under pressure. The combination is how surprises happen.</li>
<li><strong>Summaries of summaries.</strong> Each layer of AI summary loses nuance. Link to the source material in anything you forward.</li>
<li><strong>People data in prompts.</strong> Retrospective comments, 1:1 notes and HR matters need extra care about which tools they go into, if any.</li>
<li><strong>Agreeable risk reviews.</strong> “Is this plan solid?” invites yes. Ask what could go wrong instead (lesson 3).</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Generate this week's status update with the citation-rules brief above. Check every citation. Count how many statements you changed or removed, and note what kind of error each was: overstated, invented, or uncertainty turned into fact.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI status reports are objective because they read the board.</dt><dd>They read the board and write the most typical summary. Blockers often get smoothed into “progressing”.</dd>
<dt>Green is the safe default when nothing is clearly wrong.</dt><dd>Green is a claim. It needs the same evidence as amber or red.</dd>
<dt>Reporting problems early looks bad.</dt><dd>Early amber with a plan builds trust; late red destroys it.</dd>
<dt>A premortem is pessimism.</dt><dd>It's a structured way to surface risks people are reluctant to raise.[3]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>AI drafts fill gaps with “on track”; check every claim against the board.</li>
<li>Agree what red, amber and green mean before writing reports.</li>
<li>Use numbers and ticket references, not adjectives.</li>
<li>Name blockers, their effect on dates, and the trigger for red.</li>
<li>Ask for a specific decision with an owner and a deadline.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">The AI draft says “payments progressing well”, but the ticket has been blocked for six days. What should the report say?</p><ul>
<li data-fb="Right. Specific, checkable and honest.">That it's blocked, since when, why, and what's been done.</li>
<li data-fb="Hides a blocker on the critical path.">That it's progressing, since work continues elsewhere.</li>
<li data-fb="Omitting a blocker misleads by silence.">Nothing about payments, to keep the report short.</li>
<li data-fb="Vague risk statements don't get help.">That it's at risk, without giving details, so stakeholders don't become alarmed.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">What should a status colour be based on?</p><ul>
<li data-fb="Feelings vary; rules don't.">How confident the team feels about the release.</li>
<li data-fb="It picks the typical colour.">Whatever colour the AI assistant suggests.</li>
<li data-fb="Inertia hides gradual slips.">Last week's colour, unless something changed a lot.</li>
<li data-fb="Right. Then colours mean the same thing every week.">A rule agreed in advance, applied to the board.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Which status line is most useful to a sponsor?</p><ul>
<li data-fb="Pleasant but not actionable.">“Team is working hard and morale is good.”</li>
<li data-fb="Right. A decision, options, an owner and a date.">“Decision needed by Wednesday: cut wallets or move the date. Owner: Priya.”</li>
<li data-fb="Says nothing specific.">“Several risks across payments, design and the vendor relationship are being monitored closely this week.”</li>
<li data-fb="Not tied to the milestone.">“Velocity is within the normal range.”</li>
</ul></div>
<div class="check" data-a="2"><p class="q">9 of 20 stories are done with 3 days left. How should the report describe it?</p><ul>
<li data-fb="Hides a likely carry-over.">“Good progress this sprint.”</li>
<li data-fb="Inaccurate.">“Sprint nearly complete.”</li>
<li data-fb="Right. Numbers and a forecast.">“9 of 20 done with 3 days left; expect to carry over about 6.”</li>
<li data-fb="Vague cause, no numbers.">“Sprint slightly behind this week due to unexpected technical complexity in several stories.”</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why ask an assistant to list blockers separately before drafting the summary?</p><ul>
<li data-fb="Right. Separate lists resist the typical narrative.">So blockers can't be smoothed into the overall story.</li>
<li data-fb="Not the reason.">Because blockers are easier for the model to find in the board's data.</li>
<li data-fb="Length isn't the goal.">To make the report longer and more thorough.</li>
<li data-fb="They read the summary too.">Because stakeholders only read the blockers.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Sharma et al. (2023), <a href="https://arxiv.org/abs/2310.13548" target="_blank" rel="noopener">Towards Understanding Sycophancy in Language Models</a>. Why “is this plan solid?” tends to get a yes.</li>
<li>Flyvbjerg (2006), <a href="https://arxiv.org/abs/1302.3642" target="_blank" rel="noopener">From Nobel Prize to Project Management: Getting Risks Right</a>. Optimism bias and reference class forecasting.</li>
<li>Klein (2007), <a href="https://hbr.org/2007/09/performing-a-project-premortem" target="_blank" rel="noopener">Performing a Project Premortem</a>, Harvard Business Review.</li>
</ol></section>
`
});
