import React, { useState } from 'react';
import { Shield, Download, Trash2, Fingerprint } from 'lucide-react';
import { exportAllPersonalData, purgeAllUserData } from '../services/storage';
import { getBiometricStatus, enrollBiometrics, removeBiometricEnrollment } from '../services/webAuthnService';

interface SecurityCenterProps {
  biometricLockEnabled: boolean;
  onToggleBiometricLock: (enabled: boolean) => void;
  onPurgeComplete: () => void;
  t: (key: string) => any;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({
  biometricLockEnabled,
  onToggleBiometricLock,
  onPurgeComplete,
  t,
}) => {
  const [biometricStatus, setBiometricStatus] = useState(getBiometricStatus());
  const [confirmPurge, setConfirmPurge] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleToggleBiometrics = async () => {
    if (!biometricLockEnabled) {
      const res = await enrollBiometrics();
      if (res.success) {
        onToggleBiometricLock(true);
        setBiometricStatus(getBiometricStatus());
      }
    } else {
      removeBiometricEnrollment();
      onToggleBiometricLock(false);
      setBiometricStatus(getBiometricStatus());
    }
  };

  const handleExportData = () => {
    const jsonStr = exportAllPersonalData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geopulse-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleExecutePurge = () => {
    purgeAllUserData();
    setConfirmPurge(false);
    onPurgeComplete();
  };

  return (
    <div className="flex flex-col gap-6 p-6 text-neutral-200 max-w-4xl mx-auto w-full">
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="text-base font-semibold text-white">{t('security.title')}</h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Biometric access controls, local data management, and zero-telemetry options
        </p>
      </div>

      {/* Biometric Lock */}
      <div className="p-4 rounded bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Fingerprint className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium text-sm text-white">{t('security.biometricTitle')}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">{t('security.biometricDesc')}</p>
          </div>
        </div>

        <input
          type="checkbox"
          checked={biometricLockEnabled}
          onChange={handleToggleBiometrics}
          className="rounded accent-white cursor-pointer mt-1"
        />
      </div>

      {/* Data Export & Purge */}
      <div className="flex flex-col gap-3 pt-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          {t('security.gdprTitle')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <div className="p-4 rounded bg-neutral-900 border border-neutral-800 flex flex-col justify-between gap-3">
            <div>
              <h4 className="font-medium text-xs text-white">Export Stored Data</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Save a complete JSON archive of your saved routes, locations, alert rules, and activity logs.
              </p>
            </div>

            <button
              onClick={handleExportData}
              className="py-1.5 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors self-start"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportNotice ? 'Export Downloaded' : t('security.exportData')}</span>
            </button>
          </div>

          {/* Wipe Data */}
          <div className="p-4 rounded bg-neutral-900 border border-neutral-800 flex flex-col justify-between gap-3">
            <div>
              <h4 className="font-medium text-xs text-white">Erase Local Data</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Permanently delete all stored locations, routes, and preferences from this browser.
              </p>
            </div>

            <button
              onClick={() => setConfirmPurge(true)}
              className="py-1.5 px-3 rounded bg-neutral-800 hover:bg-rose-950/60 hover:text-rose-300 text-xs font-medium text-neutral-300 border border-neutral-700 hover:border-rose-800 flex items-center justify-center gap-1.5 transition-colors self-start"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('security.purgeData')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Purge Dialog */}
      {confirmPurge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded p-5 flex flex-col gap-4 text-neutral-200">
            <h3 className="font-semibold text-sm text-white">Confirm Local Data Reset</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This will clear all saved locations, routes, and settings from this browser. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setConfirmPurge(false)}
                className="py-1.5 px-3 rounded text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePurge}
                className="py-1.5 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
