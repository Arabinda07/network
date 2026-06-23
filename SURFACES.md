# Product Surfaces: The Architecture of Space

This document maps the primary interfaces (Surfaces) within the Personal Relationship OS. Each surface is designed to serve a singular, contemplative purpose, avoiding the cognitive overload and dashboard anxiety typical of traditional CRM tools. All surfaces inherit the aesthetic tones outlined in `DESIGN.md`.

## 1. The Sanctuary (Onboarding)
* **Purpose:** To indoctrinate the user into the calm, human-first philosophy of the application and establish initial psychological safety.
* **Single Responsibility:** Guide the user in establishing their first 3-5 `Core` relationships without feeling rushed.
* **User Actions:** Read the constitution, add a core relationship, author an initial baseline reflection.
* **Data Dependencies:** None initially.
* **Inputs:** Name, basic context, and a free-form reflection for the first few connections.
* **Outputs:** Creation of the user's root profile and initial populated relationships.
* **Entry Points:** First initial launch.
* **Empty States:** "Welcome to your silent space. Let's plant the first seeds."

## 2. The Reflection Desk (Weekly Cockpit)
* **Purpose:** A calm, proactive space for the user to sit down once a week (or when needed) to review their social landscape and set intentions.
* **Single Responsibility:** Provide a focused view for synthesizing recent interactions and planning future emotional energy.
* **User Actions:** Draft a new reflection, review upcoming life events, note serendipitous hooks from the week, change a relationship's lifecycle stage.
* **Data Dependencies:** Recent interactions, upcoming dates (from hooks), relationships in the `Cultivation` or `Renewal` stage.
* **Inputs:** Reflections, intention setting, stage adjustments.
* **Outputs:** Updated interaction timelines, new hooks, updated relationship stages.
* **Entry Points:** Default home view upon loading the application.
* **Empty States:** A gentle, uncluttered screen with a single prompt: "Who is on your mind today?" or "A quiet week. Rest is part of the rhythm."

## 3. The Anchor Profile (Contact Profile)
* **Purpose:** The definitive, holistic sanctuary for an individual relationship.
* **Single Responsibility:** To hold the complete, nuanced history, current state, and accumulated knowledge of one specific person.
* **User Actions:** Read past reflections, view current lifecycle stage, add a new interaction, log a hook, adjust circle or domain.
* **Data Dependencies:** All data tied specifically to the person (interactions, hooks, taxonomy metadata).
* **Inputs:** New artifacts of connection (notes, hooks, events).
* **Outputs:** A filtered, chronological view of the relationship's narrative.
* **Entry Points:** Search, clicking a name from the Reflection Desk or Network Map.
* **Empty States:** "The genesis of your connection. What brought you together?"

## 4. The Hook Bank
* **Purpose:** A repository of context—shared interests, struggles, and future opportunities—that can be drawn upon to provide value or spark reconnection.
* **Single Responsibility:** Centralize actionable topics of care and shared meaning.
* **User Actions:** Browse hooks by category (`Shared Interest`, `Life Event`), filter by person, mark a hook as acted upon.
* **Data Dependencies:** All active and pending hooks across the user's relationships.
* **Inputs:** Categorization and filtering parameters.
* **Outputs:** Curated list of contextual prompts.
* **Entry Points:** Global navigation, specific Anchor Profiles.
* **Empty States:** "No context gathered yet. Listen closely in your next conversation."

## 5. The Tapestry (Network Map)
* **Purpose:** A high-level, energetic visualization of the user's social ecosystem, rather than a rigid organizational chart.
* **Single Responsibility:** Allow the user to visualize the distribution of their relationships across `Circles` and `Domains`.
* **User Actions:** Zoom, filter by `Domain` or `Role`, drag individuals between `Circles` (e.g., from `Orbit` to `Core`).
* **Data Dependencies:** All individuals, their assigned circles, domains, and lifecycle stages.
* **Inputs:** View toggles and filter selections.
* **Outputs:** A visual representation of relationship density and distribution.
* **Entry Points:** Global navigation.
* **Empty States:** Only the user's central node exists, waiting for connections.

## 6. The Winter Audit (Gap/Drift Review)
* **Purpose:** A gentle, non-judgmental space to review relationships that have moved into the `Drift` or `Dormant` stages.
* **Single Responsibility:** Facilitate intentional decisions about whether to let a relationship rest or move it into `Renewal`.
* **User Actions:** Review dormant connections, read the last logged interaction, choose to renew or archive context.
* **Data Dependencies:** Relationships categorized as `Drift` or `Dormant`, time elapsed since last interaction.
* **Inputs:** Renewal plans or acceptance of the drift.
* **Outputs:** Updated relationship stages.
* **Entry Points:** Triggered periodically (e.g., quarterly) or accessed via global navigation.
* **Empty States:** "All your tended relationships are currently active. Enjoy the warmth."

## 7. The Narrative (Interaction Timeline)
* **Purpose:** The chronological journal of the user's entire relational life across all connections.
* **Single Responsibility:** Serve as the master ledger of all `Action Types` and `Value Exchanges` logged over time.
* **User Actions:** Scroll chronologically, search for specific themes, filter by date ranges.
* **Data Dependencies:** Every logged interaction, reflection, and milestone event.
* **Inputs:** Search queries, chronological filters.
* **Outputs:** A continuous stream of memories and moments.
* **Entry Points:** Global navigation.
* **Empty States:** "The journal is open. Your history begins now."

## 8. The Boundaries (Settings)
* **Purpose:** Manage the technical and personal safeguards of the OS.
* **Single Responsibility:** House all configurations, data exports, and privacy toggles.
* **User Actions:** Export data, delete account, toggle aesthetic modes (if applicable), configure backup options.
* **Data Dependencies:** User account metadata.
* **Inputs:** Configuration selections.
* **Outputs:** Modified system states or exported data files.
* **Entry Points:** Global navigation (typically a discreet icon).
* **Empty States:** N/A (Always populated with default choices).
