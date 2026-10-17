This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## База данных

AI-консультант с Ollama/Groq, настройка бесплатной модели и проверки: [инструкция](docs/ai-consultant.md).

Интеграция оплаты с фиксированной суммой 5 сомов: [Finik Pay](docs/finik-pay.md).

Описание общих компонентов форм, календаря, фильтров и их проверки: [система форм A-FRAME KG](docs/form-design.md).

Для A-FRAME KG подготовлена [схема Prisma](prisma/schema.prisma) на PostgreSQL: все 21 таблица из `Схема БД.md`, связи, индексы и SQL-миграции с проверками бронирований. Анализ архитектуры, ER-диаграмма и порядок подключения находятся в [prisma/README.md](prisma/README.md).

Проверка и генерация клиента: `npm run db:validate`, `npm run db:generate`. Перед применением миграций создайте `.env` по `.env.example` и укажите свой `DATABASE_URL`, затем выполните `npm run db:deploy`.

## PWA и офлайн-главная

Приложение можно установить на устройство. Иконки создаются из `public/brand/a-frame-logo.png`. После первого посещения production-сайта и загрузки офлайн-файлов главная доступна без интернета на кыргызском, русском и английском; поиск, вход и бронирование требуют подключения.

Сборка: `npm run build`, запуск: `npm run start`, проверка офлайн-режима: `npm run test:pwa`. На домене требуется HTTPS, локально подходит `localhost`. В режиме `npm run dev` service worker не регистрируется.

Анализ архитектуры, правила кеширования и инструкция установки: [docs/pwa.md](docs/pwa.md).
