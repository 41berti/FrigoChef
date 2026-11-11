import { supabase } from "@/data/supabase";

// Një rresht i tabelës `recetat` në Supabase.
export type Receta = {
  id: string;
  titulli: string;
  koha_minuta: number;
};

// Kërkon të gjitha recetat nga Supabase. Përgjigjja ka `data` (recetat) ose `error`.
export function merrRecetat() {
  return (
    supabase
      .from("recetat")
      .select("id, titulli, koha_minuta")
      // Më të rejat në krye. Recetat me të njëjtën kohë renditen sipas titullit.
      .order("krijuar_me", { ascending: false })
      .order("titulli")
  );
}
