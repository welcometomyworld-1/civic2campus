import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ProblemItem,
  ProjectWorkspaceItem,
  DistrictInfo,
  NotificationItem,
  ProblemDomain,
  PriorityLevel,
  ProblemStatus,
} from '../types';
import {
  INITIAL_PROBLEMS,
  INITIAL_PROJECTS,
  JHARKHAND_DISTRICTS,
  INITIAL_NOTIFICATIONS,
  UNIVERSITIES,
  INDUSTRY_PARTNERS,
} from '../data/mockData';
import { aiService } from '../services/aiService';

interface AppContextType {
  // Navigation & Role
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Active sub-tabs for role dashboards
  universityActiveTab: string;
  setUniversityActiveTab: (tab: string) => void;
  industryActiveTab: string;
  setIndustryActiveTab: (tab: string) => void;
  governmentActiveTab: string;
  setGovernmentActiveTab: (tab: string) => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
  navigateToDashboardTab: (view: string, tab: string) => void;
  
  // Auth state
  isLoggedIn: boolean;
  currentUser: { name: string; email: string; role: UserRole } | null;
  login: (role: UserRole, email: string, name?: string) => void;
  logout: () => void;
  pendingReportIntent: boolean;
  setPendingReportIntent: (intent: boolean) => void;
  openReportProblemSafely: () => void;

  // Data
  problems: ProblemItem[];
  projects: ProjectWorkspaceItem[];
  districts: DistrictInfo[];
  notifications: NotificationItem[];
  selectedProblem: ProblemItem | null;
  setSelectedProblem: (problem: ProblemItem | null) => void;
  selectedProject: ProjectWorkspaceItem | null;
  setSelectedProject: (project: ProjectWorkspaceItem | null) => void;
  selectedDistrict: DistrictInfo | null;
  setSelectedDistrict: (district: DistrictInfo | null) => void;
  
  // Modals & UI States
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Global Stats
  totalCitizensImpacted: number;
  activeProjectsCount: number;
  criticalProblemsCount: number;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;

  // Actions
  reportProblem: (data: {
    title: string;
    description: string;
    category?: string;
    whoIsAffected?: string;
    frequency?: string;
    urgency?: PriorityLevel;
    state?: string;
    district: string;
    block?: string;
    village?: string;
    coordinates?: [number, number];
    imageUrl?: string;
    videoUrl?: string;
    documentUrl?: string;
    supportingNotes?: string;
    previousComplaintNumber?: string;
    population: number;
  }) => Promise<ProblemItem>;
  advanceProjectStage: (projectId: string, targetStage?: ProblemStatus) => void;
  acceptUniversityMatch: (problemId: string, universityId: string) => void;
  joinIndustryCollaboration: (projectId: string, industryId: string) => void;
  generateProposalForProject: (projectId: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, description: string, type?: 'match' | 'progress' | 'deploy' | 'alert' | 'funding') => void;
  resetToInitialDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('c2c_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: UserRole } | null>(() => {
    const saved = localStorage.getItem('c2c_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Determine view and tab from initial URL if provided
  const parseInitialUrl = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/university/industry-partners')) return { view: 'university-dashboard', uTab: 'industry-collab' };
    if (path.includes('/university/collaborations')) return { view: 'university-dashboard', uTab: 'active-collabs' };
    if (path.includes('/university/solutions')) return { view: 'university-dashboard', uTab: 'solutions' };
    if (path.includes('/university/innovation-map')) return { view: 'university-dashboard', uTab: 'map' };
    if (path.includes('/university/impact')) return { view: 'university-dashboard', uTab: 'impact' };
    if (path.includes('/university/notifications')) return { view: 'university-dashboard', uTab: 'notifications' };
    if (path.includes('/university/profile')) return { view: 'university-dashboard', uTab: 'profile' };
    if (path.includes('/university/squads')) return { view: 'university-dashboard', uTab: 'student-teams' };
    if (path.includes('/university')) return { view: 'university-dashboard', uTab: 'overview' };

    // Industry Routes
    if (path.includes('/industry/csr')) return { view: 'industry-dashboard', iTab: 'csr-funding' };
    if (path.includes('/industry/tech-support')) return { view: 'industry-dashboard', iTab: 'tech-support' };
    if (path.includes('/industry/solutions')) return { view: 'industry-dashboard', iTab: 'solutions' };
    if (path.includes('/industry/innovation-map')) return { view: 'industry-dashboard', iTab: 'map' };
    if (path.includes('/industry/impact')) return { view: 'industry-dashboard', iTab: 'impact' };
    if (path.includes('/industry/profile')) return { view: 'industry-dashboard', iTab: 'profile' };
    if (path.includes('/industry/notifications')) return { view: 'industry-dashboard', iTab: 'notifications' };
    if (path.includes('/industry')) return { view: 'industry-dashboard', iTab: 'overview' };

    // Government Routes
    if (path.includes('/government/surveillance') || path.includes('/government/problem-monitoring')) return { view: 'government-dashboard', gTab: 'problem-monitoring' };
    if (path.includes('/government/innovation-map') || path.includes('/government/map')) return { view: 'government-dashboard', gTab: 'innovation-map' };
    if (path.includes('/government/analytics')) return { view: 'government-dashboard', gTab: 'analytics' };
    if (path.includes('/government/reports')) return { view: 'government-dashboard', gTab: 'reports' };
    if (path.includes('/government/universities')) return { view: 'government-dashboard', gTab: 'universities' };
    if (path.includes('/government/industries')) return { view: 'government-dashboard', gTab: 'industries' };
    if (path.includes('/government/projects')) return { view: 'government-dashboard', gTab: 'projects' };
    if (path.includes('/government/solutions')) return { view: 'government-dashboard', gTab: 'solutions' };
    if (path.includes('/government/deployments')) return { view: 'government-dashboard', gTab: 'deployments' };
    if (path.includes('/government/citizens')) return { view: 'government-dashboard', gTab: 'citizens' };
    if (path.includes('/government/impact')) return { view: 'government-dashboard', gTab: 'impact' };
    if (path.includes('/government/notifications')) return { view: 'government-dashboard', gTab: 'notifications' };
    if (path.includes('/government/profile')) return { view: 'government-dashboard', gTab: 'profile' };
    if (path.includes('/government') || path.includes('/command-center')) return { view: 'government-dashboard', gTab: 'overview' };

    if (path.includes('/map')) return { view: 'map', uTab: 'overview' };
    if (path.includes('/problems')) return { view: 'problems', uTab: 'overview' };
    if (path.includes('/login')) return { view: 'login', uTab: 'overview' };
    return null;
  };

  const initialUrlState = parseInitialUrl();

  // Navigation & Role Views
  const [currentView, setCurrentView] = useState<string>(() => {
    if (initialUrlState?.view) return initialUrlState.view;
    const saved = localStorage.getItem('c2c_current_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user?.role === 'university') return 'university-dashboard';
        if (user?.role === 'industry') return 'industry-dashboard';
        if (user?.role === 'government') return 'government-dashboard';
        if (user?.role === 'admin') return 'admin-dashboard';
        if (user?.role === 'citizen') return 'problems';
      } catch (e) {
        // ignore
      }
    }
    return 'home';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('c2c_current_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user?.role) return user.role;
      } catch (e) {
        // ignore
      }
    }
    return 'citizen';
  });

  // Active sub-tabs for role dashboards
  const [universityActiveTab, setUniversityActiveTab] = useState<string>(
    initialUrlState?.uTab || 'overview'
  );
  const [industryActiveTab, setIndustryActiveTab] = useState<string>(
    initialUrlState?.iTab || 'overview'
  );
  const [governmentActiveTab, setGovernmentActiveTab] = useState<string>(
    initialUrlState?.gTab || 'overview'
  );
  const [adminActiveTab, setAdminActiveTab] = useState<string>('overview');

  const navigateToDashboardTab = (view: string, tab: string) => {
    setCurrentView(view);
    if (view === 'university-dashboard') {
      setUniversityActiveTab(tab);
      const subPaths: Record<string, string> = {
        'industry-collab': '/university/industry-partners',
        'active-collabs': '/university/collaborations',
        'solutions': '/university/solutions',
        'map': '/university/innovation-map',
        'impact': '/university/impact',
        'notifications': '/university/notifications',
        'profile': '/university/profile',
        'student-teams': '/university/squads',
      };
      if (subPaths[tab]) {
        window.history.pushState({}, '', subPaths[tab]);
      }
    } else if (view === 'industry-dashboard') {
      setIndustryActiveTab(tab);
      const subPaths: Record<string, string> = {
        'csr-funding': '/industry/csr',
        'tech-support': '/industry/tech-support',
        'solutions': '/industry/solutions',
        'map': '/industry/innovation-map',
        'impact': '/industry/impact',
        'profile': '/industry/profile',
        'notifications': '/industry/notifications',
      };
      if (subPaths[tab]) {
        window.history.pushState({}, '', subPaths[tab]);
      }
    } else if (view === 'government-dashboard' || view === 'command-center') {
      setGovernmentActiveTab(tab);
      const subPaths: Record<string, string> = {
        'problem-monitoring': '/government/surveillance',
        'innovation-map': '/government/innovation-map',
        'analytics': '/government/analytics',
        'reports': '/government/reports',
        'universities': '/government/universities',
        'industries': '/government/industries',
        'projects': '/government/projects',
        'solutions': '/government/solutions',
        'deployments': '/government/deployments',
        'citizens': '/government/citizens',
        'impact': '/government/impact',
        'notifications': '/government/notifications',
        'profile': '/government/profile',
        'overview': '/government',
      };
      if (subPaths[tab]) {
        window.history.pushState({}, '', subPaths[tab]);
      }
    } else if (view === 'admin-dashboard') setAdminActiveTab(tab);
  };

  // Sync browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseInitialUrl();
      if (parsed) {
        setCurrentView(parsed.view);
        if (parsed.uTab) setUniversityActiveTab(parsed.uTab);
        if (parsed.iTab) setIndustryActiveTab(parsed.iTab);
        if (parsed.gTab) setGovernmentActiveTab(parsed.gTab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [pendingReportIntent, setPendingReportIntent] = useState<boolean>(false);

  // Core Data
  const [problems, setProblems] = useState<ProblemItem[]>(() => {
    const saved = localStorage.getItem('c2c_problems');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });

  const [projects, setProjects] = useState<ProjectWorkspaceItem[]>(() => {
    const saved = localStorage.getItem('c2c_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [districts, setDistricts] = useState<DistrictInfo[]>(JHARKHAND_DISTRICTS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('c2c_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [selectedProblem, setSelectedProblem] = useState<ProblemItem | null>(INITIAL_PROBLEMS[0]);
  const [selectedProject, setSelectedProject] = useState<ProjectWorkspaceItem | null>(INITIAL_PROJECTS[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(JHARKHAND_DISTRICTS[0]);

  // Modal UI States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('c2c_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('c2c_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('c2c_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth Functions
  const login = (role: UserRole, email: string, name?: string) => {
    const userObj = {
      name: name || email.split('@')[0],
      email,
      role,
    };
    setIsLoggedIn(true);
    setCurrentUser(userObj);
    setUserRole(role);
    localStorage.setItem('c2c_logged_in', 'true');
    localStorage.setItem('c2c_current_user', JSON.stringify(userObj));

    // If user intended to report a problem before logging in, proceed to report modal
    if (pendingReportIntent) {
      setPendingReportIntent(false);
      setIsAuthModalOpen(false);
      setIsReportModalOpen(true);
    } else {
      // Automatically route directly to stakeholder dashboard
      if (role === 'university') setCurrentView('university-dashboard');
      else if (role === 'industry') setCurrentView('industry-dashboard');
      else if (role === 'government') setCurrentView('government-dashboard');
      else if (role === 'admin') setCurrentView('admin-dashboard');
      else setCurrentView('problems');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole('citizen');
    setCurrentView('home');
    localStorage.removeItem('c2c_logged_in');
    localStorage.removeItem('c2c_current_user');
    addNotification('Logged Out', 'You have been safely signed out.', 'alert');
  };

  const openReportProblemSafely = () => {
    if (isLoggedIn) {
      setIsReportModalOpen(true);
    } else {
      setPendingReportIntent(true);
      setIsAuthModalOpen(true);
      addNotification(
        'Authentication Required',
        'Please sign in or register as a citizen to submit a community problem report.',
        'alert'
      );
    }
  };

  // Calculate live global metrics
  const totalCitizensImpacted = districts.reduce((acc, d) => acc + d.citizensImpacted, 0);
  const activeProjectsCount = projects.length;
  const criticalProblemsCount = problems.filter((p) => p.priority === 'CRITICAL').length;

  const addNotification = (
    title: string,
    description: string,
    type: 'match' | 'progress' | 'deploy' | 'alert' | 'funding' = 'progress'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      description,
      timestamp: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  /**
   * Submit Problem through AI classification & duplicate detection pipeline
   */
  const reportProblem = async (data: {
    title: string;
    description: string;
    category?: string;
    whoIsAffected?: string;
    frequency?: string;
    urgency?: PriorityLevel;
    state?: string;
    district: string;
    block?: string;
    village?: string;
    coordinates?: [number, number];
    imageUrl?: string;
    videoUrl?: string;
    documentUrl?: string;
    supportingNotes?: string;
    previousComplaintNumber?: string;
    population: number;
  }): Promise<ProblemItem> => {
    // 1. AI Classification
    const classification = await aiService.classifyProblem(data.title + ' ' + data.description, data.district);
    
    // 2. Priority Scoring
    const priorityAnalysis = await aiService.analyzePriority(
      data.title + ' ' + data.description,
      classification.domain,
      data.population
    );

    // 3. Duplicate Detection & Clustering
    const duplicateCheck = await aiService.detectDuplicates(data.title, data.description, classification.domain);

    // 4. Match University
    const matchedUnis = aiService.matchUniversities(classification.domain);
    const topUni = matchedUnis[0];

    // 5. Match Industry
    const matchedIndustries = aiService.matchIndustries(classification.domain);
    const topInd = matchedIndustries[0];

    const newProblemId = `CIV-2026-${String(problems.length + 129).padStart(5, '0')}`;

    const effectivePriority = data.urgency || priorityAnalysis.priorityLevel;

    const newProblem: ProblemItem = {
      id: newProblemId,
      title: data.title,
      description: data.description,
      category: data.category || classification.domain,
      whoIsAffected: data.whoIsAffected,
      frequency: data.frequency,
      urgency: effectivePriority,
      state: data.state || 'Jharkhand',
      district: data.district,
      block: data.block || 'Central Block',
      village: data.village || 'Gram Panchayat',
      coordinates: data.coordinates || [23.3441, 85.3096],
      domain: classification.domain,
      subdomain: classification.subdomain,
      priority: effectivePriority,
      priorityScore: priorityAnalysis.priorityScore,
      affectedPopulation: data.population,
      status: 'AI_ANALYZED',
      createdAt: new Date().toISOString(),
      reporterName: currentUser ? currentUser.name : 'Civic Citizen Reporter',
      reporterRole: currentUser ? currentUser.role : 'Citizen',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
      videoUrl: data.videoUrl,
      documentUrl: data.documentUrl,
      supportingNotes: data.supportingNotes,
      previousComplaintNumber: data.previousComplaintNumber,
      clusterId: duplicateCheck.clusterId,
      clusterCount: duplicateCheck.relatedReportsCount,
      clusterAffectedCitizens: duplicateCheck.potentiallyAffectedCitizens,
      matchedUniversityId: topUni?.id,
      matchedUniversityName: topUni?.name,
      matchedUniversityScore: topUni?.matchScore,
      matchedIndustryId: topInd?.id,
      matchedIndustryName: topInd?.name,
      matchedIndustryScore: topInd?.compatibilityScore,
      confidenceScore: classification.confidence,
      aiAnalysisDetails: {
        ...priorityAnalysis.metrics,
        reasoning: priorityAnalysis.reason,
        keyTerms: classification.keywords,
      },
    };

    setProblems((prev) => [newProblem, ...prev]);
    setSelectedProblem(newProblem);

    // Update district metrics
    setDistricts((prev) =>
      prev.map((d) =>
        d.name.toLowerCase() === data.district.toLowerCase() || d.id === data.district.toLowerCase()
          ? {
              ...d,
              totalProblems: d.totalProblems + 1,
              criticalProblems:
                effectivePriority === 'CRITICAL'
                  ? d.criticalProblems + 1
                  : d.criticalProblems,
            }
          : d
      )
    );

    addNotification(
      `New Problem ${newProblemId} AI Analyzed`,
      `Classified as ${classification.domain} (Priority: ${effectivePriority} - ${priorityAnalysis.priorityScore}/100). Matched with ${topUni?.name}.`,
      'match'
    );

    return newProblem;
  };

  /**
   * Accept University Match -> Form Multidisciplinary Team & create Project
   */
  const acceptUniversityMatch = (problemId: string, universityId: string) => {
    const prob = problems.find((p) => p.id === problemId);
    const uni = UNIVERSITIES.find((u) => u.id === universityId);
    if (!prob || !uni) return;

    // Update problem status
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, status: 'TEAM_FORMED' } : p))
    );

    // Check if project exists or create one
    let project = projects.find((pr) => pr.problemId === problemId);
    if (!project) {
      const newProjectId = `PRJ-JH-2026-${String(projects.length + 1).padStart(2, '0')}`;
      project = {
        id: newProjectId,
        title: `${prob.domain} Innovation Initiative for ${prob.district}`,
        problemId: prob.id,
        problemTitle: prob.title,
        district: prob.district,
        domain: prob.domain,
        universityName: uni.name,
        universityId: uni.id,
        facultyLead: 'Dr. Alok K. Verma (BIT Mesra)',
        studentTeamCount: 4,
        currentStage: 'TEAM_FORMED',
        progressPercent: 35,
        solutionTitle: `Automated ${prob.domain} Telemetry & Remediation Unit`,
        techStack: ['IoT ESP32', 'LoRaWAN', 'FastAPI', 'Solar LiFePO4'],
        estimatedCost: '₹3,20,000',
        budgetUtilized: '₹1,00,000',
        citizensTargeted: prob.clusterAffectedCitizens || 2840,
        citizensImpacted: 0,
        liveStatus: 'Research Phase',
        lastUpdated: 'Just now',
        milestones: [
          { stage: 'REPORTED', label: 'Problem Reported', completed: true },
          { stage: 'AI_ANALYZED', label: 'AI Classification & Priority', completed: true },
          { stage: 'MATCHED', label: `University Match (${uni.name})`, completed: true },
          { stage: 'TEAM_FORMED', label: 'Multidisciplinary Team Formed', completed: true },
          { stage: 'PROPOSAL_READY', label: 'AI Proposal Generation', completed: false },
          { stage: 'INDUSTRY_JOINED', label: 'Industry Collaboration', completed: false },
          { stage: 'PROTOTYPE', label: 'Hardware Prototyping', completed: false },
          { stage: 'TESTING', label: 'Field Stress Testing', completed: false },
          { stage: 'PILOT', label: 'Village Pilot Deployment', completed: false },
          { stage: 'DEPLOYED', label: 'State-wide Deployment', completed: false },
          { stage: 'IMPACT_VERIFIED', label: 'Impact Verified & Audited', completed: false },
        ],
      };
      setProjects((prev) => [project!, ...prev]);
    } else {
      setProjects((prev) =>
        prev.map((pr) => (pr.id === project!.id ? { ...pr, currentStage: 'TEAM_FORMED', progressPercent: 35 } : pr))
      );
    }

    setSelectedProject(project);
    addNotification(
      `University Accepted & Team Formed`,
      `${uni.name} formed a 4-member multidisciplinary engineering team for ${prob.title}.`,
      'match'
    );
  };

  /**
   * Industry Partner Joins Project
   */
  const joinIndustryCollaboration = (projectId: string, industryId: string) => {
    const ind = INDUSTRY_PARTNERS.find((i) => i.id === industryId);
    if (!ind) return;

    setProjects((prev) =>
      prev.map((pr) => {
        if (pr.id === projectId) {
          const updatedMilestones = pr.milestones.map((m) =>
            m.stage === 'INDUSTRY_JOINED' ? { ...m, completed: true } : m
          );
          return {
            ...pr,
            industryPartnerName: ind.name,
            industryPartnerId: ind.id,
            currentStage: 'INDUSTRY_JOINED',
            progressPercent: Math.max(pr.progressPercent, 50),
            milestones: updatedMilestones,
          };
        }
        return pr;
      })
    );

    addNotification(
      `Industry Partner Joined`,
      `${ind.name} partnered with project ${projectId} providing ₹1.5L grant and hardware kits.`,
      'funding'
    );
  };

  /**
   * AI Generate Solution Proposal
   */
  const generateProposalForProject = async (projectId: string) => {
    const prj = projects.find((p) => p.id === projectId);
    if (!prj) return;

    const proposal = await aiService.generateSolution(prj.problemTitle, prj.domain, prj.district);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            solutionTitle: proposal.solutionTitle,
            currentStage: 'PROPOSAL_READY',
            progressPercent: 50,
            estimatedCost: proposal.estimatedCost,
            generatedProposal: {
              summary: proposal.expectedImpact,
              architecture: proposal.technology.coreHardware.concat(proposal.technology.softwareStack),
              pilotPhases: proposal.implementationPhases.map((ph) => `${ph.phase}: ${ph.description}`),
              expectedOutcomes: [proposal.expectedImpact, ...proposal.riskMitigation],
              costBreakdown: proposal.budgetBreakdown,
            },
            milestones: p.milestones.map((m) =>
              m.stage === 'PROPOSAL_READY' ? { ...m, completed: true } : m
            ),
          };
        }
        return p;
      })
    );

    addNotification(
      `✨ AI Solution Architecture Generated`,
      `Comprehensive proposal and BOM cost breakdown generated for ${prj.title}.`,
      'progress'
    );
  };

  /**
   * Advance Project through Lifecycle (Prototype -> Testing -> Pilot -> Deployed -> Impact Verified)
   */
  const advanceProjectStage = (projectId: string, targetStage?: ProblemStatus) => {
    const stageOrder: ProblemStatus[] = [
      'REPORTED',
      'AI_ANALYZED',
      'MATCHED',
      'TEAM_FORMED',
      'PROPOSAL_READY',
      'INDUSTRY_JOINED',
      'PROTOTYPE',
      'TESTING',
      'PILOT',
      'DEPLOYED',
      'IMPACT_VERIFIED',
    ];

    setProjects((prev) =>
      prev.map((pr) => {
        if (pr.id === projectId) {
          const currentIdx = stageOrder.indexOf(pr.currentStage);
          const nextStage = targetStage || (currentIdx < stageOrder.length - 1 ? stageOrder[currentIdx + 1] : 'IMPACT_VERIFIED');
          const nextIdx = stageOrder.indexOf(nextStage);
          const progressPercent = Math.min(100, Math.round(((nextIdx + 1) / stageOrder.length) * 100));

          const updatedMilestones = pr.milestones.map((m) => {
            const mIdx = stageOrder.indexOf(m.stage);
            return {
              ...m,
              completed: mIdx <= nextIdx,
            };
          });

          const isNewlyDeployed = nextStage === 'DEPLOYED' || nextStage === 'IMPACT_VERIFIED';
          const updatedImpacted = isNewlyDeployed ? pr.citizensTargeted : pr.citizensImpacted;

          // If deployed, increment district impacted count & active solutions
          if (isNewlyDeployed && pr.currentStage !== 'DEPLOYED' && pr.currentStage !== 'IMPACT_VERIFIED') {
            setDistricts((dPrev) =>
              dPrev.map((d) =>
                d.name.toLowerCase() === pr.district.toLowerCase() || d.id === pr.district.toLowerCase()
                  ? {
                      ...d,
                      citizensImpacted: d.citizensImpacted + pr.citizensTargeted,
                      activeProjects: Math.max(1, d.activeProjects + 1),
                    }
                  : d
              )
            );
          }

          return {
            ...pr,
            currentStage: nextStage,
            progressPercent,
            citizensImpacted: updatedImpacted,
            liveStatus: nextStage === 'DEPLOYED' || nextStage === 'IMPACT_VERIFIED' ? 'Scaling State-wide' : 'Active Testing',
            milestones: updatedMilestones,
          };
        }
        return pr;
      })
    );

    addNotification(
      `Project Advanced to ${targetStage || 'Next Stage'}`,
      `Project ${projectId} progress updated successfully.`,
      'progress'
    );
  };

  const resetToInitialDemo = () => {
    localStorage.removeItem('c2c_problems');
    localStorage.removeItem('c2c_projects');
    localStorage.removeItem('c2c_notifs');
    setProblems(INITIAL_PROBLEMS);
    setProjects(INITIAL_PROJECTS);
    setDistricts(JHARKHAND_DISTRICTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedProblem(INITIAL_PROBLEMS[0]);
    setSelectedProject(INITIAL_PROJECTS[0]);
    setSelectedDistrict(JHARKHAND_DISTRICTS[0]);
    setCurrentView('home');
    setUserRole('citizen');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        universityActiveTab,
        setUniversityActiveTab,
        industryActiveTab,
        setIndustryActiveTab,
        governmentActiveTab,
        setGovernmentActiveTab,
        adminActiveTab,
        setAdminActiveTab,
        navigateToDashboardTab,
        isLoggedIn,
        currentUser,
        login,
        logout,
        pendingReportIntent,
        setPendingReportIntent,
        openReportProblemSafely,
        problems,
        projects,
        districts,
        notifications,
        selectedProblem,
        setSelectedProblem,
        selectedProject,
        setSelectedProject,
        selectedDistrict,
        setSelectedDistrict,
        isReportModalOpen,
        setIsReportModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        totalCitizensImpacted,
        activeProjectsCount,
        criticalProblemsCount,
        demoMode,
        setDemoMode,
        reportProblem,
        advanceProjectStage,
        acceptUniversityMatch,
        joinIndustryCollaboration,
        generateProposalForProject,
        markNotificationRead,
        addNotification,
        resetToInitialDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
