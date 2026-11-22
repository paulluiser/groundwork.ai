GW.lesson({
  id: "operations",
  reviewed: "2026-11",
  lede: "Operations work happens under pressure: an alert at 3 a.m., an outage customers can see, a fix that has to be right first time. AI can read logs faster than you and suggest commands in seconds. This lesson is about using that speed without adding risk.",
  outcomes: [
    "Use AI to generate incident hypotheses that are tied to evidence in your logs.",
    "Classify suggested commands by blast radius before running anything.",
    "Turn AI-drafted runbooks into tested procedures.",
    "Draft blameless postmortems whose timeline and causes come from evidence.",
    "Turn an AI-drafted runbook into a tested one, with verification and rollback for each step."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>An alert fires at 2 a.m.: API error rate at 18%. You paste the alert and the last 200 log lines into an assistant. Within seconds it suggests a cause (connection pool exhaustion), a fix (restart the pods and raise the pool size), and a command to do both. It sounds exactly like the senior engineer who isn't on call tonight.</p>
<p>It might be right. If it isn't, a restart during a database failover could make the outage worse. This lesson is about using AI to think faster during incidents without letting it act faster than you can check.</p></div>
<div class="check warmup" data-a="1"><p class="q">During an incident, an assistant suggests a command that changes production. What should you do first?</p><ul>
<li data-fb="Speed matters; a wrong change can make it worse.">Run it immediately, since speed matters most during an outage and it sounds correct.</li>
<li data-fb="Right. Know the effect and the rollback first.">Check what it changes and how you'd undo it before running it.</li>
<li data-fb="Its confidence isn't verification.">Ask the assistant whether it's confident enough in the command to run it in production.</li>
<li data-fb="The outage needs action; check, don't stall.">Wait until the morning and ask a senior engineer to review the command properly.</li>
</ul></div>
<h2>Where AI meets operations work</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Explaining unfamiliar logs, config and error codes</td><td><span class="fit good">Good fit</span></td><td>Fast orientation in someone else's system. Confirm against the vendor docs.</td></tr>
<tr><td>Writing log and metrics queries</td><td><span class="fit good">Good fit</span></td><td>Read-only, so low risk. Sanity-check results against a dashboard.</td></tr>
<tr><td>Drafting runbooks from notes</td><td><span class="fit good">Good fit</span></td><td>Good structure. Test every step in a non-production environment before relying on it.</td></tr>
<tr><td>Incident hypotheses from logs and metrics</td><td><span class="fit care">Use with care</span></td><td>Demand the evidence lines; check they exist.</td></tr>
<tr><td>Suggested remediation commands</td><td><span class="fit care">Use with care</span></td><td>Classify by blast radius before running. Check flags and context.</td></tr>
<tr><td>Scripts and infrastructure-as-code changes</td><td><span class="fit care">Use with care</span></td><td>Plan or dry-run first; review the diff like any change.</td></tr>
<tr><td>Postmortem drafts</td><td><span class="fit care">Use with care</span></td><td>Timeline from monitoring timestamps; causes confirmed with the people involved.</td></tr>
<tr><td>Automated remediation in production</td><td><span class="fit human">Keep human</span></td><td>Gate it behind explicit approval, tight permissions and logging (lesson 7).</td></tr>
</tbody></table></div>

<h2>Worked example: an incident in progress</h2>
<p>At 14:07 the checkout error rate jumps from 0.2% to 9%. You're on call. You pull the relevant log lines, remove tokens and customer identifiers, and ask an assistant for help.</p>
<pre class="code">14:01:40 INFO  deploy pricing v1.19.0 complete (4/4 pods ready)
14:03:12 INFO  deploy checkout v2.41.0 complete (6/6 pods ready)
14:04:55 WARN  checkout-7f9c pricing client: GET http://pricing:8080/v2/quote failed: connection refused
14:04:56 ERROR checkout-7f9c POST /api/checkout 502 upstream_error=pricing
14:05:30 ERROR checkout-2b1d POST /api/checkout 502 upstream_error=pricing
14:06:02 INFO  pricing-5d8a listening on :8081</pre>
<div class="draft prompt"><div class="draft-h"><span><b>Request</b></span></div><div class="draft-b">Checkout error rate rose from 0.2% to 9% at 14:07. Logs above. Database CPU and latency are normal.

Give up to 3 hypotheses, most likely first. For each:
- the exact log lines that support it (copy them)
- what would rule it out
- one read-only command or query to test it

Do not suggest any command that changes state.</div></div>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · incident hypotheses</span></div><div class="draft-b">
<p><b>H1. The checkout v2.41.0 deploy introduced a bad pricing configuration.</b> The errors started a minute after the checkout deploy. Evidence: <code>14:03:12 deploy checkout v2.41.0 complete</code>, <code>14:04:56 … 502 upstream_error=pricing</code>. Test: compare the pricing URL in the old and new checkout config.</p>
<p><b>H2. Pricing now listens on a different port.</b> Evidence: <code>14:06:02 pricing-5d8a listening on :8081</code>, while checkout calls <code>pricing:8080</code>. Test: <code>kubectl get svc pricing -n pricing -o yaml</code> and check the target port.</p>
<p><b>H3. Database connection pool exhaustion in checkout.</b> Evidence: <code>14:05:10 ERROR checkout pool exhausted (max=20)</code>. Test: check the pool metrics dashboard.</p></div>
<div class="review">
<div class="r"><span class="stamp warn">Ranked by timing</span><span>H1 is first because it's closest in time, the most typical pattern. But nothing in the evidence points at checkout's config.</span></div>
<div class="r"><span class="stamp ok">Best supported</span><span>H2 is backed by a real log line: pricing deployed at 14:01 and now listens on 8081; checkout still calls 8080. “Connection refused” fits exactly.</span></div>
<div class="r"><span class="stamp bad">Invented evidence</span><span>The “pool exhausted” line in H3 isn't in the logs you gave it. Database metrics were also normal. Discard H3.</span></div>
</div></div>
<p>Step by step, what the on-call engineer does next:</p>
<ol class="steps">
<li><strong>Check that every cited line exists</strong>Searching the pasted logs finds H1's and H2's lines but not H3's. One invented line is enough to discard a hypothesis.</li>
<li><strong>Rank by evidence, not by timing or tone</strong>H2 explains “connection refused” directly. H1 is plausible only because deploys often cause incidents.</li>
<li><strong>Run the read-only test</strong>The pricing service's target port is still 8080, but the new pricing pods listen on 8081. H2 confirmed.</li>
<li><strong>Mitigate following the runbook</strong>The runbook says: roll back the most recent change to the failing dependency. That's pricing, not checkout. Rolling back checkout, which H1 suggested, would have changed nothing and cost ten more minutes of errors. The rollback is a state change, so it follows the runbook's approval step.</li>
<li><strong>Record as you go</strong>Note timestamps of each action in the incident channel. They become the postmortem timeline.</li>
</ol>
<div class="key"><p>In an incident, AI is a fast reader and a hypothesis generator. Evidence decides the ranking, the runbook decides the action, and a person approves anything that changes production.</p></div>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Classify the suggested commands</span></div><div class="activity-b">
<p>During the incident, an assistant suggests these commands. Sort each by what it could do to production. Assume your terminal is connected to the production cluster.</p>
<div data-w="sort" data-cfg="ops-commands"></div>
</div></div>
<p>Before running even a read-only command, check two things the model can't see: <strong>which cluster and account your terminal is pointed at</strong>, and <strong>whether the flags exist in your tool's version</strong>. Plausible but invented flags are common, and some tools silently ignore unknown options.</p>

<h2>Runbooks: from draft to tested</h2>
<p>AI is good at turning a messy set of notes into a clear, step-by-step <a class="term" data-t="runbook">runbook</a>. A runbook is only trustworthy once it has been run:</p>
<ol class="steps">
<li><strong>Draft</strong>Give it your notes, the relevant commands you've actually used, and your environment details. Ask it to mark any step it inferred rather than took from your notes.</li>
<li><strong>Review</strong>The service owner checks every command, flag and expected output.</li>
<li><strong>Test</strong>Run it end to end in staging, or in a game day exercise. Fix what doesn't match reality.</li>
<li><strong>Keep it versioned</strong>Store it alongside the code or config it relates to, with an owner and a review date.</li>
</ol>

<h2>Postmortems</h2>
<p>A blameless <a class="term" data-t="postmortem">postmortem</a> focuses on how the system and process allowed the incident, not on who made a mistake.<sup>[1]</sup> AI can save hours on the write-up, with two cautions:</p>
<ul>
<li><strong>The timeline comes from timestamps.</strong> Build it from monitoring, deploy logs and the incident channel, not from anyone's memory or a model's reconstruction. Ask the assistant to list every event with its source.</li>
<li><strong>Beware the neat root cause.</strong> Models produce a tidy single cause because that's the common story shape. Real incidents usually have several contributing factors: here, a port change without a matching service update, no contract test between the services, and an alert threshold that took four minutes to fire. Confirm factors with the people involved.</li>
</ul>
<p>Watch the language too. AI drafts easily slip into blame (“the engineer failed to update the service”). Rewrite as system facts (“the deploy process didn't check that the service and pods agreed on a port”).</p>

<h2>Read-only first</h2>
<p>A useful rule during incidents: AI suggestions that read (logs, metrics, describe commands) can run freely; anything that changes state (restarts, scaling, config, deletes) needs a person to confirm what it does and how to undo it. Ask the assistant to label each suggested command as read-only or changing, and to give the rollback for any change. Monitoring basics still apply: start from the symptoms users feel, such as latency, errors and saturation, before chasing causes.[4]</p>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Secrets in logs.</strong> Logs often contain tokens in URLs, auth headers and customer data. Redact before pasting (lesson 8).</li>
<li><strong>Wrong context.</strong> A correct command run against the wrong cluster or account is an incident of its own.</li>
<li><strong>Destructive “fixes”.</strong> Deleting, scaling to zero or force-applying can make a symptom disappear and create a bigger outage.</li>
<li><strong>Unattended automation.</strong> An agent with production write access and no approval step is a large blast radius (lesson 7).</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take the log excerpt from a recent, resolved incident. Ask for hypotheses using the evidence-demanding brief above. Check every cited line. Did its top hypothesis match the real cause? Did it cite any line that doesn't exist?</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>The AI read the logs, so its diagnosis is grounded.</dt><dd>It read the 200 lines you pasted. The cause may be in logs it didn't see. Check the hypothesis against more evidence.</dd>
<dt>Runbooks drafted by AI are ready to use.</dt><dd>Untested runbooks fail when you need them most. Test every step in staging.</dd>
<dt>Giving the assistant cluster access speeds up incidents.</dt><dd>Read-only access can help. Write access during an incident turns a wrong suggestion into an outage.</dd>
<dt>Blameless postmortems don't need precise timelines.</dt><dd>Blameless is about people, not vagueness. Timelines need sources.[1]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Let AI run read-only commands; confirm effect and rollback for anything that changes state.</li>
<li>Start from user-facing symptoms; treat AI diagnoses as hypotheses.</li>
<li>Runbook steps need conditions, explicit targets, verification and rollback.</li>
<li>Test runbooks in staging and record when.</li>
<li>Postmortem timelines cite logs and records, not summaries.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="3"><p class="q">Which suggested command can safely run without extra confirmation during an incident?</p><ul>
<li data-fb="Changes state; can worsen some incidents.">kubectl rollout restart deploy/api, since restarts are usually harmless.</li>
<li data-fb="Changes state and cost.">Scaling the database to a larger instance size to add headroom.</li>
<li data-fb="Changes state.">Deleting old pods that look stuck in a crash loop.</li>
<li data-fb="Right. Read-only.">kubectl get pods -n prod to see their status.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why add a “When” condition to a runbook step?</p><ul>
<li data-fb="Right. The same fix can harm in a different failure.">So the step isn't run in situations where it makes things worse.</li>
<li data-fb="Not the reason.">Because runbook templates require a condition field for every step.</li>
<li data-fb="Conditions are for the person on call.">So the assistant can decide automatically when to run the step.</li>
<li data-fb="Length isn't the goal.">To make the runbook longer and look more thorough to auditors.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An AI diagnosis is based on 200 pasted log lines. How should you treat it?</p><ul>
<li data-fb="It saw a fraction of the evidence.">As confirmed, since it came directly from the logs you gave it.</li>
<li data-fb="It may well be right; check it.">As wrong, since AI can't diagnose production incidents reliably.</li>
<li data-fb="Right. Use it to direct the investigation.">As a hypothesis to test against metrics and other logs.</li>
<li data-fb="It needs checking first.">As a starting point for the postmortem write-up.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What makes a runbook step safe to run at 2 a.m.?</p><ul>
<li data-fb="Tone doesn't make a step safe.">Clear formatting and a confident tone that reassures the person on call.</li>
<li data-fb="Right. The on-call person can act and recover.">A condition, explicit command, verification and rollback.</li>
<li data-fb="Not a safety check.">Approval from the AI tool that generated the step in the first place.</li>
<li data-fb="Useful, but not enough.">A link to the vendor's documentation for every command used.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why limit an AI assistant to read-only access during incidents?</p><ul>
<li data-fb="Cost isn't the reason.">Read-only access is cheaper on most AI platforms and keeps costs down.</li>
<li data-fb="Not the reason.">Write access makes the assistant respond more slowly to requests.</li>
<li data-fb="No such general ban.">Regulations ban AI from changing production systems in every industry.</li>
<li data-fb="Right. Keep a person in front of changes.">A wrong suggestion with write access becomes a change to production.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Google, <a href="https://sre.google/sre-book/postmortem-culture/" target="_blank" rel="noopener">Site Reliability Engineering, chapter 15: Postmortem Culture: Learning from Failure</a>.</li>
<li>Kubernetes, <a href="https://kubernetes.io/docs/reference/kubectl/" target="_blank" rel="noopener">kubectl reference</a>. Check flags and behaviour for your version.</li>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>, on excessive agency in automated tools.</li>

<li>Google, <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">Site Reliability Engineering, chapter 6: Monitoring Distributed Systems</a>. The four golden signals and symptom-based alerting.</li>
</ol></section>
`
});
