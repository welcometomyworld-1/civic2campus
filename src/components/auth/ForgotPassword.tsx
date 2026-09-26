import React, { useState } from 'react';
import { CapsuleInputField } from './CapsuleInputField';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, Sparkles } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('innovator@jharkhand.ac.in');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    return val.includes('@') && val.includes('.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in">
      <button
        type="button"
        onClick={onBackToLogin}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Sign In</span>
      </button>

      <div>
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 shadow-xs">
          <KeyRound className="w-6 h-6 text-amber-700" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Forgot Password
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Enter your registered email address and we'll send you a password recovery link.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-6 rounded-[28px] bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-base">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>Password Reset Sent</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            If an account exists with this email, a password reset link will be sent.
          </p>
          <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-xs text-stone-600 font-mono">
            Demo Token: <span className="text-emerald-800 font-bold">C2C-RESET-9823-SECURE</span>
          </div>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-emerald-900/15"
          >
            Return to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <CapsuleInputField
            id="forgot-email"
            type="email"
            label="Registered Email Address"
            placeholder="name@organization.jharkhand.gov.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>SENDING RESET LINK...</span>
              </>
            ) : (
              <>
                <span>SEND RESET LINK</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
