# A-FRAME KG: общая система форм

Стили находятся в `app/forms.css` и подключены в корневом layout после существующих стилей. Цвета и размеры определены токенами `--form-*`. `FormDesignProvider` получает язык маршрута; подписи интерфейса находятся в `app/i18n/locales/{kg,ru,en}/forms.json`.

## Компоненты

- `Field`, `SelectField`, `TextAreaField` по прежнему экспортируются из `components/product-ui.tsx`. Их реализация использует общие поля и связывает label, hint и error через стабильный `useId`.
- `PremiumInput`, `PremiumTextarea`, `PremiumCheckbox`, `PremiumRadio` находятся в `components/premium-fields.tsx`. Сохраняют стандартные HTML-атрибуты, ограничения и участие в FormData.
- `PremiumSelect` использует Radix Select. Принимает `options` или существующие `<option>` как описание вариантов; контролируемые изменения передаются через `onValueChange`.
- `PremiumDatePicker` выбирает диапазон, принимает `blocked`, `today`, `maxDate`, `value`/`defaultValue`, `onValueChange`, `startName` и `endName`. Последние позволяют использовать его для календаря владельца с полями `start`/`end`.
- `GuestSelector` принимает `maxGuests` из домика и сохраняет числовую строку в поле `guests`. Для поиска допускает пустое значение; для бронирования передайте `required`.
- `FilterDropdown` сохраняет выбранные удобства как повторяющиеся параметры `amenity`. Меню поддерживает прокрутку и выбор клавишей Space.

Пример поля в существующей серверной форме:

```tsx
<SelectField label={common.labels.region} name="regionId" required defaultValue={regionId}>
  <option value="">{common.labels.region}</option>
  {regions.map(region => <option key={region.id} value={region.id}>{region.name}</option>)}
</SelectField>
```

Select и Popover выводят панели через портал в body. Они учитывают края экрана и возвращают фокус при закрытии. Select поддерживает стрелки, поиск вводом текста, Enter, Escape и переход к соседнему полю через Tab / Shift+Tab. Календарь поддерживает стрелки, Home / End и Page Up / Down; инструкция доступна screen reader.

## Даты и серверная проверка

Значения дат сохраняются как `YYYY-MM-DD`. Расчёты выполняются в UTC, а текущий день — в `Asia/Bishkek`. Выезд строго позже заезда; занятая дата допустима как дата выезда, если все предшествующие ночи свободны. Диапазон через занятую ночь заблокирован. `blockedNights` в `lib/booking.ts` получает блокировки и бронирования с сервера для карточки домика и оформления бронирования.

Нативные служебные поля сохраняют FormData и constraint validation. При ошибке пользователь получает фокус на соответствующем видимом компоненте. Серверные действия, проверка доступности и Prisma продолжают выполнять окончательную проверку.

## Проверка

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run test:forms
```

Браузерные проверки используют отдельную временную схему PostgreSQL, которая удаляется после выполнения. Дополнительные проверки находятся в `tests/premium-forms.spec.ts`: все шесть ширин, KG / RU / EN, клавиатура, реальные параметры фильтров, вместимость, занятые ночи и часовой пояс браузера. Существующие тесты продолжают проверять регистрацию, вход, отправку форм, бронирование, администрирование и отсутствие ошибок гидратации.
