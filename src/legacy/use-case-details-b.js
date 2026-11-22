/* Lesson-style detail for use cases: Engineering and QA. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Engineering ---------- */
  "Writing code from a clear spec": {
    w: "You need a function that calculates late fees: 2% per full week, capped at 10%, with a three-day grace period. The rules are clear and written down. An assistant can write it in seconds; you need to know it's right.",
    f: "Well-specified, self-contained code is where assistants are strongest. Tests you write first are the check.",
    x: { i: "The rules, the function signature, and your test cases written before asking for the code.", o: "A clean function and its own tests, all passing.", c: "Your tests show day 7 returns 0%: the code started counting weeks after the grace period. The generated tests had encoded the same mistake. You fix the code and keep your tests." },
  },
  "Explaining unfamiliar code": {
    w: "You've inherited a 900-line billing module with no documentation, and a bug report about rounding. An assistant can explain what the code does far faster than reading it line by line.",
    f: "Explanations speed up understanding. They can be confidently wrong, so check key claims against the code or a quick test.",
    x: { i: "The module and a request to explain the rounding logic, quoting the lines it relies on.", o: "A clear explanation saying tax is rounded half-up at the invoice total.", c: "The quoted line rounds each line item, not the total. A two-line test confirms per-line rounding, which explains the bug report. The explanation was plausible and wrong on the key point." },
  },
  "Summarising a large pull request": {
    w: "A 1,400-line pull request lands for review late on Friday. An assistant can summarise what changed and where to look first.",
    f: "Summaries help you navigate. They aren't a review: the code still needs reading where it matters.",
    x: { i: "The diff and a request to summarise behaviour changes, listing anything touching auth, money or data deletion first.", o: "A neat summary of five changes, none flagged as risky.", c: "Reading the diff yourself, you find a changed permission check in a file the summary described as “refactoring”. You review that file line by line." },
  },
  "Scoped tasks for a coding agent": {
    w: "You want a coding agent to add rate limiting to one endpoint while you work on something else. Given an open-ended request, agents tend to keep going.",
    f: "Agents do well on bounded tasks with clear done criteria. Scope and limits are what keep the change reviewable.",
    x: { i: "A brief with goal, scope, done criteria and things not to change.", o: "A small diff on the one route, with tests, and a note that it stopped to ask about a missing config value.", c: "The test diff shows no edited assertions; one new dependency was avoided because the brief said so. The change is reviewable in ten minutes." },
  },
  "Large refactors and migrations": {
    w: "You need to move 200 files from an old logging library to a new one. An assistant or agent can make the mechanical changes far faster than you.",
    f: "Mechanical changes suit AI, but large diffs hide behaviour changes. Pin behaviour with tests and change in small steps.",
    x: { i: "A plan to migrate one folder at a time, with tests run after each.", o: "A first batch of 20 files, all compiling and tests passing.", c: "One file changed a log level from error to info, which would silence an alert. Small batches made it easy to spot. You add a check that log levels are preserved." },
  },
  "Debugging a production error": {
    w: "Error rates spike after a deploy. You paste the stack trace into an assistant, and it offers a confident fix within seconds.",
    f: "Use with care. AI suggests hypotheses quickly, but a fix that hides the symptom can bury the cause.",
    x: { i: "The stack trace, the deploy diff and relevant logs, with a request for ranked hypotheses and how to test each.", o: "A fix: add a null check where the error occurs.", c: "The null comes from a field renamed in the deploy. The null check would hide it and silently skip records. You fix the rename and add a test." },
  },
  "Security review of generated code": {
    w: "A teammate's PR includes a generated endpoint for downloading invoices. It's tidy and tested. You're reviewing it for security.",
    f: "Use with care. AI can flag common issues, but authorisation and business-logic flaws need your knowledge of the system.",
    x: { i: "The diff and a request to check it against OWASP's top API risks, citing lines.", o: "“No issues found. Input is validated and SQL is parameterised.”", c: "The endpoint checks the user is logged in, but not that the invoice belongs to them. Requesting another user's invoice ID returns it." },
  },
  "Approving a merge": {
    w: "A PR has a green build, an AI review summary saying “LGTM”, and a deadline. You're the approver.",
    f: "Keep human. Approval is accountability for what ships. AI can help you review; it can't take responsibility.",
    x: { i: "The PR, the AI summary and the build result.", o: "“Looks good to merge. Tests pass and the code follows conventions.”", c: "You read the test changes first and find an assertion was weakened. You ask for an explanation before approving." },
  },

  /* ---------- QA ---------- */
  "Test ideas for a new feature": {
    w: "A new “change email address” feature reaches QA. You want a broad list of test ideas fast, then to focus on what matters.",
    f: "Generating variations is a strength. The most important tests come from knowing the system's risks.",
    x: { i: "The feature description and your risk list, with a request for test ideas under each risk.", o: "64 test cases, mostly about email formats.", c: "Twenty format cases collapse into one data-driven test. The generated list missed that confirmation must go to the new address and a notice to the old one. You add those." },
  },
  "Generating test data": {
    w: "You need 500 realistic customer records for a staging environment, including edge cases like long names and unusual addresses.",
    f: "Synthetic data generation is a good fit, as long as no real personal data goes in and edge cases are deliberate.",
    x: { i: "The schema, rules for each field, and a list of edge cases to include.", o: "500 records that look realistic.", c: "None include names with apostrophes or non-Latin characters, which your users have. You ask for a specific mix and spot-check that no real-looking emails use real domains." },
  },
  "Converting manual cases to scripts": {
    w: "Your team has 120 manual regression cases in a spreadsheet. An assistant can turn them into automated end-to-end tests quickly.",
    f: "Good fit for the mechanical work. Check that each script asserts the outcome, not just that steps ran.",
    x: { i: "Ten manual cases with expected results, and your test framework's conventions.", o: "Ten scripts that pass.", c: "Four scripts click through the steps but never check the expected result. You add assertions on outcomes and move two validation checks to unit tests." },
  },
  "Building an eval set for an AI feature": {
    w: "Your team is shipping an AI summary feature. You need a way to know whether it's good enough, and whether the next model change makes it worse.",
    f: "AI can help draft rules and cases, but the eval set must come from real inputs and human judgement.",
    x: { i: "Sixty real anonymised tickets and a request to propose must and must-never rules for each.", o: "Rules for all sixty, many generic.", c: "You rewrite the rules for the hard cases: long threads, angry customers, personal data. You grade 20 outputs yourself to check the rules are workable." },
  },
  "Generating whole test suites": {
    w: "A developer asks an assistant to “write tests for this module” and gets 80 tests and 95% coverage in a minute.",
    f: "Use with care. High coverage from generated tests can hide that nothing important is checked.",
    x: { i: "The module and a request for a full test suite.", o: "80 passing tests, 95% line coverage.", c: "Mutation testing shows 40% of injected faults survive. Many tests assert only that functions return something. You keep the useful ones and write targeted tests for the business rules." },
  },
  "LLM-as-judge grading": {
    w: "Grading 500 AI outputs by hand takes days. A second model could grade them against your rubric in minutes.",
    f: "Use with care. Judges are useful at scale once validated against people, and biased in known ways.",
    x: { i: "Your rubric and 50 outputs already graded by two people.", o: "Judge grades for the 50.", c: "The judge agrees with people on 42, and favours longer answers. You add “length doesn't matter” to the rubric and re-test before using it on all 500." },
  },
  "Fixing failing tests": {
    w: "Five tests fail after a refactor. An assistant offers to “fix the tests” so the build goes green.",
    f: "Use with care. Changing tests to pass can hide the bug they were catching.",
    x: { i: "The failing tests and the diff, with a request to explain each failure before changing anything.", o: "Updated expectations for all five tests.", c: "Three were genuinely outdated; two caught a real bug in the refactor. You fix the code for those two." },
  },
  "Setting the release bar": {
    w: "The team wants to ship an AI feature next week. Someone needs to decide what results are good enough, and someone needs to own the decision.",
    f: "Keep human. Thresholds encode risk the business accepts; people must set and own them.",
    x: { i: "Eval results and a request to summarise them against last release.", o: "A clear summary and a suggestion that 91% is “likely acceptable”.", c: "The summary helps; the suggestion isn't the model's to make. The product owner and QA lead agree thresholds per eval set in advance and record them." },
  }
});
