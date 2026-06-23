import React from 'react';
import { useAppStore, selectors } from '../store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { 
  InboxArrowDownIcon, 
  PencilSquareIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function TriageInbox() {
  const store = useAppStore();
  const navigate = useNavigate();
  
  const pendingReflections = selectors.getPendingReflections(store);
  const upcomingHooks = selectors.getUpcomingHooks(store);
  const pendingIntros = Object.values(store.connections).filter(c => c.outcome_status === 'pending');

  const totalItems = pendingReflections.length + upcomingHooks.length + pendingIntros.length;

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 focus-visible:outline-none pb-24 animate-in fade-in" tabIndex={-1}>
      <header className="mb-12 max-w-3xl space-y-4">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
          Triage Inbox
        </h1>
        <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">
          {totalItems > 0 
            ? `You have ${totalItems} items needing your attention.`
            : 'Your inbox is clear. Take a breath.'}
        </p>
      </header>

      <div className="space-y-12">
        {pendingReflections.length > 0 && (
          <section>
            <div className="flex items-center gap-2 text-on-surface font-bold text-xl mb-6">
              <PencilSquareIcon className="w-5 h-5 text-on-surface/40" />
              <h2>Pending Notes</h2>
            </div>
            <div className="flex flex-col gap-4">
              {pendingReflections.map(interaction => {
                const contact = selectors.getContact(store, interaction.contact_id);
                if (!contact) return null;
                return (
                  <div key={`ref-${interaction.id}`} className="bg-[var(--surface-bg)] border border-border-medium rounded-2xl p-6 flex items-center justify-between group hover:border-botanical transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-botanical/10 flex items-center justify-center shrink-0">
                        <span className="font-display font-extrabold text-lg text-botanical">{contact.first_name[0]}</span>
                      </div>
                      <div>
                        <div className="font-sans font-bold text-base">{contact.first_name} {contact.last_name || ''}</div>
                        <div className="font-sans text-[11px] tracking-widest font-bold uppercase text-on-surface/40 mt-1">
                          {formatDistanceToNow(parseISO(interaction.occurred_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/`)} // Can go to Write Notes to resolve
                      className="px-4 py-2 bg-black/5 dark:bg-white/10 rounded-xl text-sm font-bold opacity-100 sm:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all hover:bg-botanical hover:text-white shrink-0"
                    >
                      Write Note
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {pendingIntros.length > 0 && (
          <section>
            <div className="flex items-center gap-2 text-on-surface font-bold text-xl mb-6">
              <UserGroupIcon className="w-5 h-5 text-on-surface/40" />
              <h2>Pending Introductions</h2>
            </div>
            <div className="flex flex-col gap-4">
              {pendingIntros.map(intro => {
                const a = selectors.getContact(store, intro.contact_a_id);
                const b = selectors.getContact(store, intro.contact_b_id);
                if (!a || !b) return null;
                return (
                  <div key={`intro-${intro.id}`} className="bg-[var(--surface-bg)] border border-border-medium rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-botanical transition-colors gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-base font-bold">
                        <span>{a.first_name}</span>
                        <span className="text-on-surface/30 font-serif italic font-normal text-sm px-1">meets</span>
                        <span>{b.first_name}</span>
                      </div>
                      {intro.outcome_notes && (
                         <div className="text-sm font-medium text-on-surface/50 mt-1 italic line-clamp-1">{intro.outcome_notes}</div>
                      )}
                      <div className="font-sans text-[11px] tracking-widest font-bold uppercase text-on-surface/40 mt-2">
                        Created {formatDistanceToNow(parseISO(intro.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/introductions')}
                      className="px-4 py-2 bg-black/5 dark:bg-white/10 rounded-xl text-sm font-bold opacity-100 sm:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all hover:bg-botanical hover:text-white whitespace-nowrap self-start sm:self-auto shrink-0"
                    >
                      Update Status
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {upcomingHooks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 text-on-surface font-bold text-xl mb-6">
              <CalendarIcon className="w-5 h-5 text-on-surface/40" />
              <h2>Upcoming Reminders</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingHooks.map(hook => {
                const contact = selectors.getContact(store, hook.contact_id);
                if (!contact) return null;
                return (
                  <div key={`hook-${hook.id}`} className="bg-[var(--surface-bg)] border border-border-medium rounded-2xl p-6 hover:border-botanical transition-colors group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-botanical/10 flex items-center justify-center shrink-0">
                          <span className="font-display font-bold text-botanical">{contact.first_name[0]}</span>
                        </div>
                        <div>
                          <div className="font-bold text-sm">{contact.first_name} {contact.last_name || ''}</div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">
                            {hook.target_date ? formatDistanceToNow(parseISO(hook.target_date), { addSuffix: true }) : 'Sometime'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{hook.title}</h3>
                    <p className="font-serif text-sm text-on-surface/70 line-clamp-2">{hook.description}</p>
                    
                    <button 
                      onClick={() => navigate('/hooks')}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 rounded-xl text-xs font-bold transition-all hover:bg-botanical hover:text-white"
                    >
                      Review <ArrowRightIcon className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {totalItems === 0 && (
           <div className="py-24 text-center flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-botanical/10 flex items-center justify-center text-botanical">
               <CheckCircleIcon className="w-8 h-8" />
             </div>
             <p className="font-serif italic text-on-surface/50 text-lg">You're all caught up.</p>
           </div>
        )}
      </div>
    </main>
  );
}
