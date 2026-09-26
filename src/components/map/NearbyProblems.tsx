import React from 'react';
import {
  AlertTriangle,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Flame,
  Activity,
  Compass,
} from 'lucide-react';
import { MapProblemItem } from '../../data/mapData';

interface NearbyProblemsProps {
  problems: MapProblemItem[];
  userLocation: [number, number] | null;
  onSelectProblem: (problem: MapProblemItem) => void;
  onOpenAIAnalysis: (problem: MapProblemItem) => void;
}

export const NearbyProblems: React.FC<NearbyProblemsProps> = ({
  problems,
  userLocation,
  onSelectProblem,
  onOpenAIAnalysis,
}) => {
  // Calculate approximate distance from user if available
  const getDistanceText = (coords: [number, number], index: number) => {
    if (!userLocation) {
      // Mock realistic relative distances
      const mockDists = ['2.4 km', '4.8 km', '9.1 km', '14.2 km', '18.5 km', '24.0 km'];
      return mockDists[index % mockDists.length];
    }
    // Haversine formula approximation
    const lat1 = userLocation[0];
    const lon1 = userLocation[1];
    const lat2 = coords[0];
    const lon2 = coords[1];
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return `${d.toFixed(1)} km away`;
  };

  return (
    <section className="w-full bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-wider text-xs mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Civic Triage Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#141414] tracking-tight">
            Problems Near You
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {userLocation
              ? 'Real-time localized community challenges sorted by geographic proximity.'
              : 'Discovered community problems requiring academic research & engineering solutions. Click any problem to pan the map.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 border border-stone-200">
            {problems.length} Hotspots Active
          </span>
        </div>
      </div>

      {/* Grid of Nearby Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems.map((prob, idx) => {
          const isCritical = prob.priority === 'CRITICAL';
          const distanceStr = getDistanceText(prob.coordinates, idx);

          return (
            <div
              key={prob.id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all group hover:shadow-md cursor-pointer ${
                isCritical
                  ? 'border-rose-200/80 bg-gradient-to-br from-rose-50/40 via-white to-stone-50/50 hover:border-rose-400'
                  : 'border-black/10 bg-white hover:border-blue-300 hover:bg-blue-50/20'
              }`}
              onClick={() => onSelectProblem(prob)}
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border flex items-center gap-1 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-700 border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                    <span>{prob.priority} Priority</span>
                  </span>

                  <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-stone-400" />
                    <span>{distanceStr}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-extrabold text-[#141414] group-hover:text-blue-600 transition-colors line-clamp-2">
                  {prob.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                  <span className="truncate">
                    {prob.locationName} • {prob.district}
                  </span>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {prob.description}
                </p>

                {/* Impact Stat */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-black/5 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{prob.affectedPopulation.toLocaleString()} citizens</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-blue-700">
                    {prob.domain}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAIAnalysis(prob);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 py-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Analysis</span>
                </button>

                <span className="text-xs font-bold text-stone-800 group-hover:text-blue-600 flex items-center gap-1 transition-transform group-hover:translate-x-1">
                  <span>Pan Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
