# Kern: content audit and improvement plan

*22 November 2026. Covers all 45 lessons, 57 exercises and 133 knowledge-check questions in `src/legacy/content/`.*

## Summary

The course is accurate, plainly written and well sourced, and the core lessons (1–8) are solid. The gap is depth and rigour everywhere else:

- The 36 role-track lessons and the capstone are short. They average about 880 words, against roughly 1,700 for the core lessons, yet are labelled 30–35 minutes.
- Practice is mostly recognition: flagging claims or sorting cases. There is little open work with a model answer.
- Assessment can be passed without knowing the material. In 92% of questions the right answer is the longest option.
- Completion is self-reported, and certificates follow from it.

Learners get the right ideas but not enough worked examples, practice or feedback to apply them at work.

## What the audit measured

| Measure | Core lessons (1–8) | Role-track lessons (36) | Capstone |
|---|---|---|---|
| Average words (excluding sources) | 1,684 | 883 | 759 |
| Stated time | 20–35 min | 25–35 min | 35 min |
| Realistic time (reading at 200 wpm, plus exercises) | 15–25 min | 8–12 min | 12–15 min |
| Exercises per lesson | 1–4 (avg 2.0) | 1 (2 in four lessons) | 2 |
| Knowledge-check questions | 3–4 | 2–3 | 2 |
| Sources | 3–7 | 1–6 (mostly 2–4) | 3 |
| Worked example of a real artefact | Some | Rare | No |

Exercise formats across all 57 exercises:

| Format | Count | What it asks |
|---|---|---|
| Flag the claims | 21 | Click sentences in a draft that need checking |
| Sort the cases | 13 | Drag items into categories |
| Decide (multi-step choices) | 6 | Pick one of three options at each step |
| One-off simulations and builders | 17 | Tokenizer, sampler, retrieval, agent loop, eval simulation, prompt builder, agreement builder and others |

## Findings

### 1. Role-track lessons are too thin for their stated time

Example: *Shipping AI features as a PM* (lesson 11, 704 words) introduces eval sets, failure design, cost per use and post-launch measurement. Each gets one or two paragraphs. There is no sample eval set, no filled-in spec, no cost calculation and no example of a failure state, so the learner is told what to do but never sees it done. Every role-track lesson follows this pattern.

The stated 30 minutes also overstates the real time two to three times. That undermines trust in the estimates, and it hides how little practice the lessons contain.

### 2. Knowledge checks reward test-taking, not understanding

- All 133 questions are single-answer, with three options.
- In 123 of 133 (92%) the correct answer is the longest option. A learner who always picks the longest answer scores above 90%.
- Distractors are often obviously wrong, for example "Agree, and set a target of 50%", rather than plausible misconceptions.
- Questions test recall of the lesson's own sentences. Few put the learner in a new situation.
- Checks only appear at the end of a lesson, with nothing during it to retrieve what was just read.

### 3. Outcomes promise more than the practice delivers

Outcomes use action verbs ("Define quality with an eval set", "Specify how the product behaves when the AI is wrong", "Design a small, measurable AI pilot"). The matching practice is one recognition exercise and three multiple-choice questions. No activity asks the learner to produce the thing the outcome names.

### 4. Exercises give away their answers and stop at recognition

- In 22 of 56 exercises, the explanation (often the answer list) is printed directly below the exercise, so it can be read before trying.
- 34 of 57 exercises are claim-flagging or sorting. These suit the core idea, checking AI output, but repeating them in every role lesson makes the practice feel the same everywhere.
- There is almost no open-response work: rewriting a weak prompt, reviewing an AI pull request against a rubric, or writing test cases and comparing them with a model answer. The "You decide" drafts are the only exception.
- Feedback is per option and short. There is no worked solution showing how an expert reasons through the whole task.

### 5. Missing teaching elements

Most lessons lack these:

- **A worked example:** a real artefact (prompt, spec, eval set, threat model, runbook) shown before and after, with notes.
- **Common misconceptions:** the wrong mental models learners bring, and why they fail.
- **A recap:** a short summary card to revisit.
- **A diagnostic question at the start**, so experienced learners can see what to focus on.
- **Templates to take away:** "Try it this week" appears in 37 lessons, but only two templates exist to use with it.

### 6. The capstone isn't a capstone

It's 759 words, a clause picker for a team agreement, and a sequence of multiple-choice decisions about one feature. There's no project to produce, no rubric, no reflection and no evidence of mastery. It also comes after role lessons that are thinner than the core, so the course gets lighter as it goes on.

### 7. Completion and certificates aren't tied to learning

"Mark lesson complete" is a button anyone can press without answering a question. Certificates follow from those clicks. That's honest (the certificate says it's self-reported), but it means a certificate shows clicks, not skill.

### 8. Coverage gaps

| Topic | Lessons that cover it | Why it matters |
|---|---|---|
| Copyright, licensing and ownership of generated code and content | 0 | Common legal question for every role |
| Cost estimation (tokens, per-user cost, model choice) | 1 | Needed by product, engineering, management |
| Multimodal input (images, PDFs, screenshots, audio) | 1 | Now a daily use for design, QA, support |
| Accessibility of AI features and AI output | 4, briefly | Required by law in many markets |
| Bias and fairness in AI features | 3, briefly | Core responsible-AI topic |
| Environmental cost of AI use | 0 | Increasingly asked about in teams |
| Hands-on evaluation (building and running an eval set) | 1 simulation | The method the course recommends most |

### 9. Role specificity

33 roles share 12 three-lesson tracks, so 21 roles (for example mobile developer, UX writer, data engineer, SRE) learn from a neighbouring role's examples. That's a reasonable start, but those learners see few examples from their own work.

### 10. Freshness

Several claims are time-sensitive: benchmark scores (for example Spider 2.0 at 21.3%), productivity studies, model behaviour and prices. None carry an "as of" date, and the course has no review schedule. Role-track lessons often rest on two sources.

## The standard for every lesson

Each lesson should follow this structure. Word counts are targets, not limits.

| Part | Purpose | Target |
|---|---|---|
| 1. Situation | A realistic work moment where the skill matters | 100–150 words |
| 2. Quick check | One diagnostic question, so learners see what they already know | 1 question |
| 3. Concepts | The ideas, each with one concrete example | 600–900 words |
| 4. Worked example | A real artefact shown weak, then strong, with notes in the margin | 300–500 words |
| 5. Guided practice | An exercise with hints. The explanation stays hidden until the learner has tried it | 1 |
| 6. Independent practice | An open task (write, fix or review something), then a model answer and a rubric to check against | 1 |
| 7. Common misconceptions | Three or four wrong beliefs, and why each fails | 150–250 words |
| 8. Recap card | Five to seven points to remember, also added to Review | 1 |
| 9. Knowledge check | Five scenario questions, four plausible options of similar length, feedback on every option | 5 |
| 10. Use it at work | The "Try it this week" task, with a template to copy | 1 |
| 11. Sources | Dated, with a "last reviewed" date for the lesson | 3–6 |

Lessons following this structure come to roughly 1,800–2,500 words and a realistic 30–40 minutes including practice.

**Quality bar a lesson must meet before release**

- Every outcome has at least one activity that asks the learner to produce or decide something, not only to recognise it.
- No knowledge-check answer can be found from length, wording or position. Correct answers are spread evenly across positions, and no more than about a third of correct answers are the longest option.
- No explanation is visible before the learner tries the exercise.
- The stated time matches a timed run-through within 20%.
- Every statistic or benchmark carries its date.

## Assessment and certificates

1. **A mastery check per lesson.** "Mark lesson complete" becomes available after the knowledge check is answered, with 4 of 5 correct and retries allowed. Progress still saves locally, and progress codes stay the same format.
2. **A track assessment.** Ten scenario questions drawn from all three lessons in the track, needing 80% to unlock the certificate.
3. **A real capstone project.** The learner chooses a task from their own work and produces, in a guided form:
   - a pilot plan (task, baseline, prediction, measure)
   - a short AI-assisted work sample with their review notes
   - a team agreement

   They then score it against a published rubric. The result can be downloaded as a document and shared with a manager.
4. **Spaced review of concepts as well as terms.** Recap cards from completed lessons join the existing term review.

## New and expanded exercises

| Exercise | Where | What the learner does |
|---|---|---|
| Fix the prompt | Asking well, every track | Rewrite a weak prompt, then compare with a model answer and a checklist |
| Review the AI pull request | Engineering, QA, security | Mark problems in a diff, then see an expert's review |
| Build an eval set | Product, AI features, QA | Write five test inputs with must and must-not rules, then run them against sample outputs |
| Cost calculator | Choosing models, product, engineering management | Estimate monthly cost from usage, then compare two models |
| Threat-model the feature | Security, engineering | Fill in a threat model for an AI feature, then compare |
| Write the failure state | Design | Write the messages and fallbacks for an AI feature that is wrong, slow or offline |
| Branching scenario per track | All tracks | A longer situation where early choices change later steps |

The claim-flagging and sorting formats stay, but each track lesson uses at least one other format.

## Content to add

- **New core lesson: Ownership, licensing and cost.** Copyright and licences for generated code and content, company policy, token costs, and environmental cost.
- **Expanded sections:**
  - multimodal input (images, PDFs, screenshots) in *What the model can see*
  - accessibility and fairness in *Designing AI features* and *Shipping AI features as a PM*
- **Role examples:** for the 21 roles that share a track, add a role-specific worked example and a "Use it at work" task to each track lesson, so a mobile developer sees mobile code and a UX writer sees copy.

## Plan

| Phase | Scope | Work | Time |
|---|---|---|---|
| 0. Quick fixes | Whole course | Rebalance all 133 quiz questions (plausible distractors, similar lengths, answers spread across positions). Hide exercise explanations until the exercise is tried. Correct stated times. Add dates to time-sensitive claims and a "last reviewed" date to each lesson. | 1 week |
| 1. Template and pilot | One track, end to end (suggest Product: lessons 9–11) | Build the lesson structure, the new exercise types it needs, open-response practice with model answers, and the mastery check. Review it with you before going further. | 2 weeks |
| 2. Core lessons | Lessons 1–8 | Add worked examples, misconceptions, recap cards and five scenario questions each. Add multimodal and the new ownership and cost lesson. | 3 weeks |
| 3. Role tracks | The other 11 tracks (33 lessons) | Rebuild each lesson to the structure, with one signature exercise per track and role examples for shared tracks. | 6–8 weeks |
| 4. Assessment | Whole course | Track assessments, certificates tied to them, the capstone project and rubric, concept cards in Review. | 2–3 weeks |
| 5. Upkeep | Ongoing | Review sources and time-sensitive claims every quarter. Timed run-throughs for any lesson that changes. | Quarterly |

**Things that must not break:** lesson ids, `CODE_LESSONS` order and the `gw-*` storage keys stay as they are, so progress codes, links and saved progress keep working. Lessons can grow and gain sections without changing ids.

## How to judge whether it worked

There are no analytics, so measure in ways that respect the no-tracking promise:

- **Timed run-throughs:** five testers per lesson, comparing actual time with the stated time.
- **Before and after:** a scenario test taken at the start and the end of a track by a small group of volunteers.
- **Expert review:** one practitioner per role reviews their track against the quality bar.
- **Optional feedback:** a single "Was this useful?" link per lesson that opens an email or a form, with no tracking.

## Progress (22 November 2026)

Phases 0 to 3 are done for all 45 lessons:

| | Before | After |
|---|---|---|
| Words (excluding sources) | 46,018 | 85,808 |
| Exercises | 57 | 104 (47 new open tasks with model answers and rubrics) |
| Quiz questions | 133, three options | 270, four options (including 45 warm-up questions) |
| Right answer is the longest option | 92% | 15% |
| Lessons with a worked example, misconceptions and recap | Few | All 45 |
| Lesson times | Fixed, often 2–3× too long | Worked out from each lesson's content |
| Explanations visible before trying an exercise | 22 exercises | None: they open on request |
| Last-reviewed date | None | Every lesson |

Every lesson now has an opening situation, a warm-up question, at least one worked example, an open task, a Try it this week exercise, common misconceptions, a recap, five balanced scenario questions and additional sources. The capstone now includes a three-part project: a pilot plan, a reviewed work sample and a team agreement.

Phase 4 is also done:

- **Mastery check:** “Mark lesson complete” unlocks once 4 of 5 knowledge-check questions are answered correctly first time; learners can retake the check. Lessons completed before this change stay complete. First answers are kept in `gw-checks`.
- **Track assessments:** `#assessment/<track>` draws 10 questions from across the track's lessons, in a new order with shuffled options each time; 8 correct passes. Results are kept in `gw-assess`.
- **Certificates** need every lesson done and the assessment passed.
- **Review** has a “Key ideas” option: one card per finished lesson, built from its recap.

New localStorage keys (`gw-tasks`, `gw-checks`, `gw-assess`) stay in the browser and aren't part of progress codes, so codes and links are unchanged.

Tools: `scripts/expand_lesson.py` applies a lesson spec from `scripts/lesson-specs/`; `scripts/check_lessons.cjs` checks every lesson loads, citations resolve and answers aren't given away by length; `scripts/balance_report.cjs` lists any question whose answer is the longest option.
