# Background Schema & Data Models
## Project: GeoPulse AI - Data Contracts, Entity Schemas & Storage Specifications

---

## 1. Schema Definitions (TypeScript / JSON-Schema)

### 1.1 PinnedLocation Entity
Represents any saved or active geographic marker on the interactive map.

```typescript
export interface PinnedLocation {
  id: string;                    // UUID v4
  title: string;                 // Display label (e.g. "Work HQ")
  address: string;               // Normalized street address
  lat: number;                   // Latitude (-90 to +90)
  lng: number;                   // Longitude (-180 to +180)
  category: 'home' | 'work' | 'meeting' | 'transit' | 'favorite' | 'custom';
  notes?: string;                // User custom memo
  createdAt: number;             // Epoch millisecond timestamp
  updatedAt: number;
  isOfflineCached: boolean;      // Available offline in IndexedDB
}
```

### 1.2 SavedRoute Entity
Represents computed multi-modal travel routes between origin and destination.

```typescript
export interface RouteWaypoint {
  lat: number;
  lng: number;
  instruction: string;           // e.g. "Turn right onto Market St"
  distanceMeters: number;
  durationSeconds: number;
}

export interface SavedRoute {
  id: string;
  name: string;                  // e.g. "Morning Commute via Caltrain"
  origin: PinnedLocation;
  destination: PinnedLocation;
  mode: 'driving' | 'transit' | 'bicycling' | 'walking';
  distanceKm: number;
  estimatedDurationMins: number;
  elevationGainMeters: number;
  waypoints: RouteWaypoint[];
  polylineCoordinates: [number, number][]; // LatLng array for Leaflet polyline
  trafficMultiplier: number;     // 1.0 = clear, 1.3 = moderate, 1.7 = heavy
  isActiveAlertRoute: boolean;   // Monitored for proactive departure alerts
  cachedOfflineAt: number;
}
```

### 1.3 CalendarAppointment Entity
Ingested from Google Calendar to calculate timely departure buffers.

```typescript
export interface CalendarAppointment {
  id: string;
  title: string;                 // e.g. "Q4 Product Strategy Review"
  locationName: string;          // e.g. "Salesforce Tower, SF"
  destinationLat: number;
  destinationLng: number;
  startTime: string;             // ISO-8601 string
  endTime: string;
  meetingUrl?: string;           // Google Meet link
  travelDurationMins: number;    // Computed against user current location
  recommendedDepartureTime: string; // ISO-8601 computed departure time
  alarmFired: boolean;
  status: 'upcoming' | 'depart_now' | 'in_transit' | 'arrived';
}
```

### 1.4 CommuteAlertRule Entity
Defines personalized user notification thresholds configured in Settings.

```typescript
export interface CommuteAlertRule {
  id: string;
  name: string;                  // e.g. "Morning Commute Warning"
  routeId: string;
  enabled: boolean;
  daysOfWeek: number[];          // [1, 2, 3, 4, 5] = Mon-Fri
  targetArrivalTime: string;     // "09:00"
  leadNoticeMinutes: number;     // e.g. 15, 30
  delaySensitivityThreshold: number; // Alert if delay > 5 minutes
  weatherAlertsEnabled: boolean;
  transitDisruptionEnabled: boolean;
  deliveryChannel: 'push' | 'in_app' | 'both';
}
```

### 1.5 PushNotificationRecord Entity
Logs outbound and queued alerts for user and administrative tracking.

```typescript
export interface PushNotificationRecord {
  id: string;
  userId: string;
  title: string;
  body: string;
  scheduledFor: number;
  deliveredAt?: number;
  openedAt?: number;
  category: 'commute_departure' | 'traffic_delay' | 'calendar_meeting' | 'weekly_digest';
  actionUrl: string;
  status: 'queued' | 'delivered' | 'opened' | 'dismissed';
}
```

### 1.6 UserPreferences & GDPR Profile
Stores privacy settings, biometric flags, and accessibility tokens.

```typescript
export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  highContrast: boolean;
  fontSizeScale: number;         // 1.0 to 1.5
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'sw';
  biometricLockEnabled: boolean; // TouchID / FaceID requirement
  offlineSyncEnabled: boolean;
  telemetryConsent: boolean;     // GDPR opt-in
  cookieConsentGiven: boolean;
  lastSyncTimestamp: number;
}
```

---

## 2. Storage Mapping & Indexing

- **IndexedDB Database**: `GeoPulseStorage`
  - Object Store `pinned_locations`: Key `id`, index on `category`, `updatedAt`.
  - Object Store `saved_routes`: Key `id`, index on `mode`, `isActiveAlertRoute`.
  - Object Store `calendar_events`: Key `id`, index on `startTime`.
  - Object Store `notifications`: Key `id`, index on `scheduledFor`, `status`.
- **LocalStorage**:
  - Key `geopulse_prefs`: Serialized `UserPreferences`.
  - Key `geopulse_biometric_credential`: Enrolled public credential ID (WebAuthn).
