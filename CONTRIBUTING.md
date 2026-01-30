# Contributing

Thanks for helping improve the Air Quality Dashboard. This guide covers how to get set up, make changes safely, and open PRs.

## Getting started
- Install prerequisites: Node >= 16 and npm.
- Install dependencies: `npm install`.
- Create `.env.local` with `VITE_GOOGLE_MAPS_API_KEY` and any `VITE_SUPABASE_*` values you need. Do not commit secrets.
- Preferred dev loop: `npm run dev` for local changes; keep another terminal ready for lint/build checks.

## Development expectations
- Keep navigation hash sync intact in [src/App.jsx](src/App.jsx) and [src/components/NavBar.jsx](src/components/NavBar.jsx); avoid introducing a router unless discussed.
- Preserve the HomePage data flow: keep `dashboardData`, InfoWindow structure, and the resize handling in [src/components/HomePage.jsx](src/components/HomePage.jsx) when replacing the simulated fetcher.
- Avoid loading Google Maps twice; `useJsApiLoader` in `App.jsx` should be the single source unless you intentionally use the standalone `MapPage`.
- Add shared data utilities under `src/lib/` rather than duplicating calls in components.

## Testing and checks
- Run `npm run lint` and `npm run build` before pushing.
- If you touch database scripts or Prisma schema, rerun `scripts/setup_prisma.sh` (or `prisma migrate dev`) locally to verify migrations.

## Commit and PR guidelines
- Use Conventional Commits (e.g., `feat: add supabase client`, `fix: prevent double map load`, `docs: add contributing guide`).
- Stage changes in chunks with `git add -p` when possible; keep unrelated edits in separate commits.
- Open PRs that are scoped and reference the problem being solved. Include screenshots or GIFs for UI changes.
- Keep commit messages and PR titles in present tense and concise.

## Coding style
- React + Vite, ES modules; prefer functional components and hooks.
- Keep code ASCII-only unless an existing file already uses non-ASCII text.
- Add short comments only when behavior is non-obvious (e.g., explaining a resize workaround).

## Support
- For DB setup issues, use `scripts/setup_db.sh` and `scripts/check_db.sh` to confirm connectivity.
- If something in this guide is unclear, open an issue describing what you attempted and where you were blocked.
