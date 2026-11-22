GW.lesson({
  id: "product",
  reviewed: "2026-11",
  lede: "Product managers turn messy evidence into decisions other people act on. AI is good at organising messy evidence and risky at making the decisions. This lesson shows where that line sits in everyday product work.",
  outcomes: [
    "Sort common product tasks into good fit, use with care, and keep human-owned.",
    "Synthesise customer research with AI while keeping every claim traceable to evidence.",
    "Check an AI research summary against its sources and spot overstated claims.",
    "Draft acceptance criteria with AI that engineering and QA can actually test.",
    "Write a product decision record where AI prepared the options and you own the call."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>It's Monday. You have twelve interview notes to synthesise before Thursday's planning, a one-pager to update for leadership, three user stories waiting for acceptance criteria, and a director asking why activation dipped last week. An assistant could draft all four before lunch.</p>
<p>Two of those drafts would be fine with a light edit. One would quietly overstate what customers said. One would answer the activation question with a confident number from the wrong table. This lesson is about knowing which is which before anyone acts on them.</p></div>
<div class="check warmup" data-a="2"><p class="q">An assistant drafts a one-pager that says “customers are asking for bulk export”. What's the first thing you should check?</p><ul>
<li data-fb="Style matters less than whether the claim is true.">Whether the sentence is written in the team's usual style.</li>
<li data-fb="Feasibility comes later. First, is the claim supported?">Whether bulk export is technically feasible for the team to build this quarter.</li>
<li data-fb="Right. A claim about customers needs evidence you can point to.">Which customers said it, how many, and where it's recorded.</li>
<li data-fb="Persuasive and true are different things; check truth first.">Whether leadership will find the request persuasive.</li>
</ul></div>
<h2>Where AI meets product work</h2>
<p>Most product work falls into three kinds: gathering evidence (interviews, feedback, data, market), deciding (what to build, in what order, and what not to build), and communicating (specs, updates, release notes). AI helps a lot with the first and third, and needs a firm boundary around the second.</p>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Turning interview notes into themes</td><td><span class="fit care">Use with care</span></td><td>Fast first pass. Can overgeneralise or invent. Require quotes and participant IDs; check them.</td></tr>
<tr><td>Drafting a PRD, one-pager or user stories</td><td><span class="fit good">Good fit</span></td><td>Great for structure and completeness. You supply the decisions and the reasoning.</td></tr>
<tr><td>Writing acceptance criteria</td><td><span class="fit good">Good fit</span></td><td>Good at happy paths and common edge cases. Review with QA and engineering.</td></tr>
<tr><td>Categorising survey free text</td><td><span class="fit care">Use with care</span></td><td>Saves hours. Hand-check a random sample of 20 to confirm the categories hold.</td></tr>
<tr><td>Competitor and market research</td><td><span class="fit care">Use with care</span></td><td>Facts, prices and features may be stale or invented. Verify every number you'll repeat.</td></tr>
<tr><td>Defining metrics and writing queries</td><td><span class="fit care">Use with care</span></td><td>Pin the definition first; test with known data (lesson 6).</td></tr>
<tr><td>Stakeholder updates and release notes</td><td><span class="fit good">Good fit</span></td><td>You provide the facts; it provides a clear draft.</td></tr>
<tr><td>Prioritisation and roadmap trade-offs</td><td><span class="fit human">Keep human</span></td><td>AI can list considerations. It can't weigh your strategy, commitments or constraints. You decide.</td></tr>
<tr><td>Using AI “personas” as research evidence</td><td><span class="fit human">Keep human</span></td><td><a class="term" data-t="synthetic-users">Synthetic users</a> generate typical-sounding opinions, not evidence about your customers.<sup>[1]</sup></td></tr>
</tbody></table></div>

<h2>Worked example: synthesising interviews</h2>
<p>You've run twelve customer interviews about reporting. You have twelve pages of notes and a planning meeting on Thursday. Here's how to use AI for the first pass without losing the thread back to the evidence.</p>
<ol class="steps">
<li><strong>Prepare the notes</strong>Remove names and companies; label each set of notes P1 to P12. Keep the notes as written; don't pre-summarise, or you'll lose the quotes. Use your organisation's approved tool (lesson 8).</li>
<li><strong>Write a brief that demands traceability</strong>Ask for themes, and for every theme: the participant IDs, verbatim quotes, a count, and any evidence <em>against</em> it.
<div class="draft prompt" style="margin:12px 0 0"><div class="draft-h"><span><b>Request</b></span></div><div class="draft-b">Research question: How do finance admins use our reports today, and where do they struggle?

Below are notes from 12 interviews, labelled P1 to P12.

Identify up to 6 themes. For each theme give:
- a one-sentence description
- which participants support it (IDs) and how many
- 1-2 verbatim quotes, copied exactly, with the participant ID
- any participants whose notes contradict it

Then list any notes or points that don't fit a theme.
Don't recommend solutions. Don't generalise beyond the participants.

[notes]</div></div></li>
<li><strong>Read the themes as hypotheses</strong>The output will look like a finished synthesis. Treat each theme as “this might be true; show me”.</li>
<li><strong>Check, in this order</strong>
<ul>
<li><strong>Quotes:</strong> search the notes for five quotes, word for word. A quote that doesn't appear is a fabrication; a quote attributed to the wrong participant breaks your counts.</li>
<li><strong>Counts:</strong> recount one theme yourself. “Most participants” resting on 3 of 12 is the most common overstatement.</li>
<li><strong>Doesn't-fit list:</strong> read it carefully. Models pull toward a tidy story, and the outliers are often where the insight is.</li>
<li><strong>Calibration:</strong> read three sets of notes in full yourself, so you know what the raw material feels like.</li>
</ul></li>
<li><strong>Decide</strong>Use the themes as a starting point. Write the final synthesis yourself, especially the “so what”. Note in the document that the first pass was AI-assisted and how you checked it.</li>
</ol>
<p>Why the brief is shaped this way: quotes and IDs make every claim traceable, counts expose overgeneralisation, and asking for contradictions works against the model's pull toward agreement and neat narratives (lesson 3).</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check a research summary against its sources</span></div><div class="activity-b">
<p>Here are four short interview excerpts, followed by an AI summary of them. Flag each summary sentence that isn't fully supported by the excerpts. Then reveal the review.</p>
<div data-w="claims" data-cfg="pm-synthesis"></div>
</div></div>

<h2>Worked example: acceptance criteria</h2>
<p>A user story is ready for refinement:</p>
<blockquote>As a finance admin, I want to schedule a report to be emailed every week, so that my director gets it without me having to remember.</blockquote>
<p>You ask the assistant for acceptance criteria in Given/When/Then form, plus edge cases and open questions. A typical draft:</p>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · acceptance criteria</span></div><div class="draft-b">
<p><b>AC1</b> Given I am a finance admin viewing a report, when I choose Schedule, then I can set a weekly day and time and add recipients.</p>
<p><b>AC2</b> Given an active schedule, when the scheduled time arrives, then the report is emailed as a PDF to all recipients.</p>
<p><b>AC3</b> Given I enter an invalid email address, when I save, then I see an error and the schedule isn't saved.</p>
<p><b>AC4</b> Given an active schedule, when I pause it, then no emails are sent until I resume it.</p>
<p><b>Open questions:</b> Which time zone is the schedule in? Can recipients be outside the organisation? What happens if the report has no data that week?</p></div>
<div class="review">
<div class="r"><span class="stamp ok">Useful</span><span>Solid happy path, a validation case, and three genuinely good questions.</span></div>
<div class="r"><span class="stamp bad">Missing</span><span><b>Permissions:</b> the director may not have access to all the data in the report. Does emailing it bypass our access controls? This is a data-protection question the model couldn't know matters here.</span></div>
<div class="r"><span class="stamp bad">Missing</span><span><b>Ownership:</b> what happens when the admin who created the schedule leaves the company or loses access?</span></div>
<div class="r"><span class="stamp warn">Assumed</span><span>“As a PDF” wasn't in the story. Check what format directors actually want before it becomes a requirement.</span></div>
</div></div>
<p>The pattern is typical. AI produces a strong generic draft, and the most important criteria come from knowledge of your organisation: who can see what, what happens when people leave, which assumptions slipped in. Take the edited draft to refinement and let QA and engineering add their own edge cases. The <a class="term" data-t="acceptance-criteria">acceptance criteria</a> are yours once you've signed them off.</p>

<h2>Specs and one-pagers: AI drafts, you decide</h2>
<p>A product document does two jobs: it records decisions, and it makes the reasoning behind them visible so others can challenge it. AI is very good at the structure of a document (sections, completeness, plain language) and has nothing to contribute to the decisions themselves, because it doesn't know your strategy, your constraints or your commitments.</p>
<p>A useful way to split the work is Marty Cagan's four risks: value (will customers want it?), usability (can they use it?), feasibility (can we build it?) and viability (does it work for the business?).[5] An assistant can draft the questions under each heading. Only evidence from customers, engineers and the business can answer them.</p>
<h2>Worked example: a requirement that can be tested</h2>
<p>You ask an assistant to tighten one line of a spec for a reporting feature. Compare the original with a version you'd send to refinement.</p>
<div class="worked">
<div class="wx"><b>Weak: AI draft, accepted as is</b><div><p>“Reports should load quickly and be easy to export so finance teams can work more efficiently.”</p></div></div>
<div class="wx strong"><b>Strong: after your edit</b><div><p>“A report with up to 50,000 rows renders in under 3 seconds for 95% of loads. Finance admins can export the current view to CSV or XLSX in one step. Success: median time from opening a report to sending it falls from 9 minutes (baseline, October) to under 4.”</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>“Quickly” became a number and a percentile.</strong> Engineering can test it, and QA can fail it.</li>
<li><strong>“Easy to export” became an action and formats.</strong> The draft hid a decision (which formats?) inside an adjective.</li>
<li><strong>“More efficiently” became a measured outcome with a baseline.</strong> Without one, nobody can say later whether the feature worked.</li>
<li><strong>The assistant couldn't have written the strong version.</strong> The 50,000 rows, the formats and the 9-minute baseline came from your data and your customers.</li>
</ul>
<h2>Decisions stay with you, and on the record</h2>
<p>Prioritisation is where AI is most tempting and least qualified. It will happily produce a scored table that looks objective. The scores are guesses dressed as numbers, and the weights encode a strategy it doesn't know. What it can do well is lay out options, list the considerations you might have missed, and argue against your favourite.</p>
<p>A short decision record keeps the line clear. Write down: the decision, the options considered, the evidence for each, who decided, and what would make you revisit it. If AI helped, say where: “Options and counter-arguments drafted with an assistant; evidence and decision ours.” Microsoft's guidelines for human-AI interaction make the same point for products: make clear what the system can do and how well, so people calibrate their trust.[4]</p>
<div class="tbl"><table><thead><tr><th>Part of the decision</th><th>AI can help by</th><th>You own</th></tr></thead><tbody>
<tr><td>Options</td><td>Listing alternatives, including “do nothing” and smaller versions</td><td>Which options are realistic for this team</td></tr>
<tr><td>Evidence</td><td>Organising interview themes, tickets and data you supply</td><td>Whether the evidence is real, recent and representative</td></tr>
<tr><td>Trade-offs</td><td>Arguing the case against your preferred option</td><td>How much each trade-off matters to the strategy</td></tr>
<tr><td>The call</td><td>Nothing</td><td>The decision, and explaining it to the people it affects</td></tr>
</tbody></table></div>
<h2>Metrics and data questions</h2>
<p>“Why did activation dip?” is a classic request to hand to an assistant with SQL access. It will answer. The risk is that it answers a slightly different question: a different definition of activation, a different date range, or a table that double-counts. Before you ask, pin three things in writing: the metric's exact definition, the source table everyone uses, and a number you already know (last month's figure on the dashboard). If the assistant's query doesn't reproduce the known number, don't trust its explanation of the new one (lesson 6).</p>
<h2>Your turn: make a requirement testable</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Rewrite a vague requirement</span></div><div class="activity-b">
<p>An assistant drafted this requirement for a notifications feature: <em>“Users should get timely, relevant notifications about important account activity without being overwhelmed.”</em></p>
<p>Rewrite it so engineering could build it and QA could fail it. Note any decision you had to make, and any number you'd need to look up.</p>
<div data-w="task" data-key="product-requirement">
<div class="task-model"><p>“Account owners receive a notification within 5 minutes when: a payment fails, a new admin is added, or the plan changes. Each type can be switched off in settings, except payment failures. No more than 3 non-critical notifications are sent per user per day; extras are bundled into a daily digest at 9:00 in the user's time zone.”</p>
<p><strong>Decisions made:</strong> which events count as important; that payment failures can't be muted; the daily cap of 3. <strong>To look up:</strong> current notification volume per user, to check the cap is realistic.</p></div>
<ul class="task-rubric">
<li>Names the specific events that trigger a notification</li>
<li>Replaces “timely” with a time limit</li>
<li>Replaces “not overwhelmed” with a rule, such as a cap or a digest</li>
<li>Says who receives them and how they can opt out</li>
<li>Lists the decisions you made and the data you'd need to confirm</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Synthetic users presented as research.</strong> AI-generated personas and “simulated interviews” produce the typical opinions found in training data. Useful for drafting interview questions; not evidence about your customers.<sup>[1]</sup></li>
<li><strong>The tidy story.</strong> Summaries trend toward a coherent narrative and drop inconvenient outliers. Ask for contradictions explicitly.</li>
<li><strong>Asking it to confirm.</strong> “Find evidence that users want dark mode” will find some. Ask what the evidence shows instead (lesson 3).</li>
<li><strong>Fake precision.</strong> “62% of users prefer…” from twelve qualitative interviews is a statistic the method can't support, however natural it sounds.</li>
<li><strong>Uncited market claims.</strong> A competitor's price, user count or feature list from an assistant is a lead to verify, not a fact.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 45-minute exercise.</strong> Take notes from five to ten recent customer conversations. Run the synthesis brief above. Check five quotes word for word and recount one theme. Write down three things: how long the AI step took, how long checking took, and what the check found. That record is the start of your team's evidence about where AI helps (lesson 45).</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI makes the PM's job mostly about prompting.</dt><dd>The job is still judgement: deciding what matters and defending it. AI shortens the drafting, which leaves more of the week for customers and decisions.</dd>
<dt>A scored prioritisation table from an assistant is objective.</dt><dd>The scores and weights are guesses that look precise. Use the table to start an argument, not to end one.</dd>
<dt>If the summary cites participants, the claims are supported.</dt><dd>Citations can be misattributed or overstated. Open a few and recount one theme yourself.</dd>
<dt>Using AI for synthesis is risky, so it's safer not to.</dt><dd>Unchecked synthesis is risky. Checked synthesis, with quotes and counts traced, is often faster and more thorough than doing it all by hand.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>AI helps most with gathering and communicating, and least with deciding.</li>
<li>Demand traceability: quotes, participant IDs and counts for every theme.</li>
<li>Turn adjectives in requirements into numbers, actions and baselines.</li>
<li>Keep a short decision record that says where AI helped and who decided.</li>
<li>Pin the metric definition and a known number before asking a data question.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">An assistant's prioritisation table ranks “bulk export” first with a score of 8.7. How should you use it?</p><ul>
<li data-fb="Consistent arithmetic on guessed inputs is still a guess.">Adopt the ranking, since the scores were computed consistently.</li>
<li data-fb="Right. It's useful for surfacing considerations, not for settling them.">Use it to start the discussion, and argue the case against the top pick.</li>
<li data-fb="It can list options and counter-arguments; it just can't make the call.">Discard it, because AI can't contribute anything to prioritisation.</li>
<li data-fb="That turns the table into decoration for a decision already made.">Ask the assistant to re-score the options until the result matches your instinct.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Which requirement would QA be able to fail?</p><ul>
<li data-fb="“Feel fast” can't be measured or failed.">“The dashboard should feel fast and responsive for every user.”</li>
<li data-fb="Which formats? The decision is hidden in “all”.">“Exports should support all of the file formats that our customers might need.”</li>
<li data-fb="“Noticeably easier” has no threshold or measure.">“The new flow should make onboarding noticeably easier.”</li>
<li data-fb="Right. It has a threshold, a scope and a measure.">“95% of dashboards with under 10,000 rows load within 2 seconds.”</li>
</ul></div>
<div class="check" data-a="0"><p class="q">You ask an assistant why activation fell last week. Before trusting its answer, what should you confirm?</p><ul>
<li data-fb="Right. A known number shows the definition and table match yours.">That its query reproduces last month's activation figure from the dashboard.</li>
<li data-fb="Clarity doesn't tell you whether the numbers are right.">That its explanation is written clearly enough to share directly with the leadership team.</li>
<li data-fb="The model version matters less than the definition and data.">That it used the most recent model version available to the team.</li>
<li data-fb="Several causes can all rest on the wrong number.">That it lists at least three possible causes for the change.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which belongs in a decision record for a feature where AI helped?</p><ul>
<li data-fb="Too much detail; nobody will read it, and it hides the decision.">The full transcript of every prompt you used along the way.</li>
<li data-fb="Without options and evidence, nobody can challenge or revisit it.">Only the final decision, so the document stays short.</li>
<li data-fb="Right. That keeps the reasoning visible and the ownership clear.">Options, evidence, who decided, and where AI was used.</li>
<li data-fb="The recommendation isn't the reason. The evidence is.">A note that the assistant recommended the chosen option.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">An AI synthesis of 14 interviews says “users consistently find onboarding confusing”, citing P2, P5 and P9. What's wrong?</p><ul>
<li data-fb="IDs are what make the claim checkable.">Participant IDs shouldn't appear in a synthesis document.</li>
<li data-fb="Right. Three of fourteen is a signal, not a consistent finding.">“Consistently” overstates what 3 of 14 participants said.</li>
<li data-fb="It's a fine theme; the problem is the strength of the claim.">Onboarding is too broad a topic to be a valid theme.</li>
<li data-fb="A synthesis that jumps to solutions is harder to trust, not easier.">The synthesis should have included a recommended solution.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Nielsen Norman Group, <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users: If, When, and How to Use AI-Generated “Research”</a>.</li>
<li>Sharma et al. (2023), <a href="https://arxiv.org/abs/2310.13548" target="_blank" rel="noopener">Towards Understanding Sycophancy in Language Models</a>. Why leading research questions get agreeable answers.</li>
<li>Lessons <a href="#failure-modes">3: Why it gets things wrong</a> and <a href="#checking-work">5: Checking the work</a> in this course.</li>

<li>Amershi et al. (2019), <a href="https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/" target="_blank" rel="noopener">Guidelines for Human-AI Interaction</a>. Eighteen tested guidelines, including making clear what a system can do and how well.</li>
<li>Marty Cagan, SVPG, <a href="https://www.svpg.com/four-big-risks/" target="_blank" rel="noopener">The Four Big Risks</a>. Value, usability, feasibility and viability as the questions product work must answer.</li>
<li>Teresa Torres, Product Talk, <a href="https://www.producttalk.org/opportunity-solution-trees/" target="_blank" rel="noopener">Opportunity Solution Trees</a>. A structure for connecting outcomes, customer opportunities and solutions.</li>
</ol></section>
`
});
