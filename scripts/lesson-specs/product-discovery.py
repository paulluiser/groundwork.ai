SPEC = dict(
file="08-2-product-discovery.js",
reviewed="2026-11",
outcomes=["Map evidence to opportunities, so AI-organised findings feed a decision you can defend."],
situation="""<p>Your head of product wants to know whether to invest in a scheduling feature next quarter. You have 40 lost-deal notes, six recent interviews, two competitors' websites and a week. An assistant offers to produce a market brief, an interview guide and a sizing in an afternoon.</p>
<p>It will. The brief will be fluent, the sizing will have a single confident number, and some of both will have come from nowhere you can point to. Discovery with AI is fast; this lesson is about keeping it honest.</p>""",
warmup=dict(q="Which interview question is least likely to bias the answer?", a=3, opts=[
  ("“How much time would automatic scheduling save you each week?”", "It assumes scheduling is a problem and that automation would save time."),
  ("“Would you pay more for a plan that schedules meetings for you?”", "Hypothetical buying questions predict real behaviour poorly."),
  ("“Don't you find setting up meetings with clients frustrating?”", "A leading question: it tells the person what to feel."),
  ("“Tell me about the last time you set up a meeting with a client.”", "Right. It asks about real, recent behaviour without suggesting an answer."),
 ]),
sections="""<h2>Talk about the past, not the future</h2>
<p>Rob Fitzpatrick's <em>The Mom Test</em> puts the core rule simply: ask about people's lives and past behaviour, not your idea and their opinions about the future.[S1] Opinions are cheap and polite; past behaviour is evidence. This matters more with AI in the loop, because an assistant asked for interview questions about your idea will write questions about your idea.</p>
<p>A good brief for an interview guide states the decision the research informs, who you'll talk to, and what you currently believe, then asks the assistant to flag every question that assumes that belief. Review the result against three tests: does each question ask about something that already happened; does any question contain the answer; and would you learn something if the answer surprised you?</p>
<h2>From evidence to opportunities</h2>
<p>Teresa Torres's opportunity solution tree connects a desired outcome to the customer opportunities (needs, pains, desires) that could move it, and only then to solutions.[S2] It's a useful frame for AI-assisted synthesis: ask the assistant to sort evidence into opportunities, each with the quotes and deal notes behind it, and keep solutions out of the first pass. When synthesis jumps straight to features, it usually means the evidence has been read through the lens of an idea someone already had.</p>
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
</div></div></div>""",
myths=[
 ("Synthetic users give you a fast, cheap version of interviews.", "They give you typical-sounding answers from training data. Useful for rehearsing a guide; not evidence about your customers.[1]"),
 ("A bigger number of AI-generated responses makes the findings more reliable.", "Volume doesn't fix a source that isn't your customers. Fifty simulated interviews are still zero interviews."),
 ("A precise market size is more credible.", "Precision without cited inputs is less credible. Ranges with sources survive scrutiny."),
 ("If it's on the competitor's site, the assistant knows it.", "Only if you pasted the current page. Otherwise it may be describing last year's site."),
],
recap=[
 "Ask about past behaviour, not opinions about your idea.",
 "Sort evidence into opportunities before anyone mentions solutions.",
 "Every market claim needs a source you can open and a date.",
 "Present sizings as ranges with cited inputs and the assumptions that move them.",
 "Supply current competitor pages and ask the assistant to mark anything from memory.",
],
checks=[
 dict(q="An AI market brief says a competitor “recently cut prices by 20%”. What should you do before repeating it?", a=0, opts=[
  ("Check the competitor's current pricing page and note the date you checked.", "Right. “Recently” is relative to a date you can't see."),
  ("Ask the assistant to confirm the claim again in a new conversation.", "Asking twice gets the same memory, not a source."),
  ("Soften it to “reportedly cut prices” and keep it in the brief.", "Hedging the wording doesn't make the claim any more true."),
  ("Keep it, since price changes are usually announced publicly.", "Being announceable isn't the same as being checked."),
 ]),
 dict(q="Which sizing is most useful to a head of product?", a=2, opts=[
  ("“$1.2B addressable market, growing 14% a year.”", "Precise but unsourced: nobody can check or update it."),
  ("“A large and fast-growing opportunity in our segment.”", "No numbers and no method: not a sizing at all."),
  ("“$6M–$19M a year, from cited inputs, most sensitive to adoption.”", "Right. A range, sources, and the assumption to research next."),
  ("“$12.4M, the midpoint of three models the assistant ran.”", "Averaging guesses produces a precise-looking guess."),
 ]),
 dict(q="Your synthesis jumps from interview themes straight to a list of features. What's the risk?", a=3, opts=[
  ("Features are harder to estimate than opportunities.", "Estimation isn't the main issue here."),
  ("Stakeholders prefer opportunities written as user stories.", "Format preferences aren't the risk."),
  ("The assistant may run out of context on long feature lists.", "Context length isn't what makes this risky."),
  ("Evidence may have been read through an idea someone already had.", "Right. Opportunities first keeps the evidence honest."),
 ]),
 dict(q="What does The Mom Test recommend asking about?", a=1, opts=[
  ("Whether people like your idea and would recommend it to others.", "Opinions about your idea are polite, not evidence."),
  ("People's real, recent behaviour and what they've already tried.", "Right. Past behaviour is the evidence; opinions aren't."),
  ("What features people would want in an ideal future product.", "Future wish lists predict real behaviour poorly."),
  ("How much people would pay for the product if it existed.", "Hypothetical prices are among the least reliable answers."),
 ]),
 dict(q="You paste two competitors' pages and ask for a comparison. Which extra instruction matters most?", a=0, opts=[
  ("“Mark anything you add that isn't in the pages I pasted.”", "Right. It separates quotable facts from things to check."),
  ("“Use a table with one row per feature and one column each.”", "Helpful formatting, but it doesn't protect accuracy."),
  ("“Keep the comparison under 300 words so it's easy to read.”", "Length limits don't stop facts being filled in from memory."),
  ("“Write it in a neutral tone suitable for leadership.”", "Tone matters less than knowing what's sourced."),
 ]),
],
sources=[
 'Rob Fitzpatrick (2013), <a href="https://www.momtestbook.com/" target="_blank" rel="noopener">The Mom Test</a>. How to ask customers questions that produce evidence rather than polite opinions.',
 'Teresa Torres, Product Talk, <a href="https://www.producttalk.org/opportunity-solution-trees/" target="_blank" rel="noopener">Opportunity Solution Trees</a>. Connecting outcomes to customer opportunities before solutions.',
],
)
