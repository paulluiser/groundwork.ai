SPEC = dict(
file="11b-3-security-detection.js",
reviewed="2026-11",
outcomes=["Write an incident timeline in which every AI-summarised event is tied to a log line or artefact."],
situation="""<p>At 3 a.m. an assistant in your security platform summarises an alert: “Likely compromised account. Attacker logged in from Romania, accessed the finance share, and exfiltrated 2 GB.” The on-call analyst is about to disable the CFO's account and wake the incident team.</p>
<p>The login was real. The location was a VPN exit node the CFO uses. The finance share access was a scheduled backup job. There was no 2 GB transfer; the model inferred it from a log line about a backup's size. This lesson is about using AI to read faster during detection and response, without acting on its guesses.</p>""",
warmup=dict(q="An AI alert summary says data was exfiltrated. Before acting, what should you check?", a=1, opts=[
  ("The summary's confidence score for the exfiltration claim.", "Confidence isn't evidence."),
  ("The log events showing the transfer, its size and destination.", "Right. A claim of exfiltration needs the events behind it."),
  ("Whether similar alerts were true positives last month.", "Useful context, but not evidence for this one."),
  ("That the summary was produced by the newest model.", "Model version doesn't verify the claim."),
 ]),
sections="""<h2>Incident response still follows a lifecycle</h2>
<p>NIST's incident response guidance, updated in 2025, frames response as part of overall risk management: prepare, detect and analyse, contain, eradicate and recover, and improve.[S1] AI fits naturally into detection and analysis (reading alerts, summarising logs, drafting timelines) and into the write-up afterwards. Containment decisions, like disabling an executive's account, need evidence a person has checked.</p>
<h2>Worked example: a timeline you can defend</h2>
<div class="worked">
<div class="wx"><b>AI summary</b><div><p>02:47 Attacker logs in from Romania. 02:51 Accesses finance share. 02:58 Exfiltrates 2 GB. Recommend: disable account, reset credentials.</p></div></div>
<div class="wx strong"><b>Timeline with evidence</b><div><p><strong>02:47</strong> Login, CFO account, IP 185.x (VPN provider's Bucharest exit, matches CFO's VPN history). <em>Source: IdP log #4471.</em></p><p><strong>02:51</strong> Finance share read by service account <code>backup-svc</code>, not the CFO. <em>Source: file audit #9930.</em></p><p><strong>02:58</strong> No outbound transfer found. Log line “2.1 GB snapshot complete” is the backup job. <em>Source: backup log.</em></p><p><strong>Verdict:</strong> benign. Tune the rule to recognise the CFO's VPN.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>Every line cites a log event.</strong> Events without a source don't go in the timeline.</li>
<li><strong>The AI merged two actors</strong> (the CFO and the backup service) into one story. That's typical: models build coherent narratives.</li>
<li><strong>The 2 GB came from the wrong log.</strong> Sizes, counts and destinations are the details to check first.</li>
</ul>
<h2>Your turn: check an AI incident summary</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Which claims need evidence?</span></div><div class="activity-b">
<p>An AI summary of a phishing alert says: <em>“User J. Park clicked a malicious link at 09:12, entered credentials on a fake login page, and the attacker used them at 09:20 to create a mail forwarding rule. No other users affected.”</em> List each claim, the log or artefact that would confirm it, and the claim most dangerous to accept without checking.</p>
<div data-w="task" data-key="security-timeline">
<div class="task-model"><ul>
<li><strong>Clicked at 09:12:</strong> proxy or email security click log.</li>
<li><strong>Entered credentials:</strong> evidence from the phishing page (if captured) or a subsequent sign-in using the password.</li>
<li><strong>Attacker sign-in at 09:20:</strong> identity provider log with IP, device and MFA result.</li>
<li><strong>Forwarding rule created:</strong> mailbox audit log entry and the rule itself.</li>
<li><strong>No other users affected:</strong> search for other recipients of the email, clicks and sign-ins from the attacker's IP.</li>
</ul><p><strong>Most dangerous:</strong> “No other users affected”. It's a claim of absence that's easy to state and costly if wrong, since it ends the investigation early.</p></div>
<ul class="task-rubric">
<li>Splits the summary into separate claims</li>
<li>Names a specific log or artefact for each claim</li>
<li>Recognises that a claim of absence needs its own search</li>
<li>Identifies the most dangerous claim and explains why</li>
</ul>
</div></div></div>""",
myths=[
 ("AI summaries of alerts save time without risk.", "They save reading time. Acting on an unchecked summary can cost far more than it saved."),
 ("If the model says “no other users affected”, it searched.", "It may only have seen the logs in its context. Claims of absence need a search you run."),
 ("Attackers using AI is mostly hype.", "Government assessments expect AI to increase the volume and effectiveness of attacks, especially phishing and reconnaissance.[1]"),
 ("Pasting malware or phishing emails into an assistant is harmless.", "Hostile content can contain injection aimed at AI tools. Use tools designed and approved for it."),
],
recap=[
 "Use AI to read and summarise; check evidence before containment decisions.",
 "Every timeline event cites a log line or artefact.",
 "Check sizes, counts, destinations and actors first: they're the most often wrong.",
 "Claims of absence need a search of their own.",
 "Treat hostile content as hostile to your AI tools too.",
],
checks=[
 dict(q="An AI timeline merges a user's login and a backup service's file access into one story. What's happened?", a=3, opts=[
  ("The logs were tampered with by the attacker.", "Possible, but the simpler explanation is the summary."),
  ("The backup service account was compromised.", "No evidence supports that yet."),
  ("The model had too few logs to work with.", "It had enough; it combined them wrongly."),
  ("The model built a coherent story from separate actors.", "Right. Check the actor on each event."),
 ]),
 dict(q="Which part of an AI incident summary should you verify first?", a=0, opts=[
  ("Specific sizes, counts, destinations and actors.", "Right. These details are most often wrong and drive decisions."),
  ("The opening sentence describing the alert type.", "Context, not the key evidence."),
  ("The recommended next steps at the end.", "Recommendations rest on the facts; check those first."),
  ("The formatting of the timeline table.", "Format doesn't matter to correctness."),
 ]),
 dict(q="A summary says “no other users were affected”. How do you check?", a=2, opts=[
  ("Ask the assistant whether it is sure about this.", "Its reassurance isn't a search."),
  ("Wait to see whether other users report problems.", "Too late if they were affected."),
  ("Search for other recipients, clicks and sign-ins from the same source.", "Right. Absence needs its own search."),
  ("Check that the original alert named only one user.", "Alerts often show only the first detection."),
 ]),
 dict(q="Where in incident response does AI help most safely?", a=1, opts=[
  ("Deciding when to disable accounts automatically.", "Containment needs checked evidence."),
  ("Reading and summarising alerts and logs for analysts.", "Right. Faster reading, with people deciding."),
  ("Declaring incidents closed once the summary looks benign.", "Closing needs verified evidence."),
  ("Communicating directly with affected customers.", "Customer communication needs human review."),
 ]),
 dict(q="Why be careful pasting a phishing email into a general AI assistant?", a=0, opts=[
  ("It may contain text designed to manipulate AI tools.", "Right. Hostile content can target your tools too."),
  ("Phishing emails are too long for most assistants.", "Length isn't the concern."),
  ("Assistants refuse to discuss phishing at all.", "Many will; that isn't the risk."),
  ("It will slow down the assistant for other users.", "Not a concern."),
 ]),
],
sources=[
 'NIST (2025), <a href="https://csrc.nist.gov/pubs/sp/800/61/r3/final" target="_blank" rel="noopener">SP 800-61 Rev. 3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management</a>.',
],
)
