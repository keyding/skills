# Human-invoked Skills Guide

This guide covers every skill in this collection that a person can invoke directly. Some skills require explicit invocation, while others may also be selected automatically by the agent.

The examples use `/skill-name`. If your agent does not expose skills as slash commands, mention the skill name explicitly in your prompt instead. All 51 currently published skills can be invoked this way.

## Matt Pocock's skills

### `ask-matt`

**Skill overview:** Routes an unclear request to the most suitable Matt Pocock skill or multi-skill workflow in this collection.

**When and how to use:** Use it when you know the outcome you want but do not know which skill to choose, or when a task may need several skills in sequence. Invoke `/ask-matt` with your goal and current context, for example: `/ask-matt I have a vague feature idea and need to turn it into implementable work.`

### `claude-handoff`

**Skill overview:** Summarizes the current conversation and immediately launches a fresh background Claude agent to continue the work.

**When and how to use:** Use it when the current conversation is crowded, a new agent should continue with a clean context, or you want work to continue in the background. Invoke `/claude-handoff`, optionally naming the focus for the new agent. It requires an installed and authenticated Claude CLI; secrets are excluded from the handoff.

### `code-review`

**Skill overview:** Reviews a branch or change set against two separate standards: the repository's documented engineering rules and the originating specification.

**When and how to use:** Use it before merging a branch, while reviewing a PR, or when checking work since a known commit, tag, or branch. Invoke `/code-review <fixed-point>` such as `/code-review main`; provide the source spec if it cannot be discovered from commits or issues. The two review axes stay separate so correct-but-off-spec work and on-spec-but-noncompliant code are both visible.

### `codebase-design`

**Skill overview:** Provides a shared vocabulary and design method for creating deep modules with small interfaces, clear seams, high leverage, and strong locality.

**When and how to use:** Use it when designing or restructuring a module, deciding where a test seam belongs, reducing shallow pass-through layers, or comparing alternative interfaces. Invoke `/codebase-design` with the module or design question; it is especially useful before a refactor or while defining testable public interfaces.

### `diagnosing-bugs`

**Skill overview:** Applies a disciplined diagnosis loop to difficult bugs and performance regressions: build a tight reproduction, minimise it, rank hypotheses, instrument, fix, and preserve a regression test.

**When and how to use:** Use it when a failure is intermittent, poorly understood, performance-related, or has resisted obvious fixes. Invoke `/diagnosing-bugs` with the symptom and available reproduction details. Expect the skill to establish one fast, deterministic command that can catch the exact bug before it starts theorising or changing code.

### `domain-modeling`

**Skill overview:** Builds and sharpens a project's domain language by resolving ambiguous terms, testing edge cases, updating `CONTEXT.md`, and recording only durable architectural decisions as ADRs.

**When and how to use:** Use it when the team is using conflicting vocabulary, domain relationships are unclear, or a design discussion changes the project's conceptual model. Invoke `/domain-modeling` with the topic or disputed terms. The skill cross-checks statements against the code and writes glossary or ADR updates as decisions settle.

### `git-guardrails-claude-code`

**Skill overview:** Installs Claude Code hooks that block dangerous Git commands such as push, hard reset, forced clean, destructive branch deletion, and whole-tree restore.

**When and how to use:** Use it when you want project-level or global safeguards against accidental Git mutations by Claude Code. Invoke `/git-guardrails-claude-code`, choose the installation scope, and optionally customise the blocked commands. The skill merges the hook into existing settings and verifies that a dangerous command is rejected.

### `grill-me`

**Skill overview:** Runs a persistent interview that challenges assumptions and turns a vague plan, design, or decision into something precise.

**When and how to use:** Use it for early ideas, architecture choices, product plans, or any proposal that needs stress-testing but does not need repository documentation. Invoke `/grill-me` followed by the idea or decision you want examined, then answer the questions one round at a time.

### `grill-with-docs`

**Skill overview:** Runs the same rigorous interview as `grill-me`, while recording durable domain vocabulary and architectural decisions in the repository.

**When and how to use:** Use it when the discussion belongs to a real codebase and its conclusions should survive the conversation. Invoke `/grill-with-docs` with the proposed change; expect the skill to update domain context and ADR-style documentation as decisions are made.

### `grilling`

**Skill overview:** Stress-tests a plan, decision, or idea as a branching design tree, asking every currently answerable decision in numbered rounds.

**When and how to use:** Use it when you want the underlying interview discipline directly, without the wrapper behavior of `grill-me` or `grill-with-docs`. Invoke `/grilling` with the proposal. The agent researches discoverable facts itself, presents recommended answers with each question, and stops before implementation so you can confirm shared understanding.

### `handoff`

**Skill overview:** Converts the current conversation into a compact, portable Markdown handoff document without starting another agent.

**When and how to use:** Use it when you want to continue in another session, agent harness, or with a colleague. Invoke `/handoff`, optionally naming the next task or audience. The skill writes the handoff to a temporary file, references existing artifacts, and omits secrets.

### `implement-spec`

**Skill overview:** Implements an entire specification or ticket graph, coordinating parallel work, integration, review, and pull-request preparation.

**When and how to use:** Use it when a complete, approved spec already exists and the whole body of work should be delivered on one branch or PR. Invoke `/implement-spec` with the spec, issue, or ticket graph reference. This is the broad implementation workflow; use `implement` for one bounded piece.

### `implement`

**Skill overview:** Implements one bounded item from a specification or ticket set, validates it, reviews the result, and commits it on the current branch.

**When and how to use:** Use it for a single ticket or a small, well-defined slice that fits in one working session. Invoke `/implement` with the ticket, spec section, or acceptance criteria. The skill uses tests at agreed seams and finishes with type checks, tests, review, and a commit.

### `improve-codebase-architecture`

**Skill overview:** Audits a codebase for opportunities to create deeper, clearer modules, presents them in a visual HTML report, and helps work through a selected recommendation.

**When and how to use:** Use it when a codebase works but feels shallow, tightly coupled, repetitive, or hard to navigate. Invoke `/improve-codebase-architecture` from the repository root. Review the generated report, choose a candidate, and then use the guided discussion to refine the change before implementation.

### `loop-me`

**Skill overview:** Turns a recurring personal or work routine into a precise, buildable workflow specification through a stateful interview.

**When and how to use:** Use it for recurring processes such as weekly reporting, content publishing, support triage, or release routines that you may later automate. Invoke `/loop-me` with the routine and desired outcome. The skill records triggers, checkpoints, human-only steps, and reusable briefs under the workspace's workflow documents.

### `matt-prototype`

**Skill overview:** Builds intentionally disposable code to answer one design question, choosing either an interactive logic/state harness or several UI variations.

**When and how to use:** Use it when discussion alone cannot settle how a state model behaves or what an interface should look like. Invoke `/matt-prototype` with the exact question to answer. The prototype is kept easy to run, exposes its state, avoids production polish, and is later preserved off the main branch as evidence for the decision rather than shipped as product code.

### `migrate-to-shoehorn`

**Skill overview:** Migrates unsafe TypeScript assertions in tests to `@total-typescript/shoehorn`, using partial or deliberately invalid fixtures without production-code casts.

**When and how to use:** Use it when tests contain `as Type` or `as unknown as Type` because full fixtures are too large or invalid data must be tested. Invoke `/migrate-to-shoehorn` with the affected test files or scope. It installs the package, chooses `fromPartial`, `fromAny`, or `fromExact`, and verifies the migration with the type checker.

### `pr`

**Skill overview:** Writes a concise pull-request body with a visual summary, concrete before/after evidence, and an explicit assessment of reversibility and blast radius.

**When and how to use:** Use it after implementation and validation when a PR description needs to explain the change clearly to reviewers. Invoke `/pr` with the diff or branch context. The skill chooses the smallest useful diagram, tree, pseudocode, or diff sketch and avoids unsupported claims by grounding the Evidence section in actual results.

### `research`

**Skill overview:** Delegates a focused investigation to a background agent that uses high-trust primary sources and writes cited findings into one repository Markdown file.

**When and how to use:** Use it when a design or implementation decision depends on official documentation, specifications, source code, or first-party APIs and you want the reading work to proceed in parallel. Invoke `/research` with a precise question and, when useful, the desired output location.

### `resolving-merge-conflicts`

**Skill overview:** Resolves an active merge or rebase by recovering the intent behind both sides, combining compatible changes, validating the result, and finishing the Git operation.

**When and how to use:** Use it only when the repository is already in a merge or rebase conflict. Invoke `/resolving-merge-conflicts` and identify the merge goal if it is not obvious. The skill reads commits, PRs, and issues as primary evidence, preserves both intents where possible, runs project checks, and continues rather than aborting the operation.

### `retro`

**Skill overview:** Conducts a retrospective on a coding session and proposes concrete improvements to the agent's working environment and engineering loop.

**When and how to use:** Use it after a long, difficult, repetitive, or failure-prone session. Invoke `/retro` for the current session, or specify which session to review. It looks for better navigation, deterministic checks, repository instructions, tooling, and ways to remove wasted work.

### `scaffold-exercises`

**Skill overview:** Creates correctly numbered course-exercise directories with problem, solution, or explainer variants and the minimum files required by the AI Hero exercise linter.

**When and how to use:** Use it when starting a course section, turning a lesson plan into exercise stubs, or renumbering existing exercises. Invoke `/scaffold-exercises` with the section plan and desired variants. It creates the structure, runs `pnpm ai-hero-cli internal lint`, fixes failures, and commits the validated scaffold.

### `setup-matt-pocock-skills`

**Skill overview:** Performs the one-time repository setup required by Matt's engineering workflows: issue-tracker conventions, triage states, and domain-document layout.

**When and how to use:** Run it before using skills such as `triage`, `to-spec`, `to-tickets`, or `wayfinder` in a new repository. Invoke `/setup-matt-pocock-skills` at the repository root, review the proposed tracker and documentation conventions, and confirm them before files or labels are configured.

### `setup-pre-commit`

**Skill overview:** Adds Husky and lint-staged so staged files are formatted and the repository's available type checks and tests run before each commit.

**When and how to use:** Use it when a JavaScript or TypeScript repository needs consistent commit-time checks. Invoke `/setup-pre-commit` at the repository root. The skill detects the package manager, preserves existing Prettier configuration, omits unavailable scripts, verifies the hook, and creates a smoke-test commit.

### `setup-ts-deep-modules`

**Skill overview:** Configures `dependency-cruiser` in a TypeScript repository so each package exposes a small public entry point while keeping implementation details private.

**When and how to use:** Use it when package internals are imported directly, dependency boundaries are unclear, or cycles need enforcement. Invoke `/setup-ts-deep-modules` at the repository root. It installs and wires the checks, adds a representative rule set, demonstrates a failing boundary, and verifies the corrected setup.

### `tdd`

**Skill overview:** Drives implementation through small red-to-green vertical slices, testing behavior through agreed public seams rather than internal details.

**When and how to use:** Use it when building a feature or fixing a bug test-first, especially when you want integration-level confidence. Invoke `/tdd` with the desired behavior, then agree on the test seams before any test is written. Each cycle adds one failing test and only enough implementation to make it pass; refactoring waits for review.

### `teach`

**Skill overview:** Creates a persistent, multi-session learning workspace and teaches a topic through lessons, exercises, trusted resources, and progress records.

**When and how to use:** Use it when you want to learn a subject over time rather than receive a one-off explanation. Invoke `/teach` with the topic, current level, and target capability, for example: `/teach Help me become productive with Rust ownership.` The skill adapts later lessons to recorded progress.

### `to-questionnaire`

**Skill overview:** Turns a decision you cannot make alone into a focused questionnaire for the person who holds the missing knowledge.

**When and how to use:** Use it before a stakeholder interview, vendor discussion, domain-expert review, or asynchronous discovery request. Invoke `/to-questionnaire` with the decision and intended recipient. The skill asks only what it needs to know about the recipient and desired answers, then writes `to-questionnaire-<slug>.md`.

### `to-spec`

**Skill overview:** Synthesizes the current conversation and codebase context into a complete specification and publishes it to the configured issue tracker.

**When and how to use:** Use it after requirements and major decisions have already been discussed. Invoke `/to-spec` without expecting another discovery interview; provide a reference only if the relevant context is elsewhere. The skill confirms testing seams, writes the spec, and marks it ready for an agent. Run `setup-matt-pocock-skills` first in a new repository.

### `to-tickets`

**Skill overview:** Breaks a plan or specification into small, end-to-end tracer-bullet tickets with explicit blocking relationships.

**When and how to use:** Use it when a spec is too large for one session and needs independently deliverable work items. Invoke `/to-tickets` with a spec path, issue URL, or the current conversation as the source. Review and approve the proposed granularity and dependencies before the skill publishes the tickets.

### `triage`

**Skill overview:** Moves issues and eligible external pull requests through a defined triage state machine, including verification, clarification, rejection, and agent-ready briefing.

**When and how to use:** Use it to find untriaged work, inspect a specific issue or PR, or change an item's state. Examples: `/triage Show me what needs attention` and `/triage Move #42 to ready-for-agent`. Because it can label, comment on, or close tracker items, review its recommendation and intended state changes before they are applied.

### `wait-what`

**Skill overview:** Stops the current explanation and asks the agent to re-explain it with more context, simpler English, and the repository's established domain language.

**When and how to use:** Use it when the last response assumed too much knowledge, used unexplained jargon, or lost the thread. Invoke `/wait-what` immediately after the confusing response; optionally identify the exact part that did not land.

### `wayfinder`

**Skill overview:** Plans work that is too large or uncertain for one agent session as a shared map of decision tickets, then resolves the map one decision at a time.

**When and how to use:** Use it for large migrations, ambiguous product initiatives, or other efforts where the destination is known but the route is not. Invoke `/wayfinder` with the loose idea to create a map, or invoke it with an existing map URL or number to work the next decision. It is a planning workflow by default and normally resolves no more than one non-research ticket per session.

### `wizard`

**Skill overview:** Generates an interactive Bash wizard for manual steps that only a person can perform, such as creating accounts, copying credentials, configuring dashboards, or approving a cutover.

**When and how to use:** Use it when a repeatable procedure crosses human-only web interfaces or secret entry and would otherwise require constant back-and-forth. Invoke `/wizard` with the target outcome. After you confirm the ordered stages and where each value belongs, it creates and statically validates an executable script; you run the script yourself.

### `writing-beats`

**Skill overview:** Builds an article from a fixed pile of raw material one narrative beat at a time, ensuring every concept is introduced before later beats rely on it.

**When and how to use:** Use it when exploration is finished but you want to choose the article's path interactively at a story or argument level. Invoke `/writing-beats` with the raw-material file and output path. Pick among proposed opening and next beats; the skill appends only the selected beat each round and preserves your edits.

### `writing-fragments`

**Skill overview:** Explores a writing topic through an interview and continuously captures strong sentences, claims, examples, metaphors, and partial thoughts without imposing an outline.

**When and how to use:** Use it at the beginning of an essay or article when you need to discover what you actually think. Invoke `/writing-fragments` with the topic and destination Markdown file. Continue the conversation while the skill appends fragments; organize them later with `writing-beats` or `writing-shape`.

### `writing-for-agents`

**Skill overview:** Provides principles for writing reliable skills, `AGENTS.md`, `CLAUDE.md`, and other documents consumed by agents, with attention to context pointers, progressive disclosure, completion criteria, and maintenance cost.

**When and how to use:** Use it when creating or revising instructions for an AI agent and you want predictable execution without bloated always-loaded context. Invoke `/writing-for-agents` with the target document and desired behavior. It helps decide what belongs inline, what should be linked, how triggers should be worded, and how each step proves completion.

### `writing-shape`

**Skill overview:** Turns a fixed raw-material file into an article interactively, choosing an opening and then shaping each paragraph or content block in order.

**When and how to use:** Use it when exploration is complete and you want direct control over the article's thesis, structure, transitions, and presentation format. Invoke `/writing-shape` with the source file and output path. The source remains read-only; the article grows one agreed block at a time.

## Emil Kowalski's skills

### `animate`

**Skill overview:** Designs and implements a web animation from first principles, deciding whether motion belongs at all before choosing its purpose, tool, properties, timing, interruption behavior, and accessibility fallback.

**When and how to use:** Use it when adding a transition, gesture, entrance, exit, or other motion to a web interface. Invoke `/animate` with the component and desired behavior. It writes the implementation using the cheapest suitable technique, may reject unnecessary motion, and includes reduced-motion and pointer-capability handling.

### `animate-expo`

**Skill overview:** Builds production-quality animations and gestures for React Native and Expo with Reanimated, Gesture Handler, Expo Router, and haptics where appropriate.

**When and how to use:** Use it for mobile gestures, sheets, screen transitions, press feedback, haptics, or animation that stutters on a device. Invoke `/animate-expo` with the interaction and target component. It keeps frame-by-frame work on the UI thread and requires feel and performance to be verified on a release build on real hardware.

### `animation-vocabulary`

**Skill overview:** Converts a vague description of a visible motion effect into the precise animation term, with close alternatives when the description is ambiguous.

**When and how to use:** Use it when you can describe what an animation looks or feels like but do not know what to call it. Invoke `/animation-vocabulary` followed by the description, for example: `/animation-vocabulary What is the iOS effect that resists and snaps back at the scroll boundary?` It names the effect; it does not design or implement it.

### `apple-design`

**Skill overview:** Applies Apple's principles for fluid, physical interfaces to the web, covering immediate feedback, direct manipulation, interruptible springs, velocity handoff, momentum, materials, typography, and accessibility.

**When and how to use:** Use it when building or reviewing Apple-like gestures, draggable surfaces, sheets, spring motion, translucent depth, or typography. Invoke `/apple-design` with the interaction or design under consideration. It is best used to reason about behavior and feel before or during implementation, especially where motion must follow the user's input continuously.

### `ask-sonner`

**Skill overview:** Provides implementation and troubleshooting guidance for Sonner, the React toast library, including setup, call selection, promise flows, updates, styling, themes, positioning, and multiple toasters.

**When and how to use:** Use it whenever adding, styling, or debugging Sonner. Invoke `/ask-sonner` with the desired toast behavior or symptom, such as duplicated toasts, missing styles, dark-mode issues, stacking problems, or a stuck promise toast. It chooses the correct API and escalates styling from defaults to headless custom markup only as needed.

### `emil-design-eng`

**Skill overview:** Encodes Emil Kowalski's broader design-engineering philosophy for polished components, purposeful motion, physical interactions, performance, accessibility, and the small details that make an interface feel coherent.

**When and how to use:** Use it as a general craft framework when building or reviewing an interactive UI and the question spans more than one specialized animation concern. Invoke `/emil-design-eng` with the component, implementation, or design question. For narrower work, prefer `animate`, `review-animations`, `find-animation-opportunities`, or `ask-sonner`.

### `emil-prototype`

**Skill overview:** Builds several genuinely different versions of one UI element and places them behind a live visual picker so you can compare them and promote a winner.

**When and how to use:** Use it when a component's visual direction or interaction is uncertain and seeing alternatives is faster than debating them. Invoke `/emil-prototype <description>`, add `x5` to request five variants, use `riff <variant>` to explore one direction, and `keep <variant>` to promote the selected version into the product.

### `find-animation-opportunities`

**Skill overview:** Performs a read-only sweep for places where motion would genuinely improve an interface and deliberately rejects places that should remain static.

**When and how to use:** Use it when an interface feels flat and you want a restrained list of possible animations rather than implementation. Invoke `/find-animation-opportunities` with a page, component, or repository scope. It returns at most a few evidence-backed suggestions with exact values, plus rejected candidates that failed its frequency, purpose, speed, or function gate.

### `improve-animations`

**Skill overview:** Audits an entire codebase's existing motion, prioritizes verified problems, and writes self-contained implementation plans without directly modifying source code.

**When and how to use:** Use it when you want a motion-improvement roadmap rather than a review of one diff. Invoke `/improve-animations`, optionally with `quick`, `deep`, a category such as `performance`, or `plan <description>`. After reviewing its findings, choose which should become plans; `execute <plan>` can later hand one plan to an isolated implementation workflow.

### `mobile-native`

**Skill overview:** Makes a mobile web app or PWA feel native by fixing touch, viewport, safe-area, keyboard, overscroll, status-bar, carousel, selection, and real-device behavior.

**When and how to use:** Use it when a web interface works on desktop but feels wrong on a phone, or while building a full-screen mobile web experience. Invoke `/mobile-native` with the affected page and symptom. It applies targeted CSS and metadata fixes and clearly separates what can be verified in code from what must be checked on physical hardware.

### `pick-ui-library`

**Skill overview:** Recommends one suitable frontend library from Emil's curated list for a specific UI need, taking the project's existing stack into account.

**When and how to use:** Use it before adding a dependency for toasts, OTP inputs, command menus, animation, charts, drag and drop, virtualized lists, state, styling, and similar UI concerns. Invoke `/pick-ui-library` with the requirement and constraints. It inspects the current dependencies first and avoids replacing an established equivalent unless you ask.

### `review-animations`

**Skill overview:** Reviews animation and motion code against Emil Kowalski's design-engineering standards and returns motion-specific findings plus a verdict.

**When and how to use:** Use it after implementing or changing transitions, gestures, loaders, layout animations, or other motion. Invoke `/review-animations` with the relevant files, diff, or component. It evaluates purpose, frequency, timing, easing, interruptibility, performance, transform origin, reduced-motion behavior, and visual cohesion; use a general code-review skill separately for non-motion concerns.

### `write-swift`

**Skill overview:** Guides modern Swift implementation and review across value modeling, Swift 6 concurrency, protocols and generics, API design, performance, ARC, Swift Testing, macros, diagnostics, and migration.

**When and how to use:** Use it when writing or reviewing Swift, migrating a project to Swift 6, or diagnosing data races, hangs, retain cycles, and performance problems. Invoke `/write-swift` with the code or problem and include the project's Swift version. It starts with simple value-oriented, single-threaded designs and introduces concurrency, reference semantics, existentials, or unsafe APIs only when there is a concrete reason.
