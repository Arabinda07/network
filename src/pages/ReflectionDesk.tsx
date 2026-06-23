import React, { useState } from 'react';
import { BookOpenIcon, CalendarIcon, PencilSquareIcon, PencilIcon, UserIcon, ArrowRightIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAppStore, selectors } from '../store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ReflectionDesk() {
  const store = useAppStore();
  const pendingReflections = selectors.getPendingReflections(store);
  const upcomingHooks = selectors.getUpcomingHooks(store);
  const allContacts = selectors.getAllContacts(store);

  const [noteText, setNoteText] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [editingInteractionId, setEditingInteractionId] = useState<string | null>(null);

  const handleSave = () => {
    if (!noteText.trim() || !selectedContactId) return;

    if (editingInteractionId) {
      store.updateInteraction(editingInteractionId, { 
        reflection_notes: noteText,
        updated_at: new Date().toISOString()
      });
    } else {
      store.addInteraction({
        id: uuidv4(),
        user_id: 'user_1',
        contact_id: selectedContactId,
        occurred_at: new Date().toISOString(),
        channel: 'in_person',
        direction: 'mutual',
        action_type: 'deep_conversation',
        reflection_notes: noteText,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    setNoteText('');
    setSelectedContactId(null);
    setEditingInteractionId(null);
  };

  const handleCompleteReflection = (interactionId: string, contactId: string) => {
    setEditingInteractionId(interactionId);
    setSelectedContactId(contactId);
    setNoteText(''); // Ready to type
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const selectedContact = selectedContactId ? selectors.getContact(store, selectedContactId) : null;

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 focus-visible:outline-none pb-24" tabIndex={-1}>
      
      {/* Page Greeting */}
      <header className="space-y-4 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
          Write Notes
        </h1>
        <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">
          A quiet week. Rest is part of the rhythm. <br className="hidden md:block"/> Who is on your mind today?
        </p>
      </header>

      {/* Primary Action: The Prompt */}
      <section className="surface-scope-sage relative z-20">
        <div className="absolute inset-0 bg-glow blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative bg-[var(--surface-current-bg)] p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-border-subtle shadow-sm dark:shadow-none backdrop-blur-xl">
          {editingInteractionId && (
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-botanical flex items-center gap-2">
              <PencilIcon className="w-4 h-4" /> Finish writing note
              <button onClick={() => { setEditingInteractionId(null); setSelectedContactId(null); }} className="hover:text-black">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          <textarea 
            className="w-full bg-transparent font-serif text-xl md:text-2xl placeholder:text-on-surface/30 text-on-surface focus:outline-none resize-none leading-relaxed rounded-md focus-visible:ring-2 focus-visible:ring-botanical/20" 
            rows={3} 
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder={editingInteractionId ? "Add your notes here..." : "Write a note or a memory..."}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 gap-4 pt-6 border-t border-border-subtle">
            <div className="flex flex-wrap items-center gap-3 relative">
              <button 
                onClick={() => setShowContactPicker(!showContactPicker)}
                className="px-4 py-2 bg-[var(--color-elevated)] hover:bg-surface-hover text-on-surface text-sm font-bold flex items-center gap-2 transition-colors rounded-[12px] whitespace-nowrap border border-border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical/50"
              >
                {selectedContact ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-botanical/20 flex items-center justify-center -ml-1 text-botanical text-xs font-display">
                      {selectedContact.first_name[0]}
                    </div>
                    {selectedContact.first_name} {selectedContact.last_name || ''}
                  </>
                ) : (
                  <>
                    <UserIcon className="w-4 h-4 text-botanical" /> Tag Person
                  </>
                )}
              </button>

              {showContactPicker && (
                <div className="absolute top-full left-0 mt-2 w-64 max-h-64 overflow-y-auto bg-[var(--color-elevated)] rounded-[16px] shadow-xl border border-border-subtle py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface/40">Your Circle</div>
                  {allContacts.map(c => (
                     <button 
                      key={c.id} 
                      onClick={() => { setSelectedContactId(c.id); setShowContactPicker(false); setEditingInteractionId(null); }}
                      className="w-full text-left px-4 py-2 hover:bg-surface-hover flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:bg-surface-hover dark:focus-visible:bg-white/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-botanical/10 flex items-center justify-center shrink-0">
                        <span className="font-display font-extrabold text-sm text-botanical">{c.first_name[0]}</span>
                      </div>
                      <span className="font-sans font-bold text-sm text-on-surface">{c.first_name} {c.last_name || ''}</span>
                    </button>
                  ))}
                  {allContacts.length === 0 && <div className="px-4 py-3 text-sm text-on-surface/50 font-serif italic">No contacts yet. Add someone in People.</div>}
                </div>
              )}

              <button className="px-4 py-2 bg-[var(--color-elevated)] hover:bg-surface-hover text-on-surface text-sm font-bold flex items-center gap-2 transition-colors rounded-[12px] border border-border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical/50">
                <CalendarIcon className="w-4 h-4 text-botanical" /> 
                Today
              </button>
            </div>
            <button 
              onClick={handleSave}
              disabled={!noteText.trim() || !selectedContactId}
              className={`px-8 py-4 rounded-[16px] font-sans font-bold flex items-center gap-2 transition-all w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)] ${
                noteText.trim() && selectedContactId 
                  ? 'bg-botanical text-white hover:bg-botanical/90 active:scale-95 shadow-lg shadow-botanical/20' 
                  : 'bg-surface-hover text-on-surface/40 cursor-not-allowed'
              }`}
            >
              Save Note
            </button>
          </div>
        </div>
      </section>

      {/* Curation Columns */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        
        {/* Ongoing Threads (Interactions waiting for notes) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <PencilSquareIcon className="w-5 h-5 text-on-surface/30" />
              Notes to Finish
            </h2>
          </div>
          
          <div className="space-y-4">
            {pendingReflections.map(interaction => {
              const contact = selectors.getContact(store, interaction.contact_id);
              if (!contact) return null;
              return (
              <div 
                key={interaction.id} 
                onClick={() => handleCompleteReflection(interaction.id, contact.id)}
                className="surface-scope-paper bg-[var(--surface-current-bg)] p-6 md:p-8 rounded-[24px] border border-border-subtle hover:border-border-medium transition-colors group cursor-text"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-botanical/10 flex items-center justify-center shrink-0">
                      <span className="font-display font-extrabold text-lg text-botanical">{contact.first_name[0]}</span>
                    </div>
                    <div>
                      <div className="font-sans font-bold text-base">{contact.first_name} {contact.last_name || ''}</div>
                      <div className="font-sans text-[11px] tracking-widest font-bold uppercase text-on-surface/40 mt-1">{formatDistanceToNow(parseISO(interaction.occurred_at), { addSuffix: true })}</div>
                    </div>
                  </div>
                </div>
                <div className="font-sans font-bold text-[15px] mb-2">{interaction.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <p className="font-serif text-lg text-on-surface/70 leading-relaxed italic">
                  Waiting for your notes...
                </p>
                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center text-botanical font-bold text-sm gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <PencilIcon className="w-4 h-4" />
                  Finish note
                </div>
              </div>
            )})}
            
            {pendingReflections.length === 0 && (
               <div className="p-8 text-center border border-dashed border-border-medium rounded-[24px] flex flex-col items-center gap-3">
                 <div className="font-serif text-on-surface/50 flex items-center gap-2">
                   All your recent chats have notes.
                   <TooltipProvider delay={0}>
                     <Tooltip>
                       <TooltipTrigger className="text-on-surface/40 hover:text-on-surface/80 transition-colors">
                         <InformationCircleIcon className="w-4 h-4" />
                       </TooltipTrigger>
                       <TooltipContent className="max-w-xs font-serif leading-relaxed text-center" side="top">
                         When you meet someone without adding notes, they will appear here so you can add notes later.
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                 </div>
               </div>
            )}
          </div>
        </section>

        {/* Upcoming Context (Hooks) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-on-surface/30" />
              Upcoming Reminders
            </h2>
          </div>
          
          <div className="space-y-4">
            {upcomingHooks.map(hook => {
              const contact = selectors.getContact(store, hook.contact_id);
              if (!contact) return null;
              return (
              <div key={hook.id} className="surface-scope-sky bg-[var(--surface-current-bg)] p-6 md:p-8 rounded-[24px] border border-border-subtle hover:border-border-medium transition-colors group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky/15 flex items-center justify-center shrink-0">
                      <span className="font-display font-extrabold text-lg text-sky mix-blend-multiply">{contact.first_name[0]}</span>
                    </div>
                    <div>
                      <div className="font-sans font-bold text-base">{contact.first_name} {contact.last_name || ''}</div>
                      <div className="font-sans text-[11px] tracking-widest font-bold uppercase text-sky mix-blend-multiply mt-1 opacity-80">{hook.target_date ? formatDistanceToNow(parseISO(hook.target_date), { addSuffix: true }) : 'Sometime'}</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-[8px] bg-[var(--color-elevated)] text-[10px] font-bold uppercase tracking-wider text-sky mix-blend-multiply shadow-sm">
                    {hook.category.replace(/_/g, ' ')}
                  </div>
                </div>
                <h3 className="font-sans font-bold text-[15px] mb-2 relative z-10">{hook.title}</h3>
                <p className="font-serif text-lg text-on-surface/70 leading-relaxed relative z-10">
                  {hook.description}
                </p>
                <div className="mt-6 pt-4 border-t border-sky/10 flex items-center text-sky mix-blend-multiply font-bold text-sm gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                  View details <ArrowRightIcon className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            )})}
            {upcomingHooks.length === 0 && (
               <div className="p-8 text-center border border-dashed border-border-medium rounded-[24px]">
                 <p className="font-serif text-on-surface/50">No upcoming reminders.</p>
               </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
