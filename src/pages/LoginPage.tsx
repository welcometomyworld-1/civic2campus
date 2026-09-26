import React from 'react';
import { useApp } from '../context/AppContext';
import { MinimalistAuthCard } from '../components/auth/MinimalistAuthCard';
import { ArrowLeft, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-hidden bg-gradient-to-br from-[#01261d] via-[#013b2e] to-[#001f17]">
      
      {/* Background Animated Ambient Lights & Radial Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-amber-400/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] bg-emerald-400/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-900/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        
        {/* Top Navigation & Status Bar */}
        <div className="w-full flex items-center justify-between mb-4 text-white/90">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/15 transition-all cursor-pointer shadow-xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portal</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-black/20 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#F9B826] animate-pulse" />
            <span>Civic2Campus Portal Access</span>
          </div>
        </div>

        {/* Master Animated Minimalist Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full"
        >
          <MinimalistAuthCard />
        </motion.div>

        {/* Footer info below card */}
        <div className="mt-5 text-center text-xs text-emerald-200/70 font-medium flex items-center gap-2">
          <span>Civic2Campus</span>
          <span>•</span>
          <span>State Civic Innovation Ecosystem</span>
          <span>•</span>
          <span>Government of Jharkhand</span>
        </div>

      </div>
    </div>
  );
};
