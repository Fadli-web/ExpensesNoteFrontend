export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pvalyovfpngfeavzxwct.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2YWx5b3ZmcG5nZmVhdnp4d2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Mjg3ODcsImV4cCI6MjEwNDIwNDc4N30.ptJsvMXcCqrN0oHAA9SxfZQDYskyEe42c5mWa9BL2A4";

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "145083384658-p4ehf9h0o6lj0pri55d4kkncdt92ego9.apps.googleusercontent.com";

/**
 * Membangun URL otentikasi Google OAuth 2.0 resmi menggunakan Client ID pengguna
 */
export function getGoogleOAuthUrl(redirectTo?: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const targetCallback = redirectTo || `${origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: targetCallback,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Langsung redirect browser ke Google OAuth 2.0 Consent Screen
 */
export function redirectToGoogleAuth(redirectTo?: string) {
  if (typeof window === "undefined") return;
  const url = getGoogleOAuthUrl(redirectTo);
  window.location.href = url;
}
