import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { ReportProblemModal } from './components/modals/ReportProblemModal';
import { AuthModal } from './components/modals/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { ExploreProblemsPage } from './pages/ExploreProblemsPage';
import { InnovationMapPage } from './pages/InnovationMapPage';
import { AIMatchCenterPage } from './pages/AIMatchCenterPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { GovernmentDashboardPage } from './pages/GovernmentDashboardPage';
import { UniversityDashboardPage } from './pages/UniversityDashboardPage';
import { IndustryDashboardPage } from './pages/IndustryDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { currentView, isAuthModalOpen, setIsAuthModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-[#141414] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Global Header Navigation */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {currentView === 'home' && <LandingPage />}
        {currentView === 'login' && <LoginPage />}
        {currentView === 'problems' && <ExploreProblemsPage />}
        {(currentView === 'map' || currentView === 'innovation-map') && <InnovationMapPage />}
        {currentView === 'match-center' && <AIMatchCenterPage />}
        {currentView === 'workspace' && <ProjectWorkspacePage />}
        {currentView === 'command-center' && <GovernmentDashboardPage />}
        {currentView === 'university-dashboard' && <UniversityDashboardPage />}
        {currentView === 'industry-dashboard' && <IndustryDashboardPage />}
        {currentView === 'government-dashboard' && <GovernmentDashboardPage />}
        {currentView === 'admin-dashboard' && <AdminDashboardPage />}
      </main>

      {/* Global Modals & Overlay Drawers */}
      <CommandPalette />
      <ReportProblemModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
