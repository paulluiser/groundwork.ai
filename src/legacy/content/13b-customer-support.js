GW.lesson({
  id: "customer-support",
  reviewed: "2026-11",
  lede: "Support teams were among the first to use AI at scale: drafting replies, summarising long threads and answering customers directly. Every reply is a promise made in the company's name, so the work is making sure AI never promises what you can't keep.",
  outcomes: [
    "Use AI to draft replies, summarise tickets and route work, and keep a person on anything that commits the company.",
    "Catch invented refunds, wrong policy and made-up causes in a drafted reply.",
    "Set safe limits for a customer-facing assistant: grounding, handoff and what it may never promise.",
    "Measure an AI support tool by outcomes for customers, not just speed.",
    "Review an AI-drafted reply for promises, policies and facts before sending it."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>A customer writes in, upset: their subscription renewed the day after they meant to cancel. The assistant drafts a warm, well-written reply in seconds: an apology, a full refund “processed today”, and a note that “as a goodwill gesture, your next three months are free”.</p>
<p>Your policy allows a refund within 14 days, which applies. There is no three-months-free gesture, and nobody has processed anything. A tribunal has already held one airline responsible for what its chatbot promised a customer.[1] This lesson is about sending replies that are kind and true.</p></div>
<div class="check warmup" data-a="2"><p class="q">An AI-drafted reply promises a customer something. What must you check before sending?</p><ul>
<li data-fb="Tone matters, but promises matter more.">That the tone is warm enough to calm the customer down after a bad experience.</li>
<li data-fb="Length is secondary.">That the reply is short enough for the customer to read on a phone screen.</li>
<li data-fb="Right. Every promise is made in the company's name.">That the promise matches policy and has actually been done or approved.</li>
<li data-fb="Confidence isn't authority.">That the assistant was confident about the promise when it drafted it.</li>
</ul></div>
<h2>Where AI meets support work</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Summarising long tickets and threads</td><td><span class="fit good">Good fit</span></td><td>Saves reading time on escalations and handovers. Check the customer's actual ask against the original message.</td></tr>
<tr><td>Drafting replies for an agent to send</td><td><span class="fit good">Good fit</span></td><td>Faster first drafts, especially for newer agents.<sup>[2]</sup> The agent checks every promise before sending.</td></tr>
<tr><td>Tagging and routing tickets</td><td><span class="fit care">Use with care</span></td><td>Works well at volume. Measure it against tickets your team has tagged, and re-check when products change.</td></tr>
<tr><td>Drafting help-centre articles and macros</td><td><span class="fit care">Use with care</span></td><td>Good structure. Every step must match the current product (lesson 27).</td></tr>
<tr><td>Answering customers directly</td><td><span class="fit care">Use with care</span></td><td>Only from approved sources, with a clear path to a person. Companies are held to what their bots say.<sup>[1]</sup></td></tr>
<tr><td>Refunds, exceptions, complaints and vulnerable customers</td><td><span class="fit human">Keep human</span></td><td>Money, policy exceptions and judgment about people's circumstances.</td></tr>
</tbody></table></div>

<h2>Worked example: a drafted reply</h2>
<p>A customer writes in, annoyed. The assistant has the ticket, the customer's billing record and the relevant policy, and drafts a reply for the agent to send. It reads warmly and confidently.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check every promise</span></div><div class="activity-b">
<p>Compare the draft with the ticket, the account and the policy. Flag every sentence the agent shouldn't send as written.</p>
<div data-w="claims" data-cfg="support-reply"></div>
</div></div>

<p>Four problems, each typical of drafted replies:</p>
<ol class="steps">
<li><strong>An action was described that never happened</strong>The draft says the refund has been issued. Nobody issued it. Models write what a resolved reply usually says, whether or not anyone did it.</li>
<li><strong>Policy was softened</strong>The policy says cancellation takes effect at the end of the billing period, with no partial refunds. The draft offers both, because that is what an unhappy customer wants to hear (lesson 3).</li>
<li><strong>A goodwill credit was invented</strong>Free months appear in many support replies in the training data. Here it is a commitment nobody approved, and the customer will hold you to it.</li>
<li><strong>A cause was made up</strong>“A known issue with our payment provider” sounds like an explanation. Nothing in the record says it. If it is wrong, it misleads the customer and the team.</li>
</ol>
<div class="key"><p>A reply is a promise. Every refund, credit, date and cause in it must come from policy, the record, or an action someone has actually taken.</p></div>

<h2>Customer-facing assistants</h2>
<p>When customers talk to an assistant directly, nobody checks each reply before it is sent. The design has to do the checking:</p>
<ul>
<li><strong>Answer only from approved sources.</strong> Ground answers in the current help centre and policies (lesson 2), and have the assistant say it doesn't know when they don't cover the question.</li>
<li><strong>Make handoff easy.</strong> A customer should reach a person without fighting the bot, and the person should see the conversation so far, so nobody repeats themselves.</li>
<li><strong>List what it may never do.</strong> No refunds, credits, policy exceptions or legal statements without a person. Enforce this in the tools it can call (lesson 7), not only in its instructions.</li>
<li><strong>Treat customer messages as untrusted.</strong> A message can contain instructions aimed at the assistant (lesson 8). Limit what it can access and do.</li>
</ul>
<p>In 2024 a Canadian tribunal held an airline responsible for its website chatbot's wrong answer about bereavement fares, and ordered it to pay the difference. The airline's argument that the chatbot was responsible for its own words did not succeed.<sup>[1]</sup></p>

<h2>Measure what customers get</h2>
<p>Handle time and <a class="term" data-t="deflection">deflection</a> rise easily with AI. Neither tells you whether customers were helped. Track them alongside measures of outcome:</p>
<ul>
<li><strong>Reopen and repeat-contact rates.</strong> A fast answer that brings the customer back wasn't a resolution.</li>
<li><strong>Satisfaction after AI-assisted and bot conversations</strong>, compared with the same ticket types handled by people.</li>
<li><strong>Escalations that arrive with the context</strong>, so the <a class="term" data-t="handoff">handoff</a> doesn't start from zero.</li>
<li><strong>Errors found in review.</strong> Sample AI-drafted and bot replies every week, and log what was wrong.</li>
</ul>

<h2>Three things to check in every drafted reply</h2>
<ol class="steps">
<li><strong>Promises</strong>Refunds, credits, discounts, dates, “we'll call you”. Each needs policy behind it and, if it says it's done, a record that it is.</li>
<li><strong>Policies and facts</strong>Plan limits, prices, how a feature works, what data you keep. Check against the current help centre or policy page, not the draft.</li>
<li><strong>What the customer actually asked</strong>Drafts often answer a typical version of the question. Re-read the customer's message and check every question got an answer.</li>
</ol>
<p>A large study of support agents found AI assistance raised productivity on average, most of all for newer agents, by spreading the practices of experienced ones.[2] The gains come with a responsibility the tool can't take: the agent is still the one making the promise.</p>
<h2>Worked example: checking the renewal reply</h2>
<div class="worked">
<div class="wx"><b>AI draft</b><div><p>“I'm so sorry about this! I've processed a full refund today, and as a goodwill gesture your next three months are free. Your subscription has also been cancelled.”</p></div></div>
<div class="wx strong"><b>After checking</b><div><p>“I'm sorry the renewal went through when you'd meant to cancel. Because it's within 14 days, you're entitled to a full refund of €96. I've requested it now; you'll see it on your card within 5–10 working days. I've also cancelled the subscription, so nothing further will be charged. Your data stays available until 30 June if you want to export it.”</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>“Processed today” became “requested now”</strong>, with a realistic timescale, because that's what actually happened.</li>
<li><strong>The three free months disappeared.</strong> No policy allows it; the model invented a typical goodwill gesture.</li>
<li><strong>The amount and the data question were added</strong>: details the customer will ask about next if they're missing.</li>
</ul>
<h2>Your turn: check a drafted reply</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">What would you change before sending?</span></div><div class="activity-b">
<p>A customer asked whether they can add a fifth user to their Starter plan and whether their data is stored in the EU. The draft says: <em>“Absolutely! You can add as many users as you need on Starter. All our data is stored securely in the EU, and we're fully GDPR certified.”</em> Starter allows 3 users; data is stored in the EU for accounts created after 2024; there's no such thing as GDPR certification. Rewrite it.</p>
<div data-w="task" data-key="support-reply">
<div class="task-model"><p>“The Starter plan includes up to 3 users, so adding a fifth would mean moving to the Team plan (up to 25 users, €15 per user per month). I can switch you over if you'd like.</p>
<p>On data location: accounts created since January 2024 are stored in our EU data centre. Yours was created in 2023, so it's in the US region; we can migrate it to the EU on request. Our data processing terms are here: [link].”</p></div>
<ul class="task-rubric">
<li>Corrects the user limit and offers a real option</li>
<li>Answers the data location question accurately for this customer</li>
<li>Removes the claim of “GDPR certification”</li>
<li>Offers a concrete next step</li>
<li>Answers both questions the customer asked</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Personal data in prompts.</strong> Tickets contain names, addresses and sometimes payment or health details. Use only approved tools (lesson 8).</li>
<li><strong>Outdated help articles.</strong> An assistant will quote a retired policy with total confidence if it can still find it. Retire or label old pages.</li>
<li><strong>Tone that doesn't fit the moment.</strong> Cheerful drafts read badly to someone who is upset or grieving. Adjust tone yourself on sensitive tickets.</li>
<li><strong>Copy-paste fatigue.</strong> After a hundred good drafts, agents stop reading closely (lesson 6). Rotate who reviews samples, and keep checks on promises automatic where you can.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take five recent tickets your team has already answered. Ask an assistant to draft replies using your real policies. Mark every sentence that commits the company to something, and check each one against policy. Compare with the replies your team actually sent.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>The customer will understand if the AI made a mistake.</dt><dd>Tribunals and customers hold the company to what its replies say, whoever drafted them.</dd>
<dt>Warmer replies make up for less precise ones.</dt><dd>Kind and precise beat kind and vague. Specifics are what reduce follow-up tickets.</dd>
<dt>AI drafts are fine for simple questions.</dt><dd>Simple questions about limits, prices and data are exactly where invented specifics slip in.</dd>
<dt>Faster replies mean better support.</dt><dd>Speed matters, but reopened tickets and corrections cost more than a careful first reply.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Every reply is a promise made in the company's name.</li>
<li>Check promises against policy and records before sending.</li>
<li>Check facts against the current help centre, not the draft.</li>
<li>Make sure every question the customer asked gets an answer.</li>
<li>Be kind and precise: amounts, dates and next steps.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">A draft says a refund was “processed today”. What must be true before sending it?</p><ul>
<li data-fb="Right. Claims of action need a record.">The refund has actually been processed, or the wording is changed.</li>
<li data-fb="Not a general requirement.">The customer has been a subscriber for at least a year.</li>
<li data-fb="Not a real check.">The draft has been approved by the AI tool's confidence check.</li>
<li data-fb="Tone doesn't make the claim true.">The tone of the reply is apologetic enough for the situation.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">What did the Air Canada tribunal decision establish?</p><ul>
<li data-fb="That wasn't the ruling.">Chatbots can't legally answer customer questions in Canada.</li>
<li data-fb="The tribunal rejected that argument.">Customers must verify chatbot answers before relying on them.</li>
<li data-fb="The opposite.">Airlines are exempt from responsibility for automated advice.</li>
<li data-fb="Right. Its chatbot's information was its own.">The company was responsible for what its chatbot told a customer.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which part of a drafted reply most often contains invented specifics?</p><ul>
<li data-fb="Low risk.">The greeting and the sign-off at the start and end of the reply.</li>
<li data-fb="Low risk.">The apology for the inconvenience the customer experienced.</li>
<li data-fb="Right. Typical numbers and offers get filled in.">Limits, prices, timescales and goodwill gestures.</li>
<li data-fb="Usually copied correctly.">The customer's name and account details copied from the ticket.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Who gained most from AI assistance in the large support study?</p><ul>
<li data-fb="Gains were smallest for them.">The most experienced agents, who used it to work much faster.</li>
<li data-fb="Right. It spread experienced agents' practices.">Newer and less experienced agents.</li>
<li data-fb="Not what the study measured.">Customers who contacted support outside business hours.</li>
<li data-fb="Not the finding.">Team leads, who spent less time reviewing tickets.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why re-read the customer's original message before sending a drafted reply?</p><ul>
<li data-fb="Right. Check every question got an answer.">Drafts often answer a typical question instead of the one asked.</li>
<li data-fb="Mirroring style isn't the point.">To copy the customer's tone and writing style back to them.</li>
<li data-fb="Not the main reason.">Because the assistant can't read long customer messages properly.</li>
<li data-fb="A separate concern.">To find details that should be removed for privacy reasons.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Civil Resolution Tribunal of British Columbia (2024), <a href="https://www.canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html" target="_blank" rel="noopener">Moffatt v. Air Canada, 2024 BCCRT 149</a>. The airline was held responsible for its chatbot's incorrect information.</li>
<li>Brynjolfsson, Li and Raymond (2023), <a href="https://www.nber.org/papers/w31161" target="_blank" rel="noopener">Generative AI at Work</a>. A study of support agents using an AI assistant: productivity rose on average, most for less experienced agents.</li>
</ol></section>
`
});
