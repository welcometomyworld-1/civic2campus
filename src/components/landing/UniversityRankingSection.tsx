import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Award,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building,
  Users,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  MapPin,
  Flame,
  Zap,
  BookOpen,
  FlaskConical,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/mockData';

interface RankedUniversity {
  id: string;
  rank: number;
  name: string;
  code: string;
  location: string;
  district: string;
  established: number;
  ranking: string;
  tier: 'PREMIER_TECH' | 'AGRI_HEALTH' | 'STATE_PUBLIC' | 'CENTRAL';
  tierLabel: string;
  specializations: string[];
  facultyCount: number;
  studentsCount: number;
  activeProjects: number;
  deployedSolutions: number;
  researchGrants: string;
  innovationScore: number;
  strongDepartments: string[];
  existingResearch: string[];
  badge: string;
  avatarUrl: string;
}

export const UniversityRankingSection: React.FC = () => {
  const { setCurrentView, setUserRole, navigateToDashboardTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'solutions' | 'projects'>('rank');
  const [selectedUniversity, setSelectedUniversity] = useState<RankedUniversity | null>(null);

  // Extended and enriched University Rankings Data
  const rankedUniversities: RankedUniversity[] = useMemo(() => {
    const list: RankedUniversity[] = [
      {
        id: 'bit_mesra',
        rank: 1,
        name: 'Birla Institute of Technology (BIT), Mesra',
        code: 'BIT-MESRA',
        location: 'Ranchi, Jharkhand',
        district: 'Ranchi',
        established: 1955,
        ranking: 'NIRF Top 50 Engineering • NAAC A+',
        tier: 'PREMIER_TECH',
        tierLabel: 'Premier Tech & R&D',
        specializations: ['IoT & Embedded Systems', 'Water Resources', 'Civil Engineering', 'AI/ML', 'Remote Sensing'],
        facultyCount: 240,
        studentsCount: 4500,
        activeProjects: 14,
        deployedSolutions: 9,
        researchGrants: '₹4.8 Cr',
        innovationScore: 96,
        strongDepartments: ['Civil & Environmental Engineering', 'Water Resources Lab', 'IoT & Sensors Center', 'Computer Science'],
        existingResearch: ['Rural LoRaWAN Hydro-Telemetry Grid', 'Solar Arsenic Filtration Unit', 'Smart River Silt Gauging'],
        badge: '#1 State Innovation Champion',
        avatarUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'iit_ism_dhanbad',
        rank: 2,
        name: 'Indian Institute of Technology (IIT-ISM), Dhanbad',
        code: 'IIT-ISM',
        location: 'Dhanbad, Jharkhand',
        district: 'Dhanbad',
        established: 1926,
        ranking: 'Institute of National Importance (NIRF #14)',
        tier: 'PREMIER_TECH',
        tierLabel: 'National Importance',
        specializations: ['Mining & Geology', 'Environmental Sciences', 'Clean Energy', 'Subsurface Hydrology', 'Robotics'],
        facultyCount: 310,
        studentsCount: 6200,
        activeProjects: 18,
        deployedSolutions: 12,
        researchGrants: '₹6.2 Cr',
        innovationScore: 94,
        strongDepartments: ['Applied Geophysics', 'Centre of Mining Environment', 'Environmental Engineering', 'Data Sciences'],
        existingResearch: ['Heavy Metal Contamination Subsurface Sensor Mesh', 'Acid Mine Drainage Remediation', 'Mine Water Purification'],
        badge: '#2 National Research Hub',
        avatarUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'birsa_agri_university',
        rank: 3,
        name: 'Birsa Agricultural University (BAU)',
        code: 'BAU-KNC',
        location: 'Kanke, Ranchi',
        district: 'Ranchi',
        established: 1981,
        ranking: 'ICAR State Agricultural University (Top 15 Agri)',
        tier: 'AGRI_HEALTH',
        tierLabel: 'Agritech & Soil Sciences',
        specializations: ['Precision Irrigation', 'Soil Microbiology', 'Agro-forestry', 'Millet Agronomy', 'Solar Pumping'],
        facultyCount: 160,
        studentsCount: 2100,
        activeProjects: 15,
        deployedSolutions: 10,
        researchGrants: '₹3.4 Cr',
        innovationScore: 92,
        strongDepartments: ['Agricultural Engineering', 'Soil & Water Conservation', 'Agronomy Labs', 'Plant Pathology'],
        existingResearch: ['IoT Micro-Drip Smart Controllers', 'Rainfed Finger Millet Yield Optimization', 'Organic Pest Bio-Sensors'],
        badge: '#3 Agritech Innovation Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'nit_jamshedpur',
        rank: 4,
        name: 'National Institute of Technology (NIT), Jamshedpur',
        code: 'NIT-JSR',
        location: 'Jamshedpur, Jharkhand',
        district: 'East Singhbhum',
        established: 1960,
        ranking: 'National Institute of Technology • NIRF Top 90',
        tier: 'PREMIER_TECH',
        tierLabel: 'Premier Tech & R&D',
        specializations: ['Mechanical Prototyping', 'Power Electronics', 'Smart Grids', 'Metallurgy', 'Robotics'],
        facultyCount: 180,
        studentsCount: 3800,
        activeProjects: 11,
        deployedSolutions: 7,
        researchGrants: '₹3.1 Cr',
        innovationScore: 89,
        strongDepartments: ['Mechanical Engineering', 'Electronics & Communication', 'Electrical Power Labs'],
        existingResearch: ['Solar MPPT Off-Grid Inverters', 'Telemetry Vibration Sensors for Rural Mini-Hydel'],
        badge: '#4 Hardware & Prototyping Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'aiims_deoghar',
        rank: 5,
        name: 'AIIMS Deoghar (Biomedical & Telehealth)',
        code: 'AIIMS-DGH',
        location: 'Deoghar, Jharkhand',
        district: 'Deoghar',
        established: 2019,
        ranking: 'Apex Healthcare Institute of National Importance',
        tier: 'AGRI_HEALTH',
        tierLabel: 'Healthcare & Telehealth',
        specializations: ['Remote Telemedicine', 'Community Epidemiology', 'Point-of-Care Diagnostics', 'Maternal Health'],
        facultyCount: 120,
        studentsCount: 950,
        activeProjects: 9,
        deployedSolutions: 6,
        researchGrants: '₹2.9 Cr',
        innovationScore: 88,
        strongDepartments: ['Community Medicine & Public Health', 'Biomedical Telemetry Hub', 'Pathology'],
        existingResearch: ['Portable ECG Tele-Transmission for Primary Health Centers', 'Maternal Anemia Diagnostic Strips'],
        badge: '#5 Telehealth Innovation Leader',
        avatarUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'cuj_ranchi',
        rank: 6,
        name: 'Central University of Jharkhand (CUJ)',
        code: 'CUJ-RNC',
        location: 'Cheri-Manatu, Ranchi',
        district: 'Ranchi',
        established: 2009,
        ranking: 'Central University of India • NAAC A',
        tier: 'CENTRAL',
        tierLabel: 'Central University',
        specializations: ['Energy Engineering', 'Tribal Studies', 'Environmental Sciences', 'Nanotechnology', 'Water Chemistry'],
        facultyCount: 150,
        studentsCount: 2800,
        activeProjects: 8,
        deployedSolutions: 5,
        researchGrants: '₹2.1 Cr',
        innovationScore: 85,
        strongDepartments: ['Department of Energy Engineering', 'Environmental Sciences', 'Centre for Tribal Folklore'],
        existingResearch: ['Biomass Gasification for Off-Grid Hamlets', 'Low-Cost Graphene-Oxide Water Filters'],
        badge: '#6 Clean Energy & Materials',
        avatarUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'ranchi_university',
        rank: 7,
        name: 'Ranchi University (RU)',
        code: 'RU-RNC',
        location: 'Ranchi, Jharkhand',
        district: 'Ranchi',
        established: 1960,
        ranking: 'State Public University • NAAC A Grade',
        tier: 'STATE_PUBLIC',
        tierLabel: 'State Public University',
        specializations: ['Public Health', 'Botany & Indigenous Flora', 'Rural Economics', 'Sociological Field Surveys'],
        facultyCount: 220,
        studentsCount: 8900,
        activeProjects: 8,
        deployedSolutions: 5,
        researchGrants: '₹1.9 Cr',
        innovationScore: 82,
        strongDepartments: ['School of Public Policy', 'Biotechnology Department', 'Zoology & Entomology'],
        existingResearch: ['Fluoride Ingest Mapping across Chota Nagpur', 'Community Health Extension Surveys'],
        badge: '#7 Civic Policy & Fieldwork',
        avatarUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'vinoba_bhave_univ',
        rank: 8,
        name: 'Vinoba Bhave University (VBU)',
        code: 'VBU-HZB',
        location: 'Hazaribagh, Jharkhand',
        district: 'Hazaribagh',
        established: 1992,
        ranking: 'State Public University • NAAC B++',
        tier: 'STATE_PUBLIC',
        tierLabel: 'State Public University',
        specializations: ['Hydro-Geology', 'Chemistry', 'Social Work', 'Rural Education'],
        facultyCount: 140,
        studentsCount: 4200,
        activeProjects: 7,
        deployedSolutions: 4,
        researchGrants: '₹1.4 Cr',
        innovationScore: 78,
        strongDepartments: ['Department of Geology', 'Chemistry Laboratory', 'Extension Education'],
        existingResearch: ['Colorimetric Arsenic Field Strips for Drinking Wells', 'Watershed Recharge Studies'],
        badge: '#8 North Chota Nagpur Hub',
        avatarUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'kolhan_university',
        rank: 9,
        name: 'Kolhan University',
        code: 'KU-CHAIBASA',
        location: 'Chaibasa, West Singhbhum',
        district: 'West Singhbhum',
        established: 2009,
        ranking: 'State Public University',
        tier: 'STATE_PUBLIC',
        tierLabel: 'State Public University',
        specializations: ['Tribal Economy', 'Indigenous Botany', 'Rural Sanitation', 'Forest Resource Mapping'],
        facultyCount: 110,
        studentsCount: 3400,
        activeProjects: 6,
        deployedSolutions: 4,
        researchGrants: '₹1.2 Cr',
        innovationScore: 76,
        strongDepartments: ['Environmental Studies', 'Commerce & Rural Development', 'Anthropology'],
        existingResearch: ['Lac Cultivation Telemetry & Solar Moisture Dryers', 'Saranda Forest Hydrology'],
        badge: '#9 Kolhan Zone Innovation Cell',
        avatarUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=200&auto=format&fit=crop&q=80',
      },
      {
        id: 'sido_kanhu_murmu_univ',
        rank: 10,
        name: 'Sido Kanhu Murmu University (SKMU)',
        code: 'SKMU-DMK',
        location: 'Dumka, Jharkhand',
        district: 'Dumka',
        established: 1992,
        ranking: 'State Public University',
        tier: 'STATE_PUBLIC',
        tierLabel: 'State Public University',
        specializations: ['Rural Public Health', 'Renewable Microgrids', 'Santhal Culture Studies', 'Groundwater Sensors'],
        facultyCount: 95,
        studentsCount: 2900,
        activeProjects: 5,
        deployedSolutions: 3,
        researchGrants: '₹1.1 Cr',
        innovationScore: 74,
        strongDepartments: ['Department of Physics & Electronics', 'Social Sciences', 'Botany'],
        existingResearch: ['Micro-Solar Street Light Telemetry', 'Tribal Herbal Antimicrobial Validation'],
        badge: '#10 Santhal Pargana Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
      },
    ];

    return list;
  }, []);

  // Filtered and Sorted Universities
  const filteredUniversities = useMemo(() => {
    return rankedUniversities
      .filter((u) => {
        const matchesTier = selectedTier === 'ALL' || u.tier === selectedTier;
        const matchesSearch =
          searchQuery === '' ||
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTier && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.innovationScore - a.innovationScore;
        if (sortBy === 'solutions') return b.deployedSolutions - a.deployedSolutions;
        if (sortBy === 'projects') return b.activeProjects - a.activeProjects;
        return a.rank - b.rank;
      });
  }, [rankedUniversities, selectedTier, searchQuery, sortBy]);

  const handleOpenUniversityHub = (uniId: string) => {
    setUserRole('university');
    if (navigateToDashboardTab) {
      navigateToDashboardTab('university-dashboard', 'overview');
    } else {
      setCurrentView('university-dashboard');
    }
  };

  return (
    <section id="university-rankings-section" className="py-24 bg-[#F9F8F6] border-b border-stone-200/80 text-stone-900 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-emerald-700 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Statewide Higher Education Matrix • NIRF & Social Impact League
            </span>
            <span className="h-px w-8 bg-emerald-700 inline-block"></span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.08]">
            Jharkhand University Innovation & <br />
            <span className="text-emerald-800 italic">Social Impact Rankings 2026</span>
          </h2>

          <p className="text-sm text-stone-600 max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Benchmarked by verified community problem resolution velocity, student engineering squad prototypes, CSR co-funding absorption, and NIRF social credit accreditation.
          </p>
        </div>

        {/* Top 4 Live KPI Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-1">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-stone-900">42 Inst</div>
            <div className="text-xs uppercase font-semibold text-stone-500">Universities Connected</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center mx-auto mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-sky-800">1,248</div>
            <div className="text-xs uppercase font-semibold text-stone-500">Student Researchers</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mx-auto mb-1">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-purple-800">148 Nodes</div>
            <div className="text-xs uppercase font-semibold text-stone-500">Verified Prototypes</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-1">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-amber-900">₹18.4 Cr</div>
            <div className="text-xs uppercase font-semibold text-stone-500">CSR Seed Grants</div>
          </div>
        </div>

        {/* Main Ranking Matrix Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xl max-w-6xl mx-auto space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search university, district, research discipline..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-stone-800 placeholder:text-stone-400"
              />
            </div>

            {/* Filter Tabs & Sort Selection */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200/80">
                {[
                  { id: 'ALL', label: 'All Tiers' },
                  { id: 'PREMIER_TECH', label: 'IIT / NIT / BIT' },
                  { id: 'AGRI_HEALTH', label: 'Agri & Health' },
                  { id: 'STATE_PUBLIC', label: 'State Universities' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedTier === tier.id
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-700 outline-none cursor-pointer text-xs"
                aria-label="Sort universities"
              >
                <option value="rank">Sort: Overall Rank</option>
                <option value="score">Sort: Innovation Score</option>
                <option value="solutions">Sort: Deployed Solutions</option>
                <option value="projects">Sort: Active Projects</option>
              </select>
            </div>

          </div>

          {/* Leaderboard Table (Cleaned and De-cluttered for High Scannability) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-xs tracking-wider">
                  <th className="pb-3.5 pl-2">Rank</th>
                  <th className="pb-3.5">University & Accreditations</th>
                  <th className="pb-3.5">District</th>
                  <th className="pb-3.5 hidden lg:table-cell">Active Squads</th>
                  <th className="pb-3.5 hidden lg:table-cell">Deployed Solutions</th>
                  <th className="pb-3.5 hidden xl:table-cell">CSR Grants</th>
                  <th className="pb-3.5">Innovation Score</th>
                  <th className="pb-3.5 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                {filteredUniversities.map((uni) => (
                  <tr
                    key={uni.id}
                    className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUniversity(uni)}
                  >
                    {/* Rank Badge */}
                    <td className="py-4 pl-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        {uni.rank === 1 && <span className="text-amber-500 text-base" aria-hidden="true">👑</span>}
                        {uni.rank === 2 && <span className="text-stone-400 text-base" aria-hidden="true">🥈</span>}
                        {uni.rank === 3 && <span className="text-amber-700 text-base" aria-hidden="true">🥉</span>}
                        <span className={`font-black text-sm ${
                          uni.rank <= 3 ? 'text-stone-900 font-extrabold' : 'text-stone-400'
                        }`}>
                          #{uni.rank}
                        </span>
                      </div>
                    </td>

                    {/* University Name & Tags */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={uni.avatarUrl}
                          alt={uni.name}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            {/* Semantic Span maintaining Document Outline */}
                            <span className="font-extrabold text-stone-900 group-hover:text-emerald-900 text-sm block">
                              {uni.name}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {uni.badge}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                            <span>{uni.ranking}</span>
                            <span>•</span>
                            <span>Est. {uni.established}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-4 font-semibold text-stone-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{uni.district}</span>
                      </div>
                    </td>

                    {/* Active Squads (Hidden on small viewports for density relief) */}
                    <td className="py-4 font-bold text-sky-800 hidden lg:table-cell">
                      {uni.activeProjects} Squads
                    </td>

                    {/* Deployed Solutions (Hidden on small viewports for density relief) */}
                    <td className="py-4 font-bold text-purple-800 hidden lg:table-cell">
                      {uni.deployedSolutions} Deployed
                    </td>

                    {/* CSR Grants (Hidden on small viewports for density relief) */}
                    <td className="py-4 font-bold text-emerald-800 hidden xl:table-cell">
                      {uni.researchGrants}
                    </td>

                    {/* Innovation Score Progress */}
                    <td className="py-4">
                      <div className="space-y-1 w-28">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-emerald-900">{uni.innovationScore}/100</span>
                          <span className="text-stone-500">Score</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-amber-400 h-full rounded-full"
                            style={{ width: `${uni.innovationScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 pr-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUniversity(uni);
                        }}
                        className="px-3 py-1.5 bg-stone-100 group-hover:bg-emerald-900 group-hover:text-amber-300 text-stone-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                        aria-label={`Inspect R&D for ${uni.name}`}
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Footer Callout */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                All university ranking metrics are synchronized with real-time field deployments on the <strong>Jharkhand Civic Innovation Network</strong>.
              </span>
            </div>

            <button
              onClick={() => handleOpenUniversityHub('bit_mesra')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Launch University Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* UNIVERSITY DETAIL DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedUniversity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUniversity.avatarUrl}
                  alt={selectedUniversity.name}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono">
                      RANK #{selectedUniversity.rank}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {selectedUniversity.tierLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-stone-900 mt-1">{selectedUniversity.name}</h3>
                  <p className="text-xs text-stone-500">{selectedUniversity.ranking} • {selectedUniversity.location}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUniversity(null)}
                className="text-stone-400 hover:text-stone-800 p-1 rounded-xl text-lg font-bold cursor-pointer"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {/* 4 Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-stone-50 rounded-xl text-center border border-stone-200/80">
                <div className="text-xs uppercase font-bold text-stone-500">Innovation Score</div>
                <div className="text-xl font-black text-emerald-800 mt-0.5">{selectedUniversity.innovationScore}/100</div>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl text-center border border-stone-200/80">
                <div className="text-xs uppercase font-bold text-stone-500">Active Squads</div>
                <div className="text-xl font-black text-sky-800 mt-0.5">{selectedUniversity.activeProjects}</div>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl text-center border border-stone-200/80">
                <div className="text-xs uppercase font-bold text-stone-500">Deployed Solutions</div>
                <div className="text-xl font-black text-purple-800 mt-0.5">{selectedUniversity.deployedSolutions}</div>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl text-center border border-stone-200/80">
                <div className="text-xs uppercase font-bold text-stone-500">R&D Grants</div>
                <div className="text-xl font-black text-amber-900 mt-0.5">{selectedUniversity.researchGrants}</div>
              </div>
            </div>

            {/* Key R&D Strengths & Labs */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-700" />
                <span>Specialized Innovation Laboratories & Departments</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedUniversity.strongDepartments.map((dept, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 font-semibold border border-stone-200 text-xs"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Patented Telemetry Research */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ongoing State-Accredited Civic R&D Projects</span>
              </div>
              <div className="space-y-1.5">
                {selectedUniversity.existingResearch.map((res, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="font-semibold text-emerald-950">{res}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      NIRF Credit Accredited
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedUniversity(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedUniversity(null);
                  handleOpenUniversityHub(selectedUniversity.id);
                }}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Open University Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
