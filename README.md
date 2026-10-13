# BisonsEduCore360 Admin

Platform console for BisonsTechs operators. View registered schools and subscription status.

## Allowed login

Only this account can sign in (configured on the **API** via env vars — not in the admin frontend):

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

## Local setup

```bash
npm install
# .env.local → API_URL=http://localhost:5000/api
npm run dev
```

Backend must expose `/api/platform/*` (see `bisonseducore360_backend`). Restart the API after changing `PLATFORM_ADMIN_*` vars.
