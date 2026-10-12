# BisonsEduCore360 Admin

Platform console for BisonsTechs operators. View registered schools and subscription status.

## Allowed logins

Only these emails can sign in (configured on the API via `PLATFORM_ADMIN_EMAILS`):

- `mfaisala@gmail.com`
- `arshadnasir21@gmail.com`
- `adminbisonseducore360@gmail.com`

Default password (API `PLATFORM_ADMIN_PASSWORD`): `BisonsAdmin@360`

## Local setup

```bash
npm install
# .env.local → NEXT_PUBLIC_API_URL=http://localhost:5001/api
npm run dev
```

Backend must expose `/api/platform/*` (see `bisonseducore360_backend`).
