import React, { useState, useEffect } from 'react';
import { useAppStore, selectors } from '../store';
import { Contact, Domain, Circle, LifecycleStage } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string; // If provided, we're editing
}

export default function ContactModal({ isOpen, onClose, contactId }: ContactModalProps) {
  const store = useAppStore();
  const existingContact = contactId ? selectors.getContact(store, contactId) : undefined;

  const [formData, setFormData] = useState<Partial<Contact>>({
    first_name: '',
    last_name: '',
    domain: 'personal',
    circle: 'orbit',
    lifecycle_stage: 'incubation'
  });

  useEffect(() => {
    if (existingContact) {
      setFormData(existingContact);
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        domain: 'personal',
        circle: 'orbit',
        lifecycle_stage: 'incubation'
      });
    }
  }, [existingContact, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name) return;

    if (existingContact) {
      store.updateContact(existingContact.id, {
        ...formData,
        updated_at: new Date().toISOString()
      });
    } else {
      const newContact: Contact = {
        id: uuidv4(),
        user_id: 'user_1', // Mocking auth user
        first_name: formData.first_name,
        last_name: formData.last_name,
        domain: formData.domain as Domain,
        circle: formData.circle as Circle,
        lifecycle_stage: formData.lifecycle_stage as LifecycleStage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.addContact(newContact);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--color-elevated)] w-full max-w-md rounded-[24px] shadow-2xl p-6 md:p-8 animate-in mt-10 md:mt-0">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface/50 hover:text-on-surface transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h2 className="font-display font-bold text-2xl mb-6">
          {existingContact ? 'Edit Contact' : 'New Contact'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/50">First Name</label>
              <input 
                type="text"
                required
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full bg-[var(--surface-bg)] border border-border-medium rounded-[12px] px-4 py-2.5 focus:outline-none focus:border-botanical transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/50">Last Name</label>
              <input 
                type="text"
                value={formData.last_name || ''}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full bg-[var(--surface-bg)] border border-border-medium rounded-[12px] px-4 py-2.5 focus:outline-none focus:border-botanical transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface/50">Category</label>
            <select 
              value={formData.domain}
              onChange={e => setFormData({ ...formData, domain: e.target.value as Domain })}
              className="w-full bg-[var(--surface-bg)] border border-border-medium rounded-[12px] px-4 py-2.5 focus:outline-none focus:border-botanical transition-colors appearance-none cursor-pointer"
            >
              <option value="personal">Personal</option>
              <option value="professional">Work</option>
              <option value="community">Community</option>
              <option value="hybrid">Friends from work</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface/50">How close are you?</label>
            <select 
              value={formData.circle}
              onChange={e => setFormData({ ...formData, circle: e.target.value as Circle })}
              className="w-full bg-[var(--surface-bg)] border border-border-medium rounded-[12px] px-4 py-2.5 focus:outline-none focus:border-botanical transition-colors appearance-none cursor-pointer"
            >
              <option value="core">Very Close</option>
              <option value="orbit">Regularly in touch</option>
              <option value="peripheral">Acquaintance</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface/50">Current Status</label>
            <select 
              value={formData.lifecycle_stage}
              onChange={e => setFormData({ ...formData, lifecycle_stage: e.target.value as LifecycleStage })}
              className="w-full bg-[var(--surface-bg)] border border-border-medium rounded-[12px] px-4 py-2.5 focus:outline-none focus:border-botanical transition-colors appearance-none cursor-pointer"
            >
              <option value="incubation">Just met</option>
              <option value="cultivation">Getting to know them</option>
              <option value="maturation">Keeping in touch</option>
              <option value="drift">Haven't talked in a while</option>
              <option value="renewal">Reconnecting</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-botanical text-white font-bold py-3 rounded-[12px] hover:bg-botanical/90 transition-colors shadow-lg shadow-botanical/20"
            >
              {existingContact ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
