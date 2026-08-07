// Centralized API configuration.
// VITE_API_URL is read from .env - falls back to localhost for local dev.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// TEMPORARY: Using a fixed test user until a real login/signup flow is built.
// This is the Supabase Auth user created for testing - replace this with
// the logged-in user's real ID once auth is implemented.
export const TEMP_USER_ID = '9cc45ccc-b2d1-4207-8b01-cec802e67c00';