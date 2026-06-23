import React, { useState } from 'react';
import { useAppStore, selectors } from '../store';
import { Interaction, Contact } from '../types';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, CalendarIcon, HeartIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function GlobalInteractionLog() {
  const store = useAppStore();
  const interactions = Object.values(store.interactions).sort((a, b) => 
    new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  );

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'in_person': return <MapPinIcon className="w-4 h-4" />;
      case 'voice_call': return <PhoneIcon className="w-4 h-4" />;
      case 'video': return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      default: return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
    }
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 focus-visible:outline-none pb-24" tabIndex={-1}>
      <header className="mb-12 max-w-3xl space-y-4">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">Interaction Log</h1>
        <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">Flow of your interactions across your entire sanctuary.</p>
      </header>

      <div className="relative border-l-2 border-border-subtle ml-6 md:ml-8 space-y-12 pb-12">
        {interactions.map(interaction => {
          const contact = selectors.getContact(store, interaction.contact_id);
          if (!contact) return null;

          return (
            <div key={interaction.id} className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-6 top-0 w-12 h-12 bg-[var(--surface-bg)] rounded-full flex items-center justify-center font-display font-extrabold text-xl text-botanical border-4 border-[var(--surface-bg)] ring-1 ring-border-medium z-10 group-hover:ring-botanical transition-all shadow-sm">
                {contact.first_name[0]}
              </div>

              <div className="flex-1 space-y-3 pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
                  <div className="flex items-center gap-3">
                      <Link to={`/contact/${contact.id}`} className="font-bold text-lg hover:underline decoration-border-medium underline-offset-4">
                        {contact.first_name} {contact.last_name}
                      </Link>
                      <span className="text-sm text-on-surface/50 font-serif italic">
                        {format(parseISO(interaction.occurred_at), 'MMMM d, yyyy')}
                      </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-botanical/10 text-botanical uppercase tracking-wider flex items-center gap-1 shrink-0">
                      {getChannelIcon(interaction.channel)} {interaction.channel.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-black/5 dark:bg-white/10 uppercase tracking-wider shrink-0 text-on-surface/70">
                      {interaction.action_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {interaction.reflection_notes ? (
                  <div className="bg-[var(--surface-bg)] border border-border-medium p-4 rounded-xl text-sm leading-relaxed font-serif text-on-surface/80 group-hover:border-botanical/50 transition-colors">
                    "{interaction.reflection_notes}"
                  </div>
                ) : (
                  <p className="text-sm text-on-surface/40 italic">No notes captured.</p>
                )}
              </div>
            </div>
          );
        })}
        {interactions.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif italic text-on-surface/50">Your space is quiet. Go make some memories.</p>
          </div>
        )}
      </div>
    </main>
  );
}
