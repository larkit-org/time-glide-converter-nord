# Time Glide Converter Nord

Minimal Vite + React + shadcn/ui + TypeScript starter.

## Requirements

Node.js 26 (see `.nvmrc`).

## Install

```sh
npm ci
```

## Dev

```sh
npm run dev
```

## Build

```sh
npm run build
```

## Deploy

Deploys are manual. Commit first, so the release is tied to a clean revision:

```sh
npm run build
npx wrangler pages deploy dist --project-name=time-glide --branch=main
```

Run the deploy from the repository root: Wrangler bundles the Pages Functions in `functions/` (the `/api/time` endpoint used by the clock) together with `dist`.

To test the app with its functions locally:

```sh
npm run build
npx wrangler pages dev dist
```
