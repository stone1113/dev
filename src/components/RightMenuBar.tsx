import React from 'react';
import { Sparkles, Globe, Languages, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RightPanelType = 'ai-profile' | 'proxy' | 'translation' | 'contact' | null;

interface RightMenuBarProps {
  activePanel: RightPanelType;
  onPanelChange: (panel: RightPanelType) => void;
}

export const RightMenuBar: React.FC<RightMenuBarProps> = ({ activePanel, onPanelChange }) => {
  const menuItems = [
    {
      id: 'ai-profile' as RightPanelType,
      icon: Sparkles,
      label: 'AI画像',
      activeColor: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      hoverColor: 'hover:bg-purple-50 hover:text-purple-600',
      iconActiveColor: 'text-white',
      iconColor: 'text-purple-500'
    },
    {
      id: 'proxy' as RightPanelType,
      icon: Globe,
      label: '代理IP',
      activeColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      hoverColor: 'hover:bg-emerald-50 hover:text-emerald-600',
      iconActiveColor: 'text-white',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'translation' as RightPanelType,
      icon: Languages,
      label: '翻译',
      activeColor: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      hoverColor: 'hover:bg-blue-50 hover:text-blue-600',
      iconActiveColor: 'text-white',
      iconColor: 'text-blue-500'
    },
    {
      id: 'contact' as RightPanelType,
      icon: UserCircle,
      label: '联系人',
      activeColor: 'bg-gradient-to-br from-orange-500 to-amber-600',
      hoverColor: 'hover:bg-orange-50 hover:text-orange-600',
      iconActiveColor: 'text-white',
      iconColor: 'text-orange-500'
    },
  ];

  const handleClick = (panelId: RightPanelType) => {
    if (activePanel === panelId) {
      onPanelChange(null);
    } else {
      onPanelChange(panelId);
    }
  };

  return (
    <div className="w-14 bg-white/80 backdrop-blur-sm border-l border-gray-100 flex flex-col items-center py-4 gap-2">
      {menuItems.map((item) => {
        const isActive = activePanel === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200",
              isActive
                ? `${item.activeColor} shadow-lg scale-105`
                : `bg-gray-50 ${item.hoverColor}`
            )}
            title={item.label}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              isActive ? item.iconActiveColor : item.iconColor
            )} />
            <span className={cn(
              "text-[9px] font-medium leading-none",
              isActive ? "text-white" : "text-gray-500"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
