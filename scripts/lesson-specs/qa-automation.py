SPEC = dict(
file="11-2-qa-automation.js",
reviewed="2026-11",
outcomes=["Decide which layer of the test pyramid a generated test belongs in."],
situation="""<p>Your end-to-end suite has grown from 40 to 400 tests in two months, almost all generated. It now takes 50 minutes, fails randomly twice a day, and the team has started re-running it until it goes green. Nobody remembers which tests matter.</p>
<p>Generated tests are cheap to create and expensive to own. This lesson is about keeping a suite that's fast, trustworthy and actually catches faults.</p>""",
warmup=dict(q="A generated test checks that the checkout page loads and has a “Pay” button. What does it catch?", a=0, opts=[
  ("Very little: the page could charge the wrong amount and still pass.", "Right. It runs, but checks almost nothing about checkout."),
  ("Most checkout bugs, since the button is the key element.", "Presence of a button says nothing about payment."),
  ("All payment errors, because the test exercises the checkout flow.", "It never completes or checks a payment."),
  ("Layout regressions on mobile devices.", "It doesn't check layout or device sizes."),
 ]),
sections="""<h2>Put each test in the right layer</h2>
<p>The test pyramid is a reminder that most checks belong in fast, focused unit tests, fewer in integration tests, and only a small number in slow end-to-end tests that drive a real browser.[S1] Assistants tend to generate whatever you ask for, so if you ask for end-to-end tests you get end-to-end tests of things a unit test would check faster and more reliably. Before accepting a generated test, ask what it checks and which is the lowest layer that could check it.</p>
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
</div></div></div>""",
myths=[
 ("A passing generated test proves the feature works.", "It proves the test ran. Read the assertions to see what it actually checks."),
 ("End-to-end tests are the most realistic, so more is better.", "They're slow and flaky. Keep a few for critical journeys; test details lower down."),
 ("Fixed waits make tests reliable.", "They make tests slow and still flaky. Wait for conditions instead."),
 ("Mutation testing is too academic for real teams.", "Running it on one critical module shows quickly whether your tests catch faults.[2]"),
],
recap=[
 "Read assertions, not names: a test is only as good as what it checks.",
 "Put each check in the lowest layer that can catch the fault.",
 "Keep end-to-end tests for a few critical journeys.",
 "Replace fixed waits with waits for conditions; track and fix flaky tests.",
 "Use mutation testing to see whether tests catch real faults.",
],
checks=[
 dict(q="Where should a check of discount calculations with 30 coupon cases live?", a=1, opts=[
  ("In 30 end-to-end browser tests, one per coupon type.", "Slow and flaky for what is pure calculation."),
  ("In unit tests of the pricing function.", "Right. Fast, precise and easy to extend."),
  ("In a manual test script run before each release.", "Manual repetition of calculations is wasteful."),
  ("Nowhere, since coupon logic rarely changes.", "Pricing errors are costly; test them."),
 ]),
 dict(q="A test waits a fixed 3 seconds before asserting. What's the problem?", a=3, opts=[
  ("Three seconds is too short for most web pages to load.", "The length isn't the core issue."),
  ("Fixed waits aren't supported by modern test frameworks.", "They're supported, just discouraged."),
  ("It makes the test fail on fast computers.", "Usually the opposite: it's slow everywhere."),
  ("It's slow when things are fast and flaky when they're slow.", "Right. Wait for a condition instead."),
 ]),
 dict(q="Which end-to-end test is most worth keeping?", a=0, opts=[
  ("Completing a purchase and seeing the receipt.", "Right. A critical journey across the whole system."),
  ("Checking footer links on every page in the browser.", "A link checker does this faster."),
  ("Checking the colour of the primary button.", "A visual or unit test fits better."),
  ("Typing invalid emails into the signup form.", "Validation belongs in unit tests."),
 ]),
 dict(q="What does mutation testing tell you?", a=2, opts=[
  ("How many lines of code the tests execute.", "That's line coverage."),
  ("How long each test takes to run.", "That's test timing."),
  ("Whether your tests fail when the code is deliberately broken.", "Right. Surviving mutants show checks that are missing."),
  ("Which tests were generated by AI.", "It doesn't distinguish authors."),
 ]),
 dict(q="Your suite is flaky and the team re-runs until it's green. What's the main risk?", a=1, opts=[
  ("CI costs increase because of the extra runs.", "True, but not the main risk."),
  ("Real failures get dismissed as flakiness.", "Right. The suite stops protecting you."),
  ("Developers lose interest in writing new features.", "Not the main risk."),
  ("The test framework will eventually stop working.", "Frameworks don't wear out."),
 ]),
],
sources=[
 'Ham Vocke, martinfowler.com (2018), <a href="https://martinfowler.com/articles/practical-test-pyramid.html" target="_blank" rel="noopener">The Practical Test Pyramid</a>. Which checks belong at which level, with examples.',
],
)
