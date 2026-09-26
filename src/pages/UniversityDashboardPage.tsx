import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  Layers,
  FileText,
  FolderGit2,
  Users,
  FlaskConical,
  Building2,
  Handshake,
  Lightbulb,
  MapPin,
  TrendingUp,
  Bell,
  UserCheck,
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Award,
  Zap,
  Activity,
  Cpu,
  Download,
  BookOpen,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UNIVERSITIES, INDUSTRY_PARTNERS } from '../data/mockData';
import { StudentEngineeringSquadsView } from '../components/squads/StudentEngineeringSquadsView';
import { IndustryPartnersView } from '../components/university/IndustryPartnersView';
import { ActiveCollaborationsView } from '../components/university/ActiveCollaborationsView';
import { SolutionsView } from '../components/university/SolutionsView';
import { UniversityInnovationMapView } from '../components/university/UniversityInnovationMapView';
import { ImpactHubView } from '../components/university/ImpactHubView';
import { UniversityProfileView } from '../components/university/UniversityProfileView';
import { NotificationsHubView } from '../components/university/NotificationsHubView';
import { squadService } from '../services/squadService';
import { universityService } from '../services/universityService';
import { SquadSummaryKpis as SquadSummaryKpisType } from '../types/squad';
import { UniversityImpactSummary } from '../types/university';

type UniversityTab =
  | 'overview'
  | 'ai-problems'
  | 'marketplace'
  | 'rnd-briefs'
  | 'my-projects'
  | 'student-teams'
  | 'research'
  | 'industry-collab'
  | 'active-collabs'
  | 'solutions'
  | 'map'
  | 'impact'
  | 'notifications'
  | 'profile';

export const UniversityDashboardPage: React.FC = () => {
  const {
    problems,
    projects,
    notifications,
    currentUser,
    setCurrentView,
    addNotification,
    advanceProjectStage,
    universityActiveTab,
    setUniversityActiveTab,
    navigateToDashboardTab,
  } = useApp();

  const activeTab = (universityActiveTab as UniversityTab) || 'overview';
  const setActiveTab = (tab: UniversityTab) => {
    if (navigateToDashboardTab) {
      navigateToDashboardTab('university-dashboard', tab);
    } else {
      setUniversityActiveTab(tab);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBriefProblem, setSelectedBriefProblem] = useState<any>(null);

  const [squadSummary, setSquadSummary] = useState<SquadSummaryKpisType>({
    total_squads: 3,
    active_squads: 3,
    completed_squads: 0,
    students_participating: 9,
    projects_in_progress: 3,
    field_trials: 2,
    solutions_developed: 1,
  });

  const [impactSummary, setImpactSummary] = useState<UniversityImpactSummary | null>(null);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(2);

  useEffect(() => {
    squadService.getSquadSummary().then((sum) => {
      setSquadSummary(sum);
    });
    universityService.getImpactSummary().then((sum) => {
      setImpactSummary(sum);
    });
    universityService.getUnreadNotificationCount().then((cnt) => {
      setUnreadNotifCount(cnt);
    });
  }, [activeTab]);

  // Student Teams State
  const [teams, setTeams] = useState([
    {
      id: 'team-1',
      name: 'AquaSensors Squad Alpha',
      lead: 'Ankit Tirkey (Final Yr CSE)',
      members: ['Pooja Kumari (ECE)', 'Rahul Munda (Civil)', 'Sneha Hansda (AI/ML)'],
      skills: ['IoT Sensors', 'LoRaWAN', 'Python', 'Hydrology GIS'],
      mentor: 'Dr. Alok Verma (Dept of Env Eng)',
      problem: 'Rural handpump fluorosis & iron contamination in Toto Block, Gumla',
      problemId: 'prob-1',
      progress: 75,
      stage: 'PROTOTYPE',
      fundingReceived: '₹2,50,000 (Tata Steel CSR)',
    },
    {
      id: 'team-2',
      name: 'CleanAir Telemetry Lab',
      lead: 'Shubham Prasad (M.Tech Energy)',
      members: ['Kavita Soren (Chem Eng)', 'Deepak Mahato (Embedded Sys)', 'Rohit Singh (Data Sci)'],
      skills: ['PM2.5 Sensors', 'Edge AI', 'Solar MPPT', 'Dashboard APIs'],
      mentor: 'Prof. Arvind Sharma (Dean R&D)',
      problem: 'Coal dust particulate tracking & automated misting in Dhanbad Mines',
      problemId: 'prob-4',
      progress: 60,
      stage: 'TESTING',
      fundingReceived: '₹4,00,000 (Coal India Green)',
    },
    {
      id: 'team-3',
      name: 'AgriHydro AI Squad',
      lead: 'Rashmi Tirkey (B.Tech Agri Eng)',
      members: ['Vikas Oraon (CSE)', 'Manish Kumar (IoT)', 'Neha Gupta (BioTech)'],
      skills: ['Soil Moisture Telemetry', 'Computer Vision', 'Solar Pumping'],
      mentor: 'Dr. Sunita Murmu (Agri Research)',
      problem: 'Solar micro-irrigation scheduling in Khunti organic vegetable belt',
      problemId: 'prob-3',
      progress: 90,
      stage: 'PILOT',
      fundingReceived: '₹3,20,000 (Jharkhand Agri Directorate)',
    },
  ]);

  const [isCreateSquadModalOpen, setIsCreateSquadModalOpen] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadLead, setNewSquadLead] = useState('');
  const [newSquadSkills, setNewSquadSkills] = useState('');

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;
    const newTeam = {
      id: `team-${Date.now()}`,
      name: newSquadName,
      lead: newSquadLead || 'Student Lead',
      members: ['2 Core Engineers', '1 Domain Analyst'],
      skills: newSquadSkills.split(',').map((s) => s.trim()).filter(Boolean),
      mentor: currentUser?.name || 'Prof. Faculty Mentor',
      problem: 'Open for AI Match selection',
      problemId: 'prob-new',
      progress: 10,
      stage: 'TEAM_FORMED',
      fundingReceived: 'Pending CSR Application',
    };
    setTeams([newTeam, ...teams]);
    setIsCreateSquadModalOpen(false);
    setNewSquadName('');
    setNewSquadLead('');
    setNewSquadSkills('');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    addNotification('Student Squad Formed', `${newTeam.name} is now registered in the R&D matrix.`, 'match');
  };

  // Filter problems for marketplace & recommendations
  const filteredProblems = problems.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory || p.domain === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const aiRecommendedProblems = problems.slice(0, 4).map((p, idx) => ({
    ...p,
    matchScore: 98 - idx * 4,
    compatibilityReason:
      idx === 0
        ? 'High overlap with BIT Mesra Dept of Environmental & IoT Sensor Engineering.'
        : idx === 1
        ? 'Matches Department of Chemical & GIS Remote Sensing capabilities.'
        : 'Aligns with Renewable Energy & Embedded Systems research grant focus.',
    researchQuestion: `How can low-cost telemetry nodes provide early warning for ${p.category} distress in ${p.district}?`,
    requiredSkills: ['IoT Sensor Integration', 'Embedded C/C++', 'Solar Power Systems', 'Data Analytics', 'GIS Mapping'],
    suggestedTech: ['ESP32 / LoRaWAN', 'Cloud MQTT Broker', 'Solar Harvesting Circuit', 'Python Streamlit / FastAPI'],
  }));

  const activeRndBrief = selectedBriefProblem || aiRecommendedProblems[0];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F9F8F6] text-[#141414] flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* DEDICATED UNIVERSITY SIDEBAR (14 SECTIONS) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#06382b] text-emerald-100 flex flex-col border-r border-emerald-950 shrink-0 select-none">
        
        {/* Sidebar University Brand Header */}
        <div className="p-5 border-b border-emerald-900/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black uppercase tracking-widest text-white truncate">
              {currentUser?.name || 'Birla Institute of Tech'}
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>R&D & Incubation Dean</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard },
            { id: 'ai-problems', label: 'AI Recommended Problems', icon: Sparkles, badge: '4 New' },
            { id: 'marketplace', label: 'Problem Marketplace', icon: Layers },
            { id: 'rnd-briefs', label: 'AI Analysis / R&D Briefs', icon: FileText },
            { id: 'my-projects', label: 'My Projects', icon: FolderGit2, badge: `${projects.length}` },
            { id: 'student-teams', label: 'Student Teams', icon: Users, badge: `${teams.length}` },
            { id: 'research', label: 'Research & Labs', icon: FlaskConical },
            { id: 'industry-collab', label: 'Industry Collaboration', icon: Building2 },
            { id: 'active-collabs', label: 'Active Collaborations', icon: Handshake },
            { id: 'solutions', label: 'Solutions & IoT', icon: Lightbulb },
            { id: 'map', label: 'Innovation Map', icon: MapPin },
            { id: 'impact', label: 'Impact Metrics', icon: TrendingUp },
            { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount > 0 ? `${unreadNotifCount} New` : undefined },
            { id: 'profile', label: 'University Profile', icon: UserCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as UniversityTab)}
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
          <div className="text-[10px] text-emerald-300/80 uppercase font-bold mb-1">Statewide Network</div>
          <p className="text-[11px] text-emerald-100/70 mb-2">24 Districts • 42 Universities Connected</p>
          <button
            onClick={() => setCurrentView('map')}
            className="w-full py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Open Statewide 3D Map</span>
            <ExternalLink className="w-3 h-3" />
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
            <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>University Research & Engineering Hub</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome, {currentUser?.name || 'Dean of R&D'}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
                  Transform real community problems across Jharkhand into accredited student capstone projects, funded prototypes, and statewide impact solutions.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => setActiveTab('ai-problems')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-950" />
                    <span>View AI Recommended Problems</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('student-teams')}
                    className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Register New Student Squad</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top 8 Dynamic KPI Cards (Backend Connected) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  Matched Problems
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {impactSummary?.problems_addressed || 24}
                </div>
                <div className="text-[10px] text-amber-700 font-bold mt-0.5">AI Verified</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  Active Projects
                </div>
                <div className="text-2xl font-black text-blue-700">
                  {impactSummary?.projects_completed ? (impactSummary.problems_addressed - impactSummary.projects_completed) : 8}
                </div>
                <div className="text-[10px] text-stone-500 font-bold mt-0.5">Capstone Sprints</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  Student Squads
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {squadSummary.active_squads || 12}
                </div>
                <div className="text-[10px] text-blue-700 font-bold mt-0.5">{squadSummary.students_participating} Engineers</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  Industry Partners
                </div>
                <div className="text-2xl font-black text-emerald-800">
                  5
                </div>
                <div className="text-[10px] text-stone-500 font-bold mt-0.5">CSR & Tech</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  Collaborations
                </div>
                <div className="text-2xl font-black text-emerald-800">
                  7
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Active MoUs</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  Solutions Developed
                </div>
                <div className="text-2xl font-black text-purple-700">
                  {impactSummary?.solutions_developed || 9}
                </div>
                <div className="text-[10px] text-stone-500 font-bold mt-0.5">IP Prototypes</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  Solutions Deployed
                </div>
                <div className="text-2xl font-black text-purple-800">
                  {impactSummary?.solutions_deployed || 3}
                </div>
                <div className="text-[10px] text-purple-700 font-bold mt-0.5">In Field</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
                  People Benefited
                </div>
                <div className="text-2xl font-black text-amber-600">
                  {impactSummary?.people_benefited ? impactSummary.people_benefited.toLocaleString() : '5,400'}
                </div>
                <div className="text-[10px] text-stone-500 font-bold mt-0.5">Direct Citizens</div>
              </div>
            </div>

            {/* Quick Grid: AI Highlights + Active Projects Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Top AI Recommended Problems */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Top AI Recommended Community Problems</span>
                    </h3>
                    <p className="text-xs text-stone-500">Sorted by semantic compatibility with your departments</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('ai-problems')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({aiRecommendedProblems.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {aiRecommendedProblems.slice(0, 3).map((prob) => (
                    <div
                      key={prob.id}
                      className="p-4 rounded-2xl border border-stone-100 hover:border-emerald-500/40 bg-[#FAF9F6] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                              {prob.matchScore}% Match
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700">
                              {prob.urgency} Urgency
                            </span>
                            <span className="text-[11px] text-stone-400">• {prob.district}</span>
                          </div>
                          <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                            {prob.title}
                          </h4>
                          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                            {prob.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 italic truncate max-w-[260px]">
                          💡 {prob.compatibilityReason}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBriefProblem(prob);
                              setActiveTab('rnd-briefs');
                            }}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            R&D Brief
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBriefProblem(prob);
                              setIsCreateSquadModalOpen(true);
                            }}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            Adopt Problem
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Student Squads Status */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Active Student Engineering Squads</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('student-teams')}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-3">
                  {teams.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-stone-900">{t.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {t.stage}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Lead: <strong className="text-stone-800">{t.lead}</strong> • Mentor: {t.mentor}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-stone-600">
                          <span>Milestone Progress</span>
                          <span>{t.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${t.progress}%` }} />
                        </div>
                      </div>
                      <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded">
                        💰 {t.fundingReceived}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: AI RECOMMENDED PROBLEMS */}
        {/* ===================================================================== */}
        {activeTab === 'ai-problems' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>AI Recommended Community Challenges</span>
                </h2>
                <p className="text-xs text-stone-600">
                  Problems evaluated by Gemini 2.5 and ranked by domain match with your faculty expertise & lab capacity.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                  {aiRecommendedProblems.length} High-Affinity Matches
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {aiRecommendedProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-700 to-emerald-900 text-amber-300">
                        {prob.matchScore}% Match Score
                      </span>
                      <span className="text-xs font-bold text-stone-400 uppercase">
                        📍 {prob.district}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900">{prob.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{prob.description}</p>

                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 font-medium">
                      <strong>AI Match Insight:</strong> {prob.compatibilityReason}
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Recommended Student Skills:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prob.requiredSkills.map((sk) => (
                          <span key={sk} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedBriefProblem(prob);
                        setActiveTab('rnd-briefs');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full R&D Brief</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBriefProblem(prob);
                        setIsCreateSquadModalOpen(true);
                      }}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Form Student Squad
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: PROBLEM MARKETPLACE */}
        {/* ===================================================================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900">Statewide Problem Marketplace</h2>
                <p className="text-xs text-stone-600">Browse and adopt verified civic challenges submitted across Jharkhand</p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problems, districts..."
                    className="pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-semibold text-stone-700"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Water Infrastructure">Water</option>
                  <option value="Renewable Energy">Energy</option>
                  <option value="Waste Management">Waste</option>
                  <option value="Agriculture Tech">Agriculture</option>
                  <option value="Public Health">Healthcare</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProblems.map((prob) => (
                <div key={prob.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 uppercase">
                        {prob.category}
                      </span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        {prob.urgency}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-2">{prob.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">{prob.description}</p>
                    <div className="text-[11px] text-stone-400 font-medium">📍 {prob.district} • {prob.population} Citizens Impacted</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedBriefProblem(prob);
                        setActiveTab('rnd-briefs');
                      }}
                      className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Brief
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBriefProblem(prob);
                        setIsCreateSquadModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#06382b] hover:bg-[#04281f] text-amber-300 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Adopt Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: AI ANALYSIS / R&D BRIEFS */}
        {/* ===================================================================== */}
        {activeTab === 'rnd-briefs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <span>AI-Generated Actionable R&D Brief</span>
                </h2>
                <p className="text-xs text-stone-600">
                  Comprehensive academic research & engineering specification generated by Gemini 2.5
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert('R&D Brief exported as academic project proposal draft.');
                  }}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Brief (PDF / LaTeX)</span>
                </button>
              </div>
            </div>

            {/* Brief Main Layout */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="border-b border-stone-200 pb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                    Academic R&D Brief • {activeRndBrief.category}
                  </span>
                  <span className="text-xs text-stone-400 font-bold uppercase">
                    District: {activeRndBrief.district}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900">{activeRndBrief.title}</h1>
              </div>

              {/* 8 Structured Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Problem Statement */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">1. Problem Statement</div>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                    {activeRndBrief.description}
                  </p>
                </div>

                {/* 2. Current Situation */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">2. Current Situation</div>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    Over {activeRndBrief.population || 420} citizens lack real-time telemetry, leading to unnotified infrastructure outages lasting 14+ days.
                  </p>
                </div>

                {/* 3. Research Question */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900">3. Core Research Question</div>
                  <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
                    "{activeRndBrief.researchQuestion || `How can edge-computed IoT sensor telemetry minimize response latency in ${activeRndBrief.district}?`}"
                  </p>
                </div>

                {/* 4. Required Skills */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">4. Required Student Skills</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeRndBrief.requiredSkills?.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-800">
                        {s}
                      </span>
                    )) || <span>Embedded C, LoRaWAN, Python</span>}
                  </div>
                </div>

                {/* 5. Technology Required */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">5. Technology Stack</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeRndBrief.suggestedTech?.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900">
                        {t}
                      </span>
                    )) || <span>ESP32, LoRa Gateway, MongoDB, Next.js</span>}
                  </div>
                </div>

                {/* 6. Expected Impact */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">6. Expected Real Impact</div>
                  <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed">
                    85% reduction in repair turnaround, saving 12,000+ liters of potable water weekly for rural families.
                  </p>
                </div>

              </div>

              {/* Bottom CTA */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  Assigned Department: Environmental & Sensor Informatics Lab (BIT Mesra)
                </span>
                <button
                  onClick={() => setIsCreateSquadModalOpen(true)}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Form Student Squad for this Brief
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: MY PROJECTS */}
        {/* ===================================================================== */}
        {activeTab === 'my-projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900">University R&D Projects</h2>
                <p className="text-xs text-stone-600">Track milestones from initial prototype to statewide deployment</p>
              </div>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{proj.domain} • {proj.district}</div>
                      <h3 className="text-lg font-black text-stone-900">{proj.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-extrabold text-xs border border-blue-200">
                      Stage: {proj.currentStage}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{proj.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2.5 bg-stone-50 rounded-xl text-center">
                      <div className="text-[10px] text-stone-400 font-bold uppercase">Squad Lead</div>
                      <div className="text-xs font-bold text-stone-800">{proj.teamLead}</div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl text-center">
                      <div className="text-[10px] text-stone-400 font-bold uppercase">Faculty Mentor</div>
                      <div className="text-xs font-bold text-stone-800">{proj.facultyMentor}</div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl text-center">
                      <div className="text-[10px] text-stone-400 font-bold uppercase">Industry Partner</div>
                      <div className="text-xs font-bold text-stone-800">{proj.industryPartner}</div>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-center">
                      <div className="text-[10px] text-emerald-700 font-bold uppercase">Grant Allocated</div>
                      <div className="text-xs font-black text-emerald-900">{proj.budgetAllocated}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">Live Telemetry Node: Active</span>
                    <button
                      onClick={() => {
                        advanceProjectStage(proj.id);
                        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                      }}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      Advance Project Milestone
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: STUDENT TEAMS */}
        {/* ===================================================================== */}
        {activeTab === 'student-teams' && (
          <StudentEngineeringSquadsView />
        )}

        {/* ===================================================================== */}
        {/* TAB 8: INDUSTRY COLLABORATION & CSR PARTNERS */}
        {/* ===================================================================== */}
        {activeTab === 'industry-collab' && (
          <IndustryPartnersView />
        )}

        {/* ===================================================================== */}
        {/* TAB 9: ACTIVE COLLABORATIONS */}
        {/* ===================================================================== */}
        {activeTab === 'active-collabs' && (
          <ActiveCollaborationsView />
        )}

        {/* ===================================================================== */}
        {/* TAB 10: SOLUTIONS & PROTOTYPES */}
        {/* ===================================================================== */}
        {activeTab === 'solutions' && (
          <SolutionsView />
        )}

        {/* ===================================================================== */}
        {/* TAB 11: INNOVATION MAP */}
        {/* ===================================================================== */}
        {activeTab === 'map' && (
          <UniversityInnovationMapView />
        )}

        {/* ===================================================================== */}
        {/* TAB 12: IMPACT METRICS */}
        {/* ===================================================================== */}
        {activeTab === 'impact' && (
          <ImpactHubView />
        )}

        {/* ===================================================================== */}
        {/* TAB 13: NOTIFICATIONS */}
        {/* ===================================================================== */}
        {activeTab === 'notifications' && (
          <NotificationsHubView />
        )}

        {/* ===================================================================== */}
        {/* TAB 14: UNIVERSITY PROFILE */}
        {/* ===================================================================== */}
        {activeTab === 'profile' && (
          <UniversityProfileView />
        )}

        {/* Research Tab */}
        {activeTab === 'research' && (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900">University Research Laboratories & Grants</h2>
                <p className="text-xs text-stone-500">Accredited R&D facilities supporting Jharkhand student capstone projects</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <FlaskConical className="w-6 h-6 text-emerald-700" />
                <div className="font-bold text-stone-900">IoT & Smart Embedded Systems Lab</div>
                <p className="text-xs text-stone-600">LoRaWAN gateway calibration, ESP32 edge AI testbenches, and environmental sensor verification.</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <Cpu className="w-6 h-6 text-blue-700" />
                <div className="font-bold text-stone-900">Clean Energy & Solar MPPT Facility</div>
                <p className="text-xs text-stone-600">Phase-change thermal storage and micro-solar inverter testing for off-grid rural telemetry.</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <Sparkles className="w-6 h-6 text-purple-700" />
                <div className="font-bold text-stone-900">GIS & Remote Sensing Center</div>
                <p className="text-xs text-stone-600">Geospatial satellite telemetry mapping for groundwater table monitoring across Jharkhand districts.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* SQUAD REGISTRATION MODAL */}
      {/* ========================================================================= */}
      {isCreateSquadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Register Student Squad</span>
              </h3>
              <button
                onClick={() => setIsCreateSquadModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Squad Name *</label>
                <input
                  type="text"
                  required
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. IoT HydroSensors Squad"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Student Squad Leader *</label>
                <input
                  type="text"
                  required
                  value={newSquadLead}
                  onChange={(e) => setNewSquadLead(e.target.value)}
                  placeholder="e.g. Ankit Tirkey (Final Yr CSE)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Member Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newSquadSkills}
                  onChange={(e) => setNewSquadSkills(e.target.value)}
                  placeholder="e.g. IoT, LoRaWAN, Python, GIS, CAD"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 font-medium">
                Accredited for 6-month Final Year Project credits under State Innovation Policy.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateSquadModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Register Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
