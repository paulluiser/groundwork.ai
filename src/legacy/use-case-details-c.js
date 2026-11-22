/* Lesson-style detail for use cases: Delivery and Project management. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Delivery ---------- */
  "Drafting the weekly status report": {
    w: "It's Friday afternoon and the status report is due. An assistant connected to the board can draft it in a minute.",
    f: "Drafting from the board is a good fit. The check is that blockers and slips aren't smoothed into “on track”.",
    x: { i: "The board export and a request to list blockers and slipped items separately before summarising.", o: "“Sprint on track. Payments progressing well.”", c: "Payments has been blocked for six days. You rewrite the summary as amber, name the blocker and its effect on the date, and ask for a decision." },
  },
  "Splitting large stories": {
    w: "A 21-point story has sat at the top of the backlog for three sprints. You want to split it before refinement.",
    f: "AI is good at suggesting splits when you ask for vertical slices. Check each slice is valuable and testable on its own.",
    x: { i: "The story and a request for vertical slices, each usable on its own, ordered by value and learning.", o: "Five slices, one of them “Write tests for subscriptions”.", c: "Testing isn't a slice; it belongs in every slice. You fold it in and check the first slice can ship in a few days." },
  },
  "Finding duplicate and stale tickets": {
    w: "The backlog has 400 tickets. Many are duplicates or haven't been touched in a year. An assistant can cluster and flag them.",
    f: "Good fit: clustering text is a strength. Have a person confirm before closing anything.",
    x: { i: "The backlog export and a request to group likely duplicates and list tickets untouched for 12 months.", o: "38 groups of duplicates and 120 stale tickets.", c: "Most groups are right; three merge different problems with similar wording. You close the clear duplicates and ask owners about the stale ones." },
  },
  "Grouping written retro feedback": {
    w: "Twenty people left written feedback for the quarterly retro. You want themes to discuss, without losing quieter voices.",
    f: "Good fit for grouping. Keep minority points visible and remove names before sharing.",
    x: { i: "Anonymised feedback and a request for themes with counts, plus a list of single comments that don't fit.", o: "Five themes and a short “other” list.", c: "One “other” comment raises a safety concern nobody else mentioned. You move it onto the agenda." },
  },
  "Meeting notes and actions": {
    w: "An AI notetaker summarises your planning meeting. Actions and owners go straight into the team's tracker.",
    f: "Good fit, if a person checks actions and owners before they're shared.",
    x: { i: "The transcript and a request for decisions, actions with owners and dates, and open questions.", o: "Seven actions, each with an owner.", c: "Two owners were never agreed; the model assigned the person who spoke last. You mark them “owner not agreed” and follow up." },
  },
  "Reading flow metrics": {
    w: "Your director asks why cycle time doubled this month. An assistant can analyse the board data in seconds.",
    f: "Use with care. Metric changes often reflect how the board is used, not how work flows.",
    x: { i: "Board history and a request to explain the change, listing data issues first.", o: "“Cycle time doubled due to increased complexity.”", c: "Ten old tickets were closed in a clean-up this month, each with a cycle time of months. Excluding them, cycle time barely moved." },
  },
  "Mapping cross-team dependencies": {
    w: "Four teams contribute to a launch. You want a map of who depends on whom before planning.",
    f: "Use with care. AI can extract dependencies from documents, but missing or wrong links need confirming with each team.",
    x: { i: "Each team's plan and a request to list dependencies with the source sentence for each.", o: "A dependency list with twelve links.", c: "Two links come from outdated plans; one critical dependency (security review) isn't written down anywhere. Each team lead confirms their list." },
  },
  "Recording retrospectives": {
    w: "Someone suggests recording the retro with an AI notetaker so nothing is lost.",
    f: "Keep human. Candour in retros depends on people feeling safe; records change what people say.",
    x: { i: "A proposal to record and summarise every retro.", o: "A detailed summary naming who raised each issue.", c: "People stop raising sensitive problems. The team agrees: no recording by default; a person notes agreed actions only." },
  },

  /* ---------- Project management ---------- */
  "Work breakdown from workshop notes": {
    w: "After a planning workshop you have photos of sticky notes and rough notes. You need a work breakdown structure for the plan.",
    f: "Good fit for structuring. The team checks it's complete and owns the estimates.",
    x: { i: "Transcribed notes and a request for a work breakdown with deliverables and open questions.", o: "A tidy breakdown with 40 work packages.", c: "It's well structured, but missed data migration, which was discussed but not written on a sticky. The team adds it in review." },
  },
  "Checking a schedule for clashes": {
    w: "Your plan spans three countries and the holiday season. You want to know where tasks clash with holidays or people's leave.",
    f: "Good fit if you supply the calendars. Without them, holidays and leave get missed.",
    x: { i: "The schedule, each country's public holidays and the team's leave calendar.", o: "Five clashes found.", c: "It missed a regional holiday because you supplied national holidays only. You add regional calendars and re-run." },
  },
  "Tailoring one update for several audiences": {
    w: "The same project news needs to go to executives, the delivery team and the client. You've written the facts once.",
    f: "Good fit. Check that no version changes the facts or overpromises.",
    x: { i: "Your fact sheet and a request for three versions, each listing what it left out.", o: "Three clear versions.", c: "The client version says the date is “confirmed”; your fact sheet says “expected”. You correct it." },
  },
  "Drafting tender requirements": {
    w: "You're preparing a tender for a new service desk tool. Requirements need to be clear, testable and fair to suppliers.",
    f: "AI drafts structured requirements well. Check they're testable and reflect your needs, not a typical product's features.",
    x: { i: "Your needs, constraints and a request for numbered, testable requirements.", o: "60 requirements, many copied from typical product features.", c: "Fifteen describe features you don't need, which would narrow the field unfairly. You keep what you need and make each one testable." },
  },
  "Estimating durations": {
    w: "An assistant drafts a migration plan with a total of 11 weeks. Your last three similar migrations took 16 to 22.",
    f: "Use with care. AI plans add up ideal tasks; history and the team's own estimates correct the optimism.",
    x: { i: "The task list and your history of similar projects.", o: "11 weeks, task by task.", c: "The plan misses data cleansing and sign-off cycles, which caused past overruns. You present 17–21 weeks with the assumptions." },
  },
  "Comparing supplier bids": {
    w: "Four suppliers sent 60-page bids. You need a comparison for the steering group by next week.",
    f: "Use with care. AI extracts and compares well; check figures against the bids and keep scoring with the panel.",
    x: { i: "The bids and your scoring criteria, with a request to extract evidence for each criterion with page references.", o: "A comparison table with prices and capabilities.", c: "One supplier's price excluded implementation, buried on page 47. You add it and confirm every figure against its page." },
  },
  "Assessing a change request": {
    w: "The client asks for single sign-on before go-live. An assistant drafts a change request with an estimate and a recommendation.",
    f: "Use with care. Drafting options and impacts helps; estimates come from the team and the decision from the sponsor.",
    x: { i: "The request and a template asking for options, impacts and open questions.", o: "One option, a two-week estimate, and a recommendation to accept.", c: "The team's estimate is three weeks, and there's a better option: launch on time and add SSO later. You present three options without a recommendation." },
  },
  "Committing to a go-live date": {
    w: "The sponsor wants a firm go-live date for the board. An assistant's plan suggests one.",
    f: "Keep human. A commitment is a promise the team has to keep; people who own the work agree it.",
    x: { i: "The plan, risks and history, with a request to list what would make each date likely or unlikely.", o: "A suggested date of 14 June.", c: "The analysis is useful; the date isn't the model's to commit. The team agrees a target with a range and the conditions it depends on." },
  }
});
