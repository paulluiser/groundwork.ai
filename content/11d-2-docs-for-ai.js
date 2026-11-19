GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["retrieval-ready"] = {
  buckets: ["Helps assistants answer correctly", "Makes wrong answers more likely"],
  items: [
    { t: "Each section starts by naming what it's about: “To rotate an API key in the admin console…” rather than “To do this…”.", a: 0, why: "Retrieval often returns a section on its own. If it names its subject, it still makes sense out of context." },
    { t: "The same setting is described on three pages, with slightly different defaults on each.", a: 1, why: "An assistant may retrieve any one of them. Keep one source of truth and link to it." },
    { t: "Version-specific pages say which version they cover, near the top.", a: 0, why: "Lets retrieval and the model prefer the right version, and lets people spot a mismatch." },
    { t: "Important limits are only shown in a screenshot of the settings page.", a: 1, why: "Text in images is often invisible to retrieval. Put the facts in text; keep the image as a supplement." },
    { t: "A tutorial, a reference table and a conceptual explanation are mixed together on one long page.", a: 1, why: "Mixed purposes make chunks muddled. Diátaxis separates them, which helps people and retrieval alike." },
    { t: "An llms.txt file lists the key pages, with a one-line note on what each covers and links to plain Markdown versions.", a: 0, why: "Gives AI tools a curated map of your docs, so they don't have to guess from navigation and HTML." },
    { t: "Deprecated pages stay published without a notice, because some customers still link to them.", a: 1, why: "Assistants can't tell old from current unless you say so. Mark them clearly, or redirect." },
    { t: "Error messages appear word for word in the troubleshooting page that fixes them.", a: 0, why: "People paste the exact error into an assistant. A match in your docs makes the right page easy to find." }
  ],
  after: "What helps retrieval mostly helps people too: one source of truth, sections that make sense alone, clear versions, facts in text, and one purpose per page."
};
GW.lesson({
  id: "docs-for-ai",
  lede: "Your documentation now has a second audience. Customers ask chat assistants, coding tools and your own support bot, and those systems answer from your pages. If the docs are hard for them to use, people get wrong answers attributed to your product. This lesson covers writing and structuring docs so that AI tools answer correctly, and checking that they do.",
  outcomes: [
    "Explain how retrieval splits and selects your docs, and why that changes how you write.",
    "Structure pages so each section makes sense on its own.",
    "Decide whether to publish an llms.txt file, and what to put in it.",
    "Measure whether assistants answer correctly from your docs, with a set of real questions."
  ],
  html: String.raw`
<h2>How assistants read your docs</h2>
<p>Most assistants that answer from documentation use <a class="term" data-t="rag">retrieval</a> (lesson 2). Your pages are split into chunks, each chunk is turned into an <a class="term" data-t="embedding">embedding</a>, and at question time the closest chunks are placed in the model's context. The model never sees your navigation, your page titles, or the paragraph before the chunk, unless the system adds them.</p>
<p>That loss of context is a known problem. Anthropic's write-up on contextual retrieval tested adding a short, generated description of where each chunk sits in its document before indexing. Combined with keyword search, it cut failed retrievals by 49%, and by 67% with <a class="term" data-t="reranking">reranking</a> added.<sup>[3]</sup> You can't control every assistant's pipeline, but you can write chunks that carry their own context.</p>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Finding pages that contradict each other</td><td><span class="fit good">Good fit</span></td><td>An assistant can compare many pages quickly. Confirm each contradiction against the product.</td></tr>
<tr><td>Rewriting sections to stand alone</td><td><span class="fit good">Good fit</span></td><td>Good at replacing “this” and “above” with the actual subject. Check the meaning didn't shift.</td></tr>
<tr><td>Drafting an llms.txt file</td><td><span class="fit good">Good fit</span></td><td>A summary of your key pages. You choose what's in it.</td></tr>
<tr><td>Generating questions to test the docs</td><td><span class="fit care">Use with care</span></td><td>Generated questions are tidier than real ones. Start from support tickets and search logs.</td></tr>
<tr><td>Deciding what's true about the product</td><td><span class="fit human">Keep human</span></td><td>The writer and the engineers own the facts. Assistants repeat what the pages say.</td></tr>
</tbody></table></div>

<h2>Write sections that stand alone</h2>
<p>Diátaxis, a widely used framework for documentation, separates four kinds of page: tutorials, how-to guides, reference and explanation.<sup>[2]</sup> It was designed for people, but it helps retrieval too, because a chunk from a page with one purpose is easier to match to a question with that purpose. Within each page:</p>
<ul>
<li><strong>Name the subject in each section's first sentence.</strong> “To rotate an API key in the admin console”, not “To do this”.</li>
<li><strong>Put facts in text.</strong> Limits, defaults and version numbers in screenshots or diagrams may not be indexed.</li>
<li><strong>Say which version or plan a page covers,</strong> near the top.</li>
<li><strong>Keep one source of truth.</strong> Repeated facts drift apart, and an assistant may retrieve the stale copy.</li>
<li><strong>Include exact error messages</strong> on the pages that fix them.</li>
</ul>

<h2>Practice: retrieval-ready or not?</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Sort the documentation choices</span></div><div class="activity-b">
<p>Decide whether each choice helps assistants answer correctly or makes a wrong answer more likely.</p>
<div data-w="sort" data-cfg="retrieval-ready"></div>
</div></div>

<ol class="steps">
<li><strong>Chunks travel alone</strong>Anything that only makes sense with the previous paragraph, the page title or the image will be lost.</li>
<li><strong>Duplicates and stale pages compete</strong>The assistant can't tell which copy is current. One source of truth, and clear deprecation notices.</li>
<li><strong>A curated map helps</strong>An llms.txt file points AI tools straight at the pages that matter.</li>
</ol>
<div class="key"><p>Writing for retrieval is mostly writing clearly for people who arrive in the middle of a page. That's most readers already.</p></div>

<h2>llms.txt</h2>
<p>llms.txt is a proposal, first published by Jeremy Howard in 2024, for a Markdown file at your site's root that gives AI tools a short, curated overview: a title, a one-paragraph summary, and lists of links to key pages with a note on each, ideally pointing to plain Markdown versions.<sup>[1]</sup> It's a convention, not a standard every tool follows, so treat it as cheap and helpful rather than essential. Keep it short, and review it when the docs' structure changes.</p>

<h2>Measure whether it works</h2>
<p>Build a small question set from real support tickets and search logs, each with the correct answer and the page it should come from. Ask several assistants, including your own support bot, and score the answers. Recheck after major docs changes. This is the docs version of an <a class="term" data-t="eval">eval</a> (lesson 18), and it turns “AI gets our docs wrong” into a list of pages to fix.</p>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Writing for bots instead of people.</strong> Keyword-stuffed pages read badly and don't retrieve better.</li>
<li><strong>Hiding content behind scripts.</strong> Pages that only render with JavaScript may be invisible to some crawlers.</li>
<li><strong>Assuming one assistant represents all.</strong> Different tools retrieve differently. Test a few.</li>
<li><strong>Fixing the answer, not the page.</strong> If an assistant gets it wrong, the cause is usually ambiguous or duplicated docs.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take the ten most common questions from support. Ask two assistants each question about your product and check the answers against the docs. For every wrong answer, find the page that misled it.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Why should each section name its subject in the first sentence?</p><ul>
<li data-fb="Style guides vary; the reason here is retrieval.">Because style guides require it.</li>
<li data-fb="Right. A retrieved chunk often arrives without its page title or previous paragraph.">Because retrieval often returns a section without its surrounding context.</li>
<li data-fb="Length isn't the point.">To make pages longer for search engines.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An assistant gives customers an outdated default value. What's the most likely docs cause?</p><ul>
<li data-fb="Possibly, but the docs usually contain the source of the error.">The assistant's training data is old.</li>
<li data-fb="Missing llms.txt wouldn't introduce wrong values.">You haven't published an llms.txt file.</li>
<li data-fb="Right. Repeated facts drift, and retrieval may pick the stale copy.">The value appears on more than one page, and one copy is stale.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What's the best source of questions for testing whether assistants answer correctly from your docs?</p><ul>
<li data-fb="Right. Real questions are messier, and closer to what customers ask.">Real support tickets and search logs.</li>
<li data-fb="Generated questions tend to match the docs' own wording.">Questions an assistant generates from the docs.</li>
<li data-fb="Writers know the docs too well to ask like customers.">Questions the writing team makes up.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Jeremy Howard (2024), <a href="https://llmstxt.org/" target="_blank" rel="noopener">The /llms.txt file</a>. The proposal and its format.</li>
<li>Daniele Procida, <a href="https://diataxis.fr/" target="_blank" rel="noopener">Diátaxis</a>. A framework for tutorials, how-to guides, reference and explanation.</li>
<li>Anthropic (2024), <a href="https://www.anthropic.com/news/contextual-retrieval" target="_blank" rel="noopener">Introducing Contextual Retrieval</a>. Adding context to chunks before indexing, with measured results.</li>
</ol></section>
`
});
