import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Sparkles,
  Users,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Layers,
  Building,
} from 'lucide-react';

export const AIIntelligenceShowcase: React.FC = () => {
  const { setCurrentView, setSelectedProblem, problems } = useApp();

  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleInputs = [
    {
      text: 'Our village handpump has been broken for three months. Around 120 families depend on it for drinking water.',
      district: 'Gumla',
      domain: 'WATER MANAGEMENT',
      subdomain: 'RURAL INFRASTRUCTURE',
      priority: 'CRITICAL',
      score: 91,
      affected: '~120 FAMILIES',
      confidence: '94%',
      clusterId: 'WTR-102',
      clusterReports: 43,
      clusterCitizens: 2840,
      universityMatch: 'BIT Mesra (Water Resources Lab) — 94%',
      industryMatch: 'WaterTech Innovations — 91%',
    },
    {
      text: 'Acid mine drainage and coal slurry from abandoned pit is seeping into our Katras village drinking pond, turning water dark orange (pH 4.2).',
      district: 'Dhanbad',
      domain: 'ENVIRONMENTAL REMEDIATION',
      subdomain: 'CONSTRUCTED WETLAND BIO-PURIFICATION',
      priority: 'CRITICAL',
      score: 95,
      affected: '~850 FAMILIES (4,200 citizens)',
      confidence: '96%',
      clusterId: 'ENV-204',
      clusterReports: 18,
      clusterCitizens: 12400,
      universityMatch: 'IIT (ISM) Dhanbad — 97%',
      industryMatch: 'Tata Steel Foundation (CSR) — 95%',
    },
    {
      text: 'Erratic dry spells in Khunti are destroying rainfed paddy crops. Check dam is leaking and there is no automated micro-irrigation.',
      district: 'Khunti',
      domain: 'SMART AGRICULTURE',
      subdomain: 'SOLAR MICRO-DRIP & SOIL TELEMETRY',
      priority: 'HIGH',
      score: 84,
      affected: '~640 SMALLHOLDER FARMERS',
      confidence: '93%',
      clusterId: 'AGR-310',
      clusterReports: 31,
      clusterCitizens: 8400,
      universityMatch: 'Birsa Agricultural University — 95%',
      industryMatch: 'AgroJharkhand DeepTech — 94%',
    },
  ];

  const currentSample = sampleInputs[activeSampleIndex];

  const handleSwitchSample = (idx: number) => {
    setIsAnalyzing(true);
    setActiveSampleIndex(idx);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 350);
  };

  return (
    <section className="py-24 sm:py-32 bg-[#F9F8F6] border-b border-stone-200/80 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Exact Prompt Copy */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Section 05 • AI Intelligence
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.05]">
            AI doesn't just read the problem. <br />
            <span className="font-bold italic text-blue-600">It understands where it belongs.</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Real-time semantic analysis translates raw citizen reports into structured technical vectors, calculates priority scores, identifies duplicate clusters, and ranks research labs.
          </p>
        </div>

        {/* Sample Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {sampleInputs.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSwitchSample(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSampleIndex === idx
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-300'
              }`}
            >
              Case {idx + 1}: {s.district} ({s.domain})
            </button>
          ))}
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left: Input Text Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider mb-4">
                <span className="flex items-center gap-1.5 text-stone-900">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Citizen Report Submission</span>
                </span>
                <span className="bg-[#F9F8F6] px-2.5 py-1 rounded-full font-mono text-xs text-stone-700 border border-stone-200">
                  {currentSample.district}, JH
                </span>
              </div>

              <div className="relative p-6 rounded-2xl bg-[#F0EFED] border border-stone-200 text-stone-900 text-base leading-relaxed font-serif-display italic">
                "{currentSample.text}"
              </div>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-center justify-between text-stone-600 border-b border-stone-100 pb-2">
                  <span className="uppercase tracking-wider text-xs font-semibold text-stone-500">GPS Geotag:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified On-Ground (23.04° N, 84.54° E)
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 border-b border-stone-100 pb-2">
                  <span className="uppercase tracking-wider text-xs font-semibold text-stone-500">Report Channel:</span>
                  <span className="font-semibold text-stone-900">Gram Panchayat Mobile Node</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100">
              <button
                onClick={() => {
                  setSelectedProblem(problems[0]);
                  setCurrentView('match-center');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>Open Full Intelligence Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: AI Intelligence Engine Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    {/* Semantic H3 Heading fixing H2->H4 skip */}
                    <h3 className="text-base font-bold text-stone-900 tracking-tight">
                      Automated AI Parsing & Vector Scoring
                    </h3>
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                      Gemini 2.5 Structured Extraction
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span>Confidence: {currentSample.confidence}</span>
                </div>
              </div>

              {/* Grid of Extracted Highlight Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                
                <div className="bg-[#F9F8F6] p-4 rounded-xl border border-stone-200/80">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Domain & Subdomain
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-1">
                    {currentSample.domain}
                  </div>
                  <div className="text-xs font-semibold text-blue-600 mt-0.5">
                    {currentSample.subdomain}
                  </div>
                </div>

                <div className="bg-[#F9F8F6] p-4 rounded-xl border border-stone-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Priority Vector
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">
                      {currentSample.priority}
                    </span>
                  </div>
                  <div className="text-2xl font-light text-rose-600 mt-1">
                    {currentSample.score} <span className="text-xs font-bold text-stone-500">/ 100 Priority</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Evaluated across 7 severity vectors
                  </div>
                </div>

                <div className="bg-[#F9F8F6] p-4 rounded-xl border border-stone-200/80">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Affected Impact
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-1">
                    {currentSample.affected}
                  </div>
                  <div className="text-xs text-emerald-700 font-bold mt-0.5">
                    Immediate health intervention needed
                  </div>
                </div>

                <div className="bg-[#F9F8F6] p-4 rounded-xl border border-stone-200/80">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Related Problems Found
                  </div>
                  <div className="text-sm font-bold text-blue-600 mt-1">
                    {currentSample.clusterReports} reports
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5 font-medium">
                    <strong className="text-stone-900">{currentSample.clusterCitizens.toLocaleString()}</strong> potentially affected
                  </div>
                </div>

              </div>

              {/* Best Institutional Match & Industry Match */}
              <div className="mt-5 p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Best Institutional Match</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">{currentSample.universityMatch}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-blue-200/40">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    <span>Industry Match</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">{currentSample.industryMatch}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100 font-mono">
              <span>LATENCY: 0.84s • GEMINI 2.5</span>
              <span className="text-emerald-700 font-bold uppercase">State Jal Jeevan Synced</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
