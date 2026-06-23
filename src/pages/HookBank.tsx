import React from 'react';
import { useAppStore, selectors } from '../store';
import { ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';

export default function HookBank() {
  const store = useAppStore();
  const allHooks = selectors.getAllHooks(store);
  
  // separate resolved vs unresolved hooks
  const activeHooks = allHooks.filter(h => !h.is_acted_upon);
  const resolvedHooks = allHooks.filter(h => h.is_acted_upon);

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 focus-visible:outline-none pb-24" tabIndex={-1}>
      <header className="space-y-4 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
          Reminders
        </h1>
        <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">
          Things to remember for later.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="font-sans font-bold tracking-widest uppercase text-sm text-on-surface/50">
            Active Reminders
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {activeHooks.map(hook => {
            const contact = selectors.getContact(store, hook.contact_id);
            if (!contact) return null;
            
            return (
              <div key={hook.id} className="relative bg-[var(--surface-current-bg)] p-6 md:p-8 rounded-[24px] border border-border-subtle hover:border-border-medium transition-colors group">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center shrink-0">
                      <span className="font-display font-extrabold text-lg">{contact.first_name[0]}</span>
                    </div>
                    <div>
                      <div className="font-sans font-bold text-base">{contact.first_name} {contact.last_name || ''}</div>
                      <div className="font-sans text-[11px] tracking-widest font-bold uppercase mt-1 opacity-60">
                        {hook.target_date ? formatDistanceToNow(parseISO(hook.target_date), { addSuffix: true }) : 'Sometime'}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-[8px] bg-surface-hover text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {hook.category.replace(/_/g, ' ')}
                  </div>
                </div>
                <h3 className="font-sans font-bold text-[15px] mb-2">{hook.title}</h3>
                <p className="font-serif text-lg text-on-surface/70 leading-relaxed">
                  {hook.description}
                </p>
                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center font-bold text-sm gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 text-botanical">
                  <Link to={`/contact/${contact.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical rounded flex items-center gap-1.5 before:absolute before:inset-0" aria-label={`View context for ${hook.title}`}>
                    View details <ArrowRightIcon className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
          
          {activeHooks.length === 0 && (
             <div className="p-8 text-center border border-dashed border-border-medium rounded-[24px] col-span-full flex flex-col items-center gap-3">
               <div className="font-serif text-on-surface/80 flex items-center gap-2">
                 No active reminders right now.
                 <TooltipProvider delay={0}>
                   <Tooltip>
                     <TooltipTrigger className="text-on-surface/60 hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]">
                       <InformationCircleIcon className="w-4 h-4" />
                     </TooltipTrigger>
                     <TooltipContent className="max-w-xs font-serif leading-relaxed" side="top">
                       Reminders are things like an upcoming interview or life event that you want to remember.
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
               </div>
             </div>
          )}
        </div>
      </section>
      
      {resolvedHooks.length > 0 && (
         <section className="space-y-6">
           <div className="flex items-center justify-between border-b border-border-subtle pb-4">
             <h2 className="font-sans font-bold tracking-widest uppercase text-sm text-on-surface/50">
               Past Reminders
             </h2>
           </div>
         </section>
      )}
    </main>
  );
}
