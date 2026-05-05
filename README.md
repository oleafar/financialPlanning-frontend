# 💰 Planejamento Financeiro

Personal finance management app to help you track and control your income and expenses.

## Features

- **Dashboard** – Monthly summary cards showing total income, expenses, and balance
- **Bar Chart** – Visual comparison of income vs. expenses over the last 6 months
- **Transaction Management** – Add, edit, and delete income and expense entries
- **Transaction List** – Filter transactions by type (All / Income / Expenses)
- **Categories** – Predefined categories in Portuguese (Salário, Freelance, Moradia, Alimentação, etc.)
- **Month Selector** – Browse historical months on the dashboard
- **Persistence** – All data is stored in `localStorage` — no backend required

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — build tool
- [TailwindCSS v4](https://tailwindcss.com/) — styling
- [Recharts](https://recharts.org/) — charts
- [Vitest](https://vitest.dev/) — unit tests

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
