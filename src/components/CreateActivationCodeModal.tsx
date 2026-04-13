import React, { useState } from 'react';
import { X, ChevronDown, Check, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Department } from '@/types';

const Tip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group inline-flex items-center ml-1 shrink-0">
    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-52 rounded-lg bg-gray-800 px-2.5 py-1.5 text-xs text-white leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-normal shadow-lg">
      {text}
    </span>
  </span>
);

interface Platform {
  id: string;
  name: string;
  icon: string;
}

const PLATFORMS: Platform[] = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
];

const PAGE_PERMISSIONS = [
  { id: 'removeAccount', name: '支持移除账号' },
  { id: 'leadsAnalysis', name: '支持线索分析' },
  { id: 'ticketLog', name: '支持工单日志' },
  { id: 'leadsReset', name: '支持线索清零' },
  { id: 'ticketDistribute', name: '工单分配分流' },
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
    aiSeatLimit: initialData?.aiSeatLimit ?? 1,
    group: initialData?.group ?? 'all',
    pagePermissions: initialData?.pagePermissions ?? [] as string[],
    workingHours: initialData?.workingHours ?? 'none' as 'none' | 'fixed',
    autoReplyKeyword: initialData?.autoReplyKeyword ?? false,
    autoReplyWelcome: initialData?.autoReplyWelcome ?? false,
    dedupeScope: initialData?.dedupeScope ?? 'currentWithLib' as string,
    multiDevice: initialData?.multiDevice ?? false,
    chatBackup: initialData?.chatBackup ?? true,
    profileSharing: initialData?.profileSharing ?? false,
    dataMasking: initialData?.dataMasking ?? true,
    resetTime: initialData?.resetTime ?? '0:00',
    dataPermissions: initialData?.dataPermissions ?? [] as string[],
    aiEmployee: initialData?.aiEmployee ?? false,
    remark: initialData?.remark ?? '',
  });
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const departments = useStore(s => s.departments);

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">新建激活码</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[640px] overflow-y-auto">
          <div className="space-y-4">

            {/* 端口分配 */}
            <div className="flex items-center gap-6">
              <label className="flex items-center text-xs font-medium text-gray-700 w-24 shrink-0">端口分配</label>
              <div className="flex items-center gap-4">
                {(['dynamic', 'fixed'] as const).map((v, i) => (
                  <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={formData.portAllocation === v}
                      onChange={() => setFormData({ ...formData, portAllocation: v })}
                      className="w-4 h-4 accent-[#FF6B35]" />
                    <span className="text-xs text-gray-700">{i === 0 ? '动态分配' : '固定分配'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 端口上限 */}
            <div className="flex items-center gap-6">
              <label className="flex items-center text-xs font-medium text-gray-700 w-24 shrink-0"><span className="text-red-500">*</span> 端口上限</label>
              <input
                type="number" min={1} value={formData.portLimit}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 1;
                  setFormData(prev => ({ ...prev, portLimit: v, aiSeatLimit: v }));
                }}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
              />
            </div>

            {/* AI坐席额度 */}
            <div className="flex items-center gap-6">
              <label className="flex items-center text-xs font-medium text-gray-700 w-24 shrink-0">AI坐席额度<Tip text="该激活码可开启AI自动回复的坐席数量上限，默认与端口上限一致" /></label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 ml-2">
                  <button type="button"
                    onClick={() => setFormData(prev => ({ ...prev, aiSeatLimit: Math.max(0, prev.aiSeatLimit - 1) }))}
                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600"
                  >−</button>
                  <input type="number" min={0} value={formData.aiSeatLimit}
                    onChange={(e) => setFormData({ ...formData, aiSeatLimit: parseInt(e.target.value) || 0 })}
                    className="w-14 px-2 py-1 text-sm text-center border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                  />
                  <button type="button"
                    onClick={() => setFormData(prev => ({ ...prev, aiSeatLimit: prev.aiSeatLimit + 1 }))}
                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600"
                  >+</button>
                </div>
              </div>
            </div>

            {/* 分组 */}
            <div className="flex items-center gap-6">
              <label className="flex items-center text-xs font-medium text-gray-700 w-24 shrink-0">分组</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 bg-white"
              >
                <option value="all">全部</option>
                <option value="group1">分组1</option>
                <option value="group2">分组2</option>
              </select>
            </div>

            {/* 分享页面权限 */}
            <div className="flex items-start gap-6">
              <label className="flex items-center text-xs font-medium text-gray-700 w-24 shrink-0 mt-0.5">分享页面权限<Tip text="控制该激活码用户在分享页面可见的操作权限" /></label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {PAGE_PERMISSIONS.map(p => (
                  <label key={p.id} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pagePermissions.includes(p.id)}
                      onChange={() => setFormData(prev => ({
                        ...prev,
                        pagePermissions: prev.pagePermissions.includes(p.id)
                          ? prev.pagePermissions.filter((x: string) => x !== p.id)
                          : [...prev.pagePermissions, p.id]
                      }))}
                      className="w-4 h-4 accent-[#FF6B35] rounded"
                    />
                    <span className="text-xs text-gray-700">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 社交平台 */}
            <div className="flex items-center gap-6">
              <label className="flex items-center text-xs font-medium text-gray-700 w-24 shrink-0"><span className="text-red-500">*</span> 社交平台</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.platforms.length === PLATFORMS.length}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      platforms: prev.platforms.length === PLATFORMS.length ? [] : PLATFORMS.map(p => p.id)
                    }))}
                    className="w-4 h-4 accent-[#FF6B35] rounded"
                  />
                  <span className="text-xs text-gray-700">全选</span>
                </label>
                {PLATFORMS.map(platform => (
                  <label key={platform.id} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.id)}
                      onChange={() => togglePlatform(platform.id)}
                      className="w-4 h-4 accent-[#FF6B35] rounded"
                    />
                    <span className="text-xs text-gray-700">{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 线索去重范围 */}
            <div className="flex items-start gap-6">
              <label className="flex items-center text-xs font-medium text-gray-700 w-24 shrink-0 mt-0.5">线索去重范围<Tip text="设置粉丝去重的范围，避免同一用户被多个工单重复添加" /></label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {[
                  { v: 'current', label: '当前工单' },
                  { v: 'currentWithLib', label: '当前工单(含底库)' },
                  { v: 'account', label: '账号下全部工单(含底库)' },
                  { v: 'group', label: '激活码分组内' },
                  { v: 'specified', label: '指定激活码去重' },
                ].map(opt => (
                  <label key={opt.v} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={formData.dedupeScope === opt.v}
                      onChange={() => setFormData({ ...formData, dedupeScope: opt.v })}
                      className="w-4 h-4 accent-[#FF6B35]" />
                    <span className="text-xs text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-1" />

            {/* 2-column grid for bottom settings */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {/* 激活码工作时间 + 自动回复 */}
              <div className="flex items-start gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-28 shrink-0 mt-0.5">激活码工作时间<Tip text="设置该激活码的工作时段，非工作时间内AI将暂停自动回复" /></label>
                <div className="flex items-center gap-3 mt-0.5">
                  {[{ v: 'none', l: '暂不设置' }, { v: 'fixed', l: '固定时间' }].map(o => (
                    <label key={o.v} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={formData.workingHours === o.v}
                        onChange={() => setFormData({ ...formData, workingHours: o.v as any })}
                        className="w-4 h-4 accent-[#FF6B35]" />
                      <span className="text-xs text-gray-700">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-20 shrink-0 mt-0.5">自动回复<Tip text="开启AI接管后，AI将自动处理所有消息；也可单独开启关键词回复或欢迎语回复" /></label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-700">AI接管</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        aiEmployee: !prev.aiEmployee,
                        ...(!prev.aiEmployee ? { autoReplyKeyword: false, autoReplyWelcome: false } : {})
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
                  <div className="flex items-center gap-3">
                    <label className={cn("flex items-center gap-1.5", formData.aiEmployee ? "cursor-not-allowed opacity-40" : "cursor-pointer")}>
                      <input type="checkbox" checked={formData.autoReplyKeyword}
                        disabled={formData.aiEmployee}
                        onChange={(e) => setFormData({ ...formData, autoReplyKeyword: e.target.checked })}
                        className="w-4 h-4 accent-[#FF6B35] rounded" />
                      <span className="text-xs text-gray-700">关键词回复</span>
                    </label>
                    <label className={cn("flex items-center gap-1.5", formData.aiEmployee ? "cursor-not-allowed opacity-40" : "cursor-pointer")}>
                      <input type="checkbox" checked={formData.autoReplyWelcome}
                        disabled={formData.aiEmployee}
                        onChange={(e) => setFormData({ ...formData, autoReplyWelcome: e.target.checked })}
                        className="w-4 h-4 accent-[#FF6B35] rounded" />
                      <span className="text-xs text-gray-700">欢迎语回复</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 多设备登录 + 聊天备份 */}
              <div className="flex items-center gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-28 shrink-0">多设备登录<Tip text="允许同一激活码在多台设备上同时登录使用" /></label>
                <div className="flex items-center gap-3">
                  {[{ v: true, l: '开启' }, { v: false, l: '关闭' }].map(o => (
                    <label key={String(o.v)} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={formData.multiDevice === o.v}
                        onChange={() => setFormData({ ...formData, multiDevice: o.v })}
                        className="w-4 h-4 accent-[#FF6B35]" />
                      <span className="text-xs text-gray-700">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-20 shrink-0">聊天备份<Tip text="开启后聊天记录将自动备份至云端，防止数据丢失" /></label>
                <div className="flex items-center gap-3">
                  {[{ v: true, l: '开启' }, { v: false, l: '关闭' }].map(o => (
                    <label key={String(o.v)} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={formData.chatBackup === o.v}
                        onChange={() => setFormData({ ...formData, chatBackup: o.v })}
                        className="w-4 h-4 accent-[#FF6B35]" />
                      <span className="text-xs text-gray-700">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 客户画像共享 + 数据脱敏 */}
              <div className="flex items-center gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-28 shrink-0">客户画像共享<Tip text="开启共享后，同组其他客服可查看该激活码下的客户画像数据" /></label>
                <div className="flex items-center gap-3">
                  {[{ v: true, l: '共享' }, { v: false, l: '不共享' }].map(o => (
                    <label key={String(o.v)} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={formData.profileSharing === o.v}
                        onChange={() => setFormData({ ...formData, profileSharing: o.v })}
                        className="w-4 h-4 accent-[#FF6B35]" />
                      <span className="text-xs text-gray-700">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-20 shrink-0">数据脱敏<Tip text="开启后客户手机号、邮箱等敏感信息将自动打码显示" /></label>
                <div className="flex items-center gap-3">
                  {[{ v: true, l: '开启' }, { v: false, l: '关闭' }].map(o => (
                    <label key={String(o.v)} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={formData.dataMasking === o.v}
                        onChange={() => setFormData({ ...formData, dataMasking: o.v })}
                        className="w-4 h-4 accent-[#FF6B35]" />
                      <span className="text-xs text-gray-700">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 置零时间 */}
              <div className="flex items-center gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-28 shrink-0">置零时间<Tip text="每天在该时间点自动将线索计数清零，重新开始统计" /></label>
                <input
                  type="time"
                  value={formData.resetTime}
                  onChange={(e) => setFormData({ ...formData, resetTime: e.target.value })}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                />
              </div>

              {/* 数据权限 */}
              <div className="flex items-center gap-3">
                <label className="flex items-center text-xs font-medium text-gray-700 w-20 shrink-0">数据权限<Tip text="设置该激活码可查看的部门数据范围，不选则默认仅查看自己的数据" /></label>
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setDeptDropdownOpen(o => !o)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-[#FF6B35]/50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                  >
                    <span className={cn("truncate", formData.dataPermissions.length === 0 ? "text-gray-400" : "text-gray-700")}>
                      {formData.dataPermissions.length === 0
                        ? "请选择"
                        : flatDepts.filter(d => formData.dataPermissions.includes(d.id)).map(d => d.name).join("、")}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 flex-shrink-0 transition-transform", deptDropdownOpen && "rotate-180")} />
                  </button>
                  {deptDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 flex flex-col max-h-48">
                      <div className="flex-1 overflow-y-auto py-1">
                        {flatDepts.map(dept => (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => toggleDeptPermission(dept.id)}
                            className="w-full flex items-center gap-2 py-2 text-sm hover:bg-gray-50 transition-colors"
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
            </div>{/* end grid */}

            {/* 备注说明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <textarea
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="备注说明"
                rows={2}
                maxLength={50}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 resize-none"
              />
              <div className="text-xs text-gray-400 text-right mt-1">
                {formData.remark.length} / 50
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
