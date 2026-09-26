import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  MapPin,
  AlertTriangle,
  GraduationCap,
  Building,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  X,
  Sliders,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import L from 'leaflet';
import {
  MAP_ITEMS,
  MAP_STATISTICS,
  MapItem,
  MapProblemItem,
  MapUniversityItem,
  MapIndustryItem,
  MapSolutionItem,
} from '../../data/mapData';
import { MapContainer } from '../map/MapContainer';
import { MapSearch } from '../map/MapSearch';
import { MapFilters, FilterState } from '../map/MapFilters';
import { MapControls } from '../map/MapControls';
import { MapStatistics } from '../map/MapStatistics';
import { LocationDetailsPanel } from '../map/LocationDetailsPanel';
import { AIAnalysisModal } from '../map/AIAnalysisModal';

export const UniversityInnovationMapView: React.FC = () => {
  const { setCurrentView, setSelectedProblem } = useApp();

  // Selected item state for side panel
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(MAP_ITEMS[0]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
    domain: 'all',
    priority: 'all',
    district: 'all',
    status: 'all',
  });

  // Geolocation state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Tile layer style state
  const [tileLayerType, setTileLayerType] = useState<'voyager' | 'osm' | 'topo'>('voyager');

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // AI Analysis Modal state
  const [analysisProblem, setAnalysisProblem] = useState<MapProblemItem | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  // Get distinct districts list for filters
  const districtsList = useMemo(() => {
    const list = Array.from(new Set(MAP_ITEMS.map((i) => i.district)));
    return list.sort();
  }, []);

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return MAP_ITEMS.filter((item) => {
      // Category filter
      if (filterState.category !== 'all' && item.category !== filterState.category) {
        return false;
      }

      // District filter
      if (filterState.district !== 'all' && item.district.toLowerCase() !== filterState.district.toLowerCase()) {
        return false;
      }

      // Domain filter (if problem)
      if (filterState.domain !== 'all') {
        if (item.category === 'problem') {
          const prob = item as MapProblemItem;
          if (prob.domain.toLowerCase() !== filterState.domain.toLowerCase()) return false;
        }
      }

      // Priority filter (if problem)
      if (filterState.priority !== 'all') {
        if (item.category === 'problem') {
          const prob = item as MapProblemItem;
          if (prob.priority.toLowerCase() !== filterState.priority.toLowerCase()) return false;
        }
      }

      // Status filter
      if (filterState.status !== 'all') {
        if (item.category === 'problem') {
          const prob = item as MapProblemItem;
          if (prob.status.toLowerCase() !== filterState.status.toLowerCase()) return false;
        }
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const districtMatch = item.district.toLowerCase().includes(q);
        const descMatch = item.description ? item.description.toLowerCase().includes(q) : false;
        if (!nameMatch && !districtMatch && !descMatch) return false;
      }

      return true;
    });
  }, [filterState, searchQuery]);

  // Counts for filters
  const counts = useMemo(() => {
    const problems = MAP_ITEMS.filter((i) => i.category === 'problem');
    const universities = MAP_ITEMS.filter((i) => i.category === 'university');
    const industry = MAP_ITEMS.filter((i) => i.category === 'industry');
    const solutions = MAP_ITEMS.filter((i) => i.category === 'solution');

    return {
      all: MAP_ITEMS.length,
      problems: problems.length,
      universities: universities.length,
      industry: industry.length,
      solutions: solutions.length,
    };
  }, []);

  // Geolocation Handler
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationToast({ message: 'Geolocation is not supported by your browser.', type: 'error' });
      setTimeout(() => setLocationToast(null), 4000);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
        setLocationToast({ message: 'Centered on your current GPS location in Jharkhand!', type: 'success' });
        setTimeout(() => setLocationToast(null), 4000);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
        }
      },
      (error) => {
        setIsLocating(false);
        // Fallback default coordinates (Ranchi)
        setUserLocation([23.3441, 85.3096]);
        setLocationToast({
          message: 'Defaulted to Ranchi Coordinates (GPS permission was not provided).',
          type: 'info',
        });
        setTimeout(() => setLocationToast(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Map Instance Captured Callback
  const handleMapReady = useCallback((map: L.Map | null) => {
    mapInstanceRef.current = map;
  }, []);

  // Zoom Handlers
  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  }, []);

  // Reset View Handler
  const handleResetView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([23.5, 85.3], 8, { duration: 1.2 });
    }
    setSelectedItem(null);
  }, []);

  // Marker Click Handler
  const handleMarkerClick = useCallback((item: MapItem) => {
    setSelectedItem(item);
    setIsSidePanelOpen(true);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(item.coordinates, 12, { duration: 1.0 });
    }
  }, []);

  // Search Location Handler
  const handleSearchLocation = useCallback((query: string, coords?: [number, number]) => {
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 12, { duration: 1.2 });
      return;
    }
    const match = MAP_ITEMS.find(
      (item) =>
        item.district.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      handleMarkerClick(match);
    }
  }, [handleMarkerClick]);

  // AI Analysis View Trigger
  const handleOpenAIAnalysis = useCallback((problem: MapProblemItem) => {
    setAnalysisProblem(problem);
    setIsAIModalOpen(true);
  }, []);

  // Fullscreen Toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>GIS Geospatial Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Statewide Innovation & Problem Map
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
              Explore 24 districts of Jharkhand with real-time geospatial coordinates of community problems, university squads, corporate CSR plants, and deployed solutions.
            </p>
          </div>
          <button
            onClick={handleResetView}
            className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Center Jharkhand Map</span>
          </button>
        </div>
      </div>

      {/* Embedded Map Section */}
      <div
        ref={mapWrapperRef}
        className={`bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs relative flex flex-col ${
          isFullscreen ? 'h-screen rounded-none' : 'h-[750px]'
        }`}
      >
        {/* Top Floating Search & Filters Bar */}
        <div className="absolute top-4 left-4 right-16 z-20 flex flex-col gap-2 pointer-events-none max-w-2xl">
          <div className="pointer-events-auto">
            <MapSearch
              items={MAP_ITEMS}
              onSelectItem={handleMarkerClick}
              onSearchLocation={handleSearchLocation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <div className="pointer-events-auto">
            <MapFilters
              filterState={filterState}
              setFilterState={setFilterState}
              counts={counts}
              districtsList={districtsList}
            />
          </div>
        </div>

        {/* Floating Right Map Controls */}
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onLocateUser={handleLocateMe}
            isLocating={isLocating}
            onResetView={handleResetView}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            currentTileLayer={tileLayerType}
            onChangeTileLayer={setTileLayerType}
          />
        </div>

        {/* Core Interactive Leaflet Map */}
        <div className="relative flex-1 w-full h-full">
          <MapContainer
            items={filteredItems}
            selectedItem={selectedItem}
            onSelectItem={handleMarkerClick}
            userLocation={userLocation}
            tileLayerType={tileLayerType}
            mapRefCallback={handleMapReady}
          />

          {/* Bottom Left Legend Badge */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200 shadow-md text-[11px] text-stone-600 hidden sm:flex items-center gap-3">
            <span className="font-bold text-stone-900 text-xs">Hotspot Legend:</span>
            <span className="flex items-center gap-1 font-semibold text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Problems
            </span>
            <span className="flex items-center gap-1 font-semibold text-indigo-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Universities
            </span>
            <span className="flex items-center gap-1 font-semibold text-purple-700">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Industry
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Solutions
            </span>
          </div>

          {/* Side Panel Drawer (Desktop & Mobile) */}
          {selectedItem && isSidePanelOpen && (
            <div className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[420px] md:w-[460px] lg:w-[480px] shadow-2xl border-l border-stone-200 pointer-events-auto bg-white">
              <LocationDetailsPanel
                item={selectedItem}
                onClose={() => setIsSidePanelOpen(false)}
                onOpenAIAnalysis={handleOpenAIAnalysis}
                onNavigateToProblemView={(probId) => {
                  const prob = MAP_ITEMS.find((p) => p.id === probId);
                  if (prob) setSelectedProblem(prob as any);
                  setCurrentView('problems');
                }}
                onNavigateToMatchCenter={() => {
                  setCurrentView('match-center');
                }}
                onNavigateToWorkspace={() => {
                  setCurrentView('workspace');
                }}
                onSelectRelatedItem={(id) => {
                  const found = MAP_ITEMS.find((i) => i.id === id);
                  if (found) handleMarkerClick(found);
                }}
              />
            </div>
          )}

          {/* Quick Drawer Reopen Tab if panel was closed */}
          {selectedItem && !isSidePanelOpen && (
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-lg text-xs font-bold text-stone-900 hover:bg-stone-50 transition-all cursor-pointer animate-in fade-in"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Show {selectedItem.name.slice(0, 22)}...</span>
            </button>
          )}

          {/* Toast Notifications */}
          {locationToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>{locationToast.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        problem={analysisProblem}
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onFindMatch={(prob) => {
          handleMarkerClick(prob);
          setCurrentView('match-center');
        }}
      />
    </div>
  );
};

