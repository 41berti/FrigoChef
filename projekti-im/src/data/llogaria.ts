import type { Celesi } from "@/i18n/perkthimi";
import { supabase } from "@/data/supabase";

export async function kycu(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
}

export async function regjistrohu(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return { duhetKonfirmim: !data.session };
}

export async function dilNgaLlogaria() {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw error;
}

export function validoLlogarine(
  email: string,
  password: string,
  regjistrim: boolean,
  perseritja = "",
): Celesi | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "auth.invalidEmail";
  if (!password) return "auth.needPassword";
  if (regjistrim && password.length < 8) return "auth.shortPassword";
  if (regjistrim && password !== perseritja) return "auth.mismatch";
  return null;
}

export function mesazhiIGabimit(error: unknown): Celesi {
  const kodi = typeof error === "object" && error !== null && "code" in error ? error.code : null;
  switch (kodi) {
    case "invalid_credentials":
      return "auth.invalidCredentials";
    case "email_not_confirmed":
      return "auth.unconfirmed";
    case "user_already_exists":
      return "auth.exists";
    case "weak_password":
      return "auth.weak";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "auth.rateLimit";
    case "signup_disabled":
      return "auth.disabled";
    case "session_not_found":
    case "refresh_token_not_found":
      return "auth.expired";
    default:
      return "auth.failed";
  }
}
