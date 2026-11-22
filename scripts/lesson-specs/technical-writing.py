SPEC = dict(
file="11d-technical-writing.js",
reviewed="2026-11",
outcomes=["Verify every command, flag and value in an AI-drafted page against the source before publishing."],
situation="""<p>An engineer asks you to document the new <code>export</code> command by Friday. An assistant drafts a complete page from the pull request description: usage, five flags, three examples and a troubleshooting section. It reads like it was written by someone who uses the tool every day.</p>
<p>Two of the flags were renamed during review, one example uses a format the command doesn't support, and the troubleshooting tips describe errors from a different tool. Every reader who copies them will hit the same wall. This lesson is about keeping documentation as accurate as the code it describes.</p>""",
warmup=dict(q="An AI-drafted doc page lists five command flags. What's the most reliable check?", a=1, opts=[
  ("Ask the engineer whether the page looks right to them.", "A skim misses renamed or invented flags."),
  ("Run each flag and example against the current build.", "Right. The tool itself is the source of truth."),
  ("Compare the page with the pull request description.", "The PR may be out of date by merge time."),
  ("Check that the formatting matches the style guide.", "Style doesn't verify accuracy."),
 ]),
sections="""<h2>Verify against the source, not the draft</h2>
<p>For reference documentation, the source of truth is the thing itself: the command's <code>--help</code> output, the code, the API schema, or a test run. Draft from the source where possible (paste the help text, not the PR description), then verify every command, flag, default value and example by running it. Style guides like Google's and Microsoft's help with clarity and consistency;[1][S1] they can't tell you whether a flag exists.</p>
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
</div></div></div>""",
myths=[
 ("A fluent AI draft is a good first draft.", "Fluency is cheap. For reference docs, a draft from the source (help text, schema) beats a fluent one from a description."),
 ("If the engineer reviewed it, it's accurate.", "Reviewers skim prose. Running the examples finds what reading misses."),
 ("Docs only need checking at release.", "Products change weekly. Tests that run examples keep pages honest."),
 ("Writing for AI readers means writing for robots.", "The same clarity helps both: self-contained sections, explicit names, complete examples."),
],
recap=[
 "Draft reference docs from the source: help text, code, schema.",
 "Verify every command, flag, default and example by running it.",
 "Copy-paste examples are the highest-stakes lines on the page.",
 "Automate example checks so docs fail the build when the product changes.",
 "Style guides help clarity; only the source confirms accuracy.",
],
checks=[
 dict(q="What's the best source for drafting a command reference page?", a=2, opts=[
  ("The pull request description that introduced the command.", "Often outdated by the time the PR merges."),
  ("A similar page from a competitor's documentation.", "Different tool, different flags."),
  ("The command's current help output and the code.", "Right. Draft from the source of truth."),
  ("The engineer's memory of how the command works.", "Memory drifts; the build doesn't."),
 ]),
 dict(q="Which lines in a doc page most need running before publishing?", a=0, opts=[
  ("Copy-paste examples that readers will run as is.", "Right. Errors there are copied by every reader."),
  ("The introduction explaining what the command is for.", "Lower risk than examples."),
  ("Links to related pages at the bottom.", "Worth checking, but less critical."),
  ("Headings and the order of sections.", "Structure doesn't break anyone's work."),
 ]),
 dict(q="Troubleshooting tips mention an error message you can't find in the codebase. What should you do?", a=3, opts=[
  ("Keep it, since users might see it in some edge case.", "If the code can't produce it, users can't see it."),
  ("Rewrite it in clearer language.", "Clear but false is still false."),
  ("Ask the assistant where the error comes from.", "It may invent a source."),
  ("Replace it with the errors the command actually produces.", "Right. Search the code for real messages."),
 ]),
 dict(q="How do docs as code help keep pages accurate?", a=1, opts=[
  ("Docs are written by engineers instead of writers.", "It's about process, not who writes."),
  ("Examples can run as tests in CI, failing when the product changes.", "Right. Docs get the same checks as code."),
  ("AI can edit docs automatically after every release.", "Not what docs as code means."),
  ("Pages are stored as PDFs alongside the code.", "Docs as code uses plain text in version control."),
 ]),
 dict(q="What can a style guide not tell you about an AI-drafted page?", a=0, opts=[
  ("Whether the flags and examples are correct.", "Right. Only the source can confirm that."),
  ("Whether sentences are clear and concise.", "That's what style guides help with."),
  ("Whether headings follow a consistent pattern.", "Style guides cover this."),
  ("Whether terminology is consistent.", "Style guides and linters cover this."),
 ]),
],
sources=[
 'Microsoft, <a href="https://learn.microsoft.com/en-us/style-guide/welcome/" target="_blank" rel="noopener">Microsoft Writing Style Guide</a>. Guidance on clear, consistent technical writing.',
],
)
