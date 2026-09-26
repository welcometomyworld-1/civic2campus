import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { LoginForm } from './LoginForm';
import { ForgotPassword } from './ForgotPassword';
import { RegisterRoleSelector } from './RegisterRoleSelector';
import { CitizenRegistration } from './CitizenRegistration';
import { UniversityRegistration } from './UniversityRegistration';
import { IndustryRegistration } from './IndustryRegistration';
import { GovernmentRegistration } from './GovernmentRegistration';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Lightbulb,
  Building,
  GraduationCap,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface MinimalistAuthCardProps {
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'forgot' | 'register-roles' | 'register-form';

export const MinimalistAuthCard: React.FC<MinimalistAuthCardProps> = ({ onSuccess }) => {
  const { userRole, setUserRole, setCurrentView, addNotification, login } = useApp();

  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationComplete = (data: any) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const role = (data.role || 'citizen') as UserRole;
      const displayName = data.fullName || data.organizationName || data.name || `${role.toUpperCase()} User`;
      const email = data.email || `${role}@civic2campus.org`;

      login(role, email, displayName);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#047857', '#F9B826', '#10B981', '#FBBF24'],
      });

      addNotification(
        'Account Created Successfully!',
        `Welcome to Civic2Campus. Registered as ${displayName} (${role.toUpperCase()}).`,
        'match'
      );

      // Redirect user to their role-specific dashboard
      if (role === 'university') setCurrentView('university-dashboard');
      else if (role === 'industry') setCurrentView('industry-dashboard');
      else if (role === 'government') setCurrentView('government-dashboard');
      else if (role === 'admin') setCurrentView('admin-dashboard');
      else setCurrentView('problems');

      if (onSuccess) onSuccess();
    }, 700);
  };

  return (
    <div className="relative w-full max-w-5xl rounded-[36px] sm:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden bg-white text-stone-900 border border-white/40 grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[640px] transition-all">
      
      {/* ========================================================
          LEFT COLUMN: CLEAN FORM AREA (LOGIN / REGISTER / FORGOT)
         ======================================================== */}
      <div className={`p-6 sm:p-10 md:p-12 flex flex-col justify-center relative z-20 bg-white ${
        mode === 'register-roles' || mode === 'register-form' ? 'lg:col-span-7' : 'lg:col-span-6'
      }`}>
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <LoginForm
                onSuccess={onSuccess}
                onNavigateToRegister={() => setMode('register-roles')}
                onNavigateToForgotPassword={() => setMode('forgot')}
              />
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ForgotPassword onBackToLogin={() => setMode('login')} />
            </motion.div>
          )}

          {mode === 'register-roles' && (
            <motion.div
              key="register-roles"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <RegisterRoleSelector
                selectedRole={selectedRole}
                onSelectRole={(r) => setSelectedRole(r)}
                onNext={() => setMode('register-form')}
                onBackToLogin={() => setMode('login')}
              />
            </motion.div>
          )}

          {mode === 'register-form' && (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {selectedRole === 'citizen' && (
                <CitizenRegistration
                  onBack={() => setMode('register-roles')}
                  onSubmit={handleRegistrationComplete}
                  isLoading={isLoading}
                />
              )}
              {selectedRole === 'university' && (
                <UniversityRegistration
                  onBack={() => setMode('register-roles')}
                  onSubmit={handleRegistrationComplete}
                  isLoading={isLoading}
                />
              )}
              {selectedRole === 'industry' && (
                <IndustryRegistration
                  onBack={() => setMode('register-roles')}
                  onSubmit={handleRegistrationComplete}
                  isLoading={isLoading}
                />
              )}
              {selectedRole === 'government' && (
                <GovernmentRegistration
                  onBack={() => setMode('register-roles')}
                  onSubmit={handleRegistrationComplete}
                  isLoading={isLoading}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================
          RIGHT COLUMN: ORGANIC WAVY BANNER WITH CIVIC STATS & VISUALS
         ======================================================== */}
      <div
        className={`relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white bg-gradient-to-br from-[#064e3b] via-[#013b2e] to-[#01241c] ${
          mode === 'register-roles' || mode === 'register-form' ? 'lg:col-span-5' : 'lg:col-span-6'
        }`}
      >
        {/* Organic Curved Cloud Divider Graphic */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            className="absolute -top-1 -left-1 w-[110%] h-[110%] opacity-20"
            viewBox="0 0 500 500"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 200,20 350,120 C450,190 500,100 500,0 L500,500 L0,500 Z"
              fill="#10B981"
            />
          </svg>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        {/* Top Header Badge inside right side */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-amber-300 text-sm shadow-xs">
              C
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-200">
              Civic<span className="text-amber-400 italic">2</span>Campus
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-amber-300 backdrop-blur-md">
            Jharkhand 2026
          </div>
        </div>

        {/* Middle Visual Section */}
        <div className="relative z-10 my-auto py-6 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome Back!' : 'Empowering Real Solutions.'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
              {mode === 'login'
                ? 'Empowering citizens, students, industry sponsors, and government departments to collaborate on verified civic challenges across Jharkhand.'
                : 'Join a statewide ecosystem transforming local problems into funded university prototypes and accredited civic impact.'}
            </p>
          </motion.div>

          {/* Dynamic Stat Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>94.8% AI Match</span>
              </div>
              <p className="text-[11px] text-emerald-100/70">Verified Semantic Pairing</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>24 Districts</span>
              </div>
              <p className="text-[11px] text-emerald-100/70">Statewide Deployment</p>
            </div>
          </div>
        </div>

        {/* Bottom Tagline & Link */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70">
          <span>AI-Powered Civic Innovation</span>
          <span className="font-semibold text-white/90">Govt of Jharkhand</span>
        </div>
      </div>

    </div>
  );
};
