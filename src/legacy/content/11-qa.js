GW.lesson({
  id: "qa",
  reviewed: "2026-11",
  lede: "Testers are professional sceptics, and scepticism is exactly what AI output needs. This lesson covers two jobs: using AI to test better, and testing features that are themselves built on AI.",
  outcomes: [
    "Generate test ideas with AI, then judge coverage using techniques you already know.",
    "Spot the risks an AI-generated test plan typically misses, including tests that encode a defect.",
    "Explain why AI features need evaluation sets and pass rates rather than exact-match assertions.",
    "Design a small evaluation for an AI feature.",
    "Use a model as a grader without inheriting its biases.",
    "Use risk to decide which AI-generated test ideas are worth keeping."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>An assistant gives you 64 test cases for a new “change email address” feature in under a minute. They're tidy, numbered and cover every field. Reading them, you notice they test the form thoroughly and the risk barely at all: nothing about the confirmation link going to the old address, nothing about someone else's session, nothing about what happens to pending invoices sent to the old email.</p>
<p>AI produces test ideas in volume. The tester's job is deciding which ones matter, and adding the ones only someone who understands the system would think of.</p></div>
<div class="check warmup" data-a="2"><p class="q">An assistant generates 64 test cases for a feature. What's the best first step?</p><ul>
<li data-fb="Volume isn't coverage of risk; many may test the same thing.">Automate all 64, since more coverage is always better.</li>
<li data-fb="Order of generation isn't order of importance.">Run the first ten and see whether they find any bugs at all.</li>
<li data-fb="Right. Risk decides what's worth running and what's missing.">Rank them by risk and add the cases only you know to test.</li>
<li data-fb="It doesn't know your system's risks.">Ask the assistant which of its own cases are most important.</li>
</ul></div>
<h2>Where AI meets testing work</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Test ideas from requirements</td><td><span class="fit good">Good fit</span></td><td>Quick breadth. Check coverage with partitioning and boundaries; look for risks specific to your domain.</td></tr>
<tr><td>Generating test data</td><td><span class="fit good">Good fit</span></td><td>Realistic volumes and variety. Never seed it with real personal data; check it includes boundary values.</td></tr>
<tr><td>Turning manual cases into automated tests</td><td><span class="fit good">Good fit</span></td><td>Saves typing. Review selectors, waits and assertions; watch for brittle timing.</td></tr>
<tr><td>Exploratory testing charters</td><td><span class="fit good">Good fit</span></td><td>Good prompts for where to explore. You do the exploring.</td></tr>
<tr><td>Drafting bug reports from rough notes</td><td><span class="fit good">Good fit</span></td><td>Clear structure. Follow the reproduction steps yourself before filing.</td></tr>
<tr><td>Summarising test runs and flaky failures</td><td><span class="fit care">Use with care</span></td><td>Summaries can blame a plausible cause (“network timeout”). Check the raw logs.</td></tr>
<tr><td>Security and accessibility testing</td><td><span class="fit care">Use with care</span></td><td>Helpful checklists; specialist testing still required.</td></tr>
<tr><td>Release go/no-go decisions</td><td><span class="fit human">Keep human</span></td><td>Weighs risk, evidence and business context. AI can summarise the evidence.</td></tr>
</tbody></table></div>

<h2>Worked example: a test plan for password reset</h2>
<p>A team is adding self-service password reset. The QA engineer pastes the user story into an assistant and asks for test cases. It returns eight:</p>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · password reset test cases</span></div><div class="draft-b" style="font-family:var(--font-body);font-size:14.5px">
<ol style="margin:0;padding-left:22px">
<li>Valid registered email receives a reset link.</li>
<li>Unregistered email shows the error “No account found with that email”.</li>
<li>Following the link lets the user set a new password.</li>
<li>New password must meet the complexity rules.</li>
<li>Password and confirmation must match.</li>
<li>An expired link shows an error.</li>
<li>The reset email arrives within one minute.</li>
<li>The reset page works on mobile.</li>
</ol></div></div>
<p>It looks reasonable. Before reading on, look at it as a tester would: what's missing, and is anything here wrong?</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Find the gaps</span></div><div class="activity-b">
<p>Select every risk below that the AI's list fails to cover <em>and</em> that matters for a password reset. Then check your selection.</p>
<div data-w="coverage"></div>
</div></div>

<p>Two lessons from this example:</p>
<ol class="steps">
<li><strong>The list covers the typical, not the risky</strong>Happy path and simple validation are the most common test cases in the world, so they come first. The security-relevant cases (one-time tokens, rate limits, consistent responses) are the ones that matter most for a password reset and appear in specialist guidance like OWASP's Forgot Password Cheat Sheet.<sup>[1]</sup> Give the model that guidance as context and its list improves a lot.</li>
<li><strong>A test case can encode a defect</strong>Case 2 asserts a message that tells an attacker which emails have accounts. If that test is automated, the suite will <em>fail</em> when a developer fixes the vulnerability. Generated test cases are claims about expected behaviour; check them against requirements and standards, not just against what the product does today.</li>
</ol>
<p>Your existing techniques are the best check. With <a class="term" data-t="boundary-value">boundary value analysis</a>, “an expired link shows an error” becomes concrete: if links last 60 minutes, test at 59 minutes, at exactly 60, and at 61. Ask the assistant to apply the technique explicitly, then verify that the boundaries it picked match the real rules.</p>

<h2>Testing features built on AI</h2>
<p>More products now include AI features: suggested replies, summaries, search answers, classification. Testing them needs a different approach, because the output is <a class="term" data-t="non-deterministic">non-deterministic</a> (lesson 1). The same input can produce different, equally acceptable outputs, and occasionally an unacceptable one.</p>
<p>So you can't write <code>assertEquals(expectedReply, actualReply)</code>. Instead, you build an <a class="term" data-t="eval">evaluation</a>, usually called an eval:</p>
<ol class="steps">
<li><strong>Collect representative inputs</strong>Real cases (anonymised) across the categories that matter, plus hard ones: ambiguous, angry, incomplete, non-English, and adversarial inputs such as prompt-injection attempts (lesson 8).</li>
<li><strong>Define what good means</strong>Write a <a class="term" data-t="rubric">rubric</a>: must-pass criteria (“never promises a refund outside policy”) and quality criteria (“tone: 1 to 5”).</li>
<li><strong>Choose how to grade</strong>Code checks where possible (format, length, required fields, banned phrases). Human grading for judgment. A model can grade against the rubric at scale (an approach called <a class="term" data-t="llm-as-judge">LLM-as-judge</a>), but spot-check its grades by hand, because the grader is an AI too.</li>
<li><strong>Run many times and report rates</strong>Run each case several times. Report pass rates per criterion and per category, not single results.</li>
<li><strong>Re-run on every change</strong>A new model version, a changed prompt or new retrieval content can shift behaviour anywhere. The eval is your regression suite.<sup>[2]</sup></li>
</ol>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">Why one run tells you little</span></div><div class="activity-b">
<p>Two versions of a reply-suggestion feature are being compared. Version A truly passes the rubric 70% of the time; version B truly passes 85% of the time. You don't know that; you only see runs. Run each a few times, then many times.</p>
<div data-w="evalsim"></div>
</div></div>
<p>With a handful of runs, A often looks as good as B, or better. Only with enough runs does the real difference show. For a release decision, that means dozens to hundreds of graded cases, depending on how small a difference you need to detect.</p>

<h3>Using a model as the grader</h3>
<p>Human grading doesn't scale to hundreds of cases run five times on every change. So most teams use <a class="term" data-t="llm-as-judge">LLM-as-judge</a>: a second model is given the rubric, the input and the output, and asked for a verdict. It works well enough to be standard practice, and it has known biases. A widely cited study found that model graders agreed with human experts about as often as experts agreed with each other, and also documented these failure patterns:<sup>[4]</sup></p>
<div class="tbl"><table>
<thead><tr><th>Bias</th><th>What happens</th><th>Countermeasure</th></tr></thead>
<tbody>
<tr><td>Position bias</td><td>Comparing two answers, the grader favours whichever comes first (or second).</td><td>Grade each pair twice with the order swapped; count only consistent verdicts.</td></tr>
<tr><td>Verbosity bias</td><td>Longer, more detailed answers score higher, even when they aren't better.</td><td>Put length limits in the rubric; grade must-pass criteria as yes or no, not as an overall score.</td></tr>
<tr><td>Self-preference</td><td>A model rates answers written in its own style, or by itself, more highly.</td><td>Where possible, use a different model to grade than the one being tested.</td></tr>
<tr><td>Weak on facts it can't check</td><td>It judges whether an answer sounds right, not whether it is.</td><td>Give the grader the reference material, such as the policy, and ask it to quote the supporting line.</td></tr>
</tbody></table></div>
<p>Before trusting a model grader, <strong>calibrate it</strong>: have people grade 50 to 100 cases, run the grader on the same cases, and measure how often they agree, criterion by criterion. Where agreement is low, rewrite the rubric or keep that criterion with human graders. Re-check agreement whenever the grader model changes.</p>

<h3>Example: an eval for a support-reply suggester</h3>
<div class="tbl"><table>
<thead><tr><th>Criterion</th><th>Type</th><th>Graded by</th></tr></thead>
<tbody>
<tr><td>States the refund policy correctly for the case</td><td>Must pass</td><td>Model grader with the policy as reference; 10% human spot-check</td></tr>
<tr><td>Makes no promise outside policy (dates, amounts, exceptions)</td><td>Must pass</td><td>Model grader + banned-phrase check</td></tr>
<tr><td>Includes the order ID when the ticket has one</td><td>Must pass</td><td>Code check</td></tr>
<tr><td>Ignores instructions embedded in the ticket</td><td>Must pass</td><td>Adversarial cases, human graded</td></tr>
<tr><td>Tone matches the guide</td><td>Score 1–5</td><td>Human graders, two per case</td></tr>
</tbody></table></div>
<p>Inputs: 60 real tickets from last month across six categories, plus 15 hard and adversarial ones. Each runs five times. The release bar: every must-pass criterion at 98% or above, and no category below 95%.</p>

<h2>Risk first, then ideas</h2>
<p>Risk-based testing asks two questions about every area: how likely is it to fail, and how bad would it be if it did? AI is good at the long tail of input variations (empty fields, long strings, special characters). It's weak at the risks specific to your system: integrations, permissions, money, data that outlives the feature. Start with a short risk list of your own, then use AI to fill in variations under each risk, rather than the other way round. Security testing guides like OWASP's are a good source of the risks that matter most for features touching accounts and identity.[5]</p>
<h2>Worked example: sorting generated test ideas</h2>
<div class="tbl"><table><thead><tr><th>Generated idea</th><th>Risk</th><th>Keep?</th></tr></thead><tbody>
<tr><td>Email field rejects “user@”</td><td>Low: validation, visible</td><td>Keep one representative case</td></tr>
<tr><td>Email field accepts 254-character address</td><td>Low</td><td>Keep, cheap to automate</td></tr>
<tr><td>Cases 12–31: twenty other invalid formats</td><td>Low, duplicative</td><td>Collapse into one data-driven test</td></tr>
<tr><td>(Missing) Confirmation goes to the new address, and a notice to the old one</td><td>High: account takeover</td><td>Add</td></tr>
<tr><td>(Missing) Change requires recent password entry</td><td>High: stolen session</td><td>Add</td></tr>
<tr><td>(Missing) Invoices already scheduled still reach the right address</td><td>Medium: billing</td><td>Add, ask product</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Twenty generated cases became one.</strong> Variations of the same risk are cheap to automate together.</li>
<li><strong>The three most important cases weren't generated at all.</strong> They come from knowing how accounts are attacked and how billing works.</li>
<li><strong>The billing case raises a product question</strong>, which is often what good testing does.</li>
</ul>
<h2>Your turn: a risk list before the test ideas</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Risks for “delete my account”</span></div><div class="activity-b">
<p>Before asking an assistant for test cases, write the risk list for a new “delete my account” feature in a subscription product. For each risk, say how likely and how severe, and one test that would catch it.</p>
<div data-w="task" data-key="qa-risks">
<div class="task-model"><ul>
<li><strong>Someone else deletes the account</strong> (stolen session). High severity. Test: deletion requires recent re-authentication.</li>
<li><strong>Billing continues after deletion.</strong> High. Test: active subscription is cancelled and no future invoice is scheduled.</li>
<li><strong>Personal data remains</strong> in exports, backups or analytics. High (legal). Test: data is removed or anonymised in each store within the stated period.</li>
<li><strong>Shared workspace loses its only admin.</strong> Medium. Test: deletion is blocked or ownership is transferred.</li>
<li><strong>Accidental deletion.</strong> Medium. Test: confirmation step and a grace period to undo.</li>
</ul></div>
<ul class="task-rubric">
<li>Includes security risks such as stolen sessions</li>
<li>Includes money: what happens to billing</li>
<li>Includes data protection: where personal data lives</li>
<li>Includes effects on other users or shared data</li>
<li>Gives a concrete test for each risk</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Tests that freeze bugs.</strong> Tests generated from the current behaviour assert whatever the product does now, including its defects.</li>
<li><strong>Happy-path bias.</strong> Generated plans start with the common cases. Ask explicitly for negative, boundary, security and concurrency cases.</li>
<li><strong>Real data in test data.</strong> Don't paste production records to generate “realistic” data. Describe the shape instead.</li>
<li><strong>Plausible root causes.</strong> A summary that blames flaky failures on “network instability” may be right, or just a common phrase. Check timestamps and logs.</li>
<li><strong>One good demo.</strong> An AI feature working once in a demo is a single sample, not a pass rate.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 40-minute exercise.</strong> Take a feature you're testing now. Ask an assistant for test cases from the requirements. Then, before reading its list, write down the three riskiest things about the feature yourself. Compare: did its list include your three? Did any of its cases encode behaviour you'd consider a defect?</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>More generated test cases means better coverage.</dt><dd>Coverage of inputs isn't coverage of risk. Many generated cases test the same thing.</dd>
<dt>AI can't help with exploratory testing.</dt><dd>It can suggest charters and unusual paths. You still do the exploring and judge what's interesting.</dd>
<dt>A feature built on AI can be tested with exact-match assertions.</dt><dd>Outputs vary. Test against rules and pass rates over many inputs.</dd>
<dt>LLM-as-judge removes the need for human review.</dt><dd>Judges need validating against people, and agree with them only partly.[4]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Write the risk list first; use AI to generate variations under each risk.</li>
<li>Collapse duplicative generated cases into data-driven tests.</li>
<li>The most important cases come from knowing the system: permissions, money, data.</li>
<li>AI features need tests over many inputs with pass rates, not single assertions.</li>
<li>Validate any AI judge against human judgements before trusting it.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="3"><p class="q">Which test is an assistant least likely to generate without being told about your system?</p><ul>
<li data-fb="A typical validation case models usually include.">An email field that rejects a value with no domain after the @ sign.</li>
<li data-fb="A common internationalisation case.">A name field that accepts accented characters.</li>
<li data-fb="A widely known UI case.">A password field that masks what's typed.</li>
<li data-fb="Right. It depends on how your billing works.">Scheduled invoices still reach the customer after an email change.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Twenty generated cases each test a different invalid email format. What should you do?</p><ul>
<li data-fb="Twenty tests for one risk adds maintenance, not safety.">Automate each one separately for maximum coverage.</li>
<li data-fb="Right. Same risk, one test, many inputs.">Collapse them into one data-driven test.</li>
<li data-fb="Validation matters; it just doesn't need twenty tests.">Delete them all, since validation doesn't matter.</li>
<li data-fb="More of the same doesn't add coverage.">Ask the assistant for twenty more to be safe.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What are the two questions behind risk-based testing?</p><ul>
<li data-fb="Right. Likelihood and impact decide priority.">How likely is it to fail, and how bad would that be?</li>
<li data-fb="Effort matters, but it isn't the risk.">How long will the tests take to write and to run?</li>
<li data-fb="A useful split, but not the definition of risk.">Which tests can AI write, and which must people write?</li>
<li data-fb="History informs risk, but isn't the core questions.">What did the last release break, and who reported it?</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Why can't an AI summary feature be tested with one exact-match assertion?</p><ul>
<li data-fb="They aren't.">Exact-match assertions are deprecated in most modern testing frameworks.</li>
<li data-fb="Speed isn't the reason.">The feature is too slow for automated testing.</li>
<li data-fb="Right. One run tells you little.">Its outputs vary, so you test rules and pass rates over many inputs.</li>
<li data-fb="They can be tested automatically with the right approach.">AI features can only be tested manually by people.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Before using an LLM to grade outputs at scale, what should you do?</p><ul>
<li data-fb="Cost doesn't guarantee agreement with people.">Use the most expensive model available as the judge.</li>
<li data-fb="Right. Validate the judge before trusting it.">Check its grades agree with people's on a sample.</li>
<li data-fb="That shares the feature's blind spots.">Give it the same prompt as the feature it's judging.</li>
<li data-fb="Explanations don't show its grades are right.">Ask it to explain each grade in detail.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>OWASP, <a href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener">Forgot Password Cheat Sheet</a>. Consistent responses, token handling, rate limiting.</li>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/test-and-evaluate/develop-tests" target="_blank" rel="noopener">Define success criteria and build evaluations</a>. Building eval sets and grading methods for AI features.</li>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>. Risks to include in adversarial test cases.</li>
<li>Zheng et al. (2023), <a href="https://arxiv.org/abs/2306.05685" target="_blank" rel="noopener">Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena</a>. Agreement between model and human graders, and position, verbosity and self-enhancement biases.</li>

<li>OWASP, <a href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener">Web Security Testing Guide</a>. A structured source of risks and tests for authentication, sessions and account features.</li>
</ol></section>
`
});
