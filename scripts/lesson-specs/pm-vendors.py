SPEC = dict(
file="12b-3-pm-vendors.js",
reviewed="2026-11",
outcomes=["Write evaluation questions for an AI vendor that require evidence, not assurances."],
situation="""<p>You're running the procurement for an AI customer-service tool. Three vendors answered your questionnaire. All three say their product is “accurate, secure, compliant and enterprise-ready”. One attached a benchmark showing 97% accuracy on “customer queries”, without saying whose.</p>
<p>Buying AI products is different from buying ordinary software: quality varies by your data, behaviour changes when the vendor updates the model, and your data may be used in ways the contract doesn't spell out. This lesson is about asking questions that get evidence back.</p>""",
warmup=dict(q="A vendor claims 97% accuracy. What's the most important follow-up?", a=2, opts=[
  ("Ask whether the accuracy will improve in future versions.", "Future promises aren't evidence."),
  ("Ask for a customer reference who is happy with it.", "Useful, but not evidence of accuracy on your data."),
  ("Ask to test it on your own examples before deciding.", "Right. Your data is what matters."),
  ("Ask how many customers use the product.", "Popularity isn't accuracy."),
 ]),
sections="""<h2>Questions that require evidence</h2>
<p>Government procurement guidance for AI, such as the UK's AI Playbook, stresses defining the problem first, testing with your own data, and planning for the whole life of the system, including how it will change and how you'll exit.[S1] Turn each vendor claim into a question that can only be answered with evidence.</p>
<div class="tbl"><table><thead><tr><th>Vague question</th><th>Evidence question</th></tr></thead><tbody>
<tr><td>Is the product accurate?</td><td>Will you run a trial on 200 of our past tickets, scored against our agents' answers, before contract?</td></tr>
<tr><td>Is it secure?</td><td>Provide your latest independent security report (e.g. SOC 2 Type II) and describe how you prevent prompt injection from customer messages.</td></tr>
<tr><td>Do you use our data for training?</td><td>State in the contract whether our data or outputs train any model, how long data is retained, and where it's stored.</td></tr>
<tr><td>Will it keep working?</td><td>How do you notify us before model changes, and can we re-run our evaluation before they apply to us?</td></tr>
<tr><td>Can we leave?</td><td>In what format can we export our data and configuration, and how quickly?</td></tr>
</tbody></table></div>
<h2>Worked example: scoring vendor answers</h2>
<p>For “Do you use our data for training?”, three answers came back:</p>
<ul>
<li><strong>Vendor A:</strong> “We take privacy very seriously.” <em>Score 0: no answer.</em></li>
<li><strong>Vendor B:</strong> “Customer data is not used to train models by default; enterprise plans can opt out of all retention beyond 30 days. See DPA section 4.2.” <em>Score 2: specific, contractual.</em></li>
<li><strong>Vendor C:</strong> “We may use anonymised data to improve our services.” <em>Score 1: honest, but needs clarifying what “anonymised” means and an opt-out.</em></li>
</ul>
<h2>Your turn: write evidence questions</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Questions for an AI meeting-notes vendor</span></div><div class="activity-b">
<p>Your company is buying an AI meeting-notes tool. Write five evaluation questions that can only be answered with evidence, and say what a good answer would include.</p>
<div data-w="task" data-key="pm-vendor-questions">
<div class="task-model"><ol>
<li><strong>Trial:</strong> Will you run a two-week trial on our meetings, where we compare action items with the facilitator's notes? Good answer: yes, with our data deleted after.</li>
<li><strong>Data use:</strong> Is any recording, transcript or summary used to train models? Good answer: no, stated in the DPA.</li>
<li><strong>Retention and location:</strong> How long are recordings kept, where, and can we set shorter periods? Good answer: configurable, region named.</li>
<li><strong>Access:</strong> Who at your company can access our recordings, and is access logged? Good answer: named roles, audited.</li>
<li><strong>Change and exit:</strong> How are model changes announced, and how do we export everything if we leave? Good answer: advance notice, standard formats.</li>
</ol></div>
<ul class="task-rubric">
<li>Asks for a trial on your own data with a clear measure</li>
<li>Asks about training on your data, with a contractual answer</li>
<li>Asks about retention, storage location and access</li>
<li>Asks how model changes are handled</li>
<li>Asks about exporting data and exit</li>
</ul>
</div></div></div>""",
myths=[
 ("A vendor's benchmark tells you how it will perform for you.", "Benchmarks use someone else's data. Trial it on yours."),
 ("“Enterprise-ready” means secure and compliant.", "It's a marketing term. Ask for reports, contract terms and specifics."),
 ("Once bought, an AI product behaves the same over time.", "Vendors update models. Contract for notice and the right to re-test."),
 ("Procurement is only about price and features.", "For AI, data use, model changes and exit matter as much."),
],
recap=[
 "Turn every vendor claim into a question only evidence can answer.",
 "Trial on your own data, with a measure agreed in advance.",
 "Get data use, retention and location into the contract.",
 "Plan for model changes and for leaving.",
 "Score answers on specificity, not on confidence.",
],
checks=[
 dict(q="Which vendor answer about training on your data is best?", a=1, opts=[
  ("“We take privacy and security very seriously.”", "No answer at all."),
  ("“Not used for training by default; see DPA section 4.2.”", "Right. Specific and contractual."),
  ("“We follow all industry best practices.”", "Vague."),
  ("“Our AI is trained on high-quality data.”", "Doesn't answer the question."),
 ]),
 dict(q="How should you check a vendor's accuracy claim?", a=3, opts=[
  ("Ask for the benchmark's methodology document.", "Useful, but still not your data."),
  ("Compare their claim with competitors' claims.", "Comparing claims isn't testing."),
  ("Read online reviews from other customers.", "Not specific to your use."),
  ("Trial the product on your own past examples.", "Right. Your data is the test."),
 ]),
 dict(q="Why ask how a vendor handles model changes?", a=0, opts=[
  ("Behaviour can change when the model changes, affecting your results.", "Right. You need notice and a chance to re-test."),
  ("Model changes always make products worse.", "Not always, but you need to know."),
  ("Regulators require vendors never to change models.", "No such general rule."),
  ("So you can negotiate a lower price at each change.", "Not the main reason."),
 ]),
 dict(q="What should a good exit answer include?", a=2, opts=[
  ("A promise that you'll never want to leave.", "Not an answer."),
  ("A discount for renewing early.", "Unrelated."),
  ("Export formats for data and configuration, and timescales.", "Right. Concrete and actionable."),
  ("A list of other customers who stayed.", "Unrelated."),
 ]),
 dict(q="What does government AI procurement guidance emphasise?", a=1, opts=[
  ("Choosing the most advanced model available.", "Capability isn't the starting point."),
  ("Defining the problem, testing with your data, and planning for change and exit.", "Right. The whole life of the system."),
  ("Buying from the largest vendor to reduce risk.", "Size isn't evidence."),
  ("Avoiding AI products entirely in the public sector.", "Not the guidance."),
 ]),
],
sources=[
 'UK Government (2025), <a href="https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government" target="_blank" rel="noopener">AI Playbook for the UK Government</a>. Principles and guidance for buying and using AI, including procurement.',
],
)
