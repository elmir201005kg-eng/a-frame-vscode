(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
(()=>{"use strict";return[
"[project]/app/i18n/forms.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formMessages",
    ()=>formMessages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$ru$2f$forms$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/ru/forms.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$kg$2f$forms$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/kg/forms.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$en$2f$forms$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/en/forms.json.[json].cjs [app-client] (ecmascript)");
;
;
;
const formMessages = {
    ru: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$ru$2f$forms$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    kg: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$kg$2f$forms$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    en: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$en$2f$forms$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/form-design-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormDesignProvider",
    ()=>FormDesignProvider,
    "useFormDesign",
    ()=>useFormDesign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stay-dates.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$ru$2f$common$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/ru/common.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$kg$2f$common$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/kg/common.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$en$2f$common$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/en/common.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/forms.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const dictionaries = {
    ru: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$ru$2f$common$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    kg: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$kg$2f$common$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    en: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$en$2f$common$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
const FormLocale = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])("ru");
function subscribeToday(notify) {
    const timer = setInterval(notify, 60000);
    return ()=>clearInterval(timer);
}
const serverToday = ()=>"";
function FormDesignProvider({ locale, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormLocale.Provider, {
        value: locale,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/form-design-provider.tsx",
        lineNumber: 20,
        columnNumber: 10
    }, this);
}
_c = FormDesignProvider;
function useFormDesign() {
    _s();
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(FormLocale);
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeToday, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stay$2d$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bishkekToday"], serverToday);
    return {
        locale,
        today,
        text: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formMessages"][locale],
        common: dictionaries[locale]
    };
}
_s(useFormDesign, "Uc7VnbbhWzoKz6H5KuZEvzth9H0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
var _c;
__turbopack_context__.k.register(_c, "FormDesignProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Icon",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const paths = {
    eye: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 4,
                columnNumber: 10
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 4,
                columnNumber: 71
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 4,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    "eye-off": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m3 3 18 18M10.6 5.1 12 5c6.5 0 10 7 10 7a20 20 0 0 1-3.1 4.2M6.1 6.1A20 20 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.9-1.9M10 10a3 3 0 0 0 4 4"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 5,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 5,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    settings: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m10 3-1 3-3 1-2 3 2 2v3l3 2 1 3h4l1-3 3-2v-3l2-2-2-3-3-1-1-3h-4Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 6,
                columnNumber: 15
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 6,
                columnNumber: 92
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 6,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    logout: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M9 4H4v16h5M9 12h12m-4-4 4 4-4 4"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 7,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 7,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    "arrow-up-right": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M7 17 17 7M7 7h10v10"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 8,
        columnNumber: 21
    }, ("TURBOPACK compile-time value", void 0)),
    "arrow-right": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M4 12h16m-6-6 6 6-6 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 9,
        columnNumber: 18
    }, ("TURBOPACK compile-time value", void 0)),
    "arrow-left": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M20 12H4m6-6-6 6 6 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 10,
        columnNumber: 17
    }, ("TURBOPACK compile-time value", void 0)),
    "chevron-down": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m6 9 6 6 6-6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 11,
        columnNumber: 19
    }, ("TURBOPACK compile-time value", void 0)),
    "chevron-left": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m15 6-6 6 6 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 12,
        columnNumber: 19
    }, ("TURBOPACK compile-time value", void 0)),
    "chevron-right": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m9 6 6 6-6 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 13,
        columnNumber: 20
    }, ("TURBOPACK compile-time value", void 0)),
    search: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "10.5",
                cy: "10.5",
                r: "6.5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 14,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m16 16 5 5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 14,
                columnNumber: 51
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 14,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    calendar: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "16",
                rx: "3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 15,
                columnNumber: 15
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 3v4M8 3v4M3 11h18"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 15,
                columnNumber: 65
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 15,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    pin: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 16,
                columnNumber: 10
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "10",
                r: "2.5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 16,
                columnNumber: 69
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 16,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    users: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 17,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 17,
                columnNumber: 116
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 17,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    user: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 18,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 18,
                columnNumber: 42
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    heart: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    x: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m6 6 12 12M6 18 18 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 20,
        columnNumber: 6
    }, ("TURBOPACK compile-time value", void 0)),
    menu: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M4 6h16M4 12h16M4 18h16"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    mail: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "14",
                rx: "3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 22,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m3 7 9 6 9-6"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 22,
                columnNumber: 61
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 22,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    phone: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 23,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    whatsapp: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.1-4.9A8.5 8.5 0 1 1 20.5 11.5Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 24,
                columnNumber: 15
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m8 7 1.5 3-1 1a8 8 0 0 0 3.5 3.5l1-1 3 1.5c0 1.2-1 2-2.2 2C10.1 17 7 13.9 7 10.2 7 9 7.2 7.5 8 7Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 24,
                columnNumber: 99
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 24,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    telegram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9",
                fill: "currentColor",
                stroke: "none"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 25,
                columnNumber: 15
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m6 11.5 12-5-3 11-4-3-2 2 .5-4L15 9l-6 3.5-3-1Z",
                fill: "var(--background)",
                stroke: "var(--background)",
                strokeWidth: ".7"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 25,
                columnNumber: 81
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 25,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    instagram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "3",
                width: "18",
                height: "18",
                rx: "5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 26,
                columnNumber: 16
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 26,
                columnNumber: 66
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "17.5",
                cy: "6.5",
                r: "1",
                fill: "currentColor",
                stroke: "none"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 26,
                columnNumber: 98
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 26,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    globe: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 27,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 27,
                columnNumber: 44
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 27,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    mountain: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m3 20 8-16 10 16H3Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 28,
                columnNumber: 15
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m8 10 3 3 3-3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 28,
                columnNumber: 47
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 28,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    tree: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m12 3-5 6h3l-5 6h4l-5 5h16l-5-5h4l-5-6h3l-5-6ZM12 20v2"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 29,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 29,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    leaf: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 4c-8-2-16 1-16 8a7 7 0 0 0 7 7c7 0 10-7 9-15Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 30,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 21 16 9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 30,
                columnNumber: 73
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 30,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    shield: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m12 3 8 4v6c0 5-8 9-8 9s-8-4-8-9V7l8-4Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m8.5 12 2.5 2.5 4.5-4.5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 31,
                columnNumber: 65
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 31,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    sun: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 32,
                columnNumber: 10
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2v2M12 20v2M2 12h2M20 12h2m-3-9-1.5 1.5M6.5 17.5 5 19m0-16 1.5 1.5m11 13L19 19"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 32,
                columnNumber: 42
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 32,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    wifi: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 8.8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 3.2a6 6 0 0 1 8 0"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 33,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "19",
                r: ".7",
                fill: "currentColor"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 33,
                columnNumber: 91
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    parking: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "3",
                width: "18",
                height: "18",
                rx: "4"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 34,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 17V7h4a3 3 0 0 1 0 6H9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 34,
                columnNumber: 64
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 34,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    bath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 13h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3ZM6 13V5a2 2 0 0 1 4 0m-2 0h4M6 20v2m12-2v2"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 35,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 35,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    bed: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 18v3m18-3v3M3 18h18V9H3v9ZM5 9V4h14v5M12 4v5"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 36,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 36,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    home: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 37,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 21v-8h6v8"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 37,
                columnNumber: 74
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 37,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    check: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m5 12 4 4L19 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 38,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    plus: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M12 5v14M5 12h14"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 39,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    minus: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M5 12h14"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 40,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    waves: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M2 6c3-3 5 3 8 0s5 3 8 0 4 0 4 0M2 12c3-3 5 3 8 0s5 3 8 0 4 0 4 0M2 18c3-3 5 3 8 0s5 3 8 0 4 0 4 0"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 41,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    compass: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 42,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m16.2 7.8-2.8 5.6-5.6 2.8 2.8-5.6 5.6-2.8Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 42,
                columnNumber: 46
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 42,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    clock: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 43,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 7v5l3 2"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 43,
                columnNumber: 44
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 43,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    star: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m12 3 2.8 5.7 6.3.9-4.55 4.43L17.62 21 12 18.05 6.38 21l1.07-6.97L2.9 9.6l6.3-.9L12 3Z"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 44,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0))
};
function Icon({ name, size = 20, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.65",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        focusable: "false",
        ...props,
        children: paths[name]
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = Icon;
var _c;
__turbopack_context__.k.register(_c, "Icon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/pwa-manager.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PwaManager",
    ()=>PwaManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pwa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pwa.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function PwaManager({ locale }) {
    _s();
    const [installPrompt, setInstallPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [installing, setInstalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const text = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pwa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pwaText"][locale];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PwaManager.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            let disposed;
            const rememberLocale = undefined;
            const register = undefined;
        }
    }["PwaManager.useEffect"], [
        locale
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PwaManager.useEffect": ()=>{
            const offerInstall = {
                "PwaManager.useEffect.offerInstall": (event)=>{
                    event.preventDefault();
                    if (!window.matchMedia("(display-mode: standalone)").matches) setInstallPrompt(event);
                }
            }["PwaManager.useEffect.offerInstall"];
            const installed = {
                "PwaManager.useEffect.installed": ()=>setInstallPrompt(null)
            }["PwaManager.useEffect.installed"];
            window.addEventListener("beforeinstallprompt", offerInstall);
            window.addEventListener("appinstalled", installed);
            return ({
                "PwaManager.useEffect": ()=>{
                    window.removeEventListener("beforeinstallprompt", offerInstall);
                    window.removeEventListener("appinstalled", installed);
                }
            })["PwaManager.useEffect"];
        }
    }["PwaManager.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PwaManager.useEffect": ()=>{
            // Next's client navigation requests RSC, not HTML. Offline links must use a
            // document navigation so the worker can return the complete offline home.
            const navigateOffline = {
                "PwaManager.useEffect.navigateOffline": (event)=>{
                    if (navigator.onLine && !document.querySelector("[data-offline-page]")) return;
                    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
                    if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") || anchor.target && anchor.target !== "_self") return;
                    const target = new URL(anchor.href);
                    if (target.origin !== window.location.origin) return;
                    event.preventDefault();
                    // Keep the component's click handler (for example, closing the mobile
                    // menu). Next Link sees defaultPrevented and skips its own navigation.
                    if (target.hash && (target.pathname === window.location.pathname || /^\/(kg|ru|en)\/?$/.test(target.pathname))) {
                        const section = document.getElementById(decodeURIComponent(target.hash.slice(1)));
                        if (section) {
                            window.location.hash = target.hash;
                            section.scrollIntoView();
                            return;
                        }
                    }
                    window.location.assign(target.href);
                }
            }["PwaManager.useEffect.navigateOffline"];
            document.addEventListener("click", navigateOffline, true);
            return ({
                "PwaManager.useEffect": ()=>document.removeEventListener("click", navigateOffline, true)
            })["PwaManager.useEffect"];
        }
    }["PwaManager.useEffect"], []);
    async function install() {
        if (!installPrompt) return;
        setInstalling(true);
        try {
            await installPrompt.prompt();
            await installPrompt.userChoice;
        } catch (error) {
            console.warn("[PWA] Installation prompt failed:", error);
        } finally{
            setInstallPrompt(null);
            setInstalling(false);
        }
    }
    if (!installPrompt) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "pwa-install",
        "aria-label": text.install,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "button button-primary",
                type: "button",
                disabled: installing,
                onClick: ()=>void install(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                        name: "home",
                        size: 19
                    }, void 0, false, {
                        fileName: "[project]/components/pwa-manager.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    text.install
                ]
            }, void 0, true, {
                fileName: "[project]/components/pwa-manager.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "pwa-dismiss",
                type: "button",
                "aria-label": text.dismiss,
                onClick: ()=>setInstallPrompt(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                    name: "x",
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/components/pwa-manager.tsx",
                    lineNumber: 100,
                    columnNumber: 118
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pwa-manager.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/pwa-manager.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(PwaManager, "rQdpy9D0h12iVSFn6lf74/sbLpE=");
_c = PwaManager;
var _c;
__turbopack_context__.k.register(_c, "PwaManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/pwa.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pwaText",
    ()=>pwaText,
    "pwaThemeColor",
    ()=>pwaThemeColor
]);
const pwaThemeColor = "#0b120f";
const pwaText = {
    ru: {
        offline: "Вы офлайн",
        description: "Главная страница доступна без интернета. Для поиска домиков, входа и бронирования нужно подключение.",
        catalog: "Подключитесь к интернету, чтобы увидеть актуальные домики, цены и свободные даты.",
        retry: "Попробовать снова",
        home: "На главную",
        install: "Установить приложение",
        dismiss: "Закрыть предложение установки"
    },
    kg: {
        offline: "Сиз офлайнсыз",
        description: "Башкы бет интернетсиз жеткиликтүү. Үйлөрдү издөө, аккаунтка кирүү жана ээлөө үчүн интернет керек.",
        catalog: "Үйлөрдү, учурдагы бааларды жана бош күндөрдү көрүү үчүн интернетке туташыңыз.",
        retry: "Кайра аракет кылуу",
        home: "Башкы бетке",
        install: "Тиркемени орнотуу",
        dismiss: "Орнотуу сунушун жабуу"
    },
    en: {
        offline: "You're offline",
        description: "The home page is available offline. Connect to search cabins, sign in, or book a stay.",
        catalog: "Connect to the internet to see current cabins, prices, and available dates.",
        retry: "Try again",
        home: "Go to home page",
        install: "Install app",
        dismiss: "Dismiss installation offer"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/stay-dates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Date-only values are always calculated in UTC; today belongs to Kyrgyzstan. */ __turbopack_context__.s([
    "addDays",
    ()=>addDays,
    "bishkekToday",
    ()=>bishkekToday,
    "isDateOnly",
    ()=>isDateOnly,
    "validStay",
    ()=>validStay
]);
function isDateOnly(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function addDays(value, count) {
    if (!isDateOnly(value)) return "";
    return new Date(new Date(`${value}T00:00:00Z`).getTime() + count * 86400000).toISOString().slice(0, 10);
}
function bishkekToday(now = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Bishkek",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(now);
}
function validStay(start, end, minimum, blocked = []) {
    if (!isDateOnly(start) || !isDateOnly(end) || start < minimum || end <= start || end > addDays(start, 365)) return false;
    // A blocked checkout day is allowed; the night before it must be free.
    return !blocked.some((day)=>day >= start && day < end);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]})(),
"[project]/app/i18n/locales/en/common.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = JSON.parse("{\"nav\":{\"home\":\"Home\",\"catalog\":\"Cabins\",\"account\":\"My account\",\"owner\":\"Owner workspace\",\"admin\":\"Administration\",\"login\":\"Sign in\",\"register\":\"Create account\",\"logout\":\"Sign out\",\"favorites\":\"Saved cabins\",\"bookings\":\"Bookings\",\"profile\":\"Profile\",\"payments\":\"Payments\",\"settings\":\"Settings\",\"notifications\":\"Notifications\",\"cabins\":\"Properties\",\"regions\":\"Regions\",\"amenities\":\"Amenities\",\"users\":\"Users\",\"owners\":\"Owners\",\"reviews\":\"Reviews\",\"activities\":\"Activity\",\"translations\":\"Translations\",\"dashboard\":\"Overview\"},\"labels\":{\"loading\":\"Loading…\",\"save\":\"Save\",\"saving\":\"Saving…\",\"saved\":\"Changes saved\",\"search\":\"Find a cabin\",\"reset\":\"Clear filters\",\"filters\":\"Filters\",\"q\":\"Name or region\",\"region\":\"Region\",\"allRegions\":\"All regions\",\"all\":\"All\",\"minPrice\":\"Minimum price\",\"maxPrice\":\"Maximum price\",\"guests\":\"Guests\",\"checkIn\":\"Check-in\",\"checkOut\":\"Check-out\",\"anyGuests\":\"Any group\",\"sort\":\"Sort\",\"newest\":\"Newest first\",\"priceAsc\":\"Lowest price\",\"priceDesc\":\"Highest price\",\"results\":\"Results: {count}\",\"noResults\":\"No results found\",\"noResultsHint\":\"Adjust your filters or browse all cabins.\",\"empty\":\"Nothing here yet\",\"previous\":\"Previous\",\"next\":\"Next\",\"page\":\"Page {page} of {pages}\",\"details\":\"View details\",\"currency\":\"KGS\",\"perNight\":\"per night\",\"nightCount\":\"Nights: {count}\",\"capacity\":\"Up to {count} guests\",\"bedrooms\":\"Bedrooms\",\"beds\":\"Beds\",\"bathrooms\":\"Bathrooms\",\"noPhoto\":\"Photos have not been added yet\",\"demo\":\"Demonstration property\",\"demoHint\":\"This property and its photographs are for demonstration. It is not a verified rental offer.\",\"demoBook\":\"Create a test request\",\"demoBooking\":\"Test booking request\",\"demoBookingHint\":\"Demonstration mode: only a test request is created. Real accommodation, payments and host confirmation are unavailable.\",\"addFavorite\":\"Save cabin\",\"removeFavorite\":\"Remove saved cabin\",\"backCatalog\":\"Back to cabins\",\"aboutCabin\":\"About this cabin\",\"relatedTitle\":\"A little more inspiration\",\"relatedDescription\":\"More cabins for your next journey through Kyrgyzstan.\",\"rules\":\"House rules\",\"ownerInfo\":\"Your host\",\"verified\":\"Verified host\",\"reviewEmpty\":\"No published reviews yet\",\"availability\":\"Availability\",\"available\":\"Available\",\"occupied\":\"Booked or blocked\",\"calendarHint\":\"The checkout day is not an occupied night. Availability is checked again before booking.\",\"total\":\"Total\",\"subtotal\":\"Accommodation\",\"confirmAvailability\":\"Check availability\",\"checking\":\"Checking…\",\"chooseDates\":\"Choose dates\",\"book\":\"Request booking\",\"paymentPending\":\"Pay 5 KGS through Finik Pay from your booking details. The payment status updates after confirmation.\",\"pay\":\"Pay\",\"paymentCreating\":\"Creating payment…\",\"paymentConfirming\":\"Waiting for confirmation from Finik. The status will update automatically.\",\"paymentRefresh\":\"Check payment\",\"contact\":\"Contact details\",\"name\":\"First name\",\"lastName\":\"Last name\",\"email\":\"Email\",\"phone\":\"Phone\",\"password\":\"Password\",\"newPassword\":\"New password\",\"currentPassword\":\"Current password\",\"confirmPassword\":\"Confirm password\",\"passwordHint\":\"At least 10 characters. Passwords are stored only as secure hashes.\",\"role\":\"Role\",\"traveler\":\"Traveler\",\"ownerRole\":\"Cabin owner\",\"ownerRegistration\":\"Owner properties are published after an administrator reviews them.\",\"haveAccount\":\"Already have an account?\",\"noAccount\":\"New here?\",\"bookingNumber\":\"Booking number\",\"status\":\"Status\",\"createdAt\":\"Created\",\"cancelUntil\":\"Free cancellation is available until\",\"cancellationPolicy\":\"Cancellation is available at least {hours} hours before check-in.\",\"cancel\":\"Cancel booking\",\"reason\":\"Reason\",\"cancelHint\":\"Cancellation releases the dates. If payment has been received, arrange a refund with support.\",\"paymentMethod\":\"Payment method\",\"paymentAwaiting\":\"Payment service awaiting configuration\",\"notificationRead\":\"Mark as read\",\"review\":\"Write a review\",\"rating\":\"Rating\",\"reviewText\":\"Your experience\",\"reviewHint\":\"Reviews are available after a completed stay and are moderated.\",\"language\":\"Interface language\",\"updatePassword\":\"Change password\",\"title\":\"Title\",\"description\":\"Description\",\"slug\":\"Catalog address\",\"city\":\"City\",\"village\":\"Village\",\"address\":\"Address\",\"price\":\"Price per night\",\"photos\":\"Photographs\",\"upload\":\"Upload photo\",\"uploadHint\":\"JPEG, PNG or WebP, up to 8 MB and 25 megapixels. Upload only photographs of your property.\",\"removePhoto\":\"Remove photo\",\"edit\":\"Edit\",\"addCabin\":\"Add a cabin\",\"draft\":\"Save draft\",\"submitReview\":\"Submit for review\",\"publishHint\":\"Publishing requires photographs, a description and a verified owner profile.\",\"cancellationHours\":\"Cancellation deadline before check-in, hours\",\"houseRules\":\"House rules, one per line\",\"businessName\":\"Business name\",\"ownerDescription\":\"About the host\",\"ownerPhone\":\"Public host contact phone\",\"archive\":\"Archive\",\"blockDates\":\"Block dates\",\"openDates\":\"Open dates\",\"calendarPrice\":\"Price for selected nights\",\"optional\":\"Optional\",\"calendarManageHint\":\"Changes apply to nights from the start date up to, but not including, the end date. Booked nights cannot be overwritten.\",\"confirm\":\"Confirm\",\"reject\":\"Reject\",\"complete\":\"Complete stay\",\"ownerStatusHint\":\"Confirming a booking does not record a payment. A stay can be completed after checkout.\",\"ownerPending\":\"Your profile awaits administrator review. You can create drafts and submit them for moderation.\",\"income\":\"Received payments\",\"published\":\"Published\",\"activeBookings\":\"Active bookings\",\"active\":\"Active\",\"inactive\":\"Inactive\",\"enable\":\"Enable\",\"disable\":\"Disable\",\"verifyOwner\":\"Verify owner\",\"publish\":\"Publish\",\"hide\":\"Hide\",\"block\":\"Block\",\"add\":\"Add\",\"noData\":\"No records\",\"user\":\"User\",\"cabin\":\"Cabin\",\"amount\":\"Amount\",\"action\":\"Action\",\"entity\":\"Entity\",\"locale\":\"Language\",\"namespace\":\"Page\",\"key\":\"Translation key\",\"value\":\"Translation text\",\"removeOverride\":\"Restore JSON translation\",\"supportEmail\":\"Support email\",\"bookingsEnabled\":\"Accept bookings\",\"externalServices\":\"External services\",\"integrationsPending\":\"Finik Pay and in-app notifications are connected. SMS and email delivery are not connected yet.\",\"denied\":\"Access restricted\",\"backHome\":\"Go home\",\"ru\":\"Russian\",\"kg\":\"Kyrgyz\",\"en\":\"English\",\"statistics\":\"Statistics from database records\",\"read\":\"Read\",\"notRead\":\"Unread\",\"hostContacts\":\"Host contact details\",\"bookingsHint\":\"Booking and payment statuses follow real actions; successful payments are never simulated.\",\"phonePrivate\":\"Contact details are available only to the guest, the host and an administrator.\",\"retry\":\"Try again\",\"becomeOwner\":\"Become an owner\",\"settingsSaved\":\"Preferences saved\",\"emptyCatalog\":\"The first cabins will appear after their hosts are reviewed. Add your property to get started.\",\"resetCalendar\":\"Clear price override\",\"sendNotification\":\"Send notification\",\"recipient\":\"Recipient ID\",\"message\":\"Message\"},\"statuses\":{\"PENDING\":\"Awaiting confirmation\",\"CONFIRMED\":\"Confirmed\",\"CANCELLED\":\"Cancelled\",\"COMPLETED\":\"Completed\",\"REJECTED\":\"Rejected\",\"DRAFT\":\"Draft\",\"PUBLISHED\":\"Published\",\"BLOCKED\":\"Blocked\",\"ARCHIVED\":\"Archived\",\"PAID\":\"Paid\",\"FAILED\":\"Not completed\",\"REFUNDED\":\"Refunded\",\"VERIFIED\":\"Verified\",\"USER\":\"Traveler\",\"OWNER\":\"Owner\",\"ADMIN\":\"Administrator\",\"HIDDEN\":\"Hidden\",\"AVAILABLE\":\"Available\",\"BOOKED\":\"Booked\"},\"errors\":{\"unauthorized\":\"Sign in to pay for your booking.\",\"paymentUnavailable\":\"Payment is unavailable for this booking or has already been received.\",\"paymentProcessing\":\"Your payment is being created. Please wait a moment and try again.\",\"paymentFailed\":\"Could not create a Finik payment. Please try again.\",\"telegramNotConfigured\":\"Telegram sign-in is not configured yet. Contact the site owner.\",\"telegramUnavailable\":\"The code could not be sent to Telegram. Please try signing in again later.\",\"adminCodeRequired\":\"Administrator sign-in requires a Telegram code.\",\"invalidAdminCode\":\"Incorrect Telegram code. Check all six digits and try again.\",\"adminCodeExpired\":\"The code has expired or was already used. Start sign-in again.\",\"adminCodeAttempts\":\"The attempt limit was reached. Start sign-in again to receive a new code.\",\"invalidFields\":\"Please check the form fields.\",\"invalidEmail\":\"Enter a valid email address.\",\"invalidPhone\":\"Enter a valid phone number.\",\"passwordLength\":\"Use a password between 10 and 128 characters.\",\"passwordMismatch\":\"Passwords do not match.\",\"emailExists\":\"This email is already registered.\",\"invalidCredentials\":\"Email or password is incorrect.\",\"tooManyAttempts\":\"Too many attempts. Try again in 15 minutes.\",\"invalidDates\":\"Choose future dates for a stay of 1 to 365 nights.\",\"invalidGuests\":\"Check the number of guests and the cabin capacity.\",\"invalidPrice\":\"Check the price range.\",\"cabinUnavailable\":\"This property is not available for booking.\",\"datesUnavailable\":\"The cabin is booked or blocked for these dates.\",\"bookingsDisabled\":\"New bookings are temporarily paused.\",\"notFound\":\"Record not found.\",\"forbidden\":\"You do not have access to this action.\",\"cancellationClosed\":\"The cancellation deadline has passed or this booking cannot be cancelled.\",\"refundRequired\":\"Contact support to cancel a paid booking.\",\"serverError\":\"The action could not be completed. Please try later.\",\"demoUnavailable\":\"Demonstration properties are available only in showcase mode.\",\"demoConfirmationForbidden\":\"A test request cannot be confirmed as a real stay.\",\"uploadFailed\":\"The photograph could not be uploaded.\",\"invalidImage\":\"Use JPEG, PNG or WebP up to 8 MB.\",\"galleryFull\":\"You can upload up to 12 photographs.\",\"photosRequired\":\"Add at least one photograph before publishing.\",\"ownerUnverified\":\"Verify the owner first.\",\"invalidStatus\":\"This status transition is not allowed.\",\"reviewUnavailable\":\"You can review a completed stay once.\",\"lastAdmin\":\"The last active administrator cannot be disabled.\",\"adminPasswordRequired\":\"The user must set a password in their profile before becoming an administrator.\",\"invalidTranslation\":\"The translation key or parameters are invalid.\",\"storageUnavailable\":\"Photo uploads are temporarily unavailable. Please try later or contact support.\",\"slugExists\":\"This address is already taken. Choose another.\",\"googleNotConfigured\":\"Google sign-in is temporarily unavailable. Please sign in with your password.\",\"googleSessionExpired\":\"This sign-in attempt expired. Start Google sign-in again.\",\"googleCancelled\":\"Google sign-in was cancelled. You can try again.\",\"googleFailed\":\"Could not sign in with Google. Please try again.\",\"googleLinkRequired\":\"This email is already registered. Sign in with your password and connect Google in settings.\",\"googleAlreadyLinked\":\"This Google account is linked to another profile, or your profile already has a different Google account.\",\"googleEmailMismatch\":\"Choose the Google account with the same email as your profile.\",\"googleAdminLogin\":\"Administrators must sign in with a password and verification code.\"},\"events\":{\"paymentReceived\":\"Payment received\",\"paymentFailed\":\"Payment failed\",\"paymentRefundRequired\":\"Payment received for a cancelled booking. Contact support for a refund.\",\"bookingCreated\":\"Booking created\",\"bookingReceived\":\"New booking request\",\"bookingCancelled\":\"Booking cancelled\",\"bookingConfirmed\":\"Booking confirmed\",\"bookingRejected\":\"Booking rejected\",\"bookingCompleted\":\"Stay completed\",\"cabinPublished\":\"Cabin published\",\"ownerVerified\":\"Owner profile verified\",\"ownerUpdated\":\"Host profile updated\",\"cabinUpdated\":\"Cabin details updated\",\"cabinCreated\":\"Cabin added\",\"cabinSubmitted\":\"Cabin submitted for review\",\"cabinArchived\":\"Cabin archived\",\"cabinModerated\":\"Cabin status updated\",\"calendarUpdated\":\"Calendar updated\",\"photoUploaded\":\"Photograph added\",\"referenceSaved\":\"Reference list updated\",\"userUpdated\":\"User updated\",\"reviewModerated\":\"Review moderated\",\"translationSaved\":\"Translation updated\",\"settingsSaved\":\"Settings updated\",\"notificationSent\":\"Notification sent\",\"photoRemoved\":\"Photograph removed\"},\"calendar\":{\"months\":[\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"],\"weekdays\":[\"Mo\",\"Tu\",\"We\",\"Th\",\"Fr\",\"Sa\",\"Su\"]},\"paymentStatuses\":{\"PENDING\":\"Awaiting payment\",\"PAID\":\"Paid\",\"FAILED\":\"Not completed\",\"REFUNDED\":\"Refunded\"},\"auth\":{\"loginTab\":\"Sign in\",\"registerTab\":\"Sign up\",\"tabsLabel\":\"Sign in and registration\",\"google\":\"Continue with Google\",\"or\":\"or\",\"back\":\"Back to home\",\"showPassword\":\"Show password\",\"hidePassword\":\"Hide password\",\"pending\":\"Please wait…\",\"passwordHint\":\"10 to 128 characters\",\"legal\":\"By continuing, you accept our\",\"terms\":\"terms of use\",\"and\":\"and\",\"privacy\":\"privacy policy\",\"photoTitle\":\"Your escape starts here.\",\"photoDescription\":\"Cozy cabins. Mountain views. Time for yourself.\",\"googleAccount\":\"Google account\",\"googleLink\":\"Connect Google\",\"googleConnected\":\"Google is connected. Sign in with Google or with your password if you have set one.\",\"setPassword\":\"Create a password\"}}");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/i18n/locales/en/forms.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "choose": "Choose an option",
    "required": "required field",
    "selectDate": "Select a date",
    "close": "Close",
    "clear": "Clear",
    "done": "Done",
    "decrease": "Decrease guest count",
    "increase": "Increase guest count",
    "capacity": "Capacity: up to {count} guests",
    "guestCount": "Number of guests",
    "guestForms": {
        "one": "{count} guest",
        "other": "{count} guests"
    },
    "activeFilters": "Active filters",
    "removeFilter": "Remove filter: {filter}",
    "rangeHint": "Choose check-in, then check-out.",
    "calendarKeyboard": "Arrows: adjacent day; Page Up / Down: month; Home / End: start / end of week.",
    "today": "Today"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/i18n/locales/kg/common.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = JSON.parse("{\"nav\":{\"home\":\"Башкы бет\",\"catalog\":\"Үйлөр\",\"account\":\"Жеке кабинет\",\"owner\":\"Үй ээсинин кабинети\",\"admin\":\"Башкаруу\",\"login\":\"Кирүү\",\"register\":\"Аккаунт түзүү\",\"logout\":\"Чыгуу\",\"favorites\":\"Тандалмалар\",\"bookings\":\"Брондор\",\"profile\":\"Профиль\",\"payments\":\"Төлөмдөр\",\"settings\":\"Жөндөөлөр\",\"notifications\":\"Билдирүүлөр\",\"cabins\":\"Үйлөр\",\"regions\":\"Аймактар\",\"amenities\":\"Ыңгайлуулуктар\",\"users\":\"Колдонуучулар\",\"owners\":\"Үй ээлери\",\"reviews\":\"Пикирлер\",\"activities\":\"Аракеттер\",\"translations\":\"Котормолор\",\"dashboard\":\"Жалпы маалымат\"},\"labels\":{\"loading\":\"Жүктөлүүдө…\",\"save\":\"Сактоо\",\"saving\":\"Сакталууда…\",\"saved\":\"Өзгөртүүлөр сакталды\",\"search\":\"Үй табуу\",\"reset\":\"Чыпкаларды тазалоо\",\"filters\":\"Чыпкалар\",\"q\":\"Аталышы же аймагы\",\"region\":\"Аймак\",\"allRegions\":\"Бардык аймактар\",\"all\":\"Баары\",\"minPrice\":\"Баштапкы баа\",\"maxPrice\":\"Акыркы баа\",\"guests\":\"Коноктор\",\"checkIn\":\"Келүү\",\"checkOut\":\"Кетүү\",\"anyGuests\":\"Каалаган сан\",\"sort\":\"Иреттөө\",\"newest\":\"Адегенде жаңылары\",\"priceAsc\":\"Адегенде арзаны\",\"priceDesc\":\"Адегенде кымбаты\",\"results\":\"Табылды: {count}\",\"noResults\":\"Эч нерсе табылган жок\",\"noResultsHint\":\"Чыпкаларды өзгөртүңүз же бардык үйлөрдү караңыз.\",\"empty\":\"Азырынча маалымат жок\",\"previous\":\"Артка\",\"next\":\"Алга\",\"page\":\"{pages} беттин {page}-бети\",\"details\":\"Кененирээк\",\"currency\":\"сом\",\"perNight\":\"бир түнгө\",\"nightCount\":\"Түндөр: {count}\",\"capacity\":\"{count} конокко чейин\",\"bedrooms\":\"Уктоочу бөлмөлөр\",\"beds\":\"Керебеттер\",\"bathrooms\":\"Жуунуучу бөлмөлөр\",\"noPhoto\":\"Сүрөттөр кошула элек\",\"demo\":\"Көрсөтмө үй\",\"demoHint\":\"Сүрөттөр жана үй көрсөтмө үчүн берилген. Бул ижарага берилүүчү ырасталган сунуш эмес.\",\"demoBook\":\"Сыноо өтүнмөсүн түзүү\",\"demoBooking\":\"Сыноо өтүнмөсү\",\"demoBookingHint\":\"Көрсөтмө режим: сыноо өтүнмөсү гана түзүлөт. Чыныгы жашоо, төлөмдөр жана ээсинин ырастоосу жеткиликтүү эмес.\",\"addFavorite\":\"Үйдү сактоо\",\"removeFavorite\":\"Тандалмалардан чыгаруу\",\"backCatalog\":\"Үйлөргө кайтуу\",\"aboutCabin\":\"Үй жөнүндө\",\"relatedTitle\":\"Сапарга дагы бир аз шыктануу\",\"relatedDescription\":\"Кыргызстандагы кийинки сапарыңыз үчүн башка үйлөр.\",\"rules\":\"Жашоо эрежелери\",\"ownerInfo\":\"Үй ээси\",\"verified\":\"Үй ээси ырасталган\",\"reviewEmpty\":\"Жарыяланган пикирлер жок\",\"availability\":\"Бош күндөр\",\"available\":\"Бош\",\"occupied\":\"Бош эмес же жабык\",\"calendarHint\":\"Кетүү күнү бош эмес түн болуп эсептелбейт. Брондоо алдында бош күндөр кайра текшерилет.\",\"total\":\"Жалпы\",\"subtotal\":\"Жашоо акысы\",\"confirmAvailability\":\"Бош күндөрдү текшерүү\",\"checking\":\"Текшерилүүдө…\",\"chooseDates\":\"Күндөрдү тандоо\",\"book\":\"Брондоо\",\"paymentPending\":\"Finik Pay аркылуу төлөм — 5 сом. Ээлөөнүн маалымат барагынан төлөңүз. Төлөмдүн абалы ырасталгандан кийин жаңыртылат.\",\"pay\":\"Төлөө\",\"paymentCreating\":\"Төлөм түзүлүүдө…\",\"paymentConfirming\":\"Finikтен төлөмдүн ырасталышын күтүп жатабыз. Абал автоматтык түрдө жаңыртылат.\",\"paymentRefresh\":\"Төлөмдү текшерүү\",\"contact\":\"Байланыш маалыматы\",\"name\":\"Аты\",\"lastName\":\"Фамилиясы\",\"email\":\"Email\",\"phone\":\"Телефон\",\"password\":\"Сырсөз\",\"newPassword\":\"Жаңы сырсөз\",\"currentPassword\":\"Учурдагы сырсөз\",\"confirmPassword\":\"Сырсөздү кайталаңыз\",\"passwordHint\":\"Кеминде 10 белги. Сырсөз корголгон хеш түрүндө гана сакталат.\",\"role\":\"Ролу\",\"traveler\":\"Саякатчы\",\"ownerRole\":\"Үй ээси\",\"ownerRegistration\":\"Үй ээлеринин үйлөрү администратордун текшерүүсүнөн кийин жарыяланат.\",\"haveAccount\":\"Аккаунтуңуз барбы?\",\"noAccount\":\"Аккаунтуңуз жокпу?\",\"bookingNumber\":\"Брон номери\",\"status\":\"Абалы\",\"createdAt\":\"Түзүлгөн күнү\",\"cancelUntil\":\"Акысыз жокко чыгарууга уруксат берилген убакыт\",\"cancellationPolicy\":\"Келүүгө кеминде {hours} саат калганда жокко чыгарууга болот.\",\"cancel\":\"Бронду жокко чыгаруу\",\"reason\":\"Себеби\",\"cancelHint\":\"Жокко чыгаруу күндөрдү бошотот. Төлөм алынган болсо, кайтарууну колдоо кызматы менен макулдашуу керек.\",\"paymentMethod\":\"Төлөм ыкмасы\",\"paymentAwaiting\":\"Төлөм кызматынын туташуусун күтөт\",\"notificationRead\":\"Окулган деп белгилөө\",\"review\":\"Пикир калтыруу\",\"rating\":\"Баалоо\",\"reviewText\":\"Сиздин таасириңиз\",\"reviewHint\":\"Пикирди аяктаган сапардан кийин калтырууга болот. Ал модерациядан өтөт.\",\"language\":\"Сайттын тили\",\"updatePassword\":\"Сырсөздү өзгөртүү\",\"title\":\"Аталышы\",\"description\":\"Сүрөттөмөсү\",\"slug\":\"Каталогдогу дарек\",\"city\":\"Шаар\",\"village\":\"Айыл\",\"address\":\"Дареги\",\"price\":\"Бир түндүн баасы\",\"photos\":\"Сүрөттөр\",\"upload\":\"Сүрөт жүктөө\",\"uploadHint\":\"JPEG, PNG же WebP, 8 МБ жана 25 мегапикселге чейин. Өз үйүңүздүн сүрөттөрүн гана жүктөңүз.\",\"removePhoto\":\"Сүрөттү өчүрүү\",\"edit\":\"Өзгөртүү\",\"addCabin\":\"Үй кошуу\",\"draft\":\"Долбоорду сактоо\",\"submitReview\":\"Текшерүүгө жөнөтүү\",\"publishHint\":\"Жарыялоо үчүн сүрөттөр, сүрөттөмө жана ырасталган үй ээсинин профили керек.\",\"cancellationHours\":\"Келүүгө чейинки жокко чыгаруу мөөнөтү, саат\",\"houseRules\":\"Эрежелер, ар бири өзүнчө сапта\",\"businessName\":\"Ишкердик аталышы\",\"ownerDescription\":\"Үй ээси жөнүндө\",\"ownerPhone\":\"Үй ээсинин байланыш телефону\",\"archive\":\"Архивге өткөрүү\",\"blockDates\":\"Күндөрдү жабуу\",\"openDates\":\"Күндөрдү ачуу\",\"calendarPrice\":\"Тандалган түндөрдүн баасы\",\"optional\":\"Милдеттүү эмес\",\"calendarManageHint\":\"Өзгөртүүлөр башталган күндөн аяктаган күнгө чейинки түндөргө колдонулат. Аяктаган күн кирбейт. Брондолгон күндөрдү өзгөртүүгө болбойт.\",\"confirm\":\"Ырастоо\",\"reject\":\"Четке кагуу\",\"complete\":\"Жашоону аяктоо\",\"ownerStatusHint\":\"Бронду ырастоо төлөм алынганын билдирбейт. Жашоону кетүү күнүнөн кийин аяктоого болот.\",\"ownerPending\":\"Профиль администратордун текшерүүсүн күтөт. Долбоорлорду түзүп, модерацияга жөнөтө аласыз.\",\"income\":\"Алынган төлөмдөр\",\"published\":\"Жарыяланды\",\"activeBookings\":\"Активдүү брондор\",\"active\":\"Активдүү\",\"inactive\":\"Өчүрүлгөн\",\"enable\":\"Иштетүү\",\"disable\":\"Өчүрүү\",\"verifyOwner\":\"Үй ээсин ырастоо\",\"publish\":\"Жарыялоо\",\"hide\":\"Жашыруу\",\"block\":\"Бөгөттөө\",\"add\":\"Кошуу\",\"noData\":\"Жазуулар жок\",\"user\":\"Колдонуучу\",\"cabin\":\"Үй\",\"amount\":\"Сумма\",\"action\":\"Аракет\",\"entity\":\"Аракеттин объекти\",\"locale\":\"Тил\",\"namespace\":\"Бет\",\"key\":\"Текст ачкычы\",\"value\":\"Котормо тексти\",\"removeOverride\":\"JSON котормосун калыбына келтирүү\",\"supportEmail\":\"Колдоо кызматынын Email дареги\",\"bookingsEnabled\":\"Брондорду кабыл алуу\",\"externalServices\":\"Тышкы кызматтар\",\"integrationsPending\":\"Finik Pay жана сайттагы билдирүүлөр иштейт. SMS жана Email жөнөтүү туташтырыла элек.\",\"denied\":\"Кирүүгө уруксат жок\",\"backHome\":\"Башкы бетке\",\"ru\":\"Орусча\",\"kg\":\"Кыргызча\",\"en\":\"Англисче\",\"statistics\":\"База маалыматтары боюнча статистика\",\"read\":\"Окулду\",\"notRead\":\"Жаңы\",\"hostContacts\":\"Үй ээсинин байланыштары\",\"bookingsHint\":\"Брон жана төлөм абалдары чыныгы аракеттер боюнча жаңыланат; ийгиликтүү төлөм жасалмаланбайт.\",\"phonePrivate\":\"Байланыштар конокко, үй ээсине жана администраторго гана жеткиликтүү.\",\"retry\":\"Кайталоо\",\"becomeOwner\":\"Үй ээси болуу\",\"settingsSaved\":\"Тандоолор сакталды\",\"emptyCatalog\":\"Алгачкы үйлөр ээлери текшерилгенден кийин чыгат. Баштоо үчүн үйүңүздү кошуңуз.\",\"resetCalendar\":\"Жеке бааны алып салуу\",\"sendNotification\":\"Билдирүү жөнөтүү\",\"recipient\":\"Алуучунун ID номери\",\"message\":\"Билдирүү\"},\"statuses\":{\"PENDING\":\"Ырастоону күтөт\",\"CONFIRMED\":\"Ырасталды\",\"CANCELLED\":\"Жокко чыгарылды\",\"COMPLETED\":\"Аяктады\",\"REJECTED\":\"Четке кагылды\",\"DRAFT\":\"Долбоор\",\"PUBLISHED\":\"Жарыяланды\",\"BLOCKED\":\"Бөгөттөлдү\",\"ARCHIVED\":\"Архивде\",\"PAID\":\"Төлөндү\",\"FAILED\":\"Аткарылган жок\",\"REFUNDED\":\"Кайтарылды\",\"VERIFIED\":\"Ырасталган\",\"USER\":\"Колдонуучу\",\"OWNER\":\"Үй ээси\",\"ADMIN\":\"Администратор\",\"HIDDEN\":\"Жашырылды\",\"AVAILABLE\":\"Бош\",\"BOOKED\":\"Бош эмес\"},\"errors\":{\"unauthorized\":\"Ээлөөнү төлөө үчүн аккаунтуңузга кириңиз.\",\"paymentUnavailable\":\"Бул ээлөөгө төлөм жеткиликсиз же төлөм кабыл алынган.\",\"paymentProcessing\":\"Төлөм түзүлүп жатат. Бир аз күтүп, кайра аракет кылыңыз.\",\"paymentFailed\":\"Finik төлөмү түзүлгөн жок. Кайра аракет кылыңыз.\",\"telegramNotConfigured\":\"Кирүү үчүн Telegram азырынча жөндөлгөн эмес. Сайттын ээсине кайрылыңыз.\",\"telegramUnavailable\":\"Кодду Telegram аркылуу жөнөтүү мүмкүн болгон жок. Кийинчерээк кайра кирип көрүңүз.\",\"adminCodeRequired\":\"Администратордун кирүүсү үчүн Telegram коду керек.\",\"invalidAdminCode\":\"Telegram коду туура эмес. Алты цифраны текшерип, кайра киргизиңиз.\",\"adminCodeExpired\":\"Коддун мөөнөтү бүттү же колдонулду. Кирүүнү кайра баштаңыз.\",\"adminCodeAttempts\":\"Аракеттердин чеги бүттү. Жаңы код алуу үчүн кирүүнү кайра баштаңыз.\",\"invalidFields\":\"Талаалардын толтурулушун текшериңиз.\",\"invalidEmail\":\"Туура Email дарегин киргизиңиз.\",\"invalidPhone\":\"Туура телефон номерин киргизиңиз.\",\"passwordLength\":\"Сырсөз 10дон 128ге чейин белги болушу керек.\",\"passwordMismatch\":\"Сырсөздөр дал келбейт.\",\"emailExists\":\"Бул Email дареги катталган.\",\"invalidCredentials\":\"Email же сырсөз туура эмес.\",\"tooManyAttempts\":\"Аракеттер өтө көп. 15 мүнөттөн кийин кайталаңыз.\",\"invalidDates\":\"Келечектеги күндөрдү тандаңыз: 1ден 365ке чейин түн.\",\"invalidGuests\":\"Коноктордун санын жана үйдүн сыйымдуулугун текшериңиз.\",\"invalidPrice\":\"Баалардын чегин текшериңиз.\",\"cabinUnavailable\":\"Бул үйдү брондоого болбойт.\",\"datesUnavailable\":\"Тандалган күндөрдө үй бош эмес же жабык.\",\"bookingsDisabled\":\"Жаңы брондорду кабыл алуу убактылуу токтотулган.\",\"notFound\":\"Жазуу табылган жок.\",\"forbidden\":\"Бул аракетке уруксатыңыз жок.\",\"cancellationClosed\":\"Жокко чыгаруу мөөнөтү аяктаган же брондун абалы уруксат бербейт.\",\"refundRequired\":\"Төлөнгөн бронду жокко чыгаруу үчүн колдоо кызматына кайрылыңыз.\",\"serverError\":\"Аракет аткарылган жок. Кийинчерээк кайталаңыз.\",\"demoUnavailable\":\"Көрсөтмө үйлөр көрсөтүү режиминде гана жеткиликтүү.\",\"demoConfirmationForbidden\":\"Сыноо өтүнмөсүн чыныгы жашоо катары ырастоого болбойт.\",\"uploadFailed\":\"Сүрөт жүктөлгөн жок.\",\"invalidImage\":\"8 МБ чейин JPEG, PNG жана WebP колдоого алынат.\",\"galleryFull\":\"12ден көп сүрөт жүктөөгө болбойт.\",\"photosRequired\":\"Жарыялоодон мурун кеминде бир сүрөт кошуңуз.\",\"ownerUnverified\":\"Алгач үй ээсин ырастоо керек.\",\"invalidStatus\":\"Бул абалга өтүүгө болбойт.\",\"reviewUnavailable\":\"Пикирди аяктаган жашоодон кийин бир жолу калтыра аласыз.\",\"lastAdmin\":\"Акыркы активдүү администраторду өчүрүүгө болбойт.\",\"adminPasswordRequired\":\"Администратор болуп дайындалганга чейин колдонуучу профилинде сырсөз түзүшү керек.\",\"invalidTranslation\":\"Котормонун ачкычы же параметрлери туура эмес.\",\"storageUnavailable\":\"Сүрөт жүктөө убактылуу жеткиликсиз. Кийинчерээк кайталаңыз же колдоо кызматына кайрылыңыз.\",\"slugExists\":\"Бул дарек колдонулууда. Башкасын тандаңыз.\",\"googleNotConfigured\":\"Google аркылуу кирүү убактылуу жеткиликсиз. Сырсөз менен кириңиз.\",\"googleSessionExpired\":\"Кирүү убактысы бүттү. Google аркылуу кайра кириңиз.\",\"googleCancelled\":\"Google аркылуу кирүү жокко чыгарылды. Кайра аракет кылсаңыз болот.\",\"googleFailed\":\"Google аркылуу кирүү мүмкүн болгон жок. Кайра аракет кылыңыз.\",\"googleLinkRequired\":\"Бул email мурун катталган. Сырсөз менен кирип, жөндөөлөрдөн Google аккаунтун туташтырыңыз.\",\"googleAlreadyLinked\":\"Бул Google аккаунту башка профилге туташтырылган же сиздин профилиңизде башка Google аккаунту бар.\",\"googleEmailMismatch\":\"Профилиңиздеги email менен бирдей Google аккаунтун тандаңыз.\",\"googleAdminLogin\":\"Администратор сырсөз жана ырастоо коду менен кириши керек.\"},\"events\":{\"paymentReceived\":\"Төлөм кабыл алынды\",\"paymentFailed\":\"Төлөм аткарылган жок\",\"paymentRefundRequired\":\"Жокко чыгарылган ээлөө үчүн төлөм кабыл алынды. Акчаны кайтаруу үчүн колдоо кызматына кайрылыңыз.\",\"bookingCreated\":\"Брон түзүлдү\",\"bookingReceived\":\"Жаңы брон суроо-талабы\",\"bookingCancelled\":\"Брон жокко чыгарылды\",\"bookingConfirmed\":\"Брон ырасталды\",\"bookingRejected\":\"Брон четке кагылды\",\"bookingCompleted\":\"Жашоо аяктады\",\"cabinPublished\":\"Үй жарыяланды\",\"ownerVerified\":\"Үй ээсинин профили ырасталды\",\"ownerUpdated\":\"Үй ээсинин профили жаңырды\",\"cabinUpdated\":\"Үйдүн маалыматы жаңырды\",\"cabinCreated\":\"Үй кошулду\",\"cabinSubmitted\":\"Үй текшерүүгө жөнөтүлдү\",\"cabinArchived\":\"Үй архивделди\",\"cabinModerated\":\"Үйдүн абалы өзгөрдү\",\"calendarUpdated\":\"Календарь жаңырды\",\"photoUploaded\":\"Сүрөт кошулду\",\"referenceSaved\":\"Маалыматтык тизме жаңырды\",\"userUpdated\":\"Колдонуучу жаңырды\",\"reviewModerated\":\"Пикир текшерилди\",\"translationSaved\":\"Котормо жаңырды\",\"settingsSaved\":\"Жөндөөлөр жаңырды\",\"notificationSent\":\"Билдирүү жөнөтүлдү\",\"photoRemoved\":\"Сүрөт өчүрүлдү\"},\"calendar\":{\"months\":[\"Январь\",\"Февраль\",\"Март\",\"Апрель\",\"Май\",\"Июнь\",\"Июль\",\"Август\",\"Сентябрь\",\"Октябрь\",\"Ноябрь\",\"Декабрь\"],\"weekdays\":[\"Дш\",\"Шш\",\"Шр\",\"Бш\",\"Жм\",\"Иш\",\"Жк\"]},\"paymentStatuses\":{\"PENDING\":\"Төлөмдү күтөт\",\"PAID\":\"Төлөндү\",\"FAILED\":\"Аткарылган жок\",\"REFUNDED\":\"Кайтарылды\"},\"auth\":{\"loginTab\":\"Кирүү\",\"registerTab\":\"Катталуу\",\"tabsLabel\":\"Кирүү жана катталуу\",\"google\":\"Google менен улантуу\",\"or\":\"же\",\"back\":\"Башкы бетке\",\"showPassword\":\"Сырсөздү көрсөтүү\",\"hidePassword\":\"Сырсөздү жашыруу\",\"pending\":\"Күтө туруңуз…\",\"passwordHint\":\"10дон 128ге чейин белги\",\"legal\":\"Улантуу менен сиз\",\"terms\":\"колдонуу шарттарын\",\"and\":\"жана\",\"privacy\":\"купуялык саясатын кабыл аласыз\",\"photoTitle\":\"Эс алууңуз ушул жерден башталат.\",\"photoDescription\":\"Жайлуу үйлөр. Тоо көрүнүштөрү. Өзүңүзгө убакыт.\",\"googleAccount\":\"Google аккаунту\",\"googleLink\":\"Google аккаунтун туташтыруу\",\"googleConnected\":\"Google туташтырылды. Google аркылуу же орнотулган сырсөз менен кире аласыз.\",\"setPassword\":\"Сырсөз түзүү\"}}");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/i18n/locales/kg/forms.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "choose": "Вариантты тандаңыз",
    "required": "милдеттүү талаа",
    "selectDate": "Күндү тандаңыз",
    "close": "Жабуу",
    "clear": "Тазалоо",
    "done": "Даяр",
    "decrease": "Коноктордун санын азайтуу",
    "increase": "Коноктордун санын көбөйтүү",
    "capacity": "Батат: {count} конокко чейин",
    "guestCount": "Коноктордун саны",
    "guestForms": {
        "one": "{count} конок",
        "other": "{count} конок"
    },
    "activeFilters": "Активдүү чыпкалар",
    "removeFilter": "Чыпканы алып салуу: {filter}",
    "rangeHint": "Алгач келүү, андан соң кетүү күнүн тандаңыз.",
    "calendarKeyboard": "Жебелер — кошуна күн; Page Up / Down — ай; Home / End — жуманын башы / аягы.",
    "today": "Бүгүн"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/i18n/locales/ru/common.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = JSON.parse("{\"nav\":{\"home\":\"Главная\",\"catalog\":\"Домики\",\"account\":\"Личный кабинет\",\"owner\":\"Кабинет владельца\",\"admin\":\"Администрирование\",\"login\":\"Войти\",\"register\":\"Создать аккаунт\",\"logout\":\"Выйти\",\"favorites\":\"Избранное\",\"bookings\":\"Бронирования\",\"profile\":\"Профиль\",\"payments\":\"Оплаты\",\"settings\":\"Настройки\",\"notifications\":\"Уведомления\",\"cabins\":\"Объекты\",\"regions\":\"Регионы\",\"amenities\":\"Удобства\",\"users\":\"Пользователи\",\"owners\":\"Владельцы\",\"reviews\":\"Отзывы\",\"activities\":\"Активности\",\"translations\":\"Переводы\",\"dashboard\":\"Обзор\"},\"labels\":{\"loading\":\"Загрузка…\",\"save\":\"Сохранить\",\"saving\":\"Сохраняем…\",\"saved\":\"Изменения сохранены\",\"search\":\"Найти домик\",\"reset\":\"Сбросить фильтры\",\"filters\":\"Фильтры\",\"q\":\"Название или регион\",\"region\":\"Регион\",\"allRegions\":\"Все регионы\",\"all\":\"Все\",\"minPrice\":\"Цена от\",\"maxPrice\":\"Цена до\",\"guests\":\"Гости\",\"checkIn\":\"Заезд\",\"checkOut\":\"Выезд\",\"anyGuests\":\"Любое число\",\"sort\":\"Сортировка\",\"newest\":\"Новые сначала\",\"priceAsc\":\"Сначала дешевле\",\"priceDesc\":\"Сначала дороже\",\"results\":\"Найдено: {count}\",\"noResults\":\"Ничего не найдено\",\"noResultsHint\":\"Измените фильтры или вернитесь к полной подборке.\",\"empty\":\"Пока здесь пусто\",\"previous\":\"Назад\",\"next\":\"Далее\",\"page\":\"Страница {page} из {pages}\",\"details\":\"Подробнее\",\"currency\":\"сом\",\"perNight\":\"за ночь\",\"nightCount\":\"Ночей: {count}\",\"capacity\":\"До {count} гостей\",\"bedrooms\":\"Спальни\",\"beds\":\"Кровати\",\"bathrooms\":\"Ванные комнаты\",\"noPhoto\":\"Фотографии ещё не добавлены\",\"demo\":\"Демонстрационный объект\",\"demoHint\":\"Фотографии и объект представлены для демонстрации. Это не подтверждённое предложение аренды.\",\"demoBook\":\"Создать тестовую заявку\",\"demoBooking\":\"Тестовая заявка\",\"demoBookingHint\":\"Демонстрационный режим: создаётся только тестовая заявка. Проживание, платежи и подтверждение владельцем недоступны.\",\"addFavorite\":\"Сохранить домик\",\"removeFavorite\":\"Убрать из избранного\",\"backCatalog\":\"Вернуться к домикам\",\"aboutCabin\":\"О домике\",\"relatedTitle\":\"Ещё немного вдохновения\",\"relatedDescription\":\"Другие домики для вашего следующего путешествия по Кыргызстану.\",\"rules\":\"Правила проживания\",\"ownerInfo\":\"Ваш хозяин\",\"verified\":\"Владелец подтверждён\",\"reviewEmpty\":\"Пока нет опубликованных отзывов\",\"availability\":\"Доступность\",\"available\":\"Свободно\",\"occupied\":\"Занято или закрыто\",\"calendarHint\":\"День выезда не считается занятой ночью. Перед оформлением доступность проверяется повторно.\",\"total\":\"Итого\",\"subtotal\":\"Проживание\",\"confirmAvailability\":\"Проверить доступность\",\"checking\":\"Проверяем…\",\"chooseDates\":\"Выбрать даты\",\"book\":\"Оформить бронирование\",\"paymentPending\":\"Оплата через Finik Pay — 5 сомов. Перейдите к оплате в деталях брони. Статус обновится после подтверждения платежа.\",\"pay\":\"Оплатить\",\"paymentCreating\":\"Создание платежа…\",\"paymentConfirming\":\"Ожидаем подтверждение оплаты от Finik. Статус обновится автоматически.\",\"paymentRefresh\":\"Проверить оплату\",\"contact\":\"Контактные данные\",\"name\":\"Имя\",\"lastName\":\"Фамилия\",\"email\":\"Email\",\"phone\":\"Телефон\",\"password\":\"Пароль\",\"newPassword\":\"Новый пароль\",\"currentPassword\":\"Текущий пароль\",\"confirmPassword\":\"Повторите пароль\",\"passwordHint\":\"Минимум 10 символов. Пароль хранится только в виде защищённого хеша.\",\"role\":\"Роль\",\"traveler\":\"Путешественник\",\"ownerRole\":\"Владелец домика\",\"ownerRegistration\":\"Объекты владельцев публикуются после проверки администратором.\",\"haveAccount\":\"Уже есть аккаунт?\",\"noAccount\":\"Нет аккаунта?\",\"bookingNumber\":\"Номер бронирования\",\"status\":\"Статус\",\"createdAt\":\"Создано\",\"cancelUntil\":\"Бесплатная отмена доступна до\",\"cancellationPolicy\":\"Отмена доступна не позднее чем за {hours} ч. до заезда.\",\"cancel\":\"Отменить бронирование\",\"reason\":\"Причина\",\"cancelHint\":\"Отмена освобождает даты. Если оплата уже получена, потребуется согласовать возврат с поддержкой.\",\"paymentMethod\":\"Способ оплаты\",\"paymentAwaiting\":\"Ожидает подключения платёжного сервиса\",\"notificationRead\":\"Отметить прочитанным\",\"review\":\"Оставить отзыв\",\"rating\":\"Оценка\",\"reviewText\":\"Ваши впечатления\",\"reviewHint\":\"Отзывы доступны после завершённого проживания и проходят модерацию.\",\"language\":\"Язык интерфейса\",\"updatePassword\":\"Изменить пароль\",\"title\":\"Название\",\"description\":\"Описание\",\"slug\":\"Адрес в каталоге\",\"city\":\"Город\",\"village\":\"Село\",\"address\":\"Адрес\",\"price\":\"Цена за ночь\",\"photos\":\"Фотографии\",\"upload\":\"Загрузить фото\",\"uploadHint\":\"JPEG, PNG или WebP, до 8 МБ и 25 мегапикселей. Загружайте только фотографии своего объекта.\",\"removePhoto\":\"Удалить фото\",\"edit\":\"Редактировать\",\"addCabin\":\"Добавить домик\",\"draft\":\"Сохранить черновик\",\"submitReview\":\"Отправить на проверку\",\"publishHint\":\"Для публикации нужны фотографии, описание и подтверждённый профиль владельца.\",\"cancellationHours\":\"Срок отмены до заезда, часов\",\"houseRules\":\"Правила, по одному на строку\",\"businessName\":\"Название бизнеса\",\"ownerDescription\":\"О владельце\",\"ownerPhone\":\"Контактный телефон хозяина\",\"archive\":\"Архивировать\",\"blockDates\":\"Закрыть даты\",\"openDates\":\"Открыть даты\",\"calendarPrice\":\"Цена для выбранных ночей\",\"optional\":\"Необязательно\",\"calendarManageHint\":\"Изменения действуют для ночей от даты начала до даты окончания, не включая день окончания. Занятые даты нельзя перезаписать.\",\"confirm\":\"Подтвердить\",\"reject\":\"Отклонить\",\"complete\":\"Завершить проживание\",\"ownerStatusHint\":\"Подтверждение брони не означает получение оплаты. Завершение возможно после выезда.\",\"ownerPending\":\"Профиль ожидает проверки администратора. Можно создавать черновики и отправлять их на модерацию.\",\"income\":\"Полученные оплаты\",\"published\":\"Опубликовано\",\"activeBookings\":\"Активные брони\",\"active\":\"Активен\",\"inactive\":\"Отключён\",\"enable\":\"Включить\",\"disable\":\"Отключить\",\"verifyOwner\":\"Подтвердить владельца\",\"publish\":\"Опубликовать\",\"hide\":\"Скрыть\",\"block\":\"Заблокировать\",\"add\":\"Добавить\",\"noData\":\"Нет записей\",\"user\":\"Пользователь\",\"cabin\":\"Домик\",\"amount\":\"Сумма\",\"action\":\"Действие\",\"entity\":\"Объект действия\",\"locale\":\"Язык\",\"namespace\":\"Страница\",\"key\":\"Ключ текста\",\"value\":\"Текст перевода\",\"removeOverride\":\"Восстановить перевод из JSON\",\"supportEmail\":\"Email поддержки\",\"bookingsEnabled\":\"Принимать бронирования\",\"externalServices\":\"Внешние сервисы\",\"integrationsPending\":\"Оплата через Finik Pay и уведомления внутри сайта работают. SMS и email-рассылки ещё не подключены.\",\"denied\":\"Доступ ограничен\",\"backHome\":\"На главную\",\"ru\":\"Русский\",\"kg\":\"Кыргызский\",\"en\":\"Английский\",\"statistics\":\"Статистика по данным базы\",\"read\":\"Прочитано\",\"notRead\":\"Новое\",\"hostContacts\":\"Контакты хозяина\",\"bookingsHint\":\"Статусы заказов и оплат обновляются по реальным действиям; успешная оплата не имитируется.\",\"phonePrivate\":\"Контакты доступны только гостю, владельцу объекта и администратору.\",\"retry\":\"Повторить\",\"becomeOwner\":\"Стать владельцем\",\"settingsSaved\":\"Предпочтения сохранены\",\"emptyCatalog\":\"Первые домики появятся после проверки владельцев. Добавьте свой объект, чтобы начать.\",\"resetCalendar\":\"Убрать индивидуальную цену\",\"sendNotification\":\"Отправить уведомление\",\"recipient\":\"ID получателя\",\"message\":\"Сообщение\"},\"statuses\":{\"PENDING\":\"Ожидает подтверждения\",\"CONFIRMED\":\"Подтверждено\",\"CANCELLED\":\"Отменено\",\"COMPLETED\":\"Завершено\",\"REJECTED\":\"Отклонено\",\"DRAFT\":\"Черновик\",\"PUBLISHED\":\"Опубликовано\",\"BLOCKED\":\"Заблокировано\",\"ARCHIVED\":\"В архиве\",\"PAID\":\"Оплачено\",\"FAILED\":\"Не выполнено\",\"REFUNDED\":\"Возвращено\",\"VERIFIED\":\"Подтверждён\",\"USER\":\"Пользователь\",\"OWNER\":\"Владелец\",\"ADMIN\":\"Администратор\",\"HIDDEN\":\"Скрыто\",\"AVAILABLE\":\"Свободно\",\"BOOKED\":\"Занято\"},\"errors\":{\"unauthorized\":\"Войдите в аккаунт, чтобы оплатить бронирование.\",\"paymentUnavailable\":\"Оплата этой брони недоступна или уже получена.\",\"paymentProcessing\":\"Платёж уже создаётся. Подождите немного и повторите попытку.\",\"paymentFailed\":\"Не удалось создать платёж в Finik. Попробуйте ещё раз.\",\"telegramNotConfigured\":\"Telegram для входа ещё не настроен. Обратитесь к владельцу сайта.\",\"telegramUnavailable\":\"Не удалось отправить код в Telegram. Попробуйте войти снова позже.\",\"adminCodeRequired\":\"Для входа администратора требуется код из Telegram.\",\"invalidAdminCode\":\"Неверный код из Telegram. Проверьте шесть цифр и попробуйте ещё раз.\",\"adminCodeExpired\":\"Код истёк или уже использован. Начните вход заново.\",\"adminCodeAttempts\":\"Лимит попыток исчерпан. Начните вход заново, чтобы получить новый код.\",\"invalidFields\":\"Проверьте заполнение полей.\",\"invalidEmail\":\"Введите корректный email.\",\"invalidPhone\":\"Введите корректный номер телефона.\",\"passwordLength\":\"Пароль должен содержать от 10 до 128 символов.\",\"passwordMismatch\":\"Пароли не совпадают.\",\"emailExists\":\"Этот email уже зарегистрирован.\",\"invalidCredentials\":\"Email или пароль неверны.\",\"tooManyAttempts\":\"Слишком много попыток. Повторите через 15 минут.\",\"invalidDates\":\"Выберите будущие даты: от 1 до 365 ночей.\",\"invalidGuests\":\"Проверьте количество гостей и вместимость домика.\",\"invalidPrice\":\"Проверьте диапазон цен.\",\"cabinUnavailable\":\"Этот объект недоступен для бронирования.\",\"datesUnavailable\":\"На выбранные даты домик уже занят или закрыт.\",\"bookingsDisabled\":\"Приём новых бронирований временно приостановлен.\",\"notFound\":\"Запись не найдена.\",\"forbidden\":\"У вас нет доступа к этому действию.\",\"cancellationClosed\":\"Срок отмены истёк или статус заказа не допускает отмену.\",\"refundRequired\":\"Для отмены оплаченной брони обратитесь в поддержку.\",\"serverError\":\"Не удалось выполнить действие. Попробуйте позже.\",\"demoUnavailable\":\"Демонстрационные объекты доступны только в режиме показа.\",\"demoConfirmationForbidden\":\"Тестовую заявку нельзя подтвердить как реальное проживание.\",\"uploadFailed\":\"Не удалось загрузить фотографию.\",\"invalidImage\":\"Поддерживаются JPEG, PNG и WebP до 8 МБ.\",\"galleryFull\":\"Можно загрузить не более 12 фотографий.\",\"photosRequired\":\"Добавьте хотя бы одну фотографию перед публикацией.\",\"ownerUnverified\":\"Сначала подтвердите владельца.\",\"invalidStatus\":\"Этот переход статуса недоступен.\",\"reviewUnavailable\":\"Отзыв можно оставить один раз после завершённого проживания.\",\"lastAdmin\":\"Нельзя отключить последнего активного администратора.\",\"adminPasswordRequired\":\"Перед назначением администратором пользователь должен установить пароль в профиле.\",\"invalidTranslation\":\"Ключ или параметры перевода неверны.\",\"storageUnavailable\":\"Загрузка фотографий временно недоступна. Попробуйте позже или обратитесь в поддержку.\",\"slugExists\":\"Такой адрес уже занят. Выберите другой.\",\"googleNotConfigured\":\"Вход через Google временно недоступен. Попробуйте войти с паролем.\",\"googleSessionExpired\":\"Время ожидания истекло. Начните вход через Google заново.\",\"googleCancelled\":\"Вход через Google отменён. Вы можете повторить попытку.\",\"googleFailed\":\"Не удалось войти через Google. Попробуйте ещё раз.\",\"googleLinkRequired\":\"Этот email уже зарегистрирован. Войдите с паролем и подключите Google в настройках.\",\"googleAlreadyLinked\":\"Этот аккаунт Google уже подключён к другому профилю либо к вашему профилю подключён другой аккаунт.\",\"googleEmailMismatch\":\"Выберите аккаунт Google с тем же email, что указан в вашем профиле.\",\"googleAdminLogin\":\"Для администратора используйте вход с паролем и кодом подтверждения.\"},\"events\":{\"paymentReceived\":\"Оплата получена\",\"paymentFailed\":\"Оплата не выполнена\",\"paymentRefundRequired\":\"Получена оплата отменённой брони. Обратитесь в поддержку для возврата.\",\"bookingCreated\":\"Бронирование создано\",\"bookingReceived\":\"Новая заявка на бронирование\",\"bookingCancelled\":\"Бронирование отменено\",\"bookingConfirmed\":\"Бронирование подтверждено\",\"bookingRejected\":\"Бронирование отклонено\",\"bookingCompleted\":\"Проживание завершено\",\"cabinPublished\":\"Домик опубликован\",\"ownerVerified\":\"Профиль владельца подтверждён\",\"ownerUpdated\":\"Профиль владельца обновлён\",\"cabinUpdated\":\"Данные домика обновлены\",\"cabinCreated\":\"Домик добавлен\",\"cabinSubmitted\":\"Домик отправлен на проверку\",\"cabinArchived\":\"Домик архивирован\",\"cabinModerated\":\"Статус домика изменён\",\"calendarUpdated\":\"Календарь обновлён\",\"photoUploaded\":\"Фотография добавлена\",\"referenceSaved\":\"Справочник обновлён\",\"userUpdated\":\"Пользователь обновлён\",\"reviewModerated\":\"Отзыв проверен\",\"translationSaved\":\"Перевод обновлён\",\"settingsSaved\":\"Настройки обновлены\",\"notificationSent\":\"Уведомление отправлено\",\"photoRemoved\":\"Фотография удалена\"},\"calendar\":{\"months\":[\"Январь\",\"Февраль\",\"Март\",\"Апрель\",\"Май\",\"Июнь\",\"Июль\",\"Август\",\"Сентябрь\",\"Октябрь\",\"Ноябрь\",\"Декабрь\"],\"weekdays\":[\"Пн\",\"Вт\",\"Ср\",\"Чт\",\"Пт\",\"Сб\",\"Вс\"]},\"paymentStatuses\":{\"PENDING\":\"Ожидает оплаты\",\"PAID\":\"Оплачено\",\"FAILED\":\"Не выполнено\",\"REFUNDED\":\"Возвращено\"},\"auth\":{\"loginTab\":\"Вход\",\"registerTab\":\"Регистрация\",\"tabsLabel\":\"Вход и регистрация\",\"google\":\"Продолжить с Google\",\"or\":\"или\",\"back\":\"На главную\",\"showPassword\":\"Показать пароль\",\"hidePassword\":\"Скрыть пароль\",\"pending\":\"Подождите…\",\"passwordHint\":\"От 10 до 128 символов\",\"legal\":\"Продолжая, вы принимаете\",\"terms\":\"условия использования\",\"and\":\"и\",\"privacy\":\"политику конфиденциальности\",\"photoTitle\":\"Ваш отдых начинается здесь.\",\"photoDescription\":\"Уютные домики. Горные пейзажи. Время для себя.\",\"googleAccount\":\"Аккаунт Google\",\"googleLink\":\"Подключить Google\",\"googleConnected\":\"Google подключён. Вы можете входить через Google или с паролем, если он установлен.\",\"setPassword\":\"Создать пароль\"}}");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/i18n/locales/ru/forms.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "choose": "Выберите вариант",
    "required": "обязательное поле",
    "selectDate": "Выберите дату",
    "close": "Закрыть",
    "clear": "Очистить",
    "done": "Готово",
    "decrease": "Уменьшить число гостей",
    "increase": "Увеличить число гостей",
    "capacity": "Вместимость: до {count} гостей",
    "guestCount": "Количество гостей",
    "guestForms": {
        "one": "{count} гость",
        "few": "{count} гостя",
        "many": "{count} гостей",
        "other": "{count} гостей"
    },
    "activeFilters": "Активные фильтры",
    "removeFilter": "Убрать фильтр: {filter}",
    "rangeHint": "Выберите заезд, затем выезд.",
    "calendarKeyboard": "Стрелки — соседний день; Page Up / Down — месяц; Home / End — начало / конец недели.",
    "today": "Сегодня"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1l3mp5zkkl9n7._.js.map