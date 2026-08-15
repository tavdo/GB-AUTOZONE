# Deploy + Turso

## Turso is live

Schema + seed applied to:
`libsql://gb-autozone-tavdo.aws-ap-northeast-1.turso.io`

Re-apply locally if needed:
```bash
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script -o prisma/turso-schema.sql
npx tsx scripts/push-turso.ts
npx tsx prisma/seed.ts
```

## Vercel env vars (required)

| Name | Value |
|------|--------|
| `USE_MOCK_DATA` | `false` |
| `TURSO_DATABASE_URL` | `libsql://gb-autozone-tavdo.aws-ap-northeast-1.turso.io` |
| `TURSO_AUTH_TOKEN` | your Turso token |
| `AUTH_SECRET` | long random string |
| `AUTH_URL` | `https://YOUR.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | same |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | admin login |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional |
| `NEXT_PUBLIC_PHONE` | optional |

After saving env vars → **Redeploy**.
