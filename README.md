# Vite + SSR — Starter

Структура проекта с отдельными директориями для client, server и shared кода.

## Структура проекта

```
src/
├── client/          # Клиентский код
│   └── entry-client.tsx    # Точка входа клиента (гидратация)
├── server/          # Серверный код
│   └── entry-server.tsx    # Точка входа сервера (SSR рендер)
└── shared/          # Общий код (компоненты, утилиты)
    └── App.tsx      # Главный React компонент
```

Другие файлы:
- `server.js` — dev-сервер, интегрируется с Vite (middlewareMode) и рендерит с помощью `vite.ssrLoadModule`.
- `index.html` — шаблон с `<!--ssr-outlet-->`.
- `vite.config.ts` — конфигурация с path aliases (`@client`, `@server`, `@shared`).
- `tsconfig.json`, `package.json` — конфиги.

## Как начать (macOS / zsh)

1) Установить зависимости:

```bash
cd "/Users/edgar/Desktop/рабочий стол/Skillbox/4/2.another"
npm install
```

2) Запустить дев-сервер:

```bash
npm run dev
```

Откройте `http://localhost:3000`.

## Сборка для продакшна

```bash
npm run build
npm run start
```

## Path aliases

Используйте aliases для удобного импорта:
- `@shared/App` вместо `../../../shared/App`
- `@client/...` для клиентского кода
- `@server/...` для серверного кода
