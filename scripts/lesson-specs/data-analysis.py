SPEC = dict(
file="11c-2-data-analysis.js",
reviewed="2026-11",
outcomes=["Rewrite an AI analysis conclusion so its strength matches the evidence."],
situation="""<p>An assistant analyses last month's onboarding change and writes: “The new onboarding increased activation by 18%, a statistically significant improvement (p &lt; 0.05). We recommend rolling it out to all regions.” It comes with a polished chart and a confident summary.</p>
<p>The change launched the same week as a marketing campaign that brought in a different kind of user, and the chart's y-axis starts at 40%. The analysis isn't fake; it's an answer to a weaker question than the one it claims to answer. This lesson is about matching conclusions to evidence.</p>""",
warmup=dict(q="Activation rose after a new onboarding launched, in the same week as a big campaign. What can you conclude?", a=0, opts=[
  ("Activation rose; the cause isn't clear yet.", "Right. Two changes at once make cause hard to separate."),
  ("The onboarding caused the increase in activation.", "The campaign could explain some or all of it."),
  ("The campaign caused the increase in activation.", "Equally unproven."),
  ("Nothing, since the data is unusable.", "The data is useful; the causal claim isn't supported."),
 ]),
sections="""<h2>Strength of evidence, in plain words</h2>
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
</div></div></div>""",
myths=[
 ("A significant p-value proves the change worked.", "It says the data would be unusual if there were no effect, given assumptions. It doesn't measure size, importance or cause."),
 ("A polished chart means the analysis is careful.", "AI makes polish free. Check axes, baselines and what's being compared."),
 ("If the assistant ran the code, the analysis is reproducible.", "Only if you keep the code, the data version and the steps. Save them with the result."),
 ("Overall trends hold within every group.", "Aggregates can reverse within subgroups, as the Berkeley admissions data famously showed.[1]"),
],
recap=[
 "Match the strength of the claim to the design of the analysis.",
 "Report changes with the base and in points, not just percentages.",
 "Look for other changes in the same period, and split by key segments.",
 "Check charts: axes, baselines, and what's being compared.",
 "Keep the code and data version so the analysis can be rerun.",
],
checks=[
 dict(q="Activation went from 44% to 52%. Which statement is clearest?", a=3, opts=[
  ("“Activation increased by 18%.”", "True as a relative change, but easy to misread."),
  ("“Activation increased significantly.”", "Vague, and suggests a statistical claim."),
  ("“Activation roughly doubled after launch.”", "Inaccurate."),
  ("“Activation rose 8 points, from 44% to 52%.”", "Right. The base and the change are both clear."),
 ]),
 dict(q="App users spend 40% more than non-app users. What can you conclude?", a=1, opts=[
  ("Getting more people to use the app will raise revenue by 40%.", "That's a causal forecast the data can't support."),
  ("App use and spending are associated; the cause is unclear.", "Right. Engaged customers may simply choose the app."),
  ("The app causes customers to spend more.", "Not shown by a comparison of self-selected groups."),
  ("The difference is meaningless and should be ignored.", "It's a useful signal worth testing."),
 ]),
 dict(q="What does a p-value below 0.05 tell you on its own?", a=0, opts=[
  ("The data would be unusual if there were no effect, under assumptions.", "Right. Nothing about size, importance or cause."),
  ("There's a 95% chance the change worked.", "A common misreading."),
  ("The effect is large enough to matter to the business.", "Size and importance aren't measured by p."),
  ("The analysis design was sound.", "A weak design can still produce small p-values."),
 ]),
 dict(q="Which design best supports “the change caused the increase”?", a=2, opts=[
  ("Comparing the month before and the month after.", "Other changes in the period can't be ruled out."),
  ("Comparing users who chose the new flow with those who didn't.", "Self-selection confounds this."),
  ("A randomised test with a metric chosen in advance.", "Right. Randomisation separates the change from other causes."),
  ("A survey asking users whether onboarding helped.", "Perceptions aren't measured outcomes."),
 ]),
 dict(q="A chart's y-axis starts at 40% for a rise from 44% to 52%. Why does it matter?", a=3, opts=[
  ("Charts must always start at exactly 50%.", "No such rule."),
  ("It hides the change entirely.", "It exaggerates the change, rather than hiding it."),
  ("Percentages can't be shown on a y-axis.", "They can."),
  ("It makes an 8-point change look several times bigger.", "Right. Truncated axes exaggerate differences."),
 ]),
],
)
