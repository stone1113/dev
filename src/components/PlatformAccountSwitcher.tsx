import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import type { Platform, PlatformAccount } from '@/types';
import { ChevronDown, Check, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformAccountSwitcherProps {
  platform: Platform;
  compact?: boolean;
}

export const PlatformAccountSwitcher: React.FC<PlatformAccountSwitcherProps> = ({
  platform,
  compact = false
}) => {
  const { getPlatformAccounts, getSelectedAccount, setPlatformAccount } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const accounts = getPlatformAccounts(platform);
  const selectedAccount = getSelectedAccount(platform);
  const platformConfig = platformConfigs.find(p => p.id === platform);

  if (accounts.length <= 1) {
    return selectedAccount ? (
      <div className={cn("flex items-center gap-2", compact ? "px-2 py-1" : "px-3 py-2")}>
        <img
          src={selectedAccount.avatar}
          alt={selectedAccount.name}
          className={cn("rounded-full object-cover", compact ? "w-5 h-5" : "w-6 h-6")}
        />
        {!compact && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{selectedAccount.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{selectedAccount.accountId}</p>
          </div>
        )}
      </div>
    ) : null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 rounded-lg transition-all hover:bg-gray-100",
          compact ? "px-2 py-1" : "px-3 py-2",
          isOpen && "bg-gray-100"
        )}
      >
        {selectedAccount ? (
          <>
            <div className="relative">
              <img
                src={selectedAccount.avatar}
                alt={selectedAccount.name}
                className={cn("rounded-full object-cover", compact ? "w-5 h-5" : "w-6 h-6")}
              />
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white",
                selectedAccount.status === 'online' ? "bg-green-500" :
                selectedAccount.status === 'busy' ? "bg-amber-500" : "bg-gray-400"
              )} />
            </div>
            {!compact && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-gray-700 truncate">{selectedAccount.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{selectedAccount.accountId}</p>
              </div>
            )}
            <ChevronDown className={cn(
              "text-gray-400 transition-transform",
              compact ? "w-3 h-3" : "w-4 h-4",
              isOpen && "rotate-180"
            )} />
          </>
        ) : (
          <>
            <User className={cn("text-gray-400", compact ? "w-4 h-4" : "w-5 h-5")} />
            {!compact && <span className="flex-1 text-left text-xs text-gray-500">选择账号</span>}
            <ChevronDown className={cn("text-gray-400", compact ? "w-3 h-3" : "w-4 h-4")} />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-2 border-b border-gray-100 bg-gray-50">
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                {platformConfig?.name} 账号
              </p>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {accounts.map((account: PlatformAccount) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setPlatformAccount(platform, account.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors",
                    selectedAccount?.id === account.id && "bg-[#0059F8]/5"
                  )}
                >
                  <div className="relative">
                    <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white",
                      account.status === 'online' ? "bg-green-500" :
                      account.status === 'busy' ? "bg-amber-500" : "bg-gray-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-700 truncate">{account.name}</p>
                      {account.isDefault && (
                        <span className="px-1.5 py-0.5 text-[9px] bg-[#0059F8]/10 text-[#0059F8] rounded-full">默认</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{account.accountId}</p>
                  </div>
                  {selectedAccount?.id === account.id && <Check className="w-4 h-4 text-[#0059F8]" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlatformAccountSwitcher;
