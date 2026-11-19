GW.lesson({
  id: "customer-support",
  lede: "Support teams were among the first to use AI at scale: drafting replies, summarising long threads and answering customers directly. Every reply is a promise made in the company's name, so the work is making sure AI never promises what you can't keep.",
  outcomes: [
    "Use AI to draft replies, summarise tickets and route work, and keep a person on anything that commits the company.",
    "Catch invented refunds, wrong policy and made-up causes in a drafted reply.",
    "Set safe limits for a customer-facing assistant: grounding, handoff and what it may never promise.",
    "Measure an AI support tool by outcomes for customers, not just speed."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Personal data in prompts.</strong> Tickets contain names, addresses and sometimes payment or health details. Use only approved tools (lesson 8).</li>
<li><strong>Outdated help articles.</strong> An assistant will quote a retired policy with total confidence if it can still find it. Retire or label old pages.</li>
<li><strong>Tone that doesn't fit the moment.</strong> Cheerful drafts read badly to someone who is upset or grieving. Adjust tone yourself on sensitive tickets.</li>
<li><strong>Copy-paste fatigue.</strong> After a hundred good drafts, agents stop reading closely (lesson 6). Rotate who reviews samples, and keep checks on promises automatic where you can.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take five recent tickets your team has already answered. Ask an assistant to draft replies using your real policies. Mark every sentence that commits the company to something, and check each one against policy. Compare with the replies your team actually sent.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">A drafted reply says “I've refunded the duplicate charge.” What should the agent do?</p><ul>
<li data-fb="The draft describes an action; nobody has taken it.">Send it; the customer is owed the refund.</li>
<li data-fb="Right. Take the action first, or change the sentence to say what will happen and when, according to policy.">Issue the refund first, or reword the reply to match what will actually happen.</li>
<li data-fb="The refund itself may be right. The sentence just has to be true.">Delete any mention of a refund.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Your support bot's deflection rate has doubled. What does that tell you?</p><ul>
<li data-fb="Not on its own. Deflected customers may have given up or come back.">Customers are getting their answers faster.</li>
<li data-fb="It might be, but you can't tell from this number.">The bot is giving wrong answers.</li>
<li data-fb="Right. Check repeat contacts, satisfaction and sampled answers before calling it a win.">Not much yet: check reopen rates, satisfaction and a sample of conversations.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which limit matters most for a support bot that can call a refund tool?</p><ul>
<li data-fb="Right. Enforce limits in the tool, where an injected or mistaken instruction can't get round them.">A cap and a human approval step built into the refund tool itself.</li>
<li data-fb="Instructions help, but a model can be talked out of them. Enforce limits in the tool.">An instruction in the prompt saying not to refund more than £50.</li>
<li data-fb="Tone matters, but it doesn't limit what the bot can do.">A friendly, apologetic tone.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Civil Resolution Tribunal of British Columbia (2024), <a href="https://www.canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html" target="_blank" rel="noopener">Moffatt v. Air Canada, 2024 BCCRT 149</a>. The airline was held responsible for its chatbot's incorrect information.</li>
<li>Brynjolfsson, Li and Raymond (2023), <a href="https://www.nber.org/papers/w31161" target="_blank" rel="noopener">Generative AI at Work</a>. A study of support agents using an AI assistant: productivity rose on average, most for less experienced agents.</li>
</ol></section>
`
});
