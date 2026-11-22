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
  reviewed: "2026-11",
  lede: "AI can write a lot of test code very quickly: unit tests, end-to-end scripts, test data, selectors. That speed is useful and a little dangerous, because generated tests usually pass. The skill is telling a test that checks something from one that only runs.",
  outcomes: [
    "Use AI to draft tests, test data and page objects, and review them like production code.",
    "Spot tests that assert nothing meaningful, or less than their names claim.",
    "Recognise patterns that cause flaky tests, such as fixed waits and brittle selectors.",
    "Use mutation testing and deliberate breakage to check that tests actually catch faults.",
    "Decide which layer of the test pyramid a generated test belongs in."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your end-to-end suite has grown from 40 to 400 tests in two months, almost all generated. It now takes 50 minutes, fails randomly twice a day, and the team has started re-running it until it goes green. Nobody remembers which tests matter.</p>
<p>Generated tests are cheap to create and expensive to own. This lesson is about keeping a suite that's fast, trustworthy and actually catches faults.</p></div>
<div class="check warmup" data-a="0"><p class="q">A generated test checks that the checkout page loads and has a “Pay” button. What does it catch?</p><ul>
<li data-fb="Right. It runs, but checks almost nothing about checkout.">Very little: the page could charge the wrong amount and still pass.</li>
<li data-fb="Presence of a button says nothing about payment.">Most checkout bugs, since the button is the key element.</li>
<li data-fb="It never completes or checks a payment.">All payment errors, because the test exercises the whole checkout flow from start to end.</li>
<li data-fb="It doesn't check layout or device sizes.">Layout regressions on mobile devices.</li>
</ul></div>
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

<h2>Put each test in the right layer</h2>
<p>The test pyramid is a reminder that most checks belong in fast, focused unit tests, fewer in integration tests, and only a small number in slow end-to-end tests that drive a real browser.[4] Assistants tend to generate whatever you ask for, so if you ask for end-to-end tests you get end-to-end tests of things a unit test would check faster and more reliably. Before accepting a generated test, ask what it checks and which is the lowest layer that could check it.</p>
<h2>Worked example: moving tests down the pyramid</h2>
<div class="tbl"><table><thead><tr><th>Generated end-to-end test</th><th>What it really checks</th><th>Better layer</th></tr></thead><tbody>
<tr><td>Applies a 10% coupon in the browser and reads the total</td><td>Discount calculation</td><td>Unit test of the pricing function, with many coupon cases</td></tr>
<tr><td>Submits checkout with an expired card</td><td>Error handling from the payment provider</td><td>Integration test with the provider's sandbox</td></tr>
<tr><td>Completes a full purchase and sees the receipt</td><td>The whole flow works together</td><td>Keep as end-to-end: one of a few critical journeys</td></tr>
<tr><td>Checks the footer links on 12 pages</td><td>Static content</td><td>A link checker in CI, not 12 browser tests</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Only one of four belongs at the top.</strong> The others become faster, more precise and less flaky lower down.</li>
<li><strong>Unit tests of pricing can cover dozens of cases</strong> in the time one browser test takes.</li>
<li><strong>Flakiness falls</strong> as browser tests shrink to the critical journeys.[3]</li>
</ul>
<h2>Your turn: review a generated test</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">What's wrong with this test, and where should it live?</span></div><div class="activity-b">
<p>A generated Playwright test is named <code>"user can update profile"</code>. It logs in, opens the profile page, types a new display name, clicks Save, waits 3 seconds, and asserts the Save button is visible. Explain what it fails to check, how you'd fix it, and whether it belongs in the end-to-end suite.</p>
<div data-w="task" data-key="qa-review-test">
<div class="task-model"><p><strong>What it misses:</strong> it never checks the name changed. The Save button is visible whether saving worked or failed.</p>
<p><strong>Fixes:</strong> assert the new name appears after a reload (proving it was stored); replace the fixed 3-second wait with waiting for the success message; add a failure case (name too long shows an error and keeps the old name).</p>
<p><strong>Layer:</strong> validation rules belong in unit tests of the profile service. Keep one end-to-end test only if profile editing is a critical journey; otherwise an API-level integration test is enough.</p></div>
<ul class="task-rubric">
<li>Notices the assertion doesn't check the outcome</li>
<li>Asserts the change persisted, for example after a reload</li>
<li>Replaces the fixed wait with waiting for a condition</li>
<li>Adds a failure case</li>
<li>Considers moving checks to a lower, faster layer</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>“Fix the failing test.”</strong> Asked this way, an assistant may change the assertion to match the bug. Ask it to explain the failure first.</li>
<li><strong>Snapshot everything.</strong> Generated snapshot tests pass until anything changes, then get updated without reading. They record, they don't check.</li>
<li><strong>Tests that copy the code's logic.</strong> If the test computes the expected value the same way the code does, both will be wrong together. Use known answers.</li>
<li><strong>Real data in prompts.</strong> Production records pasted in as examples end up in tools and fixtures they shouldn't be in.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take five generated tests from your codebase. For each one, break the code it covers and rerun it. Count how many stay green. Fix or delete those.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A passing generated test proves the feature works.</dt><dd>It proves the test ran. Read the assertions to see what it actually checks.</dd>
<dt>End-to-end tests are the most realistic, so more is better.</dt><dd>They're slow and flaky. Keep a few for critical journeys; test details lower down.</dd>
<dt>Fixed waits make tests reliable.</dt><dd>They make tests slow and still flaky. Wait for conditions instead.</dd>
<dt>Mutation testing is too academic for real teams.</dt><dd>Running it on one critical module shows quickly whether your tests catch faults.[2]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Read assertions, not names: a test is only as good as what it checks.</li>
<li>Put each check in the lowest layer that can catch the fault.</li>
<li>Keep end-to-end tests for a few critical journeys.</li>
<li>Replace fixed waits with waits for conditions; track and fix flaky tests.</li>
<li>Use mutation testing to see whether tests catch real faults.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Where should a check of discount calculations with 30 coupon cases live?</p><ul>
<li data-fb="Slow and flaky for what is pure calculation.">In 30 end-to-end browser tests, one per coupon type.</li>
<li data-fb="Right. Fast, precise and easy to extend.">In unit tests of the pricing function.</li>
<li data-fb="Manual repetition of calculations is wasteful.">In a manual test script run before each release.</li>
<li data-fb="Pricing errors are costly; test them.">Nowhere, since coupon logic rarely changes.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">A test waits a fixed 3 seconds before asserting. What's the problem?</p><ul>
<li data-fb="The length isn't the core issue.">Three seconds is too short for most web pages to load.</li>
<li data-fb="They're supported, just discouraged.">Fixed waits aren't supported by modern end-to-end test frameworks.</li>
<li data-fb="Usually the opposite: it's slow everywhere.">It makes the test fail on fast computers.</li>
<li data-fb="Right. Wait for a condition instead.">It's slow when things are fast and flaky when they're slow.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which end-to-end test is most worth keeping?</p><ul>
<li data-fb="Right. A critical journey across the whole system.">Completing a purchase and seeing the receipt.</li>
<li data-fb="A link checker does this faster.">Checking footer links on every page in the browser.</li>
<li data-fb="A visual or unit test fits better.">Checking the colour of the primary button.</li>
<li data-fb="Validation belongs in unit tests.">Typing invalid emails into the signup form.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What does mutation testing tell you?</p><ul>
<li data-fb="That's line coverage.">How many lines and branches of the code the tests execute.</li>
<li data-fb="That's test timing.">How long each test takes to run.</li>
<li data-fb="Right. Surviving mutants show checks that are missing.">Whether your tests fail when the code is deliberately broken.</li>
<li data-fb="It doesn't distinguish authors.">Which tests were generated by AI.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Your suite is flaky and the team re-runs until it's green. What's the main risk?</p><ul>
<li data-fb="True, but not the main risk.">CI costs increase because of the extra runs.</li>
<li data-fb="Right. The suite stops protecting you.">Real failures get dismissed as flakiness.</li>
<li data-fb="Not the main risk.">Developers lose interest in writing new features.</li>
<li data-fb="Frameworks don't wear out.">The test framework will eventually stop working.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Alshahwan et al. (2024), <a href="https://arxiv.org/abs/2402.09171" target="_blank" rel="noopener">Automated Unit Test Improvement using Large Language Models at Meta</a>. TestGen-LLM, which filters generated tests before engineers review them.</li>
<li>PIT, <a href="https://pitest.org/" target="_blank" rel="noopener">mutation testing for Java and the JVM</a>. A clear introduction to how mutation testing works, with similar tools for other languages.</li>
<li>Google Testing Blog (2016), <a href="https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html" target="_blank" rel="noopener">Flaky Tests at Google and How We Mitigate Them</a>.</li>

<li>Ham Vocke, martinfowler.com (2018), <a href="https://martinfowler.com/articles/practical-test-pyramid.html" target="_blank" rel="noopener">The Practical Test Pyramid</a>. Which checks belong at which level, with examples.</li>
</ol></section>
`
});
