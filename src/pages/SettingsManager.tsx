import React, { useRef } from 'react';
import { useAppStore } from '../store';
import { 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon, 
  TrashIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
] as const;

export default function SettingsManager() {
  const store = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify({
      version: 1,
      settings: store.settings,
      contacts: store.contacts,
      interactions: store.interactions,
      hooks: store.hooks,
      connections: store.connections,
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sanctuary-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm('Are you sure you want to overwrite your data with this file? This cannot be undone.')) {
          store.importData(data);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone by any means.')) {
      if (window.prompt('Type "DELETE" to confirm.') === 'DELETE') {
        store.resetData();
        alert('All data has been deleted.');
      }
    }
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 focus-visible:outline-none pb-24 animate-in fade-in" tabIndex={-1}>
      <header className="mb-12 max-w-3xl space-y-4">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
          Settings
        </h1>
        <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">
          Configure your workspace and manage your data.
        </p>
      </header>

      <div className="space-y-12">
        <section>
           <h2 className="text-xl font-bold text-on-surface mb-4">Preferences</h2>
           <div className="bg-[var(--surface-bg)] border border-border-medium rounded-2xl p-6">
             <label className="block mb-2 font-bold text-sm">Weekly Check-in Day</label>
             <p className="text-sm text-on-surface/60 mb-4 font-serif italic">
               The day your space prompts you to review your connections and outstanding items.
             </p>
             <select 
               className="w-full md:w-64 bg-transparent border border-border-medium rounded-lg p-2.5 outline-none focus:border-botanical font-medium capitalize"
               value={store.settings.push_day || ''}
               onChange={(e) => store.updateSettings({ push_day: e.target.value as any })}
             >
               <option value="">Select a day...</option>
               {DAYS_OF_WEEK.map(day => (
                 <option key={day} value={day}>{day}</option>
               ))}
             </select>
           </div>
        </section>

        <section>
           <h2 className="text-xl font-bold text-on-surface mb-4">Data Management</h2>
           <div className="bg-[var(--surface-bg)] border border-border-medium rounded-2xl p-6 space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
               <div>
                  <h3 className="font-bold">Export Backup</h3>
                  <p className="text-sm text-on-surface/60 mt-1">Download all your sanctuary data as a single JSON file.</p>
               </div>
               <button 
                 onClick={handleExport}
                 className="flex items-center justify-center gap-2 px-4 py-2 bg-on-surface text-white rounded-xl text-sm font-bold shadow-md hover:bg-on-surface/90 transition-colors whitespace-nowrap"
               >
                 <ArrowDownTrayIcon className="w-4 h-4" /> Export Data
               </button>
             </div>

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
               <div>
                  <h3 className="font-bold">Import Backup</h3>
                  <p className="text-sm text-on-surface/60 mt-1">Restore your data from a previously exported JSON file. <strong className="text-clay font-medium">This will overwrite your current data.</strong></p>
               </div>
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex items-center justify-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 text-on-surface rounded-xl text-sm font-bold shadow-sm hover:bg-black/10 transition-colors whitespace-nowrap"
               >
                 <ArrowUpTrayIcon className="w-4 h-4" /> Import Data
               </button>
               <input 
                 type="file" 
                 accept=".json" 
                 ref={fileInputRef} 
                 onChange={handleImport} 
                 className="hidden" 
               />
             </div>

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
               <div>
                  <h3 className="font-bold text-clay">Danger Zone</h3>
                  <p className="text-sm text-on-surface/60 mt-1">Permanently delete all your contacts, interactions, and settings.</p>
               </div>
               <button 
                 onClick={handleReset}
                 className="flex items-center justify-center gap-2 px-4 py-2 bg-clay/10 text-clay border border-clay/20 rounded-xl text-sm font-bold shadow-sm hover:bg-clay/20 transition-colors whitespace-nowrap"
               >
                 <TrashIcon className="w-4 h-4" /> Delete All Data
               </button>
             </div>
           </div>
        </section>
      </div>
    </main>
  );
}
