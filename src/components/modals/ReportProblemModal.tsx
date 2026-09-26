import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS } from '../../data/mockData';
import { PriorityLevel } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  X,
  Sparkles,
  MapPin,
  Camera,
  Video,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Upload,
  AlertTriangle,
  RotateCw,
  Building,
  GraduationCap,
  Navigation,
  Loader2,
  Flame,
  Clock,
  HelpCircle,
  Link,
  Plus,
  ShieldAlert,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PROBLEM_CATEGORIES = [
  { id: 'Water & Sanitation', label: 'Water & Sanitation', icon: '💧', color: 'blue' },
  { id: 'Waste Management', label: 'Waste Management', icon: '♻️', color: 'amber' },
  { id: 'Education', label: 'Education', icon: '📚', color: 'indigo' },
  { id: 'Healthcare', label: 'Healthcare', icon: '🏥', color: 'rose' },
  { id: 'Transportation', label: 'Transportation', icon: '🚌', color: 'sky' },
  { id: 'Infrastructure', label: 'Infrastructure', icon: '🏗️', color: 'stone' },
  { id: 'Environment', label: 'Environment', icon: '🌱', color: 'emerald' },
  { id: 'Agriculture', label: 'Agriculture', icon: '🌾', color: 'amber' },
  { id: 'Public Safety', label: 'Public Safety', icon: '🛡️', color: 'purple' },
  { id: 'Other', label: 'Other', icon: '⚡', color: 'stone' },
];

const FREQUENCY_OPTIONS = [
  { id: 'Daily / Continuous', label: 'Daily / Continuous', desc: 'Happens constantly every day' },
  { id: 'Weekly', label: 'Weekly', desc: 'Recurring multiple times a week' },
  { id: 'Seasonal / Monsoon', label: 'Seasonal / Monsoon', desc: 'Worsens during rains/summer' },
  { id: 'Sporadic / Rare', label: 'Sporadic / Occasional', desc: 'Intermittent breakdown' },
];

const URGENCY_OPTIONS: { id: PriorityLevel; label: string; desc: string; color: string; badgeBg: string }[] = [
  { id: 'LOW', label: 'Low', desc: 'Minor inconvenience, non-urgent', color: 'text-emerald-700', badgeBg: 'bg-emerald-50 border-emerald-200' },
  { id: 'MEDIUM', label: 'Medium', desc: 'Moderate disruption to daily life', color: 'text-amber-700', badgeBg: 'bg-amber-50 border-amber-200' },
  { id: 'HIGH', label: 'High', desc: 'Severe threat to livelihood/health', color: 'text-orange-700', badgeBg: 'bg-orange-50 border-orange-200' },
  { id: 'CRITICAL', label: 'Critical', desc: 'Immediate emergency risk to life', color: 'text-rose-700', badgeBg: 'bg-rose-50 border-rose-300' },
];

export const ReportProblemModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    reportProblem,
    setCurrentView,
    isLoggedIn,
    openReportProblemSafely,
  } = useApp();

  const [step, setStep] = useState(1);

  // 1. Problem Details States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water & Sanitation');
  const [whoIsAffected, setWhoIsAffected] = useState('120 Tribal households & school students');
  const [frequency, setFrequency] = useState('Daily / Continuous');
  const [urgency, setUrgency] = useState<PriorityLevel>('CRITICAL');
  const [population, setPopulation] = useState(640);

  // 2. Location States
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [stateName, setStateName] = useState('Jharkhand');
  const [district, setDistrict] = useState('Gumla');
  const [areaVillage, setAreaVillage] = useState('Toto Block, Kharwagarh Village');
  const [coordinates, setCoordinates] = useState<[number, number]>([23.0441, 84.5414]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // 3. Evidence States
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80'
  );
  const [photoFileName, setPhotoFileName] = useState<string>('borewell_damaged_proof.jpg');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentFileName, setDocumentFileName] = useState<string>('');
  const [supportingNotes, setSupportingNotes] = useState('');
  const [previousComplaintNumber, setPreviousComplaintNumber] = useState('JHK-MUNICIPAL-2026-9842');

  // Submission & AI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPhase, setAiPhase] = useState(0);
  const [submittedProblem, setSubmittedProblem] = useState<any | null>(null);

  // Mini-map Ref for Location step
  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapInstance = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  const aiPhases = [
    'Parsing problem details & semantic category vectors...',
    'Geocoding coordinates & clustering with regional Hotspots...',
    'Assessing multi-vector urgency & affected population severity...',
    'Matching university research departments & engineering faculty...',
    'Connecting with active CSR grant partners...',
  ];

  // Initialize or update Leaflet Mini-Map when on Step 2
  useEffect(() => {
    if (step === 2 && isReportModalOpen && miniMapRef.current) {
      // Delay slightly for modal container rendering
      const timeoutId = setTimeout(() => {
        if (!miniMapInstance.current && miniMapRef.current) {
          const map = L.map(miniMapRef.current, {
            center: coordinates,
            zoom: 11,
            zoomControl: true,
            attributionControl: false,
          });

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd',
          }).addTo(map);

          // Custom pin icon
          const pinIcon = L.divIcon({
            html: `
              <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 42px; height: 42px; border-radius: 9999px; background: #E11D48; opacity: 0.3; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="width: 30px; height: 30px; border-radius: 50% 50% 50% 0; background: #E11D48; transform: rotate(-45deg); border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(225,29,72,0.5); display: flex; align-items: center; justify-content: center;">
                </div>
                <div style="position: absolute; z-index: 10; margin-top: -2px; margin-left: -2px; color: white; font-size: 14px;">📍</div>
              </div>
            `,
            className: 'c2c-report-pin-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          const marker = L.marker(coordinates, {
            draggable: true,
            icon: pinIcon,
          }).addTo(map);

          marker.on('dragend', (e) => {
            const latlng = e.target.getLatLng();
            setCoordinates([latlng.lat, latlng.lng]);
            setLocationMessage(`Pin updated: ${latlng.lat.toFixed(4)}° N, ${latlng.lng.toFixed(4)}° E`);
          });

          map.on('click', (e) => {
            marker.setLatLng(e.latlng);
            setCoordinates([e.latlng.lat, e.latlng.lng]);
            setLocationMessage(`Location pinned: ${e.latlng.lat.toFixed(4)}° N, ${e.latlng.lng.toFixed(4)}° E`);
          });

          pinMarkerRef.current = marker;
          miniMapInstance.current = map;
        } else if (miniMapInstance.current) {
          miniMapInstance.current.invalidateSize();
          miniMapInstance.current.setView(coordinates, 11);
          if (pinMarkerRef.current) {
            pinMarkerRef.current.setLatLng(coordinates);
          }
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [step, isReportModalOpen]);

  // Clean up Leaflet on modal close
  useEffect(() => {
    if (!isReportModalOpen && miniMapInstance.current) {
      miniMapInstance.current.remove();
      miniMapInstance.current = null;
    }
  }, [isReportModalOpen]);

  if (!isReportModalOpen) return null;

  // Handle "Use My Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationMessage('Acquiring high-accuracy GPS fix...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCoordinates(coords);
        setIsLocating(false);
        setLocationMessage(`GPS fix locked: ${coords[0].toFixed(4)}° N, ${coords[1].toFixed(4)}° E`);

        if (miniMapInstance.current) {
          miniMapInstance.current.flyTo(coords, 14, { animate: true });
          if (pinMarkerRef.current) pinMarkerRef.current.setLatLng(coords);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationMessage('Could not retrieve location. Please pin manually on map.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Quick Presets for Demo
  const handleApplyPreset = (type: 'water' | 'mine' | 'agri') => {
    if (type === 'water') {
      setTitle('Village handpump broken for three months and 120 families face acute drinking water crisis');
      setDescription('120 tribal households in Toto block have zero potable water access. Children walking 3.5 km daily to muddy open stream resulting in severe waterborne illness.');
      setCategory('Water & Sanitation');
      setWhoIsAffected('120 Tribal families & primary school students');
      setFrequency('Daily / Continuous');
      setUrgency('CRITICAL');
      setDistrict('Gumla');
      setAreaVillage('Toto Block, Kharwagarh Village');
      setCoordinates([23.0441, 84.5414]);
      setPopulation(640);
      setImageUrl('https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80');
      setPhotoFileName('broken_handpump_toto.jpg');
      setPreviousComplaintNumber('GUM-WTR-2026-042');
    } else if (type === 'mine') {
      setTitle('Subsurface acid mine drainage seepage turning Katras community pond acidic');
      setDescription('Coal slurry and sulfur runoff from abandoned pit is leaching into domestic reservoir. pH measured at 4.2 with orange heavy metal precipitate.');
      setCategory('Environment');
      setWhoIsAffected('4,200 residents across Katrasgarh and downstream farmers');
      setFrequency('Daily / Continuous');
      setUrgency('CRITICAL');
      setDistrict('Dhanbad');
      setAreaVillage('Katrasgarh, Jharia Coal Belt');
      setCoordinates([23.7957, 86.4304]);
      setPopulation(4200);
      setImageUrl('https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80');
      setPhotoFileName('acid_drainage_jharia.jpg');
      setPreviousComplaintNumber('DHN-ENV-2026-118');
    } else if (type === 'agri') {
      setTitle('Rainfed upland paddy crop failure due to check dam leakage and erratic dry spells');
      setDescription('Check dam masonry cracked after monsoon. Over 640 smallholder tribal farmers lack micro-irrigation and soil moisture telemetry.');
      setCategory('Agriculture');
      setWhoIsAffected('640 smallholder tribal farmers & farmer cooperative');
      setFrequency('Seasonal / Monsoon');
      setUrgency('HIGH');
      setDistrict('Khunti');
      setAreaVillage('Murhu Block, Torpa Road');
      setCoordinates([23.0734, 85.2796]);
      setPopulation(3200);
      setImageUrl('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80');
      setPhotoFileName('cracked_checkdam_khunti.jpg');
      setPreviousComplaintNumber('KHT-AGR-2026-084');
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setStep(4);
    setAiPhase(0);

    const interval = setInterval(() => {
      setAiPhase((prev) => (prev < aiPhases.length - 1 ? prev + 1 : prev));
    }, 500);

    try {
      const problem = await reportProblem({
        title: title || 'Reported Community Challenge in Jharkhand',
        description: description || 'Community issue requiring academic research and engineering collaboration.',
        category,
        whoIsAffected,
        frequency,
        urgency,
        state: stateName,
        district,
        block: areaVillage,
        village: areaVillage,
        coordinates,
        imageUrl,
        videoUrl,
        documentUrl,
        supportingNotes,
        previousComplaintNumber,
        population,
      });

      setTimeout(() => {
        clearInterval(interval);
        setSubmittedProblem(problem);
        setIsSubmitting(false);
        confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 } });
      }, 2500);
    } catch (err) {
      clearInterval(interval);
      setIsSubmitting(false);
    }
  };

  const handleFinishAndOpenMatch = () => {
    setIsReportModalOpen(false);
    setCurrentView('map');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden text-[#141414] animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-black/5 flex items-center justify-between bg-[#F9F8F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#141414] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#141414] tracking-tight">
                Report a Community Problem
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Connect your civic challenge to university research & CSR funding
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
            id="report-problem-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        {step <= 3 && (
          <div className="px-5 sm:px-6 py-3 border-b border-black/5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${step === 1 ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'}`}>1</span>
                <span className={step === 1 ? 'text-blue-600 font-bold' : 'text-stone-500'}>Problem Details</span>
                <span className="text-stone-300">→</span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${step === 2 ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'}`}>2</span>
                <span className={step === 2 ? 'text-blue-600 font-bold' : 'text-stone-500'}>Location 📍</span>
                <span className="text-stone-300">→</span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${step === 3 ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'}`}>3</span>
                <span className={step === 3 ? 'text-blue-600 font-bold' : 'text-stone-500'}>Evidence 📸</span>
              </div>
            </div>

            {/* Quick Demo Fill Presets */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <span className="text-[10px] text-stone-400 font-bold uppercase">Quick Fill:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('water')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
              >
                Water Handpump
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mine')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
              >
                Mine Slurry
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('agri')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
              >
                Agritech
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Content Body */}
        <div className="p-5 sm:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* ========================================================
              STEP 1: PROBLEM DETAILS
             ======================================================== */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Problem Title */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Problem Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Broken handpump for 3 months, 120 tribal families lack safe water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9F8F6] border border-black/10 rounded-2xl text-xs sm:text-sm font-semibold text-[#141414] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  id="report-problem-title"
                />
              </div>

              {/* Describe the Problem — Detailed Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Describe the Problem — Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide full details: What is broken or failing? What is the root cause? How does it affect daily drinking water, crops, sanitation, or children's health?..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9F8F6] border border-black/10 rounded-2xl text-xs sm:text-sm text-[#141414] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                  id="report-problem-desc"
                />
              </div>

              {/* Problem Category Selection Grid */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                  Problem Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {PROBLEM_CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 font-bold shadow-xs'
                            : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <span className="text-xl mb-1">{cat.icon}</span>
                        <span className="text-[11px] leading-tight line-clamp-2">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Who is affected? */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Who is affected? <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 120 Tribal families, school children, farmers"
                    value={whoIsAffected}
                    onChange={(e) => setWhoIsAffected(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F9F8F6] border border-black/10 rounded-xl text-xs font-semibold text-[#141414] focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Estimated Affected Population Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Estimated Population Count
                    </label>
                    <span className="text-xs font-extrabold text-blue-600 font-mono">
                      ~{population.toLocaleString()} citizens
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="15000"
                    step="50"
                    value={population}
                    onChange={(e) => setPopulation(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Frequency & Urgency Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* How frequently does it occur? */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>How frequently does it occur?</span>
                  </label>
                  <div className="space-y-1.5">
                    {FREQUENCY_OPTIONS.map((freq) => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setFrequency(freq.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex items-center justify-between ${
                          frequency === freq.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{freq.label}</div>
                          <div className="text-[10px] text-stone-400 font-normal">{freq.desc}</div>
                        </div>
                        {frequency === freq.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Urgency Level</span>
                  </label>
                  <div className="space-y-1.5">
                    {URGENCY_OPTIONS.map((urg) => (
                      <button
                        key={urg.id}
                        type="button"
                        onClick={() => setUrgency(urg.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex items-center justify-between ${
                          urgency === urg.id
                            ? `${urg.badgeBg} border-rose-500 ring-2 ring-rose-500/20 font-bold`
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div>
                          <div className={`font-bold ${urgency === urg.id ? urg.color : 'text-stone-800'}`}>
                            {urg.label} Urgency
                          </div>
                          <div className="text-[10px] text-stone-400 font-normal">{urg.desc}</div>
                        </div>
                        {urgency === urg.id && <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              STEP 2: LOCATION 📍 + INTERACTIVE MAP PIN PICKER
             ======================================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Header explanation */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#141414]">
                    Pin Exact Problem Location on Map
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    This geocodes the problem so it connects directly to the Civic Innovation Map!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isLocating}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>Use My Location</span>
                </button>
              </div>

              {/* Location Input Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* State */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    State
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F9F8F6] border border-black/10 rounded-xl text-xs font-semibold text-[#141414]"
                  >
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bihar">Bihar</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Odisha">Odisha</option>
                  </select>
                </div>

                {/* District / City */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    District / City
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F9F8F6] border border-black/10 rounded-xl text-xs font-semibold text-[#141414]"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                    <option value="Meerut">Meerut</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </select>
                </div>

                {/* Area / Village */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Area / Village / Landmark
                  </label>
                  <input
                    type="text"
                    value={areaVillage}
                    onChange={(e) => setAreaVillage(e.target.value)}
                    placeholder="e.g. Toto Block, Ward 4"
                    className="w-full px-3 py-2 bg-[#F9F8F6] border border-black/10 rounded-xl text-xs font-semibold text-[#141414]"
                  />
                </div>
              </div>

              {/* Interactive Mini-Map Pin Picker */}
              <div className="relative rounded-2xl overflow-hidden border border-black/10 h-64 bg-stone-100 shadow-inner">
                <div ref={miniMapRef} className="w-full h-full" />

                {/* Floating instruction banner */}
                <div className="absolute top-2 left-2 right-2 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 text-[11px] font-medium text-stone-700 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Click on map or drag pin to fine-tune exact coordinates</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    {coordinates[0].toFixed(4)}°, {coordinates[1].toFixed(4)}°
                  </span>
                </div>
              </div>

              {locationMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{locationMessage}</span>
                </div>
              )}

            </div>
          )}

          {/* ========================================================
              STEP 3: EVIDENCE 📸 (PHOTOS, VIDEO, PDF, COMPLAINTS)
             ======================================================== */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Photo Upload / URL */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Photos / Image Proof <span className="text-rose-500">*</span></span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL (or use default evidence)"
                      className="w-full px-3 py-2 bg-[#F9F8F6] border border-black/10 rounded-xl text-xs font-semibold text-[#141414]"
                    />
                    <div className="p-3 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-center">
                      <Upload className="w-5 h-5 mx-auto text-stone-400 mb-1" />
                      <div className="text-xs font-bold text-stone-700">{photoFileName}</div>
                      <div className="text-[10px] text-stone-400">JPG, PNG, WebP up to 10MB</div>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-black/10 h-32 bg-stone-100 flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Problem Proof Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-xs text-stone-400">
                        <Camera className="w-6 h-6 mx-auto text-stone-300 mb-1" />
                        <span>No image provided</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Video & Upload Document / PDF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload Video */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                    <span>Upload Video / Clip (Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Video link (YouTube, MP4, Drone footage)"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                  <p className="text-[10px] text-stone-500">
                    Video evidence accelerates AI priority verification by 40%.
                  </p>
                </div>

                {/* Upload Document / PDF */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Document / PDF (Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    placeholder="Water test report / Panchayat letter link"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                  <p className="text-[10px] text-stone-500">
                    Lab test reports, panchayat notices, or ground surveys.
                  </p>
                </div>
              </div>

              {/* Add Supporting Evidence & Previous Reference No */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Add Supporting Evidence Notes
                  </label>
                  <textarea
                    rows={2}
                    value={supportingNotes}
                    onChange={(e) => setSupportingNotes(e.target.value)}
                    placeholder="e.g. Water tested with field kit showed high iron & fluoride. Gram Panchayat resolution passed on 12th Aug."
                    className="w-full px-3 py-2 bg-[#F9F8F6] border border-black/10 rounded-xl text-xs text-[#141414]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 flex items-center justify-between">
                    <span>Optional: Previous Complaint / Reference Number</span>
                    <span className="text-[10px] text-stone-400 font-normal">Municipal / RTI Reference</span>
                  </label>
                  <input
                    type="text"
                    value={previousComplaintNumber}
                    onChange={(e) => setPreviousComplaintNumber(e.target.value)}
                    placeholder="e.g. JHK-MUNICIPAL-2026-9842 or RTI-WTR-881"
                    className="w-full px-3 py-2 bg-[#F9F8F6] border border-black/10 rounded-xl text-xs font-semibold text-[#141414]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              STEP 4: AI SEMANTIC TRIAGE & CONFIRMATION
             ======================================================== */}
          {step === 4 && (
            <div className="text-center py-6 space-y-6 animate-in fade-in">
              {isSubmitting ? (
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-[#141414] text-white flex items-center justify-center mx-auto shadow-2xl">
                    <Cpu className="w-8 h-8 text-blue-400 animate-spin" />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#141414]">
                      AI Semantic Matrix & Geocoding Engine
                    </h4>
                    <p className="text-xs font-semibold text-blue-600 mt-2 font-mono">
                      {aiPhases[aiPhase]}
                    </p>
                  </div>

                  <div className="w-full max-w-md mx-auto h-2.5 bg-stone-100 rounded-full overflow-hidden border border-black/5">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${((aiPhase + 1) / aiPhases.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : submittedProblem ? (
                <div className="space-y-5 animate-in zoom-in-95 text-left">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-emerald-900">
                        Problem Successfully Broadcasted & Pinned on Map!
                      </h4>
                      <p className="text-xs text-emerald-700">
                        Geotagged at [{coordinates[0].toFixed(4)}°, {coordinates[1].toFixed(4)}°] • Matched with BIT Mesra R&D Lab
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F9F8F6] border border-black/5 text-xs space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Problem ID:</span>
                      <span className="font-mono font-bold text-stone-900">{submittedProblem.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Category / Domain:</span>
                      <span className="font-bold text-blue-600">{submittedProblem.domain} ({category})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Priority Score:</span>
                      <span className="font-bold text-rose-600">{submittedProblem.priorityScore}/100 ({submittedProblem.priority})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Location Pinned:</span>
                      <span className="font-bold text-stone-800">{areaVillage} • {district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Matched University Lead:</span>
                      <span className="font-bold text-indigo-700">BIT Mesra Hydro-Sensors Lab (96% Match)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleFinishAndOpenMatch}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Hotspot on Innovation Map</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Modal Footer Navigation */}
        {step <= 3 && (
          <div className="p-4 sm:p-6 border-t border-black/5 bg-[#F9F8F6] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 rounded-xl border border-black/10 bg-white hover:bg-stone-100 text-xs font-bold uppercase tracking-wider text-[#141414] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 rounded-xl bg-[#141414] hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Submit with AI</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
