SPEC = dict(
file="11-qa.js",
reviewed="2026-11",
outcomes=["Use risk to decide which AI-generated test ideas are worth keeping."],
situation="""<p>An assistant gives you 64 test cases for a new “change email address” feature in under a minute. They're tidy, numbered and cover every field. Reading them, you notice they test the form thoroughly and the risk barely at all: nothing about the confirmation link going to the old address, nothing about someone else's session, nothing about what happens to pending invoices sent to the old email.</p>
<p>AI produces test ideas in volume. The tester's job is deciding which ones matter, and adding the ones only someone who understands the system would think of.</p>""",
warmup=dict(q="An assistant generates 64 test cases for a feature. What's the best first step?", a=2, opts=[
  ("Automate all 64, since more coverage is always better.", "Volume isn't coverage of risk; many may test the same thing."),
  ("Run the first ten and see whether they find any bugs at all.", "Order of generation isn't order of importance."),
  ("Rank them by risk and add the cases only you know to test.", "Right. Risk decides what's worth running and what's missing."),
  ("Ask the assistant which of its own cases are most important.", "It doesn't know your system's risks."),
 ]),
sections="""<h2>Risk first, then ideas</h2>
<p>Risk-based testing asks two questions about every area: how likely is it to fail, and how bad would it be if it did? AI is good at the long tail of input variations (empty fields, long strings, special characters). It's weak at the risks specific to your system: integrations, permissions, money, data that outlives the feature. Start with a short risk list of your own, then use AI to fill in variations under each risk, rather than the other way round. Security testing guides like OWASP's are a good source of the risks that matter most for features touching accounts and identity.[S1]</p>
<h2>Worked example: sorting generated test ideas</h2>
<div class="tbl"><table><thead><tr><th>Generated idea</th><th>Risk</th><th>Keep?</th></tr></thead><tbody>
<tr><td>Email field rejects “user@”</td><td>Low: validation, visible</td><td>Keep one representative case</td></tr>
<tr><td>Email field accepts 254-character address</td><td>Low</td><td>Keep, cheap to automate</td></tr>
<tr><td>Cases 12–31: twenty other invalid formats</td><td>Low, duplicative</td><td>Collapse into one data-driven test</td></tr>
<tr><td>(Missing) Confirmation goes to the new address, and a notice to the old one</td><td>High: account takeover</td><td>Add</td></tr>
<tr><td>(Missing) Change requires recent password entry</td><td>High: stolen session</td><td>Add</td></tr>
<tr><td>(Missing) Invoices already scheduled still reach the right address</td><td>Medium: billing</td><td>Add, ask product</td></tr>
</tbody></table></div>
<ul class="wx-notes">
<li><strong>Twenty generated cases became one.</strong> Variations of the same risk are cheap to automate together.</li>
<li><strong>The three most important cases weren't generated at all.</strong> They come from knowing how accounts are attacked and how billing works.</li>
<li><strong>The billing case raises a product question</strong>, which is often what good testing does.</li>
</ul>
<h2>Your turn: a risk list before the test ideas</h2>
<div class="activity"><div class="activity-h"><span class="tag">Your turn</span><span class="ttl">Risks for “delete my account”</span></div><div class="activity-b">
<p>Before asking an assistant for test cases, write the risk list for a new “delete my account” feature in a subscription product. For each risk, say how likely and how severe, and one test that would catch it.</p>
<div data-w="task" data-key="qa-risks">
<div class="task-model"><ul>
<li><strong>Someone else deletes the account</strong> (stolen session). High severity. Test: deletion requires recent re-authentication.</li>
<li><strong>Billing continues after deletion.</strong> High. Test: active subscription is cancelled and no future invoice is scheduled.</li>
<li><strong>Personal data remains</strong> in exports, backups or analytics. High (legal). Test: data is removed or anonymised in each store within the stated period.</li>
<li><strong>Shared workspace loses its only admin.</strong> Medium. Test: deletion is blocked or ownership is transferred.</li>
<li><strong>Accidental deletion.</strong> Medium. Test: confirmation step and a grace period to undo.</li>
</ul></div>
<ul class="task-rubric">
<li>Includes security risks such as stolen sessions</li>
<li>Includes money: what happens to billing</li>
<li>Includes data protection: where personal data lives</li>
<li>Includes effects on other users or shared data</li>
<li>Gives a concrete test for each risk</li>
</ul>
</div></div></div>""",
myths=[
 ("More generated test cases means better coverage.", "Coverage of inputs isn't coverage of risk. Many generated cases test the same thing."),
 ("AI can't help with exploratory testing.", "It can suggest charters and unusual paths. You still do the exploring and judge what's interesting."),
 ("A feature built on AI can be tested with exact-match assertions.", "Outputs vary. Test against rules and pass rates over many inputs."),
 ("LLM-as-judge removes the need for human review.", "Judges need validating against people, and agree with them only partly.[4]"),
],
recap=[
 "Write the risk list first; use AI to generate variations under each risk.",
 "Collapse duplicative generated cases into data-driven tests.",
 "The most important cases come from knowing the system: permissions, money, data.",
 "AI features need tests over many inputs with pass rates, not single assertions.",
 "Validate any AI judge against human judgements before trusting it.",
],
checks=[
 dict(q="Which test is an assistant least likely to generate without being told about your system?", a=3, opts=[
  ("An email field that rejects a value with no domain.", "A typical validation case models usually include."),
  ("A name field that accepts accented characters.", "A common internationalisation case."),
  ("A password field that masks what's typed.", "A widely known UI case."),
  ("Scheduled invoices still reach the customer after an email change.", "Right. It depends on how your billing works."),
 ]),
 dict(q="Twenty generated cases each test a different invalid email format. What should you do?", a=1, opts=[
  ("Automate each one separately for maximum coverage.", "Twenty tests for one risk adds maintenance, not safety."),
  ("Collapse them into one data-driven test.", "Right. Same risk, one test, many inputs."),
  ("Delete them all, since validation doesn't matter.", "Validation matters; it just doesn't need twenty tests."),
  ("Ask the assistant for twenty more to be safe.", "More of the same doesn't add coverage."),
 ]),
 dict(q="What are the two questions behind risk-based testing?", a=0, opts=[
  ("How likely is it to fail, and how bad would that be?", "Right. Likelihood and impact decide priority."),
  ("How long will the tests take to write and to run?", "Effort matters, but it isn't the risk."),
  ("Which tests can AI write, and which must people write?", "A useful split, but not the definition of risk."),
  ("What did the last release break, and who reported it?", "History informs risk, but isn't the core questions."),
 ]),
 dict(q="Why can't an AI summary feature be tested with one exact-match assertion?", a=2, opts=[
  ("Exact-match assertions are deprecated in most frameworks.", "They aren't."),
  ("The feature is too slow for automated testing.", "Speed isn't the reason."),
  ("Its outputs vary, so you test rules and pass rates over many inputs.", "Right. One run tells you little."),
  ("AI features can only be tested manually by people.", "They can be tested automatically with the right approach."),
 ]),
 dict(q="Before using an LLM to grade outputs at scale, what should you do?", a=1, opts=[
  ("Use the most expensive model available as the judge.", "Cost doesn't guarantee agreement with people."),
  ("Check its grades agree with people's on a sample.", "Right. Validate the judge before trusting it."),
  ("Give it the same prompt as the feature it's judging.", "That shares the feature's blind spots."),
  ("Ask it to explain each grade in detail.", "Explanations don't show its grades are right."),
 ]),
],
sources=[
 'OWASP, <a href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener">Web Security Testing Guide</a>. A structured source of risks and tests for authentication, sessions and account features.',
],
)
