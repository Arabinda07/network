# Technical Architecture: The Foundations of Connection

This document defines the technical foundations and system architecture of the Personal Relationship OS. Built upon a modern, modular stack, the architecture is designed to support a calm, private, and highly performant experience while remaining strictly aligned with our human-first product constitution.

## 1. System Architecture
The application employs a decoupled, client-heavy architecture focused on rapid UI interactions and secure, single-player data persistence.

* **Frontend Environment:** Built using Lovable. The frontend is responsible for all UI rendering, state management, complex aesthetic transitions, and running the business rules of the various relationship engines locally to minimize latency.
* **Styling & Theming:** Governed by Tailwind CSS, strictly adhering to the design tokens (OKLCH color spaces, Manrope/Spectral typography, layout grids, inherited surface scoping) codified in `DESIGN.md`.
* **Backend Environment:** Powered by Supabase. It serves as the authoritative, secure data store. It handles managed authentication, PostgreSQL database hosting, and acts as the thin API layer.
* **Compute:** Heavy logic (e.g., the Hook Recommendation Engine or Gap Audit Engine) is calculated dynamically on the client side using the user's localized state, avoiding heavy server-side cron jobs that could violate the "pull, don't push" principle of avoiding notifications.

## 2. Data Flow
The OS operates on a unidirectional data flow optimized for rapid visual feedback and offline-tolerant reads.

1. **Hydration:** Upon authentication, the client fetches the user's isolated data graph (`Contacts`, `Interactions`, `Hooks`) from Supabase via highly indexed foreign keys.
2. **Local Cache:** Data is held in a normalized client-side store. The UI renders entirely from this local cache to maintain the calm, instantaneous feel of the app.
3. **Mutation:** When the user logs an action (e.g., drafting a Reflection), the UI updates optimistically.
4. **Synchronization:** The client asynchronously pushes the mutation to the Supabase API.

## 3. Authentication Strategy
* **Provider:** Supabase Auth.
* **Mechanism:** Magic Link (Passwordless Email) or OAuth (e.g., Google). We prioritize Passwordless flows to reduce cognitive friction and password fatigue, aligning with the calm design philosophy.
* **Security Guardrails:** Row-Level Security (RLS) policies are exclusively tied to the JWT issued via Supabase Auth. Every Postgres query automatically scopes to the authenticated `auth.uid()`.

## 4. State Management
* **Client Store:** A lightweight, normalized state container. The store is structured by entity:
  * `entities.contacts`
  * `entities.interactions`
  * `entities.hooks`
* **Derived State:** All dynamic workflows (e.g., calculating which contacts are in a "Drift" state based on historical interaction gaps) are calculated efficiently via memoized selectors against the normalized cache, rather than executing massive, complex raw SQL queries on the backend.

## 5. External Integrations (Future Context)
The architecture anticipates future, strictly opt-in integrations to reduce manual data entry, always honoring explicit user consent and privacy.
* **Google Contacts / Calendar:** OAuth-based, pull-only API requests. The OS will never push or write alterations back to Google services. Data is pulled conceptually (e.g., "Was there a calendar event with this person?") to suggest `Interactions` for the user to qualitatively journal.
* **Gmail:** Read-only metadata extraction (not body parsing) strictly to measure the "elapsed time since last contact" to feed the Gap Audit Engine without compromising conversational privacy.
* **The Sanctuary Rule:** External data from integrations is held in a temporary, ephemeral client state. It is never permanently written to the Supabase database unless the user explicitly curates it and confirms it as a human relationship log.

## 6. Graph Visualization Strategy
For "The Tapestry" (Network Map surface):
* **Technology:** A lightweight Canvas or scalable SVG-based visualization library.
* **Logic:** The graph calculates force-directed nodes based on `Circle` proximity (Core nodes have stronger gravity to the center) and `Domain` clustering.
* **Performance Constraint:** The visualizer must load instantly without stutters, demanding that node positioning is calculated efficiently (potentially via Web Workers for larger networks) to maintain a smooth framerate.

## 7. Import Strategy
* **Parsing:** CSV parsing (e.g., LinkedIn connections dumps) is handled entirely client-side using a web worker to ensure raw, messy data does not pollute the secure backend.
* **The "Friction" Pipeline:** As defined in `WORKFLOWS.md`, the architecture parses the CSV and holds the entities in an ephemeral `PendingImportCache`.
* **Batching:** The user must manually review and tag relationships. Only when a user explicitly promotes a pending record into a vetted `Contact` does the frontend execute an `INSERT` against the Supabase database.

## 8. Future Extensibility
* **Local-First Evolution:** The architecture is designed to eventually support complete local-first persistence (using browser-based databases like IndexedDB) with Supabase acting purely as a background sync layer, maximizing offline capability and absolute privacy guarantees.
* **Private E2E Encryption:** The schema and data flow easily accommodate encrypting the `reflection_notes` or `description` fields on the client side before writing to Supabase, ensuring the database host cannot read the user's most intimate journaling.
* **Thematic Extraction:** If machine learning models or thematic extraction capabilities are integrated in the future, they will be strictly deployed to run privately over the user's isolated data context with explicit safeguards prohibiting the training of global models.
