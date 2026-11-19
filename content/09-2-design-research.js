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
  lede: "Research and prototyping are where designers spend hours reading transcripts, sorting sticky notes and building screens that will be thrown away. AI can do much of the sorting and building faster. The risk is that it smooths over what people actually did and said, which is the whole point of research.",
  outcomes: [
    "Use AI to organise research notes and draft a synthesis, with every theme traced to participants.",
    "Catch invented quotes, inflated counts and conclusions the sessions can't support.",
    "Use generated prototypes to explore and test ideas quickly, and know what they can't tell you.",
    "Keep real users, consent and confidentiality at the centre of AI-assisted research."
  ],
  html: String.raw`
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

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Consent and confidentiality.</strong> Participants agreed to how their recordings would be used. Uploading them to an unapproved AI tool may break that agreement (lesson 8).</li>
<li><strong>Analysis without the room.</strong> A transcript loses hesitation, confusion and what people did on screen. Keep your own notes alongside.</li>
<li><strong>Prompting your conclusion.</strong> Ask “what themes appear?”, not “show me evidence that users find onboarding confusing”.</li>
<li><strong>Too few sessions for the claim.</strong> Usability tests find problems; they don't measure how common they are.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Take a research readout you've already written by hand. Give an assistant the same transcripts and ask for themes with counts, IDs and quotes. Compare: which themes did it miss or inflate, and does every quote exist?</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="0"><p class="q">An AI synthesis includes a vivid quote from P5. What should you do before using it?</p><ul>
<li data-fb="Right. Models can produce plausible quotes that aren't in the data.">Find it in the transcript.</li>
<li data-fb="Wording polish doesn't help if the quote doesn't exist.">Shorten it so it fits on a slide.</li>
<li data-fb="Rephrasing hides the problem; check the source.">Rephrase it so it isn't a direct quote.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">Two of eight participants struggled with search. How should the readout say it?</p><ul>
<li data-fb="Overstates it: two isn't “users”.">Users struggle with search.</li>
<li data-fb="Understates a real problem you observed.">Search worked well for most participants.</li>
<li data-fb="Right. Count, IDs and what happened, with no claim about all users.">Two of eight participants (P3, P7) couldn't find results for X, because…</li>
</ul></div>
<div class="check" data-a="1"><p class="q">What's the main risk of testing a polished, AI-generated prototype?</p><ul>
<li data-fb="Cost isn't the issue; it was cheap to make.">It costs too much to change afterwards.</li>
<li data-fb="Right. Finished-looking screens draw comments on polish, not on the flow.">Participants react to the polish instead of the idea you're testing.</li>
<li data-fb="Participants rarely know or care how it was made.">Participants may refuse to test AI-made screens.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Nielsen Norman Group (2024), <a href="https://www.nngroup.com/articles/synthetic-users/" target="_blank" rel="noopener">Synthetic Users: If, When, and How to Use AI-Generated “Research”</a>.</li>
<li>Braun and Clarke (2006), <a href="https://doi.org/10.1191/1478088706qp063oa" target="_blank" rel="noopener">Using thematic analysis in psychology</a>. Qualitative Research in Psychology 3(2). The widely used method for coding and theming qualitative data.</li>
</ol></section>
`
});
