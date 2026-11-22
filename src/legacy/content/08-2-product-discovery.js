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
  reviewed: "2026-11",
  lede: "Discovery is where product work is decided: which problems are real, how big they are, and which to solve first. AI can make the reading, sorting and drafting much faster. It can't tell you what's true about your market or decide what matters.",
  outcomes: [
    "Use AI to draft interview guides, scan competitors and organise evidence, without letting it stand in for customers.",
    "Trace every market claim to a dated source, and spot numbers that were filled in.",
    "Keep sizing and prioritisation honest: inputs you can show, ranges instead of single figures.",
    "Recognise when an AI summary has turned a few voices into “customers say”.",
    "Map evidence to opportunities, so AI-organised findings feed a decision you can defend."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your head of product wants to know whether to invest in a scheduling feature next quarter. You have 40 lost-deal notes, six recent interviews, two competitors' websites and a week. An assistant offers to produce a market brief, an interview guide and a sizing in an afternoon.</p>
<p>It will. The brief will be fluent, the sizing will have a single confident number, and some of both will have come from nowhere you can point to. Discovery with AI is fast; this lesson is about keeping it honest.</p></div>
<div class="check warmup" data-a="3"><p class="q">Which interview question is least likely to bias the answer?</p><ul>
<li data-fb="It assumes scheduling is a problem and that automation would save time.">“How much time would automatic scheduling save you each week?”</li>
<li data-fb="Hypothetical buying questions predict real behaviour poorly.">“Would you pay more each month for a plan that schedules meetings for you?”</li>
<li data-fb="A leading question: it tells the person what to feel.">“Don't you find setting up meetings with clients frustrating?”</li>
<li data-fb="Right. It asks about real, recent behaviour without suggesting an answer.">“Tell me about the last time you set up a meeting with a client.”</li>
</ul></div>
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

<h2>Talk about the past, not the future</h2>
<p>Rob Fitzpatrick's <em>The Mom Test</em> puts the core rule simply: ask about people's lives and past behaviour, not your idea and their opinions about the future.[3] Opinions are cheap and polite; past behaviour is evidence. This matters more with AI in the loop, because an assistant asked for interview questions about your idea will write questions about your idea.</p>
<p>A good brief for an interview guide states the decision the research informs, who you'll talk to, and what you currently believe, then asks the assistant to flag every question that assumes that belief. Review the result against three tests: does each question ask about something that already happened; does any question contain the answer; and would you learn something if the answer surprised you?</p>
<h2>From evidence to opportunities</h2>
<p>Teresa Torres's opportunity solution tree connects a desired outcome to the customer opportunities (needs, pains, desires) that could move it, and only then to solutions.[4] It's a useful frame for AI-assisted synthesis: ask the assistant to sort evidence into opportunities, each with the quotes and deal notes behind it, and keep solutions out of the first pass. When synthesis jumps straight to features, it usually means the evidence has been read through the lens of an idea someone already had.</p>
<h2>Worked example: a sizing you can defend</h2>
<p>You ask an assistant to size the market for a scheduling add-on. Compare two answers.</p>
<div class="worked">
<div class="wx"><b>Weak: single number, unnamed inputs</b><div><p>“The addressable market for scheduling tools among mid-sized agencies is approximately $1.2B, growing at 14% annually.”</p></div></div>
<div class="wx strong"><b>Strong: method, cited inputs, range</b><div><p>“Agencies with 20–200 staff in our three markets: 18,000–24,000 (national business registers, 2025). Share already paying for a scheduling tool: 30–45% (our survey of 210 prospects). Price we could charge: $8–12 per seat per month (current competitor pricing pages, checked 14 Nov). Reachable revenue: <strong>$6M–$19M a year.</strong> The two inputs that move it most: share already paying, and seats per agency.”</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>The weak answer is precise and unfalsifiable.</strong> Nobody can say where $1.2B or 14% came from, so nobody can check or update it.</li>
<li><strong>The strong answer is less impressive and far more useful.</strong> Every input has a source you can open and a date.</li>
<li><strong>The range is honest.</strong> A threefold spread tells leadership how uncertain this is, which is itself a finding.</li>
<li><strong>Naming the inputs that matter most</strong> tells you what to research next: a cheap survey question could narrow the range a lot.</li>
</ul>
<h2>Competitor research that stays current</h2>
<p>Treat a model's knowledge of competitors as a snapshot of an unknown date. For anything you'll repeat (price, plan limits, a feature, a launch, a customer count), get it from the competitor's own current page and record the date you checked. Then ask the assistant to compare only the material you pasted in, and to mark anything it adds from memory. That one instruction separates the parts you can quote from the parts you must check.</p>
<h2>Your turn: write a non-leading interview guide</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Five questions about scheduling, without leading</span></div><div class="activity-b">
<p>You're researching whether agency account managers struggle to schedule client meetings. Write five interview questions you'd use. Then mark the one you think is most at risk of leading the participant, and say why.</p>
<div data-w="task" data-key="product-discovery-guide">
<div class="task-model"><ol>
<li>Tell me about the last time you set up a meeting with a client. How did it go?</li>
<li>Who else was involved in finding the time, and what did each person do?</li>
<li>What did you use: email, a calendar, a tool, a phone call?</li>
<li>When did it last go wrong, and what happened as a result?</li>
<li>What have you tried to make it easier? What did you stop using, and why?</li>
</ol><p><strong>Most at risk:</strong> question 4 assumes it goes wrong. If the participant hasn't mentioned problems, ask “Has it ever not gone to plan?” instead.</p></div>
<ul class="task-rubric">
<li>Most questions ask about past, specific events rather than opinions or the future</li>
<li>No question mentions or describes your idea</li>
<li>No question tells the participant what to feel (“frustrating”, “annoying”)</li>
<li>At least one question asks what they've already tried or paid for</li>
<li>You identified a riskier question and suggested a fix</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Loud voices become “customers”.</strong> Three angry notes can turn into “users are frustrated”. Always ask for counts and IDs.</li>
<li><strong>Stale competitor knowledge.</strong> A model may describe a competitor as it was a year ago. Supply current pages, or check.</li>
<li><strong>Confidential material in public tools.</strong> Interview transcripts and deal notes contain names and commercial detail. Use approved tools (lesson 8).</li>
<li><strong>Leading guides.</strong> If you describe your idea in the prompt, the guide will be about your idea. Describe the problem instead.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take a competitor comparison you already have. Ask an assistant to update it from memory, then from the competitors' current pages. List every difference between the two versions. That list is how much you'd have got wrong.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>Synthetic users give you a fast, cheap version of interviews.</dt><dd>They give you typical-sounding answers from training data. Useful for rehearsing a guide; not evidence about your customers.[1]</dd>
<dt>A bigger number of AI-generated responses makes the findings more reliable.</dt><dd>Volume doesn't fix a source that isn't your customers. Fifty simulated interviews are still zero interviews.</dd>
<dt>A precise market size is more credible.</dt><dd>Precision without cited inputs is less credible. Ranges with sources survive scrutiny.</dd>
<dt>If it's on the competitor's site, the assistant knows it.</dt><dd>Only if you pasted the current page. Otherwise it may be describing last year's site.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Ask about past behaviour, not opinions about your idea.</li>
<li>Sort evidence into opportunities before anyone mentions solutions.</li>
<li>Every market claim needs a source you can open and a date.</li>
<li>Present sizings as ranges with cited inputs and the assumptions that move them.</li>
<li>Supply current competitor pages and ask the assistant to mark anything from memory.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">An AI market brief says a competitor “recently cut prices by 20%”. What should you do before repeating it?</p><ul>
<li data-fb="Right. “Recently” is relative to a date you can't see.">Check the competitor's current pricing page and note the date you checked.</li>
<li data-fb="Asking twice gets the same memory, not a source.">Ask the assistant to confirm the claim again in a fresh conversation, then keep it.</li>
<li data-fb="Hedging the wording doesn't make the claim any more true.">Soften it to “reportedly cut prices” and keep it in the brief.</li>
<li data-fb="Being announceable isn't the same as being checked.">Keep it, since price changes are usually announced publicly.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which sizing is most useful to a head of product?</p><ul>
<li data-fb="Precise but unsourced: nobody can check or update it.">“$1.2B addressable market, growing 14% a year.”</li>
<li data-fb="No numbers and no method: not a sizing at all.">“A large and fast-growing opportunity in our segment.”</li>
<li data-fb="Right. A range, sources, and the assumption to research next.">“$6M–$19M a year, from cited inputs, most sensitive to adoption.”</li>
<li data-fb="Averaging guesses produces a precise-looking guess.">“$12.4M, the midpoint of three separate sizing models the assistant ran for you.”</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Your synthesis jumps from interview themes straight to a list of features. What's the risk?</p><ul>
<li data-fb="Estimation isn't the main issue here.">Features are harder to estimate than opportunities.</li>
<li data-fb="Format preferences aren't the risk.">Stakeholders prefer opportunities written as user stories.</li>
<li data-fb="Context length isn't what makes this risky.">The assistant may run out of context window on long lists of candidate features.</li>
<li data-fb="Right. Opportunities first keeps the evidence honest.">Evidence may have been read through an idea someone already had.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What does The Mom Test recommend asking about?</p><ul>
<li data-fb="Opinions about your idea are polite, not evidence.">Whether people like your idea and would recommend it to others.</li>
<li data-fb="Right. Past behaviour is the evidence; opinions aren't.">People's real, recent behaviour and what they've already tried.</li>
<li data-fb="Future wish lists predict real behaviour poorly.">What features people would want in an ideal future product.</li>
<li data-fb="Hypothetical prices are among the least reliable answers.">How much people would pay for the product if it existed.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">You paste two competitors' pages and ask for a comparison. Which extra instruction matters most?</p><ul>
<li data-fb="Right. It separates quotable facts from things to check.">“Mark anything you add that isn't in the pages I pasted.”</li>
<li data-fb="Helpful formatting, but it doesn't protect accuracy.">“Use a table with one row per feature and one column each.”</li>
<li data-fb="Length limits don't stop facts being filled in from memory.">“Keep the comparison under 300 words so it's easy to read.”</li>
<li data-fb="Tone matters less than knowing what's sourced.">“Write it in a neutral tone suitable for leadership.”</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Nielsen Norman Group (2024), <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users: If, When, and How to Use AI-Generated “Research”</a>. Why simulated participants can help prepare research but can't replace it.</li>
<li>Dell'Acqua et al. (2023), <a href="https://www.hbs.edu/faculty/Pages/item.aspx?num=64700" target="_blank" rel="noopener">Navigating the Jagged Technological Frontier</a>. Harvard Business School working paper on consultants using GPT-4, inside and outside its abilities.</li>

<li>Rob Fitzpatrick (2013), <a href="https://www.momtestbook.com/" target="_blank" rel="noopener">The Mom Test</a>. How to ask customers questions that produce evidence rather than polite opinions.</li>
<li>Teresa Torres, Product Talk, <a href="https://www.producttalk.org/opportunity-solution-trees/" target="_blank" rel="noopener">Opportunity Solution Trees</a>. Connecting outcomes to customer opportunities before solutions.</li>
</ol></section>
`
});
