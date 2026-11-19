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
  lede: "Delivery leads spend a lot of time on the backlog and the flow of work through it: refining stories, splitting them, mapping dependencies and reading the metrics. AI is helpful with all of it. It's also quick to turn a metric into a verdict, and the wrong verdict can change how a team behaves.",
  outcomes: [
    "Use AI to refine and split stories, and check the result with the people doing the work.",
    "Map dependencies with AI from real sources, and confirm them with the teams involved.",
    "Read flow and DORA metrics as a team's own trend, not a productivity score or a league table.",
    "Forecast with ranges based on past throughput, not a single date."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Story points as output.</strong> Points are a team's own planning tool. Summed across teams, or tracked as productivity, they inflate.</li>
<li><strong>Ticket-text dependencies treated as confirmed.</strong> Teams often don't write their assumptions down. Ask.</li>
<li><strong>Splitting by layer.</strong> “Backend story, frontend story” is a common AI suggestion. Neither delivers anything on its own.</li>
<li><strong>Averages that hide the tail.</strong> A good median can hide a few tickets that took months. Look at the distribution.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Take the three largest stories in your backlog. Ask an assistant to split each into slices that deliver something a user could see. Bring the best suggestions to refinement and note how many the team accepted unchanged.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">A director wants to rank teams by deployment frequency. What's the best response?</p><ul>
<li data-fb="That risks gaming and competition, as DORA's guidance warns.">Agree, as long as the data is accurate.</li>
<li data-fb="Right. The metrics are for each team to improve on its own trend.">Suggest each team tracks its own trend instead, because systems and risks differ.</li>
<li data-fb="Story points are even less comparable.">Suggest ranking by story points instead.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An AI summary says cycle time rose because the team “lost focus”. What should you do?</p><ul>
<li data-fb="It's a guess; the data doesn't contain the cause.">Include it; the assistant analysed all the data.</li>
<li data-fb="The number is real; it's the cause that's unsupported.">Remove the cycle-time figure from the summary.</li>
<li data-fb="Right. The team knows what happened; the data doesn't.">Ask the team what happened in that period before giving a reason.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">How should you forecast when the remaining backlog will be done?</p><ul>
<li data-fb="Right. Past throughput as a range is honest about uncertainty.">As a range, based on the team's past throughput, with the assumptions stated.</li>
<li data-fb="A single date hides the uncertainty.">As a single date from the average rate.</li>
<li data-fb="Asking a model for a date doesn't add information.">Ask the assistant to predict a completion date.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>DORA, <a href="https://dora.dev/guides/dora-metrics-four-keys/" target="_blank" rel="noopener">DORA's software delivery performance metrics</a>. Definitions, and pitfalls such as setting metrics as goals and comparing unlike teams.</li>
<li>DORA (2024), <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>.</li>
</ol></section>
`
});
