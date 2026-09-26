import React from 'react';
import { ArrowRight, PlusCircle, Compass, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FinalCTASection: React.FC = () => {
  const { setCurrentView, openReportProblemSafely, isLoggedIn, currentUser } = useApp();

  return (
    <div>
      {/* Editorial Final Call to Action */}
      <section className="py-24 sm:py-32 bg-white border-b border-black/5 text-[#141414] relative overflow-hidden">
        
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-editorial-dots opacity-40 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              JOIN THE CIVIC NETWORK
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#141414] leading-[0.95] mb-6">
            What problem <br />
            <span className="font-bold italic text-blue-600">will you solve?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#141414]/70 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Your community already knows what needs to change. Civic2Campus helps find the people who can change it.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openReportProblemSafely}
              className="px-8 py-4 rounded-full bg-[#141414] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Report a Problem</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {!isLoggedIn ? (
              <button
                onClick={() => setCurrentView('login')}
                className="px-8 py-4 rounded-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs uppercase tracking-widest border border-emerald-950 shadow-md transition-all cursor-pointer"
              >
                Sign In / Join the Innovation Network
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('workspace')}
                className="px-8 py-4 rounded-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs uppercase tracking-widest border border-emerald-950 shadow-md transition-all cursor-pointer"
              >
                Open Project Workspace
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Minimal Editorial Footer */}
      <footer className="bg-[#F9F8F6] border-t border-black/5 py-12 text-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-black/5">
            
            {/* Logo and Tagline */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#141414] flex items-center justify-center text-white">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <span className="text-lg font-bold tracking-tight text-[#141414]">
                  Civic<span className="text-blue-600 italic">2</span>Campus
                </span>
              </div>
              <span className="hidden sm:inline text-[#141414]/30">|</span>
              <span className="text-xs text-[#141414]/60 font-medium">
                Local Problems. Collective Intelligence. Real Impact.
              </span>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#141414]/70">
              <button onClick={() => setCurrentView('home')} className="hover:text-emerald-800 transition-colors cursor-pointer">
                Overview
              </button>
              {!isLoggedIn && (
                <button onClick={() => setCurrentView('login')} className="text-emerald-800 font-extrabold hover:underline transition-colors cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Sign In</span>
                </button>
              )}
              <button onClick={() => setCurrentView('problems')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Discover
              </button>
              <button onClick={() => setCurrentView('map')} className="hover:text-blue-600 transition-colors cursor-pointer">
                3D Map
              </button>
              <button onClick={() => setCurrentView('match-center')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Match Center
              </button>
              <button onClick={() => setCurrentView('workspace')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Workspace
              </button>
              {isLoggedIn && (currentUser?.role === 'government' || currentUser?.role === 'admin') && (
                <button onClick={() => setCurrentView('command-center')} className="hover:text-blue-600 transition-colors cursor-pointer">
                  Command Center
                </button>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#141414]/40 font-mono">
            <div>
              GOVERNMENT OF JHARKHAND • STATE CIVIC INNOVATION NETWORK
            </div>
            <div>
              AI ENGINE POWERED BY GEMINI 2.5 • ACCREDITED ACADEMIC FRAMEWORK
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
