// Përbërësit që dalin si chip-a te Ballina, të ndarë në grupe si në skicën 1.
// Shkruhen me shkronja të vogla, njësoj si te kolona `perberesit` në Supabase,
// sepse përputhja me recetat bëhet duke i krahasuar si tekst.
export type GrupPerberesish = {
  titulli: string;
  perberesit: string[];
};

export const grupetEPerberesve: GrupPerberesish[] = [
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
];

// Të gjithë përbërësit e grupeve në një listë të vetme.
export const perberesitEGrupeve: string[] = grupetEPerberesve.flatMap(
  (grupi) => grupi.perberesit
);
