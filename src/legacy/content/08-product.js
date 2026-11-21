GW.lesson({
  id: "product",
  lede: "Product managers turn messy evidence into decisions other people act on. AI is good at organising messy evidence and risky at making the decisions. This lesson shows where that line sits in everyday product work.",
  outcomes: [
    "Sort common product tasks into good fit, use with care, and keep human-owned.",
    "Synthesise customer research with AI while keeping every claim traceable to evidence.",
    "Check an AI research summary against its sources and spot overstated claims.",
    "Draft acceptance criteria with AI that engineering and QA can actually test."
  ],
  html: String.raw`
<h2>Where AI meets product work</h2>
<p>Most product work falls into three kinds: gathering evidence (interviews, feedback, data, market), deciding (what to build, in what order, and what not to build), and communicating (specs, updates, release notes). AI helps a lot with the first and third, and needs a firm boundary around the second.</p>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Turning interview notes into themes</td><td><span class="fit care">Use with care</span></td><td>Fast first pass. Can overgeneralise or invent. Require quotes and participant IDs; check them.</td></tr>
<tr><td>Drafting a PRD, one-pager or user stories</td><td><span class="fit good">Good fit</span></td><td>Great for structure and completeness. You supply the decisions and the reasoning.</td></tr>
<tr><td>Writing acceptance criteria</td><td><span class="fit good">Good fit</span></td><td>Good at happy paths and common edge cases. Review with QA and engineering.</td></tr>
<tr><td>Categorising survey free text</td><td><span class="fit care">Use with care</span></td><td>Saves hours. Hand-check a random sample of 20 to confirm the categories hold.</td></tr>
<tr><td>Competitor and market research</td><td><span class="fit care">Use with care</span></td><td>Facts, prices and features may be stale or invented. Verify every number you'll repeat.</td></tr>
<tr><td>Defining metrics and writing queries</td><td><span class="fit care">Use with care</span></td><td>Pin the definition first; test with known data (lesson 6).</td></tr>
<tr><td>Stakeholder updates and release notes</td><td><span class="fit good">Good fit</span></td><td>You provide the facts; it provides a clear draft.</td></tr>
<tr><td>Prioritisation and roadmap trade-offs</td><td><span class="fit human">Keep human</span></td><td>AI can list considerations. It can't weigh your strategy, commitments or constraints. You decide.</td></tr>
<tr><td>Using AI “personas” as research evidence</td><td><span class="fit human">Keep human</span></td><td><a class="term" data-t="synthetic-users">Synthetic users</a> generate typical-sounding opinions, not evidence about your customers.<sup>[1]</sup></td></tr>
</tbody></table></div>

<h2>Worked example: synthesising interviews</h2>
<p>You've run twelve customer interviews about reporting. You have twelve pages of notes and a planning meeting on Thursday. Here's how to use AI for the first pass without losing the thread back to the evidence.</p>
<ol class="steps">
<li><strong>Prepare the notes</strong>Remove names and companies; label each set of notes P1 to P12. Keep the notes as written; don't pre-summarise, or you'll lose the quotes. Use your organisation's approved tool (lesson 8).</li>
<li><strong>Write a brief that demands traceability</strong>Ask for themes, and for every theme: the participant IDs, verbatim quotes, a count, and any evidence <em>against</em> it.
<div class="draft prompt" style="margin:12px 0 0"><div class="draft-h"><span><b>Request</b></span></div><div class="draft-b">Research question: How do finance admins use our reports today, and where do they struggle?

Below are notes from 12 interviews, labelled P1 to P12.

Identify up to 6 themes. For each theme give:
- a one-sentence description
- which participants support it (IDs) and how many
- 1-2 verbatim quotes, copied exactly, with the participant ID
- any participants whose notes contradict it

Then list any notes or points that don't fit a theme.
Don't recommend solutions. Don't generalise beyond the participants.

[notes]</div></div></li>
<li><strong>Read the themes as hypotheses</strong>The output will look like a finished synthesis. Treat each theme as “this might be true; show me”.</li>
<li><strong>Check, in this order</strong>
<ul>
<li><strong>Quotes:</strong> search the notes for five quotes, word for word. A quote that doesn't appear is a fabrication; a quote attributed to the wrong participant breaks your counts.</li>
<li><strong>Counts:</strong> recount one theme yourself. “Most participants” resting on 3 of 12 is the most common overstatement.</li>
<li><strong>Doesn't-fit list:</strong> read it carefully. Models pull toward a tidy story, and the outliers are often where the insight is.</li>
<li><strong>Calibration:</strong> read three sets of notes in full yourself, so you know what the raw material feels like.</li>
</ul></li>
<li><strong>Decide</strong>Use the themes as a starting point. Write the final synthesis yourself, especially the “so what”. Note in the document that the first pass was AI-assisted and how you checked it.</li>
</ol>
<p>Why the brief is shaped this way: quotes and IDs make every claim traceable, counts expose overgeneralisation, and asking for contradictions works against the model's pull toward agreement and neat narratives (lesson 3).</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check a research summary against its sources</span></div><div class="activity-b">
<p>Here are four short interview excerpts, followed by an AI summary of them. Flag each summary sentence that isn't fully supported by the excerpts. Then reveal the review.</p>
<div data-w="claims" data-cfg="pm-synthesis"></div>
</div></div>

<h2>Worked example: acceptance criteria</h2>
<p>A user story is ready for refinement:</p>
<blockquote>As a finance admin, I want to schedule a report to be emailed every week, so that my director gets it without me having to remember.</blockquote>
<p>You ask the assistant for acceptance criteria in Given/When/Then form, plus edge cases and open questions. A typical draft:</p>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · acceptance criteria</span></div><div class="draft-b">
<p><b>AC1</b> Given I am a finance admin viewing a report, when I choose Schedule, then I can set a weekly day and time and add recipients.</p>
<p><b>AC2</b> Given an active schedule, when the scheduled time arrives, then the report is emailed as a PDF to all recipients.</p>
<p><b>AC3</b> Given I enter an invalid email address, when I save, then I see an error and the schedule isn't saved.</p>
<p><b>AC4</b> Given an active schedule, when I pause it, then no emails are sent until I resume it.</p>
<p><b>Open questions:</b> Which time zone is the schedule in? Can recipients be outside the organisation? What happens if the report has no data that week?</p></div>
<div class="review">
<div class="r"><span class="stamp ok">Useful</span><span>Solid happy path, a validation case, and three genuinely good questions.</span></div>
<div class="r"><span class="stamp bad">Missing</span><span><b>Permissions:</b> the director may not have access to all the data in the report. Does emailing it bypass our access controls? This is a data-protection question the model couldn't know matters here.</span></div>
<div class="r"><span class="stamp bad">Missing</span><span><b>Ownership:</b> what happens when the admin who created the schedule leaves the company or loses access?</span></div>
<div class="r"><span class="stamp warn">Assumed</span><span>“As a PDF” wasn't in the story. Check what format directors actually want before it becomes a requirement.</span></div>
</div></div>
<p>The pattern is typical. AI produces a strong generic draft, and the most important criteria come from knowledge of your organisation: who can see what, what happens when people leave, which assumptions slipped in. Take the edited draft to refinement and let QA and engineering add their own edge cases. The <a class="term" data-t="acceptance-criteria">acceptance criteria</a> are yours once you've signed them off.</p>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Synthetic users presented as research.</strong> AI-generated personas and “simulated interviews” produce the typical opinions found in training data. Useful for drafting interview questions; not evidence about your customers.<sup>[1]</sup></li>
<li><strong>The tidy story.</strong> Summaries trend toward a coherent narrative and drop inconvenient outliers. Ask for contradictions explicitly.</li>
<li><strong>Asking it to confirm.</strong> “Find evidence that users want dark mode” will find some. Ask what the evidence shows instead (lesson 3).</li>
<li><strong>Fake precision.</strong> “62% of users prefer…” from twelve qualitative interviews is a statistic the method can't support, however natural it sounds.</li>
<li><strong>Uncited market claims.</strong> A competitor's price, user count or feature list from an assistant is a lead to verify, not a fact.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 45-minute exercise.</strong> Take notes from five to ten recent customer conversations. Run the synthesis brief above. Check five quotes word for word and recount one theme. Write down three things: how long the AI step took, how long checking took, and what the check found. That record is the start of your team's evidence about where AI helps (lesson 45).</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An AI synthesis says “Users consistently report that onboarding is confusing” and cites P2, P5 and P9 out of 14 participants. What's the problem?</p><ul>
<li data-fb="The IDs are useful; the problem is the claim they're supporting.">It shouldn't cite participant IDs.</li>
<li data-fb="Right. Three of fourteen is a minority. The theme may be real and important, but “consistently” overstates it.">“Consistently” overstates evidence from 3 of 14 participants.</li>
<li data-fb="Onboarding confusion is a perfectly plausible theme; the issue is the strength of the claim.">Onboarding is not a valid research theme.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">A stakeholder suggests running 50 AI-generated “customer interviews” to save time. What's the most useful response?</p><ul>
<li data-fb="More synthetic interviews give more typical-sounding text, not more evidence.">Agree, but run 200 to make the results statistically significant.</li>
<li data-fb="AI can help research, just not by standing in for the participants.">Ban AI from research entirely.</li>
<li data-fb="Right. Synthetic participants can help you prepare, but only real customers can tell you about your customers.">Use AI to draft and pilot the interview guide, then interview real customers.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Nielsen Norman Group, <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users: If, When, and How to Use AI-Generated “Research”</a>.</li>
<li>Sharma et al. (2023), <a href="https://arxiv.org/abs/2310.13548" target="_blank" rel="noopener">Towards Understanding Sycophancy in Language Models</a>. Why leading research questions get agreeable answers.</li>
<li>Lessons <a href="#failure-modes">3: Why it gets things wrong</a> and <a href="#checking-work">5: Checking the work</a> in this course.</li>
</ol></section>
`
});
