SPEC = dict(
file="10-3-engineering-review.js",
reviewed="2026-11",
outcomes=["Pin legacy behaviour with characterisation tests before changing it with AI help."],
situation="""<p>Nobody on the team has touched the invoicing module in four years. It works, mostly. You need to change how tax is rounded, and an assistant offers to “modernise” the whole file while it's at it: typed, tidy, half the length.</p>
<p>The rewrite reads beautifully and changes behaviour in three places nobody notices until month-end. This lesson is about changing old code safely: pinning what it does first, then changing it in small, reviewed steps.</p>""",
warmup=dict(q="Before refactoring old code with AI help, what's the most important step?", a=3, opts=[
  ("Ask the assistant to explain what the code does.", "Useful, but an explanation can be wrong."),
  ("Update the dependencies to their latest versions.", "That adds unrelated risk to the change."),
  ("Rename variables so the code is easier to read.", "Readability helps, but doesn't protect behaviour."),
  ("Write tests that capture what the code does today.", "Right. Then any change in behaviour shows up."),
 ]),
sections="""<h2>Characterisation tests</h2>
<p>A characterisation test records what code actually does, not what it should do. You call the existing code with real-looking inputs and assert whatever it returns today, including the odd results. Michael Feathers introduced the idea for working with legacy code: before you change something you don't fully understand, pin its current behaviour so any difference becomes visible.[S1] AI is very good at generating these: give it the function and ask for tests covering normal, boundary and odd inputs that assert current outputs. You then read them, because the odd results are where the knowledge is.</p>
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
</div></div></div>""",
myths=[
 ("An AI rewrite of legacy code is a safe way to modernise it.", "Rewrites change behaviour in ways nobody notices. Pin behaviour first; refactor separately from changes."),
 ("AI review comments mean the code was reviewed.", "Generic comments like “looks good” add little. Ask for specific behaviour changes and risks."),
 ("If the assistant explains the legacy code, I understand it.", "Explanations can be confidently wrong. Tests that run show what it really does."),
 ("AI-generated code is more secure because it follows best practices.", "Studies found people using assistants wrote less secure code while believing it was more secure.[2]"),
],
recap=[
 "Pin legacy behaviour with characterisation tests before changing it.",
 "Separate behaviour changes from refactoring, in different PRs.",
 "Ask AI reviewers for specific behaviour changes with examples, money and auth first.",
 "Treat edited tests as findings that need explaining.",
 "Compare old and new code on real data before release.",
],
checks=[
 dict(q="What does a characterisation test assert?", a=0, opts=[
  ("What the code does today, including odd results.", "Right. It pins current behaviour."),
  ("What the code should do according to the original spec.", "That's a specification test."),
  ("That the code runs within its performance budget.", "That's a performance test."),
  ("That the code follows the team's style guide.", "That's linting."),
 ]),
 dict(q="Which AI review request produces the most useful output?", a=2, opts=[
  ("“Review this PR and tell me if it looks good.”", "Invites a generic approval."),
  ("“Find any bugs you can see in this code.”", "Better, but unfocused."),
  ("“List behaviour changes with a before/after example, money and auth first.”", "Right. Specific, checkable and prioritised."),
  ("“Suggest improvements to make this code cleaner.”", "Style suggestions, not risks."),
 ]),
 dict(q="Why keep refactoring and behaviour changes in separate pull requests?", a=1, opts=[
  ("Smaller PRs are required by most CI systems.", "Not a CI requirement."),
  ("So any change in behaviour is visible and intended.", "Right. Mixed diffs hide behaviour changes."),
  ("Refactoring PRs don't need any review at all.", "They still need review, for no behaviour change."),
  ("AI tools can't handle both in one request.", "They can; that's the risk."),
 ]),
 dict(q="In a refactoring PR, a test's expected value changed from 2.35 to 2.34. What is it?", a=3, opts=[
  ("A harmless update to keep the tests in sync with the code.", "In a refactor, behaviour shouldn't change."),
  ("A sign the old test was always wrong.", "Possibly, but it needs evidence."),
  ("A formatting fix to the test file.", "The value changed, not the format."),
  ("A behaviour change that needs a reason and a decision.", "Right. It's the most important line in the PR."),
 ]),
 dict(q="What's the best final check before releasing a change to tax rounding?", a=0, opts=[
  ("Run real recent invoices through old and new code and explain differences.", "Right. Real data shows the actual impact."),
  ("Ask the assistant whether the change is correct.", "Its answer isn't evidence."),
  ("Check the code has no linting warnings.", "Linting doesn't check behaviour."),
  ("Make sure the PR description is detailed.", "Useful, but not a check of behaviour."),
 ]),
],
sources=[
 'Michael Feathers (2004), <em>Working Effectively with Legacy Code</em>. Introduces characterisation tests; see also Martin Fowler\'s <a href="https://martinfowler.com/bliki/" target="_blank" rel="noopener">bliki</a> on refactoring.',
 'Google, <a href="https://google.github.io/eng-practices/review/" target="_blank" rel="noopener">Engineering Practices: Code Review</a>. What reviewers look for and how to keep changes small.',
],
)
