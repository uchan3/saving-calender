import { QuickPreset } from "../types/record";

export const DEFAULT_QUICK_PRESETS: QuickPreset[] = [
  {
    id: "coffee",
    emoji: "☕",
    label: "Skipped coffee",
    type: "saving",
    amount: 300,
    order: 0,
  },
  {
    id: "cook",
    emoji: "🍱",
    label: "Cooked at home",
    type: "saving",
    amount: 500,
    order: 1,
  },
  {
    id: "taxi",
    emoji: "🚕",
    label: "Skipped taxi",
    type: "saving",
    amount: 1500,
    order: 2,
  },
  {
    id: "drink",
    emoji: "🍺",
    label: "Skipped drinks",
    type: "saving",
    amount: 150,
    order: 3,
  },
  {
    id: "shopping",
    emoji: "🛒",
    label: "Skipped shopping",
    type: "saving",
    amount: 500,
    order: 4,
  },
];
