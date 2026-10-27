# Зависимости сборки

Проект использует Node.js 22.13+ в ветке 22 или 24+. ESLint 10 поддерживается установленными `typescript-eslint` и `eslint-plugin-react-hooks`; версии React, Vite и `@vitejs/plugin-rsc` сохранены.

`vercel.json` запускает `npm ci` и `npm run build` без переменных `npm_config_cache_dir` и `NPM_CONFIG_CACHE_DIR`. npm не поддерживает настройку `cache-dir`; стандартная настройка кеша — `NPM_CONFIG_CACHE`. Остальные настройки и предупреждения npm сохраняются.

В `package.json` поле `allowScripts` разрешает install-скрипты конкретных версий Prisma, Prisma Engines и esbuild. При обновлении этих пакетов нужно проверить их скрипты и обновить соответствующие разрешения. Это штатный [механизм npm](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/).

Два переопределения транзитивных зависимостей устраняют устаревшие пакеты:

- `node-jose` получает `uuid` из локального пакета `packages/native-uuid`. Библиотека использует только вызов `v4()` без аргументов для идентификатора ключа; его выполняет встроенный `crypto.randomUUID`. Переопределение ограничено `node-jose`: локальный пакет не реализует остальной API `uuid`. Проверка подписи выполняется `npm run test:finik`.
- `fetch-blob` получает `node-domexception` из локального пакета `packages/native-domexception`. Все опубликованные версии исходного пакета объявлены устаревшими; его CommonJS API заменён экспортом встроенного `globalThis.DOMException`. Это сохраняет обработку ошибок файлов в Google OAuth, не добавляя полифилл для старых Node.js.

Локальные пакеты также объявлены прямыми зависимостями; переопределения ссылаются на их спецификации через `$uuid` и `$node-domexception`. Это сохраняет пути к пакетам относительно корня проекта при установке через `npm ci`.

`npm run test:dependencies` проверяет UUID версии 4 через CommonJS API `node-jose`, обработку изменённого файла через `fetch-blob` и обмен кода Google OAuth с PKCE через имитацию HTTP-ответа. Внешний вход в Google и реальные платежи эти тесты не выполняют.

Локальная production-сборка проверена на Node.js 24 командой `npm run build -- --configLoader native` с `BUILD_DIR=dist-qa-dependencies`. Нативный загрузчик позволил выполнить сборку в Windows-песочнице, где загрузчик `runner` завершался ошибкой `require is not defined`. Согласованность манифеста и lock-файла проверена через `npm ci --dry-run --offline --ignore-scripts`.
