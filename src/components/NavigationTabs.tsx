import React from 'react';
import { Map, Clock, Search, BarChart2, Shield, FileText } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedRoutesCount: number;
  calendarAlertsCount: number;
  t: (key: string) => any;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  savedRoutesCount,
  calendarAlertsCount,
  t,
}) => {
  const tabs = [
    { id: 'map' as ActiveTab, label: t('tabs.map'), icon: Map },
    { id: 'commute' as ActiveTab, label: t('tabs.commute'), icon: Clock, count: calendarAlertsCount },
    { id: 'chat' as ActiveTab, label: t('tabs.chat'), icon: Search },
    { id: 'analytics' as ActiveTab, label: t('tabs.analytics'), icon: BarChart2 },
    { id: 'security' as ActiveTab, label: t('tabs.security'), icon: Shield },
    { id: 'docs' as ActiveTab, label: t('tabs.docs'), icon: FileText },
  ];

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 px-6 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              isActive
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="font-mono text-[11px] text-neutral-400">({tab.count})</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
