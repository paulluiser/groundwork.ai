SPEC = dict(
file="01-how-models-work.js",
reviewed="2026-11",
situation="""<p>A colleague pastes an assistant's answer into the team chat: a confident explanation of why last night's deploy failed, with a root cause, a fix and a sentence that begins “As the logs show”. Nobody gave the assistant any logs.</p>
<p>Half the team is ready to apply the fix. The other half isn't sure why they feel uneasy. By the end of this lesson you'll be able to say exactly what happened, in one sentence, and what to do instead.</p>""",
warmup=dict(q="You ask an assistant the same question twice and get two different answers. What's the most likely reason?", a=2, opts=[
  ("It looked up newer information between the two requests.", "Most assistants don't look anything up unless a search tool is switched on."),
  ("It detected that the first answer was wrong and corrected it.", "It has no record of being wrong; each answer is generated fresh."),
  ("Each word is picked at random, weighted by its probability.", "Right. Sampling makes the output vary, even for the same request."),
  ("Your second question was phrased in a slightly clearer way.", "Wording can matter, but identical requests also produce different answers."),
 ]),
sections="""<h2>Worked example: reading an answer like a model wrote it</h2>
<p>Back to the deploy. Here is the answer the colleague pasted, and the same answer annotated with what you now know about how it was produced.</p>
<div class="worked">
<div class="wx"><b>What the team saw</b><div><p>“The deploy failed because the database migration timed out. As the logs show, the migration locked the orders table for longer than the 30-second limit. Increase the timeout to 120 seconds and re-run the pipeline.”</p></div></div>
<div class="wx strong"><b>What was actually happening</b><div><p><strong>“because the database”</strong>: the most likely continuation of “The deploy failed because the”, not a finding.</p><p><strong>“As the logs show”</strong>: a phrase that often follows an explanation in incident write-ups. No logs were in the conversation.</p><p><strong>“30-second limit … 120 seconds”</strong>: typical numbers for this kind of story. Your limit may be different, or may not exist.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>Every sentence is plausible, and none is evidence.</strong> The answer is a typical incident story, generated one likely token at a time.</li>
<li><strong>The confident tone carries no information.</strong> Training rewarded answers that sound helpful and sure (the training section above).</li>
<li><strong>The fix isn't harmless.</strong> Raising a timeout can hide a real locking problem and lengthen the next outage.</li>
<li><strong>What to do instead:</strong> paste the actual pipeline log and the migration, and ask what in them explains the failure, quoting the lines. That turns a typical story into an answer about your system (lesson 2).</li>
</ul>
<h2>Three ideas to keep</h2>
<p>If you remember nothing else from this lesson, remember these. They explain most of what surprises people about AI output.</p>
<div class="tbl"><table><thead><tr><th>Idea</th><th>What it explains</th><th>What you do about it</th></tr></thead><tbody>
<tr><td>It predicts likely text</td><td>Fluent answers that are typical rather than true; invented names, numbers and quotes</td><td>Treat specifics as claims to check, not facts</td></tr>
<tr><td>It samples</td><td>Different answers to the same question; occasional odd choices</td><td>Don't rely on one run for anything important; test features on many inputs</td></tr>
<tr><td>It only sees the text</td><td>Answers about “your” system that are really about systems in general</td><td>Supply the documents, logs and data it should work from</td></tr>
</tbody></table></div>
<h2>Your turn: explain it to a colleague</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Explain why the assistant “saw” logs that didn't exist</span></div><div class="activity-b">
<p>Write three or four sentences you could post in the team chat to explain what happened with the deploy answer, without jargon, and what the team should do next.</p>
<div data-w="task" data-key="models-explain">
<div class="task-model"><p>“The assistant didn't look at anything: it wrote the most typical explanation for a failed deploy, one word at a time. ‘As the logs show’ is a phrase that usually appears in write-ups like this, not a sign it read our logs. The 30 and 120 seconds are typical numbers, not ours. Let's paste the real pipeline log and the migration and ask it to point to the lines that explain the failure, then check those lines ourselves.”</p></div>
<ul class="task-rubric">
<li>Says the model generated a typical answer rather than looking anything up</li>
<li>Explains that phrases like “as the logs show” can appear without any logs</li>
<li>Points out that specific numbers or names may be invented</li>
<li>Recommends supplying the real evidence and asking for quoted lines</li>
<li>Avoids jargon a non-technical colleague wouldn't follow</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 15-minute exercise.</strong> Ask an assistant the same factual question about your own product or codebase three times, in three new conversations, without giving it any documents. Note what stays the same, what changes, and which details are invented. Then ask once more with the relevant document pasted in, and compare.</div>""",
myths=[
 ("The model looks up answers in its training data.", "It doesn't store or search documents. It produces text that resembles what it learned from, which is why quotes and citations can be invented."),
 ("A longer, more detailed answer means the model worked harder.", "Length is just more trips around the generation loop. Detail and structure say nothing about how well an answer is supported."),
 ("Setting temperature to zero makes answers correct.", "It makes them repeatable. A repeatable answer can be repeatably wrong."),
 ("If it says “I'm confident”, it has checked.", "Confidence is a style it learned because people rated confident answers highly. It isn't a measurement."),
],
recap=[
 "A language model predicts the next token, over and over. Plausible is not the same as correct.",
 "Text is split into tokens; limits, prices and speed are all counted in tokens.",
 "Sampling makes answers vary; low temperature makes them repeatable, not right.",
 "Training gives patterns up to a cutoff, not your data and not a way to look things up.",
 "To get answers about your situation, give it your evidence and ask it to point to it.",
],
checks=[
 dict(q="A colleague says: “The assistant found the answer in its training data.” Which description is more accurate?", a=1, opts=[
  ("It retrieved the matching document it was trained on and quoted it.", "Models don't store or retrieve their training documents."),
  ("It generated a likely answer from patterns learned during training.", "Right. It produces likely text; it doesn't look anything up."),
  ("It searched the internet and summarised the most relevant page it found.", "Only if a search tool is connected, and then the answer would cite pages."),
  ("It compared several stored answers and picked the most accurate.", "There are no stored answers to compare."),
 ]),
 dict(q="Why can a model struggle to count the letters in a long word?", a=3, opts=[
  ("Counting needs an internet connection the model doesn't have.", "Counting needs no external information."),
  ("The model was never shown any words during its training.", "It was trained on enormous amounts of text."),
  ("Letter counting is blocked by safety settings in most products.", "Nothing blocks it; the difficulty comes from how text is represented."),
  ("It sees chunks called tokens, not individual letters.", "Right. A long word may be two or three tokens, so its letters are hidden."),
 ]),
 dict(q="You set temperature to 0 and the answer is the same every time. What can you conclude?", a=0, opts=[
  ("The answer is repeatable, which doesn't mean it's correct.", "Right. Zero temperature picks the top token every time, right or wrong."),
  ("The answer has been checked against the model's training data and verified.", "No checking happens; it's still a prediction."),
  ("The model is now certain, so the answer can be trusted.", "Repeatability isn't certainty, and certainty isn't accuracy."),
  ("The model has stopped sampling, so it can no longer invent details.", "It can still invent details; it just invents the same ones each time."),
 ]),
 dict(q="An answer about your system says “as the config shows”, but you didn't share any config. What happened?", a=2, opts=[
  ("The assistant has read access to your repository by default.", "Assistants only see what's in the conversation unless a tool is connected."),
  ("It remembered your config from an earlier conversation last week.", "Most assistants don't carry memory between conversations unless configured to."),
  ("The phrase is a likely continuation, not evidence it saw a config.", "Right. Plausible phrases appear whether or not the evidence exists."),
  ("It inferred the config correctly from the way you worded the question.", "It may guess, but a guess isn't what “the config shows”."),
 ]),
 dict(q="Which task is the best fit for an assistant with no extra context?", a=1, opts=[
  ("Stating your company's current refund policy for a customer.", "It doesn't know your policy and will produce a typical one."),
  ("Explaining a general concept, like what a race condition is.", "Right. Widely discussed general knowledge is where training is strongest."),
  ("Reporting yesterday's error rate for the payments service.", "It has no access to your metrics without a tool."),
  ("Confirming which version of a library your app depends on.", "It can't see your project, and versions after its cutoff are unknown to it."),
 ]),
],
sources=[
 'Stephen Wolfram (2023), <a href="https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/" target="_blank" rel="noopener">What Is ChatGPT Doing … and Why Does It Work?</a> A long, readable explanation of next-token prediction, temperature and training.',
 'Andrej Karpathy (2023), <a href="https://www.youtube.com/watch?v=zjkBMFhNj_g" target="_blank" rel="noopener">Intro to Large Language Models</a>. A one-hour talk covering pretraining, fine-tuning and how assistants are built.',
],
)
