SPEC = dict(
file="13b-3-support-assistant.js",
reviewed="2026-11",
outcomes=["Write the scope for a support assistant: what it answers, what it hands over, and how it says no."],
situation="""<p>Leadership wants the support assistant live on the website next month, answering “anything customers ask”. You've seen what happened when a city's business chatbot told owners they could take workers' tips and refuse tenants with housing vouchers, both illegal.[1] You'd like your launch to go differently.</p>
<p>The most important design decision for a customer-facing assistant isn't the model. It's the scope: what it may answer, what it must hand to a person, and how it says so. This lesson is about writing that scope and testing it before customers do.</p>""",
warmup=dict(q="Which is the best first scope for a customer-facing support assistant?", a=1, opts=[
  ("Anything customers ask, so they never have to wait for a person to reply.", "Unbounded scope is where harmful answers come from."),
  ("Questions answered in the published help centre, with handover for the rest.", "Right. Grounded answers, clear limits."),
  ("Refunds and billing disputes, since those are the most common tickets.", "High-stakes, policy-heavy: hand those to people first."),
  ("Only greetings and routing, so it can never be wrong about anything.", "Too narrow to be useful."),
 ]),
sections="""<h2>Worked example: a scope document</h2>
<div class="tbl"><table><thead><tr><th>Category</th><th>Assistant does</th><th>Example</th></tr></thead><tbody>
<tr><td>Answer</td><td>Answers from published articles, linking the source</td><td>How do I export a report?</td></tr>
<tr><td>Act with confirmation</td><td>Performs a low-risk action after the customer confirms</td><td>Resend my invoice by email</td></tr>
<tr><td>Hand over</td><td>Collects details and passes to a person, saying so</td><td>Refunds, cancellations, complaints, account access, anything legal</td></tr>
<tr><td>Decline</td><td>Says it can't help with this, and where to go</td><td>Legal or tax advice; questions about other customers</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Money, access and complaints go to people.</strong> These are where wrong answers cost most and where customers most want a person.</li>
<li><strong>Handover is explicit:</strong> “I'm passing this to our billing team, who reply within 4 working hours.” Customers accept handover; they don't accept being misled.</li>
<li><strong>Scope is enforced in the system:</strong> the assistant has no refund tool at all, rather than an instruction not to use one.</li>
</ul>
<h2>Testing before launch</h2>
<p>Before launch, run the assistant on a few hundred real past questions and have agents grade the answers against the scope: correct and grounded, correctly handed over, or wrong. Add adversarial tests: customers asking for refunds in creative ways, asking about other customers, or trying to get it to promise something. The launch decision follows the release gate approach from lesson 20.</p>
<h2>Your turn: write the scope</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Scope for an assistant in your product</span></div><div class="activity-b">
<p>Write the scope for a customer-facing assistant for a product you know (or a project management tool). List what it answers, what it does with confirmation, what it hands over and what it declines, with one example each, plus the handover message customers see.</p>
<div data-w="task" data-key="support-scope">
<div class="task-model"><ul>
<li><strong>Answer:</strong> how-to questions from the help centre, with a link. Example: “How do I add a custom field?”</li>
<li><strong>Act with confirmation:</strong> resend an invite; change notification settings. Example: “Resend the invite to sam@…”</li>
<li><strong>Hand over:</strong> billing changes, refunds, data deletion, security concerns, complaints. Example: “I was charged twice.”</li>
<li><strong>Decline:</strong> questions about other workspaces; legal advice. Example: “Is my competitor using your product?”</li>
</ul>
<p><strong>Handover message:</strong> “This needs our billing team. I've passed on what you told me, so you won't need to repeat it. They reply within 4 working hours by email.”</p></div>
<ul class="task-rubric">
<li>Answers are limited to published, linkable sources</li>
<li>Money, access, deletion and complaints are handed to people</li>
<li>Actions require customer confirmation</li>
<li>Declines say where else to go</li>
<li>The handover message sets expectations and avoids repetition</li>
</ul>
</div></div></div>""",
myths=[
 ("A good system prompt keeps the assistant in scope.", "Prompts guide; they don't enforce. Don't give it tools or data outside scope."),
 ("Customers prefer an assistant that never hands over.", "They prefer correct answers. A fast, honest handover beats a confident wrong answer."),
 ("Launch broad and narrow the scope if problems appear.", "Problems appear as harm to customers. Launch narrow and widen with evidence."),
 ("If it passed testing, it's safe forever.", "Policies, products and models change. Keep sampling conversations after launch."),
],
recap=[
 "Scope is the most important design decision for a support assistant.",
 "Answer from published sources; hand money, access and complaints to people.",
 "Enforce scope in the system: no tools or data outside it.",
 "Test on real past questions and adversarial cases before launch.",
 "Handover messages should set expectations and carry context.",
],
checks=[
 dict(q="How should a support assistant's scope be enforced?", a=2, opts=[
  ("Through a detailed system prompt listing everything it mustn't discuss.", "Prompts can be bypassed."),
  ("Through customer feedback after each conversation finishes.", "Too late to prevent harm."),
  ("By not giving it tools or data outside its scope.", "Right. It can't do what it has no means to do."),
  ("Through weekly reviews of a sample of conversations.", "Useful monitoring, but not enforcement."),
 ]),
 dict(q="A customer asks the assistant for a refund. What should it do?", a=0, opts=[
  ("Collect the details and hand over to a person, saying so.", "Right. Money decisions go to people."),
  ("Process the refund if it's within the policy period stated in the help centre.", "It shouldn't hold refund authority."),
  ("Explain the refund policy and close the conversation.", "Leaves the customer without help."),
  ("Offer a discount on the next payment instead of a refund.", "An invented offer is worse than none."),
 ]),
 dict(q="What did the NYC business chatbot case show?", a=3, opts=[
  ("Government chatbots are more accurate than commercial ones.", "It showed the opposite."),
  ("Chatbots should only be launched by private companies.", "Not the lesson."),
  ("Customers can't tell chatbots apart from human agents.", "Not the finding."),
  ("An assistant answering beyond reliable sources can give unlawful advice.", "Right. It told businesses to break the law."),
 ]),
 dict(q="What should a good handover message include?", a=1, opts=[
  ("An apology that the assistant couldn't solve the problem itself.", "Apology alone doesn't help."),
  ("Who will help, how soon, and that they won't need to repeat themselves.", "Right. Sets expectations and carries context."),
  ("A link to the help centre home page so they can search themselves.", "Unhelpful at a handover."),
  ("A satisfaction survey about the assistant's performance so far.", "Bad timing."),
 ]),
 dict(q="How should a support assistant be tested before launch?", a=2, opts=[
  ("With a demo on ten questions chosen by the vendor's team.", "Too few, and chosen to flatter."),
  ("By the product team asking it questions informally for a week.", "Unstructured and unrepresentative."),
  ("On hundreds of real past questions plus adversarial cases, graded by agents.", "Right. Realistic and structured."),
  ("By launching to all customers and monitoring complaints.", "Testing on customers."),
 ]),
],
)
