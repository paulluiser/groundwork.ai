GW.lesson({
  id: "technical-writing",
  reviewed: "2026-11",
  lede: "Documentation is where AI drafts look most finished and where errors cost the most: a wrong flag in the docs gets copied by every reader. And docs now have a second audience, the AI tools that read them to answer questions.",
  outcomes: [
    "Use AI to draft, restructure and edit docs, with the product itself as the source of truth.",
    "Catch invented options, wrong defaults and unsupported claims in a generated draft.",
    "Test docs by running every step, the way you would test code.",
    "Write pages that both people and retrieval systems can use well.",
    "Verify every command, flag and value in an AI-drafted page against the source before publishing."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>An engineer asks you to document the new <code>export</code> command by Friday. An assistant drafts a complete page from the pull request description: usage, five flags, three examples and a troubleshooting section. It reads like it was written by someone who uses the tool every day.</p>
<p>Two of the flags were renamed during review, one example uses a format the command doesn't support, and the troubleshooting tips describe errors from a different tool. Every reader who copies them will hit the same wall. This lesson is about keeping documentation as accurate as the code it describes.</p></div>
<div class="check warmup" data-a="1"><p class="q">An AI-drafted doc page lists five command flags. What's the most reliable check?</p><ul>
<li data-fb="A skim misses renamed or invented flags.">Ask the engineer whether the page looks right to them.</li>
<li data-fb="Right. The tool itself is the source of truth.">Run each flag and example against the current build.</li>
<li data-fb="The PR may be out of date by merge time.">Compare the page with the pull request description.</li>
<li data-fb="Style doesn't verify accuracy.">Check that the formatting matches the style guide.</li>
</ul></div>
<h2>Where AI meets documentation</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Editing for clarity, consistency and style</td><td><span class="fit good">Good fit</span></td><td>Give it your style guide.<sup>[1]</sup> Check it hasn't changed meaning.</td></tr>
<tr><td>Restructuring pages by purpose</td><td><span class="fit good">Good fit</span></td><td>Splitting tutorials, how-tos, reference and explanation is a good use.<sup>[2]</sup></td></tr>
<tr><td>First drafts from PRs, specs and release notes</td><td><span class="fit care">Use with care</span></td><td>Fills gaps with guesses. Check every command, flag and default against the product.</td></tr>
<tr><td>Code samples</td><td><span class="fit care">Use with care</span></td><td>Run each one. Samples that don't run are the most common doc bug.</td></tr>
<tr><td>Translation and localisation</td><td><span class="fit care">Use with care</span></td><td>Good drafts. Keep glossary terms fixed, and have a fluent reviewer for important pages.</td></tr>
<tr><td>API reference</td><td><span class="fit care">Use with care</span></td><td>Generate it from the API definition, not from a model's memory of the API.</td></tr>
<tr><td>Deciding what is supported, and legal or compliance claims</td><td><span class="fit human">Keep human</span></td><td>These are product and legal commitments.</td></tr>
</tbody></table></div>

<h2>Worked example: documenting a new command</h2>
<p>A writer gives an assistant the pull request description and the command's help output, and asks for a how-to page. The draft is clear and well structured. Here are the sources it had, and the claims it made.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the draft against the source</span></div><div class="activity-b">
<p>Flag every statement in the draft that the sources don't support, or that they contradict.</p>
<div data-w="claims" data-cfg="docs-rotate"></div>
</div></div>

<p>Each error has a familiar cause:</p>
<ol class="steps">
<li><strong>A default was guessed</strong>The PR says the old key keeps working for 24 hours. The draft says it stops at once, a common pattern in other tools. A reader following it would think they had to update every system before rotating.</li>
<li><strong>An option was invented</strong><code>--expire-old</code> looks like a real flag and appears nowhere in the help output. Invented flags are the documentation version of a hallucinated API.</li>
<li><strong>A permission was dropped</strong>The PR says Admin only. The draft says anyone can rotate. Permission errors in docs lead to support tickets at best and to security assumptions at worst.</li>
<li><strong>A compliance claim was added</strong>Nothing in the sources mentions SOC 2. Claims like this become commitments once published.</li>
</ol>
<div class="key"><p>Docs are tested like code: run every command, in a clean environment, exactly as written. A step you didn't run is a step you haven't checked.</p></div>

<h2>Docs as code, and docs as tests</h2>
<p>Teams that keep docs in the same repository as the code, reviewed in pull requests, are well placed to use AI safely: the draft gets reviewed like any other change, and samples can run in CI.<sup>[3]</sup> This is <a class="term" data-t="docs-as-code">docs as code</a>. A few practices make AI drafts much safer:</p>
<ul>
<li><strong>Give it the real sources.</strong> Help output, the API definition, the PR, the tests. Missing sources are where invented details come from (lesson 2).</li>
<li><strong>Ask it to cite.</strong> “For each step, quote the line in the sources that supports it.” Unsupported steps become easy to see.</li>
<li><strong>Generate reference from definitions.</strong> Build API and CLI reference from the OpenAPI file or the help text, then edit the prose around it.</li>
<li><strong>Run the samples automatically.</strong> Samples that run in CI cannot silently drift.</li>
</ul>

<h2>Writing for the second reader</h2>
<p>Support assistants, coding tools and internal search increasingly read your docs, through retrieval (lesson 2), and answer questions from them. They use pages in pieces, so writing that helps them also helps people who arrive from search:</p>
<ul>
<li><strong>Make sections stand alone.</strong> “Rotate an API key” is a better heading than “Next steps”. Name the product and the version near the top of the page.</li>
<li><strong>Mark old pages clearly.</strong> A superseded page that still ranks will be retrieved and quoted. Redirect it or label it at the top.</li>
<li><strong>Put the answer before the caveat.</strong> A chunk that starts with three exceptions is easy to misquote.</li>
<li><strong>Use the same name for the same thing.</strong> If the UI says “workspace”, don't also say “project” and “team”.</li>
</ul>

<h2>Verify against the source, not the draft</h2>
<p>For reference documentation, the source of truth is the thing itself: the command's <code>--help</code> output, the code, the API schema, or a test run. Draft from the source where possible (paste the help text, not the PR description), then verify every command, flag, default value and example by running it. Style guides like Google's and Microsoft's help with clarity and consistency;[1][4] they can't tell you whether a flag exists.</p>
<h2>Worked example: verifying a drafted page</h2>
<div class="tbl"><table><thead><tr><th>Drafted line</th><th>Check</th><th>Result</th></tr></thead><tbody>
<tr><td><code>--format csv|json|xlsx</code></td><td>Run <code>export --help</code></td><td>xlsx isn't supported: remove it</td></tr>
<tr><td><code>--out-dir</code> sets the folder</td><td>Run it</td><td>Renamed to <code>--output</code> in review: fix everywhere</td></tr>
<tr><td>“Defaults to the current month”</td><td>Read the code</td><td>Defaults to the last 30 days: fix</td></tr>
<tr><td>Example: export last quarter as JSON</td><td>Copy and run it</td><td>Works</td></tr>
<tr><td>Troubleshooting: “Error 403: token expired”</td><td>Search the codebase for the message</td><td>Doesn't exist: replace with the real errors</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Four of five lines needed changes</strong>, and the page read perfectly before checking.</li>
<li><strong>Copy-paste examples are the highest-stakes lines.</strong> Readers run them without reading the prose.</li>
<li><strong>Automate what you can:</strong> doc tests that run every example in CI keep pages honest after release (docs as code).[3]</li>
</ul>
<h2>Your turn: plan the verification</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">How would you check this page?</span></div><div class="activity-b">
<p>An assistant drafted a “Getting started with the API” page: authentication with an API key, a first request with curl, rate limits, and pagination. Write a verification plan: what you'd check, against what source, and what you'd automate.</p>
<div data-w="task" data-key="writing-verify">
<div class="task-model"><ul>
<li><strong>Authentication:</strong> create a test key and follow the steps exactly as written; check header names against the API schema.</li>
<li><strong>First request:</strong> run the curl command as copied; check the response matches the documented example.</li>
<li><strong>Rate limits:</strong> confirm numbers with the platform team or the gateway configuration, not the draft.</li>
<li><strong>Pagination:</strong> check parameter names and default page size against the schema; request two pages.</li>
<li><strong>Automate:</strong> run the curl examples in CI against a sandbox so the page fails the build when the API changes.</li>
</ul></div>
<ul class="task-rubric">
<li>Checks each section against a named source of truth</li>
<li>Runs copy-paste examples exactly as written</li>
<li>Confirms numbers like limits with the owning team or configuration</li>
<li>Proposes automating example checks</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Fluency hides gaps.</strong> A polished draft gets less scrutiny than a rough one. Review the facts separately from the prose.</li>
<li><strong>Generic voice.</strong> Unedited drafts drift into filler (“seamlessly”, “robust”, “in today's world”). Your style guide is the fix.</li>
<li><strong>Screenshots that don't match.</strong> A generated description of the UI can describe a different version, or a different product.</li>
<li><strong>Unreleased features in public docs.</strong> If you paste internal specs into a draft, check that nothing unreleased reaches the published page.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick a how-to page and ask an assistant to rewrite it from the current help output or API definition. Then run every step of both versions in a clean environment. Note where each one breaks.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A fluent AI draft is a good first draft.</dt><dd>Fluency is cheap. For reference docs, a draft from the source (help text, schema) beats a fluent one from a description.</dd>
<dt>If the engineer reviewed it, it's accurate.</dt><dd>Reviewers skim prose. Running the examples finds what reading misses.</dd>
<dt>Docs only need checking at release.</dt><dd>Products change weekly. Tests that run examples keep pages honest.</dd>
<dt>Writing for AI readers means writing for robots.</dt><dd>The same clarity helps both: self-contained sections, explicit names, complete examples.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Draft reference docs from the source: help text, code, schema.</li>
<li>Verify every command, flag, default and example by running it.</li>
<li>Copy-paste examples are the highest-stakes lines on the page.</li>
<li>Automate example checks so docs fail the build when the product changes.</li>
<li>Style guides help clarity; only the source confirms accuracy.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">What's the best source for drafting a command reference page?</p><ul>
<li data-fb="Often outdated by the time the PR merges.">The pull request description that introduced the command.</li>
<li data-fb="Different tool, different flags.">A similar page from a competitor's documentation.</li>
<li data-fb="Right. Draft from the source of truth.">The command's current help output and the code.</li>
<li data-fb="Memory drifts; the build doesn't.">The engineer's memory of how the command works.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which lines in a doc page most need running before publishing?</p><ul>
<li data-fb="Right. Errors there are copied by every reader.">Copy-paste examples that readers will run as is.</li>
<li data-fb="Lower risk than examples.">The introduction explaining what the command is for.</li>
<li data-fb="Worth checking, but less critical.">Links to related pages at the bottom.</li>
<li data-fb="Structure doesn't break anyone's work.">Headings and the order of sections.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Troubleshooting tips mention an error message you can't find in the codebase. What should you do?</p><ul>
<li data-fb="If the code can't produce it, users can't see it.">Keep it, since users might still see it in some rare edge case we haven't tested.</li>
<li data-fb="Clear but false is still false.">Rewrite it in clearer language.</li>
<li data-fb="It may invent a source.">Ask the assistant where the error comes from.</li>
<li data-fb="Right. Search the code for real messages.">Replace it with the errors the command actually produces.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">How do docs as code help keep pages accurate?</p><ul>
<li data-fb="It's about process, not who writes.">Docs are written by engineers instead of writers.</li>
<li data-fb="Right. Docs get the same checks as code.">Examples can run as tests in CI, failing when the product changes.</li>
<li data-fb="Not what docs as code means.">AI can edit and republish the docs automatically after every single release.</li>
<li data-fb="Docs as code uses plain text in version control.">Pages are stored as PDFs alongside the code.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What can a style guide not tell you about an AI-drafted page?</p><ul>
<li data-fb="Right. Only the source can confirm that.">Whether the flags and examples are correct.</li>
<li data-fb="That's what style guides help with.">Whether sentences are clear and concise.</li>
<li data-fb="Style guides cover this.">Whether headings follow a consistent pattern.</li>
<li data-fb="Style guides and linters cover this.">Whether terminology is consistent.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Google, <a href="https://developers.google.com/style" target="_blank" rel="noopener">Developer documentation style guide</a>. A widely used reference for clear technical writing.</li>
<li>Procida, <a href="https://diataxis.fr/" target="_blank" rel="noopener">Diátaxis</a>. Organising docs into tutorials, how-to guides, reference and explanation.</li>
<li>Write the Docs, <a href="https://www.writethedocs.org/guide/docs-as-code/" target="_blank" rel="noopener">Docs as Code</a>. Treating documentation with the same tools and review as code.</li>

<li>Microsoft, <a href="https://learn.microsoft.com/en-us/style-guide/welcome/" target="_blank" rel="noopener">Microsoft Writing Style Guide</a>. Guidance on clear, consistent technical writing.</li>
</ol></section>
`
});
