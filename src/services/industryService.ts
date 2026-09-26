import {
  CSRFundingItem,
  CSRSummaryMetrics,
  TechSupportItem,
  IndustrySolutionItem,
  IndustryImpactSummary,
  IndustryImpactChartData,
  IndustryProfile,
} from '../types/industry';

const API_BASE = '/api/industry';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('c2c_token') || localStorage.getItem('access_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const industryService = {
  // ---------------------------------------------------------------------------
  // 1. CSR FUNDING HUB
  // ---------------------------------------------------------------------------
  async getCSRSummary(): Promise<CSRSummaryMetrics> {
    try {
      const res = await fetch(`${API_BASE}/csr/summary`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch CSR summary');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback CSR summary:', e);
      return {
        total_csr_commitment: 1270000,
        amount_released: 850000,
        amount_remaining: 420000,
        projects_funded: 4,
        active_csr_projects: 3,
        completed_csr_projects: 1,
        people_benefited: 5900,
        areas_covered: 5,
      };
    }
  },

  async listCSRFundings(params?: {
    status?: string;
    support_type?: string;
    project?: string;
    search?: string;
  }): Promise<{ total: number; items: CSRFundingItem[] }> {
    try {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') q.append('status', params.status);
      if (params?.support_type && params.support_type !== 'ALL') q.append('support_type', params.support_type);
      if (params?.project) q.append('project', params.project);
      if (params?.search) q.append('search', params.search);

      const res = await fetch(`${API_BASE}/csr?${q.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch CSR fundings');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback CSR fundings:', e);
      return {
        total: 3,
        items: [
          {
            id: 'csr-1',
            funding_id: 'CSR-2026-TATA01',
            industry_id: 'seed_tata_steel',
            industry_name: 'Tata Steel CSR Foundation',
            project_id: 'proj-101',
            project_name: 'Smart Groundwater Desalination & Iron Filter (Toto Block)',
            problem_id: 'prob-101',
            problem_name: 'High Iron & Heavy Metal Contamination in Village Borewells',
            problem_category: 'Water & Sanitation',
            university_id: 'seed_bit_mesra',
            university_name: 'BIT Mesra',
            amount: 350000,
            amount_released: 250000,
            support_type: 'CSR',
            purpose: 'Hardware sensor procurement & solar inverter telemetry grant',
            status: 'COMMITTED',
            funding_date: '2026-05-15',
            notes: 'Tranche 1 (₹2.5L) released upon successful lab validation.',
            milestones: [
              { id: 'm1', title: 'Lab filtration unit bench test', amount_allocated: 150000, due_date: '2026-06-30', completed: true },
              { id: 'm2', title: 'Field LoRa sensor deployment', amount_allocated: 100000, due_date: '2026-08-15', completed: true },
              { id: 'm3', title: 'Community handover & quality signoff', amount_allocated: 100000, due_date: '2026-10-31', completed: false }
            ],
            impact: {
              people_benefited: 1240,
              area_covered: 'Toto Block, Gumla',
              environmental_benefit: 'Zero power battery buffer with solar charging'
            },
            deployment_location: 'Toto Block, Gumla District',
            documents: [
              { id: 'd1', name: 'Sanction_Letter_Signed.pdf', url: '/uploads/Sanction_Letter.pdf', uploaded_at: '2026-05-15T10:00:00Z' }
            ],
            activity_timeline: [
              { action: 'CSR Grant Approved', by: 'Tata Steel CSR Committee', timestamp: '2026-05-15T10:00:00Z', details: 'Approved ₹3,50,000' },
              { action: 'Tranche 1 Disbursed', by: 'Accounts Dept', timestamp: '2026-06-01T11:30:00Z', details: '₹2,50,000 wired to BIT Mesra R&D cell' }
            ],
            created_at: '2026-05-15T10:00:00Z',
            updated_at: '2026-08-15T14:00:00Z'
          },
          {
            id: 'csr-2',
            funding_id: 'CSR-2026-CIL02',
            industry_id: 'seed_coal_india',
            industry_name: 'Coal India Innovation CSR',
            project_id: 'proj-102',
            project_name: 'Particulate Matter & Misting Telemetry Node (Dhanbad Mines)',
            problem_id: 'prob-102',
            problem_name: 'Coal Dust Inhalation in Mining Periphery Villages',
            problem_category: 'Clean Air & Environment',
            university_id: 'seed_iit_dhanbad',
            university_name: 'IIT (ISM) Dhanbad',
            amount: 500000,
            amount_released: 400000,
            support_type: 'FUNDING',
            purpose: 'Automated high-pressure misting cannon with PM2.5 threshold trigger',
            status: 'RELEASED',
            funding_date: '2026-04-10',
            notes: 'Co-funded under Ministry of Coal R&D matching grant scheme.',
            milestones: [
              { id: 'm1', title: 'Dust chamber optical sensor calibration', amount_allocated: 200000, due_date: '2026-05-30', completed: true },
              { id: 'm2', title: 'Mining perimeter node installations', amount_allocated: 200000, due_date: '2026-07-31', completed: true }
            ],
            impact: {
              people_benefited: 3800,
              area_covered: 'Jharia & Katras, Dhanbad',
              environmental_benefit: '64% reduction in peak PM10 levels during coal haulage'
            },
            deployment_location: 'Katras Mining Belt, Dhanbad',
            documents: [],
            activity_timeline: [],
            created_at: '2026-04-10T09:00:00Z',
            updated_at: '2026-07-31T16:00:00Z'
          },
          {
            id: 'csr-3',
            funding_id: 'CSR-2026-USHA03',
            industry_id: 'seed_usha_martin',
            industry_name: 'Usha Martin Foundation',
            project_id: 'proj-103',
            project_name: 'Solar Cold-Storage Telemetry for Tribal Farmers (Khunti)',
            problem_id: 'prob-103',
            problem_name: 'Post-Harvest Vegetable Spoilage in Off-Grid Weekly Markets',
            problem_category: 'Agriculture & Cold Chain',
            university_id: 'seed_bau_ranchi',
            university_name: 'Birla Agricultural University',
            amount: 420000,
            amount_released: 420000,
            support_type: 'CSR',
            purpose: '100% solar powered thermal storage chamber with remote temperature alerts',
            status: 'COMPLETED',
            funding_date: '2026-03-01',
            notes: 'Full grant released. Successfully operating in Torpa Block.',
            milestones: [
              { id: 'm1', title: 'Phase change material thermal test', amount_allocated: 200000, due_date: '2026-04-15', completed: true },
              { id: 'm2', title: 'Village farmer cooperative handover', amount_allocated: 220000, due_date: '2026-06-15', completed: true }
            ],
            impact: {
              people_benefited: 860,
              area_covered: 'Torpa & Murhu, Khunti',
              environmental_benefit: 'Zero grid power dependency, 92% reduction in tomato spoilage'
            },
            deployment_location: 'Torpa Haat Bazaar, Khunti',
            documents: [],
            activity_timeline: [],
            created_at: '2026-03-01T08:00:00Z',
            updated_at: '2026-06-20T12:00:00Z'
          }
        ]
      };
    }
  },

  async getCSRFundingById(id: string): Promise<CSRFundingItem> {
    const res = await fetch(`${API_BASE}/csr/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch CSR funding detail');
    return await res.json();
  },

  async createCSRFunding(payload: Partial<CSRFundingItem>): Promise<CSRFundingItem> {
    const res = await fetch(`${API_BASE}/csr`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create CSR funding');
    return await res.json();
  },

  async updateCSRFunding(id: string, payload: Partial<CSRFundingItem> & { timeline_note?: string }): Promise<CSRFundingItem> {
    const res = await fetch(`${API_BASE}/csr/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update CSR funding');
    return await res.json();
  },

  async updateCSRStatus(id: string, status: string, note?: string): Promise<CSRFundingItem> {
    const res = await fetch(`${API_BASE}/csr/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, note })
    });
    if (!res.ok) throw new Error('Failed to update CSR status');
    return await res.json();
  },

  // ---------------------------------------------------------------------------
  // 2. TECH SUPPORT HUB
  // ---------------------------------------------------------------------------
  async listTechSupports(params?: {
    status?: string;
    support_type?: string;
    search?: string;
  }): Promise<{ total: number; items: TechSupportItem[] }> {
    try {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') q.append('status', params.status);
      if (params?.support_type && params.support_type !== 'ALL') q.append('support_type', params.support_type);
      if (params?.search) q.append('search', params.search);

      const res = await fetch(`${API_BASE}/tech-support?${q.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch tech supports');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback tech supports:', e);
      return {
        total: 2,
        items: [
          {
            id: 'tech-1',
            support_id: 'TECH-2026-01',
            industry_id: 'seed_tata_steel',
            industry_name: 'Tata Steel CSR Foundation',
            project_id: 'proj-101',
            project_name: 'Smart Groundwater Desalination & Iron Filter',
            university_id: 'seed_bit_mesra',
            university_name: 'BIT Mesra',
            student_squad_name: 'AquaSensors Squad Alpha',
            student_squad_id: 'squad-101',
            support_type: 'AI/ML',
            technology: ['Python', 'Edge AI', 'LoRaWAN', 'Water Turbidity Models'],
            description: 'Weekly firmware architecture guidance and noise filtering for low-cost optical iron sensors.',
            assigned_expert: 'Priya Sen',
            assigned_expert_title: 'Principal Sustainability Engineer',
            assigned_expert_email: 'priya.sen@tatasteel.com',
            start_date: '2026-06-01',
            target_date: '2026-11-30',
            status: 'IN_PROGRESS',
            progress: 75,
            tasks: [
              { id: 't1', title: 'LoRaWAN PCB layout DRC review', assigned_to: 'Priya Sen', completed: true, due_date: '2026-06-25' },
              { id: 't2', title: 'Optical drift compensation algorithm', assigned_to: 'AquaSensors Squad', completed: true, due_date: '2026-07-20' },
              { id: 't3', title: 'Field telemetry gateway stress test', assigned_to: 'Priya Sen', completed: false, due_date: '2026-10-15' }
            ],
            documents: [
              { id: 'd1', name: 'Firmware_Design_Review.pdf', url: '/uploads/Firmware_Review.pdf', uploaded_at: '2026-06-05T10:00:00Z' }
            ],
            activity_timeline: [
              { action: 'Sprint Review Held', by: 'Priya Sen', timestamp: '2026-08-10T15:00:00Z', details: '8th review meeting completed with student squad' }
            ],
            created_at: '2026-06-01T10:00:00Z',
            updated_at: '2026-08-10T15:00:00Z'
          },
          {
            id: 'tech-2',
            support_id: 'TECH-2026-02',
            industry_id: 'seed_coal_india',
            industry_name: 'Coal India Innovation CSR',
            project_id: 'proj-102',
            project_name: 'Particulate Matter & Misting Telemetry Node',
            university_id: 'seed_iit_dhanbad',
            university_name: 'IIT (ISM) Dhanbad',
            student_squad_name: 'CleanAir Telemetry Lab',
            student_squad_id: 'squad-102',
            support_type: 'IoT',
            technology: ['ESP32', 'LoRa', 'Industrial Relay CAN Bus', 'Solar Power Management'],
            description: 'Industrial enclosure ruggedization (IP67) and intrinsically safe design for underground mine perimeter deployment.',
            assigned_expert: 'Rajat Mukherjee',
            assigned_expert_title: 'Head of Industrial Automation',
            assigned_expert_email: 'rajat.m@coalindia.in',
            start_date: '2026-05-15',
            target_date: '2026-10-31',
            status: 'IN_PROGRESS',
            progress: 60,
            tasks: [
              { id: 't1', title: 'ATEX explosion-proof certification prep', assigned_to: 'Rajat Mukherjee', completed: true, due_date: '2026-06-30' },
              { id: 't2', title: 'High pressure solenoid valve actuation test', assigned_to: 'CleanAir Lab', completed: true, due_date: '2026-08-01' },
              { id: 't3', title: 'Perimeter LoRa mesh gateway link', assigned_to: 'Rajat Mukherjee', completed: false, due_date: '2026-09-30' }
            ],
            documents: [],
            activity_timeline: [],
            created_at: '2026-05-15T09:00:00Z',
            updated_at: '2026-08-18T11:00:00Z'
          }
        ]
      };
    }
  },

  async getTechSupportById(id: string): Promise<TechSupportItem> {
    const res = await fetch(`${API_BASE}/tech-support/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch tech support detail');
    return await res.json();
  },

  async createTechSupport(payload: Partial<TechSupportItem>): Promise<TechSupportItem> {
    const res = await fetch(`${API_BASE}/tech-support`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create tech support');
    return await res.json();
  },

  async updateTechSupport(id: string, payload: Partial<TechSupportItem> & { timeline_note?: string }): Promise<TechSupportItem> {
    const res = await fetch(`${API_BASE}/tech-support/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update tech support');
    return await res.json();
  },

  async addTechSupportTask(id: string, payload: { title: string; assigned_to?: string; due_date?: string }): Promise<TechSupportItem> {
    const res = await fetch(`${API_BASE}/tech-support/${id}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to add task');
    return await res.json();
  },

  async updateTechSupportStatus(id: string, status: string, note?: string): Promise<TechSupportItem> {
    const res = await fetch(`${API_BASE}/tech-support/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, note })
    });
    if (!res.ok) throw new Error('Failed to update tech support status');
    return await res.json();
  },

  // ---------------------------------------------------------------------------
  // 3. SOLUTIONS HUB
  // ---------------------------------------------------------------------------
  async listIndustrySolutions(params?: {
    status?: string;
    search?: string;
  }): Promise<{ total: number; items: IndustrySolutionItem[] }> {
    try {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') q.append('status', params.status);
      if (params?.search) q.append('search', params.search);

      const res = await fetch(`${API_BASE}/solutions?${q.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch solutions');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback solutions:', e);
      return {
        total: 2,
        items: [
          {
            id: 'sol-1',
            solution_name: 'Smart Groundwater Desalination & Multi-Stage Iron Filter Unit',
            problem_id: 'prob-101',
            problem_name: 'High Iron & Heavy Metal Contamination in Village Borewells',
            problem_category: 'Water & Sanitation',
            ai_rd_brief: 'Hardware filtration column backed by continuous LoRa turbidity and iron concentration telemetry.',
            project_id: 'proj-101',
            project_name: 'Smart Groundwater Desalination & Iron Filter',
            university_id: 'seed_bit_mesra',
            university_name: 'BIT Mesra',
            student_squad: 'AquaSensors Squad Alpha',
            industry_id: 'seed_tata_steel',
            industry_name: 'Tata Steel CSR Foundation',
            industry_contribution: 'Provided ₹3,50,000 grant and PCB hardware design mentorship.',
            technology: ['IoT', 'Solar Power', 'Edge AI', 'LoRaWAN'],
            status: 'DEPLOYED',
            deployment_location: 'Toto Block, Gumla',
            deployment_date: '2026-08-15',
            people_benefited: 1240,
            area_covered: 'Gumla District',
            prototype_details: 'Solar powered multi-stage filtration unit with LoRa telemetry and real-time dashboard.',
            testing_runs: [
              { id: 'tr-1', date: '2026-07-15', tested_by: 'Dr. Rahul Kumar', parameters: 'Iron level < 0.3mg/L, flow rate 500L/hr', result: 'PASS', notes: 'Telemetry stable over 72h continuous test' }
            ],
            field_trials: [
              { id: 'ft-1', location: 'Toto Village Water Tank', date: '2026-08-15', outcomes: 'Zero iron sediment reported by village panchayat' }
            ],
            created_at: '2026-05-15T10:00:00Z',
            updated_at: '2026-08-15T14:00:00Z'
          }
        ]
      };
    }
  },

  async getIndustrySolutionById(id: string): Promise<IndustrySolutionItem> {
    const res = await fetch(`${API_BASE}/solutions/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch solution detail');
    return await res.json();
  },

  async createIndustrySolution(payload: Partial<IndustrySolutionItem>): Promise<IndustrySolutionItem> {
    const res = await fetch(`${API_BASE}/solutions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create solution');
    return await res.json();
  },

  async updateIndustrySolution(id: string, payload: Partial<IndustrySolutionItem>): Promise<IndustrySolutionItem> {
    const res = await fetch(`${API_BASE}/solutions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update solution');
    return await res.json();
  },

  async updateIndustrySolutionStatus(id: string, status: string): Promise<IndustrySolutionItem> {
    const res = await fetch(`${API_BASE}/solutions/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update solution status');
    return await res.json();
  },

  async addIndustrySolutionTesting(id: string, payload: { tested_by: string; parameters: string; result: string; notes: string }): Promise<IndustrySolutionItem> {
    const res = await fetch(`${API_BASE}/solutions/${id}/testing`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to add testing run');
    return await res.json();
  },

  async addIndustrySolutionDeployment(id: string, payload: { deployment_location: string; deployment_date: string; people_benefited: number; outcomes?: string }): Promise<IndustrySolutionItem> {
    const res = await fetch(`${API_BASE}/solutions/${id}/deployment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to add deployment record');
    return await res.json();
  },

  // ---------------------------------------------------------------------------
  // 4. IMPACT HUB
  // ---------------------------------------------------------------------------
  async getIndustryImpactSummary(): Promise<IndustryImpactSummary> {
    try {
      const res = await fetch(`${API_BASE}/impact/summary`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch impact summary');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback impact summary:', e);
      return {
        projects_supported: 8,
        problems_addressed: 14,
        solutions_supported: 9,
        solutions_deployed: 4,
        people_benefited: 8500,
        areas_covered: 7,
        csr_funding_total: 2500000,
        csr_funding_disbursed: 1850000,
        universities_supported: 4,
        technical_support_delivered: 12,
        cost_saved: '₹18.4 Lakhs',
        time_saved: '4.2 Months Avg',
        problem_resolution_rate: 88,
        environmental_impact_score: '94 / 100',
        education_impact_score: '91 / 100',
        healthcare_impact_score: '86 / 100',
        community_feedback_rating: 4.9,
      };
    }
  },

  async getIndustryImpactTimeline(): Promise<IndustryImpactChartData> {
    try {
      const res = await fetch(`${API_BASE}/impact/timeline`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch impact timeline');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback impact timeline:', e);
      return {
        projects_over_time: [
          { month: 'May 2026', projects: 2, funding_lakhs: 4.5 },
          { month: 'Jun 2026', projects: 3, funding_lakhs: 7.2 },
          { month: 'Jul 2026', projects: 5, funding_lakhs: 12.5 },
          { month: 'Aug 2026', projects: 6, funding_lakhs: 18.0 },
          { month: 'Sep 2026', projects: 8, funding_lakhs: 25.0 }
        ],
        solutions_by_status: [
          { name: 'Deployed', value: 4, color: '#10B981' },
          { name: 'Testing Trials', value: 3, color: '#3B82F6' },
          { name: 'Prototypes', value: 2, color: '#F59E0B' },
          { name: 'Under Review', value: 1, color: '#8B5CF6' }
        ],
        people_benefited_trend: [
          { month: 'May 2026', citizens: 1200 },
          { month: 'Jun 2026', citizens: 2800 },
          { month: 'Jul 2026', citizens: 4500 },
          { month: 'Aug 2026', citizens: 6400 },
          { month: 'Sep 2026', citizens: 8500 }
        ],
        csr_by_project: [
          { project: 'Smart Desalination (Toto)', pledged: 3.5, disbursed: 2.5 },
          { project: 'Mining Air Telemetry (Dhanbad)', pledged: 5.0, disbursed: 4.0 },
          { project: 'Solar Cold Storage (Khunti)', pledged: 4.2, disbursed: 4.2 },
          { project: 'Afforestation AI Drone (Ranchi)', pledged: 3.0, disbursed: 1.5 }
        ],
        impact_by_category: [
          { category: 'Water & Sanitation', count: 4, score: 96 },
          { category: 'Clean Air & Environment', count: 3, score: 92 },
          { category: 'Agriculture & Cold Chain', count: 2, score: 89 },
          { category: 'Renewable Energy', count: 2, score: 95 }
        ],
        geographic_distribution: [
          { district: 'Ranchi', projects: 3, beneficiaries: 3200 },
          { district: 'Dhanbad', projects: 2, beneficiaries: 2400 },
          { district: 'Gumla', projects: 2, beneficiaries: 1800 },
          { district: 'Khunti', projects: 1, beneficiaries: 1100 }
        ],
        university_support_breakdown: [
          { university: 'BIT Mesra', projects: 3, funding: 9.5 },
          { university: 'IIT (ISM) Dhanbad', projects: 2, funding: 7.5 },
          { university: 'Birsa Agricultural University', projects: 2, funding: 5.0 },
          { university: 'NIT Jamshedpur', projects: 1, funding: 3.0 }
        ],
        tech_support_breakdown: [
          { type: 'IoT & Firmware', count: 5 },
          { type: 'AI/ML Modeling', count: 4 },
          { type: 'Solar Hardware', count: 3 },
          { type: 'Cloud Analytics', count: 2 }
        ]
      };
    }
  },

  // ---------------------------------------------------------------------------
  // 5. PROFILE HUB
  // ---------------------------------------------------------------------------
  async getIndustryProfile(): Promise<IndustryProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback profile:', e);
      return {
        id: 'seed_tata_steel',
        company_name: 'Tata Steel CSR Foundation',
        company_logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
        official_email: 'csr.jharkhand@tatasteel.com',
        phone: '+91 657 664 1234',
        website: 'https://www.tatasteel.com/sustainability/csr',
        description: 'Driving inclusive socio-economic growth, environmental regeneration, and technological empowerment across tribal and rural Jharkhand.',
        industry_type: 'Manufacturing, Mining & Clean Infrastructure',
        contact_person: 'Mr. Rajiv Singhania',
        designation: 'Head of Rural Water Innovation & Academic CSR',
        contact_email: 'rajiv.s@tatasteel.com',
        contact_phone: '+91 94311 88990',
        address: 'Tata Steel Corporate Center, Northern Town',
        city: 'Jamshedpur',
        district: 'East Singhbhum',
        state: 'Jharkhand',
        country: 'India',
        latitude: 22.8046,
        longitude: 86.2029,
        expertise: ['Heavy Engineering', 'Clean Water Telemetry', 'Solar Energy Infrastructure', 'Edge IoT', 'Material Science'],
        technologies: ['Python', 'C++', 'LoRaWAN', 'AWS IoT Core', 'PostgreSQL', 'Grafana Telemetry'],
        csr_focus_areas: ['Safe Drinking Water', 'Environmental Remediation', 'STEM Education', 'Renewable Energy'],
        support_available: ['FUNDING', 'MENTORSHIP', 'TECHNOLOGY', 'INFRASTRUCTURE', 'CSR', 'R&D', 'TRAINING'],
        preferred_project_categories: ['Water & Sanitation', 'Air Quality & Environment', 'Renewable Energy', 'Smart Agriculture'],
        preferred_locations: ['Ranchi', 'East Singhbhum', 'Dhanbad', 'Gumla', 'Khunti', 'Bokaro'],
        is_verified: true,
        verification_status: 'Approved Corporate Partner'
      };
    }
  },

  async updateIndustryProfile(payload: Partial<IndustryProfile>): Promise<IndustryProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  },

  async updateIndustryLogo(logoUrl: string): Promise<{ success: boolean; logo_url: string }> {
    const res = await fetch(`${API_BASE}/profile/logo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ logo_url: logoUrl })
    });
    if (!res.ok) throw new Error('Failed to update logo');
    return await res.json();
  }
};
