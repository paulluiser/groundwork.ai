SPEC = dict(
file="11d-3-docs-maintenance.js",
reviewed="2026-11",
outcomes=["Set up a drift check that flags pages likely to be out of date after each release."],
situation="""<p>Your docs have 600 pages. Each release changes a dozen things, and nobody knows which pages mention them. Six months later, the most visited page still shows the old settings screen, and support quietly sends customers a corrected screenshot.</p>
<p>AI can read every page after every release faster than any team. It can also produce confident lists of “outdated” pages that aren't. This lesson is about using it to find drift, and checking what it finds before anything is rewritten.</p>""",
warmup=dict(q="After a release renames a setting, what's the fastest reliable way to find affected pages?", a=0, opts=[
  ("Search the docs for the old name, then review each hit.", "Right. A plain search is exact; review confirms context."),
  ("Ask an assistant which pages are probably affected.", "It may miss pages or flag unaffected ones."),
  ("Wait for customers to report confusing pages.", "Slow, and costly in support time."),
  ("Rewrite all pages that mention settings.", "Far more work than needed, with new risks."),
 ]),
sections="""<h2>Drift checks: search first, AI second</h2>
<p>For exact changes (a renamed setting, a removed flag, a new default), plain search across the docs is precise and complete. AI helps with the fuzzy part: pages that describe a changed behaviour in other words, screenshots that show an old interface, examples that still work but are no longer recommended. Combine both: generate a list of what changed from the release notes and changelog,[2] search for exact terms, then ask an assistant to review the remaining candidate pages against the change list, quoting the sentence it thinks is outdated.</p>
<h2>Worked example: a drift report</h2>
<div class="tbl"><table><thead><tr><th>Page</th><th>AI flagged sentence</th><th>Check</th><th>Action</th></tr></thead><tbody>
<tr><td>Exports overview</td><td>“Exports are limited to 10,000 rows.”</td><td>Release 4.2 raised it to 50,000</td><td>Update</td></tr>
<tr><td>Scheduling reports</td><td>“Choose a weekday for delivery.”</td><td>Still true; daily was added, not replacing weekly</td><td>Add daily option</td></tr>
<tr><td>API pagination</td><td>“Use the <code>page</code> parameter.”</td><td>Unchanged in 4.2; AI confused it with exports</td><td>No change</td></tr>
<tr><td>Settings guide</td><td>(not flagged)</td><td>Search for old name “Workspace settings” found it</td><td>Update screenshot and text</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>AI found two real issues and one false alarm.</strong> Quoting the sentence made checking quick.</li>
<li><strong>Search found what AI missed.</strong> Exact renames are search's job.</li>
<li><strong>Vale and similar linters</strong> can enforce the new terms automatically from then on.[1]</li>
</ul>
<h2>Your turn: design a drift check</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">A release-day docs check</span></div><div class="activity-b">
<p>Design a checklist your team runs on every release to catch outdated docs. Include what's searched, what AI does, what a person checks, and what gets automated.</p>
<div data-w="task" data-key="docs-drift">
<div class="task-model"><ol>
<li><strong>Input:</strong> the release's changelog entries and any renamed terms from the PR labels.</li>
<li><strong>Search:</strong> grep the docs for every old name, flag and default; list each hit.</li>
<li><strong>AI review:</strong> give the assistant the change list and candidate pages; ask for outdated sentences, quoted, with the change they conflict with.</li>
<li><strong>Person:</strong> confirm each flagged sentence against the product; reject false alarms; update screenshots.</li>
<li><strong>Automate:</strong> add removed terms to the prose linter so they can't return; run doc examples in CI.</li>
</ol></div>
<ul class="task-rubric">
<li>Starts from an explicit list of what changed</li>
<li>Uses exact search for renames and removals</li>
<li>Asks AI to quote the sentence and the conflicting change</li>
<li>Has a person confirm before rewriting</li>
<li>Automates checks so the same drift can't recur</li>
</ul>
</div></div></div>""",
myths=[
 ("AI can keep docs up to date automatically.", "It can flag likely drift. Rewriting without checking introduces new errors."),
 ("A clean prose linter run means the docs are correct.", "Linters check style and terms, not whether the product still behaves as described."),
 ("Release notes are just a list of tickets.", "Changelogs are for humans: grouped by type, written for the reader's impact.[2]"),
 ("Machine translation is ready to publish.", "Quality varies by language and domain. Have a fluent reviewer check key pages and UI terms."),
],
recap=[
 "Start every drift check from an explicit list of what changed.",
 "Use exact search for renames; use AI for changes described in other words.",
 "Ask AI to quote the outdated sentence and the conflicting change.",
 "Confirm before rewriting; reject false alarms.",
 "Automate term checks and example tests so drift doesn't return.",
],
checks=[
 dict(q="A setting was renamed. Which tool finds every page that mentions the old name?", a=1, opts=[
  ("An AI assistant asked to list affected pages.", "May miss pages or invent some."),
  ("A plain search for the old name across the docs.", "Right. Exact changes need exact search."),
  ("The analytics report of most visited pages.", "Shows popularity, not mentions."),
  ("A prose linter with default settings.", "It doesn't know the old name until you add it."),
 ]),
 dict(q="What makes an AI drift report quick to check?", a=3, opts=[
  ("A confidence score for each page it flags.", "Scores don't show what to check."),
  ("A long explanation of how it reviewed the pages.", "Explanations don't speed up checking."),
  ("A list of page titles ordered by importance.", "Titles alone don't say what's wrong."),
  ("The quoted sentence and the change it conflicts with.", "Right. You can confirm or reject it in seconds."),
 ]),
 dict(q="How do you stop a removed term from creeping back into the docs?", a=0, opts=[
  ("Add it to the prose linter's rules so it fails checks.", "Right. Automation enforces it."),
  ("Mention it in the next team meeting.", "People forget; linters don't."),
  ("Ask writers to search before each edit.", "Manual and easy to skip."),
  ("Rely on AI to notice it in future reviews.", "Not reliable on its own."),
 ]),
 dict(q="An AI drift check flags a correct sentence about pagination. What should you do?", a=2, opts=[
  ("Rewrite it anyway to be safe.", "Rewriting correct text adds risk."),
  ("Remove the sentence from the page.", "It's correct and useful."),
  ("Confirm it's unchanged and mark it as a false alarm.", "Right. Check, then keep it."),
  ("Ask a second AI tool for a tie-break.", "The product is the source of truth."),
 ]),
 dict(q="What does Keep a Changelog recommend about changelogs?", a=1, opts=[
  ("They should be generated directly from commit messages.", "It argues against dumping commit logs."),
  ("They're for humans, grouped by type of change.", "Right. Added, changed, fixed and so on."),
  ("They should only list breaking changes.", "All notable changes belong there."),
  ("They should be kept private to the engineering team.", "They're for users."),
 ]),
],
)
