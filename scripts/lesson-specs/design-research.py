SPEC = dict(
file="09-2-design-research.js",
reviewed="2026-11",
outcomes=["Write a research plan in which AI speeds up preparation and analysis but never replaces participants."],
situation="""<p>You ran eight usability sessions on a new invoicing flow. The recordings are transcribed, and an assistant has produced a tidy readout: five findings, each with a severity and a recommendation. Your stakeholders want it by tomorrow.</p>
<p>It looks finished. But two of the quotes are slightly reworded, one “critical” finding came from a single participant who misunderstood the task, and the recommendation for the biggest issue is a pattern from a different product. This lesson is about getting the speed without inheriting those errors.</p>""",
warmup=dict(q="A readout says “most participants struggled to find the export button”. What makes this claim checkable?", a=0, opts=[
  ("The participant IDs and the timestamps where they struggled.", "Right. Then anyone can watch the moments behind the claim."),
  ("A severity rating from one to four next to the finding.", "Severity is a judgement; it doesn't show the evidence."),
  ("A screenshot of the export button in the interface.", "Shows the button, not the struggle."),
  ("The word “most” replaced with a more precise word.", "Precision helps, but without IDs it still can't be checked."),
 ]),
sections="""<h2>Where AI fits in a research plan</h2>
<div class="tbl"><table><thead><tr><th>Stage</th><th>AI can help</th><th>Stays with you</th></tr></thead><tbody>
<tr><td>Plan</td><td>Draft the discussion guide and tasks; flag leading questions</td><td>The research question and who to recruit</td></tr>
<tr><td>Recruit</td><td>Draft screener questions</td><td>Choosing real participants who match</td></tr>
<tr><td>Run</td><td>Rehearse the guide with a simulated participant</td><td>The sessions themselves</td></tr>
<tr><td>Analyse</td><td>Transcribe, tag, cluster and find quotes</td><td>Checking quotes and counts; judging severity</td></tr>
<tr><td>Report</td><td>Draft the readout structure and wording</td><td>Findings, severity and recommendations</td></tr>
</tbody></table></div>
<p>Thematic analysis, the standard method for qualitative data, depends on the researcher's judgement at every phase, from coding to naming themes.[2] AI can speed up the mechanical parts. It can't decide what a pattern means for your product.</p>
<h2>Worked example: severity you can defend</h2>
<p>Severity ratings feel objective and rarely are. A simple, explicit rule makes them comparable. Here's one rule and how it changes an AI-rated finding.</p>
<div class="worked">
<div class="wx"><b>AI readout</b><div><p><strong>Critical:</strong> Users can't understand the VAT toggle. Recommendation: replace it with a tax wizard.</p></div></div>
<div class="wx strong"><b>After applying the rule</b><div><p><strong>Minor (1 of 8, P6):</strong> P6 hesitated at the VAT toggle for 20 seconds, then set it correctly. Others used it without comment. Watch for this in the next round; no change yet.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>The rule:</strong> critical = stops task completion for 2 or more participants; serious = completes with significant difficulty for 2 or more; minor = hesitation or a single participant.</li>
<li><strong>The evidence changed the rating,</strong> not the wording. One participant's hesitation isn't critical.</li>
<li><strong>The recommendation disappeared.</strong> A wizard was a solution looking for a problem; the evidence didn't support redesign.</li>
</ul>
<h2>Your turn: plan a study with AI in the right places</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">A one-page research plan</span></div><div class="activity-b">
<p>Plan a small usability study of a flow you're working on. Write: the research question, who you'll recruit and how many, three tasks, where you'll use AI and how you'll check it, and your severity rule.</p>
<div data-w="task" data-key="design-research-plan">
<div class="task-model"><p><strong>Question:</strong> Can small-business owners send their first invoice without help?</p>
<p><strong>Participants:</strong> 6 owners who invoice monthly and haven't used our product, recruited from the waitlist.</p>
<p><strong>Tasks:</strong> create a client; send an invoice with VAT; find out whether it was paid.</p>
<p><strong>AI use:</strong> draft the guide and flag leading questions (I'll rewrite); transcribe and tag sessions (I'll check every quote against the recording and recount each theme); draft the readout structure.</p>
<p><strong>Severity rule:</strong> critical = 2+ can't complete; serious = 2+ complete with major difficulty; minor = hesitation or a single participant.</p></div>
<ul class="task-rubric">
<li>States a specific research question</li>
<li>Recruits real participants who match the users</li>
<li>Names where AI is used and how each use is checked</li>
<li>Keeps findings and severity with the researcher</li>
<li>Defines an explicit severity rule</li>
</ul>
</div></div></div>""",
myths=[
 ("AI transcription is accurate enough to quote directly.", "It mishears names, numbers and jargon. Check quotes against the recording before they go in a readout."),
 ("Simulated participants can replace a pilot session.", "They're useful for rehearsing timing and wording, not for finding real problems."),
 ("A clustered theme with many sticky notes is a strong finding.", "Count participants, not notes. One talkative person can fill a cluster."),
 ("AI-generated prototypes are just faster versions of designer prototypes.", "They're fast and generic. Use them to test an idea early; design the real thing deliberately."),
],
recap=[
 "AI speeds up preparation and analysis; participants and judgement stay human.",
 "Every finding needs participant IDs and moments someone can check.",
 "Use an explicit severity rule so ratings mean the same thing every time.",
 "Check quotes against recordings, and count participants, not notes.",
 "Recommendations follow evidence; drop the ones that don't.",
],
checks=[
 dict(q="An AI readout rates a finding “critical” based on one participant's 20-second hesitation. What's the right call?", a=2, opts=[
  ("Keep it critical, because any hesitation hurts conversion.", "One hesitation isn't evidence of a critical problem."),
  ("Delete the finding, since one participant doesn't count.", "It's still worth noting and watching."),
  ("Downgrade it to minor and watch for it in the next round.", "Right. Apply the rule to the evidence."),
  ("Ask the assistant to re-rate it with more context.", "The rule, not another opinion, should decide."),
 ]),
 dict(q="Where in a research plan is AI most useful?", a=0, opts=[
  ("Drafting guides and tagging transcripts, with checks.", "Right. Mechanical work, checked by you."),
  ("Replacing the sessions with simulated participants.", "Simulations aren't evidence about your users."),
  ("Deciding which findings are most important to fix.", "That judgement stays with the researcher and team."),
  ("Recruiting participants who match your target users.", "Recruiting real people is your job."),
 ]),
 dict(q="Why count participants rather than notes when clustering?", a=3, opts=[
  ("Notes take too long to count by hand.", "Speed isn't the reason."),
  ("Participants are easier for stakeholders to understand.", "True, but not the main reason."),
  ("AI tools can't count notes accurately.", "Not the main issue."),
  ("One talkative person can create a large cluster of notes.", "Right. Notes overstate how widespread an issue is."),
 ]),
 dict(q="What should you check before quoting an AI transcript in a readout?", a=1, opts=[
  ("That the quote sounds natural and reads well on a slide.", "Smoothed quotes are exactly the risk."),
  ("That the words match what the participant said in the recording.", "Right. Transcripts mishear and models reword."),
  ("That the quote supports the recommendation you want to make.", "That's selecting evidence to fit a conclusion."),
  ("That the quote is short enough to fit in the readout.", "Length matters less than accuracy."),
 ]),
 dict(q="What makes a severity rating defensible?", a=0, opts=[
  ("An explicit rule applied to counted evidence.", "Right. Anyone can apply it and get the same result."),
  ("The confidence score the AI tool attaches to it.", "A model's confidence isn't evidence."),
  ("How strongly participants expressed their frustration.", "Emotion is useful context, not a severity rule."),
  ("Agreement from the most senior person in the room.", "Seniority isn't a method."),
 ]),
],
sources=[
 'Nielsen Norman Group, <a href="https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/" target="_blank" rel="noopener">Rating the Severity of Usability Problems</a>. Frequency, impact and persistence as the basis for severity.',
],
)
