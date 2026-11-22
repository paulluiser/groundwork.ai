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
  reviewed: "2026-11",
  lede: "Every solved ticket contains knowledge: what the problem looked like, what caused it and what fixed it. Most of it never makes it into the help centre. AI can close that gap, turning tickets into draft articles, spotting gaps and keeping macros current. It can also flood the help centre with plausible articles nobody checked, which then feed your support bot.",
  outcomes: [
    "Turn solved tickets into draft articles, checked by the people who fixed the issue.",
    "Use AI to find gaps, duplicates and stale content in the help centre and macros.",
    "Keep knowledge owned and current, so people and bots answer from the right version.",
    "Use AI-assisted quality scoring fairly, with people reviewing the scores.",
    "Turn a solved ticket into a knowledge article a customer or an AI assistant can rely on."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your team solved the same SSO login problem 40 times last quarter. Each agent figured it out again, from scratch or from a colleague. An assistant can turn the best of those tickets into a help article in a minute, and your customer-facing bot will start answering from it the same afternoon.</p>
<p>Which means the article has to be right, and has to say who it applies to. This lesson is about capturing knowledge from tickets quickly, and checking it before it starts answering customers on its own.</p></div>
<div class="check warmup" data-a="1"><p class="q">An AI turns a solved ticket into a help article. What's the main risk?</p><ul>
<li data-fb="Length is easy to fix.">The article will be too long for customers to finish reading.</li>
<li data-fb="Right. Scope and privacy are the common failures.">It generalises one customer's fix to everyone, or keeps their details.</li>
<li data-fb="Not the main risk.">Search engines won't index articles that were written by AI.</li>
<li data-fb="Unlikely to be the main risk.">Agents will stop solving new problems themselves.</li>
</ul></div>
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

<h2>Knowledge in the workflow</h2>
<p>Knowledge-Centered Service (KCS) treats knowledge as a by-product of solving problems: capture it while solving, structure it simply, and improve it every time it's reused.[1] AI makes the capture step much faster. The structure and the checks stay the same: every article states the environment it applies to, the issue in the customer's words, the cause, and the resolution, and is reviewed before it's published or used by a bot.</p>
<h2>Worked example: from ticket to article</h2>
<div class="worked">
<div class="wx"><b>AI draft from one ticket</b><div><p><strong>Fixing SSO login errors</strong></p><p>If you can't log in with SSO, ask your IT admin to update the certificate in Okta for northwind-health.example. Then clear your cache. This fixes SSO errors.</p></div></div>
<div class="wx strong"><b>Reviewed article</b><div><p><strong>“SAML response invalid” when signing in with SSO (Okta)</strong></p><p><strong>Applies to:</strong> Business and Enterprise workspaces using Okta SAML.</p><p><strong>Issue:</strong> Users see “SAML response invalid” after entering their Okta password.</p><p><strong>Cause:</strong> The signing certificate in Okta was rotated and no longer matches the one in your workspace settings.</p><p><strong>Resolution:</strong> A workspace admin uploads the new certificate under <em>Settings › Security › SSO</em>. Users don't need to clear their cache.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>The customer's domain is gone.</strong> One customer's details never belong in a public article.</li>
<li><strong>“SSO errors” became one specific error</strong> and one identity provider. The draft would have answered every SSO question with this fix.</li>
<li><strong>“Clear your cache” was removed</strong>: it was in the ticket but didn't fix anything. Checking against several tickets showed that.</li>
</ul>
<h2>Your turn: write an article from a ticket</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Ticket to knowledge article</span></div><div class="activity-b">
<p>Ticket summary: <em>“Customer (Lena at Brightwave Ltd) couldn't export reports to CSV; button greyed out. Agent found her role was Viewer; exports need Editor. Admin changed her role; export worked.”</em> Write the knowledge article.</p>
<div data-w="task" data-key="support-article">
<div class="task-model"><p><strong>“Export to CSV” button is greyed out</strong></p>
<p><strong>Applies to:</strong> all plans; report exports.</p>
<p><strong>Issue:</strong> The Export to CSV button on a report is greyed out and can't be clicked.</p>
<p><strong>Cause:</strong> Exporting reports requires the Editor or Admin role. Users with the Viewer role can see reports but not export them.</p>
<p><strong>Resolution:</strong> Ask a workspace admin to change your role to Editor under <em>Settings › Members</em>. If you're an admin, you can change it yourself.</p></div>
<ul class="task-rubric">
<li>Removes the customer's name and company</li>
<li>States which plans or setups it applies to</li>
<li>Describes the issue in the words a customer would use</li>
<li>Explains the cause, not just the fix</li>
<li>Gives a resolution a customer can follow, including who can do it</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Volume over quality.</strong> Hundreds of unchecked articles make search worse for customers, agents and bots alike.</li>
<li><strong>Old macros left live.</strong> When a policy changes, retire the old macro, or someone will use it.</li>
<li><strong>Articles without owners.</strong> Nobody updates what nobody owns.</li>
<li><strong>Scores that become targets.</strong> Agents will optimise for what's scored, not necessarily for what helps customers.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take the five most common ticket topics from last month. Check whether each has a current help article. For any that doesn't, draft one with AI from a few solved tickets, and ask the agents who solved them to check it.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>More articles always means better self-service.</dt><dd>Duplicate and overlapping articles confuse customers and bots. Improve and merge as often as you add.</dd>
<dt>If an article fixed one ticket, it's ready to publish.</dt><dd>Check scope against several tickets; one case can include steps that didn't matter.</dd>
<dt>Bots only answer from reviewed articles.</dt><dd>They answer from whatever is indexed. Keep drafts out of the bot's sources until reviewed.</dd>
<dt>AI quality scoring is objective.</dt><dd>Scoring rubrics encode choices. Calibrate AI scores against experienced reviewers before using them.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Capture knowledge while solving; AI makes drafting fast.</li>
<li>Every article states who it applies to, the issue, the cause and the resolution.</li>
<li>Remove customer details; check scope against several tickets.</li>
<li>Review before publishing, and before bots can answer from it.</li>
<li>Improve articles each time they're reused; merge duplicates.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">What should a knowledge article state first so bots don't misapply it?</p><ul>
<li data-fb="Useful metadata, not scope.">The name of the agent who wrote the article and the date it was published.</li>
<li data-fb="Not scope.">A friendly introduction explaining why the article exists.</li>
<li data-fb="Right. Scope prevents over-general answers.">Which plans, setups or environments it applies to.</li>
<li data-fb="Helpful later, not first.">A list of related articles the customer might find useful.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An AI draft includes a step from the ticket that didn't fix anything. How would you find out?</p><ul>
<li data-fb="Right. Steps that never mattered show up as noise.">Compare it with several tickets about the same issue.</li>
<li data-fb="It may not know.">Ask the assistant which steps were really necessary.</li>
<li data-fb="Unnecessary steps waste customers' time.">Keep the step, since it can't do any harm to include it.</li>
<li data-fb="Too late.">Publish it and see whether customers complain about the step.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">When should a new article become a source for the customer-facing bot?</p><ul>
<li data-fb="Unreviewed drafts become wrong answers.">As soon as it's drafted, so the bot learns quickly.</li>
<li data-fb="Views don't make it correct.">After it's been viewed by at least a hundred customers.</li>
<li data-fb="Not a review.">When the AI's confidence in the article is high enough.</li>
<li data-fb="Right. Review before it answers customers.">After a person has reviewed and published it.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What does Knowledge-Centered Service emphasise?</p><ul>
<li data-fb="KCS captures knowledge while solving.">Writing articles in a separate project after tickets are closed.</li>
<li data-fb="Right. Knowledge is a by-product of the work.">Capturing and improving knowledge as part of solving problems.</li>
<li data-fb="KCS spreads ownership across agents.">Having one writer own every article in the knowledge base.</li>
<li data-fb="Not its goal.">Replacing agents with knowledge bases wherever possible.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Why remove the customer's name from an article drafted from their ticket?</p><ul>
<li data-fb="Right. Privacy and relevance.">It's personal data that doesn't belong in a public article.</li>
<li data-fb="Not the reason.">Names make articles too long for search engines to index.</li>
<li data-fb="Not the reason.">Bots can't process names in articles they answer from.</li>
<li data-fb="Not the reason.">The customer might want to be credited differently.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Consortium for Service Innovation, <a href="https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide" target="_blank" rel="noopener">KCS v6 Practices Guide</a>. Capturing and improving knowledge as part of solving cases, including “Search early, search often” and “Reuse is review”.</li>
</ol></section>
`
});
