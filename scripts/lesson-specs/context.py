SPEC = dict(
file="02-context.js",
reviewed="2026-11",
outcomes=["Build a context pack for a recurring task: what to include, in what order, and what to leave out."],
situation="""<p>Two hours into a long chat about a billing bug, the assistant suggests a fix that ignores the constraint you explained at the start: invoices can't be regenerated once sent. You scroll up. It's there, in your third message. The assistant agreed with it at the time.</p>
<p>Nothing is broken. The conversation simply grew, and what the model pays attention to changed. This lesson explains what the model can and can't see, and how to give it the right material at the right time.</p>""",
warmup=dict(q="In a very long conversation, an assistant starts ignoring something you said early on. What's the best first step?", a=0, opts=[
  ("Start a new conversation with a short summary of the key facts.", "Right. A fresh, focused context usually works better than a long one."),
  ("Repeat the instruction in capital letters so it stands out more clearly.", "Emphasis may help briefly, but the real problem is a crowded context."),
  ("Switch to a model with a larger context window and keep going.", "A bigger window doesn't guarantee attention to every part of it."),
  ("Tell it that it made a mistake and ask it to remember better.", "It can't choose to remember; what it sees is what's in the window."),
 ]),
sections="""<h2>More tokens, less attention</h2>
<p>Context windows have grown enormously, but using all of one has a cost. Research on long contexts found models use information at the start and end of a long input better than information in the middle.[1] A 2025 study across many current models found the same pattern more broadly: as input length grows, performance drops, even on simple tasks, and the drop starts well before the window is full.[S2] The practical rule is to give the model what it needs for this step, clearly labelled, not everything you have.</p>
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
<li><strong>Labelled sections</strong> (here with XML-style tags) help the model tell instructions from material.[S3]</li>
<li><strong>Only the changed files</strong>, not the whole diff with generated files, keeps attention on what matters.</li>
<li><strong>“Say none found”</strong> gives it permission not to invent problems.</li>
<li><strong>The pack is reusable.</strong> Save it next to the code; update the rules when they change.</li>
</ul>
<h2>Better retrieval: context for each chunk</h2>
<p>Retrieval systems split documents into chunks and fetch the most relevant ones. A chunk on its own often loses meaning: “Revenue grew 3% on the previous quarter” doesn't say which company or which quarter. One documented improvement is to add a sentence of context to each chunk before indexing it, saying where it comes from; Anthropic reported this cut failed retrievals substantially in its tests, and more when combined with reranking.[S1] You don't need to build this yourself, but it explains why well-titled, self-contained documentation gives far better AI answers than pages that rely on the page above.</p>
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
<div class="aside"><strong>A 20-minute exercise.</strong> Take your context pack and use it twice: once in the usual long-running chat, and once in a fresh conversation with only the pack and this week's material. Compare the two answers for accuracy and for anything invented.</div>""",
myths=[
 ("The assistant remembers what I told it last week.", "Only if the product has a memory feature and saved it. Otherwise each conversation starts empty."),
 ("A bigger context window means I can paste everything.", "Models attend unevenly to long inputs, and performance drops as length grows. Curate rather than dump."),
 ("Retrieval means the answer comes from our documents.", "Retrieval supplies documents; the model can still ignore or misread them. Check that answers are grounded in what was retrieved."),
 ("Uploading a file means the model read all of it.", "Long files may be truncated, chunked or partly retrieved, depending on the product. Ask it to quote the parts it relied on."),
],
recap=[
 "The model sees only what's in its context window: instructions, conversation, documents and tool results.",
 "Long contexts get uneven attention; put key facts near the start or end, clearly labelled.",
 "When a chat drifts, start fresh with a short summary of what matters.",
 "A reusable context pack holds the rules and facts the model can't guess.",
 "Retrieval quality depends on self-contained, well-titled documents.",
],
checks=[
 dict(q="Which belongs in a context pack for reviewing pull requests in your service?", a=3, opts=[
  ("A general list of the most common programming mistakes.", "The model already knows typical mistakes; it doesn't know your rules."),
  ("The full history of every previous review in the repository.", "Far too much, and mostly irrelevant to this change."),
  ("A reminder to be thorough and to think carefully about everything.", "Vague exhortations add little; specific rules do."),
  ("The service's rules, like how money is stored and what can't change.", "Right. These are the facts it can't guess."),
 ]),
 dict(q="Why might a model miss a fact placed in the middle of a long document?", a=1, opts=[
  ("The middle of every document is removed before the model sees it.", "Nothing is removed; attention is just uneven."),
  ("Models tend to use information at the start and end better.", "Right. Research shows weaker use of material in the middle of long inputs."),
  ("The middle section is counted twice, so it exceeds the token limit.", "Tokens aren't counted twice."),
  ("Facts in the middle are treated as examples rather than instructions.", "Position doesn't change how text is classified."),
 ]),
 dict(q="Your chat has drifted and the assistant ignores an early constraint. What helps most?", a=2, opts=[
  ("Keep going and correct it each time it forgets the constraint.", "You'll be correcting forever; the context is still crowded."),
  ("Ask it to scroll up and re-read the whole conversation carefully.", "It already “sees” the whole conversation; that's the problem."),
  ("Start a new chat with a short summary and the constraint near the top.", "Right. A short, fresh context restores focus."),
  ("Switch to a different assistant and paste the full transcript there.", "Same crowded context, different model."),
 ]),
 dict(q="A retrieval system returns the chunk “Revenue grew 3% on the previous quarter.” What's the weakness?", a=0, opts=[
  ("It doesn't say which company, product or quarter it refers to.", "Right. Chunks that rely on surrounding text lose their meaning."),
  ("It's too short to contain any useful information at all.", "Short is fine if the chunk is self-contained."),
  ("Percentages can't be handled by retrieval systems.", "Retrieval works on text; percentages are fine."),
  ("It should have been written as a table rather than a sentence.", "Format isn't the problem; missing context is."),
 ]),
 dict(q="You upload a 200-page PDF and ask for a summary. How do you check it used the whole document?", a=1, opts=[
  ("Ask whether it read the whole document, and accept its answer.", "It can't reliably report what it attended to."),
  ("Ask it to quote passages from several sections, with page numbers.", "Right. Quotes you can find show what it actually used."),
  ("Check that the summary is long enough to cover 200 pages.", "Length says nothing about coverage."),
  ("Run the same request a second time and compare the summaries.", "Two summaries can share the same gaps."),
 ]),
],
sources=[
 'Anthropic (2024), <a href="https://www.anthropic.com/news/contextual-retrieval" target="_blank" rel="noopener">Introducing Contextual Retrieval</a>. Adding context to each chunk before indexing, and its measured effect on retrieval failures.',
 'Hong, Troynikov and Huber, Chroma (2025), <a href="https://research.trychroma.com/context-rot" target="_blank" rel="noopener">Context Rot: How Increasing Input Tokens Impacts LLM Performance</a>. Performance across 18 models as input length grows.',
 'Anthropic, <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags" target="_blank" rel="noopener">Use XML tags to structure your prompts</a>. Separating instructions, material and examples.',
],
)
