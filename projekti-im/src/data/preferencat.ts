import type { Gjuha } from "../i18n/perkthimi";

export type Pamja = "system" | "light" | "dark";
export type Preferenca = { gjuha: Gjuha | null; pamja: Pamja };
export const fillestare: Preferenca = { gjuha: null, pamja: "system" };

export function gjuhaEPajisjes(kodet: (string | null)[]): Gjuha {
  return kodet.find((kod) => kod === "en" || kod === "sq") ?? "sq";
}

export function temaEfektive(pamja: Pamja, sistemi: string | null | undefined) {
  return pamja === "system" ? (sistemi === "dark" ? "dark" : "light") : pamja;
}

export function lexoPreferencat(teksti: string | null): Preferenca {
  if (!teksti) return fillestare;
  try {
    const v = JSON.parse(teksti);
    return {
      gjuha: v?.gjuha === "en" || v?.gjuha === "sq" ? v.gjuha : null,
      pamja: v?.pamja === "light" || v?.pamja === "dark" ? v.pamja : "system",
    };
  } catch {
    return fillestare;
  }
}

export function krijoRuajtjen<T = Preferenca>(ruaj: (v: string) => Promise<void>) {
  let radha = Promise.resolve();
  return (v: T) => {
    const shkrimi = radha.then(() => ruaj(JSON.stringify(v)));
    radha = shkrimi.catch(() => {});
    return shkrimi;
  };
}
