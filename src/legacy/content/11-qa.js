GW.lesson({
  id: "qa",
  lede: "Testers are professional sceptics, and scepticism is exactly what AI output needs. This lesson covers two jobs: using AI to test better, and testing features that are themselves built on AI.",
  outcomes: [
    "Generate test ideas with AI, then judge coverage using techniques you already know.",
    "Spot the risks an AI-generated test plan typically misses, including tests that encode a defect.",
    "Explain why AI features need evaluation sets and pass rates rather than exact-match assertions.",
    "Design a small evaluation for an AI feature.",
    "Use a model as a grader without inheriting its biases."
  ],
  html: String.raw`
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

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Why can't you test an AI summarisation feature with a single exact-match assertion?</p><ul>
<li data-fb="Assertion libraries can compare strings of any length.">Summaries are too long for assertion libraries.</li>
<li data-fb="Right. Many different outputs are acceptable, and any given run might produce an unacceptable one. You need criteria and pass rates.">The output varies between runs, and many different summaries can be correct.</li>
<li data-fb="AI features can and should be tested; just differently.">AI features can't be tested automatically.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An AI-generated test asserts that login shows “Incorrect password for this account” when the password is wrong. What should a tester ask?</p><ul>
<li data-fb="Wording may matter, but there's a bigger issue.">Whether the wording is friendly enough.</li>
<li data-fb="Timing isn't the main question here.">Whether the message appears quickly.</li>
<li data-fb="Right. Confirming “this account” exists helps attackers enumerate accounts. The test may be asserting a defect.">Whether the message reveals that the account exists, which would be a security issue.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Your model grader gives version B higher tone scores than version A. B's replies are also about 40% longer. What should you do before believing the result?</p><ul>
<li data-fb="The grader's preference may be about length, not tone. That's what needs ruling out.">Ship B; the grader is consistent across hundreds of cases.</li>
<li data-fb="Model graders are useful at scale; the fix is to check them, not abandon them.">Stop using model graders altogether.</li>
<li data-fb="Right. Verbosity bias is a known pattern. Human grades on a sample tell you whether the grader is measuring tone or length.">Compare the grader with human grades on a sample, and check whether it is rewarding length.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>OWASP, <a href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener">Forgot Password Cheat Sheet</a>. Consistent responses, token handling, rate limiting.</li>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/test-and-evaluate/develop-tests" target="_blank" rel="noopener">Define success criteria and build evaluations</a>. Building eval sets and grading methods for AI features.</li>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>. Risks to include in adversarial test cases.</li>
<li>Zheng et al. (2023), <a href="https://arxiv.org/abs/2306.05685" target="_blank" rel="noopener">Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena</a>. Agreement between model and human graders, and position, verbosity and self-enhancement biases.</li>
</ol></section>
`
});
