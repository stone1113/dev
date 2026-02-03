import React, { useState } from 'react';
import { X, Languages, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface TranslationSettingsProps {
  onClose: () => void;
}

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export const TranslationSettings: React.FC<TranslationSettingsProps> = ({ onClose }) => {
  const { userSettings, updateUserSettings } = useStore();
  const [autoDetect, setAutoDetect] = useState(true);

  const handleToggleTranslation = () => {
    updateUserSettings({
      preferences: {
        ...userSettings.preferences,
        translation: {
          ...userSettings.preferences.translation,
          enabled: !userSettings.preferences.translation.enabled
        }
      }
    });
  };

  return (
    <div className="h-full bg-white rounded-xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">翻译设置</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 翻译开关 */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">启用翻译</p>
            <p className="text-xs text-gray-500">自动翻译消息</p>
          </div>
          <button
            onClick={handleToggleTranslation}
            className={cn(
              "w-10 h-5 rounded-full transition-colors relative",
              userSettings.preferences.translation.enabled ? "bg-blue-500" : "bg-gray-200"
            )}
          >
            <span className={cn(
              "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
              userSettings.preferences.translation.enabled ? "left-5" : "left-0.5"
            )} />
          </button>
        </div>

        {/* 自动检测 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">自动检测</p>
            <p className="text-xs text-gray-500">识别客户语言</p>
          </div>
          <button
            onClick={() => setAutoDetect(!autoDetect)}
            className={cn(
              "w-10 h-5 rounded-full transition-colors relative",
              autoDetect ? "bg-blue-500" : "bg-gray-200"
            )}
          >
            <span className={cn(
              "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
              autoDetect ? "left-5" : "left-0.5"
            )} />
          </button>
        </div>

        {/* 接收语言 */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 block">接收翻译为</label>
          <div className="grid grid-cols-2 gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    translation: {
                      ...userSettings.preferences.translation,
                      receiveLanguage: lang.code
                    }
                  }
                })}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all",
                  userSettings.preferences.translation.receiveLanguage === lang.code
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span>{lang.flag}</span>
                <span className="truncate">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 发送语言 */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 block">发送翻译为</label>
          <div className="relative">
            <select
              value={userSettings.preferences.translation.sendLanguage}
              onChange={(e) => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: {
                    ...userSettings.preferences.translation,
                    sendLanguage: e.target.value
                  }
                }
              })}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="auto">跟随客户语言</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 翻译引擎 */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 block">翻译引擎</label>
          <div className="flex gap-2">
            {['Google', 'DeepL', 'Azure'].map((engine) => (
              <button
                key={engine}
                className={cn(
                  "flex-1 px-2 py-1.5 text-xs font-medium border rounded-lg transition-colors",
                  engine === 'Google'
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {engine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          重置
        </button>
        <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
          保存
        </button>
      </div>
    </div>
  );
};
