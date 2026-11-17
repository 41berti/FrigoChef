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
) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Shkruaj një adresë email-i të vlefshme.";
  if (!password) return "Shkruaj fjalëkalimin.";
  if (regjistrim && password.length < 8) return "Përdor së paku 8 karaktere për fjalëkalimin.";
  if (regjistrim && password !== perseritja) return "Fjalëkalimet nuk përputhen.";
  return null;
}

export function mesazhiIGabimit(error: unknown): string {
  const kodi = typeof error === "object" && error !== null && "code" in error ? error.code : null;
  switch (kodi) {
    case "invalid_credentials":
      return "Email-i ose fjalëkalimi nuk është i saktë.";
    case "email_not_confirmed":
      return "Konfirmo email-in nga lidhja që të dërguam, pastaj kyçu përsëri.";
    case "user_already_exists":
      return "Regjistrimi nuk u krye. Provo të kyçesh me këtë email.";
    case "weak_password":
      return "Zgjidh një fjalëkalim më të fortë sipas kërkesave të llogarisë.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Ka shumë kërkesa. Prit pak dhe provo përsëri.";
    case "signup_disabled":
      return "Regjistrimi është përkohësisht i mbyllur.";
    case "session_not_found":
    case "refresh_token_not_found":
      return "Sesioni ka përfunduar. Kyçu përsëri.";
    default:
      return "Veprimi nuk u krye. Kontrollo lidhjen me internetin dhe provo përsëri.";
  }
}
