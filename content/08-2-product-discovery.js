GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["market-brief"] = {
  label: "competitor brief for a scheduling feature",
  source: '<b>What you gave the assistant</b> Pricing pages for Calendo and Slotwise (saved last week), your own pricing page, and 40 sales-call notes tagged “lost deal”.<br><b>What you asked</b> “Summarise how we compare on scheduling, and what lost deals say about it.”',
  claims: [
    { t: "Calendo includes round-robin scheduling on its Team plan at $12 per seat a month.", v: "ok", why: "Matches the Calendo pricing page you supplied." },
    { t: "Slotwise has about 40% of the mid-market scheduling segment.", v: "none", why: "Nothing you supplied gives market share. A specific number like this is exactly what models fill in from patterns. Find a dated, named source or drop it." },
    { t: "Slotwise recently launched an AI meeting assistant.", v: "none", why: "Not in the pages you gave it, and “recently” depends on a training cutoff you can't see. Check Slotwise's own release notes." },
    { t: "In lost-deal notes, scheduling comes up in 11 of 40 calls, most often as “no round-robin”.", v: "ok", why: "Countable from the notes you supplied. Spot-check a few of the 11 before you repeat it." },
    { t: "Customers clearly prefer Calendo's interface.", v: "judg", why: "Nothing in a pricing page or call notes measures preference across customers. At most, a few lost-deal notes mention it. Say how many." },
    { t: "Adding round-robin would recover most of these lost deals.", v: "judg", why: "A forecast presented as a finding. Lost-deal notes give the reason a buyer stated, not what would have changed their mind. This is your call to make and test." }
  ],
  after: "Market numbers and recency claims need a dated source. Counts from your own data need a spot-check. Forecasts are yours to own."
};
GW.lesson({
  id: "product-discovery",
  lede: "Discovery is where product work is decided: which problems are real, how big they are, and which to solve first. AI can make the reading, sorting and drafting much faster. It can't tell you what's true about your market or decide what matters.",
  outcomes: [
    "Use AI to draft interview guides, scan competitors and organise evidence, without letting it stand in for customers.",
    "Trace every market claim to a dated source, and spot numbers that were filled in.",
    "Keep sizing and prioritisation honest: inputs you can show, ranges instead of single figures.",
    "Recognise when an AI summary has turned a few voices into “customers say”."
  ],
  html: String.raw`
<h2>Where AI helps in discovery</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Drafting an interview guide</td><td><span class="fit good">Good fit</span></td><td>Good at open, non-leading questions when you ask for them. Read it for questions that suggest an answer.</td></tr>
<tr><td>Scanning competitor pages you supply</td><td><span class="fit good">Good fit</span></td><td>Fast side-by-side comparison of material in front of it. Every figure should trace to a page you can open.</td></tr>
<tr><td>Competitor facts from memory</td><td><span class="fit care">Use with care</span></td><td>Pricing, features and launches change after the training cutoff (lesson 3). Treat as leads to look up.</td></tr>
<tr><td>Market sizing</td><td><span class="fit care">Use with care</span></td><td>Useful for laying out the method. The inputs must come from sources you can name.</td></tr>
<tr><td>Simulated customers (“synthetic users”)</td><td><span class="fit care">Use with care</span></td><td>Fine for rehearsing an interview. Not evidence of what real customers need.<sup>[1]</sup></td></tr>
<tr><td>Choosing what to build</td><td><span class="fit human">Keep human</span></td><td>Weighs strategy, cost and people in ways no summary captures. AI can lay out the trade-offs.</td></tr>
</tbody></table></div>

<h2>Interview guides and synthesis</h2>
<p>Ask for a guide the way you'd brief a researcher (lesson 5): the decision it informs, who you're talking to, and what you already believe. Then ask the assistant to flag any question that assumes your hypothesis. A question like “How much time would automatic scheduling save you?” assumes it would save time. “Walk me through the last time you set up a meeting with several people” doesn't.</p>
<p>When you synthesise interviews, give the assistant the transcripts and ask for themes with a count and the participant IDs behind each one. Then open three of the cited passages per theme. Synthesis is where a model's agreeableness shows (lesson 3): it finds support for whatever framing you hand it.</p>

<h2>Worked example: a competitor brief</h2>
<p>You gave an assistant two competitors' pricing pages, your own, and 40 lost-deal notes, and asked how you compare on scheduling. The brief came back clear and quotable. Some of it came from your material, and some didn't.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Trace the market claims</span></div><div class="activity-b">
<p>Flag every sentence you couldn't repeat in a planning meeting as written.</p>
<div data-w="claims" data-cfg="market-brief"></div>
</div></div>

<ol class="steps">
<li><strong>Numbers without a source were filled in</strong>Market share is a classic. It reads like research, and it came from nowhere you can point to.</li>
<li><strong>“Recently” is relative to a date you can't see</strong>Anything about launches, prices or funding needs checking against the competitor's own pages today.</li>
<li><strong>Preferences and forecasts were presented as findings</strong>“Customers prefer” and “would recover most deals” are judgments. Write them as yours, with the evidence that supports them.</li>
</ol>
<div class="key"><p>In discovery, a claim is only as good as its source. If you can't open the page or the transcript behind a sentence, it's a hypothesis.</p></div>

<h2>Sizing and prioritising</h2>
<p>AI is a good partner for structuring an estimate: listing the segments, the steps from total market to reachable customers, the assumptions at each step. Then fill in each input yourself, from data you can cite, and give ranges rather than single numbers. A sizing with a stated low and high, and the two assumptions that move it most, is more honest and more useful than one confident figure.</p>
<p>For prioritisation, ask the assistant to score options against criteria you define, then argue the case against your top pick. Use the output to sharpen the discussion, not to settle it. A study of consultants found AI raised quality on tasks inside its abilities and lowered accuracy on a task just outside them, where people trusted it anyway.<sup>[2]</sup> Weighing strategy is often just outside.</p>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Loud voices become “customers”.</strong> Three angry notes can turn into “users are frustrated”. Always ask for counts and IDs.</li>
<li><strong>Stale competitor knowledge.</strong> A model may describe a competitor as it was a year ago. Supply current pages, or check.</li>
<li><strong>Confidential material in public tools.</strong> Interview transcripts and deal notes contain names and commercial detail. Use approved tools (lesson 8).</li>
<li><strong>Leading guides.</strong> If you describe your idea in the prompt, the guide will be about your idea. Describe the problem instead.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take a competitor comparison you already have. Ask an assistant to update it from memory, then from the competitors' current pages. List every difference between the two versions. That list is how much you'd have got wrong.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">An AI summary of 12 interviews says “users want dark mode”. What should you ask for first?</p><ul>
<li data-fb="Wording won't tell you how many people said it.">A more precise rewording of the theme.</li>
<li data-fb="It may be right, but you don't know the evidence yet.">A priority score for dark mode.</li>
<li data-fb="Right. Then read some of the passages behind it.">How many participants said it, and which ones.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Which competitor detail most needs checking before you repeat it?</p><ul>
<li data-fb="Right. Prices and plans change, and a model may describe last year's.">Its current price for a plan, given from the model's memory.</li>
<li data-fb="This came from a page you supplied; a quick look confirms it.">A feature listed on the pricing page you pasted in.</li>
<li data-fb="Useful, but it's structure, not a fact about the market.">The headings the assistant used to organise the brief.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">How should a market sizing built with AI be presented?</p><ul>
<li data-fb="A single figure hides how uncertain the inputs are.">As one number, rounded so it looks less precise.</li>
<li data-fb="Right. The method can come from AI; the inputs and the range are yours to defend.">As a range, with cited inputs and the assumptions that move it most.</li>
<li data-fb="Citing the tool tells nobody where the numbers came from.">As the assistant's estimate, credited to the tool.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Nielsen Norman Group (2024), <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users: If, When, and How to Use AI-Generated “Research”</a>. Why simulated participants can help prepare research but can't replace it.</li>
<li>Dell'Acqua et al. (2023), <a href="https://www.hbs.edu/faculty/Pages/item.aspx?num=64700" target="_blank" rel="noopener">Navigating the Jagged Technological Frontier</a>. Harvard Business School working paper on consultants using GPT-4, inside and outside its abilities.</li>
</ol></section>
`
});
