# saving-calender

Track your savings streak — log what you resisted spending and watch your savings grow.

## Features

- **Savings records**: Select from item presets and log the amount you resisted spending
- **Splurge records**: Log amounts you did spend
- **Calendar view**: See daily savings/splurge/net amounts at a glance with color-coded days
- **Savings streak**: Track consecutive days of net savings

## Tech Stack

- React Native (Expo SDK 55, Expo Router)
- TypeScript (strict mode)
- AsyncStorage for local data persistence
- Supabase (auth & sync — planned)

## Setup

```bash
npm install
npm start
```

## Commands

```bash
npm start            # Start Expo dev server
npm run ios          # Start on iOS simulator
npm run android      # Start on Android emulator
npm run web          # Start on web
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm test             # Run tests
```

## Project Structure

```
app/          # Expo Router file-based routing (screens/layouts)
components/   # Reusable UI components (CalendarGrid, RecordForm, etc.)
hooks/        # Custom React hooks (useRecords)
lib/          # External service clients (Supabase)
stores/       # Data access layer (recordStore)
types/        # TypeScript type definitions
constants/    # App-wide constants (item presets, colors)
__tests__/    # Test files (mirrors source structure)
```
