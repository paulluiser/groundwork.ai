/* Lesson-style detail for use cases: Technical writing and Engineering management. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Technical writing ---------- */
  "Drafting from real sources": {
    w: "Engineering shipped a new CLI command. You need a reference page by Friday. You have the help output, the code and the PR.",
    f: "Good fit when you draft from the source (help text, schema, code), then run every example.",
    x: { i: "The command's help output and code, with a request for a reference page marking anything not found in them.", o: "A complete page with five flags and three examples.", c: "Running the examples, one uses a format the command doesn't support. Drafting from help text rather than the PR avoided two renamed flags." },
    tk: { q: "Write the request you'd use to draft a reference page from a command's help output.", m: "“Using only the help output and code below, write a reference page: synopsis, each flag with its default, three examples. Mark anything you couldn't confirm from the source with [check]. Don't describe behaviour that isn't in the source.”", r: ["Limits to the source material", "Asks for defaults and examples", "Marks unconfirmed details", "Forbids invented behaviour"] },
    q: { q: "What's the best source for a command reference page?", a: 1, o: [["The PR description.", "Often outdated by merge time."], ["The help output and the code.", "Right."], ["A competitor's similar page for the same kind of command.", "Different tool."], ["The engineer's memory.", "Drifts."]] }
  },
  "Rewriting sections to stand alone": {
    w: "Your support bot keeps answering from the wrong section of the docs. You want to rewrite key pages so each section makes sense on its own.",
    f: "Good fit: AI rewrites well when told to remove references to other sections and name the scope.",
    x: { i: "A section and a request to rewrite it to stand alone, naming the product, plan and task in the first line.", o: "A clear rewrite that still says “as described above”.", c: "You remove the leftover reference, add the plan it applies to, and replace “it” with the setting's name." },
    tk: { q: "Rewrite to stand alone: “As mentioned, this only works on the higher plan. Turn it on there.”", m: "“Single sign-on (SSO) is available on the Business and Enterprise plans. To turn it on, a workspace admin opens Settings › Security › SSO and chooses Enable.”", r: ["Names the feature instead of “this”", "Names the plans", "Says who can do it and where", "Removes references to other sections"] },
    q: { q: "Which phrase breaks a section when it's retrieved on its own?", a: 0, o: [["“As described above”.", "Right."], ["“Workspace admins can…”", "Clear on its own."], ["“On the Business plan…”", "Names the scope."], ["“Open Settings › Security”.", "Clear."]] }
  },
  "Finding contradictions across pages": {
    w: "Your help centre has 300 pages written over five years. Customers keep finding conflicting instructions.",
    f: "Good fit: comparing many pages is tedious for people and quick for AI. Confirm each contradiction against the product.",
    x: { i: "Pages on one topic and a request to list contradictions, quoting both sentences.", o: "Twelve contradictions.", c: "Nine are real; three are different plans described correctly. You fix the nine and add plan names to the other three so they don't look contradictory." },
    tk: { q: "Write the request you'd use to find contradictions across a set of pages.", m: "“Compare these pages about exports. List every place where two pages say different things about the same fact (limits, steps, plan availability). Quote both sentences with their page titles. Don't judge which is right.”", r: ["Defines what counts as a contradiction", "Requires quoting both sentences", "Leaves judging correctness to you"] },
    q: { q: "Two pages give different export limits. What's the next step?", a: 2, o: [["Pick the larger limit.", "Guessing."], ["Delete one page.", "Premature."], ["Check the product, then fix or clarify both.", "Right."], ["Ask the AI which of the two pages is right.", "It can't see the product."]] }
  },
  "Flagging pages that may have drifted": {
    w: "Each release changes a dozen things. You want to know which of 600 pages might now be wrong.",
    f: "Good fit combined with exact search. Confirm before rewriting.",
    x: { i: "The release's change list and candidate pages, with a request to quote sentences that conflict with a change.", o: "Fifteen flagged sentences.", c: "Eleven are real. Exact search for a renamed setting found two pages the AI missed. You update both sets." },
    tk: { q: "Design a release-day drift check using search and AI.", m: "Start from the changelog; search docs for every renamed or removed term; ask AI to review candidate pages for sentences conflicting with each change, quoting them; a writer confirms each and updates; add removed terms to the prose linter.", r: ["Starts from the list of changes", "Uses exact search for renames", "Uses AI with quoted evidence", "Confirms before editing", "Prevents recurrence"] },
    q: { q: "Which tool best finds pages that mention a renamed setting?", a: 3, o: [["An AI summary of the docs.", "May miss pages."], ["Page view analytics.", "Popularity, not mentions."], ["A style linter running with its default rules.", "Doesn't know the old name."], ["Exact search for the old name.", "Right."]] }
  },
  "Drafting release notes": {
    w: "Release 4.2 has 30 merged tickets. Customers need notes written for them, not a ticket list.",
    f: "Good fit if you supply the tickets and audience, and check every claim against what shipped.",
    x: { i: "Merged tickets with labels, the audience, and a request to group by customer impact and leave out internal changes.", o: "Clear notes, including “Exports now support XLSX”.", c: "XLSX support was behind a flag and not released. You remove it and confirm every item against the release." },
    tk: { q: "Write three release note items for customers from these tickets: “Raise export row limit to 50k”, “Refactor auth middleware”, “Fix timezone bug in scheduled reports”.", m: "Improved: You can now export up to 50,000 rows at once (previously 10,000). Fixed: Scheduled reports now arrive at the right time in your own time zone. (The auth refactor is internal and left out.)", r: ["Writes for the customer's benefit", "Leaves out internal changes", "Is specific about numbers", "Groups by type of change"] },
    q: { q: "An AI release note mentions a feature behind a disabled flag. What should you do?", a: 1, o: [["Keep it; it's in the code.", "Customers can't use it."], ["Remove it until it's released.", "Right."], ["Mark it “coming soon”.", "A promise you may not keep."], ["Ask engineering to enable it before the release goes out.", "Not your call to rush."]] }
  },
  "Translating docs": {
    w: "Your docs need Spanish and German versions. Machine translation would take hours instead of weeks.",
    f: "Use with care. Quality varies by language and domain; UI terms and legal text need a fluent reviewer.",
    x: { i: "The pages, a glossary of UI terms in each language, and a request to keep terms exactly.", o: "Fluent translations.", c: "A fluent reviewer finds button names translated differently from the actual interface. Using the glossary fixes them." },
    tk: { q: "List what you'd give a translator (human or AI) to keep docs consistent with the product.", m: "A glossary of UI terms exactly as they appear in each language; product names that must not be translated; tone guidance; examples of approved translations; a list of legal text that needs legal review.", r: ["Supplies a UI term glossary", "Lists names not to translate", "Flags legal text for review", "Gives tone guidance"] },
    q: { q: "Which translation error is most confusing for users?", a: 2, o: [["Slightly formal tone.", "Minor."], ["Long sentences.", "Minor."], ["Button names that don't match the interface.", "Right."], ["Different punctuation style from the English original.", "Minor."]] }
  },
  "Clarity and style review": {
    w: "A long troubleshooting guide feels hard to follow. You want a clarity review before it's published.",
    f: "Use with care. AI suggests clearer wording; check that rewrites don't change meaning or accuracy.",
    x: { i: "The guide, your style guide, and a request for suggested edits with reasons, not a full rewrite.", o: "Thirty suggestions.", c: "Most improve clarity; two change “must” to “should”, which alters a security requirement. You reject those." },
    tk: { q: "Write the request for a style review that won't change meaning.", m: "“Review this guide against the style guide below. Suggest edits as a list: original sentence, suggested sentence, reason. Don't change technical meaning, requirements (must/should), numbers or commands.”", r: ["Asks for suggestions, not a silent rewrite", "Gives reasons for each edit", "Protects requirements and technical content"] },
    q: { q: "Why ask for suggested edits instead of a full rewrite?", a: 0, o: [["So you can see and reject changes in meaning.", "Right."], ["Rewrites are slower.", "Not the reason."], ["Style guides forbid full rewrites of published pages.", "No."], ["Suggestions are cheaper.", "Not the point."]] }
  },
  "Deciding what customers need to know": {
    w: "A security fix changes how API keys work. What to tell customers, and when, is your call with product and legal.",
    f: "Keep human. Communication about changes and risk carries legal and trust implications.",
    x: { i: "The change and a request to draft three versions of a customer notice for different levels of detail.", o: "Three drafts and a recommendation to send the shortest.", c: "The drafts help; the decision on content and timing is made with product, legal and security." },
    tk: { q: "List the questions to settle before notifying customers of a change to API keys.", m: "Who is affected, and what must they do? By when? Is there any security risk to disclose? What does legal require? Which channel reaches the right people? Who answers follow-up questions?", r: ["Identifies who's affected and what to do", "Sets deadlines", "Considers security and legal requirements", "Plans channel and follow-up"] },
    q: { q: "Who decides what customers are told about a security-related change?", a: 3, o: [["The writer alone.", "Needs others."], ["The AI that drafted the notice, since it saw every option.", "Can't be accountable."], ["The first customer to ask.", "No."], ["Product, legal and security, with the writer.", "Right."]] }
  },

  /* ---------- Engineering management ---------- */
  "Drafting team updates and plans": {
    w: "Your quarterly plan and monthly update to leadership take a full day each. An assistant can draft them from your notes and the team's board.",
    f: "Good fit for drafting. Check every claim against the board and keep commitments realistic.",
    x: { i: "Notes, board export and last quarter's plan, with a request to mark any claim not supported by the inputs.", o: "A confident update saying three projects are on track.", c: "One project slipped two weeks and the board shows it. You correct the status and add the plan to recover." },
    tk: { q: "Rewrite: “The team delivered strong results and is well positioned for next quarter.”", m: "“We shipped bulk export and the billing migration, and closed 42 of 50 planned items. The search rewrite slipped to April because of a dependency on the data team. Next quarter's top risk is on-call load after two departures.”", r: ["Uses specific outcomes and numbers", "Names what slipped and why", "Names a real risk"] },
    q: { q: "What's the main risk of an AI-drafted team update?", a: 0, o: [["It smooths over slips and risks.", "Right."], ["It's too short.", "Easy to fix."], ["It uses jargon.", "Minor."], ["It mentions too many people by name.", "Minor."]] }
  },
  "Preparing for a difficult conversation": {
    w: "Tomorrow you need to tell an engineer their on-call reliability has been a problem. You want to prepare what to say.",
    f: "Use with care. Useful for rehearsing wording; keep personal details out of general tools, and the judgement is yours.",
    x: { i: "An anonymised description of the situation and a request to suggest an opening and questions to ask.", o: "A thoughtful opening and good open questions.", c: "One suggested line assumes the cause (“I know you're disengaged”). You remove the assumption and keep the questions." },
    tk: { q: "Write an opening for a conversation about missed on-call pages.", m: "“I want to talk about on-call. Three pages in the last month weren't acknowledged within the 15-minute target. I'd like to understand what's been happening, and work out together what would help.”", r: ["States specific, observed facts", "Avoids assuming motives", "Invites the person's view", "Focuses on solving together"] },
    q: { q: "What should you keep out of a general AI tool when preparing?", a: 2, o: [["The general topic.", "Fine to describe."], ["Your own questions for the conversation and the order you'll ask them.", "Fine."], ["Identifying details and health or personal information.", "Right."], ["The meeting time.", "Irrelevant."]] }
  },
  "Onboarding with a codebase assistant": {
    w: "A new engineer joins next week. A codebase assistant can answer their questions any time.",
    f: "Use with care. It speeds up orientation; make sure they still build understanding and check answers against code.",
    x: { i: "An onboarding plan pairing assistant use with explaining-back sessions.", o: "The new engineer ships a change in week one.", c: "In their explaining-back session they can't say why a retry exists. You pair on it and add a note to the docs." },
    tk: { q: "Design a first-two-weeks plan that uses a codebase assistant without skipping learning.", m: "Days 1–3: tour with a buddy; use the assistant to explore, noting questions. Days 4–7: a small change with the assistant, explained back in their own words in the PR. Week 2: one task without AI, and a session explaining a core flow to the team.", r: ["Uses the assistant for exploration", "Requires explaining back in their own words", "Includes a task without AI", "Includes human pairing"] },
    q: { q: "What protects learning when new engineers use AI?", a: 1, o: [["Banning AI tools completely for their first year on the team.", "Unrealistic."], ["Explaining AI-assisted work in their own words.", "Right."], ["Using a more capable model.", "Doesn't build understanding."], ["Reading the docs once.", "Not enough."]] }
  },
  "Designing an AI tool trial": {
    w: "Your director asks whether to buy a coding assistant for the team. You have a month to find out.",
    f: "Use with care. A trial needs a baseline, a prediction and outcome measures you set before starting.",
    x: { i: "A trial plan with a baseline, prediction, half the team in each group, and a decision rule.", o: "Trial data after four weeks.", c: "Self-reported speed is up 30%; measured cycle time is unchanged and rework slightly up. The decision rule says don't buy yet; trial it narrowly on test writing." },
    tk: { q: "Write a decision rule for an AI tool trial before it starts.", m: "“Buy if median start-to-merge time falls by at least 15% and rework doesn't increase. If speed improves but rework rises, narrow use to the task types where rework didn't rise and trial again.”", r: ["Sets a threshold in advance", "Includes a quality guardrail", "Says what happens in mixed outcomes"] },
    q: { q: "Why measure both perceived and measured speed?", a: 3, o: [["Vendors require both measures before they'll sell licences.", "No."], ["Surveys are cheaper.", "Not the reason."], ["They always agree.", "They often don't."], ["They can diverge, so perception alone misleads.", "Right."]] }
  },
  "Drafting review feedback": {
    w: "Review season: eight reviews to write. An assistant can draft from your notes.",
    f: "Use with care. Drafts must rest on your specific observations; AI shouldn't propose ratings.",
    x: { i: "Your notes and a request to flag any judgement without a supporting note.", o: "Polished drafts with phrases like “great team player”.", c: "Four judgements have no supporting note. You replace them with specific examples or remove them." },
    tk: { q: "Rewrite: “Jo is a strong communicator.”", m: "“In the March migration, Jo wrote the daily update for three teams; the support lead said it was the first migration where they knew what to tell customers.”", r: ["Gives a specific situation", "Describes the behaviour", "States the impact"] },
    q: { q: "What should an assistant do in review writing?", a: 0, o: [["Check every judgement has supporting evidence.", "Right."], ["Assign ratings.", "That's your judgement."], ["Write reviews from activity data such as commits and tickets.", "Activity isn't performance."], ["Rank the team.", "No."]] }
  },
  "Reading vendor productivity reports": {
    w: "A vendor report says teams using its tool ship 55% faster. Your director wants your view.",
    f: "Use with care. AI can summarise methods; you judge whether the evidence applies to your team.",
    x: { i: "The report and a request to list what was measured, how, on which tasks, and who funded it.", o: "A summary of the headline claims.", c: "The 55% came from a lab task writing a small HTTP server, self-selected participants and vendor funding. You present it as a weak signal and propose your own trial." },
    tk: { q: "List the questions you'd ask about a productivity claim.", m: "What exactly was measured? On what tasks, and how similar are they to ours? Who took part, and how were they chosen? Was there a control group? Who funded it? What happened to quality?", r: ["Asks what was measured", "Asks about task similarity", "Asks about participants and controls", "Asks about funding and quality"] },
    q: { q: "Why does task similarity matter for productivity claims?", a: 2, o: [["It doesn't.", "It does."], ["Vendors choose random tasks, so results apply to any team and codebase.", "Not usually."], ["Effects differ between simple lab tasks and real codebases.", "Right."], ["It changes the price.", "Unrelated."]] }
  },
  "Redesigning interview exercises": {
    w: "Take-home submissions are all polished now, and they no longer predict how candidates do on-site.",
    f: "Use with care. AI can draft exercises; you design what to assess and how to score fairly.",
    x: { i: "A request to draft a review-based exercise with planted issues and a rubric.", o: "A PR with three planted issues and a draft rubric.", c: "The planted security issue is too obvious; you make it subtler and add a scoring guide so interviewers agree." },
    tk: { q: "Write a rubric line for assessing how a candidate reviews code.", m: "“Strong: finds the authorisation flaw, explains its impact and ranks it above the naming issue. Adequate: finds it when prompted. Weak: focuses on style and misses it.”", r: ["Describes observable behaviour at each level", "Values prioritisation, not just finding issues", "Can be applied consistently by different interviewers"] },
    q: { q: "What should interviews assess when candidates can use AI?", a: 1, o: [["Typing speed.", "Irrelevant."], ["Judgement: reviewing, explaining and debugging.", "Right."], ["Memorised syntax.", "Easily looked up."], ["Whether they used AI during the exercise or not.", "Use itself isn't the point."]] }
  },
  "Screening candidates or scoring performance": {
    w: "A vendor offers an AI tool that ranks CVs and predicts performance. HR is interested.",
    f: "Keep human. Hiring and evaluation are high-risk uses with legal duties and well-documented bias risks.",
    x: { i: "The vendor's documentation and a request to list legal and bias questions.", o: "A useful list of questions.", c: "The tool would be high-risk under the EU AI Act. With HR and legal, you decide not to use it for screening." },
    tk: { q: "List the questions to answer before any AI is used in hiring.", m: "Is this use high-risk under applicable law (e.g. EU AI Act, local rules on automated hiring tools)? Has the tool had an independent bias audit? Can candidates be told and request human review? What data was it trained on? Who is accountable for decisions?", r: ["Checks legal classification", "Requires a bias audit", "Provides notice and human review", "Names accountability"] },
    q: { q: "What did Amazon's abandoned recruiting tool show?", a: 0, o: [["Models trained on past hiring can repeat its bias.", "Right."], ["AI hiring tools are always fair once trained on enough data.", "No."], ["Bias disappears with more data.", "Not necessarily."], ["Only small companies face bias.", "No."]] }
  }
});
