GW.lesson({
  id: "technical-writing",
  lede: "Documentation is where AI drafts look most finished and where errors cost the most: a wrong flag in the docs gets copied by every reader. And docs now have a second audience, the AI tools that read them to answer questions.",
  outcomes: [
    "Use AI to draft, restructure and edit docs, with the product itself as the source of truth.",
    "Catch invented options, wrong defaults and unsupported claims in a generated draft.",
    "Test docs by running every step, the way you would test code.",
    "Write pages that both people and retrieval systems can use well."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Fluency hides gaps.</strong> A polished draft gets less scrutiny than a rough one. Review the facts separately from the prose.</li>
<li><strong>Generic voice.</strong> Unedited drafts drift into filler (“seamlessly”, “robust”, “in today's world”). Your style guide is the fix.</li>
<li><strong>Screenshots that don't match.</strong> A generated description of the UI can describe a different version, or a different product.</li>
<li><strong>Unreleased features in public docs.</strong> If you paste internal specs into a draft, check that nothing unreleased reaches the published page.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick a how-to page and ask an assistant to rewrite it from the current help output or API definition. Then run every step of both versions in a clean environment. Note where each one breaks.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">A generated how-to uses a flag that isn't in the help output. What is the most likely explanation?</p><ul>
<li data-fb="Possible, but check the source before assuming the help output is wrong.">The help output is out of date.</li>
<li data-fb="Some do, but the generated text gives no evidence of that.">It's from a newer version.</li>
<li data-fb="Right. Plausible invented options are a typical error. Remove it unless the product confirms it.">The model invented a plausible flag.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What is the most reliable way to check a generated procedure?</p><ul>
<li data-fb="Right. Running the steps exactly as written catches what reading misses.">Run every step, as written, in a clean environment.</li>
<li data-fb="Reading catches style issues, not wrong defaults or missing steps.">Read it carefully twice.</li>
<li data-fb="A second model can share the same wrong assumptions.">Ask another model to review it.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">An old page describing a retired feature still ranks well. Why does that matter more now?</p><ul>
<li data-fb="That's true but minor.">It makes the site look untidy.</li>
<li data-fb="Right. Retrieval will find it and an assistant may present it as current.">AI assistants may retrieve and quote it as current.</li>
<li data-fb="Ranking doesn't change the product.">It changes how the feature works.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Google, <a href="https://developers.google.com/style" target="_blank" rel="noopener">Developer documentation style guide</a>. A widely used reference for clear technical writing.</li>
<li>Procida, <a href="https://diataxis.fr/" target="_blank" rel="noopener">Diátaxis</a>. Organising docs into tutorials, how-to guides, reference and explanation.</li>
<li>Write the Docs, <a href="https://www.writethedocs.org/guide/docs-as-code/" target="_blank" rel="noopener">Docs as Code</a>. Treating documentation with the same tools and review as code.</li>
</ol></section>
`
});
