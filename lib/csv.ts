/** Quote every cell and neutralize spreadsheet formulas in untrusted text. */
export function csvCell(value: unknown) {
  let text = value == null ? "" : String(value);
  if (/^[\s\uFEFF]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export const csvRow = (values: unknown[]) => values.map(csvCell).join(",") + "\r\n";
