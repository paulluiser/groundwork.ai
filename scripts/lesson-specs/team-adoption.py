SPEC = dict(
file="14-team-adoption.js",
reviewed="2026-11",
before="<h2>Where to go",
outcomes=["Complete a capstone project: a pilot plan, a reviewed work sample and a team agreement, assessed against a rubric."],
situation="""<p>Your director has read about AI productivity gains and wants your team “using AI properly” by next quarter. Half the team already uses three different tools, two people avoid them entirely, and nobody knows whether anything is actually faster. There's no budget for a consultant and no shared rules.</p>
<p>This final lesson pulls the course together into what a team needs: a pilot with evidence, agreements everyone understands, and the habits that keep expertise sharp. It ends with a capstone project you complete on your own work.</p>""",
warmup=dict(q="A director asks the team to “use AI more”. What's the most useful first step?", a=3, opts=[
  ("Buy licences for the most popular assistant for everyone on the team straight away.", "Tools without a question to answer produce scattered use and no evidence."),
  ("Set a target for the share of work done with AI by the end of the quarter.", "An activity target, easy to game and unrelated to outcomes."),
  ("Ask each person to try whatever tools they like and report back informally.", "Produces opinions, not evidence."),
  ("Pick two or three tasks, measure a baseline, and run a time-boxed pilot.", "Right. A pilot produces evidence you can act on."),
 ]),
sections="""<h2>Your capstone project</h2>
<p>The capstone applies the course to your own work. It has three parts; each takes 20 to 40 minutes. Your answers stay in this browser. Compare each with the model answer and score it against the rubric honestly. If you can, share the finished pieces with your manager or team: together they're a ready-made proposal for your next quarter.</p>
<div class="tbl"><table><thead><tr><th>Part</th><th>What you produce</th><th>Course lessons it draws on</th></tr></thead><tbody>
<tr><td>1. Pilot plan</td><td>Tasks, baseline, prediction, measures and decision rule</td><td>Checking the work (6), measuring (35), this lesson</td></tr>
<tr><td>2. Reviewed work sample</td><td>One real AI-assisted piece of work with your check plan and what you found</td><td>Asking well (5), checking the work (6), your role track</td></tr>
<tr><td>3. Team agreement</td><td>One page: tools, data, review, disclosure and learning</td><td>Data and security (8), tools and agents (7), this lesson</td></tr>
</tbody></table></div>

<div class="activity"><div class="activity-h"><span class="tag">Capstone</span><span class="ttl">Part 1: a pilot plan for your team</span></div><div class="activity-b">
<p>Write a pilot plan for your team: two or three tasks to try, the baseline you'll measure first, a written prediction, the measures (including a quality guardrail), the group and the length, and the decision rule.</p>
<div data-w="task" data-key="capstone-pilot" data-min="120">
<div class="task-model"><ul>
<li><strong>Tasks:</strong> drafting test cases from user stories; summarising customer interviews; writing release notes.</li>
<li><strong>Baseline (2 weeks):</strong> time per task from a simple log; rework measured as test cases added later in review, synthesis corrections, release-note fixes.</li>
<li><strong>Prediction:</strong> 30–40% less time on each task, with no increase in rework.</li>
<li><strong>Measures:</strong> time per task, rework (guardrail), a weekly two-question survey, and one escaped-defect count.</li>
<li><strong>Group and length:</strong> 5 volunteers across QA, product and delivery, 6 weeks, with the team agreement in place.</li>
<li><strong>Decision rule:</strong> keep and widen the tasks where time falls and rework doesn't rise; drop the rest; report both.</li>
</ul></div>
<ul class="task-rubric">
<li>Picks specific, frequent tasks where checking is cheap</li>
<li>Measures a baseline before starting</li>
<li>Writes a prediction in advance</li>
<li>Measures outcomes and includes a quality guardrail</li>
<li>States a decision rule agreed before results</li>
</ul>
</div></div></div>

<div class="activity"><div class="activity-h"><span class="tag">Capstone</span><span class="ttl">Part 2: a reviewed work sample</span></div><div class="activity-b">
<p>Take one real piece of AI-assisted work from your role this week (a draft, a query, a test plan, a summary, a reply). Describe: the request you used, your check plan, what each check found, what you changed, and what you'd do differently next time.</p>
<div data-w="task" data-key="capstone-sample" data-min="120">
<div class="task-model"><p><strong>Work:</strong> an AI-drafted SQL query for monthly churn, for a leadership deck.</p>
<p><strong>Request:</strong> included our churn definition (cancelled subscriptions, not inactivity), the metrics table to use, and last quarter's agreed figure to reproduce.</p>
<p><strong>Check plan and findings:</strong> reproduce last quarter (matched); check joins for fan-out (one join to events duplicated rows: removed); dates (BETWEEN excluded the last day: fixed); spot-check 10 customers (all correctly counted).</p>
<p><strong>Changed:</strong> the join and the date filter. The final number fell from 1,140 to 912.</p>
<p><strong>Next time:</strong> start from the metrics layer instead of raw tables; keep the query in the repository with a test.</p></div>
<ul class="task-rubric">
<li>Describes a real task from your own role</li>
<li>Shows a request that gave the context the model couldn't guess</li>
<li>Lists specific checks proportionate to the stakes</li>
<li>Reports what the checks found and what changed</li>
<li>Draws a lesson for next time</li>
</ul>
</div></div></div>

<div class="activity"><div class="activity-h"><span class="tag">Capstone</span><span class="ttl">Part 3: your team's agreement, in your words</span></div><div class="activity-b">
<p>Using the clause builder above as a starting point, write your team's one-page AI agreement in your own words. Cover: approved tools, data rules, review rules, disclosure, agents and actions, and how newer colleagues keep learning.</p>
<div data-w="task" data-key="capstone-agreement" data-min="150">
<div class="task-model"><ol>
<li><strong>Tools:</strong> we use [approved assistant] and [coding tool]. Others need security sign-off first.</li>
<li><strong>Data:</strong> no customer personal data, credentials or health data in any AI tool. Confidential data only in approved tools, and only what the task needs.</li>
<li><strong>Review:</strong> the author is responsible for AI-assisted work. Anything customer-facing, in production, or about money or people gets a second review.</li>
<li><strong>Disclosure:</strong> say in the pull request, document or ticket when AI drafted a substantial part, and how you checked it.</li>
<li><strong>Agents:</strong> agents propose; people approve anything that sends data out, changes production or touches money.</li>
<li><strong>Learning:</strong> newer colleagues do some tasks without AI, and explain AI-assisted changes in their own words.</li>
<li><strong>Review of this agreement:</strong> every quarter, with the pilot results.</li>
</ol></div>
<ul class="task-rubric">
<li>Names approved tools and how new ones get approved</li>
<li>Sets clear data rules by type of information</li>
<li>Makes the author responsible and defines when a second review is needed</li>
<li>Covers disclosure and limits on agent actions</li>
<li>Protects learning for newer colleagues, and sets a review date</li>
</ul>
</div></div></div>""",
myths=[
 ("Adoption is the goal.", "Better outcomes are the goal. Adoption without evidence can make work slower or worse."),
 ("Team agreements slow people down.", "A one-page agreement prevents the incidents and arguments that really slow teams down."),
 ("Once the team is trained, the job is done.", "Tools, models and policies change. Revisit the agreement and the pilot results every quarter."),
 ("AI makes expertise less important.", "Checking AI output depends on knowing what right looks like. Expertise matters more."),
],
recap=[
 "Start with a pilot on specific tasks, with a baseline and a written prediction.",
 "Measure outcomes with quality guardrails, not activity.",
 "Write a one-page team agreement: tools, data, review, disclosure, agents, learning.",
 "Protect the expertise that makes checking possible, especially for newer colleagues.",
 "Revisit the agreement and the evidence every quarter.",
],
checks=[
 dict(q="A director proposes “percentage of code written by AI” as the team's main goal. What's the best response?", a=2, opts=[
  ("Agree, and set an ambitious target of 50% by the end of the next quarter.", "An activity measure that invites gaming."),
  ("Refuse to measure anything about AI use at all.", "Some measurement is useful; this measure isn't."),
  ("Suggest outcome measures like lead time, rework and escaped defects, against a baseline.", "Right. Outcomes show whether work got better."),
  ("Agree, but only count code that has passed review before it's merged.", "Still an activity measure."),
 ]),
 dict(q="Which task makes the best first pilot?", a=0, opts=[
  ("Drafting test cases from user stories, reviewed by QA as usual.", "Right. Frequent, and checking is cheap."),
  ("Screening job applicants' CVs to speed up the hiring pipeline.", "High-risk and legally sensitive."),
  ("Sending replies to customers automatically without any review step.", "High stakes with no check."),
  ("Approving production deployments when the tests pass.", "High stakes; people should approve."),
 ]),
 dict(q="Why write a prediction before a pilot starts?", a=3, opts=[
  ("Because tool vendors require it before agreeing to a trial period.", "Not a vendor requirement."),
  ("So that the team knows what result leadership is hoping to see.", "That biases the pilot."),
  ("Because predictions make the pilot shorter and cheaper to run.", "They don't."),
  ("So the result can't be rationalised into whatever anyone hoped.", "Right. It keeps the evaluation honest."),
 ]),
 dict(q="Which clause belongs in a team AI agreement?", a=1, opts=[
  ("Everyone must use AI for at least half of their daily tasks.", "A usage mandate, not an agreement on safe use."),
  ("No customer personal data in any AI tool; confidential data only in approved ones.", "Right. Clear, enforceable data rules."),
  ("AI output may be used without review if the tool is confident.", "Confidence isn't review."),
  ("Only senior engineers may use AI tools at work.", "Arbitrary, and doesn't address risks."),
 ]),
 dict(q="Why do newer colleagues need some tasks done without AI?", a=0, opts=[
  ("To build the expertise needed to check AI output.", "Right. You can't check what you don't understand."),
  ("Because AI tools are too expensive to give to everyone.", "Cost isn't the reason."),
  ("Because juniors make more mistakes with AI than seniors.", "Not the main reason."),
  ("So their work can be compared fairly with past hires.", "Not the reason."),
 ]),
],
)
