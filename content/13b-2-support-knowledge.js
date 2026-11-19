GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["kb-drafts"] = {
  buckets: ["Ready to publish", "Needs work first"],
  items: [
    { t: "An article drafted from three solved tickets about the same sync error, with the exact error message as the title, the cause, and steps confirmed by the agent who solved them.", a: 0, why: "Grounded in real cases, written in the customer's words, and checked by someone who did the fix." },
    { t: "An article drafted from one ticket where the agent's workaround was “clear the cache and it seemed to work”.", a: 1, why: "One case and an uncertain fix. Keep it as a draft and confirm the cause before it reaches customers." },
    { t: "An article that includes the customer's company name and a screenshot with their data from the original ticket.", a: 1, why: "Personal and customer data has to come out before anything is published (lesson 8)." },
    { t: "A macro updated by AI after the refund policy changed, reviewed by the policy owner, with the old version retired.", a: 0, why: "Current, owned and checked. Retiring the old version stops agents and bots using it." },
    { t: "An article that tells customers to change a setting that only exists on the Enterprise plan, without saying so.", a: 1, why: "Plan and version limits need stating, or other customers will search for a setting they can't find." },
    { t: "A troubleshooting article an AI flagged as a duplicate of an existing one; the two have been merged and the old URL redirects.", a: 0, why: "One source of truth, and old links still work. That helps customers, agents and any bot answering from the help centre." },
    { t: "An article the AI wrote to fill a gap it detected, describing a feature from its general knowledge rather than from your product.", a: 1, why: "Gaps should be filled from real tickets and the product, not a model's guess at how similar products work." },
    { t: "An article with a “last verified” date, an owner, and a link from the macro agents use for the same issue.", a: 0, why: "Owned, dated and connected to the workflow, so it gets updated when the issue changes." }
  ],
  after: "Good knowledge comes from solved cases, is checked by someone who knows the fix, has customer data removed, states its limits, and has an owner. AI makes drafting fast; those checks make it trustworthy."
};
GW.lesson({
  id: "support-knowledge",
  lede: "Every solved ticket contains knowledge: what the problem looked like, what caused it and what fixed it. Most of it never makes it into the help centre. AI can close that gap, turning tickets into draft articles, spotting gaps and keeping macros current. It can also flood the help centre with plausible articles nobody checked, which then feed your support bot.",
  outcomes: [
    "Turn solved tickets into draft articles, checked by the people who fixed the issue.",
    "Use AI to find gaps, duplicates and stale content in the help centre and macros.",
    "Keep knowledge owned and current, so people and bots answer from the right version.",
    "Use AI-assisted quality scoring fairly, with people reviewing the scores."
  ],
  html: String.raw`
<h2>Where AI helps with knowledge and quality</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting articles from solved tickets</td><td><span class="fit good">Good fit</span></td><td>Turns a resolution into structure fast. The agent who solved it confirms the cause and steps.</td></tr>
<tr><td>Finding duplicates and stale articles</td><td><span class="fit good">Good fit</span></td><td>Reads the whole help centre quickly. A person decides what to merge or retire.</td></tr>
<tr><td>Spotting gaps from ticket themes</td><td><span class="fit good">Good fit</span></td><td>Groups tickets with no matching article. Fill gaps from real cases, not general knowledge.</td></tr>
<tr><td>Updating macros after a policy change</td><td><span class="fit care">Use with care</span></td><td>Finds every macro mentioning the old policy. The policy owner checks the new wording.</td></tr>
<tr><td>Scoring ticket quality</td><td><span class="fit care">Use with care</span></td><td>Covers far more tickets than manual review. Scores need calibrating and a human check before they affect anyone.</td></tr>
<tr><td>Deciding policy and what you promise customers</td><td><span class="fit human">Keep human</span></td><td>Refunds, exceptions and commitments belong to named owners.</td></tr>
</tbody></table></div>

<h2>Knowledge in the workflow</h2>
<p>Knowledge-Centered Service (KCS), developed by the Consortium for Service Innovation, has long argued that knowledge should be captured and improved as part of solving cases, not written separately afterwards.<sup>[1]</sup> Two of its techniques fit AI well. “Search early, search often”: agents search the knowledge base as they work. “Reuse is review”: every time an article is used, the person using it checks it's still right and fixes it if not.</p>
<p>AI makes the capture step much cheaper. After a ticket is solved, an assistant can draft an article from the conversation and the agent's notes: the symptom in the customer's words, the exact error message, the cause and the fix. The agent then checks the draft while the case is fresh. That check matters more than ever, because the help centre is now also the source for your support bot (lesson 44).</p>

<h2>Practice: ready to publish?</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Review the AI-drafted knowledge</span></div><div class="activity-b">
<p>Decide whether each draft or update is ready to publish, or needs work first.</p>
<div data-w="sort" data-cfg="kb-drafts"></div>
</div></div>

<ol class="steps">
<li><strong>Grounded in real, solved cases</strong>Several tickets and a confirmed fix beat one ticket and a guess. Never fill gaps from a model's general knowledge.</li>
<li><strong>Clean and clear about limits</strong>Remove customer data, and say which plans and versions an article covers.</li>
<li><strong>Owned and connected</strong>An owner, a verified date, duplicates merged, and macros linked to the same article.</li>
</ol>
<div class="key"><p>Your help centre now answers customers twice: once directly, and once through every bot that reads it. Every article needs someone who checked it.</p></div>

<h2>Fair quality scoring</h2>
<p>AI can score every ticket against your quality rubric instead of the handful a team lead reviews each week. That's useful for finding patterns: a confusing macro, a policy agents misunderstand, a topic that needs training. It's risky when scores are used to judge individuals:</p>
<ul>
<li><strong>Calibrate first.</strong> Have people score a sample, compare with the AI's scores, and fix the rubric where they disagree.</li>
<li><strong>Use scores for coaching and patterns,</strong> not as the sole basis for performance decisions.</li>
<li><strong>Let agents see and challenge</strong> their scores and the reasoning behind them.</li>
<li><strong>Watch for bias,</strong> such as penalising agents who write in a second language or handle harder queues.</li>
</ul>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Volume over quality.</strong> Hundreds of unchecked articles make search worse for customers, agents and bots alike.</li>
<li><strong>Old macros left live.</strong> When a policy changes, retire the old macro, or someone will use it.</li>
<li><strong>Articles without owners.</strong> Nobody updates what nobody owns.</li>
<li><strong>Scores that become targets.</strong> Agents will optimise for what's scored, not necessarily for what helps customers.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take the five most common ticket topics from last month. Check whether each has a current help article. For any that doesn't, draft one with AI from a few solved tickets, and ask the agents who solved them to check it.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Who should check an AI-drafted article made from a solved ticket?</p><ul>
<li data-fb="Self-checking adds little.">Another AI tool.</li>
<li data-fb="Right. They know whether the cause and fix in the draft are what actually happened.">The agent who solved the ticket, while the case is fresh.</li>
<li data-fb="Customers shouldn't be the ones to find the errors.">Nobody; publish it and let customer feedback catch errors.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">The AI finds a common topic with no help article. How should the gap be filled?</p><ul>
<li data-fb="General knowledge describes similar products, not yours.">Let the AI write an article from its general knowledge.</li>
<li data-fb="Gaps don't fix themselves.">Wait until enough customers complain.</li>
<li data-fb="Right. Real cases and the product are the only reliable sources.">Draft from real solved tickets and the product, and have someone who knows the fix check it.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">AI quality scores show one agent consistently below the team average. What's the best first step?</p><ul>
<li data-fb="Right. Check the scores and the context before drawing conclusions.">Review a sample of their tickets by hand, and check their queue and context.</li>
<li data-fb="Scores alone can reflect harder queues or bias in the rubric.">Start a performance process.</li>
<li data-fb="The pattern may still be worth understanding.">Ignore it; AI scores are unreliable.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Consortium for Service Innovation, <a href="https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide" target="_blank" rel="noopener">KCS v6 Practices Guide</a>. Capturing and improving knowledge as part of solving cases, including “Search early, search often” and “Reuse is review”.</li>
</ol></section>
`
});
