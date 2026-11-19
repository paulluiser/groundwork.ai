GW.lesson({
  id: "security",
  lede: "Security work has two AI jobs now: using AI to find and fix weaknesses faster, and securing the AI features your company ships. Both depend on the same habit: an AI finding is a lead to investigate, never a verdict.",
  outcomes: [
    "Use AI to widen threat modelling, code review and triage, and verify every finding before acting on it.",
    "Tell an AI false positive from a real issue, and spot the issue it missed.",
    "Explain why a passing AI review is not evidence of security.",
    "Review an AI feature for the risks specific to it: injection, excessive agency, data leakage and unsafe output handling."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Alert fatigue from false positives.</strong> If most AI findings are wrong, people stop reading them. Tune what you ask and measure the hit rate.</li>
<li><strong>Secrets and production data in prompts.</strong> Strip keys, tokens and customer data before pasting code or logs into any tool that isn't approved for them.</li>
<li><strong>Plausible incident narratives.</strong> A neat story about how an attacker got in can anchor an investigation. Build the timeline from raw events.</li>
<li><strong>Fixes that fix the test.</strong> A generated patch can block the one payload you showed it and leave the class of bug open. Fix the cause.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take an endpoint you know has been reviewed. Ask an assistant for a security review, then ask the specific question: “For each handler, how does it check the caller may access this record?” Compare the two answers with what you know. Count the false positives and anything it missed.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">An AI review reports “No issues found” for a pull request. What does that tell you?</p><ul>
<li data-fb="One fallible reviewer finding nothing is not evidence of safety.">That the change is secure and can skip human review.</li>
<li data-fb="The result isn't worthless, but it isn't a guarantee either.">Nothing at all; AI reviews are useless.</li>
<li data-fb="Right. It's one reviewer's opinion. Your scanners, tests and human review still apply.">That one reviewer found nothing; other checks still apply.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An assistant flags SQL injection in a query that uses parameter placeholders. What should you do?</p><ul>
<li data-fb="Right. Reproduce it. If you can't, record it as a false positive, which also helps you judge the tool.">Try to reproduce it; if you can't, record it as a false positive.</li>
<li data-fb="Changing safe code because of an unverified finding wastes time and can introduce bugs.">Rewrite the query anyway, to be safe.</li>
<li data-fb="Its answer would be another generated claim, not a test.">Ask the assistant whether it's sure.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">An AI feature summarises customer emails and can create support tickets. Which risk deserves the most attention in its design review?</p><ul>
<li data-fb="Formatting matters less than what the model can be made to do.">That summaries may be too long.</li>
<li data-fb="Right. The emails are untrusted text with access to a tool. Limit what the tool can do and treat output as untrusted.">Instructions hidden in an email steering the model into creating or altering tickets.</li>
<li data-fb="Temperature affects variety, not security.">The model's temperature setting.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>. Roughly 40% of suggestions in security-relevant scenarios were vulnerable.</li>
<li>OWASP, <a href="https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/" target="_blank" rel="noopener">API1:2023 Broken Object Level Authorization</a>. The most common API weakness: no check that the record belongs to the caller.</li>
<li>NIST, <a href="https://csrc.nist.gov/pubs/sp/800/218/final" target="_blank" rel="noopener">SP 800-218: Secure Software Development Framework</a>. Layered practices for building secure software.</li>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>. Prompt injection, excessive agency, improper output handling and more.</li>
</ol></section>
`
});
