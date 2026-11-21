GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["generated-suite"] = {
  label: "generated end-to-end tests for checkout",
  source: '<b>What you asked</b> “Write Playwright tests for the checkout flow: add to basket, apply a discount code, pay by card, see the confirmation.”<br><b>What came back</b> 14 tests, all passing on the first run, and this description of them.',
  claims: [
    { t: "All 14 tests pass against the staging environment.", v: "ok", why: "You saw the run. Passing is the starting point, though: next, check that each test would fail if the feature broke." },
    { t: "The discount tests verify that a valid code reduces the total.", v: "bad", why: "The test applies the code and asserts that the discount banner is visible. It never checks the total. A discount that shows a banner and charges full price would pass." },
    { t: "Each test waits for the page to be ready before acting.", v: "partial", why: "Several tests use a fixed waitForTimeout(3000). That's not waiting for readiness; it's guessing. It will be slow on fast runs and flaky on slow ones. Use web-first assertions that wait for a condition." },
    { t: "Selectors use stable test IDs, so the tests won't break when the layout changes.", v: "partial", why: "Most do. Three use CSS paths like div:nth-child(3) > button, which break the moment someone reorders the page." },
    { t: "The payment test covers declined cards.", v: "bad", why: "The test is called “handles declined card”, but it uses a card number that succeeds and asserts the confirmation page appears. The name promises a check the body doesn't make." },
    { t: "Coverage of the checkout module is now 92%.", v: "judg", why: "Possibly, but coverage only says which lines ran, not whether anything was checked. Tests with weak assertions can reach high coverage while catching little." }
  ],
  after: "A test is only worth having if it fails when the feature breaks. Read each assertion, not the test names, and treat fixed waits and brittle selectors as future flakiness."
};
GW.lesson({
  id: "qa-automation",
  lede: "AI can write a lot of test code very quickly: unit tests, end-to-end scripts, test data, selectors. That speed is useful and a little dangerous, because generated tests usually pass. The skill is telling a test that checks something from one that only runs.",
  outcomes: [
    "Use AI to draft tests, test data and page objects, and review them like production code.",
    "Spot tests that assert nothing meaningful, or less than their names claim.",
    "Recognise patterns that cause flaky tests, such as fixed waits and brittle selectors.",
    "Use mutation testing and deliberate breakage to check that tests actually catch faults."
  ],
  html: String.raw`
<h2>Where AI helps with automation</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting unit tests for a function you supply</td><td><span class="fit good">Good fit</span></td><td>Quick to produce and easy to read. Check every assertion, and add the cases it missed.</td></tr>
<tr><td>Test data: realistic names, edge-case strings, <a class="term" data-t="boundary-value">boundary values</a></td><td><span class="fit good">Good fit</span></td><td>Good at variety on request. Never paste real customer data in to “make it realistic” (lesson 8).</td></tr>
<tr><td>Converting manual test cases into scripts</td><td><span class="fit good">Good fit</span></td><td>Turns steps into code fast. Check that each expected result became an assertion.</td></tr>
<tr><td>Fixing a failing test</td><td><span class="fit care">Use with care</span></td><td>Assistants often fix the test instead of the bug. Ask why it fails before accepting any change.</td></tr>
<tr><td>Generating whole suites for coverage targets</td><td><span class="fit care">Use with care</span></td><td>Coverage rises easily. Whether faults get caught is a separate question.</td></tr>
<tr><td>Deciding what's worth testing</td><td><span class="fit human">Keep human</span></td><td>Depends on risk, users and history. AI can suggest; you prioritise.</td></tr>
</tbody></table></div>

<h2>A test that runs isn't a test that checks</h2>
<p>Generated tests fail in a few predictable ways. They assert that something exists rather than that it's right. They mirror the implementation, so they pass whatever the code does. Their names describe a scenario the body doesn't actually set up. All of these pass, which is exactly why they're dangerous: a green suite feels like evidence.</p>
<p>Meta's TestGen-LLM work shows a more careful pattern. Its generated tests had to build, pass reliably and add coverage before anyone saw them. Of the candidates it generated in one evaluation, 75% built correctly, 57% passed reliably and 25% increased coverage. Engineers accepted 73% of the improvements that got through those filters.<sup>[1]</sup> The point isn't the exact numbers. Most raw output didn't survive automatic checks, and what survived still went through human review.</p>

<h2>Worked example: a generated checkout suite</h2>
<p>You asked an assistant for end-to-end tests of the checkout flow. Fourteen tests came back, all green, with a confident description.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Read the assertions, not the names</span></div><div class="activity-b">
<p>Flag each statement about the suite that you wouldn't put in a release report.</p>
<div data-w="claims" data-cfg="generated-suite"></div>
</div></div>

<ol class="steps">
<li><strong>Two tests checked less than they claimed</strong>A visible banner isn't a correct total. A test named “declined card” that uses a working card checks nothing about declines.</li>
<li><strong>Fixed waits and positional selectors are flakiness waiting to happen</strong>They'll pass today and fail at random next month, and people will learn to rerun instead of investigating.</li>
<li><strong>Coverage was presented as quality</strong>It measures what ran. Whether a fault would be noticed needs a different check.</li>
</ol>
<div class="key"><p>Before you trust a test, make it fail. Break the code it protects and confirm it goes red for the right reason.</p></div>

<h2>Checking that tests catch faults</h2>
<p><strong>Break it on purpose.</strong> For any important generated test, change the code it covers (flip a condition, return a wrong value) and run it. If it still passes, it isn't testing that behaviour.</p>
<p><strong>Mutation testing</strong> automates the same idea. A tool seeds small faults into your code and runs the tests; any fault that survives shows a gap.<sup>[2]</sup> It's slower than a normal run, so use it on critical modules or on a new generated suite before you rely on it.</p>
<p><strong>Treat flakiness as a defect.</strong> Google's testing team has written about how flaky tests waste time and teach people to ignore failures.<sup>[3]</sup> The usual causes in generated UI tests are fixed sleeps, selectors tied to layout, shared test data and order-dependent tests. Ask the assistant to use condition-based waits and stable test IDs, and review for those patterns.</p>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>“Fix the failing test.”</strong> Asked this way, an assistant may change the assertion to match the bug. Ask it to explain the failure first.</li>
<li><strong>Snapshot everything.</strong> Generated snapshot tests pass until anything changes, then get updated without reading. They record, they don't check.</li>
<li><strong>Tests that copy the code's logic.</strong> If the test computes the expected value the same way the code does, both will be wrong together. Use known answers.</li>
<li><strong>Real data in prompts.</strong> Production records pasted in as examples end up in tools and fixtures they shouldn't be in.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take five generated tests from your codebase. For each one, break the code it covers and rerun it. Count how many stay green. Fix or delete those.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">A generated test called “rejects expired coupons” passes. What's the best quick check that it works?</p><ul>
<li data-fb="Names are what the test claims, not what it checks.">Read the test name and description again.</li>
<li data-fb="Coverage says the line ran, not that the result was checked.">Confirm the coupon code is covered.</li>
<li data-fb="Right. If it stays green when the behaviour breaks, it isn't testing it.">Make the code accept expired coupons and confirm the test fails.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which line in a generated UI test is most likely to cause flakiness?</p><ul>
<li data-fb="Right. A fixed sleep is too long on fast runs and too short on slow ones.">Wait a fixed 3 seconds before clicking Pay.</li>
<li data-fb="Waiting on a condition is the stable pattern.">Wait until the total shows £40.00, then continue.</li>
<li data-fb="A test ID is a stable selector.">Click the button with the test ID “pay”.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">After an assistant generated tests, coverage went from 60% to 90%. What does that tell you?</p><ul>
<li data-fb="Coverage doesn't measure whether faults are caught.">That the suite now catches 90% of bugs.</li>
<li data-fb="Right. More lines ran; mutation testing or deliberate breakage tells you whether they're checked.">That more code runs during tests, and nothing yet about whether it's checked.</li>
<li data-fb="Higher coverage isn't harmful in itself.">That the tests are probably useless.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Alshahwan et al. (2024), <a href="https://arxiv.org/abs/2402.09171" target="_blank" rel="noopener">Automated Unit Test Improvement using Large Language Models at Meta</a>. TestGen-LLM, which filters generated tests before engineers review them.</li>
<li>PIT, <a href="https://pitest.org/" target="_blank" rel="noopener">mutation testing for Java and the JVM</a>. A clear introduction to how mutation testing works, with similar tools for other languages.</li>
<li>Google Testing Blog (2016), <a href="https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html" target="_blank" rel="noopener">Flaky Tests at Google and How We Mitigate Them</a>.</li>
</ol></section>
`
});
