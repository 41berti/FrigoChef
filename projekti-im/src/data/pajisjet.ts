// ID-të tregojnë pajisjen. Emrat dhe ilustrimet mund të ndryshohen veçmas.
export const kataloguIPajisjeve = [
  { id: "oven", names: { sq: "Furrë", en: "Oven" },
    aliases: { sq: ["furrë pjekjeje"], en: ["conventional oven"] }, visual: "oven" },
  { id: "stovetop", names: { sq: "Pllakë gatimi", en: "Stovetop" },
    aliases: { sq: ["pllakë kuzhine"], en: ["hob", "cooktop"] }, visual: "cooktop" },
  { id: "air-fryer", names: { sq: "Fritezë me ajër", en: "Air fryer" },
    aliases: { sq: ["fërguese me ajër"], en: ["airfryer"] }, visual: "air-fryer" },
  { id: "microwave", names: { sq: "Mikrovalë", en: "Microwave" },
    aliases: { sq: ["furrë me mikrovalë"], en: ["microwave oven"] }, visual: "microwave" },
  { id: "blender", names: { sq: "Blender", en: "Blender" },
    aliases: { sq: ["blender me kanatë"], en: ["jug blender"] }, visual: "jug-blender" },
  { id: "toaster", names: { sq: "Thekëse buke", en: "Toaster" },
    aliases: { sq: ["toster"], en: ["bread toaster"] }, visual: "toaster" },
  { id: "grill", names: { sq: "Skarë", en: "Grill" },
    aliases: { sq: ["zgarë"], en: ["barbecue", "BBQ"] }, visual: "kettle-grill" },
  { id: "slow-cooker", names: { sq: "Tenxhere për gatim të ngadaltë", en: "Slow cooker" },
    aliases: { sq: ["tenxhere e ngadaltë"], en: ["crockpot"] }, visual: "slow-cooker" },
  { id: "pressure-cooker", names: { sq: "Tenxhere me presion", en: "Pressure cooker" },
    aliases: { sq: ["tenxhere ekspres"], en: [] }, visual: "pressure-pot" },
  { id: "rice-cooker", names: { sq: "Tenxhere orizi", en: "Rice cooker" },
    aliases: { sq: ["tenxhere për oriz"], en: [] }, visual: "rice-cooker" },
  { id: "electric-kettle", names: { sq: "Çajnik elektrik", en: "Electric kettle" },
    aliases: { sq: ["ibrik elektrik"], en: ["kettle"] }, visual: "electric-kettle" },
  { id: "food-processor", names: { sq: "Përpunues ushqimi", en: "Food processor" },
    aliases: { sq: ["robot kuzhine"], en: ["kitchen processor"] }, visual: "food-processor" },
] as const;

export type IdPajisjeje = (typeof kataloguIPajisjeve)[number]["id"];

// Filtrimi sipas katalogut heq dublikatat dhe jep një rend të qëndrueshëm.
export function normalizoPajisjet(vlera: readonly unknown[]): IdPajisjeje[] {
  const ids = new Set(vlera);
  return kataloguIPajisjeve.filter(({ id }) => ids.has(id)).map(({ id }) => id);
}
