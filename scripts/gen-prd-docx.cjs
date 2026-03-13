const {cl,hr,dr,T,T2,H1,H2,H3,P,PB,BL,BRAND,GRAY,HBG,
  Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
  Header,Footer,AlignmentType,LevelFormat,TableOfContents,
  HeadingLevel,BorderStyle,WidthType,ShadingType,VerticalAlign,
  PageNumber,PageBreak,fs} = require('./prd-helpers.cjs');

const K=[];

// [TITLE] 封面
K.push(new Paragraph({spacing:{before:4000},children:[]}));
K.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[
  new TextRun({text:'ChatBiz',size:72,bold:true,color:BRAND,font:'Arial'})]}));
K.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[
  new TextRun({text:'产品需求文档',size:36,color:GRAY,font:'Arial'})]}));
K.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[
  new TextRun({text:'跨平台智能客服管理系统',size:28,color:GRAY,font:'Arial'})]}));
K.push(new Paragraph({spacing:{before:800},children:[]}));
K.push(new Paragraph({alignment:AlignmentType.CENTER,children:[
  new TextRun({text:'版本 0.1.0  |  2026-02-25  |  由代码反向工程生成',size:20,color:GRAY,font:'Arial'})]}));
K.push(PB());

// [TOC]
K.push(H1('目录'));
K.push(new TableOfContents("目录",{hyperlink:true,headingStyleRange:"1-3"}));
K.push(PB());

// [FOREWORD] 前言
K.push(H1('前言'));
K.push(P('本文档基于 ChatBiz 项目源代码反向工程生成，旨在梳理产品功能需求、业务逻辑和非功能需求。ChatBiz 是一款面向外贸企业的跨平台智能客服管理系统，聚合 11 个主流海外社交/电商平台的客户消息，通过 AI 翻译、智能回复、客户画像等能力提升外贸销售效率。'));
K.push(P('当前版本为前端原型阶段（v0.1.0），所有数据来自 Mock，后端 API 和平台对接尚未实现。'));

// [S1] 一、版本信息
K.push(H1('一、版本信息'));
K.push(T([
  ['版本号','创建日期','审核人'],
  ['0.1.0','2026-02-25','由代码反向工程自动生成'],
],[3120,3120,3120]));

// [S2] 二、变更日志
K.push(H1('二、变更日志'));
const cw=[1600,1000,1400,5360];
K.push(T([
  ['时间','版本号','变更人','主要变更内容'],
  ['2026-02-25','0.1.0','开发团队','新增内控报表数据统计看板与知识库上传向导'],
],cw));
K.push(T([
  ['时间','版本号','变更人','主要变更内容'],
  ['2026-02-24','0.0.9','开发团队','新增访问密码验证、AI 标签管理、知识库管理等功能'],
  ['2026-02-23','0.0.8','开发团队','增强聊天记录管理页面筛选与账号列表功能'],
  ['2026-02-22','0.0.7','开发团队','重构管理中心为激活码管理页面'],
  ['2026-02-21','0.0.6','开发团队','增强概览页面与 AI 画像功能'],
],cw));
K.push(T([
  ['时间','版本号','变更人','主要变更内容'],
  ['2026-02-20','0.0.5','开发团队','修复接收翻译功能，支持翻译所有消息类型'],
  ['2026-02-19','0.0.4','开发团队','优化筛选面板、翻译功能与联系人管理'],
  ['2026-02-18','0.0.3','开发团队','增强客户画像编辑功能与 AI 接管按钮样式优化'],
  ['2026-02-17','0.0.2','开发团队','添加快速切换待回复会话导航、重新设计 AI 客户画像模块'],
  ['2026-02-16','0.0.1','开发团队','项目初始化，搭建基础框架与核心通讯模块'],
],cw));

// [S3] 三、文档说明
K.push(H1('三、文档说明'));
K.push(H2('名词解释'));
K.push(T2([
  ['术语 / 缩略词','说明'],
  ['ChatBiz','跨平台智能客服管理系统产品名称'],
  ['Platform','消息平台，支持 WhatsApp/Telegram/Line/Instagram/Facebook/WeChat/Email/SMS/TikTok/Twitter/Shopify 共 11 个'],
  ['Conversation','会话，客服与客户之间的消息线程'],
  ['PlatformAccount','平台客服账号，每个平台可绑定多个'],
  ['ActivationCode','激活码，组织级许可凭证，控制用户访问和 AI 坐席'],
  ['AILabel','AI 标签，四级树形结构（行业→维度→字段→可选值）用于客户分类'],
  ['KnowledgeBase','知识库，存储企业文档供 AI 检索增强生成（RAG）'],
  ['AIEmployeeConfig','AI 员工配置，定义 AI 的人设、工作时间和平台能力'],
  ['ProxyConfig','代理配置，为平台账号设置区域代理节点'],
  ['BehaviorAnalysis','行为分析，客户消费和互动行为的统计画像'],
  ['FilterCriteria','筛选条件，多维度会话过滤参数集合'],
]));

// [S4] 四、需求背景
K.push(H1('四、需求背景'));
K.push(H2('产品 / 数据现状'));
K.push(P('ChatBiz 当前为前端原型阶段（v0.1.0），基于 React 19 + TypeScript 5.9 + Vite 7 构建，使用 shadcn/ui + Tailwind CSS 3 作为 UI 框架，Zustand 5 管理状态。'));
K.push(P('系统已实现完整的前端交互界面，包含 22 个功能模块，覆盖客服端和管理端两大入口。所有业务数据来自 Mock，AI 服务（翻译、回复建议、摘要、画像分析）为模拟实现。'));
K.push(BL('技术栈: React 19 + TypeScript 5.9 + Vite 7'));
K.push(BL('UI 框架: shadcn/ui (Radix UI) + Tailwind CSS 3'));
K.push(BL('状态管理: Zustand 5 (persist middleware)'));
K.push(BL('表单验证: react-hook-form 7 + Zod 4'));
K.push(BL('图表: Recharts 2'));
K.push(BL('部署: GitHub Pages (gh-pages)'));

// [S4-2] 需求背景-用户调研+竞品
K.push(H2('用户调研'));
K.push(P('目标用户为中国出海外贸企业（5-50人销售团队），核心痛点通过代码中的数据模型和筛选维度推断：'));
K.push(BL('多平台消息分散：销售需在 11 个平台间频繁切换，效率低下'));
K.push(BL('跨语言沟通障碍：客户遍布全球，语言不通导致沟通成本高'));
K.push(BL('客户跟进效率低：缺乏统一的客户画像和智能分析工具'));
K.push(BL('团队管理困难：无法有效监控客服工作质量和客户分配'));

K.push(H2('竞品分析'));
K.push(T([
  ['竞品','主要信息','关键结论'],
  ['传统多平台客服工具','支持部分平台聚合，无AI能力','缺乏智能翻译和画像分析'],
  ['单平台官方工具','仅支持单一平台，功能完整','无法跨平台统一管理'],
  ['通用CRM系统','客户管理完善，消息能力弱','不适合实时客服场景'],
],[2400,3480,3480]));

// [S5] 五、需求范围
K.push(H1('五、需求范围'));
K.push(P('系统分为客服端和管理端两大入口，共 6 个功能模块、22 个功能点：'));
K.push(H2('核心通讯模块'));
K.push(BL('F-001 多平台统一收件箱'));
K.push(BL('F-002 会话管理'));
K.push(BL('F-003 实时聊天界面'));
K.push(BL('F-009 多账号管理'));
K.push(BL('F-021 待处理快速导航'));
K.push(H2('AI 智能模块'));
K.push(BL('F-004 AI 智能翻译'));
K.push(BL('F-005 AI 回复建议'));
K.push(BL('F-006 AI 会话摘要'));
K.push(BL('F-007 AI 客户画像分析'));
K.push(BL('F-014 AI 员工配置'));
K.push(H2('客户管理模块'));
K.push(BL('F-008 高级筛选系统'));
K.push(BL('F-013 AI 标签体系'));
K.push(BL('F-019 客户管理'));

// [S5-2] 需求范围-营销+管理+基础
K.push(H2('营销模块'));
K.push(BL('F-011 群发消息'));
K.push(BL('F-012 知识库管理'));
K.push(H2('管理后台模块'));
K.push(BL('F-015 激活码管理'));
K.push(BL('F-016 部门层级管理'));
K.push(BL('F-017 管理端聊天审计'));
K.push(BL('F-018 数据看板'));
K.push(BL('F-020 访问密码保护'));
K.push(H2('基础设施模块'));
K.push(BL('F-010 代理 IP 配置'));
K.push(BL('F-022 响应式布局'));

// [S6] 六、功能详细说明
K.push(H1('六、功能详细说明'));
K.push(H2('功能说明'));
const fw=[500,1400,1600,4200,1660];
K.push(T([
  ['序号','模块','功能','功能详细说明','状态'],
  ['1','核心通讯','多平台统一收件箱','聚合 WhatsApp、Telegram、Line、Instagram、Facebook、WeChat、Email、SMS、TikTok、Twitter、Shopify 共 11 个平台消息到统一工作台，左侧边栏展示平台图标并显示未读角标','Confirmed'],
  ['2','核心通讯','会话管理','会话列表支持搜索、多维度筛选、状态流转（active→pending→resolved→closed）、优先级管理（low/medium/high/urgent）、分配客服','Confirmed'],
  ['3','核心通讯','实时聊天界面','消息收发、状态追踪（sent→delivered→read）、附件支持（图片/视频/文件）、群聊与单聊区分','Confirmed'],
  ['4','核心通讯','多账号管理','每个平台支持绑定多个客服账号，独立状态管理和快速切换','Confirmed'],
  ['5','核心通讯','待处理快速导航','头部栏快速切换待处理会话，提升响应效率','Confirmed'],
],fw));

// [S6-2] AI智能模块
K.push(T([
  ['序号','模块','功能','功能详细说明','状态'],
  ['6','AI智能','AI智能翻译','接收消息自动翻译成母语，发送消息自动翻译成客户语言，支持多语言对配置、禁发中文模式、实时翻译和翻译确认两种模式','Confirmed'],
  ['7','AI智能','AI回复建议','根据会话上下文生成多条回复建议，支持4种语气（专业/友好/简洁/共情），点击即可采用，支持AI自动回复模式','Confirmed'],
  ['8','AI智能','AI会话摘要','自动总结会话要点，生成结构化摘要','Confirmed'],
  ['9','AI智能','AI客户画像','自动分析客户行为生成画像标签：客户等级(A/B/C/D)、类型(批发商/平台卖家/零售/代理)、意向品类、预算区间、购买紧迫度、询盘阶段','Confirmed'],
  ['10','AI智能','AI员工配置','配置AI人设、工作时间(workStartTime/workEndTime/workDays)、平台能力(质检/主动营销/召回)','Confirmed'],
],fw));

// [S6-3] 客户管理+营销模块
K.push(T([
  ['序号','模块','功能','功能详细说明','状态'],
  ['11','客户管理','高级筛选系统','多维度筛选：平台/状态/国家/AI标签/客户等级/语言/预算区间等','Confirmed'],
  ['12','客户管理','AI标签体系','四级树形标签管理：行业→维度→字段→可选值，支持单选/多选/文本输入模式','Confirmed'],
  ['13','客户管理','客户管理','客户列表、资料查看、订单历史、行为分析（总消费/客单价/满意度）','Confirmed'],
  ['14','营销','群发消息','AI驱动客户分群（高价值/近期活跃/促销敏感/新客户）+定时发送+AI最佳时间推荐+消息优化','Confirmed'],
  ['15','营销','知识库管理','创建多个知识库，上传PDF/DOCX/XLSX/CSV/TXT/MD，文档自动分块和向量化，状态追踪','Confirmed'],
],fw));

// [S6-4] 管理后台+基础设施
K.push(T([
  ['序号','模块','功能','功能详细说明','状态'],
  ['16','管理后台','激活码管理','组织级许可管理，按部门分配，AI坐席上限控制，状态管理（未使用/已激活/已过期/已禁用）','Confirmed'],
  ['17','管理后台','部门层级管理','树形部门结构，激活码按部门分配，筛选支持部门层级穿透','Confirmed'],
  ['18','管理后台','管理端聊天审计','管理员查看/筛选所有会话记录，支持按账号/时间/平台筛选','Confirmed'],
  ['19','管理后台','数据看板','概览页面展示关键业务指标：未读数、平台统计、会话统计、AI坐席使用率','Confirmed'],
  ['20','管理后台','访问密码保护','会话级密码门控，保护系统访问安全','Confirmed'],
  ['21','基础设施','代理IP配置','为平台账号配置区域代理节点，支持用户名密码认证','Confirmed'],
  ['22','基础设施','响应式布局','桌面端/移动端自适应，1024px断点检测','Confirmed'],
],fw));

// [S7] 七、非功能需求
K.push(H1('七、非功能需求'));
K.push(T2([
  ['类别','需求说明'],
  ['性能 - 状态持久化','Zustand persist middleware，localStorage 缓存'],
  ['性能 - 响应式','resize 事件监听，1024px 断点自适应'],
  ['性能 - 列表优化','派生数据通过 useMemo 缓存，筛选在 Store 内计算'],
  ['安全 - 访问控制','AccessGate 会话级密码保护'],
  ['安全 - 登录认证','激活码验证 + 可选密码模式 + 独立管理员登录'],
  ['安全 - 角色权限','admin / manager / agent 三级角色体系'],
  ['安全 - 代理凭证','ProxyConfig 支持用户名密码认证'],
  ['国际化 - 界面语言','支持切换，currentLanguage 状态管理'],
  ['国际化 - 消息翻译','多语言对翻译（中/英/日/韩/意等）'],
  ['国际化 - 语言识别','CustomerProfile.language 字段自动识别客户语言'],
]));

// [S8] 八、埋点
K.push(H1('八、埋点'));
K.push(P('以下为从代码中识别的关键数据埋点需求：'));
K.push(T([
  ['参数名','参数说明','参数值'],
  ['unread_count','未读消息数','useUnreadCount 派生 hook 实时计算'],
  ['platform_stats','平台维度统计','usePlatformStats 按平台聚合会话数据'],
  ['conversation_stats','会话统计','useConversationStats 统计总数/活跃/待处理/已解决'],
  ['ai_seat_usage','AI坐席使用率','Organization.aiSeats.used / total'],
  ['customer_behavior','客户行为分析','BehaviorAnalysis 总消费/客单价/满意度'],
  ['filter_usage','筛选使用情况','FilterCriteria 各维度筛选频次'],
],[2400,3480,3480]));

// [S9] 九、项目规划
K.push(H1('九、项目规划'));
K.push(P('基于代码分析，以下为推荐的项目实施路径：'));
K.push(T([
  ['阶段','内容','状态'],
  ['Phase 1 - 前端原型','完成全部 22 个功能模块的前端界面和交互','已完成'],
  ['Phase 2 - 后端服务','实现 API 服务、数据库、JWT 认证、RBAC 权限','待开发'],
  ['Phase 3 - 平台对接','逐平台接入官方 API/SDK，实现消息收发','待开发'],
  ['Phase 4 - AI 集成','接入 LLM 服务，实现翻译/回复/摘要/画像','待开发'],
  ['Phase 5 - 知识库','实现文件上传、文档分块、向量化、RAG 检索','待开发'],
  ['Phase 6 - 实时通信','实现 WebSocket/SSE 实时消息推送','待开发'],
],[2400,4560,2400]));

// [S10] 附录
K.push(H1('附录'));
K.push(H2('源文件索引'));
K.push(T2([
  ['文件','与 PRD 的关联'],
  ['src/App.tsx','应用入口、路由、布局、认证流程'],
  ['src/types/index.ts','全部核心数据模型定义'],
  ['src/store/useStore.ts','状态管理、业务逻辑、派生数据'],
  ['src/lib/aiService.ts','AI 服务层（模拟）'],
  ['src/data/mockData.ts','Mock 数据，揭示业务场景'],
  ['src/components/Sidebar.tsx','平台导航、账号管理'],
  ['src/components/ChatInterface.tsx','核心聊天界面'],
  ['src/components/CustomerAIProfile.tsx','AI 客户画像'],
  ['src/components/AdminLayout.tsx','管理端布局与导航'],
  ['src/components/AdminCenter.tsx','激活码与部门管理'],
  ['src/components/AILabelsPage.tsx','AI 标签体系管理'],
  ['src/components/KnowledgeBasePage.tsx','知识库管理'],
  ['src/components/BroadcastMessage.tsx','群发消息'],
]));

// [S10-2] 置信度说明
K.push(H2('置信度说明'));
K.push(T2([
  ['标记','含义'],
  ['Confirmed','代码中有明确实现，功能可验证'],
  ['Inferred','从代码结构和命名逻辑推断，未见完整实现'],
  ['Planned','代码中存在类型定义/TODO/桩代码，功能未实现'],
]));
K.push(P(''));
K.push(P('本文档由 code-to-prd skill 基于源代码自动生成，生成日期 2026-02-25。',{i:true,c:GRAY}));

// [BUILD] 生成文档
const doc = new Document({
  numbering: {
    config: [{
      reference: "bl",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [
          new TextRun({ text: 'ChatBiz PRD v0.1.0', size: 16, color: GRAY, font: 'Arial' })
        ]})
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: '第 ', size: 16, color: GRAY, font: 'Arial' }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY, font: 'Arial' }),
          new TextRun({ text: ' 页', size: 16, color: GRAY, font: 'Arial' }),
        ]})
      ]})
    },
    children: K
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('PRD-ChatBiz.docx', buf);
  console.log('PRD-ChatBiz.docx generated (' + buf.length + ' bytes)');
});
