GW.lesson({
  id: "failure-modes",
  lede: "AI output goes wrong in a handful of recognisable ways. Each one follows from how models work, and each one has a check that catches it.",
  outcomes: [
    "Name five common failure modes and explain why each happens.",
    "Tell the difference between confident text and supported text.",
    "Pick out the claims in an AI answer that need checking, and choose a quick check for each.",
    "Ask questions in a way that makes agreeable-but-wrong answers less likely."
  ],
  html: String.raw`
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

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">An assistant supports a recommendation with a citation: authors, year, journal and title. What should you do before repeating it?</p><ul>
<li data-fb="Detail is easy to generate. A complete-looking citation can still be invented.">Nothing; a full citation with authors and year is reliable.</li>
<li data-fb="It may confirm an invented source, or apologise and invent a new one. Either way you've learned nothing independent.">Ask the assistant whether the citation is real.</li>
<li data-fb="Right. Confirm the source exists, then confirm it actually supports the claim. Real sources cited for things they don't say are common.">Find the paper and check that it says what the answer claims.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">You tell the assistant “I think that's wrong” and it immediately agrees and gives the opposite answer. What have you learned?</p><ul>
<li data-fb="A quick reversal is consistent with agreeableness, whichever answer was right.">That the second answer is correct.</li>
<li data-fb="Right. Assistants tend to yield to pushback. Settle it with a source, a test or your data.">Very little about the facts; you need an outside check.</li>
<li data-fb="Not necessarily; it may have been right and given way to you.">That the first answer was a fabrication.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Which sentence from an AI code review most needs verifying?</p><ul>
<li data-fb="General style advice; low risk and easy to judge yourself.">“Consider a more descriptive name than <code>data2</code>.”</li>
<li data-fb="Right: a specific, version-dependent claim about a library, exactly where stale or invented knowledge shows up. Check the changelog.">“Version 4.2 of this library removed the <code>timeout</code> option, so this call will silently ignore it.”</li>
<li data-fb="Reasonable general advice you can judge on its merits.">“Adding a test for the empty-list case would make this safer.”</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Ji et al. (2023), <a href="https://arxiv.org/abs/2202.03629" target="_blank" rel="noopener">Survey of Hallucination in Natural Language Generation</a>. Types and causes of fabricated output.</li>
<li>Sharma et al. (2023), <a href="https://arxiv.org/abs/2310.13548" target="_blank" rel="noopener">Towards Understanding Sycophancy in Language Models</a>. Evidence that assistants match user beliefs, and that preference training contributes.</li>
<li>IETF, <a href="https://www.rfc-editor.org/rfc/rfc6585" target="_blank" rel="noopener">RFC 6585: Additional HTTP Status Codes</a>, section 4 defines 429 Too Many Requests.</li>
<li>IETF, <a href="https://www.rfc-editor.org/rfc/rfc9110#name-retry-after" target="_blank" rel="noopener">RFC 9110: HTTP Semantics, Retry-After</a>.</li>
<li>AWS Architecture Blog, <a href="https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/" target="_blank" rel="noopener">Exponential Backoff and Jitter</a>.</li>
<li>GitHub Docs, <a href="https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api" target="_blank" rel="noopener">Rate limits for the REST API</a>.</li>
</ol></section>
`
});
