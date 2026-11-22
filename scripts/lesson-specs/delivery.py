SPEC = dict(
file="12-delivery.js",
reviewed="2026-11",
outcomes=["Write a status update in which every claim about progress traces to the board or a named person."],
situation="""<p>It's Friday at 4 p.m. and the weekly status report is due. An assistant connected to the board drafts it in a minute: “Sprint on track. Payments integration progressing well. No major risks.” It reads like every status report you've ever approved.</p>
<p>The payments integration has been blocked for six days waiting on the vendor's sandbox. The board shows it; the draft doesn't, because “progressing well” is the most typical thing to write. This lesson is about status reports that tell the truth early.</p>""",
warmup=dict(q="What's the main risk of an AI-drafted status report?", a=2, opts=[
  ("It will be too long for stakeholders to read.", "Length is easy to fix."),
  ("It will use the wrong template or headings.", "Formatting is a minor issue."),
  ("It fills gaps with the most typical story, usually “on track”.", "Right. Blockers and slips get smoothed over."),
  ("It will reveal confidential information to stakeholders.", "Possible, but not the main risk here."),
 ]),
sections="""<h2>Red, amber, green with reasons</h2>
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
</div></div></div>""",
myths=[
 ("AI status reports are objective because they read the board.", "They read the board and write the most typical summary. Blockers often get smoothed into “progressing”."),
 ("Green is the safe default when nothing is clearly wrong.", "Green is a claim. It needs the same evidence as amber or red."),
 ("Reporting problems early looks bad.", "Early amber with a plan builds trust; late red destroys it."),
 ("A premortem is pessimism.", "It's a structured way to surface risks people are reluctant to raise.[3]"),
],
recap=[
 "AI drafts fill gaps with “on track”; check every claim against the board.",
 "Agree what red, amber and green mean before writing reports.",
 "Use numbers and ticket references, not adjectives.",
 "Name blockers, their effect on dates, and the trigger for red.",
 "Ask for a specific decision with an owner and a deadline.",
],
checks=[
 dict(q="The AI draft says “payments progressing well”, but the ticket has been blocked for six days. What should the report say?", a=0, opts=[
  ("That it's blocked, since when, why, and what's been done.", "Right. Specific, checkable and honest."),
  ("That it's progressing, since work continues elsewhere.", "Hides a blocker on the critical path."),
  ("Nothing about payments, to keep the report short.", "Omitting a blocker misleads by silence."),
  ("That it's at risk, without details, to avoid alarm.", "Vague risk statements don't get help."),
 ]),
 dict(q="What should a status colour be based on?", a=3, opts=[
  ("How confident the team feels about the release.", "Feelings vary; rules don't."),
  ("Whatever colour the AI assistant suggests.", "It picks the typical colour."),
  ("Last week's colour, unless something changed a lot.", "Inertia hides gradual slips."),
  ("A rule agreed in advance, applied to the board.", "Right. Then colours mean the same thing every week."),
 ]),
 dict(q="Which status line is most useful to a sponsor?", a=1, opts=[
  ("“Team is working hard and morale is good.”", "Pleasant but not actionable."),
  ("“Decision needed by Wednesday: cut wallets or move the date. Owner: Priya.”", "Right. A decision, options, an owner and a date."),
  ("“Several risks are being monitored closely.”", "Says nothing specific."),
  ("“Velocity is within the normal range.”", "Not tied to the milestone."),
 ]),
 dict(q="9 of 20 stories are done with 3 days left. How should the report describe it?", a=2, opts=[
  ("“Good progress this sprint.”", "Hides a likely carry-over."),
  ("“Sprint nearly complete.”", "Inaccurate."),
  ("“9 of 20 done with 3 days left; expect to carry over about 6.”", "Right. Numbers and a forecast."),
  ("“Sprint behind due to complexity.”", "Vague cause, no numbers."),
 ]),
 dict(q="Why ask an assistant to list blockers separately before drafting the summary?", a=0, opts=[
  ("So blockers can't be smoothed into the overall story.", "Right. Separate lists resist the typical narrative."),
  ("Because blockers are easier for the model to find.", "Not the reason."),
  ("To make the report longer and more thorough.", "Length isn't the goal."),
  ("Because stakeholders only read the blockers.", "They read the summary too."),
 ]),
],
)
