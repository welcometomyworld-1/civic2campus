import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
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
  MarkerCategory,
} from '../data/mapData';
import { MapContainer } from '../components/map/MapContainer';
import { MapSearch } from '../components/map/MapSearch';
import { MapFilters, FilterState } from '../components/map/MapFilters';
import { MapControls } from '../components/map/MapControls';
import { MapStatistics } from '../components/map/MapStatistics';
import { LocationDetailsPanel } from '../components/map/LocationDetailsPanel';
import { NearbyProblems } from '../components/map/NearbyProblems';
import { AIAnalysisModal } from '../components/map/AIAnalysisModal';

export const InnovationMapPage: React.FC = () => {
  const { setCurrentView, setSelectedProblem } = useApp();

  // Selected item state for side panel / bottom sheet
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
  const mapSectionRef = useRef<HTMLDivElement>(null);

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
        } else if (item.category === 'solution') {
          // Keep solutions or check domain match
        } else {
          return false;
        }
      }

      // Priority filter (if problem)
      if (filterState.priority !== 'all') {
        if (item.category === 'problem') {
          const prob = item as MapProblemItem;
          if (prob.priority !== filterState.priority) return false;
        } else {
          return false;
        }
      }

      // Status filter
      if (filterState.status !== 'all') {
        if (item.category === 'problem') {
          const prob = item as MapProblemItem;
          if (prob.status !== filterState.status) return false;
        } else if (item.category === 'solution') {
          const sol = item as MapSolutionItem;
          if (!sol.deploymentStatus.toLowerCase().includes(filterState.status.toLowerCase())) return false;
        }
      }

      return true;
    });
  }, [filterState]);

  // Counts for filters and stats
  const counts = useMemo(() => {
    const problems = MAP_ITEMS.filter((i) => i.category === 'problem') as MapProblemItem[];
    const universities = MAP_ITEMS.filter((i) => i.category === 'university');
    const industry = MAP_ITEMS.filter((i) => i.category === 'industry');
    const solutions = MAP_ITEMS.filter((i) => i.category === 'solution') as MapSolutionItem[];
    const critical = problems.filter((p) => p.priority === 'CRITICAL').length;
    const citizensImpacted = solutions.reduce((acc, s) => acc + s.impactCitizens, 0) + 120000;

    return {
      all: MAP_ITEMS.length,
      problems: problems.length,
      critical,
      universities: universities.length,
      industry: industry.length,
      solutions: solutions.length,
      citizensImpacted,
    };
  }, []);

  // Map Instance Callback
  const handleMapRef = useCallback((map: L.Map | null) => {
    mapInstanceRef.current = map;
  }, []);

  // Select Item Handler
  const handleSelectItem = (item: MapItem) => {
    setSelectedItem(item);
    setIsSidePanelOpen(true);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(item.coordinates, 13, {
        animate: true,
        duration: 1.2,
      });
    }
  };

  // Search Location Handler
  const handleSearchLocation = (query: string, coords?: [number, number]) => {
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 12, {
        animate: true,
        duration: 1.2,
      });
      return;
    }

    // Match query against items or districts
    const match = MAP_ITEMS.find(
      (item) =>
        item.district.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    if (match) {
      handleSelectItem(match);
    }
  };

  // Zoom Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([23.5, 85.3], 8, {
        animate: true,
        duration: 1.0,
      });
    }
  };

  // Geolocation Handler
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationToast({
        message: 'Geolocation is not supported by your browser.',
        type: 'error',
      });
      setTimeout(() => setLocationToast(null), 4000);
      return;
    }

    setIsLocating(true);
    setLocationToast({
      message: 'Requesting your device location...',
      type: 'info',
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(coords);
        setIsLocating(false);
        setLocationToast({
          message: 'Location acquired! Map centered on your position.',
          type: 'success',
        });
        setTimeout(() => setLocationToast(null), 4000);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(coords, 13, {
            animate: true,
            duration: 1.5,
          });
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Location permission denied. Please allow location access in your browser.';
        if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.';
        }
        setLocationToast({
          message: errorMsg,
          type: 'error',
        });
        setTimeout(() => setLocationToast(null), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Fullscreen Toggle
  const handleToggleFullscreen = () => {
    if (!mapWrapperRef.current) return;

    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Nearby Problems list (problems items)
  const nearbyProblemsList = useMemo(() => {
    return MAP_ITEMS.filter((i) => i.category === 'problem') as MapProblemItem[];
  }, []);

  const handleSelectNearbyProblem = (prob: MapProblemItem) => {
    handleSelectItem(prob);
    // Scroll map smoothly into view on mobile
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenAIAnalysis = (prob: MapProblemItem) => {
    setAnalysisProblem(prob);
    setIsAIModalOpen(true);
  };

  const handleSelectRelatedItem = (itemId: string) => {
    const found = MAP_ITEMS.find((i) => i.id === itemId);
    if (found) {
      handleSelectItem(found);
    }
  };

  return (
    <div className="w-full bg-[#F9F8F6] min-h-screen font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 3. Page Header */}
      <section className="border-b border-black/5 bg-white/70 backdrop-blur-xs pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Geospatial Civic Matrix</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#141414] tracking-tight font-serif-display">
                Civic Innovation Map
              </h1>
              
              <p className="text-sm sm:text-base text-stone-600 font-medium max-w-2xl mt-2">
                Discover community problems, universities, industry partners and deployed solutions.
              </p>
            </div>

            {/* Quick Action Pill */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLocateUser()}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-white hover:bg-stone-50 text-[#141414] border border-black/10 shadow-2xs transition-all cursor-pointer"
                id="c2c-header-nearby-btn"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Find Nearby Me</span>
              </button>

              <button
                onClick={() => {
                  setFilterState({
                    category: 'problem',
                    domain: 'all',
                    priority: 'CRITICAL',
                    district: 'all',
                    status: 'all',
                  });
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{counts.critical} Critical Urgencies</span>
              </button>
            </div>
          </div>

          {/* 12. Map Statistics Cards */}
          <div className="mt-8">
            <MapStatistics
              counts={counts}
              activeCategory={filterState.category}
              onSelectCategory={(cat) =>
                setFilterState((prev) => ({ ...prev, category: cat }))
              }
            />
          </div>

        </div>
      </section>

      {/* Main Map Experience Area */}
      <section ref={mapSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Toast Notification for Geolocation & Actions */}
        {locationToast && (
          <div
            className={`mb-3 p-3 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 shadow-lg border ${
              locationToast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : locationToast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{locationToast.message}</span>
            </div>
            <button
              onClick={() => setLocationToast(null)}
              className="p-1 hover:bg-black/5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Map Container Viewport Box with Google-Maps UX */}
        <div
          ref={mapWrapperRef}
          className={`relative w-full rounded-3xl overflow-hidden border border-black/10 shadow-2xl bg-stone-100 transition-all ${
            isFullscreen ? 'h-screen rounded-none' : 'h-[620px] sm:h-[680px] lg:h-[720px]'
          }`}
        >
          
          {/* Floating Search Bar & Filter Row on Top */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-none max-w-2xl">
            <div className="pointer-events-auto">
              <MapSearch
                items={MAP_ITEMS}
                onSelectItem={handleSelectItem}
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
              onLocateUser={handleLocateUser}
              isLocating={isLocating}
              onResetView={handleResetView}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              currentTileLayer={tileLayerType}
              onChangeTileLayer={setTileLayerType}
            />
          </div>

          {/* Core Interactive Leaflet Map */}
          <MapContainer
            items={filteredItems}
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            userLocation={userLocation}
            tileLayerType={tileLayerType}
            mapRefCallback={handleMapRef}
          />

          {/* Bottom Left Legend Badge */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-black/10 shadow-md text-[11px] text-stone-600 hidden sm:flex items-center gap-3">
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

          {/* Side Panel (Desktop) / Slide-up Bottom Sheet (Mobile) */}
          {selectedItem && isSidePanelOpen && (
            <div className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[420px] md:w-[460px] lg:w-[480px] shadow-2xl border-l border-black/10 pointer-events-auto">
              <LocationDetailsPanel
                item={selectedItem}
                onClose={() => setIsSidePanelOpen(false)}
                onOpenAIAnalysis={handleOpenAIAnalysis}
                onNavigateToProblemView={(probId) => {
                  setSelectedProblem(
                    MAP_ITEMS.find((p) => p.id === probId) as any
                  );
                  setCurrentView('problems');
                }}
                onNavigateToMatchCenter={(id) => {
                  setCurrentView('match-center');
                }}
                onNavigateToWorkspace={(projId) => {
                  setCurrentView('workspace');
                }}
                onSelectRelatedItem={handleSelectRelatedItem}
              />
            </div>
          )}

          {/* Quick Drawer Reopen Tab if panel was closed */}
          {selectedItem && !isSidePanelOpen && (
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-black/10 shadow-lg text-xs font-bold text-stone-900 hover:bg-stone-50 transition-all cursor-pointer animate-in fade-in"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Show {selectedItem.name.slice(0, 22)}...</span>
            </button>
          )}

        </div>

      </section>

      {/* 10. Nearby Problems ("Problems Near You") Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <NearbyProblems
          problems={nearbyProblemsList}
          userLocation={userLocation}
          onSelectProblem={handleSelectNearbyProblem}
          onOpenAIAnalysis={handleOpenAIAnalysis}
        />
      </section>

      {/* Deep AI Analysis Modal */}
      <AIAnalysisModal
        problem={analysisProblem}
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onFindMatch={(prob) => {
          handleSelectItem(prob);
          setCurrentView('match-center');
        }}
      />

    </div>
  );
};
