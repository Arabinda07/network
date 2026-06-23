import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from './components/Layout';
import ReflectionDesk from './pages/ReflectionDesk';
import Tapestry from './pages/Tapestry';
import HookBank from './pages/HookBank';
import WinterAudit from './pages/WinterAudit';
import AnchorProfile from './pages/AnchorProfile';
import Onboarding from './pages/Onboarding';
import NetworkMap from './pages/NetworkMap';
import GlobalInteractionLog from './pages/GlobalInteractionLog';
import IntroductionPlanner from './pages/IntroductionPlanner';
import TriageInbox from './pages/TriageInbox';
import SettingsManager from './pages/SettingsManager';

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<ReflectionDesk />} />
            <Route path="tapestry" element={<Tapestry />} />
            <Route path="map" element={<NetworkMap />} />
            <Route path="log" element={<GlobalInteractionLog />} />
            <Route path="introductions" element={<IntroductionPlanner />} />
            <Route path="triage" element={<TriageInbox />} />
            <Route path="hooks" element={<HookBank />} />
            <Route path="audit" element={<WinterAudit />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="contact/:id" element={<AnchorProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
