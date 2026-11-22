GW.lesson({
  id: "engineering",
  reviewed: "2026-11",
  lede: "Engineers were among the first to use AI every day, and the evidence on what it does for productivity is more mixed than the headlines suggest. This lesson focuses on the habits that make generated code safe to ship.",
  outcomes: [
    "Specify a coding task with examples and tests, so the output can be checked automatically.",
    "Find the kind of bug generated code tends to contain, by running it on edge cases.",
    "Debug with AI using evidence and hypotheses rather than guesses.",
    "Handle dependencies, security and code review for AI-assisted changes.",
    "Write tests first so generated code has to meet your specification, not its own."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>A teammate's pull request adds a date-range filter. The code is clean, idiomatic and comes with twelve passing tests. All twelve were generated alongside the code, and all twelve test what the code does, including the off-by-one that drops the last day of every range.</p>
<p>Tests written by the same assistant that wrote the code tend to confirm it rather than challenge it. This lesson is about putting your specification in charge, so generated code has to meet your intent, not its own.</p></div>
<div class="check warmup" data-a="2"><p class="q">An assistant writes a function and its tests together, and all tests pass. What does that show?</p><ul>
<li data-fb="The tests may encode the same misunderstanding as the code.">The function is correct, since the tests cover the main cases.</li>
<li data-fb="Passing self-written tests isn't evidence of correct behaviour.">The function is safe to merge after a quick style review.</li>
<li data-fb="Right. They can agree and both be wrong.">Mainly that code and tests agree with each other.</li>
<li data-fb="They can be useful; they just aren't independent.">Nothing at all, since generated tests are always worthless.</li>
</ul></div>
<h2>Where AI meets engineering work</h2>
<p>Code is the domain where AI output is easiest to check: you can run it. That's why the habits in this lesson centre on making correctness <em>executable</em> (examples, tests, reproductions) rather than relying on reading.</p>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Explaining unfamiliar code</td><td><span class="fit good">Good fit</span></td><td>Fast orientation. Confirm by reading the call sites it describes.</td></tr>
<tr><td>Boilerplate, glue code, scaffolding</td><td><span class="fit good">Good fit</span></td><td>Well-trodden patterns. Compile, run, read.</td></tr>
<tr><td>Writing tests for specified behaviour</td><td><span class="fit good">Good fit</span></td><td>Check that each test fails when the code is broken, not only that it passes.</td></tr>
<tr><td>Refactoring with tests in place</td><td><span class="fit good">Good fit</span></td><td>The tests are your safety net. Without them, it's “use with care”.</td></tr>
<tr><td>Debugging from errors and logs</td><td><span class="fit good">Good fit</span></td><td>Treat answers as hypotheses; confirm each before changing code.</td></tr>
<tr><td>Translating between languages or frameworks</td><td><span class="fit care">Use with care</span></td><td>Semantics differ subtly (integer division, nulls, time zones). Port the tests too.</td></tr>
<tr><td>Security-sensitive code: auth, crypto, input handling</td><td><span class="fit care">Use with care</span></td><td>Prefer established libraries; security review as for any change.</td></tr>
<tr><td>Adding dependencies</td><td><span class="fit care">Use with care</span></td><td>Packages can be invented (lesson 8). Verify before installing.</td></tr>
<tr><td>AI code review</td><td><span class="fit care">Use with care</span></td><td>Useful extra reviewer; doesn't replace a human who knows the system.</td></tr>
<tr><td>Architecture and technology choices</td><td><span class="fit human">Keep human</span></td><td>A good sparring partner for trade-offs. The decision depends on your team, constraints and history.</td></tr>
</tbody></table></div>

<h2>What the evidence says about speed</h2>
<p>Results depend heavily on the task and the person:</p>
<ul>
<li>In a controlled experiment, developers asked to build a small HTTP server in JavaScript finished 55.8% faster with an AI pair programmer than without.<sup>[1]</sup> A well-defined, self-contained task.</li>
<li>In a 2025 randomised trial, experienced open-source developers working on large projects they knew well took 19% longer with AI tools, though they believed they had been faster.<sup>[2]</sup> Mature codebases, high quality standards, deep existing expertise.</li>
<li>The 2024 DORA report found that, across its survey, higher AI adoption was associated with slightly lower software delivery throughput and stability, even as people reported feeling more productive.<sup>[3]</sup></li>
</ul>
<p>The takeaway isn't “AI helps” or “AI hurts”. Gains are real for some tasks and not automatic for others, and our sense of our own speed is a poor measure. Generating more code is only valuable if review, testing and maintenance keep up.</p>

<h2>Worked example: specify, then test</h2>
<p>A developer needs a function that turns durations like <code>"1h30m"</code> into seconds. They ask: <em>“Write a JavaScript function that parses durations like 2h, 45m, 1h30m and 90s into seconds.”</em> The assistant returns clean, readable code. It works on every example in the request.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Find the silent bug</span></div><div class="activity-b">
<p>This is the generated function, running live in your browser. Try the examples from the request, then try inputs a real user or config file might contain. Find an input that gives a wrong answer <em>without any error</em>.</p>
<div data-w="codetest"></div>
</div></div>

<p>What went wrong, step by step:</p>
<ol class="steps">
<li><strong>The regex looks for matches anywhere</strong><code>/(\d+)(h|m|s)/g</code> finds every number-plus-unit inside the string and ignores everything else. It never checks that the <em>whole</em> input is valid.</li>
<li><strong>So malformed input is partly read</strong><code>"1.5h"</code> contains <code>"5h"</code>, so it returns 18,000 seconds (five hours) instead of rejecting it or returning 5,400. <code>"1h30"</code> silently drops the 30.</li>
<li><strong>And invalid input becomes zero</strong><code>"2 hours"</code>, <code>""</code> and <code>"abc"</code> all return 0. A timeout of zero can mean “never wait” or “wait forever”, depending on the caller. Both are bad surprises.</li>
<li><strong>Why the model wrote it this way</strong>Pattern-matching with a global regex is a very common way to write this function, so it's a likely continuation. The examples in the request were all well-formed, so nothing pushed it toward validation.</li>
</ol>
<p>The fix is to validate the whole string and fail loudly. Better still, prevent the bug by putting the behaviour in the request as examples, including the bad ones:</p>
<div class="draft prompt"><div class="draft-h"><span><b>Better request</b></span></div><div class="draft-b">Write a JavaScript function parseDuration(input) that returns seconds.

Valid: "2h" → 7200, "45m" → 2700, "1h30m" → 5400, "90s" → 90, "1h0m5s" → 3605
Units must appear in the order h, m, s, each at most once. Whole numbers only.

Invalid, must throw an Error: "", "1.5h", "2 hours", "1h30", "30m1h", "-5m", "abc"

First write Jest tests for every example above, then the function.</div></div>
<p>Now the examples are a specification and the tests check it automatically. You still review the tests (do they test what you listed?), and you can check the tests have teeth by breaking the function on purpose and confirming they fail.</p>
<div class="key"><p>Turn “is this code right?” into “do these tests pass?”, and write or review the tests yourself. Tests are the cheapest way to check generated code, and the examples that drive them are the best context you can give.</p></div>

<h2>Debugging with evidence</h2>
<p>Lesson 2's checkout example showed the shape of a good debugging request: the exact error, the relevant code, what changed, what you've ruled out, and a request for hypotheses with checks. Two further habits:</p>
<ul>
<li><strong>Run the cheapest check first, and report back.</strong> “Logged the response; <code>discount</code> is missing when no discount applies.” Each result narrows the next answer.</li>
<li><strong>Ask why before asking for a fix.</strong> Assistants readily suggest a fix that removes the symptom: a null check, a broad <code>try/catch</code>, a retry. Those can hide the root cause. Ask “why is this undefined here?” first, then decide on the fix.</li>
</ul>

<h2>Dependencies and security</h2>
<ul>
<li><strong>Verify every new dependency.</strong> Does the package exist? Is it the one you meant (watch for near-identical names)? Is it maintained and widely used? Invented package names are a known attack route.<sup>[5]</sup></li>
<li><strong>Review generated code for security like any code.</strong> In one study, around 40% of AI-generated programs in security-relevant scenarios were vulnerable.<sup>[4]</sup> Typical issues: building SQL by joining strings instead of parameterised queries,<sup>[6]</sup> weak input validation, secrets in code, overly permissive settings.</li>
<li><strong>Keep secrets out of prompts</strong> (lesson 8). Describe the configuration rather than pasting it.</li>
</ul>

<h2>Reviewing AI-assisted pull requests</h2>
<p><strong>As the author:</strong> you own every line you submit. A useful bar: could you explain each change in review without the assistant open? Keep changes small enough to review properly, and follow your team's norm on mentioning AI assistance.</p>
<p><strong>As the reviewer:</strong> hold AI-assisted code to the same standard as any other. Look especially for:</p>
<ul>
<li>calls to functions, methods or options that don't exist in the version you use;</li>
<li>plausible code that isn't used, or handles cases that can't occur;</li>
<li>error handling that swallows problems instead of surfacing them;</li>
<li>tests that were changed to pass rather than code that was fixed (lesson 7);</li>
<li>a new dependency nobody discussed.</li>
</ul>

<h2>Tests as the specification</h2>
<p>Kent Beck, describing his own work with coding agents, puts tests at the centre: write the test that expresses what you want, let the agent make it pass, and watch for it trying to weaken or delete tests to get to green.[7] The tests are where your intent lives. If you write them (or carefully review them) before the implementation, generated code has to meet your specification. If the assistant writes both, nothing independent is checking either.</p>
<h2>Worked example: the date-range filter, test first</h2>
<div class="worked">
<div class="wx"><b>Generated with the code</b><div><pre>test("filters by range", () =&gt; {
  const r = filter(items, "2026-03-01",
                          "2026-03-31");
  expect(r.length).toBe(30);
});</pre></div></div>
<div class="wx strong"><b>Written first, from the requirement</b><div><pre>// Range is inclusive of both days,
// in the user's time zone.
test("includes the last day", () =&gt; {
  const r = filter([at("2026-03-31T23:30",
    "Europe/Paris")], "2026-03-01",
    "2026-03-31", "Europe/Paris");
  expect(r).toHaveLength(1);
});
test("excludes the day after", ...);
test("handles a DST change", ...);</pre></div></div>
</div>
<ul class="wx-notes">
<li><strong>The generated test asserts 30</strong>, which is what the buggy code returns. March has 31 days.</li>
<li><strong>The first-written tests encode decisions:</strong> inclusive end, the user's time zone, daylight-saving changes. The assistant couldn't know these.</li>
<li><strong>Edge cases come from the domain,</strong> not from the code. That's why you write them.</li>
<li><strong>Now let the assistant implement.</strong> If it changes a test to pass, that's a red flag in review.</li>
</ul>
<h2>Agree the rules in the repository</h2>
<p>Teams increasingly keep a short instructions file in the repository that coding assistants read: how to run the tests, conventions, things never to do. A shared format, AGENTS.md, is now supported by many tools.[8] It's the code equivalent of a context pack (lesson 2): the facts the model can't guess, written once and kept up to date.</p>
<h2>Your turn: write the tests first</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Tests for a function you'll ask AI to write</span></div><div class="activity-b">
<p>You'll ask an assistant to write <code>calculateLateFee(invoice, paidAt)</code>. Rules: 2% of the amount per full week late, capped at 10%; no fee if paid within a 3-day grace period after the due date; amounts in cents. Write the test cases (names and expected results are enough).</p>
<div data-w="task" data-key="eng-tests-first">
<div class="task-model"><ul>
<li>Paid on the due date: fee 0</li>
<li>Paid 3 days late (end of grace): fee 0</li>
<li>Paid 4 days late (grace over, under a full week): fee 0</li>
<li>Paid exactly 7 days late: 2%</li>
<li>Paid 13 days late: 2% (one full week)</li>
<li>Paid 14 days late: 4%</li>
<li>Paid 70 days late: capped at 10%</li>
<li>Amount 9,999 cents, 1 week: 199.98 → decide rounding (e.g. 200) and test it</li>
<li>Paid before the due date: fee 0</li>
</ul><p>Two questions to settle first: does the week count start at the due date or after the grace period, and how is rounding done?</p></div>
<ul class="task-rubric">
<li>Covers the grace period boundary on both sides</li>
<li>Covers full-week boundaries (6, 7, 13, 14 days)</li>
<li>Tests the 10% cap</li>
<li>Tests rounding with an amount that doesn't divide evenly</li>
<li>Lists ambiguities in the requirement to settle before coding</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick a small function you need to write. Before asking for code, write five to eight input/output examples, including at least three invalid inputs. Ask for tests first, then the implementation. Break the implementation deliberately and confirm at least one test fails. Note whether the examples changed what the assistant produced.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI makes every developer faster.</dt><dd>Results vary by task and experience. One controlled study found experienced developers were slower on their own repositories while believing they were faster.[2]</dd>
<dt>If tests pass, generated code is correct.</dt><dd>Only if the tests encode your intent independently. Tests generated with the code often encode its bugs.</dd>
<dt>Generated code is fine if it follows our style.</dt><dd>Style is easy for models. Logic, edge cases, security and dependencies are where problems hide.</dd>
<dt>Reviewing AI code takes less effort than writing it.</dt><dd>Reviewing code you didn't write, carefully, is real work. Budget time for it.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Write or carefully review tests before generating code; tests carry your intent.</li>
<li>Generated tests often confirm generated bugs; they aren't independent evidence.</li>
<li>Debug with evidence: real logs, real errors, a reproduction.</li>
<li>Check every new dependency exists and is the one you meant.</li>
<li>Keep repository instructions for assistants, like any other documentation.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Why write tests before asking an assistant to implement a function?</p><ul>
<li data-fb="They don't.">Assistants refuse to write code without existing tests.</li>
<li data-fb="Right. Then the code has to meet your specification.">So the tests encode your intent instead of the code's behaviour.</li>
<li data-fb="Test order doesn't affect performance.">Because writing tests first makes the finished code run noticeably faster.</li>
<li data-fb="That isn't the purpose.">To reduce the number of tokens the request uses.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">In review, you see an agent changed an assertion from 31 to 30 to make a test pass. What does that suggest?</p><ul>
<li data-fb="Possible, but check: this is exactly how bugs get hidden.">The original test had a typo the agent sensibly fixed.</li>
<li data-fb="Removing it hides the question.">The test was too strict for the new code and should simply be removed.</li>
<li data-fb="Changing tests to pass is a red flag.">The agent is working well and should be trusted.</li>
<li data-fb="Right. Check the requirement before accepting it.">The code may be wrong and the test was weakened to hide it.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What belongs in an AGENTS.md or similar instructions file?</p><ul>
<li data-fb="Right. The facts an assistant can't guess.">How to run tests, conventions, and things never to do.</li>
<li data-fb="Too much; link to it instead.">A full copy of the codebase documentation.</li>
<li data-fb="Shared conventions, not personal taste.">Personal preferences of whoever happened to set up the repository.</li>
<li data-fb="Never put secrets in repository files.">API keys the agent needs to run integration tests.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which edge case is an assistant least likely to know about unprompted?</p><ul>
<li data-fb="A common edge case models usually cover.">An empty list passed to a sorting function.</li>
<li data-fb="Widely discussed; often covered.">Division by zero when calculating an average over an empty set of values.</li>
<li data-fb="Right. Domain rules come from you.">Your business rule that refunds can't exceed the original charge.</li>
<li data-fb="A typical case it often handles.">A null value passed where an object is expected.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What did the METR study find about experienced developers using AI on their own repositories?</p><ul>
<li data-fb="Right. Perception and measurement diverged.">They took longer, while believing they were faster.</li>
<li data-fb="The study found the opposite on average.">They were twice as fast on every task they attempted.</li>
<li data-fb="They used it as allowed.">They refused to use AI for most of the tasks.</li>
<li data-fb="There was a measurable slowdown.">There was no difference at all in completion times.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Peng et al. (2023), <a href="https://arxiv.org/abs/2302.06590" target="_blank" rel="noopener">The Impact of AI on Developer Productivity: Evidence from GitHub Copilot</a>.</li>
<li>Becker et al., METR (2025), <a href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener">Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity</a>.</li>
<li>DORA, <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>.</li>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>.</li>
<li>Spracklen et al. (2024), <a href="https://arxiv.org/abs/2406.10279" target="_blank" rel="noopener">We Have a Package for You!</a> Package hallucinations by code-generating models.</li>
<li>OWASP, <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener">SQL Injection Prevention Cheat Sheet</a>.</li>

<li>Kent Beck (2025), <a href="https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes" target="_blank" rel="noopener">Augmented Coding: Beyond the Vibes</a>. Working with coding agents test-first, and watching for weakened tests.</li>
<li><a href="https://agents.md/" target="_blank" rel="noopener">AGENTS.md</a>. A shared format for repository instructions read by coding agents.</li>
</ol></section>
`
});
