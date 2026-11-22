/* Lesson-style detail for each use case, keyed by the use case title in use-cases.js.
   w: the situation; f: why the fit rating applies; x: worked example { i: what you ask, o: what the AI gives back, c: what your check finds };
   Practical setup, constraints and references live in the playbook files (use-case-playbook-*.js). */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Product ---------- */
  "Synthesising interview notes": {
    w: "You ran eight customer interviews about reporting. Planning is on Thursday, and you have eight sets of notes nobody else has read. An assistant can produce a first set of themes in minutes; your job is making sure every theme is backed by what people actually said.",
    f: "Grouping and quoting is mechanical work AI does well. The risk is overstatement, which a check of quotes and counts catches quickly.",
    x: { i: "Eight labelled transcripts and a request for themes with participant IDs, counts and quotes.", o: "“Theme 1: Customers find exports confusing (P2, P4, P5, P7). ‘I never know which format to pick’ (P4).”", c: "P5's notes don't mention exports, and the quote was from P2, not P4. The theme holds for three of eight, so you rewrite it as “three participants found export formats confusing” with the corrected attribution." },
  },
  "Drafting acceptance criteria": {
    w: "A story is ready for refinement tomorrow: finance admins want to schedule reports by email. You'd like testable acceptance criteria to bring to the meeting, including the edge cases nobody has thought about yet.",
    f: "Turning a story into Given/When/Then criteria is structured writing AI does well. The decisions inside the criteria still need you.",
    x: { i: "The story, the known constraints (roles, data rules), and a request for criteria with edge cases and open questions.", o: "Five criteria, including “the report is emailed as a PDF to all recipients”, plus good questions about time zones.", c: "“As a PDF” was never decided: it's an assumption that would have become a requirement. You turn it into an open question and add a criterion the model couldn't know: recipients must have access to the report's data." },
  },
  "Comparing competitor pages you supply": {
    w: "Sales keeps asking how your pricing compares with two competitors. You've saved their current pricing pages. A side-by-side comparison would take an hour by hand; an assistant can draft it in a minute from the pages you paste.",
    f: "Comparing material in front of it is a strength. Errors come from details it adds from memory, which you can catch by tracing each figure.",
    x: { i: "Three pricing pages pasted in, and a request for a comparison table that marks anything not taken from the pages.", o: "A clear table with prices, seat limits and features, including “Competitor B: SSO included on all plans”.", c: "Competitor B's page lists SSO only on Enterprise. The model filled the gap from memory of an older plan. You trace every cell to a page and fix that one." },
  },
  "Writing a first spec draft": {
    w: "You have a page of notes from discovery, three customer quotes and a list of constraints from engineering. You need a first spec to circulate by Friday, structured so people can comment on it.",
    f: "Structuring notes into a spec is a good fit. The risk is gaps quietly filled with decisions nobody made.",
    x: { i: "Your notes, constraints and a request for a spec with goals, non-goals, requirements and an open questions list.", o: "A tidy spec with a section on permissions stating “only admins can create schedules”.", c: "Your notes said permissions were undecided. The draft turned an open question into a requirement. You move it back to open questions and check two other sections for the same pattern." },
  },
  "Structuring a market sizing": {
    w: "Leadership wants to know how big the opportunity is for a scheduling add-on before approving discovery work. You have a week, some survey data and public business registers.",
    f: "AI is good at laying out the method and the assumptions. It's risky as a source of the numbers themselves, which need citations.",
    x: { i: "A request to lay out a bottom-up sizing for agencies in three markets, with the inputs listed separately.", o: "A neat calculation ending in “a $1.2B addressable market growing 14% a year”.", c: "Neither number has a source. You keep the method, replace each input with a cited figure or a range, and present “$6M–$19M reachable revenue” with the two assumptions that move it most." },
  },
  "Rehearsing with synthetic users": {
    w: "You've written an interview guide and want to rehearse it before talking to real customers next week. An assistant can play a customer so you can test the flow, timing and wording of your questions.",
    f: "Fine for rehearsal. The danger is treating simulated answers as evidence about real customers.",
    x: { i: "Your guide and a request to play a finance admin at a mid-sized agency, answering realistically.", o: "Smooth, plausible answers that agree your scheduling idea would save time.", c: "The answers are typical, not true, and they agree with your framing. You use the session only to fix two leading questions and cut the guide to 30 minutes. None of the answers go into your research." },
  },
  "Defining “good” for an AI feature": {
    w: "Your team is building an AI summary for customer tickets. Engineering asks what “good enough” means before they choose a model. Nobody has written it down.",
    f: "AI can help draft criteria and example cases, but the definition of good is a product decision about your users.",
    x: { i: "A request to draft quality rules for ticket summaries, and to propose test cases.", o: "Rules like “summaries should be accurate, concise and helpful”, and ten generic test tickets.", c: "The rules can't be tested and the tickets aren't yours. You keep the structure, rewrite the rules as must/must-never checks, and replace the tickets with 60 real ones covering long threads, angry customers and personal data." },
  },
  "Choosing what to build next": {
    w: "Three teams want the next quarter for their feature. An assistant offers to score the options against your strategy and recommend one. It would save an awkward meeting.",
    f: "Keep human. Prioritisation weighs strategy, commitments and people in ways the model can't see. It can prepare options and arguments.",
    x: { i: "A request to list considerations for each option and argue against your preferred one.", o: "A useful list of risks for each option, and a scored table recommending option B with 8.7/10.", c: "The considerations are helpful; the score isn't. The weights encode a strategy the model doesn't know. You use the counter-arguments in the meeting and leave the table out." },
  },

  /* ---------- Design ---------- */
  "Exploring layout options": {
    w: "You're starting the redesign of a settings page and want to see a wide range of layouts before committing to one. An assistant can sketch a dozen directions in minutes.",
    f: "Generating range is a strength. It tends toward typical patterns, so the distinctive choices still come from you.",
    x: { i: "The page's content and constraints, and a request for eight different layout approaches with trade-offs.", o: "Eight directions, five of them variations of the same left-nav pattern.", c: "The range was narrower than it looked. You keep two genuinely different options, ask for three more that avoid a left nav, and sketch your own alternative." },
  },
  "Writing interface copy variants": {
    w: "An error message in checkout tests poorly. You want ten alternatives to choose from and test, written in your product's voice.",
    f: "Copy variants are fast and cheap to review. Check facts, tone and length against the real interface.",
    x: { i: "The current message, the cause of the error, your voice guide and a character limit.", o: "Ten options, including “Oops! Something went wrong with your card. Try again!”", c: "Three break your voice guide (no exclamation marks), two exceed the limit, and one promises “Your order is saved”, which isn't true. You shortlist three that are accurate and test them." },
  },
  "Throwaway prototypes": {
    w: "You want to test whether users understand a new onboarding idea before investing design time. An AI tool can generate a clickable prototype from a description in minutes.",
    f: "Fast, disposable prototypes are a good fit, as long as everyone knows they're throwaway.",
    x: { i: "A description of the onboarding flow and the question you want answered in testing.", o: "A polished clickable prototype with generic illustrations and placeholder copy.", c: "It's good enough to test the idea. You replace the copy that matters with real wording, remove a step that wasn't in your concept, and label it “prototype: not the design” in the share link." },
  },
  "Tagging research sessions": {
    w: "You have twelve usability session transcripts and need to tag every moment of confusion, workaround and success before synthesis.",
    f: "Tagging is repetitive and AI is fast at it. Spot-check tags against recordings before relying on counts.",
    x: { i: "Transcripts with timestamps and your tag list with definitions.", o: "Two hundred tagged moments, including 31 “confusion” tags.", c: "You check ten confusion tags against the recordings: three are participants thinking aloud, not confused. You tighten the definition and re-run, then count participants rather than tags." },
  },
  "Accessibility claims": {
    w: "A stakeholder pastes an assistant's verdict into the design review: “This design meets WCAG AA.” Launch is next week.",
    f: "Use with care. AI can flag likely issues, but conformance needs measurement and testing with assistive technology.",
    x: { i: "Screenshots of the design and a request to check it against WCAG 2.2 AA.", o: "“The design meets WCAG 2.2 AA. Colour contrast is sufficient and alt text is present.”", c: "A contrast checker shows the grey helper text at 3.1:1, below the 4.5:1 required. Keyboard testing finds the date picker can't be reached. The claim was a guess." },
  },
  "Designing an AI feature's interface": {
    w: "Your team is adding AI-drafted replies to the support inbox. The mockup shows a perfect draft appearing instantly. Engineering asks what happens when it's wrong, slow or unavailable.",
    f: "AI can suggest patterns and list states. The design decisions about trust and correction are yours.",
    x: { i: "The feature description and a request to list every state the interface needs.", o: "A list of states: loading, draft ready, error. Plus a suggestion to add a “confidence score”.", c: "The list misses edited and partially wrong states, and confidence scores are rarely calibrated. You add specific warnings, protect edits on regenerate, and design the unavailable state so agents can work without it." },
  },
  "Summarising usability findings for stakeholders": {
    w: "Stakeholders want a one-page readout of last week's usability study by tomorrow. You have notes, tags and a severity list.",
    f: "AI drafts readouts well from your findings. Check that severity, quotes and recommendations match the evidence.",
    x: { i: "Your tagged findings with participant counts and a request for a one-page readout.", o: "A crisp readout with “Critical: users can't find export” and a recommendation to redesign navigation.", c: "Two of six participants struggled, which your rule rates serious, not critical. The recommendation goes beyond the evidence. You correct the rating and replace the redesign with “test a labelled export button”." },
  },
  "Deciding which findings matter": {
    w: "Your study found fourteen issues. The team can fix three this sprint. An assistant offers to rank them by importance.",
    f: "Keep human. Priority depends on strategy, effort and users the model doesn't know. It can lay out evidence and trade-offs.",
    x: { i: "The findings with counts and severity, and a request to summarise trade-offs for each.", o: "A neat ranking with the top three “recommended for this sprint”.", c: "The summaries of trade-offs are useful. The ranking ignores that two issues share a fix and one affects your largest customer segment. You decide with engineering and product, using the AI summary as input." },
  }
});
