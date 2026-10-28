# Safari на старых iPhone

Клиентская сборка поддерживает Safari / iOS 15.4+, включая iPhone 7 и 7 Plus с обновлённой iOS 15. Эти модели не поддерживают iOS 16 ([список Apple](https://support.apple.com/en-ie/103267)).

## Найденная несовместимость

Опубликованная версия `https://a-frame-vscode-ne4d.vercel.app/ru` при проверке 28 октября 2026 года отвечала HTTP 200 и открывалась в современном Chromium, включая мобильный режим. Однако загружаемый главной страницей файл `premium-select-Bw0q7Ojf.js` содержал `class … { static { … } }`. Safari получил этот синтаксис только в [версии 16.4](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/); Safari 15 не может разобрать такой модуль, что мешает гидратации страницы. Проверка в мобильном режиме современного Chrome не воспроизводит ограничения старого Safari.

## Исправление

- `vite.config.ts` явно задаёт Safari / iOS 15.4 для клиентской сборки. Версии React, Vite и RSC-плагина сохраняются. Серверные сборки используют свои прежние настройки.
- `client/browser-compat.ts` до гидратации добавляет отсутствующие `Array.prototype.toSorted` для коллекций Radix и `URLSearchParams.size` для поиска и фильтров. Нативные реализации сохраняются.
- `client/request-abort.ts` обеспечивает тайм-аут и отмену запроса через `AbortController`, без `AbortSignal.any` и `AbortSignal.timeout`, отсутствующих в Safari 15. Его используют доступность, оплата и загрузка фотографий.

## Проверка

```powershell
$env:BUILD_DIR = "dist-mobile-qa"
npm run build
$env:BROWSER_COMPAT_BUILD_DIR = $env:BUILD_DIR
npm run test:browser-compat
npm run typecheck
npm run lint
npm run test:runtime
```

Регрессионные тесты проверяют резервные API, отмену и завершение запросов, а также отсутствие статических блоков классов во всех JavaScript-файлах клиентской сборки. Браузерную проверку выполняют с удалёнными современными API. Это не заменяет проверку на настоящем iPhone с Safari 15.

Изменения должны войти в новый deployment Vercel, прежде чем они появятся по опубликованному адресу. Порядок публикации: [vercel-deployment.md](vercel-deployment.md). Если Safari сообщает об ошибке подключения ещё до получения страницы, для её диагностики нужен точный текст ошибки и проверка через другую сеть.
