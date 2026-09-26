import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapItem,
  MapProblemItem,
  MapUniversityItem,
  MapIndustryItem,
  MapSolutionItem,
} from '../../data/mapData';

interface MapContainerProps {
  items: MapItem[];
  selectedItem: MapItem | null;
  onSelectItem: (item: MapItem) => void;
  userLocation: [number, number] | null;
  centerCoords?: [number, number];
  zoomLevel?: number;
  tileLayerType?: 'voyager' | 'osm' | 'topo';
  mapRefCallback?: (mapInstance: L.Map | null) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  items,
  selectedItem,
  onSelectItem,
  userLocation,
  centerCoords = [23.5, 85.3], // Central Jharkhand Default
  zoomLevel = 8,
  tileLayerType = 'voyager',
  mapRefCallback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center: centerCoords as L.LatLngExpression,
        zoom: zoomLevel,
        zoomControl: false, // We use custom floating MapControls
        attributionControl: false,
      });

      // Add attribution in small font
      L.control
        .attribution({
          position: 'bottomright',
          prefix: false,
        })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Civic2Campus Matrix')
        .addTo(map);

      // Add Tile Layer immediately
      let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      let maxZoom = 19;
      if (tileLayerType === 'osm') {
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        maxZoom = 19;
      } else if (tileLayerType === 'topo') {
        url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        maxZoom = 17;
      }
      const initialTileLayer = L.tileLayer(url, {
        maxZoom,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = initialTileLayer;

      // Create LayerGroups for markers
      const markersLayer = L.layerGroup().addTo(map);
      const userMarkerLayer = L.layerGroup().addTo(map);

      markersLayerRef.current = markersLayer;
      userMarkerLayerRef.current = userMarkerLayer;
      mapInstanceRef.current = map;

      if (mapRefCallback) {
        mapRefCallback(map);
      }

      // Ensure proper Leaflet container sizing after mount
      const t1 = setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 100);
      const t2 = setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          if (mapRefCallback) mapRefCallback(null);
        }
      };
    }
  }, []);

  // Update Tile Layer when tileLayerType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let maxZoom = 19;

    if (tileLayerType === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
    } else if (tileLayerType === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZoom = 17;
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
    map.invalidateSize();
  }, [tileLayerType]);

  // Create custom marker icons
  const createMarkerIcon = (item: MapItem, isSelected: boolean) => {
    let pinColor = '#E11D48'; // rose
    let shadowColor = 'rgba(225, 29, 72, 0.4)';
    let innerSvg = '';
    let isCritical = false;

    if (item.category === 'problem') {
      const prob = item as MapProblemItem;
      isCritical = prob.priority === 'CRITICAL';
      pinColor = isCritical ? '#E11D48' : '#D97706';
      shadowColor = isCritical ? 'rgba(225, 29, 72, 0.5)' : 'rgba(217, 119, 6, 0.5)';
      innerSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else if (item.category === 'university') {
      pinColor = '#4F46E5'; // indigo
      shadowColor = 'rgba(79, 70, 229, 0.4)';
      innerSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
    } else if (item.category === 'industry') {
      pinColor = '#9333EA'; // purple
      shadowColor = 'rgba(147, 51, 234, 0.4)';
      innerSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`;
    } else if (item.category === 'solution') {
      pinColor = '#059669'; // emerald
      shadowColor = 'rgba(5, 150, 105, 0.4)';
      innerSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    }

    const scale = isSelected ? 1.25 : 1.0;
    const pulseRing =
      isCritical || isSelected
        ? `<div style="position: absolute; top: -6px; left: -6px; width: 44px; height: 44px; border-radius: 9999px; background: ${pinColor}; opacity: 0.3; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
        : '';

    const html = `
      <div style="position: relative; width: 32px; height: 32px; transform: scale(${scale}); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; display: flex; align-items: center; justify-content: center;">
        ${pulseRing}
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          background: ${pinColor};
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px ${shadowColor}, 0 2px 4px rgba(0,0,0,0.15);
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
        ">
        </div>
        <div style="position: relative; z-index: 10; margin-top: -2px; margin-left: -2px;">
          ${innerSvg}
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'c2c-custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Render Map Items Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    items.forEach((item) => {
      const isSelected = selectedItem?.id === item.id;
      const markerIcon = createMarkerIcon(item, isSelected);

      const marker = L.marker(item.coordinates, {
        icon: markerIcon,
        zIndexOffset: isSelected ? 1000 : 10,
      });

      // Quick Popup
      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; color: #141414; padding: 2px; min-width: 180px;">
          <div style="font-weight: 800; font-size: 13px; line-height: 1.2; margin-bottom: 3px;">${item.name}</div>
          <div style="color: #666; font-size: 11px; margin-bottom: 6px;">📍 ${item.locationName} • ${item.district}</div>
          <div style="font-size: 11px; color: #444; margin-bottom: 8px; line-height: 1.3;">${item.description.slice(0, 90)}...</div>
          <button id="popup-btn-${item.id}" style="width: 100%; padding: 5px 8px; font-size: 11px; font-weight: 700; background: #141414; color: #ffffff; border: none; border-radius: 8px; cursor: pointer;">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        className: 'c2c-custom-popup',
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectItem(item);
          };
        }
      });

      marker.on('click', () => {
        onSelectItem(item);
      });

      layer.addLayer(marker);
    });
  }, [items, selectedItem]);

  // Render User Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    const userLayer = userMarkerLayerRef.current;
    if (!map || !userLayer) return;

    userLayer.clearLayers();

    if (userLocation) {
      const userHtml = `
        <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: #2563EB; opacity: 0.25; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 16px; height: 16px; border-radius: 9999px; background: #2563EB; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(37,99,235,0.6);"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userHtml,
        className: 'c2c-user-location-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker(userLocation, {
        icon: userIcon,
        zIndexOffset: 2000,
      }).bindTooltip('📍 You are here', { permanent: true, direction: 'top', offset: [0, -10] });

      userLayer.addLayer(userMarker);

      // Accuracy circle
      const accuracyCircle = L.circle(userLocation, {
        radius: 1200,
        color: '#2563EB',
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        weight: 1.5,
      });
      userLayer.addLayer(accuracyCircle);
    }
  }, [userLocation]);

  // Handle Resize smoothly
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[450px]">
      <div ref={containerRef} className="w-full h-full z-0 outline-none" />
      <style>{`
        .c2c-custom-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0,0,0,0.08);
          padding: 6px;
        }
        .c2c-custom-popup .leaflet-popup-tip {
          background: #ffffff;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
