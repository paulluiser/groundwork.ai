/* Use case guides, part 3: technical writing, engineering management, operations, customer support. */
Object.assign(GW.ucGuides, {
  /* ---------- Technical writing ---------- */
  "Drafting from real sources": {
    s: ["Collect the spec, code, CLI help and engineer notes.", "Ask for a draft that uses only those sources, citing which one supports each section.", "Run every command and code example.", "Check with the engineer who built it.", "Edit for your style guide."],
    y: ["Mark anything not in the sources as a question."],
    n: ["Publish examples you haven’t run."],
    t: "Ask it to list what a reader would need that the sources don’t cover.",
    k: ["It fills gaps with what similar products usually do."],
    p: "Using only the sources below (spec, CLI --help output, engineer notes), draft a docs page for [command]. After each section, name the source it came from. Where the sources are silent, add a TODO question instead of guessing."
  },
  "Rewriting sections to stand alone": {
    s: ["Pick sections that assistants or search will retrieve.", "Ask the model to replace “this”, “above” and “it” with the actual subject.", "Make sure each section names its task and product area.", "Read each section alone to check it makes sense."],
    y: ["Keep headings specific: “Enable SSO for a workspace”."],
    n: ["Add repetition that makes the page worse for human readers."],
    t: "Test by asking an assistant a question that the section should answer.",
    k: ["Standalone sections are slightly longer; that’s the trade-off."]
  },
  "Finding contradictions across pages": {
    s: ["Give the pages on one topic.", "Ask for statements that disagree, with the page and sentence for each.", "Check which is correct with the product team.", "Fix all pages and note the source of truth."],
    y: ["Focus on limits, defaults and prices, where contradictions hurt most."],
    n: ["Assume the newer page is right."],
    t: "Ask for statements that differ only in numbers.",
    k: ["Long inputs can be read unevenly; check in batches."]
  },
  "Flagging pages that may have drifted": {
    s: ["Give the list of settings, flags and fields changed in recent pull requests.", "Ask which pages mention them.", "Check each flagged page.", "Update and link the docs change to the code change."],
    y: ["Run this on a schedule."],
    n: ["Rely on it as the only drift check."],
    t: "Put docs updates in the same pull request as the code change.",
    k: ["It finds mentions; it can’t tell whether a mention is still correct."]
  },
  "Drafting release notes": {
    s: ["Collect merged pull requests and their descriptions.", "Ask for customer-facing notes grouped as new, improved and fixed.", "Remove internal changes.", "Check each note with the engineer who made the change.", "Check nothing promises future work."],
    y: ["Write in terms of what users can now do."],
    n: ["Publish notes based only on PR titles."],
    t: "Ask which changes might break someone’s workflow. They need a clear notice.",
    k: ["PR titles are often vague or misleading about user impact."]
  },
  "Translating docs": {
    s: ["Give a glossary of product terms and how to translate them.", "Ask for a draft translation.", "Have a fluent reviewer check meaning and terminology.", "Check UI strings match the localised product.", "Publish with a review date."],
    y: ["Keep a translation memory for consistency."],
    n: ["Publish machine translation of safety, legal or billing content unreviewed."],
    t: "Ask the model to flag sentences that were ambiguous in the source.",
    k: ["Quality varies by language; less common languages need more review."]
  },
  "Clarity and style review": {
    s: ["Give the page and your style guide.", "Ask for comments on unclear paragraphs and missing steps.", "Decide which comments to act on.", "Test the steps yourself."],
    y: ["Use rule-based linters for mechanical style rules."],
    n: ["Accept rewrites that change technical meaning."],
    t: "Ask it to read as a first-time user and say where it got lost.",
    k: ["It can’t tell whether a step is missing if it doesn’t know the product."]
  },
  "Deciding what customers need to know": {
    s: ["Use AI to draft notices for breaking changes.", "Decide with product and support what customers must hear, and when.", "Review legal and contractual commitments."],
    y: ["Give dates and migration steps."],
    n: ["Let a draft decide the deprecation timeline."],
    t: "Ask support which customers will be affected first.",
    k: ["Notices can have contractual weight."]
  },

  /* ---------- Engineering management ---------- */
  "Drafting team updates and plans": {
    s: ["Collect tracker data, goals and your notes.", "Ask for a draft in your template.", "Check every figure.", "Add judgments and priorities in your own words."],
    y: ["Separate facts from opinion."],
    n: ["Send a plan the team hasn’t seen."],
    t: "Ask what a sceptical director would question.",
    k: ["Plans need the team’s buy-in, which a draft can’t provide."]
  },
  "Preparing for a difficult conversation": {
    s: ["Describe the situation without names or identifying details.", "Ask for wording options and likely questions.", "Rehearse out loud.", "Use your own words in the conversation."],
    y: ["Focus on behaviour and impact."],
    n: ["Paste personal details or HR records into an unapproved tool."],
    t: "Ask for the response you’d least like to hear, and prepare for it.",
    k: ["It doesn’t know the person; real conversations go off-script."]
  },
  "Onboarding with a codebase assistant": {
    s: ["Give new starters an approved assistant with read access to the repo.", "Pair it with a human buddy.", "Ask new starters to confirm answers by reading code or running tests.", "Collect wrong answers to improve the docs."],
    y: ["Encourage questions to people as well."],
    n: ["Replace onboarding conversations with the tool."],
    t: "Wrong assistant answers often point at missing or outdated docs.",
    k: ["It can’t explain why decisions were made unless that’s written down."]
  },
  "Designing an AI tool trial": {
    s: ["Pick outcomes to measure: lead time, change failure rate, survey results.", "Take a baseline before the trial.", "Run the trial long enough to cover learning time.", "Compare against the baseline or a control group.", "Decide with the team."],
    y: ["Include quality measures, not only speed."],
    n: ["Use vendor dashboards as the measure."],
    t: "Ask developers where time actually went, weekly.",
    k: ["Short trials capture novelty and learning effects, not steady state."]
  },
  "Drafting review feedback": {
    s: ["Collect specific evidence: work, outcomes, feedback.", "Decide the substance yourself.", "Ask for help with clear wording.", "Read it as the recipient would.", "Deliver it in a conversation, not only in writing."],
    y: ["Use specific examples."],
    n: ["Let the model decide the rating or the message."],
    t: "Ask it to point out vague or loaded phrases.",
    k: ["Many organisations restrict AI use in performance processes; check policy."]
  },
  "Reading vendor productivity reports": {
    s: ["Ask the model to summarise the report and its definitions.", "Check what each metric measures.", "Compare with your own outcome measures.", "Report conclusions with caveats."],
    y: ["Ask how “accepted” and “active” are defined."],
    n: ["Quote acceptance rates as productivity."],
    t: "Ask what the report doesn’t measure.",
    k: ["Vendor metrics measure usage, which is not the same as value."]
  },
  "Redesigning interview exercises": {
    s: ["Decide what you need to learn about candidates.", "Ask for exercises that test understanding: explaining, debugging, extending.", "Try them with current team members.", "Tell candidates what AI use is allowed."],
    y: ["Ask candidates to explain their reasoning."],
    n: ["Use AI to score candidates."],
    t: "Debugging and code-review exercises reveal understanding even when AI is allowed.",
    k: ["Rules on AI in hiring vary by country and change."]
  },
  "Screening candidates or scoring performance": {
    s: ["Don’t use AI tools to rank candidates or score people.", "Use structured, human assessment.", "Check your legal obligations."],
    y: ["Keep decisions explainable by a person."],
    n: ["Adopt a tool that ranks people without legal review."],
    t: "If you can’t explain a decision to the person affected, don’t make it that way.",
    k: ["Several jurisdictions regulate automated decisions about people."]
  },

  /* ---------- Operations ---------- */
  "Generating incident hypotheses": {
    s: ["Give logs, metrics, recent changes and the start time.", "Ask for ranked hypotheses with evidence for and against.", "Test cheapest hypotheses first.", "Record what was ruled out.", "Mitigate based on evidence."],
    y: ["Check third-party status pages early."],
    n: ["Act on the first suggestion without evidence."],
    t: "Ask what changed in the hour before the start time.",
    k: ["It can anchor on recent deploys even when timing rules them out."]
  },
  "Drafting runbooks": {
    s: ["Collect notes and past incident timelines.", "Ask for step-by-step procedures with checks after each step.", "Test the runbook in a non-production environment.", "Have on-call engineers review.", "Schedule regular tests."],
    y: ["Include how to tell if a step worked."],
    n: ["Publish an untested runbook."],
    t: "Ask for the rollback for every step.",
    k: ["Commands may be wrong for your versions and environment."]
  },
  "Drafting Terraform and manifests": {
    s: ["Describe the resource, its access and its environment.", "Ask for code that follows your modules and naming.", "Run plan and read it line by line.", "Run policy checks.", "Review and apply through the pipeline."],
    y: ["Scope permissions to specific resources and actions."],
    n: ["Apply generated code without reading the plan."],
    t: "Ask it to list every permission the code grants.",
    k: ["Generated infrastructure code often defaults to broad permissions."]
  },
  "Writing policy-as-code rules": {
    s: ["Write the rule in plain words.", "Ask for a policy in your engine’s language.", "Test with resources that should pass and fail.", "Run in warn mode first.", "Enforce."],
    y: ["Keep tests with the policy."],
    n: ["Enforce an untested policy."],
    t: "Ask for edge cases the rule might wrongly block.",
    k: ["Policy syntax differs across engines and versions."]
  },
  "Suggesting commands during an incident": {
    s: ["Ask for diagnostic commands first, not fixes.", "Read every command before running it.", "Run read-only commands first.", "Get a second person to check any change.", "Log what you ran."],
    y: ["Prefer runbook steps."],
    n: ["Run destructive commands from a chat window."],
    t: "Ask what each command changes, if anything.",
    k: ["A wrong command under pressure can make an incident worse."]
  },
  "Switching model versions": {
    s: ["Run the eval set on the new version.", "Compare outputs, latency and cost.", "Roll out gradually.", "Monitor quality signals.", "Keep the old version available for rollback."],
    y: ["Pin model versions in config."],
    n: ["Let the provider’s default upgrade happen silently."],
    t: "Read a sample of changed outputs, not only the scores.",
    k: ["New versions change behaviour in ways evals may not cover."]
  },
  "Drafting postmortems": {
    s: ["Give the timeline, chat and metrics.", "Ask for a draft in your template.", "Check every timestamp.", "Write the contributing factors and actions with the team.", "Keep it blameless."],
    y: ["Separate what happened from why."],
    n: ["Publish a draft that blames individuals."],
    t: "Ask which decisions made sense at the time with the information available.",
    k: ["Drafts reflect what was written in chat, not what people knew."]
  },
  "Applying changes to production": {
    s: ["Let AI prepare changes.", "Keep apply behind review and approval.", "Use pipelines, not direct access."],
    y: ["Log every change with who approved it."],
    n: ["Give an agent production write access."],
    t: "Preparation is where AI saves time; approval is where you stay safe.",
    k: ["One wrong apply can delete data or expose systems."]
  },

  /* ---------- Customer support ---------- */
  "Drafting replies for agents": {
    s: ["Give the ticket and the relevant help articles.", "Ask for a draft that cites the article it used.", "Check every policy claim and detail against the record.", "Edit for tone.", "Send in your own name."],
    y: ["Remove promises about money or timelines you can’t confirm."],
    n: ["Send drafts unread."],
    t: "Ask for the article link to include, so the customer can check too.",
    k: ["Drafts mix up details between similar tickets."],
    p: "Ticket: [paste]. Relevant help articles: [paste]. Draft a reply that answers only from these articles, links the article used, and doesn’t promise refunds, credits or dates. Flag anything you couldn’t answer from the articles."
  },
  "Summarising long tickets": {
    s: ["Ask for a summary: problem, steps tried, current state, customer sentiment.", "Check against the latest messages.", "Add it to the ticket for the next agent."],
    y: ["Include what was promised to the customer."],
    n: ["Drop details the customer will expect you to remember."],
    t: "Ask for the customer’s exact words on their main complaint.",
    k: ["Summaries can lose commitments made deep in a thread."]
  },
  "Drafting articles from solved tickets": {
    s: ["Remove customer details from the ticket thread.", "Ask for an article draft with steps.", "Have an expert check the steps.", "Publish with an owner and review date."],
    y: ["Use the words customers search with."],
    n: ["Publish workarounds that aren’t approved."],
    t: "Ask for the search terms a customer would type.",
    k: ["One ticket may describe an unusual case."]
  },
  "Finding help-centre gaps": {
    s: ["Export ticket themes and help-centre searches with no result.", "Ask for themes with no matching article.", "Check the counts.", "Prioritise and assign articles."],
    y: ["Track repeat contacts after publishing."],
    n: ["Write articles for themes with one ticket."],
    t: "Searches with no clicks are as useful as searches with no results.",
    k: ["Ticket tags may be inconsistent."]
  },
  "Routing and tagging tickets": {
    s: ["Build a test set of tickets tagged by people.", "Measure accuracy, especially on urgent tickets.", "Start with suggestions agents confirm.", "Monitor misroutes.", "Automate only categories that meet the bar."],
    y: ["Give urgent categories a human check."],
    n: ["Route urgent issues automatically without testing."],
    t: "Track how often agents change the suggested tag.",
    k: ["Accuracy drops when products or issues change."]
  },
  "AI quality scoring": {
    s: ["Calibrate AI scores against human reviewers.", "Use scores for coaching patterns, not discipline.", "Let agents challenge scores.", "Re-calibrate regularly."],
    y: ["Share how scoring works with agents."],
    n: ["Use AI scores alone in performance reviews."],
    t: "Review the tickets where AI and humans disagree most.",
    k: ["Scores can be biased by ticket type or language."]
  },
  "A customer-facing assistant": {
    s: ["Test on real past tickets before launch.", "Make handoff to a person easy and visible.", "Limit answers to reviewed help content.", "Monitor repeat contacts and sampled accuracy.", "Keep a way to switch it off."],
    y: ["Show the article behind each answer."],
    n: ["Let it promise refunds, exceptions or policy changes."],
    t: "Sample conversations weekly and read them in full.",
    k: ["Courts have held companies to what their chatbots said."]
  },
  "Refunds and exceptions": {
    s: ["Route refund and exception requests to a person.", "Let AI gather details and draft the case.", "A person with authority decides."],
    y: ["Make the handoff fast."],
    n: ["Let an assistant promise money."],
    t: "Gathering the details is where AI saves the time here.",
    k: ["Promises about money carry legal weight."]
  }
});
