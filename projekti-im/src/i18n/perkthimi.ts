import { I18n } from "i18n-js";

import en from "./en";
import sq from "./sq";

type Fjalori = typeof sq;
export type Gjuha = "sq" | "en";
export type Celesi = {
  [G in keyof Fjalori]: `${G}.${keyof Fjalori[G] & string}`;
}[keyof Fjalori];
export type Perkthe = (celesi: Celesi, vlera?: Record<string, string | number>) => string;

const i18n = new I18n({ sq, en }, { defaultLocale: "sq", enableFallback: true });

export function perkthyesi(gjuha: Gjuha): Perkthe {
  return (celesi, vlera) => i18n.t(celesi, { ...vlera, locale: gjuha });
}
