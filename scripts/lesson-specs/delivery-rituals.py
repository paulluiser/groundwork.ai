SPEC = dict(
file="12-3-delivery-rituals.js",
reviewed="2026-11",
outcomes=["Agree team rules for AI notetakers: which meetings, what's kept, who sees it."],
situation="""<p>Someone switched on the AI notetaker for the retrospective. Afterwards, its summary landed in the team's public channel: “Key theme: frustration with Marco's code reviews being slow and harsh.” Marco hadn't been in the room. Nobody had said it quite like that.</p>
<p>Team rituals depend on people saying difficult things honestly. AI notetakers change who might read what was said, and how it's paraphrased. This lesson is about getting their benefits without losing that honesty.</p>""",
warmup=dict(q="Which meeting is the worst fit for an AI notetaker by default?", a=3, opts=[
  ("Sprint planning, where tasks and owners are agreed.", "Planning outputs are useful to record."),
  ("A sprint review with stakeholders.", "A record of feedback is useful here."),
  ("A technical design discussion.", "Decisions and trade-offs are worth capturing."),
  ("A retrospective, where people discuss what went wrong.", "Right. Candour depends on people feeling safe."),
 ]),
sections="""<h2>Psychological safety comes first</h2>
<p>Research at Google on effective teams found psychological safety (the belief that you won't be punished for speaking up or making mistakes) mattered more than any other factor they studied.[S1] Retrospectives work only when people feel safe; Norm Kerth's Prime Directive exists for the same reason.[1] An AI notetaker isn't neutral in that room: it creates a durable record, paraphrases, and can name people. Decide its role with the team, not for it.</p>
<h2>Worked example: team rules for meeting tools</h2>
<div class="tbl"><table><thead><tr><th>Meeting</th><th>AI notes?</th><th>What's kept</th><th>Who sees it</th></tr></thead><tbody>
<tr><td>Planning</td><td>Yes</td><td>Decisions, owners, dates</td><td>Team and stakeholders</td></tr>
<tr><td>Stand-up</td><td>Optional</td><td>Blockers only</td><td>Team</td></tr>
<tr><td>Review</td><td>Yes</td><td>Feedback and follow-ups</td><td>Team and stakeholders</td></tr>
<tr><td>Retrospective</td><td>Off by default; team may opt in</td><td>Agreed actions only, no names</td><td>Team only; deleted after 30 days</td></tr>
<tr><td>1:1s</td><td>No</td><td>—</td><td>—</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>The rule for retros keeps actions, not discussion.</strong> The useful output survives; the candour stays in the room.</li>
<li><strong>Visibility is decided per meeting</strong>, not by the tool's default sharing setting.</li>
<li><strong>Anyone can ask to switch it off</strong>, without giving a reason. Write that into the rules.</li>
</ul>
<h2>Your turn: write your team's rules</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Meeting tool rules for your team</span></div><div class="activity-b">
<p>Write a short set of rules your team could agree for AI notetakers and summarisers. Cover: which meetings, consent, what's kept, who can see it, how long it's kept, and how summaries are checked.</p>
<div data-w="task" data-key="delivery-rituals-rules">
<div class="task-model"><ol>
<li>The host says at the start when an AI notetaker is on; anyone can ask to turn it off, no reason needed.</li>
<li>On by default for planning and reviews; off for retros and 1:1s unless the whole team agrees.</li>
<li>Summaries keep decisions, actions, owners and dates. No attributing opinions to named people.</li>
<li>The facilitator checks the summary against their own notes before sharing.</li>
<li>Summaries go to meeting attendees; wider sharing is the facilitator's decision.</li>
<li>Recordings and transcripts are deleted after 30 days; summaries are kept.</li>
</ol></div>
<ul class="task-rubric">
<li>Requires telling people when a notetaker is on</li>
<li>Lets anyone switch it off without justification</li>
<li>Treats retrospectives and 1:1s differently from planning</li>
<li>Limits what's kept, especially names attached to opinions</li>
<li>Includes a human check before summaries are shared, and a retention period</li>
</ul>
</div></div></div>""",
myths=[
 ("AI meeting notes are accurate because they come from a transcript.", "Transcripts mishear, and summaries paraphrase. Check actions and attributions before sharing."),
 ("If it's recorded, people will be more accountable.", "In retros, recording often makes people less candid, which defeats the purpose."),
 ("The tool's default sharing settings are fine.", "Defaults may share widely. Decide visibility per meeting."),
 ("Consent was given once, so it covers every meeting.", "Tell people each time. Anyone should be able to opt out."),
],
recap=[
 "Decide AI notetaker rules with the team, per type of meeting.",
 "Keep retros and 1:1s off by default; candour matters more than a record.",
 "Keep decisions and actions, not opinions attributed to people.",
 "Check summaries before sharing, and limit who sees them.",
 "Set a retention period for recordings and transcripts.",
],
checks=[
 dict(q="An AI summary of a retro names a colleague in a criticism. What went wrong?", a=1, opts=[
  ("The transcription quality was too low.", "Accuracy wasn't the main problem."),
  ("The tool recorded opinions with names and shared them too widely.", "Right. Rules on what's kept and who sees it were missing."),
  ("The colleague should have attended the retro.", "Attendance isn't the issue."),
  ("The team should have used a different AI tool.", "The problem is the rules, not the vendor."),
 ]),
 dict(q="What should a retro summary keep, if anything?", a=0, opts=[
  ("Agreed actions and owners, without who said what.", "Right. The useful output, without names."),
  ("A full transcript, so nothing is lost.", "Discourages candour."),
  ("Every complaint, with the person who raised it.", "Damages trust."),
  ("Nothing at all, since retros shouldn't produce records.", "Actions are worth keeping."),
 ]),
 dict(q="Why does psychological safety matter for AI notetakers?", a=2, opts=[
  ("Safe teams use AI tools more often.", "Not the point."),
  ("It reduces the cost of meeting tools.", "Unrelated."),
  ("People speak up less when they fear a durable record.", "Right. Records change what people are willing to say."),
  ("It's a legal requirement in most countries.", "Not as such."),
 ]),
 dict(q="Who should be able to switch off a notetaker in a meeting?", a=3, opts=[
  ("Only the meeting host.", "Others' consent matters too."),
  ("Only someone more senior than the host.", "Seniority shouldn't decide."),
  ("Nobody, once the team has agreed to use it.", "People's circumstances change meeting to meeting."),
  ("Anyone in the meeting, without needing a reason.", "Right. Consent should be easy to withdraw."),
 ]),
 dict(q="Which check matters most before sharing an AI meeting summary?", a=1, opts=[
  ("That it's formatted with clear headings.", "Formatting is secondary."),
  ("That actions, owners and attributions match what happened.", "Right. Those are what people act on."),
  ("That it's shorter than one page.", "Length isn't the risk."),
  ("That it uses the team's usual tone.", "Tone is secondary."),
 ]),
],
sources=[
 'Google re:Work, <a href="https://rework.withgoogle.com/en/guides/understanding-team-effectiveness" target="_blank" rel="noopener">Understand team effectiveness</a>. Project Aristotle and the role of psychological safety.',
],
)
