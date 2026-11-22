SPEC = dict(
file="09-design.js",
reviewed="2026-11",
outcomes=["Run a heuristic review with AI help, and decide which findings to keep."],
situation="""<p>You have two days to explore a new onboarding flow. An assistant can produce thirty headline options, eight layout ideas and a full set of empty-state copy before lunch. It can also tell you, confidently, that your palette meets contrast requirements and that your alt text is “fully accessible”.</p>
<p>The first set of outputs is where AI shines for designers. The second is where it can quietly put your work below the legal accessibility bar. This lesson helps you use the first and verify the second.</p>""",
warmup=dict(q="An assistant says your button text colour “passes WCAG AA contrast”. What should you do?", a=2, opts=[
  ("Accept it, since contrast rules are widely documented online.", "Documented rules don't mean it calculated your colours correctly."),
  ("Ask it to explain how it calculated the ratio, then accept it.", "An explanation can be as wrong as the number."),
  ("Measure the actual colours with a contrast checker.", "Right. Contrast is a calculation you can do exactly."),
  ("Change the colour anyway, since AI can't judge accessibility.", "It may well pass; measure before changing it."),
 ]),
sections="""<h2>Heuristic reviews with AI help</h2>
<p>Jakob Nielsen's ten usability heuristics, such as visibility of system status, error prevention and recognition rather than recall, remain the most widely used checklist for a quick expert review.[S1] An assistant is a useful second reviewer: give it a screenshot or a description of a flow, ask it to list possible issues against each heuristic, and to say for each how confident it is and what evidence on the screen supports it. Then do your own pass before reading its list, so you aren't anchored by it.</p>
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
<p>WCAG 2.2 is the current W3C standard most accessibility laws point to.[S2] Some of its criteria are calculations (contrast ratios, target sizes) that a tool can measure exactly; some need judgement (whether alt text conveys the image's purpose); and some need real use (keyboard order, screen reader behaviour). AI can draft alt text, suggest focus order and flag likely problems. It can't measure, and it can't use your product with a screen reader. Measure what's measurable with proper tools, and test the rest with assistive technology and, ideally, disabled users.</p>
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
</div></div></div>""",
myths=[
 ("AI can confirm a design is accessible.", "It can flag likely issues. Conformance needs measurement and testing with assistive technology."),
 ("More AI-generated options means better exploration.", "Volume tends toward the typical. Use AI for range, then push the interesting options further yourself."),
 ("An AI heuristic review replaces a usability test.", "It finds possible issues an expert might spot. Only users show you which ones matter."),
 ("Good alt text describes everything in the image.", "Good alt text conveys the image's purpose in context; decorative images need none."),
],
recap=[
 "Use AI to widen exploration; make the precise decisions yourself.",
 "Ask AI reviewers where on the screen each finding is, and discard what they couldn't see.",
 "Measure contrast and sizes with tools; test keyboard and screen readers for real.",
 "Write alt text for purpose: destination for links, nothing for decoration, data for charts.",
 "Treat pattern-based findings as hypotheses to test with users.",
],
checks=[
 dict(q="An AI review of your screenshot says “the invalid card error is unclear”, but the screenshot shows no error state. What should you do?", a=1, opts=[
  ("Keep it, because invalid card errors are often unclear in checkouts.", "That's a general pattern, not a finding about your design."),
  ("Discard it, since it describes something the model couldn't see.", "Right. It described a typical checkout, not yours."),
  ("Ask the assistant to rewrite the error message for you.", "There's no error message on the screen to rewrite."),
  ("Escalate it as a high-priority accessibility issue.", "It isn't grounded in your design at all."),
 ]),
 dict(q="Which accessibility criterion can a tool measure exactly?", a=3, opts=[
  ("Whether alt text conveys the purpose of an image.", "Needs human judgement about context."),
  ("Whether the reading order makes sense with a screen reader.", "Needs testing with assistive technology."),
  ("Whether error messages are easy to understand.", "Needs judgement, ideally with users."),
  ("Whether text meets the minimum contrast ratio.", "Right. Contrast is a formula on the two colours."),
 ]),
 dict(q="What's the right alt text for a purely decorative divider image?", a=0, opts=[
  ("Empty alt text, so screen readers skip the image.", "Right. Decoration carries no information."),
  ("A short description of its colours and shapes.", "That adds noise for screen reader users."),
  ("The word “decorative” so users know what it is.", "Announcing decoration still interrupts users."),
  ("The file name of the image, for reference.", "File names are meaningless to users."),
 ]),
 dict(q="When should you read the AI's heuristic findings?", a=2, opts=[
  ("Before looking at the design, to know what to focus on.", "Reading first anchors you to its list."),
  ("Instead of reviewing it yourself, to save time.", "Then you lose the findings only you would see."),
  ("After your own pass, as a second reviewer.", "Right. You avoid anchoring and gain a second view."),
  ("Only if your own review found no issues at all.", "A second view is useful either way."),
 ]),
 dict(q="Which standard do most accessibility laws point to today?", a=1, opts=[
  ("The ISO 9001 quality management standard.", "That's about quality management, not accessibility."),
  ("The W3C's Web Content Accessibility Guidelines (WCAG).", "Right. WCAG 2.x is the common reference."),
  ("Google's Material Design accessibility pages.", "Useful guidance, but not the legal reference."),
  ("Nielsen's ten usability heuristics.", "Valuable for usability, not an accessibility standard."),
 ]),
],
sources=[
 'Jakob Nielsen, Nielsen Norman Group, <a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener">10 Usability Heuristics for User Interface Design</a>.',
 'W3C, <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener">WCAG 2 Overview</a>. The current Web Content Accessibility Guidelines and how they’re organised.',
],
)
