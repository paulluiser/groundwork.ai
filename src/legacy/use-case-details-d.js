/* Lesson-style detail for use cases: Security and Data and analytics. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Security ---------- */
  "Explaining an obfuscated script": {
    w: "An alert flags a heavily obfuscated PowerShell script on a laptop. You need to know what it does, quickly, without running it.",
    f: "Explaining code is a strength. Verify key claims (URLs, file paths, actions) in a sandbox or by decoding them yourself.",
    x: { i: "The script, with a request to deobfuscate step by step and list every URL, file and registry change, quoting the decoded strings.", o: "A clear explanation: it downloads a second stage from a URL and adds a scheduled task.", c: "Decoding the base64 yourself confirms the URL but shows the task runs at logon, not hourly. You correct the timeline and block the URL." },
    tk: { q: "What would you ask an assistant to extract from a suspicious script, and how would you check it?", m: "Ask for each decoding step, every URL, IP, file path, registry key and scheduled task, quoting decoded strings. Check by decoding key strings yourself, searching the URLs in threat intel, and if needed running it in an isolated sandbox.", r: ["Asks for indicators like URLs and paths", "Asks for decoded strings quoted", "Verifies key indicators independently", "Uses a sandbox rather than a real machine"] },
    q: { q: "How should you confirm an AI explanation of malware?", a: 2, o: [["Run it on your laptop to see.", "Never on a real machine."], ["Ask the AI if it's confident.", "Not verification."], ["Decode key strings yourself or use a sandbox.", "Right."], ["Trust it if the explanation is detailed and technically precise.", "Detail isn't proof."]] }
  },
  "Turning logs into a timeline": {
    w: "A suspicious sign-in triggered an alert at 2 a.m. You have identity, file and network logs and need a timeline for the incident channel.",
    f: "Good fit for reading volume. Every event in the timeline must cite its log line.",
    x: { i: "The three log exports and a request for a timeline where every event cites its source log line.", o: "A timeline that says the attacker exfiltrated 2 GB.", c: "The 2 GB was a backup job's size, not a transfer, and the file access was a service account. You rewrite the timeline from cited events only." },
    tk: { q: "Write the instruction you'd add to make an AI incident timeline trustworthy.", m: "“Only include events that appear in the logs provided. For each, give the time, actor, action and the log line it comes from. Don't infer events that aren't logged; list suspected but unconfirmed events separately.”", r: ["Limits to logged events", "Requires a source line per event", "Separates inference from evidence"] },
    q: { q: "Which timeline detail most often needs checking?", a: 0, o: [["Actors, sizes and destinations.", "Right. Models merge and infer these."], ["Time zone labels.", "Worth checking, but less often wrong."], ["Formatting.", "Cosmetic."], ["The incident title and its severity label.", "Cosmetic."]] }
  },
  "Drafting threat model questions": {
    w: "A design review for a new AI feature is tomorrow. You want a strong list of threat questions to bring.",
    f: "Good fit for brainstorming with STRIDE and OWASP as prompts. You choose which apply.",
    x: { i: "The data-flow description and a request for threat questions by STRIDE category and OWASP LLM risks.", o: "Forty questions.", c: "Most are useful; some don't apply (no file uploads exist). You keep twelve that fit the design and add one only you knew: an internal admin tool also reads the same data." },
    tk: { q: "Write four threat questions for an AI assistant that can read customer invoices and send emails.", m: "Can it read another customer's invoices? Could text inside an invoice instruct it to email data elsewhere? Where can its emails be sent? What's logged about its actions, and who can see the logs?", r: ["Covers access to other users' data", "Covers prompt injection from content", "Covers where data can be sent", "Covers logging and accountability"] },
    q: { q: "Which question is specific to AI components?", a: 3, o: [["Is the database encrypted at rest and are backups encrypted?", "General."], ["Is TLS used?", "General."], ["Are passwords hashed?", "General."], ["Who could write text the model reads and follow-up on?", "Right. Injection risk."]] }
  },
  "First-pass code review for vulnerabilities": {
    w: "Forty pull requests a week reach the security team. An AI review flags likely issues before a person looks.",
    f: "Use with care. Treat findings as leads; confirm each with evidence and expect logic flaws to be missed.",
    x: { i: "A PR and a request to check against ASVS requirements, quoting lines.", o: "Three findings, one critical SQL injection.", c: "The “injection” is in code that only receives fixed values from a dropdown. A missing ownership check, not flagged, is the real issue." },
    tk: { q: "How would you triage an AI finding marked critical?", m: "Find the line; trace where the input comes from; try to reach it with attacker-controlled input; if exploitable, record the request and response as evidence; if not, record why it's a false positive.", r: ["Traces the input to the vulnerable line", "Attempts to reproduce", "Records evidence for confirmed findings", "Records reasoning for false positives"] },
    q: { q: "An AI review finds no issues. What does that prove?", a: 1, o: [["The code is secure.", "No."], ["Very little: logic and authorisation flaws may remain.", "Right."], ["The AI tool is broken.", "Not necessarily."], ["Manual review is unnecessary for this pull request now.", "No."]] }
  },
  "Drafting detection rules": {
    w: "Threat intel describes a new phishing technique. You want a detection rule in your SIEM's language today.",
    f: "Use with care. AI drafts rules quickly; test them against real logs for false positives and missed cases.",
    x: { i: "The technique, your log schema and a request for a rule with test cases.", o: "A syntactically valid rule.", c: "Run against a week of logs, it fires 400 times on a legitimate marketing tool. You add an exclusion and confirm it still catches the test sample." },
    tk: { q: "List the tests you'd run before deploying an AI-drafted detection rule.", m: "Run it against known-bad samples (does it fire?); against a week of normal logs (how many false positives?); check field names match your schema; check performance on large volumes; peer review the logic.", r: ["Tests against known-bad samples", "Measures false positives on real data", "Checks schema and fields", "Gets a peer review"] },
    q: { q: "What's the main risk of deploying an untested AI detection rule?", a: 2, o: [["It's too short.", "Length isn't the issue."], ["It uses the wrong colours.", "Irrelevant."], ["Floods of false positives or missed attacks.", "Right."], ["It's written in the wrong query language for the SIEM.", "Usually checked quickly."]] }
  },
  "Triage of phishing reports": {
    w: "Employees report 200 suspicious emails a week. An assistant can sort them into obvious spam, phishing and legitimate.",
    f: "Use with care. Good for sorting, but hostile emails can contain instructions aimed at AI tools, and misses are costly.",
    x: { i: "Reported emails with headers, in a tool approved for this, and a request to classify with reasons.", o: "Classifications for 200 emails, 12 marked phishing.", c: "Sampling the “legitimate” pile finds one credential-harvesting email that imitated your HR system. You lower the threshold and review that category." },
    tk: { q: "Design a triage process using AI that keeps misses low.", m: "AI sorts into likely phishing, likely spam and uncertain; analysts review every likely-phishing and uncertain email; sample 10% of likely spam weekly; feed misses back into the rules; use a tool approved for hostile content.", r: ["Has an uncertain category", "People review the risky categories", "Samples the safe-looking pile", "Feeds misses back into the process"] },
    q: { q: "Why sample emails the AI marked as harmless?", a: 0, o: [["Misses there are the costliest errors.", "Right."], ["To measure the AI's speed.", "Not the purpose."], ["Because harmless emails are rare compared with phishing.", "They're common."], ["Regulation requires it.", "Not the main reason."]] }
  },
  "Reviewing an AI vendor's security answers": {
    w: "A vendor's security questionnaire came back with 120 answers. You need to know which ones are real evidence and which are reassurances.",
    f: "Use with care. AI can sort answers by specificity; you check the evidence behind each one.",
    x: { i: "The answers and a request to mark each as specific evidence, a vague claim, or not answered.", o: "A sorted list: 70 specific, 35 vague, 15 unanswered.", c: "Several “specific” answers cite a SOC 2 report that expired last year. You request the current report and follow up on the vague ones." },
    tk: { q: "Rewrite this vague vendor answer as the question you'd send back: “We take security seriously and follow industry best practices.”", m: "“Please provide your most recent independent security report (e.g. SOC 2 Type II) with its date, describe how customer data is isolated between tenants, and how you prevent prompt injection from customer-supplied content.”", r: ["Asks for a dated independent report", "Asks about tenant isolation", "Asks an AI-specific security question"] },
    q: { q: "Which vendor answer is evidence?", a: 3, o: [["“We follow best practices.”", "Vague."], ["“Security is our top priority and part of everything we do.”", "Vague."], ["“We are fully compliant.”", "With what?"], ["“SOC 2 Type II report dated March 2026, attached.”", "Right."]] }
  },
  "Attribution and severity": {
    w: "An incident is contained. Leadership wants to know who was behind it and how bad it was. An assistant offers an attribution based on the indicators.",
    f: "Keep human. Attribution and severity drive disclosure, legal and customer decisions; they need analysts and accountable owners.",
    x: { i: "The indicators and a request to list known groups using similar techniques, with sources.", o: "“This attack was carried out by a known group, with high confidence.”", c: "The techniques are common to many groups. The analysts report “unattributed” and set severity by impact on data, using the company's framework." },
    tk: { q: "Write how you'd describe attribution confidence in an incident report.", m: "“Attribution: unknown. The techniques observed (phishing with a cloned login page, mailbox rules) are common across many groups. No unique infrastructure or tooling links this to a known actor.”", r: ["States the confidence honestly", "Explains why techniques alone don't attribute", "Avoids naming actors without evidence"] },
    q: { q: "Why shouldn't AI decide incident severity?", a: 1, o: [["It's too slow.", "Speed isn't the issue."], ["Severity drives legal and customer decisions that need accountable owners.", "Right."], ["It can't read logs.", "It can."], ["Severity scales are confidential and can't be shared with AI tools at all.", "Not the reason."]] }
  },

  /* ---------- Data and analytics ---------- */
  "Writing SQL against a known schema": {
    w: "A product manager asks how many customers upgraded last quarter. You have the schema and the metric definition; an assistant can draft the query.",
    f: "Good fit when you supply the schema and definitions. The check is reproducing a known number.",
    x: { i: "The schema, the definition of “upgrade”, and last quarter's agreed figure from finance.", o: "A clean query returning 1,140 upgrades.", c: "Finance's number is 912. A join to events duplicated rows. You remove the join and the query reproduces 912 for the known quarter." },
    tk: { q: "List the five checks you'd run on an AI-written SQL query before sharing its number.", m: "Definition matches the official one; reproduces a known figure; joins don't fan out (row counts before and after); date filters are right (inclusive ends, time zones); spot-check ten rows it counted.", r: ["Checks the definition", "Reproduces a known number", "Checks joins for duplication", "Checks dates", "Spot-checks rows"] },
    q: { q: "A query returns more than the official figure. What's the most likely cause?", a: 0, o: [["A join is duplicating rows.", "Right. Fan-out is common."], ["The database is returning wrong results.", "Unlikely."], ["Finance made an error.", "Check your query first."], ["Rounding.", "Unlikely to explain a large gap."]] }
  },
  "Analysis as a rerunnable notebook": {
    w: "You need to analyse a pricing experiment and share the results. An assistant that runs code can produce an analysis and charts in minutes.",
    f: "Good fit if the analysis is saved as code you can rerun and read, not just a chat answer.",
    x: { i: "The data and a request for a notebook with each step as code, intermediate results printed, and assertions on the data.", o: "A notebook and a confident conclusion.", c: "An assertion fails: 3% of rows have negative prices from refunds. You decide how to treat them, rerun, and the effect shrinks by half." },
    tk: { q: "Write three assertions you'd add to an analysis of order data.", m: "Assert no duplicate order IDs; assert prices are non-negative (or that refunds are handled explicitly); assert every order has a date within the analysis period.", r: ["Checks for duplicates", "Checks value ranges", "Checks dates or completeness"] },
    q: { q: "Why save AI analysis as a notebook instead of a chat answer?", a: 2, o: [["Notebooks look more professional than chat answers in meetings.", "Not the main reason."], ["Chats can't do maths.", "They can, unreliably."], ["So it can be rerun, read and checked.", "Right."], ["Notebooks are faster.", "Not necessarily."]] }
  },
  "Drafting data tests": {
    w: "A new dbt model goes live next week with no tests. An assistant can propose tests from the model and its docs.",
    f: "Good fit: generic tests are well understood. Add tests for business rules only you know.",
    x: { i: "The model SQL and docs, with a request for generic tests and suggestions for business-rule tests.", o: "Unique and not-null tests for every column.", c: "Useful, but it missed that status must be one of four values and that refunds can't exceed the order total. You add those two tests." },
    tk: { q: "Write tests for an orders model with columns order_id, customer_id, status, total, currency.", m: "order_id: unique, not null. customer_id: not null, relationship to customers. status: accepted values (pending, paid, refunded, cancelled). total: not null, ≥ 0. currency: not null, accepted ISO codes.", r: ["Uniqueness on the key", "Relationships to other tables", "Accepted values for status", "Range checks on amounts"] },
    q: { q: "Which test catches a new status value nobody expected?", a: 1, o: [["not_null.", "Doesn't check values."], ["accepted_values.", "Right."], ["unique.", "Checks duplicates."], ["relationships to the customers table.", "Checks foreign keys."]] }
  },
  "Documenting models and columns": {
    w: "An AI analyst tool will answer questions from your warehouse. Your column docs say “status: the status”.",
    f: "Good fit for first drafts, which need your knowledge of grain, meanings and traps.",
    x: { i: "The model and a request to draft docs including grain, value meanings, units and warnings.", o: "Docs restating column names.", c: "You add the grain (one row per subscription), that paused subscriptions aren't billed, and that amounts are in cents in four currencies." },
    tk: { q: "Write the documentation for a column “amount” in a payments table.", m: "“amount: payment amount in minor units (cents) of currency. Includes tax. Negative for refunds. Don't sum across currencies; use amount_usd for totals.”", r: ["States units", "States what's included", "Explains negative values", "Warns against a common mistake"] },
    q: { q: "Which doc line helps an AI tool answer correctly?", a: 3, o: [["“amount: the amount.”", "Restates the name."], ["“amount: numeric.”", "Type only."], ["“amount: see the finance team's wiki page for the meaning.”", "Unusable by a tool."], ["“amount: cents in currency; don't sum across currencies.”", "Right."]] }
  },
  "Statistical tests": {
    w: "You ran an A/B test on onboarding. An assistant can run the significance test and write the conclusion.",
    f: "Use with care. Running tests is easy; choosing the right test and wording the conclusion needs judgement.",
    x: { i: "Experiment data and the pre-registered metric, with a request to run the test and report the effect with a confidence interval.", o: "“Significant improvement (p = 0.03). Roll out to all users.”", c: "The test used a metric chosen after looking at results, and the effect is 0.4 points with a wide interval. You report the pre-registered metric and recommend a longer test." },
    tk: { q: "Rewrite: “The new flow significantly improved conversion (p < 0.05).”", m: "“On the pre-registered metric, conversion was 12.4% with the new flow versus 11.8% with the old (difference 0.6 points, 95% interval −0.1 to 1.3). The result is inconclusive; we recommend running two more weeks.”", r: ["Reports the effect size and interval", "Uses the pre-registered metric", "Avoids treating p < 0.05 as proof", "Recommends a proportionate next step"] },
    q: { q: "What does p < 0.05 tell you by itself?", a: 0, o: [["The data would be unusual if there were no effect, under assumptions.", "Right."], ["There's a 95% chance that the change caused a real improvement in the metric.", "Common misreading."], ["The effect is large.", "Not measured by p."], ["The design was sound.", "No."]] }
  },
  "Explaining why a metric moved": {
    w: "Weekly active users dropped 8%. Leadership wants to know why by the afternoon.",
    f: "Use with care. AI generates plausible explanations; only segmenting the data tests them.",
    x: { i: "The metric's data and a request for hypotheses with the segment that would test each.", o: "“The drop is due to seasonality and a recent UI change.”", c: "Splitting by platform shows the whole drop is on Android, starting the day a tracking update shipped. It's a measurement problem, not user behaviour." },
    tk: { q: "List the first four cuts you'd make when a metric moves unexpectedly.", m: "By platform or app version; by date of change (did it start on a release day?); by acquisition source; by key segment (new vs returning, plan). Also check whether tracking or definitions changed.", r: ["Splits by platform or version", "Aligns with release dates", "Splits by user segment", "Checks for tracking changes"] },
    q: { q: "A metric drops on the day a tracking update ships. What's likely?", a: 2, o: [["Users suddenly stopped liking the product.", "Possible, but check measurement first."], ["Seasonality.", "Wouldn't align with the release day."], ["A measurement change, not behaviour.", "Right."], ["Competitor activity.", "Unlikely to align so precisely."]] }
  },
  "Answering questions across the warehouse": {
    w: "Your company wants an AI assistant that lets anyone ask questions of the data warehouse in plain English.",
    f: "Use with care. Text-to-SQL on real warehouses is still unreliable; definitions and checks decide whether answers are right.",
    x: { i: "A pilot connecting the assistant to the metrics layer only, with known questions to test.", o: "Fluent answers to 50 test questions.", c: "Forty-one match the official numbers. The nine misses all used raw tables instead of the metrics layer. You restrict access to defined metrics." },
    tk: { q: "Write three rules for an AI tool that answers questions from your warehouse.", m: "Answer only from defined metrics in the semantic layer; show the query and the definitions used with every answer; when a question can't be answered from defined metrics, say so and suggest who to ask.", r: ["Restricts it to defined metrics", "Makes queries and definitions visible", "Has an honest fallback"] },
    q: { q: "What most improves AI answers about company data?", a: 1, o: [["A larger model.", "Helps less than definitions."], ["Pointing it at defined metrics.", "Right."], ["More example questions in the assistant's prompt.", "Helps a little."], ["Faster queries.", "Unrelated to correctness."]] }
  },
  "Deciding access to personal data": {
    w: "A team asks to connect an AI tool to a table with customer emails and support notes. The decision is yours.",
    f: "Keep human. Access to personal data is a legal and ethical decision with accountable owners.",
    x: { i: "The request and a checklist for data protection review.", o: "An assistant's suggestion that pseudonymised access is “safe”.", c: "Pseudonymised data is still personal data. You involve the data protection officer, limit columns to what's needed, and record the decision." },
    tk: { q: "List the questions you'd answer before approving AI access to personal data.", m: "What's the purpose, and is personal data necessary for it? Which columns exactly? Is the tool approved for this data, and where is it processed? Who can see outputs? How long is data retained? Has the data protection officer reviewed it?", r: ["Tests necessity", "Minimises columns", "Checks the tool's approval and location", "Considers retention and access", "Involves the data protection officer"] },
    q: { q: "Is pseudonymised data safe to give any AI tool?", a: 3, o: [["Yes, names are removed.", "Other fields can re-identify people."], ["Yes, if the tool doesn't train on it.", "Training is only one concern."], ["Only if it's less than a year old.", "Age doesn't matter."], ["No, it's still personal data.", "Right."]] }
  }
});
