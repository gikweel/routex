import React, { useState } from 'react';
import { Share2, Check, Car, Train, Bike, Footprints } from 'lucide-react';
import { PinnedLocation, SavedRoute, TransitMode, RouteStep } from '../types';

interface RoutePlannerProps {
  pins: PinnedLocation[];
  activeRoute: SavedRoute | null;
  userLocation: { lat: number; lng: number };
  onSelectRoute: (route: SavedRoute) => void;
  onSaveRoute: (route: SavedRoute) => void;
  onClearRoute: () => void;
  t: (key: string) => string;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  pins,
  activeRoute,
  userLocation,
  onSelectRoute,
  onSaveRoute,
  onClearRoute,
  t,
}) => {
  const [selectedMode, setSelectedMode] = useState<TransitMode>('transit');
  const [originId, setOriginId] = useState<string>('curr');
  const [destId, setDestId] = useState<string>(pins[0]?.id || 'custom');
  const [customDestText, setCustomDestText] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleComputeRoute = () => {
    let origin: PinnedLocation;
    if (originId === 'curr') {
      origin = {
        id: 'curr',
        title: 'Current Location',
        address: `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
        lat: userLocation.lat,
        lng: userLocation.lng,
        category: 'custom',
        createdAt: Date.now(),
      };
    } else {
      origin = pins.find((p) => p.id === originId) || {
        id: 'curr',
        title: 'Current Location',
        address: `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
        lat: userLocation.lat,
        lng: userLocation.lng,
        category: 'custom',
        createdAt: Date.now(),
      };
    }

    let destination: PinnedLocation | undefined;
    if (destId === 'custom') {
      if (!customDestText.trim()) return;
      // Synthesize destination slightly offset from origin for direction calculation
      destination = {
        id: 'custom-' + Date.now(),
        title: customDestText.trim(),
        address: customDestText.trim(),
        lat: userLocation.lat + 0.02,
        lng: userLocation.lng + 0.02,
        category: 'custom',
        createdAt: Date.now(),
      };
    } else {
      destination = pins.find((p) => p.id === destId);
    }

    if (!destination) return;

    const latDiff = destination.lat - origin.lat;
    const lngDiff = destination.lng - origin.lng;
    const approxDistKm = Math.max(0.8, Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111);

    let speedKmh = 35;
    if (selectedMode === 'driving') speedKmh = 45;
    if (selectedMode === 'bicycling') speedKmh = 18;
    if (selectedMode === 'walking') speedKmh = 5;

    const durationMins = Math.max(2, Math.round((approxDistKm / speedKmh) * 60));

    const coords: [number, number][] = [
      [origin.lat, origin.lng],
      [origin.lat + latDiff * 0.35, origin.lng + lngDiff * 0.2],
      [origin.lat + latDiff * 0.7, origin.lng + lngDiff * 0.65],
      [destination.lat, destination.lng],
    ];

    const steps: RouteStep[] = [
      {
        instruction: `Head from ${origin.title}`,
        distance: `${(approxDistKm * 0.25).toFixed(1)} km`,
        duration: `${Math.round(durationMins * 0.25)} min`,
      },
      {
        instruction: `Follow ${selectedMode} corridor toward destination`,
        distance: `${(approxDistKm * 0.5).toFixed(1)} km`,
        duration: `${Math.round(durationMins * 0.5)} min`,
      },
      {
        instruction: `Arrive at ${destination.title}`,
        distance: `${(approxDistKm * 0.25).toFixed(1)} km`,
        duration: `${Math.round(durationMins * 0.25)} min`,
      },
    ];

    const newRoute: SavedRoute = {
      id: 'route-' + Date.now(),
      name: `${origin.title} to ${destination.title}`,
      origin,
      destination,
      mode: selectedMode,
      distanceKm: parseFloat(approxDistKm.toFixed(1)),
      estimatedDurationMins: durationMins,
      elevationGainMeters: Math.round(approxDistKm * 3),
      steps,
      polylineCoordinates: coords,
      trafficMultiplier: 1.0,
      isActiveAlertRoute: true,
      createdAt: Date.now(),
    };

    onSelectRoute(newRoute);
  };

  const handleShareRoute = async () => {
    if (!activeRoute) return;
    const shareUrl = `${window.location.origin}/?origin=${activeRoute.origin.lat},${activeRoute.origin.lng}&dest=${activeRoute.destination.lat},${activeRoute.destination.lng}&mode=${activeRoute.mode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: activeRoute.name,
          text: `Route from ${activeRoute.origin.title} to ${activeRoute.destination.title} (${activeRoute.estimatedDurationMins} min)`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-neutral-200">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <h3 className="font-semibold text-sm text-white">{t('map.planRoute')}</h3>
        {activeRoute && (
          <button
            onClick={onClearRoute}
            className="text-xs text-neutral-400 hover:text-white"
          >
            {t('map.clearRoute')}
          </button>
        )}
      </div>

      {/* Mode Picker */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-900 rounded border border-neutral-800">
        {[
          { mode: 'transit' as TransitMode, label: 'Transit', icon: Train },
          { mode: 'driving' as TransitMode, label: 'Drive', icon: Car },
          { mode: 'bicycling' as TransitMode, label: 'Bike', icon: Bike },
          { mode: 'walking' as TransitMode, label: 'Walk', icon: Footprints },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setSelectedMode(item.mode)}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded transition-colors ${
                isSelected
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Origin & Destination Selectors */}
      <div className="flex flex-col gap-2.5">
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Origin</label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
          >
            <option value="curr">Current Location</option>
            {pins.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-neutral-400 mb-1">Destination</label>
          {pins.length > 0 ? (
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
            >
              {pins.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
              <option value="custom">Type a custom address...</option>
            </select>
          ) : null}

          {(pins.length === 0 || destId === 'custom') && (
            <input
              type="text"
              placeholder="Enter destination address or landmark..."
              value={customDestText}
              onChange={(e) => {
                setCustomDestText(e.target.value);
                setDestId('custom');
              }}
              className="w-full mt-1.5 bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
            />
          )}
        </div>

        <button
          onClick={handleComputeRoute}
          disabled={destId === 'custom' && !customDestText.trim() && pins.length === 0}
          className="mt-1 w-full py-2 px-3 rounded bg-white hover:bg-neutral-100 disabled:opacity-50 text-neutral-950 font-medium text-xs transition-colors"
        >
          Calculate Directions
        </button>
      </div>

      {/* Active Route Details */}
      {activeRoute && (
        <div className="mt-2 p-3.5 rounded bg-neutral-900 border border-neutral-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-white truncate max-w-[200px]">
              {activeRoute.name}
            </span>
            <button
              onClick={handleShareRoute}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
              title="Share this route"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 py-2 border-y border-neutral-800 font-mono text-center text-xs">
            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Estimated Time</div>
              <div className="font-bold text-white tabular-nums">{activeRoute.estimatedDurationMins} min</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Distance</div>
              <div className="font-bold text-neutral-300 tabular-nums">{activeRoute.distanceKm} km</div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {activeRoute.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs py-1 border-b border-neutral-800/50 last:border-0">
                <span className="text-neutral-500 font-mono text-[10px] w-4">{idx + 1}.</span>
                <div className="flex-1">
                  <p className="text-neutral-300">{step.instruction}</p>
                  <span className="text-[10px] font-mono text-neutral-500">{step.distance} · {step.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSaveRoute(activeRoute)}
            className="w-full py-1.5 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
          >
            Save Route to List
          </button>
        </div>
      )}
    </div>
  );
};
