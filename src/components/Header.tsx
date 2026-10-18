import React from 'react';
import { Moon, Sun, Lock, Wifi, WifiOff } from 'lucide-react';
import { LanguageCode } from '../services/i18n';
import { UserPreferences } from '../types';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onTriggerLock: () => void;
  t: (key: string) => any;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  onTriggerLock,
  t,
}) => {
  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
    { code: 'sw', label: 'Kiswahili' },
  ];

  return (
    <header className="h-14 px-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between gap-8 z-20 shrink-0">
      {/* Zone 1: Brand Wordmark (Clean unboxed single-element) */}
      <div className="flex items-center gap-3">
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          GeoPulse
        </span>
        <span className="text-xs text-neutral-400 hidden sm:inline whitespace-nowrap">
          {t('tagline')}
        </span>
      </div>

      {/* Zone 2: Status & Mode indicator */}
      <div className="hidden md:flex items-center gap-4 text-xs font-mono text-neutral-400">
        <button
          onClick={() => onUpdatePreferences({ offlineSimulation: !preferences.offlineSimulation })}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border ${
            preferences.offlineSimulation
              ? 'bg-amber-950/60 text-amber-300 border-amber-800'
              : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:border-neutral-600'
          }`}
          title="Toggle offline mode for route testing"
        >
          {preferences.offlineSimulation ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Online</span>
            </>
          )}
        </button>
      </div>

      {/* Zone 3: Functional User Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <select
          value={preferences.language}
          onChange={(e) => onUpdatePreferences({ language: e.target.value as LanguageCode })}
          className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-neutral-500 cursor-pointer"
          aria-label="Interface Language"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => onUpdatePreferences({ highContrast: !preferences.highContrast })}
          className={`px-2 py-1 rounded border text-xs font-mono transition-colors ${
            preferences.highContrast
              ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
              : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
          }`}
          title="Toggle High Contrast Mode (WCAG 2.2 AA)"
        >
          A11y
        </button>

        <button
          onClick={() => onUpdatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
          className="p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {preferences.theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onTriggerLock}
          className="p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
          title="Lock Screen"
          aria-label="Lock Screen"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
