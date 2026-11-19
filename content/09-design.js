GW.lesson({
  id: "design",
  lede: "Design moves between exploring widely and deciding precisely. AI is a fast, tireless partner for exploring, and an unreliable judge of precise details. This lesson covers both sides.",
  outcomes: [
    "Use AI to widen the options early without letting it narrow your thinking.",
    "Brief AI for interface copy with real constraints, then evaluate the variants.",
    "Verify accessibility claims with a tool instead of trusting them.",
    "Recognise where AI-generated research and critique fall short."
  ],
  html: String.raw`
<h2>Where AI meets design work</h2>
<p>Remember from lesson 1 that a model produces the most plausible continuation, which means the most <em>typical</em> one. That makes it excellent at producing many competent options quickly, and pulls it toward the familiar. Distinctive, appropriate choices still come from understanding your users, which the model has never met.</p>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Exploring alternative flows and layouts</td><td><span class="fit good">Good fit</span></td><td>Cheap divergence. Ask for structurally different options; judge them against research.</td></tr>
<tr><td>Interface copy and microcopy variants</td><td><span class="fit good">Good fit</span></td><td>Many variants fast. Check length yourself, tone against your guide, and test with users.</td></tr>
<tr><td>Throwaway prototypes in code</td><td><span class="fit good">Good fit</span></td><td>Great for testing an interaction quickly. Not production code.</td></tr>
<tr><td>Design-system documentation</td><td><span class="fit good">Good fit</span></td><td>Turns component specs into consistent docs. Check against the real components.</td></tr>
<tr><td>Accessibility review</td><td><span class="fit care">Use with care</span></td><td>A useful first pass. Every claim needs checking with a tool, and it doesn't replace testing with assistive technology and disabled people.</td></tr>
<tr><td>Drafting alt text</td><td><span class="fit care">Use with care</span></td><td>Good alt text depends on why the image is there, which the model can only guess.<sup>[2]</sup></td></tr>
<tr><td>Summarising usability sessions</td><td><span class="fit care">Use with care</span></td><td>Same rules as research synthesis: quotes, IDs, counts (see the product lesson).</td></tr>
<tr><td>Heuristic critique of a design</td><td><span class="fit care">Use with care</span></td><td>Produces generic checklists confidently. You weigh what matters for your users.</td></tr>
<tr><td>Final visual direction; what's on-brand</td><td><span class="fit human">Keep human</span></td><td>Judgment rooted in brand, users and strategy.</td></tr>
<tr><td>AI “users” standing in for usability tests</td><td><span class="fit human">Keep human</span></td><td>Typical-sounding reactions, not evidence about your users.<sup>[3]</sup></td></tr>
</tbody></table></div>

<h2>Worked example: exploring options</h2>
<p>You're redesigning a settings area that has grown to 40 options across six tabs. Research shows people can't find notification settings, and admins and regular users need different things.</p>
<ol class="steps">
<li><strong>Sketch your own ideas first</strong>Spend ten minutes on your own options before asking. If you ask first, the AI's answers become the frame you think inside.</li>
<li><strong>Ask for structural difference, with trade-offs</strong>
<div class="draft prompt" style="margin:12px 0 0"><div class="draft-h"><span><b>Request</b></span></div><div class="draft-b">Context: a B2B scheduling app. Settings have grown to 40 options in 6 tabs. Research: users can't find notification settings; admins configure the workspace, regular users mostly change personal preferences.

Give me 5 structurally different ways to organise settings, not variations of tabs. For each: a one-paragraph description, who it suits best, and its main risk. Include at least one unconventional option.</div></div></li>
<li><strong>Compare against your own list</strong>Typical results: search-first settings, splitting personal and workspace settings, contextual settings next to the feature they affect, a task-based “what do you want to do?” page, progressive disclosure. Which did you already have? Which are new? Which ignore the admin/user split from your research?</li>
<li><strong>Evaluate against evidence, not eloquence</strong>Each option comes with a confident rationale. The research (people can't find notifications, two audiences) is what decides. Pick two or three to prototype and test.</li>
</ol>
<p>The value here is breadth in minutes. The risk is homogenisation: if everyone on a team asks for “a settings page layout”, everyone gets the same average answer. Bring your own ideas first and ask explicitly for the unusual.</p>

<h2>Worked example: error message copy</h2>
<p>In lesson 5 you practised briefing for a payment-failure message. Here's what evaluating the result looks like. Three variants came back:</p>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · payment failure message, 3 variants</span></div><div class="draft-b">
<p><b>A.</b> “Your payment didn't go through. Check your card details or try another card. Your basket is saved for 30 minutes.” <i>Button: Try again</i></p>
<p><b>B.</b> “Oops! Something went wrong with your payment. Please try again later.” <i>Button: OK</i></p>
<p><b>C.</b> “We couldn't take payment from this card. Your bank may have declined it. Try another card, or contact your bank.” <i>Button: Use another card</i></p></div>
<div class="review">
<div class="r"><span class="stamp ok">A: strong</span><span>Says what happened, what to do and the reassurance about the basket. Check: is “check your card details” blaming, given we often can't tell the cause?</span></div>
<div class="r"><span class="stamp bad">B: reject</span><span>Breaks the brief: “try again later” with no action, and an “OK” button that leads nowhere. Typical error copy, which is why it appeared.</span></div>
<div class="r"><span class="stamp ok">C: strong</span><span>Honest about uncertainty. Check the length: it may wrap to four lines on a small phone.</span></div>
<div class="r"><span class="stamp info">For all</span><span>Count characters yourself (models are unreliable at counting, lesson 1). Leave room for translations, which are often longer. Make sure the error is announced to screen readers and isn't shown by colour alone.</span></div>
</div></div>
<p>Then do what you'd do with any copy: check it against the content style guide, and test the top two with real users if the flow matters.</p>

<h2>Accessibility claims need measuring</h2>
<p>AI tools are increasingly used to review designs and code for accessibility. They often catch real issues: missing labels, low contrast, unclear link text. They also state numbers and rules with total confidence, and some of those are wrong. <a class="term" data-t="contrast-ratio">Contrast ratios</a> are a good example, because they're precise, checkable and easy to get wrong. <a class="term" data-t="wcag">WCAG</a> level AA requires at least 4.5:1 for normal text and 3:1 for large text.<sup>[1]</sup></p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Measure the AI's accessibility review</span></div><div class="activity-b">
<p>An assistant reviewed your colour palette. For each claim, decide whether you'd accept it, then measure it. The calculator uses the WCAG formula, so it's the independent check.</p>
<div data-w="contrast"></div>
</div></div>
<p>Contrast is one of the few accessibility criteria that can be fully measured. Most others (whether focus order makes sense, whether a screen reader user can complete the task, whether instructions are understandable) need people to test. AI review is a first pass that reduces obvious issues before that testing, not a substitute for it.</p>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>The average answer.</strong> Generated layouts, copy and images gravitate to the common. Fine for utility, a problem for anything that should feel like your product.</li>
<li><strong>Confident critique.</strong> A heuristic review reads like expert feedback. Weigh each point against your users; discard the generic ones.</li>
<li><strong>Prototype code in production.</strong> Code generated for a quick prototype often skips accessibility, error states and edge cases. Hand engineering the idea, not the code, unless they've reviewed it.</li>
<li><strong>Generated images and icons.</strong> Check your organisation's policy on licensing and use of generated imagery before it ships.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take one screen you're working on. Write your own three alternative approaches, then ask an assistant for five structurally different ones with trade-offs. Count how many of its options were new to you, and how many conflicted with something you know about your users. Both numbers are useful.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">An AI review says your button text colour “passes WCAG AA at 4.6:1”. What's the right move?</p><ul>
<li data-fb="Right. A ratio is precisely measurable, so measure it. It takes seconds and catches confident miscalculations.">Measure it with a contrast checker before relying on it.</li>
<li data-fb="Specific numbers are where fabrications and slips hide.">Accept it; a specific number suggests it was calculated.</li>
<li data-fb="Its general accessibility suggestions are often useful; just measure the measurable ones.">Ignore the review; AI can't help with accessibility.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why sketch your own ideas before asking an AI for layout options?</p><ul>
<li data-fb="It doesn't remember your ideas unless you include them.">So the AI can learn your style.</li>
<li data-fb="Right. Once you've seen its typical options, they frame your thinking. Your own first ideas keep the exploration wider.">The AI's answers anchor your thinking, and its options lean toward the typical.</li>
<li data-fb="There's no such rule.">AI tools require a sketch as input.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>W3C, <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noopener">Understanding Success Criterion 1.4.3: Contrast (Minimum)</a>. The ratios, the formula and what counts as large text.</li>
<li>W3C WAI, <a href="https://www.w3.org/WAI/tutorials/images/decision-tree/" target="_blank" rel="noopener">An alt Decision Tree</a>. Why alt text depends on the image's purpose.</li>
<li>Nielsen Norman Group, <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users</a>.</li>
</ol></section>
`
});
