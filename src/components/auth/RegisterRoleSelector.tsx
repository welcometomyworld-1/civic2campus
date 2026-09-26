import React from 'react';
import { UserRole } from '../../types';
import { RoleCard } from './RoleCard';
import { ProgressIndicator } from './ProgressIndicator';
import { Users, GraduationCap, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface RegisterRoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNext: () => void;
  onBackToLogin: () => void;
}

export const RegisterRoleSelector: React.FC<RegisterRoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  onNext,
  onBackToLogin,
}) => {
  const roleCardsData: {
    id: UserRole;
    title: string;
    roleName: string;
    description: string;
    icon: any;
    badge: string;
    features: string[];
    gradientTheme: string;
  }[] = [
    {
      id: 'citizen',
      title: 'Citizen',
      roleName: 'Citizen',
      badge: 'Community Member',
      description: 'Report local infrastructure, water, sanitation, and health problems directly from your village, ward, or city.',
      icon: Users,
      features: ['Report issues with geo-tags & photos', 'Track problem resolution in real-time', 'Rate and verify completed projects'],
      gradientTheme: 'from-emerald-600 to-emerald-800',
    },
    {
      id: 'university',
      title: 'University / College',
      roleName: 'University',
      badge: 'Academic Institute',
      description: 'Connect students, researchers, and faculty engineering squads to solve real civic challenges for verified credits.',
      icon: GraduationCap,
      features: ['AI Semantic Project Matching Engine', 'Faculty & Student Squad Formation', 'Earn Academic Innovation Credits'],
      gradientTheme: 'from-amber-500 to-amber-700',
    },
    {
      id: 'industry',
      title: 'Industry & CSR',
      roleName: 'Industry',
      badge: 'Corporate Partner',
      description: 'Sponsor high-impact civic innovations, provide mentorship, technology toolkits, and direct CSR co-funding.',
      icon: Building2,
      features: ['Direct CSR Co-Funding Channel', 'Access Verified Tech Talent', 'Commercial Prototype Incubation'],
      gradientTheme: 'from-blue-600 to-blue-800',
    },
    {
      id: 'government',
      title: 'Government Department',
      roleName: 'Government',
      badge: 'Official Authority',
      description: 'State authorities, District Collectors, and BDOs monitoring live civic telemetry and deploying solutions.',
      icon: ShieldCheck,
      features: ['Statewide 3D Geospatial Command', 'Departmental Verification Workflow', 'Policy & Resource Allocation'],
      gradientTheme: 'from-emerald-800 to-stone-900',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={1} />

      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Step 1: Choose Your Role</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Join Civic2Campus
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Choose how you want to participate in Jharkhand's civic innovation ecosystem.
        </p>
      </div>

      {/* 4 Role Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roleCardsData.map((card) => (
          <RoleCard
            key={card.id}
            id={card.id}
            title={card.title}
            roleName={card.roleName}
            description={card.description}
            icon={card.icon}
            badge={card.badge}
            features={card.features}
            gradientTheme={card.gradientTheme}
            isSelected={selectedRole === card.id}
            onSelect={() => onSelectRole(card.id)}
            onContinue={onNext}
          />
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          Already have an account? <strong className="underline text-emerald-950">Sign In</strong>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Continue with {selectedRole.toUpperCase()}</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
