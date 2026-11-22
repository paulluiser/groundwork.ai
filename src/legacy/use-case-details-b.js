/* Lesson-style detail for use cases: Engineering and QA. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Engineering ---------- */
  "Writing code from a clear spec": {
    w: "You need a function that calculates late fees: 2% per full week, capped at 10%, with a three-day grace period. The rules are clear and written down. An assistant can write it in seconds; you need to know it's right.",
    f: "Well-specified, self-contained code is where assistants are strongest. Tests you write first are the check.",
    x: { i: "The rules, the function signature, and your test cases written before asking for the code.", o: "A clean function and its own tests, all passing.", c: "Your tests show day 7 returns 0%: the code started counting weeks after the grace period. The generated tests had encoded the same mistake. You fix the code and keep your tests." },
    tk: { q: "Write test case names and expected results for a function that rounds prices to the nearest 5 cents.", m: "1.02 → 1.00; 1.03 → 1.05; 1.025 → decide (e.g. 1.05) and test it; 0.00 → 0.00; negative refunds (−1.03 → −1.05 or −1.00: decide); very large values (999999.97 → 999999.95); input already rounded (2.15 → 2.15).", r: ["Covers values just below and above a boundary", "Makes the midpoint rule explicit", "Covers zero and negative values", "Includes inputs already in the right form"] },
    q: { q: "Why write tests before asking the assistant for code?", a: 2, o: [["Assistants work faster with tests in the prompt.", "Speed isn't the reason."], ["It reduces the number of tokens used.", "Not the reason."], ["So the tests reflect your intent, not the code's behaviour.", "Right. Generated tests often confirm generated bugs."], ["Because tests are required by the assistant's terms of service for code.", "They aren't."]] }
  },
  "Explaining unfamiliar code": {
    w: "You've inherited a 900-line billing module with no documentation, and a bug report about rounding. An assistant can explain what the code does far faster than reading it line by line.",
    f: "Explanations speed up understanding. They can be confidently wrong, so check key claims against the code or a quick test.",
    x: { i: "The module and a request to explain the rounding logic, quoting the lines it relies on.", o: "A clear explanation saying tax is rounded half-up at the invoice total.", c: "The quoted line rounds each line item, not the total. A two-line test confirms per-line rounding, which explains the bug report. The explanation was plausible and wrong on the key point." },
    tk: { q: "Write the request you'd use to get an explanation of unfamiliar code you can verify.", m: "“Explain what calculateInvoice does, step by step. For each step, quote the lines it's based on. List anything you're unsure about, and any behaviour that seems surprising or unusual. Don't suggest changes.”", r: ["Asks for quoted lines for each claim", "Asks for uncertainties and surprises", "Keeps the task to explanation, not changes"] },
    q: { q: "What's the best way to confirm an AI's explanation of a function?", a: 0, o: [["Run a small test that exercises the behaviour it describes.", "Right. Behaviour beats description."], ["Ask the assistant whether it's sure.", "Not verification."], ["Check the explanation reads clearly.", "Clarity isn't correctness."], ["Ask a second assistant to explain the same function and compare answers.", "Two explanations can share a mistake."]] }
  },
  "Summarising a large pull request": {
    w: "A 1,400-line pull request lands for review late on Friday. An assistant can summarise what changed and where to look first.",
    f: "Summaries help you navigate. They aren't a review: the code still needs reading where it matters.",
    x: { i: "The diff and a request to summarise behaviour changes, listing anything touching auth, money or data deletion first.", o: "A neat summary of five changes, none flagged as risky.", c: "Reading the diff yourself, you find a changed permission check in a file the summary described as “refactoring”. You review that file line by line." },
    tk: { q: "List the parts of a large PR you'd always read yourself, whatever a summary says.", m: "Changes to authentication or authorisation; anything touching money or billing; data deletion or migrations; changed or removed tests; new dependencies; configuration and secrets; public API changes.", r: ["Includes auth and permissions", "Includes money and data changes", "Includes changed or removed tests", "Includes new dependencies"] },
    q: { q: "An AI summary describes a file as “refactoring only”. What should you check?", a: 3, o: [["Nothing, because refactors by definition never change any behaviour.", "That's the claim to verify."], ["The commit message.", "It describes intent, not effect."], ["The file's formatting.", "Not where risk lies."], ["Whether any behaviour, test or permission actually changed.", "Right."]] }
  },
  "Scoped tasks for a coding agent": {
    w: "You want a coding agent to add rate limiting to one endpoint while you work on something else. Given an open-ended request, agents tend to keep going.",
    f: "Agents do well on bounded tasks with clear done criteria. Scope and limits are what keep the change reviewable.",
    x: { i: "A brief with goal, scope, done criteria and things not to change.", o: "A small diff on the one route, with tests, and a note that it stopped to ask about a missing config value.", c: "The test diff shows no edited assertions; one new dependency was avoided because the brief said so. The change is reviewable in ten minutes." },
    tk: { q: "Write a brief for an agent to add pagination to one API endpoint.", m: "Goal: add cursor pagination to GET /v1/orders (max 100 per page). Scope: orders route and its tests only. Done when: requests without a cursor return the first page and a next cursor; tests cover first, middle and last pages; existing tests pass unchanged. Don't: change other routes, add dependencies, edit existing tests. Stop and ask if the ORM can't do cursor queries.", r: ["States a specific goal", "Limits scope to named files or routes", "Defines done with tests", "Lists what must not change", "Includes a stop-and-ask rule"] },
    q: { q: "Which instruction best protects against an agent hiding a bug?", a: 1, o: [["“Write clean, idiomatic, well-commented code.”", "Doesn't address hidden bugs."], ["“Don't edit or skip existing tests.”", "Right."], ["“Work quickly.”", "Unrelated."], ["“Use TypeScript.”", "Unrelated."]] }
  },
  "Large refactors and migrations": {
    w: "You need to move 200 files from an old logging library to a new one. An assistant or agent can make the mechanical changes far faster than you.",
    f: "Mechanical changes suit AI, but large diffs hide behaviour changes. Pin behaviour with tests and change in small steps.",
    x: { i: "A plan to migrate one folder at a time, with tests run after each.", o: "A first batch of 20 files, all compiling and tests passing.", c: "One file changed a log level from error to info, which would silence an alert. Small batches made it easy to spot. You add a check that log levels are preserved." },
    tk: { q: "Plan the first three steps of a large AI-assisted migration.", m: "1. Add tests that pin current behaviour where coverage is thin, and commit them alone. 2. Migrate one small folder; run tests and diff behaviour such as log output and API responses. 3. Review the diff for anything beyond the mechanical change, then repeat in batches of similar size.", r: ["Pins behaviour before changing it", "Works in small batches", "Checks behaviour, not just compilation", "Reviews each batch for non-mechanical changes"] },
    q: { q: "Why migrate in small batches with AI help?", a: 2, o: [["AI tools can only edit a few files at once before they lose track of the change.", "They can edit many."], ["It's cheaper.", "Not the main reason."], ["Behaviour changes are easier to spot in small diffs.", "Right."], ["It keeps the git history shorter.", "Not the reason."]] }
  },
  "Debugging a production error": {
    w: "Error rates spike after a deploy. You paste the stack trace into an assistant, and it offers a confident fix within seconds.",
    f: "Use with care. AI suggests hypotheses quickly, but a fix that hides the symptom can bury the cause.",
    x: { i: "The stack trace, the deploy diff and relevant logs, with a request for ranked hypotheses and how to test each.", o: "A fix: add a null check where the error occurs.", c: "The null comes from a field renamed in the deploy. The null check would hide it and silently skip records. You fix the rename and add a test." },
    tk: { q: "Write the request you'd send to an assistant during a production error.", m: "“Here's the stack trace, the last deploy's diff and 50 lines of logs around the first error. Give three hypotheses, ranked, each with the evidence in these files that supports it and a quick test to confirm or rule it out. Don't propose fixes yet.”", r: ["Provides evidence: trace, diff, logs", "Asks for hypotheses, not fixes", "Asks for supporting evidence", "Asks for tests to distinguish hypotheses"] },
    q: { q: "An assistant suggests adding a null check. What should you ask first?", a: 3, o: [["Whether the null check is idiomatic for this codebase.", "Style isn't the issue."], ["Whether tests still pass.", "They may pass while hiding the bug."], ["How long the fix takes.", "Not the key question."], ["Why the value is null in the first place.", "Right. Find the cause."]] }
  },
  "Security review of generated code": {
    w: "A teammate's PR includes a generated endpoint for downloading invoices. It's tidy and tested. You're reviewing it for security.",
    f: "Use with care. AI can flag common issues, but authorisation and business-logic flaws need your knowledge of the system.",
    x: { i: "The diff and a request to check it against OWASP's top API risks, citing lines.", o: "“No issues found. Input is validated and SQL is parameterised.”", c: "The endpoint checks the user is logged in, but not that the invoice belongs to them. Requesting another user's invoice ID returns it." },
    tk: { q: "List five things you'd check in a generated endpoint before approving it.", m: "Authorisation on every object (does this record belong to this user?); input validation; parameterised queries; secrets not in code or logs; new dependencies exist and are maintained; error messages don't leak internals; rate limiting on sensitive actions.", r: ["Checks object-level authorisation", "Checks input handling and injection", "Checks for secrets or data in logs", "Checks dependencies", "Checks error handling and limits"] },
    q: { q: "Which flaw is an AI security review most likely to miss?", a: 0, o: [["A missing check that the record belongs to the user.", "Right. It depends on your data model."], ["String-concatenated SQL.", "A common pattern it usually spots."], ["A hard-coded password.", "Usually spotted."], ["An outdated third-party library with a known, published CVE.", "Often flagged by tools."]] }
  },
  "Approving a merge": {
    w: "A PR has a green build, an AI review summary saying “LGTM”, and a deadline. You're the approver.",
    f: "Keep human. Approval is accountability for what ships. AI can help you review; it can't take responsibility.",
    x: { i: "The PR, the AI summary and the build result.", o: "“Looks good to merge. Tests pass and the code follows conventions.”", c: "You read the test changes first and find an assertion was weakened. You ask for an explanation before approving." },
    tk: { q: "Write your own short checklist for approving a pull request that was largely AI-generated.", m: "I understand what it does and could explain it. Tests cover the change, and no existing test was weakened. Scope matches the ticket. Dependencies and permissions are checked. I'd be comfortable being paged for it at 3 a.m.", r: ["Requires the approver to understand the change", "Checks tests weren't weakened", "Checks scope against the ticket", "Takes personal accountability"] },
    q: { q: "Who is responsible for a merged AI-generated change?", a: 1, o: [["The AI tool that generated it.", "Tools can't be accountable."], ["The people who wrote and approved it.", "Right."], ["Nobody, since no person actually wrote the code.", "Someone approved it."], ["The tool's vendor.", "Not for your code."]] }
  },

  /* ---------- QA ---------- */
  "Test ideas for a new feature": {
    w: "A new “change email address” feature reaches QA. You want a broad list of test ideas fast, then to focus on what matters.",
    f: "Generating variations is a strength. The most important tests come from knowing the system's risks.",
    x: { i: "The feature description and your risk list, with a request for test ideas under each risk.", o: "64 test cases, mostly about email formats.", c: "Twenty format cases collapse into one data-driven test. The generated list missed that confirmation must go to the new address and a notice to the old one. You add those." },
    tk: { q: "Write the risk list you'd draft before asking for test ideas for “reset password”.", m: "Account takeover via the reset link (expiry, reuse, guessable tokens); account enumeration (different messages for unknown emails); email sent to the wrong address; old sessions not ended; rate limiting; usability for users without access to the email.", r: ["Includes account takeover risks", "Includes enumeration or information leaks", "Includes session handling", "Includes abuse or rate limiting"] },
    q: { q: "What should come first when using AI for test ideas?", a: 0, o: [["Your own list of risks.", "Right. Then generate variations under each."], ["The longest possible list.", "Volume isn't coverage."], ["Automating every idea.", "Many are duplicates."], ["Asking the AI which tests matter most.", "It doesn't know your risks."]] }
  },
  "Generating test data": {
    w: "You need 500 realistic customer records for a staging environment, including edge cases like long names and unusual addresses.",
    f: "Synthetic data generation is a good fit, as long as no real personal data goes in and edge cases are deliberate.",
    x: { i: "The schema, rules for each field, and a list of edge cases to include.", o: "500 records that look realistic.", c: "None include names with apostrophes or non-Latin characters, which your users have. You ask for a specific mix and spot-check that no real-looking emails use real domains." },
    tk: { q: "Write the request for test data covering a user table, including edge cases.", m: "“Generate 200 users as CSV: name, email, country, date_of_birth. Include at least 10 names with apostrophes or hyphens, 10 in non-Latin scripts, 5 at the maximum field length, emails only on example.com, dates including 29 February and the oldest allowed age. No real people or real domains.”", r: ["Specifies the schema and format", "Lists edge cases explicitly", "Uses safe domains and no real people", "Includes boundary values"] },
    q: { q: "What's the main risk when generating test data with AI?", a: 2, o: [["The data is too random to look like real customers, so tests become unrealistic.", "Not usually."], ["It takes too long.", "It's fast."], ["Edge cases are missing unless you ask, or real data slips in.", "Right."], ["CSV formatting errors.", "Easy to fix."]] }
  },
  "Converting manual cases to scripts": {
    w: "Your team has 120 manual regression cases in a spreadsheet. An assistant can turn them into automated end-to-end tests quickly.",
    f: "Good fit for the mechanical work. Check that each script asserts the outcome, not just that steps ran.",
    x: { i: "Ten manual cases with expected results, and your test framework's conventions.", o: "Ten scripts that pass.", c: "Four scripts click through the steps but never check the expected result. You add assertions on outcomes and move two validation checks to unit tests." },
    tk: { q: "Review this converted case: it logs in, opens Settings, changes the display name, clicks Save, waits 2 seconds and asserts the Save button exists. What's wrong?", m: "It never checks the name changed. Assert the new name appears after reloading the page; replace the fixed wait with waiting for the success message; add a failure case for an invalid name.", r: ["Notices the missing outcome assertion", "Checks persistence after reload", "Replaces the fixed wait", "Adds a failure case"] },
    q: { q: "What makes a converted test actually useful?", a: 1, o: [["It runs without errors.", "Running isn't checking."], ["It asserts the expected outcome.", "Right."], ["It has a descriptive name.", "Helpful, but not enough."], ["It uses the newest framework version.", "Unrelated."]] }
  },
  "Building an eval set for an AI feature": {
    w: "Your team is shipping an AI summary feature. You need a way to know whether it's good enough, and whether the next model change makes it worse.",
    f: "AI can help draft rules and cases, but the eval set must come from real inputs and human judgement.",
    x: { i: "Sixty real anonymised tickets and a request to propose must and must-never rules for each.", o: "Rules for all sixty, many generic.", c: "You rewrite the rules for the hard cases: long threads, angry customers, personal data. You grade 20 outputs yourself to check the rules are workable." },
    tk: { q: "Write three eval cases (input summary, must, must never) for an AI that drafts replies to refund requests.", m: "1. Double charge for March: must acknowledge and state the refund policy; must never say a refund was issued. 2. Request outside the 30-day window: must explain the policy kindly; must never promise an exception. 3. Message includes card digits: must not repeat them; must never ask for full card details.", r: ["Uses realistic, varied inputs", "Each case has must and must-never rules", "Covers policy edge cases", "Includes a personal data case"] },
    q: { q: "Where should eval cases come from?", a: 3, o: [["The model's own suggestions.", "They drift from reality."], ["Public benchmarks.", "Not your users."], ["Only easy, typical cases, so you can measure a clean baseline first.", "Hard cases matter most."], ["Real inputs, including hard and risky cases.", "Right."]] }
  },
  "Generating whole test suites": {
    w: "A developer asks an assistant to “write tests for this module” and gets 80 tests and 95% coverage in a minute.",
    f: "Use with care. High coverage from generated tests can hide that nothing important is checked.",
    x: { i: "The module and a request for a full test suite.", o: "80 passing tests, 95% line coverage.", c: "Mutation testing shows 40% of injected faults survive. Many tests assert only that functions return something. You keep the useful ones and write targeted tests for the business rules." },
    tk: { q: "How would you judge whether a generated test suite is worth keeping?", m: "Read a sample of assertions: do they check meaningful outcomes? Run mutation testing on the module and see which faults survive. Check the business rules each have tests. Delete tests that only check implementation details or duplicate others.", r: ["Reads the assertions", "Uses mutation testing or deliberate bugs", "Maps tests to business rules", "Removes low-value tests"] },
    q: { q: "A generated suite has 95% coverage. What does that show?", a: 0, o: [["That code ran, not that behaviour was checked.", "Right."], ["That the module is correct.", "Coverage isn't correctness."], ["That no more tests are needed.", "Not necessarily."], ["That the tests will catch most bugs in this module.", "Mutation testing would tell you."]] }
  },
  "LLM-as-judge grading": {
    w: "Grading 500 AI outputs by hand takes days. A second model could grade them against your rubric in minutes.",
    f: "Use with care. Judges are useful at scale once validated against people, and biased in known ways.",
    x: { i: "Your rubric and 50 outputs already graded by two people.", o: "Judge grades for the 50.", c: "The judge agrees with people on 42, and favours longer answers. You add “length doesn't matter” to the rubric and re-test before using it on all 500." },
    tk: { q: "Describe how you'd validate an LLM judge before trusting it.", m: "Have people grade 50–100 outputs against the rubric. Run the judge on the same set and measure agreement. Inspect disagreements for patterns (length, position, style). Adjust the rubric or prompt, re-test, and keep sampling judge grades against people over time.", r: ["Compares judge grades with human grades", "Looks for patterns in disagreements", "Re-tests after changes", "Keeps checking after rollout"] },
    q: { q: "What's a known bias of LLM judges?", a: 2, o: [["They always grade too harshly compared with people.", "Not consistently."], ["They can't read rubrics.", "They can."], ["Favouring longer or first-presented answers.", "Right."], ["Refusing to grade.", "Rare."]] }
  },
  "Fixing failing tests": {
    w: "Five tests fail after a refactor. An assistant offers to “fix the tests” so the build goes green.",
    f: "Use with care. Changing tests to pass can hide the bug they were catching.",
    x: { i: "The failing tests and the diff, with a request to explain each failure before changing anything.", o: "Updated expectations for all five tests.", c: "Three were genuinely outdated; two caught a real bug in the refactor. You fix the code for those two." },
    tk: { q: "Write the rule your team should follow when AI suggests changing a failing test.", m: "Before changing a failing test, state why it fails and whether the old expectation was right. If the test caught a real behaviour change, fix the code or get the change approved. Changed assertions are called out in the PR description.", r: ["Requires explaining the failure first", "Distinguishes outdated tests from real bugs", "Requires changed assertions to be visible in review"] },
    q: { q: "A test fails after a refactor. What should you ask first?", a: 1, o: [["How to make it pass quickly so the build goes green.", "That may hide a bug."], ["Whether the old expectation was correct.", "Right."], ["Whether to delete it.", "Not first."], ["Which model to use.", "Irrelevant."]] }
  },
  "Setting the release bar": {
    w: "The team wants to ship an AI feature next week. Someone needs to decide what results are good enough, and someone needs to own the decision.",
    f: "Keep human. Thresholds encode risk the business accepts; people must set and own them.",
    x: { i: "Eval results and a request to summarise them against last release.", o: "A clear summary and a suggestion that 91% is “likely acceptable”.", c: "The summary helps; the suggestion isn't the model's to make. The product owner and QA lead agree thresholds per eval set in advance and record them." },
    tk: { q: "Write a release bar for an AI feature, with who decides borderline cases.", m: "Quality set ≥ 93% and no more than 2 points below current. Policy set 100% (blocking). Red-team set: no data leaks (blocking). Latency within 20%. Borderline results: QA lead and product owner decide together and record the reason in the release notes.", r: ["Sets thresholds before results", "Marks some failures as blocking", "Covers quality, safety and performance", "Names who decides borderline cases"] },
    q: { q: "Who should set the release bar for an AI feature?", a: 3, o: [["The model vendor.", "Doesn't know your risks."], ["The AI tool, based on results.", "It can summarise, not decide."], ["Whoever happens to run the evals on release day.", "Too ad hoc."], ["Named people, agreed before results.", "Right."]] }
  }
});
