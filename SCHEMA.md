# Schema: Data Architecture

This document defines the complete data architecture for the Personal Relationship OS. Built for PostgreSQL (with Supabase compatibility in mind), the schema relies heavily on enum-backed taxonomies, normalized tables, and strict row-level security to enforce the single-player, privacy-first constitution of the product.

## 1. Entities
The foundation of the OS relies on four core entities:
* **User:** The owner of the private database space.
* **Contact:** Representing another human being connected to the user.
* **Interaction:** A logged point in time encompassing thoughts, reflections, and shared experiences.
* **Hook:** A piece of gathered context, acting as a proactive bridge for future connection.

## 2. Enums
Based on the defined Taxonomy, the database uses PostgreSQL Enums to enforce consistency and prevent arbitrary data drift.

* **Domain:** `personal`, `professional`, `community`, `hybrid`
* **Role:** `family`, `partner`, `friend`, `mentor_guide`, `colleague_collaborator`, `acquaintance`
* **Circle:** `core`, `orbit`, `peripheral`
* **InteractionChannel:** `in_person`, `voice_call`, `video`, `async_text`, `long_form_written`
* **InteractionDirection:** `initiated`, `received`, `mutual`, `serendipitous`
* **HookCategory:** `life_event`, `shared_interest`, `shared_struggle`, `aspirational_goal`, `resource_recommendation`
* **ActionType:** `check_in`, `deep_conversation`, `shared_experience`, `support_service`, `celebration`
* **LifecycleStage:** `incubation`, `cultivation`, `maturation`, `drift`, `renewal`
* **ValueExchangeCategory:** `emotional_support`, `intellectual_stimulation`, `joy_play`, `perspective_witnessing`, `practical_assistance`
* **ContactSource:** `organic_history`, `work_industry`, `community_interest`, `introduction_mutual_tie`, `serendipity`

## 3. Tables & 4. Fields

### Table: `users`
*(Tied directly to the authentication provider, e.g., `auth.users` in Supabase)*
* `id` (UUID, Primary Key)
* `created_at` (Timestamp with timezone)
* `preferences` (JSONB) - For aesthetic and UI configuration (e.g., tone preferences).

### Table: `contacts`
The anchor profile representing an individual relationship.
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key) -> `users.id`
* `first_name` (Text)
* `last_name` (Text, Nullable)
* `domain` (Enum: Domain)
* `role` (Enum: Role, Nullable)
* `circle` (Enum: Circle)
* `lifecycle_stage` (Enum: LifecycleStage)
* `contact_source` (Enum: ContactSource, Nullable)
* `avatar_url` (Text, Nullable)
* `created_at` (Timestamp with timezone)
* `updated_at` (Timestamp with timezone)

### Table: `interactions`
The narrative timeline of the relationship. Functions as both the logging mechanism and the journal entry.
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key) -> `users.id`
* `contact_id` (UUID, Foreign Key) -> `contacts.id`
* `occurred_at` (Timestamp with timezone) - When it happened (can differ from created_at).
* `channel` (Enum: InteractionChannel)
* `direction` (Enum: InteractionDirection)
* `action_type` (Enum: ActionType)
* `reflection_notes` (Text, Nullable) - The qualitative journal entry.
* `created_at` (Timestamp with timezone)
* `updated_at` (Timestamp with timezone)

### Table: `hooks`
The contextual anchors acting as future seeds for connection.
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key) -> `users.id`
* `contact_id` (UUID, Foreign Key) -> `contacts.id`
* `category` (Enum: HookCategory)
* `title` (Text) - Short actionable summary.
* `description` (Text, Nullable) - Nuanced context.
* `is_acted_upon` (Boolean, Default: false)
* `target_date` (Date, Nullable) - E.g., for birthdays or upcoming speeches.
* `created_at` (Timestamp with timezone)
* `updated_at` (Timestamp with timezone)

## 5. Junction Tables
To adhere to normalization constraints and avoid problematic PostgreSQL Array columns, many-to-many relationships are handled via junction tables.

### Table: `interaction_value_exchanges`
Maps one interaction to potentially multiple value exchange categories (e.g., an interaction might provide both "Emotional Support" and "Perspective").
* `interaction_id` (UUID, Foreign Key) -> `interactions.id`
* `value_exchange` (Enum: ValueExchangeCategory)
* **Primary Key:** Composite (`interaction_id`, `value_exchange`)

### Table: `interaction_hooks`
Allows the user to attach an existing hook to an interaction. (For instance, an interaction today resolved an `Aspirational Goal` hook logged three months ago).
* `interaction_id` (UUID, Foreign Key) -> `interactions.id`
* `hook_id` (UUID, Foreign Key) -> `hooks.id`
* **Primary Key:** Composite (`interaction_id`, `hook_id`)

## 6. Relationships Overview
* **`User` (1) to (Many) `Contact`:** A user manages many contacts.
* **`User` (1) to (Many) `Interaction`:** Global timeline ownership.
* **`User` (1) to (Many) `Hook`:** Global hook backlog ownership.
* **`Contact` (1) to (Many) `Interaction`:** The localized timeline of that specific relationship.
* **`Contact` (1) to (Many) `Hook`:** Nuanced context bound to a single person.
* **`Interaction` (Many) to (Many) `ValueExchangeCategory`:** Via `interaction_value_exchanges`.
* **`Interaction` (Many) to (Many) `Hook`:** Via `interaction_hooks`.

## 7. User Ownership
A strict multi-tenant architecture. Every meaningful table (`contacts`, `interactions`, `hooks`) MUST include a `user_id` foreign key. This ensures that no data exists in a vacuum and query scoping is foolproof. There are absolutely no public or shared records.

## 8. Indexing Strategy
Optimizations for rapid filtering on major product surfaces without overwhelming the database:
* **Primary Keys:** Standard B-tree indices on all UUID `id` fields.
* **Foreign Keys:** B-tree indices on every `user_id` and `contact_id` to speed up profile loading and global scoping.
* **Chronological Loading:** B-tree index on `interactions.occurred_at` (DESC) to support rapid visualization of The Narrative (Interaction Timeline).
* **Categorical Filtering:** B-tree indices on `contacts.circle`, `contacts.lifecycle_stage`, and `hooks.is_acted_upon`. This allows The Reflection Desk and Network Map to instantly fetch users in the `Core` circle or those currently in the `Drift` stage.

## 9. RLS (Row-Level Security) Requirements
Supabase compatibility requires ironclad RLS policies to enforce the strictly single-player constraint detailed in the product constitution.

* **Enable RLS:** RLS must be explicitly enabled on `contacts`, `interactions`, `hooks`, `interaction_value_exchanges`, and `interaction_hooks`.
* **The Golden Rule Policy:** Every table receives a uniform policy constraint:
  `CREATE POLICY "Users can only access their own data" ON table_name FOR ALL USING (auth.uid() = user_id);`
* For junction tables, RLS checks the `user_id` of the parent `interaction_id` using a subquery or joined security definer, ensuring the relationship is completely walled off. No user can ever select, insert, update, or delete a record that does not belong to their specific `user_id`.
