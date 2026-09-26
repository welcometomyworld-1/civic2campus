import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemEditorialSection } from '../components/landing/ProblemEditorialSection';
import { BigIdeaNetworkSection } from '../components/landing/BigIdeaNetworkSection';
import { HowItWorksJourney } from '../components/landing/HowItWorksJourney';
import { AIIntelligenceShowcase } from '../components/landing/AIIntelligenceShowcase';
import { AIMatchingEngineShowcase } from '../components/landing/AIMatchingEngineShowcase';
import { MapHighlightSection } from '../components/landing/MapHighlightSection';
import { AIOpportunitiesSection } from '../components/landing/AIOpportunitiesSection';
import { UniversityExperienceSection } from '../components/landing/UniversityExperienceSection';
import { UniversityRankingSection } from '../components/landing/UniversityRankingSection';
import { IndustryExperienceSection } from '../components/landing/IndustryExperienceSection';
import { ProjectJourneySection } from '../components/landing/ProjectJourneySection';
import { GovernmentCommandPreviewSection } from '../components/landing/GovernmentCommandPreviewSection';
import { ImpactSection } from '../components/landing/ImpactSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';

export const LandingPage: React.FC = () => {
  const { isLoggedIn, currentUser } = useApp();

  return (
    <div className="w-full flex flex-col bg-[#F9F8F6]">
      {/* Section 01: Hero with 3D Map, Floating Statistics & Narrative */}
      <HeroSection />

      {/* Section 02: The Problem (Editorial Reality) */}
      <ProblemEditorialSection />

      {/* Section 03: The Big Idea (One Problem, Many People) */}
      <BigIdeaNetworkSection />

      {/* Section 04: How Civic2Campus Works (6-Stage Horizontal Journey) */}
      <HowItWorksJourney />

      {/* Section 05: AI Intelligence (Semantic Parsing & Extraction) */}
      <AIIntelligenceShowcase />

      {/* Section 06: The AI Matching Engine (Vector Synergy) */}
      <AIMatchingEngineShowcase />

      {/* Section 07: 3D Innovation Map (Real-Time Hotspots) */}
      <MapHighlightSection />

      {/* Section 08: AI Innovation Opportunities (Clustered Interventions) */}
      <AIOpportunitiesSection />

      {/* Section 09: Statewide Higher Education Innovation & Social Impact Rankings */}
      <UniversityRankingSection />

      {/* Section 10: University Experience (Research Opportunities) */}
      <UniversityExperienceSection />

      {/* Section 11: Industry Experience (Turn Expertise Into Impact) */}
      <IndustryExperienceSection />

      {/* Section 11: Project Journey (Lifecycle from Problem to Impact) */}
      <ProjectJourneySection />

      {/* Section 12: Government Command Center (Statewide Telemetry - Only visible to authenticated Government/Admin personnel) */}
      {isLoggedIn && (currentUser?.role === 'government' || currentUser?.role === 'admin') && (
        <GovernmentCommandPreviewSection />
      )}

      {/* Section 13: Measurable Impact (Community Voices & Real Data) */}
      <ImpactSection />

      {/* Section 14: Final Call to Action & Minimal Footer */}
      <FinalCTASection />
    </div>
  );
};
