SPEC = dict(
file="11b-security.js",
reviewed="2026-11",
outcomes=["Triage AI security findings into confirmed, needs proof, and false positive, with evidence for each."],
situation="""<p>An AI code scanner opens 47 security findings on your main service overnight. Eleven are marked critical. The development team asks which ones are real, because last quarter's tool produced 200 findings and three of them mattered.</p>
<p>AI can read code faster than any security team. It also reports plausible weaknesses that aren't reachable, and misses the ones that depend on how your system is actually used. This lesson is about turning a pile of AI findings into a short list of real ones, with proof.</p>""",
warmup=dict(q="An AI tool reports a SQL injection in a function. What turns this into a confirmed finding?", a=3, opts=[
  ("The tool's severity rating of critical.", "Severity is the tool's estimate, not proof."),
  ("A second AI tool reporting the same issue.", "Two tools can share the same pattern-matching mistake."),
  ("The function using string concatenation somewhere.", "Concatenation is a lead, not proof of reachability."),
  ("Showing that user input reaches the query unsanitised.", "Right. Proof of a reachable, exploitable path confirms it."),
 ]),
sections="""<h2>Worked example: triaging three findings</h2>
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
<p>The OWASP Application Security Verification Standard (ASVS) lists concrete requirements an application should meet, grouped by area (authentication, access control, input handling and so on) and by assurance level.[S1] It's a useful way to ask an assistant for targeted reviews (“check this module against ASVS access-control requirements and cite the line for each”), and to check that a review covered the areas that matter instead of only the ones a scanner is good at.</p>
<h2>Your turn: triage a finding</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Is this finding real?</span></div><div class="activity-b">
<p>An AI review says: <em>“High: the password reset endpoint reveals whether an email address is registered (‘No account found for this email’). This enables account enumeration.”</em> Describe how you'd confirm it, what evidence you'd record, what the fix is, and how you'd decide its priority.</p>
<div data-w="task" data-key="security-triage">
<div class="task-model"><p><strong>Confirm:</strong> request a reset for a known registered email and a random unregistered one; compare status codes, messages and response times.</p>
<p><strong>Evidence:</strong> the two requests and responses, showing different messages (or a timing difference).</p>
<p><strong>Fix:</strong> return the same message and status for both (“If an account exists, we've sent an email”), keep timing similar, and rate-limit the endpoint.[S2]</p>
<p><strong>Priority:</strong> real but usually medium on its own; higher if the product's users are high-value targets or if login has no rate limiting, since enumeration feeds credential stuffing.</p></div>
<ul class="task-rubric">
<li>Describes a reproducible test comparing registered and unregistered emails</li>
<li>Considers timing as well as message differences</li>
<li>Records requests and responses as evidence</li>
<li>Proposes a consistent response and rate limiting as the fix</li>
<li>Sets priority by context, not by the tool's label</li>
</ul>
</div></div></div>""",
myths=[
 ("A finding marked critical by an AI tool is critical.", "Severity labels are estimates. Reachability and impact in your system decide the real priority."),
 ("If an AI security review finds nothing, the code is secure.", "AI reviews miss logic and authorisation flaws that depend on business rules. Absence of findings isn't evidence of safety."),
 ("AI-written code is more secure because it follows patterns.", "Studies found a significant share of generated code contained vulnerabilities.[1]"),
 ("Prompt injection is a model problem the vendor will fix.", "It's an application design problem. Limit what the model can access and do."),
],
recap=[
 "Treat every AI finding as a lead; confirm it with reproducible evidence.",
 "Severity labels aren't verdicts: judge reachability and impact yourself.",
 "Record why false positives are false so they aren't re-triaged.",
 "Use standards like OWASP ASVS to target reviews and check coverage.",
 "Secure AI features by design: limited data, tools and outward actions.",
],
checks=[
 dict(q="An AI scanner marks a finding critical, but user input can't reach the code. What's the verdict?", a=1, opts=[
  ("Critical, because the tool's rating should be respected.", "Ratings are estimates; evidence decides."),
  ("False positive, with the reasoning recorded.", "Right. Not reachable means not exploitable here."),
  ("Medium, as a compromise between the tool and the team.", "Compromise isn't a method."),
  ("Unknown until a second tool confirms it.", "Your evidence already answers it."),
 ]),
 dict(q="What's the best evidence that an authorisation finding is real?", a=0, opts=[
  ("Logged in as one user, retrieving another user's data.", "Right. A reproducible request and response."),
  ("The AI tool's explanation of why it's vulnerable.", "An explanation isn't a demonstration."),
  ("The endpoint not appearing in the auth middleware file.", "A lead, but the check may be elsewhere."),
  ("A similar vulnerability reported in another company's API.", "Not evidence about your system."),
 ]),
 dict(q="How should a password reset respond to an unregistered email?", a=3, opts=[
  ("“No account found for this email address.”", "That confirms which emails are registered."),
  ("An error code that only the front end can read.", "Still distinguishable by an attacker."),
  ("A redirect to the sign-up page with the email prefilled.", "Reveals the account doesn't exist."),
  ("The same message and timing as for a registered email.", "Right. Nothing distinguishes the two cases."),
 ]),
 dict(q="What does OWASP ASVS help you do with AI security reviews?", a=2, opts=[
  ("Automatically fix every finding the AI reports.", "It's a standard, not a fixing tool."),
  ("Replace security reviews with a checklist.", "It structures reviews; it doesn't replace them."),
  ("Target reviews at specific requirements and check coverage.", "Right. It says what to verify, area by area."),
  ("Rank AI tools by how many findings they report.", "It doesn't rank tools."),
 ]),
 dict(q="An AI review of a new service finds no issues. What should you conclude?", a=1, opts=[
  ("The service is secure and can be released.", "Absence of findings isn't evidence of safety."),
  ("Logic and authorisation flaws may still exist.", "Right. These depend on rules AI tools often don't know."),
  ("The AI tool is broken and should be replaced.", "Finding nothing can be correct; it just isn't proof."),
  ("Manual review is now unnecessary for this release.", "Manual review covers what tools can't."),
 ]),
],
sources=[
 'OWASP, <a href="https://owasp.org/www-project-application-security-verification-standard/" target="_blank" rel="noopener">Application Security Verification Standard (ASVS)</a>. Testable security requirements by area and assurance level.',
 'OWASP Cheat Sheet Series, <a href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener">Forgot Password Cheat Sheet</a>. Consistent responses, timing and rate limiting for reset flows.',
],
)
