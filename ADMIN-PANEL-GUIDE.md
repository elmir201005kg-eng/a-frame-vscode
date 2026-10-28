# 📋 Руководство по админ-панели

## ✅ Статус системы

**Дата проверки:** 28 октября 2026

### Настройки:
- ✅ База данных: Neon PostgreSQL (подключена)
- ✅ Администратор создан
- ✅ Telegram Bot настроен
- ✅ Двухфакторная аутентификация настроена
- ✅ Finik Pay настроен (production)
- ✅ Сервер запущен на порту 3001

## 🔐 Вход в админ-панель

### Шаг 1: Откройте страницу входа

Откройте в браузере один из URL:
- **http://localhost:3001/admin**
- **http://localhost:3001/ru/admin-login**
- **http://localhost:3001/en/admin-login**

### Шаг 2: Введите учетные данные

```
Email: admin@frame.kg
Пароль: aframe2026!
```

### Шаг 3: Подтвердите через Telegram

После ввода email и пароля:
1. Вам придет код подтверждения в Telegram
2. Введите полученный 6-значный код
3. Нажмите "Подтвердить"

### Шаг 4: Доступ к админ-панели

После успешного входа вы попадете на главную страницу админ-панели:
- http://localhost:3001/ru/admin

## 🛠️ Разделы админ-панели

### Основные разделы:

1. **Dashboard (Главная)**
   - Статистика бронирований
   - Графики доходов
   - Последние уведомления

2. **Cabins (Домики)**
   - Список всех домиков
   - Редактирование домиков
   - Добавление новых домиков
   - URL: `/admin/cabins`

3. **Bookings (Бронирования)**
   - Все бронирования
   - Статусы: PENDING, CONFIRMED, CANCELLED, COMPLETED
   - URL: `/admin/bookings`

4. **Payments (Платежи)**
   - История платежей через Finik Pay
   - Статусы: PENDING, PAID, FAILED, REFUNDED
   - Экспорт данных
   - URL: `/admin/payments`

5. **Owners (Владельцы)**
   - Управление владельцами домиков
   - Верификация аккаунтов
   - URL: `/admin/owners`

6. **Travelers (Путешественники)**
   - Пользователи системы
   - URL: `/admin/travelers`

7. **Reviews (Отзывы)**
   - Модерация отзывов
   - URL: `/admin/reviews`

8. **Settings (Настройки)**
   - Регионы
   - Удобства
   - Категории
   - URL: `/admin/settings`

## 🚨 Решение проблем

### Проблема: Страница не загружается

**Решение 1: Очистите кеш браузера**
```
Ctrl + Shift + Delete → Очистить кеш
```

**Решение 2: Откройте в режиме инкогнито**
```
Ctrl + Shift + N (Chrome/Edge)
Ctrl + Shift + P (Firefox)
```

**Решение 3: Перезапустите сервер**
```bash
# Остановите текущий сервер (Ctrl+C)
# Затем запустите снова:
npm run dev
```

### Проблема: Не приходит код в Telegram

**Проверьте настройки Telegram:**
1. Убедитесь, что бот запущен
2. Проверьте `TELEGRAM_BOT_TOKEN` в .env
3. Проверьте `TELEGRAM_ADMIN_CHAT_ID` в .env
4. Отправьте `/start` боту в Telegram

**Настройка Telegram бота:**
```bash
npm run telegram:setup
```

### Проблема: "Неверные учетные данные"

**Проверьте настройки:**
```bash
# Проверка админ-доступа
npx tsx scripts/test-admin-access.ts
```

**Пересоздайте администратора:**
```bash
npm run db:create-admin
```

## 📊 Полезные команды

### База данных:
```bash
# Открыть Prisma Studio
npm run db:studio

# Применить миграции
npm run db:migrate

# Сгенерировать Prisma Client
npm run db:generate
```

### Тестирование:
```bash
# Проверка админ-доступа
npx tsx scripts/test-admin-access.ts

# Проверка админ-панели
npm run test:admin
```

### Демо-домики:
```bash
# Активировать демо-домики (сделать работающими)
npm run db:enable-demo

# Добавить демо-данные
npm run db:seed:demo
```

## 🔧 Технические детали

### Двухфакторная аутентификация:
- Метод: TOTP (Time-based One-Time Password)
- Доставка: Telegram Bot
- Время жизни кода: 5 минут
- Максимум попыток: 5

### Сессии:
- Время жизни: 14 дней
- Хранение: PostgreSQL
- Cookie: `a-frame-session` (HttpOnly)

### Безопасность:
- Пароли: scrypt хеширование
- Сессии: SHA-256 хеш токенов
- CSRF: SameSite cookie policy
- Rate limiting: включен для всех форм входа

## 📞 Поддержка

Если проблемы сохраняются:
1. Проверьте логи сервера в терминале
2. Откройте консоль браузера (F12)
3. Проверьте вкладку Network на ошибки загрузки ресурсов
4. Убедитесь, что база данных доступна

### Переменные окружения (.env):
```env
DATABASE_URL="postgresql://..."
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_ADMIN_CHAT_ID="..."
ADMIN_OTP_SECRET="..."
ADMIN_EMAIL="admin@frame.kg"
ADMIN_PASSWORD="aframe2026!"
```

## 🎯 Быстрый старт

1. Убедитесь, что сервер запущен:
   ```bash
   npm run dev
   ```

2. Откройте браузер: http://localhost:3001/admin

3. Войдите с учетными данными из .env

4. Подтвердите вход через Telegram

5. Готово! 🎉
