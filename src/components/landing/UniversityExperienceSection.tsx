import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UniversityExperienceSection: React.FC = () => {
  const { setCurrentView, setUserRole } = useApp();

  const [activeTab, setActiveTab] = useState<'challenges' | 'faculty' | 'labs'>('challenges');

  const researchChallenges = [
    {
      title: 'Water Monitoring & Hydro-Telemetry Network',
      compatibility: '94% Compatibility',
      field: 'Environmental IoT & Embedded Hardware',
      faculty: 'Dr. A. Sharma (BIT Mesra)',
      team: 'Team AquaSense (4 Student Researchers)',
      grant: '₹2.5 Lakhs Seed Grant',
      status: 'Active Field Pilot',
    },
    {
      title: 'Rural Healthcare Tele-Diagnostics Hub',
      compatibility: '89% Compatibility',
      field: 'Biomedical Telemetry & Mobile Health',
      faculty: 'Dr. P. Roy (AIIMS Deoghar)',
      team: 'TeleMed Pulse (5 Student Researchers)',
      grant: '₹3.8 Lakhs R&D Grant',
      status: 'Prototyping Stage',
    },
    {
      title: 'Solar Micro-Irrigation & Soil Moisture Mesh',
      compatibility: '86% Compatibility',
      field: 'Precision Agriculture & Agronomy',
      faculty: 'Prof. K. Mahto (Birsa Agri Uni)',
      team: 'AgriTech Roots (4 Student Researchers)',
      grant: '₹2.0 Lakhs CSR Seed',
      status: 'Field Validation',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#F9F8F6] border-b border-stone-200/80 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Section 09 • University Experience
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.05]">
            Universities don't just receive problems. <br />
            <span className="font-bold italic text-blue-600">They discover opportunities to research.</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Academics and engineering students transform grassroots challenges into peer-reviewed publications, state patents, and funded startup ventures.
          </p>
        </div>

        {/* University Workspace Simulation Dashboard */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xl max-w-6xl mx-auto">
          
          {/* Top Bar with University Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-lg">
                BIT
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                  Birla Institute of Technology (BIT Mesra)
                </h3>
                <p className="text-xs text-stone-500">
                  Department of Civil Engineering & Embedded Systems • 18 Active Teams
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                State Academic Accredited
              </span>
            </div>
          </div>

          {/* Research Challenges Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchChallenges.map((rc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#F9F8F6] border border-stone-200 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {rc.compatibility}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {rc.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 tracking-tight mb-2">
                    {rc.title}
                  </h3>

                  <p className="text-xs text-stone-600 mb-4">
                    {rc.field}
                  </p>

                  <div className="space-y-1.5 text-xs text-stone-700 border-t border-stone-200/60 pt-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-stone-500">Faculty Guide:</span>
                      <span className="font-semibold text-stone-900">{rc.faculty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-stone-500">Team:</span>
                      <span className="font-semibold text-stone-900">{rc.team}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-stone-500">Seed Support:</span>
                      <span className="font-bold text-blue-700">{rc.grant}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setUserRole('university');
                    setCurrentView('workspace');
                  }}
                  className="mt-6 w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open R&D Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
