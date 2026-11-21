/* Step-by-step guides for each use case, keyed by the use case title in use-cases.js.
   s: steps, y: do, n: don’t, t: tip, k: limits and constraints, p: a prompt to start from (optional). */
GW.ucGuides = GW.ucGuides || {};
Object.assign(GW.ucGuides, {
  /* ---------- Product ---------- */
  "Synthesising interview notes": {
    s: ["Remove names, emails and company details from the transcripts, or use a tool approved for customer data.", "Give the model every transcript, each labelled with a participant ID.", "Ask for themes with a count of participants and the IDs behind each one, plus direct quotes.", "Open at least three quoted passages per theme and confirm they say what the theme claims.", "Rewrite the themes in your own words, keeping the counts, before sharing."],
    y: ["Ask for disagreements and minority views as a separate list.", "Keep the participant count next to every theme.", "Note which interviews were with prospects and which with customers."],
    n: ["Share a theme you haven’t traced to transcripts.", "Let “several people” become “customers say”.", "Paste transcripts into an unapproved tool."],
    t: "Ask the model what evidence would contradict each theme. It often surfaces the quiet outliers.",
    k: ["Summaries flatten emphasis: one passionate participant can read like many.", "It can only find themes in what you gave it, not in interviews you didn’t run."],
    p: "Here are 8 interview transcripts, each labelled P1–P8. Group what participants said into themes. For each theme give: a one-line name, the participant IDs who raised it, the count, and two direct quotes with IDs. List contradicting views separately. Don’t add anything that isn’t in the transcripts."
  },
  "Drafting acceptance criteria": {
    s: ["Write the user story and the problem it solves in your own words.", "Add the constraints you already know: roles, limits, data rules, platforms.", "Ask for criteria in Given / When / Then form, including error and edge cases.", "Mark every criterion that makes a decision you haven’t made, and turn it into an open question.", "Review with engineering and QA: can each one be tested as written?"],
    y: ["Ask for a list of assumptions the model made.", "Replace vague words like “fast” with numbers the team agrees.", "Keep criteria about behaviour, not implementation."],
    n: ["Accept criteria that quietly decide product questions.", "Copy invented formats, limits or defaults without checking.", "Skip the review with the people who will test it."],
    t: "Ask “which of these criteria could two engineers read differently?”. It finds ambiguity quickly.",
    k: ["It doesn’t know your users, contracts or existing behaviour unless you supply them."],
    p: "Story: [paste]. Constraints: [paste]. Write acceptance criteria in Given/When/Then form, covering the main path, errors, permissions and edge cases. After the list, give every assumption you made and every product decision you had to guess."
  },
  "Comparing competitor pages you supply": {
    s: ["Save or copy the current pricing and feature pages for each competitor, with the date.", "Paste them in and ask for a comparison table limited to what the pages say.", "Ask it to mark any cell it couldn’t find on a page as “not stated”.", "Spot-check every figure against the page you saved.", "Add your own analysis of what the differences mean."],
    y: ["Keep the page URL and capture date with the table.", "Compare like for like: same plan tier, same billing period."],
    n: ["Let it fill gaps from what it remembers. Memory is stale and often wrong.", "Present the table as complete market research."],
    t: "Ask for the exact sentence from each page that supports each cell. Missing sentences show invented cells.",
    k: ["Pricing pages change often and hide enterprise terms.", "It can’t see behind sign-up walls or sales calls."],
    p: "Below are the pricing pages of three products, captured today. Build a table comparing plans, prices, seat limits and the five features listed. Use only these pages. If something isn’t stated, write “not stated”. After the table, quote the sentence behind each price."
  },
  "Writing a first spec draft": {
    s: ["Collect your notes, research findings, constraints and any decisions already made.", "Ask for a spec in your team’s template, with an “Open questions” section.", "Read it once only for invented content: numbers, behaviours or requirements you never gave it.", "Move anything it decided that you hadn’t into open questions.", "Rewrite the problem statement and success measures yourself."],
    y: ["Give it your template so the structure matches.", "Label which parts are decided and which are proposals."],
    n: ["Circulate the draft as if it were reviewed.", "Let filler sections hide that a decision is missing."],
    t: "Ask it to list everything in the spec that isn’t traceable to your notes.",
    k: ["A tidy spec can make unresolved questions look settled."],
    p: "Using the template and notes below, draft a spec. Don’t invent requirements, numbers or behaviours: where my notes are silent, add an item to Open questions instead. End with a list of every assumption you made."
  },
  "Structuring a market sizing": {
    s: ["Decide top-down, bottom-up or both, and the market definition you’ll use.", "Ask the model to lay out the segments, steps and formula, with every input left blank.", "Fill each input from a source you can cite, with its date.", "Calculate a low, middle and high case.", "Name the two or three assumptions that move the result most."],
    y: ["Use the model for structure and for questions you hadn’t considered.", "Keep the spreadsheet with sources beside every number."],
    n: ["Use any figure the model offers from memory.", "Present a single precise number."],
    t: "Ask it to argue why your estimate is too high. It’s good at finding double counting.",
    k: ["Models confidently produce market figures that sound real and aren’t."],
    p: "I’m sizing the market for [product] in [region]. Lay out a bottom-up sizing as steps with formulas. Leave every input blank and say what kind of source would supply it. Don’t provide any numbers."
  },
  "Rehearsing with synthetic users": {
    s: ["Write your interview guide first.", "Ask the model to play a customer with a short, realistic background.", "Run through the guide and note questions that were leading, double-barrelled or confusing.", "Revise the guide.", "Run real interviews with the revised guide."],
    y: ["Use it to practise follow-up questions and silence.", "Try a sceptical persona as well as a friendly one."],
    n: ["Quote a synthetic user in research findings.", "Use it to decide what customers need."],
    t: "Ask the persona to answer only in short, vague replies. It’s good practice for probing.",
    k: ["Simulated customers reflect the model’s training, not your market."]
  },
  "Defining “good” for an AI feature": {
    s: ["Collect 30 to 100 real inputs the feature will face, including hard ones.", "Ask the model to suggest criteria for a good output, then edit them with the team.", "Write or agree the ideal output, or a pass/fail judgment, for each example.", "Agree a pass rate the feature must meet before launch.", "Add new failures to the set as you find them."],
    y: ["Include cases where the right answer is “I don’t know” or a handoff.", "Have two people label a sample independently and compare."],
    n: ["Build the set only from examples the model invented.", "Change the criteria after seeing results to make them pass."],
    t: "Start small. Twenty well-chosen real cases beat two hundred synthetic ones.",
    k: ["A good eval score on unrepresentative cases tells you little about real use."]
  },
  "Choosing what to build next": {
    s: ["Write down the options and your criteria, with weights the team agrees.", "Ask the model to score options against the criteria and explain each score.", "Ask it to argue against your top pick.", "Check every factual claim in its reasoning.", "Decide in the team meeting, and record why."],
    y: ["Use it to surface missing criteria and risks.", "Keep the decision and the reasoning in your own words."],
    n: ["Treat its ranking as the answer.", "Let a scored table replace a conversation about strategy."],
    t: "Ask “what would have to be true for the lowest-ranked option to be the best?”.",
    k: ["It doesn’t know your strategy, politics, team capacity or commitments unless you say so."]
  },

  /* ---------- Design ---------- */
  "Exploring layout options": {
    s: ["Describe the screen’s job, its users and the real content, including long and empty cases.", "Ask for several distinct directions, not one polished answer.", "Pick the directions worth exploring and redo them in your design system.", "Test with real content lengths and states.", "Throw away the generated versions."],
    y: ["Give real copy and data, not lorem ipsum.", "Ask for directions that differ in structure, not just style."],
    n: ["Ship generated layouts without checking the design system.", "Judge options on the happy path only."],
    t: "Ask for the layout that would serve a first-time user best, then for a power user. Comparing them shows the trade-offs.",
    k: ["Generated UI often ignores your components, spacing and accessibility rules."]
  },
  "Writing interface copy variants": {
    s: ["Give the context: the screen, what just happened, what the user needs next.", "Supply your voice guidelines and the terms your product uses.", "Ask for variants in two or three tones, with character counts.", "Read each one in the real screen.", "Check length in every supported language."],
    y: ["Keep terminology consistent with the rest of the product.", "Put the next action in the button label."],
    n: ["Use cheerful copy for errors involving money or data.", "Trust its character counts. Count them yourself."],
    t: "Ask for the shortest version that still tells the user what to do next.",
    k: ["Models count characters badly because they work in tokens."],
    p: "Context: a user’s payment just failed because the card was declined. Nothing was charged. Write 5 versions of the title, body and button label. Plain, calm, no apology filler, no exclamation marks. Use the terms “card” and “payment”."
  },
  "Throwaway prototypes": {
    s: ["Decide the question the prototype must answer.", "Generate only the screens and paths needed for that question.", "Use realistic data and copy.", "Tell participants it’s a prototype.", "Delete it after the study, or label it clearly."],
    y: ["Keep it rough enough that people comment on the flow, not the polish.", "Record what you learned against the original question."],
    n: ["Let prototype code drift into production.", "Put real customer data into a prototype tool."],
    t: "A prototype that answers one question well beats one that looks finished.",
    k: ["Generated prototypes can hide accessibility and performance problems that the real build will have."]
  },
  "Tagging research sessions": {
    s: ["Agree a starting tag list with the team.", "Give the model notes or transcripts with session IDs and timestamps.", "Ask for tags with the session and timestamp behind each.", "Replay a sample of tagged moments.", "Merge, split or rename tags yourself."],
    y: ["Keep every quote linked to a session and timestamp.", "Track how many sessions each tag appears in."],
    n: ["Use a quote you can’t find in the recording.", "Let new tags appear without anyone deciding they’re useful."],
    t: "Ask it to flag moments that didn’t fit any tag. They’re often the interesting ones.",
    k: ["Transcripts miss what people did on screen."]
  },
  "Accessibility claims": {
    s: ["Use the model to list what to check: contrast, focus order, labels, target sizes, motion.", "Measure contrast with a contrast checker.", "Tab through the real build with a keyboard.", "Test with a screen reader on at least one platform.", "Record results against WCAG success criteria."],
    y: ["Treat its comments as a checklist, not results.", "Test with disabled users where you can."],
    n: ["Repeat a contrast ratio it estimated from a screenshot.", "Claim compliance from an AI review."],
    t: "Ask for the WCAG success criterion behind each comment, then read the criterion yourself.",
    k: ["It can’t perceive your interface; it estimates from descriptions or images."]
  },
  "Designing an AI feature's interface": {
    s: ["List how the feature can fail: wrong, incomplete, slow, unavailable.", "Ask for interface patterns for sources, uncertainty, correction and undo.", "Sketch the failure states before the happy path.", "Test with users whether they check outputs when they should.", "Adjust based on observed behaviour."],
    y: ["Make correcting the AI faster than redoing the task.", "Show where an answer came from."],
    n: ["Add a blanket disclaimer and call it done.", "Hide that content was generated."],
    t: "Watch what users do when the AI is wrong in a test session. It tells you more than any guideline.",
    k: ["Patterns help, but trust has to be measured with real users."]
  },
  "Summarising usability findings for stakeholders": {
    s: ["Give your notes with session IDs and task results.", "Ask for a short readout: top issues, how many participants hit each, severity.", "Check every count against your notes.", "Add clips or quotes you’ve verified.", "Write the recommendations yourself."],
    y: ["Use exact counts: “4 of 6”.", "Separate observations from interpretations."],
    n: ["Let “some” become “most”.", "Include satisfaction claims you didn’t measure."],
    t: "Ask the model which findings rest on a single participant.",
    k: ["Summaries tend to smooth over how badly a few people struggled."]
  },
  "Deciding which findings matter": {
    s: ["List the findings with frequency and severity from your notes.", "Ask the model to rank them by those two and explain.", "Add what it can’t know: strategy, effort, upcoming work.", "Decide the priorities with product and engineering."],
    y: ["Use the ranking to start the discussion."],
    n: ["Hand the ranking over as the decision."],
    t: "Ask which low-ranked finding would be most expensive to ignore.",
    k: ["Prioritising needs context the notes don’t contain."]
  },

  /* ---------- Engineering ---------- */
  "Writing code from a clear spec": {
    s: ["Write the spec with inputs, outputs, errors and two or three concrete examples.", "Turn the examples into tests first.", "Give the model the spec, the tests and the surrounding code it must fit.", "Run the tests, then read every line.", "Verify any new dependency exists and is the one you meant."],
    y: ["Ask for small functions you can read in one go.", "Include the forbidden and error cases in the tests."],
    n: ["Accept code that only passes tests the model wrote.", "Install a package without checking its name and maintainer."],
    t: "Ask the model what inputs would break its implementation, then add those as tests.",
    k: ["It writes to the most common pattern, which may not match your codebase’s conventions."],
    p: "Implement the function below. Spec: [paste]. It must pass these tests: [paste]. Match the style of this existing module: [paste]. Don’t add dependencies. After the code, list edge cases you handled and any you didn’t."
  },
  "Explaining unfamiliar code": {
    s: ["Give the module and the code that calls it.", "Ask for an explanation of what it does, with line references.", "Pick the claims that matter most for your change.", "Confirm each by running the code or writing a test.", "Write down what you confirmed for the next person."],
    y: ["Ask what the code assumes about its inputs.", "Ask where side effects happen."],
    n: ["Rely on an explanation you haven’t tested before changing the code."],
    t: "Ask for a test that would fail if the explanation were wrong.",
    k: ["Explanations describe what code seems to do; old code often does something odd on purpose."]
  },
  "Summarising a large pull request": {
    s: ["Give the full diff and the PR description.", "Ask for a map: what changed, by area, and where risk concentrates.", "Use the map to plan your review order.", "Review the code itself, starting with the riskiest parts.", "Check changed tests and permission logic line by line."],
    y: ["Ask it to list changed test assertions separately."],
    n: ["Approve based on the summary."],
    t: "Ask “which change in this diff is most likely to cause an incident?”.",
    k: ["Summaries skip small changes, which is where serious bugs often hide."]
  },
  "Scoped tasks for a coding agent": {
    s: ["Write a task with clear done criteria and the tests that prove it.", "Give the agent a branch, limited directories and no production credentials.", "Let it run tests and iterate.", "Review the full diff, including any changes to tests.", "Merge through the normal review process."],
    y: ["Keep an instructions file with build and test commands in the repo.", "Cap time or steps."],
    n: ["Give an agent secrets it doesn’t need.", "Accept a diff where tests were weakened to pass."],
    t: "Small, repeatable tasks first: dependency bumps, test additions, mechanical renames.",
    k: ["Agents read untrusted text such as issues and logs, which can carry injected instructions."]
  },
  "Large refactors and migrations": {
    s: ["Pin current behaviour with tests before changing anything.", "Split the change into small, reviewable steps.", "Let the model apply each step; run the full suite after each.", "Review each step’s diff.", "Treat any changed test as a red flag that needs explaining."],
    y: ["Use codemods or compiler tools where they exist; they’re deterministic.", "Keep a rollback plan for each step."],
    n: ["Do the whole migration in one generated diff.", "Trust that “it compiles” means it works."],
    t: "Ask for a list of places the mechanical rule might not apply. Review those by hand.",
    k: ["Consistency across thousands of lines is hard to verify by reading."]
  },
  "Debugging a production error": {
    s: ["Collect the stack trace, relevant logs, recent deploys and what changed.", "Ask for ranked hypotheses with the evidence for and against each.", "Test the top hypotheses against the data, cheapest first.", "Fix the confirmed cause, not the first suggestion.", "Add a test or alert that would catch it next time."],
    y: ["Give timestamps: when it started matters.", "Say what you’ve ruled out."],
    n: ["Roll back or restart because the model said so, without evidence.", "Paste secrets or customer data from logs."],
    t: "Ask “what evidence would prove this hypothesis wrong?” for each.",
    k: ["It sees only the logs you paste, not the rest of your system."]
  },
  "Security review of generated code": {
    s: ["Run your usual static analysis and dependency scanning.", "Ask the model to review the diff for injection, authorization, secrets and unsafe input handling.", "Verify each finding by reading the code path.", "Reproduce serious findings safely.", "Add tests for confirmed issues."],
    y: ["Ask specifically about authorization: who can call this, and what can they reach?"],
    n: ["Treat a clean AI review as a security sign-off."],
    t: "Ask it to write the request an attacker would send. Then try it in a test environment.",
    k: ["It misses issues that depend on how your system is configured or deployed."]
  },
  "Approving a merge": {
    s: ["Use AI comments as input to your review.", "Read the diff yourself.", "Check tests, risk and rollout plan.", "Approve or request changes in your own name."],
    y: ["Treat AI comments like a junior reviewer’s."],
    n: ["Set up automatic approval from an AI review."],
    t: "If you can’t explain why the change is safe, you’re not ready to approve it.",
    k: ["Approval is accountability. A tool can’t carry it."]
  },

  /* ---------- QA ---------- */
  "Test ideas for a new feature": {
    s: ["Give the spec, acceptance criteria and known risky areas.", "Ask for scenarios grouped by happy path, boundaries, negative cases, permissions and failure.", "Remove duplicates and padding.", "Rank by likelihood and impact.", "Turn the top ideas into tests."],
    y: ["Ask for boundary values with the exact numbers.", "Add ideas from past bugs in this area."],
    n: ["Treat a long list as good coverage."],
    t: "Ask “what would a malicious user try?” as a separate prompt.",
    k: ["It doesn’t know where your system has broken before."],
    p: "Here’s the spec for [feature]: [paste]. List test ideas grouped as: main paths, boundary values (with exact values), invalid input, permissions, concurrency and failure of dependencies. Mark the five you think are highest risk and say why."
  },
  "Generating test data": {
    s: ["Describe the schema and rules the data must follow.", "Ask for varied data: unicode, long strings, empty values, boundaries.", "Generate with a script you can rerun, not a one-off paste.", "Check the data against the schema.", "Keep it free of real personal data."],
    y: ["Ask for the edge cases explicitly.", "Seed random generation so tests are repeatable."],
    n: ["Copy production data into prompts to “make it realistic”."],
    t: "Ask for names and addresses from many countries. It catches encoding bugs.",
    k: ["Generated data can look realistic while missing the odd cases real data has."]
  },
  "Converting manual cases to scripts": {
    s: ["Give the manual steps, the expected results and your framework’s conventions.", "Ask for scripts using stable selectors (roles, test IDs).", "Run each script.", "Break the feature on purpose to check each test fails.", "Review for assertions that actually check the expected result."],
    y: ["Map each manual expected result to an assertion."],
    n: ["Accept tests that only check the page loaded."],
    t: "Ask it to point out manual steps whose expected result is too vague to automate.",
    k: ["Generated scripts often use brittle selectors copied from the HTML."]
  },
  "Building an eval set for an AI feature": {
    s: ["Collect real inputs from logs, tickets or research.", "Ask the model to propose categories so the set covers the spread.", "Write or agree the expected outcome for each case.", "Have two people label a sample and compare.", "Run the set on every prompt or model change."],
    y: ["Include adversarial cases and cases that need a refusal or handoff."],
    n: ["Fill the set with synthetic cases only."],
    t: "Track the eval set in version control alongside the prompt.",
    k: ["An eval set is only as good as how well it matches real use."]
  },
  "Generating whole test suites": {
    s: ["Decide what must be tested before generating anything.", "Generate in small batches, per behaviour.", "Read every assertion.", "Run mutation testing or break the code to see which tests catch faults.", "Delete tests that don’t check anything."],
    y: ["Measure fault detection, not just coverage."],
    n: ["Chase a coverage number with generated tests."],
    t: "A small suite that catches real faults beats a large one that only executes code.",
    k: ["Generated tests often assert whatever the code currently does, bugs included."]
  },
  "LLM-as-judge grading": {
    s: ["Write a clear rubric with examples of each score.", "Have people grade a sample.", "Run the judge on the same sample and compare agreement.", "Adjust the rubric until agreement is acceptable.", "Re-check agreement whenever the judge model changes."],
    y: ["Ask the judge for its reason, then audit a sample of reasons."],
    n: ["Use the same model to generate and judge without calibration."],
    t: "Judges tend to prefer longer answers. Check for that bias in your sample.",
    k: ["Judge scores drift when the judge model is updated."]
  },
  "Fixing failing tests": {
    s: ["Read the failure and decide: is the code wrong or the test wrong?", "If the code is wrong, fix the code.", "If the test is wrong, explain why in the commit.", "Review any AI change to an assertion line by line."],
    y: ["Ask the model to explain the failure before proposing a fix."],
    n: ["Accept a change that weakens an assertion to make it pass."],
    t: "A test that suddenly fails after a feature change is often right.",
    k: ["The easiest way to make a test pass is to make it check less."]
  },
  "Setting the release bar": {
    s: ["Use AI to summarise test results, open bugs and risk areas.", "Check the summary against the raw results.", "Decide the release with the people accountable for it.", "Record the decision and known risks."],
    y: ["Name the risks you’re accepting."],
    n: ["Let a generated “ready to release” stand in for a decision."],
    t: "Ask for the three open issues most likely to reach customers.",
    k: ["A summary can’t weigh business risk you didn’t give it."]
  }
});
