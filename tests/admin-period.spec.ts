import { test, expect } from "@playwright/test";
import { adminPage, adminPeriod } from "../lib/admin-period";

test("admin periods use Bishkek midnight and reject invalid or unbounded ranges", () => {
  const now = new Date("2026-10-13T20:30:00Z"); // Already October 14 in Bishkek.
  const week = adminPeriod({ period: "7" }, now);
  expect(week.today).toBe("2026-10-14");
  expect(week.start).toBe("2026-10-08");
  expect(week.from.toISOString()).toBe("2026-10-07T18:00:00.000Z");
  expect(week.until.toISOString()).toBe("2026-10-14T18:00:00.000Z");
  const custom = adminPeriod({ period: "custom", from: "2026-10-14", to: "2026-10-14" }, now);
  expect(custom.invalid).toBe(false);
  expect(custom.until.getTime() - custom.from.getTime()).toBe(86400000);
  for (const query of [
    { period: "custom", from: "2026-02-30", to: "2026-03-02" },
    { period: "custom", from: "2026-10-10", to: "2026-10-09" },
    { period: "custom", from: "2026-10-14", to: "2026-10-15" },
    { period: "custom", from: "2020-01-01", to: "2026-10-14" },
  ]) expect(adminPeriod(query, now).invalid).toBe(true);
  expect(adminPeriod({ period: "injection" }, now).period).toBe("30");
  for (const page of ["-1", "0", "1.1", "Infinity", "100001", "1e99"]) expect(adminPage({ page })).toBe(1);
});
