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
  lede: "AI features break some of the assumptions behind interface design: the same input can give different outputs, outputs are sometimes wrong, and the system can act on its own. Designing them well means helping people trust the feature exactly as much as it deserves, no more and no less.",
  outcomes: [
    "Set accurate expectations about what an AI feature does and how well.",
    "Design ways for people to check output, through sources, previews and clear labels.",
    "Make correction, undo and feedback easy, and keep people in control of actions.",
    "Recognise design choices that create over-trust or hide failure."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Human-like personas.</strong> A name, a face and “I think” make people attribute understanding the system doesn't have. Keep the voice plain.</li>
<li><strong>Feature-wide labels.</strong> “AI-powered” on the whole page doesn't tell people which part to check. Label the generated content itself.</li>
<li><strong>Accessibility of new patterns.</strong> Streaming text, citations and inline suggestions must work with screen readers and keyboards. Test them.</li>
<li><strong>Designing only the happy path.</strong> Mock up the wrong answer, the refusal and the timeout too.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Open an AI feature in a product you use. Walk through the six moments in the table above. For each, note what the feature does well and what it hides. Then do the same for your own product's design.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">How should an AI answer show that it might be wrong?</p><ul>
<li data-fb="A model's self-reported confidence isn't a reliable measurement.">Display the model's confidence percentage.</li>
<li data-fb="Right. Signals based on real sources tell people what to check.">Show sources, and say clearly when no source supports the answer.</li>
<li data-fb="A generic warning everywhere is quickly ignored.">Add a warning that AI can make mistakes to every screen.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An assistant can send emails on a user's behalf. Where does a confirmation step belong?</p><ul>
<li data-fb="Right. Confirm what's costly or irreversible, and keep it rare enough to be read.">Before sending, with a preview of the message and recipients.</li>
<li data-fb="Too many confirmations train people to click through without reading.">Before every step, including drafting.</li>
<li data-fb="Afterwards is too late for an email to the wrong person.">After sending, as a summary.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Why avoid giving an AI assistant a human name and personality?</p><ul>
<li data-fb="Branding isn't the main issue.">It makes the brand less consistent.</li>
<li data-fb="Not usually a legal requirement, though disclosure rules are growing.">It's always against the law.</li>
<li data-fb="Right. A persona invites people to trust it like a person who understands them.">It leads people to assume understanding and judgment it doesn't have.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Amershi et al. (2019), <a href="https://dl.acm.org/doi/10.1145/3290605.3300233" target="_blank" rel="noopener">Guidelines for Human-AI Interaction</a>. CHI 2019. Eighteen guidelines tested with designers; also published as the <a href="https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/" target="_blank" rel="noopener">Microsoft HAX Toolkit</a>.</li>
<li>Google PAIR, <a href="https://pair.withgoogle.com/guidebook/" target="_blank" rel="noopener">People + AI Guidebook</a>. Patterns for expectations, explanations, feedback and errors.</li>
</ol></section>
`
});
