# financialPlanning-frontend

Frontend for the personal finance management system built with React, TypeScript, Vite, Ant Design, React Router DOM, Axios, and TanStack Query.

## Stack

- React + TypeScript
- Vite
- Ant Design
- React Router DOM
- Axios
- TanStack Query
- Vitest + Testing Library

## Structure

```text
src/
  features/
    auth/
    categories/
    dashboard/
    transactions/
    wallets/
  components/
  config/
  hooks/
  layouts/
  pages/
  routes/
  services/
  styles/
  utils/
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default frontend URL: `http://localhost:5173`

Expected backend base URL: `http://localhost:3000/api`

## Environment

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Implemented MVP

- Login
- Register
- Logout
- Protected routes
- Dashboard with total balance, income, expense, wallet balances, and category chart
- Wallets CRUD
- Categories CRUD
- Transactions list with filters, pagination, modal create/edit, delete, and local title search

## Notes

- The dashboard consumes `/reports/summary` and `/reports/by-category`.
- Transaction title search is local in the current page result because the backend API does not expose a text-search query parameter today.
- Transfers, dark mode, CSV export, and persisted filters were intentionally left out of this MVP scope.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`
