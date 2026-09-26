import { StudentSquad, SquadSummaryKpis, SquadMember, SquadMilestone, SquadTask, FieldTestRecord, SquadDocumentItem, SquadImpactRecord } from '../types/squad';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api';

// Initial fallback mock squads for Jharkhand Universities
const DEFAULT_MOCK_SQUADS: StudentSquad[] = [
  {
    _id: 'sq-1',
    squad_id: 'SE-001',
    name: 'Smart Water Innovation Squad',
    description: 'Multidisciplinary squad developing solar-powered IoT water telemetry stations for high fluorosis groundwater pockets in Toto Block.',
    project_name: 'AI Water Quality Monitoring',
    problem_id: 'prob-1',
    problem_title: 'Rural handpump fluorosis & iron contamination in Toto Block, Gumla',
    problem_category: 'Water & Sanitation',
    problem_location: 'Toto Block, Gumla District',
    problem_priority: 'CRITICAL',
    ai_match_score: 96,
    team_leader_name: 'Rahul Kumar',
    team_leader_id: 'STU-101',
    members: [
      {
        student_id: 'STU-101',
        name: 'Rahul Kumar',
        email: 'rahul.k@bitmesra.ac.in',
        department: 'CSE',
        year: 4,
        skills: ['Python', 'FastAPI', 'IoT Gateway', 'GIS Mapping'],
        role: 'TEAM_LEADER',
        current_task: 'Cloud Ingestion & Telemetry Dashboard',
        task_status: 'IN_PROGRESS',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        student_id: 'STU-102',
        name: 'Pooja Kumari',
        email: 'pooja.ece@bitmesra.ac.in',
        department: 'ECE',
        year: 3,
        skills: ['LoRaWAN', 'Embedded C', 'Sensor PCB Design'],
        role: 'DEVELOPER',
        current_task: 'Low-power Sleep Mode Calibration',
        task_status: 'COMPLETED',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      },
      {
        student_id: 'STU-103',
        name: 'Rahul Munda',
        email: 'rahul.m@bitmesra.ac.in',
        department: 'Civil & Env',
        year: 4,
        skills: ['Water Hydrology', 'Fluoride Assays', 'Field Surveys'],
        role: 'DOMAIN_SPECIALIST',
        current_task: 'Groundwater Sample Lab Validation',
        task_status: 'IN_PROGRESS',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      {
        student_id: 'STU-104',
        name: 'Sneha Hansda',
        email: 'sneha.ai@bitmesra.ac.in',
        department: 'AI & ML',
        year: 3,
        skills: ['Anomaly Detection', 'Time Series ML', 'Pandas'],
        role: 'DATA_ANALYST',
        current_task: 'Predictive Contamination Spike Model',
        task_status: 'TODO',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      },
    ],
    max_team_size: 6,
    faculty_mentor_name: 'Dr. Alok Verma',
    faculty_mentor_email: 'alok.verma@bitmesra.ac.in',
    faculty_mentor_department: 'Dept of Environmental Engineering',
    industry_partner_name: 'Tata Steel CSR Foundation',
    industry_partner_mentor: 'Mr. Rajiv Singhania',
    industry_partner_designation: 'Head of Rural Water Innovation',
    industry_partner_email: 'rajiv.s@tatasteel.com',
    industry_support_type: 'FUNDING',
    funding_received: '₹2,50,000',
    government_partner: 'Drinking Water & Sanitation Dept, Ranchi',
    department: 'Civil & Environmental Engineering',
    course: 'B.Tech Engineering',
    year: 4,
    research_area: 'IoT Water Quality & Heavy Metal Telemetry',
    technologies: ['LoRaWAN', 'ESP32', 'Python', 'FastAPI', 'Leaflet Maps'],
    objectives: [
      'Continuous telemetry of Fluoride (F-) and TDS in 12 Toto handpumps',
      'Solar-powered node with 7-day battery backup during monsoon',
      'Automated SMS alerts to Mukhiya and Block Development Officer',
    ],
    expected_outcome: 'Field-ready IP67 telemetry probe preventing fluorosis in 12,500 villagers.',
    current_phase: 'TESTING',
    progress: 72,
    status: 'ACTIVE',
    start_date: '2026-08-01',
    target_date: '2026-11-30',
    milestones: [
      {
        id: 'm-101',
        title: 'Problem Site Survey & Lab Assay',
        description: 'Collected 45 baseline borewell samples across Toto Block.',
        due_date: '2026-08-15',
        responsible_member: 'Rahul Munda',
        status: 'COMPLETED',
        progress: 100,
        completed_at: '2026-08-14',
      },
      {
        id: 'm-102',
        title: 'Dual-Sensor Prototype & Firmware',
        description: 'Assembled ESP32 + ISE Fluoride probe with LoRaWAN telemetry.',
        due_date: '2026-09-05',
        responsible_member: 'Pooja Kumari',
        status: 'COMPLETED',
        progress: 100,
        completed_at: '2026-09-04',
      },
      {
        id: 'm-103',
        title: 'Field Pilot Testing in 3 Handpumps',
        description: 'Install weather-sealed nodes and verify 24/7 solar charging.',
        due_date: '2026-10-10',
        responsible_member: 'Rahul Kumar',
        status: 'IN_PROGRESS',
        progress: 65,
      },
      {
        id: 'm-104',
        title: 'State Portal Dashboard Integration',
        description: 'Feed live TDS and Fluoride alerts into Jharkhand Gov Command Center.',
        due_date: '2026-11-15',
        responsible_member: 'Sneha Hansda',
        status: 'PENDING',
        progress: 0,
      },
    ],
    tasks: [
      {
        id: 't-101',
        title: 'Calibrate Ion-Selective Electrodes',
        description: 'Use standard 1.0 ppm and 5.0 ppm Fluoride buffer solutions.',
        assigned_member: 'Pooja Kumari',
        priority: 'CRITICAL',
        due_date: '2026-09-22',
        status: 'IN_PROGRESS',
      },
      {
        id: 't-102',
        title: 'Solar Charge Controller Enclosure Design',
        description: '3D print waterproof ABS casing with UV resistance.',
        assigned_member: 'Rahul Kumar',
        priority: 'HIGH',
        due_date: '2026-09-25',
        status: 'TODO',
      },
      {
        id: 't-103',
        title: 'Panchayat Verification Meeting',
        description: 'Demonstrate green/red LED water safety indicator to Toto Panchayat.',
        assigned_member: 'Rahul Munda',
        priority: 'MEDIUM',
        due_date: '2026-10-02',
        status: 'TODO',
      },
    ],
    documents: [
      {
        id: 'doc-101',
        name: 'Toto_Groundwater_Fluoride_Survey_Report_V1.pdf',
        type: 'Field survey',
        uploaded_by: 'Rahul Munda',
        upload_date: 'Aug 18, 2026',
        version: '1.0',
        url: '#',
      },
      {
        id: 'doc-102',
        name: 'SmartWater_Schematic_PCB_V2.pdf',
        type: 'Design files',
        uploaded_by: 'Pooja Kumari',
        upload_date: 'Sep 05, 2026',
        version: '2.1',
        url: '#',
      },
    ],
    field_testing: [
      {
        id: 'ft-101',
        location: 'Toto Primary Health Center Handpump #4',
        date: 'Sep 15, 2026',
        objective: '72-hour continuous telemetry stability test under direct rainfall.',
        participants: ['Rahul Kumar', 'Pooja Kumari', 'Gram Pradhan Smt. M. Oraon'],
        observed_results: 'Telemetry uplink received every 15 minutes; Fluoride measured at 2.4 ppm (Dangerous).',
        issues_found: 'Slight condensation on outer antenna seal.',
        feedback: 'Panchayat immediately diverted drinking usage to alternate deep borewell.',
        photos_videos: [],
        status: 'COMPLETED',
      },
    ],
    impact: {
      people_benefited: 12500,
      area_covered: 'Toto & Bishunpur Blocks (14 Panchayats)',
      problem_resolution_percentage: 75,
      cost_saved: '₹3,40,000',
      time_saved: '45 Days',
      environmental_impact: 'Zero consumable chemical reagent waste with solid-state ISE sensor',
      community_feedback: 'Villagers expressed immense relief having real-time water safety indicators.',
      deployment_date: '2026-10-15',
    },
    activity_timeline: [
      {
        id: 'act-1',
        date: 'Aug 01, 2026',
        user: 'Prof. Arvind Sharma (Dean R&D)',
        action: 'Squad created',
        description: 'Smart Water Innovation Squad initialized for Toto fluorosis mitigation.',
      },
      {
        id: 'act-2',
        date: 'Aug 05, 2026',
        user: 'AI Matching Engine',
        action: 'AI-matched problem assigned',
        description: 'Problem "Rural handpump fluorosis in Toto" assigned with 96% AI match score.',
      },
      {
        id: 'act-3',
        date: 'Aug 14, 2026',
        user: 'Rahul Munda',
        action: 'Milestone completed',
        description: 'Milestone "Problem Site Survey & Lab Assay" completed successfully.',
      },
      {
        id: 'act-4',
        date: 'Aug 25, 2026',
        user: 'Tata Steel CSR',
        action: 'Industry mentor linked',
        description: 'Mr. Rajiv Singhania (Tata Steel) assigned as industry technical mentor with ₹2,50,000 grant.',
      },
      {
        id: 'act-5',
        date: 'Sep 15, 2026',
        user: 'Rahul Kumar',
        action: 'Field testing conducted',
        description: '72-hr telemetry stability test completed at Toto PHC Handpump #4.',
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'sq-2',
    squad_id: 'SE-002',
    name: 'Solar Cold Chain Squad',
    description: 'Engineering portable 12V DC phase-change solar cold storage for rural tribal vegetable and mahua farmers in Bishunpur.',
    project_name: 'Decentralized Solar Cold Storage',
    problem_id: 'prob-2',
    problem_title: 'Post-harvest vegetable spoilage in off-grid tribal markets',
    problem_category: 'Agriculture & Livelihood',
    problem_location: 'Bishunpur Block, Gumla',
    problem_priority: 'HIGH',
    ai_match_score: 92,
    team_leader_name: 'Amit Kerketta',
    team_leader_id: 'STU-201',
    members: [
      {
        student_id: 'STU-201',
        name: 'Amit Kerketta',
        email: 'amit.k@bitmesra.ac.in',
        department: 'Mechanical Eng',
        year: 4,
        skills: ['Thermal Engineering', 'SolidWorks', 'HVAC Design'],
        role: 'TEAM_LEADER',
        current_task: 'Phase Change Material (PCM) Thermal Modeling',
        task_status: 'IN_PROGRESS',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
      {
        student_id: 'STU-202',
        name: 'Nisha Topno',
        email: 'nisha.t@bitmesra.ac.in',
        department: 'EEE',
        year: 3,
        skills: ['Solar MPPT', 'BLDC Motor Drives', 'Battery BMS'],
        role: 'DEVELOPER',
        current_task: '48V LiFePO4 Battery Controller Wiring',
        task_status: 'IN_PROGRESS',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
      {
        student_id: 'STU-203',
        name: 'Deepak Gope',
        email: 'deepak.g@bitmesra.ac.in',
        department: 'Agriculture Eng',
        year: 4,
        skills: ['Post-harvest Storage', 'Humidity Control', 'Supply Chain'],
        role: 'DOMAIN_SPECIALIST',
        current_task: 'Tomato & Green Chilli Shelf-life Study',
        task_status: 'COMPLETED',
        avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      },
    ],
    max_team_size: 5,
    faculty_mentor_name: 'Dr. Manisha Roy',
    faculty_mentor_email: 'manisha.roy@bitmesra.ac.in',
    faculty_mentor_department: 'Mechanical Engineering Dept',
    industry_partner_name: 'Coal India Innovation CSR',
    industry_partner_mentor: 'Dr. Vikas Sen',
    industry_partner_designation: 'Renewable Energy Director',
    industry_partner_email: 'vikas.sen@coalindia.gov.in',
    industry_support_type: 'TECHNOLOGY',
    funding_received: '₹4,00,000',
    government_partner: 'Dept of Agriculture & Animal Husbandry',
    department: 'Mechanical Engineering',
    course: 'B.Tech Engineering',
    year: 4,
    research_area: 'Solar Thermal Cold Storage & PCM',
    technologies: ['BLDC Compressor', 'LiFePO4 BMS', 'PCM Salt Hydrates', 'IoT Temperature'],
    objectives: [
      'Maintain 4°C - 8°C temperature without grid electricity for 36 hours',
      'Capacity of 250 kg perishable produce per portable module',
      'Cost below ₹45,000 per unit for village SHG affordability',
    ],
    expected_outcome: 'Field pilot reducing post-harvest tomato losses from 35% to under 4%.',
    current_phase: 'PROTOTYPE',
    progress: 60,
    status: 'ACTIVE',
    start_date: '2026-07-15',
    target_date: '2026-12-20',
    milestones: [
      {
        id: 'm-201',
        title: 'PCM Thermal Chamber Fabrication',
        description: 'Insulated polyurethane cabinet with salt hydrate thermal buffer.',
        due_date: '2026-08-30',
        responsible_member: 'Amit Kerketta',
        status: 'COMPLETED',
        progress: 100,
        completed_at: '2026-08-28',
      },
      {
        id: 'm-202',
        title: 'Solar MPPT Inverter & BLDC Integration',
        description: 'Direct solar DC drive integration without heavy AC inverters.',
        due_date: '2026-09-30',
        responsible_member: 'Nisha Topno',
        status: 'IN_PROGRESS',
        progress: 70,
      },
    ],
    tasks: [],
    documents: [],
    field_testing: [],
    impact: {
      people_benefited: 4800,
      area_covered: 'Bishunpur Tribal Haats',
      problem_resolution_percentage: 60,
      cost_saved: '₹2,10,000',
      time_saved: '20 Days',
      environmental_impact: 'Displaces diesel generator cold vans, saving 1.2 metric tonnes CO2/yr',
      community_feedback: 'Farmer Producer Org (FPO) requested 5 units for potato & tomato preservation.',
      deployment_date: '2026-11-01',
    },
    activity_timeline: [
      {
        id: 'act-201',
        date: 'Jul 15, 2026',
        user: 'Prof. Arvind Sharma',
        action: 'Squad created',
        description: 'Solar Cold Chain Squad registered.',
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'sq-3',
    squad_id: 'SE-003',
    name: 'Mine Runoff Remediation Squad',
    description: 'Developing biochar-zeolite permeable reactive barrier filters to treat acidic coal mine runoff water in Damodar catchment.',
    project_name: 'Biochar Zeolite Acid Mine Drainage Filter',
    problem_id: 'prob-3',
    problem_title: 'Acid mine drainage and heavy metals contaminating Damodar tributary',
    problem_category: 'Environment & Waste',
    problem_location: 'Bokaro & Dhanbad Coalfield Belt',
    problem_priority: 'CRITICAL',
    ai_match_score: 94,
    team_leader_name: 'Rohan Tirkey',
    team_leader_id: 'STU-301',
    members: [
      {
        student_id: 'STU-301',
        name: 'Rohan Tirkey',
        email: 'rohan.t@bitmesra.ac.in',
        department: 'Chemical Eng',
        year: 4,
        skills: ['Adsorption Chemistry', 'Pyrolysis', 'Spectroscopy'],
        role: 'TEAM_LEADER',
        current_task: 'Bamboo Biochar Activation with Alkali',
        task_status: 'COMPLETED',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      },
      {
        student_id: 'STU-302',
        name: 'Anjali Soren',
        email: 'anjali.s@bitmesra.ac.in',
        department: 'Civil Eng',
        year: 3,
        skills: ['Hydraulic Modeling', 'Filter Bed Sizing'],
        role: 'DEVELOPER',
        current_task: 'Gravity Flow Rate Optimization',
        task_status: 'IN_PROGRESS',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    ],
    max_team_size: 4,
    faculty_mentor_name: 'Dr. Pradeep Mishra',
    faculty_mentor_email: 'pmishra@bitmesra.ac.in',
    faculty_mentor_department: 'Chemical Engineering',
    industry_partner_name: 'Jindal Steel CSR',
    industry_partner_mentor: 'Er. S. Chatterjee',
    industry_partner_designation: 'Effluent Treatment Chief',
    industry_partner_email: 's.chatterjee@jindalsteel.com',
    industry_support_type: 'R&D',
    funding_received: '₹3,20,000',
    government_partner: 'Jharkhand State Pollution Control Board',
    department: 'Chemical Engineering',
    course: 'B.Tech Engineering',
    year: 4,
    research_area: 'Acid Mine Drainage (AMD) Remediation',
    technologies: ['Activated Biochar', 'Natural Clinoptilolite Zeolite', 'Gravity Bed'],
    objectives: [
      'Neutralize AMD pH from 2.8 to 6.8+',
      '95%+ removal of Fe, Mn, and Sulfate ions',
      'Regenerable filter media with 6-month field lifespan',
    ],
    expected_outcome: 'Low-cost passive permeable reactive filter deployed at 3 open cast coal drain outlets.',
    current_phase: 'FIELD_TRIAL',
    progress: 85,
    status: 'ACTIVE',
    start_date: '2026-06-01',
    target_date: '2026-11-15',
    milestones: [
      {
        id: 'm-301',
        title: 'Benchtop Column Breakthrough Study',
        description: 'Validated 100 bed volumes with zero heavy metal breakthrough.',
        due_date: '2026-07-20',
        responsible_member: 'Rohan Tirkey',
        status: 'COMPLETED',
        progress: 100,
        completed_at: '2026-07-18',
      },
      {
        id: 'm-302',
        title: '500 L/hr Pilot Filter Deployment',
        description: 'Install modular steel reactor at Bermo coal discharge drain.',
        due_date: '2026-09-10',
        responsible_member: 'Anjali Soren',
        status: 'COMPLETED',
        progress: 100,
        completed_at: '2026-09-08',
      },
    ],
    tasks: [],
    documents: [],
    field_testing: [
      {
        id: 'ft-301',
        location: 'Bermo Open Cast Mine Drain #2, Bokaro',
        date: 'Sep 09, 2026',
        objective: 'Measure pH and Iron concentration before and after 24 hrs continuous throughput.',
        participants: ['Rohan Tirkey', 'Anjali Soren', 'JSPCB Inspection Officer'],
        observed_results: 'Inlet pH: 3.1 ➔ Outlet pH: 7.2; Total Iron reduced from 18.4 mg/L to 0.2 mg/L.',
        issues_found: 'Filter media requires weekly backwash to clear heavy silt.',
        feedback: 'JSPCB certified compliant for agricultural discharge.',
        photos_videos: [],
        status: 'COMPLETED',
      },
    ],
    impact: {
      people_benefited: 28000,
      area_covered: 'Damodar downstream (32 agricultural villages)',
      problem_resolution_percentage: 90,
      cost_saved: '₹8,50,000',
      time_saved: '90 Days',
      environmental_impact: 'Restores aquatic biodiversity across 12 km stretch of river basin',
      community_feedback: 'Downstream farmers resumed paddy irrigation safely without soil acidification.',
      deployment_date: '2026-09-12',
    },
    activity_timeline: [
      {
        id: 'act-301',
        date: 'Jun 01, 2026',
        user: 'Prof. Arvind Sharma',
        action: 'Squad created',
        description: 'Mine Runoff Remediation Squad registered.',
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

class SquadService {
  private getLocalSquads(): StudentSquad[] {
    const saved = localStorage.getItem('c2c_student_squads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    localStorage.setItem('c2c_student_squads', JSON.stringify(DEFAULT_MOCK_SQUADS));
    return DEFAULT_MOCK_SQUADS;
  }

  private saveLocalSquads(squads: StudentSquad[]) {
    localStorage.setItem('c2c_student_squads', JSON.stringify(squads));
  }

  async getSquads(params?: {
    search?: string;
    status?: string;
    department?: string;
    mentor?: string;
    industry?: string;
    current_phase?: string;
    sort_by?: string;
    sort_order?: number;
  }): Promise<{ items: StudentSquad[]; total: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.status && params.status !== 'ALL') query.append('status', params.status);
      if (params?.department && params.department !== 'ALL') query.append('department', params.department);
      if (params?.mentor && params.mentor !== 'ALL') query.append('mentor', params.mentor);
      if (params?.industry && params.industry !== 'ALL') query.append('industry', params.industry);
      if (params?.current_phase && params.current_phase !== 'ALL') query.append('current_phase', params.current_phase);
      if (params?.sort_by) query.append('sort_by', params.sort_by);
      if (params?.sort_order) query.append('sort_order', String(params.sort_order));

      const res = await fetch(`${API_BASE_URL}/university/squads?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data.items)) {
          this.saveLocalSquads(json.data.items);
          return { items: json.data.items, total: json.data.total };
        }
      }
    } catch (err) {
      // fallback to local storage
    }

    // Local fallback filter & search
    let list = this.getLocalSquads();

    if (params?.status && params.status !== 'ALL') {
      list = list.filter((s) => s.status === params.status);
    }
    if (params?.department && params.department !== 'ALL') {
      list = list.filter((s) => s.department?.toLowerCase().includes(params.department!.toLowerCase()) || s.members.some(m => m.department.toLowerCase().includes(params.department!.toLowerCase())));
    }
    if (params?.mentor && params.mentor !== 'ALL') {
      list = list.filter((s) => s.faculty_mentor_name?.toLowerCase().includes(params.mentor!.toLowerCase()));
    }
    if (params?.industry && params.industry !== 'ALL') {
      list = list.filter((s) => s.industry_partner_name?.toLowerCase().includes(params.industry!.toLowerCase()));
    }
    if (params?.current_phase && params.current_phase !== 'ALL') {
      list = list.filter((s) => s.current_phase === params.current_phase);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.squad_id.toLowerCase().includes(q) ||
          s.project_name?.toLowerCase().includes(q) ||
          s.problem_title?.toLowerCase().includes(q) ||
          s.team_leader_name?.toLowerCase().includes(q) ||
          s.members.some((m) => m.name.toLowerCase().includes(q) || m.skills.some((sk) => sk.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (params?.sort_by === 'progress') {
      list.sort((a, b) => (params.sort_order === 1 ? a.progress - b.progress : b.progress - a.progress));
    } else if (params?.sort_by === 'name') {
      list.sort((a, b) => (params.sort_order === 1 ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    } else if (params?.sort_by === 'squad_id') {
      list.sort((a, b) => (params.sort_order === 1 ? a.squad_id.localeCompare(b.squad_id) : b.squad_id.localeCompare(a.squad_id)));
    }

    return { items: list, total: list.length };
  }

  async getSquadSummary(): Promise<SquadSummaryKpis> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/summary`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squads = this.getLocalSquads();
    const total_squads = squads.length;
    const active_squads = squads.filter((s) => s.status === 'ACTIVE').length;
    const completed_squads = squads.filter((s) => s.status === 'COMPLETED').length;
    const students_participating = squads.reduce((acc, s) => acc + (s.members?.length || 0), 0);
    const field_trials = squads.reduce((acc, s) => acc + (s.field_testing?.length || 0), 0);
    const solutions_developed = squads.filter((s) => s.current_phase === 'DEPLOYMENT' || s.current_phase === 'COMPLETED').length;

    return {
      total_squads,
      active_squads,
      completed_squads,
      students_participating,
      projects_in_progress: active_squads,
      field_trials,
      solutions_developed,
    };
  }

  async getSquadById(squadId: string): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squads = this.getLocalSquads();
    return squads.find((s) => s.squad_id === squadId || s._id === squadId) || null;
  }

  async createSquad(payload: Partial<StudentSquad>): Promise<StudentSquad> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const local = this.getLocalSquads();
          local.unshift(json.data);
          this.saveLocalSquads(local);
          return json.data;
        }
      }
    } catch (err) {
      // fallback
    }

    const squads = this.getLocalSquads();
    const nextNum = squads.length + 1;
    const squadId = payload.squad_id || `SE-${String(nextNum).padStart(3, '0')}`;
    const newSquad: StudentSquad = {
      _id: `sq-${Date.now()}`,
      squad_id: squadId,
      name: payload.name || 'New Engineering Squad',
      description: payload.description || '',
      project_name: payload.project_name || '',
      problem_id: payload.problem_id,
      problem_title: payload.problem_title,
      problem_category: payload.problem_category,
      problem_location: payload.problem_location,
      problem_priority: payload.problem_priority,
      ai_match_score: payload.ai_match_score || 85,
      team_leader_name: payload.team_leader_name,
      team_leader_id: payload.team_leader_id,
      members: payload.members || [],
      max_team_size: payload.max_team_size || 6,
      faculty_mentor_name: payload.faculty_mentor_name,
      faculty_mentor_email: payload.faculty_mentor_email,
      faculty_mentor_department: payload.faculty_mentor_department,
      industry_partner_name: payload.industry_partner_name,
      industry_partner_mentor: payload.industry_partner_mentor,
      industry_support_type: payload.industry_support_type,
      funding_received: payload.funding_received || '₹0',
      government_partner: payload.government_partner,
      department: payload.department || 'Engineering',
      course: payload.course || 'B.Tech',
      year: payload.year || 4,
      research_area: payload.research_area,
      technologies: payload.technologies || [],
      objectives: payload.objectives || [],
      expected_outcome: payload.expected_outcome,
      current_phase: payload.current_phase || 'PROBLEM_ANALYSIS',
      progress: payload.progress || 10,
      status: payload.status || 'ACTIVE',
      start_date: payload.start_date || new Date().toISOString().split('T')[0],
      target_date: payload.target_date,
      milestones: payload.milestones || [],
      tasks: payload.tasks || [],
      documents: payload.documents || [],
      field_testing: payload.field_testing || [],
      impact: payload.impact,
      activity_timeline: [
        {
          id: `act-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          user: 'University Coordinator',
          action: 'Squad created',
          description: `Squad '${payload.name}' registered with ID ${squadId}.`,
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    squads.unshift(newSquad);
    this.saveLocalSquads(squads);
    return newSquad;
  }

  async updateSquad(squadId: string, payload: Partial<StudentSquad>): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const squads = this.getLocalSquads();
          const idx = squads.findIndex((s) => s.squad_id === squadId || s._id === squadId);
          if (idx !== -1) {
            squads[idx] = json.data;
            this.saveLocalSquads(squads);
          }
          return json.data;
        }
      }
    } catch (err) {
      // fallback
    }

    const squads = this.getLocalSquads();
    const idx = squads.findIndex((s) => s.squad_id === squadId || s._id === squadId);
    if (idx === -1) return null;

    const current = squads[idx];
    const updated: StudentSquad = {
      ...current,
      ...payload,
      updated_at: new Date().toISOString(),
    };
    squads[idx] = updated;
    this.saveLocalSquads(squads);
    return updated;
  }

  async deleteSquad(squadId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const squads = this.getLocalSquads().filter((s) => s.squad_id !== squadId && s._id !== squadId);
        this.saveLocalSquads(squads);
        return true;
      }
    } catch (err) {
      // fallback
    }

    const squads = this.getLocalSquads().filter((s) => s.squad_id !== squadId && s._id !== squadId);
    this.saveLocalSquads(squads);
    return true;
  }

  async addMember(squadId: string, member: SquadMember): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const members = [...squad.members, member];
    return this.updateSquad(squadId, { members });
  }

  async removeMember(squadId: string, studentId: string): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/members/${studentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const members = squad.members.filter((m) => m.student_id !== studentId);
    return this.updateSquad(squadId, { members });
  }

  async addMilestone(squadId: string, milestone: SquadMilestone): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestone),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const milestones = [...squad.milestones, { ...milestone, id: `m-${Date.now()}` }];
    return this.updateSquad(squadId, { milestones });
  }

  async updateMilestone(squadId: string, milestoneId: string, update: Partial<SquadMilestone>): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const milestones = squad.milestones.map((m) => (m.id === milestoneId ? { ...m, ...update } : m));
    return this.updateSquad(squadId, { milestones });
  }

  async addTask(squadId: string, task: SquadTask): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const tasks = [...squad.tasks, { ...task, id: `t-${Date.now()}` }];
    return this.updateSquad(squadId, { tasks });
  }

  async updateTask(squadId: string, taskId: string, update: Partial<SquadTask>): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const tasks = squad.tasks.map((t) => (t.id === taskId ? { ...t, ...update } : t));
    return this.updateSquad(squadId, { tasks });
  }

  async addFieldTest(squadId: string, test: FieldTestRecord): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/field-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const field_testing = [...squad.field_testing, { ...test, id: `ft-${Date.now()}` }];
    return this.updateSquad(squadId, { field_testing });
  }

  async addDocument(squadId: string, doc: SquadDocumentItem): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const documents = [...squad.documents, { ...doc, id: `doc-${Date.now()}` }];
    return this.updateSquad(squadId, { documents });
  }

  async deleteDocument(squadId: string, docId: string): Promise<StudentSquad | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/university/squads/${squadId}/documents/${docId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }

    const squad = await this.getSquadById(squadId);
    if (!squad) return null;
    const documents = squad.documents.filter((d) => d.id !== docId);
    return this.updateSquad(squadId, { documents });
  }
}

export const squadService = new SquadService();
