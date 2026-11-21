GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["analysis-writeup"] = {
  label: "AI write-up of an onboarding experiment",
  source: '<b>What you gave the assistant</b> A CSV of 18,400 sign-ups over six weeks, with columns for plan, country, signup date, onboarding variant (old or new) and whether the account was active after 30 days.<br><b>What you asked</b> “Did the new onboarding improve 30-day retention? Write it up for the product review.”',
  claims: [
    { t: "Overall, 30-day retention was 41% for the new onboarding and 38% for the old.", v: "ok", why: "Computable from the CSV. Ask for the code that produced it, and rerun it yourself." },
    { t: "The new onboarding improved retention across the board.", v: "bad", why: "Split by plan, retention was lower with the new onboarding for both free and paid users. The overall rise came from the new variant getting a larger share of paid users, who retain better. That's Simpson's paradox." },
    { t: "We tested 20 segments, and the improvement was significant (p < 0.05) for users in Brazil.", v: "bad", why: "With 20 comparisons, about one would cross p < 0.05 by chance alone. One hit after many looks is a lead for a new test, not a finding." },
    { t: "The difference is statistically significant, so the effect is large.", v: "bad", why: "A p-value doesn't measure the size or importance of an effect. Report the size, with a range, and let people judge whether it matters." },
    { t: "Users weren't randomly assigned: the new onboarding was shown to everyone who signed up after 12 March.", v: "ok", why: "True from the dates, and critical. A before-and-after comparison mixes the onboarding change with everything else that changed in March." },
    { t: "The chart shows retention rising sharply with the new onboarding.", v: "partial", why: "The chart's y-axis starts at 36%, so a 3-point difference looks like a doubling. Start rates at zero or label the axis clearly." }
  ],
  after: "The numbers were computed correctly; the conclusions weren't. Check splits for reversals, count how many comparisons were run, read effect sizes rather than p-values, and ask how the groups were formed."
};
GW.lesson({
  id: "data-analysis",
  lede: "Lesson 24 covered getting the right numbers out of a database. This lesson is about what happens next: analysis, charts and conclusions. Assistants now run code on your data and produce polished write-ups in minutes. They also walk into the same statistical traps people do, and they rarely stop to warn you.",
  outcomes: [
    "Ask for analysis as code you can read and rerun, not just an answer.",
    "Recognise Simpson's paradox, multiple comparisons and p-value misreadings in an AI write-up.",
    "Spot charts that exaggerate or hide, and ask for honest defaults.",
    "Keep the claim that an effect was caused by something tied to how the data was collected."
  ],
  html: String.raw`
<h2>Where AI helps in analysis</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Exploring a dataset: shapes, gaps, outliers</td><td><span class="fit good">Good fit</span></td><td>Quick summaries and first charts. Check row counts and the <a class="term" data-t="grain">grain</a> before anything else (lesson 24).</td></tr>
<tr><td>Writing analysis code in a notebook</td><td><span class="fit good">Good fit</span></td><td>Readable, rerunnable steps. Read the code; the answer is only as good as each step.</td></tr>
<tr><td>Choosing and drafting charts</td><td><span class="fit good">Good fit</span></td><td>Good at matching chart type to question when asked. Check axes, scales and what's been left out.</td></tr>
<tr><td>Statistical tests</td><td><span class="fit care">Use with care</span></td><td>Will run whatever test you ask for, and often too many. Plan the comparison before you look.</td></tr>
<tr><td>Explaining why a number moved</td><td><span class="fit care">Use with care</span></td><td>Produces a plausible story for any change. Treat each as a hypothesis to test.</td></tr>
<tr><td>Recommending a decision from the analysis</td><td><span class="fit human">Keep human</span></td><td>Depends on costs, context and risk the data doesn't contain.</td></tr>
</tbody></table></div>

<h2>Analysis you can rerun</h2>
<p>When an assistant answers a data question in prose, you can't tell which filters, joins or exclusions it used. Ask for the work as code: a notebook or script that loads the data, does each step visibly and produces the numbers. Then rerun it yourself. This has three benefits: you can read every step, a colleague can review it, and next month you can run it again on new data and get comparable results.</p>
<p>A good habit: before asking for any result, ask the assistant to describe the dataset back to you, with row count, date range, the grain, and how many values are missing in each column. Mistakes at this step spoil everything after it.</p>

<h2>Worked example: did the new onboarding work?</h2>
<p>You gave an assistant six weeks of sign-up data and asked whether new onboarding improved retention. The write-up is clear, has a chart, and is ready for the product review.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Review the analysis before it goes to the meeting</span></div><div class="activity-b">
<p>Flag each statement you wouldn't present as written.</p>
<div data-w="claims" data-cfg="analysis-writeup"></div>
</div></div>

<ol class="steps">
<li><strong>The overall number reversed when split</strong>The classic example is Berkeley's 1973 graduate admissions: overall, men were admitted at a higher rate, but department by department the pattern mostly disappeared or reversed, because women applied more to competitive departments.<sup>[1]</sup> Always check the main splits.</li>
<li><strong>Twenty looks found one “significant” result</strong>If you test enough segments, some will cross the line by chance. Decide the comparison in advance, or treat surprises as ideas for the next test.</li>
<li><strong>Significance was read as size</strong>The American Statistical Association's statement on p-values says plainly that a p-value doesn't measure the size of an effect or the importance of a result.<sup>[2]</sup></li>
<li><strong>The design couldn't support the claim</strong>Without random assignment, “the onboarding caused it” competes with everything else that changed after 12 March.</li>
</ol>
<div class="key"><p>An assistant will compute almost anything correctly and conclude almost anything confidently. Your job is the second part: splits, number of comparisons, effect size, and how the groups were formed.</p></div>

<h2>Charts that don't mislead</h2>
<p>Anscombe's famous 1973 example shows four small datasets with nearly identical averages, variances and correlations that look completely different when plotted.<sup>[3]</sup> Plot before you summarise. Then, for every chart an assistant draws, check:</p>
<ul>
<li><strong>Axes:</strong> bar charts start at zero; any truncated axis is labelled and justified.</li>
<li><strong>What's missing:</strong> filtered rows, excluded dates, the “other” category.</li>
<li><strong>Scale:</strong> counts versus rates, and whether the denominators changed.</li>
<li><strong>Uncertainty:</strong> small groups get ranges, not just a point.</li>
</ul>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Asking “is it significant?” until it is.</strong> Each extra test or subgroup raises the chance of a false hit.</li>
<li><strong>Silent cleaning.</strong> Assistants may drop nulls or outliers without saying so. Ask what was removed and why.</li>
<li><strong>Stories for every wiggle.</strong> Week-to-week noise gets a cause. Ask whether the change is bigger than normal variation first.</li>
<li><strong>Uploading data to the wrong tool.</strong> Customer-level data belongs in approved environments only (lesson 8).</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take a headline metric from a recent report. Ask an assistant to split it by the two or three dimensions that matter most for your business, as code. Check whether any split goes in the opposite direction to the headline.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">Overall conversion went up, but it went down for both new and returning visitors. What's the most likely explanation?</p><ul>
<li data-fb="Possible in principle, but this pattern has a well-known cause.">A calculation error in the overall figure.</li>
<li data-fb="The pattern isn't random; it comes from the mix.">Random noise.</li>
<li data-fb="Right. Simpson's paradox: the mix moved towards the group that converts better.">The mix of visitors shifted towards the group with higher conversion.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An assistant tested 30 customer segments and found three with p &lt; 0.05. How should you report this?</p><ul>
<li data-fb="Right. With 30 tests, a few hits are expected by chance. Confirm them with a planned test.">As leads to confirm with a new, planned test.</li>
<li data-fb="Three hits in thirty is about what chance alone would give.">As three proven effects.</li>
<li data-fb="Running more tests makes the problem worse.">Run more tests until the result is clearer.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why ask for analysis as a notebook or script rather than an answer?</p><ul>
<li data-fb="Code isn't automatically more accurate.">Because code is always correct.</li>
<li data-fb="Right. Visible steps can be reviewed, rerun and repeated next month.">So every step can be read, checked and rerun.</li>
<li data-fb="Speed isn't the main reason.">Because it's faster than reading prose.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Bickel, Hammel and O'Connell (1975), <a href="https://doi.org/10.1126/science.187.4175.398" target="_blank" rel="noopener">Sex Bias in Graduate Admissions: Data from Berkeley</a>. <i>Science</i> 187(4175).</li>
<li>Wasserstein and Lazar (2016), <a href="https://doi.org/10.1080/00031305.2016.1154108" target="_blank" rel="noopener">The ASA Statement on p-Values: Context, Process, and Purpose</a>. <i>The American Statistician</i>.</li>
<li>Anscombe (1973), <a href="https://doi.org/10.1080/00031305.1973.10478966" target="_blank" rel="noopener">Graphs in Statistical Analysis</a>. <i>The American Statistician</i>.</li>
</ol></section>
`
});
