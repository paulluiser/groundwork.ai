GW.lesson({
  id: "engineering",
  lede: "Engineers were among the first to use AI every day, and the evidence on what it does for productivity is more mixed than the headlines suggest. This lesson focuses on the habits that make generated code safe to ship.",
  outcomes: [
    "Specify a coding task with examples and tests, so the output can be checked automatically.",
    "Find the kind of bug generated code tends to contain, by running it on edge cases.",
    "Debug with AI using evidence and hypotheses rather than guesses.",
    "Handle dependencies, security and code review for AI-assisted changes."
  ],
  html: String.raw`
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

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick a small function you need to write. Before asking for code, write five to eight input/output examples, including at least three invalid inputs. Ask for tests first, then the implementation. Break the implementation deliberately and confirm at least one test fails. Note whether the examples changed what the assistant produced.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">Generated code passes all the tests the assistant also generated. What else should you check?</p><ul>
<li data-fb="Tidy formatting says nothing about whether the tests are meaningful.">That the code is formatted consistently.</li>
<li data-fb="Its reassurance is another generated claim.">Ask the assistant whether the tests are thorough.</li>
<li data-fb="Right. Tests written alongside code can share its blind spots. Check they cover your cases, including invalid input, and that they fail when the code is broken.">That the tests cover the cases you care about, and fail when the code is wrong.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An assistant suggests wrapping a failing call in <code>try/catch</code> and returning an empty list on error. The error goes away. What's the concern?</p><ul>
<li data-fb="Right. The symptom is hidden, the cause is still there, and callers now get an empty list that looks like real data.">It may hide the real cause and turn a loud failure into silently wrong data.</li>
<li data-fb="Performance isn't the main issue here.">try/catch is slow.</li>
<li data-fb="It's not a style issue; it changes behaviour.">Empty lists are bad style.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Peng et al. (2023), <a href="https://arxiv.org/abs/2302.06590" target="_blank" rel="noopener">The Impact of AI on Developer Productivity: Evidence from GitHub Copilot</a>.</li>
<li>Becker et al., METR (2025), <a href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener">Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity</a>.</li>
<li>DORA, <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>.</li>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>.</li>
<li>Spracklen et al. (2024), <a href="https://arxiv.org/abs/2406.10279" target="_blank" rel="noopener">We Have a Package for You!</a> Package hallucinations by code-generating models.</li>
<li>OWASP, <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener">SQL Injection Prevention Cheat Sheet</a>.</li>
</ol></section>
`
});
