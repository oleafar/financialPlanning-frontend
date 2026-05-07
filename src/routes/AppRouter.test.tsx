import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { AppRouter } from "./AppRouter";
import { renderWithProviders } from "../__tests__/test-utils";

vi.mock("@ant-design/plots", () => ({
  Pie: () => <div data-testid="pie-chart" />,
}));

describe("AppRouter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("redirects unauthenticated users to login", () => {
    renderWithProviders(<AppRouter />, { route: "/dashboard" });

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("renders the dashboard for authenticated users", async () => {
    window.localStorage.setItem("financial-planning-token", "token");

    renderWithProviders(<AppRouter />, { route: "/dashboard" });

    expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
