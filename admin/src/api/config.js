// Base URL for API calls.
// Production: empty string = same origin (the Java server serves both the admin app and the API).
// Local dev:  set VITE_API_BASE_URL=http://localhost:8080 (see .env.development).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
