# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individual members of software teams who take the course themselves, at their own pace: product managers, designers, engineers, QA, security, data and analytics, technical writers, delivery and project managers, engineering managers, operations and customer support. Most already meet AI tools at work. Their job is to use those tools well: knowing what a model is doing, where it fails, and how to check its output before it reaches a customer. A General path serves anyone whose role isn't listed.

## Product Purpose

Groundwork is a free, self-paced course on understanding AI and using it thoughtfully at work. A learner finishes able to explain how a model produces text, decide what it should and shouldn't see, write requests like a good brief, recognise common failure modes, check output in proportion to the risk, and set limits on tools and agents that take actions. Success is a learner who keeps the judgment theirs: they accept, edit, reject or escalate AI-assisted work, and can say why.

## Positioning

Role-shaped rather than generic. Everyone learns the same core lessons, then picks up to three roles. Those roles add their own lessons and swap the worked examples in the core lessons for examples from their own work. Every lesson is built around practice that gives feedback, such as sampling from a model, filling a context window, flagging claims in an AI draft or running generated code. It isn't built around reading about AI.

## Operating Context

- Intended to be public and free, hosted as a static site on Vercel. There are no accounts and no server.
- Flow: landing page, then Start (or Continue for a returning learner), then choose roles, then the course. The course has four tabs: Lessons, Exercises, Glossary and Progress.
- Roles and progress save in the browser (localStorage). To move to another device, the learner copies a nine-character progress code (GW-XXX-XXX-XXX) or a resume link from the Progress tab. The code holds their roles and completed lessons.
- Learners come back to it over days, so the course offers a course home with a progress ring, the "next lesson" on their path, search, and a glossary.

## Capabilities and Constraints

- **Structure:** 21 lessons in four parts.
  - How it works: lessons 1–4.
  - Working with it: lessons 5–8.
  - In your role: twelve role lessons, 9–20.
  - Capstone: lesson 21, bringing AI into a team.
- **Roles:**
  - Up to three per learner. The first pick is the main role and sets the core-lesson examples.
  - General is exclusive and gives the core lessons plus the capstone.
  - A single role also adds its neighbouring role's lesson.
- **Lesson parts:** each lesson has a lede, outcomes, worked examples, an interactive exercise, a key idea, pitfalls, a "try it this week" task, three knowledge checks and numbered sources.
- **Build:** static HTML, CSS and JS with hash routing and no framework. It deploys as plain static files. Per-user data never leaves the browser except inside a progress code the learner copies themselves.
- **Motion:** the landing animations are scoped so content stays visible without scripts, they respect reduced motion, and they offer a pause control.
- **Terminology:** "path" means the learner's sequence of lessons, "main role" means the first pick, and "neighbouring role" means the lesson a single role adds.

## Brand Commitments

- Name: Groundwork, with the line "AI for software teams".
- Voice: neutral, plain English, no hype. It states what AI is good at and where it fails, without cheerleading or alarm.
- Palette: white 60%, black 30%, cobalt accent 10%. The user set this palette and it is binding.

## Evidence on Hand

- Each lesson cites real, linked sources, such as Moffatt v. Air Canada (2024 BCCRT 149) and Brynjolfsson, Li and Raymond (NBER w31161). They are listed in each lesson's sources section.
- There are no testimonials, learner counts, completion rates, ratings, company logos or case studies. Future work must not invent any of these.

## Product Principles

1. Neutral, plain-English teaching. Explain the mechanism, then the consequence, never the hype.
2. Learn by doing. Every lesson has practice that gives feedback, not just reading.
3. Only real, cited evidence. Never use an invented number, quote, source or outcome.
4. The judgment stays with the learner. AI drafts; the person checks, decides and can explain why.
5. The learner's own role shapes the course, but the shared core stays the same for everyone.
