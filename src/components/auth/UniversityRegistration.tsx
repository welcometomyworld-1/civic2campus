import React, { useState } from 'react';
import { CapsuleInputField } from './CapsuleInputField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { ProgressIndicator } from './ProgressIndicator';
import {
  GraduationCap,
  Mail,
  Phone,
  User,
  Building,
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
} from 'lucide-react';

interface UniversityRegistrationProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const UniversityRegistration: React.FC<UniversityRegistrationProps> = ({
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [step, setStep] = useState<2 | 3 | 4 | 5>(2);

  // Form State
  const [uniName, setUniName] = useState('Birla Institute of Technology, Mesra');
  const [email, setEmail] = useState('innovator@bitmesra.ac.in');
  const [contactPerson, setContactPerson] = useState('Dr. Rajiv Ranjan');
  const [mobile, setMobile] = useState('+91 94311 23456');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');
  const [uniType, setUniType] = useState('CFTI / Deemed University');
  const [city, setCity] = useState('Ranchi');
  const [state, setState] = useState('Jharkhand');
  const [website, setWebsite] = useState('https://www.bitmesra.ac.in');
  const [logo, setLogo] = useState<string | null>(null);

  // Multi-select Domains
  const availableDomains = [
    'AI / ML',
    'Data Science',
    'Civil Engineering',
    'Agriculture',
    'Healthcare',
    'Environment',
    'Education',
    'IoT',
    'Robotics',
    'Software Development',
    'Other',
  ];
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    'AI / ML',
    'IoT',
    'Environment',
    'Software Development',
  ]);

  const [password, setPassword] = useState('UnivPass@2026');
  const [confirmPassword, setConfirmPassword] = useState('UnivPass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
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
      if (!uniName.trim()) {
        setError('Please enter the University Name.');
        return;
      }
      if (!email.trim() || !validateEmail(email)) {
        setError('Please enter a valid official university email.');
        return;
      }
      if (!contactPerson.trim()) {
        setError('Please enter the Contact Person name.');
        return;
      }
      if (!mobile.trim()) {
        setError('Please enter a contact mobile number.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (selectedDomains.length === 0) {
        setError('Please select at least one Expertise / Domain.');
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
      role: 'university',
      uniName,
      email,
      contactPerson,
      mobile,
      department,
      uniType,
      city,
      state,
      website,
      domains: selectedDomains,
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
          University Registration
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {step === 2 && 'Step 2: Enter institutional and nodal officer details.'}
          {step === 3 && 'Step 3: Select faculty research domains and university seal.'}
          {step === 4 && 'Step 4: Create secure credentials for the university portal.'}
          {step === 5 && 'Step 5: Review information and submit university registration.'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 2: INSTITUTIONAL DETAILS */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <CapsuleInputField
            id="uni-name"
            label="University / College Name"
            placeholder="e.g. BIT Mesra / IIT ISM Dhanbad"
            value={uniName}
            onChange={(e) => setUniName(e.target.value)}
            required
            icon={GraduationCap}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="uni-email"
              type="email"
              label="Official University Email"
              placeholder="lead@university.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />
            <CapsuleInputField
              id="uni-person"
              label="Contact Person Name"
              placeholder="e.g. Dr. Rajiv Ranjan"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
              icon={User}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapsuleInputField
              id="uni-phone"
              type="tel"
              label="Mobile Number"
              placeholder="+91 94311 23456"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              icon={Phone}
            />
            <CapsuleInputField
              id="uni-dept"
              label="Department"
              placeholder="e.g. Dept of Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              icon={Building}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700 pl-3">University Type</label>
              <select
                value={uniType}
                onChange={(e) => setUniType(e.target.value)}
                className="w-full py-3.5 px-4 rounded-full bg-white border border-stone-200/80 text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
              >
                <option value="Central University">Central University</option>
                <option value="State University">State University</option>
                <option value="CFTI / Deemed University">CFTI / Deemed University</option>
                <option value="Private University">Private University</option>
                <option value="Autonomous Engineering College">Autonomous College</option>
              </select>
            </div>
            <CapsuleInputField
              id="uni-city"
              label="City"
              placeholder="Ranchi"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <CapsuleInputField
              id="uni-state"
              label="State"
              placeholder="Jharkhand"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          <CapsuleInputField
            id="uni-website"
            type="url"
            label="Website"
            placeholder="https://www.bitmesra.ac.in"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            icon={Globe}
          />
        </div>
      )}

      {/* STEP 3: EXPERTISE / DOMAINS & LOGO */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1 pl-1">
              Select Expertise / Domains (Multiple selection allowed) <span className="text-amber-500">*</span>
            </label>
            <p className="text-[11px] text-stone-500 mb-3 pl-1">
              Our AI Civic Matcher will recommend Panchayat and State challenges aligned with these tags.
            </p>
            <div className="flex flex-wrap gap-2">
              {availableDomains.map((domain) => {
                const isSelected = selectedDomains.includes(domain);
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => toggleDomain(domain)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-400 text-emerald-950 shadow-sm ring-2 ring-amber-400/50'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{domain}</span>
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-60" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* University Logo (Optional) */}
          <div className="p-4 bg-stone-50/80 rounded-3xl border border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center overflow-hidden shrink-0">
                {logo ? (
                  <img src={logo} alt="Logo preview" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-amber-800" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">University Logo / Seal (Optional)</div>
                <div className="text-[11px] text-stone-500">Displayed on student team proposals and certificates</div>
              </div>
            </div>
            <label className="px-4 py-2 bg-white border border-amber-500 text-amber-900 hover:bg-amber-50 rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs">
              <Camera className="w-3.5 h-3.5 inline mr-1 text-amber-700" />
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
            id="uni-pwd"
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
            id="uni-pwd-confirm"
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
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Review University Registration</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 pt-1">
              <div><span className="text-stone-400">Institution:</span> <strong>{uniName}</strong></div>
              <div><span className="text-stone-400">Faculty Lead:</span> <strong>{contactPerson}</strong></div>
              <div><span className="text-stone-400">Official Email:</span> <strong>{email}</strong></div>
              <div><span className="text-stone-400">Domains:</span> <strong>{selectedDomains.join(', ')}</strong></div>
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
              I agree to the <strong className="text-emerald-950 underline">Terms & Privacy Policy</strong> and academic accreditation charter.
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
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'REGISTERING...' : 'REGISTER UNIVERSITY'}
            <Check className="w-4 h-4 text-emerald-950" />
          </button>
        )}
      </div>
    </div>
  );
};
