import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Globe, Zap, Brain, Target, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />

        <div className="container mx-auto px-6 pt-32 pb-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              洽小秘：基于指纹浏览器的
              <span className="block mt-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                全链路 AI 获客与营销系统
              </span>
            </h1>

            <div className="space-y-4 text-lg md:text-xl text-slate-300">
              <p>聚合 WhatsApp/Telegram 等 18+ 平台，内置原生环境隔离与实时翻译</p>
              <p>集成 AI 实时画像、AI 智能回复与主动营销触达，让每一次沟通更安全、更智能、更高效</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                免费下载客户端
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 px-8">
                预约 Demo 演示
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">坚实的业务基座</h2>
            <p className="text-xl text-slate-400">工欲善其事，必先利其器。我们为您提供最硬核的 SCRM 基础设施</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Multi-platform */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">多平台聚合接待</h3>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">一屏管全球</h4>
                  <p className="text-sm">告别设备堆积。一个客户端聚合 WhatsApp, Telegram, Messenger, Instagram, Line 等 18+ 主流社交平台</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">全渠道消息中心</h4>
                  <p className="text-sm">无论是哪个平台的客户，都在统一的窗口进行接待，消息零遗漏，管理零切换</p>
                </div>
              </div>
            </div>

            {/* Fingerprint Browser */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">内置指纹浏览器</h3>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">账号防弹衣</h4>
                  <p className="text-sm">无需额外购买 AdsPower 或 HubStudio。我们内置底层指纹隔离引擎，为每个账号生成独立的 IP、设备指纹与缓存环境</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">矩阵安全多开</h4>
                  <p className="text-sm">一台电脑稳定运行 100+ 营销账号，从源头彻底解决关联封号难题</p>
                </div>
              </div>
            </div>

            {/* Real-time Translation */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">实时双向翻译</h3>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">母语级沟通</h4>
                  <p className="text-sm">支持全球 200+ 语种实时互译。接收消息自动译为中文，发送消息自动译为目标语言</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">多线路校准</h4>
                  <p className="text-sm">集成 Google/DeepL/ChatGPT 等多条翻译线路，确保商务沟通的精准度与专业性</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Engine Section */}
      <section className="py-24 bg-slate-900/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">强大的 AI 增长引擎</h2>
            <p className="text-xl text-slate-400">有了安全的基座，AI 帮您把'流量'变成'留量'与'销量'</p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {/* Smart Reception */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold">智接待：AI 销售</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-orange-400">AI 实时画像</h4>
                  <p className="text-slate-300 text-sm">聊天即"识人"。AI 在对话中自动提取客户的预算、痛点、偏好，实时打上标签。销售还没开口，AI 已为您生成了客户的"底牌"</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-orange-400">AI 智能私信</h4>
                  <p className="text-slate-300 text-sm">超越生硬翻译。AI 根据上下文和企业知识库，自动生成高情商、营销导向的回复建议，一键发送，小白也能聊出销冠水准</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-orange-400">AI 沉默召回</h4>
                  <p className="text-slate-300 text-sm">盘活私域资产。AI 自动扫描"已读不回"或"久未联系"的客户，定制破冰话术自动发起撩客，让僵尸粉变回头客</p>
                </div>
              </div>
            </div>

            {/* Smart Outreach */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold">智触达：AI 主动营销</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-orange-400">精准批量触达</h4>
                  <p className="text-slate-300 text-sm">基于指纹环境的安全保护，AI 执行批量化的打招呼与新品推送任务，触达率提升 300%</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-orange-400">自动化营销流</h4>
                  <p className="text-slate-300 text-sm">设定触发条件（如：节日、生日、新注册），AI 自动执行"千人千面"的私信营销计划，7x24 小时主动出击</p>
                </div>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold">智洞察：AI 业务大脑</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-orange-400">VOC 客户原声分析</h4>
                  <p className="text-slate-300 text-sm">AI 深度分析海量聊天记录，提炼客户最关注的"痛点"与"竞品信息"，反哺话术与产品策略</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-orange-400">会话质检</h4>
                  <p className="text-slate-300 text-sm">不止看回复量，更看回复质量。AI 自动评估员工的服务态度与话术专业度，优化团队执行力</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">为什么选择洽小秘 AI？</h2>

          <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">一体化解决方案</h4>
                    <p className="text-sm text-slate-400">无需拼凑多个工具，从账号安全到 AI 营销一站式搞定</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">安全第一</h4>
                    <p className="text-sm text-slate-400">内置指纹浏览器，彻底解决账号关联封号问题</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">AI 驱动增长</h4>
                    <p className="text-sm text-slate-400">从客户画像到智能回复，AI 全程赋能销售转化</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">全球化支持</h4>
                    <p className="text-sm text-slate-400">200+ 语种实时翻译，轻松开拓国际市场</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">精准营销</h4>
                    <p className="text-sm text-slate-400">基于 AI 画像的千人千面营销，转化率提升 3 倍</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">数据驱动决策</h4>
                    <p className="text-sm text-slate-400">深度洞察客户需求，优化产品与话术策略</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              ChatKnow 洽小秘
            </h2>
            <p className="text-2xl text-slate-300">
              懂 AI，更懂成交的跨境营销专家
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 pt-4">
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">多开防封</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">实时翻译</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">AI 销售</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">主动获客</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">内容质检</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">AI 洞察</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                立即开始
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 px-8">
                联系我们
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2026 ChatKnow 洽小秘. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
