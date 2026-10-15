"use client";
import { useId, useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { formatNumber } from "@/app/i18n/format";
import type { Locale } from "@/app/i18n/config";
import type { AdminDictionary } from "@/app/i18n/admin";

export function AdminTrendChart({ locale, text, series }: { locale: Locale; text: AdminDictionary["dashboard"]; series: { day: string; bookings: number; revenue: number }[] }) {
  const [metric, setMetric] = useState<"bookings" | "revenue">("bookings"), [hover, setHover] = useState<number | null>(null);
  const id = useId(), label = metric === "bookings" ? text.bookingsTab : text.revenueTab;
  const max = Math.max(...series.map(row => row[metric]), 1), total = series.reduce((sum, row) => sum + row[metric], 0);
  const points = series.map((row, index) => ({ x: series.length === 1 ? 390 : 50 + index / (series.length - 1) * 680, y: 190 - row[metric] / max * 145 }));
  const line = points.map(point => `${point.x},${point.y}`).join(" ");
  const dateLabel = (day: string) => `${day.slice(8, 10)}.${day.slice(5, 7)}`;
  return <section className="admin-panel admin-trend-panel">
    <div className="admin-panel-heading"><div><h2>{text.chartTitle}</h2><p>{text.chartDescription}</p></div><div className="admin-chart-tabs" role="group" aria-label={text.chartTitle}>{(["bookings", "revenue"] as const).map(value => <button key={value} type="button" aria-pressed={metric === value} onClick={() => { setMetric(value); setHover(null); }}>{value === "bookings" ? text.bookingsTab : text.revenueTab}</button>)}</div></div>
    <div className="admin-chart-summary"><strong>{formatNumber(total, locale, { maximumFractionDigits: metric === "revenue" ? 2 : 0 })}{metric === "revenue" && <small> KGS</small>}</strong><span>{text.selectedPeriod}</span></div>
    {total === 0 ? <div className="admin-chart-empty"><ChartNoAxesCombined size={32} /><strong>{text.chartEmpty}</strong><p>{text.chartEmptyDescription}</p><div className="admin-empty-grid" aria-hidden="true" /></div> : <div className="admin-chart-plot">
      <svg viewBox="0 0 760 240" role="img" aria-label={label} onMouseLeave={() => setHover(null)} onMouseMove={event => { const bounds = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width * 760; setHover(Math.min(series.length - 1, Math.max(0, Math.round((x - 50) / 680 * (series.length - 1))))); }}>
        <title>{label}</title><desc>{series[0]?.day} — {series.at(-1)?.day}</desc><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#DCC9A3" stopOpacity=".20" /><stop offset="100%" stopColor="#DCC9A3" stopOpacity="0" /></linearGradient></defs>
        {[0, 1, 2, 3].map(tick => { const y = 190 - tick / 3 * 145; return <g key={tick}><line x1="50" x2="730" y1={y} y2={y} stroke="rgba(255,255,255,.07)" strokeDasharray="4 5" /><text x="40" y={y + 4} textAnchor="end">{formatNumber(max * tick / 3, locale, { maximumFractionDigits: 0, notation: "compact" })}</text></g>; })}
        {series.length > 1 && <polygon points={`50,190 ${line} 730,190`} fill={`url(#${id})`} />}<polyline points={line} fill="none" stroke="#DCC9A3" strokeWidth="2.5" strokeLinejoin="round" />
        {series.length === 1 && <circle cx={points[0].x} cy={points[0].y} r="4" fill="#DCC9A3" />}
        {[0, Math.floor((series.length - 1) / 2), series.length - 1].filter((value, index, values) => values.indexOf(value) === index).map(index => <text key={index} x={points[index].x} y="224" textAnchor="middle">{dateLabel(series[index].day)}</text>)}
        {hover !== null && <g><line x1={points[hover].x} x2={points[hover].x} y1="35" y2="190" stroke="#DCC9A3" strokeDasharray="3 4" opacity=".5" /><circle cx={points[hover].x} cy={points[hover].y} r="4" fill="#DCC9A3" /></g>}
      </svg>
      {hover !== null && <p className="admin-chart-tooltip">{series[hover].day} · {formatNumber(series[hover][metric], locale)}{metric === "revenue" ? " KGS" : ""}</p>}
    </div>}
    <details className="admin-chart-data"><summary>{text.chartTable}</summary><div className="admin-table-scroll"><table><caption className="sr-only">{label}</caption><thead><tr><th>{text.date}</th><th>{text.bookingsTab}</th><th>{text.revenueTab}</th></tr></thead><tbody>{series.map(row => <tr key={row.day}><td>{row.day}</td><td>{formatNumber(row.bookings, locale)}</td><td>{formatNumber(row.revenue, locale)}</td></tr>)}</tbody></table></div></details>
  </section>;
}
