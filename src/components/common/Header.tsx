import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  Bell,
  PlusCircle,
  Compass,
  Cpu,
  FolderGit2,
  ShieldCheck,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    universityActiveTab,
    industryActiveTab,
    governmentActiveTab,
    adminActiveTab,
    navigateToDashboardTab,
    setIsReportModalOpen,
    setIsCommandPaletteOpen,
    notifications,
    isLoggedIn,
    currentUser,
    logout,
    openReportProblemSafely,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogoClick = () => {
    if (isLoggedIn && currentUser) {
      if (currentUser.role === 'university') navigateToDashboardTab('university-dashboard', 'overview');
      else if (currentUser.role === 'industry') navigateToDashboardTab('industry-dashboard', 'overview');
      else if (currentUser.role === 'government') navigateToDashboardTab('government-dashboard', 'overview');
      else if (currentUser.role === 'admin') navigateToDashboardTab('admin-dashboard', 'overview');
      else setCurrentView('problems');
    } else {
      setCurrentView('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-black/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-8">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            id="c2c-header-logo-btn"
          >
            <div className="w-8 h-8 rounded-full bg-[#141414] text-white flex items-center justify-center font-serif-display font-bold text-lg group-hover:scale-105 transition-transform shadow-xs">
              <span className="text-white">C</span>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tighter text-[#141414] leading-none">
                Civic<span className="text-blue-600 italic">2</span>Campus
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600 leading-none mt-1">
                Jharkhand 2026 • AI Civic Matrix
              </div>
            </div>
          </button>

          {/* Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#141414]">
            {/* Public / Unauthenticated Navigation */}
            {(!isLoggedIn || currentUser?.role === 'citizen') && (
              <>
                <button
                  onClick={() => setCurrentView('home')}
                  className={`transition-all py-1 cursor-pointer border-b-2 ${
                    currentView === 'home'
                      ? 'opacity-100 border-blue-600 text-blue-600'
                      : 'opacity-50 border-transparent hover:opacity-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setTimeout(() => {
                      const el = document.getElementById('university-rankings-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'home'
                      ? 'opacity-75 border-transparent text-emerald-800 hover:opacity-100 font-semibold'
                      : 'opacity-50 border-transparent hover:opacity-100'
                  }`}
                  id="c2c-nav-rankings"
                >
                  <span>🏆</span>
                  <span>Rankings</span>
                </button>
                <button
                  onClick={() => setCurrentView('problems')}
                  className={`transition-all py-1 cursor-pointer border-b-2 ${
                    currentView === 'problems'
                      ? 'opacity-100 border-blue-600 text-blue-600'
                      : 'opacity-50 border-transparent hover:opacity-100'
                  }`}
                >
                  Problems
                </button>
                <button
                  onClick={() => setCurrentView('map')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    currentView === 'map' || currentView === 'innovation-map'
                      ? 'opacity-100 border-blue-600 text-blue-600'
                      : 'opacity-50 border-transparent hover:opacity-100'
                  }`}
                  id="c2c-nav-innovation-map"
                >
                  <span>🗺️</span>
                  <span>Innovation Map</span>
                </button>
                <button
                  onClick={() => setCurrentView('match-center')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    currentView === 'match-center'
                      ? 'opacity-100 border-blue-600 text-blue-600'
                      : 'opacity-50 border-transparent hover:opacity-100'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Match Center</span>
                </button>
                <button
                  onClick={() => setCurrentView('workspace')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    currentView === 'workspace'
                      ? 'opacity-100 border-blue-600 text-blue-600'
                      : 'opacity-50 border-transparent hover:opacity-100'
                  }`}
                >
                  <FolderGit2 className="w-3.5 h-3.5 opacity-60" />
                  <span>Workspace</span>
                </button>
              </>
            )}

            {/* University Portal Navigation */}
            {isLoggedIn && currentUser?.role === 'university' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateToDashboardTab('university-dashboard', 'overview')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    currentView === 'university-dashboard' && universityActiveTab === 'overview'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-emerald-950 hover:opacity-100'
                  }`}
                  id="c2c-nav-univ-dashboard"
                >
                  <span>🎓</span>
                  <span>University Dashboard</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('university-dashboard', 'ai-problems')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'university-dashboard' && universityActiveTab === 'ai-problems'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                  id="c2c-nav-univ-ai-challenges"
                >
                  <span>🔎</span>
                  <span>AI Challenges</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('university-dashboard', 'marketplace')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'university-dashboard' && universityActiveTab === 'marketplace'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                  id="c2c-nav-univ-marketplace"
                >
                  <span>📋</span>
                  <span>Marketplace</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('university-dashboard', 'student-teams')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'university-dashboard' && (universityActiveTab === 'student-teams' || universityActiveTab === 'my-projects')
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                  id="c2c-nav-univ-squad-projects"
                >
                  <span>📁</span>
                  <span>Squad Projects</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('university-dashboard', 'industry-collab')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'university-dashboard' && (universityActiveTab === 'industry-collab' || universityActiveTab === 'active-collabs')
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                  id="c2c-nav-univ-industry-collabs"
                >
                  <span>🤝</span>
                  <span>Industry Collabs</span>
                </button>
              </div>
            )}

            {/* Industry Portal Navigation */}
            {isLoggedIn && currentUser?.role === 'industry' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateToDashboardTab('industry-dashboard', 'overview')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    currentView === 'industry-dashboard' && industryActiveTab === 'overview'
                      ? 'opacity-100 border-slate-900 text-slate-900 font-bold'
                      : 'opacity-70 border-transparent text-slate-800 hover:opacity-100'
                  }`}
                  id="c2c-nav-industry-dashboard"
                >
                  <span>🏭</span>
                  <span>Industry Dashboard</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('industry-dashboard', 'ai-opportunities')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'industry-dashboard' && (industryActiveTab === 'ai-opportunities' || industryActiveTab === 'ai-recommendations')
                      ? 'opacity-100 border-slate-900 text-slate-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>🎯</span>
                  <span>AI Opportunities</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('industry-dashboard', 'universities')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'industry-dashboard' && industryActiveTab === 'universities'
                      ? 'opacity-100 border-slate-900 text-slate-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>🎓</span>
                  <span>Universities</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('industry-dashboard', 'csr-funding')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'industry-dashboard' && industryActiveTab === 'csr-funding'
                      ? 'opacity-100 border-slate-900 text-slate-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>💰</span>
                  <span>CSR & Grants</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('industry-dashboard', 'impact')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'industry-dashboard' && industryActiveTab === 'impact'
                      ? 'opacity-100 border-slate-900 text-slate-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>📊</span>
                  <span>ESG Metrics</span>
                </button>
              </div>
            )}

            {/* Government Portal Navigation */}
            {isLoggedIn && currentUser?.role === 'government' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateToDashboardTab('government-dashboard', 'overview')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    (currentView === 'government-dashboard' || currentView === 'command-center') && governmentActiveTab === 'overview'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-emerald-950 hover:opacity-100'
                  }`}
                  id="c2c-nav-gov-dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>State Command Center</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('government-dashboard', 'problem-monitoring')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    (currentView === 'government-dashboard' || currentView === 'command-center') && governmentActiveTab === 'problem-monitoring'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>🚨</span>
                  <span>Surveillance</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('government-dashboard', 'innovation-map')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    (currentView === 'government-dashboard' || currentView === 'command-center') && governmentActiveTab === 'innovation-map'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>🗺️</span>
                  <span>Innovation Map</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('government-dashboard', 'analytics')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    (currentView === 'government-dashboard' || currentView === 'command-center') && governmentActiveTab === 'analytics'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>📊</span>
                  <span>State Analytics</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('government-dashboard', 'reports')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    (currentView === 'government-dashboard' || currentView === 'command-center') && governmentActiveTab === 'reports'
                      ? 'opacity-100 border-emerald-700 text-emerald-800 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>📑</span>
                  <span>Reports</span>
                </button>
              </div>
            )}

            {/* Admin Portal Navigation */}
            {isLoggedIn && currentUser?.role === 'admin' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateToDashboardTab('admin-dashboard', 'overview')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    currentView === 'admin-dashboard' && adminActiveTab === 'overview'
                      ? 'opacity-100 border-zinc-900 text-zinc-900 font-bold'
                      : 'opacity-70 border-transparent text-zinc-800 hover:opacity-100'
                  }`}
                  id="c2c-nav-admin-dashboard"
                >
                  <span>🔐</span>
                  <span>Admin Console</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('admin-dashboard', 'users')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'admin-dashboard' && adminActiveTab === 'users'
                      ? 'opacity-100 border-zinc-900 text-zinc-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>👥</span>
                  <span>User Accounts</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('admin-dashboard', 'verification')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'admin-dashboard' && adminActiveTab === 'verification'
                      ? 'opacity-100 border-zinc-900 text-zinc-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>✅</span>
                  <span>Org Queue</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('admin-dashboard', 'ai-analysis')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'admin-dashboard' && adminActiveTab === 'ai-analysis'
                      ? 'opacity-100 border-zinc-900 text-zinc-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>🤖</span>
                  <span>AI Engine</span>
                </button>
                <button
                  onClick={() => navigateToDashboardTab('admin-dashboard', 'audit-logs')}
                  className={`transition-all py-1 cursor-pointer flex items-center gap-1 border-b-2 ${
                    currentView === 'admin-dashboard' && adminActiveTab === 'audit-logs'
                      ? 'opacity-100 border-zinc-900 text-zinc-900 font-bold'
                      : 'opacity-70 border-transparent text-stone-700 hover:opacity-100'
                  }`}
                >
                  <span>📜</span>
                  <span>Audit Logs</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Search Bar Trigger (Ctrl + K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-[#141414]/70 bg-white hover:bg-stone-100 rounded-full border border-black/10 transition-all cursor-pointer"
            title="Search Problems, Districts, Universities (Ctrl + K)"
            id="c2c-header-search-btn"
          >
            <Search className="w-3.5 h-3.5 opacity-60" />
            <span>Search...</span>
            <kbd className="text-[9px] font-mono bg-[#F9F8F6] px-1.5 py-0.5 rounded border border-black/10 opacity-70">
              ⌘K
            </kbd>
          </button>

          {/* User Sign In / Profile status */}
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'university') setCurrentView('university-dashboard');
                  else if (currentUser.role === 'industry') setCurrentView('industry-dashboard');
                  else if (currentUser.role === 'government') setCurrentView('government-dashboard');
                  else if (currentUser.role === 'admin') setCurrentView('admin-dashboard');
                  else setCurrentView('problems');
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-900 cursor-pointer transition-colors"
                title="Go to your Dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate max-w-[110px]">{currentUser.name}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-[11px] font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-full border border-stone-200 transition-colors cursor-pointer"
                title="Sign Out"
                id="c2c-header-logout-btn"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                currentView === 'login'
                  ? 'bg-emerald-900 text-amber-300 shadow-md shadow-emerald-950/30'
                  : 'text-emerald-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 shadow-xs'
              }`}
              title="Sign in or Register on Civic2Campus"
              id="c2c-header-login-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-950 fill-emerald-950" />
              <span>Sign In</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full text-[#141414] hover:bg-stone-100 border border-transparent hover:border-black/5 transition-colors cursor-pointer"
              title="Notifications"
              id="c2c-header-notif-btn"
            >
              <Bell className="w-4 h-4 opacity-80" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>
            {isNotifOpen && <NotificationCenter onClose={() => setIsNotifOpen(false)} />}
          </div>

          {/* Primary CTA: Report a Problem (Opens Auth if logged out, or opens 3-step modal if logged in) */}
          <button
            onClick={openReportProblemSafely}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-widest border border-black/10 rounded-full bg-white hover:bg-[#141414] hover:text-white text-[#141414] transition-all shadow-2xs cursor-pointer"
            id="c2c-header-report-btn"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Report Problem</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
