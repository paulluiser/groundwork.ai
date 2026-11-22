GW.lesson({
  id: "data-security",
  reviewed: "2026-11",
  lede: "Using AI at work means sending information to a system, letting it read things others wrote, and sometimes running what it produces. Each of those has a security side. This lesson covers the habits that keep you, your customers and your systems safe.",
  outcomes: [
    "Decide what information is fine to share with an AI tool, what needs care, and what never goes in.",
    "Redact a document so it stays useful for the task.",
    "Explain prompt injection and how permissions limit its damage.",
    "Recognise insecure generated output and decisions about people that need extra care.",
    "Classify information before sharing it with an AI tool, and redact what the task doesn't need."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>A developer pastes a failing API response into a public chatbot to ask why parsing fails. The response contains a customer's name, email, address and the last four digits of a card. Another developer, debugging the same bug, pastes the same response with every value replaced by realistic fakes. Both get a working fix.</p>
<p>Only one of them created a data protection incident. This lesson is about making the second developer's habit automatic, and about the other responsibilities that come with AI at work: injection, insecure output, decisions about people, ownership and regulation.</p></div>
<div class="check warmup" data-a="0"><p class="q">You need help with a SQL error on a table of customer orders. What should you share with an assistant?</p><ul>
<li data-fb="Right. The task needs the structure, not the customers' data.">The query, the error and the column names, with no real rows.</li>
<li data-fb="Real rows aren't needed to fix a query error.">A few real rows, so it can see exactly what the data looks like.</li>
<li data-fb="Far more personal data than the task requires.">The full table export, so it has all the context it might need.</li>
<li data-fb="Approved tools with the right data are fine; the structure is enough here.">Nothing at all, since customer data can never go near AI tools.</li>
</ul></div>
<h2>Where your words go</h2>
<p>Unless a model runs on your own machine, everything you type or attach is sent to a provider's servers. What happens to it next depends on the product and on your organisation's agreement with the provider: how long it is kept, whether it may be used to train future models, who can see logs, and where it is processed. Consumer and business versions of the same tool can have different terms.</p>
<p>You don't need to memorise those terms. You need to follow three rules:</p>
<ol>
<li><strong>Use the tools your organisation has approved</strong>, for the kinds of data they are approved for.</li>
<li><strong>Share the minimum the task needs.</strong> Lesson 2 already showed that focused context gives better answers. It is also safer.</li>
<li><strong>When unsure, ask</strong> your security or privacy team before pasting, not after.</li>
</ol>
<p>Some things never go in, whatever the tool: passwords, API keys, tokens, private keys and connection strings. If one slips in, treat it as exposed and rotate it.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">What can you paste?</span></div><div class="activity-b">
<p>Assume your company has approved one AI assistant for internal work, including source code and customer data handled under its privacy policy. Sort each item.</p>
<div data-w="sort" data-cfg="data-safety"></div>
</div></div>

<h2>Redaction that keeps the task possible</h2>
<p>Redacting means replacing sensitive details with placeholders before sharing. Done well, it removes risk without removing what the model needs.</p>
<div class="draft prompt"><div class="draft-h"><span><b>Original ticket</b></span><span>not shared</span></div><div class="draft-b">From: Priya Natarajan &lt;priya.n@example.com&gt;
Account 88213940. I was charged £64.99 twice on 3 March for order 55-1180. I called on 5 March and spoke to Tom, who said it'd be fixed in 3 days. Still nothing.</div></div>
<div class="draft prompt"><div class="draft-h"><span><b>Redacted version</b></span><span>shared with the assistant</span></div><div class="draft-b">From: [CUSTOMER] &lt;[EMAIL]&gt;
Account [ACCT-1]. I was charged £64.99 twice on 3 March for order [ORDER-1]. I called on 5 March and spoke to [AGENT-1], who said it'd be fixed in 3 days. Still nothing.</div></div>
<p>Step by step:</p>
<ol class="steps">
<li><strong>Remove identifiers</strong>Names, email, account and order numbers become consistent placeholders. Consistent matters: if the same account appears twice, both become <code>[ACCT-1]</code>, so the model can still tell it's the same account.</li>
<li><strong>Keep what the task needs</strong>The amount, the dates and the broken promise stay. The assistant needs them to draft an apology that acknowledges what happened.</li>
<li><strong>Re-insert locally</strong>Put the real details back into the draft yourself, in your own system, before sending.</li>
<li><strong>Check the redaction</strong>Read the redacted version once more for anything identifying in free text: a street name, a job title, “my daughter's school”.</li>
</ol>

<h2>Prompt injection</h2>
<p>Lesson 2 showed that the model sees one block of text. Your instructions, the product's system prompt, and any document, web page, email or ticket it reads all arrive in that same block. The model has no reliable way to tell “instructions from the person I work for” apart from “text that happens to contain instructions”.</p>
<p><a class="term" data-t="prompt-injection">Prompt injection</a> exploits this. An attacker places instructions where the model will read them: hidden text on a web page, a line in a support ticket, a comment in a code repository. Researchers demonstrated these indirect injections against real AI-integrated applications, including getting them to leak data and act against their users.<sup>[2]</sup> It sits at the top of the OWASP list of risks for AI applications.<sup>[1]</sup></p>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">An injected support ticket</span></div><div class="activity-b">
<p>A support assistant summarises incoming tickets. One ticket contains hidden text. Change what the assistant is allowed to do, then run it.</p>
<div data-w="injection"></div>
</div></div>

<p>The lesson from the activity: <strong>you cannot rely on the model to ignore injected instructions</strong>. Filters and careful system prompts reduce the risk, but none is reliable. What reliably limits damage is the design around the model:</p>
<ul>
<li><strong>Limit permissions</strong> to what the task needs (lesson 7). A summariser doesn't need to send email.</li>
<li><strong>Require approval</strong> for external or irreversible actions, with the details visible: recipient, content, amount.</li>
<li><strong>Don't combine</strong> untrusted input, access to private data and a way to send data out in one agent without strong controls. Any two are manageable; all three together are what make data theft possible.</li>
<li><strong>Treat the model's output as untrusted</strong> when it has read untrusted input: don't let it trigger actions automatically.</li>
</ul>

<h2>Insecure output</h2>
<p>The same caution applies in the other direction: what comes out of the model can be unsafe.</p>
<ul>
<li><strong>Vulnerable code.</strong> In one early study, around 40% of programs generated by a coding assistant in security-relevant scenarios contained vulnerabilities.<sup>[3]</sup> Tools have improved, but the lesson stands: generated code gets the same security review, scanning and tests as any code.</li>
<li><strong>Invented packages.</strong> Generated code sometimes imports libraries that don't exist. Across 16 models, a 2024 study found an average of at least 5.2% hallucinated package names for commercial models and 21.7% for open-source models.<sup>[4]</sup> Attackers can register those names and fill them with malware. Before installing any dependency an assistant suggests, confirm it exists, is the one you meant, and is maintained.</li>
<li><strong>Output inside your own product.</strong> If you build a feature that shows model output to users or passes it to other systems, treat it like user input: escape it before displaying, validate it before using it, never execute it directly.<sup>[1]</sup></li>
</ul>

<h2>Decisions that affect people</h2>
<p>Models learn from human-written text, including its biases. Where an output affects a person's opportunities or treatment (screening CVs, writing performance reviews, prioritising which customers get help, assessing credit or fraud risk) errors are costly and hard to see. That puts them in the top-right corner from lesson 6: the AI can help gather and draft, and a qualified person makes and owns the decision.</p>
<p>Many organisations, and in some places the law, set specific rules for automated decisions about people. Check with your legal or people team before using AI in any such process. The NIST AI Risk Management Framework is a good, practical starting point for thinking these risks through.<sup>[5]</sup></p>

<h2>Ownership and licensing</h2>
<p>Questions about who owns AI-generated content, and whether generated code can reproduce licensed code, are still being settled and differ between countries. Practical steps: follow your organisation's policy, use tool settings that block suggestions matching public code where available, and treat large verbatim-looking blocks of generated code with suspicion.</p>

<h2>Worked example: classify, then redact</h2>
<p>Most organisations have a data classification. If yours doesn't, these four levels cover most cases. Match each level to the tools your company has approved for it.</p>
<div class="tbl"><table><thead><tr><th>Level</th><th>Examples</th><th>Typical rule for AI tools</th></tr></thead><tbody>
<tr><td>Public</td><td>Published docs, marketing pages, open-source code</td><td>Any tool</td></tr>
<tr><td>Internal</td><td>Internal wikis, most source code, meeting notes</td><td>Company-approved tools only</td></tr>
<tr><td>Confidential</td><td>Customer data, financials, contracts, unreleased plans</td><td>Approved tools with data-protection terms, and only what the task needs</td></tr>
<tr><td>Restricted</td><td>Passwords, keys, health or payment data, legal matters</td><td>Not in AI tools, unless a specific approved system exists</td></tr>
</tbody></table></div>
<div class="worked">
<div class="wx"><b>Before: pasted as is</b><div><pre>{"customer": {"name": "Ana Ruiz",
 "email": "ana.ruiz@example.org",
 "card_last4": "4421"},
 "total": "1,299.00", "currency": "EUR"}
Why does parseFloat(total) give 1?</pre></div></div>
<div class="wx strong"><b>After: redacted, still solvable</b><div><pre>{"customer": {"name": "[NAME]",
 "email": "[EMAIL]",
 "card_last4": "[LAST4]"},
 "total": "1,299.00", "currency": "EUR"}
Why does parseFloat(total) give 1?</pre></div></div>
</div>
<ul class="wx-notes">
<li><strong>The bug is the comma in “1,299.00”</strong>, so the total stays; everything about the person goes.</li>
<li><strong>Placeholders keep the structure</strong> the model needs to understand the problem.</li>
<li><strong>Redact first, then decide the tool.</strong> After redaction, this is internal-level material.</li>
</ul>
<h2>Who owns AI-assisted work</h2>
<p>Ownership questions come up in every role. Three points hold in most places, though the details vary by country and contract:</p>
<ul>
<li><strong>Copyright needs human authorship.</strong> The US Copyright Office concluded in 2025 that material generated by AI without sufficient human control isn't protected, while human selection, arrangement and modification of it can be.[6] Keep records of your contribution for work that matters.</li>
<li><strong>Generated code can resemble licensed code.</strong> Use tools with filters for matching public code where available, and treat large generated blocks like code from an unknown contributor: review, test and check dependencies (see Pearce et al. and Spracklen et al. in the sources).</li>
<li><strong>Your contract with the tool matters.</strong> Check whether inputs are used for training, how long they're kept, and who owns the outputs. Company-approved tools usually exist because someone checked this.</li>
</ul>
<h2>Regulation in brief</h2>
<p>The EU AI Act classifies AI systems by risk. A small set of practices is banned; “high-risk” uses, such as AI in hiring, credit, education or access to essential services, carry obligations for risk management, data quality, documentation and human oversight; and some systems must tell people they're interacting with AI. Its obligations are being phased in from 2025 over several years.[7] You don't need to be a lawyer, but you should recognise when a feature might fall into a high-risk category, and bring in your legal or compliance team early.</p>
<h2>Your turn: redact a request</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Make this request safe to send</span></div><div class="activity-b">
<p>Rewrite this request so it keeps what the assistant needs and removes what it doesn't: <em>“Our client Northwind Health (contract value €480k, renewal 31 March) is unhappy. Their CTO, Priya Shah (priya.shah@northwind-health.example), wrote the email below. Draft a reply that keeps them from churning. [email mentions two patients' appointment delays caused by our outage]”</em></p>
<div data-w="task" data-key="security-redact">
<div class="task-model"><p>“A healthcare client is unhappy after our outage on [date] delayed some of their appointments. Their CTO wrote the email below (names and patient details removed). Draft a reply that acknowledges the impact, explains what happened at a high level, and says what we're changing. Don't promise compensation; I'll add that after checking with account management.”</p>
<p><strong>Removed:</strong> client name, contract value and renewal date (commercial, not needed), the CTO's name and email (personal data), patient details (health data, restricted). <strong>Kept:</strong> the sector, the impact and the tone needed.</p></div>
<ul class="task-rubric">
<li>Removes personal data such as names and email addresses</li>
<li>Removes health information completely</li>
<li>Removes commercial details the reply doesn't need</li>
<li>Keeps enough context for a useful, specific reply</li>
<li>Keeps decisions such as compensation with a person</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 15-minute exercise.</strong> Find your company's list of approved AI tools and its data classification. If you can't find them, ask your security or IT team; that gap is worth knowing about. Then check the last three things you pasted into an assistant against them.</div>
<h2>Common misconceptions</h2>
<dl class="myths">
<dt>If the tool says it doesn't train on my data, anything is safe to paste.</dt><dd>Training is one concern. Retention, access by the vendor, and your own company's rules still apply.</dd>
<dt>Removing names makes data anonymous.</dt><dd>Pseudonymised data can often be linked back. Remove what the task doesn't need, not just names.</dd>
<dt>AI-generated work belongs to whoever prompted it.</dt><dd>Ownership depends on human contribution, the tool's terms and local law. Keep a record of what you changed.</dd>
<dt>Regulation is only for companies that build AI models.</dt><dd>Rules like the EU AI Act also cover organisations that use AI in decisions about people.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Classify before you paste, and use only tools approved for that level.</li>
<li>Redact what the task doesn't need; placeholders keep the structure.</li>
<li>Treat retrieved content, emails and files as untrusted: they can carry instructions.</li>
<li>Decisions about people need human judgement, explanation and a way to appeal.</li>
<li>Ownership needs human contribution; high-risk uses need legal input early.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="3"><p class="q">Which change makes a debugging request safe to send while keeping it solvable?</p><ul>
<li data-fb="The data has already been sent; the request doesn't control storage.">Adding a note asking the tool not to store the customer details.</li>
<li data-fb="Still contains personal data, and may hide the bug.">Sending only the first half of the real response to limit exposure.</li>
<li data-fb="The browser mode doesn't change what the tool receives.">Pasting it into a private browser window before sending it.</li>
<li data-fb="Right. The task needs the shape of the data, not the person.">Replacing personal values with placeholders but keeping the structure.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What did the US Copyright Office conclude in 2025 about AI-generated material?</p><ul>
<li data-fb="It didn't assign ownership to model makers.">All AI-generated material belongs to the company that built the model.</li>
<li data-fb="Right. Human selection, arrangement and changes can be protected.">Without sufficient human control it isn't protected by copyright.</li>
<li data-fb="Human contributions to AI-assisted work can be protected.">Anything created with AI assistance is automatically in the public domain.</li>
<li data-fb="Human authorship remains the requirement.">It is protected exactly like human work as long as it's original.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which feature is most likely to count as high-risk under the EU AI Act?</p><ul>
<li data-fb="Right. Employment decisions are a listed high-risk area.">An AI tool that ranks job applicants for a hiring manager.</li>
<li data-fb="Low risk: no decision about a person's access or rights.">An assistant that suggests better wording for marketing copy.</li>
<li data-fb="Low risk under the Act's categories.">A tool that summarises internal meeting notes for the team.</li>
<li data-fb="Not a high-risk use.">Autocomplete suggestions while writing code in an editor.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which information is in the most restricted category for AI tools?</p><ul>
<li data-fb="Public: fine for any tool.">The text of your company's public documentation pages.</li>
<li data-fb="Internal: approved tools only.">Notes from an internal planning meeting about the roadmap.</li>
<li data-fb="Right. Health data is restricted.">A patient's appointment history mentioned in a client email.</li>
<li data-fb="Internal at most.">Your own draft of a blog post that hasn't been published.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why isn't removing names enough to make a dataset anonymous?</p><ul>
<li data-fb="Many other fields identify people.">Names are the only identifying information in most datasets.</li>
<li data-fb="Not always, but linkage is often possible.">AI tools can always recover names from the remaining text.</li>
<li data-fb="That isn't the requirement.">Regulators require removing every column before any sharing.</li>
<li data-fb="Right. Postcodes, dates and job titles can re-identify people.">Other details, combined, can often identify the person again.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>. Prompt injection, improper output handling, excessive agency and more.</li>
<li>Greshake et al. (2023), <a href="https://arxiv.org/abs/2302.12173" target="_blank" rel="noopener">Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection</a>.</li>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>.</li>
<li>Spracklen et al. (2024), <a href="https://arxiv.org/abs/2406.10279" target="_blank" rel="noopener">We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs</a>.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>, and the companion <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" target="_blank" rel="noopener">Generative AI Profile</a>.</li>

<li>US Copyright Office (2025), <a href="https://www.copyright.gov/ai/" target="_blank" rel="noopener">Copyright and Artificial Intelligence</a>. Part 2 of its report covers when AI-assisted work can be protected.</li>
<li><a href="https://artificialintelligenceact.eu/" target="_blank" rel="noopener">EU Artificial Intelligence Act</a>. The text, a summary of risk categories, and the timeline for obligations.</li>
<li>UK Information Commissioner's Office, <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/" target="_blank" rel="noopener">Guidance on AI and data protection</a>. Practical guidance on personal data in AI systems.</li>
</ol></section>
`
});
