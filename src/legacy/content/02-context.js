GW.lesson({
  id: "context",
  reviewed: "2026-11",
  lede: "A model works from two things: what it learned in training, and what is in front of it right now. This lesson is about the second, because it is the part you control.",
  outcomes: [
    "List what goes into the model's context for a typical request.",
    "Explain why assistants seem to forget, and what “memory” features actually do.",
    "Choose the context a task needs and leave out what it doesn't.",
    "Describe how retrieval works, from embeddings and vector search to reranking, and where it breaks.",
    "Check whether an answer is grounded in its sources.",
    "Build a context pack for a recurring task: what to include, in what order, and what to leave out."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Two hours into a long chat about a billing bug, the assistant suggests a fix that ignores the constraint you explained at the start: invoices can't be regenerated once sent. You scroll up. It's there, in your third message. The assistant agreed with it at the time.</p>
<p>Nothing is broken. The conversation simply grew, and what the model pays attention to changed. This lesson explains what the model can and can't see, and how to give it the right material at the right time.</p></div>
<div class="check warmup" data-a="0"><p class="q">In a very long conversation, an assistant starts ignoring something you said early on. What's the best first step?</p><ul>
<li data-fb="Right. A fresh, focused context usually works better than a long one.">Start a new conversation with a short summary of the key facts.</li>
<li data-fb="Emphasis may help briefly, but the real problem is a crowded context.">Repeat the instruction in capital letters so it stands out more clearly.</li>
<li data-fb="A bigger window doesn't guarantee attention to every part of it.">Switch to a model with a larger context window and keep going.</li>
<li data-fb="It can't choose to remember; what it sees is what's in the window.">Tell it that it made a mistake and ask it to remember better.</li>
</ul></div>
<h2>Everything the model sees, every time</h2>
<p>When you press send, the application assembles one long block of text and passes it to the model. That block is the model's <a class="term" data-t="context">context</a>. The model reads it, generates a reply token by token (lesson 1), and stops. It does not keep running in the background, thinking about your project. When you send the next message, the application assembles the whole block again, now including the previous reply, and the model starts fresh from that.</p>
<p>A typical context contains these parts, in roughly this order:</p>
<figure>
<svg class="ctxfig" viewBox="0 0 640 250" role="img" aria-label="Diagram of a context window: system prompt, memory notes, earlier conversation, attached or retrieved material, your message, and space reserved for the reply, inside a fixed-size window.">
  <rect class="frame" x="4" y="4" width="632" height="200" rx="12"/>
  <g class="seg s1"><rect x="16" y="18" width="608" height="26" rx="5"/><text x="28" y="36">System prompt · rules and role set by the product or by you</text></g>
  <g class="seg s2"><rect x="16" y="48" width="608" height="26" rx="5"/><text x="28" y="66">Memory or project notes · only if the product adds them</text></g>
  <g class="seg s3"><rect x="16" y="78" width="608" height="26" rx="5"/><text x="28" y="96">Earlier conversation · your messages and its replies</text></g>
  <g class="seg s4"><rect x="16" y="108" width="608" height="26" rx="5"/><text x="28" y="126">Attached files and retrieved passages</text></g>
  <g class="seg s5"><rect x="16" y="138" width="608" height="26" rx="5"/><text x="28" y="156">Your new message</text></g>
  <g class="seg s6"><rect x="16" y="168" width="608" height="26" rx="5"/><text x="28" y="186">Room left for the reply</text></g>
  <text class="cap" x="320" y="232" text-anchor="middle">All of it must fit in the context window, measured in tokens</text>
</svg>
<figcaption>The model sees one block of text per reply. Anything not in the block, it cannot use.</figcaption>
</figure>
<p>The <a class="term" data-t="system-prompt">system prompt</a> is a set of instructions placed ahead of the conversation. Products use it to set tone, rules and capabilities, and many tools let you add your own (often called custom instructions or project instructions). You usually can't see the product's version, but it shapes every answer.</p>
<p>The size limit is the <a class="term" data-t="context-window">context window</a>, measured in <a class="term" data-t="token">tokens</a>. It varies a lot between models and products, from a few thousand tokens to hundreds of thousands or more, so check the documentation for the tool you use.<sup>[3]</sup> The reply has to fit inside it too.</p>
<div class="key"><p>The model knows nothing about your project beyond its general training and what is in the context for this reply. If it isn't in the block, it doesn't exist.</p></div>

<h2>Why it forgets</h2>
<p>Two different kinds of forgetting confuse people, and they have different fixes.</p>
<h3>Between conversations</h3>
<p>A new chat starts with an empty conversation. Nothing you said last week is in the context, so the model can't use it. Some products offer “memory”: they save notes about you or your project and quietly insert them into the context of later chats. That can be useful, but it is still just text in the block. It can be outdated, wrong, or missing the detail that matters today, and it is worth knowing what your tool has stored.</p>
<h3>Within one long conversation</h3>
<p>As a chat grows, it eventually approaches the window limit. Products handle this differently: some drop the oldest messages, some replace them with a summary, some refuse to accept more. Either way, an instruction you gave near the start can quietly stop being in the context, or be reduced to a summary that lost its detail.</p>
<p>Typical symptoms: it stops following a rule you set an hour ago, it reintroduces a bug you already fixed together, or it contradicts a decision made earlier in the chat. The fix is cheap: restate the constraints that matter, or start a new conversation with a short summary of decisions so far.</p>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">Fill a context window</span></div><div class="activity-b">
<p>You are asking an assistant to help design a new API endpoint. Switch material on and off, and change the window size. Watch what fits and what gets trimmed. Then try to answer: what is the smallest set that still gives the model what it needs?</p>
<div data-w="context"></div>
</div></div>
<p>Two things usually stand out. First, one large attachment (the incident log) can crowd out everything else, including the conversation where you agreed the design constraints. Second, a bigger window fixes the overflow, but it doesn't make the log relevant. That leads to the next point.</p>

<h2>More context isn't always better</h2>
<p>Even when everything fits, models don't use all of it equally well. A 2023 study tested models on questions whose answer sat somewhere inside a long set of documents. Accuracy was highest when the relevant passage was near the start or end, and dropped noticeably when it was buried in the middle.<sup>[1]</sup> Models have improved since, but the practical lesson holds: relevant beats exhaustive.</p>
<p>Irrelevant material also changes the plausible continuations. Paste a whole codebase when you only care about one function, and the reply may “helpfully” change other files. Paste three versions of a policy, and the answer may blend them.</p>
<p>Practical habits:</p>
<ul>
<li><strong>Include the specific thing.</strong> The failing function and its test, not the repository. The relevant section of the spec, not all 60 pages.</li>
<li><strong>Label what each piece is.</strong> “Here is the error log:”, “Here is our tone guide:”. Clear separators, such as headings or tags, help the model keep materials apart.</li>
<li><strong>Put long material first and your request after it.</strong> For long documents, vendor guidance recommends placing the material above the question rather than below it.<sup>[4]</sup></li>
<li><strong>Say what's missing.</strong> If you know a fact the model needs and can't share the document, state the fact: “Assume the service runs on Postgres 15.”</li>
</ul>
<h3>Context engineering</h3>
<p>Deciding what goes into the context, in what order, and what gets trimmed, now has a name: <a class="term" data-t="context-engineering">context engineering</a>. For a single chat it means the habits above. For teams building AI features and agents it is a design job: which instructions, examples, retrieved documents, tool results and memory notes the system assembles for each step, and how it keeps that set small as a task runs on.<sup>[5]</sup> Prompt wording is one part of it. Most quality problems in AI features turn out to be context problems: the model never saw the fact it needed, or saw too much that it didn't.</p>

<h2>Worked example: asking about a bug</h2>
<p>A checkout page crashes for some customers. Here are two ways to ask for help, and why the second works.</p>
<div class="draft prompt"><div class="draft-h"><span><b>Request A</b></span><span>no context</span></div><div class="draft-b">Why does our checkout page crash?</div></div>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · reply to A</span></div><div class="draft-b"><p>Checkout pages commonly crash because of: unhandled null values in the cart, failed calls to the payment provider, session timeouts, browser extensions blocking scripts, or memory leaks in long sessions. I'd recommend checking your error monitoring and browser console…</p></div>
<div class="review"><div class="r"><span class="stamp warn">Generic</span><span>Every item is plausible, none is about our system. The model gave the most typical answer because it had nothing else.</span></div></div></div>
<div class="draft prompt"><div class="draft-h"><span><b>Request B</b></span><span>with context</span></div><div class="draft-b">Our checkout page (React 18) crashes for some customers since Tuesday's release.

Error from our monitoring:
TypeError: Cannot read properties of undefined (reading 'amount')
  at formatTotal (CartSummary.jsx:42)

CartSummary.jsx lines 35-48:
[pasted code]

What changed Tuesday: we upgraded the pricing API client from v3 to v4.
Already ruled out: the payment provider (its calls succeed in the logs).

What are the most likely causes? For each, tell me what I could check to confirm or rule it out.</div></div>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · reply to B</span></div><div class="draft-b"><p>Line 42 reads <code>item.discount.amount</code>. The error means <code>item.discount</code> is undefined for some items. The likeliest cause is the v4 client: if v4 omits <code>discount</code> when no discount applies (rather than returning a zero amount), items without discounts would crash here. That fits “some customers”.</p><p>To confirm: log one raw v4 response for a cart with no discounts and check whether the field is missing. If so, guard with <code>item.discount?.amount ?? 0</code>, and check the v4 changelog for other fields that became optional.</p></div>
<div class="review"><div class="r"><span class="stamp info">To check</span><span>A specific, testable hypothesis. It is still a hypothesis: the model has not seen a v4 response. Log one before changing code.</span></div></div></div>
<p>Step by step, here's what each piece of context did:</p>
<ol class="steps">
<li><strong>The error and line number</strong>narrowed the problem from “checkout crashes” to “something is undefined at line 42”.</li>
<li><strong>The code</strong>let the model name the exact expression that fails, instead of guessing.</li>
<li><strong>What changed</strong>gave a cause that fits the timing. Without it, the model could only list typical causes.</li>
<li><strong>What you ruled out</strong>stopped it from spending the answer on the payment provider.</li>
<li><strong>Asking for checks</strong>turned the reply into hypotheses you can test, rather than a verdict you have to trust.</li>
</ol>
<p>This is the pattern for almost every task in this starter kit: the quality of the answer is bounded by the quality of the context. Lesson 5 turns it into a repeatable structure.</p>

<h2>Retrieval: answering from your documents</h2>
<p>Many workplace tools, such as an internal help bot or “ask our docs”, use <a class="term" data-t="rag">retrieval-augmented generation</a> (RAG).<sup>[2]</sup> Instead of relying on training, the system searches your documents and puts the most relevant passages into the context before the model answers. It is context engineering done automatically, on every question.</p>
<p>A typical pipeline has six steps. The first three happen once, ahead of time; the last three happen every time someone asks a question.</p>
<ol class="steps">
<li><strong>Split</strong>Documents are cut into chunks of a few paragraphs each, so that a search can return just the relevant part.</li>
<li><strong>Embed</strong>Each chunk is converted into an <a class="term" data-t="embedding">embedding</a>: a long list of numbers that represents its meaning. Texts about similar things get similar numbers, even when they share no words. “How do I claim back a train fare?” and “Submitting travel expenses” end up close together.</li>
<li><strong>Store</strong>The embeddings go into a <a class="term" data-t="vector-database">vector database</a>, a store built to find, among millions of embeddings, the ones closest to a given one. It usually keeps details alongside each chunk too, such as the source document, its date and who may see it.</li>
<li><strong>Search</strong>Your question is embedded the same way, and the database returns the closest chunks. Many systems run a keyword search alongside, because embeddings can miss exact terms such as product codes or error numbers.</li>
<li><strong>Rerank</strong>Closeness in meaning is a rough signal. A <a class="term" data-t="reranking">reranker</a> is a second, slower model that reads the question and each candidate chunk together and scores how well the chunk actually answers it. Only the top few after reranking go into the context.<sup>[6]</sup></li>
<li><strong>Answer</strong>Those chunks and your question go into the context. The model is instructed to answer only from them and to cite which chunk supports each statement.</li>
</ol>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">Search, rerank, filter</span></div><div class="activity-b">
<p>A new hire asks the company help bot about expense claims. Step through the pipeline and watch which chunks reach the context, and how the answer changes as a result.</p>
<div data-w="rerank"></div>
</div></div>
<p>Two lessons from the exercise. A reranker improves <em>relevance</em>: it pushed the travel-booking chunk down because it answered a different question. It does not know which document is <em>current</em>. The outdated policy stayed near the top until a filter on document status removed it. Keeping sources current, and marking old ones as superseded, is part of building a retrieval system, not an afterthought.</p>

<h2>Grounding: is the answer supported?</h2>
<p>An answer is <a class="term" data-t="grounding">grounded</a> when every claim in it can be traced to the material in the context. Grounding is the opposite of <a class="term" data-t="hallucination">hallucination</a>: a grounded answer says only what the sources say; an ungrounded one fills the gaps from training patterns, and sounds just as confident.</p>
<p>Retrieval makes grounding possible, not certain. Models still add plausible details that no chunk contains, or blend a retrieved passage with general knowledge. Good tools show which chunk each statement came from, so you can check.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check an answer against its sources</span></div><div class="activity-b">
<p>Here are the chunks the help bot retrieved, and the answer it gave. Flag every sentence that the chunks don't support, then reveal the review.</p>
<div data-w="claims" data-cfg="grounding-check"></div>
</div></div>

<p>Each step of the pipeline can fail, and the answer will sound just as fluent:</p>
<ul>
<li><strong>The wrong chunk is found.</strong> The search returns an old policy because the wording is similar, or misses the right one because it uses different terms.</li>
<li><strong>The right chunk is cut badly.</strong> A table split across two chunks loses its header, so numbers end up attached to the wrong column.</li>
<li><strong>The source is out of date.</strong> Retrieval faithfully returns a wiki page nobody has updated since the reorganisation.</li>
<li><strong>The answer isn't grounded.</strong> The model mixes the retrieved passage with general knowledge and presents both as “the policy”.</li>
</ul>
<p>The check is simple and worth making a habit: <strong>open the cited source and find the sentence.</strong> If the tool doesn't show sources, treat its answers as unverified.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Choose the context</span></div><div class="activity-b">
<p>You want an assistant to draft a reply to a customer who says they were charged twice for one order. You will edit and send the reply yourself. For each item, decide whether to include it, summarise it first, or leave it out. Then check your answers.</p>
<div data-w="sort" data-cfg="context-pick"></div>
</div></div>

<h2>More tokens, less attention</h2>
<p>Context windows have grown enormously, but using all of one has a cost. Research on long contexts found models use information at the start and end of a long input better than information in the middle.[1] A 2025 study across many current models found the same pattern more broadly: as input length grows, performance drops, even on simple tasks, and the drop starts well before the window is full.[8] The practical rule is to give the model what it needs for this step, clearly labelled, not everything you have.</p>
<h2>Worked example: a context pack</h2>
<p>A context pack is a short, reusable bundle of what a model needs for a recurring task. Here's one for reviewing pull requests in a payments service, compared with the usual approach of pasting the diff and asking “any issues?”.</p>
<div class="worked">
<div class="wx"><b>Weak: the diff and a question</b><div><pre>Any issues with this PR?

[ 600-line diff ]</pre></div></div>
<div class="wx strong"><b>Strong: a context pack</b><div><pre>&lt;role&gt;Reviewer for the payments service.&lt;/role&gt;
&lt;rules&gt;
- Money is stored in minor units (integers).
- Invoices can't be changed once status = sent.
- All writes go through LedgerService.
&lt;/rules&gt;
&lt;change_summary&gt;Adds partial refunds.&lt;/change_summary&gt;
&lt;diff&gt; [ only the 4 changed files ] &lt;/diff&gt;
&lt;task&gt;List rule violations first, quoting
the line. Then other risks. Say "none
found" if there are none.&lt;/task&gt;</pre></div></div>
</div>
<ul class="wx-notes">
<li><strong>The rules are the context the model can't guess.</strong> Without them it reviews against typical code, not yours.</li>
<li><strong>Labelled sections</strong> (here with XML-style tags) help the model tell instructions from material.[9]</li>
<li><strong>Only the changed files</strong>, not the whole diff with generated files, keeps attention on what matters.</li>
<li><strong>“Say none found”</strong> gives it permission not to invent problems.</li>
<li><strong>The pack is reusable.</strong> Save it next to the code; update the rules when they change.</li>
</ul>
<h2>Better retrieval: context for each chunk</h2>
<p>Retrieval systems split documents into chunks and fetch the most relevant ones. A chunk on its own often loses meaning: “Revenue grew 3% on the previous quarter” doesn't say which company or which quarter. One documented improvement is to add a sentence of context to each chunk before indexing it, saying where it comes from; Anthropic reported this cut failed retrievals substantially in its tests, and more when combined with reranking.[7] You don't need to build this yourself, but it explains why well-titled, self-contained documentation gives far better AI answers than pages that rely on the page above.</p>
<h2>Your turn: build a context pack</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">A context pack for a task you repeat</span></div><div class="activity-b">
<p>Pick a task you ask an assistant to help with at least weekly (reviewing, summarising, drafting, analysing). Write the context pack: the rules or facts it can't know, what material you'll paste each time, and the instruction, including what it should say when it doesn't know.</p>
<div data-w="task" data-key="context-pack">
<div class="task-model"><p><strong>Task:</strong> weekly summary of support tickets for the product team.</p>
<p><strong>Facts it can't know:</strong> our product areas (billing, reports, integrations, mobile); “P1” means a customer can't work; enterprise customers are those on the Scale plan.</p>
<p><strong>Material each week:</strong> the export of tickets closed this week, with area, priority, plan and the first message only.</p>
<p><strong>Instruction:</strong> “Group tickets by product area. For each area give the count, the two most common problems with ticket IDs, and any P1s. List enterprise tickets separately. Only use the export; if an area has too few tickets to say anything, say so.”</p></div>
<ul class="task-rubric">
<li>States facts and definitions the model couldn't know</li>
<li>Limits the material to what the task needs</li>
<li>Labels or separates instructions from pasted material</li>
<li>Asks for traceable output, such as IDs or quoted lines</li>
<li>Says what to do when there isn't enough information</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Take your context pack and use it twice: once in the usual long-running chat, and once in a fresh conversation with only the pack and this week's material. Compare the two answers for accuracy and for anything invented.</div>
<h2>Common misconceptions</h2>
<dl class="myths">
<dt>The assistant remembers what I told it last week.</dt><dd>Only if the product has a memory feature and saved it. Otherwise each conversation starts empty.</dd>
<dt>A bigger context window means I can paste everything.</dt><dd>Models attend unevenly to long inputs, and performance drops as length grows. Curate rather than dump.</dd>
<dt>Retrieval means the answer comes from our documents.</dt><dd>Retrieval supplies documents; the model can still ignore or misread them. Check that answers are grounded in what was retrieved.</dd>
<dt>Uploading a file means the model read all of it.</dt><dd>Long files may be truncated, chunked or partly retrieved, depending on the product. Ask it to quote the parts it relied on.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>The model sees only what's in its context window: instructions, conversation, documents and tool results.</li>
<li>Long contexts get uneven attention; put key facts near the start or end, clearly labelled.</li>
<li>When a chat drifts, start fresh with a short summary of what matters.</li>
<li>A reusable context pack holds the rules and facts the model can't guess.</li>
<li>Retrieval quality depends on self-contained, well-titled documents.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="3"><p class="q">Which belongs in a context pack for reviewing pull requests in your service?</p><ul>
<li data-fb="The model already knows typical mistakes; it doesn't know your rules.">A general list of the most common programming mistakes.</li>
<li data-fb="Far too much, and mostly irrelevant to this change.">The full history of every previous review in the repository.</li>
<li data-fb="Vague exhortations add little; specific rules do.">A reminder to be thorough and to think carefully about everything.</li>
<li data-fb="Right. These are the facts it can't guess.">The service's rules, like how money is stored and what can't change.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why might a model miss a fact placed in the middle of a long document?</p><ul>
<li data-fb="Nothing is removed; attention is just uneven.">The middle of every document is removed before the model sees it.</li>
<li data-fb="Right. Research shows weaker use of material in the middle of long inputs.">Models tend to use information at the start and end better.</li>
<li data-fb="Tokens aren't counted twice.">The middle section is counted twice, so it exceeds the token limit.</li>
<li data-fb="Position doesn't change how text is classified.">Facts in the middle are treated as examples rather than instructions.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Your chat has drifted and the assistant ignores an early constraint. What helps most?</p><ul>
<li data-fb="You'll be correcting forever; the context is still crowded.">Keep going and correct it each time it forgets the constraint.</li>
<li data-fb="It already “sees” the whole conversation; that's the problem.">Ask it to scroll up and re-read the whole conversation carefully.</li>
<li data-fb="Right. A short, fresh context restores focus.">Start a new chat with a short summary and the constraint near the top.</li>
<li data-fb="Same crowded context, different model.">Switch to a different assistant and paste the full transcript there.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">A retrieval system returns the chunk “Revenue grew 3% on the previous quarter.” What's the weakness?</p><ul>
<li data-fb="Right. Chunks that rely on surrounding text lose their meaning.">It doesn't say which company, product or quarter it refers to.</li>
<li data-fb="Short is fine if the chunk is self-contained.">It's too short to contain any useful information at all.</li>
<li data-fb="Retrieval works on text; percentages are fine.">Percentages can't be handled by retrieval systems.</li>
<li data-fb="Format isn't the problem; missing context is.">It should have been written as a table rather than a sentence.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">You upload a 200-page PDF and ask for a summary. How do you check it used the whole document?</p><ul>
<li data-fb="It can't reliably report what it attended to.">Ask whether it read the whole document, and accept its answer.</li>
<li data-fb="Right. Quotes you can find show what it actually used.">Ask it to quote passages from several sections, with page numbers.</li>
<li data-fb="Length says nothing about coverage.">Check that the summary is long enough to cover 200 pages.</li>
<li data-fb="Two summaries can share the same gaps.">Run the same request a second time and compare the summaries.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Liu et al. (2023), <a href="https://arxiv.org/abs/2307.03172" target="_blank" rel="noopener">Lost in the Middle: How Language Models Use Long Contexts</a>. Performance drops when relevant information sits in the middle of long inputs.</li>
<li>Lewis et al. (2020), <a href="https://arxiv.org/abs/2005.11401" target="_blank" rel="noopener">Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks</a>. The paper that named and described RAG.</li>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/build-with-claude/context-windows" target="_blank" rel="noopener">Context windows</a>. How a context window works for one model family, including how replies count against it.</li>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/long-context-tips" target="_blank" rel="noopener">Long context prompting tips</a>. Practical guidance on placing and labelling long documents.</li>
<li>Anthropic (2025), <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" target="_blank" rel="noopener">Effective context engineering for AI agents</a>. Context as a limited resource, and how to curate it for each step.</li>
<li>Nogueira and Cho (2019), <a href="https://arxiv.org/abs/1901.04085" target="_blank" rel="noopener">Passage Re-ranking with BERT</a>. An early, widely cited demonstration that a second-stage reranker improves search results.</li>

<li>Anthropic (2024), <a href="https://www.anthropic.com/news/contextual-retrieval" target="_blank" rel="noopener">Introducing Contextual Retrieval</a>. Adding context to each chunk before indexing, and its measured effect on retrieval failures.</li>
<li>Hong, Troynikov and Huber, Chroma (2025), <a href="https://research.trychroma.com/context-rot" target="_blank" rel="noopener">Context Rot: How Increasing Input Tokens Impacts LLM Performance</a>. Performance across 18 models as input length grows.</li>
<li>Anthropic, <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags" target="_blank" rel="noopener">Use XML tags to structure your prompts</a>. Separating instructions, material and examples.</li>
</ol></section>
`
});
