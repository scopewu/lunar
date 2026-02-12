# Lunar Calendar

A Chinese Lunar Calendar (农历) web service deployed on Cloudflare Workers, displaying traditional calendar information including stems & branches (天干地支), zodiac (生肖), and daily activities (宜忌).

## Live Demo

Visit [lunar.tie.pub](https://lunar.tie.pub) to view today's lunar calendar information.

## Features

- **Gregorian & Lunar Dates**: Display both solar and lunar calendar dates
- **Stems & Branches (天干地支)**: Year, month, and day in traditional Chinese sexagenary cycle
- **Zodiac (生肖)**: Chinese zodiac animal for the current year
- **Daily Activities (宜忌)**: Traditional guidance on suitable activities to do and avoid
- **Responsive Design**: Beautiful gradient UI optimized for mobile and desktop
- **SEO Optimized**: Full meta tags, Open Graph, and structured data
- **Auto Refresh**: Automatically refreshes at midnight for the new day

## Tech Stack

- **Runtime**: Cloudflare Workers with Node.js compatibility
- **Language**: TypeScript (ES2024 target)
- **Core Library**: [lunar-javascript](https://github.com/6tail/lunar-javascript) - Lunar calendar calculations
- **Testing**: Vitest with Cloudflare Workers pool
- **Deployment**: Wrangler CLI

## Installation

```bash
cd lunar-calendar
npm install
```

## Development

Start the local development server:

```bash
npm run dev
# or
npm start
```

The Worker will be available at `http://localhost:8787`.

Run tests:

```bash
npm test
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

The application is deployed at [lunar.tie.pub](https://lunar.tie.pub).

## Project Structure

```
lunar-calendar/
├── src/
│   └── index.ts          # Main Worker entry point
├── test/                  # Vitest test files
├── wrangler.jsonc         # Cloudflare Workers configuration
└── package.json           # Dependencies and scripts
```

## Configuration

Key configuration in `wrangler.jsonc`:
- **Compatibility Date**: 2026-02-10
- **Route**: `lunar.tie.pub/*`
- **Node.js Compatibility**: Enabled via `nodejs_compat` flag
- **Observability**: Enabled for monitoring

After modifying `wrangler.jsonc`, regenerate TypeScript types:

```bash
npm run cf-typegen
```

## License

MIT License - Copyright (c) 2026 scope.wu

## Author

吴文俊（Wú Wénjùn） - [tie.pub/me](https://tie.pub/me/)
