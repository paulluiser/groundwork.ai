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
  reviewed: "2026-11",
  lede: "Lesson 24 covered getting the right numbers out of a database. This lesson is about what happens next: analysis, charts and conclusions. Assistants now run code on your data and produce polished write-ups in minutes. They also walk into the same statistical traps people do, and they rarely stop to warn you.",
  outcomes: [
    "Ask for analysis as code you can read and rerun, not just an answer.",
    "Recognise Simpson's paradox, multiple comparisons and p-value misreadings in an AI write-up.",
    "Spot charts that exaggerate or hide, and ask for honest defaults.",
    "Keep the claim that an effect was caused by something tied to how the data was collected.",
    "Rewrite an AI analysis conclusion so its strength matches the evidence."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>An assistant analyses last month's onboarding change and writes: “The new onboarding increased activation by 18%, a statistically significant improvement (p &lt; 0.05). We recommend rolling it out to all regions.” It comes with a polished chart and a confident summary.</p>
<p>The change launched the same week as a marketing campaign that brought in a different kind of user, and the chart's y-axis starts at 40%. The analysis isn't fake; it's an answer to a weaker question than the one it claims to answer. This lesson is about matching conclusions to evidence.</p></div>
<div class="check warmup" data-a="0"><p class="q">Activation rose after a new onboarding launched, in the same week as a big campaign. What can you conclude?</p><ul>
<li data-fb="Right. Two changes at once make cause hard to separate.">Activation rose; the cause isn't clear yet.</li>
<li data-fb="The campaign could explain some or all of it.">The onboarding caused the increase in activation.</li>
<li data-fb="Equally unproven.">The campaign caused the increase in activation.</li>
<li data-fb="The data is useful; the causal claim isn't supported.">Nothing, since the data is unusable.</li>
</ul></div>
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

<h2>Strength of evidence, in plain words</h2>
<p>Conclusions come in strengths. Assistants tend to write the strongest version available. Match the wording to the design of the analysis:</p>
<div class="tbl"><table><thead><tr><th>Design</th><th>What you can say</th></tr></thead><tbody>
<tr><td>Randomised experiment (A/B test), pre-registered metric</td><td>“The change caused an increase of about X (range Y–Z).”</td></tr>
<tr><td>Before/after with a comparison group that didn't change</td><td>“Activation rose more where the change launched; other explanations are less likely but possible.”</td></tr>
<tr><td>Before/after only</td><td>“Activation rose after the change. We can't separate it from other changes in the same period.”</td></tr>
<tr><td>Correlation across users</td><td>“Users who did X also tended to do Y.” No causal claim.</td></tr>
</tbody></table></div>
<p>A p-value doesn't upgrade a weak design. The American Statistical Association's statement is blunt: a p-value doesn't measure the size or importance of an effect, and doesn't by itself tell you whether a hypothesis is true.[2]</p>
<h2>Worked example: rewriting the conclusion</h2>
<div class="worked">
<div class="wx"><b>AI conclusion</b><div><p>“The new onboarding increased activation by 18%, a statistically significant improvement (p &lt; 0.05). We recommend rolling it out to all regions.”</p></div></div>
<div class="wx strong"><b>Matched to the evidence</b><div><p>“Activation was 52% in the month after launch, against 44% before (an 8-point rise). A campaign started the same week and brought in more trial users from partners, who usually activate more. Among non-campaign users the rise was 3 points. Recommend an A/B test in two regions before full rollout.”</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>“18%” was a relative change</strong> (52/44). Stating points and the base avoids inflating it.</li>
<li><strong>Splitting by source</strong> showed most of the rise came with the campaign.</li>
<li><strong>The recommendation now matches the evidence:</strong> test, then decide.</li>
</ul>
<h2>Your turn: right-size a conclusion</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Rewrite an overstated finding</span></div><div class="activity-b">
<p>An assistant concluded: <em>“Customers who use the mobile app spend 40% more. Pushing all customers to the app will grow revenue by 40%.”</em> The data is a comparison of app users and non-app users last year. Rewrite the conclusion and say what analysis would support a stronger claim.</p>
<div data-w="task" data-key="data-conclusion">
<div class="task-model"><p>“Customers who used the app spent 40% more on average than those who didn't. This is a correlation: customers who already spend more, or are more engaged, may be more likely to install the app. It doesn't show that getting someone to use the app would raise their spending.”</p>
<p><strong>Stronger evidence:</strong> a randomised test of an app-install prompt, comparing later spending between prompted and unprompted customers; or comparing the same customers' spending before and after they installed the app, against similar customers who didn't.</p></div>
<ul class="task-rubric">
<li>Describes the finding as a correlation, not a cause</li>
<li>Names at least one plausible alternative explanation</li>
<li>Drops the unsupported revenue forecast</li>
<li>Proposes a design that could support a causal claim</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Asking “is it significant?” until it is.</strong> Each extra test or subgroup raises the chance of a false hit.</li>
<li><strong>Silent cleaning.</strong> Assistants may drop nulls or outliers without saying so. Ask what was removed and why.</li>
<li><strong>Stories for every wiggle.</strong> Week-to-week noise gets a cause. Ask whether the change is bigger than normal variation first.</li>
<li><strong>Uploading data to the wrong tool.</strong> Customer-level data belongs in approved environments only (lesson 8).</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take a headline metric from a recent report. Ask an assistant to split it by the two or three dimensions that matter most for your business, as code. Check whether any split goes in the opposite direction to the headline.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A significant p-value proves the change worked.</dt><dd>It says the data would be unusual if there were no effect, given assumptions. It doesn't measure size, importance or cause.</dd>
<dt>A polished chart means the analysis is careful.</dt><dd>AI makes polish free. Check axes, baselines and what's being compared.</dd>
<dt>If the assistant ran the code, the analysis is reproducible.</dt><dd>Only if you keep the code, the data version and the steps. Save them with the result.</dd>
<dt>Overall trends hold within every group.</dt><dd>Aggregates can reverse within subgroups, as the Berkeley admissions data famously showed.[1]</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Match the strength of the claim to the design of the analysis.</li>
<li>Report changes with the base and in points, not just percentages.</li>
<li>Look for other changes in the same period, and split by key segments.</li>
<li>Check charts: axes, baselines, and what's being compared.</li>
<li>Keep the code and data version so the analysis can be rerun.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="3"><p class="q">Activation went from 44% to 52%. Which statement is clearest?</p><ul>
<li data-fb="True as a relative change, but easy to misread.">“Activation increased by 18%.”</li>
<li data-fb="Vague, and suggests a statistical claim.">“Activation increased significantly.”</li>
<li data-fb="Inaccurate.">“Activation roughly doubled after launch.”</li>
<li data-fb="Right. The base and the change are both clear.">“Activation rose 8 points, from 44% to 52%.”</li>
</ul></div>
<div class="check" data-a="1"><p class="q">App users spend 40% more than non-app users. What can you conclude?</p><ul>
<li data-fb="That's a causal forecast the data can't support.">Getting more people to use the app will raise revenue by 40%.</li>
<li data-fb="Right. Engaged customers may simply choose the app.">App use and spending are associated; the cause is unclear.</li>
<li data-fb="Not shown by a comparison of self-selected groups.">The app causes customers to spend more.</li>
<li data-fb="It's a useful signal worth testing.">The difference is meaningless and should be ignored.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What does a p-value below 0.05 tell you on its own?</p><ul>
<li data-fb="Right. Nothing about size, importance or cause.">The data would be unusual if there were no effect, under assumptions.</li>
<li data-fb="A common misreading.">There's a 95% chance the change worked.</li>
<li data-fb="Size and importance aren't measured by p.">The effect is large enough to matter to the business and its customers.</li>
<li data-fb="A weak design can still produce small p-values.">The analysis design was sound.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Which design best supports “the change caused the increase”?</p><ul>
<li data-fb="Other changes in the period can't be ruled out.">Comparing the month before and the month after.</li>
<li data-fb="Self-selection confounds this.">Comparing users who chose the new flow with those who didn't.</li>
<li data-fb="Right. Randomisation separates the change from other causes.">A randomised test with a metric chosen in advance.</li>
<li data-fb="Perceptions aren't measured outcomes.">A survey asking users whether onboarding helped.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">A chart's y-axis starts at 40% for a rise from 44% to 52%. Why does it matter?</p><ul>
<li data-fb="No such rule.">Percentage charts must always start their axis at exactly 50%.</li>
<li data-fb="It exaggerates the change, rather than hiding it.">It hides the change entirely.</li>
<li data-fb="They can.">Percentages can't be shown on a y-axis.</li>
<li data-fb="Right. Truncated axes exaggerate differences.">It makes an 8-point change look several times bigger.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Bickel, Hammel and O'Connell (1975), <a href="https://doi.org/10.1126/science.187.4175.398" target="_blank" rel="noopener">Sex Bias in Graduate Admissions: Data from Berkeley</a>. <i>Science</i> 187(4175).</li>
<li>Wasserstein and Lazar (2016), <a href="https://doi.org/10.1080/00031305.2016.1154108" target="_blank" rel="noopener">The ASA Statement on p-Values: Context, Process, and Purpose</a>. <i>The American Statistician</i>.</li>
<li>Anscombe (1973), <a href="https://doi.org/10.1080/00031305.1973.10478966" target="_blank" rel="noopener">Graphs in Statistical Analysis</a>. <i>The American Statistician</i>.</li>
</ol></section>
`
});
