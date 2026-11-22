SPEC = dict(
file="04-asking-well.js",
reviewed="2026-11",
outcomes=["Turn a request you make often into a reusable template your team can share."],
situation="""<p>Two people on the same team ask an assistant to “write release notes for this sprint”. One gets a bland list of ticket titles. The other gets notes customers can actually read, grouped by what changed for them, with the internal tickets left out. Same model, same sprint.</p>
<p>The difference is the request. The second person said who the notes were for, what to leave out, and showed one example of the style they wanted. This lesson is about writing that kind of request on purpose, and saving it so you don't have to write it again.</p>""",
warmup=dict(q="You want an assistant to write in your team's style. What usually works best?", a=2, opts=[
  ("Describe the style with adjectives like “clear, friendly and concise”.", "Adjectives mean different things to different readers, models included."),
  ("Ask it to match the style of a well-known company you admire.", "It will imitate a typical version of that company, not your team."),
  ("Paste one or two short examples of writing in that style.", "Right. Examples show what adjectives can only describe."),
  ("Tell it to write in whatever style it thinks is most suitable.", "Then you get its default style, which is rarely yours."),
 ]),
sections="""<h2>Examples beat adjectives</h2>
<p>Showing a model one or two examples of the output you want is one of the most reliable ways to steer it.[2] “Friendly but professional” means different things to different people; a two-sentence example doesn't. Vendor guidance from several providers converges on the same handful of habits: be specific about the task and audience, give examples, separate instructions from material, and say what format you want back.[S1]</p>
<h2>Worked example: release notes with one example</h2>
<div class="worked">
<div class="wx"><b>Weak request</b><div><pre>Write release notes for this sprint.

[ 23 ticket titles ]</pre></div></div>
<div class="wx strong"><b>Strong request</b><div><pre>Write release notes for customers (finance
admins, not developers). Use only the
tickets below. Leave out tickets tagged
internal. Group by what changed for the
customer: New, Improved, Fixed. One
sentence each, starting with what they can
now do. If a ticket's effect on customers
is unclear, list it at the end under
"Check with team" instead of guessing.

Example of the style:
"Improved: You can now filter reports by
cost centre, so month-end checks take
fewer steps."

[ 23 ticket titles with tags ]</pre></div></div>
</div>
<ul class="wx-notes">
<li><strong>Audience</strong> changes the vocabulary: “finance admins” rules out “refactored the export service”.</li>
<li><strong>“Use only the tickets below”</strong> stops it adding plausible features that didn't ship.</li>
<li><strong>The example</strong> fixes length, tone and structure in one line.</li>
<li><strong>“Check with team” instead of guessing</strong> gives it a way to be honest about uncertainty.</li>
</ul>
<h2>Templates worth saving</h2>
<p>Most of the value comes from requests you make every week. Turn each into a template with blanks, keep it where the team can find it, and improve it when a result disappoints. A good template has fixed parts (audience, rules, format, the example) and clearly marked slots for what changes each time. Over a few months, a team's template library becomes a record of what it has learned about getting good results.</p>
<h2>Your turn: fix a weak prompt</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Rewrite a request a colleague keeps making</span></div><div class="activity-b">
<p>A colleague asks this every Monday and is never happy with the result: <em>“Summarise these meeting notes.”</em> Rewrite it as a reusable template, with slots marked in square brackets.</p>
<div data-w="task" data-key="asking-template">
<div class="task-model"><pre>Summarise the notes below for [people who
missed the meeting / leadership].

Give, in this order:
1. Decisions made (one line each, with who
   made them).
2. Actions: owner, task, due date. If no
   owner or date was agreed, write "not
   agreed" rather than guessing.
3. Open questions.

Use only what's in the notes. Keep it under
[200] words. Don't include discussion that
didn't lead to a decision or action.

Notes from [meeting name, date]:
[paste notes]</pre></div>
<ul class="task-rubric">
<li>Says who the summary is for</li>
<li>Specifies the structure of the output</li>
<li>Limits it to the material provided</li>
<li>Says what to do when information is missing, instead of guessing</li>
<li>Marks the parts that change each time as slots</li>
</ul>
</div></div></div>
<h2>Try it this week</h2>
<div class="aside"><strong>A 30-minute exercise.</strong> Pick the request you make most often. Turn it into a template using the five parts from this lesson, then run it on last week's material and this week's. Share it with one colleague and ask what they'd change.</div>""",
myths=[
 ("There's a magic phrase that makes models perform better.", "Tricks come and go between model versions. Clear tasks, context, examples and format work across all of them."),
 ("Longer prompts are always better.", "Specific beats long. Irrelevant detail can distract a model as much as it helps."),
 ("If the output is bad, the model isn't capable enough.", "Often the request left out the audience, the rules or an example. Fix the request before switching models."),
 ("Prompting is a one-off skill for each request.", "The biggest gains come from saving and improving templates for requests you repeat."),
],
recap=[
 "Treat a request as a brief: task, context, constraints, format and examples.",
 "One short example of the output beats a paragraph of adjectives.",
 "Say what to use, what to leave out, and what to do when it doesn't know.",
 "Ask for structured output when software will read the answer.",
 "Save the requests you repeat as templates and improve them over time.",
],
checks=[
 dict(q="What's the most effective way to get output in your team's house style?", a=1, opts=[
  ("Describe the style in detail with a list of adjectives.", "Adjectives are open to interpretation."),
  ("Include one or two short examples of that style.", "Right. Examples show tone, length and structure at once."),
  ("Ask the model to use a professional business tone.", "That gets a generic style, not yours."),
  ("Run the request several times and pick the best one.", "That relies on luck rather than steering."),
 ]),
 dict(q="Why add “use only the tickets below” to a release-notes request?", a=3, opts=[
  ("It makes the response faster to generate.", "Speed isn't the reason."),
  ("It stops the model asking follow-up questions.", "It doesn't affect follow-up questions."),
  ("It reduces the cost of the request by limiting tokens.", "The instruction itself doesn't reduce cost meaningfully."),
  ("It stops it adding plausible features that didn't ship.", "Right. Without it, typical-sounding features can slip in."),
 ]),
 dict(q="A summary keeps inventing owners and due dates for actions. What's the best fix?", a=0, opts=[
  ("Tell it to write “not agreed” when no owner or date was given.", "Right. Give it an honest alternative to guessing."),
  ("Ask it to try harder to be accurate this time.", "Exhortation doesn't give it a way to express uncertainty."),
  ("Remove actions from the summary entirely.", "That loses the most useful part."),
  ("Switch to a larger model and keep the same request.", "Larger models also fill gaps when the request invites it."),
 ]),
 dict(q="What makes a good reusable prompt template?", a=2, opts=[
  ("A long list of every rule anyone has ever suggested.", "Too long, and much of it won't apply."),
  ("A short, clever phrase that works for most requests.", "Clever phrases rarely transfer between tasks or models."),
  ("Fixed parts like audience, rules and format, with clear slots.", "Right. Fixed parts carry what you've learned; slots hold what changes."),
  ("A version written separately for each new model release.", "Good templates mostly work across models."),
 ]),
 dict(q="When should you ask for a fixed structure like JSON or a table?", a=1, opts=[
  ("Whenever the answer is longer than a paragraph.", "Length alone doesn't call for structure."),
  ("When software or a spreadsheet will read the answer.", "Right. Structure lets other tools use the output reliably."),
  ("Only when the model offers to provide one itself.", "You decide the format, not the model."),
  ("When you want the model to think more carefully.", "Format doesn't make the model more careful."),
 ]),
],
sources=[
 'OpenAI, <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener">Prompt engineering guide</a>. Another vendor\'s guidance, consistent with the habits in this lesson.',
],
)
