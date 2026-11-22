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
  reviewed: "2026-11",
  lede: "Sooner or later, someone will ask whether AI tools are making your team faster. The honest answer is usually “it depends, and we're finding out”. This lesson covers what the research actually found, which measures mislead, and how to run a fair trial on your own team.",
  outcomes: [
    "Summarise what major studies found about AI and developer productivity, including where they disagree.",
    "Spot measures that mislead, such as lines of AI code, suggestion acceptance and raw pull request counts.",
    "Use several dimensions of productivity, not one number.",
    "Design an honest trial on your own team, with a comparison and quality measures.",
    "Design a small, honest trial of an AI tool with a baseline, a prediction and outcome measures."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your director forwards a vendor report: teams using the vendor's coding assistant “ship 55% faster”. They'd like to know, by next month, whether your team should buy it. Your team has opinions in both directions and no data.</p>
<p>A month is enough for a useful answer if the trial is designed before it starts. This lesson walks through designing one, and through reading other people's productivity numbers with the right amount of scepticism.</p></div>
<div class="check warmup" data-a="3"><p class="q">A vendor says teams using its tool “ship 55% faster”. What's the first question to ask?</p><ul>
<li data-fb="Price is a separate question.">Whether the tool is also cheaper than its competitors on a per-seat basis.</li>
<li data-fb="Popularity isn't evidence of effect.">Whether other companies in your industry have already bought the tool.</li>
<li data-fb="Useful, but first understand the measure.">Whether the claim appears in a peer-reviewed publication of some kind.</li>
<li data-fb="Right. The measure decides what the number means.">What “faster” measured, on what tasks, compared with what.</li>
</ul></div>
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

<h2>Worked example: a four-week trial</h2>
<div class="tbl"><table><thead><tr><th>Element</th><th>Decision</th></tr></thead><tbody>
<tr><td>Question</td><td>Does the assistant shorten the time from starting a ticket to merging it, without increasing rework?</td></tr>
<tr><td>Baseline</td><td>Last 8 weeks: median 3.1 days start-to-merge; 12% of merged changes reopened or reverted within 2 weeks</td></tr>
<tr><td>Prediction, written in advance</td><td>Start-to-merge falls to about 2.5 days, with rework no higher than 12%</td></tr>
<tr><td>Design</td><td>Half the team uses the tool for 4 weeks, then the other half, so each person is compared with themselves and with colleagues in the same weeks</td></tr>
<tr><td>Measures</td><td>Start-to-merge, rework rate, review time, plus a weekly two-question survey (perceived speed, perceived quality)</td></tr>
<tr><td>Decision rule</td><td>Buy if start-to-merge improves and rework doesn't rise; otherwise, stop or narrow to the tasks where it helped</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Measured and perceived speed are both collected</strong>, because they can diverge: one controlled study found developers felt faster while being measured slower.[2]</li>
<li><strong>Rework is a guardrail.</strong> Faster and worse isn't a win.</li>
<li><strong>The decision rule is agreed before results</strong>, so the trial can't be argued into the answer someone wanted.</li>
<li><strong>Frameworks like SPACE</strong> are a reminder to measure more than one dimension: satisfaction, performance, activity, collaboration and efficiency.[4]</li>
</ul>
<h2>Your turn: design a trial</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">A trial for an AI tool your team is considering</span></div><div class="activity-b">
<p>Design a trial for an AI tool your team is considering (or an AI code review assistant). Write: the question, the baseline, your prediction, the design, the measures (including a guardrail), and the decision rule.</p>
<div data-w="task" data-key="em-trial">
<div class="task-model"><ul>
<li><strong>Question:</strong> Does an AI code review assistant reduce time to first review without letting more defects through?</li>
<li><strong>Baseline:</strong> last 6 weeks: median 9 hours to first review; 4 escaped defects per month.</li>
<li><strong>Prediction:</strong> time to first review under 5 hours; escaped defects unchanged.</li>
<li><strong>Design:</strong> enable it on two of four repositories for 4 weeks, then swap.</li>
<li><strong>Measures:</strong> time to first review, time to merge, escaped defects (guardrail), reviewer survey.</li>
<li><strong>Decision rule:</strong> adopt if review time falls and defects don't rise; drop if defects rise.</li>
</ul></div>
<ul class="task-rubric">
<li>Asks one specific question about an outcome</li>
<li>Records a baseline before the trial</li>
<li>Writes a prediction in advance</li>
<li>Includes a quality guardrail alongside speed</li>
<li>Agrees a decision rule before seeing results</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Individual leaderboards.</strong> Ranking people by AI usage or output pushes them to game it and damages trust.</li>
<li><strong>Measuring only the tool's numbers.</strong> The vendor measures what makes the tool look useful.</li>
<li><strong>Ignoring review load.</strong> Faster writing can mean slower reviewing. Check where the time went.</li>
<li><strong>Mandating usage.</strong> Required usage makes adoption figures meaningless and hides where the tool doesn't fit.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 20-minute exercise.</strong> Write down the three measures you'd use to judge whether AI tools help your team, one each from delivery, quality and the team's experience, and what result would make you change course. Share it with your team before anyone looks at the numbers.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Developers know whether AI is making them faster.</dt><dd>Perceived and measured speed can diverge sharply. Measure both.</dd>
<dt>Lines of code or percentage of AI-written code shows value.</dt><dd>They measure activity and invite gaming. Measure outcomes like lead time and rework.</dd>
<dt>A positive vendor study means it will work for us.</dt><dd>Effects depend on tasks, codebases and experience. Trial it in your context.</dd>
<dt>Trials need months and a data team.</dt><dd>Four weeks, a baseline and a written prediction answer most team-level questions.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Ask what a productivity number measured, on what tasks, compared with what.</li>
<li>Record a baseline and write a prediction before the trial.</li>
<li>Measure outcomes, with quality as a guardrail, not activity.</li>
<li>Collect perceived and measured speed; expect them to differ.</li>
<li>Agree the decision rule before you see results.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Why write a prediction before a trial starts?</p><ul>
<li data-fb="Not a vendor requirement.">Vendors require a written prediction before they agree to a trial licence.</li>
<li data-fb="Right. It anchors the honest comparison.">So the result can't be rationalised into whatever someone hoped for.</li>
<li data-fb="They don't affect speed.">Because predictions make the trial run faster and need fewer participants.</li>
<li data-fb="That would bias the trial.">So the team knows what result to aim for while using the tool.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which measure is the best guardrail when trialling a coding assistant?</p><ul>
<li data-fb="Right. It catches faster-but-worse.">Rework: changes reopened or reverted soon after merging.</li>
<li data-fb="Activity, not quality.">The number of suggestions accepted by developers each day.</li>
<li data-fb="Activity, and easy to inflate.">Lines of code written per developer per week during the trial.</li>
<li data-fb="Satisfaction matters, but isn't a quality guardrail.">How many developers say they enjoy using the tool.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">What did the METR study find about perceived and measured speed?</p><ul>
<li data-fb="The opposite.">Developers accurately estimated how much the AI tools had sped them up.</li>
<li data-fb="The opposite.">Measured speed improved far more than developers expected it to.</li>
<li data-fb="There was a slowdown.">There was no measurable difference in speed in either direction.</li>
<li data-fb="Right. Perception and measurement diverged.">Developers felt faster while being measured slower on average.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Why compare people in the same weeks rather than before and after?</p><ul>
<li data-fb="Time isn't the main reason.">Because before-and-after comparisons take twice as long to run properly.</li>
<li data-fb="Memory isn't the issue; data is.">Because people forget how long work took before the trial started.</li>
<li data-fb="Right. Same-period comparisons control for them.">Because other changes over time can be mistaken for the tool's effect.</li>
<li data-fb="Not the reason.">Because vendors prefer comparisons within the same team at the same time.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What does the SPACE framework remind managers to do?</p><ul>
<li data-fb="Right. Satisfaction, performance, activity, collaboration, efficiency.">Measure productivity across several dimensions, not one.</li>
<li data-fb="SPACE warns against single measures.">Focus measurement on the speed of individual developers above everything.</li>
<li data-fb="SPACE includes perceptual measures deliberately.">Replace surveys with automated metrics wherever possible.</li>
<li data-fb="An activity measure, not a goal.">Track the percentage of code written by AI as a primary goal.</li>
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
