export type SquadStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'DISBANDED';

export type SquadPhase =
  | 'PROBLEM_ANALYSIS'
  | 'RESEARCH'
  | 'DESIGN'
  | 'PROTOTYPE'
  | 'TESTING'
  | 'FIELD_TRIAL'
  | 'DEPLOYMENT'
  | 'COMPLETED';

export type StudentRole =
  | 'TEAM_LEADER'
  | 'DEVELOPER'
  | 'RESEARCHER'
  | 'DESIGNER'
  | 'DATA_ANALYST'
  | 'DOMAIN_SPECIALIST'
  | 'FIELD_COORDINATOR'
  | 'OTHER';

export type SquadMilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export type SquadTaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SquadTaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';

export type IndustrySupportType =
  | 'TECHNOLOGY'
  | 'MENTORSHIP'
  | 'FUNDING'
  | 'CSR'
  | 'INFRASTRUCTURE'
  | 'R&D'
  | 'TRAINING';

export type FieldTestStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface SquadMember {
  student_id: string;
  name: string;
  email?: string;
  department: string;
  year: number;
  skills: string[];
  role: StudentRole;
  current_task?: string;
  task_status?: string;
  avatar_url?: string;
}

export interface SquadMilestone {
  id?: string;
  title: string;
  description?: string;
  due_date?: string;
  responsible_member?: string;
  status: SquadMilestoneStatus;
  progress: number;
  completed_at?: string;
}

export interface SquadTask {
  id?: string;
  title: string;
  description?: string;
  assigned_member?: string;
  priority: SquadTaskPriority;
  due_date?: string;
  status: SquadTaskStatus;
}

export interface SquadDocumentItem {
  id?: string;
  name: string;
  type: string;
  uploaded_by?: string;
  upload_date?: string;
  version: string;
  url?: string;
}

export interface FieldTestRecord {
  id?: string;
  location: string;
  date: string;
  objective: string;
  participants: string[];
  observed_results?: string;
  issues_found?: string;
  feedback?: string;
  photos_videos?: string[];
  status: FieldTestStatus;
}

export interface SquadImpactRecord {
  people_benefited: number;
  area_covered?: string;
  problem_resolution_percentage: number;
  cost_saved?: string;
  time_saved?: string;
  environmental_impact?: string;
  community_feedback?: string;
  deployment_date?: string;
}

export interface SquadActivityItem {
  id?: string;
  date: string;
  user: string;
  action: string;
  description: string;
}

export interface StudentSquad {
  _id?: string;
  squad_id: string;
  name: string;
  description?: string;

  project_name?: string;
  project_id?: string;
  problem_id?: string;
  problem_title?: string;
  problem_category?: string;
  problem_location?: string;
  problem_priority?: string;
  ai_match_score?: number;
  ai_analysis_id?: string;

  team_leader_id?: string;
  team_leader_name?: string;

  members: SquadMember[];
  max_team_size: number;

  faculty_mentor_id?: string;
  faculty_mentor_name?: string;
  faculty_mentor_email?: string;
  faculty_mentor_department?: string;

  industry_partner_id?: string;
  industry_partner_name?: string;
  industry_partner_mentor?: string;
  industry_partner_designation?: string;
  industry_partner_email?: string;
  industry_support_type?: string;
  funding_received?: string;

  government_partner?: string;
  external_mentor?: string;

  department?: string;
  course?: string;
  year?: number;

  research_area?: string;
  technologies: string[];
  objectives: string[];
  expected_outcome?: string;

  current_phase: SquadPhase;
  progress: number;
  status: SquadStatus;

  start_date?: string;
  target_date?: string;

  milestones: SquadMilestone[];
  tasks: SquadTask[];
  documents: SquadDocumentItem[];
  field_testing: FieldTestRecord[];
  impact?: SquadImpactRecord;
  activity_timeline: SquadActivityItem[];

  problem_detail?: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    urgency: string;
    ai_analysis?: any;
  };

  created_at?: string;
  updated_at?: string;
}

export interface SquadSummaryKpis {
  total_squads: number;
  active_squads: number;
  completed_squads: number;
  students_participating: number;
  projects_in_progress: number;
  field_trials: number;
  solutions_developed: number;
}
