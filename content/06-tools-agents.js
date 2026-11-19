GW.lesson({
  id: "tools-agents",
  lede: "So far the model has only produced text. Give it tools, and it can run tests, search documents, edit files and send messages. That makes it far more useful, and it changes what can go wrong.",
  outcomes: [
    "Explain how a model “uses a tool” and what actually performs the action.",
    "Describe the agent loop and why feedback from the environment makes agents work.",
    "Choose between a single request, a workflow and an agent for a task.",
    "Set permissions and checkpoints in proportion to what an agent can affect.",
    "Review an agent's work by its results, not by its own account of them."
  ],
  html: String.raw`
<h2>From answering to acting</h2>
<p>A model on its own can only produce text. <a class="term" data-t="tool-use">Tool use</a> (also called function calling) lets it ask the surrounding application to run a <a class="term" data-t="tool">tool</a>: a defined function such as a search, a database query or a test run. It works like this:</p>
<figure>
<svg class="fig" viewBox="0 0 640 300" role="img" aria-label="Sequence: the application tells the model which tools exist. The model replies with a structured tool request. The application runs the tool with its own permissions and adds the result to the context. The model continues with the result.">
  <defs><marker id="ah6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="ah"/></marker></defs>
  <g><rect class="box" x="20" y="14" width="150" height="44" rx="8"/><text class="ttl" x="95" y="41" text-anchor="middle">You</text></g>
  <g class="acc"><rect class="box" x="245" y="14" width="150" height="44" rx="8"/><text class="ttl" x="320" y="41" text-anchor="middle">Application</text></g>
  <g><rect class="box" x="470" y="14" width="150" height="44" rx="8"/><text class="ttl" x="545" y="41" text-anchor="middle">Model</text></g>
  <path class="e dash" d="M95 58 V290 M320 58 V290 M545 58 V290"/>
  <path class="e" d="M95 88 H316" marker-end="url(#ah6)"/><text class="sm" x="105" y="80">“Why is the build red?”</text>
  <path class="e" d="M320 122 H541" marker-end="url(#ah6)"/><text class="sm" x="330" y="114">question + list of tools</text>
  <path class="e" d="M545 158 H324" marker-end="url(#ah6)"/><text class="sm" x="352" y="150">request: run_tests(“api”)</text>
  <g class="warnb"><rect class="box" x="236" y="170" width="168" height="40" rx="8"/><text class="sm" x="320" y="195" text-anchor="middle">runs it, with its own access</text></g>
  <path class="e" d="M320 226 H541" marker-end="url(#ah6)"/><text class="sm" x="330" y="220">result: 2 tests failed…</text>
  <path class="e" d="M545 262 H99" marker-end="url(#ah6)"/><text class="sm" x="130" y="255">explanation based on the actual failures</text>
</svg>
<figcaption>The model never touches your systems. It writes a structured request; the application decides whether to run it and does so with whatever permissions the application has.</figcaption>
</figure>
<ol class="steps">
<li><strong>The application describes the tools</strong>Each tool has a name, a description and the inputs it takes, for example <code>run_tests(path)</code> or <code>search_tickets(query)</code>. These descriptions go into the context.<sup>[2]</sup></li>
<li><strong>The model asks for a tool</strong>Instead of a normal reply, it produces a structured request: which tool, with which inputs. This is still next-token prediction; the request is text in a fixed format.</li>
<li><strong>The application runs it</strong>Ordinary software executes the tool, using the application's credentials and access.</li>
<li><strong>The result goes back into the context</strong>and the model continues, now with real information: actual test output, the actual ticket.</li>
</ol>
<p>Two consequences follow. First, tools fix a core weakness from lessons 1 and 3: the model can work from real, current data instead of patterns. Second, <strong>what the tool can do is decided by its permissions, not by the model's intentions</strong>. If the application can delete files, a confused or manipulated model can ask it to.</p>

<h2>Agents: a model in a loop</h2>
<p>An <a class="term" data-t="agent">agent</a> repeats the tool step until it judges the goal is met. Anthropic's guidance draws a useful line: <a class="term" data-t="workflow">workflows</a> follow steps a developer laid out in advance, while <em>agents</em> let the model decide its own next step and which tools to use.<sup>[1]</sup> Coding assistants that edit files, run tests and fix what fails are agents in this sense.</p>
<p>The loop has four beats: gather information, act, observe the result, decide what next. Its power comes from the third beat. A failing test, an error message or an empty search result is feedback from the real world, and it lets the agent correct course without you. Its risk comes from the same loop: each step builds on the last, so an early wrong assumption can carry through many actions, and every action may have side effects.</p>

<div class="activity"><div class="activity-h"><span class="tag">Try it</span><span class="ttl">Watch an agent work</span></div><div class="activity-b">
<p>A coding agent is asked: <em>“The test <code>test_apply_discount</code> is failing. Fix it.”</em> Step through its loop. At one point it will ask for permission. Decide as you would on a real team.</p>
<div data-w="agent"></div>
</div></div>

<h2>Permissions and blast radius</h2>
<p>The <a class="term" data-t="blast-radius">blast radius</a> of an action is how much it could affect if it goes wrong. Set an agent's permissions by blast radius, using the principle of <a class="term" data-t="least-privilege">least privilege</a>: give it only what the task needs.</p>
<div class="tbl"><table>
<thead><tr><th>Kind of action</th><th>Examples</th><th>Sensible default</th></tr></thead>
<tbody>
<tr><td><span class="fit good">Read</span></td><td>Read files, search docs, run tests, query a read-only replica.</td><td>Allow, within the data the task needs.</td></tr>
<tr><td><span class="fit care">Reversible change</span></td><td>Edit files on a branch, draft an email, create a ticket.</td><td>Allow in a sandbox or branch; review before it goes further.</td></tr>
<tr><td><span class="fit human">Irreversible or external</span></td><td>Deploy, push to main, send email to customers, delete data, spend money, change permissions.</td><td>Require explicit human approval each time, or don't grant at all.</td></tr>
</tbody></table></div>
<p>Further guardrails that cost little:</p>
<ul>
<li><strong>Sandboxes.</strong> Run agents in a container or a disposable environment, not on a laptop with production credentials.</li>
<li><strong>Scoped credentials.</strong> A token that can open pull requests in one repository, not an admin token.</li>
<li><strong>Checkpoints.</strong> Approval steps before irreversible actions. A <a class="term" data-t="human-in-the-loop">human in the loop</a> only helps if the approval screen shows what will actually happen and the person reads it.</li>
<li><strong>Limits and logs.</strong> Caps on time, steps and spend, and a record of every action so you can see what happened.</li>
</ul>
<p>Security guidance for AI applications names this risk directly: <em>excessive agency</em>, meaning more functions, permissions or autonomy than the task needs.<sup>[4]</sup></p>

<h2>Workflow or agent?</h2>
<p>Not every task that uses tools needs an agent. There are three designs, from simplest to most flexible:</p>
<div class="tbl"><table>
<thead><tr><th></th><th>Single request</th><th>Workflow</th><th>Agent</th></tr></thead>
<tbody>
<tr><td><b>Who decides the steps</b></td><td>There is one step.</td><td>A developer, in advance. The model fills in each step.</td><td>The model, as it goes.</td></tr>
<tr><td><b>Example</b></td><td>Summarise this transcript.</td><td>For each new ticket: classify it, extract the order ID, look up the order, draft a reply for a person to approve.</td><td>Make this failing build pass: read logs, search code, try a fix, rerun tests, repeat.</td></tr>
<tr><td><b>Strengths</b></td><td>Cheap, fast, easy to check.</td><td>Predictable, testable step by step, cost known in advance.</td><td>Handles open-ended problems where the path isn't known.</td></tr>
<tr><td><b>Weaknesses</b></td><td>Can't act or look things up.</td><td>Breaks when a case doesn't fit the planned steps.</td><td>Harder to predict, test and cost; errors compound across steps.</td></tr>
</tbody></table></div>
<p>The practical rule from vendor guidance: <strong>use the simplest design that works</strong>, and add autonomy only when the task needs it.<sup>[1]</sup> If you can write the steps down in advance, a workflow will usually be cheaper, faster and easier to check than an agent doing the same job.</p>

<div class="activity"><div class="activity-h"><span class="tag">Practice</span><span class="ttl">Choose the design</span></div><div class="activity-b">
<p>For each task, choose the simplest design that would do the job well.</p>
<div data-w="sort" data-cfg="wf-agent"></div>
</div></div>

<h2>Where agents fit, and where they don't</h2>
<div class="tbl"><table>
<thead><tr><th>Good fit</th><th>Poor fit</th></tr></thead>
<tbody>
<tr><td>A clear goal with an automatic success signal: “make this failing test pass without changing the test”.</td><td>Vague goals: “improve the onboarding experience”.</td></tr>
<tr><td>Repetitive changes across many files: updating calls to a deprecated API, with tests to confirm.</td><td>Work with no feedback signal, where only a person can say whether it's right.</td></tr>
<tr><td>Gathering and organising: collecting logs, labelling tickets for a human to review.</td><td>Irreversible actions in production, customer communication without review.</td></tr>
<tr><td>Work you can review as a diff or a list.</td><td>Decisions that depend on organisational context or judgment.</td></tr>
</tbody></table></div>

<h2>Connecting tools to agents</h2>
<p>Agents are increasingly connected to everyday systems: issue trackers, wikis, chat, cloud consoles. The <a class="term" data-t="mcp">Model Context Protocol</a> (MCP) is an open standard that gives AI applications a common way to plug into such tools and data sources.<sup>[3]</sup> It makes connecting easy, which is exactly why each connection deserves the same review as any integration with access to your data: what can it read, what can it change, and whose credentials does it use?</p>

<h2>Reviewing an agent's work</h2>
<p>An agent ends with a summary such as “Fixed the bug, all tests pass.” That summary is generated text, a claim like any other. Review the outcome:</p>
<ul>
<li><strong>Read the diff, not the narrative.</strong> What actually changed?</li>
<li><strong>Check the success signal yourself.</strong> Look at the CI run, not the agent's report of it.</li>
<li><strong>Look for scope creep.</strong> Did it change files it didn't need to? Reformat unrelated code? Add a dependency?</li>
<li><strong>Look for “fixed” tests.</strong> A common shortcut is making a test pass by weakening it: changing the expected value, skipping it, or catching the error. Check whether any test files changed, and why.</li>
<li><strong>Check the log for surprising actions.</strong> Network calls, file deletions, commands you didn't expect.</li>
</ul>

<section class="checks"><h2>Check your understanding</h2>
<div class="check" data-a="1"><p class="q">When an assistant “runs a database query”, what actually executes it?</p><ul>
<li data-fb="The model only produces text, including structured tool requests.">The model connects to the database directly.</li>
<li data-fb="Right. The model requests; the application executes with its own credentials. That's why the application's permissions define the blast radius.">The surrounding application, using its own access, after the model requests it.</li>
<li data-fb="The query runs against whatever the application is connected to, not the vendor's systems.">The AI vendor runs it on their servers against a copy of your data.</li>
</ul></div>
<div class="check" data-a="2"><p class="q">An agent reports: “Fixed the failing test; all 143 tests pass.” What should you check first?</p><ul>
<li data-fb="Asking it again gives you another claim, not evidence.">Ask the agent to confirm that all tests really pass.</li>
<li data-fb="The commit message is also generated text.">Read its commit message for details.</li>
<li data-fb="Right. Check whether the fix is in the code or in a weakened test, and confirm the result in CI yourself.">The diff, especially any changes to test files, and the CI run.</li>
</ul></div>
<div class="check" data-a="1"><p class="q">Every night, a script should translate the day's release notes into three languages and check them against a terminology list. What design fits best?</p><ul>
<li data-fb="It would work, but the steps are known in advance, so letting a model choose them adds cost and unpredictability for nothing.">An agent with access to the release notes and a translation tool.</li>
<li data-fb="Right. The steps are fixed and known, so a workflow is cheaper, more predictable and easier to test.">A workflow: translate each language, then run the terminology check, in a fixed order.</li>
<li data-fb="One request can't run the terminology check as a separate, testable step, and the job repeats nightly.">A single chat request each night.</li>
</ul></div>
<div class="check" data-a="0"><p class="q">You're setting up an agent to triage incoming support tickets. Which permission set fits best?</p><ul>
<li data-fb="Right. It can read and suggest; people approve what reaches customers.">Read tickets, add labels and draft replies, with a person approving anything sent to a customer.</li>
<li data-fb="Sending to customers without review is irreversible and external.">Read tickets and send replies directly, to save time.</li>
<li data-fb="Admin access is far more than triage needs.">Full admin access to the support system, so it never gets blocked.</li>
</ul></div>
</section>

<section class="sources"><h2>Sources and further reading</h2><ol>
<li>Anthropic (2024), <a href="https://www.anthropic.com/engineering/building-effective-agents" target="_blank" rel="noopener">Building effective agents</a>. Workflows versus agents, and when to use each.</li>
<li>Anthropic, <a href="https://docs.claude.com/en/docs/build-with-claude/tool-use" target="_blank" rel="noopener">Tool use documentation</a>. How tool definitions, requests and results flow.</li>
<li><a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">Model Context Protocol</a>. The open standard for connecting AI applications to tools and data.</li>
<li>OWASP, <a href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">Top 10 for LLM Applications</a>, including Excessive Agency and Prompt Injection.</li>
</ol></section>
`
});
