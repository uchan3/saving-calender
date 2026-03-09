# Saving Calendar — UI Design Proposal

## Overview

This document proposes the UI redesign for the Saving Calendar app.
The goal is to make users feel motivated to open the app every morning and quickly record their savings.

---

## 1. Home Screen Layout

```
┌─────────────────────────────────┐
│  SafeArea Top                   │
├─────────────────────────────────┤
│                                 │
│        🔥                       │
│       12                        │  ← Streak (hero element)
│    day streak                   │     Font: 72pt bold
│                                 │
├─────────────────────────────────┤
│   Today's Net                   │
│   +¥1,800                       │  ← Green if positive, red if negative
│   Saved ¥2,300  Spent ¥500      │     Font: 32pt bold
├─────────────────────────────────┤
│                                 │
│  ┌─── Goal Progress ─────────┐  │
│  │  March goal: ¥30,000       │  │  ← Goal progress bar
│  │  ████████░░░░░  ¥18,200    │  │
│  │  61%                       │  │
│  └────────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  Quick Record                   │
│  ☕ +300  🍱 +500  🍺 -150      │  ← Quick record buttons
│  🚕 +1500  🛒 -500  ➕ More    │     2 rows × 3 columns grid
│                                 │
├─────────────────────────────────┤
│         ● Home    📅 Calendar   │  ← Bottom tab navigation
└─────────────────────────────────┘
```

### Design Decisions

- **Streak as hero**: Occupies top 1/3 of screen. Number is 72pt, "day streak" label is 14pt. Background uses gradient (`#1B5E20` → `#388E3C`) for immersive feel.
- **Today's Net**: Displayed on a white card. Green for positive, red for negative with animation.
- **Quick Record**: Always visible at bottom of scrollable area. One-tap recording without modal.

---

## 2. Quick Record Button UI

### Layout & Shape

- 2 rows × 3 columns grid (last button is "➕ More" which opens the full RecordForm modal)
- Each button: rounded card (`borderRadius: 16`), approximately 100×72
- 3-line composition: icon (emoji) + label + amount

### Interaction

```
Tap → Haptic feedback (light vibration)
    → Scale animation (0.95 → 1.0)
    → Toast notification "☕ Skipped coffee +¥300 recorded!"
    → Immediate state update in records
```

- **One-tap complete**: Records with preset amount automatically. Category, amount, and date (today) are auto-filled.
- **Long press**: Shows a mini input popover to change the amount.
- **"➕ More" button**: Opens the full RecordForm modal (for Splurge records or custom input).

### Data Structure Extension

```typescript
export interface QuickPreset {
  id: string;
  emoji: string;
  label: string;
  type: RecordType; // "saving" or "splurge"
  amount: number;
  order: number; // display order
}
```

### Default Presets (5 items)

| emoji | label            | type   | amount |
| ----- | ---------------- | ------ | ------ |
| ☕    | Skipped coffee   | saving | 300    |
| 🍱    | Cooked at home   | saving | 500    |
| 🚕    | Skipped taxi     | saving | 1500   |
| 🍺    | Skipped drinks   | saving | 150    |
| 🛒    | Skipped shopping | saving | 500    |

The 6th slot is a fixed "➕ More" button.

---

## 3. Calendar View Navigation

### Recommendation: Bottom Tab Navigation (Expo Router Tabs)

**Reasons:**

- Horizontal swipe conflicts with Quick Record buttons and list scrolling
- With only 2 screens, tabs are the simplest and most intuitive pattern
- Natural implementation with Expo Router's `(tabs)` layout
- Familiar pattern for iOS users

### Routing Structure

```
app/
  (tabs)/
    _layout.tsx        ← Tab navigator
    index.tsx          ← Home screen (streak + quick record)
    calendar.tsx       ← Calendar view
  _layout.tsx          ← Root Stack (for modals)
```

### Calendar View Screen Layout

```
┌─────────────────────────────────┐
│  ◀  March 2026  ▶              │  ← Month navigation
├─────────────────────────────────┤
│  Sun Mon Tue Wed Thu Fri Sat    │
│  ┌──┬──┬──┬──┬──┬──┬──┐        │
│  │  │  │  │ 1│ 2│ 3│ 4│        │  ← Color + dot per day cell
│  │  │  │  │🟢│🟢│🔴│  │        │
│  ├──┼──┼──┼──┼──┼──┼──┤        │
│  │ ...                  │        │
│  └──┴──┴──┴──┴──┴──┴──┘        │
├─────────────────────────────────┤
│  March 3 (Tue)                  │
│  ──────────────────             │
│  Saved: ¥2,300                  │  ← Day detail on tap
│  Spent: ¥500                    │     (reuses DayDetail component)
│  Net:   +¥1,800                 │
│  ──────────────────             │
│  🟢 Saved  Coffee     ¥300     │
│  🟢 Saved  Lunch      ¥1000    │
│  🔴 Spent  Snack      ¥500     │
└─────────────────────────────────┘
```

---

## 4. Goal Amount Progress

### Option A: Linear Progress Bar (Recommended — simple, low implementation cost)

```
┌──────────────────────────────────┐
│  🎯 March Goal                   │
│  ████████████░░░░░░░  ¥18,200    │
│  ──────────────────── / ¥30,000  │
│  61% achieved                    │
└──────────────────────────────────┘
```

- Bar color: 0-30% `#F44336` (red) → 30-70% `#FF9800` (orange) → 70-100% `#4CAF50` (green)
- When exceeding 100%: bar turns gold (`#FFD700`) + 🎉 displayed

### Option B: Circle Ring (high visual impact)

```
       ╭───────╮
      ╱ ╭─────╮ ╲
     │  │ 61% │  │    ← SVG arc
     │  │¥18.2k│  │
      ╲ ╰─────╯ ╱
       ╰───────╯
    Goal: ¥30,000
```

- Rendered with `react-native-svg` `Circle` component
- Animated via stroke dasharray/dashoffset

### Option C: Daily Breakdown (effective for maintaining motivation)

```
┌──────────────────────────────────┐
│  Today: ¥1,800  │  Daily target: ¥968  │
│  ✅ Over target by ¥832!                │
│  ████████████████████░░  ¥18,200/¥30,000│
└──────────────────────────────────┘
```

**Recommendation: Start with Option A, design so it can migrate to Option B later.** Option C's daily breakdown info can be added as text to either A or B.

### Data Structure

```typescript
export interface SavingsGoal {
  id: string;
  targetAmount: number;
  period: "monthly"; // future: "weekly" | "custom"
  year: number;
  month: number;
  createdAt: string;
}
```

---

## 5. Color Palette & Typography

### Color Palette (Redesigned)

```typescript
export const COLORS = {
  // Primary - Deep green (saving = positive symbol)
  primary: "#2E7D32", // main action, header background
  primaryDark: "#1B5E20", // streak hero gradient start
  primaryLight: "#A5D6A7", // light accent

  // Saving (positive)
  saving: "#2E7D32", // saving text
  savingLight: "#E8F5E9", // saving background
  savingBadge: "#C8E6C9", // badge background

  // Splurge (negative)
  splurge: "#C62828", // splurge text
  splurgeLight: "#FFEBEE", // splurge background
  splurgeBadge: "#FFCDD2", // badge background

  // Streak
  streak: "#FF8F00", // streak number
  streakBg: "#FFF8E1", // streak badge background

  // Goal progress
  goalLow: "#F44336", // 0-30%
  goalMid: "#FF9800", // 30-70%
  goalHigh: "#4CAF50", // 70-100%
  goalComplete: "#FFD700", // 100%+

  // Neutral
  background: "#F5F5F5", // app-wide background (pure white → light gray)
  surface: "#FFFFFF", // card background
  text: "#1A1A1A", // main text
  textSecondary: "#616161", // secondary text
  textTertiary: "#9E9E9E", // hint text
  border: "#E0E0E0", // border
  divider: "#EEEEEE", // thin separator

  // Quick Record button
  quickBtnBg: "#FFFFFF", // button background
  quickBtnShadow: "#00000014", // button shadow

  // Tab bar
  tabActive: "#2E7D32",
  tabInactive: "#9E9E9E",
  tabBg: "#FFFFFF",
} as const;
```

### Typography

| Usage               | Size | Weight          | Color              | Notes                  |
| ------------------- | ---- | --------------- | ------------------ | ---------------------- |
| Streak number       | 72   | 800 (ExtraBold) | `#FFFFFF`          | Hero element           |
| Streak label        | 14   | 400             | `#FFFFFFCC`        | Semi-transparent white |
| Today's Net amount  | 32   | 700 (Bold)      | saving / splurge   | Color changes by sign  |
| Today's Net label   | 13   | 500             | textSecondary      | "Saved ¥X / Spent ¥X"  |
| Goal percentage     | 20   | 700             | goalLow/Mid/High   | Changes by progress    |
| Goal amount text    | 13   | 400             | textSecondary      | "¥18,200 / ¥30,000"    |
| Quick Record emoji  | 24   | -               | -                  |                        |
| Quick Record label  | 11   | 500             | text               | e.g. "Skipped coffee"  |
| Quick Record amount | 13   | 700             | saving / splurge   | "+¥300"                |
| Calendar day        | 14   | 400 / 700       | text               | Today is Bold          |
| Calendar weekday    | 12   | 600             | textSecondary      |                        |
| Section title       | 15   | 600             | text               | "Quick Record"         |
| Bottom tab label    | 10   | 500             | tabActive/Inactive |                        |

### Font Family

- **System default** (no `Platform.select` needed) — React Native default is sufficient
- For tabular numbers, add `fontVariant: ["tabular-nums"]`

---

## 6. Streak Recovery

When streak is broken, the streak hero area shows a recovery prompt:

```
┌─────────────────────────────────┐
│        🔥                       │
│        0                        │
│    day streak                   │
│                                 │
│   ⚡ Record yesterday's savings │  ← Taps opens RecordForm
│                                 │     with yesterday's date
└─────────────────────────────────┘
```

**Condition:** Displayed when `streak === 0` AND no records exist for yesterday.

---

## 7. Implementation Priority

1. **Expo Router Tabs** — Restructure routing (Home / Calendar)
2. **Home screen redesign** — Streak hero, Today's Net, Quick Record
3. **Quick Record feature** — One-tap recording + preset management
4. **Goal amount feature** — Goal setting + progress bar
5. **Recovery prompt** — Yesterday's record button when streak breaks
