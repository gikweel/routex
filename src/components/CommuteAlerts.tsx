import React, { useState } from 'react';
import { Plus, Trash2, Bell, Clock, Calendar } from 'lucide-react';
import { CalendarAppointment, CommuteAlertRule, SavedRoute } from '../types';
import { triggerPushAlert, requestNotificationPermission } from '../services/notificationService';

interface CommuteAlertsProps {
  savedRoutes: SavedRoute[];
  alertRules: CommuteAlertRule[];
  calendarEvents: CalendarAppointment[];
  onAddEvent: (event: CalendarAppointment) => void;
  onDeleteEvent: (eventId: string) => void;
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: CommuteAlertRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onSelectRoute: (route: SavedRoute) => void;
  t: (key: string) => any;
}

export const CommuteAlerts: React.FC<CommuteAlertsProps> = ({
  savedRoutes,
  alertRules,
  calendarEvents,
  onAddEvent,
  onDeleteEvent,
  onToggleRule,
  onAddRule,
  onDeleteRule,
  onSelectRoute,
  t,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // Appointment Form
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newBuffer, setNewBuffer] = useState(10);

  // Alert Rule Form
  const [ruleName, setRuleName] = useState('');
  const [ruleTargetTime, setRuleTargetTime] = useState('08:30');
  const [ruleLeadTime, setRuleLeadTime] = useState(15);

  const [testSent, setTestSent] = useState(false);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim() || !newTime) return;

    const travelDuration = 20;
    const scheduledDate = new Date(newTime);
    const departureDate = new Date(scheduledDate.getTime() - (travelDuration + newBuffer) * 60000);

    const event: CalendarAppointment = {
      id: 'cal-' + Date.now(),
      title: newTitle.trim(),
      locationName: newLocation.trim(),
      destinationLat: 37.7897,
      destinationLng: -122.3972,
      startTime: scheduledDate.toISOString(),
      endTime: new Date(scheduledDate.getTime() + 3600000).toISOString(),
      travelDurationMins: travelDuration,
      bufferMins: newBuffer,
      recommendedDepartureTime: departureDate.toISOString(),
      createdAt: Date.now(),
    };

    onAddEvent(event);
    setNewTitle('');
    setNewLocation('');
    setNewTime('');
    setShowAddModal(false);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const newRule: CommuteAlertRule = {
      id: 'rule-' + Date.now(),
      name: ruleName.trim(),
      enabled: true,
      targetArrivalTime: ruleTargetTime,
      leadNoticeMinutes: ruleLeadTime,
      weatherAlertsEnabled: true,
      transitDisruptionEnabled: true,
    };

    onAddRule(newRule);
    setRuleName('');
    setShowAddRuleModal(false);
  };

  const handleTestAlert = async () => {
    await requestNotificationPermission();
    triggerPushAlert(
      'Departure Notification Test',
      'This is a sample departure alarm. GeoPulse alerts trigger prior to scheduled meetings.',
      'departure'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 text-neutral-200 max-w-4xl mx-auto w-full">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white">{t('commute.title')}</h2>
          <p className="text-xs text-neutral-400 mt-0.5">{t('commute.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="py-1.5 px-3 rounded bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('commute.addEvent')}</span>
          </button>

          <button
            onClick={handleTestAlert}
            className="py-1.5 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{testSent ? 'Sent' : t('commute.testPushAlert')}</span>
          </button>
        </div>
      </div>

      {/* Appointments List (Real User Data Only) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          {t('commute.calendarEvents')} ({calendarEvents.length})
        </h3>

        {calendarEvents.length === 0 ? (
          <div className="p-6 rounded bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center justify-center gap-2">
            <Calendar className="w-6 h-6 text-neutral-500" />
            <p className="text-xs text-neutral-400">No scheduled appointments found.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-white underline hover:no-underline font-medium"
            >
              Add your first appointment
            </button>
          </div>
        ) : (
          calendarEvents.map((evt) => {
            const startDate = new Date(evt.startTime);
            const departureDate = new Date(evt.recommendedDepartureTime);

            return (
              <div
                key={evt.id}
                className="p-3.5 rounded bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-medium text-white">{evt.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span>{evt.locationName}</span>
                    <span>·</span>
                    <span>Starts {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Leave At</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteEvent(evt.id)}
                    className="p-1.5 rounded text-neutral-500 hover:text-rose-400 transition-colors"
                    title="Remove appointment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Rules Configuration */}
      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            {t('commute.alertRules')} ({alertRules.length})
          </h3>
          <button
            onClick={() => setShowAddRuleModal(true)}
            className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Alert Rule</span>
          </button>
        </div>

        {alertRules.length === 0 ? (
          <div className="p-5 rounded bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center justify-center gap-2">
            <Bell className="w-5 h-5 text-neutral-500" />
            <p className="text-xs text-neutral-400">No active alert rules configured.</p>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="text-xs text-white underline hover:no-underline font-medium"
            >
              Create a custom alert rule
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {alertRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-neutral-200">{rule.name}</span>
                  <span className="text-neutral-500 ml-2 font-mono">
                    Target: {rule.targetArrivalTime} · Notice: {rule.leadNoticeMinutes}m
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => onToggleRule(rule.id)}
                    className="rounded accent-white cursor-pointer"
                  />
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded p-5 flex flex-col gap-4 text-neutral-200">
            <h3 className="font-semibold text-sm text-white">Add Scheduled Appointment</h3>

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Meeting / Trip Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Sync, Flight Departure"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Destination Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Ferry Building, San Francisco"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Event Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Buffer Time</label>
                  <select
                    value={newBuffer}
                    onChange={(e) => setNewBuffer(parseInt(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-1.5 px-3 rounded text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-3 rounded bg-white hover:bg-neutral-100 text-neutral-950 font-medium text-xs"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Alert Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded p-5 flex flex-col gap-4 text-neutral-200">
            <h3 className="font-semibold text-sm text-white">Create Custom Commute Alert Rule</h3>

            <form onSubmit={handleCreateRule} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Work Departure"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Target Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={ruleTargetTime}
                    onChange={(e) => setRuleTargetTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Advance Notice</label>
                  <select
                    value={ruleLeadTime}
                    onChange={(e) => setRuleLeadTime(parseInt(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                  >
                    <option value={10}>10 min prior</option>
                    <option value={15}>15 min prior</option>
                    <option value={20}>20 min prior</option>
                    <option value={30}>30 min prior</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="py-1.5 px-3 rounded text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-3 rounded bg-white hover:bg-neutral-100 text-neutral-950 font-medium text-xs"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
