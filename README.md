# Personal build log

Minimal Next.js 14 blog that pulls Markdown entries from `/public/posts`. Only the latest entry is shown por defecto, con navegación para entradas anteriores/siguientes.

## Local dev
```bash
npm install
npm run dev
# http://localhost:3000
```

Cada post es un `.md` nombrado con fecha ISO (e.g. `2026-02-23.md`). Añádelo en `public/posts/`, commitea y empuja.

## Daily habit
- Crear un Markdown nuevo cada día (500 chars aprox.).
- Formato libre: H1 para título, listas con `-`, párrafos.<br/>
- `npm run lint` antes de subir.
