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
  // Mungon vetëm para migrimit; këto receta nuk trajtohen si pronë e përdoruesit.
  pronari_id?: string | null;
};

// Tabela përmban vetëm të dhënat publike të recetës. `*` lejon leximin edhe
// para migrimit të pronarit; shkrimet nuk kanë rrugë rezervë anonime.
const KOLONAT = "*";

// Kërkon të gjitha recetat nga Supabase. Përgjigjja ka `data` (recetat) ose `error`.
export function merrRecetat() {
  return (
    supabase
      .from("recetat")
      .select(KOLONAT)
      .returns<Receta[]>()
      // Më të rejat në krye. Recetat me të njëjtën kohë renditen sipas titullit.
      .order("krijuar_me", { ascending: false })
      .order("titulli")
  );
}

// Kërkon një recetë sipas id-së. Id-ja vjen nga URL-ja si tekst dhe krahasohet si tekst.
// maybeSingle() kthen `data: null` kur s'ka rresht me atë id, pa e trajtuar si gabim.
export function merrReceten(id: string) {
  return supabase.from("recetat").select(KOLONAT).eq("id", id).maybeSingle<Receta>();
}

// Të dhënat që dërgon forma. Id-në dhe krijuar_me i vendos vetë Supabase.
export type ReceteERe = Pick<Receta, "titulli" | "koha_minuta" | "perberesit" | "hapat">;

// Identiteti verifikohet te Auth. UI-ja nuk zgjedh pronar; RLS e kontrollon përsëri.
export async function shtoReceten(receta: ReceteERe) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { error: { message: "Kyçu për të shtuar një recetë." } };
  return supabase.from("recetat").insert({
    titulli: receta.titulli,
    koha_minuta: receta.koha_minuta,
    perberesit: receta.perberesit,
    hapat: receta.hapat,
    pronari_id: user.id,
  });
}

// Recetat bazë të aplikacionit. Policy e pronarit në Supabase nuk e lejon
// fshirjen e tyre, prandaj as aplikacioni nuk e tregon butonin e fshirjes për to.
const RECETAT_BAZE = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function eshteReceteBaze(id: string): boolean {
  return RECETAT_BAZE.includes(id);
}

// Ky kontroll është për pamjen. Sigurinë e zbaton RLS-ja në databazë.
export function mundTeFshihet(receta: Pick<Receta, "id" | "pronari_id">, userId?: string): boolean {
  return !!userId && receta.pronari_id === userId && !eshteReceteBaze(receta.id);
}

// select("id") i kthen rreshtat që u fshinë vërtet; RLS mund të kthejë listë bosh.
export async function fshiReceten(id: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user || eshteReceteBaze(id)) {
    return {
      data: null,
      error: { message: "Kjo recetë nuk mund të fshihet nga kjo llogari." },
    };
  }
  return supabase.from("recetat").delete().eq("id", id).eq("pronari_id", user.id).select("id");
}
