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
  lede: "Infrastructure as code is a natural fit for AI: it's text, it follows patterns, and there's a lot of it. It's also where a small mistake can expose data or take down a service. This lesson covers reviewing generated Terraform, Kubernetes and pipeline config through plans, policy checks and least-privilege defaults, so the safety doesn't depend on reading every line perfectly.",
  outcomes: [
    "Review generated infrastructure code through its plan, not its summary.",
    "Recognise the risky defaults generated config often contains: public access, wide permissions, missing limits.",
    "Use policy as code to catch common mistakes automatically.",
    "Keep AI tools' own access to infrastructure at least privilege."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Reviewing code without the plan.</strong> The same code does different things against different state.</li>
<li><strong>Hard-coded secrets.</strong> Generated examples often include placeholder keys that become real ones. Use a secrets manager.</li>
<li><strong>Missing resource limits.</strong> Generated Kubernetes manifests often omit CPU and memory limits.</li>
<li><strong>Outdated syntax.</strong> Providers change often. Check deprecation warnings in the plan.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Ask an assistant to write one policy rule your team cares about, such as “no storage buckets with public access”. Test it against a deliberately bad config and a good one, then add it to CI.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">What's the most reliable thing to review before applying AI-generated Terraform?</p><ul>
<li data-fb="Summaries describe intent and can be wrong.">The assistant's summary of what it wrote.</li>
<li data-fb="Right. The plan shows what will actually be created, changed and destroyed.">The output of terraform plan against the target environment.</li>
<li data-fb="Formatting doesn't tell you what it does.">Whether the code passes terraform fmt.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">A generated IAM policy grants s3:* for a service that only reads files. What should you do?</p><ul>
<li data-fb="It's not fine: s3:* includes delete and overwrite.">Accept it; the service is internal.</li>
<li data-fb="Monitoring doesn't prevent misuse.">Accept it and monitor usage.</li>
<li data-fb="Right. Least privilege: name only the actions needed.">Replace it with only the read actions the service needs.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which permissions should an AI agent that writes infrastructure code have?</p><ul>
<li data-fb="Right. It can propose and preview changes; applying stays with an approved pipeline.">Read state and run plans in non-production, but not apply.</li>
<li data-fb="Too much blast radius for one manipulated or mistaken step.">Full admin, so it can fix problems quickly.</li>
<li data-fb="It needs some access to be useful.">No access at all.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>HashiCorp, <a href="https://developer.hashicorp.com/terraform/cli/commands/plan" target="_blank" rel="noopener">terraform plan command reference</a>. Speculative and saved plans, and why saved plans are sensitive.</li>
<li>Open Policy Agent, <a href="https://www.openpolicyagent.org/docs/latest/" target="_blank" rel="noopener">documentation</a>. A general-purpose policy engine and the Rego language.</li>
</ol></section>
`
});
