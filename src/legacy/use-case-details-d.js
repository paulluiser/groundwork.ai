/* Lesson-style detail for use cases: Security and Data and analytics. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Security ---------- */
  "Explaining an obfuscated script": {
    w: "An alert flags a heavily obfuscated PowerShell script on a laptop. You need to know what it does, quickly, without running it.",
    f: "Explaining code is a strength. Verify key claims (URLs, file paths, actions) in a sandbox or by decoding them yourself.",
    x: { i: "The script, with a request to deobfuscate step by step and list every URL, file and registry change, quoting the decoded strings.", o: "A clear explanation: it downloads a second stage from a URL and adds a scheduled task.", c: "Decoding the base64 yourself confirms the URL but shows the task runs at logon, not hourly. You correct the timeline and block the URL." },
  },
  "Turning logs into a timeline": {
    w: "A suspicious sign-in triggered an alert at 2 a.m. You have identity, file and network logs and need a timeline for the incident channel.",
    f: "Good fit for reading volume. Every event in the timeline must cite its log line.",
    x: { i: "The three log exports and a request for a timeline where every event cites its source log line.", o: "A timeline that says the attacker exfiltrated 2 GB.", c: "The 2 GB was a backup job's size, not a transfer, and the file access was a service account. You rewrite the timeline from cited events only." },
  },
  "Drafting threat model questions": {
    w: "A design review for a new AI feature is tomorrow. You want a strong list of threat questions to bring.",
    f: "Good fit for brainstorming with STRIDE and OWASP as prompts. You choose which apply.",
    x: { i: "The data-flow description and a request for threat questions by STRIDE category and OWASP LLM risks.", o: "Forty questions.", c: "Most are useful; some don't apply (no file uploads exist). You keep twelve that fit the design and add one only you knew: an internal admin tool also reads the same data." },
  },
  "First-pass code review for vulnerabilities": {
    w: "Forty pull requests a week reach the security team. An AI review flags likely issues before a person looks.",
    f: "Use with care. Treat findings as leads; confirm each with evidence and expect logic flaws to be missed.",
    x: { i: "A PR and a request to check against ASVS requirements, quoting lines.", o: "Three findings, one critical SQL injection.", c: "The “injection” is in code that only receives fixed values from a dropdown. A missing ownership check, not flagged, is the real issue." },
  },
  "Drafting detection rules": {
    w: "Threat intel describes a new phishing technique. You want a detection rule in your SIEM's language today.",
    f: "Use with care. AI drafts rules quickly; test them against real logs for false positives and missed cases.",
    x: { i: "The technique, your log schema and a request for a rule with test cases.", o: "A syntactically valid rule.", c: "Run against a week of logs, it fires 400 times on a legitimate marketing tool. You add an exclusion and confirm it still catches the test sample." },
  },
  "Triage of phishing reports": {
    w: "Employees report 200 suspicious emails a week. An assistant can sort them into obvious spam, phishing and legitimate.",
    f: "Use with care. Good for sorting, but hostile emails can contain instructions aimed at AI tools, and misses are costly.",
    x: { i: "Reported emails with headers, in a tool approved for this, and a request to classify with reasons.", o: "Classifications for 200 emails, 12 marked phishing.", c: "Sampling the “legitimate” pile finds one credential-harvesting email that imitated your HR system. You lower the threshold and review that category." },
  },
  "Reviewing an AI vendor's security answers": {
    w: "A vendor's security questionnaire came back with 120 answers. You need to know which ones are real evidence and which are reassurances.",
    f: "Use with care. AI can sort answers by specificity; you check the evidence behind each one.",
    x: { i: "The answers and a request to mark each as specific evidence, a vague claim, or not answered.", o: "A sorted list: 70 specific, 35 vague, 15 unanswered.", c: "Several “specific” answers cite a SOC 2 report that expired last year. You request the current report and follow up on the vague ones." },
  },
  "Attribution and severity": {
    w: "An incident is contained. Leadership wants to know who was behind it and how bad it was. An assistant offers an attribution based on the indicators.",
    f: "Keep human. Attribution and severity drive disclosure, legal and customer decisions; they need analysts and accountable owners.",
    x: { i: "The indicators and a request to list known groups using similar techniques, with sources.", o: "“This attack was carried out by a known group, with high confidence.”", c: "The techniques are common to many groups. The analysts report “unattributed” and set severity by impact on data, using the company's framework." },
  },

  /* ---------- Data and analytics ---------- */
  "Writing SQL against a known schema": {
    w: "A product manager asks how many customers upgraded last quarter. You have the schema and the metric definition; an assistant can draft the query.",
    f: "Good fit when you supply the schema and definitions. The check is reproducing a known number.",
    x: { i: "The schema, the definition of “upgrade”, and last quarter's agreed figure from finance.", o: "A clean query returning 1,140 upgrades.", c: "Finance's number is 912. A join to events duplicated rows. You remove the join and the query reproduces 912 for the known quarter." },
  },
  "Analysis as a rerunnable notebook": {
    w: "You need to analyse a pricing experiment and share the results. An assistant that runs code can produce an analysis and charts in minutes.",
    f: "Good fit if the analysis is saved as code you can rerun and read, not just a chat answer.",
    x: { i: "The data and a request for a notebook with each step as code, intermediate results printed, and assertions on the data.", o: "A notebook and a confident conclusion.", c: "An assertion fails: 3% of rows have negative prices from refunds. You decide how to treat them, rerun, and the effect shrinks by half." },
  },
  "Drafting data tests": {
    w: "A new dbt model goes live next week with no tests. An assistant can propose tests from the model and its docs.",
    f: "Good fit: generic tests are well understood. Add tests for business rules only you know.",
    x: { i: "The model SQL and docs, with a request for generic tests and suggestions for business-rule tests.", o: "Unique and not-null tests for every column.", c: "Useful, but it missed that status must be one of four values and that refunds can't exceed the order total. You add those two tests." },
  },
  "Documenting models and columns": {
    w: "An AI analyst tool will answer questions from your warehouse. Your column docs say “status: the status”.",
    f: "Good fit for first drafts, which need your knowledge of grain, meanings and traps.",
    x: { i: "The model and a request to draft docs including grain, value meanings, units and warnings.", o: "Docs restating column names.", c: "You add the grain (one row per subscription), that paused subscriptions aren't billed, and that amounts are in cents in four currencies." },
  },
  "Statistical tests": {
    w: "You ran an A/B test on onboarding. An assistant can run the significance test and write the conclusion.",
    f: "Use with care. Running tests is easy; choosing the right test and wording the conclusion needs judgement.",
    x: { i: "Experiment data and the pre-registered metric, with a request to run the test and report the effect with a confidence interval.", o: "“Significant improvement (p = 0.03). Roll out to all users.”", c: "The test used a metric chosen after looking at results, and the effect is 0.4 points with a wide interval. You report the pre-registered metric and recommend a longer test." },
  },
  "Explaining why a metric moved": {
    w: "Weekly active users dropped 8%. Leadership wants to know why by the afternoon.",
    f: "Use with care. AI generates plausible explanations; only segmenting the data tests them.",
    x: { i: "The metric's data and a request for hypotheses with the segment that would test each.", o: "“The drop is due to seasonality and a recent UI change.”", c: "Splitting by platform shows the whole drop is on Android, starting the day a tracking update shipped. It's a measurement problem, not user behaviour." },
  },
  "Answering questions across the warehouse": {
    w: "Your company wants an AI assistant that lets anyone ask questions of the data warehouse in plain English.",
    f: "Use with care. Text-to-SQL on real warehouses is still unreliable; definitions and checks decide whether answers are right.",
    x: { i: "A pilot connecting the assistant to the metrics layer only, with known questions to test.", o: "Fluent answers to 50 test questions.", c: "Forty-one match the official numbers. The nine misses all used raw tables instead of the metrics layer. You restrict access to defined metrics." },
  },
  "Deciding access to personal data": {
    w: "A team asks to connect an AI tool to a table with customer emails and support notes. The decision is yours.",
    f: "Keep human. Access to personal data is a legal and ethical decision with accountable owners.",
    x: { i: "The request and a checklist for data protection review.", o: "An assistant's suggestion that pseudonymised access is “safe”.", c: "Pseudonymised data is still personal data. You involve the data protection officer, limit columns to what's needed, and record the decision." },
  }
});
