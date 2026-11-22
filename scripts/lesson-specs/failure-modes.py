SPEC = dict(
file="03-failure-modes.js",
reviewed="2026-11",
situation="""<p>In 2023, lawyers in a New York case filed a brief citing six court decisions that did not exist. An assistant had produced them, complete with case names, quotations and page numbers, and confirmed they were real when asked. The court sanctioned the lawyers.[S2]</p>
<p>The lawyers weren't careless people; the citations looked exactly like real ones. This lesson is about recognising the shapes that errors take, so you check in the right places before something like that reaches a customer, a release or a court.</p>""",
warmup=dict(q="You ask an assistant whether a citation it gave you is real. It says yes. What does that tell you?", a=3, opts=[
  ("The citation is real, since the assistant has now double-checked it.", "Asking again isn't checking; it generates another likely answer."),
  ("The citation is probably real, because assistants rarely contradict themselves.", "Consistency with its earlier answer is exactly the risk."),
  ("The citation is fake, since an assistant that's unsure would refuse to answer.", "It may be real or fake; the answer just doesn't tell you which."),
  ("Very little: you need to find the source yourself.", "Right. Only the source itself can confirm a citation."),
 ]),
sections="""<h2>Why models make things up</h2>
<p>Research from 2025 offers a clear explanation of why fabrication persists even in capable models. Training and most evaluations reward a correct answer and give nothing for “I don't know”, so a model that guesses scores better on average than one that admits uncertainty. Like a student guessing on a multiple-choice exam, it learns to produce a confident answer rather than to abstain.[S1] That's why fabricated details tend to look exactly like real ones: they're the most likely-looking answer to a question the model can't actually answer.</p>
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
<div class="aside"><strong>A 20-minute exercise.</strong> Take one AI-assisted document you produced recently. Highlight every specific: names, numbers, dates, quotes, sources, API names, and statements that something was done. Check three of them. Note what you found, and how long it took.</div>""",
myths=[
 ("Newer models don't hallucinate any more.", "They do it less on common questions, but the incentive to guess remains. Rare, recent and very specific facts are still risky."),
 ("If I ask “are you sure?”, it will catch its own mistakes.", "It may change a correct answer just as easily as a wrong one. Check against a source, not against the model."),
 ("Fabrications are obviously strange.", "They look exactly like real facts, because they're built from what real facts usually look like."),
 ("If it cites a source, the claim is supported.", "Citations can be invented, or real but not say what's claimed. Open the source and find the sentence."),
],
recap=[
 "Models guess confidently because training rewards answers over “I don't know”.",
 "Watch the specifics: names, numbers, dates, quotes, sources and claimed actions.",
 "Agreeableness means a false premise in your question often comes back confirmed.",
 "Asking the model to double-check isn't verification; a source is.",
 "Checking a few specifics takes minutes and catches the errors that matter.",
],
checks=[
 dict(q="Why do language models often produce a confident wrong answer instead of saying “I don't know”?", a=2, opts=[
  ("They are programmed never to admit uncertainty to users.", "There's no such rule; the behaviour comes from training incentives."),
  ("They always know the answer but sometimes choose to hide it.", "They don't know answers in that sense; they predict likely text."),
  ("Training and evaluation reward guessing over abstaining.", "Right. A guess scores better on average than “I don't know”."),
  ("Their context window is too small to hold uncertainty.", "Context size isn't the cause."),
 ]),
 dict(q="Your question includes a false premise. What's the likely result?", a=0, opts=[
  ("The assistant accepts the premise and builds an answer on it.", "Right. Agreeableness makes models tend to go along with you."),
  ("The assistant refuses to answer until you correct the premise.", "Models rarely refuse on these grounds."),
  ("The assistant always spots and corrects the false premise.", "It sometimes does, but you can't rely on it."),
  ("The answer becomes deliberately vague so it can't be wrong.", "It usually becomes confidently specific instead."),
 ]),
 dict(q="Which part of an AI answer most needs checking?", a=3, opts=[
  ("The general explanation of how the concept works.", "Lower risk; general knowledge is where models are strongest."),
  ("The headings and the order of the sections in the answer.", "Structure rarely matters to correctness."),
  ("The polite opening and closing sentences of the reply.", "Pleasantries carry no claims."),
  ("Specific names, numbers, sources and claims that something was done.", "Right. Specifics are where fabrications hide and do damage."),
 ]),
 dict(q="An assistant cites “the v4 migration guide” for a recommendation. What's the right check?", a=1, opts=[
  ("Ask the assistant to summarise the guide in more detail.", "A summary can be as invented as the citation."),
  ("Open the guide and find the sentence that says it.", "Right. Only the source confirms the claim."),
  ("Check that the guide's title sounds like a real document.", "Invented titles sound real by design."),
  ("Ask a second assistant whether the guide says this.", "A second model guessing isn't a source either."),
 ]),
 dict(q="A drafted reply says a refund “has already been applied”. Who or what can confirm it?", a=2, opts=[
  ("The assistant, if you ask it to confirm the refund status.", "It has no access to your billing system unless connected, and may guess."),
  ("The customer, who will notice if the refund is missing.", "Then the customer has already been misled."),
  ("The billing system's record of the transaction.", "Right. Claims that an action happened need a system record."),
  ("The support team lead who usually approves refunds.", "They can approve one, but the record shows whether it happened."),
 ]),
],
sources=[
 'Kalai, Nachum, Vempala and Zhang, OpenAI (2025), <a href="https://openai.com/index/why-language-models-hallucinate/" target="_blank" rel="noopener">Why language models hallucinate</a>. How training and evaluation that reward guessing produce confident fabrication.',
 '<a href="https://en.wikipedia.org/wiki/Mata_v._Avianca,_Inc." target="_blank" rel="noopener">Mata v. Avianca, Inc.</a> (S.D.N.Y. 2023). The case in which lawyers were sanctioned for filing AI-invented citations.',
],
)
