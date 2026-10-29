# Zosh Trading — Frontend

A responsive, dark-themed cryptocurrency trading dashboard UI built with React (Vite), Tailwind CSS, shadcn/ui-style components, lucide-react icons, and Recharts. Frontend only — all data is mocked in `src/data/mockData.js`.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## What's included

- **Layout** — collapsible sidebar, top header with search + profile menu, floating Chat Bot widget
- **Dashboard (`/`)** — asset table with All / Top 50 / Top Gainers / Top Losers filters, and a live-style area chart with 1D / 1W / 1M ranges and hover tooltips
- **Portfolio (`/portfolio`)** — portfolio switcher + holdings table
- **Watchlist (`/watchlist`)** — tracked coins with remove action
- **Activity (`/activity`)** — trading history table with BUY/SELL badges and P/L
- **Wallet (`/wallet`)** — balance card, copyable wallet ID, Top Up / Withdraw / Transfer modals, transaction history
- **Payment Details (`/payment-details`)** and **Withdrawal (`/withdrawal`)**
- **Profile (`/profile`)** — personal info, 2FA toggle, change password, account status
- **Login / Register** — simple auth screens (no real auth wired up)

## Notes

- All UI primitives (`Button`, `Card`, `Table`, `Dialog`, `Tabs`, `Badge`, `Input`, `Avatar`, `DropdownMenu`) are hand-built, shadcn-style components in `src/components/ui/` — no extra UI dependency needed beyond Tailwind.
- Replace the contents of `src/data/mockData.js` with real API calls / state management when you wire up a backend.
- Color tokens (background, accent, up/down) live in `tailwind.config.js` under the `base`, `accent`, `up`, `down` keys — change them there to re-theme the whole app.
