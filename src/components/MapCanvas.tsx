import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PinnedLocation, SavedRoute } from '../types';

interface MapCanvasProps {
  pins: PinnedLocation[];
  activeRoute: SavedRoute | null;
  userLocation: { lat: number; lng: number };
  trafficHeatmapEnabled: boolean;
  theme: 'dark' | 'light';
  highContrast: boolean;
  onMapClick: (coords: { lat: number; lng: number }) => void;
  onPinSelect?: (pin: PinnedLocation) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  pins,
  activeRoute,
  userLocation,
  theme,
  highContrast,
  onMapClick,
  onPinSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const isDark = theme === 'dark' || highContrast;
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tiles;

    routeLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Style on Theme Change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const isDark = theme === 'dark' || highContrast;
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [theme, highContrast]);

  // Update Markers (User Location + Pinned Locations)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // 1. User Location Marker (Clean circular dot, no fake ping animation)
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `
        <div style="background-color: #2563eb; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindTooltip('Current Location', { direction: 'top', offset: [0, -6] })
      .addTo(markersLayerRef.current);

    // 2. Real Pinned Locations
    pins.forEach((pin) => {
      const pinIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div style="background-color: #171717; border: 1.5px solid #ffffff; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.4);">
            •
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon }).addTo(markersLayerRef.current!);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; color: #171717; padding: 4px;">
          <div style="font-weight: 600; margin-bottom: 2px;">${pin.title}</div>
          <div style="color: #737373; font-size: 11px;">${pin.address}</div>
          <div style="margin-top: 6px; font-size: 10px; color: #525252; text-transform: uppercase;">
            ${pin.category} · ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onPinSelect) onPinSelect(pin);
      });
    });
  }, [pins, userLocation, onPinSelect]);

  // Update Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    if (!activeRoute || !activeRoute.polylineCoordinates || activeRoute.polylineCoordinates.length === 0) {
      return;
    }

    const polyline = L.polyline(activeRoute.polylineCoordinates, {
      color: '#2563eb',
      weight: 4,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(routeLayerRef.current);

    const bounds = polyline.getBounds();
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  }, [activeRoute]);

  const handleCenterUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] flex-1 bg-neutral-950 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" tabIndex={0} aria-label="Interactive Navigation Map" />

      {/* Recenter Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleCenterUser}
          className="p-2 rounded bg-neutral-900 text-neutral-200 hover:text-white border border-neutral-700 shadow-md transition-colors"
          title="Recenter on current coordinates"
          aria-label="Recenter on current coordinates"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v3m0 14v3m10-10h-3M5 12H2"></path>
          </svg>
        </button>
      </div>

      {/* Coordinate Telemetry */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="px-2.5 py-1 rounded bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-400">
          {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};
