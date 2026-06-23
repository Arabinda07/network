# Workflows: The Engines of Intentionality

This document defines the underlying logic and data processing flows for the Personal Relationship OS. Each workflow is governed by strict constraints: they must remain human-first, rely on qualitative reflection over quantitative gamification, and explicitly avoid addictive loops or anxiety-inducing notification patterns.

## 1. Weekly Ritual Engine
**Trigger:** User-initiated access to "The Reflection Desk," or the first app launch of a new week. No push notifications are fired to compel entry.
**Inputs:** 
- `Interactions` logged in the past 7 days.
- Pending `Hooks` with a `target_date` in the coming 7-14 days.
- `Contacts` with recently shifted `LifecycleStage` variables.
**Process:**
1. Aggregate the past week's connections into a serene summary.
2. Surface incomplete `reflection_notes` from recent `Interactions` as gentle invitations rather than "to-do" items.
3. Present upcoming `Hooks` (e.g., a friend's career shift, an upcoming anniversary) to allow the user to plan proactive check-ins.
**Outputs:** 
- Drafted intentions for the week.
- Completed qualitative reflections.
**Edge Cases:** The user misses three weeks and logs in. *Process:* The engine explicitly avoids compiling a massive, guilt-inducing backlog. It only presents the immediate current week's context, absolving the user of the missed period.

## 2. Hook Recommendation Engine
**Trigger:** Opening an Anchor Profile or visiting the global Hook Bank.
**Inputs:** 
- Unresolved `Hooks` (`is_acted_upon = false`).
- Current system date.
- `Hooks` categorized as `Life Event` or `Aspirational Goal`.
**Process:**
1. Silently sort contextual hooks by temporal relevance, without applying urgent visual markers.
2. Group hooks by category to inspire natural conversation starters (e.g., "Here is the shared context you gathered last time.").
**Outputs:** A calm, curated list of actionable context to help the user show up fully informed.
**Edge Cases:** A hook surpasses its `target_date` without being acted upon. *Process:* The hook is quietly moved to historical context. No "overdue" alerts or red badges are ever generated; the OS assumes the user intentionally let it pass or life simply got in the way.

## 3. Gap Audit Engine
**Trigger:** A predefined seasonal shift (e.g., quarterly) or the user manually entering "The Winter Audit."
**Inputs:** 
- `Contacts` currently in the `Drift` or `Maturation` stages.
- Time elapsed since the most recent `Interaction`.
**Process:**
1. Identify relationships that have naturally quieted over a long time horizon.
2. Present these contacts through the lens of "seasons" rather than failure.
3. Prompt the user with a gentle choice: Accept the drift (leave to rest in the winter) or plan for renewal (plant a seed for spring).
**Outputs:** Updated `LifecycleStage` (shifting to `Dormant` or `Renewal`), and optionally, newly drafted `Hooks` for future reconnection.
**Edge Cases:** All relationships are actively maintained (no gaps). *Process:* Present a tranquil "empty state" celebrating the current warmth and density of the user's active relational season.

## 4. Introduction Engine
**Trigger:** User queries an introduction surface or passively browses The Tapestry (Network Map).
**Inputs:** 
- `Hooks` classified as `Shared Interest`, `Aspirational Goal`, or `Resource_Recommendation`.
- `Contacts` separated by different `Domains` (e.g., Personal vs. Professional).
**Process:**
1. Analyze overlapping thematic data across isolated clusters of the user's network.
2. Identify two unconnected `Contacts` who share complementary context.
3. Suggest a serendipitous introduction, clearly explaining *why* the thematic overlap exists based on historical notes.
**Outputs:** A drafted email/text proposition or a newly logged intention to connect the two individuals.
**Edge Cases:** The user knows the individuals already know each other, or an introduction is inappropriate. *Process:* The user can instantly dismiss the suggestion, and the engine flags the two `Contacts` as intrinsically unlinked to prevent future recommendations.

## 5. Import Pipeline
**Trigger:** User attempts to add data via a bulk action during or after "The Sanctuary" (Onboarding).
**Inputs:** Raw data files (vCard, CSV, phone contact-book sync).
**Process:** 
*Friction by Design.* To prevent the user from treating the OS like an address book dump, the pipeline intentionally throttles mass-imports.
1. Intercept the list of contacts.
2. Force a pagination workflow where the user *must* manually review, tag a `Circle`, and assign a `LifecycleStage` to every single person brought into the system.
**Outputs:** Creation of deliberate, qualitative `Contact` records rather than a hoarded list of strangers.
**Edge Cases:** A user attempts to mass-import 1,000 phone contacts and skip the qualitative phase. *Process:* The system rejects the bulk import and pauses. It refuses to populate the database without the user's intentional, human-first categorization.

## 6. Relationship Health Engine
**Trigger:** Accessing The Anchor Profile or triggering a macro-level self-reflection.
**Inputs:** 
- `Interactions` over a long time horizon (6–12 months).
- `InteractionDirection` values (`Initiated` vs. `Received`).
- `ValueExchangeCategory` associations.
**Process:**
1. Compute the long-term energetic balance of the relationship.
2. If highly asymmetrical (e.g., the user initiated 95% of communication over a year), do NOT generate a raw score.
3. Instead, generate a qualitative prompt: "You've been carrying the weight of reaching out here. Are you feeling nourished, or drained?"
**Outputs:** Reflective prompts to help the user evaluate their own energetic capacity and boundaries.
**Edge Cases:** Short-term extreme asymmetry due to a friend experiencing a crisis (grief, illness). *Process:* The engine must heavily weight its analysis over very long horizons so it never penalizes a healthy relationship undergoing a temporary, asymmetrical season of support.

## 7. Relationship Lifecycle Engine
**Trigger:** The logging of a new `Interaction`, or crossing a massive threshold of time without interaction.
**Inputs:** 
- Current `LifecycleStage`.
- Frequency of `Interactions`.
- Elapsed time since last contact.
**Process:**
1. Observe the natural cadence of the bond.
2. If an `Incubation` connection experiences a high frequency of vulnerable exchanges, prompt the user: "Is this relationship entering the Cultivation stage?"
3. If a `Maturation` connection goes silent for a year, prompt: "Has this bond entered a season of Drift?"
**Outputs:** A proposed update to the `LifecycleStage`. 
**Edge Cases:** The user disagrees with the system's observation. *Process:* The system defers completely. Human override is always the ultimate authority. Automatic demotions or promotions of a relationship never occur without the user's explicit consent.
