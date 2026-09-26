import {
  IndustryPartner,
  UniversityCollaboration,
  UniversitySolution,
  UniversityImpactSummary,
  UniversityProfile,
  UniversityNotificationItem,
} from '../types/university';

const API_BASE = '/api/university';

class UniversityService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('c2c_token') || localStorage.getItem('access_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // ---------------------------------------------------------------------------
  // 1. INDUSTRY PARTNERS
  // ---------------------------------------------------------------------------
  async listIndustryPartners(params?: {
    search?: string;
    industry_type?: string;
    support_type?: string;
    location?: string;
  }): Promise<{ total: number; items: IndustryPartner[] }> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.append('search', params.search);
      if (params?.industry_type && params.industry_type !== 'ALL') q.append('industry_type', params.industry_type);
      if (params?.support_type && params.support_type !== 'ALL') q.append('support_type', params.support_type);
      if (params?.location && params.location !== 'ALL') q.append('location', params.location);

      const res = await fetch(`${API_BASE}/industry-partners?${q.toString()}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch industry partners');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback industry partners:', e);
      return {
        total: 3,
        items: [
          {
            id: 'ind-101',
            name: 'Tata Steel CSR Foundation',
            company_name: 'Tata Steel CSR Foundation',
            industry_type: 'Manufacturing, Mining & Clean Infrastructure',
            csr_focus: 'Rural Drinking Water Telemetry & Tribal Livelihoods',
            expertise: ['Clean Water Tech', 'IoT Telemetry', 'Heavy Infrastructure'],
            technologies: ['Solar Inverters', 'LoRaWAN Sensors', 'Water Filtration'],
            support_available: ['FUNDING', 'MENTORSHIP', 'TECHNOLOGY', 'CSR'],
            location: 'Jamshedpur & West Singhbhum',
            city: 'Jamshedpur',
            state: 'Jharkhand',
            contact_person: 'Sunil Verma',
            designation: 'Head of CSR & Rural Infrastructure',
            email: 'csr.jharkhand@tatasteel.com',
            phone: '+91 98351 98765',
            collaboration_count: 3,
            supported_projects_count: 4,
            active_funding: '₹18.5 L Committed',
            status: 'VERIFIED_PARTNER',
            is_verified: true,
            supported_projects: [
              { id: 'p1', title: 'Smart Groundwater Desalination (Toto)', domain: 'Water Tech', stage: 'TESTING', budget: '₹3,50,000' }
            ]
          },
          {
            id: 'ind-102',
            name: 'Coal India Innovation CSR',
            company_name: 'Coal India Innovation CSR',
            industry_type: 'Energy, Mining & Environmental CSR',
            csr_focus: 'Air Quality Monitoring & Renewable Cold Storage',
            expertise: ['Particulate Sensing', 'Solar Energy', 'Biochar Filters'],
            technologies: ['ESP32 Edge AI', 'Phase Change Materials', 'Solar PV'],
            support_available: ['FUNDING', 'INFRASTRUCTURE', 'R&D'],
            location: 'Dhanbad & Bokaro Coalfields',
            city: 'Dhanbad',
            state: 'Jharkhand',
            contact_person: 'Dr. Vikas Sen',
            designation: 'Director Clean Energy CSR',
            email: 'csr@coalindia.gov.in',
            phone: '+91 94311 88990',
            collaboration_count: 2,
            supported_projects_count: 3,
            active_funding: '₹14.0 L Committed',
            status: 'VERIFIED_PARTNER',
            is_verified: true
          },
          {
            id: 'ind-103',
            name: 'Jindal Steel & Power CSR',
            company_name: 'Jindal Steel & Power CSR',
            industry_type: 'Industrial Automation & Effluent Tech',
            csr_focus: 'Acid Mine Drainage & Watershed Restoration',
            expertise: ['Water Chemistry', 'Permeable Barriers', 'IoT'],
            technologies: ['Biochar Zeolite', 'Cloud SCADA', 'pH Telemetry'],
            support_available: ['FUNDING', 'TECHNOLOGY', 'TRAINING'],
            location: 'Bokaro & Ramgarh',
            city: 'Bokaro',
            state: 'Jharkhand',
            contact_person: 'Er. S. Chatterjee',
            designation: 'Effluent Treatment Chief',
            email: 's.chatterjee@jindalsteel.com',
            phone: '+91 94311 44556',
            collaboration_count: 2,
            supported_projects_count: 2,
            active_funding: '₹12.0 L Committed',
            status: 'VERIFIED_PARTNER',
            is_verified: true
          }
        ]
      };
    }
  }

  async getIndustryPartnerById(id: string): Promise<IndustryPartner> {
    const res = await fetch(`${API_BASE}/industry-partners/${id}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Partner not found');
    return await res.json();
  }

  async requestIndustryCollaboration(
    partnerId: string,
    payload: { title?: string; description?: string; problem_id?: string; project_id?: string; support_type?: string; proposal?: string; requested_grant?: string } | Record<string, any>
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/industry-partners/${partnerId}/request`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit collaboration proposal');
    return await res.json();
  }

  // ---------------------------------------------------------------------------
  // 2. ACTIVE COLLABORATIONS
  // ---------------------------------------------------------------------------
  async listCollaborations(params?: {
    status?: string;
    search?: string;
    industry?: string;
  }): Promise<{ total: number; items: UniversityCollaboration[] }> {
    try {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      if (params?.industry && params.industry !== 'ALL') q.append('industry', params.industry);

      const res = await fetch(`${API_BASE}/collaborations?${q.toString()}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch collaborations');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback collaborations:', e);
      return {
        total: 2,
        items: [
          {
            id: 'collab-101',
            title: 'Smart Groundwater Fluoride Telemetry Initiative',
            problem_id: 'prob-1',
            problem_title: 'Rural handpump fluorosis & iron contamination in Toto Block, Gumla',
            problem_category: 'Water & Sanitation',
            university_id: 'univ-bit',
            university_name: 'Birla Institute of Technology, Mesra',
            industry_id: 'ind-101',
            industry_name: 'Tata Steel CSR Foundation',
            student_squad_name: 'Smart Water Innovation Squad',
            mentor: 'Dr. Alok Verma',
            start_date: '2026-08-01',
            deadline: '2026-11-30',
            target_date: '2026-11-30',
            progress: 75,
            current_phase: 'Testing',
            status: 'ACTIVE',
            last_updated: 'Sep 15, 2026',
            description: 'Autonomous solar-powered optical fluorosis sensors for 14 rural Panchayats in Toto Block.',
            members: [
              { name: 'Dr. Alok Verma', role: 'Faculty Lead', institution: 'BIT Mesra' },
              { name: 'Rahul Kumar', role: 'Squad Leader', institution: 'Civil & Env Eng' },
              { name: 'Mr. Rajiv Singhania', role: 'CSR Sponsor', institution: 'Tata Steel CSR' }
            ],
            milestones: [
              { milestone_id: 'm1', title: 'Hardware Prototyping & Sensor Assembly', status: 'COMPLETED', progress: 100 },
              { milestone_id: 'm2', title: 'Field Stress Testing in Toto Handpump', status: 'IN_PROGRESS', progress: 75 },
              { milestone_id: 'm3', title: 'Panchayat Telemetry Gateway Handoff', status: 'PENDING', progress: 0 }
            ],
            tasks: [
              { task_id: 't1', title: 'Calibrate optical fluoride sensor against BIS 10500', assigned_to: 'Rahul Kumar', priority: 'HIGH', status: 'IN_PROGRESS' },
              { task_id: 't2', title: 'Finalize IP67 waterproof solar enclosure', assigned_to: 'Pooja Kumari', priority: 'MEDIUM', status: 'COMPLETED' }
            ],
            documents: [
              { doc_id: 'd1', name: 'Toto Groundwater Field Assessment.pdf', file_type: 'PDF Report', upload_date: '2026-08-15', version: '1.0' }
            ],
            activity_timeline: [
              { event_id: 'e1', date: '2026-08-01', user: 'Dr. Alok Verma', action: 'Collaboration Formed', description: 'MoU signed with Tata Steel CSR.' }
            ]
          },
          {
            id: 'collab-102',
            title: 'Decentralized Solar Phase-Change Cold Chain',
            problem_id: 'prob-2',
            problem_title: 'Post-harvest vegetable spoilage in off-grid tribal markets',
            problem_category: 'Agriculture & Livelihood',
            university_id: 'univ-bit',
            university_name: 'Birla Institute of Technology, Mesra',
            industry_id: 'ind-102',
            industry_name: 'Coal India Innovation CSR',
            student_squad_name: 'Solar Cold Chain Squad',
            mentor: 'Dr. Manisha Roy',
            start_date: '2026-07-15',
            deadline: '2026-12-20',
            target_date: '2026-12-20',
            progress: 60,
            current_phase: 'Prototype',
            status: 'ACTIVE',
            last_updated: 'Sep 12, 2026',
            description: 'Engineering 12V DC solar thermal cold storage for tribal vegetable and forest produce farmers.',
            milestones: [
              { milestone_id: 'm101', title: 'Phase-Change Material Thermodynamic Sizing', status: 'COMPLETED', progress: 100 },
              { milestone_id: 'm102', title: '200kg Prototype Chamber Assembly', status: 'IN_PROGRESS', progress: 60 }
            ]
          }
        ]
      };
    }
  }

  async getCollaborationById(id: string): Promise<UniversityCollaboration> {
    const res = await fetch(`${API_BASE}/collaborations/${id}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Collaboration not found');
    return await res.json();
  }

  async updateCollaboration(id: string, payload: Partial<UniversityCollaboration>): Promise<UniversityCollaboration> {
    const res = await fetch(`${API_BASE}/collaborations/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update collaboration');
    return await res.json();
  }

  async addCollaborationMilestone(id: string, milestone: any): Promise<any> {
    const res = await fetch(`${API_BASE}/collaborations/${id}/milestones`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(milestone),
    });
    if (!res.ok) throw new Error('Failed to add milestone');
    return await res.json();
  }

  async addMilestone(id: string, milestone: any): Promise<any> {
    return this.addCollaborationMilestone(id, milestone);
  }

  async addCollaborationTask(id: string, task: any): Promise<any> {
    const res = await fetch(`${API_BASE}/collaborations/${id}/tasks`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to add task');
    return await res.json();
  }

  async addTask(id: string, task: any): Promise<any> {
    return this.addCollaborationTask(id, task);
  }

  async uploadDocument(id: string, doc: any): Promise<any> {
    return this.updateCollaboration(id, {
      documents: [{
        doc_id: `doc-${Date.now()}`,
        name: doc.name,
        file_type: doc.file_type || 'PDF',
        upload_date: new Date().toISOString().split('T')[0],
        version: doc.version || '1.0'
      }]
    });
  }

  // ---------------------------------------------------------------------------
  // 3. SOLUTIONS
  // ---------------------------------------------------------------------------
  async listSolutions(params?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ total: number; items: UniversitySolution[] }> {
    try {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') q.append('status', params.status);
      if (params?.category && params.category !== 'ALL') q.append('category', params.category);
      if (params?.search) q.append('search', params.search);

      const res = await fetch(`${API_BASE}/solutions?${q.toString()}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch solutions');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback solutions:', e);
      return {
        total: 2,
        items: [
          {
            id: 'sol-101',
            title: 'Solar LoRa Fluoride Telemetry Station',
            description: 'Autonomous solar-powered IoT water telemetry probe monitoring groundwater pH, Fluoride, and TDS.',
            problem_id: 'prob-1',
            problem_title: 'Rural handpump fluorosis in Toto Block',
            project_id: 'prj-1',
            project_name: 'AI Water Quality Monitoring',
            collaboration_name: 'Tata Steel CSR & BIT Mesra Water Initiative',
            technology: ['ESP32', 'Optical Fluoride Probe', 'LoRaWAN 868MHz', 'FastAPI'],
            development_team: 'Smart Water Innovation Squad (BIT Mesra)',
            solution_type: 'Hardware + IoT',
            status: 'TESTING',
            progress: 75,
            deployment_location: 'Toto Block Handpump #4, Gumla',
            deployment_date: '2026-10-15',
            people_benefited: 12500,
            last_updated: 'Sep 16, 2026'
          },
          {
            id: 'sol-102',
            title: 'Phase-Change Solar Cold Storage (200kg)',
            description: 'Zero-grid electricity thermal storage box using salt-hydrate PCM maintaining 4°C-8°C.',
            problem_id: 'prob-2',
            problem_title: 'Post-harvest vegetable spoilage in tribal haats',
            project_id: 'prj-2',
            project_name: 'Decentralized Solar Cold Storage',
            collaboration_name: 'Coal India Innovation & BIT Mesra Agri Lab',
            technology: ['Phase Change Material', 'Solar Thermal PV', 'IoT Datalogger'],
            development_team: 'Solar Cold Chain Squad',
            solution_type: 'Renewable Thermal Hardware',
            status: 'PROTOTYPE',
            progress: 60,
            deployment_location: 'Bishunpur Haat Market, Gumla',
            deployment_date: '2026-11-20',
            people_benefited: 5900,
            last_updated: 'Sep 14, 2026'
          }
        ]
      };
    }
  }

  async getSolutionById(id: string): Promise<UniversitySolution> {
    const res = await fetch(`${API_BASE}/solutions/${id}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Solution not found');
    return await res.json();
  }

  async createSolution(payload: Partial<UniversitySolution>): Promise<UniversitySolution> {
    const res = await fetch(`${API_BASE}/solutions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create solution');
    return await res.json();
  }

  async updateSolutionStatus(id: string, newStatus: string | { status: string; progress?: number }): Promise<any> {
    const payload = typeof newStatus === 'string' ? { status: newStatus } : newStatus;
    const res = await fetch(`${API_BASE}/solutions/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update solution status');
    return await res.json();
  }

  async updateSolution(id: string, payload: Partial<UniversitySolution>): Promise<UniversitySolution> {
    const res = await fetch(`${API_BASE}/solutions/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update solution');
    return await res.json();
  }

  async addSolutionTesting(id: string, testingData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/solutions/${id}/testing`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(testingData),
    });
    if (!res.ok) throw new Error('Failed to add testing log');
    return await res.json();
  }

  // ---------------------------------------------------------------------------
  // 4. IMPACT
  // ---------------------------------------------------------------------------
  async getImpactSummary(): Promise<UniversityImpactSummary> {
    try {
      const res = await fetch(`${API_BASE}/impact/summary`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch impact summary');
      return await res.json();
    } catch (e) {
      return {
        problems_addressed: 14,
        projects_completed: 8,
        solutions_developed: 6,
        solutions_deployed: 3,
        student_squads_active: 3,
        people_benefited: 18400,
        areas_covered: 7,
        cost_saved: '₹28.4 Lakhs',
        co2_reduced_tons: 42.5,
        potable_water_saved_liters: 350000,
        problems_by_category: [
          { category: 'Water Infrastructure', count: 6 },
          { category: 'Renewable Energy', count: 4 },
          { category: 'Agriculture Tech', count: 3 },
          { category: 'Public Health', count: 2 },
          { category: 'Waste Management', count: 2 },
        ],
        projects_by_status: [
          { status: 'RESEARCH', count: 2 },
          { status: 'PROTOTYPE', count: 3 },
          { status: 'TESTING', count: 2 },
          { status: 'DEPLOYED', count: 3 },
          { status: 'COMPLETED', count: 2 },
        ],
        solutions_by_status: [
          { status: 'PROTOTYPE', count: 3 },
          { status: 'TESTING', count: 2 },
          { status: 'APPROVED', count: 1 },
          { status: 'DEPLOYED', count: 3 },
        ],
        deployment_by_location: [
          { location: 'Gumla', count: 3 },
          { location: 'Ranchi', count: 4 },
          { location: 'Dhanbad', count: 3 },
          { location: 'Khunti', count: 2 },
          { location: 'Bokaro', count: 2 },
        ],
        impact_timeline: [
          { month: 'May 2026', benefited: 2400 },
          { month: 'Jun 2026', benefited: 5800 },
          { month: 'Jul 2026', benefited: 9200 },
          { month: 'Aug 2026', benefited: 14500 },
          { month: 'Sep 2026', benefited: 18400 },
        ]
      };
    }
  }

  async getImpactProjects(): Promise<Array<{ status: string; count: number; color: string }>> {
    try {
      const res = await fetch(`${API_BASE}/impact/projects`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [
        { status: 'RESEARCH', count: 2, color: '#0284c7' },
        { status: 'PROTOTYPE', count: 3, color: '#f59e0b' },
        { status: 'TESTING', count: 2, color: '#8b5cf6' },
        { status: 'DEPLOYED', count: 3, color: '#10b981' },
      ];
    }
  }

  async getImpactSolutions(): Promise<Array<{ category: string; solutions: number; beneficiaries: number }>> {
    try {
      const res = await fetch(`${API_BASE}/impact/solutions`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [
        { category: 'Water Tech', solutions: 4, beneficiaries: 12500 },
        { category: 'Clean Energy', solutions: 3, beneficiaries: 8400 },
        { category: 'AgriTech', solutions: 3, beneficiaries: 6200 },
        { category: 'Waste & Mining', solutions: 2, beneficiaries: 4800 },
      ];
    }
  }

  async getImpactLocations(): Promise<Array<{ district: string; deployments: number; citizens: number }>> {
    try {
      const res = await fetch(`${API_BASE}/impact/locations`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [
        { district: 'Ranchi', deployments: 4, citizens: 14200 },
        { district: 'Gumla', deployments: 3, citizens: 12500 },
        { district: 'Dhanbad', deployments: 3, citizens: 9800 },
        { district: 'Khunti', deployments: 2, citizens: 6400 },
      ];
    }
  }

  async getImpactTimeline(): Promise<Array<{ month: string; beneficiaries: number; solutions: number }>> {
    try {
      const res = await fetch(`${API_BASE}/impact/timeline`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [
        { month: 'May', beneficiaries: 2400, solutions: 1 },
        { month: 'Jun', beneficiaries: 5800, solutions: 2 },
        { month: 'Jul', beneficiaries: 9200, solutions: 3 },
        { month: 'Aug', beneficiaries: 14500, solutions: 5 },
        { month: 'Sep', beneficiaries: 18400, solutions: 6 },
      ];
    }
  }

  // ---------------------------------------------------------------------------
  // 5. NOTIFICATIONS
  // ---------------------------------------------------------------------------
  async getUnreadNotificationCount(): Promise<number> {
    try {
      const res = await fetch(`${API_BASE}/notifications/unread`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return 0;
      const data = await res.json();
      return data.unread_count || 0;
    } catch {
      return 0;
    }
  }

  async listNotifications(unreadOnly = false): Promise<{ items: UniversityNotificationItem[]; unread_count: number }> {
    return this.getNotifications(unreadOnly);
  }

  async getNotifications(unreadOnly = false): Promise<{ items: UniversityNotificationItem[]; unread_count: number }> {
    try {
      const res = await fetch(`${API_BASE}/notifications?unread_only=${unreadOnly}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return {
        unread_count: 2,
        items: [
          {
            id: 'n1',
            type: 'collaboration',
            title: 'New CSR Grant Allocated',
            message: 'Tata Steel CSR approved ₹12,50,000 co-funding for Smart Water Innovation Squad.',
            is_read: false,
            created_at: new Date().toISOString()
          },
          {
            id: 'n2',
            type: 'match',
            title: 'New AI Recommended Challenge',
            message: '4 High-Affinity community problems in Gumla matched with Dept of Env Eng.',
            is_read: false,
            created_at: new Date().toISOString()
          }
        ]
      };
    }
  }

  async markNotificationRead(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return await res.json();
  }

  async markAllNotificationsRead(): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return await res.json();
  }

  // ---------------------------------------------------------------------------
  // 6. PROFILE
  // ---------------------------------------------------------------------------
  async getProfile(): Promise<UniversityProfile> {
    return this.getUniversityProfile();
  }

  async getUniversityProfile(): Promise<UniversityProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to load university profile');
      return await res.json();
    } catch (e) {
      console.warn('Using fallback university profile:', e);
      return {
        id: 'seed_bit_mesra',
        name: 'Birla Institute of Technology, Mesra',
        organization_name: 'Birla Institute of Technology, Mesra',
        email: 'innovator@bitmesra.ac.in',
        phone: '+91 94311 23456',
        website: 'https://www.bitmesra.ac.in',
        logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80',
        university_logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80',
        description: 'Premier engineering institution in Jharkhand with advanced accredited laboratories in IoT Telemetry, Environmental Engineering, and Solar Thermal Systems.',
        address: 'Mesra, Ranchi, Jharkhand 835215',
        city: 'Ranchi',
        district: 'Ranchi',
        state: 'Jharkhand',
        country: 'India',
        latitude: 23.4123,
        longitude: 85.4399,
        departments: [
          'Computer Science & Engineering',
          'Environmental Engineering',
          'Electronics & Communication',
          'Mechanical Engineering',
          'Civil Engineering'
        ],
        courses: ['B.Tech', 'M.Tech', 'Ph.D Research', 'Polytechnic Diploma'],
        research_areas: [
          'Groundwater Fluorosis Remediation',
          'Solar Cold Storage',
          'Edge AI PM2.5 Telemetry',
          'Biochar Acid Mine Drainage'
        ],
        research_domains: [
          'Clean Water & Sanitation',
          'Renewable Energy',
          'Air Quality Telemetry',
          'Waste Management'
        ],
        technical_expertise: [
          'IoT Microcontrollers (ESP32/STM32)',
          'LoRaWAN Mesh Networks',
          'Solar PV MPPT Systems',
          'FastAPI / Python',
          'Computer Vision'
        ],
        engineering_domains: [
          'Environmental Informatics',
          'Embedded Systems',
          'Agri-Tech Robotics',
          'Structural Telemetry'
        ],
        research_skills: [
          'GIS Remote Sensing',
          'Water Chemistry Bench Testing',
          'PCB Prototyping',
          'Machine Learning'
        ],
        laboratories: [
          'State Environmental Informatics Center',
          'IoT & Embedded Systems Prototyping FabLab',
          'Solar Energy Harvesting Lab'
        ],
        research_centers: [
          'Center of Excellence in Clean Water Innovation',
          'Tribal Livelihood Tech Transfer Incubator'
        ],
        infrastructure: [
          '3D Printers FabLab',
          'CNC Milling Unit',
          'Water Quality Spectrophotometer',
          'PCB Fabrication Station'
        ],
        equipment: [
          'High-precision Fluoride Ion Meter',
          'LoRa Gateway 8-Channel Tower',
          'Solar Simulator'
        ],
        industry_collaboration_areas: [
          'Tata Steel CSR',
          'Coal India Innovation',
          'Jindal Steel & Power',
          'Usha Martin Foundation'
        ],
        government_collaboration: [
          'Drinking Water & Sanitation Dept, Govt of Jharkhand',
          'Jharkhand State Pollution Control Board'
        ],
        student_innovation: 'Accredited 6-month Final Year Project credits for Community Engineering Squads',
        research_support: '₹50,000 Institutional Seed Grant per Student Squad',
        contact_person: 'Dr. Rajiv Ranjan',
        designation: 'Dean of Research & Innovation'
      };
    }
  }

  async updateProfile(payload: Partial<UniversityProfile>): Promise<UniversityProfile> {
    return this.updateUniversityProfile(payload);
  }

  async updateUniversityProfile(payload: Partial<UniversityProfile>): Promise<UniversityProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save university profile');
    return await res.json();
  }
}

export const universityService = new UniversityService();
