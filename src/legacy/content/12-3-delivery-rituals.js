GW.trackCfg = GW.trackCfg || {};
GW.trackCfg["ritual-calls"] = {
  steps: [
    { title: "Recording the retro", sit: "A team member suggests turning on the meeting tool's AI notetaker for the retrospective, so nobody has to take notes. Two people joined the team last week.", opts: [
      ["Turn it on; it's a team meeting and everyone uses the tool.", "Retros only work if people speak freely. A recording changes what people say, especially new joiners who won't feel able to object."],
      ["Ask the team before the meeting, privately as well as in the channel, and keep the retro unrecorded if anyone prefers it.", "Right. Consent for a recording has to be easy to refuse. For a retro, the default should be no recording."],
      ["Record it, but promise to delete the recording after the summary is made.", "Better than nothing, but people still speak knowing they're recorded, and deletion promises are hard to verify."]], a: 1 },
    { title: "Synthesising feedback", sit: "Thirty people across three teams sent anonymous retro feedback in a form. You want to group it into themes before the session.", opts: [
      ["Ask an assistant to group the comments into themes, with a count and the comments behind each theme, then read every comment yourself.", "Right. AI can do the first sort. Counts and quotes let you check it didn't merge or invent themes."],
      ["Ask the assistant for the top three themes and present those.", "You won't know what it dropped, merged or overstated. Quiet but important comments are the ones at risk."],
      ["Paste the comments into a public chatbot to save time.", "Feedback often names colleagues and internal problems. Use an approved tool (lesson 8)."]], a: 0 },
    { title: "Keeping it anonymous", sit: "The assistant's summary quotes a comment word for word: “Since the reorg, my manager hasn't had a single 1:1 with me.” Only one person on the team had a manager change.", opts: [
      ["Keep the quote; it's anonymous because there's no name on it.", "Anyone who knows who changed managers knows who wrote it. Anonymity depends on details, not names."],
      ["Paraphrase it into the theme, such as “some people aren't getting regular 1:1s”, and follow up privately through the right channel.", "Right. Protect the person, keep the issue, and act on it outside the meeting."],
      ["Remove it completely, because it's too sensitive.", "The issue is real and important. Losing it entirely fails the person who raised it."]], a: 1 },
    { title: "The meeting summary", sit: "After the planning meeting, the AI notetaker lists four action items. One says “Priya will finish the migration by Friday.” You don't remember Priya agreeing to Friday.", opts: [
      ["Send the summary as is; the tool heard the whole meeting.", "Notetakers sometimes turn a suggestion into a commitment. Sending it makes it look agreed."],
      ["Delete the action item.", "The work may still need an owner and a date. Find out first."],
      ["Check with Priya before sending, and mark summaries as drafts until owners confirm their actions.", "Right. Every action needs an owner who agreed to it. A summary is a draft until they do."]], a: 2 },
    { title: "Sharing the outcome", sit: "Your director asks for the AI-generated retro summary, “just to see how the team is doing”.", opts: [
      ["Share the team's agreed actions and the themes the team chose to share, and agree that in advance with the team.", "Right. What leaves the room is the team's choice. Sharing raw summaries without warning breaks the trust retros rely on."],
      ["Forward the full summary; it's anonymised.", "The team spoke expecting the conversation to stay with them. Small details can identify people."],
      ["Refuse to share anything.", "Leadership can help with what the team wants escalated. Agree with the team what goes up."]], a: 0 }
  ],
  after: "AI can take notes and sort feedback. What makes rituals work is unchanged: consent that's easy to refuse, anonymity that holds, actions owned by the people who agreed to them, and the team deciding what leaves the room."
};
GW.lesson({
  id: "delivery-rituals",
  lede: "Stand-ups, planning, reviews and retrospectives are where a team talks openly about how work is going. AI notetakers and summarisers can save real effort here. They also record, quote and summarise conversations that only work when people feel safe, so the questions are less about the tool and more about consent, accuracy and trust.",
  outcomes: [
    "Decide when meetings should and shouldn't be recorded, and how to ask for consent.",
    "Use AI to synthesise retro feedback while keeping counts, quotes and anonymity intact.",
    "Treat AI meeting summaries as drafts until owners confirm their actions.",
    "Agree with the team what leaves the room, and protect psychological safety."
  ],
  html: String.raw`
<h2>Where AI helps with team rituals</h2>
<div class="tbl"><table>
<thead><tr><th>Task</th><th>Fit</th><th>Why, and how to check</th></tr></thead>
<tbody>
<tr><td>Notes for planning and review meetings</td><td><span class="fit good">Good fit</span></td><td>Saves a note-taker. Confirm decisions and action owners before sending.</td></tr>
<tr><td>Grouping written retro feedback into themes</td><td><span class="fit good">Good fit</span></td><td>Fast first sort. Ask for counts and the comments behind each theme.</td></tr>
<tr><td>Suggesting retro formats and questions</td><td><span class="fit good">Good fit</span></td><td>Good at variety. Pick what suits the team's mood and the problem.</td></tr>
<tr><td>Recording retros or sensitive conversations</td><td><span class="fit care">Use with care</span></td><td>Changes what people say. Default to no recording; ask in a way that's easy to refuse.</td></tr>
<tr><td>Summarising sentiment for leadership</td><td><span class="fit care">Use with care</span></td><td>Can expose people and break trust. Share only what the team agrees to share.</td></tr>
<tr><td>Deciding what the team should change</td><td><span class="fit human">Keep human</span></td><td>The point of a retro is that the team decides together.</td></tr>
</tbody></table></div>

<h2>Why retros are different</h2>
<p>Norm Kerth's Retrospective Prime Directive asks a team to believe that everyone did the best job they could, given what they knew, their skills, the resources and the situation. Martin Fowler describes how reading it at the start of each retrospective helps set an open, understanding frame of mind.<sup>[1]</sup> Whatever opening you use, the idea underneath is that people will only raise real problems if they trust the room. Anything that changes who might hear or read their words, such as a recording or a summary sent upwards, changes what they'll say.</p>
<p>Atlassian's retrospective play follows a familiar arc: set the tone, gather feedback, turn it into insights, agree actions with owners and dates, and close.<sup>[2]</sup> AI fits best in the middle steps, sorting feedback and drafting actions. Setting the tone and agreeing actions belong to the people in the room.</p>

<h2>Practice: make the call</h2>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">AI in team rituals</span></div><div class="activity-b">
<p>Five situations from a delivery lead's week. Choose what you'd do.</p>
<div data-w="decide" data-cfg="ritual-calls"></div>
</div></div>

<ol class="steps">
<li><strong>Consent has to be easy to refuse</strong>Ask before the meeting, and in private as well as in public. New joiners and junior people rarely object out loud.</li>
<li><strong>Anonymity depends on details</strong>A quote with no name can still identify someone. Paraphrase into themes, and follow up on serious issues privately.</li>
<li><strong>Summaries are drafts</strong>Notetakers turn suggestions into commitments. Owners confirm their actions before the summary goes out.</li>
<li><strong>The team decides what leaves the room</strong>Agree in advance what gets shared upwards, and stick to it.</li>
</ol>
<div class="key"><p>AI can take the notes. Trust is still built by people: by asking first, protecting who said what, and letting the team own its conclusions.</p></div>

<h2>Practical rules for meeting tools</h2>
<ul>
<li><strong>Say when a notetaker is on,</strong> at the start, every time. Make it easy to switch off.</li>
<li><strong>Know where recordings and transcripts go,</strong> who can see them and how long they're kept. Check your company's policy.</li>
<li><strong>Don't record retros, 1:1s or difficult conversations</strong> by default.</li>
<li><strong>Check names and numbers</strong> in summaries; transcription errors land there most.</li>
<li><strong>Keep decisions separate from discussion</strong> in the summary, so suggestions aren't read as agreements.</li>
</ul>

<h2>Pitfalls to watch for</h2>
<ul>
<li><strong>Summaries as the record.</strong> If the summary is wrong and nobody checks, it becomes what was “agreed”.</li>
<li><strong>Sentiment scores.</strong> Tools that score a meeting's mood turn a conversation into a metric that can be used against people.</li>
<li><strong>The quiet majority disappears.</strong> AI themes follow the volume of comments. One careful comment can matter more than ten similar ones.</li>
<li><strong>External attendees.</strong> Customers and suppliers may not have agreed to recording, and their companies may forbid it.</li>
</ul>

<h2>Try it this week</h2>
<div class="aside"><strong>A 15-minute exercise.</strong> Write a short team agreement for meeting tools: which meetings may be recorded, how you ask, where summaries go, and who confirms actions. Bring it to your next retro and let the team change it.</div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="2"><p class="q">What's the best default for AI recording in retrospectives?</p><ul>
<li data-fb="Recording changes what people say, especially in retros.">Always record, so nothing is lost.</li>
<li data-fb="A public vote is hard to oppose, especially for new or junior people.">Record if most people vote for it in the meeting.</li>
<li data-fb="Right. Retros depend on people speaking freely.">Don't record, unless the whole team has agreed in a way that was easy to refuse.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">An AI notetaker assigns an action with a deadline nobody remembers agreeing. What should you do?</p><ul>
<li data-fb="Right. Actions need an owner who agreed to them.">Confirm with the named owner before sending the summary.</li>
<li data-fb="Sending it makes the deadline look agreed.">Send the summary; people can object if it's wrong.</li>
<li data-fb="The work may still need doing.">Delete the action and move on.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">An anonymous comment includes details only one person could know. How should it appear in the shared summary?</p><ul>
<li data-fb="The details identify the writer.">Word for word, because it has no name on it.</li>
<li data-fb="Right. Keep the issue, protect the person, and follow up privately if needed.">Paraphrased into a theme, without the identifying details.</li>
<li data-fb="The issue still matters to the team.">Removed completely.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Martin Fowler (2012), <a href="https://www.martinfowler.com/bliki/PrimingPrimeDirective.html" target="_blank" rel="noopener">Priming Prime Directive</a>. Norm Kerth's Retrospective Prime Directive and why teams read it aloud.</li>
<li>Atlassian Team Playbook, <a href="https://www.atlassian.com/team-playbook/plays/retrospective" target="_blank" rel="noopener">Retrospective</a>. A step-by-step play for running a retrospective.</li>
</ol></section>
`
});
