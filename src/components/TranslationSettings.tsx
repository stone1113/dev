import React from 'react';
import { X, Languages, ChevronDown, Download, Send, Settings2, HelpCircle } from 'lucide-react';
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
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'auto', name: '自动检测', flag: '🔍' },
];

const translationEngines = [
  { code: 'google', name: '谷歌翻译' },
  { code: 'deepl', name: 'DeepL' },
  { code: 'azure', name: 'Azure' },
  { code: 'llm', name: '大模型' },
];

export const TranslationSettings: React.FC<TranslationSettingsProps> = ({ onClose }) => {
  const { userSettings, updateUserSettings } = useStore();

  // 下拉选择组件
  const SelectField = ({
    label,
    value,
    onChange,
    options,
    showFlag = true
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: typeof languages;
    showFlag?: boolean;
  }) => (
    <div className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2">
      <span className="text-xs text-gray-600 w-28 flex-shrink-0 font-medium">{label}</span>
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-[#FF6B35] bg-white shadow-sm"
        >
          {options.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {showFlag && opt.flag} {opt.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  // 开关组件
  const ToggleSwitch = ({
    label,
    description,
    checked,
    onChange,
    tooltip,
    color = 'blue'
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
    tooltip?: string;
    color?: 'blue' | 'green';
  }) => (
    <div className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1">
        <div>
          <p className="text-xs font-medium text-gray-900 flex items-center gap-1">
            {label}
            {tooltip && (
              <span className="group relative">
                <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                <span className="absolute left-0 bottom-full mb-1 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg z-10">
                  {tooltip}
                </span>
              </span>
            )}
          </p>
          <p className="text-[11px] text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={cn(
          "w-9 h-5 rounded-full transition-colors relative flex-shrink-0",
          checked
            ? color === 'green' ? "bg-green-500" : "bg-[#FF6B35]"
            : "bg-gray-300"
        )}
      >
        <span className={cn(
          "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
          checked ? "left-[18px]" : "left-0.5"
        )} />
      </button>
    </div>
  );

  return (
    <div className="h-full bg-white rounded-xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-[#FF6B35]" />
          <h3 className="font-semibold text-gray-900">翻译设置</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 接收设置 */}
        <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-xl p-4 border border-orange-100/60">
          <h4 className="text-sm font-semibold text-gray-900 pb-3 mb-3 border-b border-orange-200/50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
              <Download className="w-4 h-4 text-[#FF6B35]" />
            </div>
            接收设置
            <span className="text-[11px] font-normal text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">全局译文</span>
          </h4>

          <div className="space-y-3">
            <SelectField
              label="我的母语 / 目标显示语"
              value={userSettings.preferences.translation.receiveLanguage}
              onChange={(v) => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: { ...userSettings.preferences.translation, receiveLanguage: v }
                }
              })}
              options={languages.filter(l => l.code !== 'auto')}
            />

            <SelectField
              label="翻译线路"
              value={userSettings.preferences.translation.receiveEngine || 'google'}
              onChange={(v) => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: { ...userSettings.preferences.translation, receiveEngine: v }
                }
              })}
              options={translationEngines.map(e => ({ code: e.code, name: e.name, flag: '' }))}
              showFlag={false}
            />

            <SelectField
              label="源语言（对方语种）"
              value={userSettings.preferences.translation.sourceLanguage || 'auto'}
              onChange={(v) => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: { ...userSettings.preferences.translation, sourceLanguage: v }
                }
              })}
              options={languages}
            />

            <ToggleSwitch
              label="自动翻译接收的消息"
              description="收到消息时自动翻译为我的母语"
              checked={userSettings.preferences.translation.autoReceive ?? true}
              onChange={() => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: {
                    ...userSettings.preferences.translation,
                    autoReceive: !(userSettings.preferences.translation.autoReceive ?? true)
                  }
                }
              })}
            />
          </div>
        </div>

        {/* 发送设置 */}
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-xl p-4 border border-blue-100/60">
          <h4 className="text-sm font-semibold text-gray-900 pb-3 mb-3 border-b border-blue-200/50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Send className="w-4 h-4 text-blue-500" />
            </div>
            发送设置
            <span className="text-[11px] font-normal text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">目标输出</span>
          </h4>

          <div className="space-y-3">
            <SelectField
              label="输出目标语"
              value={userSettings.preferences.translation.sendLanguage}
              onChange={(v) => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: { ...userSettings.preferences.translation, sendLanguage: v }
                }
              })}
              options={languages.filter(l => l.code !== 'auto')}
            />

            <SelectField
              label="翻译线路"
              value={userSettings.preferences.translation.sendEngine || 'google'}
              onChange={(v) => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: { ...userSettings.preferences.translation, sendEngine: v }
                }
              })}
              options={translationEngines.map(e => ({ code: e.code, name: e.name, flag: '' }))}
              showFlag={false}
            />

            <ToggleSwitch
              label="将发送的消息翻译成对方语言"
              description="发送前自动翻译为客户语种"
              checked={userSettings.preferences.translation.autoSend ?? false}
              onChange={() => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: {
                    ...userSettings.preferences.translation,
                    autoSend: !(userSettings.preferences.translation.autoSend ?? false)
                  }
                }
              })}
            />
          </div>
        </div>

        {/* 高级设置 */}
        <div className="bg-gradient-to-br from-purple-50/80 to-violet-50/50 rounded-xl p-4 border border-purple-100/60">
          <h4 className="text-sm font-semibold text-gray-900 pb-3 mb-3 border-b border-purple-200/50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-purple-500" />
            </div>
            高级设置
          </h4>

          <div className="space-y-3">
            <ToggleSwitch
              label="实时翻译"
              description="输入时实时显示翻译结果"
              checked={userSettings.preferences.translation.realtimeTranslate ?? false}
              onChange={() => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: {
                    ...userSettings.preferences.translation,
                    realtimeTranslate: !(userSettings.preferences.translation.realtimeTranslate ?? false)
                  }
                }
              })}
            />

            <ToggleSwitch
              label="群组自动翻译"
              description="群聊消息自动翻译"
              checked={userSettings.preferences.translation.groupAutoTranslate ?? false}
              onChange={() => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: {
                    ...userSettings.preferences.translation,
                    groupAutoTranslate: !(userSettings.preferences.translation.groupAutoTranslate ?? false)
                  }
                }
              })}
            />

            <ToggleSwitch
              label="禁发中文"
              description="检测到中文时阻止发送"
              checked={userSettings.preferences.translation.blockChinese ?? false}
              onChange={() => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: {
                    ...userSettings.preferences.translation,
                    blockChinese: !(userSettings.preferences.translation.blockChinese ?? false)
                  }
                }
              })}
              tooltip="开启后，发送内容包含中文时将阻止发送，防止误发中文给客户"
              color="green"
            />

            <ToggleSwitch
              label="翻译确认"
              description="发送前显示译文对照确认"
              checked={userSettings.preferences.translation.confirmTranslation ?? false}
              onChange={() => updateUserSettings({
                preferences: {
                  ...userSettings.preferences,
                  translation: {
                    ...userSettings.preferences.translation,
                    confirmTranslation: !(userSettings.preferences.translation.confirmTranslation ?? false)
                  }
                }
              })}
              tooltip="第一次点击发送显示原文与译文对照，第二次点击确认发送译文"
              color="green"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          重置
        </button>
        <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A]">
          保存
        </button>
      </div>
    </div>
  );
};
