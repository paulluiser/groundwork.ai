/* Lesson-style detail for use cases: Operations and Customer support. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Operations ---------- */
  "Generating incident hypotheses": {
    w: "At 2 a.m. the API error rate jumps to 18%. You paste the alert and recent logs into an assistant to get ideas fast.",
    f: "Good fit for generating hypotheses quickly. Each one needs evidence before anyone acts on it.",
    x: { i: "The alert, 200 log lines and the last deploy's diff, with a request for ranked hypotheses and a read-only check for each.", o: "Three hypotheses, led by connection pool exhaustion.", c: "The read-only checks show the pool is fine; the database is failing over. The second hypothesis was right. Restarting pods, as the first suggested, would have made it worse." },
    tk: { q: "Write the request you'd send to an assistant at the start of an incident.", m: "“Here's the alert, the last 200 log lines and the latest deploy diff. Give three hypotheses, ranked, each with the evidence for it in this material and a read-only command or dashboard that would confirm or rule it out. Don't suggest changes yet.”", r: ["Provides evidence", "Asks for ranked hypotheses", "Asks for read-only checks", "Holds off on changes"] },
    q: { q: "Why ask for a read-only check for each hypothesis?", a: 1, o: [["Read-only commands are faster.", "Not the main reason."], ["To confirm the cause before changing anything.", "Right."], ["Write commands aren't allowed outside business hours.", "No such rule."], ["To save tokens.", "Irrelevant."]] }
  },
  "Drafting runbooks": {
    w: "Your team has no runbook for a full disk on the log servers. An assistant can draft one in minutes.",
    f: "Good fit for drafts. A runbook isn't done until every step is tested.",
    x: { i: "The system details and a request for steps with conditions, commands, verification and rollback.", o: "A clear runbook with an rm command to free space.", c: "In staging, the command would have deleted logs not yet shipped. You add a condition and limit deletion by age, then record the test date." },
    tk: { q: "Turn this step into a safe one: “Restart the service: systemctl restart api”.", m: "When: health checks fail and the service is unresponsive, and the database is healthy. Run: systemctl restart api on one node at a time. Verify: health endpoint returns 200 within 60 seconds; error rate falls. If not: stop, roll back the last deploy, escalate to the service owner. Tested: staging, [date].", r: ["Adds a condition for when to run it", "Limits blast radius", "Adds verification", "Adds rollback or escalation", "Records testing"] },
    q: { q: "When is a runbook ready to use?", a: 3, o: [["When it reads clearly.", "Clarity isn't safety."], ["When the AI is confident that the article is accurate.", "Not evidence."], ["When it's long, detailed and covers every case.", "Detail isn't testing."], ["When each step has been tested.", "Right."]] }
  },
  "Drafting Terraform and manifests": {
    w: "You need a new storage bucket and its permissions in Terraform. An assistant writes it in a minute.",
    f: "Good fit, with the plan reviewed rather than the code or summary.",
    x: { i: "The requirement and your module conventions, with a request to keep changes to new resources only.", o: "Clean Terraform and a summary: “creates a private bucket”.", c: "The plan also replaces an existing IAM policy with a broader one. You reject that part and keep only the new resources." },
    tk: { q: "List what you'd look for first in a Terraform plan for an AI-generated change.", m: "Resources marked destroy or replace; IAM and permission changes; network and public access changes (security groups, public buckets); anything outside the requested scope; then the new resources themselves.", r: ["Checks destroys and replacements first", "Checks IAM changes", "Checks public exposure", "Checks scope"] },
    q: { q: "What's the source of truth for an infrastructure change?", a: 2, o: [["The AI's summary.", "Describes intent."], ["The code alone.", "Doesn't show everything."], ["The plan output.", "Right."], ["The commit message.", "Describes intent."]] }
  },
  "Writing policy-as-code rules": {
    w: "Your team keeps catching over-broad IAM policies in review. You want a policy rule that blocks them automatically.",
    f: "Good fit for drafting rules. Test them against examples that should pass and fail.",
    x: { i: "The rule in words and examples of good and bad policies.", o: "A Rego rule that blocks wildcard actions.", c: "Testing shows it also blocks a legitimate read-only wildcard on logs. You narrow it and add both examples as tests." },
    tk: { q: "Write the test cases for a rule that blocks SSH open to the internet.", m: "Fail: ingress port 22 from 0.0.0.0/0. Fail: port range 20–30 from 0.0.0.0/0. Pass: port 22 from the VPN range. Pass: port 443 from 0.0.0.0/0. Fail: IPv6 ::/0 on port 22.", r: ["Includes cases that must fail", "Includes cases that must pass", "Covers port ranges", "Covers IPv6"] },
    q: { q: "How do you know a policy rule works?", a: 0, o: [["Test it against examples that should pass and fail.", "Right."], ["It compiles.", "Not enough."], ["The AI explains the rule clearly and in detail.", "Not a test."], ["It's short.", "Irrelevant."]] }
  },
  "Suggesting commands during an incident": {
    w: "Mid-incident, an assistant suggests five commands, including scaling and restarting services.",
    f: "Use with care. Read-only commands can run; anything that changes state needs a person to confirm the effect and rollback.",
    x: { i: "A request to label each suggested command as read-only or state-changing and give the rollback for changes.", o: "Five commands with labels.", c: "One labelled read-only actually triggers a cache flush. You check every command's documentation before running it." },
    tk: { q: "Write your team's rule for running AI-suggested commands during incidents.", m: "Read-only commands (get, describe, logs, metrics) can run directly. Any command that changes state needs the incident lead's confirmation, a stated rollback, and the namespace or target written explicitly. All commands are pasted into the incident channel.", r: ["Separates read-only from changes", "Requires confirmation for changes", "Requires a rollback", "Keeps a record"] },
    q: { q: "Which command needs confirmation before running?", a: 1, o: [["kubectl get pods.", "Read-only."], ["kubectl rollout restart deploy/api.", "Right. It changes state."], ["kubectl logs api-123.", "Read-only."], ["kubectl describe node worker-3 -n prod.", "Read-only."]] }
  },
  "Switching model versions": {
    w: "Your AI provider announces a newer model. The team wants to switch the support assistant this week.",
    f: "Use with care. New models change behaviour in specific ways; re-run your evals before switching.",
    x: { i: "The eval sets and a plan to compare current and new versions side by side.", o: "The new model scores higher on quality.", c: "It fails four policy questions by citing an old refund policy. You fix retrieval, re-run, and switch only when the policy set passes." },
    tk: { q: "Write the steps for switching an AI feature to a new model version.", m: "Pin the current version. Run all eval sets on the new version. Compare quality, policy, safety, cost and latency against release gates. Fix failures and re-run. Switch with the ability to roll back, and watch monitoring for a week.", r: ["Pins the current version", "Runs all eval sets", "Uses agreed release gates", "Keeps a rollback", "Monitors after switching"] },
    q: { q: "Why pin model versions in production?", a: 0, o: [["So behaviour only changes when you decide.", "Right."], ["Pinned versions are cheaper.", "Not necessarily."], ["Providers require it.", "No."], ["New versions are always worse at first, until they settle.", "Not always."]] }
  },
  "Drafting postmortems": {
    w: "After a two-hour outage, you need a postmortem by Wednesday. You have the incident channel, timeline and graphs.",
    f: "Use with care. Drafting saves time; the timeline must cite sources and the write-up must stay blameless.",
    x: { i: "The incident channel export and graphs, with a request for a blameless postmortem citing sources for each event.", o: "A tidy draft naming “the engineer who deployed the change” as the cause.", c: "You rewrite the cause as the system conditions that allowed the change, fix two uncited events, and add actions with owners." },
    tk: { q: "Rewrite this postmortem line blamelessly: “Sam deployed a broken config and caused the outage.”", m: "“A configuration change with an invalid timeout value was deployed at 14:02. The deploy pipeline didn't validate config values, and the change went to all regions at once.”", r: ["Describes what happened without blaming a person", "Names the system conditions that allowed it", "Is specific and factual"] },
    q: { q: "What should a postmortem's causes focus on?", a: 2, o: [["Who made the mistake.", "Not blameless."], ["How fast people responded once they were paged.", "Part of the story, not the cause."], ["The conditions that allowed the failure.", "Right."], ["The AI's summary.", "Needs checking."]] }
  },
  "Applying changes to production": {
    w: "An agent proposes and could apply a scaling change to production, saving the on-call engineer a few minutes.",
    f: "Keep human. Applying changes is where a wrong suggestion becomes an incident; people approve and apply.",
    x: { i: "A policy that agents can propose plans but not apply.", o: "A correct plan, waiting for approval.", c: "The on-call engineer applies it after checking the plan. Next week, a similar plan includes an unintended replacement; the same check catches it." },
    tk: { q: "Write the permission rule for AI agents and production infrastructure.", m: "Agents may read state and propose plans. Only people apply changes to production, after reviewing the plan. Agents' credentials can't modify production resources.", r: ["Allows reading and proposing", "Requires people to apply", "Enforces it through credentials, not instructions"] },
    q: { q: "How should the limit on agents applying changes be enforced?", a: 3, o: [["A clear line in the agent's system prompt.", "Can be ignored."], ["Team agreement.", "Helpful, not enforcement."], ["Monitoring after the fact.", "Too late."], ["Credentials that can't modify production.", "Right."]] }
  },

  /* ---------- Customer support ---------- */
  "Drafting replies for agents": {
    w: "Agents handle 60 tickets a day. AI-drafted replies could save minutes on each, if they're right.",
    f: "Good fit for drafts agents check. Promises, policies and facts need checking before sending.",
    x: { i: "The ticket, relevant help articles and policies, with a request to cite the source for any policy statement.", o: "A warm reply promising a refund “processed today” and three free months.", c: "No refund was processed and no policy offers free months. The agent rewrites with the real policy and the actual next step." },
    tk: { q: "Rewrite: “Absolutely! You can add unlimited users on your plan, and we're fully GDPR certified.” Facts: Starter allows 3 users; there's no GDPR certification.", m: "“Your Starter plan includes up to 3 users. To add more, you can move to the Team plan (up to 25 users). On data protection: we process data under our Data Processing Agreement [link]; there isn't a GDPR certification, but we're happy to answer specific questions.”", r: ["Corrects the user limit", "Offers a real option", "Removes the false certification claim", "Stays helpful and specific"] },
    q: { q: "Which part of a drafted reply most needs checking?", a: 0, o: [["Promises, policies, prices and limits.", "Right."], ["The greeting.", "Low risk."], ["The sign-off.", "Low risk."], ["The paragraph breaks and spacing between sections.", "Cosmetic."]] }
  },
  "Summarising long tickets": {
    w: "A ticket has 40 messages across three agents. The next agent needs to understand it in a minute.",
    f: "Good fit. Check the summary reflects the current state, not an early problem that's been solved.",
    x: { i: "The thread and a request for: current question, what's been tried, what's resolved, and open promises.", o: "A summary leading with an export bug.", c: "The export bug was resolved two weeks ago; the current question is about pricing. The structured format made the error easy to spot." },
    tk: { q: "Write the structure you'd ask for in a ticket summary.", m: "Current question (in the customer's words); what's been resolved; what's been tried that didn't work; promises made to the customer and whether they were kept; account details that matter (plan, region); sentiment.", r: ["Leads with the current question", "Separates resolved from open issues", "Tracks promises made", "Includes relevant account details"] },
    q: { q: "What's a common error in long-ticket summaries?", a: 1, o: [["Too short.", "Easy to fix."], ["Leading with a problem that's already solved.", "Right."], ["Wrong date format for the customer's region.", "Minor."], ["Too formal.", "Minor."]] }
  },
  "Drafting articles from solved tickets": {
    w: "Your team solved the same SSO error 40 times last quarter. An article would help customers and agents.",
    f: "Good fit if the scope is right and customer details are removed. Review before the bot can use it.",
    x: { i: "Several solved tickets on the issue and a request for an article with applies-to, issue, cause and resolution.", o: "An article with one customer's domain in it and a step that didn't help.", c: "You remove the customer's details, drop the unnecessary step after comparing tickets, and add which plans it applies to." },
    tk: { q: "Write an article from this ticket: “Customer at Acme couldn't invite a teammate; they were on Starter with 3 users already; upgraded to Team; invite worked.”", m: "“Can't invite a teammate. Applies to: Starter plan. Issue: The Invite button shows ‘User limit reached’. Cause: Starter includes up to 3 users. Resolution: Remove an existing user or upgrade to the Team plan (up to 25 users) under Settings › Billing.”", r: ["Removes customer details", "States which plan it applies to", "Explains the cause", "Gives a resolution customers can follow"] },
    q: { q: "When should a new article be used by the support bot?", a: 2, o: [["As soon as it's drafted.", "Unreviewed drafts become wrong answers."], ["When it has many views.", "Views don't make it right."], ["After a person reviews and publishes it.", "Right."], ["When the AI is confident that the article is accurate.", "Not a review."]] }
  },
  "Finding help-centre gaps": {
    w: "You want to know which questions customers ask that the help centre doesn't answer.",
    f: "Good fit: comparing ticket themes with article coverage is tedious for people.",
    x: { i: "Three months of ticket subjects and the article list, with a request to list frequent topics with no matching article, with counts and example ticket IDs.", o: "Fifteen gaps.", c: "Two “gaps” are covered by articles with different titles. You fix those titles and write articles for the top five real gaps." },
    tk: { q: "Write the request you'd use to find help-centre gaps.", m: "“Here are ticket subjects from the last 90 days and our article titles and summaries. Group tickets into topics with counts. For each topic, list the article that answers it, or ‘none’. Give three example ticket IDs per topic. Sort by count.”", r: ["Groups tickets with counts", "Matches against article content, not just titles", "Gives example tickets", "Sorts by frequency"] },
    q: { q: "A topic is flagged as a gap, but an article exists. What's likely?", a: 3, o: [["The article is wrong.", "Possibly, but check first."], ["Customers don't read help articles before contacting support.", "Not the likely cause."], ["The AI is broken.", "Unlikely."], ["The article's title doesn't match how customers ask.", "Right."]] }
  },
  "Routing and tagging tickets": {
    w: "Tickets arrive in one queue. Automatic routing and tagging would get them to the right team faster.",
    f: "Use with care. Mistakes delay customers; measure accuracy and keep a path for misroutes.",
    x: { i: "500 past tickets with correct teams and a request to test routing accuracy.", o: "92% routed correctly.", c: "Most errors send billing disputes to general support, where they wait longest. You add a rule that anything mentioning a charge goes to billing, and monitor weekly." },
    tk: { q: "How would you test an AI routing system before turning it on?", m: "Run it on several hundred past tickets with known correct teams; measure accuracy by team; look at where errors go and what they cost; add rules or examples for costly errors; launch with an easy way for agents to re-route and weekly accuracy checks.", r: ["Tests on past labelled tickets", "Measures accuracy by category", "Focuses on costly errors", "Plans for misroutes and monitoring"] },
    q: { q: "Which routing error matters most?", a: 1, o: [["Tagging a ticket with an extra label.", "Minor."], ["Sending urgent or money issues to a slow queue.", "Right."], ["Using the wrong colour tag.", "Cosmetic."], ["Routing a thank-you note to general support instead of closing it.", "Minor."]] }
  },
  "AI quality scoring": {
    w: "Your team reviews 2% of conversations for quality. An AI could score all of them against the rubric.",
    f: "Use with care. Calibrate AI scores against experienced reviewers, and don't use them alone for decisions about people.",
    x: { i: "The rubric and 100 conversations already scored by senior reviewers.", o: "Scores for the 100.", c: "Agreement is good on tone, poor on whether the policy was applied correctly. You use AI scores to find conversations for human review, not to grade agents." },
    tk: { q: "Write two rules for using AI quality scores fairly.", m: "AI scores select conversations for human review; they're not used alone in performance reviews. Scores are calibrated against senior reviewers each quarter, and agents can see and challenge any score.", r: ["Keeps humans in decisions about people", "Requires regular calibration", "Lets agents see and challenge scores"] },
    q: { q: "What's a fair use of AI quality scoring?", a: 0, o: [["Finding conversations for a person to review.", "Right."], ["Ranking agents for bonuses.", "Decisions about people need human judgement."], ["Replacing all human reviews.", "Not without calibration."], ["Scoring only conversations with angry customers.", "Unrelated."]] }
  },
  "A customer-facing assistant": {
    w: "Leadership wants an assistant on the website answering customers directly next month.",
    f: "Use with care. Scope, handover and testing decide whether it helps or harms customers.",
    x: { i: "A scope document, a handover design and a test on 300 past questions.", o: "Correct, grounded answers to 85%; most of the rest handed over correctly.", c: "Eight answers stated policies not in the help centre. You restrict answers to published articles and re-test before launch." },
    tk: { q: "Write the handover message a customer sees when the assistant can't help.", m: "“This needs our billing team. I've passed on what you've told me, so you won't need to repeat it. They usually reply within 4 working hours by email.”", r: ["Says who will help", "Says how long it will take", "Avoids making the customer repeat themselves"] },
    q: { q: "What should a customer-facing assistant answer from?", a: 2, o: [["Its general knowledge.", "Leads to invented policies."], ["Anything customers ask about.", "Too broad."], ["Published, reviewed help articles.", "Right."], ["Past conversations with other customers.", "Privacy risk."]] }
  },
  "Refunds and exceptions": {
    w: "A long-standing customer asks for a refund outside the policy window. An assistant could decide automatically.",
    f: "Keep human. Exceptions involve money, fairness and judgement about the relationship.",
    x: { i: "The ticket and account history, with a request to summarise facts relevant to an exception.", o: "A useful summary and a recommendation to refund.", c: "The summary helps; the decision belongs to an agent with authority. They grant a partial credit and record why." },
    tk: { q: "List the facts an agent needs before deciding on a refund exception.", m: "The policy and how far outside it the request is; the customer's history (tenure, previous exceptions); the reason for the request and any fault on our side; the amount; who has authority to approve; how similar cases were handled.", r: ["Includes policy and the gap", "Includes customer history", "Considers fault on our side", "Considers consistency with past cases"] },
    q: { q: "Who should decide a refund exception?", a: 3, o: [["The assistant, for consistency.", "Exceptions need judgement."], ["The customer.", "No."], ["Nobody, because exceptions to the policy shouldn't happen at all.", "Sometimes they're right."], ["An agent with authority, using the facts.", "Right."]] }
  }
});
