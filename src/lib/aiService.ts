// 简单的 AI 服务封装（本地模拟）。生产环境请替换为真实 LLM/后端调用。
export interface GenerateOptions {
  prompt?: string;
  knowledgeTexts?: string[];
  tone?: 'friendly' | 'professional' | 'casual';
  maxVariants?: number;
}

export async function generateMessage(options: GenerateOptions) {
  const { prompt = '', knowledgeTexts = [], tone = 'friendly', maxVariants = 3 } = options;

  // 模拟网络延迟
  await new Promise((r) => setTimeout(r, 900));

  const base = prompt ? `${prompt}` : '尊敬的客户，感谢您的关注。';
  const knowledgeContext = knowledgeTexts.length ? `
相关信息：${knowledgeTexts.join(' | ')}
` : '';

  const variants: string[] = [];
  for (let i = 0; i < maxVariants; i++) {
    const suffix = i === 0 ? '' : `（备选 ${i}）`;
    if (knowledgeTexts.length > 0) {
      variants.push(`${base} ${knowledgeContext}如需了解更多详情，请回复此消息。${suffix}`);
    } else {
      if (tone === 'friendly') {
        variants.push(`${base} 我们很乐意为您服务，期待您的回复！${suffix}`);
      } else if (tone === 'professional') {
        variants.push(`${base} 请告知您的需求，我们会尽快处理并给出详细方案。${suffix}`);
      } else {
        variants.push(`${base} 随时联系～${suffix}`);
      }
    }
  }

  return variants;
}

export async function optimizeMessage(content: string, tone: 'friendly' | 'professional' | 'casual' = 'friendly') {
  await new Promise((r) => setTimeout(r, 600));

  if (!content || content.trim().length === 0) {
    return '';
  }

  // 简单优化：调整礼貌层级与缩短为一段
  let optimized = content.trim();
  if (tone === 'friendly') {
    optimized = `亲爱的客户，${optimized} 如有疑问随时联系我们，祝您愉快！`;
  } else if (tone === 'professional') {
    optimized = `尊敬的客户，${optimized} 我们将尽快为您处理，感谢您的咨询。`;
  } else {
    optimized = `${optimized} 谢谢~`;
  }

  return optimized;
}

export default { generateMessage, optimizeMessage };
