GW.lesson({
  id: "team-adoption",
  lede: "Individual habits only go so far. When a whole team uses AI, you need shared answers: which tools, which data, how work is reviewed, and how you'll know it's helping. The lesson ends with a capstone that follows one feature through seven roles.",
  outcomes: [
    "Design a small, measurable AI pilot for a team.",
    "Choose measures of outcomes rather than measures of activity.",
    "Write team agreements covering tools, data, review and disclosure.",
    "Apply the course's method across a whole feature, from research to operations."
  ],
  html: String.raw`
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

<h2>Where to go from here</h2>
<ul>
<li><strong>Do one “Try it this week” exercise</strong> from your role lesson, and write down what the check found.</li>
<li><strong>Bring the agreement draft</strong> to your next team meeting.</li>
<li><strong>Read a neighbouring role's lesson.</strong> Most AI-assisted work crosses roles, as the capstone showed.</li>
<li><strong>Come back to the reference material</strong> when you need it: the <a href="#glossary">glossary</a>, and the search (press <kbd>/</kbd>) for any topic.</li>
</ul>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">A director proposes tracking “percentage of code written by AI” as the team's main AI goal. What's the best response?</p><ul>
<li data-fb="That would push people toward generating more code, regardless of value.">Agree, and set a target of 50%.</li>
<li data-fb="Measuring is the right instinct; the measure is the problem.">Refuse to measure AI use at all.</li>
<li data-fb="Right. Track whether work gets faster and better: lead time, rework, defects, plus measured task times against a baseline.">Suggest outcome measures instead, such as lead time, rework and escaped defects, compared with a baseline.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which task makes the best first pilot?</p><ul>
<li data-fb="Right. Frequent, low-to-moderate stakes, and quick to check, so you get evidence fast and safely.">Drafting test cases from user stories, reviewed by the QA engineer as usual.</li>
<li data-fb="High-stakes, hard-to-check decisions about people are the worst place to start.">Screening job applicants' CVs.</li>
<li data-fb="Unreviewed customer communication is irreversible and external.">Sending customer replies automatically without review.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Becker et al., METR (2025), <a href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener">Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity</a>.</li>
<li>DORA, <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>.</li>
<li>NIST, <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">AI Risk Management Framework</a>. The Govern function covers policies, roles and accountability.</li>
</ol></section>
`
});
