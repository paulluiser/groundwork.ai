/* Lesson-style detail for use cases: Operations and Customer support. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Operations ---------- */
  "Generating incident hypotheses": {
    w: "At 2 a.m. the API error rate jumps to 18%. You paste the alert and recent logs into an assistant to get ideas fast.",
    f: "Good fit for generating hypotheses quickly. Each one needs evidence before anyone acts on it.",
    x: { i: "The alert, 200 log lines and the last deploy's diff, with a request for ranked hypotheses and a read-only check for each.", o: "Three hypotheses, led by connection pool exhaustion.", c: "The read-only checks show the pool is fine; the database is failing over. The second hypothesis was right. Restarting pods, as the first suggested, would have made it worse." },
  },
  "Drafting runbooks": {
    w: "Your team has no runbook for a full disk on the log servers. An assistant can draft one in minutes.",
    f: "Good fit for drafts. A runbook isn't done until every step is tested.",
    x: { i: "The system details and a request for steps with conditions, commands, verification and rollback.", o: "A clear runbook with an rm command to free space.", c: "In staging, the command would have deleted logs not yet shipped. You add a condition and limit deletion by age, then record the test date." },
  },
  "Drafting Terraform and manifests": {
    w: "You need a new storage bucket and its permissions in Terraform. An assistant writes it in a minute.",
    f: "Good fit, with the plan reviewed rather than the code or summary.",
    x: { i: "The requirement and your module conventions, with a request to keep changes to new resources only.", o: "Clean Terraform and a summary: “creates a private bucket”.", c: "The plan also replaces an existing IAM policy with a broader one. You reject that part and keep only the new resources." },
  },
  "Writing policy-as-code rules": {
    w: "Your team keeps catching over-broad IAM policies in review. You want a policy rule that blocks them automatically.",
    f: "Good fit for drafting rules. Test them against examples that should pass and fail.",
    x: { i: "The rule in words and examples of good and bad policies.", o: "A Rego rule that blocks wildcard actions.", c: "Testing shows it also blocks a legitimate read-only wildcard on logs. You narrow it and add both examples as tests." },
  },
  "Suggesting commands during an incident": {
    w: "Mid-incident, an assistant suggests five commands, including scaling and restarting services.",
    f: "Use with care. Read-only commands can run; anything that changes state needs a person to confirm the effect and rollback.",
    x: { i: "A request to label each suggested command as read-only or state-changing and give the rollback for changes.", o: "Five commands with labels.", c: "One labelled read-only actually triggers a cache flush. You check every command's documentation before running it." },
  },
  "Switching model versions": {
    w: "Your AI provider announces a newer model. The team wants to switch the support assistant this week.",
    f: "Use with care. New models change behaviour in specific ways; re-run your evals before switching.",
    x: { i: "The eval sets and a plan to compare current and new versions side by side.", o: "The new model scores higher on quality.", c: "It fails four policy questions by citing an old refund policy. You fix retrieval, re-run, and switch only when the policy set passes." },
  },
  "Drafting postmortems": {
    w: "After a two-hour outage, you need a postmortem by Wednesday. You have the incident channel, timeline and graphs.",
    f: "Use with care. Drafting saves time; the timeline must cite sources and the write-up must stay blameless.",
    x: { i: "The incident channel export and graphs, with a request for a blameless postmortem citing sources for each event.", o: "A tidy draft naming “the engineer who deployed the change” as the cause.", c: "You rewrite the cause as the system conditions that allowed the change, fix two uncited events, and add actions with owners." },
  },
  "Applying changes to production": {
    w: "An agent proposes and could apply a scaling change to production, saving the on-call engineer a few minutes.",
    f: "Keep human. Applying changes is where a wrong suggestion becomes an incident; people approve and apply.",
    x: { i: "A policy that agents can propose plans but not apply.", o: "A correct plan, waiting for approval.", c: "The on-call engineer applies it after checking the plan. Next week, a similar plan includes an unintended replacement; the same check catches it." },
  },

  /* ---------- Customer support ---------- */
  "Drafting replies for agents": {
    w: "Agents handle 60 tickets a day. AI-drafted replies could save minutes on each, if they're right.",
    f: "Good fit for drafts agents check. Promises, policies and facts need checking before sending.",
    x: { i: "The ticket, relevant help articles and policies, with a request to cite the source for any policy statement.", o: "A warm reply promising a refund “processed today” and three free months.", c: "No refund was processed and no policy offers free months. The agent rewrites with the real policy and the actual next step." },
  },
  "Summarising long tickets": {
    w: "A ticket has 40 messages across three agents. The next agent needs to understand it in a minute.",
    f: "Good fit. Check the summary reflects the current state, not an early problem that's been solved.",
    x: { i: "The thread and a request for: current question, what's been tried, what's resolved, and open promises.", o: "A summary leading with an export bug.", c: "The export bug was resolved two weeks ago; the current question is about pricing. The structured format made the error easy to spot." },
  },
  "Drafting articles from solved tickets": {
    w: "Your team solved the same SSO error 40 times last quarter. An article would help customers and agents.",
    f: "Good fit if the scope is right and customer details are removed. Review before the bot can use it.",
    x: { i: "Several solved tickets on the issue and a request for an article with applies-to, issue, cause and resolution.", o: "An article with one customer's domain in it and a step that didn't help.", c: "You remove the customer's details, drop the unnecessary step after comparing tickets, and add which plans it applies to." },
  },
  "Finding help-centre gaps": {
    w: "You want to know which questions customers ask that the help centre doesn't answer.",
    f: "Good fit: comparing ticket themes with article coverage is tedious for people.",
    x: { i: "Three months of ticket subjects and the article list, with a request to list frequent topics with no matching article, with counts and example ticket IDs.", o: "Fifteen gaps.", c: "Two “gaps” are covered by articles with different titles. You fix those titles and write articles for the top five real gaps." },
  },
  "Routing and tagging tickets": {
    w: "Tickets arrive in one queue. Automatic routing and tagging would get them to the right team faster.",
    f: "Use with care. Mistakes delay customers; measure accuracy and keep a path for misroutes.",
    x: { i: "500 past tickets with correct teams and a request to test routing accuracy.", o: "92% routed correctly.", c: "Most errors send billing disputes to general support, where they wait longest. You add a rule that anything mentioning a charge goes to billing, and monitor weekly." },
  },
  "AI quality scoring": {
    w: "Your team reviews 2% of conversations for quality. An AI could score all of them against the rubric.",
    f: "Use with care. Calibrate AI scores against experienced reviewers, and don't use them alone for decisions about people.",
    x: { i: "The rubric and 100 conversations already scored by senior reviewers.", o: "Scores for the 100.", c: "Agreement is good on tone, poor on whether the policy was applied correctly. You use AI scores to find conversations for human review, not to grade agents." },
  },
  "A customer-facing assistant": {
    w: "Leadership wants an assistant on the website answering customers directly next month.",
    f: "Use with care. Scope, handover and testing decide whether it helps or harms customers.",
    x: { i: "A scope document, a handover design and a test on 300 past questions.", o: "Correct, grounded answers to 85%; most of the rest handed over correctly.", c: "Eight answers stated policies not in the help centre. You restrict answers to published articles and re-test before launch." },
  },
  "Refunds and exceptions": {
    w: "A long-standing customer asks for a refund outside the policy window. An assistant could decide automatically.",
    f: "Keep human. Exceptions involve money, fairness and judgement about the relationship.",
    x: { i: "The ticket and account history, with a request to summarise facts relevant to an exception.", o: "A useful summary and a recommendation to refund.", c: "The summary helps; the decision belongs to an agent with authority. They grant a partial credit and record why." },
  }
});
