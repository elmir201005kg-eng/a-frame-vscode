import { test, expect } from "@playwright/test";
import { adminPage, adminPeriod } from "../lib/admin-period";
import { csvRow } from "../lib/csv";
import { adminDateFilter } from "../lib/admin-filters";
import { isAdminRole } from "../lib/roles";
import { addDays, isDateOnly, validStay } from "../lib/stay-dates";
import { date } from "../lib/validation";

test("admin periods use Bishkek midnight and reject invalid or unbounded ranges", () => {
  const now = new Date("2026-10-13T20:30:00Z"); // Already October 14 in Bishkek.
  const week = adminPeriod({ period: "7" }, now);
  const today = adminPeriod({ period: "1" }, now);
  expect(today.start).toBe(today.end);
  expect(today.until.getTime() - today.from.getTime()).toBe(86400000);
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

test("exports neutralize formulas and date filters reject invalid dates", () => {
  expect(csvRow(['=SUM(1,2)', '  +CMD', '@test', 'a"b', null])).toBe('"\'=SUM(1,2)","\'  +CMD","\'@test","a""b",""\r\n');
  expect(adminDateFilter({ from: "2026-02-30" }).invalid).toBe(true);
  expect(adminDateFilter({ from: "2026-10-15", to: "2026-10-14" }).invalid).toBe(true);
  expect(adminDateFilter({ from: "2026-10-15", to: "2026-10-15" }).where?.gte?.toISOString()).toBe("2026-10-14T18:00:00.000Z");
  for (const role of ["ADMIN", "SUPER_ADMIN"]) expect(isAdminRole(role)).toBe(true);
  for (const role of ["USER", "OWNER", undefined, "admin"]) expect(isAdminRole(role)).toBe(false);
});

test("date boundaries reject unsupported years and keep valid late-year stays", () => {
  expect(isDateOnly("0000-01-01")).toBe(false);
  expect(() => date("0000-01-01")).toThrow("invalidDates");
  for (const [value, count] of [["9999-12-31", 1], ["0001-01-01", -1], ["2026-10-22", Infinity]] as const)
    expect(addDays(value, count)).toBe("");
  expect(adminDateFilter({ to: "9999-12-31" }).invalid).toBe(true);
  expect(adminDateFilter({ from: "0000-01-01" }).invalid).toBe(true);
  expect(validStay("9999-12-30", "9999-12-31", "2026-10-22")).toBe(true);
});
