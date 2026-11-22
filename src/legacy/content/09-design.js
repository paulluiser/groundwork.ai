GW.lesson({
  id: "design",
  reviewed: "2026-11",
  lede: "Design moves between exploring widely and deciding precisely. AI is a fast, tireless partner for exploring, and an unreliable judge of precise details. This lesson covers both sides.",
  outcomes: [
    "Use AI to widen the options early without letting it narrow your thinking.",
    "Brief AI for interface copy with real constraints, then evaluate the variants.",
    "Verify accessibility claims with a tool instead of trusting them.",
    "Recognise where AI-generated research and critique fall short.",
    "Run a heuristic review with AI help, and decide which findings to keep."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>You have two days to explore a new onboarding flow. An assistant can produce thirty headline options, eight layout ideas and a full set of empty-state copy before lunch. It can also tell you, confidently, that your palette meets contrast requirements and that your alt text is “fully accessible”.</p>
<p>The first set of outputs is where AI shines for designers. The second is where it can quietly put your work below the legal accessibility bar. This lesson helps you use the first and verify the second.</p></div>
<div class="check warmup" data-a="2"><p class="q">An assistant says your button text colour “passes WCAG AA contrast”. What should you do?</p><ul>
<li data-fb="Documented rules don't mean it calculated your colours correctly.">Accept it, since contrast rules are widely documented online.</li>
<li data-fb="An explanation can be as wrong as the number.">Ask it to explain how it calculated the ratio, then accept it.</li>
<li data-fb="Right. Contrast is a calculation you can do exactly.">Measure the actual colours with a contrast checker.</li>
<li data-fb="It may well pass; measure before changing it.">Change the colour anyway, since AI can't judge accessibility.</li>
</ul></div>
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

<h2>Heuristic reviews with AI help</h2>
<p>Jakob Nielsen's ten usability heuristics, such as visibility of system status, error prevention and recognition rather than recall, remain the most widely used checklist for a quick expert review.[4] An assistant is a useful second reviewer: give it a screenshot or a description of a flow, ask it to list possible issues against each heuristic, and to say for each how confident it is and what evidence on the screen supports it. Then do your own pass before reading its list, so you aren't anchored by it.</p>
<h2>Worked example: sorting an AI heuristic review</h2>
<p>You share a screenshot of a checkout step. The assistant returns eight findings. Here's how three of them sort out.</p>
<div class="tbl"><table><thead><tr><th>AI finding</th><th>Your verdict</th><th>Why</th></tr></thead><tbody>
<tr><td>“No indication of how many steps remain in checkout.”</td><td>Keep</td><td>Visible on the screen; matches visibility of system status</td></tr>
<tr><td>“The promo code field may cause users to leave to search for codes.”</td><td>Keep as a hypothesis</td><td>A known pattern; test it with analytics or users before acting</td></tr>
<tr><td>“The error message for invalid cards is unclear.”</td><td>Discard</td><td>The screenshot shows no error state. The model described a typical checkout, not yours</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Keep findings tied to what's on the screen.</strong> Ask “where do you see this?” for each one.</li>
<li><strong>Treat pattern-based findings as hypotheses.</strong> They're often right in general and unproven for your users.</li>
<li><strong>Discard findings about things it couldn't see.</strong> They're the design equivalent of a fabricated citation.</li>
</ul>
<h2>Accessibility: what AI can and can't check</h2>
<p>WCAG 2.2 is the current W3C standard most accessibility laws point to.[5] Some of its criteria are calculations (contrast ratios, target sizes) that a tool can measure exactly; some need judgement (whether alt text conveys the image's purpose); and some need real use (keyboard order, screen reader behaviour). AI can draft alt text, suggest focus order and flag likely problems. It can't measure, and it can't use your product with a screen reader. Measure what's measurable with proper tools, and test the rest with assistive technology and, ideally, disabled users.</p>
<h2>Your turn: write alt text with purpose</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Fix AI-drafted alt text</span></div><div class="activity-b">
<p>An assistant drafted alt text for three images on a pricing page: (1) the company logo in the header, linking home: <em>“Colourful company logo with blue and green shapes”</em>; (2) a decorative wave graphic between sections: <em>“Abstract blue wave background design”</em>; (3) a chart comparing plan prices: <em>“Bar chart showing pricing”</em>. Rewrite each, and say why.</p>
<div data-w="task" data-key="design-alt">
<div class="task-model"><ol>
<li><strong>Logo linking home:</strong> “Kern home”. The image is a link, so the alt text describes where it goes, not how it looks.</li>
<li><strong>Decorative wave:</strong> empty alt (<code>alt=""</code>). It carries no information, so screen readers should skip it.</li>
<li><strong>Pricing chart:</strong> “Monthly price per seat: Starter $8, Team $15, Business $24.” Or a short alt with the numbers in a table next to it. The purpose is the comparison, so the data must be available.</li>
</ol></div>
<ul class="task-rubric">
<li>Describes the link's destination for the linked logo</li>
<li>Uses empty alt for the purely decorative image</li>
<li>Gives the chart's actual information, not just “a chart”</li>
<li>Explains each choice by the image's purpose rather than its appearance</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>The average answer.</strong> Generated layouts, copy and images gravitate to the common. Fine for utility, a problem for anything that should feel like your product.</li>
<li><strong>Confident critique.</strong> A heuristic review reads like expert feedback. Weigh each point against your users; discard the generic ones.</li>
<li><strong>Prototype code in production.</strong> Code generated for a quick prototype often skips accessibility, error states and edge cases. Hand engineering the idea, not the code, unless they've reviewed it.</li>
<li><strong>Generated images and icons.</strong> Check your organisation's policy on licensing and use of generated imagery before it ships.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take one screen you're working on. Write your own three alternative approaches, then ask an assistant for five structurally different ones with trade-offs. Count how many of its options were new to you, and how many conflicted with something you know about your users. Both numbers are useful.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI can confirm a design is accessible.</dt><dd>It can flag likely issues. Conformance needs measurement and testing with assistive technology.</dd>
<dt>More AI-generated options means better exploration.</dt><dd>Volume tends toward the typical. Use AI for range, then push the interesting options further yourself.</dd>
<dt>An AI heuristic review replaces a usability test.</dt><dd>It finds possible issues an expert might spot. Only users show you which ones matter.</dd>
<dt>Good alt text describes everything in the image.</dt><dd>Good alt text conveys the image's purpose in context; decorative images need none.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Use AI to widen exploration; make the precise decisions yourself.</li>
<li>Ask AI reviewers where on the screen each finding is, and discard what they couldn't see.</li>
<li>Measure contrast and sizes with tools; test keyboard and screen readers for real.</li>
<li>Write alt text for purpose: destination for links, nothing for decoration, data for charts.</li>
<li>Treat pattern-based findings as hypotheses to test with users.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An AI review of your screenshot says “the invalid card error is unclear”, but the screenshot shows no error state. What should you do?</p><ul>
<li data-fb="That's a general pattern, not a finding about your design.">Keep it, because invalid card errors are often unclear in checkouts.</li>
<li data-fb="Right. It described a typical checkout, not yours.">Discard it, since it describes something the model couldn't see.</li>
<li data-fb="There's no error message on the screen to rewrite.">Ask the assistant to rewrite the error message for you.</li>
<li data-fb="It isn't grounded in your design at all.">Escalate it as a high-priority accessibility issue.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Which accessibility criterion can a tool measure exactly?</p><ul>
<li data-fb="Needs human judgement about context.">Whether alt text conveys the purpose of an image.</li>
<li data-fb="Needs testing with assistive technology.">Whether the reading order makes sense with a screen reader.</li>
<li data-fb="Needs judgement, ideally with users.">Whether error messages are easy to understand.</li>
<li data-fb="Right. Contrast is a formula on the two colours.">Whether text meets the minimum contrast ratio.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What's the right alt text for a purely decorative divider image?</p><ul>
<li data-fb="Right. Decoration carries no information.">Empty alt text, so screen readers skip the image.</li>
<li data-fb="That adds noise for screen reader users.">A short description of its colours, shapes and position.</li>
<li data-fb="Announcing decoration still interrupts users.">The word “decorative” so users know what it is.</li>
<li data-fb="File names are meaningless to users.">The file name of the image, for reference.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">When should you read the AI's heuristic findings?</p><ul>
<li data-fb="Reading first anchors you to its list.">Before looking at the design, to know what to focus on.</li>
<li data-fb="Then you lose the findings only you would see.">Instead of reviewing it yourself, to save time.</li>
<li data-fb="Right. You avoid anchoring and gain a second view.">After your own pass, as a second reviewer.</li>
<li data-fb="A second view is useful either way.">Only if your own review found no issues at all.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Which standard do most accessibility laws point to today?</p><ul>
<li data-fb="That's about quality management, not accessibility.">The ISO 9001 quality management standard.</li>
<li data-fb="Right. WCAG 2.x is the common reference.">The W3C's Web Content Accessibility Guidelines (WCAG).</li>
<li data-fb="Useful guidance, but not the legal reference.">Google's Material Design accessibility guidance pages.</li>
<li data-fb="Valuable for usability, not an accessibility standard.">Nielsen's ten usability heuristics.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>W3C, <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noopener">Understanding Success Criterion 1.4.3: Contrast (Minimum)</a>. The ratios, the formula and what counts as large text.</li>
<li>W3C WAI, <a href="https://www.w3.org/WAI/tutorials/images/decision-tree/" target="_blank" rel="noopener">An alt Decision Tree</a>. Why alt text depends on the image's purpose.</li>
<li>Nielsen Norman Group, <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users</a>.</li>

<li>Jakob Nielsen, Nielsen Norman Group, <a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener">10 Usability Heuristics for User Interface Design</a>.</li>
<li>W3C, <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener">WCAG 2 Overview</a>. The current Web Content Accessibility Guidelines and how they’re organised.</li>
</ol></section>
`
});
