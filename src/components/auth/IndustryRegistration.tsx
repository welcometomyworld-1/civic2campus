import React, { useState } from 'react';
import { CapsuleInputField } from './CapsuleInputField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { ProgressIndicator } from './ProgressIndicator';
import {
  Building2,
  Mail,
  Phone,
  User,
  Briefcase,
  Globe,
  MapPin,
  Camera,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
  ShieldCheck,
  Coins,
} from 'lucide-react';

interface IndustryRegistrationProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const IndustryRegistration: React.FC<IndustryRegistrationProps> = ({
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [step, setStep] = useState<2 | 3 | 4 | 5>(2);

  // Form State
  const [companyName, setCompanyName] = useState('Tata Steel CSR Foundation');
  const [email, setEmail] = useState('csr.initiatives@tatasteel.com');
  const [contactPerson, setContactPerson] = useState('Sunil Verma');
  const [designation, setDesignation] = useState('Head of CSR & Rural Innovation');
  const [mobile, setMobile] = useState('+91 98351 98765');
  const [industryType, setIndustryType] = useState('Manufacturing & Clean Infrastructure');
  const [location, setLocation] = useState('Tata Steel Jamshedpur Works');
  const [city, setCity] = useState('Jamshedpur');
  const [state, setState] = useState('Jharkhand');
  const [website, setWebsite] = useState('https://www.tatasteel.com');
  const [logo, setLogo] = useState<string | null>(null);

  // Multi-select Company Expertise
  const availableExpertise = [
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Agriculture',
    'Infrastructure',
    'Finance',
    'Education',
    'Energy',
    'Environment',
    'Software',
    'Other',
  ];
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([
    'Infrastructure',
    'Environment',
    'Manufacturing',
    'Technology',
  ]);

  // Multi-select Support Available
  const availableSupport = [
    'Technology Support',
    'Mentorship',
    'Funding',
    'R&D',
    'CSR',
    'Infrastructure',
    'Training',
  ];
  const [selectedSupport, setSelectedSupport] = useState<string[]>([
    'Funding',
    'CSR',
    'Mentorship',
    'Technology Support',
  ]);

  const [password, setPassword] = useState('IndustryPass@2026');
  const [confirmPassword, setConfirmPassword] = useState('IndustryPass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleExpertise = (item: string) => {
    if (selectedExpertise.includes(item)) {
      setSelectedExpertise(selectedExpertise.filter((i) => i !== item));
    } else {
      setSelectedExpertise([...selectedExpertise, item]);
    }
  };

  const toggleSupport = (item: string) => {
    if (selectedSupport.includes(item)) {
      setSelectedSupport(selectedSupport.filter((i) => i !== item));
    } else {
      setSelectedSupport([...selectedSupport, item]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (val: string) => {
    return val.includes('@') && val.includes('.');
  };

  const handleNext = () => {
    setError(null);
    if (step === 2) {
      if (!companyName.trim()) {
        setError('Please enter the Company Name.');
        return;
      }
      if (!email.trim() || !validateEmail(email)) {
        setError('Please enter a valid official company email.');
        return;
      }
      if (!contactPerson.trim()) {
        setError('Please enter the Contact Person name.');
        return;
      }
      if (!designation.trim()) {
        setError('Please enter the Designation.');
        return;
      }
      if (!mobile.trim()) {
        setError('Please enter a mobile number.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (selectedSupport.length === 0) {
        setError('Please select at least one Support Available offering.');
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
      role: 'industry',
      companyName,
      email,
      contactPerson,
      designation,
      mobile,
      industryType,
      location,
      city,
      state,
      website,
      expertise: selectedExpertise,
      support: selectedSupport,
      logo,
      password,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={step} />

      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
          Industry Registration
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {step === 2 && 'Step 2: Enter corporate enterprise details.'}
          {step === 3 && 'Step 3: Select company expertise and CSR support offerings.'}
          {step === 4 && 'Step 4: Create secure password for industry access.'}
          {step === 5 && 'Step 5: Review details and register industry partner.'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 2: CORPORATE DETAILS */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="ind-name"
            label="Company Name"
            placeholder="e.g. Tata Steel / Jindal Power"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            icon={Building2}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="ind-email"
              type="email"
              label="Official Company Email"
              placeholder="csr.lead@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />
            <CapsuleInputField
              id="ind-person"
              label="Contact Person"
              placeholder="e.g. Sunil Verma"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
              icon={User}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="ind-designation"
              label="Designation"
              placeholder="e.g. Head of CSR & Innovation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              icon={Briefcase}
            />
            <CapsuleInputField
              id="ind-phone"
              type="tel"
              label="Mobile Number"
              placeholder="+91 98351 98765"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              icon={Phone}
            />
          </div>

          <CapsuleInputField
            id="ind-type"
            label="Industry Type"
            placeholder="e.g. Manufacturing & Clean Infrastructure"
            value={industryType}
            onChange={(e) => setIndustryType(e.target.value)}
            required
          />

          <CapsuleInputField
            id="ind-loc"
            label="Company Location"
            placeholder="e.g. Jamshedpur Industrial Zone"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            icon={MapPin}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CapsuleInputField
              id="ind-city"
              label="City"
              placeholder="Jamshedpur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <CapsuleInputField
              id="ind-state"
              label="State"
              placeholder="Jharkhand"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <CapsuleInputField
              id="ind-website"
              type="url"
              label="Company Website"
              placeholder="https://..."
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              icon={Globe}
            />
          </div>
        </div>
      )}

      {/* STEP 3: EXPERTISE, SUPPORT & LOGO */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in">
          {/* Support Available */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1 pl-1">
              Support Available for Student Innovation Squads (Select multiple) <span className="text-amber-500">*</span>
            </label>
            <p className="text-[11px] text-stone-500 mb-2 pl-1">
              What resources or backing can your enterprise provide to civic prototypes?
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSupport.map((support) => {
                const isSelected = selectedSupport.includes(support);
                return (
                  <button
                    key={support}
                    type="button"
                    onClick={() => toggleSupport(support)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/50'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{support}</span>
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-60" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company Expertise */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1 pl-1">
              Company Expertise Domains
            </label>
            <div className="flex flex-wrap gap-2">
              {availableExpertise.map((exp) => {
                const isSelected = selectedExpertise.includes(exp);
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => toggleExpertise(exp)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {exp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company Logo (Optional) */}
          <div className="p-4 bg-stone-50/80 rounded-3xl border border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center overflow-hidden shrink-0">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6 text-blue-800" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Company Logo (Optional)</div>
                <div className="text-[11px] text-stone-500">Displayed on sponsored projects & CSR dashboard</div>
              </div>
            </div>
            <label className="px-4 py-2 bg-white border border-blue-600 text-blue-800 hover:bg-blue-50 rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs">
              <Camera className="w-3.5 h-3.5 inline mr-1 text-blue-700" />
              <span>{logo ? 'Change Logo' : 'Upload Logo'}</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* STEP 4: PASSWORD */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="ind-pwd"
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
            id="ind-pwd-confirm"
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
          <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200/80 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Review Industry Registration</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 pt-1">
              <div><span className="text-stone-400">Company:</span> <strong>{companyName}</strong></div>
              <div><span className="text-stone-400">Representative:</span> <strong>{contactPerson} ({designation})</strong></div>
              <div><span className="text-stone-400">Email:</span> <strong>{email}</strong></div>
              <div><span className="text-stone-400">Support Offered:</span> <strong>{selectedSupport.join(', ')}</strong></div>
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
              I agree to the <strong className="text-emerald-950 underline">Terms & Privacy Policy</strong> and CSR co-funding partnership agreement.
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
            onClick={handleSubmit}
            disabled={isLoading || !agreeTerms}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'REGISTERING...' : 'REGISTER INDUSTRY'}
            <Check className="w-4 h-4 text-amber-300" />
          </button>
        )}
      </div>
    </div>
  );
};
