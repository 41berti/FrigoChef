import en from "../i18n/en";

// Përbërësit që dalin si chip-a te Ballina, të ndarë në grupe si në skicën 1.
// Shkruhen me shkronja të vogla, njësoj si te kolona `perberesit` në Supabase,
// sepse përputhja me recetat bëhet duke i krahasuar si tekst.
export const grupetEPerberesve = [
  {
    titulli: "Më të zakonshmit",
    perberesit: ["vezë", "djathë i bardhë", "domate", "speca", "qepë", "qumësht", "kos", "gjizë"],
  },
  {
    titulli: "Mish dhe drithëra",
    perberesit: ["mish pule", "oriz", "miell", "gjalpë"],
  },
  {
    titulli: "Perime dhe fruta",
    perberesit: ["karotë", "kastravec", "hudhër", "kungull i njomë", "bizele", "limon"],
  },
] as const;

// Të gjithë përbërësit e grupeve në një listë të vetme.
type Perberes = (typeof grupetEPerberesve)[number]["perberesit"][number];
export const perberesitEGrupeve = grupetEPerberesve.flatMap<Perberes>(
  (grupi) => grupi.perberesit
);

// Vetëm emrat e katalogut kanë sinonime të njohura. Receta ruan tekstin e autorit.
const sipasEmrit = new Map<string, Perberes>();
for (const emri of perberesitEGrupeve) {
  sipasEmrit.set(emri, emri);
  sipasEmrit.set(en.pantry[emri], emri);
}

export function celesiIPerberesit(teksti: string) {
  const emri = teksti.trim().toLowerCase();
  return sipasEmrit.get(emri) ?? emri;
}
