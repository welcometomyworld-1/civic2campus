import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { CapsuleInputField } from './CapsuleInputField';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
  Users,
  GraduationCap,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginFormProps {
  onSuccess?: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}) => {
  const { setCurrentView, addNotification, login, pendingReportIntent } = useApp();

  const [usernameOrEmail, setUsernameOrEmail] = useState('innovator@jharkhand.ac.in');
  const [password, setPassword] = useState('secret123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fast 1-Click Demo Stakeholder Presets
  const presets: { role: UserRole; label: string; icon: any; email: string; name: string }[] = [
    { role: 'citizen', label: 'Citizen', icon: Users, email: 'citizen@civic2campus.org', name: 'Rohan Verma (Citizen)' },
    { role: 'university', label: 'University', icon: GraduationCap, email: 'univ@bitmesra.ac.in', name: 'Prof. Arvind Sharma (BIT Mesra)' },
    { role: 'industry', label: 'Industry', icon: Building2, email: 'csr@tatasteel.com', name: 'Tata Steel CSR Foundation' },
    { role: 'government', label: 'Government', icon: ShieldCheck, email: 'jharkhand.urban@gov.in', name: 'Dr. S. K. Murmu (Urban Dev)' },
    { role: 'admin', label: 'Admin', icon: ShieldCheck, email: 'admin@civic2campus.org', name: 'Super Admin (State Control)' },
  ];

  const handleApplyPreset = (preset: { role: UserRole; email: string; name: string }) => {
    setUsernameOrEmail(preset.email);
    setPassword('secret123');
    setErrorMessage(null);
    executeLogin(preset.role, preset.email, preset.name);
  };

  const executeLogin = (role: UserRole, email: string, displayName?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const label = displayName || email.split('@')[0];
      login(role, email, label);

      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#F9B826', '#10B981', '#047857', '#FBBF24'],
      });

      addNotification(
        'Authentication Successful',
        `Logged in as ${label} (${role.toUpperCase()}). Welcome to your dedicated portal.`,
        'match'
      );

      // Dedicated Role Routing
      if (!pendingReportIntent) {
        if (role === 'university') setCurrentView('university-dashboard');
        else if (role === 'industry') setCurrentView('industry-dashboard');
        else if (role === 'government') setCurrentView('government-dashboard');
        else if (role === 'admin') setCurrentView('admin-dashboard');
        else setCurrentView('problems');
      }

      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = usernameOrEmail.trim();
    if (!emailTrimmed) {
      setErrorMessage('Please enter your email or username.');
      return;
    }

    if (emailTrimmed.includes('@') && (!emailTrimmed.includes('.') || emailTrimmed.length < 5)) {
      setErrorMessage('Please enter a valid email.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMessage('Incorrect email or password.');
      return;
    }

    let detectedRole: UserRole = 'citizen';
    if (emailTrimmed.includes('admin') || emailTrimmed.includes('superadmin')) detectedRole = 'admin';
    else if (emailTrimmed.includes('univ') || emailTrimmed.includes('bitmesra') || emailTrimmed.includes('edu') || emailTrimmed.includes('ac.in') || emailTrimmed.includes('iitism')) detectedRole = 'university';
    else if (emailTrimmed.includes('csr') || emailTrimmed.includes('tata') || emailTrimmed.includes('industry') || emailTrimmed.includes('corp') || emailTrimmed.includes('company')) detectedRole = 'industry';
    else if (emailTrimmed.includes('gov') || emailTrimmed.includes('urban') || emailTrimmed.includes('state') || emailTrimmed.includes('director')) detectedRole = 'government';

    executeLogin(detectedRole, emailTrimmed);
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in">
      {/* Title & Subtitle matching mockup */}
      <div className="text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Hello!
        </h2>
        <p className="text-sm sm:text-base text-stone-500 mt-1 font-medium">
          Sign in to your account
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Login Form with Capsule Inputs */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Email / Username Capsule Input */}
        <CapsuleInputField
          id="login-email-input"
          type="text"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder="E-mail / Username"
          required
          icon={Mail}
          iconBgGradient="from-emerald-700 via-emerald-800 to-emerald-950"
          autoComplete="username"
        />

        {/* Password Capsule Input with Eye Toggle */}
        <CapsuleInputField
          id="login-password-input"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          icon={Lock}
          iconBgGradient="from-emerald-700 via-emerald-800 to-emerald-950"
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-stone-400 hover:text-emerald-900 transition-colors p-1.5 cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          }
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between px-2 pt-1 text-xs font-semibold">
          <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none hover:text-stone-900 transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-emerald-700 accent-emerald-700 cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={onNavigateToForgotPassword}
            className="text-stone-500 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* SIGN IN Pill Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 hover:from-emerald-900 hover:via-emerald-800 hover:to-emerald-950 text-white font-extrabold text-sm sm:text-base uppercase tracking-widest shadow-lg shadow-emerald-950/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            id="login-btn-submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <span>SIGN IN</span>
            )}
          </button>
        </div>

        {/* Don't have an account? Create link */}
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
              id="goto-create-account-btn"
            >
              Create
            </button>
          </p>
        </div>
      </form>

      {/* 1-Click Fast Stakeholder Demo Switchers */}
      <div className="pt-4 border-t border-stone-100">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 text-center mb-2">
          1-Click Demo Profiles (Instant Access):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.role}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-2 rounded-2xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200/80 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-700 hover:text-emerald-950 group shadow-2xs"
                title={`Instant login as ${preset.name}`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
