(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/admin-dashboard-controls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardPeriod",
    ()=>DashboardPeriod,
    "DashboardTableFilters",
    ()=>DashboardTableFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.mjs [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$date$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-date-picker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$fields$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-fields.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function Submit({ label, search = false }) {
    _s();
    const pending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigationPending"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "submit",
        className: "admin-button",
        disabled: pending,
        "aria-busy": pending,
        children: [
            pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ui-spinner"
            }, void 0, false, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 14,
                columnNumber: 107
            }, this) : search ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                size: 16
            }, void 0, false, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 14,
                columnNumber: 150
            }, this) : null,
            label
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin-dashboard-controls.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
_s(Submit, "iMyKezlyRa5Ba4HdA8ERnn0uwTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigationPending"]
    ];
});
_c = Submit;
function DashboardPeriod({ locale, text, value, start, end, today }) {
    _s1();
    const [period, setPeriod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationForm"], {
        action: `/${locale}/admin`,
        className: "admin-period-form",
        scroll: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-period-select",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                        size: 16
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 19,
                        columnNumber: 42
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumSelect"], {
                        "aria-label": text.period,
                        name: "period",
                        value: period,
                        onValueChange: setPeriod,
                        options: [
                            {
                                value: "7",
                                label: text.days7
                            },
                            {
                                value: "30",
                                label: text.days30
                            },
                            {
                                value: "90",
                                label: text.days90
                            },
                            {
                                value: "365",
                                label: text.year
                            },
                            {
                                value: "custom",
                                label: text.custom
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 19,
                        columnNumber: 68
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 19,
                columnNumber: 5
            }, this),
            period === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-custom-range",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$date$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumDateInput"], {
                        label: text.from,
                        name: "from",
                        defaultValue: start,
                        min: "1970-01-01",
                        max: today,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 20,
                        columnNumber: 65
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "—"
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 20,
                        columnNumber: 174
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$date$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumDateInput"], {
                        label: text.to,
                        name: "to",
                        defaultValue: end,
                        min: "1970-01-01",
                        max: today,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 20,
                        columnNumber: 188
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 20,
                columnNumber: 29
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Submit, {
                label: text.apply
            }, void 0, false, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin-dashboard-controls.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_s1(DashboardPeriod, "vsdq1Eg7+ABKb+Cp7mXSoISrmwo=");
_c1 = DashboardPeriod;
function DashboardTableFilters({ locale, text, common, q, status, period, start, end }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationForm"], {
        action: `/${locale}/admin`,
        className: "admin-table-filters",
        scroll: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "hidden",
                name: "period",
                value: period
            }, void 0, false, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 26,
                columnNumber: 5
            }, this),
            period === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "hidden",
                        name: "from",
                        value: start
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 26,
                        columnNumber: 83
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "hidden",
                        name: "to",
                        value: end
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 26,
                        columnNumber: 132
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 26,
                columnNumber: 81
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "admin-table-search",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        size: 17
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 27,
                        columnNumber: 43
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$fields$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumInput"], {
                        name: "q",
                        type: "search",
                        "aria-label": text.tableSearch,
                        placeholder: text.tableSearch,
                        defaultValue: q,
                        maxLength: 100
                    }, void 0, false, {
                        fileName: "[project]/components/admin-dashboard-controls.tsx",
                        lineNumber: 27,
                        columnNumber: 63
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 27,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumSelect"], {
                name: "status",
                "aria-label": text.status,
                defaultValue: status,
                options: [
                    {
                        value: "",
                        label: text.allStatuses
                    },
                    ...[
                        "PENDING",
                        "CONFIRMED",
                        "CANCELLED",
                        "COMPLETED",
                        "REJECTED"
                    ].map((value)=>({
                            value,
                            label: common.statuses[value]
                        }))
                ]
            }, void 0, false, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Submit, {
                label: text.search,
                search: true
            }, void 0, false, {
                fileName: "[project]/components/admin-dashboard-controls.tsx",
                lineNumber: 29,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin-dashboard-controls.tsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
_c2 = DashboardTableFilters;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Submit");
__turbopack_context__.k.register(_c1, "DashboardPeriod");
__turbopack_context__.k.register(_c2, "DashboardTableFilters");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/admin-trend-chart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminTrendChart",
    ()=>AdminTrendChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$combined$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartNoAxesCombined$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-no-axes-combined.mjs [app-client] (ecmascript) <export default as ChartNoAxesCombined>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AdminTrendChart({ locale, text, series }) {
    _s();
    const [metric, setMetric] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("bookings"), [hover, setHover] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), label = metric === "bookings" ? text.bookingsTab : text.revenueTab;
    const max = Math.max(...series.map((row)=>row[metric]), 1), total = series.reduce((sum, row)=>sum + row[metric], 0);
    const points = series.map((row, index)=>({
            x: series.length === 1 ? 390 : 50 + index / (series.length - 1) * 680,
            y: 190 - row[metric] / max * 145
        }));
    const line = points.map((point)=>`${point.x},${point.y}`).join(" ");
    const dateLabel = (day)=>`${day.slice(8, 10)}.${day.slice(5, 7)}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "admin-panel admin-trend-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-panel-heading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: text.chartTitle
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 16,
                                columnNumber: 47
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: text.chartDescription
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 16,
                                columnNumber: 73
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 16,
                        columnNumber: 42
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-chart-tabs",
                        role: "group",
                        "aria-label": text.chartTitle,
                        children: [
                            "bookings",
                            "revenue"
                        ].map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-pressed": metric === value,
                                onClick: ()=>{
                                    setMetric(value);
                                    setHover(null);
                                },
                                children: value === "bookings" ? text.bookingsTab : text.revenueTab
                            }, value, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 16,
                                columnNumber: 234
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 16,
                        columnNumber: 109
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-trend-chart.tsx",
                lineNumber: 16,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-chart-summary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: [
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(total, locale, {
                                maximumFractionDigits: metric === "revenue" ? 2 : 0
                            }),
                            metric === "revenue" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: " KGS"
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 17,
                                columnNumber: 161
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 17,
                        columnNumber: 42
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: text.selectedPeriod
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 17,
                        columnNumber: 190
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-trend-chart.tsx",
                lineNumber: 17,
                columnNumber: 5
            }, this),
            total === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-chart-empty",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$combined$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartNoAxesCombined$3e$__["ChartNoAxesCombined"], {
                        size: 32
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 18,
                        columnNumber: 55
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: text.chartEmpty
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 18,
                        columnNumber: 88
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: text.chartEmptyDescription
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 18,
                        columnNumber: 122
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-empty-grid",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 18,
                        columnNumber: 157
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-trend-chart.tsx",
                lineNumber: 18,
                columnNumber: 20
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-chart-plot",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 760 240",
                        role: "img",
                        "aria-label": label,
                        onMouseLeave: ()=>setHover(null),
                        onMouseMove: (event)=>{
                            const bounds = event.currentTarget.getBoundingClientRect();
                            const x = (event.clientX - bounds.left) / bounds.width * 760;
                            setHover(Math.min(series.length - 1, Math.max(0, Math.round((x - 50) / 680 * (series.length - 1)))));
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 20,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("desc", {
                                children: [
                                    series[0]?.day,
                                    " — ",
                                    series.at(-1)?.day
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 20,
                                columnNumber: 31
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                    id: id,
                                    x1: "0",
                                    y1: "0",
                                    x2: "0",
                                    y2: "1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "0%",
                                            stopColor: "#DCC9A3",
                                            stopOpacity: ".20"
                                        }, void 0, false, {
                                            fileName: "[project]/components/admin-trend-chart.tsx",
                                            lineNumber: 20,
                                            columnNumber: 141
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "100%",
                                            stopColor: "#DCC9A3",
                                            stopOpacity: "0"
                                        }, void 0, false, {
                                            fileName: "[project]/components/admin-trend-chart.tsx",
                                            lineNumber: 20,
                                            columnNumber: 199
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                    lineNumber: 20,
                                    columnNumber: 89
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 20,
                                columnNumber: 83
                            }, this),
                            [
                                0,
                                1,
                                2,
                                3
                            ].map((tick)=>{
                                const y = 190 - tick / 3 * 145;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "50",
                                            x2: "730",
                                            y1: y,
                                            y2: y,
                                            stroke: "rgba(255,255,255,.07)",
                                            strokeDasharray: "4 5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/admin-trend-chart.tsx",
                                            lineNumber: 21,
                                            columnNumber: 90
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                            x: "40",
                                            y: y + 4,
                                            textAnchor: "end",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(max * tick / 3, locale, {
                                                maximumFractionDigits: 0,
                                                notation: "compact"
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/admin-trend-chart.tsx",
                                            lineNumber: 21,
                                            columnNumber: 182
                                        }, this)
                                    ]
                                }, tick, true, {
                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                    lineNumber: 21,
                                    columnNumber: 76
                                }, this);
                            }),
                            series.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                points: `50,190 ${line} 730,190`,
                                fill: `url(#${id})`
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 22,
                                columnNumber: 31
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                points: line,
                                fill: "none",
                                stroke: "#DCC9A3",
                                strokeWidth: "2.5",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 22,
                                columnNumber: 98
                            }, this),
                            series.length === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: points[0].x,
                                cy: points[0].y,
                                r: "4",
                                fill: "#DCC9A3"
                            }, void 0, false, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 23,
                                columnNumber: 33
                            }, this),
                            [
                                0,
                                Math.floor((series.length - 1) / 2),
                                series.length - 1
                            ].filter((value, index, values)=>values.indexOf(value) === index).map((index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: points[index].x,
                                    y: "224",
                                    textAnchor: "middle",
                                    children: dateLabel(series[index].day)
                                }, index, false, {
                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                    lineNumber: 24,
                                    columnNumber: 149
                                }, this)),
                            hover !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: points[hover].x,
                                        x2: points[hover].x,
                                        y1: "35",
                                        y2: "190",
                                        stroke: "#DCC9A3",
                                        strokeDasharray: "3 4",
                                        opacity: ".5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin-trend-chart.tsx",
                                        lineNumber: 25,
                                        columnNumber: 31
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: points[hover].x,
                                        cy: points[hover].y,
                                        r: "4",
                                        fill: "#DCC9A3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin-trend-chart.tsx",
                                        lineNumber: 25,
                                        columnNumber: 150
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin-trend-chart.tsx",
                                lineNumber: 25,
                                columnNumber: 28
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 19,
                        columnNumber: 7
                    }, this),
                    hover !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "admin-chart-tooltip",
                        children: [
                            series[hover].day,
                            " · ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(series[hover][metric], locale),
                            metric === "revenue" ? " KGS" : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 27,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-trend-chart.tsx",
                lineNumber: 18,
                columnNumber: 221
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "admin-chart-data",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: text.chartTable
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 29,
                        columnNumber: 43
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-table-scroll",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
                                    className: "sr-only",
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                    lineNumber: 29,
                                    columnNumber: 122
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: text.date
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin-trend-chart.tsx",
                                                lineNumber: 29,
                                                columnNumber: 179
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: text.bookingsTab
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin-trend-chart.tsx",
                                                lineNumber: 29,
                                                columnNumber: 199
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: text.revenueTab
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin-trend-chart.tsx",
                                                lineNumber: 29,
                                                columnNumber: 226
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin-trend-chart.tsx",
                                        lineNumber: 29,
                                        columnNumber: 175
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                    lineNumber: 29,
                                    columnNumber: 168
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: series.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: row.day
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                                    lineNumber: 29,
                                                    columnNumber: 309
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(row.bookings, locale)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                                    lineNumber: 29,
                                                    columnNumber: 327
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(row.revenue, locale)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                                    lineNumber: 29,
                                                    columnNumber: 372
                                                }, this)
                                            ]
                                        }, row.day, true, {
                                            fileName: "[project]/components/admin-trend-chart.tsx",
                                            lineNumber: 29,
                                            columnNumber: 291
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/admin-trend-chart.tsx",
                                    lineNumber: 29,
                                    columnNumber: 265
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/admin-trend-chart.tsx",
                            lineNumber: 29,
                            columnNumber: 115
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/admin-trend-chart.tsx",
                        lineNumber: 29,
                        columnNumber: 79
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin-trend-chart.tsx",
                lineNumber: 29,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin-trend-chart.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_s(AdminTrendChart, "Knv23EktnEJbQpc21AFZzLsbLCQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = AdminTrendChart;
var _c;
__turbopack_context__.k.register(_c, "AdminTrendChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=components_0c8mchae3nrqu._.js.map