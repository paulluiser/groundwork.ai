GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["productivity-report"] = {
  label: "the vendor's “AI productivity report” for your team",
  source: '<b>What you have</b> A dashboard from your AI coding tool\'s vendor covering your 14 engineers for the three months since rollout, plus your own delivery data.<br><b>What the summary slide says</b> six headline findings, reproduced below.',
  claims: [
    { t: "12 of 14 engineers used the tool at least weekly in the last month.", v: "ok", why: "Usage data the tool can genuinely measure. It tells you about adoption, not benefit." },
    { t: "The tool wrote 38% of your team's code.", v: "partial", why: "It counts accepted suggestions, including lines later edited or deleted. “Accepted” isn't “kept”, and lines aren't value." },
    { t: "Your team is 55% more productive.", v: "none", why: "Nothing measured your team's productivity. The figure echoes a well-known lab study of a single, well-defined task, which doesn't transfer to your codebase." },
    { t: "Pull requests per engineer rose 22% after rollout.", v: "partial", why: "True in your data, but smaller pull requests would raise the count without more work done. Check size, review time and change fail rate alongside it." },
    { t: "Engineers report feeling more productive.", v: "ok", why: "From the survey, and worth knowing. But in a 2025 trial, experienced developers felt faster while measurably taking longer. Feelings and outcomes can diverge." },
    { t: "Rolling the tool out to the rest of engineering will save £1.2m a year.", v: "judg", why: "A projection built on the 55% figure above. A spending decision needs evidence from your own trial, not a vendor's multiplier." }
  ],
  after: "Usage is easy to measure and says little. Outcomes need delivery and quality data, a comparison, and the team's own account. Treat vendor productivity figures as marketing until you've tested them."
};
GW.lesson({
  id: "em-measuring",
  lede: "Sooner or later, someone will ask whether AI tools are making your team faster. The honest answer is usually “it depends, and we're finding out”. This lesson covers what the research actually found, which measures mislead, and how to run a fair trial on your own team.",
  outcomes: [
    "Summarise what major studies found about AI and developer productivity, including where they disagree.",
    "Spot measures that mislead, such as lines of AI code, suggestion acceptance and raw pull request counts.",
    "Use several dimensions of productivity, not one number.",
    "Design an honest trial on your own team, with a comparison and quality measures."
  ],
  html: String.raw`
<h2>What the research found</h2>
<p>The studies point in different directions, and the differences are instructive:</p>
<ul>
<li>In a 2023 controlled experiment, developers given a well-defined task (build a small HTTP server) finished 55.8% faster with an AI pair programmer.<sup>[1]</sup></li>
<li>In a 2025 randomised trial, experienced open-source developers working on large codebases they knew well took 19% longer with AI tools, though they believed they'd been faster.<sup>[2]</sup></li>
<li>The 2024 DORA report found that, across its survey, more AI adoption was associated with slightly lower delivery throughput and stability, even as people reported feeling more productive.<sup>[3]</sup></li>
</ul>
<p>These aren't contradictions so much as different situations. Small, self-contained tasks with a clear goal benefit most. Mature codebases with high standards and deep existing expertise may benefit less, or not at all, at least at first. Your team is somewhere in between, and the only way to know where is to measure carefully.</p>

<h2>Measures that mislead</h2>
<div class="tbl"><table>
<thead><tr><th>Measure</th><th>Fit</th><th>Why, and how to use it</th></tr></thead>
<tbody>
<tr><td>Delivery metrics: lead time, change fail rate, recovery time</td><td><span class="fit good">Good fit</span></td><td>Outcome-focused and hard to game when used together. Watch stability as well as speed (lesson 31).</td></tr>
<tr><td>Developer surveys on satisfaction and friction</td><td><span class="fit good">Good fit</span></td><td>Shows experience and problems. Pair with outcome data, since feelings can diverge.</td></tr>
<tr><td>Usage and adoption</td><td><span class="fit care">Use with care</span></td><td>Tells you who uses the tool, not whether it helps.</td></tr>
<tr><td>Pull requests or commits per person</td><td><span class="fit care">Use with care</span></td><td>Rises with smaller batches. Never use per person, and never as a target.</td></tr>
<tr><td>Lines of AI-written code, acceptance rate</td><td><span class="fit human">Avoid as an outcome</span></td><td>Measures the tool's activity. More code isn't more value, and accepted isn't kept.</td></tr>
</tbody></table></div>
<p>The SPACE framework, from researchers at GitHub and Microsoft, makes the general point: productivity has several dimensions (satisfaction and well-being, performance, activity, communication and collaboration, and efficiency and flow), and no single metric captures it.<sup>[4]</sup> Pick at least one measure from three different dimensions.</p>

<h2>Worked example: the vendor's report</h2>
<p>Three months after rolling out an AI coding tool, the vendor sends a productivity report for your team. Your director wants to use it to justify rolling the tool out to all of engineering.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the productivity report</span></div><div class="activity-b">
<p>Flag each finding you wouldn't repeat to leadership as written.</p>
<div data-w="claims" data-cfg="productivity-report"></div>
</div></div>

<ol class="steps">
<li><strong>Activity was presented as productivity</strong>Lines written and pull requests opened describe what happened, not what it was worth.</li>
<li><strong>A study figure was borrowed for your team</strong>The 55% figure comes from one well-defined lab task. It says nothing about your codebase.</li>
<li><strong>A projection was built on the borrowed figure</strong>Savings estimates need your own evidence. Run a trial before committing budget.</li>
</ol>
<div class="key"><p>Usage tells you people are trying the tool. Only outcomes, measured fairly and over time, tell you whether it's helping.</p></div>

<h2>Running an honest trial</h2>
<ol>
<li><strong>Decide what you'd change your mind on,</strong> before you start: for example, lead time down without change fail rate rising, and the team wanting to keep the tool.</li>
<li><strong>Get a baseline.</strong> At least a few months of delivery data before the change.</li>
<li><strong>Compare.</strong> Ideally, some work with and some without, or a staggered rollout. Otherwise, compare with your own trend, and note what else changed.</li>
<li><strong>Measure quality, not just speed:</strong> change fail rate, incidents, review time, rework.</li>
<li><strong>Ask the team,</strong> in a way they can answer honestly. Where did it help? Where did it get in the way?</li>
<li><strong>Give it time.</strong> Early weeks include learning. Look at months, not days.</li>
</ol>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Individual leaderboards.</strong> Ranking people by AI usage or output pushes them to game it and damages trust.</li>
<li><strong>Measuring only the tool's numbers.</strong> The vendor measures what makes the tool look useful.</li>
<li><strong>Ignoring review load.</strong> Faster writing can mean slower reviewing. Check where the time went.</li>
<li><strong>Mandating usage.</strong> Required usage makes adoption figures meaningless and hides where the tool doesn't fit.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Write down the three measures you'd use to judge whether AI tools help your team, one each from delivery, quality and the team's experience, and what result would make you change course. Share it with your team before anyone looks at the numbers.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Why might experienced developers feel faster with AI tools while actually taking longer?</p><ul>
<li data-fb="The trial measured time carefully.">Because the studies measured time incorrectly.</li>
<li data-fb="Right. Feelings and measured outcomes can diverge, which is why you need both.">Because perceived effort and measured time don't always match.</li>
<li data-fb="The trial involved experienced users of AI tools too.">Because they had never used AI before.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which is the weakest evidence that an AI tool is helping your team?</p><ul>
<li data-fb="Right. It measures the tool's activity, not your team's outcomes.">The share of code written by the tool.</li>
<li data-fb="Lead time with stable quality is reasonable outcome evidence.">Lead time fell while change fail rate stayed level.</li>
<li data-fb="The team's experience is a valid dimension of productivity.">The team reports less friction in a survey, and wants to keep the tool.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What's the most important thing to decide before an AI tool trial starts?</p><ul>
<li data-fb="The tool matters less than how you'll judge it.">Which vendor to use.</li>
<li data-fb="Usage targets distort the result.">The usage target for each engineer.</li>
<li data-fb="Right. Deciding the criteria first stops the result being argued away.">What results would make you keep or drop the tool.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Peng et al. (2023), <a href="https://arxiv.org/abs/2302.06590" target="_blank" rel="noopener">The Impact of AI on Developer Productivity: Evidence from GitHub Copilot</a>. A controlled experiment on one well-defined task.</li>
<li>METR (2025), <a href="https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" target="_blank" rel="noopener">Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity</a>. A randomised controlled trial with 16 developers on their own repositories.</li>
<li>DORA (2024), <a href="https://dora.dev/research/2024/dora-report/" target="_blank" rel="noopener">Accelerate State of DevOps Report 2024</a>.</li>
<li>Forsgren et al. (2021), <a href="https://queue.acm.org/detail.cfm?id=3454124" target="_blank" rel="noopener">The SPACE of Developer Productivity</a>. <i>ACM Queue</i> 19(1).</li>
</ol></section>
`
});
