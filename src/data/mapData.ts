import { ProblemDomain, PriorityLevel, ProblemStatus } from '../types';

export type MarkerCategory = 'problem' | 'university' | 'industry' | 'solution';

export interface BaseMapItem {
  id: string;
  name: string;
  category: MarkerCategory;
  coordinates: [number, number]; // [lat, lng]
  locationName: string;
  district: string;
  state: string;
  description: string;
}

export interface MapProblemItem extends BaseMapItem {
  category: 'problem';
  domain: ProblemDomain;
  priority: PriorityLevel;
  priorityScore: number;
  status: ProblemStatus;
  affectedPopulation: number;
  reportedDate: string;
  reporter: string;
  aiClassification: {
    urgency: number;
    healthImpact: number;
    environmentalImpact: number;
    economicImpact: number;
    confidence: number;
    reasoning: string;
    keyTerms: string[];
  };
  aiRecommendedMatches: {
    university: {
      id: string;
      name: string;
      matchPercentage: number;
      distanceKm: number;
      expertise: string;
      reason: string;
    };
    industry: {
      id: string;
      name: string;
      matchPercentage: number;
      distanceKm: number;
      expertise: string;
      supportOffered: string;
      reason: string;
    };
  };
}

export interface MapUniversityItem extends BaseMapItem {
  category: 'university';
  code: string;
  ranking: string;
  established: number;
  expertise: string[];
  facultyCount: number;
  studentsCount: number;
  activeProjects: number;
  deployedSolutions: number;
  topDepartments: string[];
  labFacilities: string[];
  avatarUrl?: string;
}

export interface MapIndustryItem extends BaseMapItem {
  category: 'industry';
  companyType: 'Corporate CSR' | 'DeepTech Startup' | 'CleanTech' | 'AgriTech Enterprise' | 'Healthcare Provider';
  focusAreas: string[];
  expertise: string[];
  technologies: string[];
  supportAvailable: string;
  csrFundingAnnual: string;
  activeProjectsSupported: number;
  logoUrl?: string;
}

export interface MapSolutionItem extends BaseMapItem {
  category: 'solution';
  problemSolved: string;
  deployedByUniversity: string;
  supportedByIndustry: string;
  deploymentStatus: 'Live & Operational' | 'Pilot Verification' | 'Scaling Phase' | 'Field Tested';
  impactCitizens: number;
  techStack: string[];
  hardwareSpecs: string;
  dateDeployed: string;
  impactMetrics: {
    waterSavedLitersDaily?: string;
    energyGeneratedKwh?: string;
    diagnosticWaitTimeReduced?: string;
    cropYieldIncrease?: string;
  };
}

export type MapItem = MapProblemItem | MapUniversityItem | MapIndustryItem | MapSolutionItem;

export const MAP_ITEMS: MapItem[] = [
  // ==================== 🔴 PROBLEMS ====================
  {
    id: 'prob-gumla-01',
    name: 'Village Handpump Failure & Water Table Crisis',
    category: 'problem',
    coordinates: [23.0441, 84.5414],
    locationName: 'Toto Block, Kharwagarh Village',
    district: 'Gumla',
    state: 'Jharkhand',
    description: 'Deep aquifer drawdown has led to mechanical pump cavitation. Over 120 tribal households face acute drinking water scarcity with rising gastrointestinal distress.',
    domain: 'Water',
    priority: 'CRITICAL',
    priorityScore: 94,
    status: 'AI_ANALYZED',
    affectedPopulation: 640,
    reportedDate: '3 days ago',
    reporter: 'Mangal Tirkey (Gram Pradhan)',
    aiClassification: {
      urgency: 95,
      healthImpact: 92,
      environmentalImpact: 88,
      economicImpact: 76,
      confidence: 96,
      reasoning: 'Severe microbial pathogen threat with high fluoride risk. Immediate solar-assisted filtration & aquifer level telemetry recommended.',
      keyTerms: ['Broken Handpump', 'Groundwater Depletion', 'Fluoride Hazard', 'Water Scarcity', 'Toto Block Gumla'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-bit-mesra',
        name: 'Birla Institute of Technology (BIT) Mesra',
        matchPercentage: 96,
        distanceKm: 85,
        expertise: 'Hydro-geology & LoRaWAN Water Telemetry',
        reason: 'BIT Mesra holds 3 active patents in decentralized aquifer sensors and ceramic fluoride filters.',
      },
      industry: {
        id: 'ind-watertech',
        name: 'WaterTech Innovations Ltd.',
        matchPercentage: 92,
        distanceKm: 82,
        expertise: 'Ultrasonic Depth Probes & Solar Telemetry',
        supportOffered: '₹2.5 Lakhs hardware kit & fast-track deployment grant',
        reason: 'WaterTech manufactures direct-fit ESP32 borehole sensors designed for high-iron soils.',
      },
    },
  },
  {
    id: 'prob-dhanbad-01',
    name: 'Subsurface Acid Mine Drainage Seepage',
    category: 'problem',
    coordinates: [23.7957, 86.4304],
    locationName: 'Katrasgarh, Jharia Coal Belt',
    district: 'Dhanbad',
    state: 'Jharkhand',
    description: 'Abandoned opencast pit runoff has turned community reservoir water acidic (pH 4.2), leaching heavy metals into domestic pipelines.',
    domain: 'Environment',
    priority: 'CRITICAL',
    priorityScore: 97,
    status: 'PROTOTYPE',
    affectedPopulation: 4200,
    reportedDate: '1 week ago',
    reporter: 'Sunil Mahto (Community Activist)',
    aiClassification: {
      urgency: 98,
      healthImpact: 96,
      environmentalImpact: 99,
      economicImpact: 84,
      confidence: 97,
      reasoning: 'Dangerous sulfur and heavy metal runoff impacting both municipal storage and local groundwater table.',
      keyTerms: ['Acid Mine Drainage', 'Jharia Coal Belt', 'Heavy Metals', 'pH Contamination'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-iit-dhanbad',
        name: 'IIT (ISM) Dhanbad',
        matchPercentage: 98,
        distanceKm: 12,
        expertise: 'Geochemistry & Subsurface Remediation',
        reason: 'IIT-ISM Dhanbad is national lead in bio-char acid neutralization and automated pH balancing.',
      },
      industry: {
        id: 'ind-tata-csr',
        name: 'Tata Steel Foundation (CSR)',
        matchPercentage: 94,
        distanceKm: 98,
        expertise: 'Industrial Effluent Neutralization & Civil Check-Dams',
        supportOffered: '₹8.0 Lakhs CSR co-funding for limestone bed bio-reactor',
        reason: 'Tata Steel CSR has active mandate for coalfield environmental restoration in Jharkhand.',
      },
    },
  },
  {
    id: 'prob-palamu-01',
    name: 'Maternal Telehealth Emergency Deficit',
    category: 'problem',
    coordinates: [23.9041, 84.0725],
    locationName: 'Semari Village, Manatu Block',
    district: 'Palamu',
    state: 'Jharkhand',
    description: 'Expectant mothers must travel 22 km over unpaved forest terrain to access basic ultrasound or emergency obstetric triage.',
    domain: 'Healthcare',
    priority: 'CRITICAL',
    priorityScore: 91,
    status: 'PILOT',
    affectedPopulation: 1850,
    reportedDate: '2 weeks ago',
    reporter: 'Dr. Anita Dungdung (ASHA Coord)',
    aiClassification: {
      urgency: 94,
      healthImpact: 96,
      environmentalImpact: 50,
      economicImpact: 82,
      confidence: 93,
      reasoning: 'Critical transit barrier during monsoon. Solar-powered tele-diagnostics booth needed at Gram Panchayat PHC.',
      keyTerms: ['Maternal Emergency', 'Remote PHC', 'Telehealth Kiosk', 'Palamu Buffer'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-ranchi-univ',
        name: 'Ranchi University - Public Health Wing',
        matchPercentage: 89,
        distanceKm: 140,
        expertise: 'Point-of-Care Diagnostics & Community Telecare',
        reason: 'Ranchi University telemedicine teams currently operate 6 rural health telemetry pilots in tribal areas.',
      },
      industry: {
        id: 'ind-healthbridge',
        name: 'HealthBridge Telecare',
        matchPercentage: 91,
        distanceKm: 135,
        expertise: 'Portable Blood Analyzers & Cellular Gateways',
        supportOffered: '4 complete Point-of-Care diagnostic kits & cloud subscription',
        reason: 'HealthBridge specializes in offline-first tablets and diagnostic telemetry for rural centers.',
      },
    },
  },
  {
    id: 'prob-khunti-01',
    name: 'Upland Paddy Drought & Check-Dam Leakage',
    category: 'problem',
    coordinates: [23.0734, 85.2796],
    locationName: 'Murhu Block, Torpa Road',
    district: 'Khunti',
    state: 'Jharkhand',
    description: 'Erratic rain patterns causing 60% crop yield drops for smallholders. Existing earthen check dam has fissures leading to total storage depletion.',
    domain: 'Agriculture',
    priority: 'HIGH',
    priorityScore: 86,
    status: 'DEPLOYED',
    affectedPopulation: 3200,
    reportedDate: '3 weeks ago',
    reporter: 'Sukhram Munda (Kisan Samiti)',
    aiClassification: {
      urgency: 84,
      healthImpact: 72,
      environmentalImpact: 89,
      economicImpact: 94,
      confidence: 94,
      reasoning: 'Soil moisture deficits can be remediated with automated low-cost solar drip irrigation and sensor gates.',
      keyTerms: ['Drip Irrigation', 'Rainfed Paddy', 'Soil Sensor', 'Tribal Smallholders'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-birsa-agri',
        name: 'Birsa Agricultural University',
        matchPercentage: 95,
        distanceKm: 42,
        expertise: 'Precision Agronomy & Smart Drip Micro-Controllers',
        reason: 'Birsa Agri has engineered low-cost soil capacitive probes tested specifically in Chota Nagpur red soils.',
      },
      industry: {
        id: 'ind-agrojharkhand',
        name: 'AgroJharkhand DeepTech',
        matchPercentage: 90,
        distanceKm: 38,
        expertise: 'LoRaWAN Soil Nodes & Solar Valving',
        supportOffered: '₹3.2 Lakhs pilot support & 25 sensor nodes',
        reason: 'Specializes in ruggedized electronics and farmer-friendly mobile apps in local dialects.',
      },
    },
  },
  {
    id: 'prob-latehar-01',
    name: 'Wild Elephant Perimeter Intrusion & Crop Damage',
    category: 'problem',
    coordinates: [23.7434, 84.5034],
    locationName: 'Baresanr Corridor, Chandwa Block',
    district: 'Latehar',
    state: 'Jharkhand',
    description: 'Elephant herds frequently enter village boundaries destroying school boundary walls and storehouses, endangering resident safety.',
    domain: 'Infrastructure',
    priority: 'HIGH',
    priorityScore: 88,
    status: 'TESTING',
    affectedPopulation: 2400,
    reportedDate: '5 days ago',
    reporter: 'Kameshwar Oraon (Forest Ranger Contact)',
    aiClassification: {
      urgency: 90,
      healthImpact: 82,
      environmentalImpact: 91,
      economicImpact: 87,
      confidence: 92,
      reasoning: 'Human-wildlife conflict zone requiring acoustic infrasound perimeter detection and solar flashing deter gates.',
      keyTerms: ['Elephant Corridor', 'School Safety', 'Acoustic Early Warning', 'Latehar'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-nit-jsr',
        name: 'NIT Jamshedpur',
        matchPercentage: 93,
        distanceKm: 160,
        expertise: 'Acoustic Signal Processing & Drone Telemetry',
        reason: 'NIT Jamshedpur robotics department has tested solar seismic-vibration perimeter tripwires.',
      },
      industry: {
        id: 'ind-solarrural',
        name: 'SolarRural Microgrid Labs',
        matchPercentage: 88,
        distanceKm: 145,
        expertise: 'Off-grid Solar LiFePO4 Stations & LoRa Mesh',
        supportOffered: 'Solar power packs & GSM early alert horn hardware',
        reason: 'Experienced in deploying self-sustaining autonomous sensor pods along wildlife corridors.',
      },
    },
  },
  {
    id: 'prob-ranchi-01',
    name: 'Urban Drain Clogging & Flooding Telemetry Deficit',
    category: 'problem',
    coordinates: [23.3441, 85.3096],
    locationName: 'Harmu River Basin & Main Road',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Monsoon flash flooding overwhelms urban drainage. Absence of automated trash-trap monitoring leads to recurring low-lying inundation.',
    domain: 'Infrastructure',
    priority: 'HIGH',
    priorityScore: 85,
    status: 'AI_ANALYZED',
    affectedPopulation: 14500,
    reportedDate: '4 days ago',
    reporter: 'Ranchi Civic Action Network',
    aiClassification: {
      urgency: 86,
      healthImpact: 88,
      environmentalImpact: 84,
      economicImpact: 90,
      confidence: 95,
      reasoning: 'High-density urban area suitable for optical trash detection sensors and automated sluice alert gateways.',
      keyTerms: ['Urban Flood', 'Harmu Basin', 'IoT Trash Monitor', 'Smart City'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-bit-mesra',
        name: 'BIT Mesra - Civil & Computer Science',
        matchPercentage: 94,
        distanceKm: 15,
        expertise: 'Computer Vision & Hydrological Inundation Modeling',
        reason: 'Built the Ranchi Municipal Corporation drainage simulator.',
      },
      industry: {
        id: 'ind-watertech',
        name: 'WaterTech Innovations Ltd.',
        matchPercentage: 90,
        distanceKm: 10,
        expertise: 'Smart Ultrasonic Level Monitors',
        supportOffered: '10 IoT ultrasonic water level sensors for testing',
        reason: 'Provides turn-key urban drainage sensing telemetry.',
      },
    },
  },
  {
    id: 'prob-meerut-01',
    name: 'Industrial Waste Runoff in Kali River & Groundwater Salinity',
    category: 'problem',
    coordinates: [28.9845, 77.7064],
    locationName: 'Partapur Industrial Area & Kali River Basin',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    description: 'Electroplating and paper mill effluents are entering local canals, leading to groundwater chemical hardness exceeding 850 PPM in nearby rural colonies.',
    domain: 'Environment',
    priority: 'HIGH',
    priorityScore: 89,
    status: 'AI_ANALYZED',
    affectedPopulation: 8500,
    reportedDate: '4 days ago',
    reporter: 'Rohit Tyagi (Farmer Welfare Society)',
    aiClassification: {
      urgency: 90,
      healthImpact: 93,
      environmentalImpact: 96,
      economicImpact: 81,
      confidence: 94,
      reasoning: 'Heavy metal percolation requires solar-powered real-time spectrometer probes and decentralized bio-remediation.',
      keyTerms: ['Meerut Industrial Waste', 'Kali River Basin', 'Groundwater Salinity', 'Water Hardness'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-dtu-delhi',
        name: 'Delhi Technological University (DTU) / IIT Delhi',
        matchPercentage: 95,
        distanceKm: 68,
        expertise: 'Environmental Nanotech & Membrane Separation',
        reason: 'DTU Environmental Engineering lab specializes in low-cost graphene oxide filtration cartridges.',
      },
      industry: {
        id: 'ind-watertech',
        name: 'WaterTech Innovations Ltd.',
        matchPercentage: 89,
        distanceKm: 75,
        expertise: 'Industrial IoT Water Quality Nodes',
        supportOffered: '₹4.0 Lakhs CSR hardware grant & continuous monitoring server',
        reason: 'Provides rapid deployment solar telemetry probes for industrial corridors.',
      },
    },
  },
  {
    id: 'prob-delhi-01',
    name: 'Air Particulate Matter (PM2.5) Hotspots in Construction Hubs',
    category: 'problem',
    coordinates: [28.6139, 77.2090],
    locationName: 'Anand Vihar & East Border Corridor',
    district: 'Delhi NCR',
    state: 'Delhi',
    description: 'Concentrated dust particulate emissions and vehicular bottlenecks causing local AQI spikes above 420, affecting school zones and bus terminals.',
    domain: 'Environment',
    priority: 'CRITICAL',
    priorityScore: 93,
    status: 'AI_ANALYZED',
    affectedPopulation: 25000,
    reportedDate: '2 days ago',
    reporter: 'Clean Air Student Collective',
    aiClassification: {
      urgency: 95,
      healthImpact: 97,
      environmentalImpact: 94,
      economicImpact: 88,
      confidence: 96,
      reasoning: 'Hyperlocal particulate spikes require AI sensor grid with automated anti-smog misting triggers.',
      keyTerms: ['Delhi AQI', 'PM2.5 Hotspot', 'Automated Misting', 'Anand Vihar'],
    },
    aiRecommendedMatches: {
      university: {
        id: 'uni-dtu-delhi',
        name: 'Delhi Technological University (DTU)',
        matchPercentage: 96,
        distanceKm: 18,
        expertise: 'Smart Atmospheric Sensing & Machine Learning Forecasts',
        reason: 'DTU hosts the Center for Urban Clean Air Innovation with mobile optical air sensors.',
      },
      industry: {
        id: 'ind-solarrural',
        name: 'SolarRural CleanTech Labs',
        matchPercentage: 88,
        distanceKm: 24,
        expertise: 'Automated Solar Smart Mist Cannons & IoT Gateways',
        supportOffered: 'Anti-smog automated controller units',
        reason: 'Specializes in edge-AI triggers for municipal misting systems.',
      },
    },
  },

  // ==================== 🎓 UNIVERSITIES ====================
  {
    id: 'uni-bit-mesra',
    name: 'Birla Institute of Technology (BIT), Mesra',
    category: 'university',
    coordinates: [23.4123, 85.4399],
    locationName: 'Mesra Campus, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Premier technological university renowned for high-impact civic engineering, LoRaWAN IoT telemetry, and rural water remediation research.',
    code: 'BIT-MESRA',
    ranking: 'NIRF Top 50 Engineering',
    established: 1955,
    expertise: ['Civil & Environmental Engineering', 'IoT & Embedded Electronics', 'Water Resource Management', 'AI/ML Sensors'],
    facultyCount: 240,
    studentsCount: 4500,
    activeProjects: 14,
    deployedSolutions: 9,
    topDepartments: ['Civil & Environmental Engineering', 'Electronics & Comm', 'Computer Science & AI', 'Remote Sensing Center'],
    labFacilities: ['Smart Hydro-informatics Lab', 'LoRaWAN Edge Computing Center', 'Environmental Geochemistry Testing Lab'],
    avatarUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'uni-iit-dhanbad',
    name: 'IIT (ISM) Dhanbad',
    category: 'university',
    coordinates: [23.8143, 86.4412],
    locationName: 'Sardar Patel Nagar, Dhanbad',
    district: 'Dhanbad',
    state: 'Jharkhand',
    description: 'Institute of National Importance with international research excellence in mining environmental restoration, acid drainage treatment, and robotics.',
    code: 'IIT-ISM',
    ranking: 'Institute of National Importance (NIRF #14)',
    established: 1926,
    expertise: ['Applied Geophysics', 'Acid Mine Drainage Remediation', 'Subsurface Sensor Networks', 'Hydrology & Clean Energy'],
    facultyCount: 310,
    studentsCount: 6200,
    activeProjects: 18,
    deployedSolutions: 12,
    topDepartments: ['Applied Geophysics', 'Mining & Environment', 'Data Sciences & Computing', 'Chemical Engineering'],
    labFacilities: ['Centre of Mining Environment', 'Subsurface Geophysics Testing Facility', 'Water Filtration Pilot Lab'],
    avatarUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'uni-nit-jsr',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    category: 'university',
    coordinates: [22.7752, 86.1438],
    locationName: 'Adityapur Industrial Area, Jamshedpur',
    district: 'East Singhbhum',
    state: 'Jharkhand',
    description: 'Leading technical institute specializing in mechanical prototyping, acoustic animal sensors, and rapid industrial IoT fabrication.',
    code: 'NIT-JSR',
    ranking: 'National Institute of Technology',
    established: 1960,
    expertise: ['Mechanical & Automation', 'Acoustic Wildlife Warning', 'Power Electronics', 'Industrial IoT'],
    facultyCount: 180,
    studentsCount: 3800,
    activeProjects: 11,
    deployedSolutions: 7,
    topDepartments: ['Mechanical Engineering', 'Electronics & Comm', 'Civil Infrastructure'],
    labFacilities: ['Advanced 3D Prototyping Workshop', 'Acoustics & Signal Processing Lab'],
    avatarUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'uni-birsa-agri',
    name: 'Birsa Agricultural University (BAU)',
    category: 'university',
    coordinates: [23.4358, 85.3197],
    locationName: 'Kanke, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Specialized agricultural university developing precision soil telemetry, drought-resilient seed strains, and community drip irrigation controllers.',
    code: 'BAU-KNC',
    ranking: 'ICAR State Agricultural University',
    established: 1981,
    expertise: ['Soil & Water Conservation', 'Smart Drip Automation', 'Precision Agronomy', 'Agro-forestry Telemetry'],
    facultyCount: 160,
    studentsCount: 2100,
    activeProjects: 15,
    deployedSolutions: 10,
    topDepartments: ['Agricultural Engineering', 'Soil Science & Agronomy', 'Plant Pathology'],
    labFacilities: ['Soil Moisture Telemetry Station', 'Precision Greenhouse Pilot Facility'],
    avatarUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'uni-ranchi-univ',
    name: 'Ranchi University',
    category: 'university',
    coordinates: [23.3629, 85.3289],
    locationName: 'Shahid Chowk, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Premier public university driving grassroots public health research, tribal community surveys, and tele-clinic deployments.',
    code: 'RU-RNC',
    ranking: 'State Public University (NAAC A)',
    established: 1960,
    expertise: ['Rural Public Health', 'Tribal Sociology', 'Biotechnology', 'Environmental Toxicology'],
    facultyCount: 220,
    studentsCount: 8900,
    activeProjects: 8,
    deployedSolutions: 5,
    topDepartments: ['School of Public Policy', 'Biotechnology', 'Community Extension Center'],
    labFacilities: ['Rural Diagnostics & Field Survey Wing', 'Toxicology & Water Quality Testing'],
    avatarUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'uni-dtu-delhi',
    name: 'Delhi Technological University (DTU)',
    category: 'university',
    coordinates: [28.7495, 77.1184],
    locationName: 'Bawana Road, Shahbad Daulatpur, Delhi',
    district: 'Delhi NCR',
    state: 'Delhi',
    description: 'Renowned engineering institution advancing urban clean-air technologies, water membrane innovation, and smart city telemetry.',
    code: 'DTU-DELHI',
    ranking: 'Premier Technological University (NIRF Top 35)',
    established: 1941,
    expertise: ['Environmental Engineering', 'Urban AI Sensor Networks', 'Membrane Separation', 'Automated Mechatronics'],
    facultyCount: 380,
    studentsCount: 9500,
    activeProjects: 22,
    deployedSolutions: 16,
    topDepartments: ['Environmental Engineering', 'Computer Science & AI', 'Mechanical & Mechatronics'],
    labFacilities: ['Center for Urban Air Quality Research', 'Advanced Membrane Filtration Lab'],
    avatarUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
  },

  // ==================== 🏭 INDUSTRY PARTNERS ====================
  {
    id: 'ind-watertech',
    name: 'WaterTech Innovations Ltd.',
    category: 'industry',
    coordinates: [23.3571, 85.3340],
    locationName: 'Namkum Industrial Area, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Pioneering clean-tech enterprise manufacturing ruggedized ultrasonic water depth sensors, LoRaWAN transceivers, and village water quality kiosks.',
    companyType: 'CleanTech',
    focusAreas: ['IoT Rural Water Probes', 'Ultrasonic Flow Sensors', 'Solar Telemetry Pods', 'CSR Partnerships'],
    expertise: ['ESP32 Telemetry', 'Ultrasonic Depth Sensors', 'Solar Micro-panels', 'MQTT Cloud'],
    technologies: ['LoRaWAN 868MHz', 'Solar LiFePO4', 'FastAPI Backend', 'Fluoride Spectrometers'],
    supportAvailable: 'Hardware donation kits, technical mentorship, ₹1.5 Cr annual CSR civic fund',
    csrFundingAnnual: '₹1.50 Crores',
    activeProjectsSupported: 6,
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ind-tata-csr',
    name: 'Tata Steel Foundation (CSR)',
    category: 'industry',
    coordinates: [22.8016, 86.1950],
    locationName: 'Jamshedpur Corporate HQ',
    district: 'East Singhbhum',
    state: 'Jharkhand',
    description: 'One of India’s most influential CSR programs, backing student-led community interventions in drinking water, tribal health, and environmental restoration.',
    companyType: 'Corporate CSR',
    focusAreas: ['Water Infrastructure', 'Maternal Healthcare', 'Tribal Sustainable Livelihood', 'Renewable Energy'],
    expertise: ['Large Scale Civil Engineering', 'Mobile Medical Units', 'Check Dam Automation', 'Micro-irrigation Systems'],
    technologies: ['Heavy Civil Structures', 'Mobile Health Pods', 'Automated Sluice Systems'],
    supportAvailable: 'Seed grants up to ₹10L per project, fabrication access, CSR compliance sponsorship',
    csrFundingAnnual: '₹12.00 Crores',
    activeProjectsSupported: 14,
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ind-agrojharkhand',
    name: 'AgroJharkhand DeepTech',
    category: 'industry',
    coordinates: [23.3712, 85.3054],
    locationName: 'Kanke Road Agri-Incubator, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Hardware startup producing smart moisture nodes, solar drip controllers, and regional weather forecast telemetry for smallholder farmers.',
    companyType: 'AgriTech Enterprise',
    focusAreas: ['Smart Drip Irrigation', 'Soil Moisture Telemetry', 'Solar Food Dryers', 'Farmer Mobile Apps'],
    expertise: ['LoRaWAN Soil Nodes', 'AI Crop Disease Detection', 'Drone Crop Spraying', 'Solar Drip Valving'],
    technologies: ['Capacitive Soil Probes', 'ESP32 Nodes', 'Flutter Farmer UI', 'BLE 5.0'],
    supportAvailable: 'Field prototype hardware kits, farmer testing ground access, ₹80L pilot fund',
    csrFundingAnnual: '₹80 Lakhs',
    activeProjectsSupported: 5,
    logoUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ind-healthbridge',
    name: 'HealthBridge Telecare',
    category: 'industry',
    coordinates: [23.7912, 86.4190],
    locationName: 'City Center, Dhanbad',
    district: 'Dhanbad',
    state: 'Jharkhand',
    description: 'Healthcare technology provider delivering decentralized diagnostic pods, tele-consultation kiosks, and offline-sync health record tablets.',
    companyType: 'Healthcare Provider',
    focusAreas: ['Telemedicine Kiosks', 'Diagnostic AI', 'Maternal Health Trackers', 'Point-of-Care Blood Devices'],
    expertise: ['Point-of-Care Diagnostics', 'Cellular Telemetry', 'Offline Tablet Sync', 'Encrypted Health Cloud'],
    technologies: ['Point-of-Care Analyzers', 'GSM Multi-carrier Gateways', 'HIPAA Tele-consult Cloud'],
    supportAvailable: 'Medical hardware calibration, doctor-network onboarding, ₹60L equipment grant',
    csrFundingAnnual: '₹60 Lakhs',
    activeProjectsSupported: 4,
    logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ind-solarrural',
    name: 'SolarRural Microgrid Labs',
    category: 'industry',
    coordinates: [23.6693, 85.9609],
    locationName: 'Sector 4, Bokaro Steel City',
    district: 'Bokaro',
    state: 'Jharkhand',
    description: 'Clean energy hardware company specializing in off-grid solar storage, low-voltage brushless DC pumps, and wildlife acoustic sirens.',
    companyType: 'DeepTech Startup',
    focusAreas: ['Off-grid Solar Storage', 'Brushless DC Pumps', 'Smart MPPT Inverters', 'Wildlife Deterrent Gateways'],
    expertise: ['LiFePO4 Battery Systems', 'MPPT Controllers', 'GSM Billing', 'Acoustic Infrasound Fences'],
    technologies: ['LiFePO4 BMS', 'Infrasound Emitters', 'Solar MPPT', 'LoRa Mesh'],
    supportAvailable: 'High-density solar battery units, electrical engineering mentorship, ₹95L hardware lab support',
    csrFundingAnnual: '₹95 Lakhs',
    activeProjectsSupported: 5,
    logoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&auto=format&fit=crop&q=80',
  },

  // ==================== 🟢 DEPLOYED SOLUTIONS ====================
  {
    id: 'sol-gumla-water',
    name: 'Solar LoRaWAN Borehole Telemetry & Filter Unit',
    category: 'solution',
    coordinates: [23.0560, 84.5320],
    locationName: 'Toto Block Community Center, Gumla',
    district: 'Gumla',
    state: 'Jharkhand',
    description: 'Autonomous solar-powered hydro-telemetry node with multi-stage activated alumina ceramic filtration unit that eliminates excess fluoride and monitors water table replenishment in real time.',
    problemSolved: 'Acute drinking water shortage & high fluoride contamination in Toto Block',
    deployedByUniversity: 'BIT Mesra (Civil & IoT Lab)',
    supportedByIndustry: 'WaterTech Innovations Ltd.',
    deploymentStatus: 'Live & Operational',
    impactCitizens: 2840,
    techStack: ['ESP32 LoRaWAN', 'Activated Alumina', 'Solar 100W Panel', 'FastAPI Cloud', 'Citizen SMS Alert'],
    hardwareSpecs: 'Dual ultrasonic depth sensor + turbidity probe with 5-year LiFePO4 battery pack',
    dateDeployed: 'Deployed Oct 2025',
    impactMetrics: {
      waterSavedLitersDaily: '18,500 L/day clean water distributed',
      diagnosticWaitTimeReduced: 'Fluoride level reduced from 4.2 to 0.6 mg/L',
    },
  },
  {
    id: 'sol-khunti-drip',
    name: 'Automated Solar Smart Drip & Soil Moisture Hub',
    category: 'solution',
    coordinates: [23.0810, 85.2910],
    locationName: 'Murhu Kisan Demonstration Plot, Khunti',
    district: 'Khunti',
    state: 'Jharkhand',
    description: 'Closed-loop micro-irrigation controller reading soil capacitive sensors every 15 minutes, triggering solar valve pulses only when root zone moisture drops below 35%.',
    problemSolved: 'Paddy & vegetable crop failure during unseasonal dry spells',
    deployedByUniversity: 'Birsa Agricultural University',
    supportedByIndustry: 'AgroJharkhand DeepTech',
    deploymentStatus: 'Live & Operational',
    impactCitizens: 3400,
    techStack: ['LoRaWAN Soil Nodes', 'Solenoid Pulse Valves', 'Solar DC Pump', 'Farmer Dialect Audio Box'],
    hardwareSpecs: '8 wireless in-ground soil nodes with 1.2km mesh range and automated valve driver',
    dateDeployed: 'Deployed Dec 2025',
    impactMetrics: {
      waterSavedLitersDaily: '42% water conservation vs flood irrigation',
      cropYieldIncrease: '+38% increase in winter mustard yield',
    },
  },
  {
    id: 'sol-dhanbad-acid',
    name: 'Autonomous Bio-Char & Limestone Mine Drainage Purifier',
    category: 'solution',
    coordinates: [23.7840, 86.4210],
    locationName: 'Katras Reservoir Inflow Gate, Dhanbad',
    district: 'Dhanbad',
    state: 'Jharkhand',
    description: 'Multi-chamber cascading neutralization system using active limestone beds and telemetry-driven sodium carbonate dosing to buffer acidic mine seepage.',
    problemSolved: 'Acid mine drainage runoff with low pH and high iron concentration',
    deployedByUniversity: 'IIT (ISM) Dhanbad',
    supportedByIndustry: 'Tata Steel Foundation (CSR)',
    deploymentStatus: 'Scaling Phase',
    impactCitizens: 12400,
    techStack: ['Automated Dosing Auger', 'Industrial pH Probe', 'GSM Telemetry', 'Solar Backup'],
    hardwareSpecs: 'Continuous pH 4.0 to 7.8 neutralizing auger with automated sludge separator',
    dateDeployed: 'Deployed Nov 2025',
    impactMetrics: {
      waterSavedLitersDaily: '1,20,000 L/day neutralized for agricultural reuse',
    },
  },
  {
    id: 'sol-palamu-health',
    name: 'Solar Tele-Diagnostic Health Pod (ASHA Tele-Kiosk)',
    category: 'solution',
    coordinates: [23.8920, 84.0610],
    locationName: 'Semari Sub-Center PHC, Palamu',
    district: 'Palamu',
    state: 'Jharkhand',
    description: 'Self-contained diagnostic kiosk with digital fetal doppler, point-of-care hemoglobinometer, and encrypted cellular uplink connecting local ASHA workers to district obstetricians.',
    problemSolved: 'Maternal health emergencies due to 22km unpaved transit barriers',
    deployedByUniversity: 'Ranchi University (Public Health Wing)',
    supportedByIndustry: 'HealthBridge Telecare',
    deploymentStatus: 'Live & Operational',
    impactCitizens: 6100,
    techStack: ['Digital Doppler', 'Bluetooth Hemoglobinometer', 'Ruggedized Android Tablet', 'Solar 200W Hub'],
    hardwareSpecs: 'Dustproof IP65 case with 48-hour internal battery backup and offline encrypted sync',
    dateDeployed: 'Deployed Jan 2026',
    impactMetrics: {
      diagnosticWaitTimeReduced: 'Emergency referral response time reduced from 8 hours to 25 minutes',
    },
  },
  {
    id: 'sol-latehar-siren',
    name: 'Acoustic Elephant Infrasound Warning & Solar Flasher Network',
    category: 'solution',
    coordinates: [23.7310, 84.4920],
    locationName: 'Baresanr School Perimeter Corridor, Latehar',
    district: 'Latehar',
    state: 'Jharkhand',
    description: 'Network of 6 ground-level geophone seismic sensors detecting elephant low-frequency footfall rumblings up to 1.5km away, triggering non-lethal strobe buzzers and ranger SMS broadcasts.',
    problemSolved: 'Elephant herd intrusion into village school buildings and food granaries',
    deployedByUniversity: 'NIT Jamshedpur (Mechatronics Lab)',
    supportedByIndustry: 'SolarRural Microgrid Labs',
    deploymentStatus: 'Field Tested',
    impactCitizens: 4800,
    techStack: ['Seismic Geophones', 'Edge Infrasound DSP', 'Solar Strobe Towers', 'GSM Ranger Alert'],
    hardwareSpecs: 'Seismic acoustic sensors buried 1m deep with LoRa repeater nodes',
    dateDeployed: 'Deployed Feb 2026',
    impactMetrics: {
      diagnosticWaitTimeReduced: 'Zero herd perimeter breaches reported in 90 days',
    },
  },
];

export const MAP_STATISTICS = {
  communityProblems: 128,
  criticalProblems: 34,
  universities: 18,
  industryPartners: 24,
  activeProjects: 42,
  solutionsDeployed: 31,
  citizensImpacted: 142800,
};
