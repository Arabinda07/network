import React from 'react';
import { useAppStore, selectors } from '../store';
import { Link } from 'react-router-dom';
import { SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function WinterAudit() {
  const store = useAppStore();
  const rawCandidates = selectors.getAuditCandidates(store);
  
  // Exclude dormant unless we want to show 'plant seed'
  const activeCandidates = rawCandidates.filter(c => c.lifecycle_stage !== 'dormant');
  const dormantCandidates = rawCandidates.filter(c => c.lifecycle_stage === 'dormant');

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-6 md:px-12 mt-8 md:mt-16 space-y-16 focus-visible:outline-none" tabIndex={-1}>
      <header className="space-y-4 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
          Check-in
        </h1>
        <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">
          A place to check in on people you haven't talked to in a while.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="font-sans font-bold tracking-widest uppercase text-sm text-on-surface/50 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" /> People you haven't talked to recently
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {activeCandidates.map(contact => (
            <div key={contact.id} className="surface-scope-sky bg-[var(--surface-current-bg)] p-6 md:p-8 rounded-[24px] border border-border-subtle flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-sky/15 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-2xl text-sky mix-blend-multiply">{contact.first_name[0]}</span>
                </div>
                <div>
                  <div className="font-sans font-bold text-lg">{contact.first_name} {contact.last_name || ''}</div>
                  <div className="font-sans text-[11px] font-bold uppercase text-sky mix-blend-multiply mt-1 tracking-widest opacity-80">{contact.lifecycle_stage.replace(/_/g, ' ')}</div>
                </div>
              </div>
              
              <div className="h-px bg-[var(--color-border-subtle)]" />
              
              <div className="flex flex-col gap-3">
                <p className="font-serif text-on-surface/70 leading-relaxed text-sm">
                  You haven't been in touch lately. What would you like to do?
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="flex-1 bg-[var(--color-elevated)] hover:bg-surface-hover text-on-surface font-sans font-bold text-sm py-2.5 rounded-[12px] transition-colors border border-border-subtle shadow-sm text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2">
                    Leave as is
                  </button>
                  <Link to={`/contact/${contact.id}`} className="flex-1 bg-sky text-white font-sans font-bold text-sm py-2.5 rounded-[12px] transition-colors hover:bg-sky/90 shadow-lg shadow-sky/20 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2">
                    Plan to talk
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {activeCandidates.length === 0 && (
             <div className="p-8 text-center border border-dashed border-border-medium rounded-[24px] col-span-full flex flex-col items-center gap-3">
               <div className="font-serif text-on-surface/80 flex items-center gap-2">
                 Your active relationships are warm and well-tended.
                 <TooltipProvider delay={0}>
                   <Tooltip>
                     <TooltipTrigger className="text-on-surface/60 hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]">
                       <InformationCircleIcon className="w-4 h-4" />
                     </TooltipTrigger>
                     <TooltipContent className="max-w-xs font-serif leading-relaxed text-center" side="top">
                       Connections that reach 'Drift' or 'Maturation' stage will automatically appear here when it's time to review them.
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
               </div>
             </div>
          )}
        </div>
      </section>
      
      {dormantCandidates.length > 0 && (
        <section className="space-y-6 pt-8">
           <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <h2 className="font-sans font-bold tracking-widest uppercase text-sm text-on-surface/50">
              Not actively keeping in touch
            </h2>
          </div>
        </section>
      )}

    </main>
  );
}
