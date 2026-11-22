GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["ai-ux-review"] = {
  buckets: ["Keep", "Change"],
  items: [
    { t: "Before the first use, a line under the input says: “Drafts replies from your help centre. It can be wrong, so check before sending.”", a: 0, why: "Sets expectations about what it does and how well, at the moment it matters. One of Microsoft's guidelines for human-AI interaction." },
    { t: "Every answer ends with “I'm 100% confident this is correct.”", a: 1, why: "Models don't produce calibrated confidence like this (lesson 3). A fixed claim of certainty teaches people to stop checking." },
    { t: "Each sentence in a generated answer links to the help-centre passage it came from.", a: 0, why: "Sources let people verify quickly, and make unsupported sentences stand out." },
    { t: "The generated text replaces what the user typed, with no undo.", a: 1, why: "People need to be able to recover. Keep their input and let them revert or compare." },
    { t: "A thumbs-down opens two optional choices, “Wrong” and “Not useful”, plus a free-text box.", a: 0, why: "Light, optional feedback that the team can act on. Make sure someone actually reads it." },
    { t: "When the assistant can't answer from the help centre, it gives a general answer from its training without saying so.", a: 1, why: "Silent fallbacks hide where answers came from. Say it doesn't know, or label general answers clearly." },
    { t: "A sparkle icon is the only sign that the content was AI-generated.", a: 1, why: "Icons alone are easy to miss and mean different things to different people. Use a clear text label." },
    { t: "Long-running AI actions show their progress, and the user can stop them.", a: 0, why: "Control over what the system is doing, especially for agents that take steps on the user's behalf (lesson 7)." }
  ],
  after: "The best AI interfaces are honest about what the system can do, show where answers come from, and make it easy to check, correct and undo."
};
GW.lesson({
  id: "design-ai-ux",
  reviewed: "2026-11",
  lede: "AI features break some of the assumptions behind interface design: the same input can give different outputs, outputs are sometimes wrong, and the system can act on its own. Designing them well means helping people trust the feature exactly as much as it deserves, no more and no less.",
  outcomes: [
    "Set accurate expectations about what an AI feature does and how well.",
    "Design ways for people to check output, through sources, previews and clear labels.",
    "Make correction, undo and feedback easy, and keep people in control of actions.",
    "Recognise design choices that create over-trust or hide failure.",
    "Design the error, uncertainty and correction states of an AI feature, not only its happy path."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Your team is adding “Draft reply with AI” to a support inbox. The Figma file has one beautiful screen: a perfect draft appears, the agent clicks Send. Engineering asks what happens when the draft is wrong, when it takes eight seconds, when the model is down, and when the agent edits half of it. There are no screens for any of that.</p>
<p>For AI features, those states aren't edge cases. They're a normal part of daily use. This lesson is about designing them first.</p></div>
<div class="check warmup" data-a="3"><p class="q">Which design choice best helps people trust an AI suggestion the right amount?</p><ul>
<li data-fb="Confidence without basis encourages over-trust.">A confident tone in the suggestion, so users feel reassured.</li>
<li data-fb="Users can't calibrate trust in what they don't know is AI.">Hiding that the suggestion came from AI, so it feels seamless.</li>
<li data-fb="Labelling helps, but a badge alone doesn't support checking.">A large “AI-powered” badge next to every suggestion.</li>
<li data-fb="Right. People can check it and correct it quickly.">Showing the sources behind it and making it easy to edit.</li>
</ul></div>
<h2>Why AI features need different patterns</h2>
<p>A normal button does the same thing every time. An AI feature gives a different result each time, is sometimes wrong, and may take actions on its own. People then make one of two mistakes: they trust it too much and stop checking, or they get burned once and stop using it. Researchers at Microsoft distilled guidelines for this from decades of work: make clear what the system can do and how well, support efficient correction, and explain why it did what it did.<sup>[1]</sup> Google's PAIR guidebook covers the same ground with patterns for each stage.<sup>[2]</sup></p>

<h2>Patterns that help people trust it right</h2>
<div class="tbl"><table>
<thead><tr><th>Moment</th><th>Pattern</th><th>Avoid</th></tr></thead>
<tbody>
<tr><td>Before use</td><td>Say what it does, what it draws on and that it can be wrong, in one plain line.</td><td>Marketing claims (“always accurate”), or nothing at all.</td></tr>
<tr><td>While it works</td><td>Show progress for slow tasks and steps for agents, with a way to stop.</td><td>A spinner with no end, or actions happening out of view.</td></tr>
<tr><td>The result</td><td>Label it as generated, show sources, highlight what needs checking.</td><td>Presenting output as final, or burying the label in an icon.</td></tr>
<tr><td>When it's wrong</td><td>Easy edit, undo and regenerate; keep the user's own input.</td><td>Overwriting what people typed.</td></tr>
<tr><td>When it can't help</td><td>Say so, and offer the next step (search, a person, the manual way).</td><td>Silently guessing.</td></tr>
<tr><td>Afterwards</td><td>Light, optional feedback that someone actually reviews.</td><td>Mandatory ratings, or feedback nobody reads.</td></tr>
</tbody></table></div>

<h2>Practice: review a design</h2>
<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Keep it or change it</span></div><div class="activity-b">
<p>A team designed an AI assistant for a help desk. Decide whether each design choice should stay or change.</p>
<div data-w="sort" data-cfg="ai-ux-review"></div>
</div></div>

<div class="key"><p>Design AI features so people can see where an answer came from, tell when it might be wrong, and fix it in one step.</p></div>

<h2>Confidence and uncertainty</h2>
<p>It's tempting to show a confidence score. Be careful: a language model's own statement of certainty isn't a measurement (lesson 3). Show uncertainty from things that are real instead. Is there a source? Did retrieval find a close match? Does the answer depend on data that might be out of date? “No help-centre article covers this; here's a general answer” is honest. “87% confident” usually isn't.</p>

<h2>Actions and agents</h2>
<p>When the AI does things rather than suggesting them, the design has to keep the person in charge (lesson 7):</p>
<ul>
<li><strong>Preview before acting.</strong> Show the email, the change or the booking before it happens, especially when it can't be undone.</li>
<li><strong>Match the confirmation to the risk.</strong> Confirming every small step trains people to click through. Save confirmations for actions that cost money, reach other people or can't be reversed.</li>
<li><strong>Show what happened.</strong> A clear record of what the assistant did, so mistakes can be found and undone.</li>
</ul>

<h2>Pattern libraries for AI interfaces</h2>
<p>Several pattern libraries now document interface patterns specific to AI: how to show that something is generated, how to let people steer, verify and undo it, and how to present uncertainty. Apple's guidelines for generative AI, for example, emphasise setting expectations, letting people refine results, and designing for mistakes.[3] The Shape of AI catalogues patterns such as inline suggestions, regenerate, citations and controls for tone and length, with real examples.[4] Use them as a checklist for states your design is missing.</p>
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
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Human-like personas.</strong> A name, a face and “I think” make people attribute understanding the system doesn't have. Keep the voice plain.</li>
<li><strong>Feature-wide labels.</strong> “AI-powered” on the whole page doesn't tell people which part to check. Label the generated content itself.</li>
<li><strong>Accessibility of new patterns.</strong> Streaming text, citations and inline suggestions must work with screen readers and keyboards. Test them.</li>
<li><strong>Designing only the happy path.</strong> Mock up the wrong answer, the refusal and the timeout too.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Open an AI feature in a product you use. Walk through the six moments in the table above. For each, note what the feature does well and what it hides. Then do the same for your own product's design.</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>A disclaimer like “AI can make mistakes” handles errors.</dt><dd>Generic disclaimers are ignored. Design specific checks and easy correction instead.</dd>
<dt>Showing confidence percentages helps users decide.</dt><dd>Numbers like “87% confident” are rarely calibrated and often misread. Show sources and specific risks instead.</dd>
<dt>AI features should feel magical and seamless.</dt><dd>Invisible AI prevents people from calibrating trust. Be clear about what's generated.</dd>
<dt>The happy path is the main design; errors are edge cases.</dt><dd>For AI features, wrong, slow and unavailable states are part of normal daily use.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>AI features need states that ordinary features don't: generating, uncertain, wrong, edited, unavailable.</li>
<li>Label generated content and make sources and correction easy.</li>
<li>Prefer specific, situational warnings to generic disclaimers.</li>
<li>Never overwrite people's edits; the core task must work without AI.</li>
<li>Use AI pattern libraries as a checklist for missing states.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">Which warning is most likely to change what an agent does?</p><ul>
<li data-fb="Generic, so it's quickly ignored.">“AI-generated content may contain errors or inaccuracies.”</li>
<li data-fb="Right. Specific to the situation and actionable.">“This thread mentions a refund. Check the amount before sending.”</li>
<li data-fb="Vague; it doesn't say what to review.">“Please review all AI-generated content carefully before you use it.”</li>
<li data-fb="Numbers like this are rarely calibrated or understood.">“Confidence: 87%. Proceed with appropriate caution.”</li>
</ul></div>
<div class="check" data-a="3"><p class="q">The AI model is down. What should the support inbox do?</p><ul>
<li data-fb="The core task must never depend on AI.">Block replies until the drafts are available again.</li>
<li data-fb="Too disruptive for an optional aid.">Show a full-screen error explaining the outage.</li>
<li data-fb="A draft for the wrong conversation is harmful.">Show the draft from the previous conversation instead, so agents have something.</li>
<li data-fb="Right. Fail quietly; the work continues.">Quietly say drafts are unavailable and let agents reply as usual.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An agent has edited half of a draft and clicks Regenerate. What should happen?</p><ul>
<li data-fb="Right. Human edits are valuable work.">Ask before discarding the agent's edits.</li>
<li data-fb="Silently losing edits destroys trust.">Replace the draft immediately with a new one.</li>
<li data-fb="Unpredictable merges confuse people.">Merge the new draft into the edited text automatically.</li>
<li data-fb="Too restrictive; ask instead.">Disable Regenerate once any edit has been made.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Your help centre's AI finds only weakly related articles. What should it show?</p><ul>
<li data-fb="A labelled guess is still a guess people will act on.">Its best guess at an answer, labelled as uncertain.</li>
<li data-fb="More text doesn't fix weak support.">A longer answer that covers several possibilities.</li>
<li data-fb="Right. No answer beats an unsupported one.">No generated answer, with the related articles listed.</li>
<li data-fb="Search results are still useful; show them.">An apology and a prompt asking the user to rephrase the question.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Why is showing sources better than showing a confidence percentage?</p><ul>
<li data-fb="Space isn't the main issue.">Percentages are harder to fit into small interface spaces.</li>
<li data-fb="Right. Sources support verification.">Users can check sources; percentages are rarely calibrated.</li>
<li data-fb="Looking thorough isn't the goal.">Sources make the answer look longer, more complete and more thorough.</li>
<li data-fb="No general ban exists.">Regulations ban displaying confidence percentages.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Amershi et al. (2019), <a href="https://dl.acm.org/doi/10.1145/3290605.3300233" target="_blank" rel="noopener">Guidelines for Human-AI Interaction</a>. CHI 2019. Eighteen guidelines tested with designers; also published as the <a href="https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/" target="_blank" rel="noopener">Microsoft HAX Toolkit</a>.</li>
<li>Google PAIR, <a href="https://pair.withgoogle.com/guidebook/" target="_blank" rel="noopener">People + AI Guidebook</a>. Patterns for expectations, explanations, feedback and errors.</li>

<li>Apple, <a href="https://developer.apple.com/design/human-interface-guidelines/generative-ai" target="_blank" rel="noopener">Human Interface Guidelines: Generative AI</a>. Setting expectations, refining results and designing for mistakes.</li>
<li>Emily Campbell, <a href="https://www.shapeof.ai/" target="_blank" rel="noopener">The Shape of AI</a>. A catalogue of interface patterns for AI features, with examples.</li>
</ol></section>
`
});
