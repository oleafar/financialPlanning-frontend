import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats values as BRL currency", () => {
    expect(formatCurrency(1234.5)).toBe("R$ 1.234,50");
  });
});
