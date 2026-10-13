# BisonsEduCore360 Admin

Platform console for BisonsTechs operators. View registered schools and subscription status.

## Allowed login

Only this account can sign in (configured on the **API** via env vars):

| Field | Value |
|-------|--------|
| Email | `adminbisonseducore360@gmail.com` |
| Password | `BisonsAdmin@360` |

Backend env:

```bash
PLATFORM_ADMIN_EMAILS=adminbisonseducore360@gmail.com
PLATFORM_ADMIN_PASSWORD=BisonsAdmin@360
PLATFORM_COOKIE_NAME=bisons_platform_session
```

## How API calls work (no CORS)

The browser talks only to this Next app (`/backend-api/...`).  
`app/backend-api/[...path]` proxies to Railway using server-only `API_URL`.  
You do **not** need to add the admin Vercel URL to backend `CORS_ORIGINS`.

## Local setup

```bash
npm install
# .env.local → API_URL=http://localhost:5000/api
npm run dev
```

## Vercel env

```bash
API_URL=https://YOUR-RAILWAY-API.up.railway.app/api
```

Server-only (no `NEXT_PUBLIC_`). Redeploy after changing it.
