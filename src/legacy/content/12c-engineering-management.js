GW.lesson({
  id: "engineering-management",
  reviewed: "2026-11",
  lede: "Engineering managers use AI for the writing that surrounds the job: plans, updates, notes and reviews. The work that matters most, decisions about people, is exactly where AI drafts need the most care.",
  outcomes: [
    "Use AI for planning, updates and meeting preparation, and keep decisions about people with people.",
    "Catch a generated performance summary that overstates, understates or invents.",
    "Set team norms for AI use that cover data, review and credit.",
    "Measure what AI tools change in outcomes, not just activity.",
    "Write performance feedback in which every judgement rests on specific, observed examples."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Review season. You have eight reports, a template, and an assistant that offers to draft each review from your 1:1 notes and their tickets. The first draft is polished and confident: “Alex consistently demonstrates strong ownership but could improve communication with stakeholders.”</p>
<p>You can't remember a single example of either. Neither can the assistant; it wrote the most typical sentence for a review. Alex will read every word and wonder which incidents you meant. This lesson is about where AI helps a manager, and why decisions about people need your evidence and your judgement.</p></div>
<div class="check warmup" data-a="0"><p class="q">An AI-drafted review says “could improve communication with stakeholders”. What should you check first?</p><ul>
<li data-fb="Right. Feedback without examples can't be acted on or challenged.">Which specific situations you observed that support it.</li>
<li data-fb="Templates don't make feedback fair.">Whether the phrasing matches the company's review template and its rating descriptions.</li>
<li data-fb="Consistency of wording isn't consistency of evidence.">Whether the other seven reviews contain similar phrases, so the team is treated consistently.</li>
<li data-fb="Activity data doesn't show communication.">Whether the assistant had access to this person's tickets and pull requests.</li>
</ul></div>
<h2>Where AI meets engineering management</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Status updates and stakeholder summaries</td><td><span class="fit good">Good fit</span></td><td>Check each claim against tickets and the team. Lesson 30 covers this in depth.</td></tr>
<tr><td>Preparing for one-to-ones and hard conversations</td><td><span class="fit good">Good fit</span></td><td>Rehearsing questions and framing is useful. Use your own notes, not private messages.</td></tr>
<tr><td>Planning documents and team charters</td><td><span class="fit good">Good fit</span></td><td>Structure and first drafts. The team should shape the content.</td></tr>
<tr><td>Drafting job descriptions and interview questions</td><td><span class="fit care">Use with care</span></td><td>Check for biased wording and requirements the role doesn't need.</td></tr>
<tr><td>Drafting performance feedback</td><td><span class="fit care">Use with care</span></td><td>Only from your own evidence. Check every claim and every adjective.</td></tr>
<tr><td>Ranking people, screening candidates, deciding pay or promotion</td><td><span class="fit human">Keep human</span></td><td>Accountability, fairness and law. Many jurisdictions treat these as high-risk uses of AI.<sup>[1]</sup></td></tr>
</tbody></table></div>

<h2>Worked example: a quarterly review draft</h2>
<p>A manager gives an assistant their quarter's notes on one engineer and asks for a first draft of written feedback. The draft reads well. Compare it with the notes.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the review against the notes</span></div><div class="activity-b">
<p>Flag every statement that goes beyond the notes, changes their meaning, or shouldn't be in the review.</p>
<div data-w="claims" data-cfg="em-review"></div>
</div></div>

<p>The draft didn't lie. It drifted in the ways summaries do:</p>
<ol class="steps">
<li><strong>Contributions were inflated</strong>“Contributed to the migration and owned the rollback runbook” became “led the migration end to end”. Overstating credit is unfair to the colleagues who did lead it, and it sets wrong expectations.</li>
<li><strong>A pattern was invented from an incident</strong>Two missed commitments in an on-call-heavy month became “struggles with commitment and reliability”. The notes give the context; the draft dropped it and generalised. This is the drift that does the most harm.</li>
<li><strong>A ranking appeared from nowhere</strong>The notes contain no comparison with other engineers. “Top 20%” is the kind of claim that ends up in a promotion case.</li>
<li><strong>An outcome was assumed</strong>The notes say Sam mentored Ade weekly. Whether that made Ade productive quickly is not in the notes. It may be true; ask Ade's onboarding buddy or look at the evidence.</li>
</ol>
<div class="key"><p>Feedback is a record about a person. Every sentence should trace back to evidence you would show them, and the judgment in it should be yours.</p></div>

<h2>People decisions stay with people</h2>
<p>There are good reasons to keep AI out of decisions about people, beyond the quality of the text:</p>
<ul>
<li><strong>Bias in, bias out.</strong> A widely reported recruiting model learned to downgrade CVs that mentioned women's organisations, because it was trained on past hiring.<sup>[2]</sup> Models summarising people can carry the same patterns.</li>
<li><strong>Regulation.</strong> The <a class="term" data-t="eu-ai-act">EU AI Act</a> classes AI used for recruitment, promotion, termination and task allocation as high-risk, with duties for the organisations that use it.<sup>[1]</sup> Check your company's policy before using any tool here (lesson 8).</li>
<li><strong>Trust.</strong> People are entitled to know their review was written by someone who knows their work.</li>
</ul>

<h2>Leading a team that uses AI</h2>
<p>Lesson 45 covers team agreements in depth. For managers, four things matter most:</p>
<ul>
<li><strong>Clear norms.</strong> Which tools are approved, what data can go in, and what review AI-assisted work needs.</li>
<li><strong>Growing junior engineers.</strong> If assistants write the first draft of everything, juniors can miss the practice that builds judgment. Pair them on reviews, and ask them to explain generated code they submit.</li>
<li><strong>Credit and ownership.</strong> The person who submits a change owns it, however it was written. Recognise good judgment, not volume.</li>
<li><strong>Measure outcomes.</strong> Lines of code and number of pull requests rise easily with AI. Delivery and stability metrics show whether things actually got better. Industry research has found AI adoption can coincide with slightly worse delivery stability, so measure your own team.<sup>[3]</sup></li>
</ul>

<h2>Feedback with evidence</h2>
<p>Useful feedback describes a situation, the behaviour you observed and its impact, then what you'd like to see. It's harder to write than adjectives, and it's the only kind people can act on. AI is useful around it: organising your notes by theme, checking that every judgement has an example, flagging vague or loaded words, and spotting when your language differs between people doing similar work. It can't supply the observations, and it shouldn't propose ratings.</p>
<h2>Worked example: from adjectives to evidence</h2>
<div class="worked">
<div class="wx"><b>AI draft</b><div><p>“Alex consistently demonstrates strong ownership but could improve communication with stakeholders. Alex is a valued team member with great potential.”</p></div></div>
<div class="wx strong"><b>Rewritten from your notes</b><div><p>“When the billing migration slipped in May, Alex took on the data cleanup nobody had claimed and finished it in two weeks, which kept the launch date. In the July planning review, finance learned about the reporting delay from the release notes rather than from us; next quarter I'd like Alex to give stakeholders a heads-up as soon as a date is at risk.”</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>“Strong ownership” became an incident, an action and an impact.</strong></li>
<li><strong>“Improve communication” became one specific situation and one specific ask.</strong></li>
<li><strong>“Great potential” disappeared.</strong> It's praise with no information, and language like it is unevenly distributed across people.</li>
<li><strong>The assistant's job here:</strong> “For each judgement in my draft, show me the note that supports it, and flag any that have none.”</li>
</ul>
<h2>Your turn: rewrite review feedback</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Turn generic feedback into evidence-based feedback</span></div><div class="activity-b">
<p>Your notes for Sam include: led the incident review after the March outage and wrote the clearest postmortem the team has had; missed two sprint commitments in Q2 without flagging them early; mentored the new graduate through their first on-call. The AI draft says: <em>“Sam is a strong technical contributor and team player who should work on time management.”</em> Rewrite it.</p>
<div data-w="task" data-key="em-feedback">
<div class="task-model"><p>“After the March outage, Sam led the incident review and wrote the clearest postmortem the team has produced; two other teams have since reused its format. Sam also mentored Priya through her first on-call rotation, and she said it was the main reason she felt ready.</p>
<p>In Q2, two sprint commitments slipped without warning, and we found out at the review. Next quarter, I'd like Sam to flag risk to a commitment as soon as it appears, even if it might still be recovered.”</p></div>
<ul class="task-rubric">
<li>Each strength is tied to a specific situation and its impact</li>
<li>The development point describes what happened, not a personality trait</li>
<li>The ask for next quarter is specific and achievable</li>
<li>Vague labels like “team player” and “time management” are gone</li>
<li>Nothing in it is unsupported by your notes</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Confidential notes in unapproved tools.</strong> Performance notes, salary details and health information need the strictest handling.</li>
<li><strong>Summaries of people from their messages.</strong> Using AI to analyse a team member's chat or code activity for a review is surveillance in most people's eyes, and may be unlawful.</li>
<li><strong>Same voice for everyone.</strong> Generated feedback tends to sound alike across a team. People notice, and it reads as not caring.</li>
<li><strong>Productivity targets set from vendor claims.</strong> Base expectations on what your team measures, not on headlines.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take last week's status update. Ask an assistant to draft it from your raw notes and the ticket board. Mark every sentence you had to change and why. Then agree with your team which parts of the update the tool should and shouldn't draft.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI makes reviews fairer because it's neutral.</dt><dd>It reproduces patterns from its training and your notes, including biased language. Check for evidence and consistency.</dd>
<dt>Activity data shows who's performing well.</dt><dd>Tickets and commits measure activity, not impact or quality. They're context, not ratings.</dd>
<dt>Using AI for hiring screens is fine if a person makes the final call.</dt><dd>Screening shapes who reaches that person. Hiring uses are high-risk under the EU AI Act.[1]</dd>
<dt>Managers who use AI for reviews save time without trade-offs.</dt><dd>Drafting gets faster; gathering evidence doesn't. Budget the time for that.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Use AI to organise notes, flag vague words and check every judgement has evidence.</li>
<li>Feedback describes situation, behaviour and impact, then a specific ask.</li>
<li>Don't let AI propose ratings or rankings of people.</li>
<li>Activity data is context, not a measure of performance.</li>
<li>Hiring and evaluation uses of AI carry legal obligations; involve HR and legal.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">Which is the best use of an assistant when writing a performance review?</p><ul>
<li data-fb="Activity data isn't performance, and ratings stay with you.">Generating a rating for each person from their ticket and commit history this quarter.</li>
<li data-fb="It can't supply your observations.">Writing the full review from scratch so it sounds professional and consistent with the others.</li>
<li data-fb="Right. It helps you keep feedback evidence-based.">Checking that every judgement in your draft is supported by one of your notes.</li>
<li data-fb="Ranking people is your judgement, not the model's.">Ranking the team from strongest to weakest to help calibration discussions.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What makes feedback actionable?</p><ul>
<li data-fb="Adjectives don't say what to repeat or change.">Positive adjectives that motivate the person and balance out any criticism given.</li>
<li data-fb="Right. The person knows exactly what you mean.">A specific situation, the behaviour observed, its impact, and a clear ask.</li>
<li data-fb="A rating alone isn't actionable.">A rating on a five-point scale with a short justification in the margin.</li>
<li data-fb="Framework language can still be vague.">Wording that matches the company competency framework exactly, section by section.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why remove phrases like “great potential” from a review?</p><ul>
<li data-fb="Length isn't the issue.">They're too short to count as meaningful feedback in most review templates.</li>
<li data-fb="Not generally banned.">They're banned by most HR policies and can't be used in formal reviews.</li>
<li data-fb="Tone mismatch isn't the main problem.">They make the review sound too positive for the rating that was given.</li>
<li data-fb="Right. Vague praise isn't evidence.">They carry no information and are often unevenly applied across people.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Under the EU AI Act, where do AI tools for hiring and worker management fall?</p><ul>
<li data-fb="Right. Employment is listed in Annex III.">High-risk, with obligations for oversight, data quality and documentation.</li>
<li data-fb="Human review doesn't change the category.">Minimal risk, as long as a human reads the output before acting on it.</li>
<li data-fb="High-risk, not prohibited.">Prohibited in all cases, everywhere in the European Union.</li>
<li data-fb="Employment uses are explicitly covered.">Outside the Act entirely, since they only process internal company data.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An assistant drafts reviews with noticeably different language for people doing similar work. What should you do?</p><ul>
<li data-fb="Differences may reflect bias in notes or the model.">Accept it, since each review was drafted from that person's own notes and tickets.</li>
<li data-fb="Rewording doesn't fix the evidence.">Regenerate the reviews until the wording comes out more similar across the team.</li>
<li data-fb="Right. Language should follow evidence.">Check whether the evidence differs, and fix language that doesn't match it.</li>
<li data-fb="Its self-assessment isn't a check.">Ask the assistant whether any of its drafts contain biased language.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>European Union, <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">Regulation (EU) 2024/1689, the AI Act</a>. Annex III lists employment and worker management among high-risk uses.</li>
<li>Reuters (2018), <a href="https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G" target="_blank" rel="noopener">Amazon scraps secret AI recruiting tool that showed bias against women</a>.</li>
<li>DORA, <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>. Findings on AI adoption, throughput and stability.</li>
</ol></section>
`
});
