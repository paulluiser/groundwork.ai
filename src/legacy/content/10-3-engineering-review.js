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
  reviewed: "2026-11",
  lede: "As more code is written with AI, more of an engineer's day is spent reading it: reviewing pull requests, refactoring, and changing old systems nobody fully remembers. AI can help with all three, but it reads code the way it writes it, fluently and with blind spots that tend to fall in the same places.",
  outcomes: [
    "Use AI review as one extra reader, and know which defects it tends to miss.",
    "Spot the security flaws generated code often carries: missing authorization, invented packages, weakened tests.",
    "Run AI-assisted refactors and migrations behind tests, in small steps you can undo.",
    "Use AI to explain legacy code, and check its explanation against what the code actually does.",
    "Pin legacy behaviour with characterisation tests before changing it with AI help."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Nobody on the team has touched the invoicing module in four years. It works, mostly. You need to change how tax is rounded, and an assistant offers to “modernise” the whole file while it's at it: typed, tidy, half the length.</p>
<p>The rewrite reads beautifully and changes behaviour in three places nobody notices until month-end. This lesson is about changing old code safely: pinning what it does first, then changing it in small, reviewed steps.</p></div>
<div class="check warmup" data-a="3"><p class="q">Before refactoring old code with AI help, what's the most important step?</p><ul>
<li data-fb="Useful, but an explanation can be wrong.">Ask the assistant to explain what the code does.</li>
<li data-fb="That adds unrelated risk to the change.">Update all of the dependencies to their latest versions first.</li>
<li data-fb="Readability helps, but doesn't protect behaviour.">Rename variables so the code is easier to read.</li>
<li data-fb="Right. Then any change in behaviour shows up.">Write tests that capture what the code does today.</li>
</ul></div>
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

<h2>Characterisation tests</h2>
<p>A characterisation test records what code actually does, not what it should do. You call the existing code with real-looking inputs and assert whatever it returns today, including the odd results. Michael Feathers introduced the idea for working with legacy code: before you change something you don't fully understand, pin its current behaviour so any difference becomes visible.[4] AI is very good at generating these: give it the function and ask for tests covering normal, boundary and odd inputs that assert current outputs. You then read them, because the odd results are where the knowledge is.</p>
<h2>Worked example: a review summary you can use</h2>
<p>Asked to review a pull request, an assistant produces a summary. Here's how to read it.</p>
<div class="worked">
<div class="wx"><b>AI review summary</b><div><p>“Overall this PR looks good. Code is clean and well-structured. Consider adding more comments. One potential issue: the rounding function may have edge cases. LGTM with minor suggestions.”</p></div></div>
<div class="wx strong"><b>What you asked for instead</b><div><p>“For each changed function: what behaviour changed, with a before/after input that shows it. List any tests that were edited and why. Flag changes to money, auth, data deletion or external calls first.”</p><p>Result: <em>“roundTax(): 2.345 now rounds to 2.34 (was 2.35); banker's rounding replaced half-up. Test invoice.test.ts line 88 expectation changed to match.”</em></p></div></div>
</div>
<ul class="wx-notes">
<li><strong>“Looks good” is not a review.</strong> Ask for specific behaviour changes with examples.</li>
<li><strong>Prioritising money, auth, deletion and external calls</strong> points attention where errors cost most.</li>
<li><strong>The edited test is the finding:</strong> the change altered behaviour, and the test was adjusted to match.</li>
</ul>
<h2>Your turn: plan a safe change to legacy code</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Change rounding in an old module without surprises</span></div><div class="activity-b">
<p>You must change tax rounding from half-up to half-even in a 600-line, untested invoicing module. Write the steps you'd take, saying where AI helps and how you'd check each step.</p>
<div data-w="task" data-key="eng-legacy-plan">
<div class="task-model"><ol>
<li>Ask an assistant for characterisation tests of the module's public functions with normal, boundary (x.xx5) and odd inputs. Read them; fix any it got wrong by running them.</li>
<li>Commit the tests alone. They should pass on the current code.</li>
<li>Change only the rounding, in one small diff. Expect exactly the x.xx5 cases to fail.</li>
<li>Update only those expectations, each one deliberately, and note them in the PR.</li>
<li>Run last month's real invoices through old and new code and compare totals; explain every difference.</li>
<li>Tidying or modernising, if wanted, goes in a separate PR with no behaviour change.</li>
</ol></div>
<ul class="task-rubric">
<li>Pins current behaviour with tests before changing anything</li>
<li>Keeps the behaviour change small and separate from refactoring</li>
<li>Expects and explains each test that changes</li>
<li>Compares old and new results on real data</li>
<li>Uses AI for generating tests and summaries, with checks on both</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Reviewing the summary instead of the code.</strong> The summary is a map. Approve the territory.</li>
<li><strong>Rubber-stamping big AI diffs.</strong> If a change is too large to read, it's too large to merge. Ask for it in pieces.</li>
<li><strong>Letting the author's agent review its own work.</strong> The same model tends to share the same blind spots. Use a different reader, ideally a person.</li>
<li><strong>Turning off a failing check to finish a migration.</strong> A skipped test is a weakened test with extra steps.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Pick a recently merged pull request that touched access control. Run an AI review over it and compare what it says with what the human reviewers found. Note one thing each caught that the other didn't.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>An AI rewrite of legacy code is a safe way to modernise it.</dt><dd>Rewrites change behaviour in ways nobody notices. Pin behaviour first; refactor separately from changes.</dd>
<dt>AI review comments mean the code was reviewed.</dt><dd>Generic comments like “looks good” add little. Ask for specific behaviour changes and risks.</dd>
<dt>If the assistant explains the legacy code, I understand it.</dt><dd>Explanations can be confidently wrong. Tests that run show what it really does.</dd>
<dt>AI-generated code is more secure because it follows best practices.</dt><dd>Studies found people using assistants wrote less secure code while believing it was more secure.[2]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Pin legacy behaviour with characterisation tests before changing it.</li>
<li>Separate behaviour changes from refactoring, in different PRs.</li>
<li>Ask AI reviewers for specific behaviour changes with examples, money and auth first.</li>
<li>Treat edited tests as findings that need explaining.</li>
<li>Compare old and new code on real data before release.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">What does a characterisation test assert?</p><ul>
<li data-fb="Right. It pins current behaviour.">What the code does today, including odd results.</li>
<li data-fb="That's a specification test.">What the code should do according to the original spec.</li>
<li data-fb="That's a performance test.">That the code runs within its performance budget.</li>
<li data-fb="That's linting.">That the code follows the team's style guide.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which AI review request produces the most useful output?</p><ul>
<li data-fb="Invites a generic approval.">“Review this PR and tell me if it looks good.”</li>
<li data-fb="Better, but unfocused.">“Find any bugs you can see in this code.”</li>
<li data-fb="Right. Specific, checkable and prioritised.">“List behaviour changes with a before/after example, money and auth first.”</li>
<li data-fb="Style suggestions, not risks.">“Suggest any improvements that would make this code cleaner, shorter and easier to maintain over time.”</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why keep refactoring and behaviour changes in separate pull requests?</p><ul>
<li data-fb="Not a CI requirement.">Smaller PRs are required by most CI systems.</li>
<li data-fb="Right. Mixed diffs hide behaviour changes.">So any change in behaviour is visible and intended.</li>
<li data-fb="They still need review, for no behaviour change.">Refactoring PRs don't need any careful review at all from the team.</li>
<li data-fb="They can; that's the risk.">AI tools can't handle both in one request.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">In a refactoring PR, a test's expected value changed from 2.35 to 2.34. What is it?</p><ul>
<li data-fb="In a refactor, behaviour shouldn't change.">A harmless update to keep the tests in sync with the code.</li>
<li data-fb="Possibly, but it needs evidence.">A sign the old test was always wrong.</li>
<li data-fb="The value changed, not the format.">A formatting fix to the test file.</li>
<li data-fb="Right. It's the most important line in the PR.">A behaviour change that needs a reason and a decision.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What's the best final check before releasing a change to tax rounding?</p><ul>
<li data-fb="Right. Real data shows the actual impact.">Run real recent invoices through old and new code and explain differences.</li>
<li data-fb="Its answer isn't evidence.">Ask the assistant to confirm the change is correct for every invoice type, including the ones in last month's batch.</li>
<li data-fb="Linting doesn't check behaviour.">Check the code has no linting warnings.</li>
<li data-fb="Useful, but not a check of behaviour.">Make sure the PR description is detailed.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Pearce et al. (2021), <a href="https://arxiv.org/abs/2108.09293" target="_blank" rel="noopener">Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions</a>. About 40% of programs in security-relevant scenarios were vulnerable.</li>
<li>Perry et al. (2022), <a href="https://arxiv.org/abs/2211.03622" target="_blank" rel="noopener">Do Users Write More Insecure Code with AI Assistants?</a> A user study: less secure code, and more confidence in it.</li>
<li>Spracklen et al. (2024), <a href="https://arxiv.org/abs/2406.10279" target="_blank" rel="noopener">We Have a Package for You!</a> Package hallucinations by code-generating models, across 16 models.</li>

<li>Michael Feathers (2004), <em>Working Effectively with Legacy Code</em>. Introduces characterisation tests; see also Martin Fowler's <a href="https://martinfowler.com/bliki/" target="_blank" rel="noopener">bliki</a> on refactoring.</li>
<li>Google, <a href="https://google.github.io/eng-practices/review/" target="_blank" rel="noopener">Engineering Practices: Code Review</a>. What reviewers look for and how to keep changes small.</li>
</ol></section>
`
});
