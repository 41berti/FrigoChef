import { createClient } from "@supabase/supabase-js";

// Vlerat vijnë nga projekti-im/.env. Prefiksi EXPO_PUBLIC_ i fut brenda aplikacionit,
// prandaj këtu shkon vetëm çelësi publik, kurrë service_role.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

// Aplikacioni s'ka ende login, prandaj sesionin nuk e ruajmë.
// Kështu nuk na duhet paketë shtesë për ruajtje.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
