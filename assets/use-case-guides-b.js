/* Use case guides, part 2: delivery, project management, security, data and analytics. */
Object.assign(GW.ucGuides, {
  /* ---------- Delivery ---------- */
  "Drafting the weekly status report": {
    s: ["Export the tracker data for the week: planned, done, blocked, moved.", "Add your notes on risks and decisions.", "Ask for a draft in your report template, with numbers from the export only.", "Check every number and the status colour against the tracker.", "Set the status yourself and add owners and dates to risks."],
    y: ["Keep the same structure every week so changes stand out.", "Name blockers with an owner and a date."],
    n: ["Let the tone of the notes decide the status colour.", "Send a report that says “on track” without evidence."],
    t: "Ask it to list what changed since last week’s report. Readers care about the delta.",
    k: ["It reports what’s in the export, not work that never made it into the tracker."],
    p: "Here’s this week’s tracker export and my notes. Draft a status update with: done vs planned (numbers from the export), blockers with owner and date, risks, and decisions needed. Don’t choose a status colour. Don’t use words like “strong” or “on track” without a number."
  },
  "Splitting large stories": {
    s: ["Give the story, its acceptance criteria and who it’s for.", "Ask for thin vertical slices, each usable on its own.", "Check each slice delivers something a user can see.", "Size the slices with the team.", "Drop slices nobody asked for."],
    y: ["Prefer slices by workflow step or user type over slices by layer."],
    n: ["Accept slices like “backend” and “frontend”, which deliver nothing alone."],
    t: "Ask for the thinnest slice that would still be worth releasing.",
    k: ["It doesn’t know your architecture, so some slices may be harder than they look."]
  },
  "Finding duplicate and stale tickets": {
    s: ["Export the backlog with titles, descriptions, dates and status.", "Ask for likely duplicates as pairs, with the reason.", "Ask for tickets with no activity in a chosen period.", "Review each pair before merging.", "Close stale tickets with a comment, so they can be reopened."],
    y: ["Batch the clean-up and tell the team what changed."],
    n: ["Bulk-close tickets on the model’s word."],
    t: "Ask which duplicates have different acceptance criteria. Those need a conversation, not a merge.",
    k: ["Similar wording isn’t the same request; similar requests can use different words."]
  },
  "Grouping written retro feedback": {
    s: ["Collect written, anonymous comments.", "Ask for themes with counts and the comments behind each.", "Check that small but serious themes weren’t merged away.", "Share the themes with the team for discussion.", "Let the team choose actions."],
    y: ["Keep exact counts.", "Keep comments anonymous throughout."],
    n: ["Paste comments into a tool not approved for internal feedback."],
    t: "Ask it to list any single comment that raises a safety, conduct or wellbeing concern.",
    k: ["Grouping loses tone; a theme of three angry comments may matter more than ten mild ones."]
  },
  "Meeting notes and actions": {
    s: ["Get agreement to record or transcribe before the meeting.", "Generate the summary and action list after.", "Have the facilitator check actions, owners and dates.", "Share the checked version only.", "Delete recordings on your retention schedule."],
    y: ["Put owners and dates on every action."],
    n: ["Record sensitive meetings by default.", "Share an unchecked summary."],
    t: "Ask for decisions separately from discussion. They’re what people need later.",
    k: ["Transcripts mishear names and numbers, and miss what wasn’t said aloud."]
  },
  "Reading flow metrics": {
    s: ["Export the raw ticket data with timestamps.", "Ask for lead time and throughput calculations as code you can rerun.", "Check the definitions: when does work start and finish?", "Look at the distribution, not just the average.", "Discuss reasons with the team before reporting them."],
    y: ["Use medians and percentiles for lead time."],
    n: ["Report the model’s explanation for a change as fact."],
    t: "Ask for the five slowest items. They usually explain more than the average.",
    k: ["Metrics depend on how consistently the team updates tickets."]
  },
  "Mapping cross-team dependencies": {
    s: ["Collect ticket text from the teams involved.", "Ask for likely dependencies with the ticket pairs behind each.", "Confirm each with the teams.", "Add confirmed dependencies to the plan with owners."],
    y: ["Ask for dependencies on shared services and data, not just teams."],
    n: ["Publish a dependency map nobody has confirmed."],
    t: "Ask which dependencies have no date on either side.",
    k: ["Many dependencies live in people’s heads, not in tickets."]
  },
  "Recording retrospectives": {
    s: ["Ask the team whether they want any record beyond agreed actions.", "If not, take actions by hand.", "If yes, agree what’s kept, who sees it and when it’s deleted."],
    y: ["Protect the room’s honesty first."],
    n: ["Turn on a notetaker by default."],
    t: "Most teams keep only the actions, which is usually enough.",
    k: ["People speak less freely when they know they’re being transcribed."]
  },

  /* ---------- Project management ---------- */
  "Work breakdown from workshop notes": {
    s: ["Give the workshop notes, scope statement and known constraints.", "Ask for a work breakdown with deliverables, not activities.", "Check nothing in scope is missing and nothing out of scope crept in.", "Review with the people who’ll do the work.", "Add owners and estimates with them."],
    y: ["Ask for assumptions and open questions alongside."],
    n: ["Present the breakdown as agreed before the team has seen it."],
    t: "Ask what usually gets forgotten in projects like this: data migration, training, decommissioning.",
    k: ["It structures what you gave it; it can’t know what wasn’t said."]
  },
  "Checking a schedule for clashes": {
    s: ["Export the schedule with tasks, owners, dates and dependencies.", "Ask for double-booked people, tasks without owners and missing handovers.", "Verify each finding in the plan.", "Fix and re-run."],
    y: ["Use the latest export, with the date on it."],
    n: ["Rely on it to recompute the critical path. Use your scheduling tool for that."],
    t: "Ask for tasks that end on a Friday and are followed by a dependent task the same day.",
    k: ["It reads the export as text and can miss calendar details like holidays."]
  },
  "Tailoring one update for several audiences": {
    s: ["Write one accurate master update.", "Ask for versions for sponsors, the team and suppliers, each with a length limit.", "Check no version changes the facts or the risks.", "Check nothing confidential reaches suppliers."],
    y: ["Keep the same numbers and dates in every version."],
    n: ["Let the sponsor version soften a risk."],
    t: "Ask for a list of what each version leaves out, then confirm that’s intended.",
    k: ["Rewriting for tone can quietly change meaning."]
  },
  "Drafting tender requirements": {
    s: ["List your needs, constraints and must-haves.", "Ask for structured requirements, each testable and numbered.", "Mark mandatory versus desirable.", "Have legal and procurement review.", "Remove anything that favours one supplier unintentionally."],
    y: ["Include data protection, security and exit requirements."],
    n: ["Copy requirements it invents from other tenders without checking they apply."],
    t: "Ask how a supplier could meet each requirement on paper while failing in practice.",
    k: ["Public-sector tenders have rules a model may not know or apply correctly."]
  },
  "Estimating durations": {
    s: ["Break work down with the team.", "Use your own history of similar tasks.", "If you ask the model, use its numbers only as a challenge to yours.", "Estimate as ranges, owned by the people doing the work."],
    y: ["Record actuals so the next estimate is better."],
    n: ["Put model-generated durations in a plan."],
    t: "Ask it what typically makes this kind of task overrun.",
    k: ["It has no knowledge of your team, tools or environment."]
  },
  "Comparing supplier bids": {
    s: ["Agree the evaluation criteria and weights before reading bids.", "Ask for a side-by-side summary with page references for each claim.", "Check every price and commitment against the bid document.", "Score the bids as a panel.", "Record the reasons."],
    y: ["Ask it to list what each bid doesn’t say."],
    n: ["Let the summary replace reading the bids."],
    t: "Ask for differences in liability, exit and data terms. They’re easy to miss.",
    k: ["Procurement decisions may be challenged; you must be able to show your reasoning."]
  },
  "Assessing a change request": {
    s: ["Give the change, the current plan and the budget.", "Ask for options with impacts on scope, time, cost and risk.", "Check each impact with the people affected.", "Take the options to whoever has authority to decide."],
    y: ["Include a “don’t change” option."],
    n: ["Present the model’s preferred option as the recommendation without your own analysis."],
    t: "Ask what else in the plan would have to move if each option were chosen.",
    k: ["Impacts depend on details only the team knows."]
  },
  "Committing to a go-live date": {
    s: ["Use AI to summarise the plan and risks.", "Agree the date with the team and the sponsor.", "Publish the date with the assumptions behind it."],
    y: ["State the confidence and what would move the date."],
    n: ["Announce a date a model proposed."],
    t: "A date with stated assumptions is easier to defend when one of them breaks.",
    k: ["A go-live date is a commitment by people, not a calculation."]
  },

  /* ---------- Security ---------- */
  "Explaining an obfuscated script": {
    s: ["Copy the script as text. Never run it to see what happens.", "Ask for a step-by-step explanation and any URLs, IPs or file paths it uses.", "Decode suspicious parts yourself to confirm.", "Check indicators against your threat intelligence.", "Record findings in the case."],
    y: ["Use a tool approved for security data.", "Defang URLs and IPs before sharing."],
    n: ["Paste a script containing your own secrets into a public tool."],
    t: "Ask it to rewrite the script in plain, readable form with comments.",
    k: ["Heavily obfuscated code can be explained wrongly with total confidence."]
  },
  "Turning logs into a timeline": {
    s: ["Collect logs from each source with consistent timezones.", "Ask for a timeline with the source line behind each event.", "Check a sample of events against the raw logs.", "Look for gaps where logs are missing.", "Use the timeline in the incident record."],
    y: ["Normalise timezones before asking."],
    n: ["Fill gaps with the model’s guesses."],
    t: "Ask it to flag events that appear in one source but not another.",
    k: ["It only sees the logs you gave it, and may drop lines in long inputs."]
  },
  "Drafting threat model questions": {
    s: ["Draw the data flow of the AI feature.", "Ask for risks against the OWASP Top 10 for LLM applications.", "Turn each risk into a question for the team.", "Answer the questions with evidence, not intent.", "Track controls and owners."],
    y: ["Check for the lethal trifecta: private data, untrusted content, a way to send data out."],
    n: ["Treat the generated list as the threat model."],
    t: "Ask which risk would be hardest to detect if it happened.",
    k: ["Generic lists miss risks specific to your architecture."]
  },
  "First-pass code review for vulnerabilities": {
    s: ["Run your static analysis tools first.", "Ask the model to review the diff with the relevant context.", "Verify each finding by tracing the code path.", "Rate severity using your own scale.", "Track false positives to calibrate trust."],
    y: ["Ask for the input that would exploit each finding."],
    n: ["File findings you haven’t verified."],
    t: "Feed it your threat model so it reviews against real risks.",
    k: ["It can report confident false positives and miss configuration-dependent issues."]
  },
  "Drafting detection rules": {
    s: ["Describe the behaviour to detect and the log source schema.", "Ask for a starting query with comments.", "Run it against known-good and known-bad data.", "Tune for false positives.", "Peer-review before enabling."],
    y: ["Test with real attack samples or replays."],
    n: ["Deploy an untested rule."],
    t: "Ask what an attacker would change to avoid this rule.",
    k: ["Field names and syntax are often guessed; check them against your platform."]
  },
  "Triage of phishing reports": {
    s: ["Open reported emails in a safe environment.", "Ask the model to highlight pressure tactics, mismatched senders and suspicious links.", "Check headers and links with your tools.", "Decide and respond to the reporter.", "Block indicators if confirmed."],
    y: ["Treat email content as untrusted input to the model."],
    n: ["Let an assistant click links or open attachments."],
    t: "Thank reporters quickly; it keeps them reporting.",
    k: ["Emails can contain text aimed at manipulating the AI that reads them."]
  },
  "Reviewing an AI vendor's security answers": {
    s: ["Ask the model to summarise the questionnaire and list gaps.", "Check each key answer in the source document.", "Ask the vendor about vague or missing answers.", "Record risks and decisions."],
    y: ["Focus on data retention, training use, subprocessors and incident notice."],
    n: ["Accept a summary of claims as verification."],
    t: "Ask which answers are commitments and which are descriptions.",
    k: ["A questionnaire is what the vendor says, not evidence of what they do."]
  },
  "Attribution and severity": {
    s: ["Use AI to gather and summarise evidence.", "Set severity with your own scale and context.", "Attribute only with strong evidence and expert review."],
    y: ["State confidence levels."],
    n: ["Repeat a threat group name a model suggested."],
    t: "“Unknown actor” is a respectable answer.",
    k: ["Wrong attribution can cause real harm and bad decisions."]
  },

  /* ---------- Data and analytics ---------- */
  "Writing SQL against a known schema": {
    s: ["Give the question, the table definitions and the agreed metric definitions.", "Ask for the query with comments explaining each step.", "Check grain, joins, date boundaries and filters.", "Run it and sanity-check the result against a known number.", "Save the query with the question it answers."],
    y: ["State the timezone and the date range precisely.", "Use COUNT(DISTINCT) when counting people."],
    n: ["Report a number from a query you haven’t read."],
    t: "Ask the model to write a second, independent query for the same number. Disagreement shows a bug.",
    k: ["It guesses column meanings from names, which are often misleading."],
    p: "Schema: [paste table definitions]. Definition of active user: [paste]. Write SQL for monthly active users in March 2026, in UTC. Comment each step, state the grain of each CTE, and list any assumptions about columns."
  },
  "Analysis as a rerunnable notebook": {
    s: ["Ask for analysis as code in a notebook, step by step.", "Run each cell and read the output.", "Check row counts at each step.", "Keep the notebook with the report.", "Have someone else rerun it."],
    y: ["Print intermediate results."],
    n: ["Accept numbers stated in chat that no code produced."],
    t: "Ask for assertions in the code that fail if data looks wrong.",
    k: ["Chat answers about data are often computed in the model’s head, unreliably."]
  },
  "Drafting data tests": {
    s: ["Give the model definition and the column meanings.", "Ask for unique, not_null, accepted_values and relationship tests.", "Remove tests that don’t reflect real rules.", "Run them against current data.", "Investigate failures before loosening tests."],
    y: ["Add tests for business rules, not just structure."],
    n: ["Disable a failing test without understanding it."],
    t: "Ask for a test for the assumption your dashboard most depends on.",
    k: ["Tests encode what you believe about data; wrong beliefs make passing tests."]
  },
  "Documenting models and columns": {
    s: ["Give the model code and samples of the data.", "Ask for descriptions of each model and column.", "Check descriptions with the model’s owner.", "Publish in your catalogue."],
    y: ["Include units, grain and known caveats."],
    n: ["Publish descriptions guessed from column names."],
    t: "Ask it to flag columns whose name and content seem to disagree.",
    k: ["Descriptions inferred from names are often wrong in subtle ways."]
  },
  "Statistical tests": {
    s: ["Decide the question and test before seeing results.", "Ask the model to check the test fits the data.", "Run the test in code.", "Report effect sizes and uncertainty, not just p-values.", "Have a statistician review important results."],
    y: ["Check assumptions like independence and sample size."],
    n: ["Run many tests until one is significant."],
    t: "Ask “what result would make us change our decision?” before running anything.",
    k: ["It will run whatever test you ask for, even an inappropriate one."]
  },
  "Explaining why a metric moved": {
    s: ["Confirm the change is real: data delays, definition changes, tracking bugs.", "Ask for possible causes.", "Check each against the data.", "Report confirmed causes and say what remains unexplained."],
    y: ["Segment the change before explaining it."],
    n: ["Report a plausible story as the reason."],
    t: "Check whether the change sits within normal week-to-week variation first.",
    k: ["Plausible explanations are easy to generate and hard to tell from true ones."]
  },
  "Answering questions across the warehouse": {
    s: ["Point the tool at governed, documented models.", "Ask for the query and the tables it used.", "Check it used the agreed definitions.", "Verify the result against a trusted report."],
    y: ["Limit access to approved datasets."],
    n: ["Let self-serve AI answers become official numbers."],
    t: "Ask which tables it considered and rejected.",
    k: ["Large schemas have many similar tables; it may pick the wrong one."]
  },
  "Deciding access to personal data": {
    s: ["Use AI to flag columns that may be personal.", "Have the data owner and privacy lead classify them.", "Set access by role, documented."],
    y: ["Treat AI flags as a starting list."],
    n: ["Grant or deny access based on the model."],
    t: "Ask which columns could identify someone when combined.",
    k: ["Access to personal data has legal obligations attached."]
  }
});
