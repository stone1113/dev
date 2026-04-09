import React, { useState } from 'react';
import { X, Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Department } from '@/types';

interface Platform {
  id: string;
  name: string;
  icon: string;
}

const PLATFORMS: Platform[] = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
  { id: 'line', name: 'Line', icon: '💚' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'wechat', name: 'WeChat', icon: '💬' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'sms', name: 'SMS', icon: '💬' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'shopify', name: 'Shopify', icon: '🛍️' },
  { id: 'messenger', name: 'Messenger', icon: '💬' },
  { id: 'viber', name: 'Viber', icon: '📞' },
  { id: 'kakao', name: 'KakaoTalk', icon: '💛' },
  { id: 'zalo', name: 'Zalo', icon: '💙' },
  { id: 'skype', name: 'Skype', icon: '📞' },
];

interface CreateActivationCodeModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const CreateActivationCodeModal: React.FC<CreateActivationCodeModalProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    platforms: initialData?.platforms ?? [] as string[],
    portAllocation: initialData?.portAllocation ?? 'dynamic' as 'dynamic' | 'fixed',
    portLimit: initialData?.portLimit ?? 1,
    workingHours: initialData?.workingHours ?? 'none' as 'none' | 'fixed',
    dedupeScope: initialData?.dedupeScope ?? 'current' as 'current' | 'account' | 'related',
    multiDevice: initialData?.multiDevice ?? false,
    profileSharing: initialData?.profileSharing ?? true,
    autoReplyKeyword: initialData?.autoReplyKeyword ?? false,
    autoReplyWelcome: initialData?.autoReplyWelcome ?? false,
    aiEmployee: initialData?.aiEmployee ?? false,
    chatBackup: initialData?.chatBackup ?? true,
    dataMasking: initialData?.dataMasking ?? false,
    dataPermissions: initialData?.dataPermissions ?? [] as string[],
    remark: initialData?.remark ?? '',
  });
  const [platformSearch, setPlatformSearch] = useState('');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const departments = useStore(s => s.departments);

  // 扁平化部门树
  const flattenDepts = (depts: Department[], depth = 0): { id: string; name: string; depth: number }[] =>
    depts.flatMap(d => [{ id: d.id, name: d.name, depth }, ...flattenDepts(d.children ?? [], depth + 1)]);
  const flatDepts = flattenDepts(departments);

  const toggleDeptPermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dataPermissions: prev.dataPermissions.includes(id)
        ? prev.dataPermissions.filter((d: string) => d !== id)
        : [...prev.dataPermissions, id],
    }));
  };

  const filteredPlatforms = PLATFORMS.filter(p =>
    p.name.toLowerCase().includes(platformSearch.toLowerCase())
  );

  const togglePlatform = (id: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p: string) => p !== id)
        : [...prev.platforms, id]
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">新建激活码</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[600px] overflow-y-auto">
          <div className="space-y-5">
            {/* 社交平台 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">社交平台</label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索平台..."
                  value={platformSearch}
                  onChange={(e) => setPlatformSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto p-1 border border-gray-100 rounded-lg">
                {filteredPlatforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "p-2 rounded-lg border-2 transition-all text-center",
                      formData.platforms.includes(platform.id)
                        ? "border-[#FF6B35] bg-[#FF6B35]/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="text-xl mb-0.5">{platform.icon}</div>
                    <div className="text-[10px] font-medium text-gray-700">{platform.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 端口分配 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">端口分配</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.portAllocation === 'dynamic'}
                    onChange={() => setFormData({ ...formData, portAllocation: 'dynamic' })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">动态分配</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.portAllocation === 'fixed'}
                    onChange={() => setFormData({ ...formData, portAllocation: 'fixed' })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">固定分配</span>
                </label>
              </div>
            </div>

            {/* 端口上限 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">端口上限</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormData({ ...formData, portLimit: Math.max(1, formData.portLimit - 1) })}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={formData.portLimit}
                  onChange={(e) => setFormData({ ...formData, portLimit: parseInt(e.target.value) || 1 })}
                  className="w-20 px-3 py-2 text-sm text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                />
                <button
                  onClick={() => setFormData({ ...formData, portLimit: formData.portLimit + 1 })}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* 激活码工作时间 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">激活码工作时间</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.workingHours === 'none'}
                    onChange={() => setFormData({ ...formData, workingHours: 'none' })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">暂不设置</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.workingHours === 'fixed'}
                    onChange={() => setFormData({ ...formData, workingHours: 'fixed' })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">固定时间</span>
                </label>
              </div>
            </div>

            {/* 粉丝去重范围 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">粉丝去重范围</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.dedupeScope === 'current'}
                    onChange={() => setFormData({ ...formData, dedupeScope: 'current' })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">当前工单</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.dedupeScope === 'account'}
                    onChange={() => setFormData({ ...formData, dedupeScope: 'account' })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">账号下全部工单</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.dedupeScope === 'related'}
                    onChange={() => setFormData({ ...formData, dedupeScope: 'related' })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">关联账号下全部工单</span>
                </label>
              </div>
            </div>

            {/* 多设备登录 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">多设备登录</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.multiDevice === true}
                    onChange={() => setFormData({ ...formData, multiDevice: true })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">开启</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.multiDevice === false}
                    onChange={() => setFormData({ ...formData, multiDevice: false })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">关闭</span>
                </label>
              </div>
            </div>

            {/* 客户画像共享 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">客户画像共享</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.profileSharing === true}
                    onChange={() => setFormData({ ...formData, profileSharing: true })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">共享</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.profileSharing === false}
                    onChange={() => setFormData({ ...formData, profileSharing: false })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">不共享</span>
                </label>
              </div>
            </div>

            {/* 自动回复 */}
            <div className="flex items-start justify-between">
              <label className="text-sm font-medium text-gray-700 mt-0.5">自动回复</label>
              <div className="flex flex-col items-end gap-2.5">
                {/* AI员工开关 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-gray-700">AI员工</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      aiEmployee: !prev.aiEmployee,
                      ...((!prev.aiEmployee) ? { autoReplyKeyword: false, autoReplyWelcome: false } : {})
                    }))}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      formData.aiEmployee ? "bg-[#FF6B35]" : "bg-gray-200"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                      formData.aiEmployee ? "translate-x-4.5" : "translate-x-0.5"
                    )} />
                  </button>
                </label>
                {/* 关键词回复 & 欢迎语回复 */}
                <div className="flex items-center gap-4">
                  <label className={cn("flex items-center gap-2", formData.aiEmployee ? "cursor-not-allowed opacity-40" : "cursor-pointer")}>
                    <input
                      type="checkbox"
                      checked={formData.autoReplyKeyword}
                      disabled={formData.aiEmployee}
                      onChange={(e) => setFormData({ ...formData, autoReplyKeyword: e.target.checked })}
                      className="w-4 h-4 text-[#FF6B35] rounded"
                    />
                    <span className="text-sm text-gray-700">关键词回复</span>
                  </label>
                  <label className={cn("flex items-center gap-2", formData.aiEmployee ? "cursor-not-allowed opacity-40" : "cursor-pointer")}>
                    <input
                      type="checkbox"
                      checked={formData.autoReplyWelcome}
                      disabled={formData.aiEmployee}
                      onChange={(e) => setFormData({ ...formData, autoReplyWelcome: e.target.checked })}
                      className="w-4 h-4 text-[#FF6B35] rounded"
                    />
                    <span className="text-sm text-gray-700">欢迎语回复</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 聊天备份 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">聊天备份</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.chatBackup === true}
                    onChange={() => setFormData({ ...formData, chatBackup: true })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">开启</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.chatBackup === false}
                    onChange={() => setFormData({ ...formData, chatBackup: false })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">关闭</span>
                </label>
              </div>
            </div>

            {/* 数据脱敏 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">数据脱敏</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.dataMasking === true}
                    onChange={() => setFormData({ ...formData, dataMasking: true })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">开启</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.dataMasking === false}
                    onChange={() => setFormData({ ...formData, dataMasking: false })}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">关闭</span>
                </label>
              </div>
            </div>

            {/* 数据权限 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">数据权限</label>
              <div className="relative w-64">
                <button
                  type="button"
                  onClick={() => setDeptDropdownOpen(o => !o)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-[#FF6B35]/50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                >
                  <span className={cn("truncate", formData.dataPermissions.length === 0 ? "text-gray-400" : "text-gray-700")}>
                    {formData.dataPermissions.length === 0
                      ? "请选择部门"
                      : flatDepts.filter(d => formData.dataPermissions.includes(d.id)).map(d => d.name).join("、")}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 flex-shrink-0 transition-transform", deptDropdownOpen && "rotate-180")} />
                </button>
                {deptDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto flex flex-col">
                    <div className="flex-1 overflow-y-auto py-1">
                      {flatDepts.map(dept => (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => toggleDeptPermission(dept.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                          style={{ paddingLeft: `${12 + dept.depth * 16}px` }}
                        >
                          <span className={cn(
                            "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center",
                            formData.dataPermissions.includes(dept.id) ? "bg-[#FF6B35] border-[#FF6B35]" : "border-gray-300"
                          )}>
                            {formData.dataPermissions.includes(dept.id) && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <span className="text-gray-700 truncate">{dept.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 px-3 py-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setDeptDropdownOpen(false)}
                        className="px-3 py-1 text-xs font-medium text-white bg-[#FF6B35] rounded-md hover:bg-[#e55a25] transition-colors"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 备注说明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注说明</label>
              <textarea
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="请输入备注说明"
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 resize-none"
              />
              <div className="text-xs text-gray-400 text-right mt-1">
                {formData.remark.length} / 200
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
          >
            创建
          </button>
        </div>
      </div>
    </div>
  );
};
