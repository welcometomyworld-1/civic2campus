import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  LayoutDashboard,
  Target,
  Layers,
  Sparkles,
  Handshake,
  GraduationCap,
  FolderGit2,
  UserCheck,
  Coins,
  Wrench,
  Lightbulb,
  MapPin,
  TrendingUp,
  Bell,
  Building,
  Search,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Award,
  Download,
  ExternalLink,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UNIVERSITIES } from '../data/mockData';
import { CSRSummaryMetrics, IndustryImpactSummary } from '../types/industry';
import { industryService } from '../services/industryService';

// Hub Components
import { CSRFundingView } from '../components/industry/CSRFundingView';
import { CSRDetailView } from '../components/industry/CSRDetailView';
import { TechSupportView } from '../components/industry/TechSupportView';
import { TechSupportDetailView } from '../components/industry/TechSupportDetailView';
import { IndustrySolutionsView } from '../components/industry/IndustrySolutionsView';
import { IndustrySolutionDetailView } from '../components/industry/IndustrySolutionDetailView';
import { IndustryInnovationMapView } from '../components/industry/IndustryInnovationMapView';
import { IndustryImpactView } from '../components/industry/IndustryImpactView';
import { IndustryProfileView } from '../components/industry/IndustryProfileView';
import { NotificationsHubView } from '../components/university/NotificationsHubView';

type IndustryTab =
  | 'overview'
  | 'ai-opportunities'
  | 'marketplace'
  | 'ai-recommendations'
  | 'collaborations'
  | 'universities'
  | 'supported-projects'
  | 'mentorship'
  | 'csr-funding'
  | 'tech-support'
  | 'solutions'
  | 'map'
  | 'impact'
  | 'notifications'
  | 'profile';

export const IndustryDashboardPage: React.FC = () => {
  const {
    problems,
    projects,
    notifications,
    currentUser,
    setCurrentView,
    addNotification,
    industryActiveTab,
    setIndustryActiveTab,
    navigateToDashboardTab,
  } = useApp();

  const activeTab = (industryActiveTab as IndustryTab) || 'overview';
  const setActiveTab = (tab: IndustryTab) => navigateToDashboardTab('industry-dashboard', tab);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Detail IDs
  const [selectedFundingId, setSelectedFundingId] = useState<string | null>(null);
  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(null);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);

  // Dynamic Dashboard Metrics
  const [csrSummary, setCsrSummary] = useState<CSRSummaryMetrics | null>(null);
  const [impactSummary, setImpactSummary] = useState<IndustryImpactSummary | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      setMetricsLoading(true);
      try {
        const [csr, impact] = await Promise.all([
          industryService.getCSRSummary(),
          industryService.getIndustryImpactSummary(),
        ]);
        setCsrSummary(csr);
        setImpactSummary(impact);
      } catch (e) {
        console.warn('Using fallback dashboard metrics:', e);
      } finally {
        setMetricsLoading(false);
      }
    };
    fetchDashboardMetrics();
  }, []);

  // Industry Mentors
  const mentors = [
    {
      name: 'Priya Sen',
      title: 'Principal Sustainability Engineer',
      assignedSquad: 'AquaSensors Squad Alpha (BIT Mesra)',
      focus: 'IoT Hardware Robustness & Water Quality Sensors',
      sessionsHeld: 8,
    },
    {
      name: 'Rajat Mukherjee',
      title: 'Head of Industrial Automation',
      assignedSquad: 'CleanAir Telemetry Lab (IIT Dhanbad)',
      focus: 'Edge AI Firmware & LoRaWAN Gateway Deployment',
      sessionsHeld: 6,
    },
    {
      name: 'Dr. Vivek Swaminathan',
      title: 'CSR Rural Development Lead',
      assignedSquad: 'AgriHydro AI Squad (BAU Ranchi)',
      focus: 'Solar Energy Optimization & Field Pilots',
      sessionsHeld: 11,
    },
  ];

  const handlePledgeGrant = (problemTitle: string) => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    industryService.createCSRFunding({
      project_name: `CSR Grant: ${problemTitle}`,
      problem_name: problemTitle,
      amount: 300000,
      support_type: 'CSR',
      purpose: 'Pledged via AI Recommendations command'
    }).catch(console.error);

    addNotification('CSR Grant Pledged', `₹3,00,000 committed for ${problemTitle}.`, 'funding');
    alert(`Success! CSR Co-Funding Grant of ₹3,00,000 has been pledged for: "${problemTitle}". MoU initiated with partner university.`);
    setActiveTab('csr-funding');
  };

  const filteredProblems = problems.filter((p) => {
    const matchesDomain = selectedDomain === 'ALL' || p.category === selectedDomain || p.domain === selectedDomain;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F9F8F6] text-[#141414] flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* DEDICATED INDUSTRY SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#1c2434] text-slate-100 flex flex-col border-r border-slate-800 shrink-0 select-none">
        
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black uppercase tracking-widest text-white truncate">
              {currentUser?.name || 'Tata Steel CSR Foundation'}
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CSR & Technology Partner</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard },
            { id: 'ai-opportunities', label: 'AI CSR Opportunities', icon: Target, badge: 'High ROI' },
            { id: 'marketplace', label: 'Problem Marketplace', icon: Layers },
            { id: 'ai-recommendations', label: 'AI Recommendations', icon: Sparkles },
            { id: 'collaborations', label: 'Collaborations', icon: Handshake },
            { id: 'universities', label: 'Universities Directory', icon: GraduationCap, badge: '42 Inst' },
            { id: 'supported-projects', label: 'Supported Projects', icon: FolderGit2, badge: `${csrSummary?.projects_funded || 4}` },
            { id: 'mentorship', label: 'Mentorship Program', icon: UserCheck },
            { id: 'csr-funding', label: 'CSR / Funding Tracker', icon: Coins, badge: `₹${((csrSummary?.total_csr_commitment || 1270000) / 100000).toFixed(1)}L` },
            { id: 'tech-support', label: 'Technology Support', icon: Wrench },
            { id: 'solutions', label: 'Solutions & Pilots', icon: Lightbulb, badge: `${impactSummary?.solutions_deployed || 4} Live` },
            { id: 'map', label: 'Innovation Map', icon: MapPin },
            { id: 'impact', label: 'ESG & Impact Metrics', icon: TrendingUp },
            { id: 'notifications', label: 'Notifications', icon: Bell, badge: `${notifications.filter((n) => !n.read).length}` },
            { id: 'profile', label: 'Company Profile', icon: Building },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedFundingId(null);
                  setSelectedSupportId(null);
                  setSelectedSolutionId(null);
                  setActiveTab(item.id as IndustryTab);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-slate-800 text-amber-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Quick Switch Action */}
        <div className="p-4 border-t border-slate-700/60 bg-slate-900/50">
          <div className="text-[10px] text-amber-300/80 uppercase font-bold mb-1">Tax Exemption 80G Certified</div>
          <p className="text-[11px] text-slate-400 mb-2">Govt Accredited Academic CSR</p>
          <button
            onClick={() => setActiveTab('csr-funding')}
            className="w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Download CSR Audit Report</span>
            <Download className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* ===================================================================== */}
        {/* TAB 1: DASHBOARD HOME / OVERVIEW */}
        {/* ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#0f172a] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Corporate Innovation & CSR Command</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {currentUser?.name || 'Tata Steel CSR Foundation'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  Empowering university R&D squads with capital grants, laboratory telemetry hardware, and corporate engineer mentorship to solve grassroots challenges.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => setActiveTab('ai-opportunities')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Target className="w-4 h-4 text-slate-950" />
                    <span>Explore AI CSR Opportunities</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('csr-funding')}
                    className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>Manage CSR Grants</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top KPI Cards (6 Key Metrics from MongoDB) */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">CSR Capital</span>
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-stone-900">
                  ₹{((csrSummary?.total_csr_commitment || 1270000) / 100000).toFixed(1)} L
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  ₹{((csrSummary?.amount_released || 850000) / 100000).toFixed(1)} L Disbursed
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">CSR Projects</span>
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-xl font-black text-stone-900">
                  {csrSummary?.projects_funded || 4} Active
                </div>
                <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
                  Across 4 Colleges
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tech Support</span>
                  <Wrench className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-xl font-black text-stone-900">
                  {impactSummary?.technical_support_delivered || 12} Engaged
                </div>
                <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                  6 Corporate Mentors
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Solutions</span>
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-stone-900">
                  {impactSummary?.solutions_supported || 9} Co-Built
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                  {impactSummary?.solutions_deployed || 4} Deployed
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Beneficiaries</span>
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-800">
                  {(impactSummary?.people_benefited || 8500).toLocaleString()}+
                </div>
                <div className="text-[10px] text-stone-500 font-semibold mt-0.5">
                  Jharkhand Citizens
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Districts</span>
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="text-xl font-black text-rose-900">
                  {impactSummary?.areas_covered || 7} Districts
                </div>
                <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
                  Tribal & Mining Belts
                </div>
              </div>
            </div>

            {/* Quick Grid: AI Opportunities + Active Grants */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Top High-Affinity CSR Opportunities */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-500" />
                      <span>AI Recommended CSR Opportunities</span>
                    </h3>
                    <p className="text-xs text-stone-500">High social ROI challenges matching your sustainability mandate</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('ai-opportunities')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {problems.slice(0, 3).map((prob, idx) => (
                    <div
                      key={prob.id}
                      className="p-4 rounded-2xl border border-stone-100 hover:border-amber-400/50 bg-[#FAF9F6] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900">
                              {96 - idx * 4}% Match Score
                            </span>
                            <span className="text-[11px] text-stone-500 font-bold uppercase">• {prob.category}</span>
                            <span className="text-[11px] text-stone-400">• {prob.district}</span>
                          </div>
                          <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-950 transition-colors">
                            {prob.title}
                          </h4>
                          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                            {prob.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-800 font-semibold">
                          Estimated Grant Needed: <strong>₹2.5 L – ₹3.5 L</strong>
                        </span>
                        <button
                          onClick={() => handlePledgeGrant(prob.title)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Pledge Co-Funding
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Quick Navigation to Hubs */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Quick Hub Shortcuts</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <div
                    onClick={() => setActiveTab('csr-funding')}
                    className="p-3.5 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/70 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-950 flex items-center justify-center font-black">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">CSR Funding Hub</div>
                        <div className="text-[10px] text-stone-500">Track grants, disbursements & utilization</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>

                  <div
                    onClick={() => setActiveTab('tech-support')}
                    className="p-3.5 bg-blue-50/50 hover:bg-blue-100/60 border border-blue-200/70 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-200 text-blue-950 flex items-center justify-center font-black">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Tech Support Hub</div>
                        <div className="text-[10px] text-stone-500">Assign experts, tasks & mentoring reviews</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>

                  <div
                    onClick={() => setActiveTab('solutions')}
                    className="p-3.5 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/70 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-950 flex items-center justify-center font-black">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Solutions Hub</div>
                        <div className="text-[10px] text-stone-500">Prototypes, testing trials & field pilots</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>

                  <div
                    onClick={() => setActiveTab('impact')}
                    className="p-3.5 bg-purple-50/50 hover:bg-purple-100/60 border border-purple-200/70 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-200 text-purple-950 flex items-center justify-center font-black">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Impact Hub</div>
                        <div className="text-[10px] text-stone-500">8 Recharts charts & verified SROI metrics</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: CSR FUNDING HUB */}
        {/* ===================================================================== */}
        {activeTab === 'csr-funding' && (
          selectedFundingId ? (
            <CSRDetailView fundingId={selectedFundingId} onBack={() => setSelectedFundingId(null)} />
          ) : (
            <CSRFundingView onSelectFunding={(id) => setSelectedFundingId(id)} />
          )
        )}

        {/* ===================================================================== */}
        {/* TAB: TECH SUPPORT HUB */}
        {/* ===================================================================== */}
        {activeTab === 'tech-support' && (
          selectedSupportId ? (
            <TechSupportDetailView supportId={selectedSupportId} onBack={() => setSelectedSupportId(null)} />
          ) : (
            <TechSupportView onSelectSupport={(id) => setSelectedSupportId(id)} />
          )
        )}

        {/* ===================================================================== */}
        {/* TAB: SOLUTIONS HUB */}
        {/* ===================================================================== */}
        {activeTab === 'solutions' && (
          selectedSolutionId ? (
            <IndustrySolutionDetailView solutionId={selectedSolutionId} onBack={() => setSelectedSolutionId(null)} />
          ) : (
            <IndustrySolutionsView onSelectSolution={(id) => setSelectedSolutionId(id)} />
          )
        )}

        {/* ===================================================================== */}
        {/* TAB: INNOVATION MAP HUB */}
        {/* ===================================================================== */}
        {activeTab === 'map' && <IndustryInnovationMapView />}

        {/* ===================================================================== */}
        {/* TAB: IMPACT HUB */}
        {/* ===================================================================== */}
        {activeTab === 'impact' && <IndustryImpactView />}

        {/* ===================================================================== */}
        {/* TAB: NOTIFICATIONS HUB */}
        {/* ===================================================================== */}
        {activeTab === 'notifications' && <NotificationsHubView />}

        {/* ===================================================================== */}
        {/* TAB: COMPANY PROFILE HUB */}
        {/* ===================================================================== */}
        {activeTab === 'profile' && <IndustryProfileView />}

        {/* ===================================================================== */}
        {/* TAB: AI OPPORTUNITIES */}
        {/* ===================================================================== */}
        {activeTab === 'ai-opportunities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-500" />
                  <span>AI Recommended CSR Opportunities</span>
                </h2>
                <p className="text-xs text-stone-600">High social feasibility challenges categorized by corporate impact domain</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {problems.map((prob, idx) => (
                <div key={prob.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                        {95 - idx * 3}% Match Affinity
                      </span>
                      <span className="text-xs font-bold text-stone-400 uppercase">📍 {prob.district}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900">{prob.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{prob.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 bg-stone-50 rounded-xl text-center">
                        <div className="text-[10px] text-stone-400 font-bold uppercase">Target Population</div>
                        <div className="text-xs font-extrabold text-stone-900">{prob.population} Citizens</div>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-xl text-center">
                        <div className="text-[10px] text-emerald-700 font-bold uppercase">Estimated Budget</div>
                        <div className="text-xs font-extrabold text-emerald-900">₹2.5 L – ₹4.0 L</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">Partner: BIT Mesra R&D</span>
                    <button
                      onClick={() => handlePledgeGrant(prob.title)}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-all"
                    >
                      Pledge CSR Grant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: UNIVERSITIES DIRECTORY */}
        {/* ===================================================================== */}
        {activeTab === 'universities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900">Partnered University Directory</h2>
                <p className="text-xs text-stone-600">Accredited engineering colleges and research institutions in Jharkhand</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {UNIVERSITIES.map((univ) => (
                <div key={univ.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-stone-900">{univ.name}</h3>
                      <div className="text-xs text-stone-500">{univ.badge || 'Premier R&D Institute'} • {univ.location}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-extrabold rounded-lg">
                      {univ.ranking}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-stone-400">Research & Tech Capabilities:</div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {univ.specializations?.map((d) => (
                        <span key={d} className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-semibold text-stone-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">District: {univ.district}</span>
                    <button
                      onClick={() => alert(`Connecting with ${univ.name} Dean of R&D...`)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-lg cursor-pointer"
                    >
                      Connect with R&D
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: MENTORSHIP */}
        {/* ===================================================================== */}
        {activeTab === 'mentorship' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900">Industry Engineer Mentorship Program</h2>
                <p className="text-xs text-stone-600">Company technical leads guiding university student squads</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {mentors.map((m) => (
                <div key={m.name} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">{m.name}</h3>
                    <div className="text-xs text-amber-700 font-bold">{m.title}</div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                    <div className="text-[10px] font-bold uppercase text-stone-400">Assigned Student Squad:</div>
                    <div className="font-bold text-stone-800">{m.assignedSquad}</div>
                  </div>

                  <div className="text-xs text-stone-600 leading-relaxed">
                    <strong>Technical Focus:</strong> {m.focus}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>{m.sessionsHeld} Mentorship Reviews Held</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: MARKETPLACE, AI RECOMMENDATIONS, SUPPORTED PROJECTS */}
        {/* ===================================================================== */}
        {(activeTab === 'marketplace' ||
          activeTab === 'ai-recommendations' ||
          activeTab === 'collaborations' ||
          activeTab === 'supported-projects') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
                <p className="text-xs text-stone-600">Explore community challenges and ongoing university collaboration projects</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {problems.slice(0, 4).map((prob, idx) => (
                <div key={prob.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {prob.category}
                    </span>
                    <span className="text-xs text-stone-400">📍 {prob.district}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900">{prob.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2">{prob.description}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">Pop: {prob.population}</span>
                    <button
                      onClick={() => handlePledgeGrant(prob.title)}
                      className="px-4 py-1.5 bg-slate-900 text-amber-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-800"
                    >
                      Pledge Grant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
