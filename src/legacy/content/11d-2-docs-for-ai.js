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
  reviewed: "2026-11",
  lede: "Your documentation now has a second audience. Customers ask chat assistants, coding tools and your own support bot, and those systems answer from your pages. If the docs are hard for them to use, people get wrong answers attributed to your product. This lesson covers writing and structuring docs so that AI tools answer correctly, and checking that they do.",
  outcomes: [
    "Explain how retrieval splits and selects your docs, and why that changes how you write.",
    "Structure pages so each section makes sense on its own.",
    "Decide whether to publish an llms.txt file, and what to put in it.",
    "Measure whether assistants answer correctly from your docs, with a set of real questions.",
    "Rewrite a documentation section so it stands alone when retrieved by an AI tool."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>A customer asks your support bot how to rotate an API key. The bot answers confidently with steps from a page about a different product tier, because the relevant section of your docs starts with “As described above, do the following” and never names the product, the tier or the setting.</p>
<p>Nobody on the docs team wrote anything wrong. They wrote for a reader who scrolls. Retrieval systems don't scroll; they pick up one chunk and answer from it. This lesson is about writing sections that survive being read alone.</p></div>
<div class="check warmup" data-a="3"><p class="q">Which section opening works best when an AI tool retrieves just that section?</p><ul>
<li data-fb="“Above” doesn't exist for a retrieved chunk.">“As described above, do the following.”</li>
<li data-fb="“It” and “next” depend on earlier text.">“Next, configure it as shown in the screenshot and the steps that came before this section.”</li>
<li data-fb="Before what? The context is lost.">“This works the same as before.”</li>
<li data-fb="Right. It names the task, the tier and the place.">“To rotate an API key on the Business plan, open Settings › Keys.”</li>
</ul></div>
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

<h2>Write sections that carry their own context</h2>
<p>Retrieval systems split pages into chunks and fetch the few that best match a question. A chunk that depends on its page loses meaning: pronouns, “above”, an unnamed product. The fix is to give each section the context a newcomer would need: name the product, version, plan and task in the heading or first sentence; repeat key nouns instead of “it”; keep prerequisites in the section that needs them. Structured reference, like an OpenAPI schema for APIs, gives AI tools exact names and types they don't have to guess.[4]</p>
<h2>Worked example: a retrieval-ready section</h2>
<div class="worked">
<div class="wx"><b>Written for scrolling</b><div><p><strong>Rotating</strong></p><p>As described above, you'll need admin rights. Click it, then choose Rotate. The old one stops working after the period you set.</p></div></div>
<div class="wx strong"><b>Written to stand alone</b><div><p><strong>Rotate an API key (Business and Enterprise plans)</strong></p><p>Only workspace admins can rotate API keys. Open <em>Settings › API keys</em>, select the key, and choose <em>Rotate</em>. The old key keeps working for the grace period you set (default 24 hours), then stops. Update the key in every system that uses it before the grace period ends.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>The heading names the task and the plans</strong>, so the chunk matches the question and the right tier.</li>
<li><strong>“It” and “the old one” became “API key”.</strong> Repeated nouns survive chunking.</li>
<li><strong>The prerequisite (admin rights) moved into the section</strong> instead of living “above”.</li>
<li><strong>The default is stated</strong>, so the assistant doesn't fill one in.</li>
</ul>
<h2>Your turn: make a section stand alone</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Rewrite for retrieval</span></div><div class="activity-b">
<p>Rewrite this section so it works when retrieved on its own: <em>“Limits: As mentioned, these differ by plan. The higher one allows 10x more. Exceeding them returns the usual error; wait and try again.”</em> Invent sensible details.</p>
<div data-w="task" data-key="docs-standalone">
<div class="task-model"><p><strong>API rate limits by plan</strong></p><p>The Kern API limits how many requests each API key can make per minute: Starter, 60 requests per minute; Business, 600 requests per minute. When a key exceeds its limit, the API returns HTTP 429 Too Many Requests with a <code>Retry-After</code> header giving the number of seconds to wait. Wait that long before retrying, and use exponential backoff for repeated 429s.</p></div>
<ul class="task-rubric">
<li>Heading names the topic specifically</li>
<li>States the actual limits for each plan</li>
<li>Names the exact error code and header instead of “the usual error”</li>
<li>Gives the recommended action in concrete terms</li>
<li>Contains no references to “above”, “as mentioned” or unexplained pronouns</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Writing for bots instead of people.</strong> Keyword-stuffed pages read badly and don't retrieve better.</li>
<li><strong>Hiding content behind scripts.</strong> Pages that only render with JavaScript may be invisible to some crawlers.</li>
<li><strong>Assuming one assistant represents all.</strong> Different tools retrieve differently. Test a few.</li>
<li><strong>Fixing the answer, not the page.</strong> If an assistant gets it wrong, the cause is usually ambiguous or duplicated docs.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take the ten most common questions from support. Ask two assistants each question about your product and check the answers against the docs. For every wrong answer, find the page that misled it.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Writing for AI means stuffing pages with keywords.</dt><dd>It means clear, self-contained sections with exact names. Keyword stuffing makes retrieval worse.</dd>
<dt>If the bot answered wrongly, the model is the problem.</dt><dd>Often the retrieved chunk lacked the context to answer correctly. Fix the section.</dd>
<dt>llms.txt makes docs AI-ready on its own.</dt><dd>It points tools to the right pages. The pages still need to be clear and self-contained.[1]</dd>
<dt>Repetition is bad writing.</dt><dd>Repeating the key noun instead of “it” is clearer for every reader, human or machine.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Retrieval reads one chunk at a time; write sections that stand alone.</li>
<li>Name the product, plan, version and task in the heading or first line.</li>
<li>Replace pronouns and “above” with the actual nouns and prerequisites.</li>
<li>State defaults, limits and error codes explicitly.</li>
<li>Structured references like OpenAPI give tools exact names to use.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">Why does “As described above” cause problems for AI tools?</p><ul>
<li data-fb="They read it; it just points nowhere.">AI tools can't read the word “above”.</li>
<li data-fb="Length isn't the problem.">It makes sections too short to be indexed.</li>
<li data-fb="Right. The referenced text isn't in the chunk.">A retrieved chunk has no “above”, so the context is lost.</li>
<li data-fb="Possibly, but that isn't why it breaks retrieval.">It's against most documentation style guides, which ban references to other sections.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What should a retrieval-ready heading include?</p><ul>
<li data-fb="Right. It matches questions and the right context.">The task and the product, plan or version it applies to.</li>
<li data-fb="Too little context for retrieval.">A single word, so it's easy to scan.</li>
<li data-fb="Can help, but must still name the task and scope.">A question, so it matches the way users phrase what they ask.</li>
<li data-fb="Useful metadata, but not what matches questions.">The date the section was last updated.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Your support bot gave steps for the wrong plan. What's the first thing to check?</p><ul>
<li data-fb="The model may be answering faithfully from a vague chunk.">Whether a newer, more capable model would answer the same question correctly.</li>
<li data-fb="Unlikely to be the cause.">Whether the bot's temperature is set too high.</li>
<li data-fb="The question was clear.">Whether users are asking unclear questions.</li>
<li data-fb="Right. Missing scope in the chunk is a common cause.">Whether the retrieved section says which plan it covers.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What does an llms.txt file do?</p><ul>
<li data-fb="That's closer to robots.txt rules.">It blocks AI tools from reading your documentation.</li>
<li data-fb="Right. A map, not a fix for unclear pages.">It points AI tools to your most useful pages in a simple format.</li>
<li data-fb="It doesn't change your pages.">It automatically rewrites every page into a format that AI readers prefer.</li>
<li data-fb="It doesn't train anything.">It trains models on your documentation.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which sentence survives chunking best?</p><ul>
<li data-fb="Right. Every noun is explicit.">“The old API key keeps working for 24 hours after rotation.”</li>
<li data-fb="“The old one” and “a while” lose meaning.">“The old one keeps working for a while after you rotate it, as noted.”</li>
<li data-fb="Depends on context that won't be retrieved.">“It still works temporarily, as noted.”</li>
<li data-fb="Points to text that isn't there.">“See the previous section for details.”</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Jeremy Howard (2024), <a href="https://llmstxt.org/" target="_blank" rel="noopener">The /llms.txt file</a>. The proposal and its format.</li>
<li>Daniele Procida, <a href="https://diataxis.fr/" target="_blank" rel="noopener">Diátaxis</a>. A framework for tutorials, how-to guides, reference and explanation.</li>
<li>Anthropic (2024), <a href="https://www.anthropic.com/news/contextual-retrieval" target="_blank" rel="noopener">Introducing Contextual Retrieval</a>. Adding context to chunks before indexing, with measured results.</li>

<li>OpenAPI Initiative, <a href="https://spec.openapis.org/oas/latest.html" target="_blank" rel="noopener">OpenAPI Specification</a>. A machine-readable format for describing HTTP APIs.</li>
</ol></section>
`
});
