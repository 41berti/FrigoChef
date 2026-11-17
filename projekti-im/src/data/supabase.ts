import { createClient } from "@supabase/supabase-js";

import { ruajtjaESesionit } from "@/data/ruajtjaESesionit";

// Vlerat vijnë nga projekti-im/.env. Prefiksi EXPO_PUBLIC_ i fut brenda aplikacionit,
// prandaj këtu shkon vetëm çelësi publik, kurrë service_role.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ruajtjaESesionit,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
