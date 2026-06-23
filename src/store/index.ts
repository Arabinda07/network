import { create } from 'zustand';
import { Contact, Interaction, Hook, AppSettings, Connection } from '../types';
import { mockContacts, mockInteractions, mockHooks, mockConnections } from './mockData';

interface AppState {
  settings: AppSettings;
  contacts: Record<string, Contact>;
  interactions: Record<string, Interaction>;
  hooks: Record<string, Hook>;
  connections: Record<string, Connection>;

  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  addInteraction: (interaction: Interaction) => void;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (id: string) => void;

  addHook: (hook: Hook) => void;
  updateHook: (id: string, updates: Partial<Hook>) => void;
  deleteHook: (id: string) => void;

  addConnection: (connection: Connection) => void;
  deleteConnection: (id: string) => void;

  importData: (data: Partial<AppState>) => void;
  resetData: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  settings: {
    onboarding_completed: false,
    onboarding_step: 1
  },
  contacts: mockContacts,
  interactions: mockInteractions,
  hooks: mockHooks,
  connections: mockConnections,

  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),

  addContact: (contact) => set((state) => ({ contacts: { ...state.contacts, [contact.id]: contact } })),
  updateContact: (id, updates) => set((state) => ({
    contacts: { ...state.contacts, [id]: { ...state.contacts[id], ...updates } }
  })),
  deleteContact: (id) => set((state) => {
    const { [id]: _, ...rest } = state.contacts;
    return { contacts: rest };
  }),

  addInteraction: (interaction) => set((state) => ({ interactions: { ...state.interactions, [interaction.id]: interaction } })),
  updateInteraction: (id, updates) => set((state) => ({
    interactions: { ...state.interactions, [id]: { ...state.interactions[id], ...updates } }
  })),
  deleteInteraction: (id) => set((state) => {
    const { [id]: _, ...rest } = state.interactions;
    return { interactions: rest };
  }),

  addHook: (hook) => set((state) => ({ hooks: { ...state.hooks, [hook.id]: hook } })),
  updateHook: (id, updates) => set((state) => ({
    hooks: { ...state.hooks, [id]: { ...state.hooks[id], ...updates } }
  })),
  deleteHook: (id) => set((state) => {
    const { [id]: _, ...rest } = state.hooks;
    return { hooks: rest };
  }),

  addConnection: (connection) => set((state) => ({ connections: { ...state.connections, [connection.id]: connection } })),
  deleteConnection: (id) => set((state) => {
    const { [id]: _, ...rest } = state.connections;
    return { connections: rest };
  }),

  importData: (data) => set((state) => ({
    contacts: data.contacts || state.contacts,
    interactions: data.interactions || state.interactions,
    hooks: data.hooks || state.hooks,
    connections: data.connections || state.connections,
    settings: data.settings || state.settings
  })),

  resetData: () => set({
    contacts: {},
    interactions: {},
    hooks: {},
    connections: {},
    settings: { onboarding_completed: true, onboarding_step: 0 }
  }),
}));

export const selectors = {
  getPendingReflections: (state: AppState) => {
    return Object.values(state.interactions).filter(interaction => !interaction.reflection_notes);
  },
  getUpcomingHooks: (state: AppState) => {
    return Object.values(state.hooks).filter(hook => !hook.is_acted_upon && hook.target_date);
  },
  getContact: (state: AppState, contactId: string) => {
    return state.contacts[contactId];
  },
  getAllContacts: (state: AppState) => {
    return Object.values(state.contacts);
  },
  getAllHooks: (state: AppState) => {
    return Object.values(state.hooks);
  },
  getAuditCandidates: (state: AppState) => {
    return Object.values(state.contacts).filter(
      c => c.lifecycle_stage === 'drift' || c.lifecycle_stage === 'maturation' || c.lifecycle_stage === 'dormant'
    );
  },
  getContactInteractions: (state: AppState, contactId: string) => {
    return Object.values(state.interactions)
      .filter(i => i.contact_id === contactId)
      .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
  },
  getContactHooks: (state: AppState, contactId: string) => {
    return Object.values(state.hooks).filter(h => h.contact_id === contactId);
  }
};
