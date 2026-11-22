SPEC = dict(
file="13b-customer-support.js",
reviewed="2026-11",
outcomes=["Review an AI-drafted reply for promises, policies and facts before sending it."],
situation="""<p>A customer writes in, upset: their subscription renewed the day after they meant to cancel. The assistant drafts a warm, well-written reply in seconds: an apology, a full refund “processed today”, and a note that “as a goodwill gesture, your next three months are free”.</p>
<p>Your policy allows a refund within 14 days, which applies. There is no three-months-free gesture, and nobody has processed anything. A tribunal has already held one airline responsible for what its chatbot promised a customer.[1] This lesson is about sending replies that are kind and true.</p>""",
warmup=dict(q="An AI-drafted reply promises a customer something. What must you check before sending?", a=2, opts=[
  ("That the tone is warm enough to calm the customer down after a bad experience.", "Tone matters, but promises matter more."),
  ("That the reply is short enough for the customer to read on a phone screen.", "Length is secondary."),
  ("That the promise matches policy and has actually been done or approved.", "Right. Every promise is made in the company's name."),
  ("That the assistant was confident about the promise when it drafted it.", "Confidence isn't authority."),
 ]),
sections="""<h2>Three things to check in every drafted reply</h2>
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
</div></div></div>""",
myths=[
 ("The customer will understand if the AI made a mistake.", "Tribunals and customers hold the company to what its replies say, whoever drafted them."),
 ("Warmer replies make up for less precise ones.", "Kind and precise beat kind and vague. Specifics are what reduce follow-up tickets."),
 ("AI drafts are fine for simple questions.", "Simple questions about limits, prices and data are exactly where invented specifics slip in."),
 ("Faster replies mean better support.", "Speed matters, but reopened tickets and corrections cost more than a careful first reply."),
],
recap=[
 "Every reply is a promise made in the company's name.",
 "Check promises against policy and records before sending.",
 "Check facts against the current help centre, not the draft.",
 "Make sure every question the customer asked gets an answer.",
 "Be kind and precise: amounts, dates and next steps.",
],
checks=[
 dict(q="A draft says a refund was “processed today”. What must be true before sending it?", a=0, opts=[
  ("The refund has actually been processed, or the wording is changed.", "Right. Claims of action need a record."),
  ("The customer has been a subscriber for at least a year.", "Not a general requirement."),
  ("The draft has been approved by the AI tool's confidence check.", "Not a real check."),
  ("The tone of the reply is apologetic enough for the situation.", "Tone doesn't make the claim true."),
 ]),
 dict(q="What did the Air Canada tribunal decision establish?", a=3, opts=[
  ("Chatbots can't legally answer customer questions in Canada.", "That wasn't the ruling."),
  ("Customers must verify chatbot answers before relying on them.", "The tribunal rejected that argument."),
  ("Airlines are exempt from responsibility for automated advice.", "The opposite."),
  ("The company was responsible for what its chatbot told a customer.", "Right. Its chatbot's information was its own."),
 ]),
 dict(q="Which part of a drafted reply most often contains invented specifics?", a=2, opts=[
  ("The greeting and the sign-off at the start and end of the reply.", "Low risk."),
  ("The apology for the inconvenience the customer experienced.", "Low risk."),
  ("Limits, prices, timescales and goodwill gestures.", "Right. Typical numbers and offers get filled in."),
  ("The customer's name and account details copied from the ticket.", "Usually copied correctly."),
 ]),
 dict(q="Who gained most from AI assistance in the large support study?", a=1, opts=[
  ("The most experienced agents, who used it to work much faster.", "Gains were smallest for them."),
  ("Newer and less experienced agents.", "Right. It spread experienced agents' practices."),
  ("Customers who contacted support outside business hours.", "Not what the study measured."),
  ("Team leads, who spent less time reviewing tickets.", "Not the finding."),
 ]),
 dict(q="Why re-read the customer's original message before sending a drafted reply?", a=0, opts=[
  ("Drafts often answer a typical question instead of the one asked.", "Right. Check every question got an answer."),
  ("To copy the customer's tone and writing style back to them.", "Mirroring style isn't the point."),
  ("Because the assistant can't read long customer messages properly.", "Not the main reason."),
  ("To find details that should be removed for privacy reasons.", "A separate concern."),
 ]),
],
)
