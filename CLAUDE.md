# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**saving-calender** (節約カレンダー) — iOS app to track savings by recording resisted spending, visualizing it on a calendar, and maintaining savings streaks for motivation.

### Key Features

- Savings records: select from item presets and log the amount you resisted spending
- Splurge records: log amounts you did spend
- Calendar view: daily savings/splurge/net amounts
- Savings streak: consecutive days of net savings
- Auth & sync via Supabase

## Tech Stack

- **Frontend**: React Native (Expo SDK 55, Expo Router)
- **Backend / Auth / DB**: Supabase
- **Language**: TypeScript (strict mode enabled)

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Start on iOS simulator
npm run android    # Start on Android emulator
npm run web        # Start on web
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
npm run format     # Format with Prettier
npm run format:check  # Check formatting
```

## Directory Structure

```
app/          # Expo Router file-based routing (screens/layouts)
components/   # Reusable UI components
hooks/        # Custom React hooks
lib/          # External service clients (e.g., Supabase init)
stores/       # State management
types/        # TypeScript type definitions
constants/    # App-wide constants (item presets, colors, etc.)
assets/       # Images, fonts, icons
```

## Architecture

- **Routing**: Expo Router (file-based routing in `app/` directory). `app/_layout.tsx` is the root layout.
- **Supabase Client**: Initialized in `lib/supabase.ts`. Uses `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` env vars (set in `.env`, see `.env.example`).
- **Auth**: Supabase Auth with session persistence via AsyncStorage.

## Development Flow

GitHub Flow:
- `main` branch is always deployable
- Create `feature/`, `fix/`, or `chore/` branches for all work
- Submit PRs to merge back into `main`

## Coding Conventions

- TypeScript strict mode is enabled (`tsconfig.json`)
- Formatting: Prettier (config in `.prettierrc`)
- Linting: ESLint with `@typescript-eslint` and `react-hooks` plugins (config in `eslint.config.mjs`)
- Components should be small with single responsibilities
- Environment variables must use `EXPO_PUBLIC_` prefix for client-side access
