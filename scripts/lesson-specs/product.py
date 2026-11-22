SPEC = dict(
file="08-product.js",
reviewed="2026-11",
outcomes=["Write a product decision record where AI prepared the options and you own the call."],
situation="""<p>It's Monday. You have twelve interview notes to synthesise before Thursday's planning, a one-pager to update for leadership, three user stories waiting for acceptance criteria, and a director asking why activation dipped last week. An assistant could draft all four before lunch.</p>
<p>Two of those drafts would be fine with a light edit. One would quietly overstate what customers said. One would answer the activation question with a confident number from the wrong table. This lesson is about knowing which is which before anyone acts on them.</p>""",
warmup=dict(q="An assistant drafts a one-pager that says “customers are asking for bulk export”. What's the first thing you should check?",
  a=2, opts=[
    ("Whether the sentence is written in the team's usual style.", "Style matters less than whether the claim is true."),
    ("Whether bulk export is technically feasible this quarter.", "Feasibility comes later. First, is the claim supported?"),
    ("Which customers said it, how many, and where it's recorded.", "Right. A claim about customers needs evidence you can point to."),
    ("Whether leadership will find the request persuasive.", "Persuasive and true are different things; check truth first."),
  ]),
sections="""<h2>Specs and one-pagers: AI drafts, you decide</h2>
<p>A product document does two jobs: it records decisions, and it makes the reasoning behind them visible so others can challenge it. AI is very good at the structure of a document (sections, completeness, plain language) and has nothing to contribute to the decisions themselves, because it doesn't know your strategy, your constraints or your commitments.</p>
<p>A useful way to split the work is Marty Cagan's four risks: value (will customers want it?), usability (can they use it?), feasibility (can we build it?) and viability (does it work for the business?).[S2] An assistant can draft the questions under each heading. Only evidence from customers, engineers and the business can answer them.</p>
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
<p>A short decision record keeps the line clear. Write down: the decision, the options considered, the evidence for each, who decided, and what would make you revisit it. If AI helped, say where: “Options and counter-arguments drafted with an assistant; evidence and decision ours.” Microsoft's guidelines for human-AI interaction make the same point for products: make clear what the system can do and how well, so people calibrate their trust.[S1]</p>
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
</div></div></div>""",
myths=[
 ("AI makes the PM's job mostly about prompting.", "The job is still judgement: deciding what matters and defending it. AI shortens the drafting, which leaves more of the week for customers and decisions."),
 ("A scored prioritisation table from an assistant is objective.", "The scores and weights are guesses that look precise. Use the table to start an argument, not to end one."),
 ("If the summary cites participants, the claims are supported.", "Citations can be misattributed or overstated. Open a few and recount one theme yourself."),
 ("Using AI for synthesis is risky, so it's safer not to.", "Unchecked synthesis is risky. Checked synthesis, with quotes and counts traced, is often faster and more thorough than doing it all by hand."),
],
recap=[
 "AI helps most with gathering and communicating, and least with deciding.",
 "Demand traceability: quotes, participant IDs and counts for every theme.",
 "Turn adjectives in requirements into numbers, actions and baselines.",
 "Keep a short decision record that says where AI helped and who decided.",
 "Pin the metric definition and a known number before asking a data question.",
],
checks=[
 dict(q="An assistant's prioritisation table ranks “bulk export” first with a score of 8.7. How should you use it?", a=1, opts=[
  ("Adopt the ranking, since the scores were computed consistently.", "Consistent arithmetic on guessed inputs is still a guess."),
  ("Use it to start the discussion, and argue the case against the top pick.", "Right. It's useful for surfacing considerations, not for settling them."),
  ("Discard it, because AI can't contribute anything to prioritisation.", "It can list options and counter-arguments; it just can't make the call."),
  ("Ask the assistant to re-score until the result matches your instinct.", "That turns the table into decoration for a decision already made."),
 ]),
 dict(q="Which requirement would QA be able to fail?", a=3, opts=[
  ("“The dashboard should feel fast and responsive for every user.”", "“Feel fast” can't be measured or failed."),
  ("“Exports should support all the formats our customers need.”", "Which formats? The decision is hidden in “all”."),
  ("“The new flow should make onboarding noticeably easier.”", "“Noticeably easier” has no threshold or measure."),
  ("“95% of dashboards with under 10,000 rows load within 2 seconds.”", "Right. It has a threshold, a scope and a measure."),
 ]),
 dict(q="You ask an assistant why activation fell last week. Before trusting its answer, what should you confirm?", a=0, opts=[
  ("That its query reproduces last month's activation figure from the dashboard.", "Right. A known number shows the definition and table match yours."),
  ("That its explanation is written clearly enough to share with leadership.", "Clarity doesn't tell you whether the numbers are right."),
  ("That it used the most recent model version available to the team.", "The model version matters less than the definition and data."),
  ("That it lists at least three possible causes for the change.", "Several causes can all rest on the wrong number."),
 ]),
 dict(q="Which belongs in a decision record for a feature where AI helped?", a=2, opts=[
  ("The full transcript of every prompt you used along the way.", "Too much detail; nobody will read it, and it hides the decision."),
  ("Only the final decision, so the document stays short.", "Without options and evidence, nobody can challenge or revisit it."),
  ("Options, evidence, who decided, and where AI was used.", "Right. That keeps the reasoning visible and the ownership clear."),
  ("A note that the assistant recommended the chosen option.", "The recommendation isn't the reason. The evidence is."),
 ]),
 dict(q="An AI synthesis of 14 interviews says “users consistently find onboarding confusing”, citing P2, P5 and P9. What's wrong?", a=1, opts=[
  ("Participant IDs shouldn't appear in a synthesis document.", "IDs are what make the claim checkable."),
  ("“Consistently” overstates what 3 of 14 participants said.", "Right. Three of fourteen is a signal, not a consistent finding."),
  ("Onboarding is too broad a topic to be a valid theme.", "It's a fine theme; the problem is the strength of the claim."),
  ("The synthesis should have included a recommended solution.", "A synthesis that jumps to solutions is harder to trust, not easier."),
 ]),
],
sources=[
 'Amershi et al. (2019), <a href="https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/" target="_blank" rel="noopener">Guidelines for Human-AI Interaction</a>. Eighteen tested guidelines, including making clear what a system can do and how well.',
 'Marty Cagan, SVPG, <a href="https://www.svpg.com/four-big-risks/" target="_blank" rel="noopener">The Four Big Risks</a>. Value, usability, feasibility and viability as the questions product work must answer.',
 'Teresa Torres, Product Talk, <a href="https://www.producttalk.org/opportunity-solution-trees/" target="_blank" rel="noopener">Opportunity Solution Trees</a>. A structure for connecting outcomes, customer opportunities and solutions.',
],
)
