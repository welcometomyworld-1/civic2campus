import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Navigation,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Loader2,
  Check,
} from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateUser: () => void;
  isLocating: boolean;
  onResetView: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  currentTileLayer: 'voyager' | 'osm' | 'topo';
  onChangeTileLayer: (layer: 'voyager' | 'osm' | 'topo') => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onLocateUser,
  isLocating,
  onResetView,
  isFullscreen,
  onToggleFullscreen,
  currentTileLayer,
  onChangeTileLayer,
}) => {
  const [showLayers, setShowLayers] = useState(false);

  const tileLayers: { id: 'voyager' | 'osm' | 'topo'; label: string; desc: string }[] = [
    { id: 'voyager', label: 'Clean Canvas', desc: 'CartoDB Light Voyager' },
    { id: 'osm', label: 'OpenStreetMap', desc: 'Detailed Civic Roadways' },
    { id: 'topo', label: 'Topographic', desc: 'Terrain & Contours' },
  ];

  return (
    <div className="flex flex-col gap-2 z-20">
      
      {/* Tile Layer Selector Popup */}
      <div className="relative">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 text-stone-700 hover:text-blue-600 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center"
          title="Change Map Style"
        >
          <Layers className="w-4 h-4" />
        </button>

        {showLayers && (
          <div className="absolute right-full mr-2 top-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/10 p-2 w-48 z-30 animate-in fade-in slide-in-from-right-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 py-1 border-b border-black/5 mb-1">
              Map Style
            </div>
            {tileLayers.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  onChangeTileLayer(l.id);
                  setShowLayers(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                  currentTileLayer === l.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div>
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-[10px] text-stone-400 font-normal">{l.desc}</div>
                </div>
                {currentTileLayer === l.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Geolocation Button */}
      <button
        onClick={onLocateUser}
        disabled={isLocating}
        className={`p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 transition-all cursor-pointer flex items-center justify-center group ${
          isLocating ? 'text-blue-600 animate-pulse' : 'text-stone-700 hover:text-blue-600 hover:bg-stone-50'
        }`}
        title="◎ My Location"
        id="civic-map-locate-btn"
      >
        {isLocating ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : (
          <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Reset Center View */}
      <button
        onClick={onResetView}
        className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 text-stone-700 hover:text-blue-600 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center"
        title="Reset Map Center"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 text-stone-700 hover:text-blue-600 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center"
        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Zoom In & Out Pill */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 flex flex-col overflow-hidden">
        <button
          onClick={onZoomIn}
          className="p-2.5 text-stone-700 hover:text-blue-600 hover:bg-stone-50 transition-colors border-b border-black/5 cursor-pointer flex items-center justify-center"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2.5 text-stone-700 hover:text-blue-600 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
