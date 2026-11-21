GW.lesson({
  id: "engineering-management",
  lede: "Engineering managers use AI for the writing that surrounds the job: plans, updates, notes and reviews. The work that matters most, decisions about people, is exactly where AI drafts need the most care.",
  outcomes: [
    "Use AI for planning, updates and meeting preparation, and keep decisions about people with people.",
    "Catch a generated performance summary that overstates, understates or invents.",
    "Set team norms for AI use that cover data, review and credit.",
    "Measure what AI tools change in outcomes, not just activity."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Confidential notes in unapproved tools.</strong> Performance notes, salary details and health information need the strictest handling.</li>
<li><strong>Summaries of people from their messages.</strong> Using AI to analyse a team member's chat or code activity for a review is surveillance in most people's eyes, and may be unlawful.</li>
<li><strong>Same voice for everyone.</strong> Generated feedback tends to sound alike across a team. People notice, and it reads as not caring.</li>
<li><strong>Productivity targets set from vendor claims.</strong> Base expectations on what your team measures, not on headlines.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take last week's status update. Ask an assistant to draft it from your raw notes and the ticket board. Mark every sentence you had to change and why. Then agree with your team which parts of the update the tool should and shouldn't draft.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">A generated review says an engineer “struggles with reliability”. Your notes mention two missed commitments during a heavy on-call month. What do you do?</p><ul>
<li data-fb="The notes don't support a general pattern, and the context matters.">Keep it; it's a fair summary.</li>
<li data-fb="Right. Say what happened, with its context, and decide yourself whether there's a pattern.">Replace it with what happened, including the context.</li>
<li data-fb="Removing it hides a real issue. Describe it accurately instead.">Remove any mention of missed commitments.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which of these is the most appropriate use of AI for a manager?</p><ul>
<li data-fb="Right. Preparation from your own notes, with the conversation and judgment staying with you.">Preparing questions for a difficult one-to-one.</li>
<li data-fb="This is a high-risk use with bias and legal concerns.">Ranking candidates by CV.</li>
<li data-fb="This is surveillance and likely against policy.">Analysing an engineer's chat messages for a review.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">After adopting a coding assistant, your team's pull requests double. What does that tell you?</p><ul>
<li data-fb="Activity rose. Whether outcomes improved is a separate question.">That productivity doubled.</li>
<li data-fb="It may be fine. You need other measures to tell.">That code quality fell.</li>
<li data-fb="Right. Look at delivery, stability and quality measures too.">Not much on its own; check outcomes such as lead time and failure rate.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>European Union, <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">Regulation (EU) 2024/1689, the AI Act</a>. Annex III lists employment and worker management among high-risk uses.</li>
<li>Reuters (2018), <a href="https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G" target="_blank" rel="noopener">Amazon scraps secret AI recruiting tool that showed bias against women</a>.</li>
<li>DORA, <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>. Findings on AI adoption, throughput and stability.</li>
</ol></section>
`
});
