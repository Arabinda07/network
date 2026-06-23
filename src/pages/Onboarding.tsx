import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Contact, Domain, Circle, LifecycleStage } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function Onboarding() {
  const navigate = useNavigate();
  const { settings, updateSettings, addContact } = useAppStore();
  const { onboarding_step } = settings;

  // We are gating in an effect if already completed
  React.useEffect(() => {
    if (settings.onboarding_completed) {
      navigate('/', { replace: true });
    }
  }, [settings.onboarding_completed, navigate]);

  const setStep = (step: number) => {
    updateSettings({ onboarding_step: step });
  };

  const handleComplete = () => {
    updateSettings({ onboarding_completed: true });
    navigate('/');
  };

  const steps = [
    { title: 'Who would you call first?', circle: 'core' as Circle, lifecycle: 'cultivation' as LifecycleStage },
    { title: 'Who have you lost touch with?', circle: 'orbit' as Circle, lifecycle: 'drift' as LifecycleStage },
    { title: 'Who do you respect but barely know?', circle: 'peripheral' as Circle, lifecycle: 'incubation' as LifecycleStage }
  ];

  const currentStepData = steps[onboarding_step - 1];

  const [contacts, setContacts] = useState([{ id: uuidv4(), name: '', note: '', domain: 'professional' as Domain }]);

  const handleNext = () => {
    if (onboarding_step <= 3) {
      contacts.forEach(c => {
        if (c.name.trim()) {
          const names = c.name.split(' ');
          const first = names[0];
          const last = names.slice(1).join(' ');
          addContact({
            id: uuidv4(),
            user_id: 'user', // mock
            first_name: first,
            last_name: last,
            domain: c.domain,
            circle: currentStepData.circle,
            lifecycle_stage: currentStepData.lifecycle,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });
    }

    if (onboarding_step < 5) {
      setContacts([{ id: uuidv4(), name: '', note: '', domain: 'professional' as Domain }]);
      setStep(onboarding_step + 1);
    } else {
      handleComplete();
    }
  };

  const updateContact = (id: string, field: string, value: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addRow = () => {
    setContacts([...contacts, { id: uuidv4(), name: '', note: '', domain: 'professional' as Domain }]);
  };

  if (settings.onboarding_completed) {
    return null; // will redirect
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center py-12 px-4 space-y-8 animate-in fade-in">
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full ${onboarding_step === i ? 'bg-botanical shadow-md scale-125' : onboarding_step > i ? 'bg-botanical/50' : 'bg-black/10 dark:bg-white/10'} transition-all`} />
        ))}
      </div>

      <div className="bg-[var(--surface-current-bg)] w-full max-w-xl rounded-[24px] p-8 mt-4 shadow-sm border border-border-subtle">
        
        {onboarding_step <= 3 && (
          <div className="space-y-6">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-center text-on-surface mb-2">{currentStepData.title}</h1>
            <p className="text-center text-on-surface/60 font-sans text-sm">{
              onboarding_step === 1 ? "Name 1–3 people you'd reach out to immediately if something significant happened in your work or life." :
              onboarding_step === 2 ? "Name 1–3 people you genuinely value but haven't spoken to in a while." :
              "1–3 people in different circles whose work you follow or admire."
            }</p>
            
            <div className="space-y-4 mt-8">
              {contacts.map((c, idx) => (
                <div key={c.id} className="p-4 bg-[var(--surface-bg)] rounded-[16px] border border-border-medium flex flex-col gap-3">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateContact(c.id, 'name', e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-transparent border-b border-border-subtle pb-2 focus:outline-none focus:border-botanical font-bold placeholder:font-normal placeholder:text-on-surface/30"
                  />
                  <div className="flex gap-2">
                    <select
                      value={c.domain}
                      onChange={(e) => updateContact(c.id, 'domain', e.target.value)}
                      className="text-sm bg-[var(--color-elevated)] border border-border-medium rounded-lg px-2 py-1.5 focus:outline-none focus:border-botanical"
                    >
                      <option value="professional">Professional</option>
                      <option value="personal">Personal</option>
                      <option value="community">Community</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {contacts.length < 5 && (
                <button onClick={addRow} className="text-sm font-bold text-botanical hover:text-botanical/80 px-2 py-1">
                  + Add another person
                </button>
              )}
            </div>
          </div>
        )}

        {onboarding_step === 4 && (
          <div className="space-y-6">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-center text-on-surface mb-2">When is your push day?</h1>
            <p className="text-center text-on-surface/60 font-sans text-sm">Pick one day each week. That's when we might surface your batch of people to reach out to.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <button
                  key={day}
                  onClick={() => updateSettings({ push_day: day as any })}
                  className={`py-3 rounded-xl border text-sm font-bold capitalize transition-colors ${settings.push_day === day ? 'bg-botanical text-white border-botanical shadow-md' : 'bg-[var(--surface-bg)] border-border-medium text-on-surface/70 hover:border-botanical'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {onboarding_step === 5 && (
          <div className="space-y-6">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-center text-on-surface mb-2">Bring your network in</h1>
            <p className="text-center text-on-surface/60 font-sans text-sm">You can upload a CSV or sync contacts from Google. (This is a placeholder for now!)</p>
            
            <div className="p-8 border-2 border-dashed border-border-medium rounded-[24px] text-center mt-8">
              <p className="text-on-surface/50 text-sm font-bold tracking-wider uppercase mb-4">You can do this later from Settings</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12 pt-6 border-t border-border-subtle items-center">
          <div className="flex gap-2">
            {onboarding_step > 1 ? (
               <button onClick={() => setStep(onboarding_step - 1)} className="px-6 py-2 rounded-xl text-sm font-bold text-on-surface/50 hover:bg-surface-hover transition-colors">
                 Back
               </button>
            ) : null}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleComplete}
              className="text-sm font-bold text-on-surface/40 hover:text-on-surface/70 transition-colors"
            >
              Skip All
            </button>
            <button 
              onClick={handleNext} 
              className="px-6 py-2 bg-botanical text-white rounded-xl text-sm font-bold shadow-md hover:bg-botanical/90 transition-colors"
            >
              {onboarding_step === 5 ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
