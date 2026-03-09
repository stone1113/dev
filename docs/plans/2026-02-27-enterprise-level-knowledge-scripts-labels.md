# 知识库/话术库/AI标签 企业级拆分 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将知识库、话术库、AI标签从"AI配置"子菜单拆出，作为独立的企业级菜单分组，明确这三个功能是组织级别而非 AI 员工级别。

**Architecture:** 侧边栏新增"企业知识库"菜单分组，包含知识库、话术库、AI标签三个子项。从"AI配置"分组中移除这三项，AI配置仅保留 AI 员工设置和 AI 功能使用情况。同步清理 `isAiSection` 判断逻辑和标题栏映射。

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Zustand

---

## 当前状态

### 侧边栏菜单结构（现状）
```
激活码管理
客户管理 ▸ 客户列表
平台工单 ▸ 工单列表
组织架构 ▸ 成员管理 / 组织设置
内控管理 ▸ 聊天记录 / 内控报表
AI配置   ▸ AI员工设置 / AI功能使用情况 / 知识库配置 / 话术库配置 / AI标签配置  ← 问题所在
数据统计 / 安全设置 / 系统设置
```

### 目标结构
```
激活码管理
客户管理   ▸ 客户列表
平台工单   ▸ 工单列表
组织架构   ▸ 成员管理 / 组织设置
内控管理   ▸ 聊天记录 / 内控报表
AI配置     ▸ AI员工设置 / AI功能使用情况          ← 仅保留员工相关
企业知识库 ▸ 知识库管理 / 话术库管理 / AI标签管理  ← 新增企业级分组
数据统计 / 安全设置 / 系统设置
```

### 涉及文件
- **修改:** `src/components/AdminLayout.tsx` — 菜单数组、侧边栏渲染、isAiSection 逻辑、标题栏映射

### 不涉及的文件（无需改动）
- `src/store/useStore.ts` — 数据模型已经是企业级，无 employeeId 字段
- `src/components/KnowledgeBasePage.tsx` — 组件无 props，独立运行
- `src/components/AILabelsPage.tsx` — 组件无 props，独立运行
- `src/types/index.ts` — 类型定义无需变更

---
