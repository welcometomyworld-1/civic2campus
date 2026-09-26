import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  MapPin,
  AlertTriangle,
  GraduationCap,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { MapItem, MarkerCategory } from '../../data/mapData';

interface MapSearchProps {
  items: MapItem[];
  onSelectItem: (item: MapItem) => void;
  onSearchLocation: (query: string, coordinates?: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const POPULAR_LOCATIONS: { name: string; query: string; coords?: [number, number] }[] = [
  { name: 'Gumla', query: 'Gumla', coords: [23.0441, 84.5414] },
  { name: 'Ranchi', query: 'Ranchi', coords: [23.3441, 85.3096] },
  { name: 'Dhanbad', query: 'Dhanbad', coords: [23.7957, 86.4304] },
  { name: 'Meerut', query: 'Meerut', coords: [28.9845, 77.7064] },
  { name: 'Delhi', query: 'Delhi', coords: [28.6139, 77.2090] },
  { name: 'Water Problem', query: 'Water' },
  { name: 'Universities', query: 'University' },
  { name: 'Industry', query: 'Industry' },
];

export const MapSearch: React.FC<MapSearchProps> = ({
  items,
  onSelectItem,
  onSearchLocation,
  searchQuery,
  setSearchQuery,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = searchQuery.trim().toLowerCase();

  const filteredItems = trimmed
    ? items.filter((item) => {
        const matchName = item.name.toLowerCase().includes(trimmed);
        const matchDistrict = item.district.toLowerCase().includes(trimmed);
        const matchLocation = item.locationName.toLowerCase().includes(trimmed);
        const matchCategory = item.category.toLowerCase().includes(trimmed);
        const matchDesc = item.description.toLowerCase().includes(trimmed);
        const matchDomain = (item as any).domain?.toLowerCase().includes(trimmed);
        return matchName || matchDistrict || matchLocation || matchCategory || matchDesc || matchDomain;
      })
    : [];

  const handleSelect = (item: MapItem) => {
    setSearchQuery(item.name);
    setIsOpen(false);
    onSelectItem(item);
  };

  const handleLocationChip = (chip: { name: string; query: string; coords?: [number, number] }) => {
    setSearchQuery(chip.name);
    setIsOpen(false);
    onSearchLocation(chip.query, chip.coords);
  };

  const getCategoryIcon = (category: MarkerCategory) => {
    switch (category) {
      case 'problem':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'university':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'industry':
        return <Building className="w-4 h-4 text-purple-600" />;
      case 'solution':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getCategoryBadge = (category: MarkerCategory) => {
    switch (category) {
      case 'problem':
        return <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Problem</span>;
      case 'university':
        return <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">University</span>;
      case 'industry':
        return <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Industry</span>;
      case 'solution':
        return <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Solution</span>;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 transition-all focus-within:ring-2 focus-within:ring-blue-600/30 focus-within:border-blue-600">
        <div className="pl-4 pr-2 text-stone-400">
          <Search className="w-4 h-4 text-stone-500" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search location, problem, university or industry..."
          className="w-full py-3.5 pr-10 text-xs sm:text-sm font-medium text-stone-900 bg-transparent focus:outline-none placeholder:text-stone-400"
          id="civic-map-search-input"
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Auto-suggest Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 max-h-[420px] flex flex-col">
          
          {/* Quick Filter Suggestions */}
          <div className="p-3 bg-stone-50/80 border-b border-black/5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
              Popular Quick Searches
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_LOCATIONS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleLocationChip(chip)}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white border border-stone-200/80 hover:border-blue-500 hover:text-blue-600 text-stone-700 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{chip.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/60 transition-colors text-left group cursor-pointer border border-transparent hover:border-blue-100"
                >
                  <div className="p-2 rounded-xl bg-stone-100 group-hover:bg-white transition-colors mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#141414] truncate group-hover:text-blue-600">
                        {item.name}
                      </h4>
                      {getCategoryBadge(item.category)}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {item.locationName} • {item.district}, {item.state}
                    </p>
                    <p className="text-[11px] text-stone-600 line-clamp-1 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-blue-600 self-center transition-transform group-hover:translate-x-0.5" />
                </button>
              ))
            ) : searchQuery.trim() ? (
              <div className="p-6 text-center text-stone-500">
                <Search className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <div className="text-xs font-bold text-stone-800">No matching hotspots found</div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Try searching for a district like "Ranchi", "Gumla", "Meerut" or "Water"
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-stone-400 text-xs">
                Type above or click a popular location tag to zoom directly on the map.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
