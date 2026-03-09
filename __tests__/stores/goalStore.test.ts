import { getMonthlyNet } from "../../stores/goalStore";

function makeRecord(type: string, amount: number, date: string) {
  return { type, amount, date };
}

describe("getMonthlyNet", () => {
  it("returns 0 for empty records", () => {
    expect(getMonthlyNet([], 2026, 3)).toBe(0);
  });

  it("sums savings and subtracts splurges for the given month", () => {
    const records = [
      makeRecord("saving", 500, "2026-03-01"),
      makeRecord("saving", 300, "2026-03-15"),
      makeRecord("splurge", 200, "2026-03-10"),
    ];
    expect(getMonthlyNet(records, 2026, 3)).toBe(600);
  });

  it("ignores records from other months", () => {
    const records = [
      makeRecord("saving", 500, "2026-03-01"),
      makeRecord("saving", 1000, "2026-04-01"),
      makeRecord("splurge", 200, "2026-02-28"),
    ];
    expect(getMonthlyNet(records, 2026, 3)).toBe(500);
  });

  it("returns negative when splurges exceed savings", () => {
    const records = [
      makeRecord("saving", 100, "2026-03-01"),
      makeRecord("splurge", 500, "2026-03-01"),
    ];
    expect(getMonthlyNet(records, 2026, 3)).toBe(-400);
  });

  it("pads single-digit months correctly", () => {
    const records = [makeRecord("saving", 300, "2026-01-15")];
    expect(getMonthlyNet(records, 2026, 1)).toBe(300);
  });
});
