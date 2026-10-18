import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { InAppAlert } from '../services/notificationService';

export const InAppNotificationBanner: React.FC = () => {
  const [currentAlert, setCurrentAlert] = useState<InAppAlert | null>(null);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvt = e as CustomEvent<InAppAlert>;
      if (customEvt.detail) {
        setCurrentAlert(customEvt.detail);
      }
    };

    window.addEventListener('geopulse-notification', handleNotification);
    return () => {
      window.removeEventListener('geopulse-notification', handleNotification);
    };
  }, []);

  useEffect(() => {
    if (!currentAlert) return;
    const timer = setTimeout(() => {
      setCurrentAlert(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentAlert]);

  if (!currentAlert) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%]">
      <div className="p-3 rounded bg-neutral-900 border border-neutral-700 shadow-lg flex items-start gap-3 text-neutral-200">
        <Bell className="w-4 h-4 text-white mt-0.5 shrink-0" />

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-xs text-white">{currentAlert.title}</h4>
          <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{currentAlert.body}</p>
        </div>

        <button
          onClick={() => setCurrentAlert(null)}
          className="text-neutral-500 hover:text-white p-0.5"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
