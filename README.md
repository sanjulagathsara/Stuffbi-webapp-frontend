# StuffBi Web App – Frontend

A web dashboard for the StuffBi app, built with **Next.js** and **MUI**, sharing the same JWT-based auth backend used by the Flutter mobile app.

- Live URL: https://stuffbi-webapp-frontend.vercel.app
- Backend API (prod): https://apiofstuffbi.sanjulagathsara.com

---

## Tech Stack

- [Next.js 16 (App Router)](https://nextjs.org/)
- React + TypeScript
- [MUI (Material UI)](https://mui.com/)
- JWT-based authentication (talking to the Express backend)
- Deployed on [Vercel](https://vercel.com)

---

## Project Structure (high level)

```bash
app/
  login/
    page.tsx        # Login page
  bundles/
    page.tsx        # Bundles view
  items/
    page.tsx        # Items view
  layout.tsx        # Root layout
  page.tsx          # Default dashboard / redirect
components/
  ui/               # Reusable UI components (MUI-based)
lib/
  api.ts            # API client using NEXT_PUBLIC_API_URL
```

Environment Variables

The frontend expects a running backend API. Configure:

# .env.local

NEXT_PUBLIC_API_URL=https://apiofstuffbi.sanjulagathsara.com

For local development, you can point to a local backend:

NEXT_PUBLIC_API_URL=http://localhost:4000

This value is used in all API calls, e.g. POST /auth/login, GET /items, etc.

Getting Started (Local Development)

Install dependencies

npm install

# or

pnpm install

Create .env.local

cp .env.example .env.local # if .env.example exists

# Or manually create .env.local with NEXT_PUBLIC_API_URL

Run dev server

npm run dev

The app will be available at:

http://localhost:3000

Login

Use the seeded user from the backend:

email: test@example.com
password: password123

Build & Production

To build locally:

npm run build
npm run start

Vercel uses:

Build command: npm run build

Output: .next

Env: NEXT_PUBLIC_API_URL set in Vercel → Project Settings → Environment Variables

API Integration

All calls are made relative to NEXT_PUBLIC_API_URL.

Example login call:

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email, password }),
});

Example items fetch:

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
headers: {
Authorization: `Bearer ${accessToken}`,
},
});

Deployment

The project is deployed on Vercel:

Push to main → Vercel builds & deploys automatically.

Remember to update NEXT_PUBLIC_API_URL in Vercel when backend URL changes.
