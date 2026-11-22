GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["flow-analysis"] = {
  label: "AI analysis of the team's delivery metrics",
  source: '<b>What you gave the assistant</b> An export from the issue tracker and the deployment pipeline for the last two quarters: tickets with start and done dates, deployments with timestamps, and rollbacks.<br><b>What you asked</b> “How is our delivery trending? Write a summary for the quarterly review.”',
  claims: [
    { t: "Median change lead time fell from 4.1 days in Q1 to 2.6 days in Q2.", v: "ok", why: "Computable from the pipeline export. Check that both quarters measured from the same starting point (commit, not ticket creation)." },
    { t: "Deployment frequency doubled, which shows the team is twice as productive.", v: "bad", why: "More deployments may mean smaller batches, which is good, but it isn't a measure of productivity or value delivered. DORA warns against treating these metrics as goals or productivity scores." },
    { t: "Change fail rate rose from 8% to 14% in Q2.", v: "ok", why: "From the rollback data. Worth discussing alongside the lead-time drop: faster but less stable is a pattern to look into." },
    { t: "Our team outperforms the Payments team, whose lead time is 6 days.", v: "bad", why: "Different systems, risks and definitions. DORA cautions against comparing unlike teams; it creates competition and gaming, not improvement." },
    { t: "Cycle time rose in June because the team was less focused.", v: "judg", why: "A guess at a cause. June included two public holidays and an incident week. Ask the team what happened before writing a reason." },
    { t: "At this rate, we'll finish the remaining 140 tickets in 9 weeks.", v: "partial", why: "A straight-line forecast from averages. Ticket sizes vary and scope grows. Give a range, for example from a simple simulation of past throughput, and say what it assumes." }
  ],
  after: "Flow metrics are for a team to learn from its own trend. They aren't productivity scores or league tables, and every number needs the team's context before it gets a cause."
};
GW.lesson({
  id: "delivery-flow",
  reviewed: "2026-11",
  lede: "Delivery leads spend a lot of time on the backlog and the flow of work through it: refining stories, splitting them, mapping dependencies and reading the metrics. AI is helpful with all of it. It's also quick to turn a metric into a verdict, and the wrong verdict can change how a team behaves.",
  outcomes: [
    "Use AI to refine and split stories, and check the result with the people doing the work.",
    "Map dependencies with AI from real sources, and confirm them with the teams involved.",
    "Read flow and DORA metrics as a team's own trend, not a productivity score or a league table.",
    "Forecast with ranges based on past throughput, not a single date.",
    "Split a large story into thin vertical slices that each deliver something testable."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Backlog refinement is in an hour. The top item is “Customers can manage their subscriptions”, estimated at 21 points and unchanged for three sprints. You ask an assistant to split it. It returns eight stories: “Build subscription database tables”, “Create subscription API”, “Build subscription UI”, “Write tests”…</p>
<p>Each sounds like progress, and none delivers anything a customer could use until all eight are done. This lesson is about splitting work so value and feedback arrive early, and about reading flow metrics without fooling yourself.</p></div>
<div class="check warmup" data-a="1"><p class="q">Which split of “Customers can manage subscriptions” gives the earliest useful feedback?</p><ul>
<li data-fb="Horizontal layers: nothing usable until the end.">Database tables, then API, then UI, then tests.</li>
<li data-fb="Right. A thin slice through every layer, usable on its own.">Customers can see their current plan and renewal date.</li>
<li data-fb="Delays feedback on whether the screens work.">Design all screens first, then build them together.</li>
<li data-fb="Doesn't deliver the customer value first.">Build the admin tools first, then build the customer-facing screens afterwards.</li>
</ul></div>
<h2>Where AI helps with backlogs and flow</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Splitting large stories</td><td><span class="fit good">Good fit</span></td><td>Good at suggesting thin, end-to-end slices. The team checks each slice is really independent.</td></tr>
<tr><td>Drafting <a class="term" data-t="acceptance-criteria">acceptance criteria</a></td><td><span class="fit good">Good fit</span></td><td>A useful first draft. Product and QA confirm what “done” means (lesson 9).</td></tr>
<tr><td>Finding duplicates and stale tickets</td><td><span class="fit good">Good fit</span></td><td>Reads a large backlog fast. A person decides what to close.</td></tr>
<tr><td>Mapping dependencies across teams</td><td><span class="fit care">Use with care</span></td><td>Finds candidates from ticket text. Confirm each one with the other team.</td></tr>
<tr><td>Interpreting flow metrics</td><td><span class="fit care">Use with care</span></td><td>Calculates well; explains changes with plausible guesses. Ask the team for the cause.</td></tr>
<tr><td>Prioritising the backlog</td><td><span class="fit human">Keep human</span></td><td>Weighs value, risk and commitments. AI can lay out the trade-offs.</td></tr>
</tbody></table></div>

<h2>Refining and splitting</h2>
<p>Ask an assistant to split a story the way you'd ask an experienced colleague: give it the story, the users, what's already built and the constraints, and ask for slices that each deliver something a user could see. Then take the suggestions to refinement as options, not decisions. The people doing the work will spot slices that look independent on paper but share a database migration or a risky piece of code.</p>
<p>The same goes for dependencies. An assistant can read tickets across several teams and list likely dependencies: “this needs the new auth endpoint”, “this assumes the billing change is live”. Each one is a question to ask the other team, with a date, not a fact to put on the plan.</p>

<h2>Worked example: the quarterly delivery summary</h2>
<p>You exported two quarters of tracker and pipeline data and asked an assistant to summarise the trend for a quarterly review. The summary has clear numbers and confident explanations.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the flow analysis</span></div><div class="activity-b">
<p>Flag every statement you wouldn't show the team or leadership as written.</p>
<div data-w="claims" data-cfg="flow-analysis"></div>
</div></div>

<ol class="steps">
<li><strong>Metrics became productivity scores</strong>DORA's own guide warns against setting the metrics as goals, because targets invite gaming.<sup>[1]</sup> Deployment frequency describes how work flows, not how much value it delivers.</li>
<li><strong>Teams were ranked</strong>Comparing unlike teams creates competition, not learning. Compare a team with its own past.</li>
<li><strong>Causes were guessed</strong>A dip has a reason the data doesn't contain: holidays, an incident, a hard problem. Ask the team.</li>
<li><strong>A single date hid the uncertainty</strong>Forecast from past throughput as a range, and say what it assumes.</li>
</ol>
<div class="key"><p>Flow metrics are a mirror for the team, not a scoreboard for management. Use AI to calculate them; let the team explain them.</p></div>

<h2>The DORA metrics, briefly</h2>
<p>DORA's software delivery metrics come in two groups.<sup>[1]</sup> Throughput: change lead time (from commit to production), deployment frequency, and how long it takes to recover from a failed deployment. Instability: change fail rate (deployments that need immediate intervention) and deployment rework rate. Looking at both groups together matters. The 2024 DORA report found that higher AI adoption was associated with slightly lower throughput and stability across its survey,<sup>[2]</sup> which is a reason to watch stability as well as speed when a team starts using AI heavily.</p>

<h2>Vertical slices, not layers</h2>
<p>A good story is small, testable and valuable on its own; Bill Wake's INVEST checklist (Independent, Negotiable, Valuable, Estimable, Small, Testable) remains a useful test.[3] Assistants tend to split by technical layer, because that's how work is often described. Ask explicitly for vertical slices: each story should touch every layer needed to deliver one small thing a user can do, and be demonstrable at the end of the sprint.</p>
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
<p>Cycle time, throughput and work in progress describe how work moves; the Kanban Guide treats them as signals for improving flow, not targets.[4] An assistant can summarise them from your board in seconds. Check two things before trusting the summary: whether the data includes everything (cancelled items, items moved back), and whether a change in the metric reflects a change in work or a change in how the board is used.</p>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Story points as output.</strong> Points are a team's own planning tool. Summed across teams, or tracked as productivity, they inflate.</li>
<li><strong>Ticket-text dependencies treated as confirmed.</strong> Teams often don't write their assumptions down. Ask.</li>
<li><strong>Splitting by layer.</strong> “Backend story, frontend story” is a common AI suggestion. Neither delivers anything on its own.</li>
<li><strong>Averages that hide the tail.</strong> A good median can hide a few tickets that took months. Look at the distribution.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Take the three largest stories in your backlog. Ask an assistant to split each into slices that deliver something a user could see. Bring the best suggestions to refinement and note how many the team accepted unchanged.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Splitting by layer makes work easier to estimate.</dt><dd>It makes each piece look small while hiding integration risk until the end.</dd>
<dt>Higher throughput means the team is doing better.</dt><dd>It may mean smaller items or a different board habit. Look at what was delivered.</dd>
<dt>DORA metrics should be targets for the team.</dt><dd>Turning them into targets invites gaming; use them to find bottlenecks.[1]</dd>
<dt>AI story splits are ready to bring to refinement.</dt><dd>They're a starting point. Check each slice is valuable and testable on its own.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Ask for vertical slices: each one usable and testable on its own.</li>
<li>Use INVEST to check stories; drop “write tests” as a separate story.</li>
<li>Isolate the riskiest slice so it can be de-risked early.</li>
<li>Treat flow metrics as signals, not targets.</li>
<li>Check what data an AI flow summary includes before trusting it.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="3"><p class="q">Which is a vertical slice?</p><ul>
<li data-fb="A technical layer.">Create the subscriptions database schema.</li>
<li data-fb="A technical layer.">Build all subscription API endpoints.</li>
<li data-fb="Testing belongs inside each slice.">Write end-to-end tests for every subscription flow before any code is written.</li>
<li data-fb="Right. Usable and testable on its own.">Customers can cancel at the end of their billing period.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What prompt is most likely to produce vertical slices?</p><ul>
<li data-fb="Right. It states the property you want.">“Each story must be usable and testable by a customer on its own.”</li>
<li data-fb="Often produces layers or tasks.">“Break this story into smaller tasks.”</li>
<li data-fb="Produces a layer list.">“List all the technical work needed.”</li>
<li data-fb="Equal size isn't the point.">“Split this into eight stories of roughly equal size and effort for the team.”</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Throughput doubled this month. What should you check first?</p><ul>
<li data-fb="Too early to celebrate.">Whether the team should get a bonus.</li>
<li data-fb="Presentation isn't the issue.">Whether the AI summary used the right colours.</li>
<li data-fb="Right. The metric may reflect how work is counted.">Whether items got smaller or board habits changed.</li>
<li data-fb="First understand this month's change.">Whether the trend is likely to continue into next month and the one after.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why isolate the proration logic into its own slice?</p><ul>
<li data-fb="It's usually the hardest.">Proration is usually the easiest part of billing work and can be done first to build momentum.</li>
<li data-fb="Right. Isolating risk makes it visible.">It's the riskiest part, so it can be estimated and de-risked on its own.</li>
<li data-fb="Not a general rule.">Finance teams require it to be a separate story.</li>
<li data-fb="Not the reason.">AI tools can't handle proration logic.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">How should DORA metrics be used?</p><ul>
<li data-fb="Strongly discouraged.">As individual performance targets for each developer.</li>
<li data-fb="They describe delivery, not value.">As the only measure of team success.</li>
<li data-fb="Comparisons invite gaming.">As a way to compare teams for funding.</li>
<li data-fb="Right. Improvement, not targets.">As signals to find bottlenecks and improve flow.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>DORA, <a href="https://dora.dev/guides/dora-metrics-four-keys/" target="_blank" rel="noopener">DORA's software delivery performance metrics</a>. Definitions, and pitfalls such as setting metrics as goals and comparing unlike teams.</li>
<li>DORA (2024), <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>.</li>

<li>Bill Wake (2003), <a href="https://xp123.com/invest-in-good-stories-and-smart-tasks/" target="_blank" rel="noopener">INVEST in Good Stories, and SMART Tasks</a>. The INVEST checklist for user stories.</li>
<li>Daniel Vacanti and Prateek Singh, <a href="https://kanbanguides.org/english/" target="_blank" rel="noopener">The Kanban Guide</a>. Work in progress, cycle time, throughput and work item age.</li>
</ol></section>
`
});
