GW.lesson({
  id: "asking-well",
  reviewed: "2026-11",
  lede: "You already know how to write a good brief: a clear ticket, a useful handover, a design request a colleague can act on. Asking an AI well uses the same skill, with one difference: this colleague starts from zero every time.",
  outcomes: [
    "Structure a request around goal, context, constraints, output shape and examples.",
    "Explain why each part changes the result, using what you know about how models work.",
    "Iterate on a first draft with specific feedback instead of starting over.",
    "Ask for structured output when software will read the reply, and check it beyond its format.",
    "Recognise when no amount of rewording will help, because the information isn't there.",
    "Turn a request you make often into a reusable template your team can share."
  ],
  html: String.raw`
<!-- expanded -->
<div class="scenario"><p>Two people on the same team ask an assistant to “write release notes for this sprint”. One gets a bland list of ticket titles. The other gets notes customers can actually read, grouped by what changed for them, with the internal tickets left out. Same model, same sprint.</p>
<p>The difference is the request. The second person said who the notes were for, what to leave out, and showed one example of the style they wanted. This lesson is about writing that kind of request on purpose, and saving it so you don't have to write it again.</p></div>
<div class="check warmup" data-a="2"><p class="q">You want an assistant to write in your team's style. What usually works best?</p><ul>
<li data-fb="Adjectives mean different things to different readers, models included.">Describe the style with adjectives like “clear, friendly and concise”.</li>
<li data-fb="It will imitate a typical version of that company, not your team.">Ask it to match the style of a well-known company you admire.</li>
<li data-fb="Right. Examples show what adjectives can only describe.">Paste one or two short examples of writing in that style.</li>
<li data-fb="Then you get its default style, which is rarely yours.">Tell it to write in whatever style it thinks is most suitable.</li>
</ul></div>
<h2>A request is a brief</h2>
<p>Lesson 1 showed that a model produces the most plausible continuation of its input. Lesson 2 showed that it knows nothing about your situation beyond that input. Put together: a vague request gets the most typical answer, because typical is all the model has to go on.</p>
<p>So the craft of asking (often called prompting, from <a class="term" data-t="prompt">prompt</a>) is mostly the craft of briefing. Imagine handing the task to a capable contractor on their first morning: smart, quick, keen to help, and with no idea who your users are, what you have already tried or what “good” looks like here. What would they need to know?</p>
<div class="key"><p>If a new colleague would need to ask you three questions before starting, put the answers in the request.</p></div>

<h2>Five parts of a good request</h2>
<p>Not every request needs all five, but checking against them catches most weak prompts.</p>
<div class="tbl"><table>
<thead><tr><th>Part</th><th>What to say</th><th>Why it changes the output</th></tr></thead>
<tbody>
<tr><td><b>Goal</b></td><td>What you want and what it is for. “Draft release notes <em>so support can answer customer questions on launch day</em>.”</td><td>The purpose decides what to include. Notes for support emphasise behaviour changes; notes for developers emphasise APIs.</td></tr>
<tr><td><b>Context</b></td><td>The material and facts it needs: the changelog, the audience, what has already been decided.</td><td>Replaces typical guesses with your actual situation (lesson 2).</td></tr>
<tr><td><b>Constraints</b></td><td>Must and must-not: length, tone, terms to avoid, things not to promise, standards to follow.</td><td>Rules out plausible but unacceptable continuations, such as promising a date.</td></tr>
<tr><td><b>Output shape</b></td><td>Format and structure: a table, three options with trade-offs, a checklist, JSON with named fields.</td><td>A fixed shape is easier to check and reuse, and stops padding. See <a class="term" data-t="structured-output">structured output</a>.</td></tr>
<tr><td><b>Examples</b></td><td>One or two samples of what good looks like, ideally from your own work.</td><td>Models copy patterns very well. An example conveys tone and level of detail faster than a description.<sup>[2]</sup></td></tr>
</tbody></table></div>
<p>Two further moves help on almost any task:</p>
<ul>
<li><strong>Invite questions and flags.</strong> “If something important is missing, ask before writing.” or “Mark anything you're unsure of with [CHECK].” This gives the model a sanctioned way to admit gaps rather than paper over them.</li>
<li><strong>Ask for reasoning or options, not just a verdict.</strong> “Give three approaches with trade-offs” is easier to evaluate than “what's the best approach?”. Showing intermediate steps can also improve accuracy on multi-step problems.<sup>[3]</sup> <a class="term" data-t="reasoning-model">Reasoning models</a> (lesson 4) are trained to do this without being asked.</li>
</ul>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">Build up a request</span></div><div class="activity-b">
<p>Start from the bare request. Add each part, one at a time, and read how the draft changes. The drafts are examples written for this exercise, but each change is the kind you will see in practice.</p>
<div data-w="builder"></div>
</div></div>

<h2>Worked example: from vague to useful</h2>
<p>A QA lead wants help planning tests for a new feature. Here is the first attempt and the reasoning behind each improvement.</p>
<div class="draft prompt"><div class="draft-h"><span><b>First attempt</b></span></div><div class="draft-b">Write test cases for our new discount code feature.</div></div>
<p>The reply will be a generic list: valid code, invalid code, expired code, case sensitivity. Fine, but you could have written it in two minutes, and it misses everything specific to your rules. Now the briefed version:</p>
<div class="draft prompt"><div class="draft-h"><span><b>Briefed request</b></span></div><div class="draft-b">Goal: I need a test plan for a discount code feature, to review with the developer before sprint planning. I want to find gaps in the requirements, not just list happy paths.

Context – the rules as specified:
- One code per order. Codes are 6-12 characters, letters and digits.
- Percentage codes (5-50%) or fixed amount codes (£5-£100).
- Fixed amount can't reduce the order below £0.
- Codes can be limited to first-time customers.
- Codes expire at 23:59 UK time on their end date.

Constraints: Don't include performance or security testing; another team covers those. Use our test-case format below.

Output: A table with columns: ID, scenario, input, expected result, requirement it tests. After the table, list any questions where the rules above are ambiguous.

Example row:
DC-01 | Valid % code on eligible order | Order £80, code SAVE10 (10%) | Total £72 | Percentage codes</div></div>
<p>Why each part earns its place:</p>
<ol class="steps">
<li><strong>The goal says “find gaps”</strong>so the model looks for ambiguity rather than producing a reassuring list. The most valuable part of the reply will be the questions section.</li>
<li><strong>The rules are the context</strong>Now it can test the £0 floor, the 23:59 UK-time boundary and the first-time-customer restriction: things a generic list can't know about.</li>
<li><strong>Constraints remove noise</strong>No pages of security tests that another team already owns.</li>
<li><strong>The output shape makes review fast</strong>A table that maps each case to a requirement shows at a glance which rules have no tests.</li>
<li><strong>The example row sets the level of detail</strong>Concrete inputs and expected totals, not “verify discount applies correctly”.</li>
</ol>
<p>A good reply would likely raise questions like: <em>“Does the fixed-amount floor apply before or after delivery charges?”</em>, <em>“Is ‘first-time customer’ per account or per email address?”</em>, <em>“At 23:59 on the end date, is the code still valid at 23:59:30?”</em>. Those are the questions that prevent defects. The model could ask them only because you gave it the rules.</p>
<p>You still need to check the table. Recalculate a few expected totals, and look for rules with no test cases. Lesson 6 covers how.</p>

<h2>When software reads the answer: structured output</h2>
<p>Most of the time a person reads the reply. Sometimes a program does: a script that files tickets, a spreadsheet import, a feature that shows extracted fields on screen. Then the reply needs a fixed, machine-readable format, usually JSON. This is <a class="term" data-t="structured-output">structured output</a>.</p>
<p>There are two ways to get it, and they give different guarantees:</p>
<div class="tbl"><table>
<thead><tr><th>Approach</th><th>How</th><th>What it guarantees</th></tr></thead>
<tbody>
<tr><td><b>Ask in the prompt</b></td><td>Describe the fields and show one example of the exact format.</td><td>Nothing. Usually it complies; occasionally a field is missing, renamed, or wrapped in extra text, and the program breaks.</td></tr>
<tr><td><b>Enforce with a schema</b></td><td>Products built on vendor APIs can pass a <em>schema</em>, a formal description of the fields and allowed values, and the API constrains generation to match it.<sup>[4] [5]</sup></td><td>The output parses and has the right shape. It says nothing about whether the values are true.</td></tr>
</tbody></table></div>
<p>Here is a request a support-tools engineer wrote to pull fields out of incoming tickets:</p>
<div class="draft prompt"><div class="draft-h"><span><b>Request</b></span><span>extraction with a fixed format</span></div><div class="draft-b">Extract these fields from the support ticket below. Reply with JSON only, matching this format exactly:

{"order_id": string or null,
 "category": one of "billing", "delivery", "damaged", "other",
 "refund_requested": true or false}

If a field is not stated in the ticket, use null. Do not guess.

Ticket:
"Hi, my parcel came today but the mug inside was smashed. Can I get my money back? Thanks, Priya"</div></div>
<div class="draft"><div class="draft-h"><span><b>AI draft</b> · extracted fields</span></div><div class="draft-b" style="font-family:var(--font-mono);font-size:14px;white-space:pre-wrap">{"order_id": "A-10482", "category": "damaged", "refund_requested": true}</div>
<div class="review"><div class="r"><span class="stamp ok">Valid</span><span>Parses, and every field has an allowed value.</span></div><div class="r"><span class="stamp ok">Checked</span><span><code>category</code> and <code>refund_requested</code> match the ticket.</span></div><div class="r"><span class="stamp bad">Invented</span><span>The ticket has no order number. The model filled the field with a plausible one, despite the instruction. A program would now look up a stranger's order.</span></div></div></div>
<p>The format was perfect and one value was fabricated. That's the general lesson: <strong>a valid format is not a correct answer.</strong> Checking structured output takes four steps:</p>
<ol class="steps">
<li><strong>Validate the shape</strong>Parse it and check it against the schema in code. Reject or retry anything that fails, rather than patching it by hand.</li>
<li><strong>Check allowed values</strong>Categories from the list, dates that are real dates, amounts in range.</li>
<li><strong>Trace values to the input</strong>For a sample, confirm each value appears in the source. Identifiers, amounts and names are the ones that get invented.</li>
<li><strong>Make “not stated” easy to say</strong>Allow null for every field that might be missing, and treat a filled value that isn't in the source as a defect to measure (lesson 18).</li>
</ol>

<h2>Iterating on a draft</h2>
<p>Treat the first reply as a first draft from a colleague. Starting over with a slightly reworded request throws away what worked. Instead, give feedback the way you would to a person:</p>
<ul>
<li><strong>Be specific about what to change.</strong> “The tone is too formal for our users; write it the way the example is written.” beats “make it better”.</li>
<li><strong>Say what to keep.</strong> “Keep the structure and the first two sections; rewrite the summary.”</li>
<li><strong>Ask for variety when exploring.</strong> “Give me three versions that differ in approach, not just wording.”</li>
<li><strong>Ask what it assumed.</strong> “List the assumptions you made about our users.” Assumptions you didn't intend are where the draft went wrong.</li>
<li><strong>Restart when the conversation is muddled.</strong> If a long chat has accumulated wrong turns, start fresh with a clean brief that includes what you've learned (lesson 2).</li>
</ul>

<h2>When better wording won't help</h2>
<p>Prompting improves how a model uses what it has. It can't supply what it doesn't have.</p>
<ul>
<li><strong>Missing facts.</strong> No phrasing will make it know your Q3 numbers, your customer's contract terms or why the build broke this morning. Provide them or use a tool that can fetch them.</li>
<li><strong>Tasks that need checking against reality.</strong> “Make sure this is correct” in a prompt does not make it correct. Verification happens outside the model.</li>
<li><strong>Judgments that are yours to make.</strong> Which feature to cut, whether to promote someone, whether a design is on-brand. The model can lay out considerations. The decision stays with you.</li>
</ul>
<p>Techniques you may hear about (role prompts such as “You are an expert…”, special phrases, elaborate templates) have much smaller effects than clear goals and good context. Vendor guidance consistently puts clarity, context and examples first.<sup>[1]</sup></p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Improve a weak request</span></div><div class="activity-b">
<p>A designer writes: <em>“Write an error message for when payment fails.”</em> Rewrite it as a brief. Invent reasonable details about the product. When you're done, tick the parts you included, then compare with the example.</p>
<div class="w"><label for="brief-rewrite">Your request</label><textarea id="brief-rewrite" placeholder="Goal… Context… Constraints… Output… Example…"></textarea></div>
<div data-w="checklist" data-cfg="brief-parts"></div>
<details class="reveal"><summary>Compare with an example brief</summary><div>
<p style="font-family:var(--font-mono);font-size:13.5px;white-space:pre-wrap">Goal: Write the message shown when a card payment fails at checkout, so customers understand what happened and can fix it without contacting support.

Context: Mobile web checkout for a grocery delivery app. Common failures: card declined by bank, expired card, wrong security code. We can't tell which happened for "declined by bank". The order is kept for 30 minutes.

Constraints: Plain language, no blame ("you entered…"), no error codes, max 2 short sentences plus a button label. Don't say "try again later" without saying what to do.

Output: 3 variants, each with the message and a button label, plus one line on when you'd choose it.

Example of our tone: "We couldn't reach your bank just now. Your basket is saved for 30 minutes."</p>
</div></details>
</div></div>

<h2>Examples beat adjectives</h2>
<p>Showing a model one or two examples of the output you want is one of the most reliable ways to steer it.[2] “Friendly but professional” means different things to different people; a two-sentence example doesn't. Vendor guidance from several providers converges on the same handful of habits: be specific about the task and audience, give examples, separate instructions from material, and say what format you want back.[6]</p>
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
[200 words]. Don't include discussion that
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
<div class="aside"><strong>A 30-minute exercise.</strong> Pick the request you make most often. Turn it into a template using the five parts from this lesson, then run it on last week's material and this week's. Share it with one colleague and ask what they'd change.</div>
<h2>Common misconceptions</h2>
<dl class="myths">
<dt>There's a magic phrase that makes models perform better.</dt><dd>Tricks come and go between model versions. Clear tasks, context, examples and format work across all of them.</dd>
<dt>Longer prompts are always better.</dt><dd>Specific beats long. Irrelevant detail can distract a model as much as it helps.</dd>
<dt>If the output is bad, the model isn't capable enough.</dt><dd>Often the request left out the audience, the rules or an example. Fix the request before switching models.</dd>
<dt>Prompting is a one-off skill for each request.</dt><dd>The biggest gains come from saving and improving templates for requests you repeat.</dd>
</dl>
<h2>Recap</h2>
<div class="recap"><ul>
<li>Treat a request as a brief: task, context, constraints, format and examples.</li>
<li>One short example of the output beats a paragraph of adjectives.</li>
<li>Say what to use, what to leave out, and what to do when it doesn't know.</li>
<li>Ask for structured output when software will read the answer.</li>
<li>Save the requests you repeat as templates and improve them over time.</li>
</ul></div>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">What's the most effective way to get output in your team's house style?</p><ul>
<li data-fb="Adjectives are open to interpretation.">Describe the style in detail with a list of adjectives.</li>
<li data-fb="Right. Examples show tone, length and structure at once.">Include one or two short examples of that style.</li>
<li data-fb="That gets a generic style, not yours.">Ask the model to use a professional business tone.</li>
<li data-fb="That relies on luck rather than steering.">Run the request several times and pick the best one.</li>
</ul></div>
<div class="check" data-a="3"><p class="q">Why add “use only the tickets below” to a release-notes request?</p><ul>
<li data-fb="Speed isn't the reason.">It makes the response faster to generate.</li>
<li data-fb="It doesn't affect follow-up questions.">It stops the model asking follow-up questions.</li>
<li data-fb="The instruction itself doesn't reduce cost meaningfully.">It reduces the cost of the request by limiting tokens.</li>
<li data-fb="Right. Without it, typical-sounding features can slip in.">It stops it adding plausible features that didn't ship.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">A summary keeps inventing owners and due dates for actions. What's the best fix?</p><ul>
<li data-fb="Right. Give it an honest alternative to guessing.">Tell it to write “not agreed” when no owner or date was given.</li>
<li data-fb="Exhortation doesn't give it a way to express uncertainty.">Ask it to try harder to be accurate this time.</li>
<li data-fb="That loses the most useful part.">Remove actions from the summary entirely.</li>
<li data-fb="Larger models also fill gaps when the request invites it.">Switch to a larger model and keep the same request.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">What makes a good reusable prompt template?</p><ul>
<li data-fb="Too long, and much of it won't apply.">A long list of every rule anyone has ever suggested.</li>
<li data-fb="Clever phrases rarely transfer between tasks or models.">A short, clever phrase that works for most requests.</li>
<li data-fb="Right. Fixed parts carry what you've learned; slots hold what changes.">Fixed parts like audience, rules and format, with clear slots.</li>
<li data-fb="Good templates mostly work across models.">A version written separately for each new model release.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">When should you ask for a fixed structure like JSON or a table?</p><ul>
<li data-fb="Length alone doesn't call for structure.">Whenever the answer is longer than a paragraph.</li>
<li data-fb="Right. Structure lets other tools use the output reliably.">When software or a spreadsheet will read the answer.</li>
<li data-fb="You decide the format, not the model.">Only when the model offers to provide one itself.</li>
<li data-fb="Format doesn't make the model more careful.">When you want the model to think more carefully.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview" target="_blank" rel="noopener">Prompt engineering overview</a>. Vendor guidance on clarity, examples, structure and iteration.</li>
<li>Brown et al. (2020), <a href="https://arxiv.org/abs/2005.14165" target="_blank" rel="noopener">Language Models are Few-Shot Learners</a>. The evidence that examples in the prompt steer behaviour.</li>
<li>Wei et al. (2022), <a href="https://arxiv.org/abs/2201.11903" target="_blank" rel="noopener">Chain-of-Thought Prompting Elicits Reasoning in Large Language Models</a>. Showing intermediate steps improves multi-step reasoning.</li>
<li>OpenAI, <a href="https://platform.openai.com/docs/guides/structured-outputs" target="_blank" rel="noopener">Structured Outputs</a>. How an API constrains a model's reply to a supplied JSON Schema, and what that does and doesn't guarantee.</li>
<li><a href="https://json-schema.org/learn/getting-started-step-by-step" target="_blank" rel="noopener">JSON Schema: getting started</a>. The standard format for describing the fields and allowed values of JSON data.</li>

<li>OpenAI, <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener">Prompt engineering guide</a>. Another vendor's guidance, consistent with the habits in this lesson.</li>
</ol></section>
`
});
