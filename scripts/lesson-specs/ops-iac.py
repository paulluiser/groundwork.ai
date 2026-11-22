SPEC = dict(
file="13-2-ops-iac.js",
reviewed="2026-11",
outcomes=["Review an AI-generated infrastructure change by reading the plan, not the summary."],
situation="""<p>You ask an assistant to “add a bucket for nightly exports”. It writes 40 lines of Terraform and a summary: “Creates a private S3 bucket with encryption and versioning.” The pull request is approved within minutes; the summary is exactly what was asked for.</p>
<p>The plan shows something else as well: the change also replaces an existing IAM policy with a broader one, because the assistant copied a pattern from elsewhere in the repository. Summaries describe intent. Plans show what will actually happen. This lesson is about reviewing the second.</p>""",
warmup=dict(q="An AI summary says a Terraform change “only adds a private bucket”. What should you review?", a=2, opts=[
  ("The summary, since it was generated from the code and describes the change accurately.", "Summaries describe intent and can miss side effects."),
  ("The Terraform code alone, line by line, before the plan is generated.", "The code doesn't show everything the plan will change."),
  ("The plan output, especially anything replaced or destroyed.", "Right. The plan is what will happen."),
  ("The commit message, which should list every resource that's affected.", "Messages describe; they don't verify."),
 ]),
sections="""<h2>Reading a plan</h2>
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
</div></div></div>""",
myths=[
 ("If the code looks right, the plan will match.", "Provider defaults, drift and shared modules change what applies. Read the plan."),
 ("AI-generated IaC follows best practices by default.", "It copies patterns, including bad ones from your own repository."),
 ("Review catches over-broad permissions.", "Reviewers miss them in long diffs. Policy as code catches them every time."),
 ("Letting an agent apply changes saves time.", "Applying is where mistakes become incidents. Let agents propose; people apply."),
],
recap=[
 "The plan, not the summary or the code, is what will happen.",
 "Read destroys and replacements first, then IAM, networking and public access.",
 "Split unrequested changes into separate pull requests.",
 "Use policy as code to block dangerous patterns automatically.",
 "Give AI tools permission to plan, not to apply.",
],
checks=[
 dict(q="Which plan line deserves attention first?", a=0, opts=[
  ("A resource marked “forces replacement” on a database.", "Right. Replacement can mean data loss or downtime."),
  ("A new tag added to an existing resource for cost tracking.", "Low risk."),
  ("A new bucket with public access blocked and encryption on.", "Low risk, and expected."),
  ("A change to a resource's description field.", "Cosmetic."),
 ]),
 dict(q="Why prefer saved plans over speculative ones?", a=3, opts=[
  ("Saved plans run faster in most continuous integration pipelines.", "Speed isn't the reason."),
  ("Speculative plans can't show IAM changes at all.", "They can."),
  ("Saved plans don't require any review before they're applied.", "They still need review."),
  ("What you approve is exactly what gets applied.", "Right. No drift between review and apply."),
 ]),
 dict(q="An IAM change grants s3:* on all resources. What should happen?", a=2, opts=[
  ("Approve it, since broader access avoids permission errors later in production.", "Over-broad access is a serious risk."),
  ("Approve it, and narrow the permissions in a later change when there's time.", "Later rarely comes."),
  ("Reject it, and add a policy rule that blocks it in future.", "Right. Fix now and prevent recurrence."),
  ("Ask the assistant whether the broader permission is actually needed.", "Check the requirement yourself."),
 ]),
 dict(q="What does policy as code add to code review?", a=1, opts=[
  ("It replaces human review of infrastructure changes entirely.", "It complements review."),
  ("It automatically blocks known dangerous patterns every time.", "Right. Consistent enforcement reviewers can miss."),
  ("It makes Terraform plans shorter and easier to read for reviewers.", "Doesn't change plans."),
  ("It lets AI tools apply changes without supervision.", "Not its purpose."),
 ]),
 dict(q="What permission should an AI infrastructure assistant have?", a=0, opts=[
  ("Propose code and generate plans, but not apply them.", "Right. People apply."),
  ("Full apply rights in staging and production to save time.", "Turns mistakes into incidents."),
  ("Apply rights in production only during business hours.", "Timing doesn't remove the risk."),
  ("Whatever the engineer using it has, for simplicity.", "Least privilege applies to tools too."),
 ]),
],
)
