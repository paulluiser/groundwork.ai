GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["usability-readout"] = {
  label: "readout from six usability sessions on a new checkout",
  source: '<b>What you gave the assistant</b> Transcripts and your notes from six moderated sessions (P1–P6) on the new checkout prototype.<br><b>Your notes, in short</b> P2, P4 and P5 missed the promo-code link. P3 abandoned at the address step on mobile. P1 and P6 finished without problems. P4 said “I\'d trust this more with a padlock icon.”',
  claims: [
    { t: "Three of six participants (P2, P4, P5) didn't find the promo-code link.", v: "ok", why: "Matches your notes. Worth fixing, and the IDs let anyone check." },
    { t: "Most users abandon checkout at the address step.", v: "bad", why: "One participant of six did, on mobile. “Most users” turns one observation into a pattern, and six sessions can't tell you about all users." },
    { t: "Participants found the checkout fast and intuitive overall.", v: "partial", why: "Two finished without problems. Three missed a link and one abandoned. A smoothed-over summary like this is what models tend to write." },
    { t: "P4: “I'd trust this more with a padlock icon.”", v: "ok", why: "A direct quote from the transcript. It's one person's suggestion, not a finding about trust." },
    { t: "Adding trust badges will increase conversion by around 10%.", v: "none", why: "Nothing in the sessions measures conversion. A plausible-sounding figure from general web lore. If it matters, test it." },
    { t: "P3 said “this is way too long” before leaving the address form.", v: "bad", why: "The transcript doesn't contain these words. The readout put an invented line in quotation marks. Invented quotes are a known failure in AI synthesis." }
  ],
  after: "Keep counts with participant IDs, quote only what's in the transcript, and don't let six sessions speak for all users."
};
GW.lesson({
  id: "design-research",
  reviewed: "2026-11",
  lede: "Research and prototyping are where designers spend hours reading transcripts, sorting sticky notes and building screens that will be thrown away. AI can do much of the sorting and building faster. The risk is that it smooths over what people actually did and said, which is the whole point of research.",
  outcomes: [
    "Use AI to organise research notes and draft a synthesis, with every theme traced to participants.",
    "Catch invented quotes, inflated counts and conclusions the sessions can't support.",
    "Use generated prototypes to explore and test ideas quickly, and know what they can't tell you.",
    "Keep real users, consent and confidentiality at the centre of AI-assisted research.",
    "Write a research plan in which AI speeds up preparation and analysis but never replaces participants."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>You ran eight usability sessions on a new invoicing flow. The recordings are transcribed, and an assistant has produced a tidy readout: five findings, each with a severity and a recommendation. Your stakeholders want it by tomorrow.</p>
<p>It looks finished. But two of the quotes are slightly reworded, one “critical” finding came from a single participant who misunderstood the task, and the recommendation for the biggest issue is a pattern from a different product. This lesson is about getting the speed without inheriting those errors.</p></div>
<div class="check warmup" data-a="0"><p class="q">A readout says “most participants struggled to find the export button”. What makes this claim checkable?</p><ul>
<li data-fb="Right. Then anyone can watch the moments behind the claim.">The participant IDs and the timestamps where they struggled.</li>
<li data-fb="Severity is a judgement; it doesn't show the evidence.">A severity rating from one to four placed next to each finding.</li>
<li data-fb="Shows the button, not the struggle.">A screenshot of the export button in the interface.</li>
<li data-fb="Precision helps, but without IDs it still can't be checked.">The word “most” replaced with a more precise word.</li>
</ul></div>
<h2>Where AI fits in research</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Tidying notes and tagging transcripts</td><td><span class="fit good">Good fit</span></td><td>Saves hours. Spot-check tags against the passages they cover.</td></tr>
<tr><td>Drafting themes from transcripts</td><td><span class="fit care">Use with care</span></td><td>A useful first pass. Ask for counts and participant IDs, and read the passages behind each theme.</td></tr>
<tr><td>Generating prototype screens and flows</td><td><span class="fit good">Good fit</span></td><td>Cheap options to test. Check against your design system and accessibility basics (lesson 12).</td></tr>
<tr><td>Writing a test plan and tasks</td><td><span class="fit good">Good fit</span></td><td>Check tasks don't give away the answer, such as naming the button people should find.</td></tr>
<tr><td>Simulated participants</td><td><span class="fit care">Use with care</span></td><td>Good for rehearsing a session, not a source of findings.<sup>[1]</sup></td></tr>
<tr><td>Deciding what the research means</td><td><span class="fit human">Keep human</span></td><td>You were in the room, you know the context, and you answer for the conclusions.</td></tr>
</tbody></table></div>

<h2>Synthesis you can defend</h2>
<p>Good qualitative synthesis is a disciplined process: code the data, group codes into themes, then check the themes against the data again.<sup>[2]</sup> AI can speed up the first two steps. The third, going back to what people actually said, is where its errors get caught.</p>
<p>Ask for synthesis in a shape you can check: each theme with the number of participants, their IDs and one direct quote. Then search the transcript for each quote. Models sometimes produce quotations that sound exactly like a participant and appear nowhere in the transcript.</p>

<h2>Worked example: a usability readout</h2>
<p>You ran six sessions on a new checkout and asked an assistant to turn transcripts and notes into a readout for the team.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Check the readout against the sessions</span></div><div class="activity-b">
<p>Flag every sentence that misstates what happened in the sessions.</p>
<div data-w="claims" data-cfg="usability-readout"></div>
</div></div>

<ol class="steps">
<li><strong>One became “most”</strong>A single observation turned into a pattern about all users. Keep the count and the IDs.</li>
<li><strong>Mixed results were smoothed</strong>“Fast and intuitive overall” erases the problems you ran the study to find.</li>
<li><strong>A number came from nowhere</strong>Conversion uplift can't come from six moderated sessions.</li>
<li><strong>A quote was invented</strong>It sounded like P3. It wasn't in the transcript.</li>
</ol>
<div class="key"><p>Research is evidence about real people. Every theme needs a count, every quote needs a transcript, and the conclusions are yours.</p></div>

<h2>Prototyping with AI</h2>
<p>Generated prototypes make it cheap to explore: three layouts for the same task in an afternoon, or a clickable flow from a sketch. Use them to learn faster, and keep in mind what they are:</p>
<ul>
<li><strong>Test the idea, not the output.</strong> Generated screens often look finished, which makes participants comment on polish instead of the flow. Say it's a draft.</li>
<li><strong>Check them against your system.</strong> Generated UI tends to drift from your components, spacing and copy rules. Rebuild the winner properly.</li>
<li><strong>Check accessibility yourself.</strong> Contrast, focus order and labels are often wrong in generated code, even when the tool says otherwise (lesson 12).</li>
</ul>

<h2>Where AI fits in a research plan</h2>
<div class="tbl"><table><thead><tr><th>Stage</th><th>AI can help</th><th>Stays with you</th></tr></thead><tbody>
<tr><td>Plan</td><td>Draft the discussion guide and tasks; flag leading questions</td><td>The research question and who to recruit</td></tr>
<tr><td>Recruit</td><td>Draft screener questions</td><td>Choosing real participants who match</td></tr>
<tr><td>Run</td><td>Rehearse the guide with a simulated participant</td><td>The sessions themselves</td></tr>
<tr><td>Analyse</td><td>Transcribe, tag, cluster and find quotes</td><td>Checking quotes and counts; judging severity</td></tr>
<tr><td>Report</td><td>Draft the readout structure and wording</td><td>Findings, severity and recommendations</td></tr>
</tbody></table></div>
<p>Thematic analysis, the standard method for qualitative data, depends on the researcher's judgement at every phase, from coding to naming themes.[2] AI can speed up the mechanical parts. It can't decide what a pattern means for your product.</p>
<h2>Worked example: severity you can defend</h2>
<p>Severity ratings feel objective and rarely are. A simple, explicit rule makes them comparable. Here's one rule and how it changes an AI-rated finding.</p>
<div class="worked">
<div class="wx"><b>AI readout</b><div><p><strong>Critical:</strong> Users can't understand the VAT toggle. Recommendation: replace it with a tax wizard.</p></div></div>
<div class="wx strong"><b>After applying the rule</b><div><p><strong>Minor (1 of 8, P6):</strong> P6 hesitated at the VAT toggle for 20 seconds, then set it correctly. Others used it without comment. Watch for this in the next round; no change yet.</p></div></div>
</div>
<ul class="wx-notes">
<li><strong>The rule:</strong> critical = stops task completion for 2 or more participants; serious = completes with significant difficulty for 2 or more; minor = hesitation or a single participant.</li>
<li><strong>The evidence changed the rating,</strong> not the wording. One participant's hesitation isn't critical.</li>
<li><strong>The recommendation disappeared.</strong> A wizard was a solution looking for a problem; the evidence didn't support redesign.</li>
</ul>
<h2>Your turn: plan a study with AI in the right places</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">A one-page research plan</span></div><div class="activity-b">
<p>Plan a small usability study of a flow you're working on. Write: the research question, who you'll recruit and how many, three tasks, where you'll use AI and how you'll check it, and your severity rule.</p>
<div data-w="task" data-key="design-research-plan">
<div class="task-model"><p><strong>Question:</strong> Can small-business owners send their first invoice without help?</p>
<p><strong>Participants:</strong> 6 owners who invoice monthly and haven't used our product, recruited from the waitlist.</p>
<p><strong>Tasks:</strong> create a client; send an invoice with VAT; find out whether it was paid.</p>
<p><strong>AI use:</strong> draft the guide and flag leading questions (I'll rewrite); transcribe and tag sessions (I'll check every quote against the recording and recount each theme); draft the readout structure.</p>
<p><strong>Severity rule:</strong> critical = 2+ can't complete; serious = 2+ complete with major difficulty; minor = hesitation or a single participant.</p></div>
<ul class="task-rubric">
<li>States a specific research question</li>
<li>Recruits real participants who match the users</li>
<li>Names where AI is used and how each use is checked</li>
<li>Keeps findings and severity with the researcher</li>
<li>Defines an explicit severity rule</li>
</ul>
</div></div></div>
<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Consent and confidentiality.</strong> Participants agreed to how their recordings would be used. Uploading them to an unapproved AI tool may break that agreement (lesson 8).</li>
<li><strong>Analysis without the room.</strong> A transcript loses hesitation, confusion and what people did on screen. Keep your own notes alongside.</li>
<li><strong>Prompting your conclusion.</strong> Ask “what themes appear?”, not “show me evidence that users find onboarding confusing”.</li>
<li><strong>Too few sessions for the claim.</strong> Usability tests find problems; they don't measure how common they are.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take a research readout you've already written by hand. Give an assistant the same transcripts and ask for themes with counts, IDs and quotes. Compare: which themes did it miss or inflate, and does every quote exist?</div>

<h2>Common misconceptions</h2>
<dl class="myths">
<dt>AI transcription is accurate enough to quote directly.</dt><dd>It mishears names, numbers and jargon. Check quotes against the recording before they go in a readout.</dd>
<dt>Simulated participants can replace a pilot session.</dt><dd>They're useful for rehearsing timing and wording, not for finding real problems.</dd>
<dt>A clustered theme with many sticky notes is a strong finding.</dt><dd>Count participants, not notes. One talkative person can fill a cluster.</dd>
<dt>AI-generated prototypes are just faster versions of designer prototypes.</dt><dd>They're fast and generic. Use them to test an idea early; design the real thing deliberately.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>AI speeds up preparation and analysis; participants and judgement stay human.</li>
<li>Every finding needs participant IDs and moments someone can check.</li>
<li>Use an explicit severity rule so ratings mean the same thing every time.</li>
<li>Check quotes against recordings, and count participants, not notes.</li>
<li>Recommendations follow evidence; drop the ones that don't.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">An AI readout rates a finding “critical” based on one participant's 20-second hesitation. What's the right call?</p><ul>
<li data-fb="One hesitation isn't evidence of a critical problem.">Keep it critical, because any hesitation hurts conversion.</li>
<li data-fb="It's still worth noting and watching.">Delete the finding, since one participant doesn't count.</li>
<li data-fb="Right. Apply the rule to the evidence.">Downgrade it to minor and watch for it in the next round.</li>
<li data-fb="The rule, not another opinion, should decide.">Ask the assistant to re-rate it with more context.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">Where in a research plan is AI most useful?</p><ul>
<li data-fb="Right. Mechanical work, checked by you.">Drafting guides and tagging transcripts, with checks.</li>
<li data-fb="Simulations aren't evidence about your users.">Replacing the live sessions with a set of simulated participants.</li>
<li data-fb="That judgement stays with the researcher and team.">Deciding which findings are most important to fix.</li>
<li data-fb="Recruiting real people is your job.">Recruiting participants who match your target users.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why count participants rather than notes when clustering?</p><ul>
<li data-fb="Speed isn't the reason.">Notes take too long to count by hand.</li>
<li data-fb="True, but not the main reason.">Participants are easier for stakeholders to understand than notes are.</li>
<li data-fb="Not the main issue.">AI tools can't count notes accurately.</li>
<li data-fb="Right. Notes overstate how widespread an issue is.">One talkative person can create a large cluster of notes.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What should you check before quoting an AI transcript in a readout?</p><ul>
<li data-fb="Smoothed quotes are exactly the risk.">That the quote sounds natural and reads well on a slide.</li>
<li data-fb="Right. Transcripts mishear and models reword.">That the words match what the participant said in the recording.</li>
<li data-fb="That's selecting evidence to fit a conclusion.">That the quote clearly supports the recommendation you want to make.</li>
<li data-fb="Length matters less than accuracy.">That the quote is short enough to fit in the readout.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">What makes a severity rating defensible?</p><ul>
<li data-fb="Right. Anyone can apply it and get the same result.">An explicit rule applied to counted evidence.</li>
<li data-fb="A model's confidence isn't evidence.">The confidence score the AI tool attaches to it.</li>
<li data-fb="Emotion is useful context, not a severity rule.">How strongly participants expressed their frustration.</li>
<li data-fb="Seniority isn't a method.">Agreement from the most senior person in the room.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Nielsen Norman Group (2024), <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users: If, When, and How to Use AI-Generated “Research”</a>.</li>
<li>Braun and Clarke (2006), <a href="https://doi.org/10.1191/1478088706qp063oa" target="_blank" rel="noopener">Using thematic analysis in psychology</a>. Qualitative Research in Psychology 3(2). The widely used method for coding and theming qualitative data.</li>

<li>Nielsen Norman Group, <a href="https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/" target="_blank" rel="noopener">Rating the Severity of Usability Problems</a>. Frequency, impact and persistence as the basis for severity.</li>
</ol></section>
`
});
