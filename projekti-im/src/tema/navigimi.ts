import { DarkTheme, DefaultTheme, type Theme } from "expo-router";
import { usePreferencat } from "@/gjendja/preferencat";

import { useNgjyrat } from "@/tema/tema";

// Tema për navigimin: sfondi i ekraneve, header-at dhe ngjyra e butonit "prapa".
// Nis nga tema e gatshme e Expo Router-it dhe ia ndërron ngjyrat me tonat.
export function useTemaENavigimit(): Theme {
  const ngjyrat = useNgjyrat();
  const baza = usePreferencat().tema === "dark" ? DarkTheme : DefaultTheme;

  return {
    ...baza,
    colors: {
      ...baza.colors,
      primary: ngjyrat.primareTeksti,
      background: ngjyrat.sfondi,
      card: ngjyrat.sfondi,
      text: ngjyrat.teksti,
      border: ngjyrat.kufiri,
    },
  };
}
