SPEC = dict(
file="12c-engineering-management.js",
reviewed="2026-11",
outcomes=["Write performance feedback in which every judgement rests on specific, observed examples."],
situation="""<p>Review season. You have eight reports, a template, and an assistant that offers to draft each review from your 1:1 notes and their tickets. The first draft is polished and confident: “Alex consistently demonstrates strong ownership but could improve communication with stakeholders.”</p>
<p>You can't remember a single example of either. Neither can the assistant; it wrote the most typical sentence for a review. Alex will read every word and wonder which incidents you meant. This lesson is about where AI helps a manager, and why decisions about people need your evidence and your judgement.</p>""",
warmup=dict(q="An AI-drafted review says “could improve communication with stakeholders”. What should you check first?", a=0, opts=[
  ("Which specific situations you observed that support it.", "Right. Feedback without examples can't be acted on or challenged."),
  ("Whether the phrasing matches the company's review template and its rating descriptions.", "Templates don't make feedback fair."),
  ("Whether the other seven reviews contain similar phrases, so the team is treated consistently.", "Consistency of wording isn't consistency of evidence."),
  ("Whether the assistant had access to this person's tickets and pull requests.", "Activity data doesn't show communication."),
 ]),
sections="""<h2>Feedback with evidence</h2>
<p>Useful feedback describes a situation, the behaviour you observed and its impact, then what you'd like to see. It's harder to write than adjectives, and it's the only kind people can act on. AI is useful around it: organising your notes by theme, checking that every judgement has an example, flagging vague or loaded words, and spotting when your language differs between people doing similar work. It can't supply the observations, and it shouldn't propose ratings.</p>
<h2>Worked example: from adjectives to evidence</h2>
<div class="worked">
<div class="wx"><b>AI draft</b><div><p>“Alex consistently demonstrates strong ownership but could improve communication with stakeholders. Alex is a valued team member with great potential.”</p></div></div>
<div class="wx strong"><b>Rewritten from your notes</b><div><p>“When the billing migration slipped in May, Alex took on the data cleanup nobody had claimed and finished it in two weeks, which kept the launch date. In the July planning review, finance learned about the reporting delay from the release notes rather than from us; next quarter I'd like Alex to give stakeholders a heads-up as soon as a date is at risk.”</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>“Strong ownership” became an incident, an action and an impact.</strong></li>
<li><strong>“Improve communication” became one specific situation and one specific ask.</strong></li>
<li><strong>“Great potential” disappeared.</strong> It's praise with no information, and language like it is unevenly distributed across people.</li>
<li><strong>The assistant's job here:</strong> “For each judgement in my draft, show me the note that supports it, and flag any that have none.”</li>
</ul>
<h2>Your turn: rewrite review feedback</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Turn generic feedback into evidence-based feedback</span></div><div class="activity-b">
<p>Your notes for Sam include: led the incident review after the March outage and wrote the clearest postmortem the team has had; missed two sprint commitments in Q2 without flagging them early; mentored the new graduate through their first on-call. The AI draft says: <em>“Sam is a strong technical contributor and team player who should work on time management.”</em> Rewrite it.</p>
<div data-w="task" data-key="em-feedback">
<div class="task-model"><p>“After the March outage, Sam led the incident review and wrote the clearest postmortem the team has produced; two other teams have since reused its format. Sam also mentored Priya through her first on-call rotation, and she said it was the main reason she felt ready.</p>
<p>In Q2, two sprint commitments slipped without warning, and we found out at the review. Next quarter, I'd like Sam to flag risk to a commitment as soon as it appears, even if it might still be recovered.”</p></div>
<ul class="task-rubric">
<li>Each strength is tied to a specific situation and its impact</li>
<li>The development point describes what happened, not a personality trait</li>
<li>The ask for next quarter is specific and achievable</li>
<li>Vague labels like “team player” and “time management” are gone</li>
<li>Nothing in it is unsupported by your notes</li>
</ul>
</div></div></div>""",
myths=[
 ("AI makes reviews fairer because it's neutral.", "It reproduces patterns from its training and your notes, including biased language. Check for evidence and consistency."),
 ("Activity data shows who's performing well.", "Tickets and commits measure activity, not impact or quality. They're context, not ratings."),
 ("Using AI for hiring screens is fine if a person makes the final call.", "Screening shapes who reaches that person. Hiring uses are high-risk under the EU AI Act.[1]"),
 ("Managers who use AI for reviews save time without trade-offs.", "Drafting gets faster; gathering evidence doesn't. Budget the time for that."),
],
recap=[
 "Use AI to organise notes, flag vague words and check every judgement has evidence.",
 "Feedback describes situation, behaviour and impact, then a specific ask.",
 "Don't let AI propose ratings or rankings of people.",
 "Activity data is context, not a measure of performance.",
 "Hiring and evaluation uses of AI carry legal obligations; involve HR and legal.",
],
checks=[
 dict(q="Which is the best use of an assistant when writing a performance review?", a=2, opts=[
  ("Generating a rating for each person from their ticket and commit history this quarter.", "Activity data isn't performance, and ratings stay with you."),
  ("Writing the full review from scratch so it sounds professional and consistent with the others.", "It can't supply your observations."),
  ("Checking that every judgement in your draft is supported by one of your notes.", "Right. It helps you keep feedback evidence-based."),
  ("Ranking the team from strongest to weakest to help calibration discussions.", "Ranking people is your judgement, not the model's."),
 ]),
 dict(q="What makes feedback actionable?", a=1, opts=[
  ("Positive adjectives that motivate the person and balance out any criticism given.", "Adjectives don't say what to repeat or change."),
  ("A specific situation, the behaviour observed, its impact, and a clear ask.", "Right. The person knows exactly what you mean."),
  ("A rating on a five-point scale with a short justification in the margin.", "A rating alone isn't actionable."),
  ("Wording that matches the company competency framework exactly, section by section.", "Framework language can still be vague."),
 ]),
 dict(q="Why remove phrases like “great potential” from a review?", a=3, opts=[
  ("They're too short to count as meaningful feedback in most review templates.", "Length isn't the issue."),
  ("They're banned by most HR policies and can't be used in formal reviews.", "Not generally banned."),
  ("They make the review sound too positive for the rating that was given.", "Tone mismatch isn't the main problem."),
  ("They carry no information and are often unevenly applied across people.", "Right. Vague praise isn't evidence."),
 ]),
 dict(q="Under the EU AI Act, where do AI tools for hiring and worker management fall?", a=0, opts=[
  ("High-risk, with obligations for oversight, data quality and documentation.", "Right. Employment is listed in Annex III."),
  ("Minimal risk, as long as a human reads the output before acting on it.", "Human review doesn't change the category."),
  ("Prohibited in all cases, everywhere in the European Union.", "High-risk, not prohibited."),
  ("Outside the Act entirely, since they only process internal company data.", "Employment uses are explicitly covered."),
 ]),
 dict(q="An assistant drafts reviews with noticeably different language for people doing similar work. What should you do?", a=2, opts=[
  ("Accept it, since each review was drafted from that person's own notes and tickets.", "Differences may reflect bias in notes or the model."),
  ("Regenerate the reviews until the wording comes out more similar across the team.", "Rewording doesn't fix the evidence."),
  ("Check whether the evidence differs, and fix language that doesn't match it.", "Right. Language should follow evidence."),
  ("Ask the assistant whether any of its drafts contain biased language.", "Its self-assessment isn't a check."),
 ]),
],
)
