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
  lede: "Project managers sit between a lot of people: sponsors, users, suppliers. AI can help map stakeholders, draft communications and prepare tender documents. More and more, you're also the one buying AI products, which means asking questions that a sales deck isn't built to answer.",
  outcomes: [
    "Use AI to draft stakeholder maps and communications, checked against what you know about the people.",
    "Draft tender documents and requirements with AI, with requirements you can test.",
    "Ask an AI vendor the right questions about data, accuracy, model changes and liability.",
    "Tell a specific, testable vendor answer from a vague one."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Tender requirements nobody can test.</strong> “The system shall be intelligent and user-friendly” can't be scored. “Answers 80% of the attached 100 questions correctly” can.</li>
<li><strong>Summaries of bids instead of bids.</strong> Caveats and exclusions are what summaries drop first.</li>
<li><strong>Demos on the vendor's data.</strong> Everything works on curated examples. Use yours.</li>
<li><strong>Uploading confidential bids to public tools.</strong> Supplier pricing is commercially sensitive, and often covered by confidentiality terms.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take an AI tool your organisation uses or is considering. Find the vendor's answers to three questions: is our data used for training, what happens when the model changes, and who's liable for wrong outputs. Note which answers you could point to in a contract.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">A vendor says their AI is “95% accurate”. What's the best next step?</p><ul>
<li data-fb="95% of what, measured how? The number alone tells you little.">Accept it; 95% is high.</li>
<li data-fb="A higher number without a method is no better.">Ask a competitor for their figure.</li>
<li data-fb="Right. Method, data, and a trial on your own cases.">Ask how it was measured and on what data, and test it on your own examples.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which tender requirement is best written?</p><ul>
<li data-fb="Right. It's specific and testable.">The system correctly answers at least 80 of the attached 100 sample questions.</li>
<li data-fb="Can't be tested or scored.">The system uses state-of-the-art AI.</li>
<li data-fb="Too vague to score.">The system is accurate and reliable.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">You tailor one project update into versions for the sponsor and the team. What should you check?</p><ul>
<li data-fb="Length can differ; facts shouldn't.">That they're the same length.</li>
<li data-fb="Right. Tailoring changes emphasis; it shouldn't change facts like risk status.">That facts, such as the status of each risk, are the same in both.</li>
<li data-fb="Tone can reasonably differ by audience.">That they use the same tone.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>UK Office for Artificial Intelligence (2020), <a href="https://www.gov.uk/government/publications/guidelines-for-ai-procurement" target="_blank" rel="noopener">Guidelines for AI procurement</a>. Best practice for evaluating and buying AI, written for the public sector.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>, including the Generative AI Profile (NIST AI 600-1, 2024).</li>
</ol></section>
`
});
