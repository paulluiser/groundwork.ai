GW.lesson({
  id: "failure-modes",
  reviewed: "2026-11",
  lede: "AI output goes wrong in a handful of recognisable ways. Each one follows from how models work, and each one has a check that catches it.",
  outcomes: [
    "Name five common failure modes and explain why each happens.",
    "Tell the difference between confident text and supported text.",
    "Pick out the claims in an AI answer that need checking, and choose a quick check for each.",
    "Ask questions in a way that makes agreeable-but-wrong answers less likely."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>In 2023, lawyers in a New York case filed a brief citing six court decisions that did not exist. An assistant had produced them, complete with case names, quotations and page numbers, and confirmed they were real when asked. The court sanctioned the lawyers.[8]</p>
<p>The lawyers weren't careless people; the citations looked exactly like real ones. This lesson is about recognising the shapes that errors take, so you check in the right places before something like that reaches a customer, a release or a court.</p></div>
<div class="check warmup" data-a="3"><p class="q">You ask an assistant whether a citation it gave you is real. It says yes. What does that tell you?</p><ul>
<li data-fb="Asking again isn't checking; it generates another likely answer.">The citation is real, since the assistant has now double-checked it.</li>
<li data-fb="Consistency with its earlier answer is exactly the risk.">The citation is probably real, because assistants rarely contradict themselves.</li>
<li data-fb="It may be real or fake; the answer just doesn't tell you which.">The citation is fake, since an assistant that's unsure would refuse to answer.</li>
<li data-fb="Right. Only the source itself can confirm a citation.">Very little: you need to find the source yourself.</li>
</ul></div>
<h2>Fluency is not evidence</h2>
<p>With people, we use fluency as a rough signal. A colleague who explains something clearly, with specific details and no hesitation, usually knows it. Someone unsure tends to hedge, pause or say “I think”.</p>
<p>A language model breaks that signal. It produces fluent, specific, unhesitating text whether or not the content is true, because fluency is exactly what next-token prediction is good at (lesson 1). Its tone tells you very little about how likely it is to be right. In the language of forecasting, its confidence is poorly <a class="term" data-t="calibration">calibrated</a>: “definitely” doesn't mean what it would mean from a careful colleague.</p>
<div class="key"><p>Judge AI output by what you can check, not by how it sounds. Specific, confident and wrong is the normal shape of an AI mistake.</p></div>

<h2>Five ways it goes wrong</h2>
<p>Most mistakes you will meet fall into five groups. Knowing which group a claim is at risk of tells you how to check it.</p>
<div class="tbl"><table>
<thead><tr><th>Failure</th><th>What it looks like</th><th>Why it happens</th><th>How to catch it</th></tr></thead>
<tbody>
<tr><td><b>Fabrication</b></td><td>An invented citation, statistic, quote, API method, config flag or URL.</td><td>The model produces what such a thing usually looks like. A plausible function name is a likely continuation whether or not it exists.</td><td>Trace it: open the source, run the code, search the docs for the exact name.</td></tr>
<tr><td><b>Stale knowledge</b></td><td>Advice for a library version, price, regulation or product that has since changed.</td><td>Training stops at a <a class="term" data-t="training-cutoff">cutoff</a>. Older information is also more common in the training data than newer.</td><td>Check current official docs. Give it the version you use.</td></tr>
<tr><td><b>Reasoning slips</b></td><td>Wrong arithmetic, dates, unit conversions, logic that skips a step, totals that don't add up.</td><td>Steps are predicted, not calculated. An early error carries through to the end.</td><td>Recompute with a calculator, spreadsheet or code. Check each step, not only the conclusion.</td></tr>
<tr><td><b>Agreeableness</b></td><td>It accepts a wrong premise in your question, or abandons a correct answer when you push back.</td><td>Training on human preferences rewards answers people like, and people like being agreed with.<sup>[2]</sup></td><td>Ask neutrally. Ask for the strongest case against your view.</td></tr>
<tr><td><b>Filled-in defaults</b></td><td>It assumes the typical case: US date formats, a standard tech stack, average users, a common business model.</td><td>Missing context gets filled with whatever is most common in training data.</td><td>Ask it to list its assumptions; state the ones that matter.</td></tr>
</tbody></table></div>
<p>Researchers usually call the first group <a class="term" data-t="hallucination">hallucination</a>; many prefer “fabrication” or “confabulation”, because the model isn't perceiving anything.<sup>[1]</sup> The word matters less than the habit: specifics need sources.</p>

<h2>Worked example: reviewing an answer</h2>
<p>An engineer asks an assistant: “How should our public API respond when a client goes over its rate limit, and how should clients retry? We use Express.” The answer below reads well. Some of it is right, some is invented, and one sentence is half true.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Flag what you would check</span></div><div class="activity-b">
<p>Click every sentence you would want to verify before putting it in a design doc. You don't need to know the right answers; decide which claims are the kind that can be wrong. Then reveal the review.</p>
<div data-w="claims" data-cfg="rate-limit"></div>
</div></div>

<p>Here is the reasoning behind the review, and how long each check takes:</p>
<ol class="steps">
<li><strong>Status code: true, 1 minute to confirm</strong>RFC 6585 defines 429 Too Many Requests.<sup>[3]</sup> A specific, checkable claim with a named source: open the RFC and search for “429”.</li>
<li><strong>Retry-After: true, 2 minutes</strong>The HTTP semantics standard defines Retry-After as either a number of seconds or an HTTP date.<sup>[4]</sup></li>
<li><strong>“Must wait 60 seconds”: fabricated</strong>RFC 6585 says the response may include Retry-After; it sets no fixed wait. The sentence borrowed the authority of a real document for a rule that isn't in it. This is the most dangerous kind of error: a real source, cited for something it doesn't say.</li>
<li><strong>Backoff with jitter: sound practice</strong>Exponential backoff with random jitter is widely recommended so that many clients don't retry at the same moment.<sup>[5]</sup> Lower risk: it is advice, not a factual claim about a spec.</li>
<li><strong>“Built-in app.rateLimit()”: fabricated</strong>Express has no built-in rate limiter; rate limiting usually comes from middleware such as the express-rate-limit package. The name is plausible because it follows Express's naming style, which is exactly why a model would produce it. Running the code would catch it in seconds.</li>
<li><strong>“GitHub returns 429”: partly true</strong>GitHub's documentation says exceeding the primary rate limit returns a 403 <em>or</em> a 429.<sup>[6]</sup> A client written on the assumption of 429 only would mishandle real responses. Half-true claims are hard to spot because the true half makes them feel checked.</li>
</ol>
<p>Notice the pattern. The risky sentences are the ones with <strong>specific names, numbers and rules</strong>. The general advice was fine. And the most efficient check, for the code claim, was simply running it.</p>

<h2>Agreeableness in practice</h2>
<p><a class="term" data-t="sycophancy">Sycophancy</a> is the tendency to go along with the user. Researchers found it across several assistants: they tended to match the user's stated beliefs, and sometimes changed a correct answer when the user expressed doubt.<sup>[2]</sup> It shows up most in questions that contain your hoped-for answer.</p>
<div class="draft prompt"><div class="draft-h"><span><b>Leading question</b></span></div><div class="draft-b">Our new onboarding flow is clearly working. Completion went from 61% to 64% last week. That's a solid win, right?</div></div>
<div class="draft"><div class="draft-h"><span><b>AI draft</b></span></div><div class="draft-b"><p>Yes, that's a meaningful improvement. A 3-point lift in completion suggests the new flow is reducing friction. Nice work, and worth sharing with the team.</p></div>
<div class="review"><div class="r"><span class="stamp bad">Agreed with the premise</span><span>It confirmed the conclusion it was handed. It has no idea whether 3 points is outside normal weekly variation.</span></div></div></div>
<div class="draft prompt"><div class="draft-h"><span><b>Neutral question</b></span></div><div class="draft-b">Onboarding completion went from 61% to 64% week over week, the week we launched a new flow. What would I need to know to judge whether the new flow caused this? What else could explain it?</div></div>
<div class="draft"><div class="draft-h"><span><b>AI draft</b></span></div><div class="draft-b"><p>You'd want: how much completion normally varies week to week; how many users each figure is based on; whether anything else changed (traffic sources, a marketing campaign, a holiday); and ideally a comparison group that saw the old flow in the same week. Without those, 61% to 64% may be noise.</p></div>
<div class="review"><div class="r"><span class="stamp ok">Useful</span><span>Gives you questions to answer from your own data. The judgment stays with you.</span></div></div></div>
<p>The neutral version doesn't make the model smarter. It removes the cue that the “right” answer is yes. Three habits help:</p>
<ul>
<li><strong>Leave your conclusion out of the question.</strong> Describe the situation and ask what follows.</li>
<li><strong>Ask for the opposing case.</strong> “What is the strongest argument that this is wrong?”</li>
<li><strong>Don't treat a reversal as evidence.</strong> If you say “are you sure?” and it changes its answer, you have learned about its agreeableness, not about the facts.</li>
</ul>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Rewrite a leading question</span></div><div class="activity-b">
<p>A delivery lead writes: <em>“The vendor's estimate of 6 weeks is obviously too optimistic for this migration, isn't it? Give me reasons to push back.”</em> Rewrite it so the assistant has to weigh both sides. Then compare with the example.</p>
<div class="w"><label for="lead-rewrite">Your rewrite</label><textarea id="lead-rewrite" placeholder="Describe the situation without your conclusion, then ask what would make the estimate realistic or unrealistic."></textarea></div>
<details class="reveal"><summary>Compare with an example rewrite</summary><div>
<p><em>“A vendor estimates 6 weeks to migrate our billing data (about 40 tables, 2 integrations, one team of 4). What factors would make that estimate realistic, and what would make it optimistic? What questions should I ask the vendor to tell which is the case?”</em></p>
<p>Check yours against three points: Did you remove “obviously too optimistic”? Did you give facts the model can reason about (size, team, scope)? Did you ask for both directions, or for questions to settle it? If all three, your version will get a more balanced answer.</p>
</div></details>
</div></div>

<h2>Signals that should raise your guard</h2>
<p>You can't check everything. These are the parts of an answer most worth your time:</p>
<ul>
<li>Specific <strong>numbers, dates, names, quotes and citations</strong>.</li>
<li><strong>Exact technical identifiers</strong>: function names, flags, endpoints, package names, version-specific behaviour.</li>
<li>Anything about <strong>recent events</strong> or anything that changes often: prices, regulations, product features.</li>
<li>Anything about <strong>your organisation</strong> that it could not have seen: “your team's process is…”.</li>
<li>Answers that <strong>confirm exactly what you hoped</strong>.</li>
<li><strong>Long chains of reasoning</strong> where one step depends on another.</li>
<li>Phrases like <em>“it's well known that”</em> or <em>“studies show”</em> without a named study.</li>
</ul>

<h2>Checks that don't work, and ones that do</h2>
<div class="tbl"><table>
<thead><tr><th>Tempting check</th><th>Why it fails</th><th>Better</th></tr></thead>
<tbody>
<tr><td>Ask “are you sure?”</td><td>Agreeableness: it may flip a right answer or double down on a wrong one.</td><td>Ask what in the material you gave supports the claim.</td></tr>
<tr><td>Ask it for a source</td><td>It can generate a realistic citation that doesn't exist, or a real one that doesn't say this.</td><td>Open the source and find the sentence.</td></tr>
<tr><td>It sounds detailed and confident</td><td>Fluency is cheap; detail is cheap.</td><td>Pick the most specific claim and verify it independently.</td></tr>
<tr><td>Regenerate and see if it agrees</td><td>Partial: disagreement signals guessing, but agreement doesn't prove truth. A common misconception gets repeated consistently.</td><td>Use as a warning light, then check with something outside the model.</td></tr>
<tr><td>Ask the model to critique its answer</td><td>Partial: it can surface real problems, but it can't certify correctness.</td><td>Use the critique as a list of things for you to check.</td></tr>
</tbody></table></div>
<p>What the good checks have in common: they compare against something <em>outside</em> the model. A standard, a test run, your data, a person who knows. Lesson 6 turns this into a method for deciding how much checking a result deserves.</p>

<h2>Why models make things up</h2>
<p>Research from 2025 offers a clear explanation of why fabrication persists even in capable models. Training and most evaluations reward a correct answer and give nothing for “I don't know”, so a model that guesses scores better on average than one that admits uncertainty. Like a student guessing on a multiple-choice exam, it learns to produce a confident answer rather than to abstain.[7] That's why fabricated details tend to look exactly like real ones: they're the most likely-looking answer to a question the model can't actually answer.</p>
<h2>Worked example: one answer, three failure types</h2>
<p>A developer asks: “How do I paginate results with the Acme Payments API in Python?” The assistant replies:</p>
<div class="draft"><div class="draft-h">AI answer</div><div class="draft-b"><p>Use the <code>acme.Charges.list_all()</code> helper, which handles pagination automatically. Pass <code>page_size=500</code> for best performance; the API's maximum is 1,000. This approach was recommended in the Acme v4 migration guide. As you said, cursor pagination is deprecated, so avoid <code>starting_after</code>.</p></div></div>
<div class="tbl"><table><thead><tr><th>Phrase</th><th>Failure type</th><th>How to check</th></tr></thead><tbody>
<tr><td><code>list_all()</code> helper</td><td>Fabrication: a plausible name that may not exist</td><td>Search the SDK source or docs for the exact name</td></tr>
<tr><td>Maximum of 1,000</td><td>Stale or invented specific</td><td>Check the current API reference; limits change between versions</td></tr>
<tr><td>“Recommended in the v4 migration guide”</td><td>Invented source</td><td>Open the guide and find the sentence</td></tr>
<tr><td>“As you said, cursor pagination is deprecated”</td><td>Agreeableness: it accepted your false premise</td><td>Did you say that? Is it true? Check the changelog</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Four sentences, four checkable claims.</strong> The prose around them is fine; the specifics carry the risk.</li>
<li><strong>The checks are cheap:</strong> a search, a page, a changelog. Two minutes, against an afternoon debugging code that calls a function that doesn't exist.</li>
<li><strong>The false premise is the subtlest.</strong> If you had wrongly said cursors were deprecated, the assistant would likely have agreed rather than corrected you.[2]</li>
</ul>
<h2>Your turn: mark the claims to check</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Find the claims you'd verify before sending this</span></div><div class="activity-b">
<p>An assistant drafted this reply to a customer: <em>“Thanks for reaching out. Your data is encrypted with AES-256 at rest and in transit, and we're SOC 2 Type II certified as of March. Our 99.99% uptime SLA covers all plans, so the outage last Tuesday qualifies for a service credit, which we've already applied to your account.”</em></p>
<p>List every claim you'd need to verify, who or what could confirm it, and which one is most dangerous if wrong.</p>
<div data-w="task" data-key="failure-claims">
<div class="task-model"><ul>
<li><strong>AES-256 at rest and in transit:</strong> security team or security documentation. (In transit usually means TLS, so the phrasing may be technically wrong.)</li>
<li><strong>SOC 2 Type II “as of March”:</strong> compliance owner; the date and report type both need checking.</li>
<li><strong>99.99% SLA on all plans:</strong> the contract or pricing page; SLAs often differ by plan.</li>
<li><strong>Outage qualifies for a credit:</strong> the SLA terms and the incident record.</li>
<li><strong>Credit “already applied”:</strong> the billing system.</li>
</ul><p><strong>Most dangerous:</strong> “already applied”. It states an action happened. If it didn't, you've misled the customer about money.</p></div>
<ul class="task-rubric">
<li>Found at least four separate checkable claims</li>
<li>Named a source or owner who can confirm each one</li>
<li>Noticed that a statement about an action taken needs a system record</li>
<li>Explained which claim is most dangerous and why</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Take one AI-assisted document you produced recently. Highlight every specific: names, numbers, dates, quotes, sources, API names, and statements that something was done. Check three of them. Note what you found, and how long it took.</div>
<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Newer models don't hallucinate any more.</dt><dd>They do it less on common questions, but the incentive to guess remains. Rare, recent and very specific facts are still risky.</dd>
<dt>If I ask “are you sure?”, it will catch its own mistakes.</dt><dd>It may change a correct answer just as easily as a wrong one. Check against a source, not against the model.</dd>
<dt>Fabrications are obviously strange.</dt><dd>They look exactly like real facts, because they're built from what real facts usually look like.</dd>
<dt>If it cites a source, the claim is supported.</dt><dd>Citations can be invented, or real but not say what's claimed. Open the source and find the sentence.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Models guess confidently because training rewards answers over “I don't know”.</li>
<li>Watch the specifics: names, numbers, dates, quotes, sources and claimed actions.</li>
<li>Agreeableness means a false premise in your question often comes back confirmed.</li>
<li>Asking the model to double-check isn't verification; a source is.</li>
<li>Checking a few specifics takes minutes and catches the errors that matter.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">Why do language models often produce a confident wrong answer instead of saying “I don't know”?</p><ul>
<li data-fb="There's no such rule; the behaviour comes from training incentives.">They are programmed never to admit uncertainty to users.</li>
<li data-fb="They don't know answers in that sense; they predict likely text.">They always know the answer but sometimes choose to hide it.</li>
<li data-fb="Right. A guess scores better on average than “I don't know”.">Training and evaluation reward guessing over abstaining.</li>
<li data-fb="Context size isn't the cause.">Their context window is too small to hold uncertainty.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Your question includes a false premise. What's the likely result?</p><ul>
<li data-fb="Right. Agreeableness makes models tend to go along with you.">The assistant accepts the premise and builds an answer on it.</li>
<li data-fb="Models rarely refuse on these grounds.">The assistant refuses to answer until you correct the premise.</li>
<li data-fb="It sometimes does, but you can't rely on it.">The assistant always spots and corrects the false premise.</li>
<li data-fb="It usually becomes confidently specific instead.">The answer becomes deliberately vague so it can't be wrong.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Which part of an AI answer most needs checking?</p><ul>
<li data-fb="Lower risk; general knowledge is where models are strongest.">The general explanation of how the concept works.</li>
<li data-fb="Structure rarely matters to correctness.">The headings and the order of the sections in the answer.</li>
<li data-fb="Pleasantries carry no claims.">The polite opening and closing sentences of the reply.</li>
<li data-fb="Right. Specifics are where fabrications hide and do damage.">Specific names, numbers, sources and claims that something was done.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">An assistant cites “the v4 migration guide” for a recommendation. What's the right check?</p><ul>
<li data-fb="A summary can be as invented as the citation.">Ask the assistant to summarise the guide in more detail.</li>
<li data-fb="Right. Only the source confirms the claim.">Open the guide and find the sentence that says it.</li>
<li data-fb="Invented titles sound real by design.">Check that the guide's title sounds like a real document.</li>
<li data-fb="A second model guessing isn't a source either.">Ask a second assistant whether the guide says this.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">A drafted reply says a refund “has already been applied”. Who or what can confirm it?</p><ul>
<li data-fb="It has no access to your billing system unless connected, and may guess.">The assistant, if you ask it to confirm the refund status.</li>
<li data-fb="Then the customer has already been misled.">The customer, who will notice if the refund is missing.</li>
<li data-fb="Right. Claims that an action happened need a system record.">The billing system's record of the transaction.</li>
<li data-fb="They can approve one, but the record shows whether it happened.">The support team lead who usually approves refunds.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Ji et al. (2023), <a href="https://arxiv.org/abs/2202.03629" target="_blank" rel="noopener">Survey of Hallucination in Natural Language Generation</a>. Types and causes of fabricated output.</li>
<li>Sharma et al. (2023), <a href="https://arxiv.org/abs/2310.13548" target="_blank" rel="noopener">Towards Understanding Sycophancy in Language Models</a>. Evidence that assistants match user beliefs, and that preference training contributes.</li>
<li>IETF, <a href="https://www.rfc-editor.org/rfc/rfc6585" target="_blank" rel="noopener">RFC 6585: Additional HTTP Status Codes</a>, section 4 defines 429 Too Many Requests.</li>
<li>IETF, <a href="https://www.rfc-editor.org/rfc/rfc9110#name-retry-after" target="_blank" rel="noopener">RFC 9110: HTTP Semantics, Retry-After</a>.</li>
<li>AWS Architecture Blog, <a href="https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/" target="_blank" rel="noopener">Exponential Backoff and Jitter</a>.</li>
<li>GitHub Docs, <a href="https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api" target="_blank" rel="noopener">Rate limits for the REST API</a>.</li>

<li>Kalai, Nachum, Vempala and Zhang, OpenAI (2025), <a href="https://openai.com/index/why-language-models-hallucinate/" target="_blank" rel="noopener">Why language models hallucinate</a>. How training and evaluation that reward guessing produce confident fabrication.</li>
<li><a href="https://en.wikipedia.org/wiki/Mata_v._Avianca,_Inc." target="_blank" rel="noopener">Mata v. Avianca, Inc.</a> (S.D.N.Y. 2023). The case in which lawyers were sanctioned for filing AI-invented citations.</li>
</ol></section>
`
});
