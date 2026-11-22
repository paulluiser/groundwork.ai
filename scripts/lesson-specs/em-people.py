SPEC = dict(
file="12c-3-em-people.js",
reviewed="2026-11",
outcomes=["Design an interview exercise that assesses judgement when candidates can use AI."],
situation="""<p>Your take-home coding exercise used to separate candidates clearly. This year, every submission is clean, tested and well documented, and the on-site interviews don't match: two strong take-homes came from candidates who couldn't explain their own code.</p>
<p>Candidates have the same AI tools your team does. Banning them is hard to enforce and tests something your team doesn't do. This lesson is about assessing what still matters, and about helping new and junior engineers keep learning when an assistant can answer any question.</p>""",
warmup=dict(q="Candidates now use AI for take-home exercises. What's the most useful response?", a=2, opts=[
  ("Ban AI tools and ask candidates to sign a declaration that they didn't use any.", "Hard to enforce, and tests a way of working your team doesn't use."),
  ("Make the take-home much longer and harder so AI can't complete all of it.", "Burdens candidates without measuring judgement."),
  ("Assess how candidates review, explain and change code, with or without AI.", "Right. Judgement is what still differentiates."),
  ("Drop technical assessment entirely and rely on references from past employers.", "Loses useful signal."),
 ]),
sections="""<h2>Assess judgement, not output</h2>
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
</div></div></div>""",
myths=[
 ("Banning AI in interviews keeps assessment fair.", "It's hard to enforce and tests a way of working your team doesn't use. Assess judgement instead."),
 ("AI screening of CVs removes human bias.", "It can learn and scale historical bias, as Amazon's abandoned recruiting tool showed.[3]"),
 ("Juniors learn faster with AI because they get answers instantly.", "They ship faster. Learning needs deliberate practice without shortcuts, and explaining in their own words."),
 ("Onboarding docs matter less now that new starters can ask an assistant.", "The assistant answers from the docs it's given. Good docs matter more."),
],
recap=[
 "When output is cheap, assess review, explanation, debugging and trade-offs.",
 "Decide and state whether AI is allowed in each interview part.",
 "Don't let AI screen or score candidates without HR and legal involvement.",
 "Give juniors tasks without AI and ask them to explain AI-assisted work.",
 "Good onboarding docs matter more when assistants answer from them.",
],
checks=[
 dict(q="Which interview part best assesses judgement when candidates can use AI?", a=0, opts=[
  ("Reviewing a pull request with planted issues and ranking them.", "Right. Finding and prioritising problems needs judgement."),
  ("Writing a standard algorithm from memory without any tools on a whiteboard.", "Tests recall, not how they'd work."),
  ("Completing a long take-home project over a weekend without supervision.", "AI can produce most of the output."),
  ("Answering trivia questions about language features and library versions.", "Easily looked up; little signal."),
 ]),
 dict(q="Why involve HR and legal before using AI to screen CVs?", a=2, opts=[
  ("Because AI tools can't read PDF files reliably enough for screening at volume.", "Not the reason."),
  ("Because screening tools are too expensive for most engineering budgets.", "Cost isn't the main concern."),
  ("Hiring is high-risk under the EU AI Act, and some places require bias audits.", "Right. Legal obligations and bias risks apply."),
  ("Because candidates must approve every tool used in their assessment in advance.", "Not generally required in that form."),
 ]),
 dict(q="Which habit best helps a junior engineer learn while using AI?", a=3, opts=[
  ("Using AI for every task from the first day, so they ship as quickly as possible.", "Speed without understanding."),
  ("Never using AI at all until they've been on the team for a full year.", "Too restrictive and unrealistic."),
  ("Asking the AI to explain the code instead of asking colleagues questions.", "Loses human feedback and context."),
  ("Explaining AI-assisted changes in their own words in the pull request.", "Right. Explaining builds and shows understanding."),
 ]),
 dict(q="What did Amazon's abandoned recruiting tool illustrate?", a=1, opts=[
  ("AI recruiting tools are always more accurate than human recruiters at scale.", "The opposite lesson."),
  ("Models trained on past hiring data can learn and repeat its biases.", "Right. It downgraded CVs associated with women."),
  ("Recruiting tools work well once a human reviews the shortlist they produce.", "Bias shapes the shortlist itself."),
  ("Only small companies face bias problems with automated screening tools.", "Size doesn't prevent bias."),
 ]),
 dict(q="Should AI use in a live interview be rewarded or penalised?", a=0, opts=[
  ("Neither: assess the judgement shown, whatever tools are used.", "Right. The rubric scores judgement."),
  ("Rewarded, since using AI well is the most important skill for the role.", "Use alone isn't judgement."),
  ("Penalised, since it hides what the candidate really knows and can do.", "Judgement still shows through review and explanation."),
  ("Left to each interviewer to decide in the moment.", "Inconsistent scoring is unfair."),
 ]),
],
)
