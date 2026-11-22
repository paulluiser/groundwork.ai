GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["release-notes"] = {
  label: "AI-drafted release notes for version 4.2",
  source: '<b>What you gave the assistant</b> The titles and descriptions of the 37 pull requests merged since version 4.1, and last release\'s notes as an example.<br><b>What you asked</b> “Draft customer-facing release notes for 4.2.”',
  claims: [
    { t: "Added: export reports as CSV from the Reports page.", v: "ok", why: "Matches a merged pull request and the feature is visible in staging. Check the menu label matches the product exactly." },
    { t: "Changed: the API now returns timestamps in UTC.", v: "partial", why: "True, but it's a breaking change for anyone parsing local times. It belongs under a clear breaking-change notice, with what customers need to do." },
    { t: "Improved performance across the app, with pages loading up to 50% faster.", v: "none", why: "No pull request measured this. One PR mentions caching on one page. A specific number with no measurement behind it is a promise you can't keep." },
    { t: "Fixed: a bug where some invoices showed the wrong tax rate.", v: "ok", why: "Matches a merged fix. Consider whether affected customers need to be told directly, not just in release notes." },
    { t: "New: single sign-on with Okta.", v: "bad", why: "The pull request was merged behind a feature flag that's off for everyone. Announcing it now means support tickets from customers who can't find it." },
    { t: "Security: updated dependencies to address known vulnerabilities.", v: "judg", why: "Probably true, but vague. Decide with security what to say: which issues, and whether customers need to act." }
  ],
  after: "Pull requests say what was merged, not what shipped to customers, how big an improvement was, or what customers need to do. The writer checks each line against the product and the flags."
};
GW.lesson({
  id: "docs-maintenance",
  reviewed: "2026-11",
  lede: "Writing docs is the visible part of the job. Keeping them true is the bigger part: the product changes every week, and pages drift. AI can help with style checks, spotting drift, release notes and translation. In each case it produces fluent text quickly, and in each case a writer has to own whether it's true.",
  outcomes: [
    "Combine rule-based style checks with AI review, and know which catches what.",
    "Use AI to find pages that may have drifted from the product, and confirm before changing them.",
    "Draft release notes from changes without announcing what didn't ship.",
    "Review AI translation with the right people and glossary.",
    "Set up a drift check that flags pages likely to be out of date after each release."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your docs have 600 pages. Each release changes a dozen things, and nobody knows which pages mention them. Six months later, the most visited page still shows the old settings screen, and support quietly sends customers a corrected screenshot.</p>
<p>AI can read every page after every release faster than any team. It can also produce confident lists of “outdated” pages that aren't. This lesson is about using it to find drift, and checking what it finds before anything is rewritten.</p></div>
<div class="check warmup" data-a="0"><p class="q">After a release renames a setting, what's the fastest reliable way to find affected pages?</p><ul>
<li data-fb="Right. A plain search is exact; review confirms context.">Search the docs for the old name, then review each hit.</li>
<li data-fb="It may miss pages or flag unaffected ones.">Ask an assistant which pages are probably affected by the renamed setting.</li>
<li data-fb="Slow, and costly in support time.">Wait for customers to report confusing pages.</li>
<li data-fb="Far more work than needed, with new risks.">Rewrite all pages that mention settings.</li>
</ul></div>
<h2>Where AI helps keep docs current</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Style and terminology checks</td><td><span class="fit good">Good fit</span></td><td>Pair a rule-based linter for fixed rules with AI for judgment calls like clarity.</td></tr>
<tr><td>Flagging pages that may have drifted</td><td><span class="fit good">Good fit</span></td><td>Compare code changes with the pages that mention them. Confirm every flag in the product.</td></tr>
<tr><td>Drafting release notes from merged changes</td><td><span class="fit care">Use with care</span></td><td>Fast first draft. Merged isn't shipped, and impact claims need evidence.</td></tr>
<tr><td>Translating docs</td><td><span class="fit care">Use with care</span></td><td>Good quality for many languages. Terms, UI labels and legal text need a reviewer who knows the language.</td></tr>
<tr><td>Deciding what customers need to know</td><td><span class="fit human">Keep human</span></td><td>Breaking changes, security notices and deprecations need a person who understands the impact.</td></tr>
</tbody></table></div>

<h2>Style checks: rules and judgment</h2>
<p>Some style rules are mechanical: product names spelled correctly, banned words, sentence case in headings. A rule-based linter such as Vale checks these the same way every time, in your editor and in CI, like a code linter.<sup>[1]</sup> An AI reviewer is better at things rules can't express: a paragraph that's hard to follow, a missing step, an example that doesn't match the text. It's also less consistent. Use both, with the linter as the gate and AI as an extra reader.</p>
<p>Keeping docs in version control alongside the code (<a class="term" data-t="docs-as-code">docs as code</a>) makes all of this easier: style checks run on every pull request, and doc changes can be reviewed with the code they describe.<sup>[3]</sup></p>

<h2>Catching drift</h2>
<p>Docs drift when the product changes and the pages don't. An assistant can help find candidates: give it a pull request that changes a setting, a flag or an API field, and ask which pages mention it. Or give it a page and the current API schema, and ask where they disagree. Then check each flag in the product itself. Assistants also flag false drift, especially when the docs are right and the code is confusing.</p>

<h2>Worked example: release notes for 4.2</h2>
<p>You gave an assistant the 37 pull requests merged since the last release and asked for customer-facing notes. The draft is well organised and reads like your previous notes.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the release notes before publishing</span></div><div class="activity-b">
<p>Flag every line you wouldn't publish as written.</p>
<div data-w="claims" data-cfg="release-notes"></div>
</div></div>

<ol class="steps">
<li><strong>Merged isn't shipped</strong>Feature flags, staged rollouts and plan restrictions all sit between a pull request and a customer. Check each feature in the product as a customer would see it.</li>
<li><strong>Impact numbers need measurements</strong>“Up to 50% faster” came from nowhere. Say what changed, or get the measurement.</li>
<li><strong>Breaking changes need their own notice</strong>Keep a Changelog recommends grouping changes by type and writing for people, not machines.<sup>[2]</sup> A breaking change hidden under “Changed” fails the people who most need to know.</li>
</ol>
<div class="key"><p>Release notes are promises to customers. AI can turn pull requests into prose; a writer confirms each promise against the product people will actually use.</p></div>

<h2>Translation</h2>
<p>Machine translation is good enough to be the first draft in many languages. The problems concentrate in predictable places: UI labels that must match the translated product exactly, product terms that should never be translated, legal and security wording, and examples that only make sense in one culture. Give the tool a glossary of fixed terms, and have a reviewer who knows the language check those places first.</p>

<h2>Drift checks: search first, AI second</h2>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Bulk rewrites.</strong> An assistant asked to “improve” 200 pages will change meaning somewhere. Review diffs, page by page.</li>
<li><strong>Style over substance.</strong> A perfectly styled page with the wrong default is worse than a clumsy correct one.</li>
<li><strong>Release notes from commit messages alone.</strong> Commits describe code, not customer impact.</li>
<li><strong>Unreviewed translations of warnings.</strong> Safety, security and legal text need a qualified reviewer.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take last month's merged pull requests that touched settings or the API. Ask an assistant which doc pages mention the changed items. Check three of its flags in the product, and fix any page that really has drifted.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI can keep docs up to date automatically.</dt><dd>It can flag likely drift. Rewriting without checking introduces new errors.</dd>
<dt>A clean prose linter run means the docs are correct.</dt><dd>Linters check style and terms, not whether the product still behaves as described.</dd>
<dt>Release notes are just a list of tickets.</dt><dd>Changelogs are for humans: grouped by type, written for the reader's impact.[2]</dd>
<dt>Machine translation is ready to publish.</dt><dd>Quality varies by language and domain. Have a fluent reviewer check key pages and UI terms.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Start every drift check from an explicit list of what changed.</li>
<li>Use exact search for renames; use AI for changes described in other words.</li>
<li>Ask AI to quote the outdated sentence and the conflicting change.</li>
<li>Confirm before rewriting; reject false alarms.</li>
<li>Automate term checks and example tests so drift doesn't return.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">A setting was renamed. Which tool finds every page that mentions the old name?</p><ul>
<li data-fb="May miss pages or invent some.">An AI assistant asked to list every affected page in the documentation.</li>
<li data-fb="Right. Exact changes need exact search.">A plain search for the old name across the docs.</li>
<li data-fb="Shows popularity, not mentions.">The analytics report of most visited pages.</li>
<li data-fb="It doesn't know the old name until you add it.">A prose linter with default settings.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">What makes an AI drift report quick to check?</p><ul>
<li data-fb="Scores don't show what to check.">A confidence score for each page it flags.</li>
<li data-fb="Explanations don't speed up checking.">A long explanation of how it reviewed the pages and why it chose each one.</li>
<li data-fb="Titles alone don't say what's wrong.">A list of page titles ordered by importance.</li>
<li data-fb="Right. You can confirm or reject it in seconds.">The quoted sentence and the change it conflicts with.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">How do you stop a removed term from creeping back into the docs?</p><ul>
<li data-fb="Right. Automation enforces it.">Add it to the prose linter's rules so it fails checks.</li>
<li data-fb="People forget; linters don't.">Mention it in the next team meeting.</li>
<li data-fb="Manual and easy to skip.">Ask writers to search the whole site for it before making each edit.</li>
<li data-fb="Not reliable on its own.">Rely on AI to notice it in future reviews.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An AI drift check flags a correct sentence about pagination. What should you do?</p><ul>
<li data-fb="Rewriting correct text adds risk.">Rewrite it anyway to be safe.</li>
<li data-fb="It's correct and useful.">Remove the sentence from the page.</li>
<li data-fb="Right. Check, then keep it.">Confirm it's unchanged and mark it as a false alarm.</li>
<li data-fb="The product is the source of truth.">Ask a second AI tool to break the tie between the two opinions.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What does Keep a Changelog recommend about changelogs?</p><ul>
<li data-fb="It argues against dumping commit logs.">They should be generated directly from commit messages.</li>
<li data-fb="Right. Added, changed, fixed and so on.">They're for humans, grouped by type of change.</li>
<li data-fb="All notable changes belong there.">They should only list breaking changes.</li>
<li data-fb="They're for users.">They should be kept private to the engineering team.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Vale, <a href="https://vale.sh/" target="_blank" rel="noopener">an open-source linter for prose</a>, which checks writing against your own style rules.</li>
<li>Olivier Lacan, <a href="https://keepachangelog.com/en/1.1.0/" target="_blank" rel="noopener">Keep a Changelog 1.1.0</a>. Changelogs are for humans, grouped by type of change.</li>
<li>Write the Docs, <a href="https://www.writethedocs.org/guide/docs-as-code/" target="_blank" rel="noopener">Docs as Code</a>.</li>
</ol></section>
`
});
