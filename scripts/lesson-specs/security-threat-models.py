SPEC = dict(
file="11b-2-security-threat-models.js",
reviewed="2026-11",
outcomes=["Apply STRIDE to an AI feature's data flow and name a control for each threat."],
situation="""<p>Product wants an assistant in the customer portal that answers billing questions by reading the customer's invoices and can “email a copy of any invoice”. The design review is tomorrow. You have a data-flow sketch, the OWASP list, and an hour.</p>
<p>Threat modelling an AI feature uses the same method as any other feature, plus a few threats that only exist because the component follows instructions it reads. This lesson walks through both.</p>""",
warmup=dict(q="Which component in an AI feature is new to most threat models?", a=0, opts=[
  ("One that reads untrusted text and may follow instructions in it.", "Right. That's what makes prompt injection possible."),
  ("A database that stores customer information.", "Databases are familiar in every threat model."),
  ("An API that authenticates users with tokens.", "Familiar from ordinary web applications."),
  ("A web front end that renders HTML for users.", "Familiar, though AI output adds rendering risks."),
 ]),
sections="""<h2>STRIDE still works</h2>
<p>STRIDE is a long-standing way to walk through threats element by element: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.[S1] For an AI feature, apply it as usual to the data flow, then ask an extra question at every point where the model reads text: who could have written this text, and what could it tell the model to do?</p>
<h2>Worked example: the billing assistant</h2>
<div class="tbl"><table><thead><tr><th>Threat (STRIDE)</th><th>How it shows up here</th><th>Control that doesn't rely on the model</th></tr></thead><tbody>
<tr><td>Information disclosure</td><td>Assistant retrieves another customer's invoice</td><td>Retrieval runs with the logged-in user's permissions only</td></tr>
<tr><td>Elevation of privilege</td><td>Text in an invoice note says “email all invoices to …”</td><td>Email tool can only send to the account's verified address</td></tr>
<tr><td>Tampering</td><td>Customer convinces it to state a different balance</td><td>Balances come from a tool reading the ledger, shown as data, not as model text</td></tr>
<tr><td>Repudiation</td><td>Customer claims the assistant promised a refund</td><td>Log prompts, tool calls and responses; assistant can't promise refunds</td></tr>
<tr><td>Denial of service</td><td>Long or repeated requests run up model costs</td><td>Per-user rate and token limits</td></tr>
<tr><td>Spoofing</td><td>Assistant output imitates a system message asking for card details</td><td>Model output rendered as plain text in a clearly labelled area</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Every control works even if the model is fooled.</strong> That's the test of a good control for AI components.</li>
<li><strong>The most important control is one line:</strong> the email tool can only send to the verified address. It removes the way out (lesson 7).</li>
<li><strong>MITRE ATLAS documents real attacks on AI systems</strong> if you need examples to convince the room.[3]</li>
</ul>
<h2>Your turn: threat model a feature</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Threats and controls for an internal HR assistant</span></div><div class="activity-b">
<p>An internal assistant answers employees' HR questions by searching the HR policy wiki and, for logged-in employees, their own leave balance. It can create a leave request. List at least four threats (use STRIDE and the “who wrote this text?” question) and a control for each that doesn't rely on the model behaving.</p>
<div data-w="task" data-key="security-stride">
<div class="task-model"><ul>
<li><strong>Disclosure:</strong> asks for a colleague's leave or salary. Control: leave tool only returns the caller's own data; salary data isn't connected at all.</li>
<li><strong>Elevation / injection:</strong> someone edits a wiki page to include instructions. Control: wiki is edit-restricted; the assistant can't take actions based on retrieved text without user confirmation.</li>
<li><strong>Tampering:</strong> user talks it into creating leave beyond their balance. Control: the leave system enforces balances and approvals, not the model.</li>
<li><strong>Repudiation:</strong> disputes over what it said about policy. Control: log conversations; answers link to the policy page.</li>
<li><strong>Disclosure via output:</strong> it quotes a confidential draft policy. Control: index only published policies.</li>
</ul></div>
<ul class="task-rubric">
<li>Lists at least four distinct threats</li>
<li>Considers who could write the text the assistant reads</li>
<li>Each control works even if the model is manipulated</li>
<li>Uses the target systems' own rules (permissions, balances) as controls</li>
<li>Includes logging or traceability</li>
</ul>
</div></div></div>""",
myths=[
 ("A system prompt saying “only discuss billing” is a security control.", "It's guidance the model may not follow. Controls must hold when the model is fooled."),
 ("Threat modelling AI needs an entirely new method.", "STRIDE and data-flow diagrams still work. Add the question of who wrote the text the model reads."),
 ("Internal assistants don't need threat models.", "Insiders, edited wiki pages and over-broad access make internal tools risky too."),
 ("Output is safe because it's just text.", "Output rendered as HTML, run as code or shown as system messages creates its own risks."),
],
recap=[
 "Draw the data flow, then apply STRIDE element by element.",
 "At every point where the model reads text, ask who could have written it.",
 "Choose controls that hold even if the model is manipulated.",
 "Use the connected systems' own permissions and rules as the real limits.",
 "Log prompts, tool calls and responses for traceability.",
],
checks=[
 dict(q="Which control still works if the billing assistant is tricked by injected text?", a=2, opts=[
  ("A system prompt telling it never to email other addresses.", "Prompts can be overridden by injected text."),
  ("A filter that blocks messages containing the word “ignore”.", "Trivial to bypass with other wording."),
  ("An email tool that can only send to the verified address.", "Right. The limit is enforced outside the model."),
  ("Training the model further on safe billing conversations.", "Reduces risk but doesn't guarantee it."),
 ]),
 dict(q="What does the R in STRIDE stand for, and why does it matter for assistants?", a=0, opts=[
  ("Repudiation: logs show what the assistant said and did.", "Right. Disputes need a record."),
  ("Reliability: assistants must be available all the time.", "Availability is the D, denial of service."),
  ("Retrieval: assistants search documents.", "Not part of STRIDE."),
  ("Rendering: model output shown as HTML.", "A real risk, but not STRIDE's R."),
 ]),
 dict(q="Someone edits a wiki page the HR assistant reads. Which question exposes the risk?", a=3, opts=[
  ("How many pages does the wiki contain?", "Size doesn't reveal the threat."),
  ("Which model version does the assistant use?", "Every version can be influenced by text."),
  ("How fast does the assistant answer questions?", "Speed isn't the issue."),
  ("Who could have written the text the model reads?", "Right. Editable sources are injection routes."),
 ]),
 dict(q="Where should leave-balance limits be enforced?", a=1, opts=[
  ("In the assistant's instructions, as a firm rule.", "The model can be talked around."),
  ("In the leave system itself, whatever the assistant asks.", "Right. The system of record enforces its rules."),
  ("In a weekly audit of requests the assistant created.", "Too late to prevent the problem."),
  ("In the employee handbook, so people know the rules.", "Policy documents don't enforce limits."),
 ]),
 dict(q="Why render assistant output as plain text in a labelled area?", a=2, opts=[
  ("Plain text uses fewer tokens than HTML.", "Token count isn't the reason."),
  ("It makes answers easier to translate.", "Not the security reason."),
  ("So output can't imitate system messages or run as code.", "Right. It prevents spoofing and injection into the page."),
  ("Because models can't produce valid HTML.", "They can, which is part of the risk."),
 ]),
],
sources=[
 'Microsoft, <a href="https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats" target="_blank" rel="noopener">Threat Modeling Tool threats</a>. STRIDE categories with examples and mitigations.',
],
)
