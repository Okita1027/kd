# AGENTS.md

Personal knowledge base built on VuePress 2 (RC) + `vuepress-theme-hope`, deployed to Netlify and GitHub Pages. Content is the product; almost everything under `docs/` is Markdown.

## Stack
- VuePress `2.0.0-rc.24` (RC channel — pinning matters, stable may break)
- Bundler: Vite (`@vuepress/bundler-vite`)
- Theme: `vuepress-theme-hope` (`2.0.0-rc.94`)
- Package manager: **pnpm** (`pnpm-lock.yaml` present, no `package-lock.json`)
- Node `22.14.0`, pnpm `10.14.0` (pinned by `.github/workflows/docs.yml`)
- TypeScript only for `.vuepress/*.ts` configs; docs are plain Markdown

## Quick commands (Windows)
| Task | Command |
|---|---|
| Install (first time) | `pnpm install` (or run `install.bat` — also installs pnpm globally) |
| Local dev server | `pnpm docs:dev` (or `local.bat`) — http://localhost:4000/kd/ |
| Clean dev cache | `pnpm docs:clean-dev` |
| Production build | `pnpm docs:build` — output: `docs/.vuepress/dist` |
| Build for GitHub Pages | `pnpm docs:build:github` (sets `DEPLOY_ENV=github`) |
| Build for Netlify | `pnpm docs:build:netlify` (sets `DEPLOY_ENV=netlify`) |
| Update VuePress deps | `pnpm docs:update-package` (`pnpm dlx vp-update`) |
| Deploy (build + force-push to `gh-pages`) | `deploy.bat` (runs `pnpm pushAll`) |

`npm test` is a placeholder — there is no test suite. Do not invent one.

## Deployment gotchas
- `pnpm pushPage` **force-pushes** to `https://github.com/Okita1027/kd.git` `main:gh-pages`. Local `dist/` is force-pushed without confirmation. Only run when you intend to publish.
- `pnpm push` is `git add . && git commit -m msg && git push origin main` — the `-m msg` is a **literal** string, not a variable. Use real `git commit` instead; do not rely on this script for real commits.
- `pnpm pushAll` = `push` + `pushPage`. Prefer the GitHub Actions workflow (`.github/workflows/docs.yml`) — it builds and deploys on push to `main` with proper `fetch-depth: 0` (required for `lastUpdated`).
- `base` path is controlled by `DEPLOY_ENV` in `docs/.vuepress/config.ts`: GitHub Pages uses `/kd/`, Netlify uses `/`. Internal links must keep the `/kd/` prefix when targeting GitHub Pages.

## Repo layout
- `docs/README.md` — home page (VuePress home layout with hero/actions)
- `docs/basic/`, `docs/database/`, `docs/frame/`, `docs/web/`, `docs/dotnet/` — top-level content sections
- `docs/.vuepress/config.ts` — site config, bundler, `base` path
- `docs/.vuepress/theme.ts` — `hopeTheme(...)` config: navbar, sidebar (`"structure"` mode = auto-built from directory tree), markdown plugins, search, copyright
- `docs/.vuepress/client.ts` — client-side hooks (empty by design)
- `docs/.vuepress/styles/` — SCSS overrides (`config.scss`, `index.scss`, `palette.scss`)
- `docs/.vuepress/public/` — static assets: `logo.png`, `favicon.ico`, `icon/`, `CNAME`
- `docs/.vuepress/{.cache,.temp,dist}/` — generated, gitignored

Sidebar uses `"/<section>/": "structure"` — adding a new Markdown file under a section auto-appears in the sidebar. Do not hand-maintain a sidebar list for these paths.

## Content conventions
- Site language is `zh-CN`; titles mix Chinese and Japanese-style phrasing ("沖田さんの知識ベース"). Match existing tone in new pages.
- Markdown features enabled in theme: mermaid, katex, reveal.js, shiki (with `xaml → xml` alias), footnote, mark, tasklist, image lazyload/size/mark.
- Images: most external image hosts require a proxy ("魔法") to load — README explicitly warns about this. Localize critical images into `docs/.vuepress/public/` to avoid the issue.
- Slimsearch has `indexContent: false` — full-text search is disabled; only titles/headings are indexed.
- Copyright plugin appends author + MIT license when copied content length ≥ 30 chars.
- Each section has its own `README.md` that often acts as the section index page.

## Generated / gitignored
`.vuepress/.cache`, `.vuepress/.temp`, `.vuepress/dist`, `node_modules/`, `.vscode/`, `.idea/`, `Desktop.ini`, `.history/`. Do not commit these.

## TypeScript
`tsconfig.json` uses `NodeNext` modules and `ES2022` target. Only `docs/.vuepress/**` is type-checked. No app code is compiled — TypeScript is config-only here.

## When changing config
- Theme/site changes go in `docs/.vuepress/theme.ts` (hopeTheme options) or `docs/.vuepress/config.ts` (VuePress core).
- `config.ts` reads `process.env.DEPLOY_ENV` at build time — do not move it to runtime config.
- After editing `config.ts` / `theme.ts`, restart `pnpm docs:dev`; HMR covers content but not always config.
