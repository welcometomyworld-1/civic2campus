export type UserRole = 'citizen' | 'university' | 'industry' | 'government' | 'admin';

export type ProblemDomain = 
  | 'Water'
  | 'Healthcare'
  | 'Agriculture'
  | 'Education'
  | 'Sanitation'
  | 'Environment'
  | 'Infrastructure'
  | 'Transportation'
  | 'Energy'
  | 'Livelihood';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ProblemStatus = 
  | 'REPORTED'
  | 'AI_ANALYZED'
  | 'MATCHED'
  | 'TEAM_FORMED'
  | 'PROPOSAL_READY'
  | 'INDUSTRY_JOINED'
  | 'PROTOTYPE'
  | 'TESTING'
  | 'PILOT'
  | 'DEPLOYED'
  | 'IMPACT_VERIFIED';

export interface DistrictInfo {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng] for Jharkhand projection
  x: number; // 3D canvas coordinate
  z: number;
  totalProblems: number;
  criticalProblems: number;
  activeProjects: number;
  citizensImpacted: number;
  universitiesCount: number;
  industryPartnersCount: number;
  topChallenges: string[];
  aiInsight: string;
  polygonPoints?: [number, number][]; // 2D polygon normalized coordinates for 3D extrusion
}

export interface ProblemItem {
  id: string; // e.g. "CIV-2026-00128"
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
  domain: ProblemDomain;
  subdomain: string;
  priority: PriorityLevel;
  priorityScore: number; // 0-100
  affectedPopulation: number;
  status: ProblemStatus;
  createdAt: string;
  reporterName?: string;
  reporterRole?: string;
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  supportingNotes?: string;
  previousComplaintNumber?: string;
  clusterId?: string; // e.g. "WTR-102"
  clusterCount?: number;
  clusterAffectedCitizens?: number;
  matchedUniversityId?: string;
  matchedUniversityName?: string;
  matchedUniversityScore?: number;
  matchedIndustryId?: string;
  matchedIndustryName?: string;
  matchedIndustryScore?: number;
  assignedProjectId?: string;
  confidenceScore: number; // e.g. 94%
  aiAnalysisDetails?: {
    urgency: number;
    populationImpact: number;
    healthImpact: number;
    safetyImpact: number;
    economicImpact: number;
    environmentalImpact: number;
    durationImpact: number;
    reasoning: string;
    keyTerms: string[];
  };
}

export interface UniversityItem {
  id: string;
  name: string;
  code: string;
  location: string;
  district: string;
  established: number;
  ranking: string;
  specializations: string[];
  facultyCount: number;
  studentsCount: number;
  activeProjects: number;
  deployedSolutions: number;
  matchScore?: number;
  strongDepartments: string[];
  existingResearch: string[];
  avatarUrl?: string;
  badge?: string;
}

export interface FacultyProfile {
  id: string;
  name: string;
  universityId: string;
  universityName: string;
  department: string;
  title: string;
  expertise: string[];
  activeProjectsCount: number;
  patentsCount: number;
  avatarUrl: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  universityId: string;
  universityName: string;
  branch: string;
  year: string;
  skills: string[];
  role: 'Frontend' | 'AI/ML' | 'IoT' | 'Data Analytics' | 'Embedded Systems' | 'Field Ops';
  avatarUrl: string;
}

export interface IndustryPartnerItem {
  id: string;
  name: string;
  category: 'Corporate CSR' | 'DeepTech Startup' | 'AgriTech Enterprise' | 'CleanTech' | 'Healthcare Provider';
  districtHeadquarters: string;
  compatibilityScore?: number;
  focusAreas: string[];
  technologies: string[];
  csrCommitment: string;
  activeProjectsSupported: number;
  logoUrl?: string;
  description: string;
}

export interface ProjectWorkspaceItem {
  id: string;
  title: string;
  problemId: string;
  problemTitle: string;
  district: string;
  domain: ProblemDomain;
  universityName: string;
  universityId: string;
  industryPartnerName?: string;
  industryPartnerId?: string;
  facultyLead: string;
  studentTeamCount: number;
  currentStage: ProblemStatus;
  progressPercent: number;
  solutionTitle: string;
  techStack: string[];
  hardwareSpecs?: string[];
  estimatedCost: string;
  budgetUtilized: string;
  citizensTargeted: number;
  citizensImpacted: number;
  sensorFeedUrl?: string;
  liveStatus: 'Active Testing' | 'Pilot Deployment' | 'Scaling State-wide' | 'Research Phase';
  lastUpdated: string;
  milestones: {
    stage: ProblemStatus;
    label: string;
    completed: boolean;
    date?: string;
    details?: string;
  }[];
  generatedProposal?: {
    summary: string;
    architecture: string[];
    pilotPhases: string[];
    expectedOutcomes: string[];
    costBreakdown: { item: string; cost: string }[];
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'match' | 'progress' | 'deploy' | 'alert' | 'funding';
  read: boolean;
  linkUrl?: string;
}

export interface FilterOptions {
  district: string;
  domain: string;
  priority: string;
  status: string;
  searchQuery: string;
}
