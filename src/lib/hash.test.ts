import { describe, expect, it } from "vitest";

import { hashIp } from "@/lib/hash";

describe("hashIp", () => {
  it("returns null for null input", () => {
    expect(hashIp(null)).toBeNull();
  });

  it("is deterministic for the same input", () => {
    expect(hashIp("203.0.113.1")).toBe(hashIp("203.0.113.1"));
  });

  it("produces different hashes for different IPs", () => {
    expect(hashIp("203.0.113.1")).not.toBe(hashIp("203.0.113.2"));
  });

  it("never returns the raw IP", () => {
    const hashed = hashIp("203.0.113.1");
    expect(hashed).not.toBe("203.0.113.1");
    expect(hashed).toMatch(/^[a-f0-9]{64}$/);
  });
});
