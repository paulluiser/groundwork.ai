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
  lede: "Lesson 42 introduced customer-facing assistants and why every reply is a promise. This lesson follows one through launch: testing it on real tickets, deciding what it may answer, designing the handoff to people, and watching the right signals once customers are using it.",
  outcomes: [
    "Test a support assistant on real past tickets, against criteria agreed in advance.",
    "Decide which topics the assistant may answer and which go straight to a person.",
    "Design a handoff that's easy to reach and carries the conversation with it.",
    "Measure whether problems were actually solved, not just whether they reached an agent."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Hiding the way to a person.</strong> It improves the deflection numbers and harms the customer.</li>
<li><strong>Disclaimers instead of design.</strong> “Answers may be wrong” doesn't stop customers relying on them.</li>
<li><strong>Answers from general knowledge.</strong> If the help centre doesn't cover it, the assistant should say so and hand off.</li>
<li><strong>No owner after launch.</strong> Someone needs to read samples, fix sources and update the eval set every week.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick 20 recent tickets and write, for each, whether a support assistant should answer it, answer with a source, or hand off straight away. The proportions tell you what scope is realistic.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">What's the best evidence that a support assistant is ready to launch?</p><ul>
<li data-fb="Demos use questions chosen to go well.">A strong demo on the vendor's sample questions.</li>
<li data-fb="Benchmarks aren't your customers.">A high score on a public benchmark.</li>
<li data-fb="Right. Your own tickets, graded by people who know the answers.">A pass rate, agreed in advance, on real past tickets graded by your agents.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why did the Moffatt v. Air Canada case matter for support teams?</p><ul>
<li data-fb="Right. The company was held responsible for what its chatbot told a customer.">It established that a company is responsible for what its chatbot tells customers.</li>
<li data-fb="It was about responsibility for wrong information, not a ban.">It banned chatbots from discussing refunds.</li>
<li data-fb="The airline's attempt to blame the chatbot was rejected.">It found the chatbot vendor responsible.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Deflection is 62% after launch. What else should you check before calling it a success?</p><ul>
<li data-fb="Speed alone doesn't show problems were solved.">How quickly the assistant replies.</li>
<li data-fb="Right. These show whether customers were actually helped, and told the truth.">Repeat contacts, complaints, and a sample of conversations checked for accuracy.</li>
<li data-fb="Usage isn't the same as help.">How many customers opened the chat window.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Colin Lecher, The Markup (2024), <a href="https://themarkup.org/news/2024/03/29/nycs-ai-chatbot-tells-businesses-to-break-the-law" target="_blank" rel="noopener">NYC's AI Chatbot Tells Businesses to Break the Law</a>.</li>
<li>Civil Resolution Tribunal of British Columbia (2024), <a href="https://www.canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html" target="_blank" rel="noopener">Moffatt v. Air Canada, 2024 BCCRT 149</a>.</li>
<li>Brynjolfsson, Li and Raymond (2023), <a href="https://www.nber.org/papers/w31161" target="_blank" rel="noopener">Generative AI at Work</a>. NBER working paper on support agents using an AI assistant.</li>
</ol></section>
`
});
