/* Use cases for the Use cases tab: about eight per role.
   Each entry: { r: role id, t: title, fit: "good" | "care" | "human", d: what AI does, c: what to check, l: lesson id }.
   The tab stays hidden while this list is empty. */
GW.useCases = [
  /* Product */
  { r: "product", t: "Synthesising interview notes", fit: "good", d: "Groups transcripts into themes, with a count and the participant IDs behind each one.", c: "Open three cited passages per theme, and make sure a few loud voices haven't become “customers say”.", l: "product-discovery" },
  { r: "product", t: "Drafting acceptance criteria", fit: "good", d: "Turns a user story into testable criteria, including edge cases and error states.", c: "Engineering and QA confirm each criterion can be tested and matches what you meant.", l: "product" },
  { r: "product", t: "Comparing competitor pages you supply", fit: "good", d: "Builds a side-by-side comparison of pricing and features from pages you paste in.", c: "Every figure traces to a page you can open today. Drop anything it added from memory.", l: "product-discovery" },
  { r: "product", t: "Writing a first spec draft", fit: "good", d: "Turns your notes, research and constraints into a structured spec with open questions listed.", c: "Check that open questions didn't quietly become decisions, and that nothing was invented to fill gaps.", l: "product" },
  { r: "product", t: "Structuring a market sizing", fit: "care", d: "Lays out segments, steps and assumptions for a top-down or bottom-up estimate.", c: "Fill every input from a source you can cite, and present a range with the assumptions that move it most.", l: "product-discovery" },
  { r: "product", t: "Rehearsing with synthetic users", fit: "care", d: "Plays a simulated customer so you can practise an interview guide.", c: "Use it to sharpen questions only. It's not evidence of what real customers need.", l: "product-discovery" },
  { r: "product", t: "Defining “good” for an AI feature", fit: "care", d: "Suggests criteria and example cases for an eval set before launch.", c: "Build the set from real examples, and have people agree the criteria and the pass rate.", l: "product-ai-features" },
  { r: "product", t: "Choosing what to build next", fit: "human", d: "Can score options against your criteria and argue against your top pick.", c: "The decision weighs strategy, cost and people. Use the output to sharpen the discussion, not settle it.", l: "product-discovery" },

  /* Design */
  { r: "design", t: "Exploring layout options", fit: "good", d: "Generates several quick directions for a screen so you can react to them.", c: "Treat them as sketches. Check against your design system and real content lengths.", l: "design" },
  { r: "design", t: "Writing interface copy variants", fit: "good", d: "Drafts button labels, error messages and empty states in a few tones.", c: "Read them in context, check length in every language you support, and keep terms consistent.", l: "design" },
  { r: "design", t: "Throwaway prototypes", fit: "good", d: "Builds a clickable prototype quickly to test a flow with users.", c: "Make sure participants know it's a prototype, and don't let prototype code become production.", l: "design-research" },
  { r: "design", t: "Tagging research sessions", fit: "good", d: "Suggests tags and themes across usability session notes.", c: "Every quote you use traces to a session and a timestamp you can replay.", l: "design-research" },
  { r: "design", t: "Accessibility claims", fit: "care", d: "Comments on contrast, focus order and labels from a description or screenshot.", c: "Measure contrast with a tool and test with a keyboard and screen reader. Don't repeat a ratio it estimated.", l: "design" },
  { r: "design", t: "Designing an AI feature's interface", fit: "care", d: "Suggests patterns for showing sources, uncertainty and undo.", c: "Test with users whether they trust it the right amount: checking when they should, not always or never.", l: "design-ai-ux" },
  { r: "design", t: "Summarising usability findings for stakeholders", fit: "care", d: "Turns session notes into a short readout with key issues.", c: "Check severity and counts against your notes. Summaries tend to flatten how many people struggled.", l: "design-research" },
  { r: "design", t: "Deciding which findings matter", fit: "human", d: "Can rank issues by frequency and severity on request.", c: "Prioritising needs context about users, strategy and effort that the notes don't contain.", l: "design-research" },

  /* Engineering */
  { r: "engineering", t: "Writing code from a clear spec", fit: "good", d: "Implements a function or endpoint from a spec with examples.", c: "Run the tests, read the code, and verify any new dependency actually exists.", l: "engineering" },
  { r: "engineering", t: "Explaining unfamiliar code", fit: "good", d: "Reads a legacy module and explains what it seems to do.", c: "Confirm key claims by running the code or writing a test that would fail if the explanation were wrong.", l: "engineering-review" },
  { r: "engineering", t: "Summarising a large pull request", fit: "good", d: "Gives a reviewer a map of what changed and where to look first.", c: "Review the code, not the summary. Look hardest at authorization and changed test assertions.", l: "engineering-review" },
  { r: "engineering", t: "Scoped tasks for a coding agent", fit: "good", d: "Makes a well-defined change across several files, runs tests and iterates.", c: "Small scope, clear done criteria, limited permissions, and a full review of the diff.", l: "engineering-agents" },
  { r: "engineering", t: "Large refactors and migrations", fit: "care", d: "Applies a mechanical change consistently across a codebase.", c: "Pin behaviour with tests first, change in small steps, and treat any changed test as a red flag.", l: "engineering-review" },
  { r: "engineering", t: "Debugging a production error", fit: "care", d: "Suggests hypotheses from a stack trace and logs.", c: "Ask why before accepting a fix. A null check or retry can hide the real cause.", l: "engineering" },
  { r: "engineering", t: "Security review of generated code", fit: "care", d: "Flags likely vulnerabilities in a diff.", c: "It misses what isn't in the diff. Check authorization, input handling and new packages yourself.", l: "engineering-review" },
  { r: "engineering", t: "Approving a merge", fit: "human", d: "Can comment on code and suggest approval.", c: "Someone who understands the change has to own it. “The AI reviewed it” isn't an owner.", l: "engineering-review" },

  /* QA */
  { r: "qa", t: "Test ideas for a new feature", fit: "good", d: "Lists scenarios, boundary values and negative cases from a spec.", c: "Add the cases only you know from history, and prioritise by risk.", l: "qa" },
  { r: "qa", t: "Generating test data", fit: "good", d: "Produces realistic, varied data including edge-case strings and values.", c: "Never paste real customer data in to make it realistic.", l: "qa-automation" },
  { r: "qa", t: "Converting manual cases to scripts", fit: "good", d: "Turns written test steps into automated test code.", c: "Check every expected result became an assertion, and remove fixed waits.", l: "qa-automation" },
  { r: "qa", t: "Building an eval set for an AI feature", fit: "good", d: "Helps structure real cases with criteria for a good answer.", c: "Use real inputs, agree criteria with two people, and set the pass rate before running it.", l: "qa-ai-features" },
  { r: "qa", t: "Generating whole test suites", fit: "care", d: "Writes many tests quickly to raise coverage.", c: "Break the code each test protects and confirm it fails. Coverage alone proves little.", l: "qa-automation" },
  { r: "qa", t: "LLM-as-judge grading", fit: "care", d: "Grades AI feature outputs against a rubric at scale.", c: "Measure its agreement with human grades first, and recheck when you change the grader.", l: "qa-ai-features" },
  { r: "qa", t: "Fixing failing tests", fit: "care", d: "Proposes a change to make a red test pass.", c: "Ask why it fails first. Assistants often change the assertion to match the bug.", l: "qa-automation" },
  { r: "qa", t: "Setting the release bar", fit: "human", d: "Can summarise test results and risk.", c: "Whether quality is good enough to ship is a risk decision with an accountable owner.", l: "qa-ai-features" },

  /* Delivery */
  { r: "delivery", t: "Drafting the weekly status report", fit: "good", d: "Turns tracker data and notes into a readable update.", c: "Every number traces to the tracker, and risks keep their real status.", l: "delivery" },
  { r: "delivery", t: "Splitting large stories", fit: "good", d: "Suggests thin slices that each deliver something a user can see.", c: "Take them to refinement as options. The team checks slices are really independent.", l: "delivery-flow" },
  { r: "delivery", t: "Finding duplicate and stale tickets", fit: "good", d: "Reads a large backlog and flags likely duplicates and dead tickets.", c: "A person decides what to close or merge.", l: "delivery-flow" },
  { r: "delivery", t: "Grouping written retro feedback", fit: "good", d: "Sorts anonymous comments into themes with counts.", c: "Read every comment yourself, and paraphrase anything that could identify someone.", l: "delivery-rituals" },
  { r: "delivery", t: "Meeting notes and actions", fit: "care", d: "Produces a summary and action list from a recorded meeting.", c: "Confirm each action with its owner before sending. Suggestions can become “commitments”.", l: "delivery-rituals" },
  { r: "delivery", t: "Reading flow metrics", fit: "care", d: "Calculates lead time and throughput trends and explains changes.", c: "Ask the team for causes, and never use the metrics to rank teams or people.", l: "delivery-flow" },
  { r: "delivery", t: "Mapping cross-team dependencies", fit: "care", d: "Finds likely dependencies from ticket text across teams.", c: "Each is a question to confirm with the other team, with a date.", l: "delivery-flow" },
  { r: "delivery", t: "Recording retrospectives", fit: "human", d: "A notetaker could record and summarise the retro.", c: "Default to no recording. Any consent has to be easy to refuse.", l: "delivery-rituals" },

  /* Project management */
  { r: "project-management", t: "Work breakdown from workshop notes", fit: "good", d: "Turns kickoff notes into a structured list of work packages.", c: "Check nothing was merged, dropped or invented.", l: "pm-planning" },
  { r: "project-management", t: "Checking a schedule for clashes", fit: "good", d: "Finds double-booked people, missing handovers and tasks with no owner.", c: "Confirm each finding in the scheduling tool and with the people involved.", l: "pm-planning" },
  { r: "project-management", t: "Tailoring one update for several audiences", fit: "good", d: "Adjusts length and emphasis for sponsors, teams and suppliers.", c: "Compare versions: facts like risk status must be identical in all of them.", l: "pm-vendors" },
  { r: "project-management", t: "Drafting tender requirements", fit: "good", d: "Turns needs into structured requirements for a tender.", c: "Make each requirement testable, such as a pass rate on sample questions.", l: "pm-vendors" },
  { r: "project-management", t: "Estimating durations", fit: "care", d: "Will suggest durations for tasks on request.", c: "Treat them as placeholders. Estimates come from the people doing the work, as ranges.", l: "pm-planning" },
  { r: "project-management", t: "Comparing supplier bids", fit: "care", d: "Summarises bids side by side.", c: "Read the original bids. Summaries drop caveats and exclusions first.", l: "pm-vendors" },
  { r: "project-management", t: "Assessing a change request", fit: "care", d: "Lays out options and impacts on scope, time and cost.", c: "Check impacts against the real plan and contract. The decision goes through change control.", l: "project-management" },
  { r: "project-management", t: "Committing to a go-live date", fit: "human", d: "Can propose a date from the plan.", c: "A commitment with consequences. Someone accountable makes it, with the range in view.", l: "pm-planning" },

  /* Security */
  { r: "security", t: "Explaining an obfuscated script", fit: "good", d: "Reads a suspicious PowerShell or shell one-liner and explains what it does.", c: "Confirm in a sandbox if it matters, and don't paste live secrets.", l: "security-detection" },
  { r: "security", t: "Turning logs into a timeline", fit: "good", d: "Builds an incident timeline from logs you supply.", c: "Spot-check entries against the raw logs, and ask what it couldn't see.", l: "security-detection" },
  { r: "security", t: "Drafting threat model questions", fit: "good", d: "Lists risks for an AI feature using the OWASP Top 10 for LLM applications.", c: "Draw the data flows yourself, and check for the lethal trifecta.", l: "security-threat-models" },
  { r: "security", t: "First-pass code review for vulnerabilities", fit: "good", d: "Flags likely issues such as injection and missing input validation.", c: "Verify each finding, and look separately for missing authorization, which it often misses.", l: "security" },
  { r: "security", t: "Drafting detection rules", fit: "care", d: "Writes a starting query for a detection.", c: "Test it against known-good and known-bad data before deploying.", l: "security-detection" },
  { r: "security", t: "Triage of phishing reports", fit: "care", d: "Highlights pressure tactics and suspicious links in reported emails.", c: "Use a tool that can't take actions, and don't let it close cases alone.", l: "security-detection" },
  { r: "security", t: "Reviewing an AI vendor's security answers", fit: "care", d: "Summarises a vendor's security questionnaire.", c: "Ask what the system can't do when manipulated. “The model ignores attacks” isn't a control.", l: "security-threat-models" },
  { r: "security", t: "Attribution and severity", fit: "human", d: "Will name threat groups and rate severity if asked.", c: "Attribution needs current intelligence; severity is an analyst's call on the evidence.", l: "security-detection" },

  /* Data and analytics */
  { r: "data-analytics", t: "Writing SQL against a known schema", fit: "good", d: "Drafts queries from a question and the relevant table definitions.", c: "Check the grain, joins and date boundaries, and sanity-check totals against a known figure.", l: "data-analytics" },
  { r: "data-analytics", t: "Analysis as a rerunnable notebook", fit: "good", d: "Writes visible, step-by-step analysis code.", c: "Read each step, rerun it yourself, and ask what rows were removed.", l: "data-analysis" },
  { r: "data-analytics", t: "Drafting data tests", fit: "good", d: "Proposes unique, not_null, accepted_values and relationships tests for a model.", c: "Add the tests only you know matter, and make sure they run in CI.", l: "data-quality" },
  { r: "data-analytics", t: "Documenting models and columns", fit: "good", d: "Describes what each model and column contains.", c: "Add what values mean to the business and who owns them, not just what the code does.", l: "data-quality" },
  { r: "data-analytics", t: "Statistical tests", fit: "care", d: "Runs whatever tests you ask for.", c: "Plan comparisons in advance, count how many were run, and report effect sizes.", l: "data-analysis" },
  { r: "data-analytics", t: "Explaining why a metric moved", fit: "care", d: "Offers plausible reasons for a rise or fall.", c: "Treat each as a hypothesis. Check splits for reversals and whether the change exceeds normal noise.", l: "data-analytics" },
  { r: "data-analytics", t: "Answering questions across the warehouse", fit: "care", d: "Turns business questions into queries on large schemas.", c: "Point it at shared metric definitions, not raw tables. Accuracy drops sharply on real schemas.", l: "data-quality" },
  { r: "data-analytics", t: "Deciding access to personal data", fit: "human", d: "Can suggest which columns look personal.", c: "Access is a legal and policy decision with named owners. Free-text fields are easy to miss.", l: "data-quality" },

  /* Technical writing */
  { r: "technical-writing", t: "Drafting from real sources", fit: "good", d: "Writes a first draft from specs, code and engineer notes you supply.", c: "Test every command and example, and check facts with the engineer.", l: "technical-writing" },
  { r: "technical-writing", t: "Rewriting sections to stand alone", fit: "good", d: "Replaces “this” and “above” with the actual subject so retrieved chunks make sense.", c: "Check that the meaning didn't shift.", l: "docs-for-ai" },
  { r: "technical-writing", t: "Finding contradictions across pages", fit: "good", d: "Compares many pages and lists where they disagree.", c: "Confirm each contradiction against the product, then keep one source of truth.", l: "docs-for-ai" },
  { r: "technical-writing", t: "Flagging pages that may have drifted", fit: "good", d: "Lists pages that mention settings or fields changed in recent pull requests.", c: "Check each flag in the product. Some will be false alarms.", l: "docs-maintenance" },
  { r: "technical-writing", t: "Drafting release notes", fit: "care", d: "Turns merged pull requests into customer-facing notes.", c: "Merged isn't shipped. Check flags and plans, and remove impact claims nobody measured.", l: "docs-maintenance" },
  { r: "technical-writing", t: "Translating docs", fit: "care", d: "Produces a first-draft translation.", c: "A reviewer who knows the language checks UI labels, fixed terms and warnings first.", l: "docs-maintenance" },
  { r: "technical-writing", t: "Clarity and style review", fit: "care", d: "Comments on hard-to-follow paragraphs and missing steps.", c: "Use a rule-based linter as the gate, and AI as an extra reader.", l: "docs-maintenance" },
  { r: "technical-writing", t: "Deciding what customers need to know", fit: "human", d: "Can draft notices for breaking changes and deprecations.", c: "A person who understands the impact decides what to say and how prominently.", l: "docs-maintenance" },

  /* Engineering management */
  { r: "engineering-management", t: "Drafting team updates and plans", fit: "good", d: "Turns notes and tracker data into a quarterly plan or update.", c: "Check every commitment with the people doing the work.", l: "engineering-management" },
  { r: "engineering-management", t: "Preparing for a difficult conversation", fit: "good", d: "Helps rehearse wording and anticipate questions.", c: "Keep personal details out of unapproved tools.", l: "engineering-management" },
  { r: "engineering-management", t: "Onboarding with a codebase assistant", fit: "good", d: "Helps new starters explore and ask questions about the code.", c: "Pair with a buddy who supplies history and context, and catches wrong answers.", l: "em-people" },
  { r: "engineering-management", t: "Designing an AI tool trial", fit: "good", d: "Helps structure measures, baseline and comparison for a trial.", c: "Decide in advance what result would change your mind, and include quality measures.", l: "em-measuring" },
  { r: "engineering-management", t: "Drafting review feedback", fit: "care", d: "Turns evidence and notes into written feedback.", c: "Replace generalisations with what actually happened, in context. The judgment is yours.", l: "engineering-management" },
  { r: "engineering-management", t: "Reading vendor productivity reports", fit: "care", d: "Summarises usage and output figures from an AI tool's dashboard.", c: "Usage isn't benefit. Look for outcomes, comparisons and quality data.", l: "em-measuring" },
  { r: "engineering-management", t: "Redesigning interview exercises", fit: "care", d: "Suggests exercises that test understanding when candidates use AI.", c: "Try the exercise with AI yourself, and focus on explaining, extending and debugging.", l: "em-people" },
  { r: "engineering-management", t: "Screening candidates or scoring performance", fit: "human", d: "Tools can rank CVs or score contributions.", c: "High-risk and regulated in places. Involve HR and legal, and keep decisions with people.", l: "em-people" },

  /* Operations */
  { r: "operations", t: "Generating incident hypotheses", fit: "good", d: "Reads logs and metrics and suggests likely causes.", c: "Rank hypotheses by evidence, and follow the runbook for any action.", l: "operations" },
  { r: "operations", t: "Drafting runbooks", fit: "good", d: "Turns notes and past incidents into step-by-step procedures.", c: "Test every step in a safe environment before relying on it.", l: "operations" },
  { r: "operations", t: "Drafting Terraform and manifests", fit: "good", d: "Writes infrastructure code from a description.", c: "Review the plan or dry run, not the summary. Look for public access and wildcards.", l: "ops-iac" },
  { r: "operations", t: "Writing policy-as-code rules", fit: "good", d: "Turns rules like “no public buckets” into policy checks.", c: "Test each rule against a known-bad and a known-good example.", l: "ops-iac" },
  { r: "operations", t: "Suggesting commands during an incident", fit: "care", d: "Proposes diagnostic or fix commands.", c: "Run read-only commands freely; anything that changes state goes through the runbook and approval.", l: "operations" },
  { r: "operations", t: "Switching model versions", fit: "care", d: "Upgrades an AI feature to a new model version.", c: "Rerun the eval set, compare quality, latency and cost, and roll out behind a flag.", l: "ops-llm" },
  { r: "operations", t: "Drafting postmortems", fit: "care", d: "Writes a first draft from the incident timeline and chat.", c: "Keep it blameless, check the timeline, and let the team agree the contributing causes.", l: "operations" },
  { r: "operations", t: "Applying changes to production", fit: "human", d: "An agent could apply infrastructure changes directly.", c: "A person approves the plan. AI tools shouldn't hold apply rights to production.", l: "ops-iac" },

  /* Customer support */
  { r: "customer-support", t: "Drafting replies for agents", fit: "good", d: "Suggests a reply from the ticket and help-centre articles.", c: "The agent checks every fact and promise before sending.", l: "customer-support" },
  { r: "customer-support", t: "Summarising long tickets", fit: "good", d: "Condenses a long thread for the next agent or an escalation.", c: "Check the customer's actual request and any commitments made.", l: "customer-support" },
  { r: "customer-support", t: "Drafting articles from solved tickets", fit: "good", d: "Turns a resolution into a draft help article.", c: "The agent who solved it confirms the cause and steps, and removes customer data.", l: "support-knowledge" },
  { r: "customer-support", t: "Finding help-centre gaps", fit: "good", d: "Groups ticket themes that have no matching article.", c: "Fill gaps from real solved cases and the product, never from general knowledge.", l: "support-knowledge" },
  { r: "customer-support", t: "Routing and tagging tickets", fit: "care", d: "Classifies incoming tickets by topic and urgency.", c: "Measure against tickets people have tagged, and watch for urgent ones it misroutes.", l: "customer-support" },
  { r: "customer-support", t: "AI quality scoring", fit: "care", d: "Scores every ticket against the quality rubric.", c: "Calibrate against human scores, use for coaching and patterns, and let agents challenge scores.", l: "support-knowledge" },
  { r: "customer-support", t: "A customer-facing assistant", fit: "care", d: "Answers customers directly from the help centre.", c: "Test on real past tickets, make handoff easy, and track repeat contacts and sampled accuracy.", l: "support-assistant" },
  { r: "customer-support", t: "Refunds and exceptions", fit: "human", d: "An assistant could grant or promise refunds.", c: "Promises about money carry legal weight. Route them to a person.", l: "support-assistant" }
];
