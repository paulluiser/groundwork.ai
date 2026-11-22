GW.lesson({
  id: "team-adoption",
  reviewed: "2026-11",
  lede: "Individual habits only go so far. When a whole team uses AI, you need shared answers: which tools, which data, how work is reviewed, and how you'll know it's helping. The lesson ends with a capstone that follows one feature through seven roles.",
  outcomes: [
    "Design a small, measurable AI pilot for a team.",
    "Choose measures of outcomes rather than measures of activity.",
    "Write team agreements covering tools, data, review and disclosure.",
    "Apply the course's method across a whole feature, from research to operations.",
    "Complete a capstone project: a pilot plan, a reviewed work sample and a team agreement, assessed against a rubric."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your director has read about AI productivity gains and wants your team “using AI properly” by next quarter. Half the team already uses three different tools, two people avoid them entirely, and nobody knows whether anything is actually faster. There's no budget for a consultant and no shared rules.</p>
<p>This final lesson pulls the course together into what a team needs: a pilot with evidence, agreements everyone understands, and the habits that keep expertise sharp. It ends with a capstone project you complete on your own work.</p></div>
<div class="check warmup" data-a="3"><p class="q">A director asks the team to “use AI more”. What's the most useful first step?</p><ul>
<li data-fb="Tools without a question to answer produce scattered use and no evidence.">Buy licences for the most popular assistant for everyone on the team straight away.</li>
<li data-fb="An activity target, easy to game and unrelated to outcomes.">Set a target for the share of work done with AI by the end of the quarter.</li>
<li data-fb="Produces opinions, not evidence.">Ask each person to try whatever tools they like and report back informally.</li>
<li data-fb="Right. A pilot produces evidence you can act on.">Pick two or three tasks, measure a baseline, and run a time-boxed pilot.</li>
</ul></div>
<h2>Start with a pilot, not a mandate</h2>
<p>“Everyone should use AI more” produces scattered experiments and no evidence. A pilot produces evidence you can act on.</p>
<ol class="steps">
<li><strong>Pick two or three specific tasks</strong>Choose work that is frequent and where checking is cheap: the “use freely” and “check every time” regions from lesson 6. For example: drafting test cases, summarising meetings, writing release notes, explaining unfamiliar code.</li>
<li><strong>Measure a baseline first</strong>How long do these tasks take now, and how often does the result need rework? Two weeks of simple records is enough.</li>
<li><strong>Write down what you expect</strong>“We expect test-case drafting to take 40% less time with no increase in escaped defects.” A written prediction stops you rationalising whatever happens.</li>
<li><strong>Time-box it</strong>Four to six weeks, a small group, the agreements below in place.</li>
<li><strong>Review honestly</strong>Keep what worked, drop what didn't, and widen only what has evidence behind it.</li>
</ol>

<h2>Measure outcomes, not activity</h2>
<p>What you measure shapes behaviour. Measures of AI <em>activity</em> are easy to collect and easy to game; measures of <em>outcomes</em> tell you whether the work got better.</p>
<div class="tbl"><table>
<thead><tr><th>Avoid as a goal</th><th>Why</th><th>Prefer</th></tr></thead>
<tbody>
<tr><td>Lines of code generated; % of code written by AI</td><td>More code isn't more value; it's more to review and maintain.</td><td>Time from starting work to running in production; rework and change failure rate.</td></tr>
<tr><td>Number of prompts or active users</td><td>Measures adoption, not benefit.</td><td>Time to a <em>checked</em> result, including review.</td></tr>
<tr><td>Self-reported time saved, on its own</td><td>Perception and measurement can diverge sharply.<sup>[1]</sup></td><td>Measured task times against the baseline, plus self-reports.</td></tr>
<tr><td>Speed alone</td><td>Faster and worse isn't a win.</td><td>Escaped defects, customer-facing errors, stakeholder corrections, alongside speed.</td></tr>
</tbody></table></div>
<p>Remember the evidence from earlier lessons: experienced developers who felt 20% faster were measured 19% slower,<sup>[1]</sup> and a large industry survey associated higher AI adoption with slightly lower delivery stability.<sup>[2]</sup> Neither result means AI doesn't help. Both mean you should measure in your own context.</p>

<h2>Team agreements</h2>
<p>A short written agreement prevents most problems before they start. It answers the questions people otherwise answer differently in private. Frameworks such as the NIST AI Risk Management Framework emphasise this kind of clear governance: defined roles, policies and accountability.<sup>[3]</sup> For a team, one page is enough.</p>

<div class="activity"><div class="activity-h"><span class="tag">Build it</span><span class="ttl">Draft your team's AI agreement</span></div><div class="activity-b">
<p>Choose the clauses that fit your team. The draft updates as you go. Copy it into your team's wiki and adapt the details with your security, privacy and legal contacts.</p>
<div data-w="agreement"></div>
</div></div>

<h2>The skill that matters more, not less</h2>
<p>Every lesson in this course has come back to the same point: checking AI output depends on knowing what right looks like. The QA engineer spotted the account-enumeration test because they know security. The analyst caught the MAU query because they knew the dashboard number. The on-call engineer discarded the invented log line because they read the real logs.</p>
<p>That has a consequence for teams. Expertise in your own discipline becomes <em>more</em> valuable, and newer colleagues need deliberate chances to build it: doing some tasks without AI, explaining AI-assisted work in their own words, pairing with experienced reviewers. A team that hands all first drafts to AI without this risks losing the ability to check them.</p>

<h2>Capstone: one feature, seven roles</h2>
<p>A retail team is building <b>saved carts</b>: logged-in customers' carts are kept for 30 days and appear on any device. Follow the feature through product, design, engineering, QA, project management, delivery and operations. At each step, someone has AI output in front of them and a decision to make. Choose what you'd do; the feedback links back to the lesson that covers it.</p>
<div class="activity"><div class="activity-h"><span class="tag">Capstone</span><span class="ttl">Saved carts, from idea to production</span></div><div class="activity-b">
<div data-w="scenario"></div>
</div></div>

<h2>Your capstone project</h2>
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
</div></div></div>
<h2>Where to go from here</h2>
<ul>
<li><strong>Do one “Try it this week” exercise</strong> from your role lesson, and write down what the check found.</li>
<li><strong>Bring the agreement draft</strong> to your next team meeting.</li>
<li><strong>Read a neighbouring role's lesson.</strong> Most AI-assisted work crosses roles, as the capstone showed.</li>
<li><strong>Come back to the reference material</strong> when you need it: the <a href="#glossary">glossary</a>, and the search (press <kbd>/</kbd>) for any topic.</li>
</ul>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Adoption is the goal.</dt><dd>Better outcomes are the goal. Adoption without evidence can make work slower or worse.</dd>
<dt>Team agreements slow people down.</dt><dd>A one-page agreement prevents the incidents and arguments that really slow teams down.</dd>
<dt>Once the team is trained, the job is done.</dt><dd>Tools, models and policies change. Revisit the agreement and the pilot results every quarter.</dd>
<dt>AI makes expertise less important.</dt><dd>Checking AI output depends on knowing what right looks like. Expertise matters more.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Start with a pilot on specific tasks, with a baseline and a written prediction.</li>
<li>Measure outcomes with quality guardrails, not activity.</li>
<li>Write a one-page team agreement: tools, data, review, disclosure, agents, learning.</li>
<li>Protect the expertise that makes checking possible, especially for newer colleagues.</li>
<li>Revisit the agreement and the evidence every quarter.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">A director proposes “percentage of code written by AI” as the team's main goal. What's the best response?</p><ul>
<li data-fb="An activity measure that invites gaming.">Agree, and set an ambitious target of 50% by the end of the next quarter.</li>
<li data-fb="Some measurement is useful; this measure isn't.">Refuse to measure anything about AI use at all.</li>
<li data-fb="Right. Outcomes show whether work got better.">Suggest outcome measures like lead time, rework and escaped defects, against a baseline.</li>
<li data-fb="Still an activity measure.">Agree, but only count code that has passed review before it's merged.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which task makes the best first pilot?</p><ul>
<li data-fb="Right. Frequent, and checking is cheap.">Drafting test cases from user stories, reviewed by QA as usual.</li>
<li data-fb="High-risk and legally sensitive.">Screening job applicants' CVs to speed up the hiring pipeline.</li>
<li data-fb="High stakes with no check.">Sending replies to customers automatically without any review step.</li>
<li data-fb="High stakes; people should approve.">Approving production deployments when the tests pass.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why write a prediction before a pilot starts?</p><ul>
<li data-fb="Not a vendor requirement.">Because tool vendors require it before agreeing to a trial period.</li>
<li data-fb="That biases the pilot.">So that the team knows what result leadership is hoping to see.</li>
<li data-fb="They don't.">Because predictions make the pilot shorter and cheaper to run.</li>
<li data-fb="Right. It keeps the evaluation honest.">So the result can't be rationalised into whatever anyone hoped.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Which clause belongs in a team AI agreement?</p><ul>
<li data-fb="A usage mandate, not an agreement on safe use.">Everyone must use AI for at least half of their daily tasks.</li>
<li data-fb="Right. Clear, enforceable data rules.">No customer personal data in any AI tool; confidential data only in approved ones.</li>
<li data-fb="Confidence isn't review.">AI output may be used without review if the tool is confident.</li>
<li data-fb="Arbitrary, and doesn't address risks.">Only senior engineers may use AI tools at work.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why do newer colleagues need some tasks done without AI?</p><ul>
<li data-fb="Right. You can't check what you don't understand.">To build the expertise needed to check AI output.</li>
<li data-fb="Cost isn't the reason.">Because AI tools are too expensive to give to everyone.</li>
<li data-fb="Not the main reason.">Because juniors make more mistakes with AI than seniors.</li>
<li data-fb="Not the reason.">So their work can be compared fairly with past hires.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Becker et al., METR (2025), <a href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener">Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity</a>.</li>
<li>DORA, <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>. The Govern function covers policies, roles and accountability.</li>
</ol></section>
`
});
