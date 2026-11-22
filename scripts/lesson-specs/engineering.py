SPEC = dict(
file="10-engineering.js",
reviewed="2026-11",
outcomes=["Write tests first so generated code has to meet your specification, not its own."],
situation="""<p>A teammate's pull request adds a date-range filter. The code is clean, idiomatic and comes with twelve passing tests. All twelve were generated alongside the code, and all twelve test what the code does, including the off-by-one that drops the last day of every range.</p>
<p>Tests written by the same assistant that wrote the code tend to confirm it rather than challenge it. This lesson is about putting your specification in charge, so generated code has to meet your intent, not its own.</p>""",
warmup=dict(q="An assistant writes a function and its tests together, and all tests pass. What does that show?", a=2, opts=[
  ("The function is correct, since the tests cover the main cases.", "The tests may encode the same misunderstanding as the code."),
  ("The function is safe to merge after a quick style review.", "Passing self-written tests isn't evidence of correct behaviour."),
  ("Mainly that code and tests agree with each other.", "Right. They can agree and both be wrong."),
  ("Nothing at all, since generated tests are always worthless.", "They can be useful; they just aren't independent."),
 ]),
sections="""<h2>Tests as the specification</h2>
<p>Kent Beck, describing his own work with coding agents, puts tests at the centre: write the test that expresses what you want, let the agent make it pass, and watch for it trying to weaken or delete tests to get to green.[S1] The tests are where your intent lives. If you write them (or carefully review them) before the implementation, generated code has to meet your specification. If the assistant writes both, nothing independent is checking either.</p>
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
<p>Teams increasingly keep a short instructions file in the repository that coding assistants read: how to run the tests, conventions, things never to do. A shared format, AGENTS.md, is now supported by many tools.[S2] It's the code equivalent of a context pack (lesson 2): the facts the model can't guess, written once and kept up to date.</p>
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
</div></div></div>""",
myths=[
 ("AI makes every developer faster.", "Results vary by task and experience. One controlled study found experienced developers were slower on their own repositories while believing they were faster.[2]"),
 ("If tests pass, generated code is correct.", "Only if the tests encode your intent independently. Tests generated with the code often encode its bugs."),
 ("Generated code is fine if it follows our style.", "Style is easy for models. Logic, edge cases, security and dependencies are where problems hide."),
 ("Reviewing AI code takes less effort than writing it.", "Reviewing code you didn't write, carefully, is real work. Budget time for it."),
],
recap=[
 "Write or carefully review tests before generating code; tests carry your intent.",
 "Generated tests often confirm generated bugs; they aren't independent evidence.",
 "Debug with evidence: real logs, real errors, a reproduction.",
 "Check every new dependency exists and is the one you meant.",
 "Keep repository instructions for assistants, like any other documentation.",
],
checks=[
 dict(q="Why write tests before asking an assistant to implement a function?", a=1, opts=[
  ("Assistants refuse to write code without existing tests.", "They don't."),
  ("So the tests encode your intent instead of the code's behaviour.", "Right. Then the code has to meet your specification."),
  ("Because writing tests first makes the code run faster.", "Test order doesn't affect performance."),
  ("To reduce the number of tokens the request uses.", "That isn't the purpose."),
 ]),
 dict(q="In review, you see an agent changed an assertion from 31 to 30 to make a test pass. What does that suggest?", a=3, opts=[
  ("The original test had a typo the agent sensibly fixed.", "Possible, but check: this is exactly how bugs get hidden."),
  ("The test was too strict and should be removed.", "Removing it hides the question."),
  ("The agent is working well and should be trusted.", "Changing tests to pass is a red flag."),
  ("The code may be wrong and the test was weakened to hide it.", "Right. Check the requirement before accepting it."),
 ]),
 dict(q="What belongs in an AGENTS.md or similar instructions file?", a=0, opts=[
  ("How to run tests, conventions, and things never to do.", "Right. The facts an assistant can't guess."),
  ("A full copy of the codebase documentation.", "Too much; link to it instead."),
  ("Personal preferences of whoever set up the repository.", "Shared conventions, not personal taste."),
  ("API keys the agent needs to run integration tests.", "Never put secrets in repository files."),
 ]),
 dict(q="Which edge case is an assistant least likely to know about unprompted?", a=2, opts=[
  ("An empty list passed to a sorting function.", "A common edge case models usually cover."),
  ("Division by zero in an average calculation.", "Widely discussed; often covered."),
  ("Your business rule that refunds can't exceed the original charge.", "Right. Domain rules come from you."),
  ("A null value passed where an object is expected.", "A typical case it often handles."),
 ]),
 dict(q="What did the METR study find about experienced developers using AI on their own repositories?", a=0, opts=[
  ("They took longer, while believing they were faster.", "Right. Perception and measurement diverged."),
  ("They were twice as fast on every task they attempted.", "The study found the opposite on average."),
  ("They refused to use AI for most of the tasks.", "They used it as allowed."),
  ("There was no difference at all in completion times.", "There was a measurable slowdown."),
 ]),
],
sources=[
 'Kent Beck (2025), <a href="https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes" target="_blank" rel="noopener">Augmented Coding: Beyond the Vibes</a>. Working with coding agents test-first, and watching for weakened tests.',
 '<a href="https://agents.md/" target="_blank" rel="noopener">AGENTS.md</a>. A shared format for repository instructions read by coding agents.',
],
)
