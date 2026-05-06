import { describe, expect, it } from "vitest";
import { mapSummaryReport } from "./api";

describe("mapSummaryReport", () => {
  it("maps backend summary fields to the frontend dashboard contract", () => {
    const result = mapSummaryReport({
      totalBalance: 5000,
      income: 3000,
      expense: 1200,
      net: 1800,
      wallets: [{ id: "1", name: "Main", type: "bank", balance: 5000 }],
    });

    expect(result).toEqual({
      totalBalance: 5000,
      totalIncome: 3000,
      totalExpense: 1200,
      net: 1800,
      wallets: [{ id: "1", name: "Main", type: "bank", balance: 5000 }],
    });
  });
});
