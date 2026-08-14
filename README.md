# GB Autozone

E-commerce site for American vehicle import and auto parts (Georgia + regional buyers).

**Stack:** Next.js (App Router) · TypeScript · Tailwind · Prisma · next-intl (ka/en/ru)

## Quick start

```bash
npm install
cp .env.example .env   # USE_MOCK_DATA=true works without Postgres
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → redirects to `/ka`.

## Admin panel

Open [http://localhost:3000/ka/admin/login](http://localhost:3000/ka/admin/login)

Default credentials (change in `.env`):
- Email: `admin@gbautozone.ge`
- Password: `admin123`

CRUD for cars & parts, order status, inquiries. Data persists in `data/store.json` while `USE_MOCK_DATA=true`.

## What’s built

- Prisma schema (Cars, Parts, Orders, Users, Inquiries, …)
- i18n routes: `/ka`, `/en`, `/ru`
- Home, cars/parts catalogs + detail pages
- Admin dashboard (create / edit / delete)
- Request-quote → inquiries inbox
- WhatsApp / Telegram float buttons
- SEO: metadata, sitemap, product/car JSON-LD

## Next phases

1. Cart + Stripe checkout (test) — note TBC ePay / BOG for GE production
2. Customer accounts (NextAuth)
3. S3-compatible image uploads + Resend emails

## Database

1. Set a real `DATABASE_URL` (`postgresql://…`)
2. Set `USE_MOCK_DATA=false`
3. `npx prisma migrate dev --name init`
4. `npx prisma db seed`
