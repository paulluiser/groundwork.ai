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
  reviewed: "2026-11",
  lede: "AI changes the people side of engineering management in three places: hiring, when candidates have the same tools your team does; onboarding, when a new starter can ask an assistant anything; and growth, when junior engineers can ship code they don't yet understand. This lesson covers each, and the rules that apply when AI touches decisions about people.",
  outcomes: [
    "Know when AI in hiring and evaluation is regulated, and what that requires.",
    "Redesign interviews to test understanding and judgment when candidates use AI.",
    "Use AI to speed up onboarding without losing the context only people have.",
    "Keep junior engineers learning, not just shipping.",
    "Design an interview exercise that assesses judgement when candidates can use AI."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your take-home coding exercise used to separate candidates clearly. This year, every submission is clean, tested and well documented, and the on-site interviews don't match: two strong take-homes came from candidates who couldn't explain their own code.</p>
<p>Candidates have the same AI tools your team does. Banning them is hard to enforce and tests something your team doesn't do. This lesson is about assessing what still matters, and about helping new and junior engineers keep learning when an assistant can answer any question.</p></div>
<div class="check warmup" data-a="2"><p class="q">Candidates now use AI for take-home exercises. What's the most useful response?</p><ul>
<li data-fb="Hard to enforce, and tests a way of working your team doesn't use.">Ban AI tools and ask candidates to sign a declaration that they didn't use any.</li>
<li data-fb="Burdens candidates without measuring judgement.">Make the take-home much longer and harder so AI can't complete all of it.</li>
<li data-fb="Right. Judgement is what still differentiates.">Assess how candidates review, explain and change code, with or without AI.</li>
<li data-fb="Loses useful signal.">Drop technical assessment entirely and rely on references from past employers.</li>
</ul></div>
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

<h2>Assess judgement, not output</h2>
<p>When output is cheap, the differentiating skills are the ones this course keeps returning to: knowing what right looks like, checking, explaining trade-offs, and changing course when evidence says so. Interview exercises can target those directly. Ask candidates to review a flawed pull request, extend their own take-home live, explain a design choice and its alternatives, or debug from real logs. Allow AI where your team allows it, and watch how they use it.</p>
<h2>Worked example: a review-based exercise</h2>
<div class="tbl"><table><thead><tr><th>Part</th><th>What the candidate does</th><th>What you assess</th></tr></thead><tbody>
<tr><td>Review (30 min)</td><td>Reviews a 150-line pull request with three planted issues: a security flaw, a missing edge case, an unclear name</td><td>Prioritisation: do they find the security flaw and rank it first?</td></tr>
<tr><td>Extend (30 min)</td><td>Adds a small feature to the same code, using AI if they wish, sharing their screen</td><td>How they brief the tool, check its output, and test</td></tr>
<tr><td>Discuss (20 min)</td><td>Explains one decision and an alternative they rejected</td><td>Understanding and trade-off reasoning</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Every part survives AI use</strong>, because it assesses judgement on code in front of them.</li>
<li><strong>A shared rubric</strong> for each part keeps scoring consistent across interviewers.</li>
<li><strong>Don't use AI to screen or score candidates</strong> without legal and HR involvement: hiring is a high-risk use under the EU AI Act, and some jurisdictions require bias audits of automated hiring tools.[1][2]</li>
</ul>
<h2>Keeping juniors learning</h2>
<p>An assistant can answer every question a new engineer has, which is useful, and can let them ship without building understanding, which isn't. Practical habits: some tasks done without AI first, explaining AI-assisted changes in their own words in the pull request, pairing on reviews of generated code, and on-call shadowing where the logs, not the assistant, are the source of truth.</p>
<h2>Your turn: design an interview exercise</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">An exercise that works when candidates use AI</span></div><div class="activity-b">
<p>Design a 60-minute interview exercise for a mid-level role on your team (or a backend role). Say what the candidate does, whether AI is allowed, and what you assess in each part.</p>
<div data-w="task" data-key="em-interview">
<div class="task-model"><ul>
<li><strong>Debug (25 min):</strong> a failing service with real logs and a short codebase; AI allowed. Assess: do they form hypotheses from evidence, or accept the first suggestion?</li>
<li><strong>Fix and test (20 min):</strong> fix the bug and add a test that would have caught it. Assess: does the test fail without the fix?</li>
<li><strong>Explain (15 min):</strong> what caused it, why the fix is right, and what else might break. Assess: understanding beyond the tool's output.</li>
</ul><p>Scored with a shared rubric; AI use itself is neither rewarded nor penalised, only judgement.</p></div>
<ul class="task-rubric">
<li>States clearly whether AI is allowed</li>
<li>Assesses judgement (review, debugging, trade-offs), not just output</li>
<li>Includes a part where the candidate explains their reasoning</li>
<li>Uses a shared rubric for consistent scoring</li>
<li>Avoids using AI to score candidates</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>“It's only a first pass.”</strong> In hiring, the first pass decides who's never seen.</li>
<li><strong>AI-detection tools.</strong> They're unreliable and can unfairly accuse candidates, including people writing in a second language.</li>
<li><strong>Personal data in prompts.</strong> CVs, reviews and 1:1 notes contain personal data. Use approved tools only (lesson 8).</li>
<li><strong>Measuring juniors by output.</strong> Output is easy for them to raise with AI. Understanding is what you need to grow.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take your current take-home or interview exercise and try it with an AI assistant. If it does most of the work, redesign the interview around explaining, extending and debugging the result.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Banning AI in interviews keeps assessment fair.</dt><dd>It's hard to enforce and tests a way of working your team doesn't use. Assess judgement instead.</dd>
<dt>AI screening of CVs removes human bias.</dt><dd>It can learn and scale historical bias, as Amazon's abandoned recruiting tool showed.[3]</dd>
<dt>Juniors learn faster with AI because they get answers instantly.</dt><dd>They ship faster. Learning needs deliberate practice without shortcuts, and explaining in their own words.</dd>
<dt>Onboarding docs matter less now that new starters can ask an assistant.</dt><dd>The assistant answers from the docs it's given. Good docs matter more.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>When output is cheap, assess review, explanation, debugging and trade-offs.</li>
<li>Decide and state whether AI is allowed in each interview part.</li>
<li>Don't let AI screen or score candidates without HR and legal involvement.</li>
<li>Give juniors tasks without AI and ask them to explain AI-assisted work.</li>
<li>Good onboarding docs matter more when assistants answer from them.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">Which interview part best assesses judgement when candidates can use AI?</p><ul>
<li data-fb="Right. Finding and prioritising problems needs judgement.">Reviewing a pull request with planted issues and ranking them.</li>
<li data-fb="Tests recall, not how they'd work.">Writing a standard algorithm from memory without any tools on a whiteboard.</li>
<li data-fb="AI can produce most of the output.">Completing a long take-home project over a weekend without supervision.</li>
<li data-fb="Easily looked up; little signal.">Answering trivia questions about language features and library versions.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Why involve HR and legal before using AI to screen CVs?</p><ul>
<li data-fb="Not the reason.">Because AI tools can't read PDF files reliably enough for screening at volume.</li>
<li data-fb="Cost isn't the main concern.">Because screening tools are too expensive for most engineering budgets.</li>
<li data-fb="Right. Legal obligations and bias risks apply.">Hiring is high-risk under the EU AI Act, and some places require bias audits.</li>
<li data-fb="Not generally required in that form.">Because candidates must approve every tool used in their assessment in advance.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Which habit best helps a junior engineer learn while using AI?</p><ul>
<li data-fb="Speed without understanding.">Using AI for every task from the first day, so they ship as quickly as possible.</li>
<li data-fb="Too restrictive and unrealistic.">Never using AI at all until they've been on the team for a full year.</li>
<li data-fb="Loses human feedback and context.">Asking the AI to explain the code instead of asking colleagues questions.</li>
<li data-fb="Right. Explaining builds and shows understanding.">Explaining AI-assisted changes in their own words in the pull request.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What did Amazon's abandoned recruiting tool illustrate?</p><ul>
<li data-fb="The opposite lesson.">AI recruiting tools are always more accurate than human recruiters at scale.</li>
<li data-fb="Right. It downgraded CVs associated with women.">Models trained on past hiring data can learn and repeat its biases.</li>
<li data-fb="Bias shapes the shortlist itself.">Recruiting tools work well once a human reviews the shortlist they produce.</li>
<li data-fb="Size doesn't prevent bias.">Only small companies face bias problems with automated screening tools.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Should AI use in a live interview be rewarded or penalised?</p><ul>
<li data-fb="Right. The rubric scores judgement.">Neither: assess the judgement shown, whatever tools are used.</li>
<li data-fb="Use alone isn't judgement.">Rewarded, since using AI well is the most important skill for the role.</li>
<li data-fb="Judgement still shows through review and explanation.">Penalised, since it hides what the candidate really knows and can do.</li>
<li data-fb="Inconsistent scoring is unfair.">Left to each interviewer to decide in the moment.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>European Union, <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">Regulation (EU) 2024/1689, the AI Act</a>. Annex III lists recruitment, selection and worker evaluation among high-risk uses.</li>
<li>NYC Department of Consumer and Worker Protection, <a href="https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page" target="_blank" rel="noopener">Automated Employment Decision Tools (Local Law 144)</a>. Bias audits and notice requirements, enforced since July 2023.</li>
<li>Reuters (2018), <a href="https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G" target="_blank" rel="noopener">Amazon scraps secret AI recruiting tool that showed bias against women</a>.</li>
</ol></section>
`
});
