/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PinnedLocation,
  SavedRoute,
  CalendarAppointment,
  CommuteAlertRule,
  UserPreferences,
  ActiveTab,
  AppActivityLog,
} from './types';
import {
  loadPreferences,
  savePreferences,
  loadPins,
  savePins,
  loadRoutes,
  saveRoutes,
  loadCalendarEvents,
  saveCalendarEvents,
  loadAlertRules,
  saveAlertRules,
  loadActivityLogs,
  logActivity,
} from './services/storage';
import { TRANSLATIONS } from './services/i18n';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { MapCanvas } from './components/MapCanvas';
import { RoutePlanner } from './components/RoutePlanner';
import { ChatDrawer } from './components/ChatDrawer';
import { CommuteAlerts } from './components/CommuteAlerts';
import { AdminDashboard } from './components/AdminDashboard';
import { SecurityCenter } from './components/SecurityCenter';
import { DocsViewer } from './components/DocsViewer';
import { PinModal } from './components/PinModal';
import { BiometricModal } from './components/BiometricModal';
import { InAppNotificationBanner } from './components/InAppNotificationBanner';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());
  const [pins, setPins] = useState<PinnedLocation[]>(() => loadPins());
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>(() => loadRoutes());
  const [calendarEvents, setCalendarEvents] = useState<CalendarAppointment[]>(() => loadCalendarEvents());
  const [alertRules, setAlertRules] = useState<CommuteAlertRule[]>(() => loadAlertRules());
  const [activityLogs, setActivityLogs] = useState<AppActivityLog[]>(() => loadActivityLogs());

  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [activeRoute, setActiveRoute] = useState<SavedRoute | null>(savedRoutes[0] || null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 });

  const [pinModalCoords, setPinModalCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Translation helper
  const t = (path: string): any => {
    const lang = preferences.language || 'en';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const parts = path.split('.');
    let curr: any = dict;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        return path;
      }
    }
    return curr;
  };

  // Browser Geolocation Detection
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...updates };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleSavePin = (newPin: PinnedLocation) => {
    const updated = [newPin, ...pins];
    setPins(updated);
    savePins(updated);
    logActivity('pin_added', `Pinned location "${newPin.title}"`);
    setActivityLogs(loadActivityLogs());
  };

  const handleSaveRoute = (newRoute: SavedRoute) => {
    const filtered = savedRoutes.filter((r) => r.id !== newRoute.id);
    const updated = [newRoute, ...filtered];
    setSavedRoutes(updated);
    saveRoutes(updated);
    logActivity('route_calculated', `Saved route "${newRoute.name}"`);
    setActivityLogs(loadActivityLogs());
  };

  const handleAddCalendarEvent = (event: CalendarAppointment) => {
    const updated = [event, ...calendarEvents];
    setCalendarEvents(updated);
    saveCalendarEvents(updated);
    logActivity('calendar_synced', `Added appointment "${event.title}"`);
    setActivityLogs(loadActivityLogs());
  };

  const handleDeleteCalendarEvent = (eventId: string) => {
    const updated = calendarEvents.filter((e) => e.id !== eventId);
    setCalendarEvents(updated);
    saveCalendarEvents(updated);
  };

  const handleToggleRule = (ruleId: string) => {
    const updated = alertRules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
    setAlertRules(updated);
    saveAlertRules(updated);
  };

  const handleAddRule = (newRule: CommuteAlertRule) => {
    const updated = [newRule, ...alertRules];
    setAlertRules(updated);
    saveAlertRules(updated);
    logActivity('alert_triggered', `Created alert rule "${newRule.name}"`);
    setActivityLogs(loadActivityLogs());
  };

  const handleDeleteRule = (ruleId: string) => {
    const updated = alertRules.filter((r) => r.id !== ruleId);
    setAlertRules(updated);
    saveAlertRules(updated);
  };

  const handlePurgeComplete = () => {
    setPins(loadPins());
    setSavedRoutes(loadRoutes());
    setCalendarEvents(loadCalendarEvents());
    setAlertRules(loadAlertRules());
    setActivityLogs(loadActivityLogs());
    setPreferences(loadPreferences());
    setActiveRoute(null);
  };

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setPinModalCoords(coords);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        preferences.highContrast
          ? 'bg-black text-yellow-300'
          : preferences.theme === 'dark'
          ? 'bg-neutral-950 text-neutral-100'
          : 'bg-white text-neutral-900'
      }`}
    >
      <InAppNotificationBanner />
      <BiometricModal isOpen={isLocked} onSuccess={() => setIsLocked(false)} />

      <PinModal
        coords={pinModalCoords}
        onSave={handleSavePin}
        onClose={() => setPinModalCoords(null)}
      />

      <Header
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onTriggerLock={() => setIsLocked(true)}
        t={t}
      />

      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedRoutesCount={savedRoutes.length}
        calendarAlertsCount={calendarEvents.length}
        t={t}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
            <div className="w-full md:w-80 bg-neutral-900 border-r border-neutral-800 z-10 flex flex-col overflow-y-auto shrink-0">
              <RoutePlanner
                pins={pins}
                activeRoute={activeRoute}
                userLocation={userLocation}
                onSelectRoute={(rt) => {
                  setActiveRoute(rt);
                  logActivity('route_calculated', `Calculated route from ${rt.origin.title} to ${rt.destination.title}`);
                  setActivityLogs(loadActivityLogs());
                }}
                onSaveRoute={handleSaveRoute}
                onClearRoute={() => setActiveRoute(null)}
                t={t}
              />

              <div className="p-4 border-t border-neutral-800 mt-auto bg-neutral-900 text-xs text-neutral-500">
                {t('map.clickToPinNotice')}
              </div>
            </div>

            <div className="flex-1 h-full min-h-[400px] relative">
              <MapCanvas
                pins={pins}
                activeRoute={activeRoute}
                userLocation={userLocation}
                trafficHeatmapEnabled={preferences.trafficHeatmapEnabled}
                theme={preferences.theme}
                highContrast={preferences.highContrast}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
        )}

        {activeTab === 'commute' && (
          <div className="flex-1 overflow-y-auto">
            <CommuteAlerts
              savedRoutes={savedRoutes}
              alertRules={alertRules}
              calendarEvents={calendarEvents}
              onAddEvent={handleAddCalendarEvent}
              onDeleteEvent={handleDeleteCalendarEvent}
              onToggleRule={handleToggleRule}
              onAddRule={handleAddRule}
              onDeleteRule={handleDeleteRule}
              onSelectRoute={(rt) => {
                setActiveRoute(rt);
                setActiveTab('map');
              }}
              t={t}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 flex overflow-hidden">
            <ChatDrawer
              userLocation={userLocation}
              onDropPin={handleSavePin}
              isOffline={preferences.offlineSimulation}
              t={t}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto">
            <AdminDashboard
              pins={pins}
              savedRoutes={savedRoutes}
              calendarEvents={calendarEvents}
              alertRules={alertRules}
              activityLogs={activityLogs}
              t={t}
            />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex-1 overflow-y-auto">
            <SecurityCenter
              biometricLockEnabled={preferences.biometricLockEnabled}
              onToggleBiometricLock={(enabled) => handleUpdatePreferences({ biometricLockEnabled: enabled })}
              onPurgeComplete={handlePurgeComplete}
              t={t}
            />
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="flex-1 overflow-y-auto">
            <DocsViewer />
          </div>
        )}
      </main>
    </div>
  );
}
