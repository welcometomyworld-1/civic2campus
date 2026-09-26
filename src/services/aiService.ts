import {
  ProblemDomain,
  PriorityLevel,
  UniversityItem,
  IndustryPartnerItem,
  FacultyProfile,
  StudentProfile,
} from '../types';
import { UNIVERSITIES, INDUSTRY_PARTNERS, FACULTY_ROSTER, STUDENT_ROSTER } from '../data/mockData';

export interface AIClassificationResult {
  domain: ProblemDomain;
  subdomain: string;
  problemType: string;
  keywords: string[];
  affectedPopulationEstimate: number;
  confidence: number;
  summary: string;
}

export interface AIPriorityResult {
  priorityScore: number;
  priorityLevel: PriorityLevel;
  reason: string;
  metrics: {
    urgency: number;
    populationImpact: number;
    healthImpact: number;
    safetyImpact: number;
    economicImpact: number;
    environmentalImpact: number;
    durationImpact: number;
  };
}

export interface AIDuplicateResult {
  similarityScore: number;
  clusterId: string;
  clusterName: string;
  relatedReportsCount: number;
  potentiallyAffectedCitizens: number;
  similarProblems: { id: string; title: string; district: string; similarity: number }[];
}

export interface AISolutionProposal {
  solutionTitle: string;
  technology: {
    coreHardware: string[];
    softwareStack: string[];
    sensors: string[];
    connectivity: string;
  };
  implementationPhases: {
    phase: string;
    duration: string;
    description: string;
  }[];
  expectedImpact: string;
  estimatedCost: string;
  scalability: 'High' | 'Very High' | 'Moderate';
  budgetBreakdown: { item: string; cost: string }[];
  riskMitigation: string[];
}

export class AIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * 1. Problem Classification
   */
  public async classifyProblem(text: string, district?: string): Promise<AIClassificationResult> {
    const lower = text.toLowerCase();

    let domain: ProblemDomain = 'Infrastructure';
    let subdomain = 'Public Utilities & Rural Infrastructure';
    let problemType = 'Hardware & Civil Remediation';
    let keywords = ['Civic Infrastructure', 'Rural Access'];
    let affectedPopulationEstimate = 450;
    let confidence = 92;

    if (lower.includes('water') || lower.includes('handpump') || lower.includes('pump') || lower.includes('drinking') || lower.includes('borewell') || lower.includes('tap') || lower.includes('pond')) {
      domain = 'Water';
      subdomain = 'Rural Water Supply & Groundwater Telemetry';
      problemType = 'IoT Hydro-Monitoring & Supply Restoration';
      keywords = ['Broken Handpump', 'Groundwater Depletion', 'Drinking Water Crisis', 'Fluoride Check', 'Telemetry'];
      affectedPopulationEstimate = 640;
      confidence = 94;
    } else if (lower.includes('health') || lower.includes('clinic') || lower.includes('doctor') || lower.includes('hospital') || lower.includes('medicine') || lower.includes('maternal')) {
      domain = 'Healthcare';
      subdomain = 'Decentralized Tele-clinic & Diagnostic Pods';
      problemType = 'Telemedicine & Rapid Diagnostic Hardware';
      keywords = ['Maternal Telehealth', 'Primary Health Centre', 'Remote Diagnostics', 'Emergency Transit'];
      affectedPopulationEstimate = 1850;
      confidence = 91;
    } else if (lower.includes('crop') || lower.includes('farmer') || lower.includes('irrigation') || lower.includes('paddy') || lower.includes('soil') || lower.includes('drought') || lower.includes('agriculture')) {
      domain = 'Agriculture';
      subdomain = 'Smart Micro-Irrigation & Soil Telemetry';
      problemType = 'Precision Agritech & Solar Pumping';
      keywords = ['Check Dam Leakage', 'Drip Micro-Valves', 'Soil Moisture Sensors', 'Tribal Smallholders'];
      affectedPopulationEstimate = 3200;
      confidence = 93;
    } else if (lower.includes('school') || lower.includes('teacher') || lower.includes('student') || lower.includes('education') || lower.includes('classroom')) {
      domain = 'Education';
      subdomain = 'Solar-DC Micro Powered Interactive Classrooms';
      problemType = 'Digital Infrastructure & Clean Energy';
      keywords = ['Ashram School', 'Digital Classroom', 'Solar DC Hub', 'Tribal Education'];
      affectedPopulationEstimate = 1200;
      confidence = 89;
    } else if (lower.includes('waste') || lower.includes('drain') || lower.includes('garbage') || lower.includes('sewage') || lower.includes('sanitation')) {
      domain = 'Sanitation';
      subdomain = 'Smart Hydro-Trash Catchers & Overflow Sensors';
      problemType = 'Civic IoT & Solid Waste Management';
      keywords = ['Drainage Blockage', 'Urban Runoff', 'Overflow Sensor', 'Harmu Basin'];
      affectedPopulationEstimate = 8500;
      confidence = 90;
    } else if (lower.includes('mine') || lower.includes('acid') || lower.includes('pollution') || lower.includes('coal') || lower.includes('forest') || lower.includes('environment')) {
      domain = 'Environment';
      subdomain = 'Acid Mine Drainage Remediation & Eco-Restoration';
      problemType = 'Constructed Wetland Bio-Purification';
      keywords = ['Acid Mine Water', 'Constructed Wetlands', 'pH Telemetry', 'Heavy Metal Bio-filter'];
      affectedPopulationEstimate = 4200;
      confidence = 96;
    }

    return {
      domain,
      subdomain,
      problemType,
      keywords,
      affectedPopulationEstimate,
      confidence,
      summary: `AI detected recurring ${domain} challenge in ${district || 'Jharkhand'} involving ${keywords.slice(0, 3).join(', ')}.`,
    };
  }

  /**
   * 2. Priority Analysis
   */
  public async analyzePriority(text: string, domain: ProblemDomain, reportedPopulation: number): Promise<AIPriorityResult> {
    const lower = text.toLowerCase();

    let urgency = 85;
    let populationImpact = Math.min(95, Math.max(60, Math.round(reportedPopulation / 20)));
    let healthImpact = 75;
    let safetyImpact = 70;
    let economicImpact = 65;
    let environmentalImpact = 70;
    let durationImpact = 80;

    if (lower.includes('months') || lower.includes('broken') || lower.includes('acute') || lower.includes('severe')) {
      durationImpact = 94;
      urgency = 92;
    }

    if (domain === 'Water' || domain === 'Healthcare') {
      healthImpact = 95;
      urgency = Math.max(urgency, 90);
    }

    if (domain === 'Agriculture') {
      economicImpact = 92;
      environmentalImpact = 85;
    }

    if (domain === 'Environment') {
      environmentalImpact = 98;
      healthImpact = 90;
    }

    const priorityScore = Math.round(
      urgency * 0.25 +
      populationImpact * 0.2 +
      healthImpact * 0.2 +
      safetyImpact * 0.1 +
      economicImpact * 0.1 +
      environmentalImpact * 0.1 +
      durationImpact * 0.05
    );

    let priorityLevel: PriorityLevel = 'MEDIUM';
    if (priorityScore >= 90) priorityLevel = 'CRITICAL';
    else if (priorityScore >= 78) priorityLevel = 'HIGH';
    else if (priorityScore >= 60) priorityLevel = 'MEDIUM';
    else priorityLevel = 'LOW';

    let reason = 'High urgency civic failure with compounded public health risk and chronic duration (>60 days). Immediate multidisciplinary university intervention recommended.';
    if (priorityLevel === 'HIGH') {
      reason = 'Significant economic and community livelihood risk with widespread population impact requiring technological automation.';
    }

    return {
      priorityScore,
      priorityLevel,
      reason,
      metrics: {
        urgency,
        populationImpact,
        healthImpact,
        safetyImpact,
        economicImpact,
        environmentalImpact,
        durationImpact,
      },
    };
  }

  /**
   * 3. Duplicate Detection & Semantic Clustering
   */
  public async detectDuplicates(title: string, description: string, domain: ProblemDomain): Promise<AIDuplicateResult> {
    const lower = (title + ' ' + description).toLowerCase();

    if (domain === 'Water' || lower.includes('handpump') || lower.includes('pump') || lower.includes('water')) {
      return {
        similarityScore: 94,
        clusterId: 'WTR-102',
        clusterName: 'Gumla-Ranchi Rural Handpump & Aquifer Outages',
        relatedReportsCount: 43,
        potentiallyAffectedCitizens: 2840,
        similarProblems: [
          { id: 'CIV-2026-00089', title: 'Toto block ward 4 handpump casing collapsed', district: 'Gumla', similarity: 96 },
          { id: 'CIV-2026-00074', title: 'Drinking water borewell dried up after solar pump motor burnout', district: 'Gumla', similarity: 91 },
          { id: 'CIV-2026-00052', title: 'Community tap dry for 8 weeks in Sisai block', district: 'Gumla', similarity: 88 },
        ],
      };
    }

    if (domain === 'Environment' || lower.includes('mine') || lower.includes('acid')) {
      return {
        similarityScore: 92,
        clusterId: 'ENV-204',
        clusterName: 'Dhanbad-Bokaro Acid Slurry Runoff Cluster',
        relatedReportsCount: 18,
        potentiallyAffectedCitizens: 12400,
        similarProblems: [
          { id: 'CIV-2026-00104', title: 'Orange mine leachate entering Katras pond', district: 'Dhanbad', similarity: 95 },
          { id: 'CIV-2026-00083', title: 'Acrid coal runoff killing fish in municipal tank', district: 'Bokaro', similarity: 89 },
        ],
      };
    }

    return {
      similarityScore: 86,
      clusterId: 'CIV-CLUST-408',
      clusterName: 'Statewide Recurring Civic Hotspot',
      relatedReportsCount: 12,
      potentiallyAffectedCitizens: 3400,
      similarProblems: [
        { id: 'CIV-2026-00031', title: 'Similar community infrastructure outage', district: 'Ranchi', similarity: 84 },
      ],
    };
  }

  /**
   * 4. Match Universities
   */
  public matchUniversities(domain: ProblemDomain): UniversityItem[] {
    const scored = UNIVERSITIES.map((uni) => {
      let score = 70;
      if (domain === 'Water') {
        if (uni.id === 'bit_mesra') score = 94;
        else if (uni.id === 'iit_ism_dhanbad') score = 89;
        else if (uni.id === 'nit_jamshedpur') score = 87;
        else if (uni.id === 'birsa_agri_university') score = 84;
        else score = 74;
      } else if (domain === 'Agriculture') {
        if (uni.id === 'birsa_agri_university') score = 96;
        else if (uni.id === 'bit_mesra') score = 88;
        else if (uni.id === 'nit_jamshedpur') score = 85;
        else score = 75;
      } else if (domain === 'Environment') {
        if (uni.id === 'iit_ism_dhanbad') score = 97;
        else if (uni.id === 'bit_mesra') score = 90;
        else if (uni.id === 'nit_jamshedpur') score = 84;
        else score = 76;
      } else if (domain === 'Healthcare') {
        if (uni.id === 'ranchi_university') score = 92;
        else if (uni.id === 'bit_mesra') score = 88;
        else if (uni.id === 'iit_ism_dhanbad') score = 80;
        else score = 72;
      } else {
        score = 85;
      }
      return { ...uni, matchScore: score };
    });

    return scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  /**
   * 5. Match Industries
   */
  public matchIndustries(domain: ProblemDomain): IndustryPartnerItem[] {
    const scored = INDUSTRY_PARTNERS.map((ind) => {
      let score = 72;
      if (domain === 'Water') {
        if (ind.id === 'watertech_innovations') score = 91;
        else if (ind.id === 'tata_steel_csr') score = 89;
        else if (ind.id === 'solarrural_labs') score = 84;
      } else if (domain === 'Agriculture') {
        if (ind.id === 'agrojharkhand_technologies') score = 94;
        else if (ind.id === 'tata_steel_csr') score = 90;
        else if (ind.id === 'solarrural_labs') score = 86;
      } else if (domain === 'Environment') {
        if (ind.id === 'tata_steel_csr') score = 95;
        else if (ind.id === 'watertech_innovations') score = 88;
      } else if (domain === 'Healthcare') {
        if (ind.id === 'healthbridge_india') score = 93;
        else if (ind.id === 'tata_steel_csr') score = 88;
      }
      return { ...ind, compatibilityScore: score };
    });

    return scored.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
  }

  /**
   * 6. Multidisciplinary Team Builder Recommendation
   */
  public recommendTeam(domain: ProblemDomain): {
    faculty: FacultyProfile[];
    students: StudentProfile[];
    departments: string[];
  } {
    return {
      faculty: FACULTY_ROSTER.slice(0, 3),
      students: STUDENT_ROSTER,
      departments: ['Civil & Environmental Engineering', 'IoT & Embedded Systems Lab', 'Computer Science & AI', 'Rural Development Field Extension'],
    };
  }

  /**
   * 7. Generate AI Solution Proposal
   */
  public async generateSolution(problemTitle: string, domain: ProblemDomain, district: string): Promise<AISolutionProposal> {
    if (domain === 'Water') {
      return {
        solutionTitle: 'Solar-Powered IoT Groundwater Telemetry & Predictive Handpump Health System',
        technology: {
          coreHardware: ['ESP32-S3 Microcontroller', '10W Monocrystalline PV Panel', '3.7V LiFePO4 Battery Pack', 'IP68 Waterproof Housing'],
          softwareStack: ['FastAPI Backend', 'PostgreSQL / TimescaleDB', 'React Mobile PWA', 'Twilio / NIC SMS Gateway'],
          sensors: ['JSN-SR04T Waterproof Ultrasonic Level Sensor', 'Hall-Effect Inline Water Flow Meter', 'Electrochemical Fluoride Probe'],
          connectivity: 'Sub-GHz LoRaWAN Mesh (865-867 MHz India Band) with 4G Gateway fallback',
        },
        implementationPhases: [
          { phase: '1. Field Survey & Bathymetry', duration: 'Weeks 1-2', description: 'Drone & geological mapping of borewell aquifers in ' + district + ' village blocks.' },
          { phase: '2. Hardware Prototyping', duration: 'Weeks 3-4', description: 'Assembly of ruggedized sensor pods and bench calibration in university IoT lab.' },
          { phase: '3. 10-Village Pilot Deployment', duration: 'Weeks 5-7', description: 'Installation on 10 community handpumps and testing LoRa gateway signal reach.' },
          { phase: '4. Panchayat Handover & State Monitoring', duration: 'Weeks 8-10', description: 'Live onboarding to Jharkhand Jal Jeevan Mission telemetry portal.' },
        ],
        expectedImpact: 'Guaranteed drinking water access for 2,840+ rural citizens with <24h automated repair response times.',
        estimatedCost: '₹2,40,000 – ₹3,80,000',
        scalability: 'Very High',
        budgetBreakdown: [
          { item: '10x Solar IoT Sensor Pods & Enclosures', cost: '₹95,000' },
          { item: 'LoRaWAN Long-Range Gateway Mast', cost: '₹45,000' },
          { item: 'Calibration Chemical Reagents & Field Kits', cost: '₹25,000' },
          { item: 'Student Innovation Stipends & Field Travel', cost: '₹40,000' },
          { item: 'Community Training & Mobile SIM Data Packs', cost: '₹15,000' },
        ],
        riskMitigation: [
          'Anti-theft tamper switch with GPS tracking if sensor enclosure is opened',
          'Conformal silicon PCB coating preventing corrosion from high-salinity air',
          '7-day offline data logging during extended monsoon overcast days',
        ],
      };
    }

    return {
      solutionTitle: `Decentralized AI-Driven ${domain} Intervention Module`,
      technology: {
        coreHardware: ['Edge AI Compute Node', 'Solar Backup Battery', 'Ruggedized Sensor Array'],
        softwareStack: ['FastAPI Microservices', 'React 19 Dashboard', 'SMS Dispatcher'],
        sensors: ['Multi-parameter Telemetry Sensors', 'Low-Power GPS Tracker'],
        connectivity: 'Cellular 4G LTE / LoRaWAN Hybrid',
      },
      implementationPhases: [
        { phase: 'Phase 1: Validation', duration: '2 Weeks', description: 'On-ground requirement gathering and site engineering.' },
        { phase: 'Phase 2: Prototype', duration: '3 Weeks', description: 'Hardware manufacturing and firmware compilation.' },
        { phase: 'Phase 3: Field Pilot', duration: '4 Weeks', description: 'Village community testing and accuracy validation.' },
        { phase: 'Phase 4: Full Deployment', duration: 'Ongoing', description: 'Scale-out to district administrative blocks.' },
      ],
      expectedImpact: 'Measurable social impact improving living standards for 5,000+ citizens.',
      estimatedCost: '₹3,00,000 – ₹5,00,000',
      scalability: 'High',
      budgetBreakdown: [
        { item: 'Core Sensor Hardware & Solar Pods', cost: '₹1,20,000' },
        { item: 'Microgrid / Energy Storage Unit', cost: '₹65,000' },
        { item: 'Student Prototyping & Field Expenses', cost: '₹45,000' },
      ],
      riskMitigation: ['Modular hot-swappable components for rapid local technician servicing.'],
    };
  }

  /**
   * 8. Statewide Innovation Opportunity Engine
   */
  public getInnovationOpportunityMap() {
    return {
      domainsBreakdown: [
        { domain: 'Water Infrastructure', percentage: 38, count: 1840, color: '#0284c7' },
        { domain: 'Healthcare Access', percentage: 24, count: 1160, color: '#e11d48' },
        { domain: 'Agriculture & Irrigation', percentage: 18, count: 870, color: '#16a34a' },
        { domain: 'Education & Schools', percentage: 12, count: 580, color: '#f59e0b' },
        { domain: 'Sanitation & Waste', percentage: 8, count: 390, color: '#8b5cf6' },
      ],
      topInsights: [
        'Water infrastructure represents the largest recurring challenge across 6 districts, heavily clustered around rural handpump mechanical failures.',
        'Southern tribal belt (Gumla, Simdega, Khunti) shows 74% higher adoption velocity for decentralized solar-powered microgrid prototypes.',
        'IIT (ISM) Dhanbad and BIT Mesra account for 58% of all filed civic technology utility patents in Jharkhand.',
        'Tata Steel Foundation CSR co-funding has accelerated prototype-to-field test conversion by 3.4x.',
      ],
    };
  }
}

export const aiService = AIService.getInstance();
