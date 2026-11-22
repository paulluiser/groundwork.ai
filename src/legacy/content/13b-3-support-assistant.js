GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["assistant-launch"] = {
  steps: [
    { title: "Ready to launch?", sit: "The vendor's demo of your new support assistant went well on 20 questions the vendor chose. Leadership wants to launch next week.", opts: [
      ["Launch; the demo shows it works.", "Demos use questions the system handles well. You don't yet know how it does on your customers' real questions."],
      ["First run it on 300 real past tickets, have agents grade the answers against agreed criteria, and agree a pass rate for launch.", "Right. Real tickets, graded by people who know the answers, against a bar agreed in advance (lesson 20)."],
      ["Launch to everyone, but add a disclaimer that answers may be wrong.", "Disclaimers don't stop customers acting on wrong answers, and they don't move responsibility off you."]], a: 1 },
    { title: "What it may answer", sit: "In testing, the assistant answers billing questions well but sometimes invents refund exceptions that don't exist in your policy.", opts: [
      ["Limit it to answering from the help centre, and hand refund and exception requests to a person.", "Right. A tribunal held Air Canada responsible for its chatbot's invented refund policy. Keep promises about money with people."],
      ["Add “never invent refund policies” to the system prompt and launch.", "Instructions help, but they aren't a guarantee. Remove the scope for the error where it matters."],
      ["Let it answer, since most of its billing answers are right.", "The wrong answers here are promises customers will hold you to."]], a: 0 },
    { title: "Designing the handoff", sit: "Customers who ask for a person currently get “I can help with that!” and another automated answer. Some ask three times.", opts: [
      ["Keep trying to resolve it; handoffs hurt the deflection rate.", "Deflection that frustrates customers isn't success. They leave or come back angrier."],
      ["Hand off when asked, or when the assistant isn't confident, and pass the whole conversation to the agent so the customer doesn't repeat themselves.", "Right. A good handoff is easy to reach and carries the context with it."],
      ["Remove the assistant from the support page.", "Too far. It may help many customers; fix the handoff."]], a: 1 },
    { title: "After launch", sit: "A month in, the dashboard shows 62% of conversations resolved without an agent. Leadership is delighted.", opts: [
      ["Celebrate and expand it to more topics.", "Resolved without an agent isn't the same as resolved. Some of those customers may have given up, or been told something wrong."],
      ["Ask the vendor to confirm the number.", "The vendor measures what makes the product look good."],
      ["Check what happened next: repeat contacts within a week, complaints, and a weekly sample of conversations read by agents for accuracy.", "Right. Measure whether customers' problems were actually solved and answers were correct, not only whether they reached an agent."]], a: 2 },
    { title: "A wrong answer goes viral", sit: "A customer posts a screenshot: the assistant told them a feature is free that actually costs extra. It's getting attention.", opts: [
      ["Find out how often this answer was given, fix the source (the help article or prompt), honour or make good on what customers were told where fair, and add the case to the eval set.", "Right. Treat it as an incident: scope, fix the cause, make it right for customers, and prevent a repeat."],
      ["Reply that the assistant is in beta and answers may be wrong.", "That doesn't help the customer or protect you. Courts and customers treat the bot as speaking for you."],
      ["Take the assistant offline permanently.", "Possibly needed briefly, but the fix is to find and correct the cause."]], a: 0 }
  ],
  after: "A support assistant is a member of your team that talks to customers. Test it on real tickets before launch, keep promises about money with people, make handoff easy, and measure whether problems were actually solved."
};
GW.lesson({
  id: "support-assistant",
  reviewed: "2026-11",
  lede: "Lesson 42 introduced customer-facing assistants and why every reply is a promise. This lesson follows one through launch: testing it on real tickets, deciding what it may answer, designing the handoff to people, and watching the right signals once customers are using it.",
  outcomes: [
    "Test a support assistant on real past tickets, against criteria agreed in advance.",
    "Decide which topics the assistant may answer and which go straight to a person.",
    "Design a handoff that's easy to reach and carries the conversation with it.",
    "Measure whether problems were actually solved, not just whether they reached an agent.",
    "Write the scope for a support assistant: what it answers, what it hands over, and how it says no."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Leadership wants the support assistant live on the website next month, answering “anything customers ask”. You've seen what happened when a city's business chatbot told owners they could take workers' tips and refuse tenants with housing vouchers, both illegal.[1] You'd like your launch to go differently.</p>
<p>The most important design decision for a customer-facing assistant isn't the model. It's the scope: what it may answer, what it must hand to a person, and how it says so. This lesson is about writing that scope and testing it before customers do.</p></div>
<div class="check warmup" data-a="1"><p class="q">Which is the best first scope for a customer-facing support assistant?</p><ul>
<li data-fb="Unbounded scope is where harmful answers come from.">Anything customers ask, so they never have to wait for a person to reply.</li>
<li data-fb="Right. Grounded answers, clear limits.">Questions answered in the published help centre, with handover for the rest.</li>
<li data-fb="High-stakes, policy-heavy: hand those to people first.">Refunds and billing disputes, since those are the most common tickets.</li>
<li data-fb="Too narrow to be useful.">Only greetings and routing, so it can never be wrong about anything.</li>
</ul></div>
<h2>What the cases teach</h2>
<p>Two public cases show what goes wrong. In 2024, a Canadian tribunal held Air Canada responsible after its chatbot told a passenger he could claim a bereavement discount after travelling, which the airline's actual policy didn't allow. The airline's argument that the chatbot was responsible for its own words was rejected.<sup>[2]</sup> The same year, The Markup reported that New York City's MyCity business chatbot told users it was legal to take workers' tips, refuse housing vouchers and go cash-free, all of which broke local law. When ten staff asked the same question about vouchers, all ten got the wrong answer.<sup>[1]</sup></p>
<p>The research on AI helping agents is more encouraging. A study of over 5,000 support agents found that an AI assistant raised productivity by 14% on average, and by 34% for the least experienced agents.<sup>[3]</sup> The difference is the setup: the assistant suggested and a person decided. A customer-facing assistant removes that person, so the testing, scope and handoff have to make up for it.</p>

<h2>Before launch</h2>
<div class="tbl"><table>
<thead><tr><th>Decision</th><th>Fit for the assistant</th><th>Why</th></tr></thead>
<tbody>
<tr><td>How-to questions answered in the help centre</td><td><span class="fit good">Good fit</span></td><td>Grounded in content you control. Show the source article.</td></tr>
<tr><td>Order status and account lookups</td><td><span class="fit good">Good fit</span></td><td>Factual answers from your systems, with access limited to the customer's own data.</td></tr>
<tr><td>Troubleshooting with several steps</td><td><span class="fit care">Use with care</span></td><td>Useful if steps come from tested articles. Hand off when the steps don't work.</td></tr>
<tr><td>Refunds, exceptions, legal or safety questions</td><td><span class="fit human">Keep human</span></td><td>Promises with financial or legal weight. Route to a person.</td></tr>
<tr><td>Upset or vulnerable customers</td><td><span class="fit human">Keep human</span></td><td>Needs judgment and empathy. Detect and hand off early.</td></tr>
</tbody></table></div>
<p>Test on real past tickets, not demo questions. Have agents grade answers against what a correct answer must contain, and agree the pass rate before you run the test. Include the hard cases: angry customers, ambiguous questions, questions the help centre doesn't answer, and attempts to make the assistant say something it shouldn't.</p>

<h2>Practice: make the call</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Launching a support assistant</span></div><div class="activity-b">
<p>Five decisions from a support assistant's first months. Choose what you'd do.</p>
<div data-w="decide" data-cfg="assistant-launch"></div>
</div></div>

<ol class="steps">
<li><strong>Test on your tickets, not the demo</strong>Real questions graded by agents, against a bar agreed in advance.</li>
<li><strong>Keep money and exceptions with people</strong>Narrow scope removes whole categories of costly errors.</li>
<li><strong>Make handoff easy and complete</strong>Customers who ask for a person get one, with the conversation passed along.</li>
<li><strong>Measure outcomes, and treat failures as incidents</strong>Repeat contacts and sampled accuracy, not just the share that didn't reach an agent.</li>
</ol>
<div class="key"><p>Customers treat the assistant as your company speaking, and so do courts. Launch it with the same care as a new team member who'll talk to thousands of customers a day.</p></div>

<h2>Signals to watch after launch</h2>
<ul>
<li><strong>Repeat contacts:</strong> customers who come back within a few days about the same issue weren't really helped.</li>
<li><strong>Handoff rate and reasons:</strong> rising handoffs on a topic point to a gap in the help centre.</li>
<li><strong>Sampled accuracy:</strong> agents read a weekly sample of conversations and label each one correct or not.</li>
<li><strong>Complaints and escalations</strong> mentioning the assistant.</li>
<li><strong><a class="term" data-t="deflection">Deflection</a> with care:</strong> a high rate is only good if the other signals agree.</li>
</ul>

<h2>Worked example: a scope document</h2>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Hiding the way to a person.</strong> It improves the deflection numbers and harms the customer.</li>
<li><strong>Disclaimers instead of design.</strong> “Answers may be wrong” doesn't stop customers relying on them.</li>
<li><strong>Answers from general knowledge.</strong> If the help centre doesn't cover it, the assistant should say so and hand off.</li>
<li><strong>No owner after launch.</strong> Someone needs to read samples, fix sources and update the eval set every week.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick 20 recent tickets and write, for each, whether a support assistant should answer it, answer with a source, or hand off straight away. The proportions tell you what scope is realistic.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A good system prompt keeps the assistant in scope.</dt><dd>Prompts guide; they don't enforce. Don't give it tools or data outside scope.</dd>
<dt>Customers prefer an assistant that never hands over.</dt><dd>They prefer correct answers. A fast, honest handover beats a confident wrong answer.</dd>
<dt>Launch broad and narrow the scope if problems appear.</dt><dd>Problems appear as harm to customers. Launch narrow and widen with evidence.</dd>
<dt>If it passed testing, it's safe forever.</dt><dd>Policies, products and models change. Keep sampling conversations after launch.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Scope is the most important design decision for a support assistant.</li>
<li>Answer from published sources; hand money, access and complaints to people.</li>
<li>Enforce scope in the system: no tools or data outside it.</li>
<li>Test on real past questions and adversarial cases before launch.</li>
<li>Handover messages should set expectations and carry context.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">How should a support assistant's scope be enforced?</p><ul>
<li data-fb="Prompts can be bypassed.">Through a detailed system prompt listing everything it mustn't discuss.</li>
<li data-fb="Too late to prevent harm.">Through customer feedback after each conversation finishes.</li>
<li data-fb="Right. It can't do what it has no means to do.">By not giving it tools or data outside its scope.</li>
<li data-fb="Useful monitoring, but not enforcement.">Through weekly reviews of a sample of conversations.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">A customer asks the assistant for a refund. What should it do?</p><ul>
<li data-fb="Right. Money decisions go to people.">Collect the details and hand over to a person, saying so.</li>
<li data-fb="It shouldn't hold refund authority.">Process the refund if it's within the policy period stated in the help centre.</li>
<li data-fb="Leaves the customer without help.">Explain the refund policy and close the conversation.</li>
<li data-fb="An invented offer is worse than none.">Offer a discount on the next payment instead of a refund.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">What did the NYC business chatbot case show?</p><ul>
<li data-fb="It showed the opposite.">Government chatbots are more accurate than commercial ones.</li>
<li data-fb="Not the lesson.">Chatbots should only be launched by private companies.</li>
<li data-fb="Not the finding.">Customers can't tell chatbots apart from human agents.</li>
<li data-fb="Right. It told businesses to break the law.">An assistant answering beyond reliable sources can give unlawful advice.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What should a good handover message include?</p><ul>
<li data-fb="Apology alone doesn't help.">An apology that the assistant couldn't solve the problem itself.</li>
<li data-fb="Right. Sets expectations and carries context.">Who will help, how soon, and that they won't need to repeat themselves.</li>
<li data-fb="Unhelpful at a handover.">A link to the help centre home page so they can search themselves.</li>
<li data-fb="Bad timing.">A satisfaction survey about the assistant's performance so far.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">How should a support assistant be tested before launch?</p><ul>
<li data-fb="Too few, and chosen to flatter.">With a demo on ten questions chosen by the vendor's team.</li>
<li data-fb="Unstructured and unrepresentative.">By the product team asking it questions informally for a week.</li>
<li data-fb="Right. Realistic and structured.">On hundreds of real past questions plus adversarial cases, graded by agents.</li>
<li data-fb="Testing on customers.">By launching to all customers and monitoring complaints.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Colin Lecher, The Markup (2024), <a href="https://themarkup.org/news/2024/03/29/nycs-ai-chatbot-tells-businesses-to-break-the-law" target="_blank" rel="noopener">NYC's AI Chatbot Tells Businesses to Break the Law</a>.</li>
<li>Civil Resolution Tribunal of British Columbia (2024), <a href="https://www.canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html" target="_blank" rel="noopener">Moffatt v. Air Canada, 2024 BCCRT 149</a>.</li>
<li>Brynjolfsson, Li and Raymond (2023), <a href="https://www.nber.org/papers/w31161" target="_blank" rel="noopener">Generative AI at Work</a>. NBER working paper on support agents using an AI assistant.</li>
</ol></section>
`
});
