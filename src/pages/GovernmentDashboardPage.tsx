import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  LayoutDashboard,
  AlertTriangle,
  MapPin,
  BarChart3,
  GraduationCap,
  Building2,
  FolderGit2,
  Lightbulb,
  Radio,
  Users,
  TrendingUp,
  FileText,
  Bell,
  UserCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Activity,
  Layers,
  Sparkles,
  Send,
  Printer,
  FileCheck,
  RefreshCw,
  Eye,
  Building,
  Check,
  X,
  SlidersHorizontal,
  Map as MapIcon,
  HelpCircle,
  Lock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { JHARKHAND_DISTRICTS } from '../data/mockData';
import { UniversityInnovationMapView } from '../components/university/UniversityInnovationMapView';
import { IndustryPartnersView } from '../components/university/IndustryPartnersView';
import { StudentEngineeringSquadsView } from '../components/squads/StudentEngineeringSquadsView';
import { SolutionsView } from '../components/university/SolutionsView';
import { ImpactHubView } from '../components/university/ImpactHubView';
import { NotificationsHubView } from '../components/university/NotificationsHubView';

type GovernmentTab =
  | 'overview'
  | 'problem-monitoring'
  | 'innovation-map'
  | 'analytics'
  | 'universities'
  | 'industries'
  | 'projects'
  | 'solutions'
  | 'deployments'
  | 'citizens'
  | 'impact'
  | 'reports'
  | 'notifications'
  | 'profile';

export const GovernmentDashboardPage: React.FC = () => {
  const {
    problems,
    projects,
    districts,
    notifications,
    isLoggedIn,
    currentUser,
    setCurrentView,
    setSelectedDistrict,
    advanceProjectStage,
    governmentActiveTab,
    setGovernmentActiveTab,
    navigateToDashboardTab,
  } = useApp();

  // Access Control Guard: Exclusively for Government and Admin roles
  const isAuthorized = isLoggedIn && (currentUser?.role === 'government' || currentUser?.role === 'admin');

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Restricted Government Clearance</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              State Command Center Access Restricted
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              The Jharkhand State Innovation Command Center & Telemetry Matrix is exclusively restricted to verified Government Officials, District Collectors, and State Administrators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left text-xs space-y-2 text-stone-600">
            <div className="font-semibold text-stone-800">Current Session State:</div>
            <div>• Authenticated: <span className="font-mono font-bold text-stone-900">{isLoggedIn ? 'Yes' : 'No'}</span></div>
            <div>• Active User Role: <span className="font-mono font-bold uppercase text-stone-900">{currentUser?.role || 'Guest / Public'}</span></div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => setCurrentView('login')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In as Government Official</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentUser?.role === 'university' ? (
              <button
                onClick={() => setCurrentView('university-dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Return to University Dashboard
              </button>
            ) : currentUser?.role === 'industry' ? (
              <button
                onClick={() => setCurrentView('industry-dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Return to Industry Dashboard
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('home')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Return to Home Overview
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const activeTab = (governmentActiveTab as GovernmentTab) || 'overview';
  const setActiveTab = (tab: GovernmentTab) => {
    if (navigateToDashboardTab) {
      navigateToDashboardTab('government-dashboard', tab);
    } else {
      setGovernmentActiveTab(tab);
    }
  };

  // Multi-Filter State for Problem Monitoring / Surveillance
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local state for problem escalations and triage
  const [localProblems, setLocalProblems] = useState(problems);
  const [selectedEscalateProblem, setSelectedEscalateProblem] = useState<any | null>(null);
  const [escalationMemo, setEscalationMemo] = useState<string>('');
  const [escalationSuccessMsg, setEscalationSuccessMsg] = useState<string | null>(null);

  // Sync with global problems
  useEffect(() => {
    setLocalProblems(problems);
  }, [problems]);

  // Analytics State
  const [selectedAnalyticsZone, setSelectedAnalyticsZone] = useState<string>('ALL');

  // Reports & Dossier State
  const [previewReportModal, setPreviewReportModal] = useState<string | null>(null);
  const [reportDownloadToast, setReportDownloadToast] = useState<string | null>(null);

  // Profile Form State
  const [officerName, setOfficerName] = useState('Dr. Manish Ranjan, IAS');
  const [officerDesignation, setOfficerDesignation] = useState('Principal Secretary, Higher & Technical Education');
  const [officerEmail, setOfficerEmail] = useState('secretary.hed@jharkhand.gov.in');
  const [officerPhone, setOfficerPhone] = useState('+91 651 2400-880');
  const [profileSaved, setProfileSaved] = useState(false);

  // Live KPI Calculations
  const totalProblemsReported = localProblems.length;
  const criticalCount = localProblems.filter((p) => p.urgency === 'Critical' || p.urgency === 'High').length;
  const activeProjectsCount = projects.length;
  const totalCitizensBenefited = localProblems.reduce((acc, p) => acc + (p.population || 400), 0);
  const escalatedCount = localProblems.filter((p) => p.status === 'Escalated to DC' || p.status === 'IN_PROGRESS').length;

  // Filtered problems for Surveillance
  const filteredProblems = localProblems.filter((p) => {
    const matchDistrict = filterDistrict === 'ALL' || p.district === filterDistrict;
    const matchCategory = filterCategory === 'ALL' || p.category === filterCategory || p.domain === filterCategory;
    const matchPriority = filterPriority === 'ALL' || p.urgency === filterPriority;
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDistrict && matchCategory && matchPriority && matchStatus && matchSearch;
  });

  // Chart Data
  const domainChartData = [
    { name: 'Water & Sanitation', value: 36, color: '#0284c7' },
    { name: 'Healthcare', value: 24, color: '#e11d48' },
    { name: 'Agriculture', value: 20, color: '#16a34a' },
    { name: 'Clean Energy', value: 16, color: '#d97706' },
    { name: 'Civic Waste', value: 12, color: '#9333ea' },
    { name: 'Infrastructure', value: 10, color: '#0d9488' },
  ];

  const districtSeverityData = (districts.length ? districts : JHARKHAND_DISTRICTS).slice(0, 8).map((d) => ({
    name: d.name,
    problems: d.totalProblems || Math.floor(Math.random() * 20) + 5,
    impacted: Math.round((d.citizensImpacted || 12000) / 1000),
  }));

  const timelineData = [
    { month: 'Apr', reported: 120, resolved: 55, active: 65 },
    { month: 'May', reported: 185, resolved: 95, active: 90 },
    { month: 'Jun', reported: 240, resolved: 160, active: 80 },
    { month: 'Jul', reported: 310, resolved: 230, active: 80 },
    { month: 'Aug', reported: 395, resolved: 310, active: 85 },
    { month: 'Sep', reported: 460, resolved: 380, active: 80 },
  ];

  const filteredDistricts = (districts.length ? districts : JHARKHAND_DISTRICTS).filter(
    (d) => selectedAnalyticsZone === 'ALL' || d.zone === selectedAnalyticsZone
  );

  // Handlers
  const handleEscalateProblem = (problem: any) => {
    setSelectedEscalateProblem(problem);
    setEscalationMemo(`OFFICIAL DIRECTIVE: High urgency alert for ${problem.district} district. Assigning nodal university engineering squad for immediate prototype calibration.`);
  };

  const submitEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscalateProblem) return;

    setLocalProblems((prev) =>
      prev.map((p) =>
        p.id === selectedEscalateProblem.id
          ? { ...p, status: 'Escalated to DC', escalatedTo: 'District Magistrate Office & Nodal R&D Dean' }
          : p
      )
    );

    setEscalationSuccessMsg(`Directive dispatched! Problem #${selectedEscalateProblem.id} successfully escalated to ${selectedEscalateProblem.district} District Magistrate.`);
    setSelectedEscalateProblem(null);
    setTimeout(() => setEscalationSuccessMsg(null), 5000);
  };

  const handleUpdateStatus = (problemId: string, newStatus: string) => {
    setLocalProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, status: newStatus as any } : p))
    );
  };

  const handleExportReport = (format: string, reportTitle: string) => {
    if (format === 'csv') {
      const csvHeader = 'District,Zone,Total Problems,Critical,Active Projects,Citizens Impacted,CSR Funding\n';
      const csvRows = filteredDistricts
        .map((d) => `"${d.name}","${d.zone}",${d.totalProblems},${d.criticalProblems},${d.activeProjects},${d.citizensImpacted},"${d.csrFunding}"`)
        .join('\n');
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const exportData = {
        state: 'Jharkhand',
        agency: 'State Secretariat & District Innovation Command',
        generated_at: new Date().toISOString(),
        report_title: reportTitle,
        districts_summary: filteredDistricts,
        telemetry_overview: {
          total_problems: totalProblemsReported,
          critical_problems: criticalCount,
          active_projects: activeProjectsCount,
          citizens_impacted: totalCitizensBenefited,
        },
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      setPreviewReportModal(reportTitle);
    }

    setReportDownloadToast(`Report "${reportTitle}" successfully exported in ${format.toUpperCase()} format.`);
    setTimeout(() => setReportDownloadToast(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F9F8F6] text-[#141414] flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* DEDICATED GOVERNMENT SIDEBAR (14 SECTIONS) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#022c22] text-emerald-100 flex flex-col border-r border-emerald-950 shrink-0 select-none">
        
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-emerald-900/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black uppercase tracking-widest text-white truncate">
              {currentUser?.name || 'Govt of Jharkhand'}
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>State Civic Command Center</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Command Center Home', icon: LayoutDashboard },
            { id: 'problem-monitoring', label: '🚨 Surveillance & Triage', icon: AlertTriangle, badge: `${criticalCount} Critical` },
            { id: 'innovation-map', label: '🗺️ Statewide 3D Map', icon: MapPin },
            { id: 'analytics', label: '📊 Statewide Analytics', icon: BarChart3 },
            { id: 'universities', label: 'Universities R&D', icon: GraduationCap, badge: '42 Inst' },
            { id: 'industries', label: 'Industry CSR Partners', icon: Building2 },
            { id: 'projects', label: 'Projects Oversight', icon: FolderGit2, badge: `${projects.length}` },
            { id: 'solutions', label: 'Verified Solutions', icon: Lightbulb },
            { id: 'deployments', label: 'Live Telemetry & IoT', icon: Radio },
            { id: 'citizens', label: 'Citizen Engagement', icon: Users },
            { id: 'impact', label: 'Impact & Sustainability', icon: TrendingUp },
            { id: 'reports', label: '📑 Reports & Exports', icon: FileText },
            { id: 'notifications', label: 'Statewide Notifications', icon: Bell, badge: `${notifications.filter((n) => !n.read).length}` },
            { id: 'profile', label: 'Government Profile', icon: UserCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as GovernmentTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm'
                    : 'text-emerald-100/75 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-950' : 'text-emerald-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-950 text-amber-300'
                        : 'bg-emerald-800 text-amber-300 border border-emerald-700'
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
        <div className="p-4 border-t border-emerald-900/60 bg-emerald-950/40">
          <div className="text-[10px] text-amber-300/80 uppercase font-bold mb-1">Statewide Coverage</div>
          <p className="text-[11px] text-emerald-100/70 mb-2">24 Districts • Live Telemetry Feeds</p>
          <button
            onClick={() => setActiveTab('reports')}
            className="w-full py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Generate Official Dossier (PDF)</span>
            <Download className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Toast Feedback Notification */}
        {reportDownloadToast && (
          <div className="mb-4 p-3.5 bg-emerald-900 text-emerald-100 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg border border-emerald-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{reportDownloadToast}</span>
          </div>
        )}

        {escalationSuccessMsg && (
          <div className="mb-4 p-3.5 bg-emerald-900 text-emerald-100 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg border border-emerald-700 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{escalationSuccessMsg}</span>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 1: DASHBOARD HOME / OVERVIEW */}
        {/* ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#02221b] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Statewide Secretariat & District Innovation Command</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Jharkhand Civic Telemetry & Deployment Matrix
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
                  Real-time multi-agency surveillance tracking problem intake, university engineering squads, CSR co-funding disbursements, and IoT sensor deployments across all 24 districts.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => setActiveTab('problem-monitoring')}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🚨 Open Surveillance & Triage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('innovation-map')}
                    className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🗺️ Launch 3D Innovation Map</span>
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
                  >
                    <span>📑 Export District Dossiers</span>
                    <Download className="w-3.5 h-3.5 text-emerald-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Total Problems</div>
                <div className="text-2xl font-black text-stone-900 mt-1">{totalProblemsReported}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Across 24 Districts</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Critical Urgency</div>
                <div className="text-2xl font-black text-rose-600 mt-1">{criticalCount}</div>
                <div className="text-[10px] text-rose-600 font-bold mt-0.5">Triage Queue</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Active Squad Projects</div>
                <div className="text-2xl font-black text-sky-700 mt-1">{activeProjectsCount}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Under Prototyping</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Participating Unis</div>
                <div className="text-2xl font-black text-indigo-700 mt-1">42</div>
                <div className="text-[10px] text-stone-500 mt-0.5">1,248 Researchers</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-bold text-stone-500 uppercase">CSR Co-Funding</div>
                <div className="text-2xl font-black text-purple-700 mt-1">₹18.4 Cr</div>
                <div className="text-[10px] text-purple-600 font-semibold mt-0.5">42 Industry Backers</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Citizens Impacted</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">{totalCitizensBenefited.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Verified Telemetry</div>
              </div>
            </div>

            {/* Comparative Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">District Challenges vs Verified Citizens Impacted (in thousands)</h3>
                    <p className="text-xs text-stone-500">Live comparative telemetry from major districts</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Analytics</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtSeverityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#78716c" fontSize={11} />
                      <YAxis stroke="#78716c" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="problems" fill="#0284c7" name="Total Problems" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="impacted" fill="#10b981" name="Impacted (k)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">AI Classified Problem Domains</h3>
                  <p className="text-xs text-stone-500 mb-3">Statewide sector breakdown</p>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={domainChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {domainChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
                  {domainChartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-stone-600 font-medium truncate">{d.name} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick District Readiness Preview */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">District Innovation Readiness League</h3>
                  <p className="text-xs text-stone-500">Live multi-agency resolution metrics by District</p>
                </div>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All 24 Districts</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">District</th>
                      <th className="pb-3">Administrative Zone</th>
                      <th className="pb-3">Reported Problems</th>
                      <th className="pb-3">Critical Urgency</th>
                      <th className="pb-3">Active R&D Projects</th>
                      <th className="pb-3">Citizens Impacted</th>
                      <th className="pb-3">CSR Co-Funding</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                    {filteredDistricts.slice(0, 6).map((d) => (
                      <tr key={d.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 font-bold text-stone-900">{d.name}</td>
                        <td className="py-3 text-stone-500">{d.zone}</td>
                        <td className="py-3 font-semibold text-stone-900">{d.totalProblems}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                            {d.criticalProblems}
                          </span>
                        </td>
                        <td className="py-3 text-sky-700 font-bold">{d.activeProjects}</td>
                        <td className="py-3 text-emerald-700 font-bold">{(d.citizensImpacted || 12000).toLocaleString()}</td>
                        <td className="py-3 font-bold text-purple-700">{d.csrFunding}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedDistrict(d);
                              setActiveTab('innovation-map');
                            }}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          >
                            Inspect 3D
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: PROBLEM MONITORING & SURVEILLANCE */}
        {/* ===================================================================== */}
        {activeTab === 'problem-monitoring' && (
          <div className="space-y-6">
            
            {/* Top Surveillance Header */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                    <span>Statewide Civic Surveillance & Problem Triage Matrix</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                    Active Multi-Agency Problem Surveillance Room
                  </h2>
                  <p className="text-xs text-stone-600">
                    Live tracking across all 24 districts • Instant escalation to District Collectors & R&D Innovation Deans
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                    <div className="text-[10px] font-bold text-rose-700 uppercase">Critical Queue</div>
                    <div className="text-base font-black text-rose-900">{criticalCount} Issues</div>
                  </div>
                  <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">Escalated to DCs</div>
                    <div className="text-base font-black text-emerald-900">{escalatedCount} Directives</div>
                  </div>
                </div>
              </div>

              {/* Multi-Filters Controls Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1">
                <div className="relative sm:col-span-2">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problem title, district, keywords..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                  />
                </div>

                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-700 outline-none"
                >
                  <option value="ALL">All Districts (24)</option>
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-700 outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="Critical">🔴 Critical Urgency</option>
                  <option value="High">🟠 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-700 outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Open">Open Intake</option>
                  <option value="Under AI Analysis">Under AI Analysis</option>
                  <option value="Matched to University">Matched to University</option>
                  <option value="Squad Prototyping">Squad Prototyping</option>
                  <option value="Escalated to DC">Escalated to DC</option>
                  <option value="Resolved">Resolved / Deployed</option>
                </select>
              </div>
            </div>

            {/* Surveillance Problem Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
                <span>Showing {filteredProblems.length} Active Telemetry Reports</span>
                <span className="text-emerald-800">Live Auto-Sync: ON</span>
              </div>

              {filteredProblems.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-base font-bold text-stone-900">No Problems Match Selected Filter</h3>
                  <p className="text-xs text-stone-500">Adjust the district or priority criteria to inspect other telemetry feeds.</p>
                </div>
              ) : (
                filteredProblems.map((prob) => {
                  const isCritical = prob.urgency === 'Critical' || prob.urgency === 'High';
                  return (
                    <div
                      key={prob.id}
                      className={`bg-white p-5 sm:p-6 rounded-3xl border transition-all space-y-4 shadow-2xs ${
                        isCritical ? 'border-rose-200 hover:border-rose-400' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {/* Top Header info */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              prob.urgency === 'Critical'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : prob.urgency === 'High'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}>
                              {prob.urgency || 'Medium'} Urgency
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200">
                              {prob.category || prob.domain || 'Civic Infrastructure'}
                            </span>
                            <span className="text-xs font-semibold text-stone-500">
                              District: <strong className="text-stone-900">{prob.district}</strong>
                            </span>
                            {prob.village && (
                              <span className="text-xs text-stone-400">
                                • {prob.village}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-stone-900">{prob.title}</h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            prob.status === 'Escalated to DC'
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : prob.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-stone-100 text-stone-800'
                          }`}>
                            Status: {prob.status || 'Reported'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed">{prob.description}</p>

                      {/* AI Root Cause Telemetry Note */}
                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-2.5 text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-900">AI Root-Cause Diagnostics: </span>
                          <span className="text-stone-600">
                            Geospatial cluster detected. High correlation with off-grid rural telemetry node requirements. Assigned R&D discipline: IoT Sensors & Civil Hydro-Engineering.
                          </span>
                        </div>
                      </div>

                      {/* Bottom Actions Bar */}
                      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4 text-stone-500 font-medium">
                          <span>Impacted: <strong className="text-stone-900">{prob.population || 500} Citizens</strong></span>
                          <span>Coordinates: <strong className="font-mono text-stone-700">{prob.coordinates ? `${prob.coordinates[0].toFixed(2)}, ${prob.coordinates[1].toFixed(2)}` : '23.34, 85.30'}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedDistrict(JHARKHAND_DISTRICTS.find((d) => d.name === prob.district) || JHARKHAND_DISTRICTS[0]);
                              setActiveTab('innovation-map');
                            }}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <MapPin className="w-3 h-3 text-emerald-700" />
                            <span>View on 3D Map</span>
                          </button>

                          <select
                            value={prob.status || 'Open'}
                            onChange={(e) => handleUpdateStatus(prob.id, e.target.value)}
                            className="px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 outline-none"
                          >
                            <option value="Open">Status: Open</option>
                            <option value="Under AI Analysis">Under AI Analysis</option>
                            <option value="Matched to University">Matched to Uni</option>
                            <option value="Squad Prototyping">Squad Prototyping</option>
                            <option value="Escalated to DC">Escalated to DC</option>
                            <option value="Resolved">Resolved</option>
                          </select>

                          <button
                            onClick={() => handleEscalateProblem(prob)}
                            className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Escalate to DC</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: INNOVATION MAP (4 LAYERS) */}
        {/* ===================================================================== */}
        {activeTab === 'innovation-map' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-emerald-700" />
                  <span>Statewide Geospatial Innovation Map (4 Layers)</span>
                </h2>
                <p className="text-xs text-stone-500">
                  🔴 Community Problems • 🎓 Universities & Labs • 🏭 Industries & CSR • 🟢 Deployed Telemetry Solutions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('problem-monitoring')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  <span>Surveillance Table</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  <span>District Analytics</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Map Component */}
            <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
              <UniversityInnovationMapView />
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: STATEWIDE ANALYTICS */}
        {/* ===================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Top Analytics Header */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>Statewide Multi-Agency Data Intelligence</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  Jharkhand District Innovation & Resolution Analytics
                </h2>
                <p className="text-xs text-stone-600">
                  Longitudinal problem intake velocity, student squad R&D throughput, and CSR investment impact
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAnalyticsZone}
                  onChange={(e) => setSelectedAnalyticsZone(e.target.value)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 outline-none cursor-pointer"
                >
                  <option value="ALL">All 5 Administrative Zones (24 Districts)</option>
                  <option value="South Chota Nagpur">South Chota Nagpur (Ranchi, Khunti, Simdega, Gumla, Lohardaga)</option>
                  <option value="North Chota Nagpur">North Chota Nagpur (Hazaribagh, Dhanbad, Bokaro, Giridih, Ramgarh)</option>
                  <option value="Kolhan">Kolhan (East Singhbhum, West Singhbhum, Seraikela-Kharsawan)</option>
                  <option value="Santhal Pargana">Santhal Pargana (Dumka, Deoghar, Godda, Sahibganj, Pakur, Jamtara)</option>
                  <option value="Palamu">Palamu (Palamu, Garhwa, Latehar)</option>
                </select>
              </div>
            </div>

            {/* Top 4 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-[10px] font-bold uppercase text-stone-400">Total Statewide Intake</div>
                <div className="text-2xl font-black text-stone-900">{totalProblemsReported} Issues</div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% MoM reporting velocity</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-[10px] font-bold uppercase text-stone-400">Resolution Rate</div>
                <div className="text-2xl font-black text-emerald-800">82.6%</div>
                <div className="text-[11px] text-stone-500">Average time to triage: 4.2 days</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-[10px] font-bold uppercase text-stone-400">Active Quad-Helix Alliances</div>
                <div className="text-2xl font-black text-sky-800">38 Hubs</div>
                <div className="text-[11px] text-sky-700 font-semibold">Government + Uni + Industry</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-[10px] font-bold uppercase text-stone-400">CSR Capital Deployed</div>
                <div className="text-2xl font-black text-purple-800">₹18.4 Cr</div>
                <div className="text-[11px] text-purple-700 font-semibold">42 Corporates Contributing</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Problem Intake vs Resolution Velocity */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Problem Intake vs Resolution Velocity (6 Months)</h3>
                    <p className="text-xs text-stone-500">Telemetry comparison of intake vs student squad deployment</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg">
                    Statewide Audit
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reported" stroke="#ef4444" strokeWidth={2.5} name="Reported Intake" />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} name="Resolved / Deployed" />
                      <Line type="monotone" dataKey="active" stroke="#0284c7" strokeWidth={2} strokeDasharray="4 4" name="Under Prototyping" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* District Problem Density */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Top Problem Density & Criticality by District</h3>
                    <p className="text-xs text-stone-500">Comparative challenge volume across key zones</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg">
                    Live Feed
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtSeverityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="problems" fill="#0284c7" name="Total Challenges" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Complete 24 Districts League Table */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Complete 24-District Innovation Readiness Matrix</h3>
                  <p className="text-xs text-stone-500">Official ranking by resolution velocity, squad deployments & verified impact</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportReport('csv', 'Statewide_24_District_Readiness_Report')}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">District</th>
                      <th className="pb-3">Zone</th>
                      <th className="pb-3">Total Issues</th>
                      <th className="pb-3">Critical</th>
                      <th className="pb-3">Active R&D Projects</th>
                      <th className="pb-3">Citizens Benefited</th>
                      <th className="pb-3">CSR Funding</th>
                      <th className="pb-3 text-right">Surveillance Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                    {filteredDistricts.map((d, index) => (
                      <tr key={d.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 font-mono font-bold text-stone-400">#{index + 1}</td>
                        <td className="py-3 font-bold text-stone-900">{d.name}</td>
                        <td className="py-3 text-stone-500">{d.zone}</td>
                        <td className="py-3 font-semibold text-stone-900">{d.totalProblems}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            d.criticalProblems > 20
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}>
                            {d.criticalProblems}
                          </span>
                        </td>
                        <td className="py-3 text-sky-700 font-bold">{d.activeProjects}</td>
                        <td className="py-3 text-emerald-700 font-bold">{(d.citizensImpacted || 12000).toLocaleString()}</td>
                        <td className="py-3 font-bold text-purple-700">{d.csrFunding}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedDistrict(d);
                              setActiveTab('innovation-map');
                            }}
                            className="px-3 py-1 bg-stone-100 hover:bg-emerald-900 hover:text-amber-300 text-stone-800 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          >
                            Inspect 3D
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 12: REPORTS & EXPORTS */}
        {/* ===================================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            
            {/* Top Header */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>State Secretariat Official Documentation Bureau</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  Official Governance Dossiers & Statutory Audits
                </h2>
                <p className="text-xs text-stone-600">
                  Export verified dossiers for District Collectors, State Legislative Assembly, and CSR statutory compliance
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportReport('pdf', 'Statewide_Executive_Summary_Dossier')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate All Dossiers (PDF)</span>
                </button>
              </div>
            </div>

            {/* Dossiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'monthly-dossier',
                  title: 'Monthly Statewide Civic Dossier',
                  desc: 'Complete overview across all 24 districts, resolution rates, student engineering squads, and live prototype IoT telemetry.',
                  badge: 'Monthly Secretariat Report',
                  refId: 'JH-GOV-2026/CIVIC-089',
                  metrics: '24 Districts • 42 Universities • ₹18.4 Cr CSR',
                },
                {
                  id: 'district-triage',
                  title: 'District-wise Severity & Triage Audit',
                  desc: 'Granular block and panchayat level breakdown of drinking water arsenic, solar pump status, and high-urgency handpumps.',
                  badge: 'Statutory District Level',
                  refId: 'JH-GOV-2026/DIST-412',
                  metrics: '384 Triage Directives • 24 DCs Alerted',
                },
                {
                  id: 'csr-audit',
                  title: 'Academic R&D & CSR Utilization Audit',
                  desc: 'Corporate CSR disbursement certificates, university lab telemetry verification, and capstone student project credits.',
                  badge: 'CSR & Academic Accreditation',
                  refId: 'JH-GOV-2026/CSR-901',
                  metrics: '₹18.4 Cr Certified • 1,248 Researchers',
                },
              ].map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        {rep.badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">{rep.refId}</span>
                    </div>

                    <h3 className="text-base font-black text-stone-900">{rep.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{rep.desc}</p>

                    <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-700 font-semibold">
                      {rep.metrics}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleExportReport('pdf', rep.title)}
                      className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview / PDF</span>
                    </button>
                    <button
                      onClick={() => handleExportReport('csv', rep.title)}
                      className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => handleExportReport('json', rep.title)}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      JSON
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Printable Preview Card */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#022c22] text-amber-300 flex items-center justify-center font-extrabold text-xl shadow-sm">
                    🏛️
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                      Government of Jharkhand • State Innovation Mission
                    </div>
                    <h3 className="text-lg font-black text-stone-900">
                      Statewide Civic Telemetry Executive Summary (Dossier Format)
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Document</span>
                </button>
              </div>

              <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Document Number</div>
                    <div className="font-mono font-bold text-stone-900">JH-SEC/2026/CIVIC-089</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Date of Generation</div>
                    <div className="font-bold text-stone-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Authorized Authority</div>
                    <div className="font-bold text-stone-900">Principal Secretary, HED</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Verification Status</div>
                    <div className="font-bold text-emerald-700">Digital Seal Verified ✓</div>
                  </div>
                </div>

                <p>
                  This official executive summary is published under the <strong>Jharkhand Civic Innovation & Quad-Helix Collaboration Policy 2026</strong>. 
                  Across all 24 administrative districts, citizen-reported civic challenges in drinking water, rural electrification, healthcare telemetry, and agricultural supply chain have been matched with 42 accredited universities and sponsored by 42 leading industry CSR partners.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: UNIVERSITIES R&D HUB */}
        {/* ===================================================================== */}
        {activeTab === 'universities' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-700" />
                  <span>Participating Universities & Student Engineering Squads</span>
                </h2>
                <p className="text-xs text-stone-600">
                  42 Accredited Higher Education Institutions across Jharkhand with 1,248 student researchers
                </p>
              </div>
            </div>
            <StudentEngineeringSquadsView />
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: INDUSTRY CSR PARTNERS HUB */}
        {/* ===================================================================== */}
        {activeTab === 'industries' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <span>Industry CSR Co-Funding & Technical Mentorship Network</span>
                </h2>
                <p className="text-xs text-stone-600">
                  Corporate partners co-sponsoring student capstone engineering solutions
                </p>
              </div>
            </div>
            <IndustryPartnersView />
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 8: SOLUTIONS HUB */}
        {/* ===================================================================== */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-emerald-700" />
                  <span>Statewide Verified Solutions & Prototype Registry</span>
                </h2>
                <p className="text-xs text-stone-600">
                  Hardware and software prototypes ready for statewide administrative deployment
                </p>
              </div>
            </div>
            <SolutionsView />
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 11: IMPACT & SUSTAINABILITY HUB */}
        {/* ===================================================================== */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <span>Statewide SDG & Citizen Impact Telemetry</span>
                </h2>
                <p className="text-xs text-stone-600">
                  Verified measurable outcomes across water, health, agriculture and civic sustainability
                </p>
              </div>
            </div>
            <ImpactHubView />
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 13: NOTIFICATIONS HUB */}
        {/* ===================================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-700" />
                  <span>State Secretariat Notifications & Directives</span>
                </h2>
                <p className="text-xs text-stone-600">
                  Real-time problem alerts, high-urgency triage escalations, and DC acknowledgments
                </p>
              </div>
            </div>
            <NotificationsHubView />
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 14: GOVERNMENT PROFILE */}
        {/* ===================================================================== */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#022c22] text-amber-300 flex items-center justify-center font-extrabold text-xl shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-stone-900">Government Secretariat Profile</h2>
                  <p className="text-xs text-stone-500">Authorized Nodal Department & District Administration Settings</p>
                </div>
              </div>
            </div>

            {profileSaved && (
              <div className="p-3.5 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2 border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Government Profile saved successfully to State Civic Command records!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nodal Department</label>
                  <input
                    type="text"
                    disabled
                    value="Department of Higher, Technical Education & Skill Development"
                    className="w-full px-3 py-2.5 bg-stone-100 border border-stone-300 rounded-xl font-semibold text-stone-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Administrative State / Secretariat</label>
                  <input
                    type="text"
                    disabled
                    value="Government of Jharkhand, Project Building, Dhurwa, Ranchi"
                    className="w-full px-3 py-2.5 bg-stone-100 border border-stone-300 rounded-xl font-semibold text-stone-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nodal Officer Name *</label>
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Official Designation *</label>
                  <input
                    type="text"
                    required
                    value={officerDesignation}
                    onChange={(e) => setOfficerDesignation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Official Contact Helpline *</label>
                  <input
                    type="text"
                    required
                    value={officerPhone}
                    onChange={(e) => setOfficerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 font-medium space-y-1">
                <div className="font-bold">Authorized District Jurisdiction:</div>
                <div>All 24 Administrative Districts of Jharkhand under Quad-Helix Innovation Framework.</div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl shadow-sm cursor-pointer transition-all"
                >
                  Save Government Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fallback View for any other remaining tab */}
        {(activeTab === 'projects' || activeTab === 'deployments' || activeTab === 'citizens') && (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-bold">
              🏛️
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 capitalize">
              {activeTab.replace('-', ' ')} Hub
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Statewide administrative command module for governance oversight, deployment approvals, and district analytics.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Back to Command Center Home
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* ESCALATE TO DISTRICT COLLECTOR MODAL */}
      {/* ========================================================================= */}
      {selectedEscalateProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-700" />
                <span>Issue Official Directive / Escalate to DC</span>
              </h3>
              <button
                onClick={() => setSelectedEscalateProblem(null)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitEscalation} className="space-y-4 text-xs">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                <div className="font-bold text-rose-900">{selectedEscalateProblem.title}</div>
                <div className="text-[11px] text-rose-700">
                  Target Authority: <strong>District Magistrate & Collector, {selectedEscalateProblem.district}</strong>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Official Directive Memo *</label>
                <textarea
                  rows={4}
                  required
                  value={escalationMemo}
                  onChange={(e) => setEscalationMemo(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-600/30 font-medium"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600">
                This directive will be registered in the official State Secretariat audit log and notify the Nodal R&D Dean of the nearest university.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEscalateProblem(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Dispatch Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DOSSIER PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-extrabold text-stone-900">{previewReportModal}</h3>
              </div>
              <button
                onClick={() => setPreviewReportModal(null)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <div className="font-extrabold text-stone-900 text-sm">GOVERNMENT OF JHARKHAND</div>
                  <div className="text-[10px] text-stone-500">State Secretariat & District Innovation Command</div>
                </div>
                <div className="text-right font-mono text-[10px] text-stone-500">
                  REF: JH-SEC/2026/CIVIC-089<br />
                  DATE: {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-stone-900">Executive Summary Highlights:</div>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  <li>Total Community Problems Surveyed: <strong>{totalProblemsReported} Issues</strong> across 24 Districts.</li>
                  <li>Critical Urgency Triage: <strong>{criticalCount} Priorities</strong> actively monitored.</li>
                  <li>Academic R&D Throughput: <strong>{activeProjectsCount} Capstone Engineering Squads</strong> active.</li>
                  <li>Statewide Verified Beneficiaries: <strong>{totalCitizensBenefited.toLocaleString()} Citizens</strong>.</li>
                  <li>Total CSR Co-Funding Committed: <strong>₹18.4 Crore</strong> across 42 corporate partners.</li>
                </ul>
              </div>

              <div className="p-3 bg-emerald-100/50 rounded-xl text-emerald-900 font-semibold text-[11px]">
                Statutory Status: Digitally Approved by Principal Secretary, Higher & Technical Education.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setPreviewReportModal(null)}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
