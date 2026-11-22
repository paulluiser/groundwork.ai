SPEC = dict(
file="10-2-engineering-agents.js",
reviewed="2026-11",
outcomes=["Write a task brief for a coding agent with scope, done criteria and limits."],
situation="""<p>You ask a coding agent to “add rate limiting to the public API”. Forty minutes later it reports success: 31 files changed, a new middleware, a Redis dependency, updated configuration in three environments, and every test green. It also, along the way, upgraded two unrelated packages and disabled a flaky test.</p>
<p>The agent did what agents do with an open-ended task: it kept going. This lesson is about briefing agents so the work stays the size you meant, and reviewing it so nothing slips through.</p>""",
warmup=dict(q="What's the best size for a task you give a coding agent?", a=1, opts=[
  ("A whole feature, so the agent can make consistent decisions.", "Big tasks produce big diffs that are hard to review."),
  ("One change you could review properly in a single sitting.", "Right. Small enough to check, big enough to save time."),
  ("A single line, so nothing can go wrong.", "Too small to be worth the overhead."),
  ("Whatever the agent suggests after reading the codebase.", "You decide the scope, not the agent."),
 ]),
sections="""<h2>Worked example: a task brief</h2>
<div class="worked">
<div class="wx"><b>Open-ended request</b><div><pre>Add rate limiting to the public API.</pre></div></div>
<div class="wx strong"><b>A task brief</b><div><pre>Goal: limit POST /v1/exports to 10
requests per minute per API key.

Scope: only the exports route. Use the
existing RateLimiter in lib/limits.ts.
No new dependencies.

Done when:
- 11th request in a minute gets 429
  with a Retry-After header
- tests in exports.test.ts cover the
  limit and the reset
- all existing tests still pass,
  unchanged

Don't: change other routes, upgrade
packages, edit or skip existing tests.
Stop and ask if the RateLimiter can't
do this.</pre></div></div>
</div>
<ul class="wx-notes">
<li><strong>Scope names one route and the existing helper,</strong> which rules out the Redis rewrite.</li>
<li><strong>“Done when” is checkable</strong> and includes a test the agent must write.</li>
<li><strong>“Don't” lists the usual ways agents overreach:</strong> other routes, upgrades, tests.</li>
<li><strong>“Stop and ask”</strong> gives it a way out other than improvising.</li>
</ul>
<h2>Reviewing what an agent did</h2>
<p>Review an agent's change like a pull request from a capable stranger. Start with the list of files changed: anything outside the stated scope needs a reason. Read the diff of test files first, looking for edited assertions, skipped tests or removed cases. Check any new or upgraded dependency exists and is the package you expect (lesson 8). Then read the implementation, and run it. Agent transcripts help explain decisions, but the diff is the record.</p>
<h2>Your turn: brief an agent</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Turn a vague request into a task brief</span></div><div class="activity-b">
<p>Rewrite this as a brief an agent can finish and you can review: <em>“Clean up the user settings page, it's a mess.”</em> Invent reasonable details about the codebase if you need to.</p>
<div data-w="task" data-key="eng-agent-brief">
<div class="task-model"><pre>Goal: split SettingsPage.tsx (900 lines)
into one component per section
(Profile, Notifications, Billing), with
no change in behaviour.

Scope: src/pages/settings/ only.

Done when:
- each section is its own component
- the page looks and behaves the same
  (existing Playwright test passes)
- no file is over 300 lines

Don't: change styles, rename props used
elsewhere, add dependencies, or edit
tests other than imports.
Stop and ask if a section shares state
in a way that makes splitting unclear.</pre></div>
<ul class="task-rubric">
<li>Replaces “clean up” with a specific, checkable goal</li>
<li>Limits the scope to named files or folders</li>
<li>Defines done in terms of tests or observable behaviour</li>
<li>Lists what the agent must not change</li>
<li>Tells the agent when to stop and ask</li>
</ul>
</div></div></div>""",
myths=[
 ("A green test run means the agent's work is done.", "Agents can make tests green by editing or skipping them. Read the test diff first."),
 ("Agents work best with a lot of freedom.", "Clear scope, done criteria and limits produce better, reviewable work."),
 ("Watching the agent work replaces reviewing the diff.", "Transcripts explain intent; the diff is what ships."),
 ("Agents don't need access rules if they run on my machine.", "They can read secrets, run commands and reach the network. Limit what they can touch."),
],
recap=[
 "Give agents tasks you could review in one sitting.",
 "A brief has a goal, a scope, done criteria, limits and a stop-and-ask rule.",
 "Review files changed, then tests, then dependencies, then the implementation.",
 "Treat edited or skipped tests as a red flag until explained.",
 "Keep agents away from secrets and untrusted content combined with network access.",
],
checks=[
 dict(q="An agent's change touches 31 files for a task scoped to one route. What should you do first?", a=2, opts=[
  ("Merge it if all tests pass, since the agent was thorough.", "Out-of-scope changes need a reason first."),
  ("Ask the agent to summarise what it did and accept that.", "A summary isn't the diff."),
  ("Check why each file outside the scope was changed.", "Right. Scope creep is where surprises hide."),
  ("Revert everything and do the task by hand.", "Possibly, but first see what's salvageable."),
 ]),
 dict(q="Which line in a brief most reduces the risk of an agent hiding a bug?", a=0, opts=[
  ("“Don't edit or skip existing tests.”", "Right. It protects the tests that check the work."),
  ("“Write clean, idiomatic code.”", "Style isn't the risk."),
  ("“Be careful and thorough.”", "Too vague to change behaviour."),
  ("“Use TypeScript for all new files.”", "Useful, but unrelated to hidden bugs."),
 ]),
 dict(q="What should you review first in an agent's pull request?", a=3, opts=[
  ("The agent's transcript of its reasoning.", "Helpful context, but not the record."),
  ("The new feature code in the main file.", "Important, but check scope and tests first."),
  ("The commit messages it wrote.", "Messages describe; they don't verify."),
  ("The list of files changed and the test changes.", "Right. Scope and tests tell you what to look harder at."),
 ]),
 dict(q="Why include “stop and ask if the existing helper can't do this”?", a=1, opts=[
  ("Agents can't work without explicit permission to ask.", "They can, but they rarely stop unprompted."),
  ("It gives the agent an alternative to improvising a bigger change.", "Right. Otherwise it may build something new."),
  ("It makes the agent run faster.", "Speed isn't the point."),
  ("It's required by most coding agent tools.", "It isn't a requirement."),
 ]),
 dict(q="An agent added a new package you haven't heard of. What's the check?", a=2, opts=[
  ("Trust it, since agents only use popular packages.", "Agents can invent or misname packages."),
  ("Ask the agent whether the package is safe.", "Its answer isn't verification."),
  ("Confirm it exists, is the one intended, and is maintained.", "Right. Hallucinated and look-alike packages are real risks."),
  ("Remove it automatically, since new packages aren't allowed.", "Possibly your policy, but check first."),
 ]),
],
)
