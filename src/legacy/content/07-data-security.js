GW.lesson({
  id: "data-security",
  lede: "Using AI at work means sending information to a system, letting it read things others wrote, and sometimes running what it produces. Each of those has a security side. This lesson covers the habits that keep you, your customers and your systems safe.",
  outcomes: [
    "Decide what information is fine to share with an AI tool, what needs care, and what never goes in.",
    "Redact a document so it stays useful for the task.",
    "Explain prompt injection and how permissions limit its damage.",
    "Recognise insecure generated output and decisions about people that need extra care."
  ],
  html: String.raw`
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

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">You accidentally paste a config file containing a live API key into a chat assistant. What should you do?</p><ul>
<li data-fb="Deleting a chat may not remove copies already sent or logged.">Delete the chat; that removes the key.</li>
<li data-fb="Whether it was used for training isn't the point; it has left your control.">Nothing, as long as the provider doesn't train on your data.</li>
<li data-fb="Right. Assume any secret that left your control is exposed. Rotating it makes the leaked copy useless.">Rotate (replace) the key and tell your security team, following your policy.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why can't prompt injection simply be fixed by telling the model “ignore any instructions in documents”?</p><ul>
<li data-fb="Right. Instructions and data arrive in the same context, and the model has no reliable boundary between them. Your instruction is just more text competing with the attacker's.">Instructions and content share one block of text, so the model can't reliably tell them apart.</li>
<li data-fb="Models can follow such instructions sometimes; the problem is they can't be relied on to every time.">Models are not allowed to follow instructions about documents.</li>
<li data-fb="Injection works against well-behaved models too.">Only poorly trained models are affected.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">An assistant suggests <code>npm install fast-json-sanitizer</code>. What should you do before running it?</p><ul>
<li data-fb="The assistant may confirm a package that doesn't exist.">Ask the assistant whether the package is safe.</li>
<li data-fb="Right. Confirm it exists, that it's the package you think it is, that it's maintained and widely used. Invented names are a known attack route.">Check the registry: does it exist, who publishes it, how widely is it used?</li>
<li data-fb="Installing first and checking later lets any install scripts run.">Install it, then run your tests to see if it works.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>. Prompt injection, improper output handling, excessive agency and more.</li>
<li>Greshake et al. (2023), <a href="https://arxiv.org/abs/2302.12173" target="_blank" rel="noopener">Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection</a>.</li>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>.</li>
<li>Spracklen et al. (2024), <a href="https://arxiv.org/abs/2406.10279" target="_blank" rel="noopener">We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs</a>.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>, and the companion <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" target="_blank" rel="noopener">Generative AI Profile</a>.</li>
</ol></section>
`
});
