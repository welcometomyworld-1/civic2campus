export type CSRSupportType =
  | 'CSR'
  | 'FUNDING'
  | 'INFRASTRUCTURE'
  | 'TRAINING'
  | 'COMMUNITY_PROGRAM'
  | 'R&D';

export type CSRStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMMITTED'
  | 'RELEASED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CSRFundingItem {
  id: string;
  funding_id: string;
  industry_id: string;
  industry_name: string;
  project_id: string;
  project_name: string;
  problem_id: string;
  problem_name: string;
  problem_category?: string;
  university_id: string;
  university_name: string;
  amount: number;
  amount_released?: number;
  support_type: CSRSupportType;
  purpose: string;
  status: CSRStatus;
  funding_date: string;
  notes?: string;
  milestones?: {
    id: string;
    title: string;
    amount_allocated?: number;
    due_date?: string;
    completed: boolean;
  }[];
  impact?: {
    people_benefited: number;
    area_covered: string;
    environmental_benefit?: string;
  };
  deployment_location?: string;
  documents?: {
    id: string;
    name: string;
    url: string;
    uploaded_at: string;
  }[];
  activity_timeline?: {
    action: string;
    by: string;
    timestamp: string;
    details?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CSRSummaryMetrics {
  total_csr_commitment: number;
  amount_released: number;
  amount_remaining: number;
  projects_funded: number;
  active_csr_projects: number;
  completed_csr_projects: number;
  people_benefited: number;
  areas_covered: number;
}

export type TechSupportType =
  | 'Software'
  | 'Hardware'
  | 'AI/ML'
  | 'IoT'
  | 'Cloud'
  | 'Cybersecurity'
  | 'Data Analytics'
  | 'Infrastructure'
  | 'Testing'
  | 'Technical Mentorship'
  | 'Training'
  | 'R&D';

export type TechSupportStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TechSupportItem {
  id: string;
  support_id: string;
  industry_id: string;
  industry_name: string;
  project_id: string;
  project_name: string;
  university_id: string;
  university_name: string;
  student_squad_name?: string;
  student_squad_id?: string;
  support_type: TechSupportType;
  technology: string[];
  description: string;
  assigned_expert?: string;
  assigned_expert_title?: string;
  assigned_expert_email?: string;
  start_date: string;
  target_date: string;
  status: TechSupportStatus;
  progress: number;
  tasks?: {
    id: string;
    title: string;
    assigned_to?: string;
    completed: boolean;
    due_date?: string;
  }[];
  documents?: {
    id: string;
    name: string;
    url: string;
    uploaded_at: string;
  }[];
  activity_timeline?: {
    action: string;
    by: string;
    timestamp: string;
    details?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export type IndustrySolutionStatus =
  | 'PROTOTYPE'
  | 'TESTING'
  | 'APPROVED'
  | 'DEPLOYED'
  | 'FAILED'
  | 'ARCHIVED';

export interface IndustrySolutionItem {
  id: string;
  solution_name: string;
  problem_id: string;
  problem_name: string;
  problem_category?: string;
  ai_rd_brief?: string;
  project_id?: string;
  project_name?: string;
  university_id?: string;
  university_name?: string;
  student_squad?: string;
  industry_id?: string;
  industry_name?: string;
  industry_contribution?: string;
  technology: string[];
  status: IndustrySolutionStatus;
  deployment_location?: string;
  deployment_date?: string;
  people_benefited: number;
  area_covered?: string;
  prototype_details?: string;
  testing_runs?: {
    id: string;
    date: string;
    tested_by: string;
    parameters: string;
    result: 'PASS' | 'FAIL' | 'IN_PROGRESS';
    notes: string;
  }[];
  field_trials?: {
    id: string;
    location: string;
    date: string;
    outcomes: string;
  }[];
  documents?: {
    id: string;
    name: string;
    url: string;
    uploaded_at: string;
  }[];
  activity_timeline?: {
    action: string;
    by: string;
    timestamp: string;
    details?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface IndustryImpactSummary {
  projects_supported: number;
  problems_addressed: number;
  solutions_supported: number;
  solutions_deployed: number;
  people_benefited: number;
  areas_covered: number;
  csr_funding_total: number;
  csr_funding_disbursed: number;
  universities_supported: number;
  technical_support_delivered: number;
  cost_saved: string;
  time_saved: string;
  problem_resolution_rate: number;
  environmental_impact_score: string;
  education_impact_score: string;
  healthcare_impact_score: string;
  community_feedback_rating: number;
}

export interface IndustryImpactChartData {
  projects_over_time: { month: string; projects: number; funding_lakhs: number }[];
  solutions_by_status: { name: string; value: number; color: string }[];
  people_benefited_trend: { month: string; citizens: number }[];
  csr_by_project: { project: string; pledged: number; disbursed: number }[];
  impact_by_category: { category: string; count: number; score: number }[];
  geographic_distribution: { district: string; projects: number; beneficiaries: number }[];
  university_support_breakdown: { university: string; projects: number; funding: number }[];
  tech_support_breakdown: { type: string; count: number }[];
}

export interface IndustryProfile {
  id: string;
  company_name: string;
  company_logo?: string;
  official_email: string;
  phone?: string;
  website?: string;
  description?: string;
  industry_type: string;
  contact_person: string;
  designation: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  expertise: string[];
  technical_skills?: string[];
  technologies: string[];
  research_areas?: string[];
  domains?: string[];
  specializations?: string[];
  csr_focus_areas: string[];
  csr_categories?: string[];
  csr_support?: string[];
  preferred_causes?: string[];
  support_available: string[];
  preferred_project_categories: string[];
  preferred_locations: string[];
  preferred_research_domains?: string[];
  preferred_technology_areas?: string[];
  is_verified?: boolean;
  verification_status?: string;
  created_at?: string;
  updated_at?: string;
}
