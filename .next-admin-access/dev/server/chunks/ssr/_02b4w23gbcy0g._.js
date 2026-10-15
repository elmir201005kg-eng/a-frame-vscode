module.exports = [
(()=>{"use strict";return[
"[project]/app/[locale]/(administration)/admin/error.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$ru$2f$admin$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/ru/admin.json.[json].cjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$kg$2f$admin$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/kg/admin.json.[json].cjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$en$2f$admin$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/i18n/locales/en/admin.json.[json].cjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function AdminError({ reset }) {
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])().split("/")[1];
    const text = (locale === "kg" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$kg$2f$admin$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] : locale === "en" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$en$2f$admin$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$i18n$2f$locales$2f$ru$2f$admin$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]).dashboard;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "admin-panel admin-error",
        role: "alert",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                size: 32
            }, void 0, false, {
                fileName: "[project]/app/[locale]/(administration)/admin/error.tsx",
                lineNumber: 10,
                columnNumber: 68
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: text.error
            }, void 0, false, {
                fileName: "[project]/app/[locale]/(administration)/admin/error.tsx",
                lineNumber: 10,
                columnNumber: 93
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: text.errorDescription
            }, void 0, false, {
                fileName: "[project]/app/[locale]/(administration)/admin/error.tsx",
                lineNumber: 10,
                columnNumber: 114
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "admin-button admin-button-primary",
                onClick: reset,
                children: text.retry
            }, void 0, false, {
                fileName: "[project]/app/[locale]/(administration)/admin/error.tsx",
                lineNumber: 10,
                columnNumber: 144
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[locale]/(administration)/admin/error.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>CircleAlert
]);
/**
 * @license lucide-react v1.56.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "circle-alert",
    size: 24,
    node: [
        [
            "circle",
            {
                cx: "12",
                cy: "12",
                r: "10",
                key: "1mglay"
            }
        ],
        [
            "line",
            {
                x1: "12",
                x2: "12",
                y1: "8",
                y2: "12",
                key: "1pkeuh"
            }
        ],
        [
            "line",
            {
                x1: "12",
                x2: "12.01",
                y1: "16",
                y2: "16",
                key: "4dfq90"
            }
        ]
    ],
    aliases: [
        "alert-circle"
    ]
};
__iconData.node;
const CircleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript)");
}),
]})(),
"[project]/app/i18n/locales/en/admin.json.[json].cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "title": "Platform management",
    "eyebrow": "A-FRAME KG · ADMIN",
    "description": "Real records, moderation and service settings.",
    "shell": {
        "workspace": "Admin workspace",
        "management": "Management",
        "platform": "Platform",
        "website": "Open website",
        "collapse": "Collapse navigation",
        "expand": "Expand navigation",
        "menu": "Open navigation",
        "close": "Close",
        "skip": "Skip to content",
        "administrator": "Administrator",
        "profile": "My profile",
        "logout": "Sign out",
        "search": "Search properties, bookings and users",
        "searchHint": "Enter at least 2 characters",
        "searchEmpty": "No results found",
        "searchError": "Search unavailable. Please try again.",
        "notifications": "Notifications",
        "noNotifications": "No new notifications",
        "allNotifications": "All notifications",
        "soon": "Coming in a later stage",
        "analytics": "Analytics",
        "support": "Support",
        "amenities": "Amenities",
        "refresh": "Refresh data"
    },
    "dashboard": {
        "welcome": "Welcome back",
        "intro": "Your properties, guests and bookings, all in one place.",
        "live": "Database records",
        "updated": "Updated",
        "period": "Period",
        "days7": "7 days",
        "days30": "30 days",
        "days90": "90 days",
        "year": "Year",
        "custom": "Custom range",
        "from": "Start date",
        "to": "End date",
        "apply": "Apply",
        "invalidRange": "Select a valid range of up to 366 days, ending no later than today.",
        "allTime": "Current totals",
        "selectedPeriod": "Selected period",
        "cabins": "Total properties",
        "published": "Published properties",
        "moderation": "Awaiting moderation",
        "users": "Users",
        "owners": "Owners",
        "bookings": "Bookings",
        "active": "Active bookings",
        "pending": "Pending requests",
        "paid": "Confirmed payments",
        "revenue": "Revenue",
        "chartTitle": "Platform performance",
        "chartDescription": "Daily bookings and confirmed payments",
        "bookingsTab": "Bookings",
        "revenueTab": "Revenue, KGS",
        "chartEmpty": "No data for this period yet",
        "chartEmptyDescription": "Your first operations will appear here.",
        "chartTable": "View chart data",
        "date": "Date",
        "statuses": "Booking statuses",
        "statusesDescription": "Distribution for the selected period",
        "regions": "Popular destinations",
        "regionsDescription": "Ranked by booking count",
        "popular": "Popular properties",
        "popularDescription": "Properties with the most bookings",
        "noPopular": "No bookings yet",
        "recent": "Recent bookings",
        "recentDescription": "The latest guest requests and statuses",
        "allBookings": "All bookings",
        "booking": "Booking number",
        "guest": "Guest",
        "cabin": "Property",
        "stay": "Stay dates",
        "amount": "Amount",
        "status": "Status",
        "allStatuses": "All statuses",
        "tableSearch": "Number, guest name or property",
        "search": "Search",
        "reset": "Reset",
        "empty": "No bookings found",
        "emptyDescription": "New requests will appear here. Try a different period or filters.",
        "quick": "Quick actions",
        "quickDescription": "Go straight to tasks that need your attention",
        "moderateCabins": "Review properties",
        "manageBookings": "Manage requests",
        "verifyOwners": "Verify owners",
        "moderateReviews": "Moderate reviews",
        "provider": "Payments through Finik Pay",
        "providerConfigured": "Finik configuration is set",
        "providerConfiguredDescription": "Payment statuses arrive through a server webhook. Configuring a provider does not confirm a transaction; revenue comes from confirmed KGS records.",
        "providerDescription": "Payments are available for viewing. Revenue includes PAID records in KGS with a payment date and transaction ID. Demo properties and bookings are excluded.",
        "source": "Property and account statistics are current totals. Bookings and payments use the selected period. Active bookings: CONFIRMED with an upcoming checkout.",
        "previous": "Previous",
        "next": "Next",
        "page": "Page",
        "of": "of",
        "records": "records",
        "error": "Unable to load data",
        "errorDescription": "Check the database connection and try again.",
        "retry": "Try again",
        "loading": "Loading admin workspace",
        "providerUnavailable": "Payment provider is not connected",
        "providerUnavailableDescription": "Payments are available for viewing. Configure the provider and server webhook to accept payments. Demo operations are excluded from revenue."
    }
};
}),
"[project]/app/i18n/locales/kg/admin.json.[json].cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "title": "Платформаны башкаруу",
    "eyebrow": "A-FRAME KG · ADMIN",
    "description": "Чыныгы маалыматтар, модерация жана сервистин жөндөөлөрү.",
    "shell": {
        "workspace": "Башкаруу панели",
        "management": "Башкаруу",
        "platform": "Платформа",
        "website": "Сайтты ачуу",
        "collapse": "Менюну жыйноо",
        "expand": "Менюну кеңейтүү",
        "menu": "Менюну ачуу",
        "close": "Жабуу",
        "skip": "Мазмунга өтүү",
        "administrator": "Администратор",
        "profile": "Менин профилим",
        "logout": "Чыгуу",
        "search": "Үйлөрдү, ээлөөлөрдү жана колдонуучуларды издөө",
        "searchHint": "Кеминде 2 белги киргизиңиз",
        "searchEmpty": "Эч нерсе табылган жок",
        "searchError": "Издөө жеткиликсиз. Кайра аракет кылыңыз.",
        "notifications": "Билдирүүлөр",
        "noNotifications": "Жаңы билдирүүлөр жок",
        "allNotifications": "Бардык билдирүүлөр",
        "soon": "Кийинки этапта",
        "analytics": "Аналитика",
        "support": "Колдоо",
        "amenities": "Ыңгайлуулуктар",
        "refresh": "Маалыматты жаңыртуу"
    },
    "dashboard": {
        "welcome": "Кош келиңиз",
        "intro": "Үйлөр, коноктор жана ээлөөлөр — бир жерде.",
        "live": "Базадан алынган маалымат",
        "updated": "Жаңыртылды",
        "period": "Мезгил",
        "days7": "7 күн",
        "days30": "30 күн",
        "days90": "90 күн",
        "year": "Бир жыл",
        "custom": "Өз мезгилим",
        "from": "Мезгилдин башы",
        "to": "Мезгилдин аягы",
        "apply": "Колдонуу",
        "invalidRange": "Бүгүнкү күндөн кеч эмес, 366 күнгө чейинки туура мезгилди тандаңыз.",
        "allTime": "Учурдагы абал",
        "selectedPeriod": "Тандалган мезгилде",
        "cabins": "Бардык үйлөр",
        "published": "Жарыяланган",
        "moderation": "Текшерүүдө",
        "users": "Колдонуучулар",
        "owners": "Үй ээлери",
        "bookings": "Ээлөөлөр",
        "active": "Активдүү ээлөөлөр",
        "pending": "Чечим күтүп жатат",
        "paid": "Ырасталган төлөмдөр",
        "revenue": "Киреше",
        "chartTitle": "Платформанын динамикасы",
        "chartDescription": "Күн сайын ээлөөлөр жана ырасталган төлөмдөр",
        "bookingsTab": "Ээлөөлөр",
        "revenueTab": "Киреше, KGS",
        "chartEmpty": "Бул мезгилде маалымат жок",
        "chartEmptyDescription": "Алгачкы операциялардан кийин график пайда болот.",
        "chartTable": "Графиктин маалыматын көрүү",
        "date": "Күнү",
        "statuses": "Ээлөөлөрдүн абалы",
        "statusesDescription": "Тандалган мезгилдеги бөлүштүрүү",
        "regions": "Популярдуу багыттар",
        "regionsDescription": "Ээлөөлөрдүн саны боюнча",
        "popular": "Популярдуу үйлөр",
        "popularDescription": "Эң көп ээлөөлөрү бар үйлөр",
        "noPopular": "Азырынча ээлөөлөр жок",
        "recent": "Акыркы ээлөөлөр",
        "recentDescription": "Коноктордун учурдагы арыздары жана абалы",
        "allBookings": "Бардык ээлөөлөр",
        "booking": "Ээлөөнүн номери",
        "guest": "Конок",
        "cabin": "Үй",
        "stay": "Жашоо күндөрү",
        "amount": "Баасы",
        "status": "Абалы",
        "allStatuses": "Бардык абалдар",
        "tableSearch": "Номер, коноктун аты же үй",
        "search": "Издөө",
        "reset": "Тазалоо",
        "empty": "Ээлөөлөр табылган жок",
        "emptyDescription": "Жаңы арыздар бул жерде көрсөтүлөт. Мезгилди же чыпкаларды өзгөртүңүз.",
        "quick": "Ыкчам аракеттер",
        "quickDescription": "Көңүл бурууну талап кылган иштерге өтүңүз",
        "moderateCabins": "Үйлөрдү текшерүү",
        "manageBookings": "Арыздарды кароо",
        "verifyOwners": "Үй ээлерин текшерүү",
        "moderateReviews": "Пикирлерди текшерүү",
        "provider": "Finik Pay аркылуу төлөмдөр",
        "providerConfigured": "Finik: конфигурация берилген",
        "providerConfiguredDescription": "Төлөмдүн абалы сервердик webhook аркылуу келет. Провайдердин жөндөөсү ийгиликтүү төлөмдү билдирбейт; киреше KGS валютасындагы ырасталган жазуулардан эсептелет.",
        "providerDescription": "Төлөмдөрдү көрүүгө болот. Кирешеге KGS валютасындагы, төлөө күнү жана транзакция ID бар PAID гана кирет. Демо үйлөр жана ээлөөлөр эсептелбейт.",
        "source": "Үйлөр жана аккаунттар — учурдагы абал. Ээлөөлөр жана төлөмдөр — тандалган мезгилде. Активдүү ээлөөлөр: чыгуу күнү алдыда болгон CONFIRMED.",
        "previous": "Артка",
        "next": "Кийинки",
        "page": "Барак",
        "of": "/",
        "records": "жазуу",
        "error": "Маалыматты жүктөө мүмкүн болгон жок",
        "errorDescription": "Маалымат базасына туташууну текшерип, кайра аракет кылыңыз.",
        "retry": "Кайра аракет кылуу",
        "loading": "Башкаруу панели жүктөлүүдө",
        "providerUnavailable": "Төлөм провайдери туташкан эмес",
        "providerUnavailableDescription": "Төлөмдөрдү көрүүгө болот. Төлөм кабыл алуу үчүн провайдерди жана сервердик webhook жөндөңүз. Демо операциялар кирешеге кирбейт."
    }
};
}),
"[project]/app/i18n/locales/ru/admin.json.[json].cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "title": "Управление платформой",
    "eyebrow": "A-FRAME KG · ADMIN",
    "description": "Реальные данные, модерация и настройки сервиса.",
    "shell": {
        "workspace": "Панель управления",
        "management": "Управление",
        "platform": "Платформа",
        "website": "Открыть сайт",
        "collapse": "Свернуть навигацию",
        "expand": "Развернуть навигацию",
        "menu": "Открыть меню",
        "close": "Закрыть",
        "skip": "Перейти к содержимому",
        "administrator": "Администратор",
        "profile": "Мой профиль",
        "logout": "Выйти",
        "search": "Поиск по домикам, броням и пользователям",
        "searchHint": "Введите минимум 2 символа",
        "searchEmpty": "Ничего не найдено",
        "searchError": "Поиск недоступен. Попробуйте ещё раз.",
        "notifications": "Уведомления",
        "noNotifications": "Новых уведомлений нет",
        "allNotifications": "Все уведомления",
        "soon": "На следующем этапе",
        "analytics": "Аналитика",
        "support": "Поддержка",
        "amenities": "Удобства",
        "refresh": "Обновить данные"
    },
    "dashboard": {
        "welcome": "Добро пожаловать",
        "intro": "Ваши объекты, гости и бронирования — в одном месте.",
        "live": "Данные из базы",
        "updated": "Обновлено",
        "period": "Период",
        "days7": "7 дней",
        "days30": "30 дней",
        "days90": "90 дней",
        "year": "Год",
        "custom": "Свой период",
        "from": "Начало периода",
        "to": "Конец периода",
        "apply": "Применить",
        "invalidRange": "Выберите корректный период до 366 дней, не позднее сегодняшнего дня.",
        "allTime": "На текущий момент",
        "selectedPeriod": "За выбранный период",
        "cabins": "Всего домиков",
        "published": "Опубликовано",
        "moderation": "На модерации",
        "users": "Пользователи",
        "owners": "Владельцы",
        "bookings": "Бронирования",
        "active": "Активные бронирования",
        "pending": "Ожидают решения",
        "paid": "Подтверждённые платежи",
        "revenue": "Выручка",
        "chartTitle": "Динамика платформы",
        "chartDescription": "Бронирования и подтверждённые платежи по дням",
        "bookingsTab": "Бронирования",
        "revenueTab": "Выручка, KGS",
        "chartEmpty": "За этот период пока нет данных",
        "chartEmptyDescription": "График появится после первых операций.",
        "chartTable": "Посмотреть данные графика",
        "date": "Дата",
        "statuses": "Статусы бронирований",
        "statusesDescription": "Распределение за выбранный период",
        "regions": "Популярные направления",
        "regionsDescription": "По количеству бронирований",
        "popular": "Популярные домики",
        "popularDescription": "Объекты с наибольшим числом бронирований",
        "noPopular": "Пока нет бронирований",
        "recent": "Последние бронирования",
        "recentDescription": "Актуальные заявки и статусы гостей",
        "allBookings": "Все бронирования",
        "booking": "Номер брони",
        "guest": "Гость",
        "cabin": "Домик",
        "stay": "Даты проживания",
        "amount": "Стоимость",
        "status": "Статус",
        "allStatuses": "Все статусы",
        "tableSearch": "Номер, имя гостя или домик",
        "search": "Найти",
        "reset": "Сбросить",
        "empty": "Бронирования не найдены",
        "emptyDescription": "Новые заявки появятся здесь. Попробуйте изменить период или фильтры.",
        "quick": "Быстрые действия",
        "quickDescription": "Перейдите к задачам, требующим внимания",
        "moderateCabins": "Проверить домики",
        "manageBookings": "Обработать заявки",
        "verifyOwners": "Проверить владельцев",
        "moderateReviews": "Модерировать отзывы",
        "provider": "Оплата через Finik Pay",
        "providerConfigured": "Finik: конфигурация задана",
        "providerConfiguredDescription": "Статусы оплаты поступают через серверный webhook. Настройка провайдера не означает успешную транзакцию; выручка рассчитывается по подтверждённым записям в KGS.",
        "providerDescription": "Платежи доступны для просмотра. Выручка учитывает только PAID в KGS с датой оплаты и ID транзакции. Демонстрационные объекты и брони исключены.",
        "source": "Объекты и аккаунты — на текущий момент. Брони и платежи — за выбранный период. Активные брони: CONFIRMED с предстоящим выездом.",
        "previous": "Назад",
        "next": "Далее",
        "page": "Страница",
        "of": "из",
        "records": "записей",
        "error": "Не удалось загрузить данные",
        "errorDescription": "Проверьте подключение к базе данных и повторите загрузку.",
        "retry": "Повторить",
        "loading": "Загрузка панели управления",
        "providerUnavailable": "Платёжный провайдер не подключён",
        "providerUnavailableDescription": "Платежи доступны для просмотра. Для приёма оплаты настройте провайдера и серверный webhook. Демонстрационные операции исключены из выручки."
    }
};
}),
];

//# sourceMappingURL=_02b4w23gbcy0g._.js.map