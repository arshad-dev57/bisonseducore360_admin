/**
 * Browser always calls the same-origin Next proxy (`/backend-api/...`).
 * That route forwards to the real API using server-only `API_URL`.
 * No CORS setup needed for Vercel ↔ Railway.
 */
export const API_URL = "/backend-api";

export const TOKEN_KEY = "bisons_platform_token";
