GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["terraform-summary"] = {
  label: "assistant's summary of the Terraform it wrote",
  source: '<b>What you asked</b> “Write Terraform for an S3 bucket to store nightly database exports, readable by the reporting service, and summarise what it does.”<br><b>What you also have</b> The output of <code>terraform plan</code> for the generated code against the staging account.',
  claims: [
    { t: "Creates one S3 bucket named acme-db-exports-staging.", v: "ok", why: "The plan shows exactly one bucket to create, with that name." },
    { t: "Blocks all public access to the bucket.", v: "bad", why: "The code sets block_public_acls but leaves block_public_policy and restrict_public_buckets false, and the bucket policy allows Principal \"*\" for GetObject. The plan shows it. This bucket would be readable by anyone." },
    { t: "Grants the reporting service read-only access.", v: "partial", why: "The IAM policy grants s3:* on the bucket, which includes delete and overwrite. Read-only would be s3:GetObject and s3:ListBucket." },
    { t: "Encrypts data at rest.", v: "ok", why: "The plan shows server-side encryption configured. Check whether your policy requires your own key rather than the default." },
    { t: "Deletes exports older than 30 days.", v: "none", why: "There's no lifecycle rule anywhere in the code or the plan. The summary describes what you asked for, not what it wrote." },
    { t: "Makes no changes to existing resources.", v: "partial", why: "The plan shows one resource to change: the shared logging bucket's policy is replaced, not appended to. That could break logging for other services." }
  ],
  after: "The plan is the truth; the summary is a description. Read the plan for every create, change and destroy, and let policy checks catch public access and wide permissions before a person has to."
};
GW.lesson({
  id: "ops-iac",
  reviewed: "2026-11",
  lede: "Infrastructure as code is a natural fit for AI: it's text, it follows patterns, and there's a lot of it. It's also where a small mistake can expose data or take down a service. This lesson covers reviewing generated Terraform, Kubernetes and pipeline config through plans, policy checks and least-privilege defaults, so the safety doesn't depend on reading every line perfectly.",
  outcomes: [
    "Review generated infrastructure code through its plan, not its summary.",
    "Recognise the risky defaults generated config often contains: public access, wide permissions, missing limits.",
    "Use policy as code to catch common mistakes automatically.",
    "Keep AI tools' own access to infrastructure at least privilege.",
    "Review an AI-generated infrastructure change by reading the plan, not the summary."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>You ask an assistant to “add a bucket for nightly exports”. It writes 40 lines of Terraform and a summary: “Creates a private S3 bucket with encryption and versioning.” The pull request is approved within minutes; the summary is exactly what was asked for.</p>
<p>The plan shows something else as well: the change also replaces an existing IAM policy with a broader one, because the assistant copied a pattern from elsewhere in the repository. Summaries describe intent. Plans show what will actually happen. This lesson is about reviewing the second.</p></div>
<div class="check warmup" data-a="2"><p class="q">An AI summary says a Terraform change “only adds a private bucket”. What should you review?</p><ul>
<li data-fb="Summaries describe intent and can miss side effects.">The summary, since it was generated from the code and describes the change accurately.</li>
<li data-fb="The code doesn't show everything the plan will change.">The Terraform code alone, line by line, before the plan is generated.</li>
<li data-fb="Right. The plan is what will happen.">The plan output, especially anything replaced or destroyed.</li>
<li data-fb="Messages describe; they don't verify.">The commit message, which should list every resource that's affected.</li>
</ul></div>
<h2>Where AI helps with infrastructure code</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting Terraform, Kubernetes manifests and pipeline config</td><td><span class="fit good">Good fit</span></td><td>Fast and usually close. Review through the plan or a dry run, never just by reading.</td></tr>
<tr><td>Explaining existing config or a plan</td><td><span class="fit good">Good fit</span></td><td>Good for unfamiliar modules. Check key claims against the plan output.</td></tr>
<tr><td>Writing policy rules</td><td><span class="fit good">Good fit</span></td><td>Turns “no public buckets” into a rule quickly. Test the rule against good and bad examples.</td></tr>
<tr><td>Upgrading providers or API versions</td><td><span class="fit care">Use with care</span></td><td>Knows common migrations; may not know recent changes (lesson 3). Read the release notes.</td></tr>
<tr><td>Applying changes to production</td><td><span class="fit human">Keep human</span></td><td>A person approves the plan. AI tools shouldn't hold apply rights.</td></tr>
</tbody></table></div>

<h2>The plan is the truth</h2>
<p><code>terraform plan</code> compares your configuration with what exists and shows the changes it would make, without making them.<sup>[1]</sup> That makes it the right thing to review: not what the assistant says it wrote, not even the code alone, but what will actually be created, changed and destroyed. Kubernetes has equivalents in <code>kubectl diff</code> and server-side dry runs.</p>
<p>Saving the plan with <code>-out</code> and applying exactly that file means what was reviewed is what gets applied. Note that a saved plan contains your configuration and values in cleartext, including sensitive ones, so treat it as a secret.<sup>[1]</sup></p>

<h2>Worked example: an export bucket</h2>
<p>You asked an assistant for a bucket to store nightly database exports, readable by the reporting service. It wrote the Terraform and a tidy summary. You've also run the plan.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the summary against the plan</span></div><div class="activity-b">
<p>Flag every statement the plan doesn't support.</p>
<div data-w="claims" data-cfg="terraform-summary"></div>
</div></div>

<ol class="steps">
<li><strong>Public access slipped through</strong>Partial public-access settings plus a wildcard policy make a public bucket full of database exports. This is exactly what a policy check should catch.</li>
<li><strong>“Read-only” was s3:*</strong>Wide permissions are the most common default in generated config. Name the actions you need.</li>
<li><strong>A requested feature was described, not written</strong>Summaries describe intent. Look for each requirement in the plan.</li>
<li><strong>A shared resource was replaced</strong>Any change to something outside the task deserves a hard look. Read every “update” and “destroy” line.</li>
</ol>
<div class="key"><p>Review infrastructure by what it will do, not by what it says. Let automated policy checks catch the common mistakes, and keep people for the judgment calls.</p></div>

<h2>Policy as code</h2>
<p>Some rules should never depend on a reviewer noticing: no public storage, no wildcard permissions, resource limits on every container, encryption on every volume. Open Policy Agent is a widely used engine for writing such rules (in its language, Rego) and checking plans and manifests against them in CI.<sup>[2]</sup> Cloud providers and other tools offer similar checks.</p>
<p>AI is good at drafting these rules. Test each one against a known-bad example that should fail and a known-good one that should pass, just as you'd test code.</p>

<h2>Least privilege, for config and for agents</h2>
<ul>
<li><strong>In the config:</strong> name the actions and resources needed. Ask the assistant to justify every wildcard.</li>
<li><strong>For the AI tools themselves:</strong> an agent that writes infrastructure code needs to read state and run plans, not apply them. Keep apply rights with the pipeline and an approving person (lesson 7).</li>
<li><strong>Separate environments:</strong> a tool working in staging shouldn't hold credentials for production.</li>
</ul>

<h2>Reading a plan</h2>
<p>A Terraform plan lists every resource that will be created, changed, replaced or destroyed. Read it in that order of risk: destroy and replace first (data loss, downtime), then changes to IAM, networking and public access, then everything else. Saved plans are safer than speculative ones: what you approve is exactly what gets applied.[1] Ask the assistant to summarise the plan, not the code, and to list every replace, destroy and permission change separately.</p>
<h2>Worked example: the export bucket</h2>
<div class="tbl"><table><thead><tr><th>Plan line</th><th>Risk</th><th>Action</th></tr></thead><tbody>
<tr><td><code>+ aws_s3_bucket.exports</code></td><td>Low</td><td>Expected</td></tr>
<tr><td><code>+ aws_s3_bucket_public_access_block.exports</code></td><td>Low</td><td>Good: blocks public access</td></tr>
<tr><td><code>-/+ aws_iam_policy.reporting</code> (forces replacement)</td><td>High</td><td>Unexpected: not part of the request</td></tr>
<tr><td><code>~ policy: "s3:GetObject" → "s3:*"</code> on <code>Resource: "*"</code></td><td>High</td><td>Broadens access to every bucket: reject</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Two of four lines weren't requested</strong>, and one grants full S3 access everywhere.</li>
<li><strong>Policy as code catches this automatically.</strong> A rule like “no IAM policy may grant s3:* on *” fails the pipeline before review.[2]</li>
<li><strong>Least privilege applies to the assistant too:</strong> it should be able to propose plans, not apply them.</li>
</ul>
<h2>Your turn: review a plan</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">What would you approve?</span></div><div class="activity-b">
<p>A change was requested to “increase the API's instance count from 2 to 4”. The plan shows: <code>~ aws_autoscaling_group.api: desired_capacity 2 → 4</code>; <code>-/+ aws_launch_template.api (forces replacement)</code> because the AMI changed to the latest image; <code>~ aws_security_group.api: ingress 0.0.0.0/0 port 22 added</code>. What do you approve, what do you reject, and why?</p>
<div data-w="task" data-key="ops-plan">
<div class="task-model"><ul>
<li><strong>Approve:</strong> desired capacity 2 → 4. It's the requested change.</li>
<li><strong>Question:</strong> launch template replacement with a new AMI. Not requested; it will roll every instance onto an untested image. Separate it into its own change, tested in staging.</li>
<li><strong>Reject:</strong> SSH (port 22) open to the whole internet. A serious exposure, not requested; remove it.</li>
</ul><p>Ask for the change to be split so the PR contains only the capacity change, and add a policy rule blocking 0.0.0.0/0 on port 22.</p></div>
<ul class="task-rubric">
<li>Approves only the requested change</li>
<li>Flags the unrequested replacement and its rollout risk</li>
<li>Rejects SSH open to the internet</li>
<li>Asks for unrelated changes to be split out</li>
<li>Proposes a policy-as-code rule to prevent recurrence</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Reviewing code without the plan.</strong> The same code does different things against different state.</li>
<li><strong>Hard-coded secrets.</strong> Generated examples often include placeholder keys that become real ones. Use a secrets manager.</li>
<li><strong>Missing resource limits.</strong> Generated Kubernetes manifests often omit CPU and memory limits.</li>
<li><strong>Outdated syntax.</strong> Providers change often. Check deprecation warnings in the plan.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Ask an assistant to write one policy rule your team cares about, such as “no storage buckets with public access”. Test it against a deliberately bad config and a good one, then add it to CI.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>If the code looks right, the plan will match.</dt><dd>Provider defaults, drift and shared modules change what applies. Read the plan.</dd>
<dt>AI-generated IaC follows best practices by default.</dt><dd>It copies patterns, including bad ones from your own repository.</dd>
<dt>Review catches over-broad permissions.</dt><dd>Reviewers miss them in long diffs. Policy as code catches them every time.</dd>
<dt>Letting an agent apply changes saves time.</dt><dd>Applying is where mistakes become incidents. Let agents propose; people apply.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>The plan, not the summary or the code, is what will happen.</li>
<li>Read destroys and replacements first, then IAM, networking and public access.</li>
<li>Split unrequested changes into separate pull requests.</li>
<li>Use policy as code to block dangerous patterns automatically.</li>
<li>Give AI tools permission to plan, not to apply.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">Which plan line deserves attention first?</p><ul>
<li data-fb="Right. Replacement can mean data loss or downtime.">A resource marked “forces replacement” on a database.</li>
<li data-fb="Low risk.">A new tag added to an existing resource for cost tracking.</li>
<li data-fb="Low risk, and expected.">A new bucket with public access blocked and encryption on.</li>
<li data-fb="Cosmetic.">A change to a resource's description field.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why prefer saved plans over speculative ones?</p><ul>
<li data-fb="Speed isn't the reason.">Saved plans run faster in most continuous integration pipelines.</li>
<li data-fb="They can.">Speculative plans can't show IAM changes at all.</li>
<li data-fb="They still need review.">Saved plans don't require any review before they're applied.</li>
<li data-fb="Right. No drift between review and apply.">What you approve is exactly what gets applied.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An IAM change grants s3:* on all resources. What should happen?</p><ul>
<li data-fb="Over-broad access is a serious risk.">Approve it, since broader access avoids permission errors later in production.</li>
<li data-fb="Later rarely comes.">Approve it, and narrow the permissions in a later change when there's time.</li>
<li data-fb="Right. Fix now and prevent recurrence.">Reject it, and add a policy rule that blocks it in future.</li>
<li data-fb="Check the requirement yourself.">Ask the assistant whether the broader permission is actually needed.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What does policy as code add to code review?</p><ul>
<li data-fb="It complements review.">It replaces human review of infrastructure changes entirely.</li>
<li data-fb="Right. Consistent enforcement reviewers can miss.">It automatically blocks known dangerous patterns every time.</li>
<li data-fb="Doesn't change plans.">It makes Terraform plans shorter and easier to read for reviewers.</li>
<li data-fb="Not its purpose.">It lets AI tools apply changes without supervision.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What permission should an AI infrastructure assistant have?</p><ul>
<li data-fb="Right. People apply.">Propose code and generate plans, but not apply them.</li>
<li data-fb="Turns mistakes into incidents.">Full apply rights in staging and production to save time.</li>
<li data-fb="Timing doesn't remove the risk.">Apply rights in production only during business hours.</li>
<li data-fb="Least privilege applies to tools too.">Whatever the engineer using it has, for simplicity.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>HashiCorp, <a href="https://developer.hashicorp.com/terraform/cli/commands/plan" target="_blank" rel="noopener">terraform plan command reference</a>. Speculative and saved plans, and why saved plans are sensitive.</li>
<li>Open Policy Agent, <a href="https://www.openpolicyagent.org/docs/latest/" target="_blank" rel="noopener">documentation</a>. A general-purpose policy engine and the Rego language.</li>
</ol></section>
`
});
