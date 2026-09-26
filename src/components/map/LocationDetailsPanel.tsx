import React, { useState } from 'react';
import {
  X,
  MapPin,
  AlertTriangle,
  GraduationCap,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Users,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  HeartHandshake,
  Wrench,
  TrendingUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  MapItem,
  MapProblemItem,
  MapUniversityItem,
  MapIndustryItem,
  MapSolutionItem,
} from '../../data/mapData';
import { AIMatchPanel } from './AIMatchPanel';

interface LocationDetailsPanelProps {
  item: MapItem | null;
  onClose: () => void;
  onOpenAIAnalysis: (problem: MapProblemItem) => void;
  onNavigateToProblemView?: (problemId: string) => void;
  onNavigateToMatchCenter?: (problemId: string) => void;
  onNavigateToWorkspace?: (projectId?: string) => void;
  onSelectRelatedItem?: (itemId: string) => void;
}

export const LocationDetailsPanel: React.FC<LocationDetailsPanelProps> = ({
  item,
  onClose,
  onOpenAIAnalysis,
  onNavigateToProblemView,
  onNavigateToMatchCenter,
  onNavigateToWorkspace,
  onSelectRelatedItem,
}) => {
  const [showMatchPanel, setShowMatchPanel] = useState(true);

  if (!item) return null;

  const renderProblemDetails = (p: MapProblemItem) => {
    const priorityColor =
      p.priority === 'CRITICAL'
        ? 'bg-rose-100 text-rose-700 border-rose-300'
        : p.priority === 'HIGH'
        ? 'bg-amber-100 text-amber-800 border-amber-300'
        : 'bg-emerald-100 text-emerald-800 border-emerald-300';

    return (
      <div className="space-y-4">
        
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${priorityColor}`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>{p.priority} Priority ({p.priorityScore}/100)</span>
          </span>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            {p.domain}
          </span>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            {p.status}
          </span>
        </div>

        {/* Affected population stats */}
        <div className="grid grid-cols-2 gap-2.5 bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Affected Population
            </div>
            <div className="text-lg font-extrabold text-stone-900 mt-0.5 flex items-center gap-1">
              <Users className="w-4 h-4 text-stone-500" />
              <span>{p.affectedPopulation.toLocaleString()} citizens</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Reported By
            </div>
            <div className="text-xs font-semibold text-stone-800 mt-1 truncate">
              {p.reporter}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Problem Description
          </h4>
          <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
            {p.description}
          </p>
        </div>

        {/* AI Classification Summary */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Classification & Diagnostic Matrix</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-white/80 px-2 py-0.5 rounded-full border border-blue-200">
              {p.aiClassification.confidence}% Confidence
            </span>
          </div>

          <p className="text-xs text-stone-700 italic">
            "{p.aiClassification.reasoning}"
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="flex items-center justify-between bg-white/70 px-2.5 py-1 rounded-lg border border-blue-100">
              <span className="text-stone-600">Urgency:</span>
              <span className="font-bold text-rose-600">{p.aiClassification.urgency}/100</span>
            </div>
            <div className="flex items-center justify-between bg-white/70 px-2.5 py-1 rounded-lg border border-blue-100">
              <span className="text-stone-600">Health Impact:</span>
              <span className="font-bold text-amber-600">{p.aiClassification.healthImpact}/100</span>
            </div>
          </div>
        </div>

        {/* Action Buttons as requested: View Problem, AI Analysis, Find Match */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={() => onNavigateToProblemView?.(p.id)}
            className="px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold text-center transition-all cursor-pointer shadow-xs"
          >
            View Problem
          </button>

          <button
            onClick={() => onOpenAIAnalysis(p)}
            className="px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Analysis</span>
          </button>

          <button
            onClick={() => onNavigateToMatchCenter?.(p.id)}
            className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center transition-all cursor-pointer shadow-xs"
          >
            Find Match
          </button>
        </div>

        {/* AI Recommended Matches Panel */}
        <AIMatchPanel
          problem={p}
          onViewUniversityMatch={(uniId) => onSelectRelatedItem?.(uniId)}
          onViewIndustryMatch={(indId) => onSelectRelatedItem?.(indId)}
          onStartCollaboration={() => onNavigateToWorkspace?.()}
        />

      </div>
    );
  };

  const renderUniversityDetails = (u: MapUniversityItem) => {
    return (
      <div className="space-y-4">
        
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
            {u.code}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            Est. {u.established}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            {u.ranking}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Active Civic Projects
            </div>
            <div className="text-xl font-extrabold text-indigo-950 mt-0.5">
              {u.activeProjects} Deployments
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Faculty & Students
            </div>
            <div className="text-xl font-extrabold text-indigo-950 mt-0.5">
              {u.facultyCount} / {u.studentsCount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Overview & Mandate
          </h4>
          <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
            {u.description}
          </p>
        </div>

        {/* Expertise Tags */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Core Expertise & Research
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {u.expertise.map((exp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Labs */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Specialized Lab Facilities
          </h4>
          <div className="space-y-1.5 text-xs text-stone-700">
            {u.labFacilities.map((lab, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span>{lab}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: View University */}
        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={() => onNavigateToMatchCenter?.(u.id)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>View University Profile & R&D Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    );
  };

  const renderIndustryDetails = (ind: MapIndustryItem) => {
    return (
      <div className="space-y-4">
        
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
            {ind.companyType}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            CSR Budget: {ind.csrFundingAnnual}
          </span>
        </div>

        {/* Support Available Callout */}
        <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800 mb-1 flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
            <span>Support Available For Students & Universities</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 font-semibold">
            {ind.supportAvailable}
          </p>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Company Overview
          </h4>
          <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
            {ind.description}
          </p>
        </div>

        {/* Technologies & Focus */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Focus Areas & Technologies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {ind.technologies.concat(ind.focusAreas).map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: View Company & Collaborate */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={() => onNavigateToMatchCenter?.(ind.id)}
            className="py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold text-center transition-all cursor-pointer shadow-xs"
          >
            View Company
          </button>
          <button
            onClick={() => onNavigateToWorkspace?.()}
            className="py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold text-center shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Collaborate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    );
  };

  const renderSolutionDetails = (s: MapSolutionItem) => {
    return (
      <div className="space-y-4">
        
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{s.deploymentStatus}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            {s.dateDeployed}
          </span>
        </div>

        {/* Verified Citizen Impact */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Citizen Impact</span>
          </div>
          <div className="text-2xl font-black text-emerald-950">
            {s.impactCitizens.toLocaleString()} Citizens Protected
          </div>
          {s.impactMetrics.waterSavedLitersDaily && (
            <div className="text-xs text-emerald-800 font-semibold mt-1">
              💧 {s.impactMetrics.waterSavedLitersDaily}
            </div>
          )}
          {s.impactMetrics.diagnosticWaitTimeReduced && (
            <div className="text-xs text-emerald-800 font-semibold mt-0.5">
              ⚡ {s.impactMetrics.diagnosticWaitTimeReduced}
            </div>
          )}
        </div>

        {/* Problem Solved */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Problem Solved
          </h4>
          <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
            {s.problemSolved}
          </p>
        </div>

        {/* Multi-stakeholder Partnership */}
        <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200/80 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Deployed By:</span>
            <span className="font-bold text-stone-900">{s.deployedByUniversity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Industry Backer:</span>
            <span className="font-bold text-stone-900">{s.supportedByIndustry}</span>
          </div>
        </div>

        {/* Tech Stack & Hardware Specs */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Technology & Hardware Specs
          </h4>
          <div className="p-3 bg-stone-900 text-stone-300 rounded-2xl text-xs font-mono mb-2">
            {s.hardwareSpecs}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {s.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button: View Solution */}
        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={() => onNavigateToWorkspace?.()}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>View Solution Telemetry & Replicate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    );
  };

  const getHeaderIcon = () => {
    switch (item.category) {
      case 'problem':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'university':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'industry':
        return <Building className="w-5 h-5 text-purple-600" />;
      case 'solution':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getCategoryTitle = () => {
    switch (item.category) {
      case 'problem':
        return 'Community Problem Hotspot';
      case 'university':
        return 'Academic & Research Partner';
      case 'industry':
        return 'Industry & CSR Partner';
      case 'solution':
        return 'Deployed Civic Solution';
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between overflow-y-auto text-stone-900 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-stone-100 bg-white sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-stone-100 mt-0.5 shadow-2xs">
              {getHeaderIcon()}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                {getCategoryTitle()}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#141414] leading-tight mt-0.5">
                {item.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mt-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {item.locationName} • {item.district}, {item.state}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
        {item.category === 'problem' && renderProblemDetails(item as MapProblemItem)}
        {item.category === 'university' && renderUniversityDetails(item as MapUniversityItem)}
        {item.category === 'industry' && renderIndustryDetails(item as MapIndustryItem)}
        {item.category === 'solution' && renderSolutionDetails(item as MapSolutionItem)}
      </div>

    </div>
  );
};
