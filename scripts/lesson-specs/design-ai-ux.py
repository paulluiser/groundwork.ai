SPEC = dict(
file="09-3-design-ai-ux.js",
reviewed="2026-11",
outcomes=["Design the error, uncertainty and correction states of an AI feature, not only its happy path."],
situation="""<p>Your team is adding “Draft reply with AI” to a support inbox. The Figma file has one beautiful screen: a perfect draft appears, the agent clicks Send. Engineering asks what happens when the draft is wrong, when it takes eight seconds, when the model is down, and when the agent edits half of it. There are no screens for any of that.</p>
<p>For AI features, those states aren't edge cases. They're a normal part of daily use. This lesson is about designing them first.</p>""",
warmup=dict(q="Which design choice best helps people trust an AI suggestion the right amount?", a=3, opts=[
  ("A confident tone in the suggestion, so users feel reassured.", "Confidence without basis encourages over-trust."),
  ("Hiding that the suggestion came from AI, so it feels seamless.", "Users can't calibrate trust in what they don't know is AI."),
  ("A large “AI-powered” badge next to every suggestion.", "Labelling helps, but a badge alone doesn't support checking."),
  ("Showing the sources behind it and making it easy to edit.", "Right. People can check it and correct it quickly."),
 ]),
sections="""<h2>Pattern libraries for AI interfaces</h2>
<p>Several pattern libraries now document interface patterns specific to AI: how to show that something is generated, how to let people steer, verify and undo it, and how to present uncertainty. Apple's guidelines for generative AI, for example, emphasise setting expectations, letting people refine results, and designing for mistakes.[S1] The Shape of AI catalogues patterns such as inline suggestions, regenerate, citations and controls for tone and length, with real examples.[S2] Use them as a checklist for states your design is missing.</p>
<h2>Worked example: one feature, five states</h2>
<div class="tbl"><table><thead><tr><th>State</th><th>What the agent sees</th><th>Design decision</th></tr></thead><tbody>
<tr><td>Generating</td><td>A skeleton where the draft will appear, with “Drafting from this thread”</td><td>Show progress within a second; never block the reply box</td></tr>
<tr><td>Draft ready</td><td>Draft labelled “AI draft”, each fact linked to the message it came from</td><td>Label as a draft; make sources one click away</td></tr>
<tr><td>Probably wrong</td><td>A note: “This thread mentions a refund. Check the amount before sending.”</td><td>Flag specific risks, not generic disclaimers</td></tr>
<tr><td>Edited</td><td>Agent's changes kept; “Regenerate” asks before discarding them</td><td>Never overwrite human edits silently</td></tr>
<tr><td>Unavailable</td><td>“Drafts are unavailable right now. Reply as usual.”</td><td>Fail quietly; the core task always works without AI</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Four of five states aren't the happy path.</strong> They're where trust is won or lost.</li>
<li><strong>Specific warnings beat generic ones.</strong> “Check the amount” gets read; “AI can make mistakes” gets ignored.</li>
<li><strong>Protecting edits</strong> respects the work people put into correcting the AI.</li>
</ul>
<h2>Your turn: design the states</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">The states an AI search answer needs</span></div><div class="activity-b">
<p>Your help centre will show an AI-written answer above search results. Describe, in words, what the user sees in these states: generating, a confident answer, an answer with weak support, no good answer, and the AI being unavailable.</p>
<div data-w="task" data-key="design-states">
<div class="task-model"><ul>
<li><strong>Generating:</strong> normal search results appear immediately; the answer area shows “Writing a summary from 3 articles” and fills in without moving the results.</li>
<li><strong>Confident:</strong> a short answer labelled “Summary from our help articles”, with numbered links to the articles it used, and “Was this helpful?”.</li>
<li><strong>Weak support:</strong> “We found related articles but no direct answer” with the top articles listed; no generated answer.</li>
<li><strong>No answer:</strong> no AI area at all, just search results and a link to contact support.</li>
<li><strong>Unavailable:</strong> search results only, no error message needed.</li>
</ul></div>
<ul class="task-rubric">
<li>Search still works immediately while the answer is generated</li>
<li>Answers are labelled and linked to their sources</li>
<li>Weak or missing support leads to no answer rather than a guess</li>
<li>Users have a way to give feedback or reach a person</li>
<li>The unavailable state doesn't block the core task</li>
</ul>
</div></div></div>""",
myths=[
 ("A disclaimer like “AI can make mistakes” handles errors.", "Generic disclaimers are ignored. Design specific checks and easy correction instead."),
 ("Showing confidence percentages helps users decide.", "Numbers like “87% confident” are rarely calibrated and often misread. Show sources and specific risks instead."),
 ("AI features should feel magical and seamless.", "Invisible AI prevents people from calibrating trust. Be clear about what's generated."),
 ("The happy path is the main design; errors are edge cases.", "For AI features, wrong, slow and unavailable states are part of normal daily use."),
],
recap=[
 "AI features need states that ordinary features don't: generating, uncertain, wrong, edited, unavailable.",
 "Label generated content and make sources and correction easy.",
 "Prefer specific, situational warnings to generic disclaimers.",
 "Never overwrite people's edits; the core task must work without AI.",
 "Use AI pattern libraries as a checklist for missing states.",
],
checks=[
 dict(q="Which warning is most likely to change what an agent does?", a=1, opts=[
  ("“AI-generated content may contain errors or inaccuracies.”", "Generic, so it's quickly ignored."),
  ("“This thread mentions a refund. Check the amount before sending.”", "Right. Specific to the situation and actionable."),
  ("“Please review all AI content carefully before using it.”", "Vague; it doesn't say what to review."),
  ("“Confidence: 87%. Proceed with appropriate caution.”", "Numbers like this are rarely calibrated or understood."),
 ]),
 dict(q="The AI model is down. What should the support inbox do?", a=3, opts=[
  ("Block replies until the drafts are available again.", "The core task must never depend on AI."),
  ("Show a full-screen error explaining the outage.", "Too disruptive for an optional aid."),
  ("Show the draft from the previous conversation instead.", "A draft for the wrong conversation is harmful."),
  ("Quietly say drafts are unavailable and let agents reply as usual.", "Right. Fail quietly; the work continues."),
 ]),
 dict(q="An agent has edited half of a draft and clicks Regenerate. What should happen?", a=0, opts=[
  ("Ask before discarding the agent's edits.", "Right. Human edits are valuable work."),
  ("Replace the draft immediately with a new one.", "Silently losing edits destroys trust."),
  ("Merge the new draft into the edited text automatically.", "Unpredictable merges confuse people."),
  ("Disable Regenerate once any edit has been made.", "Too restrictive; ask instead."),
 ]),
 dict(q="Your help centre's AI finds only weakly related articles. What should it show?", a=2, opts=[
  ("Its best guess at an answer, labelled as uncertain.", "A labelled guess is still a guess people will act on."),
  ("A longer answer that covers several possibilities.", "More text doesn't fix weak support."),
  ("No generated answer, with the related articles listed.", "Right. No answer beats an unsupported one."),
  ("An apology and a prompt to rephrase the question.", "Search results are still useful; show them."),
 ]),
 dict(q="Why is showing sources better than showing a confidence percentage?", a=1, opts=[
  ("Percentages are harder to fit into small interface spaces.", "Space isn't the main issue."),
  ("Users can check sources; percentages are rarely calibrated.", "Right. Sources support verification."),
  ("Sources make the answer look longer and more thorough.", "Looking thorough isn't the goal."),
  ("Regulations ban displaying confidence percentages.", "No general ban exists."),
 ]),
],
sources=[
 'Apple, <a href="https://developer.apple.com/design/human-interface-guidelines/generative-ai" target="_blank" rel="noopener">Human Interface Guidelines: Generative AI</a>. Setting expectations, refining results and designing for mistakes.',
 'Emily Campbell, <a href="https://www.shapeof.ai/" target="_blank" rel="noopener">The Shape of AI</a>. A catalogue of interface patterns for AI features, with examples.',
],
)
