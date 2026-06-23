import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function FAQ() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans animate-in fade-in pb-24 px-6 md:px-12">
      <header className="py-6 max-w-4xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-bold text-on-surface/50 hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical rounded px-2 -mx-2 py-1"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
      </header>

      <main className="max-w-3xl mx-auto mt-8 md:mt-12 space-y-16">
        <header className="space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface">
            Frequently Asked Questions
          </h1>
          <p className="font-serif text-lg md:text-xl text-on-surface/70 leading-relaxed">
            Understanding the philosophy and function behind your sanctuary.
          </p>
        </header>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">Why do I need a sanctuary?</h2>
            <p className="font-serif text-lg leading-relaxed text-on-surface/80">
              Modern digital life scatters our relationships across a dozen different inboxes, feeds, and directories. This tool exists to give you a single, quiet space to prioritize human connection over algorithmic feeds.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">Is my data secure?</h2>
            <p className="font-serif text-lg leading-relaxed text-on-surface/80">
              Currently, Sanctuary runs completely in your browser. All your contacts, interactions, and notes are stored locally in your device's storage. It's completely private to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">How do I categorize contacts?</h2>
            <p className="font-serif text-lg leading-relaxed text-on-surface/80">
              We use a simple mental model of 'Circles' (Core, Orbit, Peripheral) to indicate how close someone is to you, and 'Lifecycle Stages' (Seed, Sprout, Bloom, etc.) to indicate the current state of your relationship. Use them however feels right for your intentionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">Can I export my data?</h2>
            <p className="font-serif text-lg leading-relaxed text-on-surface/80">
              Yes. You can export all your notes and contacts as a JSON copy from the Settings page. We believe in portable tools that you control.
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-border-subtle text-center">
          <Link 
            to="/onboarding" 
            className="inline-block px-6 py-3 bg-[var(--app-color-surface-hover)] text-on-surface font-bold rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical"
          >
            Start your sanctuary
          </Link>
        </div>
      </main>
    </div>
  );
}
