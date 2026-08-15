# Deploy + Turso

## Vercel env vars

| Name | Value |
|------|--------|
| `USE_MOCK_DATA` | `false` (once Turso works) |
| `TURSO_DATABASE_URL` | `libsql://gb-autozone-tavdo.aws-ap-northeast-1.turso.io` |
| `TURSO_AUTH_TOKEN` | from Turso dashboard |
| `DATABASE_URL` | `file:./prisma/dev.db` (migrate only) |
| `AUTH_SECRET` | long random string |
| `AUTH_URL` | `https://YOUR.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | same as AUTH_URL |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | admin login |

## Apply schema to Turso

1. Create token in [Turso](https://turso.tech) dashboard for `gb-autozone`
2. Put URL + token in `.env`
3. Locally:

```bash
npx prisma db push
# or: generate SQL via local migrate, then:
# turso db shell gb-autozone < prisma/migrations/.../migration.sql

npx tsx prisma/seed.ts
```

4. Set Vercel env → Redeploy

Until `TURSO_AUTH_TOKEN` is set, the app keeps using mock JSON data (`USE_MOCK_DATA=true`).
