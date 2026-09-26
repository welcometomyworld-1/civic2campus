import React, { useState } from 'react';
import { CapsuleInputField } from './CapsuleInputField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { ProgressIndicator } from './ProgressIndicator';
import {
  ShieldCheck,
  Mail,
  Phone,
  Building,
  User,
  Briefcase,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface GovernmentRegistrationProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const GovernmentRegistration: React.FC<GovernmentRegistrationProps> = ({
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [step, setStep] = useState<2 | 3 | 4 | 5>(2);
  const [isSubmittedForVerification, setIsSubmittedForVerification] = useState(false);

  // Form State
  const [deptName, setDeptName] = useState('Department of Drinking Water & Sanitation (DWSD)');
  const [email, setEmail] = useState('dwsd.director@jharkhand.gov.in');
  const [personName, setPersonName] = useState('Sri Rajeshwar Prasad, IAS');
  const [designation, setDesignation] = useState('State Nodal Officer & Director (Jal Jeevan)');
  const [mobile, setMobile] = useState('+91 94311 88776');
  const [deptCategory, setDeptCategory] = useState('Drinking Water & Sanitation');
  const [city, setCity] = useState('Ranchi (State Secretariat)');
  const [state, setState] = useState('Jharkhand');

  const [password, setPassword] = useState('GovtPass@2026');
  const [confirmPassword, setConfirmPassword] = useState('GovtPass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Drinking Water & Sanitation',
    'Health, Medical Education & Family Welfare',
    'Energy & Renewable Power',
    'Road Construction & Transportation',
    'Agriculture, Animal Husbandry & Co-operative',
    'School Education & Literacy',
    'Urban Development & Housing',
    'District Collectorate / DC Administration',
    'Panchayati Raj & Rural Development',
  ];

  const validateEmail = (val: string) => {
    return val.includes('@') && val.includes('.');
  };

  const handleNext = () => {
    setError(null);
    if (step === 2) {
      if (!deptName.trim()) {
        setError('Please enter Department / Organization Name.');
        return;
      }
      if (!email.trim() || !validateEmail(email)) {
        setError('Please enter a valid official government email address.');
        return;
      }
      if (!personName.trim()) {
        setError('Please enter Authorized Person Name.');
        return;
      }
      if (!designation.trim()) {
        setError('Please enter Designation.');
        return;
      }
      if (!mobile.trim()) {
        setError('Please enter Mobile Number.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!deptCategory.trim()) {
        setError('Please select Department Category.');
        return;
      }
      if (!city.trim()) {
        setError('Please enter City / District HQ.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
      setStep(5);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must accept the Terms & Privacy Policy.');
      return;
    }
    // Show Pending Verification screen
    setIsSubmittedForVerification(true);
  };

  const handleSimulateAdminApproval = () => {
    onSubmit({
      role: 'government',
      deptName,
      email,
      personName,
      designation,
      mobile,
      deptCategory,
      city,
      state,
      password,
      status: 'APPROVED',
    });
  };

  if (isSubmittedForVerification) {
    return (
      <div className="w-full space-y-6 text-center animate-in zoom-in-95 p-6 sm:p-8 bg-amber-50/70 border border-amber-200/90 rounded-[32px]">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-8 h-8 animate-pulse text-amber-600" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
            <span>Status: Pending Verification</span>
          </div>
          <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Registration submitted for verification.
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
            Government administrative accounts require official credential validation by the State Innovation Directorate before activation.
          </p>
        </div>

        {/* Application Metadata Card */}
        <div className="p-4 bg-white rounded-2xl border border-amber-200 text-left text-xs space-y-2 text-stone-700 max-w-md mx-auto shadow-2xs">
          <div><span className="text-stone-400">Department:</span> <strong>{deptName}</strong></div>
          <div><span className="text-stone-400">Authorized Official:</span> <strong>{personName} ({designation})</strong></div>
          <div><span className="text-stone-400">Official Email:</span> <strong>{email}</strong></div>
          <div><span className="text-stone-400">Category:</span> <strong>{deptCategory}</strong></div>
          <div><span className="text-stone-400">Tracking Code:</span> <code className="font-mono text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded">GOV-JH-2026-AUTH</code></div>
        </div>

        {/* Demo Fast-Track Bypass Button */}
        <div className="pt-2 border-t border-amber-200/80 max-w-md mx-auto space-y-2">
          <button
            type="button"
            onClick={handleSimulateAdminApproval}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Simulate Admin Approval & Enter Command Center</span>
          </button>
          <div className="text-[11px] text-stone-500">
            For prototype testing, clicking above authorizes the account and opens the Government Dashboard.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={step} />

      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
          Government Department Registration
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {step === 2 && 'Step 2: Enter official government department and officer details.'}
          {step === 3 && 'Step 3: Select department category portfolio and jurisdiction HQ.'}
          {step === 4 && 'Step 4: Create administrative credentials.'}
          {step === 5 && 'Step 5: Review details and submit for official state verification.'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 2: DEPARTMENT DETAILS */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="gov-dept"
            label="Department / Organization Name"
            placeholder="e.g. Dept of Drinking Water & Sanitation"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            required
            icon={Building}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="gov-email"
              type="email"
              label="Official Government Email"
              placeholder="officer@jharkhand.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />
            <CapsuleInputField
              id="gov-person"
              label="Authorized Person Name"
              placeholder="e.g. Sri Rajeshwar Prasad, IAS"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
              icon={User}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="gov-designation"
              label="Designation"
              placeholder="e.g. State Nodal Officer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              icon={Briefcase}
            />
            <CapsuleInputField
              id="gov-phone"
              type="tel"
              label="Mobile Number"
              placeholder="+91 94311 88776"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              icon={Phone}
            />
          </div>
        </div>
      )}

      {/* STEP 3: CATEGORY & JURISDICTION */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700 pl-3">
              Department Category <span className="text-amber-500">*</span>
            </label>
            <select
              value={deptCategory}
              onChange={(e) => setDeptCategory(e.target.value)}
              className="w-full py-3.5 px-4 rounded-full bg-white border border-stone-200/80 text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="gov-city"
              label="City / Headquarters"
              placeholder="Ranchi (State Secretariat)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              icon={MapPin}
            />
            <CapsuleInputField
              id="gov-state"
              label="State"
              placeholder="Jharkhand"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {/* STEP 4: PASSWORD */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="gov-pwd"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <PasswordStrengthIndicator password={password} />

          <CapsuleInputField
            id="gov-pwd-confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            icon={Lock}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
          />
        </div>
      )}

      {/* STEP 5: REVIEW & VERIFICATION NOTICE */}
      {step === 5 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Review Government Registration Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 pt-1">
              <div><span className="text-stone-400">Department:</span> <strong>{deptName}</strong></div>
              <div><span className="text-stone-400">Authorized Official:</span> <strong>{personName}</strong></div>
              <div><span className="text-stone-400">Official Email:</span> <strong>{email}</strong></div>
              <div><span className="text-stone-400">Portfolio:</span> <strong>{deptCategory}</strong></div>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Notice:</strong> Government accounts do not activate immediately. Your registration will be set to <em>Pending Verification</em> until approved by the State Administration.
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-emerald-700 accent-emerald-700 mt-0.5 cursor-pointer"
            />
            <span className="text-xs text-stone-700 leading-relaxed">
              I agree to the <strong className="text-emerald-950 underline">Terms & Privacy Policy</strong> and confirm official departmental authorization.
            </span>
          </label>
        </form>
      )}

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (step === 2) onBack();
            else setStep((prev) => (prev - 1) as any);
          }}
          className="px-5 py-3 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isLoading || !agreeTerms}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'SUBMITTING...' : 'SUBMIT FOR VERIFICATION'}
            <ShieldCheck className="w-4 h-4 text-amber-300" />
          </button>
        )}
      </div>
    </div>
  );
};
