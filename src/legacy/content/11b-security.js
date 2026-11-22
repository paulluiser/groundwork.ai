GW.lesson({
  id: "security",
  reviewed: "2026-11",
  lede: "Security work has two AI jobs now: using AI to find and fix weaknesses faster, and securing the AI features your company ships. Both depend on the same habit: an AI finding is a lead to investigate, never a verdict.",
  outcomes: [
    "Use AI to widen threat modelling, code review and triage, and verify every finding before acting on it.",
    "Tell an AI false positive from a real issue, and spot the issue it missed.",
    "Explain why a passing AI review is not evidence of security.",
    "Review an AI feature for the risks specific to it: injection, excessive agency, data leakage and unsafe output handling.",
    "Triage AI security findings into confirmed, needs proof, and false positive, with evidence for each."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>An AI code scanner opens 47 security findings on your main service overnight. Eleven are marked critical. The development team asks which ones are real, because last quarter's tool produced 200 findings and three of them mattered.</p>
<p>AI can read code faster than any security team. It also reports plausible weaknesses that aren't reachable, and misses the ones that depend on how your system is actually used. This lesson is about turning a pile of AI findings into a short list of real ones, with proof.</p></div>
<div class="check warmup" data-a="3"><p class="q">An AI tool reports a SQL injection in a function. What turns this into a confirmed finding?</p><ul>
<li data-fb="Severity is the tool's estimate, not proof.">The tool's severity rating of critical.</li>
<li data-fb="Two tools can share the same pattern-matching mistake.">A second AI tool reporting the same issue.</li>
<li data-fb="Concatenation is a lead, not proof of reachability.">The function building its query with string concatenation somewhere.</li>
<li data-fb="Right. Proof of a reachable, exploitable path confirms it.">Showing that user input reaches the query unsanitised.</li>
</ul></div>
<h2>Where AI meets security work</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Threat-modelling brainstorms</td><td><span class="fit good">Good fit</span></td><td>Breadth: lists threat categories you might skip. You decide which apply to your architecture.</td></tr>
<tr><td>Explaining unfamiliar code, configs and advisories</td><td><span class="fit good">Good fit</span></td><td>Fast orientation. Check version-specific details against the advisory itself.</td></tr>
<tr><td>Drafting detection rules and queries</td><td><span class="fit good">Good fit</span></td><td>Saves syntax lookups. Test every rule against known-good and known-bad samples before deploying.</td></tr>
<tr><td>Code review for vulnerabilities</td><td><span class="fit care">Use with care</span></td><td>Finds real issues and invents others. Reproduce each finding; keep your scanners and human review.</td></tr>
<tr><td>Triaging alerts and logs</td><td><span class="fit care">Use with care</span></td><td>Good at summarising volume. Plausible root causes are not evidence; check timestamps and raw events. Use only approved tools for production logs.</td></tr>
<tr><td>Writing security fixes</td><td><span class="fit care">Use with care</span></td><td>Generated fixes can be incomplete or introduce new issues. Test the exploit before and after.</td></tr>
<tr><td>Risk acceptance, incident severity, disclosure decisions</td><td><span class="fit human">Keep human</span></td><td>Accountability, legal duties and judgment about your organisation.</td></tr>
</tbody></table></div>
<p>A note on code AI writes: a 2021 study of an early coding assistant found that about 40% of its suggestions in security-relevant scenarios contained a vulnerability.<sup>[1]</sup> Tools have improved, but the lesson holds: generated code needs the same security review as any other code, and sometimes more, because it arrives faster than people read it.</p>

<h2>Worked example: an AI security review</h2>
<p>An engineer asks an assistant to security-review a new endpoint before release. The endpoint uses the app's own <code>requireLogin</code> middleware and a parameterised database query. The review comes back confident and well organised.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Review the reviewer</span></div><div class="activity-b">
<p>Read the code, then flag every finding in the AI review that is wrong, invented or would mislead the team. Reveal the review when you're done.</p>
<div data-w="claims" data-cfg="sec-review"></div>
</div></div>

<p>What went wrong, and why it's typical:</p>
<ol class="steps">
<li><strong>A false positive came first</strong>“SQL injection” is the most common finding in security writing, so it is a likely continuation for any code with a query in it. But the <code>$1</code> placeholder sends the ID as data, not as SQL. A <a class="term" data-t="false-positive">false positive</a> like this costs time and, worse, trains people to ignore the tool.</li>
<li><strong>The real issue was dismissed</strong>The route checks that someone is logged in (<a class="term" data-t="authentication">authentication</a>), but not that this invoice is theirs (<a class="term" data-t="authorization">authorization</a>). Any customer can read any invoice by changing the number in the URL. This is the top risk in the OWASP API Security list.<sup>[2]</sup> The fix is one condition: <code>AND customer_id = $2</code> with the logged-in user's ID.</li>
<li><strong>A capability was invented</strong><code>requireLogin</code> is this application's own middleware. The model guessed what it does from its name.</li>
<li><strong>The verdict followed the findings it had</strong>Having missed the serious issue, the review rated the endpoint low risk. A clean AI review is the absence of findings from one fallible reviewer, not evidence of security.</li>
</ol>
<div class="key"><p>Treat every AI security finding as a hypothesis: reproduce it before you fix it. Treat a clean AI review as one reviewer's opinion: it never replaces your scanners, tests and people.</p></div>

<h2>Verifying findings</h2>
<p>A workable routine for AI-assisted review:</p>
<ul>
<li><strong>Reproduce before you fix.</strong> Write a failing test or a proof of concept for each finding. If you can't make it fail, it may not be real.</li>
<li><strong>Ask what it checked, not just what it found.</strong> “For each request handler, state how it checks the caller may access this specific record.” Specific questions find what general ones miss.</li>
<li><strong>Give it your context.</strong> Paste the middleware, not just the route. Missing context is where invented behaviour comes from (lesson 2).</li>
<li><strong>Keep the layers.</strong> Static analysis, dependency scanning, tests and human review each catch different things. AI review is one more layer, as secure-development frameworks expect from any single tool.<sup>[3]</sup></li>
</ul>

<h2>Securing the AI features you ship</h2>
<p>Lesson 8 introduced prompt injection. When your product includes an AI feature, the security team reviews a new kind of component, with its own list of risks.<sup>[4]</sup> The questions to ask in a design review:</p>
<div class="tbl"><table>
<thead><tr><th>Risk</th><th>Question to ask</th></tr></thead>
<tbody>
<tr><td>Prompt injection</td><td>What untrusted text reaches the model: user input, web pages, documents, emails, retrieved chunks? What could an instruction hidden there make it do?</td></tr>
<tr><td>Excessive agency</td><td>Which tools can it call, with whose credentials? What is the worst action an injected instruction could trigger (lesson 7)?</td></tr>
<tr><td>Unsafe output handling</td><td>Is model output treated as untrusted input? Is it escaped before rendering, and never executed as code, SQL or a shell command without checks?</td></tr>
<tr><td>Data leakage</td><td>What sensitive data is in the context? Could one user's data appear in another user's answer, or in logs and vendor retention?</td></tr>
<tr><td>Evaluation</td><td>Is there an adversarial test set, re-run on every prompt or model change (lesson 18)?</td></tr>
</tbody></table></div>

<h2>Worked example: triaging three findings</h2>
<div class="tbl"><table><thead><tr><th>AI finding</th><th>Evidence gathered</th><th>Verdict</th></tr></thead><tbody>
<tr><td>Critical: SQL injection in <code>reportFilter()</code></td><td>Input comes only from a fixed dropdown mapped server-side to column names; no user string reaches SQL</td><td>False positive; note the reasoning</td></tr>
<tr><td>High: missing authorisation on <code>GET /invoices/:id</code></td><td>Logged in as user A, requested user B's invoice ID: returned 200 with data</td><td>Confirmed: broken object-level authorisation[2]</td></tr>
<tr><td>Medium: outdated library with a known vulnerability</td><td>The vulnerable function isn't called; upgrade is low-risk</td><td>Needs fix, low urgency</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>The “critical” one was false</strong>, and the confirmed one was rated high. Severity labels aren't verdicts.</li>
<li><strong>Proof is specific and reproducible:</strong> a request, a response, the data you shouldn't see.</li>
<li><strong>Write down why false positives are false</strong>, so the same finding isn't re-triaged next quarter.</li>
</ul>
<h2>Verification standards help</h2>
<p>The OWASP Application Security Verification Standard (ASVS) lists concrete requirements an application should meet, grouped by area (authentication, access control, input handling and so on) and by assurance level.[5] It's a useful way to ask an assistant for targeted reviews (“check this module against ASVS access-control requirements and cite the line for each”), and to check that a review covered the areas that matter instead of only the ones a scanner is good at.</p>
<h2>Your turn: triage a finding</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Is this finding real?</span></div><div class="activity-b">
<p>An AI review says: <em>“High: the password reset endpoint reveals whether an email address is registered (‘No account found for this email’). This enables account enumeration.”</em> Describe how you'd confirm it, what evidence you'd record, what the fix is, and how you'd decide its priority.</p>
<div data-w="task" data-key="security-triage">
<div class="task-model"><p><strong>Confirm:</strong> request a reset for a known registered email and a random unregistered one; compare status codes, messages and response times.</p>
<p><strong>Evidence:</strong> the two requests and responses, showing different messages (or a timing difference).</p>
<p><strong>Fix:</strong> return the same message and status for both (“If an account exists, we've sent an email”), keep timing similar, and rate-limit the endpoint.[6]</p>
<p><strong>Priority:</strong> real but usually medium on its own; higher if the product's users are high-value targets or if login has no rate limiting, since enumeration feeds credential stuffing.</p></div>
<ul class="task-rubric">
<li>Describes a reproducible test comparing registered and unregistered emails</li>
<li>Considers timing as well as message differences</li>
<li>Records requests and responses as evidence</li>
<li>Proposes a consistent response and rate limiting as the fix</li>
<li>Sets priority by context, not by the tool's label</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Alert fatigue from false positives.</strong> If most AI findings are wrong, people stop reading them. Tune what you ask and measure the hit rate.</li>
<li><strong>Secrets and production data in prompts.</strong> Strip keys, tokens and customer data before pasting code or logs into any tool that isn't approved for them.</li>
<li><strong>Plausible incident narratives.</strong> A neat story about how an attacker got in can anchor an investigation. Build the timeline from raw events.</li>
<li><strong>Fixes that fix the test.</strong> A generated patch can block the one payload you showed it and leave the class of bug open. Fix the cause.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take an endpoint you know has been reviewed. Ask an assistant for a security review, then ask the specific question: “For each handler, how does it check the caller may access this record?” Compare the two answers with what you know. Count the false positives and anything it missed.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A finding marked critical by an AI tool is critical.</dt><dd>Severity labels are estimates. Reachability and impact in your system decide the real priority.</dd>
<dt>If an AI security review finds nothing, the code is secure.</dt><dd>AI reviews miss logic and authorisation flaws that depend on business rules. Absence of findings isn't evidence of safety.</dd>
<dt>AI-written code is more secure because it follows patterns.</dt><dd>Studies found a significant share of generated code contained vulnerabilities.[1]</dd>
<dt>Prompt injection is a model problem the vendor will fix.</dt><dd>It's an application design problem. Limit what the model can access and do.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Treat every AI finding as a lead; confirm it with reproducible evidence.</li>
<li>Severity labels aren't verdicts: judge reachability and impact yourself.</li>
<li>Record why false positives are false so they aren't re-triaged.</li>
<li>Use standards like OWASP ASVS to target reviews and check coverage.</li>
<li>Secure AI features by design: limited data, tools and outward actions.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An AI scanner marks a finding critical, but user input can't reach the code. What's the verdict?</p><ul>
<li data-fb="Ratings are estimates; evidence decides.">Critical, because the tool's rating should be respected.</li>
<li data-fb="Right. Not reachable means not exploitable here.">False positive, with the reasoning recorded.</li>
<li data-fb="Compromise isn't a method.">Medium, as a compromise between the tool and the team.</li>
<li data-fb="Your evidence already answers it.">Unknown until a second tool confirms it.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What's the best evidence that an authorisation finding is real?</p><ul>
<li data-fb="Right. A reproducible request and response.">Logged in as one user, retrieving another user's data.</li>
<li data-fb="An explanation isn't a demonstration.">The AI tool's explanation of why it's vulnerable.</li>
<li data-fb="A lead, but the check may be elsewhere.">The endpoint not appearing in the auth middleware file.</li>
<li data-fb="Not evidence about your system.">A similar vulnerability reported in another company's API.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">How should a password reset respond to an unregistered email?</p><ul>
<li data-fb="That confirms which emails are registered.">“No account found for this email address.”</li>
<li data-fb="Still distinguishable by an attacker.">An error code that only the front end can read.</li>
<li data-fb="Reveals the account doesn't exist.">A redirect to the sign-up page with the email prefilled.</li>
<li data-fb="Right. Nothing distinguishes the two cases.">The same message and timing as for a registered email.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What does OWASP ASVS help you do with AI security reviews?</p><ul>
<li data-fb="It's a standard, not a fixing tool.">Automatically fix every finding the AI security tool reports.</li>
<li data-fb="It structures reviews; it doesn't replace them.">Replace security reviews with a checklist.</li>
<li data-fb="Right. It says what to verify, area by area.">Target reviews at specific requirements and check coverage.</li>
<li data-fb="It doesn't rank tools.">Rank AI tools by how many findings they report.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">An AI review of a new service finds no issues. What should you conclude?</p><ul>
<li data-fb="Absence of findings isn't evidence of safety.">The service is secure and can be released.</li>
<li data-fb="Right. These depend on rules AI tools often don't know.">Logic and authorisation flaws may still exist.</li>
<li data-fb="Finding nothing can be correct; it just isn't proof.">The AI tool is broken and should be replaced.</li>
<li data-fb="Manual review covers what tools can't.">Manual review is now unnecessary for this release.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>. Roughly 40% of suggestions in security-relevant scenarios were vulnerable.</li>
<li>OWASP, <a href="https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/" target="_blank" rel="noopener">API1:2023 Broken Object Level Authorization</a>. The most common API weakness: no check that the record belongs to the caller.</li>
<li>NIST, <a href="https://csrc.nist.gov/pubs/sp/800/218/final" target="_blank" rel="noopener">SP 800-218: Secure Software Development Framework</a>. Layered practices for building secure software.</li>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>. Prompt injection, excessive agency, improper output handling and more.</li>

<li>OWASP, <a href="https://owasp.org/www-project-application-security-verification-standard/" target="_blank" rel="noopener">Application Security Verification Standard (ASVS)</a>. Testable security requirements by area and assurance level.</li>
<li>OWASP Cheat Sheet Series, <a href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener">Forgot Password Cheat Sheet</a>. Consistent responses, timing and rate limiting for reset flows.</li>
</ol></section>
`
});
