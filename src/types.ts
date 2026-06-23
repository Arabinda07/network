export type Domain = 'personal' | 'professional' | 'community' | 'hybrid';

export type Role =
  | 'family'
  | 'partner'
  | 'friend'
  | 'mentor_guide'
  | 'colleague_collaborator'
  | 'acquaintance';

export type Circle = 'core' | 'orbit' | 'peripheral';

export type LifecycleStage =
  | 'incubation'
  | 'cultivation'
  | 'maturation'
  | 'drift'
  | 'dormant'
  | 'renewal';

export type InteractionChannel =
  | 'in_person'
  | 'voice_call'
  | 'video'
  | 'async_text'
  | 'long_form_written';

export type InteractionDirection =
  | 'initiated'
  | 'received'
  | 'mutual'
  | 'serendipitous';

export type ActionType =
  | 'check_in'
  | 'deep_conversation'
  | 'shared_experience'
  | 'support_service'
  | 'celebration';

export type HookCategory =
  | 'life_event'
  | 'shared_interest'
  | 'shared_struggle'
  | 'aspirational_goal'
  | 'resource_recommendation';

export type ValueExchangeCategory =
  | 'emotional_support'
  | 'intellectual_stimulation'
  | 'joy_play'
  | 'perspective_witnessing'
  | 'practical_assistance';

export type ContactSource =
  | 'organic_history'
  | 'work_industry'
  | 'community_interest'
  | 'introduction_mutual_tie'
  | 'serendipity';

export interface User {
  id: string;
  created_at: string;
  preferences: Record<string, any>;
}

export interface Contact {
  id: string;
  user_id: string;
  first_name: string;
  last_name?: string;
  domain: Domain;
  role?: Role;
  circle: Circle;
  lifecycle_stage: LifecycleStage;
  contact_source?: ContactSource;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  user_id: string;
  contact_id: string;
  occurred_at: string;
  channel: InteractionChannel;
  direction: InteractionDirection;
  action_type: ActionType;
  reflection_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppSettings {
  push_day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  onboarding_completed: boolean;
  onboarding_step: number;
}

export type RelationshipType = 'knows' | 'worked_together' | 'college_batch' | 'introduced_by_me' | 'event_met';
export type ConnectionStrength = 'strong' | 'weak' | 'unknown';
export type ConnectionOutcomeStatus = 'pending' | 'meeting_happened' | 'collaboration' | 'faded';

export interface Connection {
  id: string;
  user_id: string;
  contact_a_id: string;
  contact_b_id: string;
  relationship_type: RelationshipType;
  strength: ConnectionStrength;
  outcome_notes?: string;
  outcome_status?: ConnectionOutcomeStatus;
  created_at: string;
}

export interface Hook {
  id: string;
  user_id: string;
  contact_id: string;
  category: HookCategory;
  title: string;
  description?: string;
  is_acted_upon: boolean;
  target_date?: string;
  created_at: string;
  updated_at: string;
}
