/* Lesson-style detail for use cases: Delivery and Project management. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Delivery ---------- */
  "Drafting the weekly status report": {
    w: "It's Friday afternoon and the status report is due. An assistant connected to the board can draft it in a minute.",
    f: "Drafting from the board is a good fit. The check is that blockers and slips aren't smoothed into “on track”.",
    x: { i: "The board export and a request to list blockers and slipped items separately before summarising.", o: "“Sprint on track. Payments progressing well.”", c: "Payments has been blocked for six days. You rewrite the summary as amber, name the blocker and its effect on the date, and ask for a decision." },
    tk: { q: "Rewrite: “Good progress. Minor risks being monitored.” The board shows 6 of 15 stories done with 2 days left and one story blocked on legal review.", m: "“Amber. 6 of 15 stories done with 2 days left; we expect to carry over about 7. The data-retention story is blocked on legal review (since Tuesday), which affects the April release. Decision needed: proceed without it or move the date. Owner: product lead, by Wednesday.”", r: ["Uses numbers from the board", "Names the blocker and how long it's been blocked", "States the effect on dates", "Asks for a specific decision with an owner"] },
    q: { q: "What's the most common failure of AI status drafts?", a: 1, o: [["They're too long.", "Easy to fix."], ["Blockers get smoothed into “on track”.", "Right."], ["They use the wrong template.", "Minor."], ["They reveal confidential information to stakeholders.", "Possible, but not most common."]] }
  },
  "Splitting large stories": {
    w: "A 21-point story has sat at the top of the backlog for three sprints. You want to split it before refinement.",
    f: "AI is good at suggesting splits when you ask for vertical slices. Check each slice is valuable and testable on its own.",
    x: { i: "The story and a request for vertical slices, each usable on its own, ordered by value and learning.", o: "Five slices, one of them “Write tests for subscriptions”.", c: "Testing isn't a slice; it belongs in every slice. You fold it in and check the first slice can ship in a few days." },
    tk: { q: "Split “Customers can export their data” into four vertical slices.", m: "1. Export a single report as CSV. 2. Export all reports in one ZIP. 3. Schedule a weekly export by email. 4. Admins can disable exports for the workspace.", r: ["Each slice is usable by a customer", "No slice is a technical layer", "Slices are ordered by value or risk", "The first slice is small"] },
    q: { q: "Which is a vertical slice?", a: 2, o: [["Build the export database tables and API first.", "A layer."], ["Write export tests.", "Tests belong inside slices."], ["Customers can export one report as CSV.", "Right."], ["Design all export screens.", "A layer of work, not a slice."]] }
  },
  "Finding duplicate and stale tickets": {
    w: "The backlog has 400 tickets. Many are duplicates or haven't been touched in a year. An assistant can cluster and flag them.",
    f: "Good fit: clustering text is a strength. Have a person confirm before closing anything.",
    x: { i: "The backlog export and a request to group likely duplicates and list tickets untouched for 12 months.", o: "38 groups of duplicates and 120 stale tickets.", c: "Most groups are right; three merge different problems with similar wording. You close the clear duplicates and ask owners about the stale ones." },
    tk: { q: "Write the rule for closing tickets the AI flags as stale.", m: "A flagged ticket is closed only after its reporter or the area owner confirms it's no longer needed, or after a two-week notice with no reply. Closing note says why, and links any duplicate.", r: ["Requires confirmation before closing", "Gives people a chance to object", "Records the reason for closing"] },
    q: { q: "What should happen before closing AI-flagged duplicates?", a: 0, o: [["A person confirms they describe the same problem.", "Right."], ["Nothing: the AI is confident.", "Similar wording can hide different problems."], ["Close them all now and reopen any that turn out to be needed.", "Loses information."], ["Ask a second AI.", "Still not confirmation."]] }
  },
  "Grouping written retro feedback": {
    w: "Twenty people left written feedback for the quarterly retro. You want themes to discuss, without losing quieter voices.",
    f: "Good fit for grouping. Keep minority points visible and remove names before sharing.",
    x: { i: "Anonymised feedback and a request for themes with counts, plus a list of single comments that don't fit.", o: "Five themes and a short “other” list.", c: "One “other” comment raises a safety concern nobody else mentioned. You move it onto the agenda." },
    tk: { q: "Write the request you'd use to group retro feedback without losing minority views.", m: "“Group these anonymised comments into themes with a count for each. Quote two comments per theme. List every comment that doesn't fit a theme separately, in full. Don't merge comments that raise different problems.”", r: ["Uses anonymised feedback", "Asks for counts and quotes", "Keeps non-fitting comments in full", "Avoids merging distinct problems"] },
    q: { q: "Why ask for comments that don't fit any theme?", a: 3, o: [["To make the summary longer.", "Not the goal."], ["Because themes need at least five comments to count.", "No such rule."], ["To find typos.", "Not the reason."], ["Important minority points often appear there.", "Right."]] }
  },
  "Meeting notes and actions": {
    w: "An AI notetaker summarises your planning meeting. Actions and owners go straight into the team's tracker.",
    f: "Good fit, if a person checks actions and owners before they're shared.",
    x: { i: "The transcript and a request for decisions, actions with owners and dates, and open questions.", o: "Seven actions, each with an owner.", c: "Two owners were never agreed; the model assigned the person who spoke last. You mark them “owner not agreed” and follow up." },
    tk: { q: "Write the instruction that stops a summary inventing owners.", m: "“List actions only if they were agreed in the meeting. For each, give the owner and date if they were stated; otherwise write ‘owner not agreed’ or ‘no date’. Don't infer owners from who spoke.”", r: ["Limits actions to agreed ones", "Requires stated owners and dates", "Gives an explicit alternative to guessing"] },
    q: { q: "A summary lists an owner nobody agreed. What's the fix?", a: 2, o: [["Ask the owner to accept it.", "They didn't agree to it."], ["Delete the action.", "The action may be real."], ["Mark it “owner not agreed” and follow up.", "Right."], ["Assign it to the meeting host, who can delegate it later.", "Still a guess."]] }
  },
  "Reading flow metrics": {
    w: "Your director asks why cycle time doubled this month. An assistant can analyse the board data in seconds.",
    f: "Use with care. Metric changes often reflect how the board is used, not how work flows.",
    x: { i: "Board history and a request to explain the change, listing data issues first.", o: "“Cycle time doubled due to increased complexity.”", c: "Ten old tickets were closed in a clean-up this month, each with a cycle time of months. Excluding them, cycle time barely moved." },
    tk: { q: "List three checks before explaining a change in a flow metric.", m: "Did anything unusual get closed or reopened (clean-ups, migrations)? Did the board or workflow states change? Is the sample big enough to mean anything? Compare medians, not averages, and look at the items driving the change.", r: ["Checks for one-off board events", "Checks workflow or definition changes", "Considers sample size and outliers"] },
    q: { q: "Cycle time doubled in a month. What's the first thing to check?", a: 1, o: [["Whether the team is working less.", "Jumping to conclusions about people."], ["Which items drove the change and why.", "Right."], ["Whether the AI used the right chart type for the data.", "Presentation isn't the issue."], ["Last year's numbers.", "Useful later."]] }
  },
  "Mapping cross-team dependencies": {
    w: "Four teams contribute to a launch. You want a map of who depends on whom before planning.",
    f: "Use with care. AI can extract dependencies from documents, but missing or wrong links need confirming with each team.",
    x: { i: "Each team's plan and a request to list dependencies with the source sentence for each.", o: "A dependency list with twelve links.", c: "Two links come from outdated plans; one critical dependency (security review) isn't written down anywhere. Each team lead confirms their list." },
    tk: { q: "Write the questions you'd ask each team lead to confirm an AI-drafted dependency map.", m: "Is each dependency listed for your team correct and current? What do you need from others that isn't listed? Who are you waiting on right now? What date do you need each dependency by?", r: ["Confirms listed dependencies", "Asks for missing ones", "Asks about current blockers", "Asks for needed-by dates"] },
    q: { q: "Why ask for the source sentence for each dependency?", a: 3, o: [["To make the map longer.", "Not the goal."], ["Because teams prefer quotes to summaries in planning documents.", "Not the reason."], ["To check grammar.", "Irrelevant."], ["So each link can be checked against its source.", "Right."]] }
  },
  "Recording retrospectives": {
    w: "Someone suggests recording the retro with an AI notetaker so nothing is lost.",
    f: "Keep human. Candour in retros depends on people feeling safe; records change what people say.",
    x: { i: "A proposal to record and summarise every retro.", o: "A detailed summary naming who raised each issue.", c: "People stop raising sensitive problems. The team agrees: no recording by default; a person notes agreed actions only." },
    tk: { q: "Write your team's rule for AI notetakers in retrospectives.", m: "Off by default. The team can opt in for a specific retro if everyone agrees. If used, only agreed actions are kept, without names; recordings are deleted after the summary is checked.", r: ["Off by default", "Requires everyone's agreement", "Keeps actions only, without names", "Limits retention"] },
    q: { q: "Why are retros different from planning meetings for AI notetakers?", a: 0, o: [["Candour depends on people feeling safe.", "Right."], ["Retros are shorter.", "Not the reason."], ["Notetakers can't handle retros with many speakers.", "They can."], ["Retros have no actions.", "They usually do."]] }
  },

  /* ---------- Project management ---------- */
  "Work breakdown from workshop notes": {
    w: "After a planning workshop you have photos of sticky notes and rough notes. You need a work breakdown structure for the plan.",
    f: "Good fit for structuring. The team checks it's complete and owns the estimates.",
    x: { i: "Transcribed notes and a request for a work breakdown with deliverables and open questions.", o: "A tidy breakdown with 40 work packages.", c: "It's well structured, but missed data migration, which was discussed but not written on a sticky. The team adds it in review." },
    tk: { q: "List three questions you'd ask the team when reviewing an AI work breakdown.", m: "What's missing that we discussed but didn't write down? Which packages are really two things? Which items depend on people outside this team? Who will own each package?", r: ["Asks about missing work", "Checks package sizes", "Finds external dependencies", "Assigns ownership"] },
    q: { q: "What's the main gap in an AI-drafted work breakdown?", a: 2, o: [["Formatting.", "Minor."], ["Too few levels.", "Easy to adjust."], ["Work that was discussed but never written down.", "Right."], ["Wrong numbering of the work packages in the hierarchy.", "Cosmetic."]] }
  },
  "Checking a schedule for clashes": {
    w: "Your plan spans three countries and the holiday season. You want to know where tasks clash with holidays or people's leave.",
    f: "Good fit if you supply the calendars. Without them, holidays and leave get missed.",
    x: { i: "The schedule, each country's public holidays and the team's leave calendar.", o: "Five clashes found.", c: "It missed a regional holiday because you supplied national holidays only. You add regional calendars and re-run." },
    tk: { q: "What data would you give an assistant to check a schedule for clashes?", m: "The schedule with task owners and dates; public and regional holidays for each person's location; approved leave; part-time working patterns; known change freezes or company events.", r: ["Includes holidays by location", "Includes leave and working patterns", "Includes company-wide freezes or events"] },
    q: { q: "Why might an AI schedule check miss a holiday?", a: 1, o: [["It doesn't understand dates or time zones reliably.", "It does."], ["It only knows the calendars you give it.", "Right."], ["Holidays are confidential.", "They're public."], ["Schedules are too long.", "Not the reason."]] }
  },
  "Tailoring one update for several audiences": {
    w: "The same project news needs to go to executives, the delivery team and the client. You've written the facts once.",
    f: "Good fit. Check that no version changes the facts or overpromises.",
    x: { i: "Your fact sheet and a request for three versions, each listing what it left out.", o: "Three clear versions.", c: "The client version says the date is “confirmed”; your fact sheet says “expected”. You correct it." },
    tk: { q: "Write the instruction that keeps tailored versions factually consistent.", m: "“Write three versions of this update for executives, the team and the client. Use only the facts below. Don't change dates, numbers or commitments, and don't upgrade ‘expected’ to ‘confirmed’. After each version, list facts you left out.”", r: ["Limits to the supplied facts", "Forbids changing dates and commitments", "Asks what was left out"] },
    q: { q: "What's the most dangerous change in a tailored update?", a: 3, o: [["Shorter sentences.", "Fine."], ["A different greeting.", "Fine."], ["Removing technical detail for executives.", "Often appropriate."], ["“Expected” becoming “confirmed”.", "Right. It's a new commitment."]] }
  },
  "Drafting tender requirements": {
    w: "You're preparing a tender for a new service desk tool. Requirements need to be clear, testable and fair to suppliers.",
    f: "AI drafts structured requirements well. Check they're testable and reflect your needs, not a typical product's features.",
    x: { i: "Your needs, constraints and a request for numbered, testable requirements.", o: "60 requirements, many copied from typical product features.", c: "Fifteen describe features you don't need, which would narrow the field unfairly. You keep what you need and make each one testable." },
    tk: { q: "Rewrite as testable: “The system must be fast and easy to use.”", m: "“Search returns results within 2 seconds for 95% of queries on a 100,000-ticket database. New agents can create, assign and close a ticket within 10 minutes of first login without training.”", r: ["Replaces “fast” with a measurable target", "Replaces “easy” with a testable task", "States conditions for the test"] },
    q: { q: "Why remove requirements you don't actually need?", a: 0, o: [["They narrow the field and add cost unfairly.", "Right."], ["Tenders have a word limit.", "Not the main reason."], ["Suppliers dislike long lists of requirements in tenders.", "Not the reason."], ["AI wrote them.", "Who wrote them isn't the issue."]] }
  },
  "Estimating durations": {
    w: "An assistant drafts a migration plan with a total of 11 weeks. Your last three similar migrations took 16 to 22.",
    f: "Use with care. AI plans add up ideal tasks; history and the team's own estimates correct the optimism.",
    x: { i: "The task list and your history of similar projects.", o: "11 weeks, task by task.", c: "The plan misses data cleansing and sign-off cycles, which caused past overruns. You present 17–21 weeks with the assumptions." },
    tk: { q: "How would you present an estimate when the AI plan says 8 weeks and history says 10–14?", m: "Present a range anchored on history (e.g. 11–14 weeks), explain the difference: the AI plan leaves out reviews, rework and availability; name what would make the low end possible.", r: ["Anchors on historical outcomes", "Presents a range", "Explains what the AI plan missed", "Says what would shorten it"] },
    q: { q: "What's the best sanity check on an AI-drafted plan's total?", a: 2, o: [["Asking the AI if it's sure.", "Not a check."], ["Adding 10% contingency.", "Usually too little."], ["How long similar past projects took.", "Right."], ["The sponsor's preferred date for the go-live.", "A target, not evidence."]] }
  },
  "Comparing supplier bids": {
    w: "Four suppliers sent 60-page bids. You need a comparison for the steering group by next week.",
    f: "Use with care. AI extracts and compares well; check figures against the bids and keep scoring with the panel.",
    x: { i: "The bids and your scoring criteria, with a request to extract evidence for each criterion with page references.", o: "A comparison table with prices and capabilities.", c: "One supplier's price excluded implementation, buried on page 47. You add it and confirm every figure against its page." },
    tk: { q: "Write the request you'd use to extract bid evidence safely.", m: "“For each bid, extract the evidence for each of our criteria, quoting the text with its page number. If a criterion isn't addressed, write ‘not addressed’. List any costs outside the headline price. Don't score the bids.”", r: ["Asks for quotes with page numbers", "Handles missing information explicitly", "Finds hidden costs", "Leaves scoring to people"] },
    q: { q: "Who should score supplier bids?", a: 1, o: [["The AI, because its scores are more objective than a panel's.", "Scores reflect judgement and accountability."], ["The evaluation panel, using extracted evidence.", "Right."], ["The cheapest supplier.", "Obviously not."], ["Whoever has time.", "Needs a defined panel."]] }
  },
  "Assessing a change request": {
    w: "The client asks for single sign-on before go-live. An assistant drafts a change request with an estimate and a recommendation.",
    f: "Use with care. Drafting options and impacts helps; estimates come from the team and the decision from the sponsor.",
    x: { i: "The request and a template asking for options, impacts and open questions.", o: "One option, a two-week estimate, and a recommendation to accept.", c: "The team's estimate is three weeks, and there's a better option: launch on time and add SSO later. You present three options without a recommendation." },
    tk: { q: "List three options for a late request to add a reporting feature before launch.", m: "A. Add it before launch: launch moves two weeks, extra cost. B. Launch on time with basic CSV export, full reporting a month later. C. Launch as planned and schedule reporting for the next release.", r: ["Offers at least three options", "Includes a smaller or later version", "States schedule and cost impacts"] },
    q: { q: "Where should a change request's estimates come from?", a: 3, o: [["The AI's draft, since it has seen many similar change requests.", "Typical projects aren't your team."], ["The sponsor.", "They decide, not estimate."], ["The client.", "Not the right source."], ["The team doing the work.", "Right."]] }
  },
  "Committing to a go-live date": {
    w: "The sponsor wants a firm go-live date for the board. An assistant's plan suggests one.",
    f: "Keep human. A commitment is a promise the team has to keep; people who own the work agree it.",
    x: { i: "The plan, risks and history, with a request to list what would make each date likely or unlikely.", o: "A suggested date of 14 June.", c: "The analysis is useful; the date isn't the model's to commit. The team agrees a target with a range and the conditions it depends on." },
    tk: { q: "Write how you'd communicate a go-live commitment to the board.", m: "“We're targeting 28 June, with a range of 21 June to 12 July. The date depends on the client's data being ready by 15 May and security sign-off by 7 June. We'll confirm or update it on 20 May.”", r: ["Gives a target and a range", "States the conditions it depends on", "Gives a date to confirm or update"] },
    q: { q: "Who commits to a go-live date?", a: 0, o: [["The people accountable for delivering it.", "Right."], ["The AI that drafted the plan, since it calculated the date.", "It can't be accountable."], ["The board.", "They approve; the team commits."], ["The supplier alone.", "Usually shared."]] }
  }
});
