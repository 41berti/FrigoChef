import type { Receta } from "@/data/recetat";

// Sa mirë përputhet një recetë me përbërësit që ka zgjedhur përdoruesi.
export type Perputhje = {
  receta: Receta;
  // Përbërësit e recetës që përdoruesi i ka.
  ke: string[];
  // Përbërësit e recetës që i mungojnë.
  mungojne: string[];
};

// I ndan përbërësit e një recete në dy lista: ata që i ke dhe ata që mungojnë.
// Krahasimi bëhet me shkronja të vogla, që "Vezë" dhe "vezë" të jenë i njëjti përbërës.
export function ndajPerberesit(perberesit: string[], zgjedhur: string[]) {
  const eKa = (perberesi: string) => zgjedhur.includes(perberesi.toLowerCase());

  return {
    ke: perberesit.filter((perberesi) => eKa(perberesi)),
    mungojne: perberesit.filter((perberesi) => !eKa(perberesi)),
  };
}

// Teksti nën shiritin e kartelës. P.sh. "mungon: kastravec, ullinj +1":
// dy të parët dalin me emër, të tjerët vetëm si numër.
export function tekstiIMungeses(mungojne: string[]): string {
  if (mungojne.length === 0) {
    return "I ke të gjithë përbërësit";
  }

  const tePare = mungojne.slice(0, 2).join(", ");
  const tjere = mungojne.length - 2;

  return tjere > 0 ? `mungon: ${tePare} +${tjere}` : `mungon: ${tePare}`;
}

// Pjesa e përbërësve të recetës që përdoruesi i ka, nga 0 deri në 1.
function pjesaQeKe(perputhja: Perputhje): number {
  return perputhja.ke.length / perputhja.receta.perberesit.length;
}

// Kthen recetat që kanë së paku një përbërës të zgjedhur, të renditura:
// 1) së pari ato që i ke më të plota, 2) pastaj ato me më shumë përbërës që ke,
// 3) dhe në fund ato që gatuhen më shpejt.
export function gjejPerputhjet(recetat: Receta[], zgjedhur: string[]): Perputhje[] {
  return (
    recetat
      .map((receta) => ({ receta, ...ndajPerberesit(receta.perberesit, zgjedhur) }))
      // Receta pa asnjë përbërës të zgjedhur nuk i hyn në punë përdoruesit.
      .filter((perputhja) => perputhja.ke.length > 0)
      // sort pret numër negativ kur `a` duhet të dalë para `b`.
      // `||` kalon te rregulli tjetër vetëm kur dy recetat janë baras (ndryshimi 0).
      .sort(
        (a, b) =>
          pjesaQeKe(b) - pjesaQeKe(a) ||
          b.ke.length - a.ke.length ||
          a.receta.koha_minuta - b.receta.koha_minuta
      )
  );
}
