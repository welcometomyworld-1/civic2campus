export interface IndustryPartner {
  id: string;
  name: string;
  company_name: string;
  logo?: string;
  industry_type: string;
  csr_focus: string;
  expertise: string[];
  technologies: string[];
  support_available: string[];
  location: string;
  city: string;
  state: string;
  contact_person: string;
  designation: string;
  email: string;
  phone: string;
  collaboration_count: number;
  supported_projects_count: number;
  active_funding?: string;
  status: string;
  is_verified: boolean;
  supported_projects?: Array<{
    id: string;
    title: string;
    domain: string;
    stage: string;
    budget: string;
  }>;
}

export interface UniversityCollaboration {
  id: string;
  title: string;
  problem_id: string;
  problem_title: string;
  problem_category: string;
  university_id: string;
  university_name: string;
  industry_id: string;
  industry_name: string;
  student_squad_name: string;
  mentor: string;
  start_date: string;
  deadline: string;
  target_date?: string;
  progress: number;
  current_phase: string;
  status: 'REQUESTED' | 'APPROVED' | 'ACTIVE' | 'PROTOTYPE' | 'TESTING' | 'COMPLETED' | 'DEPLOYED' | 'CANCELLED';
  last_updated: string;
  members_count?: number;
  description?: string;
  members?: Array<{
    name: string;
    role: string;
    institution: string;
    email?: string;
  }>;
  milestones?: Array<{
    milestone_id: string;
    title: string;
    description?: string;
    due_date?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    progress: number;
  }>;
  tasks?: Array<{
    task_id: string;
    title: string;
    assigned_to: string;
    priority: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  }>;
  documents?: Array<{
    doc_id: string;
    name: string;
    file_type: string;
    upload_date: string;
    version: string;
  }>;
  activity_timeline?: Array<{
    event_id: string;
    date: string;
    user: string;
    action: string;
    description: string;
  }>;
}

export interface UniversitySolution {
  id: string;
  title: string;
  description?: string;
  problem_id: string;
  problem_title: string;
  project_id: string;
  project_name: string;
  collaboration_name: string;
  technology: string[];
  development_team: string;
  solution_type?: string;
  status?: 'PROTOTYPE' | 'TESTING' | 'APPROVED' | 'DEPLOYED' | 'FAILED' | 'ARCHIVED' | string;
  current_status?: 'PROTOTYPE' | 'TESTING' | 'APPROVED' | 'DEPLOYED' | 'FAILED' | 'ARCHIVED' | string;
  progress: number;
  deployment_location: string;
  deployment_date: string;
  people_benefited: number;
  last_updated?: string;
  test_records?: Array<{
    test_id: string;
    location: string;
    date: string;
    result: string;
    status: string;
  }>;
  testing_runs?: Array<{
    run_id?: string;
    test_date: string;
    location: string;
    result: string;
    metrics_observed?: string;
    notes?: string;
  }>;
}

export interface UniversityImpactSummary {
  problems_addressed: number;
  projects_completed: number;
  solutions_developed: number;
  solutions_deployed: number;
  student_squads_active: number;
  people_benefited: number;
  areas_covered: number;
  cost_saved: string;
  co2_reduced_tons?: number;
  potable_water_saved_liters?: number;
  problems_by_category?: Array<{ category: string; count: number }>;
  projects_by_status?: Array<{ status: string; count: number }>;
  solutions_by_status?: Array<{ status: string; count: number }>;
  deployment_by_location?: Array<{ location: string; count: number }>;
  impact_timeline?: Array<{ month: string; benefited: number }>;
}

export interface UniversityProfile {
  id?: string;
  name: string;
  organization_name?: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  university_logo?: string;
  description?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  departments: string[];
  courses?: string[];
  research_areas?: string[];
  research_domains: string[];
  technical_expertise?: string[];
  engineering_domains?: string[];
  research_skills?: string[];
  laboratories: string[];
  research_centers?: string[];
  infrastructure?: string[];
  equipment: string[];
  industry_collaboration_areas?: string[];
  government_collaboration?: string[];
  student_innovation?: string;
  research_support?: string;
  contact_person?: string;
  designation?: string;
}

export interface UniversityNotificationItem {
  id: string;
  type: 'match' | 'collaboration' | 'milestone' | 'progress' | 'deploy' | 'alert' | 'funding' | string;
  title: string;
  message: string;
  related_id?: string;
  related_type?: string;
  read?: boolean;
  is_read?: boolean;
  created_at: string;
}
