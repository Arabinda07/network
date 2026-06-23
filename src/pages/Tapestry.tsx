import React, { useState } from 'react';
import { useAppStore, selectors } from '../store';
import { Link } from 'react-router-dom';
import { Contact } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';
import ContactModal from '../components/ContactModal';
import GoogleContactSync from '../components/GoogleContactSync';

export default function Tapestry() {
  const store = useAppStore();
  const contacts = selectors.getAllContacts(store);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group by domain
  const domains = ['personal', 'professional', 'community', 'hybrid'] as const;
  
  const groupedContacts = domains.reduce((acc, domain) => {
    acc[domain] = contacts.filter(c => c.domain === domain);
    return acc;
  }, {} as Record<string, Contact[]>);

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 focus-visible:outline-none pb-24" tabIndex={-1}>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-3xl">
        <div className="space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
            People
          </h1>
          <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">
            People in your life.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          {contacts.length > 0 && <GoogleContactSync />}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-surface-hover hover:bg-black/10 dark:hover:bg-white/10 text-on-surface px-6 py-3 rounded-[16px] font-sans font-bold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto shadow-sm h-[40px] mt-2 sm:mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 dark:focus-visible:ring-white/50"
          >
            <PlusIcon className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </header>
      
      {contacts.length === 0 && (
         <div className="p-12 text-center border border-dashed border-border-medium rounded-[32px] flex flex-col items-center justify-center min-h-[400px]">
           <p className="font-serif text-on-surface/80 text-xl flex items-center gap-2">
             You haven't added anyone yet.
           </p>
           <p className="font-serif text-on-surface/60 mt-4 max-w-md mb-8">
             Start by adding some people you want to keep in touch with.
           </p>
           <GoogleContactSync />
         </div>
      )}

      <div className="space-y-16">
        {domains.map(domain => {
          const domainContacts = groupedContacts[domain];
          if (domainContacts.length === 0) return null;

          return (
            <section key={domain} className="space-y-6">
              <h2 className="font-sans font-bold tracking-widest uppercase text-sm text-on-surface/50 border-b border-border-subtle pb-4">
                {domain}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {domainContacts.map(contact => (
                  <Link 
                    to={`/contact/${contact.id}`} 
                    key={contact.id}
                    className="p-6 rounded-[24px] border border-border-subtle bg-[var(--surface-bg)] hover:border-border-medium transition-colors flex flex-col items-center text-center gap-4 group shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical"
                  >
                    <div className="w-16 h-16 rounded-full bg-botanical/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-border-subtle">
                      <span className="font-display font-extrabold text-2xl text-botanical">{contact.first_name[0]}</span>
                    </div>
                    <div>
                      <div className="font-sans font-bold text-base line-clamp-1 text-on-surface">{contact.first_name} {contact.last_name || ''}</div>
                      <div className="font-sans text-[10px] tracking-widest font-bold uppercase text-on-surface/60 mt-1">{contact.lifecycle_stage.replace(/_/g, ' ')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
