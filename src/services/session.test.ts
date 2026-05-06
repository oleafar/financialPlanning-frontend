import { afterEach, describe, expect, it } from "vitest";
import { clearToken, getToken, isAuthenticated, setToken } from "./session";

describe("session helpers", () => {
  afterEach(() => {
    clearToken();
  });

  it("stores and retrieves the token", () => {
    setToken("abc123");

    expect(getToken()).toBe("abc123");
    expect(isAuthenticated()).toBe(true);
  });

  it("clears the token", () => {
    setToken("abc123");
    clearToken();

    expect(getToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});
