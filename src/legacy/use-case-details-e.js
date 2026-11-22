/* Lesson-style detail for use cases: Technical writing and Engineering management. Format in use-case-details.js. */
GW.ucDetails = GW.ucDetails || {};
Object.assign(GW.ucDetails, {
  /* ---------- Technical writing ---------- */
  "Drafting from real sources": {
    w: "Engineering shipped a new CLI command. You need a reference page by Friday. You have the help output, the code and the PR.",
    f: "Good fit when you draft from the source (help text, schema, code), then run every example.",
    x: { i: "The command's help output and code, with a request for a reference page marking anything not found in them.", o: "A complete page with five flags and three examples.", c: "Running the examples, one uses a format the command doesn't support. Drafting from help text rather than the PR avoided two renamed flags." },
  },
  "Rewriting sections to stand alone": {
    w: "Your support bot keeps answering from the wrong section of the docs. You want to rewrite key pages so each section makes sense on its own.",
    f: "Good fit: AI rewrites well when told to remove references to other sections and name the scope.",
    x: { i: "A section and a request to rewrite it to stand alone, naming the product, plan and task in the first line.", o: "A clear rewrite that still says “as described above”.", c: "You remove the leftover reference, add the plan it applies to, and replace “it” with the setting's name." },
  },
  "Finding contradictions across pages": {
    w: "Your help centre has 300 pages written over five years. Customers keep finding conflicting instructions.",
    f: "Good fit: comparing many pages is tedious for people and quick for AI. Confirm each contradiction against the product.",
    x: { i: "Pages on one topic and a request to list contradictions, quoting both sentences.", o: "Twelve contradictions.", c: "Nine are real; three are different plans described correctly. You fix the nine and add plan names to the other three so they don't look contradictory." },
  },
  "Flagging pages that may have drifted": {
    w: "Each release changes a dozen things. You want to know which of 600 pages might now be wrong.",
    f: "Good fit combined with exact search. Confirm before rewriting.",
    x: { i: "The release's change list and candidate pages, with a request to quote sentences that conflict with a change.", o: "Fifteen flagged sentences.", c: "Eleven are real. Exact search for a renamed setting found two pages the AI missed. You update both sets." },
  },
  "Drafting release notes": {
    w: "Release 4.2 has 30 merged tickets. Customers need notes written for them, not a ticket list.",
    f: "Good fit if you supply the tickets and audience, and check every claim against what shipped.",
    x: { i: "Merged tickets with labels, the audience, and a request to group by customer impact and leave out internal changes.", o: "Clear notes, including “Exports now support XLSX”.", c: "XLSX support was behind a flag and not released. You remove it and confirm every item against the release." },
  },
  "Translating docs": {
    w: "Your docs need Spanish and German versions. Machine translation would take hours instead of weeks.",
    f: "Use with care. Quality varies by language and domain; UI terms and legal text need a fluent reviewer.",
    x: { i: "The pages, a glossary of UI terms in each language, and a request to keep terms exactly.", o: "Fluent translations.", c: "A fluent reviewer finds button names translated differently from the actual interface. Using the glossary fixes them." },
  },
  "Clarity and style review": {
    w: "A long troubleshooting guide feels hard to follow. You want a clarity review before it's published.",
    f: "Use with care. AI suggests clearer wording; check that rewrites don't change meaning or accuracy.",
    x: { i: "The guide, your style guide, and a request for suggested edits with reasons, not a full rewrite.", o: "Thirty suggestions.", c: "Most improve clarity; two change “must” to “should”, which alters a security requirement. You reject those." },
  },
  "Deciding what customers need to know": {
    w: "A security fix changes how API keys work. What to tell customers, and when, is your call with product and legal.",
    f: "Keep human. Communication about changes and risk carries legal and trust implications.",
    x: { i: "The change and a request to draft three versions of a customer notice for different levels of detail.", o: "Three drafts and a recommendation to send the shortest.", c: "The drafts help; the decision on content and timing is made with product, legal and security." },
  },

  /* ---------- Engineering management ---------- */
  "Drafting team updates and plans": {
    w: "Your quarterly plan and monthly update to leadership take a full day each. An assistant can draft them from your notes and the team's board.",
    f: "Good fit for drafting. Check every claim against the board and keep commitments realistic.",
    x: { i: "Notes, board export and last quarter's plan, with a request to mark any claim not supported by the inputs.", o: "A confident update saying three projects are on track.", c: "One project slipped two weeks and the board shows it. You correct the status and add the plan to recover." },
  },
  "Preparing for a difficult conversation": {
    w: "Tomorrow you need to tell an engineer their on-call reliability has been a problem. You want to prepare what to say.",
    f: "Use with care. Useful for rehearsing wording; keep personal details out of general tools, and the judgement is yours.",
    x: { i: "An anonymised description of the situation and a request to suggest an opening and questions to ask.", o: "A thoughtful opening and good open questions.", c: "One suggested line assumes the cause (“I know you're disengaged”). You remove the assumption and keep the questions." },
  },
  "Onboarding with a codebase assistant": {
    w: "A new engineer joins next week. A codebase assistant can answer their questions any time.",
    f: "Use with care. It speeds up orientation; make sure they still build understanding and check answers against code.",
    x: { i: "An onboarding plan pairing assistant use with explaining-back sessions.", o: "The new engineer ships a change in week one.", c: "In their explaining-back session they can't say why a retry exists. You pair on it and add a note to the docs." },
  },
  "Designing an AI tool trial": {
    w: "Your director asks whether to buy a coding assistant for the team. You have a month to find out.",
    f: "Use with care. A trial needs a baseline, a prediction and outcome measures you set before starting.",
    x: { i: "A trial plan with a baseline, prediction, half the team in each group, and a decision rule.", o: "Trial data after four weeks.", c: "Self-reported speed is up 30%; measured cycle time is unchanged and rework slightly up. The decision rule says don't buy yet; trial it narrowly on test writing." },
  },
  "Drafting review feedback": {
    w: "Review season: eight reviews to write. An assistant can draft from your notes.",
    f: "Use with care. Drafts must rest on your specific observations; AI shouldn't propose ratings.",
    x: { i: "Your notes and a request to flag any judgement without a supporting note.", o: "Polished drafts with phrases like “great team player”.", c: "Four judgements have no supporting note. You replace them with specific examples or remove them." },
  },
  "Reading vendor productivity reports": {
    w: "A vendor report says teams using its tool ship 55% faster. Your director wants your view.",
    f: "Use with care. AI can summarise methods; you judge whether the evidence applies to your team.",
    x: { i: "The report and a request to list what was measured, how, on which tasks, and who funded it.", o: "A summary of the headline claims.", c: "The 55% came from a lab task writing a small HTTP server, self-selected participants and vendor funding. You present it as a weak signal and propose your own trial." },
  },
  "Redesigning interview exercises": {
    w: "Take-home submissions are all polished now, and they no longer predict how candidates do on-site.",
    f: "Use with care. AI can draft exercises; you design what to assess and how to score fairly.",
    x: { i: "A request to draft a review-based exercise with planted issues and a rubric.", o: "A PR with three planted issues and a draft rubric.", c: "The planted security issue is too obvious; you make it subtler and add a scoring guide so interviewers agree." },
  },
  "Screening candidates or scoring performance": {
    w: "A vendor offers an AI tool that ranks CVs and predicts performance. HR is interested.",
    f: "Keep human. Hiring and evaluation are high-risk uses with legal duties and well-documented bias risks.",
    x: { i: "The vendor's documentation and a request to list legal and bias questions.", o: "A useful list of questions.", c: "The tool would be high-risk under the EU AI Act. With HR and legal, you decide not to use it for screening." },
  }
});
