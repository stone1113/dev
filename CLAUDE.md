# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **ChatBiz** - a multi-platform customer service management system built with React + TypeScript + Vite. It provides unified conversation management across 11 messaging platforms (WhatsApp, Telegram, Line, Instagram, Facebook, WeChat, Email, SMS, TikTok, Twitter, Shopify) with AI-assisted features.

## Commands

```bash
# Development
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
npm run preview      # Preview production build

# Deployment
npm run deploy       # Build and deploy to GitHub Pages
```

## Architecture

### Tech Stack
- **Framework**: React 19 + TypeScript 5.9
- **Build**: Vite 7
- **Styling**: Tailwind CSS 3 + shadcn/ui (New York style)
- **State**: Zustand with persist middleware
- **Forms**: react-hook-form + zod validation
- **Icons**: lucide-react

### Path Aliases
Configured in `vite.config.ts` and `components.json`:
- `@/` → `src/`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

### Key Directories
```
src/
├── components/       # Feature components
│   └── ui/          # shadcn/ui primitives
├── store/           # Zustand store (useStore.ts)
├── types/           # TypeScript interfaces
├── data/            # Mock data (mockData.ts)
├── lib/             # Utilities (utils.ts, aiService.ts)
└── hooks/           # Custom hooks
```

### State Management
Single Zustand store in [src/store/useStore.ts](src/store/useStore.ts) manages:
- **Organization & User**: Settings, preferences, login mode
- **Platforms**: Multi-platform account management with proxy configs
- **Conversations**: Messages, filtering, search
- **AI Features**: Translation, reply suggestions, summarization
- **UI State**: Sidebar, panels, language

Derived hooks: `useUnreadCount`, `usePlatformStats`, `useConversationStats`

### Type System
Core types in [src/types/index.ts](src/types/index.ts):
- `Platform` - 11 supported messaging platforms
- `Conversation`, `Message`, `CustomerProfile` - Core data models
- `FilterCriteria` - Advanced filtering with AI profile tags
- `PlatformAccount`, `ProxyConfig` - Multi-account management
- `UserSettings` - Translation and AI preferences

### Main Application Flow
[src/App.tsx](src/App.tsx) handles:
1. Authentication (LoginPage → AdminLoginPage → AdminCenter)
2. Main layout with Sidebar navigation
3. Section routing: Dashboard, Conversations, Customers, Analytics, Settings
4. Right panel system (AI Profile, Proxy, Translation, Contacts)

### UI Components
- shadcn/ui components in `src/components/ui/` - use `cn()` from `@/lib/utils` for class merging
- Feature components directly in `src/components/`
- Primary brand color: `#FF6B35` (orange)

## Deployment
GitHub Actions workflow deploys to GitHub Pages on push to `main`. See `.github/workflows/deploy.yml`.
