import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UNIVERSITIES, INDUSTRY_PARTNERS } from '../data/mockData';
import { aiService } from '../services/aiService';
import {
  Sparkles,
  Cpu,
  GraduationCap,
  Building,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  Activity,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AIMatchCenterPage: React.FC = () => {
  const {
    selectedProblem,
    problems,
    setSelectedProblem,
    acceptUniversityMatch,
    joinIndustryCollaboration,
    generateProposalForProject,
    setCurrentView,
    projects,
  } = useApp();

  const activeProblem = selectedProblem || problems[0];

  const matchedUniversities = aiService.matchUniversities(activeProblem.domain);
  const matchedIndustries = aiService.matchIndustries(activeProblem.domain);

  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'match' | 'team' | 'proposal'>('match');

  const handleGenerateProposal = async () => {
    setIsGeneratingProposal(true);
    const proposal = await aiService.generateSolution(
      activeProblem.title,
      activeProblem.domain,
      activeProblem.district
    );
    setGeneratedProposal(proposal);
    setIsGeneratingProposal(false);
    setActiveTab('proposal');
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
  };

  const handleCreateProjectAndAdvance = () => {
    acceptUniversityMatch(activeProblem.id, matchedUniversities[0]?.id || 'bit_mesra');
    joinIndustryCollaboration(
      projects[0]?.id || 'PRJ-JH-2026-01',
      matchedIndustries[0]?.id || 'watertech_innovations'
    );
    setCurrentView('workspace');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Cpu className="w-4 h-4" />
            <span>AI Match Studio & Solution Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Match Academic Labs & Design Solutions
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Algorithmic compatibility matching between grassroots problems, university research capabilities, and CSR industry sponsors.
          </p>
        </div>

        {/* Action Button: AI Solution Generator */}
        <button
          onClick={handleGenerateProposal}
          disabled={isGeneratingProposal}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer self-start md:self-auto"
          id="btn-generate-solution-ai"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isGeneratingProposal ? 'AI Synthesizing Architecture...' : '✨ Generate Solution with AI'}</span>
        </button>
      </div>

      {/* Selected Problem Spotlight Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                {activeProblem.id}
              </span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {activeProblem.domain}
              </span>
              {activeProblem.clusterId && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Cluster #{activeProblem.clusterId} ({activeProblem.clusterCount || 43} Reports)
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-2">
              {activeProblem.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-stone-400">Affected Population</div>
              <div className="text-base font-extrabold text-stone-900">
                ~{(activeProblem.clusterAffectedCitizens || activeProblem.affectedPopulation).toLocaleString()} Citizens
              </div>
            </div>
            <div className="text-right pl-3 border-l border-stone-200">
              <div className="text-[10px] uppercase font-bold text-stone-400">Severity Score</div>
              <div className="text-base font-extrabold text-rose-600">
                {activeProblem.priorityScore}/100 ({activeProblem.priority})
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-600 font-medium leading-relaxed">
          {activeProblem.description}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('match')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'match'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          University & Industry Matches
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'team'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Multidisciplinary Team Builder
        </button>
        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'proposal'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Solution Architecture {generatedProposal && '✓'}</span>
        </button>
      </div>

      {/* TAB 1: University & Industry Match Cards */}
      {activeTab === 'match' && (
        <div className="space-y-8">
          {/* Universities Row */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-stone-900">
                  Top Recommended Universities & Research Centers
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">Ranked by Lab Specialization & Past Patents</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {matchedUniversities.map((uni, idx) => (
                <div
                  key={uni.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                    idx === 0
                      ? 'border-sky-300 ring-2 ring-sky-500/10 shadow-md'
                      : 'border-stone-200 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                          Rank #{idx + 1} Institution
                        </div>
                        <h4 className="text-base font-bold text-stone-900 mt-0.5">{uni.name}</h4>
                        <div className="text-xs text-stone-500">{uni.location}</div>
                      </div>
                      <div className="px-3 py-1 rounded-xl bg-sky-50 text-sky-800 font-black text-xs border border-sky-200">
                        {uni.matchScore}%
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase">Core Departments:</div>
                        <div className="text-stone-700 font-medium">{uni.strongDepartments.join(', ')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase">Specialization Labs:</div>
                        <div className="text-stone-700 font-medium">{uni.specializations.slice(0, 3).join(', ')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <button
                      onClick={() => {
                        acceptUniversityMatch(activeProblem.id, uni.id);
                        setActiveTab('team');
                      }}
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all"
                    >
                      Select & Form Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Partners Row */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-stone-900">
                  Recommended CSR & Industry Partners
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">Co-funding Grants & Hardware Testbeds</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {matchedIndustries.map((ind, idx) => (
                <div
                  key={ind.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                          CSR Backer
                        </div>
                        <h4 className="text-base font-bold text-stone-900 mt-0.5">{ind.name}</h4>
                        <div className="text-xs text-stone-500">{ind.category}</div>
                      </div>
                      <div className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 font-black text-xs border border-purple-200">
                        {ind.compatibilityScore}%
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase">Available Grant:</div>
                        <div className="text-emerald-700 font-bold">{ind.csrCommitment}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase">Hardware / Tech Kit:</div>
                        <div className="text-stone-700 font-medium">{ind.technologies.slice(0, 2).join(', ')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <button
                      onClick={() => {
                        joinIndustryCollaboration(projects[0]?.id || 'PRJ-JH-2026-01', ind.id);
                        setActiveTab('proposal');
                      }}
                      className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition-all"
                    >
                      Connect CSR Sponsor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Multidisciplinary Team Builder */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Cross-Domain Engineering Roster
              </div>
              <h3 className="text-xl font-bold text-stone-900 mt-1">
                BIT Mesra Multidisciplinary Innovation Unit
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              ✓ 5 Members Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Faculty Mentor & PI</div>
              <div className="text-sm font-bold text-stone-900 mt-1">Dr. Alok K. Verma</div>
              <div className="text-xs text-stone-500">Dept. of Civil & Water Resources</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Student Lead (IoT)</div>
              <div className="text-sm font-bold text-stone-900 mt-1">Aman Kumar (ECE '26)</div>
              <div className="text-xs text-stone-500">ESP32 & LoRaWAN Embedded Systems</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Student (AI & Cloud)</div>
              <div className="text-sm font-bold text-stone-900 mt-1">Pooja Kumari (CSE '25)</div>
              <div className="text-xs text-stone-500">FastAPI & Telemetry Dashboard</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Field Operations Lead</div>
              <div className="text-sm font-bold text-stone-900 mt-1">Rohan Munda (Mech '26)</div>
              <div className="text-xs text-stone-500">Panchayat Deployment & Mechanical Rig</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <div className="text-xs text-stone-500">
              All team members earn state innovation research credits and travel stipend.
            </div>
            <button
              onClick={handleGenerateProposal}
              className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <span>Proceed to AI Solution Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: AI Generated Solution Architecture */}
      {activeTab === 'proposal' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  AI Solution Proposal Synthesis
                </div>
                <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                  Solar-Powered Hydro-Telemetry & Automated Community Water Unit
                </h3>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-stone-100 text-stone-800 rounded-lg">
              Est. Cost: ₹3,20,000
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            
            {/* Left 8 Cols: Architecture & Rollout */}
            <div className="lg:col-span-8 space-y-6 text-xs text-stone-700">
              
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-2">Technical Architecture Stack</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div className="font-bold text-stone-900">ESP32-WROOM</div>
                    <div className="text-[10px] text-stone-500">Low-power MCU</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div className="font-bold text-stone-900">LoRaWAN SX1276</div>
                    <div className="text-[10px] text-stone-500">15km Rural Mesh</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div className="font-bold text-stone-900">50W Solar + LiFePO4</div>
                    <div className="text-[10px] text-stone-500">Autonomous Power</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div className="font-bold text-stone-900">Cloud Dashboard</div>
                    <div className="text-[10px] text-stone-500">Panchayat Telemetry</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-2">4-Phase Implementation Strategy</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5">
                    <span className="font-bold text-stone-900">Phase 1:</span>
                    <span>Laboratory Bench Validation & Ultrasonic calibration at BIT Mesra Hydro-Lab (Week 1–2)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5">
                    <span className="font-bold text-stone-900">Phase 2:</span>
                    <span>Solar casing weatherproofing & WaterTech sensor assembly (Week 3–4)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5">
                    <span className="font-bold text-stone-900">Phase 3:</span>
                    <span>Panchayat Pilot Deployment in Toto Village, Gumla with live LoRaWAN stream (Week 5–6)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5">
                    <span className="font-bold text-stone-900">Phase 4:</span>
                    <span>Statewide cluster scale-out across 10 rural blocks (Week 7+)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Budget & Outcomes */}
            <div className="lg:col-span-4 bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4 text-xs">
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase">Estimated Budget (BOM)</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">₹3,20,000</div>
                <div className="text-[10px] text-emerald-600 font-semibold">50% Covered by WaterTech CSR Grant</div>
              </div>

              <div className="border-t border-stone-200 pt-3">
                <div className="text-[10px] font-bold text-stone-400 uppercase mb-1">Expected Community Impact</div>
                <div className="text-stone-800 font-semibold">2,840 Citizens across 120 households</div>
                <div className="text-stone-500 text-[11px] mt-0.5">99.2% reduction in unmonitored pump failure downtime</div>
              </div>

              <div className="border-t border-stone-200 pt-3">
                <div className="text-[10px] font-bold text-stone-400 uppercase mb-1">Risk Mitigation</div>
                <p className="text-stone-600 text-[11px]">
                  Tamper-resistant IP68 metallic enclosure prevents vandalism. Redundant GSM fallback if LoRaWAN is shadowed.
                </p>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-stone-100">
            <button
              onClick={handleGenerateProposal}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Regenerate Alternative Architecture
            </button>

            <button
              onClick={handleCreateProjectAndAdvance}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Approve Architecture & Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
