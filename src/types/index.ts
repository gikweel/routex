export type TransitMode = 'driving' | 'transit' | 'bicycling' | 'walking';

export interface PinnedLocation {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  category: 'work' | 'home' | 'meeting' | 'transit' | 'custom';
  createdAt: number;
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
}

export interface SavedRoute {
  id: string;
  name: string;
  origin: PinnedLocation;
  destination: PinnedLocation;
  mode: TransitMode;
  distanceKm: number;
  estimatedDurationMins: number;
  elevationGainMeters: number;
  steps: RouteStep[];
  polylineCoordinates: [number, number][];
  trafficMultiplier: number;
  isActiveAlertRoute: boolean;
  createdAt: number;
}

export interface CalendarAppointment {
  id: string;
  title: string;
  locationName: string;
  destinationLat: number;
  destinationLng: number;
  startTime: string; // ISO string
  endTime: string;
  travelDurationMins: number;
  bufferMins: number;
  recommendedDepartureTime: string; // ISO string
  createdAt: number;
}

export interface CommuteAlertRule {
  id: string;
  name: string;
  enabled: boolean;
  targetArrivalTime: string; // "08:30"
  leadNoticeMinutes: number; // 15
  weatherAlertsEnabled: boolean;
  transitDisruptionEnabled: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  groundingChunks?: GroundingChunk[];
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  highContrast: boolean;
  fontSizeScale: number;
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'sw';
  biometricLockEnabled: boolean;
  offlineSimulation: boolean;
  telemetryConsent: boolean;
  trafficHeatmapEnabled: boolean;
  pushNotificationsEnabled: boolean;
}

export interface AppActivityLog {
  id: string;
  type: 'route_calculated' | 'pin_added' | 'alert_triggered' | 'calendar_synced';
  description: string;
  timestamp: number;
}

export type ActiveTab = 'map' | 'commute' | 'chat' | 'analytics' | 'security' | 'docs';
