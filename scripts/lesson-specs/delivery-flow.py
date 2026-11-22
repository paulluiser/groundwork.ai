SPEC = dict(
file="12-2-delivery-flow.js",
reviewed="2026-11",
outcomes=["Split a large story into thin vertical slices that each deliver something testable."],
situation="""<p>Backlog refinement is in an hour. The top item is “Customers can manage their subscriptions”, estimated at 21 points and unchanged for three sprints. You ask an assistant to split it. It returns eight stories: “Build subscription database tables”, “Create subscription API”, “Build subscription UI”, “Write tests”…</p>
<p>Each sounds like progress, and none delivers anything a customer could use until all eight are done. This lesson is about splitting work so value and feedback arrive early, and about reading flow metrics without fooling yourself.</p>""",
warmup=dict(q="Which split of “Customers can manage subscriptions” gives the earliest useful feedback?", a=1, opts=[
  ("Database tables, then API, then UI, then tests.", "Horizontal layers: nothing usable until the end."),
  ("Customers can see their current plan and renewal date.", "Right. A thin slice through every layer, usable on its own."),
  ("Design all screens first, then build them together.", "Delays feedback on whether the screens work."),
  ("Build the admin tools before the customer screens.", "Doesn't deliver the customer value first."),
 ]),
sections="""<h2>Vertical slices, not layers</h2>
<p>A good story is small, testable and valuable on its own; Bill Wake's INVEST checklist (Independent, Negotiable, Valuable, Estimable, Small, Testable) remains a useful test.[S1] Assistants tend to split by technical layer, because that's how work is often described. Ask explicitly for vertical slices: each story should touch every layer needed to deliver one small thing a user can do, and be demonstrable at the end of the sprint.</p>
<h2>Worked example: splitting by workflow step</h2>
<div class="worked">
<div class="wx"><b>AI split (layers)</b><div><ol><li>Subscription database tables</li><li>Subscription API endpoints</li><li>Subscription settings UI</li><li>Payment provider integration</li><li>Tests for subscriptions</li></ol></div></div>
<div class="wx strong"><b>Vertical slices</b><div><ol><li>See my current plan and renewal date</li><li>Cancel at the end of the billing period</li><li>Switch to annual billing</li><li>Upgrade plan with immediate proration</li><li>Downgrade plan from next billing period</li></ol></div></div>
</div>
<ul class="wx-notes">
<li><strong>Slice 1 ships in days</strong> and tells you whether customers find the page.</li>
<li><strong>Each slice includes its own tests</strong>, so “Write tests” disappears as a separate story.</li>
<li><strong>The hardest slice (proration) is isolated</strong>, so it can be estimated and de-risked on its own.</li>
<li><strong>The prompt that produced this:</strong> “Split into vertical slices; each must be usable and testable by a customer on its own; order by value and learning.”</li>
</ul>
<h2>Flow metrics without fooling yourself</h2>
<p>Cycle time, throughput and work in progress describe how work moves; the Kanban Guide treats them as signals for improving flow, not targets.[S2] An assistant can summarise them from your board in seconds. Check two things before trusting the summary: whether the data includes everything (cancelled items, items moved back), and whether a change in the metric reflects a change in work or a change in how the board is used.</p>
<h2>Your turn: split a story</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Thin slices for a team feature</span></div><div class="activity-b">
<p>Split this story into at least four vertical slices, ordered by value or learning: <em>“Teams can share reports with external clients via a secure link.”</em></p>
<div data-w="task" data-key="delivery-slices">
<div class="task-model"><ol>
<li>Create a view-only link to one report that anyone with the link can open (internal testing only behind a flag).</li>
<li>Links expire after a chosen number of days.</li>
<li>Owners can revoke a link and see when it was last opened.</li>
<li>Links can require the client's email to be verified before viewing.</li>
<li>Admins can disable external sharing for the workspace.</li>
</ol><p>Slice 1 tests the core idea with real clients quickly; security controls follow in order of risk, before general release.</p></div>
<ul class="task-rubric">
<li>Each slice delivers something a user can do or see</li>
<li>No slice is a technical layer on its own (database, API, UI)</li>
<li>Slices are ordered by value, learning or risk</li>
<li>Security and admin controls appear as their own slices</li>
<li>The first slice is small enough to finish in days</li>
</ul>
</div></div></div>""",
myths=[
 ("Splitting by layer makes work easier to estimate.", "It makes each piece look small while hiding integration risk until the end."),
 ("Higher throughput means the team is doing better.", "It may mean smaller items or a different board habit. Look at what was delivered."),
 ("DORA metrics should be targets for the team.", "Turning them into targets invites gaming; use them to find bottlenecks.[1]"),
 ("AI story splits are ready to bring to refinement.", "They're a starting point. Check each slice is valuable and testable on its own."),
],
recap=[
 "Ask for vertical slices: each one usable and testable on its own.",
 "Use INVEST to check stories; drop “write tests” as a separate story.",
 "Isolate the riskiest slice so it can be de-risked early.",
 "Treat flow metrics as signals, not targets.",
 "Check what data an AI flow summary includes before trusting it.",
],
checks=[
 dict(q="Which is a vertical slice?", a=3, opts=[
  ("Create the subscriptions database schema.", "A technical layer."),
  ("Build all subscription API endpoints.", "A technical layer."),
  ("Write end-to-end tests for subscriptions.", "Testing belongs inside each slice."),
  ("Customers can cancel at the end of their billing period.", "Right. Usable and testable on its own."),
 ]),
 dict(q="What prompt is most likely to produce vertical slices?", a=0, opts=[
  ("“Each story must be usable and testable by a customer on its own.”", "Right. It states the property you want."),
  ("“Break this story into smaller tasks.”", "Often produces layers or tasks."),
  ("“List all the technical work needed.”", "Produces a layer list."),
  ("“Split this into eight stories of equal size.”", "Equal size isn't the point."),
 ]),
 dict(q="Throughput doubled this month. What should you check first?", a=2, opts=[
  ("Whether the team should get a bonus.", "Too early to celebrate."),
  ("Whether the AI summary used the right colours.", "Presentation isn't the issue."),
  ("Whether items got smaller or board habits changed.", "Right. The metric may reflect how work is counted."),
  ("Whether the trend will continue next month.", "First understand this month's change."),
 ]),
 dict(q="Why isolate the proration logic into its own slice?", a=1, opts=[
  ("Proration is the easiest part and can be done first.", "It's usually the hardest."),
  ("It's the riskiest part, so it can be estimated and de-risked on its own.", "Right. Isolating risk makes it visible."),
  ("Finance teams require it to be a separate story.", "Not a general rule."),
  ("AI tools can't handle proration logic.", "Not the reason."),
 ]),
 dict(q="How should DORA metrics be used?", a=3, opts=[
  ("As individual performance targets for each developer.", "Strongly discouraged."),
  ("As the only measure of team success.", "They describe delivery, not value."),
  ("As a way to compare teams for funding.", "Comparisons invite gaming."),
  ("As signals to find bottlenecks and improve flow.", "Right. Improvement, not targets."),
 ]),
],
sources=[
 'Bill Wake (2003), <a href="https://xp123.com/invest-in-good-stories-and-smart-tasks/" target="_blank" rel="noopener">INVEST in Good Stories, and SMART Tasks</a>. The INVEST checklist for user stories.',
 'Daniel Vacanti and Prateek Singh, <a href="https://kanbanguides.org/english/" target="_blank" rel="noopener">The Kanban Guide</a>. Work in progress, cycle time, throughput and work item age.',
],
)
