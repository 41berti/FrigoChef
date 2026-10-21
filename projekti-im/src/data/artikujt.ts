// Çdo "artikull" është një recetë që aplikacioni e rekomandon pasi skanon frigoriferin.
// Për këtë javë të dhënat janë të shpikura (nuk ka kamerë apo API ende).
export type Artikull = {
  id: string;
  titulli: string;
  pershkrimi: string;
  perberesit: string[];
  kohaMinuta: number;
};

export const artikujt: Artikull[] = [
  {
    id: "1",
    titulli: "Omëletë me perime",
    pershkrimi:
      "Një mëngjes i shpejtë që përdor perimet që kanë mbetur në frigorifer. Rrihni vezët me pak qumësht, skuqni lehtë qepën, specat dhe domatet, hidhni vezët sipër dhe shtoni djathin e thërrmuar derisa omëleta të piqet.",
    perberesit: ["vezë", "qumësht", "speca", "domate", "qepë", "djathë i bardhë"],
    kohaMinuta: 15,
  },
  {
    id: "2",
    titulli: "Fërgesë me speca dhe gjizë",
    pershkrimi:
      "Gatim tradicional i Tiranës, i butë dhe kremoz, që shërbehet me bukë të ngrohtë. Kaurdisni qepën dhe hudhrën në gjalpë, shtoni specat dhe domatet e prera, lërini të ziejnë 15 minuta, pastaj përzieni gjizën derisa salca të trashet.",
    perberesit: ["speca", "domate", "gjizë", "gjalpë", "qepë", "hudhër"],
    kohaMinuta: 30,
  },
  {
    id: "3",
    titulli: "Tavë kosi me pulë",
    pershkrimi:
      "Versioni me pulë i tavës së njohur të Elbasanit, me një kore të artë kosi sipër. Skuqni pulën në gjalpë, vendoseni në tavë mbi pak oriz, rrihni kosin me vezët dhe miellin, hidheni sipër dhe piqeni në furrë rreth 40 minuta.",
    perberesit: ["mish pule", "kos", "vezë", "gjalpë", "miell", "oriz"],
    kohaMinuta: 60,
  },
  {
    id: "4",
    titulli: "Sallatë me djathë",
    pershkrimi:
      "Sallatë e freskët fshati, e mirë si pjatë e lehtë ose si shoqëruese. Prisni domatet, kastravecin dhe qepën, shtoni ullinjtë dhe djathin e thërrmuar, pastaj hidhni kripë dhe vaj ulliri sipër.",
    perberesit: ["domate", "kastravec", "qepë", "djathë i bardhë", "ullinj", "vaj ulliri"],
    kohaMinuta: 10,
  },
  {
    id: "5",
    titulli: "Oriz i skuqur me perime dhe vezë",
    pershkrimi:
      "Mënyra më e mirë për të përdorur orizin e mbetur nga dita e djeshme. Skuqni karotën dhe bizelet në vaj, shtoni orizin e ftohtë, thyeni vezët në mes të tiganit, përzieni të gjitha dhe në fund hidhni qepën e njomë.",
    perberesit: ["oriz i mbetur", "vezë", "karotë", "bizele", "qepë e njomë", "vaj"],
    kohaMinuta: 20,
  },
  {
    id: "6",
    titulli: "Supë pule me limon",
    pershkrimi:
      "Supë e ngrohtë dhe e lehtë, si ajo që bëhet në shtëpi në ditët e ftohta. Zieni pulën me karotën dhe qepën, shtoni orizin, pastaj rrihni vezën me lëng limoni, përzieni me pak lëng supe dhe hidheni në tenxhere duke e trazuar.",
    perberesit: ["mish pule", "oriz", "karotë", "qepë", "vezë", "limon"],
    kohaMinuta: 35,
  },
  {
    id: "7",
    titulli: "Kungulleshka me salcë kosi",
    pershkrimi:
      "Meze verore e shpejtë, krokante nga jashtë dhe e butë nga brenda. Prisni kungullin në rrathë, kalojeni në miell dhe vezë, skuqeni në vaj të nxehtë dhe shërbejeni me kos të përzier me hudhër të grirë.",
    perberesit: ["kungull i njomë", "vezë", "miell", "kos", "hudhër", "vaj"],
    kohaMinuta: 25,
  },
  {
    id: "8",
    titulli: "Pulë me perime në furrë",
    pershkrimi:
      "Darkë e thjeshtë në një tavë të vetme, pa shumë enë për të larë. Prisni pulën dhe perimet në copa, përzieni me vaj ulliri, kripë dhe piper, shtrojini në tavë dhe piqini në 200°C rreth 40 minuta.",
    perberesit: ["mish pule", "speca", "karotë", "qepë", "hudhër", "vaj ulliri"],
    kohaMinuta: 45,
  },
];

// Id-ja vjen nga URL-ja si tekst, prandaj e krahasojmë si tekst (pa Number apo parseInt).
export function gjeArtikullin(id: string): Artikull | undefined {
  return artikujt.find((a) => a.id === id);
}
