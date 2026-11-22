SPEC = dict(
file="13-operations.js",
reviewed="2026-11",
outcomes=["Turn an AI-drafted runbook into a tested one, with verification and rollback for each step."],
situation="""<p>An alert fires at 2 a.m.: API error rate at 18%. You paste the alert and the last 200 log lines into an assistant. Within seconds it suggests a cause (connection pool exhaustion), a fix (restart the pods and raise the pool size), and a command to do both. It sounds exactly like the senior engineer who isn't on call tonight.</p>
<p>It might be right. If it isn't, a restart during a database failover could make the outage worse. This lesson is about using AI to think faster during incidents without letting it act faster than you can check.</p>""",
warmup=dict(q="During an incident, an assistant suggests a command that changes production. What should you do first?", a=1, opts=[
  ("Run it immediately, since speed matters most during an outage and it sounds correct.", "Speed matters; a wrong change can make it worse."),
  ("Check what it changes and how you'd undo it before running it.", "Right. Know the effect and the rollback first."),
  ("Ask the assistant whether it's confident enough in the command to run it in production.", "Its confidence isn't verification."),
  ("Wait until the morning and ask a senior engineer to review the command properly.", "The outage needs action; check, don't stall."),
 ]),
sections="""<h2>Read-only first</h2>
<p>A useful rule during incidents: AI suggestions that read (logs, metrics, describe commands) can run freely; anything that changes state (restarts, scaling, config, deletes) needs a person to confirm what it does and how to undo it. Ask the assistant to label each suggested command as read-only or changing, and to give the rollback for any change. Monitoring basics still apply: start from the symptoms users feel, such as latency, errors and saturation, before chasing causes.[S1]</p>
<h2>Worked example: a runbook step, tested</h2>
<div class="worked">
<div class="wx"><b>AI-drafted step</b><div><pre>3. Restart the API pods:
   kubectl rollout restart deploy/api</pre></div></div>
<div class="wx strong"><b>Tested runbook step</b><div><pre>3. Restart the API pods (changes state)
   When: pool errors in logs AND database
         healthy (check step 2 first).
   Run:  kubectl -n prod rollout restart
         deploy/api
   Verify: kubectl -n prod rollout status
         deploy/api  (all pods Ready < 3 min);
         error rate below 2% within 5 min.
   If not: kubectl -n prod rollout undo
         deploy/api; escalate to DB on-call.
   Tested: staging, 12 March, 2 min 40 s.</pre></div></div>
</div>
<ul class="wx-notes">
<li><strong>“When” prevents the wrong fix:</strong> restarting during a database failover makes things worse.</li>
<li><strong>The namespace is explicit.</strong> The draft would have run in whatever context the terminal was in.</li>
<li><strong>Verify and rollback</strong> turn a command into a step someone can run safely at 2 a.m.</li>
<li><strong>“Tested” with a date</strong> tells the reader it actually works.</li>
</ul>
<h2>Your turn: make a step safe</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Turn a drafted step into a tested one</span></div><div class="activity-b">
<p>An assistant drafted this runbook step for a full disk on a log server: <em>“Free up space: <code>rm -rf /var/log/*.gz</code>”</em>. Rewrite it as a safe runbook step with when to use it, what to run, how to verify, and what to do if it doesn't work.</p>
<div data-w="task" data-key="ops-runbook">
<div class="task-model"><pre>Free disk space on a log server (changes state)
When: disk above 90% (df -h /var/log) AND
      logs older than 14 days are already
      shipped to the log store (check the
      shipping dashboard).
Look first (read-only):
  du -sh /var/log/* | sort -h | tail
Run:  find /var/log -name '*.gz' -mtime +14
        -print   (review the list), then
      find /var/log -name '*.gz' -mtime +14
        -delete
Verify: df -h /var/log below 75%.
If not: identify the largest growing file;
  escalate to the service owner; don't delete
  active logs.
Tested: staging, [date].</pre></div>
<ul class="task-rubric">
<li>Adds a condition for when the step applies</li>
<li>Checks logs are safely shipped before deleting</li>
<li>Lists what will be deleted before deleting it</li>
<li>Limits deletion by age instead of deleting everything</li>
<li>Includes verification and an escalation path</li>
</ul>
</div></div></div>""",
myths=[
 ("The AI read the logs, so its diagnosis is grounded.", "It read the 200 lines you pasted. The cause may be in logs it didn't see. Check the hypothesis against more evidence."),
 ("Runbooks drafted by AI are ready to use.", "Untested runbooks fail when you need them most. Test every step in staging."),
 ("Giving the assistant cluster access speeds up incidents.", "Read-only access can help. Write access during an incident turns a wrong suggestion into an outage."),
 ("Blameless postmortems don't need precise timelines.", "Blameless is about people, not vagueness. Timelines need sources.[1]"),
],
recap=[
 "Let AI run read-only commands; confirm effect and rollback for anything that changes state.",
 "Start from user-facing symptoms; treat AI diagnoses as hypotheses.",
 "Runbook steps need conditions, explicit targets, verification and rollback.",
 "Test runbooks in staging and record when.",
 "Postmortem timelines cite logs and records, not summaries.",
],
checks=[
 dict(q="Which suggested command can safely run without extra confirmation during an incident?", a=3, opts=[
  ("kubectl rollout restart deploy/api, since restarts are usually harmless.", "Changes state; can worsen some incidents."),
  ("Scaling the database to a larger instance size to add headroom.", "Changes state and cost."),
  ("Deleting old pods that look stuck in a crash loop.", "Changes state."),
  ("kubectl get pods -n prod to see their status.", "Right. Read-only."),
 ]),
 dict(q="Why add a “When” condition to a runbook step?", a=0, opts=[
  ("So the step isn't run in situations where it makes things worse.", "Right. The same fix can harm in a different failure."),
  ("Because runbook templates require a condition field for every step.", "Not the reason."),
  ("So the assistant can decide automatically when to run the step.", "Conditions are for the person on call."),
  ("To make the runbook longer and look more thorough to auditors.", "Length isn't the goal."),
 ]),
 dict(q="An AI diagnosis is based on 200 pasted log lines. How should you treat it?", a=2, opts=[
  ("As confirmed, since it came directly from the logs you gave it.", "It saw a fraction of the evidence."),
  ("As wrong, since AI can't diagnose production incidents reliably.", "It may well be right; check it."),
  ("As a hypothesis to test against metrics and other logs.", "Right. Use it to direct the investigation."),
  ("As a starting point for the postmortem write-up.", "It needs checking first."),
 ]),
 dict(q="What makes a runbook step safe to run at 2 a.m.?", a=1, opts=[
  ("Clear formatting and a confident tone that reassures the person on call.", "Tone doesn't make a step safe."),
  ("A condition, explicit command, verification and rollback.", "Right. The on-call person can act and recover."),
  ("Approval from the AI tool that generated the step in the first place.", "Not a safety check."),
  ("A link to the vendor's documentation for every command used.", "Useful, but not enough."),
 ]),
 dict(q="Why limit an AI assistant to read-only access during incidents?", a=3, opts=[
  ("Read-only access is cheaper on most AI platforms and keeps costs down.", "Cost isn't the reason."),
  ("Write access makes the assistant respond more slowly to requests.", "Not the reason."),
  ("Regulations ban AI from changing production systems in every industry.", "No such general ban."),
  ("A wrong suggestion with write access becomes a change to production.", "Right. Keep a person in front of changes."),
 ]),
],
sources=[
 'Google, <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">Site Reliability Engineering, chapter 6: Monitoring Distributed Systems</a>. The four golden signals and symptom-based alerting.',
],
)
