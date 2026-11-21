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
  lede: "Writing docs is the visible part of the job. Keeping them true is the bigger part: the product changes every week, and pages drift. AI can help with style checks, spotting drift, release notes and translation. In each case it produces fluent text quickly, and in each case a writer has to own whether it's true.",
  outcomes: [
    "Combine rule-based style checks with AI review, and know which catches what.",
    "Use AI to find pages that may have drifted from the product, and confirm before changing them.",
    "Draft release notes from changes without announcing what didn't ship.",
    "Review AI translation with the right people and glossary."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Bulk rewrites.</strong> An assistant asked to “improve” 200 pages will change meaning somewhere. Review diffs, page by page.</li>
<li><strong>Style over substance.</strong> A perfectly styled page with the wrong default is worse than a clumsy correct one.</li>
<li><strong>Release notes from commit messages alone.</strong> Commits describe code, not customer impact.</li>
<li><strong>Unreviewed translations of warnings.</strong> Safety, security and legal text need a qualified reviewer.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take last month's merged pull requests that touched settings or the API. Ask an assistant which doc pages mention the changed items. Check three of its flags in the product, and fix any page that really has drifted.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">Which is better checked by a rule-based linter than by an AI reviewer?</p><ul>
<li data-fb="Right. Fixed rules are best checked the same way every time.">The product name is always spelled the same way.</li>
<li data-fb="That needs judgment; AI or a person is better.">Whether a paragraph is easy to follow.</li>
<li data-fb="That needs understanding of the task.">Whether a step is missing from a procedure.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">A pull request for a new feature was merged behind a flag that's off. Should it go in this release's notes?</p><ul>
<li data-fb="Customers can't use what's switched off.">Yes, because it was merged in this release.</li>
<li data-fb="A vague teaser still generates questions customers can't resolve.">Yes, as “coming soon”.</li>
<li data-fb="Right. Release notes describe what customers can use now.">No, not until it's switched on for customers.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Where should a reviewer focus first in an AI-translated help page?</p><ul>
<li data-fb="Fluency is usually fine; the risks are elsewhere.">Overall fluency and tone.</li>
<li data-fb="Right. These must match exactly or carry legal and safety weight.">UI labels, fixed product terms, and warnings.</li>
<li data-fb="Length isn't a quality measure.">Whether it's the same length as the original.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Vale, <a href="https://vale.sh/" target="_blank" rel="noopener">an open-source linter for prose</a>, which checks writing against your own style rules.</li>
<li>Olivier Lacan, <a href="https://keepachangelog.com/en/1.1.0/" target="_blank" rel="noopener">Keep a Changelog 1.1.0</a>. Changelogs are for humans, grouped by type of change.</li>
<li>Write the Docs, <a href="https://www.writethedocs.org/guide/docs-as-code/" target="_blank" rel="noopener">Docs as Code</a>.</li>
</ol></section>
`
});
