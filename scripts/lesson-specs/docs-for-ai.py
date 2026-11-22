SPEC = dict(
file="11d-2-docs-for-ai.js",
reviewed="2026-11",
outcomes=["Rewrite a documentation section so it stands alone when retrieved by an AI tool."],
situation="""<p>A customer asks your support bot how to rotate an API key. The bot answers confidently with steps from a page about a different product tier, because the relevant section of your docs starts with “As described above, do the following” and never names the product, the tier or the setting.</p>
<p>Nobody on the docs team wrote anything wrong. They wrote for a reader who scrolls. Retrieval systems don't scroll; they pick up one chunk and answer from it. This lesson is about writing sections that survive being read alone.</p>""",
warmup=dict(q="Which section opening works best when an AI tool retrieves just that section?", a=3, opts=[
  ("“As described above, do the following.”", "“Above” doesn't exist for a retrieved chunk."),
  ("“Next, configure it as shown.”", "“It” and “next” depend on earlier text."),
  ("“This works the same as before.”", "Before what? The context is lost."),
  ("“To rotate an API key on the Business plan, open Settings › Keys.”", "Right. It names the task, the tier and the place."),
 ]),
sections="""<h2>Write sections that carry their own context</h2>
<p>Retrieval systems split pages into chunks and fetch the few that best match a question. A chunk that depends on its page loses meaning: pronouns, “above”, an unnamed product. The fix is to give each section the context a newcomer would need: name the product, version, plan and task in the heading or first sentence; repeat key nouns instead of “it”; keep prerequisites in the section that needs them. Structured reference, like an OpenAPI schema for APIs, gives AI tools exact names and types they don't have to guess.[S1]</p>
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
</div></div></div>""",
myths=[
 ("Writing for AI means stuffing pages with keywords.", "It means clear, self-contained sections with exact names. Keyword stuffing makes retrieval worse."),
 ("If the bot answered wrongly, the model is the problem.", "Often the retrieved chunk lacked the context to answer correctly. Fix the section."),
 ("llms.txt makes docs AI-ready on its own.", "It points tools to the right pages. The pages still need to be clear and self-contained.[1]"),
 ("Repetition is bad writing.", "Repeating the key noun instead of “it” is clearer for every reader, human or machine."),
],
recap=[
 "Retrieval reads one chunk at a time; write sections that stand alone.",
 "Name the product, plan, version and task in the heading or first line.",
 "Replace pronouns and “above” with the actual nouns and prerequisites.",
 "State defaults, limits and error codes explicitly.",
 "Structured references like OpenAPI give tools exact names to use.",
],
checks=[
 dict(q="Why does “As described above” cause problems for AI tools?", a=2, opts=[
  ("AI tools can't read the word “above”.", "They read it; it just points nowhere."),
  ("It makes sections too short to be indexed.", "Length isn't the problem."),
  ("A retrieved chunk has no “above”, so the context is lost.", "Right. The referenced text isn't in the chunk."),
  ("It's against most documentation style guides.", "Possibly, but that isn't why it breaks retrieval."),
 ]),
 dict(q="What should a retrieval-ready heading include?", a=0, opts=[
  ("The task and the product, plan or version it applies to.", "Right. It matches questions and the right context."),
  ("A single word, so it's easy to scan.", "Too little context for retrieval."),
  ("A question, so it matches how users ask.", "Can help, but must still name the task and scope."),
  ("The date the section was last updated.", "Useful metadata, but not what matches questions."),
 ]),
 dict(q="Your support bot gave steps for the wrong plan. What's the first thing to check?", a=3, opts=[
  ("Whether a newer model would answer correctly.", "The model may be answering faithfully from a vague chunk."),
  ("Whether the bot's temperature is set too high.", "Unlikely to be the cause."),
  ("Whether users are asking unclear questions.", "The question was clear."),
  ("Whether the retrieved section says which plan it covers.", "Right. Missing scope in the chunk is a common cause."),
 ]),
 dict(q="What does an llms.txt file do?", a=1, opts=[
  ("It blocks AI tools from reading your documentation.", "That's closer to robots.txt rules."),
  ("It points AI tools to your most useful pages in a simple format.", "Right. A map, not a fix for unclear pages."),
  ("It automatically rewrites pages for AI readers.", "It doesn't change your pages."),
  ("It trains models on your documentation.", "It doesn't train anything."),
 ]),
 dict(q="Which sentence survives chunking best?", a=0, opts=[
  ("“The old API key keeps working for 24 hours after rotation.”", "Right. Every noun is explicit."),
  ("“The old one keeps working for a while.”", "“The old one” and “a while” lose meaning."),
  ("“It still works temporarily, as noted.”", "Depends on context that won't be retrieved."),
  ("“See the previous section for details.”", "Points to text that isn't there."),
 ]),
],
sources=[
 'OpenAPI Initiative, <a href="https://spec.openapis.org/oas/latest.html" target="_blank" rel="noopener">OpenAPI Specification</a>. A machine-readable format for describing HTTP APIs.',
],
)
