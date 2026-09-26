import React, { useState } from 'react';
import { CapsuleInputField } from './CapsuleInputField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { ProgressIndicator } from './ProgressIndicator';
import { User, Mail, Phone, MapPin, Camera, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, AlertCircle, ShieldCheck } from 'lucide-react';

interface CitizenRegistrationProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const CitizenRegistration: React.FC<CitizenRegistrationProps> = ({
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [step, setStep] = useState<2 | 3 | 4 | 5>(2);

  // Form State
  const [name, setName] = useState('Ananya Soren');
  const [email, setEmail] = useState('ananya.soren@gmail.com');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Murhu Panchayat, Block Murhu');
  const [city, setCity] = useState('Khunti');
  const [state, setState] = useState('Jharkhand');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [password, setPassword] = useState('SecurePass@2026');
  const [confirmPassword, setConfirmPassword] = useState('SecurePass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (val: string) => {
    return val.includes('@') && val.includes('.');
  };

  const handleNext = () => {
    setError(null);
    if (step === 2) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!mobile.trim()) {
        setError('Please enter your mobile contact number.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!location.trim()) {
        setError('Please enter your village, panchayat, or ward.');
        return;
      }
      if (!city.trim()) {
        setError('Please enter your city/district.');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must accept the Terms & Privacy Policy.');
      return;
    }
    onSubmit({
      role: 'citizen',
      name,
      email,
      mobile,
      location,
      city,
      state,
      profilePhoto,
      password,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* 5-step Progress Indicator */}
      <ProgressIndicator currentStep={step} />

      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
          Citizen Registration
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {step === 2 && 'Step 2: Enter your personal contact information.'}
          {step === 3 && 'Step 3: Provide your residential location in Jharkhand.'}
          {step === 4 && 'Step 4: Create a secure password for your citizen account.'}
          {step === 5 && 'Step 5: Review details and accept terms to complete registration.'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 2: PERSONAL DETAILS */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="citizen-fullname"
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={User}
          />

          <CapsuleInputField
            id="citizen-email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />

          <CapsuleInputField
            id="citizen-phone"
            type="tel"
            label="Mobile Number"
            placeholder="+91 98765 43210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            icon={Phone}
          />
        </div>
      )}

      {/* STEP 3: LOCATION & OPTIONAL PHOTO */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="citizen-location"
            label="Village / Panchayat / Ward / Area"
            placeholder="e.g. Murhu Panchayat, Block Murhu"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            icon={MapPin}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="citizen-city"
              label="City / District"
              placeholder="e.g. Khunti / Ranchi"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <CapsuleInputField
              id="citizen-state"
              label="State"
              placeholder="Jharkhand"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          {/* Profile Photo (Optional) */}
          <div className="p-4 bg-stone-50/80 rounded-3xl border border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center overflow-hidden shrink-0">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-emerald-700" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Profile Photo (Optional)</div>
                <div className="text-[11px] text-stone-500">Attach photo for verified citizen badge</div>
              </div>
            </div>
            <label className="px-4 py-2 bg-white border border-emerald-600 text-emerald-800 hover:bg-emerald-50 rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs">
              <Camera className="w-3.5 h-3.5 inline mr-1 text-emerald-700" />
              <span>{profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* STEP 4: PASSWORD & SECURITY */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="citizen-pwd"
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
            id="citizen-pwd-confirm"
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

      {/* STEP 5: REVIEW & SUBMIT */}
      {step === 5 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          {/* Summary Box */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Review Citizen Registration Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 pt-1">
              <div><span className="text-stone-400">Full Name:</span> <strong>{name}</strong></div>
              <div><span className="text-stone-400">Mobile:</span> <strong>{mobile}</strong></div>
              <div><span className="text-stone-400">Email:</span> <strong>{email}</strong></div>
              <div><span className="text-stone-400">Location:</span> <strong>{location}, {city}, {state}</strong></div>
            </div>
          </div>

          {/* Terms & Privacy Policy Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-emerald-700 accent-emerald-700 mt-0.5 cursor-pointer"
            />
            <span className="text-xs text-stone-700 leading-relaxed">
              I agree to the <strong className="text-emerald-950 underline">Terms & Privacy Policy</strong> of Civic2Campus Jharkhand.
            </span>
          </label>
        </form>
      )}

      {/* Action Navigation Buttons */}
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
            onClick={handleSubmit}
            disabled={isLoading || !agreeTerms}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE CITIZEN ACCOUNT'}
            <Check className="w-4 h-4 text-amber-400" />
          </button>
        )}
      </div>
    </div>
  );
};
