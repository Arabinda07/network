import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore, selectors } from '../store';
import { ArrowLeftIcon, ClockIcon, ChatBubbleLeftIcon, PencilIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import ContactModal from '../components/ContactModal';
import { v4 as uuidv4 } from 'uuid';

export default function AnchorProfile() {
  const { id } = useParams();
  const store = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftNote, setDraftNote] = useState('');
  
  if (!id) return <div>Invalid ID</div>;
  
  const contact = selectors.getContact(store, id);
  const interactions = selectors.getContactInteractions(store, id);
  const hooks = selectors.getContactHooks(store, id);
  
  if (!contact) {
    return (
      <main className="max-w-5xl mx-auto px-6 md:px-12 mt-8 md:mt-16 text-center">
        <h1 className="font-display text-2xl">Contact not found.</h1>
        <Link to="/tapestry" className="text-botanical hover:underline mt-4 inline-block">Back to People</Link>
      </main>
    );
  }

  const handleSaveDraft = () => {
    if (!draftNote.trim()) return;
    store.addInteraction({
      id: uuidv4(),
      user_id: 'user_1',
      contact_id: id,
      occurred_at: new Date().toISOString(),
      channel: 'in_person',
      direction: 'mutual',
      action_type: 'deep_conversation',
      reflection_notes: draftNote,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setDraftNote('');
  };

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-16 space-y-16 pb-24">
      
      {/* Back navigation */}
      <Link to="/tapestry" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface/50 hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical rounded px-1 -mx-1">
        <ArrowLeftIcon className="w-4 h-4" /> Back to People
      </Link>

      <header className="space-y-8 relative">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-0 right-0 p-3 bg-surface-hover hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-on-surface/50 hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 dark:focus-visible:ring-white/50"
        >
          <PencilSquareIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-6 md:gap-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-botanical/10 flex items-center justify-center shrink-0">
             <span className="font-display font-extrabold text-4xl md:text-5xl text-botanical">{contact.first_name[0]}</span>
           </div>
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
              {contact.first_name} {contact.last_name || ''}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="px-3 py-1.5 bg-[var(--color-surface-hover)] rounded-[8px] font-sans text-xs font-bold uppercase tracking-widest text-on-surface/60">
                {contact.domain}
              </span>
              <span className="px-3 py-1.5 bg-[var(--color-surface-hover)] rounded-[8px] font-sans text-xs font-bold uppercase tracking-widest text-on-surface/60">
                {contact.circle} circle
              </span>
              <span className="px-3 py-1.5 bg-sky/10 rounded-[8px] font-sans text-xs font-bold uppercase tracking-widest text-sky mix-blend-multiply">
                {contact.lifecycle_stage.replace(/_/g, ' ')} stage
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Draft Component placeholder - a clean input specific to this contact */}
      <section className="bg-[var(--surface-current-bg)] p-6 md:p-8 rounded-[24px] border border-border-subtle shadow-sm">
        <div className="flex gap-4">
          <PencilIcon className="w-5 h-5 text-botanical shrink-0 mt-1" />
          <textarea 
            className="w-full bg-transparent font-serif text-xl placeholder:text-on-surface/30 text-on-surface focus:outline-none resize-none focus-visible:ring-2 focus-visible:ring-botanical/20 rounded-md" 
            rows={2} 
            value={draftNote}
            onChange={e => setDraftNote(e.target.value)}
            placeholder={`Log a new memory with ${contact.first_name}...`}
          />
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-border-subtle">
          <button 
            onClick={handleSaveDraft}
            disabled={!draftNote.trim()}
            className={`px-6 py-2.5 rounded-[12px] font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical focus-visible:ring-offset-2 ${
              draftNote.trim() ? 'bg-botanical text-white hover:bg-botanical/90' : 'bg-surface-hover dark:bg-white/5 text-on-surface/40 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Interaction History Column */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="font-sans font-bold tracking-widest uppercase text-sm text-on-surface/50 border-b border-border-subtle pb-4 flex items-center gap-2">
            <ClockIcon className="w-4 h-4" /> History
          </h2>
          
          <div className="space-y-6">
            {interactions.length > 0 ? interactions.map(interaction => (
              <div key={interaction.id} className="relative pl-6 border-l border-border-medium">
                <div className="absolute w-3 h-3 bg-botanical/20 rounded-full -left-[6.5px] top-1.5 border-2 border-white dark:border-[var(--color-surface-base)]" />
                <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface/40">
                  <span>{format(parseISO(interaction.occurred_at), 'MMMM d, yyyy')}</span>
                  <span>·</span>
                  <span>{interaction.action_type.replace(/_/g, ' ')}</span>
                  <span>·</span>
                  <span>{interaction.channel.replace(/_/g, ' ')}</span>
                </div>
                <p className="font-serif text-lg text-on-surface/80 leading-relaxed">
                  {interaction.reflection_notes || <span className="italic text-on-surface/40">Awaiting reflection...</span>}
                </p>
              </div>
            )) : (
              <p className="font-serif text-on-surface/50 italic">No history recorded yet.</p>
            )}
          </div>
        </div>

        {/* Hooks Context Column */}
        <div className="space-y-8">
          <h2 className="font-sans font-bold tracking-widest uppercase text-sm text-on-surface/50 border-b border-border-subtle pb-4 flex items-center gap-2">
            <ChatBubbleLeftIcon className="w-4 h-4" /> Reminders
          </h2>
          
          <div className="space-y-4">
            {hooks.length > 0 ? hooks.map(hook => (
              <div key={hook.id} className={`p-5 rounded-[16px] border border-border-subtle ${hook.is_acted_upon ? 'opacity-50' : 'bg-[var(--color-surface-hover)]'}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface/50 mb-2">
                  {hook.category.replace(/_/g, ' ')}
                </div>
                <h3 className="font-sans font-bold text-sm mb-1">{hook.title}</h3>
                <p className="font-serif text-sm text-on-surface/70">
                  {hook.description}
                </p>
              </div>
            )) : (
              <p className="font-serif text-on-surface/50 italic text-sm">No reminders recorded.</p>
            )}
          </div>
        </div>
      </div>
      
      <ContactModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} contactId={contact.id} />
    </main>
  );
}
