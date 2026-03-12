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
      activeColor: 'bg-[#FF6B35]',
      hoverColor: 'hover:bg-[#F2F2F2] hover:text-[#333]',
      iconActiveColor: 'text-white',
      iconColor: 'text-[#999]'
    },
    {
      id: 'proxy' as RightPanelType,
      icon: Globe,
      label: '代理IP',
      activeColor: 'bg-[#FF6B35]',
      hoverColor: 'hover:bg-[#F2F2F2] hover:text-[#333]',
      iconActiveColor: 'text-white',
      iconColor: 'text-[#999]'
    },
    {
      id: 'translation' as RightPanelType,
      icon: Languages,
      label: '翻译',
      activeColor: 'bg-[#FF6B35]',
      hoverColor: 'hover:bg-[#F2F2F2] hover:text-[#333]',
      iconActiveColor: 'text-white',
      iconColor: 'text-[#999]'
    },
    {
      id: 'contact' as RightPanelType,
      icon: UserCircle,
      label: '联系人',
      activeColor: 'bg-[#FF6B35]',
      hoverColor: 'hover:bg-[#F2F2F2] hover:text-[#333]',
      iconActiveColor: 'text-white',
      iconColor: 'text-[#999]'
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
    <div className="w-14 bg-white/80 backdrop-blur-sm border-l border-[#E8E8E8] flex flex-col items-center py-4 gap-2">
      {menuItems.map((item) => {
        const isActive = activePanel === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200",
              isActive
                ? `${item.activeColor} shadow-sm`
                : `bg-[#F7F8FA] ${item.hoverColor}`
            )}
            title={item.label}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              isActive ? item.iconActiveColor : item.iconColor
            )} />
            <span className={cn(
              "text-[9px] font-medium leading-none",
              isActive ? "text-white" : "text-[#999]"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
