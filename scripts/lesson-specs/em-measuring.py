SPEC = dict(
file="12c-2-em-measuring.js",
reviewed="2026-11",
outcomes=["Design a small, honest trial of an AI tool with a baseline, a prediction and outcome measures."],
situation="""<p>Your director forwards a vendor report: teams using the vendor's coding assistant “ship 55% faster”. They'd like to know, by next month, whether your team should buy it. Your team has opinions in both directions and no data.</p>
<p>A month is enough for a useful answer if the trial is designed before it starts. This lesson walks through designing one, and through reading other people's productivity numbers with the right amount of scepticism.</p>""",
warmup=dict(q="A vendor says teams using its tool “ship 55% faster”. What's the first question to ask?", a=3, opts=[
  ("Whether the tool is also cheaper than its competitors on a per-seat basis.", "Price is a separate question."),
  ("Whether other companies in your industry have already bought the tool.", "Popularity isn't evidence of effect."),
  ("Whether the claim appears in a peer-reviewed publication of some kind.", "Useful, but first understand the measure."),
  ("What “faster” measured, on what tasks, compared with what.", "Right. The measure decides what the number means."),
 ]),
sections="""<h2>Worked example: a four-week trial</h2>
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
</div></div></div>""",
myths=[
 ("Developers know whether AI is making them faster.", "Perceived and measured speed can diverge sharply. Measure both."),
 ("Lines of code or percentage of AI-written code shows value.", "They measure activity and invite gaming. Measure outcomes like lead time and rework."),
 ("A positive vendor study means it will work for us.", "Effects depend on tasks, codebases and experience. Trial it in your context."),
 ("Trials need months and a data team.", "Four weeks, a baseline and a written prediction answer most team-level questions."),
],
recap=[
 "Ask what a productivity number measured, on what tasks, compared with what.",
 "Record a baseline and write a prediction before the trial.",
 "Measure outcomes, with quality as a guardrail, not activity.",
 "Collect perceived and measured speed; expect them to differ.",
 "Agree the decision rule before you see results.",
],
checks=[
 dict(q="Why write a prediction before a trial starts?", a=1, opts=[
  ("Vendors require a written prediction before they agree to a trial licence.", "Not a vendor requirement."),
  ("So the result can't be rationalised into whatever someone hoped for.", "Right. It anchors the honest comparison."),
  ("Because predictions make the trial run faster and need fewer participants.", "They don't affect speed."),
  ("So the team knows what result to aim for while using the tool.", "That would bias the trial."),
 ]),
 dict(q="Which measure is the best guardrail when trialling a coding assistant?", a=0, opts=[
  ("Rework: changes reopened or reverted soon after merging.", "Right. It catches faster-but-worse."),
  ("The number of suggestions accepted by developers each day.", "Activity, not quality."),
  ("Lines of code written per developer per week during the trial.", "Activity, and easy to inflate."),
  ("How many developers say they enjoy using the tool.", "Satisfaction matters, but isn't a quality guardrail."),
 ]),
 dict(q="What did the METR study find about perceived and measured speed?", a=3, opts=[
  ("Developers accurately estimated how much the AI tools had sped them up.", "The opposite."),
  ("Measured speed improved far more than developers expected it to.", "The opposite."),
  ("There was no measurable difference in speed in either direction.", "There was a slowdown."),
  ("Developers felt faster while being measured slower on average.", "Right. Perception and measurement diverged."),
 ]),
 dict(q="Why compare people in the same weeks rather than before and after?", a=2, opts=[
  ("Because before-and-after comparisons take twice as long to run properly.", "Time isn't the main reason."),
  ("Because people forget how long work took before the trial started.", "Memory isn't the issue; data is."),
  ("Because other changes over time can be mistaken for the tool's effect.", "Right. Same-period comparisons control for them."),
  ("Because vendors prefer comparisons within the same team at the same time.", "Not the reason."),
 ]),
 dict(q="What does the SPACE framework remind managers to do?", a=0, opts=[
  ("Measure productivity across several dimensions, not one.", "Right. Satisfaction, performance, activity, collaboration, efficiency."),
  ("Focus measurement on the speed of individual developers above everything.", "SPACE warns against single measures."),
  ("Replace surveys with automated metrics wherever possible.", "SPACE includes perceptual measures deliberately."),
  ("Track the percentage of code written by AI as a primary goal.", "An activity measure, not a goal."),
 ]),
],
)
