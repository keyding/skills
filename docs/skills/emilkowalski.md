# Emil Kowalski's skills

[All skill guides](README.md) · [中文版](emilkowalski.zh-CN.md)

## `animate`

**Skill overview:** Designs and implements a web animation from first principles, deciding whether motion belongs at all before choosing its purpose, tool, properties, timing, interruption behavior, and accessibility fallback.

**When and how to use:** Use it when adding a transition, gesture, entrance, exit, or other motion to a web interface. Invoke `/animate` with the component and desired behavior. It writes the implementation using the cheapest suitable technique, may reject unnecessary motion, and includes reduced-motion and pointer-capability handling.

## `animate-expo`

**Skill overview:** Builds production-quality animations and gestures for React Native and Expo with Reanimated, Gesture Handler, Expo Router, and haptics where appropriate.

**When and how to use:** Use it for mobile gestures, sheets, screen transitions, press feedback, haptics, or animation that stutters on a device. Invoke `/animate-expo` with the interaction and target component. It keeps frame-by-frame work on the UI thread and requires feel and performance to be verified on a release build on real hardware.

## `animation-vocabulary`

**Skill overview:** Converts a vague description of a visible motion effect into the precise animation term, with close alternatives when the description is ambiguous.

**When and how to use:** Use it when you can describe what an animation looks or feels like but do not know what to call it. Invoke `/animation-vocabulary` followed by the description, for example: `/animation-vocabulary What is the iOS effect that resists and snaps back at the scroll boundary?` It names the effect; it does not design or implement it.

## `apple-design`

**Skill overview:** Applies Apple's principles for fluid, physical interfaces to the web, covering immediate feedback, direct manipulation, interruptible springs, velocity handoff, momentum, materials, typography, and accessibility.

**When and how to use:** Use it when building or reviewing Apple-like gestures, draggable surfaces, sheets, spring motion, translucent depth, or typography. Invoke `/apple-design` with the interaction or design under consideration. It is best used to reason about behavior and feel before or during implementation, especially where motion must follow the user's input continuously.

## `ask-sonner`

**Skill overview:** Provides implementation and troubleshooting guidance for Sonner, the React toast library, including setup, call selection, promise flows, updates, styling, themes, positioning, and multiple toasters.

**When and how to use:** Use it whenever adding, styling, or debugging Sonner. Invoke `/ask-sonner` with the desired toast behavior or symptom, such as duplicated toasts, missing styles, dark-mode issues, stacking problems, or a stuck promise toast. It chooses the correct API and escalates styling from defaults to headless custom markup only as needed.

## `emil-design-eng`

**Skill overview:** Encodes Emil Kowalski's broader design-engineering philosophy for polished components, purposeful motion, physical interactions, performance, accessibility, and the small details that make an interface feel coherent.

**When and how to use:** Use it as a general craft framework when building or reviewing an interactive UI and the question spans more than one specialized animation concern. Invoke `/emil-design-eng` with the component, implementation, or design question. For narrower work, prefer `animate`, `review-animations`, `find-animation-opportunities`, or `ask-sonner`.

## `emil-prototype`

**Skill overview:** Builds several genuinely different versions of one UI element and places them behind a live visual picker so you can compare them and promote a winner.

**When and how to use:** Use it when a component's visual direction or interaction is uncertain and seeing alternatives is faster than debating them. Invoke `/emil-prototype <description>`, add `x5` to request five variants, use `riff <variant>` to explore one direction, and `keep <variant>` to promote the selected version into the product.

## `find-animation-opportunities`

**Skill overview:** Performs a read-only sweep for places where motion would genuinely improve an interface and deliberately rejects places that should remain static.

**When and how to use:** Use it when an interface feels flat and you want a restrained list of possible animations rather than implementation. Invoke `/find-animation-opportunities` with a page, component, or repository scope. It returns at most a few evidence-backed suggestions with exact values, plus rejected candidates that failed its frequency, purpose, speed, or function gate.

## `improve-animations`

**Skill overview:** Audits an entire codebase's existing motion, prioritizes verified problems, and writes self-contained implementation plans without directly modifying source code.

**When and how to use:** Use it when you want a motion-improvement roadmap rather than a review of one diff. Invoke `/improve-animations`, optionally with `quick`, `deep`, a category such as `performance`, or `plan <description>`. After reviewing its findings, choose which should become plans; `execute <plan>` can later hand one plan to an isolated implementation workflow.

## `mobile-native`

**Skill overview:** Makes a mobile web app or PWA feel native by fixing touch, viewport, safe-area, keyboard, overscroll, status-bar, carousel, selection, and real-device behavior.

**When and how to use:** Use it when a web interface works on desktop but feels wrong on a phone, or while building a full-screen mobile web experience. Invoke `/mobile-native` with the affected page and symptom. It applies targeted CSS and metadata fixes and clearly separates what can be verified in code from what must be checked on physical hardware.

## `pick-ui-library`

**Skill overview:** Recommends one suitable frontend library from Emil's curated list for a specific UI need, taking the project's existing stack into account.

**When and how to use:** Use it before adding a dependency for toasts, OTP inputs, command menus, animation, charts, drag and drop, virtualized lists, state, styling, and similar UI concerns. Invoke `/pick-ui-library` with the requirement and constraints. It inspects the current dependencies first and avoids replacing an established equivalent unless you ask.

## `review-animations`

**Skill overview:** Reviews animation and motion code against Emil Kowalski's design-engineering standards and returns motion-specific findings plus a verdict.

**When and how to use:** Use it after implementing or changing transitions, gestures, loaders, layout animations, or other motion. Invoke `/review-animations` with the relevant files, diff, or component. It evaluates purpose, frequency, timing, easing, interruptibility, performance, transform origin, reduced-motion behavior, and visual cohesion; use a general code-review skill separately for non-motion concerns.

## `write-swift`

**Skill overview:** Guides modern Swift implementation and review across value modeling, Swift 6 concurrency, protocols and generics, API design, performance, ARC, Swift Testing, macros, diagnostics, and migration.

**When and how to use:** Use it when writing or reviewing Swift, migrating a project to Swift 6, or diagnosing data races, hangs, retain cycles, and performance problems. Invoke `/write-swift` with the code or problem and include the project's Swift version. It starts with simple value-oriented, single-threaded designs and introduces concurrency, reference semantics, existentials, or unsafe APIs only when there is a concrete reason.
