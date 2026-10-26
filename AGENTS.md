# React / Vite

This project uses React 19 and Vite, without Next.js. Read `docs/react-migration.md` for its server, routing, sessions and build structure.

- Preserve server/client boundaries: database access and credentials belong on the server; interactive components use `"use client"` and server functions use `"use server"`.
- Use `npm run dev`, `npm run build` and `npm start`. Build artifacts belong in `dist`; `BUILD_DIR` selects a separate build directory.
- Run `npm run typecheck`, `npm run lint` and the tests appropriate to the change. Database browser tests require the isolated schemas created by the QA scripts.
- `@vitejs/plugin-rsc` uses experimental React APIs. Keep its pinned version compatible with React and Vite when updating dependencies.
