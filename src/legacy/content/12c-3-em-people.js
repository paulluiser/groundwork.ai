GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["people-calls"] = {
  steps: [
    { title: "Screening CVs", sit: "You have 400 applications for one backend role. HR suggests a tool that ranks CVs automatically and shows you the top 30.", opts: [
      ["Use it; it's only a first pass, and you'll interview people properly.", "A first pass decides who never gets seen. Automated ranking in hiring has a history of learning past bias, and in some places is regulated."],
      ["Check with HR and legal what rules apply, ask the vendor for its bias audit, and keep a person reviewing who gets rejected.", "Right. Hiring tools are a high-risk use under the EU AI Act, and New York City requires bias audits. Treat it as a regulated decision, not a convenience."],
      ["Ask an assistant to pick the best 30 CVs instead.", "Same problem, with no audit at all and no record of why people were rejected."]], a: 1 },
    { title: "Interviews when candidates have AI", sit: "Candidates in your take-home exercise are clearly using AI. Some submissions are nearly identical.", opts: [
      ["Ban AI and add plagiarism detection.", "Detectors for AI-written code and text are unreliable, and your engineers will use AI on the job anyway."],
      ["Allow AI openly, and spend the interview having them explain, extend and debug their submission live.", "Right. Test what matters on the job: understanding, judgment and debugging, with the tools they'll really use."],
      ["Drop the take-home and go back to whiteboard puzzles.", "Puzzles test something different from the job, and favour people who've practised puzzles."]], a: 1 },
    { title: "Onboarding a new engineer", sit: "A new engineer starts Monday. The team's codebase is large and the docs are thin.", opts: [
      ["Give them an assistant with access to the codebase, pair them with a buddy, and ask them to check what the assistant tells them against the code and the buddy.", "Right. AI makes exploring a codebase faster. A buddy supplies the context and history no model has, and catches confident wrong answers."],
      ["Give them an assistant instead of a buddy; it's available all the time.", "The assistant won't know why things are the way they are, who to ask, or what the team cares about."],
      ["Keep AI away from new starters until they know the codebase.", "It slows them down for no real benefit. Teach them to check its answers instead."]], a: 0 },
    { title: "A junior engineer's growth", sit: "A junior engineer is shipping a lot, fast. In review, they struggle to explain why their code works or what happens when it fails.", opts: [
      ["It's fine; output is what matters.", "If they can't explain the code, they can't debug it, review it or grow past it. The gap shows up in the first serious incident."],
      ["Ban them from using AI until they've learned the basics.", "Heavy-handed and hard to enforce. Better to change how they use it."],
      ["Agree with them on some work done without AI, ask them to explain their code in review, and use AI as a tutor that asks them questions.", "Right. Keep the practice that builds understanding: explaining, debugging and occasionally doing it the hard way."]], a: 2 },
    { title: "Feedback from AI-collected data", sit: "A tool offers to summarise each engineer's commits, reviews and messages into a monthly “contribution score”.", opts: [
      ["Decline. Use the data, if at all, as one input to your own conversations, and tell the team what you look at.", "Right. People decisions need context and fairness that a score can't give. Under the EU AI Act, monitoring and evaluating workers is a high-risk use too."],
      ["Use it, but only for the bottom performers.", "That's where mistakes hurt most, and scores miss invisible work like mentoring and incident response."],
      ["Use it without telling the team, so they don't game it.", "Secret monitoring destroys trust, and may break employment and data protection law."]], a: 0 }
  ],
  after: "AI can speed up the reading and preparation in people work. Decisions about hiring, evaluation and growth stay with you, with the law, fairness and the team's trust in mind."
};
GW.lesson({
  id: "em-people",
  lede: "AI changes the people side of engineering management in three places: hiring, when candidates have the same tools your team does; onboarding, when a new starter can ask an assistant anything; and growth, when junior engineers can ship code they don't yet understand. This lesson covers each, and the rules that apply when AI touches decisions about people.",
  outcomes: [
    "Know when AI in hiring and evaluation is regulated, and what that requires.",
    "Redesign interviews to test understanding and judgment when candidates use AI.",
    "Use AI to speed up onboarding without losing the context only people have.",
    "Keep junior engineers learning, not just shipping."
  ],
  html: String.raw`
<h2>Where AI fits in people work</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting job descriptions and interview questions</td><td><span class="fit good">Good fit</span></td><td>Good structure quickly. Check for requirements you don't actually need and wording that puts people off.</td></tr>
<tr><td>Helping new starters explore the codebase</td><td><span class="fit good">Good fit</span></td><td>Speeds up orientation. Pair with a person who knows the history.</td></tr>
<tr><td>Preparing for a 1:1 or a difficult conversation</td><td><span class="fit good">Good fit</span></td><td>Rehearse wording and anticipate questions. Keep personal details out of unapproved tools.</td></tr>
<tr><td>AI as a tutor for junior engineers</td><td><span class="fit care">Use with care</span></td><td>Helpful when it asks questions; harmful when it just supplies answers.</td></tr>
<tr><td>Screening or ranking candidates</td><td><span class="fit human">Keep human</span></td><td>High-risk and regulated in some places. Needs audits, oversight and legal advice.</td></tr>
<tr><td>Scoring performance</td><td><span class="fit human">Keep human</span></td><td>People decisions need context and fairness that a score can't give (lesson 36).</td></tr>
</tbody></table></div>

<h2>The rules on AI in hiring and evaluation</h2>
<p>The EU AI Act lists AI used for recruitment, selecting candidates, and monitoring or evaluating workers among its high-risk uses, with duties for oversight, data quality and transparency.<sup>[1]</sup> New York City's Local Law 144 requires employers using automated employment decision tools to have a bias audit within the past year, publish information about it, and notify candidates in advance.<sup>[2]</sup> Other places have their own rules, and more are coming. If AI touches who gets hired, promoted or managed out, talk to HR and legal first.</p>
<p>The reason is well documented. Amazon scrapped an experimental recruiting tool after finding it had learned to penalise CVs containing the word “women's”, because it was trained on a decade of mostly male hires.<sup>[3]</sup> The tool repeated the past, efficiently.</p>

<h2>Practice: make the call</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">AI and people decisions</span></div><div class="activity-b">
<p>Five situations from an engineering manager's quarter. Choose what you'd do.</p>
<div data-w="decide" data-cfg="people-calls"></div>
</div></div>

<ol class="steps">
<li><strong>Hiring tools are regulated decisions</strong>Ask what applies, ask for audits, and keep people reviewing who gets rejected.</li>
<li><strong>Interview for the job as it's done now</strong>Candidates will use AI at work. Test whether they understand, extend and debug what they produce.</li>
<li><strong>Onboarding needs people too</strong>An assistant explains code; a buddy explains why it's like that and who to ask.</li>
<li><strong>Growth needs practice</strong>Understanding comes from explaining and debugging, sometimes without help.</li>
</ol>
<div class="key"><p>AI can prepare, explain and draft. Decisions about people stay with people, with the law and the team's trust in mind.</p></div>

<h2>Keeping junior engineers learning</h2>
<p>Junior engineers with AI tools can produce working code before they understand it. That's fine for a while, and risky over time: they'll struggle to debug, review or design. Some practical habits:</p>
<ul>
<li><strong>Explain in review.</strong> Ask “why does this work?” and “what happens if this call fails?” as a normal part of review, for everyone.</li>
<li><strong>Use AI as a tutor.</strong> Ask it to give hints and ask questions, not write the solution.</li>
<li><strong>Some work without AI.</strong> Agree on occasional tasks done unassisted, especially debugging.</li>
<li><strong>Pair with seniors on hard problems,</strong> where judgment matters more than typing.</li>
</ul>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>“It's only a first pass.”</strong> In hiring, the first pass decides who's never seen.</li>
<li><strong>AI-detection tools.</strong> They're unreliable and can unfairly accuse candidates, including people writing in a second language.</li>
<li><strong>Personal data in prompts.</strong> CVs, reviews and 1:1 notes contain personal data. Use approved tools only (lesson 8).</li>
<li><strong>Measuring juniors by output.</strong> Output is easy for them to raise with AI. Understanding is what you need to grow.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take your current take-home or interview exercise and try it with an AI assistant. If it does most of the work, redesign the interview around explaining, extending and debugging the result.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">HR wants to use a tool that automatically ranks applicants. What should you do first?</p><ul>
<li data-fb="Right. Hiring tools are high-risk and regulated in some places, and need audits and oversight.">Check the legal requirements with HR and legal, and ask for the vendor's bias audit.</li>
<li data-fb="Reviewing only the top of the list doesn't fix bias in who was dropped.">Use it, and review only the top candidates carefully.</li>
<li data-fb="That keeps the risk and removes the audit trail.">Replace it with a general assistant you control.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">How should interviews change now that candidates use AI?</p><ul>
<li data-fb="Detectors are unreliable, and the job involves AI anyway.">Use AI-detection tools on submissions.</li>
<li data-fb="Puzzles test a different skill from the job.">Switch to algorithm puzzles on a whiteboard.</li>
<li data-fb="Right. Understanding and debugging are what the job needs.">Have candidates explain, extend and debug their work live.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">A junior engineer ships fast but can't explain their code. What's the best approach?</p><ul>
<li data-fb="Output without understanding fails when something breaks.">Leave it; they're productive.</li>
<li data-fb="Right. Build understanding through explaining, debugging and some unassisted work.">Ask them to explain their code in review, and agree on some work without AI.</li>
<li data-fb="Hard to enforce, and throws away a useful tool.">Ban AI tools for junior engineers.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>European Union, <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">Regulation (EU) 2024/1689, the AI Act</a>. Annex III lists recruitment, selection and worker evaluation among high-risk uses.</li>
<li>NYC Department of Consumer and Worker Protection, <a href="https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page" target="_blank" rel="noopener">Automated Employment Decision Tools (Local Law 144)</a>. Bias audits and notice requirements, enforced since July 2023.</li>
<li>Reuters (2018), <a href="https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G" target="_blank" rel="noopener">Amazon scraps secret AI recruiting tool that showed bias against women</a>.</li>
</ol></section>
`
});
