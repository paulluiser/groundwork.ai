GW.lesson({
  id: "delivery",
  lede: "Delivery leads keep work moving and keep people informed, and much of that is writing: status updates, meeting notes, risk logs, plans. AI can draft all of it. The risk is that a fluent draft smooths over exactly the uncertainty your stakeholders need to see.",
  outcomes: [
    "Draft status reports with AI where every statement traces back to a source.",
    "Check an AI status report against the board and catch overstated or invented claims.",
    "Capture meeting actions with AI without assigning work nobody agreed to.",
    "Use AI to break down and challenge estimates rather than to produce them."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Amplified optimism.</strong> AI drafts lean positive, and so do people under pressure. The combination is how surprises happen.</li>
<li><strong>Summaries of summaries.</strong> Each layer of AI summary loses nuance. Link to the source material in anything you forward.</li>
<li><strong>People data in prompts.</strong> Retrospective comments, 1:1 notes and HR matters need extra care about which tools they go into, if any.</li>
<li><strong>Agreeable risk reviews.</strong> “Is this plan solid?” invites yes. Ask what could go wrong instead (lesson 3).</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Generate this week's status update with the citation-rules brief above. Check every citation. Count how many statements you changed or removed, and note what kind of error each was: overstated, invented, or uncertainty turned into fact.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">An AI meeting summary says “Action: Dev to fix the export bug by Friday.” In the meeting, Dev said “I might be able to look at it.” What do you do?</p><ul>
<li data-fb="Right. Confirming owners and dates turns a draft into an agreed record, and avoids assigning work nobody accepted.">Correct it to match what was said, and confirm with Dev before sending.</li>
<li data-fb="The summary turned a maybe into a commitment, which can damage trust.">Send it; the summary is close enough.</li>
<li data-fb="Most of the summary is probably useful; fix the error.">Stop using AI summaries.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What's the best use of AI when your team needs to estimate a new integration?</p><ul>
<li data-fb="Its estimate isn't based on your team or codebase.">Ask it for an estimate in weeks and use that.</li>
<li data-fb="Averaging doesn't fix a missing basis.">Ask it three times and average the answers.</li>
<li data-fb="Right. It's good at breadth: listing work and risks. The numbers should come from your team's history.">Use it to list the work and risks, then estimate with your team's data from similar past work.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Sharma et al. (2023), <a href="https://arxiv.org/abs/2310.13548" target="_blank" rel="noopener">Towards Understanding Sycophancy in Language Models</a>. Why “is this plan solid?” tends to get a yes.</li>
<li>Flyvbjerg (2006), <a href="https://arxiv.org/abs/1302.3642" target="_blank" rel="noopener">From Nobel Prize to Project Management: Getting Risks Right</a>. Optimism bias and reference class forecasting.</li>
<li>Klein (2007), <a href="https://hbr.org/2007/09/performing-a-project-premortem" target="_blank" rel="noopener">Performing a Project Premortem</a>, Harvard Business Review.</li>
</ol></section>
`
});
