import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectWorkspaceItem, ProblemStatus } from '../types';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Sparkles,
  GraduationCap,
  Building,
  Users,
  Cpu,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Radio,
  ShieldCheck,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProjectWorkspacePage: React.FC = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    advanceProjectStage,
    setCurrentView,
    currentUser,
    navigateToDashboardTab,
  } = useApp();

  const activeProject = selectedProject || projects[0];

  // Simulated live sensor stream
  const [telemetry, setTelemetry] = useState({
    flowRate: 24.8,
    solarVoltage: 13.6,
    batteryPercent: 94,
    waterDepth: 18.2,
    lastPing: '2s ago',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        flowRate: +(24 + Math.random() * 2).toFixed(1),
        solarVoltage: +(13.4 + Math.random() * 0.4).toFixed(1),
        batteryPercent: Math.min(100, Math.max(90, Math.round(94 + (Math.random() * 2 - 1)))),
        waterDepth: +(18 + Math.random() * 0.5).toFixed(1),
        lastPing: 'Just now',
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stageList: { stage: ProblemStatus; label: string; icon: any }[] = [
    { stage: 'REPORTED', label: 'Reported', icon: Users },
    { stage: 'AI_ANALYZED', label: 'AI Analyzed', icon: Cpu },
    { stage: 'MATCHED', label: 'University Match', icon: GraduationCap },
    { stage: 'TEAM_FORMED', label: 'Team Formed', icon: Users },
    { stage: 'PROPOSAL_READY', label: 'AI Proposal', icon: Sparkles },
    { stage: 'INDUSTRY_JOINED', label: 'Industry Joined', icon: Building },
    { stage: 'PROTOTYPE', label: 'Hardware Prototype', icon: Zap },
    { stage: 'TESTING', label: 'Field Testing', icon: Activity },
    { stage: 'PILOT', label: 'Village Pilot', icon: Radio },
    { stage: 'DEPLOYED', label: 'Deployed', icon: CheckCircle2 },
    { stage: 'IMPACT_VERIFIED', label: 'Impact Verified', icon: Award },
  ];

  const currentStageIndex = stageList.findIndex((s) => s.stage === activeProject.currentStage);

  const handleAdvance = () => {
    advanceProjectStage(activeProject.id);
    if (activeProject.currentStage === 'PILOT' || activeProject.currentStage === 'DEPLOYED') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Active Project Workspace ({activeProject.id})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {activeProject.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-medium mt-1">
            <span>District: <strong className="text-stone-800">{activeProject.district}</strong></span>
            <span>•</span>
            <span>Domain: <strong className="text-sky-700">{activeProject.domain}</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-emerald-700">{activeProject.liveStatus}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAdvance}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            id="btn-advance-lifecycle-stage"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Advance Lifecycle Stage</span>
          </button>
        </div>
      </div>

      {/* Visual Project Lifecycle Timeline */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Engineering Lifecycle Progression ({activeProject.progressPercent}%)
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Current: {activeProject.currentStage.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
          {stageList.map((item, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = item.icon;

            return (
              <button
                key={item.stage}
                onClick={() => advanceProjectStage(activeProject.id, item.stage)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-emerald-500/20'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 text-stone-900'
                    : 'bg-stone-50/50 border-stone-200/60 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-400' : isCompleted ? 'text-emerald-600' : 'text-stone-300'}`} />
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-600">✓</span>
                  )}
                </div>
                <div className={`text-[10px] font-bold leading-tight ${isCurrent ? 'text-white' : 'text-stone-800'}`}>
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Dashboard Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stakeholders & Telemetry */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Stakeholder Network Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Project Ecosystem Stakeholders</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[10px] font-bold text-stone-400 uppercase">University Unit</div>
                <div className="font-bold text-stone-900 text-sm mt-1">{activeProject.universityName}</div>
                <div className="text-stone-500 text-[11px] mt-0.5">{activeProject.facultyLead}</div>
                <div className="text-sky-700 font-semibold text-[11px] mt-2">
                  {activeProject.studentTeamCount} Student Researchers
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Industry / CSR Partner</div>
                <div className="font-bold text-stone-900 text-sm mt-1">
                  {activeProject.industryPartnerName || 'WaterTech Innovations Ltd.'}
                </div>
                <div className="text-stone-500 text-[11px] mt-0.5">Rural IoT & Telemetry Kits</div>
                <div className="text-emerald-700 font-semibold text-[11px] mt-2">
                  ₹1.5L Co-Funding Active
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Government Beneficiary</div>
                <div className="font-bold text-stone-900 text-sm mt-1">{activeProject.district} District Admin</div>
                <div className="text-stone-500 text-[11px] mt-0.5">Toto Gram Panchayat</div>
                <div className="text-purple-700 font-semibold text-[11px] mt-2">
                  ~{activeProject.citizensTargeted.toLocaleString()} Citizens Impacted
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time IoT Telemetry Stream Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold text-stone-900">
                  Live Pilot Telemetry Stream (LoRaWAN Gateway)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-stone-400">Ping: {telemetry.lastPing}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/80">
                <div className="text-[10px] text-sky-800 font-bold uppercase">Water Flow Rate</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">{telemetry.flowRate} L/min</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Active Supply</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Solar Ingress</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">{telemetry.solarVoltage} V</div>
                <div className="text-[10px] text-stone-500">LiFePO4 Charging</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[10px] text-stone-500 font-bold uppercase">Battery State</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">{telemetry.batteryPercent}%</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Optimal</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[10px] text-stone-500 font-bold uppercase">Water Table Depth</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">{telemetry.waterDepth} m</div>
                <div className="text-[10px] text-stone-500">Hydro Sensor #04</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Project Meta & Budget */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
              Budget & Grant Allocation
            </h3>

            <div>
              <div className="flex justify-between text-stone-600 font-semibold mb-1">
                <span>Budget Utilized</span>
                <span className="font-bold text-stone-900">{activeProject.budgetUtilized} / {activeProject.estimatedCost}</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="pt-2 text-stone-600 space-y-2">
              <div className="flex justify-between">
                <span>Sensors & Enclosures:</span>
                <span className="font-bold text-stone-900">₹65,000</span>
              </div>
              <div className="flex justify-between">
                <span>LoRaWAN Gateway Hub:</span>
                <span className="font-bold text-stone-900">₹45,000</span>
              </div>
              <div className="flex justify-between">
                <span>Field Travel & Pilot Setup:</span>
                <span className="font-bold text-stone-900">₹30,000</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              {currentUser?.role === 'government' ? (
                <button
                  onClick={() => setCurrentView('command-center')}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Inspect in State Command Center
                </button>
              ) : currentUser?.role === 'university' ? (
                <button
                  onClick={() => navigateToDashboardTab('university-dashboard', 'solutions')}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  View in University Solutions Hub
                </button>
              ) : currentUser?.role === 'industry' ? (
                <button
                  onClick={() => navigateToDashboardTab('industry-dashboard', 'solutions')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  View in CSR Solutions Hub
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('problems')}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Explore Problem Registry
                </button>
              )}
            </div>
          </div>

          <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Verified Impact Audit</span>
            </div>
            <p className="text-stone-700 font-medium leading-relaxed">
              Once marked as <strong>DEPLOYED</strong>, this solution is entered into the State Civic Registry and credited toward BIT Mesra's National Institutional Ranking Framework (NIRF) social impact metric.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
