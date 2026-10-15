(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/actions/data:68489d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "favoriteAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60016eb1cc6e6ed2ddbd6a199a085bbddc9e4f2ae6":{"name":"favoriteAction"}},"app/actions/traveler.ts",""] */ "use turbopack: no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60016eb1cc6e6ed2ddbd6a199a085bbddc9e4f2ae6", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "favoriteAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:88d3a6 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logoutFormAction",
    ()=>$$RSC_SERVER_ACTION_3
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"605442e436952dcbd9a9ae7abf2a334bdacfb7deec":{"name":"logoutFormAction"}},"app/actions/auth.ts",""] */ "use turbopack: no side effects";
;
const $$RSC_SERVER_ACTION_3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("605442e436952dcbd9a9ae7abf2a334bdacfb7deec", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "logoutFormAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/i18n/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultLocale",
    ()=>defaultLocale,
    "isLocale",
    ()=>isLocale,
    "localeCookie",
    ()=>localeCookie,
    "localeSettings",
    ()=>localeSettings,
    "locales",
    ()=>locales,
    "preferredLocale",
    ()=>preferredLocale
]);
const locales = [
    "kg",
    "ru",
    "en"
];
const defaultLocale = "ru";
const localeCookie = "a-frame-kg-locale";
const localeSettings = {
    kg: {
        htmlLang: "ky",
        intl: "ky-KG",
        openGraph: "ky_KG"
    },
    ru: {
        htmlLang: "ru",
        intl: "ru-RU",
        openGraph: "ru_RU"
    },
    en: {
        htmlLang: "en",
        intl: "en-US",
        openGraph: "en_US"
    }
};
function isLocale(value) {
    return locales.some((locale)=>locale === value);
}
function preferredLocale(acceptLanguage) {
    const preferences = (acceptLanguage ?? "").split(",").map((entry)=>{
        const [language, ...parameters] = entry.trim().split(";");
        const quality = parameters.find((parameter)=>parameter.trim().startsWith("q="));
        return {
            language: language.toLowerCase().split("-")[0],
            quality: quality ? Number(quality.trim().slice(2)) : 1
        };
    }).filter((entry)=>Number.isFinite(entry.quality) && entry.quality > 0 && entry.quality <= 1).sort((first, second)=>second.quality - first.quality);
    for (const { language } of preferences){
        if (language === "ky" || language === "kg") return "kg";
        if (isLocale(language)) return language;
    }
    return defaultLocale;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/i18n/format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatNumber",
    ()=>formatNumber,
    "interpolate",
    ()=>interpolate,
    "pluralize",
    ()=>pluralize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/config.ts [app-client] (ecmascript)");
;
function interpolate(template, values) {
    return template.replace(/\{(\w+)\}/g, (placeholder, key)=>Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : placeholder);
}
function formatNumber(value, locale, options) {
    // Chrome lacks Kyrgyz number data. Use the same separators on the server and client.
    const numberLocale = locale === "kg" ? "ru-RU" : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localeSettings"][locale].intl;
    const formatted = new Intl.NumberFormat(numberLocale, options).format(value);
    return locale === "kg" ? formatted.replace(/[\u00a0\u202f]/g, " ") : formatted;
}
function formatDate(value, locale, dictionary) {
    const date = new Date(`${value}T12:00:00Z`);
    return interpolate(dictionary.shortDate, {
        day: formatNumber(date.getUTCDate(), locale),
        month: dictionary.months[date.getUTCMonth()]
    });
}
function pluralize(count, locale, forms) {
    const rule = new Intl.PluralRules(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localeSettings"][locale].intl).select(count);
    return interpolate(forms[rule] ?? forms.other, {
        count: formatNumber(count, locale)
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/availability-calendar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AvailabilityCalendar",
    ()=>AvailabilityCalendar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/form-design-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stay-dates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function AvailabilityCalendar({ today, months, weekdays, blocked = [], common, onDay, checkIn = "", checkOut = "", selectionMode, minDate = today, maxDate }) {
    _s();
    const { text } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"])();
    const mode = selectionMode ?? (checkIn && !checkOut ? "end" : "start");
    const candidate = mode === "end" ? checkOut : checkIn;
    const origin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateOnly"])(candidate) ? candidate : mode === "end" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateOnly"])(checkIn) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(checkIn, 1) : minDate;
    const [monthValue, setMonthValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AvailabilityCalendar.useState": ()=>(origin || today).slice(0, 7) + "-01"
    }["AvailabilityCalendar.useState"]);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(origin || today);
    const grid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const headingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), helpId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const occupied = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AvailabilityCalendar.useMemo[occupied]": ()=>new Set(blocked)
    }["AvailabilityCalendar.useMemo[occupied]"], [
        blocked
    ]);
    const month = new Date(`${monthValue}T00:00:00Z`);
    const padding = (month.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
    const values = Array.from({
        length: days
    }, (_, i)=>monthValue.slice(0, 8) + String(i + 1).padStart(2, "0"));
    function unavailable(value) {
        if (value < minDate || maxDate && value > maxDate) return true;
        if (mode === "end" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateOnly"])(checkIn)) return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validStay"])(checkIn, value, today, blocked);
        return occupied.has(value);
    }
    const focusDay = values.includes(focused) && !unavailable(focused) ? focused : values.find((value)=>!unavailable(value));
    const cells = [
        ...Array.from({
            length: padding
        }, ()=>""),
        ...values
    ];
    while(cells.length % 7)cells.push("");
    function monthShift(amount, date = monthValue) {
        const source = new Date(`${date}T00:00:00Z`);
        const first = new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth() + amount, 1));
        const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
        first.setUTCDate(Math.min(source.getUTCDate(), last));
        return first.toISOString().slice(0, 10);
    }
    function moveFocus(next, direction) {
        for(let attempt = 0; attempt < 366 && unavailable(next); attempt++){
            if (next < minDate || maxDate && next > maxDate) return;
            next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(next, direction);
        }
        if (unavailable(next)) return;
        setFocused(next);
        setMonthValue(next.slice(0, 7) + "-01");
        requestAnimationFrame(()=>grid.current?.querySelector(`button[data-date="${next}"]`)?.focus());
    }
    function keyboard(event, value) {
        let next = "", direction = 1;
        const weekday = (new Date(`${value}T00:00:00Z`).getUTCDay() + 6) % 7;
        switch(event.key){
            case "ArrowLeft":
                next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(value, -1);
                direction = -1;
                break;
            case "ArrowRight":
                next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(value, 1);
                break;
            case "ArrowUp":
                next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(value, -7);
                direction = -1;
                break;
            case "ArrowDown":
                next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(value, 7);
                break;
            case "Home":
                next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(value, -weekday);
                break;
            case "End":
                next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(value, 6 - weekday);
                direction = -1;
                break;
            case "PageUp":
                next = monthShift(event.shiftKey ? -12 : -1, value);
                direction = -1;
                break;
            case "PageDown":
                next = monthShift(event.shiftKey ? 12 : 1, value);
                break;
            default:
                return;
        }
        event.preventDefault();
        moveFocus(next, direction);
    }
    const previous = monthShift(-1), next = monthShift(1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "availability-calendar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "calendar-heading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "calendar-nav",
                        "aria-label": common.labels.previous,
                        disabled: previous.slice(0, 7) < minDate.slice(0, 7),
                        onClick: ()=>setMonthValue(previous),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                            name: "chevron-left",
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/components/availability-calendar.tsx",
                            lineNumber: 75,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/availability-calendar.tsx",
                        lineNumber: 73,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        id: headingId,
                        "aria-live": "polite",
                        children: [
                            months[month.getUTCMonth()],
                            " ",
                            month.getUTCFullYear()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/availability-calendar.tsx",
                        lineNumber: 77,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "calendar-nav",
                        "aria-label": common.labels.next,
                        disabled: !!maxDate && next.slice(0, 7) > maxDate.slice(0, 7),
                        onClick: ()=>setMonthValue(next),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                            name: "chevron-right",
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/components/availability-calendar.tsx",
                            lineNumber: 80,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/availability-calendar.tsx",
                        lineNumber: 78,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/availability-calendar.tsx",
                lineNumber: 72,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: grid,
                className: "calendar-grid",
                role: "grid",
                "aria-labelledby": headingId,
                "aria-describedby": helpId,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "calendar-week",
                        role: "row",
                        children: weekdays.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                role: "columnheader",
                                className: "calendar-weekday",
                                children: day
                            }, day, false, {
                                fileName: "[project]/components/availability-calendar.tsx",
                                lineNumber: 85,
                                columnNumber: 30
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/availability-calendar.tsx",
                        lineNumber: 84,
                        columnNumber: 7
                    }, this),
                    Array.from({
                        length: cells.length / 7
                    }, (_, row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "calendar-week",
                            role: "row",
                            children: cells.slice(row * 7, row * 7 + 7).map((value, index)=>{
                                if (!value) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    role: "gridcell"
                                }, `empty-${index}`, false, {
                                    fileName: "[project]/components/availability-calendar.tsx",
                                    lineNumber: 89,
                                    columnNumber: 30
                                }, this);
                                const selected = value === checkIn || value === checkOut;
                                const dayLabel = `${Number(value.slice(8))} ${months[month.getUTCMonth()]} ${month.getUTCFullYear()}`;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    role: "gridcell",
                                    "aria-selected": selected,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        "data-date": value,
                                        tabIndex: value === focusDay ? 0 : -1,
                                        className: `${occupied.has(value) ? "is-occupied " : ""}${selected ? "is-selected " : ""}${checkIn && checkOut && value > checkIn && value < checkOut ? "in-range " : ""}${value === today ? "is-today" : ""}`,
                                        disabled: unavailable(value) || !onDay,
                                        "aria-label": `${dayLabel}: ${occupied.has(value) ? common.labels.occupied : common.labels.available}`,
                                        "aria-current": value === today ? "date" : undefined,
                                        "aria-pressed": selected,
                                        onKeyDown: (event)=>keyboard(event, value),
                                        onFocus: ()=>setFocused(value),
                                        onClick: ()=>onDay?.(value),
                                        children: Number(value.slice(8))
                                    }, void 0, false, {
                                        fileName: "[project]/components/availability-calendar.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this)
                                }, value, false, {
                                    fileName: "[project]/components/availability-calendar.tsx",
                                    lineNumber: 92,
                                    columnNumber: 18
                                }, this);
                            })
                        }, row, false, {
                            fileName: "[project]/components/availability-calendar.tsx",
                            lineNumber: 87,
                            columnNumber: 61
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/availability-calendar.tsx",
                lineNumber: 83,
                columnNumber: 5
            }, this),
            mode !== "single" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "calendar-legend",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                fileName: "[project]/components/availability-calendar.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this),
                            common.labels.available
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/availability-calendar.tsx",
                        lineNumber: 105,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "is-occupied"
                            }, void 0, false, {
                                fileName: "[project]/components/availability-calendar.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this),
                            common.labels.occupied
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/availability-calendar.tsx",
                        lineNumber: 106,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/availability-calendar.tsx",
                lineNumber: 104,
                columnNumber: 27
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: helpId,
                className: "sr-only",
                children: text.calendarKeyboard
            }, void 0, false, {
                fileName: "[project]/components/availability-calendar.tsx",
                lineNumber: 108,
                columnNumber: 5
            }, this),
            mode !== "single" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "form-hint",
                children: common.labels.calendarHint
            }, void 0, false, {
                fileName: "[project]/components/availability-calendar.tsx",
                lineNumber: 109,
                columnNumber: 27
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/availability-calendar.tsx",
        lineNumber: 71,
        columnNumber: 10
    }, this);
}
_s(AvailabilityCalendar, "H14IKYnldAAVnLR6Kec3m7w5FN4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = AvailabilityCalendar;
var _c;
__turbopack_context__.k.register(_c, "AvailabilityCalendar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/brand.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Brand",
    ()=>Brand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$image$2d$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Image__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/image-component.js [app-client] (ecmascript) <export Image as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation-link.tsx [app-client] (ecmascript)");
;
;
;
function Brand({ inverse = false, label, href = "#top", className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        className: `brand${inverse ? " brand-inverse" : ""}${className ? ` ${className}` : ""}`,
        href: href,
        "aria-label": label,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$image$2d$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Image__as__default$3e$__["default"], {
                className: "brand-mark",
                src: "/brand/a-frame-logo.png",
                alt: "",
                "aria-hidden": "true",
                width: 56,
                height: 56,
                sizes: "(max-width: 767px) 44px, 56px",
                loading: "eager"
            }, void 0, false, {
                fileName: "[project]/components/brand.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "brand-wordmark",
                children: [
                    "a-frame",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "brand-country",
                        children: "kg"
                    }, void 0, false, {
                        fileName: "[project]/components/brand.tsx",
                        lineNumber: 27,
                        columnNumber: 47
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/brand.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/brand.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = Brand;
var _c;
__turbopack_context__.k.register(_c, "Brand");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/guest-selector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GuestSelector",
    ()=>GuestSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-popover/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/form-design-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-controls.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function GuestSelector({ value: controlled, defaultValue = "", onValueChange, maxGuests = 50, minGuests = 1, name = "guests", disabled, required, label, placeholder, className = "" }) {
    _s();
    const { locale, common, text } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"])();
    const [local, setLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultValue), [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const value = controlled ?? local, count = Number(value);
    const input = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), trigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const editableCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), countId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const title = label ?? common.labels.guests;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GuestSelector.useEffect": ()=>{
            const form = input.current?.form;
            const reset = {
                "GuestSelector.useEffect.reset": ()=>{
                    setLocal(defaultValue);
                    setOpen(false);
                }
            }["GuestSelector.useEffect.reset"];
            form?.addEventListener("reset", reset);
            return ({
                "GuestSelector.useEffect": ()=>form?.removeEventListener("reset", reset)
            })["GuestSelector.useEffect"];
        }
    }["GuestSelector.useEffect"], [
        defaultValue
    ]);
    function change(next) {
        setLocal(next);
        onValueChange?.(next);
    }
    function step(amount) {
        change(String(Math.min(maxGuests, Math.max(minGuests, value ? count + amount : minGuests))));
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const field = editableCount.current;
            field?.getAnimations().forEach((animation)=>animation.cancel());
            field?.animate([
                {
                    opacity: .55,
                    transform: "translateY(2px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ], {
                duration: 140,
                easing: "ease-out"
            });
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `product-field guest-selector ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                children: title
            }, void 0, false, {
                fileName: "[project]/components/guest-selector.tsx",
                lineNumber: 40,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: input,
                name: name,
                type: "number",
                className: "premium-validation-input",
                tabIndex: -1,
                "aria-hidden": "true",
                min: minGuests,
                max: maxGuests,
                step: 1,
                required: required,
                disabled: disabled,
                value: value,
                onChange: (event)=>change(event.target.value),
                onInvalid: (event)=>{
                    event.preventDefault();
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirstInvalidControl"])(input.current)) {
                        trigger.current?.focus();
                        setOpen(true);
                    }
                }
            }, void 0, false, {
                fileName: "[project]/components/guest-selector.tsx",
                lineNumber: 41,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                open: open,
                onOpenChange: setOpen,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            ref: trigger,
                            id: id,
                            type: "button",
                            disabled: disabled,
                            className: "premium-control premium-guest-trigger",
                            "data-empty": !value || undefined,
                            "aria-label": `${title}${required ? `, ${text.required}` : ""}: ${value ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pluralize"])(count, locale, text.guestForms) : placeholder || common.labels.anyGuests}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "premium-guest-value",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            name: "users",
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 50,
                                            columnNumber: 49
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: value ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pluralize"])(count, locale, text.guestForms) : placeholder || common.labels.anyGuests
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 50,
                                            columnNumber: 80
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/guest-selector.tsx",
                                    lineNumber: 50,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    name: "chevron-down",
                                    size: 18,
                                    className: "premium-chevron"
                                }, void 0, false, {
                                    fileName: "[project]/components/guest-selector.tsx",
                                    lineNumber: 51,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/guest-selector.tsx",
                            lineNumber: 48,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/guest-selector.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                            className: "premium-menu premium-guest-popover",
                            "aria-label": title,
                            sideOffset: 8,
                            collisionPadding: 12,
                            align: "start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "premium-popover-heading",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 56,
                                            columnNumber: 52
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                                            className: "premium-icon-button",
                                            "aria-label": text.close,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "x",
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/guest-selector.tsx",
                                                lineNumber: 56,
                                                columnNumber: 147
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 56,
                                            columnNumber: 76
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/guest-selector.tsx",
                                    lineNumber: 56,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "form-hint",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolate"])(text.capacity, {
                                        count: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(maxGuests, locale)
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/guest-selector.tsx",
                                    lineNumber: 57,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "premium-guest-stepper",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "premium-step-button",
                                            "aria-label": text.decrease,
                                            disabled: !value || count <= minGuests,
                                            onClick: ()=>step(-1),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "minus",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/guest-selector.tsx",
                                                lineNumber: 59,
                                                columnNumber: 159
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 59,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "premium-step-value",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: countId,
                                                    className: "sr-only",
                                                    children: text.guestCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/guest-selector.tsx",
                                                    lineNumber: 60,
                                                    columnNumber: 49
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ref: editableCount,
                                                    id: countId,
                                                    type: "number",
                                                    inputMode: "numeric",
                                                    min: minGuests,
                                                    max: maxGuests,
                                                    step: 1,
                                                    value: value,
                                                    placeholder: String(minGuests),
                                                    onChange: (event)=>{
                                                        const next = event.target.value;
                                                        if (!next) {
                                                            change("");
                                                            return;
                                                        }
                                                        const numeric = Number(next);
                                                        if (Number.isInteger(numeric)) change(String(Math.min(maxGuests, Math.max(minGuests, numeric))));
                                                    },
                                                    onKeyDown: (event)=>{
                                                        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                                                            event.preventDefault();
                                                            step(event.key === "ArrowUp" ? 1 : -1);
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/guest-selector.tsx",
                                                    lineNumber: 61,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-live": "polite",
                                                    className: "sr-only",
                                                    children: value ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pluralize"])(count, locale, text.guestForms) : common.labels.anyGuests
                                                }, void 0, false, {
                                                    fileName: "[project]/components/guest-selector.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 60,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "premium-step-button",
                                            "aria-label": text.increase,
                                            disabled: count >= maxGuests,
                                            onClick: ()=>step(1),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "plus",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/guest-selector.tsx",
                                                lineNumber: 72,
                                                columnNumber: 148
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 72,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/guest-selector.tsx",
                                    lineNumber: 58,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "premium-popover-footer",
                                    children: [
                                        !required ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "premium-clear-button",
                                            onClick: ()=>change(""),
                                            children: text.clear
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 75,
                                            columnNumber: 26
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 75,
                                            columnNumber: 132
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                                            className: "button button-primary",
                                            children: text.done
                                        }, void 0, false, {
                                            fileName: "[project]/components/guest-selector.tsx",
                                            lineNumber: 76,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/guest-selector.tsx",
                                    lineNumber: 74,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/guest-selector.tsx",
                            lineNumber: 55,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/guest-selector.tsx",
                        lineNumber: 54,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/guest-selector.tsx",
                lineNumber: 46,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/guest-selector.tsx",
        lineNumber: 39,
        columnNumber: 10
    }, this);
}
_s(GuestSelector, "ikrKOx3BV5a4bt2duZdY0u3LxiE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = GuestSelector;
var _c;
__turbopack_context__.k.register(_c, "GuestSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing-search.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LandingSearch",
    ()=>LandingSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/pending-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$date$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-date-picker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$guest$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/guest-selector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function LandingSearch({ locale, search, regions, disabled }) {
    _s();
    const regionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationForm"], {
        className: "search-form",
        action: `/${locale}/catalog`,
        "aria-label": search.ariaLabel,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "search-field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "field-label",
                        htmlFor: regionId,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "pin",
                                size: 17
                            }, void 0, false, {
                                fileName: "[project]/components/landing-search.tsx",
                                lineNumber: 19,
                                columnNumber: 57
                            }, this),
                            search.destination
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing-search.tsx",
                        lineNumber: 19,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumSelect"], {
                        id: regionId,
                        name: "region",
                        defaultValue: "",
                        disabled: disabled,
                        options: [
                            {
                                value: "",
                                label: search.destinationPlaceholder
                            },
                            ...regions.map((region)=>({
                                    value: region.slug,
                                    label: region.name
                                }))
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/landing-search.tsx",
                        lineNumber: 20,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing-search.tsx",
                lineNumber: 18,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$date$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumDatePicker"], {
                disabled: disabled,
                className: "search-date-fields",
                labels: {
                    checkIn: search.checkIn,
                    checkOut: search.checkOut
                }
            }, void 0, false, {
                fileName: "[project]/components/landing-search.tsx",
                lineNumber: 23,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$guest$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GuestSelector"], {
                disabled: disabled,
                label: search.guests,
                placeholder: search.guestsPlaceholder,
                maxGuests: 50
            }, void 0, false, {
                fileName: "[project]/components/landing-search.tsx",
                lineNumber: 24,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubmitButton"], {
                className: "button button-primary search-submit",
                disabled: disabled,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                        name: "search",
                        size: 19
                    }, void 0, false, {
                        fileName: "[project]/components/landing-search.tsx",
                        lineNumber: 25,
                        columnNumber: 87
                    }, this),
                    search.submit
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing-search.tsx",
                lineNumber: 25,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing-search.tsx",
        lineNumber: 17,
        columnNumber: 10
    }, this);
}
_s(LandingSearch, "caJiENr7rNxJbKGMPhNo5IbUE3Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = LandingSearch;
var _c;
__turbopack_context__.k.register(_c, "LandingSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/language-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageSwitcher",
    ()=>LanguageSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function LanguageSwitcher({ locale, labels, reloadDocument = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    function changeLanguage(nextLocale) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLocale"])(nextLocale) || nextLocale === locale) return;
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localeCookie"]}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
        const target = new URL(window.location.href);
        const segments = target.pathname.split("/");
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLocale"])(segments[1])) segments[1] = nextLocale;
        else segments.splice(1, 0, nextLocale);
        target.pathname = segments.join("/");
        if (reloadDocument || !navigator.onLine || document.querySelector("[data-offline-page]")) {
            // Next.js 16 can duplicate hashes when returning to a cached not-found route.
            window.location.assign(target.href);
            return;
        }
        startTransition(()=>router.push(`${target.pathname}${target.search}${target.hash}`, {
                scroll: false
            }));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "language-switcher",
        "aria-busy": pending,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumSelect"], {
            "aria-label": labels.label,
            value: locale,
            onValueChange: changeLanguage,
            loading: pending,
            displayValue: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "language-value",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                        name: "globe",
                        size: 16
                    }, void 0, false, {
                        fileName: "[project]/components/language-switcher.tsx",
                        lineNumber: 35,
                        columnNumber: 56
                    }, this),
                    locale.toUpperCase()
                ]
            }, void 0, true, {
                fileName: "[project]/components/language-switcher.tsx",
                lineNumber: 35,
                columnNumber: 23
            }, this),
            options: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locales"].map((language)=>({
                    value: language,
                    label: labels[language],
                    lang: language === "kg" ? "ky" : language
                }))
        }, void 0, false, {
            fileName: "[project]/components/language-switcher.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/language-switcher.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(LanguageSwitcher, "bS6iYTA6A+xoIWTYyEHZ+6tNDOQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = LanguageSwitcher;
var _c;
__turbopack_context__.k.register(_c, "LanguageSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/logout-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogoutForm",
    ()=>LogoutForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$88d3a6__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:88d3a6 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$use$2d$safe$2d$action$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/use-safe-action.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/pending-button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function LogoutForm({ locale, label, errorLabel, className, buttonClassName, children }) {
    _s();
    const [state, action, pending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$use$2d$safe$2d$action$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSafeAction"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$88d3a6__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["logoutFormAction"], {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: action,
        className: className,
        "aria-busy": pending,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "hidden",
                name: "locale",
                value: locale
            }, void 0, false, {
                fileName: "[project]/components/logout-form.tsx",
                lineNumber: 12,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PendingButton"], {
                type: "submit",
                className: buttonClassName,
                pending: pending,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/logout-form.tsx",
                        lineNumber: 13,
                        columnNumber: 90
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/logout-form.tsx",
                lineNumber: 13,
                columnNumber: 5
            }, this),
            state.code && !pending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "form-message form-error",
                role: "alert",
                children: errorLabel
            }, void 0, false, {
                fileName: "[project]/components/logout-form.tsx",
                lineNumber: 14,
                columnNumber: 32
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/logout-form.tsx",
        lineNumber: 11,
        columnNumber: 10
    }, this);
}
_s(LogoutForm, "odby+qTScBXerxBPIFlOK7pweHQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$use$2d$safe$2d$action$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSafeAction"]
    ];
});
_c = LogoutForm;
var _c;
__turbopack_context__.k.register(_c, "LogoutForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/navigation-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavigationForm",
    ()=>NavigationForm,
    "useNavigationPending",
    ()=>useNavigationPending
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$form$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/form.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const NavigationPending = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(false);
const useNavigationPending = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(NavigationPending);
};
_s(useNavigationPending, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function NavigationForm({ children, action, onSubmit, ...props }) {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationPending.Provider, {
        value: pending,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$form$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ...props,
            action: action,
            "aria-busy": pending,
            onSubmit: (event)=>{
                onSubmit?.(event);
                if (event.defaultPrevented) return;
                event.preventDefault();
                if (pending) return;
                // Capture successful controls before a pending UI can disable them.
                const target = new URL(action, window.location.href);
                target.search = "";
                for (const [name, value] of new FormData(event.currentTarget)){
                    if (typeof value === "string" && value) target.searchParams.append(name, value);
                }
                startTransition(()=>router.push(`${target.pathname}${target.search}`, {
                        scroll: props.scroll ?? true
                    }));
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/components/navigation-form.tsx",
            lineNumber: 14,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/navigation-form.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_s1(NavigationForm, "bS6iYTA6A+xoIWTYyEHZ+6tNDOQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = NavigationForm;
var _c;
__turbopack_context__.k.register(_c, "NavigationForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/navigation-link.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavigationLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function NavigationHint() {
    _s();
    const { pending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLinkStatus"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "link-pending-hint",
        "data-pending": pending || undefined,
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/components/navigation-link.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_s(NavigationHint, "wW7FNC65VVGjDVMT/rLybducFg0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLinkStatus"]
    ];
});
_c = NavigationHint;
function NavigationLink({ children, className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        ...props,
        className: `navigation-link ${className}`,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationHint, {}, void 0, false, {
                fileName: "[project]/components/navigation-link.tsx",
                lineNumber: 13,
                columnNumber: 15
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/navigation-link.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c1 = NavigationLink;
var _c, _c1;
__turbopack_context__.k.register(_c, "NavigationHint");
__turbopack_context__.k.register(_c1, "NavigationLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/offline-notice.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflineNotice",
    ()=>OfflineNotice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pwa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pwa.ts [app-client] (ecmascript)");
"use client";
;
;
;
function OfflineNotice({ locale }) {
    const text = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pwa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pwaText"][locale];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "offline-notice section-shell",
        "aria-labelledby": "offline-title",
        role: "status",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                name: "wifi",
                size: 24
            }, void 0, false, {
                fileName: "[project]/components/offline-notice.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "offline-title",
                        children: text.offline
                    }, void 0, false, {
                        fileName: "[project]/components/offline-notice.tsx",
                        lineNumber: 12,
                        columnNumber: 12
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: text.description
                    }, void 0, false, {
                        fileName: "[project]/components/offline-notice.tsx",
                        lineNumber: 12,
                        columnNumber: 54
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/offline-notice.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "offline-actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "text-link",
                        href: `/${locale}`,
                        children: [
                            text.home,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "arrow-right",
                                size: 17
                            }, void 0, false, {
                                fileName: "[project]/components/offline-notice.tsx",
                                lineNumber: 14,
                                columnNumber: 65
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/offline-notice.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "button button-outline",
                        type: "button",
                        onClick: ()=>{
                            const target = new URL(window.location.href);
                            if (/^\/(kg|ru|en)\/offline\/?$/.test(target.pathname)) target.pathname = `/${locale}`;
                            window.location.replace(target.href);
                        },
                        children: text.retry
                    }, void 0, false, {
                        fileName: "[project]/components/offline-notice.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/offline-notice.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/offline-notice.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = OfflineNotice;
var _c;
__turbopack_context__.k.register(_c, "OfflineNotice");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/pending-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PendingButton",
    ()=>PendingButton,
    "Spinner",
    ()=>Spinner,
    "SubmitButton",
    ()=>SubmitButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation-form.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Spinner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "ui-spinner",
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/components/pending-button.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = Spinner;
function PendingButton({ pending = false, children, disabled, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...props,
        disabled: disabled || pending,
        "aria-busy": pending,
        children: [
            pending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {}, void 0, false, {
                fileName: "[project]/components/pending-button.tsx",
                lineNumber: 13,
                columnNumber: 17
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/pending-button.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c1 = PendingButton;
function SubmitButton(props) {
    _s();
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormStatus"])();
    const navigating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigationPending"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PendingButton, {
        ...props,
        type: "submit",
        pending: status.pending || navigating
    }, void 0, false, {
        fileName: "[project]/components/pending-button.tsx",
        lineNumber: 21,
        columnNumber: 10
    }, this);
}
_s(SubmitButton, "XYqh3hPwYC2UfmNQuM9cfoTQqbw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormStatus"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigationPending"]
    ];
});
_c2 = SubmitButton;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Spinner");
__turbopack_context__.k.register(_c1, "PendingButton");
__turbopack_context__.k.register(_c2, "SubmitButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/premium-date-picker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PremiumDateInput",
    ()=>PremiumDateInput,
    "PremiumDatePicker",
    ()=>PremiumDatePicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-popover/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$availability$2d$calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/availability-calendar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/form-design-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stay-dates.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-controls.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function displayDate(value, months, locale) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateOnly"])(value)) return "";
    const date = new Date(`${value}T00:00:00Z`);
    return `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(date.getUTCDate(), locale)} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
function focusCalendar(event) {
    event.preventDefault();
    requestAnimationFrame(()=>document.querySelector('[data-premium-calendar] .calendar-grid button[tabindex="0"]')?.focus());
}
function PremiumDateInput({ label, value: controlled, defaultValue, onChange, min, max, id, name, disabled, required, error, className = "", ...props }) {
    _s();
    const { today, common, text, locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"])();
    const initial = String(defaultValue ?? ""), [local, setLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const trigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), input = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const value = String(controlled ?? local), popupId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const minimum = String(min || today);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PremiumDateInput.useEffect": ()=>{
            const form = input.current?.form;
            const reset = {
                "PremiumDateInput.useEffect.reset": ()=>{
                    setLocal(initial);
                    setOpen(false);
                }
            }["PremiumDateInput.useEffect.reset"];
            form?.addEventListener("reset", reset);
            return ({
                "PremiumDateInput.useEffect": ()=>form?.removeEventListener("reset", reset)
            })["PremiumDateInput.useEffect"];
        }
    }["PremiumDateInput.useEffect"], [
        initial
    ]);
    function change(next) {
        setLocal(next);
        if (input.current) {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
            setter?.call(input.current, next);
            input.current.dispatchEvent(new Event("input", {
                bubbles: true
            }));
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "premium-date-input",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ...props,
                ref: input,
                type: "date",
                className: "premium-validation-input",
                "aria-hidden": "true",
                tabIndex: -1,
                name: name,
                required: required,
                disabled: disabled,
                min: minimum,
                max: max,
                value: value,
                onChange: (event)=>{
                    setLocal(event.target.value);
                    onChange?.(event);
                },
                onInvalid: (event)=>{
                    event.preventDefault();
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirstInvalidControl"])(input.current)) {
                        trigger.current?.focus();
                        setOpen(true);
                    }
                }
            }, void 0, false, {
                fileName: "[project]/components/premium-date-picker.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                open: open,
                onOpenChange: setOpen,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: id,
                            ref: trigger,
                            type: "button",
                            disabled: disabled,
                            className: `premium-control premium-date-trigger ${className}`,
                            "aria-label": `${label}${required ? `, ${text.required}` : ""}: ${displayDate(value, common.calendar.months, locale) || text.selectDate}`,
                            "data-invalid": error || props["aria-invalid"] || undefined,
                            "aria-describedby": props["aria-describedby"],
                            "data-empty": !value || undefined,
                            "aria-controls": open ? popupId : undefined,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: displayDate(value, common.calendar.months, locale) || text.selectDate
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 59,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    name: "calendar",
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 59,
                                    columnNumber: 95
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/premium-date-picker.tsx",
                            lineNumber: 55,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/premium-date-picker.tsx",
                        lineNumber: 54,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                            id: popupId,
                            className: "premium-menu premium-calendar-popover",
                            "data-premium-calendar": true,
                            "aria-label": label,
                            align: "start",
                            sideOffset: 8,
                            collisionPadding: 12,
                            onOpenAutoFocus: focusCalendar,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "premium-popover-heading",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/components/premium-date-picker.tsx",
                                            lineNumber: 65,
                                            columnNumber: 52
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                                            className: "premium-icon-button",
                                            "aria-label": text.close,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "x",
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/premium-date-picker.tsx",
                                                lineNumber: 65,
                                                columnNumber: 147
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/premium-date-picker.tsx",
                                            lineNumber: 65,
                                            columnNumber: 76
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 65,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$availability$2d$calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvailabilityCalendar"], {
                                    today: today || minimum,
                                    minDate: minimum,
                                    maxDate: max ? String(max) : undefined,
                                    months: common.calendar.months,
                                    weekdays: common.calendar.weekdays,
                                    blocked: [],
                                    common: common,
                                    selectionMode: "single",
                                    checkIn: value,
                                    onDay: (day)=>{
                                        change(day);
                                        setOpen(false);
                                    }
                                }, open ? value : "closed", false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 66,
                                    columnNumber: 11
                                }, this),
                                !required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "premium-clear-button",
                                    onClick: ()=>{
                                        change("");
                                        setOpen(false);
                                    },
                                    children: text.clear
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 69,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/premium-date-picker.tsx",
                            lineNumber: 63,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/premium-date-picker.tsx",
                        lineNumber: 62,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/premium-date-picker.tsx",
                lineNumber: 53,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/premium-date-picker.tsx",
        lineNumber: 46,
        columnNumber: 10
    }, this);
}
_s(PremiumDateInput, "3QNLtkEOF7w6XyjcVZ2N6EFGeoQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = PremiumDateInput;
function PremiumDatePicker({ value: controlled, defaultValue = {
    checkIn: "",
    checkOut: ""
}, onValueChange, today: suppliedToday, blocked = [], disabled, required, startName = "checkIn", endName = "checkOut", className = "", maxDate, labels, error }) {
    _s1();
    const design = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"])(), today = suppliedToday || design.today;
    const { common, text, locale } = design;
    const [local, setLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultValue);
    const value = controlled ?? local;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false), [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("checkIn");
    const popupId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), startId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), endId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const startTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), endTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), endInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fieldLabels = labels ?? {
        checkIn: common.labels.checkIn,
        checkOut: common.labels.checkOut
    };
    const initialStart = defaultValue.checkIn, initialEnd = defaultValue.checkOut;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PremiumDatePicker.useEffect": ()=>{
            const owner = startInput.current?.form;
            const reset = {
                "PremiumDatePicker.useEffect.reset": ()=>{
                    setLocal({
                        checkIn: initialStart,
                        checkOut: initialEnd
                    });
                    setOpen(false);
                }
            }["PremiumDatePicker.useEffect.reset"];
            owner?.addEventListener("reset", reset);
            return ({
                "PremiumDatePicker.useEffect": ()=>owner?.removeEventListener("reset", reset)
            })["PremiumDatePicker.useEffect"];
        }
    }["PremiumDatePicker.useEffect"], [
        initialStart,
        initialEnd
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PremiumDatePicker.useEffect": ()=>{
            const invalid = (value.checkIn || value.checkOut) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validStay"])(value.checkIn, value.checkOut, today, blocked);
            startInput.current?.setCustomValidity(value.checkIn && (value.checkIn < today || blocked.includes(value.checkIn)) ? common.errors.datesUnavailable : "");
            endInput.current?.setCustomValidity(invalid ? common.errors.invalidDates : "");
        }
    }["PremiumDatePicker.useEffect"], [
        value.checkIn,
        value.checkOut,
        today,
        blocked,
        common
    ]);
    function change(next) {
        setLocal(next);
        onValueChange?.(next);
    }
    function choose(day) {
        if (active === "checkIn" || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateOnly"])(value.checkIn)) {
            const end = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validStay"])(day, value.checkOut, today, blocked) ? value.checkOut : "";
            change({
                checkIn: day,
                checkOut: end
            });
            setActive("checkOut");
            requestAnimationFrame(()=>document.querySelector('[data-premium-calendar] .calendar-grid button[tabindex="0"]')?.focus());
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validStay"])(value.checkIn, day, today, blocked)) {
            change({
                ...value,
                checkOut: day
            });
            setOpen(false);
        }
    }
    function show(name) {
        setActive(name);
        setOpen(true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Anchor"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `premium-date-range ${className}`,
                    children: [
                        "checkIn",
                        "checkOut"
                    ].map((name)=>{
                        const isStart = name === "checkIn", id = isStart ? startId : endId;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "product-field premium-range-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: id,
                                    children: fieldLabels[name]
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: isStart ? startInput : endInput,
                                    name: isStart ? startName : endName,
                                    type: "date",
                                    value: value[name],
                                    className: "premium-validation-input",
                                    "aria-hidden": "true",
                                    tabIndex: -1,
                                    disabled: disabled,
                                    required: required,
                                    min: isStart ? today : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(value.checkIn, 1) || today,
                                    max: maxDate,
                                    onChange: (event)=>change({
                                            ...value,
                                            [name]: event.target.value
                                        }),
                                    onInvalid: (event)=>{
                                        event.preventDefault();
                                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirstInvalidControl"])((isStart ? startInput : endInput).current)) {
                                            show(name);
                                            (isStart ? startTrigger : endTrigger).current?.focus();
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    id: id,
                                    ref: isStart ? startTrigger : endTrigger,
                                    disabled: disabled,
                                    className: "premium-control premium-date-trigger",
                                    "data-empty": !value[name] || undefined,
                                    "aria-haspopup": "dialog",
                                    "aria-expanded": open && active === name,
                                    "aria-controls": open ? popupId : undefined,
                                    "aria-label": `${fieldLabels[name]}${required ? `, ${text.required}` : ""}: ${displayDate(value[name], common.calendar.months, locale) || text.selectDate}`,
                                    "data-invalid": error || undefined,
                                    onClick: ()=>show(name),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: displayDate(value[name], common.calendar.months, locale) || text.selectDate
                                        }, void 0, false, {
                                            fileName: "[project]/components/premium-date-picker.tsx",
                                            lineNumber: 138,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            name: "calendar",
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/components/premium-date-picker.tsx",
                                            lineNumber: 138,
                                            columnNumber: 105
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, name, true, {
                            fileName: "[project]/components/premium-date-picker.tsx",
                            lineNumber: 124,
                            columnNumber: 18
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/premium-date-picker.tsx",
                    lineNumber: 121,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/premium-date-picker.tsx",
                lineNumber: 120,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                    id: popupId,
                    className: "premium-menu premium-calendar-popover",
                    "data-premium-calendar": true,
                    "aria-label": fieldLabels[active],
                    align: "start",
                    sideOffset: 8,
                    collisionPadding: 12,
                    onOpenAutoFocus: focusCalendar,
                    onCloseAutoFocus: (event)=>{
                        event.preventDefault();
                        const focused = document.activeElement;
                        if (!focused || focused === document.body || focused.closest('[data-premium-calendar]')) (active === "checkIn" ? startTrigger : endTrigger).current?.focus();
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "premium-popover-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: fieldLabels[active]
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 152,
                                    columnNumber: 50
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                                    className: "premium-icon-button",
                                    "aria-label": text.close,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "x",
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/components/premium-date-picker.tsx",
                                        lineNumber: 152,
                                        columnNumber: 159
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 152,
                                    columnNumber: 88
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/premium-date-picker.tsx",
                            lineNumber: 152,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "premium-calendar-hint",
                            children: text.rangeHint
                        }, void 0, false, {
                            fileName: "[project]/components/premium-date-picker.tsx",
                            lineNumber: 153,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$availability$2d$calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvailabilityCalendar"], {
                            today: today,
                            months: common.calendar.months,
                            weekdays: common.calendar.weekdays,
                            blocked: blocked,
                            common: common,
                            checkIn: value.checkIn,
                            checkOut: value.checkOut,
                            maxDate: maxDate,
                            selectionMode: active === "checkOut" && value.checkIn ? "end" : "start",
                            onDay: choose
                        }, open ? "open" : "closed", false, {
                            fileName: "[project]/components/premium-date-picker.tsx",
                            lineNumber: 154,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "premium-popover-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "premium-clear-button",
                                    onClick: ()=>{
                                        change({
                                            checkIn: "",
                                            checkOut: ""
                                        });
                                        setActive("checkIn");
                                    },
                                    children: text.clear
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 158,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                                    className: "button button-primary",
                                    children: text.done
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-date-picker.tsx",
                                    lineNumber: 159,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/premium-date-picker.tsx",
                            lineNumber: 157,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/premium-date-picker.tsx",
                    lineNumber: 145,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/premium-date-picker.tsx",
                lineNumber: 144,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/premium-date-picker.tsx",
        lineNumber: 119,
        columnNumber: 10
    }, this);
}
_s1(PremiumDatePicker, "kt2ZjztqB02oyi1+5rnAcG6p5nU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c1 = PremiumDatePicker;
var _c, _c1;
__turbopack_context__.k.register(_c, "PremiumDateInput");
__turbopack_context__.k.register(_c1, "PremiumDatePicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/premium-fields.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Field",
    ()=>Field,
    "PremiumCheckbox",
    ()=>PremiumCheckbox,
    "PremiumInput",
    ()=>PremiumInput,
    "PremiumRadio",
    ()=>PremiumRadio,
    "PremiumTextarea",
    ()=>PremiumTextarea,
    "SelectField",
    ()=>SelectField,
    "TextAreaField",
    ()=>TextAreaField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$date$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/premium-date-picker.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
function PremiumInput({ className = "", error, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        ...props,
        className: `premium-control premium-input ${className}`,
        "aria-invalid": error || props["aria-invalid"] || undefined
    }, void 0, false, {
        fileName: "[project]/components/premium-fields.tsx",
        lineNumber: 9,
        columnNumber: 10
    }, this);
}
_c = PremiumInput;
function PremiumTextarea({ className = "", error, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        ...props,
        className: `premium-control premium-textarea ${className}`,
        "aria-invalid": error || props["aria-invalid"] || undefined
    }, void 0, false, {
        fileName: "[project]/components/premium-fields.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c1 = PremiumTextarea;
function PremiumCheckbox({ className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        ...props,
        type: "checkbox",
        className: `premium-choice premium-checkbox ${className}`
    }, void 0, false, {
        fileName: "[project]/components/premium-fields.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_c2 = PremiumCheckbox;
function PremiumRadio({ className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        ...props,
        type: "radio",
        className: `premium-choice premium-radio ${className}`
    }, void 0, false, {
        fileName: "[project]/components/premium-fields.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c3 = PremiumRadio;
function Field({ label, hint, error, id: suppliedId, ...props }) {
    _s();
    const generated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), id = suppliedId ?? generated;
    const described = [
        props["aria-describedby"],
        hint ? `${id}-hint` : "",
        error ? `${id}-error` : ""
    ].filter(Boolean).join(" ") || undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-field",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                children: label
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 24,
                columnNumber: 5
            }, this),
            props.type === "date" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$date$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumDateInput"], {
                ...props,
                id: id,
                label: label,
                "aria-describedby": described,
                error: !!error
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PremiumInput, {
                ...props,
                id: id,
                "aria-describedby": described,
                error: !!error
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                id: `${id}-hint`,
                children: hint
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 28,
                columnNumber: 14
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                id: `${id}-error`,
                className: "premium-field-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 29,
                columnNumber: 15
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/premium-fields.tsx",
        lineNumber: 23,
        columnNumber: 10
    }, this);
}
_s(Field, "xj6qDVBfPUN+LMCs/Ihq6BN2FT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c4 = Field;
function SelectField({ label, hint, error, id: suppliedId, ...props }) {
    _s1();
    const generated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), id = suppliedId ?? generated;
    const described = [
        props["aria-describedby"],
        hint ? `${id}-hint` : "",
        error ? `${id}-error` : ""
    ].filter(Boolean).join(" ") || undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-field",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                children: label
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 36,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$premium$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PremiumSelect"], {
                ...props,
                id: id,
                "aria-describedby": described,
                error: !!error
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                id: `${id}-hint`,
                children: hint
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 38,
                columnNumber: 14
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                id: `${id}-error`,
                className: "premium-field-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 39,
                columnNumber: 15
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/premium-fields.tsx",
        lineNumber: 35,
        columnNumber: 10
    }, this);
}
_s1(SelectField, "xj6qDVBfPUN+LMCs/Ihq6BN2FT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c5 = SelectField;
function TextAreaField({ label, hint, error, id: suppliedId, maxLength = 10000, rows = 5, ...props }) {
    _s2();
    const generated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), id = suppliedId ?? generated;
    const described = [
        props["aria-describedby"],
        hint ? `${id}-hint` : "",
        error ? `${id}-error` : ""
    ].filter(Boolean).join(" ") || undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-field",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                children: label
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 46,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PremiumTextarea, {
                ...props,
                id: id,
                rows: rows,
                maxLength: maxLength,
                error: !!error,
                "aria-describedby": described
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                id: `${id}-hint`,
                children: hint
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 48,
                columnNumber: 14
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                id: `${id}-error`,
                className: "premium-field-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/premium-fields.tsx",
                lineNumber: 49,
                columnNumber: 15
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/premium-fields.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
_s2(TextAreaField, "xj6qDVBfPUN+LMCs/Ihq6BN2FT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c6 = TextAreaField;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "PremiumInput");
__turbopack_context__.k.register(_c1, "PremiumTextarea");
__turbopack_context__.k.register(_c2, "PremiumCheckbox");
__turbopack_context__.k.register(_c3, "PremiumRadio");
__turbopack_context__.k.register(_c4, "Field");
__turbopack_context__.k.register(_c5, "SelectField");
__turbopack_context__.k.register(_c6, "TextAreaField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/premium-select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PremiumSelect",
    ()=>PremiumSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/pending-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/form-design-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-controls.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const EMPTY = "__aframe_empty_option__";
function optionText(children) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].toArray(children).map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(child) ? optionText(child.props.children) : String(child)).join("");
}
function readOptions(children) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].toArray(children).flatMap((child)=>{
        if (!/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(child)) return [];
        if (child.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]) return readOptions(child.props.children);
        if (child.type !== "option") return [];
        const label = optionText(child.props.children);
        return [
            {
                value: String(child.props.value ?? label),
                label,
                disabled: child.props.disabled,
                lang: child.props.lang
            }
        ];
    });
}
function PremiumSelect({ children, options: supplied, value: controlled, defaultValue, onValueChange, name, id: suppliedId, required, disabled, loading, error, placeholder, className = "", displayValue, form, autoComplete, ...props }) {
    _s();
    const { text } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"])();
    const options = supplied ?? readOptions(children);
    const initial = String(defaultValue ?? options[0]?.value ?? "");
    const [local, setLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [invalid, setInvalid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const tabDirection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const trigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const input = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const generated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(), id = suppliedId ?? generated;
    const value = String(controlled ?? local);
    const selected = options.find((option)=>option.value === value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PremiumSelect.useEffect": ()=>{
            const owner = input.current?.form;
            const reset = {
                "PremiumSelect.useEffect.reset": ()=>{
                    setLocal(initial);
                    setOpen(false);
                }
            }["PremiumSelect.useEffect.reset"];
            owner?.addEventListener("reset", reset);
            return ({
                "PremiumSelect.useEffect": ()=>owner?.removeEventListener("reset", reset)
            })["PremiumSelect.useEffect"];
        }
    }["PremiumSelect.useEffect"], [
        initial
    ]);
    function change(next) {
        const actual = next === EMPTY ? "" : next;
        setLocal(actual);
        setInvalid(false);
        onValueChange?.(actual);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "premium-select",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: input,
                type: "text",
                className: "premium-validation-input",
                "aria-hidden": "true",
                tabIndex: -1,
                name: name,
                form: form,
                autoComplete: autoComplete,
                required: required,
                disabled: disabled || loading,
                value: value,
                onChange: (event)=>change(event.target.value),
                onInvalid: (event)=>{
                    event.preventDefault();
                    setInvalid(true);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirstInvalidControl"])(input.current)) {
                        trigger.current?.focus();
                        setOpen(true);
                    }
                }
            }, void 0, false, {
                fileName: "[project]/components/premium-select.tsx",
                lineNumber: 67,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                value: value || EMPTY,
                onValueChange: change,
                open: open,
                onOpenChange: setOpen,
                disabled: disabled || loading,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                        ...props,
                        id: id,
                        ref: trigger,
                        className: `premium-control premium-select-trigger ${className}`,
                        "aria-invalid": error || invalid || props["aria-invalid"] || undefined,
                        "aria-required": required || undefined,
                        "aria-busy": loading || undefined,
                        "data-empty": !value || undefined,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"], {
                                children: displayValue ?? selected?.label ?? placeholder ?? text.choose
                            }, void 0, false, {
                                fileName: "[project]/components/premium-select.tsx",
                                lineNumber: 77,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                className: "premium-chevron",
                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {}, void 0, false, {
                                    fileName: "[project]/components/premium-select.tsx",
                                    lineNumber: 78,
                                    columnNumber: 61
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    name: "chevron-down",
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-select.tsx",
                                    lineNumber: 78,
                                    columnNumber: 75
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/premium-select.tsx",
                                lineNumber: 78,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/premium-select.tsx",
                        lineNumber: 74,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                            className: "premium-menu premium-select-content",
                            position: "popper",
                            sideOffset: 7,
                            collisionPadding: 12,
                            align: "start",
                            avoidCollisions: true,
                            onKeyDown: (event)=>{
                                if (event.key === "Tab") {
                                    event.preventDefault();
                                    tabDirection.current = event.shiftKey ? -1 : 1;
                                    setOpen(false);
                                }
                            },
                            onCloseAutoFocus: (event)=>{
                                if (!tabDirection.current) return;
                                event.preventDefault();
                                const direction = tabDirection.current;
                                tabDirection.current = 0;
                                const controls = Array.from(document.querySelectorAll('a[href], button, input, textarea, select, [tabindex="0"]')).filter((element)=>element.tabIndex >= 0 && !element.matches(":disabled") && !element.closest('[aria-hidden="true"], .premium-menu') && element.getBoundingClientRect().width > 1 && element.getBoundingClientRect().height > 1 && getComputedStyle(element).visibility !== "hidden");
                                const index = controls.indexOf(trigger.current);
                                (controls[index + direction] ?? trigger.current)?.focus();
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
                                    className: "premium-select-scroll",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "chevron-down",
                                        className: "rotate-180",
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/premium-select.tsx",
                                        lineNumber: 96,
                                        columnNumber: 68
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-select.tsx",
                                    lineNumber: 96,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                                    className: "premium-select-viewport",
                                    children: options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
                                            value: option.value || EMPTY,
                                            disabled: option.disabled,
                                            textValue: option.label,
                                            lang: option.lang,
                                            className: "premium-option",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                                                    children: option.label
                                                }, void 0, false, {
                                                    fileName: "[project]/components/premium-select.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                                                    className: "premium-option-check",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                        name: "check",
                                                        size: 17
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/premium-select.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 70
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/premium-select.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, option.value || EMPTY, true, {
                                            fileName: "[project]/components/premium-select.tsx",
                                            lineNumber: 98,
                                            columnNumber: 36
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-select.tsx",
                                    lineNumber: 97,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
                                    className: "premium-select-scroll",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "chevron-down",
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/premium-select.tsx",
                                        lineNumber: 104,
                                        columnNumber: 70
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/premium-select.tsx",
                                    lineNumber: 104,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/premium-select.tsx",
                            lineNumber: 81,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/premium-select.tsx",
                        lineNumber: 80,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/premium-select.tsx",
                lineNumber: 73,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/premium-select.tsx",
        lineNumber: 66,
        columnNumber: 10
    }, this);
}
_s(PremiumSelect, "Ub4tg2TaNANV51Xp/Ovwdln0HeE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$design$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormDesign"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = PremiumSelect;
var _c;
__turbopack_context__.k.register(_c, "PremiumSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/property-favorite.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PropertyFavorite",
    ()=>PropertyFavorite
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$use$2d$safe$2d$action$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/use-safe-action.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/pending-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$68489d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:68489d [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function PropertyFavorite({ cabinId, active, locale, common, next }) {
    _s();
    const [state, action, pending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$use$2d$safe$2d$action$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSafeAction"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$68489d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["favoriteAction"], {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: action,
        className: "property-favorite",
        "aria-busy": pending,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                name: "cabinId",
                value: cabinId,
                type: "hidden"
            }, void 0, false, {
                fileName: "[project]/components/property-favorite.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                name: "locale",
                value: locale,
                type: "hidden"
            }, void 0, false, {
                fileName: "[project]/components/property-favorite.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                name: "next",
                value: next,
                type: "hidden"
            }, void 0, false, {
                fileName: "[project]/components/property-favorite.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                name: "active",
                value: active ? "0" : "1",
                type: "hidden"
            }, void 0, false, {
                fileName: "[project]/components/property-favorite.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PendingButton"], {
                className: `favorite-button${active ? " is-favorite" : ""}`,
                pending: pending,
                "aria-pressed": active,
                "aria-label": active ? common.labels.removeFavorite : common.labels.addFavorite,
                type: "submit",
                children: !pending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                    name: "heart",
                    size: 19
                }, void 0, false, {
                    fileName: "[project]/components/property-favorite.tsx",
                    lineNumber: 36,
                    columnNumber: 22
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/property-favorite.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            state.code && !pending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "favorite-error",
                role: "alert",
                children: common.errors[state.code] || common.errors.serverError
            }, void 0, false, {
                fileName: "[project]/components/property-favorite.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/property-favorite.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(PropertyFavorite, "odby+qTScBXerxBPIFlOK7pweHQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$use$2d$safe$2d$action$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSafeAction"]
    ];
});
_c = PropertyFavorite;
var _c;
__turbopack_context__.k.register(_c, "PropertyFavorite");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/site-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation-link.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$image$2d$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Image__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/image-component.js [app-client] (ecmascript) <export Image as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/brand.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/language-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$logout$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/logout-form.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function SiteHeader({ locale, dictionary, user = null, favoriteCount = 0, logoutError }) {
    _s();
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [accountOpen, setAccountOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const accountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), accountButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const headerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), menuButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const text = dictionary.header;
    const links = [
        {
            href: `/${locale}`,
            label: text.home
        },
        {
            href: `/${locale}/catalog`,
            label: text.cabins
        },
        {
            href: `/${locale}#destinations`,
            label: text.destinations
        },
        {
            href: `/${locale}#how-it-works`,
            label: text.howItWorks
        }
    ];
    const accountHref = `/${locale}/${user?.role === "ADMIN" ? "admin" : user?.role === "OWNER" ? "owner" : "account"}`;
    const accountLinks = [
        {
            href: `/${locale}/account?tab=profile`,
            label: text.myProfile,
            icon: "user"
        },
        {
            href: `/${locale}/account?tab=bookings`,
            label: text.myBookings,
            icon: "calendar"
        },
        {
            href: `/${locale}/account?tab=settings`,
            label: text.settings,
            icon: "settings"
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SiteHeader.useEffect": ()=>{
            if (!accountOpen) return;
            const outside = {
                "SiteHeader.useEffect.outside": (event)=>{
                    if (event.target instanceof Node && !accountRef.current?.contains(event.target)) setAccountOpen(false);
                }
            }["SiteHeader.useEffect.outside"];
            const escape = {
                "SiteHeader.useEffect.escape": (event)=>{
                    if (event.key === "Escape") {
                        setAccountOpen(false);
                        accountButtonRef.current?.focus();
                    }
                }
            }["SiteHeader.useEffect.escape"];
            window.addEventListener("pointerdown", outside);
            window.addEventListener("keydown", escape);
            return ({
                "SiteHeader.useEffect": ()=>{
                    window.removeEventListener("pointerdown", outside);
                    window.removeEventListener("keydown", escape);
                }
            })["SiteHeader.useEffect"];
        }
    }["SiteHeader.useEffect"], [
        accountOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SiteHeader.useEffect": ()=>{
            if (!menuOpen) return;
            const escape = {
                "SiteHeader.useEffect.escape": (event)=>{
                    if (event.key === "Escape") {
                        setMenuOpen(false);
                        menuButtonRef.current?.focus();
                    }
                }
            }["SiteHeader.useEffect.escape"];
            const outside = {
                "SiteHeader.useEffect.outside": (event)=>{
                    if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
                }
            }["SiteHeader.useEffect.outside"];
            window.addEventListener("keydown", escape);
            window.addEventListener("pointerdown", outside);
            return ({
                "SiteHeader.useEffect": ()=>{
                    window.removeEventListener("keydown", escape);
                    window.removeEventListener("pointerdown", outside);
                }
            })["SiteHeader.useEffect"];
        }
    }["SiteHeader.useEffect"], [
        menuOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "site-header",
        ref: headerRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header-inner section-shell",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Brand"], {
                        label: dictionary.accessibility.brandHome,
                        href: `/${locale}`
                    }, void 0, false, {
                        fileName: "[project]/components/site-header.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "desktop-nav",
                        "aria-label": text.navigation,
                        children: links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: link.href,
                                children: link.label
                            }, link.href, false, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/site-header.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "owner-link",
                                href: `/${locale}/owner`,
                                children: [
                                    text.owners,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "arrow-up-right",
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$language$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LanguageSwitcher"], {
                                locale: locale,
                                labels: dictionary.language
                            }, void 0, false, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "header-icon-button header-favorites",
                                href: `/${locale}/account?tab=favorites`,
                                "aria-label": text.favorites,
                                title: text.favorites,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "heart",
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    favoriteCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "header-favorites-count",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(favoriteCount, locale)
                                    }, void 0, false, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-account",
                                ref: accountRef,
                                onBlur: (event)=>{
                                    if (!event.currentTarget.contains(event.relatedTarget)) setAccountOpen(false);
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        ref: accountButtonRef,
                                        type: "button",
                                        className: "header-account-button",
                                        "aria-label": `${text.accountTitle}: ${user.name}`,
                                        "aria-expanded": accountOpen,
                                        "aria-controls": "header-account-dropdown",
                                        onClick: ()=>{
                                            setAccountOpen(!accountOpen);
                                            setMenuOpen(false);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserAvatar, {
                                                name: user.name,
                                                url: user.avatarUrl
                                            }, user.avatarUrl || user.name, false, {
                                                fileName: "[project]/components/site-header.tsx",
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "chevron-down",
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/components/site-header.tsx",
                                                lineNumber: 109,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this),
                                    accountOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "header-account-dropdown",
                                        id: "header-account-dropdown",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                className: "header-account-name",
                                                href: accountHref,
                                                onClick: ()=>setAccountOpen(false),
                                                children: user.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/site-header.tsx",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, this),
                                            accountLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: link.href,
                                                    onClick: ()=>setAccountOpen(false),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                            name: link.icon,
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/site-header.tsx",
                                                            lineNumber: 114,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: link.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/site-header.tsx",
                                                            lineNumber: 114,
                                                            columnNumber: 52
                                                        }, this)
                                                    ]
                                                }, link.href, true, {
                                                    fileName: "[project]/components/site-header.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 43
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$logout$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogoutForm"], {
                                                locale: locale,
                                                label: text.logout,
                                                errorLabel: logoutError,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                    name: "logout",
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/components/site-header.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 88
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/site-header.tsx",
                                                lineNumber: 116,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 111,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 103,
                                columnNumber: 19
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "header-sign-in",
                                href: `/${locale}/login`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "user",
                                        size: 19
                                    }, void 0, false, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: text.signIn
                                    }, void 0, false, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 118,
                                columnNumber: 20
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "button button-primary header-book",
                                href: `/${locale}/catalog`,
                                children: [
                                    text.findCabin,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "arrow-up-right",
                                        size: 17
                                    }, void 0, false, {
                                        fileName: "[project]/components/site-header.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: menuButtonRef,
                                type: "button",
                                className: "mobile-menu-button",
                                "aria-label": menuOpen ? text.closeMenu : text.openMenu,
                                "aria-expanded": menuOpen,
                                "aria-controls": "mobile-navigation",
                                onClick: ()=>{
                                    setMenuOpen(!menuOpen);
                                    setAccountOpen(false);
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    name: menuOpen ? "x" : "menu",
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/components/site-header.tsx",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/site-header.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/site-header.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                id: "mobile-navigation",
                className: "mobile-navigation",
                "aria-label": text.mobileNavigation,
                children: [
                    [
                        ...links,
                        {
                            href: `/${locale}/owner`,
                            label: text.ownersMobile
                        },
                        {
                            href: user ? accountHref : `/${locale}/login`,
                            label: user ? user.name : text.signIn
                        },
                        ...user ? accountLinks : []
                    ].map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: link.href,
                            onClick: ()=>setMenuOpen(false),
                            children: [
                                link.label,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    name: "arrow-up-right",
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/components/site-header.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, link.href, true, {
                            fileName: "[project]/components/site-header.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)),
                    user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$logout$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogoutForm"], {
                        locale: locale,
                        label: text.logout,
                        errorLabel: logoutError,
                        buttonClassName: "mobile-account-link"
                    }, void 0, false, {
                        fileName: "[project]/components/site-header.tsx",
                        lineNumber: 163,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: "button button-primary",
                        href: `/${locale}/catalog`,
                        onClick: ()=>setMenuOpen(false),
                        children: [
                            text.findYourCabin,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "search",
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/components/site-header.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/site-header.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/site-header.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/site-header.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(SiteHeader, "URjD2S02LDM78r9RQyTrXI63xNI=");
_c = SiteHeader;
function UserAvatar({ name, url }) {
    _s1();
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const initials = name.trim().split(/\s+/).slice(0, 2).map((part)=>part[0]).join("").toUpperCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "header-user-avatar",
        "aria-hidden": "true",
        children: url && !failed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$image$2d$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Image__as__default$3e$__["default"], {
            src: url,
            alt: "",
            width: 34,
            height: 34,
            unoptimized: true,
            referrerPolicy: "no-referrer",
            onError: ()=>setFailed(true)
        }, void 0, false, {
            fileName: "[project]/components/site-header.tsx",
            lineNumber: 183,
            columnNumber: 23
        }, this) : initials
    }, void 0, false, {
        fileName: "[project]/components/site-header.tsx",
        lineNumber: 182,
        columnNumber: 10
    }, this);
}
_s1(UserAvatar, "BFa/7w0IiJnSoWJxZHxuU4kOwF4=");
_c1 = UserAvatar;
var _c, _c1;
__turbopack_context__.k.register(_c, "SiteHeader");
__turbopack_context__.k.register(_c1, "UserAvatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/use-safe-action.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSafeAction",
    ()=>useSafeAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useSafeAction(action, initial) {
    _s();
    const guarded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSafeAction.useCallback[guarded]": async (state, form)=>{
            try {
                return await action(state, form);
            } catch (error) {
                if (typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) throw error;
                return {
                    ...state,
                    success: false,
                    code: "serverError"
                };
            }
        }
    }["useSafeAction.useCallback[guarded]"], [
        action
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"])(guarded, initial);
}
_s(useSafeAction, "+bkBFZclq9S1nAVXXxFoCrJpDpI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/form-controls.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Avoid moving focus away from an earlier invalid native field. */ __turbopack_context__.s([
    "isFirstInvalidControl",
    ()=>isFirstInvalidControl
]);
function isFirstInvalidControl(input) {
    if (!input?.form) return true;
    const first = Array.from(input.form.elements).find((element)=>(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) && element.willValidate && !element.validity.valid);
    return first === input;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=_1yyn3pwx_lh8y._.js.map