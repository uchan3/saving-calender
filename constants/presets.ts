export interface PresetItem {
  label: string;
  defaultAmount: number;
}

export const SAVING_PRESETS: PresetItem[] = [
  { label: "Coffee", defaultAmount: 500 },
  { label: "Lunch out", defaultAmount: 1000 },
  { label: "Snack", defaultAmount: 300 },
  { label: "Convenience store", defaultAmount: 500 },
  { label: "Drink", defaultAmount: 150 },
  { label: "Taxi", defaultAmount: 1500 },
  { label: "Online shopping", defaultAmount: 3000 },
  { label: "Other", defaultAmount: 0 },
];

export const SPLURGE_PRESETS: PresetItem[] = [
  { label: "Coffee", defaultAmount: 500 },
  { label: "Lunch out", defaultAmount: 1000 },
  { label: "Snack", defaultAmount: 300 },
  { label: "Convenience store", defaultAmount: 500 },
  { label: "Drink", defaultAmount: 150 },
  { label: "Taxi", defaultAmount: 1500 },
  { label: "Online shopping", defaultAmount: 3000 },
  { label: "Other", defaultAmount: 0 },
];
