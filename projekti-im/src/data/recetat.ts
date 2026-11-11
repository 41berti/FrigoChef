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

// Të dhënat që dërgon forma. Id-në dhe krijuar_me i vendos vetë Supabase.
export type ReceteERe = Pick<Receta, "titulli" | "koha_minuta" | "perberesit" | "hapat">;

// Shton një recetë. Policy "shtim publik" e refuzon nëse s'i plotëson kufijtë.
export function shtoReceten(receta: ReceteERe) {
  return supabase.from("recetat").insert(receta);
}

// Recetat bazë të aplikacionit. Policy "fshirje publike" në Supabase nuk e lejon
// fshirjen e tyre, prandaj as aplikacioni nuk e tregon butonin e fshirjes për to.
const RECETAT_BAZE = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function eshteReceteBaze(id: string): boolean {
  return RECETAT_BAZE.includes(id);
}

// Fshin një recetë. select("id") i kthen rreshtat që u fshinë vërtet.
// Kur policy e refuzon fshirjen, Supabase nuk jep gabim, por kthen listë bosh.
export function fshiReceten(id: string) {
  return supabase.from("recetat").delete().eq("id", id).select("id");
}
