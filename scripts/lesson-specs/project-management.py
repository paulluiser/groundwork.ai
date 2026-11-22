SPEC = dict(
file="12b-project-management.js",
reviewed="2026-11",
outcomes=["Prepare a change request with options and impacts, leaving the decision with the sponsor."],
situation="""<p>The client asks for single sign-on to be added before go-live, six weeks away. By lunchtime an assistant has drafted a change request: scope, a two-week estimate, a cost and a recommendation to accept. It's well written, and it would commit your team to a date and a price nobody on the team has looked at.</p>
<p>Project managers own commitments. AI can prepare everything around a commitment quickly. This lesson is about keeping the commitment itself in the hands of the people who'll have to keep it.</p>""",
warmup=dict(q="An assistant drafts a change request with an estimate and a recommendation. What should happen before it goes to the sponsor?", a=0, opts=[
  ("The team that will do the work reviews the estimate and impacts.", "Right. Estimates belong to the people doing the work."),
  ("Send it, since the sponsor will push back if it's wrong.", "Sponsors often accept confident numbers."),
  ("Add a contingency of 20% to the AI's estimate and send it.", "Padding a guess is still a guess."),
  ("Remove the recommendation and send the rest unchanged.", "The estimate still needs the team's input."),
 ]),
sections="""<h2>Change requests: options, impacts, decision</h2>
<p>A good change request makes the decision easy to take and hard to misunderstand. It sets out what's being asked, two or three options (including not doing it, or doing less), the impact of each on scope, schedule, cost and risk, and who decides by when. An assistant is excellent at drafting the structure and listing impacts you might miss. The numbers come from the team, and the decision comes from the sponsor.</p>
<h2>Worked example: the SSO request</h2>
<div class="tbl"><table><thead><tr><th>Option</th><th>Schedule</th><th>Cost</th><th>Risk</th></tr></thead><tbody>
<tr><td>A. Add SSO before go-live</td><td>Go-live moves 3 weeks (team estimate, including security review)</td><td>+€42k</td><td>Identity provider configuration depends on the client's IT team</td></tr>
<tr><td>B. Go live on time; add SSO in a release 6 weeks later</td><td>No change to go-live</td><td>+€38k</td><td>Users create passwords first, then migrate to SSO</td></tr>
<tr><td>C. Don't add SSO in this contract</td><td>No change</td><td>None</td><td>Client may not adopt widely without SSO</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>The AI draft had one option and a two-week estimate.</strong> The team's estimate, including the security review, was three.</li>
<li><strong>Option B is often the one sponsors choose</strong>, and it wasn't in the draft at all.</li>
<li><strong>Risks name dependencies outside the team</strong>, like the client's IT configuration, which an assistant couldn't know.</li>
</ul>
<h2>Your turn: write a change request</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Options for a late scope change</span></div><div class="activity-b">
<p>Two weeks before launch, a sponsor asks for the reporting dashboard to support exports to Excel. Write the change request: the request, at least three options with schedule, cost and risk impacts (invent reasonable numbers and say where they'd come from), and who decides by when.</p>
<div data-w="task" data-key="pm-change">
<div class="task-model"><p><strong>Request:</strong> Excel export from the reporting dashboard before launch on 30 May.</p>
<ul>
<li><strong>A. Full Excel export before launch:</strong> launch moves 1 week (dev estimate, to confirm with the team); +€9k; risk: untested formatting edge cases.</li>
<li><strong>B. CSV export before launch, Excel after:</strong> no launch change; +€3k now, +€7k later; risk: some users find CSV awkward.</li>
<li><strong>C. Launch as planned; add export in the next release:</strong> no change; +€8k later; risk: early users ask support for exports.</li>
</ul>
<p><strong>Decision:</strong> sponsor, by Friday, so the team can plan the final sprint. Estimates to be confirmed by the dev lead on Wednesday.</p></div>
<ul class="task-rubric">
<li>States the request and the deadline clearly</li>
<li>Offers at least three options, including a smaller or later version</li>
<li>Shows schedule, cost and risk for each option</li>
<li>Says where each estimate comes from and who confirms it</li>
<li>Names the decision-maker and a decision date</li>
</ul>
</div></div></div>""",
myths=[
 ("AI estimates are unbiased because they don't have stakes.", "They reflect typical projects in training data, not your team, and people plan optimistically anyway.[4]"),
 ("A recommendation helps the sponsor decide.", "It can anchor them. Present options and impacts; recommend only after the team agrees."),
 ("Contract summaries from AI are reliable.", "They miss obligations and invent clauses. Read the clauses that matter yourself, with legal for anything binding."),
 ("Schedules only need checking at the milestone level.", "Calendars, holidays and dependencies are where AI schedules go wrong.[1]"),
],
recap=[
 "AI drafts structure and lists impacts; the team owns estimates and the sponsor decides.",
 "Change requests set out options, including smaller and later ones.",
 "Show schedule, cost and risk for each option, with sources for the numbers.",
 "Read binding contract clauses yourself; don't rely on summaries.",
 "Check calendars, holidays and dependencies in any AI-built schedule.",
],
checks=[
 dict(q="Which change request is most useful to a sponsor?", a=2, opts=[
  ("One option with an AI estimate and a strong recommendation.", "No real choice, and an unchecked number."),
  ("A detailed explanation of why the change is difficult.", "Explains, but doesn't help decide."),
  ("Three options with team estimates for schedule, cost and risk.", "Right. A real choice with checked numbers."),
  ("A request for more budget without specific options.", "Gives the sponsor nothing to decide between."),
 ]),
 dict(q="Where should estimates in a change request come from?", a=1, opts=[
  ("The assistant, since it has seen many similar projects.", "Typical projects aren't your team."),
  ("The team who will do the work, with their assumptions stated.", "Right. They own the estimate."),
  ("The sponsor, since they know the budget.", "Budget isn't an estimate of effort."),
  ("The original project plan, unchanged.", "The plan didn't include this change."),
 ]),
 dict(q="An assistant summarises a 40-page contract. What should you do before relying on it?", a=3, opts=[
  ("Ask the assistant to confirm the summary is complete.", "It can't verify its own coverage."),
  ("Check the summary is well organised.", "Organisation doesn't mean accuracy."),
  ("Share it with the client for confirmation.", "Never outsource reading your own contract."),
  ("Read the clauses on scope, payment and liability yourself.", "Right. Binding terms need direct reading."),
 ]),
 dict(q="Why can a recommendation in a change request be a problem?", a=0, opts=[
  ("It can anchor the sponsor before they've weighed the options.", "Right. Present options first."),
  ("Sponsors aren't allowed to receive recommendations.", "They are; timing matters."),
  ("Recommendations make documents too long.", "Length isn't the issue."),
  ("AI tools can't write recommendations.", "They can, easily."),
 ]),
 dict(q="Which detail in an AI-generated schedule most often needs checking?", a=2, opts=[
  ("The colour coding of the task bars.", "Cosmetic."),
  ("The order of the column headings.", "Cosmetic."),
  ("Holidays, availability and dependencies between tasks.", "Right. These are where dates go wrong."),
  ("The font used for task names.", "Cosmetic."),
 ]),
],
)
