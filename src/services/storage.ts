import {
  PinnedLocation,
  SavedRoute,
  CalendarAppointment,
  CommuteAlertRule,
  UserPreferences,
  AppActivityLog,
} from '../types';

const STORAGE_KEYS = {
  PREFS: 'geopulse_preferences_v3',
  PINS: 'geopulse_pins_v3',
  ROUTES: 'geopulse_routes_v3',
  CALENDAR: 'geopulse_calendar_v3',
  ALERT_RULES: 'geopulse_alert_rules_v3',
  ACTIVITY_LOG: 'geopulse_activity_log_v3',
  BIOMETRIC_ENROLLED: 'geopulse_biometric_enrolled_v3',
};

// Clean legacy keys from earlier versions
export function cleanLegacyStorage(): void {
  try {
    const legacyKeys = [
      'geopulse_preferences_v1',
      'geopulse_pins_v1',
      'geopulse_routes_v1',
      'geopulse_calendar_v1',
      'geopulse_alert_rules_v1',
      'geopulse_preferences_v2',
      'geopulse_pins_v2',
      'geopulse_routes_v2',
      'geopulse_calendar_v2',
      'geopulse_alert_rules_v2',
    ];
    legacyKeys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore storage errors
  }
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  highContrast: false,
  fontSizeScale: 1.0,
  language: 'en',
  biometricLockEnabled: false,
  offlineSimulation: false,
  telemetryConsent: true,
  trafficHeatmapEnabled: false,
  pushNotificationsEnabled: true,
};

// Zero default pins - only locations created by the user will exist
export const INITIAL_PINS: PinnedLocation[] = [];

// Zero default routes - only routes created by the user will exist
export const INITIAL_ROUTES: SavedRoute[] = [];

// Zero default alert rules - only rules created by the user will exist
export const INITIAL_ALERT_RULES: CommuteAlertRule[] = [];

export function loadPreferences(): UserPreferences {
  try {
    cleanLegacyStorage();
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
}

export function loadPins(): PinnedLocation[] {
  try {
    cleanLegacyStorage();
    const raw = localStorage.getItem(STORAGE_KEYS.PINS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePins(pins: PinnedLocation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
  } catch (e) {
    console.error('Failed to save pins:', e);
  }
}

export function loadRoutes(): SavedRoute[] {
  try {
    cleanLegacyStorage();
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRoutes(routes: SavedRoute[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  } catch (e) {
    console.error('Failed to save routes:', e);
  }
}

export function loadCalendarEvents(): CalendarAppointment[] {
  try {
    cleanLegacyStorage();
    const raw = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCalendarEvents(events: CalendarAppointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save calendar events:', e);
  }
}

export function loadAlertRules(): CommuteAlertRule[] {
  try {
    cleanLegacyStorage();
    const raw = localStorage.getItem(STORAGE_KEYS.ALERT_RULES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAlertRules(rules: CommuteAlertRule[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERT_RULES, JSON.stringify(rules));
  } catch (e) {
    console.error('Failed to save alert rules:', e);
  }
}

export function loadActivityLogs(): AppActivityLog[] {
  try {
    cleanLegacyStorage();
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logActivity(type: AppActivityLog['type'], description: string): void {
  try {
    const existing = loadActivityLogs();
    const entry: AppActivityLog = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      description,
      timestamp: Date.now(),
    };
    const updated = [entry, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

export function exportAllPersonalData(): string {
  const exportPayload = {
    exportVersion: '3.0.0',
    exportedAt: new Date().toISOString(),
    userPreferences: loadPreferences(),
    pinnedLocations: loadPins(),
    savedRoutes: loadRoutes(),
    calendarEvents: loadCalendarEvents(),
    alertRules: loadAlertRules(),
    activityLog: loadActivityLogs(),
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function purgeAllUserData(): void {
  try {
    cleanLegacyStorage();
    localStorage.removeItem(STORAGE_KEYS.PREFS);
    localStorage.removeItem(STORAGE_KEYS.PINS);
    localStorage.removeItem(STORAGE_KEYS.ROUTES);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR);
    localStorage.removeItem(STORAGE_KEYS.ALERT_RULES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOG);
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENROLLED);
  } catch (e) {
    console.error('Purge data failed:', e);
  }
}
