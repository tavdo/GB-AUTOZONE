# Deploy on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com/new)
2. Framework: **Next.js** (auto-detected)
3. Add Environment Variables:

| Name | Value |
|------|--------|
| `USE_MOCK_DATA` | `true` |
| `AUTH_SECRET` | long random string ([generate](https://generate-secret.vercel.app/32)) |
| `AUTH_URL` | `https://YOUR-PROJECT.vercel.app` |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | strong password |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional |
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | optional |
| `NEXT_PUBLIC_PHONE` | optional |

4. Deploy

**Note:** With `USE_MOCK_DATA=true`, catalog edits in admin work in-memory on the server instance (they may reset on cold starts). For permanent data, connect Postgres later (`DATABASE_URL` + `USE_MOCK_DATA=false`).
