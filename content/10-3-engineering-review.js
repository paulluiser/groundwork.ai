GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["review-summary"] = {
  label: "AI review of a pull request",
  source: '<b>The pull request</b> Adds an endpoint, <code>PATCH /api/projects/:id/members</code>, so project owners can add and remove members. 6 files changed, 212 lines added.<br><b>What you asked the review tool</b> “Review this PR for bugs, security issues and test quality. Summarise what matters.”',
  claims: [
    { t: "The new endpoint requires a valid session, so only signed-in users can call it.", v: "partial", why: "True, but it's authentication only. Nothing checks that the caller owns this project, so any signed-in user can change any project's members. The summary describes the check that exists and stays quiet about the one that's missing." },
    { t: "Input is validated with the existing zod schema for member updates.", v: "ok", why: "You can see the schema import and the parse call in the diff. A quick look confirms it." },
    { t: "The change adds the well-maintained package express-member-guard for role checks.", v: "none", why: "Look it up before you trust it. Code models suggest packages that don't exist, and attackers register those names. Here the import is in the diff, but the registry has no such package by any known maintainer." },
    { t: "Tests cover adding and removing members, including the error cases.", v: "bad", why: "The diff changed an existing test from expecting 403 to expecting 200 when a non-owner removes a member. That's a weakened test passing off a security change as an expected result." },
    { t: "Performance should be fine, since the member list is small.", v: "judg", why: "Maybe. The review tool can't see production data sizes. Ask for the query plan or check the largest project, if it matters." },
    { t: "No other files are affected by this change.", v: "none", why: "A diff-only review can't see callers elsewhere in the codebase. Search for other uses of the changed service function before believing this." }
  ],
  after: "AI review is good at describing what's in the diff. It's weakest at what's missing (an authorization check), what's outside the diff (callers, data sizes) and changes that make tests pass by asking for less."
};
GW.lesson({
  id: "engineering-review",
  lede: "As more code is written with AI, more of an engineer's day is spent reading it: reviewing pull requests, refactoring, and changing old systems nobody fully remembers. AI can help with all three, but it reads code the way it writes it, fluently and with blind spots that tend to fall in the same places.",
  outcomes: [
    "Use AI review as one extra reader, and know which defects it tends to miss.",
    "Spot the security flaws generated code often carries: missing authorization, invented packages, weakened tests.",
    "Run AI-assisted refactors and migrations behind tests, in small steps you can undo.",
    "Use AI to explain legacy code, and check its explanation against what the code actually does."
  ],
  html: String.raw`
<h2>Where AI helps with review and change</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Summarising a large diff</td><td><span class="fit good">Good fit</span></td><td>Fast orientation before you read. Check the summary against the files, not the other way round.</td></tr>
<tr><td>First-pass review comments</td><td><span class="fit good">Good fit</span></td><td>Catches naming, missing null handling and obvious slips. Expect some <a class="term" data-t="false-positive">false positives</a>.</td></tr>
<tr><td>Explaining unfamiliar or legacy code</td><td><span class="fit good">Good fit</span></td><td>A useful first reading. Confirm the key claims by running the code or a test.</td></tr>
<tr><td>Mechanical refactors and migrations</td><td><span class="fit care">Use with care</span></td><td>Fast and consistent, but only safe behind tests that pin down current behaviour.</td></tr>
<tr><td>Security sign-off</td><td><span class="fit care">Use with care</span></td><td>A helpful layer, not the gate. It misses what isn't in the diff, especially authorization (lesson 21).</td></tr>
<tr><td>Approving the merge</td><td><span class="fit human">Keep human</span></td><td>Someone who understands the change has to own it. “The AI reviewed it” is not an owner.</td></tr>
</tbody></table></div>

<h2>The flaws generated code tends to carry</h2>
<p>The research is consistent on one point: AI-written code isn't more secure by default, and people using it often think it is. In a 2021 study of an early coding assistant, about 40% of programs it produced in security-relevant scenarios were vulnerable.<sup>[1]</sup> In a 2022 user study, participants with an AI assistant wrote significantly less secure code than those without one, and were more likely to believe their code was secure.<sup>[2]</sup> That second finding matters most in review: the author's confidence tells you little.</p>
<p>Three patterns come up again and again:</p>
<ul>
<li><strong>Missing <a class="term" data-t="authorization">authorization</a>.</strong> The code checks who you are, but not whether this record is yours. It looks complete because the happy path works.</li>
<li><strong>Invented packages.</strong> A large study found that at least 5.2% of packages suggested by commercial models, and 21.7% by open-source ones, didn't exist.<sup>[3]</sup> Attackers can publish malware under those names (<a class="term" data-t="package-hallucination">package hallucination</a>).</li>
<li><strong>Weakened tests.</strong> When an agent is asked to make tests pass, changing the expected value is often the shortest route. Read test diffs as carefully as code diffs.</li>
</ul>

<h2>Worked example: an AI review summary</h2>
<p>A colleague opened a pull request adding an endpoint for managing project members, and you ran an AI review tool over it. The summary is tidy and reassuring.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the review before you approve</span></div><div class="activity-b">
<p>Flag every sentence you wouldn't sign off on as written.</p>
<div data-w="claims" data-cfg="review-summary"></div>
</div></div>

<ol class="steps">
<li><strong>The missing check was described as a present one</strong>“Requires a valid session” is true and beside the point. Ask the reviewer, and yourself: who else could call this, and what stops them?</li>
<li><strong>A test diff was summarised as coverage</strong>A 403 that became a 200 is the most important line in the pull request. Look at every changed assertion.</li>
<li><strong>The review only saw the diff</strong>Claims about the rest of the codebase or production need evidence from outside the diff: a search, a query plan, a run.</li>
</ol>
<div class="key"><p>An AI review tells you about the code it was shown. Your review has to ask what's missing, what's outside the diff, and what the tests stopped asking for.</p></div>

<h2>Refactors and migrations behind tests</h2>
<p>Large mechanical changes are where AI saves the most time: renaming across a codebase, moving from one library version to the next, converting callbacks to async code. They're also where a subtle change in behaviour can hide among hundreds of correct edits. Work in this order:</p>
<ol>
<li><strong>Pin current behaviour first.</strong> Before changing anything, make sure tests cover what the code does now, including the odd cases. If there aren't any, ask the assistant to write characterisation tests, then check they pass against the old code.</li>
<li><strong>Change in small, reviewable steps.</strong> One module or one pattern per pull request. A 3,000-line AI diff won't be reviewed properly, however good the summary.</li>
<li><strong>Run the tests after every step,</strong> and treat any test change during a refactor as a red flag. A refactor shouldn't change what the tests expect.</li>
<li><strong>Keep a way back.</strong> Feature flags or a clean revert for each step.</li>
</ol>

<h2>Legacy code</h2>
<p>Assistants are good at reading old code aloud: what a function seems to do, what the strange flag might be for. Treat the explanation as a hypothesis. Old code often does something different from what its names suggest, and a fluent explanation follows the names. Confirm the important claims by running the code with a few inputs, or by writing a test that would fail if the explanation were wrong.</p>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Reviewing the summary instead of the code.</strong> The summary is a map. Approve the territory.</li>
<li><strong>Rubber-stamping big AI diffs.</strong> If a change is too large to read, it's too large to merge. Ask for it in pieces.</li>
<li><strong>Letting the author's agent review its own work.</strong> The same model tends to share the same blind spots. Use a different reader, ideally a person.</li>
<li><strong>Turning off a failing check to finish a migration.</strong> A skipped test is a weakened test with extra steps.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Pick a recently merged pull request that touched access control. Run an AI review over it and compare what it says with what the human reviewers found. Note one thing each caught that the other didn't.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An AI review says a new endpoint “requires authentication”. What's the most important follow-up question?</p><ul>
<li data-fb="Possibly useful, but a token type doesn't tell you who can see which records.">Which kind of token it uses.</li>
<li data-fb="Right. Authentication says who you are; authorization says whether this record is yours.">Whether it checks that the caller may act on this specific record.</li>
<li data-fb="Speed matters less than who can call it.">Whether the endpoint is fast enough.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">During an AI-assisted refactor, a test's expected value changes. What should you do?</p><ul>
<li data-fb="That's exactly how behaviour changes slip in unnoticed.">Accept it if the rest of the suite passes.</li>
<li data-fb="It's not the assistant's call whether behaviour may change.">Ask the assistant whether the change is fine.</li>
<li data-fb="Right. A refactor shouldn't change what tests expect, so find out why it did.">Treat it as a behaviour change, and investigate before merging.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An assistant explains a legacy function confidently. How should you use the explanation?</p><ul>
<li data-fb="Right. Names and comments can mislead; running the code can't.">As a hypothesis, confirmed by running the code or writing a test.</li>
<li data-fb="Fluent explanations often follow the names, and old names can be wrong.">As documentation, copied straight into the wiki.</li>
<li data-fb="That throws away a useful first reading.">Not at all; legacy code is too risky for AI.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>. About 40% of programs in security-relevant scenarios were vulnerable.</li>
<li>Perry et al. (2022), <a href="https://arxiv.org/abs/2211.03622" target="_blank" rel="noopener">Do Users Write More Insecure Code with AI Assistants?</a> A user study: less secure code, and more confidence in it.</li>
<li>Spracklen et al. (2024), <a href="https://arxiv.org/abs/2406.10279" target="_blank" rel="noopener">We Have a Package for You!</a> Package hallucinations by code-generating models, across 16 models.</li>
</ol></section>
`
});
