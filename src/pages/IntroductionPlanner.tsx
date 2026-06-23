import React, { useState } from 'react';
import { useAppStore, selectors } from '../store';
import { Connection } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export default function IntroductionPlanner() {
  const store = useAppStore();
  const contacts = selectors.getAllContacts(store);
  const connectionsMap = store.connections;
  const connections = Object.values(connectionsMap).filter(c => c.relationship_type === 'introduced_by_me');
  
  const [isAdding, setIsAdding] = useState(false);
  const [contactA, setContactA] = useState('');
  const [contactB, setContactB] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!contactA || !contactB || contactA === contactB) return;
    
    store.addConnection({
      id: uuidv4(),
      user_id: 'user',
      contact_a_id: contactA,
      contact_b_id: contactB,
      relationship_type: 'introduced_by_me',
      strength: 'unknown',
      outcome_status: 'pending',
      outcome_notes: notes,
      created_at: new Date().toISOString()
    });

    setContactA('');
    setContactB('');
    setNotes('');
    setIsAdding(false);
  };

  const handleUpdateStatus = (id: string, status: Connection['outcome_status']) => {
    const conn = connectionsMap[id];
    if (conn) {
      store.addConnection({ ...conn, outcome_status: status });
    }
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 focus-visible:outline-none pb-24" tabIndex={-1}>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-3xl mb-12">
        <div className="space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">Introductions</h1>
          <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">Bridge the gaps in your network by connecting great people.</p>
        </div>
        <div className="flex w-full md:w-auto">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-6 py-3 bg-botanical text-white rounded-xl text-sm font-bold shadow-md hover:bg-botanical/90 transition-colors w-full sm:w-auto"
          >
            {isAdding ? 'Cancel' : 'Plan Introduction'}
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="bg-[var(--surface-bg)] border border-border-medium p-6 rounded-[24px] mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface/50 tracking-widest mb-2">From</label>
              <select className="w-full bg-transparent border-b border-border-medium pb-2 focus:outline-none focus:border-botanical" value={contactA} onChange={e => setContactA(e.target.value)}>
                <option value="">Select person...</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface/50 tracking-widest mb-2">To</label>
              <select className="w-full bg-transparent border-b border-border-medium pb-2 focus:outline-none focus:border-botanical" value={contactB} onChange={e => setContactB(e.target.value)}>
                <option value="">Select person...</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface/50 tracking-widest mb-2">Why they should meet</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What's the synergy?"
              className="w-full bg-transparent border-b border-border-medium pb-2 focus:outline-none focus:border-botanical resize-none min-h-[60px]"
            />
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleAdd}
              disabled={!contactA || !contactB || contactA === contactB}
              className="px-6 py-2 bg-on-surface text-white rounded-xl text-sm font-bold shadow-md hover:bg-on-surface/90 transition-colors disabled:opacity-50"
            >
              Save Intention
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {connections.length > 0 ? connections.map(conn => {
          const a = selectors.getContact(store, conn.contact_a_id);
          const b = selectors.getContact(store, conn.contact_b_id);
          if (!a || !b) return null;

          return (
            <div key={conn.id} className="p-6 bg-[var(--surface-bg)] border border-border-subtle rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-lg font-bold">
                  <Link to={`/contact/${a.id}`} className="hover:text-botanical">{a.first_name}</Link>
                  <span className="text-on-surface/30 px-2 font-serif italic text-sm">meets</span>
                  <Link to={`/contact/${b.id}`} className="hover:text-botanical">{b.first_name}</Link>
                </div>
                <div className="flex gap-2">
                  {(['pending', 'meeting_happened', 'collaboration'] as const).map(status => (
                    <button 
                      key={status}
                      onClick={() => handleUpdateStatus(conn.id, status)}
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
                        conn.outcome_status === status 
                          ? 'bg-botanical text-white' 
                          : 'bg-black/5 dark:bg-white/5 text-on-surface/50 hover:bg-black/10'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              {conn.outcome_notes && (
                <div className="text-sm text-on-surface/70 mt-2 pl-4 border-l-2 border-border-medium italic">
                  {conn.outcome_notes}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="py-24 text-center">
             <p className="font-serif italic text-on-surface/50">Who would benefit from meeting each other?</p>
          </div>
        )}
      </div>
    </main>
  );
}
