import katalogu from "./katalogu-perberesve.json";
import type { Gjuha } from "../i18n/perkthimi";

export const kategoriteEPerberesve = [
  "meat", "dairy", "vegetables", "fruit", "grains", "herbs", "oils", "other",
] as const;

export type KategoriaPerberesit = (typeof kategoriteEPerberesve)[number];
export type Perberes = {
  id: string;
  category: string;
  names: Record<Gjuha, string>;
  aliases: Record<Gjuha, string[]>;
  emoji: string;
  illustration?: string;
};

export const perberesitEKatalogut: readonly Perberes[] = katalogu.ingredients;

// Përdoret për krahasim. Emri i ruajtur në recetë dhe ai që sheh përdoruesi mbeten origjinalë.
export function normalizoEmrin(teksti: string): string {
  return teksti
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]+/g, " ")
    .trim();
}

const sipasId = new Map(perberesitEKatalogut.map((perberesi) => [perberesi.id, perberesi]));
const sipasEmrit = new Map<string, Perberes>();
const indeksiIKerkimit = perberesitEKatalogut.map((perberesi) => {
  const emrat = [
    perberesi.id, perberesi.names.sq, perberesi.names.en,
    ...perberesi.aliases.sq, ...perberesi.aliases.en,
  ].map(normalizoEmrin);
  for (const emri of emrat) sipasEmrit.set(emri, perberesi);
  return { perberesi, emrat };
});

export function perberesiMeId(id: string): Perberes | undefined {
  return sipasId.get(id);
}

// Recetat dhe etiketat e modeleve kërkojnë përputhje të plotë me një emër, alias ose ID.
export function gjejPerberesin(etiketa: string): Perberes | undefined {
  return sipasEmrit.get(normalizoEmrin(etiketa));
}

export function celesiIPerberesit(teksti: string): string {
  return gjejPerberesin(teksti)?.id ?? `custom:${normalizoEmrin(teksti)}`;
}

// Kërkimi në UI pranon fjalë të pjesshme dhe kërkon në të dyja gjuhët njëkohësisht.
export function kerkoPerberesit(
  kerkimi: string,
  kategoria?: KategoriaPerberesit,
): Perberes[] {
  const fjalet = normalizoEmrin(kerkimi).split(" ").filter(Boolean);
  return indeksiIKerkimit
    .filter(({ perberesi, emrat }) =>
      (!kategoria || perberesi.category === kategoria)
      && fjalet.every((fjala) => emrat.some((emri) => emri.includes(fjala)))
    )
    .map(({ perberesi }) => perberesi);
}
