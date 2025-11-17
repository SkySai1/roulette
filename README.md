# Roulette

A tiny roulette simulator built with React and bundled with Vite 2 so it can run on Node.js installations that still lack top-level `await` support (for example, some aarch64 distributions that only ship Node 12/early Node 14).

## Requirements

- Node.js >= 12.20.0 (works great on Node 14 LTS shipped for many aarch64 platforms)
- npm 7+

## Available scripts

```bash
npm install
npm run dev     # start the Vite dev server
npm run build   # produce a production build
npm run preview # preview the production build
```

If you encounter the `Unexpected reserved word` error shown in the issue report, double‑check that you are using the LTS build of Node 14 or newer. Earlier builds (and the system Node that ships with some distributions) do not support top-level `await`. Pinning Vite to the 2.x line, as this project does, keeps the dev server compatible with those environments.
