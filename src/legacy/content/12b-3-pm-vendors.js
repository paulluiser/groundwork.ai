GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["vendor-answers"] = {
  buckets: ["Acceptable answer", "Push back or follow up"],
  items: [
    { t: "Q: Is our data used to train your models? A: “No. Customer data is excluded from training by contract, clause 7.2, and you can verify it in our data processing agreement.”", a: 0, why: "A clear answer tied to a contract term you can check. Read clause 7.2 before signing." },
    { t: "Q: How accurate is the system? A: “Our AI is 99% accurate.”", a: 1, why: "Accurate at what, on whose data, measured how? Ask for the test set, the method, and a trial on your own examples." },
    { t: "Q: What happens when you change the underlying model? A: “We notify customers 60 days ahead, rerun our published evaluation suite, and let you stay on the previous version for 90 days.”", a: 0, why: "Specific notice, testing and a fallback. Ask to see a past change notice as evidence." },
    { t: "Q: Where is our data processed? A: “In the cloud.”", a: 1, why: "Not an answer. You need regions, sub-processors, and whether data leaves your jurisdiction." },
    { t: "Q: Can we export our data and configuration if we leave? A: “Yes, in documented JSON and CSV formats, at any time, at no extra cost.”", a: 0, why: "Clear exit terms. Make sure they're in the contract, not just the sales deck." },
    { t: "Q: How do you prevent prompt injection? A: “Our model is trained to ignore malicious instructions, so it's not a risk.”", a: 1, why: "No model reliably ignores injected instructions. Ask what the system is unable to do, regardless of the instructions it receives." },
    { t: "Q: Who is responsible if the system gives a customer wrong information? A: “That's covered by our standard terms.”", a: 1, why: "Read the terms. Courts have held companies responsible for what their chatbots told customers. Liability and indemnity need explicit answers." },
    { t: "Q: Can we run a pilot on our own data before committing? A: “Yes, a 6-week paid pilot with success criteria we agree in advance.”", a: 0, why: "Testing on your own cases against criteria agreed beforehand is the best evidence you'll get." }
  ],
  after: "Good vendor answers are specific, testable and backed by a contract term. Vague accuracy claims, “trust our model” security and unclear liability all need follow-up before you sign."
};
GW.lesson({
  id: "pm-vendors",
  reviewed: "2026-11",
  lede: "Project managers sit between a lot of people: sponsors, users, suppliers. AI can help map stakeholders, draft communications and prepare tender documents. More and more, you're also the one buying AI products, which means asking questions that a sales deck isn't built to answer.",
  outcomes: [
    "Use AI to draft stakeholder maps and communications, checked against what you know about the people.",
    "Draft tender documents and requirements with AI, with requirements you can test.",
    "Ask an AI vendor the right questions about data, accuracy, model changes and liability.",
    "Tell a specific, testable vendor answer from a vague one.",
    "Write evaluation questions for an AI vendor that require evidence, not assurances."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>You're running the procurement for an AI customer-service tool. Three vendors answered your questionnaire. All three say their product is “accurate, secure, compliant and enterprise-ready”. One attached a benchmark showing 97% accuracy on “customer queries”, without saying whose.</p>
<p>Buying AI products is different from buying ordinary software: quality varies by your data, behaviour changes when the vendor updates the model, and your data may be used in ways the contract doesn't spell out. This lesson is about asking questions that get evidence back.</p></div>
<div class="check warmup" data-a="2"><p class="q">A vendor claims 97% accuracy. What's the most important follow-up?</p><ul>
<li data-fb="Future promises aren't evidence.">Ask whether the accuracy will improve in future versions.</li>
<li data-fb="Useful, but not evidence of accuracy on your data.">Ask for a customer reference who is happy with it.</li>
<li data-fb="Right. Your data is what matters.">Ask to test it on your own examples before deciding.</li>
<li data-fb="Popularity isn't accuracy.">Ask how many customers use the product.</li>
</ul></div>
<h2>Where AI helps with stakeholders and suppliers</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting a stakeholder map from your notes</td><td><span class="fit good">Good fit</span></td><td>A quick structure for interest and influence. You know the people; it doesn't.</td></tr>
<tr><td>Tailoring one update for several audiences</td><td><span class="fit good">Good fit</span></td><td>Good at adjusting length and emphasis. Check that facts didn't change between versions.</td></tr>
<tr><td>Drafting tender requirements</td><td><span class="fit good">Good fit</span></td><td>Turns needs into structured requirements. Make each one testable.</td></tr>
<tr><td>Comparing supplier responses</td><td><span class="fit care">Use with care</span></td><td>Useful side-by-side summaries. Read the original bids; summaries flatten important caveats.</td></tr>
<tr><td>Judging people's positions and motives</td><td><span class="fit care">Use with care</span></td><td>Will guess confidently. Your conversations are the evidence.</td></tr>
<tr><td>Choosing a supplier</td><td><span class="fit human">Keep human</span></td><td>A commercial and legal decision with an accountable owner and a procurement process.</td></tr>
</tbody></table></div>

<h2>Stakeholders and communications</h2>
<p>An assistant can turn your notes into a stakeholder map and draft updates for each group. Two things to watch. First, it knows nothing about the actual people: it will place the finance director on an influence grid based on the title, not on what they said in last week's meeting. Second, when it tailors one update into several versions, facts can shift between them. A risk that's “being managed” in the sponsor version and “likely to delay go-live” in the team version is a problem waiting to surface. Draft once from the facts, then tailor, and compare.</p>
<p>Keep the stakeholder map itself private. Notes about who's resistant or who needs careful handling don't belong in a public tool, or in a document that gets forwarded (lesson 8).</p>

<h2>Buying AI products</h2>
<p>Buying an AI product raises questions that ordinary software purchases don't: what happens to your data, how accuracy was measured, what changes when the vendor updates the model, and who's responsible when it's wrong. The UK government's Guidelines for AI procurement were written for public-sector buyers, but they're a useful checklist for anyone evaluating AI suppliers.<sup>[1]</sup> NIST's AI Risk Management Framework, and its profile for generative AI, gives a shared vocabulary for the risks to ask about.<sup>[2]</sup></p>
<p>The questions that matter most:</p>
<ul>
<li><strong>Data:</strong> is it used for training? Where is it processed, by whom, and for how long is it kept?</li>
<li><strong>Accuracy:</strong> measured on what data, by whom? Can you test it on your own cases?</li>
<li><strong>Model changes:</strong> how much notice, what testing, and can you stay on the old version for a while?</li>
<li><strong>Security:</strong> what can the system do, and what stops it doing more when it's manipulated (lesson 22)?</li>
<li><strong>Liability:</strong> who's responsible when it gives wrong information to your customers? A tribunal held Air Canada responsible for what its chatbot told a passenger (lesson 42).</li>
<li><strong>Exit:</strong> can you get your data and configuration out, in a usable format?</li>
</ul>

<h2>Practice: judge the answers</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Is the vendor's answer good enough?</span></div><div class="activity-b">
<p>Sort each answer from a vendor questionnaire.</p>
<div data-w="sort" data-cfg="vendor-answers"></div>
</div></div>

<ol class="steps">
<li><strong>Good answers are specific and checkable</strong>A clause number, a notice period, a format. You can verify them before you sign.</li>
<li><strong>Accuracy claims need a method</strong>A percentage without the test set, the measure and the conditions tells you nothing. Pilot on your own examples.</li>
<li><strong>“The model handles it” isn't a control</strong>For security and safety, ask what the system can't do, not what the model is trained to avoid.</li>
</ol>
<div class="key"><p>A vendor's answer is only as good as the evidence behind it. Ask for the contract clause, the test method or a pilot on your own data.</p></div>

<h2>Questions that require evidence</h2>
<p>Government procurement guidance for AI, such as the UK's AI Playbook, stresses defining the problem first, testing with your own data, and planning for the whole life of the system, including how it will change and how you'll exit.[3] Turn each vendor claim into a question that can only be answered with evidence.</p>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Tender requirements nobody can test.</strong> “The system shall be intelligent and user-friendly” can't be scored. “Answers 80% of the attached 100 questions correctly” can.</li>
<li><strong>Summaries of bids instead of bids.</strong> Caveats and exclusions are what summaries drop first.</li>
<li><strong>Demos on the vendor's data.</strong> Everything works on curated examples. Use yours.</li>
<li><strong>Uploading confidential bids to public tools.</strong> Supplier pricing is commercially sensitive, and often covered by confidentiality terms.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take an AI tool your organisation uses or is considering. Find the vendor's answers to three questions: is our data used for training, what happens when the model changes, and who's liable for wrong outputs. Note which answers you could point to in a contract.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A vendor's benchmark tells you how it will perform for you.</dt><dd>Benchmarks use someone else's data. Trial it on yours.</dd>
<dt>“Enterprise-ready” means secure and compliant.</dt><dd>It's a marketing term. Ask for reports, contract terms and specifics.</dd>
<dt>Once bought, an AI product behaves the same over time.</dt><dd>Vendors update models. Contract for notice and the right to re-test.</dd>
<dt>Procurement is only about price and features.</dt><dd>For AI, data use, model changes and exit matter as much.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Turn every vendor claim into a question only evidence can answer.</li>
<li>Trial on your own data, with a measure agreed in advance.</li>
<li>Get data use, retention and location into the contract.</li>
<li>Plan for model changes and for leaving.</li>
<li>Score answers on specificity, not on confidence.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Which vendor answer about training on your data is best?</p><ul>
<li data-fb="No answer at all.">“We take privacy and security very seriously.”</li>
<li data-fb="Right. Specific and contractual.">“Not used for training by default; see DPA section 4.2.”</li>
<li data-fb="Vague.">“We follow all industry best practices.”</li>
<li data-fb="Doesn't answer the question.">“Our AI is trained on high-quality, carefully curated data from trusted sources.”</li>
</ul></div>
<div class="check" data-a="3"><p class="q">How should you check a vendor's accuracy claim?</p><ul>
<li data-fb="Useful, but still not your data.">Ask for the benchmark's methodology document.</li>
<li data-fb="Comparing claims isn't testing.">Compare their claim with competitors' claims.</li>
<li data-fb="Not specific to your use.">Read online reviews from other customers.</li>
<li data-fb="Right. Your data is the test.">Trial the product on your own past examples.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why ask how a vendor handles model changes?</p><ul>
<li data-fb="Right. You need notice and a chance to re-test.">Behaviour can change when the model changes, affecting your results.</li>
<li data-fb="Not always, but you need to know.">Model changes always make products worse.</li>
<li data-fb="No such general rule.">Regulators require vendors never to change the models used by existing customers.</li>
<li data-fb="Not the main reason.">So you can negotiate a lower price at each change.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What should a good exit answer include?</p><ul>
<li data-fb="Not an answer.">A promise that you'll never want to leave.</li>
<li data-fb="Unrelated.">A discount for renewing early.</li>
<li data-fb="Right. Concrete and actionable.">Export formats for data and configuration, and timescales.</li>
<li data-fb="Unrelated.">A list of other customers who stayed with them after considering leaving.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What does government AI procurement guidance emphasise?</p><ul>
<li data-fb="Capability isn't the starting point.">Choosing the most advanced model available.</li>
<li data-fb="Right. The whole life of the system.">Defining the problem, testing with your data, and planning for change and exit.</li>
<li data-fb="Size isn't evidence.">Buying from the largest, most established vendor available to reduce delivery risk.</li>
<li data-fb="Not the guidance.">Avoiding AI products entirely in the public sector.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>UK Office for Artificial Intelligence (2020), <a href="https://www.gov.uk/government/publications/guidelines-for-ai-procurement" target="_blank" rel="noopener">Guidelines for AI procurement</a>. Best practice for evaluating and buying AI, written for the public sector.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>, including the Generative AI Profile (NIST AI 600-1, 2024).</li>

<li>UK Government (2025), <a href="https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government" target="_blank" rel="noopener">AI Playbook for the UK Government</a>. Principles and guidance for buying and using AI, including procurement.</li>
</ol></section>
`
});
