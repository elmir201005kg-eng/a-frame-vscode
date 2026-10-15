import type { Locale } from "@/app/i18n/config";

export const pwaThemeColor = "#0b120f";

export const pwaText = {
  ru: {
    offline: "Вы офлайн",
    description: "Главная страница доступна без интернета. Для поиска домиков, входа и бронирования нужно подключение.",
    catalog: "Подключитесь к интернету, чтобы увидеть актуальные домики, цены и свободные даты.",
    retry: "Попробовать снова",
    home: "На главную",
    install: "Установить приложение",
    dismiss: "Закрыть предложение установки",
  },
  kg: {
    offline: "Сиз офлайнсыз",
    description: "Башкы бет интернетсиз жеткиликтүү. Үйлөрдү издөө, аккаунтка кирүү жана ээлөө үчүн интернет керек.",
    catalog: "Үйлөрдү, учурдагы бааларды жана бош күндөрдү көрүү үчүн интернетке туташыңыз.",
    retry: "Кайра аракет кылуу",
    home: "Башкы бетке",
    install: "Тиркемени орнотуу",
    dismiss: "Орнотуу сунушун жабуу",
  },
  en: {
    offline: "You're offline",
    description: "The home page is available offline. Connect to search cabins, sign in, or book a stay.",
    catalog: "Connect to the internet to see current cabins, prices, and available dates.",
    retry: "Try again",
    home: "Go to home page",
    install: "Install app",
    dismiss: "Dismiss installation offer",
  },
} satisfies Record<Locale, Record<string, string>>;
