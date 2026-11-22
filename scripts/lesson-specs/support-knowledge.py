SPEC = dict(
file="13b-2-support-knowledge.js",
reviewed="2026-11",
outcomes=["Turn a solved ticket into a knowledge article a customer or an AI assistant can rely on."],
situation="""<p>Your team solved the same SSO login problem 40 times last quarter. Each agent figured it out again, from scratch or from a colleague. An assistant can turn the best of those tickets into a help article in a minute, and your customer-facing bot will start answering from it the same afternoon.</p>
<p>Which means the article has to be right, and has to say who it applies to. This lesson is about capturing knowledge from tickets quickly, and checking it before it starts answering customers on its own.</p>""",
warmup=dict(q="An AI turns a solved ticket into a help article. What's the main risk?", a=1, opts=[
  ("The article will be too long for customers to finish reading.", "Length is easy to fix."),
  ("It generalises one customer's fix to everyone, or keeps their details.", "Right. Scope and privacy are the common failures."),
  ("Search engines won't index articles that were written by AI.", "Not the main risk."),
  ("Agents will stop solving new problems themselves.", "Unlikely to be the main risk."),
 ]),
sections="""<h2>Knowledge in the workflow</h2>
<p>Knowledge-Centered Service (KCS) treats knowledge as a by-product of solving problems: capture it while solving, structure it simply, and improve it every time it's reused.[1] AI makes the capture step much faster. The structure and the checks stay the same: every article states the environment it applies to, the issue in the customer's words, the cause, and the resolution, and is reviewed before it's published or used by a bot.</p>
<h2>Worked example: from ticket to article</h2>
<div class="worked">
<div class="wx"><b>AI draft from one ticket</b><div><p><strong>Fixing SSO login errors</strong></p><p>If you can't log in with SSO, ask your IT admin to update the certificate in Okta for northwind-health.example. Then clear your cache. This fixes SSO errors.</p></div></div>
<div class="wx strong"><b>Reviewed article</b><div><p><strong>“SAML response invalid” when signing in with SSO (Okta)</strong></p><p><strong>Applies to:</strong> Business and Enterprise workspaces using Okta SAML.</p><p><strong>Issue:</strong> Users see “SAML response invalid” after entering their Okta password.</p><p><strong>Cause:</strong> The signing certificate in Okta was rotated and no longer matches the one in your workspace settings.</p><p><strong>Resolution:</strong> A workspace admin uploads the new certificate under <em>Settings › Security › SSO</em>. Users don't need to clear their cache.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>The customer's domain is gone.</strong> One customer's details never belong in a public article.</li>
<li><strong>“SSO errors” became one specific error</strong> and one identity provider. The draft would have answered every SSO question with this fix.</li>
<li><strong>“Clear your cache” was removed</strong>: it was in the ticket but didn't fix anything. Checking against several tickets showed that.</li>
</ul>
<h2>Your turn: write an article from a ticket</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Ticket to knowledge article</span></div><div class="activity-b">
<p>Ticket summary: <em>“Customer (Lena at Brightwave Ltd) couldn't export reports to CSV; button greyed out. Agent found her role was Viewer; exports need Editor. Admin changed her role; export worked.”</em> Write the knowledge article.</p>
<div data-w="task" data-key="support-article">
<div class="task-model"><p><strong>“Export to CSV” button is greyed out</strong></p>
<p><strong>Applies to:</strong> all plans; report exports.</p>
<p><strong>Issue:</strong> The Export to CSV button on a report is greyed out and can't be clicked.</p>
<p><strong>Cause:</strong> Exporting reports requires the Editor or Admin role. Users with the Viewer role can see reports but not export them.</p>
<p><strong>Resolution:</strong> Ask a workspace admin to change your role to Editor under <em>Settings › Members</em>. If you're an admin, you can change it yourself.</p></div>
<ul class="task-rubric">
<li>Removes the customer's name and company</li>
<li>States which plans or setups it applies to</li>
<li>Describes the issue in the words a customer would use</li>
<li>Explains the cause, not just the fix</li>
<li>Gives a resolution a customer can follow, including who can do it</li>
</ul>
</div></div></div>""",
myths=[
 ("More articles always means better self-service.", "Duplicate and overlapping articles confuse customers and bots. Improve and merge as often as you add."),
 ("If an article fixed one ticket, it's ready to publish.", "Check scope against several tickets; one case can include steps that didn't matter."),
 ("Bots only answer from reviewed articles.", "They answer from whatever is indexed. Keep drafts out of the bot's sources until reviewed."),
 ("AI quality scoring is objective.", "Scoring rubrics encode choices. Calibrate AI scores against experienced reviewers before using them."),
],
recap=[
 "Capture knowledge while solving; AI makes drafting fast.",
 "Every article states who it applies to, the issue, the cause and the resolution.",
 "Remove customer details; check scope against several tickets.",
 "Review before publishing, and before bots can answer from it.",
 "Improve articles each time they're reused; merge duplicates.",
],
checks=[
 dict(q="What should a knowledge article state first so bots don't misapply it?", a=2, opts=[
  ("The name of the agent who wrote the article and the date it was published.", "Useful metadata, not scope."),
  ("A friendly introduction explaining why the article exists.", "Not scope."),
  ("Which plans, setups or environments it applies to.", "Right. Scope prevents over-general answers."),
  ("A list of related articles the customer might find useful.", "Helpful later, not first."),
 ]),
 dict(q="An AI draft includes a step from the ticket that didn't fix anything. How would you find out?", a=0, opts=[
  ("Compare it with several tickets about the same issue.", "Right. Steps that never mattered show up as noise."),
  ("Ask the assistant which steps were really necessary.", "It may not know."),
  ("Keep the step, since it can't do any harm to include it.", "Unnecessary steps waste customers' time."),
  ("Publish it and see whether customers complain about the step.", "Too late."),
 ]),
 dict(q="When should a new article become a source for the customer-facing bot?", a=3, opts=[
  ("As soon as it's drafted, so the bot learns quickly.", "Unreviewed drafts become wrong answers."),
  ("After it's been viewed by at least a hundred customers.", "Views don't make it correct."),
  ("When the AI's confidence in the article is high enough.", "Not a review."),
  ("After a person has reviewed and published it.", "Right. Review before it answers customers."),
 ]),
 dict(q="What does Knowledge-Centered Service emphasise?", a=1, opts=[
  ("Writing articles in a separate project after tickets are closed.", "KCS captures knowledge while solving."),
  ("Capturing and improving knowledge as part of solving problems.", "Right. Knowledge is a by-product of the work."),
  ("Having one writer own every article in the knowledge base.", "KCS spreads ownership across agents."),
  ("Replacing agents with knowledge bases wherever possible.", "Not its goal."),
 ]),
 dict(q="Why remove the customer's name from an article drafted from their ticket?", a=0, opts=[
  ("It's personal data that doesn't belong in a public article.", "Right. Privacy and relevance."),
  ("Names make articles too long for search engines to index.", "Not the reason."),
  ("Bots can't process names in articles they answer from.", "Not the reason."),
  ("The customer might want to be credited differently.", "Not the reason."),
 ]),
],
)
