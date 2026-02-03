import React from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import type { Platform } from '@/types';
import { 
  MessageCircle, 
  Send, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Mail, 
  Smartphone, 
  Music, 
  Twitter, 
  ShoppingBag,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag,
};

interface PlatformSwitcherProps {
  variant?: 'sidebar' | 'horizontal' | 'dropdown';
  showAll?: boolean;
}

export const PlatformSwitcher: React.FC<PlatformSwitcherProps> = ({ 
  variant = 'sidebar',
  showAll = true 
}) => {
  const { selectedPlatform, setSelectedPlatform, platforms } = useStore();
  
  const enabledPlatforms = platformConfigs.filter(p => platforms.includes(p.id));
  
  const handlePlatformClick = (platformId: Platform | 'all') => {
    setSelectedPlatform(platformId);
  };
  
  if (variant === 'horizontal') {
    return (
      <div className="flex items-center gap-2 p-2 bg-white rounded-xl shadow-sm">
        {showAll && (
          <button
            onClick={() => handlePlatformClick('all')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
              selectedPlatform === 'all'
                ? "bg-[#0059F8] text-white shadow-md"
                : "hover:bg-gray-100 text-gray-600"
            )}
          >
            <span className="text-sm font-medium">全部</span>
          </button>
        )}
        
        {enabledPlatforms.map((platform) => {
          const Icon = iconMap[platform.icon] || MessageCircle;
          const isActive = selectedPlatform === platform.id;
          
          return (
            <button
              key={platform.id}
              onClick={() => handlePlatformClick(platform.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                isActive
                  ? "text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-600"
              )}
              style={{
                backgroundColor: isActive ? platform.color : undefined,
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">{platform.name}</span>
            </button>
          );
        })}
      </div>
    );
  }
  
  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-[#0059F8] transition-colors">
          {selectedPlatform === 'all' ? (
            <>
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm">全部平台</span>
            </>
          ) : (
            (() => {
              const platform = platformConfigs.find(p => p.id === selectedPlatform);
              const Icon = platform ? iconMap[platform.icon] : MessageCircle;
              return (
                <>
                  <Icon className="w-4 h-4" style={{ color: platform?.color }} />
                  <span className="text-sm">{platform?.name}</span>
                </>
              );
            })()
          )}
        </button>
        
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          {showAll && (
            <button
              onClick={() => handlePlatformClick('all')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl",
                selectedPlatform === 'all' && "bg-[#0059F8]/5 text-[#0059F8]"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">全部平台</span>
              {selectedPlatform === 'all' && <Check className="w-4 h-4 ml-auto" />}
            </button>
          )}
          
          {enabledPlatforms.map((platform) => {
            const Icon = iconMap[platform.icon] || MessageCircle;
            const isActive = selectedPlatform === platform.id;
            
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
                  isActive && "bg-gray-50",
                  platform.id === enabledPlatforms[enabledPlatforms.length - 1].id && "rounded-b-xl"
                )}
              >
                <div style={{ color: platform.color }}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{platform.name}</span>
                {isActive && <Check className="w-4 h-4 ml-auto text-[#0059F8]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Sidebar variant (default)
  return (
    <div className="space-y-1">
      {showAll && (
        <button
          onClick={() => handlePlatformClick('all')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
            selectedPlatform === 'all'
              ? "bg-[#0059F8] text-white shadow-md"
              : "hover:bg-gray-100 text-gray-600"
          )}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">全部平台</span>
        </button>
      )}
      
      {enabledPlatforms.map((platform) => {
        const Icon = iconMap[platform.icon] || MessageCircle;
        const isActive = selectedPlatform === platform.id;
        
        return (
          <button
            key={platform.id}
            onClick={() => handlePlatformClick(platform.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
              isActive
                ? "text-white shadow-md"
                : "hover:bg-gray-100 text-gray-600"
            )}
            style={{
              backgroundColor: isActive ? platform.color : undefined,
            }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{platform.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSwitcher;
