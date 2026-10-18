import React from 'react';
import { PinnedLocation, SavedRoute, CalendarAppointment, CommuteAlertRule, AppActivityLog } from '../types';

interface AdminDashboardProps {
  pins: PinnedLocation[];
  savedRoutes: SavedRoute[];
  calendarEvents: CalendarAppointment[];
  alertRules: CommuteAlertRule[];
  activityLogs: AppActivityLog[];
  t: (key: string) => any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  pins,
  savedRoutes,
  calendarEvents,
  alertRules,
  activityLogs,
  t,
}) => {
  const activeRulesCount = alertRules.filter((r) => r.enabled).length;

  return (
    <div className="flex flex-col gap-6 p-6 text-neutral-200 max-w-4xl mx-auto w-full">
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="text-base font-semibold text-white">{t('admin.title')}</h2>
        <p className="text-xs text-neutral-400 mt-0.5">{t('admin.subtitle')}</p>
      </div>

      {/* Real Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800">
          <span className="text-[11px] font-mono uppercase text-neutral-500 block">{t('admin.totalRoutes')}</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums mt-1 block">
            {savedRoutes.length}
          </span>
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800">
          <span className="text-[11px] font-mono uppercase text-neutral-500 block">{t('admin.totalPins')}</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums mt-1 block">
            {pins.length}
          </span>
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800">
          <span className="text-[11px] font-mono uppercase text-neutral-500 block">{t('admin.scheduledEvents')}</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums mt-1 block">
            {calendarEvents.length}
          </span>
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800">
          <span className="text-[11px] font-mono uppercase text-neutral-500 block">Active Alerts</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums mt-1 block">
            {activeRulesCount}
          </span>
        </div>
      </div>

      {/* Real Activity Audit Log */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          {t('admin.activityLog')}
        </h3>

        {activityLogs.length === 0 ? (
          <div className="p-4 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-500 text-center">
            No local actions recorded yet. Calculate a route, pin a location, or schedule an appointment to populate activity.
          </div>
        ) : (
          <div className="border border-neutral-800 rounded bg-neutral-900 divide-y divide-neutral-800">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3 text-xs flex items-center justify-between gap-3">
                <span className="text-neutral-300">{log.description}</span>
                <span className="font-mono text-[11px] text-neutral-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Locations Summary */}
      <div className="flex flex-col gap-3 pt-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Configured Locations
        </h3>

        {pins.length === 0 ? (
          <div className="p-3 text-xs text-neutral-500">No locations pinned.</div>
        ) : (
          <div className="border border-neutral-800 rounded bg-neutral-900 divide-y divide-neutral-800">
            {pins.map((pin) => (
              <div key={pin.id} className="p-3 text-xs flex items-center justify-between gap-3">
                <div>
                  <span className="font-medium text-white">{pin.title}</span>
                  <span className="text-neutral-400 ml-2">{pin.address}</span>
                </div>
                <span className="font-mono text-[11px] text-neutral-500 shrink-0">
                  {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
