import { describe, expect, it } from "vitest";
import {
  normalizeCategories,
  normalizeSummaryReport,
  normalizeTransactionsResponse,
} from "./normalizers";

describe("normalizers", () => {
  it("returns categories from different collection formats", () => {
    expect(normalizeCategories([{ id: "1", name: "Salary", type: "income" }])).toHaveLength(1);
    expect(
      normalizeCategories({
        items: [{ id: "1", name: "Salary", type: "income" }],
      }),
    ).toHaveLength(1);
  });

  it("maps summary report from legacy backend fields", () => {
    expect(
      normalizeSummaryReport({
        totalBalance: 1000,
        income: 1500,
        expense: 500,
        wallets: [{ id: "1", name: "Main", type: "bank", balance: 1000 }],
      }),
    ).toEqual({
      totalBalance: 1000,
      totalIncome: 1500,
      totalExpense: 500,
      net: 1000,
      wallets: [{ id: "1", name: "Main", type: "bank", balance: 1000 }],
    });
  });

  it("keeps transactions page safe when payload is missing", () => {
    expect(normalizeTransactionsResponse(undefined)).toEqual({
      items: [],
      page: 1,
      pageSize: 10,
    });
  });
});
