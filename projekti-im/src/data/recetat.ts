import { supabase } from "@/data/supabase";

// Një rresht i tabelës `recetat` në Supabase.
export type Receta = {
  id: string;
  titulli: string;
  koha_minuta: number;
  perberesit: string[];
  hapat: string[];
  // Ende pa foto: kolona ekziston, por mbetet bosh (null).
  foto_url: string | null;
};

// Kolonat që lexojmë. Janë në një vend, që lista dhe detajet të marrin të njëjtat të dhëna.
const KOLONAT = "id, titulli, koha_minuta, perberesit, hapat, foto_url";

// Kërkon të gjitha recetat nga Supabase. Përgjigjja ka `data` (recetat) ose `error`.
export function merrRecetat() {
  return (
    supabase
      .from("recetat")
      .select(KOLONAT)
      // Më të rejat në krye. Recetat me të njëjtën kohë renditen sipas titullit.
      .order("krijuar_me", { ascending: false })
      .order("titulli")
  );
}

// Kërkon një recetë sipas id-së. Id-ja vjen nga URL-ja si tekst dhe krahasohet si tekst.
// maybeSingle() kthen `data: null` kur s'ka rresht me atë id, pa e trajtuar si gabim.
export function merrReceten(id: string) {
  return supabase.from("recetat").select(KOLONAT).eq("id", id).maybeSingle();
}
