import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function Landing() {
  const navigate = useNavigate();
  const settings = useAppStore(state => state.settings);

  useEffect(() => {
    if (settings.onboarding_completed) {
      navigate('/', { replace: true });
    }
  }, [settings.onboarding_completed, navigate]);

  return (
    <div className="min-h-screen flex flex-col font-sans animate-in fade-in pb-24">
      <header className="px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-botanical" />
          <span className="font-display font-extrabold tracking-tight text-xl text-on-surface">Sanctuary</span>
        </div>
        <Link 
          to="/faq" 
          className="font-bold text-sm text-on-surface/60 hover:text-on-surface transition-colors"
        >
          FAQ
        </Link>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 mt-12 md:mt-24 max-w-4xl mx-auto w-full text-center space-y-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight text-on-surface">
            Tend to your network like a <span className="text-botanical italic font-serif">garden</span>.
          </h1>
          <p className="font-serif text-xl md:text-2xl text-on-surface/70 leading-relaxed max-w-2xl mx-auto">
            A quiet space to reflect on the people who matter most, map connections, and cultivate your professional and personal relationships deliberately.
          </p>
        </div>

        <div className="flex justify-center">
          <Link 
            to="/onboarding" 
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-botanical text-white rounded-2xl font-bold text-lg shadow-md hover:bg-botanical/90 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]"
          >
            Start your sanctuary
            <SparklesIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </main>
    </div>
  );
}
