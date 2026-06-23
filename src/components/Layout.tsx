import React, { useEffect, useState } from 'react';
import { SparklesIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useAppStore(state => state.settings);

  useEffect(() => {
    if (!settings.onboarding_completed) {
      navigate('/welcome', { replace: true });
    }
  }, [settings.onboarding_completed, navigate]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { name: 'Write Notes', path: '/' },
    { name: 'People', path: '/tapestry' },
    { name: 'Network Map', path: '/map' },
    { name: 'Log', path: '/log' },
    { name: 'Intros', path: '/introductions' },
    { name: 'Triage', path: '/triage' },
    { name: 'Reminders', path: '/hooks' },
    { name: 'Check-in', path: '/audit' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-botanical/20 pb-24 relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded shadow-md">
        Skip to main content
      </a>
      <header className="px-6 py-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical rounded px-2 -mx-2 py-1 shrink-0">
            <SparklesIcon className="w-5 h-5 text-botanical" />
            <span className="font-display font-extrabold tracking-tight text-xl">Sanctuary</span>
          </Link>
          <button 
            onClick={toggleDarkMode}
            className="md:hidden p-2 rounded-full hover:bg-surface-hover dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical shrink-0"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex items-center gap-4 md:gap-8 text-sm font-bold text-on-surface/50 overflow-x-auto hide-scrollbar pb-2 md:pb-0 w-full md:w-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors py-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical rounded px-1 ${
                  isActive
                    ? 'text-on-surface border-b-2 border-botanical'
                    : 'hover:text-on-surface'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <button 
            onClick={toggleDarkMode}
            className="hidden md:block p-2 rounded-full hover:bg-surface-hover dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical shrink-0 ml-auto"
            title="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
