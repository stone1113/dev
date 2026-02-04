// 简单调度建议工具：基于客户偏好时间段和时区（假设 store 中有 country 或 timezone），生成推荐的发送日期和时间字符串
type PreferredTime = string | undefined; // 示例: '上午9-12点', '下午3-6点', '晚上7-10点'

function parsePreferredTime(pref: PreferredTime) {
  if (!pref) return null;
  // 仅做简单解析，返回约束小时区间（24小时）
  if (pref.includes('上午')) return { start: 9, end: 12 };
  if (pref.includes('下午')) return { start: 15, end: 18 };
  if (pref.includes('晚上') || pref.includes('夜')) return { start: 19, end: 22 };
  if (pref.includes('上午9-12')) return { start: 9, end: 12 };
  return null;
}

export function suggestSendTime(preferredTimes: PreferredTime[], timezoneOffsetHours = 0) {
  // preferredTimes: array of strings like '上午9-12点' or undefined
  // timezoneOffsetHours: 客户本地相对于服务器时区的小时偏移（示例只用于演示）
  // 策略：取多数人的首选时间区间，返回下一个可用日期的中点时间。

  const buckets: Record<string, number> = {};
  preferredTimes.forEach(p => {
    const r = parsePreferredTime(p);
    if (!r) return;
    const key = `${r.start}-${r.end}`;
    buckets[key] = (buckets[key] || 0) + 1;
  });

  let chosenRange = null as { start: number; end: number } | null;
  let max = 0;
  Object.keys(buckets).forEach(k => {
    if (buckets[k] > max) {
      max = buckets[k];
      const [s, e] = k.split('-').map(n => Number(n));
      chosenRange = { start: s, end: e };
    }
  });

  // 若没有偏好，默认工作日上午10点
  if (!chosenRange) chosenRange = { start: 10, end: 10 };

  const now = new Date();
  const suggested = new Date(now.getTime());
  // 建议为明天的首选区间中点，避免立即发送
  suggested.setDate(now.getDate() + 1);
  const mid = Math.floor((chosenRange.start + chosenRange.end) / 2);
  suggested.setHours(mid - timezoneOffsetHours, 0, 0, 0);

  // 返回 ISO 日期与时间片段
  const date = suggested.toISOString().slice(0, 10);
  const time = suggested.toTimeString().slice(0,5);

  return { date, time, range: chosenRange };
}

export default { suggestSendTime };
