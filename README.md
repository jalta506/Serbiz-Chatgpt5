# SERBIZ – MVP Starter

Mobile‑first, bilingual (ES/EN) services directory for Costa Rica.  
Tech: Next.js 14 (App Router) + Tailwind + Prisma (Postgres) + iron-session auth.

## Quick start

1) Install deps
```bash
pnpm install   # or npm i / yarn
```

2) Set up env
```bash
cp .env.example .env
# edit .env with your DB URL and secrets
```

3) Migrate & seed
```bash
pnpm db:migrate
pnpm db:seed
```

4) Run
```bash
pnpm dev
# http://localhost:3000
```

### Login

- Admin: username `serbizadmin1`, password `SERBIZ09!` (seeded from .env)

### Notes

- Contact cap: 3 per week per vendor. When exceeded, users are redirected to your sales WhatsApp with a prefilled message.
- The search is a simple LIKE-based MVP. You can upgrade to pg_trgm later.
- Category seed is short in this first dump; extend `prisma/seed.ts` with your full list.
